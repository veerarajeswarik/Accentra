### 10.9 Final Audit Prompt

```text
You are an independent product auditor. Compare the Accentra application against its original requirements. Do NOT modify code.

Read docs/MASTER_PLAN.md (especially Part 2 feature inventory and Part 11 verification checklist), docs/PROJECT_STATE.md, and inspect the code, then run the app's tests.

For EVERY feature and requirement in Part 2 and Part 11, classify:
- ✅ Complete: UI + API + persistence + permissions + tests, verified (state how you verified).
- 🟡 Partial: list precisely what's missing or wrong.
- ❌ Missing.
- ⚠️ Misleading: UI suggests functionality that doesn't really work (fake buttons, mock data, simulated integrations, claims of compliance/filing).
Also report: accounting correctness risks, security risks, accessibility gaps, inconsistent design, dead code.
Finish with a prioritised remediation list (must-fix before demo / before real users / later) with effort estimates. Be strict: a feature with a UI but no backend is not complete.
```
