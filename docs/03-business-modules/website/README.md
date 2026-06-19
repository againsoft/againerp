# Website — Module Overview

> **Module ID:** `website` · **Status:** Active · **Package:** 11/11 · **Route:** `/website/*` · **API:** `/api/v1/website/` · **Tables:** `website_*`

## Purpose

Single entry point for **Website** documentation. Company website builder — pages, blog, portfolio, team, contact, and domain management for any business type without requiring Ecommerce.

## When To Read

Read this file first for any **Website** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Drag-and-drop page builder (corporate templates)
- Blog & content management
- Portfolio & case studies
- Team & careers pages
- Contact forms & lead capture
- Domain & hosting management
- SEO for company-level pages
- AI content generation

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core (Users, Contacts, Media) |
| **Provides to** | Ecommerce (shared pages), Marketing (lead forms), CRM (form-to-lead) |
| **Consumes from** | Core Media Library, Core Contacts (form submissions) |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | `website.page.published`, `website.form.submitted`, `website.lead.captured` |
| **Consumes** | Core media upload, Core approval |

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
| [AI.md](AI.md) | Website AI tools — content generation, SEO |
| [Reports.md](Reports.md) | Report catalog — traffic, leads, performance |
| [CHANGELOG.md](CHANGELOG.md) | Website module documentation change history |
| [MENU_STRUCTURE.md](MENU_STRUCTURE.md) | Full menu tree reference |
| [Menus/](Menus/) | Screen specs — open ONE file for the screen you implement |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines
- [Ecommerce module](../ecommerce/README.md) — companion commerce module

## Read Next

1. One row from Documentation Map for your task (Architecture / Database / API / UI / AI / Reports / one Menu file)
2. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** Website Team · **Doc path:** `docs/03-business-modules/website/` · **Last Updated:** 2026-06-19
