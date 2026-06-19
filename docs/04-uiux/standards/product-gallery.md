# Product Gallery Standards

> **Status:** Draft  
> **Parent:** [UX_SMART_INTERACTION_STANDARDS.md](./UX_SMART_INTERACTION_STANDARDS.md) §4–6  
> **Backend:** [modules/ecommerce/catalog/ARCHITECTURE.md](../../03-business-modules/ecommerce/catalog/ARCHITECTURE.md)

---

## Purpose
Global UI standard: product gallery.

## When To Read
Read only if working on UI patterns related to product gallery.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Purpose

**Alibaba + Amazon inspired** product media gallery for admin and storefront. Mixed media, variant-driven updates, real-time sync.

---

## Supported Media Types

| Type | Format | Admin | Storefront |
|------|--------|-------|------------|
| Images | JPG, PNG, WebP, AVIF | ✓ | ✓ |
| Videos | MP4, WebM | ✓ | ✓ |
| 360° | Image sequence / embed | ✓ | ✓ |
| PDF catalog | PDF attachment | ✓ | Download |
| Attachments | Spec sheets | ✓ | Optional |

---

## Mixed Gallery

Single gallery displays **video + images together**.

```
┌─────────────────────────────────────────┐
│  [▶ Main Video    ]  │ thumb │ thumb  │
│                        │ thumb │ thumb  │
└─────────────────────────────────────────┘
```

| Rule | Detail |
|------|--------|
| Primary media | Star icon — one per variant or product |
| Sort order | Drag & drop — persists `sort_order` |
| Gallery groups | "Studio", "Lifestyle", "Packaging" tabs |
| Video poster | First frame or custom poster image |

---

## Variant Driven Gallery

When user selects variant (color, size, etc.):

| Field | Updates |
|-------|---------|
| Gallery | Variant-specific media set |
| Price | Variant price + currency |
| Stock | Per-warehouse availability |
| SKU | Variant SKU |
| Delivery estimate | Shipping zone calculation |

**Latency target:** < 150ms perceived — optimistic UI + API confirm.

### Example

```
Color: [ Black ] [ White ] [ Red ]

Black selected →
  Gallery: black-1.jpg, black-2.jpg, black-video.mp4
  Price: ৳899
  Stock: 42 units
  SKU: TSH-BLK-M
  Delivery: 2–3 business days
```

---

## Real-Time Product Updates

Attribute changes trigger async patch — **no page reload**:

| Attribute | Updates |
|-----------|---------|
| Variant / Color / Storage / RAM | Gallery, price, stock, SKU |
| Warranty | Specifications tab |
| Delivery area | Availability + estimate |

### API Pattern

```
PATCH /api/v1/catalog/variants/{id}/preview-context
→ { gallery, price, stock, sku, delivery, promotions, specs }
```

Storefront and admin share same preview endpoint.

---

## Admin Gallery Editor

- Drag reorder thumbnails
- Set primary (star)
- Upload drop zone
- Open [media-manager-ui.md](./media-manager-ui.md) popup
- Assign media to variant or product level
- Bulk assign to multiple variants

---

## Storefront Gallery

- Swipe on mobile
- Zoom on tap (pinch on mobile)
- Video inline play
- 360° viewer modal
- Lazy load off-screen thumbnails
