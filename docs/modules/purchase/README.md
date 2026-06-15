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

| Area | Route (canonical) | Prototype route |
|------|-------------------|-----------------|
| Vendors | `/purchase/vendors` | `/suppliers/all` · `/suppliers/[id]` |
| RFQ | `/purchase/rfq` | `/suppliers/rfq` |
| Quotations | `/purchase/quotations` | — |
| Purchase Orders | `/purchase/orders` | `/suppliers/purchase-orders` |
| Goods Receipts | `/purchase/receipts` | — |
| Vendor Bills | `/purchase/bills` | — |
| Returns | `/purchase/returns` | — |
| Contracts | `/purchase/contracts` | Vendor detail tab |
| Stock feed | Inventory supplier feed | `/suppliers/stock-feed` |
| Summary / Dashboard | `/purchase` | `/suppliers` |
| Reports | `/purchase/reports` | — |
| Settings | `/purchase/settings` | — |

**UI prototype:** [SUPPLIERS_IMPLEMENTED_DESIGN.md](../../ui-prototype/purchase/SUPPLIERS_IMPLEMENTED_DESIGN.md)

## API Base

`/api/v1/purchase/`

## Integrations

- **Product Master** — PO line items
- **Core contacts** — vendor master
- **Inventory** — receipt → stock movements
- **Finance** — vendor bills → AP
