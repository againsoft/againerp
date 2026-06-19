# AgainERP — Table & Data Grid Standard

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 10 — Enterprise Design System & UI Foundation  
> **Authority:** [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md)

---

## Purpose

Standards for **list views** — tables, data grids, filters, bulk actions, pagination, search, and export.

## When To Read

Read when documenting entity list screens in `Menus/` or `UI.md`.

## Related Files

- [PAGE_LAYOUT_STANDARD.md §4](./PAGE_LAYOUT_STANDARD.md#4-list-layout)
- [filters.md](./filters.md) · [live-filters.md](./live-filters.md)
- [smart-admin-lists.md](./smart-admin-lists.md)
- [recharts-conventions.md](./recharts-conventions.md) — charts in analytics views

## Read Next

§3 **List page anatomy** if designing one list screen.

---

## 1. List vs Data Grid

| Pattern | ID | When |
|---------|-----|------|
| **Simple table** | `DS-TABLE` | < 10 columns, standard CRUD |
| **Data grid** | `DS-DATAGRID` | Sort, resize columns, column picker, virtual scroll |
| **Card list** | `DS-CARD-LIST` | Mobile `< md` breakpoint |

**Default:** Data grid on desktop · card list on mobile — same data source.

---

## 2. Table Anatomy

```text
Toolbar:  [Search] [Filters ▾] [View: List|Kanban] [Export ▾] [+ Create]
Bulk bar:  (when rows selected)  N selected · Bulk actions
Header:    Column headers (sticky)
Body:      Rows · zebra optional · row click → ?view=
Footer:    Pagination · row count · page size
```

---

## 3. Columns

| Rule | Detail |
|------|------|
| Primary column | First — name/title, link to record |
| Status | Badge component — status-system tokens |
| Money | Right-aligned, locale format |
| Date | Relative + absolute tooltip |
| Actions | Icon buttons or ⋯ menu — max 3 visible |
| Hidden by default | Long tail columns in column picker |

---

## 4. Filters (`DS-FILTER-*`)

| Type | Component |
|------|-----------|
| Quick filters | Chip row below toolbar |
| Advanced | Filter drawer / popover |
| Saved filters | User-named presets |
| Live filter | Debounced search — live-filters.md |

Filters sync to URL query params where shareable.

---

## 5. Bulk Actions

| Rule | Detail |
|------|------|
| Selection | Checkbox column · select all page / all matching |
| Bar | Sticky above table when ≥1 selected |
| Actions | Permission-gated · confirm for destructive |
| Clear | Deselect on navigation |

---

## 6. Pagination

| Mode | Usage |
|------|-------|
| Page-based | Default — page size 25/50/100 |
| Cursor | Large datasets, infinite scroll optional |
| Footer | "Showing X–Y of Z" |

---

## 7. Search

| Scope | Behavior |
|-------|----------|
| List search | Filters current entity fields |
| Global search | Header `Ctrl+K` — separate system |

List search: debounce 300ms · clear button · keyboard `/` focus shortcut optional.

---

## 8. Export

| Format | Permission |
|--------|--------------|
| CSV | `{module}.{entity}.export` |
| Excel | Same or elevated |
| PDF | Reports module primarily |

Export respects current filters and column visibility.

---

## 9. Row Interactions

| Action | Result |
|--------|--------|
| Row click | Open `?view={id}` drawer |
| Checkbox | Bulk select |
| ⋯ menu | Edit, duplicate, delete (permission-gated) |
| Keyboard | ↑↓ navigate rows · Enter open |

---

## 10. Empty & Loading States

| State | Component |
|-------|-----------|
| Loading | Skeleton rows |
| Empty | `DS-CARD-EMPTY` + create CTA |
| No results | Adjust filters message |
| Error | Inline retry |

---

## 11. Performance

| Rule | Detail |
|------|--------|
| Virtual scroll | > 100 rows on desktop grid |
| Sticky header | Always on desktop |
| Column resize | Persist in user prefs |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 10 — table and data grid standard |

---

**Table & Data Grid Standard** — one list pattern, drawer CRUD, mobile card fallback.
