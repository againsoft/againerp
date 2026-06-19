# AgainERP — Notification Engine Architecture

> **Status:** Approved  
> **Version:** 1.0  
> **Owner:** Core Platform  
> **Document Type:** Enterprise Architecture  
> **Phase:** Documentation First · UI/UX Planning  
> **Layer:** Platform Engine (not module-level)  
> **Governance:** [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · **Standards:** [DEVELOPMENT_STANDARDS.md](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md)

## Purpose
Core engine specification: NOTIFICATION ENGINE ARCHITECTURE.

## When To Read
Read only when working on the NOTIFICATION ENGINE ARCHITECTURE engine or its consumers.

## Related Files
- [Core hub](../ARCHITECTURE.md)
- [Engines index](README.md)

## Read Next
- [Core hub](../ARCHITECTURE.md)

---

**No backend code. No database implementation. No API implementation.**  
This document is the source of truth for **AgainERP's platform-wide Notification Engine** — one delivery system for in-app, email, SMS, push, WhatsApp, Telegram, Slack, and future channels used by every module.

### Step 17 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Platform-wide notification engine | §1 · §2 |
| All modules as consumers | §10 · Appendix A |
| Types through AI assistant | §3–§13 |
| Eight channels | §4 |

**Related:** [EVENT_ARCHITECTURE.md](./EVENT_ARCHITECTURE.md) · [WORKFLOW_ENGINE_ARCHITECTURE.md](./WORKFLOW_ENGINE_ARCHITECTURE.md) · [APPROVAL_ENGINE_ARCHITECTURE.md](./APPROVAL_ENGINE_ARCHITECTURE.md) · [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) · [ui-ux/notifications.md](../../04-uiux/standards/notifications.md) · [core/entities/notifications.md](../entities/notifications.md)

---

## Executive Summary

The **Notification Engine** is AgainERP's **universal message delivery layer** — modules emit intent; Core renders templates, respects preferences, queues delivery, and tracks outcomes across all channels.

| Principle | Rule |
|-----------|------|
| **One engine** | All modules use Core notifications — no direct SMTP/SMS in module code |
| **Event-driven** | Primary trigger: domain events via Event Bus |
| **Template-driven** | Content from versioned, translatable templates |
| **Preference-aware** | User opt-in/out per category × channel |
| **Multi-channel** | Fan-out to in-app, email, SMS, push, WhatsApp, Telegram, Slack |
| **Queued delivery** | Async workers — never block HTTP request |
| **Tracked** | Every send logged with status, retries, audit |
| **AI-assisted** | Draft, summarize, timing suggest — human/policy controls send |

**Table namespace:** `notification_*` · **API base:** `/api/v1/core/notifications/`

---

## 1. Purpose

### Why a Platform Notification Engine Exists

Every module generates alerts — new orders, low stock, approval pending, campaign sent, invoice overdue, @mentions in chatter. Without a central engine:

| Problem | Impact |
|---------|--------|
| Each module sends its own email | Inconsistent branding, duplicate SMTP config |
| SMS credentials scattered | Security risk, no audit |
| No unified inbox | Users miss alerts across modules |
| No preference center | Compliance violations (marketing SMS) |
| No delivery tracking | "Did the approver get the email?" unknown |
| Marketing bypasses consent | GDPR / local telecom fines |

The Notification Engine provides **one contract** for templates, routing, queue, delivery, preferences, and audit.

### What the Engine Owns

| Owns | Does Not Own |
|------|--------------|
| Channel adapters (SMTP, SMS, FCM, …) | Business event definitions |
| Template rendering & i18n | Marketing campaign audience logic |
| User notification inbox | CRM email content strategy |
| Delivery queue & retry | Approval routing decisions |
| Preference registry | Workflow state machines |

### Module Responsibility

Modules **emit notification requests** — never call SendGrid/Twilio directly:

```text
Module event → Notification Rule → Template render → Queue → Channel adapter → Delivery log
```

---

## 2. Notification Vision

### Vision Statement

> **Right message. Right channel. Right person. Right moment.**

Notifications inform action — they do not replace Activity timeline, Approval inbox, or Marketing campaign sends. Operational alerts use the Notification Engine; bulk marketing uses [Marketing Module](../../03-business-modules/marketing/MARKETING_MODULE_ARCHITECTURE.md) with consent gates, optionally delegating transport to the same channel adapters.

### Platform Position

```text
┌─────────────────────────────────────────────────────────────────────────┐
│              Business Modules (Sales, CRM, Finance, …)                   │
│         Emit events / call NotificationService.notify()                  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Notification Engine (Core Platform)                   │
│  Rules · Templates · Preferences · Queue · Router · Delivery · Audit     │
└───┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬────────────────────┘
    │      │      │      │      │      │      │      │
    ▼      ▼      ▼      ▼      ▼      ▼      ▼      ▼
 In-App Email  SMS  Push  WA  Telegram Slack  Webhook
```

### Notification vs Related Systems

| System | Role |
|--------|------|
| **Activity / Chatter** | Persistent timeline on record — not replaced |
| **Approval Engine** | Decision workflow — notification alerts approver |
| **Marketing Module** | Bulk campaign orchestration — may use same email/SMS transport |
| **Event Bus** | Trigger source — notification is a consumer |
| **AI OS** | Draft/suggest — does not send without policy |

---

## 3. Notification Types

**Notification types** classify messages for routing, preferences, UI grouping, and priority.

### Type Categories

| Category | Type Prefix | Examples | Default Priority |
|----------|-------------|----------|------------------|
| **Transactional** | `txn.*` | Order confirmed, password reset | high |
| **Operational** | `ops.*` | Low stock, sync failed | medium |
| **Approval** | `approval.*` | PO pending approval | high |
| **Collaboration** | `collab.*` | @mention, assignment | medium |
| **Reminder** | `reminder.*` | Quote expiring, SLA breach | medium |
| **Marketing** | `marketing.*` | Campaign sent (admin alert) | low |
| **System** | `system.*` | Maintenance, integration error | critical |
| **AI** | `ai.*` | Task complete, insight ready | low |

### Canonical Type Naming

```text
{category}.{module}.{entity}.{action}

Examples:
  txn.commerce.order.placed
  ops.inventory.stock.low
  approval.purchase.order.pending
  collab.core.comment.mention
  ai.task.completed
```

### Notification Record (In-App)

| Field | Purpose |
|-------|---------|
| `type` | Canonical type key |
| `category` | UI grouping |
| `priority` | low, medium, high, critical |
| `title`, `body` | Rendered summary |
| `data` | Deep link JSON (`route`, `entity_type`, `entity_id`) |
| `user_id` | Recipient |
| `read_at` | In-app read state |
| `source_event_id` | FK to domain event (optional) |

### Priority Behavior

| Priority | In-App | Email | SMS | Push |
|----------|--------|-------|-----|------|
| **critical** | Pin + toast | Immediate | If enabled | Yes |
| **high** | Toast | Immediate | Opt-in | Yes |
| **medium** | Inbox only | Batched hourly digest option | No | Opt-in |
| **low** | Inbox only | Digest only | No | No |

---

## 4. Notification Channels

The engine supports **eight channel adapters** — pluggable, company-configured.

| Channel | Adapter | Use Case | Config Source |
|---------|---------|----------|---------------|
| **In-App** | Core inbox | All operational alerts | Always on |
| **Email** | SMTP / API (SendGrid, SES) | Receipts, approvals, digests | Company settings |
| **SMS** | SMS gateway (Twilio, local BD) | Critical alerts, OTP | Company settings |
| **Push** | FCM / APNs / Web Push | Mobile + PWA alerts | Device registration |
| **WhatsApp** | WhatsApp Business API | Template messages (regulated) | Plugin / settings |
| **Telegram** | Telegram Bot API | Ops team alerts | Bot token per company |
| **Slack** | Slack Incoming Webhook / Bot | Team channel alerts | Workspace OAuth |
| **Webhook** | HTTPS POST | Custom integrations | API Manager |

### Channel Rules

| Rule | Detail |
|------|--------|
| **In-app always attempted** | Unless user disabled category entirely |
| **Marketing consent** | SMS/WhatsApp require explicit opt-in |
| **WhatsApp templates** | Pre-approved template IDs only |
| **Slack/Telegram** | Usually company-level or team-level — not all users |
| **Fallback chain** | Push fail → in-app + email (configurable) |
| **Quiet hours** | No SMS/push 21:00–08:00 local unless critical |

### Channel Configuration Entity

**Table:** `notification_channel_configs`

| Field | Notes |
|-------|-------|
| `channel` | email, sms, push, whatsapp, telegram, slack |
| `company_id` | Tenant scope |
| `credentials_ref` | Vault secret ID — never plain text in DB |
| `is_enabled` | Kill switch |
| `rate_limit` | Max sends/minute |
| `default_from` | Email from / SMS sender ID |

---

## 5. Templates

**Templates** define reusable content per notification type × channel × locale.

### Template Entity

**Table:** `notification_templates`

| Field | Notes |
|-------|-------|
| `key` | `approval.purchase.order.pending.email` |
| `channel` | email, sms, push, in_app, … |
| `locale` | `en`, `bn`, … |
| `subject` | Email/push title (Handlebars) |
| `body` | HTML / plain / short SMS |
| `variables[]` | Declared merge tags |
| `version` | Immutable versions |
| `status` | draft → active → deprecated |
| `company_id` | Null = platform default; override per tenant |

### Merge Tags

```handlebars
{{user.first_name}}
{{company.name}}
{{record.number}} — PO-1042
{{record.amount_formatted}}
{{action_url}} — deep link
{{approval.deadline}}
```

### Template Types by Channel

| Channel | Format |
|---------|--------|
| **Email** | HTML + plain text fallback; brand header/footer |
| **SMS** | 160/320 char; short URL |
| **Push** | Title + body + action URL |
| **In-App** | Title + body + icon key |
| **WhatsApp** | Provider template name + variable mapping |
| **Slack** | Block Kit JSON |
| **Telegram** | Markdown message |

### Branding

Email templates pull logo, colors from Business Settings. Modules **never** embed raw HTML in code.

### Template Governance

- Platform ships defaults; company admin may override
- Changes audited; active version pinned per send in delivery log
- AI may **draft** template variants — publish requires `notification.template.manage`

---

## 6. Notification Queue

All outbound delivery (except synchronous in-app write) passes through the **notification queue**.

### Queue Architecture

```text
Notification Request
  → Validate preferences + consent
  → Render template(s) per channel
  → INSERT notification_deliveries (pending)
  → Dispatch to channel queue(s)
  → Worker delivers
  → UPDATE status + retry if failed
```

### Queue Tiers

| Queue | Use |
|-------|-----|
| `notifications.critical` | Approvals, security, payment failure |
| `notifications.default` | Operational, transactional |
| `notifications.low` | Digests, AI insights |
| `notifications.bulk` | Admin broadcasts (rate-limited) |

### Request Payload

```json
{
  "type": "approval.purchase.order.pending",
  "company_id": "uuid",
  "recipients": [{ "user_id": "uuid" }],
  "channels": ["in_app", "email", "push"],
  "template_key": "approval.purchase.order.pending",
  "variables": { "record": { "number": "PO-1042" } },
  "priority": "high",
  "source_event_id": "evt_uuid",
  "correlation_id": "uuid"
}
```

### Queue Rules

| Rule | Detail |
|------|--------|
| **Async only** | `NotificationService.notify()` enqueues — returns immediately |
| **Idempotent** | Dedupe key: `type + user_id + aggregate_id + window` |
| **Batch digest** | Low-priority email aggregated hourly |
| **Concurrency caps** | Per channel rate limits |
| **DLQ** | Failed after max retries → dead letter + admin alert |

Integrates queue infrastructure from [queue-architecture.md](./queue-architecture.md).

---

## 7. Delivery Tracking

Every channel attempt produces a **delivery record** — operational and compliance audit.

### Delivery Entity

**Table:** `notification_deliveries`

| Field | Notes |
|-------|-------|
| `id` | Delivery UUID |
| `notification_id` | In-app record FK (if applicable) |
| `type` | Notification type |
| `channel` | email, sms, … |
| `recipient_user_id` | User |
| `recipient_address` | Email, phone, device token, slack channel |
| `template_version` | Rendered template version |
| `status` | pending, sent, delivered, failed, bounced, suppressed |
| `provider_message_id` | External ID (SendGrid, Twilio) |
| `attempts` | Retry count |
| `last_error` | Provider error |
| `sent_at`, `delivered_at` | Timestamps |
| `source_event_id` | Trace to domain event |

### Status Lifecycle

```text
pending → sending → sent → delivered
                 ↘ failed → retry → sent | dead_letter
                 ↘ suppressed (preference/opt-out)
                 ↘ bounced (email)
```

### Tracking Integrations

| Provider | Webhook |
|----------|---------|
| Email | Bounce, complaint, delivery |
| SMS | Delivery receipt |
| Push | FCM delivery callback |
| WhatsApp | Read/delivery status |

### Admin Visibility

Settings → Notifications → Delivery Log — filter by user, type, channel, status, date.

---
## 8. User Preferences

**User preferences** control which categories arrive on which channels — legal consent for marketing channels.

### Preference Entity

**Table:** `notification_preferences`

| Field | Notes |
|-------|-------|
| `user_id` | Recipient |
| `category` | orders, inventory, approvals, mentions, marketing, … |
| `channel` | in_app, email, sms, push, whatsapp |
| `enabled` | Boolean |
| `digest_mode` | instant, hourly, daily, off |

### Preference Hierarchy

```text
1. Legal suppressions (bounced email, SMS opt-out) — cannot override
2. Company policy (force critical approvals to email)
3. User preferences
4. Notification rule defaults
```

### Mandatory Notifications

Cannot be disabled by user (company policy):

- Password reset
- Security alert
- Approval assigned (if role requires)
- Account suspension

### Preference UI

Settings → Notifications → Preferences — matrix UI (category × channel checkboxes).

### Contact-Level Consent (Marketing)

SMS/WhatsApp marketing also checks Core contact flags:

- `sms_marketing_consent`
- `whatsapp_marketing_consent`

Transactional SMS (order shipped) allowed with transactional template category.

---

## 9. Notification Rules

**Notification rules** map **triggers → recipients → channels → template**.

### Rule Entity

**Table:** `notification_rules`

| Field | Notes |
|-------|-------|
| `name` | Human label |
| `trigger_type` | event, schedule, manual, workflow |
| `trigger_key` | `purchase.order.approved` or cron |
| `conditions` | JSON filter (amount > X, status = Y) |
| `recipient_resolver` | role, owner, assignee, custom |
| `channels[]` | in_app, email, … |
| `template_key` | Template to render |
| `priority` | Default priority |
| `enabled` | Kill switch |
| `company_id` | Tenant override |

### Recipient Resolvers

| Resolver | Description |
|----------|-------------|
| `record.owner` | Assigned user |
| `record.approver` | Current approval step assignee |
| `role:purchase_manager` | All users with role |
| `team:warehouse_a` | Branch/team |
| `contact.email` | External customer (transactional) |
| `slack:#ops-alerts` | Channel (Slack/Telegram) |

### Example Rules

| Trigger | Recipients | Channels | Template |
|---------|------------|----------|----------|
| `commerce.order.placed` | Customer contact, sales role | email, in_app | order.placed |
| `inventory.stock.low` | Warehouse manager | in_app, email, push | stock.low |
| `approval.request.created` | Approver user | in_app, email, push | approval.pending |
| `collab.comment.mention` | Mentioned user | in_app, push | mention |
| `finance.invoice.overdue` | AR team | email digest | invoice.overdue |

### Rule Priority

Multiple rules may match — all fire unless dedupe window prevents duplicate within N minutes.

---

## 10. Event Integration

Primary trigger path: **Event Bus → Notification consumer**.

Integrates [EVENT_ARCHITECTURE.md](./EVENT_ARCHITECTURE.md).

### Event Consumer

**Subscriber:** `NotificationEventHandler`

```text
domain event published
  → match notification_rules where trigger_key = event.name
  → evaluate conditions on payload
  → resolve recipients
  → NotificationService.notify()
```

### Standard Event → Notification Map

| Event | Notification Type |
|-------|-------------------|
| `commerce.order.placed` | `txn.commerce.order.placed` |
| `sales.shipment.shipped` | `txn.sales.shipment.shipped` |
| `inventory.stock.below_threshold` | `ops.inventory.stock.low` |
| `purchase.order.approved` | `txn.purchase.order.approved` |
| `approval.request.created` | `approval.*.pending` |
| `approval.approved` | `approval.*.approved` |
| `finance.invoice.overdue` | `reminder.finance.invoice.overdue` |
| `core.contact.created` | `txn.core.contact.welcome` |
| `ai.task.completed` | `ai.task.completed` |

### Event Rules

- Consumer **idempotent** on `event.id`
- Never blocks event bus — enqueue only
- Failed notification does not retry domain event
- `source_event_id` on delivery for traceability

---

## 11. Workflow Integration

Integrates [Workflow Engine](./WORKFLOW_ENGINE_ARCHITECTURE.md).

### Workflow → Notification

Workflow transitions may include **notify action**:

```json
{
  "action": "notify",
  "template_key": "sales.order.confirmed",
  "channels": ["in_app", "email"],
  "recipients": ["record.contact", "record.owner"]
}
```

### Workflow Notification Points

| Transition | Notify |
|------------|--------|
| PO submitted for approval | Approver |
| SO confirmed | Customer + sales rep |
| Product submitted for review | Catalog manager |
| Expense submitted | Manager |
| Lead assigned | New owner |

### Workflow Rules

- Workflow Engine invokes `NotificationService` — does not render templates itself
- Notification failure does **not** roll back workflow transition
- State change event also fires — may duplicate if rule exists; dedupe by transition ID

---

## 12. Approval Integration

Integrates [Approval Engine](./APPROVAL_ENGINE_ARCHITECTURE.md).

### Approval Notification Flow

```text
approval.request.created
  → notify approver(s): in_app + email + push (high priority)
approval.step.pending
  → remind after SLA (escalation rule)
approval.approved / rejected
  → notify submitter + followers
approval.delegated
  → notify delegate + original approver
```

### Approval Templates

| Template Key | When |
|--------------|------|
| `approval.pending` | New request |
| `approval.reminder` | SLA breach warning |
| `approval.approved` | Approved |
| `approval.rejected` | Rejected with reason |
| `approval.delegated` | Delegation active |

### Approval Inbox vs Notification

| Approval Inbox | Notification Bell |
|----------------|-------------------|
| Action required — approve/reject | Awareness + deep link |
| Persists until decided | Can mark read independently |
| `/approvals` or module inbox | Header dropdown + `/notifications` |

Both update on approval events; deep link from notification → approval detail.

### Escalation

Approval Engine escalation policy triggers `approval.escalation` notification to next level — see Approval Engine §7.

---

## 13. AI Notification Assistant

Integrates [AI OS Architecture](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md).

### Agent Capabilities

| Capability | Input | Output |
|------------|-------|--------|
| **Draft notification** | Event context, tone | Subject + body draft for template |
| **Summarize thread** | Activity/chatter | Short notification body for mention digest |
| **Channel suggest** | Urgency, user prefs | Best channel ranking |
| **Send-time optimize** | User timezone, open rates | Suggested delay for non-critical |
| **Digest summarize** | N unread operational items | Daily digest paragraph |
| **Template A/B** | Two variants | Performance hint (future) |

### AI Governance

1. **Suggest → Review → Publish** — AI drafts templates; admin activates
2. **No autonomous send** of new template types without human rule
3. AI may auto-send only when explicit `notification_rules` + `ai_generated: true` flag approved
4. All AI drafts logged in `ai_audit_logs`
5. Transactional/legal notifications exempt from AI rewrite

### AI Triggers

| Event | AI Action |
|-------|-----------|
| `approval.request.created` | Suggest personalized approver message (optional) |
| Daily cron | Generate manager digest draft |
| `collab.comment.mention` | Summarize thread for notification body |

---

## Appendix A — Module Usage Matrix

| Module | Example Notifications |
|--------|----------------------|
| **Catalog** | Product approved, review submitted |
| **Inventory** | Low stock, transfer complete, adjustment approved |
| **Purchase** | PO approved, RFQ sent, bill match exception |
| **Sales** | Quote sent, order confirmed, shipment dispatched |
| **CRM** | Lead assigned, SLA breach, opportunity won |
| **Marketing** | Campaign completed (admin); bulk sends use Marketing + same adapters |
| **Finance** | Invoice overdue, payment received, period closing |
| **Ecommerce** | Order placed, refund processed |
| **Approval** | Pending, reminder, decided |
| **Workflow** | Transition notify actions |
| **AI OS** | Task complete, proposal ready |
| **Support** | Ticket assigned, SLA warning (future) |

---

## Appendix B — Infrastructure Tables (Registry)

| Table | Purpose |
|-------|---------|
| `notifications` | In-app inbox records |
| `notification_templates` | Versioned templates |
| `notification_rules` | Trigger → delivery mapping |
| `notification_deliveries` | Per-channel delivery log |
| `notification_preferences` | User category × channel |
| `notification_channel_configs` | Provider credentials ref |
| `notification_suppressions` | Bounce/opt-out block list |
| `notification_digests` | Pending digest batch |

---

## Appendix C — API Overview

Base: `/api/v1/core/notifications/` · Auth: Bearer + `X-Company-Id`

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/` | Authenticated user (own inbox) |
| PATCH | `/{id}/read` | Own notification |
| POST | `/read-all` | Own inbox |
| GET | `/preferences` | Own preferences |
| PUT | `/preferences` | Own preferences |
| POST | `/send` | `core.notification.send` (system/modules) |
| GET | `/deliveries` | `core.notification.admin` |
| GET | `/templates` | `notification.template.view` |
| PUT | `/templates/{id}` | `notification.template.manage` |
| GET | `/rules` | `notification.rule.manage` |

Modules call internal `NotificationService.notify()` — not public `/send` from user context.

---

## Appendix D — Permissions

| Key | Purpose |
|-----|---------|
| `core.notification.view` | View own inbox |
| `core.notification.send` | System/module send |
| `core.notification.admin` | Delivery log, DLQ |
| `notification.template.view` | View templates |
| `notification.template.manage` | Edit templates |
| `notification.rule.manage` | CRUD rules |
| `notification.channel.manage` | Provider config |

---

## Architecture Rules

| # | Rule |
|---|------|
| 1 | **One engine** — all modules use Core notifications |
| 2 | **No direct provider calls** in module code |
| 3 | **Event-driven primary** — rules on domain events |
| 4 | **Template-driven content** — no hard-coded email bodies |
| 5 | **Preference + consent** — respect opt-out |
| 6 | **Queued async** — never block requests |
| 7 | **Track every delivery** — audit trail |
| 8 | **Idempotent sends** — dedupe window |
| 9 | **AI assists, not spams** — governed sends |
| 10 | **In-app + email** minimum for critical approvals |

### Anti-Patterns (Forbidden)

```text
❌ mail() or SMTP calls in Sales/Purchase controllers
❌ Module-specific notification_templates table
❌ SMS marketing without consent check
❌ Notification send before domain event COMMIT
❌ Storing provider API keys in plain text
❌ AI auto-send bulk email without rule + approval
❌ Skipping delivery log for "test" sends in production
```

---

## Related Documents

| Document | Role |
|----------|------|
| [EVENT_ARCHITECTURE.md](./EVENT_ARCHITECTURE.md) | Event triggers |
| [APPROVAL_ENGINE_ARCHITECTURE.md](./APPROVAL_ENGINE_ARCHITECTURE.md) | Approval alerts |
| [WORKFLOW_ENGINE_ARCHITECTURE.md](./WORKFLOW_ENGINE_ARCHITECTURE.md) | Notify actions |
| [ui-ux/notifications.md](../../04-uiux/standards/notifications.md) | Inbox UI |
| [core/entities/notifications.md](../entities/notifications.md) | Entity spec |
| [MARKETING_MODULE_ARCHITECTURE.md](../../03-business-modules/marketing/MARKETING_MODULE_ARCHITECTURE.md) | Campaign vs operational |

---

*End of Notification Engine Architecture — Step 17*
