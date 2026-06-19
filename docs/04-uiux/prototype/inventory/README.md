# Inventory Module — UI Prototype Index

## Purpose
Documentation: README.

## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../../BRAIN.md)

## Read Next
- [Doc map](../../../PROJECT_MAP.md)

---

> **Status:** Planned  
> **Architecture:** [INVENTORY_MODULE_ARCHITECTURE.md](../../../03-business-modules/inventory/INVENTORY_MODULE_ARCHITECTURE.md)  
> **Workflows:** [INVENTORY_WORKFLOW.md](../../../03-business-modules/inventory/INVENTORY_WORKFLOW.md)  
> **Route namespace:** `/inventory/*`

---


## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../../BRAIN.md)

## Read Next
- [Doc map](../../../PROJECT_MAP.md)

---

## Screens (Planned)

| Screen | Route | Prototype Doc |
|--------|-------|---------------|
| Dashboard | `/inventory` | [InventoryAlerts.md](../dashboard/InventoryAlerts.md) |
| Stock | `/inventory/stock` | [Menus/Inventory/Stock Management.md](../../../03-business-modules/ecommerce/Menus/Inventory/Stock Management.md) |
| Warehouses | `/inventory/warehouses` | [Menus/Inventory/Warehouses.md](../../../03-business-modules/ecommerce/Menus/Inventory/Warehouses.md) |
| Transfers | `/inventory/transfers` | [Menus/Inventory/Stock Transfer.md](../../../03-business-modules/ecommerce/Menus/Inventory/Stock Transfer.md) |
| Adjustments | `/inventory/adjustments` | [Menus/Inventory/Stock Adjustment.md](../../../03-business-modules/ecommerce/Menus/Inventory/Stock Adjustment.md) |
| Reports | `/inventory/reports` | [InventoryReports.md](../reports/InventoryReports.md) |
| Cycle Counts | `/inventory/cycle-counts` | [INVENTORY_WORKFLOW.md §8](../../../03-business-modules/inventory/INVENTORY_WORKFLOW.md) |
| Reservations | `/inventory/reservations` | [INVENTORY_WORKFLOW.md §5](../../../03-business-modules/inventory/INVENTORY_WORKFLOW.md) |
| Batches | `/inventory/batches` | [INVENTORY_WORKFLOW.md §6](../../../03-business-modules/inventory/INVENTORY_WORKFLOW.md) |
| Serials | `/inventory/serials` | [INVENTORY_WORKFLOW.md §7](../../../03-business-modules/inventory/INVENTORY_WORKFLOW.md) |
| AI Forecast | Dashboard widget | [AiInventoryForecast.md](../ai-os/AiInventoryForecast.md) |

---

## Current Code Stub

- Route: `apps/web/src/app/(admin)/inventory/page.tsx` (placeholder)
- Nav: `apps/web/src/lib/navigation.ts` → Inventory → `/inventory`
