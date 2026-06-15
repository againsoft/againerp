# Edit Product

> **Status:** Ready (Prototype)  
> **As-built:** [IMPLEMENTED_DESIGN.md](./IMPLEMENTED_DESIGN.md)  
> **Same UI as:** [AddProduct.md](./AddProduct.md) (pre-filled)

---

## Purpose

Edit product — shared `ProductForm` in modal.

## Entry Points

| From | UI |
|------|-----|
| Product List → ⋮ Edit | `ProductFormDialog` |
| Product Details → Edit | `ProductFormDialog` |

## As Built

- `mode="edit"` with mock product data
- Desktop: centered modal
- Mobile: full-screen modal
- Same 9 sections as Add Product

## Change History

| Date | Change |
|------|--------|
| 2026-06-12 | Shares Add Product form |
| 2026-06-12 | As-built design documented |
