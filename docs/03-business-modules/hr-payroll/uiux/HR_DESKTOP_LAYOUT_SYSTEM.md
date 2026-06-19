# HR & Payroll — Desktop Layout System

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll — Desktop Layout Architecture  
> **Document Type:** Layout System Specification  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_DESIGN_SYSTEM_SPECIFICATION.md](../../../04-uiux/design-system/HR_DESIGN_SYSTEM_SPECIFICATION.md) · [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../HR_FIGMA_WIREFRAME_BLUEPRINT.md) · [uiux/HR_DESKTOP_WIREFRAME_EXECUTION_PLAN.md](./HR_DESKTOP_WIREFRAME_EXECUTION_PLAN.md)  
> **Governance:** [layout-architecture.md](../../../04-uiux/standards/layout-architecture.md) · [navigation.md](../../../04-uiux/standards/navigation.md) · [UI_UX_DESIGN_STANDARDS.md](../../../04-uiux/standards/UI_UX_DESIGN_STANDARDS.md) · [PROJECT_COMMON_RULES.md](../../../00-foundation/PROJECT_COMMON_RULES.md)

**No visual design. No color specs. No CSS. No code.**  
Defines the **complete desktop layout system** for AgainERP HR & Payroll — structural zones, measurements, composition rules, and reusable layout patterns. Foundation for wireframes, Figma components, and frontend shell implementation.

---

## Executive Summary

| Property | Value |
|----------|-------|
| **Primary viewport** | Desktop ≥ 1280px (design frame 1440px) |
| **Design formula** | 60% Odoo · 20% Shopify Admin · 10% Notion · 10% Linear |
| **Layout namespace** | `LYT-*` (zones) · `TPL-*` (templates) · `CMP-*` (components) |
| **CRUD pattern** | List in content area + right drawer overlay |
| **Grid** | 12-column dashboard · fluid content · fixed shell chrome |

**Canonical belief:**

> **One shell, many surfaces — every HR screen composes from the same layout primitives.**

---

# Layout Philosophy

### Design formula applied to structure

| Source | Weight | Layout contribution |
|--------|--------|---------------------|
| **Odoo** | 60% | Persistent left sidebar · form view tabs · smart-button header row · chatter/timeline rail · approval on record · dense data tables |
| **Shopify Admin** | 20% | Clean page header hierarchy · filter bar above table · polished empty states · restrained chrome |
| **Notion** | 10% | Section blocks in forms · collapsible groups · calm vertical rhythm · inline labels in read views |
| **Linear** | 10% | Command palette · keyboard-first density · status pills · issue-style list rows · fast scan patterns |

### Structural principles

| # | Principle | Layout rule |
|---|-----------|-------------|
| 1 | **Shell immutability** | Modules never redefine sidebar or topbar |
| 2 | **Content owns scroll** | Sidebar and topbar fixed; main area scrolls |
| 3 | **One elevation-3 surface** | Only one drawer, modal, or AI panel fully open |
| 4 | **Drawer-not-page** | Create/view/edit = overlay on list route |
| 5 | **Zone composability** | Dashboards, profiles, timelines use named zones |
| 6 | **Progressive width** | Narrow forms · wide tables · widest workbench |
| 7 | **Utility rail optional** | Third column only when context adds value |
| 8 | **F-pattern scanning** | KPIs and primary actions upper-left / upper-right |
| 9 | **Exception-first** | Pending queues above analytics on operational surfaces |
| 10 | **AI adjacent** | AI panel docks right — never replaces primary content |

### Desktop vs ESS

| Surface | Shell |
|---------|-------|
| **Admin HR/Payroll** | Full shell: sidebar + topbar + content (+ optional utility) |
| **ESS** | Separate simplified shell — bottom nav on mobile; not covered in depth here (see [ESS_PORTAL_UI_ARCHITECTURE.md](./ESS_PORTAL_UI_ARCHITECTURE.md)) |

---

# Desktop Foundations

### Viewport tiers

| Tier | Width | Shell behavior |
|------|-------|----------------|
| **Desktop** | ≥ 1280px | Full sidebar expanded · standard drawer widths |
| **Wide** | ≥ 1536px | Optional utility rail on profile · content max-width cap |
| **Design frame** | 1440px | Figma default · QA reference |

### Spatial tokens (structural)

| Token | Value | Usage |
|-------|-------|-------|
| `--shell-topbar-h` | 56px | Fixed top bar height |
| `--shell-sidebar-w` | 240px | Expanded sidebar |
| `--shell-sidebar-collapsed-w` | 64px | Icon-only sidebar |
| `--shell-utility-w` | 320px | Right context/chatter rail |
| `--content-padding-x` | 24px | Page horizontal padding |
| `--content-padding-y` | 24px | Page vertical padding |
| `--zone-gap` | 16px | Between dashboard widgets |
| `--section-gap` | 24px | Between form sections |
| `--drawer-default-w` | 560px | Standard drawer |
| `--drawer-wide-w` | 896px | Profile, approval workspace (`max-w-5xl`) |
| `--drawer-workbench-w` | 1152px | Payroll workbench (`max-w-6xl`) |
| `--ai-panel-w` | 400px | Global AI overlay |
| `--modal-sm-w` | 400px | Confirm dialogs |
| `--modal-md-w` | 560px | Standard forms in modal |
| `--modal-lg-w` | 720px | Complex modals |
| `--modal-xl-w` | 896px | Approval action with preview |

### Z-index stack

| Layer | z-index | Examples |
|-------|---------|----------|
| Base content | 0 | Tables, forms |
| Sticky header row | 10 | Table thead, drawer tab bar |
| Sidebar overlay (tablet) | 40 | Mobile drawer nav |
| Topbar | 50 | Global chrome |
| Dropdown / popover | 60 | Filters, menus |
| Drawer / sheet | 70 | CRUD overlays |
| Modal | 80 | Confirm, lock |
| Command palette | 90 | `Ctrl+K` |
| Toast | 100 | Notifications |

**Rule:** Opening drawer dims content (`scrim`); modal dims drawer if stacked (discouraged — prefer single overlay).

### Grid system

| Context | Columns | Gutter | Max width |
|---------|---------|--------|-----------|
| Dashboard | 12 | 16px | Fluid in content area |
| Form sections | 12 (optional 2-col fields) | 16px | 720px effective field column |
| Table | Fluid | — | 100% content width |
| KPI row | 12 | 16px | 3–4 KPIs per row at 1280px |

---

# Application Shell

**Pattern ID:** `LYT-SHELL-001` · **Template:** `TPL/Shell Desktop`

The shell wraps every admin screen. Modules register content only.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ LYT-TOPBAR-001 — Topbar (56px fixed, z-50)                                  │
├──────────┬──────────────────────────────────────────────────┬───────────────┤
│ LYT-SIDEBAR-001 │ LYT-CONTENT-001 — Main content          │ LYT-UTILITY-001│
│ 240px    │ flex-1 · overflow-y auto                     │ 0–320px       │
│ scroll   │ padding 24px                                 │ optional      │
│ z-sidebar│                                              │ z-base        │
└──────────┴──────────────────────────────────────────────────┴───────────────┘
│ Overlays (same viewport): LYT-DRW-* · LYT-MDL-* · LYT-AI-*                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Zone | ID | Scroll | Sticky |
|------|-----|--------|--------|
| Topbar | `LYT-TOPBAR-001` | No | Yes |
| Sidebar | `LYT-SIDEBAR-001` | Independent Y | Yes |
| Content | `LYT-CONTENT-001` | Primary Y | Page header optional |
| Utility | `LYT-UTILITY-001` | Independent Y | Optional |

**Odoo influence:** Three-column mental model (nav · form · chatter)  
**Shopify influence:** Content area breathes — not edge-to-edge tables without padding

---

# Sidebar Layout

**Pattern ID:** `LYT-SIDEBAR-001` · **Component:** `CMP-NAV-SIDEBAR-001`

### Dimensions

| State | Width | Content |
|-------|-------|---------|
| **Expanded** | 240px | Icon + label + optional badge |
| **Collapsed** | 64px | Icon only + tooltip on hover |
| **Hidden** | 0 | < 1280px — hamburger overlay (tablet) |

### Vertical structure

```text
┌──────────────────────┐
│ Module header        │  ← "HR & Payroll" label (expanded only)
├──────────────────────┤
│ Primary nav groups   │  ← Scrollable
│  · Dashboard         │
│  · Employees ▸       │
│  · Attendance        │
│  · Leave             │
│  · Payroll ▸         │
│  · …                 │
├──────────────────────┤
│ Secondary nav        │  ← Reports · Settings · AI Assistant
├──────────────────────┤
│ Collapse toggle      │  ← Bottom pinned
└──────────────────────┘
```

### Nav item anatomy (Linear + Odoo)

| Slot | Spec |
|------|------|
| **Height** | 40px row · 44px touch target ESS |
| **Icon** | 20px · left 16px inset |
| **Label** | Truncate ellipsis |
| **Badge** | Right-aligned count (pending approvals) |
| **Active** | Full-row highlight · not text-only |
| **Expandable group** | Chevron · children indent 16px |

### Behavioral rules

| Rule | Detail |
|------|--------|
| **SR-01** | One module section active — HR & Payroll grouped |
| **SR-02** | Badge on Leave/Approvals when pending > 0 |
| **SR-03** | Collapse state persisted per user |
| **SR-04** | Keyboard: `[` toggle sidebar (Linear) |
| **SR-05** | Module-off: hide nav item — no disabled tease |
| **SR-06** | ESS link in user menu — not sidebar |

**Odoo (60%):** Deep hierarchical tree · module grouping · smart badges  
**Linear (10%):** Compact row density · keyboard collapse

---

# Topbar Layout

**Pattern ID:** `LYT-TOPBAR-001` · **Component:** `CMP-NAV-TOPBAR-001`

### Dimensions

| Property | Value |
|----------|-------|
| Height | 56px fixed |
| Horizontal padding | 16px |
| Item gap | 8px |

### Slot map (left → right)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo] │ [⌘K Search — flex grow max 480px] │ [Co▾][Br▾][+][🔔][📋][✨][🌐][🌙][Avatar▾] │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Slot | Width | Purpose | Source influence |
|------|-------|---------|------------------|
| Logo | 120px | Home link | Shopify — minimal |
| Search | flex · max 480px | Command palette trigger | Linear — `Ctrl+K` |
| Company switcher | auto | Multi-company scope | Odoo |
| Branch switcher | auto | Optional branch | Odoo |
| Quick create | 40px | HR create menu | Shopify |
| Notifications | 40px | Bell + badge | Platform |
| Activities | 40px | Task counter | Odoo |
| AI launcher | 40px | Opens `LYT-AI-PANEL-001` | Platform AI OS |
| Locale / theme | 40px each | i18n · dark mode | Shopify |
| User menu | auto | Profile · ESS · logout | Shopify |

### Behavioral rules

| Rule | Detail |
|------|--------|
| **TB-01** | Search is primary discovery — always visible desktop |
| **TB-02** | Scope switchers hidden if single company/branch |
| **TB-03** | `✨` duplicates `Ctrl+J` AI panel |
| **TB-04** | Breadcrumbs live in **content area**, not topbar |
| **TB-05** | Payroll lock banner: content area Zone A — not topbar |

**Shopify (20%):** Clean right-side utility cluster · no clutter  
**Linear (10%):** Search-centric · keyboard shortcuts annotated

---

# Content Area Layout

**Pattern ID:** `LYT-CONTENT-001` · **Template:** `TPL/Page Standard`

The content area is the composable canvas between sidebar and optional utility rail.

### Vertical anatomy (all list/form/dashboard pages)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ C1 — Breadcrumb row (optional · 32px)                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ C2 — Page header (56–72px)                                                  │
│      Title · status badge · primary actions (max 3 visible)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ C3 — Context bar (optional · 48–56px)                                       │
│      Filters · tabs · view toggle · date range                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ C4 — Primary content (flex-1 · scroll)                                      │
│      Table | Form | Dashboard grid | Calendar | Kanban                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ C5 — Footer (optional · 48px)                                               │
│      Pagination · selection summary · bulk actions                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### C2 Page header (Shopify-primary)

| Element | Position | Rule |
|---------|----------|------|
| **Title** | Left | `text-xl` equivalent — one line truncate |
| **Status badge** | After title | Linear-style pill |
| **Subtitle** | Below title | Optional meta (record count, period) |
| **Primary action** | Right | One filled button |
| **Secondary actions** | Right | Ghost/outline · max 2 |
| **Overflow** | `⋯` menu | 4+ actions |

**Smart buttons (Odoo):** Secondary stat buttons below title on record contexts — e.g. "3 Open Leaves" · "12 Payslips" — open filtered lists.

### C3 Context bar variants

| Variant | Used on | Contents |
|---------|---------|----------|
| **Filter bar** | Lists | Search · filters · saved views · column toggle |
| **Tab bar** | Profile drawer, settings | Horizontal tabs · sticky |
| **View switcher** | Attendance, approvals | Table / Calendar / Kanban |
| **Period selector** | Dashboards, payroll | Date range · period dropdown |

### Content width rules

| Screen type | C4 width behavior |
|-------------|-------------------|
| **List / table** | Full fluid width |
| **Dashboard** | Full fluid · 12-col grid |
| **Form (standalone)** | `max-w-3xl` centered optional |
| **Report** | Full width · filter sidebar 280px |

### Utility rail coupling

| Screen type | Utility rail (`LYT-UTILITY-001`) |
|-------------|----------------------------------|
| List pages | Hidden default |
| Record drawer open | Optional — activity preview |
| Profile drawer ≥ 1536px | Embedded as drawer Zone D — not shell utility |
| Approval workspace | Embedded in drawer |

---

# Dashboard Layout

**Pattern ID:** `LYT-DSH-001` · **Template:** `TPL/Dashboard` · **Zones:** `DSH-A` through `DSH-H`

Reference: [HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md)

### Zone map (desktop ≥ 1280px)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ DSH-A — HEADER (12 col × 1 row unit)                                        │
│ Period · scope chips · refresh · customize toggle                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ DSH-B — KPI ROW (12 col × 2 row units)                                      │
│ [KPI][KPI][KPI][KPI]  — 3 col each default                                  │
├───────────────────────────────────────┬─────────────────────────────────────┤
│ DSH-C — ANALYTICS (8 col)             │ DSH-D — APPROVALS (4 col)         │
│ Charts · heatmaps · trends            │ Pending queue · SLA                 │
├───────────────────────────────────────┴─────────────────────────────────────┤
│ DSH-E — ACTIVITY (6 col)              │ DSH-F — NOTIFICATIONS (6 col)     │
├─────────────────────────────────────────────────────────────────────────────┤
│ DSH-G — AI INSIGHTS (12 col × 2 rows)                                       │
│ [Insight card][Insight card][Insight card]                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ DSH-H — QUICK ACTIONS (12 col × 1 row)                                      │
│ [chip][chip][chip][chip][chip]                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Grid specification

| Property | Value |
|----------|-------|
| Columns | 12 |
| Row unit height | 80px |
| Gutter | 16px |
| Widget min span | 3 col × 2 row |
| Widget max span | 12 col × 4 row |
| Page padding | 24px (inherited from content) |

### Zone priority (viewport shrink order)

| Order | Zone | Rationale |
|-------|------|-----------|
| 1 | B — KPIs | Decision numbers first |
| 2 | D — Approvals | Exception-first |
| 3 | H — Quick actions | Next-step affordances |
| 4 | F — Notifications | Awareness |
| 5 | G — AI insights | Advisory |
| 6 | C — Analytics | Depth on demand |
| 7 | E — Activity | Historical context |

### Dashboard composition rules

| Rule | Detail |
|------|--------|
| **DSH-01** | Max 8 KPIs without scroll |
| **DSH-02** | Banner widgets (`BNR`) span 12 col above B |
| **DSH-03** | D zone max 6 visible rows — scroll inside widget |
| **DSH-04** | G zone max 3 cards per row |
| **DSH-05** | Every KPI clickable → filtered list |
| **DSH-06** | Customize mode: drag handles on widgets (Odoo-style optional layout) |
| **DSH-07** | Widget failure isolated — skeleton/error per widget |

**Odoo (60%):** KPI smart buttons · exception queues · dense stat rows  
**Shopify (20%):** Clean widget chrome · clear headers  
**Linear (10%):** Status-forward KPI labels

---

# KPI Layout

**Pattern ID:** `LYT-KPI-001` · **Component:** `CMP-KPI-CARD-001` · **Widget:** `WGT-*-KPI-*`

### Card anatomy

```text
┌─────────────────────────────┐
│ LABEL (caption)        [⋯]  │  ← 32px header
├─────────────────────────────┤
│ VALUE (display)             │  ← 48px primary number
│ ▲ +12% vs prior period      │  ← 24px trend row
├─────────────────────────────┤
│ Sparkline (optional)        │  ← 32px
├─────────────────────────────┤
│ Updated 5m ago · View →     │  ← 24px footer (optional)
└─────────────────────────────┘
```

### Grid placement

| Viewport | KPIs per row | Col span each |
|----------|--------------|---------------|
| ≥ 1280px | 4 | 3 col |
| 1024–1279px | 3 | 4 col |
| 768–1023px | 3 | 4 col |
| < 768px | 2 | 6 col (mobile) |

### KPI types

| Type | Body content | Typical span |
|------|--------------|--------------|
| **Scalar** | Single value + trend | 3×2 |
| **Ratio** | Value + progress bar | 3×2 |
| **Status** | Status label + icon (payroll run) | 3×2 |
| **Sparkline** | Value + mini chart | 3×3 |
| **Comparative** | Two values side by side | 4×2 |

### Interaction

| Action | Result |
|--------|--------|
| Click card | Navigate to filtered list/report |
| `⋯` menu | Pin · hide · export |
| Hover | Subtle elevation (elevation-1) |

**Shopify (20%):** Clean numeric hierarchy  
**Odoo (60%):** Clickable stat buttons · drill to filtered views

---

# Table Layout

**Pattern ID:** `LYT-TBL-001` · **Template:** `TPL/List Standard` · **Component:** `CMP-DATATABLE-001`

### Page composition

```text
C2 Page header + primary "Create" action
C3 Filter bar
C4 ┌─────────────────────────────────────────────────────────────┐
   │ Bulk action bar (when rows selected)                        │
   ├─────────────────────────────────────────────────────────────┤
   │ TABLE HEADER (sticky z-10)                                  │
   ├─────────────────────────────────────────────────────────────┤
   │ ROW · ROW · ROW · ROW · ROW                                 │
   │ ROW · ROW · ROW · ROW · ROW                                 │
   ├─────────────────────────────────────────────────────────────┤
   │ Empty state | Loading skeleton | Error banner               │
   └─────────────────────────────────────────────────────────────┘
C5 Pagination
```

### Column architecture

| Column type | Width | Notes |
|-------------|-------|-------|
| **Selection** | 48px | Checkbox |
| **Primary** | flex · min 200px | Name + subtitle · link to drawer |
| **Status** | 120px | Badge pill (Linear) |
| **Date** | 120px | ISO display · sortable |
| **Reference** | 140px | Monospace optional |
| **Amount** | 120px | Right-aligned tabular nums |
| **Activity** | 48px | Icon → global activity drawer |
| **Actions** | 48px | `⋯` row menu |

### Row density

| Mode | Row height | Source |
|------|------------|--------|
| **Comfortable** | 52px | Default admin |
| **Compact** | 40px | Power users · Odoo density |
| **ESS card** | auto | Mobile fallback |

### Filter bar (Shopify-primary)

```text
[Search 240px] [Filter chip ×n] [+ Add filter] [Saved views ▾] [Columns] [Export]
```

| Rule | Detail |
|------|--------|
| **TBL-01** | Sticky header on scroll |
| **TBL-02** | Activity column on every HR list |
| **TBL-03** | Row click opens drawer — checkbox for bulk only |
| **TBL-04** | Empty state: illustration placeholder + CTA |
| **TBL-05** | Sort indicator on header (Linear) |
| **TBL-06** | Permission: hide action column items — not disabled |

**Odoo (60%):** Dense columns · many fields · group-by (future)  
**Shopify (20%):** Filter bar · clean header row  
**Linear (10%):** Status pills · keyboard row navigation

---

# Form Layout

**Pattern ID:** `LYT-FRM-001` · **Template:** `TPL/Form Standard` · **Component:** `CMP-FORM-SECTION-001`

### Contexts

| Context | Container | Width |
|---------|-----------|-------|
| **Drawer create/edit** | Sheet overlay | 560px default · 896px wide |
| **Profile tab** | Tab body in profile drawer | Fluid in Zone C |
| **Settings page** | Content area | max 720px or full |
| **Modal form** | Center modal | 560px |

### Section block (Notion-primary)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ SECTION TITLE                                                    [Collapse] │
│ Optional section description (caption)                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────┐ ┌──────────────────────┐                          │
│ │ Field label          │ │ Field label          │  ← 2-col desktop         │
│ │ [input            ]  │ │ [input            ]  │                          │
│ └──────────────────────┘ └──────────────────────┘                          │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Full-width field                                                        │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Field grid

| Layout | Col span | Use |
|--------|----------|-----|
| Single column | 12 | Long text · addresses |
| Two column | 6 + 6 | Related pairs (from · to dates) |
| Three column | 4 + 4 + 4 | Rare — codes only |
| Inline read | label + value row | Profile view mode |

### Form zones in drawer

```text
┌─────────────────────────────────────────┐
│ HEADER — title · close · status         │
├─────────────────────────────────────────┤
│ TABS (optional) — Odoo form tabs        │
├─────────────────────────────────────────┤
│ BODY — scrollable sections              │
│   Section block                         │
│   Section block                         │
├─────────────────────────────────────────┤
│ FOOTER — sticky                         │
│ [Cancel]              [Save draft][Save]│
└─────────────────────────────────────────┘
```

### Behavioral rules

| Rule | Detail |
|------|--------|
| **FRM-01** | One primary save per footer |
| **FRM-02** | Sticky footer on drawer forms |
| **FRM-03** | Validation inline below field |
| **FRM-04** | Section collapse state persisted |
| **FRM-05** | Read view: Notion-style label/value — not disabled inputs |
| **FRM-06** | Sensitive fields: mask + reveal action |
| **FRM-07** | System checks panel above submit (leave apply) |

**Odoo (60%):** Tabbed forms · notebook pages · smart buttons on header  
**Notion (10%):** Section blocks · collapsible · calm spacing  
**Shopify (20%):** Clear footer actions

---

# Timeline Layout

**Pattern ID:** `LYT-TML-001` · **Component:** `CMP-TML-LAYOUT-001`

Reference: [HR_ACTIVITY_TIMELINE_UI_ARCHITECTURE.md](./HR_ACTIVITY_TIMELINE_UI_ARCHITECTURE.md)

### Four-zone model

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ TML-A — HEADER (sticky · 56–64px)                                           │
│ Entity title · filter chips · search · export · AI summary · view toggle    │
├──────────────────────────────────────────────┬──────────────────────────────┤
│ TML-B — STREAM (~70%)                        │ TML-C — CONTEXT (~30%)       │
│                                              │ Collapsible desktop          │
│  ● Event card                                │ Related record summary       │
│  │                                           │ Quick links                  │
│  ● Event card                                │ Pinned items                 │
│  │                                           │                              │
│  ● Event card                                │                              │
├──────────────────────────────────────────────┴──────────────────────────────┤
│ TML-D — DETAIL DRAWER (?activity={id}) — nested overlay                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Event card anatomy (Linear-primary)

```text
┌──────────────────────────────────────────────────────────────────┐
│ [icon] Title · actor · timestamp                    [status pill]│
│        2-line description                                        │
│        [attachment chip] [link to source]                        │
└──────────────────────────────────────────────────────────────────┘
```

| Property | Spec |
|----------|------|
| **Row min height** | 56px compact · 72px with attachment |
| **Icon column** | 32px · vertical line connector |
| **Group header** | Date label — sticky sub-header |
| **Density toggle** | Compact / Detailed / Audit / Grouped |

### Embedding contexts

| Host | TML zones used |
|------|----------------|
| Employee profile tab | A + B (C optional) |
| Global activity drawer | A + B only · 480px width |
| Approval workspace Zone E | B stream · filtered to approval |
| Full-page attendance timeline | Full A + B + C |

**Odoo (60%):** Chatter message model · attachments · followers concept  
**Linear (10%):** Vertical feed density · status pills · keyboard navigation

---

# AI Panel Layout

**Pattern ID:** `LYT-AI-PANEL-001` (overlay) · `LYT-AI-WORKSPACE-001` (full) · **Component:** `CMP-AI-PANEL-001`

Reference: [HR_AI_ASSISTANT_UI_ARCHITECTURE.md](./HR_AI_ASSISTANT_UI_ARCHITECTURE.md)

### L1 — Global panel (default entry)

**Trigger:** Topbar `✨` · `Ctrl+J` · **Width:** 400px · **Position:** Right dock · **z-index:** 70

```text
┌────────────────────────────────────┐
│ HEADER — ✨ AI · context chips · × │
├────────────────────────────────────┤
│ SUGGESTED PROMPTS (chip row)       │
├────────────────────────────────────┤
│ CONVERSATION (scroll)              │
│  User message                      │
│  AI response                       │
│    └─ CMP-AI-EXPLAIN-001 block     │
├────────────────────────────────────┤
│ INPUT — textarea · send · stop     │
└────────────────────────────────────┘
```

| Zone | Height |
|------|--------|
| Header | 48px |
| Prompts | auto · max 2 rows |
| Conversation | flex-1 |
| Input | 80px min · auto-grow |

**Coexistence:** Panel pushes nothing — overlays content; scrim optional on mobile.

### L5 — Full AI workspace

**Route:** `/hr/ai/workspace` · **Pattern:** `LYT-AI-WORKSPACE-001`

```text
┌──────────┬────────────────────────────────────┬─────────────────┐
│ LEFT NAV │ CONVERSATION                       │ RIGHT RAIL      │
│ 240px    │ flex-1                             │ 320px           │
│          │                                    │                 │
│ Hub      │ Message thread                     │ [Insights]      │
│ Insights │ Citations inline                   │ [Recommend]     │
│ …        │ Proposed actions strip             │ [Actions]       │
│          │                                    │ [History]       │
├──────────┴────────────────────────────────────┴─────────────────┤
│ FOOTER — model · tokens · disclaimer                            │
└─────────────────────────────────────────────────────────────────┘
```

### Insight / recommendation card (embeddable)

**Pattern:** `LYT-AI-CARD-001` — used in DSH-G, profile Zone F, workspace rail

```text
┌─────────────────────────────────────────┐
│ ✨ Title                          [⋯]  │
│ 2-line summary                          │
│ Confidence: ████░ High                  │
│ Sources: (2) · [Expand]                 │
│ [Navigate] [Apply] [Dismiss]            │
└─────────────────────────────────────────┘
```

### AI layout rules

| Rule | Detail |
|------|--------|
| **AI-01** | Explainability block mandatory on non-trivial output |
| **AI-02** | No Approve/Lock buttons on AI cards |
| **AI-03** | Context chips always visible in header |
| **AI-04** | One AI overlay at a time with drawer |
| **AI-05** | Workspace left nav mirrors `/hr/ai` routes |

---

# Drawer Layout

**Pattern ID:** `LYT-DRW-*` · **Component:** `CMP-SHEET-001`

### Width tiers

| Tier | ID | Width | Use |
|------|-----|-------|-----|
| **Narrow** | `LYT-DRW-SM` | 480px | Quick view · leave request |
| **Default** | `LYT-DRW-MD` | 560px | Standard CRUD |
| **Wide** | `LYT-DRW-LG` | 896px | Employee profile · approval workspace |
| **Workbench** | `LYT-DRW-XL` | 1152px | Payroll processing |
| **Full** | `LYT-DRW-FULL` | 100vw | Mobile |

### Standard drawer anatomy

```text
┌─────────────────────────────────────────┐
│ DRW-A — HEADER (56–64px sticky)         │
│ Title · status · close · actions        │
├─────────────────────────────────────────┤
│ DRW-B — META STRIP (optional · 48px)    │
│ Smart buttons · key identifiers         │
├─────────────────────────────────────────┤
│ DRW-C — TABS (optional · 48px sticky)   │
├─────────────────────────────────────────┤
│ DRW-D — BODY (scroll)                   │
│  Main content / form / tabs             │
├─────────────────────────────────────────┤
│ DRW-E — FOOTER (sticky · 64px)          │
│ Secondary actions · primary CTA         │
└─────────────────────────────────────────┘
```

### Scrim and stacking

| State | Behavior |
|-------|----------|
| Drawer open | Content dimmed · `aria-hidden` on background |
| Nested drawer | Second sheet stacks · 56px left offset visual |
| Drawer + AI panel | AI panel overlays drawer (discouraged — close one) |

### Profile drawer composition (`LYT-DRW-PROFILE-001`)

Maps to [EMPLOYEE_PROFILE_UI_ARCHITECTURE.md](./EMPLOYEE_PROFILE_UI_ARCHITECTURE.md):

```text
DRW-A — Profile header (avatar, name, badges)
DRW-B — Summary strip
DRW-C — Tab bar (14 tabs max · horizontal scroll)
DRW-D — Split: 70% tab body | 30% context rail (≥1280px)
DRW-E — Footer actions (edit, terminate, etc.)
```

### Workbench drawer (`LYT-DRW-WORKBENCH-001`)

```text
DRW-A — Run header + SoD banner
DRW-B — 9-step stepper (horizontal scroll if needed)
DRW-D — Split: 65% step content | 35% summary panel
DRW-E — Footer: permission-gated actions separated by SoD
```

**Odoo (60%):** Form in sheet · status bar · smart buttons  
**Shopify (20%):** Clear header/footer · single primary action

---

# Modal Layout

**Pattern ID:** `LYT-MDL-*` · **Component:** `CMP-MODAL-001`

### Size tiers

| Tier | ID | Width | Use |
|------|-----|-------|-----|
| **Small** | `LYT-MDL-SM` | 400px | Confirm · delete |
| **Medium** | `LYT-MDL-MD` | 560px | Approve/reject + comment |
| **Large** | `LYT-MDL-LG` | 720px | AI apply preview · diff |
| **XL** | `LYT-MDL-XL` | 896px | Complex approval preview |

### Anatomy

```text
        ┌─────────────────────────────────────┐
        │ MDL-A — HEADER                      │
        │ Title                        [×]    │
        ├─────────────────────────────────────┤
        │ MDL-B — BODY (scroll max 70vh)      │
        │                                     │
        ├─────────────────────────────────────┤
        │ MDL-C — FOOTER                      │
        │ [Cancel]              [Confirm]     │
        └─────────────────────────────────────┘
              ↑ scrim full viewport (z-80)
```

### Modal vs drawer decision

| Use modal | Use drawer |
|-----------|------------|
| Destructive confirm | CRUD create/view/edit |
| Short comment entry | Multi-section forms |
| Lock/publish confirm | Profile 360° |
| AI apply preview (< 5 fields) | Payroll workbench |
| Session-blocking decision | Approval workspace |

### Behavioral rules

| Rule | Detail |
|------|--------|
| **MDL-01** | Focus trap while open |
| **MDL-02** | `Escape` closes non-destructive only |
| **MDL-03** | Destructive: type-to-confirm for payroll lock |
| **MDL-04** | Max one modal depth — no modal-on-modal |
| **MDL-05** | Center vertically and horizontally |

**Shopify (20%):** Clear confirm/cancel hierarchy  
**Odoo (60%):** Wizard modals for short flows

---

# Reusable Layout Patterns

Canonical templates — compose screens from these. Figma: page **03 Layouts**.

### Pattern registry

| Pattern ID | Name | Composes | SCR examples |
|------------|------|----------|--------------|
| `TPL-SHELL-001` | Admin shell | Sidebar + topbar + content | All `/hr/*` |
| `TPL-PAGE-LIST-001` | Standard list | C2 + C3 filter + C4 table + C5 pagination | `SCR-HR-EMP-001` |
| `TPL-PAGE-LIST-DRW-001` | List + drawer CRUD | List + `LYT-DRW-MD` overlay | All LST+DRW |
| `TPL-PAGE-DSH-001` | Domain dashboard | `LYT-DSH-001` zones A–H | `SCR-HR-DSH-001` |
| `TPL-PAGE-PROFILE-001` | Employee 360° | `LYT-DRW-PROFILE-001` | `SCR-HR-EMP-004` |
| `TPL-PAGE-WORKBENCH-001` | Payroll workbench | `LYT-DRW-WORKBENCH-001` | `SCR-PAY-RUN-003` |
| `TPL-PAGE-APPROVAL-001` | Approval workspace | `LYT-DRW-LG` + `CMP-APR-WORKSPACE-001` | `SCR-COR-APR-DTL` |
| `TPL-PAGE-REPORT-001` | Report output | 280px filter sidebar + chart + table | `SCR-HR-RPT-*` |
| `TPL-PAGE-KANBAN-001` | Pipeline board | C3 lane headers + horizontal scroll | `SCR-HR-REC-008` |
| `TPL-PAGE-CALENDAR-001` | Calendar month | C3 nav + grid body | `SCR-HR-LEV-004` |
| `TPL-OVERLAY-AI-001` | AI panel | `LYT-AI-PANEL-001` | `SCR-GLO-CMP-013` |
| `TPL-OVERLAY-TML-001` | Activity drawer | 480px `TML-A+B` | `SCR-GLO-CMP-005` |
| `TPL-OVERLAY-MDL-CONFIRM-001` | Confirm modal | `LYT-MDL-SM` | Terminate, lock |
| `TPL-OVERLAY-WIZ-001` | Wizard modal | Stepper + body + footer | `SCR-WIZ-*` |

### Composition matrix

| User intent | Template chain |
|-------------|----------------|
| Find employee | `TPL-SHELL` → `TPL-PAGE-LIST` → `TPL-PAGE-PROFILE` |
| Approve leave | `TPL-SHELL` → `TPL-PAGE-LIST` → `TPL-PAGE-APPROVAL` |
| Process payroll | `TPL-SHELL` → `TPL-PAGE-LIST` → `TPL-PAGE-WORKBENCH` |
| Morning HR check | `TPL-SHELL` → `TPL-PAGE-DSH` |
| Ask AI | `TPL-SHELL` → `TPL-OVERLAY-AI` (any page) |
| Audit history | `TPL-PAGE-PROFILE` → tab `LYT-TML-001` |

### Pattern extension rules

| Rule | Detail |
|------|--------|
| **EXT-01** | New screens must declare parent `TPL-*` |
| **EXT-02** | New zones must use `DSH-*` / `TML-*` / `DRW-*` namespaces |
| **EXT-03** | No custom shell per module |
| **EXT-04** | Widen drawer before creating full page route |

---

# Layout × Design Formula Map

Quick reference: which influence dominates each layout.

| Layout | Odoo 60% | Shopify 20% | Notion 10% | Linear 10% |
|--------|----------|-------------|------------|------------|
| Sidebar | ●●● | ● | | ● |
| Topbar | ●● | ●● | | ●● |
| Content header | ●● | ●●● | | ● |
| Dashboard | ●●● | ●● | | ● |
| KPI | ●●● | ●● | | ● |
| Table | ●●● | ●●● | | ●● |
| Form | ●●● | ● | ●●● | |
| Timeline | ●●● | | ● | ●●● |
| AI panel | ● | ●● | ● | ●● |
| Drawer | ●●● | ●● | ● | |
| Modal | ●● | ●●● | | ● |

---

# Multi-Company Layout Hooks

Per [database/multi-company.md](../../../05-development/database/multi-company.md):

| Surface | Scope UI |
|---------|----------|
| Topbar | Company · branch switchers |
| Dashboard A | Scope chips when filtered |
| Table C3 | Company column (hidden if single company) |
| Drawer header | Record company badge |
| Reports | Mandatory period + company |

---

# Accessibility Layout Requirements

| Requirement | Layout implication |
|-------------|-------------------|
| Focus order | Sidebar → topbar → content → overlay |
| Skip link | "Skip to content" before sidebar |
| Landmarks | `nav` sidebar · `header` topbar · `main` content |
| Drawer | Focus trap · return focus on close |
| Table | Sticky header does not trap scroll |
| Touch | 44px min targets — drawer footer buttons |

---

# Cross-Reference Index

| Document | Role |
|----------|------|
| [layout-architecture.md](../../../04-uiux/standards/layout-architecture.md) | Platform shell baseline |
| [HR_DESIGN_SYSTEM_SPECIFICATION.md](../../../04-uiux/design-system/HR_DESIGN_SYSTEM_SPECIFICATION.md) | Tokens · components |
| [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../HR_FIGMA_WIREFRAME_BLUEPRINT.md) | Wireframe zones |
| [HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) | DSH zone detail |
| [EMPLOYEE_PROFILE_UI_ARCHITECTURE.md](./EMPLOYEE_PROFILE_UI_ARCHITECTURE.md) | Profile drawer |
| [HR_ACTIVITY_TIMELINE_UI_ARCHITECTURE.md](./HR_ACTIVITY_TIMELINE_UI_ARCHITECTURE.md) | Timeline zones |
| [HR_AI_ASSISTANT_UI_ARCHITECTURE.md](./HR_AI_ASSISTANT_UI_ARCHITECTURE.md) | AI surfaces |
| [HR_APPROVAL_CENTER_UI_ARCHITECTURE.md](./HR_APPROVAL_CENTER_UI_ARCHITECTURE.md) | Approval workspace |
| [PAYROLL_UI_ARCHITECTURE.md](./PAYROLL_UI_ARCHITECTURE.md) | Workbench layout |
| [HR_DESKTOP_WIREFRAME_EXECUTION_PLAN.md](./HR_DESKTOP_WIREFRAME_EXECUTION_PLAN.md) | Phased wireframe order |
| [HR_FIGMA_SCREEN_MAP.md](./HR_FIGMA_SCREEN_MAP.md) | SCR → template map |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll — Desktop Layout System |
| **Owner** | Product / Design / Frontend Architecture |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Pattern IDs** | `LYT-*` · `TPL-*` |

---

**AgainERP HR & Payroll Desktop Layout System** — complete structural layout architecture for shell, content, dashboards, data surfaces, overlays, and reusable composition patterns. Architecture only — no visual design.
