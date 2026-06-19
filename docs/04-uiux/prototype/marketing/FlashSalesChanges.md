# FlashSales — Changes

> **Page Spec:** [FlashSales.md](./FlashSales.md)  
> **Admin detail:** [FLASH_SALES_ADMIN.md](./FLASH_SALES_ADMIN.md)  
> **Review:** [FlashSalesReview.md](./FlashSalesReview.md)  
> **Dev:** [MARKETING_PROTOTYPE_DEV.md](./MARKETING_PROTOTYPE_DEV.md)

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-06-12 | 0.1.0 | — | Initial stub |
| 2026-06-15 | 1.0.0 | — | Full admin UI, Zustand store, storefront resolver integration |

---

## Implemented (Prototype)

| Date | UI change | Route / file |
|------|-----------|----------------|
| 2026-06-15 | Flash Sales list + KPIs + filters | `/marketing/flash-sales` |
| 2026-06-15 | Create/edit sheet with product picker | `flash-sale-form-sheet.tsx` |
| 2026-06-15 | Mock data + persist store | `flash-sales.ts`, `flash-sale-store.ts` |
| 2026-06-15 | Marketing dashboard card | `marketing-control-center.tsx` |
| 2026-06-15 | Storefront sale prices on PDP/deals/home | `storefront-offers.ts`, hooks |

---

## Pending Changes

| # | Change | Priority | Status |
|---|--------|----------|--------|
| 1 | Real API + scheduler for `special_price` sync | High | Open |
| 2 | Permissions per role | Medium | Open |
| 3 | Revenue/orders KPI from orders service | Medium | Open |

---

## Dev notes (2026-06-15)

- Persist key: `againerp-flash-sales`
- Running seed sale: `fs_weekend_fashion` (prod_0001, prod_0006, prod_00013)
- Storefront: never import flash store in SSR without `getOfferSourcesWithFallback()` — see [STOREFRONT_OFFERS_DEV.md](./STOREFRONT_OFFERS_DEV.md)
