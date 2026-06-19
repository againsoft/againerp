# HR & Payroll — Activity Log Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll (unified enterprise suite) · **Reference domain for Global Activity Engine**  
> **Document Type:** Activity & Audit Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md) · [HR_WORKFLOW_ARCHITECTURE.md](./HR_WORKFLOW_ARCHITECTURE.md) · [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md) · [HR_NOTIFICATION_ARCHITECTURE.md](./HR_NOTIFICATION_ARCHITECTURE.md)  
> **Governance:** [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) · [audit-trail.md](../../05-development/database/audit-trail.md) · [APPROVAL_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) · [NOTIFICATION_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md) · [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) · [AI_AUDIT_AND_APPROVAL.md](../../06-ai/platform/ai/AI_AUDIT_AND_APPROVAL.md)

## Purpose
HR & Payroll module architecture — scope, features, data ownership, and integration boundaries.

## When To Read
Read this file only if working on HR & Payroll architecture, features, or module boundaries.

## Related Files
- [Dependencies](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next
- [Architecture](HR_PAYROLL_MASTER_ARCHITECTURE.md)

---

**No application code. No database schema. No API implementation.**  
This document defines the **complete activity log and audit trail architecture** for AgainERP HR & Payroll — and serves as the **reference domain specification** for the future **AgainERP Global Activity Engine** used by all modules.

**Platform rule:** Activity & Chatter is a **Core Platform Service** — HR registers entity types and domain actions; HR does **not** build a parallel logging system.

---

## Executive Summary

| Goal | Mechanism |
|------|-----------|
| **Full traceability** | Every HR/Payroll mutation → Core activity entry |
| **Full auditability** | Immutable logs + field diffs + approval refs |
| **Historical visibility** | Entity timelines + employee 360° lifecycle view |
| **Compliance readiness** | Retention tiers, export bundles, legal hold |
| **AI analysis readiness** | Structured payloads, read models, PII classification |

```text
Business action (HR/Payroll Service)
        ↓
ActivityService.log()  ←── single write contract
        ↓
Core Activity Engine (activities, activity_logs, …)
        ↓
├── UI: Global Activity Drawer / Employee Timeline
├── Audit: Compliance export
├── Approval: activity_approvals (linked)
├── Notification: optional cross-reference (delivery_id)
└── AI: analytics read models (async)
```

---

## Activity Log Philosophy

### Core belief

> **If it changed, it is logged. If it is logged, it is attributable.**

HR & Payroll handles the most sensitive operational data in ERP — employment status, compensation, attendance, and pay. Users, regulators, and AI systems must be able to answer:

- Who changed this employee's salary?
- When was this payslip locked?
- Who approved this leave?
- What was the attendance value before correction?

### Activity vs collaboration

| Concern | System |
|---------|--------|
| **What happened** (system of record) | Activity logs |
| **What people said** (collaboration) | Comments, notes, mentions |
| **Who decided** (governance) | Approval logs |
| **What was sent** (delivery) | Notification logs |
| **What AI did** (intelligence audit) | AI logs |

### HR module responsibility

| HR owns | Core owns |
|---------|-----------|
| **When** to log (hooks on service methods) | Storage, indexing, retention jobs |
| **Entity type registry** (`hr_employee`, …) | `activities`, `activity_logs` tables |
| **Domain action vocabulary** (`salary_changed`, …) | Drawer UI, search API |
| **Compliance export format** | Delivery infrastructure |
| **Field sensitivity classification** | Field-level redaction in API responses |

---

## Audit Philosophy

### Audit vs activity

| Dimension | Activity log | Audit trail |
|-----------|--------------|-------------|
| **Audience** | Users, managers, HR | Compliance, auditors, security |
| **Tone** | Human-readable timeline | Forensic, complete |
| **Mutability** | Append-only | Append-only |
| **Scope** | Business entities | Includes permission changes, exports |
| **PII** | Masked per role | Full in encrypted export for auditor role |

**Rule:** Every audit event is an activity; not every activity appears in user timeline (e.g. `api` debug).

### Immutability

- No UPDATE or DELETE on log rows
- Corrections via **compensating entry** only (`restore`, `reversal`)
- Posted payroll activities are **permanent class**

### Attribution

`actor_user_id` set by service layer from session — never from client payload.

---

## Traceability Principles

| # | Principle | Rule |
|---|-----------|------|
| 1 | **Single write path** | `ActivityService.log()` only — no ad-hoc inserts |
| 2 | **Entity anchor** | Every log has `entity_type` + `entity_id` |
| 3 | **Correlation** | `correlation_id` links workflow, approval, notification |
| 4 | **Field-level diffs** | Updates include `field_changes[]` when applicable |
| 5 | **Reason on sensitive** | Terminate, salary change, balance adjust require `reason` |
| 6 | **Approval reference** | Governed actions link `approval_request_id` |
| 7 | **Source attribution** | `source`: `ui`, `api`, `ess`, `import`, `device`, `system`, `ai` |
| 8 | **Company scope** | `company_id` mandatory |
| 9 | **Cross-entity links** | Employee promotion logs on both `hr_employee` and `hr_performance_review` |
| 10 | **Event parity** | Domain event + activity emitted together (same transaction or outbox) |

---

## Compliance Requirements

| Requirement | HR implementation |
|-------------|-------------------|
| **Labor law retention** | Employment + pay records 7+ years (jurisdiction config) |
| **GDPR / privacy** | Candidate rejection retention; right to erasure coordinates with archive |
| **SoD evidence** | Payroll calculator ≠ approver in approval logs |
| **Payslip integrity** | `payroll_locked` + document hash referenced in activity |
| **Export for auditor** | `hr.audit.export` bundles activities + approvals + notification deliveries |
| **Legal hold** | Flag suppresses purge; activities still append |
| **Tamper evidence** | Hash chain on compliance tier (future platform feature) |

---

## Activity Ownership Rules

| Log class | Owner service | Written by |
|-----------|---------------|------------|
| Employee lifecycle | HR Service | HR hooks |
| Attendance / shift / leave | HR Service | HR hooks |
| Payroll / payslip | Payroll Service | Payroll hooks |
| Loan / advance | Payroll Service | Payroll hooks |
| Approval steps | Approval Engine | Core (HR subscribes) |
| Notifications | Notification Engine | Core |
| AI operations | AI OS | Core `activity_ai_actions` |
| System / device sync | Connector worker | System actor |
| Permission changes | Permission Service | Core |

**Forbidden:** HR module tables for duplicate `hr_activity_logs` as primary store — domain **supplements** only (`hr_employee_history` for reporting snapshots).

---

# Activity Engine Overview

The **Global Activity Engine** (Core Platform) is the unified logging and collaboration layer. HR & Payroll is the **first enterprise reference domain** for full engine capabilities.

### Log type comparison

| Type | Purpose | Storage (platform) | Mutable | Typical retention |
|------|---------|-------------------|---------|-------------------|
| **Activity logs** | User-facing timeline; business events | `activity_logs` | No | Tiered |
| **Audit logs** | Compliance, security, forensic | `activity_logs` (audit flag) + `audit_trail` | No | Long / permanent |
| **System logs** | Infra, sync jobs, errors | `system_logs` (ops) | No | 90d–1y |
| **Approval logs** | Human decisions, chains, escalation | `activity_approvals` | No | 7+ years |
| **Notification logs** | Delivery tracking | `notification_deliveries` | Status only | 1–7 years |
| **AI logs** | Model calls, proposals, apply | `ai_audit_logs` + `activity_ai_actions` | No | 2+ years |

### Differences (when to use which)

```text
Activity Log     → "Jane changed department to Sales"     (timeline)
Audit Trail      → Full field diff + IP + export marker   (compliance)
System Log       → "ZKTeco sync job failed: timeout"      (ops, not on employee timeline)
Approval Log     → "Bob approved leave at step 2"         (governance)
Notification Log → "Email sent to manager, delivered"     (delivery proof)
AI Log           → "AI suggested promotion, user rejected" (intelligence audit)
```

### Engine components (platform — conceptual)

| Component | Role |
|-----------|------|
| **Activity Registry** | Entity types + action types per module |
| **Activity Writer** | `ActivityService.log()` |
| **Timeline Aggregator** | Merge activities, approvals, AI for entity |
| **Employee 360 Aggregator** | Cross-entity timeline for `hr_employee` |
| **Search Index** | Filter by user, date, action, entity |
| **Retention Worker** | Archive / purge per policy |
| **Export Service** | Auditor bundles |
| **Redaction Layer** | Field ACL on read |

---

# Activity Types (Global Registry)

Platform **canonical action types** — HR extends with **domain subtypes** in payload.

### Platform action types

| Type | Code | Description |
|------|------|-------------|
| Create | `create` | Record inserted |
| Update | `update` | Field(s) changed |
| Delete | `delete` | Soft delete |
| Archive | `archive` | Archived / terminated |
| Restore | `restore` | Undelete |
| Approve | `approve` | Approval granted |
| Reject | `reject` | Approval denied |
| Transfer | `transfer` | Cross org/company move |
| Assign | `assign` | Custody, shift, goal |
| Unassign | `unassign` | Remove assignment |
| Import | `import` | Bulk import |
| Export | `export` | Bulk export |
| Print | `print` | PDF/print action |
| Download | `download` | File download (payslip) |
| Login | `login` | ESS login (optional) |
| Logout | `logout` | ESS logout |
| Password reset | `password_reset` | Security |
| Status change | `status_change` | Workflow state |
| Bulk update | `bulk_update` | Mass operation |
| System action | `system` | Cron, sync, lock |
| AI suggested | `ai_suggested` | Proposal created |
| AI insight | `ai_insight` | Read-only insight generated |

### HR domain subtypes (in `payload.subtype`)

`salary_changed` · `promoted` · `attendance_changed` · `leave_changed` · `payroll_locked` · `payroll_posted` · `asset_assigned` · `asset_returned` · `hired` · `terminated` · `confirmed` · `encashed` · `biometric_sync` · `payslip_published` · `bank_export` · …

---

# Global Log Structure

Every log entry (conceptual record) **must** support:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **Log ID** | UUID | ✓ | Unique immutable identifier |
| **Module** | string | ✓ | `hr`, `payroll`, `ess` |
| **Entity type** | string | ✓ | Registry ID e.g. `hr_employee` |
| **Entity ID** | UUID | ✓ | Record primary key |
| **Action type** | enum | ✓ | Platform action type |
| **Subtype** | string | | Domain subtype |
| **Company** | UUID | ✓ | `company_id` |
| **Branch** | UUID | | When applicable |
| **Department** | UUID | | Snapshot or FK |
| **User** | UUID | ✓ | `actor_user_id` |
| **Role** | string | | Effective role at action time |
| **Timestamp** | timestamptz | ✓ | UTC `occurred_at` |
| **Description** | string | ✓ | Rendered summary (i18n key + vars) |
| **Reason** | text | | Required on sensitive actions |
| **Source** | enum | ✓ | `ui`, `api`, `ess`, `import`, `device`, `system`, `ai` |
| **Payload** | JSON | | Structured detail (see change tracking) |
| **Correlation ID** | UUID | | Workflow / batch / approval chain |
| **Approval reference** | UUID | | `approval_request_id` |
| **Notification reference** | UUID | | `notification_delivery_id` (optional) |
| **AI reference** | UUID | | `ai_audit_log_id` (optional) |
| **Tenant** | UUID | ✓ | `tenant_id` |
| **Audit tier** | enum | | `standard`, `compliance`, `permanent` |
| **PII class** | enum | | `none`, `internal`, `restricted`, `critical` |

### Secondary indexes (planning)

`(entity_type, entity_id, occurred_at DESC)` · `(company_id, occurred_at)` · `(actor_user_id, occurred_at)` · `(correlation_id)` · `(subtype, occurred_at)`

---

# Change Tracking Architecture

Embedded in `payload.field_changes[]` for `update` and domain-specific actions.

| Field | Description |
|-------|-------------|
| **Field name** | Canonical path e.g. `department_id`, `gross_salary` |
| **Old value** | Serialized prior value (masked if restricted) |
| **New value** | Serialized new value |
| **Changed by** | `actor_user_id` (duplicate for export) |
| **Changed on** | `occurred_at` |
| **Reason** | Per-field or action-level |
| **Approval reference** | If change resulted from approved request |

### Sensitive field handling

| Field class | Stored in log | Shown in UI |
|-------------|---------------|------------|
| Public | Full | Full |
| Internal | Full | Role-filtered |
| Restricted (salary, bank) | Encrypted or tokenized in compliance tier | Masked without `hr.sensitive.view` |
| Critical (full bank account) | Hash + last-4 only in standard tier | Never in timeline for managers |

### Snapshot actions

For `attendance_changed`, `payroll_recalculated`: include `before_snapshot` and `after_snapshot` JSON in payload.

---

# Employee Activity Logs

**Entity type:** `hr_employee`  
**Secondary timeline:** Employee 360° aggregates linked entities.

| Event | Action | Subtype | Audit tier | Reason required |
|-------|--------|---------|------------|-----------------|
| Employee created | `create` | `hired` | standard | |
| Profile updated | `update` | — | standard | |
| Department changed | `transfer` | `department_changed` | compliance | optional |
| Designation changed | `update` | `designation_changed` | compliance | |
| Manager changed | `assign` | `manager_changed` | standard | |
| Salary changed | `update` | `salary_changed` | **permanent** | ✓ |
| Bank account updated | `update` | `bank_updated` | **permanent** | ✓ |
| Document uploaded | `attachment` | `document_uploaded` | standard | |
| Document removed | `delete` | `document_removed` | compliance | ✓ |
| Asset assigned | `assign` | `asset_assigned` | standard | |
| Asset returned | `unassign` | `asset_returned` | standard | |
| Promotion | `status_change` | `promoted` | compliance | |
| Transfer | `transfer` | `transferred` | compliance | ✓ |
| Confirmation | `status_change` | `confirmed` | compliance | |
| Resignation | `status_change` | `resignation_submitted` | compliance | |
| Termination | `archive` | `terminated` | **permanent** | ✓ |
| Rehire | `create` | `rehired` | compliance | ✓ |

**Cross-links:** Also write summary milestone to `hr_employee_timeline` (domain supplement) with `activity_log_id` reference.

---

# Attendance Activity Logs

**Entity type:** `hr_attendance` · `hr_attendance_correction`

| Event | Action | Subtype | Notes |
|-------|--------|---------|-------|
| Attendance generated | `system` | `attendance_generated` | Engine daily run |
| Attendance corrected | `update` | `attendance_changed` | before/after snapshot |
| Attendance approved | `approve` | `correction_approved` | approval ref |
| Attendance rejected | `reject` | `correction_rejected` | |
| Manual attendance added | `create` | `manual_entry` | source=ui |
| Attendance imported | `import` | `bulk_import` | correlation_id=batch |
| Biometric sync completed | `system` | `biometric_sync_ok` | device entity |
| Biometric sync failed | `system` | `biometric_sync_failed` | ops alert |
| Overtime generated | `system` | `overtime_generated` | |
| Attendance recalculated | `system` | `attendance_recalculated` | post-correction |

---

# Shift Activity Logs

**Entity type:** `hr_shift_definition` · `hr_shift_assignment`

| Event | Action | Subtype |
|-------|--------|---------|
| Shift created | `create` | — |
| Shift updated | `update` | — |
| Shift assigned | `assign` | `shift_assigned` |
| Shift removed | `unassign` | `shift_removed` |
| Rotation updated | `update` | `rotation_updated` |
| Override applied | `system` | `shift_override` |

---

# Leave Activity Logs

**Entity type:** `hr_leave_request` · `hr_leave_balance`

| Event | Action | Subtype |
|-------|--------|---------|
| Leave requested | `create` | `leave_requested` |
| Leave approved | `approve` | `leave_approved` |
| Leave rejected | `reject` | `leave_rejected` |
| Leave cancelled | `status_change` | `leave_cancelled` |
| Leave adjusted | `update` | `leave_adjusted` |
| Leave encashed | `system` | `leave_encashed` |
| Balance updated | `update` | `balance_updated` |

Balance adjustments require `reason` + `hr.leave.balance.adjust` permission logged in payload.

---

# Payroll Activity Logs

**Entity types:** `payroll_run` · `payroll_payslip` · `payroll_salary_revision` · `payroll_employee_salary`

Highly detailed — financial critical path. All **permanent** or **compliance** tier.

| Event | Action | Subtype | Payload highlights |
|-------|--------|---------|------------------|
| Payroll generated | `create` | `payroll_generated` | run_id, period, employee_count |
| Payroll recalculated | `system` | `payroll_recalculated` | version, reason |
| Payroll approved | `approve` | `payroll_approved` | approval_id, approver |
| Payroll rejected | `reject` | `payroll_rejected` | reason |
| Payroll locked | `system` | `payroll_locked` | **immutable** lock timestamp |
| Payroll reopened | `system` | `payroll_reopened` | **permanent**, reason, authorizer |
| Payslip generated | `create` | `payslip_generated` | employee_id, hash |
| Payslip published | `status_change` | `payslip_published` | ESS visibility |
| Payslip downloaded | `download` | `payslip_downloaded` | actor, channel |
| Salary revision applied | `update` | `salary_changed` | effective_from, structure_id |
| Bonus added | `assign` | `bonus_added` | component, amount |
| Commission added | `assign` | `commission_added` | source event ref |
| Tax updated | `update` | `tax_updated` | rule version |
| Deduction updated | `update` | `deduction_updated` | component |
| Bank export generated | `export` | `bank_export` | file hash, row count |
| Payroll posted to GL | `system` | `payroll_posted` | journal_entry_id |

**SoD:** Log `actor_user_id` on calculate vs approve — compliance reports flag same user.

---

# Loan Activity Logs

**Entity type:** `payroll_loan`

| Event | Action | Subtype |
|-------|--------|---------|
| Loan requested | `create` | `loan_requested` |
| Loan approved | `approve` | `loan_approved` |
| Loan rejected | `reject` | `loan_rejected` |
| Loan disbursed | `status_change` | `loan_disbursed` |
| Installment deducted | `system` | `installment_deducted` | payslip_id |
| Loan closed | `status_change` | `loan_closed` |

---

# Performance Activity Logs

**Entity types:** `hr_performance_review` · `hr_goal` · `hr_promotion_recommendation`

| Event | Action | Subtype |
|-------|--------|---------|
| Goal created | `create` | `goal_created` |
| Goal updated | `update` | `goal_updated` |
| Review submitted | `status_change` | `review_submitted` |
| Review approved | `approve` | `review_completed` |
| Promotion recommended | `create` | `promotion_recommended` |
| Salary recommendation | `ai_suggested` or `create` | `salary_recommendation` |

---

# Training Activity Logs

**Entity types:** `hr_training_program` · `hr_training_enrollment`

| Event | Action | Subtype |
|-------|--------|---------|
| Training created | `create` | — |
| Training updated | `update` | — |
| Attendance recorded | `assign` | `training_attended` |
| Certificate issued | `create` | `certificate_issued` |
| Evaluation submitted | `update` | `evaluation_submitted` |

---

# Asset Activity Logs

**Entity types:** `hr_asset` · `hr_asset_assignment`

| Event | Action | Subtype |
|-------|--------|---------|
| Asset created | `create` | — |
| Asset assigned | `assign` | `asset_assigned` |
| Asset returned | `unassign` | `asset_returned` |
| Asset damaged | `update` | `asset_damaged` |
| Asset replaced | `transfer` | `asset_replaced` |
| Asset disposed | `archive` | `asset_disposed` |

---

# Document Activity Logs

**Entity type:** `hr_employee_document`

| Event | Action | Subtype |
|-------|--------|---------|
| Document uploaded | `attachment` | `document_uploaded` |
| Document updated | `update` | `document_updated` |
| Document approved | `approve` | `document_verified` |
| Document rejected | `reject` | `document_rejected` |
| Document expired | `system` | `document_expired` |
| Document renewed | `create` | `document_renewed` |
| Document archived | `archive` | `document_archived` |

---

# Approval Log Architecture

Approval history stored in Core **`activity_approvals`** — linked from HR activity entries.

### Per approval step record

| Field | Description |
|-------|-------------|
| Approval request ID | Parent request |
| Approval level | Step number / name |
| Approver | `user_id` |
| Delegate | If acting as delegate |
| Decision | `pending`, `approved`, `rejected`, `skipped` |
| Comment | Approver note |
| Date / time | `decided_at` |
| Escalation history | Array of escalation events |

### Escalation log entry

| Field | Description |
|-------|-------------|
| From approver | Original assignee |
| To approver | Escalation target |
| Reason | SLA breach |
| Escalated at | Timestamp |

**UI:** Approval tab in Global Activity Drawer shows full chain chronologically.

---

# Notification Log Architecture

Cross-reference only — authoritative store is **`notification_deliveries`** (Core).

### HR activity cross-link

When notification is material to compliance (payslip published, offer sent):

| Field | Description |
|-------|-------------|
| Notification trigger | Domain event name |
| Recipients | Resolved user_ids |
| Channels | in_app, email, … |
| Delivery status | pending → delivered / failed |
| Read status | `read_at` |
| Action taken | Deep link clicked (optional) |

**Activity entry:** `system` subtype `notification_sent` with `notification_delivery_id` — not duplicate of delivery log.

---

# Audit Trail Architecture

Superset for compliance export — may include fields not shown in user timeline.

| Dimension | Captured |
|-----------|----------|
| **Who** | `actor_user_id`, `role`, service account if system |
| **What** | action + subtype + entity |
| **When** | `occurred_at` (UTC) |
| **Why** | `reason` text |
| **Before value** | field_changes or snapshot |
| **After value** | field_changes or snapshot |
| **Approval reference** | `approval_request_id` |
| **IP address** | Future — session metadata |
| **Device information** | Future — user agent, device_id for ESS |

### Audit export bundle (`hr.audit.export`)

```text
Employee scope OR date range
        ↓
activity_logs (compliance+ permanent tiers)
        ↓
+ activity_approvals
        ↓
+ notification_deliveries (payslip, offer)
        ↓
+ payroll document hashes
        ↓
Signed export manifest (future)
```

---

# Timeline View Architecture

### Employee 360° timeline

Every **employee profile** exposes unified chronological view — aggregates:

| Source | Events shown |
|--------|--------------|
| `hr_employee` | Lifecycle, org, compensation |
| `hr_leave_request` | Leave history |
| `hr_performance_review` | Reviews, goals |
| `hr_asset_assignment` | Assets |
| `hr_training_enrollment` | Training |
| `hr_employee_document` | Documents |
| `payroll_payslip` | Pay events (summary — not line detail) |
| `activity_approvals` | Decisions affecting employee |

### Example chronological narrative

```text
2024-01-15  Joined company          (hired)
2024-04-15  Probation completed     (confirmed)
2024-06-01  Promotion to Senior     (promoted)
2024-06-01  Salary revision         (salary_changed)
2024-08-10  Leave approved 5d       (leave_approved)
2024-09-01  Training completed      (certificate_issued)
2024-11-20  Asset assigned laptop   (asset_assigned)
2025-01-31  Payslip published       (payslip_published)
```

### UI surfaces

| Surface | Scope |
|---------|-------|
| **Global Activity Drawer** | Single entity (any record) |
| **Employee drawer → Timeline tab** | 360° aggregated |
| **Compliance export** | Filtered audit view |

---

# Entity Timeline Requirements

| Entity | Timeline required | Aggregates to employee 360° |
|--------|-------------------|----------------------------|
| **Employee** | ✓ (primary) | — |
| **Attendance** | ✓ | ✓ |
| **Leave request** | ✓ | ✓ |
| **Payroll run** | ✓ | Summary on employee |
| **Payslip** | ✓ | ✓ |
| **Loan** | ✓ | ✓ |
| **Asset assignment** | ✓ | ✓ |
| **Training enrollment** | ✓ | ✓ |
| **Performance review** | ✓ | ✓ |
| **Document** | ✓ | ✓ |
| **Candidate** | ✓ (pre-hire) | On hire, link to employee |

**Platform rule:** Any entity with `entity_type` registration **must** support Activity Drawer per [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md).

---

# Search & Filter Architecture

### Filter dimensions

| Filter | Index | Permission gate |
|--------|-------|-----------------|
| Employee | `entity_id` or employee 360 index | `hr.employee.view` + record rule |
| Department | `department_id` snapshot | Manager subtree |
| Branch | `branch_id` | Branch scope |
| Company | `company_id` | Session company |
| Date range | `occurred_at` | — |
| Action type | `action_type`, `subtype` | — |
| User (actor) | `actor_user_id` | HR+ |
| Role | `actor_role` | Admin |
| Approval status | join `activity_approvals` | Approver or HR |
| Module | `module` | — |
| Audit tier | `audit_tier` | Auditor |

### Search behavior

- Full-text on `description` + subtype labels
- Restricted fields never searchable by content — metadata only
- Employee self: filter forced to `employee_id = self`
- Export of search results → `export` activity logged

---

# Retention Policy

| Tier | Class | Retention | Examples |
|------|-------|-----------|----------|
| **Active** | standard | 2 years online | Profile updates, shift assign |
| **Archived** | standard | Move to cold storage after 2y | Old attendance activities |
| **Compliance** | compliance | 7+ years | Salary, termination, leave, payroll lock |
| **Long-term** | compliance | 10 years (config) | Tax, statutory |
| **Permanent** | permanent | Never purge | Posted payroll, termination, bank export |

### Purge rules

| Rule | Detail |
|------|--------|
| Legal hold | Blocks purge for entity |
| Candidate rejected | Shorter retention (GDPR config) |
| System/device logs | 90 days – 1 year |
| Notification deliveries | Per notification architecture |
| Partition strategy | Monthly partitions by `occurred_at` |

---

# Security Rules

Who can see which log classes — aligns with [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md).

| Log class | Employee | Manager | HR Exec | HR Mgr | Payroll | Auditor | Co. Admin |
|-----------|----------|---------|---------|--------|---------|---------|-----------|
| **Activity (own)** | ✓ | — | — | — | — | — | — |
| **Activity (team)** | — | ✓† | ✓ | ✓ | — | — | ✓ |
| **Activity (company)** | — | — | ✓ | ✓ | V‡ | — | ✓ |
| **Audit export** | — | — | — | — | — | ✓ | ✓ |
| **Payroll logs** | Own payslip events | — | — | V | ✓ | ✓ | ✓ |
| **Salary changes** | Own | — | — | ✓ | ✓ | ✓ | ✓ |
| **Approval logs** | Own requests | Team | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Compliance logs** | — | — | V | ✓ | ✓ | ✓ | ✓ |
| **AI logs** | Own interactions | — | — | ✓ | — | ✓ | ✓ |

† Department subtree  
‡ No salary field values without `hr.sensitive.view`

### API enforcement

- Activity read API applies record rules + field redaction
- `hr.audit.export` separate permission — logged itself
- Platform super admin bypass — audited as `permanent` tier

---

# AI Ready Log Design

Future **AI HR Assistant** consumes logs via **read-only analytics APIs** — never direct table access.

### AI capabilities enabled by log structure

| Capability | Data used |
|------------|-----------|
| **Analyze activity trends** | Aggregated action counts by dept/time |
| **Detect anomalies** | Attendance correction frequency, OT spikes |
| **Generate summaries** | Employee 360 narrative from timeline |
| **Identify risks** | Termination + attendance pattern |
| **Recommend actions** | Training gaps from activity gaps |

### What AI can use

| Data | Condition |
|------|-----------|
| Action types, timestamps | Aggregated, de-identified OK |
| Subtype counts | Yes |
| Field changes | Only if user has `hr.sensitive.view` |
| Approval outcomes | Yes |
| Payslip amounts | Never in AI context without payroll permission |
| Other employees' PII | Blocked by record rules |

### AI log integration

| Event | Storage |
|-------|---------|
| AI suggestion | `ai_audit_logs` + `activity_ai_actions` |
| User apply/reject | `ai_suggested` / `approve` / `reject` on entity |
| Insight generated | `ai_insight` on `hr_employee` or dashboard entity |

**Link:** `ai_audit_log_id` on activity row for drill-down.

---

# Cross Module Future Compatibility

This architecture is the **reference implementation** for the **Global Activity Engine**. All modules adopt the same contract.

### Universal contract (all modules)

```text
ActivityService.log({
  module, entity_type, entity_id, action_type, subtype?,
  company_id, branch_id?, department_id?,
  actor_user_id, occurred_at, description, reason?, source,
  payload: { field_changes?, snapshots?, refs? },
  correlation_id?, approval_request_id?, audit_tier?, pii_class?
})
```

### Module entity registry (future)

| Module | Example entity types |
|--------|------------------------|
| **HR & Payroll** | `hr_employee`, `payroll_run`, … (this doc) |
| **CRM** | `crm_lead`, `crm_opportunity` |
| **Sales** | `sales_order`, `sales_quotation` |
| **Inventory** | `inventory_transfer`, `inventory_adjustment` |
| **Purchase** | `purchase_order`, `purchase_bill` |
| **Accounting** | `finance_journal_entry`, `finance_invoice` |
| **Projects** | `project_task`, `project_timesheet` |
| **Manufacturing** | `manufacturing_work_order`, `manufacturing_bom` |
| **Ecommerce** | `commerce_order`, `catalog_product` |
| **POS** | `pos_session`, `pos_order` |
| **Helpdesk** | `helpdesk_ticket` |
| **Documents** | `document_file` |
| **Knowledge** | `knowledge_article` |
| **Business Partners** | `bp_partner` |

### Shared platform features (all modules)

1. Activity timeline on every record  
2. Comments, notes, mentions  
3. Attachments tab  
4. Followers  
5. Approval history tab  
6. AI actions tab  
7. Unified search / export  
8. Retention tier classification  

### HR contributions to global engine

| HR innovation | Global adoption |
|---------------|-----------------|
| Employee 360° aggregator | `Contact` / `Partner` 360° patterns |
| Compliance tier `permanent` | Finance posted journals |
| before/after snapshots | Inventory adjustments |
| SoD reporting on actor | Purchase approve vs create |
| Sensitive field redaction | Salary → cost price patterns |

### Global Activity Engine roadmap

| Phase | Scope |
|-------|-------|
| **P1** | Core writer + drawer (existing prototype) |
| **P2** | HR full registry (this document) |
| **P3** | Purchase, Sales, Inventory parity |
| **P4** | 360° aggregators, compliance export |
| **P5** | AI analytics read models, hash chain |

---

# HR Entity Type Registry (Activity)

Register with Global Activity Engine on module install.

| Entity type | Module | Timeline | 360° |
|-------------|--------|----------|------|
| `hr_employee` | hr | ✓ | root |
| `hr_department` | hr | ✓ | |
| `hr_attendance` | hr | ✓ | ✓ |
| `hr_attendance_correction` | hr | ✓ | ✓ |
| `hr_leave_request` | hr | ✓ | ✓ |
| `hr_shift_assignment` | hr | ✓ | ✓ |
| `hr_overtime_request` | hr | ✓ | ✓ |
| `hr_candidate` | hr | ✓ | link on hire |
| `hr_job_requisition` | hr | ✓ | |
| `hr_offer_letter` | hr | ✓ | |
| `hr_performance_review` | hr | ✓ | ✓ |
| `hr_goal` | hr | ✓ | ✓ |
| `hr_training_enrollment` | hr | ✓ | ✓ |
| `hr_asset` | hr | ✓ | |
| `hr_asset_assignment` | hr | ✓ | ✓ |
| `hr_employee_document` | hr | ✓ | ✓ |
| `payroll_run` | payroll | ✓ | |
| `payroll_payslip` | payroll | ✓ | ✓ |
| `payroll_loan` | payroll | ✓ | ✓ |
| `payroll_salary_advance` | payroll | ✓ | ✓ |
| `payroll_salary_revision` | payroll | ✓ | ✓ |

---

# Integration with Related Engines

```text
┌─────────────────────────────────────────────────────────────────┐
│                     HR / Payroll Service                         │
│              (sole business mutation entry point)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │ ActivityService.log()
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Global Activity Engine (Core)                     │
│  activities · activity_logs · activity_approvals · activity_ai    │
└───┬─────────────┬─────────────┬─────────────┬───────────────────┘
    │             │             │             │
    ▼             ▼             ▼             ▼
 Workflow    Approval    Notification    AI OS
 (transition) (steps)     (delivery ref)  (audit)
```

| Engine | Activity integration |
|--------|---------------------|
| **Workflow** | `status_change` on transition |
| **Approval** | `activity_approvals` rows; `approve`/`reject` activities |
| **Notification** | Optional `notification_delivery_id` cross-ref |
| **Permission** | Log export + permission audit separate |
| **Event Bus** | Event + activity dual-write (outbox pattern) |

---

# Child Documentation Roadmap

| Document | Relationship |
|----------|--------------|
| Global `ACTIVITY_ENGINE_ARCHITECTURE.md` (future) | Generalizes this doc platform-wide |
| `HR_DATABASE_ARCHITECTURE.md` | Domain history supplements |
| `API.md` | Activity read endpoints |
| `INTEGRATION.md` | Event ↔ activity mapping |
| UI prototype | Drawer + employee timeline tab |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll · Global Activity Engine reference |
| **Owner** | Platform / Core + HR domain |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Parent** | [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md) |

---

**AgainERP HR & Payroll Activity Log Architecture** — full traceability, platform-first, global-engine ready. Every change attributable. No code.
