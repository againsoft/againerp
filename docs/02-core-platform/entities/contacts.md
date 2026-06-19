# Contacts

> **Status:** Draft · **Owner:** Core · **Table:** `contacts`

## Purpose
Core entity specification: `contacts`.

## When To Read
Read only when working on the shared `contacts` entity — not module-owned duplicates.

## Related Files
- [Entities index](README.md)
- [Core hub](../ARCHITECTURE.md)

## Read Next
- [All entities](README.md)

---

## Purpose

Unified person and organization records. One contact can be a customer, vendor, lead, or employee depending on module context — no duplicate customer tables per module.

## Used By

| Module | Contact Type | Usage |
|--------|--------------|-------|
| Ecommerce | `customer` | Store customers, checkout |
| CRM | `lead`, `contact` | Pipeline, relationships |
| Sales | `customer` | Quotations, orders |
| Purchase | `vendor` | Purchase orders |
| HR | `employee` | Employee records |
| Accounting | `customer`, `vendor` | Invoices, payments |

## Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `company_id` | FK | Company scope |
| `type` | ENUM | `person`, `organization` |
| `contact_types` | JSON/ARRAY | `customer`, `vendor`, `lead`, `employee` |
| `name` | VARCHAR | Full name or org name |
| `first_name` | VARCHAR | Person first name |
| `last_name` | VARCHAR | Person last name |
| `email` | VARCHAR | Primary email |
| `phone` | VARCHAR | Primary phone |
| `mobile` | VARCHAR | Mobile number |
| `tax_id` | VARCHAR | Tax / VAT number |
| `website` | VARCHAR | URL |
| `avatar_media_id` | FK → media | Photo / logo |
| `parent_contact_id` | FK | Org hierarchy (optional) |
| `is_active` | BOOLEAN | Active flag |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/core/contacts` | List (filter by type) |
| POST | `/api/v1/core/contacts` | Create contact |
| GET | `/api/v1/core/contacts/{uuid}` | Get contact |
| PATCH | `/api/v1/core/contacts/{uuid}` | Update |
| DELETE | `/api/v1/core/contacts/{uuid}` | Soft delete |
| GET | `/api/v1/core/contacts/{uuid}/addresses` | Contact addresses |

## Relationships

- Has many: `addresses`, `notes`, `activities`, `tags`, `attachments`
- Referenced by: `ecommerce_orders.contact_id`, `sales_orders.contact_id`, `users.contact_id`

## Ecommerce Rule

```
✓  ecommerce_orders.contact_id → contacts.id
✗  ecommerce_customers table with duplicate email/name
```

Storefront registration creates a Core contact with `contact_types: ['customer']`.

## Permissions

| Key | Description |
|-----|-------------|
| `core.contact.read` | View contacts |
| `core.contact.write` | Create / edit contacts |
| `core.contact.delete` | Delete contacts |
| `core.contact.export` | Export contact list |
