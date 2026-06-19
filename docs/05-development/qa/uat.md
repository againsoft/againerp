# User Acceptance Testing

## Purpose
Documentation: uat.

## When To Read
Read only if your task involves uat.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

> **Status:** Draft  
> **Phase:** 10 — Production (Step 94)  
> **Parent:** [qa/README.md](./README.md)

---


## When To Read
Read only if your task involves uat.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## Purpose

Validate AgainERP meets business requirements from end-user perspective before production release. UAT confirms documented workflows work correctly in a staging environment with realistic data.

## UAT vs Other Testing

| Aspect | UAT | Automated QA |
|--------|-----|--------------|
| Executor | Business users, Product Owner | QA engineers, CI |
| Focus | Business fit, usability | Correctness, regression |
| Environment | Staging | CI + staging |
| Criteria | Acceptance criteria in docs | Technical test cases |

## Participants

| Role | Responsibility |
|------|----------------|
| Product Owner | Final acceptance sign-off |
| Business stakeholders | Execute scenarios for their domain |
| Customer pilot users | Optional beta feedback |
| QA lead | Coordinate, track defects, retest |
| Dev liaison | Clarify behavior, fix blockers |

## UAT Environment

- Staging URL matching production topology
- Anonymized production data or comprehensive seed dataset
- Test user accounts per role (admin, manager, staff, vendor, customer)
- Payment gateway in sandbox mode
- Email/SMS to test inboxes only

## UAT Scope by Phase

| Phase | UAT Focus |
|-------|-----------|
| Ecommerce | Catalog, checkout, orders, returns |
| ERP | Inventory, sales, purchase, accounting flows |
| AI | Content generation, assistant, approvals |
| Marketplace | Vendor onboarding, split orders |
| Enterprise | Subscription billing, manufacturing WO |
| Full platform | Cross-module end-to-end scenarios |

## Test Scenario Structure

Each scenario document includes:

| Field | Content |
|-------|---------|
| ID | UAT-ECOM-001 |
| Module | Ecommerce |
| Role | Store Admin |
| Preconditions | Product exists, stock available |
| Steps | Numbered user actions |
| Expected result | Observable outcome |
| Pass/Fail | Tester sign-off |
| Notes | Screenshots, defects linked |

Derive scenarios from module `Workflow.md` and menu docs.

## Critical UAT Scenarios (Launch)

| # | Scenario | Modules |
|---|----------|---------|
| 1 | Complete purchase from storefront to invoice | Ecommerce, Sales, Accounting |
| 2 | Receive goods and update stock | Purchase, Inventory |
| 3 | Process return and refund | Ecommerce, Accounting |
| 4 | Generate P&L report for period | Accounting, BI |
| 5 | Admin role permissions enforced | Core |
| 6 | Multi-branch order fulfillment | Logistics, Inventory |
| 7 | AI product description with approval | AI, Ecommerce |

Expand per deployed modules.

## Defect Handling During UAT

| Severity | Action |
|----------|--------|
| Blocker | Stop UAT for scenario; dev hotfix to staging |
| Major | Continue other scenarios; fix before sign-off |
| Minor | Log for post-launch if PO accepts |

All defects linked to module and documentation section.

## UAT Schedule

| Phase | Duration |
|-------|----------|
| Preparation | 3 days — scenarios, data, accounts |
| Execution | 5–10 business days |
| Retest | 2 days after fixes |
| Sign-off | 1 day — PO formal approval |

## Sign-Off Document

Product Owner confirms:

- [ ] All critical scenarios passed
- [ ] No open Blocker or Major UAT defects
- [ ] Known limitations documented in release notes
- [ ] Training materials adequate (if applicable)
- [ ] Go/no-go for production deploy

Sign-off recorded in CHANGELOG with date and approver.

## Related Documents

- [qa-standards.md](./qa-standards.md)
- [testing-strategy.md](./testing-strategy.md)
- [release-management.md](./release-management.md)
- [launch-checklist.md](./launch-checklist.md)

---

**Last Updated:** 2026-06-12
