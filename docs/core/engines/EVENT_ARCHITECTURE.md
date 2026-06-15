# AgainERP — Event Architecture

> **Status:** Approved  
> **Version:** 1.0  
> **Owner:** Core Platform  
> **Document Type:** Enterprise Architecture  
> **Phase:** Documentation First  
> **Architecture:** Event Driven Architecture (EDA)  
> **Governance:** [GOVERNANCE.md](../../GOVERNANCE.md) · **Standards:** [DEVELOPMENT_STANDARDS.md](../../DEVELOPMENT_STANDARDS.md)

**No backend code. No database implementation. No API implementation.**  
This document is the source of truth for **AgainERP's platform event system** — domain events, integration events, system events, routing, consumers, history, retry, failure handling, audit, and AI processing.

### Step 16 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Platform event system — EDA | §1 · §2 |
| Event types through Event Bus | §3–§7 |
| Routing, consumers, history | §8–§10 |
| Retry, failure, audit, AI | §11–§14 |
| Example events (ProductCreated, OrderPlaced, …) | §4 · Appendix A |

**Related:** [adr/ADR-006-event-driven.md](../../adr/ADR-006-event-driven.md) · [WORKFLOW_ENGINE_ARCHITECTURE.md](./WORKFLOW_ENGINE_ARCHITECTURE.md) · [DATABASE_REGISTRY.md](../../DATABASE_REGISTRY.md) · [AI_OS_ARCHITECTURE.md](../../modules/ai/AI_OS_ARCHITECTURE.md) · [framework/COMMUNICATION_CONTRACTS.md](../../framework/COMMUNICATION_CONTRACTS.md) · [event-system.md](./event-system.md) (legacy draft)

---

## Executive Summary

The **Event System** is AgainERP's **nervous system** — the platform bus that carries facts between modules after transactions commit, without tight coupling or cross-domain table writes.

| Principle | Rule |
|-----------|------|
| **After commit** | Events publish only after successful DB COMMIT |
| **Single writer** | Publisher owns aggregate; subscribers never UPDATE publisher tables |
| **Async default** | Handlers run on queue — not request thread |
| **Idempotent consumers** | Dedupe by `event.id` |
| **Canonical naming** | `{module}.{entity}.{action}` lowercase |
| **Typed payloads** | Versioned JSON schema per event |
| **Audit everything** | Immutable event history log |
| **AI as consumer** | AI OS subscribes — never bypasses services |

**Table namespace:** `event_*`, `domain_events` · **API base:** `/api/v1/core/events/`

---

## 1. Purpose

### Why a Platform Event System Exists

AgainERP is a modular monolith — Catalog, Sales, Inventory, Finance, CRM, Marketing, and AI OS must react to each other's state changes without importing each other's repositories.

| Problem | Impact |
|---------|--------|
| Direct cross-module SQL | Ownership violations, deadlocks |
| Synchronous call chains | Fragile, slow, hard to scale |
| Hidden side effects in controllers | Untestable, undebuggable |
| Missing audit trail | "Who triggered what?" unknown |
| AI polling database | Ungoverned reads/writes |

The Event System provides **one contract** for publishing facts, routing to consumers, retrying failures, and recording history.

### What the Event System Owns

| Owns | Does Not Own |
|------|--------------|
| Event envelope schema | Business aggregate logic |
| Event bus / outbox | Module domain validation |
| Routing & subscriptions | Workflow state definitions |
| Delivery tracking & retry | Notification template content |
| Event history audit | Analytics fact computation |

### When to Use Events vs Service API

| Pattern | Use |
|---------|-----|
| **Synchronous Service API** | Immediate read; write that needs instant confirmation in same request |
| **Domain Event** | Fact already committed — notify other modules async |
| **Integration Event** | Cross-boundary handoff (Sales → Finance posting) |
| **System Event** | Platform ops — module install, period close, AI task complete |

**ADR:** [ADR-006-event-driven.md](../../adr/ADR-006-event-driven.md)

---

## 2. Event Vision

### Vision Statement

> **Commit the truth once. Let the platform react safely everywhere else.**

Events are **facts about the past** — immutable records that something happened. They are not commands ("please do X") unless explicitly modeled as integration commands with idempotent handlers.

### Event-Driven Architecture Position

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         Module (Domain Owner)                            │
│   Aggregate save → COMMIT → publish domain event                         │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Event Bus (Core Platform)                        │
│   Outbox → Route → Queue → Deliver → History → Retry/DLQ                 │
└───────┬─────────┬─────────┬─────────┬─────────┬─────────────────────────┘
        │         │         │         │         │
        ▼         ▼         ▼         ▼         ▼
    Search   Finance    CRM      Notify    AI OS
    Index    Posting    Timeline  Email     Context
```

### Core Rules

1. **Publisher owns truth** — event reflects committed state only
2. **Subscribers are autonomous** — failure in one does not roll back publisher
3. **At-least-once delivery** — consumers must be idempotent
4. **No event without schema** — registered in event catalog
5. **Company scoped** — every event carries `company_id`
6. **Correlation** — `correlation_id` links workflow, approval, AI task chains

---

## 3. Event Types

Three primary event categories plus internal system events.

| Type | Scope | Publisher | Example |
|------|-------|-----------|---------|
| **Domain Event** | Inside bounded context | Owning module | `catalog.product.created` |
| **Integration Event** | Cross-module handoff | Source module | `sales.invoice.posted` → Finance |
| **System Event** | Platform infrastructure | Core / ops | `core.module.installed` |
| **Webhook Event** | External delivery | Core relay | Outbound HTTP to partner |

### Event Envelope (Canonical)

```json
{
  "id": "evt_01HXYZ...",
  "type": "domain",
  "name": "catalog.product.created",
  "version": 1,
  "company_id": "uuid",
  "branch_id": "uuid|null",
  "actor_id": "uuid|null",
  "actor_type": "user|system|ai",
  "correlation_id": "uuid|null",
  "causation_id": "evt_parent|null",
  "aggregate_type": "catalog.product",
  "aggregate_id": "uuid",
  "timestamp": "2026-06-13T10:00:00.000Z",
  "payload": {
    "product_id": "uuid",
    "sku": "SKU-001",
    "lifecycle_status": "draft"
  },
  "metadata": {
    "source": "catalog-service",
    "trace_id": "otel-trace-id"
  }
}
```

### Display Name vs Canonical Name

| Display (docs/UI) | Canonical (bus) |
|-------------------|-----------------|
| ProductCreated | `catalog.product.created` |
| OrderPlaced | `commerce.order.placed` |
| InvoicePaid | `finance.invoice.paid` |

---

## 4. Domain Events

**Domain events** represent state changes **inside a bounded context** — the owning module publishes; siblings subscribe.

### Naming Convention

```text
{module}.{entity}.{action_past_tense}

Examples:
  catalog.product.created
  catalog.product.updated
  catalog.product.published
  inventory.stock_level.updated
  sales.order.confirmed
  crm.lead.converted
```

### Step 16 Example — Domain Events

| Display | Canonical Event | Publisher | Payload Highlights |
|---------|-----------------|-----------|-------------------|
| **ProductCreated** | `catalog.product.created` | Catalog | `product_id`, `sku`, `status` |
| **ProductUpdated** | `catalog.product.updated` | Catalog | `product_id`, `changed_fields[]` |
| **OrderPlaced** | `commerce.order.placed` | Commerce/Orders | `order_id`, `contact_id`, `grand_total` |
| **OrderShipped** | `sales.shipment.shipped` | Sales | `shipment_id`, `order_id`, `tracking` |
| **InventoryAdjusted** | `inventory.adjustment.posted` | Inventory | `adjustment_id`, `warehouse_id`, `delta_qty` |
| **PurchaseApproved** | `purchase.order.approved` | Purchase | `po_id`, `approved_by`, `amount` |
| **InvoicePaid** | `finance.invoice.paid` | Finance | `invoice_id`, `amount_paid`, `residual` |
| **CustomerCreated** | `core.contact.created` | Core | `contact_id`, `contact_types[]` |

### Domain Event Rules

| Rule | Detail |
|------|--------|
| Emit from **service layer** after COMMIT | Not from controller directly |
| One event per aggregate state change | Avoid event storms — batch if needed |
| Include `aggregate_id` | Consumers fetch detail via API if needed |
| `updated` events include change set | Optional `payload.changed_fields` |
| Workflow transitions emit domain events | Per [WORKFLOW_REGISTRY.md](../../WORKFLOW_REGISTRY.md) |

### Catalog Domain Events

| Event | When |
|-------|------|
| `catalog.product.created` | Product inserted |
| `catalog.product.updated` | Fields changed |
| `catalog.product.submitted` | Sent for approval |
| `catalog.product.published` | Live on channel |
| `catalog.product.archived` | Soft archived |
| `catalog.variant.price_changed` | Price list update |

### Sales / Commerce Domain Events

| Event | When |
|-------|------|
| `commerce.order.placed` | Checkout complete |
| `sales.order.confirmed` | SO confirmed |
| `sales.shipment.shipped` | Goods dispatched |
| `sales.invoice.posted` | Commercial invoice posted |
| `sales.payment.received` | Payment recorded |

### Inventory Domain Events

| Event | When |
|-------|------|
| `inventory.movement.posted` | Stock ledger entry |
| `inventory.adjustment.posted` | Adjustment approved & posted |
| `inventory.stock.below_threshold` | Reorder point breached |
| `inventory.transfer.completed` | Inter-warehouse done |

### CRM / Core Domain Events

| Event | When |
|-------|------|
| `core.contact.created` | CustomerCreated |
| `core.contact.updated` | Profile changed |
| `crm.lead.created` | Web form lead |
| `crm.lead.converted` | Lead → contact/opp |
| `crm.opportunity.won` | Deal closed |

---

## 5. Integration Events

**Integration events** signal **cross-boundary handoffs** — explicit contracts between modules where the consumer performs an action in its own context.

### Domain vs Integration

| Domain Event | Integration Event |
|--------------|-------------------|
| "Invoice was posted" (fact in Sales) | "Post AR journal" (Finance consumes) |
| Same module aggregate | Cross-module reaction |
| May have many subscribers | Usually one primary consumer + side effects |

### Canonical Integration Events

| Event | Publisher | Primary Consumer | Action |
|-------|-----------|------------------|--------|
| `sales.invoice.posted` | Sales | Finance | Create AR open item + journal via posting rule |
| `sales.payment.received` | Sales | Finance | Cash receipt journal |
| `purchase.bill.posted` | Purchase | Finance | AP open item + journal |
| `purchase.receipt.completed` | Purchase | Inventory | Already domain — triggers valuation event to Finance |
| `inventory.cogs.posted` | Inventory | Finance | COGS journal |
| `commerce.order.paid` | Commerce | Finance | Gateway receipt |
| `marketing.coupon.redeemed` | Marketing | Analytics | Attribution fact |
| `approval.approved` | Approvals | Target module | Unblock workflow transition |

### Integration Event Contract

Integration handlers must:

1. Call **consumer module Service API** — not publisher tables
2. Be **idempotent** on `event.id` + business key (`invoice_id`)
3. Emit **downstream domain event** on success (e.g. `finance.journal_entry.posted`)
4. Record failure for retry — never silently drop

```text
sales.invoice.posted
  → FinanceService.handleInvoicePosted(event)
  → finance.ar_invoice created
  → finance.journal_entry.posted (new domain event)
```

---

## 6. System Events

**System events** concern **platform operations** — not business documents.

| Event | Publisher | Purpose |
|-------|-----------|---------|
| `core.module.installed` | Platform | Module registry update |
| `core.module.upgraded` | Platform | Migration complete |
| `core.company.created` | Core | Tenant provision |
| `core.user.invited` | Core | Send invite email |
| `finance.period.closed` | Finance | Block back-post globally |
| `workflow.instance.transitioned` | Workflow | Audit / analytics |
| `approval.request.created` | Approvals | Notify approver |
| `approval.approved` | Approvals | Unblock transition |
| `ai.task.completed` | AI OS | Notify user |
| `search.reindex.requested` | Search | Full index rebuild |
| `event.delivery.failed` | Event Bus | Ops alert |

### System Event Rules

- May lack business `aggregate_id` — use `subject_type` + `subject_id`
- Platform admin visibility — not all tenant users
- Higher retention for compliance categories

---

## 7. Event Bus

The **Event Bus** is the Core platform component that accepts events, persists the outbox, and dispatches to consumers.

### Components

```text
Event Bus
├── Publisher SDK        — module calls EventBus.publish()
├── Transaction Outbox   — same TX as aggregate OR post-commit hook
├── Event Store          — domain_events append-only log
├── Router               — subscription matching
├── Dispatcher           — queue job creation
├── Delivery Tracker     — event_deliveries per consumer
└── Admin API            — replay, audit, DLQ management
```

### Outbox Pattern

```text
BEGIN TRANSACTION
  UPDATE sales_orders SET status = 'confirmed' ...
  INSERT INTO event_outbox (event_envelope_json)
COMMIT
→ Outbox worker reads → moves to domain_events → dispatches
```

**Rule:** Never publish before COMMIT — prevents ghost events on rollback.

### Transport

| Tier | Technology |
|------|------------|
| **Primary queue** | Redis + PostgreSQL `jobs` table |
| **Event log** | PostgreSQL `domain_events` |
| **Future scale** | Kafka / NATS (compatible envelope) |

### Publish API

`EventBus.publish(event_envelope)` — module-internal SDK  
`POST /api/v1/core/events/replay` — admin replay (audited)

---

## 8. Event Routing

**Routing** matches published events to registered consumers.

### Subscription Registry

**Table:** `event_subscriptions`

| Field | Description |
|-------|-------------|
| `subscriber_id` | Module or named consumer |
| `event_pattern` | Exact name or wildcard `catalog.product.*` |
| `consumer_class` | Handler reference |
| `queue` | `default`, `high`, `low`, `finance` |
| `enabled` | Kill switch |
| `company_id` | Null = all tenants (platform) |

### Routing Rules

| Rule | Behavior |
|------|----------|
| **Exact match first** | `catalog.product.created` |
| **Wildcard** | `sales.*` for analytics aggregator |
| **Fan-out** | One event → N subscribers → N delivery rows |
| **Ordered partition** | Same `aggregate_id` → same queue partition (optional ordering) |
| **Priority queue** | Finance posting > search index |
| **Filter** | Subscription JSON filter on payload fields |

### Routing Example — OrderPlaced

```text
commerce.order.placed
  ├─→ inventory.reservation (queue: high)
  ├─→ sales.order.sync (queue: default)
  ├─→ marketing.attribution (queue: low)
  ├─→ search.index (queue: low)
  ├─→ analytics.fact (queue: low)
  └─→ notification.email (queue: default)
```

### Webhook Routing

External subscribers register URL + secret:

`event_pattern` → HTTPS POST with signed payload → retry per §11

---

## 9. Event Consumers

**Consumers** (subscribers) react to events — each is a discrete, idempotent handler.

### Consumer Types

| Type | Description | Example |
|------|-------------|---------|
| **Module handler** | In-process worker class | `FinanceInvoicePostedHandler` |
| **Projection worker** | Updates read model / cache | Search index, dashboard cache |
| **Notification handler** | Triggers email/SMS/push | Order confirmation |
| **AI handler** | Updates context cache, triggers automation | Stock threshold → AI task |
| **Webhook dispatcher** | External HTTP | Partner ERP |
| **Analytics projector** | Writes analytics facts | `analytics_daily_sales` |

### Consumer Contract

```python
class Handler(Protocol):
    async def handle(self, event: EventEnvelope, ctx: ConsumerContext) -> None:
        if await ctx.is_processed(event.id):  # idempotency
            return
        # business logic via Service API only
        await ctx.mark_processed(event.id)
```

### Consumer Registration

Modules register at boot / install:

```yaml
event_subscriptions:
  - event: sales.invoice.posted
    handler: FinanceInvoicePostedHandler
    queue: finance
    idempotent: true
  - event: catalog.product.*
    handler: SearchIndexHandler
    queue: low
```

### Cross-Module Write Prohibition

```text
❌ UPDATE sales_invoices FROM finance handler
✓ FinanceService.createARFromInvoice(invoice_id)
```

---

## 10. Event History

**Event history** is the immutable log of every published event — audit, debug, replay.

### Event Store Entity

**Table:** `domain_events` (append-only)

| Field | Notes |
|-------|-------|
| `id` | Event UUID (also envelope `id`) |
| `name` | Canonical event name |
| `company_id` | Tenant |
| `aggregate_type`, `aggregate_id` | Source aggregate |
| `payload` | JSONB |
| `published_at` | Timestamp |
| `publisher` | Module/service name |

### Delivery History

**Table:** `event_deliveries`

| Field | Notes |
|-------|-------|
| `event_id` | FK domain_events |
| `subscriber_id` | Consumer |
| `status` | pending, processing, delivered, failed, dead_letter |
| `attempts` | Retry count |
| `last_error` | Error message |
| `delivered_at` | Success time |

### Query Patterns

| Use Case | Query |
|----------|-------|
| Debug order flow | Events where `aggregate_id = order_id` |
| Compliance export | By company + date range |
| Replay failed | `event_deliveries.status = dead_letter` |
| Trace correlation | `correlation_id` chain |

### Retention

| Tier | Retention |
|------|-----------|
| Business events | 7 years (configurable) |
| System events | 2 years |
| Delivery logs | 90 days hot → archive |
| AI context events | Per AI audit policy |

### Admin UI

Settings → Platform → Event History — filter, inspect payload, replay (permission: `core.events.replay`)

---

## 11. Retry Strategy

Failed consumer delivery retries with **exponential backoff** — at-least-once semantics.

### Retry Policy

| Attempt | Delay | Queue |
|---------|-------|-------|
| 1 | Immediate | primary |
| 2 | 30 seconds | retry |
| 3 | 2 minutes | retry |
| 4 | 10 minutes | retry |
| 5 | 1 hour | retry |
| 6+ | Dead letter | dlq |

### Retry Rules

| Rule | Detail |
|------|--------|
| **Idempotency required** | Handler checks `event.id` before side effects |
| **Transient vs permanent** | 4xx business validation → DLQ immediately (no retry) |
| **Poison message** | After max attempts → dead letter + alert |
| **Manual replay** | Admin replays from DLQ with audit |
| **Ordering** | Retries preserve per-aggregate order when configured |

### Scheduled Retry Worker

Cron: scan `event_deliveries` where `status=failed` AND `next_retry_at <= now()`

---

## 12. Failure Handling

### Failure Categories

| Category | Example | Action |
|----------|---------|--------|
| **Transient** | Network timeout, DB lock | Retry per §11 |
| **Permanent** | Invalid payload, missing FK | DLQ + alert publisher team |
| **Partial fan-out** | 2 of 5 subscribers fail | Independent retry per delivery row |
| **Publisher failure** | Outbox write failed | Transaction rolled back — no event |
| **Consumer timeout** | Handler > 30s | Retry; consider async chunking |

### Dead Letter Queue (DLQ)

**Table:** `event_dead_letters`

| Field | Notes |
|-------|-------|
| `delivery_id` | Failed delivery |
| `event_id` | Original event |
| `error` | Final error |
| `stack_trace` | Debug (dev/staging) |
| `resolved_at` | Manual fix timestamp |

### Alerting

| Trigger | Notify |
|---------|--------|
| DLQ depth > threshold | Platform ops Slack/email |
| Finance posting failed | Finance admin |
| Retry storm (>100/min) | SRE alert |
| Outbox lag > 5 min | Infrastructure |

### Compensation

Events do not auto-compensate sagas in v1 — failed integration requires:

1. DLQ inspection
2. Manual fix or replay
3. Optional compensating event (e.g. `finance.journal_entry.reversed`)

Future: saga orchestration for multi-step integrations (documented in workflow engine).

---

## 13. Audit Logging

Event system audit integrates Core audit and Activity platform.

### What Gets Audited

| Action | Log |
|--------|-----|
| Event published | `domain_events` row |
| Delivery success/fail | `event_deliveries` |
| Manual replay | `core.audit` + actor |
| Subscription change | Settings audit |
| DLQ resolve | Actor + reason |

### Audit vs Event History

| Event History | Security Audit |
|---------------|----------------|
| All business facts | Admin/ops actions |
| Payload for debug | Who replayed event |
| Tenant-scoped | Platform + tenant |

### Compliance

- Immutable append-only store
- PII in payload — same retention as source entity
- Export for regulator: event name + timestamp + aggregate + hash chain (future)

### Permission

| Key | Purpose |
|-----|---------|
| `core.events.view` | Read event history |
| `core.events.replay` | Replay DLQ (admin) |
| `core.events.manage` | Subscription CRUD |

---

## 14. AI Event Processing

Integrates [AI OS Architecture](../../modules/ai/AI_OS_ARCHITECTURE.md).

### AI as Event Consumer

AI OS **subscribes** to domain events — never polls OLTP tables directly.

| Event | AI Handler | Action |
|-------|------------|--------|
| `catalog.product.created` | SEO automation | Queue AI task — draft meta |
| `catalog.product.published` | SEO automation | Generate schema draft |
| `inventory.stock.below_threshold` | Inventory agent | Reorder suggestion task |
| `crm.lead.created` | CRM agent | Score lead task |
| `commerce.order.placed` | Analytics agent | Update forecast context |
| `sales.invoice.posted` | Finance agent | Anomaly check |
| `docs.updated` | Knowledge engine | Re-embed chunks |

### AI Event Rules

1. **AI handlers are normal consumers** — same retry/DLQ rules
2. **No auto-write on event** — AI produces proposal → approval → service API
3. **`actor_type: ai`** when AI publishes events (rare — task completed)
4. **Automation rules** reference event name as trigger — see `ai_automation_rules`
5. **Rate limits** — AI consumer queue separate `ai` with concurrency cap

### AI Published Events

| Event | When |
|-------|------|
| `ai.action.proposed` | Tool proposal created |
| `ai.action.executed` | Approved proposal applied |
| `ai.task.completed` | Async task done |
| `ai.automation.run` | Rule triggered |

### Event → AI Context Cache

Hot aggregates cache invalidation on events:

`catalog.product.updated` → invalidate product context bundle for `product_id`

---

## Appendix A — Event Catalog (Step 16 Examples)

| Display | Canonical | Type | Publisher |
|---------|-----------|------|-----------|
| ProductCreated | `catalog.product.created` | Domain | Catalog |
| ProductUpdated | `catalog.product.updated` | Domain | Catalog |
| OrderPlaced | `commerce.order.placed` | Domain | Commerce |
| OrderShipped | `sales.shipment.shipped` | Domain | Sales |
| InventoryAdjusted | `inventory.adjustment.posted` | Domain | Inventory |
| PurchaseApproved | `purchase.order.approved` | Domain | Purchase |
| InvoicePaid | `finance.invoice.paid` | Domain | Finance |
| CustomerCreated | `core.contact.created` | Domain | Core |

Full workflow transition mapping: [WORKFLOW_REGISTRY.md § Event Mapping](../../WORKFLOW_REGISTRY.md)

---

## Appendix B — Infrastructure Tables (Registry)

| Table | Layer | Purpose |
|-------|-------|---------|
| `event_outbox` | Infrastructure | Transactional outbox |
| `domain_events` | Infrastructure | Immutable event log |
| `event_subscriptions` | Infrastructure | Routing registry |
| `event_deliveries` | Infrastructure | Per-consumer delivery state |
| `event_dead_letters` | Infrastructure | DLQ |
| `event_replays` | Infrastructure | Manual replay audit |

No DDL in this document — registry only.

---

## Appendix C — API Overview

Base: `/api/v1/core/events/` · Auth: Bearer + `X-Company-Id`

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/` | `core.events.view` |
| GET | `/{event_id}` | `core.events.view` |
| GET | `/deliveries` | `core.events.view` |
| POST | `/replay/{delivery_id}` | `core.events.replay` |
| GET | `/subscriptions` | `core.events.manage` |
| PUT | `/subscriptions/{id}` | `core.events.manage` |

---

## Architecture Rules

| # | Rule |
|---|------|
| 1 | **Publish after COMMIT** — outbox pattern |
| 2 | **Single writer per aggregate** — publisher owns truth |
| 3 | **Consumers idempotent** — dedupe on `event.id` |
| 4 | **No cross-module UPDATE** — service API only |
| 5 | **Registered events only** — catalog before emit |
| 6 | **Canonical naming** — `{module}.{entity}.{action}` |
| 7 | **Company scoped** — every envelope has `company_id` |
| 8 | **AI via bus** — not direct DB |
| 9 | **Failed = visible** — DLQ + alert, never silent drop |
| 10 | **Documentation first** — register in WORKFLOW_REGISTRY + this doc |

### Anti-Patterns (Forbidden)

```text
❌ publish() before transaction commit
❌ Subscriber UPDATE publisher module tables
❌ Synchronous 5-module call chain instead of event
❌ Missing idempotency key on finance posting handler
❌ AI handler auto-posts GL without approval
❌ Unregistered event names in code
❌ PII-heavy payload without retention policy
```

---

## Related Documents

| Document | Role |
|----------|------|
| [event-system.md](./event-system.md) | Legacy draft |
| [WORKFLOW_ENGINE_ARCHITECTURE.md](./WORKFLOW_ENGINE_ARCHITECTURE.md) | Transition → emit |
| [WORKFLOW_REGISTRY.md](../../WORKFLOW_REGISTRY.md) | Event mapping |
| [DATABASE_REGISTRY.md](../../DATABASE_REGISTRY.md) | Aggregate ownership |
| [AI_OS_ARCHITECTURE.md](../../modules/ai/AI_OS_ARCHITECTURE.md) | AI consumers |
| [GLOBAL_SEARCH_ARCHITECTURE.md](./GLOBAL_SEARCH_ARCHITECTURE.md) | Search index consumers |
| [framework/COMMUNICATION_CONTRACTS.md](../../framework/COMMUNICATION_CONTRACTS.md) | Module communication |

---

*End of Event Architecture — Step 16*
