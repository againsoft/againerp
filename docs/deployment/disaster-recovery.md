# Disaster Recovery

> **Status:** Draft  
> **Phase:** 9 — DevOps (Step 87)  
> **Parent:** [deployment/README.md](./README.md)

---

## Purpose

Define recovery objectives and procedures when AgainERP experiences catastrophic failure: data center outage, database corruption, ransomware, or critical application failure.

## Recovery Objectives

| Tier | RTO (Recovery Time) | RPO (Data Loss) | Scope |
|------|---------------------|-----------------|-------|
| Critical | 4 hours | 1 hour | Production SaaS |
| Standard | 24 hours | 4 hours | Single-tenant VPS |
| Non-prod | 72 hours | 24 hours | Staging/dev |

RTO = time to restore service. RPO = maximum acceptable data loss window.

## Disaster Scenarios

| Scenario | Primary Response |
|----------|------------------|
| App server failure | Redeploy from image; no data loss |
| Database failure | Restore from backup + WAL replay |
| Region outage | Failover to secondary region |
| Data corruption | Point-in-time restore |
| Security breach | Isolate, restore clean backup, rotate secrets |
| Ransomware | Immutable backups; rebuild from known-good |

## Backup Foundation

All recovery depends on [backup-strategy.md](./backup-strategy.md):

- Automated daily full backups
- Continuous WAL/binlog for PostgreSQL
- Off-site and immutable copy (S3 Glacier, vault)
- Quarterly restore drills

## Recovery Procedures

### Application Server Loss

1. Provision replacement ([vps.md](./vps.md) or K8s scale-up)
2. Deploy latest known-good image ([cicd.md](./cicd.md))
3. Attach `.env` from secrets vault
4. Verify `/api/health` and smoke tests
5. No DB restore if database intact

### Database Loss

1. Stop application writes (`artisan down` or traffic drain)
2. Identify recovery point (timestamp before incident)
3. Restore latest full backup to new instance
4. Apply WAL logs to target RPO
5. Update `DB_HOST` in application config
6. Run integrity checks and spot-verify critical tables
7. Resume traffic; monitor errors

### Full Site Loss

1. Activate DR runbook owner and comms plan
2. Provision infrastructure in DR region
3. Restore database from geo-replicated backup
4. Deploy application; restore `storage/` from object storage
5. Update DNS (low TTL pre-configured)
6. Notify customers per SLA

## Runbook Requirements

| Item | Owner |
|------|-------|
| DR runbook document (this + playbooks) | DevOps |
| Contact tree (on-call, vendor support) | Ops lead |
| Credential break-glass access | Security |
| Customer communication templates | Product/Support |

Test runbook annually; log results in CHANGELOG.

## DNS & Traffic Failover

- Production DNS TTL: 300s during DR-capable setup
- Health-checked failover (Route53, Cloudflare) optional
- Maintenance page served from CDN if origin down

## Data Integrity Validation Post-Restore

| Check | Method |
|-------|--------|
| Record counts | Compare to last known metrics snapshot |
| Financial totals | Accounting period balance |
| Recent orders | Sample last 24h transactions |
| User auth | Login test accounts |
| Queue backlog | Process or purge stale jobs |

## Compliance & Documentation

- Log all DR events with timeline
- Post-incident review within 5 business days
- Update procedures if gaps found

## Related Documents

- [backup-strategy.md](./backup-strategy.md)
- [security-hardening.md](./security-hardening.md)
- [monitoring.md](./monitoring.md) — early detection
- [production-deployment.md](../qa/production-deployment.md)

---

**Last Updated:** 2026-06-12
