# HR & Payroll — Database Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll (unified enterprise suite)  
> **Document Type:** Database Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Table namespaces:** `hr_*` · `payroll_*`  
> **Parent:** [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md)  
> **Governance:** [MASTER_DATABASE_ARCHITECTURE.md](../../database/MASTER_DATABASE_ARCHITECTURE.md) · [standards.md](../../database/standards.md) · [audit-trail.md](../../database/audit-trail.md) · [multi-company.md](../../database/multi-company.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../core/ACTIVITY_CHATTER_ARCHITECTURE.md) · [PERMISSION_SYSTEM_ARCHITECTURE.md](../../core/PERMISSION_SYSTEM_ARCHITECTURE.md)

**No SQL. No migrations. No application code.**  
This document defines the **complete logical database blueprint** for AgainERP HR & Payroll — entity map, ownership, relationships, and cross-cutting strategies. It is the foundation for ER diagrams, table design, API design, workflow design, permission design, and AI architecture.

---

## Overview

The HR & Payroll database is split across two bounded contexts under one documentation umbrella:

| Namespace | Owner | Scope |
|-----------|-------|-------|
| `hr_*` | HR module | Workforce, org, time, talent, assets, recruitment |
| `payroll_*` | Payroll module | Compensation, tax, runs, payslips, loans |

**Identity rule:** Person data lives in Core `contacts`. Employment data lives in `hr_employees`. Pay calculation lives in `payroll_*`. No `hr_persons` table.

```text
Core (shared)
├── contacts, addresses, users, companies, branches
├── attachments, notes, tags, activities (platform)
└── permissions, roles, record_rules (platform)

HR & Payroll (module-owned)
├── hr_*          → workforce & time
└── payroll_*     → compensation & compliance
```

### Scale targets

| Domain | Volume (enterprise tenant) |
|--------|---------------------------|
| Employees | 50,000+ per company |
| Attendance logs | 10M+ punches/year |
| Daily attendance rows | 500K+/year |
| Leave requests | 100K+/year |
| Payslips | 600K+/year (immutable archive) |
| Activity entries | Unbounded (partitioned by time) |

### DBMS

PostgreSQL 15+ (primary OLTP). Analytics facts derived via events → warehouse (future).

---

## Database Design Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **Single table owner** | Only HR writes `hr_*`; only Payroll writes `payroll_*` |
| 2 | **Core-first identity** | `hr_employees.contact_id` → `contacts.id` (required) |
| 3 | **Tenant + company scope** | `tenant_id`, `company_id` on every business row |
| 4 | **Branch/location scope** | `branch_id`, `location_id` where geographically relevant |
| 5 | **No cross-module FK writes** | Accounting, Inventory reference UUIDs; integration via events |
| 6 | **Soft delete default** | `deleted_at` on master/config tables; never hard-delete employment history |
| 7 | **Immutable financial facts** | Posted payslips and locked payroll runs are append-only |
| 8 | **Activity on everything** | Core `activities` engine — not per-module duplicate logs |
| 9 | **Version effective dating** | Salary, org assignment, tax rules use `effective_from` / `effective_to` |
| 10 | **Record locking** | Payroll periods and posted documents lock dependent edits |
| 11 | **API-first access** | External modules use Service APIs, not direct SQL |
| 12 | **AI-ready metadata** | Denormalized read models + event streams for analytics/AI |

### Standard columns (every `hr_*` / `payroll_*` business table)

| Column | Type | Rule |
|--------|------|------|
| `id` | UUID PK | Primary key |
| `tenant_id` | UUID | SaaS isolation |
| `company_id` | UUID | Legal employer scope |
| `status` | ENUM/VARCHAR | Domain-specific lifecycle |
| `created_at` | TIMESTAMPTZ | Insert time |
| `updated_at` | TIMESTAMPTZ | Last mutation |
| `created_by` | UUID | → `users.id` |
| `updated_by` | UUID | → `users.id` |
| `deleted_at` | TIMESTAMPTZ | Soft delete (nullable) |
| `deleted_by` | UUID | Soft delete actor |

Optional scope columns: `branch_id`, `department_id`, `location_id`, `warehouse_id`.

---

## Multi Company Strategy

Aligns with [multi-company.md](../../database/multi-company.md) and [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md).

```text
Tenant
└── Company (legal employer — Core companies)
    └── Branch (operating unit — Core branches)
        └── Location (work site — hr_locations)
            └── Department (org unit — hr_departments)
                └── Team (optional — hr_teams)
                    └── Employee (hr_employees)
```

| Rule | Description |
|------|-------------|
| **Query isolation** | All SELECT/INSERT/UPDATE filter `tenant_id` + active `company_id` |
| **Employee number** | UNIQUE per `(tenant_id, company_id, employee_number)` |
| **Payroll run** | Single `company_id` per run — no cross-company batch |
| **Group employee** | Same `contact_id`, separate `hr_employees` row per company |
| **Inter-company transfer** | Close row A (`terminated`) → open row B (`active`); link via `hr_employee_transfers` |
| **Consolidated reporting** | Read models / BI only — no cross-company transactional FK |
| **API** | `X-Company-Id` header or JWT claim validated on every endpoint |

---

## Multi Branch Strategy

| Entity | Branch scope |
|--------|--------------|
| `hr_employees` | Primary `branch_id` (work location) |
| `hr_attendance` | `branch_id` where punch occurred |
| `hr_attendance_devices` | Registered to `branch_id` |
| `hr_holidays` | `branch_id` nullable = company-wide |
| `hr_shift_assignments` | May vary by branch |
| `payroll_runs` | Company-level; branch breakdown via cost allocation (optional) |

Managers with branch-scoped roles see only employees in allowed branches (Core `record_rules`).

---

## Data Ownership Rules

| Data | Owner | HR/Payroll usage |
|------|-------|------------------|
| Person name, email, phone | Core `contacts` | Read/write via HR Service for employee-linked contacts |
| Postal addresses | Core `addresses` | Home/work address polymorphic link |
| Login accounts | Core `users` | Optional `hr_employees.user_id` |
| Companies, branches | Core | Reference only |
| Files | Core `attachments` | Polymorphic `entity_type` + `entity_id` |
| Notes, tags | Core | Polymorphic on `hr_employees` |
| Activities, comments | Core Activity Engine | `entity_type`: `hr_employee`, `hr_leave_request`, etc. |
| Permissions, roles | Core Permission System | `hr.*`, `payroll.*`, `ess.*` keys |
| Approvals | Core Approval Engine | Linked by `approval_id` on requests |
| Notifications | Core Notification Engine | Templates + delivery logs |
| GL journals | Accounting | Subscriber to `payroll.run.posted` |
| Fixed assets (inventory) | Inventory (optional) | UUID reference on `hr_assets.inventory_asset_id` |

**Forbidden:** Payroll module updating `hr_attendance` directly. HR module posting accounting journals directly.

---

## Audit & Activity Log Strategy

Per [ACTIVITY_CHATTER_ARCHITECTURE.md](../core/ACTIVITY_CHATTER_ARCHITECTURE.md) and [audit-trail.md](../../database/audit-trail.md).

### Platform activity (Core — not duplicated in HR)

| Core table | Purpose |
|------------|---------|
| `activities` | Timeline header per entity |
| `activity_logs` | Typed events with JSON payload |
| `activity_comments` | User comments |
| `activity_notes` | Internal notes |
| `activity_attachments` | File links |
| `activity_approvals` | Approval history |
| `activity_ai_actions` | AI operation audit |

### HR entity types registered in Activity Engine

`hr_employee` · `hr_department` · `hr_attendance` · `hr_leave_request` · `hr_overtime_request` · `hr_job_requisition` · `hr_candidate` · `hr_asset_assignment` · `hr_performance_review` · `hr_training_enrollment` · `payroll_run` · `payroll_payslip` · `payroll_loan` · `hr_travel_request` · `hr_expense_claim`

### HR-specific domain activity types

| Activity type | Trigger |
|---------------|---------|
| `created` | Record insert |
| `updated` | Field change (field-level diff in payload) |
| `deleted` | Soft delete |
| `approved` | Workflow approval |
| `rejected` | Workflow rejection |
| `transferred` | Inter-dept/branch/company move |
| `promoted` | Grade/position change |
| `salary_changed` | Compensation revision |
| `attendance_changed` | Correction or manual override |
| `leave_changed` | Balance adjustment |
| `asset_assigned` | Custody start |
| `asset_returned` | Custody end |
| `payroll_locked` | Period lock |
| `payroll_posted` | GL post |

### Domain history tables (HR-owned append-only)

| Table | Purpose |
|-------|---------|
| `hr_employee_history` | Employment changes (dept, manager, status, grade) |
| `hr_employee_timeline` | Lifecycle milestones (hire, probation end, exit) |
| `payroll_salary_revisions` | Effective-dated compensation changes |
| `hr_attendance_corrections` | Before/after attendance with approval ref |

Activity Engine is **authoritative for UI timeline**; history tables are **authoritative for reporting and compliance exports**.

---

## Soft Delete Strategy

| Category | Soft delete | Notes |
|----------|-------------|-------|
| Master config (leave types, components) | Yes | `deleted_at`; block if referenced by active records |
| Employee | Yes | Terminated employees archived, not hard-deleted |
| Attendance daily row | No delete | Corrections only; original preserved |
| Posted payslip | **Never delete** | Void via adjustment run |
| Payroll run (posted) | **Never delete** | Reversal document only |
| Device logs | Retain | TTL archive to cold storage after N years |
| Candidates (not hired) | Yes | GDPR retention policy per tenant |

Restore requires `hr.restore` / `payroll.restore` permission and emits `restore` activity.

---

## Version History Strategy

| Entity | Version pattern |
|--------|-----------------|
| Salary structure assignment | `payroll_employee_salaries` rows with `effective_from`, `effective_to` |
| Tax rules | `payroll_tax_rules` versioned by effective dates |
| Org assignment | `hr_employee_history` per change |
| Leave policy | `hr_leave_policies` + `version` column; active policy pointer |
| Shift rules | `hr_shift_rules` effective dating |
| Employment contract | Core `attachments` + `hr_employee_documents.version` |
| Payslip PDF | `payroll_payslips.document_hash` immutable |

**Rule:** Updates to effective-dated records **close** the current row (`effective_to = yesterday`) and **insert** a new row — never overwrite historical compensation or org facts.

---

## Record Locking Strategy

| Lock type | Scope | Effect |
|-----------|-------|--------|
| **Payroll period lock** | `payroll_periods.is_locked` | Blocks attendance/leave edits for that period |
| **Payroll run lock** | `payroll_runs.status = locked` | Payslips published; no recalculation |
| **Posted payslip** | `payroll_payslips.status = posted` | Immutable lines; adjustment via new run |
| **Accounting period** | Core accounting period | Blocks `payroll_runs.post` |
| **Employee exit lock** | `hr_employees.status = terminated` | Blocks new leave; allows F&F payroll |
| **Optimistic lock** | `row_version` INT on hot tables | Concurrent edit detection |

Lock events emit `payroll.period.locked`, `payroll.run.locked` for subscribers.

---

## Complete Entity Map

```text
HR & Payroll Module (logical)
│
├── Organization
│   ├── hr_locations
│   ├── hr_departments
│   ├── hr_teams
│   ├── hr_designations
│   ├── hr_job_positions
│   ├── hr_employment_types
│   ├── hr_employment_statuses (reference)
│   ├── hr_reporting_lines
│   └── hr_cost_centers
│
├── Employee
│   ├── hr_employees (master)
│   ├── hr_employee_emergency_contacts
│   ├── hr_employee_education
│   ├── hr_employee_experience
│   ├── hr_employee_family
│   ├── hr_employee_skills
│   ├── hr_employee_certifications
│   ├── hr_employee_documents
│   ├── hr_employee_bank_accounts
│   ├── hr_employee_custom_fields
│   ├── hr_employee_history
│   ├── hr_employee_timeline
│   └── hr_employee_tags (→ Core tags)
│
├── Recruitment
│   ├── hr_job_positions (shared with org)
│   ├── hr_job_requisitions
│   ├── hr_candidates
│   ├── hr_candidate_documents
│   ├── hr_interview_stages
│   ├── hr_interview_feedback
│   ├── hr_offer_letters
│   └── hr_hiring_records
│
├── Attendance
│   ├── hr_attendance_devices
│   ├── hr_biometric_devices (extends devices)
│   ├── hr_device_sync_logs
│   ├── hr_attendance_logs (raw punches)
│   ├── hr_attendance (daily summary)
│   ├── hr_attendance_corrections
│   ├── hr_attendance_policies
│   ├── hr_attendance_rules
│   ├── hr_attendance_exceptions
│   ├── hr_wfh_records
│   └── hr_outdoor_duty_records
│
├── Shift
│   ├── hr_shift_definitions
│   ├── hr_shift_assignments
│   ├── hr_shift_rotations
│   ├── hr_shift_calendars
│   ├── hr_shift_rules
│   └── hr_shift_exceptions
│
├── Leave
│   ├── hr_leave_types
│   ├── hr_leave_policies
│   ├── hr_leave_balances
│   ├── hr_leave_requests
│   ├── hr_leave_encashments
│   ├── hr_leave_accrual_runs
│   └── hr_holiday_calendars
│
├── Payroll
│   ├── payroll_salary_components
│   ├── payroll_salary_structures
│   ├── payroll_salary_structure_lines
│   ├── payroll_employee_salaries
│   ├── payroll_tax_rules
│   ├── payroll_contribution_rules
│   ├── payroll_periods
│   ├── payroll_runs
│   ├── payroll_run_employees
│   ├── payroll_payslips
│   ├── payroll_payslip_lines
│   ├── payroll_bonuses
│   ├── payroll_commissions
│   ├── payroll_salary_revisions
│   ├── payroll_salary_arrears
│   ├── payroll_adjustments
│   └── payroll_ytd_summaries
│
├── Overtime
│   ├── hr_overtime_policies
│   ├── hr_overtime_requests
│   └── hr_overtime_calculations
│
├── Loan & Advance
│   ├── payroll_loans
│   ├── payroll_loan_installments
│   ├── payroll_loan_payments
│   ├── payroll_salary_advances
│   └── payroll_advance_recoveries
│
├── Performance
│   ├── hr_goals
│   ├── hr_kpis
│   ├── hr_kras
│   ├── hr_performance_cycles
│   ├── hr_performance_reviews
│   ├── hr_manager_reviews
│   ├── hr_self_reviews
│   └── hr_promotion_recommendations
│
├── Training
│   ├── hr_training_programs
│   ├── hr_training_sessions
│   ├── hr_training_participants
│   ├── hr_training_attendance
│   ├── hr_training_certificates
│   └── hr_training_evaluations
│
├── Assets
│   ├── hr_asset_categories
│   ├── hr_assets
│   ├── hr_asset_assignments
│   ├── hr_asset_returns
│   ├── hr_asset_damages
│   └── hr_asset_history
│
├── Documents
│   ├── hr_document_types
│   ├── hr_employee_documents
│   ├── hr_contracts
│   └── hr_compliance_documents
│
├── Travel & Expense
│   ├── hr_travel_requests
│   └── hr_expense_claims
│
├── Employee Self Service
│   ├── hr_ess_requests (generic)
│   ├── hr_announcements
│   └── (notifications → Core)
│
└── AI Read Models (derived)
    ├── hr_ai_attendance_insights
    ├── hr_ai_workforce_metrics
    ├── payroll_ai_cost_snapshots
    └── hr_ai_attrition_signals
```

**Core references (not owned):** `companies`, `branches`, `contacts`, `addresses`, `users`, `attachments`, `activities`, `permissions`, `roles`, `notifications`.

---

# Domain Specifications

Each domain defines: **entities**, **key fields**, **relationships**, **ownership**, **cascade**, **archive**.

---

## Organization Entities

### Core references (not HR tables)

| Entity | Core table | HR usage |
|--------|------------|----------|
| Companies | `companies` | Legal employer on all rows |
| Branches | `branches` | Operating unit, device zone |

### `hr_locations`

Work sites: office, factory, warehouse, client site, remote hub.

| Key field | Description |
|-----------|-------------|
| `code` | Short code |
| `name` | Display name |
| `branch_id` | Parent branch |
| `address_id` | → Core addresses (optional) |
| `timezone` | IANA timezone |
| `is_remote_hub` | WFH hub flag |
| `geo_fence_json` | Lat/long radius for mobile check-in |

### `hr_departments`

| Key field | Description |
|-----------|-------------|
| `parent_id` | Tree hierarchy |
| `manager_id` | → `hr_employees` |
| `cost_center_id` | → `hr_cost_centers` |
| `headcount_budget` | Optional cap |

### `hr_teams`

Optional sub-unit within department.

| Key field | Description |
|-----------|-------------|
| `department_id` | Parent dept |
| `lead_id` | → `hr_employees` |

### `hr_designations`

Job title catalog (e.g. Senior Engineer, HR Executive).

### `hr_job_positions`

Position slot: designation + grade + department.

| Key field | Description |
|-----------|-------------|
| `designation_id` | → `hr_designations` |
| `department_id` | Owning dept |
| `grade_id` | → `hr_grades` (optional) |
| `headcount` | Approved positions |

### `hr_employment_types`

Reference: `full_time`, `part_time`, `contract`, `intern`, `consultant`.

### `hr_employment_statuses`

Reference (or enum on employee): `draft`, `active`, `on_probation`, `on_leave`, `suspended`, `terminated`, `archived`.

### `hr_reporting_lines`

Matrix reporting support.

| Key field | Description |
|-----------|-------------|
| `employee_id` | Subordinate |
| `manager_id` | Manager |
| `reporting_type` | `primary`, `dotted`, `functional` |
| `effective_from` / `effective_to` | Versioned |

### `hr_cost_centers`

| Key field | Description |
|-----------|-------------|
| `code` | Accounting dimension code |
| `accounting_dimension_id` | UUID ref to Accounting (no FK) |

### Organization relationships

| Parent | Child | Cascade | Archive |
|--------|-------|---------|---------|
| `companies` | `hr_departments` | Restrict delete if employees exist | Soft delete dept |
| `hr_departments` | `hr_teams` | Soft delete teams with dept | Archive |
| `hr_departments` | `hr_employees` | Reassign before delete | Transfer employees |
| `hr_job_positions` | `hr_employees` | Position vacant on employee move | Keep history |

---

## Employee Domain

### `hr_employees` (master)

Central employment record.

| Key field | Description |
|-----------|-------------|
| `contact_id` | → Core `contacts` (required) |
| `user_id` | → Core `users` (optional ESS login) |
| `employee_number` | Unique per company |
| `department_id` | Current department |
| `job_position_id` | Current position |
| `designation_id` | Denormalized for query speed |
| `manager_id` | Primary reporting manager |
| `branch_id` | Primary work branch |
| `location_id` | Primary work location |
| `employment_type_id` | → `hr_employment_types` |
| `employment_status` | Lifecycle enum |
| `hire_date` | |
| `probation_end_date` | |
| `confirmation_date` | |
| `termination_date` | |
| `termination_reason` | |
| `cost_center_id` | Default allocation |
| `payroll_group_id` | Optional batch grouping |
| `row_version` | Optimistic lock |

**Indexes (planned):** `(tenant_id, company_id, employee_number)` UNIQUE · `(company_id, department_id, employment_status)` · `(manager_id)` · `(contact_id)`

### Employee sub-entities

| Table | Purpose | Parent |
|-------|---------|--------|
| `hr_employee_emergency_contacts` | ICE name, relation, phone | `hr_employees` |
| `hr_employee_education` | Degree, institution, year | `hr_employees` |
| `hr_employee_experience` | Prior employers (pre-hire) | `hr_employees` |
| `hr_employee_family` | Dependents, nominees | `hr_employees` |
| `hr_employee_skills` | Skill + proficiency | `hr_employees` |
| `hr_employee_certifications` | Cert name, issuer, expiry | `hr_employees` |
| `hr_employee_documents` | Doc type, attachment ref, expiry | `hr_employees` |
| `hr_employee_bank_accounts` | Bank, account (encrypted), primary flag | `hr_employees` |
| `hr_employee_custom_fields` | EAV: `field_key`, `value_json` | `hr_employees` |
| `hr_employee_history` | Org/status change log | `hr_employees` |
| `hr_employee_timeline` | Lifecycle events | `hr_employees` |

### Core-linked (not duplicated)

| Concern | Storage |
|---------|---------|
| Employee contact info | Core `contacts` + `addresses` |
| Employee notes | Core `notes` polymorphic |
| Employee tags | Core `tags` / tag pivot |
| Employee documents (files) | Core `attachments` via `hr_employee_documents.attachment_id` |

### `hr_employee_bank_accounts` (sensitive)

| Key field | Description |
|-----------|-------------|
| `account_number_enc` | Encrypted at rest |
| `routing_code` | IFSC/SWIFT |
| `is_primary` | Salary credit account |
| `verified_at` | Verification timestamp |

### Employee salary profile link

`hr_employees` does **not** store salary amounts. Current compensation:

```text
hr_employees
    └── payroll_employee_salaries (effective-dated, active row)
            └── payroll_salary_structures
```

### Employee relationships

| Parent | Child | Ownership | Cascade |
|--------|-------|-----------|---------|
| `contacts` | `hr_employees` | HR owns employment | Contact cannot delete if active employee |
| `hr_employees` | All `hr_employee_*` | HR | Soft delete children with employee |
| `hr_employees` | `payroll_employee_salaries` | Payroll | Terminate → close salary row |
| `hr_employees` | `hr_attendance`, `hr_leave_*` | HR | Archive on termination |

---

## Recruitment Domain

| Table | Purpose |
|-------|---------|
| `hr_job_requisitions` | Approved headcount request |
| `hr_candidates` | Applicant pipeline (pre-employee) |
| `hr_candidate_documents` | Resume, portfolio → attachments |
| `hr_interview_stages` | Pipeline stages per requisition |
| `hr_interview_feedback` | Interviewer scores, notes |
| `hr_offer_letters` | Offer terms, status, attachment |
| `hr_hiring_records` | Conversion audit: candidate → employee |

### `hr_job_requisitions`

| Key field | Description |
|-----------|-------------|
| `requisition_number` | `REQ-2026-0042` |
| `job_position_id` | Position to fill |
| `openings_count` | |
| `status` | `draft`, `approved`, `open`, `filled`, `cancelled` |
| `hiring_manager_id` | → `hr_employees` |

### `hr_candidates`

| Key field | Description |
|-----------|-------------|
| `contact_id` | Optional → contacts (created on apply) |
| `requisition_id` | |
| `stage_id` | Current pipeline stage |
| `source` | `website`, `referral`, `agency` |
| `status` | `applied`, `screening`, `interview`, `offered`, `hired`, `rejected` |

### `hr_hiring_records`

| Key field | Description |
|-----------|-------------|
| `candidate_id` | |
| `employee_id` | Set on hire |
| `hired_at` | |
| `offer_letter_id` | |

**Hire cascade:** `hr_candidates.status = hired` → create `hr_employees` → create `payroll_employee_salaries` (draft) → emit `hr.employee.hired`.

---

## Attendance Domain

### Device layer

| Table | Purpose |
|-------|---------|
| `hr_attendance_devices` | Device registry (ZKTeco, eSSL, API) |
| `hr_biometric_devices` | Extends device: modality fingerprint/face |
| `hr_device_sync_logs` | Sync job audit |

### `hr_attendance_devices`

| Key field | Description |
|-----------|-------------|
| `device_code` | Vendor device ID |
| `vendor` | `zkteco`, `essl`, `generic_api` |
| `branch_id` | / `location_id` |
| `connection_config_json` | IP, port, API key ref (secrets in vault) |
| `last_sync_at` | |
| `sync_schedule_cron` | |

### Punch and summary layer

| Table | Purpose |
|-------|---------|
| `hr_attendance_logs` | Raw in/out punches (immutable) |
| `hr_attendance` | Daily summary per employee |
| `hr_attendance_corrections` | Correction workflow |
| `hr_attendance_policies` | Company/branch policy |
| `hr_attendance_rules` | Late, grace, half-day rules |
| `hr_attendance_exceptions` | Flagged anomalies |
| `hr_wfh_records` | Approved WFH days |
| `hr_outdoor_duty_records` | Field duty approvals |

### `hr_attendance_logs`

| Key field | Description |
|-----------|-------------|
| `employee_id` | Resolved from device user map |
| `device_id` | Source device |
| `punch_time` | TIMESTAMPTZ |
| `punch_type` | `in`, `out`, `break_start`, `break_end` |
| `source` | `device`, `manual`, `api`, `mobile` |
| `raw_payload_json` | Vendor raw data |

### `hr_attendance` (daily summary)

| Key field | Description |
|-----------|-------------|
| `employee_id` | |
| `attendance_date` | DATE |
| `status` | `present`, `absent`, `late`, `half_day`, `leave`, `holiday`, `weekend`, `wfh`, `outdoor` |
| `shift_id` | → `hr_shift_definitions` |
| `check_in` / `check_out` | Computed from logs |
| `worked_minutes` | |
| `late_minutes` | |
| `overtime_minutes` | |
| `leave_request_id` | If status = leave |
| `is_locked` | Payroll period lock |

**Unique:** `(employee_id, attendance_date)`

### `hr_attendance_corrections`

| Key field | Description |
|-----------|-------------|
| `attendance_id` | |
| `requested_status` | |
| `reason` | |
| `approval_id` | → Core approvals |
| `original_snapshot_json` | Before state |
| `corrected_snapshot_json` | After state |

### Attendance relationships

| Parent | Child | Rule |
|--------|-------|------|
| `hr_attendance_devices` | `hr_attendance_logs` | Device offline buffer |
| `hr_employees` | `hr_attendance` | One row per day |
| `hr_attendance` | `hr_attendance_corrections` | Original never deleted |
| `hr_attendance` | Payroll input | Exported via `hr.attendance.finalized` event |

---

## Shift Domain

| Table | Purpose |
|-------|---------|
| `hr_shift_definitions` | Template: start, end, break, night flag |
| `hr_shift_assignments` | Employee ↔ shift for date range |
| `hr_shift_rotations` | Rotation pattern (A/B/C) |
| `hr_shift_calendars` | Calendar of working days |
| `hr_shift_rules` | Grace, late, OT linkage |
| `hr_shift_exceptions` | One-off overrides |

### `hr_shift_definitions`

| Key field | Description |
|-----------|-------------|
| `shift_type` | `general`, `night`, `rotational`, `flexible` |
| `start_time` / `end_time` | Local time |
| `crosses_midnight` | BOOLEAN |
| `flex_core_start` / `flex_core_end` | Flexible shift window |
| `break_minutes` | |

### `hr_shift_assignments`

| Key field | Description |
|-----------|-------------|
| `employee_id` | |
| `shift_id` | |
| `effective_from` / `effective_to` | |
| `auto_assigned` | Rotation engine flag |

---

## Leave Domain

| Table | Purpose |
|-------|---------|
| `hr_leave_types` | Annual, sick, casual, unpaid, etc. |
| `hr_leave_policies` | Accrual, carry-forward, encashment rules |
| `hr_leave_balances` | Balance per employee per type per year |
| `hr_leave_requests` | Application |
| `hr_leave_encashments` | Encashment on exit or window |
| `hr_leave_accrual_runs` | Batch accrual job log |
| `hr_holiday_calendars` | Public/company holidays |

### `hr_leave_types`

| Key field | Description |
|-----------|-------------|
| `code` | `ANNUAL`, `SICK` |
| `is_paid` | |
| `requires_approval` | |
| `allow_half_day` | |
| `max_balance` | |

### `hr_leave_policies`

| Key field | Description |
|-----------|-------------|
| `leave_type_id` | |
| `accrual_rate_monthly` | |
| `carry_forward_max` | |
| `carry_forward_expiry_months` | |
| `encashable` | |
| `probation_excluded` | |
| `version` | Policy version |
| `effective_from` | |

### `hr_leave_requests`

| Key field | Description |
|-----------|-------------|
| `employee_id` | |
| `leave_type_id` | |
| `start_date` / `end_date` | |
| `half_day_period` | `first_half`, `second_half`, null |
| `days_count` | DECIMAL |
| `status` | `draft`, `pending`, `approved`, `rejected`, `cancelled` |
| `approval_id` | → Core |
| `reason` | |

### `hr_leave_balances`

| Key field | Description |
|-----------|-------------|
| `employee_id` | |
| `leave_type_id` | |
| `year` | Fiscal or calendar |
| `opening_balance` | |
| `accrued` | |
| `taken` | |
| `adjusted` | |
| `closing_balance` | Computed |

---

## Payroll Domain

### Structure layer

| Table | Purpose |
|-------|---------|
| `payroll_salary_components` | Earning, deduction, employer contribution |
| `payroll_salary_structures` | Named bundle |
| `payroll_salary_structure_lines` | Component + formula/amount in structure |
| `payroll_employee_salaries` | Employee assignment (effective-dated) |
| `payroll_tax_rules` | Tax brackets by jurisdiction |
| `payroll_contribution_rules` | PF, ESI, social insurance |

### `payroll_salary_components`

| Key field | Description |
|-----------|-------------|
| `code` | `BASIC`, `HRA`, `TAX` |
| `component_type` | `earning`, `deduction`, `employer_contribution` |
| `calculation_type` | `fixed`, `percent_of_basic`, `formula` |
| `is_taxable` | |
| `gl_account_id` | UUID ref Accounting |

### Processing layer

| Table | Purpose |
|-------|---------|
| `payroll_periods` | Month/period with lock flag |
| `payroll_runs` | Batch header |
| `payroll_run_employees` | Employee in run |
| `payroll_payslips` | Individual payslip |
| `payroll_payslip_lines` | Component breakdown |
| `payroll_ytd_summaries` | YTD per component |

### `payroll_runs`

| Key field | Description |
|-----------|-------------|
| `run_number` | `PR-2026-06-001` |
| `period_id` | → `payroll_periods` |
| `period_start` / `period_end` | |
| `status` | `draft`, `calculated`, `review`, `approved`, `locked`, `posted` |
| `approval_id` | |
| `posted_at` | |
| `journal_entry_id` | UUID ref Accounting |
| `is_locked` | |

### Adjustments and extras

| Table | Purpose |
|-------|---------|
| `payroll_bonuses` | One-off or recurring bonus input |
| `payroll_commissions` | Sales commission input |
| `payroll_salary_revisions` | Revision audit (mirrors assignment changes) |
| `payroll_salary_arrears` | Back-pay lines |
| `payroll_adjustments` | Post-lock corrections |

### `payroll_payslips`

| Key field | Description |
|-----------|-------------|
| `employee_id` | |
| `run_id` | |
| `gross_earnings` | |
| `total_deductions` | |
| `net_pay` | |
| `payable_days` | From attendance |
| `status` | `draft`, `published`, `posted` |
| `document_hash` | Immutable PDF hash |
| `attachment_id` | → Core attachments |

**Immutable rule:** Once `status = posted`, lines are never UPDATE — only void via `payroll_adjustments`.

---

## Overtime Domain

| Table | Purpose |
|-------|---------|
| `hr_overtime_policies` | Rates, caps, approval rules |
| `hr_overtime_requests` | Employee/manager request |
| `hr_overtime_calculations` | Computed hours and amounts |

### `hr_overtime_requests`

| Key field | Description |
|-----------|-------------|
| `employee_id` | |
| `overtime_date` | |
| `hours` | DECIMAL |
| `status` | `pending`, `approved`, `rejected` |
| `approval_id` | |

### `hr_overtime_calculations`

| Key field | Description |
|-----------|-------------|
| `overtime_request_id` | |
| `rate_multiplier` | e.g. 1.5x, 2x |
| `amount` | Feeds payroll component |

---

## Loan & Advance Domain

| Table | Purpose |
|-------|---------|
| `payroll_loans` | Loan header |
| `payroll_loan_installments` | Scheduled EMI |
| `payroll_loan_payments` | Actual recovery per payslip |
| `payroll_salary_advances` | Advance header |
| `payroll_advance_recoveries` | Deduction per payslip |

### `payroll_loans`

| Key field | Description |
|-----------|-------------|
| `employee_id` | |
| `loan_number` | |
| `principal_amount` | |
| `interest_rate` | |
| `installment_count` | |
| `status` | `pending`, `active`, `closed`, `written_off` |
| `approval_id` | |
| `disbursement_date` | |

### `payroll_loan_installments`

| Key field | Description |
|-----------|-------------|
| `loan_id` | |
| `installment_number` | |
| `due_date` | |
| `principal` / `interest` | |
| `status` | `scheduled`, `paid`, `skipped` |
| `payslip_id` | When recovered |

---

## Performance Domain

| Table | Purpose |
|-------|---------|
| `hr_goals` | Employee/team goals (OKR) |
| `hr_kpis` | Metric definitions |
| `hr_kras` | Key responsibility areas by role |
| `hr_performance_cycles` | Appraisal period |
| `hr_performance_reviews` | Review header |
| `hr_self_reviews` | Employee self-assessment |
| `hr_manager_reviews` | Manager rating |
| `hr_promotion_recommendations` | Workflow output |

### `hr_performance_reviews`

| Key field | Description |
|-----------|-------------|
| `employee_id` | |
| `cycle_id` | |
| `overall_rating` | |
| `status` | `draft`, `self_review`, `manager_review`, `completed` |
| `completed_at` | |

### `hr_promotion_recommendations`

| Key field | Description |
|-----------|-------------|
| `review_id` | |
| `recommended_position_id` | |
| `recommended_grade_id` | |
| `status` | `pending`, `approved`, `rejected` |
| `salary_revision_id` | → `payroll_salary_revisions` on approve |

---

## Training Domain

| Table | Purpose |
|-------|---------|
| `hr_training_programs` | Course catalog |
| `hr_training_sessions` | Scheduled session |
| `hr_training_participants` | Enrollment |
| `hr_training_attendance` | Session attendance |
| `hr_training_certificates` | Issued certs |
| `hr_training_evaluations` | Feedback scores |

### `hr_training_programs`

| Key field | Description |
|-----------|-------------|
| `code` | |
| `duration_hours` | |
| `is_mandatory` | |
| `skill_ids` | JSON array of skill refs |

### `hr_training_certificates`

| Key field | Description |
|-----------|-------------|
| `participant_id` | |
| `issued_at` | |
| `expires_at` | |
| `attachment_id` | Certificate PDF |

---

## Asset Domain

| Table | Purpose |
|-------|---------|
| `hr_asset_categories` | Laptop, phone, uniform, vehicle |
| `hr_assets` | Asset inventory |
| `hr_asset_assignments` | Custody to employee |
| `hr_asset_returns` | Return record |
| `hr_asset_damages` | Damage chargeback |
| `hr_asset_history` | Full custody chain |

### `hr_assets`

| Key field | Description |
|-----------|-------------|
| `asset_tag` | `AST-0042` |
| `category_id` | |
| `serial_number` | |
| `inventory_asset_id` | UUID ref Inventory (optional) |
| `status` | `available`, `assigned`, `maintenance`, `retired` |

### `hr_asset_assignments`

| Key field | Description |
|-----------|-------------|
| `asset_id` | |
| `employee_id` | |
| `assigned_at` | |
| `expected_return_at` | |
| `condition_on_assign` | |
| `status` | `active`, `returned` |

---

## Document Management Domain

| Table | Purpose |
|-------|---------|
| `hr_document_types` | Passport, NID, contract, visa |
| `hr_employee_documents` | Employee ↔ doc type ↔ attachment |
| `hr_contracts` | Employment contract terms |
| `hr_compliance_documents` | Statutory filings metadata |

### `hr_employee_documents`

| Key field | Description |
|-----------|-------------|
| `document_type_id` | |
| `attachment_id` | → Core |
| `issue_date` / `expiry_date` | |
| `version` | |
| `is_verified` | |

### Expiry tracking

Scheduled job queries `expiry_date` → Core Notification Engine → `hr.document.expiring` event.

---

## Travel & Expense Domain

| Table | Purpose |
|-------|---------|
| `hr_travel_requests` | Travel authorization |
| `hr_expense_claims` | Expense reimbursement |

### `hr_expense_claims`

| Key field | Description |
|-----------|-------------|
| `employee_id` | |
| `claim_number` | |
| `total_amount` | |
| `currency_code` | |
| `status` | `draft`, `submitted`, `approved`, `rejected`, `paid` |
| `approval_id` | |
| `accounting_payment_id` | UUID ref Accounting (on pay) |

---

## Employee Self Service Domain

| Table | Purpose |
|-------|---------|
| `hr_ess_requests` | Generic ESS request queue |
| `hr_announcements` | Company/branch announcements |

### `hr_ess_requests`

Polymorphic request router for ESS UX.

| Key field | Description |
|-----------|-------------|
| `employee_id` | |
| `request_type` | `profile_update`, `attendance_correction`, `document_upload`, `general` |
| `target_entity_type` | Optional link |
| `target_entity_id` | |
| `payload_json` | |
| `status` | `submitted`, `in_review`, `completed`, `rejected` |

**Note:** Leave, OT, travel, expense use their own tables; ESS reads via `ess.*` permissions scoped to `employee_id = session.employee`.

### `hr_announcements`

| Key field | Description |
|-----------|-------------|
| `title` | |
| `body` | |
| `scope` | `company`, `branch`, `department` |
| `scope_id` | |
| `published_at` | |
| `expires_at` | |

Notifications delivered via Core Notification Engine — no duplicate `hr_notifications` table.

---

## Activity Log Domain

HR does **not** create parallel activity tables. All timeline data flows to Core Activity Engine.

### Registration matrix

| Entity type | Mandatory activities |
|-------------|---------------------|
| `hr_employee` | create, update, transferred, promoted, terminated, salary_changed |
| `hr_attendance` | created, attendance_changed, approved, rejected |
| `hr_leave_request` | created, approved, rejected, cancelled, leave_changed |
| `payroll_run` | created, calculated, approved, payroll_locked, payroll_posted |
| `payroll_payslip` | published, downloaded |
| `hr_asset_assignment` | asset_assigned, asset_returned |
| `hr_candidate` | created, stage_changed, hired, rejected |

### Field-level audit

Critical fields on `hr_employees` and `payroll_employee_salaries` emit `activity_logs` with `field_changes[]` payload per [ACTIVITY_CHATTER_ARCHITECTURE.md](../core/ACTIVITY_CHATTER_ARCHITECTURE.md).

### HR append-only supplements

| Table | When used |
|-------|-----------|
| `hr_employee_history` | Compliance export, org chart history |
| `hr_attendance_corrections` | Legal evidence of attendance change |
| `payroll_salary_revisions` | Compensation audit |

---

## Permission Domain

Per [PERMISSION_SYSTEM_ARCHITECTURE.md](../../core/PERMISSION_SYSTEM_ARCHITECTURE.md) — **permissions are Core-owned**, not HR tables.

### HR does NOT create

- `hr_roles` — use Core `roles`
- `hr_permissions` — use Core `permissions`

### HR registers permission keys

| Namespace | Examples |
|-----------|----------|
| `hr.*` | `hr.employee.view`, `hr.employee.create`, `hr.attendance.correct`, `hr.leave.approve` |
| `payroll.*` | `payroll.run.create`, `payroll.run.approve`, `payroll.run.post`, `payroll.structure.manage` |
| `ess.*` | `ess.profile.view`, `ess.leave.apply`, `ess.payslip.download` |

### HR-specific data access (Core `record_rules`)

| Rule code | Filter |
|-----------|--------|
| `hr.employee.self` | `employee_id = session.employee_id` |
| `hr.employee.department` | `department_id IN manager_subtree` |
| `hr.employee.branch` | `branch_id IN allowed_branches` |
| `hr.employee.company` | `company_id = session.company_id` |
| `payroll.payslip.self` | Employee sees own payslips only |

### Approval rules (Core Approval Engine)

Linked via `approval_id` on: `hr_leave_requests`, `hr_attendance_corrections`, `hr_overtime_requests`, `payroll_runs`, `payroll_loans`, `hr_travel_requests`, `hr_expense_claims`.

---

## Notification Domain

Delivered via Core Notification Engine — HR defines **templates** and **triggers**, not delivery tables.

| Channel | HR use cases |
|---------|--------------|
| Email | Payslip published, offer letter, leave approved |
| SMS | Attendance alert, OTP for ESS (future) |
| In-app | Approval pending, document expiry |
| Approval | Routed through Approval Engine |

### HR notification trigger events

`hr.leave.approved` · `hr.leave.rejected` · `payroll.payslip.published` · `hr.document.expiring` · `hr.attendance.exception` · `hr.announcement.published`

### Optional HR config table

| Table | Purpose |
|-------|---------|
| `hr_notification_preferences` | Per-employee channel opt-in |
| `hr_notification_templates` | Module template overrides (maps to Core templates) |

---

## AI Ready Database Design

AI OS reads via **Service APIs** and **derived read models** — never direct OLTP writes.

### Source entities for AI features

| AI feature | Primary entities | Read model (derived) |
|------------|------------------|----------------------|
| **AI HR Assistant** | `hr_employees`, `hr_departments`, `hr_attendance`, `hr_leave_requests` | `hr_ai_workforce_metrics` |
| **Attendance analytics** | `hr_attendance`, `hr_attendance_logs`, `hr_shift_assignments` | `hr_ai_attendance_insights` |
| **Payroll analytics** | `payroll_payslips`, `payroll_payslip_lines`, `payroll_runs` | `payroll_ai_cost_snapshots` |
| **Performance analytics** | `hr_performance_reviews`, `hr_goals`, `hr_kpis` | `hr_ai_performance_summaries` |
| **Employee insights** | `hr_employee_history`, `hr_training_certifications`, `hr_employee_skills` | `hr_ai_employee_360` |
| **Attrition prediction** | `hr_employees`, `hr_attendance`, `hr_leave_requests`, `hr_performance_reviews` | `hr_ai_attrition_signals` |
| **Promotion recommendation** | `hr_performance_reviews`, `hr_promotion_recommendations`, `hr_goals` | `hr_ai_succession_candidates` |

### `hr_ai_attrition_signals` (derived, append-only)

| Key field | Description |
|-----------|-------------|
| `employee_id` | |
| `risk_score` | 0–100 |
| `signal_factors_json` | Absence pattern, rating drop, etc. |
| `computed_at` | |
| `model_version` | AI model semver |

### AI design rules

| Rule | Implementation |
|------|----------------|
| No AI tables in write path | Workers populate read models async |
| PII minimization | Signals use IDs; names resolved at API layer |
| Explainability | `signal_factors_json` documents inputs |
| Human in the loop | Recommendations link to `approval_id` when acted upon |
| Audit | All AI actions in `activity_ai_actions` |

---

# Relationship Reference

Consolidated parent/child, dependency, ownership, cascade, and archive rules per domain.

## Organization

| | |
|--|--|
| **Parents** | Core `companies`, `branches` |
| **Children** | `hr_locations` → `hr_departments` → `hr_teams`; `hr_job_positions`, `hr_cost_centers` |
| **Dependencies** | None (foundational) |
| **Ownership** | HR owns all `hr_*` org tables |
| **Cascade** | Cannot delete department with active employees |
| **Archive** | Soft delete; history in `hr_employee_history` |

## Employee

| | |
|--|--|
| **Parents** | Core `contacts`, org entities |
| **Children** | All `hr_employee_*`, `hr_attendance`, `hr_leave_*`, assignments |
| **Dependencies** | Organization, Core contacts |
| **Ownership** | HR owns `hr_employees` and extensions; Payroll owns salary tables |
| **Cascade** | Terminate employee → close leave balance, asset return workflow |
| **Archive** | `employment_status = archived`; soft delete after retention period |

## Recruitment

| | |
|--|--|
| **Parents** | `hr_job_positions`, `hr_job_requisitions` |
| **Children** | `hr_candidates` → interviews → offers → `hr_hiring_records` |
| **Dependencies** | Organization |
| **Ownership** | HR |
| **Cascade** | Hire creates `hr_employees`; candidate linked, not deleted |
| **Archive** | Rejected candidates soft-deleted per retention policy |

## Attendance

| | |
|--|--|
| **Parents** | `hr_employees`, `hr_attendance_devices`, `hr_shift_definitions` |
| **Children** | `hr_attendance_logs` → `hr_attendance` → corrections |
| **Dependencies** | Shifts, leave (for status), holidays |
| **Ownership** | HR |
| **Cascade** | Logs immutable; corrections never delete summary |
| **Archive** | Logs → cold storage after retention; summaries kept |

## Shift

| | |
|--|--|
| **Parents** | `hr_shift_definitions` |
| **Children** | assignments, rotations, calendars, rules, exceptions |
| **Dependencies** | Organization (branch/location) |
| **Ownership** | HR |
| **Cascade** | End assignment → fall back to default shift |
| **Archive** | Soft delete definitions not used in active assignments |

## Leave

| | |
|--|--|
| **Parents** | `hr_leave_types`, `hr_leave_policies` |
| **Children** | balances, requests, encashments, accrual runs |
| **Dependencies** | Employee, holiday calendar |
| **Ownership** | HR |
| **Cascade** | Approved leave → update balance → set attendance status |
| **Archive** | Requests kept permanently; balances year-scoped |

## Payroll

| | |
|--|--|
| **Parents** | `payroll_salary_components`, structures, tax rules |
| **Children** | runs → run_employees → payslips → lines |
| **Dependencies** | HR employees, attendance, leave, OT, loans |
| **Ownership** | Payroll |
| **Cascade** | Run calculate → generate payslips; post → Accounting event |
| **Archive** | Posted runs immutable; 7+ year retention |

## Overtime

| | |
|--|--|
| **Parents** | `hr_overtime_policies` |
| **Children** | requests → calculations |
| **Dependencies** | Attendance, shifts |
| **Ownership** | HR (requests); Payroll (amounts) |
| **Cascade** | Approved OT → input to payroll run |
| **Archive** | Keep for audit |

## Loan & Advance

| | |
|--|--|
| **Parents** | `payroll_loans`, `payroll_salary_advances` |
| **Children** | installments, payments, recoveries |
| **Dependencies** | Employee, payroll runs |
| **Ownership** | Payroll |
| **Cascade** | Active loan → auto deduction on payslip |
| **Archive** | Closed loans kept permanently |

## Performance

| | |
|--|--|
| **Parents** | `hr_performance_cycles` |
| **Children** | goals, KPIs, reviews, promotion recommendations |
| **Dependencies** | Employee, org |
| **Ownership** | HR |
| **Cascade** | Completed review → optional salary revision event |
| **Archive** | Reviews kept for succession history |

## Training

| | |
|--|--|
| **Parents** | `hr_training_programs` |
| **Children** | sessions → participants → attendance → certificates |
| **Dependencies** | Employee, skills |
| **Ownership** | HR |
| **Cascade** | Completion → update skills/certifications |
| **Archive** | Certificates kept; expired flagged |

## Assets

| | |
|--|--|
| **Parents** | `hr_asset_categories`, `hr_assets` |
| **Children** | assignments → returns → damages → history |
| **Dependencies** | Employee; optional Inventory |
| **Ownership** | HR |
| **Cascade** | Employee exit → open return workflow |
| **Archive** | Retired assets soft-deleted |

## Documents

| | |
|--|--|
| **Parents** | `hr_document_types` |
| **Children** | employee documents, contracts, compliance docs |
| **Dependencies** | Core attachments |
| **Ownership** | HR metadata; Core owns files |
| **Cascade** | Delete attachment → mark document inactive |
| **Archive** | Expired docs flagged, not deleted |

## ESS

| | |
|--|--|
| **Parents** | `hr_employees` (session context) |
| **Children** | `hr_ess_requests`, `hr_announcements` |
| **Dependencies** | All request domains |
| **Ownership** | HR |
| **Cascade** | Request routes to target entity workflow |
| **Archive** | Completed requests retained 1 year (configurable) |

---

## Cross-Module References (UUID only)

| Consumer | Column | Points to | Access |
|----------|--------|-----------|--------|
| `payroll_payslips` | `employee_id` | `hr_employees.id` | Payroll Service |
| `payroll_payslip_lines` | `gl_account_id` | Accounting account UUID | Event on post |
| `hr_assets` | `inventory_asset_id` | Inventory asset UUID | Asset Service |
| `hr_expense_claims` | `accounting_payment_id` | Accounting payment UUID | Expense Service |
| `hr_employees` | `contact_id` | `contacts.id` | HR Service |
| `hr_employees` | `user_id` | `users.id` | Core User Service |

**Forbidden:** `JOIN payroll_payslips` from HR repositories; `JOIN hr_attendance` from Accounting.

---

## Index Strategy (planning)

| Pattern | Tables |
|---------|--------|
| Tenant + company + status | All masters |
| Employee + date UNIQUE | `hr_attendance`, `hr_leave_requests` (partial) |
| Effective date DESC | `payroll_employee_salaries`, `hr_shift_assignments` |
| Device + punch time | `hr_attendance_logs` |
| Period + status | `payroll_runs` |
| Expiry date | `hr_employee_documents`, `hr_training_certificates` |
| Full-text (future) | `hr_candidates`, `hr_employees` via search index |

---

## Partition Strategy (future scale)

| Table | Partition key |
|-------|---------------|
| `hr_attendance_logs` | `punch_time` monthly |
| `activity_logs` (Core) | `created_at` monthly |
| `payroll_payslips` | `period_start` yearly |

---

## Child Documentation Roadmap

| Document | Depends on this blueprint |
|----------|---------------------------|
| `Workflow.md` | State machines per entity |
| `API.md` | Resource ↔ table mapping |
| `Permissions.md` | Full `hr.*` / `payroll.*` matrix |
| `INTEGRATION.md` | Event payloads with entity IDs |
| `AI.md` | Read model refresh cadence |
| ER Diagram (tooling) | Visual from this spec |

**Pre-code gate:** Status **Ready** per [GOVERNANCE.md](../../GOVERNANCE.md) before migrations.

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
| **Supersedes** | Partial table lists in [../hr/Architecture.md](../hr/Architecture.md) and [../payroll/Architecture.md](../payroll/Architecture.md) for breadth |

---

**AgainERP HR & Payroll Database Architecture** — enterprise blueprint for workforce data. Schema plan only. No SQL. No migrations. No code.
