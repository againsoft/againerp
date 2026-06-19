# Special Offers — Admin UI (Implemented)

> **Status:** Prototype implemented  
> **Route:** `/marketing/special-offers`  
> **Menu:** Marketing → Special Offers  
> **Architecture:** `docs/modules/ecommerce/marketing/ARCHITECTURE.md`  
> **Page spec:** [SpecialOffers.md](./SpecialOffers.md) · **Dev:** [MARKETING_PROTOTYPE_DEV.md](./MARKETING_PROTOTYPE_DEV.md) · **Storefront:** [STOREFRONT_OFFERS_DEV.md](./STOREFRONT_OFFERS_DEV.md)

---

## Purpose

Complex deal types that the **cart engine** evaluates at checkout — not simple scheduled price sync.

| Module | Use case |
|--------|----------|
| **Special Offers** | BOGO, bundles, gift-with-purchase, tiered qty discounts |
| Flash Sales | Scheduled %/fixed price on catalog `special_price` |
| Promotions | Cart/category rule engine (auto) |
| Coupons | Code-based discounts |

---

## Offer types

| Type | Example | Table field |
|------|---------|-------------|
| **BOGO** | Buy 1 T-shirt → get 1 free | `bogo` |
| **Bundle** | Earbuds + Hub + Watch = ৳18,999 | `bundle` |
| **Gift with purchase** | Buy electronics → free mouse | `gift` |
| **Tiered** | Buy 2 hoodies 10% off, 5+ → 25% | `tiered` |

---

## Flow

```
Admin defines rules → Schedule → Cart engine evaluates at checkout
→ PDP badge + cart discount → Expires at end date
```

No `special_price` catalog sync — unlike Flash Sales.

---

## Admin screens

### List (`SpecialOffersList`)

- Flow banner (cart engine pipeline)
- KPI: Active, Scheduled, BOGO & bundles, Revenue
- Filters: search, type, status
- Offer cards: code, type badge, human-readable rule summary, schedule, storefront flags
- Actions: Edit, Duplicate, Delete

### Create/Edit (`SpecialOfferFormSheet`)

1. **Offer type** — BOGO / Bundle / Gift / Tiered (card picker)
2. **Details** — name, code, priority, slug, description
3. **Rules** — type-specific product pickers and config
4. **Schedule** — start/end, status
5. **Storefront & cart** — PDP badge, cart auto-apply, listing label, stackable

Buttons: **Save draft** | **Activate offer**

---

## Seed data

- T-Shirt BOGO Weekend (running)
- Work From Home Kit bundle (scheduled)
- Laptop + Free Mouse gift (running)
- Hoodie Bulk Savings tiered (completed)

---

## Files

| File | Role |
|------|------|
| `lib/mock-data/special-offers.ts` | Types, seed, helpers |
| `lib/store/special-offer-store.ts` | Zustand persist |
| `components/marketing/special-offers-list.tsx` | List UI |
| `components/marketing/special-offer-form-sheet.tsx` | Create/edit sheet |
| `app/(admin)/marketing/special-offers/page.tsx` | Page shell |

---

## Storefront (wired)

| Flag | Storefront effect |
|------|-------------------|
| `show_on_pdp` | Label box on `product-purchase-panel` |
| `show_listing_label` | Badge on `product-card` |
| `show_on_cart` | Hint in `cart-view` (no checkout math yet) |

Resolver: `getSpecialOfferLabelsForProduct()`, `describeOffer()` in `storefront-offers.ts`.

**Note:** Catalog base price unchanged — unlike Flash Sales.

---

## Backend (future)

Table: `marketing_special_offers` — linked to cart evaluation service per `ARCHITECTURE.md` checkout integration.
