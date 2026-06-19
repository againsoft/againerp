# Deployment

## Purpose
Documentation: README.

## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

> **Status:** Draft  
> **Phase:** 9 — DevOps (Steps 81–89)


## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

Documentation for AgainERP infrastructure, deployment targets, CI/CD, resilience, and security.

---

## Documents

| Document | Step | Description |
|----------|------|-------------|
| [cpanel.md](./cpanel.md) | 81 | Shared hosting deployment |
| [vps.md](./vps.md) | 82 | VPS / cloud VM deployment |
| [docker.md](./docker.md) | 83 | Container architecture |
| [cicd.md](./cicd.md) | 84 | CI/CD pipeline |
| [kubernetes.md](./kubernetes.md) | 85 | Kubernetes orchestration |
| [monitoring.md](./monitoring.md) | 86 | **Existing** — metrics, alerts, health checks |
| [disaster-recovery.md](./disaster-recovery.md) | 87 | DR objectives and runbooks |
| [backup-strategy.md](./backup-strategy.md) | 88 | Backup scope, schedule, retention |
| [security-hardening.md](./security-hardening.md) | 89 | Production security baseline |

## Deployment Path Selection

```
                    ┌─────────────┐
                    │  AgainERP   │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
     ┌──────────┐   ┌──────────┐   ┌──────────────┐
     │  cPanel  │   │   VPS    │   │ Docker / K8s │
     │  (SMB)   │   │ (growth) │   │   (scale)    │
     └──────────┘   └──────────┘   └──────────────┘
```

| Profile | Recommended Target |
|---------|-------------------|
| Single store, low traffic | [cpanel.md](./cpanel.md) |
| Production, full control | [vps.md](./vps.md) |
| Dev/staging parity | [docker.md](./docker.md) |
| Multi-tenant SaaS | [kubernetes.md](./kubernetes.md) |

## Cross-Cutting Concerns

All deployment targets must implement:

- Automated backups — [backup-strategy.md](./backup-strategy.md)
- Monitoring and alerting — [monitoring.md](./monitoring.md) (do not duplicate; reference only)
- Security baseline — [security-hardening.md](./security-hardening.md)
- Documented recovery — [disaster-recovery.md](./disaster-recovery.md)

## Phase 10 Integration

Production launch QA references this folder:

- [qa/production-deployment.md](../qa/production-deployment.md)
- [qa/launch-checklist.md](../qa/launch-checklist.md)

## Related

- [MASTER_DEVELOPMENT_SEQUENCE.md](../../10-roadmap/MASTER_DEVELOPMENT_SEQUENCE.md) — Phase 9 gate
- [DEVELOPMENT_STANDARDS.md](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md) §19 Monitoring

---

**Last Updated:** 2026-06-12
