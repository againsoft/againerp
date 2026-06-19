# Ecommerce — Module Overview

> **Module ID:** `ecommerce` · **Status:** Active · **Package:** 11/11 · **Route:** `/catalog/* (admin), (storefront)/` · **API:** `/api/v1/commerce/` · **Tables:** `catalog_* · commerce_*`

## Purpose

Single entry point for **Ecommerce** documentation. Commerce hub — catalog admin, orders, customers, storefront, 167 admin screens (**Active**).

## When To Read

Read this file first for any **Ecommerce** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Catalog, orders, customers, inventory views
- Storefront and checkout
- SEO, Builder, Marketing (commerce scope), Media, Reports
- AI commerce tools

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core + Inventory + Sales (services) |
| **Provides to** | Storefront, Marketplace, Marketing promotions |
| **Consumes from** | Inventory stock levels, Sales order sync |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | `catalog.*`, `commerce.order.*` |
| **Consumes** | Core approval, inventory updates |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [Architecture.md](Architecture.md) | Full module architecture — open only for deep design |
| [ModuleManifest.md](ModuleManifest.md) | Install manifest and service dependencies |
| [Database.md](Database.md) | Owned tables and schema — DB or migration work only |
| [API.md](API.md) | REST endpoints — backend/API work only |
| [Workflow.md](Workflow.md) | Business workflows and state machines |
| [Permissions.md](Permissions.md) | RBAC namespace and record rules |
| [UI.md](UI.md) | Admin navigation and screen inventory |
| [AI.md](AI.md) | Commerce AI tools — open ONE linked screen spec |
| [Reports.md](Reports.md) | Report catalog — open ONE linked screen spec |
| [CHANGELOG.md](CHANGELOG.md) | Ecommerce documentation change history |
| [ECOMMERCE_STOREFRONT_ARCHITECTURE.md](ECOMMERCE_STOREFRONT_ARCHITECTURE.md) | Storefront routes and customer shop (deep dive) |
| [URL_SLUG_ARCHITECTURE.md](URL_SLUG_ARCHITECTURE.md) | URL slug rules (deep dive) |
| [Development.md](Development.md) | Implementation notes |
| [MENU_STRUCTURE.md](MENU_STRUCTURE.md) | Full menu tree reference |
| [Roadmap.md](Roadmap.md) | Planned features |
| [Menus/](Menus/) | Screen specs — open ONE file for the screen you implement |
| [UI prototype](../../04-uiux/prototype/) | Building admin UI screens in `apps/web/` |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines
- [Ecommerce sub-areas](#ecommerce-sub-areas) — SEO, Builder, Catalog (below)

## Read Next

1. One row from Documentation Map for your task (Architecture / Database / API / UI / AI / Reports / one Menu file)
2. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** Ecommerce Team · **Doc path:** `docs/03-business-modules/ecommerce/`


## Ecommerce Sub-Areas

Documentation views inside Ecommerce — each has its own README entry point:

| Area | Entry | Route menus |
|------|-------|-------------|
| **SEO (Ecommerce)** | [seo/README.md](seo/README.md) | `../Menus/SEO/` |
| **Builder (Ecommerce)** | [builder/README.md](builder/README.md) | `../Menus/Builder/` |
| **Catalog (Ecommerce)** | [catalog/README.md](catalog/README.md) | `../Menus/Catalog/` |
| **Marketing (Ecommerce scope)** | [marketing/README.md](marketing/README.md) | `../Menus/Marketing/` |
