# Orders

> **Status:** Ready (Prototype)  
> **Module:** Orders · Mock data only  
> **Architecture:** [ARCHITECTURE.md](../../../03-business-modules/ecommerce/orders/ARCHITECTURE.md)

---

## Screens built

| Screen | Route | Highlights |
|--------|-------|------------|
| **Dashboard** | `/orders` | KPI cards, pipeline bar, weekly chart, AI insights, recent orders table |
| **All Orders** | `/orders/all` | AG Grid, filters sheet, column manager, bulk actions, mobile cards |
| **Order workspace** | `/orders/[id]` | Shopify-style layout + Odoo chatter + AI insights panel |

## Order workspace UX

**Shopify-style (left):** Payment & fulfillment badges · fulfillment card · line items · customer · address · payment timeline

**Odoo-style (right):** Chatter feed with icons · Send message / Log note / Log activity · followers

**AI panel (right):** Fraud score · delivery prediction · upsell · retention · order & customer summaries

## Try it

```
/orders              → Dashboard
/orders/all          → All orders grid
/orders/ord_1001     → Shipped · low risk
/orders/ord_1002     → Pending COD · medium risk
/orders/ord_1009     → Returned · high risk
```

Post a message or log note in chatter — updates live (Zustand persist).

## Code

- `components/orders/orders-dashboard.tsx`
- `components/orders/order-grid.tsx`
- `components/orders/order-detail-workspace.tsx`
- `components/orders/order-ai-insights-panel.tsx`
- `components/orders/order-odoo-chatter.tsx`
- `lib/mock-data/orders.ts`
