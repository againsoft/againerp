# Purchase Module

> **Status:** Approved · **Phase:** Documentation First  
> **Route namespace:** `/purchase/*`

Procurement and vendor management — RFQ, purchase orders, goods receipts, vendor bills, returns, and contracts.

| Document | Description |
|----------|-------------|
| [**PURCHASE_MODULE_ARCHITECTURE.md**](./PURCHASE_MODULE_ARCHITECTURE.md) | **Canonical** enterprise Purchase architecture (Step 03) |
| [**PURCHASE_WORKFLOW.md**](./PURCHASE_WORKFLOW.md) | **Procurement workflows** — RFQ, PO, receiving, bill, return (Step 06) |
| [Architecture.md](./Architecture.md) | Legacy draft — superseded for platform scope |
| [MASTER_DATABASE_ARCHITECTURE.md](../../database/MASTER_DATABASE_ARCHITECTURE.md) | Table naming & ownership |

## Scope

| Area | Route |
|------|-------|
| Vendors | `/purchase/vendors` |
| RFQ | `/purchase/rfq` |
| Quotations | `/purchase/quotations` |
| Purchase Orders | `/purchase/orders` |
| Goods Receipts | `/purchase/receipts` |
| Vendor Bills | `/purchase/bills` |
| Returns | `/purchase/returns` |
| Contracts | `/purchase/contracts` |
| Reports | `/purchase/reports` |
| Settings | `/purchase/settings` |

## API Base

`/api/v1/purchase/`

## Integrations

- **Product Master** — PO line items
- **Core contacts** — vendor master
- **Inventory** — receipt → stock movements
- **Finance** — vendor bills → AP
