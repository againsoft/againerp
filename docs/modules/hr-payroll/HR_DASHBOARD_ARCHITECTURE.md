# HR & Payroll — Dashboard Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll (unified enterprise suite)  
> **Document Type:** Dashboard Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md) · [HR_UI_UX_BLUEPRINT.md](./HR_UI_UX_BLUEPRINT.md) · [HR_SCREEN_INVENTORY.md](./HR_SCREEN_INVENTORY.md) · [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md)  
> **Governance:** [dashboard-widgets.md](../../ui-ux/dashboard-widgets.md) · [ENTERPRISE_UI_ARCHITECTURE.md](../../ui-ux/ENTERPRISE_UI_ARCHITECTURE.md) · [HR_DATABASE_ARCHITECTURE.md](./HR_DATABASE_ARCHITECTURE.md) · [HR_ACTIVITY_LOG_ARCHITECTURE.md](./HR_ACTIVITY_LOG_ARCHITECTURE.md) · [HR_NOTIFICATION_ARCHITECTURE.md](./HR_NOTIFICATION_ARCHITECTURE.md) · [AI_OS_ARCHITECTURE.md](../ai/AI_OS_ARCHITECTURE.md)

**No UI pixels. No application code.**  
Defines **dashboard strategy, types, widgets, KPIs, analytics, executive monitoring, and AI insight layer** for AgainERP HR & Payroll. Foundation for dashboard UI, widget library, KPI engine, analytics engine, executive reporting, and AI insights.

---

## Executive Summary

| Principle | Rule |
|-----------|------|
| **Role-first** | Default dashboard per role — not one-size-fits-all |
| **Action-oriented** | Surfaces pending approvals and exceptions first |
| **Platform widgets** | 12-column grid per [dashboard-widgets.md](../../ui-ux/dashboard-widgets.md) |
| **OLTP + analytics** | KPIs from read models / aggregates — not heavy joins on request |
| **Permission-gated** | Widget catalog filtered by `hr.*` / `payroll.*` / `ess.*` |
| **Company scoped** | All metrics filter `company_id`; branch/dept optional |
| **AI advisory** | Insight widgets — never auto-act on payroll |

```text
Data sources → KPI Engine / Analytics Engine → Widget API → Dashboard Layout (per user/role)
                     ↑                                    ↑
              Domain events                         Personalization store
              Activity / Notification               Role default templates
              AI read models
```

---

## Dashboard Philosophy

### Core belief

> **Dashboards drive decisions, not display data for its own sake.**

| Stakeholder | Dashboard answers |
|-------------|-------------------|
| **Executive** | Is workforce cost and attrition healthy? |
| **HR Manager** | What needs my action today? |
| **Payroll Manager** | Is this period ready to lock? |
| **Department Manager** | Is my team present and covered? |
| **Employee** | What is my balance, payslip, and next task? |

### Dashboard vs report

| Dashboard | Report |
|-----------|--------|
| Near-real-time snapshot | Historical deep dive |
| Widgets, drill-down links | Full export, filters |
| Personalized layout | Standard template |
| 30–90 day trends |任意 date range |

### Module dashboard map

| Route | Primary audience | Screen ID |
|-------|------------------|-----------|
| `/hr` | HR Manager | `SCR-HR-DSH-001` |
| `/hr/executive` | CEO, executives | `SCR-HR-DSH-008` |
| `/payroll` | Payroll Manager | `SCR-PAY-DSH-001` |
| `/hr/attendance` | HR, Branch Admin | `SCR-HR-DSH-002` |
| `/hr/leave` | HR, Managers | `SCR-HR-DSH-003` |
| `/hr/recruitment` | Recruitment | `SCR-HR-DSH-004` |
| `/hr/performance` | HR, Managers | `SCR-HR-DSH-005` |
| `/hr/training` | HR, Trainer | `SCR-HR-DSH-006` |
| `/hr/assets` | HR, IT | `SCR-HR-DSH-007` |
| `/ess` | Employee | `SCR-ESS-DSH-001` |
| `/hr/ai` | HR leadership | `SCR-AI-HR-001` |

---

## Dashboard Design Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **Exceptions first** | Pending actions row above charts |
| 2 | **Drill-down everywhere** | KPI click → filtered list screen |
| 3 | **Consistent KPI chrome** | Value + label + trend + period |
| 4 | **Skeleton loading** | Per-widget async load |
| 5 | **Stale indicator** | "Updated 5m ago" on aggregates |
| 6 | **No PII in executive rollups** | Aggregated counts only on `/hr/executive` |
| 7 | **Mobile collapse** | KPI 2-col; charts stack; actions as list |
| 8 | **Widget failure isolation** | One widget error does not break dashboard |
| 9 | **Cache tier** | Hot KPIs 5min TTL; trends 15min |
| 10 | **Audit on export** | Dashboard export logs activity |

---

## Role Based Dashboard Strategy

| Role | Default landing | Dashboard template ID |
|------|-----------------|----------------------|
| **Platform Admin** | Tenant overview (platform) | `DSH-PLT-001` |
| **Company Admin** | `/hr` + full widgets | `DSH-COA-001` |
| **Branch Admin** | `/hr` scoped branch | `DSH-BRA-001` |
| **HR Director** | `/hr/executive` + `/hr` | `DSH-HRD-001` |
| **HR Manager** | `/hr` | `DSH-HRM-001` |
| **Payroll Manager** | `/payroll` | `DSH-PAY-001` |
| **Department Manager** | `/hr` manager subset | `DSH-MGR-001` |
| **Team Leader** | `/hr` team subset | `DSH-TLD-001` |
| **Employee** | `/ess` | `DSH-ESS-001` |
| **Executive Management** | `/hr/executive` | `DSH-EXE-001` |

**Rule:** User with multiple roles gets union of widget catalog; default layout from highest-privilege HR role unless user saved custom layout.

---

## Widget Architecture

### Widget registry ID

```text
WGT-{DOMAIN}-{TYPE}-{SEQ}

Examples:
  WGT-HR-KPI-001    Total Employees
  WGT-PAY-CHT-003   Payroll Cost Trend
  WGT-COR-ACT-001   Recent Activity Feed
```

### Widget types

| Type | Code | Content | Grid default |
|------|------|---------|--------------|
| KPI card | `KPI` | Metric + trend + sparkline | 3×2 |
| Chart | `CHT` | Line, bar, donut, area | 6×3 |
| Table | `TBL` | Top N rows + link | 6×3 |
| List | `LST` | Action queue, feed | 4×3 |
| Calendar mini | `CAL` | Week strip | 6×2 |
| Progress | `PRG` | Goal/training completion | 3×2 |
| AI insight | `AI` | Narrative + confidence | 4×2 |
| Quick actions | `QAC` | Button group | 3×2 |
| Status banner | `BNR` | Payroll period / sync alert | 12×1 |

### Widget data contract (conceptual)

| Field | Description |
|-------|-------------|
| `widget_id` | Registry ID |
| `title` | i18n key |
| `value` | Primary metric |
| `previous_value` | Comparison period |
| `trend_pct` | % change |
| `trend_direction` | up / down / flat |
| `drill_down_route` | Deep link with filters |
| `refresh_interval_sec` | Polling hint |
| `permission` | Required key |
| `scope` | company, branch, department, self |

### Widget loading

```text
Dashboard mount
  → Load user layout (or role default)
  → Parallel fetch widget data endpoints
  → Render skeleton → hydrate widgets
  → Optional: SSE/poll for live widgets (future)
```

---

## KPI Architecture

### KPI engine responsibilities

| Layer | Owner | Output |
|-------|-------|--------|
| **OLTP** | HR/Payroll services | Domain events |
| **Aggregator** | Analytics worker | `hr_analytics_*` read models |
| **KPI API** | `/api/v1/hr/dashboard/kpis` | Widget payloads |
| **Cache** | Redis | TTL per KPI |

### KPI calculation rules

| Rule | Detail |
|------|--------|
| **Snapshot time** | KPIs stamped `as_of` UTC |
| **Company scope** | Mandatory `company_id` |
| **Branch filter** | Optional query param |
| **Department filter** | Manager auto-scope |
| **Comparison** | vs prior period (day/week/month) |
| **Rounding** | Headcount integer; cost 2 decimal |

### Standard KPI metadata

| Attribute | Example |
|-----------|---------|
| `kpi_id` | `hr.headcount.active` |
| `formula` | COUNT employees WHERE status=active |
| `source` | `hr_analytics_workforce_daily` |
| `refresh` | 5 min |
| `owner` | HR module |

---

## Analytics Architecture

### Analytics vs KPI

| Analytics | KPI |
|-----------|-----|
| Time series, distributions | Single number |
| Chart widgets | Card widgets |
| 30–365 day range | Point-in-time + trend |

### Data pipeline

```text
Domain event (hr.attendance.finalized, payroll.run.locked, …)
        ↓
Analytics subscriber
        ↓
Aggregate tables / warehouse facts
        ↓
Chart API (/api/v1/hr/dashboard/charts/{chart_id})
        ↓
Chart widget
```

### Planned aggregate domains (from [HR_DATABASE_ARCHITECTURE.md](./HR_DATABASE_ARCHITECTURE.md))

`hr_analytics_workforce_daily` · `hr_analytics_attendance_daily` · `hr_analytics_leave_monthly` · `payroll_analytics_cost_monthly` · `hr_ai_workforce_metrics` (AI)

### Chart catalog ID

```text
CHT-{DOMAIN}-{NAME}   e.g. CHT-HR-ATT-TREND
```

---

## AI Dashboard Strategy

Per [AI_OS_ARCHITECTURE.md](../ai/AI_OS_ARCHITECTURE.md) — AI widgets are **read-only insights** with links to evidence.

| Rule | Detail |
|------|--------|
| Data access | Service APIs + read models only |
| Permissions | Inherit user + `ai.access` |
| Display | Insight text + confidence + "View details" |
| No auto-approve | Payroll/leave never auto-actioned |
| Refresh | Daily batch + on-demand "Refresh insights" |
| Audit | `activity_ai_actions` on apply |

---

# Dashboard Types (by role)

See Role Based Dashboard Strategy table. Each type uses **Global Dashboard Framework** with different widget sets.

---

# Global Dashboard Framework

Standard vertical zones — all HR dashboards compose from this framework.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER AREA — Title · Period selector · Branch filter · Customize btn   │
├─────────────────────────────────────────────────────────────────────────┤
│ KPI AREA — 4–8 KPI cards (row 1–2)                                      │
├──────────────────────────────┬──────────────────────────────────────────┤
│ ANALYTICS AREA               │ PENDING ACTIONS / APPROVAL CENTER          │
│ Charts (2–3 widgets)         │ Queues (lists)                           │
├──────────────────────────────┴──────────────────────────────────────────┤
│ RECENT ACTIVITY · NOTIFICATIONS (split or tabs)                         │
├─────────────────────────────────────────────────────────────────────────┤
│ AI INSIGHTS AREA — 1–3 insight cards (role permitting)                  │
├─────────────────────────────────────────────────────────────────────────┤
│ QUICK ACTIONS — Primary shortcuts                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

| Zone | Widget types | Data source |
|------|--------------|-------------|
| **Header area** | Filters, date range, scope badges | Session context |
| **KPI area** | `KPI` | KPI engine |
| **Analytics area** | `CHT` | Analytics engine |
| **Pending actions** | `LST` | Workflow + approval APIs |
| **Approval center** | `LST` | Core `/inbox/approvals` |
| **Recent activity** | `LST` | Activity engine |
| **Notification area** | `LST` | Notification engine |
| **AI insights** | `AI` | AI read models |
| **Quick actions** | `QAC` | Permission manifest |

**Mobile order:** KPI → Pending actions → Quick actions → Notifications → Charts (collapsed).

---

# HR Executive Dashboard

**Route:** `/hr/executive`  
**Audience:** CEO · Managing Director · Executive Directors · Group management  
**Template:** `DSH-EXE-001`  
**Permission:** `hr.employee.view_all` + `hr.report.employee.view`

### Purpose

Strategic workforce and cost visibility — **no row-level employee PII** on default layout.

### Executive KPI cards

| Widget ID | KPI | Formula (conceptual) | Drill-down |
|-----------|-----|----------------------|------------|
| WGT-EXE-KPI-001 | Total employees | Active + on_leave headcount | `/hr/reports/headcount` |
| WGT-EXE-KPI-002 | Active employees | status = active | `/hr/employees?status=active` |
| WGT-EXE-KPI-003 | New joiners (MTD) | hire_date in month | `/hr/reports/new-hires` |
| WGT-EXE-KPI-004 | Employees leaving (MTD) | terminations in month | `/hr/reports/terminations` |
| WGT-EXE-KPI-005 | Turnover rate | exits / avg headcount × 100 | Report |
| WGT-EXE-KPI-006 | Attendance rate | present days / working days | `/hr/attendance/analytics` |
| WGT-EXE-KPI-007 | Payroll cost (MTD) | Sum net pay posted | `/payroll/reports/cost-by-dept` |
| WGT-EXE-KPI-008 | Overtime cost (MTD) | OT component total | `/hr/reports/overtime-summary` |
| WGT-EXE-KPI-009 | Department performance | Avg review rating by dept | `/hr/reports/performance-summary` |
| WGT-EXE-KPI-010 | Training progress | % mandatory training complete | `/hr/reports/training-completion` |

### Executive analytics

| Chart ID | Title | Type | Period |
|----------|-------|------|--------|
| CHT-EXE-001 | Employee growth trend | Line | 12 months |
| CHT-EXE-002 | Department distribution | Donut | Current |
| CHT-EXE-003 | Attendance trend | Area | 90 days |
| CHT-EXE-004 | Leave trend | Line | 12 months |
| CHT-EXE-005 | Payroll cost trend | Line | 12 months |
| CHT-EXE-006 | Attrition trend | Line | 12 months |
| CHT-EXE-007 | Performance trend | Bar | By quarter |
| CHT-EXE-008 | Training trend | Line | Completion % |

### Group of companies

Extra header: **Company selector** (multi) — consolidated KPIs with company breakdown table widget `WGT-EXE-TBL-001`.

---

# HR Manager Dashboard

**Route:** `/hr`  
**Template:** `DSH-HRM-001`  
**Permission:** `hr.access`

### HR KPIs

| Widget ID | KPI | Drill-down |
|-----------|-----|------------|
| WGT-HR-KPI-001 | Total employees | `/hr/employees` |
| WGT-HR-KPI-002 | Present today | `/hr/attendance/daily?status=present` |
| WGT-HR-KPI-003 | Absent today | `/hr/attendance/daily?status=absent` |
| WGT-HR-KPI-004 | Late today | `/hr/attendance/daily?status=late` |
| WGT-HR-KPI-005 | On leave | `/hr/leave/calendar?today=1` |
| WGT-HR-KPI-006 | New joiners (30d) | `/hr/employees?hired=30d` |
| WGT-HR-KPI-007 | Pending confirmations | Workflow queue |
| WGT-HR-KPI-008 | Pending transfers | `/hr/employees?pending=transfer` |
| WGT-HR-KPI-009 | Pending promotions | `/hr/performance/promotions?status=pending` |
| WGT-HR-KPI-010 | Pending exits | Exit workflow queue |

### HR action center

| Widget ID | Queue | Route |
|-----------|-------|-------|
| WGT-HR-ACT-001 | Pending leave requests | `/hr/leave/requests?status=pending` |
| WGT-HR-ACT-002 | Attendance corrections | `/hr/attendance/corrections?status=pending` |
| WGT-HR-ACT-003 | Loan requests | `/payroll/loans/requests?status=pending` |
| WGT-HR-ACT-004 | Advance salary requests | `/payroll/advances?status=pending` |
| WGT-HR-ACT-005 | Performance reviews due | `/hr/performance/manager-reviews?status=pending` |
| WGT-HR-ACT-006 | Training requests | `/hr/training/participants?status=pending` |
| WGT-HR-ACT-007 | Document renewals | `/hr/documents/expiry` |

### HR analytics (default widgets)

| Chart ID | Domain |
|----------|--------|
| CHT-HR-001 | Attendance analytics |
| CHT-HR-002 | Leave analytics |
| CHT-HR-003 | Department headcount |
| CHT-HR-004 | Recruitment funnel |
| CHT-HR-005 | Performance rating distribution |

---

# Payroll Manager Dashboard

**Route:** `/payroll`  
**Template:** `DSH-PAY-001`  
**Permission:** `payroll.access`

### Payroll KPIs

| Widget ID | KPI | Drill-down |
|-----------|-----|------------|
| WGT-PAY-KPI-001 | Current payroll period | `/payroll/periods` |
| WGT-PAY-KPI-002 | Pending payroll | `/payroll/runs?status=draft,calculated` |
| WGT-PAY-KPI-003 | Processed payroll | Runs in review |
| WGT-PAY-KPI-004 | Locked payroll | `/payroll/runs?status=locked` |
| WGT-PAY-KPI-005 | Salary revisions (pending) | `/payroll/salary-revisions` |
| WGT-PAY-KPI-006 | Bonus processing | `/payroll/bonuses` |
| WGT-PAY-KPI-007 | Commission processing | `/payroll/commissions` |

### Payroll analytics

| Chart ID | Metric |
|----------|--------|
| CHT-PAY-001 | Payroll cost (monthly) |
| CHT-PAY-002 | Department cost split |
| CHT-PAY-003 | Overtime cost |
| CHT-PAY-004 | Bonus cost |
| CHT-PAY-005 | Loan recovery |
| CHT-PAY-006 | Advance recovery |
| CHT-PAY-007 | Tax summary |

### Payroll banners

| Widget | Trigger |
|--------|---------|
| WGT-PAY-BNR-001 | Pay date within 3 days — run not locked |
| WGT-PAY-BNR-002 | Attendance not finalized for period |
| WGT-PAY-BNR-003 | Exceptions count > 0 in active run |

---

# Department Manager Dashboard

**Route:** `/hr` with `DSH-MGR-001` template (subset)  
**Scope:** `department_subtree` record rule

### KPIs

| Widget ID | KPI |
|-----------|-----|
| WGT-MGR-KPI-001 | Team members |
| WGT-MGR-KPI-002 | Present today |
| WGT-MGR-KPI-003 | Absent today |
| WGT-MGR-KPI-004 | Pending leaves |
| WGT-MGR-KPI-005 | Performance reviews due |
| WGT-MGR-KPI-006 | Training status (% complete) |

### Manager actions

| Action | Widget / route |
|--------|----------------|
| Approve leave | `WGT-MGR-ACT-001` → inbox |
| Approve attendance correction | `WGT-MGR-ACT-002` |
| Review performance | `/hr/performance/manager-reviews` |
| Assign training | `/hr/training/sessions` |
| Manage team | `/hr/employees?department={id}` |

---

# Team Leader Dashboard

**Route:** `/hr` with `DSH-TLD-001`  
**Scope:** Direct reports only

| Widget | Content |
|--------|---------|
| WGT-TLD-KPI-001 | Team attendance today |
| WGT-TLD-KPI-002 | Team on leave |
| WGT-TLD-LST-001 | Pending requests (max 10) |
| WGT-TLD-QAC-001 | Quick approvals |
| WGT-TLD-CHT-001 | Team performance snapshot |

---

# Employee Self Service Dashboard

**Route:** `/ess`  
**Template:** `DSH-ESS-001`  
**Permission:** `ess.access`

### My KPIs

| Widget ID | KPI |
|-----------|-----|
| WGT-ESS-KPI-001 | Attendance rate (month) |
| WGT-ESS-KPI-002 | Leave balance (primary type) |
| WGT-ESS-KPI-003 | Upcoming holidays |
| WGT-ESS-KPI-004 | Training progress |
| WGT-ESS-KPI-005 | Performance status |
| WGT-ESS-KPI-006 | Assigned assets count |

### My quick actions

| Action | Route |
|--------|-------|
| Apply leave | `/ess/leave?create=1` |
| Attendance correction | `/ess/attendance?correction=1` |
| Download payslip | `/ess/payslips` |
| Request loan | `/ess/requests?type=loan` |
| Request advance | `/ess/requests?type=advance` |
| Upload documents | `/ess/documents?upload=1` |

### ESS widgets (additional)

| Widget | Content |
|--------|---------|
| WGT-ESS-LST-001 | My pending requests |
| WGT-ESS-LST-002 | Announcements |
| WGT-ESS-CAL-001 | My leave calendar strip |

---

# Recruitment Dashboard

**Route:** `/hr/recruitment`  
**Template:** `DSH-REC-001`

### KPIs

| Widget ID | KPI |
|-----------|-----|
| WGT-REC-KPI-001 | Open positions |
| WGT-REC-KPI-002 | Applications received (30d) |
| WGT-REC-KPI-003 | Interviews scheduled (week) |
| WGT-REC-KPI-004 | Offers sent |
| WGT-REC-KPI-005 | Offers accepted |
| WGT-REC-KPI-006 | Hiring completed (MTD) |

### Analytics

| Chart ID | Metric |
|----------|--------|
| CHT-REC-001 | Hiring funnel |
| CHT-REC-002 | Source analytics |
| CHT-REC-003 | Interview success rate |
| CHT-REC-004 | Time to hire (avg days) |
| CHT-REC-005 | Cost per hire |

---

# Attendance Dashboard

**Route:** `/hr/attendance`  
**Template:** `DSH-ATT-001`

### KPIs (today default)

| Widget ID | Status |
|-----------|--------|
| WGT-ATT-KPI-001 | Present |
| WGT-ATT-KPI-002 | Absent |
| WGT-ATT-KPI-003 | Late |
| WGT-ATT-KPI-004 | Half day |
| WGT-ATT-KPI-005 | Holiday |
| WGT-ATT-KPI-006 | Weekend |
| WGT-ATT-KPI-007 | Work from home |
| WGT-ATT-KPI-008 | Outdoor duty |

### Analytics

| Chart ID | Metric |
|----------|--------|
| CHT-ATT-001 | Daily attendance trend |
| CHT-ATT-002 | Monthly attendance trend |
| CHT-ATT-003 | Department attendance comparison |
| CHT-ATT-004 | Late analysis (heatmap) |
| CHT-ATT-005 | Absence analysis |
| CHT-ATT-006 | Biometric sync status (device health table) |

---

# Leave Dashboard

**Route:** `/hr/leave`  
**Template:** `DSH-LEV-001`

### KPIs

| Widget ID | KPI |
|-----------|-----|
| WGT-LEV-KPI-001 | Pending requests |
| WGT-LEV-KPI-002 | Approved (week) |
| WGT-LEV-KPI-003 | Rejected (month) |
| WGT-LEV-KPI-004 | Org leave balance (aggregate days) |
| WGT-LEV-KPI-005 | Leave encashments (pending) |

### Analytics

| Chart ID | Metric |
|----------|--------|
| CHT-LEV-001 | Leave utilization |
| CHT-LEV-002 | Leave trends (12m) |
| CHT-LEV-003 | Department leave trends |
| CHT-LEV-004 | Leave type distribution |

### Calendar widget

`WGT-LEV-CAL-001` — Who's out this week (team or company per permission).

---

# Performance Dashboard

**Route:** `/hr/performance`  
**Template:** `DSH-PRF-001`

### KPIs

| Widget ID | KPI |
|-----------|-----|
| WGT-PRF-KPI-001 | Goals assigned (active cycle) |
| WGT-PRF-KPI-002 | Reviews pending |
| WGT-PRF-KPI-003 | Reviews completed |
| WGT-PRF-KPI-004 | Promotion recommendations |
| WGT-PRF-KPI-005 | Training recommendations |

### Analytics

| Chart ID | Metric |
|----------|--------|
| CHT-PRF-001 | Performance trends |
| CHT-PRF-002 | Department performance |
| CHT-PRF-003 | KPI achievement rate |
| CHT-PRF-004 | Review rating distribution |

---

# Training Dashboard

**Route:** `/hr/training`  
**Template:** `DSH-TRN-001`

### KPIs

| Widget ID | KPI |
|-----------|-----|
| WGT-TRN-KPI-001 | Active programs |
| WGT-TRN-KPI-002 | Sessions (month) |
| WGT-TRN-KPI-003 | Participants enrolled |
| WGT-TRN-KPI-004 | Certificates issued |
| WGT-TRN-KPI-005 | Completion rate % |

### Analytics

| Chart ID | Metric |
|----------|--------|
| CHT-TRN-001 | Training effectiveness (eval scores) |
| CHT-TRN-002 | Department participation |
| CHT-TRN-003 | Certification status |
| CHT-TRN-004 | Skill gap analysis (AI-assisted future) |

---

# Asset Dashboard

**Route:** `/hr/assets`  
**Template:** `DSH-AST-001`

### KPIs

| Widget ID | KPI |
|-----------|-----|
| WGT-AST-KPI-001 | Assigned assets |
| WGT-AST-KPI-002 | Available assets |
| WGT-AST-KPI-003 | Damaged assets |
| WGT-AST-KPI-004 | Returned (month) |
| WGT-AST-KPI-005 | Expiring warranties (30d) |

### Analytics

| Chart ID | Metric |
|----------|--------|
| CHT-AST-001 | Asset utilization |
| CHT-AST-002 | Asset distribution by category |
| CHT-AST-003 | Asset lifecycle (age) |
| CHT-AST-004 | Damage analysis |

---

# Approval Center Widgets

Embeddable on any dashboard + full page `/inbox/approvals`.

| Widget ID | Content | Permission |
|-----------|---------|------------|
| WGT-APR-LST-001 | Pending approvals (top 10) | `core.approval.act` |
| WGT-APR-LST-002 | Escalated approvals | `core.approval.act` |
| WGT-APR-LST-003 | Recently approved | `core.approval.view` |
| WGT-APR-LST-004 | Rejected requests | `core.approval.view` |
| WGT-APR-CHT-001 | Approval performance (avg time) | `core.approval.analytics` |

**HR filter:** `module=hr|payroll` on widget data fetch.

---

# Activity Feed Widget

| Widget ID | Content | Source |
|-----------|---------|--------|
| WGT-ACT-LST-001 | Recent activities (company) | Activity engine |
| WGT-ACT-LST-002 | Employee activities | Filter `entity=hr_employee` |
| WGT-ACT-LST-003 | Payroll activities | `payroll_run`, `payroll_payslip` |
| WGT-ACT-LST-004 | Attendance activities | `hr_attendance` |
| WGT-ACT-LST-005 | Approval activities | `activity_approvals` |

**Limit:** 20 items default; "View all" → filtered activity search.

---

# Notification Widget

| Widget ID | Content | Priority filter |
|-----------|---------|-----------------|
| WGT-NTF-LST-001 | Unread notifications | All |
| WGT-NTF-LST-002 | Critical notifications | critical, high |
| WGT-NTF-LST-003 | Reminder notifications | reminder.* |
| WGT-NTF-LST-004 | Compliance notifications | compliance.* |

Embed on dashboards; full center at `/notifications`.

---

# AI Insight Widgets

**Route hub:** `/hr/ai`  
**Permission:** `ai.access` + domain read perms

| Widget ID | Insight | Data source |
|-----------|---------|-------------|
| WGT-AI-INS-001 | Attendance anomalies | `hr_ai_attendance_insights` |
| WGT-AI-INS-002 | Payroll anomalies | `payroll_ai_cost_snapshots` |
| WGT-AI-INS-003 | Attrition risk (top N) | `hr_ai_attrition_signals` |
| WGT-AI-INS-004 | Promotion opportunities | Performance + AI |
| WGT-AI-INS-005 | Training recommendations | Skill gap model |
| WGT-AI-INS-006 | Leave pattern detection | Leave analytics |
| WGT-AI-INS-007 | Performance risks | Review + attendance correlation |

**Display:** Summary sentence + confidence badge + drill-down (no names to unauthorized roles).

---

# Quick Action Widgets

| Widget ID | Action | Permission |
|-----------|--------|------------|
| WGT-QAC-001 | Create employee | `hr.employee.create` |
| WGT-QAC-002 | Approve leave | `hr.leave.approve` |
| WGT-QAC-003 | Process payroll | `payroll.run.create` |
| WGT-QAC-004 | Assign asset | `hr.asset.assign` |
| WGT-QAC-005 | Create training | `hr.training.program.manage` |
| WGT-QAC-006 | Generate report | `hr.report.*` |

---

# Dashboard Personalization

Per [dashboard-widgets.md](../../ui-ux/dashboard-widgets.md).

| Capability | Rule |
|------------|------|
| **Rearrange widgets** | Drag handle in edit mode |
| **Hide widgets** | Remove from layout — catalog can restore |
| **Pin widgets** | Pin to top row |
| **Save layouts** | `user_dashboard_layouts` — per user, per dashboard route |
| **Custom dashboards** | Future: user-created dashboard from widget catalog |
| **Reset** | Restore role default template |
| **Role catalog** | Widget picker shows only permitted widgets |

### Layout storage (conceptual)

| Field | Description |
|-------|-------------|
| `user_id` | Owner |
| `dashboard_key` | e.g. `hr.manager` |
| `company_id` | Scope |
| `layout_json` | Grid positions + widget IDs |
| `is_default_override` | User customized flag |

---

# Mobile Dashboard Strategy

| Element | Mobile behavior |
|---------|-----------------|
| **KPI cards** | 2-column grid; swipe for more |
| **Analytics** | Single chart per row; tap expand fullscreen |
| **Approvals** | Priority list first; swipe approve (future) |
| **Notifications** | Collapsed top 5 + link to center |
| **Quick actions** | Horizontal scroll chip bar |
| **ESS** | Bottom nav; dashboard = home tab |
| **Customize** | Hidden on mobile (or simplified hide only) |

**Payroll processing:** Desktop-first — mobile shows status KPI only.

---

# Permission Based Dashboard Visibility

### Who sees what

| Widget category | Employee | Team Lead | Dept Mgr | HR Exec | HR Mgr | Payroll | Executive |
|-----------------|----------|-----------|----------|---------|--------|---------|-----------|
| Workforce KPIs | Self | Team | Dept | ✓ | ✓ | View | Aggregated |
| Salary / payroll cost | Own payslip | — | — | — | Summary | ✓ | ✓ |
| Approval queues | Own | Team | Team | — | ✓ | Payroll | — |
| AI attrition | — | — | — | — | ✓ | — | ✓ |
| Bank export status | — | — | — | — | — | ✓ | — |

### Scope dimensions

| Dimension | Applies to |
|-----------|------------|
| **Company** | All widgets — session `company_id` |
| **Branch** | Branch Admin; optional header filter |
| **Department** | Manager dashboards — auto-filter |
| **Self** | ESS — `employee_id = session` |

### Widget permission check

```text
show_widget =
  widget.permission in user.permissions
  AND record_scope allows data
  AND module enabled (hr/payroll)
```

---

# Real Time Dashboard Strategy (future)

| Capability | Phase | Mechanism |
|------------|-------|-----------|
| **Live attendance** | P2 | Poll 60s or SSE `hr.attendance.updated` |
| **Live approvals** | P2 | SSE `core.approval.*` |
| **Live notifications** | P1 | Notification bell poll / SSE |
| **Live payroll status** | P2 | Run state machine events |
| **Live analytics** | P3 | Stream aggregates to chart widgets |

**Phase 1 (MVP):** Static refresh + manual refresh button per widget.  
**Rule:** Real-time never bypasses permission filters.

---

# KPI & Widget Master Registry (summary)

| Domain | KPI widgets | Chart widgets | List/Action widgets |
|--------|---------------|---------------|---------------------|
| Executive | 10 | 8 | 2 |
| HR Manager | 10 | 5 | 7 |
| Payroll | 7 | 7 | 3 banners |
| Manager | 6 | 2 | 5 |
| ESS | 6 | 1 | 6 actions |
| Recruitment | 6 | 5 | — |
| Attendance | 8 | 6 | — |
| Leave | 5 | 4 | 1 calendar |
| Performance | 5 | 4 | — |
| Training | 5 | 4 | — |
| Assets | 5 | 4 | — |
| Cross-cutting | — | — | Approval 5, Activity 5, Notification 4, AI 7, Quick 6 |

---

# API Planning (conceptual)

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/hr/dashboard/layout` | User layout |
| `PUT /api/v1/hr/dashboard/layout` | Save layout |
| `GET /api/v1/hr/dashboard/widgets` | Catalog for role |
| `GET /api/v1/hr/dashboard/kpis` | Batch KPI data |
| `GET /api/v1/hr/dashboard/charts/{id}` | Chart series |
| `GET /api/v1/hr/dashboard/actions` | Pending queues |
| `GET /api/v1/ess/dashboard` | ESS bundle |

---

# Cross-Reference Index

| Document | Relationship |
|----------|--------------|
| [HR_SCREEN_INVENTORY.md](./HR_SCREEN_INVENTORY.md) | Dashboard screen IDs |
| [HR_UI_UX_BLUEPRINT.md](./HR_UI_UX_BLUEPRINT.md) | Layout zones |
| [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md) | Widget visibility |
| [HR_DATABASE_ARCHITECTURE.md](./HR_DATABASE_ARCHITECTURE.md) | Analytics tables |
| [HR_ACTIVITY_LOG_ARCHITECTURE.md](./HR_ACTIVITY_LOG_ARCHITECTURE.md) | Activity widgets |
| [HR_NOTIFICATION_ARCHITECTURE.md](./HR_NOTIFICATION_ARCHITECTURE.md) | Notification widgets |
| [dashboard-widgets.md](../../ui-ux/dashboard-widgets.md) | Grid system |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll |
| **Owner** | Platform / HR domain |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |

---

**AgainERP HR & Payroll Dashboard Architecture** — role-based, widget-driven, KPI and analytics ready. AI advisory. No code.
