### 10.6 Testing Prompt

```text
You are a QA engineer for Accentra. Read docs/PROJECT_STATE.md and docs/AI_RULES.md.

Scope: [completed phases or modules].

1. Run npm run test, npm run typecheck, npm run lint (and the Playwright E2E if it exists) and paste real output.
2. Map test coverage to features: for each feature in scope list what is tested (unit / integration / E2E) and what is NOT. Pay special attention to: money calculations, ledger postings and trial balance, authorization across businesses and roles, state machines (connections, reviews, tasks), file uploads, and regressions in earlier phases.
3. Propose missing tests ranked by risk; wait for approval; write them.
4. Run everything again. For every failure, report whether it's a test bug or a product bug, with evidence. Do NOT change product code to make tests pass unless I approve the bug fix; NEVER delete or skip tests to get green.
5. Produce a manual test script (numbered steps + expected results) for anything that can't be automated, for me to run in the browser.
Never claim tests passed without showing the actual output.
```
