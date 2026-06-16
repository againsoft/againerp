# Product Configurator — Module Manifest

> **Module:** Product Configurator Engine  
> **Version:** 0.1.0  
> **Layer:** Platform  
> **Table prefix:** `configurator_`  
> **Code path:** `modules/product_configurator/`

---

## Module Name

**Product Configurator Engine** — universal product build/config system (not PC-specific).

## Dependencies

| Module | Required | Purpose |
|--------|----------|---------|
| Core | Yes | Auth, permissions, company scope |
| Catalog | Yes | Product/variant resolution |

## Submodules

| Submodule | Table(s) | Status |
|-----------|----------|--------|
| Configurator Profiles | `configurator_profiles` | Implemented |
| Component Categories | `configurator_categories` | Implemented |
| Compatibility Rules | `configurator_rules` | Implemented |
| Build Templates | `configurator_templates` | Implemented |
| Saved Configurations | `configurator_builds` | Implemented |
| Recommendation Engine | — (service) | Prototype |
| AI Assistant | — (service) | Prototype |

## Supported profile types

`pc_builder` · `laptop_builder` · `cctv_builder` · `networking_builder` · `server_builder` · `solar_builder` · `custom`

## Permissions

| Key | Label |
|-----|-------|
| `configurator.view` | Configurator.View |
| `configurator.create` | Configurator.Create |
| `configurator.edit` | Configurator.Edit |
| `configurator.delete` | Configurator.Delete |
| `configurator.recommend` | Configurator.Recommend |
| `configurator.ai.use` | Configurator.AI.Use |

## Documents

| File | Status |
|------|--------|
| [Architecture.md](./Architecture.md) | Draft |
| [Database.md](./Database.md) | Draft |
| [API.md](./API.md) | Draft |
| [Permissions.md](./Permissions.md) | Draft |

**Last Updated:** 2026-06-15
