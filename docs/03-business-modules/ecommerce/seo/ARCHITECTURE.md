# AgainERP — SEO Module Architecture

> **Status:** Draft  
> **Module:** SEO (Ecommerce domain · Platform-ready)  
> **Version:** 1.0  
> **Document Type:** Enterprise Architecture  
> **Governance:** [GOVERNANCE.md](../../../00-foundation/GOVERNANCE.md) · **Standards:** [DEVELOPMENT_STANDARDS.md](../../../00-foundation/standards/DEVELOPMENT_STANDARDS.md)

**No application code.** Source of truth for SEO design and implementation.

**Related:** [catalog/ARCHITECTURE.md](../catalog/ARCHITECTURE.md) · [builder/ARCHITECTURE.md](../builder/ARCHITECTURE.md) · [ui-ux/seo.md](../../../04-uiux/standards/seo.md)  
**UI menus:** `Menus/SEO/`

---

## Executive Summary

The **SEO** module is AgainERP's **search visibility control plane** for the ecommerce storefront. It centralizes meta data, URL management, redirects, structured data (schemas), sitemaps, keyword tracking, internal linking, and SEO audits — complementing per-entity SEO fields in Catalog and Builder.

| Connects To | Integration |
|-------------|-------------|
| **Catalog** | Product/category meta, slugs, schema on PDP |
| **Builder** | CMS page meta, landing URLs |
| **Analytics** | Organic traffic, keyword rank history |
| **AI** | Meta generation, audit suggestions |
| **Storefront** | Sitemap XML, robots.txt, redirects |

### Scale Targets

| Dimension | Target |
|-----------|--------|
| Indexed URLs | 1,000,000+ |
| Redirects | 500,000+ |
| Sitemap generation | < 5 min full rebuild |
| Audit scan | 10,000 URLs/min (queued) |

**Table namespace:** `seo_*`

---

# Module Mission

## Why SEO Exists

Organic discovery depends on consistent URLs, metadata, and structured data across products, categories, and CMS pages. Without a dedicated SEO layer:

- Duplicate content from URL variants hurts rankings
- Missing meta and schema reduce click-through
- Redirect chains accumulate after catalog changes
- No single view of SEO health across the store

SEO provides **governance, automation, and audit** — while Catalog/Builder remain authoritative for entity content.

## Design Principle

```
Entity tables (catalog_product_seo, builder_page_seo) → field-level meta
seo_* tables → global rules, redirects, audits, keywords, sitemaps
```

---

# Module Structure

```
SEO
├── SEO Dashboard             ← Health score, issues summary
├── Meta Manager              ← Bulk meta edit across entities
├── URL Manager               ← Slug patterns, canonical rules
├── Redirect Manager          ← 301/302 redirect rules
├── Schema Manager            ← JSON-LD templates per page type
├── Sitemap Manager           ← XML sitemap config & generation
├── Robots Manager            ← robots.txt, noindex rules
├── Internal Linking          ← Suggested links, hub pages
├── Broken Link Checker         ← Crawl queue, 404 report
├── Keyword Tracking          ← Rank history per keyword/URL
├── SEO Audit                 ← Automated issue scanner
└── Page Speed Analysis       ← Core Web Vitals snapshot (v2 integration)
```

Screen docs: `Menus/SEO/`

---

# Meta Data Architecture

## Entity-Level Meta (Catalog / Builder)

| Source Table | Fields |
|--------------|--------|
| `catalog_product_seo` | `meta_title`, `meta_description`, `slug`, `canonical_url`, `og_*` |
| `catalog_category_seo` | Same pattern per locale |
| `catalog_brand_seo` | Brand landing meta |
| `builder_page_seo` | CMS page meta |

## Global Meta Templates

**Table:** `seo_meta_templates`

| Field | Notes |
|-------|-------|
| `entity_type` | product, category, brand, page |
| `locale` | en, bn, … |
| `title_pattern` | `{product_name} \| {store_name}` |
| `description_pattern` | Template with placeholders |
| `fallback_rules` | JSON when field empty |

**Meta Manager** UI: grid edit, bulk apply template, AI suggest (via AI module).

---

# URL Management

**Table:** `seo_url_rules`

| Rule Type | Example |
|-----------|---------|
| `slug_format` | `{category}/{product-slug}` |
| `trailing_slash` | enforce / remove |
| `lowercase` | force lowercase slugs |
| `locale_prefix` | `/en/`, `/bn/` |
| `filter_canonical` | Canonical for faceted URLs |

**Table:** `seo_urls` — registry of all public URLs

| Field | Notes |
|-------|-------|
| `url_path` | `/electronics/iphone-16` |
| `entity_type`, `entity_id` | Polymorphic source |
| `locale` | |
| `is_indexable` | Boolean |
| `last_crawled_at` | Audit timestamp |

Conflict detection: duplicate slug across entities → audit issue.

---

# Redirects

**Table:** `seo_redirects`

| Field | Notes |
|-------|-------|
| `from_path` | Source URL (unique per company) |
| `to_path` | Destination |
| `redirect_type` | `301`, `302`, `410` |
| `is_regex` | Pattern match |
| `hit_count` | Usage analytics |
| `expires_at` | Optional temporary redirect |

## Redirect Triggers

| Trigger | Action |
|---------|--------|
| Product slug change | Auto-create 301 (configurable) |
| Category merge | Bulk redirect wizard |
| Manual import | CSV upload |
| 404 spike | Suggest redirect from audit |

Storefront middleware resolves redirects before route dispatch — sub-millisecond Redis cache.

---

# Schema (Structured Data)

**Table:** `seo_schema_templates`

| `schema_type` | Page Type |
|---------------|-----------|
| `Product` | PDP |
| `Offer` | Nested in Product |
| `AggregateRating` | Products with reviews |
| `BreadcrumbList` | All listing pages |
| `Organization` | Homepage |
| `WebSite` | Sitelinks search box |
| `FAQPage` | FAQ content |
| `Article` | Blog posts |

**Table:** `seo_schema_overrides` — per-entity JSON-LD override.

Schema Manager: visual editor + JSON preview + Google Rich Results validation link.

---

# Sitemaps

**Tables:** `seo_sitemaps`, `seo_sitemap_entries`

| Sitemap | URL | Content |
|---------|-----|---------|
| Index | `/sitemap.xml` | Points to sub-sitemaps |
| Products | `/sitemap-products.xml` | Published products |
| Categories | `/sitemap-categories.xml` | Active categories |
| Pages | `/sitemap-pages.xml` | Builder CMS pages |
| Images | `/sitemap-images.xml` | Product images (optional) |

Generation: incremental nightly + on `catalog.product.published` event.  
Chunked files max 50,000 URLs each per Google spec.

---

# Keywords & Internal Linking

## Keyword Tracking

**Tables:** `seo_keywords`, `seo_keyword_rankings`

| Field | Notes |
|-------|-------|
| `keyword` | Target phrase |
| `target_url` | Landing URL |
| `search_engine` | google, bing |
| `rank_position` | Historical snapshots |
| `recorded_at` | Date |

External rank API integration (v2) or manual entry v1.

## Internal Linking

**Table:** `seo_internal_link_suggestions`

| Field | Notes |
|-------|-------|
| `source_entity` | Product, category, page |
| `target_entity` | Suggested link target |
| `anchor_text` | Suggested text |
| `relevance_score` | AI or rule-based |
| `status` | `suggested`, `applied`, `dismissed` |

**Internal Linking** UI: hub page builder, orphan page report.

---

# SEO Audit

**Tables:** `seo_audit_runs`, `seo_audit_issues`

| Issue Type | Severity |
|------------|----------|
| `missing_meta_title` | high |
| `missing_meta_description` | medium |
| `duplicate_title` | high |
| `duplicate_description` | medium |
| `thin_content` | medium |
| `broken_link` | high |
| `redirect_chain` | medium |
| `missing_alt_text` | medium |
| `missing_schema` | low |
| `slow_page` | medium |

Audit jobs crawl `seo_urls` registry; results feed **SEO Dashboard** health score (0–100).

---

# Robots Manager

**Table:** `seo_robots_rules`

- Dynamic `robots.txt` generation
- `noindex` flags on archived/hidden catalog entities
- `Disallow` paths for admin, cart, checkout
- `noindex` on filtered facet URLs (configurable)

---

# System Events

| Event | Payload | Subscribers |
|-------|---------|-------------|
| `seo.redirect.created` | `from_path`, `to_path` | CDN cache purge |
| `seo.sitemap.generated` | `sitemap_id`, `url_count` | Search console ping (v2) |
| `seo.audit.completed` | `run_id`, `issue_count` | Notifications |
| `seo.url.registered` | `url_path`, `entity` | Sitemap indexer |
| `catalog.product.published` | `product_id` | Sitemap, URL registry |
| `catalog.slug.changed` | `old_slug`, `new_slug` | Auto-redirect |

---

# Database Architecture

## Table List

| Table | Purpose |
|-------|---------|
| `seo_urls` | Public URL registry |
| `seo_meta_templates` | Global meta patterns |
| `seo_redirects` | Redirect rules |
| `seo_url_rules` | Slug/canonical policies |
| `seo_schema_templates` | JSON-LD templates |
| `seo_schema_overrides` | Per-entity schema |
| `seo_sitemaps` | Sitemap definitions |
| `seo_sitemap_entries` | URL entries per sitemap |
| `seo_robots_rules` | robots.txt rules |
| `seo_keywords` | Tracked keywords |
| `seo_keyword_rankings` | Rank history |
| `seo_internal_link_suggestions` | Link recommendations |
| `seo_audit_runs` | Audit job header |
| `seo_audit_issues` | Issue rows |
| `seo_page_speed_snapshots` | CWV metrics (v2) |

## Indexes

| Table | Index | Reason |
|-------|-------|--------|
| `seo_redirects` | `(company_id, from_path)` UNIQUE | Fast lookup |
| `seo_urls` | `(company_id, url_path)` UNIQUE | Registry |
| `seo_audit_issues` | `(run_id, severity)` | Dashboard |
| `seo_sitemap_entries` | `(sitemap_id, url_path)` | Generation |

---

# API Architecture

Base: `/api/v1/seo/`  
Auth: Bearer + `X-Company-Id`

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/dashboard` | `seo.read` |
| GET/PATCH | `/meta/bulk` | `seo.meta.manage` |
| GET/POST | `/redirects` | `seo.redirect.*` |
| GET/POST | `/urls` | `seo.url.manage` |
| GET/PATCH | `/schema-templates` | `seo.schema.manage` |
| POST | `/sitemaps/generate` | `seo.sitemap.manage` |
| GET/PATCH | `/robots` | `seo.robots.manage` |
| GET/POST | `/keywords` | `seo.keyword.*` |
| GET | `/internal-links/suggestions` | `seo.linking.manage` |
| POST | `/audits/run` | `seo.audit.run` |
| GET | `/audits/{uuid}/issues` | `seo.read` |

## Storefront (public)

`GET /sitemap.xml` · `/robots.txt` · redirect resolution at edge

---

# Permissions

| Key | Description |
|-----|-------------|
| `seo.access` | Module access |
| `seo.read` | View dashboard & reports |
| `seo.meta.manage` | Edit meta data |
| `seo.redirect.*` | Redirect CRUD |
| `seo.url.manage` | URL rules |
| `seo.schema.manage` | Structured data |
| `seo.sitemap.manage` | Sitemap generation |
| `seo.robots.manage` | robots.txt |
| `seo.keyword.*` | Keyword tracking |
| `seo.linking.manage` | Internal links |
| `seo.audit.run` | Run audits |

---

# Dependencies

- **Core:** [companies](../../../02-core-platform/entities/companies.md), [media-library](../../../02-core-platform/entities/media-library.md) (og:image)
- **Ecommerce:** [catalog/ARCHITECTURE.md](../catalog/ARCHITECTURE.md), [builder/ARCHITECTURE.md](../builder/ARCHITECTURE.md), [analytics/ARCHITECTURE.md](../analytics/ARCHITECTURE.md)
- **AI:** Meta generator, audit suggestions (`Menus/AI/AI SEO Generator.md`)
- **Services:** Queue Workers, CDN (sitemap caching)

---

## Document Index

| Screen | Menu Doc |
|--------|----------|
| SEO Dashboard | [Menus/SEO/SEO Dashboard.md](../Menus/SEO/SEO Dashboard.md) |
| Redirect Manager | [Menus/SEO/Redirect Manager.md](../Menus/SEO/Redirect Manager.md) |
| Full menu | [MENU_STRUCTURE.md](../MENU_STRUCTURE.md) |

---

**Module:** SEO  
**Last Updated:** 2026-06-12  
**Status:** Draft — requires approval before implementation
