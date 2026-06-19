# UI — Ecommerce

## Purpose
Ecommerce module UI navigation map.

## When To Read
Read only if working on Ecommerce admin navigation or screen inventory.

## Related Files
- [Architecture](Architecture.md)
- [UI prototypes](../../04-uiux/prototype/)

## Read Next
- [Screen menus](Menus/)

---

> **Status:** Active  
> **Module:** Ecommerce  
> **Document Type:** UI  
> **Menu Version:** 1.0  
> **Platform UI:** [ENTERPRISE_UI_ARCHITECTURE.md](../../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md) · [UX_SMART_INTERACTION_STANDARDS.md](../../04-uiux/standards/UX_SMART_INTERACTION_STANDARDS.md)

---

## Purpose

Define the Ecommerce admin navigation, layout patterns, and screen map for Module Structure v1.0 (167 screens). All screens follow the platform UI standard — Odoo-inspired shell with AgainERP design language.

## Business Goals

- Single admin shell for full store operations
- Mobile-first responsive layout on every screen
- Consistent patterns across 13 top-level menu groups
- Clear separation: Ecommerce UI vs Core entity management

## Navigation Map

Full tree: [MENU_STRUCTURE.md](./MENU_STRUCTURE.md)

### Top-Level Sidebar (13 groups)

| # | Menu Group | Screens | Primary Users |
|---|------------|---------|---------------|
| 1 | Dashboard | 8 | All roles |
| 2 | Catalog | 21 | Product Manager |
| 3 | Inventory | 8 | Inventory Manager |
| 4 | Sales | 9 | Order Manager |
| 5 | Customers | 9 | Support, Marketing |
| 6 | Marketing | 16 | Marketing Manager |
| 7 | Content | 10 | Content Manager |
| 8 | Builder | 14 | Store Admin |
| 9 | SEO | 12 | SEO Manager |
| 10 | AI | 15 | All (AI-assisted) |
| 11 | Media | 9 | Product, Content |
| 12 | Reports | 14 | Managers |
| 13 | System | 24 | Store Admin |

## Sub-Area Doc Views

Doc views inside Ecommerce — **README + ARCHITECTURE** only; parent owns Database, API, Workflow:

| Area | Entry | Deep dive | Menus |
|------|-------|-----------|-------|
| **SEO** | [seo/README.md](seo/README.md) | [seo/ARCHITECTURE.md](seo/ARCHITECTURE.md) | [Menus/SEO/](Menus/SEO/) |
| **Builder** | [builder/README.md](builder/README.md) | [builder/ARCHITECTURE.md](builder/ARCHITECTURE.md) | [Menus/Builder/](Menus/Builder/) · [08-builder/prototype/](../../08-builder/prototype/) |
| **Catalog** | [catalog/README.md](catalog/README.md) | [catalog/ARCHITECTURE.md](catalog/ARCHITECTURE.md) | [Menus/Catalog/](Menus/Catalog/) |
| **Orders** | — | [orders/ARCHITECTURE.md](orders/ARCHITECTURE.md) | [Menus/Sales/](Menus/Sales/) |
| **Reports** | — | [reports/ARCHITECTURE.md](reports/ARCHITECTURE.md) | [Menus/Reports/](Menus/Reports/) · index [Reports.md](Reports.md) |
| **AI tools** | — | — | [Menus/AI/](Menus/AI/) · index [AI.md](AI.md) |

## Page Layout (Global Shell)

```
┌──────────┬────────────────────────────────────────────┐
│          │ Top Bar: Search · Company · Notifications │
│ Sidebar  ├────────────────────────────────────────────┤
│ (13      │ Breadcrumb: Ecommerce → Group → Screen      │
│  groups) ├────────────────────────────────────────────┤
│          │ Page Header: Title · Primary Actions        │
│          ├────────────────────────────────────────────┤
│          │ Filters / Tabs (if list page)               │
│          ├────────────────────────────────────────────┤
│          │ Main Content                                │
│          └────────────────────────────────────────────┘
```

### Mobile Layout

- Sidebar collapses to hamburger drawer
- Tables switch to card list view
- Dashboard widgets stack vertically
- See [ui-ux/mobile-first.md](../../04-uiux/standards/mobile-first.md)

## UI Patterns by Screen Type

| Type | Pattern | Examples |
|------|---------|----------|
| List | Table + filters + bulk actions | Product List, Orders |
| Form | Single/multi-column form + save | Add Product, General Settings |
| Dashboard | Widget grid + charts | Overview, SEO Dashboard |
| Builder | Drag-drop canvas | Homepage Builder, Header Builder |
| Report | Filters + chart + export | Sales Reports |
| AI Tool | Prompt input + preview + apply | AI Product Description |

## Core Entity UI Rule

Screens that manage Core entities use Ecommerce shell but call Core APIs:

| Screen | API Base |
|--------|----------|
| Customers | `/api/v1/core/contacts` |
| Customer Addresses | `/api/v1/core/addresses` |
| Media Library | `/api/v1/core/media` |
| Tags (Catalog) | `/api/v1/core/tags` |
| User Management | `/api/v1/core/users` |
| Roles / Permissions | `/api/v1/core/roles`, `/api/v1/core/permissions` |

## Permissions

Navigation items hidden when user lacks permission. Each screen doc defines required permission keys.

Namespace: `ecommerce.{group}.{screen}.{action}`

See `Permissions.md`.

## Dependencies

- **Design system:** [ui-ux/](../../04-uiux/standards/)
- **Core entities:** [core/shared-entities.md](../../02-core-platform/shared-entities.md)
- **Menu docs:** [Menus/](./Menus/) (167 files)

---

**Module:** Ecommerce  
**Last Updated:** 2026-06-12
