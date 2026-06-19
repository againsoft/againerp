# UI — {Module}

> **Status:** Draft  
> **Module:** {Module}  
> **Document Type:** UI (Level 5 SSOT)  
> **Route namespace:** `/{route}/*`

---

## Purpose

Define **{Module}** admin navigation, layout patterns, and screen map. Per-screen field specs live in `Menus/` — this file is the **UI navigation SSOT**.

## When To Read

Read only for admin navigation, layout patterns, or screen inventory. Open **one** `Menus/{Screen}.md` or **one** prototype guide for implementation detail.

## Related Files

- [Architecture.md](Architecture.md) — §8 UIUX summary
- [Permissions.md](Permissions.md) — menu visibility
- [04-uiux/standards/module-ui-standard.md](../../04-uiux/standards/module-ui-standard.md)
- [04-uiux/prototype/{module}/](../../04-uiux/prototype/)

## Read Next

- One row from Navigation Map → one `Menus/` file OR one prototype guide

---

## Layout Standards

| Pattern | Rule |
|---------|------|
| **CRUD** | List page + right Sheet drawer — `?create=1` · `?view={id}` · `?edit={id}` |
| **Never** | `/new` or `/[id]/edit` routes for standard entity CRUD |
| **Mobile** | Full-width drawer · table scroll/card fallback · 44px tap targets |
| **Shell** | Platform admin shell — [WORKSPACE_SHELL_ARCHITECTURE.md](../../04-uiux/standards/WORKSPACE_SHELL_ARCHITECTURE.md) |

---

## Navigation Map

| # | Menu Group | Screens | Primary users | Menus path |
|---|------------|---------|---------------|------------|
| 1 | Dashboard | _n_ | All | `Menus/Dashboard/` |
| 2 | _Group_ | _n_ | _Role_ | `Menus/{Group}/` |

Full tree (optional): `MENU_STRUCTURE.md` — generate when screen count > 20.

**Module dashboard:** [MODULE_DASHBOARD_STANDARD.md](../../04-uiux/standards/MODULE_DASHBOARD_STANDARD.md) — required sections + widget registration.

---

## Sub-Areas (if applicable)

_Document sub-area doc views only when module has nested areas (e.g. ecommerce/seo). Sub-areas get README + ARCHITECTURE — not full 11-file packages._

| Area | Entry | Notes |
|------|-------|-------|
| _area_ | `{area}/README.md` | _—_ |

---

## Screen Spec Rules

| Rule | Detail |
|------|--------|
| **SSOT** | One file per screen under `Menus/{Group}/{Screen}.md` |
| **Open one** | Never bulk-read `Menus/` |
| **Prototype** | Build guides in `04-uiux/prototype/{module}/` when UI build task |

---

## Route Map (summary)

| Screen | Route | Drawer params |
|--------|-------|-----------------|
| Example list | `/{route}/examples` | `?create=1` · `?view={id}` · `?edit={id}` |

---

**Module:** {Module} · **Last Updated:** {DATE} · **Maintainer:** {team}
