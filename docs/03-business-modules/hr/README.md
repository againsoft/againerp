# Human Resources — Module Overview

> **Module ID:** `hr` · **Status:** Draft · **Route:** `/hr/*` · **API:** `/api/v1/hr/` · **Tables:** `hr_*`

## Purpose
HR module documentation home.

## When To Read
Read first when entering the HR module docs folder.

## Related Files
- [Architecture](Architecture.md)

## Read Next
- [Architecture](Architecture.md)

---

Single entry point for **Human Resources** documentation. Employees, org structure, attendance, leave, and workforce lifecycle.

## When To Read

Read this file first for any **Human Resources** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Employee records and org chart
- Attendance and leave
- Recruitment and onboarding

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core (Contacts, Users, Permissions, Workflow) |
| **Provides to** | Payroll, Project, Timesheet |
| **Consumes from** | Core Contacts (person identity) |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | HR workforce events (see HR master architecture) |
| **Consumes** | Core user and contact events |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [Architecture.md](Architecture.md) | Full module architecture — open only for deep design |
| [UI prototype](../../04-uiux/prototype/) | Building admin UI screens in `apps/web/` |
| [HR & Payroll master](../hr-payroll/HR_PAYROLL_MASTER_ARCHITECTURE.md) | Cross-cutting HR/Payroll architecture |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines

## Read Next

1. [Architecture.md](Architecture.md) — if you need architecture depth
2. One row from Documentation Map for your task (Database / API / UI / one Menu file)
3. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** Human Resources Team · **Doc path:** `docs/03-business-modules/hr/`
