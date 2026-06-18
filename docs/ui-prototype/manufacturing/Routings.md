# Routings — UI Prototype (P4)

> **Status:** Ready (Prototype)  
> **Routes:** `/manufacturing/routings`  
> **Architecture:** [ARCHITECTURE.md](../../modules/manufacturing/ARCHITECTURE.md)

---

## Mandatory: Create · View · Edit · Update = Drawer only

| Action | URL | Drawer component |
|--------|-----|------------------|
| **List** | `/manufacturing/routings` | — (AG Grid) |
| **Create** | `/manufacturing/routings?create=1` | `RoutingFormDialog` |
| **View** | `/manufacturing/routings?view=rt_001` | `RoutingViewDialog` |
| **Edit** | `/manufacturing/routings?edit=rt_005` | `RoutingFormDialog` |
| **Update** | Save in edit drawer | Zustand `patchRouting` → redirect `?view={id}` |

Routing lifecycle actions (Activate · Obsolete) run from **view or edit drawer** — not separate pages.

---

## Status

`draft` → `active` → `obsolete`

## View drawer tabs (`?view=`)

- **Overview** — product, BOM link, version  
- **Operations** — sequence, work center, setup + run minutes  
- **Usage** — linked work orders (stub)  

## Edit / Create drawer (`?edit=` · `?create=1`)

Link BOM (auto-fills product), version, effective date, editable operation steps, work center dropdown.

Form actions (inside drawer): **Save draft** · **Save & activate** · **Mark obsolete**

## Try it

```
/manufacturing/routings?view=rt_001    → active earbuds routing
/manufacturing/routings?view=rt_005    → draft smart watch v3.0
/manufacturing/routings?edit=rt_005    → edit drawer
/manufacturing/routings?create=1       → create drawer
```

**Last updated:** 2026-06-17
