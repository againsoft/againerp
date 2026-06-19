# Manufacturing Module — UI Build Guide (Prototype Only)

> **Status:** Active playbook  
> **Scope:** UI only — mock data, no API/DB/auth  
> **Architecture:** [ARCHITECTURE.md](../../../03-business-modules/manufacturing/ARCHITECTURE.md)  
> **Parent:** [UI_PROTOTYPE_MODE.md](../../strategy/UI_PROTOTYPE_MODE.md)  
> **Common rules:** [PROJECT_COMMON_RULES.md](../../../00-foundation/PROJECT_COMMON_RULES.md)

## Purpose
Documentation: MANUFACTURING UI BUILD GUIDE.

## When To Read
Read only if your task involves manufacturing ui build guide.

## Related Files
- [Cursor entry](../../../BRAIN.md)

## Read Next
- [Doc map](../../../PROJECT_MAP.md)

---

Prototype route namespace: **`/manufacturing/*`**

---

## 1. Module summary (from docs)

Manufacturing = **Plan → Produce → Receive FG** — BOM, routing, work orders, material issue, finished goods.

```text
Demand (SO / Forecast)
        ↓
   MRP Run → Purchase Requests + Work Orders
        ↓
Work Order: Planned → Released → In Progress → Done
        ↓
   Material Issue (Inventory ↓) + FG Receipt (Inventory ↑)
```

| Entity | Table prefix | Prototype screen |
|--------|--------------|------------------|
| Work Order | `manufacturing_work_orders` | `/manufacturing/work-orders` + **drawer** |
| BOM | `manufacturing_boms` | `/manufacturing/boms` + **drawer** |
| Routing | `manufacturing_routings` | `/manufacturing/routings` + **drawer** |
| Work Center | `manufacturing_work_centers` | `/manufacturing/work-centers` + **drawer** |
| MRP Run | `manufacturing_mrp_runs` | `/manufacturing/mrp` + **view drawer** |

---

## 2. Mandatory UI rule — Create · View · Edit · Update = Drawer only

> **Copy pattern from:** `/catalog/products`  
> Reference files: `catalog/products/page.tsx`, `product-view-dialog.tsx`, `product-form-dialog.tsx`

### 2.1 What you MUST do

| User action | UI | URL (query param) | Component |
|-------------|-----|-------------------|-----------|
| **List** | AG Grid on list page | `/manufacturing/{entity}` | `*-grid.tsx` |
| **View** (read-only) | Right **Sheet** drawer | `?view={id}` | `*-view-dialog.tsx` → `*-detail-content.tsx` |
| **Create** | Same **Sheet** drawer (form mode) | `?create=1` | `*-form-dialog.tsx` → `*-form.tsx` |
| **Edit** | Same **Sheet** drawer (form mode) | `?edit={id}` | `*-form-dialog.tsx` → `*-form.tsx` |
| **Update** (save changes) | Save inside **edit drawer** — no new page | stays on `?edit={id}` or redirects to `?view={id}` | form `onSaved` → patch Zustand store |

**Rules:**

1. **Never** add separate routes like `/manufacturing/work-orders/new` or `/manufacturing/boms/[id]/edit`.
2. **Never** use full-page forms for create/edit — always right `Sheet` (`side="right"`, `max-w-3xl`, hide default close with `[&>button.absolute]:hidden`).
3. **View** and **Edit** are different drawers/modes but same list page underneath (URL-driven, like Products).
4. **Update** = user clicks Save in the **edit drawer**; list refreshes from store; optionally switch URL to `?view={id}`.
5. Row click / WO# link → open **view** drawer (`?view=`). Grid menu → View | Edit.
6. Header **Edit** button in view drawer → set `?edit={id}` (clear `view` / `create`).
7. **Activity** icon stays in grid/drawer header (`ActivityTriggerButton`) — not a separate page.

### 2.2 Sheet drawer spec (all entities)

```tsx
<Sheet open={open} onOpenChange={...}>
  <SheetContent
    side="right"
    className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
  >
    {/* *DetailContent or *Form inside */}
  </SheetContent>
</Sheet>
```

### 2.3 URL param mutual exclusion

Only one drawer mode at a time. When opening create/edit/view, clear the other params:

```text
?create=1           → form drawer (create)
?edit=wo_004        → form drawer (edit) — update on save
?view=wo_002        → view drawer (read-only)
(mnone)             → list only
```

Page pattern (every list route):

```tsx
const createOpen = searchParams.get("create") === "1";
const editId = searchParams.get("edit");
const viewId = searchParams.get("view");
// WorkOrderViewDialog open when viewId && !create && !edit
// WorkOrderFormDialog open when createOpen || editId
```

### 2.4 Per-entity URL contract

| Entity | List | Create | View | Edit |
|--------|------|--------|------|------|
| Work Orders | `/manufacturing/work-orders` | `?create=1` | `?view=wo_002` | `?edit=wo_004` |
| BOMs | `/manufacturing/boms` | `?create=1` | `?view=bom_002` | `?edit=bom_004` |
| Work Centers | `/manufacturing/work-centers` | `?create=1` | `?view=wc_001` | `?edit=wc_005` |
| Routings | `/manufacturing/routings` | `?create=1` | `?view=rt_001` | `?edit=rt_005` |
| MRP | `/manufacturing/mrp` | — (New run → view draft) | `?view=mrp_001` | — |

MRP: **view-only drawer** for run detail + proposals; **New MRP run** creates draft in store and opens `?view={newId}`.

### 2.5 What NOT to do

| ❌ Don't | ✅ Do instead |
|---------|----------------|
| `/manufacturing/boms/new` page | `/manufacturing/boms?create=1` |
| Full-page edit at `/work-orders/[id]` | `?edit=wo_002` drawer |
| Modal `Dialog` for CRUD | Right `Sheet` drawer |
| Inline edit as only way to create | Grid list + create drawer |
| Navigate away on Save | Close form drawer → `?view={id}` or list |

---

## 3. Build phases

| Phase | Screen | Route | Drawer modes | Status |
|-------|--------|-------|--------------|--------|
| P1 | Work Orders | `/manufacturing/work-orders` | view · edit · create | ✅ |
| P2 | BOMs | `/manufacturing/boms` | view · edit · create | ✅ |
| P3 | Work Centers | `/manufacturing/work-centers` | view · edit · create | ✅ |
| P4 | Routings | `/manufacturing/routings` | view · edit · create | ✅ |
| P5 | Shop floor (WO drawer tabs) | WO `?view=` | shop floor · ops · issue · output | ✅ |
| P5b | Standard cost | BOM `?view=` | costing tab | ✅ |
| P6 | MRP runs | `/manufacturing/mrp` | view | ✅ |
| P7 | Inventory + Accounting hookup | WO `?view=` Activity tab | stock movements + JE | ✅ |

### P7 — Inventory + Accounting integration

Manufacturing shop-floor actions post to shared mock stores:

| WO action | Inventory event | Accounting (GL) |
|-----------|-----------------|-----------------|
| **Release** | `inventory.reserve.posted` — RM reserved | — |
| **Issue materials** | `inventory.stock_out.posted` — RM on-hand ↓ | Dr **1310 WIP** / Cr **1200 Raw materials** |
| **Record output** | `inventory.stock_in.posted` — FG on-hand ↑ | Dr **1300 Finished goods** / Cr **1310 WIP** |
| **Complete WO** | Final FG receipt (remaining qty) | Same as output |

**Warehouse map:** `WH-DHK` → Dhaka HQ · `WH-CTG` → Chittagong · `WH-SYL` → Online FC

**Files:**

- `lib/store/inventory-store.ts` — stock items + movement ledger
- `lib/store/accounting-journal-store.ts` — journal entries
- `lib/services/manufacturing-integration.ts` — bridge from WO store
- `components/manufacturing/work-order-integration-panel.tsx` — Activity tab UI

**Demo:** `/manufacturing/work-orders?view=wo_002` → **Activity** tab shows seeded movements + journals; issue/output updates live stock in `/inventory`.

---

## 4. Work Order drawer layout

### View drawer (`WorkOrderDetailContent`) — `?view=`

| Tab | Content |
|-----|---------|
| Overview | Status, qty, std cost, BOM link, schedule |
| Shop floor | Record output, operation start/complete, issue materials, log |
| Materials | Components — required vs issued + per-line Issue |
| Operations | Routing steps + Start/Complete actions |
| Activity | Integration panel (movements + JE) + shop floor log |

Header: **Release** · **Start** · **Issue materials** · **Complete WO** · **Edit** (→ `?edit=`) · Close

### Edit / Create drawer (`WorkOrderForm`) — `?edit=` · `?create=1`

| Section | Fields |
|---------|--------|
| General | BOM, quantity, warehouse, priority |
| Schedule | Planned start / end |
| Notes | Free text |

**Save** = update Zustand store · **Close** clears `create`/`edit` params

---

## 5. BOM drawer layout

### View — `?view=`

| Tab | Content |
|-----|---------|
| Overview | Product, type, std cost summary |
| Components | Lines + unit/line cost |
| Costing | Material + labor + overhead breakdown |
| Usage | Linked work orders |

### Edit / Create — `?edit=` · `?create=1`

Product, type, version, effective date, component lines, notes. **Save** updates store.

---

## 6. Work Center & Routing drawers

Same drawer contract: `*-view-dialog.tsx` + `*-form-dialog.tsx` on list page.

- **Work Center** view tabs: Overview · Capacity · Operations  
- **Routing** view tabs: Overview · Operations · Usage  
- **Routing** form: Save draft · Save & activate · Mark obsolete (in drawer)

---

## 7. File structure

```
apps/web/src/
├── app/(admin)/manufacturing/
│   ├── page.tsx
│   ├── work-orders/page.tsx      # list + view/edit/create drawers
│   ├── boms/page.tsx
│   ├── work-centers/page.tsx
│   ├── routings/page.tsx
│   └── mrp/page.tsx                # list + view drawer
├── components/manufacturing/
│   ├── manufacturing-nav.tsx
│   ├── manufacturing-page-shell.tsx
│   ├── manufacturing-control-center.tsx
│   ├── manufacturing-ag-grid.tsx
│   ├── work-order-grid.tsx
│   ├── work-order-detail-content.tsx
│   ├── work-order-view-dialog.tsx
│   ├── work-order-form.tsx
│   ├── work-order-form-dialog.tsx
│   ├── work-order-shop-floor-tab.tsx
│   ├── bom-grid.tsx · bom-detail-content.tsx · bom-view-dialog.tsx · bom-form*.tsx
│   ├── bom-cost-panel.tsx
│   ├── work-center-*.tsx
│   ├── routing-*.tsx
│   └── mrp-grid.tsx · mrp-detail-content.tsx · mrp-view-dialog.tsx
└── lib/
    ├── mock-data/
    │   ├── manufacturing.ts
    │   ├── manufacturing-boms.ts
    │   ├── manufacturing-work-orders.ts
    │   ├── manufacturing-work-centers.ts
    │   ├── manufacturing-routings.ts
    │   ├── manufacturing-mrp.ts
    │   ├── manufacturing-cost.ts
    │   ├── inventory-integration-seed.ts
    │   └── accounting-journal.ts
    ├── services/
    │   └── manufacturing-integration.ts
    └── store/
        ├── manufacturing-work-order-store.ts
        ├── manufacturing-bom-store.ts
        ├── manufacturing-work-center-store.ts
        ├── manufacturing-routing-store.ts
        ├── manufacturing-mrp-store.ts
        ├── inventory-store.ts
        └── accounting-journal-store.ts
```

---

## 8. Adding a new manufacturing screen (checklist)

- [ ] List page: AG Grid + `Suspense` for `useSearchParams`
- [ ] `?create=1` → `*FormDialog` (Sheet)
- [ ] `?edit={id}` → same `*FormDialog` with entity loaded
- [ ] `?view={id}` → `*ViewDialog` (Sheet) read-only
- [ ] Save in form → Zustand patch → `router.push(?view={id})` or close params
- [ ] No `/new` or `/[id]/edit` routes
- [ ] `npx tsc --noEmit` passes

---

## 9. Navigation

```typescript
{
  title: "Manufacturing",
  icon: Factory,
  children: [
    { title: "Overview", href: "/manufacturing" },
    { title: "Work Orders", href: "/manufacturing/work-orders" },
    { title: "Bills of Materials", href: "/manufacturing/boms" },
    { title: "Work Centers", href: "/manufacturing/work-centers" },
    { title: "Routings", href: "/manufacturing/routings" },
    { title: "MRP", href: "/manufacturing/mrp" },
  ],
}
```

---

**Last updated:** 2026-06-17 (P7 inventory + accounting hookup)
