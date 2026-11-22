<!-- Track B · Phase 27 -->
## PHASE 27 — Production Launch & Operations

```text
=== ACCENTRA — PHASE 27: PRODUCTION LAUNCH, MONITORING & OPERATIONS ===

You are a senior SRE/DevOps engineer preparing a small team (one founder) to run Accentra in production calmly.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS) is hardened (Phase 26). Hosting: Vercel, Render, MongoDB Atlas, Cloudflare R2, Resend, AI provider, Sentry.

--- B. EXISTING PROJECT STATE ---
Phases 1–26 complete. Read all docs/. Inspect CI, deployment config, env validation.

--- C. IMPLEMENTATION OBJECTIVE ---
CI/CD pipeline, monitoring and alerting, operational runbooks, release process, product analytics (privacy-respecting), legal page finalisation hooks, and launch checklist.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. CI (GitHub Actions): on PR — install, typecheck, lint, unit/integration tests, build, Playwright E2E against a preview environment (or locally started servers in CI with mongodb-memory-server), secret scanning, bundle-size check; on merge to main — deploy to staging automatically; production deploy on a version tag (vX.Y.Z) after a manual approval step. Branch protection rules documented.
2. Database migrations: a migrations framework (migrate-mongo or a small custom runner) with up/down scripts, a migrations collection, and CI check; convert any earlier one-off scripts (e.g., chart seeding for old businesses, new accounts added in Phases 16/18) into proper migrations.
3. Monitoring: Sentry releases + source maps; uptime monitoring on /api/v1/health (e.g., a free uptime service) with alerts to email; structured log retention approach; job failure alerts (scheduler failures create admin notifications + email); Atlas alerts (connections, disk, slow queries).
4. Product analytics: privacy-respecting, self-hostable or EU/India-friendly tool (e.g., PostHog with IP anonymisation) or a minimal first-party events collection — capture product events only (signup, onboarding completed, first transaction, CA invited, review completed), never financial values or document contents; opt-out setting; disclose in privacy policy.
5. Runbooks (docs/runbooks/): deploy & rollback, restore from backup, rotate secrets (JWT, peppers, DB user, R2 keys, AI keys) with zero-downtime notes, handle a suspected account compromise, handle a data-deletion request, respond to an outage, CA verification operations.
6. Release process: CHANGELOG.md (keep-a-changelog), semantic versions, in-app "What's new" panel reading a JSON changelog.
7. Legal hooks: Privacy Policy and Terms rendered from versioned markdown files; users prompted to accept new versions; banner removed only when the files are marked "approved by counsel" (flag in frontmatter).
8. Launch checklist doc (docs/LAUNCH_CHECKLIST.md): everything from SECURITY_REVIEW, DATA_INVENTORY, legal review, CA review of ACCOUNTING_RULES and GST rules, native-speaker review of translations, penetration test status, backups tested, support inbox monitored, pricing/billing decision (out of scope for build — note as business decision).

--- E–I ---
Infrastructure-as-documentation; minimal app changes (What's new panel, legal acceptance prompts, analytics opt-out). Security: CI secrets in GitHub encrypted secrets only; least-privilege deploy tokens.

--- J. TESTING ---
CI pipeline runs green on a sample PR; staging deploy automatic; production deploy from tag with approval; migration up/down tested on a copy of staging; alert test (trigger a test error and a failed health check). Show evidence.

--- K. COMPLETION ---
A change can go from PR to production safely in under 30 minutes with tests and rollback; alerts reach the founder; runbooks exist; launch checklist complete or items explicitly deferred; PROJECT_STATE.md marks Track B COMPLETE.

--- L. FINAL AI INSTRUCTIONS ---
Plan first. For any dashboard configuration (GitHub, Vercel, Render, Atlas, Sentry, uptime tool), STOP and give exact numbered steps, then wait for my confirmation. Follow docs/AI_RULES.md. Report changes.
```

**Git:** `git tag v1.0.0` 🎉
