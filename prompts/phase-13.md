<!-- Track A · Phase 13 -->
## PHASE 13 — Notifications (In-App)

**Objective:** Users are told about events that need them, stored reliably, displayed with unread counts.
**Prerequisites:** Phase 4 (consumes events from Phases 10–11).

```text
=== ACCENTRA — PHASE 13: IN-APP NOTIFICATION SYSTEM ===

You are a senior full-stack engineer. Build a reliable notification system where the database is the source of truth; real-time delivery is added later (Phase 20) as an enhancement, not a dependency.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS). Notifications must never leak information across businesses and must always link to the record they concern.

--- B. EXISTING PROJECT STATE ---
Phases 1–12 complete. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md, DESIGN_SYSTEM.md. Find every NotificationPort call left as a no-op in Phases 10–11 (search the codebase) — you will implement the port.

--- C. IMPLEMENTATION OBJECTIVE ---
Notification model + service implementing NotificationPort; APIs for list, unread count, mark read, mark all read; notification bell + dropdown; notification center pages for entrepreneurs, CAs, admins; polling; wire existing events.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Notification types (shared constant, each with a title template i18n key, body template, icon, and link builder): ca_verification_approved, ca_verification_rejected, ca_verification_revoked, connection_invite_received (for CAs who already have accounts matching the email), connection_request_received, connection_accepted, connection_declined, connection_revoked, connection_ended, connection_scopes_changed, ca_profile_submitted (admins), plus placeholders reserved for Phase 14: review_submitted, review_clarification_requested, review_resubmitted, review_approved, review_rejected, review_comment_added.
2. notifications.service: create({ userId, type, businessId?, data, link }) storing rendered-at-read-time data (store type + data; render title/body on the client via i18n so language switching works later); createMany for admin broadcasts; dedupe: same (userId, type, entity id) within 60 seconds collapses into one.
3. Delivery is fire-and-forget AFTER the main DB transaction commits (never inside it, never failing the main action). Use a small helper afterCommit(session, fn) or call after await commit; log failures.
4. APIs: GET /notifications?unreadOnly&page (newest first), GET /notifications/unread-count, POST /notifications/:id/read, POST /notifications/read-all, DELETE /notifications/:id (dismiss). Users only see their own notifications (filter by userId; 404 otherwise).
5. Bell (top bar): unread badge (99+ cap); dropdown with latest 8, each row: icon, title, body (1 line), relative time ("5 min ago"), unread dot; clicking marks read and navigates to link; "Mark all as read"; "View all" → /app/notifications, /ca/notifications, /admin/notifications.
6. Notification center page: filters All / Unread, grouped by Today / Yesterday / Earlier; bulk mark read; empty state.
7. Polling: unread-count query every 30 s while the tab is visible (pause when hidden using document.visibilityState), and refetch on window focus. Document in ARCHITECTURE.md how Phase 20 will replace polling with Socket.IO pushes that just invalidate this same query.
8. Retention: notifications older than 180 days deleted via TTL index on createdAt (document).
9. Admin: when a CA submits/resubmits a profile, notify all admins.

--- E. FRONTEND REQUIREMENTS ---
features/notifications; reusable NotificationItem; both themes; responsive (dropdown becomes a full-screen sheet on mobile); t() with interpolation.

--- F. BACKEND REQUIREMENTS ---
Module notifications/. Replace the NotificationPort no-op with the real implementation; wire all existing events from Phases 10–11.

--- G. DATABASE REQUIREMENTS ---
notifications: userId, businessId?, type, data (small object; no sensitive financial details beyond what the recipient is allowed to see), link, readAt, createdAt. Indexes (userId, readAt, createdAt desc), TTL on createdAt 180 days.

--- H. INTEGRATION REQUIREMENTS ---
Phase 14 will call the same service for review events; Phase 20 adds email + real-time + preferences.

--- I. SECURITY REQUIREMENTS ---
Owner-only access; link paths are internal relative paths only (validate on creation); notification data contains no content from businesses the recipient can't access (for a revoked connection, the CA notification says "Access to <business name> was removed" — business name is acceptable, financial data is not).

--- J. TESTING REQUIREMENTS ---
Each wired event creates exactly one notification for the right user; dedupe works; user B cannot read/mark user A's notification (404); unread count correct; failure in notification creation doesn't roll back or fail the main action (simulate). Client: badge updates after mark-all-read. Run; show output.

--- K. COMPLETION CRITERIA ---
Invite/accept/revoke/verification events show up in the bell for the right user within 30 seconds; clicking navigates correctly; mark read persists after refresh; PROJECT_STATE.md updated.

--- L. FINAL AI INSTRUCTIONS ---
Plan first. Follow docs/AI_RULES.md. Run tests; show output. Update docs. Report changes and list every event now producing notifications.
```

**Git:** → `git tag phase-13-complete`

**Checklist:** [ ] Events appear for the correct user only · [ ] Polling pauses on hidden tab · [ ] Notification failures never break the main action
