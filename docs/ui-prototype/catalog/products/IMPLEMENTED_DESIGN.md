# Catalog Products — Implemented Design (As-Built)

> **Status:** Ready (Prototype) — **documented as built**  
> **Version:** `1.0.0`  
> **Updated:** 2026-06-15  
> **Scope:** Product List · Add Product · Edit Product  
> **Code:** `apps/web/src/components/products/` · `apps/web/src/app/(admin)/catalog/products/`

এই document-এ **যা code-এ build করা হয়েছে** তাই লেখা আছে। UI পরিবর্তন হলে code + এই doc একসাথে update করতে হবে।

**Screen specs:** [ProductList.md](./ProductList.md) · [AddProduct.md](./AddProduct.md) · [EditProduct.md](./EditProduct.md)

---

## Screens

| Screen | Route | Component(s) |
|--------|-------|--------------|
| Product List | `/catalog/products` | `ProductGrid`, `ProductMobileCards` |
| Product Details / Drawer | `/catalog/products` · `/catalog/products/[id]` | `ProductViewDialog` → `ProductDetailContent` |
| Add Product | `/catalog/products/new` | `ProductForm` |
| Edit Product | Modal (list / details) | `ProductFormDialog` → `ProductForm` |

---

## Shared UI Tokens

| Item | Value |
|------|-------|
| Base font | `14px` |
| Page title | `.page-title` — `text-lg font-semibold` |
| Breadcrumb | `.page-subtitle` — `11px muted` |
| Borders | `border-input` — light `#e2e8f0` · dark `#2a3544` |
| Primary | `#4f46e5` (light) · `#6366f1` (dark) |
| Compact density | AG Grid row `34px`, header `34px` |

---

## Product List — As Built

### Header
- Title `Products` + count `(120)` from mock data
- Buttons: **Import** · **Export** · **+ Add Product** → `/catalog/products/new`
- Breadcrumb: `AgainERP › Ecommerce › Catalog › Products`

### Filter bar
- Live search (SKU, name)
- **Website** — All products / On website / Not on website (published + public visibility + active category)
- **Category** — searchable dropdown; hierarchical two-line labels (parent path small, caption/name larger); matches name, caption, ancestors, slug
- **Brand** — searchable dropdown
- **Stock** — in stock / low / out
- **Filters** sheet — show/hide toolbar filters (search, **website**, status, category, brand, stock, price range)
- **Live edit** sheet — toggle inline fields: Product title, Category, Brand, Slug, SKU, Price, Stock, Status
- **Columns** sheet — toggle image, SKU, slug, price, stock, status, **web**, brand, category, updated

### Category column
- Subcategories: top line `8px` muted parent path (`Laptops › Gaming Laptop` when depth > 2, root omitted); bottom line `13px` medium caption (`HP`)
- Single parent: parent name on top, caption below
- Root category: name only
- Inline edit: `agSelectCellEditor` from active `categoriesFlat` when Live edit → Category enabled

### AG Grid table
- Provider: `AgGridSetup` + `AllCommunityModule`
- Theme: `theme="legacy"` · `ag-theme-quartz` · dark: `ag-theme-quartz-dark` via `useIsDark`
- Full viewport height (`flex-1`, `h-0 min-h-0`)
- Pagination: 25 rows
- Inline edit (per Live edit sheet): name, category, brand, slug, SKU, price, stock, status
- **Live edit defaults:** SKU, price, stock, status on; name, category, brand, slug off
- Column resize (header edge drag) · column reorder (header drag)
- Name: link to details when title live edit off; truncate + tooltip, width 280 (min 120, max 720)
- Slug column: hideable, default hidden
- **Web column:** green ✓ = live on storefront; — = not live (hover tooltip: not published / private / inactive category / archived)
- Row menu (⋮): View · Edit · **Publish to website** / **Remove from website** · Archive
- Bulk bar on select: **publish to website** · **remove from website** · archive · export selected
- Archive: confirm modal
- Empty state when filters match nothing
- Footer: `Showing 1–25 of N · drag column edges to resize · drag headers to reorder`
- Cell update toast: bottom-right compact Sonner

### Dark mode
- Grid background `--card`, header `--muted`, borders `--input`
- Forced dark surfaces on `.ag-root-wrapper`, rows, paging panel

### Mobile (`< md`)
- Grid hidden
- `ProductMobileCards` — image, name, SKU, price, stock, status, row menu
- FAB bottom-right → `/catalog/products/new`
- Header action buttons hidden on small screens (FAB only)

### Files
```
apps/web/src/components/products/product-grid.tsx
apps/web/src/components/products/product-mobile-cards.tsx
apps/web/src/app/(admin)/catalog/products/page.tsx
apps/web/src/components/providers/ag-grid-provider.tsx
apps/web/src/components/providers/app-providers.tsx
apps/web/src/lib/category-utils.ts
apps/web/src/lib/use-is-dark.ts
apps/web/src/lib/mock-data/products.ts
apps/web/src/lib/mock-data/categories.ts
```

### Mock product fields (list)
| Field | Notes |
|-------|-------|
| `slug` | URL slug; live-editable; `getProductBySlug()` resolves slug, sku, or id |
| `category` | Name from `categoriesFlat` (incl. subcategories) |

---

## Add Product — As Built

### Page
- Route: `/catalog/products/new` (no sidebar menu — open from Product List only)

### Entry (no sidebar item)
- Product List → **+ Add Product** button
- Product List → mobile FAB
- Quick create (⌘K) → Product

### Desktop layout
- Back arrow → product list
- Header: title · status badge · autosave text · Discard · Save draft · Publish
- Left nav: 9 sections (fixed order below)
- Right: scrollable form (`max-w-3xl`)

### Mobile layout
- Short breadcrumb: `Catalog › Products › Add`
- Sticky horizontal **section pills** (icon + label, scroll)
- Single-column fields
- **Fixed bottom bar:** Discard · Save draft · Publish
- `pb-20` on page so content clears bottom bar

### Sections (built)

| # | Section | Built UI |
|---|---------|----------|
| 1 | General | name*, SKU*, category+, brand+, status, tags, short desc, rich text toolbar mock |
| 2 | Pricing | price*, compare-at, cost, tax class, BDT preview |
| 3 | Inventory | qty*, warehouse, low stock alert, track checkbox |
| 4 | Variants | `ProductVariantEditor` — type toggle, dimension rows, generate matrix, SKU/price/stock, default star |
| 5 | Specifications | `ProductSpecEditor` — profile assignment + spec values |
| 6 | SEO | slug, meta title/desc + char count, SERP preview, Generate SEO |
| 7 | Media | upload btn, library link, drop zone, 2–6 col image grid picker |
| 8 | Related | search input, 3 mock linked products |
| 9 | AI Tools | 4 mock action cards |

### Save behavior (mock)
- Name required → toast error
- Save draft / Publish → toast → redirect list or close modal

### Files
```
apps/web/src/components/products/product-form.tsx
apps/web/src/components/products/product-variant-editor.tsx
apps/web/src/lib/mock-data/variants.ts
apps/web/src/components/products/rich-text-editor.tsx
apps/web/src/app/(admin)/catalog/products/new/page.tsx
apps/web/src/components/ui/textarea.tsx
apps/web/src/components/ui/label.tsx
```

---

## Product Drawer / Details — Supplier Sourcing (2026-06-15)

Right sheet drawer (`ProductViewDialog`) and full detail use `ProductDetailContent`.

### Layout (drawer)

- Header: status, SKU, title, Open page / Edit  
- Summary strip: price, stock, category, brand  
- Gallery + variants (side-by-side on `sm+`)  
- Description · Specifications  
- **Supplier sourcing** — multi-vendor cost/stock table  

### Supplier sourcing section

| State | UI |
|-------|-----|
| No mapping | Empty state + **Map supplier** |
| Has mappings | Table: supplier, vendor SKU, cost, supplier stock, warranty, lead, web badge |
| Multi-supplier | All vendors for active variant; lowest cost highlighted; preferred ★ |

**Actions:** Map supplier · Create PO (stub) · Set preferred · Toggle web publish

### Map supplier sheet

Opens from **Map supplier** — links product variant to vendor catalog item.

| Field | Notes |
|-------|-------|
| Catalog variant | `demoVariants` |
| Supplier | From `suppliersSeed`; blocked disabled |
| Vendor SKU · Cost · Supplier stock | Required for save |
| Stock status | Auto from qty; manual override |
| Warranty | Select: None → Manufacturer warranty |
| Lead time · MOQ | Defaults from supplier profile |
| Preferred · Publish on website | Switches |

Data saved to `vendor-mapping-store` → syncs to `/suppliers/[id]` Catalog tab.

**Cross-ref:** [SUPPLIERS_IMPLEMENTED_DESIGN.md](../../purchase/SUPPLIERS_IMPLEMENTED_DESIGN.md)

### Files

```
apps/web/src/components/products/product-view-dialog.tsx
apps/web/src/components/products/product-detail-content.tsx
apps/web/src/components/products/product-supplier-sourcing.tsx
apps/web/src/components/products/map-supplier-sheet.tsx
apps/web/src/lib/mock-data/vendor-product-mapping.ts
apps/web/src/lib/store/vendor-mapping-store.ts
```

---

## Global Variants List — As Built

- Route: `/catalog/variants` (sidebar: Catalog → Variants)
- `VariantCatalogList` — search, category filter, table of sellable SKUs
- Variable `prod_0002` shows 3 child rows; simple products show one default row each

### Files
```
apps/web/src/app/(admin)/catalog/variants/page.tsx
apps/web/src/components/variants/variant-catalog-list.tsx
```

---

## Edit Product — As Built

- Same `ProductForm` with `mode="edit"` + `initialProduct` from mock
- Opens in `ProductFormDialog` from list row menu or details **Edit** button
- Desktop: modal with inset padding
- Mobile: full-screen modal (`inset-0`), actions in header (no bottom bar duplicate when `compact`)

### Files
```
apps/web/src/components/products/product-form-dialog.tsx
```

---

## Navigation Map

| User action | Goes to |
|-------------|---------|
| List → + Add Product | `/catalog/products/new` |
| List → mobile FAB | `/catalog/products/new` |
| Quick create (⌘K) → Product | `/catalog/products/new` |
| List → ?create=1 | redirect → `/new` |
| Row name click | `/catalog/products/[id]` |
| Row ⋮ View | `/catalog/products/[id]` |
| Row ⋮ Edit | Edit modal |
| Details → Edit | Edit modal |
| Drawer → Map supplier | `MapSupplierSheet` → updates vendor mapping store |
| Drawer → supplier name | `/suppliers/[id]` |

---

## Not Built Yet (backlog)

| Item | Notes |
|------|-------|
| TipTap real editor | Toolbar mock only |
| Media library popup | Link to `/media` only |
| Backend API / DB save | Prototype mock |
| Dedicated edit route | Modal only |
| Bulk import/export pages | Toast mock on list |
| PO create from supplier row | Toast stub |

---

**Parent:** [UI_PROTOTYPE_MODE.md](../../../UI_PROTOTYPE_MODE.md) · [ECOMMERCE_ADMIN_PROTOTYPE_PHASE1.md](../../../ECOMMERCE_ADMIN_PROTOTYPE_PHASE1.md)
