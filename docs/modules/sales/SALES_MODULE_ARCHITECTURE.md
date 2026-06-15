# AgainERP — Sales Module Architecture

> **Status:** Approved  
> **Version:** 1.0  
> **Module:** Sales (Sales & Revenue)  
> **Document Type:** Enterprise Architecture  
> **Phase:** Documentation First · UI/UX Planning  
> **Route Namespace:** `/sales/*`  
> **Governance:** [GOVERNANCE.md](../../GOVERNANCE.md) · **Standards:** [DEVELOPMENT_STANDARDS.md](../../DEVELOPMENT_STANDARDS.md)

**No backend code. No database implementation. No API implementation.**  
This document is the source of truth for **Sales as an independent business module** — quote-to-cash, revenue documents, and customer fulfillment orchestration.

### Step 04 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Sales & Revenue module | §1 Module Vision |
| Route namespace `/sales/*` | Navigation (§2) |
| Customers through Credit Notes | §3–§10 |
| Activity & Approval Integration | §13 · §14 |
| AI Sales Agent | §15 |
| Inventory, CRM, Finance Integration | §18 · §19 · §20 |

**Related:** [CRM_MODULE_ARCHITECTURE.md](../crm/CRM_MODULE_ARCHITECTURE.md) · [SALES_WORKFLOW.md](./SALES_WORKFLOW.md) · [ENTITY_SALES.md](./ENTITY_SALES.md) · [PRODUCT_MASTER_ARCHITECTURE.md](../core/PRODUCT_MASTER_ARCHITECTURE.md) · [INVENTORY_MODULE_ARCHITECTURE.md](../inventory/INVENTORY_MODULE_ARCHITECTURE.md) · [PURCHASE_MODULE_ARCHITECTURE.md](../purchase/PURCHASE_MODULE_ARCHITECTURE.md) · [modules/ecommerce/orders/ARCHITECTURE.md](../ecommerce/orders/ARCHITECTURE.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../core/ACTIVITY_CHATTER_ARCHITECTURE.md)

---

## Executive Summary

**Sales** is AgainERP's **revenue spine** — the module that manages customer quotations, sales orders, shipments, invoices, payments, returns, and credit notes from opportunity to cash.

| Principle | Rule |
|-----------|------|
| **Independent module** | Full admin UX at `/sales/*` — operable without Ecommerce storefront |
| **Customer via Core contacts** | No duplicate customer master — `contact_type = customer` |
| **Product Master consumer** | Line items reference catalog variants |
| **Inventory owns stock** | Sales triggers reserve → deduct via events |
| **Finance owns receivables** | Invoices → Accounting AR; payments allocation |
| **CRM native** | Opportunities feed quotations; wins on invoice |
| **Orders alignment** | Optional `commerce_order_id` for omnichannel — no duplicate lines |

**Table namespace:** `sales_*` · **API base:** `/api/v1/sales/`

---

## 1. Module Vision

### Why Sales Exists as an Independent Module

Revenue operations exist beyond the online store — B2B, wholesale, call center, field sales, POS, and hospital/clinic billing all need formal sales documents without opening Ecommerce admin.

Sales must work when:

- There is **no Ecommerce** (wholesale, manufacturing, services)
- CRM drives the pipeline and Sales closes the deal
- Inventory and Purchase run as separate modules
- Finance requires invoices, credit notes, and payment allocation
- Multiple channels share one customer and product truth

```text
                    ┌─────────────────────────────────────┐
                    │         Product Master (Core)        │
                    │     SKU · Variant · Price lists      │
                    └─────────────────┬───────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
         ▼                            ▼                            ▼
┌─────────────────┐    ┌─────────────────────────┐    ┌─────────────────┐
│  CRM Module      │    │  Sales Module (Independent)│    │  Ecommerce Orders │
│  Opportunities   │───▶│  Quote → SO → Ship → Invoice │◀──│  commerce_orders  │
└─────────────────┘    └───────────┬─────────────┘    └─────────────────┘
                                     │
                     ┌───────────────┼───────────────┐
                     ▼               ▼               ▼
              Inventory         Finance/         Core Contacts
              (fulfill)         Accounting       (customers)
```

### Vision Statement

> **One quote-to-cash flow. One customer truth. Every channel, one revenue record.**

Sales connects **who we sell to** (customers/CRM), **what we sell** (Product Master), **what we ship** (Inventory), and **what we collect** (Finance).

### Relationship to Ecommerce Orders

| Layer | Owner | Role |
|-------|-------|------|
| **Sales module** (`sales_*`) | Sales | B2B documents, formal quote-to-cash at `/sales/*` |
| **Orders engine** (`commerce_*`) | Platform | Ecommerce, POS, manual admin orders |
| **Link** | `sales_orders.commerce_order_id` | Omnichannel — optional FK, no line duplication |

Ecommerce checkout can create `commerce_orders`; Sales may mirror as `sales_orders` for unified reporting (configurable). **Sales module UI lives at `/sales/*`**, not under `/orders/*`.

---

## 2. Responsibilities

### Sales Owns

| Domain | Responsibility |
|--------|----------------|
| **Customer context (sales view)** | Credit limit, price lists, sales rep assignment |
| **Quotations** | Price offers, revisions, expiry |
| **Sales orders** | Confirmed customer commitments |
| **Shipments** | Delivery documentation, partial fulfill |
| **Invoices** | Customer billing documents |
| **Payments** | Payment recording and invoice allocation |
| **Returns** | RMA, restock orchestration |
| **Credit notes** | Adjustments, refunds on account |
| **Price lists** | Customer/group/contract pricing |
| **Sales reports** | Revenue, pipeline, aging |

### Sales Does Not Own

| Domain | Owner |
|--------|-------|
| Customer party record | Core `contacts` |
| Customer 360 / loyalty / wallet | Customers module (Ecommerce) |
| Product identity, catalog merchandising | Product Master / Catalog |
| Stock quantities | Inventory |
| GL posting, bank reconciliation | Accounting / Finance |
| Marketing campaigns | Marketing |
| Online cart/checkout UX | Ecommerce |

### Quote-to-Cash Flow

```text
CRM Opportunity (optional)
     ↓
Quotation → Customer acceptance
     ↓
Sales Order (approved)
     ↓
Shipment → Inventory deduct
     ↓
Invoice → Accounting AR
     ↓
Payment received → Allocation
     ↓
Return / Credit Note (if needed)
```

### Navigation Structure

**Route namespace:** `/sales/*`

```text
Sales
├── /sales                          Dashboard
├── /sales/customers                Customer directory (sales view)
├── /sales/customers/[id]           Customer 360 lite
├── /sales/quotations               Quotations
├── /sales/quotations/[id]          Quotation detail
├── /sales/quotations/create        Create quotation
├── /sales/orders                   Sales orders
├── /sales/orders/[id]              Order detail (operational workspace)
├── /sales/orders/create            Create order
├── /sales/shipments                  Shipments / delivery notes
├── /sales/shipments/[id]           Shipment detail
├── /sales/invoices                 Invoices
├── /sales/invoices/[id]            Invoice detail
├── /sales/payments                 Payments & allocations
├── /sales/payments/[id]            Payment detail
├── /sales/returns                  Returns (RMA)
├── /sales/returns/[id]             Return detail
├── /sales/credit-notes             Credit notes
├── /sales/credit-notes/[id]        Credit note detail
├── /sales/reports                  Sales reports
└── /sales/settings                 Module settings
```

Sales appears as a **top-level sidebar module** — parallel to Purchase, Inventory, and Catalog.

---

## 3. Customers

**Routes:** `/sales/customers` · `/sales/customers/[id]`

### Design Rule

**No `sales_customers` person table.** Customers are Core [contacts](../../core/entities/contacts.md) with `contact_types` including `customer`.

### Sales Customer View

Sales provides a **revenue-focused customer workspace** — not full Customers module (loyalty, wallet, segments).

| Layer | Source |
|-------|--------|
| **Identity** | Core contact — name, email, phone, addresses |
| **Sales extension** | `sales_customer_profiles` |
| **CRM extension** | `crm_opportunities`, pipeline (CRM module) |
| **Order history** | `sales_orders`, `commerce_orders` (linked) |

**Table:** `sales_customer_profiles`

| Field | Notes |
|-------|-------|
| `contact_id` | FK → Core contacts |
| `customer_code` | Internal code |
| `credit_limit` | Max outstanding AR |
| `payment_terms` | Net 30, COD, prepaid |
| `price_list_id` | Default price list |
| `sales_rep_id` | Assigned user |
| `tax_exempt` | B2B tax flag |
| `currency_code` | Default currency |
| `is_blocked` | Block new orders |

### Customer 360 (Sales Context)

- Open quotations, orders, shipments, invoices
- AR balance and overdue amount (Finance read)
- Credit limit utilization
- Activity drawer, AI churn/risk hint
- Link to full Customers module for loyalty/wallet

---

## 4. Quotations

**Routes:** `/sales/quotations` · `/sales/quotations/[id]` · `/sales/quotations/create`

**Tables:** `sales_quotations`, `sales_quotation_items`

### Purpose

Formal price offer before sales order — B2B, wholesale, project sales.

### Workflow

```text
Draft → Sent → Accepted → Converted to SO
              ↘ Rejected / Expired
```

| State | Description |
|-------|-------------|
| Draft | Sales rep editing |
| Sent | Emailed/PDF to customer |
| Accepted | Customer confirmed |
| Rejected | Declined |
| Expired | Past valid_until |
| Converted | Linked sales order created |

### Quotation Header

| Field | Notes |
|-------|-------|
| `quote_number` | SQ- prefix, unique per company |
| `contact_id` | Customer |
| `crm_opportunity_id` | Optional CRM link |
| `quote_date`, `valid_until` | |
| `branch_id`, `warehouse_id` | Fulfillment context |
| `sales_rep_id` | |
| `currency_code` | |
| `payment_terms` | |
| `subtotal`, `discount`, `tax`, `total` | |

### Quotation Lines

| Field | Notes |
|-------|-------|
| `variant_id` | Product Master |
| `description` | Service line override |
| `quantity`, `unit_price` | |
| `discount_percent` | Line discount |
| `tax_class_id` | |
| `delivery_date` | Promised date |

### Actions

Send PDF · Revise (new version) · Convert to Sales Order · Duplicate · Activity log

**Events:** `sales.quotation.sent` · `sales.quotation.accepted` · `sales.quotation.converted`

---

## 5. Sales Orders

**Routes:** `/sales/orders` · `/sales/orders/[id]` · `/sales/orders/create`

**Tables:** `sales_orders`, `sales_order_items`, `sales_order_status_history`

### Purpose

Confirmed customer commitment — operational workspace for fulfillment and billing.

### Lifecycle

```text
Draft → Submitted → Approved → Confirmed → Partially Shipped → Shipped → Invoiced → Closed
              ↓           ↓
          Rejected    Cancelled / On Hold
```

| State | Description |
|-------|-------------|
| Draft | Editing |
| Submitted | Awaiting approval (credit/discount) |
| Approved | Passed approval gates |
| Confirmed | Stock reserved |
| Partially Shipped | Some lines fulfilled |
| Shipped | Fully fulfilled |
| Invoiced | Invoice posted |
| Closed | Complete |
| Cancelled | Voided before ship |
| On Hold | Credit/fraud hold |

### Order Header

| Field | Notes |
|-------|-------|
| `order_number` | SO- prefix |
| `contact_id` | Customer |
| `commerce_order_id` | Optional omnichannel link |
| `quotation_id` | Source quote |
| `order_date`, `requested_date` | |
| `bill_to_address_id`, `ship_to_address_id` | Core addresses |
| `warehouse_id` | Fulfillment |
| `sales_rep_id` | |
| `order_type` | `standard`, `wholesale`, `project`, `subscription` |
| `currency_code` | |
| Monetary fields | subtotal, discount, tax, shipping, grand_total |

### Order Lines

| Field | Notes |
|-------|-------|
| `variant_id` | Product Master |
| `quantity_ordered`, `quantity_shipped`, `quantity_invoiced` | |
| `unit_price`, `discount`, `tax` | Snapshot at order time |
| `warehouse_id` | Line-level override |
| `project_id` | Future project costing |

### Operational Workspace (`/sales/orders/[id]`)

Single-screen design (Orders module pattern):

- Header: status, customer, totals, smart buttons
- Lines: fulfill, invoice quantities
- Sidebar: customer, shipping, payment status
- Actions: Confirm, Ship, Invoice, Return, Activity, Print
- AI panel: fraud/risk, upsell (collapsible)

**Events:** `sales.order.confirmed` · `sales.order.approved` · `sales.order.cancelled`

---

## 6. Shipments

**Routes:** `/sales/shipments` · `/sales/shipments/[id]`

**Tables:** `sales_shipments`, `sales_shipment_items` (alias: delivery notes)

### Purpose

Document physical delivery — triggers Inventory deduct and updates order fulfill status.

### Workflow

```text
Draft → Picked → Shipped → Delivered
```

| Field | Notes |
|-------|-------|
| `shipment_number` | SH- prefix |
| `sales_order_id` | FK |
| `warehouse_id` | Ship-from |
| `carrier`, `tracking_number` | |
| `shipped_date`, `delivered_date` | |
| `status` | draft, picked, shipped, delivered |

### Shipment Lines

| Field | Notes |
|-------|-------|
| `sales_order_item_id` | |
| `quantity_shipped` | |
| `batch_id`, `serial_ids[]` | When tracked |

### Inventory Integration

```text
sales.shipment.completed
     ↓
Inventory: movement (sale, -qty), release reservation
```

Partial shipments supported. Multi-shipment per order.

---

## 7. Invoices

**Routes:** `/sales/invoices` · `/sales/invoices/[id]`

**Tables:** `sales_invoices`, `sales_invoice_items`

### Purpose

Customer billing document — posts to Accounting AR.

### Workflow

```text
Draft → Posted → Partially Paid → Paid → Overdue → Written Off
```

| Field | Notes |
|-------|-------|
| `invoice_number` | INV- prefix |
| `sales_order_id` | Optional — invoice from order |
| `contact_id` | Bill-to customer |
| `invoice_date`, `due_date` | |
| `currency_code` | |
| `subtotal`, `tax`, `total` | |
| `amount_paid`, `amount_due` | |
| `status` | draft, posted, paid, overdue, cancelled |
| `accounting_entry_id` | FK after post |

### Invoice Sources

| Source | Flow |
|--------|------|
| Sales order | Invoice shipped qty |
| Manual | Service invoice |
| Subscription | Recurring billing (future) |
| Commerce order | Mirror from `commerce_orders` (config) |

**Events:** `sales.invoice.posted` → Accounting AR journal

---

## 8. Payments

**Routes:** `/sales/payments` · `/sales/payments/[id]`

**Tables:** `sales_payments`, `sales_payment_allocations`

### Purpose

Record customer payments and allocate to open invoices.

| Field | Notes |
|-------|-------|
| `payment_number` | PAY- prefix |
| `contact_id` | Customer |
| `payment_date` | |
| `amount` | |
| `method` | cash, bank, bKash, card, cheque |
| `reference` | Transaction ID |
| `status` | pending, cleared, bounced |

### Allocations

**Table:** `sales_payment_allocations`

| Field | Notes |
|-------|-------|
| `payment_id` | |
| `invoice_id` | |
| `amount_allocated` | |

Finance owns bank reconciliation; Sales records commercial payment and allocation. Event: `sales.payment.received` → Accounting cash receipt.

---

## 9. Returns

**Routes:** `/sales/returns` · `/sales/returns/[id]`

**Tables:** `sales_returns`, `sales_return_items`

### Purpose

Customer RMA — reverse shipment, restock, credit.

### Workflow

```text
Requested → Approved → Received → Restocked → Credited
```

| Field | Notes |
|-------|-------|
| `return_number` | RMA- prefix |
| `sales_order_id` | Original order |
| `shipment_id` | Optional source shipment |
| `reason_code` | defective, wrong_item, changed_mind |
| `status` | requested, approved, received, completed, rejected |

### Inventory Impact

Return received → Inventory movement (return, +qty) · Reservation release if applicable

Links to Credit Note for financial reversal.

---

## 10. Credit Notes

**Routes:** `/sales/credit-notes` · `/sales/credit-notes/[id]`

**Tables:** `sales_credit_notes`, `sales_credit_note_items`

### Purpose

Reduce customer AR — refunds, returns, pricing corrections.

| Field | Notes |
|-------|-------|
| `credit_note_number` | CN- prefix |
| `invoice_id` | Source invoice |
| `return_id` | Optional RMA link |
| `contact_id` | |
| `amount` | |
| `reason` | |
| `status` | draft, posted, applied, refunded |
| `accounting_entry_id` | FK after post |

Posted credit note reduces AR balance or triggers refund payment. Event: `sales.credit_note.posted` → Accounting.

---

## 11. Reports

**Route:** `/sales/reports`

| Report | Description |
|--------|-------------|
| **Sales by period** | Revenue trend |
| **Sales by rep** | Quota vs actual |
| **Sales by customer** | Top customers, concentration |
| **Sales by product** | SKU/category revenue |
| **Quotation conversion** | Quote → order rate |
| **Order backlog** | Unshipped/uninvoiced |
| **Shipment status** | In transit, delivered |
| **Invoice aging** | AR buckets (with Finance) |
| **Payment collection** | DSO, collection efficiency |
| **Return rate** | By product, customer |
| **Credit notes** | Adjustments summary |
| **Margin analysis** | Revenue vs cost (if cost visible) |
| **Pipeline** | Open quotes + CRM (with CRM) |

---

## 12. Settings

**Route:** `/sales/settings`

| Group | Settings |
|-------|----------|
| **General** | Default warehouse, SO/INV prefixes, default payment terms |
| **Quotation** | Validity days, auto-expire, PDF template |
| **Order** | Approval thresholds, credit check on confirm |
| **Shipment** | Partial ship default, auto-create on confirm |
| **Invoice** | Invoice on ship vs manual, due date rules |
| **Payment** | Allowed methods, allocation rules |
| **Pricing** | Default price list, discount limits |
| **Integration** | Sync commerce_orders → sales_orders, cost visibility |
| **Notifications** | Quote expiry, overdue invoice, credit limit |

---

## 13. Activity Integration

Every sales record integrates [Activity & Chatter Architecture](../core/ACTIVITY_CHATTER_ARCHITECTURE.md).

### Entity Types

| Entity | Activity ID |
|--------|-------------|
| Customer (sales) | `sales:customer:{contact_id}` |
| Quotation | `sales:quotation:{id}` |
| Sales Order | `sales:order:{id}` |
| Shipment | `sales:shipment:{id}` |
| Invoice | `sales:invoice:{id}` |
| Payment | `sales:payment:{id}` |
| Return | `sales:return:{id}` |
| Credit Note | `sales:credit_note:{id}` |

### Tracked Events

| Event | Activity Type |
|-------|---------------|
| Quote sent/accepted | `status_change` |
| Order created/updated | `create` / `update` |
| Order approved/rejected | `approval_change` |
| Shipment shipped | `status_change` |
| Invoice posted | `status_change` |
| Payment received | `update` |
| Return approved | `approval_change` |
| Credit note posted | `status_change` |
| Price override | `price_change` |
| AI action | `ai_action` |

List pages: Activity icon → Global Activity Drawer. Order detail is primary collaboration surface.

---

## 14. Approval Integration

Integrates [Approval Engine](../../core/engines/APPROVAL_ENGINE_ARCHITECTURE.md) and [Workflow Engine](../../core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md).

### Approval Points

| Document | Trigger | Policy |
|----------|---------|--------|
| **Sales Order** | Submit | Discount %, credit limit exceed, margin floor |
| **Quotation** | Discount above threshold | Manager approval |
| **Invoice** | Post before ship (policy) | Finance |
| **Credit Note** | Value threshold | Manager + Finance |
| **Return** | Outside window / high value | Customer service lead |
| **Price override** | Below floor price | Sales manager |

### Credit Limit Check

On order confirm: Sales reads AR balance (Finance API) + open orders vs `credit_limit`. Block or route to approval.

### Separation of Duties

- Sales rep cannot approve own discount above limit
- Invoice post may require separate finance role

---

## 15. AI Sales Agent

### Role

**Sales Agent** assists reps with forecasting, risk, pricing, and next-best-action.

### Capabilities

| Capability | Input | Output |
|------------|-------|--------|
| **Quote optimization** | Customer history, margin rules | Suggested line prices |
| **Upsell / cross-sell** | Order lines, catalog relationships | Add-on suggestions |
| **Churn risk** | Purchase recency, support tickets | Risk score on customer |
| **Payment prediction** | Invoice history | Likely pay date |
| **Demand forecast** | Sales velocity | Quote quantity hint |
| **Fraud / credit risk** | Order patterns, customer profile | Hold recommendation |
| **Next best action** | Open quotes, overdue invoices | Follow-up task |
| **Win probability** | CRM opportunity + history | Close likelihood |

### AI Governance

1. Pricing suggestions require approval above threshold
2. Credit hold recommendations need human confirm
3. All runs in Activity `AI Actions`

**Prototype:** [ui-prototype/ai-os/AiSalesForecast.md](../../ui-prototype/ai-os/AiSalesForecast.md)

---

## 16. Permissions

Namespace: `sales.*`

| Permission | Description |
|------------|-------------|
| `sales.access` | Module access |
| `sales.dashboard.view` | Dashboard |
| `sales.customer.read` | View customers |
| `sales.customer.write` | Edit sales profiles |
| `sales.quotation.read` | View quotes |
| `sales.quotation.create` | Create/send quotes |
| `sales.order.read` | View orders |
| `sales.order.create` | Create orders |
| `sales.order.approve` | Approve orders/discounts |
| `sales.order.confirm` | Confirm + reserve stock |
| `sales.shipment.read` | View shipments |
| `sales.shipment.create` | Create/ship |
| `sales.invoice.read` | View invoices |
| `sales.invoice.create` | Create invoices |
| `sales.invoice.post` | Post to Accounting |
| `sales.payment.read` | View payments |
| `sales.payment.create` | Record payments |
| `sales.return.read` | View returns |
| `sales.return.approve` | Approve RMA |
| `sales.credit_note.read` | View credit notes |
| `sales.credit_note.post` | Post credit notes |
| `sales.pricing.view_cost` | See cost/margin |
| `sales.pricing.override` | Override prices |
| `sales.report.view` | Reports |
| `sales.settings.edit` | Settings |
| `sales.export` | Export |
| `sales.ai.apply` | Apply AI suggestions |

Row-level: `company_id`, `branch_id`, sales rep assignment scope.

---

## 17. UI/UX Design

### Design Blend

| Weight | Source | Applied To |
|--------|--------|------------|
| **60%** | Odoo | Order form, smart buttons, status bar, delivery/invoice tabs |
| **20%** | Shopify | List speed, fulfillment clarity |
| **10%** | HubSpot | Customer context, pipeline feel |
| **10%** | Linear | Status pills, keyboard shortcuts |

### Key Screens

#### Sales Dashboard (`/sales`)

- KPIs: revenue MTD, open quotes, backlog, overdue AR
- Rep leaderboard, AI follow-up queue

#### Quotation List / Detail

- Compact grid, PDF preview, convert button
- Customer sidebar, line editor inline

#### Sales Order Workspace (`/sales/orders/[id]`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Orders   SO-1042  [Confirmed]     [Confirm][Ship][Invoice][Activity]│
├─────────────────────────────────────────────────────────────────────────┤
│ Customer · Ship-to · Totals strip                                       │
├──────────────────────────────────┬──────────────────────────────────────┤
│ Order lines (qty ship/invoice)   │ Customer · Payment · Shipments       │
│                                  │ Invoices · Activity summary          │
└──────────────────────────────────┴──────────────────────────────────────┘
```

#### Invoice & Payment

- Post invoice bar, allocation UI on payment screen
- Aging badge on customer records

**Existing prototype patterns:** [modules/ecommerce/orders/ARCHITECTURE.md](../ecommerce/orders/ARCHITECTURE.md) · [apps/web orders UI](../../ui-prototype/orders/Orders.md)

---

## 18. Inventory Integration

### Order-to-Stock Flow

```text
Sales Order confirmed
     ↓ event: sales.order.confirmed
Inventory: create reservation (+qty_reserved)
     ↓
Shipment completed
     ↓ event: sales.shipment.completed
Inventory: movement (sale, -qty_on_hand), release reservation
     ↓
Return received
     ↓ event: sales.return.received
Inventory: movement (return, +qty_on_hand)
```

### Rules

| Rule | Detail |
|------|--------|
| Inventory owns qty | Sales never writes `inventory_stock_levels` |
| Reservation on confirm | Policy-configurable (confirm vs approve) |
| Partial ship | Partial deduct + partial reservation release |
| Batch/serial | Shipment lines pass to Inventory |
| Availability check | Before confirm — Inventory API |
| Drop-ship | Sales order → Purchase PO (future) |

### Shared References

- `sales_order_items.variant_id` → Product Master → `inventory_item_id`
- `sales_shipments.warehouse_id` → `inventory_warehouses`

**Reference:** [INVENTORY_MODULE_ARCHITECTURE.md](../inventory/INVENTORY_MODULE_ARCHITECTURE.md)

---

## 19. CRM Integration

### CRM ↔ Sales Flow

```text
CRM Opportunity (qualified)
     ↓
Sales Quotation (linked crm_opportunity_id)
     ↓
Quote accepted → Opportunity stage: Proposal
     ↓
Sales Order confirmed → Opportunity: Won
     ↓
Invoice posted → Revenue recognized (CRM metric)
```

### Integration Points

| CRM Entity | Sales Link |
|------------|------------|
| `crm_opportunities` | `sales_quotations.crm_opportunity_id` |
| `crm_leads` | Convert to contact → first quotation |
| Activities | Shared Activity drawer on contact |
| Pipeline reports | Open quotes + weighted pipeline |

### Sales Provides to CRM

- Quote value, order value, invoice value
- Win/loss on quotation rejection
- Customer revenue history for scoring

### CRM Provides to Sales

- Lead source, account owner
- Opportunity context on quote
- Next follow-up tasks (AI + manual)

Sales does not own pipeline stages — CRM does. Sales owns revenue documents.

---

## 20. Finance Integration

### Order-to-Cash Handoff

```text
Sales Shipment (fulfillment)
     ↓
Sales Invoice (commercial bill)
     ↓ event: sales.invoice.posted
Accounting: AR journal (DR AR, CR Revenue)
     ↓
Sales Payment recorded
     ↓ event: sales.payment.received
Accounting: cash receipt (DR Cash, CR AR)
     ↓
Credit Note (if return/adjustment)
     ↓ event: sales.credit_note.posted
Accounting: reverse revenue / AR
```

### Finance Responsibilities vs Sales

| Function | Sales | Finance |
|----------|-------|---------|
| Commercial invoice | Creates, sends | Posts GL |
| Payment recording | Allocates to invoices | Bank reconcile |
| AR aging | Displays | Source of truth |
| Credit limit | Enforces on order | Sets policy |
| Tax calculation | Line tax via Tax Engine | Tax reporting |
| Revenue recognition | Triggers on invoice post | Policy (ASC 606 future) |

### Events to Accounting

| Event | Accounting Action |
|-------|---------------------|
| `sales.invoice.posted` | AR + revenue entry |
| `sales.payment.received` | Cash receipt |
| `sales.credit_note.posted` | AR credit |
| `sales.order.confirmed` | Optional revenue commitment (config) |

Sales does not post GL — prepares documents and emits events.

**Doc:** [FINANCE_MODULE_ARCHITECTURE.md §Appendix A](../finance/FINANCE_MODULE_ARCHITECTURE.md)

---

## Architecture Rules

| # | Rule |
|---|------|
| 1 | **Independent module** — full UX at `/sales/*` |
| 2 | **Customers via Core contacts** — no duplicate customer master |
| 3 | **Product Master consumer** — lines link variants |
| 4 | **Inventory owns stock** — reserve/deduct via events only |
| 5 | **Finance owns AR** — invoices hand off to Accounting |
| 6 | **CRM feeds pipeline** — opportunities link to quotes |
| 7 | **Orders alignment** — optional `commerce_order_id`, no line duplication |
| 8 | **Approval enabled** — credit, discount, credit notes |
| 9 | **Activity enabled** — all documents auditable |
| 10 | **AI enabled** — Sales Agent for forecast and assist |
| 11 | **Event driven** — `sales.*` events |
| 12 | **API first** — `/api/v1/sales/` |
| 13 | **Documentation before code** — [PRE_CODE_GATE.md](../../PRE_CODE_GATE.md) |

### Anti-Patterns (Forbidden)

```text
❌ sales_customers duplicating contacts
❌ SO line without Product Master reference (except approved service lines)
❌ Direct inventory qty update from Sales
❌ GL posting from Sales module
❌ Ecommerce as only sales UI for B2B
❌ Duplicate lines when linking commerce_order_id
```

---

## Appendix A — Database Tables (Planned)

| Table | Purpose |
|-------|---------|
| `sales_customer_profiles` | Customer extension on Core contact |
| `sales_price_lists` / `_items` | Customer pricing |
| `sales_quotations` / `_quotation_items` | Quotes |
| `sales_orders` / `_order_items` | Sales orders |
| `sales_order_status_history` | Status audit |
| `sales_shipments` / `_shipment_items` | Deliveries |
| `sales_invoices` / `_invoice_items` | Invoices |
| `sales_payments` / `_payment_allocations` | Payments |
| `sales_returns` / `_return_items` | RMA |
| `sales_credit_notes` / `_credit_note_items` | Credit notes |

Optional link: `sales_orders.commerce_order_id` → `commerce_orders`

---

## Appendix B — Domain Events

| Event | Subscribers |
|-------|-------------|
| `sales.quotation.sent` | CRM, Notifications |
| `sales.quotation.accepted` | CRM (stage update) |
| `sales.quotation.converted` | Analytics |
| `sales.order.confirmed` | **Inventory** (reserve), Analytics |
| `sales.order.approved` | Notifications |
| `sales.shipment.completed` | **Inventory** (deduct), Notifications |
| `sales.invoice.posted` | **Accounting** AR, CRM |
| `sales.payment.received` | **Accounting**, CRM |
| `sales.return.received` | **Inventory** (restock) |
| `sales.credit_note.posted` | **Accounting** |
| `sales.customer.credit_hold` | Order block |

### Subscribed Events

| Event | Source | Sales Action |
|-------|--------|--------------|
| `commerce.order.placed` | Orders | Create linked `sales_orders` (config) |
| `crm.opportunity.won` | CRM | Suggest quotation |
| `inventory.stock.insufficient` | Inventory | Block/warn on confirm |
| `accounting.payment.received` | Accounting | Update allocation |
| `purchase.receipt.completed` | Purchase | Drop-ship notify (future) |

---

## Appendix C — API Surface (Planned)

Base: `/api/v1/sales/`

| Group | Endpoints |
|-------|-----------|
| Customers | `GET/PATCH /customers/{id}/profile` |
| Quotations | `GET/POST /quotations`, `POST /quotations/{id}/send`, `POST /quotations/{id}/convert` |
| Orders | `GET/POST /orders`, `POST /orders/{id}/confirm`, `POST /orders/{id}/approve` |
| Shipments | `GET/POST /shipments`, `POST /shipments/{id}/ship` |
| Invoices | `GET/POST /invoices`, `POST /invoices/{id}/post` |
| Payments | `GET/POST /payments`, `POST /payments/{id}/allocate` |
| Returns | `GET/POST /returns`, `POST /returns/{id}/approve` |
| Credit Notes | `GET/POST /credit-notes`, `POST /credit-notes/{id}/post` |
| Reports | `GET /reports/revenue`, `GET /reports/aging` |

---

## Appendix D — Related Documents

| Document | Relationship |
|----------|--------------|
| [PRODUCT_MASTER_ARCHITECTURE.md](../core/PRODUCT_MASTER_ARCHITECTURE.md) | Product lines |
| [INVENTORY_MODULE_ARCHITECTURE.md](../inventory/INVENTORY_MODULE_ARCHITECTURE.md) | Fulfillment |
| [CRM_MODULE_ARCHITECTURE.md](../crm/CRM_MODULE_ARCHITECTURE.md) | CRM pipeline — opportunities feed quotes |
| [INVENTORY_WORKFLOW.md](../inventory/INVENTORY_WORKFLOW.md) | Reservation, Stock Out, return restock |
| [SALES_WORKFLOW.md](./SALES_WORKFLOW.md) | Quote-to-cash state machines |
| [PURCHASE_MODULE_ARCHITECTURE.md](../purchase/PURCHASE_MODULE_ARCHITECTURE.md) | Drop-ship |
| [modules/ecommerce/orders/ARCHITECTURE.md](../ecommerce/orders/ARCHITECTURE.md) | Commerce order engine |
| [modules/ecommerce/customers/ARCHITECTURE.md](../ecommerce/customers/ARCHITECTURE.md) | Customer 360 |
| [ACTIVITY_CHATTER_ARCHITECTURE.md](../core/ACTIVITY_CHATTER_ARCHITECTURE.md) | Activity |
| [core/entities/contacts.md](../../core/entities/contacts.md) | Customer master |
| [FINANCE_MODULE_ARCHITECTURE.md](../finance/FINANCE_MODULE_ARCHITECTURE.md) | GL, AR, posting rules |

---

## Document Control

| Field | Value |
|-------|-------|
| **Owner** | Platform Team · Sales Domain |
| **Reviewers** | Architecture, CRM, Inventory, Finance |
| **Next Review** | At database implementation gate |
| **Status Gate** | Documentation First — Ready for UI/UX Planning |

**Changelog:** [CHANGELOG.md](../../CHANGELOG.md)
