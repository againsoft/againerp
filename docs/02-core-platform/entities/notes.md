# Notes

> **Status:** Draft · **Owner:** Core · **Table:** `notes`

## Purpose
Core entity specification: `notes`.

## When To Read
Read only when working on the shared `notes` entity — not module-owned duplicates.

## Related Files
- [Entities index](README.md)
- [Core hub](../ARCHITECTURE.md)

## Read Next
- [All entities](README.md)

---

## Purpose

Internal notes on any record. Staff-only annotations — not customer-facing comments.

## Used By

Ecommerce (order notes), CRM, Sales, Purchase, HR, Accounting.

## Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `company_id` | FK | Company scope |
| `notable_type` | VARCHAR | Entity class |
| `notable_id` | BIGINT | Entity ID |
| `body` | TEXT | Note content |
| `is_pinned` | BOOLEAN | Pin to top of timeline |
| `visibility` | ENUM | `internal`, `team`, `private` |

Plus standard audit columns (`created_by` = author).

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/core/notes` | List (filter by entity) |
| POST | `/api/v1/core/notes` | Create note |
| PATCH | `/api/v1/core/notes/{uuid}` | Update |
| DELETE | `/api/v1/core/notes/{uuid}` | Soft delete |

## Ecommerce Usage

Order detail page shows notes timeline:

```
notable_type: EcommerceOrder
notable_id: {order_id}
```

## Permissions

| Key | Description |
|-----|-------------|
| `core.note.read` | View notes |
| `core.note.write` | Create / edit own notes |
| `core.note.delete` | Delete notes |

## vs Comments

| Feature | Notes | Comments |
|---------|-------|----------|
| Audience | Internal staff | May be customer-facing |
| Threading | Flat list | Threaded replies |
| Use case | Internal memo | Discussion |
