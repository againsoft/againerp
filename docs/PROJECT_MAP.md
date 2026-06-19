# AgainERP — Project Map (AI Navigation)

## Purpose
Complete map of where documentation lives — folder index and path migration.

## When To Read
Read after BRAIN.md when you need to locate a document or folder.

## Related Files
- [Cursor entry](BRAIN.md)
- [Module index](MODULE_REGISTRY.md)
- [Full hierarchy](MASTER_DOCUMENT_MAP.md)

## Read Next
- [Pick a module](MODULE_REGISTRY.md)

---

> **Status:** Active — **documentation navigation hub**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Purpose:** Complete map of where information lives — read after [BRAIN.md](./BRAIN.md)  
> **Not duplicate of:** [01-architecture/PROJECT_MAP.md](./01-architecture/PROJECT_MAP.md) (visual platform architecture — 800+ lines)

---


## When To Read
Read after BRAIN.md when you need to locate a document or folder.

## Related Files
- [Cursor entry](BRAIN.md)
- [Module index](MODULE_REGISTRY.md)
- [Full hierarchy](MASTER_DOCUMENT_MAP.md)

## Read Next
- [Pick a module](MODULE_REGISTRY.md)

---

## How to Use

| Question | Answer in | Deep dive |
|----------|-----------|-----------|
| What is AgainERP? | [BRAIN.md](./BRAIN.md) §1 | [00-foundation/PRD.md](./00-foundation/PRD.md) |
| Where does code live? | [BRAIN.md](./BRAIN.md) §5–6 | [FINAL_ERP_STRUCTURE_MAP.md](./FINAL_ERP_STRUCTURE_MAP.md) §1 |
| What modules exist? | [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | [01-architecture/MODULE_DEPENDENCY_MAP.md](./01-architecture/MODULE_DEPENDENCY_MAP.md) |
| How do layers stack? | [BRAIN.md](./BRAIN.md) §3 | [01-architecture/PROJECT_MAP.md](./01-architecture/PROJECT_MAP.md) |
| UI patterns? | [BRAIN.md](./BRAIN.md) §4.2 | [04-uiux/standards/](./04-uiux/standards/) |
| Before coding? | [00-foundation/PRE_CODE_GATE.md](./00-foundation/PRE_CODE_GATE.md) | [GOVERNANCE_FRAMEWORK.md](./GOVERNANCE_FRAMEWORK.md) |

---

## 1. Reading Hierarchy (Token-Efficient)

**Full spec:** [BRAIN.md § AI Reading Policy](./BRAIN.md#ai-reading-policy)

```text
Level 1  BRAIN.md
Level 2  PROJECT_MAP · ARCHITECTURE_DECISIONS · MODULE_REGISTRY   (pick ONE)
Level 3  03-business-modules/{module}/README.md
Level 4  Architecture.md
Level 5  Database.md · API.md · Workflow.md · UI.md · AI.md · Reports.md   (pick ONE)
```

**Forbidden** (unless explicitly requested): `MASTER_INDEX.md` · `MASTER_DOCUMENT_MAP.md` · `API_REGISTRY.md` · `DATABASE_REGISTRY.md` · `SERVICE_REGISTRY.md`

This file is **Level 2** — open when you need doc locations, not module business logic.

---

## 2. AI Brain Stack

| File | Lines (approx) | Role |
|------|----------------|------|
| [BRAIN.md](./BRAIN.md) | ~320 | Cursor single entry |
| [PROJECT_MAP.md](./PROJECT_MAP.md) | ~280 | Doc location index |
| [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | ~200 | Module index |

---

## 3. Master Documents (docs/ root)

| Document | Purpose |
|----------|---------|
| [BRAIN.md](./BRAIN.md) | **Cursor entry** — start here |
| [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) | **Core decisions SSOT** — why, not how |
| [PROJECT_MAP.md](./PROJECT_MAP.md) | **Doc navigation** — this file |
| [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | **Module index** |
| [README.md](./README.md) | Human docs landing |
| [FINAL_ERP_STRUCTURE_MAP.md](./FINAL_ERP_STRUCTURE_MAP.md) | Structure SSOT |
| [GOVERNANCE_FRAMEWORK.md](./GOVERNANCE_FRAMEWORK.md) | 7 governance domains |
| [MASTER_DOCUMENT_MAP.md](./MASTER_DOCUMENT_MAP.md) | Full folder hierarchy + migration table — **forbidden bulk-read** ([AI Reading Policy](./BRAIN.md#ai-reading-policy)) |
| [MASTER_ARCHITECTURE_INDEX.md](./MASTER_ARCHITECTURE_INDEX.md) | Architecture doc index |
| [STANDARD_MODULE_TEMPLATE.md](./STANDARD_MODULE_TEMPLATE.md) | 10-section module template |
| [architecture/MODULE_ISOLATION_REPORT.md](./architecture/MODULE_ISOLATION_REPORT.md) | Isolation audit |

---

## 4. Enterprise Folders (00–10)

| Folder | Docs | Information lives here |
|--------|------|------------------------|
| [00-foundation/](./00-foundation/) | Governance, registries, standards | **Rules, PRD, gates, templates, traceability** |
| [01-architecture/](./01-architecture/) | Platform architecture, ADRs | **Layer diagrams, SaaS arch, dependency maps** |
| [02-core-platform/](./02-core-platform/) | Core engines, entities | **Users, contacts, workflow, events, permissions** |
| [03-business-modules/](./03-business-modules/) | 29 modules | **Per-module Architecture, DB, API, Menus** |
| [04-uiux/](./04-uiux/) | Standards, prototypes | **UI patterns, build guides, design tokens** |
| [05-development/](./05-development/) | API, DB, deploy, QA | **Dev standards, scripts, deployment** |
| [06-ai/](./06-ai/) | AI platform + experience | **AI OS arch, agents, UX specs** |
| [07-saas/](./07-saas/) | Multi-tenant SaaS | **Tenant, billing, licensing** |
| [08-builder/](./08-builder/) | Storefront builder | **Page/theme/form builder UI** |
| [09-integrations/](./09-integrations/) | Plugins, workflows | **External connectors, automation** |
| [10-roadmap/](./10-roadmap/) | Sequencing | **Module roadmap, dev sequence** |

---

## 5. Foundation (00-foundation/)

| Topic | Path |
|-------|------|
| Extended project brain | [PROJECT_BRAIN.md](./00-foundation/PROJECT_BRAIN.md) |
| Common rules (full) | [PROJECT_COMMON_RULES.md](./00-foundation/PROJECT_COMMON_RULES.md) |
| Pre-code gate | [PRE_CODE_GATE.md](./00-foundation/PRE_CODE_GATE.md) |
| Governance workflow | [GOVERNANCE.md](./00-foundation/GOVERNANCE.md) |
| Product requirements | [PRD.md](./00-foundation/PRD.md) |
| Tech constitution | [TECHNOLOGY_CONSTITUTION.md](./00-foundation/TECHNOLOGY_CONSTITUTION.md) |
| Change log | [CHANGELOG.md](./00-foundation/CHANGELOG.md) |
| Module framework | [UNIVERSAL_MODULE_FRAMEWORK.md](./00-foundation/UNIVERSAL_MODULE_FRAMEWORK.md) |
| Detailed module registry | [registries/MODULE_REGISTRY.md](./00-foundation/registries/MODULE_REGISTRY.md) |
| Doc audit (reorg basis) | [standards/PROJECT_DOCUMENT_AUDIT.md](./00-foundation/standards/PROJECT_DOCUMENT_AUDIT.md) |
| Industry catalog | [framework/INDUSTRY_MODULES.md](05-development/framework/INDUSTRY_MODULES.md) |
| Legacy full index | [MASTER_INDEX.md](./00-foundation/MASTER_INDEX.md) |

---

## 6. Architecture (01-architecture/)

| Topic | Path |
|-------|------|
| Visual platform map (deep) | [PROJECT_MAP.md](./01-architecture/PROJECT_MAP.md) |
| Module dependency matrix | [MODULE_DEPENDENCY_MAP.md](./01-architecture/MODULE_DEPENDENCY_MAP.md) |
| Master module architecture | [MASTER_MODULE_ARCHITECTURE.md](./01-architecture/MASTER_MODULE_ARCHITECTURE.md) |
| SaaS platform | [SAAS_PLATFORM_ARCHITECTURE.md](./01-architecture/SAAS_PLATFORM_ARCHITECTURE.md) |
| Hybrid licensed ERP | [HYBRID_LICENSED_ERP_ARCHITECTURE.md](./01-architecture/HYBRID_LICENSED_ERP_ARCHITECTURE.md) |
| Vision pointer | [project.md](./01-architecture/project.md) → PRD |
| ADRs | [decisions/](./01-architecture/decisions/) |

---

## 7. Core Platform (02-core-platform/)

| Topic | Path |
|-------|------|
| Core hub | [ARCHITECTURE.md](./02-core-platform/ARCHITECTURE.md) |
| Core API | [API.md](./02-core-platform/API.md) |
| Permissions | [PERMISSION_SYSTEM_ARCHITECTURE.md](./02-core-platform/PERMISSION_SYSTEM_ARCHITECTURE.md) |
| Engines | [engines/](./02-core-platform/engines/) — workflow, events, approval, notification, search |
| Entities | [entities/](./02-core-platform/entities/) — contacts, users, companies |
| Subsystems | [subsystems/](./02-core-platform/subsystems/) — activity-chatter, product-master, settings |

---

## 8. Business Modules (03-business-modules/)

**Index:** [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) · **Template:** [STANDARD_MODULE_TEMPLATE.md](./STANDARD_MODULE_TEMPLATE.md)

Each module folder typically contains:

```text
ModuleManifest.md · Architecture.md · Database.md · API.md
Workflow.md · Permissions.md · Reports.md · AI.md · CHANGELOG.md · Menus/
```

### 7.1 By domain

| Domain | Modules | Registry section |
|--------|---------|------------------|
| Commerce | `ecommerce` (+ 12 sub-areas) | § Commerce |
| Revenue & supply | crm, sales, purchase, inventory, finance, accounting, manufacturing, pos | § ERP — Revenue |
| People & projects | hr, payroll, hr-payroll, project, timesheet | § ERP — People |
| Growth & partners | marketing, sales-marketing, business-partners, product-configurator | § ERP — Growth |
| Support & analytics | helpdesk, documents, knowledge, bi-system, data-warehouse | § ERP — Support |
| Operations | fleet, logistics, booking, marketplace, subscription | § ERP — Operations |

### 7.2 Ecommerce sub-areas (documentation views)

| Area | Architecture |
|------|--------------|
| Hub | [ecommerce/Architecture.md](./03-business-modules/ecommerce/Architecture.md) |
| Catalog | [ecommerce/catalog/ARCHITECTURE.md](./03-business-modules/ecommerce/catalog/ARCHITECTURE.md) |
| Orders | [ecommerce/orders/ARCHITECTURE.md](./03-business-modules/ecommerce/orders/ARCHITECTURE.md) |
| Customers | [ecommerce/customers/ARCHITECTURE.md](./03-business-modules/ecommerce/customers/ARCHITECTURE.md) |
| Builder | [ecommerce/builder/ARCHITECTURE.md](./03-business-modules/ecommerce/builder/ARCHITECTURE.md) |
| Storefront | [ecommerce/ECOMMERCE_STOREFRONT_ARCHITECTURE.md](./03-business-modules/ecommerce/ECOMMERCE_STOREFRONT_ARCHITECTURE.md) |
| Admin menus | [ecommerce/Menus/](./03-business-modules/ecommerce/Menus/) (167 screens) |

---

## 9. UI / UX (04-uiux/)

| Topic | Path |
|-------|------|
| UI standards (mandatory) | [standards/](./04-uiux/standards/) |
| Per-screen build guides | [prototype/](./04-uiux/prototype/) |
| Design system / tokens | [design-system/](./04-uiux/design-system/) |
| Prototype strategy | [strategy/](./04-uiux/strategy/) |
| Recharts conventions | [standards/recharts-conventions.md](./04-uiux/standards/recharts-conventions.md) |
| Mobile-first | [standards/mobile-first.md](./04-uiux/standards/mobile-first.md) |

**Code mirror:** `apps/web/src/components/` · `apps/web/design-system/`

---

## 10. Development (05-development/)

| Topic | Path |
|-------|------|
| Development hub | [05-development/](./05-development/) |
| API conventions | Subfolder per topic under `05-development/` |
| Database standards | Subfolder per topic under `05-development/` |
| Governance scripts | [scripts/generate-governance-registries.py](./05-development/scripts/generate-governance-registries.py) |

---

## 11. AI Layer (06-ai/)

| Topic | Path |
|-------|------|
| AI OS platform architecture | [platform/ai/AI_OS_ARCHITECTURE.md](./06-ai/platform/ai/AI_OS_ARCHITECTURE.md) |
| AI experience specs | [experience/](./06-ai/experience/) |
| AI knowledge index | [00-foundation/AI_KNOWLEDGE_INDEX.md](./00-foundation/AI_KNOWLEDGE_INDEX.md) |

**Code:** `apps/web/src/app/(admin)/ai-os/` · `components/ai-os/`

---

## 12. SaaS (07-saas/)

| Topic | Path |
|-------|------|
| Tenant architecture | [TENANT_ARCHITECTURE.md](./07-saas/TENANT_ARCHITECTURE.md) |
| Billing / subscription module | [03-business-modules/subscription/](./03-business-modules/subscription/) |

---

## 13. Application Code Map

| Path | Contents |
|------|----------|
| `apps/web/src/app/(admin)/` | Admin module routes |
| `apps/web/src/app/(storefront)/` | Storefront routes |
| `apps/web/src/app/api/v1/` | Mock REST APIs |
| `apps/web/src/components/{module}/` | Module UI components |
| `apps/web/src/lib/mock-data/` | Prototype seed data |
| `apps/web/src/lib/store/` | Zustand stores |
| `apps/web/src/lib/navigation.ts` | Global nav |

**Not in repo yet:** `apps/api/` (FastAPI)

---

## 14. Path Migration (Legacy Links)

Moved files may still link to old paths. Resolve via [MASTER_DOCUMENT_MAP.md](./MASTER_DOCUMENT_MAP.md) §4:

| Old path | New path |
|----------|----------|
| `docs/modules/{m}/` | `docs/03-business-modules/{m}/` |
| `docs/modules/core/` | `docs/02-core-platform/subsystems/` |
| `docs/modules/ai/` | `docs/06-ai/platform/ai/` |
| `docs/ui-ux/` | `docs/04-uiux/standards/` |
| `docs/ui-prototype/` | `docs/04-uiux/prototype/` |
| `docs/GOVERNANCE.md` (root) | `docs/00-foundation/GOVERNANCE.md` |

---

---

**Maintainer:** Platform Architecture · **Last Updated:** 2026-06-19
