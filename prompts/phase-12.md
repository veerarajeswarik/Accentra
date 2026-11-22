<!-- Track A · Phase 12 -->
## PHASE 12 — CA Dashboard & Client Workspace

**Objective:** CAs manage all clients from one workspace, seeing only what each client shared.
**Prerequisites:** Phase 11.

```text
=== ACCENTRA — PHASE 12: CA DASHBOARD & CLIENT WORKSPACE ===

You are a senior full-stack engineer designing a professional workspace for accountants who manage dozens of clients. Efficiency, density, and strict per-client isolation are the priorities.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS). CAs access client businesses through active connections with scopes. They read (not write) the ledger, documents, and reports. Review workflows arrive in Phase 14; leave clearly defined slots for them.

--- B. EXISTING PROJECT STATE ---
Phases 1–11 complete. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md, DESIGN_SYSTEM.md, ACCOUNTING_RULES.md. Inspect connections, reports.service, ledger read APIs, documents read APIs, caNav, and how features/transactions and features/documents components are structured (you will REUSE them in read-only mode, not copy them).

--- C. IMPLEMENTATION OBJECTIVE ---
CA dashboard with real cross-client stats; client directory; per-client workspace with tabs Overview, Transactions & Ledger, Documents, Reports (Reviews, Messages, Tasks tabs come later); reuse existing feature components with a readOnly/professional presentation.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. GET /ca/dashboard → { activeClients, pendingRequests, invitationsPending, clientsWithRecentActivity (last 7 days, top 5: business name, last activity type/date), reviewStats (returns zeros until Phase 14 via provider hook), upcomingDeadlines (empty until Phase 17/20 via provider hook) }. Computed with queries scoped to the CA's active connections only.
2. /ca dashboard page: StatCards (Active clients, Pending requests, Reviews awaiting you [Phase 14], Needs client response [Phase 14]); "Recent client activity" list; "Requests & invitations" summary with link; pending-verification banner if the CA isn't verified (they can still serve invited clients).
3. GET /ca/clients?search&status → list of connections with business summary (name, category, city, connected since, scopes, last activity date, counts of transactions in last 30 days and documents uploaded in last 30 days). /ca/clients page: DataTable with search, sort, and row click to workspace.
4. Client workspace /ca/clients/:businessId (layout with client header: business name, category, GSTIN if shared under ledger:read, connected since, scope chips; tab navigation; tabs whose scope isn't granted appear disabled with tooltip "Not shared by client"):
   - Overview (reports:read): the same metrics as the entrepreneur dashboard, ALWAYS in Professional Mode, plus "Data health" checks: transactions without attachments above threshold, unpaid items older than 60 days, uncategorized/miscellaneous expense share > 15% of expenses, trial balance balanced flag.
   - Transactions & Ledger (ledger:read): the existing transactions list component in readOnly mode (no create/edit/void/settle controls rendered at all), Pro labels, filters; detail drawer shows journal lines and attachments (if documents:read). Sub-tab Chart of Accounts with balances and account ledger drill-down; sub-tab Trial Balance.
   - Documents (documents:read): existing documents list/preview in readOnly mode.
   - Reports (reports:read): P&L (Pro mode) with date range and comparison.
   - Reviews / Messages / Tasks tabs: visible but showing "Available in a later release" panels driven by featureStatus config (no fake content).
5. The CA's BusinessProvider context switches per client route; React Query keys MUST include businessId so data from client A can never render on client B's page (test by switching quickly between clients).
6. Make readOnly a first-class prop/context (e.g., <WorkspaceAccess value={{ canWrite: false, mode: "professional" }}>) consumed by feature components, rather than duplicating components. Server still enforces read-only regardless of UI.

--- E. FRONTEND REQUIREMENTS ---
features/ca-dashboard, features/ca-clients; reuse transactions, documents, reports components. Dense professional layout; responsive; both themes; t().

--- F. BACKEND REQUIREMENTS ---
Module ca-workspace/ (or extend connections/): GET /ca/dashboard, GET /ca/clients. All other client data uses existing business-scoped routes protected by requireBusinessAccess(scope). Add GET /businesses/:businessId/data-health (reports:read) to reports module.

--- G. DATABASE REQUIREMENTS ---
No new collections. Add indexes only if explain() shows a collection scan on the new queries; report.

--- H. INTEGRATION REQUIREMENTS ---
Provider hooks for review stats and deadlines; featureStatus drives future tabs.

--- I. SECURITY REQUIREMENTS ---
Every client-data request passes requireBusinessAccess with the correct scope. No write endpoints reachable by CAs (add a test that iterates all business-scoped write routes with a CA token and expects 403/404). Query-key isolation on the client.

--- J. TESTING REQUIREMENTS ---
CA with two clients sees both; data of client A never returned for client B; tab scope enforcement (UI disabled + API 404); CA write attempts on every write route rejected; dashboard counts correct with fixtures; data-health checks computed correctly. Client test: switching businessId changes query keys. Run; show output.

--- K. COMPLETION CRITERIA ---
A CA with two connected demo businesses can browse each workspace, read ledger/docs/P&L, and never see write controls; removing a scope disables the tab on next load; PROJECT_STATE.md updated.

--- L. FINAL AI INSTRUCTIONS ---
Plan first. Sub-steps: (12a) backend + readOnly infrastructure; (12b) dashboard + clients list; (12c) client workspace tabs. Follow docs/AI_RULES.md; reuse components, do not duplicate. Run tests; show output. Update docs. Report changes.
```

**Git:** → `git tag phase-12-complete`

**Checklist:** [ ] No write controls for CAs anywhere · [ ] Scope-disabled tabs · [ ] Fast client switching shows correct data
