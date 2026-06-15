# {Module Name} — Module Manifest

> **Rule:** Update this file on every structural change.  
> Copy to `docs/modules/{module-name}/ModuleManifest.md` when creating a new module.

---

## Module Name

**{Module Name}**

## Version

`0.0.0-docs`

## Owner

_Team or domain owner (e.g. Ecommerce Team, Platform Core)_

## Layer

`core` | `platform` | `commerce` | `erp` | `industry` | `ai`

## Table Prefix

`{module}_` — e.g. `hospital_`, `school_`

## Status

`Draft`

## Dependencies

| Module | Type | Required |
|--------|------|----------|
| Core | Framework | Yes |
| _—_ | _—_ | _—_ |

See [MODULE_DEPENDENCY_MAP.md](../MODULE_DEPENDENCY_MAP.md).

---

## Menus

| Menu Group | Path |
|------------|------|
| _Dashboard_ | `Menus/Dashboard.md` |
| _{Group}_ | `Menus/{Group}/` |

---

## Pages

| # | Page | File | Status |
|---|------|------|--------|
| 1 | _Page Name_ | `Menus/.../Page Name.md` | Draft |

---

## Database Tables

| Table | Purpose | Status |
|-------|---------|--------|
| `{module}_table_name` | _—_ | Planned |

---

## API Endpoints

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/api/v1/{module}/...` | _—_ | Planned |

---

## Permissions

| Permission Key | Description | Status |
|----------------|-------------|--------|
| `{module}.access` | Module access | Planned |

---

## Workflows

| Workflow | States | Status |
|----------|--------|--------|
| _—_ | _—_ | Planned |

---

## Reports

| Report | File | Status |
|--------|------|--------|
| _—_ | `Menus/Reports/...` | Draft |

---

## Services Provided

| Service | Description |
|---------|-------------|
| `{Module}Service` | _—_ |

## Events Published

| Event | Payload |
|-------|---------|
| `{module}.{entity}.{action}` | _—_ |

## Events Subscribed

| Event | Handler |
|-------|---------|
| `core.contact.updated` | _—_ |

## AI Tools

| Tool ID | Risk |
|---------|------|
| `{module}.example` | low |

## Module Documents

| File | Required | Status |
|------|----------|--------|
| `ModuleManifest.md` | Yes | Draft |
| `Architecture.md` | Yes | Draft |
| `Database.md` | Yes | Draft |
| `API.md` | Yes | Draft |
| `Workflow.md` | Yes | Draft |
| `Permissions.md` | Yes | Draft |
| `Reports.md` | Yes | Draft |
| `AI.md` | Yes | Draft |
| `CHANGELOG.md` | Yes | Draft |
| `UI.md` | No | Draft |
| `Development.md` | No | Draft |
| `Roadmap.md` | No | Draft |

---

**Last Updated:** YYYY-MM-DD  
**Author:** —  
**Reviewers:** —
