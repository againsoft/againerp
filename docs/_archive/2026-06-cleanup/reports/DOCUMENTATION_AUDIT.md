# AgainERP — Documentation Audit

> **Status:** Audit Report (read-only — no fixes applied)  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 02 — Audit Existing Documentation  
> **Scope:** Full `docs/` tree (1,026 markdown files)  
> **Method:** Static inventory · module compliance · link scan · duplicate detection · overlap analysis  
> **Supersedes context:** [00-foundation/standards/PROJECT_DOCUMENT_AUDIT.md](./00-foundation/standards/PROJECT_DOCUMENT_AUDIT.md) (pre-reorg baseline)  
> **Post-reorg state:** Steps 01–05 applied (AI Brain stack, navigation layer, module READMEs, architecture decisions index, reading hierarchy)

---

## Purpose

Comprehensive audit of the current documentation tree — duplicates, gaps, misplacement, broken links, overlapping ownership, and recommended reorganization.

## When To Read

Read before any documentation reorganization or bulk link-fix pass. Do **not** bulk-read during feature implementation — use [BRAIN.md § Reading Hierarchy](./BRAIN.md#reading-hierarchy-token-efficient).

## Related Files

- [Cursor entry](./BRAIN.md)
- [Pre-reorg audit](./00-foundation/standards/PROJECT_DOCUMENT_AUDIT.md)
- [Health metrics](./00-foundation/standards/DOCUMENTATION_HEALTH_REPORT.md)
- [Structure SSOT](./FINAL_ERP_STRUCTURE_MAP.md)

## Read Next

- [Suggested reorganization §7](#7-suggested-reorganization) — priority actions only

---

## Executive Summary

The **numbered folder reorganization (00–10) is largely complete** — legacy top-level folders (`modules/`, `ui-prototype/`, `core/`, etc.) no longer exist on disk. The **AI Brain stack** (BRAIN → PROJECT_MAP / ARCHITECTURE_DECISIONS / MODULE_REGISTRY → module README) is in place.

However, **content has not caught up with structure**:

| Finding | Severity | Count |
|---------|----------|-------|
| Broken internal markdown links | **Critical** | ~3,374 / 7,852 checked (~43%) |
| Legacy path strings in file content | **Critical** | ~2,500+ references to moved paths |
| Truncated / corrupted key documents | **Critical** | ≥1 confirmed (`01-architecture/PROJECT_MAP.md`) |
| Duplicate navigation blocks (Step 02 script) | **High** | 123 files |
| UI spec duplication (Menus ↔ prototype) | **High** | 117 overlapping screen names |
| Module package incomplete (10-file standard) | **High** | 0 / 28 modules complete |
| Dual / legacy architecture files per module | **High** | 7 modules |
| Overlapping index / brain documents | **Medium** | 6 pairs |
| Misplaced root-level governance files | **Medium** | 2 files |
| Orphan non-numbered folder | **Low** | `docs/architecture/` |

**Recommendation:** Fix P0 corruption and link targets first, then consolidate overlapping indexes, then roll out module packages module-by-module. Do **not** delete content — redirect, stub, merge.

---

## 1. Current Inventory

### 1.1 Totals

| Metric | Value |
|--------|-------|
| Total markdown files | **1,026** |
| Enterprise folders (00–10) | 11 numbered + 1 orphan |
| Business modules | **28** (all have `README.md`) |
| Ecommerce admin screen docs (`Menus/`) | **168** |
| UI prototype docs (`04-uiux/prototype/`) | **441** |
| Builder prototype docs (`08-builder/prototype/`) | **39** |

### 1.2 Folder Distribution

| Folder | MD Files | Role |
|--------|----------|------|
| `04-uiux/` | 486 | Standards, strategy, prototype build guides |
| `03-business-modules/` | 327 | Module packages, Menus, nested ecommerce areas |
| `08-builder/` | 39 | Storefront/page builder specs |
| `02-core-platform/` | 38 | Core engines, entities, subsystems |
| `00-foundation/` | 37 | Governance, registries, templates |
| `05-development/` | 36 | API, database, deployment, QA, scripts |
| `01-architecture/` | 21 | Platform architecture, ADRs, dependency map |
| `06-ai/` | 14 | AI platform + experience specs |
| `07-saas/` | 8 | Tenant, scaling, SaaS ER |
| `10-roadmap/` | 5 | Development sequence, module plans |
| `09-integrations/` | 4 | Plugins, workflows |
| `docs/` root | 10 | AI Brain stack + governance indexes |
| `docs/architecture/` | 1 | Orphan — isolation report only |

### 1.3 AI Brain Stack (Post Step 01–05)

| File | Lines | Status |
|------|-------|--------|
| [BRAIN.md](./BRAIN.md) | ~404 | ✅ Active Cursor entry |
| [PROJECT_MAP.md](./PROJECT_MAP.md) | ~263 | ✅ Doc navigation hub |
| [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) | ~298 | ✅ Decision index |
| [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | ~205 | ✅ Module index → README |
| Module READMEs | 32 | ✅ 28 modules + 4 ecommerce sub-areas |

---

## 2. Duplicate Documents

### 2.1 Intentional Pairs (Index + Deep Dive)

These are **by design** but must stay clearly scoped to avoid agents reading both:

| Slim index (Cursor) | Deep document | Overlap risk |
|---------------------|---------------|--------------|
| [BRAIN.md](./BRAIN.md) | [00-foundation/PROJECT_BRAIN.md](./00-foundation/PROJECT_BRAIN.md) | Identity, rules, checklists |
| [PROJECT_MAP.md](./PROJECT_MAP.md) | [01-architecture/PROJECT_MAP.md](./01-architecture/PROJECT_MAP.md) | Doc locations vs visual platform map |
| [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | [00-foundation/registries/MODULE_REGISTRY.md](./00-foundation/registries/MODULE_REGISTRY.md) | Navigation vs schema/tables/API detail |
| [FINAL_ERP_STRUCTURE_MAP.md](./FINAL_ERP_STRUCTURE_MAP.md) | [MASTER_DOCUMENT_MAP.md](./MASTER_DOCUMENT_MAP.md) | Structure SSOT vs full folder tree |
| [GOVERNANCE_FRAMEWORK.md](./GOVERNANCE_FRAMEWORK.md) | [00-foundation/GOVERNANCE.md](./00-foundation/GOVERNANCE.md) | 7 domains vs operational governance |
| [STANDARD_MODULE_TEMPLATE.md](./STANDARD_MODULE_TEMPLATE.md) | [00-foundation/templates/_MODULE_TEMPLATE.md](./00-foundation/templates/_MODULE_TEMPLATE.md) | 10-section spec vs blank template |

### 2.2 Problematic Duplicates

#### A. Module architecture — dual files (same module, two sources of truth)

| Module | Canonical | Legacy (should merge → stub) |
|--------|-----------|------------------------------|
| `crm` | `Architecture.md` | `CRM_MODULE_ARCHITECTURE.md` |
| `sales` | `Architecture.md` | `SALES_MODULE_ARCHITECTURE.md` |
| `purchase` | `Architecture.md` | `PURCHASE_MODULE_ARCHITECTURE.md` |
| `finance` | — | `FINANCE_MODULE_ARCHITECTURE.md` only |
| `inventory` | — | `INVENTORY_MODULE_ARCHITECTURE.md` + `INVENTORY_WORKFLOW.md` |
| `marketing` | — | `MARKETING_MODULE_ARCHITECTURE.md` only |
| `hr-payroll` | — | 15+ `HR_*_ARCHITECTURE.md` files + master index |

`accounting/Architecture.md` is an explicit **superseded stub** pointing to `finance/` — acceptable if link targets are fixed.

#### B. Case-variant filenames (macOS single inode)

On case-insensitive filesystems, `Architecture.md` and `ARCHITECTURE.md` in the **same folder resolve to one file** but appear as duplicates in tooling scans. Affected: **23 modules** + **13 ecommerce sub-areas**. Standardize on `Architecture.md` per [STANDARD_MODULE_TEMPLATE.md](./STANDARD_MODULE_TEMPLATE.md).

#### C. UI screen triplication

| Location | Files | Pattern |
|----------|-------|---------|
| `03-business-modules/ecommerce/Menus/` | 168 | Admin screen specs (nav-aligned) |
| `04-uiux/prototype/` | 441 | Build guides + Changes/Review pairs |
| Overlap | **117 shared screen stems** | e.g. Orders, Categories, Coupons, AI screens |

Example overlap: `Menus/Catalog/Categories.md` ↔ `04-uiux/prototype/catalog/products/Categories.md` ↔ `04-uiux/prototype/catalog/categories/Categories.md` (**triple**).

#### D. Builder documentation split

| Location | Files | Notes |
|----------|-------|-------|
| `08-builder/prototype/` | 39 | HomepageBuilder, MenuBuilder, ThemeManager, … |
| `03-business-modules/ecommerce/builder/` | 2 | README + ARCHITECTURE |
| `03-business-modules/ecommerce/Menus/Builder/` | many | Screen-level builder menus |

Three locations for builder concerns — no single entry beyond `ecommerce/builder/README.md`.

#### E. Duplicate navigation blocks (script artifact)

**123 files** contain multiple `## Purpose` blocks — injected navigation from Step 02 script run without dedupe. Worst offenders:

| File | Duplicate nav blocks |
|------|---------------------|
| `crm/CRM_MODULE_ARCHITECTURE.md` | 11 |
| `inventory/INVENTORY_MODULE_ARCHITECTURE.md` | 9 |
| `sales/SALES_MODULE_ARCHITECTURE.md` | 8 |
| `inventory/INVENTORY_WORKFLOW.md` | 8 |
| `purchase/PURCHASE_MODULE_ARCHITECTURE.md` | 7 |

#### F. Wrong-path governance references (files exist, links wrong)

| Linked path (broken) | Actual location |
|----------------------|-----------------|
| `00-foundation/DEVELOPMENT_STANDARDS.md` | `00-foundation/standards/DEVELOPMENT_STANDARDS.md` |
| `00-foundation/WORKFLOW_REGISTRY.md` | `00-foundation/registries/WORKFLOW_REGISTRY.md` |
| `00-foundation/AI_KNOWLEDGE_INDEX.md` | `00-foundation/registries/AI_KNOWLEDGE_INDEX.md` |
| `00-foundation/UI_PROTOTYPE_MODE.md` | `04-uiux/strategy/UI_PROTOTYPE_MODE.md` |

Links use parent-folder paths; files live in `standards/` or `registries/` subfolders.

#### G. Duplicate basename groups (48 total)

Notable cross-concern collisions:

| Basename | Copies | Concern |
|----------|--------|---------|
| `permissions.md` | 5 | Module vs Core entity vs System menu |
| `api.md` | 4 | Module vs Core |
| `project_map.md` | 2 | Navigation vs architecture |
| `module_registry.md` | 2 | Index vs registry detail |

Most Menus ↔ prototype duplicates are **expected** until ownership model is declared.

---

## 3. Missing Documents

### 3.1 Standard Module Package (10 files per [STANDARD_MODULE_TEMPLATE.md](./STANDARD_MODULE_TEMPLATE.md))

| Required file | Modules missing | Coverage |
|---------------|-----------------|----------|
| `README.md` | 0 | **28 / 28** ✅ |
| `Architecture.md` | 5 | 23 / 28 |
| `ModuleManifest.md` | 25 | 3 / 28 (ecommerce, business-partners, product-configurator) |
| `Database.md` | 25 | 3 / 28 |
| `API.md` | 25 | 3 / 28 |
| `Workflow.md` | 26 | 2 / 28 |
| `Permissions.md` | 25 | 3 / 28 |
| `UI.md` | 27 | 1 / 28 (ecommerce) |
| `AI.md` | 28 | **0 / 28** |
| `Reports.md` | 28 | **0 / 28** |
| `CHANGELOG.md` | 28 | **0 / 28** |

**Full 10-file package:** **0 / 28 modules**. Best: `ecommerce` (7/10), `business-partners` (6/10).

### 3.2 Modules With No Architecture File

| Module | Has instead |
|--------|-------------|
| `sales-marketing` | UI design docs only (`ui-design/`, `SMW_UI_BUILD_GUIDE.md`) |
| `finance` | `FINANCE_MODULE_ARCHITECTURE.md` (non-standard name) |
| `inventory` | `INVENTORY_MODULE_ARCHITECTURE.md` (non-standard name) |
| `marketing` | `MARKETING_MODULE_ARCHITECTURE.md` (non-standard name) |
| `hr-payroll` | 15+ scattered `HR_*` files |

### 3.3 Stub / Placeholder Architecture Files

| File | Lines | Issue |
|------|-------|-------|
| `accounting/Architecture.md` | 29 | Superseded stub — points to finance |
| `ecommerce/catalog/ATTRIBUTE_PROFILE_ARCHITECTURE.md` | 27 | Likely incomplete |

### 3.4 Referenced but Missing (wrong path or absent)

| Expected path | Status | Actual location (if any) |
|---------------|--------|--------------------------|
| `00-foundation/DEVELOPMENT_STANDARDS.md` | ❌ Wrong path | `00-foundation/standards/DEVELOPMENT_STANDARDS.md` |
| `00-foundation/WORKFLOW_REGISTRY.md` | ❌ Wrong path | `00-foundation/registries/WORKFLOW_REGISTRY.md` |
| `00-foundation/UI_PROTOTYPE_MODE.md` | ❌ Wrong path | `04-uiux/strategy/UI_PROTOTYPE_MODE.md` |
| `00-foundation/AI_KNOWLEDGE_INDEX.md` | ❌ Wrong path | `00-foundation/registries/AI_KNOWLEDGE_INDEX.md` |
| `../../database/MASTER_DATABASE_ARCHITECTURE.md` | ❌ Wrong path | `05-development/database/MASTER_DATABASE_ARCHITECTURE.md` |
| `../../ui-ux/ENTERPRISE_UI_ARCHITECTURE.md` | ❌ Wrong path | `04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md` |
| `modules/ai/AI_OS_ARCHITECTURE.md` | ❌ Wrong path | `06-ai/platform/ai/AI_OS_ARCHITECTURE.md` |
| `../core/engines/*` | ❌ Wrong path | `02-core-platform/engines/*` |

### 3.5 Corrupted / Truncated Documents

| File | Expected | Actual | Impact |
|------|----------|--------|--------|
| [01-architecture/PROJECT_MAP.md](./01-architecture/PROJECT_MAP.md) | ~800+ lines (visual platform map) | **39 lines** (header + nav only) | **Critical** — body content lost; 20+ inbound links broken |
| [01-architecture/PROJECT_MAP.md](./01-architecture/PROJECT_MAP.md) | §1–§11 platform diagrams | Ends at line 39 | Level 5 deep-dive unusable |

> **Note:** BRAIN.md explicitly warns agents to avoid this file unless architecting — but it is still linked from MASTER_INDEX, MODULE_DEPENDENCY_MAP, and registry files.

---

## 4. Wrong Locations

### 4.1 Orphan / Non-Numbered Folders

| Path | Contents | Should be |
|------|----------|-----------|
| `docs/architecture/` | `MODULE_ISOLATION_REPORT.md` only | `01-architecture/` or linked stub from current path |

### 4.2 Wrong-Path References (files exist, path wrong)

| Linked path | Actual location |
|-------------|-----------------|
| `00-foundation/DEVELOPMENT_STANDARDS.md` | `00-foundation/standards/DEVELOPMENT_STANDARDS.md` |
| `00-foundation/WORKFLOW_REGISTRY.md` | `00-foundation/registries/WORKFLOW_REGISTRY.md` |
| `00-foundation/AI_KNOWLEDGE_INDEX.md` | `00-foundation/registries/AI_KNOWLEDGE_INDEX.md` |
| `../../database/` | `05-development/database/` |
| `../../ui-ux/` | `04-uiux/standards/` or `strategy/` |
| `modules/`, `core/`, `ui-prototype/` | `03-business-modules/`, `02-core-platform/`, `04-uiux/prototype/` |

### 4.3 Domain Misalignment

| Issue | Detail |
|-------|--------|
| **Finance vs Accounting** | Two modules (`finance/`, `accounting/`) with accounting stub pointing to finance — unclear which is installable |
| **Marketing triple** | Standalone `marketing/`, `sales-marketing/`, `ecommerce/marketing/` — boundary overlap |
| **Inventory triple** | Standalone `inventory/`, `ecommerce/inventory/` views, inventory screens in Menus |
| **HR scatter** | `hr/`, `payroll/`, `hr-payroll/`, `timesheet/` + 15 HR_* architecture files — no unified package |
| **Core vs module Permissions** | `02-core-platform/entities/permissions.md` vs module `Permissions.md` vs `Menus/System/Permissions.md` |

### 4.4 Ecommerce Nested “Submodules”

12 nested folders under `ecommerce/` each with own `ARCHITECTURE.md`:

```
analytics · builder · catalog · customers · dashboard · inventory
marketing · media · orders · reports · reviews · seo
```

These are **doc views**, not installable modules — but each looks like a full module package to folder scans. Only 4 have Step 03 `README.md` entry points (seo, builder, catalog, marketing).

---

## 5. Broken References

### 5.1 Link Scan Summary

| Metric | Value |
|--------|-------|
| Links scanned | 7,852 |
| Broken links | **3,374 (~43%)** |

### 5.2 Top Broken Targets

| Broken target | Occurrences | Fix |
|---------------|-------------|-----|
| `../../ui-ux/ENTERPRISE_UI_ARCHITECTURE.md` | 250 | → `04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md` |
| `./path.md` (placeholder) | 165 | Remove or replace in templates |
| `../../UI_PROTOTYPE_MODE.md` | 141 | → `04-uiux/strategy/UI_PROTOTYPE_MODE.md` |
| `../../modules/ai/AI_FIRST_ARCHITECTURE.md` | 122 | → `06-ai/platform/ai/AI_FIRST_ARCHITECTURE.md` |
| `../03-business-modules/ecommerce/builder/ARCHITECTURE.md` | 78 | Fix relative depth from `08-builder/` |
| `../core/ACTIVITY_CHATTER_ARCHITECTURE.md` | 49 | → `02-core-platform/subsystems/` |
| `../../core/engines/APPROVAL_ENGINE_ARCHITECTURE.md` | 38 | → `02-core-platform/engines/` |
| `../../database/MASTER_DATABASE_ARCHITECTURE.md` | 34 | → `05-development/database/` |
| `../../GOVERNANCE.md` / `./GOVERNANCE.md` | 60+ | → `00-foundation/GOVERNANCE.md` |
| `../../DEVELOPMENT_STANDARDS.md` | 45+ | Move file or add redirect stub |

### 5.3 Files With Most Broken Outbound Links

| File | Broken links |
|------|--------------|
| `00-foundation/MASTER_INDEX.md` | 251 |
| `10-roadmap/MASTER_DEVELOPMENT_SEQUENCE.md` | 134 |
| `00-foundation/traceability/TRACEABILITY_MATRIX.md` | 69 |
| `00-foundation/registries/AI_KNOWLEDGE_INDEX.md` | 62 |
| `00-foundation/registries/PAGE_REGISTRY.md` | 45 |
| `03-business-modules/hr-payroll/HR_MODULE_MASTER_INDEX.md` | 40 |
| `00-foundation/PRE_CODE_GATE.md` | 40 |

> **Token warning:** `MASTER_INDEX.md` and registry `*_FULL.md` files are high-link-density — listed as **forbidden bulk-read** in BRAIN.md Reading Hierarchy.

### 5.4 Legacy Path Strings Still in Content

Physical folders moved, but **content still references old paths**:

| Legacy prefix | References in content |
|---------------|----------------------|
| `modules/` | ~1,092 |
| `ui-ux/` | ~462 |
| `core/` | ~430 |
| `platform/` | ~229 |
| `ui-prototype/` | ~97 |
| `deployment/`, `framework/`, `api/`, `ai_os/`, `qa/`, `adr/`, … | ~200+ combined |

---

## 6. Overlapping Responsibilities

### 6.1 Who Owns “Project Map”?

| Document | Responsibility | Agent should read |
|----------|----------------|-------------------|
| [BRAIN.md](./BRAIN.md) §6 | App route map, high-level | Level 1 — every task |
| [PROJECT_MAP.md](./PROJECT_MAP.md) | **Doc folder** navigation | Level 2 — locate docs |
| [01-architecture/PROJECT_MAP.md](./01-architecture/PROJECT_MAP.md) | **Visual platform** architecture | Level 5 — architecting only |
| [FINAL_ERP_STRUCTURE_MAP.md](./FINAL_ERP_STRUCTURE_MAP.md) | Repo structure SSOT | Structure changes |
| [MASTER_DOCUMENT_MAP.md](./MASTER_DOCUMENT_MAP.md) | Full tree + migration table | Path migration |

**Risk:** Three different “maps” with similar names. Reading Hierarchy addresses this — but truncated `01-architecture/PROJECT_MAP.md` undermines Level 5.

### 6.2 Who Owns Module Discovery?

| Document | Scope |
|----------|-------|
| [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | Slim Cursor index (205 lines) |
| [00-foundation/registries/MODULE_REGISTRY.md](./00-foundation/registries/MODULE_REGISTRY.md) | Schema, tables, API prefixes (168 lines) |
| [01-architecture/MODULE_DEPENDENCY_MAP.md](./01-architecture/MODULE_DEPENDENCY_MAP.md) | Cross-module dependencies |
| [01-architecture/MASTER_MODULE_ARCHITECTURE.md](./01-architecture/MASTER_MODULE_ARCHITECTURE.md) | All-module architecture summary (729 lines) |
| [MASTER_ARCHITECTURE_INDEX.md](./MASTER_ARCHITECTURE_INDEX.md) | Architecture doc index (541 lines) |
| [00-foundation/MASTER_INDEX.md](./00-foundation/MASTER_INDEX.md) | Master doc index (679 lines) |

**Risk:** Six indexes for module/architecture discovery. Token hierarchy limits exposure — but indexes cross-link to broken paths.

### 6.3 UI Documentation Ownership (Unresolved)

| Layer | Owner | Contains |
|-------|-------|----------|
| Global standards | `04-uiux/standards/` | Drawer pattern, tables, filters, Recharts |
| Prototype build guides | `04-uiux/prototype/{area}/` | Screen implementation specs |
| Admin screen specs | `03-business-modules/ecommerce/Menus/` | Field-level admin screens |
| Builder tools | `08-builder/prototype/` | Page/widget builder specs |
| Module UI summary | `{module}/UI.md` | Nav map (almost always missing) |

**No declared rule** for which layer is SSOT when Menus and prototype disagree.

### 6.4 AI Documentation Split

| Location | Content |
|----------|---------|
| `06-ai/platform/ai/` | AI OS architecture, context engine, audit |
| `06-ai/experience/` | Commerce OS vision, admin/storefront UX |
| `{module}/AI.md` | Module AI tools — **missing in all 28 modules** |
| Ecommerce Menus `AI/` | 20+ AI screen specs |

Platform vs module vs screen-level AI docs overlap without a single `{module}/AI.md` entry point.

---

## 7. Suggested Reorganization

### 7.1 Priority Matrix

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| **P0** | **Restore** `01-architecture/PROJECT_MAP.md` from git/backup | 1 hr | Unblocks Level 5 architecture reads |
| **P0** | Bulk link-fix script: old path → new path mapping table | 4–8 hr | Fixes ~3,000 broken links |
| **P0** | Add redirect stubs or fix links for `DEVELOPMENT_STANDARDS`, `WORKFLOW_REGISTRY`, `AI_KNOWLEDGE_INDEX` path mismatches | 30 min | Fixes high-frequency broken targets |
| **P1** | Dedupe nav blocks in 123 files (re-run fixed script) | 2 hr | Removes noise, reduces token waste |
| **P1** | Merge legacy `*_MODULE_ARCHITECTURE.md` → `Architecture.md`; leave redirect stubs | 4 hr | Single source per module (crm, sales, purchase, finance, inventory, marketing) |
| **P1** | Declare UI ownership model: Menus = admin spec SSOT · prototype = build guide SSOT | 1 hr doc | Resolves 117 overlaps conceptually |
| **P1** | Consolidate HR cluster → `hr-payroll/Architecture.md` + section anchors | 8 hr | 30+ files → 1 entry + deep dives |
| **P2** | Roll out 10-file package for **Active** modules (start: ecommerce, crm, sales) | Ongoing | Template compliance |
| **P2** | Move `docs/architecture/` → `01-architecture/`; update inbound links | 1 hr | Eliminates orphan folder |
| **P2** | Finance/accounting merge decision — one module, one Architecture.md | 2 hr | Domain clarity |
| **P2** | Ecommerce sub-areas: add README to dashboard, orders, customers, … (8 missing) | 4 hr | Level 3 entry for all sub-areas |
| **P3** | Standardize `Architecture.md` casing (remove ARCHITECTURE.md alias confusion) | 2 hr | Tooling clarity |
| **P3** | Collapse Changes/Review UI pairs into single spec where redundant | Ongoing | ~441 → ~220 prototype files |
| **P3** | Update DOCUMENTATION_HEALTH_REPORT metrics (557 → 1,026 docs) | 1 hr | Accurate scorecard |
| **P3** | Retire or redirect `00-foundation/MASTER_INDEX.md` to AI Brain stack | 2 hr | Reduces index proliferation |

### 7.2 Target State (No Deletions)

```text
docs/
├── BRAIN.md · PROJECT_MAP.md · ARCHITECTURE_DECISIONS.md · MODULE_REGISTRY.md   ← Level 1–2 only
├── 00-foundation/          ← governance, registries (no stray root duplicates)
├── 01-architecture/        ← includes PROJECT_MAP (visual), isolation report
├── 02-core-platform/
├── 03-business-modules/{module}/
│   ├── README.md           ← Level 3 entry (all modules ✅)
│   ├── Architecture.md     ← 10-section SSOT (merge legacy *_MODULE_ARCHITECTURE)
│   ├── API.md · Database.md · Workflow.md · UI.md · …
│   └── Menus/              ← admin screen SSOT (ecommerce)
├── 04-uiux/
│   ├── standards/          ← global UI rules
│   └── prototype/          ← build guides (links to Menus, does not duplicate fields)
├── 05-development/
├── 06-ai/
├── 07-saas/
├── 08-builder/             ← builder tool specs (links ↔ ecommerce/builder/README)
├── 09-integrations/
└── 10-roadmap/
```

### 7.3 Link Migration Table (for P0 script)

| Old path prefix | New path prefix |
|-----------------|-----------------|
| `docs/modules/` | `docs/03-business-modules/` |
| `docs/ui-prototype/` | `docs/04-uiux/prototype/` |
| `docs/ui-ux/` | `docs/04-uiux/standards/` or `strategy/` |
| `docs/core/` | `docs/02-core-platform/` |
| `docs/platform/` | `docs/07-saas/` or `docs/01-architecture/` |
| `docs/ai_os/` · `modules/ai/` | `docs/06-ai/platform/ai/` |
| `docs/database/` | `docs/05-development/database/` |
| `docs/adr/` | `docs/01-architecture/decisions/` |
| `docs/framework/` | `docs/05-development/framework/` |
| `docs/deployment/` | `docs/05-development/deployment/` |
| `docs/qa/` | `docs/05-development/qa/` |
| `docs/roadmap/` | `docs/10-roadmap/` |
| `docs/plugins/` | `docs/09-integrations/plugins/` |
| `docs/scripts/` | `docs/05-development/scripts/` |

### 7.4 What Not to Reorganize Yet

- **Ecommerce Menus/** — 168 files; link-fix only, no moves
- **04-uiux/prototype/** — bulk content; fix links first, merge pairs later
- **Registries `_registries/*_FULL.md`** — machine-generated; update generator paths instead of hand-editing

---

## 8. Metrics Baseline

| Metric | Pre-reorg audit | Current | Target |
|--------|-----------------|---------|--------|
| Total markdown files | ~1,006 | **1,026** | ~900 (after UI pair merge) |
| Numbered folder compliance | Partial | **~95%** | 100% |
| Modules with README entry | 0 | **28 / 28** | 28 |
| Modules with full 10-file package | 0 | **0 / 28** | All Active modules |
| Broken link rate | Unknown | **~43%** | <5% |
| Legacy path refs in content | High | **~2,500+** | 0 |
| UI screen name overlap | 128 | **117** | Declared ownership model |
| Truncated key docs | Unknown | **≥1** | 0 |
| Duplicate nav blocks | 0 | **123 files** | 0 |
| Documentation health score | 75/100 | **~60/100** (estimated) | ≥90/100 |

---

## 9. Relationship to Other Audits

| Document | Relationship |
|----------|--------------|
| [PROJECT_DOCUMENT_AUDIT.md](./00-foundation/standards/PROJECT_DOCUMENT_AUDIT.md) | Pre-reorg baseline — many P0 items (folder moves) **done** |
| [DOCUMENTATION_HEALTH_REPORT.md](./00-foundation/standards/DOCUMENTATION_HEALTH_REPORT.md) | Metrics stale (557 docs) — regenerate after link fix |
| [BRAIN.md § Reading Hierarchy](./BRAIN.md#reading-hierarchy-token-efficient) | Mitigates index overlap **if agents follow it** |
| [DOCUMENT_NAVIGATION_STANDARD.md](./00-foundation/standards/DOCUMENT_NAVIGATION_STANDARD.md) | Nav block spec — dedupe pass needed |

---

## 10. Recommended Next Steps (Step 03+)

1. **Restore corrupted files** — `01-architecture/PROJECT_MAP.md` first
2. **Run link migration script** — use §7.3 mapping table
3. **Fix governance path references** — stub at expected paths or bulk-update links to `standards/` and `registries/`
4. **Dedupe navigation blocks** — fix `add-doc-navigation.py`, re-run with `--dedupe`
5. **Module architecture merge** — crm, sales, purchase, finance, inventory, marketing
6. **Declare UI ownership** — update DOCUMENT_NAVIGATION_STANDARD + BRAIN §4
7. **Regenerate health report** — reflect 1,026 files and new broken-link rate

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Initial post-reorg documentation audit (Step 02) |

---

**AgainERP Documentation Audit** — analyze first, reorganize second, no deletions.
