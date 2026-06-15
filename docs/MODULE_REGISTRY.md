# AgainERP — Module Registry

> **Purpose:** Master registry of all platform modules.  
> **Related:** [UNIVERSAL_MODULE_FRAMEWORK.md](./UNIVERSAL_MODULE_FRAMEWORK.md) · [MODULE_STRUCTURE.md](./MODULE_STRUCTURE.md)

---

## Registry Schema

| Field | Description |
|-------|-------------|
| Module ID | Unique slug |
| Name | Display name |
| Version | Current doc/code version |
| Layer | core · platform · commerce · erp · industry · ai |
| Dependencies | Service deps only — no cross-module DB |
| Menus | Menu groups / screen count |
| Database Tables | Owned tables (prefix) |
| APIs | Base path |
| AI Features | Tools / agents |
| Reports | Report count |
| Status | Draft · Ready · Active · Deprecated |
| Owner | Team |

---

## Core (Not Installable)

| ID | Name | Layer | Tables | Status | Owner |
|----|------|-------|--------|--------|-------|
| `core` | Core Platform | core | `users`, `contacts`, `companies`, … | Draft | Platform Core |

**Doc:** [core/ARCHITECTURE.md](./core/ARCHITECTURE.md)

---

## Platform

| ID | Name | Layer | Dependencies | Status | Owner |
|----|------|-------|--------------|--------|-------|
| `platform` | SaaS Platform | platform | core | Draft | Platform |
| `subscription` | Subscription & Billing | platform | core, platform | Draft | Platform |

**Docs:** [SAAS_PLATFORM_ARCHITECTURE.md](./SAAS_PLATFORM_ARCHITECTURE.md) · [modules/subscription/ARCHITECTURE.md](./modules/subscription/ARCHITECTURE.md)

---

## Commerce (Active)

| ID | Name | Version | Menus | Tables Prefix | API Base | AI | Status | Owner |
|----|------|---------|-------|---------------|----------|-----|--------|-------|
| `ecommerce` | Ecommerce | 1.0.0-orders | 167 screens / 13 groups | `catalog_*`, `commerce_*` | `/api/v1/commerce/` | 15 AI screens | **Active** | Ecommerce Team |

### Ecommerce Submodules

| Submodule | Architecture | Screens |
|-----------|--------------|---------|
| Dashboard | [dashboard/ARCHITECTURE.md](./modules/ecommerce/dashboard/ARCHITECTURE.md) | 8 |
| Catalog | [catalog/ARCHITECTURE.md](./modules/ecommerce/catalog/ARCHITECTURE.md) | 21 |
| Inventory | [inventory/ARCHITECTURE.md](./modules/ecommerce/inventory/ARCHITECTURE.md) | 8 |
| Orders | [orders/ARCHITECTURE.md](./modules/ecommerce/orders/ARCHITECTURE.md) | 9 |
| Customers | [customers/ARCHITECTURE.md](./modules/ecommerce/customers/ARCHITECTURE.md) | 9 |
| Marketing | [marketing/ARCHITECTURE.md](./modules/ecommerce/marketing/ARCHITECTURE.md) | 16 |
| SEO | [seo/ARCHITECTURE.md](./modules/ecommerce/seo/ARCHITECTURE.md) | 12 |
| Media | [media/ARCHITECTURE.md](./modules/ecommerce/media/ARCHITECTURE.md) | 9 |
| Builder | [builder/ARCHITECTURE.md](./modules/ecommerce/builder/ARCHITECTURE.md) | 14 |
| Reports | [reports/ARCHITECTURE.md](./modules/ecommerce/reports/ARCHITECTURE.md) | 14 |
| Analytics | [analytics/ARCHITECTURE.md](./modules/ecommerce/analytics/ARCHITECTURE.md) | — |

**Manifest:** [modules/ecommerce/ModuleManifest.md](./modules/ecommerce/ModuleManifest.md)

**Service dependencies:** Core, Inventory (service), Sales (service), CRM (contacts), Accounting (event)

---

## ERP Modules (Planned)

| ID | Name | Layer | Dependencies | API Base | Status |
|----|------|-------|--------------|----------|--------|
| `crm` | CRM | erp | core | `/api/v1/crm/` | Draft |
| `sales` | Sales | erp | core, crm, inventory | `/api/v1/sales/` | Draft |
| `purchase` | Purchase | erp | core, inventory | `/api/v1/purchase/` | Draft |
| `accounting` | Accounting | erp | core | `/api/v1/accounting/` | Draft |
| `inventory` | Inventory | erp | core | `/api/v1/inventory/` | Draft |
| `pos` | Point of Sale | erp | core, sales, inventory | `/api/v1/pos/` | Draft |
| `hr` | Human Resources | erp | core | `/api/v1/hr/` | Draft |
| `payroll` | Payroll | erp | core, hr | `/api/v1/payroll/` | Draft |
| `project` | Project | erp | core, hr, sales | `/api/v1/project/` | Draft |
| `helpdesk` | Helpdesk | erp | core, crm | `/api/v1/helpdesk/` | Draft |
| `documents` | Documents | erp | core | `/api/v1/documents/` | Draft |
| `knowledge` | Knowledge Base | erp | core | `/api/v1/knowledge/` | Draft |
| `timesheet` | Timesheet | erp | core, project | `/api/v1/timesheet/` | Draft |
| `manufacturing` | Manufacturing | erp | core, inventory, purchase | `/api/v1/mfg/` | Draft |
| `fleet` | Fleet | erp | core | `/api/v1/fleet/` | Draft |
| `logistics` | Logistics | erp | core | `/api/v1/logistics/` | Draft |
| `booking` | Booking | erp | core | `/api/v1/booking/` | Draft |
| `marketplace` | Marketplace | erp | core, ecommerce | `/api/v1/marketplace/` | Draft |
| `bi-system` | BI System | erp | core, data-warehouse | `/api/v1/bi/` | Draft |
| `data-warehouse` | Data Warehouse | erp | core | — | Draft |

---

## AI Module

| ID | Name | Layer | Dependencies | Status |
|----|------|-------|--------------|--------|
| `ai` | AI OS | ai | core (all modules via API) | Draft |

**Docs:** [modules/ai/AI_OS_ARCHITECTURE.md](./modules/ai/AI_OS_ARCHITECTURE.md) · [AI_KNOWLEDGE_INDEX.md](./AI_KNOWLEDGE_INDEX.md)

**AI Features:** Chief Agent, 14 engines, module tool registry, digital twin, credit metering

---

## Industry Modules (Planned)

| ID | Name | Prefix | Status |
|----|------|--------|--------|
| `hospital` | Hospital | `hospital_*` | Planned |
| `school` | School | `school_*` | Planned |
| `restaurant` | Restaurant | `restaurant_*` | Planned |
| `hotel` | Hotel | `hotel_*` | Planned |
| `realestate` | Real Estate | `realestate_*` | Planned |
| `ngo` | NGO | `ngo_*` | Planned |
| `courier` | Courier | `courier_*` | Planned |
| `diagnostic` | Diagnostic Center | `diagnostic_*` | Planned |

**Catalog:** [framework/INDUSTRY_MODULES.md](./framework/INDUSTRY_MODULES.md)

---

## Required Files Per Module

| File | ecommerce | ERP modules | Industry |
|------|-----------|-------------|----------|
| ModuleManifest.md | ✅ | Partial | — |
| Architecture.md | ✅ | ✅ | — |
| Database.md | ✅ | Partial | — |
| API.md | ✅ | Partial | — |
| Workflow.md | ✅ | Partial | — |
| Permissions.md | ✅ | Partial | — |
| Reports.md | Partial | — | — |
| AI.md | — | — | — |
| CHANGELOG.md | — | — | — |

**Gap:** Ecommerce missing `AI.md`, `Reports.md`, `CHANGELOG.md` at module root — see [DOCUMENTATION_HEALTH_REPORT.md](./DOCUMENTATION_HEALTH_REPORT.md)

---

**Last Updated:** 2026-06-12 · **Maintainer:** Platform Architecture Team
