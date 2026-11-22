# Accentra — Start Here

You do **not** need to paste large files into Claude Code. Claude Code can read files from your project folder itself. You only type one short line per phase.

## 1. Put these files in your project (one time)

Extract this zip into your project folder, e.g. `C:\dev\accentra`, so you get:

```
C:\dev\accentra\
├── START-HERE.md                 ← this file
├── docs\
│   ├── MASTER_PLAN.md            ← full plan (Claude Code reads it; you never paste it)
│   └── plan\                     ← the same plan split into small, readable parts
│       ├── 00-read-this-first.md
│       ├── 01-02-understanding-and-features.md
│       ├── 03-architecture.md
│       ├── 04-website-structure.md
│       ├── 05-design-system.md
│       ├── 06-07-dependencies-and-roadmap.md
│       ├── 08-how-prompts-work.md
│       ├── 09-beginner-guide-windows.md   ← read this before Phase 1
│       ├── 11-verification-checklist.md
│       ├── 12-demo-plan.md
│       └── future-enhancements.md
└── prompts\
    ├── phase-01.md … phase-27.md ← one phase per file (all under 13,000 characters)
    ├── TRACK-B-NOTE.md
    └── support\                  ← debugging, testing, continuation, learning prompts…
```

Then commit them:

```powershell
cd C:\dev\accentra
git add .
git commit -m "docs: add accentra plan and phase prompts"
```

## 2. Run a phase in Claude Code (the short way — recommended)

Open the project in VS Code, start Claude Code in the terminal, and type **just this**:

```text
Read prompts/phase-01.md and carry out the prompt inside its ```text block. Start with the plan step and wait for my approval before writing any files.
```

For the next phases, change the number (`phase-02.md`, `phase-03.md`, …). Start a **fresh Claude Code session** for each phase.

For sub-steps (e.g. Phase 4 has 4a, 4b, 4c), after the AI finishes one, type:

```text
Continue with sub-step 4b from prompts/phase-04.md.
```

## 3. Support prompts (same short way)

| When | Type this in Claude Code |
|---|---|
| Starting any new session | `Read prompts/support/10-7-project-continuation.md and follow it.` |
| Something is broken | `Read prompts/support/10-2-debugging.md and follow it. Here is my problem: …` (then paste your error) |
| After finishing a phase | `Read prompts/support/10-10-learning.md and follow it for the phase we just finished.` |
| Before moving on | `Read prompts/support/10-6-testing.md and follow it for Phase N.` |
| Security check | `Read prompts/support/10-5-security-review.md and follow it for the changes since tag phase-N-complete.` |
| Deploying | `Read prompts/support/10-8-deployment.md and follow it for production.` |
| Final check | `Read prompts/support/10-9-final-audit.md and follow it.` |

## 4. If you prefer copy-paste

Every file in `prompts\` is small enough to paste directly. Open it in VS Code, copy **only the text inside the ```text block**, and paste it into Claude Code.

## 5. Your first three steps

1. Read `docs/plan/00-read-this-first.md` (the important decisions).
2. Do `docs/plan/09-beginner-guide-windows.md` Steps 1–5 (install tools, MongoDB Atlas, Git, GitHub).
3. In Claude Code: `Read prompts/phase-01.md and carry out the prompt inside its ```text block.`
