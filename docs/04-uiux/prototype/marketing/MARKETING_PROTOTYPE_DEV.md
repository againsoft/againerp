# Marketing Prototype — Developer Guide

> **Status:** Active — read before changing Flash Sales, Special Offers, or storefront offers  
> **App:** `apps/web`  
> **Last updated:** 2026-06-15

---

## Quick links

| Topic | Doc |
|-------|-----|
| Flash Sales admin | [FLASH_SALES_ADMIN.md](./FLASH_SALES_ADMIN.md) · [FlashSales.md](./FlashSales.md) |
| Special Offers admin | [SPECIAL_OFFERS_ADMIN.md](./SPECIAL_OFFERS_ADMIN.md) · [SpecialOffers.md](./SpecialOffers.md) |
| Promotions admin | [PROMOTIONS_ADMIN.md](./PROMOTIONS_ADMIN.md) · [Promotions.md](./Promotions.md) |
| Storefront wiring | [STOREFRONT_OFFERS_DEV.md](./STOREFRONT_OFFERS_DEV.md) |
| AI Settings + Editor | [../settings/AI_SETTINGS_DEV.md](../settings/AI_SETTINGS_DEV.md) · [../catalog/products/EDITOR_AI_RULES.md](../catalog/products/EDITOR_AI_RULES.md) |
| Marketing architecture | [../../modules/ecommerce/marketing/ARCHITECTURE.md](../../../03-business-modules/ecommerce/marketing/ARCHITECTURE.md) |

---

## Module map (which tool for what)

| Use case | Admin module | Storefront effect |
|----------|--------------|-------------------|
| Scheduled %/fixed price on products | **Flash Sales** | `special_price` sync → PDP, `/deals`, homepage |
| BOGO, bundle, gift, tiered qty | **Special Offers** | Cart engine + PDP badges |
| Cart/category auto rules | Promotions (stub) | — |
| Coupon code | Coupons (stub) | — |

**Do not** put BOGO in Flash Sales or scheduled price drops in Special Offers — keeps admin UX and backend tables clean.

---

## Admin routes (implemented)

| Page | Route | Sidebar |
|------|-------|---------|
| Marketing overview | `/marketing` | Marketing → Overview |
| Flash Sales | `/marketing/flash-sales` | Marketing → Flash Sales |
| Special Offers | `/marketing/special-offers` | Marketing → Special Offers |
| Promotions | `/marketing/promotions` | Marketing → Promotions |
| AI Settings | `/settings/ai` | System → Settings → AI |

---

## Data layer (prototype)

| Store | Persist key | Seed file |
|-------|-------------|-----------|
| Flash sales | `againerp-flash-sales` | `lib/mock-data/flash-sales.ts` |
| Special offers | `againerp-special-offers` | `lib/mock-data/special-offers.ts` |
| Promotions | `againerp-promotions` | `lib/mock-data/promotions.ts` |
| AI prompts | `againerp-ai-prompts` | `lib/editor/editor-ai-prompts.ts` |

All use Zustand `persist` — **browser localStorage only**. Admin and storefront share the same keys in one origin.

---

## Storefront integration (summary)

Admin stores → `lib/storefront/storefront-offers.ts` → PDP, `/deals`, catalog cards, cart hints.

**Critical:** See [STOREFRONT_OFFERS_DEV.md](./STOREFRONT_OFFERS_DEV.md) for import rules and SSR — breaking these caused storefront runtime errors.

---

## File checklist (do not duplicate)

### Flash Sales

- `lib/mock-data/flash-sales.ts`
- `lib/store/flash-sale-store.ts`
- `components/marketing/flash-sales-list.tsx`
- `components/marketing/flash-sale-form-sheet.tsx`
- `app/(admin)/marketing/flash-sales/page.tsx`

### Special Offers

- `lib/mock-data/special-offers.ts`
- `lib/store/special-offer-store.ts`
- `components/marketing/special-offers-list.tsx`
- `components/marketing/special-offer-form-sheet.tsx`
- `app/(admin)/marketing/special-offers/page.tsx`

### Promotions

- `lib/mock-data/promotions.ts`
- `lib/store/promotion-store.ts`
- `components/marketing/promotions-list.tsx`
- `components/marketing/promotion-form-sheet.tsx`
- `app/(admin)/marketing/promotions/page.tsx`

### Storefront offers

- `lib/storefront/storefront-offers.ts` — **resolver only** (no React)
- `lib/storefront/storefront-offer-types.ts` — shared `OfferLabel` type
- `hooks/use-storefront-offers.ts` — client hooks
- `components/storefront/home/home-deals-section.tsx`
- Wired in: `product-purchase-panel`, `deals-view`, `deals-hero`, `product-card`, `storefront-catalog`, `cart-view`

---

## Dev workflow

1. Change seed in `mock-data/*.ts` OR edit in admin UI (persists to localStorage).
2. Refresh storefront — client hooks re-read stores.
3. Run `npx tsc --noEmit` in `apps/web` after type changes.
4. **Never** import Zustand stores from server-only modules at top level without `typeof window` guard — use `getOfferSourcesWithFallback()`.

---

## Testing (manual)

| Step | URL | Expect |
|------|-----|--------|
| Flash sale list | `/marketing/flash-sales` | Weekend Fashion Drop = running |
| Create offer | Flash Sales → Create | Sheet saves to store |
| Deals page | `/deals` | 3 products, Weekend Fashion hero |
| PDP | `/premium-cotton-t-shirt-0001` | Sale price ৳764 + BOGO label |
| Special offers | `/marketing/special-offers` | 4 seed offers |
| Promotions | `/marketing/promotions` | Free shipping + VIP rules running |
| AI prompts | `/settings/ai` | Edit preset → Preset button in product editor |

---

## Known limitations (prototype)

- No real API / scheduler — status inferred from dates in client.
- Cart does not apply BOGO math — only shows hints.
- Featured product rails on homepage do not auto-enrich (deals section + catalog do).
- Promotions page implemented (admin); storefront cart evaluate not wired.

---

## Change log

| Date | Change |
|------|--------|
| 2026-06-15 | Flash Sales + Special Offers admin UI |
| 2026-06-15 | Promotions admin UI (cart rule engine) |
| 2026-06-15 | Storefront offer resolver + hooks |
| 2026-06-15 | AI Settings page + editor prompt store |
| 2026-06-15 | Dev docs + circular-import fixes |
