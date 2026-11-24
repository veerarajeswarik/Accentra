# AI Rules — read before every change

Every AI coding session on Accentra must read this file, `PROJECT_STATE.md`, `ARCHITECTURE.md`
and `DESIGN_SYSTEM.md` (plus `ACCOUNTING_RULES.md` from Phase 6) before planning any change.

## STRICT DEVELOPMENT RULES

1. Analyze the existing codebase before editing. 2. Never recreate the entire project unnecessarily. 3. Preserve previously implemented features. 4. Do not replace working functionality with mock functionality. 5. Do not silently remove existing components. 6. Avoid duplicate files, routes, components, and database models. 7. Reuse existing design-system components. 8. Maintain consistent TypeScript types and interfaces. 9. Use modular, maintainable code. 10. Keep frontend and backend responsibilities separate. 11. Never expose database credentials or API secrets. 12. Enforce permissions on the backend, not only through frontend navigation. 13. Avoid hardcoded financial values in production functionality. 14. Use realistic demonstration data only when explicitly identified as demo data. 15. Never present simulated features as real integrations. 16. Ensure every interactive control performs its intended function. 17. Provide clear error messages. 18. Handle loading and empty states. 19. Maintain light and dark theme compatibility. 20. Verify that new changes do not break existing modules. 21. Use correct accounting calculations and data relationships. 22. Preserve auditability of financial changes. 23. Do not automatically execute sensitive financial or tax actions based solely on AI output. 24. Explain any required third-party credentials or services. 25. Never claim testing succeeded unless tests were actually executed.
   If a feature cannot be completed without external credentials, configuration, or legal authorization, implement the integration boundary (interface + clearly labelled stub) and explain exactly what remains.

## Conventions

### Folder structure

npm-workspaces monorepo (see `ARCHITECTURE.md` §3.2 for the full tree):

| Package                        | Purpose                                                                                                                                                                           |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/` (`@accentra/shared`) | Code used by BOTH sides: `money/`, `constants/`, `schemas/` (Zod), `types/`. Imported from source in dev via the `development` export condition; built to `dist/` for production. |
| `server/` (`@accentra/server`) | Express 5 API. `config/` (env, db, logger), `middleware/`, `modules/<feature>/`, `models/`, `lib/`, `scripts/`, `tests/`.                                                         |
| `client/` (`@accentra/client`) | React + Vite SPA. `components/ui`, `components/layout`, `features/<feature>/`, `lib/`, `providers/`, `locales/`, `styles/`.                                                       |

- Server features follow **routes → controller → service → model** (see `server/src/modules/README.md`). All business logic lives in services.
- Register each new server module's router in `server/src/routes.ts`.
- Client features mirror server modules in `client/src/features/<feature>/` (`api.ts`, `hooks.ts`, pages, forms).

### Naming

- Server files: **kebab-case** with a role suffix — `auth.routes.ts`, `auth.service.ts`, `error-handler.ts`, `ca-profiles/`.
- React components: **PascalCase** files and names — `TransactionForm.tsx`. Hooks: `useThing`.
- Tests sit next to the code they test: `*.test.ts` / `*.test.tsx`.
- Server ESM imports use the `.js` extension for local files (`import { x } from './x.js'`).

### Money

- All money is **integer paise** (`amountPaise: 150050` = ₹1,500.50). Never floats, never strings in the database.
- Money field names **end in `Paise`**.
- Convert user input with `toPaise()`, display with `formatINR()`, from `@accentra/shared`. Never `parseFloat` money.

### Forms and validation

- Forms use **React Hook Form + `zodResolver(sharedSchema)`** (see `client/src/features/marketing/contact/ContactForm.tsx`). Controlled components (Select, DatePicker, MoneyInput) go through `Controller`; use `useWatch`, not `watch()`.
- The server validates the same schema with `validateBody(schema)` (`server/src/middleware/validate.ts`) before the controller runs.
- Map server `VALIDATION_ERROR` details back onto fields with `setError`; show other failures in an error toast.

### Environment

- `server/src/config/env.ts` is the **only** file that reads `process.env`. Add new variables to its Zod schema **and** to `server/.env.example` (with an explanation), and list them in `PROJECT_STATE.md`.
- Nothing secret ever goes in a `VITE_` variable.

### API envelope and error codes

- Base path `/api/v1`. Success: `{ "data": ..., "meta"?: { page, pageSize, total } }`.
- Error: `{ "error": { "code", "message", "details"? } }` — produced only by the central error handler.
- Throw `AppError.badRequest / unauthenticated / forbidden / notFound / conflict` from `server/src/lib/app-error.ts`.
- Codes (in `@accentra/shared` `ERROR_CODES`): `VALIDATION_ERROR` 400, `UNAUTHENTICATED` 401, `FORBIDDEN` 403, `NOT_FOUND` 404, `CONFLICT` 409, `PAYLOAD_TOO_LARGE` 413, `RATE_LIMITED` 429, `INTERNAL` 500.
- Production responses never include stack traces or internal error messages.
- The client calls the API only through `client/src/lib/apiClient.ts`, which converts error envelopes into `ApiError`.

### Data access

- **Every business-scoped query filters by `businessId`.** Every service function takes `businessId` as its first argument.
- A user requesting another business's data gets `404 NOT_FOUND`, not `403`.
- Multi-document writes use MongoDB transactions (sessions).

### UI text

- **All UI text goes through i18n `t()` from Phase 2 onward.** No hardcoded user-facing strings in components.
- Namespaces live in `client/src/locales/en/<namespace>.json`: `common`, `nav`, `pages`, `terms`, `ui`, `validation` (registered in `client/src/lib/i18n.ts`) and `marketing` (registered lazily by `client/src/features/marketing/i18n.ts`, so it ships in the marketing chunk).
- **Shared Zod schemas use i18n keys as error messages** (e.g. `validation:email.invalid`), never English. Forms translate them with `t(message)`; the API returns the same keys in `error.details[].message`. Add the key to `validation.json` when you add a rule.
- Primitives receive text via props; composite components may default to `t('ui:…')` keys.
- Exemption: `client/src/dev/**` (the `/dev/components` showcase) is a developer tool that is excluded from production builds, so it may use literal English and sample data.

### Design system

- Reuse the components in `client/src/components/ui/` (inventory in `DESIGN_SYSTEM.md`). Do not recreate them inside features.
- No raw hex colours in `client/src/components/**` or `client/src/features/**` (enforced by `npm run lint`). Use token classes.
- Every new screen must be checked in light AND dark themes, and at 360px width.
- New pages register their route in `client/src/router.tsx`, replacing the placeholder. Workspace pages are listed in `components/layout/nav-config.ts`.

### Git

- Commit messages: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:` + short imperative summary.
- One branch per phase (`phase-N`), tag `phase-N-complete` when merged.
- Never commit `.env` files.

### Quality gates (must pass before every commit)

```powershell
npm run test
npm run typecheck
npm run lint
npm run format:check
```
