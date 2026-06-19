# BI System — Module Overview

> **Module ID:** `bi-system` · **Status:** Draft · **Route:** `/bi/*` · **API:** `/api/v1/bi/` · **Tables:** `bi_*`

## Purpose
BI System module documentation home.

## When To Read
Read first when entering the BI System module docs folder.

## Related Files
- [Architecture](Architecture.md)

## Read Next
- [Architecture](Architecture.md)

---

Single entry point for **BI System** documentation. Dashboards, KPIs, drill-down analytics.

## When To Read

Read this file first for any **BI System** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Dashboards and widgets
- KPI definitions
- Drill-down to modules via APIs

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core + Data Warehouse (optional) |
| **Provides to** | Executive and module dashboards |
| **Consumes from** | Module read APIs and warehouse facts |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | Report subscription events |
| **Consumes** | Domain events for refresh |

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

**Maintainer:** BI System Team · **Doc path:** `docs/03-business-modules/bi-system/`
