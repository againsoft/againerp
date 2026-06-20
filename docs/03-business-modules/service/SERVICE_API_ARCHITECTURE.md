# Service Module — API Architecture

> **Status:** Planning Phase  
> **Version:** 1.0  
> **Module:** Service  
> **Document Type:** API Architecture Blueprint  
> **Phase:** STEP 03 — Planning Only  
> **Parent:** [SERVICE_MODULE_ARCHITECTURE.md](./SERVICE_MODULE_ARCHITECTURE.md) · [SERVICE_DATABASE_ARCHITECTURE.md](./SERVICE_DATABASE_ARCHITECTURE.md)  
> **Governance:** [API_REGISTRY.md](../../00-foundation/registries/API_REGISTRY.md) · [api/architecture.md](../../05-development/api/architecture.md)

---

**No OpenAPI files. No controllers. No application code.**

---

## 1. API Philosophy

| Principle | Rule |
|-----------|------|
| **Base path** | `/api/v1/service/` |
| **Auth** | Bearer JWT + `X-Company-Id` + `X-Tenant-Id` |
| **Envelope** | Standard AgainERP `{ data, meta, errors }` |
| **Pagination** | `?page=1&limit=25` — max 100 |
| **UUID paths** | `/orders/{id}` — never internal serial |
| **Actions** | State transitions via `POST /resource/{id}/action` |
| **Integration** | Cross-module via events + service clients — not nested foreign CRUD |

---

## 2. Resource Domains

| Domain | Prefix | Primary resources |
|--------|--------|-------------------|
| Catalog | `/catalog/` | categories, items |
| Assets | `/assets/` | customer assets |
| Orders | `/orders/` | service orders + lines |
| Work Orders | `/work-orders/` | execution, check-in/out |
| Repairs | `/repairs/` | stage transitions, checklists |
| Technicians | `/technicians/` | profiles, metrics |
| Schedule | `/schedule/` | slots, board views |
| Contracts | `/contracts/` | AMC |
| Subscriptions | `/subscriptions/` | recurring |
| SLA | `/sla/` | policies, timers |
| Reports | `/reports/` | read-only aggregates |
| Settings | `/settings/` | assignment rules, repair stages |

---

## 3. Endpoint Definitions

### 3.1 Service Catalog

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/catalog/items` | `service.catalog.view` | List with filters |
| GET | `/catalog/items/{id}` | `service.catalog.view` | Detail |
| POST | `/catalog/items` | `service.catalog.manage` | Create |
| PATCH | `/catalog/items/{id}` | `service.catalog.manage` | Update |
| POST | `/catalog/items/{id}/deactivate` | `service.catalog.manage` | Soft deactivate |
| GET | `/catalog/categories` | `service.catalog.view` | Tree list |
| POST | `/catalog/categories` | `service.catalog.manage` | Create category |

**List filters:** `status`, `billing_type`, `category_id`, `q` (search code/name)

---

### 3.2 Customer Assets

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/assets` | `service.assets.view` | List |
| GET | `/assets/{id}` | `service.assets.view` | Detail + history summary |
| POST | `/assets` | `service.assets.manage` | Register asset |
| PATCH | `/assets/{id}` | `service.assets.manage` | Update |
| GET | `/assets/{id}/history` | `service.assets.view` | Service timeline |

**Validation:** `contact_id` required · `serial_number` unique per company when provided

---

### 3.3 Service Orders

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/orders` | `service.orders.view` | AG Grid list |
| GET | `/orders/{id}` | `service.orders.view` | Detail + lines + WO |
| POST | `/orders` | `service.orders.create` | Create draft |
| PATCH | `/orders/{id}` | `service.orders.manage` | Update draft/open |
| POST | `/orders/{id}/confirm` | `service.orders.manage` | draft → open |
| POST | `/orders/{id}/assign` | `service.orders.dispatch` | Assign technician |
| POST | `/orders/{id}/start` | `service.orders.execute` | in_progress |
| POST | `/orders/{id}/complete` | `service.orders.execute` | complete + emit billing.ready |
| POST | `/orders/{id}/cancel` | `service.orders.manage` | Cancel |
| POST | `/orders/{id}/lines` | `service.orders.manage` | Add line |
| DELETE | `/orders/{id}/lines/{lineId}` | `service.orders.manage` | Remove line (draft only) |

---

### 3.4 Work Orders

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/work-orders` | `service.work_orders.view` | List |
| GET | `/work-orders/{id}` | `service.work_orders.view` | Detail |
| POST | `/work-orders` | `service.work_orders.manage` | Create from order |
| POST | `/work-orders/{id}/check-in` | `service.work_orders.execute` | GPS + start |
| POST | `/work-orders/{id}/check-out` | `service.work_orders.execute` | GPS + end |
| POST | `/work-orders/{id}/complete` | `service.work_orders.execute` | Mark done |
| POST | `/work-orders/{id}/parts` | `service.parts.issue` | Add parts line → Inventory |
| POST | `/work-orders/{id}/signature` | `service.work_orders.execute` | Upload signature media |

---

### 3.5 Contracts & Subscriptions

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/contracts` | `service.contracts.view` | AMC list |
| POST | `/contracts` | `service.contracts.manage` | Create |
| POST | `/contracts/{id}/activate` | `service.contracts.manage` | Activate |
| POST | `/contracts/{id}/renew` | `service.contracts.manage` | Renewal |
| GET | `/subscriptions` | `service.subscriptions.view` | List |
| POST | `/subscriptions` | `service.subscriptions.manage` | Create |
| POST | `/subscriptions/{id}/pause` | `service.subscriptions.manage` | Pause billing |

---

### 3.6 Schedule

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/schedule/calendar` | `service.schedule.view` | Range query `from`, `to` |
| GET | `/schedule/board` | `service.schedule.view` | Technician board |
| POST | `/schedule/slots` | `service.schedule.manage` | Book slot |
| PATCH | `/schedule/slots/{id}` | `service.schedule.manage` | Reschedule |
| POST | `/schedule/auto-assign` | `service.schedule.dispatch` | Run assignment rules |

---

### 3.7 Reports (read-only)

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/reports/service-revenue` | `service.reports.view` |
| GET | `/reports/profitability` | `service.reports.view` |
| GET | `/reports/technician-performance` | `service.reports.view` |
| GET | `/reports/amc-revenue` | `service.reports.view` |

Query params: `period`, `from`, `to`, `technician_id`, `category_id`

---

## 4. Request / Response Contracts (samples)

### Create Service Order

**POST** `/api/v1/service/orders`

```json
{
  "contact_id": "uuid",
  "asset_id": "uuid|null",
  "priority": "medium",
  "schedule_date": "2026-06-25T10:00:00Z",
  "lines": [
    {
      "service_item_id": "uuid",
      "qty": 1,
      "description": "Windows 11 Installation"
    }
  ],
  "notes_customer": "Backup data first"
}
```

**Response 201:**

```json
{
  "data": {
    "id": "uuid",
    "number": "SOV/2026/0042",
    "status": "draft",
    "billing_status": "unbilled"
  },
  "meta": { "request_id": "..." }
}
```

### Complete Order (billing handoff)

**POST** `/api/v1/service/orders/{id}/complete`

**Response 200:** order status `completed` + event `service.billing.ready` published

---

## 5. Validation Rules

| Rule | Applies to |
|------|------------|
| `contact_id` must exist in Core | orders, assets, contracts |
| Cannot edit lines when status ≥ assigned | orders |
| Cannot complete order with open work orders | orders |
| Parts qty > 0; product must exist via CatalogService | parts lines |
| Schedule slot must not overlap same technician | schedule |
| Contract end_date > start_date | contracts |
| Hourly lines require approved timesheet before invoice | billing integration |

---

## 6. Permission Rules

Every endpoint checks RBAC via `PermissionService.check(permission, company_id)`.

Field-level: technicians see only assigned work orders unless `service.work_orders.view_all`.

See [SERVICE_PERMISSIONS.md](./SERVICE_PERMISSIONS.md).

---

## 7. Integration APIs (outbound — Service calls)

| Service | Method | Use case |
|---------|--------|----------|
| `ContactService.get` | sync | Validate customer |
| `CatalogService.getProduct` | sync | Parts lines |
| `InventoryService.issue` | sync | Parts consumption |
| `SalesService.createInvoiceFromService` | sync | Mixed billing |
| `FinanceService.getAR` | sync | Display only |
| `NotificationService.send` | async | SLA, renewal |
| `WorkflowService.transition` | sync | Approvals |

---

## 8. Error Codes (module-specific)

| Code | HTTP | Meaning |
|------|------|---------|
| `SERVICE_ORDER_LOCKED` | 409 | Posted/completed — no edit |
| `SERVICE_PARTS_UNAVAILABLE` | 422 | Inventory insufficient |
| `SERVICE_SCHEDULE_CONFLICT` | 409 | Technician double-booked |
| `SERVICE_SLA_BREACHED` | 422 | Action blocked by policy (override with permission) |

---

## Change History

| Date | Change |
|------|--------|
| 2026-06-21 | v1.0 — Initial API architecture (STEP 03) |
