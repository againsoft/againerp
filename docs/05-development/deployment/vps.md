# VPS Deployment

## Purpose
Documentation: vps.

## When To Read
Read only if your task involves vps.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

> **Status:** Draft  
> **Phase:** 9 — DevOps (Step 82)  
> **Parent:** [deployment/README.md](./README.md)

---


## When To Read
Read only if your task involves vps.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## Purpose

Deploy AgainERP on a virtual private server (VPS) or dedicated cloud instance for production workloads requiring full control, PostgreSQL with extensions, Redis, and persistent queue workers.

## Recommended Stack

| Layer | Choice |
|-------|--------|
| OS | Ubuntu 22.04 LTS or 24.04 LTS |
| Web | Nginx → PHP-FPM 8.2+ |
| Database | PostgreSQL 15+ (pgvector for AI) |
| Cache/Queue | Redis 7+ |
| Process manager | Supervisor (queue, Horizon) |
| SSL | Certbot (Let's Encrypt) |
| Firewall | UFW — ports 22, 80, 443 only |

## Server Sizing

| Tier | vCPU | RAM | Disk | Use Case |
|------|------|-----|------|----------|
| Small | 2 | 4 GB | 80 GB SSD | Staging, < 50 users |
| Medium | 4 | 8 GB | 160 GB SSD | Production, < 500 users |
| Large | 8 | 16 GB | 320 GB SSD | Multi-branch, AI workloads |

Separate database server recommended at Large tier.

## Installation Overview

```
1. Provision VPS → harden SSH → configure UFW
2. Install Nginx, PHP-FPM, PostgreSQL, Redis, Supervisor
3. Create deploy user (non-root) with sudo
4. Clone repo → composer install --no-dev
5. Configure .env → migrate → seed (if applicable)
6. Nginx site config → SSL → PHP-FPM pool tuning
7. Supervisor: horizon + schedule (optional duplicate of cron)
8. Log rotation → monitoring agents
```

## Nginx Configuration

- Document root: `/var/www/againerp/public`
- `try_files` to `index.php`
- Client max body size: 64M (media uploads)
- Gzip enabled for static assets
- Rate limiting on `/api/` endpoints

## PHP-FPM Tuning

| Pool Setting | Medium Server |
|--------------|---------------|
| `pm` | dynamic |
| `pm.max_children` | 20 |
| `pm.start_servers` | 4 |
| `pm.min_spare_servers` | 2 |
| `pm.max_spare_servers` | 8 |

Monitor with `php-fpm status` and adjust by memory per worker (~50–80 MB).

## PostgreSQL

- Enable `pgvector` extension for AI module
- Connection pooling: PgBouncer for high concurrency
- Daily `pg_dump` backups — see [backup-strategy.md](./backup-strategy.md)
- `shared_buffers` ≈ 25% RAM on dedicated DB server

## Supervisor Programs

| Program | Command |
|---------|---------|
| `againerp-horizon` | `php artisan horizon` |
| `againerp-scheduler` | Optional; cron preferred |

Horizon dashboard protected behind admin auth or IP allowlist.

## Deployment Updates

```bash
cd /var/www/againerp
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache && php artisan route:cache && php artisan view:cache
php artisan horizon:terminate  # graceful worker restart
```

Use [cicd.md](./cicd.md) for automated deploys.

## Zero-Downtime Considerations

- Run migrations before switching traffic (backward-compatible migrations)
- `php artisan down` only for breaking schema changes
- Blue-green: second VPS + load balancer (see [kubernetes.md](./kubernetes.md) for scale-out)

## Monitoring

Application and infrastructure monitoring per [monitoring.md](./monitoring.md):

- Health endpoint, error tracking, slow queries
- Disk, CPU, memory alerts
- SSL expiry monitoring

## Related Documents

- [docker.md](./docker.md) — containerized alternative
- [security-hardening.md](./security-hardening.md)
- [disaster-recovery.md](./disaster-recovery.md)

---

**Last Updated:** 2026-06-12
