import { Router } from "express";
import { getAuth } from "@clerk/express";
import Groq from "groq-sdk";

const router = Router();

// Lazy-initialize the Groq client so a missing key at startup doesn't crash
// the entire server. The key is validated at request time instead.
let _groq: Groq | null = null;
function getGroqClient(): Groq {
  if (!_groq) {
    const apiKey = process.env["GROQ_API_KEY"];
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set");
    }
    _groq = new Groq({ apiKey });
  }
  return _groq;
}

const SYSTEM_PROMPT = `You are Medmate, a friendly and knowledgeable AI health assistant embedded in the Medmate mobile app.

IoT device integration is not connected yet, so you do not have access to the user's live sensor readings at this time. Do not make up or assume any health numbers.

Guidelines:
- Be warm, conversational, and supportive — chat naturally like a knowledgeable health companion.
- Answer general health questions clearly and helpfully.
- When asked about personal readings or metrics, let the user know their IoT devices aren't connected yet and encourage them to set that up.
- Never diagnose or prescribe — suggest they consult a doctor for medical concerns.
- Keep replies concise (under 3 short paragraphs) unless the user asks for more detail.
- Do not use markdown formatting like ** or ## — plain text only.`;

function requireAuth(req: any, res: any, next: any) {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.userId = userId;
  next();
}

router.post("/chat", requireAuth, async (req, res) => {
  try {
    const { messages } = req.body as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages array is required" });
      return;
    }

    const completion = await getGroqClient().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-20), // keep last 20 turns for context
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? "Sorry, I could not generate a response.";
    res.json({ reply });
  } catch (err: any) {
    console.error("Groq error:", err?.message ?? err);
    res.status(500).json({ error: "AI service unavailable. Please try again." });
  }
});

export default router;
