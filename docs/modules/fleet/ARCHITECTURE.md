# Architecture — Fleet

> **Status:** Draft  
> **Module:** Fleet  
> **Document Type:** Architecture  
> **Phase:** 8 (Step 75)

---

## Purpose

Manage company vehicles and mobile assets: lifecycle from acquisition to disposal, driver assignment, maintenance schedules, fuel/expense tracking, GPS integration, and regulatory compliance.

## Business Goals

- Centralize fleet data linked to Logistics deliveries
- Reduce downtime via preventive maintenance alerts
- Control fuel and operating costs with expense attribution
- Ensure compliance (licenses, inspections, insurance expiry)

## Core Concepts

| Concept | Description |
|---------|-------------|
| Vehicle | Asset record: make, model, VIN, plate, status |
| Driver | Employee or contractor with license validation |
| Trip | Journey log with odometer, route, purpose |
| Maintenance | Scheduled and corrective service records |
| Fuel Log | Fill-ups with cost and consumption metrics |

## Vehicle Lifecycle

```
Ordered → Active → In Maintenance → Reserved → Retired / Sold
```

Status affects availability for Logistics route assignment.

## Maintenance Management

| Type | Trigger |
|------|---------|
| Preventive | Mileage or calendar interval |
| Corrective | Breakdown report |
| Inspection | Regulatory due dates |

Work orders link to vendor (Purchase) or internal maintenance team. Costs post to Accounting by cost center.

## GPS & Telematics

Optional integration with third-party GPS providers via API webhooks.

| Data | Use |
|------|-----|
| Live location | Dispatch dashboard (Logistics) |
| Idle time | Cost and efficiency reports |
| Geofence | Delivery proof, unauthorized use alerts |

Telematics data stored in `fleet_telemetry_logs` with retention policy.

## Driver Management

- License class, expiry, violations
- Assignment history per vehicle
- Trip authorization workflow for pool vehicles
- Integration with HR for employee records

## User Roles

| Role | Access |
|------|--------|
| Fleet Manager | Full module, assignments, reports |
| Dispatcher | Vehicle availability, trip assignment |
| Driver | Mobile trip log, fuel entry |
| Accountant | Cost reports, depreciation |

Permission namespace: `fleet.*`

## Database Tables

Prefix: `fleet_*`

| Table | Purpose |
|-------|---------|
| `fleet_vehicles` | Vehicle master |
| `fleet_vehicle_documents` | Registration, insurance |
| `fleet_drivers` | Driver profiles |
| `fleet_assignments` | Driver-vehicle mapping |
| `fleet_trips` | Trip records |
| `fleet_fuel_logs` | Fuel transactions |
| `fleet_maintenance_schedules` | PM schedules |
| `fleet_maintenance_records` | Service history |
| `fleet_telemetry_logs` | GPS/telematics data |
| `fleet_expenses` | Operating costs |

## API Endpoints

Base path: `/api/v1/fleet/` — vehicles, trips, maintenance, mobile driver app.

## Events

| Event | Subscribers |
|-------|-------------|
| `fleet.maintenance.due` | Notification |
| `fleet.document.expiring` | Notification, Compliance |
| `fleet.trip.completed` | Logistics, Accounting |

## Dependencies

- **Core:** Contacts, Users, Attachments, Workflow
- **Modules:** Logistics, HR, Accounting, Purchase

## Future Enhancements

- EV charging station integration
- Carbon footprint reporting
- Predictive maintenance via AI (Phase 6)

---

**Module:** Fleet  
**Last Updated:** 2026-06-12
