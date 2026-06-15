# Attachments

> **Status:** Draft · **Owner:** Core · **Table:** `attachments`

## Purpose

Links Media Library files to any record. Separates file storage (`media`) from file association (`attachments`) — one file can attach to multiple records if needed.

## Used By

All modules — Ecommerce products, Sales orders, HR employee docs, Accounting invoices.

## Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `company_id` | FK | Company scope |
| `media_id` | FK → media | File in media library |
| `attachable_type` | VARCHAR | Entity class |
| `attachable_id` | BIGINT | Entity ID |
| `collection` | VARCHAR | Group name (`gallery`, `documents`, `thumbnail`) |
| `sort_order` | INT | Display order |
| `title` | VARCHAR | Display title |
| `description` | TEXT | Optional description |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/core/attachments` | List (filter by entity) |
| POST | `/api/v1/core/attachments` | Attach media to record |
| PATCH | `/api/v1/core/attachments/{uuid}` | Update metadata / sort |
| DELETE | `/api/v1/core/attachments/{uuid}` | Detach (soft delete) |

### Attach Flow

```
1. POST /api/v1/core/media/upload          → returns media_id
2. POST /api/v1/core/attachments           → link to product
```

```json
POST /api/v1/core/attachments
{
  "media_id": "{media_uuid}",
  "attachable_type": "EcommerceProduct",
  "attachable_id": "{product_uuid}",
  "collection": "gallery",
  "sort_order": 1
}
```

## Ecommerce Usage

| Collection | Entity | Purpose |
|------------|--------|---------|
| `thumbnail` | EcommerceProduct | Main product image |
| `gallery` | EcommerceProduct | Additional images |
| `documents` | EcommerceOrder | Invoices, receipts |

## Permissions

| Key | Description |
|-----|-------------|
| `core.attachment.read` | View attachments |
| `core.attachment.write` | Attach files |
| `core.attachment.delete` | Detach files |

## vs Media Library

| Layer | Responsibility |
|-------|----------------|
| `media` | Store file bytes, metadata, versions |
| `attachments` | Link media to business records |
