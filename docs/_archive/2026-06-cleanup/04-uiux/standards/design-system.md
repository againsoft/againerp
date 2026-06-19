# Design System

> **Status:** Superseded — **do not use as SSOT**  
> **Superseded by:** [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md) · [DESIGN_TOKEN_STANDARD.md](./DESIGN_TOKEN_STANDARD.md) · [UI_ARCHITECTURE_LOCK.md](../../UI_ARCHITECTURE_LOCK.md) — APPROVED (Step 10)  
> **On conflict:** Step 10 standards win.

## Purpose
Global UI standard: design system.

## When To Read
Read only if working on UI patterns related to design system.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

> **Status:** Draft  
> **Master:** [UI_UX_DESIGN_STANDARDS.md](./UI_UX_DESIGN_STANDARDS.md)  
> **Standards:** [DEVELOPMENT_STANDARDS.md §1](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md#1-mobile-first-design) · [mobile-first.md](./mobile-first.md)


## When To Read
Read only if working on UI patterns related to design system.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Purpose

Define the shared visual language for AgainERP — tokens, breakpoints, and accessibility rules that every module and screen must follow. Odoo-inspired density with modern mobile-first polish. **Familiar to Odoo users, uniquely AgainERP.**

## Design Principles

Aligned with [UI_UX_DESIGN_STANDARDS.md](./UI_UX_DESIGN_STANDARDS.md#core-ui-principles):

| Principle | Rule |
|-----------|------|
| Simple | One primary action per view |
| Fast | Skeleton loaders, < 200ms perceived interactions |
| Professional | Enterprise density without clutter |
| Minimal | No decorative UI |
| Consistent | Same patterns across all modules |
| Mobile first | Design at 375px, enhance upward |
| Keyboard friendly | `Ctrl+K` search, full tab order |
| Accessibility | WCAG 2.1 AA minimum on all interactive UI |

---

## Color Tokens

Semantic tokens map to CSS variables (`--color-*`). Never reference raw palette values in components.

| Token | Light | Usage |
|-------|-------|-------|
| `--color-primary` | Brand blue | Primary actions, active nav |
| `--color-primary-hover` | Darker blue | Hover/focus on primary |
| `--color-secondary` | Neutral slate | Secondary buttons, borders |
| `--color-success` | Green | Confirmed, paid, active |
| `--color-warning` | Amber | Pending, low stock |
| `--color-danger` | Red | Errors, delete, overdue |
| `--color-info` | Cyan | Informational badges, tips |
| `--color-surface` | White | Cards, modals, inputs |
| `--color-background` | Gray-50 | Page background |
| `--color-text` | Gray-900 | Body text |
| `--color-text-muted` | Gray-500 | Labels, placeholders |
| `--color-border` | Gray-200 | Dividers, input borders |

**State overlays:** `--color-primary-subtle` (selected row), `--color-danger-subtle` (validation highlight).

**Status badges:** Use [status-system.md](./status-system.md) tokens only — `--status-success`, `--status-pending`, etc.

See [theme-system.md](./theme-system.md) and [dark-mode.md](./dark-mode.md) for theme overrides.

---

## Typography

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `--font-family` | — | — | System stack: `-apple-system, Segoe UI, Roboto, sans-serif` |
| `--text-xs` | 12px | 400 | Captions, table meta |
| `--text-sm` | 14px | 400 | Body, form labels |
| `--text-base` | 16px | 400 | Default body (mobile minimum) |
| `--text-lg` | 18px | 600 | Section headings |
| `--text-xl` | 20px | 600 | Page titles |
| `--text-2xl` | 24px | 700 | Dashboard headings |

**Line height:** 1.5 for body, 1.25 for headings. **Max line length:** 75 characters in prose blocks.

---

## Spacing Scale

4px base unit. Use token names in layout and component padding.

| Token | Value | Common Use |
|-------|-------|------------|
| `--space-1` | 4px | Icon gaps |
| `--space-2` | 8px | Inline spacing, chip padding |
| `--space-3` | 12px | Input padding-y |
| `--space-4` | 16px | Card padding (mobile) |
| `--space-6` | 24px | Section gaps |
| `--space-8` | 32px | Page section margins |
| `--space-12` | 48px | Large section breaks |

**Touch spacing:** Minimum 8px between interactive elements; 44×44px tap targets per [mobile-first.md](./mobile-first.md).

---

## Shadows & Elevation

| Token | Usage |
|-------|-------|
| `--shadow-sm` | Inputs, subtle cards |
| `--shadow-md` | Dropdowns, popovers |
| `--shadow-lg` | Modals, drawers |
| `--shadow-none` | Flat tables, inline panels |

Elevation increases with interaction layer (page → card → overlay → modal). Do not stack more than one `--shadow-lg` element visibly.

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Badges, chips |
| `--radius-md` | 8px | Buttons, inputs, cards |
| `--radius-lg` | 12px | Modals, sheets |
| `--radius-full` | 9999px | Avatars, pills |

---

## Breakpoints

Aligned with [DEVELOPMENT_STANDARDS.md §1](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md#1-mobile-first-design):

| Name | Min Width | Layout Behavior |
|------|-----------|-----------------|
| `xs` | 0 | Single column, bottom nav, card lists |
| `sm` | 576px | Wider cards, 2-column forms optional |
| `md` | 768px | Sidebar visible, table view enabled |
| `lg` | 1024px | Multi-column forms, dashboard grid |
| `xl` | 1440px | Max content width, optional density toggle |
| `2xl` | 1920px | Centered shell, wider data tables |

**Content max-width:** 1440px for main shell; forms may narrow to 720px for readability.

---

## Accessibility

| Requirement | Standard |
|-------------|----------|
| Color contrast | 4.5:1 text, 3:1 large text and UI components |
| Focus | Visible `:focus-visible` ring using `--color-primary` |
| Keyboard | All actions reachable without mouse; logical tab order |
| Motion | Respect `prefers-reduced-motion`; no essential info in animation |
| Screen readers | Semantic HTML, `aria-label` on icon-only buttons |
| Forms | Labels linked to inputs; errors announced via `aria-live` |
| Tables | `<th scope>` headers; sort state in `aria-sort` |

**Status colors** must never be the sole indicator — pair with icon, label, or pattern.

---

## Iconography

- **Library:** Lucide (outline, 20px default, 16px in dense tables)
- **Alignment:** Optically centered with adjacent text
- **Meaning:** Standard set across modules (edit = pencil, delete = trash, etc.)

---

## Module Compliance

Every `UI.md` and `Menus/*.md` **Page Layout** section must reference applicable tokens and breakpoints. Custom colors require approval and mapping to semantic tokens.

## Related Documents

| Document | Topic |
|----------|-------|
| [components.md](./components.md) | Component specs |
| [theme-system.md](./theme-system.md) | CSS variables, branding |
| [dark-mode.md](./dark-mode.md) | Dark palette |
| [mobile-first.md](./mobile-first.md) | Layout patterns |
