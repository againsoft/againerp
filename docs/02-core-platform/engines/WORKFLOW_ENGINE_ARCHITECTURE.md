# AgainERP — Workflow Engine Architecture

> **Status:** Approved  
> **Version:** 1.0  
> **Owner:** Core Platform  
> **Document Type:** Enterprise Architecture  
> **Phase:** Documentation First · UI/UX Planning  
> **Layer:** Platform (not module-level)  
> **Governance:** [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · **Standards:** [DEVELOPMENT_STANDARDS.md](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md)

## Purpose
Core engine specification: WORKFLOW ENGINE ARCHITECTURE.

## When To Read
Read only when working on the WORKFLOW ENGINE ARCHITECTURE engine or its consumers.

## Related Files
- [Core hub](../ARCHITECTURE.md)
- [Engines index](README.md)

## Read Next
- [Core hub](../ARCHITECTURE.md)

---

**No backend code. No database implementation. No API implementation.**  
This document is the source of truth for **AgainERP's reusable Workflow Engine** — one platform-level state machine used by every module.

### Step 09 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Platform-level reusable engine | §1 · §2 |
| All modules (Ecommerce → Restaurant) | §17 |
| Core components through instances | §3–§11 |
| Activity, Approval, AI integration | §12 · §13 · §14 |
| Workflow Builder UI | §15 |
| Permissions | §16 |
| Drag & drop, multi-state, conditional routing, analytics | §4 · §6 · §8 · §15 |

**Related:** [WORKFLOW_REGISTRY.md](../../00-foundation/registries/WORKFLOW_REGISTRY.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) · [APPROVAL_ENGINE_ARCHITECTURE.md](./APPROVAL_ENGINE_ARCHITECTURE.md) · [INVENTORY_WORKFLOW.md](../../03-business-modules/inventory/INVENTORY_WORKFLOW.md) · [PURCHASE_WORKFLOW.md](../../03-business-modules/purchase/PURCHASE_WORKFLOW.md) · [SALES_WORKFLOW.md](../../03-business-modules/sales/SALES_WORKFLOW.md) · [CRM_MODULE_ARCHITECTURE.md](../../03-business-modules/crm/CRM_MODULE_ARCHITECTURE.md)

---

## Executive Summary

The **Workflow Engine** is AgainERP's **universal state machine** — the single Core service that governs how business records move from Draft to Done across Ecommerce, Inventory, Purchase, Sales, CRM, Marketing, Finance, and future industries.

| Principle | Rule |
|-----------|------|
| **One engine** | All modules register workflows — no per-module state columns |
| **Declarative** | States, transitions, conditions defined in config/DB |
| **Event-driven** | Every transition emits `core.workflow.*` + module events |
| **Auditable** | Immutable instance history + Activity integration |
| **Approval-native** | Transitions can require Approval Engine completion |
| **AI-assisted** | Conditions and routing can use AI recommendations |
| **Builder UI** | Drag-and-drop workflow designer in Control Center |

**Table namespace:** `workflow_*` · **API base:** `/api/v1/core/workflows/`

---

## 1. Purpose

### Why a Platform Workflow Engine Exists

Every module in AgainERP has documents that change state — orders, POs, invoices, leads, admissions, menu approvals. Without a shared engine:

| Problem | Impact |
|---------|--------|
| Each module invents `status` enums | Inconsistent UX, duplicate code |
| Approval logic scattered | SoD violations, audit gaps |
| No cross-module analytics | Cannot measure cycle time platform-wide |
| AI cannot reason about state | Agents operate on siloed flags |
| History lost in ad-hoc logs | Compliance failure |

The Workflow Engine provides **one contract** for state, transition, guard, action, history, and event — consumed by all modules.

### What the Engine Owns

| Owns | Does Not Own |
|------|--------------|
| State machine definition | Business document fields (module tables) |
| Current instance state | Domain calculations (inventory qty, invoice total) |
| Transition execution | GL posting (Finance) |
| Guard evaluation | Email send (Marketing) |
| Action dispatch hooks | Approval decision UI (Approval Engine renders) |
| Instance history | Module-specific line items |

### Consumer Modules

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    WORKFLOW ENGINE (Core Platform)                       │
│   Definition · Instance · Transition · Condition · Action · History   │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
    ┌───────────┬───────────┬───────┴───────┬───────────┬───────────┐
    ▼           ▼           ▼               ▼           ▼           ▼
 Ecommerce   Inventory   Purchase        Sales        CRM      Marketing
    │           │           │               │           │           │
    └───────────┴───────────┴───────────────┴───────────┴───────────┘
                                    │
                    Finance · Hospital · School · Restaurant · …
```

---

## 2. Workflow Engine Vision

### Vision Statement

> **Define once. Run everywhere. Every transition audited. Every module aligned.**

The Workflow Engine turns business process into **declarative configuration** — admins and implementers design flows in a visual builder; developers register hooks; AI suggests optimizations; Activity captures every step.

### Design Goals

| Goal | Target |
|------|--------|
| **Reusability** | Same engine for PO, SO, lead, patient admission |
| **Multi-state** | Linear, branching, parallel, loop-back |
| **Conditional routing** | Amount, role, field, AI score → different path |
| **Zero custom status columns** | `workflow_instances.current_state_id` is truth |
| **Sub-100ms transition** | Guard eval + action dispatch |
| **10M+ instance logs** | Partitioned by year |
| **Tenant isolation** | `company_id` on all definitions and instances |

### Canonical Example

Every module recognizes this pattern:

```text
Draft
  ↓
Pending Approval
  ↓
Approved
  ↓
Completed
```

Applied per domain:

| Module | Document | Draft | Pending Approval | Approved | Completed |
|--------|----------|-------|------------------|----------|-----------|
| Purchase | PO | draft | pending_approval | approved | closed |
| Sales | Quotation | draft | negotiation | approved | so_created |
| Catalog | Product | draft | pending_approval | published | — |
| CRM | Opportunity | new | — | qualified | won |
| Hospital | Admission | requested | pending_approval | approved | discharged |

---

## 3. Core Components

### Component Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         WORKFLOW ENGINE                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  Workflow Registry        │  Catalog of workflow definitions           │
│  State Manager              │  States, types, terminal flags             │
│  Transition Executor        │  Validates + runs transitions              │
│  Trigger Dispatcher           │  Manual, event, schedule, AI               │
│  Condition Evaluator        │  Guards, expressions, policies             │
│  Action Runner              │  Side effects (event, notify, field set)   │
│  Instance Store             │  Current state per record                    │
│  History Logger             │  Immutable transition audit                  │
│  Builder API                │  CRUD definitions (Control Center UI)      │
│  Analytics Aggregator       │  Cycle time, bottleneck, conversion          │
└─────────────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
  Activity Engine      Approval Engine         AI OS
  (timeline)           (human gates)           (routing hints)
```

### Core Tables

| Table | Purpose |
|-------|---------|
| `workflows` | Workflow definition header |
| `workflow_versions` | Immutable published versions |
| `workflow_states` | States in a version |
| `workflow_transitions` | Allowed edges between states |
| `workflow_triggers` | What initiates or auto-fires transitions |
| `workflow_conditions` | Guards on transitions |
| `workflow_actions` | Side effects on transition |
| `workflow_instances` | Active state per business record |
| `workflow_instance_logs` | Immutable history |
| `workflow_analytics_snapshots` | Pre-aggregated metrics (optional) |

### Standard Columns

All `workflow_*` tables: `id` (UUID), `company_id`, `created_at`, `updated_at`, `created_by`, `updated_by` per [database/standards.md](../../05-development/database/standards.md).

### Service Boundaries

| Service | Responsibility |
|---------|----------------|
| **WorkflowEngine** | Orchestration — transition API |
| **DefinitionService** | CRUD workflows (admin/builder) |
| **InstanceService** | Get/create instance for record |
| **ConditionService** | Evaluate guards |
| **ActionService** | Execute action hooks |
| **HistoryService** | Append-only log queries |

---

## 4. Workflow Definition

### Workflow Identity

| Field | Notes |
|-------|-------|
| `workflow_id` | Stable slug — e.g. `purchase.order`, `sales.quotation` |
| `name` | Display name — "Purchase Order Lifecycle" |
| `module` | Owner module — `purchase`, `sales`, `crm` |
| `model` | Bound entity — `purchase_orders`, `sales_quotations` |
| `version` | Semver — `1.0.0` |
| `status` | `draft`, `published`, `archived` |
| `is_default` | Default workflow for model (one per company) |
| `description` | Admin help text |

### Registration Pattern

Modules **register** at install or via migration seed — tenants can **clone and customize** in Workflow Builder.

```yaml
workflow_id: purchase.order
module: purchase
model: purchase_orders
version: 1.0.0
initial_state: draft
states: [draft, pending_approval, approved, ordered, partially_received, received, closed, cancelled]
terminal_states: [closed, cancelled]
```

### Multi-Workflow per Model

| Scenario | Pattern |
|----------|---------|
| Retail vs Enterprise PO | Two workflows; `pipeline_id` or `order_type` selects |
| Hospital vs Standard admission | Industry profile picks workflow |
| Company override | Tenant publishes custom version |

### Definition Lifecycle

```text
Draft (builder editing)
  ↓ validate + publish
Published (runtime uses this version)
  ↓ supersede
Archived (read-only; existing instances retain version ref)
```

**Rule:** Running instances pin to `workflow_version_id` — published changes do not retroactively alter in-flight records.

---

## 5. States

### State Model

| Field | Notes |
|-------|-------|
| `state_id` | Slug — `draft`, `pending_approval`, `approved` |
| `name` | Label — "Pending Approval" |
| `workflow_version_id` | FK |
| `state_type` | `initial`, `normal`, `terminal`, `error` |
| `color` | UI badge — gray, amber, green, red |
| `icon` | Optional icon key |
| `sort_order` | Kanban column order |
| `is_terminal` | No outbound transitions (won, lost, cancelled) |
| `sla_hours` | Optional SLA — alert if exceeded |
| `entry_actions[]` | Actions on enter state |
| `exit_actions[]` | Actions on leave state |

### State Types

| Type | Description | Example |
|------|-------------|---------|
| **initial** | Record creation default | `draft`, `new` |
| **normal** | In-progress | `pending_approval`, `reserved` |
| **terminal** | End state — success | `completed`, `closed`, `won` |
| **terminal** | End state — failure | `cancelled`, `lost`, `rejected` |
| **error** | Recoverable failure | `failed` (refund gateway) |

### Multi-State Support

```text
                    ┌─────────────┐
                    │    Draft    │  ← initial
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐  ┌──────────┐
       │ Pending  │ │ On Hold  │  │ Cancelled│  ← terminal
       │ Approval │ └──────────┘  └──────────┘
       └────┬─────┘
            ▼
       ┌──────────┐
       │ Approved │
       └────┬─────┘
            ├──────────────────┐
            ▼                  ▼
     ┌────────────┐      ┌────────────┐
     │ Partially  │      │ Completed  │  ← terminal
     │ Received   │─────▶│            │
     └────────────┘      └────────────┘
```

### Parallel States (Future)

For parallel approval branches — sub-state machine per branch; parent workflow waits for `all_branches_complete` condition.

---
## 6. Transitions

### Transition Model

| Field | Notes |
|-------|-------|
| `transition_id` | Slug — `submit`, `approve`, `ship` |
| `name` | Label — "Submit for Approval" |
| `from_state_id` | Source (nullable for `*` = any) |
| `to_state_id` | Target |
| `workflow_version_id` | FK |
| `permission` | Required — `purchase.order.approve` |
| `button_label` | UI — "Approve" |
| `button_variant` | primary, danger, ghost |
| `requires_comment` | Force reason on transition |
| `requires_approval` | Blocks until Approval Engine completes |
| `approval_policy_id` | FK → approval policy |
| `conditions[]` | Guard list (AND/OR) |
| `actions[]` | Side effects |
| `events[]` | Domain events to emit |
| `sort_order` | UI button order |

### Transition Execution Flow

```text
User/API calls transition(record_id, transition_id)
        │
        ▼
  Load workflow_instance for record
        │
        ▼
  Validate: from_state matches current_state
        │
        ▼
  Evaluate conditions (§8)
        │
        ├── fail → return 422 + core.workflow.failed
        │
        ▼
  Check permission + approval status (§13)
        │
        ├── pending approval → block
        │
        ▼
  Begin transaction
        │
        ├── Update instance.current_state_id
        ├── Run exit actions (from_state)
        ├── Run transition actions (§9)
        ├── Run entry actions (to_state)
        ├── Append workflow_instance_log
        ├── Emit core.workflow.transitioned
        └── Emit module domain events
        │
        ▼
  Commit → return new state + history entry
```

### Example Transitions (Purchase Order)

| Transition | From | To | Permission | Event |
|------------|------|-----|------------|-------|
| `submit` | draft | pending_approval | `purchase.order.create` | `purchase.order.submitted` |
| `approve` | pending_approval | approved | `purchase.order.approve` | `purchase.order.approved` |
| `reject` | pending_approval | draft | `purchase.order.approve` | `purchase.order.rejected` |
| `send` | approved | ordered | `purchase.order.create` | `purchase.order.sent` |
| `receive_partial` | ordered | partially_received | `purchase.receipt.create` | `purchase.order.partially_received` |
| `close` | received | closed | `purchase.order.create` | `purchase.order.closed` |
| `cancel` | draft, pending_approval, approved | cancelled | `purchase.order.cancel` | `purchase.order.cancelled` |

---

## 7. Triggers

### Trigger Types

| Type | Code | Description |
|------|------|-------------|
| **Manual** | `manual` | User clicks transition button |
| **API** | `api` | External system via REST |
| **Event** | `event` | Domain event from bus |
| **Schedule** | `schedule` | Cron — expire quotes, overdue invoices |
| **Webhook** | `webhook` | Inbound HTTP (future) |
| **AI** | `ai` | Agent recommends auto-transition (policy-gated) |
| **Sub-workflow** | `sub_workflow` | Child workflow completion |

### Trigger Model

| Field | Notes |
|-------|-------|
| `trigger_id` | |
| `transition_id` | Which transition to fire |
| `trigger_type` | See above |
| `event_name` | For `event` — `purchase.receipt.completed` |
| `schedule_cron` | For `schedule` — `0 9 * * *` |
| `condition_id` | Optional — only fire if guard passes |
| `is_active` | |

### Event-Triggered Example

```text
Event: purchase.receipt.posted
     ↓
Trigger: receive_partial on purchase.order
     ↓
Condition: qty_received < qty_ordered
     ↓
Transition: ordered → partially_received
```

### Schedule-Triggered Example

```text
Cron: daily 09:00
     ↓
Trigger: expire on sales.quotation
     ↓
Condition: valid_until < today AND state = sent
     ↓
Transition: sent → expired
```

### Manual-Only Rule

High-impact transitions (cancel, write-off, refund) default to **manual only** — no auto-trigger without explicit policy.

---

## 8. Conditions

### Condition Types (Guards)

| Type | Code | Example |
|------|------|---------|
| **Field** | `field` | `record.total > 50000` |
| **Permission** | `permission` | User has `sales.order.approve` |
| **Role** | `role` | User in `finance_controller` |
| **Expression** | `expression` | JSONLogic / safe DSL |
| **Approval** | `approval` | `approval.status = approved` |
| **Related record** | `related` | All receipt lines posted |
| **Inventory** | `inventory` | `qty_available >= line.qty` |
| **Credit** | `credit` | Customer exposure < limit |
| **AI score** | `ai_score` | `churn_risk < 0.7` |
| **Webhook** | `webhook` | External ERP confirm (future) |

### Condition Model

| Field | Notes |
|-------|-------|
| `condition_id` | |
| `transition_id` | FK |
| `condition_type` | |
| `operator` | eq, ne, gt, gte, lt, lte, in, not_in, and, or |
| `field_path` | `record.total`, `record.contact.credit_limit` |
| `value` | JSON literal or policy ref |
| `logic_group` | AND group ID for composite guards |
| `error_message` | User-facing block reason |

### Conditional Routing

Branch to **different target states** based on conditions:

```text
Transition: submit (from draft)

  IF record.total <= 50000
    → to_state: approved        (auto-approve path)

  ELSE IF record.total <= 200000
    → to_state: pending_approval  (L1 manager)

  ELSE
    → to_state: pending_approval  + approval_policy: dual_finance
```

Implemented as **multiple transitions** sharing the same `transition_id` + `priority` + mutually exclusive conditions — first match wins.

### Condition Evaluation Order

```text
1. Permission check (fast fail)
2. Terminal state guard (cannot leave terminal)
3. Field/expression conditions
4. Approval gate
5. External service conditions (inventory, credit — async cache)
6. AI score conditions (optional, cached)
```

---

## 9. Actions

### Action Types

| Type | Code | Description |
|------|------|-------------|
| **Emit event** | `emit_event` | Publish domain event |
| **Set field** | `set_field` | Update record field |
| **Notify** | `notify` | Core notification |
| **Create task** | `create_task` | CRM task / activity |
| **Start approval** | `start_approval` | Approval Engine request |
| **Call webhook** | `webhook` | HTTP POST (future) |
| **Run script** | `script` | Sandboxed hook (future) |
| **AI log** | `ai_log` | Record AI context for audit |

### Action Model

| Field | Notes |
|-------|-------|
| `action_id` | |
| `transition_id` or `state_id` | On transition or enter/exit state |
| `action_type` | |
| `config` | JSON — event name, field map, template ID |
| `run_order` | Sequential execution |
| `on_failure` | `rollback`, `continue`, `block` |

### Example Actions (Sales Order → Reserved)

```yaml
transition: reserve
from: confirmed
to: reserved
actions:
  - type: emit_event
    config:
      event: sales.order.reserved
  - type: emit_event
    config:
      event: inventory.reservation.created
    module_hook: inventory  # delegates to Inventory service
  - type: notify
    config:
      template: order.reserved
      recipients: [record.assigned_user_id]
  - type: set_field
    config:
      field: reserved_at
      value: "{{now}}"
```

### Action Execution Rules

| Rule | Detail |
|------|--------|
| **Idempotent** | Same transition_id + record_id + idempotency key → no double run |
| **Ordered** | Actions run in `run_order`; failure policy per action |
| **No GL in engine** | Finance posting via module event consumer |
| **No stock in engine** | Inventory via module event — engine emits, Inventory executes |

---

## 10. Workflow Instances

### Instance Model

| Field | Notes |
|-------|-------|
| `id` | Instance UUID |
| `workflow_version_id` | Pinned definition version |
| `workflow_id` | Denormalized slug |
| `model` | `purchase_orders` |
| `record_id` | UUID of business record |
| `company_id` | Tenant |
| `current_state_id` | Active state |
| `entered_state_at` | For SLA tracking |
| `started_at` | Instance created |
| `completed_at` | Terminal state reached |
| `context` | JSON — cached eval context (optional) |
| `approval_id` | Active approval FK (if blocked) |

### Instance Lifecycle

```text
Record created (purchase_orders INSERT)
     ↓
WorkflowEngine.create_instance(model, record_id, workflow_id)
     ↓
current_state = initial_state (draft)
     ↓
... transitions ...
     ↓
current_state = terminal (closed)
     ↓
completed_at = now (instance read-only for transitions)
```

### One Instance per Record

| Rule | Detail |
|------|--------|
| **1:1** | One active instance per `(model, record_id)` |
| **Re-open** | Terminal → normal requires explicit `reopen` transition + policy |
| **Sub-workflow** | Child instance linked via `parent_instance_id` (future) |

### API

```text
POST   /api/v1/core/workflows/instances
       { model, record_id, workflow_id? }

GET    /api/v1/core/workflows/instances/{id}

GET    /api/v1/core/workflows/instances/by-record/{model}/{record_id}

POST   /api/v1/core/workflows/instances/{id}/transition
       { transition_id, comment?, idempotency_key? }

GET    /api/v1/core/workflows/instances/{id}/available-transitions
       → filtered by permission + conditions for current user
```

---

## 11. Workflow History

### History Model

**Table:** `workflow_instance_logs` — append-only, partitioned by `created_at` year

| Field | Notes |
|-------|-------|
| `id` | Log entry UUID |
| `instance_id` | FK |
| `transition_id` | Which transition fired |
| `from_state_id` | |
| `to_state_id` | |
| `actor_user_id` | Who triggered |
| `actor_type` | `user`, `system`, `schedule`, `ai` |
| `comment` | Optional reason |
| `condition_results` | JSON — guard eval snapshot |
| `action_results` | JSON — action outcomes |
| `approval_id` | If approval was involved |
| `duration_ms` | Transition execution time |
| `created_at` | Immutable timestamp |

### History Guarantees

| Guarantee | Implementation |
|-----------|----------------|
| **Immutable** | No UPDATE/DELETE on logs |
| **Complete** | Every successful and failed attempt logged |
| **Replay-safe** | `condition_results` enables audit replay |
| **Compliance** | SoD — actor ≠ approver logged separately in Approval Engine |

### Query Patterns

| Query | Use Case |
|-------|----------|
| By record | Activity timeline embed |
| By user | "My transitions today" |
| By workflow | Analytics — avg time in state |
| By date range | Compliance export |
| Failed attempts | Debug guard blocks |

### UI: History Timeline

Embedded in Activity drawer and record detail:

```text
2026-06-13 14:22  Jane Doe  submit     draft → pending_approval
2026-06-13 15:01  Bob Manager approve  pending_approval → approved
2026-06-13 15:02  System    send       approved → ordered  (event-triggered)
```

---

## 12. Activity Integration

Integrates [Activity & Chatter Architecture](../subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md).

### Activity on Every Transition

| Event | Activity Type | Entity |
|-------|---------------|--------|
| Transition success | `status_change` | Module entity — `purchase:order:{id}` |
| Transition blocked | `workflow_blocked` | Same + reason |
| Approval required | `approval_change` | Same |
| AI suggested transition | `ai_action` | Same |

### Entity Pattern

```text
workflow:instance:{instance_id}     ← engine-level (admin debug)
purchase:order:{record_id}            ← module-level (user timeline)
```

Module Activity shows **business-friendly** labels; engine log retains technical detail.

### Cross-Link

```text
workflow_instance_log.id  →  activity.reference_id
activity.entity_id        →  purchase:order:{record_id}
```

### Tracked Operations

| Operation | Activity |
|-----------|----------|
| State change | `status_change` with from/to labels |
| Assignment via action | `assignment_change` |
| Comment on transition | Attached to log entry |
| Failed guard | `workflow_blocked` with error_message |

---

## 13. Approval Integration

Integrates [Approval Engine](./APPROVAL_ENGINE_ARCHITECTURE.md).

### Approval as Transition Guard

```text
Transition: approve (pending_approval → approved)
  requires_approval: true
  approval_policy_id: purchase.po.approval_threshold
        │
        ▼
  Approval Engine creates approval request
        │
        ├── steps: L1 Manager → L2 Finance (if amount > threshold)
        │
        ▼
  Transition BLOCKED until approval.status = approved
        │
        ▼
  On approval complete → auto-fire transition OR user clicks Approve
```

### Approval Types Supported

| Type | Use Case |
|------|----------|
| **Single** | One manager |
| **Sequential** | Manager → Director → CFO |
| **Parallel** | Any 2 of 3 |
| **Conditional** | Amount dimension adds steps |
| **Matrix** | Category × amount → approver |

### Separation of Duties

| Rule | Enforcement |
|------|-------------|
| Creator ≠ approver | Condition on `actor_user_id != record.created_by` |
| Receiver ≠ bill approver | Purchase SoD policy |
| Transition actor ≠ last approver | Approval Engine validates |

### Events

| Event | When |
|-------|------|
| `core.approval.requested` | Transition blocked for approval |
| `core.approval.completed` | Unblocks transition |
| `core.approval.rejected` | Fires reject transition or returns to draft |

---

## 14. AI Integration

Integrates [AI OS Architecture](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md).

### AI in the Workflow Engine

| Capability | Role |
|------------|------|
| **Routing recommendation** | Suggest next transition — "likely to win → skip to negotiation" |
| **Condition assist** | Pre-evaluate credit/churn before user submits |
| **Anomaly detection** | Flag unusual transition pattern — fraud hold |
| **SLA prediction** | Predict overdue in state — notify early |
| **Workflow optimization** | Analytics → "bottleneck at pending_approval 3.2 days avg" |
| **Auto-transition (policy)** | Low-risk leads auto `contacted` (tenant opt-in) |

### AI Trigger Type

```yaml
trigger:
  type: ai
  transition: qualify
  condition:
    type: ai_score
    field: lead_score
    operator: gte
    value: 80
  policy: require_human_confirm  # default
```

### AI Governance

| # | Rule |
|---|------|
| 1 | AI never auto-transitions high-value docs without policy |
| 2 | All AI-triggered transitions log `actor_type: ai` |
| 3 | Suggestion ≠ execution — review queue by default |
| 4 | Prompt version stored in `action_results` |
| 5 | Tenant AI budget enforced |

### AI Recommendations UI

Workflow Builder and record detail show:

- **Suggested next action** — "Approve — 92% win probability"
- **Risk flag** — "Hold — churn risk elevated"
- **Bottleneck hint** — "Avg 4d in this state — add approver?"

---

## 15. Workflow Builder UI

**Route:** `/control-center/workflows` (Control Center layer)

### Purpose

Visual **drag-and-drop** designer for tenant admins and implementers — no code required for most flows.

### Features

| Feature | Description |
|---------|-------------|
| **Drag & drop canvas** | States as nodes; transitions as edges |
| **Multi-state workflows** | Unlimited states per version |
| **Conditional routing** | Edge labels show guard summary |
| **Transition editor** | Permission, approval, actions, events panel |
| **State editor** | Color, SLA, entry/exit actions |
| **Trigger editor** | Event, schedule, manual binding |
| **Test simulator** | Dry-run guards against sample record |
| **Version publish** | Draft → published with diff view |
| **Clone from template** | Module seed workflows as starting point |
| **Import/export** | JSON/YAML for cross-environment |

### Builder Layout

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Workflow: purchase.order v1.2        [Validate] [Publish] [Simulate]│
├──────────────────────────────┬──────────────────────────────────────────┤
│  CANVAS (React Flow)          │  INSPECTOR                               │
│                               │  Selected: pending_approval              │
│   [Draft]──submit──▶[Pending  │  Transitions out:                        │
│    Approval]──approve──▶      │   • approve → approved                   │
│   [Approved]──send──▶[Ordered] │    Permission: purchase.order.approve    │
│                               │    Approval: L1 + L2 if > ৳50K           │
│                               │    Events: purchase.order.approved         │
├──────────────────────────────┴──────────────────────────────────────────┤
│  Palette: + State  + Transition  + Condition  + Trigger  + Action        │
└─────────────────────────────────────────────────────────────────────────┘
```

### Workflow Analytics (Builder + Dashboard)

| Metric | Description |
|--------|-------------|
| **Avg time in state** | Bottleneck detection |
| **Transition count** | Volume by transition |
| **Conversion rate** | draft → approved → closed |
| **SLA breach %** | States exceeding `sla_hours` |
| **Approval wait time** | Pending approval duration |
| **Failed guard rate** | Top block reasons |
| **AI suggestion acceptance** | AI vs human transition ratio |

**Route:** `/control-center/workflows/analytics`

---

## 16. Permissions

Namespace: `core.workflow.*` + module transition permissions

### Platform Permissions

| Permission | Description |
|------------|-------------|
| `core.workflow.view` | View definitions and instances |
| `core.workflow.manage` | Create/edit definitions (builder) |
| `core.workflow.publish` | Publish versions |
| `core.workflow.transition` | Execute transitions (global — usually module perm) |
| `core.workflow.analytics` | View workflow analytics |
| `core.workflow.export` | Export definitions |
| `core.workflow.simulate` | Dry-run simulator |

### Module Transition Permissions

Each transition declares required permission — e.g. `purchase.order.approve`. Module permissions gate **who can click**; engine gates **whether transition is valid**.

### Record Rules

| Rule | Application |
|------|-------------|
| `assigned_user_id = me` | CRM, Sales rep scope |
| `branch_id IN user.branches` | Multi-branch |
| `company_id = tenant` | Mandatory isolation |

### Control Center Access

Workflow Builder restricted to:

- Super Admin
- Company Admin with `core.workflow.manage`
- Implementer role (partner)

---

## 17. Future Compatibility

The Workflow Engine is **industry-agnostic** — modules register workflows; industries add templates.

### Module Workflow Map

| Module | Example Workflows | Doc |
|--------|-------------------|-----|
| **Ecommerce** | `commerce.order`, `catalog.product`, `commerce.return` | [orders/ARCHITECTURE](../../03-business-modules/ecommerce/orders/ARCHITECTURE.md) |
| **Inventory** | `inventory.transfer`, `inventory.adjustment`, … | [INVENTORY_WORKFLOW](../../03-business-modules/inventory/INVENTORY_WORKFLOW.md) |
| **Purchase** | `purchase.order`, `purchase.rfq`, `purchase.bill` | [PURCHASE_WORKFLOW](../../03-business-modules/purchase/PURCHASE_WORKFLOW.md) |
| **Sales** | `sales.order`, `sales.quotation`, `sales.invoice` | [SALES_WORKFLOW](../../03-business-modules/sales/SALES_WORKFLOW.md) |
| **CRM** | `crm.lead`, `crm.opportunity`, `crm.task` | [CRM_MODULE](../../03-business-modules/crm/CRM_MODULE_ARCHITECTURE.md) |
| **Marketing** | `marketing.campaign`, `marketing.automation` | Planned |
| **Finance** | `accounting.invoice`, `accounting.payment`, `accounting.journal` | Planned |
| **Hospital** | `hospital.admission`, `hospital.discharge`, `hospital.lab_order` | Planned |
| **School** | `school.enrollment`, `school.fee`, `school.attendance` | Planned |
| **Restaurant** | `restaurant.table`, `restaurant.kot`, `restaurant.reservation` | Planned |

### Industry Extension Pattern

```text
Core Workflow Engine (unchanged)
     +
Industry Workflow Template Pack (seed on install)
     +
Custom fields on module record (profile metadata)
     =
Hospital admission workflow without engine fork
```

### Future Engine Capabilities

| Capability | Phase |
|------------|-------|
| Parallel approval branches | v1.1 |
| Sub-workflows (child instances) | v1.2 |
| BPMN import/export | v2.0 |
| Webhook actions | v1.1 |
| Sandbox script actions | v2.0 |
| Cross-record saga orchestration | v2.0 |

### Architecture Rules

| # | Rule |
|---|------|
| 1 | **Platform-level** — one engine, all modules |
| 2 | **No module status columns** — instance is truth (module may cache denormalized label) |
| 3 | **Declarative definitions** — builder + YAML seed |
| 4 | **Event-driven actions** — side effects via events, not direct cross-module writes |
| 5 | **Approval native** — transitions integrate Approval Engine |
| 6 | **Activity native** — every transition in timeline |
| 7 | **AI assisted** — routing hints, not silent auto-post |
| 8 | **Version pinned instances** — publish does not break in-flight |
| 9 | **Tenant customizable** — clone seed, publish own version |
| 10 | **Multi-industry ready** — templates, not forks |
| 11 | **Analytics built-in** — cycle time, bottleneck, conversion |
| 12 | **Documentation before code** — [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) |

### Anti-Patterns (Forbidden)

```text
❌ purchase_orders.status ENUM managed only in Purchase module code
❌ Per-module WorkflowEngine copy
❌ Transition without history log
❌ Approval bypass via direct SQL state update
❌ AI auto-approve PO > threshold without policy
❌ hospital_admission_status column bypassing engine
❌ Module-specific builder UIs (use Control Center builder)
```

---

## Appendix A — Domain Events

### Core Events

| Event | When |
|-------|------|
| `core.workflow.instance.created` | Instance bound to record |
| `core.workflow.transitioned` | Successful transition |
| `core.workflow.failed` | Guard/permission/approval block |
| `core.workflow.completed` | Terminal state reached |
| `core.workflow.sla_breach` | State exceeded sla_hours |
| `core.workflow.version.published` | New definition published |

### Module Events (Examples)

Module transitions emit **both** `core.workflow.transitioned` and module-specific events — see [WORKFLOW_REGISTRY.md](../../00-foundation/registries/WORKFLOW_REGISTRY.md).

---

## Appendix B — YAML Definition Example

```yaml
workflow_id: sales.order
module: sales
model: sales_orders
version: 1.0.0
initial_state: draft

states:
  - id: draft
    name: Draft
    type: initial
    color: gray
  - id: confirmed
    name: Confirmed
    color: blue
  - id: pending_approval
    name: Pending Approval
    color: amber
  - id: approved
    name: Approved
    color: green
  - id: reserved
    name: Reserved
    color: teal
  - id: packed
    name: Packed
    color: indigo
  - id: shipped
    name: Shipped
    color: purple
  - id: delivered
    name: Delivered
    color: green
  - id: closed
    name: Closed
    type: terminal
    color: slate
  - id: cancelled
    name: Cancelled
    type: terminal
    color: red

transitions:
  - id: confirm
    from: draft
    to: confirmed
    permission: sales.order.create
    conditions:
      - type: credit
        operator: lte
        field: exposure
        value: "{{record.contact.credit_limit}}"
    events: [sales.order.confirmed]

  - id: submit_approval
    from: confirmed
    to: pending_approval
    permission: sales.order.create
    conditions:
      - type: field
        field: record.discount_percent
        operator: gt
        value: 5
    requires_approval: true
    approval_policy: sales.order.discount_approval_threshold

  - id: auto_approve
    from: confirmed
    to: approved
    permission: sales.order.create
    conditions:
      - type: field
        field: record.discount_percent
        operator: lte
        value: 5
    priority: 2

  - id: approve
    from: pending_approval
    to: approved
    permission: sales.order.approve
    events: [sales.order.approved]

  - id: reserve
    from: approved
    to: reserved
    permission: sales.order.confirm
    actions:
      - type: emit_event
        config: { event: sales.order.reserved }
      - type: emit_event
        config: { event: inventory.reservation.created }
    events: [sales.order.reserved]

  - id: pack
    from: reserved
    to: packed
    permission: sales.shipment.create

  - id: ship
    from: [reserved, packed]
    to: shipped
    permission: sales.shipment.create
    events: [sales.shipment.shipped, inventory.stock_out.shipped]

  - id: deliver
    from: shipped
    to: delivered
    permission: sales.shipment.create
    events: [sales.shipment.delivered]

  - id: close
    from: delivered
    to: closed
    permission: sales.order.create
    events: [sales.order.closed]

  - id: cancel
    from: [draft, confirmed, approved, reserved]
    to: cancelled
    permission: sales.order.cancel
    requires_comment: true
    events: [sales.order.cancelled]

triggers:
  - type: schedule
    cron: "0 0 * * *"
    transition: expire
    workflow_id: sales.quotation
    condition:
      field: record.valid_until
      operator: lt
      value: "{{today}}"
```

---

## Appendix C — API Surface (Planned)

Base: `/api/v1/core/workflows/`

| Group | Endpoints |
|-------|-----------|
| Definitions | `GET/POST /definitions`, `POST /definitions/{id}/publish` |
| States | `GET/POST /definitions/{id}/states` |
| Transitions | `GET/POST /definitions/{id}/transitions` |
| Instances | `GET/POST /instances`, `GET /instances/by-record/{model}/{id}` |
| Execute | `POST /instances/{id}/transition`, `GET /instances/{id}/available-transitions` |
| History | `GET /instances/{id}/logs` |
| Analytics | `GET /analytics/by-workflow`, `GET /analytics/bottlenecks` |
| Builder | `POST /builder/validate`, `POST /builder/simulate` |

Headers: `Authorization`, `X-Company-Id`, `Idempotency-Key` (on transition).

---

## Appendix D — Related Documents

| Document | Relationship |
|----------|--------------|
| [WORKFLOW_REGISTRY.md](../../00-foundation/registries/WORKFLOW_REGISTRY.md) | All registered workflows |
| [APPROVAL_ENGINE_ARCHITECTURE.md](./APPROVAL_ENGINE_ARCHITECTURE.md) | Human approval gates |
| [ACTIVITY_CHATTER_ARCHITECTURE.md](../subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) | Timeline integration |
| [INVENTORY_WORKFLOW.md](../../03-business-modules/inventory/INVENTORY_WORKFLOW.md) | Inventory state machines |
| [PURCHASE_WORKFLOW.md](../../03-business-modules/purchase/PURCHASE_WORKFLOW.md) | Purchase state machines |
| [SALES_WORKFLOW.md](../../03-business-modules/sales/SALES_WORKFLOW.md) | Sales state machines |
| [CRM_MODULE_ARCHITECTURE.md](../../03-business-modules/crm/CRM_MODULE_ARCHITECTURE.md) | CRM pipelines |
| [modules/ai/AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) | AI routing |
| [SETTINGS_ARCHITECTURE.md](../subsystems/SETTINGS_ARCHITECTURE.md) | Control Center placement |
| [workflow-engine.md](./workflow-engine.md) | Legacy draft |

---

## Document Control

| Field | Value |
|-------|-------|
| **Owner** | Platform Team · Core Engines |
| **Reviewers** | Architecture, all module leads |
| **Next Review** | At workflow engine implementation gate |
| **Status Gate** | Documentation First — Ready for UI/UX Planning |

**Changelog:** [CHANGELOG.md](../../00-foundation/CHANGELOG.md)
