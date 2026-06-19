# Sales — Module Overview

> **Module ID:** `sales` · **Status:** Draft · **Route:** `/sales/*` · **API:** `/api/v1/sales/` · **Tables:** `sales_*`

## Purpose
Sales module documentation home.

## When To Read
Read first when entering the Sales module docs folder.

## Related Files
- [Architecture](SALES_MODULE_ARCHITECTURE.md)

## Read Next
- [Architecture](SALES_MODULE_ARCHITECTURE.md)

---

Single entry point for **Sales** documentation. Quotations, sales orders, delivery, invoicing, and revenue documents.

## When To Read

Read this file first for any **Sales** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Quotations and sales orders
- Delivery, invoicing, payments, returns
- Pricing, discounts, sales teams
- Order history for CRM and Marketing attribution

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core + Catalog + Inventory + CRM (services) |
| **Provides to** | Finance, Inventory, CRM, Marketing |
| **Consumes from** | Catalog, Inventory, CRM, Core Contacts |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | `sales.quotation.sent`, `sales.order.confirmed`, `sales.invoice.posted`, `sales.payment.received` |
| **Consumes** | `crm.lead.converted`, `crm.opportunity.won`, `commerce.order.placed`, `inventory.stock_level.updated` |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [SALES_MODULE_ARCHITECTURE.md](SALES_MODULE_ARCHITECTURE.md) | Enterprise Sales architecture (authoritative) |
| [Architecture.md](Architecture.md) | Full module architecture — open only for deep design |
| [ENTITY_SALES.md](ENTITY_SALES.md) | Supporting doc — open only if task requires it |
| [SALES_WORKFLOW.md](SALES_WORKFLOW.md) | Supporting doc — open only if task requires it |
| [UI prototype](../../04-uiux/prototype/sales/) | Building admin UI screens in `apps/web/` |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines

## Read Next

1. [SALES_MODULE_ARCHITECTURE.md](SALES_MODULE_ARCHITECTURE.md) — if you need architecture depth
2. One row from Documentation Map for your task (Database / API / UI / one Menu file)
3. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** Sales Team · **Doc path:** `docs/03-business-modules/sales/`
