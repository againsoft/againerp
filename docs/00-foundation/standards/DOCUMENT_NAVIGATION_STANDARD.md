# Document Navigation Standard

> **Status:** Active · **Version:** 1.1 · **Date:** 2026-06-19  
> **Steps:** 02 Navigation Layer · **05 Token Efficiency**  
> **Authority:** [BRAIN.md § AI Reading Policy](../../BRAIN.md#ai-reading-policy)

---

## Purpose

Define navigation blocks and the **five-level reading hierarchy** so Cursor loads the minimum files per task.

## When To Read

Read when adding docs or reviewing whether an agent should open a file.

## Related Files

- [BRAIN.md](../../BRAIN.md) — Level 1 + full hierarchy
- [ARCHITECTURE_DECISIONS.md](../../ARCHITECTURE_DECISIONS.md) — Level 2
- [MODULE_REGISTRY.md](../../MODULE_REGISTRY.md) — Level 2

## Read Next

[BRAIN.md § AI Reading Policy](../../BRAIN.md#ai-reading-policy)

---

## Five-Level Reading Hierarchy

| Level | Files | Rule |
|-------|-------|------|
| **1** | [BRAIN.md](../../BRAIN.md) | Every task starts here |
| **2** | [PROJECT_MAP.md](../../PROJECT_MAP.md) · [ARCHITECTURE_DECISIONS.md](../../ARCHITECTURE_DECISIONS.md) · [MODULE_REGISTRY.md](../../MODULE_REGISTRY.md) | Pick **one** by task — do not read all three |
| **3** | `03-business-modules/{module}/README.md` | One module entry — never scan module folder |
| **4** | `Architecture.md` | Module architecture SSOT — read before task-type files |
| **5** | `Database.md` · `API.md` · `Workflow.md` · `UI.md` · `AI.md` · `Reports.md` (+ one screen if UI) | **One** file matching task type |

**Forbidden** (unless explicitly requested): `MASTER_INDEX.md` · `MASTER_DOCUMENT_MAP.md` · `API_REGISTRY.md` · `DATABASE_REGISTRY.md` · `SERVICE_REGISTRY.md`

**Never bulk-read:** `Menus/**` · `04-uiux/prototype/**` (except one guide) · `_registries/*_FULL.md`

---

## Required Sections (Major Docs)

Place after title/metadata, before business content:

```markdown
## Purpose
## When To Read
## Related Files
## Read Next
---
```

| Rule | Detail |
|------|--------|
| **Do not rewrite** | Business content unchanged — navigation only |
| **Task-scoped When To Read** | Tell the agent when *not* to open the file |
| **Read Next** | 1–3 files max |

---

## Maintenance

```bash
python3 docs/05-development/scripts/add-doc-navigation.py
python3 docs/05-development/scripts/generate-module-readmes.py
```

---

**Maintainer:** Platform Architecture
