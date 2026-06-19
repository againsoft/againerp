# AgainERP — HR & Payroll Module UI Blueprint

> **Status:** Active — **HR & Payroll UI SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 22 — HR & Payroll UI Design  
> **Module:** HR & Payroll · Routes `/hr/*` · `/payroll/*` · ESS `/ess/*`  
> **Governance:** [FINAL_UI_ARCHITECTURE_LOCK.md](../../FINAL_UI_ARCHITECTURE_LOCK.md) — APPROVED  
> **Components:** [COMPONENT_UI_BLUEPRINT.md](../../04-uiux/standards/COMPONENT_UI_BLUEPRINT.md)  
> **Architecture:** [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md)

**Documentation only.** No mockups · No Figma · No code.

> **Note:** `Architecture.md` and `UI.md` are not present at the module root — this blueprint is the UI SSOT until `UI.md` is generated from it. Architecture authority: [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md).

---

## Purpose

Define the **complete HR & Payroll module UI** — navigation, pages, layouts, components, interactions, responsive rules, AI features, and approval workflows — using the approved AgainERP design system.

## Scope (from architecture)

| In scope | Out of scope |
|----------|--------------|
| Employees · org · attendance · leave · recruitment | User authentication (Core) |
| Performance · training · assets · documents | GL payroll journal detail (Finance posts) |
| Payroll structures · runs · payslips · loans · tax | Full statutory e-filing (future connectors) |
| ESS portal `/ess/*` | Helpdesk tickets |
| HR/Payroll reports · AI HR assistant | Cross-module DB joins in UI |

**Identity rule:** Person = Core **`contacts`** · Employment = **`hr_employees`** — no duplicate person table.

**Namespaces:** `hr_*` (workforce) · `payroll_*` (compensation)  
**API:** `/api/v1/hr/` · `/api/v1/payroll/` · `/api/v1/ess/`  
**Permissions:** `hr.*` · `payroll.*` · `ess.*`

---

## 1. Navigation

### 1.1 Global placement

| Property | Value |
|----------|-------|
| Sidebar group | **People & HR** (`nav.people-hr`) — top-level module |
| Module roots | `/hr` (workforce) · `/payroll` (compensation) |
| Module access | `hr.access` and/or `payroll.access` (plan-gated) |
| Quick actions | Check In · Apply Leave · New Employee (manifest) |

### 1.2 Module navigation (Level 2 — Zone B)

Step 22 approved nav:

| Tab | ID | Route | Visible |
|-----|-----|-------|---------|
| **Dashboard** | `WS-MODNAV-DASH` | `/hr/dashboard` | Always |
| **Workforce** | `WS-MODNAV-WF` | Employees · departments | Always |
| **Time** | `WS-MODNAV-TIME` | Attendance · leave | Always |
| **Talent** | `WS-MODNAV-TAL` | Recruitment · performance | Plan-gated |
| **Payroll** | `WS-MODNAV-PAY` | `/payroll` hub | `payroll.access` |
| **Reports** | `WS-MODNAV-RPT` | `/hr/reports` | Always |
| **Settings** | `WS-MODNAV-SET` | `/hr/settings` · `/payroll/settings` | Admin |

### 1.3 Operations menu (Level 3)

| Screen | Route | Permission | Entity |
|--------|-------|------------|--------|
| **Employees** | `/hr/employees` | `hr.employee.read` | `hr_employees` |
| **Departments** | `/hr/departments` | `hr.organization.read` | `hr_departments` |
| **Attendance** | `/hr/attendance` | `hr.attendance.read` | `hr_attendance` |
| **Leave** | `/hr/leave` | `hr.leave.read` | `hr_leave_requests` |
| **Recruitment** | `/hr/recruitment` | `hr.recruitment.read` | `hr_applicants` |
| **Performance** | `/hr/performance` | `hr.performance.read` | `hr_appraisals` |
| **Documents** | `/hr/documents` | `hr.documents.read` | Core attachments |
| **Payroll** | `/payroll/runs` | `payroll.run.read` | `payroll_runs` |
| **Payslips** | `/payroll/payslips` | `payroll.payslip.read` | `payroll_payslips` |
| **Structures** | `/payroll/structures` | `payroll.structure.read` | Salary structures |
| **Loans** | `/payroll/loans` | `payroll.loan.read` | `payroll_loans` |

> Extended routes (architecture): `/hr/shifts` · `/hr/overtime` · `/hr/training` · `/hr/assets` · `/ess/*` (employee self-service).

### 1.4 Command palette

| Command ID | Label | Route |
|------------|-------|-------|
| `hr.employees.create` | New Employee | `/hr/employees?create=1` |
| `hr.leave.create` | Apply Leave | `/hr/leave?create=1` |
| `hr.attendance.checkin` | Check In | `/hr/attendance?action=checkin` |
| `payroll.runs.create` | New Payroll Run | `/payroll/runs?create=1` |

---

## 2. Pages & Layouts

| Page | Layout ID | Route | Primary components |
|------|-----------|-------|-------------------|
| HR Dashboard | `LAYOUT-DASHBOARD` | `/hr/dashboard` | `WS-CONTENT-DASH` |
| Payroll Dashboard | `LAYOUT-DASHBOARD` | `/payroll/dashboard` | Payroll KPI widgets |
| Employee Directory | `LAYOUT-LIST` | `/hr/employees` | `DS-DATAGRID` / `DS-CARD-LIST` |
| Employee Profile | `LAYOUT-DETAILS` | `/hr/employees?view=` | Full page · multi-tab |
| Departments | `LAYOUT-TREE-LIST` | `/hr/departments` | Org tree + detail |
| Attendance | `LAYOUT-LIST` + calendar | `/hr/attendance` | Grid · `DS-CALENDAR` |
| Leave | `LAYOUT-LIST` | `/hr/leave` | Requests + balances |
| Recruitment | `LAYOUT-KANBAN` | `/hr/recruitment` | `DS-KANBAN-BOARD` |
| Performance | `LAYOUT-LIST` | `/hr/performance` | Goals · reviews |
| Documents hub | `LAYOUT-LIST` | `/hr/documents` | Policy + employee docs |
| Payroll runs | `LAYOUT-LIST` | `/payroll/runs` | Batch list |
| Payroll run detail | `LAYOUT-PAYROLL-RUN` | `/payroll/runs?view=` | Full page · exceptions |
| Payslips | `LAYOUT-LIST` | `/payroll/payslips` | Archive |
| Salary structures | `LAYOUT-SETTINGS` | `/payroll/structures` | Component editor |
| Reports | `LAYOUT-ANALYTICS` | `/hr/reports` · `/payroll/reports` | Export |
| Settings | `LAYOUT-SETTINGS` | `/hr/settings` · `/payroll/settings` | Policies |
| ESS portal | `LAYOUT-ESS` | `/ess/*` | Mobile-first shell |
| AI HR | `LAYOUT-AI-TOOL` | `/hr/ai-insights` | Review queue |

**CRUD rule (locked):** `?create=1` · `?view={id}` · `?edit={id}` — no `/new` or `/[id]/edit`.

**Layout notes:**

- **Employee profile** — full page default (360° tabs per architecture §17)
- **`LAYOUT-KANBAN`** — recruitment pipeline (ADR extension)
- **`LAYOUT-PAYROLL-RUN`** — run review with exception grid (ADR extension)

---

## 3. HR Dashboard UI

**Route:** `/hr/dashboard`

### 3.1 Sections

| Order | Section | Widget ID | Category | Col span |
|-------|---------|-----------|----------|----------|
| 1 | **Total Employees** | `hr.headcount` | `kpi` | 4 |
| 2 | **Attendance Summary** | `hr.attendance-summary` | `kpi` / `chart` | 4 |
| 3 | **Leave Summary** | `hr.leave-summary` | `kpi` | 4 |
| 4 | **Recruitment Pipeline** | `hr.recruitment-pipeline` | `chart` / `kpi` | 6 |
| 5 | **Payroll Status** | `hr.payroll-status` | `kpi` | 6 |
| 6 | **Performance Alerts** | `hr.performance-alerts` | `alert` | 4 |
| 7 | **AI HR Insights** | `hr.ai-insights` | `ai` | 12 |
| 8 | **Quick Actions** | `hr.quick-actions` | `quick_action` | 4 |

### 3.2 Quick actions

| Action | Route |
|--------|-------|
| New Employee | `/hr/employees?create=1` |
| Apply Leave | `/hr/leave?create=1` |
| Attendance Register | `/hr/attendance` |
| Pending Approvals | `/hr/approvals` |
| Payroll Run | `/payroll/runs?create=1` |

---

## 4. Employee Management UI

**Route:** `/hr/employees`

### 4.1 Employee directory

```text
Breadcrumb: HR › Employees
Header: Employees · [Import] [Export ▾] [+ New Employee]
Toolbar: [Search] [Department ▾] [Status ▾] [Location ▾]
Grid / Card list · Activity column · Drawer quick view
```

| Column | Notes |
|--------|-------|
| Photo · Name · Employee # | Primary link |
| Department · Manager | |
| Branch · Location | |
| Status | `DS-BADGE-STATUS` — active · probation · on leave · terminated |
| Join date | |

Filters: department tree · status · branch · job position.

### 4.2 Employee profile (full page)

**Route:** `/hr/employees?view={id}`

| Tab | Content |
|-----|---------|
| **Personal / Profile** | Core contact read-through · photo · employment header |
| **Employment** | Dept · manager · grade · dates · cost center |
| **Documents** | `DS-ATTACHMENTS` — ID · contract · visa |
| **Attendance** | Embedded calendar / recent register |
| **Leave History** | Requests · balances |
| **Payroll History** | Payslip list (permission-gated) · structure link |
| **Performance History** | Goals · appraisals |
| **Assets** | Assigned items |
| **Activities** | `DS-ACTIVITY-FEED` · field-level change log |

Smart buttons: Leave balance · Attendance today · Payslips · Manager · Approvals pending.

**Sensitive fields** (bank · tax ID): require `hr.sensitive.view`.

---

## 5. Departments UI

**Route:** `/hr/departments` · **`LAYOUT-TREE-LIST`**

| Feature | UI |
|---------|-----|
| Department tree | Parent/child · manager · headcount |
| Org chart view | Optional visual (desktop) |
| Department detail | Drawer — manager · cost center · employees list |
| Job positions | Linked `hr_job_positions` tab |

Actions: New department · Assign manager · Move employees (transfer workflow).

---

## 6. Attendance UI

**Route:** `/hr/attendance`

### 6.1 Features

| Feature | Component / surface |
|---------|---------------------|
| **Check In / Check Out** | Primary actions · ESS mobile · kiosk mode |
| **Attendance Calendar** | `DS-CALENDAR` — month view per employee/team |
| **Daily register** | `DS-DATAGRID` — present · absent · late · leave |
| **Late Reports** | Filter status=`late` · export |
| **Overtime Reports** | Link to `/hr/overtime` |
| **Attendance Corrections** | Request workflow · preserve original row |

### 6.2 Status display

| Status | Badge |
|--------|-------|
| present · wfh · outdoor | `--status-success` |
| late | `--status-warning` |
| absent | `--status-danger` |
| leave · holiday | `--status-info` |
| pending (missing punch) | `--status-pending` |

### 6.3 Correction flow

Employee/HR submits → manager approve → HR finalize → `hr.attendance.corrected` event.

List: correction queue with approval status.

---

## 7. Leave Management UI

**Route:** `/hr/leave`

### 7.1 Leave requests list

Columns: employee · type · dates · days · status · approver.

Tabs: **Requests** · **My team** (manager) · **All** (HR).

Create: `?create=1` — type · half-day · reason · attachment.

### 7.2 Approvals

Integrated approval bar · approve/reject with comment · multi-level workflow.

Pending approvals also in **`/hr/approvals`** hub (cross-type).

### 7.3 Leave balance

Per employee · per leave type · accrual · carry-forward · encashment indicator.

### 7.4 Holiday calendar

Company/branch holidays · `hr_holidays` · calendar overlay.

### 7.5 Team availability

Team calendar view — clash detection when submitting leave.

---

## 8. Recruitment UI

**Route:** `/hr/recruitment` · **`LAYOUT-KANBAN`**

### 8.1 Job positions

**Route:** `/hr/recruitment/positions` · `LAYOUT-LIST` — openings · department · status.

### 8.2 Applicant pipeline

| Stage (kanban) | Content |
|----------------|---------|
| Applied | New applicants |
| Screening | HR review |
| Interview | Scheduled interviews |
| Evaluation | Scorecards |
| Offer | Offer letter draft |
| Hired | Convert to employee |
| Rejected | Archived |

### 8.3 Applicant detail (`?view=`)

| Section | Content |
|---------|---------|
| Profile | Contact · resume · source |
| **Interview Pipeline** | Stages · interviewers · schedule |
| **Evaluation** | Ratings · notes |
| **Offers** | Offer terms · acceptance |
| **Hiring Status** | Convert to `hr_employees` action |

Components: `DS-KANBAN-BOARD` · drag between stages (permission-gated).

---

## 9. Payroll UI

**Route hub:** `/payroll`

### 9.1 Salary structure

**Route:** `/payroll/structures`

| Feature | UI |
|---------|-----|
| Structure list | By grade · department template |
| Component lines | Earning · deduction · employer contribution |
| Assign to employee | Link from employee compensation tab |

### 9.2 Payroll runs

**Route:** `/payroll/runs`

| Status | Display | Architecture stage |
|--------|---------|-------------------|
| **Draft** | `--status-draft` | Draft |
| **Calculated** | `--status-info` | Calculated |
| **Review** | `--status-warning` | Review |
| **Approved** | `--status-success` | Approved |
| **Locked** | `--status-success` | Locked |
| **Posted** | `--status-success` | Posted to Accounting |

Run detail (`LAYOUT-PAYROLL-RUN`): period · employee selection · exceptions report · approve · lock · post · bank export.

### 9.3 Payslips

**Route:** `/payroll/payslips`

List: employee · period · net pay · status · PDF download (post-lock).

Detail: line breakdown · YTD tax · immutable after lock.

ESS: employees download own payslips only.

### 9.4 Bonuses · deductions · loans · tax

| Area | Route |
|------|-------|
| **Bonuses** | Manual inputs on run or employee compensation |
| **Deductions** | Structure components + one-off on run |
| **Loans** | `/payroll/loans` — schedule · EMI recovery |
| **Tax** | `/payroll/settings/tax` — brackets · declarations |

### 9.5 Payroll history

Archived runs · payslip register · bank sheet export.

---

## 10. Performance UI

**Route:** `/hr/performance`

| Screen | Content |
|--------|---------|
| **Goals** | OKR list · progress · period |
| **KPI Tracking** | Metrics vs targets · charts |
| **Reviews** | Cycle status · self + manager |
| **Appraisals** | Rating forms · calibration view (HR) |
| **Promotion Recommendations** | Workflow output → salary revision link |

Tabs on employee profile mirror team/manager views.

---

## 11. Documents UI

**Route:** `/hr/documents`

| Feature | UI |
|---------|-----|
| Policy library | Company policies · acknowledgements |
| Employee documents | Per-employee attachments (from profile) |
| Expiry tracking | Visa · certification alerts |
| Upload | Core media · `DS-ATTACHMENTS` |

---

## 12. Reports UI

| Category | Route | Examples |
|----------|-------|----------|
| HR | `/hr/reports` | Headcount · turnover · attendance register |
| Payroll | `/payroll/reports` | Salary register · bank sheet · YTD tax |
| Leave | `/hr/reports/leave` | Balance · taken |
| Compliance | `/hr/reports/compliance` | Audit export |

`DS-EXPORT-MENU` · company/branch scope from workspace context.

---

## 13. AI HR UI

**Route:** `/hr/ai-insights` · Components **`DS-AI-*` only**

### 13.1 Features & placement

| Feature | Component | Placement |
|---------|-----------|-----------|
| **Candidate Ranking** | `DS-AI-SUGGESTIONS` | Recruitment kanban |
| **Employee Risk Detection** | `DS-AI-INSIGHTS` | Dashboard · employee profile |
| **Performance Insights** | `DS-AI-INSIGHTS` | Performance module |
| **Payroll Anomaly Detection** | `DS-AI-INSIGHTS` | Payroll run review |
| **Retention Suggestions** | `DS-AI-SUGGESTIONS` | Dashboard · manager view |
| **Training Recommendations** | `DS-AI-SUGGESTIONS` | Employee · skill gap |

### 13.2 AI rules

| Rule | Detail |
|------|--------|
| Service-only | Tools call HrService/PayrollService — no direct DB |
| Human in loop | Suggest → review → apply |
| No auto-pay | AI never locks or posts payroll |
| Permission inherit | Acts as current user |
| Audit | `ai_audit_logs` + Activity AI Actions tab |

---

## 14. Approval Workflows

Integrates Core **Approval Engine** and **Workflow Engine**.

### 14.1 Approval types

| Document / action | Workflow | Typical chain |
|-------------------|----------|---------------|
| **Leave request** | `hr.leave` | Manager → HR (optional 2nd level) |
| **Attendance correction** | `hr.attendance.correction` | Manager → HR finalize |
| **Overtime** | `hr.overtime` | Manager → HR |
| **Expense / travel** | `hr.expense` | Manager → Finance (optional) |
| **Payroll run** | `payroll.run` | Payroll officer → HR manager → lock |
| **Loan / advance** | `payroll.loan` | HR → Payroll |
| **Recruitment offer** | `hr.recruitment.offer` | HR → Department head |
| **Employee hire / terminate** | `hr.employee` | HR manager (elevated) |

### 14.2 Approval UI patterns

| Pattern | Component |
|---------|-----------|
| Pending queue | `/hr/approvals` — unified inbox |
| Record header | Approval bar · status · approver avatars |
| Actions | Approve · Reject · Delegate · comment required on reject |
| Separation of duties | Payroll: calculator ≠ approver ≠ poster |
| Notifications | Core notification on pending item |

RBAC: hide actions user cannot perform — never disable.

### 14.3 Approval center (optional hub)

**Route:** `/hr/approvals` · tabs: Leave · Attendance · OT · Expense · Payroll · Recruitment.

Mobile: priority card list with swipe approve (manager).

---

## 15. ESS Portal UI (Employee Self-Service)

**Route:** `/ess/*` · **`LAYOUT-ESS`** · mobile-first mandatory

| Screen | Route |
|--------|-------|
| ESS Dashboard | `/ess` |
| Profile | `/ess/profile` |
| Check in/out | `/ess/attendance` |
| Leave | `/ess/leave` |
| Payslips | `/ess/payslips` |
| Documents | `/ess/documents` |
| Requests | `/ess/requests` (OT · travel · loan) |

Permissions: `ess.*` · self-scope only (`employee_id = current`).

---

## 16. Mobile HR UI

### 16.1 Priority screens (admin/manager)

| Screen | Behaviour |
|--------|-----------|
| **Dashboard** | Headcount · absent today · pending approvals |
| **Attendance** | Check in/out · team register |
| **Leave** | Apply · approve (manager) |
| **Employees** | `DS-CARD-LIST` · search |
| **Payroll** | Run status · exceptions count (read-only summary) |
| **Quick Actions** | Check in · approve leave · view roster |

### 16.2 Mobile rules

| Rule | Detail |
|------|--------|
| Lists | `DS-CARD-LIST` on `< md` |
| Employee profile | Tabs scroll · stack sections |
| Recruitment kanban | Horizontal stage scroll on phone |
| Payroll run detail | Desktop recommended — summary cards on mobile |
| ESS | Primary mobile experience for employees |
| Tap targets | 44×44px minimum |

---

## 17. Interaction Rules (HR-specific)

| Interaction | Rule |
|-------------|------|
| Employee identity | `contact_id` required · Core contact picker on create |
| Payslip immutability | Locked runs — read-only payslips |
| Attendance correction | Original preserved · audit entry |
| Leave balance | Validate before approve · negative policy configurable |
| Hire from recruitment | Convert applicant → employee · pre-fill structure |
| Payroll post | `payroll.run.posted` → Finance event only |
| Cross-module | UUID links · API/events — no cross-module DB |
| PII | Field-level permissions on bank/tax |
| Module off | Graceful hide — no crashes in other modules |

---

## 18. Permissions → UI

| Permission | UI effect |
|------------|-----------|
| `hr.access` | HR module visible |
| `hr.employee.read` | Employee directory |
| `hr.employee.write` | Create/edit employee |
| `hr.sensitive.view` | Bank · tax fields |
| `hr.leave.approve` | Approve leave actions |
| `payroll.access` | Payroll nav |
| `payroll.run.approve` | Approve payroll run |
| `payroll.run.post` | Post to Accounting |
| `ess.*` | ESS portal |

Record rules: company scope · department subtree for managers · self for ESS.

Full matrix: [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md) (when aligned).

---

## 19. Responsive Rules

| Screen | Desktop | Mobile |
|--------|---------|--------|
| Employee directory | `DS-DATAGRID` | `DS-CARD-LIST` |
| Employee profile | Full page tabs | Full screen · tab scroll |
| Attendance calendar | `DS-CALENDAR` full | Week list view |
| Leave list | `DS-DATAGRID` | `DS-CARD-LIST` |
| Recruitment | `DS-KANBAN-BOARD` | Stage cards |
| Payroll run | Exception grid | Summary + link to desktop |
| Dashboard | 12-col widgets | KPI → approvals → actions |
| ESS | Responsive shell | Bottom nav · full-width |

---

## 20. Activity & Zone E

Per architecture §24 — activity on all HR entities:

| Entity | Activity pattern |
|--------|------------------|
| Employee | Hire · transfer · promotion · status |
| Attendance | Punch · correction |
| Leave | Request · approve · reject |
| Payroll run | Calculate · approve · lock · post |
| Payslip | Publish · download |

List: activity icon column. Detail: Activities tab + **`WS-CONTEXT-ACTIVITY`** (Zone E).

Global Activity Drawer: Overview · Activities · Comments · Notes · Attachments · AI Actions.

---

## 21. Settings UI

| Route | Content |
|-------|---------|
| `/hr/settings` | Holidays · leave policies · devices · shifts · calendars |
| `/payroll/settings` | Tax rules · components · bank formats · contribution rules |

---

## 22. Menus Spec Index (to align)

| Screen | Route | layout_id |
|--------|-------|-----------|
| Employees | `/hr/employees` | `LAYOUT-LIST` / `LAYOUT-DETAILS` |
| Attendance | `/hr/attendance` | `LAYOUT-LIST` + calendar |
| Leave | `/hr/leave` | `LAYOUT-LIST` |
| Recruitment | `/hr/recruitment` | `LAYOUT-KANBAN` |
| Payroll runs | `/payroll/runs` | `LAYOUT-LIST` / `LAYOUT-PAYROLL-RUN` |
| Dashboard | `/hr/dashboard` | `LAYOUT-DASHBOARD` |

Declare: `context_required` (company · branch · department) · `empty_state` · `loading` · `DS-*` IDs.

---

## 23. Compliance Checklist

- [ ] Drawer CRUD on lists — full page for employee profile & payroll run
- [ ] No `/new` routes
- [ ] `DS-*` / `WS-*` (+ kanban/payroll-run ADR layouts)
- [ ] Dashboard widgets in ModuleManifest
- [ ] Contacts via Core — no duplicate person UI
- [ ] Payslip immutability after lock
- [ ] Approval workflows on sensitive actions
- [ ] ESS mobile-first
- [ ] AI via `DS-AI-*` only · no auto-post payroll
- [ ] Generate `UI.md` from this blueprint

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 22 — HR & Payroll module UI blueprint |

---

**HR & Payroll UI Blueprint** — workforce UI · design-system compliant · prototype-ready.
