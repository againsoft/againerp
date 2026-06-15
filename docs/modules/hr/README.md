# HR Module

> **Status:** Draft · **Phase:** 5 · **Step:** 51

Human resources — employees (linked to Core contacts), departments, attendance, and leave management.

| Document | Description |
|----------|-------------|
| [**Architecture.md**](./Architecture.md) | Enterprise HR architecture |
| [MASTER_DATABASE_ARCHITECTURE.md](../../database/MASTER_DATABASE_ARCHITECTURE.md) | Table naming & ownership |
| [MASTER_DEVELOPMENT_SEQUENCE.md](../../MASTER_DEVELOPMENT_SEQUENCE.md) | Phase 5 step 51 |

## Scope

| Area | Capability |
|------|------------|
| Employees | `hr_employees` → `contacts` |
| Departments | Org structure, reporting lines |
| Attendance | Check-in/out, shifts |
| Leave | Types, balances, approval workflow |

## API Base

`/api/v1/hr/`
