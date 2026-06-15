# Docker Architecture

> **Status:** Draft  
> **Phase:** 9 — DevOps (Step 83)  
> **Parent:** [deployment/README.md](./README.md)

---

## Purpose

Define containerized deployment for AgainERP: reproducible local development, CI test environments, and production-ready Docker Compose or Kubernetes workloads.

## Goals

- Identical environments across dev, staging, production
- Fast onboarding for developers
- Isolated services (app, db, redis, queue)
- Foundation for Kubernetes migration

## Service Topology

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   nginx     │────▶│  app (PHP)  │────▶│  postgres   │
│   :80/443   │     │  + workers  │     │  + pgvector │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────▼──────┐
                    │    redis    │
                    │ cache+queue │
                    └─────────────┘
```

Optional services: `mailhog` (dev), `minio` (S3-compatible storage), `meilisearch` (search).

## Images

| Image | Base | Purpose |
|-------|------|---------|
| `againerp-app` | php:8.2-fpm-alpine | Application + Composer deps |
| `againerp-nginx` | nginx:alpine | Reverse proxy, static assets |
| `againerp-worker` | Same as app | Horizon queue worker |
| `againerp-scheduler` | Same as app | `schedule:run` loop |

Multi-stage build: composer install in build stage; production image excludes dev dependencies.

## Docker Compose (Development)

| Service | Ports | Volumes |
|---------|-------|---------|
| app | 9000 (internal) | `./:/var/www/html` |
| nginx | 8080:80 | static from app |
| postgres | 5432:5432 | `pgdata` named volume |
| redis | 6379:6379 | — |
| horizon | — | shared app volume |

`.env.docker` template with service hostnames (`DB_HOST=postgres`).

## Docker Compose (Production)

Differences from dev:

- No source bind mount — immutable image tag
- Secrets via Docker secrets or external vault
- Health checks on all services
- Resource limits (`cpus`, `memory`)
- External volume for `storage/` and database

## Environment Variables

Inject via Compose `env_file` or orchestrator secrets:

| Variable | Notes |
|----------|-------|
| `APP_KEY` | Required; rotate on compromise |
| `DB_*` | PostgreSQL connection |
| `REDIS_*` | Cache and queue |
| `AWS_*` | S3 media storage |

Never bake secrets into images.

## Networking

- Internal bridge network for app ↔ db ↔ redis
- Only nginx exposes public ports
- Database not exposed publicly in production

## Health Checks

| Service | Check |
|---------|-------|
| app | `php artisan inspire` or custom health script |
| nginx | `curl -f http://localhost/api/health` |
| postgres | `pg_isready` |
| redis | `redis-cli ping` |

## CI Integration

CI pipeline builds image, runs tests in ephemeral Compose stack, pushes tagged image to registry. See [cicd.md](./cicd.md).

## Scaling Path

| Stage | Approach |
|-------|----------|
| Single host | Docker Compose with 2+ app replicas behind nginx |
| Multi host | Kubernetes — [kubernetes.md](./kubernetes.md) |
| Managed DB | RDS/Cloud SQL; app containers only |

## Logging

- stdout/stderr → Docker logging driver
- JSON structured logs for aggregation (Datadog, Loki)
- Do not log PII or credentials

## Related Documents

- [vps.md](./vps.md) — bare-metal alternative
- [kubernetes.md](./kubernetes.md) — orchestration at scale
- [monitoring.md](./monitoring.md) — container metrics

---

**Last Updated:** 2026-06-12
