# Manufacturing — UI Prototype Index

> **Build guide:** [**MANUFACTURING_UI_BUILD_GUIDE.md**](./MANUFACTURING_UI_BUILD_GUIDE.md)  
> **Architecture:** [ARCHITECTURE.md](../../modules/manufacturing/ARCHITECTURE.md)

Prototype routes: **`/manufacturing/*`**

---

## Implemented

| Screen | Route | Drawer (create · view · edit) | Status |
|--------|-------|----------------------------------|--------|
| Overview | `/manufacturing` | — | ✅ KPIs + demo links |
| Work Orders | `/manufacturing/work-orders` | ✅ create · view · edit | ✅ P1 |
| BOMs | `/manufacturing/boms` | ✅ create · view · edit | ✅ P2 |
| Work Centers | `/manufacturing/work-centers` | ✅ create · view · edit | ✅ P3 |
| Routings | `/manufacturing/routings` | ✅ create · view · edit | ✅ P4 |
| MRP | `/manufacturing/mrp` | ✅ view only | ✅ P6 |
| Shop floor | WO drawer tabs | ✅ (inside `?view=`) | ✅ P5 |
| BOM costing | BOM drawer **Costing** tab | ✅ (inside `?view=`) | ✅ P5b |
| Inventory + Accounting | WO drawer **Activity** tab | ✅ (inside `?view=`) | ✅ P7 |

---

## Mandatory UI rule — drawer only

**Create, view, edit, and update** must all use the **product-style right Sheet drawer** — never separate pages.

| Action | URL | UI |
|--------|-----|-----|
| List | `/manufacturing/work-orders` | AG Grid |
| **Create** | `?create=1` | Form drawer |
| **View** | `?view=wo_002` | Read-only drawer |
| **Edit** | `?edit=wo_004` | Form drawer |
| **Update** | Save in edit drawer | Store patch → `?view={id}` |

Same pattern for **BOMs**, **Work Centers**, **Routings** (`?create=1`, `?view=`, `?edit=`).

Reference: `/catalog/products` · `product-view-dialog.tsx` · `product-form-dialog.tsx`

### ❌ Not allowed

- `/manufacturing/*/new` routes  
- Full-page create/edit forms  
- `Dialog` modals for entity CRUD  

Details: [MANUFACTURING_UI_BUILD_GUIDE.md §2](./MANUFACTURING_UI_BUILD_GUIDE.md#2-mandatory-ui-rule--create--view--edit--update--drawer-only)

---

## Entity docs

| Doc | Entity |
|-----|--------|
| [WorkOrders.md](./WorkOrders.md) | Work orders + shop floor |
| [Boms.md](./Boms.md) | Bills of materials + costing |
| [WorkCenters.md](./WorkCenters.md) | Work centers |
| [Routings.md](./Routings.md) | Routings |
| [Mrp.md](./Mrp.md) | MRP runs |

**Last updated:** 2026-06-17
