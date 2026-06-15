# Notification Design

> **Status:** Draft  
> **Parent:** [UI_UX_DESIGN_STANDARDS.md](./UI_UX_DESIGN_STANDARDS.md)  
> **Core:** [NOTIFICATION_ENGINE_ARCHITECTURE.md](../core/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md) · [core/entities/notifications.md](../core/entities/notifications.md)

---

## Purpose

Unified **notification center** in header and full-page inbox. Covers operational alerts, mentions, approvals, and system messages.

---

## Notification Center (Header Dropdown)

```
┌─────────────────────────────────────┐
│ Notifications            Mark all read │
├─────────────────────────────────────┤
│ ● New order #1042 — ৳2,400          │
│   2 min ago                          │
│ ● @you mentioned on Product TSH-001 │
│   15 min ago                         │
│ ○ Low stock: Blue Widget (3 left)   │
│   1 hour ago                         │
├─────────────────────────────────────┤
│ View all notifications →             │
└─────────────────────────────────────┘
```

| State | Style |
|-------|-------|
| **Unread** | Bold title, blue dot, `--color-primary-subtle` background |
| **Read** | Normal weight, no dot |
| **Mentioned** | `@you` highlighted in accent color |

---

## Categories

| Category | Examples | Icon |
|----------|----------|------|
| **Orders** | New order, payment failed, refund requested | 🛒 |
| **Inventory** | Low stock, transfer complete, receipt posted | 📦 |
| **Approvals** | PO pending, discount approval, leave request | ✓ |
| **Marketing** | Campaign sent, coupon expiring | 📣 |
| **Mentions** | @you in comment or note | @ |
| **System** | Integration error, backup complete, maintenance | ⚙ |
| **AI** | Report ready, forecast complete | ✨ |

---

## Delivery Channels

| Channel | UI |
|---------|-----|
| In-app | Header bell + notification page |
| Email | Per user preferences |
| SMS | Critical alerts only |
| Push | Mobile app (future) |

User preferences: `notification_preferences` per category per channel.

---

## Full Page Inbox

Path: System → Notifications (or `/admin/notifications`)

| Feature | Spec |
|---------|------|
| Filters | Category, read/unread, date range |
| Bulk actions | Mark read, archive, delete |
| Priority | High priority pinned to top |
| Archive | Archived notifications hidden from default view |
| Deep link | Click opens related record |
| Pagination | 25 per page |

---

## Real-Time (Smart Notifications)

| Event | Delivery |
|-------|----------|
| New order | Instant |
| New review | Instant |
| Low stock | Instant |
| Approval pending | Instant |
| Support ticket | Instant |
| Marketing campaign | Instant |
| AI alert | Instant |

WebSocket (v2) or polling 5s (v1). Toast + badge update. See [UX_SMART_INTERACTION_STANDARDS.md](./UX_SMART_INTERACTION_STANDARDS.md) §16.

---

## Accessibility

- Badge count in `aria-label`: "3 unread notifications"
- Dropdown keyboard navigable
- `aria-live="polite"` for new notification toast
