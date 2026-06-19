# Variants

> **Status:** Ready (Prototype)  
> **Module:** Ecommerce  
> **Menu Path:** Ecommerce → Catalog → Variants  
> **Route:** `/catalog/variants`  
> **Architecture:** [catalog/ARCHITECTURE.md](../catalog/ARCHITECTURE.md)

---

## Purpose

**Global sellable SKU registry** — list every purchasable unit (variable children + simple defaults) for operations, search, and quick navigation to the parent product.

Matrix **creation and editing** happens in **Product form → Variants tab**, not on this page.

---

## Business Goals

- Find any sellable SKU without opening each product
- Review variant-level price and stock at a glance
- Jump to parent product for matrix edits
- Support inventory and order teams who think in SKUs

---

## User Roles

| Role | Access Level | Notes |
|------|--------------|-------|
| Admin | Full | View all variants; edit via product |
| Manager | Read/Write | Edit variants through product form |
| Staff | Read | List + search only |

---

## Page Layout

```
┌─────────────────────────────────────────┐
│ AgainERP › Catalog › Variants           │
│ Title + short architecture note         │
├─────────────────────────────────────────┤
│ Filter: search · category dropdown      │
├─────────────────────────────────────────┤
│ Table (50 rows preview, paginated prod) │
│ Footer: count + variable expansion note │
└─────────────────────────────────────────┘
```

---

## Fields (filter bar)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| Search | text | No | empty | Match product name, parent SKU, variant SKU, label |
| Category | select | No | All | Filter by product category |

---

## Table columns

| Column | Type | Description |
|--------|------|-------------|
| Product | text | Parent name + SKU |
| Variant | text | Dimension label; default marked with star |
| SKU | text | Unique sellable SKU |
| Price | money | Variant selling price |
| Stock | number | Available qty |
| Status | badge | Parent product status |
| Actions | link | Open product in list |

---

## Actions

| Action | Type | Permission | Result |
|--------|------|------------|--------|
| Filter | Button | `catalog.product.view` | Apply search/category |
| Open product | Link | `catalog.product.view` | `/catalog/products?highlight={id}` |

---

## Validation Rules

- Variant SKU unique per `company_id` (enforced on save in product form)
- Variable parent cannot be sold without at least one active variant
- Default variant required when multiple variants exist

---

## Workflow

```
Product created (simple) → 1 row in global list (parent SKU)
Product type = variable → dimensions defined → matrix generated → N rows in global list
Variant price/stock edit → product form → reflects in global list on refresh
```

---

## Permissions

| Permission Key | Description |
|----------------|-------------|
| `catalog.product.view` | View global variant list |
| `catalog.product.edit` | Edit via product form Variants tab |
| `catalog.variant.price.edit` | Price-only role on variant rows |

---

## Database Tables

| Table | Usage |
|-------|-------|
| `catalog_product_variants` | Sellable SKU master |
| `catalog_product_variant_attributes` | Color, Size, Storage values per variant |
| `catalog_products` | Parent product (type simple/variable) |
| `inventory_items` | Stock (linked by `inventory_item_id`) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/catalog/products/{uuid}/variants` | List variants for one product |
| POST | `/api/v1/catalog/products/{uuid}/variants` | Create variant |
| PATCH | `/api/v1/catalog/variants/{id}` | Update SKU, price, default flag |
| DELETE | `/api/v1/catalog/variants/{id}` | Soft-delete variant |
| GET | `/api/v1/catalog/variants` | Global list (paginated, filterable) |

---

## Reports Impact

- **Low stock** — variant SKU + qty
- **Product analytics** — sales by `variant_id`
- **POS** — barcode scan resolves to variant row

---

## Future Enhancements

- Bulk price update on selected variants
- CSV export of all SKUs
- Inline price edit with approval workflow
- Link to inventory mapping screen

---

## Dependencies

- **Core:** Permissions, company scope
- **Modules:** Inventory (`inventory_item_id`), Orders (line `variant_id`)
- **Pages:** [Products](./Products.md) · [Add Product](./Products/Add Product.md)

---

**Module:** Ecommerce  
**Last Updated:** 2026-06-13  
**Author:** Platform Team  
**Reviewers:** —
