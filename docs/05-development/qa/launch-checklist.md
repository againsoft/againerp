# Launch Checklist

## Purpose
Documentation: launch-checklist.

## When To Read
Read only if your task involves launch-checklist.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

> **Status:** Draft  
> **Phase:** 10 — Production (Step 100)  
> **Parent:** [qa/README.md](./README.md)

---


## When To Read
Read only if your task involves launch-checklist.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## Purpose

Final go/no-go checklist before AgainERP production launch. All sections must be signed off by designated owners.

## Governance & Documentation

| # | Item | Owner | Done |
|---|------|-------|------|
| 1 | Phase 0–10 documentation complete (Draft minimum) | Architect | ⬜ |
| 2 | Launch modules marked **Ready** per [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) | PO | ⬜ |
| 3 | [documentation-review.md](./documentation-review.md) audit complete | Doc Lead | ⬜ |
| 4 | CHANGELOG current for release version | Product | ⬜ |
| 5 | PRD and scope agreement documented | PO | ⬜ |

## Quality Assurance

| # | Item | Owner | Done |
|---|------|-------|------|
| 6 | [testing-strategy.md](./testing-strategy.md) — CI green on `main` | QA | ⬜ |
| 7 | [qa-standards.md](./qa-standards.md) — no open Critical/High defects | QA | ⬜ |
| 8 | [uat.md](./uat.md) — Product Owner sign-off | PO | ⬜ |
| 9 | [load-testing.md](./load-testing.md) — SLAs met | QA + DevOps | ⬜ |
| 10 | [security-testing.md](./security-testing.md) — pentest passed | Security | ⬜ |

## Infrastructure & Deployment

| # | Item | Owner | Done |
|---|------|-------|------|
| 11 | Production environment provisioned | DevOps | ⬜ |
| 12 | [backup-strategy.md](../deployment/backup-strategy.md) — automated, tested restore | DevOps | ⬜ |
| 13 | [security-hardening.md](../deployment/security-hardening.md) checklist | DevOps | ⬜ |
| 14 | [monitoring.md](../deployment/monitoring.md) — alerts configured | DevOps | ⬜ |
| 15 | [disaster-recovery.md](../deployment/disaster-recovery.md) — runbook tested | DevOps | ⬜ |
| 16 | SSL/TLS valid, HTTPS enforced | DevOps | ⬜ |
| 17 | DNS configured, TTL appropriate | DevOps | ⬜ |

## Release & Deploy

| # | Item | Owner | Done |
|---|------|-------|------|
| 18 | [release-management.md](./release-management.md) — version tagged | Tech Lead | ⬜ |
| 19 | [production-deployment.md](./production-deployment.md) — deploy rehearsed on staging | DevOps | ⬜ |
| 20 | Rollback plan documented and tested | DevOps | ⬜ |
| 21 | [cicd.md](../deployment/cicd.md) — pipeline production-ready | DevOps | ⬜ |

## Application Readiness

| # | Item | Owner | Done |
|---|------|-------|------|
| 22 | `APP_DEBUG=false`, `APP_ENV=production` | DevOps | ⬜ |
| 23 | Cron / queue workers running | DevOps | ⬜ |
| 24 | Payment gateways in live mode (if applicable) | Product | ⬜ |
| 25 | Email/SMS providers configured and tested | DevOps | ⬜ |
| 26 | Initial admin accounts created; default passwords changed | Security | ⬜ |
| 27 | MFA enabled for super-admin accounts | Security | ⬜ |

## Performance & Optimization

| # | Item | Owner | Done |
|---|------|-------|------|
| 28 | [optimization.md](./optimization.md) checklist complete | Tech Lead | ⬜ |
| 29 | CDN / media storage configured | DevOps | ⬜ |
| 30 | Database indexes verified | DBA | ⬜ |

## Business & Support

| # | Item | Owner | Done |
|---|------|-------|------|
| 31 | Customer communication / launch announcement ready | Marketing | ⬜ |
| 32 | Support team trained on launch scope | Support | ⬜ |
| 33 | Status page / incident comms channel ready | Ops | ⬜ |
| 34 | Legal: privacy policy, terms of service published | Legal | ⬜ |

## Go / No-Go Meeting

| Attendee | Role | Go | No-Go |
|----------|------|-----|-------|
| | Product Owner | ⬜ | ⬜ |
| | Tech Lead | ⬜ | ⬜ |
| | QA Lead | ⬜ | ⬜ |
| | DevOps Lead | ⬜ | ⬜ |
| | Security | ⬜ | ⬜ |

**Launch decision:** ⬜ GO / ⬜ NO-GO  
**Date:** _______________  
**Production version:** _______________

## Post-Launch (First 48 Hours)

- [ ] Monitor error rate and latency — [monitoring.md](../deployment/monitoring.md)
- [ ] Verify backup job succeeded
- [ ] Support queue staffed for elevated volume
- [ ] Hotfix process on standby — [release-management.md](./release-management.md)
- [ ] Post-launch retrospective scheduled (within 2 weeks)

---

**Last Updated:** 2026-06-12
