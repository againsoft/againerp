# Sales & Marketing Workspace — Module Overview

> **Module ID:** `sales-marketing` · **Status:** Draft (UI phase) · **Route:** `/sales-marketing/*` · **API:** `/api/v1/sales-marketing/` · **Tables:** `smw_*`

## Purpose
Sales Marketing module documentation home.

## When To Read
Read first when entering the Sales Marketing module docs folder.

## Related Files
- [Architecture](../../06-ai/platform/ai/Architecture.md)

## Read Next
- [Architecture](../../06-ai/platform/ai/Architecture.md)

---

Single entry point for **Sales & Marketing Workspace** documentation. Unified RevOps UI — leads, pipeline, quotations, campaigns, commission (prototype workspace).

## When To Read

Read this file first for any **Sales & Marketing Workspace** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Leads and opportunity pipeline
- Quotations and sales activities
- Campaigns and targets
- Commission and RevOps reporting

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | CRM, Sales, Marketing (services) + Core |
| **Provides to** | Revenue operations UI shell |
| **Consumes from** | CRM, Sales, Marketing APIs |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | Workspace-level events TBD — see UI build guide |
| **Consumes** | CRM and Sales domain events |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [SMW_UI_BUILD_GUIDE.md](SMW_UI_BUILD_GUIDE.md) | UI prototype build guide — screen implementation |
| [ui-design/](ui-design/) | UI design specs — open ONE screen design |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines

## Read Next

1. [SMW_UI_BUILD_GUIDE.md](SMW_UI_BUILD_GUIDE.md) — if you need architecture depth
2. One row from Documentation Map for your task (Database / API / UI / one Menu file)
3. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** Sales & Marketing Workspace Team · **Doc path:** `docs/03-business-modules/sales-marketing/`
