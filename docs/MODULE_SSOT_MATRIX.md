# AgainERP — Module SSOT Matrix

> **Status:** Planning (no changes applied)  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 05 — Module Normalization  
> **Authority:** [ARCHITECTURE_SSOT_MAP.md](./ARCHITECTURE_SSOT_MAP.md) · [MODULE_NORMALIZATION_PLAN.md](./MODULE_NORMALIZATION_PLAN.md)

---

## Purpose

Single-page matrix of documentation SSOT per module and concern — current state and target state after normalization.

## When To Read

Read when implementing module docs or unsure which file owns schema, API, workflow, UI, AI, or reports for a module.

## Related Files

- [Normalization plan](./MODULE_NORMALIZATION_PLAN.md)
- [Package roadmap](./MODULE_PACKAGE_ROADMAP.md)
- [Module registry](./MODULE_REGISTRY.md)

## Read Next

[MODULE_GENERATOR_GUIDE.md](./MODULE_GENERATOR_GUIDE.md) · [NEW_MODULE_CHECKLIST.md](./NEW_MODULE_CHECKLIST.md)

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | SSOT exists and is canonical |
| 🔴 | Legacy file is current SSOT — merge pending |
| 🟡 | Partial / thin — needs extract or expand |
| ⬜ | Missing — create in normalization |
| ↪ | Stub redirect only |
| (sub) | Ecommerce doc-view sub-area — reduced package |

**Target:** Every column resolves to one canonical file per module (or parent for sub-areas).

---

## SSOT Matrix — Target State (after normalization)

| Module | Architecture SSOT | Database SSOT | API SSOT | Workflow SSOT | UI SSOT | AI SSOT | Reports SSOT |
|--------|-------------------|---------------|----------|---------------|---------|---------|--------------|
| **ecommerce** | `Architecture.md` | `Database.md` | `API.md` | `Workflow.md` | `UI.md` + Menus/ | `AI.md` | `Reports.md` |
| **crm** | `Architecture.md` | `Database.md` | `API.md` | `Workflow.md` | `UI.md` | `AI.md` | `Reports.md` |
| **sales** | `Architecture.md` | `Database.md` | `API.md` | `Workflow.md` | `UI.md` | `AI.md` | `Reports.md` |
| **purchase** | `Architecture.md` | `Database.md` | `API.md` | `Workflow.md` | `UI.md` | `AI.md` | `Reports.md` |
| **inventory** | `Architecture.md` | `Database.md` | `API.md` | `Workflow.md` | `UI.md` | `AI.md` | `Reports.md` |
| **finance** | `Architecture.md` | `Database.md` | `API.md` | `Workflow.md` | `UI.md` | `AI.md` | `Reports.md` |
| **marketing** | `Architecture.md` | `Database.md` | `API.md` | `Workflow.md` | `UI.md` | `AI.md` | `Reports.md` |
| **hr-payroll** | `Architecture.md` | `Database.md` | `API.md` | `Workflow.md` | `UI.md` | `AI.md` | `Reports.md` |
| **hr** | `Architecture.md` | `Database.md` | `API.md` | `Workflow.md` | `UI.md` | `AI.md` | `Reports.md` |
| **payroll** | `Architecture.md` | `Database.md` | `API.md` | `Workflow.md` | `UI.md` | `AI.md` | `Reports.md` |
| **manufacturing** | `Architecture.md` | `Database.md` | `API.md` | `Workflow.md` | `UI.md` | `AI.md` | `Reports.md` |
| **project** | `Architecture.md` | `Database.md` | `API.md` | `Workflow.md` | `UI.md` | `AI.md` | `Reports.md` |
| **helpdesk** | `Architecture.md` | `Database.md` | `API.md` | `Workflow.md` | `UI.md` | `AI.md` | `Reports.md` |
| **seo** (sub) | `seo/ARCHITECTURE.md` | ↪ parent `Database.md` | ↪ parent `API.md` | ↪ parent `Workflow.md` | `Menus/SEO/` + `seo/ARCHITECTURE` §8 | ↪ parent `AI.md` | ↪ parent `Reports.md` |
| **builder** (sub) | `builder/ARCHITECTURE.md` | ↪ parent | ↪ parent | ↪ parent | `08-builder/prototype/` + Menus/Builder/ | ↪ parent `AI.md` | ↪ parent |

---

## SSOT Matrix — Current State (pre-normalization)

| Module | Architecture SSOT | Database SSOT | API SSOT | Workflow SSOT | UI SSOT | AI SSOT | Reports SSOT |
|--------|-------------------|---------------|----------|---------------|---------|---------|--------------|
| **ecommerce** | ✅ `Architecture.md` | ✅ `Database.md` | ✅ `API.md` | ✅ `Workflow.md` | ✅ `UI.md` + Menus/ | ⬜ missing | ⬜ missing |
| **crm** | 🔴 `CRM_MODULE_ARCHITECTURE.md` | ⬜ (in legacy §4) | ⬜ (in legacy §5) | ⬜ (in legacy §6) | ⬜ (in legacy §8) | ⬜ (in legacy §9) | ⬜ |
| **sales** | 🔴 `SALES_MODULE_ARCHITECTURE.md` | 🔴 `ENTITY_SALES.md` | ⬜ (in legacy §5) | 🔴 `SALES_WORKFLOW.md` | ⬜ (in legacy §8) | ⬜ (in legacy §9) | ⬜ |
| **purchase** | 🔴 `PURCHASE_MODULE_ARCHITECTURE.md` | 🔴 `ENTITY_PURCHASE.md` | ⬜ (in legacy §5) | 🔴 `PURCHASE_WORKFLOW.md` | ⬜ (in legacy §8) | ⬜ (in legacy §9) | ⬜ |
| **inventory** | 🔴 `INVENTORY_MODULE_ARCHITECTURE.md` | 🔴 `ENTITY_INVENTORY.md` | ⬜ (in legacy §5) | 🔴 `INVENTORY_WORKFLOW.md` | ⬜ (in legacy §8) | ⬜ (in legacy §9) | ⬜ |
| **finance** | 🔴 `FINANCE_MODULE_ARCHITECTURE.md` | ⬜ (in legacy §4) | ⬜ (in legacy §5) | ⬜ (in legacy §6) | ⬜ (in legacy §8) | ⬜ (in legacy §9) | ⬜ |
| **marketing** | 🔴 `MARKETING_MODULE_ARCHITECTURE.md` | ⬜ (in legacy §4) | ⬜ (in legacy §5) | ⬜ (in legacy §6) | ⬜ (in legacy §8) | ⬜ (in legacy §9) | ⬜ |
| **hr-payroll** | 🔴 `HR_PAYROLL_MASTER_ARCHITECTURE.md` | 🔴 `HR_DATABASE_ARCHITECTURE.md` | 🔴 `HR_API_ARCHITECTURE.md` | 🔴 `HR_WORKFLOW_ARCHITECTURE.md` | 🔴 `HR_UI_UX_BLUEPRINT.md` | 🔴 `HR_AI_ASSISTANT_ARCHITECTURE.md` | 🔴 `HR_REPORTING_ARCHITECTURE.md` |
| **hr** | 🟡 `Architecture.md` (thin) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **payroll** | 🟡 `Architecture.md` (thin) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **manufacturing** | 🟡 `Architecture.md` (153 lines) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **project** | 🟡 `Architecture.md` (222 lines) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **helpdesk** | 🟡 `Architecture.md` (218 lines) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **seo** (sub) | ✅ `seo/ARCHITECTURE.md` | ↪ ecommerce | ↪ ecommerce | ↪ ecommerce | Menus/SEO/ | ↪ ecommerce | ↪ ecommerce |
| **builder** (sub) | ✅ `builder/ARCHITECTURE.md` | ↪ ecommerce | ↪ ecommerce | ↪ ecommerce | `08-builder/prototype/` | ↪ ecommerce | ↪ ecommerce |

---

## Deep-Dive Documents (not SSOT — link from canonical)

| Module | Deep dive | Links from |
|--------|-----------|------------|
| ecommerce | `ECOMMERCE_STOREFRONT_ARCHITECTURE.md` | Architecture §8 |
| ecommerce | `URL_SLUG_ARCHITECTURE.md` | Architecture §8 |
| ecommerce | `{area}/ARCHITECTURE.md` (12 sub-areas) | UI.md · README |
| hr-payroll | `HR_FIGMA_WIREFRAME_BLUEPRINT.md` | UI.md |
| hr-payroll | `HR_DATABASE_ERD_PLANNING.md` | Database.md |
| builder | `08-builder/prototype/*.md` | builder/ARCHITECTURE.md |
| all ERP | `04-uiux/prototype/{module}/` | UI.md |

---

## Stub Redirects (post-normalization)

| Legacy file | Redirect to |
|-------------|-------------|
| `CRM_MODULE_ARCHITECTURE.md` | `Architecture.md` |
| `SALES_MODULE_ARCHITECTURE.md` | `Architecture.md` |
| `SALES_WORKFLOW.md` | `Workflow.md` |
| `ENTITY_SALES.md` | `Database.md` |
| `PURCHASE_MODULE_ARCHITECTURE.md` | `Architecture.md` |
| `PURCHASE_WORKFLOW.md` | `Workflow.md` |
| `ENTITY_PURCHASE.md` | `Database.md` |
| `INVENTORY_MODULE_ARCHITECTURE.md` | `Architecture.md` |
| `INVENTORY_WORKFLOW.md` | `Workflow.md` |
| `ENTITY_INVENTORY.md` | `Database.md` |
| `FINANCE_MODULE_ARCHITECTURE.md` | `Architecture.md` |
| `MARKETING_MODULE_ARCHITECTURE.md` | `Architecture.md` |
| `HR_*_ARCHITECTURE.md` (16 files) | Matching canonical/deep-dive |
| `accounting/Architecture.md` | `../finance/Architecture.md` |

---

## Read Path by Task (normalized)

| Task | Read |
|------|------|
| Any module work | `{module}/README.md` |
| Architecture / boundaries | `{module}/Architecture.md` |
| Schema / tables | `{module}/Database.md` |
| REST endpoints | `{module}/API.md` |
| Events / workflows | `{module}/Workflow.md` |
| Admin screens | `{module}/UI.md` → one Menu or prototype guide |
| AI tools | `{module}/AI.md` |
| Reports | `{module}/Reports.md` |
| SEO screens | `ecommerce/seo/README.md` → one `Menus/SEO/` screen |
| Builder tools | `ecommerce/builder/README.md` → `08-builder/prototype/{Tool}.md` |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Initial module SSOT matrix (Step 05) |

---

**Module SSOT Matrix** — one owner per cell, no duplicate truth.
