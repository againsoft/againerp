# AgainERP — Documentation Governance Rules

> **Core Principle:** Documentation is the source of truth. Code must always follow documentation.

No feature may be created, edited, or deleted without updating documentation first.

---

## Mandatory Governance Files (System-Critical)

These root-level files **must always exist** and **must stay updated**:

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Project entry point |
| [MASTER_INDEX.md](./MASTER_INDEX.md) | Master table of contents |
| [PROJECT_MAP.md](./PROJECT_MAP.md) | Visual architecture blueprint |
| [DOCUMENT_REGISTRY.md](./DOCUMENT_REGISTRY.md) | All documents |
| [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | All modules |
| [PAGE_REGISTRY.md](./PAGE_REGISTRY.md) | All pages |
| [DATABASE_REGISTRY.md](./DATABASE_REGISTRY.md) | Database assets |
| [API_REGISTRY.md](./API_REGISTRY.md) | API catalog |
| [WORKFLOW_REGISTRY.md](./WORKFLOW_REGISTRY.md) | Workflows |
| [AI_KNOWLEDGE_INDEX.md](./AI_KNOWLEDGE_INDEX.md) | AI knowledge graph |
| [CHANGELOG.md](./CHANGELOG.md) | Change history |
| [ADR_INDEX.md](./ADR_INDEX.md) | Architecture decisions |
| [TRACEABILITY_MATRIX.md](./TRACEABILITY_MATRIX.md) | **Traceability Matrix** — requirements → registries (v2.0) |
| [DOCUMENTATION_HEALTH_REPORT.md](./DOCUMENTATION_HEALTH_REPORT.md) | Doc quality dashboard |
| [TECHNOLOGY_CONSTITUTION.md](./TECHNOLOGY_CONSTITUTION.md) | **Official technology stack** — supersedes conflicting choices |
| [PRE_CODE_GATE.md](./PRE_CODE_GATE.md) | **Before any code** — mandatory 6-step review |

**Regenerate inventories:** `python3 docs/scripts/generate-governance-registries.py`

**Technology rule:** No stack change without updating [TECHNOLOGY_CONSTITUTION.md](./TECHNOLOGY_CONSTITUTION.md) and [ADR_INDEX.md](./ADR_INDEX.md).

---

## Registration Rules

Every new document must:

1. Be registered in [DOCUMENT_REGISTRY.md](./DOCUMENT_REGISTRY.md)
2. Be indexed in [MASTER_INDEX.md](./MASTER_INDEX.md)
3. Have an owner and version
4. List dependencies and related documents
5. Have a [CHANGELOG.md](./CHANGELOG.md) entry

---

## AI Agent Rules

Chief AI Agent and all AI agents **must** use these entry points before other documentation:

1. [README.md](./README.md)
2. [MASTER_INDEX.md](./MASTER_INDEX.md)
3. [PROJECT_MAP.md](./PROJECT_MAP.md)
4. [AI_KNOWLEDGE_INDEX.md](./AI_KNOWLEDGE_INDEX.md)
5. [TECHNOLOGY_CONSTITUTION.md](./TECHNOLOGY_CONSTITUTION.md)

These files form the **root knowledge layer** of AgainERP. AI must not access module docs without traversing this layer. All generated code must conform to the Technology Constitution.

---

## Pre-Code Gate (Mandatory)

**Before writing any code**, complete [PRE_CODE_GATE.md](./PRE_CODE_GATE.md):

1. Review [Technology Constitution](./TECHNOLOGY_CONSTITUTION.md)
2. Review Architecture documents
3. Review Database documents
4. Review API standards
5. Review UI standards
6. Review AI OS standards

**If documentation is missing → STOP.** Generate missing documentation first.  
**Never start coding without approved documentation** (Status: **Ready**).

Checklist: [_PRE_CODE_GATE_CHECKLIST.md](./_PRE_CODE_GATE_CHECKLIST.md)

---

## Documentation First Workflow

Every task **must** follow this order. Skipping a step is not permitted.

| Step | Action | Owner |
|------|--------|-------|
| **0** | **Pre-Code Gate** — 6 mandatory reviews | Developer / AI Agent |
| **1** | Update Documentation | Author |
| **2** | Review Documentation | Reviewer / Architect |
| **3** | Approve Documentation (Status: **Ready**) | Product Owner / Architect |
| **4** | Generate Development Tasks | Tech Lead |
| **5** | Write Code | Developer |
| **6** | Update Architecture References | Developer / Architect |
| **7** | Update Changelog | Developer |

```
Pre-Code Gate → Docs Update → Review → Approve (Ready) → Dev Tasks → Code → Arch Refs → Changelog
```

Code written before Step 3 approval must be rejected.  
Code written before Pre-Code Gate passes must be rejected.

---

## Mandatory Update Rule

Whenever **any** of the following occurs, related documentation must be updated **before or with** the change — never after the fact alone:

| Trigger | Required Updates |
|---------|------------------|
| New Module Added | All module files, `ModuleManifest.md`, `MODULE_DEPENDENCY_MAP.md`, `CHANGELOG.md` |
| Module Deleted | All above + deprecation notes in affected modules |
| Menu Added / Deleted | `UI.md`, `ModuleManifest.md`, new/deleted `Menus/*.md`, `CHANGELOG.md` |
| Page Added / Deleted | Screen doc, `UI.md`, `ModuleManifest.md`, `CHANGELOG.md` |
| Database Table Added / Modified / Deleted | `Database.md`, affected screen docs, `ModuleManifest.md`, `MODULE_DEPENDENCY_MAP.md`, `CHANGELOG.md` |
| API Added / Modified / Deleted | `API.md`, affected screen docs, `ModuleManifest.md`, `CHANGELOG.md` |
| Permission Added | `Permissions.md`, affected screen docs, `ModuleManifest.md`, `CHANGELOG.md` |
| Workflow Changed | `Workflow.md`, affected screen docs, `CHANGELOG.md` |
| Business Logic Changed | `Architecture.md`, `Workflow.md`, affected screen docs, `CHANGELOG.md` |

---

## Required Files To Update

On every governed change, update **all applicable** files from this list:

| File | Location | When |
|------|----------|------|
| `Architecture.md` | `modules/{module}/` | Boundaries, integrations, logic changes |
| `Database.md` | `modules/{module}/` | Schema changes |
| `API.md` | `modules/{module}/` | Endpoint changes |
| `Workflow.md` | `modules/{module}/` | Process / state changes |
| `Permissions.md` | `modules/{module}/` | Access control changes |
| `Development.md` | `modules/{module}/` | Setup, conventions, task notes |
| `Roadmap.md` | `modules/{module}/` | Scope or phase changes |
| `Reports.md` | `modules/{module}/` | Report / export changes |
| `AI.md` | `modules/{module}/` | AI tools, agents, credit changes |
| `ModuleManifest.md` | `modules/{module}/` | Any structural change |
| `CHANGELOG.md` | `modules/{module}/` or `docs/` | Every change |
| `MODULE_DEPENDENCY_MAP.md` | `docs/` | Cross-module dependency changes (master) |
| `DependencyMap.md` | `docs/` | Dependency quick reference |

Screen-level changes also require the specific `Menus/{Screen}.md` file.

---

## Change Impact Analysis

Before implementing any change, complete a [Change Impact Analysis](./_CHANGE_IMPACT_TEMPLATE.md).

Required outputs:

1. **Affected Modules** — which modules are touched directly or indirectly
2. **Affected Menus** — which admin screens change
3. **Affected APIs** — which endpoints change
4. **Affected Database Tables** — which tables/columns change
5. **Affected Permissions** — which roles/ACL rules change
6. **Affected Workflows** — which state machines or automations change

Only proceed after impact is documented and reviewed.

---

## Architecture Synchronization Rule

Every development task must verify **Current Documentation vs Current Code**.

If a mismatch exists:

```
STOP DEVELOPMENT
```

Generate an [Architecture Sync Report](./_ARCHITECTURE_SYNC_REPORT_TEMPLATE.md) that:

- Lists all mismatches (doc says X, code does Y)
- Identifies which file(s) are out of sync
- Recommends corrections (update docs or fix code)
- Assigns owner and priority

No merge until sync report is resolved.

---

## Changelog System

Every change must create an entry in [CHANGELOG.md](./CHANGELOG.md).

Required fields per entry:

| Field | Description |
|-------|-------------|
| Date | `YYYY-MM-DD` |
| Version | Semver or sprint tag |
| Module | Module name or `Core` / `Platform` |
| Change Type | `Added` · `Modified` · `Deleted` |
| Reason | Why the change was made |
| Impact | What modules, users, or systems are affected |
| Developer Notes | Implementation hints, migration notes |

---

## Module Manifest Rule

Every module must contain `ModuleManifest.md` — a single index of everything the module owns.

See [\_MODULE\_MANIFEST\_TEMPLATE.md](./_MODULE_MANIFEST_TEMPLATE.md).

Contents: Module Name, Version, Dependencies, Menus, Pages, Database Tables, API Endpoints, Permissions, Workflows, Reports, Last Updated.

The manifest is updated on **every** structural change. It is the quickest way to audit module completeness.

---

## Dependency Map Rule

Maintain [MODULE_DEPENDENCY_MAP.md](./MODULE_DEPENDENCY_MAP.md) at the platform level.

Whenever a cross-module dependency is added, removed, or changed — update the map immediately.

Example:

```
Ecommerce → Inventory
Ecommerce → Sales
Sales → Inventory
Inventory → Accounting
Accounting → Reports
```

---

## Documentation Validation Rule

Before any commit, complete the [Pre-Commit Checklist](./_COMMIT_CHECKLIST.md).

Verify:

- [ ] Documentation Updated
- [ ] Architecture Updated
- [ ] Database Updated
- [ ] API Updated
- [ ] Permissions Updated
- [ ] Workflow Updated
- [ ] Changelog Updated
- [ ] Dependency Map Updated
- [ ] Module Manifest Updated

**If any item is missing → reject the implementation.**

---

## AI Architect Mode

When working with AI assistance on AgainERP, the AI acts as **Architecture Guardian**.

The AI must continuously monitor:

- Documentation completeness and accuracy
- Database design consistency
- API structure and naming
- Module dependencies
- Workflow design integrity

Whenever changes are detected, the AI must:

1. Recommend which documentation files need updating
2. Flag architecture drift between docs and code
3. Refuse to write code that contradicts approved documentation
4. Proactively suggest `CHANGELOG.md` and `MODULE_DEPENDENCY_MAP.md` updates

**Never allow architecture drift. Documentation and code must remain synchronized at all times.**

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md) | Global dev standards (mobile, API, DB, security) |
| [DOCUMENTATION_STANDARD.md](./DOCUMENTATION_STANDARD.md) | Section templates and status labels |
| [FILE_NAMING_STANDARD.md](./FILE_NAMING_STANDARD.md) | Naming conventions |
| [MODULE_STRUCTURE.md](./MODULE_STRUCTURE.md) | Module folder layout |
| [CHANGELOG.md](./CHANGELOG.md) | Change history |
| [MODULE_DEPENDENCY_MAP.md](./MODULE_DEPENDENCY_MAP.md) | Cross-module dependencies (master) |
| [DependencyMap.md](./DependencyMap.md) | Dependency quick reference |
| [\_COMMIT_CHECKLIST.md](./_COMMIT_CHECKLIST.md) | Pre-commit validation |
| [\_CHANGE_IMPACT_TEMPLATE.md](./_CHANGE_IMPACT_TEMPLATE.md) | Impact analysis template |
| [\_ARCHITECTURE_SYNC_REPORT_TEMPLATE.md](./_ARCHITECTURE_SYNC_REPORT_TEMPLATE.md) | Drift report template |

---

**Platform:** AgainERP  
**Last Updated:** 2026-06-12  
**Status:** Active
