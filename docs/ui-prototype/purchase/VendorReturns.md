# Vendor Returns — UI Prototype (P5)

> **Status:** Ready (Prototype)  
> **Routes:** `/suppliers/returns` · `/suppliers/returns/[id]` · `/suppliers/returns/create?poId=`  
> **Workflow:** [PURCHASE_WORKFLOW.md](../../modules/purchase/PURCHASE_WORKFLOW.md) §5

---

## Screens

| Screen | Route | Component |
|--------|-------|-----------|
| Return List | `/suppliers/returns` | `ReturnGrid` |
| Return Detail | `/suppliers/returns/[id]` | `ReturnDetail` |
| Create from PO | `/suppliers/returns/create?poId=po_007` | `ReturnFromPoRedirect` |

## Workflow states

`requested` → `approved` → `shipped` → `vendor_received` → `credited`

Also: `rejected`, `cancelled`

## Reason codes

`defective` · `wrong_item` · `over_shipment` · `warranty` · `expired`

## Return detail

- Editable qty + reason while `requested`
- **Approve** → procurement sign-off
- **Ship return** → `inventory.stock_out.posted` toast + PO `quantityReturned` sync
- **Vendor received** → vendor acknowledgment
- **Post credit note** → `purchase.return.credited` toast

## PO integration

- PO detail **Returns** tab lists linked RMAs
- PO lines show **Returned** qty column
- **New return** when goods received

## Try it

```
/suppliers/returns                    → list
/suppliers/returns/pr_1004            → requested (QC fail, awaiting approval)
/suppliers/returns/pr_1003            → shipped (in transit)
/suppliers/returns/pr_1005            → approved (ready to ship)
/suppliers/returns/create?poId=po_007 → create from PO
```

**Last updated:** 2026-06-15
