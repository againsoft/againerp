# Special Offers

> **Status:** Prototype implemented (UI + mock store)  
> **Prototype Phase:** 1 — UI + client persist  
> **Module:** Ecommerce · Marketing  
> **Route:** `/marketing/special-offers`  
> **Menu Location:** Marketing → Special Offers  
> **Dev guide:** [SPECIAL_OFFERS_ADMIN.md](./SPECIAL_OFFERS_ADMIN.md) · [MARKETING_PROTOTYPE_DEV.md](./MARKETING_PROTOTYPE_DEV.md)  
> **Storefront:** [STOREFRONT_OFFERS_DEV.md](./STOREFRONT_OFFERS_DEV.md)

---

## Purpose

Complex deal types evaluated by the **cart engine** at checkout: BOGO, bundles, gift-with-purchase, tiered quantity discounts.

**Does not** sync `special_price` on catalog — unlike [Flash Sales](./FlashSales.md).

---

## Offer types

| Type | ID | Example |
|------|-----|---------|
| BOGO | `bogo` | Buy 1 T-shirt → get 1 free |
| Bundle | `bundle` | Kit of 3 SKUs at bundle price |
| Gift with purchase | `gift_with_purchase` | Buy laptop → free mouse |
| Tiered | `tiered` | 2+ hoodies 10%, 5+ 25% |

---

## Business Goal

- Merchandising rules beyond simple price drops
- PDP badges and cart hints without changing base catalog price
- Priority + stackable flags for future checkout engine

---

## UI Layout

- **List:** flow banner, KPIs, search + type + status filters, offer cards with rule summary
- **Create/Edit:** type picker cards, rules section (type-specific), schedule, storefront flags

See [SPECIAL_OFFERS_ADMIN.md](./SPECIAL_OFFERS_ADMIN.md).

---

## Components

| Component | Path |
|-----------|------|
| `SpecialOffersList` | `components/marketing/special-offers-list.tsx` |
| `SpecialOfferFormSheet` | `components/marketing/special-offer-form-sheet.tsx` |

---

## Fields (prototype)

| Field | Notes |
|-------|-------|
| `type` | bogo / bundle / gift_with_purchase / tiered |
| `name`, `code`, `slug`, `priority` | Identity |
| `rules` | Type-specific (buy/get products, bundle items, gift SKU, tiers) |
| `starts_at`, `ends_at`, `status` | Lifecycle |
| `show_on_pdp`, `show_on_cart`, `show_listing_label`, `stackable` | Storefront |

---

## Storefront behaviour (prototype)

| Flag | Effect |
|------|--------|
| `show_on_pdp` | Offer label on product page |
| `show_listing_label` | Badge on product cards |
| `show_on_cart` | Hint text in cart (no price math yet) |

Resolver: `getSpecialOfferLabelsForProduct()` in `storefront-offers.ts`.

---

## Data & persist

- Seed: `lib/mock-data/special-offers.ts`
- Store: `lib/store/special-offer-store.ts` → key `againerp-special-offers`

---

## Related Pages

| Page | Relation |
|------|----------|
| [Flash Sales](./FlashSales.md) | Scheduled catalog price |
| [Promotions](./Promotions.md) | Placeholder |
| [Coupons](./Coupons.md) | Code-based |

---

## Backend (future)

Table `marketing_special_offers` + cart evaluation service per [ARCHITECTURE.md](../../modules/ecommerce/marketing/ARCHITECTURE.md).

---

## Change History

| Date | Change |
|------|--------|
| 2026-06-12 | Stub generated |
| 2026-06-15 | Admin UI + store + storefront labels documented |
