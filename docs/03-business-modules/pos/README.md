# Point of Sale — Module Overview

> **Module ID:** `pos` · **Status:** Draft · **Route:** `/pos/*` · **API:** `/api/v1/pos/` · **Tables:** `pos_*`

## Purpose
POS module documentation home.

## When To Read
Read first when entering the POS module docs folder.

## Related Files
- [Architecture](Architecture.md)

## Read Next
- [Architecture](Architecture.md)

---

Single entry point for **Point of Sale** documentation. Retail POS sessions, cart, payments, and receipts.

## When To Read

Read this file first for any **Point of Sale** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- POS sessions and registers
- Offline-capable cart
- Receipts and cash management

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core + Sales + Inventory + Catalog |
| **Provides to** | Sales, Inventory |
| **Consumes from** | Catalog, Inventory, Sales services |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | POS order and payment events (see Architecture) |
| **Consumes** | Inventory stock updates |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [Architecture.md](Architecture.md) | Full module architecture — open only for deep design |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines

## Read Next

1. [Architecture.md](Architecture.md) — if you need architecture depth
2. One row from Documentation Map for your task (Database / API / UI / one Menu file)
3. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** Point of Sale Team · **Doc path:** `docs/03-business-modules/pos/`
