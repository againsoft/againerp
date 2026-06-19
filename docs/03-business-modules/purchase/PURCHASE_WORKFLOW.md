# AgainERP — Purchase Workflows

> **Status:** Approved  
> **Version:** 1.0  
> **Module:** Purchase (Procurement & Vendor Management)  
> **Document Type:** Workflow Specification  
> **Phase:** Documentation First  
> **Route Namespace:** `/purchase/*`  
> **Governance:** [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · **Engine:** [core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md)

**No backend code. No database implementation. No API implementation.**  
This document defines **all Purchase state machines** — RFQ through payment handoff, with approvals, activity logs, and AI recommendations.

### Step 06 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| RFQ Workflow | §1 |
| Purchase Order Workflow | §2 |
| Receiving Workflow | §3 |
| Vendor Bill Workflow | §4 |
| Return Workflow | §5 |
| Approval Rules | §6 |
| AI Recommendations | §7 |
| Activity Tracking | §8 |

Each workflow includes: **Trigger · States · Transitions · text diagrams · cross-module events**

**Related:** [PURCHASE_WORKFLOW.md](./PURCHASE_WORKFLOW.md) · [SALES_WORKFLOW.md](../sales/SALES_WORKFLOW.md) · [INVENTORY_WORKFLOW.md](../inventory/INVENTORY_WORKFLOW.md) · [PRODUCT_MASTER_ARCHITECTURE.md](../../02-core-platform/subsystems/PRODUCT_MASTER_ARCHITECTURE.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) · [WORKFLOW_REGISTRY.md](../../00-foundation/registries/WORKFLOW_REGISTRY.md)

---

## Executive Summary

Purchase workflows govern **procure-to-pay** — from sourcing and vendor quotes through PO, receipt, billing, and returns.

| Pattern | Rule |
|---------|------|
| **Purchase orchestrates** | Business documents live in `purchase_*` tables |
| **Inventory owns stock** | Receipts trigger Inventory Stock In (§3 → [INVENTORY_WORKFLOW.md §1](../inventory/INVENTORY_WORKFLOW.md)) |
| **Finance owns payables** | Bills hand off to Accounting AP — Purchase never posts GL |
| **Core Workflow Engine** | All state machines registered in workflow engine |
| **Event-driven** | Transitions emit `purchase.*` domain events |
| **Activity everywhere** | Every transition logged in Activity drawer |
| **AI assist, not auto-buy** | Agent recommends; human or policy approves PO/bill |

### Workflow Registry IDs

| ID | Entity | Primary Doc Section |
|----|--------|---------------------|
| `purchase.rfq` | `purchase_rfq` | §1 |
| `purchase.quotation` | `purchase_rfq_responses` | §1 |
| `purchase.order` | `purchase_orders` | §2 |
| `purchase.receipt` | `purchase_receipts` | §3 |
| `purchase.bill` | `purchase_vendor_bills` | §4 |
| `purchase.return` | `purchase_returns` | §5 |

---

## Shared Concepts

### Procure-to-Pay Chain

```text
Need / Reorder
     ↓
RFQ (optional) → Vendor Quotation → Award
     ↓
Purchase Order → Approved → Ordered (sent)
     ↓
Goods Receipt → Inventory Stock In
     ↓
Vendor Bill → Three-way Match → Accounting AP
     ↓
Payment (Finance)
     ↓
Return / Debit Note (if needed)
```

### Document Quantity Tracking (PO Line)

| Field | Updated By |
|-------|------------|
| `quantity_ordered` | PO create/amend |
| `quantity_received` | Receipt post |
| `quantity_billed` | Bill match/post |
| `quantity_returned` | Return ship |

### Common Activity Types

| Activity Type | When Used |
|---------------|-----------|
| `create` | Document created |
| `update` | Line or header edit |
| `status_change` | State transition |
| `approval_change` | Approval granted/rejected |
| `movement` | Receipt linked to Inventory |
| `match_change` | Three-way match status |
| `ai_action` | Agent suggestion applied/dismissed |

### Common Policy Keys

| Policy Key | Default | Applies To |
|------------|---------|------------|
| `purchase.po.approval_threshold_l1` | Value-based | PO submit |
| `purchase.po.approval_threshold_l2` | Higher value | Dual approval |
| `purchase.receipt.over_receipt_tolerance` | 0% | Receiving |
| `purchase.receipt.qc_required` | false | Batch/serial items |
| `purchase.bill.match_tolerance_pct` | 2% | Three-way match |
| `purchase.bill.approval_threshold` | Value-based | Bill post |
| `purchase.return.approval_threshold` | Value-based | Vendor return |
| `purchase.rfq.award_approval` | false | RFQ award → PO |

---

## 1. RFQ Workflow

**Workflow ID:** `purchase.rfq`  
**Primary tables:** `purchase_rfq`, `purchase_rfq_items`, `purchase_rfq_vendors`  
**Quotation table:** `purchase_rfq_responses`, `purchase_rfq_response_items`  
**Routes:** `/purchase/rfq` · `/purchase/rfq/[id]` · `/purchase/quotations`

### Purpose

Structured sourcing — compare vendor quotes before committing to a purchase order.

### Trigger

| Source | Action |
|--------|--------|
| **Manual RFQ** | Buyer creates at `/purchase/rfq/create` |
| **Reorder rule** | Inventory below min_qty → suggest RFQ |
| **AI suggestion** | Vendor recommendation for new SKU |
| **Contract expiry** | Re-bid before contract renewal |
| **Project/MRP** | Material requirement (future) |

### States

```text
┌─────────┐     ┌─────────┐     ┌─────────────────┐     ┌─────────────┐
│  DRAFT  │────▶│  SENT   │────▶│ VENDOR_RESPONSE │────▶│  QUOTATION  │
└─────────┘     └─────────┘     └─────────────────┘     └──────┬──────┘
       │              │                    │                      │
       │              │                    │                      ▼
       │              │                    │               ┌─────────────┐
       │              │                    └──────────────▶│  APPROVED   │
       │              │                                    └──────┬──────┘
       │              │                                           │
       ▼              ▼                                           ▼
┌─────────────┐              ┌─────────────┐              ┌─────────────┐
│  CANCELLED  │              │   CLOSED    │              │ PO_CREATED  │
└─────────────┘              └─────────────┘              └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Draft | `draft` | Lines and invited vendors defined |
| Sent | `sent` | RFQ emailed / vendor portal notification |
| Vendor Response | `vendor_response` | At least one vendor submitted quote |
| Quotation | `quotation` | Quotes captured; comparison in progress |
| Approved | `approved` | Award decision approved (policy) |
| PO Created | `po_created` | Winning quote converted to draft PO |
| Closed | `closed` | RFQ archived without PO or after PO created |
| Cancelled | `cancelled` | RFQ voided before award |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `send` | `draft` | `sent` | Buyer | Lines + ≥1 vendor | `purchase.rfq.sent` |
| `record_response` | `sent` | `vendor_response` | Buyer / vendor portal | Quote received | `purchase.rfq.response_received` |
| `enter_quotation` | `vendor_response` | `quotation` | Buyer | Quote lines entered | `purchase.quotation.submitted` |
| `approve_award` | `quotation` | `approved` | Manager | Award selected; SoD | `purchase.rfq.award_approved` |
| `auto_approve` | `quotation` | `approved` | System | Below award threshold | `purchase.rfq.award_approved` |
| `create_po` | `approved` | `po_created` | Buyer / system | Winning vendor set | `purchase.rfq.po_created` |
| `close` | `po_created`, `quotation` | `closed` | Buyer | PO linked or no award | `purchase.rfq.closed` |
| `cancel` | `draft`, `sent` | `cancelled` | Buyer | No PO created | `purchase.rfq.cancelled` |
| `extend_deadline` | `sent`, `vendor_response` | `sent` | Buyer | New response date | `purchase.rfq.deadline_extended` |

### Quotation Sub-Workflow (`purchase.quotation`)

Vendor response captured per invited vendor:

```text
Vendor Quote: draft → submitted → accepted / rejected
                              ↓
                         (accepted = award candidate)
```

| Field | Notes |
|-------|-------|
| `rfq_id` | Parent RFQ |
| `contact_id` | Vendor |
| `quote_number` | Vendor reference |
| `valid_until` | Expiry |
| `total_amount` | Computed from lines |
| `status` | `draft`, `submitted`, `accepted`, `rejected` |
| Line: price, lead_time, MOQ | Per RFQ line |

### Approval Rules

| Condition | Approver | Permission |
|-----------|----------|------------|
| RFQ award (single vendor > threshold) | Procurement manager | `purchase.rfq.award` |
| Award to non-preferred vendor | Category manager | `purchase.rfq.award_override` |
| RFQ cancel after responses received | Manager | `purchase.rfq.cancel` |
| Buyer ≠ award approver (SoD) | Enforced | System guard |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `send` | `purchase:rfq:{id}` | Vendors invited, deadline |
| `record_response` | `purchase:quotation:{id}` | Vendor, quote PDF attachment |
| `enter_quotation` | `purchase:rfq:{id}` | Comparison grid snapshot |
| `approve_award` | `purchase:rfq:{id}` | `approval_change`, winning vendor |
| `create_po` | `purchase:order:{id}` | Link RFQ → PO-{number} |

### AI Recommendations

| Trigger | Capability | Output |
|---------|------------|--------|
| RFQ line fill | RFQ line fill | Suggested items from vendor catalogs |
| Quote comparison | Price anomaly detection | Flag outlier price vs history/contract |
| Vendor selection | Vendor recommendation | Ranked vendors by lead time, rating, price |
| Incomplete responses | Lead time prediction | Reminder to chase vendor by predicted response |
| Award decision | Spend optimization | Consolidate to preferred vendor suggestion |

### Workflow Diagram

```text
  Inventory reorder alert: SKU-X below min_qty
        │
        ▼
  Create RFQ RFQ-2026-0144 (DRAFT)
  Lines: SKU-X × 500, SKU-Y × 200
  Vendors: Acme Supplies, Global Parts
        │
        ▼
  send → SENT (email + portal link, deadline 2026-06-20)
        │
        ├── Acme responds ──▶ VENDOR_RESPONSE
        └── Global responds
                │
                ▼
  Quotes entered → QUOTATION
  Compare: Acme ৳42/unit, Global ৳39/unit (AI flags: 8% below last PO)
        │
        ▼
  Award Global → approve_award → APPROVED
        │
        ▼
  create_po → PO_CREATED (draft PO-8821 pre-filled)
        │
        ▼
  RFQ → CLOSED
  Event: purchase.rfq.po_created
```

---

## 2. Purchase Order Workflow

**Workflow ID:** `purchase.order`  
**Primary tables:** `purchase_orders`, `purchase_order_items`, `purchase_order_status_history`  
**Routes:** `/purchase/orders` · `/purchase/orders/[id]` · `/purchase/orders/create`

### Purpose

Formal commitment to vendor — approved, sent, received, and closed with full quantity traceability.

### Trigger

| Source | Action |
|--------|--------|
| **Manual PO** | Buyer creates at `/purchase/orders/create` |
| **RFQ award** | `purchase.rfq.po_created` |
| **Reorder rule** | Inventory min_qty breach |
| **Contract release** | Blanket PO against `purchase_contracts` |
| **AI suggestion** | Reorder draft from Inventory Agent |
| **Sales drop-ship** | Sales order triggers PO (future) |

### States

```text
┌─────────┐     ┌──────────────────┐     ┌──────────┐     ┌─────────┐
│  DRAFT  │────▶│ PENDING_APPROVAL │────▶│ APPROVED │────▶│ ORDERED │
└─────────┘     └──────────────────┘     └──────────┘     └────┬────┘
       │                 │                      │                 │
       │                 ▼                      ▼                 ▼
       │          ┌─────────────┐        ┌─────────────┐   ┌──────────────────┐
       └─────────▶│  REJECTED   │        │  CANCELLED  │   │ PARTIALLY_RECEIVED│
                  └─────────────┘        └─────────────┘   └─────────┬────────┘
                                                                         │
                                                                         ▼
                                                                ┌─────────────┐
                                                                │  RECEIVED   │
                                                                └──────┬──────┘
                                                                       │
                                                                       ▼
                                                                ┌─────────────┐
                                                                │   CLOSED    │
                                                                └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Draft | `draft` | Buyer editing lines and terms |
| Pending Approval | `pending_approval` | Submitted; awaiting approver chain |
| Approved | `approved` | All approvals complete; ready to send |
| Ordered | `ordered` | Transmitted to vendor (email/EDI/portal) |
| Partially Received | `partially_received` | Some lines/qty received |
| Received | `received` | All order qty received |
| Closed | `closed` | Complete; no further receipts expected |
| Rejected | `rejected` | Approval denied; returned to buyer |
| Cancelled | `cancelled` | Voided before full receipt |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `submit` | `draft` | `pending_approval` | Buyer | Vendor not blocked | `purchase.order.submitted` |
| `auto_approve` | `draft`, `pending_approval` | `approved` | System | Value ≤ L1 threshold | `purchase.order.approved` |
| `approve_l1` | `pending_approval` | `approved` | L1 manager | ≤ L1 threshold | `purchase.order.approved` |
| `approve_l2` | `pending_approval` | `approved` | L2 finance | > L1, ≤ L2 | `purchase.order.approved` |
| `reject` | `pending_approval` | `rejected` | Approver | Comment required | `purchase.order.rejected` |
| `reopen` | `rejected` | `draft` | Buyer | Edit and resubmit | `purchase.order.reopened` |
| `send` | `approved` | `ordered` | Buyer / system | Vendor contact valid | `purchase.order.sent` |
| `receive_partial` | `ordered`, `partially_received` | `partially_received` | Receipt post | qty_received < ordered | `purchase.order.partially_received` |
| `receive_full` | `ordered`, `partially_received` | `received` | Receipt post | qty_received = ordered | `purchase.order.received` |
| `close` | `received` | `closed` | Buyer / system | Bills matched (policy) | `purchase.order.closed` |
| `cancel` | `draft`, `pending_approval`, `approved`, `ordered` | `cancelled` | Manager | No receipt posted | `purchase.order.cancelled` |
| `amend` | `ordered`, `partially_received` | `ordered` | Buyer + approval | Open qty only | `purchase.order.amended` |

### Stock / Finance Side Effects

```text
submit / approve:
  qty_incoming += (ordered − received)   [Inventory expected, optional policy]

send (ordered):
  Event to vendor; no stock change yet

receive_partial / receive_full:
  See §3 Receiving → inventory.stock_in.posted

close:
  qty_incoming cleared; PO locked for receipt
```

### Approval Rules

See §6 for full matrix. Summary:

| Condition | Approver | Permission |
|-----------|----------|------------|
| PO value ≤ L1 threshold | Auto or L1 manager | `purchase.order.approve` |
| PO value > L1, ≤ L2 | L1 + L2 (dual) | `purchase.order.approve_l2` |
| PO value > L2 | Finance controller | `purchase.order.approve_finance` |
| Capex category | Dual approval always | `purchase.order.approve_capex` |
| Buyer = creator (SoD) | Cannot self-approve above limit | System guard |
| Vendor blocked / not preferred | Manager override | `purchase.order.approve_vendor` |
| PO amend after sent | Re-approval if value increase | `purchase.order.approve` |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `submit` | `purchase:order:{id}` | `status_change`, approver chain assigned |
| `approve_l1/l2` | `purchase:order:{id}` | `approval_change`, comment |
| `reject` | `purchase:order:{id}` | Reason, returned to buyer |
| `send` | `purchase:order:{id}` | Sent method, vendor ack |
| `receive_*` | `purchase:order:{id}` | Receipt refs, qty delta |
| `close` | `purchase:order:{id}` | Final totals, linked bills |
| `amend` | `purchase:order:{id}` | Amendment version, diff |

### AI Recommendations

| Trigger | Capability | Output |
|---------|------------|--------|
| Draft PO from reorder | Reorder suggestion | Optimal qty, vendor, price from contract |
| Before submit | Price anomaly detection | Flag unit price vs last PO / contract |
| Expected date | Lead time prediction | Suggested `expected_date` per vendor history |
| Multi-vendor split | Spend optimization | Split PO across vendors for MOQ savings |
| Open PO aging | Vendor performance | Chase vendor if past expected date |

### Workflow Diagram

```text
  RFQ award → Draft PO-8821 (DRAFT)
  Vendor: Global Parts, Total: ৳19,500
        │
        ▼
  submit → PENDING_APPROVAL
        │
        ├── value ≤ ৳50,000 ──▶ L1 Manager APPROVED
        │
        └── value > ৳50,000 ──▶ L1 → L2 Finance APPROVED
        │
        ▼
  send → ORDERED (PDF emailed to vendor)
  Inventory: qty_incoming +500 @ WH-DHK
        │
        ▼
  Receipt #1: 300 units → PARTIALLY_RECEIVED
        │
        ▼
  Receipt #2: 200 units → RECEIVED
        │
        ▼
  Bills matched → CLOSED
  Event: purchase.order.closed
```

---

## 3. Receiving Workflow

**Workflow ID:** `purchase.receipt`  
**Primary tables:** `purchase_receipts`, `purchase_receipt_items`  
**Route:** `/purchase/receipts` · `/purchase/receipts/[id]`  
**Inventory handoff:** [INVENTORY_WORKFLOW.md §1](../inventory/INVENTORY_WORKFLOW.md)

### Purpose

Record physical receipt of goods against PO. **Purchase orchestrates the business document; Inventory posts stock.**

### Trigger

| Source | Action |
|--------|--------|
| **PO receive** | User opens receive from PO detail |
| **Auto-receipt** | Policy: auto-create at PO send % (future) |
| **Warehouse delivery** | Scan vendor delivery note |
| **Drop-ship** | Sales-triggered PO receipt (future) |
| **Return reversal** | Partial — not typical inbound |

### States

```text
┌─────────┐     ┌───────────┐     ┌─────────────┐     ┌──────────┐     ┌───────────┐
│  DRAFT  │────▶│ RECEIVING │────▶│ QC_PENDING  │────▶│  POSTED  │────▶│ COMPLETED │
└─────────┘     └───────────┘     └─────────────┘     └──────────┘     └───────────┘
       │               │                  │                  │
       └───────────────┴──────────────────┴──────────────────┘
                                    │
                                    ▼
                            ┌─────────────┐
                            │  CANCELLED  │
                            └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Draft | `draft` | Receipt created; lines editable |
| Receiving | `receiving` | Warehouse actively counting/scanning |
| QC Pending | `qc_pending` | Batch/serial QC hold before post |
| Posted | `posted` | Inventory movement created; PO qty updated |
| Completed | `completed` | Bill match ready; receipt closed |
| Cancelled | `cancelled` | Voided before post |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `start_receive` | `draft` | `receiving` | Warehouse clerk | PO in ordered/partial state | `purchase.receipt.started` |
| `start_qc` | `receiving` | `qc_pending` | System | `qc_required` or batch tracked | `purchase.receipt.qc_started` |
| `pass_qc` | `qc_pending` | `receiving` | QC inspector | Pass | `purchase.receipt.qc_passed` |
| `fail_qc` | `qc_pending` | `cancelled` | QC inspector | Reject → return workflow | `purchase.receipt.qc_failed` |
| `post` | `receiving`, `qc_pending` | `posted` | Clerk / system | Qty valid; approval if over-receipt | `purchase.receipt.posted` |
| `complete` | `posted` | `completed` | System | PO line updated | `purchase.receipt.completed` |
| `cancel` | `draft`, `receiving` | `cancelled` | Manager | Not posted | `purchase.receipt.cancelled` |

### Inventory Integration on `post`

```text
purchase.receipt.posted
     ↓
Inventory Stock In (§1):
  movement_type: purchase_receipt
  qty_on_hand:   +N
  qty_incoming:  −N
  batch_id / serial_ids: from receipt lines
     ↓
Event: inventory.stock_in.posted
     ↓
PO: quantity_received += N
PO state: partially_received | received
Catalog: cost_price hint (async)
```

### Approval Rules

| Condition | Approver | Permission |
|-----------|----------|------------|
| Over-receipt > tolerance vs PO | Warehouse manager | `purchase.receipt.approve_over` |
| QC fail → quarantine (not cancel) | QC lead | `purchase.receipt.qc_quarantine` |
| Receipt without PO link | Procurement manager | `purchase.receipt.approve_no_po` |
| Batch short expiry | Compliance | `purchase.receipt.approve_short_expiry` |
| Value > receipt threshold | Finance (optional) | `purchase.receipt.approve_value` |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `start_receive` | `purchase:receipt:{id}` | PO ref, warehouse |
| `pass_qc` / `fail_qc` | `purchase:receipt:{id}` | QC notes, photos |
| `post` | `purchase:receipt:{id}` | `movement` link; line qty, batch |
| `post` | `inventory:item:{id}` | Stock change via Inventory |
| `complete` | `purchase:order:{id}` | Running received total |
| `cancel` | `purchase:receipt:{id}` | Reason |

### AI Recommendations

| Trigger | Capability | Output |
|---------|------------|--------|
| PO expected date passed | Lead time prediction | "Chase vendor — 3 days late" |
| Receipt qty vs PO | Three-way match assist | Pre-flag bill variance |
| Batch on receipt | Expiry risk | FEFO slot recommendation |
| Repeated over-receipt | Price anomaly | Vendor weight/pack size investigation |
| QC fail rate by vendor | Vendor performance | Vendor rating downgrade suggestion |

### Workflow Diagram

```text
  PO-8821 ORDERED — open Receive
        │
        ▼
  Create Receipt GR-2026-0312 (DRAFT)
  WH-DHK, PO line SKU-X × 300
        │
        ▼
  start_receive → RECEIVING
  Scan batch LOT-2026-0412, serials (if tracked)
        │
        ├── qc_required? ──yes──▶ QC_PENDING ──pass──┐
        │                           │ fail           │
        │                           └──▶ Return §5   │
        │                                              │
        ▼                                              ▼
  post (+300 qty) → POSTED
  Inventory: purchase_receipt movement
  PO: quantity_received 300/500 → PARTIALLY_RECEIVED
        │
        ▼
  complete → COMPLETED
  Event: purchase.receipt.completed
  Ready for Vendor Bill §4
```

---

## 4. Vendor Bill Workflow

**Workflow ID:** `purchase.bill`  
**Primary tables:** `purchase_vendor_bills`, `purchase_vendor_bill_items`  
**Route:** `/purchase/bills` · `/purchase/bills/[id]`

### Purpose

Capture vendor invoices, perform **three-way match** (PO · Receipt · Bill), and hand off to Accounting AP.

### Trigger

| Source | Action |
|--------|--------|
| **Manual entry** | AP clerk enters vendor invoice |
| **Email/OCR ingest** | Vendor PDF parsed (future) |
| **Receipt complete** | Auto-draft bill from receipt (policy) |
| **PO send** | Proforma / prepayment bill (future) |
| **Contract billing** | Periodic contract invoice |

### States

```text
┌─────────┐     ┌────────────┐     ┌───────────┐     ┌──────────┐     ┌─────────┐     ┌─────────┐
│  DRAFT  │────▶│ UNMATCHED  │────▶│  MATCHED  │────▶│ APPROVED │────▶│  POSTED │────▶│   PAID  │
└─────────┘     └────────────┘     └───────────┘     └──────────┘     └─────────┘     └─────────┘
       │               │                  │                │
       │               ▼                  ▼                ▼
       │        ┌─────────────┐      ┌─────────────┐   ┌─────────────┐
       └───────▶│  CANCELLED  │      │  EXCEPTION  │   │  CANCELLED  │
                └─────────────┘      └─────────────┘   └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Draft | `draft` | Bill entered; lines editable |
| Unmatched | `unmatched` | No PO/receipt link or variance pending |
| Matched | `matched` | PO + receipt + bill align within tolerance |
| Exception | `exception` | Variance exceeds tolerance; needs approval |
| Approved | `approved` | Match exception approved or clean match signed off |
| Posted | `posted` | Accounting AP journal created |
| Paid | `paid` | Finance payment recorded |
| Cancelled | `cancelled` | Voided before post |

### Match Status (parallel dimension)

| Match Status | Description |
|--------------|-------------|
| `unmatched` | Bill entered, no PO link |
| `partial_match` | Qty or price variance within review |
| `matched` | PO + receipt + bill align |
| `exception` | Requires approval |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `submit` | `draft` | `unmatched` | AP clerk | Vendor, bill number | `purchase.bill.submitted` |
| `link_po` | `unmatched` | `unmatched` | Clerk | PO/receipt FK set | `purchase.bill.linked` |
| `auto_match` | `unmatched` | `matched` | System | Within tolerance | `purchase.bill.matched` |
| `flag_exception` | `unmatched` | `exception` | System | Variance > tolerance | `purchase.bill.exception` |
| `approve_match` | `exception`, `matched` | `approved` | Finance approver | SoD: not receiver | `purchase.bill.approved` |
| `post` | `approved` | `posted` | Finance | Accounting entry | `purchase.bill.posted` |
| `mark_paid` | `posted` | `paid` | Finance | Payment recorded | `purchase.bill.paid` |
| `cancel` | `draft`, `unmatched`, `exception` | `cancelled` | Manager | Not posted | `purchase.bill.cancelled` |

### Three-Way Match Logic

```text
For each bill line linked to PO item + receipt:
  match_qty   = bill_qty  vs  receipt_qty  vs  po_qty
  match_price = bill_price vs  po_price
  match_total = bill_line_total vs (receipt_qty × po_price)

Within tolerance (default 2%):
  → auto_match → MATCHED

Outside tolerance:
  → flag_exception → EXCEPTION → approve_match → APPROVED
```

### Finance Handoff on `post`

```text
purchase.bill.posted
     ↓
Accounting: AP journal (DR Expense/Inventory, CR AP)
     ↓
PO: quantity_billed updated
     ↓
Event: accounting.bill.posted (Finance consumer)
```

Purchase does **not** post GL — prepares document and emits event.

### Approval Rules

| Condition | Approver | Permission |
|-----------|----------|------------|
| Match exception (price) | Finance approver | `purchase.bill.approve` |
| Match exception (qty) | Procurement + finance | `purchase.bill.approve_qty` |
| Bill without receipt | Finance controller | `purchase.bill.approve_no_receipt` |
| Bill value > threshold | Dual approval | `purchase.bill.approve_l2` |
| Receiver = bill approver (SoD) | Blocked or override | `purchase.bill.approve_sod_override` |
| Prepayment / proforma | Finance | `purchase.bill.approve_prepay` |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `submit` | `purchase:bill:{id}` | Vendor invoice #, amount |
| `auto_match` | `purchase:bill:{id}` | `match_change`, PO/receipt refs |
| `flag_exception` | `purchase:bill:{id}` | Variance detail table |
| `approve_match` | `purchase:bill:{id}` | `approval_change` |
| `post` | `purchase:bill:{id}` | Accounting entry ID |
| `mark_paid` | `purchase:bill:{id}` | Payment ref |

### AI Recommendations

| Trigger | Capability | Output |
|---------|------------|--------|
| Bill PDF upload | Three-way match assist | Match confidence score, line mapping |
| Price variance | Price anomaly detection | "Bill 5% above PO — approve?" |
| Duplicate bill number | Anomaly | Flag potential duplicate invoice |
| Vendor payment pattern | Lead time prediction | Optimal payment date (cash flow) |
| Unmatched open receipts | Spend optimization | "Bill pending for GR-0312" |

### Workflow Diagram

```text
  Vendor invoice #INV-8842 received (PDF)
        │
        ▼
  Create Bill BILL-2026-0088 (DRAFT)
  Vendor: Global Parts, ৳11,700
        │
        ▼
  Link PO-8821 + GR-0312 → auto_match
  PO qty 300 × ৳39 = ৳11,700 ✓
        │
        ▼
  MATCHED → approve_match → APPROVED
        │
        ▼
  post → POSTED
  Accounting AP entry created
  PO quantity_billed += 300
        │
        ▼
  Finance payment → PAID
  Event: purchase.bill.paid
```

---

## 5. Return Workflow

**Workflow ID:** `purchase.return`  
**Primary tables:** `purchase_returns`, `purchase_return_items`  
**Route:** `/purchase/returns` · `/purchase/returns/[id]`

### Purpose

Return defective or excess goods to vendor — reverse receipt, reduce stock, and obtain vendor credit.

### Trigger

| Source | Action |
|--------|--------|
| **QC fail on receipt** | `purchase.receipt.qc_failed` |
| **Manual RMA** | Buyer creates at `/purchase/returns/create` |
| **Over-shipment** | Warehouse identifies excess |
| **Warranty claim** | Defective batch/serial |
| **Bill dispute** | Price/qty correction via return + credit |

### States

```text
┌─────────────┐     ┌──────────┐     ┌─────────┐     ┌──────────────────┐     ┌───────────┐
│  REQUESTED  │────▶│ APPROVED │────▶│ SHIPPED │────▶│ VENDOR_RECEIVED  │────▶│  CREDITED │
└─────────────┘     └──────────┘     └─────────┘     └──────────────────┘     └───────────┘
       │                  │
       ▼                  ▼
┌─────────────┐    ┌─────────────┐
│  REJECTED   │    │  CANCELLED  │
└─────────────┘    └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Requested | `requested` | Return initiated; lines and reason |
| Approved | `approved` | Manager approved credit return |
| Shipped | `shipped` | Goods sent to vendor; stock deducted |
| Vendor Received | `vendor_received` | Vendor confirmed receipt |
| Credited | `credited` | Vendor credit note / debit memo posted |
| Rejected | `rejected` | Return denied |
| Cancelled | `cancelled` | Voided before ship |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `request` | — | `requested` | Buyer / warehouse | Linked PO/receipt | `purchase.return.requested` |
| `approve` | `requested` | `approved` | Procurement manager | Value threshold | `purchase.return.approved` |
| `reject` | `requested` | `rejected` | Manager | Reason required | `purchase.return.rejected` |
| `ship` | `approved` | `shipped` | Warehouse | Batch/serial captured | `purchase.return.shipped` |
| `vendor_confirm` | `shipped` | `vendor_received` | Buyer / vendor portal | Vendor ack | `purchase.return.vendor_received` |
| `credit` | `vendor_received` | `credited` | Finance | Credit note posted | `purchase.return.credited` |
| `cancel` | `requested`, `approved` | `cancelled` | Buyer | Not shipped | `purchase.return.cancelled` |

### Module Impact by Transition

| Transition | Purchase | Inventory | Finance |
|------------|----------|-----------|---------|
| `approve` | PO `quantity_returned` planned | — | — |
| `ship` | Return qty recorded | Stock Out movement (−qty) | — |
| `credit` | Link to vendor bill credit | — | AP credit / debit note |

### Inventory Integration on `ship`

```text
purchase.return.shipped
     ↓
Inventory Stock Out:
  movement_type: purchase_return
  qty_on_hand: −N
  batch_id / serial_ids: returned units
     ↓
Event: inventory.stock_out.shipped
```

### Reason Codes

| Code | Use Case |
|------|----------|
| `defective` | Quality failure |
| `wrong_item` | Vendor shipped incorrect SKU |
| `over_shipment` | Excess qty vs PO |
| `warranty` | Failed within warranty |
| `expired` | Batch past expiry at receipt |
| `damaged_in_transit` | Carrier damage |

### Approval Rules

| Condition | Approver | Permission |
|-----------|----------|------------|
| Return value > threshold | Procurement manager | `purchase.return.approve` |
| Return without receipt | Finance + procurement | `purchase.return.approve_no_receipt` |
| Return after bill posted | Finance controller | `purchase.return.approve_post_bill` |
| Regulated batch return | Compliance | `purchase.return.approve_batch` |
| Vendor credit < return value | Finance | `purchase.return.approve_partial_credit` |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `request` | `purchase:return:{id}` | Reason, PO/receipt link |
| `approve` / `reject` | `purchase:return:{id}` | `approval_change` |
| `ship` | `purchase:return:{id}` | Carrier, tracking |
| `ship` | `inventory:item:{id}` | Stock out movement |
| `credit` | `purchase:bill:{id}` | Credit note link |

### AI Recommendations

| Trigger | Capability | Output |
|---------|------------|--------|
| QC fail pattern | Vendor performance | Return rate by vendor/SKU |
| Return vs receipt qty | Three-way match assist | Expected credit amount |
| Defective batch | Price anomaly | Warranty claim vs return decision |
| Open returns aging | Lead time prediction | Chase vendor for credit |

### Workflow Diagram

```text
  Receipt GR-0312 QC fail — 20 units defective (batch LOT-0412)
        │
        ▼
  Create Return PR-2026-0044 (REQUESTED)
  reason: defective, link GR-0312 / PO-8821
        │
        ▼
  approve → APPROVED
        │
        ▼
  ship → SHIPPED
  Inventory: purchase_return −20
  Carrier: Pathao pickup scheduled
        │
        ▼
  vendor_confirm → VENDOR_RECEIVED
        │
        ▼
  credit → CREDITED
  Vendor credit note CN-9921 → AP reduced
  Event: purchase.return.credited
```

---

## 6. Approval Rules

Central reference for all Purchase workflow approvals. Integrates [Approval Engine](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) and [Workflow Engine](../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md).

### Approval Matrix

| Document | Trigger State | Condition | Approver Level | Permission |
|----------|---------------|-----------|----------------|------------|
| **RFQ Award** | `quotation` → `approved` | Award value > threshold | Procurement manager | `purchase.rfq.award` |
| **RFQ Award** | Non-preferred vendor | Any value | Category manager | `purchase.rfq.award_override` |
| **PO Submit** | `draft` → `pending_approval` | Value ≤ L1 (e.g. ৳50,000) | L1 manager or auto | `purchase.order.approve` |
| **PO Submit** | `draft` → `pending_approval` | L1 < value ≤ L2 (e.g. ৳200,000) | L1 + L2 dual | `purchase.order.approve_l2` |
| **PO Submit** | `draft` → `pending_approval` | Value > L2 | Finance controller | `purchase.order.approve_finance` |
| **PO Submit** | Capex category | Any value | Dual + finance | `purchase.order.approve_capex` |
| **PO Amend** | After `ordered` | Value increase | Re-approval chain | `purchase.order.approve` |
| **Receipt Post** | `receiving` → `posted` | Over-receipt > tolerance | Warehouse manager | `purchase.receipt.approve_over` |
| **Receipt Post** | QC quarantine | Not cancel | QC lead | `purchase.receipt.qc_quarantine` |
| **Bill Match** | `exception` → `approved` | Price/qty variance | Finance approver | `purchase.bill.approve` |
| **Bill Post** | `approved` → `posted` | Value > threshold | Finance L2 | `purchase.bill.approve_l2` |
| **Bill Post** | No receipt link | Any | Finance controller | `purchase.bill.approve_no_receipt` |
| **Return Ship** | `requested` → `approved` | Credit value > threshold | Procurement manager | `purchase.return.approve` |
| **Contract Activate** | `draft` → `active` | Commitment value | Legal + procurement | `purchase.contract.approve` |

### Separation of Duties (SoD)

| Rule | Enforcement |
|------|-------------|
| Buyer cannot approve own PO above L1 limit | System guard on `purchase.order.approve` |
| Receiver cannot approve bill for same PO they posted | Configurable block; override requires `purchase.bill.approve_sod_override` |
| RFQ creator cannot approve own award | System guard on `purchase.rfq.award` |
| Dual approval for capex | Two distinct approvers from L1 + finance pools |
| Bill post requires different user than receipt post | Policy `purchase.bill.sod_receipt_approver` |

### Multi-Level Approval Flow (PO Example)

```text
PO Submit (Buyer A, ৳85,000)
        │
        ▼
  ┌─────────────────┐
  │  L1 Manager     │  ≤ ৳50,000 auto-skip if policy allows
  │  (Procurement)  │  ৳50,001–৳200,000: REQUIRED
  └────────┬────────┘
           │ approved
           ▼
  ┌─────────────────┐
  │  L2 Finance     │  > ৳50,000: REQUIRED
  │  (Controller)   │
  └────────┬────────┘
           │ approved
           ▼
       APPROVED → send → ORDERED
```

### Policy Configuration (`/purchase/settings`)

| Group | Key | Description |
|-------|-----|-------------|
| Approval | `po.approval_threshold_l1` | L1 auto-approve limit |
| Approval | `po.approval_threshold_l2` | L2 required above |
| Approval | `po.dual_approval_categories` | Category IDs requiring dual |
| Approval | `rfq.award_approval_threshold` | RFQ award approval |
| Receipt | `over_receipt_tolerance_pct` | % over PO qty allowed |
| Billing | `match_tolerance_pct` | Three-way match % |
| Billing | `bill.approval_threshold` | Bill post approval |
| Return | `return.approval_threshold` | Return credit approval |

All approval steps write to Activity `approval_change` and `purchase_order_status_history` (for PO).

---

## 7. AI Recommendations

**Agent:** Purchase Agent · **Governance:** [PURCHASE_MODULE_ARCHITECTURE.md §16](./PURCHASE_MODULE_ARCHITECTURE.md)

### Principles

| # | Rule |
|---|------|
| 1 | Suggestions enter **review queue** — no auto-PO without explicit policy |
| 2 | All agent runs logged in Activity `AI Actions` tab |
| 3 | Vendor selection on RFQ requires **human award** |
| 4 | Bill match AI **assists** — Finance approves post |
| 5 | Receipt/stock impact requires human confirm |

### Capabilities by Workflow

| Workflow | AI Capability | Input | Output | Apply Action |
|----------|---------------|-------|--------|--------------|
| **RFQ** | Vendor recommendation | Item, history, lead time | Ranked vendor list | Pre-fill RFQ vendors |
| **RFQ** | RFQ line fill | Specs, vendor catalogs | Suggested lines | Add to RFQ draft |
| **RFQ** | Price anomaly detection | Quotes vs contract/history | Outlier flags | Highlight in comparison grid |
| **PO** | Reorder suggestion | min_qty, velocity | Draft PO lines | Create PO draft |
| **PO** | Lead time prediction | Vendor performance | `expected_date` | Update PO header |
| **PO** | Spend optimization | Category spend | Vendor consolidate | Suggest single-vendor PO |
| **Receipt** | Three-way match assist | PO, receipt, bill PDF | Match confidence | Pre-link bill lines |
| **Receipt** | Expiry risk | Batch on receipt | FEFO slot | Warehouse put-away hint |
| **Bill** | Three-way match assist | OCR/PDF | Line mapping score | Auto-match draft |
| **Bill** | Duplicate detection | Bill number history | Duplicate flag | Block submit |
| **Return** | Vendor performance | QC fail rate | Return likelihood | Proactive RMA draft |
| **Contract** | Contract renewal alert | End date, spend | Renewal draft | Notify buyer |

### AI Action Lifecycle

```text
Trigger (event, schedule, or user ask)
        │
        ▼
Purchase Agent (context: PO, vendor, inventory, contracts)
        │
        ▼
Suggestion Queue (/purchase dashboard widget)
        │
        ├── Review → Dismiss (logged: ai_action dismissed)
        │
        └── Apply → Human confirm
                │
                ├── Draft document created (PO, RFQ, bill link)
                └── Activity: ai_action applied
```

### Data Context

```text
purchase_orders + purchase_vendor_profiles
     +
inventory_stock_levels + inventory_reorder_rules
     +
Product Master (variant, cost)
     +
purchase_contracts + purchase_rfq_responses
     ↓
AI Context Engine → Purchase Agent
```

**Prototype:** [ui-prototype/inventory/PurchaseSuggestions.md](../../04-uiux/prototype/inventory/PurchaseSuggestions.md)

---

## 8. Activity Tracking

Integrates [Activity & Chatter Architecture](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md). Every Purchase workflow transition produces an auditable Activity record.

### Entity Types

| Entity | Activity ID Pattern | Primary Workflows |
|--------|---------------------|-------------------|
| Vendor | `purchase:vendor:{contact_id}` | All (context) |
| RFQ | `purchase:rfq:{id}` | §1 |
| Quotation | `purchase:quotation:{id}` | §1 |
| Purchase Order | `purchase:order:{id}` | §2 |
| Receipt | `purchase:receipt:{id}` | §3 |
| Vendor Bill | `purchase:bill:{id}` | §4 |
| Return | `purchase:return:{id}` | §5 |
| Contract | `purchase:contract:{id}` | Related (future) |

### Event → Activity Type Mapping

| Workflow Event | Activity Type | Entity | Payload |
|----------------|---------------|--------|---------|
| `purchase.rfq.sent` | `status_change` | `purchase:rfq:{id}` | Vendors, deadline |
| `purchase.rfq.response_received` | `update` | `purchase:quotation:{id}` | Vendor, amount |
| `purchase.rfq.award_approved` | `approval_change` | `purchase:rfq:{id}` | Winning vendor |
| `purchase.order.submitted` | `status_change` | `purchase:order:{id}` | Approver chain |
| `purchase.order.approved` | `approval_change` | `purchase:order:{id}` | Approver, level |
| `purchase.order.rejected` | `approval_change` | `purchase:order:{id}` | Reason |
| `purchase.order.sent` | `status_change` | `purchase:order:{id}` | Sent method |
| `purchase.order.partially_received` | `status_change` | `purchase:order:{id}` | Qty received |
| `purchase.receipt.posted` | `movement` | `purchase:receipt:{id}` | Inventory movement ref |
| `purchase.receipt.posted` | `stock_change` | `inventory:item:{id}` | +qty (cross-entity) |
| `purchase.bill.matched` | `match_change` | `purchase:bill:{id}` | Match score |
| `purchase.bill.approved` | `approval_change` | `purchase:bill:{id}` | Exception reason |
| `purchase.bill.posted` | `status_change` | `purchase:bill:{id}` | Accounting entry ID |
| `purchase.return.approved` | `approval_change` | `purchase:return:{id}` | Credit value |
| `purchase.return.shipped` | `movement` | `purchase:return:{id}` | Stock out ref |
| AI suggestion applied | `ai_action` | Source entity | Agent, prompt version |

### UI Patterns

| Surface | Activity UX |
|---------|-------------|
| **List pages** | Activity icon column → Global Activity Drawer |
| **PO detail** | Activity tab + approval comments inline |
| **RFQ comparison** | Quotation updates in timeline |
| **Receipt detail** | Movement link to Inventory activity |
| **Bill detail** | Match exception thread in chatter |
| **Vendor detail** | Aggregated spend, PO, return events |

### Cross-Module Activity Links

```text
purchase:receipt:{id}
     └── links to → inventory:item:{id} (stock_change)
     └── links to → purchase:order:{id} (status_change)

purchase:bill:{id}
     └── links to → purchase:receipt:{id} (match_change)
     └── links to → accounting:entry:{id} (future, on post)

purchase:return:{id}
     └── links to → purchase:receipt:{id} (origin)
     └── links to → inventory:item:{id} (stock out)
```

### Audit Requirements

| Requirement | Implementation |
|-------------|----------------|
| Immutable history | Activity append-only; no delete |
| Approver identity | User ID + timestamp on `approval_change` |
| Attachment trail | RFQ quotes, PO PDF, bill PDF via Core attachments |
| Status history | `purchase_order_status_history` for PO state machine |
| AI reproducibility | Prompt version on `ai_action` records |

---

## Cross-Workflow Integration Map

```text
                    ┌─────────────────────────────────────┐
                    │           RFQ WORKFLOW (§1)          │
                    │  draft → sent → quotation → approved │
                    └───────────────────┬─────────────────┘
                                        │ create_po
                                        ▼
                    ┌─────────────────────────────────────┐
                    │      PURCHASE ORDER WORKFLOW (§2)      │
                    │  draft → pending → approved → ordered  │
                    └───────────────────┬─────────────────┘
                                        │ receive
                                        ▼
                    ┌─────────────────────────────────────┐
                    │       RECEIVING WORKFLOW (§3)          │
                    │  draft → receiving → posted → complete │
                    └───────────────────┬─────────────────┘
                                        │ inventory.stock_in
                                        ▼
                    ┌─────────────────────────────────────┐
                    │         INVENTORY STOCK IN             │
                    │    [INVENTORY_WORKFLOW.md §1]          │
                    └───────────────────┬─────────────────┘
                                        │ bill
                                        ▼
                    ┌─────────────────────────────────────┐
                    │      VENDOR BILL WORKFLOW (§4)         │
                    │  draft → matched → approved → posted   │
                    └───────────────────┬─────────────────┘
                                        │ accounting AP
                                        ▼
                              Finance Payment
                                        │
                    ┌───────────────────┴─────────────────┐
                    │         RETURN WORKFLOW (§5)           │
                    │  requested → approved → shipped → credit│
                    └───────────────────┬─────────────────┘
                                        │ inventory.stock_out
                                        ▼
                    ┌─────────────────────────────────────┐
                    │         INVENTORY STOCK OUT            │
                    │    [INVENTORY_WORKFLOW.md §2]          │
                    └─────────────────────────────────────┘
```

### Domain Event Chain (Full P2P)

```text
purchase.rfq.sent
purchase.rfq.award_approved
purchase.rfq.po_created
     ↓
purchase.order.submitted
purchase.order.approved
purchase.order.sent
     ↓
purchase.receipt.posted
inventory.stock_in.posted
     ↓
purchase.bill.matched
purchase.bill.posted
accounting.bill.posted (Finance)
     ↓
purchase.bill.paid
     ↓
(purchase.return.shipped → inventory.stock_out.shipped → purchase.return.credited)
```

---

## Workflow Engine Registration

All workflows register with Core [WORKFLOW_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md):

```yaml
# Example: purchase.order
model: purchase_orders
workflow_id: purchase.order
states:
  - draft
  - pending_approval
  - approved
  - ordered
  - partially_received
  - received
  - closed
  - rejected
  - cancelled
transitions:
  - name: submit
    from: draft
    to: pending_approval
    permission: purchase.order.create
  - name: approve_l1
    from: pending_approval
    to: approved
    permission: purchase.order.approve
    approval_policy: purchase.po.approval_threshold_l1
  - name: send
    from: approved
    to: ordered
    permission: purchase.order.create
    event: purchase.order.sent
  - name: receive_partial
    from: [ordered, partially_received]
    to: partially_received
    permission: purchase.receipt.create
    event: purchase.order.partially_received
```

Full registry: [WORKFLOW_REGISTRY.md](../../00-foundation/registries/WORKFLOW_REGISTRY.md)

---

## Permissions Summary

| Workflow | Key Permissions |
|----------|-----------------|
| RFQ | `purchase.rfq.create`, `purchase.rfq.award`, `purchase.rfq.cancel` |
| PO | `purchase.order.create`, `purchase.order.approve`, `purchase.order.approve_l2`, `purchase.order.cancel` |
| Receipt | `purchase.receipt.create`, `purchase.receipt.approve_over` |
| Bill | `purchase.bill.create`, `purchase.bill.approve`, `purchase.bill.approve_l2` |
| Return | `purchase.return.create`, `purchase.return.approve` |
| AI | `purchase.ai.apply` |

Full list: [PURCHASE_MODULE_ARCHITECTURE.md §17](./PURCHASE_MODULE_ARCHITECTURE.md)

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| [PURCHASE_MODULE_ARCHITECTURE.md](./PURCHASE_MODULE_ARCHITECTURE.md) | Module architecture (parent) |
| [INVENTORY_WORKFLOW.md](../inventory/INVENTORY_WORKFLOW.md) | Stock In/Out handoff |
| [SALES_MODULE_ARCHITECTURE.md](../sales/SALES_MODULE_ARCHITECTURE.md) | Drop-ship (future) |
| [PRODUCT_MASTER_ARCHITECTURE.md](../../02-core-platform/subsystems/PRODUCT_MASTER_ARCHITECTURE.md) | PO line product refs |
| [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) | Activity platform |
| [core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md) | State machine engine |
| [core/engines/APPROVAL_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) | Approval policies |
| [WORKFLOW_REGISTRY.md](../../00-foundation/registries/WORKFLOW_REGISTRY.md) | Platform workflow index |

---

## Document Control

| Field | Value |
|-------|-------|
| **Owner** | Platform Team · Purchase Domain |
| **Reviewers** | Architecture, Procurement, Finance, Warehouse |
| **Next Review** | At workflow engine implementation gate |
| **Status Gate** | Documentation First — Ready for UI/UX Planning |

**Changelog:** [CHANGELOG.md](../../00-foundation/CHANGELOG.md)
