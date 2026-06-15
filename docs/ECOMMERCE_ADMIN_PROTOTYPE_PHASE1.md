# Ecommerce Admin UI Prototype — Phase 1

> **Status:** Active — **implementation started**  
> **Code:** `apps/web/` · `npm run dev`  
> **Parent:** [UI_PROTOTYPE_MODE.md](./UI_PROTOTYPE_MODE.md)

---

## Phase Rules

| Allowed | Forbidden |
|---------|-----------|
| Next.js UI in `apps/web/` | Backend, APIs, database |
| Mock JSON / in-memory data | Authentication |
| Mock AI responses | Live LLM |

---

## Scope (Ecommerce Admin Only)

Dashboard · Catalog (Products, Categories, Brands, Attributes, Variants, Filters, Reviews) · Customers · Orders · Inventory · Marketing · SEO · Media · Reports · System · AI OS

**Not in Phase 1:** ERP modules (CRM, Accounting, HR, …)

---

## Deliverables

| # | Deliverable | Route | Doc |
|---|-------------|-------|-----|
| 1 | Admin shell | `/(admin)/*` | [PROTOTYPE_SHELL.md](./ui-prototype/PROTOTYPE_SHELL.md) |
| 2 | Sidebar navigation | — | MENU_STRUCTURE |
| 3 | Header | — | Phase 1 § Header |
| 4 | Dashboard | `/dashboard` | `ui-prototype/dashboard/` |
| 5 | Product List | `/catalog/products` | [ProductList.md](./ui-prototype/catalog/products/ProductList.md) |
| 6 | Product Details | `/catalog/products/[id]` | ProductDetails.md |
| 7 | Product Create | `/catalog/products/new` | [AddProduct.md](./ui-prototype/catalog/products/AddProduct.md) |
| 8 | Product Edit | modal (`ProductFormDialog`) | [EditProduct.md](./ui-prototype/catalog/products/EditProduct.md) |
| 9 | Media Manager | `/media` | MediaLibrary.md |
| 10 | AI Assistant | drawer | AI OS UI |

### Implementation status (2026-06-12)

| Deliverable | Status |
|-------------|--------|
| Admin shell | ✅ |
| Sidebar + all menu routes | ✅ (stubs for non-priority) |
| Header (search, ⌘K, switchers) | ✅ |
| Dashboard + charts | ✅ |
| Product List (AG Grid) | ✅ documented |
| Product Details + variant gallery | ✅ |
| Product Create + Edit | ✅ documented |
| Media Library | ✅ |
| AI Assistant drawer | ✅ |

---

## Sidebar Structure

```
Dashboard
Catalog
  ├── Products
  ├── Categories
  ├── Brands
  ├── Attributes
  ├── Variants
  ├── Filters
  ├── Reviews
  ├── Collections
  ├── Bundles
Customers
Orders
Inventory
Marketing
SEO
Media
Reports
System
AI OS
```

---

## Product List (Highest Priority)

AG Grid · live search · live filters · saved filters · column manager · bulk actions · inline edit · export/import UI · no page reload.

Spec: [ProductList.md](./ui-prototype/catalog/products/ProductList.md)

**As-built reference:** [IMPLEMENTED_DESIGN.md](./ui-prototype/catalog/products/IMPLEMENTED_DESIGN.md) — Product List + Add/Edit (matches `apps/web` code).

---

## Tri-File Documentation

Every screen: `{Screen}.md` · `{Screen}Review.md` · `{Screen}Changes.md`

---

**Last Updated:** 2026-06-12
