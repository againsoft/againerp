# AgainERP — Workspace Shell Architecture

> **Status:** Active — **workspace shell SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 07 — Workspace Shell Architecture  
> **Audience:** Architects · UI/UX · Frontend · Module teams  
> **Governance:** [ARCHITECTURE_DECISIONS.md §5](../../ARCHITECTURE_DECISIONS.md#5-ui-rules) · [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md)

**No code.** Canonical architecture for the **single AgainERP workspace shell** — every admin module runs inside this frame.

---

## Purpose

Define the **one master workspace shell** that wraps all AgainERP admin modules. Modules register content and navigation; they **never** ship custom shells.

## When To Read

Read before designing any admin screen, module UI.md, or prototype build guide. Read after [BRAIN.md](../../BRAIN.md) when the task is platform shell or cross-module navigation.

## Related Files

- [WORKSPACE_LAYOUT_MAP.md](./WORKSPACE_LAYOUT_MAP.md) — zones, breakpoints, dimensions
- [WORKSPACE_COMPONENT_REGISTRY.md](./WORKSPACE_COMPONENT_REGISTRY.md) — shell components
- [WORKSPACE_NAVIGATION_RULES.md](./WORKSPACE_NAVIGATION_RULES.md) — shell registration rules (see also [NAVIGATION_ARCHITECTURE.md](./NAVIGATION_ARCHITECTURE.md))
- [DASHBOARD_FRAMEWORK_ARCHITECTURE.md](./DASHBOARD_FRAMEWORK_ARCHITECTURE.md) — dashboard layers · widgets (Step 09)
- [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md) — design language (extends this shell)
- [MODULE_REGISTRY.md](../../MODULE_REGISTRY.md) — module layers for sidebar grouping

## Read Next

- Shell zones: [WORKSPACE_LAYOUT_MAP.md](./WORKSPACE_LAYOUT_MAP.md)
- Adding a module: [WORKSPACE_NAVIGATION_RULES.md §6](./WORKSPACE_NAVIGATION_RULES.md#6-module-registration)

---

## 1. Core Decision

| Rule | Detail |
|------|--------|
| **Single shell** | One workspace frame for all admin modules — `app/(admin)/` |
| **No module shells** | Business modules render **content slots only** inside the shell |
| **Graceful hide** | Disabled modules: menu hidden, routes skipped — shell unchanged |
| **Storefront exception** | Customer storefront uses `(storefront)/` — separate shell, same design tokens |
| **Documentation-first** | Shell changes update this file + component registry before code |

**Authority chain:** This document (shell structure) → ENTERPRISE_UI_ARCHITECTURE (visual language) → module `UI.md` (module menus).

---

## 2. Shell Overview

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ GLOBAL HEADER — Workspace · Search · AI · Notifications · Actions · User    │
├──────────┬───────────────────────────────────────────────────┬───────────────┤
│ LEFT     │ MODULE NAV LAYER (Dashboard · Ops · Reports · Automation · Config) │
│ SIDEBAR  ├───────────────────────────────────────────────────┤ RIGHT CONTEXT │
│          │ WORKSPACE CONTENT AREA                            │ PANEL         │
│ Favorites│ Breadcrumb · Page header · Filters · View body    │ AI · Activity │
│ Core     │ (Dashboard · List · Detail · Form · Kanban · …)   │ Related       │
│ Business │                                                   │               │
│ Industry │                                                   │               │
│ Admin    │                                                   │               │
├──────────┴───────────────────────────────────────────────────┴───────────────┤
│ MOBILE: Bottom Nav + Drawer overlays (see §8)                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

| Zone | Doc section | Registry prefix |
|------|-------------|-----------------|
| Global Header | §3 | `WS-HEADER-*` |
| Left Sidebar | §4 | `WS-SIDE-*` |
| Module Navigation Layer | §5 | `WS-MODNAV-*` |
| Workspace Content Area | §6 | `WS-CONTENT-*` |
| Right Context Panel | §7 | `WS-CONTEXT-*` |
| Mobile Layout | §8 | `WS-MOBILE-*` |

Full layout map: [WORKSPACE_LAYOUT_MAP.md](./WORKSPACE_LAYOUT_MAP.md)

---

## 3. Global Header

Fixed top bar — **56px** height, sticky, z-index 50. Present on every admin screen.

| Component | ID | Purpose | Behavior |
|-----------|-----|---------|----------|
| **Workspace Switcher** | `WS-HEADER-WORKSPACE` | Active tenant/company/branch context | Dropdown: switch company · branch · warehouse · saved workspace preset; shows current context label |
| **Global Search** | `WS-HEADER-SEARCH` | Cross-module find + command palette | Click or `Ctrl+K` / `Cmd+K`; scopes records, menus, actions, AI |
| **AI Assistant** | `WS-HEADER-AI` | Open AI panel | Click or `Ctrl+J`; toggles right context panel AI tab |
| **Notifications** | `WS-HEADER-NOTIFY` | System + module alerts | Bell + unread badge; panel dropdown or route to inbox |
| **Quick Actions** | `WS-HEADER-QUICK` | Global create shortcuts | `+` menu: context-aware creates (Product, Order, Lead, …) from enabled modules |
| **User Menu** | `WS-HEADER-USER` | Profile, prefs, logout | Avatar ▾: profile · preferences · theme · language · sign out |

### 3.1 Workspace Switcher (detail)

**Workspace** = user's active operational context:

```text
Tenant → Company → Branch (optional) → Warehouse (optional)
```

| Capability | Rule |
|------------|------|
| Multi-company users | Switcher required in header |
| Single-company tenants | Switcher shows company name only (no dropdown) |
| Saved presets | User can pin a context as "My Workspace" (future) |
| Module scope | Switching context refreshes KPIs and record rules — not the shell layout |

### 3.2 Global Search

Merged with **command palette** (Linear-style). Same entry point as search field.

| Scope | Examples |
|-------|----------|
| Records | Products, orders, contacts, tickets |
| Navigation | Jump to module screen |
| Actions | Create, export, open settings |
| AI | "Ask about…" when AI enabled |

Detail: [global-search.md](./global-search.md) · [command-palette.md](./command-palette.md)

### 3.3 Header cluster order (left → right)

```text
[Logo → Home] · [Workspace Switcher] · [Global Search ─────────────] · [Quick Actions] · [AI] · [Notifications] · [User Menu]
```

Logo links to user's **default module dashboard** (preference) or platform home.

---

## 4. Left Sidebar

Primary **module discovery** navigation. Width: **240px** expanded · **64px** icon-only collapsed.

### 4.1 Sidebar levels (fixed order)

| Level | ID | Contents | Source |
|-------|-----|----------|--------|
| **Favorites** | `WS-SIDE-FAV` | User-starred screens | User prefs + any menu item |
| **Core Modules** | `WS-SIDE-CORE` | Always-on platform capabilities | Contacts · Users · Workflow · Documents · Settings |
| **Business Modules** | `WS-SIDE-BIZ` | ERP + Commerce installables | [MODULE_REGISTRY.md](../../MODULE_REGISTRY.md) — crm, sales, ecommerce, hr, … |
| **Industry Apps** | `WS-SIDE-IND` | Vertical packages | Hospital, retail, manufacturing extensions |
| **Administration** | `WS-SIDE-ADMIN` | Platform + tenant admin | SaaS billing · tenants · modules · audit · system |

**Rule:** Levels are **sections**, not separate sidebars. Each section is collapsible. Empty sections hidden (e.g. no Industry Apps installed).

### 4.2 Sidebar capabilities

| Feature | ID | Behavior |
|---------|-----|----------|
| **Collapse / Expand** | `WS-SIDE-COLLAPSE` | 240px ↔ 64px; persists in user preferences |
| **Pin** | `WS-SIDE-PIN` | Pin module or item to top of its section |
| **Search** | `WS-SIDE-SEARCH` | Filter entire sidebar tree by keyword |
| **RBAC** | — | Hide items user cannot access — **never** show disabled links |
| **Badges** | — | Counts on menu items (open orders, pending approvals) |

### 4.3 Module selection behavior

Selecting a module in the sidebar:

1. Sets **active module context** (route prefix, manifest, permissions)
2. Reveals **Module Navigation Layer** (§5) for that module
3. Navigates to module **Dashboard** unless user clicked a specific leaf item
4. Highlights active module in sidebar

Navigation rules: [NAVIGATION_ARCHITECTURE.md](./NAVIGATION_ARCHITECTURE.md) · [GLOBAL_MENU_STRUCTURE.md](./GLOBAL_MENU_STRUCTURE.md)

---

## 5. Module Navigation Layer

Secondary navigation **within the active module**. Appears below the global header, above content — horizontal tab bar or compact sub-nav strip.

**Full standard (Step 08):** [MODULE_NAVIGATION_STANDARD.md](./MODULE_NAVIGATION_STANDARD.md)

### 5.1 Standard module tabs (all modules)

Every installable module **must** expose up to five top-level zones:

| Tab | ID | Purpose | Typical contents |
|-----|-----|---------|------------------|
| **Dashboard** | `WS-MODNAV-DASH` | KPIs, widgets, summary | Module home `/dashboard` |
| **Operations** | `WS-MODNAV-OPS` | Day-to-day transactional work | Level 3 features from `ModuleManifest.md` |
| **Reports** | `WS-MODNAV-RPT` | Analytics and exports | `Reports.md` · `Menus/Reports/` |
| **Automation** | `WS-MODNAV-AUTO` | Workflows, rules, AI automation | `Workflow.md` · `AI.md` |
| **Configuration** | `WS-MODNAV-SET` | Module settings | `/settings` — label may read "Settings" |

**Rule:** Hide empty tabs. **Operations** required if module has transactional screens.

### 5.2 Operations submenu

When **Operations** is active, the left sidebar **or** a flyout panel shows the module's operational menu tree (from `ModuleManifest.md` / `UI.md`).

Example — Ecommerce Operations:

```text
Catalog · Inventory · Sales · Customers · Marketing · Content · SEO · Builder · Media · AI · System
```

Example — CRM Operations:

```text
Leads · Opportunities · Pipeline · Activities · Contacts
```

### 5.3 URL mapping

| Tab | Route pattern |
|-----|---------------|
| Dashboard | `/{module}/dashboard` or module default route |
| Operations | `/{module}/{area}/{entity}` |
| Reports | `/{module}/reports` or `/{module}/reports/{report}` |
| Settings | `/{module}/settings` |

---

## 6. Workspace Content Area

Central **flex-grow** region. Modules render view bodies here — never own the outer frame.

### 6.1 Content chrome (shell-owned)

Every page includes shell-provided chrome:

```text
Breadcrumb row
Page header (title · status badge · primary actions)
Optional: filter bar · tab bar · view switcher
View body (module content slot)
Optional: pagination footer
```

### 6.2 Supported view types

| View type | ID | Use case | CRUD pattern |
|-----------|-----|----------|--------------|
| **Dashboard** | `WS-CONTENT-DASH` | Widgets, KPIs, charts | N/A |
| **List Page** | `WS-CONTENT-LIST` | Searchable tables, bulk actions | List + **right Sheet drawer** for create/view/edit |
| **Detail Page** | `WS-CONTENT-DETAIL` | Record with tabs, smart buttons | Full page or drawer per entity rules |
| **Form** | `WS-CONTENT-FORM` | Standalone create/edit (settings, wizards) | Full page or drawer |
| **Kanban** | `WS-CONTENT-KANBAN` | Pipeline boards (CRM, projects) | Card click → drawer detail |
| **Calendar** | `WS-CONTENT-CAL` | Scheduling, leave, bookings | Event click → drawer |
| **Analytics** | `WS-CONTENT-ANALYTICS` | Deep charts, drill-down | Extends Reports tab |

### 6.3 CRUD URL rule (non-negotiable)

Per [ARCHITECTURE_DECISIONS §5.1](../../ARCHITECTURE_DECISIONS.md#51-crud--list--right-sheet-drawer):

```text
List route:     /{module}/{entity}
Create:         ?create=1
View record:    ?view={id}
Edit record:    ?edit={id}

❌ Forbidden: /new · /[id]/edit for standard entity CRUD
```

Reference implementation: `/catalog/products`

### 6.4 View switcher

List views may expose **List · Kanban · Calendar · Map** toggle in page header when module supports multiple layouts for the same entity set.

---

## 7. Right Context Panel

Optional third column — **320px** expanded · collapsed to icon rail · hidden on narrow viewports.

| Tab | ID | Purpose |
|-----|-----|---------|
| **AI Assistant** | `WS-CONTEXT-AI` | Context-aware chat, suggested actions, tool results |
| **Activity Feed** | `WS-CONTEXT-ACTIVITY` | Chatter: notes · comments · attachments · timeline |
| **Related Records** | `WS-CONTEXT-RELATED` | Linked entities across modules (orders for contact, etc.) |

### 7.1 Default visibility

| Page type | Desktop (≥1280px) | Tablet | Mobile |
|-----------|-------------------|--------|--------|
| List view | Hidden | Collapsed | Hidden — FAB to open sheet |
| Detail / Form | Expanded (Activity tab) | Bottom sheet | Full-screen sheet |
| Dashboard | Hidden | Hidden | Hidden |
| AI-focused task | Expanded (AI tab) | Expanded | Full-screen |

### 7.2 AI + Activity coordination

- Header **AI** button and context panel **AI tab** share the same session state
- Activity feed uses **Core** chatter — modules configure tabs, not rebuild
- Related records fetched via **services** — no cross-module UI coupling

Detail: [ai-assistant-ui.md](./ai-assistant-ui.md)

---

## 8. Mobile Layout

Mobile-first mandatory — design at **375px**, enhance upward.

### 8.1 Bottom Navigation

Fixed bottom bar — **56px** + safe area. Max **5** items:

| Slot | Default | Behavior |
|------|---------|----------|
| Home | Dashboard of active module | |
| Search | Opens full-screen search / command palette | |
| Create | Quick Actions (contextual) | |
| Notifications | Alert inbox | |
| More | Opens mobile drawer (full sidebar) | |

Module-specific bottom nav overrides allowed when user is deep in one module (e.g. Ecommerce: Dashboard · Catalog · Orders · More).

### 8.2 Mobile Drawer

| Drawer | Trigger | Contents |
|--------|---------|----------|
| **Navigation drawer** | Hamburger · More | Full sidebar levels (§4) |
| **Module drawer** | Operations tab | Module operational menus |
| **Context drawer** | FAB · AI button | Right context panel tabs |
| **CRUD drawer** | List row tap | Full-width Sheet — create/view/edit |

### 8.3 Responsive rules

| Breakpoint | Sidebar | Module nav | Context panel | Bottom nav |
|------------|---------|------------|---------------|------------|
| < 768px | Drawer | Horizontal scroll tabs | Full-screen sheet | Visible |
| 768–1023px | Overlay drawer | Tab bar | Bottom sheet | Optional |
| ≥ 1024px | Fixed column | Tab bar + sidebar ops menu | Side column | Hidden |
| ≥ 1280px | Fixed column | Full layout | Default expanded on detail | Hidden |

Detail: [mobile-first.md](./mobile-first.md) · [WORKSPACE_LAYOUT_MAP.md](./WORKSPACE_LAYOUT_MAP.md)

---

## 9. Module Integration Contract

Modules **register** with the shell — they do not implement shell UI.

| Registration | File | Provides |
|--------------|------|----------|
| Menu tree | `ModuleManifest.md` | Sidebar items under correct layer |
| Module nav tabs | `UI.md` | Dashboard · Operations · Reports · Settings mapping |
| Permissions | `Permissions.md` | RBAC keys for menu visibility |
| View routes | `Architecture.md` §8 | Route namespace |
| Context panel | `UI.md` | Chatter tabs · related record types |
| Quick creates | `ModuleManifest.md` | Header Quick Actions entries |

Checklist: [WORKSPACE_NAVIGATION_RULES.md §6](./WORKSPACE_NAVIGATION_RULES.md#6-module-registration)

---

## 10. Relationship to Other Shells

| Shell | Route group | Relationship |
|-------|-------------|--------------|
| **Workspace (this doc)** | `app/(admin)/` | Master ERP/commerce admin |
| **Storefront** | `app/(storefront)/` | Customer-facing — separate nav, shared tokens |
| **ESS / Portal** | `app/(portal)/` | Employee self-service — simplified shell, subset of components |
| **Print** | `app/(print)/` | No shell — print layouts only |

---

## 11. Design Language

Visual styling (colors, typography, density) remains in [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md):

```text
AgainERP UI = 60% Odoo + 20% Shopify Admin + 10% Notion + 10% Linear
```

This document defines **structure and behavior**; ENTERPRISE_UI defines **look and feel**.

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 07 — workspace shell architecture SSOT |

---

**Workspace Shell Architecture** — one shell, every module, zero custom frames.
