# HR & Payroll (Master) — Module Overview

> **Module ID:** `hr-payroll` · **Status:** Draft · **Route:** `/hr/* · /payroll/* · /ess/*` · **API:** `/api/v1/hr/ · /api/v1/payroll/` · **Tables:** `hr_* · payroll_*`

## Purpose

Single entry point for **HR & Payroll (Master)** documentation. Unified workforce suite — master architecture spanning HR and Payroll domains.

## When To Read

Read this file first for any **HR & Payroll (Master)** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Workforce lifecycle hire-to-exit
- Time, attendance, leave, payroll
- ESS portal `/ess/*`
- Deep-dive subsystem architecture docs

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core (Contacts, Users, Workflow, Approvals, Activity) |
| **Provides to** | Project, Finance, Accounting |
| **Consumes from** | Core only (no cross-module DB) |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | HR and payroll domain events — see master doc §Events |
| **Consumes** | Core approval and contact events |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [HR_PAYROLL_MASTER_ARCHITECTURE.md](HR_PAYROLL_MASTER_ARCHITECTURE.md) | HR & Payroll master architecture (authoritative) |
| [HR_ACTIVITY_LOG_ARCHITECTURE.md](HR_ACTIVITY_LOG_ARCHITECTURE.md) | Supporting doc — open only if task requires it |
| [HR_AI_ASSISTANT_ARCHITECTURE.md](HR_AI_ASSISTANT_ARCHITECTURE.md) | Supporting doc — open only if task requires it |
| [HR_API_ARCHITECTURE.md](HR_API_ARCHITECTURE.md) | Supporting doc — open only if task requires it |
| [HR_AUTOMATION_ENGINE_ARCHITECTURE.md](HR_AUTOMATION_ENGINE_ARCHITECTURE.md) | Supporting doc — open only if task requires it |
| [HR_DASHBOARD_ARCHITECTURE.md](HR_DASHBOARD_ARCHITECTURE.md) | Supporting doc — open only if task requires it |
| [HR_DATABASE_ARCHITECTURE.md](HR_DATABASE_ARCHITECTURE.md) | Supporting doc — open only if task requires it |
| [HR_DATABASE_ERD_PLANNING.md](HR_DATABASE_ERD_PLANNING.md) | Supporting doc — open only if task requires it |
| [HR_FIGMA_WIREFRAME_BLUEPRINT.md](HR_FIGMA_WIREFRAME_BLUEPRINT.md) | Supporting doc — open only if task requires it |
| [HR_MODULE_MASTER_INDEX.md](HR_MODULE_MASTER_INDEX.md) | Supporting doc — open only if task requires it |
| [HR_NOTIFICATION_ARCHITECTURE.md](HR_NOTIFICATION_ARCHITECTURE.md) | Supporting doc — open only if task requires it |
| [HR_PERMISSION_MATRIX.md](HR_PERMISSION_MATRIX.md) | Supporting doc — open only if task requires it |
| [HR_REPORTING_ARCHITECTURE.md](HR_REPORTING_ARCHITECTURE.md) | Supporting doc — open only if task requires it |
| [HR_SCREEN_INVENTORY.md](HR_SCREEN_INVENTORY.md) | Supporting doc — open only if task requires it |
| [HR_UI_UX_BLUEPRINT.md](HR_UI_UX_BLUEPRINT.md) | Supporting doc — open only if task requires it |
| [HR_WORKFLOW_ARCHITECTURE.md](HR_WORKFLOW_ARCHITECTURE.md) | Supporting doc — open only if task requires it |
| [uiux/](uiux/) | HR UI architecture deep dives — open ONE topic |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines

## Read Next

1. [HR_PAYROLL_MASTER_ARCHITECTURE.md](HR_PAYROLL_MASTER_ARCHITECTURE.md) — if you need architecture depth
2. One row from Documentation Map for your task (Database / API / UI / one Menu file)
3. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** HR & Payroll (Master) Team · **Doc path:** `docs/03-business-modules/hr-payroll/`
