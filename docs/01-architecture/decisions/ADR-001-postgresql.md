# ADR-001: Use PostgreSQL as Primary Database

> **Status:** Accepted  
> **Date:** 2026-06-12  
> **Deciders:** Platform Architecture Team

---

## Context

AgainERP requires ACID transactions, complex joins, JSON support, full-text search, partitioning for 10M+ orders, and enterprise-grade reliability at scale.

## Decision

Use **PostgreSQL** as the sole primary relational database for all tenants and modules.

## Consequences

### Positive

- Strong ACID, mature ecosystem, JSONB, partitioning, extensions (pg_trgm, etc.)
- Single DB skill set for team
- Aligns with [database/MASTER_DATABASE_ARCHITECTURE.md](../../05-development/database/MASTER_DATABASE_ARCHITECTURE.md)

### Negative

- Horizontal write scaling requires read replicas and careful partitioning
- Team must enforce module table ownership discipline

## Related Documents

- [database/MASTER_DATABASE_ARCHITECTURE.md](../../05-development/database/MASTER_DATABASE_ARCHITECTURE.md)
- [DATABASE_REGISTRY.md](../../00-foundation/registries/DATABASE_REGISTRY.md)
