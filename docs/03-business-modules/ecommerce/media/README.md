# Media Module

> **Status:** Draft · **Version:** 1.0

Commerce media operations layer — admin UI over Core media library, CDN, optimization, and usage tracking.

| Document | Description |
|----------|-------------|
| [**ARCHITECTURE.md**](./ARCHITECTURE.md) | Complete Media architecture |
| [core/entities/media-library.md](../../../02-core-platform/entities/media-library.md) | Core media schema |
| [catalog/ARCHITECTURE.md](../catalog/ARCHITECTURE.md) | Product image attachments |

## UI Location

Admin menus under `Menus/Media/`: Media Library, Images, Videos, Documents, Folders, CDN Manager

## Storage

Core `media_*` tables — Ecommerce does not duplicate file storage
