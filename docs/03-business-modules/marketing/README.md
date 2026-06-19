# Marketing — Module Overview

> **Module ID:** `marketing` · **Status:** Draft · **Route:** `/marketing/*` · **API:** `/api/v1/marketing/` · **Tables:** `marketing_*`

## Purpose

Single entry point for **Marketing** documentation. Marketing automation — campaigns, journeys, audiences, loyalty (standalone module at `/marketing/*`).

## When To Read

Read this file first for any **Marketing** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Campaigns, email/SMS/push
- Audiences and segmentation
- Journeys, coupons, loyalty programs
- AI content and churn insights

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core + Contacts + Media + Catalog (service) |
| **Provides to** | CRM, Sales, Ecommerce promotions |
| **Consumes from** | Catalog, CRM segments, Commerce order events |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | `marketing.campaign.*`, `marketing.coupon.*`, `marketing.loyalty.*` |
| **Consumes** | `catalog.product.published`, `crm.contact.updated`, `commerce.order.*` |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [MARKETING_MODULE_ARCHITECTURE.md](MARKETING_MODULE_ARCHITECTURE.md) | Enterprise Marketing architecture (authoritative) |
| [UI prototype](../../04-uiux/prototype/marketing/) | Building admin UI screens in `apps/web/` |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines

## Read Next

1. [MARKETING_MODULE_ARCHITECTURE.md](MARKETING_MODULE_ARCHITECTURE.md) — if you need architecture depth
2. One row from Documentation Map for your task (Database / API / UI / one Menu file)
3. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** Marketing Team · **Doc path:** `docs/03-business-modules/marketing/`
