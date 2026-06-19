# Storefront URL Slug Management — Prototype

> **Architecture:** [URL_SLUG_ARCHITECTURE.md](../../../03-business-modules/ecommerce/URL_SLUG_ARCHITECTURE.md)  
> **Status:** In progress (Phase 1)  
> **Code:** `apps/web/src/lib/url-slug/` · `(storefront)/[slug]/` · `(storefront)/blog/`

---

## Target URL Map

| Type | Old (deprecated) | New (canonical) | Example |
|------|------------------|-----------------|---------|
| Category | `/shop/c/{nested/slug}` | `/{slug}` | `/accessories` |
| Product | `/shop/p/{slug}` | `/{slug}` | `/amazon-fire-7-kids-tablet` |
| Brand | `/shop/brands/{slug}` | `/{slug}` | `/amazon` |
| CMS page | `/shop/shipping` (hardcoded) | `/{slug}` | `/warranty-policy` |
| Blog list | `/shop/blog` | `/blog` | `/blog` |
| Blog post | `/shop/blog/{slug}` | `/blog/{slug}` | `/blog/intel-core-ultra-7-265kf-processor` |

System routes (`/shop/cart`, `/shop/checkout`, …) remain under `/shop/*` until Phase 2 root migration.

---

## Implementation Checklist

### Done (2026-06-13)

- [x] Architecture doc — `URL_SLUG_ARCHITECTURE.md`
- [x] Slug resolver — `lib/url-slug/resolver.ts`
- [x] Path builders — `lib/url-slug/paths.ts`
- [x] Reserved slugs — `lib/url-slug/reserved-slugs.ts`
- [x] CMS pages mock — `lib/mock-data/cms-pages.ts`
- [x] Unified route — `(storefront)/[slug]/page.tsx`
- [x] Blog at root — `(storefront)/blog/[slug]/page.tsx`
- [x] Flat category slugs in mock data
- [x] Legacy redirects — `next.config.ts` (`/shop/p/*`, `/shop/c/*`)

### Phase 2

- [ ] Migrate all storefront links from `/shop/p/` → `productPath()`
- [ ] Move system routes to root (`/cart`, `/checkout`, …)
- [ ] Admin slug uniqueness validator on category/brand/product save
- [ ] `seo_url_registry` table + 301 redirect engine
- [ ] Sitemap generator with flat URLs
- [ ] Remove `/shop` prefix entirely

---

## Path Helpers

Use **`@/lib/url-slug/paths`** everywhere — never hardcode `/shop/p/`:

```ts
import { productPath, categoryPath, brandPath, blogPostPath, cmsPagePath } from "@/lib/url-slug/paths";

productPath("amazon-fire-7-kids-tablet");  // /amazon-fire-7-kids-tablet
categoryPath("accessories");                 // /accessories
brandPath("amazon");                         // /amazon
blogPostPath("intel-core-ultra-7-265kf-processor"); // /blog/intel-core-ultra-7-265kf-processor
cmsPagePath("warranty-policy");              // /warranty-policy
```

---

## Mock Data Examples

| Entity | Slug | URL |
|--------|------|-----|
| Category Accessories | `accessories` | `/accessories` |
| Category HP Laptop | `hp-laptop` | `/hp-laptop` |
| Product | `amazon-fire-7-kids-tablet` | `/amazon-fire-7-kids-tablet` |
| Brand Amazon | `amazon` | `/amazon` |
| Page | `warranty-policy` | `/warranty-policy` |
| Blog | `intel-core-ultra-7-265kf-processor` | `/blog/intel-core-ultra-7-265kf-processor` |

---

## Testing

1. Open `/accessories` — category PLP
2. Open `/hp-laptop` — subcategory PLP
3. Open `/amazon-fire-7-kids-tablet` — PDP (when product seeded)
4. Open `/amazon` — brand PLP
5. Open `/warranty-policy` — CMS page
6. Open `/blog/intel-core-ultra-7-265kf-processor` — blog article
7. Legacy `/shop/p/{slug}` → 301 to `/{slug}`

---

**Parent:** [IMPLEMENTED_DESIGN.md](./IMPLEMENTED_DESIGN.md)
