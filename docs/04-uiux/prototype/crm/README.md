# CRM Module — UI Prototype Index

## Purpose
Documentation: README.

## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../../BRAIN.md)

## Read Next
- [Doc map](../../../PROJECT_MAP.md)

---

> **Status:** Planned  
> **Architecture:** [CRM_MODULE_ARCHITECTURE.md](../../../03-business-modules/crm/CRM_MODULE_ARCHITECTURE.md)  
> **Route namespace:** `/crm/*`

---


## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../../BRAIN.md)

## Read Next
- [Doc map](../../../PROJECT_MAP.md)

---

## Screens (Planned)

| Screen | Route | Reference |
|--------|-------|-----------|
| Dashboard | `/crm/dashboard` | KPI cards, charts, AI widgets |
| Leads | `/crm/leads` | [CRM_MODULE §4](../../../03-business-modules/crm/CRM_MODULE_ARCHITECTURE.md) |
| Contacts | `/crm/contacts` | Core contacts + CRM profile |
| Accounts | `/crm/accounts` | [CRM_MODULE §6](../../../03-business-modules/crm/CRM_MODULE_ARCHITECTURE.md) |
| Opportunities | `/crm/opportunities` | [CRM_MODULE §7](../../../03-business-modules/crm/CRM_MODULE_ARCHITECTURE.md) |
| Pipeline Kanban | `/crm/pipelines/[id]` | [CRM_MODULE §8](../../../03-business-modules/crm/CRM_MODULE_ARCHITECTURE.md) |
| Activities | `/crm/activities` | [ACTIVITY_CHATTER](../../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) |
| Tasks | `/crm/tasks` | [CRM_MODULE §10](../../../03-business-modules/crm/CRM_MODULE_ARCHITECTURE.md) |
| Meetings | `/crm/meetings` | Calendar + timeline |
| Calls | `/crm/calls` | Call log |
| Customer Intelligence | `/crm/intelligence/[id]` | [CRM_MODULE §15](../../../03-business-modules/crm/CRM_MODULE_ARCHITECTURE.md) |
| AI Insights | `/crm/ai-insights` | [AiSalesForecast.md](../ai-os/AiSalesForecast.md) |
| Reports | `/crm/reports` | Funnel, forecast, conversion |

---

## Current Code

- No `/crm` routes in prototype yet (planned)
- Related: Sales UI patterns at `/sales/*`, Orders at `/orders/*`
- Activity drawer: global pattern from Core platform
