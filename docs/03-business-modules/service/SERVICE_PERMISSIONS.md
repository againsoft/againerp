# Service Module — Permissions Matrix

> **Status:** Planning Phase  
> **Version:** 1.0  
> **Module:** Service  
> **Document Type:** RBAC Matrix  
> **Phase:** STEP 04 — Planning Only  
> **Parent:** [SERVICE_MODULE_ARCHITECTURE.md](./SERVICE_MODULE_ARCHITECTURE.md) · [SERVICE_API_ARCHITECTURE.md](./SERVICE_API_ARCHITECTURE.md)

---

Permissions register in Core RBAC under namespace `service.*`.

---

## 1. Roles

| Role | Description |
|------|-------------|
| **Service Admin** | Full module config + all operations |
| **Service Manager** | Orders, dispatch, contracts, reports, approvals |
| **Dispatcher** | Schedule, assign, view all orders |
| **Technician** | Own work orders, check-in, parts (limited) |
| **Customer Support** | Create orders, view status, no dispatch |
| **Accountant** | View orders + reports; invoice via Sales (no dispatch) |

---

## 2. Permission Matrix

| Permission | Admin | Manager | Dispatcher | Technician | Support | Accountant |
|------------|:-----:|:-------:|:----------:|:----------:|:-------:|:----------:|
| `service.catalog.view` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `service.catalog.manage` | ✓ | ✓ | — | — | — | — |
| `service.assets.view` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `service.assets.manage` | ✓ | ✓ | ✓ | — | ✓ | — |
| `service.orders.view` | ✓ | ✓ | ✓ | own+assigned | ✓ | ✓ |
| `service.orders.create` | ✓ | ✓ | ✓ | — | ✓ | — |
| `service.orders.manage` | ✓ | ✓ | ✓ | — | draft only | — |
| `service.orders.dispatch` | ✓ | ✓ | ✓ | — | — | — |
| `service.orders.execute` | ✓ | ✓ | — | ✓ | — | — |
| `service.work_orders.view` | ✓ | ✓ | ✓ | assigned | ✓ | ✓ |
| `service.work_orders.view_all` | ✓ | ✓ | ✓ | — | — | ✓ |
| `service.work_orders.manage` | ✓ | ✓ | ✓ | — | — | — |
| `service.work_orders.execute` | ✓ | ✓ | — | assigned | — | — |
| `service.parts.issue` | ✓ | ✓ | ✓ | ✓ | — | — |
| `service.schedule.view` | ✓ | ✓ | ✓ | own | ✓ | — |
| `service.schedule.manage` | ✓ | ✓ | ✓ | — | — | — |
| `service.schedule.dispatch` | ✓ | ✓ | ✓ | — | — | — |
| `service.contracts.view` | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| `service.contracts.manage` | ✓ | ✓ | — | — | — | — |
| `service.subscriptions.view` | ✓ | ✓ | — | — | ✓ | ✓ |
| `service.subscriptions.manage` | ✓ | ✓ | — | — | — | — |
| `service.sla.view` | ✓ | ✓ | ✓ | — | ✓ | — |
| `service.sla.override` | ✓ | ✓ | — | — | — | — |
| `service.reports.view` | ✓ | ✓ | ✓ | — | — | ✓ |
| `service.settings.edit` | ✓ | — | — | — | — | — |
| `service.ai.apply` | ✓ | ✓ | ✓ | — | — | — |

---

## 3. Field-Level Rules

| Entity | Rule |
|--------|------|
| Work order | Technician sees `work_notes` on assigned WOs only |
| Internal notes | Hidden from technician role on service order |
| Cost fields | `cost_price` on catalog — manager+ only |
| Customer PII | Follow Core contact ACL |

---

## 4. Module-Off Behavior

When Service module disabled for tenant:

- Nav hidden
- API returns `404` with `MODULE_DISABLED`
- Sales mixed lines hide service item picker
- No crash in CRM or Helpdesk

---

## Change History

| Date | Change |
|------|--------|
| 2026-06-21 | v1.0 — Initial permission matrix (STEP 04) |
