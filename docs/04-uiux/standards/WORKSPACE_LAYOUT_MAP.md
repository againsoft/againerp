# AgainERP — Workspace Layout Map

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 07 — Workspace Shell Architecture  
> **Authority:** [WORKSPACE_SHELL_ARCHITECTURE.md](./WORKSPACE_SHELL_ARCHITECTURE.md)

---

## Purpose

Spatial map of workspace shell **zones**, **dimensions**, **breakpoints**, and **stacking order**. Use when placing components or validating responsive behavior.

## When To Read

Read when implementing or documenting layout for any admin screen. Pair with [WORKSPACE_COMPONENT_REGISTRY.md](./WORKSPACE_COMPONENT_REGISTRY.md) for component IDs.

## Related Files

- [WORKSPACE_SHELL_ARCHITECTURE.md](./WORKSPACE_SHELL_ARCHITECTURE.md) — behavioral spec
- [layout-architecture.md](./layout-architecture.md) — legacy layout reference (superseded by this map for shell zones)
- [mobile-first.md](./mobile-first.md) — touch targets and mobile patterns

## Read Next

[WORKSPACE_COMPONENT_REGISTRY.md](./WORKSPACE_COMPONENT_REGISTRY.md)

---

## 1. Zone Index

| Zone | CSS variable (conceptual) | Owner |
|------|----------------------------|-------|
| Global Header | `--ws-header` | Platform shell |
| Left Sidebar | `--ws-sidebar` | Platform shell |
| Module Nav Layer | `--ws-modnav` | Platform shell + active module |
| Content Area | `--ws-content` | Module (body slot) |
| Right Context Panel | `--ws-context` | Platform shell + Core chatter/AI |
| Bottom Navigation | `--ws-bottomnav` | Platform shell (mobile) |

---

## 2. Desktop Layout (≥ 1024px)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ A  GLOBAL HEADER                                    h=56px  z=50  fixed       │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │ B  MODULE NAV LAYER                         h=48px  z=20  sticky │
│ C        ├──────────────────────────────────────────────┬───────────────────┤
│ LEFT     │ D  WORKSPACE CONTENT AREA                  │ E  RIGHT CONTEXT    │
│ SIDEBAR  │                                              │ PANEL             │
│          │  D1 Breadcrumb                               │                   │
│ w=240    │  D2 Page header                            │ w=320 (0 collapsed)│
│ or 64    │  D3 Filters / view switcher                │ z=15               │
│ z=40     │  D4 View body                                │                   │
│ scroll   │  D5 Pagination                               │ scroll             │
│          │  flex-grow · scroll                          │                   │
└──────────┴──────────────────────────────────────────────┴───────────────────┘
```

### 2.1 Dimensions

| Zone | Width | Height | Padding |
|------|-------|--------|---------|
| A — Header | 100vw | 56px | x: 16px |
| B — Module nav | content width | 48px | x: 24px |
| C — Sidebar | 240px / 64px | calc(100vh - 56px) | 8px |
| D — Content | fluid | calc(100vh - 56px - 48px) | 24px (--space-6) |
| E — Context | 0 / 64px rail / 320px | same as D | 16px |

**Min content width:** 480px (horizontal scroll below this within D).

### 2.2 Wide desktop (≥ 1280px)

- Context panel **default expanded** on detail/form views
- Content max-width: none (fluid) — optional `max-width: 1440px` for form-only settings pages

---

## 3. Tablet Layout (768px – 1023px)

```text
┌─────────────────────────────────────────────────────────────┐
│ A  GLOBAL HEADER (full width)                               │
├─────────────────────────────────────────────────────────────┤
│ B  MODULE NAV (horizontal scroll if overflow)               │
├─────────────────────────────────────────────────────────────┤
│ D  CONTENT (full width)                                     │
│                                                             │
│    Sidebar C → overlay drawer (hamburger)                 │
│    Context E → bottom sheet (FAB)                           │
└─────────────────────────────────────────────────────────────┘
```

| Change | Behavior |
|--------|----------|
| Sidebar | Hidden by default; overlay drawer from hamburger |
| Module ops menu | Flyout from Operations tab or second drawer |
| Context panel | 80vh bottom sheet |
| Content padding | 16px (--space-4) |

---

## 4. Mobile Layout (< 768px)

```text
┌──────────────────────────────┐
│ A  HEADER (compact)          │
│    [☰] [Workspace] [🔍] [👤] │
├──────────────────────────────┤
│ B  MODULE NAV (scroll tabs)  │
├──────────────────────────────┤
│ D  CONTENT                   │
│    full width                │
│    drawer CRUD = 100% width  │
│                              │
├──────────────────────────────┤
│ F  BOTTOM NAV  h=56+safe     │
└──────────────────────────────┘
```

| Zone | Mobile behavior |
|------|-----------------|
| A | Hide Quick Actions in overflow `⋯`; search icon opens full-screen |
| B | 4 tabs max visible; scroll for overflow |
| C | Full-screen navigation drawer |
| D | Single column; cards instead of tables |
| E | Full-screen sheet via FAB or header AI |
| F | Fixed bottom; content padding-bottom accounts for nav height |

---

## 5. Content Area Anatomy (Zone D)

```text
┌─────────────────────────────────────────────────────────────┐
│ D1  Breadcrumb    Home › CRM › Leads › Lead #1042             │
├─────────────────────────────────────────────────────────────┤
│ D2  Page Header   [Title]  [Status]     [Primary] [Secondary]│
├─────────────────────────────────────────────────────────────┤
│ D3  Toolbar       [Filters ▾] [Search…] [List|Kanban] [Export]│
├─────────────────────────────────────────────────────────────┤
│ D4  View Body                                                 │
│     ┌─────────────────────────────────────────────────────┐ │
│     │  Dashboard grid | Data table | Form | Kanban | …     │ │
│     └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ D5  Footer        Pagination · row count · bulk action bar   │
└─────────────────────────────────────────────────────────────┘
```

### 5.1 View body layouts by type

| View | D4 layout |
|------|-----------|
| Dashboard | 12-column CSS grid; widgets span 3/4/6/12 cols |
| List | Table or card list + sticky header |
| Detail | 2-col: main (8) + side smart buttons (4); tabs below header |
| Form | Single col mobile; 2-col desktop for wide forms |
| Kanban | Horizontal columns; scroll-x on mobile |
| Calendar | Full height; toolbar for view (month/week/day) |
| Analytics | Chart stack + filter sidebar (collapsible) |

---

## 6. Drawer & Overlay Map

| Overlay | Width (desktop) | Width (mobile) | z-index |
|---------|-----------------|----------------|---------|
| CRUD Sheet (right) | 480px / 640px | 100vw | 70 |
| Sidebar drawer | 280px | 100vw | 40 |
| Context sheet | 320px side | 100vh | 65 |
| Command palette | 560px centered | 100vw | 80 |
| Modal dialog | 480px max | 100vw | 70 |
| Toast | — | full width top | 90 |

**CRUD Sheet rule:** Slides from **right**; list remains visible on desktop; full-screen on mobile.

---

## 7. Z-Index Scale

| Layer | z-index | Zones |
|-------|---------|-------|
| Base content | 0 | D4 |
| Sticky table header / module nav | 10–20 | B, D3 |
| Sidebar (desktop fixed) | 40 | C |
| Global header | 50 | A |
| Dropdowns / popovers | 60 | A, D2 |
| Drawers / modals | 70 | CRUD, dialogs |
| Command palette | 80 | Search |
| Toasts | 90 | Global |

---

## 8. Spacing & Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--ws-header-h` | 56px | Zone A |
| `--ws-modnav-h` | 48px | Zone B |
| `--ws-sidebar-w` | 240px | Zone C expanded |
| `--ws-sidebar-w-collapsed` | 64px | Zone C collapsed |
| `--ws-context-w` | 320px | Zone E expanded |
| `--ws-bottomnav-h` | 56px + safe-area | Zone F |
| `--ws-content-px` | 24px / 16px | D padding desktop / mobile |
| `--ws-tap-min` | 44px | All interactive targets |

Visual tokens: [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md)

---

## 9. Route → Layout Matrix

| Route pattern | B tab | C visible | E default | F visible |
|---------------|-------|-----------|-----------|-----------|
| `/{m}/dashboard` | Dashboard | yes | hidden | mobile |
| `/{m}/{entity}` (list) | Operations | yes | hidden | mobile |
| `/{m}/{entity}?view=` | Operations | yes | expanded | mobile |
| `/{m}/reports` | Reports | yes | hidden | mobile |
| `/{m}/settings` | Settings | yes | hidden | mobile |
| Platform admin | — | Admin section | hidden | mobile |

---

## 10. ASCII — Full Stack (Desktop)

```text
                    ┌─── Workspace Switcher
                    ▼
┌──────────────────────────────────────────────────────────────────┐
│ Logo │ Workspace ▾ │ 🔍 Search…          │ + │ ✨ │ 🔔 │ Avatar ▾ │  ← A
├──────┴─────────────┴─────────────────────┴───┴────┴────┴──────────┤
│ [Dashboard] [Operations] [Reports] [Settings]                     │  ← B
├────────┬─────────────────────────────────────────────┬───────────┤
│ ★ Fav  │ Home › Module › Screen                        │ AI │ Act │  ← D1
│────────│ ┌─────────────────────────────────────────┐   │ Related │
│ Core   │ │ Page Title              [Save] [Action] │   │         │
│────────│ ├─────────────────────────────────────────┤   │         │
│ CRM    │ │ Filters · View toggle                   │   │         │
│ Sales  │ ├─────────────────────────────────────────┤   │         │
│ …      │ │                                         │   │         │
│────────│ │           VIEW BODY                     │   │         │
│ Admin  │ │                                         │   │         │
│        │ └─────────────────────────────────────────┘   │         │
└────────┴─────────────────────────────────────────────┴───────────┘
     ▲                                                           ▲
     C                                                           E
```

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 07 — workspace layout map |

---

**Workspace Layout Map** — zones, sizes, breakpoints, one reference grid.
