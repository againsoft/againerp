# Business Modules

> **Module index:** [../MODULE_REGISTRY.md](../MODULE_REGISTRY.md)  
> **Entry rule:** Every module folder has **`README.md`** as the **only** entry point — open that first, then one doc from its Documentation Map.

29 business modules under `docs/03-business-modules/{module}/`.

## Purpose

Index folder for all business module documentation packages.

## When To Read

Read when selecting a module — then open `{module}/README.md` immediately; do not list-scan module folders.

## Features

- 29 installable/planned business modules
- Ecommerce sub-area entry points: `ecommerce/seo/`, `ecommerce/builder/`, `ecommerce/catalog/`, `ecommerce/marketing/`
- Standard doc package per module (Architecture, Database, API, Menus, …)

## Dependencies

See [MODULE_DEPENDENCY_MAP.md](../01-architecture/MODULE_DEPENDENCY_MAP.md).

## Events

Domain events per module — summarized in each module `README.md`.

## Documentation Map

| Start here | Purpose |
|------------|---------|
| [../MODULE_REGISTRY.md](../MODULE_REGISTRY.md) | All modules — ID, route, API, owner |
| [{module}/README.md](./crm/README.md) | Example: CRM entry point |
| [../STANDARD_MODULE_TEMPLATE.md](../STANDARD_MODULE_TEMPLATE.md) | Required Architecture sections |
| [../05-development/scripts/generate-module-readmes.py](../05-development/scripts/generate-module-readmes.py) | Regenerate module READMEs |

## Related Files

| File | Role |
|------|------|
| [../BRAIN.md](../BRAIN.md) | Cursor entry |
| [../MODULE_REGISTRY.md](../MODULE_REGISTRY.md) | Module index |
| [../01-architecture/MODULE_DEPENDENCY_MAP.md](../01-architecture/MODULE_DEPENDENCY_MAP.md) | Dependencies |

## Read Next

[../MODULE_REGISTRY.md](../MODULE_REGISTRY.md) — pick a module → open `{module}/README.md`.

---

**Maintainer:** Platform Architecture
