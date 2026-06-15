# AgainERP

> **Project Entry Point** — Read this first.  
> **Documentation First:** Documentation is the source of truth. No production code until docs are **Ready**.

---

## Project Overview

**AgainERP** is a universal modular **ERP + Ecommerce SaaS platform** — Odoo-inspired architecture with Shopify-grade commerce, built for unlimited industry verticals (Hospital, School, Restaurant, Hotel, Manufacturing, and more) on one shared Core.

| Attribute | Value |
|-----------|-------|
| **Type** | Multi-tenant SaaS ERP + Ecommerce |
| **Phase** | **UI/UX Prototype Mode** — frontend only, no backend |
| **Prototype** | [UI_PROTOTYPE_MODE.md](./UI_PROTOTYPE_MODE.md) |
| **Active Module** | Ecommerce (167 admin screens) |
| **Documents** | 560 registered · [DOCUMENT_REGISTRY.md](./DOCUMENT_REGISTRY.md) |

---

## Vision

One platform where every business — retail, clinic, school, factory — runs operations on **shared Core Services** without duplicated data, disconnected tools, or fragile integrations.

---

## Mission

Deliver a **documentation-first, API-first, AI-first** platform that:

1. Unifies ERP, commerce, and industry modules on Core
2. Scales to 10k+ tenants and 100+ modules
3. Enables installable, removable, upgradeable modules
4. Powers human teams and AI agents from the same knowledge layer

---

## Core Principles

| # | Principle |
|---|-----------|
| 1 | **Documentation-first** — docs before code |
| 2 | **Core-first** — all modules build on Core Services |
| 3 | **No cross-module DB** — Services, Events, APIs, Workflows only |
| 4 | **API-first** — web, mobile, integrations, AI use same APIs |
| 5 | **Multi-tenant** — Tenant → Company → Branch → Warehouse |
| 6 | **AI OS** — AI never accesses database directly |
| 7 | **Modular** — install · remove · upgrade independently |
| 8 | **Governed** — every document registered, indexed, versioned |

Full principles: [UNIVERSAL_MODULE_FRAMEWORK.md](./UNIVERSAL_MODULE_FRAMEWORK.md) · [GOVERNANCE.md](./GOVERNANCE.md)

---

## Architecture Overview

```
AgainERP
├── Infrastructure Layer   → DevOps, security, deployment
├── AI OS Layer            → Chief Agent, 14 engines, digital twin
├── Industry Layer         → Hospital, School, Hotel, …
├── Business Layer         → Ecommerce, CRM, Accounting, HR, …
├── Core Layer             → Users, RBAC, Contacts, Workflow, Events
└── Platform Layer         → Tenants, billing, plans, metering
```

**Blueprint:** [PROJECT_MAP.md](./PROJECT_MAP.md) · [MASTER_MODULE_ARCHITECTURE.md](./MASTER_MODULE_ARCHITECTURE.md)

---

## Technology Stack

> **Official:** [TECHNOLOGY_CONSTITUTION.md](./TECHNOLOGY_CONSTITUTION.md) — single source of truth

| Layer | Technology |
|-------|------------|
| Frontend | **Next.js** · TypeScript · Tailwind · Shadcn UI · AG Grid |
| Backend | **FastAPI** · Python · DDD · Modular Monolith |
| Database | **PostgreSQL** · pgvector |
| Cache / Queue | **Redis** |
| Search | **Meilisearch** |
| Object Storage | **MinIO** (S3-compatible) |
| AI | **LangGraph** · Python · module APIs only |
| Docs | Markdown · Docusaurus (publish) |
| Deployment | Docker, Kubernetes, VPS |

ADR references: [ADR_INDEX.md](./ADR_INDEX.md)

---

## Documentation Rules

| Rule | Document |
|------|----------|
| Docs before code | [GOVERNANCE.md](./GOVERNANCE.md) |
| Every doc registered | [DOCUMENT_REGISTRY.md](./DOCUMENT_REGISTRY.md) |
| Every module indexed | [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) |
| Every change logged | [CHANGELOG.md](./CHANGELOG.md) |
| Standards | [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md) |
| Doc format | [DOCUMENTATION_STANDARD.md](./DOCUMENTATION_STANDARD.md) |

**Workflow:** Update docs → Review → Approve (Ready) → Dev tasks → Code → Changelog

---

## Module Structure

Every module ships **9 required files**:

`ModuleManifest` · `Architecture` · `Database` · `API` · `Workflow` · `Permissions` · `Reports` · `AI` · `CHANGELOG`

Details: [MODULE_STRUCTURE.md](./MODULE_STRUCTURE.md) · [UNIVERSAL_MODULE_FRAMEWORK.md](./UNIVERSAL_MODULE_FRAMEWORK.md)

---

## Development Process

### Before Any Code — Pre-Code Gate (Mandatory)

Complete [PRE_CODE_GATE.md](./PRE_CODE_GATE.md) — review constitution, architecture, database, API, UI, and AI OS docs.

**If documentation is missing → STOP.** Never code without **Ready** approval.

| Step | Review |
|------|--------|
| 1 | [Technology Constitution](./TECHNOLOGY_CONSTITUTION.md) |
| 2 | Architecture documents |
| 3 | Database documents |
| 4 | API standards |
| 5 | UI standards |
| 6 | AI OS standards |

Checklist: [_PRE_CODE_GATE_CHECKLIST.md](./_PRE_CODE_GATE_CHECKLIST.md)

### Full Workflow

| Step | Action |
|------|--------|
| 0 | **Pre-Code Gate** (above) |
| 1 | Update documentation |
| 2 | Register in [DOCUMENT_REGISTRY.md](./DOCUMENT_REGISTRY.md) |
| 3 | Review & approve (Status: **Ready**) |
| 4 | Generate dev tasks from [MASTER_DEVELOPMENT_SEQUENCE.md](./MASTER_DEVELOPMENT_SEQUENCE.md) |
| 5 | UI prototype — [UI_PROTOTYPE_MODE.md](./UI_PROTOTYPE_MODE.md) |
| 6 | Write code |
| 7 | Update [CHANGELOG.md](./CHANGELOG.md) |

Pre-commit: [_COMMIT_CHECKLIST.md](./_COMMIT_CHECKLIST.md)

---

## AI OS Overview

AgainERP includes a platform-wide **AI OS** — Chief AI Agent orchestrating domain agents across modules.

| Rule | Detail |
|------|--------|
| Entry points | README → MASTER_INDEX → PROJECT_MAP → AI_KNOWLEDGE_INDEX |
| Data access | Module APIs only — never direct DB |
| Audit | All AI actions logged and approval-gated |

**Docs:** [modules/ai/AI_OS_ARCHITECTURE.md](./modules/ai/AI_OS_ARCHITECTURE.md) · [AI_KNOWLEDGE_INDEX.md](./AI_KNOWLEDGE_INDEX.md)

---

## Governance Files (System-Critical)

| File | Purpose |
|------|---------|
| [README.md](./README.md) | **This file** — project entry |
| [TECHNOLOGY_CONSTITUTION.md](./TECHNOLOGY_CONSTITUTION.md) | **Official tech stack** — mandatory for all dev |
| [PRE_CODE_GATE.md](./PRE_CODE_GATE.md) | **Before any code** — 6 mandatory reviews |
| [MASTER_INDEX.md](./MASTER_INDEX.md) | **Master Index** — central documentation navigation hub |
| [PROJECT_MAP.md](./PROJECT_MAP.md) | **Project Map** — complete visual platform map (v2.0) |
| [DOCUMENT_REGISTRY.md](./DOCUMENT_REGISTRY.md) | All documents |
| [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | All modules |
| [PAGE_REGISTRY.md](./PAGE_REGISTRY.md) | All pages/screens |
| [DATABASE_REGISTRY.md](./DATABASE_REGISTRY.md) | All database assets |
| [API Registry](./API_REGISTRY.md) | API architecture & domain groups |
| [WORKFLOW_REGISTRY.md](./WORKFLOW_REGISTRY.md) | All workflows |
| [AI_KNOWLEDGE_INDEX.md](./AI_KNOWLEDGE_INDEX.md) | **AI Knowledge Index** — master map for all AI consumers |
| [CHANGELOG.md](./CHANGELOG.md) | Change history |
| [ADR_INDEX.md](./ADR_INDEX.md) | Architecture decisions |
| [TRACEABILITY_MATRIX.md](./TRACEABILITY_MATRIX.md) | **Traceability Matrix** — requirements → artifacts (v2.0) |
| [DOCUMENTATION_HEALTH_REPORT.md](./DOCUMENTATION_HEALTH_REPORT.md) | Doc quality dashboard |

---

## Key Documents

| Document | Description |
|----------|-------------|
| [PRD](./PRD.md) | Product Requirements |
| [MASTER_DEVELOPMENT_SEQUENCE](./MASTER_DEVELOPMENT_SEQUENCE.md) | 100-step roadmap |
| [HYBRID_LICENSED_ERP_ARCHITECTURE](./HYBRID_LICENSED_ERP_ARCHITECTURE.md) | Hybrid licensed ERP — SaaS, hybrid, enterprise |
| [SAAS_PLATFORM_ARCHITECTURE](./SAAS_PLATFORM_ARCHITECTURE.md) | Tenants, billing, metering |
| [UNIVERSAL_MODULE_FRAMEWORK](./UNIVERSAL_MODULE_FRAMEWORK.md) | Unlimited industry modules |
| [MASTER_DATABASE_ARCHITECTURE](./database/MASTER_DATABASE_ARCHITECTURE.md) | PostgreSQL blueprint |
| [ENTERPRISE_UI_ARCHITECTURE](./ui-ux/ENTERPRISE_UI_ARCHITECTURE.md) | Canonical UI shell |
| [Ecommerce Module](./modules/ecommerce/Architecture.md) | Phase 1 active module (admin) |
| [Ecommerce Storefront](./modules/ecommerce/ECOMMERCE_STOREFRONT_ARCHITECTURE.md) | **Customer storefront** (v1.0) |
| [Storefront UI Prototype (as-built)](./ui-prototype/storefront/IMPLEMENTED_DESIGN.md) | **AgainShop `/shop/*`** prototype screens |
| [Module Dependency Map](./MODULE_DEPENDENCY_MAP.md) | Cross-module dependencies (master) |
| [Entity Relationship Registry](./ENTITY_RELATIONSHIP_REGISTRY.md) | Business entity profiles |
| [Catalog Entity Catalog](./modules/ecommerce/catalog/ENTITY_CATALOG.md) | **Catalog domain entities** (v1.0) |
| [Inventory Entity Catalog](./modules/inventory/ENTITY_INVENTORY.md) | **Inventory domain entities** (v1.0) |
| [Purchase Entity Catalog](./modules/purchase/ENTITY_PURCHASE.md) | **Purchase domain entities** (v1.0) |
| [Sales Entity Catalog](./modules/sales/ENTITY_SALES.md) | **Sales domain entities** (v1.0) |
| [Service Registry](./SERVICE_REGISTRY.md) | Platform & business services |
| [Dependency Map](./DependencyMap.md) | Dependency quick reference |

**Full navigation:** [MASTER_INDEX.md](./MASTER_INDEX.md)

---

**Platform:** AgainERP  
**Maintainer:** Platform Architecture Team  
**Last Updated:** 2026-06-13
