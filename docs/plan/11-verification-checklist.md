# PART 11 — Final Verification Checklist

Use this as the master acceptance list. The Final Audit Prompt (10.9) checks the app against it.

### Foundation & quality
- [ ] Monorepo with client/server/shared; one command runs everything
- [ ] Env vars validated at startup; `.env` never in Git history
- [ ] All tests, lint, typecheck pass; Playwright demo E2E passes against production
- [ ] `docs/` (PROJECT_STATE, AI_RULES, ARCHITECTURE, DESIGN_SYSTEM, ACCOUNTING_RULES, SECURITY_REVIEW, DEPLOYMENT, DEMO_RUNBOOK) current

### Design & UX
- [ ] One design system; no raw hex colors in components
- [ ] Light/dark theme everywhere (pages, charts, tables, dialogs, toasts, PDFs preview), persisted to device and account, no flash
- [ ] Responsive at 360 / 768 / 1024 / 1440; sidebar collapses; tables become cards
- [ ] Loading, empty, error, success states on every data view
- [ ] No button without a working action; no placeholder pages without honest "coming in Phase N" labels
- [ ] Keyboard navigable; visible focus; WCAG AA contrast; axe checks clean on key pages

### Public site
- [ ] Home (hero, problem, for entrepreneurs, for CAs, workflow walkthrough, mode demo, trust, FAQ, CTA), Features, How It Works, About, Contact (persists), Privacy, Terms
- [ ] No false claims (filing, certifications, unbuilt features marked "Coming soon")

### Authentication & authorization
- [ ] Register with role (entrepreneur/CA), email verification, login, refresh, logout, logout-all, forgot/reset
- [ ] Admin only via seed script; registration cannot create admins
- [ ] Tokens: access in memory, refresh in httpOnly Secure cookie with rotation and reuse detection
- [ ] Rate limits and lockout; no user enumeration on reset
- [ ] Role-based redirects and guards
- [ ] Every business route enforces membership or active CA connection + scope; other tenants get 404 (automated sweep test)

### Business onboarding
- [ ] Wizard: name, structure, category, industry, size, address, state, contact, FY start, GST status/GSTIN (validated), PAN, language
- [ ] Business profile editable; FY start locked after first entry; audited

### Accounting core
- [ ] Default chart of accounts seeded per business; custom accounts; archive rules
- [ ] Journal entries balanced, immutable, numbered, reversible; MongoDB transactions used
- [ ] All money stored as integer paise; no float math (verified by search)
- [ ] Trial balance always balanced (tested with random sequences)
- [ ] Opening balances

### Transactions & contacts
- [ ] All kinds (money in/out paid/unpaid, transfer, owner investment/withdrawal, refunds) post correct entries
- [ ] Payment methods (cash, UPI, bank transfer, debit/credit card, cheque, other) validated against accounts
- [ ] Paid/unpaid with settlement; recurring templates; categories
- [ ] Edit = void-and-repost with visible history; void with reason
- [ ] Search/filter by date, category, amount, contact, method, status; URL-persisted; server pagination
- [ ] Idempotency prevents double entries
- [ ] Customers and suppliers with outstanding balances

### Sales, purchases, invoices (Track B)
- [ ] Items with HSN/SAC; tax rates as data
- [ ] GST invoices: numbering per FY, CGST/SGST vs IGST by place of supply, discounts, round-off, amount in words, PDF frozen at issue
- [ ] Statuses draft/issued/partially paid/paid/overdue/cancelled; credit notes; quotations
- [ ] Customer payments with allocation and advances
- [ ] Bills from uploads; supplier payments; debit notes; AP
- [ ] AR/AP on dashboard match open documents

### Reports
- [ ] Dashboard metrics from ledger; Simple/Pro modes change labels only
- [ ] P&L (with comparison), Balance Sheet (balances), Cash Flow (reconciles), Trial Balance, General Ledger, AR/AP aging, sales/purchase/expense reports
- [ ] Date range presets; PDF and Excel exports matching on-screen totals

### GST (Track B)
- [ ] GSTIN checksum validation; registration types
- [ ] Output/input summaries, rate-wise, HSN/SAC, B2B/B2C
- [ ] Potential ITC register with CA eligibility marking; wording never claims eligibility
- [ ] Compliance calendar as editable data with "confirm with your CA"; reminders
- [ ] No filing or portal-integration claims

### CA features
- [ ] CA profile wizard; certificate upload; admin manual verification (approve/reject/revoke, reasons, audit)
- [ ] Verified badge only when verified; sensitive CA fields never public
- [ ] Invite-your-CA by email (works for new CAs); directory of verified CAs with filters; requests; accept/decline
- [ ] Scopes editable by entrepreneur; revocation immediate; CA can disconnect
- [ ] CA dashboard with real counts; client directory; client workspace (overview, ledger, documents, reports, reviews, messages, tasks, GST) read-only and scope-aware

### Collaboration
- [ ] Review workflow: draft, submitted, under review, needs clarification, approved, rejected, withdrawn, closed; valid transitions only; notes/reasons required where specified
- [ ] Immutable history with actor, note, revision, timestamps; comments with references
- [ ] Clarification loop with corrected document versions or edited transactions
- [ ] Messaging per connection with record references and attachments (Track B)
- [ ] Tasks with document requests, verification, history (Track B)

### Documents
- [ ] Upload with magic-byte validation and size limits; private storage; no tokens/public links in URLs
- [ ] Categories, financial year, versions, links to transactions/invoices/bills/reviews/tasks
- [ ] Preview (PDF/images), download, soft delete with review protection, access audit

### Notifications
- [ ] DB-stored; bell with unread count; center page; mark read/all; polling; real-time (Track B)
- [ ] All key events covered for entrepreneurs, CAs, admins; never cross-tenant
- [ ] Email notifications with preferences and unsubscribe (Track B); reminders (overdue, recurring, tasks, GST)

### Intelligent features (Track B)
- [ ] AI assistant answers with numbers identical to reports, links to sources, disclaimers, CA recommendation
- [ ] AI never writes data; businessId never from model; identifiers redacted; usage limits; consent
- [ ] Category suggestions and bill extraction require user confirmation
- [ ] English/Tamil/Hindi throughout (UI, emails, notifications, AI); glossary reviewed by native speakers
- [ ] Voice entry with transcript review and mandatory confirmation
- [ ] Learning hub with lessons, quizzes, progress, glossary; habit gamification without spending rewards

### Admin
- [ ] User management (suspend, force logout), CA verification, support tickets, audit explorer, platform health, feature flags; 2FA for admins

### Security, privacy, operations
- [ ] OWASP review documented with evidence; headers; CSP; rate limits; dependency scanning
- [ ] 2FA available; data export; account/business deletion; consent records; data inventory; incident response doc
- [ ] Backups configured and restore tested; staging environment; CI/CD with approvals; monitoring and alerts; runbooks
- [ ] Legal pages reviewed by counsel before real users; ACCOUNTING_RULES and GST rules reviewed by a CA

### Future (tracked, not required)
- [ ] Inventory · Eco-expense tracking · Funding readiness · Multi-business switcher · Teams · CA-proposed adjustments · Bank import/reconciliation · GST portal integration · Billing
