# Sales Module

> **Status:** Approved · **Version:** 1.0 · **Route namespace:** `/sales/*`

Quote-to-cash revenue module — quotations, sales orders, shipments, invoices, payments, returns, and credit notes.

| Document | Description |
|----------|-------------|
| [**SALES_MODULE_ARCHITECTURE.md**](./SALES_MODULE_ARCHITECTURE.md) | **Enterprise Sales architecture** (source of truth) |
| [**SALES_WORKFLOW.md**](./SALES_WORKFLOW.md) | **Sales workflows** — quotation, order, return, refund, invoice, payment (Step 07) |
| [Architecture.md](./Architecture.md) | Legacy draft (superseded) |
| [MASTER_DATABASE_ARCHITECTURE.md](../../database/MASTER_DATABASE_ARCHITECTURE.md) | Table naming & ownership |

## Scope

| Area | Capability |
|------|------------|
| Customers | Sales view on Core contacts |
| Quotations | Draft → sent → accepted → convert |
| Sales Orders | Confirm, reserve, fulfill |
| Shipments | Delivery notes, partial ship |
| Invoices | Customer billing → Accounting AR |
| Payments | Allocation to open invoices |
| Returns / Credit Notes | RMA, AR adjustments |
| Integration | Inventory, CRM, Finance, `commerce_orders` |

## Related Modules

- [PRODUCT_MASTER_ARCHITECTURE.md](../core/PRODUCT_MASTER_ARCHITECTURE.md)
- [INVENTORY_MODULE_ARCHITECTURE.md](../inventory/INVENTORY_MODULE_ARCHITECTURE.md)
- [PURCHASE_MODULE_ARCHITECTURE.md](../purchase/PURCHASE_MODULE_ARCHITECTURE.md)
- [modules/ecommerce/orders/ARCHITECTURE.md](../ecommerce/orders/ARCHITECTURE.md)

## API Base

`/api/v1/sales/`

## UI Prototype

[ui-prototype/sales/README.md](../../ui-prototype/sales/README.md)
