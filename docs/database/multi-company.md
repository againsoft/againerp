# Multi Company Standards

> Parent: [DEVELOPMENT_STANDARDS.md §9](../DEVELOPMENT_STANDARDS.md#9-multi-company-ready)  
> **SaaS:** [SAAS_PLATFORM_ARCHITECTURE.md](../SAAS_PLATFORM_ARCHITECTURE.md) · [platform/TENANT_ARCHITECTURE.md](../platform/TENANT_ARCHITECTURE.md)

## Hierarchy

```
Tenant (SaaS — platform layer)
└── Company
    └── Branch
        └── Warehouse
```

Self-hosted / single company: one tenant with one company. Schema still uses `company_id` on all business tables.

## Rules

| Rule | Description |
|------|-------------|
| `company_id` on every business table | Mandatory |
| Active company in session/token | User context |
| Company switcher in UI | For multi-company users |
| Data isolation | Queries never cross companies |
| Branch scope | Optional `branch_id` where location matters |
| Warehouse scope | `warehouse_id` on inventory transactions |

## Version 1

Single company deployment is valid — but schema and queries must still use `company_id` so multi-company requires no schema rewrite.

## API

- `X-Company-Id` header or company claim in JWT
- All list/create/update endpoints validate company scope
