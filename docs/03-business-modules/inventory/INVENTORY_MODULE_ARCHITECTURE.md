# AgainERP — Inventory Module Architecture

> **Status:** Approved  
> **Version:** 1.0  
> **Module:** Inventory (Independent Business Module)  
> **Document Type:** Enterprise Architecture  
> **Phase:** Documentation First · UI/UX Planning  
> **Route Namespace:** `/inventory/*`  
> **Governance:** [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · **Standards:** [DEVELOPMENT_STANDARDS.md](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md)

## Purpose
Inventory module architecture — scope, features, data ownership, and integration boundaries.

## When To Read
Read this file only if working on Inventory architecture, features, or module boundaries.

## Related Files
- [Dependencies](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next
- [UI build guides](../../04-uiux/prototype/inventory/)

---

**No backend code. No database implementation. No API implementation.**  
This document is the source of truth for **Inventory as an independent business module** — not an Ecommerce submodule.

### Step 02 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Inventory as independent business module | §1 Module Vision |
| Route namespace `/inventory/*` | §3 Navigation Structure |
| Works independently from Ecommerce | §1 · §15 Architecture Rules |
| Consumes Product Master (no duplicate products) | §5 Products |
| Ecommerce, Sales, Purchase, POS, Manufacturing, Hospital, Restaurant | §22 Future Compatibility |
| Activity System Integration | §18 Activity Integration |
| AI Inventory Agent | §19 AI Inventory Agent |

**Related:** [INVENTORY_WORKFLOW.md](./INVENTORY_WORKFLOW.md) · [ENTITY_INVENTORY.md](./ENTITY_INVENTORY.md) · [PRODUCT_MASTER_ARCHITECTURE.md](../../02-core-platform/subsystems/PRODUCT_MASTER_ARCHITECTURE.md) · [SALES_MODULE_ARCHITECTURE.md](../sales/SALES_MODULE_ARCHITECTURE.md) · [PURCHASE_MODULE_ARCHITECTURE.md](../purchase/PURCHASE_MODULE_ARCHITECTURE.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) · [modules/ecommerce/catalog/ARCHITECTURE.md](../ecommerce/catalog/ARCHITECTURE.md) · [modules/ecommerce/orders/ARCHITECTURE.md](../ecommerce/orders/ARCHITECTURE.md) · [MASTER_DATABASE_ARCHITECTURE.md](../../05-development/database/MASTER_DATABASE_ARCHITECTURE.md)

---

## Executive Summary

**Inventory** is AgainERP's **stock truth layer** — the authoritative system for *how many*, *where*, and *in what state* products exist across the business.

| Principle | Rule |
|-----------|------|
| **Independent module** | Full admin UX at `/inventory/*` — operable without opening Ecommerce |
| **Product Master consumer** | Inventory tracks stock; Product Master owns identity |
| **Single stock ledger** | `inventory_stock_levels` is the quantity source of truth |
| **Event-driven** | Orders, Purchase, POS subscribe — never duplicate qty columns |
| **Multi-industry** | Warehouses, batches, serials, valuation for retail → hospital → factory |

**Table namespace:** `inventory_*` · **API base:** `/api/v1/inventory/`

---

## 1. Module Vision

### Why Inventory Exists as an Independent Module

Ecommerce needs stock. So do Sales, Purchase, POS, Manufacturing, Hospitals, and Restaurants. Stock is **operational infrastructure** — not a storefront feature.

Inventory must work when:

- The business has **no online store** (wholesale, B2B, factory)
- Ecommerce is disabled but warehouses are active
- Multiple channels sell the same Product Master items
- Regulated industries require batch/serial traceability

```text
                    ┌─────────────────────────────────────┐
                    │         Product Master (Core)        │
                    │     Identity · SKU · Variant · Spec  │
                    └─────────────────┬───────────────────┘
                                      │ inventory_item_id
                                      ▼
                    ┌─────────────────────────────────────┐
                    │      Inventory Module (Independent)  │
                    │  Stock · Warehouses · Movements · AI   │
                    └─────────────────┬───────────────────┘
                                      │
        ┌──────────────┬──────────────┼──────────────┬──────────────┐
        ▼              ▼              ▼              ▼              ▼
   Ecommerce        Sales        Purchase          POS      Manufacturing
   (availability)  (reserve)    (receipt)      (deduct)     (BOM consume)
        │              │              │              │              │
        └──────────────┴──────────────┴──────────────┴──────────────┘
                                      │
                              Event Bus (domain events)
```

### Vision Statement

> **One stock ledger. Every channel. Every warehouse. Full traceability.**

Inventory is the **quantity spine** of AgainERP. Catalog answers *what* is sold; Inventory answers *how many*, *where*, and *under what lot or serial*.

---

## 2. Responsibilities

### Inventory Owns

| Domain | Responsibility |
|--------|----------------|
| **Stock levels** | On-hand, reserved, available, incoming per item × warehouse × location |
| **Movements** | Immutable ledger for every quantity change |
| **Warehouses & locations** | Physical and virtual storage hierarchy |
| **Transfers** | Inter-warehouse and inter-location moves |
| **Adjustments** | Corrections, shrinkage, cycle count variances |
| **Reservations** | Holds for orders, POS carts, manufacturing orders |
| **Batches & lots** | Expiry, recall, FEFO/FIFO compliance |
| **Serial numbers** | Unit-level traceability |
| **Valuation** | Cost methods, stock value, COGS input |
| **Reorder rules** | Min/max, purchase suggestions |
| **Barcode operations** | Scan → item lookup |

### Inventory Does Not Own

| Domain | Owner |
|--------|-------|
| Product name, SKU, descriptions, SEO | Product Master / Catalog |
| Customer orders, invoices | Sales / Orders |
| Purchase orders, supplier contracts | Purchase |
| GL posting rules | Accounting |
| Storefront merchandising | Ecommerce |

### Integration Contract

```text
Product Master  →  inventory_item_id (1:1 with sellable variant)
Orders          →  reserve / deduct / release / restock (events + API)
Purchase        →  receipt posting (inbound movements)
POS             →  real-time deduct at sale
Manufacturing   →  component consume, finished goods receipt
Ecommerce       →  read availability (never write qty)
```

---

## 3. Navigation Structure

**Route namespace:** `/inventory/*`

```text
Inventory
├── /inventory                          Dashboard
├── /inventory/products                 Product stock view (Product Master link)
├── /inventory/stock                    Stock levels & movements
├── /inventory/warehouses               Warehouse master
├── /inventory/warehouses/[id]/locations Locations within warehouse
├── /inventory/transfers                Inter-warehouse transfers
├── /inventory/adjustments              Stock adjustments
├── /inventory/reservations             Active holds
├── /inventory/batches                  Lot / batch tracking
├── /inventory/serials                  Serial number registry
├── /inventory/cycle-counts             Physical count workflows
├── /inventory/valuation                Stock valuation & costing
├── /inventory/reports                  Inventory reports hub
├── /inventory/settings                 Module settings
└── /inventory/activities               Cross-record activity feed (optional)
```

### Sidebar Navigation (Admin)

| Item | Route | Icon context |
|------|-------|--------------|
| Dashboard | `/inventory` | Overview KPIs |
| Products | `/inventory/products` | Stock by Product Master item |
| Stock | `/inventory/stock` | Levels + movement ledger |
| Warehouses | `/inventory/warehouses` | Warehouse + location tree |
| Transfers | `/inventory/transfers` | In-transit pipeline |
| Adjustments | `/inventory/adjustments` | Corrections queue |
| Reservations | `/inventory/reservations` | Order holds |
| Batches | `/inventory/batches` | Lot tracking |
| Serials | `/inventory/serials` | Unit tracking |
| Cycle Counts | `/inventory/cycle-counts` | Count sessions |
| Valuation | `/inventory/valuation` | Cost & value |
| Reports | `/inventory/reports` | Analytics |
| Settings | `/inventory/settings` | Rules & defaults |

Inventory appears as a **top-level sidebar module** — parallel to Catalog and Orders, not nested under Ecommerce.

---

## 4. Dashboard

**Route:** `/inventory`

### Purpose

Operational command center for warehouse and inventory managers — independent of Ecommerce dashboard.

### Widgets

| Widget | Data |
|--------|------|
| **Stock summary** | Total SKUs, total units, total value |
| **Low stock alerts** | Items below min_qty threshold |
| **Overstock alerts** | Items above max_qty |
| **In-transit transfers** | Pending receive count |
| **Open reservations** | Units held for orders |
| **Expiring batches** | Lots nearing expiry (30/60/90 days) |
| **Pending adjustments** | Awaiting approval |
| **Cycle count schedule** | Due counts this week |
| **AI forecast highlights** | Reorder suggestions, slow movers |

### Quick Actions

- New transfer · New adjustment · Start cycle count · Receive goods · Scan barcode

### Design

60% Odoo (KPI cards, smart buttons) · 20% Shopify (clean density) · 10% Notion · 10% Linear (status pills)

---

## 5. Products

**Route:** `/inventory/products` · `/inventory/products/[itemId]`

### Purpose

Inventory-centric view of **Product Master items** — not a duplicate product catalog.

### What Displays

| Column / Field | Source |
|----------------|--------|
| SKU, name, image | Product Master (read-only) |
| On-hand / reserved / available | `inventory_stock_levels` |
| Default warehouse | Inventory |
| Track batch/serial | Inventory item config |
| Reorder min/max | `inventory_reorder_rules` |
| Last movement | `inventory_movements` |

### Actions

- View stock by warehouse · Set reorder rules · Link/unlink `inventory_item_id` · Open Product Master (Catalog) in new context
- **Never** edit product name, description, or price here — redirect to Catalog

### Item Creation Flow

```text
Product Master variant created (Catalog)
     ↓
Event: product.variant.created
     ↓
Inventory creates inventory_items row (auto or manual policy)
     ↓
Initial stock via adjustment or purchase receipt
```

---

## 6. Stock

**Route:** `/inventory/stock` · `/inventory/stock/[itemId]`

### Core Model

| Concept | Definition |
|---------|------------|
| **Inventory Item** | Stock-tracked unit; 1:1 with Product Master variant |
| **Stock Level** | Quantities per item × warehouse × optional location |
| **Movement** | Immutable ledger row for every change |

### Quantity Formula

```text
qty_available = qty_on_hand - qty_reserved - qty_quarantined
qty_incoming  = sum(open purchase receipts + in-transit transfers)
```

### Stock Level Record

**Table:** `inventory_stock_levels`

| Field | Notes |
|-------|-------|
| `item_id` | FK → `inventory_items` |
| `warehouse_id` | FK → `inventory_warehouses` |
| `location_id` | FK → `inventory_locations` (optional) |
| `qty_on_hand` | Physical count |
| `qty_reserved` | Soft holds |
| `qty_quarantined` | QC hold, damaged segregated |
| `qty_incoming` | Expected inbound |

### Movement Ledger

**Table:** `inventory_movements` — append-only, partitioned by year

| `movement_type` | Trigger | Sign |
|-----------------|---------|------|
| `purchase_receipt` | Goods received | + |
| `sale` | Order/POS shipped | − |
| `return` | Customer return restock | + |
| `adjustment` | Manual correction | ± |
| `transfer_out` | Transfer ship | − |
| `transfer_in` | Transfer receive | + |
| `reservation_hold` | Order confirm | 0 (reservation) |
| `reservation_release` | Cancel / timeout | 0 |
| `manufacturing_consume` | BOM pick | − |
| `manufacturing_output` | Finished goods | + |
| `batch_split` | Lot re-pack | ± |
| `initial` | Onboarding | + |

Every movement: `item_id`, `warehouse_id`, `quantity`, `unit_cost`, `batch_id`, `serial_ids[]`, `reference_type`, `reference_id`, `reason_code`, `created_by`, `created_at`.

---

## 7. Warehouses

**Route:** `/inventory/warehouses` · `/inventory/warehouses/[id]`

**Table:** `inventory_warehouses`

| Field | Notes |
|-------|-------|
| `name` | Display name |
| `code` | Unique per company (e.g. `WH-DHK-01`) |
| `branch_id` | FK → Core branches |
| `address_id` | FK → Core addresses |
| `warehouse_type` | `physical`, `virtual`, `dropship`, `consignment`, `transit` |
| `is_default` | Default fulfillment warehouse |
| `is_active` | |
| `priority` | Allocation order for multi-warehouse pick |
| `timezone` | Cutoff times for same-day ship |

### Warehouse Types

| Type | Use Case |
|------|----------|
| Physical | Standard warehouse |
| Virtual | Accounting-only (dropship partner) |
| Dropship | Supplier ships direct — zero on-hand |
| Consignment | Supplier-owned stock at your location |
| Transit | In-flight between warehouses |

### Multi-Warehouse Rules

- Orders allocate from nearest warehouse with available stock (configurable)
- Transfers move stock between physical warehouses
- Each warehouse has independent stock levels and reorder rules

---

## 8. Locations

**Route:** `/inventory/warehouses/[id]/locations`

**Table:** `inventory_locations`

Hierarchical bin/shelf/zone structure within a warehouse.

```text
Warehouse: Dhaka Main
├── Zone: A (Fast movers)
│   ├── Aisle: A-01
│   │   ├── Rack: A-01-R3
│   │   │   ├── Bin: A-01-R3-B2
```

| Field | Notes |
|-------|-------|
| `warehouse_id` | FK |
| `parent_id` | Self-FK for tree |
| `code` | Scannable location code |
| `location_type` | `zone`, `aisle`, `rack`, `bin`, `floor` |
| `is_pickable` | Available for order allocation |
| `is_receivable` | Can receive goods |
| `capacity_units` | Optional max units |
| `temperature_zone` | Cold chain (restaurant, hospital) |

### Pick Path Optimization

Locations support pick sequence ordering for warehouse picker apps (future WMS mobile).

---

## 9. Transfers

**Route:** `/inventory/transfers` · `/inventory/transfers/[id]`

**Tables:** `inventory_transfers`, `inventory_transfer_items`

### Workflow

```text
Draft → Approved → In Transit → Received → Completed
                      ↓
            transfer_out (source warehouse)
            transfer_in  (destination warehouse)
```

| State | Description |
|-------|-------------|
| Draft | Lines added, not shipped |
| Approved | Manager approved (optional policy) |
| In Transit | Source deducted, destination not yet received |
| Received | Destination confirmed |
| Completed | Movements posted, closed |

### Fields

- Source/destination warehouse (and optional location)
- Batch/serial per line when tracked
- Expected arrival date
- Carrier / tracking reference
- Partial receive support

### Events

`inventory.transfer.shipped` · `inventory.transfer.received` · `inventory.transfer.completed`

---

## 10. Adjustments

**Route:** `/inventory/adjustments` · `/inventory/adjustments/[id]`

**Tables:** `inventory_adjustments`, `inventory_adjustment_items`

### Purpose

Correct stock discrepancies — damage, shrinkage, found stock, opening balances.

| `reason_code` | Use Case |
|---------------|----------|
| `cycle_count` | Physical count variance |
| `damage` | Write-off |
| `shrinkage` | Unexplained loss |
| `found` | Discovered stock |
| `opening_balance` | Initial load |
| `qc_reject` | Quality rejection |
| `expiry_write_off` | Batch expired |

### Approval

Adjustments above configurable value threshold require `inventory.adjustment.approve`. All adjustments write to Activity timeline and movement ledger.

---

## 11. Reservations

**Route:** `/inventory/reservations`

**Table:** `inventory_reservations`

### Purpose

Soft holds preventing oversell while orders are pending payment or awaiting fulfillment.

| Field | Notes |
|-------|-------|
| `item_id` | FK → `inventory_items` |
| `warehouse_id` | FK |
| `location_id` | Optional pick location |
| `order_id` | FK → Sales/Orders |
| `order_item_id` | FK → order line |
| `quantity` | Reserved qty |
| `batch_id` | Optional FEFO allocation |
| `status` | `active`, `fulfilled`, `released`, `expired` |
| `expires_at` | TTL for pending payments |

### Reservation Lifecycle

```text
Order confirmed  →  Reserve (+qty_reserved)
Payment failed   →  Release (-qty_reserved)
Shipped          →  Deduct (-qty_on_hand, release reservation)
Partial ship     →  Partial deduct + partial release
```

FIFO/FEFO allocation within warehouse. Expired reservations released by scheduled job `ReleaseExpiredReservations`.

### Channel Support

| Channel | Reservation trigger |
|---------|----------------------|
| Ecommerce checkout | On order confirm or payment capture (policy) |
| Sales quotation | On quote acceptance |
| POS | Short TTL hold during checkout |
| Manufacturing | Material reservation for work order |

---

## 12. Batches

**Route:** `/inventory/batches` · `/inventory/batches/[id]`

**Table:** `inventory_batches`

### Purpose

Lot/batch tracking for expiry, recall, and regulatory compliance (pharma, food, hospital).

| Field | Notes |
|-------|-------|
| `batch_number` | Unique per item (or global) |
| `item_id` | FK → `inventory_items` |
| `manufactured_at` | Production date |
| `expires_at` | Expiry date |
| `supplier_batch_ref` | Supplier lot reference |
| `qty_on_hand` | Current batch qty |
| `warehouse_id` / `location_id` | Where stored |
| `status` | `active`, `quarantined`, `recalled`, `expired` |

### Allocation Strategy

| Strategy | Industry |
|----------|----------|
| **FEFO** | Food, pharmacy (First Expired, First Out) |
| **FIFO** | General retail |
| **Manual** | Regulated recall hold |

Movements reference `batch_id`. Expiring batches trigger dashboard alerts and AI reorder/write-off suggestions.

---

## 13. Serials

**Route:** `/inventory/serials` · `/inventory/serials/[serial]`

**Table:** `inventory_serials`

### Purpose

Unit-level traceability for electronics, medical devices, high-value assets.

| Field | Notes |
|-------|-------|
| `serial_number` | Unique globally per company |
| `item_id` | FK → `inventory_items` |
| `batch_id` | Optional parent batch |
| `status` | `in_stock`, `reserved`, `sold`, `returned`, `scrapped` |
| `warehouse_id` / `location_id` | Current location |
| `order_id` | Sold-to order reference |
| `warranty_expires_at` | Warranty tracking |
| `notes` | Service history pointer |

### Serial Lifecycle

```text
Received (purchase receipt) → In Stock → Reserved → Sold → Returned → Scrapped
```

Serial-tracked items: qty always 0 or 1 per serial record. Movements attach `serial_ids[]`.

---

## 14. Cycle Counts

**Route:** `/inventory/cycle-counts` · `/inventory/cycle-counts/[id]`

**Tables:** `inventory_cycle_counts`, `inventory_cycle_count_lines`

### Purpose

Systematic physical inventory verification without full warehouse shutdown.

### Workflow

```text
Scheduled → In Progress → Counted → Variance Review → Adjustment Posted → Closed
```

| Feature | Description |
|---------|-------------|
| **ABC classification** | Count A items weekly, B monthly, C quarterly |
| **Blind count** | Counter does not see system qty |
| **Variance threshold** | Auto-flag above % or value |
| **Adjustment auto-create** | Approved variances → adjustment draft |
| **Mobile scan** | Barcode/location scan (future WMS app) |

Integrates with Adjustments (§10) and Activity (§18).

---

## 15. Valuation

**Route:** `/inventory/valuation`

### Purpose

Stock value reporting and COGS input for Accounting.

### Cost Methods

| Method | Code | Description |
|--------|------|-------------|
| **Weighted Average** | `avg` | Default — recalc on each receipt |
| **FIFO** | `fifo` | Layer-based consumption |
| **Standard Cost** | `standard` | Fixed cost + variance posting |
| **Specific Identification** | `specific` | Serial/batch unit cost |

**Table:** `inventory_cost_layers` (FIFO) · `inventory_item_costs` (avg/standard)

### Valuation Reports

| Report | Output |
|--------|--------|
| Stock valuation by warehouse | Total value, unit cost, qty |
| COGS by period | Movements × cost |
| Dead stock / aging | No movement in N days |
| Shrinkage summary | Adjustments by reason |
| Batch value at risk | Expiring inventory value |

Accounting module consumes valuation exports — Inventory does not post GL directly (future integration point).

---

## 16. Reports

**Route:** `/inventory/reports`

| Report | Description |
|--------|-------------|
| **Stock on Hand** | By warehouse, category, brand |
| **Movement History** | Filterable ledger export |
| **Reservation Report** | Active holds by channel |
| **Transfer Status** | In-transit pipeline |
| **Adjustment Summary** | By reason, approver |
| **Batch Expiry** | FEFO compliance |
| **Serial Traceability** | Unit history |
| **Cycle Count Accuracy** | Variance % over time |
| **Valuation** | See §15 |
| **Reorder Suggestions** | Below min_qty |
| **Turnover & Days on Hand** | Analytics KPIs |

Reports read from `inventory_*` and Product Master joins — never duplicate product dimensions.

---

## 17. Settings

**Route:** `/inventory/settings`

Integrates with [SETTINGS_ARCHITECTURE.md](../../02-core-platform/subsystems/SETTINGS_ARCHITECTURE.md) Workspace layer where appropriate.

### Inventory Settings Groups

| Group | Settings |
|-------|----------|
| **General** | Default warehouse, default cost method, reservation TTL |
| **Allocation** | Nearest warehouse rule, partial ship, backorder policy |
| **Tracking** | Enable batch, enable serial, FEFO/FIFO default |
| **Adjustments** | Approval threshold, reason codes, auto-adjust from cycle count |
| **Transfers** | Require approval, allow partial receive |
| **Alerts** | Low stock threshold default, expiry alert days |
| **Barcode** | Prefix rules, scan action defaults |
| **Integrations** | Purchase auto-receipt, POS deduct timing, Ecommerce availability cache TTL |

Settings changes tracked via Activity on `settings:inventory` entity.

---

## 18. Activity Integration

Every inventory record integrates [Activity & Chatter Architecture](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md).

### Entity Types

| Entity | Activity ID pattern |
|--------|---------------------|
| Inventory Item | `inventory:item:{id}` |
| Warehouse | `inventory:warehouse:{id}` |
| Transfer | `inventory:transfer:{id}` |
| Adjustment | `inventory:adjustment:{id}` |
| Batch | `inventory:batch:{id}` |
| Serial | `inventory:serial:{id}` |
| Cycle Count | `inventory:cycle_count:{id}` |

### Tracked Events

| Event | Activity Type |
|-------|---------------|
| Stock level change | `stock_change` |
| Movement posted | `movement` |
| Reservation created/released | `reservation` |
| Transfer state change | `status_change` |
| Adjustment approved | `approval_change` |
| Batch recalled | `status_change` |
| Serial status change | `update` |
| Cycle count variance | `update` |
| AI forecast applied | `ai_action` |

### UI Pattern

- **List pages** — Activity icon column → Global Activity Drawer
- **Detail pages** — Activity tab + inline movement history
- **Adjustments/Transfers** — Approval comments in chatter

---

## 19. AI Inventory Agent

### Role

**Inventory Agent** operates on Product Master + stock ledger data for forecasting, optimization, and anomaly detection.

### Capabilities

| Capability | Input | Output |
|------------|-------|--------|
| **Demand forecast** | Sales velocity, seasonality, promotions | Reorder qty suggestion |
| **Reorder optimization** | min/max rules, lead time, supplier data | Updated reorder points |
| **Slow mover detection** | Movement aging, margin | Markdown or write-off flag |
| **Overstock alert** | max_qty, forecast | Transfer or promo suggestion |
| **Expiry risk** | Batch expiry, velocity | FEFO priority, write-off draft |
| **Shrinkage anomaly** | Adjustment patterns | Fraud/error investigation flag |
| **Warehouse balancing** | Multi-warehouse levels | Transfer suggestion |
| **Cycle count prioritization** | ABC class, variance history | Count schedule ranking |

### AI Governance

1. Suggestions enter **review queue** — never auto-adjust stock without policy
2. All agent runs logged in Activity `AI Actions` tab
3. Tenant AI budget via Control Center
4. Hospital/regulated: batch recall suggestions require human approval

### Data Flow

```text
inventory_stock_levels + inventory_movements + Product Master
     ↓
AI Context Engine
     ↓
Inventory Agent
     ↓
Suggestion Queue (/inventory dashboard widget)
     ↓
Human approve → Adjustment / Transfer / Reorder draft
```

**Prototype reference:** [ui-prototype/ai-os/AiInventoryForecast.md](../../04-uiux/prototype/ai-os/AiInventoryForecast.md)

---

## 20. Permissions

Namespace: `inventory.*`

| Permission | Description |
|------------|-------------|
| `inventory.access` | Module access |
| `inventory.dashboard.view` | Dashboard |
| `inventory.item.read` | View items & stock |
| `inventory.item.write` | Create/link inventory items |
| `inventory.stock.read` | View levels |
| `inventory.stock.write` | Manual stock corrections (via adjustment) |
| `inventory.stock.reserve` | API reserve (Orders/POS service) |
| `inventory.warehouse.read` | View warehouses |
| `inventory.warehouse.write` | CRUD warehouses |
| `inventory.location.write` | Manage locations |
| `inventory.transfer.read` | View transfers |
| `inventory.transfer.write` | Create/ship transfers |
| `inventory.transfer.approve` | Approve transfers |
| `inventory.adjustment.read` | View adjustments |
| `inventory.adjustment.write` | Create adjustments |
| `inventory.adjustment.approve` | Approve large adjustments |
| `inventory.reservation.read` | View reservations |
| `inventory.reservation.release` | Manual release |
| `inventory.batch.read` | View batches |
| `inventory.batch.write` | Manage batches |
| `inventory.serial.read` | View serials |
| `inventory.serial.write` | Manage serials |
| `inventory.cycle_count.read` | View cycle counts |
| `inventory.cycle_count.write` | Execute counts |
| `inventory.valuation.read` | View valuation reports |
| `inventory.receipt.read` | View purchase receipts |
| `inventory.receipt.write` | Post receipts |
| `inventory.settings.edit` | Module settings |
| `inventory.export` | Export reports |
| `inventory.ai.apply` | Apply AI suggestions |

Row-level security: scoped by `company_id`, optional `branch_id`, optional `warehouse_id` for warehouse managers.

---

## 21. UI/UX Design

### Design Blend

| Weight | Source | Applied To |
|--------|--------|------------|
| **60%** | Odoo | Warehouse forms, movement ledger, approval bar, location tree |
| **20%** | Shopify | Stock list density, clean filters |
| **10%** | Notion | Settings, notes inline |
| **10%** | Linear | Status pills, keyboard shortcuts |

### Key Screens

#### Stock List (`/inventory/stock`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Stock (12,450 items)                    [Export] [Adjust] [Transfer]    │
├─────────────────────────────────────────────────────────────────────────┤
│ [Search SKU/name] [Warehouse▾] [Low stock] [Batch tracked] [Columns]    │
├─────────────────────────────────────────────────────────────────────────┤
│ AG Grid: SKU · Product · Warehouse · On Hand · Reserved · Available · ⋮│
└─────────────────────────────────────────────────────────────────────────┘
```

#### Warehouse + Locations (`/inventory/warehouses/[id]`)

- Left: location tree (zone → aisle → bin)
- Right: stock at selected location, capacity bar
- Actions: New location, move stock, start count

#### Transfer Detail (`/inventory/transfers/[id]`)

- Header: status pill, source → destination
- Lines: item, qty, batch/serial, received qty
- Timeline: Activity drawer entries
- Actions: Ship · Receive · Cancel

#### Dashboard (`/inventory`)

- KPI row: total value, low stock count, in-transit, expiring batches
- AI suggestions card (collapsible)
- Recent movements feed

### Mobile (Future WMS)

- Cycle count scan mode
- Pick list by location sequence
- Transfer receive confirmation

**Prototype stubs:** [ui-prototype/dashboard/InventoryAlerts.md](../../04-uiux/prototype/dashboard/InventoryAlerts.md) · [Menus/Inventory/](../ecommerce/Menus/Inventory/)

---

## 22. Future Compatibility

Inventory architecture supports all AgainERP industries through **configuration**, not schema forks.

| Industry | Inventory Features Used |
|----------|---------------------------|
| **Ecommerce** | Reservations, multi-warehouse allocation, availability API |
| **Sales / B2B** | Reservations on quote, bulk transfer, valuation |
| **Purchase** | Receipt posting, supplier batch ref, cost layers |
| **POS** | Real-time deduct, serial at sale, store-as-warehouse |
| **Manufacturing** | BOM consume movements, WIP location, finished goods receipt |
| **Hospital** | Batch/expiry (FEFO), serial for devices, quarantine locations |
| **Restaurant** | Batch for ingredients, expiry alerts, location = cold store |
| **Retail chain** | Multi-warehouse, cycle count ABC, transfer between stores |
| **Wholesale** | No Ecommerce required — full ops via Inventory + Sales |
| **Marketplace** | Vendor consignment warehouse type, split stock |

### Extension Rules

```text
✅ Enable batch/serial tracking per item
✅ Add industry-specific reason codes
✅ Add warehouse types (cold chain, quarantine)
✅ Subscribe to same Product Master + events

❌ hospital_inventory_items table
❌ restaurant_stock separate from inventory_stock_levels
❌ Ecommerce-only availability without Inventory module
```

---

## Architecture Rules

| # | Rule |
|---|------|
| 1 | **Independent module** — full UX at `/inventory/*`, not nested under Ecommerce |
| 2 | **One stock ledger** — `inventory_stock_levels` is quantity source of truth |
| 3 | **Product Master consumer** — identity via `inventory_item_id`, never duplicate products |
| 4 | **No qty on Catalog/Orders** — read via API or event-synced cache only |
| 5 | **Immutable movements** — every change posts to `inventory_movements` |
| 6 | **Activity enabled** — all stock operations auditable |
| 7 | **AI enabled** — Inventory Agent for forecast and optimization |
| 8 | **Approval enabled** — adjustments/transfers above threshold |
| 9 | **Event driven** — publish `inventory.*` events for all subscribers |
| 10 | **Multi-warehouse native** — not an afterthought |
| 11 | **Batch & serial optional** — per-item tracking policy |
| 12 | **API first** — all channels use `/api/v1/inventory/` |
| 13 | **Documentation before code** — [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) |

### Anti-Patterns (Forbidden)

```text
❌ catalog_products.qty_on_hand column
❌ commerce_orders storing authoritative stock
❌ Separate inventory module per industry
❌ Skipping movement ledger for "quick" adjustments
❌ Ecommerce admin as only inventory UI
```

---

## Appendix A — Database Tables (Planned)

| Table | Purpose |
|-------|---------|
| `inventory_items` | Stock item (links Product Master variant) |
| `inventory_warehouses` | Warehouse master |
| `inventory_locations` | Bin/zone hierarchy |
| `inventory_stock_levels` | On-hand / reserved per item × warehouse × location |
| `inventory_movements` | Immutable movement ledger |
| `inventory_reservations` | Order holds |
| `inventory_transfers` / `_transfer_items` | Inter-warehouse |
| `inventory_adjustments` / `_adjustment_items` | Corrections |
| `inventory_batches` | Lot tracking |
| `inventory_serials` | Unit tracking |
| `inventory_cycle_counts` / `_cycle_count_lines` | Physical counts |
| `inventory_cost_layers` | FIFO costing |
| `inventory_item_costs` | Avg/standard cost |
| `inventory_reorder_rules` | Min/max replenishment |
| `inventory_purchase_receipts` / `_receipt_items` | Inbound goods |
| `inventory_barcode_mappings` | Scan lookup |

**Reference:** [MASTER_DATABASE_ARCHITECTURE.md](../../05-development/database/MASTER_DATABASE_ARCHITECTURE.md) §7

---

## Appendix B — Domain Events

| Event | Subscribers |
|-------|-------------|
| `inventory.stock.updated` | Catalog cache, Orders, Dashboard, Ecommerce |
| `inventory.stock.low` | Notifications, Purchase, AI Agent |
| `inventory.reservation.created` | Orders timeline |
| `inventory.reservation.released` | Orders |
| `inventory.movement.created` | Reports, Accounting (future) |
| `inventory.transfer.completed` | Activity, Accounting |
| `inventory.adjustment.approved` | Activity, Valuation |
| `inventory.batch.expiring` | Dashboard, AI Agent |
| `inventory.serial.status_changed` | Warranty, Service (future) |
| `inventory.receipt.posted` | Purchase, Catalog cost sync |

---

## Appendix C — API Surface (Planned)

Base: `/api/v1/inventory/`

| Group | Endpoints |
|-------|-----------|
| Items | `GET/POST /items`, `GET /items/{id}/levels` |
| Stock | `GET /stock/availability`, `POST /stock/reserve`, `POST /stock/release`, `POST /stock/deduct` |
| Warehouses | `GET/POST /warehouses`, `GET/POST /warehouses/{id}/locations` |
| Transfers | `GET/POST /transfers`, `POST /transfers/{id}/ship`, `POST /transfers/{id}/receive` |
| Adjustments | `GET/POST /adjustments`, `POST /adjustments/{id}/approve` |
| Batches | `GET/POST /batches` |
| Serials | `GET/POST /serials`, `GET /serials/{serial}` |
| Cycle Counts | `GET/POST /cycle-counts`, `POST /cycle-counts/{id}/complete` |
| Valuation | `GET /valuation`, `GET /valuation/cogs` |
| Movements | `GET /movements` |
| Receipts | `GET/POST /receipts` |

Storefront read-only: `GET /api/v1/storefront/inventory/availability?variant_ids=…`

---

## Appendix D — Related Documents

| Document | Relationship |
|----------|--------------|
| [INVENTORY_WORKFLOW.md](./INVENTORY_WORKFLOW.md) | Workflow state machines — stock in/out, transfer, adjustment, reservation, batch, serial, cycle count |
| [PRODUCT_MASTER_ARCHITECTURE.md](../../02-core-platform/subsystems/PRODUCT_MASTER_ARCHITECTURE.md) | Product identity — Inventory consumes |
| [PURCHASE_MODULE_ARCHITECTURE.md](../purchase/PURCHASE_MODULE_ARCHITECTURE.md) | Goods receipt orchestration — Purchase posts, Inventory moves |
| [SALES_MODULE_ARCHITECTURE.md](../sales/SALES_MODULE_ARCHITECTURE.md) | Sales fulfillment — reserve on confirm, deduct on ship |
| [modules/ecommerce/catalog/ARCHITECTURE.md](../ecommerce/catalog/ARCHITECTURE.md) | Catalog UI for product master |
| [modules/ecommerce/inventory/ARCHITECTURE.md](../ecommerce/inventory/ARCHITECTURE.md) | Legacy ecommerce-scoped inventory doc |
| [modules/ecommerce/orders/ARCHITECTURE.md](../ecommerce/orders/ARCHITECTURE.md) | Reservation/deduct integration |
| [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) | Activity platform |
| [SETTINGS_ARCHITECTURE.md](../../02-core-platform/subsystems/SETTINGS_ARCHITECTURE.md) | Inventory settings |
| [MASTER_DATABASE_ARCHITECTURE.md](../../05-development/database/MASTER_DATABASE_ARCHITECTURE.md) | Database namespace |

---

## Document Control

| Field | Value |
|-------|-------|
| **Owner** | Platform Team · Inventory Domain |
| **Reviewers** | Architecture, Warehouse Ops, Purchase, AI |
| **Next Review** | At database implementation gate |
| **Status Gate** | Documentation First — Ready for UI/UX Planning |

**Changelog:** [CHANGELOG.md](../../00-foundation/CHANGELOG.md)
