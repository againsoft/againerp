# Purchase / Suppliers — UI Prototype Index

> **Status:** **Partially implemented** (Suppliers prototype live)  
> **Architecture:** [PURCHASE_MODULE_ARCHITECTURE.md](../../modules/purchase/PURCHASE_MODULE_ARCHITECTURE.md)  
> **Workflows:** [PURCHASE_WORKFLOW.md](../../modules/purchase/PURCHASE_WORKFLOW.md)  
> **As-built:** [SUPPLIERS_IMPLEMENTED_DESIGN.md](./SUPPLIERS_IMPLEMENTED_DESIGN.md)  
> **Canonical route namespace:** `/purchase/*` · **Prototype routes:** `/suppliers/*`

---

## Implemented (2026-06-15)

| Screen | Prototype route | Status |
|--------|-----------------|--------|
| Summary | `/suppliers` | ✅ KPIs + charts |
| All Suppliers | `/suppliers/all` | ✅ List + link to detail |
| Vendor detail | `/suppliers/[id]` | ✅ Record view + tabs |
| Purchase Orders | `/suppliers/purchase-orders` | ✅ Mock table |
| RFQ | `/suppliers/rfq` | ✅ Mock table |
| Stock Feed | `/suppliers/stock-feed` | ✅ Mock table |
| Vendor ↔ product mapping | Product drawer + supplier catalog | ✅ Zustand store |
| Map supplier sheet | Product drawer | ✅ Form with stock status + warranty |

---

## Planned (not in prototype yet)

| Screen | Canonical route | Reference |
|--------|-----------------|-----------|
| Dashboard (purchase module) | `/purchase` | — |
| Quotations | `/purchase/quotations` | PURCHASE_WORKFLOW |
| Goods Receipts | `/purchase/receipts` | PURCHASE_WORKFLOW §3 |
| Vendor Bills | `/purchase/bills` | PURCHASE_WORKFLOW §4 |
| Returns | `/purchase/returns` | PURCHASE_WORKFLOW §5 |
| Contracts (standalone list) | `/purchase/contracts` | — |
| Reports | `/purchase/reports` | — |
| AI Suggestions | Dashboard widget | PurchaseSuggestions.md |

---

## Current Code

```
apps/web/src/lib/navigation.ts                    # Suppliers sidebar
apps/web/src/app/(admin)/suppliers/               # All supplier routes
apps/web/src/components/suppliers/                  # Control center + detail
apps/web/src/lib/mock-data/suppliers.ts
apps/web/src/lib/mock-data/vendor-product-mapping.ts
apps/web/src/lib/store/vendor-mapping-store.ts
apps/web/src/components/products/
  product-supplier-sourcing.tsx
  map-supplier-sheet.tsx
  product-detail-content.tsx                      # Supplier sourcing section
```

**Related:** Inventory control center at `/inventory` · Catalog products at `/catalog/products`
