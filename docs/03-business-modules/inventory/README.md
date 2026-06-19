# Inventory — Module Overview

> **Module ID:** `inventory` · **Status:** Draft · **Route:** `/inventory/*` · **API:** `/api/v1/inventory/` · **Tables:** `inventory_*`

## Purpose

Single entry point for **Inventory** documentation. Stock truth layer — warehouses, movements, reservations, adjustments (independent of Ecommerce UI).

## When To Read

Read this file first for any **Inventory** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Warehouses, locations, stock ledger
- Receipts, deliveries, internal transfers
- Reservations, adjustments, reorder rules
- Multi-warehouse availability for Sales, Catalog, Manufacturing

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core + Catalog (variant refs via services) |
| **Provides to** | Catalog, Sales, Purchase, Finance, Manufacturing |
| **Consumes from** | Catalog, Purchase receipts, Sales order lines |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | `inventory.movement.posted`, `inventory.stock_level.updated`, `inventory.reservation.*` |
| **Consumes** | `catalog.product.published`, `purchase.receipt.posted`, `sales.order.confirmed` |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [INVENTORY_MODULE_ARCHITECTURE.md](INVENTORY_MODULE_ARCHITECTURE.md) | Enterprise Inventory architecture (authoritative) |
| [ENTITY_INVENTORY.md](ENTITY_INVENTORY.md) | Supporting doc — open only if task requires it |
| [INVENTORY_WORKFLOW.md](INVENTORY_WORKFLOW.md) | Supporting doc — open only if task requires it |
| [UI prototype](../../04-uiux/prototype/inventory/) | Building admin UI screens in `apps/web/` |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines

## Read Next

1. [INVENTORY_MODULE_ARCHITECTURE.md](INVENTORY_MODULE_ARCHITECTURE.md) — if you need architecture depth
2. One row from Documentation Map for your task (Database / API / UI / one Menu file)
3. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** Inventory Team · **Doc path:** `docs/03-business-modules/inventory/`
