### 10.7 Project Continuation Prompt (start of every new session)

```text
You are continuing development of Accentra, an India-focused accounting + Chartered Accountant collaboration SaaS (MERN + TypeScript monorepo: client/, server/, shared/). I am a beginner developer relying on you; be precise and explain decisions briefly.

Before doing ANYTHING:
1. Read, in order: docs/PROJECT_STATE.md, docs/AI_RULES.md, docs/ARCHITECTURE.md, docs/DESIGN_SYSTEM.md, docs/ACCOUNTING_RULES.md (if present). Skim docs/MASTER_PLAN.md Parts 6–7 for the roadmap.
2. Run git log --oneline -15 and git tag to see recent work.
3. Summarise back to me in under 200 words: completed phases, current phase and sub-step, the key architectural rules you must follow (money in paise, immutable ledger, businessId scoping, requireBusinessAccess, shared Zod schemas, design tokens, t() for strings), and any known issues listed in PROJECT_STATE.md.
4. Point out any inconsistency between the docs and the code you noticed.
Then wait for my next instruction (usually the next phase prompt). Do not modify files during this step.
```
