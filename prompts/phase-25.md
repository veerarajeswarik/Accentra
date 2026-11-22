<!-- Track B · Phase 25 -->
## PHASE 25 — Admin Workspace Completion & Support

```text
=== ACCENTRA — PHASE 25: ADMIN WORKSPACE — USER MANAGEMENT, AUDIT EXPLORER, SUPPORT ===

You are a senior full-stack engineer building internal tools with least-privilege principles: admins operate the platform without casually reading customers' books.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS). Admin currently has stats and CA verification (Phase 10). Contact messages exist (Phase 3). Audit logs exist throughout.

--- B. EXISTING PROJECT STATE ---
Phases 1–24 complete. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md, DESIGN_SYSTEM.md. Inspect admin module, auditLogs, contactMessages, users, GST obligation rules admin (Phase 17).

--- C. IMPLEMENTATION OBJECTIVE ---
User management, support tickets (from contact form and in-app "Get help"), audit log explorer, platform health page, admin action safeguards, and optional feature flags.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Users: search/filter by role, status, verification, created date; user detail (profile, businesses owned — names only, CA connections — counts only, sessions list); actions: suspend/unsuspend (reason required; revokes sessions), force logout, resend verification email, trigger password reset email. Admins cannot view business financial data from here (by design; document a future "support access" feature requiring the business owner's time-limited consent).
2. Support: tickets created from contact form submissions and from an in-app "Get help" dialog (category, subject, message, optional screenshot upload, auto-attached context: current page, app version, browser — no financial data). Ticket statuses new, open, waiting_on_user, resolved; admin replies emailed to the user and visible in an in-app "My support requests" page; internal notes (admin-only).
3. Audit explorer: filter by actor, business, action, entity type, date; detail view showing before/after diff (sensitive fields redacted); export CSV. Admin actions themselves are audited (meta-audit).
4. Platform health: API uptime since deploy, job scheduler last runs and failures, email delivery failures, storage usage, AI usage totals, error count from logs/Sentry (link out).
5. Feature flags (simple): admin-editable flags stored in DB (AI enabled, voice enabled, directory enabled, manual journals) read by server and exposed to client through a /config endpoint; cached 60 s.
6. Safeguards: re-authentication (password prompt) for destructive admin actions within the last 10 minutes; all admin actions require reason fields where they affect users.

--- E–I ---
features/admin expansion; modules admin/, support/, feature-flags/; collections supportTickets, ticketMessages, featureFlags. Security: requireRole("admin") everywhere; redaction in audit diffs; re-auth for destructive actions; no business data browsing.

--- J. TESTING ---
Non-admin access 403 on every admin route (iterated test); suspension revokes sessions; ticket flows; audit filters; re-auth enforcement; flags affect behaviour. Run; show output.

--- K. COMPLETION ---
Admin can run support and moderation without database access; every admin action audited; PROJECT_STATE.md updated.

--- L. FINAL AI INSTRUCTIONS ---
Plan first. Follow docs/AI_RULES.md. Run tests; show output. Update docs. Report changes.
```

**Git:** → `git tag phase-25-complete`
