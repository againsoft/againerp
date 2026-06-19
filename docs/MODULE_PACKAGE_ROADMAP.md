# AgainERP — Module Package Roadmap

> **Status:** Planning (no changes applied)  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 05 — Module Normalization  
> **Authority:** [MODULE_NORMALIZATION_PLAN.md](./MODULE_NORMALIZATION_PLAN.md) · [STANDARD_MODULE_TEMPLATE.md](./STANDARD_MODULE_TEMPLATE.md)

---

## Purpose

Phased roadmap to normalize all business module documentation into the enterprise 11-file package — without new features or application code.

## When To Read

Read before scheduling Step 06 normalization sprints.

## Related Files

- [SSOT matrix](./MODULE_SSOT_MATRIX.md)
- [Recovery execution report](./RECOVERY_EXECUTION_REPORT.md)
- [Module registry](./MODULE_REGISTRY.md)

## Read Next

[MODULE_GENERATOR_GUIDE.md](./MODULE_GENERATOR_GUIDE.md) · [NEW_MODULE_CHECKLIST.md](./NEW_MODULE_CHECKLIST.md)

---

## 1. Package Standard (Enterprise)

### 1.1 Required files

```text
03-business-modules/{module}/
├── README.md              ← Level 3 entry (Documentation Map)
├── Architecture.md        ← Canonical 10-section SSOT
├── ModuleManifest.md      ← Install / deps / routes
├── Database.md            ← §4 deep dive
├── API.md                 ← §5 deep dive
├── Workflow.md            ← §6 deep dive
├── Permissions.md         ← §7 deep dive
├── UI.md                  ← §8 nav map
├── AI.md                  ← §9 tools
├── Reports.md             ← Report catalog
└── CHANGELOG.md           ← Doc change log
```

### 1.2 Sub-area standard (ecommerce doc views)

```text
03-business-modules/ecommerce/{area}/
├── README.md              ← Sub-area entry
└── ARCHITECTURE.md        ← Area deep dive (optional extra specs)
    Menus/{Area}/          ← Screen SSOT (existing)
    08-builder/prototype/  ← Builder tool SSOT (builder only)
```

Sub-areas do **not** get full 11-file packages — parent `ecommerce/` owns Database, API, Workflow, etc.

### 1.3 Quality gates (per module)

| Gate | Criteria |
|------|----------|
| **G1 Architecture** | `Architecture.md` has all 10 sections per STANDARD_MODULE_TEMPLATE |
| **G2 No duplicate SSOT** | Legacy `*_MODULE_ARCHITECTURE.md` is stub only |
| **G3 Package complete** | 11 files exist (or documented N/A for sub-areas) |
| **G4 Extract done** | No duplicate tables in Architecture and Database/API/Workflow |
| **G5 Links valid** | README Documentation Map links resolve (<5% broken) |
| **G6 Registry synced** | MODULE_REGISTRY.md doc entry → README.md |

### 1.4 Normalization workflow (per module)

```text
1. Merge legacy architecture → Architecture.md (move headings, preserve content)
2. Extract §4–§9 into Database, API, Workflow, Permissions, UI, AI, Reports
3. Create ModuleManifest.md from §1 metadata + MODULE_DEPENDENCY_MAP
4. Create CHANGELOG.md (initial normalization entry)
5. Stub all legacy filenames with redirect banners
6. Update README.md Documentation Map
7. Run migrate-doc-links-phase2.py --dry-run → apply
8. Mark complete in MODULE_REGISTRY status notes
```

**Estimated effort:** 2–4 hr (rich legacy) · 1–2 hr (thin Architecture) · 8–12 hr (hr-payroll)

---

## 2. Phase 1 — Active Modules

**Goal:** Complete packages for production-active documentation paths.  
**Timeline:** Sprint 1 (immediate after Step 05)  
**Modules:** `ecommerce`, `ecommerce/seo`, `ecommerce/builder`

| Module | Current | Target | Work items | Effort |
|--------|---------|--------|------------|--------|
| **ecommerce** | 8/11 | 11/11 | Create `AI.md` (from Menus/AI/ index + §9) · `Reports.md` (from Menus/Reports/) · `CHANGELOG.md` · index 12 sub-areas in `UI.md` · link ECOMMERCE_STOREFRONT + URL_SLUG as deep dives | 4 hr |
| **seo** (sub) | 2/2 | 2/2 | Verify README + ARCHITECTURE · add parent cross-links in ecommerce UI.md / AI.md | 1 hr |
| **builder** (sub) | 2/2 | 2/2 | Verify README + ARCHITECTURE · document SSOT chain to `08-builder/prototype/` | 1 hr |

### Phase 1 deliverables

- [ ] Ecommerce 11/11 package complete
- [ ] Sub-area READMEs linked from parent Documentation Map
- [ ] Builder read path documented in ARCHITECTURE_SSOT_MAP (update status)
- [ ] MODULE_REGISTRY notes `Active · package complete`

### Phase 1 success metrics

| Metric | Target |
|--------|--------|
| ecommerce package files | 11/11 |
| Sub-area entries in ecommerce UI.md | 12 areas |
| Broken links in ecommerce/*.md | <5% |

---

## 3. Phase 2 — Core ERP Modules

**Goal:** Merge rich legacy architecture docs into canonical packages for ERP spine.  
**Timeline:** Sprint 2–4  
**Modules:** `crm`, `sales`, `purchase`, `inventory`, `finance`, `hr-payroll`

| Order | Module | Primary action | Package after |
|-------|--------|----------------|---------------|
| 1 | **crm** | Merge CRM_MODULE_ARCHITECTURE → Architecture.md; extract 7 files | 11/11 |
| 2 | **sales** | Merge architecture + SALES_WORKFLOW + ENTITY_SALES | 11/11 |
| 3 | **purchase** | Merge architecture + PURCHASE_WORKFLOW + ENTITY_PURCHASE | 11/11 |
| 4 | **inventory** | Rename merge INVENTORY_* + workflow + entity | 11/11 |
| 5 | **finance** | Rename FINANCE_MODULE_ARCHITECTURE; confirm accounting stub | 11/11 |
| 6 | **hr-payroll** | Consolidate 16 HR_* files → Architecture + 6 deep dives | 11/11 |

### Phase 2 parallelization

| Track A (can parallel) | Track B (can parallel) | Sequential |
|------------------------|--------------------------|------------|
| crm | inventory | hr-payroll **last** in phase |
| sales | finance | |
| purchase | | |

### Phase 2 deliverables

- [ ] 6 modules at 11/11 package
- [ ] 0 `*_MODULE_ARCHITECTURE.md` files with body content (stubs only)
- [ ] ENTITY_*.md stubbed → Database.md
- [ ] accounting/Architecture.md stub → finance

### Phase 2 success metrics

| Metric | Target |
|--------|--------|
| Core ERP modules normalized | 6/6 |
| Legacy architecture files stubbed | 100% |
| Avg Architecture.md section score | 10/10 |

---

## 4. Phase 3 — Future Modules

**Goal:** Expand thin Architecture docs and resolve domain overlaps.  
**Timeline:** Sprint 5+  
**Modules:** `manufacturing`, `project`, `helpdesk`, `marketing`, `hr`, `payroll`

| Order | Module | Primary action | Depends on |
|-------|--------|----------------|------------|
| 1 | **manufacturing** | Expand Architecture.md; create package files | Phase 2 complete |
| 2 | **project** | Expand Architecture.md; create package | Phase 2 |
| 3 | **helpdesk** | Expand Architecture.md; link knowledge module | Phase 2 |
| 4 | **marketing** | Merge MARKETING_MODULE_ARCHITECTURE; document vs ecommerce/marketing boundary | ecommerce Phase 1 |
| 5 | **hr** | Scoped Architecture from hr-payroll subset | hr-payroll Phase 2 |
| 6 | **payroll** | Scoped Architecture from hr-payroll subset | hr-payroll Phase 2 |

### Phase 3 modules not in scope (28-module registry)

These remain **Phase 4+** — not in Step 05 scope:

`accounting` (stub only) · `bi-system` · `booking` · `business-partners` · `data-warehouse` · `documents` · `fleet` · `knowledge` · `logistics` · `marketplace` · `pos` · `product-configurator` · `sales-marketing` · `subscription` · `timesheet`

`business-partners` already at 6/11 — candidate for early Phase 3 extension.

### Phase 3 deliverables

- [ ] 6 modules at 11/11 package
- [ ] HR domain clarity: hr-payroll master + hr/payroll scoped installables
- [ ] Marketing boundary documented across 3 marketing-related paths

---

## 5. Normalization Order (Master Sequence)

```text
PHASE 1 — Active (Sprint 1)
  └─ ecommerce → ecommerce/seo → ecommerce/builder

PHASE 2 — Core ERP (Sprint 2–4)
  └─ crm ─┬─ sales ─── purchase
          ├─ inventory
          ├─ finance
          └─ hr-payroll (capstone)

PHASE 3 — Future (Sprint 5+)
  └─ manufacturing → project → helpdesk → marketing → hr → payroll
```

**Total in scope (Step 05):** 15 module paths · **Target:** 13 full packages + 2 sub-areas

---

## 6. Risk & Mitigation

| Risk | Mitigation |
|------|------------|
| Content loss during merge | Move blocks only; stub legacy with git snapshot before edit |
| HR consolidation scope creep | Keep HR_FIGMA + ERD as Level 5 deep dives |
| Marketing domain confusion | §2 Purpose boundary in each marketing path |
| Link breakage after extract | Run phase2 link script after each module |
| Token bloat in Architecture | Extract tables to Database/API — Architecture summarizes + links |

---

## 7. Tracking

Update after each module normalized:

| Field | Location |
|-------|----------|
| Package completion | This roadmap §2–4 checklists |
| SSOT status | [MODULE_SSOT_MATRIX.md](./MODULE_SSOT_MATRIX.md) |
| Registry status | [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) |
| Per-module detail | [MODULE_NORMALIZATION_PLAN.md §3](./MODULE_NORMALIZATION_PLAN.md) |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Initial module package roadmap (Step 05) |

---

**Module Package Roadmap** — Phase 1 Active → Phase 2 ERP → Phase 3 Future.
