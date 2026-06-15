# Database Documentation

> **Status:** Approved  
> **DBMS:** PostgreSQL  
> **Registry:** [DATABASE_REGISTRY.md](../DATABASE_REGISTRY.md) — **master entity & domain blueprint (Step 14)**  
> **Master blueprint:** [MASTER_DATABASE_ARCHITECTURE.md](./MASTER_DATABASE_ARCHITECTURE.md)

Global database conventions and architecture for AgainERP.

## Primary Documents

| Document | Description |
|----------|-------------|
| [**DATABASE_REGISTRY.md**](../DATABASE_REGISTRY.md) | **Master registry** — domains, entities, ownership, governance (no SQL) |
| [**MASTER_DATABASE_ARCHITECTURE.md**](./MASTER_DATABASE_ARCHITECTURE.md) | Physical blueprint — indexes, partitioning, layer detail |
| [ER_DIAGRAM.md](./ER_DIAGRAM.md) | Platform-wide ER diagrams (Mermaid) |
| [standards.md](./standards.md) | Mandatory columns on every table |
| [naming-conventions.md](./naming-conventions.md) | Table, column, index naming |
| [multi-company.md](./multi-company.md) | `company_id` and data isolation |
| [audit-trail.md](./audit-trail.md) | Soft delete, revision history |

## Module Schemas

| Module | Document |
|--------|----------|
| Core | [core/ARCHITECTURE.md](../core/ARCHITECTURE.md) § Database |
| Catalog | [catalog/ARCHITECTURE.md](../modules/ecommerce/catalog/ARCHITECTURE.md) |
| Orders | [orders/ARCHITECTURE.md](../modules/ecommerce/orders/ARCHITECTURE.md) |
| Ecommerce (index) | [modules/ecommerce/Database.md](../modules/ecommerce/Database.md) |

## Technology

| Layer | Technology |
|-------|------------|
| OLTP | PostgreSQL 15+ |
| Cache | Redis |
| Search | Meilisearch → Elasticsearch |
| Analytics / BI | Read replica → Data warehouse (future) |
