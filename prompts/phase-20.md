<!-- Track B · Phase 20 -->
## PHASE 20 — Messaging, Tasks, Real-Time & Email Notifications

```text
=== ACCENTRA — PHASE 20: MESSAGING, TASKS, REAL-TIME UPDATES & NOTIFICATION PREFERENCES ===

You are a senior full-stack engineer adding collaboration features and real-time delivery to an existing, database-backed system — without making correctness depend on WebSockets.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS). Entrepreneurs and their connected CA need contextual messaging and structured tasks (e.g., "Upload March bank statement"). Notifications exist (DB + polling). Backend is hosted on Render (WebSockets supported); frontend on Vercel (rewrites cannot proxy WebSockets — the client must connect directly to the backend origin for Socket.IO; design auth accordingly).

--- B. EXISTING PROJECT STATE ---
Phases 1–19 complete. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md, DESIGN_SYSTEM.md. Inspect notifications, connections, reviews (comment component), documents, recurring templates, GST reminders scheduler. Report divergences first.

--- C. IMPLEMENTATION OBJECTIVE ---
Per-connection conversations with record references; tasks with assignment, due dates, priorities, attachments, and verification; Socket.IO real-time events that invalidate client queries; email notifications with per-type user preferences; a unified scheduler for reminders (recurring expenses due, overdue invoices/bills, task due dates, GST obligations).

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Messaging: one conversation per active connection (created on activation; read-only after revoke/end). Messages: text (1–4000 chars, plain text, safe rendering, links auto-detected but rendered with rel="noopener noreferrer" and an external-link icon), references (transaction, document, invoice, bill, review — validated same business, rendered as chips that open the record if the viewer has the scope), attachments (upload via the documents pipeline, linked as type "message"). Read receipts (lastReadAt per participant), unread counts, pagination (cursor-based, newest at bottom), typing indicator (real-time only, optional). UI: /app/messages (single conversation with the CA) and /ca/messages (conversation list with unread badges + conversation pane); client workspace Messages tab. Entry points: "Discuss with CA" on records pre-attaching a reference.
2. Tasks: fields title, description, businessId, createdBy, assignee (entrepreneur owner or CA), due date, priority (low, normal, high, urgent), status (open → in_progress → ready_for_review → done; ready_for_review → open with reason "changes requested"; open/in_progress → cancelled by creator), request type (document_request with requested category; correction; information; other), attachments (documents), linked records, history. A CA "document_request" task shows the entrepreneur an "Upload requested document" button that uploads into the right category and links to the task, then moves it to ready_for_review. Only the creator (or the CA for tasks they created) verifies and closes. UI: /app/tasks and /ca tasks views (list + board toggle), client workspace Tasks tab, dashboard widgets (pending, overdue, due this week) for both roles.
3. Real-time (Socket.IO):
   - Server attaches Socket.IO to the HTTP server; auth via a short-lived socket token obtained from POST /api/v1/realtime/token (requires access token; 60-second, single-use) passed in the handshake auth payload; reject otherwise.
   - Rooms: user:<userId>; connection:<connectionId> (only for parties of an active connection; re-validated on join and kicked on revoke).
   - Events emitted AFTER DB commits: notification:new, message:new, message:read, task:updated, review:updated, connection:updated. Payloads contain IDs and minimal metadata only; clients respond by invalidating TanStack Query keys (data always fetched through REST, so authorization stays in one place).
   - Client: a RealtimeProvider connecting to VITE_REALTIME_URL (the Render origin) with reconnection/backoff; when connected, notification polling interval increases to 5 minutes; when disconnected, polling returns to 30 s. Configure CORS for Socket.IO to the client origin only.
4. Email notifications: per-type preferences (in-app always on; email on/off per type; daily digest option for low-priority types), defaults sensible (email on for review clarification requests, task assigned, connection requests; off for comments). Email templates per type with a link to the record and an unsubscribe-from-this-type link (signed token). Respect EMAIL_DRIVER.
5. Unified scheduler: server/src/lib/scheduler with named idempotent jobs (recurringDue, overdueInvoices, overdueBills, taskDueSoon, gstObligations, expireInvites, exportCleanup). Single-instance assumption documented with a simple Mongo-based lock (jobLocks collection with TTL) so two instances never run the same job simultaneously.
6. Recurring expenses: notifications "Rent is due on the 5th — record it?" linking to the pre-filled form (still no auto-posting).

--- E/F/G ---
features/messages, features/tasks, lib/realtime. Modules messages/, tasks/, realtime/, notification-preferences. Collections conversations, messages (index (conversationId, createdAt)), tasks (indexes (businessId, status, dueDate), (assigneeId, status)), notificationPreferences, jobLocks. tenantGuard on business-owned.

--- H/I ---
Integration with documents, reviews, notifications, connections (revocation closes rooms and conversations), dashboards. Security: socket auth, room membership checks, no data in socket payloads beyond IDs, message content plain-text rendering, rate limits (messages 30/min/user), unsubscribe tokens signed and scoped.

--- J. TESTING ---
Messaging permissions (non-party 404; revoked → read-only), references validated; task state machine exhaustive; document request flow end-to-end; socket auth (invalid token rejected; revoked party kicked from room); events emitted after commit only (simulate rollback → no event); email preferences honoured; scheduler idempotency and locking. Playwright: two contexts exchanging messages appear without reload. Run; show output.

--- K. COMPLETION ---
Messages and task updates appear in the other browser within ~1 s when connected, and within 30 s via polling if WebSockets are blocked; email preferences work; reminders generated once per period; PROJECT_STATE.md updated.

--- L. FINAL AI INSTRUCTIONS ---
Plan first. Sub-steps: (20a) messaging; (20b) tasks; (20c) realtime; (20d) email preferences; (20e) scheduler + reminders. Follow docs/AI_RULES.md. Run tests; show output. Update docs and DEPLOYMENT.md (new env vars VITE_REALTIME_URL, Render WebSocket notes). Report changes.
```

**Git:** → `git tag phase-20-complete`
