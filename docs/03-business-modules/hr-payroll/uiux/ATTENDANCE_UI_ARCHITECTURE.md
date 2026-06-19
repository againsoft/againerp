# HR & Payroll — Attendance UI Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll — Attendance Domain  
> **Document Type:** Attendance UI / Wireframe Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_UI_UX_BLUEPRINT.md](../HR_UI_UX_BLUEPRINT.md) · [HR_SCREEN_INVENTORY.md](../HR_SCREEN_INVENTORY.md) · [HR_WORKFLOW_ARCHITECTURE.md](../HR_WORKFLOW_ARCHITECTURE.md) · [uiux/HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) · [uiux/EMPLOYEE_PROFILE_UI_ARCHITECTURE.md](./EMPLOYEE_PROFILE_UI_ARCHITECTURE.md) · [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md) · [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md)  
> **Governance:** [UI_UX_DESIGN_STANDARDS.md](../../../04-uiux/standards/UI_UX_DESIGN_STANDARDS.md) · [dashboard-widgets.md](../../../04-uiux/standards/dashboard-widgets.md) · [activity-system.md](../../../04-uiux/standards/activity-system.md) · [PROJECT_COMMON_RULES.md](../../../00-foundation/PROJECT_COMMON_RULES.md)

**No visual mockups. No component code.**  
Defines **complete Attendance Management UI architecture** — operational screens, analytics, device management, compliance, and AI experience. Attendance is an **employee attendance intelligence platform**, not merely a timesheet.

**Route prefix:** `/hr/attendance` · **Settings:** `/hr/settings/attendance` · **Devices:** `/hr/settings/devices` · **ESS:** `/ess/attendance`

---

## Executive Summary

| Principle | UI rule |
|-----------|---------|
| **Intelligence platform** | Dashboard + analytics + AI — not just punch logs |
| **Multi-source ingestion** | Device · manual · import · ESS — unified daily row |
| **Exception-first** | Late · absent · missing punch surfaced before charts |
| **Drawer CRUD** | Corrections · devices — list + sheet drawer |
| **Payroll boundary** | Finalization status visible; lock indicators |
| **Compliance ready** | Audit trail on every correction |

**Screen namespace:** `SCR-HR-ATT-*` · **Widgets:** `WGT-ATT-*` · **Charts:** `CHT-ATT-*` · **Nav:** `NAV-HR-ATT-*`

---

# Attendance UI Philosophy

### Core belief

> **Attendance UI must answer three questions every morning: Who is here? Who is not? What needs fixing before payroll?**

| Stakeholder | Primary surface | Question |
|-------------|-----------------|----------|
| **HR Manager** | Daily attendance | Who is absent/late today? |
| **Branch Admin** | Dashboard + devices | Is sync healthy for my branch? |
| **Dept Manager** | Monthly matrix | Is my team covered this month? |
| **Payroll** | Finalization status | Is attendance locked for the period? |
| **Employee (ESS)** | Personal calendar | Did my punch record correctly? |
| **Compliance** | Reports + audit | Can we prove muster roll accuracy? |

### Attendance vs timesheet

| Timesheet mindset | AgainERP attendance intelligence |
|-------------------|----------------------------------|
| Hours entry grid | Status engine + punch reconciliation |
| Single view | Dashboard · daily · monthly · calendar · timeline · analytics |
| Reactive fixes | Exception queue + AI anomaly detection |
| Device silo | Device health + sync logs integrated |

### Wireframe fidelity

Grayscale zones · status code labels · grid span annotations · permission notes — no color hex values (status uses semantic names: Present, Absent, Late, etc.).

---

# Attendance User Experience Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **Today-first** | Default date = today on operational screens |
| 2 | **Status at a glance** | Every view encodes status consistently |
| 3 | **Drill-down everywhere** | KPI → filtered daily list → employee profile |
| 4 | **Correction with evidence** | Reason + attachment required |
| 5 | **Approval visible** | Badge on row until approved |
| 6 | **Device transparency** | Last sync + error count on dashboard |
| 7 | **Payroll caution** | Lock banner when period finalized |
| 8 | **Mobile ESS** | Check-in + correction request on phone |
| 9 | **Bulk operations** | Import/export wizards for HR |
| 10 | **AI advisory** | Insights never auto-correct attendance |

---

# Attendance Workspace Strategy

### Workspace model

```text
Attendance Workspace
├── Command (Dashboard)     — situational awareness
├── Operations (Daily)      — primary action surface
├── Planning (Monthly/Cal)  — pattern review
├── Governance (Corrections/Approvals) — controlled changes
├── Infrastructure (Devices/Sync) — data pipeline health
├── Intelligence (Analytics/AI) — trends and risks
└── Compliance (Reports/Settings) — policy and export
```

### View mode toggle (global)

Operational screens share a **view switcher** where applicable:

| Mode | Route | Best for |
|------|-------|----------|
| **Table** | `/daily` | Today ops |
| **Matrix** | `/monthly` | Month review |
| **Calendar** | `/calendar` | Visual scan |
| **Timeline** | `/timeline` | Punch forensics |

### URL-driven state

| Pattern | Example |
|---------|---------|
| List | `/hr/attendance/daily` |
| Filtered | `?date=2026-06-17&status=late&branch={id}` |
| Drawer | `?view={correction_id}` on corrections list |
| Wizard | `?import=1` · `?export=1` |

---

# Attendance Analytics Strategy

| Layer | Surface | Audience |
|-------|---------|----------|
| **Embedded** | Dashboard Zone C | HR daily |
| **Dedicated** | `/hr/attendance/analytics` | HR analysts |
| **Employee** | Profile → Attendance tab | Manager / HR |
| **Executive** | HR executive dashboard | Leadership |
| **AI** | Zone E + `/hr/ai/attendance` | HR leadership |

**Data pipeline:** `hr_attendance` → `hr_analytics_attendance_daily` → chart widgets

---

# AI Attendance Strategy

Per [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md) — agent `workforce_agent`.

| Mode | Surface | Risk |
|------|---------|------|
| **Anomaly detection** | Dashboard Zone E | Advisory |
| **Pattern narrative** | AI panel | Read-only |
| **Recommendations** | Shift/policy suggestions | Human apply |
| **Predictions** | Absence forecast | Medium — gated |

**Forbidden:** AI auto-approving corrections · AI modifying locked attendance

---

# Attendance Module Framework

Complete navigation structure per [HR_NAVIGATION_ARCHITECTURE.md](./HR_NAVIGATION_ARCHITECTURE.md).

```text
Attendance                              NAV-HR-ATT-000
├── Dashboard                           /hr/attendance                 SCR-HR-ATT-001
├── Daily Attendance                    /hr/attendance/daily           SCR-HR-ATT-002
├── Monthly Attendance                  /hr/attendance/monthly         SCR-HR-ATT-003
├── Calendar View                       /hr/attendance/calendar        SCR-HR-ATT-004
├── Timeline View                       /hr/attendance/timeline        SCR-HR-ATT-005
├── Attendance Corrections              /hr/attendance/corrections     SCR-HR-ATT-006
├── Approvals                           /hr/attendance/corrections?status=pending  SCR-HR-ATT-007
├── Devices                             /hr/settings/devices           SCR-HR-ATT-009
├── Device Logs                         (device drawer tab)
├── Sync Logs                           /hr/attendance/devices/logs    SCR-HR-ATT-011
├── Analytics                           /hr/attendance/analytics       SCR-HR-ATT-008
├── Reports                             /hr/reports/attendance-daily     SCR-HR-RPT-010
└── Settings                            /hr/settings/attendance        SCR-HR-SET-002
```

**Wizards:** Import `SCR-HR-ATT-012` · Export `SCR-HR-ATT-013`

---

# Attendance Dashboard

**Route:** `/hr/attendance` · **Screen:** `SCR-HR-ATT-001` / `SCR-HR-DSH-002` · **Template:** `DSH-ATT-001`

Extends [HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) zone framework (A–H). Attendance dashboard emphasizes **Zone D (exceptions)** and **Zone E (AI)**.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ZONE A — HEADER                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE B — KPI CARDS (9 status KPIs)                                          │
├───────────────────────────────────────┬─────────────────────────────────────┤
│ ZONE C — ANALYTICS (8 col)            │ ZONE D — EXCEPTIONS (4 col)         │
├───────────────────────────────────────┴─────────────────────────────────────┤
│ ZONE E — AI INSIGHTS                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE F — NOTIFICATIONS (device/sync alerts)                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE G — ACTIVITY FEED (attendance events)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE H — QUICK ACTIONS                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ZONE A — Header

| Component | Wireframe | Behavior |
|-----------|-----------|----------|
| **Date selector** | `[Date ▾]` | Default today; drives all widgets |
| **Branch filter** | `[Branch ▾]` | Scope KPIs + charts |
| **Department filter** | `[Dept ▾]` | Optional |
| **Employee filter** | `[Employee search]` | Jump to single-employee view |
| **Shift filter** | `[Shift ▾]` | Filter by shift definition |
| **Export** | `[Export ▾]` | Opens export wizard |
| **Refresh** | `[↻]` | Reload all widgets |
| **AI assistant** | `[✨]` | Attendance context panel |
| **Period lock badge** | `[Locked through Jun]` | When `hr.attendance.lock` active |

---

## ZONE B — KPI Cards

| Widget ID | KPI | Drill-down |
|-----------|-----|------------|
| WGT-ATT-KPI-001 | Present | `/hr/attendance/daily?status=present` |
| WGT-ATT-KPI-002 | Absent | `?status=absent` |
| WGT-ATT-KPI-003 | Late | `?status=late` |
| WGT-ATT-KPI-004 | Half Day | `?status=half_day` |
| WGT-ATT-KPI-005 | Leave | `?status=leave` |
| WGT-ATT-KPI-006 | Holiday | `?status=holiday` |
| WGT-ATT-KPI-007 | Weekend | `?status=weekend` |
| WGT-ATT-KPI-008 | Work From Home | `?status=wfh` |
| WGT-ATT-KPI-009 | Outdoor Duty | `?status=outdoor` |

**Layout:** Row 1: 5 KPIs · Row 2: 4 KPIs · each `3×2` grid unit

**Footer:** `% of expected workforce` summary chip

---

## ZONE C — Attendance Analytics

| Chart ID | Title | Type | Period |
|----------|-------|------|--------|
| CHT-ATT-001 | Daily Trend | Line | 30 days |
| CHT-ATT-002 | Weekly Trend | Bar | 12 weeks |
| CHT-ATT-003 | Monthly Trend | Area | 12 months |
| CHT-ATT-004 | Department Trend | Bar | Selected date |
| CHT-ATT-005 | Shift Trend | Line | 30 days |
| CHT-ATT-006 | Device Health | Table | Live |

**Layout:** `6×3` + `6×3` top row · `12×3` heatmap below

---

## ZONE D — Attendance Exceptions

| Exception queue | Max rows | Action |
|-----------------|----------|--------|
| **Late employees** | 10 | View · Notify |
| **Absent employees** | 10 | View · Correct |
| **Missing punches** | 10 | Correct drawer |
| **Pending corrections** | 10 | Approve |

**Wireframe:** Tabbed list widget `WGT-ATT-EXC-001` · badge counts on tabs

---

## ZONE E — AI Insights

| Widget ID | Insight |
|-----------|---------|
| WGT-AI-INS-001 | Attendance Risks |
| WGT-AI-INS-001 | Late Patterns (variant) |
| WGT-AI-INS-001 | Absence Patterns (variant) |
| WGT-AI-INS-001 | Compliance Risks (variant) |

**Layout:** 2×2 insight cards · link to `/hr/ai/attendance`

---

## ZONE F–H (summary)

| Zone | Content |
|------|---------|
| **F — Notifications** | Missing punch · device offline · sync failure |
| **G — Activity** | `WGT-ACT-LST-004` attendance events |
| **H — Quick actions** | Mark · Correct · Approve · Export · Sync · Report |

---

# Daily Attendance Screen

**Most important operational screen** · **Route:** `/hr/attendance/daily` · **Screen:** `SCR-HR-ATT-002`

### Page wireframe

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ PAGE HEADER: Daily Attendance · [Date] · [+ Manual Entry] [Import] [Export] │
├─────────────────────────────────────────────────────────────────────────────┤
│ FILTER BAR: Branch · Dept · Shift · Status · Employee search                │
├─────────────────────────────────────────────────────────────────────────────┤
│ ATTENDANCE TABLE (AG Grid)                                                  │
│ Photo | Employee | Dept | Shift | In | Out | Hours | Late | OT | Status | ⋮ │
├─────────────────────────────────────────────────────────────────────────────┤
│ SUMMARY FOOTER: Present 142 · Absent 8 · Late 12 · Missing punch 3          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Filters

| Filter | Type | URL param |
|--------|------|-----------|
| **Date** | Date picker (required) | `date` |
| **Company** | Session scope | — |
| **Branch** | Select | `branch_id` |
| **Department** | Tree select | `department_id` |
| **Shift** | Select | `shift_id` |
| **Attendance status** | Multi chips | `status` |
| **Employee** | Search autocomplete | `employee_id` |

### Table columns

| Column | Width | Notes |
|--------|-------|-------|
| **Employee** | flex | Photo + name + ID · link → profile |
| **Department** | md | |
| **Shift** | sm | Shift name |
| **Check in** | sm | Time or `—` |
| **Check out** | sm | Time or `—` |
| **Work hours** | sm | Decimal hours |
| **Late minutes** | sm | Highlight if > 0 |
| **Overtime** | sm | Minutes eligible |
| **Status** | sm | Badge — see status legend |
| **Actions** | icon | ⋮ menu |
| **Activity** | icon | Activity drawer |

### Status legend (semantic — not color spec)

`present` · `absent` · `late` · `half_day` · `leave` · `holiday` · `weekend` · `wfh` · `outdoor` · `missing_punch`

### Row actions (permission-gated)

| Action | Permission | Opens |
|--------|------------|-------|
| **View employee** | `hr.employee.view` | Profile drawer |
| **Correct attendance** | `hr.attendance.correct` | Correction drawer |
| **Approve correction** | `hr.attendance.correction.approve` | Approval modal |
| **Send notification** | `hr.attendance.view` | Notify employee modal |
| **View punches** | `hr.attendance.view` | Timeline filter |

### Summary footer

Aggregate counts for current filter set · click count → applies status filter

### Manual entry

`+ Manual Entry` → drawer on same route `?create=1` · `hr.attendance.manual`

---

# Monthly Attendance Screen

**Route:** `/hr/attendance/monthly` · **Screen:** `SCR-HR-ATT-003`

### Layout — monthly matrix

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ HEADER: Monthly Attendance · [Month ▾] [Year ▾] · Filters · Export          │
├─────────────────────────────────────────────────────────────────────────────┤
│ MATRIX TABLE                                                                │
│ Employee | Dept | 1 | 2 | 3 | … | 30 | Present | Absent | Late | %        │
│ [row]    |      | P | A | L | … | P  |   22    |   2    |  3   | 96%      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Rows

One row per employee (paginated virtual scroll)

### Columns

| Column group | Content |
|--------------|---------|
| **Fixed left** | Employee · Department |
| **Days 1–31** | Single-char status indicator |
| **Summary** | Present · Absent · Late · Leave · % |

### Day cell indicators

| Code | Status |
|------|--------|
| P | Present |
| A | Absent |
| L | Late |
| H | Half day |
| V | Leave |
| O | Holiday |
| W | Weekend |
| F | WFH |
| D | Outdoor duty |
| — | No data / future |

### Interactive features

| Feature | Behavior |
|---------|----------|
| **Hover details** | Tooltip: in/out times, late minutes |
| **Click cell** | Day detail drawer |
| **Quick edit** | Right-click / ⋮ → correct (permission) |
| **Quick approval** | If correction pending on date |
| **Quick analytics** | Shift+click → employee analytics |

**Mobile:** Employee list cards with week strip — full matrix desktop only

---

# Attendance Calendar View

**Route:** `/hr/attendance/calendar` · **Screen:** `SCR-HR-ATT-004`

### Calendar modes

| Mode | Wireframe | Use |
|------|-----------|-----|
| **Monthly** | Full month grid | Org-wide scan |
| **Weekly** | 7-column week | Team review |
| **Daily** | Single day columns by dept | Today ops alternative |

**Toggle:** `[Month] [Week] [Day]` in header

### Visual indicators

Each day cell shows:

- Status color block (semantic label in wireframe)
- Count badge: present/absent/late
- Dot for exceptions

### Interactions

| Action | Result |
|--------|--------|
| Click day | Navigate to daily list filtered |
| Click employee row | Profile attendance tab |
| Drag select | Bulk export (future) |

---

# Timeline View

**Route:** `/hr/attendance/timeline` · **Screen:** `SCR-HR-ATT-005`

### Purpose

Chronological punch and event history — forensics and audit support.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ FILTERS: Employee · Date range · Event type · Source                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ ── 2026-06-17 · Jane Akter ───────────────────────────────────────────────  │
│ 09:02  ● Check in · Device ZKT-01 · Dhaka Gate                              │
│ 09:17  ⚠ Late arrival · 17 min                                             │
│ 18:05  ● Check out · Device ZKT-01                                         │
│ 18:10  ● Overtime eligible flagged · 10 min                              │
│ ── 2026-06-16 ──────────────────────────────────────────────────────────  │
│ 14:30  ● Correction submitted · Missing punch                              │
│ 16:00  ✓ Correction approved · HR Manager                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Event types

| Event | Source |
|-------|--------|
| Check in / out | `hr_attendance_logs` |
| Late arrival | Engine calculation |
| Attendance correction | `hr_attendance_corrections` |
| Approval | `activity_approvals` |
| Overtime flag | `hr_overtime_requests` |
| Device sync | `hr_device_sync_logs` |
| Manual entry | `source=manual` |

**Grouping:** By employee + date · newest first within day

---

# Attendance Corrections

**Route:** `/hr/attendance/corrections` · **Screen:** `SCR-HR-ATT-006`

### Correction list wireframe

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ HEADER: Corrections · [+ New Correction]                                    │
│ TABS: [All][Pending][Approved][Rejected]                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ TABLE: ID | Employee | Date | Type | Status | Requester | Approver | Activity│
└─────────────────────────────────────────────────────────────────────────────┘
```

**Drawer:** `?view={id}` · `?create=1`

### Correction request layout (drawer)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ CORRECTION REQUEST · CR-2026-0142                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ SECTION: Original attendance                                                │
│ Date · Status · Check in · Check out · Source                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ SECTION: Requested change                                                   │
│ [New check in] [New check out] [New status]                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ SECTION: Reason (required)                                                  │
│ [textarea]                                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ SECTION: Attachments                                                          │
│ [upload zone]                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ SECTION: Approval chain                                                       │
│ Manager → HR (per policy) · status badges                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ SECTION: History / audit                                                      │
│ Timeline of state changes                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Submit] [Approve] [Reject] [Cancel]                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Workflow states (UI badges)

`draft` · `pending_manager` · `pending_hr` · `approved` · `rejected`

Per [HR_WORKFLOW_ARCHITECTURE.md](../HR_WORKFLOW_ARCHITECTURE.md) — `hr.attendance.correction`

**Payroll lock:** Banner if period locked — correction applies to next open period

---

# Attendance Approval Center

**Route:** `/hr/attendance/corrections?status=pending` · **Screen:** `SCR-HR-ATT-007`

Also embeddable in dashboard Zone D and Core `/inbox/approvals?type=attendance_correction`

### Tabs

| Tab | Filter |
|-----|--------|
| **Pending** | `status=pending_*` |
| **Approved** | `approved` |
| **Rejected** | `rejected` |
| **Escalated** | SLA breach |

### Approval card wireframe

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [avatar] Employee Name · EMP-0042                          [Pending Manager]│
│ Request: Correct check-in 09:00 → 08:45 on 2026-06-15                       │
│ Reason: "Device did not register morning punch"                             │
│ Submitted: Jun 15 by Employee · Approver: Karim Rahman                      │
│ [View original] [Approve] [Reject]                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Reject:** Comment required · **Approve:** Optional comment

---

# Device Management

*Critical section* — data pipeline health.

**Route:** `/hr/settings/devices` · **Screen:** `SCR-HR-ATT-009`

### Device dashboard (top of list page)

| Widget | Content |
|--------|---------|
| Total devices | Count |
| Online | Green status count |
| Offline / error | Red count |
| Last sync | Most recent timestamp |
| Punches today | Aggregate |

### Supported devices (architecture)

| Vendor | Connector | Status |
|--------|-----------|--------|
| **ZKTeco** | `zkteco_connector` | Phase 1 |
| **eSSL** | `essl_connector` | Phase 1 |
| **Fingerprint** | Generic biometric | Via vendor SDK |
| **Face recognition** | Generic biometric | Via vendor SDK |
| **Mobile check-in** | ESS app | Future |

### Device list columns

| Column | Content |
|--------|---------|
| **Device name** | Link → drawer |
| **Location** | Branch + site |
| **Status** | online · offline · error |
| **Last sync** | Relative time |
| **Employees synced** | Mapped count |
| **Actions** | Sync now · Edit · Logs |

**Drawer:** `SCR-HR-ATT-010` · `?view={id}`

---

# Device Details

**Drawer wireframe** — tabs inside device view.

| Tab | Content |
|-----|---------|
| **Information** | IP, model, branch, timezone, API key masked |
| **Sync history** | Last 20 sync runs |
| **Employee mapping** | Device user ID ↔ employee table |
| **Logs** | Raw error log stream |
| **Health** | Uptime, latency, queue depth |
| **Errors** | Unresolved error list + retry |

### Actions

| Action | Permission |
|--------|------------|
| **Sync now** | `hr.attendance.device.manage` |
| **Test connection** | same |
| **Remap employee** | same |
| **Disable device** | same |

---

# Sync Logs

**Route:** `/hr/attendance/devices/logs` · **Screen:** `SCR-HR-ATT-011`

### Log categories

| Tab | Filter |
|-----|--------|
| **Successful syncs** | `status=success` |
| **Failed syncs** | `status=failed` |
| **Pending syncs** | `status=pending` |
| **Retry queue** | `retry_scheduled=true` |

### Log row columns

Device · Started · Duration · Records pulled · Errors · Actions (retry)

### Analytics (embedded)

| Chart | Metric |
|-------|--------|
| Sync performance | Avg duration trend |
| Error trends | Errors by device/type |

---

# Attendance Analytics

**Route:** `/hr/attendance/analytics` · **Screen:** `SCR-HR-ATT-008`

### Page layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ HEADER: Attendance Analytics · Date range · Branch · Dept · Export            │
├─────────────────────────────────────────────────────────────────────────────┤
│ FILTER SIDEBAR (3 col)  │  CHART AREA (9 col)                               │
│ Date range              │  [Trend charts stack]                               │
│ Branch                  │  [Heatmaps]                                       │
│ Department              │  [Tables]                                         │
│ Shift                   │                                                   │
│ Employee                │                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ AI PANEL (full width)                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Analysis dimensions

| Dimension | Charts |
|-----------|--------|
| **Attendance trends** | Line — present % over time |
| **Late trends** | Bar — late count by week |
| **Absence trends** | Area — absent days |
| **Shift analysis** | Compare shifts |
| **Department analysis** | Dept bar chart |
| **Employee analysis** | Bottom quartile table |

### Visualization types

Line · Bar · Heatmap · Trend cards · Ranked tables

---

# Attendance Heatmap

Embedded in analytics and dashboard.

| Heatmap | Axes | Metric |
|---------|------|--------|
| **Department heatmap** | Dept × weekday | Late rate |
| **Employee heatmap** | Employee × week | Absence count |
| **Attendance density** | Hour × day | Check-in distribution |
| **Late density** | Dept × date | Late count |
| **Absence density** | Branch × month | Absent days |

**Wireframe:** `8×3` grid placeholder · legend strip · click cell → filtered daily list

---

# AI Attendance Panel

**Routes:** Dashboard Zone E · `/hr/ai/attendance` · `SCR-AI-HR-003`

### Insights section

| Insight | Example |
|---------|---------|
| **Attendance anomalies** | Unusual absence cluster in Sales |
| **Late patterns** | Recurring Monday lateness |
| **Absence risks** | 3+ day streak employees |
| **Compliance risks** | Missing muster roll days |

### Recommendations section

| Recommendation | Action |
|----------------|--------|
| **Shift adjustments** | Review shift start times |
| **Training needs** | Punctuality workshop |
| **Manager alerts** | Notify dept heads |
| **Policy suggestions** | Grace period review |

### Predictions (future)

| Prediction | Output |
|------------|--------|
| Future attendance risks | Risk score per employee |
| Attrition signals | Correlation with absence |
| Absence forecasting | Next week absence probability |

**Card anatomy:** Title · narrative · confidence · sources · Dismiss · View details

---

# Employee Attendance View

Embedded in [EMPLOYEE_PROFILE_UI_ARCHITECTURE.md](./EMPLOYEE_PROFILE_UI_ARCHITECTURE.md) Tab 5 · ESS `/ess/attendance`

### Personal dashboard (ESS)

| Widget | Content |
|--------|---------|
| This month summary | Present/absent/late counts |
| Attendance rate | % chip |
| Work hours | MTD total |
| Overtime | Eligible hours |

### Sections

| Section | Admin profile | ESS |
|---------|---------------|-----|
| Attendance calendar | ✓ | ✓ |
| Monthly summary | ✓ | ✓ |
| Work hours | ✓ | ✓ |
| Overtime | ✓ | View only |
| Corrections | Create + history | Request only |

---

# Mobile Experience

### HR mobile (branch admin)

| Screen | Adaptation |
|--------|------------|
| **Dashboard** | KPI 2×2 · exception list first |
| **Daily list** | Card per employee · status badge prominent |
| **Calendar** | Week view default |
| **Corrections** | Full-width drawer |
| **Notifications** | Push for sync failure |
| **AI insights** | Single collapsed card |

### ESS mobile

| Screen | Route |
|--------|-------|
| Attendance home | `/ess/attendance` |
| Month calendar | Same route scroll |
| Correction request | `?correction=1` |
| Notifications | Bell |

**Check-in (future):** FAB on ESS attendance · geo validation annotation

---

# Global Quick Actions

| ID | Action | Route / trigger | Permission |
|----|--------|-----------------|------------|
| QUICK-ATT-001 | Mark attendance | Daily `?create=1` | `hr.attendance.manual` |
| QUICK-ATT-002 | Approve attendance | Corrections pending | `hr.attendance.correction.approve` |
| QUICK-ATT-003 | Correct attendance | Correction drawer | `hr.attendance.correct` |
| QUICK-ATT-004 | Export attendance | `?export=1` wizard | `hr.attendance.export` |
| QUICK-ATT-005 | Sync device | Device list action | `hr.attendance.device.manage` |
| QUICK-ATT-006 | Generate report | `/hr/reports/attendance-daily` | `hr.report.attendance.view` |

**Surfaces:** Dashboard Zone H · top `+` menu · daily list header

---

# Notification Experience

| Notification type | Trigger | Recipient |
|-------------------|---------|-----------|
| **Missing punch** | EOD detection job | Employee + manager |
| **Late alert** | Late calculation | Employee · manager digest |
| **Attendance correction** | Submitted/approved/rejected | Requester + approver |
| **Approval required** | Pending state | Approver |
| **Device offline** | Health check fail | HR admin |
| **Sync failure** | Connector error | HR admin + branch admin |

**UI:** Bell · dashboard Zone F · employee profile notifications

---

# Activity Timeline

Attendance-specific activity types per [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md).

| Category | Events |
|----------|--------|
| **Attendance events** | Punch · status change · finalize |
| **Corrections** | Submit · approve · reject · recalculate |
| **Approvals** | Manager/HR decisions |
| **Sync activities** | Device sync start/complete/fail |
| **AI activities** | Anomaly scan · insight generated |

**Surfaces:**

- Global Activity Drawer on daily list rows
- `/hr/attendance/timeline` full page
- Employee profile → Timeline tab (filtered)

---

# Permission Experience

### UI visibility matrix

| Surface | Employee | Manager | HR Exec | HR Mgr | Payroll | Admin |
|---------|----------|---------|---------|--------|---------|-------|
| Dashboard | — | Team subset | ✓ | ✓ | View lock | ✓ |
| Daily list | — | Team | ✓ | ✓ | View | ✓ |
| Monthly matrix | — | Team | ✓ | ✓ | View | ✓ |
| Manual entry | — | — | ✓ | ✓ | — | ✓ |
| Corrections create | Self ESS | Team | ✓ | ✓ | — | ✓ |
| Corrections approve | — | Team | ✓ | ✓ | — | ✓ |
| Devices | — | — | — | ✓ | — | ✓ |
| Analytics | — | — | ✓ | ✓ | View | ✓ |
| Export | — | — | ✓ | ✓ | ✓ | ✓ |
| Period lock | — | — | — | ✓ | ✓ | ✓ |
| Audit timeline | — | — | ✓ | ✓ | ✓ | ✓ |

### Record scope

| Role | Daily/monthly data scope |
|------|--------------------------|
| **Team Leader** | Direct reports |
| **Dept Manager** | Department subtree |
| **Branch Admin** | Branch |
| **HR** | Company |
| **Employee** | Self only on ESS |

**Rule:** Hide actions — never disabled tease.

---

# Responsive Strategy

| Breakpoint | Daily list | Monthly matrix | Dashboard |
|------------|------------|----------------|-----------|
| **Desktop ≥1280** | Full AG Grid | Full matrix | C+D side-by-side |
| **Tablet 768–1279** | Horizontal scroll table | Week columns only | Stacked zones |
| **Mobile <768** | Card list | Hidden — link to calendar | KPI + exceptions only |

| Pattern | Mobile behavior |
|---------|-----------------|
| Filters | Collapsible filter sheet |
| Bulk actions | Selection mode |
| Device management | Desktop-preferred |
| Heatmap | Tap to expand fullscreen |

---

# AI First Experience

### AI attendance summary

| Element | Location |
|---------|----------|
| **Daily narrative** | Dashboard Zone E header |
| **Risk count badge** | Zone A next to ✨ |
| **Top 3 anomalies** | Insight cards |

### AI daily briefing

| Audience | Delivery | Time |
|----------|----------|------|
| HR Manager | Dashboard banner | 06:00 tenant TZ |
| Branch Admin | Branch-scoped digest | Same |
| Dept Manager | Team late/absent summary | Same |

### AI attendance risk panel

Composite indicators:

| Risk | Signal |
|------|--------|
| Chronic lateness | ≥3 late in 14 days |
| Absence streak | ≥2 consecutive absent |
| Missing punch pattern | Recurring EOD gaps |
| Device mapping gap | Unmapped device users |

### AI recommendations

Ranked list with **Apply** (opens relevant screen) · **Dismiss** · **Snooze**

**Governance:** No auto-correction · No auto-approval · Audit log on dismiss

---

# Import / Export Wizards

| Wizard | Screen | Steps |
|--------|--------|-------|
| **Import** | `SCR-HR-ATT-012` | Upload → Map columns → Validate → Commit |
| **Export** | `SCR-HR-ATT-013` | Select range → Format → Filters → Download |

**Entry:** Dashboard header · daily list header · `?import=1` · `?export=1`

---

# Settings Screen

**Route:** `/hr/settings/attendance` · **Screen:** `SCR-HR-SET-002`

| Section | Content |
|---------|---------|
| **Policies** | Grace period · late tiers |
| **Working days** | Week pattern |
| **Finalization** | Auto-finalize schedule |
| **ESS rules** | Mobile check-in policy (future) |
| **Notifications** | Alert thresholds |

---

# Cross-Reference Index

| Document | Use |
|----------|-----|
| [HR_WORKFLOW_ARCHITECTURE.md](../HR_WORKFLOW_ARCHITECTURE.md) | Correction workflow states |
| [HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) | Zone framework |
| [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../HR_FIGMA_WIREFRAME_BLUEPRINT.md) | Attendance wireframes |
| [uiux/HR_NAVIGATION_ARCHITECTURE.md](./HR_NAVIGATION_ARCHITECTURE.md) | Nav tree |
| [HR_AUTOMATION_ENGINE_ARCHITECTURE.md](../HR_AUTOMATION_ENGINE_ARCHITECTURE.md) | `AUTO-HR-ATT-*` rules |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll — Attendance |
| **Owner** | Product / Design |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Screens defined** | 13 + wizards |
| **Primary operational screen** | SCR-HR-ATT-002 |

---

**AgainERP Attendance UI Architecture** — attendance intelligence platform foundation for wireframes, operations, analytics, compliance, and AI experience.
