# Media ID References — Prototype Architecture

> **Status:** Implemented (web prototype)  
> **App path:** `apps/web`  
> **Related:** [Media Library UI](./MediaLibrary.md) · [Ecommerce Media Architecture](../../../03-business-modules/ecommerce/media/ARCHITECTURE.md)

---

## Goal

1. **Default metadata** — `title` and `alt` are derived from the file name and start **identical**.
2. **Admin override** — title and alt can be edited live in Attachment details.
3. **Rename propagation** — when a media file is renamed in the library, every place that references it by **media ID** receives the latest url / alt / title automatically.

---

## Core principle: store ID, resolve at read time

Entities do **not** duplicate media metadata long-term. They store a stable `mediaId` and resolve display fields from the central media store.

```
┌─────────────────────┐
│  useMediaStore      │  ← single source of truth (persisted)
│  items[id]          │
└──────────┬──────────┘
           │ resolveMediaUrl(mediaId)
           ▼
┌─────────────────────┐     ┌─────────────────────┐
│ Category.iconMediaId│     │ Brand.logoMediaId   │
│ Product (future)    │     │ HTML data-media-id  │
└─────────────────────┘     └─────────────────────┘
```

### Why this scales

| Approach | Rename 1 file used in 500 products |
|----------|-------------------------------------|
| Copy URL into each row | 500 DB updates |
| **Store media ID** | **1 media row update** — UI resolves on render |

Production backend: same pattern with `media_id` FK or polymorphic `attachment_id` on Core `media` table.

---

## File map (prototype)

| File | Role |
|------|------|
| `src/lib/mock-data/media-library.ts` | Types, seed data, `deriveLabelsFromFileName`, `applyMediaItemPatch` |
| `src/lib/store/media-store.ts` | Persisted Zustand store — all library CRUD |
| `src/lib/media/resolve-media.ts` | `getMediaItem`, `resolveMediaUrl`, `useMediaItem` |
| `src/lib/media/media-html-sync.ts` | Refresh `<img data-media-id>` in HTML strings |
| `src/lib/media/media-propagate.ts` | Push media changes into category/brand stores |
| `src/components/media/media-library-modal.tsx` | Uses shared store (not local state) |
| `src/app/(admin)/media/page.tsx` | Uses shared store |

---

## Default title & alt from file name

```typescript
deriveLabelsFromFileName("banner-summer-2026.jpg")
// → { title: "banner summer 2026", alt: "banner summer 2026" }
```

Applied on:

- Seed items (`titleLinkedToName: true`, `altLinkedToName: true`)
- File upload (`createUploadedMediaItem`)
- URL / AI import (`createImportedMediaItem`)

### Linked rename behaviour

| Field edited | Effect |
|--------------|--------|
| **File name** | If `titleLinkedToName` → title updates. If `altLinkedToName` → alt updates. |
| **Title** (manual) | Sets `titleLinkedToName = false` — future renames won't change title |
| **Alt** (manual) | Sets `altLinkedToName = false` |

Admin can still change title and alt independently after unlinking.

---

## Entity reference fields

### Category (`categories.ts`)

```typescript
iconMediaId?: string;
bannerMediaId?: string;
iconUrl?: string;    // denormalized cache / legacy fallback
bannerUrl?: string;
```

### Brand (`brands.ts`)

```typescript
logoMediaId?: string;
bannerMediaId?: string;
logoUrl?: string;
bannerUrl?: string;
```

Forms save **both** `*MediaId` and `*Url` on pick (cache for SSR/export). Display components prefer ID resolution:

```typescript
resolveMediaUrl(category.iconMediaId, category.iconUrl)
```

---

## Rename propagation flow

When `patchMediaItem(id, { name, title, alt })` runs:

1. **Media store** — `applyMediaItemPatch` updates the canonical item.
2. **`propagateMediaUpdate(id)`** runs:
   - Categories/brands with matching `iconMediaId` / `bannerMediaId` / `logoMediaId` → patch cached `*Url`.
   - HTML `description` fields containing `data-media-id="{id}"` → refresh `src` and `alt` via `refreshHtmlMediaRefs`.
3. **UI** — components subscribed to `useMediaStore` re-render (grids call `refreshCells` on icon/logo columns).

### Rich text (WordPress-style editor)

Inserted markup:

```html
<img data-media-id="media_12" src="..." alt="..." class="alignnone size-medium" />
```

Rename in Media Library updates embedded images in category/brand descriptions automatically.

---

## Usage checklist for new features

1. Add `somethingMediaId?: string` on the entity type.
2. Save `mediaId` from `MediaField` / `MediaLibraryModal` on select.
3. Render with `resolveMediaUrl(mediaId, fallbackUrl)` and `resolveMediaAlt`.
4. For inline HTML images, always include `data-media-id`.
5. Never fork a second copy of `mediaLibraryItems` — use `useMediaStore`.

---

## Future (production backend)

| Prototype | Production |
|-----------|------------|
| Zustand `useMediaStore` | Core `media` table + API |
| `propagateMediaUpdate` scan | `media_usages` join table or event bus |
| `*Url` cache on entity | Optional CDN URL cache column; invalidate on media update |
| `localPath` mock | S3 / local storage path keyed by `media.id` |

---

## Manual test

1. Open **Categories** → edit → pick icon from Media Library → save.
2. Open **Media** → select same file → rename file name → confirm title/alt follow (if still linked).
3. Category grid icon and storefront subcategory chip update without re-saving category.
4. Insert image in category description via editor → rename media → description HTML `src`/`alt` update.

---

## Usage counting (prototype)

`src/lib/media/media-usage.ts` scans live references:

| Source | Fields counted |
|--------|----------------|
| Categories | `iconMediaId`, `bannerMediaId`, `description` (`data-media-id`) |
| Brands | `logoMediaId`, `bannerMediaId`, `description` (`data-media-id`) |

Legacy URL-only fields (`iconUrl`, `logoUrl`, etc.) are matched to library items by URL when no `mediaId` is stored.

**UI:**

- Grid badge top-right: `3×` (used) or `0` (unused)
- Attachment details: **Used on site** count + **Used in** list
- Filter tabs: **All** · **Used** · **Unused**

Count updates automatically when categories/brands change (Zustand subscription).
