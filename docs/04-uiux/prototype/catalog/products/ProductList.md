# Product List

> **Status:** Ready (Prototype)  
> **As-built:** [IMPLEMENTED_DESIGN.md](./IMPLEMENTED_DESIGN.md)  
> **Prototype Phase:** 1 — UI Only  
> **Module:** Ecommerce · Catalog  
> **Route:** `/catalog/products`  
> **Code:** `apps/web/src/components/products/product-grid.tsx`

---

## Purpose

Primary admin grid for catalog products — search, filter, bulk actions, inline edit, navigate to add/edit/details.

## UI Layout (As Built)

**Desktop**

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Products (120)                [Import] [Export] [+ Add Product]         │
├─────────────────────────────────────────────────────────────────────────┤
│ [Search] [Website▾] [Category▾] [Brand▾] [Stock▾] … [Filters] [Live edit] [Cols] │
├─────────────────────────────────────────────────────────────────────────┤
│ AG Grid — full height                                                   │
│ ☐ │ Img │ Name✎ │ SKU✎ │ Slug✎ │ Price✎ │ Stock✎ │ Status✎ │ Web │ Cat✎ │ Brand✎ │ ⋮ │
├─────────────────────────────────────────────────────────────────────────┤
│ Pagination · Showing 1–25 of 120                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

**Mobile:** Card list + FAB `+` → `/catalog/products/new`

## Components Built

| Component | Detail |
|-----------|--------|
| AG Grid | Legacy theme, dark mode, resize/reorder columns |
| Live toolbar filters | Search, **Website**, Category, Brand, Stock (+ Status, Price via Filters sheet) |
| **Category filter** | Searchable dropdown; same hierarchical label as grid column |
| **Brand filter** | Searchable dropdown |
| **Filters** menu | Single list — show/hide any toolbar filter |
| **Live edit** menu | Toggle inline edit per field (see table below) |
| **Columns** menu | Toggle Image, SKU, Slug, Price, Stock, Status, **Web**, Brand, Category, Updated |
| Bulk bar | **Publish to website**, **Remove from website**, archive, export selected |
| Row menu | View, edit, archive + confirm modal |
| Mobile cards | `ProductMobileCards` |

## Category display (grid + filter)

Subcategories show a **two-line** label (same in Category column and Category filter):

| Depth | Top (8px muted) | Bottom (13px medium) |
|-------|-----------------|----------------------|
| Root only | — | Category name |
| 1 parent | Parent name | Caption or name |
| 2+ ancestors | Path without root, e.g. `Laptops › Gaming Laptop` | Caption, e.g. `HP` |

Search matches name, caption, parent path, and slug.

## Columns

| Column | Inline edit (Live edit) | Notes |
|--------|-------------------------|-------|
| Checkbox | — | Multi-select |
| Image | — | 28×28 thumbnail |
| Name | ✓ Product title | Link to details when live edit off; plain text when on |
| SKU | ✓ | Default on |
| Slug | ✓ | Hideable; default hidden |
| Price | ✓ | BDT format |
| Stock | ✓ | |
| Status | ✓ | draft / published / archived |
| **Web** | — | ✓ on website · — not live (tooltip: reason) |
| Category | ✓ | Select editor; hierarchical cell renderer |
| Brand | ✓ | Select editor |
| Updated | — | Hideable |
| Actions | — | ⋮ menu |

**Live edit defaults:** SKU, Price, Stock, Status **on**; Product title, Category, Brand, Slug **off** (enable in Live edit sheet).

## Actions

| Action | Behavior |
|--------|----------|
| + Add Product | `/catalog/products/new` |
| Import / Export | Mock toast (bottom-right, compact) |
| Bulk publish / archive | Mock update + confirm |
| **Website filter** | On website / Not on website / All — `published` + `visibility public` + active category |
| Row ⋮ | Publish to website · Remove from website (when applicable) |
| Row edit | `ProductFormDialog` |
| Inline cell edit | Toast: `Updated {field} for {sku}` |

## Notifications

All prototype toasts (Sonner): **bottom-right**, compact size — see [components.md](../../../standards/components.md#toasts).

## Related

[AddProduct.md](./AddProduct.md) · [ProductDetails.md](./ProductDetails.md) · [IMPLEMENTED_DESIGN.md](./IMPLEMENTED_DESIGN.md)

## Change History

| Date | Change |
|------|--------|
| 2026-06-15 | Phase 2: Website filter, Web column, publish/remove from website bulk + row actions |
| 2026-06-13 | Category hierarchy display; searchable Category/Brand filters; live edit title/category/brand/slug; slug field |
| 2026-06-13 | Global toasts bottom-right compact |
| 2026-06-12 | Prototype UI built |
| 2026-06-12 | As-built design documented |
