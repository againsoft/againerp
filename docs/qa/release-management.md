# Release Management

> **Status:** Draft  
> **Phase:** 10 — Production (Step 95)  
> **Parent:** [qa/README.md](./README.md)

---

## Purpose

Define versioning, release cadence, change communication, and rollback procedures for AgainERP production deployments.

## Versioning

Semantic Versioning (SemVer): `MAJOR.MINOR.PATCH`

| Bump | When |
|------|------|
| MAJOR | Breaking API, schema migration requiring downtime |
| MINOR | New features, modules, backward-compatible |
| PATCH | Bug fixes, security patches |

Git tags: `v1.2.3` on `main` at production deploy.

## Release Types

| Type | Cadence | Content |
|------|---------|---------|
| Major | Quarterly (planned) | New modules, architecture changes |
| Minor | Bi-weekly to monthly | Features, enhancements |
| Patch | As needed | Hotfixes, security |
| Hotfix | Emergency | Critical production issues |

## Release Process

```
Feature complete → Code freeze → QA regression → UAT → Release approval → Deploy staging → Smoke → Deploy production → Monitor
```

Detailed deploy steps: [production-deployment.md](./production-deployment.md) and [deployment/cicd.md](../deployment/cicd.md).

## Release Artifacts

| Artifact | Owner | Location |
|----------|-------|----------|
| Release notes | Product | CHANGELOG.md |
| Migration notes | Dev | CHANGELOG + module docs |
| Known issues | QA | Release notes |
| Rollback plan | DevOps | Deploy ticket |
| Communication | Product | Email, in-app banner |

## Change Communication

| Audience | Channel | Timing |
|----------|---------|--------|
| Internal team | Slack, standup | Before deploy |
| Customers | Email, status page | Major/minor — 48h notice |
| Admins | In-app changelog | On deploy |
| API consumers | API changelog, deprecation headers | Per deprecation policy |

Breaking API changes: minimum 90-day deprecation with `Sunset` header.

## Database Migrations

| Rule | Rationale |
|------|-----------|
| Backward compatible when possible | Zero-downtime deploy |
| Destructive changes in major only | Requires maintenance window |
| Pre-deploy backup mandatory | [backup-strategy.md](../deployment/backup-strategy.md) |
| Test on staging copy of prod data | Catch migration issues |

## Release Approval Board

| Role | Approves |
|------|----------|
| Tech Lead | Technical readiness |
| QA Lead | Test completion |
| Product Owner | Business readiness |
| DevOps | Infrastructure readiness |
| Security (major) | Security test pass |

All required for major releases; patch may expedite to Tech Lead + DevOps.

## Rollback Policy

| Condition | Action |
|-----------|--------|
| Critical defect post-deploy | Rollback within 1 hour |
| Migration failure | Restore DB backup; revert image |
| Partial feature issue | Feature flag off if available |

Document every rollback in CHANGELOG and post-incident review.

## Feature Flags

- New risky features behind flags default off
- Enable per company for pilot tenants
- Remove flag code after stable release

## Environment Promotion

```
develop (staging auto) → main (production manual approval)
```

Same Docker image tag promoted — no rebuild between staging and production.

## Related Documents

- [production-deployment.md](./production-deployment.md)
- [launch-checklist.md](./launch-checklist.md)
- [CHANGELOG.md](../CHANGELOG.md)
- [GOVERNANCE.md](../GOVERNANCE.md)

---

**Last Updated:** 2026-06-12
