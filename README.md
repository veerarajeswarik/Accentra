# Accentra

India-focused accounting and CA-collaboration web app: entrepreneurs keep their books on a real
double-entry ledger and work with their Chartered Accountant through document review workflows.

> ⚠️ Development build. Use **clearly labelled demo data only**, never a real business's books
> (see `docs/plan/00-read-this-first.md`, point 4).

## Prerequisites

- **Node.js 22 or newer** (24 LTS recommended) and npm — `node -v`
- **Git** — `git --version`
- A **MongoDB Atlas** free (M0) cluster and connection string — see `docs/plan/09-beginner-guide-windows.md`, Step 3
- PowerShell must allow npm scripts (one time):
  `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

## Setup (Windows PowerShell)

```powershell
git clone <your-repo-url> accentra
cd accentra
npm install
Copy-Item server\.env.example server\.env
code server\.env          # paste your Atlas connection string into MONGODB_URI
npm run dev               # client: http://localhost:5173   API: http://localhost:5000
```

Open http://localhost:5173 — you should see **API status: ok** and **Database: up**.
If the database shows **down**, check `MONGODB_URI` and Atlas → Network Access (your IP).

## Scripts (run from the project root)

| Command                | What it does                                                   |
| ---------------------- | -------------------------------------------------------------- |
| `npm run dev`          | Starts the API (tsx watch) and the client (Vite) together      |
| `npm run build`        | Builds shared → server → client for production                 |
| `npm run test`         | Runs all tests (shared, server with in-memory MongoDB, client) |
| `npm run typecheck`    | TypeScript checks in every package                             |
| `npm run lint`         | ESLint across the monorepo                                     |
| `npm run format`       | Formats all files with Prettier                                |
| `npm run format:check` | Checks formatting without changing files                       |

Run one package only with `-w`, e.g. `npm run test -w server`.

## Project layout

```
client/   React + Vite + Tailwind web app
server/   Express 5 REST API (/api/v1) + MongoDB (Mongoose)
shared/   Code used by both: money helpers (integer paise), constants, schemas, types
docs/     Project memory: PROJECT_STATE, AI_RULES, ARCHITECTURE, DESIGN_SYSTEM, MASTER_PLAN
prompts/  One AI prompt per development phase (start with START-HERE.md)
```
