# Inventory Module

> **Status:** Draft · **Version:** 1.0

Stock truth layer for AgainERP commerce — warehouses, levels, movements, reservations, transfers, and purchase receipts.

| Document | Description |
|----------|-------------|
| [**ARCHITECTURE.md**](./ARCHITECTURE.md) | Complete Inventory architecture |
| [catalog/ARCHITECTURE.md](../catalog/ARCHITECTURE.md) | Variant → item mapping |
| [orders/ARCHITECTURE.md](../orders/ARCHITECTURE.md) | Reserve / deduct lifecycle |

## UI Location

Admin menus under `Menus/Inventory/`: Stock Management, Warehouses, Adjustments, Transfers, Alerts

## Table Namespace

`inventory_*` — multi-warehouse, 10M+ movements
