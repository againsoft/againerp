# AgainERP — Module Normalization Plan

> **Status:** Planning (no changes applied)  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 05 — Module Normalization  
> **Authority:** [STANDARD_MODULE_TEMPLATE.md](./STANDARD_MODULE_TEMPLATE.md) · [ARCHITECTURE_SSOT_MAP.md](./ARCHITECTURE_SSOT_MAP.md) · [DOCUMENTATION_RECOVERY_PLAN.md](./DOCUMENTATION_RECOVERY_PLAN.md)

---

## Purpose

Per-module analysis and normalization strategy — merge legacy architecture into canonical 11-file packages without duplicating content.

## When To Read

Read before executing module documentation normalization (Step 06). Planning only — no file modifications in this step.

## Related Files

- [SSOT matrix](./MODULE_SSOT_MATRIX.md)
- [Package roadmap](./MODULE_PACKAGE_ROADMAP.md)
- [Module registry](./MODULE_REGISTRY.md)

## Read Next

[MODULE_PACKAGE_ROADMAP.md](./MODULE_PACKAGE_ROADMAP.md) — phased execution order

---

## 1. Enterprise Module Package Standard

Every business module under `docs/03-business-modules/{module}/` MUST converge to:

| # | File | Role | Content rule |
|---|------|------|--------------|
| 1 | `README.md` | **Level 3 entry** | Overview, Documentation Map → one downstream file |
| 2 | `Architecture.md` | **Canonical SSOT** | 10 fixed sections per STANDARD_MODULE_TEMPLATE |
| 3 | `ModuleManifest.md` | Install manifest | Deps, routes, events — no duplicate of Architecture §1 |
| 4 | `Database.md` | **Deep dive** | §4 detail — tables, ERD pointers |
| 5 | `API.md` | **Deep dive** | §5 detail — endpoints, contracts |
| 6 | `Workflow.md` | **Deep dive** | §6 detail — events, state machines |
| 7 | `Permissions.md` | **Deep dive** | §7 detail — namespace, matrix |
| 8 | `UI.md` | **Deep dive** | §8 nav map — links to Menus / prototype guides |
| 9 | `AI.md` | **Deep dive** | §9 tools — links to `06-ai/platform/` |
| 10 | `Reports.md` | **Deep dive** | Report catalog |
| 11 | `CHANGELOG.md` | Doc history | Module doc changes only |

### Normalization rules (no duplication)

| Rule | Detail |
|------|--------|
| **Merge, don't copy** | Move legacy blocks under standard § headings in `Architecture.md` |
| **Deep dive extract** | Pull §4–§7 tables into dedicated files; Architecture links down |
| **Legacy → stub** | `{MODULE}_MODULE_ARCHITECTURE.md` becomes redirect after merge |
| **Case** | Canonical name is `Architecture.md` (not `ARCHITECTURE.md`) |
| **Sub-areas** | Ecommerce `{area}/` = doc views — README + optional deep ARCHITECTURE; not full 11-file packages |
| **Entity files** | `ENTITY_*.md` merge into `Database.md` or stub → Database.md |
| **Workflow legacy** | `*_WORKFLOW.md` merge into `Workflow.md` |

### Document role taxonomy

```text
Canonical   → Architecture.md (10 sections)
Deep dive   → Database.md · API.md · Workflow.md · Permissions.md · UI.md · AI.md · Reports.md
Redirect    → *_MODULE_ARCHITECTURE.md · superseded Architecture stubs · ENTITY_*.md
Index       → README.md only
```

---

## 2. Scope Summary (15 modules analyzed)

| Module | Package today | Architecture SSOT today | Priority |
|--------|---------------|-------------------------|----------|
| `ecommerce` | 8/11 | `Architecture.md` | **P0** |
| `crm` | 2/11 | `CRM_MODULE_ARCHITECTURE.md` (conflict) | **P1** |
| `sales` | 2/11 | `SALES_MODULE_ARCHITECTURE.md` (conflict) | **P1** |
| `purchase` | 2/11 | `PURCHASE_MODULE_ARCHITECTURE.md` (conflict) | **P1** |
| `inventory` | 1/11 | `INVENTORY_MODULE_ARCHITECTURE.md` only | **P1** |
| `finance` | 1/11 | `FINANCE_MODULE_ARCHITECTURE.md` only | **P1** |
| `marketing` | 1/11 | `MARKETING_MODULE_ARCHITECTURE.md` only | **P2** |
| `hr-payroll` | 1/11 | 16 scattered `HR_*` files | **P1** |
| `hr` | 2/11 | `Architecture.md` (thin) | **P2** |
| `payroll` | 2/11 | `Architecture.md` (thin) | **P2** |
| `manufacturing` | 2/11 | `Architecture.md` (153 lines) | **P2** |
| `project` | 2/11 | `Architecture.md` (222 lines) | **P2** |
| `helpdesk` | 2/11 | `Architecture.md` (218 lines) | **P2** |
| `ecommerce/seo` | 2/11 (sub) | `seo/ARCHITECTURE.md` | **P0** |
| `ecommerce/builder` | 2/11 (sub) | `builder/ARCHITECTURE.md` | **P0** |

**0 / 15 modules** have complete 11-file packages today.

---

## 3. Per-Module Normalization Plans

---

### 3.1 CRM

| Field | Detail |
|-------|--------|
| **Current state** | README ✅ · Architecture.md (242 lines, **Superseded**) · CRM_MODULE_ARCHITECTURE.md (1,238 lines, **real SSOT**) · 3 md files total |
| **Problems** | Dual architecture — stub points to legacy; no package files; `Architecture.md`/`ARCHITECTURE.md` case duplicate inode |
| **Canonical files** | `README.md` · `Architecture.md` (post-merge) · future `Database.md` · `API.md` · `Workflow.md` · `Permissions.md` · `UI.md` · `AI.md` · `Reports.md` · `CHANGELOG.md` · `ModuleManifest.md` |
| **Legacy files** | `CRM_MODULE_ARCHITECTURE.md` |
| **Files to merge** | `CRM_MODULE_ARCHITECTURE.md` → `Architecture.md` (all 10 sections — content already 10/10 per template scan) |
| **Files to stub** | `CRM_MODULE_ARCHITECTURE.md` → redirect to `./Architecture.md` |
| **Missing files** | ModuleManifest, Database, API, Workflow, Permissions, UI, AI, Reports, CHANGELOG (9) |
| **Priority** | **P1** — Core ERP; legacy doc is richest source |

**Extract plan:** Pull §4 tables → `Database.md` · §5 → `API.md` · §6 → `Workflow.md` · §7 → `Permissions.md` · §8 → `UI.md` (link `04-uiux/prototype/crm/`) · §9 → `AI.md`

---

### 3.2 Sales

| Field | Detail |
|-------|--------|
| **Current state** | README ✅ · Architecture.md (228 lines, Superseded) · SALES_MODULE_ARCHITECTURE.md (1,005 lines) · SALES_WORKFLOW.md (1,386 lines) · ENTITY_SALES.md · 5 md files |
| **Problems** | Triple SSOT — architecture + separate workflow + entity file; stub Architecture.md |
| **Canonical files** | `Architecture.md` · `Workflow.md` · `Database.md` (includes ENTITY_SALES) |
| **Legacy files** | `SALES_MODULE_ARCHITECTURE.md` · `SALES_WORKFLOW.md` · `ENTITY_SALES.md` |
| **Files to merge** | `SALES_MODULE_ARCHITECTURE.md` → `Architecture.md` · `SALES_WORKFLOW.md` → `Workflow.md` · `ENTITY_SALES.md` → `Database.md` § entities |
| **Files to stub** | All three legacy files after merge |
| **Missing files** | ModuleManifest, API, Permissions, UI, AI, Reports, CHANGELOG (7) — Database/Workflow via merge |
| **Priority** | **P1** |

---

### 3.3 Purchase

| Field | Detail |
|-------|--------|
| **Current state** | README ✅ · Architecture.md (220 lines, Superseded) · PURCHASE_MODULE_ARCHITECTURE.md (973 lines) · PURCHASE_WORKFLOW.md (1,223 lines) · ENTITY_PURCHASE.md · 5 md files |
| **Problems** | Same pattern as Sales — workflow and entity split from architecture |
| **Canonical files** | `Architecture.md` · `Workflow.md` · `Database.md` |
| **Legacy files** | `PURCHASE_MODULE_ARCHITECTURE.md` · `PURCHASE_WORKFLOW.md` · `ENTITY_PURCHASE.md` |
| **Files to merge** | Architecture ← PURCHASE_MODULE_ARCHITECTURE · Workflow ← PURCHASE_WORKFLOW · Database ← ENTITY_PURCHASE + §4 |
| **Files to stub** | All three legacy files |
| **Missing files** | ModuleManifest, API, Permissions, UI, AI, Reports, CHANGELOG (7) |
| **Priority** | **P1** |

---

### 3.4 Inventory

| Field | Detail |
|-------|--------|
| **Current state** | README ✅ · INVENTORY_MODULE_ARCHITECTURE.md (990 lines) · INVENTORY_WORKFLOW.md (1,324 lines) · ENTITY_INVENTORY.md · **no Architecture.md** · 4 md files |
| **Problems** | Non-standard architecture filename; no canonical Architecture.md; workflow separated |
| **Canonical files** | `Architecture.md` (rename via merge) · `Workflow.md` · `Database.md` |
| **Legacy files** | `INVENTORY_MODULE_ARCHITECTURE.md` · `INVENTORY_WORKFLOW.md` · `ENTITY_INVENTORY.md` |
| **Files to merge** | INVENTORY_MODULE_ARCHITECTURE → Architecture.md · INVENTORY_WORKFLOW → Workflow.md · ENTITY_INVENTORY → Database.md |
| **Files to stub** | All three legacy files |
| **Missing files** | ModuleManifest, API, Permissions, UI, AI, Reports, CHANGELOG (7) |
| **Priority** | **P1** — Core ERP; depends on ecommerce inventory views |

---

### 3.5 Finance

| Field | Detail |
|-------|--------|
| **Current state** | README ✅ · FINANCE_MODULE_ARCHITECTURE.md (1,158 lines) only · `accounting/` sibling has superseded stub → finance · 2 md files |
| **Problems** | No Architecture.md; finance/accounting domain split confuses installable boundary |
| **Canonical files** | `Architecture.md` ← FINANCE_MODULE_ARCHITECTURE · `Database.md` · `API.md` |
| **Legacy files** | `FINANCE_MODULE_ARCHITECTURE.md` |
| **Files to merge** | FINANCE_MODULE_ARCHITECTURE → Architecture.md (rename) |
| **Files to stub** | FINANCE_MODULE_ARCHITECTURE.md · keep `accounting/Architecture.md` stub → `../finance/Architecture.md` |
| **Missing files** | ModuleManifest, Database, API, Workflow, Permissions, UI, AI, Reports, CHANGELOG (9) |
| **Priority** | **P1** — GL/COA foundation; accounting stub already points here |

---

### 3.6 Marketing (standalone)

| Field | Detail |
|-------|--------|
| **Current state** | README ✅ · MARKETING_MODULE_ARCHITECTURE.md (1,109 lines) · 2 md files |
| **Problems** | Overlaps `ecommerce/marketing/` doc view and `sales-marketing/` UI module — boundary unclear |
| **Canonical files** | `Architecture.md` ← MARKETING_MODULE_ARCHITECTURE |
| **Legacy files** | `MARKETING_MODULE_ARCHITECTURE.md` |
| **Files to merge** | Full doc → Architecture.md |
| **Files to stub** | MARKETING_MODULE_ARCHITECTURE.md |
| **Missing files** | ModuleManifest, Database, API, Workflow, Permissions, UI, AI, Reports, CHANGELOG (9) |
| **Priority** | **P2** — Clarify vs ecommerce/marketing in Architecture §2 boundaries |

**Boundary rule:** Standalone `marketing/` = ERP campaigns/journeys · `ecommerce/marketing/` = commerce promotions/coupons (doc view only)

---

### 3.7 HR-Payroll (master)

| Field | Detail |
|-------|--------|
| **Current state** | README ✅ · 16 `HR_*` architecture files · HR_MODULE_MASTER_INDEX.md · 31 md files (incl. ui-design) |
| **Problems** | No single Architecture.md; every concern has own file; overlaps `hr/` and `payroll/` modules |
| **Canonical files** | `Architecture.md` (unified) · `Database.md` ← HR_DATABASE_ARCHITECTURE · `API.md` ← HR_API_ARCHITECTURE · `Workflow.md` ← HR_WORKFLOW_ARCHITECTURE · `Permissions.md` ← HR_PERMISSION_MATRIX · `UI.md` ← HR_UI_UX_BLUEPRINT + HR_SCREEN_INVENTORY |
| **Legacy files** | HR_PAYROLL_MASTER_ARCHITECTURE.md · HR_DATABASE_ARCHITECTURE.md · HR_API_ARCHITECTURE.md · HR_WORKFLOW_ARCHITECTURE.md · HR_PERMISSION_MATRIX.md · HR_AUTOMATION_ENGINE_ARCHITECTURE.md · HR_NOTIFICATION_ARCHITECTURE.md · HR_AI_ASSISTANT_ARCHITECTURE.md · HR_DASHBOARD_ARCHITECTURE.md · HR_REPORTING_ARCHITECTURE.md · HR_ACTIVITY_LOG_ARCHITECTURE.md · HR_UI_UX_BLUEPRINT.md · HR_SCREEN_INVENTORY.md · HR_FIGMA_WIREFRAME_BLUEPRINT.md · HR_DATABASE_ERD_PLANNING.md · HR_MODULE_MASTER_INDEX.md |
| **Files to merge** | HR_PAYROLL_MASTER → Architecture.md §1–§3 · extract §4–§10 into package files per mapping above |
| **Files to stub** | All HR_* files → redirect to canonical/deep-dive |
| **Missing files** | Architecture.md, ModuleManifest, AI.md (from HR_AI_ASSISTANT), Reports.md (from HR_REPORTING), CHANGELOG.md |
| **Priority** | **P1** — Largest consolidation; blocks hr/ and payroll/ normalization |

**Deep dives kept (Level 5):** HR_FIGMA_WIREFRAME_BLUEPRINT.md · HR_DATABASE_ERD_PLANNING.md — link from UI.md / Database.md, do not merge body

---

### 3.8 HR (standalone module)

| Field | Detail |
|-------|--------|
| **Current state** | README ✅ · Architecture.md (227 lines, thin summary) · 2 md files |
| **Problems** | Subset of hr-payroll master; duplicate domain with hr-payroll and payroll |
| **Canonical files** | `Architecture.md` — **scoped subset** of hr-payroll (employees, org, attendance, leave only) |
| **Legacy files** | Current thin Architecture.md |
| **Files to merge** | Extract HR-relevant sections from hr-payroll master after hr-payroll normalized |
| **Files to stub** | None — replace thin Architecture with scoped doc linking to hr-payroll for shared concerns |
| **Missing files** | Full package (9 files) |
| **Priority** | **P2** — After hr-payroll P1 complete |

**Boundary rule:** `hr/` = installable HR ops · `hr-payroll/` = master doc umbrella · cross-link, no duplicate tables

---

### 3.9 Payroll (standalone module)

| Field | Detail |
|-------|--------|
| **Current state** | README ✅ · Architecture.md (217 lines, thin) · 2 md files |
| **Problems** | Subset of hr-payroll; thin Architecture |
| **Canonical files** | `Architecture.md` — scoped to payslips, salary structures, compliance |
| **Legacy files** | Current thin Architecture.md |
| **Files to merge** | Payroll sections from hr-payroll master |
| **Files to stub** | None |
| **Missing files** | Full package (9 files) |
| **Priority** | **P2** — After hr-payroll |

---

### 3.10 Manufacturing

| Field | Detail |
|-------|--------|
| **Current state** | README ✅ · Architecture.md (153 lines) · 2 md files |
| **Problems** | Thin Architecture — likely missing §4–§10 depth; no package files |
| **Canonical files** | `Architecture.md` (expand in place — no legacy competitor) |
| **Legacy files** | None |
| **Files to merge** | None — expand Architecture.md sections; extract to package files |
| **Files to stub** | None |
| **Missing files** | ModuleManifest, Database, API, Workflow, Permissions, UI, AI, Reports, CHANGELOG (9) |
| **Priority** | **P2** |

---

### 3.11 Project

| Field | Detail |
|-------|--------|
| **Current state** | README ✅ · Architecture.md (222 lines) · 2 md files |
| **Problems** | Thin canonical doc; no package; 8/10 sections per template scan |
| **Canonical files** | `Architecture.md` (expand) |
| **Legacy files** | None |
| **Files to merge** | None |
| **Files to stub** | None |
| **Missing files** | ModuleManifest, Database, API, Workflow, Permissions, UI, AI, Reports, CHANGELOG (9) |
| **Priority** | **P2** |

---

### 3.12 Helpdesk

| Field | Detail |
|-------|--------|
| **Current state** | README ✅ · Architecture.md (218 lines) · 2 md files |
| **Problems** | Thin Architecture; no package; links to knowledge module |
| **Canonical files** | `Architecture.md` (expand) |
| **Legacy files** | None |
| **Files to merge** | None |
| **Missing files** | ModuleManifest, Database, API, Workflow, Permissions, UI, AI, Reports, CHANGELOG (9) |
| **Priority** | **P2** |

---

### 3.13 Ecommerce (parent module)

| Field | Detail |
|-------|--------|
| **Current state** | README ✅ · Architecture.md (198 lines) · ModuleManifest ✅ · Database ✅ · API ✅ · Workflow ✅ · Permissions ✅ · UI ✅ · 207 md files (168 Menus) · 8/11 package |
| **Problems** | Missing AI, Reports, CHANGELOG; deep dives live in root + 12 sub-areas; ECOMMERCE_STOREFRONT_ARCHITECTURE + URL_SLUG_ARCHITECTURE overlap §8/§10 |
| **Canonical files** | Existing package + `Architecture.md` as hub |
| **Legacy files** | `ECOMMERCE_STOREFRONT_ARCHITECTURE.md` · `URL_SLUG_ARCHITECTURE.md` · `Development.md` · `Roadmap.md` · `MENU_STRUCTURE.md` |
| **Files to merge** | None into Architecture — keep as **deep dives** |
| **Files to stub** | None — demote legacy root files to deep-dive with links from Architecture §8/§10 |
| **Missing files** | `AI.md` · `Reports.md` · `CHANGELOG.md` (3) |
| **Priority** | **P0** — Active module; highest doc investment |

**Sub-area rule:** 12 folders (`catalog/`, `seo/`, `builder/`, …) keep `README.md` + `ARCHITECTURE.md` as doc views — NOT full 11-file packages. Parent `UI.md` indexes them.

---

### 3.14 SEO (ecommerce sub-area)

| Field | Detail |
|-------|--------|
| **Current state** | `ecommerce/seo/README.md` ✅ · `seo/ARCHITECTURE.md` ✅ · Menus/SEO/ (many screens) |
| **Problems** | Not a standalone installable module — doc view only; no parent cross-links in ecommerce AI.md |
| **Canonical files** | `seo/README.md` (entry) · `seo/ARCHITECTURE.md` (deep dive) · parent `ecommerce/Architecture.md` §3 references |
| **Legacy files** | None |
| **Files to merge** | None |
| **Files to stub** | None |
| **Missing files** | N/A — sub-area uses reduced package (README + ARCHITECTURE only) |
| **Priority** | **P0** — Active commerce scope |

---

### 3.15 Builder (ecommerce sub-area)

| Field | Detail |
|-------|--------|
| **Current state** | `ecommerce/builder/README.md` ✅ · `builder/ARCHITECTURE.md` ✅ · `08-builder/prototype/` (39 files) · Menus/Builder/ |
| **Problems** | Builder specs split across `08-builder/prototype/` and ecommerce sub-area — three locations |
| **Canonical files** | `builder/README.md` · `builder/ARCHITECTURE.md` · `08-builder/prototype/{Tool}.md` (deep dive) |
| **Legacy files** | None at sub-area level |
| **Files to merge** | None — link hierarchy only |
| **Files to stub** | None |
| **Missing files** | N/A for sub-area; parent `ecommerce/AI.md` should link builder AI tools |
| **Priority** | **P0** — Active; SSOT map defines read path |

**SSOT chain:** `builder/README` → `builder/ARCHITECTURE` → `08-builder/prototype/` → `Menus/Builder/`

---

## 4. Cross-Module Issues

| Issue | Modules affected | Resolution |
|-------|------------------|------------|
| **Dual architecture filename** | crm, sales, purchase, manufacturing, project, helpdesk, ecommerce, hr, payroll | Keep `Architecture.md`; remove `ARCHITECTURE.md` alias after normalization |
| **Legacy *_MODULE_ARCHITECTURE** | crm, sales, purchase, inventory, finance, marketing | Merge → stub |
| **Legacy *_WORKFLOW** | sales, purchase, inventory | Merge → Workflow.md → stub |
| **ENTITY_*.md orphans** | sales, purchase, inventory | Merge → Database.md → stub |
| **HR triple overlap** | hr-payroll, hr, payroll | hr-payroll master first; hr/payroll become scoped subsets |
| **Marketing triple overlap** | marketing, ecommerce/marketing, sales-marketing | Document boundaries in §2 Purpose |
| **Finance/accounting** | finance, accounting | accounting remains stub → finance |
| **Ecommerce sub-areas** | 12 folders | README + ARCHITECTURE only; parent indexes |

---

## 5. Recommended Normalization Order

```text
Wave 1 (P0 — Active)
  1. ecommerce        — add AI.md, Reports.md, CHANGELOG.md; index sub-areas in UI.md
  2. ecommerce/seo    — verify README + ARCHITECTURE; link from parent
  3. ecommerce/builder — verify README + ARCHITECTURE; link 08-builder/

Wave 2 (P1 — Core ERP, rich legacy docs)
  4. crm              — merge CRM_MODULE_ARCHITECTURE → Architecture.md; extract package
  5. sales            — merge + SALES_WORKFLOW + ENTITY_SALES
  6. purchase         — merge + PURCHASE_WORKFLOW + ENTITY_PURCHASE
  7. inventory        — rename merge + INVENTORY_WORKFLOW + ENTITY_INVENTORY
  8. finance          — rename FINANCE_MODULE_ARCHITECTURE; confirm accounting stub
  9. hr-payroll       — master consolidation (largest effort)

Wave 3 (P2 — Thin Architecture modules)
  10. manufacturing
  11. project
  12. helpdesk
  13. marketing       — after boundary doc with ecommerce/marketing
  14. hr              — after hr-payroll; scoped subset
  15. payroll         — after hr-payroll; scoped subset
```

**Parallel safe:** crm + sales + purchase (no cross-deps in docs) · seo + builder (sub-areas)

**Sequential required:** hr-payroll before hr/payroll · ecommerce before seo/builder parent links

---

## 6. Execution Checklist (Step 06 — future)

Per module:
- [ ] Merge legacy → Architecture.md (10 sections)
- [ ] Extract Database, API, Workflow, Permissions, UI, AI, Reports
- [ ] Create ModuleManifest.md from Architecture §1 + deps map
- [ ] Create CHANGELOG.md (initial entry: normalization date)
- [ ] Stub all legacy filenames
- [ ] Update README.md Documentation Map
- [ ] Update MODULE_REGISTRY.md doc entry
- [ ] Run link migration scripts
- [ ] Verify 0 duplicate SSOT for architecture

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Initial module normalization plan (Step 05) |

---

**Module Normalization Plan** — merge once, stub legacy, extract deep dives.
