# AgainERP — Pre-Code Gate

> **Status:** **Mandatory** — No exceptions  
> **Authority:** [GOVERNANCE.md](./GOVERNANCE.md) · [TECHNOLOGY_CONSTITUTION.md](./TECHNOLOGY_CONSTITUTION.md)

**Before writing any code**, every developer and AI agent must complete this gate.

If documentation is missing or not approved → **STOP**. Generate or approve documentation first.

**Never start coding without approved documentation.**

---

## Gate Rule

```
┌─────────────────────────────────────────────────────────┐
│  IF any required doc is missing OR Status ≠ Ready       │
│  THEN STOP — do not write code                          │
│  ELSE proceed to implementation                       │
└─────────────────────────────────────────────────────────┘
```

Approved means: **Status: Ready** on all affected documents + stakeholder sign-off per [GOVERNANCE.md](./GOVERNANCE.md).

---

## Mandatory Review Sequence

Complete **in order**. Do not skip steps.

### Step 1 — Technology Constitution

| Review | Document |
|--------|----------|
| Official stack | [TECHNOLOGY_CONSTITUTION.md](./TECHNOLOGY_CONSTITUTION.md) |
| ADRs | [ADR_INDEX.md](./ADR_INDEX.md) |
| Dev standards | [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md) |

**Verify:** Next.js, FastAPI, PostgreSQL, Redis, Meilisearch, LangGraph — no conflicting tech.

**STOP if:** Constitution not read, or proposed code uses non-ratified technology.

---

### Step 2 — Architecture Documents

| Review | Document |
|--------|----------|
| Project map | [PROJECT_MAP.md](./PROJECT_MAP.md) |
| Platform blueprint | [MASTER_MODULE_ARCHITECTURE.md](./MASTER_MODULE_ARCHITECTURE.md) |
| Module framework | [UNIVERSAL_MODULE_FRAMEWORK.md](./UNIVERSAL_MODULE_FRAMEWORK.md) |
| Core | [core/ARCHITECTURE.md](./core/ARCHITECTURE.md) |
| Hybrid licensed ERP | [HYBRID_LICENSED_ERP_ARCHITECTURE.md](./HYBRID_LICENSED_ERP_ARCHITECTURE.md) |
| SaaS | [SAAS_PLATFORM_ARCHITECTURE.md](./SAAS_PLATFORM_ARCHITECTURE.md) |
| **Module** | `docs/modules/{module}/Architecture.md` |
| Dependencies | [MODULE_DEPENDENCY_MAP.md](./MODULE_DEPENDENCY_MAP.md) |
| Traceability | [TRACEABILITY_MATRIX.md](./TRACEABILITY_MATRIX.md) |

**Verify:** Module fits platform layers; no cross-module DB access; services/events/APIs only.

**STOP if:** Module `Architecture.md` missing, Draft-only, or conflicts with platform architecture.

---

### Step 3 — Database Documents

| Review | Document |
|--------|----------|
| Master schema | [database/MASTER_DATABASE_ARCHITECTURE.md](./database/MASTER_DATABASE_ARCHITECTURE.md) |
| Service registry | [SERVICE_REGISTRY.md](./SERVICE_REGISTRY.md) |
| Entity registry | [ENTITY_RELATIONSHIP_REGISTRY.md](./ENTITY_RELATIONSHIP_REGISTRY.md) |
| ER diagram | [database/ER_DIAGRAM.md](./database/ER_DIAGRAM.md) |
| Standards | [database/standards.md](./database/standards.md) |
| Registry | [DATABASE_REGISTRY.md](./DATABASE_REGISTRY.md) |
| **Module** | `docs/modules/{module}/Database.md` |

**Verify:** Table prefix ownership; `company_id` / `tenant_id`; Core FK rules; no cross-module tables.

**STOP if:** Tables used in code are not documented in `Database.md` + `DATABASE_REGISTRY.md`.

---

### Step 4 — API Standards

| Review | Document |
|--------|----------|
| Global standards | [api/README.md](./api/README.md) · [api/architecture.md](./api/architecture.md) |
| Core API | [core/API.md](./core/API.md) |
| Registry | [API_REGISTRY.md](./API_REGISTRY.md) — architecture & domain operations |
| Constitution § API | [TECHNOLOGY_CONSTITUTION.md#api-standards](./TECHNOLOGY_CONSTITUTION.md) |
| **Module** | `docs/modules/{module}/API.md` |

**Verify:** `/api/v1/` versioning; JWT + RBAC; pagination; error envelope; no direct SQL from UI.

**STOP if:** Operations not in `API.md` + `API_REGISTRY.md`, or permissions undefined.

---

### Step 5 — UI Standards

| Review | Document |
|--------|----------|
| Enterprise UI | [ui-ux/ENTERPRISE_UI_ARCHITECTURE.md](./ui-ux/ENTERPRISE_UI_ARCHITECTURE.md) |
| Smart interactions | [ui-ux/UX_SMART_INTERACTION_STANDARDS.md](./ui-ux/UX_SMART_INTERACTION_STANDARDS.md) |
| Design standards | [ui-ux/UI_UX_DESIGN_STANDARDS.md](./ui-ux/UI_UX_DESIGN_STANDARDS.md) |
| Design system | [ui-ux/design-system.md](./ui-ux/design-system.md) |
| UI prototype gate | [UI_PROTOTYPE_STRATEGY.md](./UI_PROTOTYPE_STRATEGY.md) |
| **Module** | `docs/modules/{module}/UI.md` |
| **Screens** | `docs/modules/{module}/Menus/{Screen}.md` |

**Verify:** 60/20/10/10 formula; CMDK, AG Grid, dark mode; no business logic in UI; screen doc exists per page.

**STOP if:** Screen has no `Menus/*.md` spec, or UI docs are template-only without Ready approval.

---

### Step 6 — AI OS Standards

| Review | Document |
|--------|----------|
| AI knowledge entry | [AI_KNOWLEDGE_INDEX.md](./AI_KNOWLEDGE_INDEX.md) |
| AI OS experience (vision & UX) | [ai_os/README.md](./ai_os/README.md) |
| AI OS architecture | [modules/ai/AI_OS_ARCHITECTURE.md](./modules/ai/AI_OS_ARCHITECTURE.md) |
| AI-first rules | [modules/ai/AI_FIRST_ARCHITECTURE.md](./modules/ai/AI_FIRST_ARCHITECTURE.md) |
| Audit & approval | [modules/ai/AI_AUDIT_AND_APPROVAL.md](./modules/ai/AI_AUDIT_AND_APPROVAL.md) |
| Context engine | [modules/ai/AI_CONTEXT_ENGINE.md](./modules/ai/AI_CONTEXT_ENGINE.md) |
| Constitution § AI | [TECHNOLOGY_CONSTITUTION.md#ai-architecture-rules](./TECHNOLOGY_CONSTITUTION.md) |
| **Module** | `docs/modules/{module}/AI.md` |

**Verify:** AI uses tools/APIs only; no direct DB; tools registered; risk tier + approval documented.

**STOP if:** AI feature has no `AI.md` tool definition, or bypasses permission/audit layer.

---

## Supporting Documents (Always)

| Document | When |
|----------|------|
| [PROJECT_BRAIN.md](./PROJECT_BRAIN.md) | **Always first** — before any implementation |
| [README.md](./README.md) | Project context |
| [MASTER_INDEX.md](./MASTER_INDEX.md) | Navigation |
| [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | Module scope |
| [PAGE_REGISTRY.md](./PAGE_REGISTRY.md) | Page scope |
| [ModuleManifest.md](./modules/ecommerce/ModuleManifest.md) | Module index pattern |
| [Workflow.md](./modules/ecommerce/Workflow.md) | State machines |
| [Permissions.md](./modules/ecommerce/Permissions.md) | ACL keys |
| [_PRE_CODE_GATE_CHECKLIST.md](./_PRE_CODE_GATE_CHECKLIST.md) | Fillable gate form |

---

## STOP Protocol

When documentation is missing:

| Step | Action |
|------|--------|
| 1 | **STOP** — do not write application code |
| 2 | Identify missing document(s) from checklist below |
| 3 | Create or complete documentation |
| 4 | Register in [DOCUMENT_REGISTRY.md](./DOCUMENT_REGISTRY.md) |
| 5 | Update [MASTER_INDEX.md](./MASTER_INDEX.md) + [CHANGELOG.md](./CHANGELOG.md) |
| 6 | Submit for review |
| 7 | Obtain **Ready** status + sign-off |
| 8 | Re-run Pre-Code Gate |
| 9 | Only then begin implementation |

---

## UI Prototype Mode Exception

When work is **UI/UX prototype only** per [UI_PROTOTYPE_MODE.md](./UI_PROTOTYPE_MODE.md):

| Gate step | Required for prototype UI? |
|-----------|----------------------------|
| Technology Constitution (frontend stack) | **Yes** |
| Architecture (read shell + module scope) | **Yes** |
| Database docs Ready | **No** |
| API docs Ready | **No** |
| UI standards | **Yes** |
| AI OS (mock UI only) | **Yes** |
| Tri-file: `{Page}.md` + `Review` + `Changes` | **Yes** |

**Allowed:** Next.js in `apps/web/` with mocked JSON.  
**Forbidden:** Backend, database, real APIs, live AI.

Backend production starts after [ui-prototype/PRODUCTION_READINESS.md](./ui-prototype/PRODUCTION_READINESS.md).

---

## Minimum Documentation for Code

Per feature or module slice:

| Artifact | Required | Status |
|----------|----------|--------|
| `Architecture.md` | Yes | Ready |
| `Database.md` | If tables touched | Ready |
| `API.md` | If endpoints touched | Ready |
| `Workflow.md` | If states touched | Ready |
| `Permissions.md` | If ACL touched | Ready |
| `Menus/{Screen}.md` | Per UI screen | Ready |
| `AI.md` | If AI tools touched | Ready |
| `ModuleManifest.md` | Any structural change | Ready |
| `CHANGELOG.md` | Every change | Updated |

---

## AI Agent Protocol

Before generating code, AI agents **must**:

1. Read [README.md](./README.md) → [MASTER_INDEX.md](./MASTER_INDEX.md) → [PROJECT_MAP.md](./PROJECT_MAP.md) → [AI_KNOWLEDGE_INDEX.md](./AI_KNOWLEDGE_INDEX.md)
2. Complete all **6 steps** of this Pre-Code Gate
3. Confirm affected docs are **Ready**
4. If any gap → output documentation plan and **STOP** — do not emit production code

---

## Human Developer Protocol

1. Complete [_PRE_CODE_GATE_CHECKLIST.md](./_PRE_CODE_GATE_CHECKLIST.md)
2. Attach to task / PR description
3. Architect or Tech Lead approves gate
4. Implement per [TECHNOLOGY_CONSTITUTION.md](./TECHNOLOGY_CONSTITUTION.md)
5. Pre-commit: [_COMMIT_CHECKLIST.md](./_COMMIT_CHECKLIST.md)

---

## Gate Flow

```
Task Assigned
     ↓
Pre-Code Gate (6 reviews)
     ↓
  Missing docs? ──Yes──► STOP → Write docs → Review → Ready
     │ No
     ↓
Gate Approved
     ↓
Write Code (apps/web, apps/api, apps/ai-os)
     ↓
Pre-Commit Checklist
     ↓
Commit / PR
```

---

**Platform:** AgainERP  
**Last Updated:** 2026-06-12  
**Maintainer:** Platform Architecture Team
