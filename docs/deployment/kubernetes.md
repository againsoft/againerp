# Kubernetes Deployment

> **Status:** Draft  
> **Phase:** 9 — DevOps (Step 85)  
> **Parent:** [deployment/README.md](./README.md)

---

## Purpose

Run AgainERP at scale on Kubernetes (K8s) for multi-tenant SaaS, high availability, and auto-scaling. Builds on [docker.md](./docker.md) images and [cicd.md](./cicd.md) promotion pipeline.

## When to Use

| Use K8s | Stay on VPS/Compose |
|---------|---------------------|
| Multi-region HA | Single-region SMB deploy |
| Auto-scaling traffic spikes | Predictable low traffic |
| Many microservices later | Monolith sufficient |
| Platform team available | No K8s ops expertise |

## Cluster Architecture

```
                    ┌──────────────┐
                    │   Ingress    │
                    │ (nginx/ALB)  │
                    └──────┬───────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │ app pods   │  │ worker pods│  │ scheduler  │
    │ (HPA 2-10) │  │ (Horizon)  │  │ (CronJob)  │
    └─────┬──────┘  └─────┬──────┘  └────────────┘
          │               │
    ┌─────▼───────────────▼─────┐
    │  Managed PostgreSQL        │
    │  Managed Redis             │
    │  S3 (object storage)       │
    └────────────────────────────┘
```

Stateless app in cluster; state in managed services.

## Workloads

| Resource | Replicas | Notes |
|----------|----------|-------|
| Deployment `againerp-web` | 2+ | PHP-FPM behind nginx sidecar or separate |
| Deployment `againerp-horizon` | 1–3 | Queue workers; scale by queue depth |
| CronJob `againerp-schedule` | — | `* * * * *` schedule:run |
| Job `againerp-migrate` | — | Pre-deploy hook |

## Ingress & TLS

- Ingress controller: nginx-ingress or cloud ALB
- TLS via cert-manager + Let's Encrypt
- Rate limiting and WAF at ingress layer
- Separate ingress rules for API vs admin if needed

## Configuration

| Type | Content |
|------|---------|
| ConfigMap | Non-sensitive `APP_*`, feature flags |
| Secret | `APP_KEY`, DB password, API keys |
| External Secrets Operator | Sync from Vault/AWS SM |

Mount `storage` via S3 — no PersistentVolume for uploads.

## Horizontal Pod Autoscaler

| Metric | Target |
|--------|--------|
| CPU | 70% average |
| Custom | Request latency p95 (requires metrics adapter) |
| Queue | Horizon queue length → worker HPA |

Min replicas: 2 for HA. Max per cost budget.

## Database & Redis

**Not in cluster** for production:

- AWS RDS / Google Cloud SQL / Azure Database for PostgreSQL
- ElastiCache / Memorystore for Redis
- Enable pgvector on PostgreSQL for AI features

Connection pooling via PgBouncer sidecar or managed proxy.

## Deploy Strategy

| Strategy | Use |
|----------|-----|
| Rolling update | Default app deploy |
| Blue/green | Major version releases |
| Canary | 5% traffic test (service mesh optional) |

Pre-deploy: `againerp-migrate` Job must succeed before new pods receive traffic.

## Observability

Per [monitoring.md](./monitoring.md):

- Prometheus metrics from app and nginx
- Centralized logs (Loki, CloudWatch)
- Distributed tracing for API requests
- Alerts to PagerDuty/Slack

## Disaster Recovery

- Multi-AZ node pools
- Database cross-region read replica (RPO/RTO in [disaster-recovery.md](./disaster-recovery.md))
- Regular Velero backups of K8s resources (not DB)

## Resource Requests (Starting Point)

| Container | CPU | Memory |
|-----------|-----|--------|
| web | 500m | 512Mi |
| horizon | 250m | 256Mi |

Adjust from production profiling.

## Related Documents

- [docker.md](./docker.md)
- [cicd.md](./cicd.md)
- [disaster-recovery.md](./disaster-recovery.md)
- [security-hardening.md](./security-hardening.md)

---

**Last Updated:** 2026-06-12
