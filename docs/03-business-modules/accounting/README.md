# Accounting — Module Overview

> **Module ID:** `accounting` · **Status:** Draft · **Route:** `/accounting/*` · **API:** `/api/v1/accounting/` · **Tables:** `accounting_*`

## Purpose
Accounting module documentation home.

## When To Read
Read first when entering the Accounting module docs folder.

## Related Files
- [Architecture](Architecture.md)

## Read Next
- [Architecture](Architecture.md)

---

Single entry point for **Accounting** documentation. Chart of accounts, journals, and statutory accounting.

## When To Read

Read this file first for any **Accounting** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Chart of accounts
- Journal entries
- Financial statements

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core + Finance |
| **Provides to** | Finance, compliance reporting |
| **Consumes from** | Finance posting events |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | Accounting period and journal events (see Architecture) |
| **Consumes** | Finance posting events |

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

**Maintainer:** Accounting Team · **Doc path:** `docs/03-business-modules/accounting/`
