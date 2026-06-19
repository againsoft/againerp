# Business Partners — Module Overview

> **Module ID:** `business-partners` · **Status:** Draft · **Route:** `/partners/*` · **API:** `/api/v1/partners/` · **Tables:** `bp_*`

## Purpose
Business Partners module documentation home.

## When To Read
Read first when entering the Business Partners module docs folder.

## Related Files
- [Architecture](Architecture.md)
- [Manifest](ModuleManifest.md)

## Read Next
- [Architecture](Architecture.md)

---

Single entry point for **Business Partners** documentation. Commercial partner hub — vendors, distributors, channel partners.

## When To Read

Read this file first for any **Business Partners** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Partner roles and tiers
- Terms, credit, territories
- Onboarding and catalog mapping

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core Contacts + Catalog + Purchase/Sales |
| **Provides to** | Purchase, Sales, CRM, Catalog |
| **Consumes from** | Contacts, Catalog, Purchase/Sales KPIs (async) |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | `bp.partner.*`, `bp.onboarding.approved` |
| **Consumes** | `purchase.order.created`, `sales.order.confirmed` |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [Architecture.md](Architecture.md) | Full module architecture — open only for deep design |
| [API.md](API.md) | REST endpoints — backend/API work only |
| [Database.md](Database.md) | Owned tables and schema — DB or migration work only |
| [Development.md](Development.md) | Implementation notes |
| [INTEGRATION.md](INTEGRATION.md) | Cross-module integration contracts |
| [ModuleManifest.md](ModuleManifest.md) | Install manifest and service dependencies |
| [Permissions.md](Permissions.md) | RBAC namespace and record rules |
| [Roadmap.md](Roadmap.md) | Planned features |
| [Workflow.md](Workflow.md) | Business workflows and state machines |
| [UI prototype](../../04-uiux/prototype/business-partners/) | Building admin UI screens in `apps/web/` |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines

## Read Next

1. [Architecture.md](Architecture.md) — if you need architecture depth
2. One row from Documentation Map for your task (Database / API / UI / one Menu file)
3. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** Business Partners Team · **Doc path:** `docs/03-business-modules/business-partners/`
