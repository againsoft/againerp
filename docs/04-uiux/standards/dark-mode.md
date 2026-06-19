# Dark Mode

> **Status:** Draft  
> **Standards:** [theme-system.md](./theme-system.md) · [design-system.md](./design-system.md)

## Purpose
Global UI standard: dark mode.

## When To Read
Read only if working on UI patterns related to dark mode.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Purpose

Define AgainERP dark mode palette, toggle behavior, and persistence. Respects system preference by default with manual override.

---

## Dark Palette

Semantic tokens override light values under `[data-theme="dark"]`. Never invert light colors programmatically — use defined dark tokens.

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-background` | `#f9fafb` | `#0f172a` | Page background |
| `--color-surface` | `#ffffff` | `#1e293b` | Cards, inputs, modals |
| `--color-surface-raised` | `#ffffff` | `#334155` | Dropdowns, popovers |
| `--color-text` | `#111827` | `#f1f5f9` | Primary text |
| `--color-text-muted` | `#6b7280` | `#94a3b8` | Labels, secondary |
| `--color-border` | `#e5e7eb` | `#475569` | Dividers, borders |
| `--color-primary` | `#2563eb` | `#3b82f6` | Actions (slightly brighter) |
| `--color-primary-subtle` | `#eff6ff` | `#1e3a5f` | Selected rows, active nav |
| `--color-success` | `#16a34a` | `#22c55e` | Status badges |
| `--color-warning` | `#d97706` | `#fbbf24` | Warnings |
| `--color-danger` | `#dc2626` | `#ef4444` | Errors |
| `--shadow-sm` | Light shadow | `0 1px 2px rgba(0,0,0,.3)` | Elevation |

**Images & media:** No global invert. Product images, avatars, and charts render as-is. Optional subtle border on images for edge definition.

---

## Contrast & Accessibility

| Requirement | Dark Mode Target |
|-------------|------------------|
| Body text | 4.5:1 against `--color-background` |
| Muted text | 4.5:1 minimum — may need lighter than light-mode muted |
| Primary on surface | 4.5:1 for buttons and links |
| Focus ring | `--color-primary` at 2px, 2px offset |
| Charts | Use dark-safe palette; grid lines `--color-border` |

Validate all status badge combinations in dark mode before release.

---

## Toggle

| Location | Control |
|----------|---------|
| User menu | Light · Dark · System (default) |
| Settings → Appearance | Same options + preview |
| Quick toggle | Optional icon in top bar (desktop) |

**Three states:**

| Value | Behavior |
|-------|----------|
| `system` | Follow `prefers-color-scheme` media query |
| `light` | Force light theme |
| `dark` | Force dark theme |

**Icon:** Sun/moon icon reflects active mode. No flash on load — see FOUC prevention below.

---

## Persistence

| Store | Content |
|-------|---------|
| User preference API | `{ "theme_mode": "system" \| "light" \| "dark" }` |
| Local storage | Cache for instant apply before API hydration |
| Session | `data-theme` on `<html>` element |

**Priority:** User explicit choice > company default (if set) > system preference > light.

**Company default:** Admins may set default mode for new users in company branding settings. User override always wins.

---

## FOUC Prevention

Avoid flash of wrong theme on page load:

1. Inline script in `<head>` reads localStorage / system preference
2. Sets `data-theme="dark"` on `<html>` before first paint
3. Hydrate from user API preference asynchronously
4. Listen to `prefers-color-scheme` changes when mode is `system`

**SSR:** Server renders neutral shell; client script applies theme immediately.

---

## Component Adjustments

| Component | Dark Mode Note |
|-----------|----------------|
| Tables | Alternating row: `--color-surface` / `--color-background` |
| Inputs | `--color-surface` background, visible border |
| Modals | Overlay `rgba(0,0,0,0.6)` |
| Code blocks | `--color-surface-raised` background |
| Skeleton loaders | Muted pulse, not white flash |
| Toasts | `--color-surface-raised` with border |
| Charts | Theme-aware axis and legend colors |

See [components.md](./components.md) for component specs.

---

## Charts & Data Visualization

| Rule | Detail |
|------|--------|
| Palette | 8-color dark-safe sequence |
| Grid | `--color-border`, low opacity |
| Tooltips | `--color-surface-raised` background |
| Export | Charts export in current theme |

---

## Third-Party & Embeds

| Content | Approach |
|---------|----------|
| Rich text editor | Editor provides dark toolbar theme |
| Maps | Dark map tiles when available |
| Payment iframe | Cannot theme — isolate in bordered container |
| PDF preview | Always light background (document accuracy) |

---

## Testing Checklist

- [ ] Toggle all three modes without flash
- [ ] Persist across sessions and devices
- [ ] System preference change updates when mode = system
- [ ] All status badges meet contrast
- [ ] Forms, tables, modals, dropdowns verified
- [ ] Company primary color works on dark surfaces
- [ ] `prefers-reduced-motion` respected

---

## Module Compliance

Screen docs note any components requiring dark-mode-specific assets (e.g., custom illustrations) in **Page Layout**.

## Related Documents

| Document | Topic |
|----------|-------|
| [theme-system.md](./theme-system.md) | CSS variable hierarchy |
| [design-system.md](./design-system.md) | Base tokens |
| [components.md](./components.md) | Component behavior |
