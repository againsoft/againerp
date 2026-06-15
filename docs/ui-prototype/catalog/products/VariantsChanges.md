# Variants — Changes

> **Page Spec:** [Variants.md](./Variants.md)  
> **Review:** [VariantsReview.md](./VariantsReview.md)

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-06-12 | 0.1.0 | — | Initial stub |
| 2026-06-13 | 1.0.0 | — | Architecture-aligned matrix editor + global list |

---

## Pending Changes

| # | Change | Priority | Status |
|---|--------|----------|--------|
| 1 | Variant-specific media assign in matrix row | Medium | Open |
| 2 | Global list pagination + AG Grid | Low | Open |
| 3 | Barcode column on matrix table | Low | Open |

---

## Implemented (Prototype)

| Date | UI change | Route |
|------|-----------|-------|
| 2026-06-13 | `ProductVariantEditor` — simple/variable, dimensions, generate matrix, SKU/price/stock/default | Product form → Variants tab |
| 2026-06-13 | `VariantCatalogList` — global sellable SKU table with search/filter | `/catalog/variants` |
| 2026-06-13 | Mock helpers `variants.ts` — presets, cartesian product, `getAllCatalogVariants()` | `lib/mock-data/variants.ts` |
| 2026-06-13 | Docs: Variants.md, Menus/Catalog/Variants.md per ARCHITECTURE.md | `docs/` |
