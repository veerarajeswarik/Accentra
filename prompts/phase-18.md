<!-- Track B · Phase 18 -->
## PHASE 18 — Purchases, Bills & Payables

```text
=== ACCENTRA — PHASE 18: PURCHASES, SUPPLIER BILLS & ACCOUNTS PAYABLE ===

You are a senior full-stack engineer with accounting expertise, mirroring the sales module's rigour for purchases.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS). Sales/invoicing (Phase 16) and GST (Phase 17) exist. Entrepreneurs receive bills from suppliers (often as photos/PDFs) and need to record them, track what they owe, pay them, and give their CA documentary evidence for input tax.

--- B. EXISTING PROJECT STATE ---
Phases 1–17 complete. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md, DESIGN_SYSTEM.md, ACCOUNTING_RULES.md. Inspect invoices (reuse patterns and shared tax math), contacts, documents, GST ITC register, transactions (money_out unpaid). Report divergences first.

--- C. IMPLEMENTATION OBJECTIVE ---
Supplier bills with line items and input GST, bill-from-upload workflow, supplier payments with allocation, debit notes, AP tracking, purchase reports, and ITC register population.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Bill fields: supplier (contact), supplier invoice number (unique per supplier within business — warn on duplicate), bill date, due date, place of supply, reverse-charge flag (record only; posting treatment documented as an assumption for CA review), lines (description, HSN/SAC, qty, rate, discount, tax rate, expense or asset account per line — default from item or supplier's last-used category), totals, attached document(s) (required for ITC "invoice uploaded" flag), notes, status (draft, open, partially_paid, paid, cancelled; overdue computed).
2. "Create bill from upload": from a purchase document (documents page or upload dialog) → bill editor opens side-by-side with the document preview; entrepreneur types values (AI extraction arrives in Phase 21 — leave an extraction-suggestion slot that is hidden until then).
3. Postings (update ACCOUNTING_RULES.md first): Dr expense/asset accounts (taxable values) + Dr GST Input CGST/SGST/IGST / Cr Accounts Payable (contactId); payment: Dr AP / Cr cash/bank; supplier advance account for over-payments (add "Supplier Advances" asset account with migration); debit note reverses proportionally; cancellation reverses.
4. Supplier payments with allocation to bills (oldest first default), mirroring customer payments.
5. ITC register (Phase 17) now lists bill tax lines with flags.
6. Purchase reports: purchases by supplier, by category, by month; supplier statement of account; payables list sorted by due date.
7. UI: /app/purchases tabs Bills · Payments · Suppliers; bill detail with document preview, payments, history, "Submit for CA review" (add "bill" as review subject); dashboard "Bills to pay" includes open bills automatically via AP.
8. Compatibility: Phase 7 "money_out unpaid" items continue to work and share the AP account.

--- E/F/G/H/I ---
Follow Phase 16 patterns exactly (features/purchases; modules bills/, supplier-payments/; owner-only writes; transactional; audited; idempotency keys; tenantGuard; server-side recomputation; CA read under ledger:read; review subject "bill").

--- J. TESTING ---
Posting tests for bill, partial/full payment, advance, debit note, cancellation; duplicate supplier invoice number warning; ITC register population and totals; trial balance balanced after mixed sales+purchases sequence of 50 operations; AP on dashboard equals open bills + legacy unpaid money_out. Run; show output.

--- K. COMPLETION ---
Bills recorded from uploads, paid, and reviewed; AP correct; ITC register populated; reports correct; PROJECT_STATE.md updated.

--- L. FINAL AI INSTRUCTIONS ---
Plan first; STOP after updating ACCOUNTING_RULES.md for review. Sub-steps: (18a) backend + postings + tests; (18b) payments + debit notes; (18c) UI + bill-from-upload; (18d) reports + review subject. Follow docs/AI_RULES.md. Run tests; show output. Update docs. Report changes.
```

**Git:** → `git tag phase-18-complete`
