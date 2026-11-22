<!-- Track B · Phase 22 -->
## PHASE 22 — Multilingual Support (English, Tamil, Hindi)

```text
=== ACCENTRA — PHASE 22: MULTILINGUAL SUPPORT — ENGLISH, TAMIL, HINDI ===

You are a senior frontend engineer with internationalisation expertise. Translate the full product into Tamil and Hindi while preserving the precise meaning of accounting terms.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS). react-i18next has been scaffolded since Phase 2 with English namespaces. Every UI string should already go through t() — this phase verifies that and adds languages.

--- B. EXISTING PROJECT STATE ---
Phases 1–21 complete. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md, DESIGN_SYSTEM.md. Inspect client/src/locales, terminology map (useTerm), email templates, notification rendering, PDF templates, AI system prompt.

--- C. IMPLEMENTATION OBJECTIVE ---
Audit and fix untranslated strings; accounting glossary; Tamil and Hindi locale files for all namespaces; language switching everywhere (UI, notifications, emails, AI responses, Simple/Pro terms); fonts; formatting; translation QA tooling.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Audit: run an automated scan (i18next-parser or a custom script) to find hardcoded user-facing strings in client/src; fix all; add a CI check that fails on new hardcoded strings in JSX text nodes (allow-list for brand names).
2. Glossary (docs/GLOSSARY.md + client/src/locales/glossary.json): ~80 accounting/finance terms with English, Tamil, Hindi, and a one-line plain-language explanation in each language. Policy: where a common English loanword is how business owners actually speak (e.g., "GST", "invoice", "UPI"), keep it, optionally with the native term; for Simple Mode use everyday phrasing; for Professional Mode use standard terms with English in parentheses on first appearance in help text. Mark every glossary entry "machine-drafted — needs native speaker review" until reviewed; add a reviewedBy field.
3. Locale files ta/ and hi/ for every namespace, generated from English with the glossary applied. Pluralisation and interpolation correct (i18next plural rules for ta and hi). Do not translate user data (business names, descriptions).
4. Terminology map (useTerm) becomes i18n keys: terms.simple.revenue, terms.pro.revenue, etc.
5. Formatting: numbers keep Indian grouping in all languages (₹1,23,456.78); dates via Intl.DateTimeFormat with locale ta-IN / hi-IN; relative times localised.
6. Fonts: Noto Sans Tamil and Noto Sans Devanagari self-hosted, loaded only when needed (font-display swap); line-height adjustments for these scripts in DESIGN_SYSTEM.md; check that buttons, badges, table headers and sidebar labels don't overflow (longer strings) — fix layouts with wrapping/truncation + tooltips.
7. Server-side: notification titles/bodies already render client-side (Phase 13 design) — verify; emails rendered in the recipient's preferredLanguage (server i18n with i18next + same JSON files from shared or a server locales folder — choose one source of truth and justify); PDFs: invoice PDFs stay in English by default with an option to add Tamil/Hindi labels (requires embedding Noto fonts in pdfkit); AI assistant responds in the user's language (pass language in context; tool data unchanged).
8. Language selection: onboarding, settings, public site selector — all enabled now; persists to user profile and localStorage; <html lang> updated.
9. Translation QA page (/dev/i18n, dev only): side-by-side table of keys across languages with missing/too-long highlighting; pseudo-locale (e.g., "[!! Ŝéttíñgš !!]") toggle to spot untranslated strings.

--- E–I ---
No new backend collections. Security: translations are static JSON; never render translations as HTML unless using i18next Trans with allow-listed components.

--- J. TESTING ---
No missing keys in ta/hi (script check); pseudo-locale renders with no raw English except allow-list; snapshot of key screens in all three languages at 360px and 1440px reviewed manually; email rendered in Tamil for a Tamil user (test); AI receives language parameter (test). Run; show output.

--- K. COMPLETION ---
Entire app usable in Tamil and Hindi; no layout breakage; glossary documented with review status; PROJECT_STATE.md updated noting that native-speaker review is REQUIRED before public launch.

--- L. FINAL AI INSTRUCTIONS ---
Plan first. Sub-steps: (22a) audit + CI check; (22b) glossary for my review (STOP); (22c) locale files; (22d) server-side languages + fonts + QA page. Follow docs/AI_RULES.md. Run tests; show output. Update docs. Report changes.
```

**Git:** → `git tag phase-22-complete` · **Human step:** have a fluent Tamil speaker and a fluent Hindi speaker (ideally with accounting familiarity) review the glossary and key screens.
