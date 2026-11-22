<!-- Track B · Phase 17 -->
## PHASE 17 — GST Module

**Objective:** GST-aware records, summaries, potential ITC, and deadline reminders — without claiming to file returns.
**Prerequisites:** Phase 16.

```text
=== ACCENTRA — PHASE 17: GST ASSISTANCE MODULE (RECORDS, SUMMARIES, POTENTIAL ITC, REMINDERS) ===

You are a senior engineer with Indian GST domain knowledge, working conservatively. Accentra organises GST information and helps CAs review it. It does NOT file returns, does NOT connect to the GST portal, and does NOT assert that Input Tax Credit is claimable.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS). Sales invoices with CGST/SGST/IGST exist (Phase 16). Purchases with tax lines arrive in Phase 18 — design summaries to include them automatically when present.

--- B. EXISTING PROJECT STATE ---
Phases 1–16 complete. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md, DESIGN_SYSTEM.md, ACCOUNTING_RULES.md. Inspect shared tax math, taxRates, invoices, business GST settings, Phase 5 GSTIN TODO. Report divergences before planning.

--- C. IMPLEMENTATION OBJECTIVE ---
Full GSTIN validation, GST settings, GST summaries by period (output tax, input tax, net position), rate-wise and HSN/SAC-wise summaries, potential ITC register with eligibility flags reviewable by the CA, compliance calendar with configurable obligations, reminders, exports for the CA, and clear disclaimers.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. GSTIN validation (shared): 15 characters; state code (first two digits) valid; characters 3–12 match PAN format; 13th entity number; 14th 'Z' by default (accept per specification); 15th checksum using the official mod-36 checksum algorithm — implement and test with known-valid and invalid samples (generate structurally valid test GSTINs in tests; never use real businesses' GSTINs in fixtures). Replace the Phase 5 TODO.
2. GST settings (/app/settings/gst): registration type (regular, composition, unregistered), GSTIN, registration date, filing frequency for GSTR-1 (monthly or quarterly — QRMP), state. Composition businesses: invoices become "Bill of Supply" without tax collection; output tax summaries show composition turnover instead (document the simplified treatment as an assumption for CA review).
3. Summaries (/app/gst): period selector (month/quarter/FY), cards: Output tax (CGST, SGST, IGST), Input tax recorded (from purchases; zero until Phase 18), Net position (output − potential ITC) with a prominent label "Estimate for review with your CA — not a filing". Tables: rate-wise summary (taxable value and tax per rate), HSN/SAC summary, B2B vs B2C split (by presence of customer GSTIN), inter-state vs intra-state.
4. Potential ITC register: every purchase tax line (Phase 18) appears with flags: supplier GSTIN present and valid?, invoice uploaded?, CA marked eligible? (CA action: mark eligible / ineligible with reason / needs info). Totals: recorded, CA-marked eligible, unreviewed. Wording everywhere: "potential", "recorded", never "claimable" unless CA-marked, and even then "marked eligible by your CA".
5. Compliance calendar: a GstObligation rules table (data, editable by admins — seeded with commonly referenced obligations: GSTR-1 (monthly/quarterly), GSTR-3B, CMP-08 for composition, annual return) storing name, frequency, due day rule, applicable registration types. IMPORTANT: due dates change by notification; store them as data with an "effective from" date, show "Last verified on <date> — confirm with your CA" in the UI, and give admins a screen to update rules. Do not hardcode dates in code.
6. Reminders: generate upcoming obligations for each GST-registered business (next 60 days) and create notifications 7 days and 1 day before (job design: an in-process scheduler for now — node-cron or a simple interval; idempotent per obligation/business/period; document moving to a managed scheduler).
7. CA view: GST tab in the client workspace (requires reports:read) with summaries, ITC register with CA actions (requires reviews:manage for marking), and "Export for filing preparation" (Excel via exceljs: sheets for B2B invoices, B2C summary, HSN summary, rate-wise summary, ITC register) — labelled as a working file for the CA, not a portal upload format.
8. Disclaimers component (GstDisclaimer) shown on every GST screen and export cover sheet.

--- E/F/G ---
Frontend: features/gst for both roles; both modes (Simple: "Tax you collected", "Tax you paid on purchases"), themes, responsive, t().
Backend: module gst/ with summary, ITC register, CA marking, obligations, calendar, export endpoints; all business-scoped with appropriate scopes; owner settings writes; admin obligation-rule CRUD.
Database: gstSettings (embedded in business is acceptable — choose and justify), itcAssessments (purchase tax line ref, status, reason, byCaUserId, at), gstObligationRules (admin-managed), gstReminders (unique business+obligation+period). tenantGuard where business-owned.

--- H. INTEGRATION ---
Invoices and (later) bills; notifications; CA workspace; dashboard attention item "GST deadline in N days"; CA dashboard upcomingDeadlines provider (implement the Phase 12 hook).

--- I. SECURITY / COMPLIANCE ---
No filing or portal claims; data-driven rules; CA-only eligibility marking; exports require reports:read.

--- J. TESTING ---
GSTIN checksum (valid/invalid/state mismatch); summaries match hand-calculated fixtures for intra/inter-state, multiple rates, credit notes, cancelled invoices excluded; composition handling; reminder generation idempotent; obligation rule effective dates; Excel export contains expected sheets and totals (read back in test); CA marking requires scope. Run; show output.

--- K. COMPLETION ---
GST page totals equal sums from invoice tax lines; ITC register ready for purchases; calendar shows upcoming obligations with "confirm with your CA" wording; reminders created; exports open in Excel; PROJECT_STATE.md updated.

--- L. FINAL AI INSTRUCTIONS ---
Plan first, including the GSTIN checksum algorithm explanation and the seeded obligation rules with a note that I must verify each against the official GST portal or with a CA before release. Sub-steps: (17a) GSTIN + settings; (17b) summaries; (17c) ITC register + CA marking; (17d) calendar + reminders; (17e) exports. Follow docs/AI_RULES.md. Run tests; show output. Update docs. Report changes.
```

**Git:** → `git tag phase-17-complete` · **Human step:** verify seeded obligation rules against official sources or with a CA.
