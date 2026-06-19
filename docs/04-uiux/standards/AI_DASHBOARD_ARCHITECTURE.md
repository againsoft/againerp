# AgainERP — AI Dashboard Architecture

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 09 — Dashboard Framework Architecture  
> **Authority:** [DASHBOARD_FRAMEWORK_ARCHITECTURE.md](./DASHBOARD_FRAMEWORK_ARCHITECTURE.md) · [06-ai/platform/ai/AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md)

---

## Purpose

Architecture for **AI surfaces on dashboards** — briefings, recommendations, risk, forecasting, and dedicated AI dashboard type.

## When To Read

Read when registering AI widgets or designing AI-assisted dashboard experiences.

## Related Files

- [WIDGET_REGISTRY_STANDARD.md](./WIDGET_REGISTRY_STANDARD.md) — `aiSupport` field
- [SEARCH_AND_DISCOVERY_ARCHITECTURE.md](./SEARCH_AND_DISCOVERY_ARCHITECTURE.md) — AI search → dashboard deep links
- [AI_DASHBOARD_ARCHITECTURE.md](./AI_DASHBOARD_ARCHITECTURE.md) — this doc

## Read Next

§2 **AI surfaces** for the surface you are implementing.

---

## 1. AI Dashboard Type

Dashboard type ID: `dash.ai`

| Property | Value |
|----------|-------|
| **Route** | `/ai-os/dashboard` or `/home/ai` |
| **Audience** | Users with `ai.access` |
| **Composition** | AI widgets + cross-module KPIs selected by agent |
| **Optional** | Tab on Workspace Home — not required separate shell |

Dedicated AI dashboard complements **AI widgets embedded** in module and executive dashboards.

---

## 2. AI Surfaces (Required Capabilities)

### 2.1 AI Daily Brief

| Property | Value |
|----------|-------|
| **Widget ID** | `platform.ai.daily-brief` |
| **Category** | ai |
| **Placement** | Workspace Dashboard (Layer 02) · Executive |
| **Content** | Overnight summary: sales, tasks, approvals, anomalies |
| **Refresh** | `on_focus` + scheduled morning push |
| **Tool** | `platform.ai.generate-daily-brief` |

User utterance: *"What's on my plate today?"* → same content as brief widget.

### 2.2 AI Recommendations

| Property | Value |
|----------|-------|
| **Widget ID pattern** | `{module}.ai.recommendations` |
| **Category** | ai |
| **Content** | Next-best actions: follow up lead, restock SKU, approve PO |
| **Source** | Module services + AI OS ranking |
| **Interaction** | One-click navigate or execute via approved tools |

### 2.3 AI Risk Detection

| Property | Value |
|----------|-------|
| **Widget ID** | `platform.ai.risk-detection` |
| **Category** | ai · alert |
| **Placement** | Executive · Finance · Module dashboards |
| **Signals** | Cash shortfall, SLA breach trend, inventory stockout, churn spike |
| **Severity** | Info · warning · critical |

### 2.4 AI Forecasting

| Property | Value |
|----------|-------|
| **Widget ID pattern** | `{module}.ai.forecast.{metric}` |
| **Category** | chart · ai |
| **Examples** | Sales forecast, demand forecast, cash projection |
| **Disclaimer** | Confidence interval shown · not financial advice |

### 2.5 AI Opportunities

| Property | Value |
|----------|-------|
| **Widget ID** | `{module}.ai.opportunities` |
| **Category** | ai · list |
| **Examples** | Upsell candidates, cross-sell bundles, lead heat |

### 2.6 AI Automation Suggestions

| Property | Value |
|----------|-------|
| **Widget ID** | `{module}.ai.automation-suggestions` |
| **Category** | ai · quick_action |
| **Content** | Suggested workflow rules with enable CTA |
| **Link** | Module Automation zone (`/automation`) |

### 2.7 AI Productivity Score

| Property | Value |
|----------|-------|
| **Widget ID** | `platform.ai.productivity-score` |
| **Category** | ai · kpi |
| **Placement** | Personal · Workspace dashboards |
| **Metrics** | Tasks completed, response time, AI assist usage |
| **Privacy** | User-visible only unless manager role |

---

## 3. Architecture Rules

| Rule | Detail |
|------|--------|
| **Tools not DB** | AI reads via module APIs — [ARCHITECTURE_DECISIONS §6.2](../../ARCHITECTURE_DECISIONS.md#62-tools-call-services-never-orm) |
| **Credits** | LLM-backed widgets consume tenant AI credits |
| **Approval** | Suggested actions that mutate data require approval or confirm |
| **Audit** | All AI dashboard actions logged in AI audit trail |
| **Explainability** | "Why this recommendation?" → insight tool per widget |
| **Graceful degrade** | AI unavailable → widget shows last cached or hides |

---

## 4. AI Widget ↔ Search Integration

| User query | Dashboard outcome |
|------------|-------------------|
| "Show today's sales" | Navigate + filter sales dashboard widgets |
| "Any risks?" | Scroll to risk widget · expand |
| "Summarize my week" | Generate brief in AI Daily Brief |

Pipeline: [SEARCH_AND_DISCOVERY_ARCHITECTURE.md §5](./SEARCH_AND_DISCOVERY_ARCHITECTURE.md#5-ai-search)

---

## 5. Module AI Widget Registration

Each module with `AI.md` should register ≥1 dashboard AI widget when AI tools exist:

| Module | Example widget |
|--------|----------------|
| sales | `sales.ai.forecast.revenue` |
| crm | `crm.ai.opportunities` |
| ecommerce | `ecommerce.ai.sales-forecast` |
| finance | `finance.ai.risk-detection` |
| hr | `hr.ai.productivity-score` |

Register via [WIDGET_REGISTRY_STANDARD.md](./WIDGET_REGISTRY_STANDARD.md).

---

## 6. Context Panel vs Dashboard AI

| Surface | Use |
|---------|-----|
| **Dashboard AI widgets** | Proactive brief · scores · ranked lists |
| **WS-CONTEXT-AI panel** | Conversational follow-up on any page |
| **Header AI button** | Opens context panel — same session as dashboard explain |

Dashboard widgets may deep-link to context panel with pre-filled prompt.

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 09 — AI dashboard architecture |

---

**AI Dashboard Architecture** — brief, recommend, detect, forecast — platform AI OS on every layer.
