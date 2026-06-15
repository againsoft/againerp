# AgainERP — Traceability Matrix

> **Status:** Approved  
> **Version:** 2.0  
> **Project:** AgainERP  
> **Document Type:** Enterprise Traceability Matrix  
> **Purpose:** Track relationships from requirements through modules, pages, entities, services, workflows, permissions, APIs, and AI agents  
> **Governance:** [GOVERNANCE.md](./GOVERNANCE.md)

**Rule:** Every shipped requirement must trace forward to registries and backward to PRD. No orphan features.

### Step 26 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Complete traceability matrix | §1 |
| Traceability philosophy | §2 |
| Requirement tracking schema | §3 |
| Example chains (REQ-CATALOG-001) | §3 · §4 |
| Module through AI traceability | §5–§10 |
| Benefits | §11 |

**Related:** [PRD.md](./PRD.md) · [MASTER_INDEX.md](./MASTER_INDEX.md) · [PROJECT_MAP.md](./PROJECT_MAP.md) · [PAGE_REGISTRY.md](./PAGE_REGISTRY.md) · [MODULE_REGISTRY.md](./MODULE_REGISTRY.md)

---

## Executive Summary

```text
Requirement (PRD)
    ↓
Module → Pages → Entities → Services → APIs
    ↓         ↓        ↓         ↓
Workflows · Permissions · AI Agents · Events
    ↓
Status: Draft → Documented → Ready → Implemented
```

| Registry | Traces |
|----------|--------|
| [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | Modules |
| [PAGE_REGISTRY.md](./PAGE_REGISTRY.md) | Pages |
| [ENTITY_RELATIONSHIP_REGISTRY.md](./ENTITY_RELATIONSHIP_REGISTRY.md) | Entities |
| [SERVICE_REGISTRY.md](./SERVICE_REGISTRY.md) | Services |
| [API_REGISTRY.md](./API_REGISTRY.md) | API groups & operations |
| [WORKFLOW_REGISTRY.md](./WORKFLOW_REGISTRY.md) | Workflows |
| [PERMISSION_SYSTEM_ARCHITECTURE.md](./core/PERMISSION_SYSTEM_ARCHITECTURE.md) | Permissions |
| [AI_KNOWLEDGE_INDEX.md](./AI_KNOWLEDGE_INDEX.md) | AI agents & tools |

---

## 1. Purpose

### Why a Traceability Matrix Exists

AgainERP spans 560+ documents, 167+ admin pages, 18+ domains, and 11 AI agents. Without end-to-end traceability:

| Problem | Impact |
|---------|--------|
| Orphan screens | UI with no entity or API doc |
| Missing permissions | Endpoint ships without ACL |
| Broken change impact | Edit Product entity — unknown downstream |
| AI tool drift | Agent calls unregistered operation |
| Audit gaps | Requirement "done" with no workflow doc |

This matrix answers:

- **Which requirement owns this feature?**
- **What modules, pages, and entities does it touch?**
- **Which services, APIs, workflows, and permissions apply?**
- **Which AI agent may assist?**
- **What is the documentation / delivery status?**

### What This Document Is

| Is | Is Not |
|----|--------|
| Requirement → artifact map | Project management tool (Jira) |
| Impact analysis index | Test case repository |
| Governance checkpoint | Source code |
| Cross-registry linker | PRD replacement |

### Audience

| Role | Use |
|------|-----|
| Product | Verify PRD coverage |
| Architect | Impact analysis on changes |
| Developer | Find all artifacts for a feature |
| AI agent | Map tools to requirements |
| QA | Scope regression from REQ ID |

---

## 2. Traceability Philosophy

### Vertical Traceability (Forward)

```text
REQ-ID  →  Module  →  Page  →  Entity  →  Service  →  API  →  Workflow  →  Permission  →  AI Agent
```

Each layer must link to a **registered artifact**. If missing → documentation gap → PRE_CODE_GATE blocks code.

### Horizontal Traceability (Cross-Cutting)

Cross-cutting concerns (RBAC, audit, search, events) appear as **columns** on every requirement row — not separate silos.

### Single Source of Truth

| Layer | Authority |
|-------|-----------|
| Requirements | [PRD.md](./PRD.md) |
| Modules | [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) |
| Pages | [PAGE_REGISTRY.md](./PAGE_REGISTRY.md) |
| Entities | [ENTITY_RELATIONSHIP_REGISTRY.md](./ENTITY_RELATIONSHIP_REGISTRY.md) |
| Services | [SERVICE_REGISTRY.md](./SERVICE_REGISTRY.md) |
| APIs | [API_REGISTRY.md](./API_REGISTRY.md) |
| Workflows | [WORKFLOW_REGISTRY.md](./WORKFLOW_REGISTRY.md) |
| Permissions | [PERMISSION_SYSTEM_ARCHITECTURE.md](./core/PERMISSION_SYSTEM_ARCHITECTURE.md) |
| AI | [AI_KNOWLEDGE_INDEX.md](./AI_KNOWLEDGE_INDEX.md) |

Traceability matrix **links** — does not duplicate registry content.

### Status Lifecycle

| Status | Meaning |
|--------|---------|
| **Draft** | Requirement identified; docs incomplete |
| **Documented** | Architecture + registries updated |
| **Ready** | PRE_CODE_GATE passed — code allowed |
| **Implemented** | Code matches docs |
| **Verified** | QA / acceptance complete |

### ID Convention

```text
REQ-{DOMAIN}-{NNN}

Domains: CATALOG, INVENTORY, PURCHASE, SALES, CRM, MARKETING,
         FINANCE, ECOM, PLATFORM, CORE, AI, INDUSTRY
```

Legacy IDs (`REQ-001`) map to domain IDs in §4 migration table.

---

## 3. Requirement Tracking Schema

Every requirement row includes:

| Field | Description |
|-------|-------------|
| **Requirement ID** | `REQ-{DOMAIN}-{NNN}` |
| **Requirement Name** | Short title |
| **Requirement Description** | Business capability |
| **Owner Module** | Primary bounded context |
| **Related Pages** | PAGE_REGISTRY routes |
| **Related Entities** | ENTITY_RELATIONSHIP_REGISTRY |
| **Related Services** | SERVICE_REGISTRY |
| **Related APIs** | API_REGISTRY domain group / operations |
| **Related Workflows** | WORKFLOW_REGISTRY IDs |
| **Related Permissions** | Permission key patterns |
| **Related AI Agents** | AI_KNOWLEDGE_INDEX agents / tools |
| **Status** | Draft · Documented · Ready · Implemented · Verified |

---

## 4. Requirement Registry

### Example Chain (Canonical)

```text
REQ-CATALOG-001  Product Management
        ↓
   Catalog Module          [PRODUCT_MASTER_ARCHITECTURE.md]
        ↓
   Product Entity          [ENTITY_RELATIONSHIP_REGISTRY.md]
        ↓
   Catalog Service         [SERVICE_REGISTRY.md]
        ↓
   Product APIs            [API_REGISTRY.md — Catalog]
        ↓
   Approval Workflow       catalog.product · publish approval
        ↓
   Catalog Agent           [AI_KNOWLEDGE_INDEX.md §14]
```

---

### REQ-CATALOG-001 — Product Management

| Field | Value |
|-------|-------|
| **Requirement ID** | REQ-CATALOG-001 |
| **Requirement Name** | Product Management |
| **Requirement Description** | Master product data — SKUs, variants, categories, brands, attributes, publish lifecycle |
| **Owner Module** | Catalog |
| **Related Pages** | Product List, Add/Edit Product, Categories, Brands, Attributes ([Menus/Catalog/](./modules/ecommerce/Menus/Catalog/)) |
| **Related Entities** | Product, Product Variant, Category, Brand, Attribute Profile |
| **Related Services** | CatalogService, MediaService, WorkflowService, ApprovalService, SearchService |
| **Related APIs** | API Registry — Catalog: product list/get/create/update/publish/archive |
| **Related Workflows** | `catalog.product` (draft → published) |
| **Related Permissions** | `catalog.product.view`, `.create`, `.edit`, `.publish`, `.approve` |
| **Related AI Agents** | Catalog Agent · tools: `catalog.generate_description`, `catalog.generate_tags`, `catalog.generate_seo` |
| **Status** | Documented |

---

### REQ-CATALOG-002 — Product Reviews & Moderation

| Field | Value |
|-------|-------|
| **Requirement ID** | REQ-CATALOG-002 |
| **Requirement Name** | Product Reviews |
| **Requirement Description** | Customer reviews with moderation workflow |
| **Owner Module** | Catalog |
| **Related Pages** | Product Reviews ([Menus/Catalog/](./modules/ecommerce/Menus/Catalog/)) |
| **Related Entities** | Product Review |
| **Related Services** | CatalogService |
| **Related APIs** | Catalog — review list, moderate, approve, reject |
| **Related Workflows** | Review: pending → approved / rejected |
| **Related Permissions** | `catalog.review.view`, `catalog.review.moderate` |
| **Related AI Agents** | Catalog Agent (sentiment summary) |
| **Status** | Draft |

---

### REQ-INVENTORY-001 — Stock & Warehouse Management

| Field | Value |
|-------|-------|
| **Requirement ID** | REQ-INVENTORY-001 |
| **Requirement Name** | Stock & Warehouse Management |
| **Requirement Description** | Multi-warehouse stock levels, movements, reservations, transfers, adjustments |
| **Owner Module** | Inventory |
| **Related Pages** | Stock Management, Warehouses, Transfers, Adjustments ([Menus/Inventory/](./modules/ecommerce/Menus/Inventory/)) |
| **Related Entities** | Warehouse, Stock Item, Stock Level, Stock Movement, Stock Reservation |
| **Related Services** | InventoryService, CatalogService (variant ref) |
| **Related APIs** | API Registry — Inventory: stock, warehouse, adjustment, transfer, reserve |
| **Related Workflows** | `inventory.adjustment`, `inventory.transfer` |
| **Related Permissions** | `inventory.stock.view`, `inventory.adjustment.create/post`, `inventory.transfer.*`, `inventory.warehouse.*` |
| **Related AI Agents** | Inventory Agent · `inventory.forecast` |
| **Status** | Documented |

---

### REQ-PURCHASE-001 — Procurement

| Field | Value |
|-------|-------|
| **Requirement ID** | REQ-PURCHASE-001 |
| **Requirement Name** | Procurement |
| **Requirement Description** | RFQ, purchase orders, goods receipt, vendor bills, 3-way match |
| **Owner Module** | Purchase |
| **Related Pages** | Purchase Orders, RFQ, Receipts, Vendor Bills (planned screens) |
| **Related Entities** | Purchase Order, Goods Receipt, Vendor Bill, Vendor (Contact) |
| **Related Services** | PurchaseService, CatalogService, InventoryService, ContactService |
| **Related APIs** | API Registry — Purchase: PO, receipt, bill operations |
| **Related Workflows** | `purchase.order` (draft → approved → sent) |
| **Related Permissions** | `purchase.order.view/create/edit/approve`, `purchase.receipt.*`, `purchase.bill.*` |
| **Related AI Agents** | Purchase Agent · PO suggest, vendor match |
| **Status** | Documented |

---

### REQ-SALES-001 — Quote to Cash

| Field | Value |
|-------|-------|
| **Requirement ID** | REQ-SALES-001 |
| **Requirement Name** | Quote to Cash |
| **Requirement Description** | Quotations, sales orders, shipments, invoices, payments, returns |
| **Owner Module** | Sales |
| **Related Pages** | Orders, Quotations, Invoices, Shipments, Returns ([Menus/Sales/](./modules/ecommerce/Menus/Sales/)) |
| **Related Entities** | Quotation, Sales Order, Shipment, Sales Invoice, Payment, Customer (Contact) |
| **Related Services** | SalesService, CatalogService, InventoryService, CRMService, FinanceService (via events) |
| **Related APIs** | API Registry — Sales: quotation, order, shipment, invoice, payment |
| **Related Workflows** | `sales.order`, `sales.quotation`, `sales.invoice` |
| **Related Permissions** | `sales.order.*`, `sales.quotation.*`, `sales.invoice.*`, `sales.shipment.*` |
| **Related AI Agents** | Sales Agent · quote draft, discount suggest, forecast |
| **Status** | Documented |

---

### REQ-ECOM-001 — Storefront Commerce

| Field | Value |
|-------|-------|
| **Requirement ID** | REQ-ECOM-001 |
| **Requirement Name** | Storefront Commerce |
| **Requirement Description** | Carts, checkout, commerce orders, abandoned cart, storefront catalog |
| **Owner Module** | Ecommerce / Commerce |
| **Related Pages** | Storefront public pages ([ECOMMERCE_STOREFRONT_ARCHITECTURE.md](./modules/ecommerce/ECOMMERCE_STOREFRONT_ARCHITECTURE.md)); admin: Carts, Checkout ([Menus/Sales/](./modules/ecommerce/Menus/Sales/)) |
| **Related Entities** | Commerce Order, Cart, Customer (Contact) |
| **Related Services** | SalesService, CatalogService, InventoryService, MarketingService |
| **Related APIs** | API Registry — Commerce operations; integrates Sales/Catalog |
| **Related Workflows** | `commerce.order` (draft → delivered) |
| **Related Permissions** | `commerce.order.view/create`, `commerce.cart.view` |
| **Related AI Agents** | Sales Agent, Marketing Agent (abandoned cart) |
| **Status** | Documented |

**Legacy map:** REQ-002 Order Management

---

### REQ-CRM-001 — Lead & Pipeline Management

| Field | Value |
|-------|-------|
| **Requirement ID** | REQ-CRM-001 |
| **Requirement Name** | Lead & Pipeline Management |
| **Requirement Description** | Leads, accounts, opportunities, pipeline stages, conversion to customer |
| **Owner Module** | CRM |
| **Related Pages** | Leads, Opportunities, Pipeline (planned) |
| **Related Entities** | Lead, Account, Opportunity, CRM Task |
| **Related Services** | CRMService, ContactService, SalesService, ActivityService |
| **Related APIs** | API Registry — CRM: lead, opportunity, convert |
| **Related Workflows** | `crm.lead`, `crm.opportunity` |
| **Related Permissions** | `crm.lead.*`, `crm.opportunity.*`, `crm.account.*` |
| **Related AI Agents** | CRM Agent · lead score, NBA, enrichment |
| **Status** | Documented |

---

### REQ-MARKETING-001 — Campaigns & Promotions

| Field | Value |
|-------|-------|
| **Requirement ID** | REQ-MARKETING-001 |
| **Requirement Name** | Campaigns & Promotions |
| **Requirement Description** | Campaigns, segments, coupons, loyalty, email journeys |
| **Owner Module** | Marketing |
| **Related Pages** | Coupons, Campaigns, Loyalty ([Menus/Marketing/](./modules/ecommerce/Menus/Marketing/)) |
| **Related Entities** | Campaign, Coupon, Audience, Segment, Journey |
| **Related Services** | MarketingService, ContactService, CatalogService, NotificationService |
| **Related APIs** | API Registry — Marketing: campaign, coupon, segment |
| **Related Workflows** | `marketing.campaign` |
| **Related Permissions** | `marketing.campaign.*`, `marketing.coupon.*`, `marketing.segment.*` |
| **Related AI Agents** | Marketing Agent · campaign suggest, content draft |
| **Status** | Documented |

**Legacy map:** REQ-005 Marketing & Promotions

---

### REQ-FINANCE-001 — General Ledger & AR/AP

| Field | Value |
|-------|-------|
| **Requirement ID** | REQ-FINANCE-001 |
| **Requirement Name** | General Ledger & AR/AP |
| **Requirement Description** | Chart of accounts, journals, AR/AP, payments, bank reconciliation, fiscal periods |
| **Owner Module** | Finance |
| **Related Pages** | Journals, Invoices, Payments, Reconciliation (planned) |
| **Related Entities** | Journal Entry, AR Invoice, AP Bill, Payment, Chart of Account |
| **Related Services** | FinanceService |
| **Related APIs** | API Registry — Finance: journal, AR/AP, payment |
| **Related Workflows** | `finance.journal_entry`, fiscal period close |
| **Related Permissions** | `finance.journal.*`, `finance.ar_invoice.*`, `finance.payment.*`, `finance.period.close` |
| **Related AI Agents** | Finance Agent · reconcile match, collection priority |
| **Status** | Documented |

---

### REQ-PLATFORM-001 — Role-Based Access Control

| Field | Value |
|-------|-------|
| **Requirement ID** | REQ-PLATFORM-001 |
| **Requirement Name** | Role-Based Access Control |
| **Requirement Description** | Global RBAC, field ACL, branch/warehouse scope on all operations |
| **Owner Module** | Core |
| **Related Pages** | Users, Roles, Permissions ([Menus/System/](./modules/ecommerce/Menus/System/)) |
| **Related Entities** | User, Role, Permission |
| **Related Services** | PermissionService, UserService, RoleService |
| **Related APIs** | API Registry — Users: auth, user, role operations |
| **Related Workflows** | — |
| **Related Permissions** | `core.user.*`, `core.role.manage`, `core.permission.manage` |
| **Related AI Agents** | — (all agents inherit user permissions) |
| **Status** | Documented |

---

### REQ-PLATFORM-002 — Global Search

| Field | Value |
|-------|-------|
| **Requirement ID** | REQ-PLATFORM-002 |
| **Requirement Name** | Global Search |
| **Requirement Description** | Cross-module search bar, autocomplete, Meilisearch indexes, AI NL search |
| **Owner Module** | Core / Search |
| **Related Pages** | Global search bar (all modules) · [ui-ux/global-search.md](./ui-ux/global-search.md) |
| **Related Entities** | Search Document (derived) |
| **Related Services** | SearchService, PermissionService, AISearchService |
| **Related APIs** | API Registry — Search: search, autocomplete, suggestions |
| **Related Workflows** | — |
| **Related Permissions** | `core.search.use`, `core.search.admin`, `ai.search.use` |
| **Related AI Agents** | All agents (read via SearchService) |
| **Status** | Documented |

---

### REQ-PLATFORM-003 — Notifications

| Field | Value |
|-------|-------|
| **Requirement ID** | REQ-PLATFORM-003 |
| **Requirement Name** | Multi-Channel Notifications |
| **Requirement Description** | Email, SMS, push, in-app, Slack, WhatsApp — template and rule driven |
| **Owner Module** | Core / Notifications |
| **Related Pages** | Notifications, Templates ([ui-ux/notifications.md](./ui-ux/notifications.md)) |
| **Related Entities** | Notification, Notification Template |
| **Related Services** | NotificationService, SettingsService |
| **Related APIs** | API Registry — Notifications: in-app, send, preferences |
| **Related Workflows** | — (event-triggered) |
| **Related Permissions** | `core.notification.view`, `.manage_preferences`, `.admin` |
| **Related AI Agents** | — (personalization via template only) |
| **Status** | Documented |

---

### REQ-PLATFORM-004 — Workflow & Approvals

| Field | Value |
|-------|-------|
| **Requirement ID** | REQ-PLATFORM-004 |
| **Requirement Name** | Workflow & Approvals |
| **Requirement Description** | Platform state machines and human approval gates on all gated entities |
| **Owner Module** | Core |
| **Related Pages** | Approval queues, workflow history (system) |
| **Related Entities** | Workflow Instance, Approval Request |
| **Related Services** | WorkflowService, ApprovalService |
| **Related APIs** | API Registry — Workflow, Approvals |
| **Related Workflows** | `core.approval`, per-entity workflows |
| **Related Permissions** | `core.workflow.*`, `core.approval.approve/reject/delegate` |
| **Related AI Agents** | — (AI submits approval; cannot self-approve) |
| **Status** | Documented |

---

### REQ-PLATFORM-005 — Multi-Tenant SaaS

| Field | Value |
|-------|-------|
| **Requirement ID** | REQ-PLATFORM-005 |
| **Requirement Name** | Multi-Tenant SaaS |
| **Requirement Description** | Tenant provisioning, plans, billing, feature flags, module install |
| **Owner Module** | Platform |
| **Related Pages** | Tenant, Billing (prototype) |
| **Related Entities** | Organization (Company), Tenant |
| **Related Services** | TenantService, SettingsService |
| **Related APIs** | API Registry — Platform: tenant, plans, modules |
| **Related Workflows** | Subscription lifecycle |
| **Related Permissions** | `platform.tenant.*`, `platform.modules.install` |
| **Related AI Agents** | Developer Agent |
| **Status** | Draft |

**Legacy map:** REQ-007 Multi-Tenant SaaS

---

### REQ-AI-001 — AI Operating System

| Field | Value |
|-------|-------|
| **Requirement ID** | REQ-AI-001 |
| **Requirement Name** | AI Operating System |
| **Requirement Description** | Chief Agent, domain agents, tool registry, audit, approval, credits |
| **Owner Module** | AI OS (platform service) |
| **Related Pages** | AI screens ([Menus/AI/](./modules/ecommerce/Menus/AI/)) |
| **Related Entities** | AI Task, Conversation, Tool Invocation |
| **Related Services** | AIService, PermissionService, ApprovalService, AuditService |
| **Related APIs** | API Registry — AI: chat, tool invoke, agent run |
| **Related Workflows** | `ai.tool_invocation` |
| **Related Permissions** | `ai.access`, `ai.tool.execute`, `ai.agent.run` |
| **Related AI Agents** | Chief Agent + all domain agents |
| **Status** | Documented |

**Legacy map:** REQ-008 AI OS Platform

---

### REQ-ECOM-002 — Admin Dashboard

| Field | Value |
|-------|-------|
| **Requirement ID** | REQ-ECOM-002 |
| **Requirement Name** | Admin Dashboard |
| **Requirement Description** | KPI widgets, alerts, recent activity, cross-module analytics |
| **Owner Module** | Ecommerce / Dashboard |
| **Related Pages** | Overview, Analytics ([Menus/Dashboard/](./modules/ecommerce/Menus/Dashboard/)) |
| **Related Entities** | — (aggregates from Sales, Catalog, Inventory) |
| **Related Services** | SalesService, CatalogService, InventoryService (read) |
| **Related APIs** | Dashboard API group (analytics read) |
| **Related Workflows** | — |
| **Related Permissions** | `ecommerce.dashboard.view`, `.analytics` |
| **Related AI Agents** | Analytics Agent |
| **Status** | Draft |

**Legacy map:** REQ-006 Admin Dashboard

---

### Legacy ID Migration

| Legacy ID | Domain ID | Name |
|-----------|-----------|------|
| REQ-001 | REQ-CATALOG-001 | Product Management |
| REQ-002 | REQ-ECOM-001 | Storefront Commerce |
| REQ-003 | REQ-INVENTORY-001 | Stock Management |
| REQ-004 | REQ-CRM-001 (partial) + Contact | Customer Management |
| REQ-005 | REQ-MARKETING-001 | Marketing |
| REQ-006 | REQ-ECOM-002 | Dashboard |
| REQ-007 | REQ-PLATFORM-005 | Multi-Tenant SaaS |
| REQ-008 | REQ-AI-001 | AI OS |

---

## 5. Module Traceability

| Module | Requirements | Architecture Doc | Manifest |
|--------|--------------|------------------|----------|
| Catalog | REQ-CATALOG-001, 002 | [PRODUCT_MASTER_ARCHITECTURE.md](./modules/core/PRODUCT_MASTER_ARCHITECTURE.md) | core/ModuleManifest |
| Inventory | REQ-INVENTORY-001 | [INVENTORY_MODULE_ARCHITECTURE.md](./modules/inventory/INVENTORY_MODULE_ARCHITECTURE.md) | inventory |
| Purchase | REQ-PURCHASE-001 | [PURCHASE_MODULE_ARCHITECTURE.md](./modules/purchase/PURCHASE_MODULE_ARCHITECTURE.md) | purchase |
| Sales | REQ-SALES-001 | [SALES_MODULE_ARCHITECTURE.md](./modules/sales/SALES_MODULE_ARCHITECTURE.md) | sales |
| CRM | REQ-CRM-001 | [CRM_MODULE_ARCHITECTURE.md](./modules/crm/CRM_MODULE_ARCHITECTURE.md) | crm |
| Marketing | REQ-MARKETING-001 | [MARKETING_MODULE_ARCHITECTURE.md](./modules/marketing/MARKETING_MODULE_ARCHITECTURE.md) | marketing |
| Finance | REQ-FINANCE-001 | [FINANCE_MODULE_ARCHITECTURE.md](./modules/finance/FINANCE_MODULE_ARCHITECTURE.md) | finance |
| Ecommerce | REQ-ECOM-001, 002 | [modules/ecommerce/Architecture.md](./modules/ecommerce/Architecture.md) | ecommerce |
| Core | REQ-PLATFORM-001–004 | [core/ARCHITECTURE.md](./core/ARCHITECTURE.md) | core |
| Platform | REQ-PLATFORM-005 | [SAAS_PLATFORM_ARCHITECTURE.md](./SAAS_PLATFORM_ARCHITECTURE.md) | platform |
| AI OS | REQ-AI-001 | [AI_OS_ARCHITECTURE.md](./modules/ai/AI_OS_ARCHITECTURE.md) | ai |

**Dependency map:** [MODULE_DEPENDENCY_MAP.md](./MODULE_DEPENDENCY_MAP.md)

---

## 6. Entity Traceability

| Entity | Owner Module | Requirements | Registry |
|--------|--------------|--------------|----------|
| Product | Catalog | REQ-CATALOG-001 | [ENTITY_CATALOG.md](./modules/ecommerce/catalog/ENTITY_CATALOG.md) · [ENTITY_RELATIONSHIP_REGISTRY.md](./ENTITY_RELATIONSHIP_REGISTRY.md) |
| Product Variant | Catalog | REQ-CATALOG-001 | [ENTITY_CATALOG.md](./modules/ecommerce/catalog/ENTITY_CATALOG.md) §4.2 |
| Category / Brand | Catalog | REQ-CATALOG-001 | [ENTITY_CATALOG.md](./modules/ecommerce/catalog/ENTITY_CATALOG.md) §4.4–§4.5 |
| Warehouse / Stock | Inventory | REQ-INVENTORY-001 | [ENTITY_INVENTORY.md](./modules/inventory/ENTITY_INVENTORY.md) · [ENTITY_RELATIONSHIP_REGISTRY.md](./ENTITY_RELATIONSHIP_REGISTRY.md) |
| Purchase Order | Purchase | REQ-PURCHASE-001 | [ENTITY_PURCHASE.md](./modules/purchase/ENTITY_PURCHASE.md) · [ENTITY_RELATIONSHIP_REGISTRY.md](./ENTITY_RELATIONSHIP_REGISTRY.md) |
| Sales Order | Sales | REQ-SALES-001, REQ-ECOM-001 | [ENTITY_SALES.md](./modules/sales/ENTITY_SALES.md) · [ENTITY_RELATIONSHIP_REGISTRY.md](./ENTITY_RELATIONSHIP_REGISTRY.md) |
| Quotation / Invoice | Sales | REQ-SALES-001 | [ENTITY_SALES.md](./modules/sales/ENTITY_SALES.md) §4.3 · §4.9 |
| Customer | Core Contact | REQ-CRM-001, REQ-SALES-001 | [ENTITY_SALES.md](./modules/sales/ENTITY_SALES.md) §4.1 |
| Lead / Opportunity | CRM | REQ-CRM-001 | §4 |
| Campaign / Coupon | Marketing | REQ-MARKETING-001 | §4 |
| Journal Entry | Finance | REQ-FINANCE-001 | §4 |
| User / Role | Core | REQ-PLATFORM-001 | §3 |
| Workflow Instance | Core | REQ-PLATFORM-004 | §4 |
| Approval Request | Core | REQ-PLATFORM-004 | §4 |
| Notification | Core | REQ-PLATFORM-003 | §4 |
| AI Task | AI OS | REQ-AI-001 | §4 |

**Database ownership:** [DATABASE_REGISTRY.md](./DATABASE_REGISTRY.md) §4–§5

---

## 7. Service Traceability

| Service | Requirements | Consumers (from matrix) |
|---------|--------------|-------------------------|
| CatalogService | REQ-CATALOG-001 | Sales, Inventory, Purchase, Marketing, AI |
| InventoryService | REQ-INVENTORY-001 | Sales, Purchase, Catalog, Ecommerce |
| PurchaseService | REQ-PURCHASE-001 | Inventory, Finance |
| SalesService | REQ-SALES-001, REQ-ECOM-001 | Finance, CRM, Inventory, Marketing |
| CRMService | REQ-CRM-001 | Sales, Marketing |
| MarketingService | REQ-MARKETING-001 | Sales, Ecommerce |
| FinanceService | REQ-FINANCE-001 | — (event consumer) |
| PermissionService | REQ-PLATFORM-001 | All |
| SearchService | REQ-PLATFORM-002 | All UI, AI |
| NotificationService | REQ-PLATFORM-003 | All modules |
| WorkflowService | REQ-PLATFORM-004 | Catalog, Sales, Purchase, Finance |
| ApprovalService | REQ-PLATFORM-004 | Catalog, Purchase, Sales, Finance, AI |
| AIService | REQ-AI-001 | All agents |

**Full registry:** [SERVICE_REGISTRY.md](./SERVICE_REGISTRY.md)

---

## 8. Workflow Traceability

| Workflow ID | Requirement | Entity | Key Transitions | Events |
|-------------|-------------|--------|-----------------|--------|
| `catalog.product` | REQ-CATALOG-001 | Product | draft → published | `catalog.product.published` |
| `commerce.order` | REQ-ECOM-001 | Commerce Order | draft → delivered | `commerce.order.confirmed`, … |
| `sales.order` | REQ-SALES-001 | Sales Order | draft → confirmed → closed | `sales.order.confirmed` |
| `sales.quotation` | REQ-SALES-001 | Quotation | draft → sent → accepted | `sales.quotation.sent` |
| `purchase.order` | REQ-PURCHASE-001 | PO | draft → approved → sent | `purchase.order.approved` |
| `inventory.adjustment` | REQ-INVENTORY-001 | Adjustment | draft → posted | `inventory.adjustment.posted` |
| `inventory.transfer` | REQ-INVENTORY-001 | Transfer | draft → done | `inventory.movement.posted` |
| `crm.lead` | REQ-CRM-001 | Lead | new → converted | `crm.lead.converted` |
| `marketing.campaign` | REQ-MARKETING-001 | Campaign | draft → running | `marketing.campaign.started` |
| `finance.journal_entry` | REQ-FINANCE-001 | Journal | draft → posted | `finance.journal.posted` |
| `ai.tool_invocation` | REQ-AI-001 | AI Task | pending → executed | `ai.tool.invoked` |

**Registry:** [WORKFLOW_REGISTRY.md](./WORKFLOW_REGISTRY.md)

---

## 9. Permission Traceability

| Permission Pattern | Requirements | Enforced On |
|--------------------|--------------|-------------|
| `catalog.product.*` | REQ-CATALOG-001 | Product CRUD, publish |
| `inventory.stock.*` | REQ-INVENTORY-001 | Stock views, movements |
| `inventory.adjustment.*` | REQ-INVENTORY-001 | Adjustments |
| `purchase.order.*` | REQ-PURCHASE-001 | PO lifecycle |
| `sales.order.*` | REQ-SALES-001 | Order confirm, cancel |
| `sales.invoice.*` | REQ-SALES-001 | Invoice post |
| `crm.lead.*` | REQ-CRM-001 | Lead CRUD, convert |
| `marketing.campaign.*` | REQ-MARKETING-001 | Campaign launch |
| `finance.journal.*` | REQ-FINANCE-001 | GL posting |
| `core.user.*` / `core.role.*` | REQ-PLATFORM-001 | Identity admin |
| `core.search.*` | REQ-PLATFORM-002 | Global search |
| `core.notification.*` | REQ-PLATFORM-003 | Notifications |
| `core.approval.*` | REQ-PLATFORM-004 | Approval actions |
| `ai.tool.execute` | REQ-AI-001 | All AI tools |

**Registry:** [PERMISSION_SYSTEM_ARCHITECTURE.md](./core/PERMISSION_SYSTEM_ARCHITECTURE.md)

---

## 10. AI Traceability

| AI Agent | Requirements | Primary Service | Key Tools | Approval |
|----------|--------------|-----------------|-----------|----------|
| Catalog Agent | REQ-CATALOG-001 | CatalogService | generate_description, generate_tags, generate_seo | Publish |
| Inventory Agent | REQ-INVENTORY-001 | InventoryService | forecast, reorder suggest | Adjustment post |
| Purchase Agent | REQ-PURCHASE-001 | PurchaseService | po_suggest, vendor_match | PO approve |
| Sales Agent | REQ-SALES-001 | SalesService | quote_draft, discount_suggest | Confirm/discount |
| CRM Agent | REQ-CRM-001 | CRMService | lead_score, nba | Convert |
| Marketing Agent | REQ-MARKETING-001 | MarketingService | campaign_suggest, content_draft | Launch |
| Finance Agent | REQ-FINANCE-001 | FinanceService | reconcile_match | Journal post |
| SEO Agent | REQ-CATALOG-001 | CatalogService | meta, schema | Bulk slug |
| Support Agent | REQ-ECOM-001 | SupportService | ticket_summarize | Public reply |
| Analytics Agent | REQ-ECOM-002 | Report services | kpi_narrative | — |
| Developer Agent | REQ-AI-001 | Read-only docs | doc_rag, schema_read | Migration |
| Chief Agent | REQ-AI-001 | AIService | delegate | High-risk chain |

**Registry:** [AI_KNOWLEDGE_INDEX.md](./AI_KNOWLEDGE_INDEX.md) §14

---

## 11. Benefits

### Impact Analysis

```text
Change: Add field to Product entity
  → REQ-CATALOG-001
  → CatalogService, Catalog API, Search index, Catalog Agent tools
  → Pages: Product List, Add Product
  → Permissions: catalog.product.edit
  → Events: catalog.product.updated
```

Use this matrix + [MODULE_DEPENDENCY_MAP.md](./MODULE_DEPENDENCY_MAP.md) before any schema or API change.

### Change Management

| Step | Action |
|------|--------|
| 1 | Identify affected REQ-ID(s) |
| 2 | Update module ARCHITECTURE.md |
| 3 | Update registries (entity, service, API, workflow, permission) |
| 4 | Update PAGE_REGISTRY if UI changes |
| 5 | Update AI_KNOWLEDGE_INDEX if tools change |
| 6 | CHANGELOG entry |
| 7 | Advance status column |

### Architecture Governance

- PRE_CODE_GATE verifies traceability row exists and status ≥ Documented
- No **Ready** without linked workflow + permission keys
- Cross-cutting REQs (PLATFORM-*) apply to all domain features

### AI Knowledge Mapping

- Each tool registers against REQ-ID + Service method
- Chief Agent routing uses requirement → agent map (§10)
- RAG ingests this matrix for "what does REQ-X touch?"

### Enterprise Documentation Control

| Artifact | Traceability role |
|----------|-------------------|
| PRD | Source requirements |
| TRACEABILITY_MATRIX | Links PRD to registries |
| Registries | Authoritative detail |
| CHANGELOG | Temporal audit of REQ changes |
| TRACEABILITY_MATRIX status | Delivery gate |

---

## 12. Matrix Maintenance Checklist

On every feature or requirement change:

- [ ] REQ row created or updated in §4
- [ ] [PAGE_REGISTRY.md](./PAGE_REGISTRY.md) — screens listed
- [ ] [ENTITY_RELATIONSHIP_REGISTRY.md](./ENTITY_RELATIONSHIP_REGISTRY.md) — entities listed
- [ ] [SERVICE_REGISTRY.md](./SERVICE_REGISTRY.md) — service methods listed
- [ ] [API_REGISTRY.md](./API_REGISTRY.md) — operations listed
- [ ] [WORKFLOW_REGISTRY.md](./WORKFLOW_REGISTRY.md) — workflow ID (if stateful)
- [ ] [PERMISSION_SYSTEM_ARCHITECTURE.md](./core/PERMISSION_SYSTEM_ARCHITECTURE.md) — keys listed
- [ ] [AI_KNOWLEDGE_INDEX.md](./AI_KNOWLEDGE_INDEX.md) — agents/tools (if AI)
- [ ] [CHANGELOG.md](./CHANGELOG.md) — entry exists
- [ ] Status column advanced

---

## Appendix — Traceability Diagram

```text
                    ┌─────────────┐
                    │    PRD.md   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  REQ-ID     │
                    └──────┬──────┘
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
    ┌─────────┐      ┌──────────┐      ┌──────────┐
    │ Module  │      │  Pages   │      │ Entities │
    └────┬────┘      └────┬─────┘      └────┬─────┘
         │                │                 │
         └────────────────┼─────────────────┘
                          ▼
                   ┌─────────────┐
                   │  Services   │
                   └──────┬──────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
         ┌────────┐  ┌─────────┐  ┌────────┐
         │  APIs  │  │Workflow │  │  Perms │
         └────────┘  └────┬────┘  └────────┘
                           │
                      ┌────▼────┐
                      │ AI Agent│
                      └─────────┘
```

---

*End of Traceability Matrix — Step 26 · Maintainer: Platform Team · Last Updated: 2026-06-13*
