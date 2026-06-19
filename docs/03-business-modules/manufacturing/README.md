# Manufacturing — Module Overview

> **Module ID:** `manufacturing` · **Status:** Draft · **Route:** `/manufacturing/*` · **API:** `/api/v1/manufacturing/` · **Tables:** `manufacturing_*`

## Purpose
Manufacturing module documentation home.

## When To Read
Read first when entering the Manufacturing module docs folder.

## Related Files
- [Architecture](Architecture.md)

## Read Next
- [Architecture](Architecture.md)

---

Single entry point for **Manufacturing** documentation. BOM, routings, work orders, MRP, and production.

## When To Read

Read this file first for any **Manufacturing** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- BOM and routings
- Work orders and shop floor
- MRP and production planning

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core + Inventory + Catalog + Purchase |
| **Provides to** | Inventory (finished goods movements) |
| **Consumes from** | Inventory, Catalog, Purchase |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | Manufacturing order and consumption events (see Architecture) |
| **Consumes** | Inventory and purchase events |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Full module architecture — open only for deep design |
| [UI prototype](../../04-uiux/prototype/manufacturing/) | Building admin UI screens in `apps/web/` |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines

## Read Next

1. [ARCHITECTURE.md](ARCHITECTURE.md) — if you need architecture depth
2. One row from Documentation Map for your task (Database / API / UI / one Menu file)
3. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** Manufacturing Team · **Doc path:** `docs/03-business-modules/manufacturing/`
