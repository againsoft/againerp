# AgainERP — Design Token Standard

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 10 — Enterprise Design System & UI Foundation  
> **Authority:** [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md)

---

## Purpose

Canonical **design token** definitions for AgainERP. Components and documentation reference tokens only — not raw values.

## When To Read

Read when specifying colors, spacing, elevation, or motion in UI docs or prototypes.

## Related Files

- [theme-system.md](./theme-system.md) — theme cascade
- [dark-mode.md](./dark-mode.md) — dark overrides
- [status-system.md](./status-system.md) — status badge tokens

## Read Next

One token domain below matching your task.

---

## 1. Token Rules

| Rule | Detail |
|------|--------|
| **Semantic names** | `--color-primary` not `--blue-600` |
| **CSS variables** | All tokens as `--{category}-{name}` |
| **No hardcoding** | Menus/prototype guides cite token names |
| **Theme layers** | Base → mode → company → user — see theme-system |
| **Fallback** | Missing token falls back to base layer |

---

## 2. Color Tokens

### 2.1 Brand & semantic

| Token | Role |
|-------|------|
| `--color-primary` | Primary actions, active nav |
| `--color-primary-hover` | Primary hover/focus |
| `--color-primary-subtle` | Selected row, active tab bg |
| `--color-secondary` | Secondary actions, borders |
| `--color-success` | Confirmed, paid, active |
| `--color-warning` | Pending, low stock |
| `--color-danger` | Error, delete, overdue |
| `--color-info` | Informational |
| `--color-surface` | Cards, inputs, modals |
| `--color-background` | Page background |
| `--color-text` | Body text |
| `--color-text-muted` | Labels, placeholders |
| `--color-border` | Dividers, input borders |
| `--color-danger-subtle` | Validation highlight bg |

### 2.2 Status (badges)

Use [status-system.md](./status-system.md) only: `--status-success`, `--status-pending`, `--status-danger`, etc.

### 2.3 AI accent (optional)

| Token | Role |
|-------|------|
| `--color-ai` | AI button, AI widget accent |
| `--color-ai-subtle` | AI panel background tint |

---

## 3. Typography Tokens

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `--font-family` | — | — | System stack |
| `--font-family-mono` | — | — | Code, IDs |
| `--text-xs` | 12px | 400 | Captions, table meta |
| `--text-sm` | 14px | 400 | Body, labels |
| `--text-base` | 16px | 400 | Default body (mobile min) |
| `--text-lg` | 18px | 600 | Section headings |
| `--text-xl` | 20px | 600 | Page titles |
| `--text-2xl` | 24px | 700 | Dashboard headings |

| Rule | Value |
|------|-------|
| Body line height | 1.5 |
| Heading line height | 1.25 |
| Max prose width | 75ch |

---

## 4. Spacing Tokens

4px base unit.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | 0 | — |
| `--space-1` | 4px | Icon gaps |
| `--space-2` | 8px | Inline, chip padding |
| `--space-3` | 12px | Input padding-y |
| `--space-4` | 16px | Card padding mobile |
| `--space-5` | 20px | — |
| `--space-6` | 24px | Section gaps, desktop card padding |
| `--space-8` | 32px | Page section margins |
| `--space-10` | 40px | — |
| `--space-12` | 48px | Large breaks |

**Touch:** 8px min between interactives; **44×44px** tap targets.

---

## 5. Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0 | Tables flush |
| `--radius-sm` | 4px | Badges, chips |
| `--radius-md` | 8px | Buttons, inputs, cards |
| `--radius-lg` | 12px | Modals, sheets |
| `--radius-xl` | 16px | Large panels |
| `--radius-full` | 9999px | Avatars, pills |

---

## 6. Shadow Tokens

| Token | Usage |
|-------|-------|
| `--shadow-none` | Flat tables |
| `--shadow-sm` | Inputs, subtle cards |
| `--shadow-md` | Dropdowns, popovers |
| `--shadow-lg` | Modals, drawers |
| `--shadow-xl` | Command palette |

One visible `--shadow-lg` layer at a time.

---

## 7. Border Tokens

| Token | Usage |
|-------|-------|
| `--border-width` | 1px default |
| `--border-width-thick` | 2px focus ring |
| `--color-border` | Standard border |
| `--color-border-strong` | Table headers, dividers |
| `--color-focus-ring` | Focus visible outline |

---

## 8. Z-Index Tokens

Aligned with [WORKSPACE_LAYOUT_MAP.md §7](./WORKSPACE_LAYOUT_MAP.md#7-z-index-scale):

| Token | Value | Layer |
|-------|-------|-------|
| `--z-base` | 0 | Content |
| `--z-sticky` | 10 | Sticky headers |
| `--z-sidebar` | 40 | Sidebar overlay |
| `--z-header` | 50 | Global header |
| `--z-dropdown` | 60 | Popovers, menus |
| `--z-drawer` | 70 | Sheet drawer, modal |
| `--z-palette` | 80 | Command palette |
| `--z-toast` | 90 | Toasts |

---

## 9. Opacity Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--opacity-disabled` | 0.5 | Disabled controls |
| `--opacity-muted` | 0.7 | Secondary text overlay |
| `--opacity-overlay` | 0.4 | Modal backdrop |
| `--opacity-skeleton` | 0.6 | Skeleton shimmer base |

---

## 10. Motion Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 100ms | Hover, toggle |
| `--duration-normal` | 200ms | Drawer slide, fade |
| `--duration-slow` | 300ms | Large panel |
| `--ease-default` | ease-out | Standard |
| `--ease-spring` | cubic-bezier | Drawer snap |

**Rule:** Respect `prefers-reduced-motion` — disable non-essential animation.

---

## 11. Breakpoint Tokens

| Token | Min width |
|-------|-----------|
| `--bp-xs` | 0 |
| `--bp-sm` | 576px |
| `--bp-md` | 768px |
| `--bp-lg` | 1024px |
| `--bp-xl` | 1280px |
| `--bp-2xl` | 1440px |

Detail: [RESPONSIVE_UI_STANDARD.md](./RESPONSIVE_UI_STANDARD.md)

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 10 — design token standard |

---

**Design Token Standard** — semantic tokens only, theme-aware, shell-aligned z-index.
