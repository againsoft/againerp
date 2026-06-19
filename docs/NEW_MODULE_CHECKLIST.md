# AgainERP — New Module Checklist

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 06.5 — Module Generator System  
> **Companion:** [MODULE_GENERATOR_GUIDE.md](./MODULE_GENERATOR_GUIDE.md)

---

## Purpose

Gate checklist for creating or normalizing a business module documentation package. Complete **every section** before marking the module Ready in MODULE_REGISTRY.

## When To Read

Use when generating a new module from templates or completing normalization (Steps 06+).

## Related Files

- [Template library](./00-foundation/templates/)
- [MODULE_REGISTRY.md](./MODULE_REGISTRY.md)
- [PRE_CODE_GATE.md](./00-foundation/PRE_CODE_GATE.md)

---

## Module Identity

| Field | Value | Done |
|-------|-------|------|
| Module ID (`{module}`) | | ☐ |
| Display name (`{Module}`) | | ☐ |
| Route namespace (`/{route}/*`) | | ☐ |
| API base (`/api/v1/{module}/`) | | ☐ |
| Table prefix (`{prefix}_*`) | | ☐ |
| Layer (core · platform · erp · commerce · industry · ai) | | ☐ |
| Owner team | | ☐ |

---

## A. Pre-Generation

| # | Task | Done |
|---|------|------|
| A1 | Module approved / listed in MODULE_REGISTRY.md | ☐ |
| A2 | Dependencies declared in MODULE_DEPENDENCY_MAP.md | ☐ |
| A3 | No naming conflict with existing module folder | ☐ |
| A4 | PRE_CODE_GATE.md reviewed — docs before code | ☐ |

---

## B. Package Generation (templates only)

| # | Task | Done |
|---|------|------|
| B1 | Folder created: `docs/03-business-modules/{module}/` | ☐ |
| B2 | All 11 files copied from `00-foundation/templates/` | ☐ |
| B3 | Placeholders replaced in all 11 files | ☐ |
| B4 | `Menus/` folder created (skeleton or screen inventory) | ☐ |
| B5 | No ad-hoc filenames — canonical names only (§3 MODULE_GENERATOR_GUIDE) | ☐ |

### 11-file verification

| File | Exists | Done |
|------|--------|------|
| README.md | ☐ | ☐ |
| Architecture.md | ☐ | ☐ |
| ModuleManifest.md | ☐ | ☐ |
| Database.md | ☐ | ☐ |
| API.md | ☐ | ☐ |
| Workflow.md | ☐ | ☐ |
| Permissions.md | ☐ | ☐ |
| UI.md | ☐ | ☐ |
| AI.md | ☐ | ☐ |
| Reports.md | ☐ | ☐ |
| CHANGELOG.md | ☐ | ☐ |

**Package score:** ___ / 11

---

## C. Architecture (10 sections)

| # | Section | Present in Architecture.md | Done |
|---|---------|--------------------------|------|
| C1 | 1. Overview | ☐ | ☐ |
| C2 | 2. Purpose | ☐ | ☐ |
| C3 | 3. Features | ☐ | ☐ |
| C4 | 4. Data Ownership | ☐ | ☐ |
| C5 | 5. API | ☐ | ☐ |
| C6 | 6. Events | ☐ | ☐ |
| C7 | 7. Permissions | ☐ | ☐ |
| C8 | 8. UIUX | ☐ | ☐ |
| C9 | 9. AI Integration | ☐ | ☐ |
| C10 | 10. Future Scope | ☐ | ☐ |

---

## D. SSOT Compliance

| # | Rule | Done |
|---|------|------|
| D1 | Architecture summarizes — Database/API/Workflow hold detail | ☐ |
| D2 | No duplicate tables across Architecture and Level 5 files | ☐ |
| D3 | Legacy `*_MODULE_ARCHITECTURE.md` stubbed or merged (if applicable) | ☐ |
| D4 | Deep dives linked from Architecture/UI — not standalone SSOT | ☐ |
| D5 | MODULE_SSOT_MATRIX row updated | ☐ |

---

## E. README & Navigation

| # | Task | Done |
|---|------|------|
| E1 | Documentation Map lists all 11 package files | ☐ |
| E2 | Each row has task-scoped "Open when" | ☐ |
| E3 | AI Reading Policy referenced in When To Read | ☐ |
| E4 | Read Next points to Architecture → one Level 5 file | ☐ |
| E5 | Dependencies and Events sections filled | ☐ |

---

## F. AI Navigation

| # | Task | Done |
|---|------|------|
| F1 | README is Level 3 entry — no bypass | ☐ |
| F2 | Architecture is Level 4 — linked before Level 5 slices | ☐ |
| F3 | AI.md and Reports.md are indexes — link to Menus, no duplication | ☐ |
| F4 | UI.md says "open ONE Menus file" | ☐ |
| F5 | No links forcing agents to forbidden registries | ☐ |

---

## G. Registry & Governance

| # | Task | Done |
|---|------|------|
| G1 | MODULE_REGISTRY.md row added/updated with package score | ☐ |
| G2 | ModuleManifest.md package status table = 11/11 | ☐ |
| G3 | CHANGELOG.md initial entry written | ☐ |
| G4 | 00-foundation/CHANGELOG.md platform entry (if new module) | ☐ |
| G5 | Broken links check (<5% in module folder) | ☐ |

---

## H. Sub-Areas (if applicable)

_Skip if module has no doc-view sub-areas._

| # | Task | Done |
|---|------|------|
| H1 | Sub-area folder: `{parent}/{area}/` | ☐ |
| H2 | `README.md` + `ARCHITECTURE.md` only — no full 11-file package | ☐ |
| H3 | Parent UI.md lists sub-area in Sub-Area Doc Views | ☐ |
| H4 | Sub-area README links to parent AI.md / Reports.md | ☐ |

---

## I. Pre-Code Gate (before application code)

| # | Task | Done |
|---|------|------|
| I1 | Architecture.md Status still Draft or Ready per team | ☐ |
| I2 | PRE_CODE_GATE.md checklist complete | ☐ |
| I3 | ModuleManifest.md deps match implementation plan | ☐ |

---

## Sign-Off

| Role | Name | Date | Package |
|------|------|------|---------|
| Doc author | | | /11 |
| Module owner | | | |
| Platform review | | | |

---

## Quick Reference — Copy Command

See [MODULE_GENERATOR_GUIDE.md §1.3](./MODULE_GENERATOR_GUIDE.md#13-copy-command-manual)

---

**New Module Checklist** — complete before registry status → Active.
