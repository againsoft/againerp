# Variants

> **Status:** Ready (Prototype)  
> **Prototype Phase:** 1 — UI Only  
> **Module:** Ecommerce · Catalog  
> **Architecture:** [ARCHITECTURE.md](../../../../03-business-modules/ecommerce/catalog/ARCHITECTURE.md) § Variant Architecture · [SPECIFICATIONS_ARCHITECTURE.md](../../../../03-business-modules/ecommerce/catalog/SPECIFICATIONS_ARCHITECTURE.md) § Separation  
> **Menu Location:** Ecommerce → Catalog → Variants  
> **Menu Doc:** [Menus mirror](../../../../03-business-modules/ecommerce/Menus/Catalog/Variants.md)  
> **Code:** `apps/web/src/components/products/product-variant-editor.tsx` · `apps/web/src/components/variants/variant-catalog-list.tsx`

---

## Purpose

Manage **sellable SKUs** for catalog products:

| Context | Screen | What it does |
|---------|--------|--------------|
| **Per product** | Product form → **Variants** tab | Simple vs variable type, dimension matrix, SKU/price/stock per variant |
| **Global ops** | `/catalog/variants` | Cross-product list of all sellable units for search, stock review, jump to product |

Variable products: **parent is not purchasable** — only child variants go to cart, orders, and inventory.

---

## Specifications vs Variant Dimensions

| Concern | Purpose | Example | Where managed |
|---------|---------|---------|---------------|
| **Specifications** | Technical PDP specs, filters, comparison | CPU Brand, Display Size, RAM | Attributes profiles + Product form → Specifications |
| **Variant matrix** | Purchasable SKU options | Color, Size, Storage tier | Product form → Variants |

Both can exist on the same product. Do not mix specification fields into the variant matrix.

---

## Product Form — Variants Tab

### Simple product

- Parent SKU is the single sellable unit
- Price/stock in Pricing + Inventory sections

### Variable product

**Step 1 — Dimensions**

Define purchasable axes (comma-separated values per row):

| Dimension | Example values |
|-----------|----------------|
| Color | Black, White, Red |
| Size | S, M, L |
| Storage | 128GB, 256GB |

Category presets (prototype):

- **Apparel** → Color + Size
- **Electronics** → Color + Storage

**Step 2 — Generate matrix**

Cartesian product of all dimension values → variant rows.

Example:

```
Color: Black, Blue
Storage: 128GB, 256GB
→ 4 variants: Black/128GB, Black/256GB, Blue/128GB, Blue/256GB
```

**Step 3 — Edit rows**

| Field | Per variant | Notes |
|-------|-------------|-------|
| Label | Auto from dimensions | e.g. `Black / 128GB` |
| SKU | Yes | Unique per company; auto-generated from parent SKU + dimension parts |
| Price | Yes | Overrides parent price |
| Stock | Yes | Prototype mock; production via `inventory_item_id` |
| Default | One variant | Storefront default selection (star icon) |

### Rules (from architecture)

- Parent variable product **cannot** be added to cart
- Variant SKU uniqueness at `company_id` scope
- Variant-specific media optional (see [product-gallery.md](../../../standards/product-gallery.md))
- API: `CRUD /products/{uuid}/variants`

---

## Global Variants Page (`/catalog/variants`)

### Purpose

SKU-level sellable units across the catalog — for ops, not matrix editing.

### Layout

```
┌─────────────────────────────────────────┐
│ Breadcrumb · title · helper text          │
├─────────────────────────────────────────┤
│ Search SKU/product · category filter      │
├─────────────────────────────────────────┤
│ Table: Product · Variant · SKU · Price  │
│        · Stock · Status · → Product     │
└─────────────────────────────────────────┘
```

### Table columns

| Column | Content |
|--------|---------|
| Product | Name + parent SKU |
| Variant | Dimension label; ★ = default |
| SKU | Sellable variant SKU |
| Price | Variant price |
| Stock | Qty (0 = red) |
| Status | Parent product lifecycle |
| Actions | Link to product in list |

### Data (prototype)

- `prod_0002` (Electronics) → 3 matrix variants from `demoVariants`
- Other products → one row each (simple = default SKU)

---

## Storefront Behavior

When customer selects a variant:

| Updates | Source |
|---------|--------|
| Gallery | Variant media set |
| Price | Variant price |
| Stock | Per-variant availability |
| SKU | Variant SKU |
| Add to cart | `variant_id`, not parent `product_id` |

See [IMPLEMENTED_DESIGN.md](../../storefront/IMPLEMENTED_DESIGN.md) · `product-purchase-panel.tsx`.

---

## Database (target)

| Table | Role |
|-------|------|
| `catalog_product_variants` | Sellable SKU rows |
| `catalog_product_variant_attributes` | Dimension values per variant |
| `inventory_items` | Stock via `inventory_item_id` on variant |

---

## Permissions

| Permission | Scope |
|------------|-------|
| `catalog.product.view` | View variants on product |
| `catalog.product.edit` | Edit matrix on product |
| `catalog.variant.price.edit` | Price-only edits |

---

## Related Pages

- [AddProduct.md](./AddProduct.md) — Variants section in create flow
- [EditProduct.md](./EditProduct.md) — same editor in modal
- [Attributes.md](./Attributes.md) — specification profiles (separate concern)
- [ProductList.md](./ProductList.md) — entry to edit product variants

---

## Change History

| Date | Change |
|------|--------|
| 2026-06-12 | Stub generated |
| 2026-06-13 | Full spec + prototype: matrix editor, global list, architecture alignment |
