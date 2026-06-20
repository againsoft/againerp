# Service Module — AI Architecture

> **Status:** Planning Phase  
> **Version:** 1.0  
> **Module:** Service  
> **Document Type:** AI Tools & Assistant  
> **Phase:** STEP 18 planning — no tool implementation  
> **Parent:** [SERVICE_MODULE_ARCHITECTURE.md](./SERVICE_MODULE_ARCHITECTURE.md) · [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md)

---

**AI calls Service APIs only — never direct database access.**

---

## 1. Assistant Scope

**Route:** `/service/ai` · Side panel on order/schedule screens

Capabilities from master plan:

| Capability | Risk tier | Approval |
|------------|-----------|----------|
| Generate quotation draft | Medium | Manager if discount |
| Suggest technician assignment | Low | Auto-apply optional |
| Predict maintenance (asset) | Low | Inform only |
| Detect AMC renewal opportunities | Low | Inform only |
| Analyze customer service history | Low | Inform only |
| Service profitability insights | Low | Inform only |

---

## 2. Registered Tools (planning)

| Tool ID | Service API | Description |
|---------|-------------|-------------|
| `service.suggest_technician` | `POST /schedule/auto-assign` | Rank technicians for order |
| `service.draft_quotation` | Sales API proxy | Build quote from diagnosis |
| `service.predict_maintenance` | `GET /assets/{id}/history` + model | Next service date |
| `service.renewal_opportunities` | `GET /contracts?renewal_due=30` | AMC upsell list |
| `service.customer_insights` | Aggregated reads | LTV, frequency, SLA history |
| `service.profitability_analysis` | `GET /reports/profitability` | Margin by category/tech |

---

## 3. Context Pack

AI context builder includes (when permitted):

- Open service orders for customer
- Asset history and warranty status
- Technician skills and current load
- SLA timers at risk
- Contract renewal dates
- Parts availability (via InventoryService)

---

## 4. Governance

| Rule | Enforcement |
|------|-------------|
| Permission `service.ai.apply` | Required for write actions |
| Assignment override | Logged to Activity + audit |
| Quotation creation | Sales approval rules apply |
| No PII in model logs | Redact per platform policy |

---

## 5. UI Surfaces

| Surface | Content |
|---------|---------|
| Dashboard AI strip | 3 rotating insights |
| Order drawer | "Suggest technician" chip |
| Schedule board | "Auto-fill gaps" action |
| `/service/ai` | Queue: renewals, SLA risks, margin alerts |

---

## Change History

| Date | Change |
|------|--------|
| 2026-06-21 | v1.0 — Initial AI architecture (STEP 18 planning) |
