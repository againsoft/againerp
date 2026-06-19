# RFQ & Quotations — UI Prototype (P2)

> **Status:** Ready (Prototype)  
> **Routes:** `/suppliers/rfq` · `/suppliers/rfq/[id]` · `/suppliers/rfq/create` · `/suppliers/quotations`  
> **Workflow:** [PURCHASE_WORKFLOW.md](../../../03-business-modules/purchase/PURCHASE_WORKFLOW.md) §1

---

## Screens

| Screen | Route | Component |
|--------|-------|-----------|
| RFQ List | `/suppliers/rfq` | `RfqGrid` |
| RFQ Detail | `/suppliers/rfq/[id]` | `RfqDetail` |
| Create RFQ | `/suppliers/rfq/create` | `RfqForm` |
| Quotations | `/suppliers/quotations` | `QuotationGrid` |

## RFQ workflow states

`draft` → `sent` → `vendor_response` → `quotation` → `approved` → `po_created` → `closed`

## RFQ detail — Comparison tab

Vendor quote matrix: unit price per line, ★ lowest price, total row, lead time / MOQ. **Award vendor** buttons update quote status.

## Quotations list

Flattened vendor quotes from all RFQs. Filters: status, vendor, parent RFQ.

## Try it

```
/suppliers/rfq              → RFQ grid
/suppliers/rfq/rfq_001      → earbuds comparison (2 quotes)
/suppliers/rfq/rfq_005      → draft
/suppliers/rfq/create       → new RFQ
/suppliers/quotations       → all vendor quotes
```

**Last updated:** 2026-06-15
