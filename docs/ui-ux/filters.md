# Filters

> **Status:** Draft  
> **Live filters:** [live-filters.md](./live-filters.md) — **instant, no reload**  
> **Smart interaction:** [UX_SMART_INTERACTION_STANDARDS.md](./UX_SMART_INTERACTION_STANDARDS.md) §3  
> **Standards:** [DEVELOPMENT_STANDARDS.md §13](../DEVELOPMENT_STANDARDS.md#13-search-standards) · [tables.md](./tables.md) · [forms.md](./forms.md)

## Purpose

Define filter panel behavior, saved filters, date ranges, and faceted filtering for AgainERP list pages. Filters sync with URL state and API query parameters. **All filters apply without page reload** — see [live-filters.md](./live-filters.md).

---

## Filter Panel

| Viewport | Pattern |
|----------|---------|
| Mobile | Bottom sheet or full-screen drawer |
| Desktop | Collapsible left panel or inline toolbar chips |

**Anatomy:** Filter groups · Apply · Clear all · Save filter (if permitted).

**Behavior:**
- Filters apply **live** without page reload — debounce text 300ms; selects instant (see [live-filters.md](./live-filters.md))
- Active filter count badge on filter toggle button
- URL query params mirror active filters for shareable views
- Closing panel preserves draft until Apply or Discard

---

## Filter Types

| Type | UI | API Param Example |
|------|-----|-------------------|
| Text search | Input with magnifier | `?q=widget` |
| Select | Single or multi select | `?status=confirmed` |
| Boolean | Toggle or checkbox | `?archived=true` |
| Number range | Min/max inputs | `?amount_min=100` |
| Date range | Preset + custom picker | `?date_from=2026-01-01` |
| Relation | Lookup / autocomplete | `?customer_id=42` |
| Facet | Checkbox list with counts | `?category=electronics` |

**Default filters:** Module-defined per list (e.g., hide archived by default). Document in screen **Page Layout**.

---

## Date Ranges

**Presets (always available):**

| Preset | Range |
|--------|-------|
| Today | Current day |
| Yesterday | Previous day |
| This week | Mon–Sun (locale-aware) |
| Last 7 days | Rolling |
| This month | Calendar month |
| Last 30 days | Rolling |
| This quarter | Fiscal quarter |
| This year | Calendar or fiscal year |
| Custom | Dual date picker |

**Rules:**
- Store UTC; display in user/company timezone
- Custom range validates `from ≤ to`
- Fiscal year respects company settings ([DEVELOPMENT_STANDARDS.md §9](../DEVELOPMENT_STANDARDS.md#9-multi-company-ready))

---

## Faceted Filters

Facets show available values with record counts from aggregated API.

```
Category
  ☐ Electronics (142)
  ☐ Clothing (89)
  ☐ Home (56)

Status
  ☐ Draft (12)
  ☐ Confirmed (230)
```

| Rule | Detail |
|------|--------|
| Counts | Reflect current filter set excluding own facet |
| Multi-select | OR within facet; AND across facets |
| Search | Facets with > 10 values get inline search |
| Empty facets | Hidden or shown disabled with (0) |
| Loading | Skeleton counts; stale-while-revalidate |

**Performance:** Facet counts via dedicated API endpoint; cached 60s per filter combination hash.

---

## Saved Filters

| Feature | Detail |
|---------|--------|
| Save | Name + optional default flag + visibility (private/shared) |
| Load | Dropdown in toolbar: "My filters" / "Shared filters" |
| Manage | Edit name, delete, set as default |
| Default | One default per user per list; auto-applied on load |
| Share | Team filters require permission `filters.share` |

**Storage:** User preferences table + optional team filter library. Saved filter stores full query param snapshot.

**Mobile:** Saved filters in filter drawer header dropdown.

---

## Filter Chips

Active filters render as removable chips above the table (desktop) or below toolbar (mobile).

```
[Status: Confirmed ×] [Date: Last 30 days ×] [Clear all]
```

Chip remove updates URL and refreshes list immediately.

---

## Search vs Filter

| Feature | Scope | Location |
|---------|-------|----------|
| Global search | Cross-module | Top bar — see [global-search.md](./global-search.md) |
| Module search | Current entity type | List toolbar |
| Column filter | Single column | Table header (desktop, optional) |

Module search and filters combine with AND logic.

---

## API Contract

List endpoints accept filter params with consistent naming:

```
GET /api/v1/orders?status=confirmed&date_from=2026-06-01&sort=-created_at&page=1&limit=25
```

| Rule | Detail |
|------|--------|
| Validation | Unknown params ignored; invalid values → 400 with field errors |
| Indexing | All filterable columns must be indexed |
| Export | Export respects active filters |

---

## Module Compliance

List screens in `Menus/*.md` document available filters, defaults, facets, and saved filter support in **Page Layout** and **Actions**.

## Related Documents

| Document | Topic |
|----------|-------|
| [tables.md](./tables.md) | List page integration |
| [global-search.md](./global-search.md) | Global search |
| [forms.md](./forms.md) | Field components |
