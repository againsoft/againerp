# AgainERP — Platform ER Diagram

## Purpose
Documentation: ER DIAGRAM.

## When To Read
Read only if your task involves er diagram.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

> **Status:** Draft  
> **Parent:** [MASTER_DATABASE_ARCHITECTURE.md](./MASTER_DATABASE_ARCHITECTURE.md) §26  
> **DBMS:** PostgreSQL


## When To Read
Read only if your task involves er diagram.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

Consolidated entity-relationship view across all domains. Implementation detail per module in submodule architecture docs.

---

## Core Layer

```mermaid
erDiagram
    companies ||--o{ branches : has
    companies ||--o{ users : employs
    companies ||--o{ contacts : owns
    companies ||--o{ roles : defines
    users ||--o{ user_roles : has
    roles ||--o{ role_permissions : grants
    permissions ||--o{ role_permissions : in
    contacts ||--o{ addresses : has
    contacts ||--o{ activities : linked
    users ||--o{ notifications : receives
    media ||--o{ attachments : linked
```

---

## Catalog + Inventory

```mermaid
erDiagram
    catalog_products ||--o{ catalog_variants : has
    catalog_products }o--|| catalog_categories : in
    catalog_products }o--o| catalog_brands : from
    catalog_variants ||--o{ inventory_stock_levels : stocked
    inventory_warehouses ||--o{ inventory_stock_levels : holds
    inventory_stock_levels ||--o{ inventory_stock_movements : logs
    catalog_products ||--o{ catalog_product_translations : i18n
```

---

## Orders + Customers

```mermaid
erDiagram
    contacts ||--o{ commerce_orders : places
    commerce_orders ||--o{ commerce_order_items : contains
    commerce_order_items }o--|| catalog_variants : references
    commerce_orders ||--o{ commerce_payments : paid_by
    commerce_orders ||--o{ commerce_shipments : shipped_via
    commerce_orders ||--o{ commerce_returns : may_return
    contacts ||--o{ commerce_wallets : has
    contacts ||--o{ commerce_wishlists : saves
```

---

## Marketing + Analytics

```mermaid
erDiagram
    marketing_campaigns ||--o{ marketing_coupons : includes
    commerce_orders }o--o| marketing_coupons : applied
    analytics_sales }o--|| companies : scoped
    analytics_orders }o--|| companies : scoped
    analytics_products }o--|| companies : scoped
```

---

## Builder + SEO + Media

```mermaid
erDiagram
    builder_pages ||--o{ builder_sections : contains
    builder_sections ||--o{ builder_widgets : renders
    seo_meta }o--|| builder_pages : describes
    media }o--o{ catalog_products : illustrates
    media }o--o{ builder_widgets : embeds
```

---

## Cross-Module Ownership

| Entity | Owner Module | Table Prefix |
|--------|--------------|--------------|
| Users, Contacts | Core | (unprefixed) |
| Products | Catalog | `catalog_*` |
| Orders | Orders | `commerce_*` |
| Stock | Inventory | `inventory_*` |
| Campaigns | Marketing | `marketing_*` |
| Pages | Builder | `builder_*` |
| Aggregates | Analytics | `analytics_*` |
| Embeddings | AI | `ai_*` |

Full schema: [MASTER_DATABASE_ARCHITECTURE.md](./MASTER_DATABASE_ARCHITECTURE.md)
