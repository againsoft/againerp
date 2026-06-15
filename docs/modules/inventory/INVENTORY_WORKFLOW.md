# AgainERP — Inventory Workflows

> **Status:** Approved  
> **Version:** 1.0  
> **Module:** Inventory  
> **Document Type:** Workflow Specification  
> **Phase:** Documentation First  
> **Route Namespace:** `/inventory/*`  
> **Governance:** [GOVERNANCE.md](../../GOVERNANCE.md) · **Engine:** [core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md](../../core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md)

**No backend code. No database implementation. No API implementation.**  
This document defines **all Inventory state machines** — triggers, transitions, approvals, activity logs, and AI actions.

### Step 05 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Stock In Workflow | §1 |
| Stock Out Workflow | §2 |
| Transfer Workflow | §3 |
| Adjustment Workflow | §4 |
| Reservation Workflow | §5 |
| Batch Workflow | §6 |
| Serial Workflow | §7 |
| Cycle Count Workflow | §8 |

Each workflow includes: **Trigger · States · Transitions · Approval Rules · Activity Logs · AI Actions · Text diagrams**

**Related:** [INVENTORY_MODULE_ARCHITECTURE.md](./INVENTORY_MODULE_ARCHITECTURE.md) · [PURCHASE_WORKFLOW.md](../purchase/PURCHASE_WORKFLOW.md) · [SALES_WORKFLOW.md](../sales/SALES_WORKFLOW.md) · [PURCHASE_MODULE_ARCHITECTURE.md](../purchase/PURCHASE_MODULE_ARCHITECTURE.md) · [SALES_MODULE_ARCHITECTURE.md](../sales/SALES_MODULE_ARCHITECTURE.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../core/ACTIVITY_CHATTER_ARCHITECTURE.md) · [WORKFLOW_REGISTRY.md](../../WORKFLOW_REGISTRY.md)

---

## Executive Summary

Inventory workflows govern **every quantity change** in AgainERP. All workflows share common patterns:

| Pattern | Rule |
|---------|------|
| **Single ledger** | Every state change that affects qty posts to `inventory_movements` |
| **Core Workflow Engine** | State machines registered in [WORKFLOW_ENGINE_ARCHITECTURE.md](../../core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md) |
| **Event-driven** | Transitions emit `inventory.*` domain events |
| **Activity everywhere** | Every transition logged in Activity drawer |
| **AI assist, not auto-post** | Agent suggests; human or policy approves stock impact |
| **Purchase/Sales orchestrate** | Stock In/Out often triggered by sibling modules |

### Workflow Registry IDs

| ID | Entity | Primary Doc Section |
|----|--------|---------------------|
| `inventory.stock_in` | `inventory_movements` (inbound) | §1 |
| `inventory.stock_out` | `inventory_movements` (outbound) | §2 |
| `inventory.transfer` | `inventory_transfers` | §3 |
| `inventory.adjustment` | `inventory_adjustments` | §4 |
| `inventory.reservation` | `inventory_reservations` | §5 |
| `inventory.batch` | `inventory_batches` | §6 |
| `inventory.serial` | `inventory_serials` | §7 |
| `inventory.cycle_count` | `inventory_cycle_counts` | §8 |

---

## Shared Concepts

### Quantity Impact Matrix

| Workflow | `qty_on_hand` | `qty_reserved` | `qty_quarantined` | `qty_incoming` |
|----------|:-------------:|:----------------:|:-----------------:|:--------------:|
| Stock In | + | — | ± (QC) | − (if was incoming) |
| Stock Out | − | − (release) | ± | — |
| Transfer | ± (src/dst) | — | — | ± (in-transit) |
| Adjustment | ± | — | ± | — |
| Reservation | — | + / − | — | — |
| Batch recall | — | block | + | — |
| Serial status | via movement | via reservation | — | — |
| Cycle Count | via adjustment | — | — | — |

### Common Activity Types

| Activity Type | When Used |
|---------------|-----------|
| `movement` | Movement ledger row posted |
| `stock_change` | Stock level field updated |
| `status_change` | Document state transition |
| `approval_change` | Approval granted/rejected |
| `reservation` | Hold created/released/fulfilled |
| `ai_action` | Agent suggestion applied or dismissed |
| `update` | Metadata change (batch, serial, count line) |

### Common Approval Hooks

| Policy Key | Default | Applies To |
|------------|---------|------------|
| `inventory.adjustment.approval_threshold` | Value-based | Adjustments, write-offs |
| `inventory.transfer.require_approval` | false | Inter-warehouse transfers |
| `inventory.receipt.over_receipt_tolerance` | 0% | Stock In from PO |
| `inventory.receipt.qc_required` | false | Stock In (batch/serial items) |
| `inventory.batch.recall_approval` | always | Batch recall |
| `inventory.cycle_count.variance_threshold` | 2% or value | Auto-adjustment |

---

## 1. Stock In Workflow

**Workflow ID:** `inventory.stock_in`  
**Primary table:** `inventory_movements` (`movement_type` = inbound)  
**Routes:** `/inventory/stock` · `/purchase/receipts/[id]` (orchestration)

### Purpose

Increase `qty_on_hand` when goods enter the business — purchase, manufacturing, returns, transfers, or corrections.

### Trigger

| Source | Event / Action | Reference |
|--------|----------------|-----------|
| **Purchase receipt** | `purchase.receipt.completed` | `purchase_receipts` |
| **Manufacturing output** | `manufacturing.output.completed` | Work order (future) |
| **Customer return** | `sales.return.received` | `sales_returns` |
| **Transfer receive** | `inventory.transfer.received` | `inventory_transfers` |
| **Adjustment (found/opening)** | `inventory.adjustment.posted` | `inventory_adjustments` |
| **Initial onboarding** | Manual opening balance | Migration / setup |
| **POS return** | `pos.return.completed` | POS receipt (future) |

### States

```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   EXPECTED  │────▶│  QC_PENDING │────▶│   RECEIVING │────▶│   RECEIVED  │────▶│   POSTED    │
│  (incoming) │     │  (optional) │     │  (in progress)│   │  (confirmed)│     │  (ledger)   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       └───────────────────┴───────────────────┴───────────────────┘
                                    │
                                    ▼
                            ┌─────────────┐
                            │  CANCELLED  │
                            └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Expected | `expected` | PO line qty in `qty_incoming`; not yet physically received |
| QC Pending | `qc_pending` | Goods arrived; batch/serial QC hold before posting |
| Receiving | `receiving` | Warehouse actively scanning/counting |
| Received | `received` | Quantities confirmed; awaiting ledger post |
| Posted | `posted` | Movement written; `qty_on_hand` increased |
| Cancelled | `cancelled` | Receipt voided before post |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `expect` | — | `expected` | Purchase / system | PO confirmed | `inventory.stock_in.expected` |
| `start_qc` | `expected`, `receiving` | `qc_pending` | Warehouse | `track_batch` or `qc_required` | `inventory.stock_in.qc_started` |
| `start_receive` | `expected` | `receiving` | Warehouse clerk | Receipt open | `inventory.stock_in.receiving` |
| `pass_qc` | `qc_pending` | `receiving` | QC inspector | QC pass | `inventory.stock_in.qc_passed` |
| `fail_qc` | `qc_pending` | `cancelled` | QC inspector | QC fail → quarantine or return | `inventory.stock_in.qc_failed` |
| `confirm_receive` | `receiving`, `qc_pending` | `received` | Warehouse clerk | Qty > 0, batch/serial captured | `inventory.stock_in.received` |
| `post` | `received` | `posted` | System / clerk | Approval if over-receipt | `inventory.stock_in.posted` |
| `cancel` | `expected`, `receiving`, `qc_pending` | `cancelled` | Manager | Not yet posted | `inventory.stock_in.cancelled` |

### Movement on Post

```text
movement_type: purchase_receipt | return | manufacturing_output | transfer_in | adjustment | initial
quantity:      +N
qty_on_hand:   +N
qty_incoming:  −N (if was expected from PO)
batch_id:      assigned or created
serial_ids[]:  registered (if serial-tracked)
unit_cost:     from PO / layer / standard
```

### Approval Rules

| Condition | Approver | Permission |
|-----------|----------|------------|
| Over-receipt > tolerance vs PO | Warehouse manager | `inventory.receipt.approve_over` |
| QC fail → quarantine (not cancel) | QC lead | `inventory.batch.quarantine` |
| Receipt value > threshold | Finance (optional) | `inventory.receipt.approve_value` |
| Batch with expiry < min shelf life | QC / compliance | `inventory.batch.approve_short_expiry` |
| Opening balance (initial load) | Inventory manager | `inventory.adjustment.approve` |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `expect` | `inventory:item:{id}` | "Expected +N from PO {ref}" |
| `start_receive` | `purchase:receipt:{id}` | "Receiving started" |
| `pass_qc` / `fail_qc` | `inventory:batch:{id}` | QC result, photos attachment |
| `confirm_receive` | `purchase:receipt:{id}` | Line qty, batch, serial list |
| `post` | `inventory:item:{id}` | `movement` + `stock_change` (+N) |
| `cancel` | `purchase:receipt:{id}` | Reason code, approver |

### AI Actions

| Trigger | Agent Capability | Output |
|---------|-------------------|--------|
| PO receipt due | Demand forecast | "Receive full qty vs partial — slow mover" |
| Batch expiry on receipt | Expiry risk | Flag short-dated lot; suggest FEFO slot |
| Over-receipt pattern | Shrinkage anomaly | Investigate vendor weight variance |
| Receive without PO match | Anomaly | Flag potential mis-shipment |
| Cost variance vs last PO | Reorder optimization | Suggest supplier price review |

**Governance:** AI never auto-posts receipt. Suggestions appear in Activity `AI Actions` tab.

### End-to-End Diagram (Purchase Receipt)

```text
Purchase PO confirmed
        │
        ▼
  qty_incoming += N          ◀── EXPECTED
        │
        ▼
  Warehouse opens receipt    ◀── RECEIVING
        │
        ├── QC required? ──yes──▶ QC_PENDING ──pass──┐
        │                           │ fail            │
        │                           ▼                 │
        │                      CANCELLED              │
        │                                             ◀───┘
        ▼
  Scan batch/serial, confirm qty   ◀── RECEIVED
        │
        ├── over-receipt? ──yes──▶ Approval
        │
        ▼
  Post movement (+qty_on_hand)     ◀── POSTED
        │
        ▼
  Event: inventory.stock_in.posted
        │
        ├──▶ Catalog (availability cache)
        ├──▶ Purchase (receipt complete)
        └──▶ Accounting (GRNI future)
```

---

## 2. Stock Out Workflow

**Workflow ID:** `inventory.stock_out`  
**Primary table:** `inventory_movements` (`movement_type` = outbound)  
**Routes:** `/inventory/stock` · `/sales/shipments/[id]` (orchestration)

### Purpose

Decrease `qty_on_hand` when goods leave the business — sales, consumption, transfers, returns to vendor, or write-offs.

### Trigger

| Source | Event / Action | Reference |
|--------|----------------|-----------|
| **Sales shipment** | `sales.shipment.completed` | `sales_shipments` |
| **Ecommerce/POS order** | `commerce.order.shipped` | `commerce_orders` |
| **Manufacturing consume** | `manufacturing.pick.completed` | Work order (future) |
| **Transfer ship** | `inventory.transfer.shipped` | `inventory_transfers` |
| **Purchase return** | `purchase.return.shipped` | `purchase_returns` |
| **Adjustment write-off** | `inventory.adjustment.posted` | `inventory_adjustments` |
| **Batch expiry** | Scheduled job / manual | `inventory_batches` |

### States

```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  REQUESTED  │────▶│  ALLOCATED  │────▶│   PICKING   │────▶│   PICKED    │────▶│   SHIPPED   │
│  (demand)   │     │ (batch/FEFO)│     │  (warehouse)│     │  (confirmed)│     │  (posted)   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       └───────────────────┴───────────────────┴───────────────────┘
                                    │
                                    ▼
                            ┌─────────────┐
                            │  CANCELLED  │
                            └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Requested | `requested` | Outbound demand registered (order, WO, transfer) |
| Allocated | `allocated` | Batch/serial/location assigned (FEFO/FIFO) |
| Picking | `picking` | Picker working pick list |
| Picked | `picked` | Qty confirmed at pack station |
| Shipped | `shipped` | Movement posted; `qty_on_hand` decreased |
| Cancelled | `cancelled` | Outbound cancelled before ship |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `request` | — | `requested` | Sales / Orders / system | Stock available or backorder policy | `inventory.stock_out.requested` |
| `allocate` | `requested` | `allocated` | System | Reservation or FEFO batch pick | `inventory.stock_out.allocated` |
| `start_pick` | `allocated` | `picking` | Warehouse | Pick list generated | `inventory.stock_out.picking` |
| `confirm_pick` | `picking` | `picked` | Picker | Scan match batch/serial | `inventory.stock_out.picked` |
| `ship` | `picked`, `allocated` | `shipped` | Ship confirm | Approval if negative available | `inventory.stock_out.shipped` |
| `cancel` | `requested`, `allocated`, `picking` | `cancelled` | Order mgr / system | Not yet shipped | `inventory.stock_out.cancelled` |
| `short_ship` | `picking` | `shipped` | System | Partial qty; release remainder reservation | `inventory.stock_out.partial` |

### Movement on Ship

```text
movement_type: sale | manufacturing_consume | transfer_out | adjustment | purchase_return
quantity:      −N
qty_on_hand:   −N
qty_reserved:  −N (release linked reservation)
batch_id:      FEFO/FIFO allocated lot
serial_ids[]:  status → sold / consumed
```

### Approval Rules

| Condition | Approver | Permission |
|-----------|----------|------------|
| Ship with insufficient available (backorder override) | Sales manager | `inventory.stock_out.override` |
| Write-off value > threshold | Inventory manager | `inventory.adjustment.approve` |
| Batch recall block override | Compliance officer | `inventory.batch.recall_override` |
| Expired batch ship attempt | System block | — (hard block) |
| High-value serial outbound | Warehouse supervisor | `inventory.serial.approve_ship` |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `request` | `inventory:reservation:{id}` or order entity | "Outbound requested −N" |
| `allocate` | `inventory:batch:{id}` | FEFO lot selected |
| `confirm_pick` | `inventory:serial:{id}` | Serial scanned out |
| `ship` | `inventory:item:{id}` | `movement` + `stock_change` (−N) |
| `cancel` | Order / shipment entity | Reservation released |
| `short_ship` | Shipment entity | Partial qty, reason |

### AI Actions

| Trigger | Agent Capability | Output |
|---------|-------------------|--------|
| Pick list generation | Warehouse balancing | Optimal warehouse for multi-site order |
| FEFO allocation | Expiry risk | Prioritize near-expiry batch |
| Repeated short picks | Shrinkage anomaly | Location accuracy investigation |
| Slow pick path | Cycle count prioritization | Suggest count for problem bin |
| Demand spike on ship | Demand forecast | Flag potential stockout on related SKUs |

### End-to-End Diagram (Sales Shipment)

```text
Sales order confirmed
        │
        ▼
  Reservation created (+qty_reserved)     [see §5]
        │
        ▼
  Shipment requested                        ◀── REQUESTED
        │
        ▼
  FEFO/FIFO batch allocated                 ◀── ALLOCATED
        │
        ▼
  Pick list → warehouse scan                ◀── PICKING → PICKED
        │
        ├── insufficient stock? ──▶ Approval or backorder
        │
        ▼
  Post movement (−qty_on_hand, −qty_reserved)  ◀── SHIPPED
        │
        ▼
  Event: inventory.stock_out.shipped
        │
        ├──▶ Sales (shipment complete)
        ├──▶ Orders (commerce sync)
        └──▶ Serial status → sold
```

---

## 3. Transfer Workflow

**Workflow ID:** `inventory.transfer`  
**Primary table:** `inventory_transfers`  
**Route:** `/inventory/transfers` · `/inventory/transfers/[id]`

### Purpose

Move stock between warehouses or locations while maintaining traceability and in-transit visibility.

### Trigger

| Source | Action |
|--------|--------|
| **Manual transfer** | User creates at `/inventory/transfers/create` |
| **AI suggestion** | Warehouse balancing recommendation |
| **Reorder rule** | Auto-transfer from overflow warehouse (future) |
| **Sales allocation** | Transfer to fulfill from nearest WH (future) |

### States

```text
                    ┌─────────────┐
                    │    DRAFT    │
                    └──────┬──────┘
                           │ submit
                           ▼
                    ┌─────────────┐
              ┌────▶│  APPROVED   │◀──── reject
              │     └──────┬──────┘
              │            │ ship
              │            ▼
              │     ┌─────────────┐
              │     │ IN_TRANSIT  │
              │     └──────┬──────┘
              │            │ receive (partial OK)
              │            ▼
              │     ┌─────────────┐
              │     │  RECEIVED   │
              │     └──────┬──────┘
              │            │ close
              │            ▼
              │     ┌─────────────┐
              │     │  COMPLETED  │
              │     └─────────────┘
              │
              ▼
       ┌─────────────┐
       │  CANCELLED  │
       └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Draft | `draft` | Lines added; source/dest set |
| Approved | `approved` | Manager approved (if policy) |
| In Transit | `in_transit` | Source deducted; stock in transit |
| Received | `received` | Destination confirmed (full or partial) |
| Completed | `completed` | Movements balanced; closed |
| Cancelled | `cancelled` | Voided before ship |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `submit` | `draft` | `approved` | Creator | Auto-approve if below threshold | `inventory.transfer.submitted` |
| `approve` | `draft` | `approved` | Manager | `inventory.transfer.require_approval` | `inventory.transfer.approved` |
| `reject` | `draft` | `cancelled` | Manager | Comment required | `inventory.transfer.rejected` |
| `ship` | `approved` | `in_transit` | Source WH clerk | Source qty available | `inventory.transfer.shipped` |
| `receive` | `in_transit` | `received` | Dest WH clerk | Qty ≤ shipped | `inventory.transfer.received` |
| `complete` | `received` | `completed` | System | All lines balanced | `inventory.transfer.completed` |
| `cancel` | `draft`, `approved` | `cancelled` | Creator / manager | Not in transit | `inventory.transfer.cancelled` |

### Stock Impact by Transition

```text
ship (IN_TRANSIT):
  source:  movement transfer_out, qty_on_hand −N, qty_incoming_at_dest +N (optional transit WH)
  batch/serial: attached to transfer lines

receive (RECEIVED):
  dest:    movement transfer_in, qty_on_hand +N
  transit: qty_incoming −N

complete (COMPLETED):
  reconcile partial: remaining in-transit cleared or backorder transfer line
```

### Approval Rules

| Condition | Approver | Permission |
|-----------|----------|------------|
| Transfer value > threshold | Inventory manager | `inventory.transfer.approve` |
| Cross-branch transfer | Branch manager | `inventory.transfer.approve_cross_branch` |
| Batch/serial transfer (regulated) | Compliance | `inventory.batch.transfer_approve` |
| Transit warehouse not configured | System warn | Require `warehouse_type = transit` |
| Partial receive variance > tolerance | Warehouse manager | `inventory.transfer.approve_variance` |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `submit` | `inventory:transfer:{id}` | Lines, source → dest |
| `approve` / `reject` | `inventory:transfer:{id}` | `approval_change` + comment |
| `ship` | `inventory:transfer:{id}` | Carrier, tracking, batch list |
| `receive` | `inventory:transfer:{id}` | Received qty per line |
| `complete` | `inventory:item:{id}` | `movement` pairs (out/in) |
| `cancel` | `inventory:transfer:{id}` | Reason |

### AI Actions

| Trigger | Agent Capability | Output |
|---------|-------------------|--------|
| Overstock at WH-A, low at WH-B | Warehouse balancing | Draft transfer suggestion |
| Slow mover at one site | Slow mover detection | Transfer to high-velocity WH |
| Expiring batch at remote WH | Expiry risk | Transfer to main for FEFO sale |
| Repeated partial receives | Shrinkage anomaly | Route/carrier investigation |
| Seasonal demand shift | Demand forecast | Pre-season transfer plan |

### Workflow Diagram (Full Lifecycle)

```text
  [Draft Transfer TR-0041]
  Source: Dhaka Main → Dest: Chittagong
  Lines: SKU-A × 100, SKU-B × 50 (batch LOT-8821)
        │
        ▼
  require_approval? ──yes──▶ Manager APPROVED
        │ no                      │
        └─────────────────────────┘
                    │
                    ▼
  Source WH ships, scans batch
  transfer_out (−100, −50) @ Dhaka
  Status: IN_TRANSIT
                    │
                    ▼
  Dest WH receives (partial OK: 98 + 50)
  transfer_in (+98, +50) @ Chittagong
  Status: RECEIVED
                    │
                    ├── variance 2 units? ──▶ Adjustment draft or approve
                    │
                    ▼
  Status: COMPLETED
  Events: inventory.transfer.completed
```

---

## 4. Adjustment Workflow

**Workflow ID:** `inventory.adjustment`  
**Primary table:** `inventory_adjustments`  
**Route:** `/inventory/adjustments` · `/inventory/adjustments/[id]`

### Purpose

Correct stock discrepancies — damage, shrinkage, found stock, opening balances, QC rejects, expiry write-offs.

### Trigger

| Source | Action |
|--------|--------|
| **Manual adjustment** | User at `/inventory/adjustments/create` |
| **Cycle count variance** | Auto-draft from cycle count (§8) |
| **AI write-off suggestion** | Expiry risk / slow mover |
| **QC reject** | Failed inbound QC |
| **Batch expiry job** | Scheduled expiry processing |
| **Opening balance** | Onboarding / migration |

### States

```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    DRAFT    │────▶│  SUBMITTED  │────▶│  APPROVED   │────▶│   POSTED    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   ▼                   ▼
       │            ┌─────────────┐     ┌─────────────┐
       └───────────▶│  REJECTED   │     │  CANCELLED  │
                    └─────────────┘     └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Draft | `draft` | Lines and reason entered |
| Submitted | `submitted` | Awaiting approval |
| Approved | `approved` | Approver signed off |
| Posted | `posted` | Movement written; qty updated |
| Rejected | `rejected` | Returned to draft or closed |
| Cancelled | `cancelled` | Voided |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `submit` | `draft` | `submitted` | Creator | Reason code required | `inventory.adjustment.submitted` |
| `auto_approve` | `draft` | `approved` | System | Value ≤ threshold | `inventory.adjustment.auto_approved` |
| `approve` | `submitted` | `approved` | Approver | Permission + SoD | `inventory.adjustment.approved` |
| `reject` | `submitted` | `rejected` | Approver | Comment required | `inventory.adjustment.rejected` |
| `post` | `approved` | `posted` | System / clerk | Qty delta valid | `inventory.adjustment.posted` |
| `cancel` | `draft`, `submitted` | `cancelled` | Creator | Not posted | `inventory.adjustment.cancelled` |
| `reopen` | `rejected` | `draft` | Creator | Edit and resubmit | `inventory.adjustment.reopened` |

### Reason Codes

| Code | Direction | Typical Approval |
|------|-----------|------------------|
| `cycle_count` | ± | Auto if within threshold |
| `damage` | − | Manager |
| `shrinkage` | − | Manager + Finance if high |
| `found` | + | Supervisor |
| `opening_balance` | + | Inventory manager |
| `qc_reject` | − | QC lead |
| `expiry_write_off` | − | Manager |
| `theft` | − | Manager + Finance |

### Movement on Post

```text
movement_type: adjustment
quantity:      ±N (sign from reason)
qty_on_hand:   ±N
batch_id:      if batch write-off
serial_ids[]:  status → scrapped if serial write-off
reason_code:   required
```

### Approval Rules

| Condition | Approver | Permission |
|-----------|----------|------------|
| Absolute value > `approval_threshold` | Inventory manager | `inventory.adjustment.approve` |
| Value > finance threshold | Finance controller | `inventory.adjustment.approve_finance` |
| Shrinkage > X% of SKU monthly | Audit flag | `inventory.adjustment.approve_audit` |
| Creator ≠ approver (SoD) | Enforced | System guard |
| Regulated batch write-off | Compliance | `inventory.batch.write_off_approve` |
| Negative adjustment → zero stock | Supervisor confirm | `inventory.adjustment.approve_zero` |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `submit` | `inventory:adjustment:{id}` | Reason, lines, before/after qty |
| `approve` / `reject` | `inventory:adjustment:{id}` | `approval_change`, approver, comment |
| `post` | `inventory:item:{id}` | `movement` + `stock_change` |
| `cancel` | `inventory:adjustment:{id}` | Cancel reason |
| AI origin | `inventory:adjustment:{id}` | `ai_action` link to suggestion |

### AI Actions

| Trigger | Agent Capability | Output |
|---------|-------------------|--------|
| Repeated shrinkage at location | Shrinkage anomaly | Draft adjustment investigation |
| Batch near expiry + low velocity | Expiry risk | Write-off draft (`expiry_write_off`) |
| Dead stock no movement 180d | Slow mover detection | Markdown or write-off suggestion |
| Cycle count variance pattern | Cycle count prioritization | Flag SKU for recount |
| Cost layer mismatch | Anomaly | Suggest adjustment + valuation review |

### Workflow Diagram

```text
  Counter finds −3 units SKU-X @ Bin A-01-R3-B2
        │
        ▼
  Create Adjustment ADJ-0192
  reason: shrinkage, qty: −3
        │
        ▼
  value > threshold? ──yes──▶ SUBMITTED → Manager APPROVED
        │ no                           │
        └──────── auto_approve ────────┘
                    │
                    ▼
  Post movement (adjustment, −3)
  qty_on_hand: 47 → 44
  Status: POSTED
        │
        ▼
  Event: inventory.adjustment.posted
  Activity: stock_change on inventory:item:{id}
```

---

## 5. Reservation Workflow

**Workflow ID:** `inventory.reservation`  
**Primary table:** `inventory_reservations`  
**Route:** `/inventory/reservations`

### Purpose

Soft holds on stock preventing oversell while orders await payment, approval, or fulfillment.

### Trigger

| Source | Event / Action |
|--------|----------------|
| **Sales order confirm** | `sales.order.confirmed` |
| **Ecommerce order** | `commerce.order.confirmed` (policy) |
| **Payment capture** | On paid (alternative policy) |
| **Quote acceptance** | `sales.quotation.accepted` |
| **POS checkout** | Cart hold (short TTL) |
| **Manufacturing** | Material reservation for WO (future) |
| **Manual hold** | User at `/inventory/reservations` |

### States

```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   PENDING   │────▶│   ACTIVE    │────▶│  FULFILLED  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │                   ├──────────────────┐
       │                   ▼                  ▼
       │            ┌─────────────┐     ┌─────────────┐
       └───────────▶│  RELEASED   │     │   EXPIRED   │
                    └─────────────┘     └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Pending | `pending` | Hold requested; allocation in progress |
| Active | `active` | `qty_reserved` incremented |
| Fulfilled | `fulfilled` | Shipped; reservation consumed |
| Released | `released` | Cancelled; qty returned to available |
| Expired | `expired` | TTL elapsed; auto-released |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `create` | — | `pending` | Sales / Orders | Item track_inventory | `inventory.reservation.created` |
| `activate` | `pending` | `active` | System | qty_available ≥ qty | `inventory.reservation.activated` |
| `allocate_batch` | `pending`, `active` | `active` | System | FEFO/FIFO batch assigned | `inventory.reservation.batch_allocated` |
| `fulfill` | `active` | `fulfilled` | Shipment post | Stock out posted | `inventory.reservation.fulfilled` |
| `partial_fulfill` | `active` | `active` | Shipment | Reduce reserved qty | `inventory.reservation.partial` |
| `release` | `active`, `pending` | `released` | Cancel / payment fail | — | `inventory.reservation.released` |
| `expire` | `active`, `pending` | `expired` | Scheduled job | `expires_at` passed | `inventory.reservation.expired` |

### Stock Impact

```text
activate:
  qty_reserved += N
  qty_available -= N (derived)
  movement_type: reservation_hold (ledger note, qty 0)

fulfill:
  qty_reserved -= N
  qty_on_hand  -= N
  movement_type: sale (via stock out §2)

release / expire:
  qty_reserved -= N
  movement_type: reservation_release (ledger note, qty 0)
```

### Approval Rules

| Condition | Approver | Permission |
|-----------|----------|------------|
| Reserve when available = 0 (backorder) | Sales manager | `inventory.reservation.backorder` |
| Reserve qty > order qty | System block | — |
| Reserve expired batch | System block | — |
| Manual hold > TTL default | Inventory supervisor | `inventory.reservation.manual_extend` |
| Cross-warehouse reserve override | Warehouse manager | `inventory.reservation.cross_wh` |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `create` | Order entity + `inventory:item:{id}` | "Reserved N for {order_ref}" |
| `activate` | `inventory:reservation:{id}` | `reservation` + batch allocated |
| `fulfill` | `inventory:reservation:{id}` | Fulfilled qty, shipment link |
| `release` | `inventory:reservation:{id}` | Release reason (cancel, payment fail) |
| `expire` | `inventory:reservation:{id}` | TTL expired, auto-release job |

### AI Actions

| Trigger | Agent Capability | Output |
|---------|-------------------|--------|
| High reservation / low available | Demand forecast | "Expedite PO or transfer" |
| Many expired reservations | Anomaly | Payment gateway or checkout friction flag |
| FEFO batch reserved for far-future order | Expiry risk | Suggest reallocate batch |
| Channel reservation imbalance | Warehouse balancing | Reassign fulfillment WH |

### Workflow Diagram

```text
  commerce.order.confirmed (policy: reserve on confirm)
        │
        ▼
  Check qty_available @ default WH
        │
        ├── available ≥ qty ──▶ ACTIVE (+qty_reserved)
        │
        └── available < qty ──▶ backorder policy?
                │ yes: ACTIVE with approval
                │ no:  block confirm → Sales notified
        │
        ▼
  FEFO: batch LOT-4412 allocated to reservation
        │
        ├── payment fails / order cancelled ──▶ RELEASED (−qty_reserved)
        │
        ├── expires_at passed (48h) ──▶ EXPIRED (job: ReleaseExpiredReservations)
        │
        └── shipment posted ──▶ FULFILLED (−qty_reserved, −qty_on_hand)
```

---

## 6. Batch Workflow

**Workflow ID:** `inventory.batch`  
**Primary table:** `inventory_batches`  
**Route:** `/inventory/batches` · `/inventory/batches/[id]`

### Purpose

Lot/batch lifecycle for expiry, recall, quarantine, and FEFO/FIFO compliance (pharma, food, hospital).

### Trigger

| Source | Action |
|--------|--------|
| **Stock In** | Batch created on purchase receipt |
| **Manufacturing** | Production lot output (future) |
| **Batch split/repack** | `movement_type: batch_split` |
| **QC hold** | Inbound QC fail → quarantine |
| **Regulatory recall** | Manual recall initiation |
| **Expiry job** | Scheduled status → expired |

### States

```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   CREATED   │────▶│   ACTIVE    │────▶│ QUARANTINED  │────▶│   EXPIRED   │
└─────────────┘     └──────┬──────┘     └──────┬──────┘     └─────────────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  RECALLED   │     │  DEPLETED   │
                    └─────────────┘     └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Created | `created` | Lot registered; qty = 0 until receipt post |
| Active | `active` | Available for allocation (FEFO) |
| Quarantined | `quarantined` | QC hold; blocked from allocation |
| Recalled | `recalled` | Regulatory/customer recall; block all out |
| Expired | `expired` | Past `expires_at`; block ship |
| Depleted | `depleted` | qty_on_hand = 0; archival |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `register` | — | `created` | Receipt post | Batch number unique per item | `inventory.batch.created` |
| `activate` | `created` | `active` | QC pass / auto | qty > 0 | `inventory.batch.activated` |
| `quarantine` | `active`, `created` | `quarantined` | QC fail | Reason required | `inventory.batch.quarantined` |
| `release_quarantine` | `quarantined` | `active` | QC pass | Retest OK | `inventory.batch.released` |
| `recall` | `active`, `quarantined` | `recalled` | Compliance | Always requires approval | `inventory.batch.recalled` |
| `expire` | `active` | `expired` | Scheduled job | `expires_at` < today | `inventory.batch.expired` |
| `deplete` | `active`, `expired`, `recalled` | `depleted` | System | qty_on_hand = 0 | `inventory.batch.depleted` |
| `write_off` | `expired`, `recalled`, `quarantined` | `depleted` | Adjustment post | Linked adjustment | `inventory.batch.written_off` |

### Allocation Rules (FEFO / FIFO)

```text
On reservation / stock out allocate:
  1. Filter batches: status = active, expires_at ASC (FEFO) or manufactured_at ASC (FIFO)
  2. Block: quarantined, recalled, expired
  3. Warn: expires within alert_days (30/60/90)
  4. Hard block ship: expired batch
```

### Approval Rules

| Condition | Approver | Permission |
|-----------|----------|------------|
| Recall initiation | Compliance officer | `inventory.batch.recall_approve` |
| Ship batch within expiry warning window | Manager override | `inventory.batch.ship_near_expiry` |
| Quarantine release after fail | QC lead | `inventory.batch.release_quarantine` |
| Write-off recalled batch | Manager + compliance | `inventory.batch.write_off_approve` |
| Transfer recalled batch | Hard block | — |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `register` | `inventory:batch:{id}` | Lot number, mfg/exp dates, supplier ref |
| `quarantine` / `release` | `inventory:batch:{id}` | QC notes, attachments |
| `recall` | `inventory:batch:{id}` | `status_change`, recall notice, affected orders list |
| `expire` | `inventory:batch:{id}` | Auto-expire job, qty at risk |
| `write_off` | `inventory:batch:{id}` | Link to adjustment ADJ-{id} |

### AI Actions

| Trigger | Agent Capability | Output |
|---------|-------------------|--------|
| Batch expires in 30 days + low velocity | Expiry risk | Write-off or promo markdown draft |
| Recall pattern at supplier | Anomaly | Flag all lots from supplier batch ref |
| FEFO violation detected | Expiry risk | "Ship LOT-8821 before LOT-8820" |
| Quarantine rate spike | Shrinkage anomaly | Supplier quality investigation |
| Near-expiry overstock | Warehouse balancing | Transfer to high-turnover WH |

### Workflow Diagram

```text
  Purchase receipt posts +100 units
  Batch LOT-2026-0412 created (exp: 2026-12-31)
        │
        ▼
  QC required? ──fail──▶ QUARANTINED (block allocation)
        │ pass
        ▼
  ACTIVE — available for FEFO
        │
        ├── reservations allocate this lot first (earliest expiry)
        │
        ├── regulatory notice ──▶ RECALL (block all outbound)
        │         │
        │         └──▶ write_off adjustment → DEPLETED
        │
        ├── expires_at passed ──▶ EXPIRED (block ship)
        │         │
        │         └──▶ write_off adjustment → DEPLETED
        │
        └── qty_on_hand → 0 ──▶ DEPLETED (archived)
```

---

## 7. Serial Workflow

**Workflow ID:** `inventory.serial`  
**Primary table:** `inventory_serials`  
**Route:** `/inventory/serials` · `/inventory/serials/[serial]`

### Purpose

Unit-level traceability for electronics, medical devices, and high-value assets. Each serial = qty 1.

### Trigger

| Source | Action |
|--------|--------|
| **Stock In** | Serial registered on receipt |
| **Manufacturing** | Unit produced with serial (future) |
| **Reservation** | Serial assigned to order line |
| **Stock Out** | Serial shipped/sold |
| **Return** | Customer return restock |
| **Service/RMA** | Repair, warranty claim (future) |
| **Scrap** | Write-off adjustment |

### States

```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  REGISTERED │────▶│  IN_STOCK   │────▶│  RESERVED   │────▶│    SOLD     │
└─────────────┘     └──────┬──────┘     └─────────────┘     └──────┬──────┘
                           │                                        │
                           ▼                                        ▼
                    ┌─────────────┐                          ┌─────────────┐
                    │ QUARANTINED │                          │  RETURNED   │
                    └──────┬──────┘                          └──────┬──────┘
                           │                                        │
                           ▼                                        ▼
                    ┌─────────────┐                          ┌─────────────┐
                    │   SCRAPPED  │◀─────────────────────────┘ (defective)
                    └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Registered | `registered` | Serial captured; not yet in stock |
| In Stock | `in_stock` | Available at warehouse/location |
| Reserved | `reserved` | Assigned to order/reservation |
| Sold | `sold` | Shipped to customer; order linked |
| Returned | `returned` | Customer return received |
| Quarantined | `quarantined` | QC hold, RMA inspection |
| Scrapped | `scrapped` | Written off; no further use |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `register` | — | `registered` | Receipt scan | Unique per company | `inventory.serial.registered` |
| `receive` | `registered` | `in_stock` | Receipt post | Linked to batch optional | `inventory.serial.received` |
| `reserve` | `in_stock` | `reserved` | Order allocation | Not quarantined | `inventory.serial.reserved` |
| `release` | `reserved` | `in_stock` | Order cancel | — | `inventory.serial.released` |
| `ship` | `reserved`, `in_stock` | `sold` | Shipment post | Scan match | `inventory.serial.shipped` |
| `return_receive` | `sold` | `returned` | RMA receipt | Order link | `inventory.serial.returned` |
| `restock` | `returned` | `in_stock` | QC pass | — | `inventory.serial.restocked` |
| `quarantine` | `in_stock`, `returned` | `quarantined` | QC fail | — | `inventory.serial.quarantined` |
| `scrap` | `quarantined`, `returned`, `in_stock` | `scrapped` | Adjustment | Approval if value high | `inventory.serial.scrapped` |

### Stock Impact

Serial-tracked items: **no fractional qty**. Each transition updates serial record; movement attaches `serial_ids[]`.

```text
receive:  serial → in_stock, movement +1 (if item uses serial-as-qty)
ship:     serial → sold, movement −1, order_id set
scrap:    serial → scrapped, movement −1 (if was in_stock)
```

### Approval Rules

| Condition | Approver | Permission |
|-----------|----------|------------|
| Ship high-value serial (> threshold) | Warehouse supervisor | `inventory.serial.approve_ship` |
| Scrap in-warranty unit | Service manager | `inventory.serial.approve_scrap` |
| Restock returned serial (defect suspected) | QC lead | `inventory.serial.approve_restock` |
| Duplicate serial scan attempt | System block | — |
| Serial on recalled batch | Hard block | — |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `register` / `receive` | `inventory:serial:{sn}` | Warehouse, batch link |
| `reserve` / `release` | `inventory:serial:{sn}` | Order ref |
| `ship` | `inventory:serial:{sn}` | Customer, shipment, warranty start |
| `return_receive` | `inventory:serial:{sn}` | RMA reason |
| `quarantine` / `scrap` | `inventory:serial:{sn}` | QC notes, photos |
| Full trace | `inventory:serial:{sn}` | Timeline: receipt → sale → return → scrap |

### AI Actions

| Trigger | Agent Capability | Output |
|---------|-------------------|--------|
| Serial returned multiple times | Anomaly | Defect pattern / supplier flag |
| Warranty expiring + no service record | Slow mover | Service campaign suggestion |
| Serial location mismatch on pick | Shrinkage anomaly | Bin accuracy count priority |
| High-value serial idle > N days | Slow mover | Transfer or markdown |
| Return rate by serial prefix | Anomaly | Batch quality investigation |

### Workflow Diagram

```text
  Receipt scan: SN-9F2A-8841-2026
        │
        ▼
  REGISTERED → receive → IN_STOCK @ WH-DHK / Bin A-01-R3-B2
        │
        ▼
  Order SO-1042 line allocates serial
  RESERVED (linked reservation)
        │
        ├── order cancelled ──▶ RELEASED → IN_STOCK
        │
        └── pick + pack scan match
                │
                ▼
            SOLD (order_id, warranty_expires_at set)
            movement: sale, serial_ids: [SN-9F2A-8841-2026]
                │
                ├── RMA return ──▶ RETURNED
                │       │
                │       ├── QC fail ──▶ QUARANTINED → SCRAPPED
                │       └── QC pass ──▶ restock → IN_STOCK
                │
                └── (end of life) ──▶ SCRAPPED
```

---

## 8. Cycle Count Workflow

**Workflow ID:** `inventory.cycle_count`  
**Primary table:** `inventory_cycle_counts`, `inventory_cycle_count_lines`  
**Route:** `/inventory/cycle-counts` · `/inventory/cycle-counts/[id]`

### Purpose

Systematic physical inventory verification without full warehouse shutdown — ABC scheduling, blind counts, variance → adjustment.

### Trigger

| Source | Action |
|--------|--------|
| **Scheduled ABC** | A weekly, B monthly, C quarterly |
| **Manual count** | User starts at `/inventory/cycle-counts/create` |
| **AI prioritization** | High-variance SKU flagged |
| **Post-incident** | After shrinkage anomaly |
| **Pre-audit** | Finance/compliance request |
| **Location-based** | Zone/aisle count campaign |

### States

```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  SCHEDULED  │────▶│ IN_PROGRESS │────▶│   COUNTED   │────▶│  REVIEWED   │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
       │                   │                   │                    │
       │                   ▼                   │                    ▼
       │            ┌─────────────┐           │             ┌─────────────┐
       └───────────▶│  CANCELLED  │           └────────────▶│ ADJ_POSTED  │
                    └─────────────┘                         └──────┬──────┘
                                                                     │
                                                                     ▼
                                                              ┌─────────────┐
                                                              │   CLOSED    │
                                                              └─────────────┘
```

| State | Code | Description |
|-------|------|-------------|
| Scheduled | `scheduled` | Count plan created; not started |
| In Progress | `in_progress` | Counters assigned; blind count active |
| Counted | `counted` | All lines have physical qty |
| Reviewed | `reviewed` | Variances flagged; supervisor sign-off |
| Adj Posted | `adj_posted` | Adjustment draft posted (§4) |
| Closed | `closed` | Complete; accuracy metrics stored |
| Cancelled | `cancelled` | Aborted before count complete |

### Transitions

| Transition | From | To | Actor | Guard | Event |
|------------|------|-----|-------|-------|-------|
| `schedule` | — | `scheduled` | System / manager | ABC rules | `inventory.cycle_count.scheduled` |
| `start` | `scheduled` | `in_progress` | Counter | Assignee set | `inventory.cycle_count.started` |
| `enter_count` | `in_progress` | `in_progress` | Counter | Blind mode hides system qty | `inventory.cycle_count.line_counted` |
| `complete_count` | `in_progress` | `counted` | Counter | All lines filled | `inventory.cycle_count.counted` |
| `review` | `counted` | `reviewed` | Supervisor | Variances calculated | `inventory.cycle_count.reviewed` |
| `create_adjustment` | `reviewed` | `adj_posted` | System / manager | Within or approved variance | `inventory.cycle_count.adjustment_created` |
| `close` | `adj_posted`, `reviewed` | `closed` | Manager | No open variances | `inventory.cycle_count.closed` |
| `cancel` | `scheduled`, `in_progress` | `cancelled` | Manager | Reason required | `inventory.cycle_count.cancelled` |
| `recount` | `reviewed` | `in_progress` | Supervisor | High variance line | `inventory.cycle_count.recount` |

### Variance Handling

```text
variance_qty   = counted_qty − system_qty
variance_pct   = |variance_qty| / system_qty × 100
variance_value = |variance_qty| × unit_cost

if variance within threshold:
  auto-create adjustment draft (reason: cycle_count)
  transition → adj_posted (via §4 auto_approve)

if variance exceeds threshold:
  flag line for supervisor review
  optional recount transition
  manual approval on adjustment
```

### ABC Classification

| Class | Criteria (default) | Count Frequency |
|-------|-------------------|-----------------|
| **A** | Top 20% SKUs by value | Weekly |
| **B** | Next 30% by value | Monthly |
| **C** | Remaining 50% | Quarterly |
| **Location** | High-shrinkage bins | On AI flag |

### Approval Rules

| Condition | Approver | Permission |
|-----------|----------|------------|
| Variance value > threshold | Inventory manager | `inventory.cycle_count.approve_variance` |
| Variance > X% on A-class SKU | Supervisor + manager | `inventory.cycle_count.approve_high` |
| Auto-adjust disabled by policy | Manual adjustment only | `inventory.adjustment.approve` |
| Recount requested | Supervisor | `inventory.cycle_count.recount` |
| Close with unresolved variance | Blocked | — |

### Activity Logs

| Transition | Activity Entity | Log Entry |
|------------|-----------------|-----------|
| `schedule` | `inventory:cycle_count:{id}` | Scope: WH, zone, SKU list |
| `start` | `inventory:cycle_count:{id}` | Counter assignees |
| `enter_count` | `inventory:cycle_count:{id}` | Per-line counted qty (blind) |
| `review` | `inventory:cycle_count:{id}` | Variance table, flagged lines |
| `create_adjustment` | `inventory:adjustment:{id}` | Link CC-{id} → ADJ-{id} |
| `close` | `inventory:cycle_count:{id}` | Accuracy %, duration |
| `recount` | `inventory:cycle_count:{id}` | Line reset, reason |

### AI Actions

| Trigger | Agent Capability | Output |
|---------|-------------------|--------|
| SKU high historical variance | Cycle count prioritization | Schedule A-class count early |
| Location repeated shrinkage | Shrinkage anomaly | Target bin for next count |
| Count accuracy declining | Anomaly | Counter training flag |
| Seasonal SKU before peak | Demand forecast | Pre-season count recommendation |
| Dead stock found on count | Slow mover detection | Write-off suggestion |

### Workflow Diagram

```text
  AI flags Bin A-01-R3 (3 variances in 90 days)
        │
        ▼
  SCHEDULED: Cycle Count CC-2026-W24
  Scope: Zone A, 45 SKUs, blind count
        │
        ▼
  Counter starts → IN_PROGRESS
  (system qty hidden on scanner UI)
        │
        ▼
  All lines entered → COUNTED
  Example: SKU-X system 47, counted 44 → variance −3
        │
        ▼
  Supervisor REVIEWED
  variance 6.4% > 2% threshold → flag
        │
        ├── recount? ──▶ IN_PROGRESS (line reset)
        │
        └── approve variance
                │
                ▼
  Auto-create ADJ-0201 (reason: cycle_count, −3)
  §4 Adjustment → POSTED
        │
        ▼
  Status: ADJ_POSTED → CLOSED
  Accuracy metric stored: 93.6% this session
  Event: inventory.cycle_count.closed
```

---

## Cross-Workflow Integration Map

```text
                         ┌──────────────────────────────────────┐
                         │           CYCLE COUNT (§8)            │
                         │  physical verify → variance → adj    │
                         └───────────────────┬──────────────────┘
                                             │ creates
                                             ▼
┌─────────────┐    reserve    ┌─────────────┴─────────────┐    ship    ┌─────────────┐
│  STOCK IN   │◀──────────────│      RESERVATION (§5)      │───────────▶│  STOCK OUT  │
│    (§1)     │   batch/serial └─────────────┬─────────────┘            │    (§2)     │
└──────┬──────┘                              │                           └──────┬──────┘
       │ creates                             │ allocates                      │ consumes
       ▼                                     ▼                                ▼
┌─────────────┐                       ┌─────────────┐                  ┌─────────────┐
│   BATCH     │◀──────────────────────│  TRANSFER   │─────────────────▶│   SERIAL    │
│    (§6)     │                       │    (§3)     │                  │    (§7)     │
└──────┬──────┘                       └─────────────┘                  └─────────────┘
       │ expiry/recall
       ▼
┌─────────────┐
│ ADJUSTMENT  │
│    (§4)     │
└─────────────┘
```

### Module Event Chain (Sales Example)

```text
sales.order.confirmed
  → inventory.reservation.activated (§5)
  → inventory.batch.batch_allocated (§6) [if FEFO]
  → inventory.serial.reserved (§7) [if serial]

sales.shipment.completed
  → inventory.stock_out.shipped (§2)
  → inventory.reservation.fulfilled (§5)
  → inventory.serial.shipped (§7)

purchase.receipt.completed
  → inventory.stock_in.posted (§1)
  → inventory.batch.activated (§6)
  → inventory.serial.received (§7)
```

---

## Workflow Engine Registration

All workflows register with Core [WORKFLOW_ENGINE_ARCHITECTURE.md](../../core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md):

```yaml
# Example: inventory.adjustment
model: inventory_adjustments
workflow_id: inventory.adjustment
states: [draft, submitted, approved, posted, rejected, cancelled]
transitions:
  - name: submit
    from: draft
    to: submitted
    permission: inventory.adjustment.create
  - name: approve
    from: submitted
    to: approved
    permission: inventory.adjustment.approve
    approval_policy: inventory.adjustment.approval_threshold
  - name: post
    from: approved
    to: posted
    permission: inventory.adjustment.post
    event: inventory.adjustment.posted
```

Full registry: [WORKFLOW_REGISTRY.md](../../WORKFLOW_REGISTRY.md)

---

## Permissions Summary

| Workflow | Key Permissions |
|----------|-----------------|
| Stock In | `inventory.receipt.receive`, `inventory.receipt.approve_over` |
| Stock Out | `inventory.stock_out.pick`, `inventory.stock_out.override` |
| Transfer | `inventory.transfer.create`, `inventory.transfer.approve`, `inventory.transfer.ship`, `inventory.transfer.receive` |
| Adjustment | `inventory.adjustment.create`, `inventory.adjustment.approve`, `inventory.adjustment.post` |
| Reservation | `inventory.reservation.create`, `inventory.reservation.backorder`, `inventory.reservation.release` |
| Batch | `inventory.batch.quarantine`, `inventory.batch.recall_approve`, `inventory.batch.write_off_approve` |
| Serial | `inventory.serial.register`, `inventory.serial.approve_ship`, `inventory.serial.approve_scrap` |
| Cycle Count | `inventory.cycle_count.create`, `inventory.cycle_count.count`, `inventory.cycle_count.approve_variance` |

Full list: [INVENTORY_MODULE_ARCHITECTURE.md §20](./INVENTORY_MODULE_ARCHITECTURE.md)

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| [INVENTORY_MODULE_ARCHITECTURE.md](./INVENTORY_MODULE_ARCHITECTURE.md) | Module architecture (parent) |
| [PURCHASE_MODULE_ARCHITECTURE.md](../purchase/PURCHASE_MODULE_ARCHITECTURE.md) | Stock In orchestration (receipts) |
| [PURCHASE_WORKFLOW.md](../purchase/PURCHASE_WORKFLOW.md) | Procurement workflows — receipt triggers Stock In |
| [SALES_MODULE_ARCHITECTURE.md](../sales/SALES_MODULE_ARCHITECTURE.md) | Stock Out orchestration (shipments) |
| [SALES_WORKFLOW.md](../sales/SALES_WORKFLOW.md) | Sales order reserve → ship triggers Stock Out |
| [ACTIVITY_CHATTER_ARCHITECTURE.md](../core/ACTIVITY_CHATTER_ARCHITECTURE.md) | Activity logging |
| [core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md](../../core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md) | State machine engine |
| [core/engines/APPROVAL_ENGINE_ARCHITECTURE.md](../../core/engines/APPROVAL_ENGINE_ARCHITECTURE.md) | Approval policies |
| [WORKFLOW_REGISTRY.md](../../WORKFLOW_REGISTRY.md) | Platform workflow index |

---

## Document Control

| Field | Value |
|-------|-------|
| **Owner** | Platform Team · Inventory Domain |
| **Reviewers** | Architecture, Warehouse Ops, Compliance |
| **Next Review** | At workflow engine implementation gate |
| **Status Gate** | Documentation First — Ready for UI/UX Planning |

**Changelog:** [CHANGELOG.md](../../CHANGELOG.md)
