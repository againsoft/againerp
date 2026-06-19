# AgainERP — Recommended Module Documentation Structure

> **Universal framework:** [UNIVERSAL_MODULE_FRAMEWORK.md](UNIVERSAL_MODULE_FRAMEWORK.md)  
> Platform blueprint: [MASTER_MODULE_ARCHITECTURE.md](../01-architecture/MASTER_MODULE_ARCHITECTURE.md)

## Purpose
Required files and folder layout for every module documentation package.

## When To Read
Read when scaffolding a new module docs folder.

## Related Files
- [Architecture template](../STANDARD_MODULE_TEMPLATE.md)
- [Module framework](UNIVERSAL_MODULE_FRAMEWORK.md)

## Read Next
- [Module examples](../03-business-modules/)

---

Every module — ERP, Ecommerce, or industry vertical — must replicate this structure. No exceptions.

---

## Standard Module Folder

```
docs/modules/{module-name}/
├── ModuleManifest.md      # Required — module index & install registry
├── Architecture.md        # Required
├── Database.md            # Required — owned tables only
├── API.md                 # Required
├── Workflow.md            # Required
├── Permissions.md         # Required
├── Reports.md             # Required — reports & exports owned by module
├── AI.md                  # Required — tools, agents, credits, approvals
├── CHANGELOG.md           # Required — module-level change history
├── UI.md                  # Recommended — navigation map
├── Development.md         # Recommended
├── Roadmap.md             # Recommended
└── Menus/
    ├── Dashboard.md
    └── {MenuGroup}/
        └── {Screen Name}.md
```

### Required Files (9)

ModuleManifest · Architecture · Database · API · Workflow · Permissions · Reports · AI · CHANGELOG

---
## Industry Modules

Unlimited verticals install on Core — see [framework/INDUSTRY_MODULES.md](../05-development/framework/INDUSTRY_MODULES.md).

| Module | Folder | Layer |
|--------|--------|-------|
| Hospital | `hospital/` | industry |
| School | `school/` | industry |
| Restaurant | `restaurant/` | industry |
| Hotel | `hotel/` | industry |
| Real Estate | `realestate/` | industry |
| NGO | `ngo/` | industry |
| Courier | `courier/` | industry |
| Diagnostic | `diagnostic/` | industry |

---

## Planned Modules

All modules follow the same 9-file required root + `Menus/` pattern:

| Module | Folder | Phase | Depends On |
|--------|--------|-------|------------|
| **Ecommerce** | `ecommerce/` | **1 — Active** | Core (services: Inventory, Sales) |
| Inventory | `inventory/` | 2 | Core |
| Sales | `sales/` | 2 | Core, CRM, Inventory |
| CRM | `crm/` | 3 | Core |
| Purchase | `purchase/` | 3 | Core, Inventory |
| Accounting | `accounting/` | 3 | Core |
| POS | `pos/` | 4 | Core, Sales, Inventory |
| HR | `hr/` | 4 | Core |
| Project | `project/` | 4 | Core, HR, Sales |
| Helpdesk | `helpdesk/` | 4 | Core, CRM |
| Documents | `documents/` | 4 | Core |
| Website | `website/` | 4 | Core |
| Marketing | `marketing/` | 5 | Core, CRM |
| Manufacturing | `manufacturing/` | 5 | Core, Inventory, Purchase |
| AI | `ai/` | 5 | Core (all modules) |

---

## New Module Checklist

1. [ ] Create `docs/modules/{name}/` folder
2. [ ] Create all 9 required files (see [UNIVERSAL_MODULE_FRAMEWORK.md](UNIVERSAL_MODULE_FRAMEWORK.md))
3. [ ] Copy optional files from `_MODULE_TEMPLATE.md`
4. [ ] Create `ModuleManifest.md` from `_MODULE_MANIFEST_TEMPLATE.md`
5. [ ] Create `AI.md` from [framework/templates/AI_TEMPLATE.md](../05-development/framework/templates/AI_TEMPLATE.md)
6. [ ] Create `Menus/` with one file per admin screen
7. [ ] Register in `docs/README.md`
8. [ ] Add to `docs/roadmap/modules.md`
9. [ ] Update `docs/DependencyMap.md`
10. [ ] Link cross-module dependencies in `Architecture.md`
11. [ ] Add entry to `docs/CHANGELOG.md`
12. [ ] Get stakeholder sign-off — mark docs **Ready** before coding

---

## Scalability Rules (100+ Modules)

| Rule | Why |
|------|-----|
| Flat module list under `docs/modules/` | Easy to scan, no nested module groups |
| Menu folders mirror UI exactly | Developers find docs the same way users find screens |
| No shared screen docs across modules | Each module owns its pages; link instead of duplicate |
| Core docs are module-agnostic | Shared behavior documented once under `docs/core/` |
| Global API contracts in `docs/api/` | Module `API.md` links to global standards |
| Global schema conventions in `docs/database/` | Module `Database.md` follows shared conventions |

---

## Example: Future CRM Module

```
docs/modules/crm/
├── Architecture.md
├── Database.md
├── API.md
├── UI.md
├── Workflow.md
├── Permissions.md
├── Development.md
├── Roadmap.md
└── Menus/
    ├── Dashboard.md
    ├── Leads/
    │   ├── Lead List.md
    │   ├── Create Lead.md
    │   └── Lead Pipeline.md
    ├── Opportunities/
    │   ├── Opportunity List.md
    │   └── Opportunity Details.md
    └── Contacts/
        ├── Contact List.md
        └── Create Contact.md
```
