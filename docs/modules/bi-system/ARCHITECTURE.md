# Architecture — BI System

> **Status:** Draft  
> **Module:** BI System  
> **Document Type:** Architecture  
> **Phase:** 8 (Step 80)

---

## Purpose

Deliver self-service and executive business intelligence on top of the Data Warehouse. Provides dashboard builder, saved reports, drill-down, scheduled delivery, and embedded widgets in module home screens. Complements Core Reporting Engine (OLTP reports) with historical and cross-module analytics.

## Business Goals

- Single source of truth for executive KPIs
- Empower managers with drag-and-drop dashboards without SQL
- Reduce custom report development via reusable datasets
- Support AI Analytics natural-language queries over curated metrics

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  BI UI: Dashboard Builder · Report Designer · Explorer  │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│  BI Query Layer (semantic model, RLS, caching)          │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│  Data Warehouse marts (mart_*, agg_*)                   │
└─────────────────────────────────────────────────────────┘
```

Semantic layer maps business terms (Revenue, MRR, Stockout) to warehouse fields. AI module queries semantic layer only — never raw tables.

## Dashboard System

| Component | Description |
|-----------|-------------|
| Dashboard | Collection of widgets with global filters |
| Widget | Chart, table, KPI card, map, funnel |
| Dataset | Curated query with dimensions and measures |
| Filter | Date range, branch, category — cascades to widgets |

Target: dashboard load < 3s via pre-aggregates and Redis cache.

## Report Designer

| Feature | Description |
|---------|-------------|
| Visual builder | Drag fields, group, sort, conditional format |
| SQL mode | Power users with allowlisted tables only |
| Parameters | @start_date, @branch_id runtime inputs |
| Export | PDF, Excel, CSV |
| Schedule | Email delivery via Notification |

## ERP Analytics Coverage

Primary analytics domains (datasets pre-built):

| Domain | Key Dashboards |
|--------|----------------|
| Executive | Revenue, profit, cash, growth |
| Sales | Pipeline, conversion, product performance |
| Inventory | Stock health, aging, forecast vs actual |
| Finance | P&L, balance sheet trends, AR/AP |
| Ecommerce | Traffic funnel, cart abandonment, LTV |
| Operations | Fulfillment SLA, manufacturing OEE |
| Subscription | MRR, churn, expansion |
| Marketplace | Vendor GMV, commission, payout |

Module home screens embed 2–4 default widgets linking to full BI dashboards.

## Embedded Analytics

Iframe and API embed tokens for external portals. Row-level security enforced by `company_id` and user branch scope in query layer.

## User Roles

| Role | Access |
|------|--------|
| BI Admin | Datasets, semantic model, sharing |
| Analyst | Create/edit dashboards and reports |
| Viewer | View shared dashboards |
| Executive | Executive dashboard pack (read-only) |

Permission namespace: `bi.*`

## Database Tables

Prefix: `bi_*`

| Table | Purpose |
|-------|---------|
| `bi_datasets` | Dataset definitions |
| `bi_dashboards` | Dashboard metadata |
| `bi_widgets` | Widget config (JSONB) |
| `bi_reports` | Saved report definitions |
| `bi_schedules` | Scheduled delivery |
| `bi_favorites` | User bookmarks |
| `bi_share_rules` | Role/user sharing ACL |
| `bi_query_cache` | Cached result metadata |

## API Endpoints

Base path: `/api/v1/bi/`

| Group | Purpose |
|-------|---------|
| `/dashboards` | CRUD, render data |
| `/reports` | Run, export |
| `/datasets` | Metadata for builder |
| `/embed` | Tokenized embed URLs |

## Events

| Event | Subscribers |
|-------|-------------|
| `bi.schedule.triggered` | Notification (email report) |
| `bi.dataset.invalidated` | Cache purge |

## Dependencies

- **Core:** Users, Permissions, Notification, Cache
- **Modules:** Data Warehouse (primary source), AI (NL analytics), all modules (embedded widgets)

## Future Enhancements

- Collaborative dashboard comments
- Mobile executive app
- External BI tool connector (Power BI, Looker)

---

**Module:** BI System  
**Last Updated:** 2026-06-12
