# Categories

> **Status:** Ready (Prototype)  
> **Route:** `/catalog/categories`  
> **Code:** `apps/web/src/components/categories/category-grid.tsx`

---

## Purpose

Manage catalog categories with the same AG Grid datatable as Product List. Drag-and-drop sets menu order (no separate sort-order field).

## UI Layout (As Built)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ Categories (15)              [Import] [Export] [+ Add Category]                   │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [Search] [Status ▾] [Top menu ▾] [Reset order]                                    │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ⋮⋮ │ Icon │ Name (indented) │ Caption │ Parent │ Slug │ Top │ Products │ Status │
│ ⋮⋮ │  □   │ Apparel         │ Fashion │ —       │ ...  │ Top │ 342      │ On    │
│ ⋮⋮ │  □   │   Men's         │ Men     │ Apparel │ ...  │ —   │ 128      │ On    │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Mobile:** Indented cards + FAB `+` (reorder on desktop only)

## Components Built

| Component | Detail |
|-----------|--------|
| AG Grid | Same pattern as Product List — legacy theme, dark mode, pagination |
| Multi-select | Checkbox column + bulk turn on/off, menu, export, **delete** |
| Columns | Sheet to show/hide list columns |
| Filters | Sheet — toggle Search, Status, Menu filters in toolbar |
| Live edit | Sheet — toggle which fields edit inline in grid (Name, Caption, Slug, Menu, Status) + form-only list |
| Row drag | Reorder siblings (same parent) → updates `sortOrder` internally |
| Form dialog | Create/edit with all category fields |
| Zustand store | `lib/store/category-store.ts` — persisted menu order |

## Fields

| Field | Meaning | In form | In grid |
|-------|---------|---------|---------|
| **Name** | Full name (e.g. HP Laptop) | ✓ | ✓ (indented by depth) |
| **Caption** | Menu label (e.g. HP) | ✓ | ✓ |
| **Slug** | SEO URL | ✓ | ✓ |
| **Parent** | Parent category | ✓ | ✓ |
| **Description** | Rich text | ✓ | — |
| **Meta title / description / keywords** | SEO | ✓ | — |
| **Icon / Banner** | Category media | ✓ | icon thumbnail |
| **Top** | Show in website top menu | switch | badge |
| **Status** | On/Off | switch | badge |
| **sortOrder** | Internal — set by drag only | — | — |

## Menu order

- No manual sort-order input field
- Drag row handle (⋮⋮) among **same-parent** categories
- Top menu items: `active` + `showInTopMenu`, sorted by `sortOrder`

## Actions

| Action | Behavior |
|--------|----------|
| Drag row | Reorder menu serial among siblings |
| Multi-select | Checkbox + bulk turn on/off, menu, export, delete |
| + Add Category | Open create dialog |
| Edit / Add subcategory / Turn off | Row menu |
| Reset order | Restore seed data order |

## Prototype Notes

| Item | Value |
|------|-------|
| Fixture | `lib/mock-data/categories.ts` |
| Store | `lib/store/category-store.ts` (persisted) |
| Route | `/catalog/categories` |

## Change History

| Date | Change |
|------|--------|
| 2026-06-12 | AG Grid + drag menu order |
| 2026-06-12 | Expanded form fields (Caption, SEO, media, switches) |
| 2026-06-12 | Prototype UI built |
