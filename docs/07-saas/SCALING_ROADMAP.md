# SaaS Platform Scaling Roadmap

> **Status:** Draft  
> **Parent:** [SAAS_PLATFORM_ARCHITECTURE.md](../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md)

---

## Purpose
SaaS platform documentation: SCALING_ROADMAP.

## When To Read
Read only when working on multi-tenant SaaS, billing, or hybrid deployment.

## Related Files
- [Tenant architecture](TENANT_ARCHITECTURE.md)
- [SaaS platform arch](../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md)

## Read Next
- [Platform architecture](../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md)

---

## Principle

Same application architecture at every phase — **infra scales**, tenant model unchanged.

---

## Phase 1 — cPanel (1–50 tenants)

| Component | Setup |
|-----------|-------|
| App | Python/FastAPI + Next.js on VPS/K8s |
| DB | Single PostgreSQL or MySQL migrate target |
| Cache | File or Redis if available |
| Queue | Cron-based workers |
| CDN | Cloudflare free |

**Limits:** Manual ops, single server. Good for MVP + early adopters.

Doc: [deployment/cpanel.md](../05-development/deployment/cpanel.md)

---

## Phase 2 — VPS (50–500 tenants)

| Component | Setup |
|-----------|-------|
| App | Nginx + PHP-FPM or Octane |
| DB | Dedicated PostgreSQL |
| Cache | Redis |
| Queue | Supervisor workers |
| Search | Meilisearch on VPS |

**Add:** Automated backups, staging environment, read replica optional.

Doc: [deployment/vps.md](../05-development/deployment/vps.md)

---

## Phase 3 — Docker (500–2,000 tenants)

| Component | Setup |
|-----------|-------|
| App | Containerized app + workers |
| DB | PostgreSQL container or managed |
| Stack | docker-compose → production compose |
| CI/CD | Build images per release |

**Add:** Horizontal worker scaling, separate search container.

Doc: [deployment/docker.md](../05-development/deployment/docker.md)

---

## Phase 4 — Kubernetes (2,000–10,000+ tenants)

| Component | Setup |
|-----------|-------|
| App | K8s deployments, HPA |
| DB | Managed PostgreSQL (RDS, Cloud SQL) + read replicas |
| Cache | Redis cluster |
| Queue | Dedicated worker pods per queue |
| Partitioning | `commerce_orders` by date, large tables by company_id |

**Add:** Multi-AZ, automated failover, platform monitoring stack.

Doc: [deployment/kubernetes.md](../05-development/deployment/kubernetes.md)

---

## Phase 5 — Multi-Region (Global)

| Component | Setup |
|-----------|-------|
| Regions | EU, US, APAC |
| DB | Regional primary + global platform DB for billing |
| CDN | Global edge |
| Routing | Geo DNS → nearest region |
| Compliance | Data residency per tenant region flag |

**Tenant data** stays in chosen region. Platform billing may centralize.

---

## Scaling Checklist (All Phases)

- [ ] `tenant_id` / `company_id` on every query
- [ ] Connection pooling (PgBouncer)
- [ ] Redis session + permission cache
- [ ] Async jobs for email, AI, exports
- [ ] `analytics_*` pre-aggregation
- [ ] API rate limits per plan
- [ ] Tenant backup jobs

---

## Migration Path

```
cPanel → export DB → VPS restore → Docker image → K8s helm chart
```

Zero tenant data model change between phases.
