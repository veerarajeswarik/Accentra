<!-- Track A · Phase 3 -->
## PHASE 3 — Public Website

**Objective:** A premium, responsive marketing site that explains Accentra to entrepreneurs, CAs, and judges.
**Prerequisites:** Phase 2.

```text
=== ACCENTRA — PHASE 3: PUBLIC WEBSITE ===

You are a senior frontend engineer working with a product designer's sensibility. Build Accentra's public website using ONLY the existing design system.

--- A. PROJECT CONTEXT ---
Accentra is an India-focused accounting + CA collaboration platform. Its sharpest differentiator is the structured review workflow: entrepreneurs submit documents/transactions; their Chartered Accountant reviews, requests clarification, and approves — with full history — instead of WhatsApp-and-email chaos. Secondary: Simple/Professional dual-mode interface on one real ledger; India-native (GST-aware, Tamil/Hindi coming, voice entry coming); AI explanations coming.

--- B. EXISTING PROJECT STATE ---
Phases 1–2 complete. Read docs/PROJECT_STATE.md, docs/AI_RULES.md, docs/ARCHITECTURE.md, docs/DESIGN_SYSTEM.md first. PublicLayout, components, routes, and ComingSoon placeholders exist. Reuse components; do not create parallel button/card styles.

--- C. IMPLEMENTATION OBJECTIVE ---
Replace the ComingSoon placeholders for /, /features, /how-it-works, /about, /contact, /privacy, /terms with complete pages; add a working contact form backed by the API.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Home (/):
   - Hero: headline (≤ 10 words) about keeping books CA-ready without the back-and-forth; subheadline (≤ 25 words); primary CTA "Get started free" → /register; secondary "See how it works" → /how-it-works. Right side: a product preview composed from REAL design-system components (a miniature dashboard with StatCards and a review timeline) rendered with clearly fake sample values, scaled down — not a stock image or screenshot.
   - Problem strip: three short problem statements (documents scattered across WhatsApp/email; owners can't read their numbers; CAs chase clients for the same document).
   - "For Entrepreneurs" and "For Chartered Accountants" sections side by side (stacked on mobile), each with 4 benefits (icon + title + one sentence) and a CTA linking to /register?role=entrepreneur or /register?role=ca.
   - Review workflow walkthrough: an interactive 5-step stepper (Upload → Submit for review → CA requests clarification → You fix and resubmit → Approved) — clicking a step shows a small illustrative panel built from components (StatusBadge, Timeline, Card). Keyboard accessible.
   - Simple vs Professional mode demo: a ModeToggle that switches the labels of a sample card set live (uses the real terminology map).
   - Trust & security section: concrete, TRUE statements only — encrypted connections (HTTPS), your data shared only with the CA you choose and revocable anytime, full history of every change, CA credentials manually verified. Do not claim certifications, bank-grade encryption, or compliance standards we don't have.
   - "Coming soon" row: AI financial explanations, Tamil & Hindi, voice entry, GST summaries — explicitly labelled as upcoming.
   - FAQ accordion (8 questions; e.g., Is my data shared with anyone? Do I need an accountant to use Accentra? Is Accentra a replacement for my CA? Does Accentra file my GST returns? — answer honestly: no, not currently). 
   - Final CTA band.
2. /features: modules grouped into Bookkeeping, Collaboration, Insights, India-native; each feature shows a status pill "Available" or "Coming soon" driven by a single config file (client/src/features/marketing/featureStatus.ts) so it stays honest as phases complete.
3. /how-it-works: two tabbed flows (Entrepreneur, CA) each as a 4–5 step vertical timeline with short explanations.
4. /about: mission, the principles (simple, transparent, India-first, AI only where useful), and a "Built by" section with placeholder for the founder's name and photo (a clearly marked TODO, not fake people).
5. /contact: form with name, email, role (entrepreneur / CA / other), subject, message (20–2000 chars); client + server validation via a shared Zod schema in @accentra/shared; success state replaces the form with a confirmation; error toast on failure; submit button shows loading.
6. /privacy and /terms: readable, well-structured pages with a prominent banner "Draft — pending legal review. Accentra is currently a demonstration product." Cover: what data we collect, why, who it's shared with (only CAs you connect with), how to delete, contact. Mention India's Digital Personal Data Protection Act as the framework we intend to align with — do not claim compliance.
7. SEO basics: per-page <title> and meta description (use a small useDocumentMeta hook or react-helmet-async), Open Graph tags, favicon (simple "A" monogram SVG in brand colors), robots.txt allowing public pages and disallowing /app, /ca, /admin.

--- E. FRONTEND REQUIREMENTS ---
All strings through t() (namespace "marketing"). Responsive at 360/768/1024/1440. Both themes. Images: none required; if any illustration is added it must be inline SVG using theme tokens. Lazy-load the marketing route chunk.

--- F. BACKEND REQUIREMENTS ---
Module server/src/modules/contact/: POST /api/v1/contact — validates with the shared schema; strict rate limit (5 requests / 15 min / IP via express-rate-limit); stores in contactMessages; returns 201 { data: { id } }. Honeypot field (hidden input "website"; if filled, respond 201 but do not store). No authentication.

--- G. DATABASE REQUIREMENTS ---
Model ContactMessage: name, email (lowercased), role, subject, message, ip (hashed with a server pepper, not raw), userAgent, status ("new" | "handled"), createdAt. Index on createdAt.

--- H. INTEGRATION REQUIREMENTS ---
Register CTAs pass ?role= which the Phase 4 register page will read. Admin support inbox (Phase 25) will read contactMessages — keep the model generic.

--- I. SECURITY REQUIREMENTS ---
Rate limiting; input validation on server; output never rendered as HTML; no PII in logs; honest copy (rule 15: never present simulated features as real).

--- J. TESTING REQUIREMENTS ---
Server: valid submission 201 + stored; invalid email 400 with field error; message too short 400; honeypot filled → 201 + not stored; 6th request in window → 429. Client: contact form shows field errors, loading, and success state. Run Lighthouse (Chrome DevTools) on / in both themes and report Performance, Accessibility, Best Practices, SEO scores.

--- K. COMPLETION CRITERIA ---
All seven pages complete, responsive, both themes; contact form persists to MongoDB (verify in Atlas Data Explorer); Accessibility score ≥ 90; no claims of features that don't exist; featureStatus config drives "Available/Coming soon"; tests pass; PROJECT_STATE.md updated.

--- L. FINAL AI INSTRUCTIONS ---
Plan first, wait for approval. Write marketing copy that is specific and plain (no "revolutionary", "seamless", "cutting-edge", "unlock"). Reuse design-system components only; if a new component is genuinely needed, add it to components/ui with showcase entry and document it in DESIGN_SYSTEM.md. Follow docs/AI_RULES.md. Run tests; show output. Update PROJECT_STATE.md. Report all changes.
```

**Git:** `git commit -m "feat: phase 3 public website and contact api"` → `git tag phase-3-complete`

**Checklist:** [ ] Pages responsive in both themes · [ ] Contact message visible in Atlas · [ ] Rate limit returns friendly error after 5 tries · [ ] Lighthouse a11y ≥ 90 · [ ] FAQ honestly says Accentra does not file GST
