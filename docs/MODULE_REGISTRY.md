# AgainERP — Module Registry (AI Index)

## Purpose
Index of every module — purpose, path, owner, and documentation entry file.

## When To Read
Read after BRAIN.md and PROJECT_MAP.md to select a module for your task.

## Related Files
- [Cursor entry](BRAIN.md)
- [Dependencies](01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next
- [Open module doc entry from registry table](03-business-modules/)

---

> **Status:** Active — **module navigation index for Cursor**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Purpose:** Every module — purpose, path, owner, documentation entry  
> **Detailed registry (schema, tables, APIs):** [00-foundation/registries/MODULE_REGISTRY.md](./00-foundation/registries/MODULE_REGISTRY.md)

**Read after:** [BRAIN.md](./BRAIN.md) — **Level 2** (pick this file when you need module names/paths, not `PROJECT_MAP` or `ARCHITECTURE_DECISIONS`)

---


## When To Read
Read after [BRAIN.md](./BRAIN.md) when you need to **identify a module** (Level 2). Do not read if you already know the module — go straight to Level 3 `README.md`.

## Related Files
- [Cursor entry](BRAIN.md)
- [Dependencies](01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next
- [Open module doc entry from registry table](03-business-modules/)

---

## Registry Fields

| Column | Description |
|--------|-------------|
| **ID** | Module slug |
| **Purpose** | One-line scope |
| **Layer** | core · platform · commerce · erp · ai · industry |
| **Doc path** | `docs/03-business-modules/{id}/` (or noted) |
| **Code path** | `apps/web/src/` route prefix |
| **Doc entry** | `README.md` — module entry point |
| **Owner** | Responsible team |
| **Status** | Draft · Active · Planned |

---

## Core (Always On — Not Installable)

| ID | Purpose | Doc path | Doc entry | Owner | Status |
|----|---------|----------|-----------|-------|--------|
| `core` | Users, RBAC, contacts, workflow, events, shared entities | [02-core-platform/](./02-core-platform/) | [ARCHITECTURE.md](./02-core-platform/ARCHITECTURE.md) | Platform Core | Draft |

**Subsystems:** [subsystems/](./02-core-platform/subsystems/) · **Engines:** [engines/](./02-core-platform/engines/) · **Entities:** [entities/](./02-core-platform/entities/)

---

## Platform

| ID | Purpose | Doc path | API | Doc entry | Owner | Status |
|----|---------|----------|-----|-----------|-------|--------|
| `platform` | SaaS tenant, billing infra, feature flags | [07-saas/](./07-saas/) · [01-architecture/](./01-architecture/) | — | [SAAS_PLATFORM_ARCHITECTURE.md](./01-architecture/SAAS_PLATFORM_ARCHITECTURE.md) | Platform | Draft |
| `subscription` | Subscription & billing module | [03-business-modules/subscription/](./03-business-modules/subscription/) | `/api/v1/subscription/` | [ARCHITECTURE.md](./03-business-modules/subscription/README.md) | Platform | Draft |

---

## Commerce

| ID | Purpose | Doc path | Route | API | Doc entry | Owner | Status |
|----|---------|----------|-------|-----|-----------|-------|--------|
| `ecommerce` | Catalog, orders, storefront, 167 admin screens | [03-business-modules/ecommerce/](./03-business-modules/ecommerce/) | `/catalog/*` | `/api/v1/commerce/` | [README.md](./03-business-modules/ecommerce/README.md) | Ecommerce Team | **Active · package 11/11** |

### Ecommerce sub-areas (doc views — not separate installables)

| Area | Doc entry | Menus |
|------|-----------|-------|
| Dashboard | [dashboard/ARCHITECTURE.md](./03-business-modules/ecommerce/dashboard/ARCHITECTURE.md) | `Menus/Dashboard/` |
| Catalog | [catalog/README.md](./03-business-modules/ecommerce/catalog/README.md) | `Menus/Catalog/` |
| Orders / Sales | [orders/ARCHITECTURE.md](./03-business-modules/ecommerce/orders/ARCHITECTURE.md) | `Menus/Sales/` |
| Customers | [customers/ARCHITECTURE.md](./03-business-modules/ecommerce/customers/ARCHITECTURE.md) | `Menus/Customers/` |
| Inventory views | [inventory/ARCHITECTURE.md](./03-business-modules/ecommerce/inventory/ARCHITECTURE.md) | `Menus/Inventory/` |
| Marketing (legacy scope) | [marketing/README.md](./03-business-modules/ecommerce/marketing/README.md) | `Menus/Marketing/` |
| SEO | [seo/README.md](./03-business-modules/ecommerce/seo/README.md) · sub-area ✅ | `Menus/SEO/` |
| Media | [media/ARCHITECTURE.md](./03-business-modules/ecommerce/media/ARCHITECTURE.md) | `Menus/Media/` |
| Builder | [builder/README.md](./03-business-modules/ecommerce/builder/README.md) · sub-area ✅ | `Menus/Builder/` |
| Reports | [reports/ARCHITECTURE.md](./03-business-modules/ecommerce/reports/ARCHITECTURE.md) | `Menus/Reports/` |
| Analytics | [analytics/ARCHITECTURE.md](./03-business-modules/ecommerce/analytics/ARCHITECTURE.md) | — |
| Storefront | [ECOMMERCE_STOREFRONT_ARCHITECTURE.md](./03-business-modules/ecommerce/ECOMMERCE_STOREFRONT_ARCHITECTURE.md) | `app/(storefront)/` |

**Manifest:** [ecommerce/ModuleManifest.md](./03-business-modules/ecommerce/ModuleManifest.md)  
**Package (11/11):** README · Architecture · ModuleManifest · Database · API · Workflow · Permissions · UI · AI · Reports · CHANGELOG

---

## ERP — Revenue & Supply Chain

| ID | Purpose | Route | API | Prefix | Doc entry | Owner | Status |
|----|---------|-------|-----|--------|-----------|-------|--------|
| `crm` | Leads, opportunities, pipeline, activities | `/crm/*` | `/api/v1/crm/` | `crm_*` | [README.md](./03-business-modules/crm/README.md) | CRM Team | Draft |
| `sales` | Quotations, orders, invoicing, delivery | `/sales/*` | `/api/v1/sales/` | `sales_*` | [README.md](./03-business-modules/sales/README.md) | Sales Team | Draft |
| `purchase` | RFQ, PO, vendor bills, receipts | `/purchase/*` | `/api/v1/purchase/` | `purchase_*` | [README.md](./03-business-modules/purchase/README.md) | Purchase Team | Draft |
| `inventory` | Stock ledger, warehouses, movements | `/inventory/*` | `/api/v1/inventory/` | `inventory_*` | [README.md](./03-business-modules/inventory/README.md) | Inventory Team | Draft |
| `finance` | Treasury, budgets, financial planning | `/finance/*` | `/api/v1/finance/` | `finance_*` | [README.md](./03-business-modules/finance/README.md) | Finance Team | Draft |
| `accounting` | GL, journals, chart of accounts | `/accounting/*` | `/api/v1/accounting/` | `accounting_*` | [README.md](./03-business-modules/accounting/README.md) | Finance Team | Draft |
| `manufacturing` | BOM, work orders, production | `/manufacturing/*` | `/api/v1/manufacturing/` | `manufacturing_*` | [README.md](./03-business-modules/manufacturing/README.md) | Manufacturing Team | Draft |
| `pos` | Point of sale, sessions, receipts | `/pos/*` | `/api/v1/pos/` | `pos_*` | [README.md](./03-business-modules/pos/README.md) | Retail Team | Draft |
| `service` | Service orders, work orders, assets, AMC, field service | `/service/*` | `/api/v1/service/` | `service_*` | [README.md](./03-business-modules/service/README.md) | Service Team | Planning Phase |

---

## ERP — People & Projects

| ID | Purpose | Route | API | Doc entry | Owner | Status |
|----|---------|-------|-----|-----------|-------|--------|
| `hr` | Employees, org, attendance, leave | `/hr/*` | `/api/v1/hr/` | [README.md](./03-business-modules/hr/README.md) | HR Team | Draft |
| `payroll` | Payslips, salary structures, compliance | `/payroll/*` | `/api/v1/payroll/` | [README.md](./03-business-modules/payroll/README.md) | HR Team | Draft |
| `hr-payroll` | **Master** HR + Payroll architecture | `/hr/*` · `/ess/*` | combined | [README.md](./03-business-modules/hr-payroll/README.md) | HR Team | Draft |
| `project` | Projects, tasks, milestones, billing | `/project/*` | `/api/v1/project/` | [README.md](./03-business-modules/project/README.md) | PM Team | Draft |
| `timesheet` | Time entries, approvals, billing link | `/timesheet/*` | `/api/v1/timesheet/` | [README.md](./03-business-modules/timesheet/README.md) | PM Team | Draft |

---

## ERP — Growth & Partners

| ID | Purpose | Route | API | Doc entry | Owner | Status |
|----|---------|-------|-----|-----------|-------|--------|
| `marketing` | Campaigns, journeys, automation, loyalty | `/marketing/*` | `/api/v1/marketing/` | [README.md](./03-business-modules/marketing/README.md) | Marketing Team | Draft |
| `sales-marketing` | Unified RevOps workspace (leads → commission) | `/sales-marketing/*` | `/api/v1/sales-marketing/` | [README.md](./03-business-modules/sales-marketing/README.md) | Sales Team | Draft |
| `business-partners` | Vendors, distributors, channel partners | `/partners/*` | `/api/v1/partners/` | [README.md](./03-business-modules/business-partners/README.md) | Partners Team | Draft |
| `product-configurator` | Configurable products, BOM rules, PC builder | `/product-configurator/*` | `/api/v1/product-configurator/` | [README.md](./03-business-modules/product-configurator/README.md) | Product Team | Draft |
| `website` | Company website builder — pages, blog, portfolio, team, contact, domain | `/website/*` | `/api/v1/website/` | [README.md](./03-business-modules/website/README.md) | Website Team | **Active · package 11/11** |

---

## ERP — Support & Analytics

| ID | Purpose | API | Doc entry | Owner | Status |
|----|---------|-----|-----------|-------|--------|
| `helpdesk` | Tickets, SLAs, knowledge link | `/api/v1/helpdesk/` | [README.md](./03-business-modules/helpdesk/README.md) | Support Team | Draft |
| `documents` | DMS, versions, sharing | `/api/v1/documents/` | [README.md](./03-business-modules/documents/README.md) | Platform | Draft |
| `knowledge` | KB articles, categories, search | `/api/v1/knowledge/` | [README.md](./03-business-modules/knowledge/README.md) | Support Team | Draft |
| `bi-system` | Dashboards, KPIs, drill-down | `/api/v1/bi/` | [README.md](./03-business-modules/bi-system/README.md) | Analytics Team | Draft |
| `data-warehouse` | ETL, dimensions, facts | — | [README.md](./03-business-modules/data-warehouse/README.md) | Analytics Team | Draft |

---

## ERP — Operations & Extensions

| ID | Purpose | API | Doc entry | Owner | Status |
|----|---------|-----|-----------|-------|--------|
| `fleet` | Vehicles, maintenance, fuel | `/api/v1/fleet/` | [README.md](./03-business-modules/fleet/README.md) | Operations | Draft |
| `logistics` | Shipments, carriers, tracking | `/api/v1/logistics/` | [README.md](./03-business-modules/logistics/README.md) | Logistics Team | Draft |
| `booking` | Appointments, resources, calendars | `/api/v1/booking/` | [README.md](./03-business-modules/booking/README.md) | Operations | Draft |
| `marketplace` | Multi-vendor marketplace | `/api/v1/marketplace/` | [README.md](./03-business-modules/marketplace/README.md) | Ecommerce Team | Draft |

---

## AI Module

| ID | Purpose | Doc path | Doc entry | Owner | Status |
|----|---------|----------|-----------|-------|--------|
| `ai` | AI OS — agents, tools, audit, credit metering | [06-ai/platform/ai/](./06-ai/platform/ai/) | [AI_OS_ARCHITECTURE.md](./06-ai/platform/ai/AI_OS_ARCHITECTURE.md) | AI Platform | Draft |

**Experience specs:** [06-ai/experience/](./06-ai/experience/) · **Code:** `apps/web/(admin)/ai-os/`

---

## Industry Modules (Planned — Not in 03-business-modules Yet)

| ID | Purpose | Prefix | Catalog |
|----|---------|--------|---------|
| `hospital` | Hospital management | `hospital_*` | [INDUSTRY_MODULES.md](05-development/framework/INDUSTRY_MODULES.md) |
| `school` | School / education | `school_*` | same |
| `restaurant` | Restaurant / F&B | `restaurant_*` | same |
| `hotel` | Hotel / hospitality | `hotel_*` | same |
| `realestate` | Real estate | `realestate_*` | same |
| `ngo` | NGO / non-profit | `ngo_*` | same |
| `courier` | Courier / logistics | `courier_*` | same |
| `diagnostic` | Diagnostic center | `diagnostic_*` | same |

---

## Prototype Implementation Status

| Module | Docs | UI route | Mock API |
|--------|------|----------|----------|
| `ecommerce` | ✅ **11/11 package** | `/catalog/*` | partial |
| `hr-payroll` | ✅ | `/hr/*`, `/payroll/*` | partial |
| `manufacturing` | ✅ | `/manufacturing/*` | partial |
| `sales-marketing` | ⚠️ UI phase | `/sales-marketing/*` | ✅ |
| `business-partners` | ✅ | `/partners/*` | partial |
| `ai` | ✅ | `/ai-os/*` | partial |
| Storefront | ✅ | `(storefront)/` | — |
| `website` | ✅ **11/11 package** | `/website/*` | — |

---

## Required Files Per Module

| File | When |
|------|------|
| `ModuleManifest.md` | Before any code |
| `Architecture.md` | Before any code |
| `Database.md` | Before backend |
| `API.md` | Before backend |
| `Menus/*.md` | Per admin screen |
| `04-uiux/prototype/{module}/*` | Before UI work |

**Template:** [STANDARD_MODULE_TEMPLATE.md](./STANDARD_MODULE_TEMPLATE.md)

---

---

**Maintainer:** Platform Architecture · **Last Updated:** 2026-06-19
