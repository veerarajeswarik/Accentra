### 10.5 Security Review Prompt

```text
You are an application security engineer reviewing Accentra (financial data, multi-tenant). Read docs/ARCHITECTURE.md (3.5, 3.6), docs/AI_RULES.md, docs/SECURITY_REVIEW.md (if present), docs/PROJECT_STATE.md.

Scope: [whole app | module name | recent changes since tag phase-N-complete — use git diff phase-N-complete --stat to scope].

Check and report findings with severity (critical/high/medium/low), evidence (file:line), and fix:
1. Authentication: token storage (no localStorage), cookie flags, refresh rotation and reuse detection, lockout, rate limits, password reset enumeration.
2. Authorization: every route's middleware chain; every business-scoped query includes businessId; CA scope checks; admin routes role-checked; object IDs from the request body validated as belonging to the business; responses return 404 (not 403) for other tenants' resources.
3. Input validation: Zod on every body/query/param; mass assignment (no req.body spread into models); Mongo operator injection (sanitizeFilter on).
4. Files: magic-byte validation, size limits, private storage, no tokens in URLs, nosniff, access logging.
5. Output: no stack traces in production, no secrets/PII in logs, no dangerouslySetInnerHTML, CSP and security headers.
6. Secrets: nothing secret in client code or VITE_ vars; .env not tracked; git history clean.
7. AI features: businessId never taken from model output; no write tools; redaction of identifiers.
8. Dependencies: npm audit results.
Write automated tests for each confirmed vulnerability BEFORE fixing it, then fix, then show the tests passing. Do not fix anything until I approve the findings list. Update docs/SECURITY_REVIEW.md.
```
