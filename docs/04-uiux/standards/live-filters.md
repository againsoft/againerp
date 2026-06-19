# Live Filters

> **Status:** Draft  
> **Parent:** [UX_SMART_INTERACTION_STANDARDS.md](./UX_SMART_INTERACTION_STANDARDS.md) §3  
> **Related:** [filters.md](./filters.md)

---

## Purpose
Global UI standard: live filters.

## When To Read
Read only if working on UI patterns related to live filters.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Purpose

All list filters apply **instantly without page reload**. Results update via async API.

---

## Rules

| Rule | Spec |
|------|------|
| No full reload | SPA fetch on filter change |
| Debounce | Text search 300ms |
| Instant | Select, toggle, date preset — immediate |
| Loading | Table skeleton or row opacity — never blank flash |
| Cancel | Abort in-flight request on rapid filter change |

---

## Features

| Feature | Behavior |
|---------|----------|
| **Instant filtering** | Results update as user selects |
| **Multi-select** | OR within facet, AND across facets |
| **Saved filters** | Name + save to user preferences |
| **Filter presets** | Module defaults: "Active", "Low stock", "Today" |
| **Dynamic counts** | `(24)` next to facet option — from API |
| **URL-based** | `?status=active&category=apparel` — shareable, bookmarkable |
| **Advanced filters** | AND/OR groups in panel |

---

## UI Pattern

```
[ Search... ] [Status ▾] [Category ▾] [+ Filters (3)] [Saved: Active Products ▾]

┌─ Advanced Filters ─────────────────────┐
│ Stock: [Any ▾]  Price: [min] – [max]   │
│ Brand: [☑ Nike] [☑ Adidas]           │
│           [Clear] [Apply] [Save as…]   │
└────────────────────────────────────────┘
```

Mobile: chips + bottom sheet for advanced.

---

## Applies To

Product List · Order List · Customer List · Media List · Coupon List · Inventory · Reports

---

## API

`GET /api/v1/{module}/{entity}?{filter_params}`

Response includes `meta.filter_counts` for facet badges when requested.

---

## Performance

- Paginate results — never load full dataset client-side
- Cache facet counts 60s per filter combination
- Max 20 active filter params per request
