<!-- Track A · Phase 15 -->
## PHASE 15 — MVP Hardening, Demo Data & Deployment

**Objective:** A deployed, secure-enough, demo-ready Accentra with realistic labelled demo data and a rehearsed workflow.
**Prerequisites:** Phases 1–14.

```text
=== ACCENTRA — PHASE 15: MVP HARDENING, DEMO DATA & DEPLOYMENT ===

You are a senior DevOps + application-security engineer preparing a product for a public demonstration. Make it work reliably on the internet, not just on localhost.

--- A. PROJECT CONTEXT ---
Accentra MVP (Track A) is feature-complete. Deploy: client → Vercel; server → Render (Web Service; supports WebSockets for Phase 20); database → MongoDB Atlas; files → Cloudflare R2 (or AWS S3). The browser must talk to ONE origin: Vercel rewrites /api/* to the Render backend so auth cookies stay first-party.

--- B. EXISTING PROJECT STATE ---
Phases 1–14 complete. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md, DESIGN_SYSTEM.md, ACCOUNTING_RULES.md. Inspect env.ts, cookie settings, CORS, storage driver config, email driver, seed scripts.

--- C. IMPLEMENTATION OBJECTIVE ---
Security and reliability pass, production configuration, demo seed data, deployment configuration and documentation, a production smoke test, and a demo-day runbook.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Security pass (fix every finding; list them in docs/SECURITY_REVIEW.md with status):
   - Review every route: authenticate/requireRole/requireBusinessAccess/validation present (generate a route inventory table automatically by introspecting the Express router and include it in the doc).
   - helmet CSP appropriate for an API (client CSP configured via vercel.json headers: default-src 'self'; connect-src 'self' plus Sentry if used; img-src 'self' data: blob:; frame-src 'self' blob: for PDF preview; style-src 'self' 'unsafe-inline' only if required by libraries — justify).
   - Rate limiters on auth, uploads, writes; trust proxy configured correctly for Render (app.set('trust proxy', 1)) so limits use real client IPs.
   - npm audit: fix high/critical where possible; document any accepted risk.
   - Ensure production error responses contain no stack traces; logs contain no passwords, tokens, or document contents.
   - Cookie: Secure=true, SameSite=Lax, path /api/v1/auth in production.
2. Reliability:
   - Graceful shutdown; /api/v1/health used by Render health checks.
   - Global unhandledRejection/uncaughtException logging (then exit for uncaught).
   - Sentry (optional, behind SENTRY_DSN): server + client error capture with PII scrubbing; skip silently when DSN absent.
   - Client: global ErrorBoundary with friendly recovery; offline detection banner.
3. Demo data (server/src/scripts/seed-demo.ts, "npm run seed:demo -w server"):
   - Idempotent (re-running resets ONLY demo data: everything with isDemo=true / demo user emails at a demo domain like demo.accentra.app).
   - Users: entrepreneur "Priya" (owner of "Priya's Organic Foods", Coimbatore, retail, GST registered with a structurally valid demo GSTIN for Tamil Nadu — state code 33), entrepreneur "Arun" ("Arun Design Studio", services, not GST registered), verified CA "CA Meenakshi" (Meenakshi & Associates; certificate is a generated PDF clearly watermarked "DEMO"), unverified CA "CA Rahul", admin.
   - Priya's business: opening balances; ~4 months of realistic transactions (sales via UPI and cash, supplier purchases, rent, electricity, salaries, internet, a transfer, an owner withdrawal, a few unpaid customer and supplier items, one edited transaction and one voided); 8 documents (generated PDFs/images watermarked "DEMO DOCUMENT"), linked to transactions; active connection with CA Meenakshi; reviews in varied states: 2 approved, 1 under_review, 1 needs_clarification (note: "Supplier GSTIN missing on this invoice"), 1 submitted; notifications consistent with those states.
   - Arun's business: small dataset, pending invitation to CA Rahul.
   - All demo amounts generated through the real services (transactions.service, reviews.service) — never by inserting raw journal entries — so the ledger is guaranteed consistent. After seeding, assert trial balance balanced for each demo business.
   - Demo passwords printed once to the terminal; never committed.
   - A visible "Demo data" badge in the top bar for isDemo businesses.
4. Deployment configuration:
   - client/vercel.json: SPA fallback rewrite to index.html; rewrite /api/:path* → https://<render-service>.onrender.com/api/:path*; security headers.
   - render.yaml (blueprint) for the server: build command (npm ci && npm run build -w shared -w server), start command (node server/dist/server.js), health check path, Node version, env var list (values entered in the dashboard, not the file).
   - Server production build (tsc to dist; shared built first); verify "npm run build" at root works on a clean clone.
   - Atlas: separate production database "accentra_prod" and a dedicated database user with readWrite on it only; IP access list guidance (Render egress IPs vary on free tier — document the trade-off of 0.0.0.0/0 with strong credentials vs paid static IPs).
   - R2 bucket private; CORS not needed because downloads go through presigned URLs from the API (document).
   - Email: Resend with a verified sender domain or Resend's test domain (document limitations).
   - docs/DEPLOYMENT.md: step-by-step for a beginner with screenshots-described steps for Atlas, Render, Vercel, R2, Resend; every environment variable with where to get it; how to run seed:demo against production safely; rollback procedure (Vercel instant rollback; Render previous deploy; never run destructive scripts without a backup — Atlas snapshot/export instructions).
5. Free-tier cold start mitigation: document options (a) upgrade the Render service for demo week, (b) open the app 2–3 minutes before presenting and hit /api/v1/health, (c) a client-side "Waking up the server…" screen when the first API request takes > 3 s (implement c).
6. Production smoke test: Playwright config "smoke" project that runs the Phase 14 demo E2E against PRODUCTION_URL using demo accounts (read from env), plus checks that /app redirects to /login when logged out and that security headers are present.
7. docs/DEMO_RUNBOOK.md: pre-demo checklist (re-seed, warm-up, two browser profiles logged in, notification polling verified, backup screen recording), the 5-minute demo script (see MASTER_PLAN Part 12), and recovery steps if something fails live.

--- E. FRONTEND REQUIREMENTS ---
Waking-up screen; demo badge; ErrorBoundary; offline banner. No other UI changes.

--- F. BACKEND REQUIREMENTS ---
trust proxy, production config validation (env.ts refuses to start in production with COOKIE_SECURE=false, EMAIL_DRIVER=console, or STORAGE_DRIVER=local — print why).

--- G. DATABASE REQUIREMENTS ---
Create indexes in production on startup (Mongoose autoIndex true is acceptable at MVP scale; document turning it off later). Verify all indexes exist with a script "npm run db:check-indexes -w server".

--- H. INTEGRATION REQUIREMENTS ---
Everything from Phases 1–14 must work in production. The smoke test proves it.

--- I. SECURITY REQUIREMENTS ---
As D.1. Demo credentials never in Git. Production data and demo data never mixed in reports (isDemo businesses excluded from admin platform stats or shown separately).

--- J. TESTING REQUIREMENTS ---
Full test suite green locally; seed-demo runs twice with identical results and balanced trial balances; smoke test passes against production; manually verify on a phone (Chrome Android / Safari iOS) the login, dashboard, and review flows.

--- K. COMPLETION CRITERIA ---
Public URL works; demo loop passes in production in two browsers; SECURITY_REVIEW.md lists all findings with status; DEPLOYMENT.md and DEMO_RUNBOOK.md complete; cold start handled; PROJECT_STATE.md updated and marks Track A COMPLETE.

--- L. FINAL AI INSTRUCTIONS ---
Plan first. Sub-steps: (15a) security pass + fixes; (15b) demo seed; (15c) deployment config + docs; (15d) smoke tests + runbook. For each step that requires me to click in a web dashboard (Atlas, Render, Vercel, R2, Resend), STOP and give me exact numbered instructions, then wait for me to confirm before continuing. Never ask me to paste secrets into the chat; tell me where to put them. Follow docs/AI_RULES.md. Run tests; show output. Update docs. Report changes.
```

**Git:** `git tag mvp-v1.0` after the production smoke test passes. **This is your safe demo version** — if anything later breaks before the hackathon, `git checkout mvp-v1.0`.

**Checklist:** [ ] Production URL works on phone and laptop · [ ] Demo loop passes in production · [ ] Re-seeding is safe and idempotent · [ ] No secrets in Git (`git log -p | Select-String "mongodb+srv"` returns nothing) · [ ] Runbook rehearsed twice

> **🏁 Track A complete. You have a deployable, demonstrable product.** Everything below makes it a full product.
