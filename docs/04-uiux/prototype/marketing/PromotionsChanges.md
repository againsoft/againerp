# Promotions — Changes

> **Page Spec:** [Promotions.md](./Promotions.md)  
> **Admin detail:** [PROMOTIONS_ADMIN.md](./PROMOTIONS_ADMIN.md)  
> **Review:** [PromotionsReview.md](./PromotionsReview.md)  
> **Dev:** [MARKETING_PROTOTYPE_DEV.md](./MARKETING_PROTOTYPE_DEV.md)

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-06-12 | 0.1.0 | — | Initial stub |
| 2026-06-15 | 1.0.0 | — | Full admin UI, Zustand store, marketing dashboard card |

---

## Implemented (Prototype)

| Date | UI change | Route / file |
|------|-----------|----------------|
| 2026-06-15 | Promotions list + KPIs + filters | `/marketing/promotions` |
| 2026-06-15 | Rule/action form sheet | `promotion-form-sheet.tsx` |
| 2026-06-15 | Mock data + persist store | `promotions.ts`, `promotion-store.ts` |
| 2026-06-15 | Marketing dashboard card | `marketing-control-center.tsx` |

---

## Pending Changes

| # | Change | Priority | Status |
|---|--------|----------|--------|
| 1 | Storefront cart evaluation + announcement bar | High | Open |
| 2 | Real API + checkout evaluate endpoint | High | Open |
| 3 | Stacking conflict UI preview | Medium | Open |

---

## Dev notes (2026-06-15)

- Persist key: `againerp-promotions`
- Running seeds: `promo_free_ship_3k`, `promo_vip_cart`
- Storefront wiring not yet implemented — admin-only prototype
