# HR & Payroll — Permission Matrix

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll (unified enterprise suite)  
> **Document Type:** Permission Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md) · [HR_WORKFLOW_ARCHITECTURE.md](./HR_WORKFLOW_ARCHITECTURE.md) · [HR_DATABASE_ARCHITECTURE.md](./HR_DATABASE_ARCHITECTURE.md)  
> **Governance:** [PERMISSION_SYSTEM_ARCHITECTURE.md](../../02-core-platform/PERMISSION_SYSTEM_ARCHITECTURE.md) · [APPROVAL_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) · [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) · [database/multi-company.md](../../05-development/database/multi-company.md)

**No application code. No database implementation. No API implementation.**  
This document defines the **complete permission architecture** for AgainERP HR & Payroll — roles, permission keys, access levels, approval authority, data visibility, multi-company/branch rules, sensitive data, audit, and AI governance. Foundation for authorization system, approval engine, security layer, audit system, SaaS access control, and AI HR Assistant.

**Permission namespaces:** `hr.*` · `payroll.*` · `ess.*`  
**Roles & permissions are Core-owned** — HR registers keys; companies assign via Core `roles` / `role_permissions`.

---

## Executive Summary

| Principle | Rule |
|-----------|------|
| **One registry** | All keys in Core Permission Registry — no HR-local ACL tables |
| **Fail closed** | Deny by default; explicit grant required |
| **Server authoritative** | UI hides actions; API always re-checks |
| **Layered enforcement** | RBAC → record rules → field ACL → branch scope → approval gate |
| **SoD** | Submitter ≠ approver; payroll calculator ≠ approver |
| **AI inherits user** | AI never exceeds acting user's permissions |
| **Company isolation** | Queries never cross `company_id` without platform role |
| **Module off** | All `hr.*` / `payroll.*` / `ess.*` inactive when module disabled |

---

## Permission Philosophy

HR & Payroll permissions protect **people data** and **pay data** — the highest-sensitivity domains in ERP after finance.

### Design beliefs

> **Least privilege for everyone. Explicit elevation for payroll and PII. Managers see their tree; employees see themselves.**

| Stakeholder | Need | Permission answer |
|-------------|------|-------------------|
| Employee | Self-service without seeing others' pay | `ess.*` + record rule `self` |
| Manager | Team ops without company-wide salary | `hr.*.approve` + `department_subtree` rule |
| HR | Full workforce, controlled comp view | `hr.*` + `hr.sensitive.view` |
| Payroll | Pay processing without hire/fire | `payroll.*` segregated from `hr.employee.terminate` |
| Auditor | Read-only compliance export | `hr.audit.*` / `payroll.audit.*` |
| Platform admin | Cross-tenant break-glass | `core.platform.*` — audited |

### What HR module owns vs Core

| HR owns | Core owns |
|---------|-----------|
| Permission **key definitions** (`hr.employee.view`) | `permissions`, `roles`, `role_permissions` tables |
| Record rule **templates** (`hr.employee.department`) | `record_rules` engine |
| Field ACL **catalog** (salary fields) | `field_permissions` engine |
| Approval **policy bindings** | Approval Engine execution |
| UI permission manifest | Authorization middleware |

---

## Security Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **Defense in depth** | RBAC + record + field + branch + approval |
| 2 | **Separation of duties** | Payroll create ≠ approve ≠ post |
| 3 | **Tenant isolation** | `tenant_id` on all permission resolution |
| 4 | **Company isolation** | Active `company_id` in session |
| 5 | **Dimensional scope** | Branch and department filters |
| 6 | **Field masking** | Salary/bank hidden without `hr.sensitive.view` |
| 7 | **Immutable audit** | Permission denials logged at debug; grants logged always |
| 8 | **Export control** | Payroll export requires explicit key |
| 9 | **Time-bound access** | External consultant role with `valid_until` |
| 10 | **AI containment** | `ai.tool.execute` + inherited HR keys |

---

## Access Control Strategy

### Authorization stack (HR request)

```text
Request (user or AI-on-behalf-of-user)
        ↓
1. Authentication — valid session / API token
        ↓
2. Module enabled — module.hr / module.payroll for tenant
        ↓
3. Company context — active company_id
        ↓
4. RBAC — union permissions from user roles
        ↓
5. Record rules — company, department, branch, self
        ↓
6. Field permissions — strip/mask sensitive columns
        ↓
7. Branch scope — user_branches filter
        ↓
8. Approval gate — if transition requires approval
        ↓
Allow / Deny (403)
```

### Permission key format

| Layer | Format | Example |
|-------|--------|---------|
| Display label | `HR.Employee.View` | Role editor UI |
| Canonical key | `hr.employee.view` | API middleware |

**Prefixes:** `hr` · `payroll` · `ess`

### Standard actions (registered)

| Action | Key suffix | Meaning |
|--------|------------|---------|
| View | `.view` | Read list/detail |
| Create | `.create` | Insert |
| Edit | `.edit` | Update |
| Delete | `.delete` | Soft delete |
| Approve | `.approve` | Approval Engine step |
| Reject | `.reject` | Approval denial |
| Export | `.export` | Bulk download |
| Import | `.import` | Bulk upload |
| Print | `.print` | PDF/print |
| Manage | `.manage` | Admin/config |
| Lock | `.lock` | Period/run lock |
| Post | `.post` | GL post (payroll) |
| Reopen | `.reopen` | Reversal / unlock (restricted) |
| Access | `.access` | Module menu entry |

---

## Role Based Access Control (RBAC)

Users receive permissions through **Core roles** — multiple roles per user per company; effective permissions are the **union**.

```text
User ──< user_roles >── Role ──< role_permissions >── Permission
  │                        │
  │                        └── record_rules (HR templates)
  │                        └── field_permissions (salary, bank)
  └── user_branches (branch scope)
```

### Role types

| Type | Description |
|------|-------------|
| **System role** | Shipped on module install — `is_system=true`, slug immutable |
| **Custom role** | Company admin clones template and adjusts |
| **Composite** | User holds HR Manager + Payroll Manager — permissions union |

---

## Data Ownership Rules

| Data class | Owner module | Who can write |
|------------|--------------|---------------|
| Person identity | Core `contacts` | HR via `hr.employee.edit` (linked fields) |
| Employment | HR `hr_employees` | HR roles; not Payroll |
| Compensation structure | Payroll | `payroll.structure.manage` |
| Payslips | Payroll | System on run only |
| Attendance | HR | HR + controlled manual keys |
| Leave balances | HR | System + `hr.leave.balance.adjust` |
| Approvals | Core | Approval Engine |
| Activities | Core | System on transitions |

**Rule:** Payroll cannot `hr.employee.create` or `hr.employee.terminate` unless role explicitly grants (discouraged — SoD).

---

## Record Visibility Rules

Registered as Core **record rules** — applied after RBAC.

| Rule ID | Domain filter | Typical roles |
|---------|---------------|---------------|
| `hr.employee.company` | `company_id = session.company_id` | All HR roles |
| `hr.employee.self` | `employee_id = session.employee_id` | Employee |
| `hr.employee.direct_reports` | `manager_id = session.employee_id` | Team Leader |
| `hr.employee.department_subtree` | `department_id IN subtree(session.employee_id)` | Dept Manager |
| `hr.employee.branch` | `branch_id IN user_branches` | Branch Admin |
| `hr.employee.all_company` | No extra filter within company | HR Director, Company Admin |
| `payroll.payslip.self` | Own payslips only | Employee |
| `payroll.payslip.company` | All payslips in company | Payroll roles |
| `hr.candidate.recruiter` | Assigned recruiter OR recruitment role | Recruitment Executive |
| `hr.audit.readonly` | Read all; write nothing | Auditor |

**Evaluation:** Most restrictive applicable rule wins for row filter; platform admin bypass audited.

---

## Approval Authority Rules

Approval permission **alone is insufficient** — user must be assigned in Approval Engine chain (role, manager relationship, or policy step).

| Permission | Enables |
|------------|---------|
| `core.approval.act` | Act on assigned approval steps |
| `hr.leave.approve` | Eligible for leave chain steps |
| `hr.attendance.correction.approve` | Attendance correction steps |
| `payroll.run.approve` | Payroll run approval |
| `payroll.loan.approve` | Loan approval steps |
| `hr.expense.approve` | Expense claim steps |

**SoD blocks:** Self-approval on own leave, OT, expense; payroll calculator approving same run.

---

# Access Level Definitions

Used in matrices below.

| Code | Level | Capabilities |
|------|-------|--------------|
| **—** | No Access | Denied; hidden in UI |
| **V** | View Only | Read non-sensitive fields |
| **C** | Create | Insert new records |
| **E** | Edit | Update existing |
| **D** | Delete | Soft delete |
| **A** | Approve | Approval Engine action |
| **R** | Reject | Approval denial |
| **X** | Export | Bulk export |
| **P** | Print | PDF / print |
| **F** | Full Control | All actions including manage/config |

**Note:** Sensitive fields may downgrade effective access (e.g. Edit employee but View-only salary without `hr.sensitive.view`).

---

# Standard Roles

System role templates registered at HR & Payroll module install. Companies may clone and customize.

| Role | Scope | Purpose |
|------|-------|---------|
| **Super Admin** | Platform (cross-tenant) | SaaS operator break-glass — audited |
| **Platform Admin** | Tenant (all companies) | Tenant configuration, plan features |
| **Company Admin** | Single company | Full HR & Payroll within company |
| **Branch Admin** | Branch(es) | Branch workforce and attendance |
| **HR Director** | Company | Strategic HR, all approvals, sensitive data |
| **HR Manager** | Company | HR operations, policies, approvals |
| **HR Executive** | Company | Day-to-day HR; limited settings |
| **Department Manager** | Department subtree | Team leave, OT, performance, expenses |
| **Team Leader** | Direct reports | First-line leave/OT/attendance |
| **Payroll Manager** | Company | Payroll approval, tax, lock, post |
| **Payroll Executive** | Company | Process runs; no approve/post (SoD) |
| **Recruitment Manager** | Company | Requisitions, offers, hiring |
| **Recruitment Executive** | Company | Candidates, interviews |
| **Trainer** | Company / programs | Training schedules, attendance |
| **Employee** | Self | ESS only |
| **Auditor** | Company read-only | Compliance reports, audit export |
| **External Consultant** | Time-bound | Limited view per engagement scope |

---

## Role × Module Access (summary)

| Role | `hr.access` | `payroll.access` | `ess.access` | Sensitive PII | Approve payroll |
|------|-------------|------------------|--------------|---------------|-----------------|
| Super Admin | F | F | F | F | A |
| Platform Admin | F | F | — | F | A |
| Company Admin | F | F | — | F | A |
| Branch Admin | E | V | — | V | — |
| HR Director | F | V | — | F | A |
| HR Manager | F | V | — | F | A |
| HR Executive | E | — | — | V | — |
| Department Manager | V | — | — | — | — |
| Team Leader | V | — | — | — | — |
| Payroll Manager | V | F | — | F | A |
| Payroll Executive | — | E | — | F | — |
| Recruitment Manager | E* | — | — | V | — |
| Recruitment Executive | E* | — | — | — | — |
| Trainer | V** | — | — | — | — |
| Employee | — | — | F | Own | — |
| Auditor | V | V | — | V*** | — |
| External Consultant | V**** | — | — | — | — |

\* Recruitment-scoped keys only  
\** Training-scoped keys only  
\*** Audit export — masked bank optional per policy  
\**** Engagement-scoped record rule

---

# Multi Company Access Rules

Per [database/multi-company.md](../../05-development/database/multi-company.md) and SaaS platform architecture.

### Platform level access

| Role | Visibility |
|------|------------|
| **Super Admin** | All tenants, all companies — break-glass logged |
| **Platform Admin** | All companies within assigned tenant |
| **All other roles** | Single active `company_id` per session |

**API:** `X-Company-Id` header or JWT claim; mismatch → 403.

### Company level access

| Rule | Behavior |
|------|----------|
| Default | User sees only companies where they have `user_roles` |
| Company switcher | Shown when user has roles in 2+ companies |
| Data isolation | No query crosses companies without platform role |
| Payroll | Runs, payslips, structures scoped to one company |
| HR employee | `employee_number` unique per company |

### Branch level access

| Rule | Behavior |
|------|----------|
| Branch Admin | `user_branches` allow-list |
| HQ roles | Empty branch list = all branches (Company Admin, HR Director) |
| Employee record | Filtered by `branch_id` when branch scope active |

### Department level access

| Rule | Behavior |
|------|----------|
| Department Manager | `hr.employee.department_subtree` record rule |
| HR roles | Company-wide unless custom rule |
| Cross-dept view | Requires `hr.employee.view_all` |

### Employee level access

| Rule | Behavior |
|------|----------|
| Employee (ESS) | `hr.employee.self` — own `employee_id` only |
| Manager | Direct reports + optional subtree |
| Peers | No access by default |

### Visibility boundary diagram

```text
Tenant
└── Company A          ← session.company_id
    ├── Branch Dhaka   ← user_branches (optional)
    │   └── Dept Sales ← department_subtree (manager)
    │       └── Employee E001 ← self (employee)
    └── Branch Chittagong
        └── (hidden from Dhaka Branch Admin)
```

---

# Multi Branch Access Rules

### Branch isolation

| Scenario | Rule |
|----------|------|
| Branch Admin | Employees, attendance, devices in assigned branches only |
| Payroll | Company-wide by default; optional branch cost report filter |
| Holidays | Branch calendar visible only if branch in scope |
| Recruitment | Company-wide unless policy restricts requisition to branch |

### Shared access

| Scenario | Rule |
|----------|------|
| HR Director / Company Admin | All branches in company |
| Employee transfer | Source branch manager loses access after transfer date |
| Matrix manager | May see reports in multiple branches if in `user_branches` |

### Cross branch approval

| Flow | Rule |
|------|------|
| Leave | Manager chain uses **reporting line**, not branch — manager may be other branch |
| Attendance correction | Approver must have `hr.attendance.correction.approve` + see employee via record rule |
| Transfer | Requires `hr.employee.transfer` + HR approval |

### Cross branch reporting

| Report | Permission | Scope |
|--------|------------|-------|
| Headcount by branch | `hr.report.employee.view` | User branch filter unless `view_all` |
| Muster roll | `hr.report.attendance.view` | Branch-scoped |
| Consolidated payroll | `payroll.report.view` | Company-wide — Payroll Manager only |

---

# Permission Registry — Complete Key Catalog

### Module access

| Key | Label | Risk |
|-----|-------|------|
| `hr.access` | HR.Access | low |
| `payroll.access` | Payroll.Access | medium |
| `ess.access` | ESS.Access | low |

### Organization

| Key | Label |
|-----|-------|
| `hr.department.view` | HR.Department.View |
| `hr.department.manage` | HR.Department.Manage |
| `hr.location.view` | HR.Location.View |
| `hr.location.manage` | HR.Location.Manage |
| `hr.job_position.view` | HR.JobPosition.View |
| `hr.job_position.manage` | HR.JobPosition.Manage |
| `hr.cost_center.view` | HR.CostCenter.View |
| `hr.cost_center.manage` | HR.CostCenter.Manage |

### Employee

| Key | Label | Risk |
|-----|-------|------|
| `hr.employee.view` | HR.Employee.View | low |
| `hr.employee.view_all` | HR.Employee.ViewAll | medium |
| `hr.employee.create` | HR.Employee.Create | medium |
| `hr.employee.edit` | HR.Employee.Edit | medium |
| `hr.employee.delete` | HR.Employee.Delete | high |
| `hr.employee.terminate` | HR.Employee.Terminate | high |
| `hr.employee.transfer` | HR.Employee.Transfer | high |
| `hr.employee.promote` | HR.Employee.Promote | high |
| `hr.employee.export` | HR.Employee.Export | medium |
| `hr.sensitive.view` | HR.Sensitive.View | high |
| `hr.sensitive.edit` | HR.Sensitive.Edit | high |

### Attendance

| Key | Label |
|-----|-------|
| `hr.attendance.view` | HR.Attendance.View |
| `hr.attendance.manual` | HR.Attendance.Manual |
| `hr.attendance.import` | HR.Attendance.Import |
| `hr.attendance.correct` | HR.Attendance.Correct |
| `hr.attendance.correction.approve` | HR.AttendanceCorrection.Approve |
| `hr.attendance.export` | HR.Attendance.Export |
| `hr.attendance.lock` | HR.Attendance.Lock |
| `hr.attendance.device.manage` | HR.AttendanceDevice.Manage |

### Shift

| Key | Label |
|-----|-------|
| `hr.shift.view` | HR.Shift.View |
| `hr.shift.manage` | HR.Shift.Manage |
| `hr.shift.assign` | HR.Shift.Assign |
| `hr.shift.override` | HR.Shift.Override |

### Leave

| Key | Label |
|-----|-------|
| `hr.leave.view` | HR.Leave.View |
| `hr.leave.create` | HR.Leave.Create |
| `hr.leave.approve` | HR.Leave.Approve |
| `hr.leave.cancel` | HR.Leave.Cancel |
| `hr.leave.policy.manage` | HR.LeavePolicy.Manage |
| `hr.leave.balance.adjust` | HR.LeaveBalance.Adjust |
| `hr.leave.encash` | HR.Leave.Encash |

### Payroll

| Key | Label | Risk |
|-----|-------|------|
| `payroll.structure.view` | Payroll.Structure.View | medium |
| `payroll.structure.manage` | Payroll.Structure.Manage | high |
| `payroll.run.view` | Payroll.Run.View | medium |
| `payroll.run.create` | Payroll.Run.Create | high |
| `payroll.run.calculate` | Payroll.Run.Calculate | high |
| `payroll.run.approve` | Payroll.Run.Approve | high |
| `payroll.run.lock` | Payroll.Run.Lock | high |
| `payroll.run.post` | Payroll.Run.Post | high |
| `payroll.run.reopen` | Payroll.Run.Reopen | critical |
| `payroll.payslip.view` | Payroll.Payslip.View | high |
| `payroll.payslip.view_all` | Payroll.Payslip.ViewAll | high |
| `payroll.payslip.publish` | Payroll.Payslip.Publish | high |
| `payroll.tax.manage` | Payroll.Tax.Manage | high |
| `payroll.bonus.manage` | Payroll.Bonus.Manage | medium |
| `payroll.commission.manage` | Payroll.Commission.Manage | medium |
| `payroll.bank_export` | Payroll.BankExport | critical |
| `payroll.salary_revision.manage` | Payroll.SalaryRevision.Manage | high |
| `payroll.loan.view` | Payroll.Loan.View | medium |
| `payroll.loan.approve` | Payroll.Loan.Approve | high |
| `payroll.advance.view` | Payroll.Advance.View | medium |
| `payroll.advance.approve` | Payroll.Advance.Approve | high |

### Recruitment, Performance, Training, Asset, Document, Report, ESS

(See domain sections below for matrix mapping.)

---

# Employee Data Permissions

### Access matrix by role

| Data domain | Keys | Super Admin | Co. Admin | HR Dir | HR Mgr | HR Exec | Payroll Mgr | Payroll Exec | Dept Mgr | Employee | Auditor |
|-------------|------|-------------|-----------|--------|--------|---------|-------------|--------------|----------|----------|---------|
| **Employee master** | `hr.employee.*` | F | F | F | F | E | V | — | V† | V‡ | V |
| **Salary information** | `hr.sensitive.view` + payroll | F | F | F | F | — | F | F | — | V‡ | V |
| **Bank information** | `hr.sensitive.view` | F | F | F | F | V | F | F | — | V‡ | V§ |
| **Documents** | `hr.document.*` | F | F | F | F | E | — | — | V† | V‡ | V |
| **Assets** | `hr.asset.*` | F | F | F | F | E | — | — | V† | V‡ | V |
| **Performance reviews** | `hr.performance.*` | F | F | F | F | E | — | — | A† | V‡ | V |
| **Medical (future)** | `hr.medical.view` | F | F | F | V | — | — | — | — | V‡ | V§ |
| **Disciplinary (future)** | `hr.disciplinary.view` | F | F | F | F | V | — | — | — | — | V |
| **Exit records** | `hr.exit.view` | F | F | F | F | E | V | V | — | V‡ | V |

† Department subtree only  
‡ Self only  
§ Masked account number unless `hr.sensitive.view` + auditor policy

### Field-level ACL (sensitive columns on `hr_employees` / related)

| Field | View roles | Edit roles |
|-------|------------|------------|
| `national_id` | `hr.sensitive.view` | HR Manager+ |
| `tax_id` | `hr.sensitive.view` | HR Manager+ |
| `bank_account_number` | `hr.sensitive.view` | HR Manager+, Payroll Manager |
| `salary_amount` | `hr.sensitive.view` | `payroll.salary_revision.manage` |
| `date_of_birth` | `hr.employee.view` | HR Executive+ |
| `personal_email` | self or `hr.employee.view` | self or HR |

---

# Attendance Permissions

| Capability | Key | HR Exec | Branch Admin | Dept Mgr | Team Lead | Employee |
|------------|-----|---------|--------------|----------|-----------|----------|
| View records | `hr.attendance.view` | V | V | V† | V† | V‡ |
| Manual entry | `hr.attendance.manual` | E | E | — | — | — |
| Bulk import | `hr.attendance.import` | E | E | — | — | — |
| Request correction | `hr.attendance.correct` | E | E | E | E | C‡ |
| Approve correction | `hr.attendance.correction.approve` | A | A | A† | A† | — |
| Export | `hr.attendance.export` | X | X | — | — | — |
| Period lock | `hr.attendance.lock` | — | — | — | — | — |
| Device config | `hr.attendance.device.manage` | — | E | — | — | — |

**Locking:** `hr.attendance.lock` — HR Manager, Payroll Manager (when payroll period closes).

---

# Shift Management Permissions

| Capability | Key | HR Mgr | HR Exec | Branch Admin | Payroll Mgr |
|------------|-----|--------|---------|--------------|-------------|
| Shift creation | `hr.shift.manage` | F | — | E | V |
| Shift assignment | `hr.shift.assign` | F | E | E | V |
| Shift editing | `hr.shift.manage` | F | E | E | — |
| Shift approval | `hr.shift.approve`* | A | — | A | — |
| Shift override | `hr.shift.override` | F | — | E | — |

\* Optional policy step for rotational shift changes affecting payroll.

---

# Leave Management Permissions

| Capability | Key | Employee | Team Lead | Dept Mgr | HR Exec | HR Mgr |
|------------|-----|----------|-----------|----------|---------|--------|
| Leave request | `ess.leave.apply` / `hr.leave.create` | C | C | C | C | C |
| Leave approval | `hr.leave.approve` | — | A† | A† | A | A |
| Cancellation | `hr.leave.cancel` | R‡ | A† | A† | E | F |
| Policy management | `hr.leave.policy.manage` | — | — | — | — | F |
| Balance adjustment | `hr.leave.balance.adjust` | — | — | — | E | F |
| Encashment | `hr.leave.encash` | — | — | — | E | A |

---

# Payroll Permissions

Highly detailed — segregation of duties enforced.

### Salary structure

| Capability | Key | Payroll Exec | Payroll Mgr | HR Mgr | Co. Admin |
|------------|-----|--------------|-------------|--------|-----------|
| View structures | `payroll.structure.view` | V | F | V | F |
| Create/edit components | `payroll.structure.manage` | E | F | — | F |
| Assign to employee | `payroll.salary_revision.manage` | E | F | V | F |

### Payroll processing

| Capability | Key | Payroll Exec | Payroll Mgr | HR Mgr |
|------------|-----|--------------|-------------|--------|
| View runs | `payroll.run.view` | V | F | V |
| Create run | `payroll.run.create` | E | F | — |
| Calculate | `payroll.run.calculate` | E | F | — |
| Review exceptions | `payroll.run.view` | V | F | V |

### Payroll approval & lock

| Capability | Key | Payroll Exec | Payroll Mgr | HR Mgr | Finance* |
|------------|-----|--------------|-------------|--------|----------|
| Approve run | `payroll.run.approve` | — | A | A | A |
| Lock run | `payroll.run.lock` | — | F | — | — |
| Post to GL | `payroll.run.post` | — | F | — | F |
| Reopen run | `payroll.run.reopen` | — | — | — | F |

\* Finance Controller — cross-module `finance.journal.post` + approval policy `payroll.run.high`

### Payslip access

| Capability | Key | Employee | Payroll Exec | Payroll Mgr | HR Mgr |
|------------|-----|----------|--------------|-------------|--------|
| Own payslip | `ess.payslip.view` | V | — | — | — |
| All payslips | `payroll.payslip.view_all` | — | V | F | V |
| Publish to ESS | `payroll.payslip.publish` | — | E | F | — |
| Print payslip | `ess.payslip.print` | P | P | P | P |

### Tax, bonus, commission

| Capability | Key | Payroll Exec | Payroll Mgr |
|------------|-----|--------------|-------------|
| Tax configuration | `payroll.tax.manage` | — | F |
| Bonus processing | `payroll.bonus.manage` | E | F |
| Commission processing | `payroll.commission.manage` | E | F |

### Bank export & salary revision

| Capability | Key | Payroll Exec | Payroll Mgr | Co. Admin |
|------------|-----|--------------|-------------|-----------|
| Bank export | `payroll.bank_export` | — | F | F |
| Salary revision | `payroll.salary_revision.manage` | E | F | F |
| Payroll reopen | `payroll.run.reopen` | — | — | F |

**SoD matrix (payroll)**

| Action | Payroll Executive | Payroll Manager |
|--------|-------------------|-----------------|
| Create + calculate | ✓ | ✓ |
| Approve same run | ✗ | ✓ (if not calculator) |
| Lock + publish | ✗ | ✓ |
| Bank export | ✗ | ✓ |
| Reopen posted | ✗ | ✗ (Finance + Co. Admin) |

---

# Recruitment Permissions

| Capability | Key | Recruit Exec | Recruit Mgr | HR Mgr | Hiring Mgr |
|------------|-----|--------------|-------------|--------|------------|
| Job positions | `hr.job_position.view` | V | F | F | V |
| Requisitions | `hr.requisition.manage` | E | F | F | C |
| Candidates | `hr.candidate.manage` | F | F | F | V† |
| Interview notes | `hr.interview.edit` | E | F | F | E† |
| Offer letters | `hr.offer.manage` | — | F | F | — |
| Hiring decisions | `hr.hiring.approve` | — | A | A | A† |
| Recruitment reports | `hr.report.recruitment.view` | V | X | X | V† |

† Own requisitions / interviews only unless `hr.candidate.view_all`

---

# Performance Management Permissions

| Capability | Key | Employee | Dept Mgr | HR Exec | HR Mgr |
|------------|-----|----------|----------|---------|--------|
| Goal creation | `hr.goal.create` | C‡ | F† | F | F |
| KPI management | `hr.kpi.manage` | — | — | E | F |
| Review creation | `hr.performance.manage` | — | E† | F | F |
| Review approval | `hr.performance.approve` | — | A† | A | A |
| Promotion recommendation | `hr.promotion.recommend` | — | C† | E | A |

---

# Training Permissions

| Capability | Key | Trainer | HR Exec | HR Mgr | Employee |
|------------|-----|---------|---------|--------|----------|
| Programs | `hr.training.program.manage` | E | E | F | V |
| Schedules | `hr.training.schedule.manage` | F | E | F | V |
| Attendance | `hr.training.attendance` | E | E | F | V‡ |
| Certificates | `hr.training.certify` | E | E | F | V‡ |
| Evaluations | `hr.training.evaluate` | E | E | F | C‡ |

---

# Asset Management Permissions

| Capability | Key | HR Exec | IT Admin* | HR Mgr | Employee |
|------------|-----|---------|-----------|--------|----------|
| Asset creation | `hr.asset.create` | E | F | F | — |
| Assignment | `hr.asset.assign` | E | F | F | C‡ |
| Transfer | `hr.asset.transfer` | E | F | F | — |
| Return | `hr.asset.return` | E | F | F | C‡ |
| Disposal | `hr.asset.dispose` | — | F | A | — |

\* IT Admin — custom role with `hr.asset.*` scoped to IT category.

---

# Document Management Permissions

| Capability | Key | Employee | HR Exec | HR Mgr |
|------------|-----|----------|---------|--------|
| Upload | `hr.document.upload` | C‡ | F | F |
| Download | `hr.document.download` | V‡ | F | F |
| View | `hr.document.view` | V‡ | F | F |
| Approve / verify | `hr.document.verify` | — | E | F |
| Archive | `hr.document.archive` | — | E | F |
| Delete | `hr.document.delete` | — | — | D |

---

# Reporting Permissions

| Report category | Key | HR Mgr | Payroll Mgr | Dept Mgr | Auditor |
|-----------------|-----|--------|-------------|----------|---------|
| Employee reports | `hr.report.employee.view` | X | V | V† | X |
| Attendance reports | `hr.report.attendance.view` | X | V | X† | X |
| Leave reports | `hr.report.leave.view` | X | V | X† | X |
| Payroll reports | `payroll.report.view` | V | X | — | X |
| Performance reports | `hr.report.performance.view` | X | — | X† | X |
| Compliance reports | `hr.report.compliance.view` | X | X | — | X |
| Audit reports | `hr.audit.export` | — | — | — | X |

---

# Self Service Permissions (`ess.*`)

| Capability | Key | Employee |
|------------|-----|----------|
| Module access | `ess.access` | Required |
| Profile view/edit | `ess.profile.view` / `ess.profile.edit` | V / E‡ |
| Attendance view | `ess.attendance.view` | V |
| Leave apply | `ess.leave.apply` | C |
| Payslips | `ess.payslip.view` / `ess.payslip.print` | V / P |
| Documents | `ess.document.upload` | C |
| Requests (generic) | `ess.request.create` | C |
| Assets view | `ess.asset.view` | V |
| Training enroll | `ess.training.enroll` | C |
| Performance self-review | `ess.performance.self_review` | E |

‡ Sensitive profile fields route to `ess.profile.update` approval workflow.

---

# Approval Matrix

Authority chains by document type. **Approver must hold permission + be in chain.**

### Standard hierarchy (reference)

```text
Employee
    ↓
Team Leader
    ↓
Department Manager
    ↓
HR Manager / HR Director
    ↓
Finance (amount-based)
    ↓
Company Admin (exceptional)
```

### Leave

| Condition | Chain |
|-----------|-------|
| ≤ 1 day | Team Leader → (auto if policy allows) |
| 2–3 days | Team Leader → Department Manager |
| > 3 days | Team Leader → Department Manager → HR Manager |
| Unpaid leave | + HR Executive minimum |
| Leave encashment | HR Manager → Payroll Manager |

| Role | Can approve |
|------|-------------|
| Team Leader | Direct reports, ≤ 3 days if policy |
| Department Manager | Subtree, ≤ 10 days if policy |
| HR Manager | All company |
| HR Executive | All except encashment final |

### Attendance correction

| Step | Role |
|------|------|
| 1 | Team Leader / Department Manager |
| 2 | HR Executive (if policy) |
| 3 | HR Manager (if period locked preview) |

### Loan

| Step | Role | Permission |
|------|------|------------|
| 1 | Department Manager | `payroll.loan.approve` |
| 2 | HR Manager | `payroll.loan.approve` |
| 3 | Finance Controller | `finance.expense.approve` or custom |
| High principal | + Company Admin | policy `hr.loan.high` |

### Advance salary

| Step | Role |
|------|------|
| 1 | Department Manager |
| 2 | HR Manager |
| High amount | + Finance |

### Payroll run

| Step | Role | SoD |
|------|------|-----|
| 1 | Payroll Manager (or HR Director) | Must not be calculator |
| 2 | Finance Controller (if `payroll.run.high`) | — |
| Lock | Payroll Manager | `payroll.run.lock` |
| Post | Payroll Manager + open period | `payroll.run.post` |

### Salary revision

| Step | Role |
|------|------|
| 1 | HR Manager |
| 2 | Payroll Manager |
| > threshold % | Finance Controller |

### Promotion

| Step | Role |
|------|------|
| 1 | Department Manager (recommend) |
| 2 | HR Manager |
| 3 | HR Director (if grade jump > 1) |
| Optional | `payroll.salary_revision` linked |

### Transfer

| Type | Chain |
|------|-------|
| Department | Department Manager → HR Executive |
| Branch | Branch Admin → HR Manager |
| Company | HR Director → Company Admin (both companies) |

### Asset requests

| Step | Role |
|------|------|
| 1 | Department Manager |
| 2 | IT Admin (if IT asset) |
| 3 | HR Executive |

---

# Sensitive Data Security

### Classification

| Class | Examples | Minimum key |
|-------|----------|-------------|
| **Public internal** | Name, department, job title | `hr.employee.view` |
| **Confidential** | Address, phone, emergency contact | `hr.employee.view` + record rule |
| **Restricted** | Salary, bank, tax ID | `hr.sensitive.view` |
| **Critical** | Payroll runs, bank export | `payroll.*` + SoD |
| **Legal hold** | Disciplinary, exit, medical | Role-specific + audit |

### Visibility rules by data type

| Data type | Employee | Manager | HR Exec | Payroll | Auditor |
|-----------|----------|---------|---------|---------|---------|
| **Salary** | Own ESS | Hidden | Hidden | Full | Masked optional |
| **Bank accounts** | Own (masked) | Hidden | View last 4 | Full | Last 4 only |
| **Tax data** | Own declarations | Hidden | View | Full | Aggregated |
| **Payroll history** | Own payslips | Hidden | — | Full | Read-only export |
| **Performance reviews** | Own | Direct reports | Full | — | Anonymized option |
| **Disciplinary** | Hidden | Hidden | View | — | Full |
| **Exit records** | Own clearance | Hidden | Full | View F&F | Full |

### Export controls

| Export | Permission | Extra guard |
|--------|------------|-------------|
| Employee PII CSV | `hr.employee.export` | Activity log + optional approval |
| Payroll register | `payroll.report.view` + `payroll.bank_export` | SoD |
| Audit bundle | `hr.audit.export` | Time-limited download link |

---

# Audit Requirements

Every permission-checked action logged per [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) and platform audit standards.

### Required audit fields

| Field | Description |
|-------|-------------|
| **User** | `user_id` |
| **Role** | Effective role(s) at action time |
| **Action** | Permission key attempted |
| **Timestamp** | UTC |
| **Reason** | Required on: terminate, balance adjust, reopen payroll, sensitive export |
| **IP Address** | Future — session metadata |
| **Result** | allow / deny |
| **Entity** | `entity_type`, `entity_id` |

### High-audit actions (always log + optional alert)

`hr.employee.terminate` · `payroll.run.lock` · `payroll.run.post` · `payroll.run.reopen` · `payroll.bank_export` · `hr.leave.balance.adjust` · `hr.sensitive.view` bulk · `role_permissions` change affecting HR keys

### Permission change audit

Role assignment and permission grant/revoke logged in Core — immutable `permission_audit_log`.

---

# AI Security Considerations

Per [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) — AI inherits user permissions.

### What AI can read

| Data | Condition |
|------|-----------|
| Employee directory | `hr.employee.view` + record rules |
| Attendance summary | `hr.attendance.view` |
| Leave balances | `hr.leave.view` or `ess.leave.view` |
| Payslip summary | `payroll.payslip.view` — **not** others' without key |
| Performance aggregates | `hr.performance.view` — anonymized for managers |
| Attrition signals | `hr.report.employee.view` + `ai.tool.execute` |

**AI context bundle** — field permissions strip salary/bank unless `hr.sensitive.view` held.

### What AI can suggest

| Suggestion | Tool | Approval |
|------------|------|----------|
| Leave coverage plan | `hr.suggest_leave_coverage` | None — read only |
| Attendance anomaly | `hr.explain_attendance_anomaly` | None |
| Payroll validation flags | `payroll.validate_run` | None |
| Promotion candidate | `hr.suggest_promotion` | HR Manager applies |
| Training course | `hr.recommend_training` | Employee enrolls |
| Salary revision draft | `payroll.draft_salary_revision` | **Requires approval workflow** |

### What AI cannot approve

| Action | Rule |
|--------|------|
| Leave approval | Human approver only |
| Payroll run approval | Human only |
| Loan / advance approval | Human only |
| Termination | Human only |
| Bank export | Human only |
| Any `*.approve` transition | AI blocked at Approval Engine |

### What AI cannot modify

| Data | Rule |
|------|------|
| Posted payslips | Immutable — AI read-only |
| Locked payroll runs | No write tools |
| Bank account numbers | No direct write — suggest + human form |
| Disciplinary records | No AI write |
| Permission / roles | Platform admin human only |

### Human approval requirements

```text
AI proposes change
        ↓
User reviews in AI Actions tab
        ↓
User clicks Apply (requires ai.tool.apply + target permission)
        ↓
If high-risk → start normal workflow / approval
        ↓
Human approver completes chain
        ↓
Activity: ai_action + domain activity
```

### AI permission keys (HR context)

| Key | Purpose |
|-----|---------|
| `ai.access` | Use AI features |
| `ai.tool.execute` | Run HR tools |
| `ai.tool.apply` | Apply suggestion |
| `ai.write.hr` | Propose HR changes (future) |
| `ai.audit.view` | View AI audit log |

**Rule:** `ai.tool.execute` AND `hr.employee.view` (example) — both required.

---

# SaaS & Plan Feature Gating

| Plan tier | HR features | Payroll features |
|-----------|-------------|------------------|
| **Starter** | Employee, leave, attendance basic | — |
| **Growth** | + recruitment, ESS | Payroll runs, payslips |
| **Enterprise** | + performance, training, devices | Tax, bank export, multi-company |
| **Group** | Cross-company reporting | Per-company payroll |

Inactive plan features → permissions return `ModuleNotEnabled` at middleware.

---

# Module Disabled Behavior

When `module.hr` / `module.payroll` off for tenant:

| Behavior | Result |
|----------|--------|
| All `hr.*` / `payroll.*` / `ess.*` keys | Inactive |
| Navigation | Hidden |
| API | 403 Module Not Enabled |
| Existing role assignments | Preserved but ineffective |
| AI HR tools | `ModuleNotEnabled` |

---

# UI Permission Gating (reference for future UI)

| Screen | Minimum permission |
|--------|-------------------|
| HR Dashboard | `hr.access` |
| Employee directory | `hr.employee.view` |
| Create employee | `hr.employee.create` |
| Payroll runs | `payroll.run.view` |
| Calculate payroll | `payroll.run.calculate` |
| Approve payroll | `payroll.run.approve` |
| Bank export button | `payroll.bank_export` |
| ESS portal | `ess.access` |
| Sensitive tab (compensation) | `hr.sensitive.view` |

Server always re-validates — UI gating is convenience only.

---

# Child Documentation Roadmap

| Document | Uses this matrix |
|----------|------------------|
| `API.md` | Endpoint → permission mapping |
| `INTEGRATION.md` | Service calls check permissions |
| `AI.md` | Tool → permission matrix |
| Core role seeds | System role templates on install |
| UI prototype | Button visibility manifest |

**Registration:** Add HR permission groups to Core Permission Registry on module install per [PERMISSION_SYSTEM_ARCHITECTURE.md](../../02-core-platform/PERMISSION_SYSTEM_ARCHITECTURE.md).

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

**AgainERP HR & Payroll Permission Matrix** — enterprise authorization blueprint. Core RBAC first. Least privilege. SoD on payroll. AI contained. No code.
