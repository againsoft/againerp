# AgainERP — Master Document Map

## Purpose
Full documentation hierarchy after enterprise folder reorganization.

## When To Read
Read when resolving legacy paths or browsing the complete docs tree.

## Related Files
- [Cursor entry](BRAIN.md)
- [Slim navigation hub](PROJECT_MAP.md)

## Read Next
- [Nav standard](00-foundation/standards/DOCUMENT_NAVIGATION_STANDARD.md)

---

> **Status:** Active  
> **Version:** 1.0  
> **Date:** 2026-06-19  
> **Purpose:** Canonical navigation hub for the reorganized documentation hierarchy  
> **Reorg basis:** [PROJECT_DOCUMENT_AUDIT.md](./00-foundation/standards/PROJECT_DOCUMENT_AUDIT.md)  
> **Governance:** [GOVERNANCE.md](./00-foundation/GOVERNANCE.md)

---


## When To Read
Read when resolving legacy paths or browsing the complete docs tree.

## Related Files
- [Cursor entry](BRAIN.md)
- [Slim navigation hub](PROJECT_MAP.md)

## Read Next
- [Nav standard](00-foundation/standards/DOCUMENT_NAVIGATION_STANDARD.md)

---

## 1. How to Use This Map

| Audience | Start Here |
|----------|------------|
| **Cursor & AI agents** | [BRAIN.md](./BRAIN.md) → [PROJECT_MAP.md](./PROJECT_MAP.md) → [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) |
| **Developers (deep dive)** | [00-foundation/PROJECT_BRAIN.md](./00-foundation/PROJECT_BRAIN.md) |
| **Before any code** | [00-foundation/PRE_CODE_GATE.md](./00-foundation/PRE_CODE_GATE.md) |
| **Architecture overview** | [01-architecture/PROJECT_MAP.md](./01-architecture/PROJECT_MAP.md) |
| **Module work** | [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) → `03-business-modules/{module}/` |
| **UI prototype work** | [04-uiux/prototype/](./04-uiux/prototype/) |
| **Full legacy index** | [00-foundation/MASTER_INDEX.md](./00-foundation/MASTER_INDEX.md) |

**Rule:** No duplicate content was created during reorganization. Files were **moved** into numbered folders. Internal markdown links in moved files may still reference old paths until updated incrementally — use the **Path Migration Table** (§4) to resolve.

**Navigation layer (Step 02):** Major docs include `## Purpose`, `## When To Read`, `## Related Files`, `## Read Next` — see [DOCUMENT_NAVIGATION_STANDARD.md](./00-foundation/standards/DOCUMENT_NAVIGATION_STANDARD.md).

---

## 2. Enterprise Folder Structure

```text
docs/
├── README.md                          ← Human docs entry
├── BRAIN.md                           ← Cursor entry (read first)
├── PROJECT_MAP.md                     ← Doc navigation hub
├── MODULE_REGISTRY.md                 ← Module index
├── MASTER_DOCUMENT_MAP.md             ← THIS FILE
│
├── 00-foundation/                     ← Governance & registries
│   ├── PROJECT_BRAIN.md               ← Extended brain (deep dive)
│   ├── GOVERNANCE.md
│   ├── PROJECT_COMMON_RULES.md
│   ├── PRE_CODE_GATE.md
│   ├── TECHNOLOGY_CONSTITUTION.md
│   ├── PRD.md
│   ├── CHANGELOG.md
│   ├── MASTER_INDEX.md                ← Legacy full index
│   ├── UNIVERSAL_MODULE_FRAMEWORK.md
│   ├── MODULE_STRUCTURE.md
│   ├── registries/                    ← All *_REGISTRY.md + _registries/
│   ├── standards/                     ← Doc standards, health, audit
│   ├── templates/                     ← _*.md templates
│   └── traceability/                  ← ADR_INDEX, TRACEABILITY_MATRIX
│
├── 01-architecture/                   ← 21 docs — platform architecture
│   ├── project.md                     ← Vision pointer → PRD
│   ├── PROJECT_MAP.md
│   ├── MASTER_MODULE_ARCHITECTURE.md
│   ├── SAAS_PLATFORM_ARCHITECTURE.md
│   ├── HYBRID_LICENSED_ERP_ARCHITECTURE.md
│   ├── MODULE_DEPENDENCY_MAP.md
│   ├── DependencyMap.md
│   └── decisions/                     ← ADRs (formerly adr/)
│
├── 02-core-platform/                  ← 38 docs — shared Core layer
│   ├── ARCHITECTURE.md
│   ├── API.md · ModuleManifest.md
│   ├── PERMISSION_SYSTEM_ARCHITECTURE.md
│   ├── engines/                       ← Workflow, events, approval, …
│   ├── entities/                      ← users, contacts, permissions, …
│   └── subsystems/                    ← activity-chatter, product-master, settings
│       (merged from docs/modules/core/)
│
├── 03-business-modules/               ← 321 docs — all business modules
│   ├── ecommerce/                     ← Active (167 Menus + 12 sub-areas)
│   ├── crm/ · sales/ · purchase/ · inventory/ · accounting/ …
│   ├── hr-payroll/ · manufacturing/ · sales-marketing/ …
│   └── product-configurator/ · business-partners/ · subscription/ …
│
├── 04-uiux/                           ← 486 docs — UI & UX
│   ├── standards/                     ← Global UI patterns (formerly ui-ux/)
│   ├── prototype/                     ← Build guides (formerly ui-prototype/)
│   ├── design-system/                 ← Design tokens & HR spec
│   └── strategy/                      ← UI_PROTOTYPE_MODE, STRATEGY, Phase1
│
├── 05-development/                    ← 36 docs — engineering standards
│   ├── api/ · database/ · deployment/ · qa/
│   ├── framework/                     ← Module templates, industry modules
│   └── scripts/                       ← generate-governance-registries.py
│
├── 06-ai/                             ← 14 docs — AI OS
│   ├── experience/                    ← AI UX vision (formerly ai_os/)
│   └── platform/                      ← AI module architecture (from modules/ai/)
│
├── 07-saas/                           ← 8 docs — SaaS platform ops
│   └── (formerly platform/)           ← Tenant, billing, hybrid deployment
│
├── 08-builder/                        ← 39 docs — visual builders
│   └── prototype/                     ← Builder UI build guides (from ui-prototype/builder/)
│   (module architecture: 03-business-modules/ecommerce/builder/)
│
├── 09-integrations/                   ← 4 docs — plugins & workflows
│   ├── plugins/
│   └── workflows/
│
└── 10-roadmap/                        ← 5 docs — planning
    ├── MASTER_DEVELOPMENT_SEQUENCE.md
    └── plans/                         ← (formerly roadmap/)
```

**Total:** ~1,007 markdown files (unchanged count — moves only).

---

## 3. Reading Order by Task

### 3.1 New Developer Onboarding

1. [00-foundation/PROJECT_BRAIN.md](./00-foundation/PROJECT_BRAIN.md)
2. [01-architecture/PROJECT_MAP.md](./01-architecture/PROJECT_MAP.md)
3. [02-core-platform/ARCHITECTURE.md](./02-core-platform/ARCHITECTURE.md)
4. [04-uiux/standards/module-ui-standard.md](./04-uiux/standards/module-ui-standard.md)
5. [03-business-modules/ecommerce/Architecture.md](./03-business-modules/ecommerce/Architecture.md) (active module)

### 3.2 New Module Documentation

1. [00-foundation/MODULE_STRUCTURE.md](./00-foundation/MODULE_STRUCTURE.md)
2. [00-foundation/UNIVERSAL_MODULE_FRAMEWORK.md](./00-foundation/UNIVERSAL_MODULE_FRAMEWORK.md)
3. [00-foundation/templates/_MODULE_TEMPLATE.md](./00-foundation/templates/_MODULE_TEMPLATE.md)
4. [01-architecture/MODULE_DEPENDENCY_MAP.md](./01-architecture/MODULE_DEPENDENCY_MAP.md)
5. Create package under `03-business-modules/{module}/`

### 3.3 UI Prototype Implementation

1. [04-uiux/strategy/UI_PROTOTYPE_STRATEGY.md](./04-uiux/strategy/UI_PROTOTYPE_STRATEGY.md)
2. [04-uiux/standards/layout-architecture.md](./04-uiux/standards/layout-architecture.md)
3. [04-uiux/prototype/README.md](./04-uiux/prototype/README.md)
4. Module Menus spec: `03-business-modules/{module}/Menus/`
5. Build guide: `04-uiux/prototype/{area}/`

### 3.4 AI Feature Work

1. [06-ai/experience/README.md](./06-ai/experience/README.md)
2. [06-ai/platform/AI_OS_ARCHITECTURE.md](06-ai/platform/ai/AI_OS_ARCHITECTURE.md)
3. [00-foundation/registries/AI_KNOWLEDGE_INDEX.md](./00-foundation/registries/AI_KNOWLEDGE_INDEX.md)

---

## 4. Path Migration Table

Use this table when resolving old links in code comments, cursor rules, or markdown.

| Old Path | New Path |
|----------|----------|
| `docs/PROJECT_BRAIN.md` | `docs/00-foundation/PROJECT_BRAIN.md` |
| `docs/GOVERNANCE.md` | `docs/00-foundation/GOVERNANCE.md` |
| `docs/PRE_CODE_GATE.md` | `docs/00-foundation/PRE_CODE_GATE.md` |
| `docs/TECHNOLOGY_CONSTITUTION.md` | `docs/00-foundation/TECHNOLOGY_CONSTITUTION.md` |
| `docs/PROJECT_COMMON_RULES.md` | `docs/00-foundation/PROJECT_COMMON_RULES.md` |
| `docs/PRD.md` | `docs/00-foundation/PRD.md` |
| `docs/CHANGELOG.md` | `docs/00-foundation/CHANGELOG.md` |
| `docs/MASTER_INDEX.md` | `docs/00-foundation/MASTER_INDEX.md` |
| `docs/MODULE_STRUCTURE.md` | `docs/00-foundation/MODULE_STRUCTURE.md` |
| `docs/UNIVERSAL_MODULE_FRAMEWORK.md` | `docs/00-foundation/UNIVERSAL_MODULE_FRAMEWORK.md` |
| `docs/*_REGISTRY.md` | `docs/00-foundation/registries/*_REGISTRY.md` |
| `docs/_registries/` | `docs/00-foundation/registries/_registries/` |
| `docs/_*.md` (templates) | `docs/00-foundation/templates/_*.md` |
| `docs/DOCUMENTATION_STANDARD.md` | `docs/00-foundation/standards/DOCUMENTATION_STANDARD.md` |
| `docs/PROJECT_DOCUMENT_AUDIT.md` | `docs/00-foundation/standards/PROJECT_DOCUMENT_AUDIT.md` |
| `docs/ADR_INDEX.md` | `docs/00-foundation/traceability/ADR_INDEX.md` |
| `docs/TRACEABILITY_MATRIX.md` | `docs/00-foundation/traceability/TRACEABILITY_MATRIX.md` |
| `docs/PROJECT_MAP.md` | `docs/01-architecture/PROJECT_MAP.md` |
| `docs/MASTER_MODULE_ARCHITECTURE.md` | `docs/01-architecture/MASTER_MODULE_ARCHITECTURE.md` |
| `docs/SAAS_PLATFORM_ARCHITECTURE.md` | `docs/01-architecture/SAAS_PLATFORM_ARCHITECTURE.md` |
| `docs/HYBRID_LICENSED_ERP_ARCHITECTURE.md` | `docs/01-architecture/HYBRID_LICENSED_ERP_ARCHITECTURE.md` |
| `docs/MODULE_DEPENDENCY_MAP.md` | `docs/01-architecture/MODULE_DEPENDENCY_MAP.md` |
| `docs/DependencyMap.md` | `docs/01-architecture/DependencyMap.md` |
| `docs/adr/` | `docs/01-architecture/decisions/` |
| `architecture/project.md` | `docs/01-architecture/project.md` |
| `docs/core/` | `docs/02-core-platform/` |
| `docs/modules/core/` | `docs/02-core-platform/subsystems/` |
| `docs/modules/{module}/` | `docs/03-business-modules/{module}/` |
| `docs/ui-ux/` | `docs/04-uiux/standards/` |
| `docs/ui-prototype/` | `docs/04-uiux/prototype/` |
| `docs/ui-prototype/builder/` | `docs/08-builder/prototype/` |
| `docs/design-system/` | `docs/04-uiux/design-system/` |
| `docs/UI_PROTOTYPE_*.md` | `docs/04-uiux/strategy/` |
| `docs/api/` | `docs/05-development/api/` |
| `docs/database/` | `docs/05-development/database/` |
| `docs/deployment/` | `docs/05-development/deployment/` |
| `docs/qa/` | `docs/05-development/qa/` |
| `docs/framework/` | `docs/05-development/framework/` |
| `docs/scripts/` | `docs/05-development/scripts/` |
| `docs/ai_os/` | `docs/06-ai/experience/` |
| `docs/modules/ai/` | `docs/06-ai/platform/` |
| `docs/platform/` | `docs/07-saas/` |
| `docs/plugins/` | `docs/09-integrations/plugins/` |
| `docs/workflows/` | `docs/09-integrations/workflows/` |
| `docs/roadmap/` | `docs/10-roadmap/plans/` |
| `docs/MASTER_DEVELOPMENT_SEQUENCE.md` | `docs/10-roadmap/MASTER_DEVELOPMENT_SEQUENCE.md` |

---

## 5. Section Details

### 5.1 `00-foundation/` — Governance & Registries

| Subfolder / File | Contents |
|------------------|----------|
| Root | Entry points: PROJECT_BRAIN, GOVERNANCE, PRE_CODE_GATE, TECHNOLOGY_CONSTITUTION, PRD, CHANGELOG |
| `registries/` | DOCUMENT_REGISTRY, MODULE_REGISTRY, PAGE_REGISTRY, DATABASE_REGISTRY, API_REGISTRY, WORKFLOW_REGISTRY, AI_KNOWLEDGE_INDEX, SERVICE_REGISTRY, ENTITY_RELATIONSHIP_REGISTRY |
| `registries/_registries/` | Generated JSON + full registry tables |
| `standards/` | DOCUMENTATION_STANDARD, DEVELOPMENT_STANDARDS, FILE_NAMING_STANDARD, DOCUMENTATION_HEALTH_REPORT, PROJECT_DOCUMENT_AUDIT |
| `templates/` | _PAGE_TEMPLATE, _MODULE_TEMPLATE, _MODULE_MANIFEST_TEMPLATE, checklists |
| `traceability/` | ADR_INDEX, TRACEABILITY_MATRIX |

**Regenerate registries:** `python3 docs/05-development/scripts/generate-governance-registries.py`

### 5.2 `01-architecture/` — Platform Architecture

| Document | Role |
|----------|------|
| [project.md](./01-architecture/project.md) | Vision pointer → PRD |
| [PROJECT_MAP.md](./01-architecture/PROJECT_MAP.md) | Visual platform map |
| [MASTER_MODULE_ARCHITECTURE.md](./01-architecture/MASTER_MODULE_ARCHITECTURE.md) | Module layer blueprint |
| [MODULE_DEPENDENCY_MAP.md](./01-architecture/MODULE_DEPENDENCY_MAP.md) | Canonical dependency map |
| [decisions/](./01-architecture/decisions/) | ADR-001 through ADR-010+ |

### 5.3 `02-core-platform/` — Core Layer

| Area | Path |
|------|------|
| Core hub | [ARCHITECTURE.md](./02-core-platform/ARCHITECTURE.md) |
| Engines | [engines/](./02-core-platform/engines/) — workflow, events, approval, notification, search |
| Entities | [entities/](./02-core-platform/entities/) — users, contacts, tags, activities |
| Subsystems | [subsystems/](./02-core-platform/subsystems/) — activity-chatter, product-master, settings |

### 5.4 `03-business-modules/` — Business Modules (29 modules)

| Module | Path | Status |
|--------|------|--------|
| **Ecommerce** | [ecommerce/](./03-business-modules/ecommerce/) | Active — 167 screens |
| CRM | [crm/](./03-business-modules/crm/) | Draft |
| Sales | [sales/](./03-business-modules/sales/) | Draft |
| Purchase | [purchase/](./03-business-modules/purchase/) | Draft |
| Inventory | [inventory/](./03-business-modules/inventory/) | Draft |
| Accounting | [accounting/](./03-business-modules/accounting/) | Draft |
| HR & Payroll | [hr-payroll/](./03-business-modules/hr-payroll/) | Prototype docs |
| Manufacturing | [manufacturing/](./03-business-modules/manufacturing/) | Draft |
| Sales & Marketing | [sales-marketing/](./03-business-modules/sales-marketing/) | Prototype |
| Business Partners | [business-partners/](./03-business-modules/business-partners/) | Partial package |
| Product Configurator | [product-configurator/](./03-business-modules/product-configurator/) | Partial package |
| POS | [pos/](./03-business-modules/pos/) | Draft |
| HR · Payroll | [hr/](./03-business-modules/hr/) · [payroll/](./03-business-modules/payroll/) | Draft |
| Finance | [finance/](./03-business-modules/finance/) | Draft — consolidate with accounting |
| Marketing | [marketing/](./03-business-modules/marketing/) | Draft |
| Project | [project/](./03-business-modules/project/) | Draft |
| Helpdesk | [helpdesk/](./03-business-modules/helpdesk/) | Draft |
| Documents | [documents/](./03-business-modules/documents/) | Draft |
| Knowledge | [knowledge/](./03-business-modules/knowledge/) | Draft |
| Timesheet | [timesheet/](./03-business-modules/timesheet/) | Draft |
| Fleet | [fleet/](./03-business-modules/fleet/) | Draft |
| Logistics | [logistics/](./03-business-modules/logistics/) | Draft |
| Booking | [booking/](./03-business-modules/booking/) | Draft |
| Marketplace | [marketplace/](./03-business-modules/marketplace/) | Draft |
| BI System | [bi-system/](./03-business-modules/bi-system/) | Draft |
| Data Warehouse | [data-warehouse/](./03-business-modules/data-warehouse/) | Draft |
| Subscription | [subscription/](./03-business-modules/subscription/) | Draft — related to [07-saas/](./07-saas/) |

**Ecommerce sub-areas** (documentation views, not installable sub-modules):

`analytics/` · `builder/` · `catalog/` · `customers/` · `dashboard/` · `inventory/` · `marketing/` · `media/` · `orders/` · `reports/` · `reviews/` · `seo/` · `Menus/`

### 5.5 `04-uiux/` — UI & UX

| Subfolder | Former Path | Role |
|-----------|-------------|------|
| [standards/](./04-uiux/standards/) | `ui-ux/` | Global UI patterns — drawers, tables, charts, mobile-first |
| [prototype/](./04-uiux/prototype/) | `ui-prototype/` | Per-screen build guides (excludes builder → 08-builder) |
| [design-system/](./04-uiux/design-system/) | `design-system/` | Design tokens; HR specification |
| [strategy/](./04-uiux/strategy/) | root | UI_PROTOTYPE_MODE, UI_PROTOTYPE_STRATEGY, ECOMMERCE_ADMIN_PROTOTYPE_PHASE1 |

### 5.6 `05-development/` — Engineering

| Subfolder | Role |
|-----------|------|
| [api/](./05-development/api/) | API architecture standards |
| [database/](./05-development/database/) | Schema standards, MASTER_DATABASE_ARCHITECTURE |
| [deployment/](./05-development/deployment/) | CI/CD, Kubernetes, monitoring, security |
| [qa/](./05-development/qa/) | Testing strategy, load testing, doc review |
| [framework/](./05-development/framework/) | Industry modules catalog, communication contracts, templates |
| [scripts/](./05-development/scripts/) | Governance registry generator |

### 5.7 `06-ai/` — AI OS

| Subfolder | Former Path | Role |
|-----------|-------------|------|
| [experience/](./06-ai/experience/) | `ai_os/` | AI commerce vision, admin/storefront UX |
| [platform/](./06-ai/platform/) | `modules/ai/` | AI OS architecture, engines, digital twin |

### 5.8 `07-saas/` — SaaS Platform

Tenant architecture, billing, hybrid deployment, license sync, scaling roadmap.  
Related module docs: [03-business-modules/subscription/](./03-business-modules/subscription/)

### 5.9 `08-builder/` — Visual Builders

| Location | Role |
|----------|------|
| [prototype/](./08-builder/prototype/) | UI build guides for theme, page, form, checkout builders |
| [03-business-modules/ecommerce/builder/](./03-business-modules/ecommerce/builder/) | Builder module architecture |
| [03-business-modules/ecommerce/Menus/Builder/](./03-business-modules/ecommerce/Menus/Builder/) | Builder screen functional specs |

### 5.10 `09-integrations/` — Plugins & Workflows

| Subfolder | Role |
|-----------|------|
| [plugins/](./09-integrations/plugins/) | Plugin manifests (bank-emi, …) |
| [workflows/](./09-integrations/workflows/) | Cross-module workflow companions |

### 5.11 `10-roadmap/` — Planning

| Document | Role |
|----------|------|
| [MASTER_DEVELOPMENT_SEQUENCE.md](10-roadmap/MASTER_DEVELOPMENT_SEQUENCE.md) | Phase-gated development order |
| [plans/](./10-roadmap/plans/) | Module roadmap, development sequence |

---

## 6. Consolidation Actions Completed

| Audit Recommendation | Action Taken |
|---------------------|--------------|
| Move governance to foundation | → `00-foundation/` |
| Centralize architecture docs | → `01-architecture/` |
| Merge `modules/core/` into Core | → `02-core-platform/subsystems/` |
| Flat module list | → `03-business-modules/` (29 modules) |
| Unify UI docs | → `04-uiux/` (standards + prototype + design-system) |
| Separate AI docs | → `06-ai/` (experience + platform) |
| Fix `architecture/project.md` | Created pointer at `01-architecture/project.md` |
| Builder UI specs | → `08-builder/prototype/` |
| No duplicate content | All moves; file count ~1,007 unchanged |

**Not yet done (incremental):** Update internal cross-links inside moved markdown files; enrich ERP module 9-file packages; merge superseded Architecture stubs.

---

## 7. Maintenance

| **Navigation standard** | [00-foundation/standards/DOCUMENT_NAVIGATION_STANDARD.md](./00-foundation/standards/DOCUMENT_NAVIGATION_STANDARD.md) |
| **Regenerate nav on new major docs** | `python3 docs/05-development/scripts/add-doc-navigation.py` |
| Add new module docs | `03-business-modules/{module}/` per [MODULE_STRUCTURE.md](./00-foundation/MODULE_STRUCTURE.md) |
| Add new UI standard | `04-uiux/standards/` |
| Add new screen build guide | `04-uiux/prototype/{area}/` |
| Log doc changes | [00-foundation/CHANGELOG.md](./00-foundation/CHANGELOG.md) |
| Health dashboard | [00-foundation/standards/DOCUMENTATION_HEALTH_REPORT.md](./00-foundation/standards/DOCUMENTATION_HEALTH_REPORT.md) |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Initial master map after Step 02 reorganization |

---

---

**AgainERP Master Document Map** — one hierarchy, zero duplicates, find anything in two clicks.
