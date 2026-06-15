# CRM Module — UI Prototype Index

> **Status:** Planned  
> **Architecture:** [CRM_MODULE_ARCHITECTURE.md](../../modules/crm/CRM_MODULE_ARCHITECTURE.md)  
> **Route namespace:** `/crm/*`

---

## Screens (Planned)

| Screen | Route | Reference |
|--------|-------|-----------|
| Dashboard | `/crm/dashboard` | KPI cards, charts, AI widgets |
| Leads | `/crm/leads` | [CRM_MODULE §4](../../modules/crm/CRM_MODULE_ARCHITECTURE.md) |
| Contacts | `/crm/contacts` | Core contacts + CRM profile |
| Accounts | `/crm/accounts` | [CRM_MODULE §6](../../modules/crm/CRM_MODULE_ARCHITECTURE.md) |
| Opportunities | `/crm/opportunities` | [CRM_MODULE §7](../../modules/crm/CRM_MODULE_ARCHITECTURE.md) |
| Pipeline Kanban | `/crm/pipelines/[id]` | [CRM_MODULE §8](../../modules/crm/CRM_MODULE_ARCHITECTURE.md) |
| Activities | `/crm/activities` | [ACTIVITY_CHATTER](../../modules/core/ACTIVITY_CHATTER_ARCHITECTURE.md) |
| Tasks | `/crm/tasks` | [CRM_MODULE §10](../../modules/crm/CRM_MODULE_ARCHITECTURE.md) |
| Meetings | `/crm/meetings` | Calendar + timeline |
| Calls | `/crm/calls` | Call log |
| Customer Intelligence | `/crm/intelligence/[id]` | [CRM_MODULE §15](../../modules/crm/CRM_MODULE_ARCHITECTURE.md) |
| AI Insights | `/crm/ai-insights` | [AiSalesForecast.md](../ai-os/AiSalesForecast.md) |
| Reports | `/crm/reports` | Funnel, forecast, conversion |

---

## Current Code

- No `/crm` routes in prototype yet (planned)
- Related: Sales UI patterns at `/sales/*`, Orders at `/orders/*`
- Activity drawer: global pattern from Core platform
