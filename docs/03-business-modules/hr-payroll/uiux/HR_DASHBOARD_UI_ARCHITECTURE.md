# HR & Payroll — Dashboard UI Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll (reference implementation)  
> **Document Type:** Dashboard UI / Wireframe Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_DASHBOARD_ARCHITECTURE.md](../HR_DASHBOARD_ARCHITECTURE.md) · [HR_UI_UX_BLUEPRINT.md](../HR_UI_UX_BLUEPRINT.md) · [HR_SCREEN_INVENTORY.md](../HR_SCREEN_INVENTORY.md) · [uiux/HR_NAVIGATION_ARCHITECTURE.md](./HR_NAVIGATION_ARCHITECTURE.md) · [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md)  
> **Governance:** [dashboard-widgets.md](../../../04-uiux/standards/dashboard-widgets.md) · [UI_UX_DESIGN_STANDARDS.md](../../../04-uiux/standards/UI_UX_DESIGN_STANDARDS.md) · [layout-architecture.md](../../../04-uiux/standards/layout-architecture.md) · [ai-assistant-ui.md](../../../04-uiux/standards/ai-assistant-ui.md) · [SAAS_PLATFORM_ARCHITECTURE.md](../../../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md) · [database/multi-company.md](../../../05-development/database/multi-company.md)

**No visual mockups. No component code.**  
Defines **dashboard wireframe structure, zone layouts, widget placement, KPI chrome, and responsive behavior** for AgainERP HR & Payroll. Foundation for dashboard wireframes, UI design, frontend development, analytics widgets, KPI framework, and AI dashboard experience.

**Data & KPI definitions:** [HR_DASHBOARD_ARCHITECTURE.md](../HR_DASHBOARD_ARCHITECTURE.md) · **Widget IDs:** `WGT-*` · **Screen IDs:** `SCR-*-DSH-*`

---

## Executive Summary

| Principle | UI rule |
|-----------|---------|
| **Zone-based composition** | Every dashboard = Zones A–H in defined order |
| **12-column grid** | Per [dashboard-widgets.md](../../../04-uiux/standards/dashboard-widgets.md) |
| **Exceptions first** | Zone D (approvals) visible above fold when non-empty |
| **Drill-down everywhere** | KPI/chart click → filtered list or report |
| **Widget isolation** | One widget failure does not break layout |
| **AI advisory zone** | Zone G never auto-executes payroll actions |
| **Mobile reorder** | KPI → Actions → Approvals → Charts |

**HR role:** First full-domain dashboard UI pattern — other modules adopt same `DSH-ZONE-*` framework.

---

# Dashboard UI Philosophy

### Core belief

> **A dashboard is a decision surface — wireframes define where attention flows before pixels define how it looks.**

| UI answers | Zone |
|------------|------|
| **What period am I viewing?** | Zone A — Header |
| **What is the headline number?** | Zone B — KPIs |
| **What is trending?** | Zone C — Analytics |
| **What needs my action?** | Zone D — Approvals |
| **What just happened?** | Zone E — Activity |
| **What was I told?** | Zone F — Notifications |
| **What should I consider?** | Zone G — AI Insights |
| **What can I do next?** | Zone H — Quick Actions |

### Dashboard vs list screen (UI)

| Dashboard | List screen |
|-----------|-------------|
| Widget grid, read-mostly | AG Grid, CRUD |
| Customizable layout | Fixed layout |
| Aggregated metrics | Row-level records |
| Drill-down links out | Drawer on same route |

### Wireframe fidelity

Grayscale boxes · placeholder chart areas · widget title labels · grid span annotations (`6×3`) — no brand colors or typography specs.

---

# Dashboard Design Principles

| # | Principle | Wireframe implication |
|---|-----------|----------------------|
| 1 | **Role-first landing** | Default template per role — see templates `DSH-*` |
| 2 | **F-pattern scanning** | KPIs top-left; actions top-right column |
| 3 | **Density without clutter** | Max 8 KPIs visible without scroll (desktop) |
| 4 | **Progressive chart depth** | Sparkline in KPI; full chart in Zone C |
| 5 | **Empty state clarity** | "No pending approvals" — not blank box |
| 6 | **Skeleton per widget** | Independent loading blocks |
| 7 | **Stale data visible** | "Updated 5m ago" in widget footer |
| 8 | **SoD visual cues** | Payroll lock banner in Zone A when applicable |
| 9 | **PII boundaries** | Executive dashboard — no employee names in widgets |
| 10 | **Touch-friendly ESS** | Larger KPI cards; chip quick actions |

---

# Dashboard Layout Strategy

### Grid system

| Property | Value |
|----------|-------|
| Columns | **12** |
| Row height unit | **80px** |
| Gutter | **16px** (`--space-4`) |
| Page padding | **24px** |
| Min widget | **3×2** cols×rows |
| Max widget | **12×4** |

### Standard desktop wireframe (full page)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ZONE A — HEADER (12×1)                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE B — KPI ROW (12×2)  [KPI][KPI][KPI][KPI]                               │
├───────────────────────────────────────┬─────────────────────────────────────┤
│ ZONE C — ANALYTICS (8 col)            │ ZONE D — APPROVALS (4 col)          │
│ [Chart 6×3][Chart 6×3]                │ [Pending list 4×6]                │
├───────────────────────────────────────┴─────────────────────────────────────┤
│ ZONE E — ACTIVITY (6 col)             │ ZONE F — NOTIFICATIONS (6 col)    │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE G — AI INSIGHTS (12×2)  [Insight][Insight][Insight]                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE H — QUICK ACTIONS (12×1)  [btn][btn][btn][btn][btn]                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Zone priority when viewport shrinks

| Order | Zone | Mobile visibility |
|-------|------|-------------------|
| 1 | B — KPIs | Always |
| 2 | D — Approvals | If pending count > 0 |
| 3 | H — Quick actions | Horizontal scroll |
| 4 | F — Notifications | Top 5 + link |
| 5 | G — AI insights | 1 card collapsed |
| 6 | C — Analytics | Stacked, tap expand |
| 7 | E — Activity | Collapsed accordion |

---

# Widget Strategy

### Widget registry (UI layer)

Inherits types from [HR_DASHBOARD_ARCHITECTURE.md](../HR_DASHBOARD_ARCHITECTURE.md):

| Type | Code | Wireframe body |
|------|------|----------------|
| KPI card | `KPI` | Value block + trend row |
| Chart | `CHT` | Chart placeholder rectangle |
| Table | `TBL` | 5-row table skeleton |
| List | `LST` | Avatar + title + meta rows |
| Calendar mini | `CAL` | 7-day strip |
| Progress | `PRG` | Bar + % label |
| AI insight | `AI` | Icon + 2-line summary + confidence |
| Quick actions | `QAC` | Button chip row |
| Status banner | `BNR` | Full-width alert strip |

### Widget chrome (wireframe)

```text
┌─────────────────────────────────────────┐
│ ⋮⋮  Widget Title              [⋯] [×]   │  ← header (edit mode only: ⋮⋮ ×)
├─────────────────────────────────────────┤
│                                         │
│  [BODY — type-specific placeholder]     │
│                                         │
├─────────────────────────────────────────┤
│ Updated 5m ago · [View details →]       │  ← footer (optional)
└─────────────────────────────────────────┘
```

### Widget placement rules

| Rule | Detail |
|------|--------|
| WP-01 | KPIs always in Zone B unless pinned elsewhere |
| WP-02 | Banners (`BNR`) span full width above KPIs |
| WP-03 | Approval lists max height 6 rows — scroll inside widget |
| WP-04 | AI insights max 3 per row desktop |
| WP-05 | Charts minimum `6×3` for readability |
| WP-06 | Related KPI + chart should be adjacent when possible |

---

# Responsive Strategy

| Breakpoint | Width | Dashboard layout |
|------------|-------|------------------|
| **Desktop** | ≥1280px | Full A–H zones; C+D side-by-side |
| **Tablet** | 768–1279px | C and D stack; KPI 3-col |
| **Mobile** | <768px | Single column; KPI 2-col; no drag-edit |

| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| KPI grid | 4 per row | 3 per row | 2 per row |
| Analytics | 2 per row | 1 per row | 1 per row, tap expand |
| Approvals | Right column | Full width below KPIs | List cards |
| Quick actions | Button row | Wrap | Horizontal scroll chips |
| Customize | Edit mode toggle | Edit mode | Hidden (view only) |
| AI panel | Zone G cards | Stack | Single card + "More" |

**ESS mobile:** Dashboard = home tab; zones simplified to B + H + My Widgets stack.

**Payroll processing:** Workbench is desktop-first — mobile dashboard shows KPI status only (`WGT-PAY-KPI-*`).

---

# AI First Dashboard Strategy

| Pattern | Zone | Behavior |
|---------|------|----------|
| **Daily AI briefing** | Zone G banner | 1-sentence summary at top of G |
| **Contextual insights** | Zone G cards | Domain-specific per dashboard |
| **AI summary in header** | Zone A optional | "✨ 3 new insights" link |
| **Drill to AI hub** | Footer link | `/hr/ai/insights?category={}` |
| **Ask about dashboard** | Zone A button | Opens panel with dashboard context |
| **No auto-act** | All zones | Actions require explicit user click |

Per [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md) — payroll AI is **auditor mode only** on dashboards.

---

# Dashboard Framework

Standard zones **A through H** — all HR dashboards compose from this framework.

| Zone | Name | Grid default | Primary widget types |
|------|------|--------------|----------------------|
| **A** | Header Area | 12×1 | Filters, scope, actions |
| **B** | KPI Area | 12×2 | `KPI` × 4–8 |
| **C** | Analytics Area | 8×6 | `CHT` × 2–4 |
| **D** | Approval Area | 4×6 | `LST` (approval queues) |
| **E** | Activity Area | 6×4 | `LST` (activity feed) |
| **F** | Notification Area | 6×4 | `LST` (notifications) |
| **G** | AI Insight Area | 12×2 | `AI` × 1–3 |
| **H** | Quick Actions Area | 12×1 | `QAC` |

### Zone coupling rules

| Coupling | Rule |
|----------|------|
| C + D | Side-by-side desktop only — stack on tablet/mobile |
| E + F | Tabbed alternative on space-constrained layouts |
| G | Always below operational zones (E, F) — above H |
| BNR | Inserts above Zone B when triggered |

---

# Global Dashboard Header

**Zone A wireframe** — shared chrome across all HR dashboards.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Dashboard Title]                    [Date range ▾] [Branch ▾] [Dept ▾]     │
│ Subtitle / as-of timestamp           [Refresh] [Export ▾] [Customize] [✨]  │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Element | Spec | Wireframe block |
|---------|------|-----------------|
| **Dashboard title** | H1 — e.g. "HR Dashboard" | `[Title text]` |
| **Date range** | Presets: Today · 7d · 30d · MTD · QTD · Custom | `[Date ▾]` |
| **Company switcher** | Top bar global — not duplicated unless executive multi-co | Reference top bar |
| **Branch switcher** | Optional filter — affects all widgets | `[Branch ▾]` |
| **Department filter** | Manager scope override | `[Dept ▾]` |
| **Filters** | Domain-specific chips below title row | `[chip][chip]` |
| **Export** | PDF snapshot · CSV KPI export | `[Export ▾]` |
| **Refresh** | Global widget refresh | `[↻]` |
| **Customize** | Toggle edit mode | `[Customize]` |
| **AI assistant access** | Opens panel with dashboard context | `[✨]` |
| **As-of timestamp** | KPI snapshot time | `As of 09:15 AM` |

### Header variants

| Dashboard | Extra header elements |
|-----------|-------------------------|
| Executive | Multi-company selector · comparison period |
| Payroll | Current period badge · lock status indicator |
| Attendance | Date = single day default |
| ESS | Greeting + employee name — no branch filter |

---

# KPI Card System

### Standard KPI wireframe (`KPI` · 3×2 grid)

```text
┌─────────────────────────┐
│ TITLE                   │
│ ████████  1,248         │  ← primary value (large)
│ ▲ 3.2% vs last month    │  ← trend row
│ [status dot] On track   │  ← optional status
│ View details →          │  ← drill-down link
└─────────────────────────┘
```

| Component | Wireframe | Data field |
|-----------|-----------|------------|
| **Title** | Label line | `title` (i18n) |
| **Value** | Dominant numeric/text | `value` |
| **Trend** | Arrow + % + comparison label | `trend_pct`, `trend_direction` |
| **Comparison** | "vs last month" / "vs prior period" | `comparison_label` |
| **Status** | Badge: on-track · warning · critical | `status` |
| **Quick link** | Text link footer | `drill_down_route` |
| **Sparkline** | Optional mini chart in KPI | `sparkline_data[]` |
| **Drill down** | Entire card clickable | Same as quick link |

### KPI status semantics

| Status | When | Wireframe cue |
|--------|------|---------------|
| **Neutral** | Informational | No badge |
| **Good** | Metric improved or within target | Green dot annotation |
| **Warning** | Threshold approaching | Amber dot |
| **Critical** | SLA breach, compliance risk | Red dot + optional `BNR` |

### KPI row layout

| KPI count | Desktop grid |
|-----------|--------------|
| 4 | 3+3+3+3 |
| 6 | 2+2+2+2+2+2 |
| 8 | 3+3+3+3 / row 2: 3+3+3+3 |
| 10 | Scroll horizontal or 5+5 two rows |

---

# Analytics Widget System

### Chart placeholder wireframe (`CHT`)

```text
┌─────────────────────────────────────────┐
│ ⋮⋮  Chart Title                   [⋯]   │
├─────────────────────────────────────────┤
│                                         │
│     [CHART TYPE PLACEHOLDER]            │
│     (labeled: Line / Bar / etc.)        │
│                                         │
├─────────────────────────────────────────┤
│ Legend · Period · [Open analytics →]    │
└─────────────────────────────────────────┘
```

### Supported chart types

| Type | Use case | Default size | HR example |
|------|----------|--------------|------------|
| **Line chart** | Trends over time | 6×3 | Attendance 30d |
| **Bar chart** | Category comparison | 6×3 | Dept headcount |
| **Area chart** | Cumulative trends | 6×3 | Attendance rate |
| **Pie chart** | Part-to-whole (≤6 slices) | 4×3 | Leave type mix |
| **Donut chart** | Part-to-whole + center KPI | 4×3 | Employment type mix |
| **Heatmap** | Day × hour or dept × week | 8×3 | Late arrival heatmap |
| **Trend card** | Single metric + sparkline | 3×2 | Mini variant of KPI |
| **Scorecard** | Target vs actual | 4×3 | Goal achievement % |

### Analytics zone layout patterns

| Pattern | Layout |
|---------|--------|
| **2-up** | `[6×3][6×3]` |
| **1+1 stack** | `[12×3]` × 2 |
| **Hero + side** | `[8×3]` + `[4×3]` donut |
| **Dashboard strip** | `[12×2]` full-width area chart |

---

# HR Manager Dashboard

**Most important dashboard** · Route: `/hr` · Screen: `SCR-HR-DSH-001` · Template: `DSH-HRM-001`

### Zone A — Header

| Element | Value |
|---------|-------|
| Title | HR Dashboard |
| Date range | Today default for attendance KPIs; 30d for trends |
| Filters | Branch · Department |
| AI | ✨ "Ask about workforce" |

### Zone B — KPIs

| Widget ID | KPI | Grid | Drill-down |
|-----------|-----|------|------------|
| WGT-HR-KPI-001 | Total Employees | 3×2 | `/hr/employees` |
| WGT-HR-KPI-002 | Present Today | 3×2 | `/hr/attendance/daily?status=present` |
| WGT-HR-KPI-003 | Absent Today | 3×2 | `/hr/attendance/daily?status=absent` |
| WGT-HR-KPI-004 | Late Today | 3×2 | `/hr/attendance/daily?status=late` |
| WGT-HR-KPI-005 | On Leave | 3×2 | `/hr/leave/calendar?today=1` |
| WGT-HR-KPI-007 | Pending Confirmations | 3×2 | Workflow queue |
| WGT-HR-KPI-009 | Pending Promotions | 3×2 | `/hr/performance/promotions?status=pending` |
| WGT-HR-KPI-010 | Pending Exits | 3×2 | Exit queue |

**Layout:** Row 1: 4 KPIs · Row 2: 4 KPIs

### Zone C — Analytics

| Widget ID | Chart | Type | Grid |
|-----------|-------|------|------|
| CHT-HR-001 | Attendance Trends | Line | 6×3 |
| CHT-HR-002 | Leave Trends | Area | 6×3 |
| CHT-HR-003 | Headcount Trends | Line | 6×3 |
| CHT-HR-003 | Department Distribution | Donut | 6×3 |
| CHT-HR-004 | Recruitment Overview | Funnel/bar | 6×3 |

### Zone D — Approval Center

| Widget ID | Queue | Max rows |
|-----------|-------|----------|
| WGT-HR-ACT-001 | Pending Leaves | 5 |
| WGT-HR-ACT-002 | Attendance Corrections | 5 |
| WGT-HR-ACT-003 | Loan Requests | 3 |
| WGT-HR-ACT-004 | Advance Salary Requests | 3 |
| WGT-HR-ACT-005 | Performance Reviews | 3 |

**Wireframe:** Tabbed list or stacked sections with counts in headers.

### Zone E — Activity Feed

| Widget ID | Feed |
|-----------|------|
| WGT-ACT-LST-002 | Employee Activities |
| WGT-ACT-LST-004 | Attendance Activities |
| WGT-ACT-LST-003 | Payroll Activities |
| WGT-ACT-LST-001 | Training Activities (filter) |

**Layout:** Tab bar: All · Employees · Attendance · Payroll · Training

### Zone F — Notifications

| Widget ID | Content |
|-----------|---------|
| WGT-NTF-LST-002 | Critical Alerts |
| WGT-NTF-LST-004 | Compliance Alerts |
| WGT-HR-ACT-007 | Document Expiry (cross-ref) |
| WGT-NTF-LST-001 | Pending Actions summary |

### Zone G — AI Insights

| Widget ID | Insight |
|-----------|---------|
| WGT-AI-INS-001 | Attendance Risks |
| WGT-AI-INS-006 | Leave Risks |
| WGT-AI-INS-004 | Promotion Opportunities |
| WGT-AI-INS-005 | Training Recommendations |
| WGT-AI-INS-003 | Attrition Risks |

**Layout:** 3 cards × `4×2` or carousel on mobile

### Zone H — Quick Actions

| Widget ID | Action |
|-----------|--------|
| WGT-QAC-001 | Create Employee |
| WGT-QAC-002 | Approve Leave |
| WGT-QAC-005 | Assign Training |
| WGT-QAC-006 | Generate Report |

---

# Payroll Manager Dashboard

**Route:** `/payroll` · Screen: `SCR-PAY-DSH-001` · Template: `DSH-PAY-001`

### Zone A — Header

| Element | Value |
|---------|-------|
| Title | Payroll Dashboard |
| Period badge | Current payroll period + status |
| Banners | `WGT-PAY-BNR-*` above Zone B when triggered |

### Zone B — KPIs

| Widget ID | KPI |
|-----------|-----|
| WGT-PAY-KPI-001 | Payroll Period |
| WGT-PAY-KPI-002 | Pending Payroll |
| WGT-PAY-KPI-003 | Processed Payroll |
| WGT-PAY-KPI-004 | Locked Payroll |
| WGT-PAY-KPI-005 | Salary Revisions |
| WGT-PAY-KPI-006 | Bonus Processing |

### Zone C — Analytics

| Chart ID | Metric | Type |
|----------|--------|------|
| CHT-PAY-001 | Payroll Cost | Line |
| CHT-PAY-002 | Department Cost | Bar |
| CHT-PAY-003 | Overtime Cost | Bar |
| CHT-PAY-007 | Tax Summary | Donut |
| CHT-PAY-005 | Loan Recovery | Area |

### Zone D — Approvals

| Queue | Route |
|-------|-------|
| Payroll Approvals | `/payroll/runs?status=pending` |
| Salary Revisions | `/payroll/salary-revisions?status=pending` |
| Bonus Requests | `/payroll/bonuses?status=pending` |

### Zone G — AI Insights

| Widget ID | Insight |
|-----------|---------|
| WGT-AI-INS-002 | Payroll Risks |
| WGT-AI-INS-002 | Anomaly Detection (variant) |
| WGT-AI-INS-002 | Cost Optimization (variant) |

**Rule:** AI suggests review — never auto-lock or auto-post.

### Zone H — Quick Actions

| Action | Route |
|--------|-------|
| Process Payroll | `/payroll/runs` |
| Approve Request | `/inbox/approvals?module=payroll` |
| Export Bank File | `/payroll/export` |

---

# CEO / Executive Dashboard

**Route:** `/hr/executive` · Screen: `SCR-HR-DSH-008` · Template: `DSH-EXE-001`

### Zone A — Header

| Element | Value |
|---------|-------|
| Title | Executive Workforce Dashboard |
| Multi-company selector | Consolidated vs single company |
| Comparison period | YoY · QoQ toggle |

### Zone B — KPIs

| Widget ID | KPI |
|-----------|-----|
| WGT-EXE-KPI-001 | Total Employees |
| WGT-EXE-KPI-003 | Headcount Growth (new joiners MTD) |
| WGT-EXE-KPI-007 | Payroll Cost |
| WGT-EXE-KPI-005 | Employee Turnover |
| WGT-EXE-KPI-006 | Attendance Rate |
| WGT-EXE-KPI-009 | Performance Score |
| WGT-EXE-KPI-010 | Training Completion |

### Zone C — Analytics

| Chart ID | Metric |
|----------|--------|
| CHT-EXE-001 | Workforce Trends |
| CHT-EXE-005 | Payroll Trends |
| CHT-EXE-006 | Attrition Trends |
| CHT-EXE-007 | Department Performance |
| CHT-EXE-004 | Hiring Trends |

### Zone G — Executive Insights

| Insight type | Content |
|--------------|---------|
| High Risk Areas | Aggregated dept/branch risk scores |
| Growth Opportunities | Headcount vs plan variance |
| Workforce Planning | Forecast strip (AI planner) |
| Strategic Recommendations | Narrative cards — no PII names |

**Widget:** `WGT-EXE-TBL-001` — company breakdown table in Zone C.

---

# Employee Self Service Dashboard

**Route:** `/ess` · Screen: `SCR-ESS-DSH-001` · Template: `DSH-ESS-001`

Simplified zones — **B, H, and My Widgets** (no approval center for standard employee).

### Zone B — KPIs

| Widget ID | KPI |
|-----------|-----|
| WGT-ESS-KPI-001 | Attendance Rate |
| WGT-ESS-KPI-002 | Leave Balance |
| WGT-ESS-KPI-004 | Training Progress |
| WGT-ESS-KPI-005 | Performance Status |
| WGT-ESS-KPI-006 | Assigned Assets |

### Zone H — My Actions

| Action | Route |
|--------|-------|
| Apply Leave | `/ess/leave?create=1` |
| Attendance Correction | `/ess/attendance?correction=1` |
| Download Payslip | `/ess/payslips` |
| Request Loan | `/ess/requests?type=loan` |
| Upload Documents | `/ess/documents?upload=1` |

### My Widgets stack (replaces C–G on mobile-first ESS)

| Widget ID | Content |
|-----------|---------|
| WGT-ESS-KPI-003 | Upcoming Holidays |
| WGT-ESS-CAL-001 | Upcoming Training (calendar strip) |
| WGT-ESS-LST-001 | Pending Requests |
| WGT-ESS-LST-002 | Recent Payslips (embedded list) |
| WGT-NTF-LST-001 | Notifications (top 5) |

**Layout:** Single column card stack · bottom nav persistent

---

# Recruitment Dashboard

**Route:** `/hr/recruitment` · Screen: `SCR-HR-DSH-004` · Template: `DSH-REC-001`

### Zone B — KPIs

| Widget ID | KPI |
|-----------|-----|
| WGT-REC-KPI-001 | Open Positions |
| WGT-REC-KPI-002 | Applications |
| WGT-REC-KPI-003 | Interviews |
| WGT-REC-KPI-004 | Offers |
| WGT-REC-KPI-006 | Hires |

### Zone C — Analytics

| Chart | Type |
|-------|------|
| Hiring Funnel | Funnel |
| Source Performance | Bar |
| Time To Hire | Line |
| Cost Per Hire | Scorecard |

### Zone G — AI Insights

| Insight |
|---------|
| Candidate Recommendations |
| Hiring Risks |
| Pipeline Health |

---

# Attendance Dashboard

**Route:** `/hr/attendance` · Screen: `SCR-HR-DSH-002` · Template: `DSH-ATT-001`

### Zone B — KPIs

| Widget ID | KPI |
|-----------|-----|
| WGT-ATT-KPI-001 | Present |
| WGT-ATT-KPI-002 | Absent |
| WGT-ATT-KPI-003 | Late |
| WGT-ATT-KPI-004 | Half Day |
| WGT-ATT-KPI-007 | Work From Home |
| WGT-ATT-KPI-008 | Outdoor Duty |

### Zone C — Analytics

| Chart ID | Metric |
|----------|--------|
| CHT-ATT-001 | Daily Trends |
| CHT-ATT-002 | Monthly Trends |
| CHT-ATT-003 | Department Trends |
| CHT-ATT-004 | Heatmaps |
| CHT-ATT-006 | Biometric Status (table widget) |

### Zone G — AI Insights

| Widget ID | Insight |
|-----------|---------|
| WGT-AI-INS-001 | Attendance Anomalies |
| WGT-AI-INS-001 | Late Patterns (variant) |
| WGT-AI-INS-001 | Absence Risks (variant) |

---

# Leave Dashboard

**Route:** `/hr/leave` · Screen: `SCR-HR-DSH-003` · Template: `DSH-LEV-001`

### Zone B — KPIs

| Widget ID | KPI |
|-----------|-----|
| WGT-LEV-KPI-001 | Pending Requests |
| WGT-LEV-KPI-002 | Approved |
| WGT-LEV-KPI-003 | Rejected |
| WGT-LEV-KPI-004 | Leave Balance (org aggregate) |
| WGT-LEV-KPI-005 | Encashments |

### Zone C — Analytics

| Chart ID | Metric |
|----------|--------|
| CHT-LEV-001 | Leave Trends |
| CHT-LEV-003 | Department Leave Trends |
| CHT-LEV-004 | Leave Types |
| WGT-LEV-CAL-001 | Who's out calendar mini |

### Zone G — AI Insights

| Insight |
|---------|
| Leave Abuse Detection |
| Leave Forecasting |

---

# Performance Dashboard

**Route:** `/hr/performance` · Screen: `SCR-HR-DSH-005` · Template: `DSH-PRF-001`

### Zone B — KPIs

| Widget ID | KPI |
|-----------|-----|
| WGT-PRF-KPI-001 | Goals |
| WGT-PRF-KPI-002 | KPIs (reviews pending) |
| WGT-PRF-KPI-003 | Reviews completed |
| WGT-PRF-KPI-004 | Promotions |
| WGT-PRF-KPI-005 | Training Needs |

### Zone C — Analytics

| Chart ID | Metric |
|----------|--------|
| CHT-PRF-001 | Performance Trends |
| CHT-PRF-002 | Department Performance |
| CHT-PRF-003 | Goal Achievement |

### Zone G — AI Insights

| Insight |
|---------|
| Promotion Readiness |
| Skill Gaps |
| Training Recommendations |

---

# Training Dashboard

**Route:** `/hr/training` · Screen: `SCR-HR-DSH-006` · Template: `DSH-TRN-001`

### Zone B — KPIs

| Widget ID | KPI |
|-----------|-----|
| WGT-TRN-KPI-001 | Programs |
| WGT-TRN-KPI-002 | Sessions |
| WGT-TRN-KPI-003 | Participants |
| WGT-TRN-KPI-004 | Certificates |
| WGT-TRN-KPI-005 | Completion Rate |

### Zone C — Analytics

| Chart ID | Metric |
|----------|--------|
| CHT-TRN-001 | Training Effectiveness |
| CHT-TRN-002 | Participation |
| CHT-TRN-003 | Certification Status |

### Zone G — AI Insights

| Insight |
|---------|
| Skill Gap Analysis |
| Learning Recommendations |

---

# Asset Dashboard

**Route:** `/hr/assets` · Screen: `SCR-HR-DSH-007` · Template: `DSH-AST-001`

### Zone B — KPIs

| Widget ID | KPI |
|-----------|-----|
| WGT-AST-KPI-001 | Assigned Assets |
| WGT-AST-KPI-002 | Available Assets |
| WGT-AST-KPI-003 | Damaged Assets |
| WGT-AST-KPI-005 | Warranty Expiry |

### Zone C — Analytics

| Chart ID | Metric |
|----------|--------|
| CHT-AST-001 | Utilization |
| CHT-AST-003 | Lifecycle |
| CHT-AST-002 | Distribution |

### Zone G — AI Insights

| Insight |
|---------|
| Replacement Suggestions |
| Risk Detection |

---

# Approval Center Widget

**Universal widget** — embeddable in Zone D on any dashboard + full page `/inbox/approvals`.

### Wireframe structure

```text
┌─────────────────────────────────────────┐
│ Pending Approvals (12)        [View all]│
├─────────────────────────────────────────┤
│ [icon] Leave · Jane A. · 2d    [Approve][Reject] │
│ [icon] OT · Karim R. · 1d      [Approve][Reject] │
│ ...                                     │
├─────────────────────────────────────────┤
│ [Pending][Approved][Rejected][Escalated]│  ← tabs
└─────────────────────────────────────────┘
```

| Tab | Widget ID | Filter |
|-----|-----------|--------|
| **Pending** | WGT-APR-LST-001 | `status=pending` |
| **Approved** | WGT-APR-LST-003 | `status=approved` |
| **Rejected** | WGT-APR-LST-004 | `status=rejected` |
| **Escalated** | WGT-APR-LST-002 | `status=escalated` |

| Property | Rule |
|----------|------|
| Row actions | Inline approve/reject when `core.approval.act` |
| HR filter | `?module=hr,payroll` on data fetch |
| Max rows | 10 in widget · full page unlimited |
| Empty state | "No pending approvals" + illustration placeholder |

---

# Notification Center Widget

**Zone F standard widget**

### Priority lanes

| Lane | Widget ID | Filter |
|------|-----------|--------|
| **Critical** | WGT-NTF-LST-002 | priority=critical |
| **High** | WGT-NTF-LST-002 | priority=high |
| **Medium** | WGT-NTF-LST-001 | priority=medium |
| **Low** | WGT-NTF-LST-001 | priority=low |

### Read state

| View | Behavior |
|------|----------|
| **Unread** | Bold title · dot indicator |
| **Read** | Muted styling |

**Wireframe:** Grouped by today / yesterday · link to `/notifications`

---

# Activity Feed Widget

**Zone E standard widget**

```text
┌─────────────────────────────────────────┐
│ Recent Activity               [View all]  │
├─────────────────────────────────────────┤
│ ● Jane Akter promoted · 2h ago           │
│ ● Payroll PR-06 locked · 4h ago          │
│ ● Leave approved · Karim · 5h ago        │
└─────────────────────────────────────────┘
```

| Feed variant | Widget ID | Filter |
|--------------|-----------|--------|
| Recent Activities | WGT-ACT-LST-001 | Company-wide |
| User Activities | WGT-ACT-LST-002 | `entity=hr_employee` |
| Department Activities | WGT-ACT-LST-001 | `department_id` scope |
| Approval Activities | WGT-ACT-LST-005 | approval events |
| Attendance Activities | WGT-ACT-LST-004 | attendance |
| Payroll Activities | WGT-ACT-LST-003 | payroll |

**Limit:** 20 items · vertical timeline icon per row

---

# AI Insight Panel

**Zone G wireframe** — standard layout for `AI` type widgets.

```text
┌─────────────────────────────────────────┐
│ ✨ AI Insights                [Refresh]   │
├─────────────────────────────────────────┤
│ SECTION: Insights (batch summary)       │
│ ┌─────────────┐ ┌─────────────┐         │
│ │ ⚠ Attendance│ │ 📈 Promotion│         │
│ │ anomaly…    │ │ opportunity │         │
│ │ Conf: 0.84  │ │ Conf: 0.71  │         │
│ └─────────────┘ └─────────────┘         │
├─────────────────────────────────────────┤
│ SECTION: Recommendations                │
│ • Enroll 3 employees in Safety 101      │
├─────────────────────────────────────────┤
│ SECTION: Predictions (future)           │
│ • Attrition risk elevated in Sales      │
├─────────────────────────────────────────┤
│ SECTION: Actions                        │
│ [Review] [Dismiss] [Open in AI hub]     │
├─────────────────────────────────────────┤
│ SECTION: History · [View AI log →]      │
└─────────────────────────────────────────┘
```

| Section | Content |
|---------|---------|
| **Insights** | Pre-computed narrative cards |
| **Recommendations** | Ranked action suggestions |
| **Predictions** | Forward-looking scores (gated) |
| **Actions** | Apply / Dismiss — human confirm |
| **History** | Link to `/hr/ai/history` |

**Card anatomy:** Icon · Title · 2-line summary · Confidence badge · Source count · CTA link

---

# Quick Actions Panel

**Zone H wireframe** — role-based button chips.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [+ Create Employee] [Approve Leave] [Process Payroll] [Assign Asset] [Report]│
└─────────────────────────────────────────────────────────────────────────────┘
```

### Role-based action sets

| Role | Actions shown |
|------|---------------|
| **HR Manager** | Create Employee · Approve Leave · Assign Training · Generate Report |
| **Payroll Manager** | Process Payroll · Approve Payroll · Export Bank · Salary Revision |
| **Dept Manager** | Approve Leave · Approve OT · Review Performance |
| **Employee (ESS)** | Apply Leave · Correction · Payslip · Upload Doc |
| **Executive** | View Reports · AI Briefing · Headcount Report |

| Widget ID | Action | Permission |
|-----------|--------|------------|
| WGT-QAC-001 | Create Employee | `hr.employee.create` |
| WGT-QAC-003 | Process Payroll | `payroll.run.create` |
| WGT-QAC-002 | Approve Leave | `hr.leave.approve` |
| WGT-QAC-005 | Create Training | `hr.training.program.manage` |
| WGT-QAC-004 | Assign Asset | `hr.asset.assign` |

**Mobile:** Horizontal scroll · min 44px tap height

---

# Drill Down Strategy

Every KPI and widget supports navigation outward.

| Interaction | Target | Example |
|-------------|--------|---------|
| **View details** | Filtered list screen | KPI "Absent Today" → `/hr/attendance/daily?status=absent` |
| **Open report** | Report slug | Chart footer → `/hr/reports/absenteeism` |
| **Open analytics** | Analytics screen | Chart title link → `/hr/attendance/analytics` |
| **Open entity** | Drawer on list route | Activity row → `/hr/employees?view={id}` |
| **Open approval** | Inbox with pre-filter | Approval row → `/inbox/approvals?view={id}` |
| **Open AI detail** | AI hub category | Insight card → `/hr/ai/attrition` |

### Drill-down wireframe annotation

Each widget footer includes at least one:

```text
[View details →]  or  [Open report →]  or  [View all →]
```

**Rule:** Drill-down preserves header filters (branch, date range) as query params.

---

# Personalization

Per [dashboard-widgets.md](../../../04-uiux/standards/dashboard-widgets.md).

| Capability | UI behavior |
|------------|-------------|
| **Move widgets** | Drag handle `⋮⋮` in edit mode |
| **Hide widgets** | `×` removes from layout — restorable from catalog |
| **Resize widgets** | Corner drag or S/M/L presets |
| **Pin widgets** | Pin icon — survives reorder to top |
| **Save layouts** | Auto-save on change to `user_dashboard_layouts` |
| **Reset layout** | "Reset to default" in customize menu |
| **Custom dashboards** | Future: clone template → new `dashboard_key` |

### Edit mode wireframe

```text
[Customize dashboard] → enables:
  - Drag handles visible
  - Resize corners on charts
  - [+ Add widget] opens catalog picker
  - [Reset] [Save] [Cancel]
```

**Catalog picker:** Filtered by role permissions · grouped by zone type

---

# Permission Based Visibility

### Visibility matrix (widget categories)

| Category | Employee | Team Lead | Dept Mgr | HR Mgr | Payroll | Executive |
|----------|----------|-----------|----------|--------|---------|-----------|
| Workforce KPIs | Self | Team | Dept | ✓ | View | Aggregated |
| Payroll cost charts | — | — | — | Summary | ✓ | ✓ |
| Approval widget | Own | Team | Team | ✓ | Payroll | — |
| AI attrition | — | — | — | ✓ | — | ✓ |
| Salary component detail | — | — | — | `hr.sensitive.view` | ✓ | Summary |

### Scope dimensions

| Dimension | UI effect |
|-----------|-----------|
| **Role** | Widget catalog filter |
| **Company** | All widgets — session scope |
| **Branch** | Header filter · Branch Admin default |
| **Department** | Manager dashboards auto-scope |
| **Feature plan** | Hide Performance/AI widgets on Starter plan |

### Visibility rule

```text
show_widget =
  user has widget.permission
  AND data_scope allows aggregate
  AND module feature flag enabled
```

**Never show disabled widgets** — omit from layout and catalog.

---

# AI First Experience

### Contextual AI on dashboards

| Pattern | Location | Trigger |
|---------|----------|---------|
| **Dashboard AI summary** | Zone G top banner | Daily batch job |
| **Ask about this dashboard** | Zone A ✨ button | Opens panel with route context |
| **Insight cards** | Zone G | Pre-computed read models |
| **Anomaly flags on KPI** | Zone B status dot | AI-enriched KPI metadata |

### Briefing schedule (UI surfaces)

| Briefing | When | Where |
|----------|------|-------|
| **Daily AI briefing** | 06:00 tenant TZ | Zone G banner on `/hr` |
| **Weekly AI briefing** | Monday AM | Email + `/hr/ai` hub |
| **Executive AI summary** | Monthly + on-demand | `/hr/executive` Zone G |
| **Payroll run briefing** | Pre-calculate | `/payroll` banner + AI widget |

### AI panel vs Zone G

| Surface | Use |
|---------|-----|
| **Zone G cards** | Passive insights — scan quickly |
| **AI panel (`Ctrl+J`)** | Interactive Q&A about dashboard data |
| **`/hr/ai` hub** | Full insight library + history |

---

# Dashboard Template Registry

| Template ID | Route | Primary role | Zones enabled |
|-------------|-------|--------------|---------------|
| `DSH-HRM-001` | `/hr` | HR Manager | A–H full |
| `DSH-PAY-001` | `/payroll` | Payroll Manager | A–H; D payroll-only |
| `DSH-EXE-001` | `/hr/executive` | Executive | A–C,G heavy; no D |
| `DSH-ESS-001` | `/ess` | Employee | A,B,H + My Widgets |
| `DSH-REC-001` | `/hr/recruitment` | Recruitment | A–H |
| `DSH-ATT-001` | `/hr/attendance` | HR/Branch | A–H |
| `DSH-LEV-001` | `/hr/leave` | HR/Manager | A–H |
| `DSH-PRF-001` | `/hr/performance` | HR/Manager | A–H |
| `DSH-TRN-001` | `/hr/training` | Trainer/HR | A–H |
| `DSH-AST-001` | `/hr/assets` | HR/IT | A–H |
| `DSH-MGR-001` | `/hr` | Dept Manager | Subset B,D,H |
| `DSH-TLD-001` | `/hr` | Team Leader | Minimal B,D |

---

# Reusable Module Dashboard Pattern

Other AgainERP modules should adopt:

| Element | Convention |
|---------|------------|
| Zones | A–H same semantics |
| Widget IDs | `WGT-{MOD}-{TYPE}-{SEQ}` |
| Templates | `DSH-{MOD}-{SEQ}` |
| Grid | 12-column · 80px row |
| Header | Zone A standard chrome |
| Personalization | Same edit mode UX |

---

# Cross-Reference Index

| Document | Use |
|----------|-----|
| [HR_DASHBOARD_ARCHITECTURE.md](../HR_DASHBOARD_ARCHITECTURE.md) | KPI formulas, data sources, APIs |
| [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../HR_FIGMA_WIREFRAME_BLUEPRINT.md) | Dashboard wireframe frames |
| [HR_SCREEN_INVENTORY.md](../HR_SCREEN_INVENTORY.md) | `SCR-*-DSH-*` screen IDs |
| [HR_NAVIGATION_ARCHITECTURE.md](./HR_NAVIGATION_ARCHITECTURE.md) | Routes to dashboards |
| [dashboard-widgets.md](../../../04-uiux/standards/dashboard-widgets.md) | Platform widget system |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll |
| **Owner** | Product / Design |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Dashboards defined** | 11 templates |
| **Zone framework** | A–H (8 zones) |

---

**AgainERP HR & Payroll Dashboard UI Architecture** — wireframe foundation for dashboards, widgets, KPIs, and AI experience.
