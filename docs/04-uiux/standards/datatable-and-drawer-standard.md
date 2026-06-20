# DataTable & Drawer Standard (Product List Reference)

> **Status:** Active  
> **Version:** 1.0  
> **Date:** 2026-06-20  
> **Authority:** [PROJECT_COMMON_RULES.md](../../00-foundation/PROJECT_COMMON_RULES.md) §4–5  
> **Reference implementation:** `/catalog/products` — `ProductGrid` · `ProductViewDialog` · `ProductFormDialog`

---

## Rule (mandatory)

**যেখানেই list/datatable দরকার, সেখানে Catalog Product List-এর একই DataTable pattern ব্যবহার করতে হবে।**  
**Create · View · Edit — সব right Sheet drawer-এ, URL query দিয়ে।**  
**Drawer অবশ্যই mobile responsive (full-width small screens, scroll inside).**

Custom one-off tables, separate `/new` routes, বা desktop-only modals — standard entity CRUD-এ allowed নয়।

---

## 1. When this applies

| Applies | Does not replace |
|---------|------------------|
| Entity list pages (Products, Invoices, Journals, Leads, …) | Dashboard widgets |
| Master data grids (Categories, Brands, COA postable list, …) | Kanban / pipeline boards |
| Transaction lists (Orders, Bills, Receipts, …) | Report pivot tables |
| Settings pickers with many rows | Single-form settings pages |

---

## 2. DataTable — Product List standard

**Code reference:** `apps/web/src/components/products/product-grid.tsx`

### Stack

| Item | Standard |
|------|----------|
| Grid | `AgGridReact` (`ag-grid-community` + `ag-grid-react`) |
| Theme | `theme="legacy"` · `ag-theme-quartz` · `control-border` · `bg-card` |
| Dark | `useIsDark()` → add `ag-theme-quartz-dark` |
| Provider | `AgGridSetup` / `AllCommunityModule` (app root) |
| Container | `flex-1` · `h-0 min-h-0` · `overflow-hidden` · `rounded-md` |

### defaultColDef (minimum)

```tsx
defaultColDef={{
  sortable: true,
  resizable: true,
  filter: false,
  suppressHeaderMenuButton: true,
  minWidth: 72,
}}
```

### List behaviour

| Feature | Rule |
|---------|------|
| Pagination | Yes — default page size **25** |
| Row selection | Module need অনুযায়ী single/multiple |
| Row click | Opens **`?view={id}`** drawer (not inline expand) |
| Row menu (⋮) | **View** · **Edit** · module actions |
| Inline edit | Optional — Live edit toggle (Products pattern) |
| Footer | `Showing X–Y of N` + resize/reorder hint |
| Empty state | Filter-aware message |

### Mobile (`< md` or `< lg` per module)

| Rule | Implementation |
|------|----------------|
| Hide AG Grid | `hidden md:block` or `hidden lg:block` |
| Card fallback | `{Entity}MobileCards` — same data, row menu |
| FAB create | Fixed bottom-right → `?create=1` |
| Horizontal scroll | Only if card fallback না থাকে — prefer cards |

**Reference:** `ProductMobileCards` in `product-mobile-cards.tsx`

### Do not

- Raw `<table>` for primary entity lists (except tiny embedded sub-grids inside a drawer)
- Different grid theme per module without architecture approval
- Fixed pixel height only (`height: 420`) without flex fill — use flex parent + `min-h-0`

---

## 3. Drawer — Create · View · Edit

**Code reference:**  
- List orchestration: `apps/web/src/app/(admin)/catalog/products/page.tsx`  
- View drawer: `product-view-dialog.tsx`  
- Create/edit drawer: `product-form-dialog.tsx`

### URL contract (mutually exclusive)

| Action | Query | Drawer content |
|--------|-------|----------------|
| **Create** | `?create=1` | Form — empty / defaults |
| **View** | `?view={id}` | Read-only detail |
| **Edit** | `?edit={id}` | Form — populated |

```text
✅ /finance/invoices?create=1
✅ /finance/invoices?view=ar-1
✅ /finance/invoices?edit=ar-1

❌ /finance/invoices/new
❌ /finance/invoices/ar-1/edit
```

### Page orchestration pattern

```tsx
const createOpen = searchParams.get("create") === "1";
const editId = searchParams.get("edit");
const viewId = searchParams.get("view");
// pushParams mutates URL — scroll: false
```

Only **one** drawer mode open at a time. View → Edit switches `?view` → `?edit`.

### Sheet markup (required)

```tsx
<Sheet open={open} onOpenChange={...}>
  <SheetContent
    side="right"
    className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
  >
    <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
      {/* header · tabs · scroll body · footer actions */}
    </div>
  </SheetContent>
</Sheet>
```

| Rule | Detail |
|------|--------|
| **No** `SheetHeader` / `SheetFooter` shadcn wrappers | Custom header inside content (project convention) |
| Width mobile | `w-full` — full viewport |
| Width desktop | `max-w-3xl` (wide forms) or `max-w-lg` (simple docs) |
| Scroll | Inside drawer body — `overflow-y-auto` on inner region, not whole page |
| Close | URL param clear on close |
| Tap targets | Min **44×44px** on actions |

### View drawer contents

- Record header (number, status badges)
- KPI/summary strip (optional)
- Tabs: Lines · Payments · Activity · …
- Primary actions: Edit · Post · module-specific
- **Edit** button → `?edit={id}`

### Create/edit drawer contents

- Form fields + validation
- Save / Save draft / Cancel
- Toast on success; close or switch to `?view={id}`

---

## 4. Module implementation checklist

New or updated list screen:

- [ ] Grid matches Product List AG Grid stack (theme, container, pagination)
- [ ] Mobile card fallback or documented exception
- [ ] `?create=1` · `?view=` · `?edit=` wired on list page
- [ ] View + Form in **Sheet** drawers (mobile full-width)
- [ ] Row click → view; menu → view / edit
- [ ] No `/new` or `/[id]/edit` routes for standard CRUD
- [ ] Screen doc updated in module UI plan / `Menus/*.md`

---

## 5. Finance module alignment note

Finance list pages (Journals, AR, AP, Receipts, …) must migrate to this standard:

| Current gap | Target |
|-------------|--------|
| Inline `SheetContent` without URL params | Page-level `?view` / `?create` / `?edit` |
| Fixed `height: 420` grid | Flex `ProductGrid`-style container |
| No mobile card fallback | `{Entity}MobileCards` or shared card list |
| Narrow `sm:max-w-lg` sheets | `max-w-3xl` + `min-h-0` scroll body |

See [FINANCE_UI_IMPLEMENTATION_PLAN.md](../../03-business-modules/finance/FINANCE_UI_IMPLEMENTATION_PLAN.md) §6.

---

## 6. Related docs

| Doc | Topic |
|-----|-------|
| [PROJECT_COMMON_RULES.md](../../00-foundation/PROJECT_COMMON_RULES.md) | Drawer + mobile rules |
| [page-architecture.md](./page-architecture.md) | Page stack |
| [mobile-first.md](./mobile-first.md) | Breakpoints |
| [IMPLEMENTED_DESIGN.md](../prototype/catalog/products/IMPLEMENTED_DESIGN.md) | Product List as-built |

---

## Change History

| Date | Change |
|------|--------|
| 2026-06-20 | v1.0 — Product List DataTable + drawer standard |
