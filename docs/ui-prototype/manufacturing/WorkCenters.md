# Work Centers — UI Prototype (P3)

> **Status:** Ready (Prototype)  
> **Routes:** `/manufacturing/work-centers`  
> **Architecture:** [ARCHITECTURE.md](../../modules/manufacturing/ARCHITECTURE.md)

---

## Mandatory: Create · View · Edit · Update = Drawer only

| Action | URL | Drawer component |
|--------|-----|------------------|
| **List** | `/manufacturing/work-centers` | — (AG Grid) |
| **Create** | `/manufacturing/work-centers?create=1` | `WorkCenterFormDialog` |
| **View** | `/manufacturing/work-centers?view=wc_001` | `WorkCenterViewDialog` |
| **Edit** | `/manufacturing/work-centers?edit=wc_005` | `WorkCenterFormDialog` |
| **Update** | Save in edit drawer | Zustand `patchWorkCenter` → redirect `?view={id}` |

No full-page forms. View drawer **Edit** button → `?edit={id}`.

---

## Fields

Code · name · warehouse · type · capacity hrs/day · cost rate/hr · utilization % · status

## Types

`assembly` · `machine` · `labor` · `qc` · `packaging`

## Status

`active` · `maintenance` · `inactive`

## View drawer tabs (`?view=`)

- **Overview** — identity, warehouse, status alerts  
- **Capacity** — hours, cost rate, utilization bar  
- **Operations** — open WO routing steps on this work center  

## Edit / Create drawer (`?edit=` · `?create=1`)

All fields editable → **Save** updates store.

View-only actions: Set maintenance · Activate

## Try it

```
/manufacturing/work-centers?view=wc_005   → SMT line
/manufacturing/work-centers?view=wc_006   → maintenance
/manufacturing/work-centers?edit=wc_001   → edit drawer
/manufacturing/work-centers?create=1      → create drawer
```

**Last updated:** 2026-06-17
