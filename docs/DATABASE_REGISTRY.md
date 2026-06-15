# AgainERP — Database Registry

> **Status:** Approved  
> **Version:** 1.0  
> **Project:** AgainERP  
> **DBMS:** PostgreSQL  
> **Document Type:** Enterprise Database Blueprint Registry  
> **Architecture:** Domain Driven Design · Modular Monolith · Event Driven · Documentation First  
> **Governance:** [GOVERNANCE.md](./GOVERNANCE.md) · **Standards:** [database/standards.md](./database/standards.md)

**No SQL schemas. No migrations. No DDL.**  
This document is the **master database blueprint registry** — domains, entities, ownership, relationships, and governance rules. Physical schema design defers to implementation gated by [PRE_CODE_GATE.md](./PRE_CODE_GATE.md).

### Step 14 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Master database registry (blueprint, not SQL) | §1 Purpose |
| DDD · Modular Monolith · Event Driven | §2 · §3 |
| Six database layers | §3 |
| Domain registry (18 domains) | §4 |
| Entity registry with 8 attributes per entity | §5 |
| Shared core entities | §6 |
| Naming, tenant, audit, soft delete, expansion, governance | §7–§12 |

**Related:** [database/MASTER_DATABASE_ARCHITECTURE.md](./database/MASTER_DATABASE_ARCHITECTURE.md) · [ENTITY_RELATIONSHIP_REGISTRY.md](./ENTITY_RELATIONSHIP_REGISTRY.md) · [database/ER_DIAGRAM.md](./database/ER_DIAGRAM.md) · [database/naming-conventions.md](./database/naming-conventions.md) · [database/multi-company.md](./database/multi-company.md) · [database/audit-trail.md](./database/audit-trail.md) · [WORKFLOW_REGISTRY.md](./WORKFLOW_REGISTRY.md)

---

## Executive Summary

The Database Registry is AgainERP's **canonical map of data ownership** — what exists, who owns it, how domains connect, and which platform capabilities every entity supports.

| Principle | Rule |
|-----------|------|
| **Single owner per entity** | One domain writes; others consume via FK to Core or events |
| **Registry before DDL** | Entities registered here before migration authoring |
| **No cross-domain writes** | Modules emit events — never UPDATE sibling tables |
| **PostgreSQL OLTP** | Primary store; search/analytics are derived layers |
| **Multi-tenant by company** | `company_id` on all business entities |
| **Activity / Workflow / Approval** | Declared per entity in registry |
| **AI reads via services** | AI OS never registered as table owner of business data |

---

## 1. Purpose

### Why a Database Registry Exists

AgainERP spans 18+ data domains across ecommerce, ERP, AI, and platform services. Without a master registry:

| Problem | Impact |
|---------|--------|
| Duplicate entity definitions | `customers` vs `contacts`, `products` in every module |
| Unknown ownership | Two modules UPDATE same rows |
| Missing audit/activity | Compliance gaps discovered late |
| Schema drift | Code and docs diverge |
| AI direct DB access temptation | Ungoverned writes |

The Database Registry answers:

- **What entities exist?**
- **Which domain owns each entity?**
- **How do domains relate?**
- **Which platform capabilities apply?**

### What This Document Is

| Is | Is Not |
|----|--------|
| Blueprint registry of domains and entities | SQL `CREATE TABLE` scripts |
| Ownership and relationship map | Column-level schema spec |
| Governance rules for expansion | Migration files |
| Index of Activity / AI / Approval support | ORM model code |

### Registry Entry Schema (Entity Level)

Every entity in §5 is described by:

| Attribute | Description |
|-----------|-------------|
| **Entity Name** | Canonical business name |
| **Purpose** | Why it exists |
| **Owner Domain** | Single write owner |
| **Relationships** | Logical links (not FK DDL) |
| **Lifecycle** | States / workflow ID if applicable |
| **Activity Support** | Timeline, chatter, followers |
| **AI Support** | Agent tools / read scope |
| **Approval Support** | Gates that block transitions |

---

## 2. Database Philosophy

AgainERP data architecture follows five pillars:

### Domain Driven Design

- **Bounded context** = registry domain (Catalog, Sales, Finance, …)
- Each context owns its aggregates; references other contexts by ID or Core entity
- **Ubiquitous language** — entity names match module architecture docs

### Modular Monolith

- Single PostgreSQL database (per deployment tier)
- **Namespace isolation** via table prefix (`sales_*`, `finance_*`, …)
- Module boundaries enforced in **application services**, not separate databases
- Future extraction to microservices possible because ownership is already explicit

### Event Driven

```text
Domain aggregate saved (owner module)
  → COMMIT
  → domain event published
  → async consumers: Search, Analytics, Notifications, AI context cache
```

- OLTP tables stay normalized
- **No cross-module UPDATE in event handlers** — handlers call owner API or write to own derived tables only

### Documentation First

- Entity must appear in this registry **before** migration PR
- Registry change → CHANGELOG entry
- [MASTER_DATABASE_ARCHITECTURE.md](./database/MASTER_DATABASE_ARCHITECTURE.md) expands physical patterns; this registry defines **what** not **how**

### PostgreSQL as System of Record

| Store | Role |
|-------|------|
| **PostgreSQL** | OLTP — all registered entities |
| **Redis** | Cache, session, queue driver |
| **Meilisearch / Elasticsearch** | Search indexes (derived) |
| **Object storage** | Binary media bytes |
| **Vector store** | AI embeddings (AI layer — derived) |

---

## 3. Database Layers

Six logical layers stack from SaaS platform down to infrastructure. **Entities belong to exactly one layer** (Industry entities also tag an industry profile).

```text
┌─────────────────────────────────────────────────────────────────┐
│  Platform Layer     SaaS tenancy, billing, module install        │
├─────────────────────────────────────────────────────────────────┤
│  Core Layer         Identity, parties, collaboration, settings   │
├─────────────────────────────────────────────────────────────────┤
│  Business Layer     Catalog, Sales, Finance, CRM, …             │
├─────────────────────────────────────────────────────────────────┤
│  Industry Layer     Hospital, School, Manufacturing extensions   │
├─────────────────────────────────────────────────────────────────┤
│  AI Layer           Prompts, audit, memory — NOT business data  │
├─────────────────────────────────────────────────────────────────┤
│  Infrastructure     Jobs, events, search indexes, analytics facts │
└─────────────────────────────────────────────────────────────────┘
```

### Platform Layer

| Scope | Examples |
|-------|----------|
| SaaS operator | Tenant, subscription plan, platform invoice |
| Module registry | Installed modules, feature flags |
| **Rule** | Platform rows may span tenants; business rows never live here |

### Core Layer

| Scope | Examples |
|-------|----------|
| Shared across all modules | User, Organization (Company), Branch, Contact, Media, Activity |
| Platform engines | Workflow definition, Approval policy (metadata) |
| **Rule** | Core owns party master — no `crm_contacts`, `sales_customers` duplicates |

### Business Layer

| Scope | Examples |
|-------|----------|
| ERP & ecommerce domains | Product, Stock Level, Sales Order, GL Journal |
| **Rule** | Prefix `{domain}_*` · `company_id` required |

### Industry Layer

| Scope | Examples |
|-------|----------|
| Vertical extensions | Patient Admission, Student Enrollment, Work Order |
| **Rule** | Extends Core/Business via profile FK — **no schema fork** of Product or Contact |

### AI Layer

| Scope | Examples |
|-------|----------|
| AI OS platform data | Agent registry, prompts, audit logs, embeddings |
| **Rule** | AI does **not** own business entities — references via `source_type` + `source_id` only |

### Infrastructure Layer

| Scope | Examples |
|-------|----------|
| Derived / operational | Domain event outbox, job queue, search document, analytics daily fact |
| **Rule** | Rebuildable from OLTP — not source of truth for business state |

---

## 4. Domain Registry

Canonical domains registered in AgainERP. Each domain has a **namespace prefix**, **owning module doc**, and **API base**.

| Domain | Prefix | Layer | Owner Module Doc | API Base |
|--------|--------|-------|------------------|----------|
| **Catalog** | `catalog_*` | Business | [PRODUCT_MASTER_ARCHITECTURE.md](./modules/core/PRODUCT_MASTER_ARCHITECTURE.md) | `/api/v1/catalog/` |
| **Inventory** | `inventory_*` | Business | [INVENTORY_MODULE_ARCHITECTURE.md](./modules/inventory/INVENTORY_MODULE_ARCHITECTURE.md) | `/api/v1/inventory/` |
| **Purchase** | `purchase_*` | Business | [PURCHASE_MODULE_ARCHITECTURE.md](./modules/purchase/PURCHASE_MODULE_ARCHITECTURE.md) | `/api/v1/purchase/` |
| **Sales** | `sales_*` | Business | [SALES_MODULE_ARCHITECTURE.md](./modules/sales/SALES_MODULE_ARCHITECTURE.md) | `/api/v1/sales/` |
| **CRM** | `crm_*` | Business | [CRM_MODULE_ARCHITECTURE.md](./modules/crm/CRM_MODULE_ARCHITECTURE.md) | `/api/v1/crm/` |
| **Marketing** | `marketing_*` | Business | [MARKETING_MODULE_ARCHITECTURE.md](./modules/marketing/MARKETING_MODULE_ARCHITECTURE.md) | `/api/v1/marketing/` |
| **Finance** | `finance_*` | Business | [FINANCE_MODULE_ARCHITECTURE.md](./modules/finance/FINANCE_MODULE_ARCHITECTURE.md) | `/api/v1/finance/` |
| **AI OS** | `ai_*` | AI | [AI_OS_ARCHITECTURE.md](./modules/ai/AI_OS_ARCHITECTURE.md) | `/api/v1/ai/os/` |
| **Workflow** | `workflow_*` | Core | [WORKFLOW_ENGINE_ARCHITECTURE.md](./core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md) | `/api/v1/core/workflows/` |
| **Approvals** | `approval_*` | Core | [APPROVAL_ENGINE_ARCHITECTURE.md](./core/engines/APPROVAL_ENGINE_ARCHITECTURE.md) | `/api/v1/core/approvals/` |
| **Activities** | `activity_*` / Core | Core | [ACTIVITY_CHATTER_ARCHITECTURE.md](./modules/core/ACTIVITY_CHATTER_ARCHITECTURE.md) | `/api/v1/core/activities/` |
| **Notifications** | `notification_*` | Core | [core/ARCHITECTURE.md](./core/ARCHITECTURE.md) | `/api/v1/core/notifications/` |
| **Search** | `search_*` | Infrastructure | [core/engines/GLOBAL_SEARCH_ARCHITECTURE.md](./core/engines/GLOBAL_SEARCH_ARCHITECTURE.md) | `/api/v1/core/search/` |
| **Media** | `media_*` | Core | [core/entities/media-library.md](./core/entities/media-library.md) | `/api/v1/core/media/` |
| **Users** | `users` / `user_*` | Core | [core/entities/users.md](./core/entities/users.md) | `/api/v1/core/users/` |
| **Roles** | `roles` / `role_*` | Core | [core/entities/roles.md](./core/entities/roles.md) | `/api/v1/core/roles/` |
| **Permissions** | `permissions` / `permission_*` | Core | [core/entities/permissions.md](./core/entities/permissions.md) | `/api/v1/core/permissions/` |
| **Settings** | `settings_*` / `company_settings` | Core | [SETTINGS_ARCHITECTURE.md](./modules/core/SETTINGS_ARCHITECTURE.md) | `/api/v1/core/settings/` |

### Commerce (Ecommerce) Note

Ecommerce order engine uses `commerce_*` prefix under Business layer — consumed by Sales for omnichannel. Registered under Sales/Commerce integration in module docs; not a separate registry domain row to avoid duplicate order entities.

### Domain Dependency Rules

```text
Business domains → MAY FK to Core (contacts, companies, media)
Business domains → MUST NOT FK to sibling business aggregates (prefer event + service)
Finance → receives events from Sales, Purchase, Inventory — does not own their documents
AI OS → reads via services — registers only ai_* entities
```

---

## 5. Entity Registry

Entities grouped by domain. **Registry IDs** use `{domain}.{entity}` notation for workflow and activity polymorphic keys.

---

### 5.1 Catalog Domain

**Full business profiles:** [ENTITY_CATALOG.md](./modules/ecommerce/catalog/ENTITY_CATALOG.md) — 17 entities with permissions, AI, search, and lifecycle detail.

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **Product** | Master sellable/stockable item | Catalog | → Categories, Brand, Variants, Media | draft → pending_approval → published → archived | ✓ Full | Catalog Agent — copy, tags, SEO draft | Publish |
| **Product Variant** | SKU / sellable unit | Catalog | → Product, Variant attributes | follows Product | ✓ | Price suggest | Price change |
| **Category** | Merchandising tree | Catalog | → Parent category, Products (M:N) | active / archived | ✓ | Category SEO | — |
| **Brand** | Manufacturer label | Catalog | → Products | active | ✓ | — | — |
| **Attribute Profile** | Spec template (Laptop, etc.) | Catalog | → Categories, Attribute groups | active | ✓ | Spec assist | — |
| **Collection** | Curated product sets | Catalog | → Products, Rules | active | ✓ | Merchandising suggest | — |
| **Product Review** | Customer review | Catalog | → Product, Contact | pending → approved → rejected | ✓ | Summary, sentiment | Moderation |

---

### 5.2 Inventory Domain

**Full business profiles:** [ENTITY_INVENTORY.md](./modules/inventory/ENTITY_INVENTORY.md) — 15 entities with permissions, AI, and multi-industry channel matrix.

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **Warehouse** | Stock location | Inventory | → Branch, Company | active / inactive | ✓ | — | — |
| **Stock Item** | Inventory tracking unit | Inventory | → Product Variant | active | ✓ | — | — |
| **Stock Level** | Qty on hand per warehouse | Inventory | → Stock Item, Warehouse | continuous | ✓ | Forecast | — |
| **Stock Movement** | Ledger entry in/out | Inventory | → Stock Item, Source doc | posted | ✓ | Anomaly flag | — |
| **Stock Reservation** | Allocated for order | Inventory | → Sales Order, Stock Item | active → released | ✓ | — | — |
| **Stock Transfer** | Inter-warehouse move | Inventory | → Warehouses, Lines | draft → in_transit → done | ✓ | Route suggest | Transfer |
| **Stock Adjustment** | Cycle count / correction | Inventory | → Stock Item, Reason | draft → approved → posted | ✓ | Variance explain | **Required** |
| **Batch / Serial** | Traceability unit | Inventory | → Stock Item | active | ✓ | — | — |

---

### 5.3 Purchase Domain

**Full business profiles:** [ENTITY_PURCHASE.md](./modules/purchase/ENTITY_PURCHASE.md) — 15 entities with workflows, permissions, and AI detail.

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **Vendor** | Supplier party | Core (Contact) | contact_type=vendor | active | ✓ | Vendor match | — |
| **RFQ** | Request for quotation | Purchase | → Vendors, Items | draft → sent → closed | ✓ | Vendor suggest | — |
| **Purchase Order** | Commitment to buy | Purchase | → Vendor, Lines, Receipt | draft → approved → sent → closed | ✓ Full | PO suggest | **Required** |
| **Goods Receipt** | Received qty | Purchase | → PO, Warehouse | draft → posted | ✓ | Match assist | — |
| **Vendor Bill** | AP document | Purchase | → PO, Receipt, Vendor | draft → matched → posted | ✓ | 3-way match AI | Match exception |
| **Purchase Return** | Return to vendor | Purchase | → PO, Receipt | requested → approved → done | ✓ | — | Return |
| **Purchase Contract** | Framework agreement | Purchase | → Vendor, Terms | draft → active → expired | ✓ | — | Contract |

---

### 5.4 Sales Domain

**Full business profiles:** [ENTITY_SALES.md](./modules/sales/ENTITY_SALES.md) — 16 entities with quote-to-cash workflows, permissions, and AI detail.

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **Customer Profile** | Sales extension on contact | Sales | → Core Contact | active | ✓ | Credit insight | Credit limit |
| **Quotation** | Sales offer | Sales | → Contact, CRM Opp, Lines | draft → sent → accepted / lost | ✓ Full | Quote draft | Discount |
| **Sales Order** | Revenue commitment | Sales | → Quotation, Contact, Lines | draft → confirmed → … → closed | ✓ Full | Forecast | Credit / discount |
| **Shipment** | Fulfillment doc | Sales | → Sales Order, Warehouse | draft → shipped → delivered | ✓ | — | — |
| **Sales Invoice** | Commercial AR invoice | Sales | → Sales Order, Contact | draft → posted → paid | ✓ | — | Post (Finance) |
| **Payment** | Customer payment | Sales / Finance | → Invoices, Contact | pending → allocated | ✓ | — | — |
| **Return** | Customer return | Sales | → Sales Order | requested → received → done | ✓ | — | Return |
| **Credit Note** | AR credit | Sales | → Invoice | draft → posted | ✓ | — | **Required** |

---

### 5.5 CRM Domain

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **Lead** | Pre-customer opportunity | CRM | → Contact (convert), Source | new → qualified → converted / lost | ✓ Full | Score, NBA | Assignment |
| **Account** | Organization relationship | CRM | → Contacts, Opportunities | active | ✓ Full | Health score | Tier change |
| **Opportunity** | Pipeline deal | CRM | → Account, Contact, Quotation | stage pipeline → won / lost | ✓ Full | Win %, forecast | Won amount |
| **Pipeline / Stage** | Sales process config | CRM | → Opportunities | config | ✓ | — | Config change |
| **CRM Task** | Follow-up action | CRM | → Lead, Opp, Contact | pending → done | ✓ | Suggest | — |

---

### 5.6 Marketing Domain

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **Campaign** | Multi-channel initiative | Marketing | → Audience, Channels | draft → running → completed | ✓ Full | Campaign suggest | Launch / budget |
| **Audience** | Target population | Marketing | → Contacts, Segments | active | ✓ | Segment suggest | Export PII |
| **Segment** | Rule-based cohort | Marketing | → Rules, Members | active | ✓ | NL rule builder | — |
| **Journey** | Multi-step automation | Marketing | → Nodes, Enrollments | draft → active → paused | ✓ | Clone suggest | Activate |
| **Coupon** | Discount code | Marketing | → Rules, Usages | draft → active → expired | ✓ | — | High discount |
| **Referral Program** | Referral rewards | Marketing | → Contacts, Referrals | active | ✓ | — | — |
| **Loyalty Program** | Points & tiers | Marketing | → Rules, Ledger | active | ✓ | — | Liability |
| **Email Template** | Message content | Marketing | → Campaign | draft → published | ✓ | Content gen | Send |

---

### 5.7 Finance Domain

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **Chart of Account** | GL account tree | Finance | → Company, Parent | active / inactive | ✓ | — | Structural change |
| **Journal Entry** | GL posting unit | Finance | → Journal, Lines, Period | draft → posted → reversed | ✓ | Anomaly detect | **Required** |
| **AR Invoice** | Receivable open item | Finance | → Contact, Source (Sales) | posted → paid | ✓ | Collection rank | Write-off |
| **AP Bill** | Payable open item | Finance | → Vendor, Source (Purchase) | posted → paid | ✓ | Duplicate detect | Payment batch |
| **Receipt** | Inbound cash | Finance | → Bank, AR allocations | draft → posted | ✓ | Reconcile match | — |
| **Payment** | Outbound cash | Finance | → Bank, AP allocations | draft → posted | ✓ | — | **Required** |
| **Expense Claim** | Employee expense | Finance | → User, Category | submitted → approved → posted | ✓ | Category suggest | **Required** |
| **Bank Reconciliation** | Statement match | Finance | → Bank account, Lines | in_progress → done | ✓ | Match suggest | — |
| **Fiscal Period** | Accounting period | Finance | → Fiscal year | open → closed | ✓ | — | **Close** |

---

### 5.8 AI OS Domain

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **Agent** | Domain agent definition | AI OS | → Tools, Prompts | active / disabled | ✓ | — | Config |
| **Prompt** | Versioned template | AI OS | → Agent | draft → active | ✓ | — | Publish |
| **AI Task** | Async agent job | AI OS | → Agent, User | queued → done | ✓ | — | — |
| **AI Proposal** | Pending tool result | AI OS | → Audit, Target entity | pending → applied / rejected | ✓ | — | Per risk tier |
| **AI Audit Log** | Immutable AI operation | AI OS | → User, Agent | append-only | — | — | — |
| **Knowledge Chunk** | RAG embedding ref | AI OS | → Source doc | indexed | — | — | — |
| **Memory Entry** | Company/user memory | AI OS | → Company, User | active | ✓ | — | Purge |

> AI OS entities never replace business aggregates — they reference `target_entity_type` + `target_entity_id`.

---

### 5.9 Workflow Domain

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **Workflow Definition** | State machine schema | Workflow | → States, Transitions | active | ✓ | — | Edit |
| **Workflow State** | Named state | Workflow | → Definition | config | — | — | — |
| **Workflow Transition** | Allowed edge | Workflow | → From/To state, Guards | config | — | Suggest transition | — |
| **Workflow Instance** | Running workflow | Workflow | → Definition, Target entity | follows definition | ✓ | — | — |

---

### 5.10 Approvals Domain

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **Approval Policy** | Rule → chain mapping | Approvals | → Chains, Conditions | active | ✓ | — | Policy edit |
| **Approval Chain** | Level sequence | Approvals | → Steps, Approvers | active | ✓ | — | — |
| **Approval Request** | Active approval | Approvals | → Target entity, Steps | pending → approved / rejected | ✓ Full | AI assist inbox | Human decision |
| **Delegation Rule** | Approver delegate | Approvals | → User, Period | active | ✓ | — | — |

---

### 5.11 Activities Domain

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **Activity** | Scheduled task / call | Activities | → Polymorphic record | open → done | ✓ (self) | Suggest | — |
| **Comment** | Chatter message | Activities | → Polymorphic record | posted | ✓ | Summarize | — |
| **Note** | Internal note | Activities | → Polymorphic record | active | ✓ | — | — |
| **Follower** | Watch record | Activities | → User, Record | active | — | — | — |
| **Attachment Link** | File on record | Activities | → Media, Record | linked | ✓ | — | — |

---

### 5.12 Notifications Domain

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **Notification** | User inbox item | Notifications | → User, Source event | unread → read | — | — | — |
| **Notification Template** | Channel template | Notifications | → Event type | active | ✓ | Draft | — |
| **Delivery Log** | Send status | Notifications | → Template, Recipient | sent / failed | — | — | — |

---

### 5.13 Search Domain

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **Search Index Document** | Derived search doc | Search | → Source entity ID | indexed / stale | — | — | — |
| **Search Synonym** | Query expansion | Search | → Company | active | ✓ | — | — |

Infrastructure layer — rebuildable from OLTP events.

---

### 5.14 Media Domain

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **Media Asset** | File metadata | Media | → Company, Folder | active / archived | ✓ | Alt text gen | — |
| **Media Folder** | Library organization | Media | → Parent folder | active | ✓ | — | — |

Binary stored in object storage; DB holds metadata only.

---

### 5.15 Users Domain

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **User** | Auth identity | Users | → Contact (optional), Companies | active / suspended | ✓ | — | Role assign |
| **User Session** | Login session | Users | → User | active → expired | — | — | — |
| **User Company Access** | Multi-company membership | Users | → User, Company | active | — | — | — |
| **User Branch Access** | Branch scope | Users | → User, Branch | active | — | — | — |

---

### 5.16 Roles Domain

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **Role** | Named permission bundle | Roles | → Company, Permissions | active | ✓ | — | **Required** |
| **Record Rule** | Row-level filter | Roles | → Role, Model | active | ✓ | — | **Required** |

---

### 5.17 Permissions Domain

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **Permission** | Atomic capability | Permissions | Global registry | active | — | — | — |
| **Role Permission** | Role ↔ permission | Permissions | → Role, Permission | assigned | — | — | — |

---

### 5.18 Settings Domain

| Entity Name | Purpose | Owner | Relationships | Lifecycle | Activity | AI | Approval |
|-------------|---------|-------|---------------|-----------|----------|-----|----------|
| **Platform Setting** | Global KV | Settings | — | active | ✓ | — | Admin |
| **Company Setting** | Tenant KV | Settings | → Company | active | ✓ | — | Admin |
| **Module Setting** | Module-scoped config | Settings | → Company, Module | active | ✓ | — | Module admin |

Three-layer model: [SETTINGS_ARCHITECTURE.md](./modules/core/SETTINGS_ARCHITECTURE.md)

---

## 6. Shared Core Entities

Cross-domain entities owned by **Core** — all business domains reference these; none duplicate.

| Entity | Purpose | Key Relationships | Used By |
|--------|---------|-------------------|---------|
| **User** | Authentication identity | → Companies, Roles, Contact | All modules |
| **Organization (Company)** | Legal tenant root | → Branches, Settings | All business data |
| **Branch** | Physical / logical site | → Company, Warehouses | Inventory, Sales, HR |
| **Contact** | Unified party (customer, vendor, lead) | → Company, Addresses | Sales, CRM, Purchase, Marketing |
| **Address** | Polymorphic location | → Contact, Order, Company | All commerce |
| **Currency** | ISO currency code | → Exchange rates | Finance, Sales, Catalog prices |
| **Country** | Geography reference | → Regions | Address, Tax |
| **Language** | i18n locale | → Translations | Catalog, UI |
| **Media** | File metadata | → Folders, Attachments | Catalog, Activities, Marketing |
| **Activity** | Task, call, meeting | Polymorphic → any record | CRM, Sales, All |
| **Comment** | Chatter thread | Polymorphic | All registered entities |
| **Attachment** | Media ↔ record link | → Media, Polymorphic record | All |
| **Tag** | Flexible labeling | Polymorphic M:N | CRM, Catalog, Marketing |

### Shared Entity Rules

1. **Contact is the only customer/vendor master** — no domain-specific person tables
2. **Company_id on every business row** references Organization
3. **Polymorphic keys** use registry ID: `{domain}.{entity}` + UUID
4. **Translations** hang off Core or owner entity — never fork product name in Sales

---

## 7. Naming Conventions

Registry-level naming — physical detail in [database/naming-conventions.md](./database/naming-conventions.md).

| Artifact | Convention | Example |
|----------|------------|---------|
| **Domain prefix** | `{domain}_` lowercase | `sales_order`, `finance_journal` |
| **Entity registry ID** | `{domain}.{entity}` dot notation | `sales.order`, `catalog.product` |
| **Table name (future DDL)** | `{prefix}{plural_snake}` | `sales_orders` |
| **Primary key** | `id` UUID v7 (time-sortable) | — |
| **Foreign key column** | `{entity_singular}_id` | `contact_id`, `company_id` |
| **Pivot table** | `{domain}_{a}_{b}` alphabetical | `catalog_product_categories` |
| **Boolean** | `is_{name}` | `is_active` |
| **Timestamps** | `created_at`, `updated_at`, `deleted_at` | UTC |
| **Money** | `amount` + `currency_id` | Never symbol in DB |
| **Status** | `status` enum string | Matches workflow state slug |
| **Polymorphic** | `entity_type`, `entity_id` | Registry ID in `entity_type` |
| **Index name (future)** | `idx_{table}_{columns}` | — |
| **Event name** | `{domain}.{entity}.{past_tense}` | `sales.invoice.posted` |

---

## 8. Multi-Tenant Strategy

| Level | Column | Scope |
|-------|--------|-------|
| **Platform** | — | SaaS operator tables; no `company_id` |
| **Organization** | `company_id` | **Required** on all business entities |
| **Branch** | `branch_id` | Optional row-level scope |
| **Warehouse** | via Inventory | Stock isolation |

### Isolation Rules

- Every query filters `company_id` from auth context — **no exceptions** in app code
- Cross-company FK **forbidden** on business tables
- Platform admin uses separate connection role with audited cross-tenant read
- Search indexes partitioned/filtered by `company_id`
- AI embeddings tagged `company_id`; platform docs use null company (global read)

### User Multi-Company

`user_company_access` pivot — active company in session JWT / header `X-Company-Id`.

**Detail:** [database/multi-company.md](./database/multi-company.md)

---

## 9. Audit Strategy

Three complementary audit layers:

| Layer | Owner | Captures |
|-------|-------|----------|
| **Activity Log** | Activities | User-facing timeline — comments, status, assignments |
| **Field History** | Owner domain | Before/after on critical fields (price, qty, stage) |
| **System Audit Log** | Core | Security events, settings change, permission grant |
| **Finance Audit Log** | Finance | GL post, period close, reconciliation |
| **AI Audit Log** | AI OS | Every model call and tool proposal |

### Audit Rules

- Append-only audit tables — no UPDATE/DELETE
- `created_by`, `updated_by` on mutable business entities
- Workflow transitions log from/to state + actor
- Compliance export by date range and entity type
- PII redaction in AI audit prompts

**Detail:** [database/audit-trail.md](./database/audit-trail.md)

---

## 10. Soft Delete Strategy

| Entity Class | Delete Strategy |
|--------------|-----------------|
| **Master data** (Product, Contact, COA) | Soft delete `deleted_at` — never hard delete if referenced |
| **Transactional** (Order, Journal posted) | **No delete** — cancel/reverse workflow only |
| **Config** (Workflow def, Prompt) | Soft delete or `is_active=false` |
| **Infrastructure** (Search doc) | Hard delete on reindex |
| **Audit logs** | **Never delete** — retention policy archives to cold storage |

### Soft Delete Rules

- `deleted_at IS NULL` default scope in all list queries
- Unique constraints use partial index `WHERE deleted_at IS NULL`
- Restore operation clears `deleted_at` — audited
- FK from active row to soft-deleted row — blocked by validation

---

## 11. Future Expansion Rules

### Adding a New Business Domain

1. Register domain in §4 with prefix, layer, owner doc
2. List entities in §5 with full 8-attribute matrix
3. Add workflows to [WORKFLOW_REGISTRY.md](./WORKFLOW_REGISTRY.md)
4. Add module architecture doc (Step sequence)
5. Update [MASTER_INDEX.md](./MASTER_INDEX.md) and CHANGELOG
6. Only then author migrations

### Adding Industry Profile

| Rule | Detail |
|------|--------|
| **Extend, don't fork** | Hospital Patient → extends Contact + new `hospital_*` entities |
| **No duplicate Product** | Medical supply uses Catalog Product |
| **Industry prefix** | `hospital_*`, `school_*`, `mfg_*` |
| **Layer** | Industry Layer in §3 |

### Adding Entity to Existing Domain

- PR must update this registry first
- Declare Activity / AI / Approval support explicitly
- If Approval = Required, link policy in Approval Engine doc
- Emit domain events on state changes

### Scaling Patterns (when OLTP grows)

| Pattern | Trigger |
|---------|---------|
| Table partitioning | Orders, movements > 10M rows |
| Read replica | Report workload |
| Analytics facts | Dashboard SLA |
| External search | FTS latency |

Document in [MASTER_DATABASE_ARCHITECTURE.md](./database/MASTER_DATABASE_ARCHITECTURE.md) — not in registry DDL.

---

## 12. Database Governance Rules

| # | Rule |
|---|------|
| 1 | **Registry before migration** — entity must exist in §5 |
| 2 | **Single owner** — one domain writes each entity |
| 3 | **No cross-domain UPDATE** — use events + owner API |
| 4 | **Core contact master** — no duplicate party tables |
| 5 | **Finance owns GL** — only Finance posts journals |
| 6 | **Inventory owns qty** — only Inventory updates stock levels |
| 7 | **AI via services** — AI OS registers ai_* only |
| 8 | **company_id required** — all business entities |
| 9 | **Activity declared** — §5 matrix must not lie |
| 10 | **Workflow IDs registered** — [WORKFLOW_REGISTRY.md](./WORKFLOW_REGISTRY.md) |
| 11 | **CHANGELOG on registry change** — traceability |
| 12 | **ER diagram sync** — update [ER_DIAGRAM.md](./database/ER_DIAGRAM.md) at implementation gate |

### Anti-Patterns (Forbidden)

```text
❌ SQL DDL in this registry document
❌ sales_customers, crm_contacts, purchase_vendors as separate person masters
❌ GL columns on sales_orders
❌ qty_on_hand on catalog_product_variants
❌ AI tool writing directly to module tables
❌ Cross-company foreign keys
❌ Hard delete posted journal entries or orders
❌ New entity without Activity/AI/Approval declaration
```

### Registry Change Process

```text
Architecture PR updates DATABASE_REGISTRY.md
  → Review: ownership, relationships, platform support flags
  → Merge + CHANGELOG
  → Module architecture doc aligned
  → Implementation PR: migrations reference registry entity IDs
```

---

## Appendix A — Entity Count Summary

| Domain | Registered Entities |
|--------|---------------------|
| Catalog | 7 |
| Inventory | 8 |
| Purchase | 7 |
| Sales | 8 |
| CRM | 5 |
| Marketing | 8 |
| Finance | 9 |
| AI OS | 7 |
| Workflow | 4 |
| Approvals | 4 |
| Activities | 5 |
| Notifications | 3 |
| Search | 2 |
| Media | 2 |
| Users | 4 |
| Roles | 2 |
| Permissions | 2 |
| Settings | 3 |
| **Total** | **86** |

---

## Appendix B — Cross-Domain Relationship Map (Logical)

```text
Contact ──< Sales Order >── Product Variant >── Product
                │                                    │
                ├──> Shipment ──> Stock Movement     │
                ├──> Sales Invoice ──event──> AR Invoice (Finance)
                └──> CRM Opportunity

Purchase Order ──> Goods Receipt ──event──> Stock Movement
              └──> Vendor Bill ──event──> AP Bill (Finance)

Marketing Campaign ──> Contact (Audience)
                  └──> Commerce/Sales Order (attribution FK)

AI Proposal ──> target: any registered entity (polymorphic)
Workflow Instance ──> target: any registered entity (polymorphic)
Approval Request ──> target: any registered entity (polymorphic)
Activity / Comment ──> target: any registered entity (polymorphic)
```

---

## Related Documents

| Document | Role |
|----------|------|
| [database/MASTER_DATABASE_ARCHITECTURE.md](./database/MASTER_DATABASE_ARCHITECTURE.md) | Physical blueprint, indexes, partitioning |
| [ENTITY_RELATIONSHIP_REGISTRY.md](./ENTITY_RELATIONSHIP_REGISTRY.md) | Business entity profiles |
| [database/ER_DIAGRAM.md](./database/ER_DIAGRAM.md) | Visual ER |
| [database/standards.md](./database/standards.md) | Mandatory columns |
| [WORKFLOW_REGISTRY.md](./WORKFLOW_REGISTRY.md) | State machines |
| Module `*_MODULE_ARCHITECTURE.md` | Domain detail |
| [core/entities/README.md](./core/entities/README.md) | Core entity specs |

---

*End of Database Registry — Step 14*
