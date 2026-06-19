# CRM — Module Overview

> **Module ID:** `crm` · **Status:** Draft · **Route:** `/crm/*` · **API:** `/api/v1/crm/` · **Tables:** `crm_*`

## Purpose
CRM module documentation home.

## When To Read
Read first when entering the CRM module docs folder.

## Related Files
- [Architecture](CRM_MODULE_ARCHITECTURE.md)

## Read Next
- [Architecture](CRM_MODULE_ARCHITECTURE.md)

---

Single entry point for **CRM** documentation. AI-first Customer Intelligence — leads, accounts, opportunities, pipeline, and customer 360.

## When To Read

Read this file first for any **CRM** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Lead capture, scoring, assignment, conversion
- Accounts, contacts, opportunities, pipelines
- Activities, tasks, meetings, calls, timeline
- Customer intelligence dashboards and AI insights
- Integration with Sales, Marketing, Ecommerce, AI OS

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core (Users, Permissions, Contacts, Activities, Workflow, Search, Notifications) |
| **Provides to** | Sales (conversion), Marketing (segments) |
| **Consumes from** | Sales (order history), Marketing (campaign response), Core Contacts |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | `crm.lead.*`, `crm.opportunity.*`, `crm.account.updated` |
| **Consumes** | `core.contact.created`, `commerce.order.paid`, `marketing.campaign.clicked`, `sales.order.confirmed` |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [CRM_MODULE_ARCHITECTURE.md](CRM_MODULE_ARCHITECTURE.md) | Enterprise CRM architecture (authoritative) |
| [Architecture.md](Architecture.md) | Full module architecture — open only for deep design |
| [UI prototype](../../04-uiux/prototype/crm/) | Building admin UI screens in `apps/web/` |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines

## Read Next

1. [CRM_MODULE_ARCHITECTURE.md](CRM_MODULE_ARCHITECTURE.md) — if you need architecture depth
2. One row from Documentation Map for your task (Database / API / UI / one Menu file)
3. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** CRM Team · **Doc path:** `docs/03-business-modules/crm/`
