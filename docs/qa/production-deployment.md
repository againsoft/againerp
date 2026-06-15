# Production Deployment

> **Status:** Draft  
> **Phase:** 10 — Production (Step 96)  
> **Parent:** [qa/README.md](./README.md)

---

## Purpose

Step-by-step checklist and procedures for deploying AgainERP to production safely. Bridges QA sign-off with live operations.

## Pre-Deploy Requirements

All must be complete before production deploy:

- [ ] UAT sign-off — [uat.md](./uat.md)
- [ ] Security test pass — [security-testing.md](./security-testing.md)
- [ ] Load test pass — [load-testing.md](./load-testing.md)
- [ ] Release approval — [release-management.md](./release-management.md)
- [ ] CHANGELOG updated
- [ ] Rollback plan documented

## Pre-Deploy Technical Checklist

- [ ] Staging deploy of exact production image tag verified
- [ ] Database migration tested on staging copy
- [ ] Pre-deploy backup completed — [backup-strategy.md](../deployment/backup-strategy.md)
- [ ] Secrets rotated if compromised in staging
- [ ] `APP_DEBUG=false` in production `.env`
- [ ] Maintenance page ready (if needed)
- [ ] On-call engineer assigned

## Deployment Window

| Release Type | Window |
|--------------|--------|
| Standard minor | Tuesday–Thursday, business hours +2h buffer |
| Patch/hotfix | Anytime with approval |
| Major (breaking) | Scheduled maintenance, off-peak |

Communicate window to stakeholders 48 hours ahead.

## Deployment Steps

### 1. Prepare

1. Announce maintenance (if applicable)
2. Verify monitoring dashboards open — [monitoring.md](../deployment/monitoring.md)
3. Trigger pre-deploy backup
4. Record current image tag / commit SHA for rollback

### 2. Deploy

Per target environment:

| Target | Procedure |
|--------|-----------|
| VPS | [vps.md](../deployment/vps.md) deploy script |
| Docker | Pull image, `docker compose up -d` |
| Kubernetes | `kubectl rollout` new deployment |
| cPanel | Git pull, composer, migrate via SSH |

Sequence:

```
1. Enable maintenance mode (if breaking)
2. Pull/deploy new version
3. composer install --no-dev
4. php artisan migrate --force
5. php artisan config:cache && route:cache && view:cache
6. php artisan horizon:terminate
7. Disable maintenance mode
```

### 3. Post-Deploy Verification

| Check | Method | Pass |
|-------|--------|------|
| Health endpoint | `GET /api/health` | 200 |
| Admin login | Manual | Success |
| Critical API | Automated smoke | Pass |
| Queue processing | Horizon dashboard | Jobs flowing |
| Error rate | Monitoring | < baseline |
| SSL | Browser | Valid cert |

Smoke test script runs automatically from CI post-deploy hook.

### 4. Monitor

- Watch error rate and latency for 30 minutes minimum
- On-call available for 2 hours post-deploy
- Extended monitoring 24h for major releases

## Rollback Procedure

If critical issue detected:

1. Decision by Tech Lead or on-call
2. Enable maintenance mode
3. Revert to previous image tag / git SHA
4. Roll back migration only if safe and tested
5. Restart workers
6. Verify health checks
7. Disable maintenance mode
8. Notify stakeholders
9. Post-incident review within 48h

## Post-Deploy Tasks

- [ ] Update deployment log (date, version, deployer)
- [ ] Close release ticket
- [ ] Publish release notes to customers
- [ ] Verify scheduled jobs and backups running
- [ ] Archive staging snapshot

## Zero-Downtime Guidelines

- Use backward-compatible migrations (add column before remove)
- Run `horizon:terminate` for graceful worker drain
- Blue-green or rolling deploy on K8s
- Avoid `artisan down` except breaking changes

## Related Documents

- [deployment/cicd.md](../deployment/cicd.md)
- [deployment/monitoring.md](../deployment/monitoring.md)
- [launch-checklist.md](./launch-checklist.md)
- [optimization.md](./optimization.md)

---

**Last Updated:** 2026-06-12
