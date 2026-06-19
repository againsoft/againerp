# AgainERP — Documentation Recovery Plan

> **Status:** Recovery Plan (no changes applied)  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 03 — Documentation Stabilization Phase  
> **Authority:** [DOCUMENTATION_AUDIT.md](./DOCUMENTATION_AUDIT.md) · [LINK_MIGRATION_PLAN.md](./LINK_MIGRATION_PLAN.md)

---

## Purpose

Action plan to recover corrupted docs, merge duplicates, create redirect stubs, and stabilize the documentation ecosystem before new development.

## When To Read

Read before executing any P0 recovery work (Step 04). This plan defines **what** to fix — not the fixes themselves.

## Related Files

- [Link migration](./LINK_MIGRATION_PLAN.md)
- [SSOT map](./ARCHITECTURE_SSOT_MAP.md)
- [Cursor entry](./BRAIN.md)

## Read Next

[§1 P0 — Restore Corrupted Documents](#1-p0--restore-corrupted-documents)

---

## 1. P0 — Restore Corrupted Documents

### 1.1 Critical: `01-architecture/PROJECT_MAP.md`

| Attribute | Value |
|-----------|-------|
| **Current state** | 39 lines — header + nav block + Step 25 table only |
| **Expected state** | ~805 lines — visual platform map §1–§11 |
| **Impact** | Level 5 architecture reads fail; 20+ inbound links broken |
| **Git status** | Untracked — never committed in current form |

#### Backup Sources (verified)

| Source | Commit / location | Lines | Content |
|--------|-------------------|-------|---------|
| **Primary backup** | `git show d378e95:docs/PROJECT_MAP.md` | **805** | Full visual platform map (§1–§11) |
| Secondary reference | [MASTER_MODULE_ARCHITECTURE.md](./01-architecture/MASTER_MODULE_ARCHITECTURE.md) | 729 | Overlapping module/layer content — use for cross-check only |
| Secondary reference | [FINAL_ERP_STRUCTURE_MAP.md](./FINAL_ERP_STRUCTURE_MAP.md) | 679 | Structure + layer summary — use for cross-check only |

#### Sections to Restore (from backup)

```text
§1  Platform Overview
§2  Architecture Layers
§3  Module Map
§4  Service Map
§5  Entity Map
§6  Event Map
§7  Permission Map
§8  API Map
§9  Search Map
§10 AI Agent Map
§11 Future Industry Expansion Map
    End-to-End Flows
    Documentation Navigation
    Golden Rules (Platform)
```

#### Recovery Procedure (Step 04 — do not run yet)

```bash
# 1. Export backup to temp file
git show d378e95:docs/PROJECT_MAP.md > /tmp/PROJECT_MAP_visual_backup.md

# 2. Verify line count (~805)
wc -l /tmp/PROJECT_MAP_visual_backup.md

# 3. Merge into 01-architecture/PROJECT_MAP.md:
#    - KEEP: current nav block (Purpose/When To Read/Related/Read Next) from truncated file
#    - KEEP: current metadata header (Status, Version, Document Type)
#    - RESTORE: body from backup (§1 onward)
#    - UPDATE: internal links in restored body per LINK_MIGRATION_PLAN.md
#    - FIX: Governance link ./GOVERNANCE.md → ../00-foundation/GOVERNANCE.md
#    - FIX: Read-with links (MASTER_INDEX, AI_KNOWLEDGE_INDEX paths)

# 4. DO NOT touch docs/PROJECT_MAP.md (doc navigation hub — valid separate file)
```

#### Do Not Overwrite

| File | Reason |
|------|--------|
| [docs/PROJECT_MAP.md](./PROJECT_MAP.md) | Repurposed as **doc navigation hub** (~280 lines) — valid, active Level 2 |
| [docs/BRAIN.md](./BRAIN.md) | Cursor entry — intact |
| [docs/MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | Module index — intact |

#### Post-Restore Link Updates (within restored file)

| Old link in backup | New target |
|--------------------|------------|
| `./GOVERNANCE.md` | `../00-foundation/GOVERNANCE.md` |
| `./MASTER_INDEX.md` | `../00-foundation/MASTER_INDEX.md` |
| `./AI_KNOWLEDGE_INDEX.md` | `../00-foundation/registries/AI_KNOWLEDGE_INDEX.md` |
| `./MODULE_DEPENDENCY_MAP.md` | `./MODULE_DEPENDENCY_MAP.md` (same folder — OK) |

---

### 1.2 Other Corrupted / Truncated Files

| File | Lines | Issue | Recovery action |
|------|-------|-------|-------------------|
| `03-business-modules/ecommerce/catalog/ATTRIBUTE_PROFILE_ARCHITECTURE.md` | 27 | Incomplete stub | Expand from ecommerce catalog ARCHITECTURE + Menus, or merge into `catalog/ARCHITECTURE.md` |
| `03-business-modules/accounting/Architecture.md` | 29 | Intentional superseded stub | **Keep** — add clearer redirect to finance (already points there) |

No other confirmed content-loss corruption found. **230 files** have duplicate nav blocks (noise, not content loss) — see §4.

---

## 2. Files to Recover

| Priority | File | Source | Action |
|----------|------|--------|--------|
| **P0** | `01-architecture/PROJECT_MAP.md` | `git d378e95:docs/PROJECT_MAP.md` | Restore §1–§11 body |
| P2 | `03-business-modules/ecommerce/catalog/ATTRIBUTE_PROFILE_ARCHITECTURE.md` | catalog ARCHITECTURE + Menus | Complete or merge |
| P3 | Missing `ENTITY_*.md` files referenced by registries | Create stubs from module Architecture docs | Stub with link to owner module |

### Missing Entity Stubs (referenced but absent)

Create minimal stubs during link migration — content from module `Architecture.md` §4:

- `03-business-modules/sales/ENTITY_SALES.md`
- `03-business-modules/ecommerce/catalog/ENTITY_CATALOG.md`
- (Scan remaining broken `ENTITY_*` targets during Step 04 script run)

---

## 3. Files to Merge

Merge **legacy architecture → canonical `Architecture.md`**. Preserve all content — move under standard 10-section headings per [STANDARD_MODULE_TEMPLATE.md](./STANDARD_MODULE_TEMPLATE.md). Leave redirect stub at legacy filename.

| Module | Merge from (legacy) | Merge into (canonical) | Legacy lines (approx) |
|--------|---------------------|------------------------|----------------------|
| `crm` | `CRM_MODULE_ARCHITECTURE.md` | `Architecture.md` | Large — primary content source |
| `sales` | `SALES_MODULE_ARCHITECTURE.md` | `Architecture.md` | Large |
| `purchase` | `PURCHASE_MODULE_ARCHITECTURE.md` | `Architecture.md` | Large |
| `finance` | `FINANCE_MODULE_ARCHITECTURE.md` | `Architecture.md` (create) | Rename + standardize |
| `inventory` | `INVENTORY_MODULE_ARCHITECTURE.md` + `INVENTORY_WORKFLOW.md` | `Architecture.md` + `Workflow.md` | Split workflow to Workflow.md |
| `marketing` | `MARKETING_MODULE_ARCHITECTURE.md` | `Architecture.md` (create) | Rename + standardize |
| `hr-payroll` | 15+ `HR_*_ARCHITECTURE.md` files | `Architecture.md` (create) + section anchors | Major consolidation |

### HR-Payroll Consolidation Map

| Legacy file | Target section in unified `Architecture.md` |
|-------------|---------------------------------------------|
| `HR_PAYROLL_MASTER_ARCHITECTURE.md` | §1 Overview · §2 Purpose |
| `HR_DATABASE_ARCHITECTURE.md` | §4 Data Ownership → link `Database.md` |
| `HR_API_ARCHITECTURE.md` | §5 API → link `API.md` |
| `HR_PERMISSION_MATRIX.md` | §7 Permissions |
| `HR_UI_UX_BLUEPRINT.md` | §8 UIUX |
| `HR_AI_ASSISTANT_ARCHITECTURE.md` | §9 AI Integration |
| `HR_DASHBOARD_ARCHITECTURE.md` | §3 Features (dashboard) |
| `HR_AUTOMATION_ENGINE_ARCHITECTURE.md` | §6 Events |
| Others (`HR_NOTIFICATION_*`, `HR_REPORTING_*`, …) | Deep-dive links from Architecture.md — keep files, demote to Level 5 |

### Ecommerce Sub-Area Architecture Files

**Do not merge** 13 nested `ecommerce/{area}/ARCHITECTURE.md` into root — they are **doc views**. Action: ensure each has `README.md` entry (8 missing).

---

## 4. Files to Convert into Stubs

Stub = short file with status **Superseded** or **Redirect**, single link to SSOT. Keep filename so existing links resolve.

| File | Stub type | Points to |
|------|-----------|-----------|
| `03-business-modules/accounting/Architecture.md` | Superseded (exists) | `../finance/FINANCE_MODULE_ARCHITECTURE.md` → eventually `../finance/Architecture.md` |
| `03-business-modules/crm/CRM_MODULE_ARCHITECTURE.md` | Redirect (after merge) | `./Architecture.md` |
| `03-business-modules/sales/SALES_MODULE_ARCHITECTURE.md` | Redirect (after merge) | `./Architecture.md` |
| `03-business-modules/purchase/PURCHASE_MODULE_ARCHITECTURE.md` | Redirect (after merge) | `./Architecture.md` |
| `03-business-modules/crm/Architecture.md` | Review — may already be stub | Check if superseded by CRM_MODULE_ARCHITECTURE |
| `03-business-modules/sales/Architecture.md` | Review — may already be stub | Check if superseded by SALES_MODULE_ARCHITECTURE |

### Nav Block Cleanup (230 files — not stubs, dedupe)

Duplicate `## Purpose` blocks from navigation script — **strip duplicates**, keep one nav block at top. Fix `add-doc-navigation.py` `strip_all_nav_blocks()` regex, then re-run with `--force`.

**Do not delete business content** — nav dedupe only.

---

## 5. Files Requiring Redirects

### 5.1 Governance Path Stubs

Create at expected parent paths (see [LINK_MIGRATION_PLAN.md §7.3](./LINK_MIGRATION_PLAN.md#73-stub-files-to-create-governance)):

| Stub path | Redirect target |
|-----------|-----------------|
| `00-foundation/DEVELOPMENT_STANDARDS.md` | `./standards/DEVELOPMENT_STANDARDS.md` |
| `00-foundation/WORKFLOW_REGISTRY.md` | `./registries/WORKFLOW_REGISTRY.md` |
| `00-foundation/AI_KNOWLEDGE_INDEX.md` | `./registries/AI_KNOWLEDGE_INDEX.md` |
| `00-foundation/UI_PROTOTYPE_MODE.md` | `../04-uiux/strategy/UI_PROTOTYPE_MODE.md` |

### 5.2 Orphan Folder Relocation

| Current | Action |
|---------|--------|
| `docs/architecture/MODULE_ISOLATION_REPORT.md` | Move to `01-architecture/MODULE_ISOLATION_REPORT.md` OR create redirect stub at old path |

### 5.3 Index Document Redirects (Optional P3)

Reduce index proliferation — add banner at top of deep indexes pointing to AI Brain stack:

| File | Banner points to |
|------|------------------|
| `00-foundation/MASTER_INDEX.md` | `../BRAIN.md` — "Use Reading Hierarchy first" |
| `00-foundation/PROJECT_BRAIN.md` | `../BRAIN.md` — "Slim entry preferred" |

---

## 6. Module Package Recovery (P2 — After P0/P1)

Roll out missing standard files per module. Priority order:

| Phase | Modules | Missing files to create |
|-------|---------|------------------------|
| **Active** | `ecommerce` | `AI.md`, `Reports.md`, `CHANGELOG.md` |
| **Active** | `crm`, `sales`, `purchase` | Full package after architecture merge |
| **Draft ERP** | `inventory`, `finance`, `manufacturing`, `hr` | `Architecture.md` + package from legacy files |
| **UI-only** | `sales-marketing` | `Architecture.md` from ui-design docs |

**0 / 28** modules have complete 10-file package today.

---

## 7. Execution Order

```text
Step 04-A  Restore 01-architecture/PROJECT_MAP.md from git backup
Step 04-B  Create governance redirect stubs (§5.1)
Step 04-C  Fix add-doc-navigation.py → dedupe 230 duplicate nav blocks
Step 04-D  Run link migration script (LINK_MIGRATION_PLAN.md)
Step 04-E  Merge module architecture duplicates (§3) — one module at a time
Step 04-F  HR-payroll consolidation (§3)
Step 04-G  Module package rollout (§6)
Step 04-H  Regenerate DOCUMENTATION_HEALTH_REPORT metrics
```

### Gate Criteria (Stabilization Complete)

| Check | Target |
|-------|--------|
| `01-architecture/PROJECT_MAP.md` line count | ≥800 |
| Broken link rate | <5% |
| Duplicate nav blocks | 0 |
| P0 corrupted docs | 0 |
| Governance stub redirects | Created |
| AI Brain stack links valid | 100% |

---

## 8. Risk Register

| Risk | Mitigation |
|------|------------|
| Restoring PROJECT_MAP overwrites nav hub at `docs/PROJECT_MAP.md` | Restore **only** to `01-architecture/` — never touch docs root nav hub |
| Merge loses legacy architecture content | Merge = move content under headings; legacy file becomes redirect stub |
| Link script breaks valid links | Dry-run mode + verify target exists before write |
| macOS case-insensitive `Architecture.md`/`ARCHITECTURE.md` | Standardize on `Architecture.md`; delete duplicate inode reference in docs only |
| HR consolidation scope creep | Keep deep-dive HR_* files; only unify entry point |

---

## 9. Validation Checklist (Post-Recovery)

- [ ] `01-architecture/PROJECT_MAP.md` contains §1 Platform Overview through §11 Industry Expansion
- [ ] `docs/PROJECT_MAP.md` unchanged as doc navigation hub
- [ ] `git diff docs/PROJECT_MAP.md` is empty after recovery
- [ ] Link scan broken rate <5%
- [ ] No file has more than one `## Purpose` nav block
- [ ] CRM/Sales/Purchase have single `Architecture.md` SSOT
- [ ] Governance stubs resolve DEVELOPMENT_STANDARDS, WORKFLOW_REGISTRY, AI_KNOWLEDGE_INDEX links
- [ ] BRAIN.md Reading Hierarchy links all resolve

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Initial recovery plan (Step 03) |

---

**Documentation Recovery Plan** — restore, merge, stub, redirect. Never delete.
