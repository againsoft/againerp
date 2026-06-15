# Reports Module

> **Status:** Draft · **Version:** 1.0

Operational and analytical reporting — sales, product, customer, inventory, marketing, tax, and profit.

| Document | Description |
|----------|-------------|
| [**ARCHITECTURE.md**](./ARCHITECTURE.md) | Complete Reports architecture |
| [analytics/ARCHITECTURE.md](../analytics/ARCHITECTURE.md) | Aggregation layer (`analytics_*`) |
| [dashboard/ARCHITECTURE.md](../dashboard/ARCHITECTURE.md) | KPI widgets (shared data) |

## UI Location

Admin menus under `Menus/Reports/`: Sales, Product, Customer, Marketing, Inventory, Tax, Profit

## Data Source

Primary: `analytics_*` tables · Drill-down: source module tables
