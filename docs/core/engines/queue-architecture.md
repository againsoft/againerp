# Queue Architecture

> **Status:** Draft  
> **Owner:** Core Platform  
> **Parent:** [core/ARCHITECTURE.md](../ARCHITECTURE.md)

---

## Purpose

Background job processing for notifications, search indexing, imports, exports, analytics aggregation, AI requests, and webhooks.

## Technology

| Component | Choice |
|-----------|--------|
| Broker | Redis (v1) |
| Worker | Horizon-compatible worker pool |
| Monitoring | Queue dashboard (admin) |

## Queues

| Queue | Priority | Jobs |
|-------|----------|------|
| `critical` | Highest | Payment callbacks, stock reservation |
| `default` | Normal | General async |
| `notifications` | Normal | Email, SMS, push |
| `search` | Normal | Index upsert/delete |
| `imports` | Low | Catalog CSV import |
| `exports` | Low | Large report export |
| `analytics` | Low | Aggregation rollups |
| `ai` | Low | LLM API calls |
| `webhooks` | Normal | Outbound HTTP |

## Tables

| Table | Purpose |
|-------|---------|
| `jobs` | Pending job metadata |
| `failed_jobs` | Dead letter with exception |
| `job_batches` | Bulk operation tracking |

## Job Design

| Rule | Description |
|------|-------------|
| Idempotent | Safe to retry |
| Timeout | Per-job max execution |
| Backoff | Exponential retry (3 attempts default) |
| Company scope | Every job carries `company_id` |
| Serialization | Pass IDs, not full models |

## Critical Paths

```
Order placed → critical: reserve_stock
             → default: send_confirmation_email
             → analytics: increment_daily_sales
```

## API / Admin

`GET /api/v1/core/queue/stats`  
Admin UI: `Menus/System/Cron Jobs.md` — job monitor, failed job retry.

## Scaling

Horizontal worker scaling per queue. `imports` and `exports` isolated to prevent blocking `critical`.
