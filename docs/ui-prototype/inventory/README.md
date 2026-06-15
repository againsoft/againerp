# Inventory Module — UI Prototype Index

> **Status:** Planned  
> **Architecture:** [INVENTORY_MODULE_ARCHITECTURE.md](../../modules/inventory/INVENTORY_MODULE_ARCHITECTURE.md)  
> **Workflows:** [INVENTORY_WORKFLOW.md](../../modules/inventory/INVENTORY_WORKFLOW.md)  
> **Route namespace:** `/inventory/*`

---

## Screens (Planned)

| Screen | Route | Prototype Doc |
|--------|-------|---------------|
| Dashboard | `/inventory` | [InventoryAlerts.md](../dashboard/InventoryAlerts.md) |
| Stock | `/inventory/stock` | [Menus/Inventory/Stock Management.md](../ecommerce/Menus/Inventory/Stock%20Management.md) |
| Warehouses | `/inventory/warehouses` | [Menus/Inventory/Warehouses.md](../ecommerce/Menus/Inventory/Warehouses.md) |
| Transfers | `/inventory/transfers` | [Menus/Inventory/Stock Transfer.md](../ecommerce/Menus/Inventory/Stock%20Transfer.md) |
| Adjustments | `/inventory/adjustments` | [Menus/Inventory/Stock Adjustment.md](../ecommerce/Menus/Inventory/Stock%20Adjustment.md) |
| Reports | `/inventory/reports` | [InventoryReports.md](../reports/InventoryReports.md) |
| Cycle Counts | `/inventory/cycle-counts` | [INVENTORY_WORKFLOW.md §8](../../modules/inventory/INVENTORY_WORKFLOW.md) |
| Reservations | `/inventory/reservations` | [INVENTORY_WORKFLOW.md §5](../../modules/inventory/INVENTORY_WORKFLOW.md) |
| Batches | `/inventory/batches` | [INVENTORY_WORKFLOW.md §6](../../modules/inventory/INVENTORY_WORKFLOW.md) |
| Serials | `/inventory/serials` | [INVENTORY_WORKFLOW.md §7](../../modules/inventory/INVENTORY_WORKFLOW.md) |
| AI Forecast | Dashboard widget | [AiInventoryForecast.md](../ai-os/AiInventoryForecast.md) |

---

## Current Code Stub

- Route: `apps/web/src/app/(admin)/inventory/page.tsx` (placeholder)
- Nav: `apps/web/src/lib/navigation.ts` → Inventory → `/inventory`
