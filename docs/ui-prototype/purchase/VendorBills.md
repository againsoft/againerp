# Vendor Bills — UI Prototype (P4)

> **Status:** Ready (Prototype)  
> **Routes:** `/suppliers/bills` · `/suppliers/bills/[id]` · `/suppliers/bills/create?poId=`  
> **Workflow:** [PURCHASE_WORKFLOW.md](../../modules/purchase/PURCHASE_WORKFLOW.md) §4

---

## Screens

| Screen | Route | Component |
|--------|-------|-----------|
| Bill List | `/suppliers/bills` | `BillGrid` |
| Bill Detail | `/suppliers/bills/[id]` | `BillDetail` |
| Create from PO | `/suppliers/bills/create?poId=po_002` | `BillFromPoRedirect` |

## Workflow states

`draft` → `unmatched` → `matched` → `exception` → `approved` → `posted` → `paid`

## Bill detail

- **Three-way match panel** — PO qty · Receipt qty · Bill qty · price variance %
- **Run match** → evaluates tolerance (2% price); sets `matched` or `exception`
- **Approve** → finance sign-off on exceptions
- **Post bill** → `accounting.bill.posted` toast + PO `quantityBilled` sync
- **Record payment** → marks `paid`

## PO integration

- PO detail **Bills** tab lists linked vendor bills
- **New vendor bill** when receipt posted or qty received

## Try it

```
/suppliers/bills                    → list
/suppliers/bills/bill_1004          → exception (price variance 7.7%)
/suppliers/bills/bill_1005          → draft (editable)
/suppliers/bills/create?poId=po_002 → create from PO
```

**Last updated:** 2026-06-15
