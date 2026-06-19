# HR & Payroll — Automation Engine Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll (unified enterprise suite)  
> **Document Type:** Automation Engine Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md) · [HR_WORKFLOW_ARCHITECTURE.md](./HR_WORKFLOW_ARCHITECTURE.md) · [HR_API_ARCHITECTURE.md](./HR_API_ARCHITECTURE.md) · [HR_AI_ASSISTANT_ARCHITECTURE.md](./HR_AI_ASSISTANT_ARCHITECTURE.md) · [HR_NOTIFICATION_ARCHITECTURE.md](./HR_NOTIFICATION_ARCHITECTURE.md)  
> **Governance:** [EVENT_ARCHITECTURE.md](../../02-core-platform/engines/EVENT_ARCHITECTURE.md) · [WORKFLOW_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md) · [APPROVAL_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) · [NOTIFICATION_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) · [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) · [queue-architecture.md](../../02-core-platform/engines/queue-architecture.md)

## Purpose
HR & Payroll module architecture — scope, features, data ownership, and integration boundaries.

## When To Read
Read this file only if working on HR & Payroll architecture, features, or module boundaries.

## Related Files
- [Dependencies](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next
- [Architecture](HR_PAYROLL_MASTER_ARCHITECTURE.md)

---

**No application code. No workflow state machine implementation.**  
Defines **rule-based, event-based, schedule-based, AI-assisted, and future autonomous automation** for AgainERP HR & Payroll. Foundation for automation engine, notification automation, approval escalation, AI-assisted operations, and future autonomous ERP.

---

## Executive Summary

| Principle | Rule |
|-----------|------|
| **Automation ≠ Workflow** | Workflow = document lifecycle; Automation = reactive rules + scheduled jobs |
| **Event-first** | Domain events primary trigger; cron secondary |
| **Service actions only** | Actions call HR/Payroll/Core services — never raw SQL |
| **Human gates** | Payroll lock, approvals, termination never fully autonomous |
| **Audited** | Every run → `hr_automation_runs` + Activity |
| **Composable** | Automations chain: trigger → conditions → actions |
| **Platform engines** | Notification, Approval, Workflow invoked — not duplicated |

```text
Trigger (event | schedule | manual | AI)
        │
        ▼
Condition Engine (filters, scope, field rules)
        │
        ▼
Rule Engine (match hr_automation_rules)
        │
        ▼
Action Engine (ordered actions, retry, idempotency)
        │
        ├──► HR/Payroll Services (create, update, calculate)
        ├──► Notification Engine (alert, digest)
        ├──► Approval Engine (create request, escalate)
        ├──► Workflow Engine (start instance, transition*)
        ├──► Reporting (generate, schedule)
        └──► AI OS (analysis task — advisory)
        │
        ▼
Audit: hr_automation_runs + activity + optional ai_automation_runs
```

\*Workflow transitions only when policy allows auto-trigger — never approval bypass.

**Registry namespace:** `hr.automation.*` · **Tables (conceptual):** `hr_automation_rules`, `hr_automation_runs`  
**Admin UI (future):** `/hr/settings/automation` · **API (future):** `/api/v1/hr/automation/`

---

# Automation Vision

### Vision statement

> **Eliminate repetitive HR and payroll operations through governed automation — while keeping humans in control of every consequential decision.**

### Automation vs workflow vs AI

| Layer | Question answered | Example |
|-------|-------------------|---------|
| **Workflow** | What states can this document be in? | Leave: draft → pending → approved |
| **Automation** | What should happen when X occurs? | On `hr.leave.approved` → notify manager + update balance |
| **AI Assistant** | What insight or draft should we suggest? | Attrition risk ranking |
| **AI Automation** | When should AI run analysis on an event? | On payroll calculated → anomaly scan |

### Five automation modes

| Mode | Trigger | Human role |
|------|---------|------------|
| **Rule based** | Static if-then rules | Configure rules |
| **Event based** | Domain events | Review exceptions |
| **Schedule based** | Cron | Review digests |
| **AI assisted** | Event + AI task | Approve AI proposals |
| **Future autonomous** | Multi-step agent plans | Checkpoint approvals |

### What HR automation is not

| Not | Why |
|-----|-----|
| Replacement for Approval Engine | Approvers are always human for HR gates |
| Replacement for Workflow Engine | State machines stay in Core Workflow |
| Silent payroll posting | Lock/post require human action |
| Unlogged side effects | Every action audited |

---

# Automation Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **Idempotent runs** | `idempotency_key` = rule_id + trigger_event_id |
| 2 | **Fail isolated** | One action failure does not block unrelated rules |
| 3 | **Retry with backoff** | Transient failures — max 3 retries |
| 4 | **Company scoped** | Every rule carries `company_id` |
| 5 | **Module enabled** | HR off → rules dormant |
| 6 | **Rate limits** | Per rule `max_runs_per_hour` |
| 7 | **Kill switch** | Company `hr.automation.enabled` + per-rule `enabled` |
| 8 | **SoD respect** | Automation actor = `system` or `service_account` — not approver |
| 9 | **Deterministic before AI** | Payroll math = engine; AI flags only |
| 10 | **Observable** | Run status, duration, impact count in admin UI |

---

# Human In The Loop Strategy

```text
Automation classifies each action:
  AUTO_SAFE     → execute immediately (notifications, tasks, reads)
  AUTO_DRAFT    → create draft record — human submits
  AUTO_PROPOSE  → AI/workflow proposal — human applies
  AUTO_FORBIDDEN → never automated (approve, lock, terminate, bank export)
```

| Category | Examples |
|----------|----------|
| **Runs automatically** | Reminders, accrual batch, biometric sync, missing punch alert, report schedule |
| **Creates draft / task** | Onboarding checklist item, training enrollment proposal |
| **Requires approval** | Salary revision draft → workflow; AI promotion suggestion |
| **AI recommends only** | Attrition risk, leave abuse pattern, payroll anomaly narrative |
| **Never automated** | Leave approve, payroll lock, loan approve, termination, permission grant |

---

# Automation Governance

| Control | Owner |
|---------|-------|
| **Global enable** | Company Admin — `hr.automation.manage` |
| **Rule CRUD** | HR Admin / Payroll Admin per domain |
| **AI automation** | Requires `ai.automation.enabled` + `hr.automation.manage` |
| **Production rules** | Draft → test → active lifecycle |
| **Template library** | Platform ships default rules — tenant clones/customizes |
| **Change audit** | Rule edits → Activity on `hr_automation_rules` |

### Rule lifecycle

```text
draft → test (sandbox company) → active → disabled → archived
```

---

# Automation Security

| Control | Detail |
|---------|--------|
| **Permission** | `hr.automation.manage`, `hr.automation.view`, `payroll.automation.manage` |
| **Execution identity** | `service_account:hr_automation` — narrow scoped JWT |
| **Data scope** | Rules cannot widen beyond creator's record rules |
| **Sensitive actions** | Bank, salary actions require explicit rule flag + audit |
| **Cross-tenant** | Impossible — `tenant_id` enforced at trigger |
| **Webhook actions** | HMAC signed outbound only |

---

# Automation Engine Overview

## Component architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    HR Automation Engine (module layer)                   │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────────────┤
│  Trigger    │  Condition  │    Rule     │   Action    │  Run Orchestrator│
│  Engine     │  Engine     │   Engine    │   Engine    │  (queue worker)  │
└──────┬──────┴──────┬──────┴──────┬──────┴──────┬──────┴────────┬────────┘
       │             │             │             │               │
       ▼             ▼             ▼             ▼               ▼
  Event Bus      Field/role    hr_automation  Service APIs   hr_automation_runs
  Cron scheduler  filters       _rules match   Core engines
  Manual API                     priority order
  AI event hook
```

| Component | Responsibility |
|-----------|----------------|
| **Trigger engine** | Normalize event, schedule, manual, AI into `AutomationTrigger` |
| **Condition engine** | Evaluate JSON conditions against payload + context |
| **Rule engine** | Match active rules; sort by priority |
| **Action engine** | Execute action list sequentially or parallel (config) |
| **Notification engine** | Invoked for `send_notification` actions |
| **Approval engine** | Invoked for `create_approval`, `escalate` |
| **AI engine integration** | Queue `workforce_agent` task — no direct write |

---

# Automation Types

| Type | Trigger | Latency | Example |
|------|---------|---------|---------|
| **Immediate** | Domain event | Seconds | Leave approved → balance deduct |
| **Scheduled** | Cron | Fixed time | Daily absence digest 07:00 |
| **Conditional** | Event + conditions | Seconds | OT > 2h → manager alert |
| **Recurring** | Cron + interval | Daily/weekly/monthly | Leave accrual monthly |
| **Cross module** | External event | Seconds | `payroll.run.posted` → Accounting |
| **AI assisted** | Event → AI task | Minutes | Payroll calculated → anomaly scan |

---

# Trigger Architecture

### Trigger types

| Type | Code | Source |
|------|------|--------|
| Record created | `record.created` | `hr.employee.hired`, `hr.candidate.applied` |
| Record updated | `record.updated` | `hr.employee.updated` |
| Record approved | `record.approved` | `hr.leave.approved`, `payroll.run.approved` |
| Record rejected | `record.rejected` | `hr.leave.rejected` |
| Date based | `date.due` | Probation end, document expiry, anniversary |
| Attendance | `hr.attendance.*` | See attendance section |
| Leave | `hr.leave.*` | Request, approve, accrual |
| Payroll | `payroll.*` | Run lifecycle |
| Performance | `hr.performance.*` | Cycle, review due |
| Training | `hr.training.*` | Enroll, complete |
| Asset | `hr.asset.*` | Assign, return |
| AI | `ai.*` | `ai.task.completed`, `ai.automation.run` |
| Manual | `manual` | Admin "run now" |
| Schedule | `cron` | `0 6 1 * *` |

### Trigger envelope (conceptual)

| Field | Description |
|-------|-------------|
| `trigger_id` | UUID |
| `trigger_type` | event, cron, manual, ai |
| `trigger_key` | e.g. `hr.leave.approved` |
| `company_id` | Scope |
| `entity_type` | `hr_leave_request` |
| `entity_id` | UUID |
| `payload` | Event JSON snapshot |
| `occurred_at` | Timestamp |

### HR event trigger catalog (automation-relevant)

| Event | Typical automations |
|-------|---------------------|
| `hr.employee.hired` | Onboarding tasks, IT notification, ESS welcome |
| `hr.employee.probation_due` | Manager reminder |
| `hr.employee.confirmed` | Status update notification |
| `hr.employee.terminated` | Exit checklist, access revoke task |
| `hr.attendance.missing_punch` | Employee + manager alert |
| `hr.attendance.late` | Manager digest |
| `hr.attendance.absent` | Coverage alert |
| `hr.attendance.finalized` | Payroll prep unlock |
| `hr.device.sync.failed` | HR admin critical alert |
| `hr.leave.requested` | Approval routing notification |
| `hr.leave.approved` | Balance update, calendar sync |
| `hr.leave.balance_low` | Employee reminder |
| `payroll.period.opened` | Payroll prep automation chain |
| `payroll.run.calculated` | Validation + AI audit task |
| `payroll.run.locked` | Payslip publish, archive |
| `hr.document.expiring` | Renewal task |
| `hr.training.completed` | Certificate automation |

---

# Condition Engine

### Condition types

| Type | Operators | Example |
|------|-----------|---------|
| **Field based** | eq, ne, gt, lt, in, contains | `leave_type = ANNUAL` |
| **Role based** | actor role in list | `submitter.role = employee` |
| **Department** | dept_id in subtree | `employee.department = Sales` |
| **Branch** | branch_id match | `branch = DHK-01` |
| **Company** | company_id | Always implicit |
| **Payroll** | amount thresholds, component | `net_pay > 500000` |
| **Performance** | rating, cycle | `overall_rating < 3` |
| **Custom** | expression DSL (sandboxed) | `days_until_expiry <= 30` |

### Evaluation order

```text
1. Company + module enabled
2. Rule enabled + schedule window
3. Trigger key match
4. All conditions AND (optional OR groups)
5. Rate limit not exceeded
```

### Condition context

Built from: event payload, entity snapshot (service fetch), actor user, tenant settings, analytics cache (read-only).

---

# Action Engine

### Supported actions

| Action | Code | Risk | Engine |
|--------|------|------|--------|
| Create record | `create_record` | Medium | HR/Payroll Service |
| Update record | `update_record` | Medium | HR/Payroll Service |
| Assign user | `assign_user` | Low | Task/checklist |
| Send notification | `send_notification` | Low | Notification Engine |
| Create task | `create_task` | Low | Checklist / task queue |
| Create approval | `create_approval` | Medium | Approval Engine |
| Generate report | `generate_report` | Low | Reporting API |
| Escalate request | `escalate` | Medium | Approval escalation |
| Trigger AI analysis | `ai_analyze` | Low | AI OS task queue |
| Start workflow | `start_workflow` | Medium | Workflow Engine |
| Cross module | `cross_module_event` | Varies | Event publish |
| Webhook | `webhook_outbound` | Medium | Integration layer |

### Action execution

```text
For each matched rule (priority desc):
  For each action in rule.actions[] (sequential default):
    Execute with retry policy
    Log action result on hr_automation_runs
    On AUTO_FORBIDDEN → skip + audit warning
    On failure → continue or abort per rule.on_failure
```

---

# Employee Automations

| Automation ID | Trigger | Conditions | Actions | Approval |
|---------------|---------|------------|---------|----------|
| AUTO-HR-EMP-001 | `hr.employee.hired` | — | Create onboarding checklist; notify IT, manager; ESS welcome | None |
| AUTO-HR-EMP-002 | `date.due` probation_end - 7d | status=on_probation | Notify manager + HR; create review task | None |
| AUTO-HR-EMP-003 | `hr.employee.probation_due` | — | Reminder escalation if no confirmation | None |
| AUTO-HR-EMP-004 | `date.due` promotion_review | performance cycle active | Notify HR | None |
| AUTO-HR-EMP-005 | `payroll.salary_revision.due` | revision pending | Notify payroll + HR | None |
| AUTO-HR-EMP-006 | `hr.document.expiring` | days <= 30 | Notify employee + HR; create renewal task | None |
| AUTO-HR-EMP-007 | `date.anniversary` work | — | Notify employee + manager (optional) | None |
| AUTO-HR-EMP-008 | `date.birthday` | — | Notify employee (policy opt-in) | None |
| AUTO-HR-EMP-009 | `hr.resignation.submitted` | — | Start exit workflow; clearance checklist | Workflow |
| AUTO-HR-EMP-010 | `hr.employee.terminated` | — | Revoke access task; asset return reminder | Human tasks |

---

# Recruitment Automations

| Automation ID | Trigger | Actions |
|---------------|---------|---------|
| AUTO-HR-REC-001 | `hr.requisition.created` | Route approval (Approval Engine policy) |
| AUTO-HR-REC-002 | `hr.requisition.approved` | Notify recruiter; open position |
| AUTO-HR-REC-003 | `hr.candidate.stage_changed` | Update pipeline metrics; notify owner |
| AUTO-HR-REC-004 | `hr.interview.scheduled` | Calendar invites; interviewer reminders |
| AUTO-HR-REC-005 | `cron` daily | Interview reminder T-1 day |
| AUTO-HR-REC-006 | `hr.offer.sent` | Follow-up reminder T+3 days if no response |
| AUTO-HR-REC-007 | `hr.offer.accepted` | Trigger hire wizard task; pre-boarding |
| AUTO-HR-REC-008 | `hr.employee.hired` | Close requisition; hiring analytics refresh |

---

# Attendance Automations

*Critical section — high volume, payroll impact.*

| Automation ID | Trigger | Actions | Schedule |
|---------------|---------|---------|----------|
| AUTO-HR-ATT-001 | `cron` 15min | Biometric sync job per active device | Recurring |
| AUTO-HR-ATT-002 | `hr.attendance_log.received` | Reconcile punch → daily row | Immediate |
| AUTO-HR-ATT-003 | `cron` EOD+2h | Missing attendance detection | Daily |
| AUTO-HR-ATT-004 | `hr.attendance.late` | Notify employee; manager digest | Immediate |
| AUTO-HR-ATT-005 | `hr.attendance.absent` | Notify manager; HR digest | Immediate |
| AUTO-HR-ATT-006 | `hr.overtime.eligible` | Flag OT eligibility; notify manager | Conditional |
| AUTO-HR-ATT-007 | `manual` or `cron` period_end | Attendance finalization job | Monthly |
| AUTO-HR-ATT-008 | `hr.attendance.finalized` | Notify payroll; lock attendance edits for period | Immediate |
| AUTO-HR-ATT-009 | `cron` weekly | Attendance compliance report + alerts | Weekly |

### Attendance validation pipeline

```text
Raw punches (sync)
  → AUTO-HR-ATT-002 reconcile
  → Policy engine (shift, grace, holiday)
  → Exception flags
  → AUTO-HR-ATT-003 missing detection
  → Manager/HR notifications
  → Period end: AUTO-HR-ATT-007 finalize
  → Event hr.attendance.finalized → payroll collection
```

---

# Biometric Automations

| Vendor | Sync mode | Automation |
|--------|-----------|------------|
| **ZKTeco** | Push (ADMS) / pull 15min | AUTO-HR-BIO-001 sync; AUTO-HR-BIO-002 retry |
| **eSSL** | Pull scheduled | AUTO-HR-BIO-001 |
| **Fingerprint** | Per punch push | Inline reconcile |
| **Face recognition** | Same as fingerprint | Same pipeline |

| Automation ID | Purpose |
|---------------|---------|
| AUTO-HR-BIO-001 | **Auto sync** — fetch/push punches per device |
| AUTO-HR-BIO-002 | **Sync retry** — exponential backoff on failure |
| AUTO-HR-BIO-003 | **Sync failure alert** — `hr.device.sync.failed` → critical notification |
| AUTO-HR-BIO-004 | **Device offline** — heartbeat miss → `hr.device.offline` |
| AUTO-HR-BIO-005 | **Data validation** — duplicate punch dedup; unknown employee quarantine |

**Auth:** Device token per [HR_API_ARCHITECTURE.md](./HR_API_ARCHITECTURE.md) — automation runs as service account for pull jobs.

---

# Shift Automations

| Automation ID | Trigger | Actions |
|---------------|---------|---------|
| AUTO-HR-SHF-001 | `hr.shift.rotation.due` | Generate assignments from rotation pattern |
| AUTO-HR-SHF-002 | `hr.shift.assigned` | Notify employee |
| AUTO-HR-SHF-003 | `cron` daily | Shift conflict detection — alert HR |
| AUTO-HR-SHF-004 | `hr.attendance.night_shift` | Night shift monitoring — premium flag |
| AUTO-HR-SHF-005 | `hr.leave.approved` | Schedule adjustment — remove shift on leave days |

---

# Leave Automations

| Automation ID | Trigger | Actions |
|---------------|---------|---------|
| AUTO-HR-LEV-001 | `cron` monthly 1st | **Leave accrual** batch per policy |
| AUTO-HR-LEV-002 | `cron` annual | **Carry forward** calculation |
| AUTO-HR-LEV-003 | `date.due` balance_expiry | **Leave expiry** alert + forfeit job |
| AUTO-HR-LEV-004 | `hr.leave.requested` | **Approval routing** via Approval policy |
| AUTO-HR-LEV-005 | `approval.sla.breach` | **Escalation** to next approver |
| AUTO-HR-LEV-006 | `cron` daily | **Holiday notifications** upcoming holidays |
| AUTO-HR-LEV-007 | `hr.leave.approved` | Update balance; notify team calendar |
| AUTO-HR-LEV-008 | `hr.leave.balance_low` | Employee reminder |

---

# Overtime Automations

| Automation ID | Trigger | Actions |
|---------------|---------|---------|
| AUTO-HR-OVT-001 | `hr.attendance.overtime_detected` | Create OT request draft or alert |
| AUTO-HR-OVT-002 | `hr.overtime.requested` | Approval routing |
| AUTO-HR-OVT-003 | `hr.overtime.approved` | OT calculation record → payroll input |
| AUTO-HR-OVT-004 | `payroll.period.prep` | Collect approved OT for period |
| AUTO-HR-OVT-005 | `hr.overtime.threshold` | OT cap alert to HR |

---

# Loan & Advance Automations

| Automation ID | Trigger | Actions |
|---------------|---------|---------|
| AUTO-PAY-LON-001 | `payroll.loan.approved` | Generate installment schedule |
| AUTO-PAY-LON-002 | `payroll.run.calculated` | **Payroll recovery** — deduct EMI |
| AUTO-PAY-LON-003 | `cron` 3d before due | **Payment reminder** to employee |
| AUTO-PAY-LON-004 | `payroll.loan.closed` | Completion alert; archive |
| AUTO-PAY-ADV-001 | `payroll.advance.disbursed` | Schedule recovery plan |
| AUTO-PAY-ADV-002 | `payroll.run.calculated` | Advance recovery deduction |

---

# Payroll Automations

*Most important section — orchestrated payroll pipeline.*

### Payroll automation pipeline

```text
AUTO-PAY-000  Payroll calendar (cron) — open period reminder
      ↓
AUTO-PAY-001  Payroll preparation — checklist tasks
      ↓
AUTO-PAY-002  Attendance collection — after finalize event
AUTO-PAY-003  Leave collection — approved leave in period
AUTO-PAY-004  Overtime collection — approved OT
AUTO-PAY-005  Loan collection — installments due
AUTO-PAY-006  Advance collection — recoveries due
      ↓
AUTO-PAY-010  Salary calculation trigger — POST calculate (service)
      ↓
AUTO-PAY-011  Payroll validation — rules + optional AI audit
      ↓
AUTO-PAY-012  Approval routing — submit for approval (human)
      ↓
[HUMAN] Approve → Lock → Publish payslips → Post
      ↓
AUTO-PAY-020  Payslip generation batch — on lock
AUTO-PAY-021  Bank export prep — notify payroll (human executes export)
AUTO-PAY-022  Payroll archiving — post-lock snapshot
```

| Automation ID | Trigger | Actions | Human gate |
|---------------|---------|---------|------------|
| AUTO-PAY-000 | `cron` pay_date - N | Calendar reminder; open period check | None |
| AUTO-PAY-001 | `payroll.period.opened` | Prep checklist; notify payroll team | None |
| AUTO-PAY-002 | `hr.attendance.finalized` | Mark attendance ready on run | None |
| AUTO-PAY-003 | `cron` pre-payroll | Import leave deductions | None |
| AUTO-PAY-004 | `cron` pre-payroll | Import OT amounts | None |
| AUTO-PAY-005 | `payroll.run.calculated` | Apply loan deductions | None |
| AUTO-PAY-006 | `payroll.run.calculated` | Apply advance recoveries | None |
| AUTO-PAY-010 | `manual` or scheduled | Invoke calculate service | Payroll initiates |
| AUTO-PAY-011 | `payroll.run.calculated` | Validation rules + `ai_analyze` | None (flags only) |
| AUTO-PAY-012 | `payroll.run.calculated` | Create approval request | **Human approves** |
| AUTO-PAY-020 | `payroll.run.locked` | Batch payslip PDF generation | After human lock |
| AUTO-PAY-021 | `payroll.run.locked` | Notify: bank export ready | **Human exports** |
| AUTO-PAY-022 | `payroll.run.posted` | Archive; analytics refresh; accounting event | After human post |

**Forbidden automations:** Auto-approve payroll, auto-lock, auto-post, auto bank file submit.

---

# Payroll Compliance Automations

| Automation ID | Trigger | Actions |
|---------------|---------|---------|
| AUTO-PAY-CMP-001 | `payroll.run.calculated` | **Tax validation** — statutory component checks |
| AUTO-PAY-CMP-002 | `payroll.run.calculated` | **Missing data** — bank, tax ID, attendance gaps |
| AUTO-PAY-CMP-003 | `payroll.run.calculated` | **Anomaly alerts** — duplicate, outlier ( + AI ) |
| AUTO-PAY-CMP-004 | `approval.sla.breach` | **Approval escalation** — payroll run pending |

---

# Performance Automations

| Automation ID | Trigger | Actions |
|---------------|---------|---------|
| AUTO-HR-PRF-001 | `hr.performance.cycle.started` | Create review records per employee |
| AUTO-HR-PRF-002 | `date.due` review_deadline - 7d | **Review reminders** |
| AUTO-HR-PRF-003 | `hr.goal.assigned` | Notify employee |
| AUTO-HR-PRF-004 | `cron` cycle_end | **Promotion recommendations** — AI task (advisory) |
| AUTO-HR-PRF-005 | `hr.performance.review.completed` | **Training recommendations** — AI task |
| AUTO-HR-PRF-006 | `hr.performance.rating.low` | Performance alert to HR |

---

# Training Automations

| Automation ID | Trigger | Actions |
|---------------|---------|---------|
| AUTO-HR-TRN-001 | `hr.employee.hired` | Assign mandatory training enrollments |
| AUTO-HR-TRN-002 | `hr.skill.gap_detected` | Propose training enrollment (draft) |
| AUTO-HR-TRN-003 | `cron` T-2d session | **Training reminders** |
| AUTO-HR-TRN-004 | `hr.training.completed` | **Certificate generation** job |
| AUTO-HR-TRN-005 | `hr.certification.expiring` | **Renewal alerts** |

---

# Asset Automations

| Automation ID | Trigger | Actions |
|---------------|---------|---------|
| AUTO-HR-AST-001 | `hr.employee.hired` | IT asset assignment task (if policy) |
| AUTO-HR-AST-002 | `hr.asset.assigned` | Notify employee; agreement task |
| AUTO-HR-AST-003 | `date.due` expected_return | **Return reminders** |
| AUTO-HR-AST-004 | `hr.asset.warranty_expiring` | Warranty alert to IT/HR |
| AUTO-HR-AST-005 | `cron` quarterly | **Lifecycle monitoring** — replacement recommendations (AI optional) |
| AUTO-HR-AST-006 | `hr.employee.terminated` | Return asset checklist — escalate if overdue |

---

# Document Automations

| Automation ID | Trigger | Actions |
|---------------|---------|---------|
| AUTO-HR-DOC-001 | `cron` daily | **Expiry detection** scan |
| AUTO-HR-DOC-002 | `hr.document.expiring` | Renewal alerts + tasks |
| AUTO-HR-DOC-003 | `cron` weekly | **Compliance monitoring** — missing mandatory docs |
| AUTO-HR-DOC-004 | `hr.document.verified` | Update compliance score |
| AUTO-HR-DOC-005 | `hr.employee.archived` | **Archive automation** — move docs to archive state |

---

# Approval Automations

Universal patterns via **Core Approval Engine** — HR automation invokes, does not replace.

| Pattern | Configuration | HR example |
|---------|---------------|------------|
| **Single level** | 1 step chain | OT < 2 hours → manager only |
| **Multi level** | N steps sequential | Leave > 5 days → manager → HR |
| **Sequential** | Step order enforced | Payroll run review |
| **Parallel** | Any 2 of 3 approvers | Offer letter (future) |
| **Conditional** | Amount/days/type → chain | Loan principal threshold |
| **Escalation** | SLA breach → next level | Pending leave 48h |
| **Auto reminders** | Cron on pending steps | T+24h, T+48h reminder |

### Escalation hierarchy (reference)

```text
Team Leader → Department Manager → HR Manager → HR Director → Company Admin
```

Domain-specific overrides in `approval_escalation_rules` — automation triggers escalation event, Approval Engine executes.

---

# Notification Automations

Automations use **Notification Engine** — `send_notification` action with template key.

| Channel | Phase | Use |
|---------|-------|-----|
| **In-app** | P1 | All operational alerts |
| **Email** | P1 | Approvals, payroll, compliance |
| **SMS** | P2 | Critical attendance (optional) |
| **WhatsApp** | P3 | Reminder templates |
| **Push** | P2 | Mobile ESS |
| **Digest** | P1 | Daily/weekly manager digests |

**Digest automation:** AUTO-HR-NTF-001 — aggregate pending approvals + absences → single email 07:00.

Per [HR_NOTIFICATION_ARCHITECTURE.md](./HR_NOTIFICATION_ARCHITECTURE.md) — dedupe window prevents notification storms.

---

# Escalation Automations

| Domain | SLA default | Escalation target | Automation ID |
|--------|-------------|-------------------|---------------|
| **Pending leave** | 48h | Next approver → HR | AUTO-ESC-LEV-001 |
| **Pending attendance correction** | 24h | Manager → HR | AUTO-ESC-ATT-001 |
| **Pending payroll approval** | 24h | Backup approver → Finance | AUTO-ESC-PAY-001 |
| **Pending loan** | 72h | HR Director | AUTO-ESC-LON-001 |
| **Pending performance review** | 7d | HR reminder | AUTO-ESC-PRF-001 |
| **Pending approvals (generic)** | Policy-based | Approval Engine escalation | AUTO-ESC-COR-001 |

---

# Scheduled Automations

| Cadence | Cron example | Jobs |
|---------|--------------|------|
| **Daily** | `0 6 * * *` | Missing attendance, doc expiry scan, digests |
| **Daily** | `*/15 * * * *` | Biometric sync pull |
| **Weekly** | `0 7 * * 1` | Compliance reports, manager summaries |
| **Monthly** | `0 2 1 * *` | Leave accrual, payroll prep reminders |
| **Quarterly** | `0 3 1 1,4,7,10 *` | Performance cycle prep, asset lifecycle |
| **Annual** | `0 4 1 1 *` | Carry forward leave, tax year rollover tasks |

**Queue:** HR automation jobs on `hr_automation` queue per [queue-architecture.md](../../02-core-platform/engines/queue-architecture.md).

---

# AI Assisted Automations

Per [HR_AI_ASSISTANT_ARCHITECTURE.md](./HR_AI_ASSISTANT_ARCHITECTURE.md) and [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) § AI Automation.

| Automation ID | Trigger | AI action | Output |
|---------------|---------|-----------|--------|
| AUTO-AI-HR-001 | `hr.attendance.pattern_flagged` | Attendance risk analysis | Insight + notification |
| AUTO-AI-HR-002 | `hr.leave.pattern_flagged` | Leave abuse detection | HR-only alert |
| AUTO-AI-HR-003 | `payroll.run.calculated` | Payroll risk detection | Exceptions panel |
| AUTO-AI-HR-004 | `cron` weekly | Promotion suggestions batch | Recommendation queue |
| AUTO-AI-HR-005 | `hr.skill.gap_detected` | Training suggestions | Enrollment proposals |
| AUTO-AI-HR-006 | `cron` daily | Attrition risk refresh | Dashboard widget |

### AI automation schema (platform)

Registers in `ai_automation_rules` when AI-involved:

| Field | HR example |
|-------|------------|
| `trigger_event` | `payroll.run.calculated` |
| `agent_id` | `workforce_agent` |
| `action_tool` | `payroll.tool.anomaly_scan` |
| `approval_required` | false (read-only analysis) |
| `rate_limit` | 10/hour per company |

**Event:** `ai.automation.run` on completion.

---

# Human Approval Boundaries

| Action | Auto | Draft | Human required |
|--------|------|-------|----------------|
| Send notification | ✓ | — | — |
| Create task/checklist | ✓ | — | — |
| Accrual calculation | ✓ | — | — |
| Biometric sync | ✓ | — | — |
| Attendance finalize | ✓* | — | *Policy: HR confirms in some tenants |
| Create leave/OT draft | — | ✓ | Employee submits |
| Salary revision | — | ✓ | Approval workflow |
| AI promotion list | — | — | ✓ HR reviews |
| Approve leave | — | — | ✓ Manager |
| Lock payroll | — | — | ✓ Payroll Manager |
| Bank export | — | — | ✓ Payroll Manager |
| Terminate employee | — | — | ✓ HR |
| AI apply write | — | — | ✓ User click + workflow |

---

# Automation Monitoring

| Metric | Source | Alert |
|--------|--------|-------|
| **Execution status** | `hr_automation_runs.status` | failed > threshold |
| **Success rate** | runs 24h | < 95% |
| **Failure** | error_message | PagerDuty ops |
| **Retries** | retry_count | > 2 on same run |
| **Execution time** | duration_ms | p95 > SLA |
| **User impact** | affected_entity_count | bulk impact review |

**Admin UI:** `/hr/settings/automation/runs` — filter by rule, status, date.

---

# Automation Audit Trail

### `hr_automation_runs` (conceptual)

| Field | Description |
|-------|-------------|
| `run_id` | UUID |
| `rule_id` | FK → hr_automation_rules |
| `trigger_type` | event, cron, manual, ai |
| `trigger_key` | Event name or cron |
| `trigger_event_id` | Domain event id |
| `conditions_result` | JSON pass/fail per condition |
| `actions_executed[]` | Action log with status |
| `status` | pending, running, success, partial, failed |
| `started_at` / `completed_at` | Timestamps |
| `actor` | system, service_account, user_id |
| `ai_involvement` | boolean + ai_automation_run_id |
| `affected_entities[]` | entity_type, entity_id |
| `error_message` | On failure |

### Activity integration

`activity_type: automation_executed` on affected entities with rule name and outcome.

---

# Cross Module Automations

| Trigger event | Target module | Action |
|---------------|---------------|--------|
| `hr.employee.hired` | CRM | Sync contact (event) |
| `payroll.run.posted` | Accounting | Journal entry subscriber |
| `hr.asset.assigned` | Inventory | Stock move ref (API) |
| `payroll.commission.calculated` | Sales | Reconcile commission import |
| `hr.expense.approved` | Accounting | AP bill draft (future) |
| `hr.timesheet.approved` | Projects | Labor cost (future) |
| `hr.attendance.finalized` | Manufacturing | Labor hours feed (future) |
| `hr.employee.terminated` | Helpdesk | Revoke tickets (future) |

**Pattern:** Publish domain event → subscriber module automation — no cross-DB writes.

---

# Chief AI Agent Compatibility

Per [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) § Chief AI Agent.

| Integration | Description |
|-------------|-------------|
| **Chief Agent plans** | "Run month-end payroll prep" → decomposes to HR automation chain |
| **Workforce Agent** | Executes HR-specific automation tools |
| **Payroll sub-agent** | Payroll auditor automations |
| **Executive Agent** | Consumes workforce digests — no direct HR automation write |
| **Cross-module** | Chief coordinates HR + Finance automations for board prep |

### Registration

| Item | Value |
|------|-------|
| Automation skill | `chief.plan.hr_automation` |
| Tool | `hr.tool.list_automation_rules`, `hr.tool.run_automation_manual` |
| Guard | User must hold `hr.automation.manage` for manual trigger |

### Future autonomous ERP

```text
Chief Agent goal: "Complete onboarding for new hire X"
  → Plan: AUTO-HR-EMP-001 + IT ticket + training AUTO-HR-TRN-001
  → Checkpoints: human confirms asset assignment, HR confirms docs
  → Audit: full plan stored in ai_audit_logs
```

---

# Rule Registry Schema (conceptual)

### `hr_automation_rules`

| Field | Notes |
|-------|-------|
| `rule_id` | `AUTO-HR-*` |
| `name` | Display label |
| `description` | |
| `company_id` | Scope |
| `trigger_type` | event, cron, manual |
| `trigger_key` | Event or cron expression |
| `conditions_json` | Condition engine DSL |
| `actions_json` | Ordered action list |
| `priority` | Higher first |
| `enabled` | Kill switch |
| `on_failure` | abort, continue |
| `max_runs_per_hour` | Rate limit |
| `risk_tier` | low, medium, high |
| `approval_required` | For write actions |
| `version` | Rule version |

---

# API Architecture (conceptual)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/hr/automation/rules` | List rules |
| POST | `/api/v1/hr/automation/rules` | Create rule |
| PATCH | `/api/v1/hr/automation/rules/{id}` | Update |
| POST | `/api/v1/hr/automation/rules/{id}/test` | Dry-run |
| POST | `/api/v1/hr/automation/rules/{id}/run` | Manual trigger |
| GET | `/api/v1/hr/automation/runs` | Execution log |
| GET | `/api/v1/hr/automation/runs/{id}` | Run detail |

**Permission:** `hr.automation.manage`, `hr.automation.view`

---

# Phase Roadmap

| Phase | Deliverables |
|-------|--------------|
| **P1** | Event notifications, scheduled accrual/finalize, biometric sync, doc expiry, payroll prep reminders |
| **P2** | Rule builder UI, escalation automations, AI-assisted payroll audit trigger, digests |
| **P3** | Conditional cross-module, AI leave/attrition batch, shift optimization proposals |
| **P4** | Chief Agent orchestrated multi-step with checkpoints |

---

# Cross-Reference Index

| Document | Relationship |
|----------|--------------|
| [HR_WORKFLOW_ARCHITECTURE.md](./HR_WORKFLOW_ARCHITECTURE.md) | Workflow ≠ automation; start_workflow action |
| [HR_NOTIFICATION_ARCHITECTURE.md](./HR_NOTIFICATION_ARCHITECTURE.md) | Notification actions |
| [HR_AI_ASSISTANT_ARCHITECTURE.md](./HR_AI_ASSISTANT_ARCHITECTURE.md) | AI assisted automations |
| [HR_API_ARCHITECTURE.md](./HR_API_ARCHITECTURE.md) | Service actions |
| [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md) | Automation permissions |
| [EVENT_ARCHITECTURE.md](../../02-core-platform/engines/EVENT_ARCHITECTURE.md) | Event triggers |
| [APPROVAL_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) | Approval routing |
| [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) | ai_automation_rules |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll |
| **Owner** | Platform / HR domain |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Registered automations** | 80+ (`AUTO-*`) |

---

**AgainERP HR & Payroll Automation Engine Architecture** — governed, audited, human-in-the-loop automation. Not workflow. No code.
