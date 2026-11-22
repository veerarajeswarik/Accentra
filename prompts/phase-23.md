<!-- Track B · Phase 23 -->
## PHASE 23 — Voice Transaction Recording

```text
=== ACCENTRA — PHASE 23: VOICE-BASED TRANSACTION RECORDING (WITH MANDATORY CONFIRMATION) ===

You are a senior frontend + AI integration engineer. Build voice entry that turns speech into a DRAFT transaction the user must confirm. Accuracy limitations must be visible, never hidden.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS). Example: a Tamil-speaking shop owner says (in Tamil) "Paid 1,200 rupees electricity bill by UPI today" and sees a pre-filled Money Out form for review. Transactions form (Phase 7), AI adapter (Phase 21), and languages (Phase 22) exist.

--- B. EXISTING PROJECT STATE ---
Phases 1–22 complete. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md, DESIGN_SYSTEM.md. Inspect transaction form, AI adapter, category suggestion logic, i18n.

--- C. IMPLEMENTATION OBJECTIVE ---
Speech capture (browser Web Speech API with en-IN, ta-IN, hi-IN), a provider interface for server-side speech-to-text (implement "browser" now; leave "cloud" as a documented boundary), transcript review, AI parsing into a validated draft, confirmation in the standard form, and graceful fallbacks.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Mic button on the transactions page and in the record-transaction drawer ("Speak a transaction"). Capability detection: if SpeechRecognition is unavailable (e.g., Firefox) show "Voice entry isn't supported in this browser — try Chrome or Edge" and hide the mic.
2. Recording UI: language selector defaulting to the app language; listening indicator with live interim transcript; stop button; max 30 seconds; permission-denied help text.
3. Transcript step: editable textarea showing the final transcript (user can fix misheard words) + "Interpret" button. Keep the transcript in memory only; do not store audio anywhere.
4. Parsing: POST .../ai/parse-transaction { text, language } → server uses AI extractStructured with a Zod schema { kind, amountRupeesText, date (relative words like today/yesterday resolved server-side in Asia/Kolkata), categoryHint, paymentMethod, contactName?, description, confidence per field } → server maps hints to real account/contact IDs deterministically (fuzzy match against the business's categories/contacts; unknown contact → suggest creating), converts amount with shared toPaise (reject ambiguous amounts — e.g., "twelve hundred fifty" vs "1250" both fine, but "around 1000" flagged). Handles Indian number words in English (lakh, crore) and common Tamil/Hindi number words (test cases).
5. Confirmation: open the standard transaction form pre-filled, every AI-filled field highlighted with a small "from voice" marker and low-confidence fields flagged amber; banner "Check the details before saving"; nothing is saved until the user presses Save. Audit the created transaction with source "voice".
6. Fallbacks: AI_PROVIDER=none → skip parsing, put transcript into description and let the user fill the form.
7. Accessibility: keyboard alternative path always available; screen-reader announcements for listening state.

--- E–I ---
features/voice; endpoint in ai/ module; no new collections except aiUsage accounting. Security/privacy: no audio stored or sent to Accentra servers in browser mode (note: browser vendors may process speech in the cloud — disclose this in the first-use dialog); transcripts not persisted unless the user saves the transaction (description only).

--- J. TESTING ---
Parser tests with 40 utterances across en/ta/hi including tricky amounts, relative dates, payment methods, unknown contacts; mapping to accounts; low-confidence flags; never-auto-save (component test asserts no API create call before Save click); unsupported-browser path. Run; show output.

--- K. COMPLETION ---
Speak → review transcript → interpreted form → confirm → saved, in all three languages on Chrome desktop and Android; PROJECT_STATE.md updated with known accuracy limitations.

--- L. FINAL AI INSTRUCTIONS ---
Plan first. Follow docs/AI_RULES.md (rule 23 is central). Run tests; show output. Update docs. Report changes and an honest accuracy note.
```

**Git:** → `git tag phase-23-complete`
