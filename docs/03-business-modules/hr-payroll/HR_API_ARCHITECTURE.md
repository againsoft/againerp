# HR & Payroll — API Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll (unified enterprise suite)  
> **Document Type:** API Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md) · [HR_DATABASE_ARCHITECTURE.md](./HR_DATABASE_ARCHITECTURE.md) · [HR_DATABASE_ERD_PLANNING.md](./HR_DATABASE_ERD_PLANNING.md) · [HR_WORKFLOW_ARCHITECTURE.md](./HR_WORKFLOW_ARCHITECTURE.md) · [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md)  
> **Governance:** [API_REGISTRY.md](../../00-foundation/registries/API_REGISTRY.md) · [api/architecture.md](../../05-development/api/architecture.md) · [core/API.md](../../02-core-platform/API.md) · [SAAS_PLATFORM_ARCHITECTURE.md](../../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md) · [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) · [APPROVAL_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) · [NOTIFICATION_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md)

## Purpose
HR & Payroll module architecture — scope, features, data ownership, and integration boundaries.

## When To Read
Read this file only if working on HR & Payroll architecture, features, or module boundaries.

## Related Files
- [Dependencies](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next
- [Architecture](HR_PAYROLL_MASTER_ARCHITECTURE.md)

---

**No application code. No OpenAPI specs. No controller implementation.**  
Defines **complete API architecture** for AgainERP HR & Payroll — layers, domains, auth, authorization, events, webhooks, integrations, mobile, AI, security, and monitoring. Foundation for backend, frontend, mobile, AI assistant, integration framework, and marketplace apps.

---

## Executive Summary

| Principle | Rule |
|-----------|------|
| **API-first** | Web, mobile, AI, devices, partners share one HTTP surface |
| **Three namespaces** | `hr` · `payroll` · `ess` under `/api/v1/` |
| **Core engines** | Approval, Notification, Activity, Workflow — platform APIs |
| **Thin controllers** | Validate → Authorize → Service → Envelope → Event |
| **UUID externally** | Public IDs are UUID — never internal serial PK |
| **Company scoped** | Every request validates `tenant_id` + `company_id` |
| **AI via services** | AI OS calls HR Service APIs — never direct DB |
| **Module-off safe** | HR disabled → `404` / graceful hide — no crash |

```text
Clients (Web · Mobile · Biometric · Partner · AI)
        │
        ▼
API Gateway / Router
        │
        ├── /api/v1/hr/*          Workforce & time
        ├── /api/v1/payroll/*     Compensation
        ├── /api/v1/ess/*         Employee self-service
        ├── /api/v1/core/*        Auth, approval, notification, activity
        └── /api/v1/ai/os/*       AI tools (HR domain tools registered)
        │
        ▼
Application Services → Domain Services → Integration / Analytics / AI layers
        │
        ▼
Event Bus (post-commit) → Notification · Analytics · Webhooks · Accounting
```

**Registry alignment:** This document is the HR & Payroll profile for [API_REGISTRY.md](../../00-foundation/registries/API_REGISTRY.md). Concrete route tables ship in module `API.md` at implementation gate.

---

# API Philosophy

### Core belief

> **The API is the product contract — UI is one consumer among many.**

| Consumer | API usage |
|----------|-----------|
| **Web admin** | Full CRUD + dashboards + reports |
| **Mobile apps** | ESS + manager approvals + lightweight lists |
| **Biometric connectors** | Device-authenticated sync endpoints |
| **AI OS** | Governed tools → same service layer |
| **Partners / marketplace** | Scoped public/partner APIs |
| **Accounting / CRM** | Event subscribers + integration APIs |

### Bounded context map

| API prefix | Owns | Does not own |
|------------|------|--------------|
| `/api/v1/hr/` | Employees, org, time, talent, assets | Payslip calculation, GL posting |
| `/api/v1/payroll/` | Structures, runs, payslips, loans | Attendance mutation |
| `/api/v1/ess/` | Self-scoped read/write channel | HR admin operations |
| `/api/v1/core/` | Auth, approval, activity, media | HR business rules |

### Resource-oriented design

| Concept | HR example |
|---------|------------|
| **Resource** | Employee, Leave Request, Payroll Run |
| **Collection** | `GET /employees` |
| **Member** | `GET /employees/{id}` |
| **Sub-resource** | `GET /employees/{id}/documents` |
| **Action** | `POST /payroll/runs/{id}/lock` |

---

# API Design Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **Thin controllers** | HTTP layer only — logic in services |
| 2 | **Service ownership** | HR Service writes `hr_*`; Payroll Service writes `payroll_*` |
| 3 | **Consistent envelope** | `{ data, meta, links, errors }` per [API_REGISTRY](../../00-foundation/registries/API_REGISTRY.md) |
| 4 | **Permission every call** | No anonymous business mutations |
| 5 | **Idempotent writes** | `Idempotency-Key` on payroll lock, payslip publish, device sync |
| 6 | **Async side effects** | Notifications, analytics, webhooks post-commit via events |
| 7 | **Field filtering** | Response DTOs respect field permissions (`hr.sensitive.view`) |
| 8 | **Pagination standard** | `?page=&limit=` or cursor for large directories |
| 9 | **Include expansion** | `?include=contact,department,manager` — bounded depth |
| 10 | **Errors** | RFC 7807 `application/problem+json` |
| 11 | **Optimistic lock** | `If-Match` / `row_version` on Employee, Payroll Run |
| 12 | **No cross-DB** | Cross-module via service call or event — not SQL join in API |

### Standard request headers

| Header | Required | Purpose |
|--------|----------|---------|
| `Authorization` | Yes* | Bearer JWT or session |
| `X-Company-Id` | Yes** | Active company scope |
| `X-Tenant-Id` | Platform only | SaaS tenant (usually from JWT) |
| `Accept-Language` | No | i18n for messages |
| `Idempotency-Key` | Mutations | Retry-safe operations |
| `X-Request-Id` | Recommended | Trace correlation |

\* Device sync uses device token auth.  
\** Embedded in JWT for mobile; header for multi-company users.

---

# API First Strategy

```text
1. Architecture doc (this document)
2. Service contracts (internal interfaces)
3. Module API.md (route catalog at implementation gate)
4. OpenAPI generation (from implementation — not planning)
5. Client SDKs / mobile contracts
```

| Phase | Deliverable |
|-------|-------------|
| **Planning** | API groups, resources, operations, permissions, events |
| **Implementation** | Controllers, DTOs, validation schemas |
| **Integration** | Webhooks, partner scopes, device auth |

**Rule:** Frontend and mobile prototypes may stub routes — names must match this architecture.

---

# Multi Tenant Strategy

Per [SAAS_PLATFORM_ARCHITECTURE.md](../../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md):

```text
Platform JWT  →  platform APIs (tenant admin)
Tenant JWT    →  tenant_id claim → all HR/Payroll APIs
                     └── company_id claim or X-Company-Id
```

| Layer | Isolation |
|-------|-----------|
| **Tenant** | All queries filter `tenant_id` |
| **Company** | All business APIs require `company_id` |
| **Plan features** | `hr` / `payroll` module flags gate route registration |
| **AI credits** | AI HR tools metered per tenant |

**SaaS provisioning:** Tenant signup → default company → HR module optional per plan → seed reference data via admin API.

---

# Authentication Strategy

| Method | Use case | API surface |
|--------|----------|-------------|
| **Session authentication** | Web admin (cookie + CSRF) | `/api/v1/core/auth/*` |
| **JWT authentication** | Mobile, SPA, API clients | Bearer token |
| **OAuth 2.0** | Third-party apps, SSO partners | `/api/v1/core/auth/oauth/*` |
| **SSO (SAML/OIDC)** | Enterprise IdP | Core auth federation |
| **API keys** | Server-to-server integrations | `/api/v1/core/api-keys` scoped |
| **Service accounts** | Connectors, scheduled jobs | Machine JWT + narrow scopes |
| **Device tokens** | ZKTeco, eSSL, biometric push | `/api/v1/hr/attendance/sync` |
| **AI agent authentication** | AI OS acting as user | User JWT inheritance + `ai.access` |

### Auth flow (standard)

```text
POST /api/v1/core/auth/login
  → JWT { tenant_id, user_id, companies[], permissions[] }
  → Client sets X-Company-Id
  → Subsequent HR/Payroll calls authorized
```

### ESS auth

Employee linked via `hr_employees.user_id` → ESS routes enforce `employee_id = session.employee`.

---

# Authorization Strategy

Per [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md) and [PERMISSION_SYSTEM_ARCHITECTURE.md](../../02-core-platform/PERMISSION_SYSTEM_ARCHITECTURE.md).

| Layer | Mechanism |
|-------|-----------|
| **Role based** | User → Roles → Permission keys union |
| **Permission based** | `hr.*`, `payroll.*`, `ess.*` per operation |
| **Company based** | `company_id` match on every row |
| **Branch based** | Record rules: `branch_id IN (...)` |
| **Department based** | `department_subtree` for managers |
| **Record level** | Core `record_rules` + resource ACL |
| **Field level** | `hr.sensitive.view` masks salary, bank, tax IDs |
| **Approval rights** | Approver must hold permission + be in chain |

### Authorization pipeline

```text
Request → Authenticate → Resolve company → Load permissions
       → Check operation permission key
       → Apply record rules (scope filter)
       → Apply field permissions (response filter)
       → Execute service
```

### ESS scope rule

All `/api/v1/ess/*` operations auto-inject `employee_id = session.employee_id` — cannot override via query param.

---

# Versioning Strategy

| Version | Status | Path |
|---------|--------|------|
| **v1** | Current planning target | `/api/v1/hr/`, `/api/v1/payroll/`, `/api/v1/ess/` |
| **v2** | Future | `/api/v2/...` when breaking changes required |

### Versioning rules

| Rule | Detail |
|------|--------|
| **URL versioning** | Major version in path |
| **Additive changes** | Same v1 — new optional fields |
| **Breaking changes** | New major version + 12-month deprecation |
| **Deprecation header** | `Sunset`, `Deprecation` on old routes |
| **Mobile pin** | Mobile apps declare `min_api_version` |

---

# Event Driven Strategy

```text
API mutation → Service → DB COMMIT → Event Bus publish → Subscribers
```

| Subscriber | Examples |
|------------|------------|
| Notification Engine | `hr.leave.approved` → approver + employee |
| Analytics worker | `payroll.run.locked` → refresh aggregates |
| Accounting | `payroll.run.posted` → journal entry |
| Webhook dispatcher | `hr.employee.hired` → partner URL |
| Search index | `hr.employee.updated` → global search |
| AI batch jobs | Nightly attrition scoring |

**Rule:** Events emitted **after** successful commit — never in request thread for heavy work.

---

# API Architecture Layers

```text
┌─────────────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER                                               │
│ REST controllers · ESS controllers · Device controllers ·       │
│ Webhook receivers · (future) GraphQL resolvers                   │
├─────────────────────────────────────────────────────────────────┤
│ APPLICATION LAYER                                                │
│ Use cases: HireEmployee, ApproveLeave, CalculatePayroll, LockRun │
│ Orchestrates domain + core engines + events                      │
├─────────────────────────────────────────────────────────────────┤
│ DOMAIN LAYER                                                     │
│ HR domains: Employee, Attendance, Leave, Recruitment, …          │
│ Payroll domains: Structure, Run, Payslip, Loan, Tax            │
│ Business rules, validations, state guards                        │
├─────────────────────────────────────────────────────────────────┤
│ SERVICE LAYER (module services — cross-API reusable)           │
│ HrEmployeeService · PayrollRunService · AttendanceSyncService  │
├─────────────────────────────────────────────────────────────────┤
│ INTEGRATION LAYER                                                │
│ Biometric connectors · Accounting bridge · CRM sync · Webhooks │
├─────────────────────────────────────────────────────────────────┤
│ ANALYTICS LAYER                                                  │
│ KPI API · Dashboard API · Report API · Aggregate refresh         │
├─────────────────────────────────────────────────────────────────┤
│ AI LAYER                                                         │
│ AI OS tools → call Service Layer only · HR insight read APIs     │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
   Repository (data access — owner module tables only)
```

| Layer | Responsibility | HR example |
|-------|----------------|--------------|
| **Presentation** | HTTP, auth extract, DTO mapping | `EmployeesController` |
| **Application** | Workflow orchestration, transactions | `HireEmployeeUseCase` |
| **Domain** | Invariants, calculations | Leave balance deduction |
| **Service** | Reusable module API | `PayrollCalculationService` |
| **Integration** | External systems | ZKTeco push handler |
| **Analytics** | Read models | `GET /hr/dashboard/kpis` |
| **AI** | Tool registration | `ai.tool.hr.attrition_insights` |

---

# API Types

| Type | Prefix / pattern | Audience | Auth |
|------|------------------|----------|------|
| **REST APIs** | `/api/v1/{module}/` | Web, mobile, AI | JWT / session |
| **Internal APIs** | Service-to-service in-process | Same monolith | Internal |
| **Public APIs** | `/api/v1/public/hr/` (future) | Job board, careers page | API key / anonymous read |
| **Partner APIs** | `/api/v1/partners/hr/` (future) | Marketplace, payroll bureau | OAuth + scoped |
| **Webhook APIs** | Inbound: `/api/v1/webhooks/inbound/hr/` | Biometric, HRIS | HMAC signature |
| **Webhook outbound** | Configured URLs | Customer systems | Signed payloads |
| **AI APIs** | `/api/v1/ai/os/tools/hr/*` | AI OS | User JWT + `ai.access` |
| **Mobile APIs** | `/api/v1/ess/`, `/api/v1/hr/mobile/` | Native apps | JWT + refresh |
| **GraphQL** (future) | `/api/graphql` | Executive dashboards | JWT — read-heavy |

---

# Authentication Architecture (detail)

| Auth type | HR/Payroll usage | Token lifetime |
|-----------|------------------|----------------|
| Session | Web admin HR screens | Sliding session |
| JWT access | API clients | 15–60 min |
| JWT refresh | Mobile ESS | 7–30 days |
| OAuth | Partner payroll export | Per integration |
| API key | Nightly attendance pull | Long-lived, rotatable |
| Device token | Per `hr_attendance_devices` | Rotatable, IP-optional |
| Service account | Accrual job, analytics ETL | Machine credential |
| AI agent | Copilot actions | Inherits user session |

### Sensitive operations — step-up auth

| Operation | Extra gate |
|-----------|------------|
| Payroll lock | Re-auth or MFA |
| Bank export | MFA + `payroll.bank_export` |
| Salary revision bulk | MFA |
| Employee terminate | Optional MFA by policy |
| API key create | Admin MFA |

---

# Authorization Architecture (detail)

### Permission key patterns

```text
hr.{resource}.{action}
payroll.{resource}.{action}
ess.{resource}.{action}
```

### Scope resolution order

```text
1. tenant_id (from JWT)
2. company_id (header/claim)
3. operation permission
4. record_rules (branch, department, self)
5. field_permissions (response)
6. approval authority (for approve actions)
```

### Representative permission map

| Operation class | Example key |
|-----------------|-------------|
| Module access | `hr.access`, `payroll.access`, `ess.access` |
| CRUD | `hr.employee.create`, `hr.employee.edit`, `hr.employee.view` |
| Approve | `hr.leave.approve`, `payroll.run.approve` |
| Sensitive | `hr.sensitive.view`, `payroll.bank_export` |
| Admin | `hr.settings.manage`, `payroll.tax.manage` |
| Export | `hr.report.export`, `payroll.report.export` |

---

# Employee API Domain

**API group:** `hr` · **Resources:** Employee and children

| Resource | Operations | Permission (representative) | Events |
|----------|------------|----------------------------|--------|
| **Employee** | list, get, create, update, archive, terminate, transfer, promote | `hr.employee.*` | `hr.employee.hired`, `.updated`, `.transferred`, `.promoted`, `.terminated`, `.archived` |
| **Employee profile** | get, patch (scoped fields) | `hr.employee.view`, `hr.employee.edit` | `hr.employee.updated` |
| **Emergency contacts** | list, create, update, delete | `hr.employee.edit` | — |
| **Family / education / experience** | CRUD sub-resources | `hr.employee.edit` | — |
| **Skills / certifications** | CRUD | `hr.employee.edit` | — |
| **Bank accounts** | list, create, verify, set-primary | `hr.sensitive.view`, `payroll.bank.manage` | `hr.employee.bank_changed` |
| **Documents** | list, upload, verify, archive | `hr.document.*` | `hr.document.uploaded`, `.expiring` |
| **Salary profile** | get, assign structure (delegates payroll) | `hr.sensitive.view`, `payroll.salary_revision.manage` | `payroll.structure.changed` |
| **Assets** | list assigned | `hr.asset.create` | — |
| **Timeline** | list milestones | `hr.employee.view` | — |
| **Notes** | via Core `/api/v1/core/notes` | `hr.employee.view` | Core events |
| **Tags** | via Core `/api/v1/core/tags` | `hr.employee.edit` | Core events |
| **Custom fields** | get, upsert | `hr.employee.edit` | — |
| **Activity** | via Core `/api/v1/core/activities` | `hr.employee.view` | — |

### Architectural paths (conceptual)

```text
GET    /api/v1/hr/employees
POST   /api/v1/hr/employees
GET    /api/v1/hr/employees/{id}
PATCH  /api/v1/hr/employees/{id}
POST   /api/v1/hr/employees/{id}/transfer
POST   /api/v1/hr/employees/{id}/terminate
GET    /api/v1/hr/employees/{id}/timeline
GET    /api/v1/hr/employees/{id}/documents
POST   /api/v1/hr/employees/{id}/documents
GET    /api/v1/hr/employees/{id}/salary-profile
```

### Include graph

`?include=contact,department,manager,job_position,branch`

---

# Recruitment API Domain

| Resource | Operations | Permission | Events |
|----------|------------|------------|--------|
| **Job requisitions** | list, get, create, update, submit, approve, cancel | `hr.requisition.manage`, `hr.hiring.approve` | `hr.requisition.created`, `.approved` |
| **Job positions** | list, get, create, update | `hr.job_position.manage` | — |
| **Candidates** | list, get, create, update, stage-move, reject | `hr.candidate.manage` | `hr.candidate.applied`, `.created`, `.rejected` |
| **Candidate documents** | upload, list | `hr.candidate.manage` | — |
| **Interviews** | schedule, list, get, feedback | `hr.interview.edit` | `hr.interview.scheduled`, `.feedback_due` |
| **Offer letters** | create, send, accept, decline | `hr.offer.manage` | `hr.offer.sent`, `.accepted` |
| **Hiring** | hire (wizard action) | `hr.hiring.approve` | `hr.employee.hired` |
| **Employee conversion** | `POST /candidates/{id}/convert` | `hr.hiring.approve` | `hr.employee.hired` |

```text
/api/v1/hr/recruitment/requisitions
/api/v1/hr/recruitment/candidates
/api/v1/hr/recruitment/candidates/{id}/interviews
/api/v1/hr/recruitment/candidates/{id}/offer
/api/v1/hr/recruitment/candidates/{id}/hire
```

---

# Attendance API Domain

| Resource | Operations | Permission | Events |
|----------|------------|------------|--------|
| **Attendance records** | list, get, daily-register | `hr.attendance.view` | — |
| **Attendance corrections** | create, submit, approve | `hr.attendance.correct`, `hr.attendance.approve` | `hr.attendance.corrected` |
| **Attendance approvals** | via Core `/api/v1/core/approvals` | `core.approval.act` | `core.approval.*` |
| **Attendance analytics** | summary, trends | `hr.report.attendance.view` | — |
| **Devices** | list, create, update, test-connection | `hr.attendance.device.manage` | — |
| **Device sync** | trigger, status | `hr.attendance.device.manage` | `hr.device.sync.failed` |
| **WFH records** | create, list, approve | `hr.attendance.view`, `ess.attendance.view` | — |
| **Outdoor duty** | create, list, approve | `hr.attendance.view` | — |
| **Finalize** | `POST /attendance/periods/{id}/finalize` | `hr.attendance.finalize` | `hr.attendance.finalized` |

```text
GET    /api/v1/hr/attendance
GET    /api/v1/hr/attendance/daily
POST   /api/v1/hr/attendance/corrections
POST   /api/v1/hr/attendance/sync          (device auth)
GET    /api/v1/hr/attendance/devices
POST   /api/v1/hr/attendance/periods/{id}/finalize
```

---

# Biometric Integration Architecture

**Integration layer** — not general REST for end users.

### Connector pattern

```text
Device (ZKTeco / eSSL / face)
    → POST /api/v1/hr/attendance/sync (device token)
    → AttendanceSyncService.normalize()
    → hr_attendance_logs (raw)
    → Reconciliation job → hr_attendance (daily)
```

| Vendor | Integration mode | Auth |
|--------|------------------|------|
| **ZKTeco** | Push (ADMS) or scheduled pull | Device token + device_id |
| **eSSL** | Scheduled pull via connector worker | Service account |
| **Fingerprint** | SDK → normalized punch payload | Device token |
| **Face recognition** | Same as fingerprint | Device token |
| **Generic API** | Custom JSON punch schema | API key per tenant |

### API operations (integration)

| Operation | Path (conceptual) | Purpose |
|-----------|-------------------|---------|
| **Push punches** | `POST /hr/attendance/sync` | Bulk raw logs |
| **Pull config** | `GET /hr/attendance/devices/{id}/config` | Device polling |
| **Health ping** | `POST /hr/attendance/devices/{id}/heartbeat` | Online status |
| **Sync status** | `GET /hr/attendance/devices/{id}/sync-status` | Last sync, errors |
| **Manual reconcile** | `POST /hr/attendance/devices/{id}/reconcile` | Admin trigger |

### Real-time sync (future)

SSE or WebSocket channel: `GET /api/v1/hr/attendance/live` — manager view of today's punches.

### Device health monitoring

Events: `hr.device.sync.failed`, `hr.device.offline` → Notification + dashboard widget.

---

# Shift API Domain

| Resource | Operations | Permission |
|----------|------------|------------|
| **Shift definitions** | list, get, create, update | `hr.shift.manage` |
| **Shift rules** | CRUD | `hr.shift.manage` |
| **Assignments** | list, create, bulk-assign, end | `hr.shift.assign` |
| **Rotations** | list, create, generate-assignments | `hr.shift.manage` |
| **Calendars** | get, update working days | `hr.shift.manage` |
| **Exceptions** | create, list | `hr.shift.assign` |

```text
/api/v1/hr/shifts/definitions
/api/v1/hr/shifts/assignments
/api/v1/hr/shifts/rotations
/api/v1/hr/shifts/calendars
```

---

# Leave API Domain

| Resource | Operations | Permission | Events |
|----------|------------|------------|--------|
| **Leave requests** | list, get, create, cancel | `hr.leave.create`, `ess.leave.apply` | `hr.leave.requested` |
| **Leave approvals** | submit, via Core approve/reject | `hr.leave.approve` | `hr.leave.approved`, `.rejected` |
| **Leave balances** | list, get, adjust | `hr.leave.view`, `hr.leave.balance.adjust` | `hr.leave.balance_changed` |
| **Leave policies** | list, get, create, version | `hr.leave.policy.manage` | — |
| **Leave types** | CRUD | `hr.leave.policy.manage` | — |
| **Accruals** | run, list runs | `hr.leave.accrual.run` | `hr.leave.accrued` |
| **Encashments** | create, approve | `hr.leave.encash` | — |
| **Holiday calendars** | list, get, create, import | `hr.leave.policy.manage` | — |

```text
/api/v1/hr/leave/requests
/api/v1/hr/leave/balances
/api/v1/hr/leave/policies
/api/v1/hr/leave/accruals/run
/api/v1/hr/leave/holidays
```

---

# Payroll API Domain

*Most detailed section — compensation bounded context.*

## Payroll API principles

| Rule | Detail |
|------|--------|
| **Calculation in service** | Never expose raw formula eval to client |
| **Lock immutability** | Post-lock mutations only via adjustment API |
| **SoD** | Calculator ≠ approver ≠ locker (permission enforced) |
| **Sensitive response** | Bank/tax fields masked without `hr.sensitive.view` |
| **Idempotent lock** | `Idempotency-Key` on lock and post |
| **Period guard** | Operations validate `payroll_periods.is_locked` |

## Structure APIs

| Resource | Operations | Permission | Events |
|----------|------------|------------|--------|
| **Salary structures** | list, get, create, update, archive | `payroll.structure.view`, `.manage` | `payroll.structure.updated` |
| **Salary components** | list, get, create, update | `payroll.component.manage` | — |
| **Structure lines** | list, upsert (nested) | `payroll.structure.manage` | — |
| **Allowances** | component type = earning | `payroll.component.manage` | — |
| **Deductions** | component type = deduction | `payroll.component.manage` | — |
| **Benefits** | employer contribution components | `payroll.component.manage` | — |
| **Tax rules** | list, get, create, version | `payroll.tax.manage` | — |
| **Contribution rules** | PF, ESI, etc. | `payroll.tax.manage` | — |
| **Employee salary assignment** | get, assign, revise | `payroll.salary_revision.manage` | `payroll.structure.changed` |

```text
/api/v1/payroll/structures
/api/v1/payroll/components
/api/v1/payroll/tax-rules
/api/v1/payroll/employee-salaries
```

## Processing APIs

| Resource | Operations | Permission | Events |
|----------|------------|------------|--------|
| **Payroll periods** | list, get, open, close | `payroll.period.manage` | `payroll.period.closed` |
| **Payroll runs** | list, get, create, calculate, review, submit | `payroll.run.create`, `.view` | `payroll.run.created`, `.calculated` |
| **Payroll approvals** | via Core + `POST .../submit-for-approval` | `payroll.run.approve` | `payroll.run.approved` |
| **Payroll locking** | lock, unlock (admin) | `payroll.run.lock` | `payroll.run.locked` |
| **Payroll posting** | post to accounting | `payroll.run.post` | `payroll.run.posted` |
| **Payslips** | list, get, publish, download-pdf | `payroll.payslip.view_all`, `.publish` | `payroll.payslip.published` |
| **Payslip lines** | nested read-only | `payroll.payslip.view_all` | — |
| **Run employees** | list inclusion, exclude, include | `payroll.run.create` | — |

```text
GET    /api/v1/payroll/periods
GET    /api/v1/payroll/runs
POST   /api/v1/payroll/runs
POST   /api/v1/payroll/runs/{id}/calculate
POST   /api/v1/payroll/runs/{id}/submit-for-approval
POST   /api/v1/payroll/runs/{id}/lock
POST   /api/v1/payroll/runs/{id}/post
GET    /api/v1/payroll/payslips
GET    /api/v1/payroll/payslips/{id}/pdf
```

## Adjustments & extras

| Resource | Operations | Permission | Events |
|----------|------------|------------|--------|
| **Bonus records** | list, create, approve | `payroll.bonus.manage` | — |
| **Commission records** | list, create, import | `payroll.commission.manage` | — |
| **Salary revisions** | list, create, approve, effective | `payroll.salary_revision.manage` | `payroll.salary.revised` |
| **Payroll adjustments** | list, create (post-lock) | `payroll.adjustment.create` | `payroll.adjustment.posted` |
| **Arrears** | list, calculate | `payroll.run.create` | — |
| **YTD summaries** | get per employee | `payroll.payslip.view_all` | — |
| **Bank export** | generate, download | `payroll.bank_export` | `payroll.bank_export.created` |

## Payroll analytics APIs

| Operation | Path (conceptual) | Permission |
|-----------|-------------------|------------|
| Cost summary | `GET /payroll/analytics/cost` | `payroll.report.view` |
| Variance | `GET /payroll/analytics/variance` | `payroll.report.view` |
| Component breakdown | `GET /payroll/analytics/components` | `payroll.report.view` |
| Department cost | `GET /payroll/analytics/by-department` | `payroll.report.view` |

## Payroll processing flow (API sequence)

```text
1. POST /payroll/runs                    { period_id }
2. POST /payroll/runs/{id}/calculate
3. GET  /payroll/runs/{id}/exceptions
4. POST /payroll/runs/{id}/submit-for-approval
5. POST /api/v1/core/approvals/{id}/approve
6. POST /payroll/runs/{id}/lock
7. POST /payroll/payslips/publish-batch
8. POST /payroll/runs/{id}/post
9. POST /payroll/bank-exports
```

---

# Overtime API Domain

| Resource | Operations | Permission | Events |
|----------|------------|------------|--------|
| **OT policies** | list, get, create, update | `hr.overtime.policy.manage` | — |
| **OT requests** | list, get, create, cancel | `hr.overtime.request`, `ess.request.create` | `hr.overtime.requested` |
| **OT approvals** | submit, Core approve | `hr.overtime.approve` | `hr.overtime.approved` |
| **OT calculations** | list, get (read-only) | `hr.attendance.view` | — |
| **Payroll feed** | automatic on lock | internal | Payslip line input |

```text
/api/v1/hr/overtime/policies
/api/v1/hr/overtime/requests
/api/v1/hr/overtime/requests/{id}/submit
```

---

# Loan & Advance API Domain

| Resource | Operations | Permission | Events |
|----------|------------|------------|--------|
| **Loans** | list, get, create, approve, disburse, close | `payroll.loan.*` | `payroll.loan.approved` |
| **Installments** | list (schedule) | `payroll.loan.view` | — |
| **Recoveries** | list per payslip | `payroll.loan.view` | — |
| **Salary advances** | list, create, approve | `payroll.advance.*` | `payroll.advance.approved` |
| **Advance recoveries** | list | `payroll.advance.view` | — |

```text
/api/v1/payroll/loans
/api/v1/payroll/loans/{id}/approve
/api/v1/payroll/loans/{id}/installments
/api/v1/payroll/advances
```

---

# Performance API Domain

| Resource | Operations | Permission | Events |
|----------|------------|------------|--------|
| **Goals** | list, create, update, complete | `hr.goal.create`, `hr.performance.manage` | — |
| **KPIs** | list, manage definitions | `hr.kpi.manage` | — |
| **KRAs** | list, assign by role | `hr.kpi.manage` | — |
| **Review cycles** | list, create, activate, close | `hr.performance.manage` | `hr.performance.cycle.started` |
| **Reviews** | list, get, initiate | `hr.performance.manage` | — |
| **Self reviews** | get, submit | `ess.performance.self_review` | — |
| **Manager reviews** | get, submit | `hr.performance.manage` | — |
| **Final reviews** | complete, approve | `hr.performance.approve` | `hr.performance.review.completed` |
| **Promotion recommendations** | create, approve | `hr.promotion.recommend` | `hr.promotion.recommended` |
| **Salary recommendations** | link to payroll revision | `payroll.salary_revision.manage` | — |

```text
/api/v1/hr/performance/cycles
/api/v1/hr/performance/reviews
/api/v1/hr/performance/goals
/api/v1/hr/performance/reviews/{id}/self-review
/api/v1/hr/performance/reviews/{id}/manager-review
/api/v1/hr/performance/promotions
```

---

# Training API Domain

| Resource | Operations | Permission | Events |
|----------|------------|------------|--------|
| **Programs** | list, get, create, update | `hr.training.program.manage` | — |
| **Sessions** | list, create, schedule | `hr.training.schedule.manage` | — |
| **Participants** | enroll, list, remove | `hr.training.program.manage`, `ess.training.enroll` | `hr.training.enrolled` |
| **Attendance** | mark, list | `hr.training.attendance` | — |
| **Certificates** | issue, list, download | `hr.training.certify` | `hr.training.completed` |
| **Evaluations** | submit, list | `hr.training.evaluate` | — |

```text
/api/v1/hr/training/programs
/api/v1/hr/training/sessions
/api/v1/hr/training/sessions/{id}/participants
/api/v1/hr/training/certificates
```

---

# Asset API Domain

| Resource | Operations | Permission | Events |
|----------|------------|------------|--------|
| **Asset inventory** | list, get, create, update, retire | `hr.asset.create` | — |
| **Categories** | list, manage | `hr.asset.create` | — |
| **Assignments** | create, list, active-by-employee | `hr.asset.assign` | `hr.asset.assigned` |
| **Returns** | create | `hr.asset.return` | `hr.asset.returned` |
| **Damage reports** | create, approve | `hr.asset.create` | — |
| **Lifecycle** | history list | `hr.asset.create` | — |
| **Disposal** | dispose action | `hr.asset.dispose` | — |

```text
/api/v1/hr/assets
/api/v1/hr/assets/assignments
/api/v1/hr/assets/assignments/{id}/return
/api/v1/hr/assets/{id}/history
```

---

# Document API Domain

| Resource | Operations | Permission | Events |
|----------|------------|------------|--------|
| **Document types** | list, manage | `hr.document.view` | — |
| **Employee documents** | list, upload, verify | `hr.document.upload`, `.verify` | `hr.document.uploaded`, `.expiring` |
| **Contracts** | list, create, version | `hr.document.view` | — |
| **Expiry tracking** | list expiring | `hr.document.view` | `hr.document.expiring` |
| **Archives** | archive, list archived | `hr.document.archive` | — |

```text
/api/v1/hr/documents/types
/api/v1/hr/documents/employees
/api/v1/hr/documents/expiry
/api/v1/hr/documents/contracts
```

File bytes via Core: `POST /api/v1/core/media/upload` → attach to document.

---

# Approval Engine APIs

HR documents use **Core Approval APIs** — no duplicate HR approval tables.

| Operation | Core path (conceptual) | HR usage |
|-----------|------------------------|----------|
| Pending inbox | `GET /api/v1/core/approvals/pending` | All modules |
| Get approval | `GET /api/v1/core/approvals/{id}` | Leave, payroll, etc. |
| Approve step | `POST /api/v1/core/approvals/{id}/approve` | Manager actions |
| Reject | `POST /api/v1/core/approvals/{id}/reject` | |
| Delegate | `POST /api/v1/core/approvals/{id}/delegate` | |
| History | `GET /api/v1/core/approvals/{id}/history` | Audit |
| Escalations | automatic + `GET /api/v1/core/approvals/escalated` | SLA breach |

### HR submit pattern

```text
POST /api/v1/hr/leave/requests/{id}/submit
  → Application layer creates Core approval
  → Stores approval_id on leave request
  → Returns { leave_request, approval_id }
```

### Universal approval filter

`GET /api/v1/core/approvals/pending?module=hr|payroll`

---

# Notification Engine APIs

HR modules **emit events** — notification delivery via Core.

| Operation | Core path | Purpose |
|-----------|-----------|---------|
| Inbox | `GET /api/v1/core/notifications` | User notifications |
| Mark read | `POST /api/v1/core/notifications/{id}/read` | |
| Preferences | `GET/PATCH /api/v1/core/notifications/preferences` | Channel opt-in |
| Admin rules | `GET /api/v1/core/notifications/rules` | Tenant admin |
| Delivery status | `GET /api/v1/core/notifications/deliveries` | Audit |

**HR-specific:** No `/api/v1/hr/notifications` — consumers use Core inbox with `?category=hr` filter.

---

# Activity Engine APIs

| Operation | Core path | HR usage |
|-----------|-----------|----------|
| Timeline | `GET /api/v1/core/activities/{entity_type}/{entity_id}` | Employee, leave, run |
| Comments | `POST /api/v1/core/activities/.../comments` | Collaboration |
| Notes | `POST /api/v1/core/notes` | Internal HR notes |
| Audit search | `GET /api/v1/core/activities/search` | Compliance |
| Field history | embedded in activity payload | Salary, status changes |

### HR entity types (activity)

`hr_employee` · `hr_leave_request` · `hr_attendance` · `payroll_run` · `payroll_payslip` · `hr_candidate` · `hr_asset_assignment` · `hr_performance_review`

---

# Reporting APIs

Per [HR_REPORTING_ARCHITECTURE.md](./HR_REPORTING_ARCHITECTURE.md) and [HR_DASHBOARD_ARCHITECTURE.md](./HR_DASHBOARD_ARCHITECTURE.md).

| API group | Base path | Operations |
|-----------|-----------|------------|
| **Reports** | `/api/v1/hr/reports/`, `/api/v1/payroll/reports/` | catalog, run, export, schedules |
| **Analytics** | `/api/v1/hr/analytics/`, `/api/v1/payroll/analytics/` | trends, pivots |
| **KPIs** | `/api/v1/hr/dashboard/kpis` | batch KPI fetch |
| **Dashboards** | `/api/v1/hr/dashboard/*` | layout, widgets, charts, actions |
| **ESS reports** | `/api/v1/ess/reports/` | self-scoped |
| **Exports** | `POST .../export`, `GET .../exports/{run_id}` | async large exports |

---

# AI Assistant APIs

Per [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) — AI acts through **tools** mapped to HR services.

**Base:** `/api/v1/ai/os/` · **Permission:** `ai.access` + inherited HR permissions

| Tool (conceptual) | Service backing | Permission |
|-------------------|-----------------|------------|
| `ai.tool.hr.employee_search` | HrEmployeeService.search | `hr.employee.view` |
| `ai.tool.hr.attendance_insights` | Analytics read model | `hr.report.attendance.view` |
| `ai.tool.hr.payroll_insights` | Payroll analytics | `payroll.report.view` |
| `ai.tool.hr.leave_insights` | Leave analytics | `hr.report.leave.view` |
| `ai.tool.hr.performance_insights` | Performance analytics | `hr.report.performance.view` |
| `ai.tool.hr.promotion_suggest` | AI read model | `hr.report.performance.view` + `ai.access` |
| `ai.tool.hr.attrition_predict` | Attrition signals | `hr.report.employee.view` + `ai.access` |
| `ai.tool.hr.training_recommend` | Skill gap model | `hr.report.training.view` + `ai.access` |

### AI HR insight read APIs (module)

```text
GET /api/v1/hr/ai/insights/attendance
GET /api/v1/hr/ai/insights/attrition
GET /api/v1/hr/ai/insights/payroll-anomalies
```

**Rule:** AI propose endpoints return suggestions only — apply actions call standard mutation APIs with human confirmation.

---

# Webhook Architecture

### Outbound webhooks (tenant-configured)

Registered via `POST /api/v1/core/webhooks` with HR event subscriptions.

| Event | Payload summary |
|-------|-----------------|
| `hr.employee.created` | employee_id, company_id, hire_date |
| `hr.employee.updated` | employee_id, changed_fields[] |
| `hr.attendance.finalized` | period_id, company_id |
| `hr.leave.approved` | request_id, employee_id, dates |
| `payroll.run.approved` | run_id, period_id |
| `payroll.run.locked` | run_id, totals |
| `hr.asset.assigned` | asset_id, employee_id |
| `hr.training.completed` | participant_id, program_id |

**Delivery:** HMAC-SHA256 signature header · retry with exponential backoff · delivery log in Core.

### Inbound webhooks

| Source | Path | Auth |
|--------|------|------|
| Biometric push | `/api/v1/webhooks/inbound/hr/attendance` | Device secret |
| HRIS sync | `/api/v1/webhooks/inbound/hr/employees` | API key |
| Government portal | `/api/v1/webhooks/inbound/hr/compliance` | mTLS (future) |

---

# Event Architecture

### Event naming convention

```text
{module}.{entity}.{action}

Examples:
  hr.employee.hired
  hr.attendance.finalized
  hr.leave.approved
  payroll.run.locked
  payroll.payslip.published
```

### HR domain event catalog

| Event | Trigger API | Subscribers |
|-------|-------------|-------------|
| `hr.employee.created` | POST /employees | Search, webhook, analytics |
| `hr.employee.hired` | POST /candidates/{id}/hire | Notification, onboarding |
| `hr.employee.updated` | PATCH /employees/{id} | Search, activity |
| `hr.employee.transferred` | POST /employees/{id}/transfer | Notification, history |
| `hr.employee.terminated` | POST /employees/{id}/terminate | Access revoke, exit workflow |
| `hr.attendance.finalized` | POST /attendance/periods/{id}/finalize | Payroll, analytics |
| `hr.attendance.corrected` | Correction approved | Payroll recalc, activity |
| `hr.leave.requested` | POST /leave/requests | Approval, notification |
| `hr.leave.approved` | Core approval | Balance deduct, notification |
| `hr.leave.rejected` | Core approval | Notification |
| `hr.overtime.approved` | Core approval | OT calculation |
| `payroll.run.created` | POST /payroll/runs | Activity |
| `payroll.run.calculated` | POST .../calculate | Review notification |
| `payroll.run.approved` | Core approval | Activity |
| `payroll.run.locked` | POST .../lock | Payslip publish, analytics |
| `payroll.run.posted` | POST .../post | Accounting journal |
| `payroll.payslip.published` | Publish batch | ESS, notification |
| `payroll.bank_export.created` | Bank export | Compliance notification |
| `hr.asset.assigned` | POST /assets/assignments | IT notification |
| `hr.training.completed` | Certificate issue | HR analytics |
| `hr.document.expiring` | Scheduled job | Reminder notification |

### Event envelope (conceptual)

```json
{
  "id": "uuid",
  "name": "hr.leave.approved",
  "tenant_id": "uuid",
  "company_id": "uuid",
  "entity_type": "hr_leave_request",
  "entity_id": "uuid",
  "actor_user_id": "uuid",
  "occurred_at": "ISO8601",
  "payload": {}
}
```

---

# Mobile API Strategy

| App | Primary API prefix | Key surfaces |
|-----|-------------------|--------------|
| **Employee app** | `/api/v1/ess/` | Leave, attendance, payslips, profile, requests |
| **Manager app** | `/api/v1/ess/` + `/api/v1/core/approvals` | Team leave, approvals, attendance |
| **HR app** | `/api/v1/hr/` (subset) | Employee lookup, attendance, leave admin |
| **Payroll app** | `/api/v1/payroll/` | Run status, exceptions, approve |
| **Executive app** | `/api/v1/hr/dashboard/`, `/api/v1/hr/executive/` | KPIs, read-only |

### Mobile conventions

| Concern | Strategy |
|---------|----------|
| **Pagination** | Cursor-based for notifications and activity |
| **Payload size** | `?fields=` sparse fieldsets |
| **Offline** | ESS leave draft — sync on reconnect |
| **Push** | FCM/APNs via Notification Engine |
| **Biometric login** | Device keychain + refresh token |
| **Approvals** | Swipe actions → Core approval API |

```text
GET  /api/v1/ess/dashboard
GET  /api/v1/ess/leave/balances
POST /api/v1/ess/leave/requests
GET  /api/v1/ess/payslips
GET  /api/v1/ess/attendance
POST /api/v1/ess/attendance/check-in
```

---

# Third Party Integration Strategy

| System | Direction | Integration pattern |
|--------|-----------|---------------------|
| **Microsoft 365** | Outbound | Graph API — org chart sync, calendar |
| **Google Workspace** | Outbound | Directory sync, calendar |
| **Slack** | Outbound | Notification channel adapter |
| **Microsoft Teams** | Outbound | Notification channel adapter |
| **Zoom** | Outbound | Interview calendar links |
| **ZKTeco / eSSL** | Inbound | Device sync API |
| **Accounting (GL)** | Outbound | `payroll.run.posted` event → journal API |
| **Government compliance** | Outbound | Statutory export files + future portal API |
| **CRM** | Bidirectional | Contact sync on hire |
| **Inventory** | Reference | Asset UUID link |

**Rule:** Integrations use **service accounts** with minimal scopes — never admin user credentials.

---

# API Security Strategy

| Control | Implementation |
|---------|----------------|
| **Rate limiting** | Per tenant, per user, per API key — stricter on auth and export |
| **Audit logging** | Every mutation → Activity + `api_audit_log` |
| **Request validation** | Schema validation at controller — reject unknown fields |
| **Response filtering** | Field permissions + ESS scope |
| **Sensitive data** | Encrypt bank fields at rest; mask in API |
| **Payroll data protection** | Separate permission tier; no payroll in HR list defaults |
| **CSRF** | Session-based web |
| **CORS** | Allowlist per tenant |
| **Webhook signatures** | HMAC verify inbound/outbound |
| **Device auth** | Rotating device tokens; IP allowlist optional |

### Rate limit tiers (conceptual)

| Tier | Limit | Endpoints |
|------|-------|-----------|
| Standard | 1000/min/user | CRUD |
| Heavy | 10/min/user | Report export, payroll calculate |
| Device | 10000/min/device | Attendance sync |
| Auth | 20/min/IP | Login |

---

# API Monitoring Strategy

| Monitor | Tooling | Alert |
|---------|---------|-------|
| **Usage** | Per-route metrics, tenant dashboards | Unusual spike |
| **Errors** | 4xx/5xx rates by route | >1% 5xx |
| **Performance** | p95 latency per API group | >3s reports |
| **Audit** | Mutation log, export log | Bulk export |
| **AI** | Tool invocation, token usage | Budget exceeded |
| **Devices** | Sync lag, failure rate | Device offline >1h |

**Tracing:** `X-Request-Id` propagated through service → event → notification.

---

# API Versioning Strategy (detail)

| Change type | Version handling |
|-------------|------------------|
| Add optional field | Same v1 |
| Add new endpoint | Same v1 |
| Rename field | v2 + deprecate v1 field |
| Remove field | v2 only after sunset |
| Change behavior | v2 or feature flag |

**Mobile compatibility:** Minimum supported API version in app config; server returns `426` if too old.

---

# Multi Company API Strategy

| Rule | API behavior |
|------|--------------|
| **Tenant isolation** | JWT `tenant_id` — cross-tenant = 403 |
| **Company isolation** | All queries filter `company_id` |
| **Company switch** | `PATCH /api/v1/core/auth/context` { company_id } |
| **Branch isolation** | Record rules on list endpoints |
| **Data ownership** | HR cannot read other company's employees |
| **Group reporting** | Separate analytics API with multi-company role |
| **Inter-company transfer** | Dedicated action API — not PATCH company_id |

---

# Organization API Domain

| Resource | Operations | Permission |
|----------|------------|------------|
| **Locations** | CRUD | `hr.location.manage` |
| **Departments** | list, tree, CRUD | `hr.department.manage` |
| **Teams** | CRUD | `hr.department.manage` |
| **Designations** | CRUD | `hr.job_position.manage` |
| **Job positions** | CRUD | `hr.job_position.manage` |
| **Employment types** | CRUD | `hr.department.manage` |
| **Reporting structure** | list, upsert lines | `hr.employee.edit` |
| **Cost centers** | CRUD | `hr.department.manage` |
| **Org chart** | get tree | `hr.department.view` |

```text
/api/v1/hr/organization/departments
/api/v1/hr/organization/teams
/api/v1/hr/organization/designations
/api/v1/hr/organization/chart
```

---

# ESS API Domain

**Prefix:** `/api/v1/ess/` · **Scope:** `employee_id = session` always

| Resource | Operations | Permission |
|----------|------------|------------|
| **Dashboard** | get bundle | `ess.access` |
| **Profile** | get, patch (non-sensitive) | `ess.profile.view`, `.edit` |
| **Attendance** | list, check-in, correction request | `ess.attendance.view` |
| **Leave** | balances, apply, list requests | `ess.leave.apply` |
| **Payslips** | list, get, download pdf | `ess.payslip.view` |
| **Documents** | upload, list | `ess.document.upload` |
| **Requests** | generic request router | `ess.request.create` |
| **Assets** | list assigned | `ess.asset.view` |
| **Training** | enroll, list | `ess.training.enroll` |
| **Performance** | self-review submit | `ess.performance.self_review` |

---

# Workflow API Integration

HR mutations that trigger workflows use **Core Workflow APIs**:

| Operation | Core path |
|-----------|-----------|
| Get instance | `GET /api/v1/core/workflows/{model}/{record_id}` |
| Transition | `POST /api/v1/core/workflows/{instance_id}/transition` |
| Available actions | `GET /api/v1/core/workflows/{instance_id}/actions` |

Registered workflow IDs: `hr.leave`, `hr.attendance.correction`, `hr.overtime`, `payroll.run`, `hr.offer`, `hr.promotion`, `hr.exit`, etc. per [HR_WORKFLOW_ARCHITECTURE.md](./HR_WORKFLOW_ARCHITECTURE.md).

---

# Response Standards (HR-specific)

| Resource | `data` shape notes |
|----------|-------------------|
| **Employee** | Embeds `contact` summary; omits `bank_*` without sensitive perm |
| **Leave request** | Includes `approval_status`, `days_count` |
| **Payroll run** | Includes `status`, `totals`, `exception_count` |
| **Payslip** | Includes `lines[]`, `net_pay`, `currency`; PDF via separate download |
| **Attendance** | Daily row with `status`, `check_in`, `check_out` |
| **List meta** | `page`, `per_page`, `total`, `filters_applied` |

**Money:** `amount` as decimal string + `currency_code` (ISO 4217).

**Dates:** Date-only fields as `YYYY-MM-DD`; timestamps UTC ISO 8601.

---

# Cross-Reference Index

| Document | Relationship |
|----------|--------------|
| [HR_DATABASE_ARCHITECTURE.md](./HR_DATABASE_ARCHITECTURE.md) | Entity ownership behind APIs |
| [HR_DATABASE_ERD_PLANNING.md](./HR_DATABASE_ERD_PLANNING.md) | Relationship model |
| [HR_WORKFLOW_ARCHITECTURE.md](./HR_WORKFLOW_ARCHITECTURE.md) | Workflow action mapping |
| [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md) | Permission keys |
| [HR_NOTIFICATION_ARCHITECTURE.md](./HR_NOTIFICATION_ARCHITECTURE.md) | Event → notification |
| [HR_REPORTING_ARCHITECTURE.md](./HR_REPORTING_ARCHITECTURE.md) | Report API catalog |
| [HR_DASHBOARD_ARCHITECTURE.md](./HR_DASHBOARD_ARCHITECTURE.md) | Dashboard API |
| [HR_SCREEN_INVENTORY.md](./HR_SCREEN_INVENTORY.md) | Screen → API mapping |
| [API_REGISTRY.md](../../00-foundation/registries/API_REGISTRY.md) | Global API standards |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll |
| **Owner** | Platform / HR domain |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **API groups** | `hr` · `payroll` · `ess` (+ Core platform) |

---

**AgainERP HR & Payroll API Architecture** — API-first, multi-tenant, engine-integrated, AI-ready. No code.
