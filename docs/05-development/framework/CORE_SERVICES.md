# Core Services Catalog

> **Parent:** [UNIVERSAL_MODULE_FRAMEWORK.md](../../00-foundation/UNIVERSAL_MODULE_FRAMEWORK.md)  
> **Master registry:** [SERVICE_REGISTRY.md](../../00-foundation/registries/SERVICE_REGISTRY.md)

---

## Purpose
Documentation: CORE SERVICES.

## When To Read
Read only if your task involves core services.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## Purpose

Exhaustive list of **Core Services** every industry module may use. Modules call services — never duplicate tables.

---

## Identity & Access

| Service | Methods (conceptual) | Tables Owned |
|---------|---------------------|--------------|
| `UserService` | create, authenticate, assignRole | `users`, `user_sessions` |
| `RoleService` | assignPermission, listRoles | `roles`, `permissions` |
| `PermissionService` | can(user, action), filterQuery | `role_permissions` |

---

## Tenant & Organization

| Service | Methods | Tables Owned |
|---------|---------|--------------|
| `CompanyService` | get, updateSettings | `companies` |
| `BranchService` | list, create | `branches` |
| `TenantService` | resolveTenant, limits | `platform_tenants` (platform) |

---

## Parties & Locations

| Service | Methods | Tables Owned |
|---------|---------|--------------|
| `ContactService` | create, find, update, merge | `contacts` |
| `AddressService` | attach, geocode | `addresses` |

**Rule:** Patients, students, guests → `ContactService` with `contact_type`.

---

## Collaboration

| Service | Methods | Tables Owned |
|---------|---------|--------------|
| `ActivityService` | schedule, complete | `activities` |
| `CommentService` | add, thread | `comments` |
| `NoteService` | addInternal | `notes` |
| `NotificationService` | send, template | `notifications` |

---

## Media & Documents

| Service | Methods | Tables Owned |
|---------|---------|--------------|
| `MediaService` | upload, attach, search | `media`, `attachments` |

---

## Platform Engines

| Service | Methods | Tables Owned |
|---------|---------|--------------|
| `WorkflowService` | register, transition | `workflows`, `workflow_instances` |
| `ApprovalService` | request, approve | `approvals` |
| `EventBus` | publish, subscribe | `domain_events` |
| `SearchService` | index, query | `search_indexes` |
| `AuditService` | log, query | `activity_logs`, `ai_audit_logs` |
| `SettingsService` | get, set | `core_settings` |
| `TaxService` | calculate | `tax_rates` |
| `CurrencyService` | convert | `exchange_rates` |

---

## Module Service Pattern

Industry modules **expose** their own services:

```yaml
# Hospital module provides
HospitalAppointmentService:
  - createAppointment(contactId, doctorId, slot)
  - cancelAppointment(id)
  - listByDate(date)

# Other modules consume via API — never hospital_appointments table
```

Register in `ModuleManifest.md` → `provides_services`.

---

## Service Call Flow

```
Hospital UI → HospitalController → HospitalAppointmentService
  → ContactService.get(contactId)     # Core
  → persist hospital_appointments     # Own table
  → EventBus.publish(hospital.appointment.created)
```
