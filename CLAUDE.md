# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint

npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma migrate dev --name <name>   # Create and apply a migration
npx prisma studio    # Open Prisma GUI
npx tsc --noEmit     # Type-check without emitting
```

After editing `prisma/schema.prisma` (especially adding enum values), always run `npx prisma generate` and delete `.next/` before restarting the dev server, or the new enum will cause runtime errors.

## Stack

- **Next.js 16.2.9 / React 19** — App Router, Turbopack dev server
- **Prisma v5 / PostgreSQL** — Neon-hosted, connection string in `DATABASE_URL`
- **Groq API** — `llama-3.3-70b-versatile` via `src/lib/groq.ts` (`groqChat`). Key in `GROQ_API_KEY`.
- **Tailwind v4 + shadcn/ui** — components in `src/components/ui/`
- **Zustand** — three stores: `auth-store`, `copilot-store`, `onboarding-store` (all persisted)

## Architecture

### Route groups

| Group | Path prefix | Purpose |
|---|---|---|
| `(auth)` | `/login`, `/register` | Unauthenticated pages |
| `(marketing)` | `/` | Landing page |
| `(onboarding)` | `/onboarding/step-*` | 7-step onboarding wizard |
| `(dashboard)` | `/candidate/*`, `/recruiter/*`, `/admin` | Authenticated app |

### Auth

Custom JWT, **not** NextAuth. `src/lib/auth.ts` handles `signToken` / `verifyToken`. The route guard lives in `src/proxy.ts` (exported as `proxy` + Next.js `config.matcher`), not in a standard `middleware.ts`.

API routes authenticate with `getAuthUser(req)` from `src/lib/get-auth-user.ts` — reads from `Authorization: Bearer <token>` header or the `token` cookie. Client sends the token stored in Zustand's `auth-store` as a request header.

### API conventions

All routes are under `/api/v1/`. Every handler calls `getAuthUser` first and returns 401 if null. Route files use `async function GET/POST/PATCH/DELETE(req, { params })` where `params` is a `Promise<{…}>` (Next.js 15 convention — must be `await`ed).

### Interview system (current implementation)

The live schema (`prisma/schema.prisma`) is simpler than `BACKEND_ARCHITECTURE.md` describes. The `Session`, `Answer`, and `Evaluation` models exist in the DB but are **not used** in the current interview flow. Everything goes through the `Interview` model directly:

1. **Create** — `POST /api/v1/interviews` creates an `Interview` row with `status: IN_PROGRESS`.
2. **Generate questions** — `POST /api/v1/interviews/[id]/questions` calls Groq and returns questions as JSON (never persisted to DB). Questions are normalised client-side in `src/components/interview/session-layout.tsx`.
3. **Session** — `src/app/(dashboard)/candidate/interviews/[id]/session/page.tsx` renders `<InterviewSession>`, which manages all state in React.
4. **Submit** — `POST /api/v1/interviews/[id]/submit` sends all answers, calls Groq for evaluation, updates `Interview.status = COMPLETED` and `Interview.totalScore`, returns the full report payload.
5. **Report** — report data is written to `sessionStorage` under key `report_<id>` by the session page, then read by the report page at `/candidate/interviews/[id]/report`.

### Question types

`InterviewType` enum: `TECHNICAL | BEHAVIORAL | CODING | VOICE | MIXED | APTITUDE`

- **MCQ types** (TECHNICAL, BEHAVIORAL, MIXED, APTITUDE): multiple-choice, `correct` index, `explanation`
- **VOICE**: open-ended questions only, no options; answered via Web Speech API (`window.SpeechRecognition`)
- **CODING**: Monaco editor + run button; questions have `starterCode`, `examples`, `constraints`

All questions are AI-generated per-session and sanitised via a `str()` coercion helper in `session-layout.tsx` to prevent React 19 object-as-child crashes from malformed Groq output.

### Code execution

| Language | Where | How |
|---|---|---|
| JavaScript | Browser (client-side) | `AsyncFunction` constructor with `console.log` capture |
| Python | Browser (client-side) | Pyodide (WebAssembly CPython), loaded lazily from CDN on first run |
| Java | N/A | Shows "not supported" message |

`/api/v1/code/run` only handles Python/Java server-side fallback (currently points to Wandbox, may fail). JavaScript and Python both run fully in-browser with no server call.

### Dashboard data flow

`/api/v1/dashboard/stats` and `/api/v1/progress` query `Interview.status` and `Interview.totalScore` directly — **not** the `Session` model. Any refactor that queries `Session` will return empty data.

### Copilot

A floating AI chat assistant (`src/components/copilot/`) that lives independently of interviews. State in `copilot-store`. Knowledge base in `src/lib/copilot/knowledge.ts`.

## Key files to know

| File | Role |
|---|---|
| `src/proxy.ts` | Next.js middleware (route guards, role redirects) |
| `src/lib/groq.ts` | Single wrapper for all Groq calls (`groqChat`) |
| `src/lib/auth.ts` | JWT sign/verify, cookie name |
| `src/lib/get-auth-user.ts` | Extracts and verifies token from any request |
| `src/components/interview/session-layout.tsx` | Entire interview session UI + state machine |
| `src/components/interview/setup-wizard.tsx` | Interview configuration wizard |
| `src/components/interview/report-view.tsx` | Post-interview report renderer |
| `src/app/api/v1/interviews/[id]/questions/route.ts` | Groq question generation per interview type |
| `src/app/api/v1/interviews/[id]/submit/route.ts` | Evaluation + score dimensions per interview type |
| `prisma/schema.prisma` | Source of truth for DB schema (ignore BACKEND_ARCHITECTURE.md as spec doc) |
