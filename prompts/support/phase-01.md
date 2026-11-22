<!-- Track A · Phase 1 -->
## PHASE 1 — Foundation & Development Environment

**Objective:** An empty folder becomes a running monorepo: React client, Express API, shared package, MongoDB connection, health check, tests, linting, and the project's "memory" documents.
**Why first:** Every later prompt depends on the structure, conventions, and docs created here.
**Prerequisites:** Part 9, Steps 1–5 completed (software installed, Atlas cluster created, `docs/MASTER_PLAN.md` saved).
**Files involved:** root `package.json`, `client/`, `server/`, `shared/`, `docs/`.
**Expected UX:** None yet; a developer can run one command and see both servers.

```text
=== ACCENTRA — PHASE 1: FOUNDATION & DEVELOPMENT ENVIRONMENT ===

You are a senior full-stack TypeScript engineer setting up the foundation of a production-oriented SaaS application. Work carefully; the structure you create will be used for 27 development phases by a beginner developer who relies on AI coding tools. Clarity and convention matter more than cleverness.

--- A. PROJECT CONTEXT ---
Accentra is an India-focused accounting and CA-collaboration web app. Entrepreneurs record business finances (on a real double-entry ledger) and collaborate with Chartered Accountants through document review workflows. Stack: MERN with TypeScript everywhere — React + Vite + Tailwind (client), Node.js + Express 5 (server), MongoDB Atlas + Mongoose, Zod for validation shared by both sides. This phase builds only the foundation; no product features.

--- B. EXISTING PROJECT STATE ---
The project folder contains only docs/MASTER_PLAN.md (the full architecture and roadmap). Read it completely before planning — especially "PART 3 — Technical Architecture", "PART 5 — UI/UX Design System", and "READ THIS FIRST". Do not create anything that contradicts it. If you believe something in it is wrong, say so in your plan instead of silently deviating.

--- C. IMPLEMENTATION OBJECTIVE ---
Create an npm-workspaces monorepo with three packages (client, server, shared), a validated environment configuration, a working MongoDB connection, a health-check endpoint shown on a temporary client page, a test setup on both sides, linting/formatting, and the project documentation files that every future phase will read.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Root:
   - package.json with "workspaces": ["shared", "server", "client"], "private": true.
   - Scripts: "dev" (runs server and client together using the "concurrently" package with colored, labelled output), "build", "test", "lint", "format", "typecheck".
   - .nvmrc containing the current Node.js LTS major version (22 or newer); "engines" field to match.
   - .gitignore covering node_modules, dist, .env, .env.*, !.env.example, uploads/, coverage/, .DS_Store.
   - .editorconfig, Prettier config, ESLint flat config (TypeScript rules; no-floating-promises on server).
2. shared/ package ("@accentra/shared"):
   - TypeScript, builds to dist/ AND is consumable in dev without a build step (configure TS path/project references or package "exports" pointing to src in dev — explain your choice).
   - src/money/: toPaise(rupeesString) → integer (rejects more than 2 decimals, negatives where not allowed, non-numeric); fromPaise(int) → string; formatINR(paise, {compact?}) → "₹1,23,456.78" using Indian digit grouping, compact "₹1.2L"/"₹3.4Cr". Use integer math only; never parseFloat on money.
   - src/constants/: ROLES = entrepreneur | ca | admin (as const + type).
   - Unit tests for every money function including edge cases (0, 1 paise, 9,99,99,999.99, "1,500.50", "1500.5", invalid inputs).
3. server/ package:
   - Express 5 + TypeScript, run in dev with tsx watch.
   - src/config/env.ts: parse process.env with Zod at startup; fail fast with a clear list of missing/invalid variables. Variables for now: NODE_ENV, PORT (default 5000), MONGODB_URI, CLIENT_ORIGIN (default http://localhost:5173). process.env may only be read in this file.
   - .env.example documenting each variable (what it is, where to get it, example format). No real secrets.
   - src/config/db.ts: Mongoose connection with retries/backoff, connection event logging, graceful shutdown on SIGINT/SIGTERM; mongoose.set('strictQuery', true) and mongoose.set('sanitizeFilter', true).
   - src/config/logger.ts: pino logger (pretty in dev, JSON in prod). Never log request bodies.
   - src/app.ts (builds the app, exported for tests) and src/server.ts (starts it). Middleware: helmet, cors (only CLIENT_ORIGIN, credentials: true), express.json({ limit: '1mb' }), cookie-parser, request-id, pino-http.
   - Routes under /api/v1. GET /api/v1/health → { data: { status: "ok", db: "up"|"down", version, time } }.
   - Centralized error handler + 404 handler producing the error envelope from MASTER_PLAN Part 3.8: { error: { code, message, details? } }. Create an AppError class with factories (badRequest, unauthenticated, forbidden, notFound, conflict). Never leak stack traces when NODE_ENV=production.
   - Folder skeleton exactly as in MASTER_PLAN Part 3.2 (create empty folders with a short README.md in modules/ explaining the module pattern: routes → controller → service → model).
   - Testing: Vitest + Supertest + mongodb-memory-server configured as a REPLICA SET (MongoMemoryReplSet) so MongoDB transactions work in tests. Write tests: health returns 200 with db "up"; unknown route returns 404 envelope; error handler hides stack in production mode.
4. client/ package:
   - Vite + React + TypeScript (strict). Tailwind CSS configured (the current stable major version; follow its official Vite setup).
   - Vite dev server proxy: /api → http://localhost:5000 (so the browser always calls same-origin /api/v1/...).
   - src/lib/apiClient.ts: small fetch wrapper with base URL from import.meta.env.VITE_API_BASE_URL (default "/api/v1"), JSON handling, and parsing of the error envelope into a typed ApiError.
   - TanStack Query installed with a QueryClient provider.
   - Temporary page at "/" showing "Accentra — development build" and the live health status from the API (loading, success, and error states). This page will be replaced in Phase 3.
   - Vitest + React Testing Library configured with one test for the apiClient error parsing.
5. docs/ (create these; they are the project's memory):
   - docs/AI_RULES.md — copy the "STRICT DEVELOPMENT RULES" listed at the end of this prompt verbatim, then add a "Conventions" section: folder structure, naming (kebab-case files for server modules, PascalCase React components), money rule (integer paise, field names end in "Paise"), API envelope, error codes, "every business-scoped query filters by businessId", "all UI text through i18n t() from Phase 2 onward", Git commit message format (feat:, fix:, chore:, docs:, test:).
   - docs/ARCHITECTURE.md — extract PART 3 from MASTER_PLAN.md (keep it current in future phases).
   - docs/DESIGN_SYSTEM.md — extract PART 5 from MASTER_PLAN.md.
   - docs/PROJECT_STATE.md — sections: "Current phase", "Completed phases" (with one-paragraph summaries), "What exists" (routes, models, pages, components), "Environment variables", "Known issues / TODO", "Decisions log" (date + decision + reason). Fill it for Phase 1.
   - README.md at root: what Accentra is (2 lines), prerequisites, setup steps for Windows PowerShell, scripts table.

--- E. FRONTEND REQUIREMENTS ---
Only the temporary health page. No design work yet (Phase 2). Use Tailwind utility classes minimally.

--- F. BACKEND REQUIREMENTS ---
As in D.3. No authentication yet. No product models yet.

--- G. DATABASE REQUIREMENTS ---
Connection only. Database name "accentra_dev" for development (part of MONGODB_URI). No collections created except by tests in memory.

--- H. INTEGRATION REQUIREMENTS ---
client → /api/v1/health through the Vite proxy → server → MongoDB ping. Shared package imported by both client and server (prove it by using formatINR somewhere trivial on the health page, e.g., "Sample: ₹1,23,456.78").

--- I. SECURITY REQUIREMENTS ---
.env never committed (verify .gitignore before first commit). CORS restricted to CLIENT_ORIGIN. helmet enabled. JSON body limit. Mongoose sanitizeFilter on. No secrets in client code or VITE_ variables.

--- J. TESTING REQUIREMENTS ---
Run and show real output of: npm run test (all workspaces), npm run typecheck, npm run lint. All must pass. Shared money functions must have exhaustive edge-case tests.

--- K. COMPLETION CRITERIA ---
1. From a fresh clone on Windows: npm install → copy server/.env.example to server/.env → fill MONGODB_URI → npm run dev starts both servers.
2. http://localhost:5173 shows health status "ok" and db "up". Stopping Atlas access (wrong URI) shows db "down" or a clear startup error — not a crash with no message.
3. All tests, lint, and typecheck pass (actual output shown).
4. docs/ contains AI_RULES.md, ARCHITECTURE.md, DESIGN_SYSTEM.md, PROJECT_STATE.md; README explains setup.
5. No .env file is tracked by Git.

--- L. FINAL AI INSTRUCTIONS ---
1. FIRST, present a plan: the exact folder tree you will create, every dependency with a one-line reason, and any deviation from MASTER_PLAN.md with justification. Wait for my approval before writing files.
2. Pin dependency versions you install (exact or caret is acceptable, but use current stable releases — check, do not guess version numbers).
3. After implementation, run the commands in J and paste the real output. Never claim success without running them.
4. Update docs/PROJECT_STATE.md.
5. Finish with a report: files created, commands I must run, environment variables I must set, how to verify each completion criterion, and a 5-sentence beginner-friendly explanation of how the client, server, and shared packages relate.

STRICT DEVELOPMENT RULES (also copy these into docs/AI_RULES.md):
1. Analyze the existing codebase before editing. 2. Never recreate the entire project unnecessarily. 3. Preserve previously implemented features. 4. Do not replace working functionality with mock functionality. 5. Do not silently remove existing components. 6. Avoid duplicate files, routes, components, and database models. 7. Reuse existing design-system components. 8. Maintain consistent TypeScript types and interfaces. 9. Use modular, maintainable code. 10. Keep frontend and backend responsibilities separate. 11. Never expose database credentials or API secrets. 12. Enforce permissions on the backend, not only through frontend navigation. 13. Avoid hardcoded financial values in production functionality. 14. Use realistic demonstration data only when explicitly identified as demo data. 15. Never present simulated features as real integrations. 16. Ensure every interactive control performs its intended function. 17. Provide clear error messages. 18. Handle loading and empty states. 19. Maintain light and dark theme compatibility. 20. Verify that new changes do not break existing modules. 21. Use correct accounting calculations and data relationships. 22. Preserve auditability of financial changes. 23. Do not automatically execute sensitive financial or tax actions based solely on AI output. 24. Explain any required third-party credentials or services. 25. Never claim testing succeeded unless tests were actually executed.
If a feature cannot be completed without external credentials, configuration, or legal authorization, implement the integration boundary (interface + clearly labelled stub) and explain exactly what remains.
```

**Git checkpoint:**
```powershell
git add .
git commit -m "chore: phase 1 foundation - monorepo, env, db, health, tests, docs"
git tag phase-1-complete
git push origin main --tags
```

**Phase 1 verification checklist**
- [ ] `npm run dev` starts both servers with labelled output
- [ ] Browser shows API health "ok / db up" and `₹1,23,456.78`
- [ ] `npm run test`, `npm run lint`, `npm run typecheck` all pass
- [ ] `git status` does **not** list `server/.env`
- [ ] All four docs files exist and PROJECT_STATE.md describes Phase 1
