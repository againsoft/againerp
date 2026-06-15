# Payroll Module

> **Status:** Draft · **Phase:** 5 · **Step:** 52

Payroll processing — salary structures, payslips, tax deductions, integrated with HR and Accounting.

| Document | Description |
|----------|-------------|
| [**Architecture.md**](./Architecture.md) | Enterprise Payroll architecture |
| [MASTER_DATABASE_ARCHITECTURE.md](../../database/MASTER_DATABASE_ARCHITECTURE.md) | Table naming & ownership |
| [MASTER_DEVELOPMENT_SEQUENCE.md](../../MASTER_DEVELOPMENT_SEQUENCE.md) | Phase 5 step 52 |

## Scope

| Area | Capability |
|------|------------|
| Salary Structures | Components, allowances, deductions |
| Payroll Runs | Batch processing per period |
| Payslips | Employee statements, PDF export |
| Integration | HR attendance/leave, Accounting journal entries |

## API Base

`/api/v1/payroll/`
