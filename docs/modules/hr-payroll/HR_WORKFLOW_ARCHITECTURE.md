# HR & Payroll — Workflow Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll (unified enterprise suite)  
> **Document Type:** Workflow Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md) · [HR_DATABASE_ARCHITECTURE.md](./HR_DATABASE_ARCHITECTURE.md)  
> **Governance:** [WORKFLOW_ENGINE_ARCHITECTURE.md](../../core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md) · [APPROVAL_ENGINE_ARCHITECTURE.md](../../core/engines/APPROVAL_ENGINE_ARCHITECTURE.md) · [NOTIFICATION_ENGINE_ARCHITECTURE.md](../../core/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../core/ACTIVITY_CHATTER_ARCHITECTURE.md) · [WORKFLOW_REGISTRY.md](../../WORKFLOW_REGISTRY.md) · [PERMISSION_SYSTEM_ARCHITECTURE.md](../../core/PERMISSION_SYSTEM_ARCHITECTURE.md) · [AI_OS_ARCHITECTURE.md](../ai/AI_OS_ARCHITECTURE.md)

**No UI. No database schema. No API. No application code.**  
This document defines **how business processes flow** across AgainERP HR & Payroll — state machines, approval chains, notifications, activity, escalation, and audit. Foundation for UI design, database design, API design, automation engine, notification engine, and AI HR Assistant.

---

## Executive Summary

HR & Payroll workflows are **declarative processes** registered with the **Core Workflow Engine** and gated by the **Core Approval Engine**. HR and Payroll modules own **business rules and hooks**; Core owns **state, approval routing, notifications, and activity timeline**.

| Engine | HR & Payroll usage |
|--------|-------------------|
| **Workflow Engine** | All document lifecycles (`hr.leave`, `payroll.run`, `hr.recruitment`, …) |
| **Approval Engine** | Human gates on leave, corrections, payroll, loans, expenses |
| **Notification Engine** | Email, SMS, in-app on every transition |
| **Activity Engine** | Immutable timeline on every action |
| **Event Bus** | Cross-module integration (Accounting, Inventory) |

**Workflow IDs namespace:** `hr.*` · `payroll.*` · `ess.*`

---

## Workflow Philosophy

### Core belief

> **Process is configuration, not code.** Admins define chains; the platform enforces them; every step is audited.

HR & Payroll spans high-frequency operations (daily attendance) and high-risk operations (payroll lock, salary revision, termination). The workflow architecture separates:

| Layer | Responsibility |
|-------|----------------|
| **Platform** | State machine, approval inbox, SLA, escalation, notifications, activity |
| **HR / Payroll module** | Domain guards, calculations, checklist items, event payloads |
| **Integration** | Subscribers react to events — never bypass workflow |

### Design stance (adapted from enterprise HCM)

| Source pattern | AgainERP adaptation |
|----------------|---------------------|
| Odoo HR approvals | Manager → HR chains on leave and expense |
| Workday business processes | Lifecycle stages with checklist tasks |
| SAP workflow | Payroll run segregation of duties |
| ERPNext HRMS | Practical payroll: draft → submit → approve → pay |

AgainERP **does not** build a second workflow engine inside HR — all flows register with Core.

### Module off behavior

When HR & Payroll is disabled: workflow instances for `hr.*` and `payroll.*` do not start; pending items remain frozen; no new instances created; Core inbox hides HR items.

---

## Workflow Design Principles

| # | Principle | Rule |
|---|-----------|------|
| 1 | **One engine** | No custom `status` columns as source of truth — `workflow_instances.current_state_id` |
| 2 | **Approval-native** | Transitions that need human gate call Approval Engine |
| 3 | **Event on transition** | Every transition emits `core.workflow.transitioned` + module event |
| 4 | **Activity on action** | Every transition writes Activity log with actor and payload |
| 5 | **Idempotent hooks** | Module actions safe to retry (payroll calculate, attendance finalize) |
| 6 | **SoD enforced** | Submitter ≠ approver; calculator ≠ payroll approver |
| 7 | **Company scoped** | Workflow definitions and instances carry `company_id` |
| 8 | **Configurable chains** | Approval policies per company/branch/amount/days |
| 9 | **Fail closed** | Guard failure blocks transition; no silent skip |
| 10 | **AI suggests, human approves** | AI recommendations never auto-approve payroll or termination |
| 11 | **Immutable posted state** | Terminal payroll states require reversal workflow |
| 12 | **Checklist optional** | Onboarding/exit use checklist tasks parallel to workflow |

### Standard workflow instance fields (conceptual)

| Field | Purpose |
|-------|---------|
| `workflow_id` | e.g. `hr.leave` |
| `entity_type` | e.g. `hr_leave_request` |
| `entity_id` | Record UUID |
| `company_id` | Scope |
| `branch_id` | Optional branch policy |
| `current_state_id` | Active state |
| `initiated_by` | User |
| `approval_request_id` | Link to Core approval when pending |

---

## Approval Architecture

HR & Payroll consumes the **Core Approval Engine** per [APPROVAL_ENGINE_ARCHITECTURE.md](../../core/engines/APPROVAL_ENGINE_ARCHITECTURE.md).

### Integration pattern

```text
User action (submit)
        ↓
Workflow transition → pending_approval
        ↓
Approval Engine: resolve policy → create approval_request → assign steps
        ↓
Approver acts (approve / reject / delegate)
        ↓
All steps complete → Workflow transition → approved
        ↓
Module hook (e.g. deduct leave balance, lock payroll)
        ↓
Event + Notification + Activity
```

### HR approval policies (registered)

| Policy ID | Document | Condition | Default chain |
|-----------|----------|-----------|---------------|
| `hr.leave.standard` | Leave request | days ≤ 3 | `line_manager` |
| `hr.leave.extended` | Leave request | days > 3 | `line_manager_hr` |
| `hr.leave.unpaid` | Leave request | unpaid type | `line_manager_hr` |
| `hr.attendance.correction` | Attendance correction | any | `line_manager_hr` |
| `hr.overtime.standard` | OT request | hours ≤ 4 | `line_manager` |
| `hr.overtime.extended` | OT request | hours > 4 | `line_manager_hr` |
| `hr.loan.standard` | Employee loan | principal ≤ threshold | `manager_hr` |
| `hr.loan.high` | Employee loan | principal > threshold | `manager_hr_finance` |
| `hr.advance.standard` | Salary advance | amount ≤ threshold | `manager_hr` |
| `hr.advance.high` | Salary advance | amount > threshold | `manager_hr_finance` |
| `hr.expense.standard` | Expense claim | amount ≤ threshold | `line_manager` |
| `hr.expense.high` | Expense claim | amount > threshold | `line_manager_finance` |
| `hr.travel.standard` | Travel request | any | `line_manager_hr` |
| `hr.recruitment.requisition` | Job requisition | any | `hiring_manager_hr` |
| `hr.recruitment.offer` | Offer letter | comp above band | `hr_manager_director` |
| `hr.salary.revision` | Salary revision | % change > threshold | `hr_manager_finance` |
| `payroll.run.standard` | Payroll run | any | `payroll_officer_hr_manager` |
| `payroll.run.high` | Payroll run | total > threshold | `payroll_officer_hr_finance` |
| `hr.promotion.recommendation` | Promotion | any | `manager_hr` |
| `hr.training.request` | Training enrollment | cost > threshold | `manager_hr` |
| `hr.asset.request` | Asset request | any | `manager_it_hr` |
| `ess.profile.update` | Profile change | sensitive fields | `hr_review` |

### Approval chain types used

| Type | HR example |
|------|------------|
| **Single** | Half-day leave → manager only |
| **Multi-level sequential** | Loan → manager → HR → finance |
| **Parallel** | Offer approval: HR + Finance simultaneously |
| **Conditional** | Leave days > 3 adds HR step |
| **Role-based** | `hr.leave.approve`, `payroll.run.approve` |
| **Amount-based** | Loan principal tiers |
| **Company-based** | Different chains per `company_id` in group |

### Separation of duties (HR-specific)

| Rule | Enforcement |
|------|-------------|
| Employee cannot approve own leave | SoD on approval step |
| Payroll calculator cannot approve same run | `payroll.runs.create` ≠ `payroll.runs.approve` |
| Payroll approver cannot post to GL alone | Requires `payroll.runs.post` + Accounting period open |
| HR who created offer cannot approve offer | Recruitment SoD |
| Manager cannot approve own OT | Route to skip-level manager |

---

## Escalation Architecture

Escalation is **Core Approval Engine** capability — HR registers SLA per policy.

### Default SLA matrix

| Workflow | Step | SLA | Escalate to |
|----------|------|-----|-------------|
| Leave request | Manager | 24h | Skip-level manager |
| Leave request | HR | 48h | HR Manager |
| Attendance correction | Manager | 48h | Department head |
| Overtime | Manager | 24h | Department head |
| Payroll run | HR Manager | 4h (pay day) | Company Admin |
| Loan | Finance | 72h | Finance Controller |
| Expense | Manager | 48h | Department head |

### Escalation flow

```text
Step assigned → SLA timer starts
        ↓
Reminder at 50% SLA (in-app + email)
        ↓
SLA breached → auto-escalate to fallback approver
        ↓
Activity: escalation event logged
        ↓
Notification: escalation alert to original + new approver
```

### Delegation

Out-of-office delegation via Core — approver assigns delegate; inbox routes to `delegate_user_id`; audit shows both names.

---

## Notification Architecture

HR & Payroll **emits notification intents** — Core Notification Engine delivers per [NOTIFICATION_ENGINE_ARCHITECTURE.md](../../core/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md).

### Trigger model

```text
Workflow transition OR domain event
        ↓
HR notification rule (template + recipients)
        ↓
Core: render template → check preferences → queue → channel adapter
        ↓
Delivery log + Activity (optional)
```

### HR notification categories

| Category | Examples |
|----------|----------|
| `hr.approval.pending` | Leave, OT, loan awaiting approver |
| `hr.approval.decided` | Approved/rejected to requester |
| `hr.payroll.payslip` | Payslip published |
| `hr.attendance.alert` | Missing punch, late pattern |
| `hr.document.expiry` | Passport/visa expiring |
| `hr.onboarding.task` | Checklist item assigned |
| `hr.exit.clearance` | Pending clearance step |
| `hr.announcement` | Company broadcast |
| `hr.escalation` | SLA breach |

### Channels

| Channel | Use case | Status |
|---------|----------|--------|
| **In-app** | All approvals, alerts | Active |
| **Email** | Payslip, offer letter, leave decision | Active |
| **SMS** | Urgent approval, OTP (ESS) | Active |
| **WhatsApp** | Payslip link, approval reminder | Future |
| **Push** | Mobile ESS | Future |

### Recipient resolution

| Role | Resolution |
|------|------------|
| Requester | `employee.user_id` or `contact.email` |
| Line manager | `hr_employees.manager_id` → user |
| HR pool | Role `HR Executive` scoped to company |
| Payroll officer | Role `Payroll Officer` |
| Finance | Policy chain step assignee |

---

## Activity Log Architecture

Every workflow action generates Activity entries per [ACTIVITY_CHATTER_ARCHITECTURE.md](../core/ACTIVITY_CHATTER_ARCHITECTURE.md).

### Mandatory logging points

| Point | Activity type |
|-------|---------------|
| Workflow instance created | `create` |
| State transition | `status_change` |
| Field change on submit | `update` + field diff |
| Approval submitted | `approval` |
| Approval decided | `approved` / `rejected` |
| Escalation | `system` |
| Payroll calculation | `workflow` |
| Soft delete | `delete` |
| Restore | `restore` |

### HR domain activity types (extended)

`transferred` · `promoted` · `salary_changed` · `attendance_changed` · `leave_changed` · `payroll_locked` · `payroll_posted` · `asset_assigned` · `asset_returned` · `hired` · `terminated`

### Entity registration

All workflow-backed entities register `entity_type` with Activity Engine: `hr_employee`, `hr_leave_request`, `hr_attendance`, `payroll_run`, `payroll_payslip`, `hr_candidate`, `hr_loan`, etc.

---

## Multi Company Workflow Rules

Per [database/multi-company.md](../../database/multi-company.md).

| Rule | Behavior |
|------|----------|
| **Instance scope** | Every workflow instance has `company_id` |
| **Policy resolution** | Policies match `company_id` first; tenant default fallback |
| **Approver pool** | Approvers must have role in same company |
| **Cross-company transfer** | Closes workflow on company A employee; starts onboarding on company B |
| **Payroll run** | Never spans companies — one run = one company |
| **Group admin** | May view consolidated inbox; cannot approve without company role |
| **Inter-company loan** | Not supported — loan tied to employing company |

---

## Multi Branch Workflow Rules

| Rule | Behavior |
|------|----------|
| **Branch policy override** | Optional `branch_id` on approval policy |
| **Manager scope** | Manager approves only direct reports in allowed branches |
| **Attendance device** | Sync scoped to device `branch_id` |
| **Holiday calendar** | Branch-specific holidays affect attendance engine |
| **ESS check-in** | Validates employee primary or allowed branch |
| **Announcement** | Scope: company, branch, or department |

---

# Employee Lifecycle Workflow

**Workflow ID:** `hr.employee.lifecycle`  
**Model:** `hr_employees` (master state) + parallel sub-workflows

```text
Candidate
    ↓
Recruitment          (hr.recruitment)
    ↓
Interview
    ↓
Selection
    ↓
Offer                (hr.offer)
    ↓
Joining              (hr.onboarding)
    ↓
Probation            (employment_status = on_probation)
    ↓
Confirmation
    ↓
Promotion            (hr.promotion) — may repeat
    ↓
Transfer             (hr.transfer) — may repeat
    ↓
Salary Revision      (payroll.salary_revision) — may repeat
    ↓
Resignation          (hr.resignation)
    ↓
Exit Clearance       (hr.exit_clearance)
    ↓
Final Settlement     (payroll.final_settlement)
    ↓
Archive              (employment_status = archived)
```

### Stage reference

| Stage | States | Key actors | Events |
|-------|--------|------------|--------|
| **Candidate** | Pre-employee in `hr_candidates` | Recruiter | `hr.candidate.created` |
| **Recruitment** | Pipeline stages | HR, hiring manager | `hr.recruitment.stage_changed` |
| **Interview** | Per-round feedback | Interviewers | `hr.interview.completed` |
| **Selection** | Shortlist → selected | Hiring committee | `hr.candidate.selected` |
| **Offer** | draft → pending_approval → sent → accepted/rejected | HR, candidate | `hr.offer.sent`, `hr.offer.accepted` |
| **Joining** | Onboarding checklist active | HR, IT, manager | `hr.employee.hired` |
| **Probation** | `on_probation` | Manager | `hr.probation.review_due` |
| **Confirmation** | `active` after approval | Manager, HR | `hr.employee.confirmed` |
| **Promotion** | Position/grade change | Manager, HR | `hr.employee.promoted` |
| **Transfer** | Dept/branch/company move | HR | `hr.employee.transferred` |
| **Salary revision** | Effective-dated comp change | HR, Finance | `payroll.structure.changed` |
| **Resignation** | Notice period tracking | Employee, manager | `hr.resignation.submitted` |
| **Exit clearance** | Multi-dept checklist | HR, IT, Finance | `hr.exit.clearance_pending` |
| **Final settlement** | F&F payroll run | Payroll | `payroll.final_settlement.completed` |
| **Archive** | PII retention policy | HR Admin | `hr.employee.archived` |

---

# Recruitment Workflow

**Workflow ID:** `hr.recruitment`  
**Model:** `hr_job_requisitions` · `hr_candidates`

```text
Job Requisition (draft)
        ↓
Approval                    [policy: hr.recruitment.requisition]
        ↓
Job Posting (open)
        ↓
Application Collection
        ↓
Screening
        ↓
Interview                     [sub-workflow: hr.interview per stage]
        ↓
Evaluation
        ↓
Offer                         [workflow: hr.offer]
        ↓
Acceptance
        ↓
Hiring
        ↓
Employee Creation             [triggers hr.onboarding]
```

### States: Job Requisition

| State | Description |
|-------|-------------|
| `draft` | HR drafting requisition |
| `pending_approval` | Awaiting hiring manager / HR approval |
| `approved` | Headcount approved |
| `open` | Accepting applications |
| `on_hold` | Paused |
| `filled` | All openings filled |
| `cancelled` | Closed without fill |

### States: Candidate

| State | Description |
|-------|-------------|
| `applied` | Application received |
| `screening` | HR screen in progress |
| `interview` | In interview loop |
| `evaluation` | Panel review |
| `offered` | Offer extended |
| `hired` | Accepted → employee created |
| `rejected` | Terminal |
| `withdrawn` | Candidate withdrew |

### Role responsibilities

| Role | Actions |
|------|---------|
| **Hiring Manager** | Approve requisition, interview feedback, selection |
| **HR Executive** | Post job, screen, schedule interviews, extend offer |
| **HR Manager** | Approve offer above band, override rejection |
| **Recruiter** | Pipeline management, candidate communication |
| **Finance** | Parallel approve on high-comp offers |

### Activity & notifications

| Transition | Activity | Notification |
|------------|----------|--------------|
| Requisition submitted | `approval` | Approver inbox |
| Candidate applied | `create` | Recruiter in-app |
| Interview scheduled | `assignment` | Candidate email |
| Offer sent | `status_change` | Candidate email |
| Hired | `hired` | HR + IT onboarding tasks |

---

# Employee Onboarding Workflow

**Workflow ID:** `hr.onboarding`  
**Trigger:** `hr.offer.accepted`

```text
Offer Accepted
        ↓
Employee Record Creation      [contact + hr_employees draft]
        ↓
Document Collection           [checklist: ID, tax, bank]
        ↓
Department Assignment
        ↓
Manager Assignment
        ↓
Asset Assignment              [optional: laptop, access card]
        ↓
Biometric Enrollment          [device user map created]
        ↓
Payroll Enrollment            [structure assignment draft]
        ↓
Employee Activation           [status: active or on_probation]
```

### Checklist system

Parallel **checklist tasks** (not blocking workflow engine — tracked as `hr_onboarding_checklist_items`):

| Task | Owner | Required |
|------|-------|----------|
| Collect government ID | HR | Yes |
| Collect tax declaration | HR | Yes |
| Bank account details | HR / Employee | Yes |
| Signed contract | HR | Yes |
| IT account creation | IT | Yes |
| Asset issue | IT / HR | Optional |
| Biometric enrollment | HR | Yes |
| Payroll structure assign | Payroll | Yes |
| Orientation schedule | HR | Optional |
| Emergency contact | Employee | Yes |

### Checklist states

`pending` → `in_progress` → `completed` / `waived` (with approval)

**Gate:** Employee Activation requires all **required** checklist items `completed` or `waived`.

### Events

`hr.onboarding.started` · `hr.onboarding.checklist_completed` · `hr.onboarding.completed` · `hr.employee.hired`

---

# Attendance Workflow

Enterprise attendance supports multiple ingestion paths converging on one engine.

### Supported sources

| Source | Workflow entry | Integration |
|--------|----------------|-------------|
| **ZKTeco** | Device log → sync | Connector service |
| **eSSL** | Device log → sync | Connector service |
| **Fingerprint** | Biometric punch | Via device connector |
| **Face recognition** | Biometric punch | Via device connector |
| **Manual attendance** | HR/manager entry | `hr.attendance.manual` |
| **Bulk import** | CSV staging → validate | `hr.attendance.import` |
| **Mobile attendance** | ESS check-in | Future — `hr.attendance.mobile` |

---

## Attendance Process

**Workflow ID:** `hr.attendance.daily` (per employee per day)

```text
Device Log / Manual / Import
        ↓
Sync Service                  [scheduled or push API]
        ↓
Raw Attendance                [hr_attendance_logs — immutable]
        ↓
Validation                    [employee map, duplicate, clock skew]
        ↓
Attendance Engine             [pair punches, apply shift]
        ↓
Attendance Status             [present, absent, late, …]
        ↓
Late Calculation              [grace rules, late minutes]
        ↓
Overtime Calculation          [OT eligibility flag]
        ↓
Attendance Finalization       [lock for payroll period]
```

### Stage detail

| Stage | Responsibility | Output |
|-------|----------------|--------|
| **Device log** | Hardware/SDK | Raw punch with device_user_id |
| **Sync service** | Connector worker | Batched ingest; `hr.device.sync.completed` |
| **Raw attendance** | HR module | Append-only log rows |
| **Validation** | HR module | Reject unknown user, duplicate within window |
| **Attendance engine** | HR module | First-in/last-out; cross-midnight shift attribution |
| **Attendance status** | HR module | Enum: present, absent, late, half_day, leave, holiday, weekend, wfh, outdoor |
| **Late calculation** | HR module | Apply `hr_shift_rules` grace and tiers |
| **OT calculation** | HR module | Flag eligible OT minutes (approval separate) |
| **Finalization** | HR module | `hr.attendance.finalized` → Payroll input |

### Sync service workflow

**Workflow ID:** `hr.attendance.sync`

```text
scheduled / webhook trigger
        ↓
connect device
        ↓
pull logs (since last_sync_at)
        ↓
normalize payload
        ↓
write hr_attendance_logs
        ↓
queue attendance engine job
        ↓
update device last_sync_at
        ↓
on failure → retry + alert HR admin
```

### Manual / bulk paths

| Path | Flow |
|------|------|
| **Manual** | HR enters punch → validation → engine (source = manual) |
| **Bulk import** | Upload → staging → validate all → commit → engine batch |

---

## Attendance Correction Workflow

**Workflow ID:** `hr.attendance.correction`  
**Model:** `hr_attendance_corrections`

```text
Employee Request (ESS) / HR Entry
        ↓
Manager Review              [policy: hr.attendance.correction]
        ↓
HR Review                   [optional per company policy]
        ↓
Approval / Rejection
        ↓
Attendance Recalculation    [engine re-runs for date]
        ↓
Audit Log                   [original + corrected snapshot]
```

| State | Actor |
|-------|-------|
| `draft` | Employee / HR |
| `pending_manager` | Line manager |
| `pending_hr` | HR Executive |
| `approved` | System recalculates |
| `rejected` | Terminal — reason required |

**Events:** `hr.attendance.correction.submitted` · `hr.attendance.corrected` · `hr.attendance.correction.rejected`

**Payroll rule:** If period locked, correction creates adjustment for next open period.

---

# Shift Management Workflow

**Workflow ID:** `hr.shift`  
**Models:** `hr_shift_definitions` · `hr_shift_assignments`

```text
Shift Creation
        ↓
Shift Policy Setup          [grace, late, OT rules]
        ↓
Shift Assignment            [employee or rotation]
        ↓
Attendance Mapping          [engine uses shift for date]
        ↓
Payroll Impact              [night allowance, OT multiplier]
```

### Shift types

| Type | Workflow notes |
|------|----------------|
| **Fixed (General)** | Static start/end on assignment |
| **Rotational** | `hr_shift_rotations` auto-advances pattern |
| **Flexible** | Core hours window; status from hours worked |
| **Night** | `crosses_midnight`; night allowance component |

### Assignment workflow

```text
draft assignment
        ↓
validate (no overlap, within policy)
        ↓
active (effective_from)
        ↓
superseded (new assignment effective)
        ↓
archived
```

**Event:** `hr.shift.assigned` → attendance engine invalidates cache for employee date range.

---

# Leave Workflow

**Workflow ID:** `hr.leave`  
**Model:** `hr_leave_requests`

```text
Employee Request (draft)
        ↓
Submit
        ↓
Manager Approval            [policy: hr.leave.standard / extended]
        ↓
HR Approval                 [if policy requires]
        ↓
Leave Balance Validation    [guard: sufficient balance unless negative allowed]
        ↓
Attendance Adjustment       [mark dates as leave on hr_attendance]
        ↓
Payroll Impact Flag         [paid vs unpaid leave type]
        ↓
Final Approval → taken
```

### States

| State | Description |
|-------|-------------|
| `draft` | Employee editing |
| `pending_manager` | Awaiting manager |
| `pending_hr` | Awaiting HR |
| `approved` | Balance deducted; calendar updated |
| `rejected` | Terminal |
| `cancelled` | Employee/HR cancel before start |
| `taken` | Leave dates passed |

### Guards

| Guard | Rule |
|-------|------|
| Balance | `closing_balance >= days_count` OR policy allows negative |
| Overlap | No duplicate approved leave same dates |
| Notice | Min advance days per leave type |
| Blackout | Company blackout dates block submit |
| Probation | Type excluded during probation |

### Cancellation sub-flow

```text
approved → cancel requested → manager approve → restore balance → revert attendance
```

**Events:** `hr.leave.requested` · `hr.leave.approved` · `hr.leave.rejected` · `hr.leave.cancelled`

---

## Leave Accrual Workflow

**Workflow ID:** `hr.leave.accrual` (scheduled batch)

```text
Monthly Accrual Job         [cron: 1st of month]
        ↓
For each employee × leave type
        ↓
Apply accrual policy        [rate, probation exclusion]
        ↓
Balance Update              [hr_leave_balances]
        ↓
Year-end: Carry Forward     [max cap, expiry]
        ↓
Optional: Encashment        [hr.leave.encashment workflow]
```

### Carry forward workflow

```text
year_end_trigger
        ↓
calculate eligible carry
        ↓
apply cap
        ↓
expire excess (forfeit or encash per policy)
        ↓
write opening balance new year
```

### Encashment workflow

**Workflow ID:** `hr.leave.encashment`

```text
request (exit or annual window)
        ↓
HR approval
        ↓
calculate encashment amount
        ↓
payroll component input
        ↓
deduct from balance
```

---

# Overtime Workflow

**Workflow ID:** `hr.overtime`

```text
Attendance Generated          [OT minutes flagged by engine]
        ↓
Overtime Eligibility          [policy: role, day type, caps]
        ↓
Employee Request              [optional: pre-approval mode]
        ↓
Manager Approval
        ↓
HR Approval                   [if hours > threshold]
        ↓
Payroll Integration           [approved OT → payroll run input]
```

### Overtime calculation methods

| Method | Description | When used |
|--------|-------------|-----------|
| **Attendance-derived** | Engine computes minutes past shift end | Default |
| **Pre-approved** | Request before working OT | Manufacturing, field |
| **Flat rate** | Fixed amount per OT day | Contract workers |
| **Multiplier tiers** | 1.5× weekday, 2× weekend/holiday | Union / statutory |
| **Comp-off** | OT credits leave balance instead of pay | Policy flag |
| **Project-coded** | OT linked to project for billing | Timesheet integration |

### States

`draft` → `pending_manager` → `pending_hr` → `approved` → `processed_in_payroll` / `rejected`

**Event:** `hr.overtime.approved` → Payroll subscribes.

---

# Loan Workflow

**Workflow ID:** `payroll.loan`  
**Model:** `payroll_loans`

```text
Employee Request
        ↓
Manager Approval
        ↓
HR Review
        ↓
Finance Approval            [policy: hr.loan.high if above threshold]
        ↓
Disbursement                [Accounting payment event — future]
        ↓
Payroll Deduction           [installment schedule active]
        ↓
Completion                  [all installments paid]
```

### States

| State | Description |
|-------|-------------|
| `draft` | Employee application |
| `pending_approval` | Multi-step approval active |
| `approved` | Schedule generated |
| `disbursed` | Funds released |
| `active` | Deductions in progress |
| `closed` | Fully repaid |
| `written_off` | Finance write-off approval |
| `rejected` | Terminal |

**Events:** `payroll.loan.approved` · `payroll.loan.disbursed` · `payroll.loan.instalment_deducted` · `payroll.loan.closed`

---

# Salary Advance Workflow

**Workflow ID:** `payroll.advance`  
**Model:** `payroll_salary_advances`

```text
Request
        ↓
Approval                    [manager + HR; finance if high]
        ↓
Payment                     [disbursement]
        ↓
Recovery Setup              [N payroll deductions]
        ↓
Payroll Deduction           [per payslip until cleared]
```

Shorter chain than loan — typically single recovery or 1–3 pay periods.

---

# Payroll Workflow

**Workflow ID:** `payroll.run`  
**Model:** `payroll_runs`

Highly detailed payroll process — the financial critical path.

---

## Payroll Process

```text
Attendance Finalized          [hr.attendance.finalized for period]
        ↓
Leave Finalized               [approved leave applied to attendance]
        ↓
Overtime Finalized            [approved OT rows ready]
        ↓
Loan Calculation              [due installments for period]
        ↓
Advance Recovery              [scheduled deductions]
        ↓
Salary Components Calculation [structure + formulas]
        ↓
Tax Calculation               [brackets, declarations, YTD]
        ↓
Payroll Generation            [payslips + lines per employee]
        ↓
Payroll Review                [exceptions report]
        ↓
Payroll Approval              [policy: payroll.run.standard / high]
        ↓
Payroll Lock                  [immutable — no recalc]
        ↓
Payslip Generation            [PDF + hash]
        ↓
Bank Export                   [file per bank template]
        ↓
Employee Access               [ESS publish]
        ↓
(Optional) Post to GL        [payroll.run.posted → Accounting]
```

### Payroll run states

| State | Description | Who |
|-------|-------------|-----|
| `draft` | Period selected; inputs gathering | Payroll Officer |
| `inputs_gathering` | Pulling attendance, leave, OT | System job |
| `calculated` | Payslips computed | System |
| `in_review` | Exceptions reviewed | Payroll Officer |
| `pending_approval` | Approval Engine active | HR Manager / Finance |
| `approved` | Human sign-off complete | Approvers |
| `locked` | Immutable | System |
| `published` | ESS access enabled | System |
| `posted` | GL journal created | Payroll + Accounting |
| `cancelled` | Void before lock only | Payroll Officer |

### Stage detail

| Stage | Input | Output | Event |
|-------|-------|--------|-------|
| **Attendance finalized** | `hr_attendance` locked rows | Payable days per employee | — |
| **Leave finalized** | Approved leave in period | LWP deduction flags | — |
| **Overtime finalized** | Approved OT | OT earning lines | — |
| **Loan calculation** | Active loans | Deduction lines | — |
| **Advance recovery** | Open advances | Deduction lines | — |
| **Salary components** | Structure + formulas | Earning/deduction lines | — |
| **Tax calculation** | Rules + YTD | Tax deduction lines | — |
| **Payroll generation** | All inputs | `payroll_payslips` + lines | `payroll.run.calculated` |
| **Payroll review** | Exceptions | Manual adjustments (draft only) | — |
| **Payroll approval** | Approval chain | `approved` state | `payroll.run.approved` |
| **Payroll lock** | — | No edits | `payroll.run.locked` |
| **Payslip generation** | Locked data | PDF + hash | `payroll.payslip.generated` |
| **Bank export** | Net pay totals | Bank file | `payroll.bank_export.created` |
| **Employee access** | Published payslips | ESS download | `payroll.payslip.published` |
| **Post to GL** | Summarized components | Journal entry | `payroll.run.posted` |

### Exception handling in review

| Exception | Resolution |
|-----------|------------|
| Missing attendance | Hold employee or use policy default |
| Negative net pay | Block or carry forward |
| New joiner mid-period | Pro-rate payable days |
| Terminated mid-period | F&F rules |
| Tax ceiling | YTD cap applied |

### Reversal workflow

**Workflow ID:** `payroll.run.reversal`

```text
posted run → reversal requested → finance approval → reversal run → offset journal
```

---

## Salary Revision Workflow

**Workflow ID:** `payroll.salary_revision`  
**Model:** `payroll_salary_revisions` / `payroll_employee_salaries`

```text
Request                     [HR or performance-triggered]
        ↓
Approval                    [HR Manager; Finance if > threshold]
        ↓
Effective Date              [close old row; open new row]
        ↓
Payroll Impact              [first affected run uses new structure]
        ↓
History Creation            [revision audit + activity]
```

**Events:** `payroll.structure.changed` · `salary_changed` activity on employee.

---

## Bonus Workflow

**Workflow ID:** `payroll.bonus`

```text
Bonus Definition              [type, formula, period]
        ↓
Eligibility Check             [employees, performance criteria]
        ↓
Approval                      [HR Manager / Finance]
        ↓
Payroll Integration           [one-off component on selected run]
```

States: `draft` → `eligibility_computed` → `pending_approval` → `approved` → `included_in_run` → `paid`

---

## Commission Workflow

**Workflow ID:** `payroll.commission`

```text
Sales Achievement             [Sales module event — service API]
        ↓
Commission Calculation        [rules engine]
        ↓
Approval                      [Sales Manager + Finance]
        ↓
Payroll Integration           [commission component on run]
```

**Subscribed event:** `sales.invoice.paid` or `sales.order.completed` (configurable) — **no cross-module DB read**.

---

# Performance Workflow

**Workflow ID:** `hr.performance`  
**Models:** `hr_performance_cycles` · `hr_performance_reviews`

```text
Goal Creation                 [cycle start — manager + employee]
        ↓
KPI Assignment
        ↓
Review Cycle Open
        ↓
Self Review
        ↓
Manager Review
        ↓
Final Evaluation              [rating consolidated]
        ↓
Promotion Recommendation      [optional workflow: hr.promotion]
        ↓
Salary Recommendation         [links payroll.salary_revision]
```

### Review states

| State | Actor |
|-------|-------|
| `draft` | HR sets up cycle |
| `active` | Goals assigned |
| `self_review_pending` | Employee |
| `manager_review_pending` | Manager |
| `calibration` | HR Manager (optional) |
| `completed` | Terminal |
| `cancelled` | HR Admin |

**Events:** `hr.appraisal.completed` · `hr.promotion.recommended`

---

# Training Workflow

**Workflow ID:** `hr.training`

```text
Training Request              [employee or manager]
        ↓
Approval                      [manager; HR if cost > threshold]
        ↓
Schedule                      [session created]
        ↓
Participation                 [enrolled → attended]
        ↓
Evaluation                    [feedback form]
        ↓
Certification                 [certificate issued if pass]
```

### States: enrollment

`requested` → `approved` → `enrolled` → `attended` / `no_show` → `evaluated` → `certified`

**Event:** `hr.training.completed` → may update `hr_employee_skills`.

---

# Asset Workflow

**Workflow ID:** `hr.asset`  
Integrates with Inventory via events (optional).

```text
Asset Purchase                [Inventory / Procurement]
        ↓
Inventory Receipt             [inventory module]
        ↓
HR Asset Register             [hr_assets created — UUID ref]
        ↓
Assignment                    [hr.asset.assignment workflow]
        ↓
Transfer                      [employee to employee]
        ↓
Return                        [exit or replacement]
        ↓
Damage                        [chargeback workflow optional]
        ↓
Replacement                   [new assignment linked]
        ↓
Disposal                      [retire asset]
```

### Assignment workflow

**Workflow ID:** `hr.asset.assignment`

```text
request / direct assign
        ↓
manager approve (if ESS request)
        ↓
IT/HR issue asset
        ↓
active custody
        ↓
return on exit or transfer
```

**Events:** `hr.asset.assigned` · `hr.asset.returned` · `hr.asset.damaged`

---

# Employee Self Service Workflow

ESS routes requests to domain workflows — ESS is a **channel**, not a separate engine.

| ESS action | Target workflow | Approval chain |
|------------|---------------|----------------|
| **Profile update** | `ess.profile` | HR review for sensitive fields |
| **Leave request** | `hr.leave` | Manager → HR |
| **Attendance correction** | `hr.attendance.correction` | Manager → HR |
| **Document submission** | `hr.document` | HR verify |
| **Loan request** | `payroll.loan` | Manager → HR → Finance |
| **Advance request** | `payroll.advance` | Manager → HR |
| **Asset request** | `hr.asset.assignment` | Manager → IT/HR |
| **Overtime request** | `hr.overtime` | Manager → HR |
| **Travel request** | `hr.travel` | Manager → HR |
| **Expense claim** | `hr.expense` | Manager → Finance |
| **Training request** | `hr.training` | Manager → HR |

### ESS request router

```text
ESS submit
        ↓
resolve request_type → start domain workflow
        ↓
unified "My Requests" view (all workflow instances for employee)
```

---

# Document Expiry Workflow

**Workflow ID:** `hr.document.expiry`

```text
Document Upload               [hr_employee_documents + attachment]
        ↓
Expiry Tracking               [expiry_date indexed]
        ↓
Reminder                      [30d, 14d, 7d before — notification job]
        ↓
Renewal                       [new version uploaded → old version archived]
        ↓
Archive                       [superseded or employee exit]
```

### Reminder escalation

| Days before expiry | Channel |
|--------------------|---------|
| 30 | In-app + email to employee |
| 14 | + manager copy |
| 7 | + HR copy |
| 0 (expired) | Block optional actions (e.g. overseas travel approval) |

**Event:** `hr.document.expiring` · `hr.document.expired`

---

# Approval Engine (Universal)

HR registers with the **platform Approval Engine** — HR does not implement a local approval system.

### Supported patterns (all via Core)

| Pattern | Configuration | HR example |
|---------|---------------|------------|
| **Single approval** | Chain length = 1 | Short leave |
| **Multi-level** | Sequential steps | Loan |
| **Sequential** | Step N before N+1 | Payroll run |
| **Parallel** | All steps same order | Offer: HR + Finance |
| **Conditional** | Policy conditions | Days > 3 adds HR |
| **Role-based** | `assigned_role` | `hr.leave.approve` |
| **Amount-based** | `field_path: amount` | Expense tiers |
| **Company-based** | `company_id` on policy | Group of companies |

### Approval request lifecycle

```text
created → step_1_pending → … → approved
                         ↘ rejected (terminal)
                         ↘ cancelled (by submitter if allowed)
```

### Inbox aggregation

All HR approvals appear in global `/inbox/approvals` with module badge `HR` or `Payroll`.

---

# Notification Workflow

### By trigger type

| Trigger | Template | Channels |
|---------|----------|----------|
| Approval pending | `hr_approval_pending` | In-app, email |
| Approval decided | `hr_approval_decided` | In-app, email |
| Reminder (SLA 50%) | `hr_approval_reminder` | In-app, email |
| Escalation | `hr_approval_escalated` | In-app, email, SMS |
| Payslip published | `hr_payslip_published` | Email, in-app |
| Leave approved | `hr_leave_approved` | In-app, email |
| Document expiry | `hr_document_expiry` | Email |
| Onboarding task | `hr_onboarding_task` | In-app |
| Exit clearance | `hr_exit_clearance` | In-app |

### WhatsApp (future)

Same template registry; channel adapter `whatsapp`; opt-in per employee notification preferences.

---

# Activity Log Workflow

Every workflow transition **must** call Activity Service.

### Logging contract

| Action | Required payload |
|--------|------------------|
| **Create** | entity_type, entity_id, actor, initial state |
| **Update** | field_changes[] |
| **Delete** | soft delete reason |
| **Approve** | approval_id, step, comment |
| **Reject** | approval_id, reason |
| **Transfer** | from_dept, to_dept, effective_date |
| **Promote** | from_position, to_position |
| **Salary change** | old_structure, new_structure, effective_date |
| **Attendance change** | original_snapshot, corrected_snapshot |
| **Leave change** | balance_before, balance_after |
| **Payroll change** | run_id, state, totals |
| **Asset change** | asset_id, employee_id, action |

### Workflow engine hook

```text
on_transition_success:
  1. Write activity_log
  2. Emit domain event
  3. Queue notifications
```

---

# Audit Workflow

Immutable audit trail for compliance — combines Activity Engine + domain history tables.

### Audit record structure (conceptual)

| Field | Description |
|-------|-------------|
| **Who** | `user_id`, `role`, `ip` (optional) |
| **When** | `timestamp` UTC |
| **What** | `action`, `entity_type`, `entity_id` |
| **Before value** | JSON snapshot or field diff |
| **After value** | JSON snapshot or field diff |
| **Reason** | User comment or system code |
| **Approval history** | `approval_request_id`, steps[] |

### High-audit workflows

| Workflow | Retention |
|----------|-----------|
| Payroll run | 7+ years |
| Payslip | 7+ years |
| Salary revision | Employment + 7 years |
| Termination | Permanent |
| Attendance correction | 3+ years |
| Loan / advance | Life of loan + 7 years |

### Audit export

Compliance export bundles Activity + approval history + payslip hashes for external auditor.

---

# AI Ready Workflows

AI OS participates as **assistant** — never bypasses Workflow or Approval Engine per [AI_OS_ARCHITECTURE.md](../ai/AI_OS_ARCHITECTURE.md).

### Workflows with AI augmentation (future phases)

| Workflow | AI capability | Human gate |
|----------|---------------|------------|
| **Attendance daily** | Anomaly detection (missing punch pattern) | HR reviews flag |
| **Attendance correction** | Suggest approve/deny based on history | Manager decides |
| **Leave** | Leave pattern detection, staffing conflict warning | Manager decides |
| **Payroll run** | Validation — outliers, negative net, tax sanity | Payroll Officer |
| **Performance** | Promotion suggestions from ratings + skills | HR Manager |
| **Employee lifecycle** | Attrition prediction risk score | HR views dashboard |
| **Training** | Training recommendations from skill gaps | Employee/manager opts in |
| **Recruitment** | Resume screening score | Recruiter decides |
| **Overtime** | Unusual OT spike explanation | HR investigates |

### AI workflow pattern

```text
Scheduled / event trigger
        ↓
AI Service analyzes (read-only APIs)
        ↓
Write insight to read model + activity_ai_actions
        ↓
Surface in UI / AI chat
        ↓
Optional: user invokes "Apply suggestion"
        ↓
Starts normal workflow (human approval required)
```

### AI tools linked to workflows (planned)

| Tool | Workflow |
|------|----------|
| `hr.explain_attendance_anomaly` | Attendance |
| `hr.suggest_leave_coverage` | Leave |
| `payroll.validate_run` | Payroll |
| `hr.suggest_promotion` | Performance |
| `hr.attrition_risk` | Lifecycle |
| `hr.recommend_training` | Training |

---

# Workflow Registry Entries

Register in [WORKFLOW_REGISTRY.md](../../WORKFLOW_REGISTRY.md) when Status → Active.

| Workflow ID | Model | States (summary) | Module | Status |
|-------------|-------|------------------|--------|--------|
| `hr.employee.lifecycle` | `hr_employees` | candidate → active → terminated → archived | hr | Planned |
| `hr.recruitment` | `hr_job_requisitions` | draft → approved → open → filled | hr | Planned |
| `hr.candidate` | `hr_candidates` | applied → … → hired/rejected | hr | Planned |
| `hr.onboarding` | `hr_employees` | checklist-driven → active | hr | Planned |
| `hr.leave` | `hr_leave_requests` | draft → pending → approved → taken | hr | Planned |
| `hr.leave.accrual` | batch | scheduled | hr | Planned |
| `hr.attendance.daily` | `hr_attendance` | open → finalized | hr | Planned |
| `hr.attendance.correction` | `hr_attendance_corrections` | draft → approved/rejected | hr | Planned |
| `hr.attendance.sync` | device job | running → completed/failed | hr | Planned |
| `hr.shift` | `hr_shift_assignments` | draft → active → superseded | hr | Planned |
| `hr.overtime` | `hr_overtime_requests` | draft → approved → processed | hr | Planned |
| `hr.performance` | `hr_performance_reviews` | draft → completed | hr | Planned |
| `hr.training` | `hr_training_enrollments` | requested → certified | hr | Planned |
| `hr.asset.assignment` | `hr_asset_assignments` | requested → active → returned | hr | Planned |
| `hr.document.expiry` | `hr_employee_documents` | active → renewal → archived | hr | Planned |
| `hr.exit_clearance` | checklist | open → cleared | hr | Planned |
| `payroll.run` | `payroll_runs` | draft → calculated → approved → locked → posted | payroll | Planned |
| `payroll.loan` | `payroll_loans` | draft → active → closed | payroll | Planned |
| `payroll.advance` | `payroll_salary_advances` | draft → recovered | payroll | Planned |
| `payroll.salary_revision` | `payroll_salary_revisions` | draft → effective | payroll | Planned |
| `payroll.bonus` | `payroll_bonuses` | draft → paid | payroll | Planned |
| `payroll.commission` | `payroll_commissions` | calculated → paid | payroll | Planned |
| `ess.profile` | `hr_ess_requests` | submitted → reviewed | ess | Planned |

---

# Cross-Module Workflow Integration

| External module | Event | HR/Payroll action |
|-----------------|-------|-------------------|
| **Accounting** | Period closed | Block payroll post |
| **Accounting** | Payment recorded | Mark expense reimbursed |
| **Inventory** | Asset received | Create `hr_assets` |
| **Sales** | Invoice paid | Commission workflow trigger |
| **Timesheet** | Approved hours | OT input validation |
| **Core Users** | User deactivated | Exit workflow reminder |

**Rule:** Integration via **events and service APIs only** — no workflow engine cross-module DB coupling.

---

## Child Documentation Roadmap

| Document | Depends on this blueprint |
|----------|---------------------------|
| `API.md` | Transition endpoints map to workflow actions |
| `Permissions.md` | Transition permissions per state |
| `INTEGRATION.md` | Event catalog per transition |
| `AI.md` | AI hook points per workflow |
| UI prototype | State bars, approval panels, checklists |

**Pre-code gate:** Status **Ready** per [GOVERNANCE.md](../../GOVERNANCE.md) before implementation.

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

**AgainERP HR & Payroll Workflow Architecture** — enterprise process blueprint. Platform engines first. Every step audited. AI-ready. No code.
