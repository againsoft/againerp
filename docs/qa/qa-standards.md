# QA Standards

> **Status:** Draft  
> **Phase:** 10 — Production (Step 91)  
> **Parent:** [qa/README.md](./README.md)

---

## Purpose

Establish quality gates, acceptance criteria, and team responsibilities for AgainERP. Defines what "done" means before documentation approval, phase gates, and production releases.

## Quality Principles

| Principle | Application |
|-----------|-------------|
| Documentation first | Tests verify documented behavior, not undocumented features |
| Shift left | Test during development, not only at release |
| Automate repeatability | Manual tests for exploration; automation for regression |
| Tenant safety | Every test validates `company_id` isolation where applicable |
| No silent failures | Errors logged, user-friendly messages, audit trail |

## Definition of Done — Feature

- [ ] Module/screen documentation updated and marked Draft minimum
- [ ] Unit and integration tests written and passing
- [ ] API matches `API.md` contract
- [ ] Permissions enforced per `Permissions.md`
- [ ] No critical/high linter or static analysis issues
- [ ] Code review approved
- [ ] CHANGELOG entry if user-facing

## Definition of Done — Module

- [ ] All root docs: Architecture, Database, API, UI, Permissions
- [ ] Menu docs for every screen
- [ ] Test coverage meets [testing-strategy.md](./testing-strategy.md) targets
- [ ] Staging UAT sign-off
- [ ] Security scan clean
- [ ] Module marked **Ready** in governance

## Phase Gate Criteria

Per [MASTER_DEVELOPMENT_SEQUENCE.md](../MASTER_DEVELOPMENT_SEQUENCE.md):

| Gate | Requirements |
|------|--------------|
| Doc approval | Product Owner + Enterprise Architect |
| Implementation | All phase steps documented |
| QA | Phase test plan executed |
| Sign-off | Recorded in CHANGELOG |

## Acceptance Criteria Format

User stories and features use:

```
Given [context]
When [action]
Then [expected outcome]
And [side effects / integrations]
```

Stored in module docs or linked issue tracker.

## Bug Severity Definitions

| Level | Definition | Example |
|-------|------------|---------|
| Critical | System down, data loss, security breach | Cross-tenant data leak |
| High | Major feature broken, no workaround | Checkout fails 100% |
| Medium | Feature impaired, workaround exists | Export missing column |
| Low | Cosmetic, minor inconvenience | Label typo |

## Test Documentation

| Artifact | Owner | Location |
|----------|-------|----------|
| Test plan | QA lead | Per phase in `docs/qa/` |
| Test cases | QA + dev | Issue tracker / module folder |
| Test results | QA | Release record |
| Known issues | Product | Release notes |

## Roles & Responsibilities

| Role | Responsibility |
|------|----------------|
| Developer | Unit/integration tests, fix defects |
| QA Engineer | Test plans, E2E, regression, sign-off |
| Tech Lead | Architecture compliance, gate approval |
| Product Owner | UAT acceptance, priority calls |
| DevOps | CI pipeline, staging environment health |

## Regression Policy

- Full regression before major releases
- Targeted regression for hotfixes (affected module + smoke)
- Automated regression suite grows with each production bug

## Release Blockers

No release when:

- Any open Critical or High defect
- Security test failures ([security-testing.md](./security-testing.md))
- Failed load test against SLA ([load-testing.md](./load-testing.md))
- Incomplete [launch-checklist.md](./launch-checklist.md) items

## Related Documents

- [testing-strategy.md](./testing-strategy.md)
- [GOVERNANCE.md](../GOVERNANCE.md)
- [release-management.md](./release-management.md)

---

**Last Updated:** 2026-06-12
