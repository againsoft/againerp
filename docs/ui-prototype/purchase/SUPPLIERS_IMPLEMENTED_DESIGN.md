# Suppliers — Implemented Design (As-Built)

> **Status:** Ready (Prototype) — **documented as built**  
> **Version:** `1.0.0`  
> **Updated:** 2026-06-15  
> **Scope:** Suppliers control center · Vendor detail · Vendor ↔ product mapping  
> **Architecture:** [PURCHASE_MODULE_ARCHITECTURE.md](../../modules/purchase/PURCHASE_MODULE_ARCHITECTURE.md)  
> **Code:** `apps/web/src/components/suppliers/` · `apps/web/src/app/(admin)/suppliers/` · `apps/web/src/lib/mock-data/suppliers.ts` · `apps/web/src/lib/mock-data/vendor-product-mapping.ts` · `apps/web/src/lib/store/vendor-mapping-store.ts`

Prototype implements **Purchase / Vendor Management** UX under route namespace **`/suppliers/*`** (canonical production target remains `/purchase/*` per architecture).

---

## Sidebar Navigation

| Menu item | Route | Notes |
|-----------|-------|-------|
| **Suppliers** (top-level, Truck icon) | — | After Inventory |
| All Suppliers | `/suppliers/all` | Vendor directory grid |
| Purchase Orders | `/suppliers/purchase-orders` | PO list tab |
| RFQ | `/suppliers/rfq` | RFQ list tab |
| Stock Feed | `/suppliers/stock-feed` | Supplier stock feed status |
| **Summary** | `/suppliers` | Last in submenu + last tab (was “Dashboard”) |

Tab bar and sidebar submenu stay in sync via `tabFromPath()` / `pathFromTab()` in `suppliers.ts`.

**Nav source:** `apps/web/src/lib/navigation.ts`

---

## Control Center (`/suppliers/*`)

Shared shell: `SupplierPageShell` → `SupplierControlCenter` + `SupplierNav`.

| Tab | Route | Content |
|-----|-------|---------|
| All Suppliers | `/suppliers/all` | Searchable vendor table; row name → detail |
| Purchase Orders | `/suppliers/purchase-orders` | Mock PO table |
| RFQ | `/suppliers/rfq` | Mock RFQ table |
| Stock Feed | `/suppliers/stock-feed` | Feed sync status per supplier |
| Summary | `/suppliers` | KPIs, spend chart, open POs, top suppliers |

### All Suppliers columns

Vendor · Contact · Terms · Lead time · Rating · Open POs · Spend YTD · Status

### Files

```
apps/web/src/app/(admin)/suppliers/page.tsx
apps/web/src/app/(admin)/suppliers/all/page.tsx
apps/web/src/app/(admin)/suppliers/purchase-orders/page.tsx
apps/web/src/app/(admin)/suppliers/rfq/page.tsx
apps/web/src/app/(admin)/suppliers/stock-feed/page.tsx
apps/web/src/components/suppliers/supplier-page-shell.tsx
apps/web/src/components/suppliers/supplier-control-center.tsx
apps/web/src/components/suppliers/supplier-nav.tsx
apps/web/src/lib/mock-data/suppliers.ts
```

---

## Vendor Detail (`/suppliers/[id]`)

Record view per [record-view.md](../../ui-ux/record-view.md) and Purchase §4 Vendor UI.

### Header

- Back → All Suppliers  
- Name, status badge (Preferred / Active / Blocked)  
- Vendor code, country, assigned buyer  
- Actions: Create PO · Send RFQ · Edit · More (block, contract, sync feed)

### Summary strip

Terms · Lead time · Rating · Spend YTD · Open POs

### Smart buttons

Open POs · Catalog · Contracts · RFQs · Bills · Receipts · Stock Feed (when connected)

### Detail tabs

| Tab | Content |
|-----|---------|
| General | Core contact profile, tax ID, website, addresses |
| Contacts | Vendor-side people (primary flag) |
| Terms | Payment terms, currency, MOQ, incoterms, vendor bills |
| Catalog | **Mapped** products + **unmapped** vendor feed SKUs (see § Mapping) |
| PO History | POs filtered by `supplierId` |
| Contracts | Active/expired contracts |
| Performance | On-time delivery %, reject rate, price variance, avg lead time |
| Activity | Procurement timeline |

### Files

```
apps/web/src/app/(admin)/suppliers/[id]/page.tsx
apps/web/src/components/suppliers/supplier-detail-workspace.tsx
```

---

## Vendor ↔ Product Mapping (Canonical)

**Single source of truth** for `purchase_vendor_items` + `inventory_supplier_items` prototype data.

| Store / data | Path |
|--------------|------|
| Seed + types | `lib/mock-data/vendor-product-mapping.ts` |
| Runtime updates | `lib/store/vendor-mapping-store.ts` |

### `VendorProductMapping` fields (as-built)

| Field | Notes |
|-------|-------|
| `supplierId` | FK → vendor (Core contact) |
| `productId` | Catalog product; `null` = feed-only SKU |
| `variantId` | Catalog variant (demo: `v1`, `v2`, `v3`) |
| `vendorSku` | Supplier part number |
| `vendorTitle` | Supplier product title |
| `vendorPrice` | Cost from supplier |
| `supplierStock` | Supplier-reported qty (not warehouse stock) |
| `stockStatus` | `in_stock` · `low` · `out` · `unknown` |
| `warranty` | e.g. None, 3 months, 1 year, Manufacturer warranty |
| `leadTimeDays` | Item-level override |
| `minOrderQty` | Vendor MOQ |
| `isPreferred` | Default supplier for PO on this product |
| `isPublishedOnWeb` | Optional storefront visibility |
| `isMapped` | `true` when linked to catalog product |

### Business rules (prototype)

1. **Same product → multiple suppliers** — each with own cost, stock, warranty, lead time.  
2. **Updates propagate everywhere** — product drawer, supplier catalog tab, store.  
3. **Not all supplier SKUs go live** — `isMapped: false` = vendor feed only; `isPublishedOnWeb: false` = internal procurement only.  
4. **Duplicate guard** — same supplier + product + variant cannot map twice.  
5. **First mapping** on a product auto-set as preferred unless overridden.

### Seed examples

| Product | Suppliers |
|---------|-----------|
| Wireless Earbuds Pro (`prod_0002`) | TechPro + Shenzhen (different cost/stock) |
| USB-C Hub (`prod_0014`) | TechPro + Shenzhen + UrbanWear |
| Smart Watch (`prod_0005`) | Shenzhen (preferred) + TechPro |
| Unmapped feed SKUs | TechPro / Shenzhen bulk items not on website |

---

## Catalog Products — Supplier Sourcing (cross-module)

Product drawer / detail includes **Supplier sourcing** section.

### When mappings exist

Table: Supplier · Vendor SKU · Cost · Supplier stock · **Warranty** · Lead · Web (Live / Internal)  
Actions: Create PO · Set preferred · Toggle web publish · **Map supplier** (add another vendor)

### When no mapping

Empty state + **Map supplier** button → opens `MapSupplierSheet`.

### Map supplier sheet fields

| Field | UI |
|-------|-----|
| Catalog variant | Select (`demoVariants`) |
| Supplier | Select (blocked vendors disabled) |
| Vendor SKU | Text |
| Cost (৳) | Number |
| Supplier stock | Number |
| **Stock status** | Select (auto-suggested from qty; manual override) |
| **Warranty** | Select (`VENDOR_WARRANTY_OPTIONS`) |
| Lead time · MOQ | Number |
| Preferred supplier | Switch |
| Publish on website | Switch |

Subtitle: *Link this product to a supplier's catalog item* (user-facing; maps to `purchase_vendor_items` in production).

### Files

```
apps/web/src/components/products/product-supplier-sourcing.tsx
apps/web/src/components/products/map-supplier-sheet.tsx
apps/web/src/components/products/product-detail-content.tsx  (embeds sourcing section)
```

---

## Route Map (Prototype vs Canonical)

| Prototype | Canonical (production) |
|-----------|------------------------|
| `/suppliers` | `/purchase` dashboard |
| `/suppliers/all` | `/purchase/vendors` |
| `/suppliers/[id]` | `/purchase/vendors/[id]` |
| `/suppliers/purchase-orders` | `/purchase/orders` |
| `/suppliers/rfq` | `/purchase/rfq` |
| `/suppliers/stock-feed` | Inventory supplier feed screens |

---

## Not Built Yet (backlog)

| Item | Notes |
|------|-------|
| Backend API / `purchase_vendor_items` table | Mock store only |
| Map product wizard from unmapped feed | Toast stub on supplier catalog |
| RFQ / PO create from mapping | Toast stub |
| Persist mapping store | In-memory Zustand (no localStorage) |
| Rename routes `/suppliers` → `/purchase` | Migration when module ships |

---

**Parent:** [purchase/README.md](./README.md) · [IMPLEMENTED_DESIGN.md](../catalog/products/IMPLEMENTED_DESIGN.md) · [UI_PROTOTYPE_MODE.md](../../UI_PROTOTYPE_MODE.md)
