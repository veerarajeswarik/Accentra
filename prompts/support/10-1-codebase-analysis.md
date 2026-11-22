### 10.1 Codebase Analysis Prompt

```text
You are a senior software architect reviewing the Accentra codebase (MERN + TypeScript monorepo: client/, server/, shared/). Do NOT change any files.

First read docs/PROJECT_STATE.md, docs/AI_RULES.md, docs/ARCHITECTURE.md, docs/DESIGN_SYSTEM.md, docs/ACCOUNTING_RULES.md (if present), and docs/MASTER_PLAN.md. Then inspect the code.

Report:
1. Architecture as it actually exists (folders, modules, data flow) and every place it differs from ARCHITECTURE.md.
2. Features implemented end-to-end (UI + API + database + tests), partially implemented (name exactly what's missing), and not started — mapped to roadmap phases.
3. Any mock data, placeholder buttons, or fake integrations still present (file and line).
4. Security concerns: routes missing authenticate/requireRole/requireBusinessAccess/validation; queries missing businessId; secrets in code; tokens in localStorage.
5. Accounting concerns: any floating-point money math (search parseFloat, toFixed, Number arithmetic on rupees), any ledger writes outside ledger.service, any mutable journal entries.
6. Code quality: duplicate components/routes/models, unused files, inconsistent patterns.
7. Test status: run npm run test, npm run lint, npm run typecheck and paste the real results.
8. A prioritised list of the top 10 problems with suggested fixes.
Keep the report factual; cite files and line numbers.
```
