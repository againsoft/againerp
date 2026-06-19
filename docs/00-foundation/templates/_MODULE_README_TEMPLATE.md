# {Module} — Module Overview

> **Module ID:** `{module}` · **Status:** Draft · **Package:** 0/11 · **Route:** `/{route}/*` · **API:** `{api_path}` · **Tables:** `{prefix}_*`

## Purpose

Single entry point for **{Module}** documentation. _One sentence: what this module does on the platform._

## When To Read

Read this file first for any **{Module}** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc per [AI Reading Policy](../../BRAIN.md#ai-reading-policy).

## Features

- _Capability 1_
- _Capability 2_
- _Capability 3_

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core · _list modules via services only_ |
| **Provides to** | _Downstream modules_ |
| **Consumes from** | _Events / services consumed_ |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | `{module}.*` |
| **Consumes** | `core.*` · _other subscribed events_ |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [Architecture.md](Architecture.md) | Module boundaries, integration, domain model (Level 4) |
| [ModuleManifest.md](ModuleManifest.md) | Install manifest and service dependencies |
| [Database.md](Database.md) | Owned tables and schema — DB or migration work only |
| [API.md](API.md) | REST endpoints — backend/API work only |
| [Workflow.md](Workflow.md) | Business workflows and state machines |
| [Permissions.md](Permissions.md) | RBAC namespace and record rules |
| [UI.md](UI.md) | Admin navigation and screen inventory |
| [AI.md](AI.md) | AI tools index — open ONE linked screen spec |
| [Reports.md](Reports.md) | Report catalog — open ONE linked screen spec |
| [CHANGELOG.md](CHANGELOG.md) | Module documentation change history |
| [Menus/](Menus/) | Screen specs — open ONE file for the screen you implement |
| [UI prototype](../../04-uiux/prototype/{module}/) | Building admin UI in `apps/web/` |

_Add deep-dive rows only when a separate architecture file exists — do not duplicate Level 4 content._

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines

## Read Next

1. [Architecture.md](Architecture.md) — always after README for module work
2. One Level 5 file from Documentation Map matching your task type
3. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** {team} · **Doc path:** `docs/03-business-modules/{module}/`
