# AgainERP — Navigation UI Blueprint

> **Status:** Active — **navigation UI SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 12 — Navigation UI Design  
> **Governance:** [FINAL_UI_ARCHITECTURE_LOCK.md](../../FINAL_UI_ARCHITECTURE_LOCK.md) — APPROVED  
> **Architecture:** [NAVIGATION_ARCHITECTURE.md](./NAVIGATION_ARCHITECTURE.md) — navigation SSOT

**Documentation only.** No mockups · No Figma specs · No implementation code.

---

## Purpose

Define the **official Navigation UI blueprint** — global menu structure, sidebar states, module tabs, breadcrumbs, search, quick actions, and mobile navigation. Implements the four-level navigation model inside the workspace shell.

## When To Read

Read before navigation UI prototype design (Phase B per [UI_READINESS_REPORT.md](../../UI_READINESS_REPORT.md)) or before documenting module menus in `UI.md`.

## Authority

| Layer | Document | Scope |
|-------|----------|-------|
| Governance | FINAL_UI_ARCHITECTURE_LOCK | Locked interactions · RBAC · CRUD |
| Navigation logic | NAVIGATION_ARCHITECTURE | Four levels · groups · registration |
| **Navigation UI** | **This document** | Layout · components · behaviour |

On conflict: FINAL_UI_ARCHITECTURE_LOCK wins.

---

## 1. Navigation Layout

AgainERP navigation spans **four levels** mapped to shell zones:

```text
Level 1  GLOBAL NAVIGATION      Zone C — Left Sidebar (groups + modules)
Level 2  MODULE NAVIGATION      Zone B — Module Nav Layer (tabs)
Level 3  FEATURE NAVIGATION     Zone C ops menu + Zone D chrome
Level 4  RECORD NAVIGATION      Zone D body + drawer (?view= · ?edit=)
```

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ZONE A — Header: Search · Quick Actions · AI (cross-level shortcuts)         │
├──────────┬───────────────────────────────────────────────────────────────────┤
│ LEVEL 1  │ LEVEL 2 — Module tabs: Dashboard · Operations · Reports · …       │
│ Sidebar  ├───────────────────────────────────────────────────────────────────┤
│ groups   │ Breadcrumb (Level 1→3→4 trail)                                    │
│ + modules│ Page header (Level 3 feature title + actions)                       │
│          ├───────────────────────────────────────────────────────────────────┤
│ LEVEL 3  │ LEVEL 4 — List · drawer · record tabs                             │
│ ops menu │ (when Operations active)                                          │
├──────────┴───────────────────────────────────────────────────────────────────┤
│ ZONE F — Mobile: Bottom Nav · Navigation Drawer                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Deep-link rule:** User may land on Level 3 or 4 URL directly; shell reconstructs Level 1–2 highlight from route + manifest.

---

## 2. Global Navigation (Level 1)

Ten **sidebar groups** in fixed display order. Empty groups are hidden.

| Order | Group | Nav ID | Contents |
|-------|-------|--------|----------|
| 1 | **Favorites** | `nav.favorites` | User-starred modules and Level 3 screens |
| 2 | **Recent** | `nav.recent` | Last 15 visited Level 3+ destinations |
| 3 | **Core Platform** | `nav.core-platform` | Contacts · Users · Workflow · Documents · Settings |
| 4 | **Business Operations** | `nav.business-ops` | CRM · Sales · Purchase · Inventory · Finance · Accounting · Manufacturing · POS |
| 5 | **Commerce** | `nav.commerce` | Ecommerce · Catalog · Orders · Storefront ops |
| 6 | **Marketing** | `nav.marketing` | Campaigns · Email · Loyalty · Coupons |
| 7 | **Human Resources** | `nav.human-resources` | HR · Payroll · Attendance · Recruitment |
| 8 | **Productivity** | `nav.productivity` | Projects · Helpdesk · Knowledge · Documents |
| 9 | **Industry Apps** | `nav.industry-apps` | Hospital · Retail · Restaurant · vertical packages |
| 10 | **Administration** | `nav.administration` | Tenants · Modules · Audit · System · SaaS billing |

### 2.1 Group UI rules

| Rule | Detail |
|------|--------|
| Section header | Uppercase or small-caps label — collapsible chevron |
| Module item | Icon + label + optional badge count |
| Nesting | One level of children under module root (Level 3 preview) optional |
| Empty group | Entire section omitted — no "No modules" placeholder |
| Plan gate | Unlicensed modules hidden — section may shrink or hide |
| Active module | Background `--color-primary-subtle` + left accent bar |

### 2.2 Favorites behaviour

| Action | UI result |
|--------|-----------|
| Star any Level 3 screen | Item appears in Favorites group |
| Unstar | Removed from Favorites |
| Reorder | Drag handle when expanded (desktop) |
| Pin module | Module root pinned to top of its group via `WS-SIDE-PIN` |
| Empty favorites | Section hidden or single line "Star screens to pin them here" |

### 2.3 Recent behaviour

| Rule | Detail |
|------|--------|
| Capacity | Max **15** items — FIFO eviction |
| Item label | Screen title + module context |
| Clear | "Clear recent" in section overflow menu |
| Deep link | Click restores full route including drawer params |

---

## 3. Sidebar UI (Level 1 container)

Registry prefix: `WS-SIDE-*` · Shell zone: **C**

### 3.1 States

| State | Width | Label visibility | Use |
|-------|-------|------------------|-----|
| **Expanded** | **240px** | Icon + text + badges | Default desktop ≥1024px |
| **Collapsed** | **64px** | Icon only | User toggle · tablet default |
| **Hover expanded** | **240px** overlay | Icon + text (temporary) | Collapsed mode — hover or focus on sidebar rail expands flyout without pushing content |
| **Mobile drawer** | **100vw** (max 320px) | Full labels | `<768px` — slides from left |

### 3.2 Collapse behaviour

| Trigger | Behaviour |
|---------|-----------|
| `WS-SIDE-COLLAPSE` toggle | Persist preference — expanded ↔ collapsed |
| Hover expanded | On collapsed: mouse enter sidebar rail → overlay 240px; leave → collapse after 300ms delay |
| Keyboard | Focus on sidebar → `Enter` expand section · `[` toggle collapse (optional) |
| Content reflow | Zone D expands when sidebar collapses — no horizontal scroll on shell |
| Mobile | No collapsed rail — drawer only |

### 3.3 Search behaviour (`WS-SIDE-SEARCH`)

| Property | Rule |
|----------|------|
| Placement | Top of sidebar — below logo area when expanded; icon in collapsed hover state |
| Input | Filter sidebar tree by keyword — modules + Level 3 items |
| Debounce | 200ms |
| No results | "No matching menus" inline |
| Scope | Navigation items only — not records (records via header Global Search) |
| Clear | × clears filter · restores full tree |
| Keyboard | `/` focuses sidebar search when focus not in input (optional, secondary to `Ctrl+K`) |

### 3.4 Favourites in sidebar

Favorites group always **first** when non-empty. Star icon on hover for any navigable item in tree.

---

## 4. Module Navigation (Level 2)

Every installable module exposes up to **five standard zones** as horizontal tabs in **Zone B** (48px sticky strip).

| Tab | Nav ID | UI label | Route pattern | Hide when |
|-----|--------|----------|---------------|-----------|
| **Dashboard** | `modnav.dashboard` | Dashboard | `/{module}/dashboard` | Never |
| **Operations** | `modnav.operations` | Operations | `/{module}/{area}/…` | No transactional screens |
| **Reports** | `modnav.reports` | Reports | `/{module}/reports` | No reports |
| **Automation** | `modnav.automation` | Automation | `/{module}/automation` or workflows | No automation |
| **Settings** | `modnav.configuration` | **Settings** (display) | `/{module}/settings` | No configurable options |

**Note:** Architecture ID is `modnav.configuration`; UI label reads **Settings** per module convention. Route `/settings` remains valid.

Registry prefix: `WS-MODNAV-*`

### 4.1 Navigation placement rules

| Rule | Detail |
|------|--------|
| Position | Directly below Zone A header — full width of content column (between sidebar and utility panel) |
| Active tab | Underline or pill `--color-primary` |
| Operations active | Level 3 feature tree shown in sidebar ops section or flyout |
| Tab overflow | Horizontal scroll on tablet/mobile — no wrap |
| Hidden tabs | Omitted entirely — no disabled tabs |
| Module switch | Changing Level 1 module resets Level 2 to Dashboard unless deep-linked |
| URL sync | Active tab derived from route prefix — bookmarkable |

### 4.2 Level 3 under Operations

When **Operations** tab is active, sidebar shows module feature tree:

```text
CRM Operations example:
  Leads · Opportunities · Pipeline · Activities · Contacts

Commerce Operations example:
  Catalog · Orders · Customers · Inventory · Marketing · SEO · Builder
```

Selecting Level 3 item updates Zone D — Level 2 tab stays on Operations.

---

## 5. Breadcrumb UI (Levels 1→3→4 trail)

Breadcrumb row sits at top of **Zone D** content chrome — above page header.

### 5.1 Display rules

| Segment | Source | Clickable |
|---------|--------|-----------|
| Module name | Active module | Yes → module Dashboard |
| Feature / entity list | Level 3 screen | Yes → list route without drawer params |
| Record title | Level 4 when drawer open | Current segment — not linked or links to `?view=` |
| Drawer mode | Append "New {entity}" or record name | Reflects `?create=` · `?view=` · `?edit=` |

### 5.2 Examples

**Sales → Orders → Order Details**

```text
Sales  ›  Orders  ›  Order #1042
  │         │            └── current (view drawer open)
  │         └── /sales/orders
  └── /sales/dashboard
```

**CRM → Leads → Lead Details**

```text
CRM  ›  Leads  ›  Acme Corp Lead
  │       │           └── current (?view=uuid)
  │       └── /crm/leads
  └── /crm/dashboard
```

**Create mode**

```text
Catalog  ›  Products  ›  New Product
                              └── ?create=1 — current
```

### 5.3 Overflow rules

| Condition | UI |
|-----------|-----|
| Segments ≤ 4 | Show all |
| Segments > 4 | Collapse middle: `Module › … › Parent › Current` |
| Long labels | Truncate segment with ellipsis — full text in `title` tooltip |
| Max width | Breadcrumb never wraps to second line — truncate from left-middle |

### 5.4 Mobile behaviour

| Viewport | Behaviour |
|----------|-----------|
| `<768px` | Show **back chevron** + current page title only; full trail in long-press or overflow |
| Back chevron | Navigates to parent segment (list route closes drawer) |
| Drawer open | Title shows record name; back closes drawer first, second back goes to list |

---

## 6. Search UI

Three search surfaces share one registry — different entry points.

### 6.1 Global Search (`WS-HEADER-SEARCH`)

| Property | Value |
|----------|-------|
| Placement | Zone A header — flex-grow center-left |
| Trigger | Click field · `Ctrl+K` / `Cmd+K` |
| Component | `DS-COMMAND-PALETTE` |
| z-index | 80 |

### 6.2 Command Palette

| Property | Value |
|----------|-------|
| Width | 560px centered desktop · 100vw mobile |
| Input | Single search field — "Type a command or search…" |
| Footer hint | `↑↓ navigate · Enter select · Esc close` |

**Result grouping (top → bottom):**

| Group | Priority | Contents |
|-------|----------|----------|
| **Recent** | 0 (empty query) | Last commands + records |
| **Actions** | 1 | Create · Run report · Run AI action |
| **Navigation** | 2 | Jump to module screen |
| **Records** | 3 | Entity matches |
| **AI** | 4 | Ask AI · suggested prompts |
| **Help** | 5 | Docs links (optional) |

Empty groups hidden. Permission-filtered — no disabled rows.

### 6.3 AI Search

| Entry | Flow |
|-------|------|
| Command palette | Type natural language → AI section surfaces intents |
| Header AI (`Ctrl+J`) | Opens utility panel — search can hand off from palette |
| "Ask about…" prefix | Routes query to `DS-AI-PANEL` with navigation tool |

AI resolves utterance → manifest route → client navigation. AI module off: AI group hidden.

### 6.4 Quick Navigation

| Method | Behaviour |
|--------|-----------|
| Command palette record match | Enter → `?view={id}` on entity list route |
| Command palette nav match | Enter → navigate to Level 3 route |
| Sidebar search | Filters Level 1–3 menu items only |
| Recent list | One-click restore full URL |

### 6.5 Interaction flow

```text
User presses Ctrl+K
    → Palette opens (focus in input)
    → User types query
    → Debounce 200ms → ranked results by group
    → ↑↓ highlight row
    → Enter executes:
         Navigation → route push
         Create → route + ?create=1
         Open record → route + ?view=id
         AI → open panel with query
    → Esc closes → return focus to trigger
```

### 6.6 Keyboard shortcuts (locked)

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `Cmd+K` | Open command palette / global search |
| `Ctrl+J` / `Cmd+J` | Toggle AI assistant panel |
| `Esc` | Close palette or topmost overlay |
| `↑` `↓` | Move selection in palette |
| `Enter` | Execute selected command |

---

## 7. Quick Actions UI

Registry: `WS-HEADER-QUICK` · Locked per FINAL_UI_ARCHITECTURE_LOCK.

### 7.1 Header Quick Action Menu

| Property | Rule |
|----------|------|
| Trigger | `+` button in Zone A right cluster |
| Presentation | Dropdown grouped by nav group (Commerce · CRM · HR · …) |
| Max visible | 12 items — overflow "Search for more…" → command palette |
| Action | Navigate to list + `?create=1` |
| Permission | Hidden if user lacks create permission |
| Desktop | Visible in header |
| Mobile `<768px` | **Hidden** — use bottom nav Create slot |

### 7.2 Context Quick Actions

| Context | UI |
|---------|-----|
| Record drawer open | Page header actions — Edit · Duplicate · Delete (permission-gated) |
| List row long-press (mobile) | Context menu — Edit · View · module row actions |
| Dashboard widget | `quick_action` widget category — same routes as header |
| Related records panel | "+ Add related" where supported |

### 7.3 Module Quick Actions

Registered in `ModuleManifest.md` → `quickActions[]`:

| Example | Route |
|---------|-------|
| Create Lead | `/crm/leads?create=1` |
| Create Product | `/catalog/products?create=1` |
| Create Order | `/orders?create=1` |
| Create Invoice | `/accounting/invoices?create=1` |

Mirrored in command palette **Actions** group.

### 7.4 Mobile Quick Actions

| Surface | Behaviour |
|---------|-------------|
| Bottom nav **Create** slot | Opens same grouped menu as header `+` — full-screen sheet on mobile |
| FAB on list (optional) | Primary entity create — same `?create=1` route |
| Command palette | Primary create entry when header `+` hidden |

---

## 8. Mobile Navigation

Registry prefix: `WS-MOBILE-*` · Zone **F**

### 8.1 Bottom Navigation

Fixed bar — **56px** + safe-area. **Five slots:**

| Slot | Label | Icon role | Action |
|------|-------|-----------|--------|
| **Home** | Home | House | Active module Dashboard |
| **Search** | Search | Magnifier | Full-screen command palette |
| **AI** | AI | Sparkle | Full-screen AI panel (`DS-AI-PANEL`) |
| **Notifications** | Alerts | Bell | Notification inbox |
| **More** | More | Menu | Opens navigation drawer (Level 1 sidebar) |

Module-specific overrides allowed (e.g. Ecommerce: Dashboard · Catalog · Orders · More).

### 8.2 Drawer behaviour

| Drawer | Trigger | Contents | Animation |
|--------|---------|----------|-----------|
| **Navigation drawer** | More · hamburger | Full Level 1 groups + Favorites + Recent | Slide from left + backdrop |
| **Module drawer** | Operations overflow | Level 3 feature list | Slide from left or bottom sheet |
| **Search sheet** | Search tab | Command palette full-screen | Slide up |
| **AI sheet** | AI tab | AI utility panel | Slide up or full-screen |

**Rule:** One blocking drawer/sheet at a time on mobile.

### 8.3 Module switching (mobile)

```text
1. User opens More → Navigation drawer
2. Selects module in group (e.g. CRM under Business Operations)
3. Drawer closes → navigates to module Dashboard
4. Level 2 tabs appear below header (horizontal scroll)
5. Bottom nav may switch to module-specific slots if configured
6. Recent list updated with new destination
```

Context (company/branch) unchanged — data reloads per workspace context rules.

---

## 9. Navigation Components

| Component | ID | Zone | Level |
|-----------|-----|------|-------|
| Sidebar container | `WS-SIDE-*` | C | 1 |
| Favorites section | `WS-SIDE-FAV` | C | 1 |
| Sidebar search | `WS-SIDE-SEARCH` | C | 1 |
| Collapse toggle | `WS-SIDE-COLLAPSE` | C | 1 |
| Pin item | `WS-SIDE-PIN` | C | 1 |
| Module nav tab | `WS-MODNAV-*` | B | 2 |
| Breadcrumb | `WS-CONTENT-BREADCRUMB` | D | 3–4 |
| Global search trigger | `WS-HEADER-SEARCH` | A | all |
| Command palette | `DS-COMMAND-PALETTE` | overlay | all |
| Quick actions | `WS-HEADER-QUICK` | A | all |
| AI trigger | `WS-HEADER-AI` | A | all |
| Bottom nav item | `WS-MOBILE-NAV-*` | F | all |
| Navigation drawer | `WS-MOBILE-DRAWER-NAV` | overlay | 1 |
| CRUD sheet | `DS-DRAWER-CRUD` | overlay | 4 |

---

## 10. Interaction Rules

### 10.1 RBAC

| Rule | UI |
|------|-----|
| No permission | Menu item **hidden** — not disabled |
| No module license | Group or module hidden |
| No create permission | Quick action omitted |
| Search results | Filtered — forbidden destinations never appear |

### 10.2 Active state

| Element | Active indicator |
|---------|------------------|
| Sidebar module | Background + left border |
| Module tab | Underline / primary pill |
| Level 3 item | Bold or accent dot |
| Breadcrumb current | `--color-text` — non-link |
| Bottom nav slot | Filled icon + label |

### 10.3 Record navigation (Level 4 — locked)

```text
List:     /{module}/{entity}
Create:   ?create=1
View:     ?view={id}
Edit:     ?edit={id}
❌ Forbidden: /new · /[id]/edit
```

Drawer updates breadcrumb last segment. List remains mounted on desktop.

### 10.4 Multi-tenant

| Dimension | Navigation UI |
|-----------|---------------|
| Plan | Hide unlicensed groups/modules |
| Tenant | Single nav tree per session |
| Company/branch | Badges refresh on switch — routes unchanged |
| Industry | Group 9 visible only when packages installed |

### 10.5 AI-first navigation

AI agents use same manifest registry as UI. Navigation from AI opens same routes — no parallel URL scheme.

---

## 11. Responsive Behaviour

| Breakpoint | Level 1 (sidebar) | Level 2 (tabs) | Search | Quick actions | Bottom nav |
|------------|-------------------|----------------|--------|---------------|------------|
| **<768px** | Drawer only | Scroll tabs | Full-screen palette | Bottom Create | Visible |
| **768–1023px** | Overlay drawer · 64px rail | Scroll tabs | Palette modal | Header `+` | Optional |
| **≥1024px** | Fixed 240/64px | Full tab bar | Palette centered | Header `+` | Hidden |
| **≥1280px** | Expanded default | Full tab bar + ops menu | Palette centered | Header `+` | Hidden |

| Pattern | Mobile | Desktop |
|---------|--------|---------|
| Breadcrumb | Back + title | Full trail |
| Sidebar search | Inside nav drawer | Top of sidebar |
| Favorites drag reorder | Long-press reorder | Drag handle |
| Tap targets | 44×44px min | 40px controls |

---

## 12. Module Registration Summary

| Level | Declared in |
|-------|-------------|
| 1 — Group + module | `ModuleManifest.md` → `globalNav.group` |
| 2 — Module zones | `ModuleManifest.md` → `moduleNav` |
| 3 — Features | `ModuleManifest.md` menus · `UI.md` |
| 4 — Entities | `UI.md` · `Menus/{Screen}.md` |
| Quick actions | `ModuleManifest.md` → `quickActions[]` |
| Commands | `ModuleManifest.md` → `commands[]` |

Modules must not render custom navigation chrome outside Zone B/D contracts.

---

## 13. Prototype Build Order

```text
1. Level 1 sidebar groups (static tree — one sample module per group)
2. Expanded / collapsed / hover-expanded states
3. Favorites + Recent interaction stubs
4. Level 2 module tabs (CRM or Ecommerce sample)
5. Level 3 Operations submenu
6. Breadcrumb row with drawer param sync
7. Command palette (Ctrl+K) with grouped results
8. Header quick actions dropdown
9. Mobile bottom nav + navigation drawer
10. Module switch flow end-to-end
```

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 12 — navigation UI blueprint |

---

**Navigation UI Blueprint** — four levels · ten groups · one registry · prototype-ready.
