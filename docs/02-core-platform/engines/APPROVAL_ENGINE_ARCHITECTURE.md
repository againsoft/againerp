# AgainERP — Approval Engine Architecture

> **Status:** Approved  
> **Version:** 1.0  
> **Owner:** Core Platform  
> **Document Type:** Enterprise Architecture  
> **Phase:** Documentation First · UI/UX Planning  
> **Layer:** Platform (not module-level)  
> **Governance:** [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · **Standards:** [DEVELOPMENT_STANDARDS.md](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md)

## Purpose
Core engine specification: APPROVAL ENGINE ARCHITECTURE.

## When To Read
Read only when working on the APPROVAL ENGINE ARCHITECTURE engine or its consumers.

## Related Files
- [Core hub](../ARCHITECTURE.md)
- [Engines index](README.md)

## Read Next
- [Core hub](../ARCHITECTURE.md)

---

**No backend code. No database implementation. No API implementation.**  
This document is the source of truth for **AgainERP's reusable Approval Engine** — one platform-level human approval system used by every module.

### Step 10 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Platform-wide reusable engine | §1 · §2 |
| Products, PO, SO, Refunds, Adjustments, Expenses, Finance, HR | §15 |
| Policies through Workflow integration | §3–§11 |
| AI Approval Assistant | §12 |
| Permissions, UI, Notifications | §13 · §14 |
| Single, multi-level, parallel, conditional approval | §4 · §5 · §6 |

**Related:** [WORKFLOW_ENGINE_ARCHITECTURE.md](./WORKFLOW_ENGINE_ARCHITECTURE.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) · [WORKFLOW_REGISTRY.md](../../00-foundation/registries/WORKFLOW_REGISTRY.md) · [PURCHASE_WORKFLOW.md](../../03-business-modules/purchase/PURCHASE_WORKFLOW.md) · [SALES_WORKFLOW.md](../../03-business-modules/sales/SALES_WORKFLOW.md) · [INVENTORY_WORKFLOW.md](../../03-business-modules/inventory/INVENTORY_WORKFLOW.md)

---

## Executive Summary

The **Approval Engine** is AgainERP's **universal human gate** — the single Core service that routes documents to the right approvers, enforces separation of duties, and unlocks workflow transitions when policy is satisfied.

| Principle | Rule |
|-----------|------|
| **One engine** | All modules use Core approval — no ad-hoc "manager sign-off" tables |
| **Policy-driven** | Amount, category, role, dimension → approver chain |
| **Workflow-native** | Approvals block transitions until `approved` |
| **Event-driven** | Every decision emits `core.approval.*` |
| **Auditable** | Immutable step history + Activity integration |
| **AI-assisted** | Risk hints, delegate suggestions — human decides |
| **Inbox UX** | One approval queue for all modules |

**Table namespace:** `approval_*` · **API base:** `/api/v1/core/approvals/`

---

## 1. Purpose

### Why a Platform Approval Engine Exists

High-value and high-risk actions appear everywhere — publish a product, approve a PO, refund a customer, write off stock, post an expense, hire an employee. Without a shared engine:

| Problem | Impact |
|---------|--------|
| Each module builds its own approver logic | Inconsistent UX, duplicate code |
| No central inbox | Approvers miss requests across modules |
| SoD violations | Creator approves own PO |
| Audit failure | Who approved what, when? |
| Escalation ad hoc | Requests stall with no SLA |
| AI cannot assess risk | Siloed approve/deny with no context |

The Approval Engine provides **one contract** for policy, chain, delegation, escalation, history, notification, and workflow unblock.

### What the Engine Owns

| Owns | Does Not Own |
|------|--------------|
| Approval request lifecycle | Business document content |
| Policy evaluation (which chain) | Workflow state (Workflow Engine) |
| Step assignment and routing | Domain calculations |
| Delegation and escalation | Email template design (Notification service renders) |
| Approval history | GL posting (Finance) |
| Approver inbox aggregation | Module-specific forms |

### Consumer Modules

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    APPROVAL ENGINE (Core Platform)                       │
│   Policy · Chain · Step · Delegate · Escalate · History · Inbox         │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
    ┌──────────┬──────────┬─────────┼─────────┬──────────┬──────────┐
    ▼          ▼          ▼         ▼         ▼          ▼          ▼
 Catalog   Inventory  Purchase   Sales    Finance      HR    Ecommerce
 Products   Adjust     PO/Bill    SO/Refund Expense   Leave   Refund
    │          │          │         │         │          │          │
    └──────────┴──────────┴─────────┴─────────┴──────────┴──────────┘
                                    │
                         Hospital · School · Restaurant · …
```

---

## 2. Approval Engine Vision

### Vision Statement

> **Right approver. Right time. Every decision audited. Nothing slips through.**

The Approval Engine turns organizational authority into **declarative policy** — finance sets thresholds, HR sets leave rules, admins configure matrices; approvers act from one inbox; workflows wait until human gates clear.

### Canonical Chain Example

Every enterprise recognizes this pattern:

```text
Manager
  ↓
Department Head
  ↓
Director
  ↓
Approved
```

Applied per domain:

| Module | Document | Step 1 | Step 2 | Step 3 |
|--------|----------|--------|--------|--------|
| Purchase | PO ৳250K | Manager | Dept Head | Director |
| Sales | SO discount 15% | Sales Manager | Finance | — |
| Finance | Expense ৳50K | Manager | Finance Controller | — |
| Catalog | Price −25% | Category Manager | Commercial Director | — |
| Inventory | Write-off ৳100K | Warehouse Mgr | Finance | — |
| HR | Leave 5 days | Line Manager | HR | — |
| Ecommerce | Refund ৳10K | CS Lead | Finance | — |

### Design Goals

| Goal | Target |
|------|--------|
| **Single + multi-level + parallel** | All chain types in one engine |
| **Conditional routing** | Amount/category adds or skips steps |
| **Sub-200ms policy eval** | Chain resolved at request creation |
| **SLA + escalation** | Auto-escalate after N hours |
| **Delegation** | Out-of-office without blocking business |
| **10M+ approval steps** | Partitioned history |
| **Tenant isolation** | `company_id` on all policies |

---

## 3. Approval Policies

### Policy Model

**Table:** `approval_policies`

| Field | Notes |
|-------|-------|
| `policy_id` | Slug — `purchase.po.threshold`, `sales.order.discount` |
| `name` | Display — "Purchase Order Approval" |
| `module` | Owner — `purchase`, `sales`, `catalog` |
| `model` | Bound entity — `purchase_orders`, `sales_orders` |
| `workflow_transition_id` | Optional — links to Workflow Engine transition |
| `chain_id` | Default approval chain |
| `is_active` | |
| `priority` | When multiple policies match — highest wins |
| `description` | Admin help |

### Policy Triggers

Policies activate when:

| Trigger | Example |
|---------|---------|
| **Workflow transition** | PO `submit` → pending_approval |
| **Field threshold** | `record.total > 50000` |
| **Manual request** | User clicks "Request Approval" |
| **API** | External system |
| **Schedule** | Periodic batch (future) |

### Policy Conditions

**Table:** `approval_policy_conditions`

| Field | Notes |
|-------|-------|
| `policy_id` | FK |
| `condition_type` | `field`, `role`, `category`, `branch`, `expression` |
| `operator` | gt, gte, lt, lte, eq, in |
| `field_path` | `record.total`, `record.discount_percent` |
| `value` | JSON literal |
| `chain_id` | Override chain when condition matches |

### Example Policies

| Policy ID | Module | Condition | Chain |
|-----------|--------|-----------|-------|
| `purchase.po.l1` | Purchase | total ≤ ৳50,000 | single_manager |
| `purchase.po.l2` | Purchase | ৳50K < total ≤ ৳200K | manager_dept_head |
| `purchase.po.l3` | Purchase | total > ৳200K | manager_dept_director_finance |
| `sales.order.discount` | Sales | discount > 5% | sales_manager |
| `sales.refund.standard` | Sales | refund ≤ ৳5,000 | cs_lead |
| `sales.refund.high` | Sales | refund > ৳5,000 | cs_lead_finance |
| `inventory.adjustment.writeoff` | Inventory | abs(value) > ৳25,000 | wh_manager_finance |
| `catalog.product.price` | Catalog | price_change > 20% | category_manager |
| `finance.expense.standard` | Finance | amount ≤ ৳10,000 | line_manager |
| `hr.leave.extended` | HR | days > 3 | manager_hr |

### Policy Registration

Modules seed default policies at install; tenants customize in Control Center.

```yaml
policy_id: purchase.po.threshold
module: purchase
model: purchase_orders
workflow_transition: submit
conditions:
  - if: record.total <= 50000
    chain: purchase_chain_l1
  - if: record.total <= 200000
    chain: purchase_chain_l2
  - else:
    chain: purchase_chain_l3
```

---

## 4. Approval Levels

### Level Concept

An **approval level** is one stage in a chain — a named tier of authority with assigned approver(s).

| Level | Code | Typical Role |
|-------|------|--------------|
| L1 | `l1_manager` | Line / sales manager |
| L2 | `l2_dept_head` | Department head |
| L3 | `l3_director` | Director / VP |
| L4 | `l4_finance` | Finance controller / CFO |
| L5 | `l5_legal` | Legal / compliance |
| L6 | `l6_executive` | CEO / board (capex) |

### Level Model

**Table:** `approval_levels`

| Field | Notes |
|-------|-------|
| `level_id` | Slug |
| `name` | "Department Head" |
| `sort_order` | Sequence in chain |
| `company_id` | Tenant-specific labels |
| `resolver_type` | `user`, `role`, `matrix`, `manager_of_submitter` |
| `resolver_config` | JSON — role ID, user ID, matrix key |

### Resolver Types

| Type | Description |
|------|-------------|
| **user** | Fixed user ID |
| **role** | Any user with role — first available or round-robin |
| **manager_of_submitter** | Submitter's `reports_to` user |
| **matrix** | Lookup dimension → user (see §5) |
| **group** | Any N of M from group |
| **delegation** | Active delegate if primary unavailable |

### Single Level Approval

One level, one approver (or any-one-of group):

```text
Submitter → [Manager] → Approved
```

Use case: low-value expense, small discount, routine adjustment.

---

## 5. Approval Chains

### Chain Model

**Table:** `approval_chains`

| Field | Notes |
|-------|-------|
| `chain_id` | Slug — `purchase_chain_l3` |
| `name` | "PO High Value — 3 Level" |
| `chain_type` | `sequential`, `parallel`, `conditional` |
| `module` | Optional scope |
| `description` | |

**Table:** `approval_chain_steps`

| Field | Notes |
|-------|-------|
| `chain_id` | FK |
| `step_order` | 1, 2, 3… |
| `level_id` | FK → approval_levels |
| `step_type` | `sequential`, `parallel`, `any_of` |
| `required_approvals` | For parallel — e.g. 2 of 3 |
| `skip_if` | Condition to skip step |
| `timeout_hours` | SLA before escalation |

### Chain Types

#### Sequential (Multi-Level)

Each step must approve before next activates:

```text
Manager → Department Head → Director → Approved
```

```text
Step 1: Manager        [pending] → [approved]
Step 2: Dept Head      [waiting] → [pending] → [approved]
Step 3: Director       [waiting] → [waiting] → [pending] → [approved]
```

#### Parallel

Multiple approvers at same level — **any 1 of N** or **all N**:

```text
Step 1: Manager A  ─┐
Step 1: Manager B  ─┼─ ANY 1 → proceed
Step 1: Manager C  ─┘

OR

Legal + Finance ─ BOTH required (parallel all)
```

| Mode | Code | Rule |
|------|------|------|
| Any one | `any_of` | First approve wins |
| All required | `all_of` | All must approve |
| Majority | `majority` | > 50% of N |
| Quorum | `quorum` | Min K of N |

#### Conditional

Steps added/skipped based on record attributes:

```text
IF total <= 50,000
  → Chain: [Manager only]

ELSE IF total <= 200,000
  → Chain: [Manager] → [Dept Head]

ELSE
  → Chain: [Manager] → [Dept Head] → [Director] → [Finance]
```

Implemented as **policy condition → chain mapping** (§3) or **per-step `skip_if`** on chain steps.

### Matrix-Based Chains

**Table:** `approval_matrices`

| Dimension | Example Values | Approver |
|-----------|----------------|----------|
| `category` | Electronics, Medical | Category manager user |
| `branch` | Dhaka, Chittagong | Branch manager |
| `amount_band` | 0–50K, 50K–200K | Escalating levels |
| `capex` | true/false | CFO step added |

```text
Matrix lookup: (category=Medical, amount=85000, branch=Dhaka)
  → Approver: Medical Category Head + Finance Controller
```

---

## 6. Delegation Rules

### Purpose

Approvers delegate authority during leave, travel, or workload — **without** changing policy or blocking business.

### Delegation Model

**Table:** `approval_delegates`

| Field | Notes |
|-------|-------|
| `id` | |
| `delegator_user_id` | Primary approver |
| `delegate_user_id` | Acting approver |
| `start_at` | Effective from |
| `end_at` | Effective until |
| `scope` | `all`, `module`, `policy_id` |
| `is_active` | |
| `reason` | "Annual leave" |
| `created_by` | |

### Delegation Rules

| Rule | Detail |
|------|--------|
| **Time-bound** | Delegation auto-expires at `end_at` |
| **Scope limited** | Delegate only specified modules/policies |
| **No re-delegation** | Delegate cannot delegate further (configurable) |
| **Audit trail** | Log shows "Approved by X (delegate for Y)" |
| **SoD preserved** | Delegate cannot approve submitter's own request if policy blocks |
| **Notification** | Both delegator and delegate notified on assignment |

### Resolution Order

```text
Step assigned to User A
     ↓
Check active delegation for A
     ↓
Yes → assign step to Delegate B, notify both
No  → assign to A
```

### Out-of-Office Integration

Future: sync from HR leave calendar → auto-create `approval_delegates` for leave period.

---
## 7. Escalation Rules

### Purpose

Prevent approvals from stalling — auto-escalate when SLA breached.

### Escalation Model

**Table:** `approval_escalation_rules`

| Field | Notes |
|-------|-------|
| `policy_id` or `chain_step_id` | Scope |
| `timeout_hours` | Hours in `pending` before escalate |
| `reminder_hours[]` | Reminder at 24h, 48h before escalate |
| `escalate_to_level_id` | Next level up |
| `escalate_to_user_id` | Fixed escalation target |
| `notify_submitter` | Alert originator on escalation |
| `auto_approve_after_hours` | Optional — disabled by default |
| `is_active` | |

### Escalation Flow

```text
Step 1: Manager — pending (assigned User M)
     ↓
24h: Reminder to Manager
     ↓
48h: Reminder + notify Dept Head (escalation preview)
     ↓
72h: SLA breach — escalate to Dept Head
     ↓
Step 1 reassigned to Dept Head (original Manager in CC)
     ↓
Activity: approval_escalated
Event: core.approval.escalated
```

### Escalation Policies

| Policy | Default |
|--------|---------|
| PO high value | 48h → escalate L1 → L2 |
| Refund | 24h → escalate to finance |
| Product publish | 72h → escalate to commercial director |
| HR leave | 24h → escalate to skip-level manager |
| Never auto-approve | `auto_approve_after_hours` = null (mandatory) |

### Weekend / Holiday Handling

`business_hours_only` flag — SLA clock pauses outside business hours (tenant timezone).

---

## 8. Approval History

### Request Model

**Table:** `approvals`

| Field | Notes |
|-------|-------|
| `id` | Approval request UUID |
| `policy_id` | FK |
| `chain_id` | Resolved chain |
| `model` | `purchase_orders` |
| `record_id` | Business record UUID |
| `workflow_instance_id` | Optional FK |
| `status` | `pending`, `approved`, `rejected`, `cancelled`, `expired` |
| `submitter_user_id` | Who requested |
| `submitted_at` | |
| `completed_at` | Final decision |
| `current_step_order` | Active step |
| `company_id` | |
| `context_snapshot` | JSON — record fields at submit time |

### Step Model

**Table:** `approval_steps`

| Field | Notes |
|-------|-------|
| `id` | Step UUID |
| `approval_id` | FK |
| `step_order` | 1, 2, 3 |
| `level_id` | FK |
| `assigned_user_id` | Resolved approver |
| `delegate_user_id` | If acting via delegation |
| `status` | `waiting`, `pending`, `approved`, `rejected`, `skipped`, `escalated` |
| `decision_at` | |
| `decision_by_user_id` | Actual actor (may be delegate) |
| `comment` | Approver reason |
| `attachment_ids[]` | Supporting docs |

### History Log

**Table:** `approval_step_logs` — append-only

| Field | Notes |
|-------|-------|
| `step_id` | FK |
| `action` | `assigned`, `reminded`, `approved`, `rejected`, `delegated`, `escalated`, `commented` |
| `actor_user_id` | |
| `metadata` | JSON |
| `created_at` | |

### History Guarantees

| Guarantee | Implementation |
|-----------|----------------|
| **Immutable** | No UPDATE/DELETE on logs |
| **Complete** | Every assign, remind, decide logged |
| **SoD visible** | Submitter ≠ approver in log |
| **Delegate transparent** | `decision_by` vs `assigned_to` |
| **Compliance export** | Filter by date, module, approver |

### UI Timeline Example

```text
2026-06-13 09:00  Jane (Buyer)     Submitted     PO-8821 ৳185,000
2026-06-13 09:01  System           Assigned L1   Bob Manager
2026-06-13 14:30  Bob Manager      Approved L1   "Within budget"
2026-06-13 14:31  System           Assigned L2   Sarah Dept Head
2026-06-14 10:15  Sarah Dept Head  Approved L2   —
2026-06-14 10:16  System           Assigned L3   Raj Director
2026-06-14 16:00  Raj Director     Approved      PO released
2026-06-14 16:01  Workflow         Transition    approved → ordered
```

---

## 9. Activity Integration

Integrates [Activity & Chatter Architecture](../subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md).

### Activity on Every Approval Event

| Event | Activity Type | Entity |
|-------|---------------|--------|
| Request submitted | `approval_change` | Module entity — `purchase:order:{id}` |
| Step assigned | `approval_change` | Same |
| Approved / rejected | `approval_change` | Same + comment |
| Escalated | `approval_change` | Same |
| Delegated | `approval_change` | Same |
| Cancelled | `approval_change` | Same |
| AI risk flag | `ai_action` | Same |

### Cross-Link

```text
approval.id           →  activity.reference_id
activity.entity_id    →  purchase:order:{record_id}
approval_step_logs    →  embedded in Activity timeline
```

### Chatter Integration

- Approvers can @mention submitter in approval comment
- Followers on record notified on approval decision
- Attachment on approval step → Activity attachment

### Tracked Operations

| Operation | Activity |
|-----------|----------|
| Submit for approval | `approval_change` — pending |
| Approve step | `approval_change` — approved + comment |
| Reject | `approval_change` — rejected + reason |
| Delegate | `approval_change` — delegated to X |
| Escalate | `approval_change` — escalated to Y |

---

## 10. Workflow Integration

Integrates [Workflow Engine Architecture](./WORKFLOW_ENGINE_ARCHITECTURE.md).

### Approval Blocks Transition

```text
Workflow transition: submit (draft → pending_approval)
  requires_approval: true
  approval_policy_id: purchase.po.threshold
        │
        ▼
  Approval Engine creates approval request
  workflow_instance.approval_id = approval.id
  Transition NOT executed yet (blocked)
        │
        ▼
  All chain steps → approved
        │
        ▼
  Approval Engine emits core.approval.completed
        │
        ▼
  Workflow Engine auto-fires OR user clicks Approve transition
  pending_approval → approved
```

### Rejection Flow

```text
Any step rejected
     ↓
approval.status = rejected
     ↓
Event: core.approval.rejected
     ↓
Workflow transition: reject (pending_approval → draft)
     ↓
Record returned to submitter with reason
```

### Workflow ↔ Approval Contract

| Workflow | Approval |
|----------|----------|
| `requires_approval: true` on transition | Creates approval on transition attempt |
| `approval_policy_id` | Resolves chain |
| `workflow_instance.approval_id` | Active approval FK |
| `core.approval.completed` | Unblocks transition |
| Terminal approval | Workflow moves to approved state |

### Idempotency

One active approval per `(model, record_id, policy_id)` — resubmit cancels prior pending or creates new version (policy).

---

## 11. AI Approval Assistant

Integrates [AI OS Architecture](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md).

### Role

**AI Approval Assistant** helps approvers decide faster and flags risk — never auto-approves high-value requests without explicit policy.

### Capabilities

| Capability | Input | Output |
|------------|-------|--------|
| **Risk score** | Record, history, vendor/customer profile | 0–100 risk + drivers |
| **Anomaly detection** | Amount vs history, duplicate PO | Flag for review |
| **Policy hint** | Record attributes | "Matches L2 chain — dept head required" |
| **Delegate suggestion** | Approver OOO calendar | Suggest active delegate |
| **Fraud pattern** | Refund velocity, customer | Block recommendation |
| **Approve recommendation** | Full context | "Likely approve — 12 prior POs on budget" |
| **Reject recommendation** | Margin, budget | "Reject — exceeds capex budget Q2" |
| **Summarization** | Long PO/contract PDF | Bullet summary for approver inbox |

### AI in Approver Inbox

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ PO-8821 · Acme Supplies · ৳185,000                    [Approve][Reject]│
├─────────────────────────────────────────────────────────────────────────┤
│ AI Risk: Low (12)  ·  8 prior POs on budget  ·  Vendor rating: 4.2/5      │
│ Summary: Repeat SKU-X order, 5% below last PO price, delivery in 7d       │
│ ⚠ Review: Requested by buyer who approved similar PO 2d ago (SoD hint)   │
└─────────────────────────────────────────────────────────────────────────┘
```

### AI Governance

| # | Rule |
|---|------|
| 1 | AI suggests — human approves (default) |
| 2 | Auto-approve only if tenant policy + low value + low risk |
| 3 | All AI hints logged in Activity `ai_action` |
| 4 | SoD violations flagged, not overridden by AI |
| 5 | Regulated industries — AI summary only, no auto-decide |

### Events

| Event | When |
|-------|------|
| `core.approval.ai_scored` | Risk score computed |
| `core.approval.ai_flagged` | Anomaly detected |

---

## 12. Permissions

Namespace: `core.approval.*` + module-specific approve permissions

### Platform Permissions

| Permission | Description |
|------------|-------------|
| `core.approval.view` | View approval requests |
| `core.approval.act` | Approve/reject assigned steps |
| `core.approval.act_any` | Super approver — any pending step |
| `core.approval.submit` | Submit approval requests |
| `core.approval.cancel` | Cancel own pending request |
| `core.approval.delegate` | Manage own delegations |
| `core.approval.configure` | Edit policies/chains (admin) |
| `core.approval.analytics` | View approval metrics |
| `core.approval.export` | Export history |

### Module Permissions (Examples)

| Permission | Module | Use |
|------------|--------|-----|
| `purchase.order.approve` | Purchase | PO L1 approver role |
| `purchase.order.approve_l2` | Purchase | Finance step |
| `sales.order.approve` | Sales | Discount approval |
| `sales.refund.approve` | Sales | Refund gate |
| `inventory.adjustment.approve` | Inventory | Write-off |
| `catalog.product.approve` | Catalog | Publish / price |
| `finance.expense.approve` | Finance | Expense report |
| `hr.leave.approve` | HR | Leave request |

### Separation of Duties (SoD)

| Rule | Enforcement |
|------|-------------|
| Submitter ≠ approver | Engine blocks same user on step |
| Receiver ≠ bill approver | Purchase policy |
| Buyer ≠ PO approver above threshold | Purchase SoD |
| Creator ≠ publish approver | Catalog |
| Configurable per policy | `sod_block_submitter: true` |

### Record Rules

Approvers see inbox items where `assigned_user_id = me` OR `delegate_user_id = me` OR `core.approval.act_any`.

---

## 13. UI Architecture

### Surfaces

| Surface | Route | Purpose |
|---------|-------|---------|
| **Approval Inbox** | `/inbox/approvals` | Global pending queue — all modules |
| **Record approval panel** | Embedded on PO/SO/product detail | Contextual approve/reject |
| **Policy admin** | `/control-center/approvals/policies` | Configure policies/chains |
| **Delegation manager** | `/settings/approvals/delegation` | User self-service OOO |
| **Approval history** | Record Activity tab | Timeline |
| **Mobile inbox** | Responsive / future app | Approve on the go |

### Approval Inbox Layout

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Approvals (12 pending)     [Filter: Module ▼] [Sort: Oldest ▼] [Search] │
├─────────────────────────────────────────────────────────────────────────┤
│ ● PO-8821    Purchase    ৳185,000   Bob Manager → You    Due in 6h       │
│ ● SO-1042    Sales       Discount 12%  Awaiting you      AI: Review SoD   │
│ ● ADJ-0192   Inventory   −৳45,000   Finance step       Overdue 2d ⚠      │
│ ○ EXP-441    Finance     ৳8,200     Approved yesterday                    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Record Panel (Embedded)

On document detail (Odoo-style):

- Status bar: `Pending Approval — Step 2 of 3`
- Approver avatars with pending/approved icons
- Comment box + Approve / Reject buttons
- AI insight collapsible strip
- Link to full history

### Design Blend

| Weight | Source | Applied To |
|--------|--------|------------|
| **60%** | Odoo | Status bar, approve buttons on form, chatter |
| **20%** | Shopify | Clean inbox list density |
| **10%** | Notion | Comment threads on approval |
| **10%** | Linear | Keyboard shortcuts — `a` approve, `r` reject |

### Bulk Actions (Future)

Select multiple low-value items → bulk approve (policy-gated, audit per item).

---

## 14. Notifications

Uses Core Notification System.

### Notification Events

| Event | Recipients | Channel |
|-------|------------|---------|
| `core.approval.requested` | Assigned approver(s) | In-app, email, push |
| `core.approval.reminder` | Pending approver | In-app, email |
| `core.approval.escalated` | Escalation target + original | In-app, email |
| `core.approval.completed` | Submitter | In-app, email |
| `core.approval.rejected` | Submitter + followers | In-app, email |
| `core.approval.delegated` | Delegate + delegator | In-app |
| `core.approval.comment` | Submitter, other approvers | In-app |

### Notification Content

| Field | Example |
|-------|---------|
| Title | "PO-8821 awaiting your approval" |
| Body | "৳185,000 · Acme Supplies · Step 2 of 3" |
| Action URL | `/purchase/orders/8821?approval={id}` |
| Deep link | Mobile push → approval panel |
| SLA badge | "Due in 6 hours" |

### Digest Mode

Approvers opt into daily digest vs realtime — configurable in user settings.

### Bangladesh Context

- Email + in-app primary
- SMS/WhatsApp for urgent escalation (via Settings plugins — bKash era ops teams)

---

## 15. Future Compatibility

Industry-agnostic policies and chains — modules register; industries extend matrices.

### Module Approval Map

| Module | Example Policies | Doc |
|--------|------------------|-----|
| **Catalog / Products** | Price change, publish, archive | [PRODUCT_MASTER](../subsystems/PRODUCT_MASTER_ARCHITECTURE.md) |
| **Inventory** | Adjustment, transfer, batch recall | [INVENTORY_WORKFLOW](../../03-business-modules/inventory/INVENTORY_WORKFLOW.md) |
| **Purchase** | PO, RFQ award, bill exception, return | [PURCHASE_WORKFLOW](../../03-business-modules/purchase/PURCHASE_WORKFLOW.md) |
| **Sales** | SO discount, credit limit, refund, credit note | [SALES_WORKFLOW](../../03-business-modules/sales/SALES_WORKFLOW.md) |
| **Ecommerce** | Manual discount, refund, high-value order | [orders/ARCHITECTURE](../../03-business-modules/ecommerce/orders/ARCHITECTURE.md) |
| **CRM** | Opportunity won, stage skip | [CRM_MODULE](../../03-business-modules/crm/CRM_MODULE_ARCHITECTURE.md) |
| **Finance** | Expense, journal entry, payment run | Planned |
| **HR** | Leave, hire, salary change | Planned |
| **Hospital** | Admission, procedure, formulary | Planned |
| **School** | Enrollment waiver, fee discount | Planned |
| **Restaurant** | Void comp, manager discount | Planned |
| **Real Estate** | Commission override, deal discount | Planned |
| **NGO** | Grant disbursement, project spend | Planned |

### Extension Pattern

```text
Core Approval Engine (unchanged)
     +
Industry Policy Pack (seed on install)
     +
Approval Matrix dimensions (department, grant_code, property_type)
     =
Hospital admission approval without engine fork
```

### Future Capabilities

| Capability | Phase |
|------------|-------|
| E-signature step (DocuSign) | v2.0 |
| External approver (email token) | v1.1 |
| HR calendar auto-delegation | v1.1 |
| Approval analytics dashboard | v1.0 |
| Blockchain audit hash (regulated) | v2.0 |
| Voice approve (mobile) | v2.0 |

### Architecture Rules

| # | Rule |
|---|------|
| 1 | **Platform-level** — one engine, all modules |
| 2 | **Policy-driven** — no hardcoded approvers in module code |
| 3 | **Workflow integration** — approvals block transitions |
| 4 | **Activity native** — every decision in timeline |
| 5 | **SoD enforced** — submitter ≠ approver (configurable) |
| 6 | **Delegation first-class** — OOO without stall |
| 7 | **Escalation with SLA** — no infinite pending |
| 8 | **AI assist, not auto-approve** — human gate default |
| 9 | **One inbox** — all modules |
| 10 | **Immutable history** — compliance-ready |
| 11 | **Tenant customizable** — policies in Control Center |
| 12 | **Documentation before code** — [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) |

### Anti-Patterns (Forbidden)

```text
❌ purchase_orders.approved_by_user_id without approval_steps
❌ Module-specific approval inbox UI
❌ Email-only approval with no engine record
❌ Auto-approve PO > threshold via AI without policy
❌ Approver = submitter on financial documents
❌ Skip escalation — infinite pending
❌ Per-industry approval_engine copy
```

---

## Appendix A — Domain Events

| Event | When | Consumers |
|-------|------|-----------|
| `core.approval.requested` | Request created | Notification, Activity |
| `core.approval.step_assigned` | Step pending | Notification |
| `core.approval.step_approved` | Step approved | Workflow Engine, Activity |
| `core.approval.step_rejected` | Step rejected | Workflow Engine, Activity |
| `core.approval.completed` | All steps approved | Workflow unblock |
| `core.approval.rejected` | Any rejection final | Workflow reject transition |
| `core.approval.escalated` | SLA breach | Notification |
| `core.approval.delegated` | Delegate assigned | Notification |
| `core.approval.cancelled` | Submitter cancel | Workflow, Activity |
| `core.approval.ai_scored` | AI risk computed | Inbox UI |

---

## Appendix B — YAML Policy Example

```yaml
policy_id: sales.order.discount
module: sales
model: sales_orders
workflow_transition: confirm

conditions:
  - if:
      field: record.discount_percent
      operator: lte
      value: 5
    chain: null  # auto-approve path — no approval chain

  - if:
      field: record.discount_percent
      operator: between
      value: [5, 10]
    chain: sales_discount_l1
    chain_steps:
      - level: l1_manager
        resolver: manager_of_submitter

  - if:
      field: record.discount_percent
      operator: gt
      value: 10
    chain: sales_discount_l2
    chain_steps:
      - level: l1_manager
        resolver: manager_of_submitter
      - level: l4_finance
        resolver: role
        role: finance_controller

sod:
  block_submitter: true

escalation:
  timeout_hours: 48
  escalate_to_level: l2_dept_head
  reminders: [24, 40]
```

---

## Appendix C — API Surface (Planned)

Base: `/api/v1/core/approvals/`

| Group | Endpoints |
|-------|-----------|
| Requests | `POST /requests`, `GET /requests/{id}`, `POST /requests/{id}/cancel` |
| Actions | `POST /steps/{id}/approve`, `POST /steps/{id}/reject`, `POST /steps/{id}/comment` |
| Inbox | `GET /inbox/pending`, `GET /inbox/history` |
| Delegation | `GET/POST /delegates`, `DELETE /delegates/{id}` |
| Policies | `GET/POST /policies` (admin) |
| Chains | `GET/POST /chains` (admin) |
| Analytics | `GET /analytics/sla`, `GET /analytics/by-module` |
| AI | `GET /requests/{id}/ai-insights` |

Headers: `Authorization`, `X-Company-Id`, `Idempotency-Key` (on approve/reject).

---

## Appendix D — Related Documents

| Document | Relationship |
|----------|--------------|
| [WORKFLOW_ENGINE_ARCHITECTURE.md](./WORKFLOW_ENGINE_ARCHITECTURE.md) | Transition blocking |
| [ACTIVITY_CHATTER_ARCHITECTURE.md](../subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) | Timeline |
| [WORKFLOW_REGISTRY.md](../../00-foundation/registries/WORKFLOW_REGISTRY.md) | Registered workflows |
| [INVENTORY_WORKFLOW.md](../../03-business-modules/inventory/INVENTORY_WORKFLOW.md) | Adjustment approval |
| [PURCHASE_WORKFLOW.md](../../03-business-modules/purchase/PURCHASE_WORKFLOW.md) | PO approval |
| [SALES_WORKFLOW.md](../../03-business-modules/sales/SALES_WORKFLOW.md) | SO/refund approval |
| [CRM_MODULE_ARCHITECTURE.md](../../03-business-modules/crm/CRM_MODULE_ARCHITECTURE.md) | Opportunity gates |
| [PRODUCT_MASTER_ARCHITECTURE.md](../subsystems/PRODUCT_MASTER_ARCHITECTURE.md) | Product publish |
| [modules/ai/AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) | AI assistant |
| [approval-engine.md](./approval-engine.md) | Legacy draft |

---

## Document Control

| Field | Value |
|-------|-------|
| **Owner** | Platform Team · Core Engines |
| **Reviewers** | Architecture, Finance, HR, all module leads |
| **Next Review** | At approval engine implementation gate |
| **Status Gate** | Documentation First — Ready for UI/UX Planning |

**Changelog:** [CHANGELOG.md](../../00-foundation/CHANGELOG.md)
