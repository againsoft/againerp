# AgainERP — AI OS Architecture

> **Status:** Approved  
> **Version:** 2.0  
> **Layer:** Platform Service (not a business module)  
> **Document Type:** Enterprise Architecture  
> **Phase:** Documentation First · UI/UX Planning  
> **Governance:** [GOVERNANCE.md](../../../00-foundation/GOVERNANCE.md) · **Standards:** [DEVELOPMENT_STANDARDS.md](../../../00-foundation/standards/DEVELOPMENT_STANDARDS.md)

## Purpose
AI OS platform architecture and engines.

## When To Read
Read only when working on AI OS platform, agents, tools, or audit.

## Related Files
- [Architecture](ARCHITECTURE.md)
- [Cursor entry](../../../BRAIN.md)

## Read Next
- [AI experience specs](../../experience/README.md)

---

**No backend code. No database implementation. No API implementation.**  
This document is the source of truth for **AgainERP's AI Operating System** — the highest intelligence layer that governs all modules through services, permissions, workflows, approvals, and audit logs.

### Step 13 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Central AI Operating System — highest platform layer | §1 AI OS Vision |
| AI never accesses database directly | §1 · §3 · §17 |
| Operates through Services, Permissions, Workflows, Approvals, Audit | §3 · §11–§13 · §10 |
| Chief Agent through Provider Management | §2–§16 |
| UI/UX Architecture | §18 |
| 10 domain agents | §4 Agent Registry |
| 7 provider families | §16 AI Provider Management |

### Final Rule

> **AI is a platform service. AI is not a module.**  
> AI OS controls all modules through governed services — it does not own business documents, GL entries, or inventory stock.

**Related:** [AI_FIRST_ARCHITECTURE.md](./AI_FIRST_ARCHITECTURE.md) · [AI_CONTEXT_ENGINE.md](./AI_CONTEXT_ENGINE.md) · [AI_AUDIT_AND_APPROVAL.md](./AI_AUDIT_AND_APPROVAL.md) · [APPROVAL_ENGINE_ARCHITECTURE.md](../../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) · [WORKFLOW_ENGINE_ARCHITECTURE.md](../../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) · [AI_DIGITAL_TWIN.md](./AI_DIGITAL_TWIN.md) · [AI_SCALING_ROADMAP.md](./AI_SCALING_ROADMAP.md)

---

## Executive Summary

**AI OS** is AgainERP's **intelligence kernel** — not a chatbot, not a sidebar feature, and **not** a business module like Sales or Finance. It is the platform service that every module invokes for generation, analysis, forecasting, and governed automation.

| Principle | Rule |
|-----------|------|
| **Platform service** | Lives above modules — no `/ai/*` business namespace |
| **No direct DB access** | Read/write only via module Service APIs |
| **User permission inheritance** | AI acts as the user — never elevated |
| **Workflow-native** | State changes via Workflow Engine tools |
| **Approval-native** | High-risk proposals via Approval Engine |
| **Audit everything** | Append-only `ai_audit_logs` on every operation |
| **Human in the loop** | Suggest → Review → Apply — no silent writes |
| **Provider-agnostic** | OpenAI, Claude, Gemini, local models — swappable |
| **Cost-governed** | Per-tenant token budgets and model routing |

**Table namespace:** `ai_*` · **API base:** `/api/v1/ai/os/`

---

## 1. AI OS Vision

### Why AI OS Exists

AgainERP spans catalog, inventory, procurement, sales, CRM, marketing, finance, and future verticals. Without a central AI OS:

| Problem | Impact |
|---------|--------|
| Each module embeds its own LLM calls | Inconsistent safety, cost, audit |
| AI gets SQL or ORM access | Data breach, corrupt writes |
| No unified approval | Price changes auto-applied |
| No shared memory/knowledge | Repeated context, wrong answers |
| Provider lock-in | Cannot switch models per task |

AI OS provides **one intelligence contract** for all modules — same guards, same audit, same orchestration.

### Vision Statement

> **Understand the whole business. Act through governed services. Never bypass human control.**

AI OS is the **operating layer for intelligence** — users interact with ERP through copilots, agents, and automations that always pass through platform guards.

### AI OS vs Business Module

| Business Module (Sales, Finance, …) | AI OS (Platform Service) |
|-------------------------------------|---------------------------|
| Owns domain documents & tables | Owns prompts, agents, audit — not business rows |
| Route namespace `/sales/*`, `/finance/*` | Embedded globally + Control Center in Settings |
| Posts journals, stock, orders | **Proposes** actions via module APIs |
| Module permissions `sales.*` | Platform permissions `ai.*` + inherited module perms |
| Workflow owner for domain entities | Invokes workflows — does not define them |

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         AI OS (Platform Service)                         │
│  Chief Agent · Agents · Prompts · Knowledge · Memory · Audit · Providers │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ Tools → Module Service APIs ONLY
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐     ┌─────────────────┐     ┌───────────────┐
│ Core Guards    │     │ Business Modules │     │ Core Engines   │
│ Permissions    │     │ Catalog · Sales  │     │ Workflow       │
│ Approval       │     │ Finance · CRM    │     │ Approval       │
│ Audit Logs     │     │ Marketing · …    │     │ Activity       │
└───────────────┘     └─────────────────┘     └───────────────┘
                                │
                                ▼
                         Database (modules only)
```

### Mandatory Access Path

```text
User / Automation Trigger
  ↓
Chief AI Agent
  ↓
Domain Agent + Tool Engine
  ↓
Permission Engine (RBAC + ai.*)
  ↓
Module Service API (validation + business rules)
  ↓
Workflow Engine (if state change)
  ↓
Approval Engine (if policy requires)
  ↓
Module persists → Audit Log + Activity
```

**AI never appears below Module Service API.**

---

## 2. Chief AI Agent

The **Chief AI Agent** is the single entry point for conversational and goal-oriented intelligence.

### Responsibilities

| Function | Description |
|----------|-------------|
| **Intent classification** | Parse natural language into structured goals |
| **Task decomposition** | Break complex goals into agent subtasks |
| **Agent delegation** | Route to Catalog, Sales, CRM, … agents |
| **Plan synthesis** | Merge partial results into coherent response |
| **Guard orchestration** | Ensure permissions/approval before execution |
| **Conversation continuity** | Session + memory integration |

### Example Delegation

| User Goal | Agent Plan |
|-----------|------------|
| "Launch summer sale campaign" | Marketing Agent + Catalog Agent + SEO Agent |
| "Why did margin drop last month?" | Analytics Agent + Finance read tools |
| "Reorder low stock from top vendors" | Inventory Agent + Purchase Agent |
| "Score these leads and draft follow-ups" | CRM Agent + Marketing Agent (draft only) |
| "Fix SEO for new category" | SEO Agent + Catalog Agent |
| "Summarize today's operations" | Analytics Agent across modules |

### Chief Agent Rules

- **Never executes write tools directly** — delegates to domain agents
- **Never bypasses approval** for high-risk tool results
- **Always attaches reasoning** for non-trivial recommendations
- **Respects token budget** — summarizes or defers to async task when over limit
- **Fails closed** on permission denial with explicit reason

### API

`POST /api/v1/ai/os/chat` · `POST /api/v1/ai/os/plan`

---

## 3. Agent Architecture

Domain agents are **specialized workers** orchestrated by the Chief Agent. Each agent has a bounded tool set mapped to module services.

### Agent Stack

```text
Chief AI Agent
     ↓
Agent Orchestrator
     ↓
┌────────────┬────────────┬────────────┬────────────┐
│ Catalog    │ Sales      │ CRM        │ Analytics  │
│ Agent      │ Agent      │ Agent      │ Agent      │
└─────┬──────┴─────┬──────┴─────┬──────┴─────┬──────┘
      │            │            │            │
      └────────────┴────────────┴────────────┘
                        ↓
                 Tool Engine
                        ↓
              Module Service APIs
```

### Agent Anatomy

| Component | Purpose |
|-----------|---------|
| **System prompt** | Role, boundaries, tone (from Prompt Registry) |
| **Tool manifest** | Allowed tools + risk tiers |
| **Context adapter** | Module-specific context bundle |
| **Output schema** | Structured proposals, not free-form writes |
| **Memory scope** | Company rules + domain history |

### Orchestration Flow

```text
1. Chief Agent receives goal
2. Orchestrator selects agent(s) + execution order (parallel where safe)
3. Each agent: assemble context → call LLM → emit tool proposals
4. Tool Engine validates permissions + risk
5. Low risk → return draft / insight
6. High risk → Approval Engine queue
7. On approve → Module Service executes
8. Audit log + Activity entry
```

### Tool Engine Contract

Every tool maps **one-to-one** to a module service method:

| Tool | Service | Method | Risk |
|------|---------|--------|------|
| `catalog.propose_product_update` | `CatalogService` | `proposeUpdate()` | Medium |
| `sales.suggest_quotation` | `SalesService` | `suggestQuotation()` | Medium |
| `inventory.propose_reorder` | `InventoryService` | `proposeReorder()` | High |
| `finance.propose_journal` | `FinanceService` | `proposeJournalEntry()` | Critical |
| `marketing.draft_campaign` | `MarketingService` | `draftCampaign()` | Low–Medium |

Tools return **proposals** (`proposal_id`) — not committed records.

---

## 4. Agent Registry

**Table:** `ai_agents` · **Route (admin):** Settings → AI → Agents

Canonical registry of all domain agents. Versioned; changes audited.

### Registered Agents (Step 13)

| Agent ID | Domain | Primary Tools | Module Service |
|----------|--------|---------------|----------------|
| `catalog_agent` | Product Master / Catalog | Product copy, tags, attributes, publish propose | `CatalogService` |
| `inventory_agent` | Inventory | Forecast, reorder, adjustment propose, transfer suggest | `InventoryService` |
| `purchase_agent` | Purchase | RFQ draft, PO suggest, vendor match, bill match assist | `PurchaseService` |
| `sales_agent` | Sales | Quote draft, discount suggest, forecast, follow-up | `SalesService` |
| `crm_agent` | CRM | Lead score, churn, NBA, email draft, duplicate detect | `CrmService` |
| `marketing_agent` | Marketing | Campaign suggest, segment rules, content draft, ROI analysis | `MarketingService` |
| `seo_agent` | SEO | Meta, schema, audit, keyword suggest, content optimize | `SeoService` |
| `support_agent` | Helpdesk | Ticket summarize, KB suggest, reply draft, sentiment | `SupportService` |
| `developer_agent` | Platform / Dev | Schema read, doc RAG, code propose, migration plan | `DeveloperService` |
| `analytics_agent` | Analytics / BI | Reports, forecasts, anomaly narrative, KPI explain | `AnalyticsService` |

### Agent Metadata Schema

| Field | Notes |
|-------|-------|
| `agent_id` | Stable slug |
| `name`, `description` | Display |
| `version` | Semver |
| `default_prompt_id` | Prompt Registry FK |
| `tools[]` | Allowed tool IDs |
| `max_parallel_tools` | Rate limit |
| `enabled` | Per-company override |
| `default_model_route` | Provider routing key |

### Agent Enablement

- Platform ships all agents **defined** — company admin enables per agent
- Disabled agent → Chief Agent excludes from delegation
- Industry packs pre-enable relevant agents (Hospital, School — future)

---

## 5. Prompt Registry

**Table:** `ai_prompts` · **Route:** Settings → AI → Prompts

Central **versioned prompt template** store — no hard-coded prompts in module code.

### Prompt Types

| Type | Example |
|------|---------|
| **System** | Agent role and boundaries |
| **Task** | "Generate product description from attributes" |
| **Tool** | Structured extraction for tool parameters |
| **Guard** | Refusal and safety instructions |
| **Reasoning** | "Explain recommendation with evidence" |

### Prompt Schema

| Field | Notes |
|-------|-------|
| `prompt_id` | `catalog.generate_description.v3` |
| `version` | Immutable version number |
| `template` | Handlebars/Mustache with variables |
| `variables[]` | Required context keys |
| `model_hints` | Preferred temperature, max tokens |
| `locale` | Optional localized variant |
| `status` | draft → active → deprecated |

### Variable Injection

Prompts receive sanitized context from [AI Context Engine](./AI_CONTEXT_ENGINE.md):

- `{{company.name}}`, `{{user.role}}`, `{{record.snapshot}}`
- Never inject raw credentials, full PII, or cross-tenant data

### Governance

- Prompt changes require `ai.prompts.manage` permission
- Active prompt swap is audited
- A/B testing via `ai_prompt_experiments` (future)
- Rollback to prior version one-click

---

## 6. Knowledge Base

The **Knowledge Base** is AgainERP's **documentation-grounded RAG layer** — AI reads architecture, APIs, and policies, not guessed schema.

### Knowledge Sources

| Source | Location | Update Trigger |
|--------|----------|----------------|
| Architecture docs | `docs/modules/**/ARCHITECTURE.md` | Doc commit / webhook |
| Database schema | `MASTER_DATABASE_ARCHITECTURE.md` + migrations | Migration event |
| API specs | `docs/api/`, OpenAPI | API change |
| Workflows | `WORKFLOW_REGISTRY.md`, module workflows | Registry update |
| Permissions | Module permission matrices | Manifest change |
| Governance | `GOVERNANCE.md`, `CHANGELOG.md` | Release |
| Module manifests | `ModuleManifest.md` | Module install |
| Digital twin | `ai_twin_*` tables | Sync job |

### Ingestion Pipeline

```text
Source document
  → Chunk (512 tokens, 64 overlap)
  → Embed (provider embedding model)
  → Store ai_knowledge_embeddings (company_id = null for platform docs)
  → Index metadata: module, doc_type, version, path
```

### Retrieval Rules

| Rule | Implementation |
|------|----------------|
| Company isolation | Tenant docs filtered by `company_id` |
| Permission filter | Chunks tagged with required read permission |
| Top-k default | 5 chunks; expand to 20 for Developer Agent |
| Freshness | Re-embed on source change event |
| Citation required | Responses cite `source_path` in UI |

### Knowledge vs Memory

| Knowledge Base | Memory System |
|----------------|---------------|
| Platform & company docs | Conversations, decisions, preferences |
| Curated, versioned | Experiential, append-heavy |
| Shared across users (docs) | User/company scoped |

**Detail:** [AI_DIGITAL_TWIN.md](./AI_DIGITAL_TWIN.md)

---

## 7. Memory System

**Tables:** `ai_memory_entries`, `ai_conversations`, `ai_messages`

Persistent, searchable memory — **never a substitute for module data**.

### Memory Types

| Type | Scope | Example |
|------|-------|---------|
| **Conversation** | User/session | Chat history |
| **Company rule** | Company | "Never discount below 15% margin" |
| **User preference** | User | Report tone, language |
| **Decision log** | Company | Past AI recommendation outcomes |
| **Agent scratchpad** | Task | Multi-step plan state (ephemeral TTL) |

### Memory Rules

- **Company isolated** — no cross-tenant retrieval
- **PII retention** configurable per company policy
- User can delete personal conversation memory
- Admin can purge company memory (audited)
- Memory **does not store** authoritative business facts — always re-fetch via services for writes

### Vector Index

Memory entries embed for semantic recall in Chief Agent sessions. Trim to token budget before LLM call.

---

## 8. AI Tasks

**Tables:** `ai_tasks`, `ai_task_steps`

**AI Tasks** are **async, trackable units of work** — long-running agent jobs that exceed chat timeout.

### Task Types

| Type | Example | Agent |
|------|---------|-------|
| `generate_bulk` | SEO for 500 products | SEO Agent |
| `forecast` | 90-day inventory forecast | Inventory + Analytics |
| `analyze` | Margin post-mortem Q2 | Analytics Agent |
| `migrate_plan` | Schema migration proposal | Developer Agent |
| `segment_build` | Proposed segment rules | Marketing + CRM |
| `report_narrative` | P&L management summary | Analytics Agent |

### Task Lifecycle

```text
queued → running → completed | failed | cancelled
```

| Field | Notes |
|-------|-------|
| `task_id` | UUID |
| `agent_id` | Primary agent |
| `trigger` | user, automation, schedule |
| `input_payload` | JSON |
| `output_payload` | JSON result |
| `progress_pct` | 0–100 |
| `tokens_used` | Cost attribution |
| `status` | Lifecycle state |

### Task UI

- Global task tray (notification bell)
- Module insight queues (`/crm/ai-insights`, `/marketing/ai-insights`, …)
- Failed tasks → retry with backoff (max 3)

Tasks execute via job queue — never block HTTP request beyond acceptance.

---

## 9. AI Automation

**Tables:** `ai_automation_rules`, `ai_automation_runs`

**Opt-in, event-driven AI automations** — company-controlled, auditable, approval-gated for writes.

### Automation Schema

| Field | Notes |
|-------|-------|
| `name` | Human label |
| `trigger_event` | `catalog.product.published`, cron, … |
| `agent_id` | Executing agent |
| `action_tool` | Tool to invoke |
| `conditions` | JSON filter (segment, threshold) |
| `approval_required` | Override default risk tier |
| `enabled` | Kill switch |
| `rate_limit` | Max runs per hour |

### Example Automations

| Trigger | Agent | Action |
|---------|-------|--------|
| Product published | SEO Agent | Draft meta + schema |
| Stock < reorder point | Inventory Agent | Reorder proposal → Purchase Agent |
| Lead created (web) | CRM Agent | Score + assign suggest |
| Weekly cron | Analytics Agent | Executive summary email draft |
| Campaign completed | Marketing Agent | Performance analysis task |
| New vendor bill | Purchase Agent | Three-way match assist |

### Automation Guards

- All automations: `company_id` scoped, audited in `ai_automation_runs`
- Write actions default `approval_required: true`
- Cannot disable approval for finance, permissions, bulk delete
- Global company kill switch: `ai.automation.enabled`

---

## 10. AI Audit Logs

**Table:** `ai_audit_logs` (append-only)

Every AI operation — read or write proposal — produces an audit record **before** response returns to user.

### Required Fields

| Field | Notes |
|-------|-------|
| `id` | UUID |
| `user_id`, `company_id` | Actor + tenant |
| `agent_id` | Which agent |
| `action_type` | chat, tool_propose, tool_execute, task, automation |
| `prompt_hash` | Prompt version reference (not always full prompt) |
| `tools_called[]` | Tool IDs + parameters (PII redacted) |
| `target_entity_type`, `target_entity_id` | Affected record |
| `proposal_id` | Link to pending approval |
| `approval_status` | pending, approved, rejected, auto |
| `model_provider`, `model_id` | Provider routing result |
| `tokens_in`, `tokens_out` | Cost attribution |
| `latency_ms` | Performance |
| `result` | success, failed, denied |
| `created_at` | UTC timestamp |

### Immutability

- No UPDATE or DELETE on audit rows
- Corrections via compensating entry only
- Mirrors [AI_AUDIT_AND_APPROVAL.md](./AI_AUDIT_AND_APPROVAL.md)
- Finance/compliance export: Settings → AI → Audit Logs

### Activity Integration

High-signal AI actions also appear on entity Activity timeline (`ai_action` type) via [ACTIVITY_CHATTER_ARCHITECTURE.md](../../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md).

---

## 11. AI Permissions

Namespace: `ai.*` — **supplements** module permissions; never overrides upward.

### Platform Permissions

| Permission | Description |
|------------|-------------|
| `ai.access` | Use AI features (chat, field assist) |
| `ai.chat` | Chief Agent conversation |
| `ai.tasks.create` | Start async tasks |
| `ai.tasks.view` | View task status |
| `ai.automation.view` | View automation rules |
| `ai.automation.manage` | Create/edit automations |
| `ai.approve` | Approve AI proposals (local) |
| `ai.agents.view` | View agent registry |
| `ai.agents.configure` | Enable/disable agents per company |
| `ai.prompts.view` | View prompts |
| `ai.prompts.manage` | Edit prompts |
| `ai.knowledge.manage` | Upload company knowledge docs |
| `ai.memory.manage` | Purge company memory |
| `ai.audit.view` | Audit log explorer |
| `ai.analytics.view` | AI usage dashboard |
| `ai.cost.view` | Token spend reports |
| `ai.cost.manage` | Budgets, model routing |
| `ai.providers.manage` | API keys, provider config |
| `ai.settings.edit` | Global AI OS settings |

### Domain Read/Write (inherits user + explicit)

| Permission | Scope |
|------------|-------|
| `ai.read.catalog` | AI may read product data via service |
| `ai.write.catalog` | AI may propose catalog writes |
| `ai.read.sales` | … |
| `ai.write.finance` | Propose finance writes (always approval) |

### Permission Rules

1. AI inherits **acting user's** module permissions — no elevation
2. Service API re-checks permissions on every call
3. `ai.write.*` without module write permission → denied
4. Finance write tools require `ai.write.finance` **and** `finance.journals.create` minimum
5. Developer Agent read-only on production by default

---

## 12. AI Workflow Integration

Integrates [Workflow Engine](../../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md).

### AI Role in Workflows

| Role | Description |
|------|-------------|
| **Suggest transition** | "Order ready to ship" → propose `confirm → processing` |
| **Prepare for transition** | Fill required fields before submit |
| **Never define states** | Core/module owns workflow definitions |
| **Never force transition** | Uses `workflow.propose_transition` tool |

### Workflow Tool

```json
{
  "tool": "workflow.propose_transition",
  "parameters": {
    "workflow_id": "sales.order",
    "entity_id": "uuid",
    "transition": "confirm",
    "reason": "All lines reserved, payment cleared"
  }
}
```

Workflow Engine validates guards → Approval Engine if policy requires → module executes transition.

### Examples

| Module | AI Workflow Assist |
|--------|-------------------|
| Catalog | Draft product → suggest `submit` for approval |
| Sales | Quote aging → suggest send or expire |
| Purchase | Bill match exception → suggest approve path |
| Marketing | Campaign → suggest `running` when checklist complete |
| Finance | Expense → suggest `submitted` when receipts attached |

---

## 13. AI Approval Integration

Integrates [Approval Engine](../../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md).

### Risk Tiers → Approval

| Tier | Examples | Flow |
|------|----------|------|
| **Low** | Summarize, translate, draft text | Auto to draft field |
| **Medium** | Forecast, recommend, segment suggest | User "Apply" click |
| **High** | Price change, stock adjust, publish | Approval Engine |
| **Critical** | GL post, payment, delete, permissions | Dual approval |

### AI Proposal → Approval Flow

```text
Agent tool returns proposal_id
  ↓
ai_audit_logs (status: pending)
  ↓
Approval Engine creates approval_request
  ↓
Unified inbox: Settings → AI → Approvals + module approval inbox
  ↓
Human approve/reject
  ↓
On approve: Module Service executes
  ↓
ai_audit_logs updated + Activity entry
```

### High-Risk Categories (Always Approval)

- Delete any record
- Price / cost changes
- Inventory adjustments
- Finance journal post / payment
- Permission / role changes
- Bulk operations (> 10 records)
- Marketing send / campaign launch
- Product publish / unpublish

**Detail:** [AI_AUDIT_AND_APPROVAL.md](./AI_AUDIT_AND_APPROVAL.md)

---

## 14. AI Analytics

**Route:** Settings → AI → Analytics

Operational intelligence **about AI usage** — not business analytics (that is Analytics Agent + module reports).

### Metrics

| Metric | Purpose |
|--------|---------|
| **Requests per day** | Volume by agent, module |
| **Token consumption** | In/out by provider, model |
| **Latency p50/p95** | Performance SLA |
| **Approval rate** | Accepted vs rejected proposals |
| **Automation runs** | Success/failure counts |
| **Task completion time** | Async job duration |
| **Error rate** | Provider failures, denials |
| **Top tools invoked** | Tool registry utilization |
| **User adoption** | Active AI users per company |

### Dashboards

- Executive: cost vs budget, adoption trend
- Admin: error spikes, provider health
- Agent owner: per-agent quality signals (approval rate)

### Data Retention

Aggregates in `ai_analytics_daily` — raw audit logs per retention policy (default 2 years).

---

## 15. AI Cost Management

**Route:** Settings → AI → Cost & Budgets

Token spend is a **first-class operational cost** — governed per tenant.

### Budget Model

**Tables:** `ai_cost_budgets`, `ai_cost_ledger`

| Field | Notes |
|-------|-------|
| `company_id` | Tenant |
| `period` | monthly, quarterly |
| `token_budget` | Max tokens per period |
| `usd_budget` | Optional hard cap |
| `alert_threshold_pct` | 80% → notify admin |
| `hard_stop` | Block requests at 100% |

### Cost Attribution

Every audit log row carries `tokens_in`, `tokens_out`, `model_id`, computed `estimated_cost_usd`.

Rollup by: agent, user, module, provider, task vs chat.

### Cost Controls

| Control | Behavior |
|---------|----------|
| **Model downgrade** | Near budget → route to cheaper model |
| **Async deferral** | Large tasks queue when budget tight |
| **Admin override** | Temporary budget bump (audited) |
| **Per-agent caps** | Limit expensive agents (Developer, Analytics) |

---

## 16. AI Provider Management

**Route:** Settings → AI → Providers

**Provider-agnostic routing** — swap models without changing agents.

### Supported Providers (Step 13)

| Provider | Typical Use | Deployment |
|----------|-------------|------------|
| **OpenAI** | GPT-4o, GPT-4o-mini — general, tools | Cloud API |
| **Claude** | Anthropic — long context, reasoning | Cloud API |
| **Gemini** | Google — multimodal, embedding | Cloud API |
| **DeepSeek** | Cost-efficient reasoning | Cloud API |
| **Qwen** | Multilingual, regional | Cloud API |
| **Ollama** | Local dev / air-gapped | Self-hosted |
| **Llama** | Meta open weights via Ollama/vLLM | Self-hosted |

### Provider Router

**Table:** `ai_provider_routes`

| Route Key | Selection Logic |
|-----------|-----------------|
| `default_chat` | Primary conversational model |
| `fast_draft` | Low-latency field generation |
| `long_context` | Large document analysis |
| `embedding` | Knowledge/memory embed |
| `vision` | Image understanding (media) |
| `local_only` | Force Ollama/Llama — no cloud egress |

### Configuration

| Setting | Notes |
|---------|-------|
| API keys | Encrypted vault per company |
| Fallback chain | OpenAI → Claude → local |
| Timeout / retry | Exponential backoff, max 2 retries |
| Data residency | `local_only` route for regulated tenants |
| Model allowlist | Admin blocks specific models |

### Provider Health

Monitoring Engine tracks: error rate, latency, rate limits → auto-fallback when unhealthy.

---

## 17. Security Model

Multi-layer security — **fails closed** on any guard failure.

### Layer Stack

```text
1. Authentication     — Valid session / API token
2. Tenant isolation   — company_id on every request
3. AI permissions     — ai.* namespace
4. Module permissions — Inherited RBAC
5. Tool validation    — Schema + business rules
6. Workflow guards    — Allowed transitions only
7. Approval gates     — High-risk human sign-off
8. Audit logging      — Immutable trail
9. Output sanitization— Strip secrets, mask PII in logs
10. Rate limiting     — Per user, per company
```

### Data Handling

| Rule | Implementation |
|------|----------------|
| **No direct SQL** | AI OS has no database connection to module tables |
| **DTO-only reads** | Services return sanitized DTOs |
| **PII redaction** | Audit logs hash/redact sensitive fields |
| **Prompt injection defense** | System prompts + input sanitization |
| **Secret exclusion** | Never embed API keys, passwords in context |
| **Cross-tenant block** | Hard fail on company_id mismatch |

### Threat Responses

| Threat | Response |
|--------|----------|
| Permission escalation attempt | Deny + audit `result: denied` |
| Tool parameter tampering | Schema validation fail |
| Bulk exfiltration pattern | Rate limit + alert |
| Unsafe content generation | Guard prompt refusal |

### Compliance

- SOC2-ready audit export
- GDPR: memory deletion, PII minimization
- Air-gapped mode: Ollama/Llama only, no external calls

---

## 18. UI/UX Architecture

AI OS UI is **embedded platform-wide** — not a standalone business module menu.

### UI Surfaces

| Surface | Location | Purpose |
|---------|----------|---------|
| **Global AI Assistant** | Right panel / `Ctrl+J` | Chief Agent chat |
| **Field AI toolbar** | Inline on forms | Generate, rewrite, translate |
| **Record AI tab** | Entity detail | Insights, history, proposals |
| **Command palette** | `Ctrl+K` | Quick AI actions |
| **Insight queues** | Module routes | `/crm/ai-insights`, `/marketing/ai-insights`, … |
| **AI Control Center** | Settings → AI | Agents, prompts, providers, audit, cost |
| **Approval inbox** | Settings → AI → Approvals | Pending proposals |
| **Notification bell** | Global | Task complete, approval needed |

### Control Center Navigation

```text
Settings → AI
├── Dashboard (usage, cost, health)
├── Chat (Chief Agent — optional full page)
├── Approvals
├── Tasks
├── Automations
├── Agents
├── Prompts
├── Knowledge
├── Providers
├── Cost & Budgets
├── Analytics
└── Audit Logs
```

### Design Principles

| Principle | Implementation |
|-----------|------------------|
| **Suggest, don't surprise** | Diff preview before apply |
| **Show reasoning** | Collapsible evidence block |
| **Cite sources** | Knowledge base paths |
| **Status clarity** | pending · applied · rejected pills |
| **Cost transparency** | Token estimate on heavy tasks |
| **Accessible** | Keyboard shortcuts, screen reader labels |

### Design Blend

| Weight | Source | Applied To |
|--------|--------|------------|
| **40%** | ChatGPT / Claude | Conversation panel |
| **30%** | GitHub Copilot | Inline field assist |
| **20%** | Linear | Command palette, shortcuts |
| **10%** | Odoo | Settings admin forms |

### Key UI Patterns

#### Proposal Card (inline)

```text
┌─────────────────────────────────────────────────────────┐
│ ✨ AI Suggestion · Catalog Agent              [Pending] │
│ Update price: ৳599 → ৳649 (+8.3%)                       │
│ Reason: Competitor avg ৳655; margin remains 22%         │
│ Sources: analytics.sales_30d · company.rule.margin      │
│                              [Reject]  [Review] [Apply] │
└─────────────────────────────────────────────────────────┘
```

#### AI Control Center Dashboard

- Token spend vs budget gauge
- Agent activity chart
- Pending approvals count
- Provider health indicators

**Standards:** [ai-assistant-ui.md](../../../04-uiux/standards/ai-assistant-ui.md) · [ENTERPRISE_UI_ARCHITECTURE.md](../../../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md) · [UX_SMART_INTERACTION_STANDARDS.md](../../../04-uiux/standards/UX_SMART_INTERACTION_STANDARDS.md)

---

## Appendix A — Platform Service Registry

AI OS reads/writes **only** through these service facades:

| Service | Module | Read | Propose Write |
|---------|--------|------|---------------|
| `CatalogService` | Product Master | ✓ | ✓ |
| `InventoryService` | Inventory | ✓ | ✓ |
| `PurchaseService` | Purchase | ✓ | ✓ |
| `SalesService` | Sales | ✓ | ✓ |
| `CrmService` | CRM | ✓ | ✓ |
| `MarketingService` | Marketing | ✓ | ✓ |
| `SeoService` | SEO | ✓ | ✓ |
| `FinanceService` | Finance | ✓ | ✓ (approval) |
| `SupportService` | Helpdesk | ✓ | ✓ |
| `AnalyticsService` | Analytics | ✓ | — |
| `ActivityService` | Core | ✓ | ✓ |
| `WorkflowService` | Core | ✓ | propose transition |
| `ApprovalService` | Core | ✓ | create request |
| `DeveloperService` | Platform | read-only prod | propose (dev) |

---

## Appendix B — System Events

### Published by AI OS

| Event | Payload | Subscribers |
|-------|---------|-------------|
| `ai.action.proposed` | `proposal_id`, `agent_id`, `tool` | Approval, Activity |
| `ai.action.executed` | `proposal_id`, `entity_id` | Module analytics |
| `ai.action.rejected` | `proposal_id`, `reason` | Notifications |
| `ai.task.completed` | `task_id`, `output` | UI, webhooks |
| `ai.automation.run` | `rule_id`, `status` | Audit |
| `ai.budget.alert` | `company_id`, `pct_used` | Admin notify |

### Subscribed by AI OS

| Event | Action |
|-------|--------|
| `catalog.product.published` | Trigger SEO automation (if enabled) |
| `inventory.stock.below_threshold` | Trigger reorder suggestion task |
| `sales.invoice.posted` | Update analytics context cache |
| `docs.updated` | Re-embed knowledge chunks |
| `approval.approved` | Execute pending AI proposal |

---

## Appendix C — Database Overview

| Table Group | Key Tables |
|-------------|------------|
| **Agents & Tools** | `ai_agents`, `ai_tools`, `ai_tool_invocations` |
| **Prompts** | `ai_prompts`, `ai_prompt_versions` |
| **Knowledge** | `ai_knowledge_embeddings`, `ai_knowledge_sources` |
| **Memory** | `ai_memory_entries`, `ai_conversations`, `ai_messages` |
| **Tasks** | `ai_tasks`, `ai_task_steps` |
| **Automation** | `ai_automation_rules`, `ai_automation_runs` |
| **Audit** | `ai_audit_logs`, `ai_proposals` |
| **Cost** | `ai_cost_budgets`, `ai_cost_ledger` |
| **Providers** | `ai_provider_configs`, `ai_provider_routes` |
| **Twin** | `ai_twin_modules`, `ai_twin_tables`, `ai_twin_endpoints` |
| **Analytics** | `ai_analytics_daily` |

Namespace: `ai_*` — owned by platform, not any business module.

---

## Appendix D — API Overview

Base: `/api/v1/ai/os/` · Auth: Bearer + `X-Company-Id`

| Method | Endpoint | Permission |
|--------|----------|------------|
| POST | `/chat` | `ai.chat` |
| POST | `/plan` | `ai.chat` |
| POST | `/tools/propose` | `ai.access` + domain write |
| POST | `/tools/{proposal_id}/apply` | `ai.approve` + module perm |
| GET | `/tasks` | `ai.tasks.view` |
| POST | `/tasks` | `ai.tasks.create` |
| GET | `/approvals` | `ai.approve` |
| GET | `/audit` | `ai.audit.view` |
| GET | `/analytics` | `ai.analytics.view` |
| GET | `/cost` | `ai.cost.view` |
| PUT | `/providers/{id}` | `ai.providers.manage` |

---

## Appendix E — Scaling Phases

| Phase | Capability | Reference |
|-------|------------|-----------|
| 1 | Assistant — chat, generate, summarize | [AI_SCALING_ROADMAP.md](./AI_SCALING_ROADMAP.md) |
| 2 | Copilot — inline field assist |
| 3 | Automation — event rules |
| 4 | Multi-agent — Chief + domain agents |
| 5 | Developer Agent — code/doc intelligence |
| 6 | Self-optimizing — learning engine |
| 7 | Digital twin — full ERP simulation |

Same AI OS kernel — feature flags expand agent/tool registry per phase.

---

## Architecture Rules

| # | Rule |
|---|------|
| 1 | **AI is a platform service** — not a business module |
| 2 | **No direct database access** — module Service APIs only |
| 3 | **Permission inheritance** — AI never exceeds acting user |
| 4 | **Approval for high-risk** — Approval Engine integration |
| 5 | **Workflow via tools** — never redefine state machines |
| 6 | **Audit everything** — append-only `ai_audit_logs` |
| 7 | **Human in the loop** — Suggest → Review → Apply |
| 8 | **Provider agnostic** — router, not hard-coded OpenAI |
| 9 | **Cost governed** — budgets, attribution, alerts |
| 10 | **Documentation first** — Knowledge Base from `docs/` |

### Anti-Patterns (Forbidden)

```text
❌ AI OS route namespace as business module (/ai/orders, /ai/invoices)
❌ Raw SQL or ORM access from AI OS layer
❌ Auto-post GL, auto-send campaign, auto-adjust stock without approval
❌ Elevated service account that bypasses user permissions
❌ Hard-coded prompts in module PHP/TS files
❌ Cross-tenant memory or embedding retrieval
❌ Silent apply of medium/high risk proposals
```

---

## Related Documents

| Document | Role |
|----------|------|
| [AI_KNOWLEDGE_INDEX.md](../../../00-foundation/registries/AI_KNOWLEDGE_INDEX.md) | Master AI knowledge map — entry for all agents |
| [AI_FIRST_ARCHITECTURE.md](./AI_FIRST_ARCHITECTURE.md) | AI-first platform principles |
| [AI_CONTEXT_ENGINE.md](./AI_CONTEXT_ENGINE.md) | Context assembly |
| [AI_AUDIT_AND_APPROVAL.md](./AI_AUDIT_AND_APPROVAL.md) | Risk tiers, approval UX |
| [AI_DIGITAL_TWIN.md](./AI_DIGITAL_TWIN.md) | ERP digital twin |
| [AI_SCALING_ROADMAP.md](./AI_SCALING_ROADMAP.md) | Phases 1–7 |
| [APPROVAL_ENGINE_ARCHITECTURE.md](../../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) | Human gates |
| [WORKFLOW_ENGINE_ARCHITECTURE.md](../../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md) | State machines |
| Module `*_MODULE_ARCHITECTURE.md` | Per-module AI agent sections |

---

*End of AI OS Architecture — Step 13*
