# Builder UI Architecture

> **Status:** Draft  
> **Parent:** [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md)  
> **Backend:** [modules/ecommerce/builder/ARCHITECTURE.md](../../03-business-modules/ecommerce/builder/ARCHITECTURE.md)

---

## Purpose
Global UI standard: builder ui.

## When To Read
Read only if working on UI patterns related to builder ui.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Purpose

**Shopify-inspired** visual page builder for storefront and landing pages.

---

## Hierarchy

```
Page
 └── Section (full-width container)
      └── Row (horizontal group)
           └── Column (width fraction)
                └── Widget (functional block)
                     └── Block (content atom)
```

---

## Builder Canvas

```
┌──────────┬────────────────────────────────────────┬──────────┐
│ WIDGET   │  LIVE PREVIEW / CANVAS                 │ SETTINGS │
│ LIBRARY  │                                        │ PANEL    │
│          │  [ Section: Hero ]                     │          │
│ Sections │    [ Row ]                             │ Selected │
│ Rows     │      [ Column 6/12 ] [ Column 6/12 ]   │ widget   │
│ Columns  │                                        │ props    │
│ Widgets  │  [ Section: Products ]                 │          │
│ Blocks   │                                        │          │
└──────────┴────────────────────────────────────────┴──────────┘
```

---

## Interactions

| Action | Method |
|--------|--------|
| Add section | `+` between sections or library drag |
| Reorder | Drag handle on section/row |
| Resize column | Drag column divider |
| Edit widget | Click → settings panel |
| Delete | Select → Delete key or trash icon |
| Undo/Redo | `Ctrl+Z` / `Ctrl+Shift+Z` |

---

## Widget Library

| Category | Widgets |
|----------|---------|
| Layout | Section, Row, Column, Spacer, Divider |
| Content | Heading, Text, Image, Video, Button |
| Commerce | Product Grid, Product Carousel, Collection |
| Forms | Contact Form, Newsletter |
| Navigation | Menu, Breadcrumb |
| SEO | Meta block (settings, not visual) |

---

## Templates

| Type | Description |
|------|-------------|
| **Page templates** | Full page starting points |
| **Section templates** | Reusable hero, FAQ, footer |
| **Global components** | Shared header/footer synced across pages |

Save as template → appears in library for reuse.

---

## Theme Variables

Builder widgets bind to design tokens:

- `--color-primary`, `--font-family`, `--space-*`
- Company branding overrides from [theme-system.md](./theme-system.md)
- Preview modes: Desktop · Tablet · Mobile

---

## Draft & Publish

| State | Behavior |
|-------|----------|
| Draft | Preview URL with token |
| Published | Live on storefront |
| Scheduled | Publish at datetime |

---

## Mobile Builder

Simplified: edit widget content in form view. Full drag-drop on tablet+ only.
