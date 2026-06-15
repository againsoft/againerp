# Architecture — Data Warehouse

> **Status:** Draft  
> **Module:** Data Warehouse  
> **Document Type:** Architecture  
> **Phase:** 8 (Steps 78–79)

---

## Purpose

Provide AgainERP's analytical backbone: extract operational data from OLTP modules, transform into dimensional models, and load into a query-optimized store for reporting, BI dashboards, and AI analytics. Implements the analytics database strategy defined in [database/MASTER_DATABASE_ARCHITECTURE.md](../../database/MASTER_DATABASE_ARCHITECTURE.md) §12.

## Business Goals

- Decouple heavy analytics from transactional database performance
- Preserve historical snapshots even when OLTP records change
- Enable cross-module reporting (sales + inventory + accounting)
- Feed BI System and AI Analytics with consistent metrics

## Architecture Overview

```
OLTP (PostgreSQL)          ETL Pipeline              Warehouse
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ ecommerce_*     │───▶│ Extract (CDC/     │───▶│ dim_*           │
│ sales_*         │    │  incremental)     │    │ fact_*          │
│ inventory_*     │    │ Transform (dbt/    │    │ agg_*           │
│ accounting_*    │    │  SQL jobs)        │    │ snapshot_*      │
└─────────────────┘    │ Load (upsert)     │    └─────────────────┘
                       └──────────────────┘
```

ETL runs on Queue scheduler. Failures alert via Notification; idempotent loads with batch IDs.

## Data Layers

| Layer | Contents | Refresh |
|-------|----------|---------|
| Staging (`stg_*`) | Raw extracts, minimal typing | Per run |
| Intermediate (`int_*`) | Joined, cleansed business logic | Per run |
| Marts (`mart_*`) | Subject-area stars (sales, finance) | Hourly/daily |
| Aggregates (`agg_*`) | Pre-rolled KPIs for dashboards | Near real-time optional |

## Dimensional Model (Core Facts)

| Fact Table | Grain | Key Dimensions |
|------------|-------|----------------|
| `fact_sales` | Order line | date, customer, product, branch, channel |
| `fact_inventory` | SKU-day snapshot | product, warehouse, company |
| `fact_payments` | Payment transaction | date, method, account |
| `fact_subscriptions` | Subscription-day | plan, customer, status |
| `fact_manufacturing` | Work order completion | product, work center |

Dimensions: `dim_date`, `dim_customer`, `dim_product`, `dim_branch`, `dim_vendor`, `dim_account` — SCD Type 2 where history matters.

## ERP Analytics (Operational Metrics)

Cross-module KPIs materialized in warehouse marts (not computed ad hoc in OLTP):

| Domain | Example Metrics |
|--------|-----------------|
| Sales | Revenue, AOV, conversion, returns rate |
| Inventory | Turnover, days on hand, stockout rate |
| Finance | AR aging, gross margin, cash flow |
| Operations | Fulfillment SLA, pick accuracy |
| HR | Headcount, attendance (when HR synced) |

BI System reads from marts; AI Analytics uses allowlisted mart views.

## Multi-Tenant Isolation

Every warehouse table includes `company_id`. Row-level security mirrors OLTP tenant boundaries. Cross-company reports only for platform super-admin.

## Change Data Capture

| Method | When |
|--------|------|
| Timestamp incremental | `updated_at` on source tables |
| Event-driven | Core Event System → queue extract job |
| Full snapshot | Nightly for small dimension tables |

Audit: `dw_etl_runs`, `dw_etl_errors`, `dw_lineage` (source → target mapping).

## User Roles

| Role | Access |
|------|--------|
| Data Engineer | ETL config, pipeline monitoring |
| Analytics Admin | Mart definitions, refresh schedules |
| Report Viewer | Via BI System only — no direct warehouse SQL |

Permission namespace: `data_warehouse.*` (admin); consumers use `bi.*`

## Database Objects

Prefix: `dw_*` (metadata), `stg_*`, `dim_*`, `fact_*`, `mart_*`, `agg_*`

| Table | Purpose |
|-------|---------|
| `dw_etl_jobs` | Job definitions |
| `dw_etl_runs` | Run history |
| `dw_etl_errors` | Failure details |
| `dw_lineage` | Data lineage graph |
| `dw_snapshots` | Point-in-time exports |

Physical deployment: separate PostgreSQL instance or read replica with analytics extensions; optional columnar extension for large facts.

## API Endpoints

Base path: `/api/v1/data-warehouse/` — admin ETL trigger, run status, lineage query. No public data API; BI module owns query layer.

## Dependencies

- **Core:** Event System, Queue, Audit
- **Modules:** All ERP modules (sources), BI System (consumer), AI (analytics queries)

## Future Enhancements

- Real-time streaming (Kafka/Redis streams) for live dashboards
- Data catalog and self-service discovery
- ML feature store for forecasting models

---

**Module:** Data Warehouse  
**Last Updated:** 2026-06-12
