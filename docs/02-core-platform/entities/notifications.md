# Notifications Entity

> **Status:** Approved (entity spec)  
> **Owner:** Core · **Tables:** `notifications`, `notification_*`  
> **Canonical architecture:** [NOTIFICATION_ENGINE_ARCHITECTURE.md](../engines/NOTIFICATION_ENGINE_ARCHITECTURE.md) — platform notification engine (Step 17)

## Purpose
Core entity specification: `notifications`.

## When To Read
Read only when working on the shared `notifications` entity — not module-owned duplicates.

## Related Files
- [Entities index](README.md)
- [Core hub](../ARCHITECTURE.md)

## Read Next
- [All entities](README.md)

---

## Purpose

Deliver in-app, email, SMS, push, WhatsApp, Telegram, and Slack alerts triggered by system events and user actions. Modules emit requests; Core Notification Engine delivers.

**Full specification:** [NOTIFICATION_ENGINE_ARCHITECTURE.md](../engines/NOTIFICATION_ENGINE_ARCHITECTURE.md)

## Tables

| Table | Purpose |
|-------|---------|
| `notifications` | In-app inbox records |
| `notification_templates` | Channel templates |
| `notification_rules` | Event → channel mapping |
| `notification_deliveries` | Delivery status per channel |
| `notification_preferences` | User opt-in/out |
| `notification_channel_configs` | Provider config |

## Fields (notifications)

| Field | Type | Notes |
|-------|------|-------|
| `user_id` | FK | Recipient |
| `type` | string | `approval.purchase.order.pending` |
| `title` | string | Display title |
| `body` | text | Message body |
| `data` | jsonb | Deep link payload |
| `read_at` | timestamp | Null = unread |
| `priority` | enum | low, medium, high, critical |

## Events

Subscribes to domain events via [EVENT_ARCHITECTURE.md](../engines/EVENT_ARCHITECTURE.md). Delivery async on notification queue.

## API

`GET /api/v1/core/notifications` · `PATCH /api/v1/core/notifications/{id}/read`
