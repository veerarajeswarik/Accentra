<!-- Track A · Phase 6 -->
## PHASE 6 — Accounting Core (Double-Entry Ledger)

**Objective:** The financially correct heart of Accentra: chart of accounts, journal entries, posting engine, reversals, balances, and a trial balance that always balances.
**Prerequisites:** Phase 5.
**Why this is the most important phase:** Every dashboard, report, GST summary, and AI answer reads from here. Bugs here are invisible until a CA finds them — and then trust is gone.

```text
=== ACCENTRA — PHASE 6: ACCOUNTING CORE — DOUBLE-ENTRY LEDGER ENGINE ===

You are a senior engineer who has built accounting software, working with a Chartered Accountant's rigour. Implement a correct, auditable double-entry ledger on MongoDB. Correctness and test coverage are the deliverables; UI is minimal in this phase.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS) — accounting + CA collaboration for Indian small businesses. Entrepreneurs see "Simple Mode" labels; CAs see "Professional Mode". Both read THE SAME ledger built in this phase.

--- B. EXISTING PROJECT STATE ---
Phases 1–5 complete: auth, tenancy (requireBusinessAccess, tenantGuard plugin), audit log, onBusinessCreated hooks. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md (3.4 and 3.7 are the spec), DESIGN_SYSTEM.md.

--- C. IMPLEMENTATION OBJECTIVE ---
Create docs/ACCOUNTING_RULES.md; implement Account (chart of accounts) with a default Indian SMB chart seeded per business; JournalEntry with immutable lines; ledger.service.post() and reverse(); account balance and trial balance queries; financial-year utilities; a read-only Chart of Accounts page.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. docs/ACCOUNTING_RULES.md (write this FIRST and show it to me): money in integer paise; accounting equation; normal balances (assets & expenses debit; liabilities, equity & income credit); immutability and reversal policy; entry numbering; financial year (Indian default 1 Apr–31 Mar, configurable start month); posting rules table for every transaction kind planned in Phase 7 (money_in paid/unpaid, money_out paid/unpaid, settle receivable, settle payable, transfer between cash/bank accounts, owner investment, owner withdrawal/drawings, refund received, refund given) showing the debit and credit accounts; what "Simple Mode" label maps to which account type/subtype.
2. Default chart of accounts (server/src/modules/ledger/defaultChart.ts), ~35 accounts with code, name, type, subtype, simpleLabel, isSystem. Include at least:
   Assets: 1000 Cash in Hand (subtype cash), 1010 Bank Account (bank), 1020 UPI / Wallet Balance (bank), 1100 Accounts Receivable (receivable, system), 1200 GST Input – CGST, 1201 GST Input – SGST, 1202 GST Input – IGST (tax_asset, system), 1300 Advances & Deposits, 1500 Furniture & Equipment (fixed_asset).
   Liabilities: 2000 Accounts Payable (payable, system), 2100 GST Output – CGST, 2101 GST Output – SGST, 2102 GST Output – IGST (tax_liability, system), 2200 TDS Payable, 2300 Loans Payable, 2400 Credit Card Payable.
   Equity: 3000 Owner's Capital (system), 3100 Owner's Drawings (system), 3200 Retained Earnings (system), 3900 Opening Balance Equity (system).
   Income: 4000 Sales (goods), 4010 Service Revenue, 4100 Other Income, 4200 Interest Income.
   Expenses: 5000 Purchases / Cost of Goods, 6000 Rent, 6010 Electricity & Utilities, 6020 Internet & Phone, 6030 Salaries & Wages, 6040 Software & Subscriptions, 6050 Travel & Conveyance, 6060 Office Supplies, 6070 Professional Fees, 6080 Bank Charges, 6090 Marketing & Advertising, 6100 Repairs & Maintenance, 6110 Interest on Loans, 6900 Miscellaneous Expenses.
   Register an onBusinessCreated hook that seeds this chart inside the business-creation transaction. Write a one-off migration script to seed charts for businesses created before this phase.
3. JournalEntry model: businessId, entryNumber (per-business sequence "JE-000001" — use an atomic counters collection with findOneAndUpdate $inc inside the session), date (store as UTC midnight of the business-local date; document this), financialYear (e.g., "2026-27", computed), narration, source { type: "manual"|"transaction"|"invoice"|"bill"|"payment"|"reversal"|"opening_balance", id? }, lines [{ accountId, debitPaise, creditPaise, contactId?, memo? }], totalPaise, reversesEntryId?, reversedByEntryId?, createdBy, createdAt.
   - Schema-level validation: ≥ 2 lines; each line has exactly one of debitPaise/creditPaise > 0 (the other 0); all integers (Number.isSafeInteger); sum debits === sum credits === totalPaise > 0.
   - Immutability: a pre-hook blocks updateOne/findOneAndUpdate/replaceOne/delete on journalEntries EXCEPT the single permitted operation setting reversedByEntryId once (implement via a dedicated service method; block everything else and test it).
4. ledger.service (server/src/modules/ledger/ledger.service.ts):
   - post(businessId, input, { session, actorId }) → validates (balance; accounts exist, belong to the business, not archived; date inside an allowed range — not before business's first FY start, not more than 1 year in the future); assigns entryNumber; saves; writes audit "journal.posted". Must be called inside a session; if no session is passed, it starts and commits its own transaction.
   - reverse(businessId, entryId, { reason, actorId, session, date? }) → creates a mirror entry (debits↔credits), source "reversal", links both ways; rejects reversing an already-reversed entry or a reversal entry; audit "journal.reversed".
   - getAccountBalance(businessId, accountId, { asOf? }) → paise, signed by normal balance.
   - getTrialBalance(businessId, { from?, to? }) → per-account debit/credit totals and closing balances via an aggregation pipeline starting with $match { businessId }; returns totals and a boolean balanced.
   - getAccountLedger(businessId, accountId, { from, to, page }) → lines with running balance (paginated; opening balance as of 'from').
   - Financial-year utilities in shared: getFinancialYear(date, startMonth), fyRange("2026-27", startMonth).
5. Manual journal entries are NOT exposed to entrepreneurs in the UI (too error-prone). Provide the API POST /businesses/:businessId/journal-entries for owners only, behind a feature flag ALLOW_MANUAL_JOURNALS (default false) — it exists for opening balances and future CA adjustments.
6. Opening balances: POST /businesses/:businessId/opening-balances with { asOfDate, balances: [{ accountId, amountPaise }] } posting one entry against 3900 Opening Balance Equity. Allowed once (unless reversed). Simple UI: "Set starting balances" card on the CoA page asking only for Cash in Hand, Bank Account, and UPI balance.
7. Read APIs: GET /businesses/:businessId/accounts (requires "ledger:read"), GET .../accounts/:accountId/ledger, GET .../trial-balance, GET .../journal-entries (paginated, filters date/source), GET .../journal-entries/:id.
8. Accounts management: owners can add custom accounts (non-system; unique code within allowed ranges per type) and archive non-system accounts with zero balance. System accounts cannot be renamed, re-typed, or archived.
9. Business financial-year lock from Phase 5: implement the hook — locked once any journal entry exists.

--- E. FRONTEND REQUIREMENTS ---
/app/settings/accounts page "Chart of Accounts" (Professional label) / "Categories" (Simple label): grouped by type with balances (formatINR, tabular, right-aligned); Professional mode shows codes and account types; Simple mode shows simpleLabel and hides codes and system tax accounts behind a "Show advanced" toggle. Add custom account dialog; archive action with ConfirmDialog. "Set starting balances" card (shown only until opening balances are posted). Clicking an account opens its ledger (date, entry no., narration, debit, credit, running balance; paginated). Loading/empty/error states. Both themes.

--- F. BACKEND REQUIREMENTS ---
Module server/src/modules/ledger/ with routes, controller, service, defaultChart, counters, tests. All routes use authenticate + requireBusinessAccess(scope). Writes: owners only (check req.access.via === "owner").

--- G. DATABASE REQUIREMENTS ---
accounts: unique (businessId, code); index (businessId, type). journalEntries: unique (businessId, entryNumber); index (businessId, date); index (businessId, "lines.accountId", date). counters: { businessId, key, seq } unique (businessId, key). Apply tenantGuard to accounts and journalEntries.

--- H. INTEGRATION REQUIREMENTS ---
onBusinessCreated hook seeds chart; financial-year lock hook; requireBusinessAccess scopes; audit log. Phase 7 transactions will call ledger.post() inside their own session — design the API for that.

--- I. SECURITY REQUIREMENTS ---
Owners-only writes; CAs read only with "ledger:read". Server never trusts client-sent totals; recomputes. Paise integers validated as safe integers (max ₹90 trillion is plenty). All aggregations start with $match businessId.

--- J. TESTING REQUIREMENTS (target ≥ 95% line coverage for ledger.service) ---
Balanced entry posts; unbalanced → 400; single-line → 400; line with both debit and credit → 400; negative/fractional paise → 400; account from another business → 400 (not posted); archived account → 400; entry numbers sequential and unique under 20 concurrent posts (Promise.all); reverse creates mirror and links; double reverse → 409; direct update attempt on a journal entry throws; failure mid-transaction leaves no partial records (simulate by throwing after post inside a session); trial balance balanced after 50 random valid entries (property-style test with a seeded random generator); account balance sign by normal balance; financial-year computation for 31 Mar / 1 Apr boundaries and custom start months; opening balances once only; CA with ledger:read can read, cannot write; another business's owner → 404. Run; show output and coverage.

--- K. COMPLETION CRITERIA ---
New business automatically has ~35 accounts; opening balances post one balanced entry; trial balance balanced=true; journal entries cannot be edited (tested); coverage ≥ 95% on ledger.service; ACCOUNTING_RULES.md approved by me; CoA page works in both modes and themes; PROJECT_STATE.md updated.

--- L. FINAL AI INSTRUCTIONS ---
Plan first. Write ACCOUNTING_RULES.md and the default chart first and STOP for my review (I may show it to a CA). Then (6b) models + service + tests; (6c) routes + CoA page. Never use floating-point arithmetic on money anywhere — search the codebase for parseFloat/toFixed on money and report. Follow docs/AI_RULES.md. Run tests; show output. Update docs. Explain in beginner terms how one transaction becomes a balanced journal entry, using a worked ₹1,180 rent example.
```

**Git:** commit per sub-step → `git tag phase-6-complete`

**Checklist:** [ ] ACCOUNTING_RULES.md reviewed (ideally shown to a real CA) · [ ] Concurrent-posting test passes · [ ] Edit attempt on a journal entry fails · [ ] Trial balance always balanced · [ ] Coverage report ≥ 95% on ledger service
