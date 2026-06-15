# Sales Module — UI Prototype Index

> **Status:** Planned  
> **Architecture:** [SALES_MODULE_ARCHITECTURE.md](../../modules/sales/SALES_MODULE_ARCHITECTURE.md)  
> **Workflows:** [SALES_WORKFLOW.md](../../modules/sales/SALES_WORKFLOW.md)  
> **Route namespace:** `/sales/*`

---

## Screens (Planned)

| Screen | Route | Reference |
|--------|-------|-----------|
| Dashboard | `/sales` | — |
| Customers | `/sales/customers` | Core contacts (customer type) |
| Quotations | `/sales/quotations` | [SALES_WORKFLOW.md §1](../../modules/sales/SALES_WORKFLOW.md) |
| Sales Orders | `/sales/orders` | [SALES_WORKFLOW.md §2](../../modules/sales/SALES_WORKFLOW.md) |
| Shipments | `/sales/shipments` | [SALES_WORKFLOW.md §2](../../modules/sales/SALES_WORKFLOW.md) · [Inventory](../../modules/inventory/INVENTORY_WORKFLOW.md) |
| Invoices | `/sales/invoices` | [SALES_WORKFLOW.md §5](../../modules/sales/SALES_WORKFLOW.md) |
| Payments | `/sales/payments` | [SALES_WORKFLOW.md §6](../../modules/sales/SALES_WORKFLOW.md) |
| Returns | `/sales/returns` | [SALES_WORKFLOW.md §3](../../modules/sales/SALES_WORKFLOW.md) |
| Credit Notes / Refunds | `/sales/credit-notes` | [SALES_WORKFLOW.md §4](../../modules/sales/SALES_WORKFLOW.md) |
| Reports | `/sales/reports` | — |
| AI Sales Agent | Dashboard widget | [AiSalesForecast.md](../ai-os/AiSalesForecast.md) |

---

## Current Code

- No `/sales` routes in prototype yet (planned)
- Related: Orders UI at `/orders/*` — operational patterns for sales order workspace
- Print: invoice/packing slip at `/orders/[id]/print/*` (migrate to `/sales` when built)
