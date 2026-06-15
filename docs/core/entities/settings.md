# Settings Entity

> **Owner:** Core · **Tables:** `core_settings`, `module_settings`, `user_settings`, `feature_flags`

## Purpose

Hierarchical configuration: platform → company → branch → module → user.

## Hierarchy

```
Platform defaults
  └── Company settings (company_settings)
        └── Branch settings (branch_settings)
              └── Module settings (module_settings)
                    └── User preferences (user_settings)
```

## Tables

| Table | Scope | Example Keys |
|-------|-------|--------------|
| `core_settings` | Global | `app.name`, `maintenance_mode` |
| `company_settings` | Per company | `timezone`, `date_format` |
| `branch_settings` | Per branch | `default_warehouse_id` |
| `module_settings` | Per module/company | `ecommerce.checkout.guest_allowed` |
| `user_settings` | Per user | `dashboard.layout`, `locale` |
| `feature_flags` | Per company/plan | `ai.enabled`, `marketplace.enabled` |

## Cache

All settings cached with tag `core:settings:{company_id}` — invalidated on write.

## API

`GET /api/v1/core/settings` · `PATCH /api/v1/core/settings/{key}`
