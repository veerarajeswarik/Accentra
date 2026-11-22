# Server modules — one folder per feature

Every feature (auth, businesses, transactions, reviews…) lives in its own folder here and
follows the same four-layer pattern:

```
modules/<feature>/
├── <feature>.routes.ts      ← URL + middleware chain (authenticate → requireRole → requireBusinessAccess → validate)
├── <feature>.controller.ts  ← translates HTTP ⇄ service calls. No business logic.
├── <feature>.service.ts     ← ALL business logic. Takes businessId as its first argument.
└── <feature>.test.ts        ← Vitest + Supertest tests
```

Mongoose models live in `src/models/` (one file per model), not inside a module.

**Request flow:** `routes → controller → service → model`

Rules:

- Controllers never talk to models directly; they call a service.
- Services never touch `req`/`res`; they receive plain arguments and return plain data, so they
  can be reused by seed scripts, scheduled jobs, and the AI assistant.
- Throw `AppError` (from `src/lib/app-error.ts`) for expected failures; the error handler turns
  it into the standard error envelope.
- Register the module's router in `src/routes.ts`.

See `health/` for the smallest working example.
