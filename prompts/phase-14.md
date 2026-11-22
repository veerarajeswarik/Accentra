<!-- Track A · Phase 14 -->
## PHASE 14 — CA Review Workflow (The Core Demo)

**Objective:** The complete submit → review → clarify → resubmit → approve loop with immutable history.
**Prerequisites:** Phases 8, 12, 13.

```text
=== ACCENTRA — PHASE 14: CA–ENTREPRENEUR REVIEW & CLARIFICATION WORKFLOW ===

You are a senior full-stack engineer building the defining feature of the product. Model it as an explicit state machine with an immutable history. This workflow is what judges and users will remember; it must be correct, clear, and polished.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS). Entrepreneurs submit records (documents, transactions) to their connected CA for review. The CA reviews, requests clarification with specific notes, and approves or rejects. Entrepreneurs respond and resubmit. Everything is timestamped and attributed.

--- B. EXISTING PROJECT STATE ---
Phases 1–13 complete. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md, DESIGN_SYSTEM.md, ACCOUNTING_RULES.md. Inspect documents (links, versions, delete hook), transactions (void-and-repost, history), connections (scope reviews:manage), notifications service, CA workspace tabs, Phase 9 attention provider hook, Phase 12 reviewStats provider hook.

--- C. IMPLEMENTATION OBJECTIVE ---
ReviewRequest + ReviewComment models, state machine, APIs, entrepreneur UI (submit, list, detail, respond/resubmit), CA UI (queue across clients, client Reviews tab, review detail with document/transaction viewer, decisions), notifications for every transition, dashboard integrations, and document-delete protection.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Subjects: a review targets either a Document (latest version at submission time; record the exact document id) or a Transaction (record id), with optional additional attached documents. Store subject { type, id, snapshot: { title, amountPaise?, date?, documentName?, version? } } so history shows what was reviewed even if things change later.
2. States and transitions (pure function, exhaustively tested):
   draft (entrepreneur editing) → submitted (entrepreneur)
   submitted → under_review (CA opens and clicks "Start review"; also automatic when the CA posts the first comment)
   under_review → needs_clarification (CA, note REQUIRED) | approved (CA, optional note) | rejected (CA, reason REQUIRED)
   needs_clarification → submitted (entrepreneur resubmits; response note REQUIRED; may attach a new document version or point to an edited transaction)
   submitted/needs_clarification → withdrawn (entrepreneur, optional reason)
   approved, rejected, withdrawn are terminal; rejected items can be "Resubmitted as new review" (creates a new review linked via previousReviewId).
   Each transition increments revision when resubmitted, appends history { action, fromStatus, toStatus, byUserId, note, at, revision }, writes audit, and notifies the other party.
3. Who can act: entrepreneur = business owner; CA = the connected CA with active connection and scope reviews:manage. If the connection is revoked/ended, open reviews become read-only "closed (connection ended)" (implement as a status "closed" set by the connection transition hook) and the CA loses access.
4. Comments: threaded under a review (flat list, chronological), each with author, body (1–2000 chars, plain text, rendered safely with line breaks), revision number, optional reference chips (to a transaction or document in the same business). Both parties can comment in any non-terminal state. Comments cannot be edited after 10 minutes and never deleted (show "edited" marker within the window).
5. Entrepreneur UI:
   - "Submit for CA review" button on document preview drawer and transaction detail drawer (visible only when an active CA with reviews:manage exists; otherwise a link "Connect a CA to request reviews"). Opens a dialog: title (prefilled), what to check (optional note), additional documents (picker). Creates review in submitted state (draft exists for API completeness and a "Save as draft" option).
   - /app/reviews: tabs Needs your response (needs_clarification) · In progress (submitted, under_review) · Approved · Rejected · All; DataTable with title, subject type icon, status badge, last update, revision; filter by date.
   - Review detail /app/reviews/:id: header (title, status, subject chip, CA name), left: subject viewer (document preview or transaction details with journal lines in Pro mode), right: history Timeline + comments + action panel. When needs_clarification: prominent amber panel showing the CA's note, with actions "Upload corrected document" (creates a new document version and attaches it), "Edit the transaction" (opens the edit drawer; the edit's new transaction id is linked), and "Resubmit with a note".
6. CA UI:
   - /ca/reviews: queue across all clients with filters (client, status, age), sorted oldest first in submitted; "Awaiting client" (needs_clarification) tab; counts in tabs.
   - Client workspace Reviews tab (replace the placeholder) showing that client's reviews.
   - Review detail /ca/clients/:businessId/reviews/:id: same layout with CA actions: Start review, Request clarification (dialog: note required + quick-pick templates such as "GSTIN of supplier missing", "Invoice date unclear", "Amount doesn't match bank statement", "Please attach the bank statement for this month"), Approve (optional note), Reject (reason required). Keyboard shortcuts documented in a tooltip (A approve, C clarify) with confirmation dialogs.
7. Dashboard integrations: entrepreneur "Needs your attention" includes reviews needing response; "documents awaiting CA review" count is real; CA dashboard StatCards "Reviews awaiting you" (submitted + under_review) and "Needs client response" are real (implement the provider hooks from Phases 9 and 12).
8. Status badges on documents and transactions: show the latest review status chip (e.g., "Approved by CA ✓") in lists and detail drawers.
9. Protection: documents linked to non-terminal or approved reviews cannot be soft-deleted (implement the Phase 8 hook); transactions under an open review can be edited only through the clarification flow (warn and require confirmation; the review history records the edit).

--- E. FRONTEND REQUIREMENTS ---
features/reviews (shared components for both roles; role-specific action panels). Timeline component for history (actor avatar, action phrase, note, relative + absolute time on hover). Optimistic UI is NOT used for state transitions (wait for server). Both themes, responsive (two-column becomes stacked), t().

--- F. BACKEND REQUIREMENTS ---
Module reviews/:
Business-scoped: GET/POST /businesses/:businessId/reviews, GET .../reviews/:id, POST .../reviews/:id/submit, .../start, .../request-clarification, .../resubmit, .../approve, .../reject, .../withdraw, GET/POST .../reviews/:id/comments, PATCH .../comments/:commentId (within 10 min, author only).
CA cross-client: GET /ca/reviews?status&businessId (only businesses with active reviews:manage connections).
Every transition in a MongoDB transaction (review update + history + audit), notifications after commit. Transition authorization checks role/party per transition.

--- G. DATABASE REQUIREMENTS ---
reviewRequests: businessId, caUserId, subject {type, id, snapshot}, additionalDocumentIds, title, status, revision, previousReviewId?, submittedBy, history[], lastActivityAt, timestamps. Indexes (businessId, status, lastActivityAt), (caUserId, status, lastActivityAt), (businessId, "subject.type", "subject.id"). reviewComments: reviewRequestId, businessId, authorId, body, revision, references[], editedAt, createdAt; index (reviewRequestId, createdAt). tenantGuard on both.

--- H. INTEGRATION REQUIREMENTS ---
Documents (versions, links, delete protection), transactions (edit linkage), connections (closing reviews on revoke/end via transition hook; reviews:manage scope), notifications (all six review types), dashboards (provider hooks), CA workspace tab.

--- I. SECURITY REQUIREMENTS ---
Only valid transitions by the correct party; scope checks; comments rendered as text (no HTML); references validated to same business; revoked CA immediately loses access; history immutable (no update path except append).

--- J. TESTING REQUIREMENTS ---
State machine exhaustive tests. Integration: full happy path (submit → start → clarify → resubmit with new version → approve) with history entries and notifications for each step; entrepreneur cannot approve (403); CA cannot resubmit (403); clarification without note → 400; reject without reason → 400; CA of another business → 404; revoke connection mid-review → review closed and CA 404; delete document under review → 409; comment edit after 10 minutes → 409; /ca/reviews returns only connected businesses' reviews. Playwright E2E (first E2E in the project): two browser contexts (entrepreneur, CA) performing the complete demo loop from upload to approval and asserting UI states. Run all; show output.

--- K. COMPLETION CRITERIA ---
The full loop works in two browsers simultaneously (notifications arrive via polling within 30 s); history shows every step with actor, note, and time; dashboards reflect counts; documents show "Approved by CA"; E2E passes; PROJECT_STATE.md updated.

--- L. FINAL AI INSTRUCTIONS ---
Plan first (include the state diagram and a table of transition → allowed actor → required fields → notification recipient). Sub-steps: (14a) state machine + models + backend + tests; (14b) entrepreneur UI; (14c) CA UI; (14d) integrations + E2E. Follow docs/AI_RULES.md. Run tests; show output. Update docs. Report changes.
```

**Git:** commit per sub-step → `git tag phase-14-complete`

**Checklist:** [ ] Full loop in two browsers · [ ] History immutable and complete · [ ] Wrong-party actions rejected · [ ] Playwright E2E passes
