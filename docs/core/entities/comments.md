# Comments

> **Status:** Draft · **Owner:** Core · **Table:** `comments`

## Purpose

Threaded discussion on records. Supports replies, mentions, and moderation — used where conversation is needed (not internal memos — use Notes).

## Used By

Ecommerce (review replies, order discussion), CRM, Sales, Project, Helpdesk.

## Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `company_id` | FK | Company scope |
| `commentable_type` | VARCHAR | Entity class |
| `commentable_id` | BIGINT | Entity ID |
| `parent_id` | FK → comments | Reply thread (null = top-level) |
| `body` | TEXT | Comment content |
| `author_type` | VARCHAR | `User` or `Contact` |
| `author_id` | BIGINT | Author ID |
| `is_internal` | BOOLEAN | Staff-only visibility |
| `is_approved` | BOOLEAN | Moderation flag |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/core/comments` | List (filter by entity) |
| POST | `/api/v1/core/comments` | Create comment |
| PATCH | `/api/v1/core/comments/{uuid}` | Edit |
| DELETE | `/api/v1/core/comments/{uuid}` | Soft delete |
| POST | `/api/v1/core/comments/{uuid}/approve` | Approve (moderation) |

## Ecommerce Usage

| Feature | commentable_type |
|---------|------------------|
| Review merchant reply | `EcommerceReview` |
| Order customer message | `EcommerceOrder` |

Product reviews may use dedicated `ecommerce_reviews` with `comments` for admin replies.

## Permissions

| Key | Description |
|-----|-------------|
| `core.comment.read` | View comments |
| `core.comment.write` | Post comments |
| `core.comment.moderate` | Approve / hide comments |
| `core.comment.delete` | Delete any comment |
