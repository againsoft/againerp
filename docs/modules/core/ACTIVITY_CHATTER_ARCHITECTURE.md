# Global Activity & Chatter Architecture

## Module

Core Platform

## Feature

Global Activity & Chatter System

## Status

Approved Architecture v1.0 — **Mandatory**

## Priority

Critical

---

## Objective

Create a unified activity and collaboration system across the entire AgainERP platform.

Every business object must support:

- Activity Logs
- Timeline
- Comments
- Mentions
- Notes
- Attachments
- AI Actions
- Approval History
- Audit Trail

The Activity & Chatter system is a **platform-level feature** and must be available in every module.

---

## Design Inspiration

| Weight | Source | What we borrow |
|---|---|---|
| 40% | Odoo Chatter | Timeline, notes, followers, field change logs |
| 30% | Salesforce Activity Timeline | Structured activity types, audit history |
| 20% | HubSpot Activity Feed | Comments, mentions, team collaboration |
| 10% | Linear Activity History | Clean minimal timeline UI |

---

## Core Principle

> Every record in AgainERP must have a timeline.

Supported entity types include: Products, Categories, Brands, Orders, Customers, Reviews, Inventory, Suppliers, Warehouses, Invoices, Payments, Shipments, Marketing Campaigns, AI Tasks, System Settings, Users, Roles, Permissions, Workflows.

---

## Global UI Pattern

Every list page must contain an **Activity** icon column.

When the user clicks the Activity icon → open the **Global Activity Drawer** (right drawer on desktop, full-width sheet on mobile).

### Drawer Title

**Activity & Chatter**

### Drawer Tabs

| Tab | Purpose |
|---|---|
| Overview | Entity summary + quick stats |
| Activities | Chronological activity timeline |
| Comments | Public/team comments with mentions |
| Notes | Internal-only notes |
| Attachments | Files, images, PDFs |
| Followers | Users following this record |
| AI Actions | Logged AI operations |
| History | Approval + audit trail |

---

## Activity Types

`create` · `update` · `delete` · `restore` · `status_change` · `assignment` · `comment` · `note` · `attachment` · `approval` · `rejection` · `ai_action` · `import` · `export` · `workflow` · `system` · `login` · `logout` · `api`

---

## Field Change Tracking

Every update activity may include:

| Field | Description |
|---|---|
| Field Name | Changed attribute |
| Old Value | Previous value |
| New Value | New value |
| Changed By | User who made the change |
| Changed At | Timestamp |
| Reason | Optional note |

---

## Activity Object Model

```
Entity Type + Entity ID
```

Examples: `product + prod_0001` · `order + ord_1001` · `customer + cust_001` · `review + rev_001`

---

## Database Strategy (Future)

Centralized activity engine tables:

- `activities`
- `activity_logs`
- `activity_comments`
- `activity_notes`
- `activity_attachments`
- `activity_followers`
- `activity_mentions`
- `activity_ai_actions`
- `activity_approvals`

---

## Frontend Implementation (Prototype)

| File | Role |
|---|---|
| `lib/activity/types.ts` | Shared entity + activity types |
| `lib/mock-data/activities.ts` | Seed data per entity |
| `lib/store/activity-store.ts` | Zustand store + drawer state |
| `components/activity/activity-drawer.tsx` | Global right drawer |
| `components/activity/activity-trigger-button.tsx` | List page activity icon |

Mounted globally via `AppProviders`.

---

## Platform Rule

Every module added in the future must automatically support:

1. Activity Timeline
2. Comments
3. Notes
4. Attachments
5. Followers
6. AI Actions
7. Approval History

**No module may be created without Activity & Chatter integration.**

---

## Final Rule

> Activity & Chatter is a **Core Platform Service**.
> It is not a module — it is a mandatory layer used by every module, page, workflow, and business object throughout AgainERP.
