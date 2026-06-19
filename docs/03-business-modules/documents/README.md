# Documents — Module Overview

> **Module ID:** `documents` · **Status:** Draft · **Route:** `/documents/*` · **API:** `/api/v1/documents/` · **Tables:** `documents_*`

## Purpose
Documents module documentation home.

## When To Read
Read first when entering the Documents module docs folder.

## Related Files
- [Architecture](Architecture.md)

## Read Next
- [Architecture](Architecture.md)

---

Single entry point for **Documents** documentation. Document management — versions, sharing, DMS.

## When To Read

Read this file first for any **Documents** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Folders and versions
- Sharing and permissions
- Attachments bridge to Core media

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core Media + Permissions |
| **Provides to** | All modules |
| **Consumes from** | Core Media |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | Document version and share events |
| **Consumes** | Core media events |

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

**Maintainer:** Documents Team · **Doc path:** `docs/03-business-modules/documents/`
