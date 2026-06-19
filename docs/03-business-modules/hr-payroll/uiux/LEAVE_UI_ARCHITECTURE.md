# HR & Payroll — Leave UI Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll — Leave Domain  
> **Document Type:** Leave UI / Wireframe Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_UI_UX_BLUEPRINT.md](../HR_UI_UX_BLUEPRINT.md) · [HR_SCREEN_INVENTORY.md](../HR_SCREEN_INVENTORY.md) · [HR_WORKFLOW_ARCHITECTURE.md](../HR_WORKFLOW_ARCHITECTURE.md) · [HR_PERMISSION_MATRIX.md](../HR_PERMISSION_MATRIX.md) · [uiux/HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) · [uiux/EMPLOYEE_PROFILE_UI_ARCHITECTURE.md](./EMPLOYEE_PROFILE_UI_ARCHITECTURE.md) · [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md) · [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md)  
> **Governance:** [UI_UX_DESIGN_STANDARDS.md](../../../04-uiux/standards/UI_UX_DESIGN_STANDARDS.md) · [dashboard-widgets.md](../../../04-uiux/standards/dashboard-widgets.md) · [activity-system.md](../../../04-uiux/standards/activity-system.md) · [PROJECT_COMMON_RULES.md](../../../00-foundation/PROJECT_COMMON_RULES.md)

**No visual mockups. No component code.**  
Defines **complete Leave Management UI architecture** — workforce planning, compliance, approvals, policy administration, and AI experience. Leave is a **workforce planning and compliance system**, not merely a request form.

**Route prefix:** `/hr/leave` · **Settings:** `/hr/settings/leave` · **Holidays:** `/hr/settings/holidays` · **ESS:** `/ess/leave`

---

## Executive Summary

| Principle | UI rule |
|-----------|---------|
| **Planning-first** | Calendar + availability before individual requests |
| **Policy-gated** | Every apply action runs validation preview |
| **Approval-native** | Core Approval Engine — not custom leave-only inbox |
| **Balance transparency** | Balance visible at apply, approve, and dashboard |
| **Payroll linkage** | Paid/unpaid impact flagged before approval |
| **Drawer CRUD** | Requests · policies — list + sheet drawer |
| **AI advisory** | Abuse detection and forecasting — never auto-approve |

**Screen namespace:** `SCR-HR-LEV-*` · **ESS:** `SCR-ESS-LEV-*` · **Widgets:** `WGT-LEV-*` · **Charts:** `CHT-LEV-*` · **Nav:** `NAV-HR-LEV-*`

---

# Leave UI Philosophy

### Core belief

> **Leave UI must answer: Who is out? Who is going out? Can we afford the gap? Is it policy-compliant?**

| Stakeholder | Primary surface | Question |
|-------------|-----------------|----------|
| **Employee** | ESS apply | Do I have balance? Will it be approved? |
| **Manager** | Team calendar + approvals | Is my team covered? |
| **HR Manager** | Dashboard + policies | Are we compliant? Any abuse patterns? |
| **Payroll** | Approved leave export | What hits this pay period? |
| **Executive** | Analytics | Leave cost and availability risk? |

### Leave form vs workforce planning

| Form mindset | AgainERP leave intelligence |
|--------------|----------------------------|
| Submit and forget | Balance · policy · conflict · coverage preview |
| Single calendar | Org · dept · team · employee views |
| Manager email approval | Approval center + bulk actions + SLA escalation |
| Static balance | Accrual · carry forward · encashment lifecycle |

### Wireframe fidelity

Grayscale zones · status labels · grid annotations · permission notes — semantic status names only (Pending, Approved, Rejected, etc.).

---

# Leave Experience Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **Balance visible early** | Show balance before date selection completes |
| 2 | **Policy preview** | Approval route + rules before submit |
| 3 | **Conflict detection** | Overlap · blackout · team capacity warnings |
| 4 | **Impact analysis** | Team availability on approval card |
| 5 | **Half-day precision** | AM/PM toggle on date range |
| 6 | **Audit everything** | Balance adjustments need reason |
| 7 | **No self-approval** | SoD — approver ≠ requester |
| 8 | **Calendar is king** | Who's-out view on dashboard + dedicated screen |
| 9 | **Encashment caution** | Payroll impact preview |
| 10 | **AI assists planning** | Never auto-approve or deduct balance |

---

# Leave Workspace Strategy

### Workspace model

```text
Leave Workspace
├── Command (Dashboard)        — org leave posture
├── Operations (Requests)      — transactional core
├── Planning (Calendar)        — workforce availability
├── Governance (Approvals)     — human decisions
├── Policy (Policies/Accrual)  — rules engine config
├── Compensation (Encashment)  — payroll bridge
├── Intelligence (Analytics/AI)— trends and risks
└── Compliance (Reports/Holidays) — statutory + company calendar
```

### URL-driven state

| Pattern | Example |
|---------|---------|
| List | `/hr/leave/requests` |
| Create | `?create=1` |
| View drawer | `?view={id}` |
| Filtered | `?status=pending&department_id={}` |
| Calendar | `/hr/leave/calendar?view=team` |

---

# Leave Analytics Strategy

| Layer | Surface | Audience |
|-------|---------|----------|
| **Embedded** | Dashboard Zone C | HR daily |
| **Workforce availability** | Dedicated view + calendar overlay | Managers |
| **Dedicated analytics** | Reports + future `/hr/leave/analytics` | HR analysts |
| **Employee** | Profile → Leave tab | Employee / manager |
| **AI** | Zone F + `/hr/ai` leave insights | HR leadership |

**Pipeline:** `hr_leave_requests` → `hr_analytics_leave_summary` → widgets

---

# AI Leave Strategy

Per [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md).

| Mode | Surface | Risk |
|------|---------|------|
| **Pattern detection** | Abuse · clustering | Advisory |
| **Forecasting** | Demand · availability | Medium |
| **Recommendations** | Policy · coverage | Human apply |
| **Approval assist** | Suggested decision | Never auto-approve |

**Tools:** `hr.tool.team_leave_calendar` · `hr.suggest_leave_coverage` · leave abuse models

---

# Leave Module Framework

Per [HR_NAVIGATION_ARCHITECTURE.md](./HR_NAVIGATION_ARCHITECTURE.md).

```text
Leave                                    NAV-HR-LEV-000
├── Dashboard                            /hr/leave                      SCR-HR-LEV-001 / SCR-HR-DSH-003
├── Leave Requests                       /hr/leave/requests             SCR-HR-LEV-002
├── Approval Center                      /hr/leave/requests?status=pending  SCR-HR-LEV-006
│                                        /inbox/approvals?type=leave
├── Leave Calendar                       /hr/leave/calendar             SCR-HR-LEV-004
├── Leave Balances                       /hr/leave/balances             SCR-HR-LEV-005
├── Leave Policies                       /hr/settings/leave             SCR-HR-LEV-007
├── Leave Accruals                       /hr/settings/leave/accrual     SCR-HR-LEV-008
├── Leave Encashments                    /hr/leave/encashment           SCR-HR-LEV-009
├── Holiday Calendar                     /hr/settings/holidays          SCR-HR-LEV-010
├── Analytics                            /hr/reports/leave-taken        SCR-HR-RPT-021
├── Reports                              /hr/reports/leave-balance      SCR-HR-RPT-020
└── Settings                             /hr/settings/leave             SCR-HR-SET-003
```

**Drawer:** Leave details `SCR-HR-LEV-003` on requests route

---

# Leave Dashboard

**Route:** `/hr/leave` · **Template:** `DSH-LEV-001` · **Screen:** `SCR-HR-LEV-001` / `SCR-HR-DSH-003`

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ZONE A — HEADER                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE B — KPI CARDS                                                          │
├───────────────────────────────────────┬─────────────────────────────────────┤
│ ZONE C — ANALYTICS (8 col)            │ ZONE D — APPROVAL QUEUE (4 col)     │
├───────────────────────────────────────┴─────────────────────────────────────┤
│ ZONE E — NOTIFICATIONS                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE F — AI INSIGHTS                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE G — WHO'S OUT CALENDAR (WGT-LEV-CAL-001)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE H — QUICK ACTIONS                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ZONE A — Header

| Component | Wireframe | Behavior |
|-----------|-----------|----------|
| **Date range** | `[Range ▾]` | Default 30d / MTD |
| **Company filter** | Session / multi-co executive | |
| **Branch filter** | `[Branch ▾]` | |
| **Department filter** | `[Dept ▾]` | |
| **Employee filter** | `[Employee search]` | |
| **Leave type filter** | `[Type ▾]` | Annual · Sick · etc. |
| **Export** | `[Export ▾]` | Report links |
| **Refresh** | `[↻]` | |
| **AI assistant** | `[✨]` | Leave context panel |

---

## ZONE B — KPI Cards

| Widget ID | KPI | Drill-down |
|-----------|-----|------------|
| WGT-LEV-KPI-001 | Pending Requests | `/hr/leave/requests?status=pending` |
| WGT-LEV-KPI-002 | Approved Leaves | `?status=approved` |
| WGT-LEV-KPI-003 | Rejected Leaves | `?status=rejected` |
| WGT-LEV-KPI-004 | Employees On Leave | `/hr/leave/calendar?today=1` |
| WGT-LEV-KPI-005 | Leave Balance Usage | `/hr/leave/balances` |
| WGT-LEV-KPI-006 | Encashments | `/hr/leave/encashment?status=pending` |
| WGT-LEV-KPI-007 | Upcoming Holidays | `/hr/settings/holidays` |
| WGT-LEV-KPI-008 | Compliance Alerts | Policy/balance warnings |

**Layout:** 4+4 KPIs across two rows · `3×2` each

---

## ZONE C — Analytics

| Chart ID | Title | Type |
|----------|-------|------|
| CHT-LEV-001 | Leave Trends | Line |
| CHT-LEV-003 | Department Leave Trends | Bar |
| CHT-LEV-004 | Leave Type Distribution | Donut |
| CHT-LEV-002 | Approval Performance | Scorecard (avg hours) |
| CHT-LEV-005 | Leave Forecast | Area (AI-assisted future) |

---

## ZONE D — Approval Queue

| Queue | Max rows |
|-------|----------|
| Pending leave requests | 10 |
| Escalated requests | 5 |
| Recently approved | 5 |
| Recently rejected | 5 |

**Widget:** `WGT-HR-ACT-001` variant · inline Approve/Reject

---

## ZONE E — Notifications

| Type | Example |
|------|---------|
| **Policy alerts** | Blackout period reminder |
| **Balance alerts** | Low balance threshold |
| **Holiday announcements** | Public holiday next week |
| **Pending actions** | Approvals due |

---

## ZONE F — AI Insights

| Widget ID | Insight |
|-----------|---------|
| WGT-AI-INS-006 | Leave Abuse Risks |
| WGT-AI-INS-006 | Leave Trends (variant) |
| WGT-AI-INS-006 | Workforce Availability Risks |
| WGT-AI-INS-006 | Department Leave Conflicts |

---

## ZONE G — Who's Out Calendar

**Widget:** `WGT-LEV-CAL-001` — week strip or mini month · click → full calendar

---

## ZONE H — Quick Actions

| Action | Route |
|--------|-------|
| Apply leave (HR on behalf) | `?create=1` |
| Approve requests | Pending queue |
| View calendar | `/hr/leave/calendar` |
| Adjust balance | `/hr/leave/balances?adjust=1` |
| Generate report | `/hr/reports/leave-balance` |

---

# Leave Request List

**Most important operational screen** · **Route:** `/hr/leave/requests` · **Screen:** `SCR-HR-LEV-002`

### Page wireframe

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ HEADER: Leave Requests · [+ Apply Leave] [Bulk Actions] [Export]              │
├─────────────────────────────────────────────────────────────────────────────┤
│ FILTER BAR: Date range · Employee · Dept · Branch · Type · Status · Approver│
├─────────────────────────────────────────────────────────────────────────────┤
│ REQUEST TABLE (AG Grid)                                                     │
│ Req# | Employee | Dept | Type | Start | End | Days | Applied | Status | ⋮  │
├─────────────────────────────────────────────────────────────────────────────┤
│ SUMMARY FOOTER: Pending 12 · Approved 45 · Rejected 3 · Total days 128      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Filters

| Filter | URL param |
|--------|-----------|
| Date range | `from` · `to` |
| Employee | `employee_id` |
| Department | `department_id` |
| Branch | `branch_id` |
| Leave type | `leave_type_id` |
| Status | `status` |
| Approver | `approver_id` |

### Table columns

| Column | Notes |
|--------|-------|
| **Request no** | `LR-YYYY-####` link → drawer |
| **Employee** | Photo + name |
| **Department** | |
| **Leave type** | |
| **Start date** | |
| **End date** | |
| **Duration** | Days (0.5 increments) |
| **Applied date** | |
| **Status** | Badge |
| **Approver** | Current step assignee |
| **Actions** | ⋮ menu |
| **Activity** | Activity icon |

### Status badges

`draft` · `pending_manager` · `pending_hr` · `approved` · `rejected` · `cancelled` · `taken`

### Quick row actions

| Action | Permission |
|--------|------------|
| **View** | `hr.leave.view` |
| **Approve** | `hr.leave.approve` |
| **Reject** | `hr.leave.approve` |
| **Escalate** | `core.approval.act` |
| **Comment** | Activity drawer |

---

# Leave Request Details

**Drawer:** `SCR-HR-LEV-003` · `?view={id}` on requests route

```text
┌──────────────────────────────────────────────┬──────────────────────────────┐
│ MAIN AREA                                    │ SIDE PANEL                   │
├──────────────────────────────────────────────┤                              │
│ HEADER: LR-2026-0142 · [Status badge]        │ Leave balance by type        │
│ Employee card (link to profile)              │ Recent leave history         │
├──────────────────────────────────────────────┤ Upcoming holidays            │
│ Leave information                            │ AI suggestions               │
│ Type · dates · half-day · duration           │                              │
├──────────────────────────────────────────────┤                              │
│ Reason + attachments                         │                              │
├──────────────────────────────────────────────┤                              │
│ Approval chain (stepper)                     │                              │
├──────────────────────────────────────────────┤                              │
│ Impact analysis                              │                              │
│ · Balance after approval                     │                              │
│ · Team members out same dates                │                              │
│ · Dept capacity %                            │                              │
│ · Payroll: paid/unpaid flag                  │                              │
├──────────────────────────────────────────────┤                              │
│ [Approve] [Reject] [Cancel] [Comment]        │                              │
└──────────────────────────────────────────────┴──────────────────────────────┘
```

**Mobile:** Side panel stacks below main area

---

# Leave Application Experience

**Entry:** `?create=1` on `/hr/leave/requests` or `/ess/leave?create=1`

### Application workspace sections

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1 — Leave type          [Annual ▾]                                     │
│ STEP 2 — Date selection      [Start] [End]  [Half day AM/PM toggles]         │
│ STEP 3 — Emergency leave     [ ] Emergency (skip notice if policy allows)   │
│ STEP 4 — Reason              [textarea — required]                          │
│ STEP 5 — Attachments         [upload — medical cert etc.]                  │
│ STEP 6 — Delegate assignment [Employee ▾] (optional)                        │
│ STEP 7 — Coverage planning   [notes + suggested coverage from AI]           │
├─────────────────────────────────────────────────────────────────────────────┤
│ SYSTEM CHECKS PANEL (live validation)                                       │
│ ✓ Leave balance sufficient — 12 days remaining after request              │
│ ✓ Policy: 3 days advance notice met                                       │
│ ✓ No holiday conflict                                                       │
│ ⚠ Team: 2 others already on leave Jun 20–22                               │
│ → Approval route: Manager → HR                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Save draft] [Submit request]                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### System checks

| Check | UI feedback |
|-------|-------------|
| **Leave balance validation** | Pass/fail + remaining days |
| **Policy validation** | Notice days · probation · max consecutive |
| **Holiday validation** | Exclude holidays from day count |
| **Conflict detection** | Overlap with existing leave |
| **Approval route preview** | Stepper preview from Approval Engine |

**ESS:** Simplified — fewer fields · same validation panel

---

# Leave Approval Center

**Routes:**
- `/hr/leave/requests?status=pending` · `SCR-HR-LEV-006`
- `/inbox/approvals?type=leave` · Core inbox

### Views (tabs)

| Tab | Filter |
|-----|--------|
| **Pending** | `pending_*` |
| **Approved** | `approved` |
| **Rejected** | `rejected` |
| **Escalated** | SLA breach |
| **All requests** | No status filter |

### Approval card wireframe

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [avatar] Jane Akter · Annual Leave · 5 days (Jun 10–14)      [Pending Mgr]  │
│ Reason: Family event                                                        │
│ Balance impact: 12 → 7 days remaining                                       │
│ Team impact: 1 other on leave · Dept capacity 78%                           │
│ Approval history: Submitted Jun 1 · Manager pending since Jun 2           │
│ [View details] [Approve] [Reject] [Escalate] [Comment]                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Bulk actions

| Action | Permission | UI |
|--------|------------|-----|
| **Approve** | `hr.leave.approve` | Multi-select + confirm |
| **Reject** | same | Requires comment |
| **Escalate** | `core.approval.act` | |
| **Assign reviewer** | HR Manager | Delegation modal |

**SoD:** Cannot approve own request — row hidden or 403

---

# Leave Calendar

*Critical screen* · **Route:** `/hr/leave/calendar` · **Screen:** `SCR-HR-LEV-004`

### Calendar modes

| Mode | Wireframe |
|------|-----------|
| **Monthly** | Full month grid (default) |
| **Weekly** | 7-day columns |
| **Daily** | Single day timeline by employee |
| **Yearly** | 12-month heatmap overview |

**Toggle:** `[Month] [Week] [Day] [Year]`

### Views (scope)

| View | Audience | Scope |
|------|----------|-------|
| **Organization** | HR | Company |
| **Department** | Manager | Dept subtree |
| **Team** | Team lead | Direct reports |
| **Employee** | Self / HR | Single employee |

**URL:** `?view=org|dept|team|employee`

### Visual indicators (cell/event)

| Indicator | Meaning |
|-----------|---------|
| **Approved leave** | Solid block |
| **Pending leave** | Striped/hatched block |
| **Holiday** | Holiday marker |
| **Weekend** | Muted cell |
| **WFH** | Cross-domain from attendance |
| **Training** | Training session overlay |
| **Business travel** | Travel request overlay (future) |

### Interactive features

| Feature | Behavior |
|---------|----------|
| **Quick apply** | Click empty cell → apply drawer with date prefill |
| **Quick approve** | Click pending event → approve modal |
| **Conflict detection** | Red badge when dept capacity below threshold |
| **Availability check** | Hover shows % available |

---

# Leave Balance Screen

**Route:** `/hr/leave/balances` · **Screen:** `SCR-HR-LEV-005`

### Row structure (employee × leave type)

| Column | Content |
|--------|---------|
| Employee | Link to profile |
| Leave type | |
| Opening balance | |
| Accrued | Period accrual |
| Carry forward | |
| Used | |
| Encashment eligible | |
| Remaining | Highlight |
| Actions | Adjust · History |

### Views (toggle)

| View | Aggregation |
|------|-------------|
| **Employee** | Default table |
| **Department** | Rollup by dept |
| **Branch** | Rollup by branch |
| **Company** | Executive summary |

**Adjust balance:** `hr.leave.balance.adjust` → modal with reason (audit required)

---

# Leave Policy Management

**Route:** `/hr/settings/leave` · **Screen:** `SCR-HR-LEV-007`

### Policy list

| Column | Content |
|--------|---------|
| Policy name | Link → detail |
| Leave types covered | |
| Status | active · draft |
| Effective dates | |
| Version | |

### Policy details (sections)

| Section | Content |
|---------|---------|
| **Eligibility rules** | Employment type · probation · tenure |
| **Accrual rules** | Rate · frequency · caps |
| **Carry forward rules** | Max carry · expiry |
| **Encashment rules** | Window · max days |
| **Negative balance rules** | Allowed? · limit |
| **Notice rules** | Min advance days |
| **Blackout dates** | Calendar link |

### Policy simulator

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ POLICY SIMULATOR                                                            │
│ Employee: [select] · Leave type: [select] · Dates: [range]                  │
│ → Would accrue: X · Would deduct: Y · Approval chain: … · Violations: …   │
│ [Run simulation]                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Permission:** `hr.leave.policy.manage`

---

# Leave Accrual Management

**Route:** `/hr/settings/leave/accrual` · **Screen:** `SCR-HR-LEV-008`

### Accrual dashboard

| Widget | Content |
|--------|---------|
| Last accrual run | Date · status |
| Employees processed | Count |
| Errors | Count + link |
| Next scheduled run | Cron display |

### Sections

| Section | Content |
|---------|---------|
| **Accrual rules** | Linked to policies |
| **Accrual history** | Run log table |
| **Carry forward** | Year-end job status |
| **Adjustments** | Manual adjustment audit list |

**Automation:** `AUTO-HR-LEV-001` monthly · `AUTO-HR-LEV-002` annual carry forward

---

# Leave Encashment

**Route:** `/hr/leave/encashment` · **Screen:** `SCR-HR-LEV-009`

### Encashment list

| Column | Content |
|--------|---------|
| Request ID | |
| Employee | |
| Leave type | |
| Days requested | |
| Calculated amount | Preview |
| Status | |
| Payroll run link | When processed |

### Drawer sections

| Section | Content |
|---------|---------|
| **Calculation preview** | Days × daily rate formula annotation |
| **Payroll impact** | Component · period |
| **Approval workflow** | HR approval steps |
| **History** | Prior encashments |

**Workflow:** `hr.leave.encashment` per [HR_WORKFLOW_ARCHITECTURE.md](../HR_WORKFLOW_ARCHITECTURE.md)

---

# Holiday Calendar

**Route:** `/hr/settings/holidays` · **Screen:** `SCR-HR-LEV-010`

### Holiday types

| Type | Scope |
|------|-------|
| **National** | Country |
| **Company** | All branches |
| **Branch** | `branch_id` |
| **Department** | Optional |
| **Custom** | Ad-hoc |

### Views

| View | Use |
|------|-----|
| **Calendar** | Visual year planner |
| **Table** | Sortable list |
| **Timeline** | Chronological strip |

**Actions:** Create · Edit · Import CSV · Sync (future public holiday API)

---

# Leave Analytics

**Routes:** `/hr/reports/leave-taken` · `/hr/reports/leave-balance` · future `/hr/leave/analytics`

### Analysis dimensions

| Dimension | Charts |
|-----------|--------|
| **Leave trends** | Line — days taken over time |
| **Leave utilization** | % of entitlement used |
| **Department analysis** | Bar by dept |
| **Employee analysis** | Outlier table |
| **Leave type analysis** | Donut mix |
| **Approval efficiency** | Avg approval time trend |

### Visualizations

Line · Bar · Donut · Heatmap (dept × month) · Trend cards · Ranked tables

---

# Workforce Availability View

*Critical feature* — embedded in calendar overlay + dedicated panel on dashboard/manager view.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ WORKFORCE AVAILABILITY — Week of Jun 10, 2026                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ Employees available:     142 / 160 (89%)                                    │
│ Employees on leave:        18                                               │
│ Department capacity:       Engineering 72% ⚠                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ UPCOMING RISKS                                                                │
│ · Jun 15: Sales dept below 60% capacity                                     │
│ · Jun 20–22: 5 overlapping annual leaves in Backend                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ RESOURCE GAPS                                                                 │
│ · Suggest: deny 1 of 3 pending Jun 20 requests OR approve delegate coverage   │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Metric | Calculation (conceptual) |
|--------|--------------------------|
| **Available** | Active headcount − on leave − absent |
| **On leave** | Approved leave overlapping date |
| **Dept capacity** | Available / total dept headcount |
| **Resource gaps** | Below policy threshold |

**Drill-down:** Click risk → filtered calendar · pending requests

---

# AI Leave Panel

**Surfaces:** Dashboard Zone F · `/hr/ai` · request drawer side panel

### Insights

| Insight | Example |
|---------|---------|
| **Leave patterns** | Friday+Monday clustering |
| **Leave abuse detection** | Sick leave before holidays |
| **Department leave risks** | Capacity below threshold |
| **Compliance risks** | Expired carry-forward not used |

### Recommendations

| Type | Example |
|------|---------|
| **Policy adjustments** | Increase notice for peak season |
| **Approval recommendations** | "Approve with coverage plan" |
| **Workforce planning** | Stagger dept leave in August |
| **Coverage planning** | Suggest delegate from AI |

### Predictions (future)

| Prediction | Output |
|------------|--------|
| Future leave trends | Seasonal curve |
| Leave demand forecast | Expected days next month |
| Availability forecast | Capacity by week |
| Attrition signals | Leave pattern correlation |

**Governance:** AI suggests · human approves · audit logged

---

# Employee Self Service Experience

**Route:** `/ess/leave` · **Screen:** `SCR-ESS-LEV-001`

### My leave dashboard

| Widget | Content |
|--------|---------|
| Balance cards | Per leave type |
| Pending requests | Status list |
| Upcoming approved leave | Next 30d |
| Holiday calendar mini | |

### ESS actions

| Action | Route |
|--------|-------|
| **Apply leave** | `?create=1` |
| **Leave balance** | Same page section |
| **Leave history** | Table below |
| **Holiday calendar** | Expand |
| **Approval status** | Track pending |
| **AI suggestions** | Best dates to apply (advisory) |

**Permission:** `ess.leave.apply` · view own only

---

# Manager Experience

| Surface | Content |
|---------|---------|
| **Team leave calendar** | `/hr/leave/calendar?view=team` |
| **Pending approvals** | Dashboard Zone D + mobile |
| **Availability planning** | Workforce availability panel |
| **Coverage planning** | Delegate suggestions on approve |
| **Department analytics** | Embedded charts scoped to dept |

**Scope:** `department_subtree` or direct reports per role

---

# Notification Experience

| Notification | Trigger | Recipient |
|--------------|---------|-----------|
| **Leave applied** | `hr.leave.requested` | Approver |
| **Leave approved** | `hr.leave.approved` | Employee |
| **Leave rejected** | `hr.leave.rejected` | Employee |
| **Leave escalated** | SLA breach | Next approver |
| **Balance warning** | `hr.leave.balance_low` | Employee |
| **Holiday notification** | `AUTO-HR-LEV-006` | All staff |

**UI:** Bell · dashboard Zone E · ESS notifications

---

# Activity Timeline

Per [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md).

| Category | Events |
|----------|--------|
| **Leave requests** | Submit · edit · cancel |
| **Approvals** | Approve · reject · escalate |
| **Policy changes** | Policy version activated |
| **Balance adjustments** | Manual adjust with reason |
| **Encashments** | Request · approve · payroll link |
| **AI activities** | Insight generated · recommendation dismissed |

**Surfaces:**
- Leave request drawer → Activity tab
- Employee profile → Timeline (leave filter)
- Global Activity Drawer on list rows

---

# Permission Experience

### UI visibility matrix

| Surface | Employee | Manager | HR Exec | HR Mgr | Payroll | Admin |
|---------|----------|---------|---------|--------|---------|-------|
| Dashboard | — | Team | ✓ | ✓ | View | ✓ |
| Request list | — | Team | ✓ | ✓ | View | ✓ |
| Apply (HR) | — | Team | ✓ | ✓ | — | ✓ |
| Approve | — | Team | ✓ | ✓ | — | ✓ |
| Calendar org | — | Team/dept | ✓ | ✓ | — | ✓ |
| Balances | Self ESS | Team | ✓ | ✓ | View | ✓ |
| Balance adjust | — | — | ✓ | ✓ | — | ✓ |
| Policies | — | — | — | ✓ | — | ✓ |
| Accrual admin | — | — | — | ✓ | — | ✓ |
| Encashment | Self | — | ✓ | ✓ | Approve | ✓ |
| Holidays | View ESS | View | ✓ | ✓ | — | ✓ |
| Analytics | — | Dept | ✓ | ✓ | View | ✓ |
| AI insights | — | — | ✓ | ✓ | — | ✓ |

### Key permission keys

`hr.leave.view` · `hr.leave.create` · `hr.leave.approve` · `hr.leave.cancel` · `hr.leave.policy.manage` · `hr.leave.balance.adjust` · `hr.leave.encash` · `ess.leave.apply`

**SoD:** Self-approval blocked on own leave requests

---

# Responsive Strategy

| Breakpoint | Request list | Calendar | Dashboard |
|------------|--------------|----------|-----------|
| **Desktop ≥1280** | Full grid | Full month + side panel | C+D side-by-side |
| **Tablet** | Scroll table | Week view default | Stacked |
| **Mobile** | Card list | Day/agenda view | KPI + approvals first |

| ESS mobile | Behavior |
|------------|----------|
| Apply leave | Full-screen wizard |
| Balance | Top cards |
| Calendar | Week strip |
| Approvals (manager) | Card stack + swipe actions (future) |

---

# AI First Experience

### AI leave summary

| Element | Location |
|---------|----------|
| **Org narrative** | Dashboard Zone F banner |
| **Dept risk count** | Zone A badge |
| **Apply-time hints** | Application system checks panel |

### AI leave risk panel

| Risk | Signal |
|------|--------|
| Abuse pattern | Sick leave adjacent to holidays |
| Capacity risk | Dept below threshold on dates |
| Compliance | Unused carry-forward expiring |
| Forecast spike | Predicted leave cluster |

### AI workforce availability insights

- Integrated into calendar conflict badges
- Manager dashboard strip
- Approval card "team impact" section (AI-enriched)

### Daily briefing

| Audience | Content | Time |
|----------|---------|------|
| HR Manager | Pending count · risks · holidays | 06:00 |
| Dept Manager | Team out today · pending approvals | 06:00 |

**Rule:** No auto-approval · No auto-balance deduction

---

# Global Quick Actions

| ID | Action | Route | Permission |
|----|--------|-------|------------|
| QUICK-LEV-001 | Apply leave | `?create=1` | `hr.leave.create` / `ess.leave.apply` |
| QUICK-LEV-002 | Approve leave | Pending queue | `hr.leave.approve` |
| QUICK-LEV-003 | View calendar | `/hr/leave/calendar` | `hr.leave.view` |
| QUICK-LEV-004 | Adjust balance | Balances adjust modal | `hr.leave.balance.adjust` |
| QUICK-LEV-005 | Encashment | `/hr/leave/encashment?create=1` | `hr.leave.encash` |
| QUICK-LEV-006 | Generate report | `/hr/reports/leave-balance` | `hr.report.leave.view` |

---

# Cross-Reference Index

| Document | Use |
|----------|-----|
| [HR_WORKFLOW_ARCHITECTURE.md](../HR_WORKFLOW_ARCHITECTURE.md) | Leave · accrual · encashment workflows |
| [HR_AUTOMATION_ENGINE_ARCHITECTURE.md](../HR_AUTOMATION_ENGINE_ARCHITECTURE.md) | `AUTO-HR-LEV-*` |
| [uiux/ATTENDANCE_UI_ARCHITECTURE.md](./ATTENDANCE_UI_ARCHITECTURE.md) | Attendance sync on approve |
| [uiux/HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) | Zone framework |
| [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../HR_FIGMA_WIREFRAME_BLUEPRINT.md) | Leave wireframes |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll — Leave |
| **Owner** | Product / Design |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Screens defined** | 10 + ESS |
| **Primary operational screen** | SCR-HR-LEV-002 |

---

**AgainERP Leave UI Architecture** — workforce planning and compliance foundation for wireframes, operations, analytics, and AI leave experience.
