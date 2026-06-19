# Payroll — Module Overview

> **Module ID:** `payroll` · **Status:** Draft · **Route:** `/payroll/*` · **API:** `/api/v1/payroll/` · **Tables:** `payroll_*`

## Purpose
Payroll module documentation home.

## When To Read
Read first when entering the Payroll module docs folder.

## Related Files
- [Architecture](Architecture.md)

## Read Next
- [Architecture](Architecture.md)

---

Single entry point for **Payroll** documentation. Salary structures, payslips, compliance, and payroll runs.

## When To Read

Read this file first for any **Payroll** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- Salary structures and components
- Payslip generation
- Statutory compliance

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core + HR |
| **Provides to** | Finance (payroll journals) |
| **Consumes from** | HR (attendance, leave, employee data) |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | Payroll run and payslip events (see HR master architecture) |
| **Consumes** | HR attendance and leave events |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [Architecture.md](Architecture.md) | Full module architecture — open only for deep design |
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

**Maintainer:** Payroll Team · **Doc path:** `docs/03-business-modules/payroll/`
