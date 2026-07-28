import { Router } from "express";
import Groq from "groq-sdk";

const router = Router();

const groq = new Groq({ apiKey: process.env["GROQ_API_KEY"] });

// System prompt with IoT context
const SYSTEM_PROMPT = `You are Medmate, a friendly and knowledgeable AI health assistant embedded in the Medmate mobile app.
You have access to the user's latest IoT device readings:
- Blood Pressure: 120/80 mmHg (normal)
- Heart Rate: 72 bpm (normal)
- SpO2 (Blood Oxygen): 98% (excellent)
- Blood Glucose: 95 mg/dL (normal fasting range)
- Body Temperature: 36.8°C (normal)
- Weight: 70 kg
- Height: 175 cm (BMI ~22.9 - healthy)

Guidelines:
- Be concise, warm, and supportive. Keep replies under 3 short paragraphs unless the user asks for detail.
- Reference their actual readings when relevant.
- Never diagnose or prescribe — suggest they consult a doctor for medical concerns.
- If asked about something unrelated to health, gently redirect.
- Do not use markdown formatting like ** or ## — use plain text only.`;

router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages array is required" });
      return;
    }

    const completion = await groq.chat.completions.create({
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
