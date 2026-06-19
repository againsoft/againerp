# ERP Digital Twin

> **Status:** Draft  
> **Parent:** [AI_OS_ARCHITECTURE.md](./AI_OS_ARCHITECTURE.md)  
> **Phase:** 7 (Scaling Roadmap)

---

## Purpose
AI OS platform architecture and engines.

## When To Read
Read only when working on AI OS platform, agents, tools, or audit.

## Related Files
- [AI OS architecture](AI_OS_ARCHITECTURE.md)
- [Cursor entry](../../../BRAIN.md)

## Read Next
- [AI experience specs](../../experience/README.md)

---

## Purpose

A **live machine-readable model** of AgainERP. The digital twin lets AI OS understand modules, tables, APIs, relationships, workflows, permissions, and dependencies — without guessing.

---

## Twin Components

| Component | Content | Update Trigger |
|-----------|---------|----------------|
| **Modules** | Name, phase, dependencies, manifest | Module install/update |
| **Tables** | Schema, ownership, relationships | Migration, MASTER_DB doc |
| **APIs** | Endpoints, methods, permissions | API.md change, OpenAPI |
| **Workflows** | States, transitions, guards | Workflow registration |
| **Permissions** | Matrix per module | Permissions.md change |
| **Dependencies** | Cross-module graph | DependencyMap.md |
| **Documentation** | Indexed chunks + embeddings | Doc commit / webhook |

---

## Twin Schema (Conceptual)

```
ai_twin_modules
ai_twin_tables
ai_twin_columns
ai_twin_relationships
ai_twin_endpoints
ai_twin_workflows
ai_twin_permissions
ai_twin_dependencies
```

---

## Use Cases

| Use Case | How Twin Helps |
|----------|----------------|
| Chief Agent planning | Knows which agent owns which domain |
| Reasoning Engine | Validates proposals against schema |
| Developer Agent | Generates code matching real schema |
| Documentation Engine | Detects doc ↔ schema drift |
| Analytics Agent | Knows metric definitions and table ownership |
| "What depends on Catalog?" | Graph query |

---

## Sync Pipeline

```
Event: migration_applied | manifest_updated | docs_pushed
  → Twin Builder job (queue: ai)
  → Parse sources (DB metadata, manifests, docs)
  → Update ai_twin_* tables
  → Re-embed changed nodes in ai_knowledge_embeddings
  → Emit ai.twin.updated
```

---

## Governance

- Twin is **read-only** for AI — never written by agents
- Built from authoritative sources only (DB, docs, manifests)
- Admin can view twin explorer UI (future)
- Company twin scoped — platform twin separate for SaaS ops

---

## Phase Rollout

| Phase | Twin Depth |
|-------|------------|
| 1–3 | Module + table list from docs |
| 4 | API + workflow index |
| 5–6 | Live DB sync + dependency graph |
| 7 | Full twin + simulation queries |
