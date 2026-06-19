# AgainERP — Project Documentation Audit

> **Status:** Audit Report  
> **Version:** 1.0  
> **Date:** 2026-06-19  
> **Scope:** Full documentation tree under `docs/`  
> **Method:** Static inventory, naming analysis, module compliance check, cross-link scan  
> **Related:** [DOCUMENTATION_HEALTH_REPORT.md](./DOCUMENTATION_HEALTH_REPORT.md) · [GOVERNANCE.md](../GOVERNANCE.md) · [MODULE_STRUCTURE.md](../MODULE_STRUCTURE.md)

---

## Purpose
Documentation: PROJECT DOCUMENT AUDIT.

## When To Read
Read only if your task involves project document audit.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## Executive Summary

AgainERP documentation is **mature in governance** (14 system-critical files, registries, PRE_CODE_GATE) but **fragmented in physical layout**. ~**1,006** markdown files live under `docs/`, with **480** in `ui-prototype/` and **333** in `modules/`. The audit scan paths (`docs/`, `modules/`, `architecture/`, `uiux/`, `project/`) resolve to **`docs/` and its subfolders only** — there are no repo-root `architecture/`, `uiux/`, `project/`, or `modules/` directories.

| Finding | Severity |
|---------|----------|
| Duplicate / superseded architecture docs | High |
| UI spec triplication (Menus + ui-prototype + module uiux) | High |
| Core split across `docs/core/` and `docs/modules/core/` | High |
| Missing `architecture/project.md` (broken links) | High |
| Module package compliance (9 required files) | High — avg ~1/9 |
| Naming inconsistency (`Architecture.md` vs `ARCHITECTURE.md` vs `*_MODULE_ARCHITECTURE.md`) | Medium |
| 36 root-level markdown files (should be categorized) | Medium |
| Ecommerce nested submodules vs standalone ERP modules | Medium |

**Recommendation:** Reorganize into a canonical folder tree (§5) without deleting content — consolidate, redirect, and enforce one doc type per concern.

---

## 1. Current Structure

### 1.1 Top-Level Inventory

| Folder | MD Files (approx.) | Role |
|--------|-------------------|------|
| `docs/` (root) | 36 | Governance, registries, platform architecture |
| `docs/modules/` | 333 | Per-module architecture, menus, workflows |
| `docs/ui-prototype/` | 480 | UI build guides, screen specs, Changes/Review pairs |
| `docs/ui-ux/` | 41 | Global UI/UX standards |
| `docs/core/` | 35 | Core platform architecture, engines, entities |
| `docs/platform/` | 8 | SaaS tenant, billing, hybrid deployment |
| `docs/database/` | 7 | Schema standards, master DB architecture |
| `docs/ai_os/` | 5 | AI UX vision and experience patterns |
| `docs/adr/` | 14 | Architecture decision records |
| `docs/framework/` | 6 | Universal module framework, templates |
| `docs/deployment/` | 10 | CI/CD, K8s, monitoring |
| `docs/qa/` | 11 | Testing, load, production deployment |
| `docs/roadmap/` | 4 | Development sequence, module roadmap |
| `docs/plugins/` | 3 | Plugin manifests (e.g. bank-emi) |
| `docs/design-system/` | 1 | HR-specific design system (orphan) |
| `docs/api/` | 2 | API architecture standards |
| `docs/workflows/` | 1 | Workflow registry companion |
| `docs/_registries/` | 2 | Machine-generated registry exports |
| `docs/scripts/` | — | Governance generator scripts |

**Total:** ~1,006 markdown files (health report cites 557 registered — registry may lag ui-prototype expansion).

### 1.2 Module Folders (`docs/modules/` — 30 folders)

```
accounting · ai · bi-system · booking · business-partners · core*
crm · data-warehouse · documents · ecommerce · finance · fleet
helpdesk · hr · hr-payroll · inventory · knowledge · logistics
manufacturing · marketing · marketplace · payroll · pos
product-configurator · project · purchase · sales · sales-marketing
subscription · timesheet
```

\* `docs/modules/core/` is a **duplicate Core location** — see §2.2.

### 1.3 Ecommerce Internal Structure (largest module)

```
docs/modules/ecommerce/
├── Root package (Architecture, Database, API, Workflow, Permissions, UI, …)
├── Menus/                    ← 167 screen docs (132 with spaces in filename)
└── Nested "submodules"/      ← 12 folders, each with own ARCHITECTURE.md
    analytics · builder · catalog · customers · dashboard · inventory
    marketing · media · orders · reports · reviews · seo
```

### 1.4 UI Documentation Locations (4 variants)

| Location | Pattern | Example |
|----------|---------|---------|
| `docs/ui-ux/` | Global standards, kebab-case | `layout-architecture.md`, `recharts-conventions.md` |
| `docs/ui-prototype/{area}/` | Per-screen build guides | `ProductList.md`, `ProductListChanges.md`, `ProductListReview.md` |
| `docs/modules/ecommerce/Menus/` | Menu-mapped screen specs | `Product List.md` |
| `docs/modules/{module}/uiux/` or `ui-design/` | Module-local UI | `hr-payroll/uiux/`, `sales-marketing/ui-design/` |

### 1.5 Architecture Documentation Locations (scattered)

| Location | Files | Examples |
|----------|-------|----------|
| `docs/` root | 4+ | `SAAS_PLATFORM_ARCHITECTURE.md`, `MASTER_MODULE_ARCHITECTURE.md`, `HYBRID_LICENSED_ERP_ARCHITECTURE.md` |
| `docs/core/` | 1 + engines/ + entities/ | `ARCHITECTURE.md`, `PERMISSION_SYSTEM_ARCHITECTURE.md` |
| `docs/platform/` | 8 | `TENANT_ARCHITECTURE.md`, `SAAS_ER_DIAGRAM.md` |
| `docs/modules/{module}/` | Per module | Mixed naming — see §2.4 |
| `docs/modules/ecommerce/{sub}/` | 12 nested | `catalog/ARCHITECTURE.md`, `orders/ARCHITECTURE.md` |
| `docs/api/` | 1 | `architecture.md` (lowercase) |

**Missing:** `docs/architecture/` folder (referenced implicitly by broken links to `architecture/project.md`).

### 1.6 Governance Layer (healthy)

Mandatory files per [GOVERNANCE.md](../GOVERNANCE.md) are present:

`README.md` · `MASTER_INDEX.md` · `PROJECT_MAP.md` · `DOCUMENT_REGISTRY.md` · `MODULE_REGISTRY.md` · `PAGE_REGISTRY.md` · `DATABASE_REGISTRY.md` · `API_REGISTRY.md` · `WORKFLOW_REGISTRY.md` · `AI_KNOWLEDGE_INDEX.md` · `CHANGELOG.md` · `ADR_INDEX.md` · `TRACEABILITY_MATRIX.md` · `PROJECT_COMMON_RULES.md` · `DOCUMENTATION_HEALTH_REPORT.md` · `TECHNOLOGY_CONSTITUTION.md` · `PRE_CODE_GATE.md` · `PROJECT_BRAIN.md`

---

## 2. Problems Found

### 2.1 Duplicate Documents

| Duplicate Pair / Group | Location | Issue | Action |
|------------------------|----------|-------|--------|
| `Architecture.md` + `CRM_MODULE_ARCHITECTURE.md` | `modules/crm/` | Stub marked **Superseded**; full doc is canonical | Merge → keep `CRM_MODULE_ARCHITECTURE.md`; stub becomes redirect only or delete |
| `Architecture.md` + `SALES_MODULE_ARCHITECTURE.md` | `modules/sales/` | Same superseded pattern | Same |
| `Architecture.md` + `PURCHASE_MODULE_ARCHITECTURE.md` | `modules/purchase/` | Two architecture entry points | Same |
| `ARCHITECTURE.md` + `AI_OS_ARCHITECTURE.md` + `AI_FIRST_ARCHITECTURE.md` | `modules/ai/` | Three platform AI architecture docs | Consolidate under one canonical + appendix files |
| Ecommerce `Menus/*.md` ↔ `ui-prototype/**/*.md` | Cross-tree | **128** normalized screen-name overlaps (of 167 menu screens) | Single owner per screen — link, don't duplicate |
| `ui-ux/design-system.md` ↔ `design-system/HR_DESIGN_SYSTEM_SPECIFICATION.md` | Split folders | Two design-system docs, different scope | Nest HR spec under unified design-system tree |
| `DependencyMap.md` ↔ `MODULE_DEPENDENCY_MAP.md` | Root | Summary vs master — intentional but easy to drift | Keep both; add sync note in DependencyMap header |
| `DOCUMENTATION_HEALTH_REPORT.md` ↔ this audit | Root | Overlapping health metrics | Health report = ongoing dashboard; this audit = structural reorg plan |

**High-frequency duplicate basenames** (expected in modular tree, problematic when content diverges):

- `README.md` — 60 copies
- `Architecture.md` / `ARCHITECTURE.md` — 39 combined
- `Permissions.md` — 5 copies (core entity, ecommerce root, ecommerce menu, product-configurator, business-partners)

### 2.2 Overlapping Responsibilities

| Concern | Locations | Problem |
|---------|-----------|---------|
| **Core platform** | `docs/core/` AND `docs/modules/core/` | Core is documented in two trees. `modules/core/` holds `ACTIVITY_CHATTER_ARCHITECTURE.md`, `PRODUCT_MASTER_ARCHITECTURE.md`, `SETTINGS_ARCHITECTURE.md` while `docs/core/` has full `ARCHITECTURE.md`, engines, entities. Violates "Core docs are module-agnostic" rule in [MODULE_STRUCTURE.md](../MODULE_STRUCTURE.md). |
| **Inventory** | `modules/inventory/` AND `modules/ecommerce/inventory/` AND `ui-prototype/inventory/` | Three owners for warehouse/stock concepts. Standalone Inventory module vs Ecommerce admin inventory screens. |
| **Catalog / Products** | `modules/ecommerce/catalog/` AND `ui-prototype/catalog/` AND `modules/core/PRODUCT_MASTER_ARCHITECTURE.md` | Product master ownership split across Core, Ecommerce submodule, and UI prototype. |
| **HR domain** | `modules/hr/` · `modules/hr-payroll/` · `modules/payroll/` | Three module folders for one domain cluster. `hr-payroll` has 20 architecture docs + `uiux/` subfolder — bypasses standard 9-file package. |
| **Sales / Marketing** | `modules/sales/` · `modules/sales-marketing/` · `modules/marketing/` · `modules/ecommerce/marketing/` | Four folders; unclear which owns campaigns vs CRM pipeline vs commerce promotions. |
| **Finance** | `modules/finance/` · `modules/accounting/` | Parallel folders; DependencyMap lists "Finance" but registry lists "Accounting". |
| **AI** | `docs/ai_os/` · `modules/ai/` · `ui-prototype/ai-os/` | UX vision vs platform architecture vs UI build guides — correct separation in principle, weak cross-linking. |
| **SaaS / Platform** | Root `SAAS_PLATFORM_ARCHITECTURE.md`, `HYBRID_LICENSED_ERP_ARCHITECTURE.md` · `docs/platform/` | Platform architecture split between root and subfolder. |
| **UI standards** | `ui-ux/` · `ui-prototype/DUMMY_DATA_STANDARDS.md` · per-module `uiux/` · `ui-design/` | Four UI standard locations. |

### 2.3 Missing Architecture Links

| Broken / Missing Link | Referenced From | Fix |
|----------------------|-----------------|-----|
| `../architecture/project.md` | [PRD.md](../PRD.md), [MASTER_DEVELOPMENT_SEQUENCE.md](../../10-roadmap/MASTER_DEVELOPMENT_SEQUENCE.md) | Create `docs/architecture/project.md` OR retarget to [PRD.md](../PRD.md) / [PROJECT_MAP.md](../../PROJECT_MAP.md) |
| `architecture/project.md` at repo root | [DOCUMENTATION_HEALTH_REPORT.md](./DOCUMENTATION_HEALTH_REPORT.md) | Same |
| `docs/architecture/` index | Implied by governance; not present | Add `docs/architecture/README.md` as architecture hub |
| Module → Core engines | Many ERP stubs lack links to `docs/core/engines/*` | Add standard "Core Dependencies" section to each `Architecture.md` |
| Ecommerce submodules → standalone modules | `ecommerce/inventory/ARCHITECTURE.md` ↔ `inventory/INVENTORY_MODULE_ARCHITECTURE.md` | Bidirectional service-boundary links |
| `modules/hr/` ↔ `modules/hr-payroll/` | Minimal cross-linking | Single HR master index linking both |
| `finance/` ↔ `accounting/` | No merge doc | Declare accounting as canonical; finance as alias or merge |

### 2.4 Inconsistent Naming Conventions

Per [FILE_NAMING_STANDARD.md](./FILE_NAMING_STANDARD.md):

| Rule | Violations Found |
|------|------------------|
| Module root docs: `PascalCase.md` | 22 files named `ARCHITECTURE.md` (ALL CAPS); 16 named `Architecture.md` (correct) |
| Module deep docs: descriptive PascalCase | `INVENTORY_MODULE_ARCHITECTURE.md`, `SALES_MODULE_ARCHITECTURE.md`, `CRM_MODULE_ARCHITECTURE.md`, `HR_*_ARCHITECTURE.md` — mixed UPPER_SNAKE vs PascalCase |
| Core docs: lowercase-hyphen | `docs/core/ARCHITECTURE.md` is UPPERCASE (should be `architecture.md` per standard) |
| UI folders: lowercase-hyphen | `ai_os/` (underscore) vs `ui-prototype/ai-os/` (hyphen) |
| UI subfolders | `uiux/`, `ui-design/` vs canonical `ui-ux/` |
| Menu screen docs: Title Case + spaces | 132/167 ecommerce menu files — **correct per standard** but inconsistent with `ui-prototype/` PascalCase no spaces (`ProductList.md`) |
| `ui-ux/` files | `ENTERPRISE_UI_ARCHITECTURE.md`, `UI_UX_DESIGN_STANDARDS.md`, `UX_SMART_INTERACTION_STANDARDS.md` — UPPERCASE in kebab-case folder |

**Canonical recommendation:** Module root = `Architecture.md` (PascalCase). Deep dives = `{TOPIC}_ARCHITECTURE.md` OR subfolder `architecture/{topic}.md` — pick one pattern repo-wide.

### 2.5 Modules Violating Modular Architecture

Per [UNIVERSAL_MODULE_FRAMEWORK.md](../UNIVERSAL_MODULE_FRAMEWORK.md) and [MODULE_STRUCTURE.md](../MODULE_STRUCTURE.md):

#### Required 9-file package compliance

| Module | Score | Notes |
|--------|-------|-------|
| `business-partners` | 6/9 | Best ERP compliance; missing Reports, AI, CHANGELOG |
| `ecommerce` | 6/9 | Missing Reports, AI, CHANGELOG; only module with full Menus/ |
| `product-configurator` | 5/9 | Good manifest; missing Workflow, Reports, AI, CHANGELOG |
| Most ERP modules | 1/9 | Architecture stub only |
| `hr-payroll` | 0/9 | Non-standard layout — 15+ HR_* docs instead of package |
| `inventory`, `finance`, `marketing`, `sales-marketing` | 0/9 | Named architecture file but no standard `Architecture.md` |
| `docs/modules/core/` | 0/9 | Should not exist as a module folder |

**Only 3 modules have `ModuleManifest.md`:** ecommerce, business-partners, product-configurator (+ core at `docs/core/ModuleManifest.md`).

#### Structural violations

| Violation | Module | Detail |
|-----------|--------|--------|
| **Nested submodules inside ecommerce** | ecommerce | 12 subfolders with own `ARCHITECTURE.md` — treats catalog, inventory, orders as sub-modules. Conflicts with flat `docs/modules/` rule and standalone `inventory`, `sales` modules. |
| **Core as installable module folder** | `modules/core/` | Core is "not installable" per [MODULE_REGISTRY.md](../../MODULE_REGISTRY.md) but has a module folder with architecture fragments. |
| **Mega-module documentation** | hr-payroll | 20 architecture files + uiux/ — should decompose into hr + payroll modules with standard package or explicit `architecture/` subfolder. |
| **Duplicate domain modules** | hr / payroll / hr-payroll | Registry lists `hr` and `payroll` separately; implementation docs concentrate in `hr-payroll`. |
| **Finance vs Accounting** | finance / accounting | Two modules for one financial domain. |
| **Marketing fragmentation** | marketing / sales-marketing / ecommerce/marketing | Unclear service boundaries. |
| **Cross-module entity docs in wrong module** | ecommerce/catalog | `ENTITY_CATALOG.md` referenced from inventory module — acceptable via link, but ownership must be explicit in one place. |

### 2.6 Documents That Should Be Merged

| Merge Target | Sources | Rationale |
|--------------|---------|-----------|
| `modules/crm/CRM_MODULE_ARCHITECTURE.md` | Retire `Architecture.md` stub content | Already marked superseded |
| `modules/sales/SALES_MODULE_ARCHITECTURE.md` | Retire `Architecture.md` stub | Same |
| `modules/purchase/PURCHASE_MODULE_ARCHITECTURE.md` | Retire `Architecture.md` stub | Same |
| `modules/inventory/Architecture.md` (create) | Rename/link `INVENTORY_MODULE_ARCHITECTURE.md` | Align with MODULE_STRUCTURE standard filename |
| `modules/ai/AI_OS_ARCHITECTURE.md` | Fold `ARCHITECTURE.md`, `AI_FIRST_ARCHITECTURE.md` summaries | Single AI platform entry |
| `modules/accounting/` | Absorb `modules/finance/FINANCE_MODULE_ARCHITECTURE.md` | One financial module |
| `docs/design-system/README.md` | Merge `ui-ux/design-system.md` + `HR_DESIGN_SYSTEM_SPECIFICATION.md` | One design-system tree |
| Per-screen UI doc | `Menus/{Screen}.md` + `ui-prototype/{Screen}.md` + `{Screen}Changes.md` + `{Screen}Review.md` | One spec + optional changelog section |
| `DependencyMap.md` | Keep as 1-page extract of `MODULE_DEPENDENCY_MAP.md` | Auto-generate to prevent drift |

### 2.7 Documents That Should Be Moved

| Current Path | Recommended Path | Reason |
|--------------|------------------|--------|
| `SAAS_PLATFORM_ARCHITECTURE.md` | `docs/architecture/platform/saas-platform.md` | Centralize architecture |
| `HYBRID_LICENSED_ERP_ARCHITECTURE.md` | `docs/architecture/platform/hybrid-licensed.md` | Same |
| `MASTER_MODULE_ARCHITECTURE.md` | `docs/architecture/modules/master-module-architecture.md` | Same |
| `ECOMMERCE_ADMIN_PROTOTYPE_PHASE1.md` | `docs/ui-prototype/ecommerce/PHASE1.md` | Prototype doc, not governance |
| `modules/core/*.md` | `docs/core/subsystems/` | Core is not an installable module |
| `design-system/HR_DESIGN_SYSTEM_SPECIFICATION.md` | `docs/design-system/hr/specification.md` | Unified design-system folder |
| `modules/hr-payroll/uiux/*.md` | `docs/ui-ux/modules/hr/` OR `docs/ui-prototype/hr/` | Match global UI location |
| `modules/sales-marketing/ui-design/*.md` | `docs/ui-prototype/sales-marketing/` | Match ui-prototype convention |
| `modules/ecommerce/{sub}/ARCHITECTURE.md` | Keep but add `docs/architecture/ecommerce/{sub}.md` symlinks OR consolidate to submodule index | Reduce nested-module confusion |
| Broken target: create `docs/architecture/project.md` | From PRD content OR link to PRD | Fix broken references |

**Do not move (keep at root):** Governance registries, `PROJECT_BRAIN.md`, `PRE_CODE_GATE.md`, `TECHNOLOGY_CONSTITUTION.md`, `MASTER_INDEX.md` — these are intentionally top-level per GOVERNANCE.

---

## 3. Reorganization Plan

### Phase 1 — Fix Broken Links & Create Architecture Hub (Low risk)

1. Create `docs/architecture/README.md` as architecture navigation hub.
2. Create `docs/architecture/project.md` (extract from [PRD.md](../PRD.md) vision section) OR update all references to point to PRD/PROJECT_MAP.
3. Add redirect notes at old paths (one-line "Moved to …" stubs) — no content deletion.

### Phase 2 — Consolidate Core Documentation (High impact)

1. Move `docs/modules/core/*` → `docs/core/subsystems/`.
2. Update all links (WORKFLOW_ENGINE, SALES, PURCHASE, CRM docs reference `../core/`).
3. Remove `docs/modules/core/` folder after redirects.
4. Ensure `docs/core/ARCHITECTURE.md` links to all subsystem docs.

### Phase 3 — Normalize Module Packages (Medium effort)

1. For each ERP module: create standard 9-file skeleton from [framework/templates/](./05-development/framework/templates/).
2. Rename canonical architecture to `Architecture.md`; move deep content to sections or `architecture/` subfolder.
3. Retire superseded stubs (CRM, Sales, Purchase) after redirect period.
4. Resolve HR cluster: declare `hr-payroll` as composite doc set OR split into `hr/` + `payroll/` with master index.
5. Merge `finance/` into `accounting/`; add alias redirect.

### Phase 4 — Unify UI Documentation (Highest file count)

1. **Declare ownership model:**
   - `docs/modules/{module}/Menus/` = functional screen requirements (what)
   - `docs/ui-prototype/{module}/` = implementation build guides (how)
   - `docs/ui-ux/` = global patterns only (standards)
2. For ecommerce: pick **Menus/** as canonical for 167 screens; ui-prototype becomes `{Screen}_BUILD.md` linking to menu doc.
3. Collapse `*Changes.md` + `*Review.md` into git history or single `CHANGELOG` section per screen.
4. Move `hr-payroll/uiux/` and `sales-marketing/ui-design/` under `ui-prototype/`.

### Phase 5 — Ecommerce Submodule Boundary Clarification

1. Document in `ecommerce/Architecture.md`: nested folders are **documentation views**, not installable sub-modules.
2. Add explicit service-boundary tables linking `ecommerce/catalog` → Core product master, `ecommerce/inventory` → `inventory` module service.
3. Do **not** split ecommerce folders until Commerce module is extracted as optional install — document the future split path only.

### Phase 6 — Naming Standard Enforcement

1. Batch rename `ARCHITECTURE.md` → `Architecture.md` at module roots (22 files).
2. Rename `ai_os/` → `ai-os/` OR document exception in FILE_NAMING_STANDARD.
3. Standardize deep architecture naming: `{Domain}Architecture.md` in PascalCase.
4. Run `python3 docs/scripts/generate-governance-registries.py` after moves.

### Phase 7 — Registry & Health Sync

1. Update [DOCUMENT_REGISTRY.md](../registries/DOCUMENT_REGISTRY.md), [MASTER_INDEX.md](../MASTER_INDEX.md), [MODULE_REGISTRY.md](../../MODULE_REGISTRY.md).
2. Refresh [DOCUMENTATION_HEALTH_REPORT.md](./DOCUMENTATION_HEALTH_REPORT.md) metrics.
3. Add [CHANGELOG.md](../CHANGELOG.md) entry for documentation reorganization.

---

## 4. Recommended Folder Tree

Target state after reorganization (new folders marked with `*`):

```text
docs/
├── PROJECT_BRAIN.md                 # Mandatory entry (unchanged)
├── GOVERNANCE.md                    # Governance (unchanged)
├── MASTER_INDEX.md                  # Master TOC (unchanged)
├── PRE_CODE_GATE.md                 # Pre-code gate (unchanged)
├── TECHNOLOGY_CONSTITUTION.md       # Stack constitution (unchanged)
├── *_REGISTRY.md                    # All registries (unchanged at root)
├── PROJECT_DOCUMENT_AUDIT.md        # This file
│
├── architecture/                    # * NEW — platform architecture hub
│   ├── README.md                    # Architecture index & reading order
│   ├── project.md                   # Vision (fixes broken links)
│   ├── platform/
│   │   ├── saas-platform.md         # ← SAAS_PLATFORM_ARCHITECTURE.md
│   │   ├── hybrid-licensed.md       # ← HYBRID_LICENSED_ERP_ARCHITECTURE.md
│   │   └── tenant.md                # ← platform/TENANT_ARCHITECTURE.md (or link)
│   ├── modules/
│   │   └── master-module-architecture.md
│   └── ecommerce/                   # Optional: submodule boundary docs
│       ├── catalog-boundary.md
│       └── inventory-boundary.md
│
├── core/                            # Core platform (consolidated)
│   ├── ARCHITECTURE.md              # Core hub
│   ├── engines/                     # Workflow, events, approval, …
│   ├── entities/                    # users, contacts, permissions, …
│   └── subsystems/                  # * ← modules/core/* moved here
│       ├── activity-chatter.md
│       ├── product-master.md
│       └── settings.md
│
├── modules/                         # Flat module list (unchanged rule)
│   ├── {module}/
│   │   ├── ModuleManifest.md        # Required
│   │   ├── Architecture.md          # Required — single entry point
│   │   ├── Database.md
│   │   ├── API.md
│   │   ├── Workflow.md
│   │   ├── Permissions.md
│   │   ├── Reports.md
│   │   ├── AI.md
│   │   ├── CHANGELOG.md
│   │   ├── Menus/                   # Screen functional specs
│   │   └── architecture/            # * Optional deep dives (not sub-modules)
│   │       └── {topic}.md
│   └── ecommerce/                   # Active module — keep Menus/ + nested docs
│       └── …
│
├── ui-ux/                           # Global UI standards ONLY
│   ├── README.md
│   ├── layout-architecture.md
│   ├── module-ui-standard.md
│   └── modules/                     # * Module-specific UI standards
│       └── hr/
│
├── ui-prototype/                    # Implementation build guides
│   ├── README.md
│   ├── DUMMY_DATA_STANDARDS.md
│   └── {module}/
│       ├── README.md
│       ├── {MODULE}_UI_BUILD_GUIDE.md
│       └── {Screen}_BUILD.md        # Links to Menus/ spec
│
├── design-system/                   # Unified design tokens & specs
│   ├── README.md                    # ← merge ui-ux/design-system.md
│   └── hr/
│       └── specification.md
│
├── ai-os/                           # Renamed from ai_os/ (optional)
│   └── …                            # AI UX vision (unchanged content)
│
├── platform/                        # SaaS ops (tenant, billing, deployment)
├── database/                        # Schema standards
├── api/                             # API standards
├── framework/                       # Module framework & templates
├── adr/                             # Architecture decision records
├── deployment/                      # CI/CD, K8s
├── qa/                              # Quality assurance
├── roadmap/                         # Development roadmap
├── plugins/                         # Plugin manifests
├── workflows/                       # Cross-module workflows
├── _registries/                     # Generated registry exports
└── scripts/                         # Doc maintenance scripts
```

### Folder Rules (post-reorg)

| Folder | Owns | Must NOT contain |
|--------|------|------------------|
| `architecture/` | Platform-wide architecture, layer diagrams | Screen-level UI specs |
| `core/` | Shared engines, entities, subsystems | Business module logic |
| `modules/{name}/` | Module package (9 files) + Menus | Global UI standards |
| `ui-ux/` | Cross-module UI patterns | Screen field-level specs |
| `ui-prototype/` | Build guides, mock data conventions | Database schema |
| `design-system/` | Tokens, components, Figma specs | Workflow definitions |

---

## 5. Priority Matrix

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| P0 | Fix `architecture/project.md` broken links | 1 hr | Unblocks PRD, dev sequence |
| P0 | Move `modules/core/*` → `core/subsystems/` | 2 hr | Fixes Core duplication |
| P1 | Create `docs/architecture/README.md` hub | 2 hr | Navigation clarity |
| P1 | Retire superseded CRM/Sales/Purchase stubs | 1 hr | Removes confusion |
| P1 | Declare ecommerce nested folders as doc views | 1 hr doc | Modular boundary clarity |
| P2 | HR cluster consolidation plan | 4 hr | Major domain cleanup |
| P2 | Finance → Accounting merge | 2 hr | Domain dedup |
| P2 | UI doc ownership model (Menus vs ui-prototype) | 8 hr | 128 overlaps |
| P3 | Batch rename ARCHITECTURE → Architecture | 2 hr | Naming consistency |
| P3 | 9-file package rollout for ERP modules | Ongoing | MODULE_STRUCTURE compliance |
| P3 | Collapse Changes/Review UI doc pairs | Ongoing | 480 → ~200 ui-prototype files |

---

## 6. Metrics Baseline (for post-reorg comparison)

| Metric | Current | Target |
|--------|---------|--------|
| Total markdown files | ~1,006 | ~850 (after UI merge) |
| Root-level markdown (excl. governance) | 8 architecture/strategy | 0 (moved to architecture/) |
| Modules with 9-file package | 0 complete | All Active modules |
| ModuleManifest coverage | 3 modules | All Active + Ready modules |
| Broken architecture links | ≥2 (`architecture/project.md`) | 0 |
| Architecture filename variants | 3 patterns | 1 pattern |
| UI doc locations | 4 | 2 (ui-ux + ui-prototype) |
| Core documentation roots | 2 (`core/`, `modules/core/`) | 1 (`core/`) |
| Documentation health score | 75/100 | ≥90/100 |

---

## 7. References

| Document | Role in audit |
|----------|---------------|
| [MODULE_STRUCTURE.md](../MODULE_STRUCTURE.md) | Standard module folder template |
| [FILE_NAMING_STANDARD.md](./FILE_NAMING_STANDARD.md) | Naming rules baseline |
| [DOCUMENTATION_HEALTH_REPORT.md](./DOCUMENTATION_HEALTH_REPORT.md) | Quality metrics |
| [MODULE_REGISTRY.md](../../MODULE_REGISTRY.md) | Module inventory |
| [PROJECT_BRAIN.md](../PROJECT_BRAIN.md) | Intended doc map (§2 repository map) |
| [GOVERNANCE.md](../GOVERNANCE.md) | What must stay at root |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Initial full documentation structure audit |

---

**AgainERP Project Document Audit** — analyze first, reorganize second, registries always.
