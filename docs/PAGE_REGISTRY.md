# AgainERP — Page Registry

> **Purpose:** Master registry of all admin and prototype pages.  
> **Full listing:** [_registries/PAGE_REGISTRY_FULL.md](./_registries/PAGE_REGISTRY_FULL.md) (314 pages)

**Regenerate:** `python3 docs/scripts/generate-governance-registries.py`

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
| Overview | Dashboard | [Menus/Dashboard/Overview.md](./modules/ecommerce/Menus/Dashboard/Overview.md) | `ecommerce.dashboard.view` |
| Sales Analytics | Dashboard | [Sales Analytics.md](./modules/ecommerce/Menus/Dashboard/Sales%20Analytics.md) | `ecommerce.dashboard.analytics` |
| Revenue Analytics | Dashboard | [Revenue Analytics.md](./modules/ecommerce/Menus/Dashboard/Revenue%20Analytics.md) | `ecommerce.dashboard.analytics` |
| Customer Analytics | Dashboard | [Customer Analytics.md](./modules/ecommerce/Menus/Dashboard/Customer%20Analytics.md) | `ecommerce.dashboard.analytics` |
| Product Analytics | Dashboard | [Product Analytics.md](./modules/ecommerce/Menus/Dashboard/Product%20Analytics.md) | `ecommerce.dashboard.analytics` |
| Inventory Alerts | Dashboard | [Inventory Alerts.md](./modules/ecommerce/Menus/Dashboard/Inventory%20Alerts.md) | `ecommerce.dashboard.inventory` |
| Recent Orders | Dashboard | [Recent Orders.md](./modules/ecommerce/Menus/Dashboard/Recent%20Orders.md) | `ecommerce.dashboard.orders` |
| Activity Logs | Dashboard | [Activity Logs.md](./modules/ecommerce/Menus/Dashboard/Activity%20Logs.md) | `ecommerce.dashboard.audit` |

---

## Ecommerce — Catalog (21)

| Page | Doc |
|------|-----|
| Product List | [Menus/Catalog/Products/Product List.md](./modules/ecommerce/Menus/Catalog/Products/Product%20List.md) |
| Add Product | [Menus/Catalog/Products/Add Product.md](./modules/ecommerce/Menus/Catalog/Products/Add%20Product.md) |
| Bulk Import | [Menus/Catalog/Products/Bulk Import.md](./modules/ecommerce/Menus/Catalog/Products/Bulk%20Import.md) |
| Bulk Export | [Menus/Catalog/Products/Bulk Export.md](./modules/ecommerce/Menus/Catalog/Products/Bulk%20Export.md) |
| Product Approval | [Menus/Catalog/Products/Product Approval.md](./modules/ecommerce/Menus/Catalog/Products/Product%20Approval.md) |
| Product History | [Menus/Catalog/Products/Product History.md](./modules/ecommerce/Menus/Catalog/Products/Product%20History.md) |
| Categories | [Menus/Catalog/Categories.md](./modules/ecommerce/Menus/Catalog/Categories.md) |
| Brands | [Menus/Catalog/Brands.md](./modules/ecommerce/Menus/Catalog/Brands.md) |
| Attributes | [Menus/Catalog/Attributes.md](./modules/ecommerce/Menus/Catalog/Attributes.md) |
| _+ 12 more_ | [Menus/Catalog/](./modules/ecommerce/Menus/Catalog/) |

**Architecture:** [modules/ecommerce/catalog/ARCHITECTURE.md](./modules/ecommerce/catalog/ARCHITECTURE.md)

---

## Ecommerce — All Menu Groups

| Menu Group | Screens | Index |
|------------|---------|-------|
| Dashboard | 8 | [Menus/Dashboard/](./modules/ecommerce/Menus/Dashboard/) |
| Catalog | 21 | [Menus/Catalog/](./modules/ecommerce/Menus/Catalog/) |
| Inventory | 8 | [Menus/Inventory/](./modules/ecommerce/Menus/Inventory/) |
| Sales | 9 | [Menus/Sales/](./modules/ecommerce/Menus/Sales/) |
| Customers | 9 | [Menus/Customers/](./modules/ecommerce/Menus/Customers/) |
| Marketing | 16 | [Menus/Marketing/](./modules/ecommerce/Menus/Marketing/) |
| Content | 10 | [Menus/Content/](./modules/ecommerce/Menus/Content/) |
| Builder | 14 | [Menus/Builder/](./modules/ecommerce/Menus/Builder/) |
| SEO | 12 | [Menus/SEO/](./modules/ecommerce/Menus/SEO/) |
| AI | 15 | [Menus/AI/](./modules/ecommerce/Menus/AI/) |
| Media | 9 | [Menus/Media/](./modules/ecommerce/Menus/Media/) |
| Reports | 14 | [Menus/Reports/](./modules/ecommerce/Menus/Reports/) |
| System | 24 | [Menus/System/](./modules/ecommerce/Menus/System/) |

**Canonical tree:** [MENU_STRUCTURE.md](./modules/ecommerce/MENU_STRUCTURE.md)

---

## UI Prototype Pages (147)

| Group | Count | Path |
|-------|-------|------|
| catalog | 3+ | [ui-prototype/catalog/](./ui-prototype/catalog/) |
| orders | 9 | [ui-prototype/orders/](./ui-prototype/orders/) |
| inventory | 8+ | [ui-prototype/inventory/](./ui-prototype/inventory/) |
| customers | 9 | [ui-prototype/customers/](./ui-prototype/customers/) |
| marketing | 16 | [ui-prototype/marketing/](./ui-prototype/marketing/) |
| seo | 12 | [ui-prototype/seo/](./ui-prototype/seo/) |
| builder | 14 | [ui-prototype/builder/](./ui-prototype/builder/) |
| ai-os | 15 | [ui-prototype/ai-os/](./ui-prototype/ai-os/) |
| reports | 14 | [ui-prototype/reports/](./ui-prototype/reports/) |
| platform | 7 | [ui-prototype/platform/](./ui-prototype/platform/) |
| _others_ | — | [ui-prototype/README.md](./ui-prototype/README.md) |

**Exemplar spec:** [ui-prototype/catalog/products/ProductList.md](./ui-prototype/catalog/products/ProductList.md)

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
