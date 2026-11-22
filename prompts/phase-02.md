<!-- Track A · Phase 2 -->
## PHASE 2 — Design System, Theme & Application Shell

**Objective:** Build every reusable UI component, the three layouts, light/dark theme with persistence, Simple/Professional mode context, and the i18n scaffold — *before* any real page exists.
**Prerequisites:** Phase 1.
**Expected UX:** A `/dev/components` showcase page where every component can be seen in both themes; layouts navigable with placeholder routes clearly labelled "Coming in Phase N".

```text
=== ACCENTRA — PHASE 2: DESIGN SYSTEM, THEME & APPLICATION SHELL ===

You are a senior frontend engineer and design-systems specialist. You are building the component foundation that every page of a premium fintech SaaS will reuse for the next 25 phases. Consistency and accessibility are the goals; visual novelty is not.

--- A. PROJECT CONTEXT ---
Accentra: India-focused accounting + CA collaboration SaaS (React + Vite + TypeScript + Tailwind client; Express API; MongoDB). The look is "quiet confidence": calm, precise, information-dense, deep navy + teal identity, never a generic AI dashboard.

--- B. EXISTING PROJECT STATE ---
Phase 1 is complete. Before planning, read: docs/PROJECT_STATE.md, docs/AI_RULES.md, docs/ARCHITECTURE.md, docs/DESIGN_SYSTEM.md (the source of truth for every token in this phase). Inspect client/ to see the current setup. Do not modify server/ in this phase except where explicitly stated.

--- C. IMPLEMENTATION OBJECTIVE ---
Implement the design tokens, theme system, i18n scaffold, a complete reusable component library, three layouts, the route skeleton, and a component showcase page.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Design tokens (client/src/styles/globals.css + Tailwind config):
   - Every color token from DESIGN_SYSTEM.md section 5.2 as CSS variables on :root (light) and .dark (dark). Map them into Tailwind so classes read bg-surface, bg-surface-2, text-text, text-muted, border-border, bg-primary, text-primary-fg, text-success, text-warning, text-danger, ring-focus.
   - Typography scale (5.3) as Tailwind font-size entries; load Inter via a self-hosted package (e.g., @fontsource-variable/inter) — no external Google Fonts request. Enable tabular numerals utility class "tabular".
   - Radius, spacing, and shadow values from 5.4.
   - Rule: components never use raw hex colors or arbitrary color values. Add an ESLint/Tailwind lint rule or a simple CI grep check that fails on "#[0-9a-fA-F]{3,6}" inside client/src/components and client/src/features (excluding the token file).
2. Theme system:
   - ThemeProvider with values "light" | "dark" | "system"; resolves system via matchMedia and reacts to OS changes.
   - Persists to localStorage key "accentra-theme" (wrap access in try/catch).
   - Inline script in client/index.html that applies the .dark class before React mounts (no white flash).
   - Exposes useTheme(). Later phases will also sync to the user profile (leave a TODO comment and a no-op hook point "onThemeChange").
   - ThemeToggle component (icon button cycling light → dark → system, with tooltip and aria-label).
3. Mode system (Simple / Professional):
   - ModeProvider persisted to localStorage "accentra-mode"; useMode(); ModeToggle (segmented control).
   - A terminology map in client/src/lib/terminology.ts: key → { simple, professional }, e.g., revenue: {simple: "Money In", professional: "Revenue"}, expenses: {"Money Out","Expenditure"}, netProfit: {"Profit","Net Profit"}, receivables: {"Payments to Receive","Accounts Receivable"}, payables: {"Bills to Pay","Accounts Payable"}, cashBalance: {"Total Balance","Cash & Bank"}. Provide useTerm(key). (Both entries will be i18n keys in Phase 22; structure it so that swap is trivial.)
4. i18n scaffold:
   - react-i18next with English only for now; locales in client/src/locales/en/*.json split by namespace (common, nav, auth, …). Language detection from localStorage "accentra-lang", default "en".
   - ALL user-facing strings in components and layouts go through t(). Add this rule to docs/AI_RULES.md if not present.
   - LanguageSelect component showing English / தமிழ் / हिन्दी; Tamil and Hindi entries visible but marked "coming soon" and disabled until Phase 22.
5. Component library (client/src/components/ui/) — built on Radix UI primitives where interaction is non-trivial (Dialog, DropdownMenu, Select, Tabs, Tooltip, Popover, Switch, Checkbox, Toast). Each component: typed props, forwardRef where relevant, variants via a small helper (class-variance-authority + tailwind-merge), keyboard accessible, visible focus ring, works in both themes, and strings via props (no hardcoded English inside primitives).
   Required components: Button (primary, secondary, ghost, danger, link; sm/md/lg; loading; leftIcon/rightIcon), IconButton, Input, Textarea, Label, FormField (label + control + helper + error with aria wiring), MoneyInput (₹ prefix, accepts "1,500.50", emits integer paise via @accentra/shared toPaise, formats on blur, shows error for invalid values), Select, Combobox (searchable), DatePicker (accessible; returns ISO date string; shows dd MMM yyyy), Checkbox, Switch, RadioGroup, Card (+ CardHeader, CardBody, CardFooter), StatCard (label, value, delta with arrow + sign, optional sparkline slot, loading skeleton), Badge, StatusBadge (map of statuses → tokens: draft, submitted, under_review, needs_clarification, approved, rejected, paid, unpaid, overdue, verified, pending), DataTable (generic; columns config; server-side pagination props; sortable headers; right-aligned numeric columns; row action menu; loading skeleton rows; empty state slot; becomes stacked cards below md), Pagination, Tabs, Dialog, ConfirmDialog (destructive variant), Drawer (side sheet), DropdownMenu, Tooltip, Toast system (useToast; success/error/info; errors persist until dismissed; aria-live), Skeleton, Spinner, EmptyState (icon, title, description, action), ErrorState (message + retry), PageHeader (title, description, actions), FilterBar (search input + filter slots + reset), FileDropzone (drag/drop + click, accepts prop, maxSize prop, shows selected files, keyboard accessible), Timeline (vertical history list: actor, action, timestamp, optional note), Avatar (initials fallback), ChartCard (title, description, actions, chart slot, empty state, sr-only summary prop), Breadcrumbs, Kbd.
   - Chart theming helper: useChartColors() reading CSS variables so Recharts colors switch with theme.
6. Layouts (client/src/components/layout/):
   - PublicLayout: sticky top nav (logo wordmark "Accentra", links Features / How it works / About / Contact, ThemeToggle, LanguageSelect, "Sign in" ghost button, "Get started" primary button), mobile menu drawer, footer with link columns + legal links + "© Accentra".
   - AuthLayout: split screen ≥ lg (left brand panel in navy with short value statement and a subtle product illustration built with CSS/SVG — no stock images; right form panel), single column on mobile.
   - WorkspaceLayout: sidebar (248px; collapsible to 64px icon rail with tooltips; off-canvas drawer below lg; nav items from a config array with icon, label key, route, optional badge count, and a "track" property), top bar (page title slot, ModeToggle, notification bell placeholder with badge slot, ThemeToggle, user menu placeholder), main content area (max-w 1440, padding per tokens). Three nav configs: entrepreneurNav, caNav, adminNav — matching MASTER_PLAN Part 4 exactly, including group headings.
7. Routing (client/src/router.tsx with React Router, data-router API):
   - Public routes under PublicLayout: / , /features, /how-it-works, /about, /contact, /privacy, /terms.
   - Auth routes under AuthLayout: /login, /register, /forgot-password, /reset-password, /verify-email.
   - /app/* under WorkspaceLayout (entrepreneurNav), /ca/* (caNav), /admin/* (adminNav).
   - Every not-yet-built route renders a ComingSoon page component stating the page name and "Planned for Phase N" (N from a config). This is NOT mock functionality; it is an honest placeholder and must contain no fake buttons.
   - NotFound page (404) and a RouteErrorBoundary page using ErrorState.
   - Route guards are NOT implemented yet (Phase 4) — leave a clearly named placeholder component <RequireAuth> that currently renders children, with a TODO referencing Phase 4.
8. Showcase: /dev/components route (only registered when import.meta.env.DEV) displaying every component in every variant and state, with a ThemeToggle at the top, plus a sample DataTable with 25 rows of OBVIOUSLY fake data labelled "Sample data", and a sample Recharts area chart using useChartColors.

--- E. FRONTEND REQUIREMENTS ---
Responsive at 360px, 768px, 1024px, 1440px. Both themes. Keyboard navigation through the entire showcase. prefers-reduced-motion respected. Motion per DESIGN_SYSTEM.md 5.11.

--- F. BACKEND REQUIREMENTS ---
None.

--- G. DATABASE REQUIREMENTS ---
None.

--- H. INTEGRATION REQUIREMENTS ---
Replace the Phase 1 temporary health page: the health check moves to a small "API status" indicator on /dev/components. Keep apiClient and QueryClient from Phase 1 unchanged.

--- I. SECURITY REQUIREMENTS ---
No dangerouslySetInnerHTML anywhere. The theme pre-mount script reads only localStorage and sets a class. /dev routes excluded from production builds (verify with npm run build and inspecting the bundle/routes).

--- J. TESTING REQUIREMENTS ---
Component tests (Vitest + Testing Library) for: Button loading state disables click; MoneyInput converts "1,500.50" → 150050 and rejects "12.345"; ThemeProvider persists and applies .dark; ModeToggle switches useTerm output; DataTable renders empty state and loading state; ConfirmDialog calls onConfirm only on confirm; FileDropzone rejects oversized files. Run them and show output. Also run npm run build.

--- K. COMPLETION CRITERIA ---
1. /dev/components shows all listed components; every one looks correct in light AND dark mode (I will check visually).
2. Reloading the page in dark mode shows no white flash.
3. Theme and mode survive page refresh.
4. All sidebar links navigate; unbuilt pages show honest ComingSoon pages; no button anywhere does nothing silently.
5. The hex-color lint check passes.
6. All tests and the production build pass.
7. docs/DESIGN_SYSTEM.md updated with a "Component inventory" section listing each component, its props, and usage rules. docs/PROJECT_STATE.md updated.

--- L. FINAL AI INSTRUCTIONS ---
Present a plan first (component list, libraries with reasons, file tree) and wait for approval. Implement in this order and pause for me to review after each: (2a) tokens + theme + mode + i18n scaffold; (2b) form and display components; (2c) data, overlay and feedback components; (2d) layouts + routing + showcase. Follow docs/AI_RULES.md strictly. Do not modify server/. Run tests and build and show real output. Update PROJECT_STATE.md. Report every file created/changed, and give me a 1-minute visual checklist to verify both themes.
```

**Git checkpoint:** commit after each sub-step (`feat: phase 2a tokens theme mode i18n` …), then `git tag phase-2-complete`.

**Phase 2 verification checklist**
- [ ] Every component visible on `/dev/components` in both themes
- [ ] No white flash on reload in dark mode
- [ ] Keyboard-only: Tab reaches every control; Esc closes dialogs; focus ring visible
- [ ] At 360px wide: sidebar becomes a drawer, tables become cards
- [ ] `npm run build` succeeds; `/dev/components` absent from production build
