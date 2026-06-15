# Product List

> **Status:** Draft  
> **Module:** Ecommerce  
> **Menu Path:** Ecommerce → Catalog → Products → Product List  
> **Architecture:** [catalog/ARCHITECTURE.md](../../../catalog/ARCHITECTURE.md)

---

## Purpose

Primary admin grid for all catalog products (simple, variable, digital, bundle, etc.). Supports search, filters, bulk actions, lifecycle status, and navigation to add/edit/import flows. Must perform at 1M+ products via cursor pagination and indexed queries.

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

_Describe sections, tabs, sidebar, table columns, filters, and empty states._

```
┌─────────────────────────────────────────┐
│ Header / Breadcrumb / Actions             │
├─────────────────────────────────────────┤
│ Filters / Search                          │
├─────────────────────────────────────────┤
│ Main Content Area                         │
└─────────────────────────────────────────┘
```

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
| `ecommerce.{resource}.read` | View records |
| `ecommerce.{resource}.write` | Create and edit |
| `ecommerce.{resource}.delete` | Delete records |

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
- **Pages:** _[Related Page](./path.md)_

---

**Module:** Ecommerce  
**Last Updated:** —  
**Author:** —  
**Reviewers:** —
