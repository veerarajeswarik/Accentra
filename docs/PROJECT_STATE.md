# Project State

> AI tools: read this FIRST at the start of every session. Update it at the END of every phase.

## Current phase

**Phase 1 — Foundation & Development Environment: complete (2026-11-22).**
Next: **Phase 2** — `prompts/phase-02.md`.

## Completed phases

### Phase 1 — Foundation & Development Environment

Created an npm-workspaces monorepo with three packages: `@accentra/shared` (integer-paise money
helpers `toPaise` / `fromPaise` / `formatINR` with Indian grouping and compact L/Cr form, roles,
error codes, API envelope and health types), `@accentra/server` (Express 5 + TypeScript with a
Zod-validated environment, a Mongoose connection with retry/backoff and graceful shutdown, pino
logging, helmet/CORS/JSON-limit/cookie-parser/request-id middleware, an `AppError` class, a
central error envelope, a 404 handler, and `GET /api/v1/health`) and `@accentra/client` (Vite +
React 19 + Tailwind v4 + TanStack Query, a typed `apiClient`, and a temporary health page). Tests
use Vitest everywhere, with Supertest and an in-memory MongoDB **replica set** on the server, so
transactions work in tests. ESLint (flat config, type-aware rules on the server) and Prettier are
configured. The project docs (`AI_RULES.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, this file)
were created.

## What exists

### Server routes (`/api/v1`)

| Method | Path          | Auth | Description                                                     |
| ------ | ------------- | ---- | --------------------------------------------------------------- |
| GET    | `/health`     | none | `{ data: { status: "ok", db: "up" \| "down", version, time } }` |
| \*     | anything else | —    | `404 { error: { code: "NOT_FOUND", ... } }`                     |

### Server building blocks

- `server/src/config/env.ts` — Zod env schema (`parseEnv`, `env`, `isProduction`); loads `server/.env` locally.
- `server/src/config/db.ts` — `connectDb` (retries, backoff up to 30 s), `disconnectDb`, `pingDb`, `redactUri`; `strictQuery` + `sanitizeFilter` on.
- `server/src/config/logger.ts` — pino (pretty in dev, JSON in prod, silent in tests; auth headers/cookies redacted).
- `server/src/lib/app-error.ts` — `AppError` + factories. `server/src/lib/version.ts` — `APP_VERSION`.
- `server/src/middleware/` — `request-id.ts`, `not-found.ts`, `error-handler.ts` (`createErrorHandler`).
- `server/src/modules/health/` — routes/controller/service/test (reference example of the module pattern).
- `server/src/app.ts` (`createApp()`), `server/src/server.ts` (listen + background DB connect + SIGINT/SIGTERM shutdown), `server/src/routes.ts` (module router registry).
- Tests: `server/src/tests/global-setup.ts` (MongoMemoryReplSet), `setup-env.ts`.

### Models

None yet.

### Shared (`@accentra/shared`)

- `money/` — `toPaise(str, {allowNegative?})`, `fromPaise(int)`, `formatINR(int, {compact?})`, `MoneyError`.
- `constants/` — `ROLES`, `Role`, `isRole`; `ERROR_CODES`, `ErrorCode`.
- `types/` — `ApiSuccess<T>`, `ApiMeta`, `ApiErrorBody`, `HealthStatus`.
- `schemas/` — empty (Zod schemas arrive with features).

### Client pages / components

- `/` — temporary development health page (`client/src/App.tsx`); **replaced in Phase 3**.
- `client/src/lib/apiClient.ts` — `apiClient.get/post/patch/delete`, `apiRequest`, `parseResponse`, `ApiError`.
- `client/src/lib/queryClient.ts` — `createQueryClient()` (no retries on 4xx).
- No design-system components yet (Phase 2).

## Environment variables

### Server (`server/.env`, documented in `server/.env.example`)

| Variable        | Required | Default                 | Notes                                   |
| --------------- | -------- | ----------------------- | --------------------------------------- |
| `NODE_ENV`      | no       | `development`           | `development` \| `test` \| `production` |
| `PORT`          | no       | `5000`                  |                                         |
| `MONGODB_URI`   | **yes**  | —                       | Atlas string with db `accentra_dev`     |
| `CLIENT_ORIGIN` | no       | `http://localhost:5173` | the only CORS origin allowed            |

### Client

| Variable            | Default   | Notes                         |
| ------------------- | --------- | ----------------------------- |
| `VITE_API_BASE_URL` | `/api/v1` | never put secrets in `VITE_*` |

## Known issues / TODO

- **MongoDB Atlas not configured yet.** `server/.env` currently holds the placeholder URI from `.env.example`, so the health page shows `db: down`. Do beginner guide Step 3 (`docs/plan/09-beginner-guide-windows.md`) and paste the real URI into `server/.env`.
- **No GitHub remote yet.** Create a private `accentra` repo and add it with `git remote add origin ...`.
- npm 11 reports install scripts not yet approved for `esbuild` and `mongodb-memory-server`. Everything works without them (esbuild ships its binary as an optional dependency; mongodb-memory-server downloads mongod on first test run). Approve with `npm approve-scripts <pkg>` only if a problem appears.
- TypeScript is pinned to 6.0.x because `typescript-eslint` 8.x does not yet support TypeScript 7. Revisit when it does.
- The first server test run downloads a mongod binary (~100+ MB, cached afterwards).

## Decisions log

| Date       | Decision                                                                                                                                               | Reason                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-11-22 | Moved the plan kit from `accentra-plan-kit/` to the project root.                                                                                      | Every prompt expects `docs/MASTER_PLAN.md` and `prompts/` at the root.                                                                   |
| 2026-11-22 | Created a dedicated git repo in this folder.                                                                                                           | The enclosing repo was the user's whole home folder.                                                                                     |
| 2026-11-22 | `@accentra/shared` uses a custom `development` export condition → `src/*.ts`; default → `dist/`.                                                       | No build step in dev (Vite, tsx, Vitest, tsc all honour the condition); production uses compiled JS. Simpler than TS project references. |
| 2026-11-22 | TypeScript `~6.0.3` instead of 7.0.                                                                                                                    | `typescript-eslint` 8.73 supports only `<6.1`.                                                                                           |
| 2026-11-22 | Added error code `PAYLOAD_TOO_LARGE` (413) to the Part 3.8 list.                                                                                       | Correct HTTP status for bodies over the 1 MB JSON limit.                                                                                 |
| 2026-11-22 | Server starts listening before MongoDB connects; DB connects in the background with retry.                                                             | `/health` can report `db: down` with clear logs instead of the process crashing.                                                         |
| 2026-11-22 | `.gitattributes` forces LF line endings.                                                                                                               | Global `core.autocrlf` would otherwise create CRLF files that fail Prettier.                                                             |
| 2026-11-22 | `.nvmrc` = 24 (engines `>=22`).                                                                                                                        | Node 24 is the current LTS and is installed.                                                                                             |
| 2026-11-22 | `compact` `formatINR` uses K / L / Cr with one decimal, half-up, trailing `.0` dropped (`₹1L`, `₹1.2L`, `₹3.4Cr`); amounts under ₹1,000 shown in full. | Readable dashboard figures; rounding never shows "100.0K" (bumps to ₹1L).                                                                |
