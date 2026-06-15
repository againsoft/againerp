# Addresses

> **Status:** Draft · **Owner:** Core · **Table:** `addresses`

## Purpose

Polymorphic address storage. Any record — contact, company, branch, order — can have one or more addresses without module-specific address tables.

## Used By

Ecommerce (shipping/billing), CRM, Sales, Purchase, HR, Companies, Branches.

## Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `company_id` | FK | Company scope |
| `addressable_type` | VARCHAR | Entity class (`Contact`, `EcommerceOrder`, …) |
| `addressable_id` | BIGINT | Entity ID |
| `type` | ENUM | `billing`, `shipping`, `office`, `home`, `other` |
| `label` | VARCHAR | Custom label ("Home", "Warehouse") |
| `name` | VARCHAR | Recipient name |
| `phone` | VARCHAR | Contact phone |
| `address_line_1` | VARCHAR | Street address |
| `address_line_2` | VARCHAR | Apt, suite |
| `city` | VARCHAR | City |
| `state` | VARCHAR | State / division |
| `postal_code` | VARCHAR | ZIP / postal code |
| `country_code` | CHAR(2) | ISO country (`BD`, `US`) |
| `latitude` | DECIMAL | Geo (optional) |
| `longitude` | DECIMAL | Geo (optional) |
| `is_default` | BOOLEAN | Default for type |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/core/addresses` | List (filter by entity) |
| POST | `/api/v1/core/addresses` | Create address |
| PATCH | `/api/v1/core/addresses/{uuid}` | Update |
| DELETE | `/api/v1/core/addresses/{uuid}` | Soft delete |

### Polymorphic Create Example

```json
POST /api/v1/core/addresses
{
  "addressable_type": "EcommerceOrder",
  "addressable_id": "{order_uuid}",
  "type": "shipping",
  "address_line_1": "...",
  "city": "Dhaka",
  "country_code": "BD"
}
```

## Ecommerce Usage

| Context | addressable_type |
|---------|------------------|
| Customer saved address | `Contact` |
| Order shipping | `EcommerceOrder` |
| Order billing | `EcommerceOrder` |

## Permissions

| Key | Description |
|-----|-------------|
| `core.address.read` | View addresses |
| `core.address.write` | Create / edit addresses |
