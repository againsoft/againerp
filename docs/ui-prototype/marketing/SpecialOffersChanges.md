# SpecialOffers — Changes

> **Page Spec:** [SpecialOffers.md](./SpecialOffers.md)  
> **Admin detail:** [SPECIAL_OFFERS_ADMIN.md](./SPECIAL_OFFERS_ADMIN.md)  
> **Review:** [SpecialOffersReview.md](./SpecialOffersReview.md)  
> **Dev:** [MARKETING_PROTOTYPE_DEV.md](./MARKETING_PROTOTYPE_DEV.md)

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-06-12 | 0.1.0 | — | Initial stub |
| 2026-06-15 | 1.0.0 | — | Full admin UI (4 offer types), store, storefront labels |

---

## Implemented (Prototype)

| Date | UI change | Route / file |
|------|-----------|----------------|
| 2026-06-15 | Special Offers list + KPIs + type/status filters | `/marketing/special-offers` |
| 2026-06-15 | BOGO / bundle / gift / tiered form sheet | `special-offer-form-sheet.tsx` |
| 2026-06-15 | Mock data + persist store | `special-offers.ts`, `special-offer-store.ts` |
| 2026-06-15 | PDP badges + cart hints | `storefront-offers.ts`, `cart-view.tsx` |

---

## Pending Changes

| # | Change | Priority | Status |
|---|--------|----------|--------|
| 1 | Cart engine — apply BOGO/bundle math at checkout | High | Open |
| 2 | Real API + `marketing_special_offers` table | High | Open |
| 3 | Stackable / priority conflict resolution | Medium | Open |

---

## Dev notes (2026-06-15)

- Persist key: `againerp-special-offers`
- Running seeds: `so_bogo_tshirt`, `so_gift_laptop`
- Special offers do **not** change PDP numeric price — labels only in prototype
