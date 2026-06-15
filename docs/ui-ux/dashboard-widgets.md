# Dashboard Widgets

> **Status:** Draft  
> **Parent:** [UI_UX_DESIGN_STANDARDS.md](./UI_UX_DESIGN_STANDARDS.md)  
> **Backend:** [modules/ecommerce/dashboard/ARCHITECTURE.md](../modules/ecommerce/dashboard/ARCHITECTURE.md)

---

## Purpose

Widget-based dashboard system shared across Ecommerce, CRM, Accounting, and all modules.

---

## Widget Requirements

| Requirement | Spec |
|-------------|------|
| **Draggable** | Drag handle to reorder grid position |
| **Resizable** | Corner drag or size preset (S/M/L) |
| **Role based** | Default layout per role on first visit |
| **Customizable** | User overrides saved individually |
| **Save layout** | Auto-save to `user_settings` on change |
| **Hide** | Remove widget from layout (edit mode) |
| **Pin** | Pin widget to top row — survives reorder |
| **Per user** | Each user has independent layout |

---

## Grid System

| Property | Value |
|----------|-------|
| Columns | 12-column grid |
| Row height | 80px base unit |
| Gap | `--space-4` (16px) |
| Min widget | 3×2 columns |
| Max widget | 12×4 columns |

```
┌──────────┬──────────┬──────────┬──────────┐
│  Sales   │  Orders  │  Orders  │  Low     │
│  Today   │  Chart   │  Pending │  Stock   │
│  (3×2)   │  (6×3)   │  (3×2)   │  (3×2)   │
├──────────┴──────────┴──────────┼──────────┤
│  Recent Orders Table (9×3)       │  AI      │
│                                  │  Insight │
└──────────────────────────────────┴──────────┘
```

---

## Widget Types

| Type | Content |
|------|---------|
| **KPI card** | Single metric + trend arrow |
| **Chart** | Line, bar, pie, donut |
| **Table** | Top N records with link |
| **List** | Activity feed, tasks |
| **Map** | Geographic data (future) |
| **AI insight** | Generated summary card |
| **Custom HTML** | Builder widget (future) |

---

## Widget Chrome

```
┌─────────────────────────────────┐
│ ⋮⋮  Widget Title        [⋯] [×]│
├─────────────────────────────────┤
│                                 │
│  Widget body                    │
│                                 │
└─────────────────────────────────┘
```

| Control | Action |
|---------|--------|
| Drag handle (⋮⋮) | Reorder |
| ⋯ menu | Refresh, configure, export |
| × | Remove from layout (edit mode) |

---

## Edit Mode

Toggle "Customize dashboard" → enables drag, resize, add widget, remove.

| Action | Result |
|--------|--------|
| Add widget | Catalog picker filtered by role permissions |
| Reset layout | Restore role default |
| Save | Persist to user settings |
| Cancel | Revert unsaved changes |

---

## Data Loading

| Pattern | Use |
|---------|-----|
| Skeleton | Show while loading |
| Cache | `analytics_*` + Redis, 5min TTL |
| Refresh | Manual refresh per widget + global refresh |
| Error | Inline retry button |

---

## Mobile

Widgets stack single-column. Drag/reorder disabled on mobile — read-only dashboard. Customization on tablet+ only.

---

## Module Registration

Modules register widgets via manifest:

```yaml
widgets:
  - id: ecommerce.sales_today
    title: Sales Today
    default_size: { w: 3, h: 2 }
    roles: [store_owner, order_manager]
```
