<!-- Track B · Phase 26 -->
## PHASE 26 — Security, Accessibility & Performance Hardening

```text
=== ACCENTRA — PHASE 26: PRODUCTION HARDENING — SECURITY, PRIVACY, ACCESSIBILITY, PERFORMANCE ===

You are a principal engineer performing a pre-launch review of a financial SaaS. Be thorough and skeptical; produce evidence, not assurances.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS), feature-complete through Phase 25, about to accept real businesses' financial data. Legal context: India's Digital Personal Data Protection Act (DPDP) — engineering must support notice, consent, access, correction, erasure, and breach response; legal interpretation is for a lawyer.

--- B. EXISTING PROJECT STATE ---
Phases 1–25 complete. Read every docs/ file including SECURITY_REVIEW.md from Phase 15. Inspect the whole codebase.

--- C. IMPLEMENTATION OBJECTIVE ---
Comprehensive security review and fixes, privacy features, accessibility audit and fixes, performance optimisation, backup and recovery verification, and an updated SECURITY_REVIEW.md with evidence.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Security review against OWASP Top 10 and OWASP API Security Top 10: produce a table per category with how Accentra mitigates it, evidence (file/test), and gaps fixed. Include: broken object-level authorization (automated test that iterates EVERY business-scoped route with tokens from a different business and expects 404), mass assignment, injection (sanitizeFilter, Zod), SSRF (no user-supplied URLs fetched server-side — verify), file upload, XSS (no dangerouslySetInnerHTML; CSP), CSRF (cookie routes), rate limits, secrets management, dependency vulnerabilities (npm audit + automated weekly check via GitHub Dependabot config), security headers (verify with a test), logging hygiene.
2. Authentication extras: optional TOTP two-factor authentication for all users (strongly recommended prompt for CAs and admins; mandatory for admins), with recovery codes; new-device login email notification.
3. Privacy features: data export (owner downloads all business data as a ZIP of JSON + CSVs + documents), account and business deletion flow (soft delete with 30-day grace, then hard delete job removing documents from storage; ledger retention note — Indian law may require businesses to retain books; deletion removes them from Accentra, and the user is told to export first), consent records (terms/privacy version accepted with timestamp; AI consent), privacy-policy versioning; data-processing inventory doc (docs/DATA_INVENTORY.md: what personal data, where stored, why, retention, processors — Atlas, Render, Vercel, R2, Resend, AI provider, Sentry).
4. Breach readiness: docs/INCIDENT_RESPONSE.md (detection, containment, notification steps, contacts) and a "revoke all sessions platform-wide" admin emergency action.
5. Accessibility: automated axe tests in Playwright on 20 key pages in both themes; manual keyboard and screen-reader checklist (NVDA on Windows) for the review workflow; fix all serious/critical issues; document results.
6. Performance: client bundle analysis (route-level code splitting, lazy-load charts/PDF viewer/AI chat, remove unused deps; target initial JS < 250 KB gzipped for the dashboard route — report actual); API: add missing indexes found via explain on the 15 most-used queries; response compression; pagination everywhere (verify no unbounded queries — automated grep + review); load test with autocannon or k6 on dashboard, transactions list, and review list endpoints at 50 concurrent users with a 50k-transaction fixture business — report p95 latencies and fix the worst offenders (e.g., monthly balance snapshots if needed, with tests proving equality to live aggregation).
7. Backups & recovery: Atlas backup policy documented; tested restore of a snapshot into a staging database; R2 object versioning or lifecycle; restore runbook.
8. Staging environment: separate Render service, Vercel preview, Atlas database; deployment flow staging → production documented.

--- E–I ---
Changes wherever required, each tied to a finding. No feature additions beyond 2FA, privacy features, and emergency actions.

--- J. TESTING ---
The cross-business authorization sweep, header tests, 2FA tests, export completeness test (every business-owned collection included), deletion job test, axe tests, load test report. Run; show output.

--- K. COMPLETION ---
SECURITY_REVIEW.md updated with evidence for every item; no open high/critical findings; accessibility serious/critical issues resolved; performance targets met or documented; restore tested; PROJECT_STATE.md updated.

--- L. FINAL AI INSTRUCTIONS ---
Plan first with a findings-first approach: audit and list findings BEFORE fixing; I will approve priorities. Then fix in small, separately committed batches. Follow docs/AI_RULES.md. Run tests; show output. Report changes. Recommend whether an external penetration test is warranted before launch (it is strongly recommended for a financial product) and what scope it should have.
```

**Git:** commit per batch → `git tag phase-26-complete`
