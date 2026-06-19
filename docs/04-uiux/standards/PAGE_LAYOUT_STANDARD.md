# AgainERP — Page Layout Standard

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 10 — Enterprise Design System & UI Foundation  
> **Authority:** [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md)

---

## Purpose

Standards for **page-level layouts** — workspace, module, dashboard, list, details, settings, and analytics patterns.

## When To Read

Read when writing module `UI.md` or individual `Menus/{screen}.md` specs.

## Related Files

- [WORKSPACE_SHELL_ARCHITECTURE.md](./WORKSPACE_SHELL_ARCHITECTURE.md)
- [WORKSPACE_LAYOUT_MAP.md](./WORKSPACE_LAYOUT_MAP.md)
- [DASHBOARD_ARCHITECTURE_LOCK.md](../../DASHBOARD_ARCHITECTURE_LOCK.md)
- [TABLE_AND_DATA_GRID_STANDARD.md](./TABLE_AND_DATA_GRID_STANDARD.md)
- [FORM_STANDARD.md](./FORM_STANDARD.md)
- [WORKSPACE_CONTEXT_STANDARD.md](./WORKSPACE_CONTEXT_STANDARD.md)
- [EMPTY_STATE_STANDARD.md](./EMPTY_STATE_STANDARD.md)
- [LOADING_STATE_STANDARD.md](./LOADING_STATE_STANDARD.md)

## Read Next

Pick **one** layout type below matching your screen.

---

## 1. Layout Types Overview

| Layout ID | Route pattern | Primary use |
|-----------|---------------|-------------|
| `LAYOUT-WORKSPACE` | Shell frame | All admin pages |
| `LAYOUT-MODULE` | `/{module}/*` | Module pages with nav |
| `LAYOUT-DASHBOARD` | `*/dashboard` | Widget grids |
| `LAYOUT-LIST` | `/{module}/{entities}` | Entity index |
| `LAYOUT-DETAILS` | `?view=` drawer or full page | Record view |
| `LAYOUT-SETTINGS` | `/{module}/settings/*` | Configuration |
| `LAYOUT-ANALYTICS` | `/{module}/reports/*` | Charts, drill-down |

---

## 2. Workspace Layout (`LAYOUT-WORKSPACE`)

The **shell frame** — not duplicated per module.

```text
┌──────────────────────────────────────────────────────────────┐
│ A — Global header (56px)                                     │
├────────┬─────────────────────────────────────────┬───────────┤
│ C      │ B — Module nav (48px)                   │ E         │
│ Side   ├─────────────────────────────────────────┤ Utility   │
│ bar    │ D — Main content                        │ (opt)     │
│        │                                         │           │
├────────┴─────────────────────────────────────────┴───────────┤
│ F — Bottom nav (mobile only)                                 │
└──────────────────────────────────────────────────────────────┘
```

**Authority:** [WORKSPACE_SHELL_ARCHITECTURE.md](./WORKSPACE_SHELL_ARCHITECTURE.md) · [WORKSPACE_LAYOUT_MAP.md](./WORKSPACE_LAYOUT_MAP.md)

Modules render only in **Zone D** (and register nav in Zone B).

---

## 3. Module Layout (`LAYOUT-MODULE`)

Standard wrapper for all module pages inside Zone D.

| Zone | Content |
|------|---------|
| Page header | Title · breadcrumbs · primary actions |
| Optional tabs | Sub-entity navigation within module |
| Content area | List, dashboard, settings, or analytics |
| Optional utility | Activity, AI — Zone E |

**Page header anatomy:**

```text
[Breadcrumb]                    [Secondary actions] [Primary +]
Title · optional subtitle
Optional: status badge · smart buttons row
```

**Smart buttons (Odoo-inspired):** Stat pills linking to related lists — e.g. "12 Open Orders" on customer record.

---

## 4. List Layout (`LAYOUT-LIST`)

Default entity index — **list + drawer CRUD**.

```text
Page header — Entity name · [+ Create]
Toolbar — Search · Filters · View toggle · Export
Table / Card list
Pagination footer
Drawer (URL-driven) — create · view · edit
```

| Breakpoint | Table |
|------------|-------|
| Desktop | `DS-DATAGRID` |
| Mobile | `DS-CARD-LIST` |

Detail: [TABLE_AND_DATA_GRID_STANDARD.md](./TABLE_AND_DATA_GRID_STANDARD.md)

**Reference implementation pattern:** `/catalog/products`

---

## 5. Details Layout (`LAYOUT-DETAILS`)

### 5.1 Drawer details (default)

Opened via `?view={id}` on list page. Read-only with Edit → `?edit={id}`.

```text
Drawer header — Title · status · [Edit] [⋯]
Tabs or sections — General · Related · Activity
Smart buttons row (optional)
Footer — Close · Delete (confirm)
```

### 5.2 Full-page details (complex entities)

When entity has many tabs or embedded sub-grids:

```text
Page header — Back · Title · actions
Tab bar — General · Variants · Inventory · …
Tab content — forms and embedded lists
Chatter / activity — right column desktop · tab mobile
```

Use full page when drawer exceeds 640px effective content or > 4 tabs.

---

## 6. Settings Layout (`LAYOUT-SETTINGS`)

Module **Configuration** zone pages.

```text
Settings sidebar (module) OR settings tab group
Section title + description
Form sections — grouped fields
Save bar — sticky footer [Save changes]
```

| Rule | Detail |
|------|--------|
| Grouping | Logical sections with headings |
| Danger zone | Separate card at bottom — destructive actions |
| Permissions | `{module}.settings.manage` typical |

Route pattern: `/{module}/settings/{section}`

---

## 7. Analytics Layout (`LAYOUT-ANALYTICS`)

Reports and analytics under **Reports** nav zone.

```text
Page header — Report name · date range · export
Filter bar — dimensions, comparison period
Chart grid — 1 col mobile · 2 col desktop
Data table — optional drill-down below charts
```

| Component | Standard |
|-----------|----------|
| Charts | Recharts + design tokens |
| Date range | Presets + custom |
| Export | CSV/PDF per permission |

Detail: [recharts-conventions.md](./recharts-conventions.md)

---

## 8. Dashboard Layout (`LAYOUT-DASHBOARD`)

Widget grid — **not owned by modules**.

```text
Dashboard header — title · customize · date filter
Widget grid — 12-column responsive
Empty state — add widget CTA
```

**Locked by:** [DASHBOARD_ARCHITECTURE_LOCK.md](../../DASHBOARD_ARCHITECTURE_LOCK.md)

Modules supply widget **data** only — not layout engine.

---

## 9. Layout Selection Guide

| Scenario | Layout |
|----------|--------|
| Product list | LIST |
| Create product | LIST + drawer `?create=1` |
| View order (simple) | LIST + drawer `?view=` |
| Product editor (variants, BOM) | DETAILS full page |
| Tax settings | SETTINGS |
| Sales report | ANALYTICS |
| Module home | DASHBOARD |

---

## 10. Menus Spec Requirements

Each `Menus/{screen}.md` must declare:

| Field | Example |
|-------|---------|
| `layout_id` | `LAYOUT-LIST` |
| `route` | `/catalog/products` |
| `drawer_params` | `create`, `view`, `edit` |
| `zones_used` | D · B |
| `mobile_variant` | card-list |
| `context_required` | Per WORKSPACE_CONTEXT_STANDARD |
| `empty_state` | Per EMPTY_STATE_STANDARD |
| `loading` | Per LOADING_STATE_STANDARD |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 10 — page layout standard |

---

**Page Layout Standard** — seven layouts, drawer-first CRUD, shell-owned frame.
