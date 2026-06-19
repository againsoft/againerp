# Subscription — Module Overview

> **Module ID:** `subscription` · **Status:** Draft · **Route:** `Platform admin` · **API:** `/api/v1/subscription/` · **Tables:** `subscription_*`

## Purpose
Subscription module documentation home.

## When To Read
Read first when entering the Subscription module docs folder.

## Related Files
- [Architecture](Architecture.md)

## Read Next
- [Architecture](Architecture.md)

---

Single entry point for **Subscription** documentation. SaaS subscription and billing module.

## When To Read

Read this file first for any **Subscription** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Plans and entitlements
- Billing cycles
- Usage metering

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core Platform + SaaS layer |
| **Provides to** | Platform tenant provisioning |
| **Consumes from** | Platform tenant events |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | Subscription lifecycle events |
| **Consumes** | Platform plan changed |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Full module architecture — open only for deep design |
| [UI prototype](../../04-uiux/prototype/07-saas/) | Building admin UI screens in `apps/web/` |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines

## Read Next

1. [ARCHITECTURE.md](ARCHITECTURE.md) — if you need architecture depth
2. One row from Documentation Map for your task (Database / API / UI / one Menu file)
3. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** Subscription Team · **Doc path:** `docs/03-business-modules/subscription/`
