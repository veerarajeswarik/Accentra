<!-- Track A · Phase 5 -->
## PHASE 5 — Business Onboarding, Tenancy & Audit Logging

**Objective:** Entrepreneurs create their business; every future financial record is bound to a business; data isolation is enforced by middleware; an audit log exists.
**Prerequisites:** Phase 4.

```text
=== ACCENTRA — PHASE 5: BUSINESS ONBOARDING, MULTI-TENANCY & AUDIT LOGGING ===

You are a senior backend architect specialising in multi-tenant SaaS security. In this phase you build the data-isolation layer that every financial feature will rely on. A mistake here leaks one business's books to another; treat it accordingly.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS). The tenant is the Business. Entrepreneurs own businesses via BusinessMembership. CAs will access businesses only through active CAConnections with scopes (Phase 11). Every business-scoped route uses the URL pattern /api/v1/businesses/:businessId/...

--- B. EXISTING PROJECT STATE ---
Phases 1–4 complete (auth works, roles, guards). Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md (sections 3.4 and 3.6 are the spec), DESIGN_SYSTEM.md. Inspect the auth middleware and /auth/me.

--- C. IMPLEMENTATION OBJECTIVE ---
Business model + onboarding wizard, BusinessMembership, the requireBusinessAccess middleware (owner path now; CA path stubbed for Phase 11 with tests), active-business context on the client, business profile settings page, account settings page, and an append-only audit log service.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Onboarding wizard (/onboarding/business), 3 steps with progress indicator and back/next (data kept between steps; submitted once at the end):
   Step 1 Business basics: business name (2–120), legal structure (proprietorship, partnership, LLP, private limited, other), category (retail shop, service business, manufacturing, trading, professional practice, startup, other), industry (free text with suggestions), size (just me, 2–10, 11–50, 51+).
   Step 2 Location & contact: address line 1/2, city, state (select of Indian states/UTs with GST state codes from a shared constant), PIN code (6 digits), business email, business phone.
   Step 3 Finance & tax: financial year start (default April; select of months), GST registered? (yes/no); if yes GSTIN (validate 15-char format AND that its first two digits match the selected state's code; full checksum validation in Phase 17 — leave a TODO), PAN (optional; format AAAAA9999A), preferred language (English; Tamil/Hindi disabled "coming soon").
   On submit: create Business + owner membership in a MongoDB transaction; redirect to /app with a welcome toast. (Phase 6 will extend this transaction to seed the chart of accounts — design the service so seeding hooks in cleanly: businesses.service.create() should call an onBusinessCreated(session, business) list of hooks.)
2. /auth/me onboarding.hasBusiness becomes real. Entrepreneurs without a business are redirected from /app/* to /onboarding/business by the guard.
3. Active business context:
   - GET /api/v1/businesses → businesses the current user can access (owner memberships now; CA connections later), each with { id, name, accessVia: "owner" | "ca", scopes }.
   - Client BusinessProvider stores activeBusinessId (persisted in localStorage per user id), exposes useActiveBusiness(); all business API calls build URLs from it. If the user has exactly one business, auto-select it. (UI switcher arrives in Track B; the provider must already support multiple.)
4. Business profile page (/app/settings/business): view and edit all onboarding fields (except financial year start, which is locked once any journal entry exists — implement the lock check as a hook that returns false until Phase 6; show the field disabled with an explanation tooltip when locked). Save shows success toast; changes audited.
5. Account settings page (/app/settings and /ca/settings share a component): name, phone, preferred language, theme preference, change password (current + new; revokes other sessions), "log out all devices".
6. requireBusinessAccess(requiredScope?: Scope) middleware (server/src/middleware/requireBusinessAccess.ts):
   - Validates :businessId is a valid ObjectId (else 404).
   - Entrepreneur: must have a membership → access { via: "owner", scopes: ALL_SCOPES }.
   - CA: query CAConnection { businessId, caUserId, status: "active" } and require requiredScope in scopes. The CAConnection model does not exist yet: create the Mongoose model now with the fields from ARCHITECTURE 3.4 (Phase 11 builds its features), so this middleware is complete and testable today.
   - Admin: denied (404) on business routes.
   - On failure always 404 NOT_FOUND (do not reveal existence).
   - Attaches req.business (lean doc) and req.access.
   - SCOPES constant in shared: "ledger:read", "documents:read", "reports:read", "reviews:manage".
7. Business-scoped service rule: create server/src/lib/tenant.ts with helper scoped(model, businessId) or a documented pattern that every service query includes { businessId }. Add an automated safety net: a Mongoose plugin "tenantGuard" applied to business-owned models that throws in development/test if a find/update/delete/aggregate query on that model lacks businessId in its filter (aggregates: first stage must be $match with businessId). Document the plugin in ARCHITECTURE.md.
8. Audit log: server/src/lib/audit.ts → audit.record({ actorId, businessId?, action, entity: {type, id}, before?, after?, req? }) storing ip hash and user agent; append-only (model has no update/delete methods used anywhere; add a test that the service exports no mutation besides record). Record: business.created, business.updated, user.password_changed, auth.logout_all.

--- E. FRONTEND REQUIREMENTS ---
Wizard uses FormField, Select, Combobox, Stepper (create a Stepper component in components/ui if missing; add to showcase). Inline validation per step; can't proceed with errors. Responsive and both themes. All strings via t() (namespaces "onboarding", "settings").

--- F. BACKEND REQUIREMENTS ---
Modules: businesses/ (POST /businesses, GET /businesses, GET /businesses/:businessId, PATCH /businesses/:businessId), users/ (PATCH /users/me, POST /users/me/change-password). Shared Zod schemas for business create/update. Only owners may PATCH a business (CAs never can).

--- G. DATABASE REQUIREMENTS ---
businesses (fields per ARCHITECTURE 3.4 plus legalStructure, address subdocument, contact subdocument, isDemo=false default), businessMemberships (unique (businessId, userId); index userId), caConnections (model only), auditLogs (indexes per 3.4). All with timestamps.

--- H. INTEGRATION REQUIREMENTS ---
/auth/me extended; guards extended; ThemeProvider/language preference editable in settings; onBusinessCreated hook list ready for Phase 6.

--- I. SECURITY REQUIREMENTS ---
Isolation is the deliverable. GSTIN/PAN validated server-side. Financial-year lock enforced server-side. Mass-assignment protection: services pick allowed fields explicitly (never spread req.body into a model).

--- J. TESTING REQUIREMENTS ---
Create two entrepreneurs A and B, each with a business. Tests: A can GET/PATCH own business; A GET B's business → 404; A PATCH B's business → 404; CA with no connection → 404; CA with active connection having "ledger:read" passes a route requiring it; same CA with status "revoked" → 404; same CA lacking the scope → 404; admin → 404; invalid ObjectId → 404; tenantGuard throws on an unscoped query in test mode; wizard validation (GSTIN state mismatch → 400); audit entries created for business.created/updated. Run; show output.

--- K. COMPLETION CRITERIA ---
New entrepreneur → wizard → dashboard placeholder; business visible in Atlas with membership; isolation tests pass; settings pages save and persist after refresh; audit log entries visible in Atlas; PROJECT_STATE.md and ARCHITECTURE.md updated.

--- L. FINAL AI INSTRUCTIONS ---
Plan first; wait for approval. Sub-steps: (5a) models + middleware + tenantGuard + audit + tests; (5b) onboarding wizard + BusinessProvider; (5c) settings pages. Follow docs/AI_RULES.md. Run tests; show output. Update docs. Report changes and explain, in beginner terms, how requireBusinessAccess protects data.
```

**Git:** commit per sub-step → `git tag phase-5-complete`

**Checklist:** [ ] Isolation tests (A vs B, CA states, admin) pass · [ ] Wizard creates business + membership atomically · [ ] Settings persist · [ ] Audit entries visible
