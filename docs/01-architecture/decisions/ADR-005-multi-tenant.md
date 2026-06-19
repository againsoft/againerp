# ADR-005: Multi-Tenant Shared Database with Row-Level Isolation

> **Status:** Accepted  
> **Date:** 2026-06-12  
> **Deciders:** Platform Architecture Team

---

## Context

AgainERP targets 10k+ SaaS tenants. Database-per-tenant does not scale operationally; schema-per-tenant adds migration complexity.

## Decision

Use **shared PostgreSQL** with `tenant_id` and `company_id` on all tenant-scoped tables. Enforce isolation in application layer and query scoping.

Hierarchy: `Tenant → Company → Branch → Warehouse`.

## Consequences

### Positive

- Simpler ops, single migration path, cost-efficient
- Documented in [SAAS_PLATFORM_ARCHITECTURE.md](../SAAS_PLATFORM_ARCHITECTURE.md)

### Negative

- Requires strict query scoping — no raw queries without tenant filter
- Enterprise customers may request dedicated DB (future override)

## Related Documents

- [platform/TENANT_ARCHITECTURE.md](../../07-saas/TENANT_ARCHITECTURE.md)
- [SAAS_PLATFORM_ARCHITECTURE.md](../SAAS_PLATFORM_ARCHITECTURE.md)
