# Finance — Module Overview

> **Module ID:** `finance` · **Status:** Draft · **Route:** `/finance/*` · **API:** `/api/v1/finance/` · **Tables:** `finance_*`

## Purpose

Single entry point for **Finance** documentation. Treasury, AR/AP, journals, budgets, and financial planning.

## When To Read

Read this file first for any **Finance** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.

## Features

- General ledger posting
- Invoices and payments
- AR/AP dashboards
- Period close

## Dependencies

| Direction | Detail |
|-----------|--------|
| **Depends on** | Core + Workflow + Approvals |
| **Provides to** | All modules requiring GL / AR / AP status |
| **Consumes from** | Sales, Purchase, Inventory (via services) |

Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Events

| Direction | Events |
|-----------|--------|
| **Produces** | `finance.journal.posted`, `finance.invoice.posted`, `finance.payment.*` |
| **Consumes** | `sales.invoice.posted`, `purchase.bill.posted`, `inventory.adjustment.posted` |

## Documentation Map

| Document | Open when |
|----------|-----------|
| [FINANCE_MODULE_ARCHITECTURE.md](FINANCE_MODULE_ARCHITECTURE.md) | Enterprise Finance architecture (authoritative) |

## Related Files

- [Module registry](../../MODULE_REGISTRY.md) — index of all modules
- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules
- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines

## Read Next

1. [FINANCE_MODULE_ARCHITECTURE.md](FINANCE_MODULE_ARCHITECTURE.md) — if you need architecture depth
2. One row from Documentation Map for your task (Database / API / UI / one Menu file)
3. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code

---

**Maintainer:** Finance Team · **Doc path:** `docs/03-business-modules/finance/`
