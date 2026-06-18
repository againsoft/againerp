# AgainERP — Master Index

> **Status:** Approved  
> **Version:** 2.0  
> **Project:** AgainERP  
> **Document Type:** Master Documentation Navigation Hub  
> **Purpose:** Central entry point for the entire AgainERP documentation ecosystem  
> **Governance:** [GOVERNANCE.md](./GOVERNANCE.md)

**Rule:** No document may exist without being indexed here or in [DOCUMENT_REGISTRY.md](./DOCUMENT_REGISTRY.md).

**Total documents:** 560+ · **Full machine list:** [_registries/DOCUMENT_REGISTRY_FULL.md](./_registries/DOCUMENT_REGISTRY_FULL.md) · **Regenerate:** `python3 docs/scripts/generate-governance-registries.py`

### Step 24 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Master documentation entry point | §1–§4 |
| 10 documentation categories | §5–§14 |
| Hierarchy, reading order, ownership, status | §15–§18 |

---

## 1. Project Overview

**AgainERP** is a universal modular **ERP + Ecommerce SaaS platform** — documentation-first, API-first, AI-first. One shared Core powers retail, CRM, finance, commerce, and unlimited industry verticals (Hospital, School, Manufacturing, …).

| Attribute | Value |
|-----------|-------|
| **Type** | Multi-tenant hybrid licensed ERP + Ecommerce |
| **Phase** | Documentation First · UI/UX Prototype (frontend) |
| **Architecture** | DDD · Service Oriented · Modular Monolith |
| **Active module** | Ecommerce admin (167 screens) + Core platform docs |
| **Documents** | 560+ registered |

### Entry Points

| Document | Role |
|----------|------|
| [PROJECT_BRAIN.md](./PROJECT_BRAIN.md) | **Mandatory first read** — repo map, rules, UI patterns, AI readiness |
| [README.md](./README.md) | **Human entry** — project overview, principles, quick links |
| [MASTER_INDEX.md](./MASTER_INDEX.md) | **This file** — full navigation hub |
| [AI_KNOWLEDGE_INDEX.md](./AI_KNOWLEDGE_INDEX.md) | **AI entry** — ChatGPT, Claude, Gemini, Cursor, AI OS |
| [PROJECT_MAP.md](./PROJECT_MAP.md) | Visual architecture blueprint |
| [PRD.md](./PRD.md) | Product requirements |

---

## 2. Vision

> **One platform where every business runs on shared Core Services** — without duplicated data, disconnected tools, or fragile integrations.

| Goal | How |
|------|-----|
| **Unify ERP + commerce** | Catalog spine, shared contacts, one search |
| **Scale vertically** | Industry modules plug in — no platform fork |
| **Scale horizontally** | 10k+ tenants, modular monolith → services |
| **Empower AI safely** | AI OS via services, permissions, audit — never raw SQL |
| **Ship with confidence** | Documentation-first; PRE_CODE_GATE before code |

**Mission detail:** [README.md](./README.md) · **Module vision:** [UNIVERSAL_MODULE_FRAMEWORK.md](./UNIVERSAL_MODULE_FRAMEWORK.md)

---

## 3. Architecture Principles

| # | Principle | Detail |
|---|-----------|--------|
| 1 | **Documentation-first** | Docs **Ready** before production code |
| 2 | **Core-first** | All modules build on Core — not each other’s DB |
| 3 | **Single entity owner** | One writer per table; others use services/events |
| 4 | **API-first** | Web, mobile, integrations, AI share HTTP surface |
| 5 | **Service-oriented** | Cross-module via `{Domain}Service` in-process |
| 6 | **Event-driven** | Async side effects after COMMIT |
| 7 | **Multi-tenant** | Platform → Company → Branch → Warehouse |
| 8 | **AI as platform service** | Tools → services; full audit trail |
| 9 | **Modular** | Install · remove · upgrade modules independently |
| 10 | **Governed registries** | Master indexes for modules, pages, APIs, entities |

**Stack (mandatory):** [TECHNOLOGY_CONSTITUTION.md](./TECHNOLOGY_CONSTITUTION.md)  
**Layers:** [PROJECT_MAP.md](./PROJECT_MAP.md) · [MASTER_MODULE_ARCHITECTURE.md](./MASTER_MODULE_ARCHITECTURE.md)  
**Dependencies:** [MODULE_DEPENDENCY_MAP.md](./MODULE_DEPENDENCY_MAP.md)  
**Communication:** [framework/COMMUNICATION_CONTRACTS.md](./framework/COMMUNICATION_CONTRACTS.md)

---

## 4. Documentation Governance

| Rule | Document |
|------|----------|
| Every doc registered | [DOCUMENT_REGISTRY.md](./DOCUMENT_REGISTRY.md) |
| Every doc indexed | This file |
| Every change logged | [CHANGELOG.md](./CHANGELOG.md) |
| Before code | [PRE_CODE_GATE.md](./PRE_CODE_GATE.md) |
| Standards | [DOCUMENTATION_STANDARD.md](./DOCUMENTATION_STANDARD.md) · [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md) |
| Health dashboard | [DOCUMENTATION_HEALTH_REPORT.md](./DOCUMENTATION_HEALTH_REPORT.md) |
| Decisions | [ADR_INDEX.md](./ADR_INDEX.md) |
| Traceability | [TRACEABILITY_MATRIX.md](./TRACEABILITY_MATRIX.md) |

**Checklists:** [_PRE_CODE_GATE_CHECKLIST.md](./_PRE_CODE_GATE_CHECKLIST.md) · [_COMMIT_CHECKLIST.md](./_COMMIT_CHECKLIST.md)  
**Templates:** [_MODULE_MANIFEST_TEMPLATE.md](./_MODULE_MANIFEST_TEMPLATE.md) · [_PAGE_TEMPLATE.md](./_PAGE_TEMPLATE.md)

---

## 5. Platform Documents

Platform-wide architecture, SaaS, licensing, roadmap, and framework.

| Document | Description | Status |
|----------|-------------|--------|
| [README.md](./README.md) | Project entry point | Draft |
| [PRD.md](./PRD.md) | Product requirements | Draft |
| [PROJECT_MAP.md](./PROJECT_MAP.md) | **Project Map** — visual platform map (layers, modules, flows) | Draft |
| [MASTER_MODULE_ARCHITECTURE.md](./MASTER_MODULE_ARCHITECTURE.md) | Platform module blueprint | Draft |
| [UNIVERSAL_MODULE_FRAMEWORK.md](./UNIVERSAL_MODULE_FRAMEWORK.md) | Universal module framework | Draft |
| [HYBRID_LICENSED_ERP_ARCHITECTURE.md](./HYBRID_LICENSED_ERP_ARCHITECTURE.md) | Hybrid licensed ERP | Core |
| [SAAS_PLATFORM_ARCHITECTURE.md](./SAAS_PLATFORM_ARCHITECTURE.md) | SaaS platform | Draft |
| [MASTER_DEVELOPMENT_SEQUENCE.md](./MASTER_DEVELOPMENT_SEQUENCE.md) | 100-step roadmap | Active |
| [MODULE_STRUCTURE.md](./MODULE_STRUCTURE.md) | Module folder standard | Draft |
| [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md) | Global dev standards | Draft |
| [TECHNOLOGY_CONSTITUTION.md](./TECHNOLOGY_CONSTITUTION.md) | Official tech stack | Draft |
| [PRE_CODE_GATE.md](./PRE_CODE_GATE.md) | Pre-code mandatory gate | Draft |
| [GOVERNANCE.md](./GOVERNANCE.md) | Documentation governance | Draft |
| [UI_PROTOTYPE_MODE.md](./UI_PROTOTYPE_MODE.md) | Active prototype mode | Draft |
| [UI_PROTOTYPE_STRATEGY.md](./UI_PROTOTYPE_STRATEGY.md) | Prototype strategy | Active |
| [ECOMMERCE_ADMIN_PROTOTYPE_PHASE1.md](./ECOMMERCE_ADMIN_PROTOTYPE_PHASE1.md) | Phase 1 prototype scope | Active |

### Platform Deep-Dives

| Document | Description |
|----------|-------------|
| [platform/README.md](./platform/README.md) | Platform hub |
| [platform/TENANT_ARCHITECTURE.md](./platform/TENANT_ARCHITECTURE.md) | Tenant model |
| [platform/SAAS_ER_DIAGRAM.md](./platform/SAAS_ER_DIAGRAM.md) | SaaS ER diagram |
| [platform/SCALING_ROADMAP.md](./platform/SCALING_ROADMAP.md) | Scaling plan |
| [platform/CLOUD_CONTROL_PLANE.md](./platform/CLOUD_CONTROL_PLANE.md) | Cloud control plane |
| [platform/HYBRID_DEPLOYMENT.md](./platform/HYBRID_DEPLOYMENT.md) | Deployment modes |
| [platform/LICENSE_AND_SYNC_AGENTS.md](./platform/LICENSE_AND_SYNC_AGENTS.md) | License & sync agents |
| [platform/DATA_OWNERSHIP.md](./platform/DATA_OWNERSHIP.md) | Data vs IP ownership |

### Framework

| Document | Description |
|----------|-------------|
| [framework/README.md](./framework/README.md) | Module framework hub |
| [framework/COMMUNICATION_CONTRACTS.md](./framework/COMMUNICATION_CONTRACTS.md) | Services, events, APIs, workflows |
| [framework/CORE_SERVICES.md](./framework/CORE_SERVICES.md) | Core services catalog |
| [framework/MODULE_LIFECYCLE.md](./framework/MODULE_LIFECYCLE.md) | Install / upgrade / remove |
| [framework/INDUSTRY_MODULES.md](./framework/INDUSTRY_MODULES.md) | Industry verticals |
| [framework/templates/AI_TEMPLATE.md](./framework/templates/AI_TEMPLATE.md) | Module AI.md template |

### ADRs

| Document | Description |
|----------|-------------|
| [ADR_INDEX.md](./ADR_INDEX.md) | Architecture decision index |
| [adr/ADR-001-postgresql.md](./adr/ADR-001-postgresql.md) through [adr/ADR-013-hybrid-licensed-erp.md](./adr/ADR-013-hybrid-licensed-erp.md) | Individual ADRs |

---

## 6. Core Documents

Core layer — identity, RBAC, shared entities, platform engines.

| Document | Description | Status |
|----------|-------------|--------|
| [core/ARCHITECTURE.md](./core/ARCHITECTURE.md) | Core framework architecture | Draft |
| [core/README.md](./core/README.md) | Core documentation hub | Draft |
| [core/shared-entities.md](./core/shared-entities.md) | Shared entity index | Draft |
| [core/API.md](./core/API.md) | Core API reference | Draft |
| [core/ModuleManifest.md](./core/ModuleManifest.md) | Core module manifest | Draft |
| [core/PERMISSION_SYSTEM_ARCHITECTURE.md](./core/PERMISSION_SYSTEM_ARCHITECTURE.md) | **Permission System** | Approved |

### Core Engines

| Engine | Document | Status |
|--------|----------|--------|
| Workflow | [core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md](./core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md) | Approved |
| Approval | [core/engines/APPROVAL_ENGINE_ARCHITECTURE.md](./core/engines/APPROVAL_ENGINE_ARCHITECTURE.md) | Approved |
| Notifications | [core/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md](./core/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md) | Approved |
| Events | [core/engines/EVENT_ARCHITECTURE.md](./core/engines/EVENT_ARCHITECTURE.md) | Approved |
| Search | [core/engines/GLOBAL_SEARCH_ARCHITECTURE.md](./core/engines/GLOBAL_SEARCH_ARCHITECTURE.md) | Approved |
| Queue | [core/engines/queue-architecture.md](./core/engines/queue-architecture.md) | Draft |
| Cache | [core/engines/cache-architecture.md](./core/engines/cache-architecture.md) | Draft |
| [All engines](./core/engines/README.md) | Engine index | Draft |

**Legacy (superseded):** [workflow-engine.md](./core/engines/workflow-engine.md) · [approval-engine.md](./core/engines/approval-engine.md) · [event-system.md](./core/engines/event-system.md) · [search-engine.md](./core/engines/search-engine.md)

### Core Entities

| Entity | Document |
|--------|----------|
| [core/entities/README.md](./core/entities/README.md) | Entity index |
| Users | [core/entities/users.md](./core/entities/users.md) |
| Roles | [core/entities/roles.md](./core/entities/roles.md) |
| Permissions | [core/entities/permissions.md](./core/entities/permissions.md) |
| Companies | [core/entities/companies.md](./core/entities/companies.md) |
| Branches | [core/entities/branches.md](./core/entities/branches.md) |
| Contacts | [core/entities/contacts.md](./core/entities/contacts.md) |
| Addresses | [core/entities/addresses.md](./core/entities/addresses.md) |
| Activities | [core/entities/activities.md](./core/entities/activities.md) |
| Comments | [core/entities/comments.md](./core/entities/comments.md) |
| Attachments | [core/entities/attachments.md](./core/entities/attachments.md) |
| Tags | [core/entities/tags.md](./core/entities/tags.md) |
| Notes | [core/entities/notes.md](./core/entities/notes.md) |
| Media | [core/entities/media-library.md](./core/entities/media-library.md) |
| Notifications | [core/entities/notifications.md](./core/entities/notifications.md) |
| Settings | [core/entities/settings.md](./core/entities/settings.md) |
| Localization | [core/entities/localization.md](./core/entities/localization.md) |

### Core Platform Modules (shared architecture)

| Document | Description | Status |
|----------|-------------|--------|
| [modules/core/PRODUCT_MASTER_ARCHITECTURE.md](./modules/core/PRODUCT_MASTER_ARCHITECTURE.md) | Product Master | Approved |
| [modules/core/ACTIVITY_CHATTER_ARCHITECTURE.md](./modules/core/ACTIVITY_CHATTER_ARCHITECTURE.md) | Activity & chatter | Draft |
| [modules/core/SETTINGS_ARCHITECTURE.md](./modules/core/SETTINGS_ARCHITECTURE.md) | Settings hierarchy | Draft |

---

## 7. Business Modules

Independent ERP and ecommerce business domains.

### Approved Module Architectures

| Module | Route | Architecture | Workflow |
|--------|-------|--------------|----------|
| **Catalog / Product Master** | `/catalog/*` | [PRODUCT_MASTER_ARCHITECTURE.md](./modules/core/PRODUCT_MASTER_ARCHITECTURE.md) | [WORKFLOW_REGISTRY.md](./WORKFLOW_REGISTRY.md) |
| **Inventory** | `/inventory/*` | [INVENTORY_MODULE_ARCHITECTURE.md](./modules/inventory/INVENTORY_MODULE_ARCHITECTURE.md) · [ENTITY_INVENTORY.md](./modules/inventory/ENTITY_INVENTORY.md) | [INVENTORY_WORKFLOW.md](./modules/inventory/INVENTORY_WORKFLOW.md) |
| **Purchase** | `/purchase/*` | [PURCHASE_MODULE_ARCHITECTURE.md](./modules/purchase/PURCHASE_MODULE_ARCHITECTURE.md) · [ENTITY_PURCHASE.md](./modules/purchase/ENTITY_PURCHASE.md) | [PURCHASE_WORKFLOW.md](./modules/purchase/PURCHASE_WORKFLOW.md) |
| **Sales** | `/sales/*` | [SALES_MODULE_ARCHITECTURE.md](./modules/sales/SALES_MODULE_ARCHITECTURE.md) · [ENTITY_SALES.md](./modules/sales/ENTITY_SALES.md) | [SALES_WORKFLOW.md](./modules/sales/SALES_WORKFLOW.md) |
| **CRM** | `/crm/*` | [CRM_MODULE_ARCHITECTURE.md](./modules/crm/CRM_MODULE_ARCHITECTURE.md) | — |
| **Marketing** | `/marketing/*` | [MARKETING_MODULE_ARCHITECTURE.md](./modules/marketing/MARKETING_MODULE_ARCHITECTURE.md) | — |
| **Finance** | `/finance/*` | [FINANCE_MODULE_ARCHITECTURE.md](./modules/finance/FINANCE_MODULE_ARCHITECTURE.md) | — |

### Ecommerce Module (Phase 1 Active)

| Document | Description |
|----------|-------------|
| [modules/ecommerce/Architecture.md](./modules/ecommerce/Architecture.md) | Module architecture (admin) |
| [modules/ecommerce/ECOMMERCE_STOREFRONT_ARCHITECTURE.md](./modules/ecommerce/ECOMMERCE_STOREFRONT_ARCHITECTURE.md) | **Customer storefront** (v1.0) |
| [modules/ecommerce/ModuleManifest.md](./modules/ecommerce/ModuleManifest.md) | Module manifest |
| [modules/ecommerce/MENU_STRUCTURE.md](./modules/ecommerce/MENU_STRUCTURE.md) | 167-screen menu |
| [modules/ecommerce/Database.md](./modules/ecommerce/Database.md) | Schema doc |
| [modules/ecommerce/API.md](./modules/ecommerce/API.md) | APIs |
| [modules/ecommerce/Workflow.md](./modules/ecommerce/Workflow.md) | Workflows |
| [modules/ecommerce/Permissions.md](./modules/ecommerce/Permissions.md) | Permissions |
| [modules/ecommerce/UI.md](./modules/ecommerce/UI.md) | Navigation |
| [modules/ecommerce/Development.md](./modules/ecommerce/Development.md) | Dev guide |
| [modules/ecommerce/Roadmap.md](./modules/ecommerce/Roadmap.md) | Roadmap |

#### Ecommerce Submodules

| Submodule | Architecture | Menu screens |
|-----------|--------------|--------------|
| Dashboard | [dashboard/ARCHITECTURE.md](./modules/ecommerce/dashboard/ARCHITECTURE.md) | [Menus/Dashboard/](./modules/ecommerce/Menus/Dashboard/) |
| Catalog | [catalog/ARCHITECTURE.md](./modules/ecommerce/catalog/ARCHITECTURE.md) · [ENTITY_CATALOG.md](./modules/ecommerce/catalog/ENTITY_CATALOG.md) | [Menus/Catalog/](./modules/ecommerce/Menus/Catalog/) |
| Customers | [customers/ARCHITECTURE.md](./modules/ecommerce/customers/ARCHITECTURE.md) | [Menus/Customers/](./modules/ecommerce/Menus/Customers/) |
| Orders | [orders/ARCHITECTURE.md](./modules/ecommerce/orders/ARCHITECTURE.md) | [Menus/Sales/](./modules/ecommerce/Menus/Sales/) |
| Inventory | [inventory/ARCHITECTURE.md](./modules/ecommerce/inventory/ARCHITECTURE.md) | [Menus/Inventory/](./modules/ecommerce/Menus/Inventory/) |
| Marketing | [marketing/ARCHITECTURE.md](./modules/ecommerce/marketing/ARCHITECTURE.md) | [Menus/Marketing/](./modules/ecommerce/Menus/Marketing/) |
| SEO | [seo/ARCHITECTURE.md](./modules/ecommerce/seo/ARCHITECTURE.md) | [Menus/SEO/](./modules/ecommerce/Menus/SEO/) |
| Media | [media/ARCHITECTURE.md](./modules/ecommerce/media/ARCHITECTURE.md) | [Menus/Media/](./modules/ecommerce/Menus/Media/) |
| Builder | [builder/ARCHITECTURE.md](./modules/ecommerce/builder/ARCHITECTURE.md) | [Menus/Builder/](./modules/ecommerce/Menus/Builder/) |
| Reports | [reports/ARCHITECTURE.md](./modules/ecommerce/reports/ARCHITECTURE.md) | [Menus/Reports/](./modules/ecommerce/Menus/Reports/) |
| Analytics | [analytics/ARCHITECTURE.md](./modules/ecommerce/analytics/ARCHITECTURE.md) | — |
| Content | — | [Menus/Content/](./modules/ecommerce/Menus/Content/) |
| AI screens | — | [Menus/AI/](./modules/ecommerce/Menus/AI/) |
| System | — | [Menus/System/](./modules/ecommerce/Menus/System/) |

### Planned ERP Modules

| Module | Document | Status |
|--------|----------|--------|
| POS | [modules/pos/Architecture.md](./modules/pos/Architecture.md) | Planned |
| HR | [modules/hr/Architecture.md](./modules/hr/Architecture.md) | Planned |
| Payroll | [modules/payroll/Architecture.md](./modules/payroll/Architecture.md) | Planned |
| Project | [modules/project/Architecture.md](./modules/project/Architecture.md) | Planned |
| Helpdesk | [modules/helpdesk/Architecture.md](./modules/helpdesk/Architecture.md) | Planned |
| Documents | [modules/documents/Architecture.md](./modules/documents/Architecture.md) | Planned |
| Knowledge | [modules/knowledge/Architecture.md](./modules/knowledge/Architecture.md) | Planned |
| Timesheet | [modules/timesheet/Architecture.md](./modules/timesheet/Architecture.md) | Planned |
| Manufacturing | [modules/manufacturing/Architecture.md](./modules/manufacturing/Architecture.md) | Planned |
| Marketplace | [modules/marketplace/Architecture.md](./modules/marketplace/Architecture.md) | Planned |
| Subscription | [modules/subscription/ARCHITECTURE.md](./modules/subscription/ARCHITECTURE.md) | Planned |
| Logistics | [modules/logistics/Architecture.md](./modules/logistics/Architecture.md) | Planned |
| Fleet | [modules/fleet/Architecture.md](./modules/fleet/Architecture.md) | Planned |
| Booking | [modules/booking/Architecture.md](./modules/booking/Architecture.md) | Planned |
| BI | [modules/bi-system/ARCHITECTURE.md](./modules/bi-system/ARCHITECTURE.md) | Planned |
| Data Warehouse | [modules/data-warehouse/ARCHITECTURE.md](./modules/data-warehouse/ARCHITECTURE.md) | Planned |

**Full module list:** [MODULE_REGISTRY.md](./MODULE_REGISTRY.md)

---

## 8. Industry Modules

Installable verticals on shared Core — see [framework/INDUSTRY_MODULES.md](./framework/INDUSTRY_MODULES.md).

| Industry | Table prefix | Status |
|----------|--------------|--------|
| Hospital | `hospital_*` | Planned |
| School | `school_*` | Planned |
| Restaurant | `restaurant_*` | Planned |
| Hotel | `hotel_*` | Planned |
| Real Estate | `realestate_*` | Planned |
| NGO | `ngo_*` | Planned |
| Courier | `courier_*` | Planned |
| Diagnostic | `diagnostic_*` | Planned |
| Manufacturing | `mfg_*` | Planned |
| Marketplace | `marketplace_*` | Planned |

**Rule:** Industry module = new folder + prefix + manifest — never fork Core.

---

## 9. AI Documents

| Document | Description | Status |
|----------|-------------|--------|
| [ai_os/README.md](./ai_os/README.md) | **AI OS experience index** — vision, UX, admin, storefront | Vision |
| [ai_os/01_AI_COMMERCE_OS_VISION.md](./ai_os/01_AI_COMMERCE_OS_VISION.md) | AI Commerce OS strategic vision | Vision |
| [ai_os/02_AI_USER_EXPERIENCE.md](./ai_os/02_AI_USER_EXPERIENCE.md) | Cross-cutting AI UX patterns | Vision |
| [ai_os/03_AI_ADMIN_EXPERIENCE.md](./ai_os/03_AI_ADMIN_EXPERIENCE.md) | Merchant AI Command Center UX | Vision |
| [ai_os/04_AI_STOREFRONT_EXPERIENCE.md](./ai_os/04_AI_STOREFRONT_EXPERIENCE.md) | Adaptive storefront AI UX | Vision |
| [AI_KNOWLEDGE_INDEX.md](./AI_KNOWLEDGE_INDEX.md) | **Master AI knowledge map** | Approved |
| [modules/ai/AI_OS_ARCHITECTURE.md](./modules/ai/AI_OS_ARCHITECTURE.md) | AI OS platform service | Approved |
| [modules/ai/AI_FIRST_ARCHITECTURE.md](./modules/ai/AI_FIRST_ARCHITECTURE.md) | AI-first principles | Draft |
| [modules/ai/AI_OS.md](./modules/ai/AI_OS.md) | AI OS index | Draft |
| [modules/ai/ARCHITECTURE.md](./modules/ai/ARCHITECTURE.md) | AI services | Draft |
| [modules/ai/AI_CONTEXT_ENGINE.md](./modules/ai/AI_CONTEXT_ENGINE.md) | Context engine | Draft |
| [modules/ai/AI_AUDIT_AND_APPROVAL.md](./modules/ai/AI_AUDIT_AND_APPROVAL.md) | Audit & approval | Draft |
| [modules/ai/AI_DIGITAL_TWIN.md](./modules/ai/AI_DIGITAL_TWIN.md) | Digital twin | Draft |
| [modules/ai/AI_SCALING_ROADMAP.md](./modules/ai/AI_SCALING_ROADMAP.md) | Scaling roadmap | Draft |

---

## 10. Workflow Documents

| Document | Description | Status |
|----------|-------------|--------|
| [WORKFLOW_REGISTRY.md](./WORKFLOW_REGISTRY.md) | **Workflow registry** | Draft |
| [workflows/README.md](./workflows/README.md) | Cross-module workflows | Draft |
| [core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md](./core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md) | Workflow engine | Approved |
| [core/engines/APPROVAL_ENGINE_ARCHITECTURE.md](./core/engines/APPROVAL_ENGINE_ARCHITECTURE.md) | Approval engine | Approved |
| [modules/inventory/INVENTORY_WORKFLOW.md](./modules/inventory/INVENTORY_WORKFLOW.md) | Inventory workflows | Draft |
| [modules/purchase/PURCHASE_WORKFLOW.md](./modules/purchase/PURCHASE_WORKFLOW.md) | Purchase workflows | Draft |
| [modules/sales/SALES_WORKFLOW.md](./modules/sales/SALES_WORKFLOW.md) | Sales workflows | Draft |
| [modules/ecommerce/Workflow.md](./modules/ecommerce/Workflow.md) | Ecommerce workflows | Draft |

---

## 11. Database Documents

| Document | Description | Status |
|----------|-------------|--------|
| [DATABASE_REGISTRY.md](./DATABASE_REGISTRY.md) | **Database registry** (blueprint) | Approved |
| [ENTITY_RELATIONSHIP_REGISTRY.md](./ENTITY_RELATIONSHIP_REGISTRY.md) | **Entity relationships** (business) | Approved |
| [database/MASTER_DATABASE_ARCHITECTURE.md](./database/MASTER_DATABASE_ARCHITECTURE.md) | Master schema patterns | Draft |
| [database/ER_DIAGRAM.md](./database/ER_DIAGRAM.md) | ER diagrams | Draft |
| [database/standards.md](./database/standards.md) | PostgreSQL standards | Draft |
| [database/naming-conventions.md](./database/naming-conventions.md) | Naming conventions | Draft |
| [database/multi-company.md](./database/multi-company.md) | Multi-company | Draft |
| [database/audit-trail.md](./database/audit-trail.md) | Audit trail | Draft |
| [database/README.md](./database/README.md) | Database hub | Draft |

---

## 12. API Documents

| Document | Description | Status |
|----------|-------------|--------|
| [API_REGISTRY.md](./API_REGISTRY.md) | **API architecture registry** | Approved |
| [api/README.md](./api/README.md) | API documentation hub | Draft |
| [api/architecture.md](./api/architecture.md) | API-first architecture | Draft |
| [core/API.md](./core/API.md) | Core API reference | Draft |
| [modules/ecommerce/API.md](./modules/ecommerce/API.md) | Ecommerce API | Draft |

---

## 13. Service Documents

| Document | Description | Status |
|----------|-------------|--------|
| [SERVICE_REGISTRY.md](./SERVICE_REGISTRY.md) | **Service registry** | Approved |
| [MODULE_DEPENDENCY_MAP.md](./MODULE_DEPENDENCY_MAP.md) | Module dependency map | Approved |
| [DependencyMap.md](./DependencyMap.md) | Dependency quick reference | Approved |
| [framework/CORE_SERVICES.md](./framework/CORE_SERVICES.md) | Core services catalog | Draft |
| [framework/COMMUNICATION_CONTRACTS.md](./framework/COMMUNICATION_CONTRACTS.md) | Integration channels | Draft |

---

## 14. Registry Documents

Master registries — authoritative indexes for AI, codegen, and governance.

| Registry | Document | Status |
|----------|----------|--------|
| **Master Index** | [MASTER_INDEX.md](./MASTER_INDEX.md) | Approved |
| **Document Registry** | [DOCUMENT_REGISTRY.md](./DOCUMENT_REGISTRY.md) | Draft |
| **Document Registry (full)** | [_registries/DOCUMENT_REGISTRY_FULL.md](./_registries/DOCUMENT_REGISTRY_FULL.md) | Draft |
| **Module Registry** | [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | Draft |
| **Page Registry** | [PAGE_REGISTRY.md](./PAGE_REGISTRY.md) | Draft |
| **Page Registry (full)** | [_registries/PAGE_REGISTRY_FULL.md](./_registries/PAGE_REGISTRY_FULL.md) | Draft |
| **Database Registry** | [DATABASE_REGISTRY.md](./DATABASE_REGISTRY.md) | Approved |
| **Entity Registry** | [ENTITY_RELATIONSHIP_REGISTRY.md](./ENTITY_RELATIONSHIP_REGISTRY.md) | Approved |
| **Catalog Entity Catalog** | [ENTITY_CATALOG.md](./modules/ecommerce/catalog/ENTITY_CATALOG.md) | Approved |
| **Inventory Entity Catalog** | [ENTITY_INVENTORY.md](./modules/inventory/ENTITY_INVENTORY.md) | Approved |
| **Purchase Entity Catalog** | [ENTITY_PURCHASE.md](./modules/purchase/ENTITY_PURCHASE.md) | Approved |
| **Sales Entity Catalog** | [ENTITY_SALES.md](./modules/sales/ENTITY_SALES.md) | Approved |
| **Service Registry** | [SERVICE_REGISTRY.md](./SERVICE_REGISTRY.md) | Approved |
| **API Registry** | [API_REGISTRY.md](./API_REGISTRY.md) | Approved |
| **Workflow Registry** | [WORKFLOW_REGISTRY.md](./WORKFLOW_REGISTRY.md) | Draft |
| **Module Dependency Map** | [MODULE_DEPENDENCY_MAP.md](./MODULE_DEPENDENCY_MAP.md) | Approved |
| **AI Knowledge Index** | [AI_KNOWLEDGE_INDEX.md](./AI_KNOWLEDGE_INDEX.md) | Approved |
| **Traceability Matrix** | [TRACEABILITY_MATRIX.md](./TRACEABILITY_MATRIX.md) | Approved |
| **Changelog** | [CHANGELOG.md](./CHANGELOG.md) | Draft |
| **ADR Index** | [ADR_INDEX.md](./ADR_INDEX.md) | Draft |

### Machine-Readable Registries

| File | Format |
|------|--------|
| [_registries/documents.json](./_registries/documents.json) | All documents |
| [_registries/pages.json](./_registries/pages.json) | All pages |
| [_registries/stats.json](./_registries/stats.json) | Coverage metrics |

---

## 15. Documentation Hierarchy

```text
AgainERP Documentation
│
├── L0 — Entry & Governance
│   ├── README.md
│   ├── MASTER_INDEX.md (this file)
│   ├── GOVERNANCE.md
│   ├── CHANGELOG.md
│   └── PRE_CODE_GATE.md
│
├── L1 — Platform Blueprint
│   ├── PROJECT_MAP.md
│   ├── MASTER_MODULE_ARCHITECTURE.md
│   ├── UNIVERSAL_MODULE_FRAMEWORK.md
│   └── TECHNOLOGY_CONSTITUTION.md
│
├── L2 — Master Registries
│   ├── MODULE_REGISTRY · PAGE_REGISTRY
│   ├── DATABASE_REGISTRY · ENTITY_RELATIONSHIP_REGISTRY
│   ├── SERVICE_REGISTRY · MODULE_DEPENDENCY_MAP
│   ├── API_REGISTRY · WORKFLOW_REGISTRY
│   └── AI_KNOWLEDGE_INDEX
│
├── L3 — Domain Architecture
│   ├── core/ · modules/{domain}/
│   └── core/engines/ (Workflow, Approval, Event, Search, …)
│
├── L4 — Module Package (9 files)
│   ├── Architecture · Database · API · Workflow
│   ├── Permissions · UI · Development · Roadmap
│   └── ModuleManifest · AI.md
│
├── L5 — Screen & Page Docs
│   ├── modules/ecommerce/Menus/**
│   └── ui-prototype/**
│
└── L6 — Supporting
    ├── ui-ux/ · deployment/ · qa/ · roadmap/
    ├── adr/ · database/
    └── _templates/ · _registries/
```

---

## 16. Documentation Reading Order

### Humans (New Contributor)

```text
1. README.md
2. PROJECT_BRAIN.md
3. MASTER_INDEX.md (this file)
4. PROJECT_MAP.md
5. TECHNOLOGY_CONSTITUTION.md
6. UNIVERSAL_MODULE_FRAMEWORK.md
7. Target MODULE_REGISTRY → module ARCHITECTURE.md
8. PRE_CODE_GATE.md (before any code)
```

### AI Agents (Cursor, ChatGPT, Claude, Gemini, AI OS)

```text
1. PROJECT_BRAIN.md
2. README.md
3. MASTER_INDEX.md
4. PROJECT_MAP.md
5. AI_KNOWLEDGE_INDEX.md
6. ai_os/README.md (vision + UX surfaces)
7. TECHNOLOGY_CONSTITUTION.md
8. PRE_CODE_GATE.md
9. Relevant registry (Module, Service, Entity, API, …)
10. Module ARCHITECTURE.md
```

### Implementation Gate (Feature Work)

```text
1. PRE_CODE_GATE.md — all 6 reviews
2. MODULE_REGISTRY + module ARCHITECTURE.md
3. DATABASE_REGISTRY + ENTITY_RELATIONSHIP_REGISTRY
4. SERVICE_REGISTRY + MODULE_DEPENDENCY_MAP
5. API_REGISTRY + module API.md
6. WORKFLOW_REGISTRY (if stateful)
7. PAGE_REGISTRY (if UI)
8. UI_UX standards (if frontend)
```

---

## 17. Documentation Ownership

| Domain | Owner | Scope |
|--------|-------|-------|
| **Platform** | Platform Team | Registries, governance, MASTER_INDEX, roadmap |
| **Core** | Platform Team | Users, RBAC, engines, shared entities |
| **Business modules** | Module owner | Per-module 9-file package + ARCHITECTURE |
| **Ecommerce** | Ecommerce Team | 167 screens, Menus/, catalog prototype |
| **AI OS** | AI Platform Team | `ai_os/`, AI_OS_ARCHITECTURE, agents, audit |
| **Database** | Platform Team | DATABASE_REGISTRY, MASTER_DATABASE_ARCHITECTURE |
| **UI/UX** | Design / Frontend | ui-ux/, ui-prototype/ |
| **DevOps** | Infrastructure | deployment/ |
| **QA** | QA Team | qa/ |

**Default owner:** Platform Team · **Escalation:** Architecture review via ADR

Every document header includes: **Status · Version · Owner · Document Type**

---

## 18. Documentation Status Tracking

### Status Definitions

| Status | Meaning |
|--------|---------|
| **Approved** | Architecture authority — safe for PRE_CODE_GATE reference |
| **Active** | In use (prototype, sequence) — may evolve |
| **Draft** | Work in progress — not implementation authority alone |
| **Superseded** | Replaced — pointer to successor doc |
| **Planned** | Placeholder — module not yet documented |

### Approved Architecture Documents (Platform)

| Document | Version |
|----------|---------|
| MASTER_INDEX.md | 2.0 |
| AI_KNOWLEDGE_INDEX.md | 2.0 |
| API_REGISTRY.md | 1.0 |
| SERVICE_REGISTRY.md | 1.0 |
| ENTITY_RELATIONSHIP_REGISTRY.md | 1.0 |
| MODULE_DEPENDENCY_MAP.md | 1.0 |
| DATABASE_REGISTRY.md | 1.0 |
| PERMISSION_SYSTEM_ARCHITECTURE.md | 1.0 |
| WORKFLOW_ENGINE_ARCHITECTURE.md | 1.0 |
| APPROVAL_ENGINE_ARCHITECTURE.md | 1.0 |
| EVENT_ARCHITECTURE.md | 1.0 |
| NOTIFICATION_ENGINE_ARCHITECTURE.md | 1.0 |
| GLOBAL_SEARCH_ARCHITECTURE.md | 1.0 |
| AI_OS_ARCHITECTURE.md | 2.0 |
| PRODUCT_MASTER_ARCHITECTURE.md | — |
| INVENTORY / PURCHASE / SALES / CRM / MARKETING / FINANCE MODULE_ARCHITECTURE | 1.0 |

### Health & Coverage

| Report | Document |
|--------|----------|
| Documentation health | [DOCUMENTATION_HEALTH_REPORT.md](./DOCUMENTATION_HEALTH_REPORT.md) |
| Traceability | [TRACEABILITY_MATRIX.md](./TRACEABILITY_MATRIX.md) |
| Stats JSON | [_registries/stats.json](./_registries/stats.json) |

**Regenerate inventories after bulk doc changes:** `python3 docs/scripts/generate-governance-registries.py`

---

## 19. UI / UX Documents

| Document | Description |
|----------|-------------|
| [ui-ux/README.md](./ui-ux/README.md) | UI hub |
| [ui-ux/ENTERPRISE_UI_ARCHITECTURE.md](./ui-ux/ENTERPRISE_UI_ARCHITECTURE.md) | Canonical UI shell |
| [ui-ux/UX_SMART_INTERACTION_STANDARDS.md](./ui-ux/UX_SMART_INTERACTION_STANDARDS.md) | Smart interactions |
| [ui-ux/UI_UX_DESIGN_STANDARDS.md](./ui-ux/UI_UX_DESIGN_STANDARDS.md) | Design standards |
| [ui-ux/global-search.md](./ui-ux/global-search.md) | Global search UI |
| [ui-ux/navigation.md](./ui-ux/navigation.md) | Navigation |
| [ui-ux/tables.md](./ui-ux/tables.md) | AG Grid tables |
| [ui-ux/filters.md](./ui-ux/filters.md) | Filters |
| [ui-ux/notifications.md](./ui-ux/notifications.md) | Notifications UI |
| [ui-prototype/README.md](./ui-prototype/README.md) | Prototype pages (147) |
| [ui-prototype/PROTOTYPE_SHELL.md](./ui-prototype/PROTOTYPE_SHELL.md) | App shell |
| [ui-prototype/catalog/products/IMPLEMENTED_DESIGN.md](./ui-prototype/catalog/products/IMPLEMENTED_DESIGN.md) | As-built catalog products |
| [ui-prototype/storefront/IMPLEMENTED_DESIGN.md](./ui-prototype/storefront/IMPLEMENTED_DESIGN.md) | As-built AgainShop storefront (`/shop/*`) |

**Full page list:** [PAGE_REGISTRY.md](./PAGE_REGISTRY.md)

---

## 20. DevOps, QA & Roadmap

### DevOps

| Document | Description |
|----------|-------------|
| [deployment/README.md](./deployment/README.md) | Deployment hub |
| [deployment/docker.md](./deployment/docker.md) | Docker |
| [deployment/kubernetes.md](./deployment/kubernetes.md) | Kubernetes |
| [deployment/cicd.md](./deployment/cicd.md) | CI/CD |
| [deployment/vps.md](./deployment/vps.md) | VPS |
| [deployment/cpanel.md](./deployment/cpanel.md) | cPanel |
| [deployment/security-hardening.md](./deployment/security-hardening.md) | Security |
| [deployment/backup-strategy.md](./deployment/backup-strategy.md) | Backups |
| [deployment/disaster-recovery.md](./deployment/disaster-recovery.md) | DR |
| [deployment/monitoring.md](./deployment/monitoring.md) | Monitoring |

### QA

| Document | Description |
|----------|-------------|
| [qa/README.md](./qa/README.md) | QA hub |
| [qa/testing-strategy.md](./qa/testing-strategy.md) | Testing strategy |
| [qa/launch-checklist.md](./qa/launch-checklist.md) | Launch checklist |

### Roadmap

| Document | Description |
|----------|-------------|
| [roadmap/README.md](./roadmap/README.md) | Roadmap hub |
| [roadmap/PHASE_GATES.md](./roadmap/PHASE_GATES.md) | Phase gates |
| [MASTER_DEVELOPMENT_SEQUENCE.md](./MASTER_DEVELOPMENT_SEQUENCE.md) | 100-step sequence |

---

## Quick Reference — All Master Registries

| Registry | Link |
|----------|------|
| Documents | [DOCUMENT_REGISTRY.md](./DOCUMENT_REGISTRY.md) |
| Modules | [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) |
| Pages | [PAGE_REGISTRY.md](./PAGE_REGISTRY.md) |
| Database | [DATABASE_REGISTRY.md](./DATABASE_REGISTRY.md) |
| Entities | [ENTITY_RELATIONSHIP_REGISTRY.md](./ENTITY_RELATIONSHIP_REGISTRY.md) |
| Services | [SERVICE_REGISTRY.md](./SERVICE_REGISTRY.md) |
| APIs | [API_REGISTRY.md](./API_REGISTRY.md) |
| Workflows | [WORKFLOW_REGISTRY.md](./WORKFLOW_REGISTRY.md) |
| Dependencies | [MODULE_DEPENDENCY_MAP.md](./MODULE_DEPENDENCY_MAP.md) |
| AI Knowledge | [AI_KNOWLEDGE_INDEX.md](./AI_KNOWLEDGE_INDEX.md) |
| Traceability | [TRACEABILITY_MATRIX.md](./TRACEABILITY_MATRIX.md) |
| Changes | [CHANGELOG.md](./CHANGELOG.md) |
| Decisions | [ADR_INDEX.md](./ADR_INDEX.md) |

---

*End of Master Index — Step 24 · Maintainer: Platform Team · Last Updated: 2026-06-13*
