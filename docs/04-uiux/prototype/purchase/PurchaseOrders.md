# Purchase Orders — UI Prototype

> **Status:** Ready (Prototype) — Phase P1  
> **Route:** `/suppliers/purchase-orders` · `/suppliers/purchase-orders/[id]` · `/suppliers/purchase-orders/create`  
> **Workflow:** [PURCHASE_WORKFLOW.md](../../../03-business-modules/purchase/PURCHASE_WORKFLOW.md) §2  
> **Code:** `components/purchase/purchase-order-*.tsx` · `lib/mock-data/purchase-orders.ts`

---

## Screens

| Screen | Route | Component |
|--------|-------|-----------|
| PO List | `/suppliers/purchase-orders` | `PurchaseOrderGrid` |
| PO Detail | `/suppliers/purchase-orders/[id]` | `PurchaseOrderDetail` |
| Create PO | `/suppliers/purchase-orders/create` | `PurchaseOrderForm` |

## PO List

- AG Grid with checkbox select
- Filters: search, status, vendor, warehouse (sheet)
- Bulk: Submit · Approve · Send · Cancel
- Columns: PO #, Vendor, dates, warehouse, buyer, total, received %, status
- **Create PO** → `/create`

## PO Detail

- Header: status badge, vendor link, warehouse
- Actions by state: Submit → Approve → Send → Receive (stub)
- Tabs: Lines · Receipts · Bills · Activity
- Line table: ordered / received / billed qty

## Status workflow (prototype)

`draft` → `pending_approval` → `approved` → `ordered` → `partially_received` → `received` → `closed`

Also: `rejected`, `cancelled`

## Try it

```
/suppliers/purchase-orders          → full grid
/suppliers/purchase-orders/po_007   → partially received
/suppliers/purchase-orders/po_008   → draft
/suppliers/purchase-orders/create   → new PO form
```

**Last updated:** 2026-06-15
