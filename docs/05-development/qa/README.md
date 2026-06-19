# Quality Assurance & Production

## Purpose
Documentation: README.

## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

> **Status:** Draft  
> **Phase:** 10 — Production (Steps 90–100)


## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

Documentation for testing, release management, production deployment, optimization, and launch readiness.

---

## Documents

| Document | Step | Description |
|----------|------|-------------|
| [testing-strategy.md](./testing-strategy.md) | 90 | Overall test approach and pyramid |
| [qa-standards.md](./qa-standards.md) | 91 | Quality gates and acceptance criteria |
| [load-testing.md](./load-testing.md) | 92 | Performance and stress testing |
| [security-testing.md](./security-testing.md) | 93 | Security test procedures |
| [uat.md](./uat.md) | 94 | User acceptance testing |
| [release-management.md](./release-management.md) | 95 | Versioning and release process |
| [production-deployment.md](./production-deployment.md) | 96 | Production deploy checklist |
| [optimization.md](./optimization.md) | 98 | Performance optimization |
| [documentation-review.md](./documentation-review.md) | 99 | Doc audit vs implementation |
| [launch-checklist.md](./launch-checklist.md) | 100 | Go-live checklist |

## Monitoring (Step 97)

Production monitoring is documented in deployment — not duplicated here:

- [deployment/monitoring.md](../deployment/monitoring.md)

## Workflow

```
Test (unit → integration → UAT) → Security & load tests → Release approval → Production deploy → Monitor → Optimize → Launch
```

Governance: [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · Sequence: [MASTER_DEVELOPMENT_SEQUENCE.md](../../10-roadmap/MASTER_DEVELOPMENT_SEQUENCE.md)

---

**Last Updated:** 2026-06-12
