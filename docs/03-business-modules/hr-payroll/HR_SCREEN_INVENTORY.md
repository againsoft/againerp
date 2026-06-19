# HR & Payroll — Screen Inventory

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll (unified enterprise suite)  
> **Document Type:** Screen Inventory & Navigation Registry  
> **Phase:** Documentation First · Planning Only  
> **Route namespace:** `/hr/*` · `/payroll/*` · `/ess/*` · Core `/inbox/*` · `/notifications`  
> **Parent:** [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md) · [HR_UI_UX_BLUEPRINT.md](./HR_UI_UX_BLUEPRINT.md) · [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md)  
> **Governance:** [PROJECT_COMMON_RULES.md](../../00-foundation/PROJECT_COMMON_RULES.md) · [ENTERPRISE_UI_ARCHITECTURE.md](../../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md)

**No application code.**  
Master registry of **every HR & Payroll screen** — routes, types, navigation, permissions. Foundation for UI/Figma, frontend, backend, QA, API planning, and permission mapping.

**Drawer rule:** Create · View · Edit are **logical screens** on list routes via `?create=1` · `?view={id}` · `?edit={id}` — not separate URL paths.

---

## Executive Summary

| Metric | Count |
|--------|------:|
| **Module routes** | 85+ |
| **Logical screens** (incl. drawers, tabs, wizards) | 280+ |
| **Report pages** | 45+ |
| **Wizards** | 12 |
| **ESS screens** | 11 |
| **AI screens** | 9 |
| **Global / shared screens** | 15 |

---

## Screen Inventory Philosophy

### Core beliefs

> **One registry. No orphan screens. Every route maps to permission, API, and QA.**

| Principle | Rule |
|-----------|------|
| **Completeness** | If it appears in nav or workflow, it is registered here |
| **Drawer-first** | Create/View/Edit are inventory rows — same route, query params |
| **Tab as screen** | Employee profile tabs are logical screens for QA/API |
| **Shared platform** | Approval inbox, notifications — register with `CORE-*` prefix |
| **ESS separation** | `/ess/*` screens use `ess.*` permissions |
| **Traceability** | Screen ID links to future Figma frame + test case |

### What this document owns

| Owns | Does not own |
|------|----------------|
| Screen list, route, type, nav, permissions | Component implementation |
| Wizard and report inventory | SQL / API payload schemas (see API.md) |
| Global drawer/modal registry | Wireframe pixels |

---

## Naming Convention

### Screen ID format

```text
SCR-{SCOPE}-{DOMAIN}-{SEQ}

SCOPE: HR | PAY | ESS | CORE | AI
DOMAIN: 3–4 letter code (EMP, ATT, PAY, …)
SEQ: 001–999
```

Examples: `SCR-HR-EMP-001` · `SCR-PAY-RUN-010` · `SCR-ESS-LEV-003`

### Route naming

| Pattern | Example |
|---------|---------|
| List | `/hr/employees` |
| Sub-list | `/hr/attendance/daily` |
| Drawer create | `/hr/employees?create=1` |
| Drawer view | `/hr/employees?view={id}` |
| Drawer edit | `/hr/employees?view={id}` → `?edit={id}` |
| Tab deep link | `/hr/employees?view={id}&tab=salary` |
| Filter deep link | `/hr/employees?status=active&branch={id}` |

### Screen name format

`{Domain} {Purpose}` — e.g. `Employee List`, `Payroll Run Processing`

---

## Screen Classification Rules

| Type | Code | Description | URL pattern |
|------|------|-------------|-------------|
| **Module screen** | `MOD` | Landing / hub for subdomain | `/hr/recruitment` |
| **List screen** | `LST` | AG Grid or card list | `/hr/employees` |
| **Details screen** | `DTL` | Read-only view | `?view={id}` or dedicated analytics |
| **Create screen** | `CRT` | Create form | `?create=1` |
| **Edit screen** | `EDT` | Edit form | `?edit={id}` |
| **Wizard screen** | `WIZ` | Multi-step flow | Drawer or modal wizard |
| **Drawer** | `DRW` | Sheet panel overlay | Query-param driven |
| **Modal** | `MDL` | Confirm / destructive | In-page modal |
| **Kanban screen** | `KBN` | Pipeline columns | `/hr/recruitment` (pipeline view) |
| **Calendar screen** | `CAL` | Date grid | Leave, attendance, shifts |
| **Timeline screen** | `TML` | Chronological events | Employee timeline tab |
| **Report screen** | `RPT` | Report output page | `/hr/reports/{slug}` |
| **Analytics screen** | `ANL` | Charts + KPIs | `*/analytics` |
| **Settings screen** | `SET` | Config sections | `/hr/settings/*` |
| **Self service screen** | `ESS` | Employee portal | `/ess/*` |
| **AI screen** | `AI` | AI hub / insights | `/hr/ai/*` |

**Default CRUD:** `LST` + `DRW(CRT|DTL|EDT)` on same route.

---

## Navigation Mapping

Screens register in `ModuleManifest.md` menu tree → merged in app sidebar per [navigation.ts](../../../apps/web/src/lib/navigation.ts) (future).

```text
HR & Payroll (sidebar group)
├── Dashboards (multiple routes)
├── Employees ▾
├── Recruitment
├── Time ▾ (Attendance, Shifts, Leave, Overtime)
├── Payroll ▾
├── Talent ▾ (Performance, Training)
├── Assets & Docs
├── Reports ▾
├── Settings ▾
└── AI

ESS (separate entry / role-based home)
```

---

## Permission Mapping Strategy

| Action | Permission pattern | UI rule |
|--------|-------------------|---------|
| **View screen** | `{module}.{resource}.view` or `hr.access` | Hide nav item |
| **Create** | `.create` | Hide Create button |
| **Edit** | `.edit` | Hide Edit / drawer mode |
| **Approve** | `.approve` or `core.approval.act` | Approval queue only |
| **Export** | `.export` or `payroll.bank_export` | Hide export |
| **Sensitive tabs** | `hr.sensitive.view` | Hide salary/bank tabs |
| **ESS** | `ess.*` | Separate portal |

**Record rules:** Manager sees team via `department_subtree`; employee sees self on ESS.

---

# Screen Types (reference)

See classification table above. HR uses **all types** except full-page Create/Edit routes (forbidden).

---

# HR Module Master Navigation

| Menu | Sub-menu | Screen (primary) | Route | View permission |
|------|----------|------------------|-------|-----------------|
| HR & Payroll | Dashboard | HR Dashboard | `/hr` | `hr.access` |
| Employees | Directory | Employee List | `/hr/employees` | `hr.employee.view` |
| Employees | Organization | Organization Hub | `/hr/organization` | `hr.department.view` |
| Employees | Departments | Department List | `/hr/organization/departments` | `hr.department.view` |
| Employees | Designations | Designation List | `/hr/organization/designations` | `hr.job_position.view` |
| Employees | Employment Types | Employment Type List | `/hr/organization/employment-types` | `hr.department.view` |
| Employees | Documents | Document Center | `/hr/documents` | `hr.document.view` |
| Recruitment | — | Recruitment Hub | `/hr/recruitment` | `hr.candidate.manage` |
| Attendance | — | Attendance Dashboard | `/hr/attendance` | `hr.attendance.view` |
| Shifts | — | Shift List | `/hr/shifts` | `hr.shift.view` |
| Leave | — | Leave Dashboard | `/hr/leave` | `hr.leave.view` |
| Payroll | Dashboard | Payroll Dashboard | `/payroll` | `payroll.access` |
| Payroll | Runs | Payroll Batch List | `/payroll/runs` | `payroll.run.view` |
| Payroll | Payslips | Payslip List | `/payroll/payslips` | `payroll.payslip.view_all` |
| Payroll | Structures | Salary Structures | `/payroll/structures` | `payroll.structure.view` |
| Overtime | — | Overtime Dashboard | `/hr/overtime` | `hr.attendance.view` |
| Loans & Advances | — | Loan Dashboard | `/payroll/loans` | `payroll.loan.view` |
| Performance | — | Performance Dashboard | `/hr/performance` | `hr.performance.manage` |
| Training | — | Training Dashboard | `/hr/training` | `hr.training.program.manage` |
| Assets | — | Asset Dashboard | `/hr/assets` | `hr.asset.create` |
| Travel | — | Travel Requests | `/hr/travel` | `hr.leave.view` |
| Expenses | — | Expense Claims | `/hr/expenses` | `hr.expense.approve` |
| Reports | HR | HR Report Center | `/hr/reports` | `hr.report.employee.view` |
| Reports | Payroll | Payroll Report Center | `/payroll/reports` | `payroll.report.view` |
| Settings | HR | HR Settings | `/hr/settings` | `hr.settings.manage`* |
| Settings | Payroll | Payroll Settings | `/payroll/settings` | `payroll.tax.manage` |
| Settings | Devices | Attendance Devices | `/hr/settings/devices` | `hr.attendance.device.manage` |
| Settings | Leave | Leave Policies | `/hr/settings/leave` | `hr.leave.policy.manage` |
| AI | — | AI HR Hub | `/hr/ai` | `ai.access` |
| ESS | — | Employee Portal | `/ess` | `ess.access` |

\*Settings manage keys planned in ModuleManifest — use Company Admin until registered.

---

# Dashboard Screens

| ID | Screen | Route | Type | View | Create | Edit | Approve | Export |
|----|--------|-------|------|------|--------|------|---------|--------|
| SCR-HR-DSH-001 | HR Dashboard | `/hr` | MOD | `hr.access` | — | — | — | — |
| SCR-HR-DSH-002 | Attendance Dashboard | `/hr/attendance` | MOD | `hr.attendance.view` | — | — | — | — |
| SCR-HR-DSH-003 | Leave Dashboard | `/hr/leave` | MOD | `hr.leave.view` | — | — | — | — |
| SCR-PAY-DSH-001 | Payroll Dashboard | `/payroll` | MOD | `payroll.access` | — | — | — | — |
| SCR-HR-DSH-004 | Recruitment Dashboard | `/hr/recruitment` | MOD | `hr.candidate.manage` | — | — | — | — |
| SCR-HR-DSH-005 | Performance Dashboard | `/hr/performance` | MOD | `hr.performance.manage` | — | — | — | — |
| SCR-HR-DSH-006 | Training Dashboard | `/hr/training` | MOD | `hr.training.program.manage` | — | — | — | — |
| SCR-HR-DSH-007 | Asset Dashboard | `/hr/assets` | MOD | `hr.asset.create` | — | — | — | — |
| SCR-HR-DSH-008 | Executive Dashboard | `/hr/executive` | MOD | `hr.employee.view_all` | — | — | — | `hr.report.employee.view` |

---

# Employee Management Screens

| ID | Screen | Route / pattern | Type | View | Create | Edit | Approve | Export |
|----|--------|---------------|------|------|--------|------|---------|--------|
| SCR-HR-EMP-001 | Employee List | `/hr/employees` | LST | `hr.employee.view` | `hr.employee.create` | `hr.employee.edit` | — | `hr.employee.export` |
| SCR-HR-EMP-002 | Employee Create | `/hr/employees?create=1` | DRW/CRT | `hr.employee.create` | ✓ | — | — | — |
| SCR-HR-EMP-003 | Employee Edit | `/hr/employees?edit={id}` | DRW/EDT | `hr.employee.edit` | — | ✓ | — | — |
| SCR-HR-EMP-004 | Employee Details | `/hr/employees?view={id}` | DRW/DTL | `hr.employee.view` | — | — | — | — |
| SCR-HR-EMP-005 | Employee Timeline | `…&tab=timeline` | TML | `hr.employee.view` | — | — | — | — |
| SCR-HR-EMP-006 | Employee Activity History | `…&tab=activity` | TML | `hr.employee.view` | — | — | — | — |
| SCR-HR-EMP-007 | Employee Notes | `…&tab=notes` | DRW | `hr.employee.view` | `hr.employee.edit` | ✓ | — | — |
| SCR-HR-EMP-008 | Employee Documents | `…&tab=documents` | DRW | `hr.document.view` | `hr.document.upload` | ✓ | — | — |
| SCR-HR-EMP-009 | Employee Salary Profile | `…&tab=salary` | DRW | `hr.sensitive.view` | `payroll.salary_revision.manage` | ✓ | — | — |
| SCR-HR-EMP-010 | Employee Attendance | `…&tab=attendance` | CAL | `hr.attendance.view` | — | — | — | — |
| SCR-HR-EMP-011 | Employee Leave | `…&tab=leave` | LST | `hr.leave.view` | `hr.leave.create` | — | `hr.leave.approve` | — |
| SCR-HR-EMP-012 | Employee Payroll | `…&tab=payroll` | LST | `payroll.payslip.view_all` | — | — | — | — |
| SCR-HR-EMP-013 | Employee Assets | `…&tab=assets` | LST | `hr.asset.create` | `hr.asset.assign` | — | — | — |
| SCR-HR-EMP-014 | Employee Performance | `…&tab=performance` | LST | `hr.performance.manage` | ✓ | ✓ | `hr.performance.approve` | — |
| SCR-HR-EMP-015 | Employee Training | `…&tab=training` | LST | `hr.training.program.manage` | ✓ | — | — | — |
| SCR-HR-EMP-016 | Employee Exit Profile | `…&tab=exit` | DTL | `hr.exit.view`* | — | `hr.employee.terminate` | — | — |
| SCR-HR-EMP-017 | Employee Archive | `/hr/employees?status=archived` | LST | `hr.employee.view` | — | — | — | — |
| SCR-HR-EMP-018 | Employee Merge Wizard | `/hr/employees?merge=1` | WIZ | `hr.employee.edit` | — | ✓ | — | — |

\*`hr.exit.view` — planned; HR Manager until registered.

**Modals:** Terminate confirm · Transfer confirm · Promote confirm (`SCR-HR-EMP-M01`–`M03`)

---

# Organization Screens

| ID | Screen | Route | Type | View | Create | Edit | Approve | Export |
|----|--------|-------|------|------|--------|------|---------|--------|
| SCR-HR-ORG-001 | Organization Hub | `/hr/organization` | MOD | `hr.department.view` | — | — | — | — |
| SCR-COR-ORG-001 | Company List | `/settings/business` | LST | Core admin | — | — | — | — |
| SCR-COR-ORG-002 | Branch List | `/settings/localisation/store-locations` | LST | Core admin | — | — | — | — |
| SCR-HR-ORG-002 | Location List | `/hr/organization/locations` | LST | `hr.location.view` | `hr.location.manage` | ✓ | — | — |
| SCR-HR-ORG-003 | Department List | `/hr/organization/departments` | LST | `hr.department.view` | `hr.department.manage` | ✓ | — | — |
| SCR-HR-ORG-004 | Team List | `/hr/organization/teams` | LST | `hr.department.view` | `hr.department.manage` | ✓ | — | — |
| SCR-HR-ORG-005 | Designation List | `/hr/organization/designations` | LST | `hr.job_position.view` | `hr.job_position.manage` | ✓ | — | — |
| SCR-HR-ORG-006 | Employment Type List | `/hr/organization/employment-types` | LST | `hr.department.view` | `hr.department.manage` | ✓ | — | — |
| SCR-HR-ORG-007 | Reporting Structure | `/hr/organization/reporting` | LST | `hr.employee.view` | — | `hr.employee.edit` | — | — |
| SCR-HR-ORG-008 | Organization Chart | `/hr/organization/chart` | ANL | `hr.department.view` | — | — | — | Export PNG* |

\*Export — `hr.employee.export` or chart-specific key.

**Drawers:** Location/Department/Team/Designation Create·View·Edit on list routes (`?create` `?view` `?edit`).

---

# Recruitment Screens

| ID | Screen | Route | Type | View | Create | Edit | Approve | Export |
|----|--------|-------|------|------|--------|------|---------|--------|
| SCR-HR-REC-001 | Job Requisition List | `/hr/recruitment/requisitions` | LST | `hr.requisition.manage` | ✓ | ✓ | `hr.hiring.approve` | — |
| SCR-HR-REC-002 | Job Requisition Details | `?view={id}` | DRW/DTL | `hr.requisition.manage` | — | — | — | — |
| SCR-HR-REC-003 | Job Requisition Create | `?create=1` | DRW/CRT | `hr.requisition.manage` | ✓ | — | — | — |
| SCR-HR-REC-004 | Candidate List | `/hr/recruitment/candidates` | LST | `hr.candidate.manage` | ✓ | ✓ | — | — |
| SCR-HR-REC-005 | Candidate Details | `?view={id}` | DRW/DTL | `hr.candidate.manage` | — | — | — | — |
| SCR-HR-REC-006 | Candidate Timeline | `…&tab=timeline` | TML | `hr.candidate.manage` | — | — | — | — |
| SCR-HR-REC-007 | Interview Calendar | `/hr/recruitment/interviews` | CAL | `hr.interview.edit` | ✓ | ✓ | — | — |
| SCR-HR-REC-008 | Interview Pipeline | `/hr/recruitment` (pipeline) | KBN | `hr.candidate.manage` | — | ✓ | — | — |
| SCR-HR-REC-009 | Interview Evaluation | `?view={id}&tab=evaluation` | DRW | `hr.interview.edit` | — | ✓ | — | — |
| SCR-HR-REC-010 | Offer Letter | `?view={id}&tab=offer` | DRW | `hr.offer.manage` | ✓ | ✓ | `hr.hiring.approve` | Print |
| SCR-HR-REC-011 | Hiring Wizard | `/hr/recruitment?hire={candidateId}` | WIZ | `hr.hiring.approve` | ✓ | — | ✓ | — |
| SCR-HR-REC-012 | Recruitment Reports | `/hr/reports/recruitment` | RPT | `hr.report.recruitment.view` | — | — | — | ✓ |

**Parent hub:** `/hr/recruitment` — tabs: Pipeline · Requisitions · Candidates · Calendar

---

# Attendance Screens

| ID | Screen | Route | Type | View | Create | Edit | Approve | Export |
|----|--------|-------|------|------|--------|------|---------|--------|
| SCR-HR-ATT-001 | Attendance Dashboard | `/hr/attendance` | MOD | `hr.attendance.view` | — | — | — | — |
| SCR-HR-ATT-002 | Daily Attendance | `/hr/attendance/daily` | LST | `hr.attendance.view` | `hr.attendance.manual` | ✓ | — | `hr.attendance.export` |
| SCR-HR-ATT-003 | Monthly Attendance | `/hr/attendance/monthly` | LST | `hr.attendance.view` | — | — | — | `hr.attendance.export` |
| SCR-HR-ATT-004 | Attendance Calendar | `/hr/attendance/calendar` | CAL | `hr.attendance.view` | — | — | — | — |
| SCR-HR-ATT-005 | Attendance Timeline | `/hr/attendance/timeline` | TML | `hr.attendance.view` | — | — | — | — |
| SCR-HR-ATT-006 | Attendance Corrections | `/hr/attendance/corrections` | LST | `hr.attendance.correct` | ✓ | ✓ | — | — |
| SCR-HR-ATT-007 | Attendance Approvals | `/hr/attendance/corrections?status=pending` | LST | `hr.attendance.correction.approve` | — | — | ✓ | — |
| SCR-HR-ATT-008 | Attendance Analytics | `/hr/attendance/analytics` | ANL | `hr.report.attendance.view` | — | — | — | ✓ |
| SCR-HR-ATT-009 | Attendance Device List | `/hr/settings/devices` | LST | `hr.attendance.device.manage` | ✓ | ✓ | — | — |
| SCR-HR-ATT-010 | Device Details | `?view={id}` | DRW/DTL | `hr.attendance.device.manage` | — | ✓ | — | — |
| SCR-HR-ATT-011 | Biometric Sync Logs | `/hr/attendance/devices/logs` | LST | `hr.attendance.device.manage` | — | — | — | — |
| SCR-HR-ATT-012 | Attendance Import Wizard | `/hr/attendance?import=1` | WIZ | `hr.attendance.import` | ✓ | — | — | — |
| SCR-HR-ATT-013 | Attendance Export Wizard | `/hr/attendance?export=1` | WIZ | `hr.attendance.export` | — | — | — | ✓ |

**Drawers:** Correction create/view on `SCR-HR-ATT-006` route.

---

# Shift Management Screens

| ID | Screen | Route | Type | View | Create | Edit | Approve | Export |
|----|--------|-------|------|------|--------|------|---------|--------|
| SCR-HR-SHF-001 | Shift List | `/hr/shifts` | LST | `hr.shift.view` | `hr.shift.manage` | ✓ | — | — |
| SCR-HR-SHF-002 | Shift Details | `?view={id}` | DRW/DTL | `hr.shift.view` | — | — | — | — |
| SCR-HR-SHF-003 | Shift Create | `?create=1` | DRW/CRT | `hr.shift.manage` | ✓ | — | — | — |
| SCR-HR-SHF-004 | Shift Calendar | `/hr/shifts/calendar` | CAL | `hr.shift.view` | — | — | — | — |
| SCR-HR-SHF-005 | Shift Assignment | `/hr/shifts/assignments` | LST | `hr.shift.assign` | ✓ | ✓ | — | — |
| SCR-HR-SHF-006 | Shift Rotation Planner | `/hr/shifts/rotations` | WIZ | `hr.shift.manage` | ✓ | ✓ | — | — |
| SCR-HR-SHF-007 | Shift Conflict Resolution | `/hr/shifts/conflicts` | LST | `hr.shift.override` | — | ✓ | — | — |
| SCR-HR-SHF-008 | Shift Policies | `/hr/settings/shifts` | SET | `hr.shift.manage` | — | ✓ | — | — |

---

# Leave Management Screens

| ID | Screen | Route | Type | View | Create | Edit | Approve | Export |
|----|--------|-------|------|------|--------|------|---------|--------|
| SCR-HR-LEV-001 | Leave Dashboard | `/hr/leave` | MOD | `hr.leave.view` | — | — | — | — |
| SCR-HR-LEV-002 | Leave Request List | `/hr/leave/requests` | LST | `hr.leave.view` | `hr.leave.create` | ✓ | — | — |
| SCR-HR-LEV-003 | Leave Details | `?view={id}` | DRW/DTL | `hr.leave.view` | — | — | — | — |
| SCR-HR-LEV-004 | Leave Calendar | `/hr/leave/calendar` | CAL | `hr.leave.view` | — | — | — | — |
| SCR-HR-LEV-005 | Leave Balance | `/hr/leave/balances` | LST | `hr.leave.view` | — | `hr.leave.balance.adjust` | — | — |
| SCR-HR-LEV-006 | Leave Approval Queue | `/hr/leave/requests?status=pending` | LST | `hr.leave.approve` | — | — | ✓ | — |
| SCR-HR-LEV-007 | Leave Policies | `/hr/settings/leave` | SET | `hr.leave.policy.manage` | ✓ | ✓ | — | — |
| SCR-HR-LEV-008 | Leave Accrual Rules | `/hr/settings/leave/accrual` | SET | `hr.leave.policy.manage` | ✓ | ✓ | — | — |
| SCR-HR-LEV-009 | Leave Encashment | `/hr/leave/encashment` | LST | `hr.leave.encash` | ✓ | — | `hr.leave.approve` | — |
| SCR-HR-LEV-010 | Holiday Calendar | `/hr/settings/holidays` | CAL | `hr.leave.policy.manage` | ✓ | ✓ | — | — |

---

# Payroll Screens

| ID | Screen | Route | Type | View | Create | Edit | Approve | Export |
|----|--------|-------|------|------|--------|------|---------|--------|
| SCR-PAY-DSH-001 | Payroll Dashboard | `/payroll` | MOD | `payroll.access` | — | — | — | — |
| SCR-PAY-PRD-001 | Payroll Periods | `/payroll/periods` | LST | `payroll.run.view` | `payroll.run.create` | ✓ | — | — |
| SCR-PAY-RUN-001 | Payroll Batch List | `/payroll/runs` | LST | `payroll.run.view` | `payroll.run.create` | — | — | — |
| SCR-PAY-RUN-002 | Payroll Batch Details | `?view={id}` | DRW/DTL | `payroll.run.view` | — | — | — | — |
| SCR-PAY-RUN-003 | Payroll Processing | `?view={id}&tab=process` | WIZ | `payroll.run.calculate` | ✓ | ✓ | — | — |
| SCR-PAY-RUN-004 | Payroll Approval Queue | `/payroll/runs?status=pending` | LST | `payroll.run.approve` | — | — | ✓ | — |
| SCR-PAY-RUN-005 | Payroll Lock Screen | `?view={id}&action=lock` | MDL | `payroll.run.lock` | — | — | ✓ | — |
| SCR-PAY-RUN-006 | Payroll Reopen Wizard | `?view={id}&reopen=1` | WIZ | `payroll.run.reopen` | — | — | ✓ | — |
| SCR-PAY-PSL-001 | Payslip List | `/payroll/payslips` | LST | `payroll.payslip.view_all` | — | — | — | — |
| SCR-PAY-PSL-002 | Payslip Details | `?view={id}` | DRW/DTL | `payroll.payslip.view` | — | — | — | Print |
| SCR-PAY-STR-001 | Salary Structures | `/payroll/structures` | LST | `payroll.structure.view` | `payroll.structure.manage` | ✓ | — | — |
| SCR-PAY-STR-002 | Salary Components | `/payroll/structures/components` | LST | `payroll.structure.manage` | ✓ | ✓ | — | — |
| SCR-PAY-STR-003 | Allowances | `/payroll/structures/allowances` | LST | `payroll.structure.manage` | ✓ | ✓ | — | — |
| SCR-PAY-STR-004 | Deductions | `/payroll/structures/deductions` | LST | `payroll.structure.manage` | ✓ | ✓ | — | — |
| SCR-PAY-STR-005 | Tax Rules | `/payroll/settings/tax` | SET | `payroll.tax.manage` | ✓ | ✓ | — | — |
| SCR-PAY-STR-006 | Benefits | `/payroll/structures/benefits` | LST | `payroll.structure.manage` | ✓ | ✓ | — | — |
| SCR-PAY-BON-001 | Bonus Management | `/payroll/bonuses` | LST | `payroll.bonus.manage` | ✓ | ✓ | `payroll.run.approve` | — |
| SCR-PAY-COM-001 | Commission Management | `/payroll/commissions` | LST | `payroll.commission.manage` | ✓ | ✓ | — | — |
| SCR-PAY-REV-001 | Salary Revision | `/payroll/salary-revisions` | LST | `payroll.salary_revision.manage` | ✓ | ✓ | `payroll.run.approve` | — |
| SCR-PAY-EXP-001 | Payroll Export | `/payroll/export` | WIZ | `payroll.bank_export` | — | — | — | ✓ |
| SCR-PAY-ANL-001 | Payroll Analytics | `/payroll/analytics` | ANL | `payroll.report.view` | — | — | — | ✓ |

**Drawers:** Structure/Bonus/Commission create·view·edit on respective list routes.

---

# Overtime Screens

| ID | Screen | Route | Type | View | Create | Edit | Approve | Export |
|----|--------|-------|------|------|--------|------|---------|--------|
| SCR-HR-OVT-001 | Overtime Dashboard | `/hr/overtime` | MOD | `hr.attendance.view` | — | — | — | — |
| SCR-HR-OVT-002 | Overtime Requests | `/hr/overtime/requests` | LST | `hr.attendance.view` | `hr.leave.create`* | ✓ | — | — |
| SCR-HR-OVT-003 | Overtime Approvals | `?status=pending` | LST | `hr.leave.approve`* | — | — | ✓ | — |
| SCR-HR-OVT-004 | Overtime Policies | `/hr/settings/overtime` | SET | `hr.shift.manage` | ✓ | ✓ | — | — |
| SCR-HR-OVT-005 | Overtime Calculation | `/hr/overtime/calculations` | LST | `payroll.run.view` | — | — | — | — |
| SCR-HR-OVT-006 | Overtime Analytics | `/hr/reports/overtime` | ANL | `hr.report.attendance.view` | — | — | — | ✓ |

\*Dedicated `hr.overtime.*` keys planned — use leave keys interim in manifest.

---

# Loan & Advance Screens

| ID | Screen | Route | Type | View | Create | Edit | Approve | Export |
|----|--------|-------|------|------|--------|------|---------|--------|
| SCR-PAY-LON-001 | Loan Dashboard | `/payroll/loans` | MOD | `payroll.loan.view` | — | — | — | — |
| SCR-PAY-LON-002 | Loan Requests | `/payroll/loans/requests` | LST | `payroll.loan.view` | ✓ | ✓ | — | — |
| SCR-PAY-LON-003 | Loan Details | `?view={id}` | DRW/DTL | `payroll.loan.view` | — | ✓ | — | — |
| SCR-PAY-LON-004 | Loan Approvals | `?status=pending` | LST | `payroll.loan.approve` | — | — | ✓ | — |
| SCR-PAY-LON-005 | Loan Installments | `?view={id}&tab=installments` | LST | `payroll.loan.view` | — | — | — | — |
| SCR-PAY-ADV-001 | Advance Salary Requests | `/payroll/advances` | LST | `payroll.advance.view` | ✓ | ✓ | — | — |
| SCR-PAY-ADV-002 | Advance Salary Approvals | `?status=pending` | LST | `payroll.advance.approve` | — | — | ✓ | — |
| SCR-PAY-ADV-003 | Recovery Tracking | `/payroll/advances/recovery` | LST | `payroll.advance.view` | — | — | — | — |

---

# Performance Screens

| ID | Screen | Route | Type | View | Create | Edit | Approve | Export |
|----|--------|-------|------|------|--------|------|---------|--------|
| SCR-HR-PRF-001 | Performance Dashboard | `/hr/performance` | MOD | `hr.performance.manage` | — | — | — | — |
| SCR-HR-PRF-002 | Goals | `/hr/performance/goals` | LST | `hr.goal.create` | ✓ | ✓ | — | — |
| SCR-HR-PRF-003 | KPIs | `/hr/performance/kpis` | LST | `hr.kpi.manage` | ✓ | ✓ | — | — |
| SCR-HR-PRF-004 | KRAs | `/hr/performance/kras` | LST | `hr.kpi.manage` | ✓ | ✓ | — | — |
| SCR-HR-PRF-005 | Review Cycles | `/hr/performance/cycles` | LST | `hr.performance.manage` | ✓ | ✓ | — | — |
| SCR-HR-PRF-006 | Self Reviews | `/hr/performance/self-reviews` | LST | `ess.performance.self_review` | ✓ | ✓ | — | — |
| SCR-HR-PRF-007 | Manager Reviews | `/hr/performance/manager-reviews` | LST | `hr.performance.manage` | — | ✓ | `hr.performance.approve` | — |
| SCR-HR-PRF-008 | Final Reviews | `/hr/performance/final-reviews` | LST | `hr.performance.approve` | — | ✓ | ✓ | — |
| SCR-HR-PRF-009 | Promotion Recommendations | `/hr/performance/promotions` | LST | `hr.promotion.recommend` | ✓ | ✓ | `hr.performance.approve` | — |
| SCR-HR-PRF-010 | Performance Analytics | `/hr/reports/performance` | ANL | `hr.report.performance.view` | — | — | — | ✓ |

---

# Training Screens

| ID | Screen | Route | Type | View | Create | Edit | Approve | Export |
|----|--------|-------|------|------|--------|------|---------|--------|
| SCR-HR-TRN-001 | Training Dashboard | `/hr/training` | MOD | `hr.training.program.manage` | — | — | — | — |
| SCR-HR-TRN-002 | Training Programs | `/hr/training/programs` | LST | `hr.training.program.manage` | ✓ | ✓ | — | — |
| SCR-HR-TRN-003 | Training Sessions | `/hr/training/sessions` | LST | `hr.training.schedule.manage` | ✓ | ✓ | — | — |
| SCR-HR-TRN-004 | Participants | `/hr/training/participants` | LST | `hr.training.schedule.manage` | ✓ | ✓ | — | — |
| SCR-HR-TRN-005 | Training Attendance | `/hr/training/attendance` | LST | `hr.training.attendance` | ✓ | ✓ | — | — |
| SCR-HR-TRN-006 | Certificates | `/hr/training/certificates` | LST | `hr.training.certify` | ✓ | — | — | Print |
| SCR-HR-TRN-007 | Evaluations | `/hr/training/evaluations` | LST | `hr.training.evaluate` | ✓ | ✓ | — | — |
| SCR-HR-TRN-008 | Training Analytics | `/hr/reports/training` | ANL | `hr.report.training.view`* | — | — | — | ✓ |

---

# Asset Management Screens

| ID | Screen | Route | Type | View | Create | Edit | Approve | Export |
|----|--------|-------|------|------|--------|------|---------|--------|
| SCR-HR-AST-001 | Asset Dashboard | `/hr/assets` | MOD | `hr.asset.create` | — | — | — | — |
| SCR-HR-AST-002 | Asset Inventory | `/hr/assets/inventory` | LST | `hr.asset.create` | ✓ | ✓ | — | — |
| SCR-HR-AST-003 | Asset Details | `?view={id}` | DRW/DTL | `hr.asset.create` | — | ✓ | — | — |
| SCR-HR-AST-004 | Asset Assignment | `/hr/assets/assignments` | LST | `hr.asset.assign` | ✓ | ✓ | — | — |
| SCR-HR-AST-005 | Asset Returns | `/hr/assets/returns` | LST | `hr.asset.return` | ✓ | ✓ | — | — |
| SCR-HR-AST-006 | Damage Reports | `/hr/assets/damages` | LST | `hr.asset.create` | ✓ | ✓ | — | — |
| SCR-HR-AST-007 | Replacement Requests | `/hr/assets/replacements` | LST | `hr.asset.assign` | ✓ | ✓ | `hr.asset.assign` | — |
| SCR-HR-AST-008 | Asset Disposal | `/hr/assets/disposal` | LST | `hr.asset.dispose` | ✓ | — | ✓ | — |
| SCR-HR-AST-009 | Asset History | `?view={id}&tab=history` | TML | `hr.asset.create` | — | — | — | — |

---

# Document Management Screens

| ID | Screen | Route | Type | View | Create | Edit | Approve | Export |
|----|--------|-------|------|------|--------|------|---------|--------|
| SCR-HR-DOC-001 | Document Center | `/hr/documents` | MOD | `hr.document.view` | — | — | — | — |
| SCR-HR-DOC-002 | Document Types | `/hr/settings/document-types` | LST | `hr.document.view` | ✓ | ✓ | — | — |
| SCR-HR-DOC-003 | Employee Documents | `/hr/documents/employees` | LST | `hr.document.view` | `hr.document.upload` | ✓ | — | — |
| SCR-HR-DOC-004 | Contracts | `/hr/documents/contracts` | LST | `hr.document.view` | ✓ | ✓ | — | — |
| SCR-HR-DOC-005 | Expiry Tracker | `/hr/documents/expiry` | LST | `hr.document.view` | — | — | — | — |
| SCR-HR-DOC-006 | Renewal Queue | `/hr/documents/renewals` | LST | `hr.document.verify` | ✓ | ✓ | — | — |
| SCR-HR-DOC-007 | Document Archive | `/hr/documents/archive` | LST | `hr.document.archive` | — | — | — | — |

---

# Reporting Screens

### Report center shells

| ID | Screen | Route | Type | View | Export |
|----|--------|-------|------|------|--------|
| SCR-HR-RPT-000 | HR Report Center | `/hr/reports` | MOD | `hr.report.employee.view` | — |
| SCR-PAY-RPT-000 | Payroll Report Center | `/payroll/reports` | MOD | `payroll.report.view` | — |

### Employee reports (operational)

| ID | Report | Route slug | Class |
|----|--------|------------|-------|
| SCR-HR-RPT-001 | Employee Directory Report | `employee-directory` | Operational |
| SCR-HR-RPT-002 | Headcount Report | `headcount` | Management |
| SCR-HR-RPT-003 | New Hires Report | `new-hires` | Operational |
| SCR-HR-RPT-004 | Terminations Report | `terminations` | Compliance |
| SCR-HR-RPT-005 | Probation Due Report | `probation-due` | Operational |
| SCR-HR-RPT-006 | Employee Demographics | `demographics` | Management |
| SCR-HR-RPT-007 | Org Structure Report | `org-structure` | Management |

### Attendance reports

| ID | Report | Route slug | Class |
|----|--------|------------|-------|
| SCR-HR-RPT-010 | Daily Attendance Register | `attendance-daily` | Operational |
| SCR-HR-RPT-011 | Monthly Muster Roll | `muster-roll` | Compliance |
| SCR-HR-RPT-012 | Late Arrival Report | `late-arrivals` | Operational |
| SCR-HR-RPT-013 | Absenteeism Report | `absenteeism` | Management |
| SCR-HR-RPT-014 | Overtime Summary | `overtime-summary` | Management |

### Leave reports

| ID | Report | Route slug | Class |
|----|--------|------------|-------|
| SCR-HR-RPT-020 | Leave Balance Report | `leave-balance` | Operational |
| SCR-HR-RPT-021 | Leave Taken Report | `leave-taken` | Operational |
| SCR-HR-RPT-022 | Leave Encashment Report | `leave-encashment` | Compliance |

### Payroll reports

| ID | Report | Route slug | Class |
|----|--------|------------|-------|
| SCR-PAY-RPT-001 | Salary Register | `salary-register` | Compliance |
| SCR-PAY-RPT-002 | Payslip Summary | `payslip-summary` | Operational |
| SCR-PAY-RPT-003 | Component-wise Salary | `component-wise` | Management |
| SCR-PAY-RPT-004 | Bank Transfer Sheet | `bank-sheet` | Compliance |
| SCR-PAY-RPT-005 | Tax Deduction Report | `tax-deduction` | Compliance |
| SCR-PAY-RPT-006 | YTD Earnings Report | `ytd-earnings` | Compliance |
| SCR-PAY-RPT-007 | Payroll Cost by Department | `cost-by-dept` | Executive |

### Loan, performance, training, asset, compliance, audit

| ID | Report | Route | Class |
|----|--------|-------|-------|
| SCR-PAY-RPT-010 | Loan Outstanding | `loan-outstanding` | Management |
| SCR-PAY-RPT-011 | Advance Recovery | `advance-recovery` | Operational |
| SCR-HR-RPT-030 | Performance Summary | `performance-summary` | Management |
| SCR-HR-RPT-031 | Training Completion | `training-completion` | Operational |
| SCR-HR-RPT-032 | Asset Custody Report | `asset-custody` | Operational |
| SCR-HR-RPT-040 | Statutory Compliance Pack | `compliance-pack` | Compliance |
| SCR-HR-RPT-041 | Audit Trail Export | `audit-export` | Compliance |
| SCR-AI-RPT-001 | Attrition Risk Report | `ai-attrition` | AI |

**Route pattern:** `/hr/reports/{slug}` · `/payroll/reports/{slug}`

---

# Approval Center Screens (Core)

| ID | Screen | Route | Type | View | Approve |
|----|--------|-------|------|------|---------|
| SCR-COR-APR-001 | Approval Dashboard | `/inbox/approvals` | MOD | `core.approval.view` | — |
| SCR-COR-APR-002 | Pending Approvals | `/inbox/approvals?status=pending` | LST | `core.approval.act` | ✓ |
| SCR-COR-APR-003 | Approved Items | `?status=approved` | LST | `core.approval.view` | — |
| SCR-COR-APR-004 | Rejected Items | `?status=rejected` | LST | `core.approval.view` | — |
| SCR-COR-APR-005 | Escalated Items | `?status=escalated` | LST | `core.approval.act` | ✓ |
| SCR-COR-APR-006 | Approval History | `/inbox/approvals/history` | LST | `core.approval.view` | — |

**HR filter:** `?module=hr` · `?module=payroll`

---

# Notification Screens (Core)

| ID | Screen | Route | Type | View |
|----|--------|-------|------|------|
| SCR-COR-NTF-001 | Notification Center | `/notifications` | LST | Authenticated |
| SCR-COR-NTF-002 | Notification Preferences | `/settings/notifications` | SET | Authenticated |
| SCR-COR-NTF-003 | Notification History | `/notifications/history` | LST | Authenticated |

**Header dropdown:** `SCR-COR-NTF-000` — bell popover (subset of center)

---

# Activity Log Screens

| ID | Screen | Route / host | Type | View |
|----|--------|--------------|------|------|
| SCR-COR-ACT-001 | Global Activity Drawer | Any list `ActivityTriggerButton` | DRW | Entity read perm |
| SCR-HR-ACT-001 | Employee Activity Timeline | `/hr/employees?view={id}&tab=activity` | TML | `hr.employee.view` |
| SCR-HR-ACT-002 | Attendance Timeline | `/hr/attendance/timeline` | TML | `hr.attendance.view` |
| SCR-PAY-ACT-001 | Payroll Timeline | `/payroll/runs?view={id}&tab=history` | TML | `payroll.run.view` |
| SCR-HR-ACT-003 | Audit Log Viewer | `/hr/reports/audit-export` | RPT | `hr.audit.export` |

---

# Self Service Portal Screens

| ID | Screen | Route | Type | View | Create | Approve |
|----|--------|-------|------|------|--------|---------|
| SCR-ESS-DSH-001 | Employee Dashboard | `/ess` | MOD | `ess.access` | — | — |
| SCR-ESS-PRF-001 | My Profile | `/ess/profile` | DTL | `ess.profile.view` | — | `ess.profile.edit` |
| SCR-ESS-ATT-001 | My Attendance | `/ess/attendance` | CAL | `ess.attendance.view` | Correction req | — |
| SCR-ESS-LEV-001 | My Leave | `/ess/leave` | LST | `ess.leave.apply` | ✓ | — |
| SCR-ESS-PAY-001 | My Payslips | `/ess/payslips` | LST | `ess.payslip.view` | — | — |
| SCR-ESS-DOC-001 | My Documents | `/ess/documents` | LST | `ess.document.upload` | ✓ | — |
| SCR-ESS-AST-001 | My Assets | `/ess/assets` | LST | `ess.asset.view` | Request | — |
| SCR-ESS-TRN-001 | My Training | `/ess/training` | LST | `ess.training.enroll` | ✓ | — |
| SCR-ESS-PRF-002 | My Performance | `/ess/performance` | LST | `ess.performance.self_review` | ✓ | — |
| SCR-ESS-REQ-001 | My Requests | `/ess/requests` | LST | `ess.request.create` | ✓ | — |

---

# Settings Screens

| ID | Screen | Route | Type | Manage perm |
|----|--------|-------|------|-------------|
| SCR-HR-SET-001 | General HR Settings | `/hr/settings` | SET | Company Admin |
| SCR-HR-SET-002 | Attendance Settings | `/hr/settings/attendance` | SET | `hr.attendance.device.manage` |
| SCR-HR-SET-003 | Leave Settings | `/hr/settings/leave` | SET | `hr.leave.policy.manage` |
| SCR-PAY-SET-001 | Payroll Settings | `/payroll/settings` | SET | `payroll.tax.manage` |
| SCR-HR-SET-004 | Overtime Settings | `/hr/settings/overtime` | SET | `hr.shift.manage` |
| SCR-PAY-SET-002 | Loan Settings | `/payroll/settings/loans` | SET | `payroll.loan.approve` |
| SCR-HR-SET-005 | Performance Settings | `/hr/settings/performance` | SET | `hr.performance.manage` |
| SCR-HR-SET-006 | Training Settings | `/hr/settings/training` | SET | `hr.training.program.manage` |
| SCR-HR-SET-007 | Asset Settings | `/hr/settings/assets` | SET | `hr.asset.create` |
| SCR-COR-SET-001 | Notification Settings | `/settings/notifications` | SET | Authenticated |
| SCR-COR-SET-002 | Permission Settings | `/control-center/permissions` | SET | `core.role.manage` |

---

# AI Assistant Screens

| ID | Screen | Route | Type | View |
|----|--------|-------|------|------|
| SCR-AI-HR-001 | AI Dashboard | `/hr/ai` | AI | `ai.access` |
| SCR-AI-HR-002 | AI Insights | `/hr/ai/insights` | AI | `ai.access` |
| SCR-AI-HR-003 | Attendance Insights | `/hr/ai/attendance` | AI | `ai.access` + `hr.attendance.view` |
| SCR-AI-HR-004 | Payroll Insights | `/hr/ai/payroll` | AI | `ai.access` + `payroll.run.view` |
| SCR-AI-HR-005 | Performance Insights | `/hr/ai/performance` | AI | `ai.access` + `hr.performance.manage` |
| SCR-AI-HR-006 | Attrition Risk | `/hr/ai/attrition` | AI | `ai.access` + `hr.report.employee.view` |
| SCR-AI-HR-007 | Promotion Suggestions | `/hr/ai/promotions` | AI | `ai.access` + `hr.promotion.recommend` |
| SCR-AI-HR-008 | AI Chat Interface | Global panel `Ctrl+J` | DRW | `ai.chat` |
| SCR-AI-HR-009 | AI Actions History | `/hr/ai/history` | LST | `ai.audit.view` |

---

# Global Components

| ID | Component | Used on | Type |
|----|-----------|---------|------|
| SCR-GLO-CMP-001 | Employee View Drawer | `/hr/employees` | DRW |
| SCR-GLO-CMP-002 | Employee Form Drawer | `/hr/employees` | DRW |
| SCR-GLO-CMP-003 | Payroll Run Workbench Drawer | `/payroll/runs` | DRW |
| SCR-GLO-CMP-004 | Leave Request Drawer | `/hr/leave/requests` | DRW |
| SCR-GLO-CMP-005 | Global Activity Drawer | All HR grids | DRW |
| SCR-GLO-CMP-006 | Approval Action Modal | Approval screens | MDL |
| SCR-GLO-CMP-007 | Terminate Employee Modal | Employee profile | MDL |
| SCR-GLO-CMP-008 | Payroll Lock Confirm Modal | Payroll run | MDL |
| SCR-GLO-CMP-009 | Import Wizard Shell | Attendance, employees | WIZ |
| SCR-GLO-CMP-010 | Export Wizard Shell | Reports, payroll | WIZ |
| SCR-GLO-CMP-011 | Bulk Action Panel | List selections | MDL |
| SCR-GLO-CMP-012 | Quick View Card | Mobile employee list | DRW |
| SCR-GLO-CMP-013 | AI Assistant Panel | Global header | DRW |
| SCR-GLO-CMP-014 | Payslip PDF Preview | Payslip drawer | DRW |
| SCR-GLO-CMP-015 | Org Chart Canvas | Org chart screen | ANL |

---

# Wizard Inventory

| ID | Wizard | Entry route | Steps (summary) | Permissions |
|----|--------|-------------|-----------------|-------------|
| SCR-WIZ-001 | Employee Onboarding | `/hr/employees?onboard={id}` | Contact → Employment → Docs → Payroll → Activate | `hr.employee.create` |
| SCR-WIZ-002 | Attendance Import | `/hr/attendance?import=1` | Upload → Map → Validate → Commit | `hr.attendance.import` |
| SCR-WIZ-003 | Payroll Processing | `/payroll/runs?view={id}&tab=process` | Gather → Calculate → Review → Approve | `payroll.run.calculate` |
| SCR-WIZ-004 | Loan Approval | `/payroll/loans?view={id}&approve=1` | Review → Manager → HR → Finance | `payroll.loan.approve` |
| SCR-WIZ-005 | Promotion | `/hr/performance/promotions?create=1` | Recommend → Review → Salary link | `hr.promotion.recommend` |
| SCR-WIZ-006 | Transfer | `/hr/employees?transfer={id}` | Target dept/branch → Effective date → Confirm | `hr.employee.transfer` |
| SCR-WIZ-007 | Exit Clearance | `/hr/employees?view={id}&exit=1` | Resignation → Clearance → F&F | `hr.employee.terminate` |
| SCR-WIZ-008 | Asset Assignment | `/hr/assets/assignments?create=1` | Asset → Employee → Condition | `hr.asset.assign` |
| SCR-WIZ-009 | Payroll Reopen | `/payroll/runs?view={id}&reopen=1` | Reason → Finance approve | `payroll.run.reopen` |
| SCR-WIZ-010 | Hiring | `/hr/recruitment?hire={id}` | Offer confirm → Employee create | `hr.hiring.approve` |
| SCR-WIZ-011 | Employee Merge | `/hr/employees?merge=1` | Select duplicates → Merge | `hr.employee.edit` |
| SCR-WIZ-012 | Payroll Bank Export | `/payroll/export` | Select run → Format → Download | `payroll.bank_export` |

---

# Report Inventory Summary

| Class | Count | Examples |
|-------|------:|----------|
| **Operational** | 18 | Daily attendance, leave balance, payslip summary |
| **Management** | 12 | Headcount, absenteeism, cost by dept |
| **Executive** | 4 | Executive dashboard, payroll cost trends |
| **Compliance** | 8 | Muster roll, tax, audit export, statutory pack |
| **AI** | 3 | Attrition risk, attendance anomaly, payroll validation |

**Total registered report screens:** 45

---

# Permission Mapping Summary

### Role → primary screens

| Role | Primary screen access |
|------|----------------------|
| **Super Admin / Company Admin** | All HR + Payroll + Settings |
| **HR Director / HR Manager** | Full HR; payroll view; reports |
| **HR Executive** | Employees, attendance, leave, recruitment ops |
| **Payroll Manager** | Full payroll; employee salary tabs |
| **Payroll Executive** | Payroll processing; no approve/post |
| **Department Manager** | Team leave/OT; team attendance view; approvals |
| **Team Leader** | Direct reports — limited |
| **Employee** | ESS screens only |
| **Auditor** | Reports + audit viewer; read-only |
| **Recruitment Manager** | Recruitment domain |
| **Trainer** | Training domain |

### Sensitive screen gates

| Screen | Additional permission |
|--------|----------------------|
| Salary Profile tab | `hr.sensitive.view` |
| Bank fields | `hr.sensitive.view` |
| Payroll lock/reopen | `payroll.run.lock` / `payroll.run.reopen` |
| Bank export | `payroll.bank_export` |
| Audit log viewer | `hr.audit.export` |

---

# QA & Traceability

| Artifact | Links from screen ID |
|----------|---------------------|
| **Figma frame** | `SCR-HR-EMP-001` → frame name |
| **Test case** | `TC-SCR-HR-EMP-001` |
| **API endpoint** | `GET /api/v1/hr/employees` (future API.md) |
| **E2E path** | Nav → Employees → List loads |

---

# Cross-Reference Index

| Document | Relationship |
|----------|--------------|
| [HR_UI_UX_BLUEPRINT.md](./HR_UI_UX_BLUEPRINT.md) | Layout and UX per screen |
| [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md) | Permission keys |
| [HR_WORKFLOW_ARCHITECTURE.md](./HR_WORKFLOW_ARCHITECTURE.md) | Wizards and approval flows |
| [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md) | Route namespace |
| [HR_ACTIVITY_LOG_ARCHITECTURE.md](./HR_ACTIVITY_LOG_ARCHITECTURE.md) | Timeline screens |
| Future `HR_PAYROLL_UI_BUILD_GUIDE.md` | Build phases per screen group |
| Future `API.md` | Endpoint per list screen |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll |
| **Owner** | Platform / HR domain |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Total screen IDs** | 280+ |

---

**AgainERP HR & Payroll Screen Inventory** — master navigation and screen registry. No screen omitted. No code.
