# PART 3 — Technical Architecture

### 3.1 The big picture

```
                         ┌───────────────────────────────────────────┐
  Browser (React SPA)    │  accentra.vercel.app                       │
  ─────────────────────► │  Vite build: pages, components, i18n,      │
                         │  theme, TanStack Query cache               │
                         └──────────────┬────────────────────────────┘
                                        │  /api/*  (Vercel rewrite → same-origin for the browser)
                                        ▼
                         ┌───────────────────────────────────────────┐
                         │  Express API (Node 22+, TypeScript)        │
                         │  helmet → cors → rate-limit → cookies →    │
                         │  authenticate → requireRole →              │
                         │  requireBusinessAccess(scope) → validate   │
                         │  (Zod) → controller → SERVICE → model      │
                         │                                            │
                         │  Services: auth, business, ledger,         │
                         │  transactions, documents, connections,     │
                         │  reviews, notifications, reports, ai, gst  │
                         └───┬──────────┬──────────┬──────────┬──────┘
                             │          │          │          │
                 ┌───────────▼┐  ┌──────▼─────┐ ┌──▼───────┐ ┌▼───────────────┐
                 │ MongoDB    │  │ File store │ │ AI API   │ │ Email (Resend) │
                 │ Atlas      │  │ (adapter): │ │ (adapter)│ │ (adapter)      │
                 │ (replica   │  │ local disk │ │ Gemini / │ │                │
                 │ set → txns)│  │ → S3/R2    │ │ Claude   │ │                │
                 └────────────┘  └────────────┘ └──────────┘ └────────────────┘
                             ▲
                 Socket.IO (Track B) pushes "something changed" events;
                 the DB remains the source of truth.
```

### 3.2 Repository layout (npm workspaces monorepo)

```
accentra/
├── package.json              ← workspaces: ["client", "server", "shared"]
├── .gitignore  .nvmrc  README.md
├── docs/
│   ├── PROJECT_STATE.md      ← updated at the END of every phase (AI reads it FIRST)
│   ├── AI_RULES.md           ← the 25 strict development rules + project conventions
│   ├── ARCHITECTURE.md       ← this Part 3, kept current
│   ├── DESIGN_SYSTEM.md      ← Part 5, kept current
│   ├── ACCOUNTING_RULES.md   ← ledger rules, chart of accounts, posting rules
│   └── adr/                  ← short "why we decided X" records
├── shared/                   ← code used by BOTH client and server
│   └── src/
│       ├── schemas/          ← Zod schemas (form validation = API validation)
│       ├── types/            ← TypeScript types inferred from schemas
│       ├── constants/        ← roles, scopes, statuses, payment methods, state codes
│       └── money/            ← paise helpers + Indian formatting (₹1,23,456.78)
├── server/
│   └── src/
│       ├── app.ts  server.ts
│       ├── config/           ← env.ts (Zod-validated), db.ts, logger.ts
│       ├── middleware/       ← authenticate, requireRole, requireBusinessAccess, validate, errorHandler, rateLimit
│       ├── modules/          ← ONE FOLDER PER FEATURE:
│       │   ├── auth/         ←   auth.routes.ts, auth.controller.ts, auth.service.ts, auth.test.ts
│       │   ├── users/  businesses/  ca-profiles/  ledger/  transactions/
│       │   ├── contacts/  documents/  connections/  reviews/  notifications/
│       │   └── reports/  invoices/  gst/  messages/  tasks/  ai/  admin/
│       ├── models/           ← Mongoose models (one file each)
│       ├── lib/              ← storage adapter, email adapter, ai adapter, audit logger
│       ├── scripts/          ← seed-admin.ts, seed-demo.ts
│       └── tests/            ← test setup (in-memory Mongo replica set)
└── client/
    └── src/
        ├── main.tsx  App.tsx  router.tsx
        ├── styles/           ← globals.css with CSS variables for both themes
        ├── components/
        │   ├── ui/           ← Button, Input, Select, Card, Table, Badge, Dialog, Toast, Skeleton, EmptyState…
        │   └── layout/       ← PublicLayout, AuthLayout, WorkspaceLayout (sidebar + topbar)
        ├── features/         ← mirrors server modules: auth/, transactions/, reviews/…
        │   └── transactions/ ←   api.ts, hooks.ts, TransactionsPage.tsx, TransactionForm.tsx…
        ├── lib/              ← apiClient (fetch wrapper), queryClient, i18n setup
        ├── providers/        ← ThemeProvider, AuthProvider, BusinessProvider, ModeProvider
        └── locales/          ← en/, ta/, hi/ JSON translation files
```

**Why this shape?**
- **`shared/`** means a validation rule (e.g., "amount must be a positive integer of paise") is written once and used by both the form and the API. This alone prevents a whole class of "works in UI, fails on server" bugs.
- **Feature folders** (`modules/transactions`, `features/transactions`) mean the AI only needs to read one folder to understand one feature, and features can't silently tangle.
- **Route → controller → service → model**: controllers only translate HTTP; **all business logic lives in services**. Services can be tested without HTTP and reused by the AI assistant, scheduled jobs, and seed scripts.

### 3.3 Technology choices (within MERN)

| Need | Choice | Why | Alternatives considered |
|---|---|---|---|
| Frontend build | **Vite + React + TypeScript** | Fast, standard, specified | Next.js (rejected: you specified separate Express API) |
| Styling | **Tailwind CSS** + CSS variables for theme tokens | Theme switch = swap variables; one source of colors | CSS modules (more boilerplate) |
| UI primitives | **Radix UI** primitives (via shadcn/ui patterns, copied into `components/ui`) | Accessible dialogs, menus, selects for free; you own the code | MUI (heavy, looks generic), Chakra |
| Server state | **TanStack Query** | Caching, loading/error states, refetch after mutations; kills "stale after save" bugs | Redux (too much boilerplate for server data) |
| Client state | **React Context** (auth, theme, business, mode) | Small and sufficient | Zustand (fine; add later if needed) |
| Forms | **React Hook Form + Zod** (from `shared/`) | Same schema validates form and API | Formik |
| Charts | **Recharts** | Specified, React-friendly | — |
| Icons | **Lucide React** | Specified, consistent stroke style | — |
| i18n | **react-i18next** (scaffolded in Phase 2, translated in Phase 22) | Retrofitting i18n into hardcoded strings is painful | — |
| API | **Express 5 + TypeScript**, REST under `/api/v1` | Specified; Express 5 handles async errors natively | NestJS (heavier) |
| Validation | **Zod** | Shared with client | Joi |
| ODM | **Mongoose 8+** with `sanitizeFilter: true` | Specified; sanitizeFilter blocks `$`-operator injection | Native driver |
| Passwords | **argon2** (or bcrypt cost 12) | Modern memory-hard hashing | — |
| Auth tokens | **JWT access (15 min, in memory) + opaque refresh token (httpOnly cookie, rotated, hashed in DB)** | Revocable sessions, XSS-resistant | Server sessions with connect-mongo (also fine; JWT matches your brief) |
| Files | **Storage adapter**: local disk (dev) → **Cloudflare R2 or AWS S3** (prod) with short-lived signed URLs | Private by default, swap without code changes | Cloudinary (public-by-default mindset; avoid for financial docs) |
| Email | **Resend** behind an adapter; dev mode logs emails to console | Simple API, free tier | Nodemailer + Gmail (unreliable, against Gmail ToS for apps) |
| Real-time | **Socket.IO** (Track B) | Specified; works on Render | Server-sent events |
| AI | **Adapter** with Gemini (free tier via AI Studio key) or Claude; tool-calling over server services | Provider-swappable; numbers computed by code, not the model | — |
| Speech | **Web Speech API** (browser, free) → AI parsing → confirmation | Zero cost to start; supports `ta-IN`, `hi-IN` in Chrome | Paid Indian-language STT later |
| PDF / Excel export | **pdfkit** (server) / **exceljs** (server) | Reproducible server-side reports | Client-side jsPDF (inconsistent) |
| Testing | **Vitest + Supertest + mongodb-memory-server (replica set)**; **Playwright** for the demo flow | Real DB transactions in tests; one E2E for the critical path | Jest (fine) |
| Hosting | **Vercel** (client) + **Render** (server) + **MongoDB Atlas** | Free tiers, Socket.IO-compatible backend | Railway (good alternative) |
| Monitoring | **Sentry** (both sides), structured logs with **pino** | Know about errors before judges do | — |

### 3.4 Data model (collections)

All business-owned collections include `businessId` and are **always** queried with it. All money fields end in `Paise` and are integers.

| Collection | Key fields | Important indexes / constraints |
|---|---|---|
| **users** | name, email (unique, lowercase), phone, passwordHash, role (`entrepreneur`/`ca`/`admin`), emailVerified, preferredLanguage, themePreference, status | unique(email) |
| **refreshTokens** | userId, tokenHash, expiresAt, revokedAt, replacedBy, userAgent | TTL on expiresAt |
| **businesses** | name, category, industry, size, address, stateCode, gstin?, pan?, financialYearStartMonth (default 4), baseCurrency `INR`, isDemo | — |
| **businessMemberships** | businessId, userId, role (`owner`) | unique(businessId, userId) |
| **caProfiles** | userId, icaiMembershipNo, qualifications, experienceYears, specializations[], languages[], services[], city, state, consultationModes[], verificationStatus (`pending`/`verified`/`rejected`), verifiedBy, verifiedAt, certificateDocumentId | unique(userId), index(verificationStatus, city) |
| **caConnections** | businessId, caUserId, initiatedBy, status (`invited`/`pending`/`active`/`declined`/`revoked`), scopes[], inviteEmail?, inviteTokenHash?, acceptedAt, revokedAt | unique active (businessId, caUserId) |
| **accounts** (chart of accounts) | businessId, code, name, type (`asset`/`liability`/`equity`/`income`/`expense`), subtype, simpleLabel, isSystem, isArchived | unique(businessId, code) |
| **journalEntries** | businessId, entryNumber, date, financialYear, narration, source {type, id}, lines[{accountId, debitPaise, creditPaise, contactId?}], totalPaise, reversesEntryId?, reversedByEntryId?, createdBy, createdAt — **never updated except to set reversedByEntryId** | unique(businessId, entryNumber); index(businessId, date); index(businessId, "lines.accountId") |
| **transactions** | businessId, kind (`money_in`/`money_out`/`transfer`/`owner_investment`/`owner_withdrawal`/`refund`), date, amountPaise, categoryAccountId, paymentAccountId, paymentMethod, status (`paid`/`unpaid`), contactId?, reference, description, tax {rate, amountPaise}?, documentIds[], journalEntryId, isVoided, history[] | index(businessId, date), text(description, reference) |
| **contacts** | businessId, type (`customer`/`supplier`/`both`), name, gstin?, stateCode, email, phone | index(businessId, type, name) |
| **documents** | businessId, uploadedBy, category, financialYear, originalName, mimeType, sizeBytes, storageKey, checksum, version, previousVersionId?, linkedTo [{type, id}], isDeleted | index(businessId, category, financialYear) |
| **reviewRequests** | businessId, caUserId, subject {type: `document`/`transaction`/`invoice`, id}, title, status, submittedBy, currentRevision, history[{action, fromStatus, toStatus, byUserId, note, at}] | index(caUserId, status), index(businessId, status) |
| **reviewComments** | reviewRequestId, businessId, authorId, body, revision, createdAt | index(reviewRequestId, createdAt) |
| **notifications** | userId, businessId?, type, title, body, link, readAt, createdAt | index(userId, readAt, createdAt) |
| **auditLogs** | actorId, businessId?, action, entity {type, id}, before?, after?, ip, userAgent, at — **append-only** | index(businessId, at), index(actorId, at) |
| *Track B:* invoices, invoiceItems (embedded), bills, payments, taxRates, messages, conversations, tasks, recurringTemplates, lessons, lessonProgress, supportTickets, aiConversations, contactMessages | — | Designed in their phases |

### 3.5 Authentication flow

```
Register ─► hash password (argon2) ─► create user (emailVerified=false) ─► send verification email
Login ───► verify password ─► issue access JWT (15 min, returned in JSON, kept in memory)
                            └► issue refresh token (random 256-bit, stored HASHED in DB,
                               sent as httpOnly + Secure + SameSite=Lax cookie, path=/api/v1/auth)
Page refresh ─► client calls POST /auth/refresh ─► server rotates refresh token ─► new access JWT
Logout ──► revoke refresh token in DB + clear cookie
Reuse of an already-rotated refresh token ─► revoke ALL that user's sessions (theft detection)
```

### 3.6 Authorization model (the most important security design in the app)

Three layers, applied **on the server, in this order, on every request**:

1. **`authenticate`** — valid access token → `req.user = { id, role }`.
2. **`requireRole('entrepreneur' | 'ca' | 'admin')`** — role check.
3. **`requireBusinessAccess(scope)`** — for any route containing `:businessId`:
   - Entrepreneur → must have a `businessMembership` for that business.
   - CA → must have an **active** `caConnection` for that business **including the requested scope**.
   - Admin → only on explicit admin routes (admins do **not** browse businesses' books by default).
   - Sets `req.business` and `req.access = { via: 'owner' | 'ca', scopes }`.

Then **every service function takes `businessId` as its first argument** and every query filters by it. A CA requesting another business's data gets `404 Not Found` (not `403`, which would confirm the record exists).

### 3.7 Ledger posting design

```
User action (e.g., "Money Out ₹1,180, Rent, paid via UPI from Bank")
   │
   ▼
transactions.service.create()
   │  1. validate with shared Zod schema
   │  2. resolve accounts: Rent Expense (debit), Bank (credit)
   │  3. start MongoDB session + transaction
   │  4. ledger.service.post({ lines: [Dr Rent 118000, Cr Bank 118000] })
   │        → assert sum(debits) === sum(credits) > 0
   │        → assert all accounts belong to this business and are active
   │        → assign next entryNumber atomically
   │  5. save transaction with journalEntryId
   │  6. write auditLog
   │  7. commit (or abort everything)
   ▼
"Edit" = void: post reversal entry (all debits↔credits swapped), mark old transaction voided,
         create new transaction + new entry, link both in history.
```

**Unpaid** money-out posts `Dr Expense / Cr Accounts Payable`; marking it paid later posts `Dr Accounts Payable / Cr Bank`. That's how "Bills to Pay" and "Payments to Receive" come from the ledger rather than from a status flag.

### 3.8 API conventions

- Base path `/api/v1`. Business-scoped routes: `/api/v1/businesses/:businessId/transactions`.
- Success: `{ "data": ..., "meta": { "page": 1, "pageSize": 20, "total": 134 } }`
- Error: `{ "error": { "code": "VALIDATION_ERROR", "message": "Human-readable", "details": [...] } }`
- Codes: `VALIDATION_ERROR` 400, `UNAUTHENTICATED` 401, `FORBIDDEN` 403, `NOT_FOUND` 404, `CONFLICT` 409, `RATE_LIMITED` 429, `INTERNAL` 500 (never leaks stack traces in production).
- Lists: `?page=&pageSize=&sort=&from=&to=&q=` — server-side pagination always.

### 3.9 How the pieces communicate

| Flow | Path |
|---|---|
| **Normal request** | React → TanStack Query → `apiClient` (adds `Authorization: Bearer <access>`; on 401 calls `/auth/refresh` once, retries) → Express middleware chain → service → MongoDB |
| **File upload** | React `multipart/form-data` → Express (multer, memory, size-limited) → validate type by magic bytes → storage adapter `put()` → `documents` record. **Download**: authorized route → storage adapter streams file (dev) or returns a 5-minute signed URL (prod). Files are never at a public URL. |
| **Notifications** | Service action → `notifications.service.create()` (DB) → client polls `/notifications/unread-count` every 30 s (MVP) → Track B: server also emits `notification:new` over Socket.IO to the user's room; client invalidates its query. |
| **AI** | Client → `/ai/chat` → server builds context → model may call **tools** (e.g., `getProfitAndLoss(from, to)`) → tool runs a real service with the user's `businessId` → result goes back to the model → explanation returned. The model never receives raw full books, never computes totals itself, and never writes data. |
| **Email** | Service → email adapter → Resend (prod) or console (dev). |

### 3.10 Environment variables (server)

`NODE_ENV, PORT, MONGODB_URI, CLIENT_ORIGIN, JWT_ACCESS_SECRET, REFRESH_TOKEN_PEPPER, COOKIE_SECURE, STORAGE_DRIVER (local|s3), S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, EMAIL_DRIVER (console|resend), RESEND_API_KEY, EMAIL_FROM, AI_PROVIDER (gemini|anthropic|none), AI_API_KEY, SENTRY_DSN`

Client: `VITE_API_BASE_URL` (default `/api/v1`), `VITE_SENTRY_DSN`. **Nothing secret ever goes in a `VITE_` variable** — they are bundled into public JavaScript.
