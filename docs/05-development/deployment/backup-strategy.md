# Backup Strategy

## Purpose
Documentation: backup-strategy.

## When To Read
Read only if your task involves backup-strategy.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

> **Status:** Draft  
> **Phase:** 9 — DevOps (Step 88)  
> **Parent:** [deployment/README.md](./README.md)

---


## When To Read
Read only if your task involves backup-strategy.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## Purpose

Ensure AgainERP data and configuration can be restored reliably. Defines what to backup, frequency, retention, storage locations, and verification procedures.

## Backup Scope

| Asset | Method | Priority |
|-------|--------|----------|
| PostgreSQL database | `pg_dump` + WAL archiving | Critical |
| Uploaded media (`storage/`) | S3 sync or filesystem snapshot | Critical |
| `.env` / secrets | Encrypted vault export | Critical |
| Application code | Git (not primary backup) | Low — redeploy from repo |
| Redis | RDB snapshot (if non-persistent cache OK to lose) | Medium |
| Search indexes | Rebuild from DB | Low |

## Backup Schedule

| Type | Frequency | Retention |
|------|-----------|-----------|
| Full DB dump | Daily 02:00 UTC | 30 days |
| Incremental/WAL | Continuous | 7 days online |
| Media sync | Daily | 90 days |
| Weekly archive | Sunday | 1 year |
| Pre-deploy snapshot | Before production deploy | 14 days |

Adjust per compliance requirements (GDPR, financial regulations).

## Storage Locations

| Copy | Location | Purpose |
|------|----------|---------|
| Primary | Same region object storage (S3) | Fast restore |
| Secondary | Different region bucket | Region failure |
| Immutable | S3 Object Lock / Glacier Vault Lock | Ransomware protection |

Encrypt at rest (AES-256). Encryption keys in KMS, separate from data bucket.

## PostgreSQL Backup Details

```bash
# Full dump (example)
pg_dump -Fc -h $DB_HOST -U $DB_USER $DB_NAME > backup_$(date +%Y%m%d).dump

# WAL archiving for PITR
archive_mode = on
archive_command = 'aws s3 cp %p s3://backups/wal/%f'
```

Point-in-time recovery (PITR) target: any second within WAL retention window.

## Media & Files

- Production: S3-compatible storage as primary (not local disk only)
- Sync `storage/app` and `storage/media` to backup bucket
- Versioning enabled on bucket

## cPanel / VPS Specifics

| Environment | Approach |
|-------------|----------|
| cPanel | JetBackup or manual pg_dump + download off-server |
| VPS | Cron script → S3; see [vps.md](./vps.md) |
| Docker | Volume backup or S3-native storage |
| Kubernetes | Velero for K8s resources; managed DB backups |

## Backup Monitoring

Per [monitoring.md](./monitoring.md):

| Alert | Condition |
|-------|-----------|
| Backup failed | Job exit code ≠ 0 |
| Backup stale | No successful dump in 26 hours |
| Storage full | Backup bucket > 90% |
| WAL gap | Archiving lag > 15 minutes |

## Restore Testing

| Activity | Frequency |
|----------|-----------|
| Full restore to staging | Quarterly |
| Spot-check file restore | Monthly |
| Document restore time | Each test |

Log test results: date, RTO achieved, issues found.

## Retention & Compliance

- GDPR: ability to delete individual data on request; backups expire per retention
- Financial data: retention per local law (often 7+ years for archives)
- Right to erasure: document that deleted users may persist in backups until expiry

## Access Control

- Backup buckets: IAM role only — no public access
- Restore operations: two-person approval for production
- Audit log all restore events

## Related Documents

- [disaster-recovery.md](./disaster-recovery.md)
- [security-hardening.md](./security-hardening.md)
- [cpanel.md](./cpanel.md) · [vps.md](./vps.md)

---

**Last Updated:** 2026-06-12
