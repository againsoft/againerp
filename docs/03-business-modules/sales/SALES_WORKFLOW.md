# AgainERP — Sales Workflows

> **Status:** Approved  
> **Version:** 1.0  
> **Module:** Sales (Sales & Revenue)  
> **Document Type:** Workflow Specification  
> **Phase:** Documentation First  
> **Route Namespace:** `/sales/*`  
> **Governance:** [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · **Engine:** [core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md)

**No backend code. No database implementation. No API implementation.**  
This document defines **all Sales state machines** — quote-to-cash, with approvals, activity logs, and AI actions.

### Step 07 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Quotation Workflow | §1 |
| Sales Order Workflow | §2 |
| Return Workflow | §3 |
| Refund Workflow | §4 |
| Invoice Workflow | §5 |
| Payment Workflow | §6 |
| Approval Rules | §7 |
| AI Actions | §8 |
| Activity Tracking | §9 |

Each workflow includes: **Trigger · States · Transitions · text diagrams · cross-module events**

**Related:** [SALES_MODULE_ARCHITECTURE.md](./SALES_MODULE_ARCHITECTURE.md) · [INVENTORY_WORKFLOW.md](../inventory/INVENTORY_WORKFLOW.md) · [PURCHASE_WORKFLOW.md](../purchase/PURCHASE_WORKFLOW.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) · [WORKFLOW_REGISTRY.md](../../00-foundation/registries/WORKFLOW_REGISTRY.md)

---

## Executive Summary

Sales workflows govern **quote-to-cash** — from customer quotation through order fulfillment, invoicing, payment, and returns/refunds.

| Pattern | Rule |
|---------|------|
| **Sales orchestrates** | Business documents live in `sales_*` tables |
| **Inventory owns stock** | Orders trigger reserve → deduct ([INVENTORY_WORKFLOW.md §5, §2](../inventory/INVENTORY_WORKFLOW.md)) |
| **Finance owns AR** | Invoices and refunds hand off to Accounting — Sales never posts GL |
| **Core Workflow Engine** | All state machines registered in workflow engine |
| **Event-driven** | Transitions emit `sales.*` domain events |
| **Activity everywhere** | Every transition logged in Activity drawer |
| **AI assist, not auto-sell** | Agent recommends; human or policy approves pricing/credit |

### Workflow Registry IDs

| ID | Entity | Primary Doc Section |
|----|--------|---------------------|
| `sales.quotation` | `sales_quotations` | §1 |
| `sales.order` | `sales_orders` | §2 |
| `sales.shipment` | `sales_shipments` | §2 (fulfillment sub-flow) |
| `sales.return` | `sales_returns` | §3 |
| `sales.refund` | `sales_refunds` | §4 |
| `sales.invoice` | `sales_invoices` | §5 |
| `sales.payment` | `sales_payments` | §6 |
| `sales.credit_note` | `sales_credit_notes` | §4 (AR credit; links to refund) |

---

## Shared Concepts

### Quote-to-Cash Chain

```text
CRM Opportunity (optional)
     ↓
Quotation → Negotiation → Approved
     ↓
Sales Order → Confirmed → Reserved
     ↓
Packed → Shipped → Delivered
     ↓
Invoice → Accounting AR
     ↓
Payment → Allocation
     ↓
Return → Refund / Credit Note (if needed)
     ↓
Closed
```

### Document Quantity Tracking (Order Line)

| Field | Updated By |
|-------|------------|
| `quantity_ordered` | Order create / amend |
| `quantity_shipped` | Shipment post |
| `quantity_invoiced` | Invoice post |
| `quantity_returned` | Return receive |

### Common Activity Types

| Activity Type | When Used |
|---------------|-----------|
| `create` | Document created |
| `update` | Line or header edit |
| `status_change` | State transition |
| `approval_change` | Approval granted/rejected |
| `reservation` | Stock hold created/released |
| `movement` | Shipment/return linked to Inventory |
| `price_change` | Quote or order price override |
| `ai_action` | Agent suggestion applied/dismissed |

### Common Policy Keys

| Policy Key | Default | Applies To |
|------------|---------|------------|
| `sales.quotation.discount_approval_threshold` | % or value | Quotation negotiation |
| `sales.order.credit_limit_check` | enabled | Order confirm |
| `sales.order.discount_approval_threshold` | Value-based | Order confirm |
| `sales.return.approval_threshold` | Value-based | RMA |
| `sales.refund.approval_threshold` | Value-based | Refund |
| `sales.invoice.post_before_ship` | false | Invoice timing |
| `sales.payment.allocation_auto` | true | Payment apply |

---

## 1. Quotation Workflow

**Workflow ID:** `sales.quotation`  
**Primary tables:** `sales_quotations`, `sales_quotation_items`  
**Routes:** `/sales/quotations` · `/sales/quotations/[id]` · `/sales/quotations/create`

### Purpose

Formal price offer to customer before sales order — B2B, wholesale, project, and CRM-driven deals.

### Trigger

| Source | Action |
|--------|--------|
| **Manual quote** | Sales rep at `/sales/quotations/create` |
| **CRM opportunity** | `crm.opportunity.qualified` → suggest quote |
| **Customer request** | RFQ from customer email/portal |
| **Repeat order** | Duplicate from prior SO |
| **AI suggestion** | Win probability + upsell draft |

### States

```text
┌─────────┐     ┌─────────┐     ┌─────────────┐     ┌──────────┐     ┌─────────────┐
│  DRAFT  │────▶│  SENT   │────▶│ NEGOTIATION │────▶│ APPROVED │────▶│ SO_CREATED  │
└─────────┘     └─────────┘     └─────────────┘     └──────────┘     └─────────────┘
       │              │                 │                │
       │              ▼                 ▼                ▼
       │       ┌─────────────┐    ┌─────────────┐   ┌─────────────┐
       └──────▶│  CANCELLED  │    │   REJECTED  │   │   EXPIRED   │
               └─────────────┘    └─────────────┘   └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Draft | `draft` | Rep editing lines, pricing, terms |
| Sent | `sent` | PDF/email delivered to customer |
| Negotiation | `negotiation` | Counter-offer, revised pricing in progress |
| Approved | `approved` | Internal approval on discount/terms; customer acceptance |
| SO Created | `so_created` | Converted to sales order |
| Rejected | `rejected` | Customer declined |
| Expired | `expired` | Past `valid_until` |
| Cancelled | `cancelled` | Voided before conversion |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `send` | `draft` | `sent` | Sales rep | Lines + customer valid | `sales.quotation.sent` |
| `revise` | `sent`, `negotiation` | `negotiation` | Rep / customer | New version created | `sales.quotation.revised` |
| `accept_customer` | `sent`, `negotiation` | `negotiation` | Customer portal | Customer ack (optional) | `sales.quotation.customer_accepted` |
| `submit_approval` | `negotiation`, `sent` | `approved` | System / manager | Discount within policy OR approved | `sales.quotation.approved` |
| `reject_customer` | `sent`, `negotiation` | `rejected` | Customer / rep | — | `sales.quotation.rejected` |
| `expire` | `sent`, `negotiation`, `draft` | `expired` | Scheduled job | `valid_until` passed | `sales.quotation.expired` |
| `convert` | `approved` | `so_created` | Rep / system | No block on customer credit | `sales.quotation.converted` |
| `cancel` | `draft`, `sent` | `cancelled` | Rep / manager | No SO linked | `sales.quotation.cancelled` |

### Revision Model

Negotiation supports **quote versions** — each `revise` creates `sales_quotation_revisions` row; prior version read-only.

```text
SQ-1042 v1 (sent) → customer counter → v2 (negotiation) → v3 (approved) → SO-8821
```

### Approval Rules

| Condition | Approver | Permission |
|-----------|----------|------------|
| Line discount > threshold | Sales manager | `sales.quotation.approve` |
| Total discount > threshold | Sales manager | `sales.quotation.approve` |
| Price below floor (margin) | Sales manager + finance | `sales.pricing.override` |
| Quote to blocked customer | Manager override | `sales.customer.unblock` |
| Rep = approver (SoD) | Blocked above limit | System guard |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `send` | `sales:quotation:{id}` | PDF sent, recipient email |
| `revise` | `sales:quotation:{id}` | Version N, price diff |
| `submit_approval` | `sales:quotation:{id}` | `approval_change`, discount % |
| `convert` | `sales:order:{id}` | Link SQ → SO |
| `expire` | `sales:quotation:{id}` | Auto-expire job |
| `reject_customer` | `sales:quotation:{id}` | Reason, CRM stage update |

### AI Actions

| Trigger | Capability | Output |
|---------|------------|--------|
| Draft quote | Quote optimization | Suggested line prices from history |
| Before send | Upsell / cross-sell | Add-on SKU suggestions |
| CRM opportunity | Win probability | Close likelihood score |
| Negotiation | Quote optimization | Counter-offer price range |
| Expiring quotes | Next best action | Follow-up task for rep |

### Workflow Diagram

```text
  CRM Opportunity "Acme Corp — 500 units SKU-X"
        │
        ▼
  Create SQ-2026-0188 (DRAFT)
  Lines: SKU-X × 500 @ ৳420 (AI suggests ৳415–425)
        │
        ▼
  send → SENT (PDF to buyer@acme.com)
        │
        ▼
  Customer counters ৳400 → revise → NEGOTIATION (v2)
        │
        ├── discount > 8%? ──▶ Manager APPROVED
        │
        ▼
  convert → SO_CREATED (draft SO-1042)
  CRM: opportunity → Proposal Won (pending)
        │
        ▼
  Event: sales.quotation.converted
```

---

## 2. Sales Order Workflow

**Workflow ID:** `sales.order`  
**Fulfillment sub-flow:** `sales.shipment`  
**Primary tables:** `sales_orders`, `sales_order_items`, `sales_shipments`, `sales_shipment_items`  
**Routes:** `/sales/orders` · `/sales/orders/[id]` · `/sales/shipments`

### Purpose

Confirmed customer commitment through fulfillment — reserve stock, pick/pack, ship, deliver, and close.

### Trigger

| Source | Action |
|--------|--------|
| **Quotation convert** | `sales.quotation.converted` |
| **Manual order** | Rep at `/sales/orders/create` |
| **Commerce sync** | `commerce.order.placed` → mirror SO (config) |
| **POS / call center** | Manual entry |
| **Contract release** | Blanket order release (future) |
| **AI reorder** | Customer replenishment suggestion |

### States

```text
┌─────────┐     ┌───────────┐     ┌──────────┐     ┌─────────┐     ┌─────────┐     ┌──────────┐
│  DRAFT  │────▶│ CONFIRMED │────▶│ RESERVED │────▶│  PACKED │────▶│ SHIPPED │────▶│ DELIVERED│
└─────────┘     └───────────┘     └──────────┘     └─────────┘     └─────────┘     └────┬─────┘
       │              │                │               │              │             │
       ▼              ▼                ▼               ▼              ▼             ▼
┌─────────────┐ ┌───────────┐   ┌─────────────┐  ┌─────────────┐ ┌─────────────┐ ┌─────────┐
│  CANCELLED  │ │ ON_HOLD   │   │ PARTIALLY   │  │ PARTIALLY   │ │   CLOSED  │ │ CLOSED  │
└─────────────┘ └───────────┘   │  SHIPPED    │  │  DELIVERED  │ └─────────────┘ └─────────┘
                                └─────────────┘  └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Draft | `draft` | Editing; not committed |
| Confirmed | `confirmed` | Customer commitment; credit/discount approved |
| Reserved | `reserved` | Inventory reservation active |
| Packed | `packed` | Warehouse picked and packed (shipment draft) |
| Shipped | `shipped` | Carrier handoff; inventory deducted |
| Delivered | `delivered` | Delivery confirmed (POD / tracking) |
| Partially Shipped | `partially_shipped` | Some lines shipped |
| Partially Delivered | `partially_delivered` | Some shipments delivered |
| Closed | `closed` | Invoiced + fulfilled; complete |
| On Hold | `on_hold` | Credit/fraud/manual hold |
| Cancelled | `cancelled` | Voided before ship |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `confirm` | `draft` | `confirmed` | Rep / system | Approval if discount/credit | `sales.order.confirmed` |
| `hold` | `draft`, `confirmed` | `on_hold` | System / manager | Fraud/credit flag | `sales.order.held` |
| `release_hold` | `on_hold` | `confirmed` | Manager | Hold cleared | `sales.order.released` |
| `reserve` | `confirmed` | `reserved` | System | qty_available ≥ qty (or backorder policy) | `sales.order.reserved` |
| `pack` | `reserved`, `partially_shipped` | `packed` | Warehouse | Pick list complete | `sales.shipment.packed` |
| `ship` | `packed`, `reserved` | `shipped`, `partially_shipped` | Warehouse | Shipment post | `sales.shipment.shipped` |
| `deliver` | `shipped`, `partially_shipped` | `delivered`, `partially_delivered` | System / carrier | POD or tracking | `sales.shipment.delivered` |
| `close` | `delivered`, `partially_delivered` | `closed` | System / rep | Invoice posted (policy) | `sales.order.closed` |
| `cancel` | `draft`, `confirmed`, `reserved` | `cancelled` | Manager | Not shipped | `sales.order.cancelled` |
| `release_reservation` | `reserved`, `on_hold` | `confirmed` | Cancel / hold | Reservation released | `sales.order.reservation_released` |

### Inventory Integration by Transition

```text
confirm:
  Credit check (AR + open orders vs credit_limit)
  Optional: no stock change yet

reserve (RESERVED):
  Event: sales.order.confirmed (if not already)
  Inventory Reservation (§5): qty_reserved += N
  FEFO batch allocation

ship (SHIPPED):
  Event: sales.shipment.completed
  Inventory Stock Out (§2): qty_on_hand −N, qty_reserved −N
  Order: quantity_shipped += N

cancel / release_hold before ship:
  Inventory: reservation release
```

### Shipment Sub-Workflow (`sales.shipment`)

Packed / Shipped / Delivered map to shipment document:

```text
Shipment: draft → picked → packed → shipped → delivered
```

| Shipment Transition | Order State | Inventory |
|--------------------|-------------|-----------|
| `pack` | → `packed` | Reservation holds |
| `ship` | → `shipped` / `partially_shipped` | Stock Out posted |
| `deliver` | → `delivered` / `partially_delivered` | — |

### Approval Rules

See §7. Summary for confirm:

| Condition | Approver | Permission |
|-----------|----------|------------|
| Discount > threshold | Sales manager | `sales.order.approve` |
| Credit limit exceeded | Finance / manager | `sales.order.approve_credit` |
| Margin below floor | Sales manager | `sales.pricing.override` |
| Confirm with zero available (backorder) | Manager | `sales.order.confirm_backorder` |
| Rep cannot approve own order | SoD | System guard |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `confirm` | `sales:order:{id}` | `status_change`, credit check result |
| `reserve` | `sales:order:{id}` | `reservation`, batch allocated |
| `pack` | `sales:shipment:{id}` | Pick list, pack station |
| `ship` | `sales:shipment:{id}` | Carrier, tracking |
| `ship` | `inventory:item:{id}` | `movement` stock out |
| `deliver` | `sales:shipment:{id}` | POD, delivered timestamp |
| `close` | `sales:order:{id}` | Final status, invoice link |
| `cancel` | `sales:order:{id}` | Reservation released |

### AI Actions

| Trigger | Capability | Output |
|---------|------------|--------|
| Before confirm | Fraud / credit risk | Hold recommendation |
| Reserve | Demand forecast | Split warehouse suggestion |
| Pack | Warehouse balancing | Optimal ship-from WH |
| Delivery delay | Payment prediction | Notify customer proactively |
| Open order aging | Next best action | Chase confirmation/shipment |

### Workflow Diagram

```text
  Quotation SQ-0188 → Draft SO-1042
        │
        ▼
  confirm → CONFIRMED
  Credit check: ৳85K limit, ৳42K open → OK
  Discount 5% → auto-approved
        │
        ▼
  reserve → RESERVED
  Inventory: +500 qty_reserved @ WH-DHK, batch LOT-8821 (FEFO)
        │
        ▼
  Warehouse pick/pack → PACKED (Shipment SH-0312)
        │
        ▼
  ship → SHIPPED (partial: 300 of 500)
  Inventory: −300 on_hand, −300 reserved
  Order: partially_shipped
        │
        ▼
  deliver → DELIVERED (carrier POD)
        │
        ▼
  Remaining 200: pack → ship → deliver
  Order → CLOSED (after invoice §5)
  Event: sales.order.closed
```

---

## 3. Return Workflow

**Workflow ID:** `sales.return`  
**Primary tables:** `sales_returns`, `sales_return_items`  
**Route:** `/sales/returns` · `/sales/returns/[id]`

### Purpose

Customer RMA — receive goods back, restock inventory, trigger credit note or refund.

### Trigger

| Source | Action |
|--------|--------|
| **Customer request** | Portal / support ticket |
| **Delivery failure** | Undelivered return-to-sender |
| **Wrong item shipped** | Warehouse error |
| **Defective product** | Warranty claim |
| **Order cancellation post-ship** | Partial fulfillment cancel |
| **Commerce return sync** | `commerce.return.requested` (config) |

### States

```text
┌─────────────┐     ┌──────────┐     ┌──────────┐     ┌───────────┐     ┌───────────┐
│  REQUESTED  │────▶│ APPROVED │────▶│ RECEIVED │────▶│ RESTOCKED │────▶│ COMPLETED │
└─────────────┘     └──────────┘     └──────────┘     └───────────┘     └───────────┘
       │                  │
       ▼                  ▼
┌─────────────┐    ┌─────────────┐
│  REJECTED   │    │  CANCELLED  │
└─────────────┘    └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Requested | `requested` | Customer/initiator opened RMA |
| Approved | `approved` | CS/manager approved return |
| Received | `received` | Goods physically received at warehouse |
| Restocked | `restocked` | Inventory return movement posted |
| Completed | `completed` | Credit note or refund linked |
| Rejected | `rejected` | Return denied |
| Cancelled | `cancelled` | Voided before receive |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `request` | — | `requested` | Customer / support | Order/shipment link | `sales.return.requested` |
| `approve` | `requested` | `approved` | CS lead / manager | Within policy window | `sales.return.approved` |
| `reject` | `requested` | `rejected` | CS lead | Reason required | `sales.return.rejected` |
| `receive` | `approved` | `received` | Warehouse | Qty ≤ shipped | `sales.return.received` |
| `restock` | `received` | `restocked` | Warehouse / system | QC pass (policy) | `sales.return.restocked` |
| `complete` | `restocked` | `completed` | System | CN or refund initiated | `sales.return.completed` |
| `cancel` | `requested`, `approved` | `cancelled` | Customer / CS | Not received | `sales.return.cancelled` |

### Inventory Integration on `restock`

```text
sales.return.restocked
     ↓
Inventory Stock In (return):
  movement_type: return
  qty_on_hand: +N
  batch_id / serial_ids: restored or quarantine
     ↓
Event: inventory.stock_in.posted
```

### Reason Codes

| Code | Use Case |
|------|----------|
| `defective` | Product failure |
| `wrong_item` | Shipped incorrect SKU |
| `changed_mind` | Customer remorse (policy window) |
| `damaged_in_transit` | Carrier damage |
| `not_as_described` | Spec mismatch |
| `duplicate_order` | Customer error |

### Approval Rules

| Condition | Approver | Permission |
|-----------|----------|------------|
| Return value > threshold | CS manager | `sales.return.approve` |
| Outside return window | CS lead + manager | `sales.return.approve_late` |
| Open-box / used item | Manager | `sales.return.approve_used` |
| High-value serial return | Warehouse supervisor | `sales.return.approve_serial` |
| Return without original shipment | Fraud review | `sales.return.approve_no_ship` |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `request` | `sales:return:{id}` | Reason, order line refs |
| `approve` / `reject` | `sales:return:{id}` | `approval_change` |
| `receive` | `sales:return:{id}` | Received qty, condition photos |
| `restock` | `inventory:item:{id}` | `movement` return (+qty) |
| `complete` | `sales:credit_note:{id}` or `sales:refund:{id}` | Financial resolution link |

### AI Actions

| Trigger | Capability | Output |
|---------|------------|--------|
| Return request | Fraud / credit risk | Approve/review flag |
| Repeat returns by customer | Churn risk | Customer risk tier |
| Defective SKU pattern | Anomaly | Supplier quality flag |
| Return window near expiry | Next best action | Proactive CS outreach |

### Workflow Diagram

```text
  Customer: "Wrong size" on SO-1042 / SH-0312
        │
        ▼
  Create RMA-2026-0091 (REQUESTED)
  Lines: SKU-X × 2, reason: wrong_item
        │
        ▼
  approve → APPROVED (within 30-day window)
        │
        ▼
  Warehouse receives → RECEIVED
  QC: resellable
        │
        ▼
  restock → RESTOCKED
  Inventory: return +2 @ WH-DHK
        │
        ▼
  complete → COMPLETED
  Credit note CN-0044 + Refund REF-0022 (§4)
  Event: sales.return.completed
```

---

## 4. Refund Workflow

**Workflow ID:** `sales.refund`  
**Related:** `sales_credit_notes` (AR credit document)  
**Primary table:** `sales_refunds`  
**Routes:** `/sales/payments` · `/sales/credit-notes` · `/sales/returns/[id]`

### Purpose

Return money to customer — gateway reversal, bank transfer, wallet credit, or cash. Distinct from **credit note** (AR adjustment); refund is **cash out**.

### Refund vs Credit Note

| Document | Purpose | Finance Impact |
|----------|---------|----------------|
| **Credit Note** | Reduce customer AR | DR Revenue / CR AR |
| **Refund** | Pay customer back | DR AR / CR Cash (or gateway) |

Typical flow: Return → Credit Note posted → Refund executes payment.

### Trigger

| Source | Action |
|--------|--------|
| **Return complete** | Auto-refund on RMA resolution |
| **Order cancel post-payment** | Full order cancellation |
| **Partial cancellation** | Line-level refund |
| **Overpayment** | Payment > invoice |
| **Goodwill gesture** | Manual CS refund |
| **Commerce sync** | `commerce.refund.requested` |

### States

```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  REQUESTED  │────▶│  APPROVED   │────▶│ PROCESSING  │────▶│  COMPLETED  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                  │                   │
       ▼                  ▼                   ▼
┌─────────────┐    ┌─────────────┐     ┌─────────────┐
│  REJECTED   │    │  CANCELLED  │     │   FAILED    │
└─────────────┘    └─────────────┘     └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Requested | `requested` | Refund initiated |
| Approved | `approved` | Manager/finance approved |
| Processing | `processing` | Gateway/bank in flight |
| Completed | `completed` | Funds returned to customer |
| Failed | `failed` | Gateway/bank error |
| Rejected | `rejected` | Denied |
| Cancelled | `cancelled` | Voided before processing |

### Refund Types

| Type | Code | Description |
|------|------|-------------|
| Full | `full` | Entire order/invoice amount |
| Partial | `partial` | Line or partial qty |
| Gateway | `gateway` | bKash, card, SSLCommerz reversal |
| Bank | `bank` | Manual bank transfer |
| Wallet | `wallet` | Store credit / customer wallet |
| Cash | `cash` | POS cash return |
| Store Credit | `store_credit` | No cash — wallet only |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `request` | — | `requested` | CS / system | Payment or CN exists | `sales.refund.requested` |
| `approve` | `requested` | `approved` | Finance / manager | Value threshold | `sales.refund.approved` |
| `reject` | `requested` | `rejected` | Manager | Reason | `sales.refund.rejected` |
| `process` | `approved` | `processing` | System / gateway | Gateway API call | `sales.refund.processing` |
| `complete` | `processing` | `completed` | Gateway callback | Success ref | `sales.refund.completed` |
| `fail` | `processing` | `failed` | Gateway callback | Error code | `sales.refund.failed` |
| `retry` | `failed` | `processing` | Finance | Manual retry | `sales.refund.retry` |
| `cancel` | `requested`, `approved` | `cancelled` | Manager | Not processed | `sales.refund.cancelled` |

### Credit Note Sub-Flow (`sales.credit_note`)

When refund requires AR adjustment first:

```text
Return restocked → Credit Note: draft → posted → applied
     ↓
Refund: requested → approved → processing → completed
     ↓
Accounting: DR AR, CR Cash (Finance consumer)
```

| CN State | Description |
|----------|-------------|
| `draft` | CN created from return |
| `posted` | AR reduced |
| `applied` | Linked to refund |
| `refunded` | Refund completed |

### Approval Rules

| Condition | Approver | Permission |
|-----------|----------|------------|
| Refund > threshold | Finance manager | `sales.refund.approve` |
| Gateway refund after 90 days | Finance controller | `sales.refund.approve_late` |
| Refund without return | CS lead + finance | `sales.refund.approve_no_return` |
| Wallet → cash conversion | Manager | `sales.refund.approve_wallet_cash` |
| Duplicate refund attempt | System block | — |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `request` | `sales:refund:{id}` | Amount, type, order/invoice ref |
| `approve` | `sales:refund:{id}` | `approval_change` |
| `process` | `sales:refund:{id}` | Gateway ref, method |
| `complete` | `sales:refund:{id}` | Settlement ID, timestamp |
| `fail` | `sales:refund:{id}` | Error code, retry hint |
| CN link | `sales:credit_note:{id}` | CN posted before refund |

### AI Actions

| Trigger | Capability | Output |
|---------|------------|--------|
| Refund request | Fraud / credit risk | Review flag, risk score |
| High return + refund rate | Churn risk | Customer tier downgrade |
| Gateway fail pattern | Anomaly | Payment method investigation |
| Refund amount vs return qty | Price anomaly | Partial refund suggestion |

### Workflow Diagram

```text
  RMA-0091 completed, restocked +2 units @ ৳420 = ৳840
        │
        ▼
  Credit Note CN-0044: draft → posted
  AR reduced ৳840
        │
        ▼
  Refund REF-0022 (REQUESTED)
  type: gateway (original bKash payment)
        │
        ▼
  approve → APPROVED (≤ ৳5,000 auto)
        │
        ▼
  process → PROCESSING (bKash API reversal)
        │
        ├── success → COMPLETED
        │   Event: sales.refund.completed
        │   Accounting: DR AR, CR Cash
        │
        └── fail → FAILED → retry or manual bank
```

---

## 5. Invoice Workflow

**Workflow ID:** `sales.invoice`  
**Primary tables:** `sales_invoices`, `sales_invoice_items`  
**Route:** `/sales/invoices` · `/sales/invoices/[id]`

### Purpose

Customer billing document — posts to Accounting AR. May follow shipment or precede it (policy).

### Trigger

| Source | Action |
|--------|--------|
| **Ship complete** | Auto-invoice on deliver (policy) |
| **Manual invoice** | Service / milestone billing |
| **Order confirm** | Prepayment / proforma (policy) |
| **Subscription cycle** | Recurring billing (future) |
| **Commerce sync** | Mirror from `commerce_orders` |
| **Partial ship** | Invoice shipped qty only |

### States

```text
┌─────────┐     ┌──────────┐     ┌───────────────┐     ┌─────────┐     ┌──────────┐
│  DRAFT  │────▶│  POSTED  │────▶│ PARTIALLY_PAID│────▶│   PAID  │────▶│ CLOSED   │
└─────────┘     └──────────┘     └───────────────┘     └─────────┘     └──────────┘
       │              │                  │                 │
       ▼              ▼                  ▼                 ▼
┌─────────────┐ ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  CANCELLED  │ │  OVERDUE    │    │ WRITTEN_OFF │    │  CANCELLED  │
└─────────────┘ └─────────────┘    └─────────────┘    └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Draft | `draft` | Lines editable |
| Posted | `posted` | AR journal created |
| Partially Paid | `partially_paid` | Some allocation received |
| Paid | `paid` | Fully allocated |
| Overdue | `overdue` | Past `due_date`, balance > 0 |
| Written Off | `written_off` | Bad debt (Finance) |
| Closed | `closed` | Archived after paid |
| Cancelled | `cancelled` | Voided before post |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `create` | — | `draft` | Rep / system | Order/shipment link | `sales.invoice.created` |
| `post` | `draft` | `posted` | Finance / rep | Approval if pre-ship | `sales.invoice.posted` |
| `allocate` | `posted`, `partially_paid` | `partially_paid`, `paid` | Payment §6 | Allocation amount | `sales.invoice.allocation` |
| `mark_overdue` | `posted`, `partially_paid` | `overdue` | Scheduled job | due_date passed | `sales.invoice.overdue` |
| `write_off` | `overdue` | `written_off` | Finance controller | Approval | `sales.invoice.written_off` |
| `close` | `paid` | `closed` | System | — | `sales.invoice.closed` |
| `cancel` | `draft` | `cancelled` | Manager | Not posted | `sales.invoice.cancelled` |
| `credit` | `posted` | `posted` | CN §4 | Credit note applied | `sales.credit_note.posted` |

### Invoice Timing Policies

| Policy | Flow |
|--------|------|
| **Invoice on ship** | Deliver → auto draft → post |
| **Invoice on order** | Confirm → proforma/post (B2B prepaid) |
| **Invoice on delivery** | Delivered → post (default B2B) |
| **Manual** | Rep creates anytime |

### Finance Handoff on `post`

```text
sales.invoice.posted
     ↓
Accounting: AR journal (DR AR, CR Revenue)
     ↓
Order: quantity_invoiced updated
     ↓
CRM: opportunity revenue recognized (if linked)
     ↓
Event: accounting.invoice.posted (Finance consumer)
```

### Approval Rules

| Condition | Approver | Permission |
|-----------|----------|------------|
| Post before ship | Finance | `sales.invoice.post_before_ship` |
| Invoice value > threshold | Finance manager | `sales.invoice.approve` |
| Discount on invoice vs order | Sales manager | `sales.invoice.approve_discount` |
| Write-off | Finance controller | `sales.invoice.write_off` |
| Tax-exempt customer | Compliance | `sales.invoice.approve_tax_exempt` |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `create` | `sales:invoice:{id}` | Source order/shipment |
| `post` | `sales:invoice:{id}` | `status_change`, accounting entry ID |
| `allocate` | `sales:invoice:{id}` | Payment ref, amount applied |
| `mark_overdue` | `sales:invoice:{id}` | Days overdue |
| `write_off` | `sales:invoice:{id}` | Bad debt reason |
| CN link | `sales:credit_note:{id}` | Credit applied |

### AI Actions

| Trigger | Capability | Output |
|---------|------------|--------|
| Invoice due soon | Payment prediction | Likely pay date |
| Overdue pattern | Churn risk | Escalation task |
| Invoice vs shipment qty | Anomaly | Mismatch flag |
| Customer payment history | Payment prediction | Suggest payment terms |

### Workflow Diagram

```text
  SO-1042 DELIVERED (500 units)
  Policy: invoice on delivery
        │
        ▼
  Auto-create INV-2026-0440 (DRAFT)
  Lines: 500 × ৳420 = ৳210,000
        │
        ▼
  post → POSTED
  Accounting AR entry
  due_date: Net 30 (2026-07-13)
  CRM: opportunity → Won
        │
        ▼
  Payment PAY-0088 allocates ৳210,000 → PAID
        │
        ▼
  close → CLOSED
  Order SO-1042 → CLOSED
  Event: sales.invoice.closed
```

---

## 6. Payment Workflow

**Workflow ID:** `sales.payment`  
**Primary tables:** `sales_payments`, `sales_payment_allocations`  
**Route:** `/sales/payments` · `/sales/payments/[id]`

### Purpose

Record customer payments and allocate to open invoices — commercial record before Finance bank reconciliation.

### Trigger

| Source | Action |
|--------|--------|
| **Manual entry** | AR clerk records bank/cash receipt |
| **Gateway webhook** | bKash, SSLCommerz, card capture |
| **POS settlement** | End-of-day batch |
| **Prepayment on order** | Confirm with payment |
| **Wallet apply** | Customer wallet balance |
| **Commerce sync** | `commerce.payment.received` |

### States

```text
┌─────────┐     ┌─────────┐     ┌───────────┐     ┌───────────┐
│ PENDING │────▶│ CLEARED │────▶│ ALLOCATED │────▶│ RECONCILED│
└─────────┘     └─────────┘     └───────────┘     └───────────┘
       │              │                 │
       ▼              ▼                 ▼
┌─────────────┐ ┌─────────────┐   ┌─────────────┐
│   BOUNCED   │ │  CANCELLED  │   │  REFUNDED   │
└─────────────┘ └─────────────┘   └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Pending | `pending` | Initiated; not cleared |
| Cleared | `cleared` | Funds confirmed (bank/gateway) |
| Allocated | `allocated` | Applied to invoice(s) |
| Reconciled | `reconciled` | Finance bank rec matched |
| Bounced | `bounced` | Cheque/transfer failed |
| Cancelled | `cancelled` | Voided before clear |
| Refunded | `refunded` | Payment reversed (§4) |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `record` | — | `pending` | Clerk / gateway | Amount > 0 | `sales.payment.recorded` |
| `clear` | `pending` | `cleared` | Bank / gateway | Settlement confirmed | `sales.payment.cleared` |
| `allocate` | `cleared` | `allocated` | System / clerk | Invoice open balance | `sales.payment.allocated` |
| `reconcile` | `allocated` | `reconciled` | Finance | Bank statement match | `sales.payment.reconciled` |
| `bounce` | `pending`, `cleared` | `bounced` | Bank | NSF / fail | `sales.payment.bounced` |
| `refund` | `cleared`, `allocated` | `refunded` | Refund §4 | Approval | `sales.payment.refunded` |
| `cancel` | `pending` | `cancelled` | Manager | Not cleared | `sales.payment.cancelled` |

### Allocation Logic

**Table:** `sales_payment_allocations`

```text
For each cleared payment:
  1. Match customer contact_id
  2. Apply to open invoices (FIFO by due_date or manual select)
  3. invoice.amount_paid += allocated
  4. invoice.amount_due -= allocated
  5. invoice state → partially_paid | paid
```

### Finance Handoff on `clear` + `allocate`

```text
sales.payment.cleared
sales.payment.allocated
     ↓
Accounting: cash receipt (DR Cash, CR AR)
     ↓
Event: accounting.payment.received
```

Sales records commercial payment; Finance owns bank reconciliation.

### Approval Rules

| Condition | Approver | Permission |
|-----------|----------|------------|
| Manual payment > threshold | Finance | `sales.payment.approve_manual` |
| Allocation override (non-FIFO) | AR supervisor | `sales.payment.approve_allocation` |
| Bounced cheque re-present | Finance | `sales.payment.approve_bounce` |
| Refund on allocated payment | Finance manager | `sales.refund.approve` |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `record` | `sales:payment:{id}` | Method, reference, amount |
| `clear` | `sales:payment:{id}` | Settlement date |
| `allocate` | `sales:invoice:{id}` | Amount per invoice |
| `reconcile` | `sales:payment:{id}` | Bank statement ref |
| `bounce` | `sales:payment:{id}` | Reason, invoice reopen |
| `refund` | `sales:refund:{id}` | Link to refund workflow |

### AI Actions

| Trigger | Capability | Output |
|---------|------------|--------|
| Invoice overdue | Payment prediction | Suggest collection call date |
| Partial payment pattern | Churn risk | Credit hold recommendation |
| Allocation mismatch | Anomaly | Unapplied cash flag |
| Customer pay habit | Payment prediction | Optimal due date for new invoice |

### Workflow Diagram

```text
  Customer bank transfer ৳210,000 (INV-0440)
        │
        ▼
  Record PAY-2026-0088 (PENDING)
  method: bank, ref: NEFT-8844221
        │
        ▼
  clear → CLEARED (bank confirms T+1)
        │
        ▼
  allocate → ALLOCATED
  INV-0440: ৳210,000 applied → invoice PAID
        │
        ▼
  Finance bank rec → RECONCILED
  Event: sales.payment.reconciled
  Event: accounting.payment.received
```

---

## 7. Approval Rules

Central reference for all Sales workflow approvals. Integrates [Approval Engine](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) and [Workflow Engine](../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md).

### Approval Matrix

| Document | Trigger | Condition | Approver | Permission |
|----------|---------|-----------|----------|------------|
| **Quotation** | Negotiation → Approved | Discount > threshold | Sales manager | `sales.quotation.approve` |
| **Quotation** | Negotiation | Price below floor | Sales manager + finance | `sales.pricing.override` |
| **Sales Order** | Draft → Confirmed | Discount > threshold | Sales manager | `sales.order.approve` |
| **Sales Order** | Confirm | Credit limit exceeded | Finance / manager | `sales.order.approve_credit` |
| **Sales Order** | Confirm | Backorder (zero stock) | Sales manager | `sales.order.confirm_backorder` |
| **Sales Order** | On hold release | Fraud/credit hold | Manager | `sales.order.release_hold` |
| **Return** | Requested → Approved | Value > threshold | CS manager | `sales.return.approve` |
| **Return** | Outside window | Any value | CS lead + manager | `sales.return.approve_late` |
| **Refund** | Requested → Approved | Value > threshold | Finance manager | `sales.refund.approve` |
| **Refund** | No return | Any | CS + finance | `sales.refund.approve_no_return` |
| **Invoice** | Draft → Posted | Post before ship | Finance | `sales.invoice.post_before_ship` |
| **Invoice** | Post | Value > threshold | Finance manager | `sales.invoice.approve` |
| **Invoice** | Write-off | Bad debt | Finance controller | `sales.invoice.write_off` |
| **Payment** | Manual record | Amount > threshold | Finance | `sales.payment.approve_manual` |
| **Credit Note** | Post | Value > threshold | Manager + finance | `sales.credit_note.post` |

### Credit Limit Check (Order Confirm)

```text
On confirm (Draft → Confirmed):
  open_ar     = Finance API: customer AR balance
  open_orders = sum(uninvoiced confirmed orders)
  exposure    = open_ar + open_orders + this_order.total

  if exposure > credit_limit:
    → block OR route to sales.order.approve_credit
  if customer.is_blocked:
    → hard block
```

### Separation of Duties (SoD)

| Rule | Enforcement |
|------|-------------|
| Rep cannot approve own quotation discount | System guard |
| Rep cannot approve own order | System guard above L1 |
| Invoice post may require finance role (not sales rep) | Policy `sales.invoice.finance_only_post` |
| Refund approver ≠ refund requester | Configurable SoD |
| Write-off approver ≠ invoice creator | Finance policy |

### Multi-Level Flow (High-Value Order)

```text
SO-1042 Confirm (৳210,000, discount 12%)
        │
        ▼
  ┌─────────────────┐
  │ Discount > 5%?  │──yes──▶ Sales Manager APPROVE
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │ Credit exposure   │──exceed──▶ Finance APPROVE_CREDIT
  │ > credit_limit?   │
  └────────┬────────┘
           │ ok
           ▼
       CONFIRMED → reserve
```

### Policy Configuration (`/sales/settings`)

| Group | Key | Description |
|-------|-----|-------------|
| Quotation | `discount_approval_threshold` | % or value |
| Order | `discount_approval_threshold` | Order-level discount |
| Order | `credit_limit_enforcement` | block / approve / warn |
| Return | `return_window_days` | Default 30 |
| Return | `approval_threshold` | RMA value |
| Refund | `approval_threshold` | Refund value |
| Invoice | `post_before_ship` | boolean |
| Invoice | `auto_invoice_on_deliver` | boolean |
| Payment | `allocation_method` | fifo_due / manual |

---

## 8. AI Actions

**Agent:** Sales Agent · **Governance:** [SALES_MODULE_ARCHITECTURE.md §15](./SALES_MODULE_ARCHITECTURE.md)

### Principles

| # | Rule |
|---|------|
| 1 | Pricing suggestions require approval above threshold |
| 2 | Credit hold recommendations need human confirm |
| 3 | No auto-confirm order without policy |
| 4 | Refund/chargeback AI flags — human approves |
| 5 | All runs logged in Activity `AI Actions` |

### Capabilities by Workflow

| Workflow | AI Capability | Input | Output | Apply Action |
|----------|---------------|-------|--------|--------------|
| **Quotation** | Quote optimization | History, margin rules | Line prices | Pre-fill quote |
| **Quotation** | Win probability | CRM opportunity | Close % | Pipeline priority |
| **Quotation** | Upsell / cross-sell | Lines, catalog | Add-on SKUs | Add lines |
| **Order** | Fraud / credit risk | Order pattern, customer | Hold score | On-hold flag |
| **Order** | Demand forecast | Velocity | Qty hint | Quote/order qty |
| **Order** | Warehouse balancing | Multi-WH stock | Ship-from WH | Update warehouse_id |
| **Return** | Fraud / credit risk | Return history | Review flag | Approve queue |
| **Return** | Churn risk | Return rate | Risk tier | CS escalation |
| **Refund** | Fraud / credit risk | Refund pattern | Block/review | Approval route |
| **Invoice** | Payment prediction | Pay history | Likely pay date | Collection task |
| **Invoice** | Churn risk | Overdue pattern | Escalation | Dunning hint |
| **Payment** | Payment prediction | Customer habit | Optimal terms | Invoice due_date |
| **Customer** | Next best action | Open quotes, overdue | Follow-up task | Rep dashboard |
| **Customer** | Churn risk | Recency, support | Risk score | Customer 360 badge |

### AI Action Lifecycle

```text
Trigger (event, schedule, user ask, CRM stage change)
        │
        ▼
Sales Agent (context: customer, orders, AR, CRM, inventory)
        │
        ▼
Suggestion Queue (/sales dashboard widget)
        │
        ├── Review → Dismiss (Activity: ai_action dismissed)
        │
        └── Apply → Human confirm (if policy requires)
                │
                ├── Update quote/order field
                ├── Create follow-up task
                └── Activity: ai_action applied
```

### Data Context

```text
sales_orders + sales_quotations + sales_customer_profiles
     +
crm_opportunities + Finance AR (read API)
     +
inventory_stock_levels + inventory_reservations
     +
Product Master (variant, price list)
     ↓
AI Context Engine → Sales Agent
```

**Prototype:** [ui-prototype/ai-os/AiSalesForecast.md](../../04-uiux/prototype/ai-os/AiSalesForecast.md)

---

## 9. Activity Tracking

Integrates [Activity & Chatter Architecture](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md). Every Sales workflow transition produces an auditable Activity record.

### Entity Types

| Entity | Activity ID Pattern | Primary Workflows |
|--------|---------------------|-------------------|
| Customer | `sales:customer:{contact_id}` | All (context) |
| Quotation | `sales:quotation:{id}` | §1 |
| Sales Order | `sales:order:{id}` | §2 |
| Shipment | `sales:shipment:{id}` | §2 |
| Return | `sales:return:{id}` | §3 |
| Refund | `sales:refund:{id}` | §4 |
| Credit Note | `sales:credit_note:{id}` | §4 |
| Invoice | `sales:invoice:{id}` | §5 |
| Payment | `sales:payment:{id}` | §6 |

### Event → Activity Type Mapping

| Workflow Event | Activity Type | Entity | Payload |
|----------------|---------------|--------|---------|
| `sales.quotation.sent` | `status_change` | `sales:quotation:{id}` | Recipient, version |
| `sales.quotation.revised` | `update` | `sales:quotation:{id}` | Price diff |
| `sales.quotation.approved` | `approval_change` | `sales:quotation:{id}` | Discount % |
| `sales.quotation.converted` | `status_change` | `sales:order:{id}` | SQ → SO link |
| `sales.order.confirmed` | `status_change` | `sales:order:{id}` | Credit check |
| `sales.order.reserved` | `reservation` | `sales:order:{id}` | Batch, qty |
| `sales.shipment.shipped` | `status_change` | `sales:shipment:{id}` | Tracking |
| `sales.shipment.shipped` | `movement` | `inventory:item:{id}` | Stock out ref |
| `sales.shipment.delivered` | `status_change` | `sales:shipment:{id}` | POD |
| `sales.return.approved` | `approval_change` | `sales:return:{id}` | Reason |
| `sales.return.restocked` | `movement` | `inventory:item:{id}` | Return +qty |
| `sales.refund.completed` | `status_change` | `sales:refund:{id}` | Gateway ref |
| `sales.invoice.posted` | `status_change` | `sales:invoice:{id}` | Accounting entry |
| `sales.payment.allocated` | `update` | `sales:invoice:{id}` | Amount applied |
| `sales.order.closed` | `status_change` | `sales:order:{id}` | Final state |
| AI suggestion applied | `ai_action` | Source entity | Agent, prompt version |
| Price override | `price_change` | `sales:quotation/order:{id}` | Old → new price |

### UI Patterns

| Surface | Activity UX |
|---------|-------------|
| **List pages** | Activity icon → Global Activity Drawer |
| **Order workspace** | Activity tab + inline approval comments |
| **Quotation detail** | Negotiation version timeline |
| **Customer 360** | Aggregated quotes, orders, invoices, returns |
| **Invoice detail** | Payment allocation thread |
| **Return detail** | Restock + refund link chain |

### Cross-Module Activity Links

```text
sales:order:{id}
     └── links to → sales:quotation:{id} (converted from)
     └── links to → sales:shipment:{id} (fulfillment)
     └── links to → inventory:item:{id} (reservation, stock out)
     └── links to → sales:invoice:{id} (billing)

sales:return:{id}
     └── links to → sales:order:{id} (origin)
     └── links to → sales:credit_note:{id} (AR credit)
     └── links to → sales:refund:{id} (cash back)
     └── links to → inventory:item:{id} (restock)

sales:invoice:{id}
     └── links to → sales:payment:{id} (allocation)
     └── links to → accounting:entry:{id} (on post, future)
```

### Audit Requirements

| Requirement | Implementation |
|-------------|----------------|
| Immutable history | Activity append-only |
| Approver identity | User ID + timestamp on `approval_change` |
| Quote versions | `sales_quotation_revisions` + Activity per version |
| Order status | `sales_order_status_history` for state machine |
| Price changes | `price_change` activity with before/after |
| AI reproducibility | Prompt version on `ai_action` |
| Print trail | Invoice/packing slip via `(print)` routes |

---

## Cross-Workflow Integration Map

```text
                    ┌─────────────────────────────────────┐
                    │        QUOTATION WORKFLOW (§1)       │
                    │  draft → sent → negotiation → approved │
                    └───────────────────┬─────────────────┘
                                        │ convert
                                        ▼
                    ┌─────────────────────────────────────┐
                    │      SALES ORDER WORKFLOW (§2)         │
                    │  draft → confirmed → reserved → packed │
                    │         → shipped → delivered → closed │
                    └───────┬─────────────────┬─────────────┘
                            │ ship            │ invoice
                            ▼                 ▼
              ┌─────────────────────┐  ┌─────────────────────┐
              │  INVENTORY STOCK OUT   │  │  INVOICE WORKFLOW (§5) │
              │  [INVENTORY_WORKFLOW]  │  │  draft → posted → paid │
              └─────────────────────┘  └──────────┬──────────┘
                                                    │ payment
                                                    ▼
                                         ┌─────────────────────┐
                                         │  PAYMENT WORKFLOW (§6) │
                                         │  pending → cleared →  │
                                         │  allocated → reconciled │
                                         └─────────────────────┘
                            return
                            ▼
              ┌─────────────────────┐
              │   RETURN WORKFLOW (§3) │
              │  requested → restocked  │
              └──────────┬──────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
┌─────────────────┐            ┌─────────────────┐
│ CREDIT NOTE      │            │ REFUND (§4)      │
│ (AR adjustment)  │───────────▶│ cash / gateway   │
└─────────────────┘            └─────────────────┘
         │
         ▼
┌─────────────────┐
│ INVENTORY RESTOCK│
│ [INVENTORY §1]   │
└─────────────────┘
```

### Domain Event Chain (Full Quote-to-Cash)

```text
sales.quotation.sent
sales.quotation.approved
sales.quotation.converted
     ↓
sales.order.confirmed
sales.order.reserved
inventory.reservation.activated
     ↓
sales.shipment.shipped
inventory.stock_out.shipped
     ↓
sales.shipment.delivered
     ↓
sales.invoice.posted
accounting.invoice.posted
     ↓
sales.payment.cleared
sales.payment.allocated
accounting.payment.received
     ↓
sales.order.closed
     ↓
(path: sales.return.restocked → sales.credit_note.posted → sales.refund.completed)
```

---

## Workflow Engine Registration

All workflows register with Core [WORKFLOW_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md):

```yaml
# Example: sales.order
model: sales_orders
workflow_id: sales.order
states:
  - draft
  - confirmed
  - reserved
  - packed
  - shipped
  - partially_shipped
  - delivered
  - partially_delivered
  - closed
  - on_hold
  - cancelled
transitions:
  - name: confirm
    from: draft
    to: confirmed
    permission: sales.order.create
    approval_policy: sales.order.discount_approval_threshold
  - name: reserve
    from: confirmed
    to: reserved
    permission: sales.order.confirm
    event: sales.order.reserved
  - name: ship
    from: [packed, reserved]
    to: [shipped, partially_shipped]
    permission: sales.shipment.create
    event: sales.shipment.shipped
  - name: close
    from: [delivered, partially_delivered]
    to: closed
    permission: sales.order.create
    event: sales.order.closed
```

Full registry: [WORKFLOW_REGISTRY.md](../../00-foundation/registries/WORKFLOW_REGISTRY.md)

---

## Permissions Summary

| Workflow | Key Permissions |
|----------|-----------------|
| Quotation | `sales.quotation.create`, `sales.quotation.approve` |
| Order | `sales.order.create`, `sales.order.approve`, `sales.order.confirm`, `sales.order.confirm_backorder` |
| Shipment | `sales.shipment.create`, `sales.shipment.read` |
| Return | `sales.return.create`, `sales.return.approve`, `sales.return.approve_late` |
| Refund | `sales.refund.approve`, `sales.refund.approve_no_return` |
| Invoice | `sales.invoice.create`, `sales.invoice.post`, `sales.invoice.write_off` |
| Payment | `sales.payment.create`, `sales.payment.approve_manual` |
| Credit Note | `sales.credit_note.post` |
| AI | `sales.ai.apply` |

Full list: [SALES_MODULE_ARCHITECTURE.md §16](./SALES_MODULE_ARCHITECTURE.md)

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| [SALES_MODULE_ARCHITECTURE.md](./SALES_MODULE_ARCHITECTURE.md) | Module architecture (parent) |
| [INVENTORY_WORKFLOW.md](../inventory/INVENTORY_WORKFLOW.md) | Reservation, Stock Out, return restock |
| [PURCHASE_WORKFLOW.md](../purchase/PURCHASE_WORKFLOW.md) | Drop-ship PO (future) |
| [modules/ecommerce/orders/ARCHITECTURE.md](../ecommerce/orders/ARCHITECTURE.md) | Commerce order engine alignment |
| [PRODUCT_MASTER_ARCHITECTURE.md](../../02-core-platform/subsystems/PRODUCT_MASTER_ARCHITECTURE.md) | Line item product refs |
| [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) | Activity platform |
| [core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md) | State machine engine |
| [core/engines/APPROVAL_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) | Approval policies |
| [WORKFLOW_REGISTRY.md](../../00-foundation/registries/WORKFLOW_REGISTRY.md) | Platform workflow index |

---

## Document Control

| Field | Value |
|-------|-------|
| **Owner** | Platform Team · Sales Domain |
| **Reviewers** | Architecture, Sales Ops, Finance, CRM |
| **Next Review** | At workflow engine implementation gate |
| **Status Gate** | Documentation First — Ready for UI/UX Planning |

**Changelog:** [CHANGELOG.md](../../00-foundation/CHANGELOG.md)
