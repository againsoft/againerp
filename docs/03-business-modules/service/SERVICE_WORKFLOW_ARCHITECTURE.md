# Service Module — Workflow Architecture

> **Status:** Planning Phase  
> **Version:** 1.0  
> **Module:** Service  
> **Document Type:** Workflow & User Flow  
> **Phase:** STEP 04 / §24 — Planning Only  
> **Parent:** [SERVICE_MODULE_ARCHITECTURE.md](./SERVICE_MODULE_ARCHITECTURE.md)

---

**No workflow engine code. Uses Core `WorkflowService` at implementation.**

---

## 1. Actors

| Actor | Primary actions |
|-------|-----------------|
| **Customer Support** | Intake service request, create draft order |
| **Service Manager** | Assign, approve quotes, SLA override |
| **Dispatcher** | Schedule board, auto-assign |
| **Technician** | Work orders, check-in, parts, signature |
| **Accountant** | Invoice from completed orders (Sales UI) |
| **Customer** | Portal — track status (future) |

---

## 2. User Flow — Standard Service Job

```text
[Support] Create Service Order (draft)
    ↓
[Manager] Confirm → open
    ↓
[Dispatcher] Assign technician + schedule slot
    ↓
[System] Create Work Order(s)
    ↓
[Technician] Check-in → work → parts (if any) → signature → complete WO
    ↓
[Manager] Complete Service Order
    ↓
[System] Emit service.billing.ready
    ↓
[Sales/Finance] Create mixed invoice → post
```

**UI routes:** `/service/orders?create=1` → `?view={id}` → `/service/work-orders?view={woId}`

---

## 3. Repair Flow

```text
Receive Asset (repair_stage: received)
    ↓
Diagnosis (technician notes + checklist)
    ↓
Quote → Sales quotation (optional approval if over threshold)
    ↓
Customer approval → repair_stage: repairing
    ↓
Parts issue (InventoryService)
    ↓
Testing → ready
    ↓
Delivery (signature) → delivered
    ↓
Invoice (parts + labor + products)
```

**State machine:** `repair_stage` column on `service_orders` — transitions validated per company repair profile.

| From | To | Actor | Guard |
|------|-----|-------|-------|
| received | diagnosing | Technician | — |
| diagnosing | awaiting_approval | Technician | Quote required if cost > threshold |
| awaiting_approval | repairing | Manager / Customer | Approval recorded |
| repairing | testing | Technician | All parts issued |
| testing | ready | Technician | Checklist pass |
| ready | delivered | Technician | Signature captured |

---

## 4. AMC / Contract Flow

```text
[Sales] Sell AMC → service_contract (draft)
    ↓
[Manager] Activate contract
    ↓
[System] Schedule recurring service_orders per visit_frequency
    ↓
[Dispatcher] Assign visits throughout period
    ↓
[Technician] Complete each visit WO
    ↓
[30d before end] Renewal reminder notification
    ↓
[Manager] Renew → new contract period OR expire
```

**Auto-scheduling job:** nightly cron creates draft service orders for due visits; dispatcher confirms.

---

## 5. Subscription Flow

```text
Create subscription (active)
    ↓
next_billing_date reached
    ↓
Event service.subscription.billing_due
    ↓
SalesService creates invoice (service line)
    ↓
Payment received (Finance)
    ↓
Advance next_billing_date by interval
    ↓
If auto_renew && payment fail → pause + notify
```

---

## 6. Helpdesk Escalation Flow

```text
Helpdesk ticket (cannot resolve remotely)
    ↓
Agent: Escalate to Service
    ↓
Event helpdesk.ticket.escalated
    ↓
Service creates service_order linked to ticket_id
    ↓
Standard service workflow continues
    ↓
On complete: update ticket status resolved
```

---

## 7. SLA Workflow

On service order `confirm`:

1. Load `sla_policy` by priority
2. Create `service_sla_timers` — response_due_at, resolution_due_at
3. On first technician assignment → set `responded_at`
4. On order `complete` → set `resolved_at`
5. If deadline passed without action → breach event + escalation notification

**Escalation chain:** technician → dispatcher → service manager (configurable)

---

## 8. Approval Integration

| Trigger | Approval |
|---------|----------|
| Repair quote > company threshold | Manager approval via Core Approval Engine |
| Parts issue > stock value limit | Inventory + Service manager |
| SLA override | Service manager |
| Contract discount > policy | Sales + Service manager |

---

## 9. Activity & Notifications

All state transitions write to Core Activity timeline on:

- Service order
- Work order
- Asset (rollup)
- Contact (customer 360)

Notification templates: assignment, schedule change, SLA warning, AMC renewal, subscription billing.

---

## Change History

| Date | Change |
|------|--------|
| 2026-06-21 | v1.0 — Initial workflow architecture (STEP 04) |
