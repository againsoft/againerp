# Architecture — AI

> **Status:** Draft  
> **Module:** AI  
> **Document Type:** Architecture  
> **Phase:** 6 (Steps 58–65)  
> **AI OS:** [AI_OS_ARCHITECTURE.md](./AI_OS_ARCHITECTURE.md) — **canonical** AI Operating System  
> **AI-First:** [AI_FIRST_ARCHITECTURE.md](./AI_FIRST_ARCHITECTURE.md) — platform AI principles

---

## Purpose

Define the AgainERP AI Layer: a provider-agnostic intelligence platform powered by the **AI OS**. Every module is AI-enabled through services — AI never writes to module tables directly. See [AI_FIRST_ARCHITECTURE.md](./AI_FIRST_ARCHITECTURE.md) for OS, audit, approval, and context rules.

## Business Goals

- Centralize AI capabilities so modules do not embed provider SDKs directly
- Enable natural-language interaction with ERP data safely and audibly
- Accelerate content creation (products, SEO, marketing) with human review gates
- Improve decision-making via forecasting and conversational analytics
- Support semantic search across catalog, documents, and knowledge base

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Module UIs / APIs                        │
│  Ecommerce AI · CRM · Dashboard · Global Search · Assistant │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    AI Service Layer                          │
│  Assistant · Generator · SEO · Analytics · Forecast · Auto  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   AI Core Engine                             │
│  Provider Router · Prompt Registry · Token Budget · Audit   │
│  Embedding Service · Vector Store · Job Queue               │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
   LLM Providers    PostgreSQL + pgvector   Redis Queue
```

## AI Assistant

Conversational copilot embedded in admin shell and available via API.

| Aspect | Design |
|--------|--------|
| Context | Scoped by company, branch, user role, and current page entity |
| Actions | Read-only queries by default; write actions require confirmation + permission |
| Memory | Session context in `ai_conversations`; long-term optional via embeddings |
| Safety | PII redaction, permission checks before data retrieval, audit every response |

Workflow: User prompt → intent classification → context assembly (RAG) → LLM → structured response or action proposal → audit log.

## AI Product Generator

Generates catalog content from product attributes, images, and category context.

| Output | Source Data |
|--------|-------------|
| Descriptions | Name, attributes, brand, category, competitor hints |
| Tags | Catalog taxonomy, existing tags, SEO keywords |
| Attributes | Category templates, image analysis (optional) |
| Translations | Localization module language packs |

Integrates with Ecommerce Catalog. Generated content lands in **draft** status until admin approval. See Ecommerce `Menus/AI/` for screen-level specs.

## SEO AI

| Feature | Scope |
|---------|-------|
| Meta generator | Title, description, OG tags per product/category/page |
| Schema markup | Product, BreadcrumbList, Organization JSON-LD |
| Blog writer | Website CMS integration |
| Content optimizer | Readability, keyword density, internal link suggestions |

Outputs stored in `ai_generations` with `type = seo` and linked to target entities via polymorphic references.

## Analytics AI

Natural-language interface over Reporting Engine and pre-aggregated metrics.

| Capability | Implementation |
|------------|----------------|
| NL queries | Text → SQL/metric mapping with allowlisted datasets |
| Summaries | Period-over-period narratives for dashboards |
| Anomaly hints | Flags deviations; does not auto-alert without rule |
| Export | Chart/table generation via BI module (Phase 8) |

Read-only. No raw SQL from user input — parameterized query templates only.

## AI Forecasting

| Model Domain | Input Signals | Output |
|--------------|---------------|--------|
| Sales forecast | Historical orders, seasonality, promotions | Daily/weekly projections |
| Inventory forecast | Stock levels, lead times, sales velocity | Reorder suggestions |
| Demand planning | Multi-SKU, category rollups | Purchase recommendations |

Runs as scheduled queue jobs. Results in `ai_forecasts` with confidence intervals. Feeds Inventory and Purchase modules.

## AI Automation

Event-driven and scheduled AI tasks wired to Core Workflow and Queue systems.

| Trigger | Example |
|---------|---------|
| Product created | Auto-generate description draft |
| Order threshold | Summarize daily sales for manager |
| Cron | Re-embed stale catalog records |
| Webhook | External data enrichment |

Automation rules in `ai_automation_rules` with enable/disable, rate limits, and failure notifications.

## AI Search

Semantic search layer extending Core Search Engine.

| Index | Embedding Source |
|-------|------------------|
| Products | Name, description, attributes, tags |
| Documents | Full text chunks |
| Knowledge | Help articles, SOPs |
| Contacts/Orders | Limited fields per permission |

**pgvector-ready:** Embeddings stored in `ai_embeddings` with `vector(1536)` column (dimension configurable per provider). Hybrid search combines BM25 (Core Search) + cosine similarity with tunable weights.

## User Roles

| Role | Access |
|------|--------|
| AI Admin | Provider config, budgets, automation rules |
| Module Admin | Domain-specific AI features (e.g. ecommerce.ai.*) |
| Manager | Assistant, analytics queries, approve generations |
| Staff | Assistant read-only, use approved content |

Permission namespace: `ai.*` plus module-scoped keys (e.g. `ecommerce.ai.generate`).

## Database Tables

Prefix: `ai_*` — all tables include `company_id`, audit columns, and soft-delete where applicable.

| Table | Purpose |
|-------|---------|
| `ai_providers` | LLM/embedding provider config (encrypted keys) |
| `ai_models` | Model registry, costs, capabilities |
| `ai_prompts` | Versioned prompt templates |
| `ai_conversations` | Assistant sessions |
| `ai_messages` | Turn-by-turn messages with token counts |
| `ai_generations` | All generated content (product, seo, image meta) |
| `ai_embeddings` | Vector storage — **pgvector** `vector` column |
| `ai_forecasts` | Forecast runs and results (JSONB) |
| `ai_automation_rules` | Trigger definitions and actions |
| `ai_automation_runs` | Execution log |
| `ai_usage_logs` | Token/cost tracking per company/user |
| `ai_audit_logs` | Prompts, responses, actions (compliance) — **mandatory every action** |
| `ai_actions` | Proposed writes awaiting approval |
| `ai_context_snapshots` | Context bundle replay (admin, optional) |

### pgvector Readiness

- Extension: `CREATE EXTENSION IF NOT EXISTS vector;`
- Index: HNSW or IVFFlat on `ai_embeddings.embedding` per table size guidance
- Chunking: 512–1024 token chunks with overlap for documents
- Re-embedding: Version tracked in `ai_embeddings.model_version`

## API Endpoints

Base path: `/api/v1/ai/`

| Endpoint Group | Methods |
|----------------|---------|
| `/assistant/chat` | POST — streaming supported |
| `/generate/product` | POST |
| `/generate/seo` | POST |
| `/analytics/query` | POST |
| `/forecasts` | GET, POST |
| `/automations` | CRUD |
| `/search` | GET — semantic + hybrid |
| `/embeddings/reindex` | POST — admin only |

## Events

| Event | Subscribers |
|-------|-------------|
| `ai.generation.completed` | Ecommerce Catalog, Notification |
| `ai.forecast.completed` | Inventory, Purchase |
| `ai.usage.threshold` | Billing (Subscription), Notification |
| `ai.automation.failed` | Notification, Audit |

## Dependencies

- **Core:** Users, Permissions, Queue, Events, Search, Settings, Audit Logs
- **Modules:** Ecommerce, Inventory, Sales, Website, Reporting Engine
- **Phase 8:** BI System (analytics depth), Data Warehouse (historical training data)

## Future Enhancements

- Multi-modal (image/video) generation pipeline
- Fine-tuned domain models per tenant
- Agentic workflows with tool-calling sandbox
- On-premise model deployment option

---

**Module:** AI  
**Last Updated:** 2026-06-12  
**Author:** —  
**Reviewers:** —
