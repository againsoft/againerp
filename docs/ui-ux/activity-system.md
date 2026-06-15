# Activity System (Chatter)

> **Status:** Draft  
> **Parent:** [UI_UX_DESIGN_STANDARDS.md](./UI_UX_DESIGN_STANDARDS.md)  
> **Core entities:** [core/entities/activities.md](../core/entities/activities.md) · [comments.md](../core/entities/comments.md) · [notes.md](../core/entities/notes.md)

---

## Purpose

**Odoo Chatter-inspired** collaboration panel on every record. Unified activities, notes, comments, attachments, followers, and timeline.

---

## Capabilities

| Feature | Description |
|---------|-------------|
| **Activities** | Schedule call, meeting, to-do, email follow-up |
| **Comments** | Threaded, @mention users |
| **Notes** | Internal-only annotations |
| **Mentions** | `@username` triggers notification |
| **Attachments** | Drag-drop files to record |
| **Followers** | Users auto-notified on changes |
| **Timeline** | Merged feed: edits, status, comments, system events |

---

## UI Placement

| Viewport | Placement |
|----------|-----------|
| Desktop ≥ 1280px | Right utility panel, 320px |
| Desktop < 1280px | Collapsible panel or FAB |
| Mobile | Bottom sheet, full height |

**Entry points:** Record view panel · Header activity counter · Global activity inbox.

---

## Timeline Feed

Chronological, newest first (toggle to oldest).

| Event Type | Icon | Example |
|------------|------|---------|
| Status change | ↻ | "Status changed: Draft → Published" |
| Field edit | ✎ | "Price changed: ৳499 → ৳599" |
| Comment | 💬 | "@sara Please review pricing" |
| Note | 📝 | Internal note added |
| Activity | 📅 | "Call scheduled for Jun 15" |
| Attachment | 📎 | "invoice.pdf attached" |
| System | ⚙ | "Stock reserved: 5 units" |

---

## Activity Types

| Type | Fields |
|------|--------|
| To-do | Due date, assigned to, summary |
| Call | Due date, phone, summary |
| Meeting | Date/time, attendees, location |
| Email | Due date, template link |
| Custom | Module-defined |
| Approval | Links to Core approval engine |

**Actions:** Mark done · Reschedule · Cancel · Reassign

**Surfaces:** Dashboard widget · Record chatter · **Calendar view** · Notifications

---

## Composer

Single input at bottom of chatter:

```
┌─────────────────────────────────────────┐
│ Log a note · Send message · Schedule    │
│ activity                                │
├─────────────────────────────────────────┤
│ [Write a message…]              [Send]  │
│ 📎 Attach  @ Mention  😀 (optional)     │
└─────────────────────────────────────────┘
```

| Mode | Visibility |
|------|------------|
| **Log note** | Internal staff only |
| **Send message** | Visible to portal users if enabled |
| **Schedule activity** | Opens activity form |

---

## Followers

| Rule | Detail |
|------|--------|
| Auto-follow | Creator and assignee follow by default |
| Manual | Add/remove followers via panel header |
| Notification | Followers receive comment and activity events |

---

## Permissions

| Action | Permission pattern |
|--------|-------------------|
| View chatter | `{module}.{entity}.read` |
| Add note | `{module}.{entity}.write` |
| Add comment | `{module}.{entity}.comment` |
| Schedule activity | `core.activity.write` |
| View internal notes | Staff roles only |

---

## API

Chatter data via Core APIs — modules never build custom chatter tables.

`GET /api/v1/core/records/{type}/{id}/timeline`  
`POST /api/v1/core/activities`  
`POST /api/v1/core/comments`  
`POST /api/v1/core/notes`
