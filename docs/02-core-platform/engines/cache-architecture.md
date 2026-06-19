# Cache Architecture

> **Status:** Draft  
> **Owner:** Core Platform  
> **Parent:** [core/ARCHITECTURE.md](../ARCHITECTURE.md)

---

## Purpose
Core engine specification: cache architecture.

## When To Read
Read only when working on the cache architecture engine or its consumers.

## Related Files
- [Core hub](../ARCHITECTURE.md)
- [Engines index](README.md)

## Read Next
- [Core hub](../ARCHITECTURE.md)

---

## Purpose

Redis-backed caching for sessions, permissions, settings, category trees, dashboard widgets, and HTTP cache headers for public APIs.

## Layers

| Layer | Technology | TTL | Use |
|-------|------------|-----|-----|
| Session | Redis | 24h | Auth sessions |
| Permission | Redis | 15m | User ACL snapshot |
| Application | Redis | 5–60m | Settings, category tree |
| Query result | Redis | 1–5m | Dashboard widgets |
| HTTP | Cache-Control | CDN | Storefront product API |
| CDN | CloudFront/CF | Long | Media assets |

## Key Naming

```
{company_id}:{module}:{entity}:{id}
againerp:cmp_123:catalog:category_tree
againerp:cmp_123:core:permissions:user_456
```

## Tag Invalidation

```
CacheService.tag('catalog:products').flush()
→ On catalog.product.updated event
```

## Cached Entities

| Entity | Invalidation Trigger |
|--------|---------------------|
| User permissions | Role/permission change |
| Company settings | settings.updated |
| Category tree | catalog.category.* |
| Tax rules | core.tax.* |
| Exchange rates | core.currency.rate_updated |
| Dashboard widgets | analytics rollup OR manual refresh |

## API

Internal: `CacheService.get/set/forget/remember`  
Admin: `Menus/System/Cache Manager.md` — flush by tag.

## Rules

| Rule | Description |
|------|-------------|
| Never cache writes | Cache is read-only layer |
| Company isolation | Keys always include `company_id` |
| Graceful degrade | Cache miss → DB query |
| No sensitive data in CDN | PII never in public cache |

## Storefront

Product list API: `Cache-Control: public, max-age=60` with ETag.  
Invalidate on `inventory.stock.updated` for affected SKUs.
