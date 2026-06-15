# Architecture — Booking

> **Status:** Draft  
> **Module:** Booking  
> **Document Type:** Architecture  
> **Phase:** 8 (Step 77)

---

## Purpose

Manage time-based services and resource reservations: staff calendars, rooms/equipment, online booking widgets, reminders, and payment deposits. Converts appointments into Sales orders and CRM activities.

## Business Goals

- Reduce no-shows via automated reminders
- Maximize resource utilization with availability rules
- Enable customer self-service booking on Website/Ecommerce
- Link appointments to revenue and staff performance

## Core Concepts

| Concept | Description |
|---------|-------------|
| Service | Bookable offering with duration, price, buffer |
| Resource | Staff, room, equipment, or vehicle slot |
| Availability | Working hours, breaks, blackout dates |
| Appointment | Confirmed booking with status lifecycle |
| Waitlist | Queue when slots are full |

## Booking Flow

```
Customer selects service + slot
        │
        ▼
Availability check (resource rules)
        │
        ▼
Hold slot (optional TTL) → Confirm → Appointment Created
        │
        ├── Deposit payment (Sales)
        ├── CRM activity
        └── Reminders (email/SMS)
```

Staff can create internal bookings with override permissions.

## Availability Engine

| Rule Type | Example |
|-----------|---------|
| Working hours | Mon–Fri 9–17 per resource |
| Capacity | Room fits 10, class booking |
| Lead time | Minimum 2 hours advance |
| Buffer | 15 min between appointments |
| Recurring block | Lunch, maintenance |

Conflicts prevented at database level with optimistic locking on slot ranges.

## Online Booking

Embeddable widget and Ecommerce product type `bookable_service`. Customer portal shows upcoming appointments, reschedule, cancel per policy.

Cancellation policy: free window, fee rules, credit to wallet.

## User Roles

| Role | Access |
|------|--------|
| Booking Admin | Services, resources, policies |
| Scheduler | Full calendar, overrides |
| Staff | Own calendar, check-in clients |
| Customer | Self-service portal |

Permission namespace: `booking.*`

## Database Tables

Prefix: `booking_*`

| Table | Purpose |
|-------|---------|
| `booking_services` | Service definitions |
| `booking_resources` | Bookable resources |
| `booking_resource_services` | Resource-service mapping |
| `booking_availability_rules` | Schedule rules |
| `booking_appointments` | Appointment records |
| `booking_appointment_attendees` | Multi-attendee events |
| `booking_waitlist` | Waitlist entries |
| `booking_reminders` | Scheduled notifications |
| `booking_policies` | Cancel/reschedule rules |

## API Endpoints

Base path: `/api/v1/booking/` — availability query, book, reschedule, cancel, staff calendar.

Public endpoints rate-limited for widget use.

## Events

| Event | Subscribers |
|-------|-------------|
| `booking.appointment.confirmed` | Sales, CRM, Notification |
| `booking.appointment.reminder` | Notification |
| `booking.appointment.completed` | Sales (final invoice), CRM |
| `booking.no_show` | CRM follow-up |

## Dependencies

- **Core:** Contacts, Users, Activities, Notification, Settings
- **Modules:** CRM, Sales, Ecommerce, Website, HR, Subscription

## Future Enhancements

- Group classes and series bookings
- Video meeting link generation
- AI optimal slot suggestions (Phase 6)

---

**Module:** Booking  
**Last Updated:** 2026-06-12
