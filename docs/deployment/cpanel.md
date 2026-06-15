# cPanel Deployment

> **Status:** Draft  
> **Phase:** 9 — DevOps (Step 81)  
> **Parent:** [deployment/README.md](./README.md)

---

## Purpose

Deploy AgainERP on shared hosting with cPanel for small businesses, agencies, and staging environments where full server control is not required.

## When to Use

| Suitable | Not Suitable |
|----------|--------------|
| Single-tenant installs | High-traffic multi-tenant SaaS |
| < 500 concurrent users | Kubernetes-scale orchestration |
| Budget-conscious hosting | Custom kernel / container needs |
| Quick client deployments | Heavy queue/worker farms |

## Requirements

| Component | Minimum |
|-----------|---------|
| PHP | 8.2+ (match [DEVELOPMENT_STANDARDS.md](../DEVELOPMENT_STANDARDS.md)) |
| Database | MySQL 8.0+ or PostgreSQL 14+ (PostgreSQL preferred for AI pgvector) |
| Web server | Apache or LiteSpeed with mod_rewrite |
| Memory | 512 MB PHP limit (1 GB recommended) |
| Extensions | PDO, mbstring, openssl, curl, gd, intl, redis (optional) |
| Cron | cPanel Cron Jobs (required for queue, scheduler) |
| SSL | AutoSSL or Let's Encrypt via cPanel |

## Directory Layout

```
/home/{user}/
├── public_html/          → Document root (index.php only)
├── againerp/             → Application code (above web root)
├── storage/              → Symlink or outside public_html
└── backups/              → Local backup staging
```

Document root points to `public_html` with front controller. Application files live outside web root per security best practice.

## Installation Steps

1. Upload codebase via Git Version Control or SFTP
2. Create database and user in cPanel MySQL/PostgreSQL Databases
3. Copy `.env.example` → `.env`; set `APP_URL`, DB credentials, `APP_KEY`
4. Run migrations: SSH `php artisan migrate --force` (or deployment script)
5. Set storage permissions: `storage/` and `bootstrap/cache/` writable
6. Configure cron: `* * * * * php /home/user/againerp/artisan schedule:run`
7. Configure queue worker via cron or Supervisor if available
8. Enable SSL and force HTTPS in `.env`

## PHP Configuration

| Setting | Value |
|---------|-------|
| `memory_limit` | 512M |
| `max_execution_time` | 120 (web), 0 (CLI) |
| `upload_max_filesize` | 64M |
| `post_max_size` | 64M |
| `opcache.enable` | 1 |

Set via MultiPHP INI Editor or `.user.ini`.

## Queue & Background Jobs

cPanel often lacks persistent workers. Options:

| Option | Approach |
|--------|----------|
| Cron-based queue | `*/1 * * * * php artisan queue:work --stop-when-empty` |
| External worker | Small VPS runs Horizon connected to same Redis |
| Sync driver | Development only — not for production |

## File Storage

Local disk for uploads; configure S3-compatible storage in `.env` for media at scale (see [backup-strategy.md](./backup-strategy.md)).

## Limitations & Mitigations

| Limitation | Mitigation |
|------------|------------|
| No Redis | Use database queue driver (slower) |
| Shared resources | Enable OPcache, query caching |
| No pgvector | Use external embedding service; defer AI search |
| SSH restricted | Use cPanel Terminal or Git deploy hooks |

## Post-Deploy Checklist

- [ ] Health check: `GET /api/health` returns 200
- [ ] Cron verified in cPanel
- [ ] `.env` not web-accessible
- [ ] Error reporting off (`APP_DEBUG=false`)
- [ ] Monitoring configured — see [monitoring.md](./monitoring.md)

## Related Documents

- [vps.md](./vps.md) — upgrade path when outgrowing shared hosting
- [security-hardening.md](./security-hardening.md)
- [backup-strategy.md](./backup-strategy.md)

---

**Last Updated:** 2026-06-12
