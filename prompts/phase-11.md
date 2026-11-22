<!-- Track A · Phase 11 -->
## PHASE 11 — CA Connections (Invite, Discover, Request, Scopes, Revoke)

**Objective:** Entrepreneurs securely share their business with a CA — by inviting their own CA or finding a verified one — and stay in control of what's shared.
**Prerequisites:** Phases 5, 10.

```text
=== ACCENTRA — PHASE 11: CA CONNECTIONS — INVITATIONS, DISCOVERY, SCOPED ACCESS & REVOCATION ===

You are a senior full-stack engineer designing a consent-based data-sharing system. The entrepreneur is the data owner: they choose who sees what, and revocation must take effect on the very next request.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS). Cold-start strategy: the PRIMARY path is "Invite your existing CA" by email (works even when few CAs are on the platform). The SECONDARY path is a directory of verified CAs. CAConnection (model created in Phase 5) governs access via requireBusinessAccess scopes: ledger:read, documents:read, reports:read, reviews:manage.

--- B. EXISTING PROJECT STATE ---
Phases 1–10 complete. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md (3.6), DESIGN_SYSTEM.md. Inspect requireBusinessAccess, caConnections model, ca-profiles public serializer, email adapter, NotificationPort stub, BusinessProvider, GET /businesses.

--- C. IMPLEMENTATION OBJECTIVE ---
Invite-your-CA flow (email link with token, works for CAs who don't have an account yet), CA directory with search and filters, connection requests (entrepreneur → CA), accept/decline, scope management, revocation by entrepreneur, disconnection by CA, "My CA" page, CA "Requests" page, and GET /businesses including CA-accessible businesses.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Connection state machine (implement as a pure function with exhaustive tests):
   invited (by email, CA may not have an account) → active (CA accepts) | declined | expired (after 14 days) | cancelled (entrepreneur cancels)
   pending (request to an on-platform CA) → active | declined | cancelled
   active → revoked (by entrepreneur) | ended (by CA "disconnect")
   Terminal states cannot transition. Every transition appends to history [{ from, to, byUserId, reason?, at }] and is audit-logged.
2. Business rules:
   - MVP limit: one active CA per business (enforce with a check + partial unique index on { businessId } where status ∈ {invited, pending, active}); document that multiple CAs per business is a Track B option.
   - A CA may have unlimited client businesses.
   - Default scopes on creation: all four (shown as checkboxes the entrepreneur can untick before sending). Scopes editable anytime while active (takes effect immediately).
   - Only the business owner manages the connection.
3. Invite your CA (/app/my-ca, empty state primary card):
   - Form: CA's name, email, optional personal message (≤ 500), scopes. Creates connection status "invited" with inviteEmail and a single-use token (stored hashed, 14-day expiry); email via adapter with link APP_URL/invite/<token>.
   - /invite/:token page: shows business name, inviter, scopes requested, and the message. If not logged in: "Create a CA account" or "Sign in" (both return to the invite after auth; registration pre-selects CA role and pre-fills email). If logged in as a CA: Accept / Decline. If logged in as a non-CA: explain they must use a CA account. The invite's email must match the accepting CA's account email (case-insensitive) — otherwise show an explanation and allow the entrepreneur to resend to the correct email.
   - Unverified CAs CAN accept invitations from businesses that invited them by email (the entrepreneur knows them); the UI shows "Not yet verified by Accentra" next to their name on the entrepreneur side.
   - Entrepreneur can resend (rate-limited) or cancel an invitation.
4. Find a CA (/app/find-ca):
   - Shows ONLY verified CAs accepting new clients, using the public serializer.
   - Filters: city/state, specialization, service, language, consultation mode, minimum experience; text search (name, firm, bio). Pagination. Sort: relevance / experience.
   - CA profile drawer with full public profile and "Send connection request" (message ≤ 500 + scopes) → status "pending". Disabled with explanation if the business already has an invited/pending/active CA.
5. CA side:
   - /ca/requests: tabs Incoming requests (pending), Invitations (invited addressed to their email), History. Each shows business name, category, city, message, scopes requested, date. Accept / Decline (optional reason).
   - Accepting makes the business appear in the CA's client list (Phase 12 builds the workspace; for now link to /ca/clients/:businessId with a ComingSoon until Phase 12).
   - "Disconnect from client" on an active connection (reason required) → ended.
6. My CA page (/app/my-ca) states:
   - None: Invite card + "Find a verified CA" card.
   - Invited/pending: status card with CA name/email, sent date, expires date (invites), Resend/Cancel.
   - Active: CA card (name, firm, verified badge or "not yet verified", city, specializations, connected since), "What your CA can see" with scope toggles (each toggle shows a plain-language explanation; turning off a scope requires confirmation), "Remove CA access" (ConfirmDialog explaining immediate effect), connection history Timeline.
7. GET /businesses now includes businesses where the current CA has an active connection, with accessVia "ca" and scopes. The CA's BusinessProvider uses this for /ca/clients/:businessId routes.
8. NotificationPort calls for: invite received (CA, via email for now), request received, accepted, declined, revoked, ended, scopes changed — implemented in Phase 13; keep the calls.
9. Dashboard onboarding checklist "Invite your CA" now active (update featureStatus and the Phase 9 checklist).

--- E. FRONTEND REQUIREMENTS ---
features/connections (entrepreneur), features/ca-requests (CA), invite page under AuthLayout. Confirmation dialogs for destructive actions. Both themes, responsive, t().

--- F. BACKEND REQUIREMENTS ---
Module connections/:
Entrepreneur (owner of :businessId): GET /businesses/:businessId/connection, POST .../connection/invite, POST .../connection/request { caUserId, message, scopes }, POST .../connection/resend, POST .../connection/cancel, PATCH .../connection/scopes, POST .../connection/revoke { reason? }.
Public directory (authenticated entrepreneurs): GET /ca-directory?filters, GET /ca-directory/:caUserId.
Invites: GET /invites/:token (public; returns minimal safe info: business name, inviter first name, scopes, message, expired?), POST /invites/:token/accept (authenticated CA), POST /invites/:token/decline.
CA: GET /ca/connections?status, POST /ca/connections/:id/accept, POST /ca/connections/:id/decline, POST /ca/connections/:id/end.
Rate limits: invites 10/day/business; requests 10/day/business; directory 60/min/user.
Expiry: a function expireStaleInvites() run on server start and every hour (setInterval in-process for MVP; document moving it to a scheduler in Phase 20).

--- G. DATABASE REQUIREMENTS ---
caConnections: add inviteName, message, history, expiresAt, endedReason, revokedReason. Indexes: partial unique (businessId) where status in [invited, pending, active]; (caUserId, status); (inviteEmail, status); unique sparse inviteTokenHash.

--- H. INTEGRATION REQUIREMENTS ---
requireBusinessAccess already reads active connections and scopes — verify with tests that revocation and scope changes take effect on the very next request (no caching). Auth flows support returning to /invite/:token after login/registration.

--- I. SECURITY REQUIREMENTS ---
Tokens hashed, single-use, expiring; invite acceptance requires matching email; directory exposes only public serializer fields; no enumeration of CAs' emails; owner-only management; immediate revocation; all transitions audited.

--- J. TESTING REQUIREMENTS ---
State machine: every valid and invalid transition. Invite → register as CA with same email → accept → active → CA reads ledger (200). Accept with different email → 403 with clear error. Expired invite → 410. Reused token → 410. Second active CA attempt → 409. Directory excludes pending/rejected/not-accepting CAs and never returns membership number/email/phone. Revoke → next CA request 404. Remove documents:read scope → CA documents 404, ledger still 200. CA ends connection → access gone. Non-owner manage attempts → 404. Run; show output.

--- K. COMPLETION CRITERIA ---
Full invite loop works with the console email driver; directory search works with filters; scopes and revocation take effect instantly (tested); My CA page shows every state correctly; PROJECT_STATE.md updated.

--- L. FINAL AI INSTRUCTIONS ---
Plan first (include the state diagram). Sub-steps: (11a) state machine + backend + tests; (11b) entrepreneur UI (My CA, invite, find a CA); (11c) CA requests UI + invite page. Follow docs/AI_RULES.md. Run tests; show output. Update docs. Report changes.
```

**Git:** → `git tag phase-11-complete`

**Checklist:** [ ] Invite → CA registers → accepts → can read · [ ] Revoke works on next click · [ ] Scope removal works · [ ] Directory hides sensitive fields
