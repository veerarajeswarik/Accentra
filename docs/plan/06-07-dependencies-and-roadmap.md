# PART 6 — Feature Dependencies

### 6.1 Dependency graph (critical path in bold)

```
**Foundation (1)** ─► **Design system (2)** ─► Public site (3)
        │                    │
        ▼                    ▼
**Auth (4)** ─────────► **Business onboarding + tenancy (5)** ─► **Ledger core (6)** ─► **Transactions (7)**
        │                    │                                        │                  │
        │                    ├─► **Documents (8)** ◄───────────────────┼──────────────────┘
        │                    │                                        ▼
        │                    │                              **Dashboard + P&L summary (9)**
        ▼                    │
CA profile (10) ─► Admin verification (10) ─► **CA connections (11)** ─► **CA workspace (12)**
                                                     │
                                  Notifications (13) ┤
                                                     ▼
                                       **Review workflow (14)** ─► **Hardening + deploy + demo (15)**
                                                                       │
            ┌──────────────┬─────────────┬──────────────┬─────────────┤ Track B
            ▼              ▼             ▼              ▼             ▼
      Invoicing (16) ► GST (17)   Purchases (18) ► Reports (19)   Messaging+Tasks+Real-time (20)
            │                                          │
            └──────────────────────────► AI assistant (21) ─► Multilingual (22) ─► Voice (23)
                                                     Learning hub (24) · Admin full (25)
                                                     Security hardening (26) ─► Production launch (27)
```

### 6.2 Why this order (the non-obvious decisions)

1. **Design system before any page.** If pages come first, every page invents its own buttons, and theme switching breaks on half of them. Phase 2 builds the components; every later prompt says "reuse, don't recreate."
2. **i18n scaffold in Phase 2, translations in Phase 22.** All UI text goes through `t('key')` from day one. Retrofitting i18n means touching every file.
3. **Tenancy (`businessId` + `requireBusinessAccess`) before any financial data.** Adding data isolation later means auditing every query. Doing it first means every module inherits it.
4. **Ledger before transactions, transactions before dashboard.** The dashboard must read the ledger. If the dashboard is built first, it gets fake numbers that never get replaced (the #1 vibe-coding failure).
5. **Documents before reviews.** You can't review what you can't upload.
6. **Admin verification before CA discovery.** The directory shows only verified CAs; without verification, discovery has nothing honest to show. *Invite-your-CA* doesn't need verification to connect, but the badge distinguishes verified CAs.
7. **Notifications (DB) before review workflow.** Reviews create notifications; the bell must exist to demo the loop.
8. **Invoicing before GST, GST before full reports.** GST summaries come from invoice/bill tax lines; the balance sheet needs AR/AP from invoices and bills.
9. **Reports before AI.** The AI's tools *are* the report services. Building AI first means it invents numbers.
10. **AI before voice.** Voice = speech-to-text + the AI's transaction-parsing tool + the existing transaction form.

### 6.3 Decisions that are expensive to change later (locked in Phases 1–6)

Money as integer paise · `businessId` on every financial record · immutable journal entries · auth token strategy · shared Zod schemas · CSS-variable theme tokens · `t()` for all strings · storage adapter interface · REST response envelope · feature-folder structure.

---

# PART 7 — Complete Phase-by-Phase Roadmap

**Effort estimates** assume a beginner working with an agentic AI tool, ~3–4 focused hours/day, including debugging. They are honest, not optimistic.

### Track A — Hackathon MVP

| # | Phase | Objective | Key deliverables | Depends on | Acceptance criteria (summary) | Effort |
|---|---|---|---|---|---|---|
| 1 | Foundation & Dev Environment | Working monorepo skeleton | Workspaces, client/server/shared, env validation, Mongo connection, health route, lint/format, test runner, docs files, Git | — | `npm run dev` starts both; `/api/v1/health` shows DB "up"; tests run | 1–2 days |
| 2 | Design System, Theme & App Shell | Reusable UI + layouts + theme + i18n scaffold | Tokens, ~25 components, 3 layouts, theme toggle (persisted, no flash), `/dev/components` showcase, i18n setup | 1 | Showcase works in both themes, keyboard-navigable, mobile | 3–4 days |
| 3 | Public Website | Premium marketing site | Home, Features, How It Works, About, Contact (saves to DB), Privacy, Terms | 2 | All pages responsive, both themes, contact persists, Lighthouse a11y ≥ 90 | 2–3 days |
| 4 | Authentication | Secure accounts | Register w/ role, verify email, login, refresh, logout, forgot/reset, protected routes, role redirects, admin seed script | 1, 2 | Refresh keeps login; tokens not in localStorage; rate limits; tests | 3–4 days |
| 5 | Business Onboarding & Tenancy | Business context + data isolation | Business wizard, memberships, `requireBusinessAccess`, settings page, CA profile setup, audit logger | 4 | Second user can't read first user's business (tested) | 2–3 days |
| 6 | Ledger Core | Correct double-entry engine | Chart of accounts seed, posting service, reversals, balances, trial balance query, accounting rules doc, CoA page | 5 | 100% service test coverage on posting; trial balance always balances | 3–4 days |
| 7 | Transactions & Contacts | Record money in/out | Transaction CRUD (void-and-repost), paid/unpaid, payment methods, categories, contacts, list with search/filter/pagination | 6 | Every transaction has a balanced journal entry; edits keep history | 4–5 days |
| 8 | Document Management | Secure uploads | Storage adapter, upload/validate, preview, link to transactions, categories, versions, access log | 5 | Unauthorized download returns 404; bad file types rejected | 2–3 days |
| 9 | Entrepreneur Dashboard & P&L | Understand the numbers | Summary API from ledger, stat cards, charts, recent activity, P&L page, Simple/Pro mode | 7 | Dashboard totals match trial balance; mode switch changes labels only | 3 days |
| 10 | CA Profiles & Admin Verification | Trustworthy CAs | CA profile completion, certificate upload, admin queue, approve/reject, verified badge | 4, 8 | Only admins verify; badge only after approval | 2–3 days |
| 11 | CA Connections | Secure sharing | Invite-your-CA (email link), directory of verified CAs, requests, accept/decline, scopes, revoke | 5, 10 | Revocation takes effect immediately (tested) | 3–4 days |
| 12 | CA Workspace | CA serves clients | CA dashboard, client list, client workspace (overview, ledger, documents, reports read-only) | 11 | CA sees only shared scopes of active clients | 2–3 days |
| 13 | Notifications | Everyone stays informed | Notification model/service, bell, center, mark read, polling | 4 | Events create notifications for the right user only | 1–2 days |
| 14 | Review Workflow | **The core demo** | Review requests, state machine, comments, clarification loop, resubmission, history timeline, both UIs | 8, 12, 13 | Full demo loop works end-to-end with history | 4–5 days |
| 15 | MVP Hardening, Demo Data & Deployment | Demo-ready, deployed | Security pass, Playwright E2E of demo, seed script, deploy (Vercel + Render + Atlas), warm-up, demo script | 1–14 | E2E passes against production URL | 3–4 days |

**Track A total: ~6–8 weeks** at the stated pace. If your hackathon is sooner, tell me the date and I'll cut a "demo-critical" subset.

### Track B — Full Product

| # | Phase | Objective | Depends on | Effort |
|---|---|---|---|---|
| 16 | Sales, Invoicing & Receivables | GST-ready invoices, numbering, PDF, payments, AR | 7, 8 | 1–1.5 weeks |
| 17 | GST Module | GSTIN validation, CGST/SGST/IGST, rate config, summaries, potential ITC, reminders | 16 | 1 week |
| 18 | Purchases, Bills & Payables | Bills, supplier payments, AP | 7, 8, 17 | 1 week |
| 19 | Full Financial Reports & Exports | Balance sheet, cash flow, trial balance, AR/AP aging, PDF/Excel | 16–18 | 1 week |
| 20 | Messaging, Tasks & Real-time | Conversations, tasks, Socket.IO, email notifications, preferences, recurring reminders | 12–14 | 1–1.5 weeks |
| 21 | AI Financial Assistant | Tool-calling Q&A, explanations, category suggestions, anomalies | 9, 19 | 1–1.5 weeks |
| 22 | Multilingual (EN / TA / HI) | Full translation + accounting glossary | 2, all UI | 1 week |
| 23 | Voice Transaction Recording | Speech → draft → confirm | 7, 21, 22 | 4–5 days |
| 24 | Learning Hub & Gamification | Lessons, progress, habit streaks | 2, 7 | 4–5 days |
| 25 | Admin Completion & Support | User management, audit explorer, support tickets, platform stats | 10 | 4–5 days |
| 26 | Security, Accessibility & Performance Hardening | Production-grade review | All | 1 week |
| 27 | Production Launch & Operations | Monitoring, backups, docs, legal pages finalized | 26 | 4–5 days |
| — | **FUTURE** | Inventory, eco-expense tracking, funding readiness, CA-proposed adjustments, bank-statement import, GST portal integration (needs GSP/legal authorisation) | — | — |

Full acceptance criteria, testing requirements, and definitions of completion for each phase are inside its prompt in Part 8 (section K), so the prompt and its checklist never drift apart.
