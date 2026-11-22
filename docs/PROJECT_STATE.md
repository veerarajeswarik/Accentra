# Project State

> AI tools: read this FIRST at the start of every session. Update it at the END of every phase.

## Current phase

**Phase 2 — Design System, Theme & Application Shell: complete (2026-11-22).**
Next: **Phase 3 — Public Website** — `prompts/phase-03.md`. Phase 3 replaces the public `ComingSoonPage` placeholders (`client/src/routes/placeholders.ts` → `PUBLIC_PAGES`) inside the existing `PublicLayout`.

## Completed phases

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

| Method | Path          | Auth | Description                                                     |
| ------ | ------------- | ---- | --------------------------------------------------------------- |
| GET    | `/health`     | none | `{ data: { status: "ok", db: "up" \| "down", version, time } }` |
| \*     | anything else | —    | `404 { error: { code: "NOT_FOUND", ... } }`                     |

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

None yet.

### Shared (`@accentra/shared`)

- `money/` — `toPaise(str, {allowNegative?})`, `fromPaise(int)`, `formatINR(int, {compact?})`, `MoneyError`.
- `constants/` — `ROLES`, `Role`, `isRole`; `ERROR_CODES`, `ErrorCode`.
- `types/` — `ApiSuccess<T>`, `ApiMeta`, `ApiErrorBody`, `HealthStatus`.
- `schemas/` — empty (Zod schemas arrive with features).

### Client routes (`client/src/router.tsx`)

Every route below currently renders `ComingSoonPage` with its planned phase, except `/dev/components`.

| Area         | Layout                                | Routes (planned phase)                                                                                                                                                                                                                                                                        |
| ------------ | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public       | `PublicLayout`                        | `/` `/features` `/how-it-works` `/about` `/contact` `/privacy` `/terms` (3) · `*` → 404                                                                                                                                                                                                       |
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
- `locales/en/`: `common`, `nav`, `pages`, `terms`, `ui`.
- `dev/`: showcase, sample data (obviously fake), `ApiStatus`, `RouteMap`.

### Browser storage keys (UI preferences only, never tokens)

`accentra-theme` · `accentra-mode` · `accentra-lang` · `accentra-sidebar-collapsed`

## Environment variables

### Server (`server/.env`, documented in `server/.env.example`)

| Variable        | Required | Default                 | Notes                                   |
| --------------- | -------- | ----------------------- | --------------------------------------- |
| `NODE_ENV`      | no       | `development`           | `development` \| `test` \| `production` |
| `PORT`          | no       | `5000`                  |                                         |
| `MONGODB_URI`   | **yes**  | —                       | Atlas string with db `accentra_dev`     |
| `CLIENT_ORIGIN` | no       | `http://localhost:5173` | the only CORS origin allowed            |

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
- Client production bundle is ~606 KB (191 KB gzip), above Vite's 500 KB warning. Fix by lazy-loading workspace pages as they are built (route-level `lazy`), at the latest in Phase 26.
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
