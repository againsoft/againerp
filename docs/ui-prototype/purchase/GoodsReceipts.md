# Goods Receipts — UI Prototype (P3)

> **Status:** Ready (Prototype)  
> **Routes:** `/suppliers/receipts` · `/suppliers/receipts/[id]` · `/suppliers/receipts/create?poId=`  
> **Workflow:** [PURCHASE_WORKFLOW.md](../../modules/purchase/PURCHASE_WORKFLOW.md) §3

---

## Screens

| Screen | Route | Component |
|--------|-------|-----------|
| GR List | `/suppliers/receipts` | `ReceiptGrid` |
| GR Detail | `/suppliers/receipts/[id]` | `ReceiptDetail` |
| Receive from PO | `/suppliers/receipts/create?poId=po_001` | `ReceiptFromPoRedirect` |

## Workflow states

`draft` → `receiving` → `qc_pending` → `posted` → `completed`

## GR detail

- Editable qty + batch/lot while draft/receiving/QC
- **Post receipt** → `inventory.stock_in.posted` toast + PO qty update
- **Complete** after posted

## PO integration

- PO detail **Receive** → creates/opens GR
- PO **Receipts** tab lists linked GRs

## Try it

```
/suppliers/receipts              → list
/suppliers/receipts/gr_1005      → receiving (in progress)
/suppliers/receipts/gr_1006      → draft (editable)
/suppliers/receipts/create?poId=po_001  → receive from PO
```

**Last updated:** 2026-06-15
