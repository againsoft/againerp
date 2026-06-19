# Database Documentation

## Purpose
Documentation: README.

## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

> **Status:** Approved  
> **DBMS:** PostgreSQL  
> **Registry:** [DATABASE_REGISTRY.md](../../00-foundation/registries/DATABASE_REGISTRY.md) — **master entity & domain blueprint (Step 14)**  
> **Master blueprint:** [MASTER_DATABASE_ARCHITECTURE.md](./MASTER_DATABASE_ARCHITECTURE.md)


## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

Global database conventions and architecture for AgainERP.

## Primary Documents

| Document | Description |
|----------|-------------|
| [**DATABASE_REGISTRY.md**](../../00-foundation/registries/DATABASE_REGISTRY.md) | **Master registry** — domains, entities, ownership, governance (no SQL) |
| [**MASTER_DATABASE_ARCHITECTURE.md**](./MASTER_DATABASE_ARCHITECTURE.md) | Physical blueprint — indexes, partitioning, layer detail |
| [ER_DIAGRAM.md](./ER_DIAGRAM.md) | Platform-wide ER diagrams (Mermaid) |
| [standards.md](./standards.md) | Mandatory columns on every table |
| [naming-conventions.md](./naming-conventions.md) | Table, column, index naming |
| [multi-company.md](./multi-company.md) | `company_id` and data isolation |
| [audit-trail.md](./audit-trail.md) | Soft delete, revision history |

## Module Schemas

| Module | Document |
|--------|----------|
| Core | [core/ARCHITECTURE.md](../../02-core-platform/ARCHITECTURE.md) § Database |
| Catalog | [catalog/ARCHITECTURE.md](../../03-business-modules/ecommerce/catalog/ARCHITECTURE.md) |
| Orders | [orders/ARCHITECTURE.md](../../03-business-modules/ecommerce/orders/ARCHITECTURE.md) |
| Ecommerce (index) | [modules/ecommerce/Database.md](../../03-business-modules/ecommerce/Database.md) |

## Technology

| Layer | Technology |
|-------|------------|
| OLTP | PostgreSQL 15+ |
| Cache | Redis |
| Search | Meilisearch → Elasticsearch |
| Analytics / BI | Read replica → Data warehouse (future) |
