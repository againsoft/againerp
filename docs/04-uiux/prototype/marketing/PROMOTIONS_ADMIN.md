# Promotions — Admin UI (Implemented)

> **Status:** Prototype implemented  
> **Route:** `/marketing/promotions`  
> **Menu:** Marketing → Promotions  
> **Page spec:** [Promotions.md](./Promotions.md) · **Dev:** [MARKETING_PROTOTYPE_DEV.md](./MARKETING_PROTOTYPE_DEV.md)  
> **Architecture:** `docs/modules/ecommerce/marketing/ARCHITECTURE.md`

---

## Purpose

**Rule-based auto discounts** evaluated by the cart engine at checkout — no coupon code required.

| Module | Use case |
|--------|----------|
| **Promotions** (this page) | Cart subtotal, category, customer group, product-in-cart rules |
| Flash Sales | Scheduled product `special_price` sync |
| Special Offers | BOGO, bundles, gifts, tiered qty |
| Coupons | Shopper enters a code |

---

## Rule types (WHEN)

| Type | Example |
|------|---------|
| `cart_subtotal` | Spend ৳5,000+ |
| `product_in_cart` | Premium T-Shirt in cart (min qty) |
| `customer_group` | VIP customers only |
| `category` | Electronics items in cart |

Multiple conditions = **AND** (all must match).

---

## Action types (THEN)

| Type | Example |
|------|---------|
| `percent_off_cart` | 10% off entire cart |
| `fixed_off_cart` | ৳500 off cart |
| `percent_off_item` | 15% off matching items |
| `free_item` | Free mug added |
| `free_shipping` | Waive shipping fee |

---

## Flow

```
Admin defines rules + actions → Schedule → Cart engine evaluates at checkout
→ Auto-apply (no code) → Priority / stacking resolved → Order attribution
```

Evaluation order: **promotions → coupon → loyalty → wallet** (per architecture doc).

---

## Admin screens

### List (`PromotionsList`)

- Rule engine flow banner
- KPI: Active rules, Scheduled, Auto-apply, Revenue impact
- Search + status filter
- Promotion cards: human-readable rule summary, condition → action chips
- Actions: Edit, Duplicate, Delete

### Create/Edit (`PromotionFormSheet`)

1. **Details** — name, slug, description
2. **Conditions** — add/remove rules (type-specific fields)
3. **Actions** — add/remove discount actions
4. **Schedule** — start/end, status
5. **Engine** — priority, stacking mode, auto-apply, cart message, announcement banner

Buttons: **Save draft** | **Activate promotion**

---

## Seed data

| ID | Status | Summary |
|----|--------|---------|
| `promo_free_ship_3k` | running | Free shipping ≥ ৳3,000 |
| `promo_vip_cart` | running | VIP → 10% off cart |
| `promo_electronics` | scheduled | Electronics → 15% off items |
| `promo_tshirt_bonus` | completed | T-shirt in cart → 5% off |
| `promo_wholesale_ship` | draft | Wholesale + ৳8k → free mug |

---

## Data (prototype)

- `lib/mock-data/promotions.ts` — types, seed, `describePromotion()`
- `lib/store/promotion-store.ts` — Zustand persist (`againerp-promotions`)

---

## Files

| File | Role |
|------|------|
| `app/(admin)/marketing/promotions/page.tsx` | Page shell |
| `components/marketing/promotions-list.tsx` | List + KPIs |
| `components/marketing/promotion-form-sheet.tsx` | Create/edit sheet |
| `components/marketing/marketing-control-center.tsx` | Dashboard promotions card |

---

## Backend (future)

Tables: `marketing_promotions`, `marketing_promotion_rules`, `marketing_promotion_actions`.  
Checkout: `POST /api/v1/marketing/evaluate` — &lt; 20ms target per architecture.

---

## Storefront (not wired yet)

Prototype admin only. Future: cart hints + announcement bar from `showOnCart` / `showAnnouncement` flags.
