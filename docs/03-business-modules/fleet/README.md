# Fleet — Module Overview

> **Module ID:** `fleet` · **Status:** Draft · **Route:** `/fleet/*` · **API:** `/api/v1/fleet/` · **Tables:** `fleet_*`

## Purpose
Fleet module documentation home.

## When To Read
Read first when entering the Fleet module docs folder.

## Related Files
- [Architecture](Architecture.md)

## Read Next
- [Architecture](Architecture.md)

---

Single entry point for **Fleet** documentation. Vehicles, maintenance, fuel, and fleet operations.

## When To Read

Read this file first for any **Fleet** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Vehicle registry
- Maintenance schedules
- Fuel and cost tracking

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core |
| **Provides to** | Logistics, Finance |
| **Consumes from** | Core Contacts (drivers) |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | Fleet maintenance events |
| **Consumes** | Logistics trip events |

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

**Maintainer:** Fleet Team · **Doc path:** `docs/03-business-modules/fleet/`
