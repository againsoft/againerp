# Database Standards

> Parent: [DEVELOPMENT_STANDARDS.md §18](../DEVELOPMENT_STANDARDS.md#18-database-standards)  
> **DBMS:** PostgreSQL · **Master:** [MASTER_DATABASE_ARCHITECTURE.md](./MASTER_DATABASE_ARCHITECTURE.md)

## Mandatory Columns (Every Business Table)

```sql
id           BIGSERIAL PRIMARY KEY,
uuid         UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
company_id   BIGINT NOT NULL REFERENCES companies(id),
status       VARCHAR(50) NOT NULL DEFAULT 'active',
created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
deleted_at   TIMESTAMPTZ NULL,
created_by   BIGINT NULL REFERENCES users(id),
updated_by   BIGINT NULL REFERENCES users(id),
deleted_by   BIGINT NULL REFERENCES users(id)
-- indexes: (company_id), (status), (deleted_at) WHERE deleted_at IS NULL
```

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Table | `{module}_{entity}` plural | `catalog_products` |
| Primary key | `id` | — |
| Foreign key | `{entity}_id` | `category_id` |
| Pivot table | `{module}_{a}_{b}` alphabetical | `ecommerce_product_tags` |
| Boolean | `is_{attribute}` | `is_active` |
| Index | `idx_{table}_{columns}` | `idx_ecommerce_products_sku` |

## Rules

- Soft delete only — never hard delete business records
- All queries filter `deleted_at IS NULL` by default
- All queries scope by `company_id`
- Use transactions for multi-table writes
- Migrations are versioned and reversible

## Related

- [audit-trail.md](./audit-trail.md)
- [multi-company.md](./multi-company.md)
- [naming-conventions.md](./naming-conventions.md)
