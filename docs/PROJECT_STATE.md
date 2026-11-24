# Project State

> AI tools: read this FIRST at the start of every session. Update it at the END of every phase.

## Current phase

**Phase 3 — Public Website: complete (2026-11-24).**
Next: **Phase 4 — Authentication** — `prompts/phase-04.md`. The register page must read `?role=entrepreneur|ca` (the marketing CTAs already send it). At the end of each phase, bump `COMPLETED_PHASE` in `client/src/features/marketing/featureStatus.ts`.

## Completed phases

### Phase 3 — Public Website

- **3a:** the shared `contactMessageSchema` (error messages are i18n keys), `POST /api/v1/contact` (`validateBody` middleware, express-rate-limit 5 / 15 min / IP, honeypot field `website`), a `ContactMessage` model storing a keyed **hash** of the IP (`IP_HASH_PEPPER`), and the `TRUST_PROXY` setting. The API router became a factory so each app instance gets fresh rate-limit state.
- **3b:** the home page (hero with a real-component sample preview, problems, the two audiences with `?role=` CTAs, an interactive 5-step review stepper, a live Simple/Professional demo, true-only trust statements, a "Coming next" row, an 8-question FAQ that says Accentra does not file GST or replace a CA, and a CTA band); the new `Accordion` component; `PageMeta` (React 19 head tags); and the lazily loaded marketing chunk with its own `marketing` i18n namespace.
- **3c:** `/features` (statuses driven by `featureStatus.ts`), `/how-it-works` (Entrepreneur / CA tabs), `/about` (founder TODO, no invented people), `/contact` (React Hook Form + shared schema, server field errors mapped to fields, loading, success state, rate-limit toast), and `/privacy` and `/terms` (draft banner; DPDP named as the intended framework, with no compliance claim). Also a favicon, `robots.txt`, and per-page titles everywhere.

### Phase 2 — Design System, Theme & Application Shell

Built the whole client UI foundation in four sub-steps:

- **2a:** design tokens as CSS variables (light/dark) mapped into Tailwind v4 with `@theme`; a no-flash theme script in `index.html`; `ThemeProvider` (light/dark/system, persisted), `ModeProvider` (Simple/Professional, persisted) with a terminology map and `useTerm`; the react-i18next scaffold (English; Tamil/Hindi shown as "coming soon"); a hex-colour ESLint rule.
- **2b:** form and display components, including `MoneyInput`, which emits integer paise.
- **2c:** data, overlay and feedback components: `DataTable` with stacked mobile cards, toasts, dialogs, `FileDropzone`, `ChartCard` + `useChartColors`.
- **2d:** the three layouts, the entrepreneur/CA/admin sidebars from `nav-config.ts`, the React Router data router with honest "Planned for Phase N" placeholders, 404 and error pages, and the dev-only `/dev/components` showcase (with a route map), which is excluded from production builds. The Phase 1 health page became an "API status" indicator on the showcase.

All components are listed in `DESIGN_SYSTEM.md` → "Component inventory".

### Phase 1 — Foundation & Development Environment

Created an npm-workspaces monorepo with three packages: `@accentra/shared` (integer-paise money
helpers `toPaise` / `fromPaise` / `formatINR` with Indian grouping and compact L/Cr form, roles,
error codes, API envelope and health types), `@accentra/server` (Express 5 + TypeScript with a
Zod-validated environment, a Mongoose connection with retry/backoff and graceful shutdown, pino
logging, helmet/CORS/JSON-limit/cookie-parser/request-id middleware, an `AppError` class, a
central error envelope, a 404 handler, and `GET /api/v1/health`) and `@accentra/client` (Vite +
React 19 + Tailwind v4 + TanStack Query, a typed `apiClient`, and a temporary health page). Tests
use Vitest everywhere, with Supertest and an in-memory MongoDB **replica set** on the server, so
transactions work in tests. ESLint (flat config, type-aware rules on the server) and Prettier are
configured. The project docs (`AI_RULES.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, this file)
were created.

## What exists

### Server routes (`/api/v1`)

| Method | Path          | Auth | Description                                                                                                                                   |
| ------ | ------------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/health`     | none | `{ data: { status: "ok", db: "up" \| "down", version, time } }`                                                                               |
| POST   | `/contact`    | none | Shared `contactMessageSchema`; 5 req / 15 min / IP → `429 RATE_LIMITED`; honeypot `website` → 201, not stored; returns `201 { data: { id } }` |
| \*     | anything else | —    | `404 { error: { code: "NOT_FOUND", ... } }`                                                                                                   |

### Server building blocks

- `server/src/config/env.ts` — Zod env schema (`parseEnv`, `env`, `isProduction`); loads `server/.env` locally.
- `server/src/config/db.ts` — `connectDb` (retries, backoff up to 30 s), `disconnectDb`, `pingDb`, `redactUri`; `strictQuery` + `sanitizeFilter` on.
- `server/src/config/logger.ts` — pino (pretty in dev, JSON in prod, silent in tests; auth headers/cookies redacted).
- `server/src/lib/app-error.ts` — `AppError` + factories. `server/src/lib/version.ts` — `APP_VERSION`.
- `server/src/middleware/` — `request-id.ts`, `not-found.ts`, `error-handler.ts` (`createErrorHandler`).
- `server/src/modules/health/` — routes/controller/service/test (reference example of the module pattern).
- `server/src/app.ts` (`createApp()`), `server/src/server.ts` (listen + background DB connect + SIGINT/SIGTERM shutdown), `server/src/routes.ts` (module router registry).
- Tests: `server/src/tests/global-setup.ts` (MongoMemoryReplSet), `setup-env.ts`.

### Models

- `ContactMessage` (`contactMessages`): name, email (lowercased), role (`entrepreneur | ca | other`), subject, message, `ipHash` (HMAC-SHA256 with `IP_HASH_PEPPER`, never the raw IP), userAgent (≤ 300 chars), status (`new | handled`), timestamps. Index `createdAt: -1`. Read by the admin support inbox in Phase 25.

### Shared (`@accentra/shared`)

- `money/` — `toPaise(str, {allowNegative?})`, `fromPaise(int)`, `formatINR(int, {compact?})`, `MoneyError`.
- `constants/` — `ROLES`, `Role`, `isRole`; `ERROR_CODES`, `ErrorCode`.
- `types/` — `ApiSuccess<T>`, `ApiMeta`, `ApiErrorBody`, `HealthStatus`.
- `schemas/` — empty (Zod schemas arrive with features).

### Client routes (`client/src/router.tsx`)

Every route below currently renders `ComingSoonPage` with its planned phase, except `/dev/components`.

| Area         | Layout                                | Routes (planned phase)                                                                                                                                                                                                                                                                        |
| ------------ | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public       | `PublicLayout`                        | **Built (Phase 3), lazy `marketing` chunk:** `/` `/features` `/how-it-works` `/about` `/contact` `/privacy` `/terms` (list: `client/src/routes/public-pages.ts`) · `*` → 404                                                                                                                  |
| Auth         | `AuthLayout`                          | `/login` `/register` `/forgot-password` `/reset-password` `/verify-email` (4) · `/onboarding/business` `/onboarding/ca-profile` (5) · `/invite/:token` (11)                                                                                                                                   |
| Entrepreneur | `WorkspaceLayout` (`entrepreneurNav`) | `/app` (9) · `transactions` `expenses` `contacts` (7) · `documents` (8) · `reports` (9) · `sales` (16) · `purchases` (18) · `gst` (17) · `my-ca` `find-ca` (11) · `reviews` (14) · `messages` `tasks` (20) · `assistant` (21) · `learn` (24) · `settings/business` `settings` (5) · `*` → 404 |
| CA           | `WorkspaceLayout` (`caNav`)           | `/ca` `clients` `clients/:businessId` (12) · `reviews` (14) · `requests` (11) · `compliance` `messages` (20) · `notifications` (13) · `profile` `settings` (10)                                                                                                                               |
| Admin        | `WorkspaceLayout` (`adminNav`)        | `/admin` `users` `audit` `support` (25) · `ca-verifications` (10)                                                                                                                                                                                                                             |
| Dev only     | none                                  | `/dev/components`: showcase of every component + route map + API status (registered only when `import.meta.env.DEV`)                                                                                                                                                                          |

`RequireAuth` wraps `/app`, `/ca` and `/admin` but is a **placeholder that renders children** (real guard in Phase 4).

### Client building blocks

- `components/ui/`: the full design-system library (see the `DESIGN_SYSTEM.md` inventory).
- `components/layout/`: `PublicLayout`, `AuthLayout`, `WorkspaceLayout`, `Sidebar`, `TopBar`, `Wordmark`, `RequireAuth`, `nav-config.ts`.
- `pages/`: `ComingSoonPage`, `NotFoundPage`, `RouteErrorPage`.
- `providers/`: `ThemeProvider`, `ModeProvider`, `AppProviders` (theme → mode → query client → tooltips → toasts).
- `lib/`: `apiClient` (unchanged from Phase 1), `queryClient`, `i18n`, `terminology` (`useTerm`), `cn`, `storage` (safe localStorage), `chart-colors` (`useChartColors`), `use-media-query`, `format-bytes`.
- `locales/en/`: `common`, `nav`, `pages`, `terms`, `ui`, `validation`, `marketing` (lazy).
- `features/marketing/`: public site pages, home sections, `ContactForm` (+ `useSendContactMessage`), `featureStatus.ts`, layout helpers (`Section`, `IconPoint`, `PageIntro`, `StepList`).
- `components/layout/PageMeta.tsx`: per-page `<title>`, description and Open Graph tags.
- `client/public/`: `favicon.svg`, `robots.txt` (allows public pages; blocks `/app`, `/ca`, `/admin`, `/dev` and the auth pages).
- `dev/`: showcase, sample data (obviously fake), `ApiStatus`, `RouteMap`.

### Browser storage keys (UI preferences only, never tokens)

`accentra-theme` · `accentra-mode` · `accentra-lang` · `accentra-sidebar-collapsed`

## Environment variables

### Server (`server/.env`, documented in `server/.env.example`)

| Variable         | Required | Default                 | Notes                                                                                                                                 |
| ---------------- | -------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`       | no       | `development`           | `development` \| `test` \| `production`                                                                                               |
| `PORT`           | no       | `5000`                  |                                                                                                                                       |
| `MONGODB_URI`    | **yes**  | —                       | Atlas string with db `accentra_dev`                                                                                                   |
| `CLIENT_ORIGIN`  | no       | `http://localhost:5173` | the only CORS origin allowed                                                                                                          |
| `IP_HASH_PEPPER` | **yes**  | —                       | 32+ random chars; hashes contact-form IPs. Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `TRUST_PROXY`    | no       | `0`                     | Number of reverse proxies (set `1` on Render in Phase 15) so rate limits see real IPs                                                 |

### Client

| Variable            | Default   | Notes                         |
| ------------------- | --------- | ----------------------------- |
| `VITE_API_BASE_URL` | `/api/v1` | never put secrets in `VITE_*` |

## Known issues / TODO

- **MongoDB Atlas not configured yet.** `server/.env` currently holds the placeholder URI from `.env.example`, so the health page shows `db: down`. Do beginner guide Step 3 (`docs/plan/09-beginner-guide-windows.md`) and paste the real URI into `server/.env`.
- **No GitHub remote yet.** Create a private `accentra` repo and add it with `git remote add origin ...`.
- npm 11 reports install scripts not yet approved for `esbuild` and `mongodb-memory-server`. Everything works without them (esbuild ships its binary as an optional dependency; mongodb-memory-server downloads mongod on first test run). Approve with `npm approve-scripts <pkg>` only if a problem appears.
- TypeScript is pinned to 6.0.x because `typescript-eslint` 8.x does not yet support TypeScript 7. Revisit when it does.
- The first server test run downloads a mongod binary (~100+ MB, cached afterwards).
- Main client chunk is ~611 KB (193 KB gzip): almost entirely framework code (react-dom, react-router, TanStack Query, i18next, Radix). Marketing pages are a separate lazy chunk (~228 KB / 71 KB gzip). Revisit vendor chunking for caching in Phase 26.
- Contact rate limiting uses an in-memory store: correct for one server instance only. Use a shared store (e.g. MongoDB or Redis) if the API ever runs more than one instance.
- The contact form has not yet been verified against MongoDB Atlas (no real `MONGODB_URI` yet); persistence is proven by tests against the in-memory replica set.
- About page: founder name, photo and bio are a marked TODO (`client/src/features/marketing/pages/AboutPage.tsx`).
- The notification bell and the user menu's "Sign out" are visible placeholders, marked unavailable (Phases 13 and 4).
- `ThemeProvider.onThemeChange` is a hook point; the theme is not yet synced to the user profile (Phase 4/5).
- Phase 26 (CSP): the inline theme script in `client/index.html` must be allowed by its sha256 hash.

## Decisions log

| Date       | Decision                                                                                                                                               | Reason                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-11-22 | Moved the plan kit from `accentra-plan-kit/` to the project root.                                                                                      | Every prompt expects `docs/MASTER_PLAN.md` and `prompts/` at the root.                                                                   |
| 2026-11-22 | Created a dedicated git repo in this folder.                                                                                                           | The enclosing repo was the user's whole home folder.                                                                                     |
| 2026-11-22 | `@accentra/shared` uses a custom `development` export condition → `src/*.ts`; default → `dist/`.                                                       | No build step in dev (Vite, tsx, Vitest, tsc all honour the condition); production uses compiled JS. Simpler than TS project references. |
| 2026-11-22 | TypeScript `~6.0.3` instead of 7.0.                                                                                                                    | `typescript-eslint` 8.73 supports only `<6.1`.                                                                                           |
| 2026-11-22 | Added error code `PAYLOAD_TOO_LARGE` (413) to the Part 3.8 list.                                                                                       | Correct HTTP status for bodies over the 1 MB JSON limit.                                                                                 |
| 2026-11-22 | Server starts listening before MongoDB connects; DB connects in the background with retry.                                                             | `/health` can report `db: down` with clear logs instead of the process crashing.                                                         |
| 2026-11-22 | `.gitattributes` forces LF line endings.                                                                                                               | Global `core.autocrlf` would otherwise create CRLF files that fail Prettier.                                                             |
| 2026-11-22 | `.nvmrc` = 24 (engines `>=22`).                                                                                                                        | Node 24 is the current LTS and is installed.                                                                                             |
| 2026-11-22 | `compact` `formatINR` uses K / L / Cr with one decimal, half-up, trailing `.0` dropped (`₹1L`, `₹1.2L`, `₹3.4Cr`); amounts under ₹1,000 shown in full. | Readable dashboard figures; rounding never shows "100.0K" (bumps to ₹1L).                                                                |
| 2026-11-22 | Tailwind v4 has no config file: tokens are mapped with `@theme inline` in `globals.css`.                                                               | Official v4 approach; theme switching only swaps CSS variables.                                                                          |
| 2026-11-22 | Hex-colour rule implemented as an ESLint `no-restricted-syntax` rule (components + features).                                                          | Runs inside `npm run lint`; no extra script to forget.                                                                                   |
| 2026-11-22 | Unified `radix-ui` package; React 19 ref-as-prop instead of `forwardRef`.                                                                              | One dependency, tree-shaken; `forwardRef` is unnecessary in React 19.                                                                    |
| 2026-11-22 | Added tokens `--danger-fg`, `--brand-panel`, `--brand-panel-fg`.                                                                                       | Readable text on danger buttons in dark mode; AuthLayout panel stays navy in both themes.                                                |
| 2026-11-22 | CA and admin sidebar group headings chosen by us (Part 4.4/4.5 list routes only); approved by the user.                                                | Consistency with the entrepreneur sidebar.                                                                                               |
| 2026-11-22 | Added `/onboarding/business`, `/onboarding/ca-profile`, `/invite/:token` and `/ca/clients/:businessId` as placeholders.                                | They are in Part 4; honest placeholders now avoid broken links later.                                                                    |
| 2026-11-22 | `nav-config.ts` is the single source for sidebar items, workspace routes and placeholder phases.                                                       | Adding a page can't leave the sidebar and router out of sync.                                                                            |
| 2026-11-22 | `useChartColors` re-reads CSS variables via a MutationObserver on `<html class>`.                                                                      | Charts switch colour in the same frame as the theme; no setState-in-effect.                                                              |
| 2026-11-22 | `client/src/dev/**` may use literal English (recorded in AI_RULES).                                                                                    | Developer-only tool, excluded from production builds.                                                                                    |
| 2026-11-24 | `IP_HASH_PEPPER` is required with no default; `.env.example` leaves it empty.                                                                          | A copied placeholder would silently become a known, weak secret; failing fast forces a real value.                                       |
| 2026-11-24 | API router is built by `createApiRouter()` per app instance.                                                                                           | Rate-limit counters (and future per-router state) don't leak between app instances or tests.                                             |
| 2026-11-24 | Shared schema error messages are i18n keys; empty fields report only `required` (`abort: true`).                                                       | One schema serves form and API; messages translate in Phase 22; users see one clear message per field.                                   |
| 2026-11-24 | React Hook Form + `@hookform/resolvers/zod` for forms (first use: contact).                                                                            | Matches ARCHITECTURE 3.3; same schema validates both sides.                                                                              |
| 2026-11-24 | Page `<title>`/meta rendered by React 19 (`PageMeta`); static `<title>` removed from `index.html`.                                                     | No extra dependency; avoids duplicate `<title>` elements.                                                                                |
| 2026-11-24 | Public site is one lazy `marketing` chunk with its own lazily registered i18n namespace.                                                               | Phase 3 requirement; keeps marketing copy out of the workspace bundle.                                                                   |
| 2026-11-24 | `featureStatus.ts` derives Available/Coming soon from each feature's phase vs `COMPLETED_PHASE`.                                                       | One number to bump per phase; the site can't claim a feature before its phase is done.                                                   |
| 2026-11-24 | `server/src/tests/global-setup.ts` pins `MONGOMS_DOWNLOAD_DIR` to `node_modules/.cache/mongodb-memory-server`.                                         | The default cache location moved after an install and triggered a 780 MB re-download.                                                    |
