<!-- Track B · Phase 16 -->
## PHASE 16 — Sales, Invoicing & Receivables

**Objective:** Professional GST-ready sales invoices with numbering, statuses, PDF, payments, and accurate receivables.
**Prerequisites:** Phases 7, 8 (GST calculation is built here at line level; Phase 17 adds the GST module around it).

```text
=== ACCENTRA — PHASE 16: SALES, INVOICING & ACCOUNTS RECEIVABLE ===

You are a senior full-stack engineer with Indian invoicing and accounting expertise. Invoices are legal documents and accounting events; numbering, tax math, and postings must be exact.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS), accounting + CA collaboration for Indian SMBs. Ledger, transactions, contacts, documents, reviews exist. All money in integer paise. The ledger service is the only financial writer.

--- B. EXISTING PROJECT STATE ---
Track A (Phases 1–15) complete and deployed. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md, DESIGN_SYSTEM.md, ACCOUNTING_RULES.md. Inspect ledger, transactions (settle flow), contacts (stateCode, gstin), documents (PDF storage), reviews (subject types). If anything below conflicts with the code, report it before planning.

--- C. IMPLEMENTATION OBJECTIVE ---
Items catalogue (products/services), quotations (optional convert to invoice), sales invoices with GST lines, invoice numbering per financial year, statuses, PDF generation, sending by email, customer payments (full and partial, allocation), credit notes, AR aging-ready data, and "invoice" as a review subject.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Items: name, type (goods | service), HSN (goods) / SAC (service) code (format validation only), unit (nos, kg, hr, etc.), default rate (paise), default GST rate (from the business's configured tax-rate list — create a TaxRate collection seeded with commonly used slabs and editable by the owner; never hardcode rates in logic), income account (default Sales or Service Revenue). Archive instead of delete.
2. Invoice fields: number (series prefix configurable, default "INV/2026-27/0001"; atomic counter per business+FY; unique), date, due date (from payment terms: on receipt, 7, 15, 30, 45, 60 days, custom), customer (contact), billing details snapshot (name, address, GSTIN, state) captured at issue time, place of supply (state; default customer's state), line items [{ itemId?, description, hsnSac, quantity (up to 3 decimals stored as integer thousandths), unit, ratePaise, discount (percent with 2 decimals stored as basis points, or amount paise), taxRateId, taxable value, CGST/SGST or IGST amounts }], notes, terms, bank/UPI payment instructions (from business settings), totals (subtotal, discount, taxable, CGST, SGST, IGST, round-off, grand total), amount in words (Indian numbering: lakh, crore), status.
3. Tax math (put in shared/ as pure functions with exhaustive tests): intra-state (business state === place of supply) → CGST = SGST = half the rate each; inter-state → IGST full rate. Rounding: compute tax per line in paise using banker's-safe integer math (round half up at the paise level per line; document the choice), sum lines; invoice-level round-off to nearest rupee as a separate "Round off" amount (configurable on/off). Business not GST-registered → no tax lines allowed; invoice titled "Bill of Supply"/"Invoice" accordingly (document assumption for CA review). GSTIN-related display: show business and customer GSTIN when present.
4. Statuses: draft → issued → partially_paid → paid; issued/partially_paid → overdue (computed when due date passed and balance > 0 — compute on read, don't store a stale flag; or store with a daily job — choose and justify); issued → cancelled (only if no payments; posts reversal). Drafts are editable; issued invoices are NOT editable — corrections via credit note or cancel-and-reissue (explain to the user in UI).
5. Postings (add to ACCOUNTING_RULES.md first): issue → Dr Accounts Receivable (with contactId) / Cr income accounts per line (taxable values) / Cr GST Output CGST/SGST/IGST; payment received → Dr cash/bank / Cr AR; credit note → reverse proportional lines; cancellation → reversal of the issue entry; round-off → separate account "Round Off" (add 6950 Round Off to the default chart with a migration for existing businesses).
6. Payments: record against a customer with amount, date, method, account, reference; allocate to one or many open invoices (auto-allocate oldest first, editable); unallocated amount becomes customer advance (Cr Customer Advances liability account — add to chart with migration). Invoice balance = total − allocations − credit notes.
7. Integration with Phase 7 transactions: existing "money_in unpaid" items remain valid; new UI encourages invoices for credit sales. The AR balance is the same ledger account for both. Do not migrate or duplicate old records.
8. PDF: server-side with pdfkit; professional layout (business logo optional — upload in business settings; business details; "TAX INVOICE" title for GST-registered; invoice meta; bill-to; table; tax summary by rate; totals; amount in words; payment instructions; signature line "Authorised Signatory"; footer "Generated by Accentra"). Store the generated PDF as a Document (category invoice_sales) linked to the invoice; regenerate only for drafts (issued invoices keep their original PDF, ensuring the record shown to the customer is frozen).
9. Send invoice: email to customer via adapter with the PDF attached and a short message; record sentAt and sentTo in history. (WhatsApp sharing: "Copy share text" with invoice details only — no WhatsApp API integration; do not claim one.)
10. Quotations: same editor; statuses draft, sent, accepted, declined, expired; "Convert to invoice" copies lines into a new draft invoice. No ledger postings.
11. UI: /app/sales with tabs Invoices · Quotations · Payments · Items; invoice editor as a full page (two-column: editor + live preview of totals, sticky footer with Save draft / Issue); invoice detail page with status, actions (Record payment, Send, Download PDF, Create credit note, Cancel, Submit for CA review), payments list, history Timeline. Customer detail page gains invoices and statement of account (opening balance, invoices, payments, closing balance for a date range).
12. Reviews: add "invoice" as a review subject type (snapshot: number, total, customer).

--- E. FRONTEND REQUIREMENTS ---
features/sales (invoices, quotations, payments, items). Quantity and discount inputs avoid floating point (convert to integers on input). Both modes (Simple labels: "Bills I've sent", "Money owed to me"), themes, responsive (editor stacks on mobile), t().

--- F. BACKEND REQUIREMENTS ---
Modules items/, invoices/, quotations/, payments/ (or sales/ with sub-routers — choose consistently with the codebase). All writes owner-only, transactional, audited, idempotency keys on create endpoints. CA read access under ledger:read; PDFs under documents:read.

--- G. DATABASE REQUIREMENTS ---
items, taxRates, invoices (unique (businessId, number); indexes (businessId, status, dueDate), (businessId, contactId, date)), quotations, customerPayments with allocations, creditNotes, counters reuse. tenantGuard on all.

--- H. INTEGRATION REQUIREMENTS ---
Ledger, contacts (balances now include invoices — verify the outstanding computation still uses AR lines and is therefore automatically correct), documents (PDF), reviews (subject type), dashboard (receivables now include invoice AR automatically via ledger; "pending invoices" attention item: overdue invoices count and amount).

--- I. SECURITY REQUIREMENTS ---
Server recomputes all totals and taxes; client totals are display-only. Issued invoices immutable. Numbers never reused (cancelled invoices keep their numbers). Email sending rate-limited.

--- J. TESTING REQUIREMENTS ---
Tax math: intra vs inter-state, multiple rates on one invoice, discounts (percent and amount), quantity with decimals, round-off, zero-rated items, unregistered business. Posting tests for issue, payment (full/partial/over-payment → advance), credit note, cancellation; trial balance balanced after each. Numbering under concurrency (20 parallel issues, no duplicates, no gaps except documented cancelled). Issued invoice edit → 409. PDF generated and stored; content contains invoice number and totals (parse text in test). Amount in words for 0, 1, 1,00,000, 12,34,56,789.50. Run; show output.

--- K. COMPLETION CRITERIA ---
Create, issue, send, partially pay, fully pay, credit-note, and cancel invoices with correct ledger effects; AR on the dashboard equals the sum of open invoice balances plus legacy unpaid money_in items; PDF looks professional in print preview; ACCOUNTING_RULES.md updated; PROJECT_STATE.md updated.

--- L. FINAL AI INSTRUCTIONS ---
Plan first, including updated ACCOUNTING_RULES.md posting tables; STOP for my review of the tax math and posting rules (I will check with a CA). Sub-steps: (16a) shared tax math + tests; (16b) items + tax rates; (16c) invoices backend + postings + tests; (16d) payments + credit notes; (16e) UI; (16f) PDF + email + reviews integration. Follow docs/AI_RULES.md. Run tests; show output. Update docs. Report changes.
```

**Git:** commit per sub-step → `git tag phase-16-complete`
