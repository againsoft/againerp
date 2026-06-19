# Architecture — Logistics

## Purpose
Logistics module architecture — scope, features, data ownership, and integration boundaries.

## When To Read
Read this file only if working on Logistics architecture, features, or module boundaries.

## Related Files
- [Dependencies](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next
- [Architecture](Architecture.md)

---

> **Status:** Draft  
> **Module:** Logistics  
> **Document Type:** Architecture  
> **Phase:** 8 (Step 76)

---


## When To Read
Read this file only if working on Logistics architecture, features, or module boundaries.

## Related Files
- [Dependencies](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next
- [Architecture](Architecture.md)

---

## Purpose

Orchestrate physical fulfillment: warehouse management, pick-pack-ship, carrier integration, delivery scheduling, route optimization, and proof of delivery. Bridges Sales/Ecommerce orders to Inventory movements and customer notifications.

## Business Goals

- Fulfill orders accurately with minimal handling time
- Optimize shipping costs via carrier rate shopping
- Support multi-warehouse and cross-dock operations
- Provide end-to-end shipment visibility for customers and staff

## Core Concepts

| Concept | Description |
|---------|-------------|
| Warehouse | Physical location with zones, bins, capacity |
| Pick List | Items to collect for orders |
| Shipment | Package(s) with carrier and tracking |
| Delivery Route | Sequence of stops for own-fleet delivery |
| Proof of Delivery | Signature, photo, GPS timestamp |

## Fulfillment Flow

```
Sales Order Confirmed
        │
        ▼
Allocation (warehouse selection)
        │
        ▼
Pick → Pack → Ship / Dispatch
        │
        ├── Carrier label (3PL API)
        └── Own fleet route (Fleet module)
        │
        ▼
Delivered → Inventory deducted → Customer notified
```

Partial shipments and backorders supported. Returns reverse the flow via RMA workflow.

## Warehouse Management

| Feature | Description |
|---------|-------------|
| Bin locations | Aisle-rack-bin hierarchy |
| Wave picking | Batch orders by priority/cutoff |
| Barcode scanning | Pick verification, pack confirm |
| Cycle counts | Inventory accuracy program |

Integrates with Inventory for stock levels and adjustments.

## Carrier Integration

| Capability | Notes |
|------------|-------|
| Rate shopping | Compare carriers by service level |
| Label generation | PDF/ZPL labels |
| Tracking webhooks | Status updates to orders |
| Customs | International shipment docs |

Carrier credentials in `logistics_carriers` (encrypted). Marketplace dropship orders may bypass internal WMS.

## Route Optimization

For own-delivery model: assign stops to Fleet vehicles considering capacity, time windows, and traffic (optional external API). Dispatcher dashboard for real-time adjustments.

## User Roles

| Role | Access |
|------|--------|
| Logistics Manager | Warehouses, carriers, routes |
| Warehouse Staff | Pick, pack, receive |
| Dispatcher | Routes, fleet assignment |
| Customer | Tracking portal (read-only) |

Permission namespace: `logistics.*`

## Database Tables

Prefix: `logistics_*`

| Table | Purpose |
|-------|---------|
| `logistics_warehouses` | Warehouse definitions |
| `logistics_zones` | Warehouse zones |
| `logistics_bins` | Storage locations |
| `logistics_pick_lists` | Pick batches |
| `logistics_pick_lines` | Line items to pick |
| `logistics_shipments` | Shipment headers |
| `logistics_packages` | Individual packages |
| `logistics_carriers` | Carrier config |
| `logistics_tracking_events` | Status history |
| `logistics_routes` | Delivery routes |
| `logistics_route_stops` | Stops per route |
| `logistics_proof_of_delivery` | POD records |

## API Endpoints

Base path: `/api/v1/logistics/` — shipments, tracking, warehouse operations, carrier webhooks.

## Events

| Event | Subscribers |
|-------|-------------|
| `logistics.shipment.dispatched` | Notification, Ecommerce |
| `logistics.shipment.delivered` | Sales, Accounting (COGS) |
| `logistics.pick.completed` | Inventory |

## Dependencies

- **Core:** Branches, Addresses, Queue, Notification
- **Modules:** Inventory, Sales, Ecommerce, Fleet, Marketplace

## Future Enhancements

- Robotics/WMS hardware integration
- Cold chain temperature monitoring
- Cross-border compliance automation

---

**Module:** Logistics  
**Last Updated:** 2026-06-12
