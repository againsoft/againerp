# Flash Sales — Admin UI (Implemented)

> **Status:** Prototype implemented  
> **Route:** `/marketing/flash-sales`  
> **Menu:** Marketing → Flash Sales  
> **Page spec:** [FlashSales.md](./FlashSales.md) · **Dev:** [MARKETING_PROTOTYPE_DEV.md](./MARKETING_PROTOTYPE_DEV.md) · **Storefront:** [STOREFRONT_OFFERS_DEV.md](./STOREFRONT_OFFERS_DEV.md)

---

## কীভাবে কাজ করে (How it works)

Scheduled offers এক বা একাধিক প্রোডাক্টের জন্য সময় নির্ধারিত দাম কমানোর সিস্টেম।

```
Admin তৈরি করে → Schedule (start/end) → Scheduler চালু হলে special_price sync
→ Storefront /deals + PDP তে দেখায় → শেষ সময়ে দাম ফিরে যায়
```

| ধাপ | কী হয় |
|-----|--------|
| 1. Create | নাম, slug, প্রোডাক্ট বাছাই, % বা fixed discount |
| 2. Schedule | `starts_at` / `ends_at` — status = Scheduled |
| 3. Auto sync | শুরুতে catalog `special_price` সেট; শেষে revert |
| 4. Storefront | Homepage banner (optional), `/deals`, product page strike-through |
| 5. End | status = Completed, revenue/orders KPI আপডেট |

**এক প্রোডাক্ট vs অনেক প্রোডাক্ট:** একই ফর্ম — product picker দিয়ে ১ বা ১০০+ SKU যোগ করা যায়। প্রতি প্রোডাক্টে আলাদা discount type/value।

**অন্য মডিউল কখন ব্যবহার করবেন:**

| Use case | Module |
|----------|--------|
| Scheduled product price drop | **Flash Sales** (এই পেজ) |
| Cart/category rules | Promotions |
| BOGO / bundle | Special Offers |
| Coupon code | Coupons |

---

## Admin screens

### List (`FlashSalesList`)

- **Flow banner** — ৫ ধাপের visual pipeline
- **KPI cards** — Running, Scheduled, Products on offer, Revenue
- **Search + status filter**
- **Sale cards** — name, slug, status badge, schedule, product chips with prices
- **Actions** — Edit, Duplicate, Preview deals, Delete

### Create/Edit (`FlashSaleFormSheet`)

Right sheet with sections:

1. **Details** — name, slug, description
2. **Schedule** — datetime start/end, status
3. **Storefront** — show on homepage, show on deals page
4. **Products** — search catalog, add/remove, per-item % or fixed discount, live sale price preview
5. **How this works** — info box explaining scheduler + storefront

Buttons: **Save draft** | **Schedule offer**

---

## Data (prototype)

- `apps/web/src/lib/mock-data/flash-sales.ts` — types, seed, helpers
- `apps/web/src/lib/store/flash-sale-store.ts` — Zustand persist (`againerp-flash-sales`)

---

## Files

| File | Role |
|------|------|
| `app/(admin)/marketing/flash-sales/page.tsx` | Page shell |
| `components/marketing/flash-sales-list.tsx` | List + KPIs |
| `components/marketing/flash-sale-form-sheet.tsx` | Create/edit sheet |
| `components/marketing/marketing-control-center.tsx` | Dashboard Flash Sales card |

---

## Storefront (wired)

Admin flash sales feed `lib/storefront/storefront-offers.ts`:

| Surface | Condition |
|---------|-----------|
| PDP sale price | Product in running sale `items` |
| `/deals` | `show_on_deals_page` + running |
| Homepage strip | `show_on_homepage` + running (`HomeDealsSection`) |
| Product cards | Enriched via `enrichStorefrontProduct()` |

**Dev rules:** Do not import `flash-sale-store` in server modules without seed fallback. See [STOREFRONT_OFFERS_DEV.md](./STOREFRONT_OFFERS_DEV.md).

---

## Seed data (testing)

| ID | Status | Products |
|----|--------|----------|
| `fs_weekend_fashion` | running | prod_0001, prod_0006, prod_0013 |

Test URLs: `/deals`, `/premium-cotton-t-shirt-0001`, homepage deals section.

---

## Backend (future)

Tables: `marketing_flash_sales`, `marketing_flash_sale_items`. Scheduler job at `starts_at`/`ends_at` updates `catalog_products.special_price` and storefront cache.
