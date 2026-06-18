# Work Orders — UI Prototype (P1)

> **Status:** Ready (Prototype)  
> **Routes:** `/manufacturing/work-orders`  
> **Architecture:** [ARCHITECTURE.md](../../modules/manufacturing/ARCHITECTURE.md)

---

## Mandatory: Create · View · Edit · Update = Drawer only

Same pattern as **`/catalog/products`**. No separate `/new` or `/[id]/edit` pages.

| Action | URL | Drawer component |
|--------|-----|------------------|
| **List** | `/manufacturing/work-orders` | — (AG Grid) |
| **Create** | `/manufacturing/work-orders?create=1` | `WorkOrderFormDialog` |
| **View** | `/manufacturing/work-orders?view=wo_002` | `WorkOrderViewDialog` |
| **Edit** | `/manufacturing/work-orders?edit=wo_004` | `WorkOrderFormDialog` |
| **Update** | Save in edit drawer | Zustand `patchWorkOrder` → redirect `?view={id}` |

**Navigation flow:**

```text
Grid row click     → ?view={id}
Header "New WO"    → ?create=1
View drawer "Edit" → ?edit={id}   (clears view)
Form Save          → ?view={id}   (clears edit/create)
Close (X)          → list only
```

Components: `WorkOrderViewDialog` · `WorkOrderFormDialog` (right Sheet, `max-w-3xl`)

---

## States

`planned` → `released` → `in_progress` → `done` · `cancelled`

## View drawer tabs (`?view=`)

| Tab | Content |
|-----|---------|
| Overview | Status, std cost, schedule, BOM |
| **Shop floor** | Record output, ops start/complete, issue materials, log |
| Materials | Required vs issued + per-line Issue |
| Operations | Steps + Start/Complete |
| Activity | Integration panel (stock movements + journal entries) + shop floor log |

## Inventory + Accounting (P7)

Shop-floor actions post to `inventory-store` and `accounting-journal-store`:

- Release → `inventory.reserve.posted`
- Issue → `inventory.stock_out.posted` + Dr WIP / Cr Raw materials
- Output / Complete → `inventory.stock_in.posted` + Dr FG / Cr WIP

See **Activity** tab on `?view=wo_002` for seeded demo postings.

## Edit / Create drawer (`?edit=` · `?create=1`)

BOM, quantity, warehouse, priority, planned dates, notes → **Save** updates store.

## Shop floor actions (P5, inside view drawer)

Release · Start · Issue materials · Record output · Complete operation · Complete WO

## Try it

```
/manufacturing/work-orders?view=wo_002   → in progress + shop floor
/manufacturing/work-orders?view=wo_004   → planned (Release demo)
/manufacturing/work-orders?edit=wo_004   → edit drawer
/manufacturing/work-orders?create=1      → create drawer
```

**Last updated:** 2026-06-17
