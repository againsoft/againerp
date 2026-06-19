# Monitoring Standards

> Parent: [DEVELOPMENT_STANDARDS.md §19](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md#19-monitoring-standards)

## Purpose
Documentation: monitoring.

## When To Read
Read only if your task involves monitoring.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---


## When To Read
Read only if your task involves monitoring.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## What to Track

| Area | Metrics |
|------|---------|
| Errors | Exception rate, error types, stack traces |
| Slow queries | Queries > 100ms, N+1 detection |
| Failed jobs | Queue failures, retry count, dead letter |
| User activity | Login rate, action volume per module |
| API performance | Response time p50/p95/p99 per endpoint |

## Alert Thresholds

| Condition | Severity |
|-----------|----------|
| API p95 > 500ms | Warning |
| Error rate > 1% of requests | Critical |
| Failed job backlog > 100 | Warning |
| Disk usage > 85% | Warning |

## Implementation (planned)

- Application: Sentry or equivalent
- APM: Request tracing per API call
- Database: Slow query log
- Queue: Horizon / dashboard
- Uptime: Health check endpoint `/api/health`
