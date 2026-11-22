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

| Token | Light | Dark | Use |
|---|---|---|---|
| `--brand-navy` | `#0B1F3A` | `#E6EDF7` | Logo, headings on marketing |
| `--bg` | `#F6F8FB` | `#0A1220` | App background |
| `--surface` | `#FFFFFF` | `#111B2E` | Cards, tables, sidebar |
| `--surface-2` | `#F1F4F8` | `#17233A` | Table headers, hovered rows, inputs |
| `--border` | `#E2E7EF` | `#24314A` | Dividers, input borders |
| `--text` | `#0F172A` | `#E6EDF7` | Body text |
| `--text-muted` | `#5B6B82` | `#93A3BA` | Secondary text, labels |
| `--primary` | `#0F766E` (teal 700) | `#2DD4BF` (teal 400) | Primary buttons, links, focus |
| `--primary-hover` | `#115E59` | `#5EEAD4` | — |
| `--primary-fg` | `#FFFFFF` | `#042F2E` | Text on primary |
| `--accent` | `#1E3A8A` | `#93C5FD` | Professional-mode highlights, info |
| `--success` | `#15803D` | `#4ADE80` | Approved, paid, Money In |
| `--warning` | `#B45309` | `#FBBF24` | Needs clarification, due soon |
| `--danger` | `#B91C1C` | `#F87171` | Rejected, overdue, destructive |
| `--focus-ring` | `#0F766E` @ 40% | `#2DD4BF` @ 50% | 3px focus outline |

**Chart palette** (ordered, distinguishable in both themes): teal `#0F766E/#2DD4BF`, indigo `#4F46E5/#818CF8`, amber `#D97706/#FBBF24`, rose `#E11D48/#FB7185`, slate `#475569/#94A3B8`, emerald `#059669/#34D399`.

### 5.3 Typography

- **Inter** (variable) for everything; `font-feature-settings: "tnum" 1, "cv11" 1` on numeric contexts.
- **Noto Sans Tamil** and **Noto Sans Devanagari** loaded when those languages are active.

| Style | Size / line-height / weight | Use |
|---|---|---|
| Display | 48/56, 650 | Marketing hero only |
| H1 | 28/36, 600 | Page titles |
| H2 | 20/28, 600 | Section titles |
| H3 | 16/24, 600 | Card titles |
| Body | 14/22, 400 | Default app text |
| Body-lg | 16/26, 400 | Marketing, learning content |
| Small | 12/18, 500 | Labels, table headers (uppercase +0.04em tracking) |
| Stat | 28/34, 600, tabular | Dashboard numbers |

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

| State | Pattern |
|---|---|
| Loading | Skeletons shaped like the final content (not a full-page spinner) |
| Empty | Icon, one-line explanation, primary action ("Record your first transaction") |
| Error | Message in plain language + "Try again" button; technical details hidden |
| Success | Toast + updated data visible immediately (query invalidation) |
| Permission | "You don't have access to this" page, never a blank screen |

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
- Verification rule for every phase: *every new screen is checked in both themes*.
