# AgainERP — Media Module Architecture

> **Status:** Draft  
> **Module:** Media (Ecommerce admin · Core-backed)  
> **Version:** 1.0  
> **Document Type:** Enterprise Architecture  
> **Governance:** [GOVERNANCE.md](../../../00-foundation/GOVERNANCE.md) · **Standards:** [DEVELOPMENT_STANDARDS.md](../../../00-foundation/standards/DEVELOPMENT_STANDARDS.md)

**No application code.** Source of truth for Ecommerce Media admin design. Storage and schema owned by **Core** — this module provides commerce-specific UI, CDN mapping, optimization, and usage tracking.

**Related:** [core/entities/media-library.md](../../../02-core-platform/entities/media-library.md) · [core/entities/attachments.md](../../../02-core-platform/entities/attachments.md) · [catalog/ARCHITECTURE.md](../catalog/ARCHITECTURE.md)  
**UI menus:** `Menus/Media/`

---

## Executive Summary

The **Media** module is AgainERP's **commerce media operations layer**. It administers the Core media library — folders, images, videos, documents — plus Ecommerce-specific CDN mapping, image optimization, watermarks, and usage tracking across Catalog, Builder, and Marketing.

| Connects To | Integration |
|-------------|-------------|
| **Core Media** | `media`, `media_folders` — single storage truth |
| **Attachments** | Polymorphic links to products, pages, campaigns |
| **Catalog** | Product galleries, brand logos |
| **Builder** | Page assets, theme files |
| **CDN** | Public URL mapping, cache invalidation |

### Scale Targets

| Dimension | Target |
|-----------|--------|
| Media files | 5,000,000+ per tenant |
| Upload throughput | 100 concurrent uploads |
| Image variants | WebP/AVIF auto-generation |
| CDN cache hit ratio | > 95% storefront |

**Table namespace:** Core `media_*` (not duplicated in Ecommerce)

---

# Module Mission

## Why Media Exists

Product images, documents, and marketing assets must be centralized, optimized, and traceable. Without a unified media layer:

- Duplicate uploads inflate storage
- Broken CDN URLs break storefronts
- Orphaned files accumulate after product deletes
- Usage across modules is invisible

Media admin extends Core with **commerce workflows** — bulk upload, folder taxonomy, optimizer queues, and cross-module usage reports.

## Architecture Principle

```
Core owns: media storage, metadata, versions, permissions
Ecommerce Media admin owns: folders UI, CDN config, optimizer, watermark, usage tracker
Consumers attach via: attachments (polymorphic)
```

Never store file paths on `catalog_products` or `builder_pages`.

---

# Module Structure

```
Media
├── Media Library             ← Browse, upload, search (Core media)
├── Images                    ← Image-specific filters & bulk ops
├── Videos                    ← Uploaded + external (YouTube/Vimeo)
├── Documents                 ← PDF, spec sheets
├── Folders                   ← Hierarchical organization
├── CDN Manager               ← CDN base URL, path rules, purge
├── Image Optimizer           ← Compression, format conversion queue
├── Watermark Manager         ← Brand watermark rules
└── Media Usage Tracker       ← Where each file is referenced
```

## Section Purposes

| Section | Purpose | Primary Users |
|---------|---------|---------------|
| **Media Library** | Universal asset browser | All admin roles |
| **Images** | Gallery-oriented workflows | Product Manager, Content |
| **Videos** | Video assets & embeds | Content, Marketing |
| **Documents** | Downloadable files | Product Manager |
| **Folders** | Taxonomy, permissions per folder | Admin |
| **CDN Manager** | Production URL mapping | Admin, DevOps |
| **Image Optimizer** | Queue status, reprocess | Admin |
| **Watermark Manager** | Apply watermark on upload | Brand, Admin |
| **Media Usage Tracker** | Reference audit, safe delete | Admin |

Screen docs: `Menus/Media/`

---

# Core Media Model

Uses Core tables — see [media-library.md](../../../02-core-platform/entities/media-library.md).

## Key Tables (Core)

| Table | Purpose |
|-------|---------|
| `media` | File record: name, mime, size, disk, path, `cdn_url` |
| `media_folders` | Folder tree (`parent_id`, `path`) |
| `media_versions` | Derived variants (thumb, medium, large, webp) |
| `attachments` | Polymorphic link: `attachable_type`, `attachable_id`, `collection` |

## Media Record Fields

| Field | Notes |
|-------|-------|
| `uuid` | Public API identifier |
| `filename` | Original filename |
| `mime_type` | image/jpeg, video/mp4, application/pdf |
| `disk` | local, s3, gcs |
| `path` | Storage path |
| `cdn_url` | Resolved public URL |
| `width`, `height` | Images/video metadata |
| `alt_text` | Accessibility, SEO |
| `parent_media_id` | Version chain root |
| `metadata` | JSON: focal point, duration, embed URL |

## Versioning

```
media (original)
└── media_versions: thumbnail, medium, large, webp, avif
```

Re-optimize triggers new version rows; `parent_media_id` preserves lineage. Storefront serves responsive `srcset` from versions.

---

# Folder Architecture

**Table:** `media_folders` (Core)

| Feature | Design |
|---------|--------|
| Tree structure | `parent_id`, materialized `path` |
| Company scope | `company_id` on all folders |
| Default folders | Products, Brands, Marketing, Builder, Documents |
| Permissions | `media.folder.*` per folder (optional v2) |
| Bulk move | Drag-drop in admin UI |

---

# CDN Mapping

**Table:** `media_cdn_configs` (Ecommerce extension or Core settings)

| Field | Notes |
|-------|-------|
| `provider` | cloudflare, cloudfront, bunny, custom |
| `base_url` | `https://cdn.example.com` |
| `path_prefix` | `/media/{company_id}/` |
| `signed_urls` | Optional TTL for private docs |
| `cache_ttl` | Default CDN cache headers |

## CDN Workflow

```
Upload → Store on disk/S3 → Generate versions → Map cdn_url → Purge on replace/delete
```

**CDN Manager** UI: test connection, purge cache by path/tag, preview URL resolution.

---

# Image Optimizer

Async queue jobs — not blocking upload response.

| Step | Action |
|------|--------|
| 1 | Validate mime, max dimensions |
| 2 | Strip EXIF (privacy) |
| 3 | Generate responsive sizes |
| 4 | Convert to WebP/AVIF |
| 5 | Apply watermark if rule matches |
| 6 | Update `media_versions`, set `cdn_url` |

**Table:** `media_optimization_jobs` — `media_id`, `status`, `error_message`

Configurable quality presets per company in `ecommerce_settings`.

---

# Watermark Manager

**Table:** `media_watermark_rules`

| Field | Notes |
|-------|-------|
| `name` | Rule label |
| `watermark_media_id` | FK → media (PNG overlay) |
| `position` | center, bottom-right, tile |
| `opacity` | 0–100 |
| `apply_to_collections` | JSON: `gallery`, `marketing` |
| `min_width` | Skip small thumbs |

Applied during optimizer pipeline; does not mutate original (version only).

---

# Usage Tracking

**Table:** `media_usage_refs` (materialized from `attachments` + scan jobs)

| Field | Notes |
|-------|-------|
| `media_id` | FK |
| `reference_type` | CatalogProduct, BuilderPage, MarketingCampaign, … |
| `reference_id` | FK |
| `collection` | gallery, thumbnail, hero, … |
| `last_seen_at` | Scan timestamp |

Enables safe-delete warnings and orphan cleanup cron `PurgeOrphanMedia`.

---

# Consumer Integration

| Consumer | Attachment Collection | Notes |
|----------|----------------------|-------|
| Catalog products | `gallery`, `thumbnail`, `videos`, `documents` | Ordered by `sort_order` |
| Catalog variants | `gallery` | Override parent |
| Brands | `logo` | Single primary |
| Builder pages | `hero`, `background`, `inline` | |
| Marketing campaigns | `banner`, `email_asset` | |
| Orders | `invoice_pdf` | Generated docs |

All consumers use Core `attachments` API — Media module does not duplicate link tables.

---

# System Events

| Event | Payload | Subscribers |
|-------|---------|-------------|
| `media.uploaded` | `media_id`, `mime_type` | Optimizer queue |
| `media.optimized` | `media_id`, `versions` | CDN purge, Catalog cache |
| `media.deleted` | `media_id` | Attachment cleanup, CDN purge |
| `media.cdn.purged` | `paths[]` | Monitoring |
| `media.usage.updated` | `media_id`, `ref_count` | Usage tracker UI |

---

# API Architecture

Base: `/api/v1/media/` (Core platform API)  
Ecommerce admin may add `/api/v1/ecommerce/media/` wrappers for CDN/optimizer config.

## Media CRUD

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/media` | `media.read` |
| POST | `/media` | `media.upload` |
| GET | `/media/{uuid}` | `media.read` |
| PATCH | `/media/{uuid}` | `media.write` |
| DELETE | `/media/{uuid}` | `media.delete` |
| POST | `/media/bulk-upload` | `media.upload` |
| GET | `/media/{uuid}/usage` | `media.read` |

## Folders & CDN

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET/POST | `/folders` | `media.folder.*` |
| GET/PATCH | `/cdn-config` | `media.cdn.manage` |
| POST | `/cdn/purge` | `media.cdn.manage` |
| POST | `/media/{uuid}/reoptimize` | `media.optimize` |

## Attachments (Core)

| Method | Endpoint | Permission |
|--------|----------|------------|
| POST | `/attachments` | `media.attach` |
| DELETE | `/attachments/{uuid}` | `media.attach` |
| PATCH | `/attachments/{uuid}/reorder` | `media.attach` |

Storefront: read-only signed URLs via `/api/v1/storefront/media/{uuid}`.

---

# Permissions

| Key | Description |
|-----|-------------|
| `media.access` | Module access |
| `media.read` | Browse library |
| `media.upload` | Upload files |
| `media.write` | Edit metadata |
| `media.delete` | Delete (with usage check) |
| `media.folder.*` | Folder management |
| `media.cdn.manage` | CDN config & purge |
| `media.optimize` | Trigger re-optimization |
| `media.watermark.manage` | Watermark rules |
| `media.attach` | Link to entities |

---

# Performance Requirements

| Requirement | Strategy |
|-------------|----------|
| Large libraries | Cursor pagination, folder-scoped lists |
| Upload | Direct-to-S3 presigned URLs |
| Thumbnails | Lazy load in grid; CDN edge cache |
| Bulk delete | Queue job with usage validation |

| Target | Value |
|--------|-------|
| Library list API p95 | < 400ms |
| Upload acknowledge | < 2s (async optimize) |
| CDN URL resolve | < 10ms (cached) |

---

# Dependencies

- **Core:** [media-library.md](../../../02-core-platform/entities/media-library.md), [attachments.md](../../../02-core-platform/entities/attachments.md), [companies](../../../02-core-platform/entities/companies.md), [users](../../../02-core-platform/entities/users.md)
- **Ecommerce:** [catalog/ARCHITECTURE.md](../catalog/ARCHITECTURE.md), [builder/ARCHITECTURE.md](../builder/ARCHITECTURE.md), [marketing/ARCHITECTURE.md](../marketing/ARCHITECTURE.md)
- **Services:** Queue Workers, CDN providers, Object storage (S3-compatible)

---

## Document Index

| Screen | Menu Doc |
|--------|----------|
| Media Library | [Menus/Media/Media Library.md](../Menus/Media/Media Library.md) |
| CDN Manager | [Menus/Media/CDN Manager.md](../Menus/Media/CDN Manager.md) |
| Full menu | [MENU_STRUCTURE.md](../MENU_STRUCTURE.md) |

---

**Module:** Media  
**Last Updated:** 2026-06-12  
**Status:** Draft — requires approval before implementation
