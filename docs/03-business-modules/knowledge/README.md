# Knowledge Base — Module Overview

> **Module ID:** `knowledge` · **Status:** Draft · **Route:** `/knowledge/*` · **API:** `/api/v1/knowledge/` · **Tables:** `knowledge_*`

## Purpose
Knowledge module documentation home.

## When To Read
Read first when entering the Knowledge module docs folder.

## Related Files
- [Architecture](Architecture.md)

## Read Next
- [Architecture](Architecture.md)

---

Single entry point for **Knowledge Base** documentation. KB articles, categories, and search.

## When To Read

Read this file first for any **Knowledge Base** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Articles and categories
- Search and feedback
- Helpdesk integration

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core + Search |
| **Provides to** | Helpdesk, Storefront |
| **Consumes from** | Core Search |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | Article publish events |
| **Consumes** | Helpdesk ticket events |

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

**Maintainer:** Knowledge Base Team · **Doc path:** `docs/03-business-modules/knowledge/`
