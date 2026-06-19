# HR & Payroll — Figma Wireframe Blueprint

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll (unified enterprise suite)  
> **Document Type:** Wireframe Planning Architecture  
> **Phase:** Documentation First · Planning Only  
> **Audience:** UI designers · UX designers · Figma teams · Frontend developers · Product  
> **Parent:** [HR_UI_UX_BLUEPRINT.md](./HR_UI_UX_BLUEPRINT.md) · [HR_SCREEN_INVENTORY.md](./HR_SCREEN_INVENTORY.md) · [HR_DASHBOARD_ARCHITECTURE.md](./HR_DASHBOARD_ARCHITECTURE.md)  
> **Governance:** [UI_UX_DESIGN_STANDARDS.md](../../04-uiux/standards/UI_UX_DESIGN_STANDARDS.md) · [ENTERPRISE_UI_ARCHITECTURE.md](../../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md) · [layout-architecture.md](../../04-uiux/standards/layout-architecture.md) · [navigation.md](../../04-uiux/standards/navigation.md) · [design-system.md](../../04-uiux/standards/design-system.md) · [dashboard-widgets.md](../../04-uiux/standards/dashboard-widgets.md) · [ai-assistant-ui.md](../../04-uiux/standards/ai-assistant-ui.md) · [mobile-first.md](../../04-uiux/standards/mobile-first.md) · [PROJECT_COMMON_RULES.md](../../00-foundation/PROJECT_COMMON_RULES.md)

**No visual mockups. No color specs. No code.**  
Defines **wireframe structure, page hierarchy, layout zones, and Figma file organization** for AgainERP HR & Payroll. Foundation for Figma design, high-fidelity UI, UX flows, frontend implementation, and responsive behavior.

---

## Executive Summary

| Principle | Wireframe rule |
|-----------|----------------|
| **Low fidelity** | Grayscale boxes, labels, placeholder text only |
| **URL-driven CRUD** | List + drawer — never separate `/new` page wireframes |
| **Platform shell** | Reuse global frame — do not redesign top bar/sidebar |
| **Screen ID traceability** | Every frame labeled `SCR-*` from screen inventory |
| **12-col dashboard grid** | Per [dashboard-widgets.md](../../04-uiux/standards/dashboard-widgets.md) |
| **Permission placeholders** | Annotate hidden states for role variants |
| **Mobile parallel frames** | Every critical flow has `375px` companion frame |

**Figma project name (recommended):** `AgainERP — HR & Payroll (Wireframes)`  
**Link to dev:** Frame name = `SCR-{ID} · {Screen Title}`

---

# Wireframe Philosophy

### Core belief

> **Wireframes define structure and flow before pixels — they answer where things live, not how they look.**

| Wireframe is | Wireframe is not |
|--------------|------------------|
| Layout zones and hierarchy | Brand colors, typography scale |
| Interaction annotations | Final component styling |
| All states (empty, loading, error) | Photography or icons (use placeholders) |
| Responsive breakpoints | Production copywriting |
| Permission variant notes | shadcn token values |

### Design formula (structure only)

```text
Wireframe structure = Platform shell + HR page zones + URL-driven drawer + Activity/AI overlays
```

Inspiration for **information density** (not visual style): Odoo tabs · Oracle HCM profile · Linear density · Notion section blocks.

---

# Design Principles

| # | Principle | Wireframe implication |
|---|-----------|----------------------|
| 1 | **One shell** | Single master frame component for app chrome |
| 2 | **Drawer CRUD** | Wireframe create/view/edit as Sheet overlay on list |
| 3 | **Progressive disclosure** | Tabs inside profile; advanced filters in drawer |
| 4 | **Exception-first dashboards** | Pending actions above charts |
| 5 | **Activity everywhere** | Activity column on every list wireframe |
| 6 | **AI adjacent** | ✨ launcher + insight zone on admin pages |
| 7 | **Mobile ESS** | Separate ESS frame set with bottom nav |
| 8 | **Payroll caution** | Lock/approve states as annotated wireframe variants |
| 9 | **Annotate permissions** | Sticky note: "Hidden if no `payroll.run.lock`" |
| 10 | **Traceability** | Screen ID + route in frame description |

---

# Layout Strategy

### Zone model (desktop)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ ZONE A — Top bar (56px) — global component, do not redesign             │
├──────────┬──────────────────────────────────────────────┬───────────────┤
│ ZONE B   │ ZONE C — Main content                        │ ZONE D        │
│ Sidebar  │  C1 Breadcrumb                               │ Utility rail  │
│ 240/64px │  C2 Page header + actions                    │ (optional)    │
│          │  C3 Filters / tabs                           │ 320px         │
│          │  C4 Primary content                          │               │
│          │  C5 Pagination / footer                      │               │
└──────────┴──────────────────────────────────────────────┴───────────────┘
│ ZONE E — Sheet drawer (overlay, right) — ?create|view|edit              │
│ ZONE F — Modal (center) — confirmations, terminate, approve             │
│ ZONE G — AI panel (400px overlay) — Ctrl+J                              │
└─────────────────────────────────────────────────────────────────────────┘
```

### Content patterns by screen type

| Type | C4 content |
|------|------------|
| **Directory** | Table wireframe (AG Grid placeholder) |
| **Dashboard** | 12-col widget grid |
| **Workbench** | Stepper + status bar + split panels |
| **Calendar** | Month grid wireframe |
| **Kanban** | Column lanes |
| **Report** | Filter sidebar + chart + table stack |
| **ESS portal** | Simplified C4 + bottom nav |

---

# Navigation Strategy

Per [HR_UI_UX_BLUEPRINT.md](./HR_UI_UX_BLUEPRINT.md) and [navigation.md](../../04-uiux/standards/navigation.md).

### Sidebar tree (wireframe pages)

```text
HR & Payroll
├── Dashboard (/hr)
├── Employees ▸
├── Recruitment
├── Attendance
├── Shifts
├── Leave
├── Payroll ▸
├── Overtime
├── Loans & Advances
├── Performance
├── Training
├── Assets
├── Travel & Expense
├── Reports ▸
├── Settings ▸
└── AI Assistant

ESS (separate entry /ess)
```

### Breadcrumb wireframe

`HR & Payroll / {Section} / {Page} / [Record Name when drawer open]`

### Active state

Highlight sidebar item matching current route — annotate in component spec.

---

# Responsive Strategy

| Breakpoint | Frame width | Layout changes |
|------------|-------------|----------------|
| **Mobile** | 375px | No sidebar; hamburger; full-width drawer; card lists |
| **Tablet** | 768px | Overlay sidebar; drawer full width |
| **Desktop** | 1440px | Full shell; standard drawer widths |
| **Wide** | 1920px | Optional utility rail on profile |

### Required responsive frame pairs

| Flow | Desktop frame | Mobile frame |
|------|---------------|--------------|
| Employee list + view | ✓ | ✓ |
| ESS dashboard | — | ✓ |
| Leave apply | ✓ | ✓ |
| Payslip view | ✓ | ✓ |
| Approval action | ✓ | ✓ |
| HR dashboard | ✓ | ✓ (2-col KPI) |

**Touch:** Annotate 44px min tap targets on mobile frames.

---

# AI Ready Design Strategy

| Surface | Wireframe zone | Shortcut |
|---------|----------------|----------|
| Header ✨ | Opens ZONE G | Ctrl+J |
| Dashboard | `AI Insights` widget row | — |
| `/hr/ai` | Full AI hub page | — |
| Employee drawer | `AI Actions` tab | — |
| ESS | Simplified prompt chips | — |
| Payroll workbench | `Validate with AI` button (annotation) | — |

Wireframe **insight cards** as: `[Icon] Title · 2-line summary · Confidence badge · View details link`

---

# Figma File Structure

Recommended **master file** pages:

| Page # | Page name | Contents |
|--------|-----------|----------|
| **01** | Foundations | Grid, spacing, breakpoints, annotation legend |
| **02** | Components | Atoms → organisms (wireframe library) |
| **03** | Layouts | Shell, drawer, modal, dashboard grid templates |
| **04** | HR Dashboard | All dashboard wireframes |
| **05** | Employee Management | List, profile, org |
| **06** | Recruitment | Pipeline, candidates, hiring |
| **07** | Attendance | Daily, calendar, devices |
| **08** | Leave | Requests, calendar, balances |
| **09** | Payroll | Runs, payslips, structures |
| **10** | Performance | Goals, reviews, cycles |
| **11** | Training | Programs, sessions, certs |
| **12** | Assets | Inventory, assignments |
| **13** | Reports | Report center, analytics |
| **14** | Self Service | ESS portal |
| **15** | AI Assistant | Panel, hub, insights |
| **16** | Global Modals & Drawers | Shared overlays |
| **17** | Mobile ESS | Mobile-only flows |
| **18** | Flows & Annotations | User journey maps |

**Optional linked library:** `AgainERP — Core Shell (Wireframes)` shared across modules.

---

# Page Hierarchy

### Hierarchy levels

```text
Module → Screen → Sub-screen (tab) → Overlay (drawer | modal | wizard)
```

### Module map

| Module | Primary screens | Overlays |
|--------|-----------------|----------|
| **HR** | Dashboard, employees, recruitment, attendance, leave, … | Drawers, wizards |
| **Payroll** | Dashboard, runs, payslips, structures | Workbench drawer |
| **ESS** | Portal home, leave, payslips, … | Full-width sheets |
| **Core** | Approvals inbox, notifications | Modals |
| **AI** | `/hr/ai`, global panel | Side panel |

### Screen type legend (wireframe)

| Symbol | Type |
|--------|------|
| `[PAGE]` | Full content area |
| `[DRAWER]` | Right sheet overlay |
| `[MODAL]` | Center dialog |
| `[WIZ]` | Multi-step wizard |
| `[TAB]` | Tab panel inside page/drawer |

---

# Global Application Frame

Wireframe each slot — use **placeholder blocks**, not branded UI.

### Top bar (56px)

| Slot | Wireframe block | HR notes |
|------|-----------------|----------|
| Logo | `[Logo]` | Links home |
| Search | `[⌘K Search]` | Employee/dept scope |
| Company switcher | `[Company ▾]` | Multi-company |
| Branch switcher | `[Branch ▾]` | Optional |
| Quick create | `[+]` | HR create menu |
| Notifications | `[🔔 badge]` | Opens notification center |
| Activities | `[📋]` | Task counter |
| AI launcher | `[✨]` | Opens AI panel |
| User menu | `[Avatar ▾]` | ESS link |

### Sidebar (240px / 64px collapsed)

- Module groups per navigation tree
- Collapse toggle at bottom
- Active item highlight annotation

### Breadcrumb row

`[HR & Payroll] / [Section] / [Page] / [Record?]`

### Search

Global command palette trigger — wireframe as centered modal overlay (separate frame).

### Notification center

`[PAGE]` drawer from right OR full page `/notifications` — list grouped by priority.

### Company / branch switchers

Dropdown wireframe with search + recent companies.

### User menu

Profile · Settings · ESS · Logout.

### AI assistant launcher

Opens ZONE G — 400px panel; full-screen on mobile.

---

# Global Grid System

Per [dashboard-widgets.md](../../04-uiux/standards/dashboard-widgets.md) and [design-system.md](../../04-uiux/standards/design-system.md).

### Desktop (1440px content)

| Property | Value |
|----------|-------|
| Content max-width | Fluid within shell (min ~900px usable) |
| Dashboard columns | **12 columns** |
| Gutter | 16px (`--space-4`) |
| Widget row height unit | 80px base |
| Page padding | 24px |

### Tablet (768px)

- 12 columns → 8 effective (wider widgets stack)
- Sidebar overlay

### Mobile (375px)

- **4-column** implicit grid
- KPI cards: 2 per row
- Full bleed lists

### Card system (wireframe)

```text
┌─────────────────────────┐
│ Card header [actions]   │
├─────────────────────────┤
│ Card body               │
│ [placeholder content]   │
└─────────────────────────┘
```

Sizes: `S` (KPI) · `M` (widget) · `L` (chart) · `XL` (table)

### Spacing scale (annotate)

`4 · 8 · 12 · 16 · 24 · 32 · 48` px — match design tokens in hi-fi phase.

---

# Dashboard Wireframes

Each dashboard uses **global dashboard framework** from [HR_DASHBOARD_ARCHITECTURE.md](./HR_DASHBOARD_ARCHITECTURE.md).

### Zone template (all dashboards)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER: Title · Period/Branch filter · [Customize]                    │
├─────────────────────────────────────────────────────────────────────────┤
│ KPI ROW: [KPI][KPI][KPI][KPI]  (12-col: 3+3+3+3)                        │
├──────────────────────────────┬──────────────────────────────────────────┤
│ ANALYTICS (6-8 col)          │ PENDING ACTIONS (4 col)                  │
│ [Chart][Chart]               │ [Approval list]                          │
├──────────────────────────────┴──────────────────────────────────────────┤
│ NOTIFICATIONS / ACTIVITY (split or tabs)                                │
├─────────────────────────────────────────────────────────────────────────┤
│ AI INSIGHTS (1-3 cards)                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│ QUICK ACTIONS [btn][btn][btn][btn]                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

### Dashboard frame index

| Dashboard | Route | Screen ID | KPIs (wireframe count) |
|-----------|-------|-----------|------------------------|
| **HR Dashboard** | `/hr` | SCR-HR-DSH-001 | 6–8 |
| **Payroll Dashboard** | `/payroll` | SCR-PAY-DSH-001 | 5–7 |
| **Attendance Dashboard** | `/hr/attendance` | SCR-HR-DSH-002 | 6–8 |
| **Recruitment Dashboard** | `/hr/recruitment` | SCR-HR-DSH-004 | 5–6 |
| **Performance Dashboard** | `/hr/performance` | SCR-HR-DSH-005 | 4–6 |
| **Training Dashboard** | `/hr/training` | SCR-HR-DSH-006 | 5 |
| **Executive Dashboard** | `/hr/executive` | SCR-HR-DSH-008 | 8–10 |

**Mobile:** KPI 2×2 grid; charts stack; actions horizontal scroll.

---

# Employee Management Wireframes

| Screen | Route | Type | Screen ID |
|--------|-------|------|-----------|
| Employee list | `/hr/employees` | `[PAGE]` table | SCR-HR-EMP-001 |
| Employee create | `?create=1` | `[DRAWER]` form | SCR-HR-EMP-002 |
| Employee details | `?view={id}` | `[DRAWER]` profile | SCR-HR-EMP-004 |
| Employee edit | `?edit={id}` | `[DRAWER]` form | SCR-HR-EMP-003 |
| Employee timeline | `&tab=timeline` | `[TAB]` | SCR-HR-EMP-005 |
| Documents | `&tab=documents` | `[TAB]` | SCR-HR-EMP-008 |
| Salary | `&tab=salary` | `[TAB]` | SCR-HR-EMP-009 |
| Attendance | `&tab=attendance` | `[TAB]` | SCR-HR-EMP-010 |
| Leave | `&tab=leave` | `[TAB]` | SCR-HR-EMP-011 |
| Payroll | `&tab=payroll` | `[TAB]` | SCR-HR-EMP-012 |
| Assets | `&tab=assets` | `[TAB]` | SCR-HR-EMP-013 |
| Performance | `&tab=performance` | `[TAB]` | SCR-HR-EMP-014 |
| Training | `&tab=training` | `[TAB]` | SCR-HR-EMP-015 |

### Employee list wireframe

```text
[Page header: Employee Directory · [+ Add Employee] [Export]]
[Filter bar: Search · Status chips · Dept · Branch · [Filters]]
[TABLE: Photo | Employee | Dept | Designation | Branch | Manager | Status | Activity]
[Pagination]
```

---

# Employee Details Wireframe

**Critical screen** — `SCR-HR-EMP-004` · Drawer `max-w-5xl` desktop · full-screen mobile.

### Layout (desktop ≥1280px)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER SECTION (full width)                                             │
├──────────────────────────────────────────────┬──────────────────────────┤
│ MAIN CONTENT (tabs)                          │ RIGHT SIDEBAR            │
│ ~70% width                                   │ ~30% width               │
│                                              │                          │
│ [Tab bar]                                    │ Leave balance            │
│ [Active tab content]                         │ Pending requests         │
│                                              │ Assigned assets          │
│                                              │ Quick stats              │
│                                              │ Upcoming events          │
└──────────────────────────────────────────────┴──────────────────────────┘
```

### Header section

| Element | Wireframe block |
|---------|-----------------|
| Photo | `[80×80 avatar]` |
| Name | `[H1 text line]` |
| Employee ID | `[Badge EMP-####]` |
| Designation | Subtitle line |
| Department | Subtitle line |
| Branch | Subtitle line |
| Status | `[Status badge]` |
| Manager | `[Link]` |
| Quick actions | `[Edit] [Actions ▾]` |
| Smart buttons row | `[Leave] [Attendance] [Payslip] [Assets] [Activity]` |

### Main content — tab bar

`Overview · Personal · Employment · Compensation · Attendance · Leave · Payroll · Assets · Training · Performance · Documents · Activity`

**Permission annotation:** Hide Compensation tab without `hr.sensitive.view`.

### Tab content wireframes (summary)

| Tab | Structure |
|-----|-----------|
| **Overview** | 2×2 summary cards + org chart mini |
| **Personal** | Form sections: contact, address, emergency |
| **Employment** | Dates, type, grade, cost center, manager |
| **Compensation** | Salary structure card + revision history table |
| **Attendance** | Mini month calendar + last 10 days table |
| **Leave** | Balance cards + request history table |
| **Payroll** | Payslip list table |
| **Assets** | Assigned assets table |
| **Training** | Enrollments + certs |
| **Performance** | Goals + last review summary |
| **Documents** | File list + upload zone |
| **Activity** | Timeline (see below) |

### Right sidebar widgets

```text
┌─ Leave balance ─────────┐
│ [Type] ████░░ 12/20     │
│ [Type] ██████░ 6/10     │
├─ Pending requests ──────┤
│ [list 3 items]          │
├─ Assigned assets ───────┤
│ [list + count]          │
├─ Quick stats ───────────┤
│ Tenure · Attendance %   │
├─ Upcoming events ───────┤
│ [list]                  │
└─────────────────────────┘
```

**Mobile:** Sidebar stacks below tabs (single column).

### Timeline area (`Activity` tab)

Vertical timeline wireframe:

```text
│ ● Promotion — Senior Engineer — 2025-03-01
│ ● Transfer — Dhaka → Chittagong — 2024-06-15
│ ● Salary revision — +8% — 2024-06-15
│ ● Training completed — Safety 101 — 2024-02-10
│ ● Asset assigned — Laptop — 2023-01-05
│ ● Document uploaded — Passport — 2023-01-02
│ ● Activity — Field change — 2022-12-01
```

Filter chips: `All · Promotion · Transfer · Salary · Training · Asset · Document · System`

---

# Recruitment Wireframes

| Screen | Route | Pattern | Screen ID |
|--------|-------|---------|-----------|
| Job position list | `/hr/recruitment/requisitions` | Table + drawer | SCR-HR-REC-001 |
| Candidate list | `/hr/recruitment/candidates` | Kanban / table toggle | SCR-HR-REC-004 |
| Candidate details | `?view={id}` | Drawer + tabs | SCR-HR-REC-005 |
| Interview calendar | `/hr/recruitment/interviews` | Calendar | SCR-HR-REC-007 |
| Interview pipeline | `/hr/recruitment` | Kanban default | SCR-HR-REC-008 |
| Offer management | Candidate tab | Drawer tab | SCR-HR-REC-010 |
| Hiring wizard | `?hire={id}` | `[WIZ]` modal/drawer | SCR-HR-REC-011 |

### Kanban wireframe

```text
[Applied] | [Screening] | [Interview] | [Offer] | [Hired]
  [card]     [card]         [card]        [card]    [card]
  [card]                    [card]
```

### Hiring wizard steps

`1 Confirm details · 2 Employment terms · 3 Salary (link) · 4 Documents · 5 Review & hire`

---

# Attendance Wireframes

| Screen | Route | Layout | Screen ID |
|--------|-------|--------|-----------|
| Attendance dashboard | `/hr/attendance` | Dashboard | SCR-HR-DSH-002 |
| Daily attendance | `/hr/attendance/daily` | **Table** | SCR-HR-ATT-002 |
| Monthly attendance | `/hr/attendance/monthly` | **Table** + month picker | — |
| Attendance calendar | `/hr/attendance/calendar` | **Calendar** | — |
| Attendance analytics | `/hr/attendance/analytics` | **Analytics** | SCR-HR-ATT-008 |
| Corrections | `/hr/attendance/corrections` | Table + drawer | — |
| Biometric devices | `/hr/settings/devices` | Table + drawer | SCR-HR-ATT-009 |
| Sync logs | Device tab | **Timeline** list | — |

### Layout patterns

| Pattern | Wireframe structure |
|---------|---------------------|
| **Table** | Status column color annotation · Row actions · Export |
| **Calendar** | Day cell: P/A/L/H indicators · Click → day detail drawer |
| **Timeline** | Sync events chronological with success/fail icon |
| **Analytics** | KPI row + line chart + dept heatmap placeholder |

---

# Shift Management Wireframes

| Screen | Route | Pattern |
|--------|-------|---------|
| Shift list | `/hr/shifts` | Table + drawer |
| Shift details | `?view={id}` | Drawer: definition + rules |
| Shift calendar | `/hr/shifts/calendar` | Calendar grid per employee |
| Rotation planner | `/hr/shifts/rotations` | Table + pattern builder |
| Conflict resolution | Annotated alert panel | List of conflicts + resolve actions |

---

# Leave Management Wireframes

| Screen | Route | Pattern | Screen ID |
|--------|-------|---------|-----------|
| Leave dashboard | `/hr/leave` | Dashboard | SCR-HR-DSH-003 |
| Leave requests | `/hr/leave/requests` | Table + drawer | SCR-HR-LEV-001 |
| Leave calendar | `/hr/leave/calendar` | Calendar (who's out) | SCR-HR-LEV-002 |
| Leave balances | `/hr/leave/balances` | Table | — |
| Leave policies | `/hr/settings/leave` | Settings sections | — |
| Approval queue | `/inbox/approvals?type=leave` | Core inbox filter | — |

### Leave request drawer

`Employee · Type · Dates · Half-day · Reason · Balance preview · [Submit]`

---

# Payroll Wireframes

*Critical section.*

### Payroll dashboard — `SCR-PAY-DSH-001`

```text
HEADER: Payroll Dashboard · [Period ▾] · [Run Payroll]
KPI ROW: [Current period] [Pending] [Processed] [Locked] [Exceptions]
ANALYTICS: [Cost trend chart] [Dept cost bar]
PENDING: [Approval queue list]
STATUS: [Processing pipeline stepper annotation]
QUICK: [New run] [View payslips] [Reports]
```

### Payroll processing screen — workbench `SCR-PAY-RUN-002`

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER: Payroll Run PR-2026-06-001 · Status badge · [Actions]           │
├─────────────────────────────────────────────────────────────────────────┤
│ STEPPER: Period → Collect → Calculate → Review → Approve → Lock → Post  │
├──────────────────────────────┬──────────────────────────────────────────┤
│ LEFT: Batch selector           │ RIGHT: Summary panel                   │
│ Employee inclusion table       │ Totals · Exceptions count              │
│ [x] Include all                │ Validation status ✓/⚠                  │
│ Exceptions highlighted rows    │ Approval status                        │
│                                │ Lock status (disabled until approved)  │
├──────────────────────────────┴──────────────────────────────────────────┤
│ BOTTOM: [Calculate] [Submit for approval] [Lock] [Publish payslips]    │
│ ANNOTATION: SoD warning if same user calculated + approves              │
└─────────────────────────────────────────────────────────────────────────┘
```

| Zone | Content |
|------|---------|
| **Payroll period** | Period dates + lock indicator |
| **Batch selector** | Included/excluded employees |
| **Calculation status** | Progress bar / last run time |
| **Validation status** | Error/warning list |
| **Approval status** | Link to approval timeline |
| **Lock status** | Immutable indicator post-lock |

### Payslip screen — `SCR-PAY-PSL-002`

```text
HEADER: Employee · Period · [Print] [Download PDF]
┌─ Employee info ─────────────────────────────────────────┐
│ Name · ID · Dept · Bank (masked)                        │
├─ Salary breakdown ──────────────────────────────────────┤
│ EARNINGS table                                          │
│ DEDUCTIONS table                                        │
│ NET PAY highlight                                       │
├─ History ───────────────────────────────────────────────┤
│ Prior payslips list                                     │
└─────────────────────────────────────────────────────────┘
```

### Salary structure screen — `SCR-PAY-STR-*`

```text
[Tabs: Components | Structures | Tax rules | Contributions]
Structures: Master-detail wireframe
  LEFT: Structure list
  RIGHT: Component lines table + formula annotation
```

---

# Overtime Wireframes

| Screen | Route |
|--------|-------|
| Dashboard | `/hr/overtime` |
| Requests | Table + drawer |
| Approvals | Inbox filter / tab |
| Analytics | Chart + table |

---

# Loan & Advance Wireframes

| Screen | Route |
|--------|-------|
| Dashboard | `/payroll/loans` |
| Loan requests | Table + drawer |
| Installments | Tab in loan view — schedule table |
| Recoveries | Payroll run linkage annotation |
| Advance requests | Table + drawer |

---

# Performance Wireframes

| Screen | Route |
|--------|-------|
| Goals | Table + drawer |
| KPIs | Settings-linked grid |
| Reviews | Cycle selector + employee grid |
| Promotion recommendations | Table + approval status |
| Analytics | Rating distribution chart |

---

# Training Wireframes

| Screen | Route | Screen ID |
|--------|-------|-----------|
| Training dashboard | `/hr/training` | SCR-HR-TRN-001 |
| Programs | `/hr/training/programs` | SCR-HR-TRN-002 |
| Sessions | `/hr/training/sessions` | SCR-HR-TRN-003 |
| Attendance | `/hr/training/attendance` | SCR-HR-TRN-005 |
| Certificates | `/hr/training/certificates` | SCR-HR-TRN-006 |
| Evaluations | `/hr/training/evaluations` | SCR-HR-TRN-007 |

---

# Asset Wireframes

| Screen | Route |
|--------|-------|
| Asset inventory | `/hr/assets` table |
| Asset details | Drawer: specs + history |
| Assignments | Table + assign modal |
| Returns | Return form drawer |
| Damages | Report drawer |
| Lifecycle | Timeline tab |

---

# Reporting Wireframes

Per [reports-ui.md](../../04-uiux/standards/reports-ui.md).

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Report Center · [Export ▾] [Schedule]                                   │
├──────────────┬──────────────────────────────────────────────────────────┤
│ FILTER SIDEBAR│ CHART AREA (40% height)                                 │
│ Date range   │                                                          │
│ Company/branch│ DATA TABLE (sortable)                                   │
│ Dept         │                                                          │
│ Group by     │                                                          │
│ [Apply]      │                                                          │
└──────────────┴──────────────────────────────────────────────────────────┘
```

| Sub-screen | Pattern |
|------------|---------|
| Analytics | Chart-heavy |
| Scheduled reports | Table of schedules + edit drawer |
| Export progress | Toast + notification annotation |

---

# Approval Center Wireframes

Core `/inbox/approvals` — HR filter annotation.

| View | Wireframe |
|------|-----------|
| **Dashboard** | Count cards by module + SLA |
| **Pending** | Table: Type · Requester · Date · Amount/Days · [Approve][Reject] |
| **Approved** | Read-only history table |
| **Rejected** | Table + reason column |
| **Escalated** | Highlighted SLA breach |
| **History** | Timeline per request |

**Modal:** `SCR-GLO-CMP-006` Approval action — comment required on reject.

---

# Notification Center Wireframes

| View | Structure |
|------|-----------|
| **List** | Grouped by today/yesterday · unread dot |
| **Priority** | Tabs: All · Critical · Reminders |
| **History** | Search + date filter |
| **Preferences** | Category × channel matrix |

---

# Activity Log Wireframes

| View | Pattern |
|------|---------|
| **Global activity** | Search + filter drawer |
| **Employee timeline** | Profile tab (vertical timeline) |
| **Payroll timeline** | Run drawer tab |
| **Attendance timeline** | Correction audit |
| **Audit viewer** | Field-level diff table + export |

**Global Activity Drawer** `SCR-GLO-CMP-005` — tabs: Overview · Activities · Comments · Notes · Attachments · AI · History

---

# Self Service Portal Wireframes

**Separate frame set** — simplified shell, `/ess`.

| Screen | Route | Screen ID |
|--------|-------|-----------|
| Employee dashboard | `/ess` | SCR-ESS-DSH-001 |
| Attendance | `/ess/attendance` | SCR-ESS-ATT-001 |
| Leave | `/ess/leave` | SCR-ESS-LEV-001 |
| Payslips | `/ess/payslips` | SCR-ESS-PAY-001 |
| Documents | `/ess/documents` | SCR-ESS-DOC-001 |
| Assets | `/ess/assets` | SCR-ESS-AST-001 |
| Training | `/ess/training` | SCR-ESS-TRN-001 |
| Performance | `/ess/performance` | SCR-ESS-PRF-001 |
| Requests | `/ess/requests` | SCR-ESS-REQ-001 |

### ESS shell wireframe

```text
[Simple header: Logo · Notifications · Avatar]
[Content area]
[Bottom nav: Home · Leave · Payslips · Attendance · More]
```

---

# AI Assistant Wireframes

| Surface | Frame |
|---------|-------|
| **AI side panel** | ZONE G — 400px · context bar · messages · suggestions · input |
| **AI full workspace** | `/hr/ai` — 2-col: prompts + insight feed |
| **AI insights panel** | `/hr/ai/insights` — card grid |
| **AI recommendation center** | `/hr/ai/promotions` etc. — ranked table |
| **AI action center** | Pending AI proposals + Apply/Dismiss |

### AI insight card wireframe

```text
┌─────────────────────────────────────┐
│ [⚠] Attendance anomaly · High       │
│ 3 employees with recurring Monday   │
│ absence pattern.                    │
│ [View report]  [Dismiss]            │
│ Confidence: 0.84 · Sources: 2       │
└─────────────────────────────────────┘
```

---

# Global Modals

| Modal | Trigger | Screen ref |
|-------|---------|------------|
| Create employee | `?create=1` or quick create | SCR-HR-EMP-002 |
| Approve leave | Inbox action | SCR-GLO-CMP-006 |
| Payroll approval | Run workbench | SCR-GLO-CMP-006 |
| Salary revision | Compensation tab | Drawer (not modal) |
| Promotion | Performance action | Drawer |
| Transfer | Employee actions | `[WIZ]` 2-step |
| Exit clearance | Terminate flow | `[WIZ]` multi-step |
| Asset assignment | Asset/employee | Modal form |
| Training enrollment | Training tab | Drawer |

Wireframe each with: **title · body · primary/secondary actions · destructive variant**

---

# Global Drawers

| Drawer | Width | Content summary |
|--------|-------|-----------------|
| Quick employee view | `max-w-5xl` | Full profile wireframe |
| Quick attendance view | `max-w-3xl` | Day detail + punches |
| Quick leave view | `max-w-3xl` | Request detail + approval |
| Quick payroll view | `max-w-4xl` | Run summary / payslip |
| Quick asset view | `max-w-2xl` | Asset + assignment history |
| Activity & chatter | `max-w-lg` | Global activity tabs |

---

# Mobile Wireframes

Dedicated page **17 — Mobile ESS** + mobile variants on page 05/08/09.

| Screen | Priority |
|--------|----------|
| Employee dashboard (ESS) | P0 |
| Attendance check-in | P0 |
| Leave request form | P0 |
| Payslip PDF view | P0 |
| Notifications list | P1 |
| Approval swipe/action | P1 |
| AI assistant full-screen | P1 |

**Manager mobile:** Approvals + team attendance card list.

---

# Design System Mapping

Map wireframe blocks to [design-system.md](../../04-uiux/standards/design-system.md) components in hi-fi phase.

| Wireframe block | Design system component |
|-----------------|-------------------------|
| Table zone | AG Grid / DataTable |
| Form fields | Input, Select, DatePicker, Textarea |
| KPI card | `StatCard` |
| Status | `Badge` + [status-system.md](../../04-uiux/standards/status-system.md) |
| Tabs | `Tabs` |
| Kanban | Custom board (recruitment) |
| Timeline | `ActivityTimeline` |
| Calendar | `Calendar` / month grid |
| Charts | Chart placeholder → Recharts |
| Drawer | `Sheet` |
| Modal | `Dialog` |
| Wizard | `Stepper` + steps |
| Filters | [filters.md](../../04-uiux/standards/filters.md) pattern |

---

# Figma Component Inventory

Atomic design — **wireframe library** (grayscale).

### Atoms

| Component | Variants |
|-----------|----------|
| `WF/Button` | primary, secondary, ghost, destructive |
| `WF/Input` | text, search |
| `WF/Badge` | status employment, payroll, approval |
| `WF/Avatar` | sm, md, lg |
| `WF/Icon placeholder` | 24px box |
| `WF/Label` | field label |
| `WF/Divider` | horizontal |

### Molecules

| Component | Use |
|-----------|-----|
| `WF/KPI Card` | dashboards |
| `WF/Filter chip` | list filters |
| `WF/Table row` | list pages |
| `WF/Tab item` | profile, settings |
| `WF/Timeline item` | activity |
| `WF/Approval row` | inbox |
| `WF/AI insight card` | dashboards |
| `WF/Empty state` | no data |
| `WF/Skeleton` | loading |

### Organisms

| Component | Use |
|-----------|-----|
| `WF/Page header` | title + actions |
| `WF/Filter bar` | search + chips |
| `WF/Data table` | AG Grid chrome |
| `WF/Dashboard grid` | 12-col |
| `WF/Profile header` | employee |
| `WF/Workbench` | payroll run |
| `WF/Kanban board` | recruitment |
| `WF/Calendar month` | leave, attendance |
| `WF/Report layout` | filter + chart + table |
| `WF/ESS bottom nav` | mobile |

### Templates

| Template | Description |
|----------|-------------|
| `TPL/Shell Desktop` | Zones A–D |
| `TPL/Shell Mobile` | Hamburger + bottom nav |
| `TPL/List + Drawer` | Standard CRUD |
| `TPL/Dashboard` | Widget framework |
| `TPL/Workbench` | Payroll processing |
| `TPL/ESS Portal` | Simplified |

### Pages

Full page wireframes composed from templates — one frame per `SCR-*` ID.

---

# Handoff Requirements

### To frontend team

| Deliverable | Spec |
|-------------|------|
| Frame names | `SCR-{ID} · {Title}` |
| Annotations | Permission keys, API route, query params |
| Responsive | Linked desktop + mobile frames |
| States | Default, loading, empty, error per screen |
| Drawer widths | `max-w-*` documented |
| Component mapping | WF/* → shadcn component list |
| Prototype links | Key flows: hire, leave approve, payroll lock |

### To backend team

| Deliverable | Spec |
|-------------|------|
| Screen ID → API map | From [HR_API_ARCHITECTURE.md](./HR_API_ARCHITECTURE.md) |
| Query params | `?create=1` `?view=` `?edit=` |
| Permission keys | Per action button annotation |
| Widget data endpoints | Dashboard KPI sources |

### To QA team

| Deliverable | Spec |
|-------------|------|
| Flow diagrams | Page 18 user journeys |
| Role variants | Frames: HR Mgr, Payroll Mgr, Employee ESS |
| Edge cases | Empty payroll run, locked period, SoD warning |
| Accessibility checklist | Focus order notes on drawers |

### To product team

| Deliverable | Spec |
|-------------|------|
| Screen inventory crosswalk | SCR-ID ↔ Figma frame |
| MVP scope tags | P1/P2/P3 on frames |
| Open questions | Sticky notes resolved before hi-fi |

---

# Wireframe State Matrix

Every primary screen needs variant frames:

| State | Annotation |
|-------|------------|
| **Default** | Populated data |
| **Loading** | Skeleton placeholders |
| **Empty** | Empty state component |
| **Error** | Inline error banner |
| **Permission denied** | Hidden actions / 403 page |
| **Mobile** | 375px layout |

**Payroll-specific:** `calculating` · `exceptions` · `pending_approval` · `locked`

---

# Cross-Reference Index

| Document | Wireframe use |
|----------|---------------|
| [HR_SCREEN_INVENTORY.md](./HR_SCREEN_INVENTORY.md) | Frame IDs, routes |
| [HR_UI_UX_BLUEPRINT.md](./HR_UI_UX_BLUEPRINT.md) | UX patterns |
| [HR_DASHBOARD_ARCHITECTURE.md](./HR_DASHBOARD_ARCHITECTURE.md) | Widget zones |
| [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md) | Hidden state annotations |
| [HR_AI_ASSISTANT_ARCHITECTURE.md](./HR_AI_ASSISTANT_ARCHITECTURE.md) | AI surfaces |
| [activity-system.md](../../04-uiux/standards/activity-system.md) | Activity drawer |
| [record-view.md](../../04-uiux/standards/record-view.md) | Profile patterns |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll |
| **Owner** | Product / Design |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Estimated frames** | 200+ (incl. mobile variants) |

---

**AgainERP HR & Payroll Figma Wireframe Blueprint** — structure before pixels. Foundation for Figma, UI design, UX flows, and frontend implementation.
