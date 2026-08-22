# PennyPilot — Design System

**Style:** Modern premium financial dashboard
**Version:** 1.0 (supports V1–V3 scope; extensible for later versions)
**Themes:** Light + Dark
**Status:** Implementation-ready — translate directly into `frontend/src/styles/variables.css`

---

## Table of Contents

1. Design Principles
2. Color Tokens
3. Typography
4. Spacing Scale
5. Border Radius
6. Shadows / Elevation
7. Motion / Animation
8. Breakpoints & Grid
9. Z-Index Scale
10. Icon System
11. Component Specifications
12. State Matrix
13. Accessibility Requirements
14. Restrictions & Governance
15. CSS Variable Reference (drop-in)

---

# 1. Design Principles

1. **Numbers are the hero.** Amounts, balances, and categories must always be the most legible element on screen — never compete with decoration.
2. **Calm, not flashy.** Premium ≠ loud. Restrained color, generous whitespace, subtle motion.
3. **Every value is a token.** No raw hex codes, px values, or ad-hoc colors in component code — ever.
4. **Same shape, both themes.** Light and dark mode share structure; only token *values* change.
5. **Sign is meaning.** Positive/negative money values always carry consistent color + iconography, never color alone (see Accessibility).

---

# 2. Color Tokens

## 2.1 Brand & Neutrals (Light Theme)

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#4F46E5` (indigo-600) | Primary actions, active nav, links |
| `--color-primary-hover` | `#4338CA` | Primary hover |
| `--color-primary-active` | `#3730A3` | Primary pressed |
| `--color-primary-subtle` | `#EEF2FF` | Primary tint backgrounds (badges, selected rows) |
| `--color-bg-canvas` | `#F7F8FA` | Page background |
| `--color-bg-surface` | `#FFFFFF` | Cards, modals, table surfaces |
| `--color-bg-surface-raised` | `#FFFFFF` | Elevated surfaces (dropdowns, popovers) |
| `--color-bg-muted` | `#F1F2F5` | Subtle fills (input backgrounds, disabled) |
| `--color-border` | `#E4E6EB` | Default borders/dividers |
| `--color-border-strong` | `#D0D3D9` | Emphasized borders (focus adjacent, table header) |
| `--color-text-primary` | `#111827` | Headings, key values |
| `--color-text-secondary` | `#4B5563` | Body text |
| `--color-text-muted` | `#8A8F98` | Captions, placeholders, timestamps |
| `--color-text-on-primary` | `#FFFFFF` | Text on primary-colored surfaces |

## 2.2 Brand & Neutrals (Dark Theme)

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#818CF8` (indigo-400) | Primary actions, active nav, links |
| `--color-primary-hover` | `#A5B4FC` | Primary hover |
| `--color-primary-active` | `#6366F1` | Primary pressed |
| `--color-primary-subtle` | `#1E1B4B` | Primary tint backgrounds |
| `--color-bg-canvas` | `#0F1115` | Page background |
| `--color-bg-surface` | `#1A1D23` | Cards, modals, table surfaces |
| `--color-bg-surface-raised` | `#22252C` | Elevated surfaces |
| `--color-bg-muted` | `#26292F` | Subtle fills |
| `--color-border` | `#2E323A` | Default borders/dividers |
| `--color-border-strong` | `#3D424C` | Emphasized borders |
| `--color-text-primary` | `#F3F4F6` | Headings, key values |
| `--color-text-secondary` | `#B4B8C0` | Body text |
| `--color-text-muted` | `#787E89` | Captions, placeholders |
| `--color-text-on-primary` | `#0F1115` | Text on primary-colored surfaces |

## 2.3 Semantic / Financial Colors (both themes)

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-positive` | `#16A34A` | `#4ADE80` | Income, positive balance, budget under limit |
| `--color-positive-subtle` | `#F0FDF4` | `#052E16` | Positive tint background |
| `--color-negative` | `#DC2626` | `#F87171` | Expenses (when highlighted), overspend, errors |
| `--color-negative-subtle` | `#FEF2F2` | `#450A0A` | Negative tint background |
| `--color-warning` | `#D97706` | `#FBBF24` | Budget nearing limit (>80% utilization) |
| `--color-warning-subtle` | `#FFFBEB` | `#451A03` | Warning tint background |
| `--color-info` | `#2563EB` | `#60A5FA` | Informational callouts |
| `--color-info-subtle` | `#EFF6FF` | `#172554` | Info tint background |

## 2.4 Category Colors (for badges/charts — 7 fixed V1 categories)

| Category | Token | Light | Dark |
|---|---|---|---|
| Food | `--color-cat-food` | `#F59E0B` | `#FBBF24` |
| Transport | `--color-cat-transport` | `#3B82F6` | `#60A5FA` |
| Shopping | `--color-cat-shopping` | `#EC4899` | `#F472B6` |
| Bills | `--color-cat-bills` | `#8B5CF6` | `#A78BFA` |
| Health | `--color-cat-health` | `#10B981` | `#34D399` |
| Entertainment | `--color-cat-entertainment` | `#F43F5E` | `#FB7185` |
| Other | `--color-cat-other` | `#6B7280` | `#9CA3AF` |

**Rule:** category colors are used for chart segments, badges, and small accent bars — never as full-page backgrounds. Minimum 3:1 contrast against `--color-bg-surface` required for non-text use (WCAG for graphical objects).

## 2.5 Contrast Standard

All text/background pairs must meet **WCAG AA**: 4.5:1 for body text, 3:1 for text ≥18px/bold ≥14px. Run every new token pairing through a contrast checker before merging.

---

# 3. Typography

## 3.1 Font Family

```css
--font-family-base: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-family-mono-numeric: "Inter", "Roboto Mono", monospace; /* tabular-nums, see below */
```

Use `font-variant-numeric: tabular-nums;` on all amount/number displays (tables, summaries) so digits align vertically regardless of value.

## 3.2 Type Scale

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `--text-display` | 36px | 44px | 700 | Dashboard hero total (e.g. total balance) |
| `--text-h1` | 28px | 36px | 700 | Page titles |
| `--text-h2` | 22px | 30px | 600 | Section headers |
| `--text-h3` | 18px | 26px | 600 | Card titles |
| `--text-h4` | 16px | 24px | 600 | Sub-section labels |
| `--text-body-lg` | 16px | 24px | 400 | Primary body / form labels |
| `--text-body` | 14px | 20px | 400 | Default body, table cells |
| `--text-body-sm` | 13px | 18px | 400 | Secondary text, helper text |
| `--text-caption` | 12px | 16px | 500 | Timestamps, tags, meta info |
| `--text-amount-lg` | 24px | 32px | 700 | Large amount displays (cards) |
| `--text-amount` | 14px | 20px | 600 | Table row amounts |

## 3.3 Amount Display Rules

- Amounts always use `tabular-nums` + weight 600–700 (never 400) so they read distinctly from surrounding text.
- Color-by-sign: expenses in `--color-text-primary` (neutral, since expenses are the norm in this app) by default; only use `--color-negative`/`--color-positive` when explicitly comparing income vs. expense (V4+) or showing budget status.
- Currency symbol is a formatting-util concern (`formatCurrency.js`), never hardcoded in components (see Restrictions).

---

# 4. Spacing Scale

4px base unit, exposed as tokens — never use raw pixel values in components.

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |

**Guidance:** `--space-2`/`--space-3` for internal component padding, `--space-4`/`--space-6` between related elements, `--space-8`+ between distinct sections.

---

# 5. Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Inputs, small buttons, badges |
| `--radius-md` | 10px | Cards, modals, dropdowns |
| `--radius-lg` | 16px | Large hero cards, bottom sheets |
| `--radius-full` | 9999px | Avatars, pills, toggle switches |

---

# 6. Shadows / Elevation

## Light Theme

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(16,24,40,0.06)` | Cards at rest |
| `--shadow-md` | `0 4px 12px rgba(16,24,40,0.08)` | Dropdowns, popovers |
| `--shadow-lg` | `0 12px 32px rgba(16,24,40,0.12)` | Modals |

## Dark Theme

Shadows read poorly on dark backgrounds — use a **border + minimal glow** instead:

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 0 0 1px rgba(255,255,255,0.04)` | Cards at rest |
| `--shadow-md` | `0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.4)` | Dropdowns, popovers |
| `--shadow-lg` | `0 0 0 1px rgba(255,255,255,0.08), 0 16px 40px rgba(0,0,0,0.5)` | Modals |

---

# 7. Motion / Animation

"Subtle and purposeful" defined:

| Token | Value | Usage |
|---|---|---|
| `--duration-instant` | 80ms | Micro feedback (checkbox tick, toggle) |
| `--duration-fast` | 120ms | Hover states, button press |
| `--duration-base` | 200ms | Modal/toast enter, dropdown open |
| `--duration-slow` | 320ms | Page transitions, large layout shifts |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default easing |
| `--ease-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Entrances |
| `--ease-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Exits |

**Rules:** No animation longer than 400ms. Respect `prefers-reduced-motion: reduce` — disable non-essential motion (keep only opacity fades) when set.

---

# 8. Breakpoints & Grid

| Token | Value | Target |
|---|---|---|
| `--bp-sm` | 480px | Large phones |
| `--bp-md` | 768px | Tablets |
| `--bp-lg` | 1024px | Small laptops / sidebar breakpoint |
| `--bp-xl` | 1280px | Desktops |
| `--bp-2xl` | 1536px | Large desktops |

**Grid:** 12-column, `--space-6` (24px) gutter on desktop, `--space-4` (16px) on mobile. Container max-width: 1280px, centered, `--space-6` side padding (`--space-4` on mobile).

**Sidebar behavior:** persistent at `≥ --bp-lg`; collapses to an overlay/drawer below it.

---

# 9. Z-Index Scale

| Token | Value | Usage |
|---|---|---|
| `--z-base` | 0 | Default content |
| `--z-sticky` | 10 | Sticky table headers, sticky nav |
| `--z-dropdown` | 20 | Dropdowns, menus, date pickers |
| `--z-overlay` | 30 | Modal/drawer backdrop |
| `--z-modal` | 40 | Modals, drawers |
| `--z-toast` | 50 | Toast notifications (always topmost) |

---

# 10. Icon System

- **Library:** Lucide (already available in the stack) — consistent 1.5px–2px stroke weight, never mix icon sets.
- **Sizes:** `--icon-sm` 16px (inline with body text), `--icon-md` 20px (buttons, inputs), `--icon-lg` 24px (nav, empty states).
- **Color:** icons inherit `currentColor` by default; use semantic color tokens only for status icons (success/warning/error).

---

# 11. Component Specifications

Each component below lists structural + token requirements. All live under `components/common/` unless noted as feature-specific.

### Button
- Variants: `primary`, `secondary`, `ghost`, `destructive`
- Sizes: `sm` (32px height), `md` (40px height), `lg` (48px height)
- Padding: `--space-2` `--space-4` (sm), `--space-3` `--space-5` (md/lg)
- Radius: `--radius-sm`
- Disabled: `--color-bg-muted` bg, `--color-text-muted` text, `cursor: not-allowed`, no shadow

### Card
- Background: `--color-bg-surface`, radius `--radius-md`, shadow `--shadow-sm`, padding `--space-6`
- Optional header slot with `--text-h3` + optional action button (top-right)

### Input / Select
- Height: 40px, radius `--radius-sm`, border `1px solid --color-border`
- Focus: border `--color-primary` + `0 0 0 3px --color-primary-subtle` ring
- Error state: border `--color-negative` + helper text in `--color-negative`, `--text-body-sm`

### Modal
- Overlay: `rgba(0,0,0,0.5)` (light) / `rgba(0,0,0,0.7)` (dark), z-index `--z-overlay`
- Panel: `--color-bg-surface-raised`, radius `--radius-lg`, shadow `--shadow-lg`, max-width 480px (sm) / 640px (md)
- Enter animation: fade + scale 0.96→1, `--duration-base`, `--ease-decelerate`

### Table
- Header row: `--color-bg-muted` background, `--text-caption` uppercase labels, sticky (`--z-sticky`) on scroll
- Row height: 48px, hover: `--color-bg-muted`
- Row divider: `1px solid --color-border` (no vertical borders — horizontal only, premium look)
- Amount column: right-aligned, `tabular-nums`, `--text-amount`

### Navbar
- Height: 64px, `--color-bg-surface`, bottom border `--color-border`
- Sticky top, `--z-sticky`

### Sidebar
- Width: 260px expanded / 72px collapsed (icon-only)
- Background: `--color-bg-canvas` with `1px` right border `--color-border`
- Active item: `--color-primary-subtle` bg, `--color-primary` text + left accent bar (3px, `--color-primary`)

### Toast
- Position: bottom-right (desktop), bottom-center (mobile)
- Width: 360px max, radius `--radius-md`, shadow `--shadow-md`
- Variants map to semantic colors (success/error/warning/info) via a 4px left accent bar, not full-color background
- Auto-dismiss: 4s default, pausable on hover

### Empty State
- Structure: centered icon (`--icon-lg`, `--color-text-muted`) → `--text-h4` heading → `--text-body-sm` supporting line → optional primary CTA button
- Never just text alone — always at least icon + heading + one line of guidance

### Loading State
- Skeleton blocks (`--color-bg-muted`, subtle shimmer animation, `--duration-slow` loop) matching the shape of the content being loaded — used for tables/cards/lists
- Spinner reserved only for button-level "in progress" states (not full-page loads)

### Error State
- Icon (`--color-negative`) → `--text-h4` heading (plain language, no stack traces) → `--text-body-sm` explanation → retry action button

---

# 12. State Matrix

Every interactive component must define these states explicitly — none may be left to browser defaults:

| State | Requirement |
|---|---|
| Default | Base token values |
| Hover | Background/border shifts one step (e.g. `--color-primary` → `--color-primary-hover`) |
| Active/Pressed | One step further (`--color-primary-active`) |
| Focus-visible | `0 0 0 3px` ring in `--color-primary-subtle`, always visible on keyboard nav, never suppressed |
| Disabled | `--color-bg-muted` / `--color-text-muted`, `opacity: 0.6`, no hover/active response |
| Error | `--color-negative` border/text, paired with icon (not color alone) |
| Loading | Skeleton or inline spinner, interaction disabled |

---

# 13. Accessibility Requirements

- All color pairings meet WCAG AA (Section 2.5).
- **Never convey meaning by color alone** — pair positive/negative/warning states with an icon or explicit `+`/`−` sign, since red/green distinctions fail for color-blind users (common in a finance app showing gains/losses).
- All interactive components are keyboard-navigable (`Tab`/`Shift+Tab`/`Enter`/`Space`/`Esc` where applicable) with a visible focus ring per Section 12.
- Modals trap focus and return focus to the triggering element on close.
- All form inputs have associated `<label>` elements (not placeholder-only labels).
- Minimum touch target: 40×40px on mobile.

---

# 14. Restrictions & Governance

- **No inline styles.** No arbitrary hex/px/rgba values in component code — every value must reference a token above.
- **No hardcoded business data.** No hardcoded currency symbol, category list, or copy strings in components — pull from `constants/` or formatting utils (`formatCurrency.js`, `formatDate.js`).
- **No duplicated UI components.** Shared primitives live only in `components/common/`; feature-specific composites (e.g. `ExpenseCard`) live in their feature folder and compose the shared primitives — never re-implement a Button/Card/Input locally.
- **No suppressed focus outlines.** `outline: none` without a replacement focus style is not permitted.
- **Theme parity.** Any new token added for light mode must have a corresponding dark mode value before merge.

---

# 15. CSS Variable Reference (drop-in)

```css
/* frontend/src/styles/variables.css */

:root {
  /* Brand & Neutrals — Light */
  --color-primary: #4F46E5;
  --color-primary-hover: #4338CA;
  --color-primary-active: #3730A3;
  --color-primary-subtle: #EEF2FF;
  --color-bg-canvas: #F7F8FA;
  --color-bg-surface: #FFFFFF;
  --color-bg-surface-raised: #FFFFFF;
  --color-bg-muted: #F1F2F5;
  --color-border: #E4E6EB;
  --color-border-strong: #D0D3D9;
  --color-text-primary: #111827;
  --color-text-secondary: #4B5563;
  --color-text-muted: #8A8F98;
  --color-text-on-primary: #FFFFFF;

  /* Semantic */
  --color-positive: #16A34A;
  --color-positive-subtle: #F0FDF4;
  --color-negative: #DC2626;
  --color-negative-subtle: #FEF2F2;
  --color-warning: #D97706;
  --color-warning-subtle: #FFFBEB;
  --color-info: #2563EB;
  --color-info-subtle: #EFF6FF;

  /* Categories */
  --color-cat-food: #F59E0B;
  --color-cat-transport: #3B82F6;
  --color-cat-shopping: #EC4899;
  --color-cat-bills: #8B5CF6;
  --color-cat-health: #10B981;
  --color-cat-entertainment: #F43F5E;
  --color-cat-other: #6B7280;

  /* Typography */
  --font-family-base: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --text-display: 700 36px/44px var(--font-family-base);
  --text-h1: 700 28px/36px var(--font-family-base);
  --text-h2: 600 22px/30px var(--font-family-base);
  --text-h3: 600 18px/26px var(--font-family-base);
  --text-h4: 600 16px/24px var(--font-family-base);
  --text-body-lg: 400 16px/24px var(--font-family-base);
  --text-body: 400 14px/20px var(--font-family-base);
  --text-body-sm: 400 13px/18px var(--font-family-base);
  --text-caption: 500 12px/16px var(--font-family-base);
  --text-amount-lg: 700 24px/32px var(--font-family-base);
  --text-amount: 600 14px/20px var(--font-family-base);

  /* Spacing */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px;
  --space-12: 48px; --space-16: 64px;

  /* Radius */
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px; --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(16,24,40,0.06);
  --shadow-md: 0 4px 12px rgba(16,24,40,0.08);
  --shadow-lg: 0 12px 32px rgba(16,24,40,0.12);

  /* Motion */
  --duration-instant: 80ms; --duration-fast: 120ms;
  --duration-base: 200ms; --duration-slow: 320ms;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);

  /* Breakpoints (reference only — use in JS/media queries) */
  --bp-sm: 480px; --bp-md: 768px; --bp-lg: 1024px; --bp-xl: 1280px; --bp-2xl: 1536px;

  /* Z-index */
  --z-base: 0; --z-sticky: 10; --z-dropdown: 20;
  --z-overlay: 30; --z-modal: 40; --z-toast: 50;

  /* Icons */
  --icon-sm: 16px; --icon-md: 20px; --icon-lg: 24px;
}

[data-theme="dark"] {
  --color-primary: #818CF8;
  --color-primary-hover: #A5B4FC;
  --color-primary-active: #6366F1;
  --color-primary-subtle: #1E1B4B;
  --color-bg-canvas: #0F1115;
  --color-bg-surface: #1A1D23;
  --color-bg-surface-raised: #22252C;
  --color-bg-muted: #26292F;
  --color-border: #2E323A;
  --color-border-strong: #3D424C;
  --color-text-primary: #F3F4F6;
  --color-text-secondary: #B4B8C0;
  --color-text-muted: #787E89;
  --color-text-on-primary: #0F1115;

  --color-positive: #4ADE80;
  --color-positive-subtle: #052E16;
  --color-negative: #F87171;
  --color-negative-subtle: #450A0A;
  --color-warning: #FBBF24;
  --color-warning-subtle: #451A03;
  --color-info: #60A5FA;
  --color-info-subtle: #172554;

  --color-cat-food: #FBBF24;
  --color-cat-transport: #60A5FA;
  --color-cat-shopping: #F472B6;
  --color-cat-bills: #A78BFA;
  --color-cat-health: #34D399;
  --color-cat-entertainment: #FB7185;
  --color-cat-other: #9CA3AF;

  --shadow-sm: 0 0 0 1px rgba(255,255,255,0.04);
  --shadow-md: 0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.4);
  --shadow-lg: 0 0 0 1px rgba(255,255,255,0.08), 0 16px 40px rgba(0,0,0,0.5);
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

*End of PennyPilot Design System v1.0.*
