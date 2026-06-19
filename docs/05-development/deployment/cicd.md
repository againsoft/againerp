# CI/CD Pipeline

## Purpose
Documentation: cicd.

## When To Read
Read only if your task involves cicd.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

> **Status:** Draft  
> **Phase:** 9 — DevOps (Step 84)  
> **Parent:** [deployment/README.md](./README.md)

---


## When To Read
Read only if your task involves cicd.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## Purpose

Automate build, test, and deployment of AgainERP with consistent quality gates. Every merge to protected branches passes automated checks before reaching staging or production.

## Pipeline Stages

```
Push/PR → Lint → Unit Tests → Integration Tests → Build Image → Deploy Staging → Smoke Tests → Deploy Production (manual gate)
```

## Branch Strategy

| Branch | Environment | Deploy Trigger |
|--------|-------------|----------------|
| `feature/*` | — | CI only (no deploy) |
| `develop` | Staging | Auto on merge |
| `main` | Production | Manual approval after staging pass |
| `hotfix/*` | Production | Expedited approval |

## CI Jobs (Pull Request)

| Job | Tool | Fail Condition |
|-----|------|----------------|
| PHP lint | PHP CS Fixer / Pint | Style violations |
| Static analysis | PHPStan (level per project) | Type errors |
| Unit tests | PHPUnit / Pest | Any failure |
| Integration tests | PHPUnit + test DB | API/DB failures |
| Security scan | Composer audit | Critical CVE |
| Docs check | Link validator (optional) | Broken internal links |

Target: PR pipeline < 10 minutes.

## Build Artifacts

| Artifact | Storage |
|----------|---------|
| Docker image | Container registry (GHCR, ECR) |
| Tag format | `{registry}/againerp:{git-sha}` |
| Release tag | `v{semver}` on production deploy |

Build once, promote same image staging → production.

## CD — Staging Deploy

1. Pull image by commit SHA
2. Run database migrations (`migrate --force`)
3. Cache config/routes/views
4. Rolling restart workers (Horizon terminate)
5. Smoke tests against staging URL

## CD — Production Deploy

| Step | Requirement |
|------|-------------|
| Approval | Tech lead or release manager |
| Window | Defined maintenance window for breaking migrations |
| Rollback plan | Previous image tag documented |
| Changelog | [CHANGELOG.md](../../00-foundation/CHANGELOG.md) updated |

Deployment methods: SSH + script ([vps.md](./vps.md)), Docker Compose pull, or Kubernetes rollout ([kubernetes.md](./kubernetes.md)).

## Database Migrations in CI/CD

- Migrations run in deploy step, not in image build
- Backward-compatible migrations required for zero-downtime
- Destructive migrations: maintenance mode + backup first

## Secrets Management

| Environment | Storage |
|-------------|---------|
| CI | GitHub/GitLab encrypted secrets |
| Staging/Prod | Vault, cloud secret manager, or deploy host env |

Rotate keys quarterly. Never log secret values in CI output.

## Notifications

| Event | Channel |
|-------|---------|
| Build failed | Slack / email to author |
| Staging deployed | Team channel |
| Production deployed | Team + CHANGELOG |
| Rollback executed | Incident channel |

## Rollback Procedure

1. Revert to previous image tag or `git revert` + redeploy
2. Run down migrations only if safe and tested
3. Verify health endpoint and critical user flows
4. Post-incident review if production-impacting

## Quality Gates

Aligned with [qa/testing-strategy.md](../qa/testing-strategy.md):

- Minimum code coverage threshold (TBD per module)
- No deploy with failing security scan
- Staging smoke tests must pass

## Related Documents

- [docker.md](./docker.md) — image build
- [production-deployment.md](../qa/production-deployment.md) — release checklist
- [monitoring.md](./monitoring.md) — post-deploy verification

---

**Last Updated:** 2026-06-12
