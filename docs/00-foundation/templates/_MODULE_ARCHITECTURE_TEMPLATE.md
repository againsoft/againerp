# Architecture — {Module}

> **Status:** Draft  
> **Version:** 1.0 · **Date:** {DATE}  
> **Module:** {Module}  
> **Document Type:** Architecture (Level 4 SSOT)  
> **Route Namespace:** `/{route}/*`  
> **Governance:** [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · [STANDARD_MODULE_TEMPLATE.md](../../STANDARD_MODULE_TEMPLATE.md)

**No backend code until Status: Ready.**  
Canonical source of truth for **{Module}** boundaries, ownership, and integration. Summarize here — detail lives in sibling package files.

**Package:** [ModuleManifest.md](ModuleManifest.md) · [Database.md](Database.md) · [API.md](API.md) · [Workflow.md](Workflow.md) · [Permissions.md](Permissions.md) · [AI.md](AI.md) · [Reports.md](Reports.md)

---

## Purpose

Define module architecture per the 10-section standard. This file is **Level 4** in the [AI Reading Policy](../../BRAIN.md#ai-reading-policy).

## When To Read

Read after `{module}/README.md` for any design, boundary, or cross-module integration question. Do not open Database/API/Workflow until this file is insufficient for your task.

## Related Files

- [README.md](README.md) — Level 3 entry
- [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)
- [MODULE_ISOLATION_REPORT.md](../../architecture/MODULE_ISOLATION_REPORT.md)

## Read Next

- Task-type detail: one of Database · API · Workflow · Permissions · UI · AI · Reports
- [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md)

---

## 1. Overview

| Attribute | Value |
|-----------|-------|
| **Module ID** | `{module}` |
| **Display name** | {Module} |
| **Layer** | {layer} |
| **Route namespace** | `/{route}/*` |
| **Table prefix** | `{prefix}_*` |
| **API base** | `{api_path}` |
| **Dependencies** | Core + services/events only — see [ModuleManifest.md](ModuleManifest.md) |

_One paragraph: what this module is and its role on the platform._

| Principle | Rule |
|-----------|------|
| Isolation | Independent module at `/{route}/*` — no cross-module DB |
| Core entities | Use Core contacts/users — no duplicate party tables |

---

## 2. Purpose

### Why {Module} Exists

_Problem statement and mission._

### Scope & Boundaries

#### In Scope

- _Capability 1_
- _Capability 2_

#### Out of Scope

- _Owned by other module — link to `{other}/Architecture.md`_
- _Core responsibility — link to [02-core-platform/ARCHITECTURE.md](../../02-core-platform/ARCHITECTURE.md)_

---

## 3. Features

### Navigation Map

_Admin menu groups. Detail: [UI.md](UI.md) · `Menus/`_

| Area | Route | Description |
|------|-------|-------------|
| Dashboard | `/{route}` | _—_ |
| _Area_ | `/{route}/_` | _—_ |

### Capability Summary

| Feature | Description |
|---------|-------------|
| _Feature 1_ | _—_ |

### Key Workflows

_Summary only — state machines in [Workflow.md](Workflow.md)_

```text
_State A → State B → State C_
```

---

## 4. Data Ownership

### Owned Tables (`{prefix}_*`)

| Table | Purpose |
|-------|---------|
| `{prefix}_example` | _—_ |

**Full schema:** [Database.md](Database.md)

### Core Entities Consumed (Not Owned)

| Core Entity | Usage |
|-------------|------|
| [contacts](../../02-core-platform/entities/contacts.md) | _—_ |
| [users](../../02-core-platform/entities/users.md) | _—_ |

### Integration IDs

| Field | Points To | Rule |
|-------|-----------|------|
| `contact_id` | Core `contacts` | FK allowed |
| `_foreign_id_` | Other module (via service) | ID only — no cross-module JOIN |

### Anti-Patterns (Forbidden)

```text
❌ Duplicate Core entity tables in {prefix}_*
❌ JOIN foreign module business tables
❌ Write another module's owned tables
```

---

## 5. API

| Property | Value |
|----------|-------|
| **Base path** | `{api_path}` |
| **Auth** | Bearer + `X-Company-Id` |
| **Permission namespace** | `{module}.*` |

### Representative Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | List |
| POST | `/` | Create |
| GET | `/{id}` | Read |
| PATCH | `/{id}` | Update |

**Full contracts:** [API.md](API.md)

### Services

| Direction | Service | Purpose |
|-----------|---------|---------|
| **Provides** | `{Module}Service.*` | Public API for other modules |
| **Consumes** | `Core` · `_OtherService_` | Via service layer only |

---

## 6. Events

### Published Events

| Event | Trigger | Payload (summary) |
|-------|---------|-------------------|
| `{module}.entity.created` | _—_ | `id`, `company_id` |

### Subscribed Events

| Event | Source | Handler action |
|-------|--------|----------------|
| `core.approval.approved` | Core | _—_ |

**Rules:** Publish after COMMIT · No sync chains of 5+ services · See [EVENT_ARCHITECTURE.md](../../02-core-platform/engines/EVENT_ARCHITECTURE.md)

---

## 7. Permissions

| Property | Value |
|----------|-------|
| **Namespace** | `{module}.*` |
| **Matrix** | [Permissions.md](Permissions.md) |

### Summary

| Permission | Description |
|------------|-------------|
| `{module}.access` | Module entry |
| `{module}._entity_.view` | Read |
| `{module}._entity_.manage` | Create/update/delete |

---

## 8. UIUX

| Property | Value |
|----------|-------|
| **Admin routes** | `/{route}/*` |
| **CRUD pattern** | List page + right Sheet drawer (`?create=1` · `?view={id}` · `?edit={id}`) |
| **Mobile** | Full-width drawer · 44px tap targets |

### Standards

- [module-ui-standard.md](../../04-uiux/standards/module-ui-standard.md)
- [layout-architecture.md](../../04-uiux/standards/layout-architecture.md)

### Build Guides

- Prototype: [04-uiux/prototype/{module}/](../../04-uiux/prototype/)
- Screens: `Menus/` (functional specs)

---

## 9. AI Integration

| Property | Value |
|----------|-------|
| **Feature gate** | `{module}.ai.access` |
| **Platform** | [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) |

### Tools & Agents

| Tool ID | Risk | Approval | Description |
|---------|------|----------|-------------|
| `{module}.example` | low | no | _—_ |

**Full registry:** [AI.md](AI.md)

### Rules

- AI calls **module services only** — never direct DB
- High-risk tools require [Approval Engine](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md)

---

## 10. Future Scope

### Planned Enhancements

- _Feature — link to [10-roadmap/plans/](../../10-roadmap/plans/)_

### Industry Compatibility

_How module behaves when industry verticals install._

### Deprecations

| Item | Replacement | Target version |
|------|-------------|----------------|
| _—_ | _—_ | _—_ |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md) | Integration matrix |
| [Workflow.md](Workflow.md) | State machines |
| [Reports.md](Reports.md) | Reports & exports |

---

**Module:** {Module} · **Last Updated:** {DATE} · **Maintainer:** {team}
