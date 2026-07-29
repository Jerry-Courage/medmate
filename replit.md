# Medmate — Health AI Assistant

A health-focused mobile app with an AI chat companion (Medmate), built with Expo React Native and an Express API backend.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/health-ai run dev` — run the Expo app (port 20530, web preview)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- Mobile: Expo SDK 54, Expo Router, React Native
- API: Express 5 + Clerk JWT auth (`@clerk/express`)
- DB: PostgreSQL + Drizzle ORM (schema in `lib/db/src/schema/index.ts`)
- AI: Groq SDK (`llama-3.3-70b-versatile`)
- Auth: Replit-managed Clerk (`@clerk/expo` on mobile)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/api-server/src/` — Express API server
  - `app.ts` — middleware setup (Clerk proxy + JWT auth)
  - `routes/chat.ts` — AI chat endpoint (requires auth)
  - `middlewares/clerkProxyMiddleware.ts` — Clerk FAPI proxy
- `artifacts/health-ai/app/` — Expo Router screens
  - `_layout.tsx` — root layout, ClerkProvider, setBaseUrl
  - `(auth)/login.tsx`, `(auth)/signup.tsx` — custom Clerk auth screens
  - `(tabs)/` — protected tab screens (chat, dashboard, profile)
  - `(tabs)/_layout.tsx` — sets up bearer token getter for API calls
- `lib/db/src/schema/index.ts` — database schema (currently empty)
- `lib/api-client-react/` — generated API client + custom fetch

## Architecture decisions

- Mobile uses Clerk bearer tokens (no cookie jar in React Native); `setAuthTokenGetter` in tabs layout attaches tokens to every API call
- API server verifies Clerk JWTs via `@clerk/express` `clerkMiddleware` + `getAuth`; the Clerk FAPI proxy is mounted at `/api/__clerk`
- Chat endpoint requires authentication — unauthenticated requests get 401

## Required secrets

- `CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` — auto-provisioned by Replit Clerk integration
- `GROQ_API_KEY` — Groq API key for AI chat
- `DATABASE_URL` — runtime-managed Postgres (auto-set by Replit)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Clerk dev keys show a "development keys" console warning — this is expected and not an error
- The `(tabs)/_layout.tsx` sets `setAuthTokenGetter` on mount and clears it on unmount; all API calls inside tabs automatically get the Clerk bearer token
- `DATABASE_URL` is runtime-managed — do not set it manually

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `clerk-auth` skill for Clerk customization (login providers, branding, etc.)
