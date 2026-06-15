# Communication Contracts

> **Parent:** [UNIVERSAL_MODULE_FRAMEWORK.md](../UNIVERSAL_MODULE_FRAMEWORK.md)

---

## Four Integration Channels

### 1. Services (Synchronous)

| When | Cross-module read/write through owning module's service class |
|------|--------------------------------------------------------------|
| Example | `CatalogService::getProduct($id)` from Hospital pharmacy UI |
| Contract | Document in provider's `API.md` + `Architecture.md` |
| Auth | Caller's permissions applied |

### 2. Events (Asynchronous)

| When | Fire-and-forget after DB commit |
|------|--------------------------------|
| Naming | `{module}.{entity}.{action}` |
| Example | `hospital.admission.admitted` → Accounting creates draft invoice |
| Rules | Idempotent handlers; dead letter on failure |

### 3. APIs (HTTP)

| When | External systems, mobile, microservice split |
|------|---------------------------------------------|
| Base | `/api/v1/{module}/` |
| Auth | Bearer JWT, company header |

### 4. Workflows (Core Engine)

| When | State transitions with guards and approvals |
|------|---------------------------------------------|
| Register | In `Workflow.md` + Core workflow registry |
| Execute | `WorkflowService::transition($instance, $to)` |

---

## Anti-Patterns

| Anti-Pattern | Fix |
|--------------|-----|
| Hospital reads `commerce_orders` | `CommerceService::listOrders($contactId)` |
| School JOIN `catalog_products` | `CatalogService::searchProducts($q)` |
| Duplicate `contacts` as `school_students` only | Use `ContactService` + `school_enrollments` extension |
| Sync HTTP in request cycle for 5 modules | Publish event; async handlers |

---

## Event Catalog (Examples)

| Event | Publisher | Subscribers |
|-------|-----------|-------------|
| `core.contact.created` | Core | CRM, Hospital, School |
| `commerce.order.paid` | Orders | Accounting, Inventory |
| `hospital.appointment.created` | Hospital | Notifications, Accounting |
| `school.enrollment.completed` | School | Accounting, Notifications |

Global catalog: maintain in [MODULE_DEPENDENCY_MAP.md](../MODULE_DEPENDENCY_MAP.md).  
Service contracts: [SERVICE_REGISTRY.md](../SERVICE_REGISTRY.md).

---

## Service Versioning

| Rule | Detail |
|------|--------|
| Breaking change | New service method or API v2 |
| Deprecation | 2 minor versions notice in CHANGELOG |
| Manifest | `requires_services: catalog>=2.0` |
