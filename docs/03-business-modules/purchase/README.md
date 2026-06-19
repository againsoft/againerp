# Purchase — Module Overview

> **Module ID:** `purchase` · **Status:** Draft · **Route:** `/purchase/*` · **API:** `/api/v1/purchase/` · **Tables:** `purchase_*`

## Purpose
Purchase module documentation home.

## When To Read
Read first when entering the Purchase module docs folder.

## Related Files
- [Architecture](PURCHASE_MODULE_ARCHITECTURE.md)

## Read Next
- [Architecture](PURCHASE_MODULE_ARCHITECTURE.md)

---

Single entry point for **Purchase** documentation. Procurement — RFQ, purchase orders, receipts, vendor bills.

## When To Read

Read this file first for any **Purchase** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- RFQ and vendor quotations
- Purchase orders and approvals
- Goods receipt and vendor bills
- Vendor management via Core contacts / Business Partners

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core + Catalog + Inventory + Contacts |
| **Provides to** | Inventory (receipts), Finance (bills) |
| **Consumes from** | Catalog, Inventory, Contacts, Business Partners (optional) |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | `purchase.order.created`, `purchase.receipt.posted`, `purchase.bill.posted` |
| **Consumes** | `inventory.reorder.suggested`, `core.approval.approved`, `finance.payment.posted` |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [PURCHASE_MODULE_ARCHITECTURE.md](PURCHASE_MODULE_ARCHITECTURE.md) | Enterprise Purchase architecture (authoritative) |
| [Architecture.md](Architecture.md) | Full module architecture — open only for deep design |
| [ENTITY_PURCHASE.md](ENTITY_PURCHASE.md) | Supporting doc — open only if task requires it |
| [PURCHASE_WORKFLOW.md](PURCHASE_WORKFLOW.md) | Supporting doc — open only if task requires it |
| [UI prototype](../../04-uiux/prototype/purchase/) | Building admin UI screens in `apps/web/` |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines

## Read Next

1. [PURCHASE_MODULE_ARCHITECTURE.md](PURCHASE_MODULE_ARCHITECTURE.md) — if you need architecture depth
2. One row from Documentation Map for your task (Database / API / UI / one Menu file)
3. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** Purchase Team · **Doc path:** `docs/03-business-modules/purchase/`
