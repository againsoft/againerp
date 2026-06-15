# Optimization

> **Status:** Draft  
> **Phase:** 10 — Production (Step 98)  
> **Parent:** [qa/README.md](./README.md)

---

## Purpose

Systematic performance optimization for AgainERP before and after launch. Targets application, database, frontend, and infrastructure layers based on profiling data — not premature optimization.

## Optimization Workflow

```
Measure (baseline) → Profile (bottleneck) → Optimize → Verify → Document
```

Never optimize without metrics. Use [load-testing.md](./load-testing.md) and [monitoring.md](../deployment/monitoring.md) for data.

## Application Layer

| Area | Technique |
|------|-----------|
| N+1 queries | Eager loading, query review |
| Heavy controllers | Move logic to services; queue async |
| Cache | Redis for settings, permissions, catalog |
| API pagination | Cursor pagination for large lists |
| Serialization | API resources; exclude unused fields |

Ecommerce catalog: target < 200ms p95 for product list API at 10k SKUs with proper indexes.

## Database Optimization

| Technique | Application |
|-----------|-------------|
| Indexes | FK columns, filter/sort columns, composite indexes |
| Query analysis | `EXPLAIN ANALYZE` on slow queries (> 100ms) |
| Connection pooling | PgBouncer at scale |
| Read replicas | Reporting and BI queries |
| Partitioning | Large fact tables (orders, audit logs) |

Follow [database/standards.md](../database/standards.md). Review `ai_embeddings` HNSW index parameters as data grows.

## Queue & Background Jobs

| Pattern | Use |
|---------|-----|
| Async email/SMS | Always queue |
| Report generation | Queue + notification on complete |
| AI generation | Queue with rate limits |
| Image processing | Dedicated queue worker |
| Feed import | Chunked batch jobs |

Horizon worker count scaled to queue depth metrics.

## Frontend Optimization

| Technique | Target |
|-----------|--------|
| Asset bundling | Vite code splitting |
| Lazy loading | Route-level and heavy components |
| Image CDN | WebP, responsive sizes |
| Cache headers | Static assets 1y, API no-cache |
| Core Web Vitals | LCP < 2.5s, CLS < 0.1 |

Admin dashboard widget load: < 2s per [ecommerce/dashboard/ARCHITECTURE.md](../modules/ecommerce/dashboard/ARCHITECTURE.md).

## Caching Strategy

| Data | TTL | Invalidation |
|------|-----|--------------|
| App settings | 1 hour | On update event |
| Permission matrix | 15 min | On role change |
| Product catalog (public) | 5 min | On product publish |
| BI aggregates | Per schedule | ETL completion |

Use cache tags for group invalidation where supported.

## Infrastructure Tuning

Per deployment target:

| Target | Focus |
|--------|-------|
| VPS | PHP-FPM pool, OPcache, Nginx gzip |
| Docker | Resource limits, horizontal replicas |
| K8s | HPA thresholds, node sizing |

See [vps.md](../deployment/vps.md), [kubernetes.md](../deployment/kubernetes.md).

## AI & Search Performance

| Component | Optimization |
|-----------|--------------|
| Embeddings | Batch embed; cache frequent queries |
| Vector search | pgvector index tuning (HNSW ef_search) |
| LLM calls | Prompt caching, smaller models for simple tasks |
| Hybrid search | Pre-filter BM25 before vector rerank |

## Optimization Checklist (Pre-Launch)

- [ ] Slow query log reviewed; top 10 optimized
- [ ] No unbounded list endpoints
- [ ] OPcache enabled in production
- [ ] Redis configured for cache and queue
- [ ] CDN configured for media and static assets
- [ ] Load test SLAs met — [load-testing.md](./load-testing.md)

## Post-Launch Continuous Improvement

- Weekly review of APM slow endpoints
- Monthly database index audit
- Quarterly load test regression
- Performance budget in CI (Lighthouse, k6 thresholds)

## Related Documents

- [load-testing.md](./load-testing.md)
- [deployment/monitoring.md](../deployment/monitoring.md)
- [core/engines/cache-architecture.md](../core/engines/cache-architecture.md)

---

**Last Updated:** 2026-06-12
