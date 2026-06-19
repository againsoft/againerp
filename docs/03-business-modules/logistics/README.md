# Logistics — Module Overview

> **Module ID:** `logistics` · **Status:** Draft · **Route:** `/logistics/*` · **API:** `/api/v1/logistics/` · **Tables:** `logistics_*`

## Purpose
Logistics module documentation home.

## When To Read
Read first when entering the Logistics module docs folder.

## Related Files
- [Architecture](Architecture.md)

## Read Next
- [Architecture](Architecture.md)

---

Single entry point for **Logistics** documentation. Shipments, carriers, tracking, and delivery.

## When To Read

Read this file first for any **Logistics** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Shipments and carriers
- Tracking integrations
- Delivery status

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core + Inventory + Sales |
| **Provides to** | Sales, Ecommerce fulfillment |
| **Consumes from** | Sales shipments, Inventory |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | Shipment status events |
| **Consumes** | Sales shipment created |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Full module architecture — open only for deep design |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines

## Read Next

1. [ARCHITECTURE.md](ARCHITECTURE.md) — if you need architecture depth
2. One row from Documentation Map for your task (Database / API / UI / one Menu file)
3. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** Logistics Team · **Doc path:** `docs/03-business-modules/logistics/`
