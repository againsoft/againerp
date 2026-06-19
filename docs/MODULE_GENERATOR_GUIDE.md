# AgainERP — Module Generator Guide

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 06.5 — Module Generator System  
> **Authority:** [STANDARD_MODULE_TEMPLATE.md](./STANDARD_MODULE_TEMPLATE.md) · [MODULE_PACKAGE_ROADMAP.md](./MODULE_PACKAGE_ROADMAP.md) · [MODULE_SSOT_MATRIX.md](./MODULE_SSOT_MATRIX.md)

---

## Purpose

Enterprise framework for creating **new business module documentation packages** from canonical templates. All future modules **must** be generated from templates — no ad-hoc file structures.

## When To Read

Read before creating a new module under `docs/03-business-modules/` or normalizing an existing module to the 11-file package.

## Related Files

- [Templates folder](./00-foundation/templates/) — 11 `_MODULE_*_TEMPLATE.md` files
- [NEW_MODULE_CHECKLIST.md](./NEW_MODULE_CHECKLIST.md) — step-by-step gate checklist
- [AI Reading Policy](./BRAIN.md#ai-reading-policy) — agent navigation rules
- [Reference implementation](./03-business-modules/ecommerce/) — ecommerce 11/11 package

## Read Next

[NEW_MODULE_CHECKLIST.md](./NEW_MODULE_CHECKLIST.md)

---

## 1. How New Modules Are Created

### 1.1 Prerequisites

| Gate | Requirement |
|------|-------------|
| **Governance** | Module listed or approved in [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) |
| **Dependencies** | Row added to [MODULE_DEPENDENCY_MAP.md](./01-architecture/MODULE_DEPENDENCY_MAP.md) |
| **Docs Ready** | [PRE_CODE_GATE.md](./00-foundation/PRE_CODE_GATE.md) — documentation before code |

### 1.2 Generation workflow

```text
1. Define module identity (ID, route, prefix, layer, team)
2. Copy all 11 templates → docs/03-business-modules/{module}/
3. Rename: _MODULE_*_TEMPLATE.md → canonical filenames (see §3)
4. Replace placeholders (see §4)
5. Create Menus/ skeleton (empty or from screen inventory)
6. Complete NEW_MODULE_CHECKLIST.md
7. Register in MODULE_REGISTRY.md
8. Log in module CHANGELOG.md + 00-foundation/CHANGELOG.md
```

### 1.3 Copy command (manual)

```bash
MODULE=crm                    # lowercase ID
DISPLAY=CRM                   # display name — for your notes only
DEST="docs/03-business-modules/${MODULE}"
TPL="docs/00-foundation/templates"

mkdir -p "${DEST}/Menus"

cp "${TPL}/_MODULE_README_TEMPLATE.md"       "${DEST}/README.md"
cp "${TPL}/_MODULE_ARCHITECTURE_TEMPLATE.md" "${DEST}/Architecture.md"
cp "${TPL}/_MODULE_MANIFEST_TEMPLATE.md"     "${DEST}/ModuleManifest.md"
cp "${TPL}/_MODULE_DATABASE_TEMPLATE.md"       "${DEST}/Database.md"
cp "${TPL}/_MODULE_API_TEMPLATE.md"            "${DEST}/API.md"
cp "${TPL}/_MODULE_WORKFLOW_TEMPLATE.md"       "${DEST}/Workflow.md"
cp "${TPL}/_MODULE_PERMISSIONS_TEMPLATE.md"  "${DEST}/Permissions.md"
cp "${TPL}/_MODULE_UI_TEMPLATE.md"             "${DEST}/UI.md"
cp "${TPL}/_MODULE_AI_TEMPLATE.md"             "${DEST}/AI.md"
cp "${TPL}/_MODULE_REPORTS_TEMPLATE.md"        "${DEST}/Reports.md"
cp "${TPL}/_MODULE_CHANGELOG_TEMPLATE.md"      "${DEST}/CHANGELOG.md"
```

Then replace placeholders (§4) in all 11 files.

### 1.4 Normalizing existing modules

For modules with legacy `*_MODULE_ARCHITECTURE.md` files:

1. Generate package from templates if files missing
2. **Move** legacy content into canonical files — do not rewrite
3. Stub legacy files with redirect banner → canonical SSOT
4. Follow [MODULE_PACKAGE_ROADMAP.md §1.4](./MODULE_PACKAGE_ROADMAP.md#14-normalization-workflow-per-module)

**Rule:** Templates are for **structure**; existing prose is preserved during normalization.

### 1.5 Sub-areas (doc views only)

Parent module owns the 11-file package. Sub-areas (e.g. `ecommerce/seo`) get **reduced package**:

```text
03-business-modules/{parent}/{area}/
├── README.md           ← sub-area entry (link to parent package)
└── ARCHITECTURE.md     ← area deep dive (10-section variant, scoped)
    Menus/{Area}/       ← screen SSOT
```

Sub-areas **do not** duplicate Database, API, Workflow, AI, Reports — link to parent Level 5 files.

---

## 2. Required Package Structure

### 2.1 Full module (11 files)

```text
docs/03-business-modules/{module}/
├── README.md              ← Level 3 — Documentation Map
├── Architecture.md        ← Level 4 — 10-section SSOT
├── ModuleManifest.md      ← Install registry
├── Database.md            ← Level 5 — schema SSOT
├── API.md                 ← Level 5 — REST SSOT
├── Workflow.md            ← Level 5 — state machines SSOT
├── Permissions.md         ← Level 5 — RBAC SSOT
├── UI.md                  ← Level 5 — navigation SSOT
├── AI.md                  ← Level 5 — AI tools index
├── Reports.md             ← Level 5 — reports index
├── CHANGELOG.md           ← Doc change log
└── Menus/                 ← Screen specs (one file per screen)
    └── {Group}/
        └── {Screen}.md
```

### 2.2 Optional files (not counted in 11)

| File | When |
|------|------|
| `MENU_STRUCTURE.md` | >20 screens — full menu tree |
| `Roadmap.md` | Module-specific roadmap |
| `Development.md` | Implementation notes |
| `{MODULE}_*.md` deep dives | Linked from Architecture — not SSOT |
| `reports/ARCHITECTURE.md` | Complex report engine sub-area |

### 2.3 Quality gates

| Gate | Criteria |
|------|----------|
| **G1** | Architecture.md has all 10 sections per [STANDARD_MODULE_TEMPLATE.md](./STANDARD_MODULE_TEMPLATE.md) |
| **G2** | No duplicate SSOT — one owner per concern ([MODULE_SSOT_MATRIX.md](./MODULE_SSOT_MATRIX.md)) |
| **G3** | 11/11 files exist |
| **G4** | Tables extracted to Database/API/Workflow — Architecture summarizes + links |
| **G5** | README Documentation Map links resolve |
| **G6** | MODULE_REGISTRY synced |

---

## 3. Naming Conventions

### 3.1 Module identity

| Field | Convention | Example |
|-------|------------|---------|
| **Module ID** | lowercase kebab or single word | `crm`, `hr-payroll`, `product-configurator` |
| **Folder** | same as Module ID | `docs/03-business-modules/crm/` |
| **Display name** | Title Case | CRM, HR & Payroll |
| **Route namespace** | lowercase, often = ID | `/crm/*`, `/catalog/*` (ecommerce) |
| **API path** | `/api/v1/{module}/` | `/api/v1/crm/` |
| **Table prefix** | `{module}_` or domain prefix | `crm_`, `catalog_` |
| **Permission namespace** | `{module}.*` | `crm.lead.view` |
| **Event prefix** | `{module}.` | `crm.lead.created` |

### 3.2 File names

| File | Casing | Notes |
|------|--------|-------|
| `README.md` | UPPER | Level 3 entry only |
| `Architecture.md` | PascalCase | Canonical — not `ARCHITECTURE.md` at module root |
| `ModuleManifest.md` | PascalCase | |
| `Database.md` · `API.md` · etc. | PascalCase | Level 5 slices |
| `Menus/{Group}/{Screen}.md` | Title Case with spaces | Match admin menu labels |
| Sub-area | `ARCHITECTURE.md` | UPPER inside sub-folder only |

### 3.3 Template → output mapping

| Template | Output file |
|----------|-------------|
| `_MODULE_README_TEMPLATE.md` | `README.md` |
| `_MODULE_ARCHITECTURE_TEMPLATE.md` | `Architecture.md` |
| `_MODULE_MANIFEST_TEMPLATE.md` | `ModuleManifest.md` |
| `_MODULE_DATABASE_TEMPLATE.md` | `Database.md` |
| `_MODULE_API_TEMPLATE.md` | `API.md` |
| `_MODULE_WORKFLOW_TEMPLATE.md` | `Workflow.md` |
| `_MODULE_PERMISSIONS_TEMPLATE.md` | `Permissions.md` |
| `_MODULE_UI_TEMPLATE.md` | `UI.md` |
| `_MODULE_AI_TEMPLATE.md` | `AI.md` |
| `_MODULE_REPORTS_TEMPLATE.md` | `Reports.md` |
| `_MODULE_CHANGELOG_TEMPLATE.md` | `CHANGELOG.md` |

### 3.4 Placeholders

Replace in **all 11 files** after copy:

| Placeholder | Replace with | Example |
|-------------|--------------|---------|
| `{Module}` | Display name | CRM |
| `{module}` | Module ID | crm |
| `{route}` | Route segment | crm |
| `{prefix}` | Table prefix | crm |
| `{api_path}` | API base (trailing slash) | `/api/v1/crm/` |
| `{layer}` | Layer enum | erp |
| `{team}` | Owner team | CRM Team |
| `{DATE}` | ISO date | 2026-06-19 |

---

## 4. SSOT Rules

One canonical owner per concern — no duplicate truth across files.

| Concern | SSOT file | Architecture role |
|---------|-----------|-------------------|
| Boundaries & integration | `Architecture.md` | **Owner** — 10 sections |
| Schema & tables | `Database.md` | §4 summary + link |
| REST & services | `API.md` | §5 summary + link |
| State machines & events | `Workflow.md` | §3/§6 summary + link |
| RBAC | `Permissions.md` | §7 summary + link |
| Admin navigation | `UI.md` + one `Menus/*.md` | §8 summary + link |
| AI tools | `AI.md` + one `Menus/AI/*.md` | §9 summary + link |
| Reports | `Reports.md` + one `Menus/Reports/*.md` | index + link |
| Install & deps | `ModuleManifest.md` | metadata registry |
| Doc changes | `CHANGELOG.md` | module doc history |
| Module entry | `README.md` | Documentation Map only |

### 4.1 Anti-patterns

```text
❌ Full API table in Architecture.md AND API.md
❌ Creating CRM_MODULE_ARCHITECTURE.md alongside Architecture.md
❌ Sub-area with its own Database.md (use parent)
❌ Bulk-copying Menus content into UI.md
❌ Deep dive files as SSOT without link from Architecture
```

### 4.2 Deep dives (not SSOT)

Legacy or feature-specific architecture files remain as **deep dives** linked from `Architecture.md` or `UI.md`:

- `{MODULE}_STOREFRONT_ARCHITECTURE.md`
- `URL_SLUG_ARCHITECTURE.md`
- `{area}/ARCHITECTURE.md`
- `reports/ARCHITECTURE.md`

---

## 5. AI Navigation Rules

Agents and developers follow [BRAIN.md § AI Reading Policy](./BRAIN.md#ai-reading-policy):

```text
Level 1  BRAIN.md
Level 2  PROJECT_MAP · ARCHITECTURE_DECISIONS · MODULE_REGISTRY   (pick ONE)
Level 3  {module}/README.md
Level 4  Architecture.md
Level 5  Database · API · Workflow · UI · AI · Reports            (pick ONE)
         Deep dives · Menus/{one screen} · code                   (if Level 5 insufficient)
```

### 5.1 README Documentation Map rules

Every `README.md` generated from template **must**:

| Rule | Detail |
|------|--------|
| **Task-scoped rows** | Each row says *when* to open the file |
| **Level labels** | Mark Architecture as Level 4; slices as Level 5 |
| **One file guidance** | "open ONE linked screen spec" for AI, Reports, Menus |
| **No folder scan** | Explicit "do not scan module folder" in When To Read |

### 5.2 Forbidden files for agents

Unless explicitly requested:

- `MASTER_INDEX.md`
- `MASTER_DOCUMENT_MAP.md`
- `API_REGISTRY.md`
- `DATABASE_REGISTRY.md`
- `SERVICE_REGISTRY.md`

### 5.3 Menus discipline

| Rule | Detail |
|------|--------|
| Screen SSOT | One `Menus/{Group}/{Screen}.md` per admin screen |
| Open one | Never bulk-read `Menus/` |
| Index only | `UI.md`, `AI.md`, `Reports.md` link to screens — no field duplication |

---

## 6. Template Library

| Template | Purpose |
|----------|---------|
| [_MODULE_README_TEMPLATE.md](./00-foundation/templates/_MODULE_README_TEMPLATE.md) | Level 3 entry + Documentation Map |
| [_MODULE_ARCHITECTURE_TEMPLATE.md](./00-foundation/templates/_MODULE_ARCHITECTURE_TEMPLATE.md) | Level 4 — 10-section architecture |
| [_MODULE_MANIFEST_TEMPLATE.md](./00-foundation/templates/_MODULE_MANIFEST_TEMPLATE.md) | Install registry |
| [_MODULE_DATABASE_TEMPLATE.md](./00-foundation/templates/_MODULE_DATABASE_TEMPLATE.md) | Schema SSOT |
| [_MODULE_API_TEMPLATE.md](./00-foundation/templates/_MODULE_API_TEMPLATE.md) | REST SSOT |
| [_MODULE_WORKFLOW_TEMPLATE.md](./00-foundation/templates/_MODULE_WORKFLOW_TEMPLATE.md) | Workflows SSOT |
| [_MODULE_PERMISSIONS_TEMPLATE.md](./00-foundation/templates/_MODULE_PERMISSIONS_TEMPLATE.md) | RBAC SSOT |
| [_MODULE_UI_TEMPLATE.md](./00-foundation/templates/_MODULE_UI_TEMPLATE.md) | Navigation SSOT |
| [_MODULE_AI_TEMPLATE.md](./00-foundation/templates/_MODULE_AI_TEMPLATE.md) | AI tools index |
| [_MODULE_REPORTS_TEMPLATE.md](./00-foundation/templates/_MODULE_REPORTS_TEMPLATE.md) | Reports index |
| [_MODULE_CHANGELOG_TEMPLATE.md](./00-foundation/templates/_MODULE_CHANGELOG_TEMPLATE.md) | Doc changelog |

**Deprecated:** `_MODULE_TEMPLATE.md` — use split templates above.

---

## 7. Registry & Roadmap Updates

After generating a module:

| Location | Action |
|----------|--------|
| [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | Add row · status · package score |
| [MODULE_DEPENDENCY_MAP.md](./01-architecture/MODULE_DEPENDENCY_MAP.md) | Declare deps |
| [MODULE_SSOT_MATRIX.md](./MODULE_SSOT_MATRIX.md) | Update current state row |
| [MODULE_PACKAGE_ROADMAP.md](./MODULE_PACKAGE_ROADMAP.md) | Mark phase complete |
| [00-foundation/CHANGELOG.md](./00-foundation/CHANGELOG.md) | Platform-level entry |

---

## 8. Reference Implementations

| Module | Status | Use for |
|--------|--------|---------|
| [ecommerce](./03-business-modules/ecommerce/) | 11/11 Active | Full package · AI.md · Reports.md · sub-areas |
| [crm](./03-business-modules/crm/) | Legacy merge pending | Rich legacy content mapping |
| [business-partners](./03-business-modules/business-partners/) | Partial | Thin Architecture expansion |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 06.5 — module generator system |

---

**Module Generator Guide** — templates only, one SSOT per concern, AI Reading Policy enforced.
