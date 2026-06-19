# Storefront UI Prototype

## Purpose
Documentation: README.

## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../../BRAIN.md)

## Read Next
- [Doc map](../../../PROJECT_MAP.md)

---

> **Status:** Active (Prototype)  
> **Route prefix:** `/shop/*`  
> **Code:** `apps/web/src/app/(storefront)/` · `apps/web/src/components/storefront/`  
> **As-built:** [IMPLEMENTED_DESIGN.md](./IMPLEMENTED_DESIGN.md)


## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../../BRAIN.md)

## Read Next
- [Doc map](../../../PROJECT_MAP.md)

---

Customer-facing **AgainShop** storefront — separate from admin (`/dashboard`, `/catalog/*`). Mock data + Zustand client state only; no storefront API yet.

---

## Documents

| Document | Purpose |
|----------|---------|
| [IMPLEMENTED_DESIGN.md](./IMPLEMENTED_DESIGN.md) | **As-built** — routes, components, stores, features |
| [../modules/ecommerce/ECOMMERCE_STOREFRONT_ARCHITECTURE.md](../../../03-business-modules/ecommerce/ECOMMERCE_STOREFRONT_ARCHITECTURE.md) | Target production architecture (API-first) |

---

## Quick route map

| Route | Screen |
|-------|--------|
| `/shop` | Home |
| `/shop/products` | All products PLP |
| `/shop/c/[...slug]` | Category PLP |
| `/shop/categories` | Category index |
| `/shop/p/[slug]` | Product PDP |
| `/shop/search` | Search results + live search |
| `/shop/deals` | Deals |
| `/shop/new` | New arrivals |
| `/shop/bestsellers` | Best sellers |
| `/shop/cart` | Cart |
| `/shop/checkout` | Checkout |
| `/shop/checkout/thank-you` | Order confirmation |
| `/shop/wishlist` | Wishlist |
| `/shop/compare` | Product compare |
| `/shop/account` | Login / Register / Account |
| `/shop/blog`, `/shop/blog/[slug]` | Blog |
| `/shop/contact` | Contact |
| `/shop/shipping` | Shipping & returns |
| `/shop/faq` | FAQ |
| `/shop/track` | Track order |
| `/shop/about` | About |
| `/shop/careers` | Careers |

---

## Dev

```bash
cd apps/web && npm run dev -- --port 3001
```

Admin remains at `/` → redirects to `/dashboard`. Storefront home: `/shop`.
