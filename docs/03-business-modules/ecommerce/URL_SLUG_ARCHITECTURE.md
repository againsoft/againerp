# URL & Slug Architecture (Moharaz-Style)

## Purpose
Documentation: URL SLUG ARCHITECTURE.

## When To Read
Read only if your task involves url slug architecture.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

> **Status:** Approved (Prototype Phase 1)  
> **Reference:** [Moharaz.com](https://www.moharaz.com) — flat root URLs, blog prefix only  
> **Prototype:** [URL_SLUG_MANAGEMENT.md](../../04-uiux/prototype/storefront/URL_SLUG_MANAGEMENT.md)  
> **Code:** `apps/web/src/lib/url-slug/`

---


## When To Read
Read only if your task involves url slug architecture.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## Principle

All public storefront URLs live **directly under the domain** as a single path segment (`/{slug}`), except blog posts which use **`/blog/{slug}`**.

| Entity | Example (Moharaz) | AgainERP target |
|--------|-------------------|-----------------|
| Category | `https://www.moharaz.com/accessories` | `/{category-slug}` |
| Product | `https://www.moharaz.com/amazon-fire-7-kids-tablet` | `/{product-slug}` |
| Brand | `https://www.moharaz.com/amazon` | `/{brand-slug}` |
| CMS page | `https://www.moharaz.com/warranty-policy` | `/{page-slug}` |
| Blog post | `https://www.moharaz.com/blog/Intel-Core-Ultra-7-265KF-Processor` | `/blog/{post-slug}` |

**Not used:** nested category paths (`/electronics/laptops/hp`), `/shop/p/{slug}`, `/c/{slug}`, `/brand/{slug}`.

---

## Slug Rules

| Rule | Detail |
|------|--------|
| Format | Lowercase ASCII; words separated by `-`; no leading/trailing `-` |
| Uniqueness | **Global** across category, product, brand, and CMS page — one registry |
| Length | Max 120 chars (DB + SEO) |
| Reserved | System routes blocked at save time — see `RESERVED_SLUGS` |
| Blog | Separate namespace under `/blog/` — may reuse words not allowed at root |
| Encoding | Spaces/special chars URL-encoded in links; stored slug is normalized kebab-case |
| Auto-generate | Default from title/name; admin can override; live-edit slug on product list |

### Examples

```
accessories          → category
amazon-fire-7-kids-tablet → product
amazon               → brand
warranty-policy      → CMS page
intel-core-ultra-7-265kf-processor → blog (URL: /blog/intel-core-ultra-7-265kf-processor)
```

---

## Resolution Order

When `GET /{slug}` is requested, the storefront resolver checks (first match wins):

1. **Reserved slug** → handled by explicit Next.js route (cart, checkout, …) or 404
2. **CMS page** → static/informational page renderer
3. **Category** → category PLP (active only)
4. **Brand** → brand PLP (active only)
5. **Product** → PDP (published only)
6. **No match** → 404

Blog is **not** in this chain — served only at `/blog/{slug}`.

```
Request: GET /amazon-fire-7-kids-tablet
  → not reserved
  → not CMS
  → not category
  → not brand
  → product match ✓ → PDP

Request: GET /accessories
  → category match ✓ → PLP

Request: GET /blog/intel-core-ultra-7-265kf-processor
  → blog route only
```

---

## Admin ↔ Storefront Mapping

| Admin field | Storefront URL | Notes |
|-------------|----------------|-------|
| Category `slug` | `/{slug}` | Flat; parent shown in breadcrumbs, not in URL |
| Product `slug` | `/{slug}` | Distinct from SKU; canonical for SEO |
| Brand `slug` | `/{slug}` | Brand listing page |
| CMS `slug` | `/{slug}` | Informational pages (warranty, privacy, …) |
| Blog `slug` | `/blog/{slug}` | Only prefixed content type |

Category **parent** is metadata only (menu, breadcrumbs, filters) — Moharaz uses `Home › Tablet › Kids Tablet` in breadcrumbs while URL stays flat product slug.

---

## Reserved Slugs (System Routes)

Blocked from category/product/brand/page assignment:

```
cart, checkout, account, login, register, search, wishlist, compare, track,
blog, api, admin, dashboard, catalog, orders, settings, media, shop,
products, categories, brands, new, deals, bestsellers, offers, contact,
about, faq, careers, shipping, sitemap, robots.txt
```

Functional pages may later use flat slugs (`contact`, `about`) as **CMS pages** or dedicated routes — document per page in CMS registry.

---

## Database (Production)

| Table | Columns |
|-------|---------|
| `seo_url_registry` | `company_id`, `slug`, `entity_type`, `entity_id`, `locale`, `is_canonical`, `created_at` |
| Unique | `(company_id, slug, locale)` |

On create/update: validate uniqueness + reserved list. Redirect old slug → new slug (301) in `seo_url_redirect`.

---

## API (Production)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/storefront/resolve/{slug}` | Resolve entity type + id |
| GET | `/api/v1/storefront/blog/{slug}` | Blog post |
| POST | `/api/v1/catalog/slug/check` | Admin availability check |

---

## SEO

- Canonical URL = flat `/{slug}` or `/blog/{slug}`
- Product JSON-LD `@id` uses canonical URL
- Sitemap: products, categories, brands, pages, blog posts with lastmod
- Legacy URLs (`/shop/p/*`, `/shop/c/*`) → 301 to canonical

---

## Related

- [ECOMMERCE_STOREFRONT_ARCHITECTURE.md](./ECOMMERCE_STOREFRONT_ARCHITECTURE.md)
- [catalog/ARCHITECTURE.md](./catalog/ARCHITECTURE.md)
- [Product List UI](../../04-uiux/prototype/catalog/products/ProductList.md) — slug live edit

**Last updated:** 2026-06-13
