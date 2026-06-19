# Flash Sales

> **Status:** Prototype implemented (UI + mock store)  
> **Prototype Phase:** 1 — UI + client persist  
> **Module:** Ecommerce · Marketing  
> **Route:** `/marketing/flash-sales`  
> **Menu Location:** Marketing → Flash Sales  
> **Dev guide:** [FLASH_SALES_ADMIN.md](./FLASH_SALES_ADMIN.md) · [MARKETING_PROTOTYPE_DEV.md](./MARKETING_PROTOTYPE_DEV.md)  
> **Storefront:** [STOREFRONT_OFFERS_DEV.md](./STOREFRONT_OFFERS_DEV.md)

---

## Purpose

Scheduled offers: one or many products get a time-bound discount. When the sale runs, storefront shows sale price on PDP, `/deals`, and optionally homepage.

**Not for:** BOGO, bundles, cart rules — use [Special Offers](./SpecialOffers.md) or Promotions.

---

## Business Goal

- Run time-limited price campaigns without editing each product manually
- Sync effective price to storefront during the window
- Track running / scheduled / completed offers from one list

---

## User Roles

| Role | Access | Notes |
|------|--------|-------|
| Admin | Full | Create, schedule, delete |
| Manager | Read/Write | Same in prototype |
| Staff | Read | View list |

---

## UI Layout

- **List page:** flow banner, KPI cards, search + status filter, sale cards
- **Create/Edit:** right sheet (`FlashSaleFormSheet`) — details, schedule, storefront flags, product picker with per-SKU discount

See [FLASH_SALES_ADMIN.md](./FLASH_SALES_ADMIN.md) for screen breakdown.

---

## Components

| Component | Path |
|-----------|------|
| `FlashSalesList` | `components/marketing/flash-sales-list.tsx` |
| `FlashSaleFormSheet` | `components/marketing/flash-sale-form-sheet.tsx` |
| Marketing KPI card | `components/marketing/marketing-control-center.tsx` |

---

## Fields (prototype)

| Field | Notes |
|-------|-------|
| `name`, `slug`, `description` | Identity |
| `starts_at`, `ends_at` | Schedule |
| `status` | draft / scheduled / running / completed / cancelled |
| `show_on_homepage`, `show_on_deals_page` | Storefront visibility |
| `items[]` | `product_id`, `discount_type` (% or fixed), `discount_value` |

---

## Actions

| Action | Behaviour |
|--------|-----------|
| Create / Edit | Opens sheet, saves to Zustand persist |
| Duplicate | Copies sale with new id |
| Preview deals | Links to storefront `/deals` |
| Delete | Removes from store |

---

## Data & persist

- Seed: `lib/mock-data/flash-sales.ts`
- Store: `lib/store/flash-sale-store.ts` → key `againerp-flash-sales`

---

## Storefront behaviour

When status is **running** (by date) and product is in `items`:

- PDP: strike-through compare + sale price via `resolveProductOffer()`
- `/deals`: listed if `show_on_deals_page`
- Homepage: `HomeDealsSection` if `show_on_homepage`

---

## Related Pages

| Page | Relation |
|------|----------|
| [Special Offers](./SpecialOffers.md) | Cart-engine deals |
| [Promotions](./Promotions.md) | Placeholder — cart/category rules |
| Marketing overview | `/marketing` |

---

## Backend (future)

Tables: `marketing_flash_sales`, `marketing_flash_sale_items`. Scheduler updates `catalog_products.special_price` at `starts_at` / `ends_at`.

---

## Change History

| Date | Change |
|------|--------|
| 2026-06-12 | Stub generated |
| 2026-06-15 | Admin UI + store + storefront wiring documented |
