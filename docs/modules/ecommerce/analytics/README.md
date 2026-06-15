# Analytics Module

> **Status:** Draft · **Version:** 1.0

Read-optimized aggregation layer — jobs, materialized views, and `analytics_*` tables for Dashboard and Reports.

| Document | Description |
|----------|-------------|
| [**ARCHITECTURE.md**](./ARCHITECTURE.md) | Complete Analytics architecture |
| [dashboard/ARCHITECTURE.md](../dashboard/ARCHITECTURE.md) | Widget consumers |
| [reports/ARCHITECTURE.md](../reports/ARCHITECTURE.md) | Report queries |

## Data Flow

Source modules → aggregation jobs → `analytics_*` → Dashboard / Reports / AI

## Table Namespace

`analytics_*`
