# {Page Name}

> **Status:** Draft  
> **Prototype Phase:** 1 — UI Only  
> **Module:** {Module}  
> **Menu Location:** {Menu Path}  
> **Architecture Doc:** [link](../modules/ecommerce/...)  
> **UI Standards:** [ENTERPRISE_UI_ARCHITECTURE.md](../ui-ux/ENTERPRISE_UI_ARCHITECTURE.md)

---

## Purpose

_Why this page exists._

## Business Goal

- _Measurable outcome 1_
- _Measurable outcome 2_

## User Roles

| Role | Access | Notes |
|------|--------|-------|
| Admin | Full | |
| Manager | Read/Write | |
| Staff | Read | |

## Menu Location

`{Sidebar → Group → Item}`

## Breadcrumb

`AgainERP › {Module} › {Group} › {Page}`

## UI Layout

_Desktop + mobile. Reference [record-view](../ui-ux/record-view.md) or list pattern._

```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumb · Page Title · [Primary Action]                  │
├─────────────────────────────────────────────────────────────┤
│ Filters / Tabs                                              │
├─────────────────────────────────────────────────────────────┤
│ Main content                                                │
└─────────────────────────────────────────────────────────────┘
```

**Mobile:** _Describe bottom nav, sheet, card list._

## Components

| Component | Spec |
|-----------|------|
| Data table | [tables.md](../ui-ux/tables.md) |
| Filter panel | [live-filters.md](../ui-ux/live-filters.md) |
| Chatter panel | If record view |

## Fields

| Field | Type | Required | Prototype dummy |
|-------|------|----------|-----------------|
| | | | |

## Actions

| Action | Type | Permission | Prototype behavior |
|--------|------|------------|-------------------|
| | Button | | Mock toast / navigate |

## Filters

| Filter | Type | Mock behavior |
|--------|------|---------------|
| | | Instant client filter |

## Tables

| Column | Sort | Inline edit | Dummy source |
|--------|------|-------------|--------------|
| | | | `data/products.json` |

## Permissions

| Key | UI effect |
|-----|-----------|
| | Hide action if denied |

## Workflows

```
State1 → State2 → State3
```

_Visual status badges only in prototype._

## Related Pages

| Page | Link |
|------|------|
| | |

## AI Features

| Feature | UI placement | Mock response |
|---------|--------------|---------------|
| | | Canned from `data/ai-responses.json` |

## Reports

| Report | Link |
|--------|------|
| | |

## Future Enhancements

- 

## Prototype Notes

| Item | Detail |
|------|--------|
| Mock API | `/mock/api/...` |
| Fixture file | `data/....json` |
| Clickable routes | `/prototype/...` |

## Change History

| Date | Change | Author |
|------|--------|--------|
| | Created | |
