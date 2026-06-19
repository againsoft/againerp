# Brands

> **Status:** Ready (Prototype)  
> **Route:** `/catalog/brands`  
> **Code:** `apps/web/src/components/brands/brand-grid.tsx`

---

## Purpose

Manage catalog brands with the same AG Grid datatable pattern as Categories. Drag-and-drop sets brand list order.

## UI Layout (As Built)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ Brands (8)                    [Import] [Export] [+ Add Brand]                     │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [Search] [Reset order] [Filters] [Live edit] [Columns]                            │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ⋮⋮ │ Logo │ Name │ Slug │ Website │ Products │ Status │ Updated │ ⋮              │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Mobile:** Card list + FAB `+`

## Components Built

| Component | Detail |
|-----------|--------|
| AG Grid | Same pattern as Categories — legacy theme, dark mode, pagination |
| Multi-select | Checkbox + bulk turn on/off, export, delete |
| Columns | Sheet to show/hide list columns |
| Filters | Sheet — toggle Search, Status in toolbar |
| Live edit | Sheet — toggle Name, Slug, Status inline edit |
| Row drag | Reorder brands → updates `sortOrder` |
| Form dialog | Create/edit with WordPress description editor |
| Zustand store | `lib/store/brand-store.ts` — persisted order |

## Fields

| Field | In form | In grid |
|-------|---------|---------|
| Name | ✓ | ✓ inline edit |
| Slug | ✓ | ✓ inline edit |
| Website | ✓ | ✓ (hostname) |
| Description | ✓ (WP editor) | — |
| Logo / Banner | ✓ | logo thumbnail |
| Meta title / description / keywords | ✓ | — |
| Status | ✓ switch | ✓ toggle |
| sortOrder | — (drag only) | — |

## Change History

| Date | Change |
|------|--------|
| 2026-06-12 | Brands UI built (Categories pattern) |
