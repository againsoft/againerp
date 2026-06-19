# AgainERP — Architecture SSOT Map

> **Status:** Recovery Plan (no changes applied)  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 03 — Documentation Stabilization Phase  
> **Authority:** [BRAIN.md § Reading Hierarchy](./BRAIN.md#reading-hierarchy-token-efficient) · [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md)

---

## Purpose

Define the **Single Source of Truth (SSOT)** for each documentation domain — which file to read, which files are indexes only, and which files are deep dives or legacy redirects.

## When To Read

Read when unsure which document is authoritative for a domain. Prevents reading overlapping indexes or superseded architecture files.

## Related Files

- [Recovery plan](./DOCUMENTATION_RECOVERY_PLAN.md)
- [Link migration](./LINK_MIGRATION_PLAN.md)
- [Module template](./STANDARD_MODULE_TEMPLATE.md)

## Read Next

[BRAIN.md § Reading Hierarchy](./BRAIN.md#reading-hierarchy-token-efficient) — how many files to open per task

---

## 1. SSOT Principles

| Rule | Detail |
|------|--------|
| **One SSOT per concern** | Each row below has exactly one primary document |
| **Indexes ≠ SSOT** | Slim indexes point to SSOT — never duplicate content |
| **Level discipline** | Follow BRAIN Reading Hierarchy — stop at lowest sufficient level |
| **Module boundary** | Module SSOT lives under `03-business-modules/{module}/` |
| **Legacy files** | Become redirect stubs after merge — not deleted |
| **Recovery state** | Items marked 🔴 need Step 04 recovery action |

---

## 2. Domain SSOT Map

### 2.1 Architecture (Platform-Wide)

| Concern | SSOT (read this) | Level | Indexes / deep dives (do not read unless needed) |
|---------|-------------------|-------|--------------------------------------------------|
| **Cursor entry + rules** | [BRAIN.md](./BRAIN.md) | 1 | [00-foundation/PROJECT_BRAIN.md](./00-foundation/PROJECT_BRAIN.md) — extended checklists |
| **Core decisions (why)** | [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) | 2 | ADRs in [01-architecture/decisions/](./01-architecture/decisions/) |
| **Visual platform map** | [01-architecture/PROJECT_MAP.md](./01-architecture/PROJECT_MAP.md) 🔴 **truncated — restore pending** | 5 | [MASTER_MODULE_ARCHITECTURE.md](./01-architecture/MASTER_MODULE_ARCHITECTURE.md) — module patterns |
| **Doc folder locations** | [PROJECT_MAP.md](./PROJECT_MAP.md) | 2 | [MASTER_DOCUMENT_MAP.md](./MASTER_DOCUMENT_MAP.md) — full tree + migration |
| **Repo structure** | [FINAL_ERP_STRUCTURE_MAP.md](./FINAL_ERP_STRUCTURE_MAP.md) | — | — |
| **Module integration rules** | [01-architecture/MODULE_DEPENDENCY_MAP.md](./01-architecture/MODULE_DEPENDENCY_MAP.md) | — | [architecture/MODULE_ISOLATION_REPORT.md](./architecture/MODULE_ISOLATION_REPORT.md) |
| **Architecture doc index** | [MASTER_ARCHITECTURE_INDEX.md](./MASTER_ARCHITECTURE_INDEX.md) | — | [00-foundation/MASTER_INDEX.md](./00-foundation/MASTER_INDEX.md) — **avoid bulk-read** |
| **Core platform** | [02-core-platform/ARCHITECTURE.md](./02-core-platform/ARCHITECTURE.md) | 5 | engines/, entities/, subsystems/ |
| **SaaS / tenancy** | [07-saas/TENANT_ARCHITECTURE.md](./07-saas/TENANT_ARCHITECTURE.md) | 5 | [01-architecture/SAAS_PLATFORM_ARCHITECTURE.md](./01-architecture/SAAS_PLATFORM_ARCHITECTURE.md) |
| **Standard module shape** | [STANDARD_MODULE_TEMPLATE.md](./STANDARD_MODULE_TEMPLATE.md) | — | [00-foundation/templates/_MODULE_TEMPLATE.md](./00-foundation/templates/_MODULE_TEMPLATE.md) |

**Architecture recovery:** SSOT for visual platform map is `01-architecture/PROJECT_MAP.md` — restore from `git d378e95:docs/PROJECT_MAP.md`. Do **not** conflate with `docs/PROJECT_MAP.md` (doc navigation hub).

---

### 2.2 Modules

| Concern | SSOT (read this) | Level | Indexes / legacy (redirect only) |
|---------|-------------------|-------|----------------------------------|
| **Module discovery** | [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | 2 | [00-foundation/registries/MODULE_REGISTRY.md](./00-foundation/registries/MODULE_REGISTRY.md) — schema detail |
| **Module entry** | `03-business-modules/{module}/README.md` | 3 | — |
| **Module architecture** | `03-business-modules/{module}/Architecture.md` | 5 | `*_MODULE_ARCHITECTURE.md` → merge then stub |
| **Module manifest** | `03-business-modules/{module}/ModuleManifest.md` | 4 | — |
| **Cross-module deps** | [01-architecture/MODULE_DEPENDENCY_MAP.md](./01-architecture/MODULE_DEPENDENCY_MAP.md) | 2 | — |

#### Per-Module SSOT Status

| Module | Architecture SSOT | Status |
|--------|-------------------|--------|
| `ecommerce` | `Architecture.md` | ✅ Primary (7/10 package) |
| `business-partners` | `Architecture.md` | ✅ Primary (6/10 package) |
| `product-configurator` | `Architecture.md` | ✅ Primary (5/10 package) |
| `crm` | `CRM_MODULE_ARCHITECTURE.md` 🔴 | Merge → `Architecture.md` |
| `sales` | `SALES_MODULE_ARCHITECTURE.md` 🔴 | Merge → `Architecture.md` |
| `purchase` | `PURCHASE_MODULE_ARCHITECTURE.md` 🔴 | Merge → `Architecture.md` |
| `finance` | `FINANCE_MODULE_ARCHITECTURE.md` 🔴 | Rename → `Architecture.md` |
| `inventory` | `INVENTORY_MODULE_ARCHITECTURE.md` 🔴 | Rename → `Architecture.md` |
| `marketing` | `MARKETING_MODULE_ARCHITECTURE.md` 🔴 | Rename → `Architecture.md` |
| `hr-payroll` | `HR_PAYROLL_MASTER_ARCHITECTURE.md` 🔴 | Consolidate 15+ files → `Architecture.md` |
| `accounting` | `finance/Architecture.md` (future) | Stub at `accounting/Architecture.md` → finance |
| `sales-marketing` | None 🔴 | Create from ui-design docs |
| All others (16) | `Architecture.md` | ✅ Exists — package files mostly missing |

#### Ecommerce Sub-Areas (Doc Views — Not Installable Modules)

| Sub-area | SSOT entry | Architecture deep dive |
|----------|------------|-------------------------|
| `seo` | [ecommerce/seo/README.md](./03-business-modules/ecommerce/seo/README.md) | `seo/ARCHITECTURE.md` |
| `builder` | [ecommerce/builder/README.md](./03-business-modules/ecommerce/builder/README.md) | `builder/ARCHITECTURE.md` |
| `catalog` | [ecommerce/catalog/README.md](./03-business-modules/ecommerce/catalog/README.md) | `catalog/ARCHITECTURE.md` |
| `marketing` | [ecommerce/marketing/README.md](./03-business-modules/ecommerce/marketing/README.md) | `marketing/ARCHITECTURE.md` |
| `orders`, `customers`, `dashboard`, … | 🔴 README missing | `{area}/ARCHITECTURE.md` |

---

### 2.3 UI / UX

| Concern | SSOT (read this) | Level | Supporting docs |
|---------|-------------------|-------|-----------------|
| **Global UI rules** | [04-uiux/standards/](./04-uiux/standards/) | — | ENTERPRISE_UI_ARCHITECTURE, drawer pattern, tables |
| **Prototype mode rules** | [04-uiux/strategy/UI_PROTOTYPE_MODE.md](./04-uiux/strategy/UI_PROTOTYPE_MODE.md) | — | UI_PROTOTYPE_STRATEGY.md |
| **Admin screen specs (ecommerce)** | `03-business-modules/ecommerce/Menus/{area}/{screen}.md` | 4–5 | One screen per task |
| **Build guides (implementation)** | `04-uiux/prototype/{area}/` | 4–5 | One guide per screen/task |
| **Module nav map** | `{module}/UI.md` | 4 | Almost always missing — create during package rollout |
| **Design tokens / Figma** | [04-uiux/design-system/](./04-uiux/design-system/) | — | HR-specific spec exists (orphan — generalize or scope) |

#### UI Ownership Rule (to enforce in Step 04)

| Layer | SSOT for | Prototype/Menus relationship |
|-------|----------|------------------------------|
| **Menus/** | **What** the admin screen shows (fields, nav, permissions) | Prototype links here — does not duplicate field specs |
| **04-uiux/prototype/** | **How** to build in Next.js (components, mock data, routes) | Links to Menus for business spec |
| **04-uiux/standards/** | **Cross-module patterns** (drawer CRUD, tables, mobile) | Referenced by prototype guides |

**117 overlapping screen names** between Menus and prototype — not duplicates if ownership rule applied; consolidate only where content is identical.

---

### 2.4 Database

| Concern | SSOT (read this) | Level | Indexes |
|---------|-------------------|-------|---------|
| **Platform DB architecture** | [05-development/database/MASTER_DATABASE_ARCHITECTURE.md](./05-development/database/MASTER_DATABASE_ARCHITECTURE.md) | 5 | ER_DIAGRAM.md, standards.md |
| **Module schema** | `03-business-modules/{module}/Database.md` | 4 | — |
| **Registry (all tables)** | [00-foundation/registries/DATABASE_REGISTRY.md](./00-foundation/registries/DATABASE_REGISTRY.md) | — | Avoid bulk-read |
| **Entity registry** | [00-foundation/registries/ENTITY_RELATIONSHIP_REGISTRY.md](./00-foundation/registries/ENTITY_RELATIONSHIP_REGISTRY.md) | — | — |
| **Core entities** | [02-core-platform/entities/](./02-core-platform/entities/) | 5 | Shared entity definitions |
| **Multi-tenant rules** | [05-development/database/multi-company.md](./05-development/database/multi-company.md) | — | TENANT_ARCHITECTURE.md for SaaS layer |

**Anti-pattern SSOT:** [ARCHITECTURE_DECISIONS.md §2](./ARCHITECTURE_DECISIONS.md) — no cross-module DB joins.

---

### 2.5 API

| Concern | SSOT (read this) | Level | Indexes |
|---------|-------------------|-------|---------|
| **API design standards** | [05-development/api/](./05-development/api/) | — | API architecture standards |
| **Module API spec** | `03-business-modules/{module}/API.md` | 4 | — |
| **API registry (all routes)** | [00-foundation/registries/API_REGISTRY.md](./00-foundation/registries/API_REGISTRY.md) | — | Avoid bulk-read |
| **Core API** | [02-core-platform/API.md](./02-core-platform/API.md) | 5 | — |
| **Route prefix index** | [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | 2 | `/api/v1/{module}/` column |

**Convention SSOT:** `/api/v1/{module}/` — [ARCHITECTURE_DECISIONS.md §4](./ARCHITECTURE_DECISIONS.md)

Only **3 modules** have `API.md` today (ecommerce, business-partners, product-configurator).

---

### 2.6 AI

| Concern | SSOT (read this) | Level | Supporting docs |
|---------|-------------------|-------|-----------------|
| **AI OS platform** | [06-ai/platform/ai/AI_OS_ARCHITECTURE.md](./06-ai/platform/ai/AI_OS_ARCHITECTURE.md) | 5 | AI_CONTEXT_ENGINE, AI_AUDIT_AND_APPROVAL |
| **AI platform index** | [06-ai/platform/ai/README.md](./06-ai/platform/ai/README.md) | 3 | — |
| **AI experience vision** | [06-ai/experience/01_AI_COMMERCE_OS_VISION.md](./06-ai/experience/01_AI_COMMERCE_OS_VISION.md) | — | 02–04 admin/storefront UX |
| **Module AI tools** | `03-business-modules/{module}/AI.md` | 4 | **Missing in all 28 modules** |
| **AI knowledge index** | [00-foundation/registries/AI_KNOWLEDGE_INDEX.md](./00-foundation/registries/AI_KNOWLEDGE_INDEX.md) | — | Needs stub at parent path |
| **Ecommerce AI screens** | `ecommerce/Menus/AI/*.md` | 5 | Screen-level — one per task |

**Rule SSOT:** AI tools call APIs only — never ORM on business tables ([ARCHITECTURE_DECISIONS.md §6](./ARCHITECTURE_DECISIONS.md)).

---

### 2.7 Builder (Storefront / Page Builder)

| Concern | SSOT (read this) | Level | Supporting docs |
|---------|-------------------|-------|-----------------|
| **Builder module entry** | [03-business-modules/ecommerce/builder/README.md](./03-business-modules/ecommerce/builder/README.md) | 3 | — |
| **Builder architecture** | [03-business-modules/ecommerce/builder/ARCHITECTURE.md](./03-business-modules/ecommerce/builder/ARCHITECTURE.md) | 5 | — |
| **Builder tool specs** | [08-builder/prototype/](./08-builder/prototype/) | 5 | HomepageBuilder, MenuBuilder, ThemeManager, … (39 files) |
| **Builder admin menus** | `ecommerce/Menus/Builder/*.md` | 5 | Screen-level |
| **Storefront architecture** | [03-business-modules/ecommerce/ECOMMERCE_STOREFRONT_ARCHITECTURE.md](./03-business-modules/ecommerce/ECOMMERCE_STOREFRONT_ARCHITECTURE.md) | 5 | — |

#### Builder Read Path

```text
ecommerce/builder/README.md  →  08-builder/prototype/{Tool}.md  →  Menus/Builder/{screen}.md
```

Fix 156 broken links from `08-builder/prototype/` using correct relative depth (see LINK_MIGRATION_PLAN.md §9).

---

## 3. SSOT vs Index — Quick Reference

```text
READ (SSOT)                          DON'T READ (index / legacy)
─────────────────────────────────────────────────────────────────
BRAIN.md                             PROJECT_BRAIN.md (unless deep checklist)
PROJECT_MAP.md (doc locations)       MASTER_DOCUMENT_MAP.md (unless migrating paths)
ARCHITECTURE_DECISIONS.md            All ADRs (unless one decision needed)
MODULE_REGISTRY.md                   registries/MODULE_REGISTRY.md (unless schema)
{module}/README.md                   Module folder scan
{module}/Architecture.md             *_MODULE_ARCHITECTURE.md (legacy)
{module}/API.md                      API_REGISTRY.md (unless all routes)
04-uiux/standards/                   Entire prototype/ folder
One Menus/{screen}.md                All Menus/
01-architecture/PROJECT_MAP.md       MASTER_ARCHITECTURE_INDEX.md
```

---

## 4. SSOT Recovery Actions (Step 04)

| Domain | Action | Priority |
|--------|--------|----------|
| Architecture | Restore `01-architecture/PROJECT_MAP.md` | P0 |
| Modules | Merge 7 legacy `*_MODULE_ARCHITECTURE.md` files | P1 |
| UIUX | Declare Menus vs prototype ownership in DOCUMENT_NAVIGATION_STANDARD | P1 |
| Database | Fix `database/` → `05-development/database/` links | P0 |
| API | Create `API.md` for Active modules | P2 |
| AI | Create `{module}/AI.md` stubs linking to 06-ai/platform | P2 |
| Builder | Fix 08-builder relative links to ecommerce/builder | P0 |

---

## 5. Governance SSOT (Cross-Cutting)

| Concern | SSOT |
|---------|------|
| Documentation-first workflow | [00-foundation/GOVERNANCE.md](./00-foundation/GOVERNANCE.md) |
| 7-domain governance model | [GOVERNANCE_FRAMEWORK.md](./GOVERNANCE_FRAMEWORK.md) |
| Pre-code gate | [00-foundation/PRE_CODE_GATE.md](./00-foundation/PRE_CODE_GATE.md) |
| Development standards | [00-foundation/standards/DEVELOPMENT_STANDARDS.md](./00-foundation/standards/DEVELOPMENT_STANDARDS.md) |
| Common rules (full) | [00-foundation/PROJECT_COMMON_RULES.md](./00-foundation/PROJECT_COMMON_RULES.md) |
| Navigation standard | [00-foundation/standards/DOCUMENT_NAVIGATION_STANDARD.md](./00-foundation/standards/DOCUMENT_NAVIGATION_STANDARD.md) |
| Audit / recovery | [DOCUMENTATION_AUDIT.md](./DOCUMENTATION_AUDIT.md) · this file |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Initial architecture SSOT map (Step 03) |

---

**Architecture SSOT Map** — one truth per domain, indexes point — never duplicate.
