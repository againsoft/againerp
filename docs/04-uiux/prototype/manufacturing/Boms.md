# Bills of Materials — UI Prototype (P2)

> **Status:** Ready (Prototype)  
> **Routes:** `/manufacturing/boms`  
> **Architecture:** [ARCHITECTURE.md](../../../03-business-modules/manufacturing/ARCHITECTURE.md)

---

## Mandatory: Create · View · Edit · Update = Drawer only

Recipe / BOM CRUD uses **right Sheet drawer** only — same as Products and Work Orders.

| Action | URL | Drawer component |
|--------|-----|------------------|
| **List** | `/manufacturing/boms` | — (AG Grid) |
| **Create** | `/manufacturing/boms?create=1` | `BomFormDialog` |
| **View** | `/manufacturing/boms?view=bom_002` | `BomViewDialog` |
| **Edit** | `/manufacturing/boms?edit=bom_004` | `BomFormDialog` |
| **Update** | Save in edit drawer | Zustand `patchBom` → redirect `?view={id}` |

Duplicate from grid menu → creates copy → opens **`?edit={newId}`** (still drawer, not new page).

Components: `BomViewDialog` · `BomFormDialog` (right Sheet)

---

## BOM types

`manufacturing` · `phantom` · `kit`

## View drawer tabs (`?view=`)

| Tab | Content |
|-----|---------|
| Overview | Product, version, type, std cost summary |
| Components | Qty per unit, SKU, UoM, unit/line cost |
| **Costing** | Material + labor + overhead per unit (P5b) |
| Usage | Linked work orders |

## Edit / Create drawer (`?edit=` · `?create=1`)

Product name/SKU, type, version, effective date, component lines, notes → **Save** updates store.

Grid actions: View · Edit · Duplicate

## Try it

```
/manufacturing/boms?view=bom_002     → earbuds + costing tab
/manufacturing/boms?view=bom_005     → phantom sub-assembly
/manufacturing/boms?edit=bom_004     → edit drawer
/manufacturing/boms?create=1         → create drawer
```

**Last updated:** 2026-06-17
