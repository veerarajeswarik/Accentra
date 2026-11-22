# PART 8 — Detailed AI Coding Prompts

### How every prompt in this part works

1. **Each prompt is self-contained** with sections A–L as you specified. Copy everything inside the code block.
2. **Each prompt tells the AI to read four files first**: `docs/PROJECT_STATE.md`, `docs/AI_RULES.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md` (plus `docs/ACCOUNTING_RULES.md` from Phase 6). Phase 1 creates them. This is how a tool with no memory of yesterday knows what exists today.
3. **Each prompt ends by updating `PROJECT_STATE.md`** and reporting what changed. Never skip this.
4. **Each prompt starts in "plan mode"**: the AI must present a plan and wait for your "go ahead." Read the plan. If it mentions deleting or rewriting something from an earlier phase, say no and ask why.
5. **Large phases are split into a, b, c sub-steps.** Run them as separate prompts in the same conversation. Commit after each.
6. **Git checkpoint commands** appear after each prompt. They are your undo button.

> Before Phase 1: save this whole document into your project as `docs/MASTER_PLAN.md` (Part 9, Step 4 shows how). Phase 1 extracts the architecture and design-system sections from it.
