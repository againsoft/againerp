# Add Product

> **Status:** Ready (Prototype)  
> **As-built:** [IMPLEMENTED_DESIGN.md](./IMPLEMENTED_DESIGN.md)  
> **Route:** `/catalog/products/new`  
> **Menu:** None — open from [Product List](./ProductList.md) only  
> **Code:** `apps/web/src/components/products/product-form.tsx`

---

## Purpose

Shopify-style product create — 9 sections, mock save, mobile responsive.

## UI Layout (As Built)

**Desktop:** Back · title · badge · autosave · actions | left section nav | form content

**Mobile:** Short breadcrumb · sticky section pills · single column · fixed bottom actions

## Sections Built

| Section | Fields |
|---------|--------|
| General | name*, SKU*, category, brand, status, tags, descriptions |
| Pricing | price, compare-at, cost, tax, preview |
| Inventory | stock, warehouse, alert, track |
| Variants | simple/variable · dimension matrix · generate SKUs · table/cards · default variant |
| Specifications | Profile-based spec editor (`ProductSpecEditor`) |
| SEO | slug, meta, preview, AI generate |
| Media | Upload zone, picker grid |
| Related | Linked products list |
| AI Tools | 4 mock actions |

## Actions

| Button | Result |
|--------|--------|
| Save draft | Toast → list |
| Publish | Toast → list |
| Discard | Back to list |

## Related

[ProductList.md](./ProductList.md) · [EditProduct.md](./EditProduct.md) · [IMPLEMENTED_DESIGN.md](./IMPLEMENTED_DESIGN.md)

## Change History

| Date | Change |
|------|--------|
| 2026-06-12 | Full form + mobile responsive |
| 2026-06-12 | As-built design documented |
| 2026-06-13 | Variants section: architecture-aligned matrix editor |
