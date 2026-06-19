# Booking — Module Overview

> **Module ID:** `booking` · **Status:** Draft · **Route:** `/booking/*` · **API:** `/api/v1/booking/` · **Tables:** `booking_*`

## Purpose
Booking module documentation home.

## When To Read
Read first when entering the Booking module docs folder.

## Related Files
- [Architecture](Architecture.md)

## Read Next
- [Architecture](Architecture.md)

---

Single entry point for **Booking** documentation. Appointments, resources, and calendars.

## When To Read

Read this file first for any **Booking** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Resource booking
- Calendars and availability
- Notifications

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core + Contacts + Notifications |
| **Provides to** | CRM, Helpdesk |
| **Consumes from** | Contacts |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | Booking confirmation events |
| **Consumes** | Contact created |

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

**Maintainer:** Booking Team · **Doc path:** `docs/03-business-modules/booking/`
