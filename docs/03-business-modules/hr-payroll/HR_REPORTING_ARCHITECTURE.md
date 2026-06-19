# HR & Payroll — Reporting Architecture

## Purpose
HR & Payroll module architecture — scope, features, data ownership, and integration boundaries.

## When To Read
Read this file only if working on HR & Payroll architecture, features, or module boundaries.

## Related Files
- [Dependencies](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next
- [Architecture](HR_PAYROLL_MASTER_ARCHITECTURE.md)

---

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll (unified enterprise suite)  
> **Document Type:** Reporting, Analytics & BI Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md) · [HR_DATABASE_ARCHITECTURE.md](./HR_DATABASE_ARCHITECTURE.md) · [HR_DASHBOARD_ARCHITECTURE.md](./HR_DASHBOARD_ARCHITECTURE.md) · [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md) · [HR_SCREEN_INVENTORY.md](./HR_SCREEN_INVENTORY.md)  
> **Governance:** [reports-ui.md](../../04-uiux/standards/reports-ui.md) · [ENTERPRISE_UI_ARCHITECTURE.md](../../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md) · [modules/ecommerce/reports/ARCHITECTURE.md](../ecommerce/reports/ARCHITECTURE.md) · [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md)


## When To Read
Read this file only if working on HR & Payroll architecture, features, or module boundaries.

## Related Files
- [Dependencies](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next
- [Architecture](HR_PAYROLL_MASTER_ARCHITECTURE.md)

---

**No UI pixels. No application code.**  
Defines **operational, management, executive, compliance, analytical, and AI-ready reporting** for AgainERP HR & Payroll. Designed as the **first full-domain reference implementation** for the future **AgainERP Global Reporting Engine**.

---

## Executive Summary

| Principle | Rule |
|-----------|------|
| **Single reporting pipeline** | OLTP → aggregates → report queries → export / schedule |
| **Dashboard ≠ Report** | Dashboards snapshot; reports are auditable, exportable, schedulable |
| **Global engine ready** | HR report definitions register into `core_report_catalog` (future) |
| **Permission layered** | View · Export · Schedule · Executive · Payroll-sensitive |
| **Scope enforced** | `tenant_id` → `company_id` → `branch_id` → `department_id` → `self` |
| **Compliance first** | Statutory packs, audit trails, immutable locked payroll facts |
| **AI advisory** | Predictive reports read-only; never auto-post payroll |

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FUTURE: AgainERP Global Reporting Engine                  │
│  core_report_catalog · core_report_runs · core_report_schedules · exports   │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │ module adapters
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
   HR & Payroll Reports        Ecommerce Reports           Accounting Reports
   (this document)             (reference pattern)           (future)
        │
        ▼
 hr_* / payroll_* OLTP → hr_analytics_* / payroll_analytics_* → Report API
```

**API bases (conceptual):** `/api/v1/hr/reports/` · `/api/v1/payroll/reports/` · `/api/v1/ess/reports/`  
**UI routes:** `/hr/reports/{slug}` · `/payroll/reports/{slug}` · `/ess/reports/{slug}`

---

## Reporting Philosophy

### Core belief

> **Reports answer auditable questions with evidence — for operations, management, regulators, and boards.**

| Audience | Question type | Report class |
|----------|---------------|--------------|
| **Operations** | Who was absent today? What is pending? | Operational |
| **Management** | How is my department performing? | Management |
| **Executive** | What is workforce cost trend? | Executive |
| **Compliance** | Is muster roll statutory-ready? | Compliance |
| **Audit** | Who changed this salary? | Audit |
| **Analytics** | What patterns emerge over time? | Analytical |
| **AI (future)** | Who is at attrition risk? | AI / Predictive |

### Report vs dashboard vs list screen

| Artifact | Purpose | Time horizon | Export |
|----------|---------|--------------|--------|
| **List screen** | CRUD / workflow queue | Current state | Optional |
| **Dashboard** | Role snapshot + actions | Today / 30–90d | Light |
| **Report** | Evidence, analysis, compliance |任意 range | Full (PDF/XLSX/CSV) |

### Global engine contribution

HR & Payroll defines patterns the **Global Reporting Engine** will generalize:

| HR pattern | Global engine abstraction |
|------------|---------------------------|
| `RPT-HR-*` registry IDs | `core_report_catalog.report_key` |
| Domain permission keys | `core_report_catalog.permission` |
| `hr_analytics_*` facts | `core_analytics_facts` (module column) |
| Report run + export job | `core_report_runs` |
| Scheduled delivery | `core_report_schedules` |
| Cross-module workforce cost | `core_report_blends` (future) |

---

## Reporting Design Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **Aggregates first** | Standard reports query `hr_analytics_*` / `payroll_analytics_*` |
| 2 | **Drill-down to source** | Row click → list screen with filters (`?view=` pattern) |
| 3 | **Immutable payroll facts** | Locked run data only for compliance reports |
| 4 | **PII minimization** | Executive rollups aggregate; mask bank/tax IDs in exports |
| 5 | **Export audit** | Every export → Activity `report.exported` |
| 6 | **Async at scale** | >10k rows → background job + notification |
| 7 | **Filter parity** | UI filters = API params = scheduled job filters |
| 8 | **i18n ready** | Column labels via translation keys |
| 9 | **Compare periods** | MoM, QoQ, YoY on management + executive reports |
| 10 | **Module-off safe** | HR disabled → reports hidden, API 404 gracefully |

---

## Analytics Strategy

### Data layers

```text
Layer 1 — OLTP          hr_employees, hr_attendance, payroll_runs, …
Layer 2 — Domain events hr.attendance.finalized, payroll.run.locked, …
Layer 3 — Aggregates    hr_analytics_*, payroll_analytics_*
Layer 4 — Report query  Parameterized SQL / report service
Layer 5 — Presentation  Table · Chart · Pivot · Scorecard
```

### Planned aggregate domains

| Aggregate table | Grain | Refresh | Primary reports |
|-----------------|-------|---------|-----------------|
| `hr_analytics_workforce_daily` | company, branch, dept, day | Daily | Headcount, joiners, exits |
| `hr_analytics_attendance_daily` | company, branch, dept, day | Daily + on finalize | Muster, absenteeism |
| `hr_analytics_leave_monthly` | company, dept, leave_type, month | Monthly | Leave utilization |
| `hr_analytics_recruitment_funnel` | requisition, stage, week | Daily | Hiring funnel |
| `hr_analytics_performance_cycle` | cycle, dept, rating_band | On cycle close | Performance distribution |
| `hr_analytics_training_monthly` | program, dept, month | Monthly | Training completion |
| `payroll_analytics_cost_monthly` | company, branch, dept, component, month | On lock | Salary cost, tax |
| `payroll_analytics_variance` | period, component | On lock | Payroll variance |
| `hr_ai_workforce_metrics` | employee, signal_type | Daily batch | AI reports |

### Analytics vs operational reports

| Type | Data source | Latency | Example |
|------|-------------|---------|---------|
| **Operational** | OLTP + same-day aggregates | Minutes | Daily attendance register |
| **Analytical** | Fact tables + trends | Hours | Attendance heatmap |
| **Compliance** | Locked snapshots | On lock | Salary register |
| **AI** | ML read models | Daily | Attrition prediction |

---

## KPI Strategy

Reports and dashboards share a **unified KPI catalog** (see [HR_DASHBOARD_ARCHITECTURE.md](./HR_DASHBOARD_ARCHITECTURE.md)). Reports embed KPIs as:

- **Report header scorecards** (summary row)
- **Pivot measure columns**
- **Chart series**

**KPI ID format:** `kpi.{module}.{domain}.{metric}` — e.g. `kpi.hr.workforce.headcount.active`

---

## Executive Intelligence Strategy

Executive reporting delivers **strategic workforce intelligence** without operational noise.

| Capability | Audience | Delivery |
|------------|----------|----------|
| **CEO dashboard reports** | C-suite | `/hr/executive` drill + PDF board pack |
| **Board reports** | Directors | Quarterly scheduled PDF bundle |
| **Management summary** | VP / GM | Monthly email digest |
| **Workforce analytics** | HR Director | Interactive analytical reports |
| **Strategic HR** | CHRO | Headcount plan vs actual, cost per FTE |

**Rules:** No row-level salary on executive default templates; cost shown as aggregates; multi-company consolidation requires explicit role.

---

## AI Ready Reporting Strategy

Per [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md):

| Rule | Detail |
|------|--------|
| Data access | Service APIs + `hr_ai_*` read models only |
| Output | Ranked lists, risk scores, narratives — all exportable |
| Permissions | `ai.access` + underlying report permission |
| Human gate | No auto-approve, no auto-payroll adjustment |
| Evidence | AI report includes `model_version`, `as_of`, source KPIs |
| Audit | `activity_ai_actions` on "Apply recommendation" (future) |

---

# Reporting Framework

## Report categories

| Category | Code | Purpose | Typical format | Retention |
|----------|------|---------|----------------|-----------|
| **Operational** | `OPR` | Day-to-day HR/payroll ops | Table | 2 years |
| **Management** | `MGT` | Dept/branch decisions | Table + chart | 5 years |
| **Executive** | `EXE` | Strategic summaries | Scorecard + trend | 7 years |
| **Compliance** | `CMP` | Statutory / policy | PDF pack | Legal minimum |
| **Audit** | `AUD` | Change evidence | Immutable export | 7+ years |
| **Analytical** | `ANL` | Trends, patterns | Chart + pivot | 3 years |
| **AI** | `AI` | Predictive insights | Ranked table + narrative | 1 year |

## Report registry ID

```text
RPT-{MOD}-{DOMAIN}-{SEQ}

MOD:    HR | PAY | ESS | AI
DOMAIN: EMP | ORG | REC | ATT | LEV | PAY | OVT | LON | PRF | TRN | AST | DOC | APR | ACT | CMP | EXE

Examples:
  RPT-HR-EMP-001   Employee Master Report
  RPT-PAY-OPR-003  Payroll Lock Report
  RPT-AI-HR-001    Attrition Prediction Report
```

## Standard report definition schema

Every report in this document conforms to:

| Field | Description |
|-------|-------------|
| **Purpose** | Business question answered |
| **Target users** | Roles |
| **Filters** | Standard + report-specific parameters |
| **KPIs** | Embedded metrics (KPI catalog IDs) |
| **Visualization** | Primary viz type(s) |
| **Export options** | PDF, XLSX, CSV, print, email |
| **Permissions** | View + export + schedule keys |
| **Scheduling** | Recommended cadence |

### Global standard filters

| Parameter | Type | Notes |
|-----------|------|-------|
| `date_from`, `date_to` | date | Required on time-bound reports |
| `company_id` | FK | Session default |
| `branch_id` | FK[] | Multi-select |
| `department_id` | FK[] | Auto-scope for managers |
| `team_id` | FK | Optional |
| `employee_id` | FK | Single or multi |
| `employment_type` | enum | permanent, contract, … |
| `status` | enum | Domain-specific |
| `group_by` | enum | day, week, month, quarter, year, dept, branch |
| `compare_period` | enum | none, prior_period, yoy |
| `currency_code` | string | Payroll reports |

---

# Report Architecture (template reference)

```text
Report Page
├── Header (title, category badge, actions: Export, Schedule, Save filter)
├── Filter bar (global + report-specific)
├── KPI scorecard row (optional)
├── Visualization zone (chart / pivot / org chart)
├── Data table (sortable, paginated, drill-down)
└── Footer (generated at, row count, export audit id)
```

**Screen cross-ref:** Report screens use type `RPT` per [HR_SCREEN_INVENTORY.md](./HR_SCREEN_INVENTORY.md).  
**Route:** `/hr/reports/{slug}` · `/payroll/reports/{slug}`

---

# Employee Reports

| ID | Report | Purpose | Users | Key filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|-------------|------|-----|--------|------------|----------|
| RPT-HR-EMP-001 | Employee Master Report | Complete employee roster with org assignment | HR Mgr, HR Exec | company, branch, dept, status, type | headcount | Table | XLSX, CSV, PDF | `hr.report.employee.view` | Monthly |
| RPT-HR-EMP-002 | Employee Directory | Contact directory for internal use | HR, Managers | branch, dept | active count | Table | PDF, XLSX | `hr.report.employee.view` | — |
| RPT-HR-EMP-003 | Employee Joining Report | New hires in period | HR Mgr | date range, branch, dept | new_joiners | Table + trend | XLSX, PDF | `hr.report.employee.view` | Weekly |
| RPT-HR-EMP-004 | Employee Confirmation Report | Probation confirmations due/done | HR Mgr | date, status | pending_confirmations | Table | XLSX | `hr.report.employee.view` | Weekly |
| RPT-HR-EMP-005 | Employee Transfer Report | Inter-branch/dept transfers | HR Mgr, HR Exec | date, from/to branch | transfer_count | Table | XLSX, PDF | `hr.report.employee.view` | Monthly |
| RPT-HR-EMP-006 | Employee Promotion Report | Promotions in period | HR Mgr | date, dept | promotion_count | Table | XLSX | `hr.report.performance.view` | Quarterly |
| RPT-HR-EMP-007 | Employee Resignation Report | Resignations submitted | HR Mgr | date, dept | resignation_count | Table | XLSX | `hr.report.employee.view` | Monthly |
| RPT-HR-EMP-008 | Employee Exit Report | Completed exits with clearance status | HR Mgr, Payroll | date, exit_type | exit_count | Table | XLSX, PDF | `hr.report.employee.view` | Monthly |
| RPT-HR-EMP-009 | Employee Archive Report | Archived / inactive records | HR Exec | archive date | archived_count | Table | XLSX | `hr.report.employee.view` | Annual |
| RPT-HR-EMP-010 | Employee Demographics Report | Age, gender, tenure bands | HR Mgr, Executive | company, dept | diversity indices | Pivot + chart | PDF, XLSX | `hr.report.employee.view` | Quarterly |
| RPT-HR-EMP-011 | Employee Tenure Report | Tenure distribution | HR Mgr, Executive | company, dept | avg_tenure | Histogram | PDF, XLSX | `hr.report.employee.view` | Annual |
| RPT-HR-EMP-012 | Employee Skills Report | Skills matrix by employee | HR Mgr | dept, skill | skill_coverage | Table | XLSX | `hr.report.employee.view` | — |
| RPT-HR-EMP-013 | Employee Certification Report | Certifications held / expiring | HR Mgr, Training | expiry window | cert_count | Table | XLSX, PDF | `hr.report.training.view` | Monthly |
| RPT-HR-EMP-014 | Employee Asset Allocation Report | Assets per employee | HR Mgr, IT | category, status | assets_assigned | Table | XLSX | `hr.report.employee.view` | Monthly |

**Screen mapping:** `SCR-HR-RPT-001` (directory), `003` (new hires), `004` (terminations), `006` (demographics).

---

# Organization Reports

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-HR-ORG-001 | Company Wise Report | Headcount & cost by company | Group Admin, Executive | company[], date | headcount, payroll_cost | Table + bar | XLSX, PDF | `hr.report.employee.view` | Monthly |
| RPT-HR-ORG-002 | Branch Wise Report | Metrics by branch | HR Mgr, Branch Admin | branch[], date | headcount, attendance_rate | Pivot | XLSX | `hr.report.employee.view` | Monthly |
| RPT-HR-ORG-003 | Department Wise Report | Dept breakdown | HR Mgr, Dept Mgr | dept[], date | headcount, absenteeism | Pivot | XLSX | `hr.report.employee.view` | Monthly |
| RPT-HR-ORG-004 | Team Wise Report | Team-level roster & metrics | Team Lead, Dept Mgr | team, date | team_size, present_today | Table | XLSX | `hr.report.employee.view`† | Weekly |
| RPT-HR-ORG-005 | Designation Wise Report | Headcount by job grade/title | HR Mgr | designation[], date | headcount | Pivot | XLSX | `hr.report.employee.view` | Quarterly |
| RPT-HR-ORG-006 | Employment Type Report | Permanent vs contract mix | HR Mgr, Executive | type, date | type_mix_pct | Donut | PDF, XLSX | `hr.report.employee.view` | Quarterly |
| RPT-HR-ORG-007 | Organization Structure Report | Hierarchy tree with counts | HR Mgr, Executive | company, as_of_date | nodes, span | Org chart | PDF | `hr.report.employee.view` | On demand |
| RPT-HR-ORG-008 | Headcount Report | Official headcount snapshot | HR Mgr, Executive, Auditor | company, branch, dept, date | headcount, fte | Scorecard + table | PDF, XLSX | `hr.report.employee.view` | Monthly |

**Screen mapping:** `SCR-HR-RPT-002` (headcount), `SCR-HR-RPT-007` (org structure).  
† Dept Mgr scoped to `department_subtree`.

---

# Recruitment Reports

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-HR-REC-001 | Open Positions Report | Active requisitions | Recruit Mgr, HR Mgr | dept, location, status | open_positions | Table | XLSX | `hr.report.recruitment.view` | Weekly |
| RPT-HR-REC-002 | Hiring Funnel Report | Stage conversion | Recruit Mgr, HR Mgr | date, dept, source | funnel_conversion | Funnel chart | PDF, XLSX | `hr.report.recruitment.view` | Monthly |
| RPT-HR-REC-003 | Candidate Pipeline Report | Candidates by stage | Recruit Exec | stage, owner | pipeline_count | Table | XLSX | `hr.report.recruitment.view` | Weekly |
| RPT-HR-REC-004 | Interview Performance Report | Interviewer ratings, outcomes | Recruit Mgr | date, interviewer | pass_rate | Table + bar | XLSX | `hr.report.recruitment.view` | Monthly |
| RPT-HR-REC-005 | Offer Acceptance Report | Offers sent vs accepted | HR Mgr | date, dept | offer_accept_rate | Scorecard | PDF, XLSX | `hr.report.recruitment.view` | Monthly |
| RPT-HR-REC-006 | Time To Hire Report | Days requisition → join | HR Mgr, Executive | date, dept, role | avg_time_to_hire | Trend line | PDF, XLSX | `hr.report.recruitment.view` | Monthly |
| RPT-HR-REC-007 | Cost Per Hire Report | Recruitment spend / hire | HR Mgr, Finance | date, source | cost_per_hire | Table | XLSX | `hr.report.recruitment.view` | Quarterly |
| RPT-HR-REC-008 | Recruitment Source Report | Effectiveness by channel | Recruit Mgr | date, source | hires_by_source | Bar chart | XLSX | `hr.report.recruitment.view` | Monthly |
| RPT-HR-REC-009 | Recruitment Efficiency Report | Recruiter workload & SLA | Recruit Mgr | recruiter, date | sla_breach_count | Table | XLSX | `hr.report.recruitment.view` | Weekly |

**Screen:** `SCR-HR-REC-012` · Route `/hr/reports/recruitment`

---

# Attendance Reports

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-HR-ATT-001 | Daily Attendance Report | Day register | HR Mgr, Branch Admin | date, branch, dept | present, absent, late | Table | XLSX, PDF | `hr.report.attendance.view` | Daily |
| RPT-HR-ATT-002 | Monthly Attendance Report | Month summary per employee | HR Mgr | month, branch, dept | attendance_rate | Table | XLSX, PDF | `hr.report.attendance.view` | Monthly |
| RPT-HR-ATT-003 | Present Report | Present employees only | HR Mgr | date, dept | present_count | Table | XLSX | `hr.report.attendance.view` | Daily |
| RPT-HR-ATT-004 | Absent Report | Absences with reason | HR Mgr, Dept Mgr† | date, dept | absent_count | Table | XLSX | `hr.report.attendance.view` | Daily |
| RPT-HR-ATT-005 | Late Report | Late arrivals | HR Mgr | date, dept, threshold | late_count | Table | XLSX | `hr.report.attendance.view` | Weekly |
| RPT-HR-ATT-006 | Half Day Report | Half-day marks | HR Mgr | date, dept | half_day_count | Table | XLSX | `hr.report.attendance.view` | Monthly |
| RPT-HR-ATT-007 | Work From Home Report | WFH attendance | HR Mgr | date, dept | wfh_count | Table | XLSX | `hr.report.attendance.view` | Monthly |
| RPT-HR-ATT-008 | Outdoor Duty Report | OD / field duty | HR Mgr | date, dept | od_count | Table | XLSX | `hr.report.attendance.view` | Monthly |
| RPT-HR-ATT-009 | Biometric Device Report | Device sync health | HR Exec, IT | device, date | sync_failures | Table | XLSX | `hr.report.attendance.view` | Daily |
| RPT-HR-ATT-010 | Attendance Correction Report | Correction requests & outcomes | HR Mgr | date, status | pending_corrections | Table | XLSX | `hr.report.attendance.view` | Weekly |
| RPT-HR-ATT-011 | Attendance Compliance Report | Policy violations | HR Mgr, Compliance | month, dept | violation_count | Table + scorecard | PDF, XLSX | `hr.report.compliance.view` | Monthly |

**Screen mapping:** `SCR-HR-RPT-010`–`014` · `SCR-HR-RPT-011` = muster roll (compliance variant of monthly).

---

# Attendance Analytics

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-HR-ATT-ANL-001 | Attendance Trends | Company attendance over time | HR Mgr, Executive | date range, group_by | attendance_rate | Line chart | PDF, XLSX | `hr.report.attendance.view` | Monthly |
| RPT-HR-ATT-ANL-002 | Department Attendance Trends | Dept comparison | HR Mgr, Dept Mgr† | date, dept[] | dept_attendance_rate | Multi-line | PDF, XLSX | `hr.report.attendance.view` | Monthly |
| RPT-HR-ATT-ANL-003 | Late Trends | Lateness patterns | HR Mgr | date, dept | late_rate | Line + heatmap | XLSX | `hr.report.attendance.view` | Monthly |
| RPT-HR-ATT-ANL-004 | Absence Patterns | Recurring absence detection | HR Mgr | date, dept | absenteeism_rate | Heatmap | XLSX | `hr.report.attendance.view` | Monthly |
| RPT-HR-ATT-ANL-005 | Attendance Heatmaps | Day × hour presence | HR Mgr | month, branch | peak_presence | Heatmap | PNG, XLSX | `hr.report.attendance.view` | — |
| RPT-HR-ATT-ANL-006 | Shift Attendance Analysis | Attendance by shift | HR Mgr | shift, date | shift_coverage | Pivot | XLSX | `hr.report.attendance.view` | Weekly |

**Screen:** `SCR-HR-ATT-008` · `/hr/attendance/analytics`

---

# Shift Reports

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-HR-SHF-001 | Shift Assignment Report | Who is on which shift | HR Mgr | date, shift, dept | assigned_count | Table | XLSX | `hr.report.attendance.view` | Weekly |
| RPT-HR-SHF-002 | Shift Rotation Report | Rotation schedule compliance | HR Mgr | month, team | rotation_gaps | Table | XLSX | `hr.report.attendance.view` | Monthly |
| RPT-HR-SHF-003 | Night Shift Report | Night shift roster & premiums | HR Mgr, Payroll | month, branch | night_shift_hours | Table | XLSX | `hr.report.attendance.view` | Monthly |
| RPT-HR-SHF-004 | Shift Compliance Report | Under-staffing vs plan | HR Mgr | date, shift | compliance_pct | Scorecard | PDF | `hr.report.compliance.view` | Weekly |
| RPT-HR-SHF-005 | Shift Conflict Report | Overlapping assignments | HR Mgr | date range | conflict_count | Table | XLSX | `hr.report.attendance.view` | Daily |

---

# Leave Reports

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-HR-LEV-001 | Leave Requests Report | All requests in period | HR Mgr | date, type, status | request_count | Table | XLSX | `hr.report.leave.view` | Weekly |
| RPT-HR-LEV-002 | Leave Approval Report | Approved leaves | HR Mgr, Dept Mgr† | date, dept | approved_days | Table | XLSX | `hr.report.leave.view` | Monthly |
| RPT-HR-LEV-003 | Leave Rejection Report | Rejected with reason | HR Mgr | date, dept | rejected_count | Table | XLSX | `hr.report.leave.view` | Monthly |
| RPT-HR-LEV-004 | Leave Balance Report | Balances as of date | HR Mgr, Employee‡ | as_of, type | balance_days | Table | XLSX, PDF | `hr.report.leave.view` / `ess.*` | Monthly |
| RPT-HR-LEV-005 | Leave Utilization Report | Used vs entitled | HR Mgr, Executive | year, dept | utilization_pct | Pivot | PDF, XLSX | `hr.report.leave.view` | Quarterly |
| RPT-HR-LEV-006 | Leave Encashment Report | Encashment payouts | HR Mgr, Payroll | period | encash_amount | Table | XLSX, PDF | `hr.report.leave.view` | On payroll |
| RPT-HR-LEV-007 | Leave Carry Forward Report | CF balances | HR Mgr | year | cf_days | Table | XLSX | `hr.report.leave.view` | Annual |
| RPT-HR-LEV-008 | Holiday Impact Report | Leave adjacent to holidays | HR Mgr | year | bridge_leave_count | Table | XLSX | `hr.report.leave.view` | Annual |

**Screen mapping:** `SCR-HR-RPT-020`–`022`.

‡ ESS: own balance only via `/ess/reports/leave-balance`.

---

# Leave Analytics

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-HR-LEV-ANL-001 | Leave Trends | Org leave volume over time | HR Mgr | date range | leave_days_taken | Line | PDF, XLSX | `hr.report.leave.view` | Monthly |
| RPT-HR-LEV-ANL-002 | Department Leave Trends | By department | HR Mgr, Executive | date, dept | dept_leave_days | Multi-line | PDF, XLSX | `hr.report.leave.view` | Monthly |
| RPT-HR-LEV-ANL-003 | Leave Type Analysis | Mix by leave type | HR Mgr | year | type_distribution | Donut | PDF, XLSX | `hr.report.leave.view` | Quarterly |
| RPT-HR-LEV-ANL-004 | Leave Abuse Detection | Unusual patterns (future AI) | HR Mgr | date | risk_score | Ranked table | XLSX | `hr.report.leave.view` + `ai.access` | Monthly |
| RPT-HR-LEV-ANL-005 | Leave Forecasting | Projected absence (future AI) | HR Mgr, Executive | horizon | forecast_absence_days | Line + band | PDF | `ai.access` | Monthly |

---

# Payroll Reports

Payroll reporting is the **highest-sensitivity** domain. All compliance reports use **locked** `payroll_run` / `payroll_payslip` facts only.

### Payroll reporting principles

| Rule | Detail |
|------|--------|
| **Lock boundary** | Pre-lock = operational preview; post-lock = compliance truth |
| **Bank data** | Separate permission `payroll.bank_export` |
| **Tax IDs** | Masked in management reports; full in statutory with `payroll.report.statutory` |
| **Variance** | Compare run vs prior period / budget |
| **Accounting bridge** | Cost reports align with Accounting journal export events |

---

## Payroll Operational Reports

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-PAY-OPR-001 | Payroll Processing Report | Run status, employee inclusion, exceptions | Payroll Mgr | period, run_id, status | employees_in_run, exception_count | Table + status | XLSX, PDF | `payroll.report.view` | Per run |
| RPT-PAY-OPR-002 | Payroll Approval Report | Approval chain & timestamps | Payroll Mgr, Auditor | period, run_id | approval_tat | Timeline | PDF | `payroll.report.view` | Per run |
| RPT-PAY-OPR-003 | Payroll Lock Report | Lock audit — who/when | Payroll Mgr, Auditor | period | locked_at, locked_by | Table | PDF | `payroll.report.view` | Per lock |
| RPT-PAY-OPR-004 | Payslip Report | Payslip batch for period | Payroll Mgr | period, dept, employee | payslip_count, net_pay | Table | PDF (batch), XLSX | `payroll.report.view` | Per run |
| RPT-PAY-OPR-005 | Salary Structure Report | Active structures & components | Payroll Mgr, HR Mgr | company, grade | structure_count | Table | XLSX | `payroll.report.view` | Quarterly |
| RPT-PAY-OPR-006 | Salary Revision Report | Revisions effective in period | Payroll Mgr, HR Mgr | date, dept | revision_count, delta_cost | Table | XLSX | `payroll.report.view` | Monthly |
| RPT-PAY-OPR-007 | Bonus Report | Bonus accrual & payout | Payroll Mgr | period, type | bonus_total | Table | XLSX, PDF | `payroll.report.view` | Per run |
| RPT-PAY-OPR-008 | Commission Report | Commission calculations | Payroll Mgr | period, sales_team | commission_total | Table | XLSX | `payroll.report.view` | Per run |
| RPT-PAY-OPR-009 | Tax Report | Statutory tax deductions | Payroll Mgr, Finance | period, tax_type | tax_total | Table | XLSX, PDF | `payroll.report.view` + statutory | Per run |
| RPT-PAY-OPR-010 | Loan Deduction Report | Loan EMI deducted in run | Payroll Mgr | period, employee | loan_deduction_total | Table | XLSX | `payroll.report.view` | Per run |
| RPT-PAY-OPR-011 | Advance Recovery Report | Salary advance recovered | Payroll Mgr | period | advance_recovery_total | Table | XLSX | `payroll.report.view` | Per run |
| RPT-PAY-OPR-012 | Overtime Payroll Report | OT amounts in payroll | Payroll Mgr | period, dept | ot_pay_total | Table | XLSX | `payroll.report.view` | Per run |

**Screen mapping:** `SCR-PAY-RPT-001` (salary register), `002` (payslip summary), `005` (tax), `011` (advance recovery).

---

## Payroll Management Reports

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-PAY-MGT-001 | Department Salary Cost | Gross/net by department | HR Mgr, Payroll Mgr | period, dept | dept_payroll_cost | Pivot + bar | XLSX, PDF | `payroll.report.view` | Monthly |
| RPT-PAY-MGT-002 | Branch Salary Cost | Cost by branch | Payroll Mgr, Executive | period, branch | branch_payroll_cost | Pivot | XLSX, PDF | `payroll.report.view` | Monthly |
| RPT-PAY-MGT-003 | Company Salary Cost | Total company payroll | Executive, Finance | period, company | total_payroll_cost | Scorecard | PDF, XLSX | `payroll.report.view` | Monthly |
| RPT-PAY-MGT-004 | Salary Comparison | Employee vs grade median | HR Mgr, Payroll Mgr | period, grade | compa_ratio | Table | XLSX | `payroll.report.view` | Annual |
| RPT-PAY-MGT-005 | Payroll Variance Report | Period-over-period component variance | Payroll Mgr, Finance | period, compare | variance_pct, variance_amt | Table + waterfall | XLSX, PDF | `payroll.report.view` | Per run |
| RPT-PAY-MGT-006 | Payroll Adjustment Report | Manual adjustments in run | Payroll Mgr, Auditor | period, run_id | adjustment_total | Table | XLSX | `payroll.report.view` | Per run |
| RPT-PAY-MGT-007 | Compensation Analysis | Fixed vs variable mix | HR Director, Executive | period, company | fixed_pct, variable_pct | Stacked bar | PDF, XLSX | `payroll.report.view` | Quarterly |

**Screen mapping:** `SCR-PAY-RPT-003` (component-wise), `007` (cost-by-dept).

---

## Payroll Executive Reports

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-PAY-EXE-001 | Payroll Cost Trend | Multi-period cost trend | CEO, CFO, CHRO | 12–36 months | payroll_cost, cost_per_fte | Line chart | PDF | `payroll.report.view` + executive | Monthly |
| RPT-PAY-EXE-002 | Compensation Growth | YoY compensation growth | Executive | year | comp_growth_pct | Line | PDF | `payroll.report.view` | Quarterly |
| RPT-PAY-EXE-003 | Overtime Cost Trend | OT cost over time | Executive, HR Director | date range | ot_cost | Line | PDF, XLSX | `payroll.report.view` | Monthly |
| RPT-PAY-EXE-004 | Bonus Cost Trend | Bonus spend trend | Executive, Finance | date range | bonus_cost | Line | PDF | `payroll.report.view` | Quarterly |
| RPT-PAY-EXE-005 | Commission Cost Trend | Commission spend | Executive, Sales | date range | commission_cost | Line | PDF | `payroll.report.view` | Monthly |
| RPT-PAY-EXE-006 | Cost Center Analysis | Payroll by cost center | Finance, Executive | period, cost_center | cost_center_total | Pivot | XLSX, PDF | `payroll.report.view` | Monthly |
| RPT-PAY-EXE-007 | Workforce Cost Analysis | Total workforce cost incl. benefits | CFO, CHRO | period | workforce_cost, benefits_cost | Scorecard + trend | PDF | `payroll.report.view` | Quarterly |

---

## Payroll compliance pack (statutory)

| ID | Report | Purpose | Users | Export | Permission |
|----|--------|---------|-------|--------|------------|
| RPT-PAY-CMP-001 | Salary Register (statutory) | Official wage register | Payroll, Auditor | PDF, XLSX | `payroll.report.view` + `hr.report.compliance.view` |
| RPT-PAY-CMP-002 | Bank Transfer Sheet | Bank upload file + summary | Payroll Mgr | CSV, PDF | `payroll.bank_export` |
| RPT-PAY-CMP-003 | Tax Deduction Statement | Employee tax certificates | Payroll, Employee‡ | PDF | `payroll.report.view` / `ess.payslip.view` |
| RPT-PAY-CMP-004 | YTD Earnings Report | Year-to-date earnings | Payroll, Employee‡ | PDF, XLSX | `payroll.report.view` / `ess.payslip.view` |
| RPT-PAY-CMP-005 | Statutory Compliance Pack | Bundled period pack | Compliance | PDF zip | `hr.report.compliance.view` |

**Screen mapping:** `SCR-PAY-RPT-004`–`006`, `SCR-HR-RPT-040` (compliance pack).

---

# Overtime Reports

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-HR-OVT-001 | Overtime Requests | OT requests in period | HR Mgr, Dept Mgr† | date, status | ot_request_count | Table | XLSX | `hr.report.attendance.view` | Weekly |
| RPT-HR-OVT-002 | Overtime Approval Report | Approved OT hours | HR Mgr | date, dept | approved_ot_hours | Table | XLSX | `hr.report.attendance.view` | Monthly |
| RPT-HR-OVT-003 | Overtime Cost Report | OT cost (HR view) | HR Mgr, Payroll | period | ot_cost | Table | XLSX | `hr.report.attendance.view` | Monthly |
| RPT-HR-OVT-004 | Overtime Trend Report | OT hours/cost trend | HR Mgr, Executive | date range | ot_hours | Line | PDF, XLSX | `hr.report.attendance.view` | Monthly |
| RPT-HR-OVT-005 | Department Overtime Report | OT by department | HR Mgr, Dept Mgr† | period, dept | dept_ot_hours | Pivot | XLSX | `hr.report.attendance.view` | Monthly |

**Screen:** `SCR-HR-OVT-006` · `/hr/reports/overtime`

---

# Loan & Advance Reports

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-PAY-LON-001 | Loan Summary | Active loans portfolio | Payroll Mgr, HR Mgr | status, type | outstanding_principal | Table | XLSX | `payroll.report.view` | Monthly |
| RPT-PAY-LON-002 | Loan Installment Report | Schedule vs paid | Payroll Mgr | period, employee | installments_due | Table | XLSX | `payroll.report.view` | Monthly |
| RPT-PAY-LON-003 | Loan Recovery Report | Recovered in period | Payroll Mgr | period | recovery_total | Table | XLSX | `payroll.report.view` | Per run |
| RPT-PAY-ADV-001 | Advance Salary Report | Advances issued | Payroll Mgr | date range | advance_total | Table | XLSX | `payroll.report.view` | Monthly |
| RPT-PAY-ADV-002 | Advance Recovery Report | Recoveries in payroll | Payroll Mgr | period | recovery_total | Table | XLSX | `payroll.report.view` | Per run |

**Screen mapping:** `SCR-PAY-RPT-010`, `SCR-PAY-RPT-011`.

---

# Performance Reports

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-HR-PRF-001 | Goals Report | Goals by employee/cycle | HR Mgr, Dept Mgr† | cycle, dept, status | goals_assigned | Table | XLSX | `hr.report.performance.view` | Per cycle |
| RPT-HR-PRF-002 | KPI Achievement Report | KPI attainment | HR Mgr | cycle, dept | kpi_achievement_pct | Pivot | XLSX | `hr.report.performance.view` | Per cycle |
| RPT-HR-PRF-003 | KRA Report | KRA completion | HR Mgr, Dept Mgr† | cycle | kra_completion_pct | Table | XLSX | `hr.report.performance.view` | Per cycle |
| RPT-HR-PRF-004 | Performance Review Report | Review ratings & status | HR Mgr, Dept Mgr† | cycle, dept | avg_rating, pending_reviews | Table | XLSX, PDF | `hr.report.performance.view` | Per cycle |
| RPT-HR-PRF-005 | Promotion Recommendation Report | Recommended promotions | HR Mgr, Executive | cycle | promotion_rec_count | Table | PDF | `hr.report.performance.view` | Per cycle |
| RPT-HR-PRF-006 | Training Recommendation Report | Training linked to performance | HR Mgr | cycle | training_rec_count | Table | XLSX | `hr.report.performance.view` | Per cycle |

**Screen:** `SCR-HR-RPT-030`, `SCR-HR-PRF-010` (analytics).

---

# Performance Analytics

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-HR-PRF-ANL-001 | Department Performance | Avg rating by dept | HR Mgr, Executive | cycle, dept | dept_avg_rating | Bar | PDF, XLSX | `hr.report.performance.view` | Per cycle |
| RPT-HR-PRF-ANL-002 | Performance Distribution | Rating bell curve | HR Mgr | cycle | distribution_bins | Histogram | PDF | `hr.report.performance.view` | Per cycle |
| RPT-HR-PRF-ANL-003 | Goal Achievement Trends | Achievement over cycles | HR Mgr | cycles[] | goal_achievement_pct | Line | XLSX | `hr.report.performance.view` | Annual |
| RPT-HR-PRF-ANL-004 | Promotion Readiness | Readiness index | HR Mgr, Executive | cycle | readiness_score | Ranked table | XLSX | `hr.report.performance.view` | Per cycle |
| RPT-HR-PRF-ANL-005 | High Performer Analysis | Top performers | HR Mgr | cycle, threshold | top_performer_count | Table | XLSX | `hr.report.performance.view` | Per cycle |
| RPT-HR-PRF-ANL-006 | Low Performer Analysis | PIP / improvement flags | HR Mgr | cycle | low_performer_count | Table | XLSX | `hr.report.performance.view` | Per cycle |

---

# Training Reports

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-HR-TRN-001 | Training Programs | Program catalog & status | HR Mgr, Trainer | status, category | program_count | Table | XLSX | `hr.report.training.view` | Quarterly |
| RPT-HR-TRN-002 | Training Attendance | Session attendance | HR Mgr, Trainer | date, program | attendance_pct | Table | XLSX | `hr.report.training.view` | Per session |
| RPT-HR-TRN-003 | Training Completion | Completions by employee | HR Mgr | period, program | completion_rate | Table | XLSX, PDF | `hr.report.training.view` | Monthly |
| RPT-HR-TRN-004 | Training Certificates | Issued certificates | HR Mgr | period | cert_count | Table | PDF | `hr.report.training.view` | Monthly |
| RPT-HR-TRN-005 | Training Cost Analysis | Cost per program/employee | HR Mgr, Finance | period | training_cost | Pivot | XLSX | `hr.report.training.view` | Quarterly |
| RPT-HR-TRN-006 | Training Effectiveness | Post-training eval scores | HR Mgr | program | effectiveness_score | Bar | PDF, XLSX | `hr.report.training.view` | Per program |

**Screen:** `SCR-HR-RPT-031`, `SCR-HR-TRN-008` (analytics).

---

# Training Analytics

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-HR-TRN-ANL-001 | Skill Gap Analysis | Skills vs role requirements | HR Mgr | dept, role | gap_score | Heatmap | XLSX | `hr.report.training.view` + `ai.access` | Quarterly |
| RPT-HR-TRN-ANL-002 | Training Impact Analysis | Performance delta post-training | HR Mgr, Executive | program | impact_score | Line | PDF | `hr.report.training.view` | Annual |
| RPT-HR-TRN-ANL-003 | Department Training Analysis | Participation by dept | HR Mgr | period, dept | participation_pct | Bar | XLSX | `hr.report.training.view` | Quarterly |
| RPT-HR-TRN-ANL-004 | Certification Analysis | Cert coverage & expiry | HR Mgr | category | cert_coverage_pct | Donut | PDF, XLSX | `hr.report.training.view` | Monthly |

---

# Asset Reports

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-HR-AST-001 | Asset Allocation Report | Assets by location/dept | HR Mgr, IT | category, status | allocated_count | Table | XLSX | `hr.report.employee.view` | Monthly |
| RPT-HR-AST-002 | Asset Assignment Report | Employee assignments | HR Mgr, IT | employee, category | assigned_count | Table | XLSX | `hr.report.employee.view` | Monthly |
| RPT-HR-AST-003 | Asset Return Report | Returns in period | HR Mgr, IT | date range | returned_count | Table | XLSX | `hr.report.employee.view` | Monthly |
| RPT-HR-AST-004 | Asset Damage Report | Damaged / write-off | HR Mgr, IT | date, category | damage_count | Table | XLSX | `hr.report.employee.view` | Quarterly |
| RPT-HR-AST-005 | Asset Utilization Report | Utilization rate | HR Mgr, Finance | category | utilization_pct | Bar | XLSX | `hr.report.employee.view` | Quarterly |
| RPT-HR-AST-006 | Asset Lifecycle Report | Age & depreciation stage | Finance, IT | category | avg_asset_age | Table | XLSX | `hr.report.employee.view` | Annual |
| RPT-HR-AST-007 | Warranty Expiry Report | Warranties expiring | IT, HR Mgr | days_ahead | expiring_count | Table | XLSX, PDF | `hr.report.employee.view` | Monthly |

**Screen:** `SCR-HR-RPT-032` (asset custody).

---

# Document Reports

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-HR-DOC-001 | Document Status Report | Verification status | HR Mgr | type, status | verified_pct | Table | XLSX | `hr.document.view` | Monthly |
| RPT-HR-DOC-002 | Document Expiry Report | Expiring documents | HR Mgr | days_ahead | expiring_count | Table | XLSX, PDF | `hr.document.view` | Weekly |
| RPT-HR-DOC-003 | Document Renewal Report | Renewals completed | HR Mgr | period | renewed_count | Table | XLSX | `hr.document.view` | Monthly |
| RPT-HR-DOC-004 | Compliance Document Report | Mandatory doc compliance | Compliance, HR Mgr | type | compliance_pct | Scorecard | PDF | `hr.report.compliance.view` | Monthly |

---

# Approval Reports

Uses Core Approval Engine data — HR module provides filters.

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-HR-APR-001 | Pending Approvals | Open approval tasks | Managers, HR | module, type, age | pending_count | Table | XLSX | `core.approval.view` | Daily |
| RPT-HR-APR-002 | Approval Turnaround Time | Avg time to approve | HR Mgr | date, type | avg_tat_hours | Table + line | XLSX, PDF | `core.approval.analytics` | Monthly |
| RPT-HR-APR-003 | Approval Efficiency | SLA met % | HR Mgr | date, type | sla_met_pct | Scorecard | PDF | `core.approval.analytics` | Monthly |
| RPT-HR-APR-004 | Escalation Report | Escalated approvals | HR Mgr | date | escalated_count | Table | XLSX | `core.approval.view` | Weekly |
| RPT-HR-APR-005 | Rejected Requests | Rejections with reason | HR Mgr | date, type | rejected_count | Table | XLSX | `core.approval.view` | Monthly |

---

# Activity Log Reports

Per [HR_ACTIVITY_LOG_ARCHITECTURE.md](./HR_ACTIVITY_LOG_ARCHITECTURE.md).

| ID | Report | Purpose | Users | Filters | KPIs | Viz | Export | Permission | Schedule |
|----|--------|---------|-------|---------|------|-----|--------|------------|----------|
| RPT-HR-ACT-001 | Activity Summary | Event counts by type | HR Mgr | date, module | event_count | Pivot | XLSX | `hr.activity.view` | Monthly |
| RPT-HR-ACT-002 | User Activity Report | Actions by user | HR Exec, Auditor | user, date | actions_per_user | Table | XLSX | `hr.activity.view` | Monthly |
| RPT-HR-ACT-003 | Department Activity Report | Activity by dept | HR Mgr | dept, date | dept_event_count | Bar | XLSX | `hr.activity.view` | Monthly |
| RPT-HR-ACT-004 | Audit Trail Report | Full entity change log | Auditor | entity, date | change_count | Table | XLSX, PDF | `hr.audit.export` | On demand |
| RPT-HR-ACT-005 | Change History Report | Field-level history | HR Mgr, Auditor | entity_id | fields_changed | Timeline | PDF | `hr.audit.export` | On demand |
| RPT-HR-ACT-006 | Compliance Activity Report | Compliance-tagged events | Compliance | date, tag | compliance_events | Table | PDF | `hr.report.compliance.view` | Monthly |

**Screen:** `SCR-HR-RPT-041`, `SCR-HR-ACT-003`.

---

# Compliance Reports

| ID | Report | Domain | Purpose | Permission | Schedule |
|----|--------|--------|---------|------------|----------|
| RPT-HR-CMP-001 | Attendance Compliance | Attendance | Muster roll, late policy | `hr.report.compliance.view` | Monthly |
| RPT-HR-CMP-002 | Payroll Compliance | Payroll | Statutory registers | `hr.report.compliance.view` | Per run |
| RPT-HR-CMP-003 | Leave Compliance | Leave | Encashment, statutory leave | `hr.report.compliance.view` | Annual |
| RPT-HR-CMP-004 | Document Compliance | Documents | Mandatory documents | `hr.report.compliance.view` | Monthly |
| RPT-HR-CMP-005 | Training Compliance | Training | Mandatory training completion | `hr.report.compliance.view` | Quarterly |
| RPT-HR-CMP-006 | Audit Compliance | Audit | Auditor pack bundle | `hr.audit.export` | On demand |

---

# Executive Reporting

| ID | Report | Purpose | Users | Delivery | Permission |
|----|--------|---------|-------|----------|------------|
| RPT-HR-EXE-001 | CEO Dashboard Report | Workforce snapshot for CEO | CEO | PDF from `/hr/executive` | `hr.report.employee.view` + executive role |
| RPT-HR-EXE-002 | Board Report | Quarterly board pack | Board | Scheduled PDF bundle | Executive + `hr.report.compliance.view` |
| RPT-HR-EXE-003 | Management Summary Report | Monthly HR summary | VP, GM | Email PDF | `hr.report.employee.view` |
| RPT-HR-EXE-004 | Workforce Analytics | Deep workforce trends | CHRO, HR Director | Interactive + export | `hr.report.employee.view` |
| RPT-HR-EXE-005 | Strategic HR Report | Plan vs actual headcount & cost | CHRO, CFO | PDF, XLSX | `hr.report.employee.view` + `payroll.report.view` |

**Composition:** Bundles `RPT-HR-ORG-008`, `RPT-PAY-EXE-001`, `RPT-HR-ATT-ANL-001`, `RPT-HR-REC-006`, `RPT-HR-PRF-ANL-002` with executive redaction profile.

---

# KPI Library

Unified catalog shared with [HR_DASHBOARD_ARCHITECTURE.md](./HR_DASHBOARD_ARCHITECTURE.md).

### Workforce KPIs

| KPI ID | Name | Formula (conceptual) | Domain |
|--------|------|----------------------|--------|
| `kpi.hr.workforce.headcount.total` | Headcount | COUNT active employees | Workforce |
| `kpi.hr.workforce.headcount.active` | Active employees | status = active | Workforce |
| `kpi.hr.workforce.joiners` | New joiners | hires in period | Workforce |
| `kpi.hr.workforce.exits` | Exits | terminations in period | Workforce |
| `kpi.hr.workforce.turnover_rate` | Turnover rate | exits / avg headcount × 100 | Workforce |
| `kpi.hr.workforce.tenure_avg` | Average tenure | AVG tenure months | Workforce |

### Attendance KPIs

| KPI ID | Name | Formula | Domain |
|--------|------|---------|--------|
| `kpi.hr.attendance.rate` | Attendance rate | present days / working days | Attendance |
| `kpi.hr.attendance.absenteeism_rate` | Absenteeism rate | absent days / working days | Attendance |
| `kpi.hr.attendance.late_rate` | Late rate | late days / present days | Attendance |
| `kpi.hr.attendance.ot_hours` | Overtime hours | SUM approved OT | Attendance |

### Leave KPIs

| KPI ID | Name | Formula | Domain |
|--------|------|---------|--------|
| `kpi.hr.leave.utilization` | Leave utilization | used / entitled | Leave |
| `kpi.hr.leave.balance_days` | Leave balance | SUM balance | Leave |
| `kpi.hr.leave.pending_requests` | Pending requests | COUNT pending | Leave |

### Payroll KPIs

| KPI ID | Name | Formula | Domain |
|--------|------|---------|--------|
| `kpi.payroll.cost.total` | Payroll cost | SUM net pay locked | Payroll |
| `kpi.payroll.cost.per_fte` | Cost per FTE | payroll cost / FTE | Payroll |
| `kpi.payroll.cost.ot` | Overtime cost | SUM OT component | Payroll |
| `kpi.payroll.cost.bonus` | Bonus cost | SUM bonus | Payroll |
| `kpi.payroll.variance_pct` | Payroll variance | (current − prior) / prior | Payroll |

### Talent KPIs

| KPI ID | Name | Formula | Domain |
|--------|------|---------|--------|
| `kpi.hr.training.completion_rate` | Training completion rate | completed / enrolled | Training |
| `kpi.hr.performance.avg_rating` | Performance score | AVG review rating | Performance |
| `kpi.hr.recruitment.time_to_hire` | Time to hire | AVG days req → join | Recruitment |
| `kpi.hr.recruitment.cost_per_hire` | Cost per hire | spend / hires | Recruitment |
| `kpi.hr.recruitment.hiring_efficiency` | Hiring efficiency | hires / open reqs | Recruitment |

---

# Visualization Framework

| Type | Code | Use case | HR examples |
|------|------|----------|-------------|
| **Table** | `TBL` | Line detail, exports | Daily attendance, salary register |
| **Pivot table** | `PVT` | Cross-dimensional analysis | Dept × month attendance |
| **Line chart** | `LIN` | Trends | Payroll cost trend |
| **Bar chart** | `BAR` | Comparisons | Dept headcount |
| **Donut / pie** | `DON` | Composition | Employment type mix |
| **Heatmap** | `HMP` | Patterns | Attendance heatmap, skill gap |
| **Scorecard** | `SCR` | Single KPI + target | Executive headcount |
| **Trend graph** | `TRD` | KPI + comparison band | Attrition trend |
| **Timeline** | `TML` | Sequential events | Approval chain |
| **Org chart** | `ORG` | Hierarchy | Organization structure |
| **Funnel** | `FNL` | Stage conversion | Hiring funnel |
| **Waterfall** | `WFL` | Variance breakdown | Payroll variance |

**Rule:** Every analytical report declares primary + optional secondary viz in registry metadata.

---

# Export Framework

| Format | Use | Rules |
|--------|-----|-------|
| **PDF** | Print-ready, board packs, statutory | Branded header, page numbers, generated timestamp |
| **Excel (XLSX)** | Analysis, finance | Column types preserved; optional formulas row |
| **CSV** | Raw data, bank files | UTF-8 BOM; streaming for large sets |
| **Print** | Browser print from PDF layout | Same redaction as PDF |
| **Email** | Scheduled delivery | Via Core Notification Engine |
| **Scheduled delivery** | Cron → generate → attach | See scheduling section |

### Export modes

| Mode | When | Behavior |
|------|------|----------|
| **Sync** | < 10k rows | Immediate download |
| **Async** | ≥ 10k rows | `core_report_runs` job → notification with media link |
| **Compliance seal** | Statutory PDF | Hash + `activity_report_exports` audit row |

### Export permissions

| Action | Permission |
|--------|------------|
| View report on screen | `hr.report.*.view` / `payroll.report.view` |
| Export | `hr.report.export` / `payroll.report.export` |
| Schedule | `hr.report.schedule` / `payroll.report.schedule` |

**Event:** `reports.export.completed` → Activity + Notification per global engine pattern.

---

# Report Scheduling

### Schedule registry (conceptual table: `core_report_schedules`)

| Field | Notes |
|-------|-------|
| `report_key` | e.g. `RPT-HR-ATT-001` |
| `cron_expression` | Standard cron |
| `recipients` | Users / roles / emails |
| `format` | pdf, xlsx, csv |
| `filters_json` | Frozen filter snapshot |
| `company_id` | Scope |

### Standard cadences

| Cadence | Cron example | Typical reports |
|---------|--------------|-----------------|
| **Daily** | `0 7 * * *` | Daily attendance, pending approvals, biometric sync |
| **Weekly** | `0 7 * * 1` | Joiners, OT requests, recruitment pipeline |
| **Monthly** | `0 6 1 * *` | Headcount, payroll cost, leave balance, compliance |
| **Quarterly** | `0 6 1 1,4,7,10 *` | Demographics, compensation analysis, board inputs |
| **Annual** | `0 6 1 1 *` | Tenure, carry-forward leave, asset lifecycle |
| **Custom** | User-defined | Per `core_report_schedules` |

**Delivery:** Core Notification Engine — attachment via Media Library; failed runs retry + alert Payroll/HR admin.

---

# Self Service Reporting

**Route namespace:** `/ess/reports/{slug}`  
**Permission base:** `ess.access` + domain self-scope

| Report | ESS route slug | Scope | Export |
|--------|----------------|-------|--------|
| My attendance | `my-attendance` | Self | PDF |
| My leave history | `my-leave` | Self | PDF |
| My payslips | `my-payslips` | Self | PDF (print) |
| My training | `my-training` | Self | PDF |
| My performance | `my-performance` | Self | PDF |
| My tax / YTD | `my-ytd` | Self | PDF |

**Rules:** Employee never sees colleague data; managers use full HR reports with `department_subtree` scope, not ESS routes.

---

# Permission Framework

### Permission keys (HR & Payroll reporting)

| Key | Description |
|-----|-------------|
| `hr.report.employee.view` | Employee & org reports |
| `hr.report.attendance.view` | Attendance & shift reports |
| `hr.report.leave.view` | Leave reports |
| `hr.report.recruitment.view` | Recruitment reports |
| `hr.report.performance.view` | Performance reports |
| `hr.report.training.view` | Training reports |
| `hr.report.compliance.view` | Compliance packs |
| `hr.report.export` | Export HR reports |
| `hr.report.schedule` | Schedule HR reports |
| `payroll.report.view` | All payroll reports |
| `payroll.report.export` | Export payroll reports |
| `payroll.report.schedule` | Schedule payroll reports |
| `payroll.report.statutory` | Full tax/ID unmasked |
| `payroll.bank_export` | Bank transfer sheet |
| `hr.audit.export` | Audit trail exports |
| `ai.access` | AI reports |
| `ess.payslip.view` | Self payslip reports |

### Access matrix (summary)

| Capability | Employee | Team Lead | Dept Mgr | HR Mgr | Payroll Mgr | Executive | Auditor |
|------------|----------|-----------|----------|--------|-------------|-----------|---------|
| View HR operational | ESS only | † | † | ✓ | Partial | Aggregated | — |
| View payroll | ESS payslip | — | — | Summary | ✓ | Aggregated | ✓ |
| Export | ESS PDF | † | † | ✓ | ✓ | PDF packs | ✓ |
| Schedule | — | — | — | ✓ | ✓ | ✓ | — |
| Executive reports | — | — | — | — | — | ✓ | — |
| Compliance / audit | — | — | — | ✓ | ✓ | — | ✓ |

† Scoped to team / department subtree.

### Record rules

| Rule | Application |
|------|-------------|
| `company_scope` | All reports |
| `branch_scope` | Branch Admin default filter |
| `department_subtree` | Dept Mgr, Team Lead |
| `self_only` | ESS |
| `redacted_executive` | Strip PII, show aggregates |

---

# AI Ready Reporting

| ID | Report | Purpose | Model input | Permission | Phase |
|----|--------|---------|-------------|------------|-------|
| RPT-AI-HR-001 | Attrition Prediction Report | Flight risk ranking | tenure, attendance, leave, performance | `ai.access` + `hr.report.employee.view` | P2 |
| RPT-AI-HR-002 | Promotion Readiness Report | Promotion candidates | performance, tenure, skills | `ai.access` + `hr.report.performance.view` | P2 |
| RPT-AI-HR-003 | Attendance Risk Report | Chronic absence risk | attendance patterns | `ai.access` + `hr.report.attendance.view` | P2 |
| RPT-AI-PAY-001 | Payroll Anomaly Report | Unusual payroll lines | component z-scores | `ai.access` + `payroll.report.view` | P2 |
| RPT-AI-HR-004 | Leave Abuse Detection Report | Pattern abuse | leave clustering | `ai.access` + `hr.report.leave.view` | P3 |
| RPT-AI-HR-005 | Training Recommendation Report | Recommended courses | skill gap | `ai.access` + `hr.report.training.view` | P2 |
| RPT-AI-HR-006 | Workforce Forecasting Report | Headcount forecast | hiring, attrition, growth | `ai.access` + executive | P3 |

**Screen:** `SCR-AI-RPT-001` · `/hr/reports/ai-attrition`

**AI report footer (mandatory):** model version · as_of · disclaimer · link to evidence KPIs.

---

# Cross Module Reporting

HR reporting architecture registers **blend definitions** for the future Global Reporting Engine — cross-module reports via Service APIs and shared dimensions (no cross-module DB joins).

```text
                    ┌─────────────────────┐
                    │  core_report_blend  │
                    │  (future)           │
                    └──────────┬──────────┘
                               │
     ┌────────────┬────────────┼────────────┬────────────┐
     ▼            ▼            ▼            ▼            ▼
   HR/Payroll   Accounting    CRM/Sales   Inventory   Projects
```

| Blend ID | Report | HR source | External module | Integration |
|----------|--------|-----------|-----------------|-------------|
| `BLD-HR-ACC-001` | Workforce cost vs GL | `payroll_analytics_cost_monthly` | Accounting journals | Event `payroll.journal.posted` |
| `BLD-HR-CRM-001` | Sales commission vs payroll | `payroll_commissions` | CRM deals / targets | API |
| `BLD-HR-INV-001` | Employee asset vs inventory | `hr_assets` | Inventory stock | API |
| `BLD-HR-PUR-001` | Recruitment vendor spend | Recruitment cost | Purchase invoices | API |
| `BLD-HR-MFG-001` | Production OT vs output | OT hours | Manufacturing work orders | API |
| `BLD-HR-PRJ-001` | Project labor cost | Timesheets / cost center | Projects timesheets | API |
| `BLD-HR-HLP-001` | HR ticket SLA | — | Helpdesk tickets | API |
| `BLD-HR-POS-001` | Retail staff hours vs sales | Attendance | POS sales | API |
| `BLD-HR-ECM-001` | Ecommerce support staffing | Headcount plan | Ecommerce orders | Analytics API |

**Rule:** Each blend declares `primary_module`, `secondary_module`, `join_keys` (conceptual: `employee_id`, `cost_center_id`, `date`), and `permission_union`.

---

# Global Reporting Engine — Registration Contract

When the platform **Global Reporting Engine** ships, HR registers all `RPT-*` entries:

| Registry field | HR example |
|----------------|------------|
| `report_key` | `RPT-HR-EMP-001` |
| `module` | `hr` / `payroll` |
| `category` | `OPR` / `MGT` / … |
| `title_i18n` | `hr.reports.employee_master.title` |
| `route_slug` | `employee-master` |
| `api_path` | `/api/v1/hr/reports/employee-master` |
| `permission_view` | `hr.report.employee.view` |
| `permission_export` | `hr.report.export` |
| `default_viz` | `TBL` |
| `kpi_ids[]` | `kpi.hr.workforce.headcount.total` |
| `aggregate_tables[]` | `hr_analytics_workforce_daily` |
| `supports_schedule` | true |
| `supports_compare` | true |
| `pii_level` | none / partial / full |

Ecommerce reports ([modules/ecommerce/reports/ARCHITECTURE.md](../ecommerce/reports/ARCHITECTURE.md)) follow the same contract — HR is the **second reference domain** after Ecommerce.

---

# API Architecture (conceptual)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/hr/reports` | Report catalog |
| GET | `/api/v1/hr/reports/{slug}` | Run report (JSON) |
| POST | `/api/v1/hr/reports/{slug}/export` | Start export |
| GET | `/api/v1/hr/reports/exports/{run_id}` | Export status / download |
| GET/POST | `/api/v1/hr/reports/schedules` | Schedule CRUD |
| GET | `/api/v1/payroll/reports/{slug}` | Payroll reports |
| GET | `/api/v1/ess/reports/{slug}` | Self-service reports |

**Auth:** Bearer + `X-Company-Id` · Query params = standard filters.

---

# System Events

| Event | Payload | Subscribers |
|-------|---------|-------------|
| `hr.report.exported` | `report_key`, `user_id`, `row_count` | Activity |
| `payroll.report.exported` | `report_key`, `period_id` | Activity, Audit |
| `reports.schedule.executed` | `schedule_id`, `report_key` | Activity, Notification |
| `reports.export.completed` | `run_id`, `media_id` | Notification |
| `reports.export.failed` | `run_id`, `error` | Notification, retry |
| `payroll.run.locked` | `period_id` | Analytics refresh, cache warm |

---

# Performance Requirements

| Requirement | Strategy |
|-------------|----------|
| Standard report load | < 3s via aggregates |
| Large export | Streaming CSV; async job |
| Report cache | Redis 15m TTL per filter hash |
| Compliance PDF | Pre-rendered templates |
| Cross-module blend | 60s query timeout max |
| Row limit (sync) | 10,000 default |

---

# Cross-Reference Index

| Document | Relationship |
|----------|--------------|
| [HR_DASHBOARD_ARCHITECTURE.md](./HR_DASHBOARD_ARCHITECTURE.md) | Shared KPI catalog; dashboard drill → report |
| [HR_SCREEN_INVENTORY.md](./HR_SCREEN_INVENTORY.md) | Report screen IDs |
| [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md) | Report permissions |
| [HR_DATABASE_ARCHITECTURE.md](./HR_DATABASE_ARCHITECTURE.md) | Source tables & aggregates |
| [HR_ACTIVITY_LOG_ARCHITECTURE.md](./HR_ACTIVITY_LOG_ARCHITECTURE.md) | Audit reports |
| [HR_NOTIFICATION_ARCHITECTURE.md](./HR_NOTIFICATION_ARCHITECTURE.md) | Scheduled delivery |
| [reports-ui.md](../../04-uiux/standards/reports-ui.md) | Report page layout |
| [ecommerce/reports/ARCHITECTURE.md](../ecommerce/reports/ARCHITECTURE.md) | Global engine reference pattern |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll |
| **Owner** | Platform / HR domain |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Report count** | 150+ registered (`RPT-*`) |

---

**AgainERP HR & Payroll Reporting Architecture** — operational to executive, compliance to AI-ready, built to seed the Global Reporting Engine. No code.
