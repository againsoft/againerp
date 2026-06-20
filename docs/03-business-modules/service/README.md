# Service — Module Overview

> **Module ID:** `service` · **Status:** Planning Phase · **Route:** `/service/*` · **API:** `/api/v1/service/` · **Tables:** `service_*`

## Purpose

Single entry point for **Service Operations** documentation — unified platform for repair shops, field service, AMC, subscriptions, and mixed product+service billing.

## When To Read

Read this file first for any **Service** task. Use the Documentation Map below — do not bulk-scan the folder.

## Features

- Service catalog (fixed, hourly, project, contract, subscription)
- Customer asset registry and service history
- Service orders and technician work orders
- Repair workflow and parts consumption
- Scheduling, dispatch, and SLA
- AMC / contract and subscription lifecycle
- Mixed billing integration with Sales and Finance

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core (Contacts, Workflow, Approval, Activity, Media) + Catalog (optional products on same invoice) |
| **Provides to** | CRM, Sales, Finance, Inventory, Helpdesk, Project |
| **Consumes from** | `ContactService`, `CatalogService`, `InventoryService`, `SalesService`, `FinanceService`, `HR` (technicians), optional `BookingService`, `ProjectService`, `TimesheetService` |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | `service.order.*`, `service.work_order.*`, `service.contract.*`, `service.subscription.*`, `service.sla.breached` |
| **Consumes** | `sales.order.confirmed`, `inventory.stock.reserved`, `finance.invoice.posted`, `helpdesk.ticket.escalated` |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [SERVICE_MODULE_MASTER_PLAN.md](SERVICE_MODULE_MASTER_PLAN.md) | SSOT vision, goals, roadmap (Steps 01–22) |
| [SERVICE_MODULE_ARCHITECTURE.md](SERVICE_MODULE_ARCHITECTURE.md) | Enterprise architecture — **start here for STEP 01** |
| [SERVICE_DATABASE_ARCHITECTURE.md](SERVICE_DATABASE_ARCHITECTURE.md) | Tables, ERD, indexes, multi-tenant (STEP 02) |
| [SERVICE_API_ARCHITECTURE.md](SERVICE_API_ARCHITECTURE.md) | REST API design (STEP 03) |
| [SERVICE_WORKFLOW_ARCHITECTURE.md](SERVICE_WORKFLOW_ARCHITECTURE.md) | User & business flows (STEP 04) |
| [SERVICE_PERMISSIONS.md](SERVICE_PERMISSIONS.md) | RBAC matrix (STEP 04) |
| [SERVICE_UI_ARCHITECTURE.md](SERVICE_UI_ARCHITECTURE.md) | UI/UX architecture (STEP 06) |
| [SERVICE_AI_ARCHITECTURE.md](SERVICE_AI_ARCHITECTURE.md) | AI assistant tools (STEP 18 planning) |
| [ModuleManifest.md](ModuleManifest.md) | Install registry and declared dependencies |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md)
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md)
- [Pre-code gate](../../00-foundation/PRE_CODE_GATE.md)

## Read Next

1. [SERVICE_MODULE_MASTER_PLAN.md](SERVICE_MODULE_MASTER_PLAN.md) — scope and roadmap
2. [SERVICE_MODULE_ARCHITECTURE.md](SERVICE_MODULE_ARCHITECTURE.md) — architecture depth
3. One task-specific doc from the map above
4. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** Service Team · **Doc path:** `docs/03-business-modules/service/`
