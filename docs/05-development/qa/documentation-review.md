# Documentation Review

## Purpose
Documentation: documentation-review.

## When To Read
Read only if your task involves documentation-review.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

> **Status:** Draft  
> **Phase:** 10 — Production (Step 99)  
> **Parent:** [qa/README.md](./README.md)

---


## When To Read
Read only if your task involves documentation-review.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## Purpose

Audit AgainERP documentation against implemented code before launch. Ensures documentation remains the source of truth per [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) and identifies gaps, drift, and outdated content.

## Review Scope

| Area | Location | Reviewer |
|------|----------|----------|
| Platform | `docs/MASTER_*.md`, `docs/core/` | Enterprise Architect |
| Modules | `docs/modules/{name}/` | Module owner + QA |
| Database | `docs/database/` | DBA / Tech Lead |
| API | Module `API.md`, `docs/core/API.md` | API owner |
| Deployment | `docs/deployment/` | DevOps |
| QA | `docs/qa/` | QA Lead |
| UI/UX | `docs/ui-ux/` | Design lead |

## Review Triggers

| Trigger | Scope |
|---------|-------|
| Pre-launch (Step 99) | Full platform audit |
| Phase gate | Phase-specific modules |
| Major release | Changed modules only |
| Post-incident | Affected areas |
| Quarterly | Spot check + link validation |

## Documentation Completeness Checklist

Per module ([DOCUMENTATION_STANDARD.md](../../00-foundation/standards/DOCUMENTATION_STANDARD.md)):

- [ ] `ARCHITECTURE.md` exists and current
- [ ] `Database.md` matches migrations
- [ ] `API.md` matches routes and responses
- [ ] `Permissions.md` matches seeded roles
- [ ] `UI.md` matches navigation
- [ ] Every menu item has screen doc in `Menus/`
- [ ] `ModuleManifest.md` status accurate
- [ ] `README.md` links valid

## Drift Detection Methods

| Method | Detects |
|--------|---------|
| API contract test | Endpoint/schema mismatch |
| Schema diff | DB vs Database.md |
| Permission test | ACL vs Permissions.md |
| Menu inventory | UI routes vs UI.md / Menus/ |
| Link checker | Broken internal links |
| Manual walkthrough | UX vs Page Layout sections |

Automate where possible in CI; manual review for architecture accuracy.

## Review Process

### 1. Inventory

Generate list of all docs with last-updated date and **Ready** status from governance.

### 2. Assign

Module owners review assigned folders within 5 business days.

### 3. Record Findings

| ID | Doc | Issue | Severity | Owner | Due |
|----|-----|-------|----------|-------|-----|
| DR-001 | ecommerce/API.md | Missing return endpoint | High | Dev | — |

Severity: Critical (wrong behavior), High (missing feature), Medium (outdated), Low (typo).

### 4. Remediate

- Update docs before code OR update code to match docs (governance rule: docs lead)
- Mark resolved in tracking sheet
- Re-review Critical/High items

### 5. Sign-Off

Documentation lead confirms:

- [ ] No open Critical documentation drift
- [ ] All launch modules marked **Ready**
- [ ] CHANGELOG reflects doc updates
- [ ] [_COMMIT_CHECKLIST.md](../../00-foundation/templates/_COMMIT_CHECKLIST.md) complete

## Phase 6–10 Doc Verification (Launch)

| Phase | Key Docs | Verified |
|-------|----------|----------|
| 6 AI | `modules/ai/ARCHITECTURE.md` | ⬜ |
| 7 Marketplace | `modules/marketplace/` | ⬜ |
| 8 Enterprise | 7 module ARCHITECTURE files | ⬜ |
| 9 DevOps | `deployment/*` | ⬜ |
| 10 QA | `qa/*` | ⬜ |

## Living Documentation Policy

Post-launch:

- PR template requires doc update checkbox for behavior changes
- Monthly doc owner rotation review
- Deprecation notices in docs 90 days before removal

## Related Documents

- [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md)
- [DOCUMENTATION_STANDARD.md](../../00-foundation/standards/DOCUMENTATION_STANDARD.md)
- [launch-checklist.md](./launch-checklist.md)
- [_COMMIT_CHECKLIST.md](../../00-foundation/templates/_COMMIT_CHECKLIST.md)

---

**Last Updated:** 2026-06-12
