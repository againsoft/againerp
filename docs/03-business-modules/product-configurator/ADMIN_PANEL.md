# Product Configurator Admin Panel

> **Status:** Implemented (prototype)  
> **Nav:** Catalog › Product Configurator  
> **Base route:** `/catalog/product-configurator`

---

## Menu structure

```
Catalog
└ Product Configurator
   ├ Overview
   ├ Profiles
   ├ Categories
   ├ Rules
   ├ Templates
   ├ Saved Builds
   ├ Analytics
   └ Component Attributes (technical)
```

---

## UX flow (Odoo-style)

| Step | Action |
|------|--------|
| 1 | Open **Catalog › Product Configurator** hub — see KPI counts |
| 2 | Create a **Profile** (PC Builder, CCTV…) |
| 3 | Add **Categories** (CPU, Motherboard, RAM slots) scoped to profile |
| 4 | Define **Rules** (IF/THEN/ELSE compatibility) |
| 5 | Publish **Templates** (starter builds) |
| 6 | Monitor **Saved Builds** + **Analytics** |

Each list screen provides:

- **Quick search** — name, slug, code, customer
- **Advanced filters** — status, type, compatibility, featured (sheet panel)
- **Bulk actions** — activate, archive, delete (selection bar)
- **Activity log** — per-row chatter button (audit trail)
- **CRUD** — create/edit sheet, duplicate, delete
- **Role permissions** — `configurator.view|create|edit|delete` (frontend hook)

---

## Admin screens

| Screen | Route | List component |
|--------|-------|----------------|
| Hub | `/catalog/product-configurator` | Overview cards + KPI strip |
| Profiles | `…/profiles` | `configurator-profiles-list.tsx` |
| Categories | `…/categories` | `configurator-categories-list.tsx` |
| Rules | `…/rules` | `compatibility-rules-list.tsx` |
| Templates | `…/templates` | `configurator-templates-list.tsx` |
| Saved Builds | `…/builds` | `configurator-builds-list.tsx` |
| Analytics | `…/analytics` | `configurator-analytics-dashboard.tsx` |

---

## Shared components

| File | Role |
|------|------|
| `admin/configurator-admin-page.tsx` | Page shell — breadcrumb, title, create CTA |
| `admin/configurator-admin-shell.tsx` | Odoo list chrome — KPIs, search, filters, bulk bar |
| `lib/configurator/permissions.ts` | Permission keys + `hasConfiguratorPermission()` |
| `lib/configurator/audit.ts` | `logConfiguratorActivity()` → activity store |

---

## Stores (Zustand persist)

| Store | Persist key | Entities |
|-------|-------------|----------|
| `configurator-profile-store.ts` | `againerp-configurator-profiles` | Builder profiles |
| `configurator-category-store.ts` | `againerp-configurator-categories` | Component slots |
| `configurator-template-store.ts` | `againerp-configurator-templates` | Starter builds |
| `configurator-build-store.ts` | `againerp-configurator-builds` | Saved builds |
| `compatibility-rule-store.ts` | `againerp-compatibility-rules` | IF/THEN/ELSE rules |

All mutations call `logConfiguratorActivity()` for audit history.

---

## Activity & audit

Entity types added to `lib/activity/types.ts`:

- `configurator_profile`
- `configurator_category`
- `configurator_rule`
- `configurator_template`
- `configurator_build`

Each list row includes `ActivityTriggerButton` for Odoo-style chatter drawer.

---

## Backend APIs (ready for wiring)

| Entity | API prefix |
|--------|------------|
| Profiles | `GET/POST /api/v1/configurator/profiles` |
| Categories | `GET/POST /api/v1/configurator/categories` |
| Rules | `GET/POST /api/v1/configurator/rules` |
| Templates | `GET/POST /api/v1/configurator/templates` |
| Builds | `GET/POST /api/v1/configurator/builds` |
| Evaluate | `POST /api/v1/configurator/compatibility/evaluate` |

Permissions: see `modules/product_configurator/permissions.py`.

---

## Related docs

- [Component Attribute Engine](./COMPONENT_ATTRIBUTE_ENGINE.md)
- [Compatibility Engine](./COMPATIBILITY_ENGINE.md)
