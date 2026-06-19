# Architecture — Ecommerce

## Purpose
Ecommerce module architecture — scope, features, data ownership, and integration boundaries.

## When To Read
Read this file only if working on Ecommerce architecture, features, or module boundaries.

## Related Files
- [Manifest](ModuleManifest.md)
- [Permissions](Permissions.md)
- [Workflow](Workflow.md)
- [API](API.md)
- [Database](Database.md)
- [Dependencies](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next
- [Data ownership](Database.md)

---

> **Status:** Active  
> **Module:** Ecommerce  
> **Document Type:** Architecture

---

## Purpose

Define the Ecommerce module boundaries, integrations, and design decisions for AgainERP Phase 1. This module provides online store management — catalog, cart, checkout, orders, and storefront configuration — fully integrated with Core Framework and sibling modules.

## Business Goals

- Launch a production-ready online sales channel inside AgainERP
- Sync product stock and orders with Inventory and Sales in real time
- Provide admin UI for full store operations without leaving the ERP
- Prove the modular architecture pattern for all future modules

## User Roles

| Role | Relevance |
|------|-----------|
| Store Admin | Full module access |
| Product Manager | Products, categories, brands, inventory views |
| Order Manager | Orders, returns, shipping, payments |
| Marketing Manager | Coupons, campaigns, abandoned cart |
| Customer Support | Orders, returns, reviews |
| Customer (portal) | Storefront only — separate permission scope |

## Dashboard

Command center architecture: [dashboard/ARCHITECTURE.md](./dashboard/ARCHITECTURE.md)  
8 screens · widget-based · analytics layer · AI-ready · < 2s load target

## Catalog

Central product master data: [catalog/ARCHITECTURE.md](./catalog/ARCHITECTURE.md)  
8 product types · 1M+ scale · `catalog_*` schema · Inventory/Sales/POS integration

## Storefront

Customer-facing website architecture: [ECOMMERCE_STOREFRONT_ARCHITECTURE.md](./ECOMMERCE_STOREFRONT_ARCHITECTURE.md)  
Public shop · checkout · account · AI · SEO · mobile-first · API-only (not admin)

## Orders

Central transaction engine: [orders/ARCHITECTURE.md](./orders/ARCHITECTURE.md)  
Lifecycle · payments · shipping · returns · `commerce_*` schema · 1M+ orders

## Page Layout

Admin shell follows AgainERP global layout:

- Left sidebar: Ecommerce menu groups (see `UI.md` navigation map)
- Top bar: search, notifications, user menu
- Content area: module pages per `Menus/` documentation

## Core Shared Entities (Not Owned by Ecommerce)

Ecommerce **uses** these Core entities — it does not duplicate them.  
Full docs: [core/shared-entities.md](../../02-core-platform/shared-entities.md)

| Core Entity | Ecommerce Usage |
|-------------|-----------------|
| [Contacts](../../02-core-platform/entities/contacts.md) | Store customers (`contact_id` on orders) |
| [Addresses](../../02-core-platform/entities/addresses.md) | Shipping & billing addresses |
| [Companies](../../02-core-platform/entities/companies.md) | Multi-company store scope |
| [Branches](../../02-core-platform/entities/branches.md) | Store / pickup locations |
| [Users](../../02-core-platform/entities/users.md) | Admin staff, `created_by` |
| [Roles](../../02-core-platform/entities/roles.md) / [Permissions](../../02-core-platform/entities/permissions.md) | `ecommerce.*` ACL |
| [Media Library](../../02-core-platform/entities/media-library.md) | Product images |
| [Attachments](../../02-core-platform/entities/attachments.md) | Link media to products/orders |
| [Tags](../../02-core-platform/entities/tags.md) | Product labels |
| [Notes](../../02-core-platform/entities/notes.md) | Internal order notes |
| [Activities](../../02-core-platform/entities/activities.md) | Follow-ups, abandoned cart tasks |
| [Comments](../../02-core-platform/entities/comments.md) | Review replies, order discussion |

## Fields

Module-owned entities (Ecommerce tables only):

| Entity | Key Fields | Notes |
|--------|------------|-------|
| Product | name, sku, price, status, category_id, brand_id | Images via `attachments` → `media` |
| Category | name, parent_id, slug, sort_order | Tree structure |
| Brand | name, slug, logo_media_id | Logo via Media Library |
| Order | order_number, contact_id, status, total | `contact_id` → Core contacts |
| Customer Group | name, discount_rules | Groups Core contacts |
| Coupon | code, discount_type, value, expiry | |
| Review | product_id, contact_id, rating, status | Moderation workflow |

## Actions

| Action | Trigger | Cross-Module Effect |
|--------|---------|---------------------|
| Place Order | Checkout complete | Creates Sales order, reserves stock |
| Confirm Payment | Payment callback | Posts to Accounting |
| Approve Return | Admin action | Restocks Inventory |
| Publish Product | Status change | Visible on Website storefront |

## Validation Rules

- SKU must be unique per company
- Order cannot confirm without available stock
- Coupon cannot exceed cart subtotal
- Tax calculated per Tax Settings and customer zone

## Workflow

```
Browse → Add to Cart → Checkout → Payment → Order Confirmed
                                              ↓
                                    Sales Order Created
                                              ↓
                                    Inventory Reserved
```

See `Workflow.md` for full state machines.

## Permissions

Module namespace: `ecommerce.*`

See `Permissions.md` for full ACL matrix and record rules.

## Database Tables

Prefix: `ecommerce_` (e.g. `ecommerce_products`, `ecommerce_orders`)

See `Database.md` for full schema and ERD.

## API Endpoints

Base path: `/api/v1/ecommerce/`

See `API.md` for REST contracts. Storefront uses read-optimized public endpoints.

## Reports Impact

- Sales Reports, Customer Reports, Product Reports (module-owned)
- Feeds platform Reporting Engine dashboards

See [Reports.md](./Reports.md) for report screen index · [reports/ARCHITECTURE.md](./reports/ARCHITECTURE.md) for report engine deep dive.

## AI Integration

Commerce AI tools (admin): see [AI.md](./AI.md) for screen index. Platform AI OS: [06-ai/platform/ai/AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md).

## Future Enhancements

- Multi-store / multi-warehouse storefronts
- Subscription products
- B2B wholesale pricing tiers
- Marketplace vendor support

## Dependencies

- **Core Shared Entities:** Contacts, Addresses, Companies, Branches, Users, Roles, Permissions, Media Library, Tags, Notes, Activities, Comments, Attachments
- **Core Services:** Workflow Engine, Notification System, Reporting Engine, API Layer
- **Modules:** Inventory (stock), Sales (orders), Accounting (payments), Website (storefront), CRM (shared contacts), Marketing (campaigns)

---

**Module:** Ecommerce  
**Last Updated:** 2026-06-12  
**Author:** —  
**Reviewers:** —
