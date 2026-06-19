# Helpdesk — Module Overview

> **Module ID:** `helpdesk` · **Status:** Draft · **Route:** `/helpdesk/*` · **API:** `/api/v1/helpdesk/` · **Tables:** `helpdesk_*`

## Purpose
Helpdesk module documentation home.

## When To Read
Read first when entering the Helpdesk module docs folder.

## Related Files
- [Architecture](Architecture.md)

## Read Next
- [Architecture](Architecture.md)

---

Single entry point for **Helpdesk** documentation. Tickets, SLAs, and customer support.

## When To Read

Read this file first for any **Helpdesk** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Ticket queues
- SLA policies
- Knowledge base link

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core + CRM + Contacts |
| **Provides to** | CRM, Knowledge |
| **Consumes from** | Contacts, CRM accounts |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | Ticket lifecycle events |
| **Consumes** | CRM contact events |

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

**Maintainer:** Helpdesk Team · **Doc path:** `docs/03-business-modules/helpdesk/`
