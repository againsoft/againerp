# HR & Payroll — Figma Screen Map

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll — Figma Planning & Screen Registry  
> **Document Type:** Figma Page Map · Screen Registry · UI/UX Inventory  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../HR_FIGMA_WIREFRAME_BLUEPRINT.md) · [HR_SCREEN_INVENTORY.md](../HR_SCREEN_INVENTORY.md) · [../../design-system/HR_DESIGN_SYSTEM_SPECIFICATION.md](../../../design-system/HR_DESIGN_SYSTEM_SPECIFICATION.md)  
> **Governance:** [UI_UX_DESIGN_STANDARDS.md](../../../ui-ux/UI_UX_DESIGN_STANDARDS.md) · [PROJECT_COMMON_RULES.md](../../../PROJECT_COMMON_RULES.md)

**No frontend code. No CSS. No visual mockups.**  
Complete **Figma page map, screen registry, and UI inventory** for AgainERP HR & Payroll. Foundation for Figma library structure, wireframes, hi-fi design, frontend scope, QA traceability, and product planning.

**Figma project (recommended):** `AgainERP — HR & Payroll`  
**Frame naming:** `SCR-{ID} · {Screen Title}` · **Linked library:** `AgainERP — Core Shell` · `AgainERP — Design System`

**Authoritative registry:** [HR_SCREEN_INVENTORY.md](../HR_SCREEN_INVENTORY.md) — this document adds **Figma page placement**, **classification**, **priority**, and **handoff mapping**.

---

## Executive Summary

| Metric | Count |
|--------|------:|
| **Figma pages (sections)** | 24 |
| **Registered screen IDs (`SCR-*`)** | 280+ |
| **Report screens** | 45 |
| **Wizards** | 12 |
| **Global overlays** | 15 |
| **ESS screens** | 11 (+ 6 planned) |
| **AI screens** | 9 (+ workspace planned) |
| **Core shared screens** | 20+ |

---

# Screen Mapping Philosophy

### Core belief

> **Every navigable surface has exactly one SCR-ID, one Figma frame (minimum), and one QA test anchor.**

| Principle | Rule |
|-----------|------|
| **Completeness** | Nav item · workflow step · drawer mode = inventory row |
| **No orphan frames** | Figma frame without SCR-ID is forbidden |
| **Drawer-not-page** | Create/View/Edit = overlay frames on list page, not separate routes |
| **Tab = sub-frame** | Profile tabs are child frames under parent SCR-ID |
| **Platform shell** | Use shared Core Shell component — do not redraw per module |
| **Mobile parity** | P0/P1 flows have `375px` companion frame |
| **States** | Default · Loading · Empty · Error · Permission-hidden annotations |
| **Traceability** | SCR-ID → Figma → API → TC → Permission |

### Hierarchy

```text
Figma File → Page (domain) → Section → Frame (SCR-*) → Variant (state | mobile | tab)
```

---

# Figma Organization Strategy

### File structure (24 pages)

Maps to [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../HR_FIGMA_WIREFRAME_BLUEPRINT.md) with extensions from uiux architecture docs.

| Page # | Figma page name | Primary content |
|--------|-----------------|-----------------|
| **01** | Foundations | Grayscale tokens reference (link DS lib) |
| **02** | Design System | `DS/*` components — [HR_DESIGN_SYSTEM_SPECIFICATION.md](../../../design-system/HR_DESIGN_SYSTEM_SPECIFICATION.md) |
| **03** | Navigation | Shell, sidebar, breadcrumbs, command palette |
| **04** | Dashboards | All `DSH-*` templates · zones A–H |
| **05** | Employee Management | Directory, profile, tabs, modals |
| **06** | Organization | Dept, teams, chart |
| **07** | Recruitment | Pipeline, candidates, offers |
| **08** | Attendance | Daily, calendar, devices |
| **09** | Shifts | Shifts, rotations, assignments |
| **10** | Leave | Requests, balances, policies |
| **11** | Payroll | Runs, structures, payslips, compliance |
| **12** | Overtime | Requests, policies |
| **13** | Loans & Advances | Loans, advances, recovery |
| **14** | Performance | Goals, reviews, promotions |
| **15** | Training | Programs, sessions, certs |
| **16** | Assets | Inventory, assignments |
| **17** | Documents | Center, expiry, contracts |
| **18** | Reports | Report center + slug pages |
| **19** | Approval Center | Inbox, detail workspace |
| **20** | Activity Timeline | Global drawer, entity timelines |
| **21** | ESS Portal | Admin + mobile ESS |
| **22** | AI Assistant | Hub, panel, insights |
| **23** | Mobile Experience | Mobile-only frames collection |
| **24** | Prototypes | Connected flows |

### Frame annotation template (sticky)

```text
SCR-ID: SCR-HR-EMP-001
Route: /hr/employees
Type: LST
Permission: hr.employee.view
API: GET /api/v1/hr/employees
Query variants: ?create=1 | ?view={id} | ?edit={id}
States: default | loading | empty | error
Mobile: SCR-HR-EMP-001-M
```

---

# Screen Classification Strategy

| Class | Code | Figma treatment | Examples |
|-------|------|-----------------|----------|
| **Dashboard** | `MOD` | `TPL/Dashboard` · 12-col grid | HR, Payroll, Attendance |
| **List** | `LST` | Table + filter bar | Employees, leave requests |
| **Details** | `DTL` | Drawer `?view={id}` | Employee view, payslip |
| **Form / Create** | `CRT` | Drawer `?create=1` | New employee |
| **Form / Edit** | `EDT` | Drawer `?edit={id}` | Edit department |
| **Analytics** | `ANL` | Charts + KPIs | `/analytics`, executive |
| **Approval** | `APR` | Inbox list + workspace | Pending approvals |
| **AI** | `AI` | Hub + insight centers | `/hr/ai/*` |
| **Mobile** | `MOB` | `375px` frame suffix `-M` | ESS, approvals |
| **Wizard** | `WIZ` | Stepper overlay | Payroll process, onboarding |
| **Report** | `RPT` | Filter + output | `/hr/reports/{slug}` |
| **Timeline** | `TML` | Vertical stream | Employee timeline |
| **Settings** | `SET` | Sectioned form | Leave policies |
| **Overlay** | `DRW`/`MDL` | Component page 16 or in-context | Global drawers |

---

# Responsive Planning Strategy

| Breakpoint | Width | Figma frame |
|------------|-------|-------------|
| **Mobile** | 375px | `*-M` suffix · ESS mandatory |
| **Tablet** | 768px | `*-T` for P1 dashboards |
| **Desktop** | 1440px | Default admin frames |
| **Wide** | 1920px | Optional payroll workbench |

**Rules:** Lists → cards on mobile · Drawers → full-width sheet · Dashboard zones stack · Payroll workbench desktop-only (mobile status frame only)

---

# 01–02 Foundations & Design System

| Figma asset | Source doc |
|-------------|------------|
| Color / type / space tokens | [design-system.md](../../../ui-ux/design-system.md) |
| Component specs | [HR_DESIGN_SYSTEM_SPECIFICATION.md](../../../design-system/HR_DESIGN_SYSTEM_SPECIFICATION.md) |
| Status badges | [status-system.md](../../../ui-ux/status-system.md) |
| Wireframe atoms `WF/*` | [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../HR_FIGMA_WIREFRAME_BLUEPRINT.md) |

---

# 03 Navigation

| SCR-ID | Screen | Route | Figma page |
|--------|--------|-------|------------|
| — | App Shell Desktop | Global | 03 · `TPL/Shell Desktop` |
| — | App Shell Mobile | Global | 03 · `TPL/Shell Mobile` |
| — | Command Palette | `Ctrl+K` | 03 · overlay |
| SCR-COR-NTF-000 | Notification Bell Popover | Header | 03 · component |
| NAV-* | Sidebar trees | Per [HR_NAVIGATION_ARCHITECTURE.md](./HR_NAVIGATION_ARCHITECTURE.md) | 03 · annotated |

---

# 04 Dashboard Screen Map

| SCR-ID | Screen | Route | Template | Figma page |
|--------|--------|-------|----------|------------|
| SCR-HR-DSH-001 | HR Dashboard | `/hr` | `DSH-HR-001` | 04 |
| SCR-HR-DSH-002 | Attendance Dashboard | `/hr/attendance` | `DSH-ATT-001` | 04 · 08 |
| SCR-HR-DSH-003 | Leave Dashboard | `/hr/leave` | `DSH-LEV-001` | 04 · 10 |
| SCR-PAY-DSH-001 | Payroll Dashboard | `/payroll` | `DSH-PAY-001` | 04 · 11 |
| SCR-HR-DSH-004 | Recruitment Dashboard | `/hr/recruitment` | `DSH-REC-001` | 04 · 07 |
| SCR-HR-DSH-005 | Performance Dashboard | `/hr/performance` | `DSH-PRF-001` | 04 · 14 |
| SCR-HR-DSH-006 | Training Dashboard | `/hr/training` | `DSH-TRN-001` | 04 · 15 |
| SCR-HR-DSH-007 | Asset Dashboard | `/hr/assets` | `DSH-AST-001` | 04 · 16 |
| SCR-HR-DSH-008 | Executive Dashboard | `/hr/executive` | `DSH-EXE-001` | 04 |
| SCR-ESS-DSH-001 | Employee Dashboard (ESS) | `/ess` | `DSH-ESS-001` | 04 · 21 · 23 |
| SCR-HR-OVT-001 | Overtime Dashboard | `/hr/overtime` | `DSH-OVT-001` | 04 · 12 |
| SCR-PAY-LON-001 | Loan Dashboard | `/payroll/loans` | `DSH-LON-001` | 04 · 13 |
| SCR-HR-DOC-001 | Document Center Hub | `/hr/documents` | `DSH-DOC-001` | 04 · 17 |
| SCR-HR-RPT-000 | HR Report Center | `/hr/reports` | `DSH-RPT-001` | 04 · 18 |
| SCR-PAY-RPT-000 | Payroll Report Center | `/payroll/reports` | `DSH-RPT-001` | 04 · 18 |
| SCR-COR-APR-001 | Approval Dashboard | `/inbox/approvals` | `DSH-APR-001` | 04 · 19 |
| SCR-AI-HR-001 | AI Dashboard | `/hr/ai` | `DSH-AI-001` | 04 · 22 |

---

# 05 Employee Management Screens

**Figma page:** 05 · **Parent list:** `SCR-HR-EMP-001`

| SCR-ID | Screen | Route / pattern | Type | Sub-frame |
|--------|--------|-----------------|------|-----------|
| SCR-HR-EMP-001 | Employee Directory (List) | `/hr/employees` | LST | Page root |
| SCR-HR-EMP-002 | Employee Create | `?create=1` | DRW/CRT | Overlay on 001 |
| SCR-HR-EMP-003 | Employee Edit | `?edit={id}` | DRW/EDT | Overlay on 001 |
| SCR-HR-EMP-004 | Employee Details (shell) | `?view={id}` | DRW/DTL | Drawer shell |
| SCR-HR-EMP-004-T01 | Tab: Overview | `&tab=overview` | TAB | Child of 004 |
| SCR-HR-EMP-004-T02 | Tab: Personal | `&tab=personal` | TAB | Child of 004 |
| SCR-HR-EMP-004-T03 | Tab: Employment | `&tab=employment` | TAB | Child of 004 |
| SCR-HR-EMP-009 | Tab: Compensation | `&tab=compensation` | TAB | `hr.sensitive.view` |
| SCR-HR-EMP-010 | Tab: Attendance | `&tab=attendance` | TAB/CAL | |
| SCR-HR-EMP-011 | Tab: Leave | `&tab=leave` | TAB/LST | |
| SCR-HR-EMP-012 | Tab: Payroll | `&tab=payroll` | TAB/LST | |
| SCR-HR-EMP-013 | Tab: Assets | `&tab=assets` | TAB/LST | |
| SCR-HR-EMP-014 | Tab: Performance | `&tab=performance` | TAB/LST | |
| SCR-HR-EMP-015 | Tab: Training | `&tab=training` | TAB/LST | |
| SCR-HR-EMP-008 | Tab: Documents | `&tab=documents` | TAB | |
| SCR-HR-EMP-007 | Tab: Notes | `&tab=notes` | TAB | |
| SCR-HR-EMP-005 | Tab: Activity Timeline | `&tab=timeline` | TML | Zone E |
| SCR-HR-EMP-006 | Tab: Audit History | `&tab=audit` | TML | Audit view |
| SCR-HR-EMP-016 | Tab: Exit | `&tab=exit` | DTL | |
| SCR-HR-EMP-017 | Employee Archive | `?status=archived` | LST | Filter variant 001 |
| SCR-WIZ-001 | Employee Onboarding Wizard | `?onboard={id}` | WIZ | Page 05 · 24 |
| SCR-WIZ-007 | Exit Clearance Wizard | `&exit=1` | WIZ | Page 24 |
| SCR-WIZ-011 | Employee Merge Wizard | `?merge=1` | WIZ | SCR-HR-EMP-018 |

**Modals (page 05 + 16):** `SCR-HR-EMP-M01` Terminate · `M02` Transfer · `M03` Promote

---

# 06 Organization Screens

| SCR-ID | Screen | Route | Type |
|--------|--------|-------|------|
| SCR-HR-ORG-001 | Organization Hub | `/hr/organization` | MOD |
| SCR-COR-ORG-001 | Companies | `/settings/business` | LST |
| SCR-COR-ORG-002 | Branches | `/settings/localisation/store-locations` | LST |
| SCR-HR-ORG-002 | Locations | `/hr/organization/locations` | LST + drawers |
| SCR-HR-ORG-003 | Departments | `/hr/organization/departments` | LST + drawers |
| SCR-HR-ORG-004 | Teams | `/hr/organization/teams` | LST + drawers |
| SCR-HR-ORG-005 | Designations | `/hr/organization/designations` | LST + drawers |
| SCR-HR-ORG-006 | Employment Types | `/hr/organization/employment-types` | LST + drawers |
| SCR-HR-ORG-007 | Reporting Structure | `/hr/organization/reporting` | LST |
| SCR-HR-ORG-008 | Organization Chart | `/hr/organization/chart` | ANL · `SCR-GLO-CMP-015` |
| SCR-WIZ-006 | Transfer Wizard | `?transfer={id}` | WIZ |

---

# 07 Recruitment Screens

| SCR-ID | Screen | Route | Type |
|--------|--------|-------|------|
| SCR-HR-REC-008 | Hiring Pipeline (Kanban) | `/hr/recruitment` | KBN |
| SCR-HR-REC-001 | Job Requisitions List | `/hr/recruitment/requisitions` | LST |
| SCR-HR-REC-002 | Requisition Details | `?view={id}` | DRW/DTL |
| SCR-HR-REC-003 | Requisition Create | `?create=1` | DRW/CRT |
| SCR-HR-REC-004 | Candidate List | `/hr/recruitment/candidates` | LST |
| SCR-HR-REC-005 | Candidate Details | `?view={id}` | DRW/DTL |
| SCR-HR-REC-006 | Candidate Timeline | `&tab=timeline` | TML |
| SCR-HR-REC-007 | Interview Calendar | `/hr/recruitment/interviews` | CAL |
| SCR-HR-REC-009 | Interview Evaluation | `&tab=evaluation` | DRW |
| SCR-HR-REC-010 | Offer Management | `&tab=offer` | DRW |
| SCR-WIZ-010 | Hiring Wizard | `?hire={id}` | WIZ |
| SCR-HR-REC-012 | Recruitment Analytics | `/hr/reports/recruitment` | RPT/ANL |

*User alias "Positions" → Requisitions (`SCR-HR-REC-001`–`003`)*

---

# 08 Attendance Screens

| SCR-ID | Screen | Route | Type |
|--------|--------|-------|------|
| SCR-HR-ATT-001 | Attendance Dashboard | `/hr/attendance` | MOD |
| SCR-HR-ATT-002 | Daily Attendance | `/hr/attendance/daily` | LST |
| SCR-HR-ATT-003 | Monthly Attendance | `/hr/attendance/monthly` | LST |
| SCR-HR-ATT-004 | Attendance Calendar | `/hr/attendance/calendar` | CAL |
| SCR-HR-ATT-005 | Attendance Timeline | `/hr/attendance/timeline` | TML |
| SCR-HR-ATT-006 | Attendance Corrections | `/hr/attendance/corrections` | LST |
| SCR-HR-ATT-007 | Correction Approval Queue | `?status=pending` | LST/APR |
| SCR-HR-ATT-008 | Attendance Analytics | `/hr/attendance/analytics` | ANL |
| SCR-HR-ATT-009 | Device List | `/hr/settings/devices` | LST |
| SCR-HR-ATT-010 | Device Details | `?view={id}` | DRW/DTL |
| SCR-HR-ATT-011 | Biometric Sync Logs | `/hr/attendance/devices/logs` | LST |
| SCR-WIZ-002 | Attendance Import | `?import=1` | WIZ |
| SCR-HR-ATT-013 | Attendance Export | `?export=1` | WIZ |

**Reports (page 18):** `SCR-HR-RPT-010`–`014` daily register, muster, late, absenteeism, OT summary

---

# 09 Shift Screens

| SCR-ID | Screen | Route | Type |
|--------|--------|-------|------|
| SCR-HR-SHF-001 | Shift List | `/hr/shifts` | LST |
| SCR-HR-SHF-002 | Shift Details | `?view={id}` | DRW/DTL |
| SCR-HR-SHF-003 | Shift Create | `?create=1` | DRW/CRT |
| SCR-HR-SHF-004 | Shift Calendar | `/hr/shifts/calendar` | CAL |
| SCR-HR-SHF-005 | Shift Assignments | `/hr/shifts/assignments` | LST |
| SCR-HR-SHF-006 | Shift Rotation Planner | `/hr/shifts/rotations` | WIZ |
| SCR-HR-SHF-007 | Shift Conflicts | `/hr/shifts/conflicts` | LST |
| SCR-HR-SHF-008 | Shift Policies | `/hr/settings/shifts` | SET |
| SCR-HR-SHF-009 | Shift Analytics | `/hr/reports/shift-*` | ANL · *planned report slug* |

---

# 10 Leave Screens

| SCR-ID | Screen | Route | Type |
|--------|--------|-------|------|
| SCR-HR-LEV-001 | Leave Dashboard | `/hr/leave` | MOD |
| SCR-HR-LEV-002 | Leave Requests | `/hr/leave/requests` | LST |
| SCR-HR-LEV-002-CRT | Leave Application (Create) | `?create=1` on requests | DRW/CRT | Overlay on 002 |
| SCR-HR-LEV-003 | Leave Request Details | `?view={id}` | DRW/DTL |
| SCR-HR-LEV-004 | Leave Calendar | `/hr/leave/calendar` | CAL |
| SCR-HR-LEV-005 | Leave Balances | `/hr/leave/balances` | LST |
| SCR-HR-LEV-006 | Leave Approval Queue | `?status=pending` | LST/APR |
| SCR-HR-LEV-007 | Leave Policies | `/hr/settings/leave` | SET |
| SCR-HR-LEV-008 | Leave Accrual Rules | `/hr/settings/leave/accrual` | SET |
| SCR-HR-LEV-009 | Leave Encashments | `/hr/leave/encashment` | LST |
| SCR-HR-LEV-010 | Holiday Calendar | `/hr/settings/holidays` | CAL |
| SCR-HR-LEV-011 | Leave Analytics | `/hr/leave/analytics` | ANL · *planned* |
| SCR-HR-RPT-020 | Leave Balance Report | `/hr/reports/leave-balance` | RPT |
| SCR-HR-RPT-021 | Leave Taken Report | `/hr/reports/leave-taken` | RPT |
| SCR-HR-RPT-022 | Leave Encashment Report | `/hr/reports/leave-encashment` | RPT |

**Drawer:** `SCR-GLO-CMP-004` Leave Request Drawer

---

# 11 Payroll Screens

| SCR-ID | Screen | Route | Type | Notes |
|--------|--------|-------|------|-------|
| SCR-PAY-DSH-001 | Payroll Dashboard | `/payroll` | MOD | |
| SCR-PAY-CAL-001 | Payroll Calendar | `/payroll/calendar` | CAL | *planned* |
| SCR-PAY-PRD-001 | Payroll Periods | `/payroll/periods` | LST | |
| SCR-PAY-PRD-002 | Period Details | `?view={id}` | DRW/DTL | *logical on PRD-001* |
| SCR-PAY-RUN-001 | Payroll Batch List | `/payroll/runs` | LST | |
| SCR-PAY-RUN-002 | Batch Details | `?view={id}` | DRW/DTL | |
| SCR-PAY-RUN-003 | Payroll Processing Workbench | `&tab=process` | WIZ | **P0 critical** |
| SCR-PAY-VAL-001 | Payroll Validation (Step 7) | embedded in RUN-003 | WIZ | Sub-frame |
| SCR-PAY-RUN-004 | Payroll Approval Queue | `?status=pending` | LST/APR | |
| SCR-PAY-RUN-005 | Payroll Lock Modal | `&action=lock` | MDL | |
| SCR-WIZ-009 | Payroll Reopen Wizard | `&reopen=1` | WIZ | |
| SCR-PAY-PSL-001 | Payslip List | `/payroll/payslips` | LST | |
| SCR-PAY-PSL-002 | Payslip Details + PDF | `?view={id}` | DRW/DTL | `SCR-GLO-CMP-014` |
| SCR-PAY-STR-001 | Salary Structures | `/payroll/structures` | LST | |
| SCR-PAY-STR-002 | Salary Components | `/payroll/structures/components` | LST | |
| SCR-PAY-STR-003 | Allowances | `/payroll/structures/allowances` | LST | |
| SCR-PAY-STR-004 | Deductions | `/payroll/structures/deductions` | LST | |
| SCR-PAY-STR-006 | Benefits | `/payroll/structures/benefits` | LST | |
| SCR-PAY-STR-005 | Tax Rules | `/payroll/settings/tax` | SET | |
| SCR-PAY-BON-001 | Bonus Management | `/payroll/bonuses` | LST | |
| SCR-PAY-COM-001 | Commission Management | `/payroll/commissions` | LST | |
| SCR-PAY-REV-001 | Salary Revisions | `/payroll/salary-revisions` | LST | |
| SCR-PAY-EXP-001 | Bank Export Wizard | `/payroll/export` | WIZ | |
| SCR-PAY-CMP-001 | Compliance Center | `/payroll/compliance` | MOD | *planned* |
| SCR-PAY-ANL-001 | Payroll Analytics | `/payroll/analytics` | ANL | |
| SCR-PAY-ACT-001 | Payroll Run Timeline | `&tab=history` | TML | |
| SCR-PAY-RPT-001 | Salary Register | `/payroll/reports/salary-register` | RPT | |
| SCR-PAY-RPT-002 | Payslip Summary | `payslip-summary` | RPT | |
| SCR-PAY-RPT-003 | Component-wise Salary | `component-wise` | RPT | |
| SCR-PAY-RPT-004 | Bank Transfer Sheet | `bank-sheet` | RPT | |
| SCR-PAY-RPT-005 | Tax Deduction Report | `tax-deduction` | RPT | |
| SCR-PAY-RPT-006 | YTD Earnings | `ytd-earnings` | RPT | |
| SCR-PAY-RPT-007 | Cost by Department | `cost-by-dept` | RPT | |

**Workbench drawer:** `SCR-GLO-CMP-003` · **Lock modal:** `SCR-GLO-CMP-008`

---

# 12 Overtime Screens

| SCR-ID | Screen | Route | Type |
|--------|--------|-------|------|
| SCR-HR-OVT-001 | Overtime Dashboard | `/hr/overtime` | MOD |
| SCR-HR-OVT-002 | Overtime Requests | `/hr/overtime/requests` | LST |
| SCR-HR-OVT-003 | Overtime Approvals | `?status=pending` | LST/APR |
| SCR-HR-OVT-004 | Overtime Policies | `/hr/settings/overtime` | SET |
| SCR-HR-OVT-005 | Overtime Calculations | `/hr/overtime/calculations` | LST |
| SCR-HR-OVT-006 | Overtime Analytics | `/hr/reports/overtime` | ANL |

---

# 13 Loans & Advances Screens

| SCR-ID | Screen | Route | Type |
|--------|--------|-------|------|
| SCR-PAY-LON-001 | Loan Dashboard | `/payroll/loans` | MOD |
| SCR-PAY-LON-002 | Loan Requests | `/payroll/loans/requests` | LST |
| SCR-PAY-LON-003 | Loan Details | `?view={id}` | DRW/DTL |
| SCR-PAY-LON-004 | Loan Approvals | `?status=pending` | LST/APR |
| SCR-PAY-LON-005 | Installments | `&tab=installments` | LST |
| SCR-PAY-ADV-001 | Advance Requests | `/payroll/advances` | LST |
| SCR-PAY-ADV-002 | Advance Approvals | `?status=pending` | LST/APR |
| SCR-PAY-ADV-003 | Recovery Tracking | `/payroll/advances/recovery` | LST |
| SCR-WIZ-004 | Loan Approval Wizard | `&approve=1` | WIZ |
| SCR-PAY-RPT-010 | Loan Outstanding | `/payroll/reports/loan-outstanding` | RPT |
| SCR-PAY-RPT-011 | Advance Recovery | `/payroll/reports/advance-recovery` | RPT |

---

# 14 Performance Screens

| SCR-ID | Screen | Route | Type |
|--------|--------|-------|------|
| SCR-HR-PRF-001 | Performance Dashboard | `/hr/performance` | MOD |
| SCR-HR-PRF-002 | Goals | `/hr/performance/goals` | LST |
| SCR-HR-PRF-002-D | Goal Details | `?view={id}` | DRW/DTL · *sub* |
| SCR-HR-PRF-003 | KPIs | `/hr/performance/kpis` | LST |
| SCR-HR-PRF-004 | KRAs | `/hr/performance/kras` | LST |
| SCR-HR-PRF-005 | Review Cycles | `/hr/performance/cycles` | LST |
| SCR-HR-PRF-006 | Self Reviews | `/hr/performance/self-reviews` | LST |
| SCR-HR-PRF-007 | Manager Reviews | `/hr/performance/manager-reviews` | LST |
| SCR-HR-PRF-008 | Final Reviews | `/hr/performance/final-reviews` | LST |
| SCR-HR-PRF-009 | Promotion Recommendations | `/hr/performance/promotions` | LST |
| SCR-WIZ-005 | Promotion Wizard | `?create=1` | WIZ |
| SCR-HR-PRF-010 | Performance Analytics | `/hr/reports/performance` | ANL |

---

# 15 Training Screens

| SCR-ID | Screen | Route | Type |
|--------|--------|-------|------|
| SCR-HR-TRN-001 | Training Dashboard | `/hr/training` | MOD |
| SCR-HR-TRN-002 | Training Programs | `/hr/training/programs` | LST |
| SCR-HR-TRN-002-D | Program Details | `?view={id}` | DRW/DTL |
| SCR-HR-TRN-003 | Training Sessions | `/hr/training/sessions` | LST |
| SCR-HR-TRN-003-D | Session Details | `?view={id}` | DRW/DTL |
| SCR-HR-TRN-004 | Participants | `/hr/training/participants` | LST |
| SCR-HR-TRN-005 | Training Attendance | `/hr/training/attendance` | LST |
| SCR-HR-TRN-006 | Certificates | `/hr/training/certificates` | LST |
| SCR-HR-TRN-007 | Evaluations | `/hr/training/evaluations` | LST |
| SCR-HR-TRN-008 | Training Analytics | `/hr/reports/training` | ANL |
| SCR-HR-TRN-009 | Skill Matrix | `/hr/training/skills` | ANL · *planned* |
| SCR-WIZ-008 | Asset Assignment Wizard | overlaps page 16 | WIZ |

---

# 16 Asset Screens

| SCR-ID | Screen | Route | Type |
|--------|--------|-------|------|
| SCR-HR-AST-001 | Asset Dashboard | `/hr/assets` | MOD |
| SCR-HR-AST-002 | Asset Inventory | `/hr/assets/inventory` | LST |
| SCR-HR-AST-003 | Asset Details | `?view={id}` | DRW/DTL |
| SCR-HR-AST-004 | Assignments | `/hr/assets/assignments` | LST |
| SCR-HR-AST-005 | Returns | `/hr/assets/returns` | LST |
| SCR-HR-AST-006 | Damage Reports | `/hr/assets/damages` | LST |
| SCR-HR-AST-007 | Replacement Requests | `/hr/assets/replacements` | LST |
| SCR-HR-AST-008 | Disposals | `/hr/assets/disposal` | LST |
| SCR-HR-AST-009 | Asset History | `&tab=history` | TML |
| SCR-HR-AST-010 | Asset Analytics | `/hr/reports/asset-custody` | ANL |
| SCR-WIZ-008 | Asset Assignment Wizard | `?create=1` | WIZ |

---

# 17 Document Screens

| SCR-ID | Screen | Route | Type |
|--------|--------|-------|------|
| SCR-HR-DOC-001 | Document Dashboard | `/hr/documents` | MOD |
| SCR-HR-DOC-002 | Document Types | `/hr/settings/document-types` | LST |
| SCR-HR-DOC-003 | Employee Documents | `/hr/documents/employees` | LST |
| SCR-HR-DOC-004 | Contracts | `/hr/documents/contracts` | LST |
| SCR-HR-DOC-005 | Expiry Tracker | `/hr/documents/expiry` | LST |
| SCR-HR-DOC-006 | Renewal Queue | `/hr/documents/renewals` | LST |
| SCR-HR-DOC-007 | Document Archive | `/hr/documents/archive` | LST |
| SCR-HR-RPT-040 | Compliance Pack | `/hr/reports/compliance-pack` | RPT |

---

# 18 Reporting Screens

### Report center shells

| SCR-ID | Screen | Route |
|--------|--------|-------|
| SCR-HR-RPT-000 | HR Report Center | `/hr/reports` |
| SCR-PAY-RPT-000 | Payroll Report Center | `/payroll/reports` |

### Full report registry (45 screens)

See [HR_SCREEN_INVENTORY.md](../HR_SCREEN_INVENTORY.md) § Reporting — every `SCR-HR-RPT-*` · `SCR-PAY-RPT-*` · `SCR-AI-RPT-001` gets one Figma frame on page **18**.

| Class | Count | Figma layout |
|-------|------:|--------------|
| Operational | 18 | `TPL/Report` filter + table |
| Management | 12 | + chart row |
| Executive | 4 | `DSH-EXE` style |
| Compliance | 8 | export CTA prominent |
| AI | 3 | disclaimer footer |

### Planned report UX (frames TBD)

| Planned ID | Screen | Phase |
|------------|--------|-------|
| SCR-HR-RPT-050 | Report Builder | P3 |
| SCR-HR-RPT-051 | Scheduled Reports | P3 |
| SCR-HR-RPT-052 | Analytics Center (global) | P2 |

### Travel & Expense (nav — register frames)

| Planned ID | Screen | Route | Phase |
|------------|--------|-------|-------|
| SCR-HR-TRV-001 | Travel Requests | `/hr/travel` | P2 |
| SCR-HR-EXP-001 | Expense Claims | `/hr/expenses` | P2 |

---

# 19 Approval Center Screens

**Figma page:** 19 · Ref: [HR_APPROVAL_CENTER_UI_ARCHITECTURE.md](./HR_APPROVAL_CENTER_UI_ARCHITECTURE.md)

| SCR-ID | Screen | Route | Type |
|--------|--------|-------|------|
| SCR-COR-APR-001 | Approval Dashboard | `/inbox/approvals` | MOD |
| SCR-COR-APR-002 | My Approvals / Pending | `?status=pending` | LST |
| SCR-COR-APR-003 | Approved | `?status=approved` | LST |
| SCR-COR-APR-004 | Rejected | `?status=rejected` | LST |
| SCR-COR-APR-005 | Escalated | `?status=escalated` | LST |
| SCR-COR-APR-008 | Delegated Queue | `?status=delegated` | LST · *planned* |
| SCR-COR-APR-009 | Team Approvals | `?scope=team` | LST · *planned* |
| SCR-COR-APR-006 | Approval History | `/inbox/approvals/history` | LST |
| SCR-COR-APR-007 | Approval Analytics | `/inbox/approvals/analytics` | ANL · *planned* |
| SCR-COR-APR-DTL | Approval Details Workspace | `?view={approval_id}` | DRW · `CMP-APR-WORKSPACE-001` |

**Views:** List · Kanban · Timeline — variants on page 19

**Domain queues (filter variants):** HR leave · Attendance correction · Payroll run · Loan · Performance

---

# 20 Activity Timeline Screens

**Figma page:** 20 · Ref: [HR_ACTIVITY_TIMELINE_UI_ARCHITECTURE.md](./HR_ACTIVITY_TIMELINE_UI_ARCHITECTURE.md)

| SCR-ID | Screen | Host route | Type |
|--------|--------|------------|------|
| SCR-COR-ACT-001 | Global Activity Drawer | Any list | DRW · `SCR-GLO-CMP-005` |
| SCR-HR-ACT-001 | Employee Activity Timeline | `&tab=activity` or `&tab=timeline` | TML |
| SCR-HR-EMP-005 | Employee Timeline Tab (profile) | `&tab=timeline` | TML | Child of EMP-004 |
| SCR-HR-ACT-002 | Attendance Timeline | `/hr/attendance/timeline` | TML |
| SCR-HR-ACT-003 | Audit Log Viewer | `/hr/reports/audit-export` | RPT/TML |
| SCR-PAY-ACT-001 | Payroll Run Timeline | `&tab=history` | TML |
| SCR-TML-LEV-001 | Leave Request Timeline | leave drawer tab | TML · *embedded* |
| SCR-TML-AI-001 | AI Timeline filter view | `/hr/ai/history` | TML · *planned* |

**Sub-frames per timeline:** Compact · Detailed · Audit · Grouped · AI Summary views

---

# 21 ESS Portal Screens

**Figma page:** 21 (+ mobile duplicates on 23)

| SCR-ID | Screen | Route | Type | Mobile frame |
|--------|--------|-------|------|--------------|
| SCR-ESS-DSH-001 | My Dashboard | `/ess` | MOD | ✓ |
| SCR-ESS-PRF-001 | My Profile | `/ess/profile` | DTL | ✓ |
| SCR-ESS-ATT-001 | My Attendance | `/ess/attendance` | CAL | ✓ |
| SCR-ESS-LEV-001 | My Leave | `/ess/leave` | LST | ✓ |
| SCR-ESS-PAY-001 | My Payslips | `/ess/payslips` | LST | ✓ |
| SCR-ESS-LON-001 | My Loans | `/ess/loans` | LST | P2 · ✓ |
| SCR-ESS-AST-001 | My Assets | `/ess/assets` | LST | ✓ |
| SCR-ESS-DOC-001 | My Documents | `/ess/documents` | LST | ✓ |
| SCR-ESS-TRN-001 | My Training | `/ess/training` | LST | ✓ |
| SCR-ESS-PRF-002 | My Performance | `/ess/performance` | LST | ✓ |
| SCR-ESS-REQ-001 | My Requests | `/ess/requests` | LST | ✓ |
| SCR-COR-NTF-001 | My Notifications | `/notifications` | LST | ✓ |
| SCR-ESS-MGR-001 | My Approvals | `/ess/approvals` | LST/APR | P1 · ✓ |
| SCR-ESS-MGR-002 | My Team | `/ess/team` | MOD | P2 · ✓ |
| SCR-ESS-ANN-001 | Announcements | `/ess/announcements` | LST | P2 |
| SCR-ESS-CAL-001 | Unified Calendar | `/ess/calendar` | CAL | P2 |
| SCR-ESS-AI-001 | ESS AI Hub | `/ess/ai` | AI | P2 |

**Shell template:** `TPL/ESS Portal` · Bottom nav 5 slots

---

# 22 AI Assistant Screens

**Figma page:** 22 · Ref: [HR_AI_ASSISTANT_UI_ARCHITECTURE.md](./HR_AI_ASSISTANT_UI_ARCHITECTURE.md)

| SCR-ID | Screen | Route | Type |
|--------|--------|-------|------|
| SCR-AI-HR-001 | AI Dashboard / Hub | `/hr/ai` | AI |
| SCR-AI-HR-008 | AI Chat Panel | `Ctrl+J` global | DRW · `SCR-GLO-CMP-013` |
| SCR-AI-HR-002 | AI Insights Center | `/hr/ai/insights` | AI |
| SCR-AI-HR-003 | Attendance Insights | `/hr/ai/attendance` | AI |
| SCR-AI-HR-004 | Payroll Insights | `/hr/ai/payroll` | AI |
| SCR-AI-HR-005 | Performance Insights | `/hr/ai/performance` | AI |
| SCR-AI-HR-006 | Attrition / Prediction Center | `/hr/ai/attrition` | AI |
| SCR-AI-HR-007 | Recommendation Center | `/hr/ai/promotions` | AI |
| SCR-AI-HR-009 | AI History | `/hr/ai/history` | LST |
| SCR-AI-HR-010 | AI Full Workspace | `/hr/ai/workspace` | AI · *planned* |
| SCR-AI-HR-011 | AI Automation Center | `/hr/ai/automation` | AI · *planned* |
| SCR-AI-RPT-001 | Attrition Risk Report | `/hr/reports/ai-attrition` | RPT |

**Sub-frames:** Insight card · Recommendation card · Explainability block · Command palette AI mode

---

# Global Modals Inventory

**Figma page:** 16 · Global Modals & Drawers section

| ID | Modal | Trigger | Domain |
|----|-------|---------|--------|
| SCR-GLO-CMP-006 | Approval Action (approve/reject) | Approval bar | Core |
| SCR-GLO-CMP-007 | Terminate Employee | Profile action | HR |
| SCR-GLO-CMP-008 | Payroll Lock Confirm | Run workbench | Payroll |
| SCR-GLO-CMP-011 | Bulk Action Panel | List selection | Core |
| SCR-HR-EMP-M01 | Terminate Confirm | Employee | HR |
| SCR-HR-EMP-M02 | Transfer Confirm | Employee | HR |
| SCR-HR-EMP-M03 | Promote Confirm | Employee | HR |
| SCR-MDL-LEV-001 | Leave Cancel Confirm | Leave drawer | Leave |
| SCR-MDL-PAY-001 | Salary Revision Confirm | Payroll | Payroll |
| SCR-MDL-AI-001 | AI Recommendation Apply | AI panel | AI |
| SCR-MDL-AST-001 | Asset Dispose Confirm | Assets | Assets |
| SCR-MDL-GEN-001 | Unsaved Changes | Forms | Core |
| SCR-MDL-GEN-002 | Delete Confirm | Lists | Core |
| SCR-MDL-GEN-003 | Export Confirm | Reports | Core |

---

# Global Drawers Inventory

| ID | Drawer | Route pattern | Width |
|----|--------|---------------|-------|
| SCR-GLO-CMP-001 | Employee View Drawer | `?view={id}` | `max-w-5xl` |
| SCR-GLO-CMP-002 | Employee Form Drawer | `?create` / `?edit` | `max-w-5xl` |
| SCR-GLO-CMP-003 | Payroll Workbench | `&tab=process` | `max-w-6xl` |
| SCR-GLO-CMP-004 | Leave Request | leave list | `max-w-lg` |
| SCR-GLO-CMP-005 | Global Activity | activity trigger | 480px |
| SCR-GLO-CMP-013 | AI Assistant Panel | `Ctrl+J` | 400px |
| SCR-GLO-CMP-014 | Payslip PDF Preview | payslip view | full mobile |
| SCR-GLO-CMP-012 | Quick View Card | mobile lists | full width |
| DRW-APR-001 | Quick Approval Drawer | inbox `?view=` | 896px |
| DRW-ATT-001 | Quick Attendance Correction | ESS `?correction=1` | full mobile |
| DRW-LEV-001 | Quick Leave Apply | ESS `?create=1` | full mobile |
| DRW-PAY-001 | Quick Payroll Summary | dashboard drill | 560px |

---

# Wizard Screens

**Figma page:** 24 Prototypes + inline on domain pages

| SCR-ID | Wizard | Entry | Steps |
|--------|--------|-------|-------|
| SCR-WIZ-001 | Employee Onboarding | `?onboard={id}` | 5 |
| SCR-WIZ-002 | Attendance Import | `?import=1` | 4 |
| SCR-WIZ-003 | Payroll Processing | `&tab=process` | 9 |
| SCR-WIZ-004 | Loan Approval | `&approve=1` | 4 |
| SCR-WIZ-005 | Promotion | promotions `?create=1` | 3 |
| SCR-WIZ-006 | Transfer | `?transfer={id}` | 3 |
| SCR-WIZ-007 | Exit Clearance | `&exit=1` | 3 |
| SCR-WIZ-008 | Asset Assignment | assignments `?create=1` | 3 |
| SCR-WIZ-009 | Payroll Reopen | `&reopen=1` | 2 |
| SCR-WIZ-010 | Hiring | `?hire={id}` | 2 |
| SCR-WIZ-011 | Employee Merge | `?merge=1` | 2 |
| SCR-WIZ-012 | Bank Export | `/payroll/export` | 5 |
| SCR-WIZ-LEV-001 | Leave Policy Setup | settings | P3 · *planned* |
| SCR-WIZ-TRN-001 | Training Program Setup | programs | P3 · *planned* |

---

# Mobile Screen Map

**Figma page:** 23

| SCR-ID | Screen | Priority |
|--------|--------|----------|
| SCR-ESS-DSH-001-M | Mobile Dashboard | P0 |
| SCR-ESS-ATT-001-M | Mobile Attendance | P0 |
| SCR-ESS-LEV-001-M | Mobile Leave | P0 |
| SCR-ESS-PAY-001-M | Mobile Payslips | P0 |
| SCR-ESS-REQ-001-M | Mobile Requests | P1 |
| SCR-COR-NTF-001-M | Mobile Notifications | P0 |
| SCR-ESS-MGR-001-M | Mobile Approvals | P1 |
| SCR-AI-HR-008-M | Mobile AI Assistant | P1 |
| SCR-COR-APR-002-M | Mobile Approval Cards | P1 |
| SCR-HR-EMP-001-M | Employee list cards | P2 |
| SCR-GLO-CMP-012 | Quick View Card | P1 |

**ESS bottom nav frames:** Home · Leave · Payslips · Alerts · More

---

# Prototype Flows

**Figma page:** 24 — connect frames with hotspots

| Flow ID | Name | Key frames | Phase |
|---------|------|------------|-------|
| FLOW-001 | Employee Onboarding | REC-010 → WIZ-010 → EMP-002 → WIZ-001 | P1 |
| FLOW-002 | Attendance Correction | ESS-ATT → correction drawer → ATT-007 approve | P0 |
| FLOW-003 | Leave Approval | ESS-LEV create → COR-APR-002 → approve modal | P0 |
| FLOW-004 | Payroll Processing | PAY-RUN-001 → RUN-003 steps → RUN-005 lock | P0 |
| FLOW-005 | Performance Review | PRF-005 → PRF-007 → PRF-008 | P2 |
| FLOW-006 | Training Assignment | TRN-002 → TRN-004 enroll | P2 |
| FLOW-007 | AI Recommendation | AI-007 card → MDL-AI-001 → navigate | P3 |
| FLOW-008 | Termination & Exit | EMP-M01 → WIZ-007 | P2 |
| FLOW-009 | Loan Request to Recovery | LON-002 → LON-004 → PAY-RUN-003 | P2 |
| FLOW-010 | ESS Manager Approval | ESS-MGR-001 swipe approve | P1 |

---

# Screen Priority Matrix

### Phase 1 — Critical (MVP wireframes)

| Domain | Screens |
|--------|---------|
| **Shell** | Navigation, list+drawer template |
| **Dashboards** | HR, Payroll, ESS |
| **Employees** | EMP-001–004, tabs overview/employment/compensation/timeline |
| **Attendance** | ATT-001–002, corrections, ESS-ATT |
| **Leave** | LEV-001–003, ESS-LEV, approval queue |
| **Payroll** | PAY-DSH, RUN-001–003, PSL-001–002, lock modal |
| **Approvals** | COR-APR-001–002, detail workspace |
| **ESS** | All P0 mobile frames |
| **Activity** | GLO-CMP-005, employee timeline tab |
| **AI** | GLO-CMP-013 panel (basic) |

### Phase 2 — Core

Organization · Recruitment pipeline · Shifts · Overtime · Loans · Performance cycles · Training programs · Assets · Documents · Reports operational · Payroll structures · Bank export · Manager ESS approvals · AI insights hub

### Phase 3 — Advanced

Executive dashboard · Analytics centers · Compliance center · Report builder · Kanban variants · Shift rotations · Encashment · Asset disposal · Audit timeline · Delegation center · Travel/expense

### Phase 4 — AI Screens

Full AI workspace · Prediction center · Automation center · AI report suite · ESS AI hub · Advanced auditor panels on payroll

---

# Design Handoff Map

| Team | Deliverable | Source |
|------|-------------|--------|
| **Design (Figma)** | 24 pages · SCR-labeled frames · state variants · mobile links | This doc + [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../HR_FIGMA_WIREFRAME_BLUEPRINT.md) |
| **Frontend** | Component mapping `DS/*` → `apps/web` · route table · query params | [HR_DESIGN_SYSTEM_SPECIFICATION.md](../../../design-system/HR_DESIGN_SYSTEM_SPECIFICATION.md) § Frontend Mapping |
| **Backend** | Screen ID → API endpoint map | [HR_API_ARCHITECTURE.md](../HR_API_ARCHITECTURE.md) |
| **QA** | `TC-SCR-{ID}` test cases · role variants · flows 001–010 | This doc § Prototype Flows |
| **Product** | Priority matrix · phase gates | § Screen Priority Matrix |
| **AI team** | AI screen specs · tool boundaries | [HR_AI_ASSISTANT_UI_ARCHITECTURE.md](./HR_AI_ASSISTANT_UI_ARCHITECTURE.md) |

### Per-frame handoff checklist

- [ ] SCR-ID in frame name  
- [ ] Route + query params annotated  
- [ ] Permission keys on actions  
- [ ] API endpoint sticky  
- [ ] Loading / empty / error variants  
- [ ] Mobile companion linked  
- [ ] Widget IDs for dashboards (`WGT-*`)  
- [ ] Prototype hotspot for P0 flows  

---

# Settings Screens (cross-page)

| SCR-ID | Screen | Route | Figma page |
|--------|--------|-------|------------|
| SCR-HR-SET-001 | HR Settings | `/hr/settings` | 03 or 17 |
| SCR-HR-SET-002 | Attendance Settings | `/hr/settings/attendance` | 08 |
| SCR-HR-SET-003 | Leave Settings | `/hr/settings/leave` | 10 |
| SCR-PAY-SET-001 | Payroll Settings | `/payroll/settings` | 11 |
| SCR-HR-SET-004 | Overtime Settings | `/hr/settings/overtime` | 12 |
| SCR-PAY-SET-002 | Loan Settings | `/payroll/settings/loans` | 13 |
| SCR-HR-SET-005 | Performance Settings | `/hr/settings/performance` | 14 |
| SCR-HR-SET-006 | Training Settings | `/hr/settings/training` | 15 |
| SCR-HR-SET-007 | Asset Settings | `/hr/settings/assets` | 16 |
| SCR-COR-SET-001 | Notification Settings | `/settings/notifications` | 03 |
| SCR-COR-SET-002 | Permission Settings | `/control-center/permissions` | 03 |

---

# Notification Screens

| SCR-ID | Screen | Route | Figma page |
|--------|--------|-------|------------|
| SCR-COR-NTF-000 | Bell Popover | Header | 03 |
| SCR-COR-NTF-001 | Notification Center | `/notifications` | 21 · 23 |
| SCR-COR-NTF-002 | Preferences | `/settings/notifications` | 03 |
| SCR-COR-NTF-003 | Notification History | `/notifications/history` | 21 |

---

# Cross-Reference Index

| Document | Role |
|----------|------|
| [HR_SCREEN_INVENTORY.md](../HR_SCREEN_INVENTORY.md) | Authoritative SCR registry |
| [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../HR_FIGMA_WIREFRAME_BLUEPRINT.md) | Wireframe zones & WF components |
| [uiux/HR_NAVIGATION_ARCHITECTURE.md](./HR_NAVIGATION_ARCHITECTURE.md) | NAV-* → SCR-* map |
| [uiux/HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) | DSH-* zones |
| [uiux/EMPLOYEE_PROFILE_UI_ARCHITECTURE.md](./EMPLOYEE_PROFILE_UI_ARCHITECTURE.md) | Profile tabs |
| [uiux/PAYROLL_UI_ARCHITECTURE.md](./PAYROLL_UI_ARCHITECTURE.md) | Workbench steps |
| [uiux/ESS_PORTAL_UI_ARCHITECTURE.md](./ESS_PORTAL_UI_ARCHITECTURE.md) | ESS + mobile |
| [uiux/HR_APPROVAL_CENTER_UI_ARCHITECTURE.md](./HR_APPROVAL_CENTER_UI_ARCHITECTURE.md) | Approval workspace |
| [uiux/HR_ACTIVITY_TIMELINE_UI_ARCHITECTURE.md](./HR_ACTIVITY_TIMELINE_UI_ARCHITECTURE.md) | Timeline layouts |
| [uiux/HR_AI_ASSISTANT_UI_ARCHITECTURE.md](./HR_AI_ASSISTANT_UI_ARCHITECTURE.md) | AI surfaces |
| [HR_DESIGN_SYSTEM_SPECIFICATION.md](../../../design-system/HR_DESIGN_SYSTEM_SPECIFICATION.md) | DS components |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll — Figma Screen Map |
| **Owner** | Product / Design |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Total SCR IDs** | 280+ (see Screen Inventory) |
| **Figma pages** | 24 |

---

**AgainERP HR & Payroll Figma Screen Map** — complete screen registry, Figma page structure, priority matrix, and design handoff map. No screen omitted.
