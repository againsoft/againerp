# CRM Module

> **Status:** Approved · **Version:** 1.0 · **Route namespace:** `/crm/*`

AI-first Customer Intelligence Platform — leads, accounts, opportunities, pipeline, and customer 360.

| Document | Description |
|----------|-------------|
| [**CRM_MODULE_ARCHITECTURE.md**](./CRM_MODULE_ARCHITECTURE.md) | **Enterprise CRM architecture** (source of truth) |
| [Architecture.md](./Architecture.md) | Legacy draft (superseded) |
| [MASTER_DATABASE_ARCHITECTURE.md](../../database/MASTER_DATABASE_ARCHITECTURE.md) | Table naming & ownership |

## Scope

| Area | Route |
|------|-------|
| Dashboard | `/crm/dashboard` |
| Leads | `/crm/leads` |
| Contacts | `/crm/contacts` |
| Accounts | `/crm/accounts` |
| Opportunities | `/crm/opportunities` |
| Pipelines | `/crm/pipelines` |
| Activities / Tasks / Meetings / Calls | `/crm/activities`, `/crm/tasks`, … |
| Customer Intelligence | `/crm/intelligence` |
| AI Insights | `/crm/ai-insights` |
| Reports / Settings | `/crm/reports`, `/crm/settings` |

## Integrations

- **Core contacts** — people & organizations (no duplicate master)
- **Sales** — opportunity → quotation → order
- **Marketing** — campaigns, attribution, nurture
- **Ecommerce** — web leads, order history
- **AI OS** — CRM Agent scoring & predictions

## API Base

`/api/v1/crm/`

## UI Prototype

[ui-prototype/crm/README.md](../../ui-prototype/crm/README.md)
