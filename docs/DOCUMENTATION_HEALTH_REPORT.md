# AgainERP — Documentation Health Report

> **Purpose:** Documentation quality dashboard.  
> **Regenerate metrics:** `python3 docs/scripts/generate-governance-registries.py`

**Report Date:** 2026-06-12 · **Documentation Score:** **75 / 100**

---

## Coverage Summary

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Total documents | 557 | — | ✅ |
| Governance files | 14 / 14 | 14 | ✅ |
| Registered in DOCUMENT_REGISTRY | 557 | 100% | ✅ |
| Indexed in MASTER_INDEX | ~95% | 100% | 🟡 |
| Modules with Architecture.md | 33 | all planned | ✅ |
| Modules with ModuleManifest | 1 (ecommerce) | all active | 🔴 |
| Ecommerce menu screens | 167 / 167 | 167 | ✅ |
| UI prototype pages | 147 | 167 | 🟡 |
| ADRs documented | 10 | growing | ✅ |

---

## Documentation Score Breakdown

| Category | Weight | Score | Notes |
|----------|--------|-------|-------|
| Governance completeness | 20% | 98% | 14 governance files + Technology Constitution |
| Module package (9 files) | 20% | 45% | Only ecommerce partial |
| Screen doc completeness | 15% | 40% | Most menus are templates |
| Registry accuracy | 15% | 90% | Generator + registries live |
| Cross-link integrity | 10% | 75% | Some planned links |
| Ready status (approved) | 10% | 5% | Nearly all Draft |
| Traceability | 10% | 80% | Phase 1 mapped |

**Weighted total: ~75 / 100**

---

## Missing Documents

| Item | Module | Priority |
|------|--------|----------|
| `AI.md` (module root) | ecommerce | High |
| `Reports.md` (module root) | ecommerce | High |
| `CHANGELOG.md` (module root) | ecommerce | Medium |
| `ModuleManifest.md` | crm, sales, accounting, … | Medium |
| Full `Database.md` | ERP modules | Low (planned phase) |
| Industry module packages | hospital, school, … | Low |

---

## Outdated Documents

| Document | Issue | Action |
|----------|-------|--------|
| `modules/ecommerce/Workflow.md` | Template placeholders | Fill order/product workflows |
| `modules/ecommerce/Permissions.md` | Template placeholders | Define permission matrix |
| ERP `Architecture.md` files | Stub depth | Expand per phase gate |
| 167 Ecommerce `Menus/*.md` | Template content | Enrich per screen priority |

---

## Broken References

| Check | Status |
|-------|--------|
| Governance cross-links | ✅ Verified |
| `architecture/project.md` | Verify exists at repo root |
| Submodule README links | 🟡 Spot-check needed |

**Action:** Run link checker before Phase 1 gate.

---

## Missing Owners

| Area | Owner Assigned |
|------|----------------|
| Governance files | Platform Team ✅ |
| Ecommerce | Ecommerce Team (manifest) ✅ |
| ERP modules | — 🔴 |
| Industry modules | — 🔴 |
| UI prototype | — 🟡 |

---

## Missing Reviews

| Phase | Doc Status | Stakeholder Sign-off |
|-------|------------|---------------------|
| Phase 0 Foundation | Documented | 🚫 Pending |
| Phase 1 Core | Documented | 🚫 Pending |
| Phase 2 Database | Documented | 🚫 Pending |
| Phase 3 UI | Documented | 🚫 Pending |
| Phase 4 Ecommerce | Documented | 🚫 Pending |

See [MASTER_DEVELOPMENT_SEQUENCE.md](./MASTER_DEVELOPMENT_SEQUENCE.md).

---

## Registry Health

| Registry | Last Updated | Auto-generated |
|----------|--------------|----------------|
| DOCUMENT_REGISTRY | 2026-06-12 | ✅ Full list in `_registries/` |
| MODULE_REGISTRY | 2026-06-12 | Manual |
| PAGE_REGISTRY | 2026-06-12 | ✅ Full list in `_registries/` |
| DATABASE_REGISTRY | 2026-06-12 | Manual |
| API_REGISTRY | 2026-06-12 | Manual |
| WORKFLOW_REGISTRY | 2026-06-12 | Manual |

---

## Recommended Actions (Priority Order)

1. **Add ecommerce `AI.md`, `Reports.md`, `CHANGELOG.md`** — close 9-file package gap
2. **Enrich top 20 Ecommerce menu screens** — Product List exemplar exists
3. **Mark Phase 0–4 Ready** — stakeholder gate
4. **Add ModuleManifest to ERP modules** — when phases activate
5. **Run registry generator in CI** — on every docs PR

---

## Score History

| Date | Score | Notes |
|------|-------|-------|
| 2026-06-12 | 72 | Governance layer + registries created |
| 2026-06-12 | 75 | Technology Constitution ratified |

---

**Next Review:** 2026-06-19 · **Maintainer:** Platform Architecture Team
