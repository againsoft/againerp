# MRP — UI Prototype (P6)

> **Status:** Ready (Prototype)  
> **Routes:** `/manufacturing/mrp`  
> **Architecture:** [ARCHITECTURE.md](../../modules/manufacturing/ARCHITECTURE.md)

---

## Drawer rule

MRP uses **view drawer only** (no separate create/edit form pages).

| Action | URL | Drawer component |
|--------|-----|------------------|
| **List** | `/manufacturing/mrp` | — (AG Grid) |
| **View run** | `/manufacturing/mrp?view=mrp_001` | `MrpViewDialog` |
| **New run** | Button on list → creates draft → `?view={newId}` | Same view drawer |

Proposal **Confirm** and **Run MRP** actions happen inside the view drawer.

---

## View drawer content

- Run metadata (date, horizon, warehouse, status)  
- KPIs: WO proposed · PR proposed · shortages  
- Proposal table (work order vs purchase request)  
- **Run MRP** · **Confirm** proposal buttons  

## Try it

```
/manufacturing/mrp?view=mrp_001   → latest completed run + proposals
/manufacturing/mrp              → list → New MRP run
```

**Last updated:** 2026-06-17
