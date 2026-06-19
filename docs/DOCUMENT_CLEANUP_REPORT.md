# AgainERP — Documentation Cleanup Audit (CLEANUP-01)

> **Status:** Audit only — **no files modified**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** CLEANUP-01 — Documentation Cleanup Audit  
> **Authority read:** [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) · [PROJECT_MAP.md](./PROJECT_MAP.md) · [ARCHITECTURE_SSOT_MAP.md](./ARCHITECTURE_SSOT_MAP.md)

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total files under `docs/`** | **1,125** (1,108 `.md` + 17 other) |
| **Recommended KEEP** | ~1,020 files (~91%) |
| **Recommended ARCHIVE** | ~75–95 files (~7–8%) |
| **Recommended DELETE** | ~8–15 files (~1%) |
| **Estimated reduction (Archive + Delete)** | **~83–110 files (~7–10%)** |
| **Aggressive optional (prototype Review/Changes)** | +256 files (~23%) — **not recommended in Phase 1** |

**Context:** A prior recovery pass already removed legacy top-level trees (`ui-prototype/`, `modules/`, `core/`, `platform/`, `ui-ux/`) from disk. This audit covers the **current normalized tree** only.

**Governance constraint (from ARCHITECTURE_SSOT_MAP):** Legacy files should become **redirect stubs**, not hard-deleted, until link migration completes ([LINK_MIGRATION_PLAN.md](./LINK_MIGRATION_PLAN.md)).

---

## Audit Method

1. Read SSOT authority files (MODULE_REGISTRY, PROJECT_MAP, ARCHITECTURE_SSOT_MAP).
2. Inventory `docs/` by folder, file type, and size.
3. Flag superseded banners, redirect stubs, duplicate naming patterns, and one-time execution reports.
4. Classify per CLEANUP-01 rules: **Keep** (SSOT/lock/registry/active) · **Archive** (legacy/replaced/historical) · **Delete** (duplicate/empty/temp only).

---

## 1. KEEP LIST

Files and trees that must remain active SSOT, locks, registries, or in-use module documentation.

### 1.1 Root governance & navigation (Level 1–2 SSOT)

| File | Role |
|------|------|
| [BRAIN.md](./BRAIN.md) | Cursor entry — Level 1 SSOT |
| [PROJECT_MAP.md](./PROJECT_MAP.md) | Doc location hub — Level 2 SSOT |
| [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | Module index — Level 2 SSOT |
| [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) | Core decisions SSOT |
| [ARCHITECTURE_SSOT_MAP.md](./ARCHITECTURE_SSOT_MAP.md) | Domain SSOT map |
| [GOVERNANCE_FRAMEWORK.md](./GOVERNANCE_FRAMEWORK.md) | 7-domain governance |
| [FINAL_ERP_STRUCTURE_MAP.md](./FINAL_ERP_STRUCTURE_MAP.md) | Repo structure SSOT |
| [STANDARD_MODULE_TEMPLATE.md](./STANDARD_MODULE_TEMPLATE.md) | Module package shape |
| [README.md](./README.md) | Docs entry |

### 1.2 Lock files (approved — do not archive)

| File | Role |
|------|------|
| [FINAL_UI_ARCHITECTURE_LOCK.md](./FINAL_UI_ARCHITECTURE_LOCK.md) | **Active** UI governance lock |
| [DASHBOARD_ARCHITECTURE_LOCK.md](./DASHBOARD_ARCHITECTURE_LOCK.md) | Dashboard governance lock |

### 1.3 Active planning & registry indexes (keep until normalization complete)

| File | Role |
|------|------|
| [MODULE_SSOT_MATRIX.md](./MODULE_SSOT_MATRIX.md) | Per-module SSOT status |
| [MODULE_NORMALIZATION_PLAN.md](./MODULE_NORMALIZATION_PLAN.md) | Active merge/rename plan |
| [MODULE_PACKAGE_ROADMAP.md](./MODULE_PACKAGE_ROADMAP.md) | Package rollout |
| [MODULE_GENERATOR_GUIDE.md](./MODULE_GENERATOR_GUIDE.md) | Scaffolding |
| [NEW_MODULE_CHECKLIST.md](./NEW_MODULE_CHECKLIST.md) | Onboarding |
| [MASTER_DOCUMENT_MAP.md](./MASTER_DOCUMENT_MAP.md) | Full tree index (bulk-read forbidden but needed for migration) |
| [MASTER_ARCHITECTURE_INDEX.md](./MASTER_ARCHITECTURE_INDEX.md) | Architecture index |
| [LINK_MIGRATION_PLAN.md](./LINK_MIGRATION_PLAN.md) | **Active** until link debt = 0 |
| [DOCUMENTATION_RECOVERY_PLAN.md](./DOCUMENTATION_RECOVERY_PLAN.md) | Recovery playbook |

### 1.4 Numbered domain trees (canonical layout)

| Path | Files (approx) | Keep rationale |
|------|----------------|----------------|
| `00-foundation/` | 54 | Governance, PRD, PRE_CODE_GATE, templates, standards |
| `00-foundation/registries/` | 11 | MODULE_REGISTRY (schema), API/DATABASE/ENTITY registries |
| `00-foundation/registries/_registries/` | 5 | Generated full registries (machine index) |
| `01-architecture/` | 21 | PROJECT_MAP (visual), MODULE_DEPENDENCY_MAP, ADRs, SAAS/HYBRID |
| `02-core-platform/` | 38 | Core ARCHITECTURE, engines, entities, subsystems |
| `03-business-modules/` | 338 | All module README, manifests, blueprints, Menus |
| `04-uiux/standards/` | 73 active | Design system, UI blueprints, drawer/CRUD standards |
| `04-uiux/prototype/` | 441 | Build guides (182 base + 128 Review + 128 Changes) |
| `04-uiux/strategy/` | — | UI_PROTOTYPE_MODE, strategy docs |
| `05-development/` | 49 | Database, API, deployment, scripts |
| `06-ai/` | 14 | AI OS platform SSOT |
| `07-saas/` | 8 | Tenant architecture |
| `08-builder/` | 39 | Builder tool specs |
| `09-integrations/` | 4 | Integration docs |
| `10-roadmap/` | 5 | Roadmap plans |
| `architecture/` | 1 | MODULE_ISOLATION_REPORT (supporting) |

### 1.5 Module documentation — keep (active / in-progress SSOT)

**Ecommerce (package complete):** `03-business-modules/ecommerce/` — README, Architecture, ModuleManifest, Database, API, Menus (168 screens), sub-areas (builder, seo, catalog, …).

**Module UI blueprints (Step 15–24 SSOT):**

- `crm/CRM_UI_BLUEPRINT.md`
- `sales/SALES_UI_BLUEPRINT.md`
- `purchase/PURCHASE_UI_BLUEPRINT.md`
- `finance/FINANCE_UI_BLUEPRINT.md`
- `inventory/INVENTORY_UI_BLUEPRINT.md`
- `hr-payroll/HR_PAYROLL_UI_BLUEPRINT.md`
- `ecommerce/ECOMMERCE_UI_BLUEPRINT.md`, `ecommerce/builder/BUILDER_UI_BLUEPRINT.md`

**Platform UI blueprints:**

- `04-uiux/standards/WORKSPACE_UI_BLUEPRINT.md`
- `04-uiux/standards/NAVIGATION_UI_BLUEPRINT.md`
- `04-uiux/standards/DASHBOARD_UI_BLUEPRINT.md`
- `04-uiux/standards/COMPONENT_UI_BLUEPRINT.md`
- `04-uiux/standards/EXECUTIVE_DASHBOARD_UI_BLUEPRINT.md`
- `04-uiux/standards/UI_PROTOTYPE_ROADMAP.md`

**Legacy architecture files still canonical until merge (KEEP until Architecture.md absorbs content):**

| Module | Current SSOT file |
|--------|-------------------|
| crm | `CRM_MODULE_ARCHITECTURE.md` |
| sales | `SALES_MODULE_ARCHITECTURE.md` |
| purchase | `PURCHASE_MODULE_ARCHITECTURE.md` |
| finance | `FINANCE_MODULE_ARCHITECTURE.md` |
| inventory | `INVENTORY_MODULE_ARCHITECTURE.md` |
| marketing | `MARKETING_MODULE_ARCHITECTURE.md` |
| hr-payroll | `HR_PAYROLL_MASTER_ARCHITECTURE.md` (+ 15 supporting HR_* files) |

**Core engine canonical docs (KEEP — full SSOT):**

- `02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md`
- `02-core-platform/engines/EVENT_ARCHITECTURE.md`
- `02-core-platform/engines/GLOBAL_SEARCH_ARCHITECTURE.md`
- `02-core-platform/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md`
- `02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md`

**Active ADRs (non-superseded):** ADR-004 through ADR-012, ADR-TEMPLATE, ADR_INDEX.

**Intentional duplicate indexes (KEEP both — different roles per SSOT map):**

| Pair | Roles |
|------|-------|
| `docs/MODULE_REGISTRY.md` ↔ `00-foundation/registries/MODULE_REGISTRY.md` | AI index ↔ schema/registry detail |
| `docs/PROJECT_MAP.md` ↔ `01-architecture/PROJECT_MAP.md` | Doc navigation hub ↔ visual platform map |

---

## 2. ARCHIVE LIST

Move to `docs/_archive/` (or `docs/10-roadmap/archive/`) — historical, superseded, or one-time reports. **Do not delete** until redirects exist.

### 2.1 Superseded governance locks (replaced SSOT exists)

| File | Replace with |
|------|--------------|
| [UI_ARCHITECTURE_LOCK.md](./UI_ARCHITECTURE_LOCK.md) | [FINAL_UI_ARCHITECTURE_LOCK.md](./FINAL_UI_ARCHITECTURE_LOCK.md) |

> **Note:** Keep a **redirect stub** at original path if external links exist.

### 2.2 Superseded UI standards (7 files — banner present)

| File | Successor |
|------|-----------|
| `04-uiux/standards/design-system.md` | DESIGN_SYSTEM_FOUNDATION.md |
| `04-uiux/standards/components.md` | COMPONENT_LIBRARY_STANDARD.md |
| `04-uiux/standards/forms.md` | FORM_STANDARD.md |
| `04-uiux/standards/tables.md` | TABLE_AND_DATA_GRID_STANDARD.md |
| `04-uiux/standards/dashboard-widgets.md` | DASHBOARD_UI_BLUEPRINT.md |
| `04-uiux/standards/command-palette.md` | UNIVERSAL_COMMAND_SYSTEM_STANDARD.md |

### 2.3 Superseded core engine stubs (4 files — pointer only, &lt;1 KB each)

| Stub | Canonical |
|------|-----------|
| `02-core-platform/engines/approval-engine.md` | APPROVAL_ENGINE_ARCHITECTURE.md |
| `02-core-platform/engines/event-system.md` | EVENT_ARCHITECTURE.md |
| `02-core-platform/engines/search-engine.md` | GLOBAL_SEARCH_ARCHITECTURE.md |
| `02-core-platform/engines/workflow-engine.md` | WORKFLOW_ENGINE_ARCHITECTURE.md |

### 2.4 Superseded module Architecture stubs (after content merge)

| File | Status | Action |
|------|--------|--------|
| `03-business-modules/crm/Architecture.md` | Superseded banner + 228 lines duplicate | Archive after merge into canonical |
| `03-business-modules/sales/Architecture.md` | Superseded | Archive after merge |
| `03-business-modules/accounting/Architecture.md` | Superseded → finance | Archive after redirect stub |
| `03-business-modules/ecommerce/marketing/ARCHITECTURE.md` | Superseded (ecommerce scope) | Archive |

**Post-merge archive (7 legacy names — per MODULE_NORMALIZATION_PLAN):**

- `crm/CRM_MODULE_ARCHITECTURE.md` → merged `Architecture.md`
- `sales/SALES_MODULE_ARCHITECTURE.md` → merged `Architecture.md`
- `purchase/PURCHASE_MODULE_ARCHITECTURE.md` → merged `Architecture.md`
- `finance/FINANCE_MODULE_ARCHITECTURE.md` → renamed `Architecture.md`
- `inventory/INVENTORY_MODULE_ARCHITECTURE.md` → renamed `Architecture.md`
- `marketing/MARKETING_MODULE_ARCHITECTURE.md` → renamed `Architecture.md`
- `hr-payroll/HR_PAYROLL_MASTER_ARCHITECTURE.md` → consolidated `Architecture.md`

### 2.5 Superseded ADRs (historical decisions)

| File | Superseded by |
|------|---------------|
| `01-architecture/decisions/ADR-002-laravel.md` | ADR-012-fastapi-python.md |
| `01-architecture/decisions/ADR-003-vue.md` | ADR-011-nextjs-typescript.md |

### 2.6 One-time execution & validation reports (historical)

| File | Purpose completed |
|------|-------------------|
| [RECOVERY_EXECUTION_REPORT.md](./RECOVERY_EXECUTION_REPORT.md) | Recovery Phase E |
| [NORMALIZATION_EXECUTION_REPORT_ECOMMERCE.md](./NORMALIZATION_EXECUTION_REPORT_ECOMMERCE.md) | Ecommerce normalization |
| [UI_ARCHITECTURE_VALIDATION_REPORT.md](./UI_ARCHITECTURE_VALIDATION_REPORT.md) | Step 10 validation |
| [FINAL_UI_VALIDATION_REPORT.md](./FINAL_UI_VALIDATION_REPORT.md) | Final UI validation |
| [DASHBOARD_VALIDATION_REPORT.md](./DASHBOARD_VALIDATION_REPORT.md) | Dashboard validation |
| [DESIGN_SYSTEM_ENHANCEMENT_REPORT.md](./DESIGN_SYSTEM_ENHANCEMENT_REPORT.md) | Design system pass |
| [DOCUMENTATION_AUDIT.md](./DOCUMENTATION_AUDIT.md) | Prior audit snapshot |
| `03-business-modules/hr-payroll/uiux/HR_IMPLEMENTATION_AUDIT.md` | HR audit |
| `03-business-modules/hr-payroll/uiux/HR_DESKTOP_WIREFRAME_EXECUTION_PLAN.md` | Wireframe execution |

### 2.7 Redirect stubs (archive body, keep path)

These are valid **redirect stubs** today — archive full content only if replaced by 5-line stub:

| File | Redirect target |
|------|-----------------|
| `00-foundation/DEVELOPMENT_STANDARDS.md` | `standards/DEVELOPMENT_STANDARDS.md` |
| `00-foundation/AI_KNOWLEDGE_INDEX.md` | `registries/AI_KNOWLEDGE_INDEX.md` |
| `00-foundation/WORKFLOW_REGISTRY.md` | `registries/WORKFLOW_REGISTRY.md` |
| `00-foundation/UI_PROTOTYPE_MODE.md` | `04-uiux/strategy/UI_PROTOTYPE_MODE.md` |

### 2.8 Optional Phase 2 archive — prototype workflow artifacts

**Not recommended in CLEANUP-01** — active build reference:

| Pattern | Count | Rationale to defer |
|---------|-------|-------------------|
| `04-uiux/prototype/**/*Review.md` | 128 | QA traceability per screen |
| `04-uiux/prototype/**/*Changes.md` | 128 | Change log per screen |
| `04-uiux/prototype/catalog/products/AttributeProfiles.md` | 1 | Superseded → SpecificationsProfiles |

**Phase 2 candidate:** After each screen ships to production, archive its Review + Changes pair → **~256 files (~23%)**.

---

## 3. DELETE LIST

**Hard delete only** when no inbound links and content is empty/duplicate/temporary.

| File / pattern | Reason | Risk |
|----------------|--------|------|
| `04-uiux/prototype/ReviewQuestions.md` | Empty scratch table (no open questions) | Low |
| `04-uiux/prototype/ImprovementIdeas.md` | Meta scratch (verify empty/minimal) | Low |
| `04-uiux/prototype/catalog/products/AttributeProfiles.md` | Superseded one-liner redirect — merge into stub or delete after link fix | Low |
| `04-uiux/prototype/catalog/categories/CategoriesReview.md` | &lt;500 bytes — empty tri-file shell | Low |
| `04-uiux/prototype/catalog/categories/CategoriesChanges.md` | &lt;500 bytes — empty tri-file shell | Low |
| `04-uiux/prototype/catalog/products/EditProductChanges.md` | &lt;500 bytes — empty shell | Low |
| Ghost paths in git index only (`docs/ui-prototype/`, `docs/modules/`) | Already absent from disk — **remove from git** if still tracked | None |
| Duplicate `DOCUMENTATION_HEALTH_REPORT.md` at docs root | **Not on disk** — remove from index if git still tracks | None |

**Do NOT delete:**

- Any `*_MODULE_ARCHITECTURE.md` until merge complete
- Any Menus screen spec (168 files)
- Any redirect stub without replacement link
- MASTER_* indexes, registries, or lock files
- `00-foundation/CHANGELOG.md` (audit trail)

---

## 4. Estimated File Reduction

| Phase | Action | Files | % of 1,125 |
|-------|--------|-------|------------|
| **Phase 1 (recommended)** | Archive superseded standards, engine stubs, validation reports, UI_ARCHITECTURE_LOCK | **~22** | **~2%** |
| **Phase 1b** | Archive module merge sources after Architecture.md merge (7 files) | **+7** | **+0.6%** |
| **Phase 1c** | Archive HR execution/audit docs | **+2** | **+0.2%** |
| **Phase 1d** | Delete empty scratch / shell tri-files | **~8** | **~0.7%** |
| **Phase 1 total** | | **~39** | **~3.5%** |
| **Phase 2 (optional)** | Archive prototype Review + Changes after screen shipped | **+256** | **+23%** |
| **Phase 2 total** | | **~295** | **~26%** |

**Net active doc set after Phase 1:** ~1,086 files  
**Net after Phase 2:** ~830 files (requires per-screen sign-off)

---

## 5. Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| Breaking Cursor/AI links to superseded paths | **High** | Replace with redirect stubs before archive/delete |
| Losing canonical module architecture during merge | **High** | Follow MODULE_NORMALIZATION_PLAN — merge first, stub second |
| Deleting prototype Review/Changes too early | **Medium** | Phase 2 only; tag by implementation status in UI_PROTOTYPE_ROADMAP |
| Confusing PROJECT_MAP vs 01-architecture/PROJECT_MAP | **Low** | Both are intentional SSOT pair — document in BRAIN |
| Removing registries/_registries generated files | **Medium** | Regenerate via `generate-governance-registries.py` — keep script |
| Archive UI_ARCHITECTURE_LOCK while links remain | **High** | Grep repo for links; stub must point to FINAL_UI_ARCHITECTURE_LOCK |
| HR 32-file fragmentation | **Medium** | Consolidate to Architecture.md per plan — archive HR_* after merge |

### Recommended execution order

1. **Link audit** — run against LINK_MIGRATION_PLAN targets  
2. **Module merge** — crm, sales, purchase, finance, inventory, marketing, hr-payroll  
3. **Archive validation reports** to `_archive/reports/2026-06/`  
4. **Replace superseded stubs** with 5-line redirect files  
5. **Delete** only empty scratch files (Section 3)  
6. **Phase 2** prototype tri-file archive — per MODULE in UI_PROTOTYPE_ROADMAP  

---

## 6. Already Completed (pre-audit)

The following legacy trees were **removed from disk** during documentation recovery (not present in current audit):

- `docs/ui-prototype/` (~400+ files) → migrated to `04-uiux/prototype/`
- `docs/modules/` → migrated to `03-business-modules/`
- `docs/core/` → migrated to `02-core-platform/`
- `docs/platform/` → migrated to `07-saas/` / `01-architecture/`
- `docs/ui-ux/` → migrated to `04-uiux/standards/`

If git still indexes these paths, run `git status` and prune deleted paths — **no content recovery needed**.

---

## 7. Summary Tables

### KEEP (categories)

| Category | Approx files |
|----------|--------------|
| Governance + locks + SSOT maps | 29 root + foundation |
| Registries & indexes | 16 |
| Business modules (all) | 338 |
| Ecommerce Menus | 168 |
| UI standards (active) | 73 |
| Prototype build guides | 441 |
| Core, AI, SaaS, builder, dev | 128 |
| **Total KEEP** | **~1,020** |

### ARCHIVE (Phase 1)

| Category | Files |
|----------|-------|
| Superseded UI lock + standards | 8 |
| Superseded engine stubs | 4 |
| Superseded ADRs | 2 |
| Validation / execution reports | 9 |
| Module stubs post-merge (future) | 11 |
| **Subtotal Phase 1** | **~34** |

### DELETE (safe)

| Category | Files |
|----------|-------|
| Empty prototype scratch / shells | ~8 |
| Git ghost paths | 0–N (index cleanup) |
| **Subtotal** | **~8** |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | CLEANUP-01 audit — audit only, no modifications |

---

**Document Cleanup Audit** — classify before delete; stubs before archive; merge before stub.
