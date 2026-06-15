# Tags

> **Status:** Draft · **Owner:** Core · **Tables:** `tags`, `taggables`

## Purpose

Polymorphic labeling system. Tag products, contacts, orders, or any record with shared, searchable labels.

## Used By

Ecommerce (product tags), CRM (lead tags), Sales, Marketing.

## Key Fields (`tags`)

| Field | Type | Description |
|-------|------|-------------|
| `company_id` | FK | Company scope |
| `name` | VARCHAR | Tag label |
| `slug` | VARCHAR | URL-safe slug |
| `color` | VARCHAR | Hex color for UI |
| `module` | VARCHAR | Optional module scope |

## Key Fields (`taggables` — pivot)

| Field | Type | Description |
|-------|------|-------------|
| `tag_id` | FK | Tag |
| `taggable_type` | VARCHAR | Entity class |
| `taggable_id` | BIGINT | Entity ID |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/core/tags` | List tags |
| POST | `/api/v1/core/tags` | Create tag |
| POST | `/api/v1/core/tags/attach` | Attach tag to entity |
| POST | `/api/v1/core/tags/detach` | Remove tag from entity |
| GET | `/api/v1/core/tags?taggable_type=EcommerceProduct` | Tags for entity type |

## Ecommerce Usage

```
POST /api/v1/core/tags/attach
{
  "tag_id": "{uuid}",
  "taggable_type": "EcommerceProduct",
  "taggable_id": "{product_uuid}"
}
```

## Permissions

| Key | Description |
|-----|-------------|
| `core.tag.read` | View tags |
| `core.tag.write` | Create / attach / detach |
