# Tables

> **Status:** Superseded — **do not use as SSOT**  
> **Superseded by:** [TABLE_AND_DATA_GRID_STANDARD.md](./TABLE_AND_DATA_GRID_STANDARD.md) · [UI_ARCHITECTURE_LOCK.md](../../UI_ARCHITECTURE_LOCK.md) — APPROVED (Step 10)  
> **On conflict:** Step 10 standards win.  
> **Master:** [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md)  
> **Smart lists:** [smart-admin-lists.md](./smart-admin-lists.md) — inline edit, Excel-style  
> **Standards:** [DEVELOPMENT_STANDARDS.md §13](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md#13-search-standards) · [mobile-first.md](./mobile-first.md) · [COMPONENT_LIBRARY_STANDARD.md](./COMPONENT_LIBRARY_STANDARD.md)

## Purpose
Global UI standard: tables.

## When To Read
Read only if working on UI patterns related to tables.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Purpose

Define the data table system for AgainERP list pages — sorting, pagination, bulk actions, and mobile card fallback. Odoo-style list views with modern responsive behavior.

---

## Table Anatomy

```
┌─────────────────────────────────────────────────────────┐
│ Bulk bar (when rows selected)                           │
├─────────────────────────────────────────────────────────┤
│ ☐ │ Column A ↕ │ Column B │ Status │ Actions          │
├───┼────────────┼──────────┼────────┼──────────────────┤
│ ☐ │ Row data   │ ...      │ Badge  │ ⋮                │
├───┴────────────┴──────────┴────────┴──────────────────┤
│ Pagination · Page size · Total count                   │
└─────────────────────────────────────────────────────────┘
```

**Regions:** Toolbar (filters, search, create) · Table header · Body rows · Footer (pagination, selection count).

---

## Column Types

| Type | Rendering | Sortable | Example |
|------|-----------|----------|---------|
| Text | Truncate + tooltip | Yes | Name, SKU |
| Number | Right-aligned, locale format | Yes | Qty, Amount |
| Date | Relative + absolute tooltip | Yes | Created, Due |
| Status | Badge component | Yes | Order state |
| Avatar + text | User/company cell | Yes | Assignee |
| Actions | Icon menu | No | Edit, Delete |
| Checkbox | Row selection | No | Bulk select |

**Sticky columns:** Checkbox + primary identifier sticky left on horizontal scroll (mobile).

---

## Sorting

| Rule | Detail |
|------|--------|
| Default | Server-defined per list (usually `-created_at`) |
| Indicator | Arrow icon in header; `aria-sort` attribute |
| Toggle | None → asc → desc → none (optional third state) |
| API | `?sort=field` or `?sort=-field` for descending |
| Multi-sort | Desktop only, Shift+click; max 3 columns |

Sort state persists in URL query params for shareable list views.

---

## Pagination

| Mode | When |
|------|------|
| Page-based | Default; 25 rows per page |
| Load more | Mobile optional alternative |
| Cursor-based | Large datasets (> 10k rows) |

**Controls:** First · Prev · Page numbers · Next · Last · Page size selector (10, 25, 50, 100).

**Display:** "Showing 1–25 of 1,234" with total count from API. Empty state when zero results — not an empty table.

---

## Row Selection & Bulk Actions

| Feature | Behavior |
|---------|----------|
| Select all | Current page only; banner if more pages exist |
| Select all matching | Optional link in bulk bar for filtered sets |
| Bulk bar | Slides in above table; shows count + actions |
| Actions | Module-defined: Delete, Export, Assign, Change Status |

**Confirmation:** Destructive bulk actions require confirm dialog with count. Progress toast for async bulk jobs.

**Permissions:** Bulk actions respect RBAC — hidden if user lacks permission.

---

## Row Actions

| Pattern | Usage |
|---------|-------|
| Primary click | Opens record detail / form |
| Action menu (⋮) | Secondary: Edit, Duplicate, Archive, Delete |
| Inline quick edit | Double-click or edit icon for simple fields (optional) |

Mobile: row tap opens detail; swipe or long-press reveals actions (module-configurable).

---

## Mobile Card View

Below `md` (768px), tables transform to card list unless horizontal scroll explicitly chosen.

**Card structure:**

```
┌──────────────────────────────┐
│ ☐  Primary Title      Badge  │
│    Secondary meta · Date     │
│    Key field: Value          │
│    [Action] [Action]         │
└──────────────────────────────┘
```

| Rule | Detail |
|------|--------|
| Primary field | Bold, top-left — record identifier |
| Status | Badge top-right |
| Fields | Max 3 key-value pairs visible |
| Actions | Footer button row or overflow menu |
| Sort/filter | Preserved from desktop; same API |

Every list screen doc must declare **mobile card fields** in Page Layout.

---

## Toolbar Integration

List toolbar order (left → right):

1. Create / primary action
2. Filters toggle (see [filters.md](./filters.md))
3. Search (module-scoped; global in top bar)
4. Column visibility (desktop)
5. Export / refresh

Mobile: Create as FAB or header action; filters in drawer.

---

## Performance

| Requirement | Target |
|-------------|--------|
| Initial load | Skeleton rows, < 500ms API p95 |
| Virtual scroll | Lists > 100 rows on desktop |
| Lazy images | Thumbnail columns |
| Pagination | Required — no unbounded fetch |

See [DEVELOPMENT_STANDARDS.md §2](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md#2-performance-first).

---

## Empty & Error States

| State | UI |
|-------|-----|
| No data | Illustration + "No records yet" + Create CTA |
| No results | "No matches" + Clear filters link |
| Error | Retry button + error message |
| Loading | 5 skeleton rows |

---

## Module Compliance

List pages in `Menus/*.md` must document: columns, default sort, bulk actions, mobile card fields, and pagination defaults.

## Related Documents

| Document | Topic |
|----------|-------|
| [filters.md](./filters.md) | List filtering |
| [global-search.md](./global-search.md) | Cross-module search |
| [components.md](./components.md) | Badges, buttons |
| [mobile-first.md](./mobile-first.md) | Responsive rules |
