# Purchase Module — UI Prototype Index

> **Status:** Planned  
> **Architecture:** [PURCHASE_MODULE_ARCHITECTURE.md](../../modules/purchase/PURCHASE_MODULE_ARCHITECTURE.md)  
> **Workflows:** [PURCHASE_WORKFLOW.md](../../modules/purchase/PURCHASE_WORKFLOW.md)  
> **Route namespace:** `/purchase/*`

---

## Screens (Planned)

| Screen | Route | Reference |
|--------|-------|-----------|
| Dashboard | `/purchase` | — |
| Vendors | `/purchase/vendors` | Core contacts (vendor type) |
| RFQ | `/purchase/rfq` | [PURCHASE_WORKFLOW.md §1](../../modules/purchase/PURCHASE_WORKFLOW.md) |
| Purchase Orders | `/purchase/orders` | [PURCHASE_WORKFLOW.md §2](../../modules/purchase/PURCHASE_WORKFLOW.md) |
| Goods Receipts | `/purchase/receipts` | [PURCHASE_WORKFLOW.md §3](../../modules/purchase/PURCHASE_WORKFLOW.md) · [Inventory Stock In](../../modules/inventory/INVENTORY_WORKFLOW.md) |
| Vendor Bills | `/purchase/bills` | [PURCHASE_WORKFLOW.md §4](../../modules/purchase/PURCHASE_WORKFLOW.md) |
| Returns | `/purchase/returns` | [PURCHASE_WORKFLOW.md §5](../../modules/purchase/PURCHASE_WORKFLOW.md) |
| Reports | `/purchase/reports` | — |
| AI Suggestions | Dashboard widget | [PurchaseSuggestions.md](../inventory/PurchaseSuggestions.md) |

---

## Current Code

- No `/purchase` routes in prototype yet (planned)
- Related: Inventory purchase suggestions at `/inventory` (reorder from stock)
