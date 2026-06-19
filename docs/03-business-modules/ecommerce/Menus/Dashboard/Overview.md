# Overview

> **Status:** Draft  
> **Module:** Ecommerce  
> **Menu Path:** Ecommerce → Dashboard → Overview  
> **Architecture:** [dashboard/ARCHITECTURE.md](../../dashboard/ARCHITECTURE.md)

---

## Purpose

Default landing screen and command center snapshot. Displays real-time KPIs, mini charts, recent orders, inventory alerts, activity feed, quick actions, and AI insight cards — without navigating to sub-pages.

## Business Goals

- Give Admin/Manager instant visibility into today's store performance
- Surface critical alerts (low stock, failed payments) above the fold
- Enable one-click navigation to orders, products, and reports
- Load in < 2 seconds on mobile and desktop

## User Roles

| Role | Access Level | Notes |
|------|--------------|-------|
| _Admin_ | Full | _—_ |
| _Manager_ | Read/Write | _—_ |
| _Staff_ | Read only | _—_ |

## Page Layout

_Describe sections, tabs, sidebar, table columns, filters, and empty states._

```
┌─────────────────────────────────────────┐
│ Header / Breadcrumb / Actions             │
├─────────────────────────────────────────┤
│ Filters / Search                          │
├─────────────────────────────────────────┤
│ Main Content Area                         │
└─────────────────────────────────────────┘
```

## Fields (KPI Widgets)

| KPI | Formula | Refresh |
|-----|---------|---------|
| Today Sales | SUM(line totals) today, non-cancelled | 60s |
| Orders Today | COUNT orders today | 60s |
| Revenue Today | SUM(order.total) today | 60s |
| New Customers | COUNT contacts created today | 5m |
| Conversion Rate | orders / sessions × 100 | 15m |
| Average Order Value | Revenue / Orders | 60s |
| Refund Amount | SUM refunds today | 5m |

Global filters: **Date Range**, **Company**, **Branch** (persist in session).

## Actions

| Action | Type | Permission | Result |
|--------|------|------------|--------|
| _—_ | _Button_ | _—_ | _—_ |

## Validation Rules

- _Rule 1_
- _Rule 2_

## Workflow

_Describe state transitions and triggers._

```
Draft → Submitted → Approved → Completed
```

## Permissions

| Permission Key | Description |
|----------------|-------------|
| `ecommerce.dashboard.access` | Enter dashboard |
| `ecommerce.dashboard.overview` | View KPI widgets |
| `ecommerce.dashboard.orders` | Recent orders widget |
| `ecommerce.dashboard.inventory` | Inventory alerts widget |
| `ecommerce.dashboard.ai` | AI insights widget |

## Database Tables

| Table | Usage |
|-------|-------|
| `analytics_dashboard_cache` | Cached widget payloads |
| `analytics_sales` | KPI / trend data |
| `ecommerce_orders` | Live order counts |
| `contacts` | New customer count |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/ecommerce/dashboard/overview` | Full overview payload |
| GET | `/api/v1/ecommerce/dashboard/overview/kpis` | KPI cards only |
| GET | `/api/v1/ecommerce/dashboard/orders/recent` | Recent orders widget |
| GET | `/api/v1/ecommerce/dashboard/inventory/alerts` | Alert widget |
| GET | `/api/v1/ecommerce/dashboard/quick-actions` | Role-based shortcuts |
| GET | `/api/v1/ecommerce/dashboard/ai/insights` | AI insight cards |

## Reports Impact

- _Report name — how this page affects it_

## Future Enhancements

- _Enhancement 1_

## Dependencies

- **Core:** _User Management, Permissions, …_
- **Modules:** _Inventory, Sales, …_
- **Pages:** _[Related Page](./path.md)_

---

**Module:** Ecommerce  
**Last Updated:** —  
**Author:** —  
**Reviewers:** —
