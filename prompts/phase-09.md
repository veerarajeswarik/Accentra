<!-- Track A · Phase 9 -->
## PHASE 9 — Entrepreneur Dashboard, P&L Summary & Simple/Professional Mode

**Objective:** The financial command centre — every number computed from the ledger.
**Prerequisites:** Phase 7 (Phase 8 for "documents" widgets).

```text
=== ACCENTRA — PHASE 9: ENTREPRENEUR DASHBOARD & PROFIT-AND-LOSS SUMMARY ===

You are a senior full-stack engineer and data-visualisation-minded product designer. Build a dashboard whose every number is traceable to journal lines — no cached totals, no placeholder values.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS). Entrepreneurs (often non-accountants) need to understand their business at a glance in Simple Mode; CAs and advanced users see the same numbers in Professional Mode.

--- B. EXISTING PROJECT STATE ---
Phases 1–8 complete: ledger, transactions, contacts, documents. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md, DESIGN_SYSTEM.md, ACCOUNTING_RULES.md. Inspect ledger.service (getTrialBalance etc.) and the DataTable/StatCard/ChartCard components.

--- C. IMPLEMENTATION OBJECTIVE ---
A reports service computing period metrics from journal lines, a dashboard API, the /app dashboard page, and a Profit & Loss page with date ranges — all mode-aware.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. reports.service (server/src/modules/reports/), all functions take (businessId, params) and aggregate journalEntries lines joined to accounts (aggregation beginning with $match businessId and date range; exclude nothing — reversals naturally cancel):
   - getProfitAndLoss({ from, to }) → income accounts (credit − debit) and expense accounts (debit − credit), grouped by account with totals: totalIncomePaise, totalExpensesPaise, netProfitPaise.
   - getCashPosition({ asOf }) → balances of cash/bank subtype accounts and total.
   - getReceivablesTotal({ asOf }) and getPayablesTotal({ asOf }) → AR/AP balances; plus top 5 contacts by outstanding.
   - getMonthlyTrend({ months: 12, endDate }) → per month income, expenses, net (fill missing months with zeros).
   - getExpenseBreakdown({ from, to, top: 6 }) → top expense accounts + "Other".
   Each function has unit tests against hand-calculated fixtures.
2. GET /businesses/:businessId/dashboard?period=this_month|last_month|this_quarter|this_fy|custom&from&to → { period, metrics: { incomePaise, expensesPaise, netProfitPaise, cashBalancePaise, receivablesPaise, payablesPaise, previousPeriod: {...same three P&L metrics} }, trend: [...], expenseBreakdown: [...], recentTransactions: [last 8 non-voided], attention: [...] }.
   "attention" list (each item has type, title, count or amount, link): unpaid money_out older than 30 days (bills overdue), unpaid money_in older than 30 days (payments overdue), recurring templates due this month, transactions without attachments in the last 30 days above ₹5,000 (configurable) with text "Add receipts so your CA can verify them", documents awaiting CA review (returns 0 until Phase 14 — implemented via a provider hook).
3. GET .../reports/profit-and-loss?from&to&compare=previous_period|previous_year|none → P&L with optional comparison column and % change.
4. Dashboard page /app:
   - Header: greeting with business name, period selector (segmented: This month · Last month · This quarter · This FY · Custom range), ModeToggle visible.
   - Row of StatCards (4 on xl, 2 on sm, 1 on xs): Simple labels "Money In", "Money Out", "Profit", "Total Balance"; Pro labels "Revenue", "Expenditure", "Net Profit", "Cash & Bank". Delta vs previous period with arrow, sign, and % (Profit card handles negative-to-positive sign flips sensibly; show "—" when previous is zero).
   - Second row: "Payments to Receive / Accounts Receivable" and "Bills to Pay / Accounts Payable" cards with top contacts and links to filtered transaction lists.
   - Main chart (ChartCard): 12-month bar chart (income vs expenses) with net line; theme-aware colors; tooltip ₹ formatting; sr-only text summary; empty state "Record transactions to see your trend".
   - Side panel "Needs your attention": the attention items with icons and links; empty state "You're all caught up".
   - Expense breakdown donut or horizontal bar (horizontal bar preferred for readability) with legend and amounts.
   - Recent transactions mini-table with "View all".
   - Quick actions: Money In, Money Out, Upload document.
   - Every card links to the list/report it summarises (traceability).
   - Brand-new business: a guided empty state (checklist: set starting balances, record first transaction, upload a receipt, invite your CA [link disabled with "available soon" until Phase 11]).
5. P&L page /app/reports (Simple title "How is my business doing?"; Pro title "Profit & Loss Statement"): date range + comparison select; Simple Mode shows grouped plain-language sections (Money In by type, Money Out by type, What's left) with a short explanation line under each; Pro Mode shows a conventional statement (Revenue, Cost of goods, Gross profit, Operating expenses, Net profit) with account codes, comparison column, % change; clicking an account opens its ledger for that range. Print-friendly CSS (exports to PDF/Excel come in Phase 19 — show the buttons ONLY if implemented; otherwise omit them).
6. Mode semantics: switching mode changes labels, grouping, and detail level only — the numbers must be identical (add a test rendering both modes with the same data and comparing totals).

--- E. FRONTEND REQUIREMENTS ---
features/dashboard and features/reports. TanStack Query with period in the query key; period persisted in the URL. Skeletons matching the layout. Recharts via useChartColors. Responsive; both themes; all strings via t() (term keys via useTerm).

--- F. BACKEND REQUIREMENTS ---
Routes require "reports:read" (owners have all scopes; CAs once connected). Validate date ranges (from ≤ to; max 5 years). Use the business timezone (Asia/Kolkata) for period boundaries; put period computation in shared so client and server agree.

--- G. DATABASE REQUIREMENTS ---
No new collections. Verify the (businessId, date) and ("lines.accountId") indexes are used — run explain() on the main aggregation and report the plan summary. If aggregation on large data is slow, document (do not implement yet) a future monthly balance snapshot strategy in ARCHITECTURE.md.

--- H. INTEGRATION REQUIREMENTS ---
Attention provider hook for documents awaiting review (Phase 14 fills it). Onboarding checklist item "Invite your CA" activates in Phase 11 via the featureStatus config.

--- I. SECURITY REQUIREMENTS ---
Tenant + scope checks; aggregation $match on businessId first; no client-supplied account filters without validation.

--- J. TESTING REQUIREMENTS ---
Fixture business with a known set of 25 transactions (including an edited and a voided one, settled and unsettled items, a transfer, owner investment and withdrawal): assert P&L totals, cash position, AR/AP, monthly trend, expense breakdown exactly against hand-calculated values; transfers and owner investments do NOT appear as income/expenses; voided transactions do not affect totals; dashboard of another business → 404; mode rendering test as above. Run; show output.

--- K. COMPLETION CRITERIA ---
Dashboard numbers equal the P&L page and the trial balance for the same period (I will check manually with 5 transactions); no hardcoded numbers anywhere (search the code for numeric literals in dashboard components and report); new-business empty state works; both modes, both themes, mobile layout correct; PROJECT_STATE.md updated.

--- L. FINAL AI INSTRUCTIONS ---
Plan first. Sub-steps: (9a) reports.service + tests; (9b) dashboard API + page; (9c) P&L page. Follow docs/AI_RULES.md. Run tests; show output. Update docs. Report changes and give me a 5-transaction manual verification exercise with the expected numbers.
```

**Git:** → `git tag phase-9-complete`

**Checklist:** [ ] Dashboard = P&L = trial balance for the same range · [ ] Transfers not counted as income · [ ] Mode switch changes words, never numbers · [ ] Empty state for a new business
