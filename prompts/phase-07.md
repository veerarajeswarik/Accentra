<!-- Track A · Phase 7 -->
## PHASE 7 — Transactions, Contacts & Categories

**Objective:** Entrepreneurs record everyday money movements in plain language; each one becomes a correct journal entry.
**Prerequisites:** Phase 6.

```text
=== ACCENTRA — PHASE 7: TRANSACTIONS, CONTACTS & CATEGORIES ===

You are a senior full-stack engineer building the most-used screen of an accounting product for non-accountants. It must be fast to use, impossible to unbalance, and fully auditable.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS). The ledger engine (ledger.service.post/reverse) exists and is the ONLY way financial data is written. Transactions are user-friendly records that each create exactly one journal entry.

--- B. EXISTING PROJECT STATE ---
Phases 1–6 complete. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md, DESIGN_SYSTEM.md, and especially docs/ACCOUNTING_RULES.md (posting rules table is the spec). Inspect server/src/modules/ledger.

--- C. IMPLEMENTATION OBJECTIVE ---
Transactions module (create, view, list/search/filter, "edit" via void-and-repost, void, mark paid), contacts (customers/suppliers), category selection mapped to accounts, payment methods, and the Expenses filtered view.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Transaction kinds (shared constant) and their posting rules (must match ACCOUNTING_RULES.md exactly):
   money_in (paid): Dr payment account (cash/bank/UPI) / Cr income category.
   money_in (unpaid, i.e., customer owes): Dr Accounts Receivable / Cr income category; contact (customer) required.
   money_out (paid): Dr expense (or asset) category / Cr payment account.
   money_out (unpaid, i.e., bill to pay): Dr expense category / Cr Accounts Payable; contact (supplier) required.
   transfer: Dr destination cash/bank account / Cr source account (must differ).
   owner_investment: Dr payment account / Cr Owner's Capital.
   owner_withdrawal: Dr Owner's Drawings / Cr payment account.
   refund_received: Dr payment account / Cr the original expense category.
   refund_given: Dr the original income category / Cr payment account.
   GST on transactions is NOT computed in this phase (Phase 17 adds tax lines); include an optional "tax note" text field only. Do not invent GST math here.
2. Mark as paid / received (settlement): for an unpaid money_in → POST .../transactions/:id/settle { date, paymentAccountId, paymentMethod } posting Dr payment account / Cr Accounts Receivable (or Dr AP / Cr payment for money_out); supports full settlement only in this phase (partial payments arrive with invoices in Phase 16 — note this). The original transaction's status becomes "paid" and stores settlement { journalEntryId, date }.
3. Edit = void-and-repost (inside ONE MongoDB transaction): reverse the original journal entry (and settlement entry if any), mark original isVoided=true with voidReason="edited" and replacedById, create a new transaction with a new entry, copy history and append an "edited" event with a field-level diff (which fields changed, before → after). The UI presents this as a normal edit with a "View history" link. Void (delete) = reversal + isVoided=true with reason (required). Voided transactions are hidden by default but visible with a "Show voided" filter, struck-through.
4. Transaction fields: kind, date (default today; business timezone Asia/Kolkata), amountPaise (> 0, ≤ ₹10,00,00,000 per transaction for sanity — configurable constant), categoryAccountId (filtered by kind: income accounts for money_in, expense + selected asset accounts for money_out), paymentAccountId (cash/bank subtypes only; required when paid), paymentMethod (cash, upi, bank_transfer, debit_card, credit_card, cheque, other; must be consistent — e.g., "cash" requires a cash-subtype account), status (paid | unpaid), contactId (required when unpaid), reference (invoice/bill no., UTR, cheque no.; ≤ 60), description (≤ 280), taxNote (optional), documentIds (empty until Phase 8 links them), journalEntryId, settlement, isVoided, voidReason, replacedById, history [{ action: created|edited|settled|voided, byUserId, at, changes? }], createdBy.
5. Recurring templates (simple version): a transaction form checkbox "This repeats monthly" creates a RecurringTemplate { businessId, template fields, dayOfMonth, nextDueDate, active }. In this phase recurring items appear in a "Due this month" list with a one-click "Record now" (pre-filled form, user confirms) — NO automatic posting without the user (automation with notifications arrives in Phase 20).
6. Contacts: /app/contacts with tabs Customers / Suppliers; fields name, type (customer | supplier | both), phone, email, GSTIN (optional, format validated), state (for future GST place-of-supply), notes. Outstanding balance per contact computed from AR/AP journal lines with that contactId. Contact detail page shows their transactions. Archive (not delete) when transactions exist. Quick-create a contact from inside the transaction form (Combobox "+ Add new").
7. List page /app/transactions:
   - PageHeader with primary "Record transaction" (opens a Drawer form) and secondary quick buttons "Money In" / "Money Out" that preselect the kind.
   - Filters: date range (presets: This month, Last month, This quarter, This FY, Custom), kind, category, payment method, status (paid/unpaid), contact, amount min/max, text search (description/reference), show voided.
   - DataTable: date, description (with contact), category (Simple: simpleLabel; Pro: code + name), payment method icon, status badge, amount (+ green / − with sign and icon; right-aligned, tabular). Server-side pagination (20/50/100) and sorting by date/amount. Filters reflected in the URL query string (shareable, survive refresh).
   - Row click → detail Drawer: all fields, linked journal entry (Pro mode shows the actual debit/credit lines with account names — this is a powerful teaching moment; Simple mode shows "Recorded as: Money Out from Bank Account for Rent"), history Timeline, actions Edit / Mark paid / Void.
   - Summary bar above the table for the filtered range: Money In total, Money Out total, Net (computed server-side from the same filters).
8. /app/expenses: the same list component preset to kind=money_out with an expense-category breakdown mini-chart (top 6 categories this period). Not a separate data model.
9. Form UX: kind selector as large segmented control with plain-language descriptions; MoneyInput; category Combobox with recent categories first; payment account select showing current balance; inline validation; "Save and add another"; keyboard shortcut N to open the form on the list page (documented in a tooltip). After save: toast with "View" action; list and summary refresh (TanStack Query invalidation).

--- E. FRONTEND REQUIREMENTS ---
Feature folder client/src/features/transactions and features/contacts (api.ts with typed functions, hooks.ts with queries/mutations, components, pages). Simple/Pro terminology via useTerm. Both themes, responsive (form drawer becomes full-screen on mobile; table becomes cards). All strings via t().

--- F. BACKEND REQUIREMENTS ---
Modules transactions/ and contacts/: 
GET/POST /businesses/:businessId/transactions; GET .../transactions/summary; GET/PATCH .../transactions/:id (PATCH = void-and-repost); POST .../transactions/:id/settle; POST .../transactions/:id/void; GET/POST/PATCH .../contacts; GET .../contacts/:id (with outstanding); POST .../contacts/:id/archive; GET/POST/PATCH .../recurring-templates; GET .../recurring-templates/due.
Writes: owners only. Reads: owners + CAs with "ledger:read". All writes use a session and call ledger.service; audit every write (transaction.created/edited/settled/voided, contact.created/updated/archived).
Shared Zod schemas with discriminated unions by kind so invalid combinations are impossible (e.g., unpaid requires contactId; paid requires paymentAccountId).
Idempotency: POST /transactions accepts an optional "Idempotency-Key" header (client generates a UUID per form submission); duplicate keys within 24h return the original result instead of posting twice (store keys in an idempotencyKeys collection with TTL). This prevents double entries from double-clicks and retries.

--- G. DATABASE REQUIREMENTS ---
transactions: indexes (businessId, date desc), (businessId, kind, date), (businessId, status), (businessId, contactId), text index (description, reference), (businessId, isVoided). contacts: (businessId, type, name). recurringTemplates: (businessId, nextDueDate). idempotencyKeys: unique (businessId, key), TTL. tenantGuard on all.

--- H. INTEGRATION REQUIREMENTS ---
Uses ledger.service exclusively for financial writes. Phase 8 will attach documents (keep documentIds and an attach endpoint stub out — do not fake upload UI). Phase 9 dashboard will read summaries from the ledger, not from transactions.

--- I. SECURITY REQUIREMENTS ---
Server recomputes everything; ignores client-sent journal data. Validate that category/payment/contact IDs belong to the business. CAs cannot write. Rate-limit write endpoints moderately (60/min/user). Idempotency prevents duplicates.

--- J. TESTING REQUIREMENTS ---
For EACH kind: correct journal lines posted (assert exact accounts and paise). Unpaid without contact → 400. Paid without payment account → 400. Cash method with bank account → 400. Category of wrong type → 400. Settle unpaid → second entry, AR/AP back to zero for that contact. Settle already paid → 409. Edit → original reversed, new posted, history diff correct, trial balance still balanced. Void → reversed; voided hidden by default. Idempotency key reused → no second entry. Other business's IDs in payload → 400. CA write → 403/404; CA read with scope → 200. Summary totals equal sum of listed rows for the same filters. Contact outstanding equals AR/AP lines sum. Run; show output.
Also: a client-side test that the form shows the right fields per kind.

--- K. COMPLETION CRITERIA ---
I can record each kind, see it in the list, filter it, edit it (with history), settle it, void it; trial balance stays balanced after a mixed sequence of 30 operations (automated test); double-clicking Save creates one transaction; Pro mode detail shows the debit/credit lines; filters survive refresh; both themes; PROJECT_STATE.md updated.

--- L. FINAL AI INSTRUCTIONS ---
Plan first. Sub-steps: (7a) contacts module (back + front); (7b) transactions backend + tests; (7c) transactions UI (list, filters, form drawer, detail); (7d) expenses view + recurring templates. Pause after each. Follow docs/AI_RULES.md. Run tests; show output. Update docs (add any new posting rule to ACCOUNTING_RULES.md). Report changes.
```

**Git:** commit per sub-step → `git tag phase-7-complete`

**Checklist:** [ ] Every kind posts correct journal lines (Pro-mode detail) · [ ] Edit keeps history · [ ] Double-click doesn't duplicate · [ ] Filters in URL · [ ] Trial balance balanced after random operations
