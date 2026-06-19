# Database — Ecommerce

## Purpose
Ecommerce module database — owned tables and schema.

## When To Read
Read this file only if working on Ecommerce database tables, migrations, or data ownership.

## Related Files
- [Architecture](Architecture.md)
- [API](API.md)
- [Core contacts](../../02-core-platform/entities/contacts.md)

## Read Next
- [Architecture](Architecture.md)
- [API](API.md)

---

> **Status:** Draft  
> **Module:** Ecommerce  
> **Document Type:** Database

---


## When To Read
Read this file only if working on Ecommerce database tables, migrations, or data ownership.

## Related Files
- [Architecture](Architecture.md)
- [API](API.md)
- [Core contacts](../../02-core-platform/entities/contacts.md)

## Read Next
- [Architecture](Architecture.md)
- [API](API.md)

---

## Purpose

Define Ecommerce module tables. Customer, address, media, and permission data live in **Core** — not duplicated here.

## Core Shared Entities (Reference Only)

These tables are owned by Core. Ecommerce stores foreign keys only.

| Core Table | Ecommerce FK | Doc |
|------------|--------------|-----|
| `contacts` | `ecommerce_orders.contact_id` | [contacts.md](../../02-core-platform/entities/contacts.md) |
| `addresses` | polymorphic on orders & contacts | [addresses.md](../../02-core-platform/entities/addresses.md) |
| `companies` | `company_id` on all tables | [companies.md](../../02-core-platform/entities/companies.md) |
| `branches` | optional `branch_id` on orders | [branches.md](../../02-core-platform/entities/branches.md) |
| `users` | audit columns | [users.md](../../02-core-platform/entities/users.md) |
| `media` | via `attachments` | [media-library.md](../../02-core-platform/entities/media-library.md) |
| `attachments` | polymorphic on products/orders | [attachments.md](../../02-core-platform/entities/attachments.md) |
| `tags` / `taggables` | product tagging | [tags.md](../../02-core-platform/entities/tags.md) |
| `notes` | polymorphic on orders | [notes.md](../../02-core-platform/entities/notes.md) |
| `activities` | polymorphic on orders/contacts | [activities.md](../../02-core-platform/entities/activities.md) |
| `comments` | polymorphic on reviews/orders | [comments.md](../../02-core-platform/entities/comments.md) |

**Rule:** No `ecommerce_customers` table. Use `contacts` with `contact_types: ['customer']`.

---

## Catalog Tables (Product Master Data)

Owned by **Catalog** — platform product spine. Full design: [catalog/ARCHITECTURE.md § Database](./catalog/ARCHITECTURE.md#database-architecture).

Prefix: `catalog_*`. All tables include standard columns per [database/standards.md](../../05-development/database/standards.md).

| Table | Purpose |
|-------|---------|
| `catalog_products` | Master product (all types) |
| `catalog_product_variants` | SKU variants |
| `catalog_product_translations` | i18n |
| `catalog_product_seo` | SEO per locale |
| `catalog_product_ai` | AI metadata |
| `catalog_categories` | Category tree |
| `catalog_brands` | Brand master |
| `catalog_attributes` / `catalog_attribute_groups` | Specifications |
| `catalog_product_prices` / `catalog_price_history` | Pricing |
| `catalog_collections` / `catalog_bundles` | Merchandising |
| `catalog_reviews` / `catalog_questions` | UGC |
| `catalog_product_history` | Field-level audit |
| `catalog_import_jobs` / `catalog_export_jobs` | Bulk ops |

## Orders Tables (Transaction Engine)

Owned by **Orders** module. Full design: [orders/ARCHITECTURE.md § Database](./orders/ARCHITECTURE.md#database-architecture).

Prefix: `commerce_*`. Carts, orders, payments, shipments — not product master data.

| Table | Purpose |
|-------|---------|
| `commerce_orders` | Master order (`contact_id` → Core) |
| `commerce_order_items` | Line items → `catalog_product_variants` |
| `commerce_order_status_history` | Status audit |
| `commerce_order_payments` | Payment transactions |
| `commerce_order_shipments` | Shipments & tracking |
| `commerce_order_returns` / `_return_items` | RMA |
| `commerce_order_refunds` | Refunds |
| `commerce_order_timeline` | Event feed |
| `commerce_carts` / `commerce_cart_items` | Carts & abandoned |
| `commerce_quotations` / `_quotation_items` | Quotes |

## Ecommerce-Owned Tables (Supporting)

Prefix: `ecommerce_`. Marketing, settings, reviews — not core order engine.

| Table | Purpose |
|-------|---------|
| `ecommerce_customer_groups` | Pricing / discount groups |
| `ecommerce_contact_groups` | Pivot: contacts ↔ customer_groups |
| `ecommerce_coupons` | Discount codes |
| `ecommerce_coupon_usages` | Redemption tracking |
| `ecommerce_reviews` | Product reviews (`contact_id` FK) |
| `ecommerce_shipping_methods` | Shipping options |
| `ecommerce_shipping_zones` | Zone-based rates |
| `ecommerce_shipping_rates` | Rate rules |
| `ecommerce_settings` | Module key-value settings |
| `ecommerce_product_views` | Product view counts (analytics) |

---

## Dashboard Analytics Tables (Core-Owned)

Owned by **Core** analytics layer; Ecommerce Dashboard is first consumer. Full design: [dashboard/ARCHITECTURE.md §16](./dashboard/ARCHITECTURE.md#16-database-architecture).

| Table | Purpose |
|-------|---------|
| `analytics_dashboard_cache` | Widget response cache (TTL) |
| `analytics_sales` | Daily sales aggregates (`module=ecommerce`) |
| `analytics_revenue` | Revenue & profit aggregates |
| `analytics_customers` | CLV, order counts per contact |
| `analytics_products` | Units sold, views, revenue per product |
| `analytics_inventory` | Stock alert snapshots |
| `activity_logs` | Audit trail (Core) |
| `notifications` | User notifications (Core) |
| `ai_insights` | Pre-computed AI insight cards |
| `dashboard_user_preferences` | Layout & quick action prefs |

---

## Key Relationships

```
contacts (Core)
    └── commerce_orders.contact_id
    └── ecommerce_reviews.contact_id
    └── addresses (polymorphic on orders)

catalog_products
    └── attachments → media (Core)
    └── taggables → tags (Core)
    └── catalog_product_variants
    └── catalog_categories
    └── catalog_brands
    └── inventory_item_id → Inventory module

commerce_orders
    └── commerce_order_items → catalog_product_variants
    └── commerce_order_payments
    └── commerce_order_shipments
    └── commerce_order_returns / commerce_order_refunds
    └── commerce_order_timeline
    └── addresses (shipping/billing, Core)
    └── notes, comments (Core, polymorphic)
    └── attachments (invoices, Core)
```

---

## Commerce Orders — Key Columns

See [orders/ARCHITECTURE.md](./orders/ARCHITECTURE.md) for full lifecycle and fields.

| Column | Type | Notes |
|--------|------|-------|
| `contact_id` | FK → contacts | Customer — **not** a local customer table |
| `order_number` | VARCHAR | Unique per company |
| `status` | ENUM | draft → pending → confirmed → … → completed |
| `order_type` | ENUM | online, pos, manual, wholesale, … |
| `grand_total` | DECIMAL | |
| `currency_code` | CHAR(3) | BDT, USD, EUR |

---

## Validation Rules

- `contact_id` required on confirmed orders
- No duplicate `order_number` per `company_id`
- Product images: `attachments` only — no `image_path` column on products
- Soft delete on all business tables

---

## Dependencies

- **Core:** [shared-entities.md](../../02-core-platform/shared-entities.md)
- **Modules:** Inventory (`inventory_product_id` on variants), Sales (order sync)

---

**Module:** Ecommerce  
**Last Updated:** 2026-06-12  
**Author:** —  
**Reviewers:** —
