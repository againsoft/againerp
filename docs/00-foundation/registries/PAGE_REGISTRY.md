# AgainERP — Page Registry

> **Purpose:** Master registry of all admin and prototype pages.  
> **Full listing:** [_registries/PAGE_REGISTRY_FULL.md](./_registries/PAGE_REGISTRY_FULL.md) (314 pages)

**Regenerate:** `python3 docs/scripts/generate-governance-registries.py`

---

## Purpose
Documentation: PAGE REGISTRY.

## When To Read
Read only if your task involves page registry.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## Summary

| Source | Pages | Status |
|--------|-------|--------|
| Ecommerce Menus | 167 | Draft |
| UI Prototype | 147 | Stub |
| **Total** | **314** | — |

---

## Registry Schema

| Field | Description |
|-------|-------------|
| Page Name | Screen title |
| Module | Owner module |
| Menu | Menu group |
| URL | Admin route (planned) |
| Permissions | Required permission keys |
| Related APIs | Endpoints used |
| Related Tables | Owned tables |
| AI Features | AI tools on page |
| Doc Path | Screen specification file |
| Status | Draft · Ready · Stub |

---

## Ecommerce — Dashboard (8)

| Page | Menu | Doc | Permission |
|------|------|-----|------------|
| Overview | Dashboard | [Menus/Dashboard/Overview.md](../../03-business-modules/ecommerce/Menus/Dashboard/Overview.md) | `ecommerce.dashboard.view` |
| Sales Analytics | Dashboard | [Sales Analytics.md](../../03-business-modules/ecommerce/Menus/Dashboard/Sales Analytics.md) | `ecommerce.dashboard.analytics` |
| Revenue Analytics | Dashboard | [Revenue Analytics.md](../../03-business-modules/ecommerce/Menus/Dashboard/Revenue Analytics.md) | `ecommerce.dashboard.analytics` |
| Customer Analytics | Dashboard | [Customer Analytics.md](../../03-business-modules/ecommerce/Menus/Dashboard/Customer Analytics.md) | `ecommerce.dashboard.analytics` |
| Product Analytics | Dashboard | [Product Analytics.md](../../03-business-modules/ecommerce/Menus/Dashboard/Product Analytics.md) | `ecommerce.dashboard.analytics` |
| Inventory Alerts | Dashboard | [Inventory Alerts.md](../../03-business-modules/ecommerce/Menus/Dashboard/Inventory Alerts.md) | `ecommerce.dashboard.inventory` |
| Recent Orders | Dashboard | [Recent Orders.md](../../03-business-modules/ecommerce/Menus/Dashboard/Recent Orders.md) | `ecommerce.dashboard.orders` |
| Activity Logs | Dashboard | [Activity Logs.md](../../03-business-modules/ecommerce/Menus/Dashboard/Activity Logs.md) | `ecommerce.dashboard.audit` |

---

## Ecommerce — Catalog (21)

| Page | Doc |
|------|-----|
| Product List | [Menus/Catalog/Products/Product List.md](../../03-business-modules/ecommerce/Menus/Catalog/Products/Product List.md) |
| Add Product | [Menus/Catalog/Products/Add Product.md](../../03-business-modules/ecommerce/Menus/Catalog/Products/Add Product.md) |
| Bulk Import | [Menus/Catalog/Products/Bulk Import.md](../../03-business-modules/ecommerce/Menus/Catalog/Products/Bulk Import.md) |
| Bulk Export | [Menus/Catalog/Products/Bulk Export.md](../../03-business-modules/ecommerce/Menus/Catalog/Products/Bulk Export.md) |
| Product Approval | [Menus/Catalog/Products/Product Approval.md](../../03-business-modules/ecommerce/Menus/Catalog/Products/Product Approval.md) |
| Product History | [Menus/Catalog/Products/Product History.md](../../03-business-modules/ecommerce/Menus/Catalog/Products/Product History.md) |
| Categories | [Menus/Catalog/Categories.md](../../03-business-modules/ecommerce/Menus/Catalog/Categories.md) |
| Brands | [Menus/Catalog/Brands.md](../../03-business-modules/ecommerce/Menus/Catalog/Brands.md) |
| Attributes | [Menus/Catalog/Attributes.md](../../03-business-modules/ecommerce/Menus/Catalog/Attributes.md) |
| _+ 12 more_ | [Menus/Catalog/](./03-business-modules/ecommerce/Menus/Catalog/) |

**Architecture:** [modules/ecommerce/catalog/ARCHITECTURE.md](../../03-business-modules/ecommerce/catalog/ARCHITECTURE.md)

---

## Ecommerce — All Menu Groups

| Menu Group | Screens | Index |
|------------|---------|-------|
| Dashboard | 8 | [Menus/Dashboard/](./03-business-modules/ecommerce/Menus/Dashboard/) |
| Catalog | 21 | [Menus/Catalog/](./03-business-modules/ecommerce/Menus/Catalog/) |
| Inventory | 8 | [Menus/Inventory/](./03-business-modules/ecommerce/Menus/Inventory/) |
| Sales | 9 | [Menus/Sales/](./03-business-modules/ecommerce/Menus/Sales/) |
| Customers | 9 | [Menus/Customers/](./03-business-modules/ecommerce/Menus/Customers/) |
| Marketing | 16 | [Menus/Marketing/](./03-business-modules/ecommerce/Menus/Marketing/) |
| Content | 10 | [Menus/Content/](./03-business-modules/ecommerce/Menus/Content/) |
| Builder | 14 | [Menus/Builder/](./03-business-modules/ecommerce/Menus/Builder/) |
| SEO | 12 | [Menus/SEO/](./03-business-modules/ecommerce/Menus/SEO/) |
| AI | 15 | [Menus/AI/](./03-business-modules/ecommerce/Menus/AI/) |
| Media | 9 | [Menus/Media/](./03-business-modules/ecommerce/Menus/Media/) |
| Reports | 14 | [Menus/Reports/](./03-business-modules/ecommerce/Menus/Reports/) |
| System | 24 | [Menus/System/](./03-business-modules/ecommerce/Menus/System/) |

**Canonical tree:** [MENU_STRUCTURE.md](../../03-business-modules/ecommerce/MENU_STRUCTURE.md)

---

## UI Prototype Pages (147)

| Group | Count | Path |
|-------|-------|------|
| catalog | 3+ | [ui-prototype/catalog/](./04-uiux/prototype/catalog/) |
| orders | 9 | [ui-prototype/orders/](./04-uiux/prototype/orders/) |
| inventory | 8+ | [ui-prototype/inventory/](./04-uiux/prototype/inventory/) |
| customers | 9 | [ui-prototype/customers/](./04-uiux/prototype/customers/) |
| marketing | 16 | [ui-prototype/marketing/](./04-uiux/prototype/marketing/) |
| seo | 12 | [ui-prototype/seo/](./04-uiux/prototype/seo/) |
| builder | 14 | [ui-prototype/builder/](./04-uiux/prototype/builder/) |
| ai-os | 15 | [ui-prototype/ai-os/](./04-uiux/prototype/ai-os/) |
| reports | 14 | [ui-prototype/reports/](./04-uiux/prototype/reports/) |
| platform | 7 | [ui-prototype/platform/](./04-uiux/prototype/07-saas/) |
| _others_ | — | [ui-prototype/README.md](../../04-uiux/prototype/README.md) |

**Exemplar spec:** [ui-prototype/catalog/products/ProductList.md](../../04-uiux/prototype/catalog/products/ProductList.md)

---

## Page Registration Workflow

```
1. Add Menus/{Group}/{Page}.md screen doc
2. Update ModuleManifest.md + UI.md
3. Register URL + permissions in PAGE_REGISTRY
4. Run generate-governance-registries.py
5. Update TRACEABILITY_MATRIX.md
6. CHANGELOG entry
```

---

**Last Updated:** 2026-06-12 · **Maintainer:** Platform Architecture Team
