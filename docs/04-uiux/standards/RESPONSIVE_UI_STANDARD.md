# AgainERP — Responsive UI Standard

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 10 — Enterprise Design System & UI Foundation  
> **Authority:** [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md)

---

## Purpose

Standards for **responsive behavior** across desktop, tablet, and mobile — breakpoints, layout shifts, touch targets, and content priority.

## When To Read

Read when documenting any screen in Menus specs or prototype build guides.

## Related Files

- [DESIGN_TOKEN_STANDARD.md §11](./DESIGN_TOKEN_STANDARD.md#11-breakpoint-tokens)
- [MOBILE_NAVIGATION_ARCHITECTURE.md](./MOBILE_NAVIGATION_ARCHITECTURE.md)
- [MOBILE_DASHBOARD_ARCHITECTURE.md](./MOBILE_DASHBOARD_ARCHITECTURE.md)
- [mobile-first.md](./mobile-first.md)
- [WORKSPACE_SHELL_ARCHITECTURE.md](./WORKSPACE_SHELL_ARCHITECTURE.md)
- [QUICK_ACTION_FRAMEWORK_STANDARD.md](./QUICK_ACTION_FRAMEWORK_STANDARD.md)
- [LOADING_STATE_STANDARD.md](./LOADING_STATE_STANDARD.md)

## Read Next

§2 **Breakpoints** — design at 375px first.

---

## 1. Mobile-First Mandate

```text
Design at 375px → enhance at sm → md → lg → xl
```

All AgainERP UI must be fully usable on mobile. Desktop adds density and parallel panels — not exclusive features without mobile equivalent.

---

## 2. Breakpoints

| Token | Min width | Device class |
|-------|-----------|--------------|
| (default) | 0 | Mobile |
| `sm` | 640px | Large phone / small tablet |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Wide desktop |
| `2xl` | 1536px | Ultra-wide |

Detail: [DESIGN_TOKEN_STANDARD.md](./DESIGN_TOKEN_STANDARD.md) · [mobile-first.md](./mobile-first.md)

---

## 3. Desktop (≥ lg)

| Pattern | Behavior |
|---------|----------|
| Sidebar | Fixed expanded (240px) or collapsed (64px) |
| Module nav | Horizontal tabs below header |
| CRUD | Right drawer 480–640px; list visible |
| Tables | Full data grid with column picker |
| AI panel | Utility zone drawer alongside content |
| Dashboard | Multi-column widget grid |

---

## 4. Tablet (md – lg)

| Pattern | Behavior |
|---------|----------|
| Sidebar | Collapsed icon rail or overlay drawer |
| Module nav | Scrollable horizontal tabs |
| CRUD | Drawer 480px or full-width at md breakpoint |
| Tables | Horizontal scroll or reduced columns |
| Dashboard | 2-column widget grid |

---

## 5. Mobile (< md)

| Pattern | Behavior |
|---------|----------|
| Navigation | Bottom nav + hamburger — [MOBILE_NAVIGATION_ARCHITECTURE.md](./MOBILE_NAVIGATION_ARCHITECTURE.md) |
| CRUD | Full-screen sheet drawer |
| Tables | Card list (`DS-CARD-LIST`) — same data |
| Forms | Single column · sticky footer actions |
| Dashboard | Single column stack — [MOBILE_DASHBOARD_ARCHITECTURE.md](./MOBILE_DASHBOARD_ARCHITECTURE.md) |
| Modals | Full-width sheets |
| Overlays | One at a time — no stacked drawers |
| Quick actions | Header `+` hidden — use command palette · [QUICK_ACTION_FRAMEWORK_STANDARD.md §7](./QUICK_ACTION_FRAMEWORK_STANDARD.md#7-mobile-behaviour) |

---

## 6. Touch & Interaction

| Rule | Value |
|------|-------|
| Min tap target | 44×44px (`--ws-tap-min`) |
| Spacing between taps | 8px minimum |
| Hover states | Desktop only — never required on mobile |
| Gestures | Swipe-to-close on sheets (optional) |

---

## 7. Content Priority

When space is constrained, hide in this order:

```text
1. Secondary columns in tables → column picker
2. Utility panel (AI, activity) → icon trigger
3. Module nav labels → icons only
4. Breadcrumb middle segments → ellipsis
5. Inline help text → tooltip
```

Never hide: primary action, record title, status, save/cancel.

---

## 8. Typography & Density Scaling

| Element | Mobile | Desktop |
|---------|--------|---------|
| Page title | `--text-xl` | `--text-2xl` |
| Body | `--text-sm` | `--text-sm` (same — readability) |
| Table row height | 56px (card) | 40–48px |
| Content padding | 16px | 24px |

---

## 9. Images & Media

| Rule | Detail |
|------|--------|
| Product thumbs | 48px mobile list · 64px desktop |
| Avatars | 32px inline · 40px profile |
| Charts | Full width mobile; min-height 200px |

Recharts: responsive container always; see [recharts-conventions.md](./recharts-conventions.md).

---

## 10. Testing Checklist

| Viewport | Verify |
|----------|--------|
| 375×667 | Full CRUD flow, bottom nav, card lists |
| 768×1024 | Sidebar collapse, drawer width |
| 1280×800 | Grid columns, utility panel |
| 1920×1080 | Max content width, no orphan whitespace |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 10 — responsive UI standard |

---

**Responsive UI Standard** — mobile-first, 44px taps, card fallback for lists.
