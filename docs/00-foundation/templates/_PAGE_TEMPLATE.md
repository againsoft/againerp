# {Page Title}

> **Status:** Draft  
> **Module:** {Module Name}  
> **Menu Path:** {Module} → {Menu} → {Submenu}

---

## Purpose
Documentation:  PAGE TEMPLATE.

## When To Read
Read only if your task involves  page template.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## Purpose

_Describe why this page exists and what problem it solves._

## Business Goals

- _Goal 1_
- _Goal 2_

## User Roles

| Role | Access Level | Notes |
|------|--------------|-------|
| _Admin_ | Full | _—_ |
| _Manager_ | Read/Write | _—_ |
| _Staff_ | Read only | _—_ |

## Page Layout

_Describe sections, tabs, sidebar, table columns, filters, and empty states. Follow [ui-ux/ENTERPRISE_UI_ARCHITECTURE.md](../../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md)._

**List view:**
```
┌─────────────────────────────────────────┐
│ Header / Breadcrumb / Actions             │
├─────────────────────────────────────────┤
│ Filters / Search                          │
├─────────────────────────────────────────┤
│ Main Content Area (table or cards)        │
└─────────────────────────────────────────┘
```

**Record view:** Include tabs + Chatter panel per [ui-ux/record-view.md](../../04-uiux/standards/record-view.md). Document mobile behavior per [ui-ux/mobile-first.md](../../04-uiux/standards/mobile-first.md).

## Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| _—_ | _—_ | _—_ | _—_ | _—_ |

## Actions

| Action | Type | Permission | Result |
|--------|------|------------|--------|
| _—_ | _Button_ | _—_ | _—_ |

## Validation Rules

- _Rule 1_
- _Rule 2_

## Workflow

_Describe state transitions and triggers._

```
Draft → Submitted → Approved → Completed
```

## Permissions

| Permission Key | Description |
|----------------|-------------|
| `{module}.{resource}.read` | View records |
| `{module}.{resource}.write` | Create and edit |
| `{module}.{resource}.delete` | Delete records |

## Database Tables

| Table | Usage |
|-------|-------|
| _—_ | _—_ |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| _GET_ | `/api/v1/...` | _—_ |

## Reports Impact

- _Report name — how this page affects it_

## Future Enhancements

- _Enhancement 1_

## Dependencies

- **Core:** _User Management, Permissions, …_
- **Modules:** _Inventory, Sales, …_
- **Pages:** _[Related Page](./#)_

---

**Module:** {Module Name}  
**Last Updated:** —  
**Author:** —  
**Reviewers:** —
