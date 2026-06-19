# AgainERP — Workspace Shell UI Blueprint

> **Status:** Active — **workspace shell UI SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 11 — Workspace Shell UI Design  
> **Governance:** [FINAL_UI_ARCHITECTURE_LOCK.md](../../FINAL_UI_ARCHITECTURE_LOCK.md) — APPROVED  
> **Architecture:** [WORKSPACE_SHELL_ARCHITECTURE.md](./WORKSPACE_SHELL_ARCHITECTURE.md) — structure SSOT

**Documentation only.** No mockups · No Figma specs · No implementation code.

---

## Purpose

Define the **official Workspace Shell UI blueprint** — zone layout, component placement, interaction rules, and responsive behaviour for the single AgainERP admin shell (`app/(admin)/`).

Modules render **content slots only** inside this frame. This blueprint is the reference for UI prototype design (Phase A per [UI_READINESS_REPORT.md](../../UI_READINESS_REPORT.md)).

## When To Read

Read before designing or building any workspace shell prototype, or before adding module content that interacts with shell zones.

## Authority

| Layer | Document | Scope |
|-------|----------|-------|
| Governance | FINAL_UI_ARCHITECTURE_LOCK | Locked rules · prohibitions |
| Structure | WORKSPACE_SHELL_ARCHITECTURE | Zones · components · behaviour |
| **UI blueprint** | **This document** | Placement · interactions · responsive UI |

On conflict: FINAL_UI_ARCHITECTURE_LOCK wins.

---

## 1. Layout Zones

The workspace shell divides the viewport into **six fixed zones**. Modules never duplicate these zones.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ZONE A — GLOBAL HEADER (56px · sticky · z-index 50)                          │
├──────────┬───────────────────────────────────────────────────┬───────────────┤
│ ZONE C   │ ZONE B — MODULE NAV (48px · sticky · z-index 10–20)                 │
│ LEFT     ├───────────────────────────────────────────────────┤ ZONE E        │
│ SIDEBAR  │ ZONE D — MAIN CONTENT AREA (flex-grow)            │ RIGHT UTILITY │
│ 240/64px │                                                   │ 320px / hidden│
│ z-index 40│ Module pages render here only                    │ z-index 65   │
├──────────┴───────────────────────────────────────────────────┴───────────────┤
│ ZONE F — BOTTOM NAV (mobile only · 56px + safe-area)                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

| Zone | ID | Owner | Module access |
|------|-----|-------|---------------|
| **A** Global Header | `WS-HEADER-*` | Platform | Register actions only |
| **B** Module Nav | `WS-MODNAV-*` | Platform shell · module registers tabs | Tab labels + routes via manifest |
| **C** Left Sidebar | `WS-SIDE-*` | Platform · module registers menu items | Menu entries via ModuleManifest |
| **D** Main Content | `WS-CONTENT-*` | Module view bodies | Primary render target |
| **E** Right Utility | `WS-CONTEXT-*` | Platform · module configures tabs | Chatter · related types in UI.md |
| **F** Bottom Nav | `WS-MOBILE-*` | Platform | Optional module slot overrides |

**Layout ID:** `LAYOUT-WORKSPACE` — modules declare `zones_used: D · B` (minimum) in Menus specs.

---

## 2. Global Header (Zone A)

Fixed top bar — **56px** height, sticky on scroll, present on every admin screen.

### 2.1 Component placement (left → right)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Logo] [Workspace Switcher] [──── Global Search ────] [+] [✨] [🔔] [Avatar] │
└──────────────────────────────────────────────────────────────────────────────┘
   │         │                      │                  │   │    │      │
   │         │                      │                  │   │    │      └── WS-HEADER-USER
   │         │                      │                  │   │    └── WS-HEADER-NOTIFY
   │         │                      │                  │   └── WS-HEADER-AI
   │         │                      │                  └── WS-HEADER-QUICK
   │         │                      └── WS-HEADER-SEARCH
   │         └── WS-HEADER-WORKSPACE
   └── Logo → home / default dashboard
```

| Component | Registry ID | Placement | Primary interaction |
|-----------|---------------|-----------|---------------------|
| **Logo** | (shell) | Far left | Navigate to user default dashboard or `/home` |
| **Workspace Switcher** | `WS-HEADER-WORKSPACE` | Left cluster | Dropdown: company · branch · warehouse · context label |
| **Global Search** | `WS-HEADER-SEARCH` | Center-left, flex-grow | Opens `DS-COMMAND-PALETTE` — `Ctrl+K` / `Cmd+K` |
| **Quick Actions** | `WS-HEADER-QUICK` | Right cluster | `+` dropdown — manifest-driven creates |
| **AI Assistant** | `WS-HEADER-AI` | Right cluster | Toggles Zone E AI tab — `Ctrl+J` / `Cmd+J` |
| **Notifications** | `WS-HEADER-NOTIFY` | Right cluster | Bell + unread badge → dropdown or inbox route |
| **User Menu** | `WS-HEADER-USER` | Far right | Avatar ▾: profile · preferences · theme · language · sign out |

### 2.2 Workspace Switcher — UI behaviour

**Context chain:** Tenant → Company → Branch (optional) → Warehouse (optional)

| State | UI |
|-------|-----|
| Multi-company user | Full dropdown with company list + branch sub-select |
| Single-company tenant | Static label — company name only, no dropdown |
| Context label | Truncate with tooltip on narrow header |
| Switch action | Reload list/dashboard data in Zone D — **route unchanged** |
| Unsaved forms | Confirm dialog before context switch |

Mandatory context fields propagate to all Zone D views: `workspace_id` · `company_id` · `branch_id` · `currency` · `language` · `timezone` · `fiscal_year`.

### 2.3 Global Search — UI behaviour

Single entry point for search and command palette (Linear-style).

| Trigger | Action |
|---------|--------|
| Click search field | Open centered overlay (`DS-COMMAND-PALETTE`, z-index 80) |
| `Ctrl+K` / `Cmd+K` | Same overlay |
| Mobile Search (Zone F) | Full-screen palette |

**Palette sections (top → bottom):** Recent · Actions · Navigation · Records · AI

### 2.4 Quick Actions — UI behaviour

| Property | Rule |
|----------|------|
| Trigger | `+` icon button |
| Menu | Grouped by module layer — max 12 visible, then "More in search" |
| Action | Navigate to list route + `?create=1` drawer |
| Permission | Hidden entries only — never disabled rows |
| Mobile | Hidden in header — available via bottom nav Create slot |

### 2.5 AI Assistant — UI behaviour

| Trigger | Result |
|---------|--------|
| Header ✨ click | Zone E opens on **AI** tab (`WS-CONTEXT-AI`) |
| `Ctrl+J` / `Cmd+J` | Toggle same panel |
| AI module off | Control hidden — no broken placeholder |

Uses `DS-AI-PANEL` component family — modules must not build custom header AI chrome.

### 2.6 Notifications — UI behaviour

| Element | Rule |
|---------|------|
| Badge | Unread count on bell — max display "99+" |
| Panel | Dropdown below bell on desktop · full route on mobile |
| Item click | Navigate to related record or approval screen |
| Empty | "No new notifications" — no illustration required in dropdown |

### 2.7 User Menu — UI behaviour

| Item | Action |
|------|--------|
| Profile | User profile settings |
| Preferences | User-level prefs |
| Theme | Light / dark / system |
| Language | Locale switch — re-render labels |
| Sign out | End session → login |

---

## 3. Left Sidebar (Zone C)

Primary **module discovery** navigation.

### 3.1 Dimensions and states

| State | Width | Content |
|-------|-------|---------|
| **Expanded** | 240px | Icon + label + optional badge |
| **Collapsed** | 64px | Icon only + tooltip on hover/focus |

Toggle: `WS-SIDE-COLLAPSE` — persists in user preferences.

### 3.2 Section order (top → bottom)

| Section | Registry ID | Contents |
|---------|-------------|----------|
| **Favorites** | `WS-SIDE-FAV` | User-starred screens |
| **Recent** | (inline under Favorites or separate block) | Last visited screens — max 10 |
| **Core Modules** | `WS-SIDE-CORE` | Platform capabilities — Contacts · Users · Workflow · Documents |
| **Business Modules** | `WS-SIDE-BIZ` | ERP + Commerce installables |
| **Industry Apps** | `WS-SIDE-IND` | Vertical packages — hidden when none installed |
| **Administration** | `WS-SIDE-ADMIN` | SaaS · tenants · modules · audit · system |

Empty sections are **hidden**. Sections are collapsible accordion groups.

### 3.3 Sidebar capabilities

| Feature | ID | UI behaviour |
|---------|-----|--------------|
| Collapse / expand | `WS-SIDE-COLLAPSE` | Chevron at sidebar footer or header edge |
| Pin | `WS-SIDE-PIN` | Pin icon on item hover — moves to top of section |
| Search | `WS-SIDE-SEARCH` | Filter input at top of sidebar — filters entire tree |
| RBAC | — | Items without permission **omitted** — not grayed out |
| Badges | — | Count pills on menu items (e.g. open orders) |

### 3.4 Module selection interaction

When user selects a module item:

```text
1. Set active module context (route prefix · manifest · permissions)
2. Show Zone B module nav tabs for that module
3. Navigate to module Dashboard unless user clicked a specific leaf
4. Highlight active module in sidebar
```

---

## 4. Module Navigation Layer (Zone B)

Horizontal strip below Zone A, above Zone D — **48px** height, sticky.

| Tab | ID | Visible when |
|-----|-----|--------------|
| Dashboard | `WS-MODNAV-DASH` | Always (module home) |
| Operations | `WS-MODNAV-OPS` | Module has transactional screens |
| Reports | `WS-MODNAV-RPT` | Module has reports |
| Automation | `WS-MODNAV-AUTO` | Module has workflow or AI automation |
| Configuration | `WS-MODNAV-SET` | Module has settings — label may read "Settings" |

**Rule:** Hide empty tabs. Operations submenu appears in sidebar flyout or nested list when Operations tab is active.

---

## 5. Main Content Area (Zone D)

Central flex-grow region. **Only zone where modules render view bodies.**

### 5.1 Content chrome (shell-owned — always present)

```text
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumb row                                              │
│ Page header — title · status badge · actions                │
│ Optional: filter bar · view switcher · module tabs          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ VIEW BODY (module slot)                                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Optional: pagination footer                                 │
└─────────────────────────────────────────────────────────────┘
```

Modules must not replace breadcrumb or page header chrome — they supply **title, actions, and body content** only.

### 5.2 Supported view types

| View | Registry ID | Layout ID | CRUD pattern |
|------|-------------|-----------|--------------|
| **Dashboard** | `WS-CONTENT-DASH` | `LAYOUT-DASHBOARD` | Widget grid — engine-owned |
| **List View** | `WS-CONTENT-LIST` | `LAYOUT-LIST` | Table/card list + right drawer |
| **Record View** | `WS-CONTENT-DETAIL` | `LAYOUT-DETAILS` | Drawer `?view=` or full page |
| **Reports** | `WS-CONTENT-ANALYTICS` | `LAYOUT-ANALYTICS` | Charts + filter bar + drill-down table |
| Form (settings) | `WS-CONTENT-FORM` | `LAYOUT-SETTINGS` | Full page or drawer |
| Kanban | `WS-CONTENT-KANBAN` | `LAYOUT-LIST` variant | Card click → drawer |
| Calendar | `WS-CONTENT-CAL` | — | Event click → drawer |

### 5.3 List + Record View interaction (locked)

```text
List route:     /{module}/{entity}
Create:         ?create=1   → right Sheet drawer (desktop) · full-screen (mobile)
View record:    ?view={id}  → same drawer, read-only
Edit record:    ?edit={id}  → same drawer, form mode

❌ Forbidden: /new · /[id]/edit
```

| Property | Desktop | Mobile |
|----------|---------|--------|
| Drawer width | 480px default · 640px complex | 100vw full-screen sheet |
| List visibility | List remains mounted behind drawer | List hidden under sheet |
| z-index | 70 | 70 |

Reference pattern: `/catalog/products`

### 5.4 Dashboard view

| Element | Owner |
|---------|-------|
| Widget grid (12-column) | Platform dashboard engine |
| Widget chrome | Platform |
| Widget data | Module API |
| Customize / date filter | Shell page header actions |

Modules **must not** ship custom dashboard shell layout.

### 5.5 Reports view

| Element | Placement |
|---------|-----------|
| Report title + date range | Page header |
| Dimension filters | Filter bar below header |
| Chart grid | View body — 1 col mobile · 2 col desktop |
| Drill-down table | Below charts — optional |

### 5.6 View switcher (optional)

When module supports multiple layouts for same entity set, page header exposes:

```text
[List | Kanban | Calendar | Map]
```

Toggle updates view body only — route namespace unchanged.

### 5.7 Loading and empty states in Zone D

| State | Component |
|-------|-----------|
| Initial page load | `DS-LOADING-PAGE` — skeleton in Zone D only; shell zones stay visible |
| List empty | `DS-EMPTY-*` centered in table/card area |
| Widget loading | `DS-SKELETON-CARD` per widget |

---

## 6. Right Utility Panel (Zone E)

Optional third column — contextual tools alongside Zone D.

### 6.1 Dimensions and states

| State | Width | Visibility |
|-------|-------|------------|
| **Hidden** | 0 | Default on list views and dashboards |
| **Expanded** | 320px | Default on detail/form views (desktop ≥1280px) |
| **Collapsed** | Icon rail (~48px) | Tablet — tap icon to expand overlay |

z-index: **65** (context drawer tier — below CRUD drawer at 70).

### 6.2 Tabs (top → bottom priority)

| Tab | Registry ID | Content |
|-----|-------------|---------|
| **AI Assistant** | `WS-CONTEXT-AI` | `DS-AI-PANEL` — chat · suggestions · context bar |
| **Activity Feed** | `WS-CONTEXT-ACTIVITY` | Chatter — notes · comments · attachments · timeline |
| **Record Context** | `WS-CONTEXT-RELATED` | Related records across modules |

Tab bar at top of panel. One tab active at a time.

### 6.3 Default visibility by page type

| Page type | Desktop (≥1280px) | Tablet (768–1279px) | Mobile (<768px) |
|-----------|-------------------|---------------------|-----------------|
| List view | Hidden | Collapsed rail | Hidden |
| Record / form view | Expanded (Activity default) | Bottom sheet | Full-screen sheet |
| Dashboard | Hidden | Hidden | Hidden |
| AI-focused task | Expanded (AI tab) | Expanded overlay | Full-screen sheet |

### 6.4 Interaction rules

| Rule | Detail |
|------|--------|
| Header AI button ↔ AI tab | Shared session state — toggle same panel |
| CRUD drawer + utility panel | May coexist on desktop wide screens |
| Mobile | **One overlay at a time** — CRUD drawer OR context sheet, not both |
| Activity feed | Core chatter — modules add tabs in UI.md, do not rebuild |
| Related records | Loaded via module services — UUID refs only |
| Close | × button · Escape · collapse to hidden |

### 6.5 Record Context tab

Shows linked entities for active record (when `?view=` or full-page detail):

| Element | Example |
|---------|---------|
| Related list | Orders for this customer |
| Quick link | Opens target list filtered or drawer `?view=` |
| Empty | `DS-EMPTY-NO-RECORDS` — "No related {entity}" |

---

## 7. Mobile Layout (Zone F + Drawers)

Mobile-first — design at **375px**.

### 7.1 Bottom Navigation (Zone F)

Fixed bottom bar — **56px** + safe-area inset. Max **5** slots.

**Default slots:**

| Slot | Icon | Action |
|------|------|--------|
| Home | House | Active module dashboard |
| Search | Magnifier | Full-screen command palette |
| Create | `+` | Quick Actions menu (replaces header `+`) |
| Notifications | Bell | Notification inbox |
| More | Menu | Opens navigation drawer (full sidebar) |

Module may override slots when user is deep in one module (e.g. Ecommerce: Dashboard · Catalog · Orders · More).

### 7.2 Drawer Navigation

| Drawer | Trigger | Contents | Width |
|--------|---------|----------|-------|
| **Navigation drawer** | Hamburger · More tab | Full Zone C sidebar sections | 100vw |
| **Module drawer** | Operations overflow | Module operational menu tree | 100vw or 280px |
| **Context drawer** | AI FAB · activity icon | Zone E tabs | 100vw |
| **CRUD drawer** | Row tap · `?create=` | Create/view/edit form | 100vw |

Navigation drawer slides from **left**. CRUD and context drawers slide from **right** or full-screen.

### 7.3 Mobile header simplification

| Element | Mobile (<768px) |
|---------|-----------------|
| Logo | Visible — compact |
| Workspace Switcher | Visible — truncated label |
| Global Search | Icon only → opens full-screen palette |
| Quick Actions | **Hidden** — use bottom Create |
| AI | Visible — icon |
| Notifications | Bottom nav slot OR header icon |
| User Menu | Avatar only |
| Zone C sidebar | **Hidden** — navigation drawer only |
| Zone E panel | **Hidden** — context drawer only |

---

## 8. Interaction Rules (Global)

### 8.1 Focus and keyboard

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `Cmd+K` | Open command palette |
| `Ctrl+J` / `Cmd+J` | Toggle AI utility panel |
| `Escape` | Close topmost overlay (palette → drawer → context) |
| `Tab` | Logical order within active zone |
| Focus trap | Active in command palette · CRUD drawer · modals |

### 8.2 Overlay stacking (z-index)

```text
Base content (0) → Sticky nav (10–20) → Sidebar (40) → Header (50)
→ Dropdown/popover (60) → Context panel (65) → CRUD drawer (70)
→ Command palette (80) → Toast (90)
```

Only **one blocking overlay** on mobile at a time.

### 8.3 Permission UI

| Rule | UI |
|------|-----|
| No permission | Hide menu item · hide action · hide quick action |
| Module not licensed | Entire sidebar section hidden |
| Never | Show disabled/greyed primary actions for forbidden operations |

### 8.4 Context switch

| Event | Zone D behaviour |
|-------|------------------|
| Company / branch switch | Reload data · keep route |
| Language switch | Re-render labels · no data reload |
| Fiscal year switch | Reload dashboard/analytics widgets |

### 8.5 Graceful module hide

Disabled or unlicensed modules: sidebar entries hidden · routes skipped · shell layout unchanged · no error chrome.

---

## 9. Responsive Behaviour

### 9.1 Breakpoint matrix

| Breakpoint | Zone A | Zone C | Zone B | Zone D | Zone E | Zone F |
|------------|--------|--------|--------|--------|--------|--------|
| **< 768px** (mobile) | Compact header | Drawer | Scroll tabs | Full width | Sheet | Visible |
| **768–1023px** (tablet) | Full header | Overlay drawer | Tab bar | Flex | Collapsed rail / sheet | Optional |
| **1024–1279px** (desktop) | Full header | Fixed 64/240px | Tab bar | Flex | Collapsed default | Hidden |
| **≥ 1280px** (wide) | Full header | Fixed expanded | Tab bar + ops menu | Flex | Expanded on detail | Hidden |

### 9.2 Content area responsive rules

| Pattern | Mobile | Desktop |
|---------|--------|---------|
| List view | `DS-CARD-LIST` | `DS-DATAGRID` |
| CRUD | Full-screen drawer | 480–640px right drawer |
| Dashboard | Single column widget stack | Multi-column 12-grid |
| Reports | Single column charts | Two-column chart grid |
| Page padding | 16px | 24px |
| Tap targets | 44×44px minimum | 40px default controls |

### 9.3 Content priority when space constrained

Hide in order:

```text
1. Zone E utility panel → icon trigger
2. Secondary table columns → column picker
3. Module nav labels → icons only
4. Breadcrumb middle segments → ellipsis
5. Inline help → tooltip
```

Never hide: primary action · record title · status · save/cancel.

### 9.4 Sidebar responsive transitions

| Transition | Animation |
|------------|-----------|
| Expand ↔ collapse | 200ms ease-out — `--duration-normal` |
| Navigation drawer open | Slide from left + backdrop |
| Context / CRUD sheet | Slide from right · full-screen on mobile |

Respect `prefers-reduced-motion` — instant transition when set.

---

## 10. Module Integration Summary

Modules **register** shell interactions — they do not implement shell UI.

| Registration | Provides to shell |
|--------------|-------------------|
| `ModuleManifest.md` | Sidebar items · quick actions · commands |
| `UI.md` | Module nav tabs · context panel tabs · routes |
| `Permissions.md` | RBAC keys for visibility |
| Menus specs | Zone D view bodies · drawer params · empty/loading |

**Prohibited:** Custom header · custom sidebar · custom dashboard grid shell · alternate CRUD routes.

---

## 11. Prototype Build Order

Recommended sequence for workspace shell UI prototype:

```text
1. Zone A — header cluster (static chrome + interaction stubs)
2. Zone C — sidebar sections (expanded/collapsed states)
3. Zone B — module nav tabs (one sample module)
4. Zone D — placeholder list + drawer CRUD (/catalog/products pattern)
5. Zone E — utility panel tabs (AI · activity · related)
6. Zone F — bottom nav + mobile drawers
7. Command palette overlay (Ctrl+K)
8. Context switcher behaviour (mock company switch)
```

Each step must use semantic design tokens and `WS-*` / `DS-*` IDs from the locked architecture.

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 11 — workspace shell UI blueprint |

---

**Workspace Shell UI Blueprint** — six zones · one shell · prototype-ready.
