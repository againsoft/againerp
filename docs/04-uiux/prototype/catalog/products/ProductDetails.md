# Product Details

> **Status:** Draft  
> **Prototype Phase:** 1 — UI Only  
> **Menu:** Ecommerce → Catalog → Products → (row click)  
> **Pattern:** [record-view.md](../../../standards/record-view.md) · [product-gallery.md](../../../standards/product-gallery.md)

---

## Purpose

Single product record view — tabs, smart buttons, chatter, variant gallery.

## Business Goal

- One screen for all product operations
- Variant switch updates gallery, price, stock instantly (mock)

## Menu Location

From Product List row click.

## Breadcrumb

`AgainERP › Ecommerce › Catalog › Products › Premium Cotton T-Shirt`

## UI Layout

Record header + smart buttons + tabs + right chatter panel.

**Tabs:** General · Variants · Pricing · Inventory · SEO · Media · Reviews · History · Activities

**Smart buttons:** Orders (24) · Reviews (8) · Inventory (142) · SEO Score (85) · Views (1.2k)

## Prototype Notes

| Item | Value |
|------|-------|
| Fixture | `data/products.json` by id |
| Route | `/prototype/catalog/products/:id` |
| Variant mock | Client-side filter on `variants[]` |

## Related Pages

[ProductList.md](./ProductList.md) · [EditProduct.md](./EditProduct.md)

## Change History

| Date | Change |
|------|--------|
| 2026-06-12 | Prototype spec added |
