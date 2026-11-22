# PART 1 — Complete Accentra Project Understanding

### The problem

Indian small businesses run their finances on a patchwork: WhatsApp for sending bills to the CA, email for statements, Excel for tracking, paper invoices in a drawer, and maybe Tally or Zoho on the CA's side. The results:

- **For the entrepreneur:** they don't understand their own numbers, they don't know what their CA needs, and every month involves "please send the HDFC statement again."
- **For the CA:** dozens of clients, each sending documents through different channels, no structured way to ask "this invoice is missing the GSTIN," no visibility into what's pending, and repeated follow-ups that aren't billable.

### The solution

Accentra is **one shared, permission-controlled financial workspace** where:

1. The entrepreneur records business activity in plain language (**Simple Mode**: *Money In, Money Out, Bills to Pay*).
2. Every entry posts to a real double-entry ledger, which the CA sees in accounting language (**Professional Mode**: *Revenue, Accounts Payable, Trial Balance*).
3. Documents, review requests, clarifications, and approvals happen **attached to the exact record they concern**, with a full history.
4. An AI assistant explains the numbers, and later, voice and Tamil/Hindi support make it accessible to non-English-first owners.

### Target users

| User | Who they really are | What they need most |
|---|---|---|
| **Entrepreneur** | Owner of a small shop, service business, or early startup; little accounting knowledge; probably uses a phone | "Tell me if I'm making money, and stop my CA from chasing me" |
| **Chartered Accountant** | Practicing CA or small firm managing 20–200 SMB clients | "One place where each client's documents and questions are organized" |
| **Administrator** | Accentra staff | Verify CAs, support users, monitor misuse |

### Differentiation (honest version)

Zoho Books already offers accounting *and* accountant access. Accentra's differentiation is **not** "we have accounting." It is:

1. **The review workflow is the product**, not a bolt-on: submit → review → clarify → resubmit → approve, attached to records, with history.
2. **Dual-mode interface on one ledger**: the owner and the CA see the *same* truth in *different* language.
3. **India-native accessibility**: Tamil/Hindi, voice entry, and plain-language AI explanations.

For judges, lead with #1. It's the most concrete and the easiest to demonstrate.

---

# PART 2 — Complete Feature Analysis

### 2.1 Priority legend

- **MVP** = required for the hackathon demo (Track A)
- **FULL** = required for a real v1 product (Track B)
- **FUTURE** = valuable, deliberately deferred

### 2.2 Feature inventory by module

| # | Module | Key features | Users | Depends on | Complexity | Priority | Safeguards required |
|---|---|---|---|---|---|---|---|
| 1 | **Foundation** | Monorepo, TS, env config, DB connection, health check, logging, project-state docs | Dev | — | Low | MVP | Secrets never committed |
| 2 | **Design system & theme** | Tokens, light/dark (persisted), component library, layouts, i18n scaffold | All | 1 | Medium | MVP | Accessible contrast in both themes |
| 3 | **Public website** | Home, Features, How It Works, About, Contact, Privacy, Terms | Visitors | 2 | Low–Med | MVP | Contact form rate-limited |
| 4 | **Authentication** | Register with role, login, refresh, logout, password reset, email verification | All | 1, 2 | Medium | MVP | Hashed passwords, httpOnly cookies, rate limits, generic error messages |
| 5 | **Authorization (RBAC + tenancy)** | Roles, business membership, CA access scopes, server-enforced checks | All | 4 | **High** | MVP | Every query scoped by `businessId` |
| 6 | **Business onboarding** | Business profile wizard, financial year, GSTIN (optional), language | Entrepreneur | 5 | Low–Med | MVP | GSTIN format validation |
| 7 | **CA profile & verification** | Professional profile, ICAI membership no., certificate upload, admin verification | CA, Admin | 4, 13 | Medium | MVP | **Manual** verification; never auto-mark verified |
| 8 | **Accounting core (ledger)** | Chart of accounts, journal entries, posting engine, reversals, balances, financial years, audit log | System | 5 | **High** | MVP | Immutability, balance check, DB transactions, paise integers |
| 9 | **Transactions** | Money in/out, transfers, owner investment/withdrawal, paid/unpaid, categories, payment methods, search/filter, recurring templates | Entrepreneur | 8 | High | MVP (recurring = FULL) | Edit = reverse + repost; audit trail |
| 10 | **Customers & suppliers** | Contact records, balances | Entrepreneur | 6 | Low | MVP (basic) | Tenant isolation |
| 11 | **Document management** | Upload, validate, private storage, preview, link to records, categories, versions | Both | 5 | Medium | MVP | Type/size/magic-byte validation, no public URLs, access logged |
| 12 | **Entrepreneur dashboard** | Summary cards, charts, recent activity, pending reviews; Simple/Pro toggle | Entrepreneur | 8, 9 | Medium | MVP | Numbers come only from ledger queries |
| 13 | **Admin workspace** | User management, CA verification queue, audit monitoring, support tickets | Admin | 4 | Medium | MVP (verification) / FULL (rest) | Admin accounts created by script only |
| 14 | **CA connections** | Invite-your-CA, directory of verified CAs, request/accept/decline, scoped permissions, revoke | Both | 5, 7 | High | MVP | Entrepreneur controls scopes; revoke is immediate |
| 15 | **CA dashboard & client workspace** | Client list, per-client workspace (read-only ledger, docs, reviews), pending counts | CA | 14 | Medium | MVP | CA cannot see unshared data or other CAs' clients |
| 16 | **Notifications** | DB-stored notifications, center, unread count, polling → Socket.IO, preferences, email | Both | 4 | Medium | MVP (in-app) / FULL (real-time, email) | Notifications never leak cross-tenant content |
| 17 | **Review workflow** | Review requests, state machine, comments, clarifications, resubmissions, history | Both | 11, 14, 16 | High | **MVP — the core demo** | Only valid state transitions; immutable history |
| 18 | **Sales & invoicing** | GST invoices, items, numbering, statuses, PDF, payment allocation, AR, quotations | Entrepreneur | 8, 10, 19 | High | FULL | Invoice numbers unique & sequential per business/FY |
| 19 | **GST module** | GSTIN validation, CGST/SGST vs IGST by place of supply, rate config, output/input summaries, *potential* ITC, deadline reminders | Both | 8, 18 | High | FULL | Rates are configurable data; ITC always labelled "potential"; no filing claims |
| 20 | **Purchases** | Bills, suppliers, AP, payments, uploaded bills | Entrepreneur | 8, 10, 11 | High | FULL | Same as sales |
| 21 | **Financial reports** | P&L, balance sheet, cash flow, trial balance, AR/AP aging, exports (PDF/Excel), date ranges | Both | 8, 18, 20 | High | MVP (P&L summary) / FULL (rest) | Trial balance must balance; reports reproducible |
| 22 | **Messaging** | Per-client conversations, record references, real-time | Both | 14, 16 | Medium | FULL | Conversation scoped to a connection |
| 23 | **Tasks** | Assign, due dates, priority, status, attachments, history | Both | 14, 11, 16 | Medium | FULL | Only connected parties can assign |
| 24 | **AI assistant** | Q&A over own data via tool-calling, explanations, category suggestions, anomaly hints | Entrepreneur | 8, 12, 21 | High | FULL | AI never writes to ledger without user confirmation; disclaimer; data minimization |
| 25 | **Multilingual** | English, Tamil, Hindi; glossary-based accounting terms | All | 2 (scaffold) | Medium | FULL | Financial terms reviewed by a fluent human |
| 26 | **Voice transactions** | Speech → text → structured draft → confirm | Entrepreneur | 9, 24, 25 | Medium | FULL | Always a confirmation step; never auto-save |
| 27 | **Learning hub & gamification** | Lessons, FAQs, progress, habit streaks | Entrepreneur | 2 | Low–Med | FULL | Rewards habits, never spending |
| 28 | **Inventory** | Products, stock movements, low-stock alerts, COGS | Entrepreneur | 18, 20 | High | FUTURE | Proper inventory accounting (not instant expense) |
| 29 | **Eco-expense tracking** | Sustainability tags on expenses, summaries | Entrepreneur | 9 | Low | FUTURE | — |
| 30 | **Funding readiness** | Ratio explanations, document checklist | Entrepreneur | 21 | Low–Med | FUTURE | Never implies financing eligibility |
| 31 | **Security hardening & audit** | Headers, rate limits, audit review, dependency scan, a11y, performance | — | All | Medium | FULL | — |
| 32 | **Deployment & ops** | Hosting, env separation, monitoring, backups, docs | — | All | Medium | MVP (basic) / FULL | Separate prod secrets |

### 2.3 Overlaps consolidated (nothing lost)

| Overlap in the description | Consolidated design |
|---|---|
| "Transactions," "Income," "Expenses," "Sales," "Purchases" all record money | **One posting engine.** *Transactions* is the quick-entry surface. *Sales* = invoices + customer receipts. *Purchases* = bills + supplier payments. *Expenses* = a filtered view of transactions in expense categories. All post journal entries through the same service. |
| Invoice uploads (Invoice module) vs Document Management | **One Document model.** An uploaded purchase bill is a Document linked to a Transaction or Bill. |
| Notifications vs Reminders | **One Notification model** with `type`; reminders are notifications created by a scheduled job. |
| Review statuses vs Task statuses | **Two state machines** (they differ), but one shared `ActivityHistory` pattern and one comment component. |
| "Payments" as a table and as a transaction type | **Payment** is a document that settles invoices/bills and posts a journal entry. |

### 2.4 Ambiguities resolved with explicit assumptions

| Ambiguity | Assumption adopted |
|---|---|
| "Users can edit transactions" vs "traceable histories" | Editing creates a reversal + new entry; UI shows it as an edit with history. |
| Financial year | Default **1 April – 31 March** (Indian FY); configurable at onboarding. |
| Multiple businesses per user | Data model supports it from day one (`BusinessMembership`); UI ships with a business switcher in Track B. |
| What can a connected CA see? | Entrepreneur grants **scopes**: `ledger:read`, `documents:read`, `reports:read`, `reviews:manage`. Default on acceptance: all read scopes + reviews. Revocable any time. |
| Can a CA edit the books? | **Not in v1.** CAs comment, request clarification, and approve. Proposed adjustments are a FUTURE feature (requires a "proposed journal entry" approval flow). |
| How are admins created? | Never via public registration. A server-side seed script creates the first admin. |
| ICAI verification | **Manual admin review** of membership number + uploaded certificate. Automated verification is not assumed. |
| Default chart of accounts | A simple Indian SMB chart seeded per business (≈35 accounts), extensible. |
| Inventory accounting method | Deferred (FUTURE); when built, perpetual inventory with COGS on sale. |
| GST rates | Stored as configurable data, never hardcoded. Indian GST rate structures were rationalised in 2025, which is precisely why rates must be data, not code. |
| Voice languages | English, Tamil, Hindi through the browser's speech recognition first; a paid Indian-language STT provider later if accuracy is insufficient. |
