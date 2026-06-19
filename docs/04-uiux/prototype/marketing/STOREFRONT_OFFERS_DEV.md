# Storefront Offers — Developer Guide

> **Status:** Implemented (prototype)  
> **Resolver:** `apps/web/src/lib/storefront/storefront-offers.ts`  
> **Parent:** [MARKETING_PROTOTYPE_DEV.md](./MARKETING_PROTOTYPE_DEV.md)

---

## Purpose

Connect admin **Flash Sales** and **Special Offers** (Zustand persist) to the customer storefront: prices, badges, `/deals`, homepage strip, cart hints.

---

## Architecture

```
marketing flash-sale-store ──┐
                             ├──► storefront-offers.ts (pure functions)
special-offer-store ────────┘              │
                                           ├──► hooks/use-storefront-offers.ts (client)
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
              PDP panel              /deals page            catalog cards
         product-purchase-panel    deals-view + hero    toCatalogProductWithMeta
                    │                      │                      │
                    └────────── home-deals-section ──────────────┘
```

---

## Rules (breaking these causes storefront errors)

### 1. No circular imports

| ✅ Allowed | ❌ Forbidden |
|-----------|-------------|
| `storefront-offers` → `storefront-home` (types + `toStorefrontProduct`) | `storefront-home` → `storefront-offers` at module top level |
| `storefront-deals` → `storefront-offers` | `storefront-offers` → `storefront-deals` |
| Types in `storefront-offer-types.ts` | `storefront-offer-types` → `storefront-home` |

**Never** call `buildHomepageDealProducts()` at module init in `storefront-home.ts`. Use `HomeDealsSection` (client) instead.

### 2. SSR safety

On the server (`typeof window === 'undefined'`), always use seed data:

```ts
// getOfferSourcesWithFallback() in storefront-offers.ts
if (typeof window === "undefined") {
  return { flashSales: flashSalesSeed, specialOffers: specialOffersSeed };
}
```

Client components subscribe via `useFlashSaleStore` / `useSpecialOfferStore` hooks.

### 3. Where to resolve offers

| Context | Use |
|---------|-----|
| Server component / static export | `getOfferSourcesWithFallback()` + `resolveProductOffer()` |
| Client component | `useProductOffer()`, `useAdminDealProducts()`, `useHomepageDealProducts()` |
| Catalog list | `enrichStorefrontProduct()` inside `toCatalogProductWithMeta()` (client query) |

### 4. Flash vs Special on storefront

| Source | PDP price | PDP badge | `/deals` | Cart |
|--------|-----------|-----------|----------|------|
| Flash Sale (running) | `salePrice` from flash item | Flash sale name | Yes if `showOnDealsPage` | Price already discounted |
| Special Offer | Catalog price unchanged | `describeOffer()` text | No | Hint only (`showOnCart`) |

---

## Key functions

| Function | Purpose |
|----------|---------|
| `getActiveFlashSales()` | Filter running by date |
| `getFlashSaleItemForProduct(id)` | Sale price for PDP |
| `getSpecialOfferLabelsForProduct(id)` | BOGO / bundle labels |
| `resolveProductOffer(id, price, compareAt, category?)` | Full PDP view model |
| `enrichStorefrontProduct(product, category?)` | Catalog card prices + labels |
| `buildDealProductsFromAdmin()` | `/deals` product list |
| `buildHomepageDealProducts(limit)` | Homepage deals strip |
| `getCartSpecialOfferHints(productIds)` | Cart banner text |

---

## Types

`OfferLabel` lives in `lib/storefront/storefront-offer-types.ts` — import from there, not from `storefront-offers.ts`, in UI components.

`StorefrontProduct` optional fields:

- `offerLabels?: OfferLabel[]`
- `flashSaleName?: string`

---

## Components touched

| File | Change |
|------|--------|
| `components/storefront/product/product-purchase-panel.tsx` | `useProductOffer` for price + offer box |
| `components/storefront/deals/deals-view.tsx` | `useAdminDealProducts` |
| `components/storefront/deals/deals-hero.tsx` | `usePrimaryFlashSale` countdown |
| `components/storefront/home/home-deals-section.tsx` | Replaces static `DealsSection` |
| `components/storefront/product-card.tsx` | Offer label badge |
| `components/storefront/cart/cart-view.tsx` | Special offer hints |
| `lib/mock-data/storefront-catalog.ts` | `enrichStorefrontProduct` in mapper |
| `lib/mock-data/storefront-deals.ts` | `getAllDealProducts` prefers admin flash sales |

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Storefront white screen / module error | Check circular imports (see §1) |
| Deals empty but admin has running sale | Ensure `showOnDealsPage: true` and dates include today |
| PDP shows old price | Product not in running flash sale item list |
| Admin change not on storefront | Same browser + localStorage; hard refresh |
| SSR/hydration mismatch | Do not read persist store in server components without seed fallback |

---

## Backend migration (future)

Replace `getOfferSourcesWithFallback()` with API fetch + ISR cache. Keep the same `resolveProductOffer` input shape (flash item + special offer arrays).
