# Load Testing

> **Status:** Draft  
> **Phase:** 10 — Production (Step 92)  
> **Parent:** [qa/README.md](./README.md)

---

## Purpose

Validate AgainERP performance under expected and peak load. Establish SLAs, identify bottlenecks, and confirm infrastructure sizing before production launch.

## Performance SLAs

| Metric | Target | Measurement |
|--------|--------|-------------|
| API p95 response | < 500ms | APM / load tool |
| API p99 response | < 1000ms | APM |
| Page load (admin) | < 2s | Lighthouse / RUM |
| Storefront page | < 3s | Lighthouse |
| Error rate | < 0.1% | Under normal load |
| Concurrent users | Per sizing tier | See deployment docs |

Alert thresholds align with [deployment/monitoring.md](../deployment/monitoring.md).

## Load Test Types

| Type | Goal | Duration |
|------|------|----------|
| Baseline | Establish metrics at normal load | 15 min |
| Load | Expected peak traffic | 30–60 min |
| Stress | Find breaking point | Until failure |
| Soak | Memory leaks, connection exhaustion | 4–8 hours |
| Spike | Sudden traffic surge | 5 min ramp |

## Tools

| Tool | Use Case |
|------|----------|
| k6 | API load tests (scriptable, CI-friendly) |
| Locust | Complex user scenarios |
| Apache JMeter | Legacy enterprise environments |
| Lighthouse CI | Frontend performance budgets |

Recommended: k6 for API; Lighthouse for storefront.

## Test Scenarios

| Scenario | Endpoints / Flows | Weight |
|----------|-------------------|--------|
| Admin browse | Product list, order list, dashboard | 30% |
| API read | GET products, orders, inventory | 40% |
| Checkout | Cart → payment → confirm | 15% |
| Search | Global search, catalog filter | 10% |
| AI query | Assistant chat (rate limited) | 5% |

Simulate realistic think time (1–3s between actions).

## Environment Requirements

- Staging environment matching production topology ([vps.md](../deployment/vps.md) or [kubernetes.md](../deployment/kubernetes.md))
- Production-equivalent data volume (anonymized seed or subset)
- Monitoring enabled during tests
- Isolated from production — never load test live

## Execution Process

1. Define scenarios and success criteria
2. Baseline single-user response times
3. Ramp users gradually (0 → target over 10 min)
4. Hold at peak for sustained period
5. Record metrics: latency, throughput, errors, CPU, memory, DB connections
6. Identify bottlenecks (slow queries, N+1, queue backlog)
7. Document findings and remediation

## Common Bottlenecks

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| High DB CPU | Missing indexes, N+1 | Query optimization, eager load |
| Memory growth | Unbounded cache | TTL, Redis limits |
| Queue backlog | Insufficient workers | Scale Horizon replicas |
| Slow API p95 | Synchronous heavy work | Queue async jobs |

See [optimization.md](./optimization.md).

## CI Integration

- Lightweight k6 smoke load on staging after deploy (50 VUs, 5 min)
- Full load test before major releases (manual trigger)
- Performance regression: fail if p95 degrades > 20% from baseline

## Sign-Off Criteria

- [ ] All SLA targets met at expected peak load
- [ ] No error rate spike above 1% during load test
- [ ] Soak test shows stable memory over 4 hours
- [ ] Bottleneck remediation tracked or accepted as known limitation

## Related Documents

- [optimization.md](./optimization.md)
- [deployment/monitoring.md](../deployment/monitoring.md)
- [launch-checklist.md](./launch-checklist.md)

---

**Last Updated:** 2026-06-12
