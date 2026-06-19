# AgainERP — Workspace Component Registry

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 07 — Workspace Shell Architecture  
> **Authority:** [WORKSPACE_SHELL_ARCHITECTURE.md](./WORKSPACE_SHELL_ARCHITECTURE.md)

---

## Purpose

Registry of **shell-owned UI components** — IDs, zones, behavior, and module integration points. Modules consume shell components; they do not fork them.

## When To Read

Read when naming a shell component, writing a prototype guide, or checking whether a UI element belongs in the platform shell vs module content.

## Related Files

- [WORKSPACE_LAYOUT_MAP.md](./WORKSPACE_LAYOUT_MAP.md) — zone dimensions
- [WORKSPACE_NAVIGATION_RULES.md](./WORKSPACE_NAVIGATION_RULES.md) — menu registration
- [components.md](./components.md) — design system primitives

## Read Next

One component row matching your zone — do not bulk-read entire registry.

---

## Legend

| Column | Meaning |
|--------|---------|
| **ID** | Stable registry identifier |
| **Zone** | A=Header · B=ModNav · C=Sidebar · D=Content · E=Context · F=BottomNav |
| **Owner** | `platform` = shell · `core` = Core engine · `module` = content slot only |
| **Configurable** | Module/tenant can extend |

---

## Global Header (Zone A)

| ID | Component | Owner | Configurable | Behavior |
|----|-----------|-------|--------------|----------|
| `WS-HEADER-LOGO` | App logo | platform | tenant branding | Links to user home dashboard |
| `WS-HEADER-WORKSPACE` | Workspace Switcher | platform | yes | Tenant · company · branch · warehouse context |
| `WS-HEADER-SEARCH` | Global Search input | platform | yes | Opens command palette; `Ctrl+K` |
| `WS-HEADER-SEARCH-PALETTE` | Command Palette | platform | modules register actions | Records · nav · create · AI |
| `WS-HEADER-AI` | AI Assistant trigger | platform | feature flag | Opens context panel AI tab; `Ctrl+J` |
| `WS-HEADER-NOTIFY` | Notifications bell | core | yes | Unread badge; links to notification inbox |
| `WS-HEADER-QUICK` | Quick Actions menu | platform | modules register items | `+` dropdown — global creates |
| `WS-HEADER-USER` | User Menu | core | no | Profile · prefs · theme · language · logout |
| `WS-HEADER-THEME` | Theme switcher | platform | user pref | Inside user menu or standalone |
| `WS-HEADER-LANG` | Language switcher | platform | tenant locales | Inside user menu |
| `WS-HEADER-HAMBURGER` | Mobile menu trigger | platform | no | Opens sidebar drawer (< 1024px) |

---

## Module Navigation Layer (Zone B)

| ID | Component | Owner | Configurable | Behavior |
|----|-----------|-------|--------------|----------|
| `WS-MODNAV-DASH` | Dashboard tab | platform | module hides if empty | Navigates to module dashboard |
| `WS-MODNAV-OPS` | Operations tab | platform | required if transactional | Shows operational submenu |
| `WS-MODNAV-RPT` | Reports tab | platform | module hides if empty | Reports index route |
| `WS-MODNAV-AUTO` | Automation tab | platform | module hides if empty | Automation route |
| `WS-MODNAV-SET` | Configuration tab | platform | module hides if empty | Settings route (`/settings`) |
| `WS-MODNAV-OPS-MENU` | Operations flyout / submenu | module | via ModuleManifest | Entity groups under Operations |
| `WS-MODNAV-BREADCRUMB` | Module context breadcrumb | platform | module segments | Prefix before page breadcrumb |

---

## Left Sidebar (Zone C)

| ID | Component | Owner | Configurable | Behavior |
|----|-----------|-------|--------------|----------|
| `WS-SIDE-COLLAPSE` | Collapse toggle | platform | user pref | 240px ↔ 64px |
| `WS-SIDE-SEARCH` | Sidebar search | platform | no | Filters menu tree |
| `WS-SIDE-FAV` | Favorites section | platform | user items | Starred screens |
| `WS-SIDE-RECENT` | Recent pages | platform | user history | Last 10 visited |
| `WS-SIDE-CORE` | Core Modules section | core | manifest | Contacts · users · workflow · … |
| `WS-SIDE-BIZ` | Business Modules section | platform | manifest + plan | CRM · sales · ecommerce · … |
| `WS-SIDE-IND` | Industry Apps section | platform | manifest + plan | Vertical packages |
| `WS-SIDE-ADMIN` | Administration section | platform | RBAC | SaaS · tenants · audit · system |
| `WS-SIDE-ITEM` | Menu item | module | manifest entry | Icon · label · route · badge |
| `WS-SIDE-PIN` | Pin control | platform | user pref | Pin module/item to section top |
| `WS-SIDE-SECTION` | Collapsible section header | platform | no | Expand/collapse level group |
| `WS-SIDE-BADGE` | Menu badge | module | count API | Numeric or dot indicator |

---

## Workspace Content Area (Zone D)

### D — Chrome (shell-owned)

| ID | Component | Owner | Configurable | Behavior |
|----|-----------|-------|--------------|----------|
| `WS-CONTENT-BREADCRUMB` | Breadcrumb trail | platform | module segments | Home › Module › Screen › Record |
| `WS-CONTENT-PAGE-HDR` | Page header | platform | module title/actions | Title · status · primary buttons |
| `WS-CONTENT-TOOLBAR` | Filter / action toolbar | platform | module filters | Search · filters · view toggle · export |
| `WS-CONTENT-PAGINATION` | Pagination footer | platform | module data | Page size · row count |
| `WS-CONTENT-SHEET` | CRUD Sheet drawer | platform | module form body | Right drawer · query params |
| `WS-CONTENT-VIEW-SWITCH` | View type toggle | module | list/kanban/cal | Header toolbar control |

### D — View bodies (module content slots)

| ID | Component | Owner | Configurable | Behavior |
|----|-----------|-------|--------------|----------|
| `WS-CONTENT-DASH` | Dashboard grid | module | widgets | KPI cards · charts · tables |
| `WS-CONTENT-LIST` | List view | module | columns · filters | Table or card list |
| `WS-CONTENT-DETAIL` | Detail view | module | tabs · smart buttons | Record page layout |
| `WS-CONTENT-FORM` | Form view | module | fields · validation | Create/edit/wizard |
| `WS-CONTENT-KANBAN` | Kanban board | module | stages · cards | Pipeline layout |
| `WS-CONTENT-CAL` | Calendar view | module | events | Month/week/day |
| `WS-CONTENT-ANALYTICS` | Analytics view | module | charts · drill-down | Report dashboards |
| `WS-CONTENT-WIDGET` | Dashboard widget | module | widget registry | Drag · resize · pin |
| `WS-CONTENT-SMART-BTN` | Smart button row | module | manifest | Related action shortcuts |
| `WS-CONTENT-TABS` | Record tabs | module | tab config | Related lists · notes · custom |

---

## Right Context Panel (Zone E)

| ID | Component | Owner | Configurable | Behavior |
|----|-----------|-------|--------------|----------|
| `WS-CONTEXT-PANEL` | Panel container | platform | user pref width | Collapse · expand · hide |
| `WS-CONTEXT-AI` | AI Assistant tab | platform | module context | Chat · tools · suggestions |
| `WS-CONTEXT-ACTIVITY` | Activity Feed tab | core | module tabs | Chatter · timeline |
| `WS-CONTEXT-RELATED` | Related Records tab | module | relation config | Cross-module links via services |
| `WS-CONTEXT-NOTES` | Notes sub-component | core | — | Part of activity |
| `WS-CONTEXT-COMMENTS` | Comments sub-component | core | — | Part of activity |
| `WS-CONTEXT-ATTACH` | Attachments sub-component | core | — | Part of activity |
| `WS-CONTEXT-FAB` | Mobile context FAB | platform | — | Opens sheet on mobile/tablet |

---

## Mobile (Zone F + overlays)

| ID | Component | Owner | Configurable | Behavior |
|----|-----------|-------|--------------|----------|
| `WS-MOBILE-BOTTOMNAV` | Bottom navigation bar | platform | module overrides | 5 slots max |
| `WS-MOBILE-NAV-DRAWER` | Full navigation drawer | platform | — | Sidebar levels |
| `WS-MOBILE-MOD-DRAWER` | Module ops drawer | module | menu tree | Operations menus |
| `WS-MOBILE-CTX-SHEET` | Context full-screen sheet | platform | — | AI · activity · related |
| `WS-MOBILE-SEARCH-SHEET` | Full-screen search | platform | — | Command palette mobile |

---

## Shared / Overlay Components

| ID | Component | Owner | Zone | Behavior |
|----|-----------|-------|------|----------|
| `WS-OVERLAY-MODAL` | Modal dialog | platform | overlay | Confirm · short forms |
| `WS-OVERLAY-TOAST` | Toast notification | platform | overlay | Success · error · info |
| `WS-OVERLAY-SKELETON` | Loading skeleton | platform | D | Perceived performance |
| `WS-OVERLAY-EMPTY` | Empty state | module | D4 | Illustration · CTA |
| `WS-OVERLAY-ERROR` | Error boundary | platform | D | Recoverable errors |

---

## Module Registration Hooks

Modules extend the shell via **registration**, not new shell components.

| Hook | Registry ID target | Declared in |
|------|-------------------|-------------|
| Sidebar menu items | `WS-SIDE-ITEM` | `ModuleManifest.md` |
| Quick create actions | `WS-HEADER-QUICK` | `ModuleManifest.md` |
| Command palette actions | `WS-HEADER-SEARCH-PALETTE` | `ModuleManifest.md` |
| Operations submenu | `WS-MODNAV-OPS-MENU` | `UI.md` |
| Dashboard widgets | `WS-CONTENT-WIDGET` | `UI.md` |
| Related record types | `WS-CONTEXT-RELATED` | `UI.md` |
| Chatter tabs | `WS-CONTENT-TABS` | `UI.md` |
| List columns / filters | `WS-CONTENT-LIST` | `Menus/{Screen}.md` |

---

## Component Ownership Rules

| Rule | Detail |
|------|--------|
| **Shell owns A, B, C, E, F** | Platform team maintains; modules configure |
| **Module owns D4 body** | Content inside view slot only |
| **Core owns chatter** | Activity tab uses Core — modules don't rebuild |
| **No duplicates** | If a component exists here, modules must not reimplement |
| **New shell component** | Requires update to this registry + WORKSPACE_SHELL_ARCHITECTURE |

---

## Phase Rollout

| Phase | Components | Notes |
|-------|------------|-------|
| **P0** | Header · Sidebar · Content chrome · CRUD Sheet · Bottom nav | MVP shell |
| **P1** | Module nav layer · Context panel · Command palette | Full workspace |
| **P2** | Favorites · Pin · Kanban/Calendar views · Related records | Power user |
| **P3** | Saved workspaces · customizable dashboard layouts | Enterprise |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 07 — initial component registry |

---

**Workspace Component Registry** — shell-owned IDs, module content slots, no forked frames.
