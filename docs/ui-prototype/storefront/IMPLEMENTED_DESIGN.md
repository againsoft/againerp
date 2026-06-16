# Storefront — Implemented Design (As-Built)

> **Status:** Ready (Prototype) — **documented as built**  
> **Version:** `1.0.0`  
> **Updated:** 2026-06-13  
> **Scope:** AgainShop customer storefront (`/shop/*`)  
> **Architecture target:** [ECOMMERCE_STOREFRONT_ARCHITECTURE.md](../../modules/ecommerce/ECOMMERCE_STOREFRONT_ARCHITECTURE.md)

Prototype implementation in `apps/web` using the `(storefront)` route group. **Mock data** in `src/lib/mock-data/storefront-*.ts`; **client state** in Zustand (`storefront-*-store.ts`). No `/api/v1/storefront/*` integration yet.

---

## App shell

| Item | Implementation |
|------|----------------|
| Layout | `app/(storefront)/layout.tsx` — header, footer, `max-w-6xl`, mobile bottom nav |
| Design density | `.storefront` in `globals.css` — compact 13px base, tighter spacing |
| Header | `StorefrontHeader` — nav, **live search**, compare/wishlist/cart badges, account link |
| Footer | `StorefrontFooter` |
| Mobile nav | `MobileBottomNav` — Home, Categories, Search, Wishlist, Cart, Account |

---

## Routes & pages

| Screen | Route | Page component | View component |
|--------|-------|----------------|----------------|
| Home | `/shop` | `shop/page.tsx` | Home sections (hero, categories, rails, blog, newsletter) |
| All products | `/shop/products` | `shop/products/page.tsx` | `CatalogView` |
| Category PLP | `/shop/c/[...slug]` | `shop/c/[...slug]/page.tsx` | `CatalogView` + category slug |
| Categories index | `/shop/categories` | `shop/categories/page.tsx` | Category grid |
| PDP | `/shop/p/[slug]` | `shop/p/[slug]/page.tsx` | `ProductDetailView` |
| Search | `/shop/search?q=` | `shop/search/page.tsx` | `SearchView` + `LiveSearch` |
| Deals | `/shop/deals` | `shop/deals/page.tsx` | `DealsView` |
| New arrivals | `/shop/new` | `shop/new/page.tsx` | `CollectionView` |
| Best sellers | `/shop/bestsellers` | `shop/bestsellers/page.tsx` | `CollectionView` |
| Cart | `/shop/cart` | `shop/cart/page.tsx` | `CartView` |
| Checkout | `/shop/checkout` | `shop/checkout/page.tsx` | `CheckoutView` |
| Thank you | `/shop/checkout/thank-you` | `shop/checkout/thank-you/page.tsx` | `ThankYouView` |
| Wishlist | `/shop/wishlist` | `shop/wishlist/page.tsx` | `WishlistView` |
| Compare | `/shop/compare?ids=` | `shop/compare/page.tsx` | `CompareView` |
| Account | `/shop/account` | `shop/account/page.tsx` | `AccountView` / `AuthView` |
| Blog list | `/shop/blog` | `shop/blog/page.tsx` | `BlogListView` |
| Blog article | `/shop/blog/[slug]` | `shop/blog/[slug]/page.tsx` | `BlogArticleView` |
| Contact | `/shop/contact` | `shop/contact/page.tsx` | `ContactView` |
| Shipping | `/shop/shipping` | `shop/shipping/page.tsx` | `ShippingReturnsView` |
| FAQ | `/shop/faq` | `shop/faq/page.tsx` | `FaqView` |
| Track order | `/shop/track` | `shop/track/page.tsx` | `TrackOrderView` |
| About | `/shop/about` | `shop/about/page.tsx` | `AboutView` |
| Careers | `/shop/careers` | `shop/careers/page.tsx` | `CareersView` |

---

## Catalog (PLP)

**Components:** `catalog-view.tsx`, `catalog-toolbar.tsx`, `catalog-filters-panel.tsx`, `catalog-breadcrumbs.tsx`, `subcategory-chips.tsx`, `product-list-row.tsx`, `product-card.tsx`

| Feature | Built |
|---------|-------|
| Grid / list toggle | ✓ |
| Sort (relevance, price, newest, best selling) | ✓ |
| Faceted filters (brand, price, in stock, on sale) | ✓ |
| Mobile filter sheet | ✓ |
| Pagination | ✓ |
| URL state (`?q=&sort=&brand=&page=`) | ✓ |
| Wishlist + compare on product card | ✓ |

**Data:** `storefront-catalog.ts` — filters 120 mock products from `products.ts`

---

## Product detail (PDP)

**Components:** `product-detail-view.tsx`, `product-gallery.tsx`, `product-purchase-panel.tsx`, `product-specs.tsx`, `product-reviews-section.tsx`, `product-qa-section.tsx`, `sticky-cart-bar.tsx`

| Feature | Built |
|---------|-------|
| Variant selector (color, size, storage, options) | ✓ |
| Combined variant gallery (all images in strip; jump on variant select) | ✓ |
| Add to cart · Buy now | ✓ |
| Sticky mobile cart bar | ✓ |
| AI summary bullets | ✓ |
| Specifications table | ✓ |
| Shipping & warranty | ✓ |
| Reviews list + filter + **Write a review** dialog | ✓ |
| Q&A accordion + **Ask a question** dialog | ✓ |
| Cross-sell · upsell · related rails | ✓ |
| Wishlist + compare buttons | ✓ |
| **EMI View Plans** (Bank EMI plugin) | ✓ — [BankEmi.md](../plugins/BankEmi.md) |

**EMI components:** `emi-badge.tsx` · `emi-plans-modal.tsx` · `hooks/use-bank-emi.ts` · `lib/plugins/bank-emi/*` · `lib/mock-data/emi-banks.ts`

**Data:** `storefront-product.ts` — variants, specs, reviews, questions, gallery merge

---

## Search

**Components:** `live-search.tsx`, `search-view.tsx`  
**Data:** `storefront-search.ts`

| Feature | Built |
|---------|-------|
| Header live search (200ms debounce) | ✓ |
| Mobile search panel | ✓ |
| Dropdown: products, categories, brands | ✓ |
| Recent + trending suggestions | ✓ |
| Keyboard navigation (↑↓ Enter Esc) | ✓ |
| Full results page `/shop/search?q=` | ✓ |
| Recent searches (localStorage) | ✓ |

---

## Cart & checkout

**Stores:** `storefront-cart-store.ts` (persisted)  
**Data:** `storefront-checkout.ts`, `storefront-cart-extras.ts`

| Feature | Built |
|---------|-------|
| Line items, qty, remove | ✓ |
| Coupon codes (SAVE10, WELCOME, FLASH20) | ✓ |
| Subtotal, savings, free-shipping hint | ✓ |
| Cross-sell rail | ✓ |
| Checkout steps (contact, shipping, payment mock) | ✓ |
| Guest checkout note | ✓ |
| Thank-you page with order param | ✓ |

---

## Wishlist

**Store:** `storefront-wishlist-store.ts` (persisted)  
**Components:** `wishlist-view.tsx`, `wishlist-button.tsx`

| Feature | Built |
|---------|-------|
| Add/remove/toggle on cards + PDP | ✓ |
| Wishlist page with add-to-cart | ✓ |
| Header + mobile nav badge count | ✓ |
| Empty state + suggestions | ✓ |

---

## Compare

**Store:** `storefront-compare-store.ts` (persisted, max 4)  
**Components:** `compare-view.tsx`, `compare-button.tsx`  
**Data:** `storefront-compare.ts`

| Feature | Built |
|---------|-------|
| Side-by-side spec table | ✓ |
| Show differences only toggle | ✓ |
| URL preload `?ids=prod_0001,prod_0002` | ✓ |
| Add product slot · remove · add to cart | ✓ |
| Header badge count | ✓ |

---

## Account & auth

**Store:** `storefront-auth-store.ts` (persisted)  
**Components:** `auth-view.tsx`, `social-login-buttons.tsx`, `account-view.tsx`

| Feature | Built |
|---------|-------|
| Login / Register tabs on one page | ✓ |
| Email login + register forms | ✓ |
| Social: Google, Facebook, WhatsApp (mock) | ✓ |
| Logged-in account hub + sign out | ✓ |
| Deep link `/shop/account?tab=register` | ✓ |

---

## Content & marketing pages

| Page | Mock data file |
|------|----------------|
| Home | `storefront-home.ts` |
| Deals | `storefront-deals.ts` |
| New / Best sellers | `storefront-collections.ts` |
| Blog | `storefront-blog.ts` |
| Contact | `storefront-contact.ts` |
| Shipping | `storefront-shipping.ts` |
| FAQ | `storefront-faq.ts` |
| Track order | `storefront-track-order.ts` |
| About | `storefront-about.ts` |
| Careers | `storefront-careers.ts` |

---

## Client stores (Zustand + persist)

| Store | Key | Purpose |
|-------|-----|---------|
| `storefront-cart-store` | `storefront-cart` | Cart lines, coupon, count |
| `storefront-wishlist-store` | `storefront-wishlist` | Saved products |
| `storefront-compare-store` | `storefront-compare` | Compare list (max 4) |
| `storefront-auth-store` | `storefront-auth` | Mock session user |

---

## File tree (main)

```text
apps/web/src/
├── app/(storefront)/
│   ├── layout.tsx
│   └── shop/                    ← 23 routes (see table above)
├── components/storefront/
│   ├── account/ auth/ cart/ catalog/ checkout/ compare/
│   ├── blog/ collections/ contact/ deals/ faq/ home/
│   ├── product/ search/ shipping/ track/ wishlist/
│   ├── storefront-header.tsx storefront-footer.tsx mobile-bottom-nav.tsx
│   └── product-card.tsx
└── lib/
    ├── mock-data/storefront-*.ts
    └── store/storefront-*-store.ts
```

---

## Prototype vs production gaps

| Area | Prototype today | Production target |
|------|-----------------|-------------------|
| Data | Mock TS modules | `/api/v1/storefront/*` |
| Auth | localStorage mock | OAuth + JWT / session API |
| Reviews / Q&A | Client-only submit | Catalog review/question API |
| Search | In-memory filter | Search index + facets API |
| Checkout | Mock payment | Payment intent + order API |
| Builder | Static sections | Builder-published pages |

---

## Related docs

- [ECOMMERCE_STOREFRONT_ARCHITECTURE.md](../../modules/ecommerce/ECOMMERCE_STOREFRONT_ARCHITECTURE.md) — target architecture  
- [CHANGELOG.md](../../CHANGELOG.md) — `2.42.0-storefront-prototype-ui`  
- [Catalog IMPLEMENTED_DESIGN.md](../catalog/products/IMPLEMENTED_DESIGN.md) — admin product UI (feeds mock `products.ts`)
