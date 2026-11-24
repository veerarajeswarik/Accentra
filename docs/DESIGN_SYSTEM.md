<!-- Extracted from MASTER_PLAN.md PART 5 in Phase 1. Keep this file CURRENT: update it whenever the design system changes. -->

# PART 5 — UI/UX Design System

### 5.1 Brand direction: "Quiet confidence"

Accentra handles people's money. The interface should feel like a **well-run bank's back office designed by a modern product team**: calm, dense with useful information, precise, never flashy. Think Linear's restraint and Stripe Dashboard's data clarity, in Accentra's own navy-and-teal identity.

**Rules that prevent the "generic AI dashboard" look:**

- No gradients on surfaces. One subtle brand gradient allowed in the marketing hero only.
- No emojis in UI. No decorative blobs.
- Cards earn their space: every card shows a number, a trend, and a link to its source.
- Default data text size 14px; tables are dense (row height 44px), not airy.
- Numbers are **right-aligned with tabular figures** in every table.
- Money is never shown by color alone: Money In has `+` and an arrow icon; Money Out has `−`.

### 5.2 Color tokens

Defined as CSS variables on `:root` (light) and `.dark` (dark), consumed by Tailwind (`bg-surface`, `text-muted`, etc.). **No component may use raw hex values.**

| Token             | Light                | Dark                 | Use                                 |
| ----------------- | -------------------- | -------------------- | ----------------------------------- |
| `--brand-navy`    | `#0B1F3A`            | `#E6EDF7`            | Logo, headings on marketing         |
| `--bg`            | `#F6F8FB`            | `#0A1220`            | App background                      |
| `--surface`       | `#FFFFFF`            | `#111B2E`            | Cards, tables, sidebar              |
| `--surface-2`     | `#F1F4F8`            | `#17233A`            | Table headers, hovered rows, inputs |
| `--border`        | `#E2E7EF`            | `#24314A`            | Dividers, input borders             |
| `--text`          | `#0F172A`            | `#E6EDF7`            | Body text                           |
| `--text-muted`    | `#5B6B82`            | `#93A3BA`            | Secondary text, labels              |
| `--primary`       | `#0F766E` (teal 700) | `#2DD4BF` (teal 400) | Primary buttons, links, focus       |
| `--primary-hover` | `#115E59`            | `#5EEAD4`            | —                                   |
| `--primary-fg`    | `#FFFFFF`            | `#042F2E`            | Text on primary                     |
| `--accent`        | `#1E3A8A`            | `#93C5FD`            | Professional-mode highlights, info  |
| `--success`       | `#15803D`            | `#4ADE80`            | Approved, paid, Money In            |
| `--warning`       | `#B45309`            | `#FBBF24`            | Needs clarification, due soon       |
| `--danger`        | `#B91C1C`            | `#F87171`            | Rejected, overdue, destructive      |
| `--focus-ring`    | `#0F766E` @ 40%      | `#2DD4BF` @ 50%      | 3px focus outline                   |

**Chart palette** (ordered, distinguishable in both themes): teal `#0F766E/#2DD4BF`, indigo `#4F46E5/#818CF8`, amber `#D97706/#FBBF24`, rose `#E11D48/#FB7185`, slate `#475569/#94A3B8`, emerald `#059669/#34D399`.

### 5.3 Typography

- **Inter** (variable) for everything; `font-feature-settings: "tnum" 1, "cv11" 1` on numeric contexts.
- **Noto Sans Tamil** and **Noto Sans Devanagari** loaded when those languages are active.

| Style   | Size / line-height / weight | Use                                                |
| ------- | --------------------------- | -------------------------------------------------- |
| Display | 48/56, 650                  | Marketing hero only                                |
| H1      | 28/36, 600                  | Page titles                                        |
| H2      | 20/28, 600                  | Section titles                                     |
| H3      | 16/24, 600                  | Card titles                                        |
| Body    | 14/22, 400                  | Default app text                                   |
| Body-lg | 16/26, 400                  | Marketing, learning content                        |
| Small   | 12/18, 500                  | Labels, table headers (uppercase +0.04em tracking) |
| Stat    | 28/34, 600, tabular         | Dashboard numbers                                  |

### 5.4 Spacing, radius, elevation

- 4px base scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- Page padding 24px (desktop), 16px (mobile). Card padding 20px. Gap between cards 16px.
- Radius: 6px inputs/buttons, 10px cards, 14px dialogs. Never fully rounded except avatars and pills.
- Elevation: cards use a 1px border, **no shadow** at rest; dropdowns/dialogs get `0 8px 24px rgb(0 0 0 / 0.12)` (light) / `0 8px 24px rgb(0 0 0 / 0.5)` (dark).

### 5.5 Components (key specs)

- **Buttons:** `primary`, `secondary` (surface + border), `ghost`, `danger`, `link`; sizes `sm` 32px, `md` 36px, `lg` 44px; loading state shows spinner and disables; icon + label gap 8px.
- **Inputs:** 36px height, label above (never placeholder-as-label), helper text below, error text in `--danger` with icon, `aria-invalid` + `aria-describedby`.
- **MoneyInput:** `₹` prefix, accepts "1,500.50", stores paise integer, formats Indian grouping on blur.
- **Tables:** sticky header in `--surface-2`, zebra off, hover row `--surface-2`, right-aligned numbers, status badges, row actions in an overflow menu, server pagination footer, empty state inside the table frame.
- **Status badges:** subtle background + strong text: Draft (slate), Submitted (indigo), Under Review (blue), Needs Clarification (amber), Approved (green), Rejected (red), Paid/Unpaid, Overdue.
- **Dialogs:** title, description, body, footer (secondary left, primary right); destructive confirmations require typing nothing but use a red primary button and explicit verb ("Void transaction").
- **Toasts:** bottom-right, 4 s, success/error/info; errors stay until dismissed.

### 5.6 Layouts

- **WorkspaceLayout:** 248px sidebar (collapsible to 64px icon rail; off-canvas drawer below 1024px), 56px top bar, content max-width 1440px.
- **Dashboard pattern:** row of 4 `StatCard`s → 2/3 + 1/3 split (trend chart + "Needs your attention" list) → recent activity table.
- **List page pattern:** `PageHeader` (title, description, primary action) → `FilterBar` → `DataTable`.
- **Detail page pattern:** header with status + actions → two columns (main content + side panel with metadata and history timeline).

### 5.7 Charts

Recharts with theme-aware colors read from CSS variables; gridlines `--border` at 50%; axis labels 12px `--text-muted`; tooltips styled as cards; values formatted in ₹ with Indian grouping (`₹1.2L`, `₹3.4Cr` abbreviations on axes); every chart has a text summary for screen readers and an empty state.

### 5.8 States (required on every data view)

| State      | Pattern                                                                      |
| ---------- | ---------------------------------------------------------------------------- |
| Loading    | Skeletons shaped like the final content (not a full-page spinner)            |
| Empty      | Icon, one-line explanation, primary action ("Record your first transaction") |
| Error      | Message in plain language + "Try again" button; technical details hidden     |
| Success    | Toast + updated data visible immediately (query invalidation)                |
| Permission | "You don't have access to this" page, never a blank screen                   |

### 5.9 Responsive breakpoints

`sm 640` · `md 768` · `lg 1024` (sidebar becomes persistent) · `xl 1280` · `2xl 1536`. Tables become stacked cards below `md`. Stat cards: 1 col (<640), 2 cols (≥640), 4 cols (≥1280).

### 5.10 Accessibility (WCAG 2.1 AA target)

Contrast ≥ 4.5:1 for text in both themes; visible focus ring on every interactive element; full keyboard navigation (Radix provides most); `aria-live` region for toasts; form errors announced; charts have text alternatives; touch targets ≥ 40px on mobile; respects `prefers-reduced-motion`.

### 5.11 Motion

150 ms ease-out for hovers and toggles; 200 ms for dialogs/drawers (fade + 4px translate); no bouncing, no page-transition animations, no animated numbers counting up on dashboards (it delays reading the actual value).

### 5.12 Theme switching (mandatory)

- `ThemeProvider` with `light | dark | system`. Applies `.dark` class on `<html>`.
- Persisted in `localStorage` immediately, and to `users.themePreference` once logged in (so it follows the user across devices).
- An inline script in `index.html` sets the class **before React loads** to prevent the white flash on dark mode.
- Verification rule for every phase: _every new screen is checked in both themes_.

---

## Component inventory (built in Phase 2)

All components live in `client/src/components/ui/` (layouts in `components/layout/`). See them in every variant and state at **`/dev/components`** (development only). Reuse these — never re-create a button, field, dialog or table inside a feature.

### Implementation notes

- **Tokens:** `client/src/styles/globals.css` is the only file with raw colour values. Tailwind classes: `bg-bg`, `bg-surface`, `bg-surface-2`, `border-border`, `text-text`, `text-muted`, `bg-primary`, `hover:bg-primary-hover`, `text-primary-fg`, `text-accent`, `text-success|warning|danger`, `text-danger-fg`, `ring-focus`, `bg-chart-1…6`, `bg-brand-panel` / `text-brand-panel-fg` (fixed navy panel), `shadow-elevated`. Type: `text-display|h1|h2|h3|body|body-lg|small|stat`, plus `label-caps` and `tabular`. Radius: `rounded-control` 6px, `rounded-card` 10px, `rounded-dialog` 14px. Motion: `animate-fade-in|pop-in|slide-in-right|slide-in-left` (200 ms); `duration-150 ease-out` for hovers.
- **Lint rule:** a raw hex colour inside `client/src/components/**` or `client/src/features/**` fails `npm run lint`.
- **Class merging:** always combine classes with `cn()` (`client/src/lib/cn.ts`). It knows the custom font sizes, so `text-small text-muted` both survive.
- **Strings:** primitives take text via props. Composite components fall back to `t("ui:…")` defaults that callers can override. Feature code uses `t()` for everything.
- **Tokens added beyond 5.2:** `--danger-fg` (text on danger buttons, for dark-theme contrast) and `--brand-panel` / `--brand-panel-fg` (AuthLayout brand panel, identical in both themes).

### App controls, providers and hooks

| Component / hook                              | Key props                                | Rules                                                                                                                                            |
| --------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ThemeProvider` / `useTheme()`                | `onThemeChange?` hook point              | `light \| dark \| system`; key `accentra-theme`; the `index.html` script prevents the flash. Phase 4/5: sync to the profile via `onThemeChange`. |
| `ModeProvider` / `useMode()`                  | —                                        | `simple \| professional`; key `accentra-mode`. Changes labels only, never numbers.                                                               |
| `useTerm(key)` (`lib/terminology.ts`)         | `TermKey`                                | Simple/Pro vocabulary through `terms:` i18n keys. Add new terms there.                                                                           |
| `ThemeToggle`, `ModeToggle`, `LanguageSelect` | `className`                              | Language key `accentra-lang`; Tamil/Hindi disabled until Phase 22.                                                                               |
| `useToast()`                                  | `toast({ variant, title, description })` | success/info 4 s; errors persist until dismissed; bottom-right; announced.                                                                       |
| `useChartColors()`                            | —                                        | Theme-aware colours for Recharts: `series[0..5]`, `grid`, `axis`, `text`, `surface`, `border`.                                                   |
| `useMediaQuery(query)`                        | `BELOW_MD`, `BELOW_LG`                   | Only for behaviour CSS alone can't do.                                                                                                           |

### Form controls

| Component             | Key props                                                                                                                       | Rules                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `Button`              | `variant` primary/secondary/ghost/danger/link · `size` sm 32 / md 36 / lg 44 · `loading` · `leftIcon` · `rightIcon` · `asChild` | Defaults to `type="button"`. `loading` disables and shows a spinner (no double submits). `asChild` styles a router `<Link>`. |
| `IconButton`          | `label` (required) · `icon` · `tooltip` · `variant` · `size`                                                                    | `label` is the accessible name; the tooltip defaults to it.                                                                  |
| `Label`               | `required` · `requiredText`                                                                                                     | Always above the control; never placeholder-as-label.                                                                        |
| `FormField`           | `label` · `helper` · `error` · `required` · render-prop children                                                                | Children receive `{ id, aria-describedby, aria-invalid, aria-required }`: spread them onto the control.                      |
| `Input` / `Textarea`  | `startAdornment` · `endAdornment`                                                                                               | 36px high; error style comes from `aria-invalid`.                                                                            |
| `MoneyInput`          | `valuePaise` · `onValueChange(paise \| null)` · `allowNegative` · `invalidMessage`                                              | Emits **integer paise** via `toPaise`; formats on blur; shows its error after blur. Controlled only.                         |
| `Select`              | `options` · `value` · `onValueChange` · `placeholder`                                                                           | Short fixed lists.                                                                                                           |
| `Combobox`            | `options` (with `keywords`) · `value` · `onValueChange` · `searchPlaceholder` · `emptyText`                                     | Long or searchable lists.                                                                                                    |
| `DatePicker`          | `value` / `onValueChange` (ISO `yyyy-MM-dd` or null) · `min` · `max` · `clearable`                                              | Shows `dd MMM yyyy`; no time zone, so dates never shift by a day.                                                            |
| `Checkbox` / `Switch` | `label` · `description` · Radix props                                                                                           | Switch = setting that applies immediately; Checkbox = part of a form.                                                        |
| `RadioGroup`          | `options` · `value` · `onValueChange` · `aria-label`                                                                            | A few visible choices.                                                                                                       |

### Display

| Component                                                                                                        | Key props                                                                                                                               | Rules                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `Card` + `CardHeader` (`title`, `description`, `actions`) / `CardBody` / `CardFooter`                            | —                                                                                                                                       | 1px border, no shadow, 20px padding.                                                                    |
| `StatCard`                                                                                                       | `label` · `value` (pre-formatted) · `delta { value, format, label, positiveIsGood }` · `sparkline` · `footer` · `loading`               | Always shows the sign (+/−) and an arrow; colour is never the only signal. Values come from the server. |
| `Badge`                                                                                                          | `variant` neutral/primary/info/indigo/success/warning/danger                                                                            | Subtle tint with strong text.                                                                           |
| `StatusBadge`                                                                                                    | `status` (draft, submitted, under_review, needs_clarification, approved, rejected, paid, unpaid, overdue, verified, pending) · `label?` | `STATUS_VARIANTS` is the single source for status colours.                                              |
| `Avatar`                                                                                                         | `name` · `src?` · `size`                                                                                                                | Initials fallback.                                                                                      |
| `Skeleton`, `Spinner` (`label?`), `Kbd`, `Breadcrumbs` (`items [{ label, to? }]`), `Tooltip` (`content`, `side`) | —                                                                                                                                       | Use skeletons for loading, never full-page spinners.                                                    |

### Data, overlays and feedback

| Component                                                                                                | Key props                                                                                                                                                                                   | Rules                                                                                                                                            |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DataTable<T>`                                                                                           | `columns [{ id, header, cell, numeric, sortable, hideOnMobile }]` · `rows` · `getRowId` · `caption` · `loading` · `emptyState` · `sort` / `onSortChange` · `rowActions(row)` · `pagination` | Sorting and pagination happen on the server. Numeric columns are right-aligned tabular. Empty state inside the frame. Stacked cards below 768px. |
| `Pagination`                                                                                             | `page` (1-based) · `pageSize` · `total` · `onPageChange` · `onPageSizeChange?`                                                                                                              | Usually passed through `DataTable.pagination`.                                                                                                   |
| `FilterBar`                                                                                              | `search` / `onSearchChange` · children (filters) · `hasActiveFilters` · `onReset`                                                                                                           | List pattern: PageHeader → FilterBar → DataTable.                                                                                                |
| `PageHeader`                                                                                             | `title` (the page `<h1>`) · `description` · `actions` · `breadcrumbs` · `status`                                                                                                            | One per page.                                                                                                                                    |
| `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent`                                                      | Radix props                                                                                                                                                                                 | Give `TabsList` an `aria-label`.                                                                                                                 |
| `Dialog` + `DialogContent` (`title`, `description`, `footer`, `size`)                                    | —                                                                                                                                                                                           | Footer: secondary first, primary last.                                                                                                           |
| `ConfirmDialog`                                                                                          | `open` · `onOpenChange` · `title` · `description` · `confirmLabel` (an explicit verb) · `onConfirm` (may be async) · `destructive`                                                          | Calls `onConfirm` only from the confirm button; stays open with a spinner until it resolves.                                                     |
| `Drawer` + `DrawerContent` (`title`, `side`, `footer`, `hideTitle`)                                      | —                                                                                                                                                                                           | Details, filters, mobile navigation.                                                                                                             |
| `DropdownMenu` (+ `Content`, `Item` with `destructive`, `RadioGroup`, `RadioItem`, `Label`, `Separator`) | Radix props                                                                                                                                                                                 | Row actions, user menu.                                                                                                                          |
| `EmptyState`                                                                                             | `icon` · `title` · `titleAs` · `description` · `action`                                                                                                                                     | One-line reason plus one primary action. Use `titleAs="h1"` when it is the whole page.                                                           |
| `ErrorState`                                                                                             | `title?` · `message` · `onRetry` · `actions`                                                                                                                                                | Plain language; never stack traces.                                                                                                              |
| `FileDropzone`                                                                                           | `files` / `onFilesChange` · `accept` · `maxSizeBytes` · `multiple` · `onReject`                                                                                                             | Client-side check only; the server re-validates by magic bytes (Phase 8).                                                                        |
| `Accordion` (Phase 3)                                                                                    | `items [{ id, title, content }]` · `type` single/multiple · `headingLevel` · `defaultOpen`                                                                                                  | FAQ / help. Each question sits in a heading; Enter/Space toggles.                                                                                |
| `Timeline`                                                                                               | `items [{ id, actor, action, at (ISO), note?, icon?, tone? }]`                                                                                                                              | Review history and audit trails.                                                                                                                 |
| `ChartCard`                                                                                              | `title` · `summary` (required text alternative) · `isEmpty` · `loading` · `actions` · `height`                                                                                              | The chart is `aria-hidden`; the summary is the accessible version.                                                                               |

### Layouts and routing (`components/layout/`, `router.tsx`)

| Piece                                                | Notes                                                                                                                                                                                                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PublicLayout`                                       | Sticky nav (Features, How it works, About, Contact, ThemeToggle, LanguageSelect, Sign in, Get started), mobile menu drawer, footer with Product / Company / Legal columns.                                                                  |
| `AuthLayout`                                         | Split screen at ≥ 1024px: navy brand panel with an SVG ledger illustration, and a form panel (max-w-sm). Single column on mobile.                                                                                                           |
| `WorkspaceLayout` (`area`)                           | 248px sidebar ⇄ 64px icon rail (key `accentra-sidebar-collapsed`); a drawer below 1024px; 56px top bar (title from the active nav item, ModeToggle, notification placeholder, ThemeToggle, user menu); content capped at 1440px; skip link. |
| `nav-config.ts`                                      | `entrepreneurNav`, `caNav`, `adminNav`: the single source for sidebars, workspace routes and placeholder phases. Item fields: `id, to, label, icon, track, phase, badge?, end?`.                                                            |
| `routes/placeholders.ts`                             | Public and auth placeholder pages with their phases.                                                                                                                                                                                        |
| `ComingSoonPage` / `NotFoundPage` / `RouteErrorPage` | Honest placeholder (no buttons) · 404 · router error boundary.                                                                                                                                                                              |
| `RequireAuth`                                        | Placeholder; the real guard arrives in Phase 4.                                                                                                                                                                                             |
| `PageMeta` (Phase 3)                                 | `title` · `description` · `path`. Renders `<title>`, description and Open Graph tags (React 19 hoists them into `<head>`). Every public page uses it; `index.html` has no static `<title>`.                                                 |

### Marketing pages (Phase 3)

The public site lives in `client/src/features/marketing/` and loads as its own chunk. Page-level helpers there (`Section`, `IconPoint`, `PageIntro`, `StepList`) are layout-only; they compose the components above. "Available / Coming soon" labels come only from `features/marketing/featureStatus.ts` (bump `COMPLETED_PHASE` at the end of every phase).
