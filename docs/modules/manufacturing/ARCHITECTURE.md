# Architecture — Manufacturing

> **Status:** Draft  
> **Module:** Manufacturing  
> **Document Type:** Architecture  
> **Phase:** 8 (Step 74)

---

## Purpose

Plan and execute production: BOMs, routings, work orders, material consumption, finished goods receipt, and capacity planning. Tightly coupled with Inventory for raw materials and finished stock.

## Business Goals

- Convert sales demand into production schedules
- Track material usage and production costs accurately
- Support multi-level BOMs and subcontracting
- Provide real-time shop floor visibility

## Core Concepts

| Concept | Description |
|---------|-------------|
| BOM | Bill of Materials — components per finished product |
| Routing | Operation sequence, work centers, standard times |
| Work Order | Production job for a quantity of finished goods |
| Work Center | Machine or labor pool with capacity |
| MRP | Material requirements from demand forecast and SO |

## Production Flow

```
Demand (SO / Forecast)
        │
        ▼
   MRP Run → Purchase Requests + Work Orders
        │
        ▼
Work Order: Planned → Released → In Progress → Done
        │
        ├── Material Issue (Inventory ↓)
        └── Finished Goods Receipt (Inventory ↑)
```

Scrap and yield tracked per operation. Costs roll up to finished product valuation in Accounting.

## BOM Types

| Type | Use Case |
|------|----------|
| Manufacturing | Standard production BOM |
| Phantom | Sub-assembly exploded at parent level |
| Kit | Ecommerce bundle assembly |

Versioning: BOM revisions with effective dates. Work orders lock to BOM version at release.

## Shop Floor

| Feature | Description |
|---------|-------------|
| Operation tracking | Start/stop per routing step |
| Labor logging | Timesheet integration |
| Quality checkpoints | Pass/fail, rework routing |
| Barcode/QR | Scan to issue materials, report output |

Mobile-friendly UI for warehouse and shop floor staff.

## Subcontracting

Send semi-finished goods to vendor for external operation. Creates Purchase order linked to work order operation; receipt triggers next internal step.

## User Roles

| Role | Access |
|------|--------|
| Production Manager | BOM, routing, scheduling, MRP |
| Shop Floor Operator | Work order execution |
| Planner | MRP runs, capacity view |
| Cost Accountant | Standard vs actual cost analysis |

Permission namespace: `manufacturing.*`

## Database Tables

Prefix: `manufacturing_*`

| Table | Purpose |
|-------|---------|
| `manufacturing_boms` | BOM headers |
| `manufacturing_bom_lines` | Components |
| `manufacturing_routings` | Operation sequences |
| `manufacturing_routing_operations` | Steps per routing |
| `manufacturing_work_centers` | Capacity definitions |
| `manufacturing_work_orders` | Production jobs |
| `manufacturing_work_order_operations` | Step status |
| `manufacturing_material_issues` | Consumption records |
| `manufacturing_finished_goods` | Output receipts |
| `manufacturing_mrp_runs` | Planning run log |

## API Endpoints

Base path: `/api/v1/manufacturing/` — BOM CRUD, work order lifecycle, shop floor actions.

## Events

| Event | Subscribers |
|-------|-------------|
| `manufacturing.work_order.released` | Inventory (reserve), Notification |
| `manufacturing.material.issued` | Inventory, Accounting |
| `manufacturing.order.completed` | Inventory, Sales (backorder fill) |

## Dependencies

- **Core:** Branches, Users, Workflow, Queue
- **Modules:** Inventory, Purchase, Sales, Accounting, Project, Timesheet

## Future Enhancements

- Advanced scheduling (finite capacity)
- IoT machine data ingestion
- PLM integration for engineering change orders

---

**Module:** Manufacturing  
**Last Updated:** 2026-06-12
