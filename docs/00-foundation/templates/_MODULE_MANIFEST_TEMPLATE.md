# {Module} — Module Manifest

> **Rule:** Update this file on every structural change.  
> **Template:** [_MODULE_MANIFEST_TEMPLATE.md](../../00-foundation/templates/_MODULE_MANIFEST_TEMPLATE.md)  
> **Generator:** [MODULE_GENERATOR_GUIDE.md](../../MODULE_GENERATOR_GUIDE.md)

---

## Purpose

{Module} module manifest — install registry, dependencies, and package status.

## When To Read

Read only when registering, installing, or declaring {Module} module dependencies.

## Related Files

- [Architecture.md](Architecture.md)
- [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next

- [Architecture.md](Architecture.md)

---

## Module Identity

| Field | Value |
|-------|-------|
| **Module ID** | `{module}` |
| **Display name** | {Module} |
| **Version** | `0.1.0-docs` |
| **Owner** | {team} |
| **Layer** | {layer} |
| **Status** | Draft |
| **Route** | `/{route}/*` |
| **API** | `{api_path}` |
| **Table prefix** | `{prefix}_*` |

---

## Dependencies

| Module | Type | Required |
|--------|------|----------|
| Core | Framework | Yes |
| _—_ | Service / Event | _—_ |

See [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md).

**Rule:** Dependencies via **services and events only** — no cross-module DB.

---

## Package Status

| File | Required | Status |
|------|----------|--------|
| README.md | Yes | Draft |
| Architecture.md | Yes | Draft |
| ModuleManifest.md | Yes | Draft |
| Database.md | Yes | Draft |
| API.md | Yes | Draft |
| Workflow.md | Yes | Draft |
| Permissions.md | Yes | Draft |
| UI.md | Yes | Draft |
| AI.md | Yes | Draft |
| Reports.md | Yes | Draft |
| CHANGELOG.md | Yes | Draft |

**Score:** 11/11 when all rows exist and Architecture has 10 sections.

---

## Menus

| Menu Group | Screens | Path |
|------------|---------|------|
| Dashboard | _n_ | `Menus/Dashboard/` |
| _Group_ | _n_ | `Menus/{Group}/` |

---

## Services Provided

| Service | Description |
|---------|-------------|
| `{Module}Service` | Public API for other modules |

## Events Published

| Event | Payload |
|-------|---------|
| `{module}.example.created` | `id`, `company_id` |

## Events Subscribed

| Event | Handler |
|-------|---------|
| `core.approval.approved` | _—_ |

## AI Tools

| Tool ID | Risk |
|---------|------|
| `{module}.example` | low |

---

## Architecture Anchors

| Section | File |
|---------|------|
| Overview | [Architecture.md#1-overview](Architecture.md#1-overview) |
| Data Ownership | [Database.md](Database.md) |
| API | [API.md](API.md) |
| Events / Workflow | [Workflow.md](Workflow.md) |
| Permissions | [Permissions.md](Permissions.md) |
| UI | [UI.md](UI.md) |
| AI | [AI.md](AI.md) |
| Reports | [Reports.md](Reports.md) |

---

**Last Updated:** {DATE} · **Maintainer:** {team}
