# Database Naming Conventions

> Parent: [database/standards.md](./standards.md)

## Tables

- Lowercase, snake_case, plural noun
- Module prefix: `{module}_{entity}` → `ecommerce_products`
- Pivot: alphabetical order → `ecommerce_product_tags`

## Columns

- snake_case
- Foreign keys: `{singular_entity}_id`
- Booleans: `is_{name}`
- Timestamps: `created_at`, `updated_at`, `deleted_at`
- Money: `amount` + `currency_code` (never store currency symbol)
- Translations: `{entity}_translations` table or JSON `translations` column

## Indexes

- `idx_{table}_{column(s)}`
- Unique: `uniq_{table}_{column(s)}`

## Migrations

- Filename: `YYYY_MM_DD_HHMMSS_{description}.php`
- One logical change per migration
- Always include `down()` method
