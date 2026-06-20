# Service — Module Manifest

> **Rule:** Update on every structural change.  
> **Template:** [_MODULE_MANIFEST_TEMPLATE.md](../../00-foundation/templates/_MODULE_MANIFEST_TEMPLATE.md)

---

## Module Name

**Service** (Service Operations Platform)

## Version

`1.0.0-planning`

## Status

`Planning Phase` — documentation only; not installable

## Route Namespace

`/service/*`

## API Base

`/api/v1/service/`

## Table Prefix

`service_*`

---

## Dependencies

| Module | Type | Required |
|--------|------|----------|
| Core | Framework, Contacts, Workflow, Approval, Activity, Media, Notifications | Yes |
| CRM | Customer context | Recommended |
| Sales | Quotations, orders, mixed invoices | Yes (for billing) |
| Finance | GL posting (via events) | Yes (for revenue) |
| Inventory | Parts issue/consume | Optional (repair/field) |
| HR | Employee master for technicians | Yes |
| Helpdesk | Ticket escalation | Optional |
| Project | Project-type services | Optional |
| Timesheet | Hourly billing | Optional |
| Booking | Customer self-scheduling | Optional |
| AI OS | Assistant tools | Optional |

---

## Declared Services

### Consumes

| Service | Purpose |
|---------|---------|
| `ContactService` | Customer validation |
| `CatalogService` | Products on mixed invoices + parts |
| `InventoryService` | Stock issue/reserve |
| `SalesService` | Quotes, invoices |
| `FinanceService` | AR display, posting events |
| `WorkflowService` | State transitions |
| `ApprovalService` | Quote/repair approvals |
| `NotificationService` | SLA, renewal alerts |
| `MediaService` | Attachments, signatures |
| `PermissionService` | RBAC |

### Provides

| Service | Purpose |
|---------|---------|
| `ServiceCatalogService.getItem` | Sales line picker |
| `ServiceOrderService.getOrder` | CRM timeline |
| `ServiceAssetService.getAssetHistory` | Customer 360 |
| `ServiceContractService.getActiveContracts` | Renewal campaigns |
| `ServiceScheduleService.getAvailability` | Booking integration |

---

## Events

### Published

`service.order.*` · `service.work_order.*` · `service.billing.ready` · `service.parts.consumed` · `service.contract.renewal_due` · `service.subscription.billing_due` · `service.sla.*`

### Consumed

`sales.order.confirmed` · `helpdesk.ticket.escalated` · `inventory.stock.reserved` · `finance.invoice.posted`

---

## Feature Flags

| Flag | Default |
|------|---------|
| `service.module.enabled` | off until GA |
| `service.field.gps` | on |
| `service.repair.kanban` | on |
| `service.ai.assistant` | off until AI tools registered |

---

## Documentation Package

| File | Step |
|------|------|
| [SERVICE_MODULE_MASTER_PLAN.md](./SERVICE_MODULE_MASTER_PLAN.md) | SSOT |
| [SERVICE_MODULE_ARCHITECTURE.md](./SERVICE_MODULE_ARCHITECTURE.md) | 01 |
| [SERVICE_DATABASE_ARCHITECTURE.md](./SERVICE_DATABASE_ARCHITECTURE.md) | 02 |
| [SERVICE_API_ARCHITECTURE.md](./SERVICE_API_ARCHITECTURE.md) | 03 |
| [SERVICE_PERMISSIONS.md](./SERVICE_PERMISSIONS.md) | 04 |
| [SERVICE_WORKFLOW_ARCHITECTURE.md](./SERVICE_WORKFLOW_ARCHITECTURE.md) | 05 |
| [SERVICE_UI_ARCHITECTURE.md](./SERVICE_UI_ARCHITECTURE.md) | 06 |
| [SERVICE_AI_ARCHITECTURE.md](./SERVICE_AI_ARCHITECTURE.md) | 18 planning |

---

## Change History

| Date | Change |
|------|--------|
| 2026-06-21 | v1.0.0-planning — Initial manifest |
