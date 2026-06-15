# Media Library

> **Status:** Draft · **Owner:** Core · **Table:** `media`

## Purpose

Central file and image storage. All uploads — product images, avatars, documents, invoices — go through the Media Library with versioning and storage abstraction.

## Used By

Ecommerce (product images), CRM, Sales, HR (documents), Companies (logos), Users (avatars), Attachments.

## Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `company_id` | FK | Company scope |
| `disk` | VARCHAR | Storage driver (`local`, `s3`) |
| `path` | VARCHAR | Storage path |
| `filename` | VARCHAR | Original filename |
| `mime_type` | VARCHAR | MIME type |
| `size` | BIGINT | File size in bytes |
| `hash` | VARCHAR | File hash (dedup) |
| `width` | INT | Image width (if image) |
| `height` | INT | Image height (if image) |
| `alt_text` | VARCHAR | Accessibility / SEO alt text |
| `version` | INT | Version number |
| `parent_media_id` | FK | Previous version link |
| `uploaded_by` | FK → users | Uploader |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/core/media` | List / search media |
| POST | `/api/v1/core/media/upload` | Upload file |
| GET | `/api/v1/core/media/{uuid}` | Get metadata |
| GET | `/api/v1/core/media/{uuid}/download` | Download file |
| GET | `/api/v1/core/media/{uuid}/preview` | Preview (images/PDF) |
| DELETE | `/api/v1/core/media/{uuid}` | Soft delete |

## Storage Drivers

| Driver | Use Case |
|--------|----------|
| `local` | Development |
| `s3` | Production |
| Custom | Extensible adapter |

## Ecommerce Usage

Product images are `media` records linked via `attachments` to `EcommerceProduct`.

```
Product → attachments → media
```

Never store `/uploads/product.jpg` paths in `ecommerce_products`.

## Permissions

| Key | Description |
|-----|-------------|
| `core.media.read` | View / download |
| `core.media.write` | Upload |
| `core.media.delete` | Delete |

## Standards

- Image optimization on upload (WebP variants)
- Lazy loading URLs with CDN support
- See [DEVELOPMENT_STANDARDS.md §12](../../DEVELOPMENT_STANDARDS.md#12-file-management-standards)
