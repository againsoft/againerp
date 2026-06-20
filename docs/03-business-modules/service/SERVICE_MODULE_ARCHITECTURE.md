# AgainERP — Service Module Architecture

> **Status:** Planning Phase  
> **Version:** 1.0  
> **Module:** Service (Service Operations Platform)  
> **Document Type:** Enterprise Architecture  
> **Phase:** Documentation First · Planning Only  
> **Route Namespace:** `/service/*`  
> **SSOT:** [SERVICE_MODULE_MASTER_PLAN.md](./SERVICE_MODULE_MASTER_PLAN.md)  
> **Governance:** [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · [DEVELOPMENT_STANDARDS.md](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md)

## Purpose

Enterprise architecture for the Service module — scope, ownership, integrations, and boundaries.

## When To Read

Read when designing Service features, integrations, or module boundaries. Do not implement code until planning docs are approved per [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md).

## Related Files

- [Database](./SERVICE_DATABASE_ARCHITECTURE.md) · [API](./SERVICE_API_ARCHITECTURE.md) · [Workflow](./SERVICE_WORKFLOW_ARCHITECTURE.md) · [Permissions](./SERVICE_PERMISSIONS.md) · [UI](./SERVICE_UI_ARCHITECTURE.md) · [AI](./SERVICE_AI_ARCHITECTURE.md)
- [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

---

**No backend code. No database implementation. No API implementation.**

### Step 01 Requirements (Planning)

| Requirement | Section |
|-------------|---------|
| Unified service operations platform | §1 |
| Route namespace `/service/*` | §2 |
| Service types (fixed, hourly, project, contract, subscription) | §4 |
| Assets, catalog, orders, work orders, repair | §5–§9 |
| Field service, technicians, scheduling | §10–§12 |
| AMC, subscriptions, SLA | §13–§15 |
| Billing, inventory, accounting integration | §16–§18 |
| Reports, AI, permissions | §19–§21 |
| Sibling module boundaries | §22 |

**Related:** [CRM_MODULE_ARCHITECTURE.md](../crm/CRM_MODULE_ARCHITECTURE.md) · [SALES_MODULE_ARCHITECTURE.md](../sales/SALES_MODULE_ARCHITECTURE.md) · [FINANCE_MODULE_ARCHITECTURE.md](../finance/FINANCE_MODULE_ARCHITECTURE.md) · [MASTER_DATABASE_ARCHITECTURE.md](../../05-development/database/MASTER_DATABASE_ARCHITECTURE.md)

---

## Executive Summary

**Service** is AgainERP's **operations layer for delivering and billing work** — from a laptop repair bench to a fleet of field technicians on AMC contracts.

| Principle | Rule |
|-----------|------|
| **Service owns execution** | Service orders, work orders, assets, schedules, SLA timers |
| **Sales owns commercial docs** | Quotations, sales orders, invoices — Service emits billable events |
| **Finance owns GL** | Revenue and COGS journals via `FinanceService` only |
| **Inventory owns stock** | Parts issue/consume via `InventoryService` only |
| **Core contacts master** | Customers keyed on `contact_id` — no duplicate party tables |
| **Mixed billing native** | Product lines (Catalog) + service lines on one Sales invoice |
| **Module-off safe** | Service disabled → UI hidden, no crash in Sales/CRM |
| **AI assisted** | Assign technician, predict maintenance, renewal alerts — human approves high-risk actions |

**Table namespace:** `service_*` · **API base:** `/api/v1/service/`

---

## 1. Module Vision

### Supported Business Models

| Model | Example tenant |
|-------|----------------|
| Pure service | AC cleaning company — no product sales |
| Product + service | Computer shop — SSD sale + Windows install |
| Field service | CCTV installer — dispatch + GPS check-in |
| Contract / AMC | Generator maintenance — scheduled visits |
| Subscription | Digital agency — monthly SEO retainer |
| Repair shop | Mobile repair — diagnosis → parts → delivery |

### Vision Statement

> **Track every asset. Schedule every visit. Bill every hour, part, and contract — in one flow.**

---

## 2. Dashboard & Navigation

**Route:** `/service`

### Navigation Structure

```text
Service Operations  (nav.service)
└── Service  (icon: Wrench)  /service
    ├── Dashboard                 /service
    ├── Service Catalog           /service/catalog
    ├── Customer Assets           /service/assets
    ├── Service Orders            /service/orders
    ├── Work Orders               /service/work-orders
    ├── Repairs                   /service/repairs
    ├── Technicians               /service/technicians
    ├── Schedule                  /service/schedule
    ├── Contracts (AMC)           /service/contracts
    ├── Subscriptions             /service/subscriptions
    ├── SLA Policies              /service/sla
    ├── Reports                   /service/reports
    ├── AI Insights               /service/ai
    └── Settings                  /service/settings
```

Drawer CRUD on list pages: `?create=1` · `?view={id}` · `?edit={id}` — [datatable-and-drawer-standard.md](../../04-uiux/standards/datatable-and-drawer-standard.md)

### Dashboard Widgets

| Widget | Source | Purpose |
|--------|--------|---------|
| Open service orders | `service_orders` | Backlog |
| Today's schedule | `service_schedule_slots` | Dispatch board |
| SLA at risk | SLA engine | Breach prevention |
| Technician utilization | Work orders | Capacity |
| AMC renewals (30d) | `service_contracts` | Revenue retention |
| Parts pending issue | Repair + inventory | Stock blockers |
| Revenue MTD (service) | Finance rollup | Performance |

---

## 3. Platform Position

```text
┌──────────── Core Contacts ────────────┐
│  Customer · Vendor · Employee parties   │
└─────────────────┬─────────────────────┘
                  │
    ┌─────────────▼──────────────────────────────┐
    │              CRM (pipeline)                 │
    └─────────────┬──────────────────────────────┘
                  │ opportunity won
    ┌─────────────▼──────────────────────────────┐
    │         Sales (quote · order · invoice)     │
    │    Mixed lines: product_id + service_item_id │
    └─────────────┬──────────────────────────────┘
                  │ service request / SO line
    ┌─────────────▼──────────────────────────────┐
    │         SERVICE MODULE (this doc)           │
    │  Orders · Work Orders · Assets · Schedule   │
    └─┬─────────┬──────────┬──────────┬─────────┘
      │         │          │          │
      ▼         ▼          ▼          ▼
 Inventory  Finance    HR/Timesheet  Helpdesk
 (parts)    (GL)       (technicians) (escalation)
```

---

## 4. Service Types

Entity flag on **Service Item** and **Service Order line**: `billing_type`

| billing_type | Pricing | Duration | Typical workflow |
|--------------|---------|----------|------------------|
| `fixed` | `sale_price` flat | `duration_minutes` (planning) | Single work order |
| `hourly` | `hourly_rate` × logged time | Timesheet-linked | Multiple WO time entries |
| `project` | Milestone or T&M | Project module link | Long-running |
| `contract` | AMC schedule | Contract period | Recurring visits |
| `subscription` | Recurring cycle | Billing interval | Auto-invoice |

---

## 5. Service Catalog

**Route:** `/service/catalog`

### Service Item Entity

**Table:** `service_items`

| Field | Notes |
|-------|-------|
| `id` | UUID |
| `tenant_id`, `company_id` | Scope |
| `code` | Unique per company — e.g. `SVC-WIN-INSTALL` |
| `name` | Display name |
| `category_id` | FK `service_categories` |
| `description` | Rich text |
| `billing_type` | See §4 |
| `cost_price` | Internal cost (optional) |
| `sale_price` | Fixed price or base rate |
| `hourly_rate` | When billing_type = hourly |
| `duration_minutes` | Default planning duration |
| `tax_group_id` | Finance tax group |
| `skill_tags` | JSON — for auto-assignment |
| `status` | `active` · `inactive` |

**Sales integration:** Service items appear on quotation/SO lines via `line_type = service` and `service_item_id`. Catalog **products** remain separate (`product_id`).

---

## 6. Customer Asset Management

**Route:** `/service/assets`

### Asset Entity

**Table:** `service_assets`

| Field | Notes |
|-------|-------|
| `id` | UUID |
| `asset_tag` | Human-readable Asset ID |
| `name` | e.g. "Dell Latitude 5520" |
| `contact_id` | Owner customer (Core) |
| `category` | laptop · vehicle · ac · cctv · generator · other |
| `brand`, `model` | |
| `serial_number` | Unique index per company (nullable) |
| `warranty_end_date` | |
| `location` | Site / address ref |
| `status` | `active` · `in_repair` · `retired` |

### Asset History (read model)

Aggregated from service orders, work orders, parts lines, invoices — not a separate mutable log.

| History slice | Source |
|---------------|--------|
| Previous services | `service_orders` + `work_orders` |
| Parts usage | `service_parts_lines` → Inventory |
| Technician history | Work order assignments |
| Cost / revenue | Finance invoice lines |

---

## 7. Service Orders

**Route:** `/service/orders`

Operational header — customer request or sales-driven fulfillment.

### Lifecycle

```text
draft → open → assigned → in_progress → completed
                    ↘ cancelled
```

| Status | Meaning |
|--------|---------|
| `draft` | Not yet confirmed |
| `open` | Confirmed, awaiting assignment |
| `assigned` | Technician/team scheduled |
| `in_progress` | Work started |
| `completed` | Done — ready for billing close |
| `cancelled` | Void |

### Service Order Entity

**Table:** `service_orders`

| Field | Notes |
|-------|-------|
| `number` | `SOV/2026/0042` |
| `contact_id` | Customer |
| `asset_id` | Optional linked asset |
| `sales_order_id` | Optional — when created from Sales |
| `priority` | low · medium · high · critical |
| `schedule_date` | Planned date/time |
| `assigned_technician_id` | FK HR employee |
| `sla_policy_id` | Optional |
| `notes` | Customer-visible + internal |
| `billing_status` | unbilled · partial · billed |

### Lines

**Table:** `service_order_lines`

| Field | Notes |
|-------|-------|
| `service_item_id` | Catalog reference |
| `description` | Override text |
| `qty` | Usually 1 for fixed services |
| `unit_price` | Snapshot at order time |
| `billing_type` | Inherited or override |

---

## 8. Work Orders

**Route:** `/service/work-orders`

Execution layer for technicians — one service order may spawn multiple work orders (multi-visit, multi-tech).

### Work Order Entity

**Table:** `service_work_orders`

| Field | Notes |
|-------|-------|
| `number` | `WO/2026/0188` |
| `service_order_id` | Parent |
| `technician_id` | Assignee |
| `scheduled_start`, `scheduled_end` | |
| `actual_start`, `actual_end` | GPS/mobile capture |
| `status` | scheduled · in_progress · done · cancelled |
| `work_notes` | Technician log |
| `customer_signature_media_id` | Core Media |
| `check_in_lat`, `check_in_lng` | Field service |
| `check_out_lat`, `check_out_lng` | Field service |

**Attachments:** Core `AttachmentService` on work order entity.

---

## 9. Repair Management

**Route:** `/service/repairs`

Repair is a **workflow profile** on service orders (category = repair) with structured stages.

### Repair Flow

```text
Receive Asset → Diagnosis → Quote (Sales) → Repair → Parts Usage → Testing → Delivery → Invoice
```

**Table:** `service_repair_stages` (configurable per company)

Default stages: `received` · `diagnosing` · `awaiting_approval` · `repairing` · `testing` · `ready` · `delivered`

| Feature | Owner |
|---------|-------|
| Problem reporting | Service order intake form |
| Diagnosis | Work order notes + checklist |
| Parts consumption | `service_parts_lines` → Inventory issue |
| Repair costing | Sum parts + labor → Sales invoice |
| Repair history | Asset timeline |

---

## 10. Field Service Management

| Feature | Implementation |
|---------|----------------|
| Technician assignment | Schedule board + rules engine |
| GPS check-in/out | Mobile WO — lat/lng on work order |
| Mobile workforce | Responsive WO UI + future native app |
| Route planning | Phase 2 — map integration |

**Events:** `service.work_order.checked_in`, `service.work_order.checked_out`

---

## 11. Technician Management

**Route:** `/service/technicians`

Technicians are **HR employees** with a service profile extension — Service does not own HR master data.

**Table:** `service_technician_profiles`

| Field | Notes |
|-------|-------|
| `employee_id` | FK HR |
| `skills` | JSON array |
| `certifications` | JSON |
| `availability_calendar_id` | Link to schedule |
| `default_territory` | Optional |

### Metrics (computed)

| Metric | Formula |
|--------|---------|
| Jobs completed | Count WO `done` in period |
| Revenue generated | Sum invoiced service lines |
| Customer rating | Post-job survey (future) |
| Productivity score | Billable hours / available hours |

---

## 12. Scheduling Engine

**Route:** `/service/schedule`

### Views

| View | UX pattern |
|------|------------|
| Calendar | Month/week/day — orders + WO |
| Timeline | Gantt-style by technician |
| Technician board | Kanban by assignee |

### Auto-Assignment Rules

```text
Service Type + Required Skills + Territory + Availability → Ranked technician list
```

Rules stored in `service_assignment_rules`. Dispatcher confirms or overrides.

**Optional integration:** When `booking` module enabled, consume `BookingService` for customer self-scheduling slots.

---

## 13. Contract & AMC Management

**Route:** `/service/contracts`

**Table:** `service_contracts`

| Field | Notes |
|-------|-------|
| `number` | `AMC/2026/0012` |
| `contact_id` | Customer |
| `asset_id` | Covered asset (optional) |
| `start_date`, `end_date` | |
| `contract_value` | Total or per-visit cap |
| `visit_frequency` | monthly · quarterly · yearly |
| `visits_included` | Count per period |
| `status` | draft · active · expired · cancelled |

| Feature | Behavior |
|---------|----------|
| Renewal reminder | Notification 30/15/7 days before end |
| Auto scheduling | Generate service orders per frequency |
| AMC history | Contract + linked orders |

---

## 14. Subscription Services

**Route:** `/service/subscriptions`

**Table:** `service_subscriptions`

| Field | Notes |
|-------|-------|
| `service_item_id` | Subscription catalog item |
| `billing_interval` | monthly · quarterly · yearly |
| `next_billing_date` | |
| `auto_renew` | boolean |
| `sales_recurring_id` | Link to Sales recurring template (future) |

| Feature | Behavior |
|---------|----------|
| Auto invoice | Event → Sales creates invoice |
| Auto reminder | Notification before billing |
| Auto renewal | Extend end_date on payment |

---

## 15. SLA Management

**Route:** `/service/sla`

**Table:** `service_sla_policies`

| Priority | Default response | Default resolution |
|----------|------------------|-------------------|
| Low | 8 business hours | 5 business days |
| Medium | 4 business hours | 3 business days |
| High | 2 business hours | 1 business day |
| Critical | 1 business hour | 4 business hours |

**Metrics tracked:** `response_at`, `resolution_at`, breach flags, escalation chain.

**Events:** `service.sla.response_breached`, `service.sla.resolution_breached`

Escalation via Core `WorkflowService` + `NotificationService`.

---

## 16. Billing Integration

Service **does not post invoices**. It prepares billable data; Sales/Finance execute.

### Mixed Invoice Flow

```text
1. Service order completed
2. Service emits service.billing.ready { order_id, lines[], parts[] }
3. SalesService.createInvoiceFromService() — mixed product + service lines
4. FinanceService posts GL on invoice post
```

| Line type | Source |
|-----------|--------|
| Service labor | `service_order_lines` |
| Parts | `service_parts_lines` × Catalog product |
| Products sold | Sales order lines (Catalog) |

---

## 17. Inventory Integration

**Table:** `service_parts_lines`

| Field | Notes |
|-------|-------|
| `work_order_id` | |
| `product_id` | Catalog variant |
| `qty` | |
| `warehouse_id` | Issue location |
| `inventory_movement_id` | Set after `InventoryService.issue()` |

On confirm: reduce stock, track cost for profitability reports.

---

## 18. Accounting Integration

Automatic journals via Finance posting rules (Service emits events only):

| Event | Journal (simplified) |
|-------|----------------------|
| Service invoice posted | DR AR · CR Service Revenue |
| Parts on invoice | DR AR · CR Parts Revenue |
| Parts COGS | DR COGS · CR Inventory |
| Technician cost (internal) | DR Labor Expense · CR Accrued Payroll |

---

## 19. Reporting Layer

**Route:** `/service/reports`

| Report | Purpose |
|--------|---------|
| Service Revenue | By category, technician, period |
| Service Profitability | Revenue − parts cost − labor |
| Technician Performance | Jobs, hours, revenue, rating |
| AMC Revenue | Contract value vs delivered |
| Customer Service History | Orders per contact |
| Asset Service History | Orders per asset |

Reports read from Service tables + Finance/Inventory service APIs — no cross-module SQL.

---

## 20. AI Assistant

See [SERVICE_AI_ARCHITECTURE.md](./SERVICE_AI_ARCHITECTURE.md).

---

## 21. Permissions

See [SERVICE_PERMISSIONS.md](./SERVICE_PERMISSIONS.md).

---

## 22. Sibling Module Boundaries

| Module | Service relationship |
|--------|---------------------|
| **CRM** | Customer context, opportunity → service quote |
| **Sales** | Owns quotes, orders, invoices; Service feeds billable lines |
| **Finance** | Owns GL; Service never writes journals |
| **Inventory** | Owns stock; Service requests issue/consume |
| **HR** | Owns employees; Service adds technician profile |
| **Project** | Owns long project plans; `billing_type=project` links out |
| **Timesheet** | Owns time entries; hourly billing reads approved hours |
| **Helpdesk** | Owns reactive tickets; escalate ticket → service order |
| **Booking** | Optional appointment slots; Service owns dispatch |
| **Manufacturing** | Separate — production WO ≠ service WO |

---

## Appendix A — System Events

### Published by Service

| Event | Payload | Subscribers |
|-------|---------|-------------|
| `service.order.created` | `order_id`, `contact_id` | CRM timeline, Notifications |
| `service.order.completed` | `order_id` | Sales (billing), CRM |
| `service.work_order.completed` | `work_order_id` | SLA, Analytics |
| `service.billing.ready` | `order_id`, lines | Sales |
| `service.parts.consumed` | `movement_id`, cost | Inventory, Finance |
| `service.contract.renewal_due` | `contract_id` | Notifications, AI |
| `service.sla.breached` | `order_id`, type | Notifications, Escalation |

### Consumed by Service

| Event | Source | Action |
|-------|--------|--------|
| `sales.order.confirmed` | Sales | Create/link service order |
| `helpdesk.ticket.escalated` | Helpdesk | Create service order |
| `inventory.stock.reserved` | Inventory | Confirm parts availability |
| `finance.invoice.posted` | Finance | Update billing_status |

---

## Appendix B — Database Overview

Full DDL: [SERVICE_DATABASE_ARCHITECTURE.md](./SERVICE_DATABASE_ARCHITECTURE.md)

| Table Group | Key Tables |
|-------------|------------|
| **Catalog** | `service_categories`, `service_items` |
| **Assets** | `service_assets` |
| **Operations** | `service_orders`, `service_order_lines`, `service_work_orders`, `service_parts_lines` |
| **Repair** | `service_repair_stages`, `service_repair_checklists` |
| **People** | `service_technician_profiles`, `service_assignment_rules` |
| **Schedule** | `service_schedule_slots` |
| **Commercial** | `service_contracts`, `service_subscriptions`, `service_sla_policies` |

---

## Appendix C — API Overview

Base: `/api/v1/service/` · Auth: Bearer + `X-Company-Id`

Full spec: [SERVICE_API_ARCHITECTURE.md](./SERVICE_API_ARCHITECTURE.md)

---

## Architecture Rules

1. **Single owner** — all `service_*` tables owned by Service module only.
2. **No cross-module DB** — integrate via Services and Events.
3. **Sales owns invoice** — Service prepares billable payload.
4. **Finance owns GL** — no direct journal writes from Service.
5. **Core contacts** — customers are `contact_id`, not duplicated.
6. **Module-off graceful** — manifest declares deps; UI hides when disabled.
7. **Mobile-first** — work orders and schedule usable on phone.
8. **Documentation first** — Status `Ready` required before STEP 07 code.

---

## Change History

| Date | Change |
|------|--------|
| 2026-06-21 | v1.0 — Initial enterprise architecture (Planning Phase, STEP 01) |
