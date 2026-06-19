# Navigation

> **Status:** Draft  
> **Master:** [NAVIGATION_ARCHITECTURE.md](./NAVIGATION_ARCHITECTURE.md) · [UI_UX_DESIGN_STANDARDS.md](./UI_UX_DESIGN_STANDARDS.md)  
> **Layout:** [layout-architecture.md](./layout-architecture.md)  
> **Standards:** [DEVELOPMENT_STANDARDS.md §1](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md#1-mobile-first-design) · [mobile-first.md](./mobile-first.md) · [global-search.md](./global-search.md)

## Purpose
Global UI standard: navigation.

## When To Read
Read only if working on UI patterns related to navigation.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Purpose

Define AgainERP shell navigation — sidebar architecture, breadcrumbs, mobile hamburger, and bottom nav. Odoo-style module sidebar with modern mobile patterns.

---

## Shell Architecture

```
┌──────────┬──────────────────────────────────────────────┬───────────┐
│          │ Top Bar: Search · Company · Branch · 🔔 ✨ 👤 │           │
│ Sidebar  ├──────────────────────────────────────────────┤  Utility  │
│          │ Page Content                               │  Panel    │
│ Fav/     │                                            │  Chatter  │
│ Recent   │                                            │  AI       │
├──────────┴──────────────────────────────────────────────┴───────────┤
│ Bottom Nav (mobile only)                                            │
└─────────────────────────────────────────────────────────────────────┘
```

**Layers:** App shell (persistent) · Module context · Page content · Optional utility panel.

---

## Sidebar Architecture

Two-level navigation: **App switcher** → **Module menu** → **Submenus**.

| Level | Content | Example |
|-------|---------|---------|
| App switcher | Top icon rail or dropdown | ERP, Ecommerce, Website |
| Module group | Collapsible sections | Catalog, Sales, Inventory |
| Menu item | Leaf screen link | Product List, Add Product |
| Badge | Count or "new" indicator | Open orders (12) |

**Desktop (≥ 768px):**
- Fixed left sidebar, 240px expanded / 64px collapsed (icons only)
- Collapse toggle persists in user preferences
- Active item: `--color-primary-subtle` background + primary left border
- Scroll independently from content

**Module registration:** Each module contributes menu tree via `ModuleManifest.md`. Core merges and sorts by declared order.

### Sidebar Features (Required)

| Feature | Behavior |
|---------|----------|
| **Collapsible** | Toggle 240px ↔ 64px; state in user preferences |
| **Pinned menu** | User pins items to top of sidebar |
| **Favorites** | Star icon on any menu item → Favorites section (**disabled in Phase 1 prototype**) |
| **Recent pages** | Last 10 visited screens below favorites |
| **Search menu** | Filter menu tree by keyword |
| **Role based** | Items hidden per RBAC — never show disabled links |
| **Icons** | Lucide icons per module |
| **Nested menus** | Two-level expand/collapse with chevron |

---

## Breadcrumbs

```
AgainERP  ›  Ecommerce  ›  Catalog  ›  Products  ›  Blue Widget
```

| Rule | Detail |
|------|--------|
| Depth | Max 5 levels; truncate middle with `…` on mobile |
| Links | All segments clickable except current page |
| Mobile | Show last 2 segments; tap to expand full path |
| SEO | Public pages include BreadcrumbList JSON-LD per [seo.md](./seo.md) |
| Admin | Breadcrumbs are UI-only (noindex pages) |

Current page title also shown in **Page Header** — breadcrumb is wayfinding, not the sole title.

---

## Mobile Hamburger

| Element | Behavior |
|---------|----------|
| Trigger | Top-left ☰ icon, 44×44px |
| Drawer | Full-height overlay from left, 280px width |
| Content | App switcher + full module tree |
| Close | ✕ button, overlay tap, Esc, or navigate |
| Focus | Trap focus in drawer while open |

**Active trail:** Expand parent groups to reveal current screen. Remember expanded groups in session storage.

---

## Bottom Navigation (Mobile)

Shown below `md` (768px) for primary app sections — max **5 items**.

| Slot | Typical Item |
|------|--------------|
| 1 | Home / Dashboard |
| 2 | Primary module (context-aware) |
| 3 | Create (FAB-style center or prominent) |
| 4 | Notifications |
| 5 | More (opens hamburger or overflow) |

**Rules:**
- Icons + short labels (max 10 chars)
- Active state: primary color icon + label
- Hide on form focus / keyboard open if it obscures inputs (optional collapse)
- Module-specific bottom nav defined in module `UI.md`

---

## Top Bar

| Element | Position | Reference |
|---------|----------|-----------|
| Hamburger | Left (mobile) | This document |
| Breadcrumb | Left (desktop) / below top bar (mobile) | This document |
| Global search | Center | [global-search.md](./global-search.md) |
| Company switcher | Right | Multi-company selector |
| Notifications | Right | Bell icon + unread badge |
| User menu | Right | Avatar dropdown |

**Sticky:** Top bar fixed on scroll. Content area scrolls beneath.

---

## Page Header

Below breadcrumb, above content:

```
Products                          [Import] [+ Create Product]
─────────────────────────────────────────────────────────────
```

| Element | Rule |
|---------|------|
| Title | `--text-xl`, module record name on detail pages |
| Actions | Primary right-aligned; max 3 visible, overflow menu |
| Tabs | Optional secondary nav below header |
| Mobile | Title truncates; actions in overflow or FAB |

---

## Deep Linking & State

| Feature | Rule |
|---------|------|
| URLs | Human-readable, module-prefixed: `/ecommerce/catalog/products` |
| Menu sync | URL determines active sidebar item |
| Permissions | Hidden menu items never appear; direct URL → 403 |
| Favorites | Pin menu items to top of sidebar (user preference — **not shown in prototype**) |

---

## Module Compliance

Module `UI.md` must include navigation map and mobile nav behavior. Screen docs reference breadcrumb path in **Page Layout**.

## Related Documents

| Document | Topic |
|----------|-------|
| [mobile-first.md](./mobile-first.md) | Responsive layout |
| [global-search.md](./global-search.md) | Top bar search |
| [components.md](./components.md) | Dropdowns, avatars |
| [design-system.md](./design-system.md) | Breakpoints |
