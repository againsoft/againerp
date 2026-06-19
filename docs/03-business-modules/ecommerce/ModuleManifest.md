# Ecommerce — Module Manifest

> **Rule:** Update this file on every structural change.  
> Template: [\_MODULE\_MANIFEST\_TEMPLATE.md](../../00-foundation/templates/_MODULE_MANIFEST_TEMPLATE.md)

---

## Purpose
Ecommerce module manifest — install registry and dependencies.

## When To Read
Read this file only if registering, installing, or declaring Ecommerce module dependencies.

## Related Files
- [Architecture](Architecture.md)
- [Dependencies](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next
- [Architecture](Architecture.md)

---

## Module Name

**Ecommerce**

## Version

`1.0.0-orders` (menu v1.0 + dashboard + catalog + orders architecture docs)

## Status

`Draft`

## Dependencies

| Module | Type | Required |
|--------|------|----------|
| Core | Framework | Yes |
| Core Shared Entities | Contacts, Addresses, Media, Tags, Notes, Activities, Comments, Attachments | Yes |
| Orders | Transaction engine | Yes |
| Inventory | Stock reserve/deduct | Yes |
| Sales | Sales order sync | Yes |
| Website | Storefront | Yes |
| CRM | Shared contacts | Yes |
| Accounting | Payment posting | Phase 2 |
| Marketing | Campaigns | Optional |

See [DependencyMap.md](../../01-architecture/DependencyMap.md) and [core/shared-entities.md](../../02-core-platform/shared-entities.md).

---

## Menus (v1.0)

Full tree: [MENU_STRUCTURE.md](./MENU_STRUCTURE.md) · **167 screens**

| Menu Group | Screens | Path |
|------------|---------|------|
| Dashboard | 8 | `Menus/Dashboard/` |
| Catalog | 21 | `Menus/Catalog/` (includes `Products/` subfolder) |
| Inventory | 8 | `Menus/Inventory/` |
| Sales | 9 | `Menus/Sales/` |
| Customers | 9 | `Menus/Customers/` |
| Marketing | 16 | `Menus/Marketing/` |
| Content | 10 | `Menus/Content/` |
| Builder | 14 | `Menus/Builder/` |
| SEO | 12 | `Menus/SEO/` |
| AI | 15 | `Menus/AI/` |
| Media | 9 | `Menus/Media/` |
| Reports | 14 | `Menus/Reports/` |
| System | 24 | `Menus/System/` |

---

## Pages

**167 screen docs** — all `Draft`. Index: [Menus/README.md](./Menus/README.md)

Regenerate: `python3 docs/scripts/generate-ecommerce-menus-v1.py`

---

## Database Tables

_Planned — see `Database.md` for full schema._

| Table | Purpose | Status |
|-------|---------|--------|
| `ecommerce_products` | Product catalog | Planned |
| `ecommerce_product_variants` | SKU variants | Planned |
| `ecommerce_categories` | Category tree | Planned |
| `ecommerce_brands` | Brand master | Planned |
| `ecommerce_orders` | Store orders (`contact_id` → Core) | Planned |
| `ecommerce_order_items` | Order line items | Planned |
| `ecommerce_customer_groups` | Pricing groups | Planned |
| `ecommerce_contact_groups` | Contacts ↔ groups pivot | Planned |
| `ecommerce_coupons` | Discount codes | Planned |
| `ecommerce_reviews` | Product reviews | Planned |
| `ecommerce_shipping_methods` | Shipping config | Planned |
| `ecommerce_shipping_zones` | Zone-based rates | Planned |
| `ecommerce_settings` | Module settings | Planned |

---

## API Endpoints

_Planned — see `API.md` for full contracts._

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/api/v1/ecommerce/products` | List products | Planned |
| POST | `/api/v1/ecommerce/products` | Create product | Planned |
| GET | `/api/v1/ecommerce/orders` | List orders | Planned |
| POST | `/api/v1/ecommerce/orders` | Create order | Planned |

---

## Permissions

_Planned — see `Permissions.md` for full ACL matrix._

| Permission Key | Description | Status |
|----------------|-------------|--------|
| `ecommerce.access` | Module access | Planned |
| `ecommerce.product.read` | View products | Planned |
| `ecommerce.product.write` | Manage products | Planned |
| `ecommerce.order.read` | View orders | Planned |
| `ecommerce.order.write` | Manage orders | Planned |
| `ecommerce.settings` | Module settings | Planned |

---

## Workflows

_Planned — see `Workflow.md`._

| Workflow | States | Status |
|----------|--------|--------|
| Order Lifecycle | draft → confirmed → shipped → delivered | Planned |
| Return Request | requested → approved → refunded | Planned |
| Review Moderation | pending → approved → rejected | Planned |
| Product Publish | draft → published → archived | Planned |

---

## Reports

| Report | File | Status |
|--------|------|--------|
| Sales Reports | `Menus/Reports/Sales Reports.md` | Draft |
| Customer Reports | `Menus/Reports/Customer Reports.md` | Draft |
| Product Reports | `Menus/Reports/Product Reports.md` | Draft |

---

## Module Documents

| File | Status |
|------|--------|
| `Architecture.md` | Draft |
| `Database.md` | Draft |
| `API.md` | Draft |
| `UI.md` | Draft |
| `Workflow.md` | Draft |
| `Permissions.md` | Draft |
| `Development.md` | Draft |
| `Roadmap.md` | Draft |
| `ModuleManifest.md` | Draft |

---

**Last Updated:** 2026-06-12 (Menu structure v1.0)  
**Author:** —  
**Reviewers:** —
