# Security Hardening

## Purpose
Documentation: security-hardening.

## When To Read
Read only if your task involves security-hardening.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

> **Status:** Draft  
> **Phase:** 9 — DevOps (Step 89)  
> **Parent:** [deployment/README.md](./README.md)

---


## When To Read
Read only if your task involves security-hardening.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## Purpose

Production security baseline for AgainERP deployments: infrastructure, application, data, and operational controls. Complements application-level security in Core and module docs.

## Security Layers

```
Internet → WAF/CDN → TLS → Firewall → App → AuthZ → Data encryption
```

## Infrastructure Hardening

| Control | Implementation |
|---------|----------------|
| SSH | Key-only auth, disable root login, fail2ban |
| Firewall | UFW/iptables — allow 22, 80, 443 only |
| OS updates | Unattended security patches |
| Non-root deploy | Dedicated `deploy` user |
| Port exposure | DB/Redis not public |

## TLS & HTTPS

- TLS 1.2+ only; strong cipher suites
- HSTS enabled with `max-age=31536000`
- Auto-renew certificates (Certbot / cert-manager)
- Secure cookies: `SESSION_SECURE_COOKIE=true`

## Application Configuration

| Setting | Production Value |
|---------|------------------|
| `APP_DEBUG` | `false` |
| `APP_ENV` | `production` |
| Error pages | Generic — no stack traces |
| CORS | Explicit allowed origins |
| Rate limiting | API and login endpoints |

## Authentication & Access

- Enforce MFA for admin roles
- Password policy per Core Users entity
- Session timeout and concurrent session limits
- API keys rotated; scoped permissions
- Horizon/admin tools behind auth or VPN

## Data Protection

| Data | Protection |
|------|------------|
| At rest | DB encryption (TDE or disk), S3 SSE |
| In transit | TLS everywhere |
| Secrets | Vault/env — never in Git |
| PII | Field-level encryption where required |
| Backups | Encrypted — [backup-strategy.md](./backup-strategy.md) |

## Dependency Security

- `composer audit` in CI ([cicd.md](./cicd.md))
- Pin dependencies; review major upgrades
- Container image scanning on build
- Subscribe to security advisories (Python, FastAPI, Next.js, PostgreSQL)

## Headers & Web Hardening

| Header | Value |
|--------|-------|
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Content-Security-Policy` | Restrict scripts to self + CDN allowlist |

Disable directory listing. Hide server version tokens.

## Logging & Audit

- Core Audit Logs for sensitive actions
- Centralized log aggregation — no passwords in logs
- Failed login monitoring and alerting ([monitoring.md](./monitoring.md))
- Retain security logs minimum 90 days

## Multi-Tenant Isolation

- `company_id` on all queries — enforced at ORM/policy layer
- Row-level security in PostgreSQL optional defense-in-depth
- Penetration test cross-tenant access annually

## Incident Response

| Phase | Action |
|-------|--------|
| Detect | Alerts, user report |
| Contain | Disable compromised accounts, block IPs |
| Eradicate | Patch, rotate secrets |
| Recover | Clean backup if needed — [disaster-recovery.md](./disaster-recovery.md) |
| Review | Post-incident report |

## Compliance Checklist (Pre-Launch)

- [ ] `APP_DEBUG=false` verified
- [ ] All default passwords changed
- [ ] MFA enabled for super-admins
- [ ] TLS grade A on SSL Labs
- [ ] Backup encryption verified
- [ ] Security test pass — [security-testing.md](../qa/security-testing.md)

## Related Documents

- [monitoring.md](./monitoring.md)
- [disaster-recovery.md](./disaster-recovery.md)
- [DEVELOPMENT_STANDARDS.md](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md)

---

**Last Updated:** 2026-06-12
