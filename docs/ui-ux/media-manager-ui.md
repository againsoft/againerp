# Media Manager UI

> **Status:** Draft  
> **Parent:** [UX_SMART_INTERACTION_STANDARDS.md](./UX_SMART_INTERACTION_STANDARDS.md) §12  
> **Backend:** [modules/ecommerce/media/ARCHITECTURE.md](../modules/ecommerce/media/ARCHITECTURE.md)

---

## Purpose

**WordPress Media Library** inspired manager — standalone page + **popup selector** embeddable anywhere.

---

## Standalone Page

Path: `Media → Media Library`

| Feature | Spec |
|---------|------|
| Folders | Tree sidebar |
| Search | Instant filter by name, tag |
| Filters | Type (image/video/doc), date, size |
| Tags | Multi-tag filter |
| Bulk upload | Drag-drop zone, multi-file |
| Bulk actions | Move, tag, delete, optimize |
| Grid / list | Toggle view |
| Detail panel | Metadata, URL, usage, versions |
| CDN | CDN URL display + purge |
| Version history | Revert to previous version |
| Optimization | Auto WebP/AVIF on upload |

---

## Media Popup Selector

Opened from any "Choose image" field — **no page navigation**.

```
┌─────────────────────────────────────────────────────────┐
│ Select Media                                    [×]     │
├──────────┬──────────────────────────────────────────────┤
│ Folders  │  [Upload] [Search…]                          │
│ All      │  ┌────┐ ┌────┐ ┌────┐ ┌────┐                │
│ Products │  │img │ │img │ │vid │ │pdf │                │
│ Banners  │  └────┘ └────┘ └────┘ └────┘                │
│          │                                              │
├──────────┴──────────────────────────────────────────────┤
│ 2 selected              [Upload new] [Insert] [Cancel]  │
└─────────────────────────────────────────────────────────┘
```

### Flow

1. Click "Add image" on product form
2. Popup opens over form
3. Select existing OR upload new (drag to popup)
4. Click Insert
5. Popup closes — image appears in gallery
6. **No reload**

### Modes

| Mode | Selection |
|------|-----------|
| Single | One image — radio |
| Multiple | Gallery — checkbox |
| Replace | Single — replaces current |

---

## Media Reuse

Same `media_id` referenced across products, pages, emails. Usage tracker shows "Used in 3 products" — warn before delete.

---

## Upload

| Rule | Detail |
|------|--------|
| Max size | Configurable per company |
| Types | Whitelist by MIME |
| Progress | Per-file progress bar |
| Error | Inline retry per file |
| Auto-optimize | Background job after upload |

---

## Mobile

Full-screen selector. Camera capture option. Simplified metadata panel.
