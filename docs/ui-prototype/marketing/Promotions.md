# Promotions

> **Status:** Prototype implemented (UI + mock store)  
> **Prototype Phase:** 1 — UI + client persist  
> **Module:** Ecommerce · Marketing  
> **Route:** `/marketing/promotions`  
> **Menu Location:** Marketing → Promotions  
> **Dev guide:** [PROMOTIONS_ADMIN.md](./PROMOTIONS_ADMIN.md) · [MARKETING_PROTOTYPE_DEV.md](./MARKETING_PROTOTYPE_DEV.md)  
> **Architecture:** [ARCHITECTURE.md](../../modules/ecommerce/marketing/ARCHITECTURE.md)

---

## Purpose

Rule-based **auto discounts** at checkout — cart subtotal thresholds, products in cart, customer segments, and category rules. No coupon code required.

**Not for:** scheduled product price drops (Flash Sales) or BOGO/bundles (Special Offers).

---

## Business Goal

- Merchandising rules that apply automatically when conditions match
- Priority and stacking control when multiple promotions are active
- Attribution for revenue impact without manual coupon entry

---

## User Roles

| Role | Access | Notes |
|------|--------|-------|
| Admin | Full | Create, activate, delete |
| Manager | Read/Write | Same in prototype |
| Staff | Read | View list |

---

## UI Layout

- **List:** rule engine flow banner, KPI cards, search + status filter, promotion cards
- **Create/Edit:** right sheet — conditions (WHEN), actions (THEN), schedule, engine settings

See [PROMOTIONS_ADMIN.md](./PROMOTIONS_ADMIN.md).

---

## Rule types

| Type | Field | Example |
|------|-------|---------|
| Cart subtotal | `minSubtotal` | Spend ৳3,000+ |
| Product in cart | `productId`, `minQuantity` | T-shirt in cart |
| Customer group | `customerGroup` | VIP |
| Category | `category` | Electronics |

---

## Action types

| Type | Field | Example |
|------|-------|---------|
| % off cart | `value`, `maxDiscount` | 10% off, cap ৳2,000 |
| Fixed off cart | `value` | ৳500 off |
| % off item | `value` | 15% off matching SKUs |
| Free item | `productId` | Free mug |
| Free shipping | — | Waive shipping |

---

## Components

| Component | Path |
|-----------|------|
| `PromotionsList` | `components/marketing/promotions-list.tsx` |
| `PromotionFormSheet` | `components/marketing/promotion-form-sheet.tsx` |

---

## Data & persist

- Seed: `lib/mock-data/promotions.ts`
- Store: `lib/store/promotion-store.ts` → key `againerp-promotions`

---

## Related Pages

| Page | Relation |
|------|----------|
| [Flash Sales](./FlashSales.md) | Scheduled catalog price |
| [Special Offers](./SpecialOffers.md) | BOGO / bundle / gift |
| [Coupons](./Coupons.md) | Code-based discounts |

---

## Backend (future)

Tables: `marketing_promotions`, `marketing_promotion_rules`, `marketing_promotion_actions`.  
API: `GET/POST /promotions`, `POST /evaluate` at checkout.

---

## Change History

| Date | Change |
|------|--------|
| 2026-06-12 | Stub generated |
| 2026-06-15 | Full admin UI + store documented |
