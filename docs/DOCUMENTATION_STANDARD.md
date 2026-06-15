# AgainERP — Documentation Standard

> Governance: [GOVERNANCE.md](./GOVERNANCE.md) · Standards: [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md) · Pre-commit: [_COMMIT_CHECKLIST.md](./_COMMIT_CHECKLIST.md)

## Documentation First Rule

Documentation is the source of truth. Every module must be fully documented before any code is written. Code must always follow documentation.

| Rule | Description |
|------|-------------|
| No code without docs | Implementation starts only when module docs are marked **Ready** |
| One folder per module | Each ERP module lives under `docs/modules/{module-name}/` |
| One file per screen | Every menu and submenu has its own markdown file |
| Same structure everywhere | All modules follow the identical documentation architecture |
| Living documents | Docs are updated with every architecture or scope change |

---

## Required Sections (Every Page / Screen Doc)

Every menu and submenu markdown file **must** contain these sections in order:

```markdown
# {Page Title}

## Purpose
Why this page exists and what problem it solves.

## Business Goals
Measurable business outcomes this page supports.

## User Roles
Which roles can access this page and what they can do.

## Page Layout
Wireframe description, sections, tabs, and component placement.

## Fields
Field name, type, required/optional, default, and description.

## Actions
Buttons, bulk actions, links, and what each action triggers.

## Validation Rules
Client-side and server-side validation rules.

## Workflow
State transitions, approvals, and automated flows tied to this page.

## Permissions
Required permissions, record-level rules, and field-level access.

## Database Tables
Tables, columns, and relationships used by this page.

## API Endpoints
REST/GraphQL endpoints consumed or exposed by this page.

## Reports Impact
Which reports and dashboards are affected by data on this page.

## Future Enhancements
Planned improvements not in the current scope.

## Dependencies
Other modules, pages, services, or core components this page depends on.
```

---

## Module-Level Document Types

Each module folder must contain these root files:

| File | Purpose |
|------|---------|
| `Architecture.md` | Module boundaries, integrations, events, and design decisions |
| `Database.md` | Full schema, ERD notes, indexes, and migration strategy |
| `API.md` | All endpoints, request/response contracts, and versioning |
| `UI.md` | Design system usage, layout patterns, and navigation map |
| `Workflow.md` | Business processes, state machines, and automation rules |
| `Permissions.md` | Roles, groups, ACL matrix, and record rules |
| `Development.md` | Setup, conventions, testing strategy, and contribution guide |
| `Roadmap.md` | Phases, milestones, and release plan |
| `ModuleManifest.md` | Single index: version, dependencies, menus, tables, APIs, permissions |

Module-level files use the same section headings where applicable, adapted for scope (e.g. Architecture.md focuses on Purpose, Dependencies, and cross-module diagrams rather than Page Layout).

Platform-level files updated on every governed change: `CHANGELOG.md`, `DependencyMap.md`.

---

## Status Labels

Use these labels at the top of every document:

| Status | Meaning |
|--------|---------|
| `Draft` | Initial structure, content incomplete |
| `In Review` | Ready for stakeholder review |
| `Ready` | Approved — development may begin |
| `Implemented` | Code matches documentation |
| `Deprecated` | Scheduled for removal or replacement |

Format: `> **Status:** Draft`

---

## Cross-Referencing

- Link to related menu docs: `[Product List](./Menus/Products/Product List.md)`
- Link to module docs: `[Ecommerce Database](../modules/ecommerce/Database.md)`
- Link to core docs: `[Permission System](../core/permissions.md)`
- Use relative paths only

---

## Versioning

Each document should include at the bottom:

```markdown
---
**Module:** Ecommerce
**Last Updated:** YYYY-MM-DD
**Author:** —
**Reviewers:** —
```
