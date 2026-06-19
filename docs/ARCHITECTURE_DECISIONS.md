# AgainERP — Architecture Decision Index

> **Status:** Active — **architecture decisions SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 04 — Architecture Decision Index  
> **Audience:** Cursor · Architects · Developers  
> **Max scope:** Core decisions only — deep specs live in linked authorities

---

## Purpose

Single index of **major, non-negotiable architecture decisions**. Read this instead of scanning all architecture docs when orienting or validating a design.

## When To Read

Read after [BRAIN.md](./BRAIN.md) when you need **why** the platform is shaped this way — before opening module or layer-specific architecture files.

## Related Files

- [BRAIN.md](./BRAIN.md) — Cursor entry and rules summary
- [01-architecture/MODULE_DEPENDENCY_MAP.md](./01-architecture/MODULE_DEPENDENCY_MAP.md) — integration matrix
- [01-architecture/decisions/](./01-architecture/decisions/) — formal ADRs
- [GOVERNANCE_FRAMEWORK.md](./GOVERNANCE_FRAMEWORK.md) — governance domains

## Read Next

- Task-specific: one authority from **Related Documents** below
- Module work: [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) → `{module}/README.md` (Level 3)
- Full hierarchy: [BRAIN.md § AI Reading Policy](./BRAIN.md#ai-reading-policy)

---

## Decision Format

Each entry: **Decision** · **Reason** · **Impact** · **Related Documents**

---

## 1. Architecture Style

### 1.1 Modular monolith with service boundaries

| | |
|---|---|
| **Decision** | One deployable platform (PostgreSQL modular monolith) with **strict module boundaries** enforced by services, events, and APIs — not separate microservices per module in v1. |
| **Reason** | ERP domains are tightly coupled in UX but must evolve independently; monolith reduces ops cost while service boundaries preserve team autonomy. |
| **Impact** | Shared runtime and DB cluster; modules communicate via contracts, not shared ORM models. |
| **Related Documents** | [01-architecture/PROJECT_MAP.md](./01-architecture/PROJECT_MAP.md) · [01-architecture/MASTER_MODULE_ARCHITECTURE.md](./01-architecture/MASTER_MODULE_ARCHITECTURE.md) · [ADR-009](./01-architecture/decisions/ADR-009-universal-modules.md) |

### 1.2 Documentation-first

| | |
|---|---|
| **Decision** | Approved docs precede code. No feature, route, schema, or UI without updated module documentation and [PRE_CODE_GATE](./00-foundation/PRE_CODE_GATE.md) checks. |
| **Reason** | Multi-module SaaS requires a single truth source for AI agents and distributed teams. |
| **Impact** | Architecture, Database, API, Menus, and CHANGELOG updated before implementation. |
| **Related Documents** | [ADR-007](./01-architecture/decisions/ADR-007-documentation-first.md) · [00-foundation/GOVERNANCE.md](./00-foundation/GOVERNANCE.md) |

### 1.3 Layer stack (top → bottom)

| | |
|---|---|
| **Decision** | **Admin / Storefront / Mobile / External AI** → **AI OS (platform)** → **Industry** → **Business modules** → **Core** → **Platform (tenant/billing)** → **Data stores**. |
| **Reason** | Clear ownership: Core is always on; business modules are optional per plan; AI is a platform service, not a business module owner. |
| **Impact** | AI and Core never own business tables; industry modules consume business modules via manifest. |
| **Related Documents** | [FINAL_ERP_STRUCTURE_MAP.md](./FINAL_ERP_STRUCTURE_MAP.md) §2 · [02-core-platform/ARCHITECTURE.md](./02-core-platform/ARCHITECTURE.md) |

### 1.4 Technology spine

| | |
|---|---|
| **Decision** | **Next.js + TypeScript** (UI) · **FastAPI + Python** (API) · **PostgreSQL** · **Redis** · **Meilisearch**. |
| **Reason** | API-first SaaS with strong typing and proven ERP data store. |
| **Impact** | Prototype: mock routes in `apps/web/`; production: FastAPI per module. |
| **Related Documents** | [ADR-001](./01-architecture/decisions/ADR-001-postgresql.md) · [ADR-011](./01-architecture/decisions/ADR-011-nextjs-typescript.md) · [ADR-012](./01-architecture/decisions/ADR-012-fastapi-python.md) |

---

## 2. Module Isolation Rules

### 2.1 No cross-module database access

| | |
|---|---|
| **Decision** | Module A **must not** read, JOIN, or write Module B tables. Allowed: own tables, Core tables, **Services**, **Events**, **HTTP APIs**. |
| **Reason** | Prevents coupling, migration conflicts, and unclear ownership. |
| **Impact** | Cross-module data via UUID refs + service calls; subscribers optional on events. |
| **Related Documents** | [ADR-010](./01-architecture/decisions/ADR-010-no-cross-module-db.md) · [architecture/MODULE_ISOLATION_REPORT.md](./architecture/MODULE_ISOLATION_REPORT.md) |

### 2.2 Single writer per table prefix

| | |
|---|---|
| **Decision** | Each module owns `{module}_*` tables exclusively. One module = one prefix = one migration owner. |
| **Reason** | Eliminates duplicate entity masters (e.g. two product or customer tables). |
| **Impact** | Inventory owns stock ledger; Catalog owns product identity; CRM uses Core `contacts`. |
| **Related Documents** | [01-architecture/MODULE_DEPENDENCY_MAP.md](./01-architecture/MODULE_DEPENDENCY_MAP.md) · [05-development/database/MASTER_DATABASE_ARCHITECTURE.md](./05-development/database/MASTER_DATABASE_ARCHITECTURE.md) |

### 2.3 Core-first integration

| | |
|---|---|
| **Decision** | Shared identity (users, contacts, companies), RBAC, workflow, approval, notification, and search flow through **Core** — not duplicated in business modules. |
| **Reason** | One party master, one permission model, consistent audit. |
| **Impact** | Business modules store commercial profile extensions only; person/org identity lives in Core. |
| **Related Documents** | [ADR-008](./01-architecture/decisions/ADR-008-unified-contacts.md) · [02-core-platform/entities/contacts.md](./02-core-platform/entities/contacts.md) |

### 2.4 Optional modules must degrade gracefully

| | |
|---|---|
| **Decision** | When a module is off for a tenant/plan: **hide UI**, **skip routes**, **no crash** — consumers use optional service calls and event subscribers. |
| **Reason** | SaaS plans differ; hard dependencies break multi-tenant packaging. |
| **Impact** | Declare deps in `ModuleManifest.md` + dependency map; never import sibling module ORM at load time. |
| **Related Documents** | [00-foundation/PROJECT_COMMON_RULES.md](./00-foundation/PROJECT_COMMON_RULES.md) · [01-architecture/MODULE_DEPENDENCY_MAP.md](./01-architecture/MODULE_DEPENDENCY_MAP.md) |

### 2.5 Event-driven async handoffs

| | |
|---|---|
| **Decision** | Side effects across modules use **domain events after COMMIT** — not synchronous cross-module writes. |
| **Reason** | Decouples lifecycles (order confirmed → inventory reserve → finance post). |
| **Impact** | Event names namespaced `{module}.{entity}.{action}`; idempotent subscribers. |
| **Related Documents** | [ADR-006](./01-architecture/decisions/ADR-006-event-driven.md) · [02-core-platform/engines/EVENT_ARCHITECTURE.md](./02-core-platform/engines/EVENT_ARCHITECTURE.md) |

---

## 3. Database Rules

### 3.1 Multi-scope columns on every business row

| | |
|---|---|
| **Decision** | Business tables include `tenant_id` and (where applicable) `company_id`, `branch_id` — scoped queries mandatory. |
| **Reason** | SaaS isolation and multi-company ERP in one tenant. |
| **Impact** | No unscoped queries; indexes include tenant (and usually company). |
| **Related Documents** | [07-saas/TENANT_ARCHITECTURE.md](./07-saas/TENANT_ARCHITECTURE.md) · [05-development/database/multi-company.md](./05-development/database/multi-company.md) |

### 3.2 ID references, not cross-module FKs

| | |
|---|---|
| **Decision** | Store **UUID references** (`product_id`, `contact_id`) to other modules; enforce integrity in service layer, not FK to sibling module tables. |
| **Reason** | Modules deploy and migrate independently. |
| **Impact** | ER diagrams may show logical FKs; physical FKs only within module + Core. |
| **Related Documents** | [ADR-010](./01-architecture/decisions/ADR-010-no-cross-module-db.md) · [architecture/MODULE_ISOLATION_REPORT.md](./architecture/MODULE_ISOLATION_REPORT.md) |

### 3.3 Naming and registry

| | |
|---|---|
| **Decision** | Tables `{prefix}_{entity}`; prefixes registered per module in `Database.md` + registry. |
| **Reason** | Prevents collisions (`crm_*`, `sales_*`, `catalog_*`, `hr_*`, …). |
| **Impact** | New tables require module doc + registry update before migration. |
| **Related Documents** | [05-development/database/naming-conventions.md](./05-development/database/naming-conventions.md) · [00-foundation/registries/DATABASE_REGISTRY.md](./00-foundation/registries/DATABASE_REGISTRY.md) |

---

## 4. API Rules

### 4.1 Module-owned namespaces + thin handlers

| | |
|---|---|
| **Decision** | **`/api/v1/{module}/`** owned by one module. Handlers validate → **service** → DTO. Frontend never hits DB. |
| **Reason** | Clear ownership; UI and AI share contracts. |
| **Impact** | Cross-module reads via owning service; mock routes mirror future FastAPI. |
| **Related Documents** | [05-development/api/architecture.md](./05-development/api/architecture.md) · [01-architecture/MODULE_DEPENDENCY_MAP.md](./01-architecture/MODULE_DEPENDENCY_MAP.md) |

### 4.2 REST versioning

| | |
|---|---|
| **Decision** | Prefix **`v1`**; plural resources; actions as `POST /{id}/{action}`. Breaking changes → v2 or additive fields. |
| **Reason** | Predictable URLs for clients and AI tools. |
| **Impact** | Document in module `API.md`. |
| **Related Documents** | [05-development/api/architecture.md](./05-development/api/architecture.md) |

---

## 5. UI Rules

### 5.1 CRUD = list + right Sheet drawer

| | |
|---|---|
| **Decision** | Standard CRUD: list page + **right Sheet** — `?create=1` · `?view={id}` · `?edit={id}`. **Forbidden:** `/new`, `/[id]/edit` for standard entities. |
| **Reason** | Consistent ERP UX; mobile-friendly; reference: `/catalog/products`. |
| **Impact** | Every admin module follows same URL and component pattern. |
| **Related Documents** | [WORKSPACE_SHELL_ARCHITECTURE.md](./04-uiux/standards/WORKSPACE_SHELL_ARCHITECTURE.md) · [04-uiux/standards/module-ui-standard.md](./04-uiux/standards/module-ui-standard.md) · [04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md](./04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md) |

### 5.2 Mobile-first + doc entry

| | |
|---|---|
| **Decision** | Full-width drawer on mobile; module shell sidebar/hamburger. Open **`{module}/README.md`** before any module folder scan. |
| **Reason** | Field users on phones; token-efficient AI navigation. |
| **Impact** | 44px targets; one screen spec from `Menus/` or prototype at a time. |
| **Related Documents** | [04-uiux/standards/mobile-first.md](./04-uiux/standards/mobile-first.md) · [WORKSPACE_SHELL_ARCHITECTURE.md](./04-uiux/standards/WORKSPACE_SHELL_ARCHITECTURE.md) · [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) |

---

## 6. AI Rules

### 6.1 AI OS as platform intelligence layer

| | |
|---|---|
| **Decision** | **AI OS** is a platform service (agents, tools, audit, credits) — **not** an owner of business domain tables. |
| **Reason** | Unified governance vs scattered per-module AI integrations. |
| **Impact** | Module teams register tools in `AI.md`; Chief Agent orchestrates cross-module tasks. |
| **Related Documents** | [ADR-004](./01-architecture/decisions/ADR-004-ai-os.md) · [06-ai/platform/ai/AI_OS_ARCHITECTURE.md](./06-ai/platform/ai/AI_OS_ARCHITECTURE.md) |

### 6.2 Tools call services, never ORM

| | |
|---|---|
| **Decision** | AI tools invoke **module HTTP APIs / services** only — no direct database or cross-module ORM access. |
| **Reason** | Same RBAC, audit, and tenancy rules as human users. |
| **Impact** | High-value mutations require approval gates; actions logged in AI audit trail. |
| **Related Documents** | [06-ai/platform/ai/AI_AUDIT_AND_APPROVAL.md](./06-ai/platform/ai/AI_AUDIT_AND_APPROVAL.md) · [00-foundation/registries/AI_KNOWLEDGE_INDEX.md](./00-foundation/registries/AI_KNOWLEDGE_INDEX.md) |

### 6.3 Credits and approval

| | |
|---|---|
| **Decision** | AI actions consume **tenant credits**; high-value mutations need **approval** unless pre-authorized. |
| **Reason** | SaaS economics and safety. |
| **Impact** | Admin AI settings; platform approval center. |
| **Related Documents** | [06-ai/platform/ai/AI_AUDIT_AND_APPROVAL.md](./06-ai/platform/ai/AI_AUDIT_AND_APPROVAL.md) · [06-ai/experience/03_AI_ADMIN_EXPERIENCE.md](./06-ai/experience/03_AI_ADMIN_EXPERIENCE.md) |

---

## 7. Multi-Tenant Rules

### 7.1 Tenant hierarchy

| | |
|---|---|
| **Decision** | **Platform → Tenant → Company → Branch → Warehouse** — `tenant_id` is billing/isolation root; `company_id` is ERP data boundary. |
| **Reason** | Supports single-company SMB and multi-company enterprise in one SaaS model. |
| **Impact** | All queries scoped; plan limits on companies, users, modules. |
| **Related Documents** | [ADR-005](./01-architecture/decisions/ADR-005-multi-tenant.md) · [07-saas/TENANT_ARCHITECTURE.md](./07-saas/TENANT_ARCHITECTURE.md) |

### 7.2 Shared database, row-level isolation (default)

| | |
|---|---|
| **Decision** | **Recommended:** one PostgreSQL cluster, shared schema, **`tenant_id` (+ `company_id`) on every row** — not DB-per-tenant in v1. |
| **Reason** | Operational simplicity at scale; RLS optional hardening layer. |
| **Impact** | Middleware sets tenant context; tests must prove no cross-tenant leakage. |
| **Related Documents** | [01-architecture/SAAS_PLATFORM_ARCHITECTURE.md](./01-architecture/SAAS_PLATFORM_ARCHITECTURE.md) · [07-saas/DATA_OWNERSHIP.md](./07-saas/DATA_OWNERSHIP.md) |

### 7.3 Module enablement per plan

| | |
|---|---|
| **Decision** | Business and industry modules are **feature-flagged per tenant/plan**; Core is always on. |
| **Reason** | Tiered SaaS pricing and hybrid licensed ERP (on-prem + cloud). |
| **Impact** | `ModuleManifest.md` + platform entitlements drive nav visibility. |
| **Related Documents** | [ADR-013](./01-architecture/decisions/ADR-013-hybrid-licensed-erp.md) · [03-business-modules/subscription/README.md](./03-business-modules/subscription/README.md) |

---

## 8. Plugin Rules

### 8.1 Plugins are optional installables

| | |
|---|---|
| **Decision** | Extensions (payments, EMI, shipping, analytics) ship as **plugins** — install/uninstall per tenant, not compiled into core modules. |
| **Reason** | Core stays lean; regional and partner features vary by deployment. |
| **Impact** | Plugin owns `plugin_{name}_*` tables; core modules unchanged when plugin off. |
| **Related Documents** | [09-integrations/plugins/README.md](09-integrations/plugins/README.md) · [09-integrations/plugins/bank-emi/Architecture.md](09-integrations/plugins/bank-emi/Architecture.md) |

### 8.2 API-first plugin boundary

| | |
|---|---|
| **Decision** | Storefront and admin UI consume plugins via **plugin API/service** — never direct reads of plugin tables from other modules. |
| **Reason** | Same isolation rules as business modules. |
| **Impact** | Hooks/events for checkout, catalog, settings; manifest declares deps. |
| **Related Documents** | [09-integrations/plugins/bank-emi/PLUGIN_MANIFEST.md](09-integrations/plugins/bank-emi/PLUGIN_MANIFEST.md) · [05-development/framework/COMMUNICATION_CONTRACTS.md](./05-development/framework/COMMUNICATION_CONTRACTS.md) |

### 8.3 Manifest required

| | |
|---|---|
| **Decision** | Plugin requires **`PLUGIN_MANIFEST.md`**, Architecture, permissions — PRE_CODE_GATE before code. |
| **Reason** | No shadow dependencies on core or commerce. |
| **Impact** | Disabled plugin = hidden routes + no-op hooks. |
| **Related Documents** | [09-integrations/plugins/bank-emi/PLUGIN_MANIFEST.md](09-integrations/plugins/bank-emi/PLUGIN_MANIFEST.md) · [GOVERNANCE_FRAMEWORK.md](./GOVERNANCE_FRAMEWORK.md) |

---

**ADRs:** [001](./01-architecture/decisions/ADR-001-postgresql.md) PostgreSQL · [004](./01-architecture/decisions/ADR-004-ai-os.md) AI OS · [005](./01-architecture/decisions/ADR-005-multi-tenant.md) Multi-tenant · [006](./01-architecture/decisions/ADR-006-event-driven.md) Events · [007](./01-architecture/decisions/ADR-007-documentation-first.md) Docs-first · [008](./01-architecture/decisions/ADR-008-unified-contacts.md) Contacts · [009](./01-architecture/decisions/ADR-009-universal-modules.md) Modules · [010](./01-architecture/decisions/ADR-010-no-cross-module-db.md) No cross-DB · [011–013](00-foundation/traceability/ADR_INDEX.md) Stack & licensing

**Maintainer:** Platform Architecture · **Last Updated:** 2026-06-19
