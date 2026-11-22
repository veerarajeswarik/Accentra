# PART 4 — Complete Website Structure

### 4.1 Public site (`PublicLayout`: top nav, footer, theme toggle, language selector)

| Route | Page | Key content |
|---|---|---|
| `/` | Home | Hero with product screenshot, problem→solution, "For Entrepreneurs" / "For CAs" split, review-workflow walkthrough, dashboard preview, trust/security section, FAQ, CTA |
| `/features` | Features | Modules grouped: Bookkeeping, Collaboration, Insights, India-native |
| `/how-it-works` | How It Works | 4-step entrepreneur flow + CA flow, visual timeline |
| `/about` | About | Mission, principles, team |
| `/contact` | Contact | Form (stored in DB, rate-limited) |
| `/privacy`, `/terms` | Legal | Plain-language placeholders clearly marked "draft, pending legal review" |

### 4.2 Authentication (`AuthLayout`: split screen, brand panel + form)

`/login`, `/register` (role cards: Entrepreneur / Chartered Accountant), `/verify-email`, `/forgot-password`, `/reset-password`, `/onboarding/business`, `/onboarding/ca-profile`, `/invite/:token` (CA accepting an invitation)

### 4.3 Entrepreneur workspace (`/app/*`, `WorkspaceLayout`)

Sidebar groups (collapsible on mobile; labels switch with Simple/Pro mode):

| Group | Simple label → route | Professional label | Track |
|---|---|---|---|
| Overview | Dashboard `/app` | Dashboard | MVP |
| Money | Money In & Out `/app/transactions` | Transactions | MVP |
| | Expenses `/app/expenses` (filtered view) | Expenditure | MVP |
| | Sales & Invoices `/app/sales` | Sales / Receivables | FULL |
| | Purchases & Bills `/app/purchases` | Purchases / Payables | FULL |
| | People `/app/contacts?type=customer` · `?type=supplier` | Customers / Suppliers | MVP (basic) |
| Records | Documents `/app/documents` | Documents | MVP |
| | Reports `/app/reports` | Financial Statements | MVP (P&L) / FULL |
| | GST `/app/gst` | GST | FULL |
| Accountant | My CA `/app/my-ca` | My CA | MVP |
| | Find a CA `/app/find-ca` | Find a CA | MVP (basic) |
| | Reviews `/app/reviews` | Reviews | MVP |
| | Messages `/app/messages` · Tasks `/app/tasks` | same | FULL |
| Assist | AI Assistant `/app/assistant` · Learning Hub `/app/learn` | same | FULL |
| Settings | Business Profile `/app/settings/business` · Settings `/app/settings` | same | MVP |

Top bar: business name (switcher in Track B), Simple/Pro toggle, global search (Track B), notification bell with unread count, theme toggle, user menu.

### 4.4 CA workspace (`/ca/*`)

| Route | Page | Track |
|---|---|---|
| `/ca` | CA Dashboard (active clients, pending reviews, needs-clarification count, recently completed, invitations) | MVP |
| `/ca/clients` | Client Directory (search, filter by status) | MVP |
| `/ca/clients/:businessId` | Client workspace with tabs: Overview · Ledger · Documents · Reviews · Reports · Messages · Tasks | MVP (first 5 tabs) |
| `/ca/reviews` | Pending Reviews queue across clients | MVP |
| `/ca/requests` | Connection requests & invitations | MVP |
| `/ca/compliance` | Compliance tasks & deadlines | FULL |
| `/ca/messages` · `/ca/notifications` | — | FULL / MVP |
| `/ca/profile` · `/ca/settings` | Professional profile (verification status) | MVP |

### 4.5 Admin workspace (`/admin/*`)

`/admin` (platform stats) · `/admin/ca-verifications` (queue, certificate viewer, approve/reject with reason) · `/admin/users` (search, suspend) · `/admin/audit` (filterable audit log) · `/admin/support` (contact messages / tickets)

### 4.6 Shared components (built once in Phase 2, reused everywhere)

`Button, IconButton, Input, MoneyInput (₹, paise-safe), Textarea, Select, Combobox, DatePicker, Checkbox, Switch, Card, StatCard, DataTable (sort, filter, paginate), Badge/StatusBadge, Dialog, ConfirmDialog, Drawer, Tabs, Toast, Skeleton, Spinner, EmptyState, ErrorState, PageHeader, FilterBar, FileDropzone, Timeline (for history), Avatar, Tooltip, ChartCard, ThemeToggle, ModeToggle, LanguageSelect`
