# Marketplace — Module Overview

> **Module ID:** `marketplace` · **Status:** Draft · **Route:** `/marketplace/*` · **API:** `/api/v1/marketplace/` · **Tables:** `marketplace_*`

## Purpose
Marketplace module documentation home.

## When To Read
Read first when entering the Marketplace module docs folder.

## Related Files
- [Architecture](Architecture.md)

## Read Next
- [Architecture](Architecture.md)

---

Single entry point for **Marketplace** documentation. Multi-vendor marketplace on Ecommerce spine.

## When To Read

Read this file first for any **Marketplace** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Vendor storefronts
- Commission and payouts
- Catalog federation

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core + Ecommerce + Business Partners |
| **Provides to** | Ecommerce catalog and orders |
| **Consumes from** | Ecommerce, Partners |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | Marketplace vendor and order events |
| **Consumes** | Commerce order events |

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

**Maintainer:** Marketplace Team · **Doc path:** `docs/03-business-modules/marketplace/`
