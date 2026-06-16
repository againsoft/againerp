# Bank EMI Calculator — UI Prototype

> **Status:** Draft  
> **Plugin ID:** `bank-emi`  
> **Admin route:** `/settings/plugins/bank-emi`  
> **Storefront:** PDP · Cart · PC Builder · Checkout banner  
> **Architecture:** [Architecture.md](../../plugins/bank-emi/Architecture.md)  
> **Reference:** [Apple Gadgets BD — EMI modal](https://www.applegadgetsbd.com/product/apple-pencil-pro)

---

## Purpose

Prototype the **Bank EMI Calculator** plugin end-to-end: admin configures banks and tenure rates; storefront shows **“EMI Available”** with **View Plans** modal (Apple Gadgets–style layout).

---

## Business Goals

- Increase conversion on high-ticket products (PC builds, phones, laptops)
- Reduce “price shock” by showing monthly installment upfront
- Let merchant update bank rates without developer deploy
- Match Bangladesh shopper expectations (AB Bank, Brac, SSLCommerz banks)

---

## User Roles

| Role | Access |
|------|--------|
| Store Owner | Install plugin, edit all banks/plans |
| Manager | Edit plans, preview modal |
| Customer | View Plans on storefront (public) |

---

## Part A — Admin: Plugin Config

**Route:** `/settings/plugins/bank-emi`

### Layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Plugins    Bank EMI Calculator [Active]    [Preview] [Docs] [Uninstall]   │
│ Plugin Status toggle                                                        │
├──────────────┬──────────────────────────────────────────────────────────────┤
│ General      │ Minimum order amount: [ 5000 ]                               │
│ Display      │ ☑ Product page  ☑ Cart  ☑ PC Builder  ☐ Checkout banner      │
│ Banks        │ Label (EN): EMI Available for orders above ৳ {min}           │
│ Plans        │ Label (BN): {min} টাকার বেশি অর্ডারে কিস্তি সুবিধা           │
│ Preview      │                                                              │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

### Banks table (`Banks & Plans` section) — **Implemented**

**Route:** `/settings/plugins/bank-emi` → sidebar **Banks & Plans**

| Action | How |
|--------|-----|
| **Add bank** | Left panel **+ Add bank** → name, icon letter, color |
| **Set Charge %** | Select bank → table-এ প্রতি month (3, 6, 9, 12…) → **Charge %** লিখুন |
| **Enable tenure** | Row-এর checkbox — unchecked = storefront-এ দেখাবে না |
| **Live preview** | ৳14,000 example-এ EMI + Effective cost same table-এ |
| **Save** | **Save banks** → storefront modal তৎক্ষণাৎ update |
| **Preview modal** | **Preview** → customer View Plans modal |
| **Copy rates** | **Copy plans from another bank** |
| **Remove** | **Remove bank** (minimum 1 bank থাকতে হবে) |

**Formula:** `Effective = Amount × (1 + Charge%/100)` · `Monthly EMI = Effective ÷ Months`

**Example:** ৳14,000 · 3 months · 4.16% → ৳4,860.80/mo · Effective ৳14,582.40

### Preview panel

- Test amount input → opens same modal as storefront in iframe/dialog

---

## Part B — Storefront: PDP

**Hook:** `product-purchase-panel.tsx` (below price, above Add to Cart)

### Inline badge

```text
┌────────────────────────────────────────┐
│ ৳ 14,000  (Cash Price)                 │
│                                        │
│ 💳 EMI Available for orders above ৳5,000 │
│    [ View Plans ]                      │
│                                        │
│ [ Shop Now ]  [ Add To Cart ]          │
└────────────────────────────────────────┘
```

| Field | Rule |
|-------|------|
| Visibility | `price >= min_order_amount` && plugin enabled |
| View Plans | Opens `EmiPlansModal` with `defaultAmount = variant.price` |
| Sticky bar | Compact “EMI from ৳X/mo” when eligible |

---

## Part C — Storefront: EMI Options Modal

**Component:** `components/storefront/emi/emi-plans-modal.tsx`

### Layout (matches reference screenshot)

```text
┌──────────────────────────────────────────────────────────────────┐
│ EMI Options                                                  [X] │
├─────────────────┬────────────────────────────────────────────────┤
│ ┌─────────────┐ │ Enter Amount                                   │
│ │ (A) AB Bank │ │ ┌──────────────────────────────────────────┐   │
│ └─────────────┘ │ │ 14000                                    │   │
│   AB Bank Online│ └──────────────────────────────────────────┘   │
│   Al-Arafah     │                                                │
│   Bank Asia     │  Plan    EMI         Charge    Effective Cost  │
│   Brac Bank     │  ─────────────────────────────────────────────  │
│   (scroll…)     │  3 mo    ৳4,860.80   4.16%     ৳14,582.40     │
│                 │  6 mo    ৳2,492.00   6.50%     ৳14,952.00     │
│                 │  9 mo    ৳1,694.22   7.80%     ৳15,248.00     │
│                 │  12 mo   ৳1,358.69   8.69%     ৳15,304.28     │
│                 │                                                │
│                 │  * Estimated EMI. Final terms at payment.      │
└─────────────────┴────────────────────────────────────────────────┘
```

### Behaviour

| Interaction | Response |
|-------------|----------|
| Open modal | First bank selected; amount = context price |
| Change amount | Debounce 300ms → recalculate all rows |
| Select bank | Highlight left card; refresh table |
| Mobile | Banks → horizontal chips on top; table scrolls |
| Keyboard | Esc close; Tab through banks |

### States

| State | UI |
|-------|-----|
| Below minimum | Badge hidden; modal shows “Minimum ৳5,000 required” |
| No banks | “EMI not available” empty state |
| Loading | Skeleton table |

---

## Part D — Cart & PC Builder

| Surface | Copy |
|---------|------|
| Cart summary | “EMI from ৳2,492/mo · [View Plans]” on subtotal |
| PC Builder total | Same on `builder-summary` footer |
| Checkout | Optional info banner only (Phase 1) |

---

## Mock Data (`lib/mock-data/emi-banks.ts`)

| Bank ID | Name | 3mo % | 6mo % | 9mo % | 12mo % |
|---------|------|-------|-------|-------|--------|
| `ab_bank` | AB Bank | 4.16 | 6.50 | 7.80 | 8.69 |
| `ab_bank_online` | AB Bank - Online | 3.99 | 6.20 | 7.50 | 8.40 |
| `al_arafah` | Al-Arafah | 4.50 | 6.80 | 8.00 | 9.00 |
| `bank_asia` | Bank Asia | 4.25 | 6.60 | 7.90 | 8.75 |
| `brac_bank` | Brac Bank | 4.00 | 6.30 | 7.60 | 8.50 |

**Global:** `min_order_amount: 5000`

---

## Prototype Implementation Plan

| Step | Task | File | Status |
|------|------|------|--------|
| 1 | Types + calculator | `lib/plugins/bank-emi/calculator.ts` | ✓ |
| 2 | Mock banks seed | `lib/mock-data/emi-banks.ts` | ✓ |
| 3 | Plugin registry entry | `lib/settings/plugins/registry.ts` | ✓ |
| 4 | EMI modal | `components/storefront/emi/emi-plans-modal.tsx` | ✓ |
| 5 | EMI badge | `components/storefront/emi/emi-badge.tsx` | ✓ |
| 6 | Wire PDP | `product-purchase-panel.tsx` | ✓ |
| 7 | Wire cart + builder | `cart-view.tsx`, `builder-summary.tsx` | ✓ |

---

## Validation Rules

| Rule | Client | Server |
|------|--------|--------|
| Amount > 0 | ✓ | ✓ |
| Charge % 0–100 | Admin | ✓ |
| Months ∈ {3,6,9,12,18,24} | Admin | ✓ |
| Min amount ≤ max | Admin | ✓ |

---

## Future Enhancements

- SSLCommerz EMI redirect from selected plan row
- “Compare banks” highlight lowest effective cost
- WhatsApp share EMI breakdown
- AI: “Can I afford this on 6-month EMI?” in chat

---

## Dependencies

- [Plugins.md](../settings/Plugins.md)
- [IMPLEMENTED_DESIGN.md](../storefront/IMPLEMENTED_DESIGN.md)
- `product-purchase-panel.tsx` · `builder-summary.tsx`

---

**Last Updated:** 2026-06-15
