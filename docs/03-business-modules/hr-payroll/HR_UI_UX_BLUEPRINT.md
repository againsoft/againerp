# HR & Payroll — UI/UX Blueprint

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll (unified enterprise suite)  
> **Document Type:** UI/UX Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Route namespace:** `/hr/*` · `/payroll/*` · `/ess/*`  
> **Parent:** [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md) · [HR_WORKFLOW_ARCHITECTURE.md](./HR_WORKFLOW_ARCHITECTURE.md) · [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md) · [HR_ACTIVITY_LOG_ARCHITECTURE.md](./HR_ACTIVITY_LOG_ARCHITECTURE.md) · [HR_NOTIFICATION_ARCHITECTURE.md](./HR_NOTIFICATION_ARCHITECTURE.md)  
> **Governance:** [UI_UX_DESIGN_STANDARDS.md](../../04-uiux/standards/UI_UX_DESIGN_STANDARDS.md) · [ENTERPRISE_UI_ARCHITECTURE.md](../../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md) · [mobile-first.md](../../04-uiux/standards/mobile-first.md) · [PROJECT_COMMON_RULES.md](../../00-foundation/PROJECT_COMMON_RULES.md)

**No application code. No Figma files. No component implementation.**  
This document defines the **complete UI/UX blueprint** for AgainERP HR & Payroll — navigation, layouts, screens, responsive strategy, accessibility, and AI-ready patterns. Foundation for wireframes, Figma design, frontend development, and design system extension.

---

## Design Philosophy

### AgainERP HR design formula

```text
AgainERP HR UI = 60% Odoo + 20% Oracle HCM + 10% Linear + 10% Notion
```

| Source | Weight | What HR adopts |
|--------|--------|----------------|
| **Odoo** | 60% | Sidebar, employee form tabs, chatter/activity, smart buttons, approvals inbox |
| **Oracle HCM** | 20% | Workforce dashboard, org chart, employee 360° profile, payroll workbench |
| **Linear** | 10% | Command palette, keyboard shortcuts, status chips, fast density |
| **Notion** | 10% | Clean sections, inline edit blocks, minimal chrome on forms |

**Platform shell** remains shared with all modules per [ENTERPRISE_UI_ARCHITECTURE.md](../../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md) — HR does not invent a separate app chrome.

### Requirements checklist

| Requirement | HR implementation |
|-------------|-------------------|
| **Clean** | White space, one primary action per header |
| **Modern** | shadcn/ui + Lucide; subtle borders, no skeuomorphism |
| **Fast** | AG Grid virtual scroll; skeleton loaders; optimistic ESS actions |
| **Enterprise grade** | Bulk ops, audit tab, SoD-aware payroll UI |
| **Mobile friendly** | Full-width drawers; card lists; bottom nav for ESS |
| **AI ready** | ✨ panel on every admin page; ESS simplified AI |
| **Multi-company ready** | Company switcher scopes all lists |

### Mandatory CRUD rule

Per [PROJECT_COMMON_RULES.md](../../00-foundation/PROJECT_COMMON_RULES.md) — **list page + right Sheet drawer only**:

| Action | URL | Never use |
|--------|-----|-----------|
| List | `/hr/employees` | — |
| Create | `?create=1` | `/hr/employees/new` |
| View | `?view={id}` | `/hr/employees/[id]` full page |
| Edit | `?edit={id}` | `/hr/employees/[id]/edit` |

**Reference implementation:** `/catalog/products` · `/partners/directory` · `/manufacturing/work-orders`

**Employee profile exception:** View drawer may expand to `max-w-5xl` or **split layout** (profile + utility rail) — still URL-driven on list route, not a separate page route.

---

## UI Philosophy

> **Workforce data is dense; the UI must feel light.**

| Belief | UX consequence |
|--------|----------------|
| HR users live in lists | AG Grid default; saved filters |
| Managers act on exceptions | Dashboard highlights pending approvals |
| Employees use ESS on phone | ESS is a simplified shell |
| Payroll is high-stakes | Confirmation steps, lock indicators, SoD warnings |
| Every record has a story | Activity icon on every grid row |
| Permission is invisible | Hide actions user cannot perform — never disabled tease |

---

## UX Principles

| # | Principle | Spec |
|---|-----------|------|
| 1 | **One shell** | Same header/sidebar as ERP — HR is a module group |
| 2 | **Drawer CRUD** | All create/view/edit in right Sheet |
| 3 | **Progressive disclosure** | Summary → tabs → advanced settings |
| 4 | **Status at a glance** | Color-coded badges (employment, payroll, approval) |
| 5 | **Keyboard first** | `Ctrl+K` search · `Ctrl+J` AI · `Esc` close drawer |
| 6 | **Mobile first** | 375px design baseline; 44px tap targets |
| 7 | **Permission-aware** | `hr.*` / `payroll.*` / `ess.*` manifest |
| 8 | **Company scoped** | Active company filters all data |
| 9 | **Audit visible** | Activity + Audit tabs on sensitive records |
| 10 | **Error recovery** | Inline validation; payroll exceptions as fixable rows |
| 11 | **Consistent density** | Table row 40px desktop; card list mobile |
| 12 | **i18n ready** | No hard-coded labels in wireframe spec |

---

## Navigation Architecture

### Module registration

HR & Payroll registers two sidebar groups (or one nested group per tenant plan):

```text
HR & Payroll (Users icon)
├── Dashboard                 /hr
├── Employees                 (submenu)
├── Recruitment               /hr/recruitment
├── Attendance                /hr/attendance
├── Shifts                    /hr/shifts
├── Leave                     /hr/leave
├── Payroll                   (submenu)
├── Overtime                  /hr/overtime
├── Loans & Advances          /payroll/loans
├── Performance               /hr/performance
├── Training                  /hr/training
├── Assets                    /hr/assets
├── Travel & Expense          /hr/travel · /hr/expenses
├── Reports                   (submenu)
├── Settings                  (submenu)
└── AI Assistant              /hr/ai  (or global panel)

Employee Self-Service (separate app entry)
└── ESS Portal                /ess
```

### Employees submenu

```text
Employees
├── Employee Directory        /hr/employees
├── Organization              /hr/organization
├── Departments               /hr/organization/departments
├── Designations              /hr/organization/designations
├── Employment Types          /hr/organization/employment-types
└── Employee Documents        /hr/documents
```

### Payroll submenu

```text
Payroll
├── Payroll Dashboard         /payroll
├── Payroll Runs              /payroll/runs
├── Payslips                  /payroll/payslips
├── Salary Structures         /payroll/structures
└── Payroll Reports           /payroll/reports
```

### Reports submenu

```text
Reports
├── HR Reports                /hr/reports
└── Payroll Reports           /payroll/reports
```

### Settings submenu

```text
Settings
├── HR Settings               /hr/settings
├── Payroll Settings          /payroll/settings
├── Attendance Devices        /hr/settings/devices
├── Leave Policies            /hr/settings/leave
└── Notification Preferences  /settings/notifications (Core)
```

### Role-based visibility

| Menu item | Minimum permission |
|-----------|-------------------|
| Employees | `hr.employee.view` |
| Payroll | `payroll.access` |
| Salary structures | `payroll.structure.view` |
| ESS | `ess.access` (separate nav entry for employees) |
| Settings | `hr.settings.manage` / `payroll.tax.manage` |

Hidden when `module.hr` / `module.payroll` off for tenant.

### Breadcrumb pattern

```text
HR & Payroll / Employees / Directory / [Employee Name]
```

Clickable ancestors; current record name when drawer open.

---

## Layout Architecture

Uses global **Application Shell** — HR does not customize shell structure.

### Desktop zones

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ TOP NAV: Logo · ⌘K Search · Company ▾ · Branch ▾ · 🔔 · 📋 · ✨AI · 👤  │
├──────────┬──────────────────────────────────────────────┬───────────────┤
│ SIDEBAR  │  Breadcrumb                                  │  (optional)   │
│ HR menu  │  Page title · Primary actions · Secondary    │  Utility rail │
│          │  ───────────────────────────────────────────  │  on profile   │
│          │  Filters · View toggle · Content              │               │
│          │  [ AG Grid | Dashboard | Kanban | Calendar ]  │               │
│          │                                              │               │
└──────────┴──────────────────────────────────────────────┴───────────────┘
                              │
                    Sheet drawer (right, over content)
                    ?create | ?view | ?edit
```

### Drawer widths

| Entity | Width | Notes |
|--------|-------|-------|
| Standard CRUD | `max-w-3xl` | Leave, OT, loan |
| Employee profile | `max-w-5xl` or full-screen sheet tablet | Oracle HCM density |
| Payroll run review | `max-w-4xl` | Exception list + summary |
| Payslip preview | `max-w-2xl` | PDF viewer |
| Activity & Chatter | `max-w-lg` | Global activity drawer |

### Page shell component (conceptual)

`HrPageShell` / `PayrollPageShell` — mirrors `PartnersPageShell`, `ManufacturingPageShell`:

- Title + description
- KPI strip (optional)
- Primary CTA (permission-gated)
- Children (grid, dashboard, calendar)

---

## Screen Architecture

### Screen types

| Type | Pattern | Examples |
|------|---------|----------|
| **Overview** | KPI cards + charts + quick actions | `/hr`, `/payroll` |
| **Directory** | AG Grid + drawer CRUD | Employees, candidates |
| **Workbench** | Multi-step + status bar | Payroll run processing |
| **Calendar** | Month/week grid | Leave, shifts, attendance |
| **Kanban** | Pipeline columns | Recruitment |
| **Profile** | Header + tabs + right rail | Employee view drawer |
| **Settings** | Sectioned form (Notion-style) | HR settings |
| **Report center** | Filter sidebar + table/chart | `/hr/reports` |
| **Portal** | Simplified ESS shell | `/ess` |

### Standard list page anatomy

```text
Page header
  ├── Title
  ├── Primary action (Create) — if hr.*.create
  └── Secondary (Export, Import)

Filter bar
  ├── Quick search
  ├── Status chips
  ├── Department / branch filters
  └── Advanced filter drawer

AG Grid
  ├── Row: main columns
  ├── Activity icon column (mandatory)
  └── Row actions menu (View, Edit, …)

Sheet drawer (URL-driven)
```

### Activity integration (mandatory)

Every list grid includes **Activity** column → `ActivityTriggerButton` → Global Activity Drawer per [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md).

Tabs in drawer: Overview · Activities · Comments · Notes · Attachments · AI Actions · History

---

## Responsive Strategy

Per [mobile-first.md](../../04-uiux/standards/mobile-first.md).

| Breakpoint | Layout |
|------------|--------|
| **< 640px** | Hamburger sidebar; full-width drawer; card list instead of grid |
| **640–1024px** | Collapsed sidebar; drawer full width |
| **≥ 1024px** | Full sidebar; `max-w-*` drawer |
| **≥ 1280px** | Optional right utility rail on employee profile |

| Pattern | Mobile | Desktop |
|---------|--------|---------|
| Employee list | Stacked cards | AG Grid |
| Dashboard KPIs | 2-column grid | 4-column grid |
| Org chart | Drill-down list | Interactive tree |
| Payslip | Full-screen PDF | Side-by-side preview |
| ESS | Bottom nav (5 items) | Same as desktop ESS |

**Touch:** 44×44px minimum; 8px gap between actions.

---

## Accessibility Strategy

| Requirement | Implementation |
|-------------|----------------|
| **WCAG 2.1 AA** | Platform design tokens |
| **Keyboard navigation** | Tab order: header → filters → grid → drawer |
| **Screen readers** | `aria-label` on status badges; live regions for toast |
| **Color contrast** | Status colors paired with icon + text label |
| **Large text** | rem-based typography; respects OS scale |
| **Focus trap** | Sheet drawer traps focus when open |
| **Skip link** | Skip to main content |
| **Reduced motion** | Respect `prefers-reduced-motion` on charts |

Employment status never conveyed by color alone — always text badge.

---

## AI Ready UX

| Surface | Behavior |
|---------|----------|
| **Header ✨ button** | Opens AI panel (`Ctrl+J`) |
| **HR AI page** | `/hr/ai` — suggested prompts for HR Manager |
| **In-context** | Employee drawer → AI Actions tab |
| **ESS** | Limited prompts (own leave balance, payslip explain) |
| **Payroll** | "Validate run" suggestion before lock |

AI never shows data user cannot permission-read. Suggestions link to records — no auto-apply on payroll.

---

# Global Page Layout

### Top navigation (56px sticky)

| Element | HR behavior |
|---------|-------------|
| **Logo** | Links to `/hr` or user home module |
| **Global search** | Includes employees, departments, payslips (scoped) |
| **Company switcher** | Resets HR lists to selected company |
| **Branch switcher** | Filters attendance, headcount widgets |
| **Notification center** | Bell — HR categories per notification architecture |
| **Activities** | Open tasks counter (onboarding, reviews) |
| **AI assistant** | Opens right panel |
| **User menu** | Profile, ESS link, logout |

### Sidebar

240px expanded / 64px collapsed; HR group icon `Users` or `Briefcase`.

### Quick create (`+` dropdown)

When user has create permissions:

- New employee · Leave request · Payroll run · Job requisition · Training session

---

# Dashboard UX (`/hr`)

Oracle HCM + Odoo inspired workforce command center.

### KPI cards (row 1)

| Card | Metric | Drill-down |
|------|--------|------------|
| Total employees | Active headcount | `/hr/employees?status=active` |
| Present today | % present | `/hr/attendance?date=today` |
| On leave today | Count | `/hr/leave?status=approved&today=1` |
| Pending approvals | Count | `/inbox/approvals?module=hr` |
| Open positions | Requisitions | `/hr/recruitment` |
| Payroll status | Current period state | `/payroll/runs` |

### Charts (row 2)

| Chart | Type |
|-------|------|
| Headcount by department | Horizontal bar |
| Attendance trend (30d) | Line |
| Leave by type (month) | Donut |

### Widgets (row 3)

| Widget | Content |
|--------|---------|
| **Recent activities** | Last 10 workforce events (activity feed) |
| **Pending approvals** | Mini inbox list |
| **Attendance summary** | Late / absent highlights |
| **Payroll summary** | Days to pay date, run status |
| **Leave summary** | Who's out this week |
| **Upcoming events** | Trainings, reviews due |
| **Birthdays** | Next 7 days |
| **Work anniversaries** | Next 7 days |

### Quick actions

`Add employee` · `Run payroll` · `Review leave` · `Post job` · `Import attendance`

**Mobile:** KPI 2-col; charts stack; quick actions horizontal scroll.

---

# Employee List Screen (`/hr/employees`)

### Table layout (AG Grid)

| Column | Notes |
|--------|-------|
| Photo | Avatar thumbnail |
| Employee | Name + number (link → `?view=`) |
| Department | |
| Designation | |
| Branch | |
| Manager | |
| Status | Badge: active, probation, on_leave, terminated |
| Join date | |
| Activity | Icon button |

### Filters

| Filter | Type |
|--------|------|
| Quick search | Name, ID, email |
| Status | Multi-select chips |
| Department | Tree select |
| Branch | Select |
| Employment type | Select |
| Advanced | Drawer: manager, date range, tags |

### Bulk actions

Export · Send announcement · Assign training (permission-gated)

### Import / export

Import: CSV template wizard in drawer  
Export: `hr.employee.export` — logs activity

### Quick view

Mobile card tap → view drawer. Desktop optional hover preview (future).

---

# Employee Profile Screen

**Most important HR screen** — Oracle HCM 360° pattern inside view drawer (`?view={id}`).

### Profile header

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ [Photo]  Jane Akter · EMP-0042                    [Edit] [Actions ▾]  │
│          Senior Engineer · Engineering · Dhaka Branch                   │
│          ● Active · Reports to: Karim Rahman                            │
│ Smart buttons: Leave · Attendance · Payslip · Assets · Activity       │
└─────────────────────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| **Photo** | Upload on edit; placeholder initials |
| **Name** | From Core contact |
| **Employee ID** | `employee_number` |
| **Designation / dept / branch** | Subtitle line |
| **Employment status** | Badge + probation indicator |
| **Manager** | Link → open manager profile drawer |
| **Quick actions** | Permission-gated: Edit, Terminate, Transfer, Print |

### Profile tabs

| Tab | Content | Permission |
|-----|---------|------------|
| **Overview** | Summary cards, org info, contact | `hr.employee.view` |
| **Personal** | DOB, gender, address, emergency | `hr.employee.view` |
| **Employment** | Dates, type, grade, cost center | `hr.employee.view` |
| **Salary & compensation** | Structure link, history | `hr.sensitive.view` |
| **Attendance** | Mini calendar + recent | `hr.attendance.view` |
| **Leave** | Balance cards + history | `hr.leave.view` |
| **Payroll** | Payslip list | `payroll.payslip.view_all` or self |
| **Assets** | Assigned items | `hr.asset.view` |
| **Performance** | Goals, last review | `hr.performance.view` |
| **Training** | Enrollments, certs | `hr.training.view` |
| **Documents** | File list + expiry | `hr.document.view` |
| **Notes** | Internal HR notes | `hr.employee.view` |
| **Activity timeline** | 360° chronological | `hr.employee.view` |
| **Audit history** | Compliance field diffs | `hr.audit.export` / HR Manager |

### Profile right panel (desktop ≥1280px)

| Widget | Content |
|--------|---------|
| Upcoming events | Leave, reviews |
| Pending requests | Open ESS items |
| Assigned assets | Count + list |
| Leave balance | By type progress bars |
| Quick stats | Tenure, attendance % |

**Mobile:** Right panel stacks below tabs.

### Profile timeline tab

Chronological merge per [HR_ACTIVITY_LOG_ARCHITECTURE.md](./HR_ACTIVITY_LOG_ARCHITECTURE.md):

- Promotion · Transfer · Salary change · Leave · Training · Performance · Assets · Documents

Visual: Linear-style vertical timeline with icons per event type.

---

# Organization Screens

| Screen | Route | Layout |
|--------|-------|--------|
| **Departments** | `/hr/organization/departments` | Tree table + drawer CRUD |
| **Designations** | `/hr/organization/designations` | Simple grid + drawer |
| **Locations** | `/hr/organization/locations` | Grid + map pin (future) |
| **Branches** | Core `/settings` link | Read-through |
| **Reporting structure** | `/hr/organization/reporting` | Manager → reports tree |
| **Org chart** | `/hr/organization/chart` | Interactive hierarchy (Oracle HCM style) |

### Org chart UX

- Zoom/pan canvas
- Click node → employee drawer
- Filter by department
- Export PNG (permission-gated)

---

# Recruitment UX (`/hr/recruitment`)

### Kanban + table hybrid

| View | Use |
|------|-----|
| **Pipeline (default)** | Kanban by stage: Applied → Screen → Interview → Offer → Hired |
| **Table** | All candidates — bulk actions |
| **Requisitions** | Tab — job openings grid |

### Screens

| Screen | Pattern |
|--------|---------|
| Job positions | Grid + drawer |
| Candidates | Kanban columns + card |
| Interview pipeline | Calendar + candidate drawer tab |
| Offer management | Drawer tab with approval status |

### Candidate card (Kanban)

Name · Applied role · Score · Days in stage · Activity icon

Drag-drop changes stage (permission + workflow guard).

---

# Attendance UX (`/hr/attendance`)

### Sub-screens

| Screen | Route |
|--------|-------|
| Attendance dashboard | `/hr/attendance` |
| Daily attendance | `/hr/attendance/daily` |
| Monthly summary | `/hr/attendance/monthly` |
| Corrections | `/hr/attendance/corrections` |
| Device logs | `/hr/attendance/devices` |
| Sync status | `/hr/settings/devices` |
| Analytics | `/hr/attendance/analytics` |

### Visualization modes (toggle)

| View | Description |
|------|-------------|
| **Calendar** | Month grid — color per status |
| **Table** | Daily rows AG Grid |
| **Timeline** | Punch in/out per day |
| **Heatmap** | Late/absent patterns by dept |

### Status colors (with text labels)

Present · Absent · Late · Half-day · Leave · Holiday · WFH · Outdoor

### Correction UX

Row action → correction drawer → reason → submit → approval badge

---

# Shift Management UX (`/hr/shifts`)

| Screen | Layout |
|--------|--------|
| Shift list | Grid of shift definitions |
| Shift calendar | Week view — rows = employees |
| Shift assignment | Bulk assign drawer |
| Rotation planner | Pattern builder form |
| Conflict detection | Banner alerts on calendar |

---

# Leave Management UX (`/hr/leave`)

| Screen | Layout |
|--------|--------|
| Leave dashboard | KPIs + who's out calendar |
| Leave requests | Grid + drawer |
| Leave calendar | Team calendar (manager) |
| Leave balance | Grid by employee/type |
| Leave policies | Settings-style sections |
| Approval center | Embedded or link `/inbox/approvals` |

### Leave request drawer

Date range picker · Half-day toggle · Type · Reason · Balance preview · Submit

---

# Payroll UX

**Critical** — enterprise payroll workbench (Oracle HCM + SAP-style clarity).

### Payroll dashboard (`/payroll`)

| Widget | Content |
|--------|---------|
| Payroll status | Current period badge |
| Pending payroll | Run in progress |
| Payroll calendar | Pay dates |
| Salary trends | Chart (aggregated) |
| Approval queue | Runs awaiting sign-off |

### Payroll processing (`/payroll/runs` + `?view={id}`)

```text
Status bar: Draft → Calculated → In Review → Approved → Locked → Posted

Sections:
├── Period selector
├── Employee scope (all / group / branch)
├── Calculation status progress
├── Exceptions table (fix links)
├── Approval panel
└── Lock / Publish / Post actions (SoD-separated buttons)
```

| Field | UI |
|-------|-----|
| Payroll period | Read-only when locked |
| Batch | Run number + dates |
| Calculation status | Progress bar |
| Approval status | Step indicator |
| Lock status | Red banner when locked |

**SoD UX:** User who calculated sees warning on Approve button — delegate required.

### Payslip UX (`/payroll/payslips`)

| Feature | Spec |
|---------|------|
| Employee payslip | Drawer: earnings/deductions table |
| PDF preview | Embedded viewer |
| Download | Button → activity log |
| Email | Resend (permission) |
| History | Prior periods list |

### Salary structure UX (`/payroll/structures`)

| Screen | Layout |
|--------|--------|
| Components | Earning/deduction master grid |
| Structures | Header + lines sub-grid in drawer |
| Tax rules | Sectioned settings form |
| Benefits | Component flags |

---

# Loan & Advance UX (`/payroll/loans`)

| Screen | Content |
|--------|---------|
| Loan dashboard | Active loans KPI |
| Loan requests | Grid + approval drawer |
| Installments | Schedule tab in loan view |
| Advance requests | Separate tab or `/payroll/advances` |
| Recovery tracking | Progress bar on employee profile |

---

# Performance UX (`/hr/performance`)

| Screen | Layout |
|--------|--------|
| Goals | Grid + drawer; link to employee |
| KPIs | Admin settings + assignment |
| Review cycles | Cycle list → launch wizard |
| Reviews | Grid by status |
| Recommendations | Promotion pipeline kanban |

---

# Training UX (`/hr/training`)

| Screen | Layout |
|--------|--------|
| Training dashboard | Upcoming sessions |
| Courses | Catalog grid |
| Schedules | Calendar |
| Attendance | Session roster checkboxes |
| Certificates | List with download |
| Evaluations | Star rating form in drawer |

---

# Asset Management UX (`/hr/assets`)

| Screen | Layout |
|--------|--------|
| Asset inventory | Grid with status |
| Assignment | From employee tab or asset action |
| Returns | Workflow drawer |
| Damage reports | Form + photos |
| Asset history | Timeline in view drawer |

---

# Reporting UX (`/hr/reports` · `/payroll/reports`)

### Report center layout

```text
┌─────────────┬───────────────────────────────────────┐
│ Categories  │  Report title · Run · Export          │
│ (sidebar)   │  Filters · Date range · Branch        │
│             │  ─────────────────────────────────────│
│ Employee    │  Table or chart output                │
│ Attendance  │                                       │
│ Leave       │  Saved reports · Schedule (future)    │
│ Payroll     │                                       │
│ Compliance  │                                       │
└─────────────┴───────────────────────────────────────┘
```

| Feature | Spec |
|---------|------|
| Saved reports | User bookmarks |
| Scheduled reports | Email delivery (future) |
| Exports | CSV/PDF — activity logged |
| Analytics | Chart widgets for HR dashboard reuse |

---

# Approval Center UX

**Route:** `/inbox/approvals` (global) with `?module=hr` filter

| Tab | Content |
|-----|---------|
| Pending | Action required — approve/reject |
| Approved | History |
| Rejected | History |
| Escalated | SLA breach highlight |

### Filters

Module (HR / Payroll) · Type (leave, payroll, loan) · Date · Priority

### Row layout

Icon · Title · Requester · Amount/days · Due · AI hint (optional) · Actions

**Mobile:** Card list; swipe actions (future).

---

# Notification Center UX

**Route:** `/notifications` or header bell dropdown

| Section | Spec |
|---------|------|
| Unread | Badge count; bold title |
| Read | Muted styling |
| Priority | Pin critical to top |
| Actions | Deep link to record/drawer |
| History | Infinite scroll |

Group by category: Approvals · Payroll · Leave · System

---

# Activity Log UX

| Surface | Scope |
|---------|-------|
| Global activity drawer | Single entity from grid icon |
| Employee timeline tab | 360° aggregated |
| Payroll run history | Run view drawer tab |
| Attendance correction | Before/after diff card |

### Advanced filters

Employee · Department · Branch · Date range · Action type · User · Module

---

# Self Service Portal UX (`/ess`)

Separate **simplified shell** for employees — not full admin sidebar.

### ESS bottom nav (mobile)

`Home` · `Attendance` · `Leave` · `Payslips` · `More`

### ESS screens

| Screen | Purpose |
|--------|---------|
| Employee dashboard | Leave balance, next payslip, announcements |
| Attendance | Own calendar; request correction |
| Leave | Apply + history |
| Payslips | List + PDF |
| Documents | Upload requested docs |
| Assets | View assigned |
| Training | Enroll + certs |
| Performance | Self-review form |
| Requests | All open ESS items |

**UX:** Large touch targets; minimal jargon; no other employees' data.

---

# AI Assistant Panel UX

Right utility panel (or modal on mobile) — `Ctrl+J`.

### HR admin prompts (examples)

- "Show employees absent today in {branch}"
- "Generate attendance summary for last week"
- "Find employees with attendance below 90%"
- "Show pending payroll approvals"
- "Who is eligible for promotion in Engineering?"
- "Explain payslip deductions for EMP-0042"

### Panel anatomy

```text
┌─────────────────────────────┐
│ AI HR Assistant         [×] │
├─────────────────────────────┤
│ Suggested prompts (chips)   │
├─────────────────────────────┤
│ Conversation thread         │
│  - User question            │
│  - AI answer + sources      │
│  - [Open record] links      │
├─────────────────────────────┤
│ Input · Send                │
└─────────────────────────────┘
```

Responses cite record links → open drawers. High-risk actions show "Submit for approval" — never silent apply.

---

# Global Search UX

Extend command palette (`Ctrl+K`) with HR entities:

| Category | Search fields |
|----------|---------------|
| Employees | Name, number, email |
| Departments | Name, code |
| Attendance | Employee + date jump |
| Payroll | Run number, period |
| Documents | Title, type |
| Assets | Tag, serial |
| Requests | Request ID |
| Reports | Report name |

RBAC + company scoped. Recent employees pinned for HR users.

---

# Mobile UX Strategy

| Area | Strategy |
|------|----------|
| **Admin HR** | Hamburger + collapsible filters; full-width drawer |
| **Manager** | ESS + approval inbox optimized |
| **Employee ESS** | Primary mobile experience |
| **Dashboard** | 2-col KPI; scroll widgets |
| **Payroll** | Read-only on mobile for exec; process on desktop only |
| **Offline** | ESS read cache (future PWA) |

---

# Design System Requirements

HR uses platform design system — extensions below.

| Component | HR usage |
|-----------|----------|
| **Tables** | AG Grid — `HrAgGrid` wrapper |
| **Forms** | shadcn Form; sections with Notion-style headings |
| **Cards** | KPI, employee summary, leave balance |
| **Tabs** | Profile, payroll run, settings |
| **Modals** | Rare — confirm terminate, lock payroll |
| **Drawers** | Primary CRUD Sheet |
| **Kanban** | Recruitment pipeline |
| **Timeline** | Employee activity, audit |
| **Calendar** | Leave, attendance, shifts |
| **Charts** | Recharts — dashboard widgets |
| **Badges** | Employment, approval, payroll status |
| **Status indicators** | Dot + label; payroll lock banner |

### HR status badge registry

| Domain | Values |
|--------|--------|
| Employment | active, probation, on_leave, suspended, terminated |
| Leave | draft, pending, approved, rejected |
| Attendance | present, absent, late, leave, wfh |
| Payroll run | draft, calculated, approved, locked, posted |
| Payslip | draft, published |

### Permission-aware components

`PermissionGate permission="hr.employee.create"` wraps buttons — pattern from platform manifest.

---

# Component Map (planning)

| Component | Purpose |
|-----------|---------|
| `HrPageShell` | Page wrapper |
| `HrAgGrid` | Shared grid defaults |
| `EmployeeGrid` | Directory |
| `EmployeeViewDialog` | Profile drawer |
| `EmployeeFormDialog` | Create/edit |
| `EmployeeDetailContent` | Tabs body |
| `PayrollRunWorkbench` | Processing UI |
| `LeaveCalendar` | Team calendar |
| `AttendanceHeatmap` | Analytics |
| `RecruitmentKanban` | Pipeline |
| `EssShell` | ESS layout |
| `HrControlCenter` | Dashboard widgets |

Prototype path mirrors: `apps/web/src/components/hr/*` (future build guide).

---

# Wireframe → Build Phases (reference)

| Phase | Deliverable | Route |
|-------|-------------|-------|
| P1 | Nav + HR dashboard | `/hr` |
| P2 | Employee grid + drawer | `/hr/employees` |
| P3 | Profile tabs (core) | `?view=` |
| P4 | Leave + attendance | `/hr/leave`, `/hr/attendance` |
| P5 | Payroll dashboard + runs | `/payroll` |
| P6 | ESS portal | `/ess` |
| P7 | Recruitment kanban | `/hr/recruitment` |
| P8 | Reports + settings | `/hr/reports`, settings |

Detailed screen specs: future `docs/ui-prototype/hr-payroll/HR_PAYROLL_UI_BUILD_GUIDE.md`

---

# Cross-Document Alignment

| Doc | UI impact |
|-----|-----------|
| [HR_WORKFLOW_ARCHITECTURE.md](./HR_WORKFLOW_ARCHITECTURE.md) | Status bars, approval panels |
| [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md) | Hidden actions, field masking |
| [HR_ACTIVITY_LOG_ARCHITECTURE.md](./HR_ACTIVITY_LOG_ARCHITECTURE.md) | Timeline + activity drawer |
| [HR_NOTIFICATION_ARCHITECTURE.md](./HR_NOTIFICATION_ARCHITECTURE.md) | Bell, badges, deep links |
| [HR_DATABASE_ARCHITECTURE.md](./HR_DATABASE_ARCHITECTURE.md) | Entity → screen mapping |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll |
| **Owner** | Platform / HR domain |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Parent** | [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md) |

---

**AgainERP HR & Payroll UI/UX Blueprint** — enterprise workforce experience. One shell. Drawer CRUD. Employee 360°. Mobile ESS. AI-ready. No code.
