# AgainERP — Link Migration Plan

> **Status:** Recovery Plan (no changes applied)  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 03 — Documentation Stabilization Phase  
> **Authority:** [DOCUMENTATION_AUDIT.md](./DOCUMENTATION_AUDIT.md) · [BRAIN.md](./BRAIN.md)  
> **Scope:** 3,529 broken internal links / 8,328 checked (~42%)

---

## Purpose

Categorized plan to fix all broken markdown links after the numbered-folder reorganization (00–10).

## When To Read

Read before executing bulk link-fix scripts (Step 04). Do not run during feature development.

## Related Files

- [Recovery plan](./DOCUMENTATION_RECOVERY_PLAN.md)
- [SSOT map](./ARCHITECTURE_SSOT_MAP.md)
- [Audit report](./DOCUMENTATION_AUDIT.md)

## Read Next

[DOCUMENTATION_RECOVERY_PLAN.md § P0 Execution Order](./DOCUMENTATION_RECOVERY_PLAN.md#3-execution-order)

---

## 1. Executive Summary

| Category | Broken refs | Unique targets | Fix strategy |
|----------|-------------|----------------|--------------|
| Legacy modules paths | 923 | 297 | Prefix rewrite + relative depth fix |
| Legacy UI paths | 716 | 139 | Prefix rewrite + stub redirects |
| Legacy core paths | 431 | 93 | Prefix rewrite |
| Legacy database paths | 165 | 22 | Prefix rewrite + registry path fix |
| Legacy AI paths | 102 | 21 | Prefix rewrite + experience folder map |
| Legacy platform/other | 677 | 198 | Prefix rewrite + stub files |
| Placeholder links | 165 | 1 | Template cleanup (`path.md`) |
| Relative depth errors | ~350 | — | Recalculate from source file |

**Recommended approach:** Automated script with category rules → manual pass on top 20 source files → stub files for governance short-paths.

---

## 2. Legacy Modules Paths

**Pattern:** `modules/` → `03-business-modules/` · `modules/ai/` → `06-ai/platform/ai/`

### 2.1 Top Broken Targets

| Broken target | Count | Correct target |
|---------------|-------|----------------|
| `../03-business-modules/ecommerce/builder/ARCHITECTURE.md` | 156 | Fix relative depth from `08-builder/prototype/` → `../../03-business-modules/ecommerce/builder/ARCHITECTURE.md` |
| `../../modules/ai/AI_FIRST_ARCHITECTURE.md` | 122 | `../../06-ai/platform/ai/AI_FIRST_ARCHITECTURE.md` |
| `modules/ai/AI_OS_ARCHITECTURE.md` | 24 | `06-ai/platform/ai/AI_OS_ARCHITECTURE.md` |
| `../modules/ai/AI_OS_ARCHITECTURE.md` | 15 | `../06-ai/platform/ai/AI_OS_ARCHITECTURE.md` |
| `modules/marketing/MARKETING_MODULE_ARCHITECTURE.md` | 9 | `03-business-modules/marketing/MARKETING_MODULE_ARCHITECTURE.md` |
| `modules/finance/FINANCE_MODULE_ARCHITECTURE.md` | 9 | `03-business-modules/finance/FINANCE_MODULE_ARCHITECTURE.md` |
| `modules/sales/ENTITY_SALES.md` | 8 | `03-business-modules/sales/ENTITY_SALES.md` (create or stub) |
| `modules/ecommerce/catalog/ENTITY_CATALOG.md` | 8 | `03-business-modules/ecommerce/catalog/ENTITY_CATALOG.md` (create or stub) |

### 2.2 Global Rewrite Rules

| Old prefix | New prefix |
|------------|------------|
| `modules/{module}/` | `03-business-modules/{module}/` |
| `docs/modules/` | `docs/03-business-modules/` |
| `../modules/` | `../03-business-modules/` (adjust depth per source) |
| `../../modules/` | `../../03-business-modules/` |
| `modules/ai/` | `06-ai/platform/ai/` |

### 2.3 High-Impact Source Files

Files with the most module-path broken links — fix these first after global rewrite:

- `00-foundation/MASTER_INDEX.md`
- `00-foundation/registries/PAGE_REGISTRY.md`
- `06-ai/experience/04_AI_STOREFRONT_EXPERIENCE.md`
- `10-roadmap/MASTER_DEVELOPMENT_SEQUENCE.md`

---

## 3. Legacy UI Paths

**Pattern:** `ui-ux/` → `04-uiux/standards/` · `ui-prototype/` → `04-uiux/prototype/` · root `UI_PROTOTYPE_MODE.md` → `04-uiux/strategy/UI_PROTOTYPE_MODE.md`

### 3.1 Top Broken Targets

| Broken target | Count | Correct target |
|---------------|-------|----------------|
| `../../ui-ux/ENTERPRISE_UI_ARCHITECTURE.md` | 250 | `../../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md` |
| `../../UI_PROTOTYPE_MODE.md` | 141 | `../../04-uiux/strategy/UI_PROTOTYPE_MODE.md` |
| `ui-ux/ENTERPRISE_UI_ARCHITECTURE.md` | 14 | `04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md` |
| `../../../ui-ux/UI_UX_DESIGN_STANDARDS.md` | 12 | `../../../04-uiux/standards/UI_UX_DESIGN_STANDARDS.md` |
| `UI_PROTOTYPE_MODE.md` | 10 | `04-uiux/strategy/UI_PROTOTYPE_MODE.md` |
| `../../ui-ux/dashboard-widgets.md` | 8 | `../../04-uiux/standards/dashboard-widgets.md` |
| `ui-ux/UX_SMART_INTERACTION_STANDARDS.md` | 7 | `04-uiux/standards/UX_SMART_INTERACTION_STANDARDS.md` |

### 3.2 Global Rewrite Rules

| Old prefix | New prefix |
|------------|------------|
| `ui-ux/` | `04-uiux/standards/` (or `strategy/` for mode docs) |
| `ui-prototype/` | `04-uiux/prototype/` |
| `UI_PROTOTYPE_MODE.md` (any relative) | `04-uiux/strategy/UI_PROTOTYPE_MODE.md` |
| `ENTERPRISE_UI_ARCHITECTURE.md` via `ui-ux/` | `04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md` |

### 3.3 Stub Redirects (Optional — reduces relative-depth errors)

Create thin redirect stubs at old expected paths **only if** bulk rewrite cannot fix all relative variants:

| Stub path | Points to |
|-----------|-----------|
| `docs/ui-ux/ENTERPRISE_UI_ARCHITECTURE.md` | `../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md` |
| `docs/UI_PROTOTYPE_MODE.md` | `./04-uiux/strategy/UI_PROTOTYPE_MODE.md` |

> Prefer link rewrite over stubs where possible — stubs add maintenance surface.

---

## 4. Legacy Core Paths

**Pattern:** `core/` → `02-core-platform/`

### 4.1 Top Broken Targets

| Broken target | Count | Correct target |
|---------------|-------|----------------|
| `../core/ACTIVITY_CHATTER_ARCHITECTURE.md` | 49 | `../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md` |
| `../../core/engines/APPROVAL_ENGINE_ARCHITECTURE.md` | 38 | `../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md` |
| `../../core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md` | 31 | `../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md` |
| `core/PERMISSION_SYSTEM_ARCHITECTURE.md` | 15 | `02-core-platform/PERMISSION_SYSTEM_ARCHITECTURE.md` |
| `../../core/entities/contacts.md` | 13 | `../../02-core-platform/entities/contacts.md` |
| `../core/PRODUCT_MASTER_ARCHITECTURE.md` | 13 | `../02-core-platform/subsystems/PRODUCT_MASTER_ARCHITECTURE.md` |
| `core/engines/EVENT_ARCHITECTURE.md` | 12 | `02-core-platform/engines/EVENT_ARCHITECTURE.md` |
| `../../core/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md` | 12 | `../../02-core-platform/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md` |

### 4.2 Global Rewrite Rules

| Old prefix | New prefix |
|------------|------------|
| `core/engines/` | `02-core-platform/engines/` |
| `core/entities/` | `02-core-platform/entities/` |
| `core/subsystems/` | `02-core-platform/subsystems/` |
| `../core/` | `../02-core-platform/` (adjust depth) |
| `../../core/` | `../../02-core-platform/` |

---

## 5. Legacy Database Paths

**Pattern:** `database/` → `05-development/database/` · bare registry names → `00-foundation/registries/`

### 5.1 Top Broken Targets

| Broken target | Count | Correct target |
|---------------|-------|----------------|
| `../../database/MASTER_DATABASE_ARCHITECTURE.md` | 34 | `../../05-development/database/MASTER_DATABASE_ARCHITECTURE.md` |
| `database/MASTER_DATABASE_ARCHITECTURE.md` | 20 | `05-development/database/MASTER_DATABASE_ARCHITECTURE.md` |
| `DATABASE_REGISTRY.md` | 16 | `00-foundation/registries/DATABASE_REGISTRY.md` |
| `../../DATABASE_REGISTRY.md` | 12 | `../../00-foundation/registries/DATABASE_REGISTRY.md` |
| `../../database/multi-company.md` | 12 | `../../05-development/database/multi-company.md` |
| `database/ER_DIAGRAM.md` | 10 | `05-development/database/ER_DIAGRAM.md` |
| `database/standards.md` | 7 | `05-development/database/standards.md` |

### 5.2 Global Rewrite Rules

| Old prefix | New prefix |
|------------|------------|
| `database/` | `05-development/database/` |
| `../database/` | `../05-development/database/` |
| `DATABASE_REGISTRY.md` (bare) | `00-foundation/registries/DATABASE_REGISTRY.md` |
| `ENTITY_RELATIONSHIP_REGISTRY.md` (bare) | `00-foundation/registries/ENTITY_RELATIONSHIP_REGISTRY.md` |

---

## 6. Legacy AI Paths

**Pattern:** `ai_os/` → `06-ai/experience/` · `modules/ai/` · `../ai/` → `06-ai/platform/ai/`

### 6.1 Top Broken Targets

| Broken target | Count | Correct target |
|---------------|-------|----------------|
| `../ai/AI_OS_ARCHITECTURE.md` | 30 | `../06-ai/platform/ai/AI_OS_ARCHITECTURE.md` |
| `AI_KNOWLEDGE_INDEX.md` | 19 | `00-foundation/registries/AI_KNOWLEDGE_INDEX.md` |
| `ai_os/README.md` | 11 | `06-ai/experience/README.md` |
| `../../ai/AI_OS_ARCHITECTURE.md` | 8 | `../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md` |
| `../ai/AI_AUDIT_AND_APPROVAL.md` | 6 | `../06-ai/platform/ai/AI_AUDIT_AND_APPROVAL.md` |
| `ai_os/01_AI_COMMERCE_OS_VISION.md` | 3 | `06-ai/experience/01_AI_COMMERCE_OS_VISION.md` |

### 6.2 Global Rewrite Rules

| Old prefix | New prefix |
|------------|------------|
| `ai_os/` | `06-ai/experience/` |
| `modules/ai/` | `06-ai/platform/ai/` |
| `../ai/` | `../06-ai/platform/ai/` |
| `AI_KNOWLEDGE_INDEX.md` (bare) | `00-foundation/registries/AI_KNOWLEDGE_INDEX.md` |

---

## 7. Legacy Platform & Governance Paths

### 7.1 Platform Prefix Rewrites

| Old prefix | New prefix |
|------------|------------|
| `platform/` | `07-saas/` or `01-architecture/` (context-dependent) |
| `deployment/` | `05-development/deployment/` |
| `framework/` | `05-development/framework/` |
| `qa/` | `05-development/qa/` |
| `roadmap/` | `10-roadmap/` |
| `plugins/` | `09-integrations/plugins/` |
| `adr/` | `01-architecture/decisions/` |
| `scripts/` | `05-development/scripts/` |

### 7.2 Governance Short-Path Fixes

| Broken target | Count | Fix |
|---------------|-------|-----|
| `../../GOVERNANCE.md` | 31 | `../../00-foundation/GOVERNANCE.md` |
| `GOVERNANCE.md` (wrong relative) | 29 | Recalculate → `00-foundation/GOVERNANCE.md` |
| `../../DEVELOPMENT_STANDARDS.md` | 45+ | `../../00-foundation/standards/DEVELOPMENT_STANDARDS.md` |
| `DEVELOPMENT_STANDARDS.md` (bare) | 25 | `00-foundation/standards/DEVELOPMENT_STANDARDS.md` |
| `../../WORKFLOW_REGISTRY.md` | 23 | `../../00-foundation/registries/WORKFLOW_REGISTRY.md` |
| `../../BRAIN.md` | 42 | Recalculate relative path to `docs/BRAIN.md` |
| `../../PROJECT_MAP.md` | 31 | Recalculate — may mean nav hub OR visual map |
| `MODULE_DEPENDENCY_MAP.md` (bare) | 28 | `01-architecture/MODULE_DEPENDENCY_MAP.md` |
| `MODULE_REGISTRY.md` (bare) | 20 | `MODULE_REGISTRY.md` at docs root OR registries detail |

### 7.3 Stub Files to Create (Governance)

Create **redirect stub** markdown at paths where many files expect a parent-folder location:

| Stub file | Content |
|-----------|---------|
| `00-foundation/DEVELOPMENT_STANDARDS.md` | Redirect → `./standards/DEVELOPMENT_STANDARDS.md` |
| `00-foundation/WORKFLOW_REGISTRY.md` | Redirect → `./registries/WORKFLOW_REGISTRY.md` |
| `00-foundation/AI_KNOWLEDGE_INDEX.md` | Redirect → `./registries/AI_KNOWLEDGE_INDEX.md` |
| `00-foundation/UI_PROTOTYPE_MODE.md` | Redirect → `../04-uiux/strategy/UI_PROTOTYPE_MODE.md` |
| `01-architecture/GOVERNANCE.md` | Redirect → `../00-foundation/GOVERNANCE.md` |
| `01-architecture/DEVELOPMENT_STANDARDS.md` | Redirect → `../00-foundation/standards/DEVELOPMENT_STANDARDS.md` |

---

## 8. Placeholder Links

| Target | Count | Action |
|--------|-------|--------|
| `path.md` | 165 | Remove from templates or replace with real targets in `_MODULE_TEMPLATE.md`, `_PAGE_TEMPLATE.md`, generator output |

**Source files:** `00-foundation/templates/_MODULE_TEMPLATE.md`, `_PAGE_TEMPLATE.md`, registry generator templates.

---

## 9. Relative Depth Errors (Cross-Folder)

Special cases where prefix rewrite alone fails:

| Source area | Broken pattern | Fix |
|-------------|----------------|-----|
| `08-builder/prototype/*.md` | `../03-business-modules/ecommerce/builder/ARCHITECTURE.md` | `../../03-business-modules/ecommerce/builder/ARCHITECTURE.md` |
| `03-business-modules/*/` | `../../BRAIN.md` | `../../BRAIN.md` (verify — may need `../../../` from nested paths) |
| `01-architecture/*.md` | `GOVERNANCE.md` (same folder) | `../00-foundation/GOVERNANCE.md` |
| `02-core-platform/*.md` | `../GOVERNANCE.md` | `../00-foundation/GOVERNANCE.md` |

**Script requirement:** Resolve links relative to source file path, not global string replace.

---

## 10. Implementation Script Spec (Step 04)

Proposed script: `docs/05-development/scripts/migrate-doc-links.py`

```text
Phase 1 — Global prefix table (§2–§7 rewrite rules)
Phase 2 — Per-file relative resolution + verify target exists
Phase 3 — Report remaining broken links (CSV)
Phase 4 — Create governance stub files (§7.3)
Phase 5 — Manual review top 20 source files
```

### Acceptance Criteria

| Metric | Current | Target |
|--------|---------|--------|
| Broken link rate | ~42% | <5% |
| Legacy `modules/` refs | ~923 | 0 |
| Legacy `ui-ux/` refs | ~716 | 0 |
| Legacy `core/` refs | ~431 | 0 |
| Placeholder `path.md` | 165 | 0 |

### Dry-Run Mode

Script must support `--dry-run` printing diff stats without writing files.

---

## 11. Files to Fix First (Top 15 by broken outbound count)

| Priority | File | Broken links |
|----------|------|--------------|
| 1 | `00-foundation/MASTER_INDEX.md` | 251 |
| 2 | `10-roadmap/MASTER_DEVELOPMENT_SEQUENCE.md` | 134 |
| 3 | `00-foundation/traceability/TRACEABILITY_MATRIX.md` | 69 |
| 4 | `00-foundation/registries/AI_KNOWLEDGE_INDEX.md` | 62 |
| 5 | `00-foundation/registries/PAGE_REGISTRY.md` | 45 |
| 6 | `00-foundation/README.md` | 44 |
| 7 | `00-foundation/registries/DATABASE_REGISTRY.md` | 42 |
| 8 | `03-business-modules/hr-payroll/HR_MODULE_MASTER_INDEX.md` | 40 |
| 9 | `00-foundation/PRE_CODE_GATE.md` | 40 |
| 10 | `01-architecture/MASTER_MODULE_ARCHITECTURE.md` | 37 |
| 11 | `00-foundation/UNIVERSAL_MODULE_FRAMEWORK.md` | 36 |
| 12 | `04-uiux/design-system/HR_DESIGN_SYSTEM_SPECIFICATION.md` | 36 |
| 13 | `00-foundation/PROJECT_BRAIN.md` | 33 |
| 14 | `00-foundation/registries/SERVICE_REGISTRY.md` | 32 |
| 15 | `00-foundation/registries/DOCUMENT_REGISTRY.md` | 32 |

> **Token rule:** After migration, add `MASTER_INDEX.md` to forbidden bulk-read list or replace with links to AI Brain stack.

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Initial link migration plan (Step 03) |

---

**Link Migration Plan** — rewrite paths, don't delete docs.
