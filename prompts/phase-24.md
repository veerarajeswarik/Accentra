<!-- Track B · Phase 24 -->
## PHASE 24 — Financial Learning Hub & Gamified Habits

```text
=== ACCENTRA — PHASE 24: FINANCIAL LEARNING HUB & HABIT-BASED GAMIFICATION ===

You are a senior full-stack engineer and learning-experience designer. Teach practical bookkeeping in short, applied lessons and reward healthy habits — never spending.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS). Audience: small business owners with limited accounting knowledge, in English, Tamil, and Hindi. Content should connect to the user's real data ("Here's your own P&L") when useful.

--- B. EXISTING PROJECT STATE ---
Phases 1–23 complete. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md, DESIGN_SYSTEM.md. Inspect i18n, glossary, AI getAccountingConcept tool, dashboard.

--- C. IMPLEMENTATION OBJECTIVE ---
Lesson content system (Markdown/MDX files in the repo, versioned, translated), learning paths, progress tracking, quick quizzes, glossary browser, contextual "Learn more" links throughout the app, and habit gamification (streaks, milestones, checklists) based on bookkeeping behaviour.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Content: client/src/content/lessons/<lang>/<slug>.md with frontmatter (title, path, order, minutes, tags, relatedRoute, lastReviewed). Paths and initial lessons (5–8 each, 3–5 minutes): Bookkeeping basics (what a transaction is, cash vs profit, categories, receipts matter); Understanding your statements (P&L, balance sheet, cash flow in plain words); Getting paid (invoices, receivables, follow-ups); GST basics (registration, CGST/SGST/IGST, what ITC means, why your CA reviews it — with "rules change; confirm with your CA"); Working with your CA (what documents to share monthly, how reviews work). Each lesson ends with "Try it in Accentra" linking to the relevant page with the user's data.
2. Rendering: markdown with a safe renderer (no raw HTML), callout components (tip, warning, example), glossary term hover-cards.
3. Quizzes: 3 multiple-choice questions per lesson in frontmatter; immediate feedback; not graded publicly.
4. Progress: lessonProgress (userId, slug, completedAt, quizScore); path completion; "Continue learning" card on dashboard (dismissible).
5. Glossary browser /app/learn/glossary (from Phase 22 glossary) with search.
6. Contextual help: small "?" links on complex screens (reports, GST, reviews) to the relevant lesson.
7. Habits (deterministic, from real activity): weekly bookkeeping streak (≥ 1 recorded transaction or document per week), "Receipts attached" rate for the month, "Books reviewed" milestone (first approved review), "On-time" milestones (no overdue bills this month). Display: a compact "Bookkeeping health" card on the dashboard with streak count and next milestone; milestones list page. Rules: no points for amounts spent or earned; no leaderboards comparing businesses; can be hidden in settings.
8. AI integration: getAccountingConcept tool reads lesson summaries first.

--- E–I ---
features/learn, features/habits; module learning/ (progress + habits computation endpoints); collections lessonProgress, habitSnapshots (weekly). Content files bundled with the client (no CMS yet — document future CMS option). Security: content static; markdown sanitized.

--- J. TESTING ---
Rendering of all lessons in all languages (no missing files); quiz logic; progress persistence; habit computations on fixtures (week boundaries in Asia/Kolkata); hide-in-settings respected. Run; show output.

--- K. COMPLETION ---
Learning hub navigable in three languages; progress saved; habit card shows real streaks; no spending-based rewards; PROJECT_STATE.md updated noting lessons need expert review.

--- L. FINAL AI INSTRUCTIONS ---
Plan first, including the lesson outline for my review before writing content. Follow docs/AI_RULES.md. Run tests; show output. Update docs. Report changes.
```

**Git:** → `git tag phase-24-complete`
