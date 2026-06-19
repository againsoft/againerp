# Product Configurator — Module Overview

> **Module ID:** `product-configurator` · **Status:** Draft · **Route:** `/product-configurator/*` · **API:** `/api/v1/product-configurator/` · **Tables:** `pc_*`

## Purpose

Single entry point for **Product Configurator** documentation. Configurable products, PC builder, compatibility rules, and wizard UX.

## When To Read

Read this file first for any **Product Configurator** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Component attributes
- Compatibility engine
- PC builder wizard
- ERP integration

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core + Catalog |
| **Provides to** | Catalog, Sales, Ecommerce |
| **Consumes from** | Catalog product master |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | Configuration and BOM events (see Architecture) |
| **Consumes** | Catalog product events |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [Architecture.md](Architecture.md) | Full module architecture — open only for deep design |
| [ADMIN_PANEL.md](ADMIN_PANEL.md) | Supporting doc — open only if task requires it |
| [AI_PC_BUILDER_ASSISTANT.md](AI_PC_BUILDER_ASSISTANT.md) | Supporting doc — open only if task requires it |
| [AI_WIZARD_BUILDER.md](AI_WIZARD_BUILDER.md) | Supporting doc — open only if task requires it |
| [API.md](API.md) | REST endpoints — backend/API work only |
| [COMPATIBILITY_ENGINE.md](COMPATIBILITY_ENGINE.md) | Supporting doc — open only if task requires it |
| [COMPONENT_ATTRIBUTE_ENGINE.md](COMPONENT_ATTRIBUTE_ENGINE.md) | Supporting doc — open only if task requires it |
| [Database.md](Database.md) | Owned tables and schema — DB or migration work only |
| [ERP_INTEGRATION.md](ERP_INTEGRATION.md) | Supporting doc — open only if task requires it |
| [ModuleManifest.md](ModuleManifest.md) | Install manifest and service dependencies |
| [PC_BUILDER_WIZARD.md](PC_BUILDER_WIZARD.md) | Supporting doc — open only if task requires it |
| [PREMIUM_UX_PLAN.md](PREMIUM_UX_PLAN.md) | Supporting doc — open only if task requires it |
| [Permissions.md](Permissions.md) | RBAC namespace and record rules |
| [SMART_RECOMMENDATION_ENGINE.md](SMART_RECOMMENDATION_ENGINE.md) | Supporting doc — open only if task requires it |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines

## Read Next

1. [Architecture.md](Architecture.md) — if you need architecture depth
2. One row from Documentation Map for your task (Database / API / UI / one Menu file)
3. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** Product Configurator Team · **Doc path:** `docs/03-business-modules/product-configurator/`
