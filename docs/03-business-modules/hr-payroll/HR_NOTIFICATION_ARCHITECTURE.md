# HR & Payroll — Notification Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll (unified enterprise suite)  
> **Document Type:** Notification Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md) · [HR_WORKFLOW_ARCHITECTURE.md](./HR_WORKFLOW_ARCHITECTURE.md) · [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md)  
> **Governance:** [NOTIFICATION_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md) · [APPROVAL_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) · [EVENT_ARCHITECTURE.md](../../02-core-platform/engines/EVENT_ARCHITECTURE.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) · [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) · [database/multi-company.md](../../05-development/database/multi-company.md)

## Purpose
HR & Payroll module architecture — scope, features, data ownership, and integration boundaries.

## When To Read
Read this file only if working on HR & Payroll architecture, features, or module boundaries.

## Related Files
- [Dependencies](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next
- [Architecture](HR_PAYROLL_MASTER_ARCHITECTURE.md)

---

**No application code. No database implementation. No API implementation.**  
This document defines the **complete notification architecture** for AgainERP HR & Payroll — events, channels, rules, escalation, reminders, approvals, compliance, digests, preferences, audit, and AI alerts. Foundation for Notification Engine integration, Reminder Engine, Escalation Engine, Approval Engine alerts, and AI HR Assistant.

**Delivery:** Core Notification Engine only — HR never calls SMTP/SMS/WhatsApp directly.

---

## Executive Summary

| Principle | Rule |
|-----------|------|
| **One engine** | All HR alerts via `NotificationService.notify()` |
| **Event-driven** | Domain events → `notification_rules` → queue |
| **Template-driven** | Versioned templates per type × channel × locale |
| **Preference-aware** | User category × channel matrix |
| **Company scoped** | `company_id` on every rule and delivery |
| **Approval-native** | Approval Engine triggers standard `approval.*` types |
| **Activity complementary** | Notifications alert; Activity timeline persists |
| **AI suggests, policy sends** | AI drafts digests — no autonomous payroll alerts |

### Canonical type prefix

```text
{category}.hr.{entity}.{action}
{category}.payroll.{entity}.{action}
{category}.ess.{entity}.{action}

Categories: txn | ops | approval | reminder | collab | system | ai | compliance
```

---

## Notification Philosophy

### Core belief

> **Notify for action. Do not notify for noise.**

HR generates high-volume operational signals (attendance punches) and high-stakes alerts (payroll lock, offer letter). The architecture separates:

| Signal class | Strategy |
|--------------|----------|
| **Action required** | Approval, correction, pending review — high priority, multi-channel |
| **Awareness** | Decision made, status change — medium, in-app + email |
| **Operational** | Sync failed, device offline — ops channel to HR admin |
| **Compliance** | Document expiry, statutory deadline — cannot fully mute |
| **Celebration** | Birthday, anniversary — low, digest-eligible |
| **AI insight** | Anomaly, risk score — low/medium, in-app first |

### Notification vs related systems

| System | HR role |
|--------|---------|
| **Activity / Chatter** | Permanent record on employee, leave, payroll run |
| **Approval Inbox** | Authoritative approve/reject UI |
| **Notification Bell** | Awareness + deep link to inbox or record |
| **Email (transactional)** | External deliverability for offer, payslip |
| **Marketing** | Not used for HR — announcements use `hr.announcement` ops type |

---

## Notification Design Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **Platform delivery** | Core Notification Engine only |
| 2 | **Event-first triggers** | `hr.*` / `payroll.*` domain events |
| 3 | **Idempotent sends** | Dedupe: `type + user_id + entity_id + window` |
| 4 | **Async queue** | Never block HTTP/workflow transition |
| 5 | **Preference respect** | Unless mandatory category |
| 6 | **Quiet hours** | No SMS/push 21:00–08:00 local unless critical |
| 7 | **Least surprise** | Employee notified of decisions affecting them |
| 8 | **Manager cascade** | Approvals to manager before HR when policy allows |
| 9 | **PII in channels** | SMS: no salary amounts; email payslip: link not attachment optional |
| 10 | **Audit every send** | `notification_deliveries` per channel |
| 11 | **Tenant isolation** | Rules and deliveries scoped by `tenant_id` |
| 12 | **Module off** | No HR rules evaluated when module disabled |

---

## Event Driven Notification Strategy

### Flow

```text
HR/Payroll domain action
        ↓
Workflow transition (optional)
        ↓
Domain event published (Event Bus)
        ↓
NotificationEventHandler matches notification_rules
        ↓
Evaluate conditions (amount, days, branch, role)
        ↓
Resolve recipients (resolver registry)
        ↓
Check preferences + mandatory policy
        ↓
Render templates per channel
        ↓
Enqueue notification_deliveries
        ↓
Workers deliver + update status
        ↓
Optional: Activity entry "notification_sent"
```

### HR event catalog (notification triggers)

| Domain event | Notification type | Default priority |
|--------------|-------------------|------------------|
| `hr.employee.hired` | `txn.hr.employee.hired` | medium |
| `hr.employee.terminated` | `txn.hr.employee.terminated` | high |
| `hr.leave.requested` | `approval.hr.leave.pending` | high |
| `hr.leave.approved` | `txn.hr.leave.approved` | medium |
| `hr.leave.rejected` | `txn.hr.leave.rejected` | medium |
| `hr.attendance.exception` | `ops.hr.attendance.exception` | medium |
| `hr.attendance.corrected` | `txn.hr.attendance.corrected` | low |
| `hr.attendance.finalized` | `ops.hr.attendance.finalized` | low |
| `payroll.run.calculated` | `ops.payroll.run.review_pending` | high |
| `payroll.run.approved` | `txn.payroll.run.approved` | medium |
| `payroll.run.locked` | `compliance.payroll.run.locked` | high |
| `payroll.payslip.published` | `txn.payroll.payslip.published` | high |
| `payroll.bank_export.created` | `compliance.payroll.bank_export.completed` | critical |
| `hr.document.expiring` | `reminder.hr.document.expiring` | high |
| `hr.device.sync.failed` | `ops.hr.device.sync_failed` | high |
| `core.approval.request.created` | `approval.hr.*.pending` | high |

### Subscriber rules

- Consumer idempotent on `event.id`
- Failed notification does not roll back domain transaction
- `source_event_id` on every delivery for traceability

---

## Notification Priority Levels

| Level | Code | In-app | Email | SMS | Push | Digest eligible | Override quiet hours |
|-------|------|--------|-------|-----|------|-----------------|----------------------|
| **Critical** | `critical` | Pin + toast | Immediate | If enabled | Yes | No | Yes |
| **High** | `high` | Toast | Immediate | Opt-in | Yes | No | Yes |
| **Medium** | `medium` | Inbox | Immediate or hourly batch | No | Opt-in | Yes | No |
| **Low** | `low` | Inbox | Daily digest | No | No | Yes | No |
| **Informational** | `info` | Inbox | Weekly digest | No | No | Yes | No |

### HR priority mapping (examples)

| Notification | Priority |
|--------------|----------|
| Payroll bank export completed | critical |
| Payroll locked / compliance deadline | critical |
| Approval pending (payroll run) | high |
| Payslip published | high |
| Leave approved/rejected | medium |
| Attendance missing (employee) | medium |
| Shift assigned | low |
| Birthday reminder | info |

---

## Multi Channel Notification Strategy

### Channel matrix

| Channel | Status | HR primary use |
|---------|--------|----------------|
| **In-app** | Active | All categories — universal inbox |
| **Email** | Active | Offer letter, payslip link, leave decision, digests |
| **SMS** | Active | Critical approval, OTP (ESS), escalation |
| **WhatsApp** | Future | Payslip link, approval reminder (template-approved) |
| **Push** | Future | Mobile ESS approvals, attendance alert |
| **Microsoft Teams** | Future | Manager/HR channel webhook |
| **Slack** | Future | `#hr-ops` device failures, payroll ready |
| **Webhooks** | Future | Customer HRIS integration |

### Channel selection rules

| Rule | Detail |
|------|--------|
| In-app always attempted | Unless user disabled entire HR category |
| Email for external candidates | No user account — `contact.email` |
| SMS transactional | Leave/approval urgent; not marketing |
| No salary in SMS body | Deep link only |
| WhatsApp | Pre-approved template IDs per locale |
| Teams/Slack | Company-level config — not per employee default |
| Fallback | Push fail → in-app + email |

### Queue tiers (HR mapping)

| Queue | HR notifications |
|-------|------------------|
| `notifications.critical` | Bank export, payroll lock, security |
| `notifications.default` | Approvals, leave, attendance ops |
| `notifications.low` | Digests, birthdays, AI insights |

---

## Notification Governance

| Area | Owner | Rule |
|------|-------|------|
| Template content | Company admin + platform defaults | Versioned, audited |
| Rule enable/disable | HR Director / Company Admin | Per `company_id` |
| Mandatory categories | Company policy | Approvals cannot be fully muted for approvers |
| Marketing consent | N/A for HR transactional | SMS opt-in for non-critical |
| Rate limits | Platform | Per channel per company |
| PII retention | Delivery log | Retain per compliance policy |
| AI-generated content | AI OS + admin | Suggest → publish template |

### Module install

On `module.hr` / `module.payroll` install: seed platform default `notification_rules` + `notification_templates` for HR types. Company may override.

---

# Notification Channels (detail)

See Multi Channel Strategy above. HR registers **template keys** per channel:

```text
{notification_type}.{channel}

Example:
  txn.hr.leave.approved.email
  txn.hr.leave.approved.in_app
  approval.hr.leave.pending.push
```

---

# Notification Categories

| Category | Prefix | Audience | Examples |
|----------|--------|----------|----------|
| **System** | `system.hr.*` | Admins | Module error, integration down |
| **Workflow** | `txn.hr.*` / `txn.payroll.*` | Participants | Status transitions |
| **Approval** | `approval.hr.*` | Approvers + submitter | Pending, decided |
| **Compliance** | `compliance.hr.*` | HR, Payroll, Auditor | Lock, export, expiry |
| **Employee** | `txn.ess.*` | Employee | Payslip, leave result |
| **Manager** | `txn.hr.manager.*` | Line managers | Team absent, pending approvals |
| **HR** | `ops.hr.*` | HR roles | Device sync, onboarding task |
| **Payroll** | `ops.payroll.*` | Payroll roles | Review pending, anomalies |
| **AI** | `ai.hr.*` | HR Manager+ | Risk, anomaly, recommendation |

User preferences group by **preference category** (maps to above):

`hr_approvals` · `hr_employee` · `hr_attendance` · `hr_leave` · `hr_payroll` · `hr_recruitment` · `hr_training` · `hr_compliance` · `hr_digest` · `hr_ai_insights`

---

# Multi Company Rules

| Scope | Rule | Example |
|-------|------|---------|
| **Company scoped** | Default — all HR notifications | Leave approved in Company A |
| **Branch scoped** | Recipient filter + announcement scope | Branch holiday |
| **Department scoped** | Manager subtree announcements | Dept meeting |
| **Global (tenant)** | Platform admin only | Maintenance window |
| **Cross-company user** | Separate delivery per company context | User with 2 employers gets 2 inboxes |

### Visibility boundaries

- Recipients resolved only within event `company_id`
- Branch Admin alerts filtered to `user_branches`
- Payroll notifications never leak across companies
- Group executive digest (future): explicit `payroll.report.view` + multi-company role

---

# Employee Lifecycle Notifications

| Stage | Trigger event | Recipients | Priority | Channels |
|-------|---------------|------------|----------|----------|
| **Recruitment** | `hr.candidate.created` | Recruiter | low | in_app |
| **Interview** | `hr.interview.scheduled` | Candidate, interviewers | high | email, in_app |
| **Offer letter** | `hr.offer.sent` | Candidate | high | email |
| **Joining** | `hr.onboarding.started` | Employee, HR, IT, manager | medium | email, in_app |
| **Probation completion** | `hr.probation.review_due` | Manager, HR | medium | in_app, email |
| **Confirmation** | `hr.employee.confirmed` | Employee, HR | medium | email, in_app |
| **Promotion** | `hr.employee.promoted` | Employee, manager, HR | medium | email, in_app |
| **Transfer** | `hr.employee.transferred` | Employee, old/new managers, HR | high | email, in_app |
| **Salary revision** | `payroll.structure.changed` | Employee*, Payroll, HR | high | in_app* |
| **Resignation** | `hr.resignation.submitted` | Manager, HR | high | in_app, email |
| **Exit clearance** | `hr.exit.clearance_pending` | Employee, IT, Finance, HR | high | in_app |
| **Final settlement** | `payroll.final_settlement.completed` | Employee, Payroll | high | email, in_app |
| **Archive** | `hr.employee.archived` | HR Admin | low | in_app |

\* Employee salary notification: in-app only unless company enables email; never SMS with amount.

---

# Recruitment Notifications

| Notification | Trigger | Recipients | Priority | Channels |
|--------------|---------|------------|----------|----------|
| Job requisition created | `hr.requisition.created` | Hiring manager, HR | medium | in_app |
| Job requisition approved | `hr.requisition.approved` | Recruiter, hiring manager | medium | in_app, email |
| Candidate applied | `hr.candidate.applied` | Recruiter | medium | in_app, email |
| Interview scheduled | `hr.interview.scheduled` | Candidate, panel | high | email, in_app |
| Interview feedback pending | `hr.interview.feedback_due` | Interviewer | high | in_app, reminder |
| Offer sent | `hr.offer.sent` | Candidate | high | email |
| Offer accepted | `hr.offer.accepted` | HR, hiring manager | high | in_app, email |
| Candidate rejected | `hr.candidate.rejected` | Candidate (optional template) | low | email |
| Hiring completed | `hr.employee.hired` | HR, IT, manager | high | in_app, email |

---

# Attendance Notifications

| Notification | Trigger | Recipients | Priority | Channels |
|--------------|---------|------------|----------|----------|
| Attendance missing | `hr.attendance.missing_punch` | Employee, manager | medium | in_app, push* |
| Late arrival | `hr.attendance.late` | Employee, manager* | low | in_app |
| Early exit | `hr.attendance.early_leave` | Manager | low | in_app |
| Absent employee | `hr.attendance.absent` | Manager, HR* | medium | in_app, email digest |
| Correction request | `hr.attendance.correction.submitted` | Manager | high | in_app, email |
| Correction approved | `hr.attendance.corrected` | Employee | medium | in_app |
| Correction rejected | `hr.attendance.correction.rejected` | Employee | medium | in_app, email |
| Biometric sync failed | `hr.device.sync.failed` | HR Admin, Branch Admin | high | in_app, email, slack* |
| Device offline | `hr.device.offline` | HR Admin | medium | in_app, ops digest |
| Attendance finalized | `hr.attendance.finalized` | Payroll Officer | low | in_app |

\* Configurable per company policy.

---

# Shift Notifications

| Notification | Trigger | Recipients | Priority | Channels |
|--------------|---------|------------|----------|----------|
| Shift assigned | `hr.shift.assigned` | Employee | low | in_app, push* |
| Shift changed | `hr.shift.changed` | Employee, manager | medium | in_app, email |
| Rotation updated | `hr.shift.rotation_updated` | Affected employees | medium | in_app |
| Night shift assigned | `hr.shift.night_assigned` | Employee | medium | in_app, email |
| Shift conflict detected | `hr.shift.conflict` | HR Executive | high | in_app, email |

---

# Leave Notifications

| Notification | Trigger | Recipients | Priority | Channels |
|--------------|---------|------------|----------|----------|
| Leave request submitted | `hr.leave.requested` | Manager | high | in_app, email, push* |
| Leave approved | `hr.leave.approved` | Employee | medium | in_app, email |
| Leave rejected | `hr.leave.rejected` | Employee | medium | in_app, email |
| Leave cancelled | `hr.leave.cancelled` | Manager, HR | low | in_app |
| Leave balance low | `hr.leave.balance_low` | Employee | low | in_app |
| Leave expiring (carry-forward) | `hr.leave.carry_forward_expiring` | Employee, HR | medium | in_app, email |
| Leave encashment approved | `hr.leave.encashment.approved` | Employee, Payroll | medium | in_app |
| Holiday announcement | `hr.holiday.announced` | Company/branch scope | info | in_app, email digest |

---

# Overtime Notifications

| Notification | Trigger | Recipients | Priority | Channels |
|--------------|---------|------------|----------|----------|
| OT request submitted | `hr.overtime.requested` | Manager | high | in_app, email |
| OT approved | `hr.overtime.approved` | Employee | medium | in_app |
| OT rejected | `hr.overtime.rejected` | Employee | medium | in_app, email |
| OT calculation completed | `hr.overtime.calculated` | Payroll (batch) | low | in_app |
| Payroll integrated | `hr.overtime.processed_in_payroll` | Employee* | low | in_app |

\* Optional summary on payslip publish instead.

---

# Loan Notifications

| Notification | Trigger | Recipients | Priority | Channels |
|--------------|---------|------------|----------|----------|
| Loan request submitted | `payroll.loan.requested` | Manager, HR | high | in_app, email |
| Loan approved | `payroll.loan.approved` | Employee, Finance | high | in_app, email |
| Loan rejected | `payroll.loan.rejected` | Employee | medium | in_app, email |
| Installment started | `payroll.loan.disbursed` | Employee | medium | in_app |
| Loan completed | `payroll.loan.closed` | Employee, HR | low | in_app |

---

# Advance Salary Notifications

| Notification | Trigger | Recipients | Priority | Channels |
|--------------|---------|------------|----------|----------|
| Advance requested | `payroll.advance.requested` | Manager, HR | high | in_app |
| Advance approved | `payroll.advance.approved` | Employee, Finance | high | in_app, email |
| Advance rejected | `payroll.advance.rejected` | Employee | medium | in_app |
| Recovery started | `payroll.advance.recovery_started` | Employee | medium | in_app |
| Recovery completed | `payroll.advance.recovered` | Employee | low | in_app |

---

# Payroll Notifications

| Notification | Trigger | Recipients | Priority | Channels |
|--------------|---------|------------|----------|----------|
| Payroll generated | `payroll.run.calculated` | Payroll Officer, HR Manager | high | in_app, email |
| Payroll review pending | `payroll.run.review_pending` | Payroll Officer | high | in_app |
| Payroll approved | `payroll.run.approved` | Payroll team | medium | in_app |
| Payroll rejected | `payroll.run.rejected` | Payroll Officer | high | in_app, email |
| Payroll locked | `payroll.run.locked` | Payroll, HR Director | critical | in_app, email |
| Payroll reopened | `payroll.run.reopened` | Finance, Company Admin | critical | in_app, email, sms* |
| Payslip generated | `payroll.payslip.generated` | — (internal) | low | in_app |
| Payslip published | `payroll.payslip.published` | Employee | high | in_app, email |
| Bank export completed | `payroll.bank_export.created` | Payroll Manager, Finance | critical | in_app, email |
| Salary revision applied | `payroll.structure.changed` | Employee, HR | high | in_app |
| Bonus processed | `payroll.bonus.included` | Employee | medium | in_app |
| Commission processed | `payroll.commission.included` | Employee | medium | in_app |

---

# Performance Notifications

| Notification | Trigger | Recipients | Priority | Channels |
|--------------|---------|------------|----------|----------|
| Goal assigned | `hr.goal.assigned` | Employee | medium | in_app |
| Review cycle started | `hr.performance.cycle_started` | All participants | medium | in_app, email |
| Self review pending | `hr.performance.self_review_due` | Employee | high | in_app, reminder |
| Manager review pending | `hr.performance.manager_review_due` | Manager | high | in_app, reminder |
| Review completed | `hr.appraisal.completed` | Employee, HR | medium | in_app, email |
| Promotion recommended | `hr.promotion.recommended` | HR Manager | high | in_app |
| Training recommended | `hr.training.recommended` | Employee, manager | low | in_app |

---

# Training Notifications

| Notification | Trigger | Recipients | Priority | Channels |
|--------------|---------|------------|----------|----------|
| Training scheduled | `hr.training.scheduled` | Participant | medium | in_app, email |
| Training reminder | `hr.training.reminder` | Participant | medium | in_app, email, reminder |
| Training started | `hr.training.started` | Trainer | low | in_app |
| Training completed | `hr.training.completed` | Participant, HR | low | in_app |
| Certificate available | `hr.training.certified` | Participant | medium | in_app, email |
| Evaluation pending | `hr.training.evaluation_due` | Participant | low | in_app |

---

# Asset Management Notifications

| Notification | Trigger | Recipients | Priority | Channels |
|--------------|---------|------------|----------|----------|
| Asset assigned | `hr.asset.assigned` | Employee | medium | in_app, email |
| Asset returned | `hr.asset.returned` | HR, IT | low | in_app |
| Asset damaged | `hr.asset.damaged` | HR, IT, manager | high | in_app, email |
| Replacement required | `hr.asset.replacement_required` | IT, HR | medium | in_app |
| Warranty expiring | `hr.asset.warranty_expiring` | IT, HR | medium | in_app, reminder |

---

# Document Management Notifications

| Notification | Trigger | Recipients | Priority | Channels |
|--------------|---------|------------|----------|----------|
| Document uploaded | `hr.document.uploaded` | HR reviewer | low | in_app |
| Document approved | `hr.document.verified` | Employee | medium | in_app |
| Document rejected | `hr.document.rejected` | Employee | medium | in_app, email |
| Expiry warning | `hr.document.expiring` | Employee, manager, HR | high | in_app, email |
| Renewal required | `hr.document.expired` | Employee, HR | high | in_app, email |

Expiry schedule: 30 / 14 / 7 days before — see Reminder Engine.

---

# Self Service Notifications

| Notification | Trigger | Recipients | Priority | Channels |
|--------------|---------|------------|----------|----------|
| Profile update request | `ess.profile.update_submitted` | HR | medium | in_app |
| Request approved | `ess.request.approved` | Employee | medium | in_app |
| Request rejected | `ess.request.rejected` | Employee | medium | in_app, email |
| Document request | `hr.document.requested` | Employee | medium | in_app, email |
| Asset request | `hr.asset.requested` | Manager, IT | high | in_app |
| General employee request | `ess.request.created` | Resolver by type | medium | in_app |

---

# Approval Notifications (Universal)

HR uses **Core Approval Engine** notification contract per [APPROVAL_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md).

### Approval event → notification map

| Approval event | Type | Recipients | Priority | Channels |
|----------------|------|------------|----------|----------|
| Request created | `approval.hr.{entity}.pending` | Current step assignee(s) | high | in_app, email, push* |
| Step pending (reminder) | `approval.hr.{entity}.reminder` | Assignee | high | in_app, email |
| Escalated | `approval.hr.{entity}.escalated` | Escalation target | critical | in_app, email, sms* |
| Approved (final) | `approval.hr.{entity}.approved` | Submitter + followers | medium | in_app, email |
| Rejected | `approval.hr.{entity}.rejected` | Submitter | medium | in_app, email |
| Delegated | `approval.hr.{entity}.delegated` | Delegate + original | medium | in_app |

### By approval pattern

| Pattern | Notification behavior |
|---------|----------------------|
| **Single level** | One `pending` → `approved`/`rejected` |
| **Multi-level sequential** | New `pending` per step; submitter notified only on final |
| **Parallel** | All assignees get `pending`; first action advances |
| **Conditional** | Extra step → extra `pending` to HR/Finance |

### HR approval entities

`leave` · `attendance_correction` · `overtime` · `loan` · `advance` · `payroll_run` · `salary_revision` · `expense` · `travel` · `offer` · `promotion` · `asset` · `profile_update`

### Inbox vs notification bell

| Approval Inbox | Notification |
|----------------|--------------|
| Action required | Alert + deep link |
| Persists until decided | Can mark read independently |
| `/inbox/approvals` | Header bell → `/notifications` |

---

# Reminder Engine

Reminders are **scheduled notification rules** (`trigger_type: schedule`) or **Approval Engine SLA** callbacks.

### Architecture

```text
Cron / SLA timer
        ↓
Reminder job evaluates pending entities
        ↓
Match reminder_rule (entity, age, state)
        ↓
Emit reminder.{module}.{entity}.{reason}
        ↓
Standard notification pipeline
        ↓
Dedupe: max 1 reminder per entity per interval
```

### HR reminder catalog

| Reminder | Schedule | Recipients | Priority | Channels |
|----------|----------|------------|----------|----------|
| Interview reminder | 24h before | Candidate, panel | high | email, in_app |
| Leave approval pending | 50% SLA | Approver | high | in_app, email |
| Payroll approval pending | 4h before pay cutoff | HR Manager | critical | in_app, email, sms* |
| Document expiry | 30/14/7 days | Employee, HR | high | email, in_app |
| Training reminder | 24h before session | Participant | medium | email, in_app |
| Shift reminder | 12h before night shift | Employee | low | push*, in_app |
| Birthday | Day of (08:00 local) | Employee, team* | info | in_app |
| Work anniversary | Day of | Employee, manager | info | in_app |

### Reminder deduplication

| Rule | Window |
|------|--------|
| Same entity + reminder type | Min 12h between sends |
| Document expiry | Once per threshold (30, 14, 7) |
| Approval SLA | 50% warning + breach only |

---

# Escalation Engine

Escalation integrates **Approval Engine SLA** + optional **HR escalation policies**.

### Flow

```text
Approval step pending > SLA
        ↓
approval.escalation event
        ↓
Reassign or add escalation approver
        ↓
Notify original + escalation recipient
        ↓
Activity: escalation logged
        ↓
Repeat per escalation level (max 3)
```

### HR escalation catalog

| Pending item | SLA | Level 1 | Level 2 | Level 3 |
|--------------|-----|---------|---------|---------|
| Leave approval | 24h | Skip-level manager | HR Manager | HR Director |
| Attendance correction | 48h | Dept head | HR Executive | HR Manager |
| Payroll approval | 4h (pay day) | HR Director | Finance | Company Admin |
| Loan approval | 72h | HR Manager | Finance Controller | Company Admin |
| Performance review | 7d | HR Executive | HR Manager | — |

### Escalation notification

| Field | Value |
|-------|-------|
| Type | `approval.hr.{entity}.escalated` |
| Priority | critical (payroll) / high (others) |
| Channels | in_app, email; sms for payroll pay-day |
| Body | Includes overdue duration + deep link |

---

# Digest Notifications

Low-priority and aggregate notifications batch into digests per user preference `digest_mode`.

### Digest types

| Digest | Schedule | Audience | Content |
|--------|----------|----------|---------|
| **Daily summary** | 18:00 local | Employee | Own pending items, announcements |
| **Weekly summary** | Mon 09:00 | Employee | Leave balance, training upcoming |
| **Monthly summary** | 1st 09:00 | Employee | Payslip reminder, anniversaries |
| **Manager summary** | Daily 08:00 | Managers | Team absent today, pending approvals |
| **HR summary** | Daily 08:00 | HR roles | Onboarding tasks, expiring docs, device alerts |
| **Payroll summary** | Pay day -2 | Payroll | Exceptions, missing attendance |
| **Executive summary** | Weekly | HR Director | Headcount, turnover, payroll cost snapshot |

### Digest rules

| Rule | Detail |
|------|--------|
| Eligibility | Priority ≤ medium; not approval-critical |
| Opt-out | User can set `digest_mode: off` per category |
| AI assist | AI may draft digest paragraph — admin template |
| Delivery | Single email with in-app summary link |

---

# AI Driven Notifications

Future **AI HR Assistant** per [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md).

### Principles

| Rule | Detail |
|------|--------|
| AI does not send autonomously | Unless explicit `notification_rule` + `ai_generated: true` approved |
| Inherits permissions | No insight to user who cannot view underlying data |
| Human review for critical | Attrition risk to manager requires HR policy |
| Logged | `ai_audit_logs` + `activity_ai_actions` |

### AI notification catalog

| Insight | Trigger | Recipients | Priority | Channels |
|---------|---------|------------|----------|----------|
| Attendance anomaly | Scheduled AI job | Manager, HR | medium | in_app |
| Payroll anomaly | Post-calculate validation | Payroll Officer | high | in_app, email |
| Attrition risk | Weekly model run | HR Manager* | medium | in_app |
| Performance risk | Cycle midpoint | Manager | low | in_app |
| Leave abuse pattern | Pattern detection | HR Manager | high | in_app |
| Promotion opportunity | Review complete + AI | HR Manager | low | in_app |
| Training recommendation | Skill gap analysis | Employee | low | in_app |

\* Aggregated — no individual employee name in notification to unauthorized roles.

### Type prefix

`ai.hr.{insight}.{action}` — e.g. `ai.hr.attrition.risk_detected`

---

# User Preferences

Stored in Core `notification_preferences` — HR extends **category list** only.

### Preference matrix (user configurable)

| Category | In-app | Email | SMS | WhatsApp | Digest |
|----------|--------|-------|-----|----------|--------|
| HR Approvals | ✓ mandatory for approvers | ✓ | opt-in | future | off |
| Leave updates | ✓ | ✓ | off | off | daily option |
| Attendance alerts | ✓ | opt-in | off | off | off |
| Payslip | ✓ | ✓ mandatory* | off | future | off |
| Payroll (staff) | ✓ | ✓ | off | off | off |
| Recruitment | ✓ | ✓ | off | off | off |
| Training | ✓ | ✓ | off | off | off |
| Compliance / document | ✓ | ✓ cannot disable email | off | off | off |
| Digests | ✓ | ✓ | off | off | instant/hourly/daily/weekly |
| AI insights | ✓ | opt-in | off | off | weekly |

\* Company may mandate payslip email for legal compliance.

### Mute options

| Mute type | Scope |
|-----------|-------|
| **Snooze 1h/24h** | All non-critical |
| **Category off** | Per preference category |
| **Quiet hours** | User timezone — SMS/push suppressed |
| **DND on leave** | Optional auto when leave approved |

### Hierarchy

```text
1. Legal suppressions (bounce, opt-out)
2. Company mandatory policy
3. User preferences
4. Rule defaults
```

---

# Audit Requirements

Every notification intent and delivery logged per Core `notification_deliveries`.

### Required audit fields

| Field | Description |
|-------|-------------|
| **Trigger event** | `source_event_id`, event name |
| **Recipient** | `user_id` or external address |
| **Delivery channel** | email, in_app, sms, … |
| **Delivery status** | pending → sent → delivered / failed |
| **Read status** | `read_at` on in-app `notifications` |
| **Action taken** | User clicked deep link → optional analytics |
| **Template version** | Rendered template semver |
| **Company** | `company_id` |
| **Correlation** | `correlation_id` for batch/digest |

### Compliance retention

| Category | Retention |
|----------|-----------|
| Payroll / payslip notifications | 7+ years |
| Offer letter email | 7+ years |
| Approval notifications | 3+ years |
| Operational digests | 1 year |

### High-audit triggers (alert on failure)

`payroll.payslip.published` · `payroll.bank_export.created` · `hr.offer.sent` · `approval.payroll.run.pending`

---

# Notification Rules Registry (HR module)

HR registers rules at install — company may override `company_id`.

### Rule schema (conceptual)

| Field | HR example |
|-------|------------|
| `trigger_key` | `hr.leave.approved` |
| `conditions` | `{ "days": { "gt": 3 } }` |
| `recipient_resolver` | `record.submitter`, `role:hr_manager`, `record.manager` |
| `channels` | `["in_app", "email"]` |
| `template_key` | `txn.hr.leave.approved` |
| `priority` | `medium` |
| `dedupe_window_minutes` | 60 |

### Recipient resolvers (HR-specific)

| Resolver | Resolves to |
|----------|-------------|
| `hr.employee.user` | Employee's `user_id` |
| `hr.employee.manager` | Line manager user |
| `hr.employee.hr_pool` | Users with `hr.leave.approve` in company |
| `hr.role:payroll_officer` | Payroll role holders |
| `hr.approval.current_assignee` | Approval Engine step |
| `hr.branch.admin` | Branch admins for `branch_id` |
| `contact.email` | External candidate |

---

# Integration Summary

```text
┌─────────────────────────────────────────────────────────────────┐
│                    HR & Payroll Module                           │
│  Publishes: hr.* / payroll.* events                              │
│  Registers: notification_rules, templates, preference categories │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Core Notification Engine                            │
│  Rules · Templates · Preferences · Queue · Delivery · Audit      │
└──────┬──────┬──────┬──────┬──────┬──────┬──────────────────────┘
       │      │      │      │      │      │
       ▼      ▼      ▼      ▼      ▼      ▼
    In-App Email  SMS  Push  WA   Slack/Teams/Webhook
```

| Integration | Role |
|-------------|------|
| **Event Bus** | Primary trigger |
| **Workflow Engine** | Transition notify actions |
| **Approval Engine** | Pending, reminder, escalation, decided |
| **Activity Engine** | Optional cross-link on send |
| **Permission System** | Recipient resolution respects record rules |
| **AI OS** | Digest draft, insight notifications |

---

# Child Documentation Roadmap

| Document | Uses this architecture |
|----------|------------------------|
| `INTEGRATION.md` | Event → notification map |
| `API.md` | No public send API in HR — internal service only |
| Core template seeds | Platform default HR templates |
| UI prototype | Notification preference screen |

**Registration:** Add HR types to Core notification registry on module install.

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

**AgainERP HR & Payroll Notification Architecture** — event-driven, platform-delivered, preference-aware. No module-local SMTP. No code.
