# SEO Standards

> Parent: [DEVELOPMENT_STANDARDS.md §3](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md#3-seo-first)

## Purpose
Global UI standard: seo.

## When To Read
Read only if working on UI patterns related to seo.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---


## When To Read
Read only if working on UI patterns related to seo.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Scope

Applies to all **public** pages: Website module, Ecommerce storefront, public product/category pages.

Admin and ERP back-office pages: `noindex, nofollow` by default.

## Required Per Page

| Element | Rule |
|---------|------|
| URL | Human-readable slug, lowercase, hyphen-separated |
| Meta title | Unique, 50–60 characters |
| Meta description | Unique, 150–160 characters |
| Open Graph | `og:title`, `og:description`, `og:image`, `og:url` |
| Twitter Card | `summary_large_image` |
| Canonical | `<link rel="canonical">` |
| Breadcrumbs | Visible UI + BreadcrumbList JSON-LD |

## Structured Data (JSON-LD)

| Page Type | Schema |
|-----------|--------|
| Product | `Product` |
| Category | `CollectionPage` |
| Organization | `Organization` |
| Breadcrumbs | `BreadcrumbList` |

## Site-Level

- `sitemap.xml` — auto-generated, submitted to search consoles
- `robots.txt` — allow public, disallow admin/api
- hreflang tags when multi-language is active

## Ecommerce Module

SEO settings managed in `Menus/Settings/SEO Settings.md`.
