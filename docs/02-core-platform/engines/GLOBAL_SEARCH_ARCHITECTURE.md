# AgainERP — Global Search Architecture

> **Status:** Approved  
> **Version:** 1.0  
> **Owner:** Core Platform  
> **Document Type:** Enterprise Architecture  
> **Phase:** Documentation First · UI/UX Planning  
> **Layer:** Platform Engine  
> **Search Engine:** Meilisearch (primary) · Elasticsearch (future scale)  
> **Governance:** [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · **Standards:** [DEVELOPMENT_STANDARDS.md](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md)

## Purpose
Core engine specification: GLOBAL SEARCH ARCHITECTURE.

## When To Read
Read only when working on the GLOBAL SEARCH ARCHITECTURE engine or its consumers.

## Related Files
- [Core hub](../ARCHITECTURE.md)
- [Engines index](README.md)

## Read Next
- [Core hub](../ARCHITECTURE.md)

---

**No backend code. No database implementation. No API implementation.**  
This document is the source of truth for **AgainERP's universal search system** — global bar, module search, index registry, ranking, permissions, suggestions, analytics, and AI integration.

### Step 18 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Universal search system | §1 · §2 |
| Meilisearch + future Elasticsearch | §3 |
| Global bar through AI integration | §4–§13 |
| 12 searchable domains | §7 |
| NL, AI, voice (future), semantic (future) | §6 · §13 |

**Related:** [EVENT_ARCHITECTURE.md](./EVENT_ARCHITECTURE.md) · [PERMISSION_SYSTEM_ARCHITECTURE.md](../PERMISSION_SYSTEM_ARCHITECTURE.md) · [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) · [DATABASE_REGISTRY.md](../../00-foundation/registries/DATABASE_REGISTRY.md) · [ui-ux/global-search.md](../../04-uiux/standards/global-search.md) · [search-engine.md](./search-engine.md) (legacy draft)

---

## Executive Summary

**Global Search** is AgainERP's **universal discovery layer** — one query box to find products, orders, customers, documents, and actions across every module, filtered by permissions and ranked for relevance.

| Principle | Rule |
|-----------|------|
| **One search API** | `/api/v1/core/search/` — modules register indexes, never own Meilisearch clients |
| **Meilisearch v2** | Primary engine — sub-50ms autocomplete, typo tolerance |
| **Event-driven index** | Domain events → async indexer — no synchronous full reindex on write |
| **Permission-filtered** | Results only for records user can `view` |
| **Company scoped** | Every document indexed with `company_id` |
| **Derived indexes** | Rebuildable from OLTP — not source of truth |
| **AI-assisted** | NL query parsing, semantic (future) — inherits RBAC |

**Table namespace:** `search_*` · **API base:** `/api/v1/core/search/`

---

## 1. Purpose

### Why a Universal Search System Exists

AgainERP spans 12+ searchable domains. Users cannot navigate deep menus for every lookup — "find PO-1042", "customer Widget Corp", "invoice overdue", "who approved this product".

| Problem | Impact |
|---------|--------|
| Per-module search silos | Duplicate UX, inconsistent ranking |
| SQL `LIKE` on large tables | Slow, no typo tolerance |
| Permission leaks in search | Titles visible for forbidden records |
| Stale indexes | Search shows deleted/archived items |
| No cross-module discovery | Order number unknown in Sales vs Commerce |

Global Search provides **one index contract**, **one API**, **one UI entry point**.

### What Search Owns

| Owns | Does Not Own |
|------|--------------|
| Index document schema | Business aggregate data (OLTP) |
| Meilisearch index management | Module list page filters (module UI) |
| Query API, ranking config | Product Master catalog browse facets |
| Synonyms, analytics log | Authorization policy definitions |
| AI query interpretation layer | Source record CRUD |

---

## 2. Search Vision

### Vision Statement

> **Ask once. Find anything you're allowed to see.**

Search is the **fast path to records and actions** — complementing navigation menus and reports, not replacing module-specific advanced filters.

### Search Layers

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  UI: Global Bar (Ctrl+K) · Module List Search · Full Results Page        │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Search Service (Core Platform)                                          │
│  Query parse · Permission filter · Ranking · Suggestions · Analytics     │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
        Meilisearch      PostgreSQL FTS      AI / Semantic (future)
        (primary)        (fallback/admin)     pgvector + embeddings
```

### Evolution Roadmap

| Phase | Engine | Capability |
|-------|--------|------------|
| **v1** | PostgreSQL FTS + GIN | Admin baseline, small catalogs |
| **v2** | **Meilisearch** | Global bar, autocomplete, facets |
| **v3** | **Elasticsearch** | Enterprise scale, complex aggregations |
| **v4** | pgvector + embeddings | Semantic / AI similarity search |

Architecture is **engine-agnostic** — `SearchProvider` interface swaps Meilisearch ↔ Elasticsearch without module changes.

---

## 3. Search Architecture

### Component Map

```text
Global Search Platform
├── Index Registry          — domain → index name, schema, permissions
├── Indexer Workers         — event consumers → upsert/delete documents
├── Search Provider         — Meilisearch client (ES future)
├── Query Service           — parse, multi-index search, merge, rank
├── Permission Filter       — post-filter + index-time company_id
├── Suggestion Service      — autocomplete, recent, popular
├── Analytics Collector     — query log, click-through
├── Activity Logger         — search events on user timeline
└── AI Query Layer          — NL → structured query (optional)
```

### Index Document Schema (Canonical)

```json
{
  "id": "uuid",
  "type": "catalog.product",
  "company_id": "uuid",
  "branch_id": "uuid|null",
  "title": "Blue T-Shirt",
  "subtitle": "SKU-001 · Published",
  "keywords": ["cotton", "apparel", "men"],
  "body": "Full-text searchable excerpt",
  "facets": {
    "module": "catalog",
    "status": "published",
    "category": "apparel"
  },
  "url": "/catalog/products/uuid",
  "icon": "product",
  "permission_key": "catalog.product.view",
  "updated_at": "2026-06-13T10:00:00Z",
  "embedding": null
}
```

### Event-Driven Indexing

Integrates [EVENT_ARCHITECTURE.md](./EVENT_ARCHITECTURE.md):

```text
catalog.product.updated (after COMMIT)
  → SearchIndexHandler
  → CatalogSearchIndexer.buildDocument(product_id)
  → SearchProvider.upsert("products", document)
```

Delete on archive/soft-delete: `SearchProvider.delete(id)`.

### Multi-Index Strategy (Meilisearch)

| Index | Domains | Primary Key |
|-------|---------|-------------|
| `products` | Catalog / Product Master | `id` (uuid) |
| `orders` | Commerce + Sales orders | `id` |
| `contacts` | Customers, vendors, leads | `id` |
| `inventory` | Stock items, warehouses | `id` |
| `purchase` | PO, RFQ, bills | `id` |
| `sales` | Quotes, SO, invoices | `id` |
| `crm` | Leads, opps, accounts | `id` |
| `marketing` | Campaigns, coupons | `id` |
| `finance` | Journals, invoices (AR/AP) | `id` |
| `documents` | Media, attachments metadata | `id` |
| `activities` | Tasks, comments (staff) | `id` |
| `users` | Staff users (admin scope) | `id` |
| `global` | Unified cross-index (optional federated) | `id` |

Filterable: `company_id`, `type`, `facets.*`, `updated_at`.  
Searchable: `title`, `subtitle`, `keywords`, `body`.

### Elasticsearch Migration (Future)

Same document schema; index aliases per company shard optional. Dual-write period during migration; SearchProvider abstraction hides engine swap.

---
## 4. Global Search Bar

**UI:** Top header — `Ctrl+K` / `⌘+K` command palette style.

Integrates [ui-ux/global-search.md](../../04-uiux/standards/global-search.md).

### Behavior

| Feature | Spec |
|---------|------|
| **Placement** | Centered desktop; icon-expand mobile |
| **Debounce** | 200ms after 2+ characters |
| **Tiers** | Actions → Records → Settings → Help |
| **Grouping** | By domain in dropdown |
| **Limit** | 5 per group, 20 total in dropdown |
| **Keyboard** | ↑↓ navigate, Enter open, Esc close |
| **Full results** | `/search?q=` with module tabs |

### Result Row

```text
📦 Blue Widget — SKU-001          Products · Published · 2d ago
👤 Widget Corp                    Contacts · Customer
📋 PO-1042 — Acme Supplies        Purchase · Approved
```

### Quick Actions (Tier 1)

Role-permitted actions surfaced by prefix match:

- "Create Product" → `/catalog/products/new`
- "Create Invoice" → `/sales/invoices/new`

Registered in search action registry — not hard-coded per module.

---

## 5. Module Search

**Module search** scopes query to **current module context** — list page toolbar, same backend API with `types[]` filter.

### Module vs Global

| Aspect | Global Bar | Module Search |
|--------|------------|---------------|
| Scope | All registered domains | Current module types only |
| UI | Header / Ctrl+K | AG Grid toolbar, list filter |
| Default types | All permitted | e.g. `sales.order`, `sales.quotation` |
| Facets | Cross-module tabs | Module-specific facets (status, date) |

### Module Registration

Each module architecture doc declares searchable entities in **Search Index Registry** (§7).

```yaml
search:
  - type: sales.order
    index: orders
    fields: [order_number, contact_name, reference]
    permission: sales.order.view
    url: /sales/orders/{id}
```

### List Page Integration

- AG Grid quick filter may call local column filter OR `GET /search?types=sales.order&q=`
- Module advanced filters (left panel) combine with search query: `q + filter JSON`

### Storefront Search (Ecommerce)

Public catalog search uses **subset** of product index — `facets.channel = storefront`, published only, no admin fields (cost price excluded at index time).

---

## 6. AI Search

**AI Search** interprets natural language queries and maps to structured search — optional feature gated by `ai.access`.

### Modes

| Mode | Description | Status |
|------|-------------|--------|
| **Keyword** | Standard Meilisearch | v2 default |
| **Natural language** | "Show overdue invoices for Acme" → filters + q | v2 AI |
| **Semantic** | Embedding similarity | v4 future |
| **Voice** | Speech → text → same pipeline | future |

### NL Query Flow

```text
User: "low stock laptops in dhaka warehouse"
  → AI Search Layer parses intent
  → { types: [inventory.stock_level], facets: { category: laptops, warehouse: dhaka }, q: null }
  → Search Service (permission filtered)
  → Results
```

### AI Rules

1. AI **never bypasses** permission filter
2. Parsed query logged in search analytics + AI audit
3. User can see "interpreted as:" chips and edit filters
4. Fallback to keyword search if AI parse fails

---

## 7. Search Index Registry

Canonical registry of **searchable domains** (Step 18).

| Domain | Index Type | Key Fields | Permission |
|--------|------------|------------|------------|
| **Products** | `catalog.product` | name, sku, barcode, description | `catalog.product.view` |
| **Orders** | `commerce.order`, `sales.order` | order_number, contact, email | `commerce.order.view` / `sales.order.view` |
| **Customers** | `core.contact` | name, email, phone, company | `core.contact.view` |
| **Inventory** | `inventory.stock_item`, `inventory.warehouse` | sku, warehouse, qty | `inventory.stock.view` |
| **Purchase** | `purchase.order`, `purchase.bill`, `purchase.rfq` | number, vendor | `purchase.order.view` |
| **Sales** | `sales.quotation`, `sales.invoice`, `sales.shipment` | number, customer | `sales.order.view` |
| **CRM** | `crm.lead`, `crm.opportunity`, `crm.account` | name, email, stage | `crm.leads.view` |
| **Marketing** | `marketing.campaign`, `marketing.coupon` | name, code | `marketing.campaigns.view` |
| **Finance** | `finance.journal_entry`, `finance.ar_invoice` | entry_number, contact | `finance.journals.view` |
| **Documents** | `media.asset`, `core.attachment` | filename, tags | `core.media.view` |
| **Activities** | `core.activity`, `core.comment` | subject, body excerpt | `core.activity.view` |
| **Users** | `core.user` | name, email | `core.user.view` (admin) |

### Registry Metadata Table

**Table:** `search_index_registry`

| Field | Notes |
|-------|-------|
| `type` | `catalog.product` |
| `index_name` | Meilisearch index |
| `module` | Owner module |
| `permission_key` | Required to appear in results |
| `indexer_class` | Worker reference |
| `enabled` | Feature flag |

New domain = registry row + indexer + module manifest — no engine redesign.

---

## 8. Search Ranking

### Default Ranking (Meilisearch)

Built-in: typo tolerance, proximity, attribute weights.

### Custom Ranking Rules

| Signal | Weight | Notes |
|--------|--------|-------|
| **Exact title match** | Highest | SKU, order number |
| **Prefix match** | High | Autocomplete |
| **Recency** | Medium | `updated_at` boost 7d |
| **Record type priority** | Configurable | Orders > products for numeric query |
| **User affinity** | Low | Frequently opened records (future) |
| **Popular clicks** | Low | Global boost from analytics |

### Per-Type Overrides

| Query pattern | Boost types |
|---------------|-------------|
| All digits / PO-/SO- prefix | orders, purchase, sales |
| `@` or email shape | contacts, users |
| `#` + number | orders, invoices |

### Ranking Config

**Table:** `search_ranking_rules` — company-level optional overrides.

### Merged Results

Multi-index query: fetch top-K per index → merge by score → permission filter → re-rank → return.

---

## 9. Search Permissions

Integrates [PERMISSION_SYSTEM_ARCHITECTURE.md](../PERMISSION_SYSTEM_ARCHITECTURE.md).

### Permission Model

| Layer | Enforcement |
|-------|-------------|
| **Index time** | Only index records user roles could view (service account indexer sees all — document includes `permission_key`) |
| **Query time** | Filter: user.permissions ∩ document.permission_key |
| **Record rules** | Post-filter via record IDs user can access (expensive — prefer index-time owner/team facets) |
| **Field ACL** | Sensitive fields never in index (`cost_price`, margin) |
| **Company** | Mandatory `company_id` filter from session |

### Search-Specific Permissions

| Key | Purpose |
|-----|---------|
| `core.search.use` | Access global search |
| `core.search.admin` | Reindex, synonym manage |
| `ai.search.use` | Natural language / semantic |

### Leak Prevention

- Return **404-style omission** — no "hidden result" placeholder
- Autocomplete same rules as full search
- AI search inherits exact same filter pipeline
- Cross-company search only for platform admin (audited)

---

## 10. Search Suggestions

### Suggestion Types

| Type | Source | When |
|------|--------|------|
| **Autocomplete** | Meilisearch prefix | 2+ chars typing |
| **Recent searches** | User preference | Empty input focus |
| **Recent records** | User activity | Empty input |
| **Popular searches** | Aggregated query log | Empty input (company) |
| **Synonyms** | `search_synonyms` table | Query expansion |
| **Did you mean** | Meilisearch typo | Zero results |
| **AI suggested query** | AI layer | Complex NL input |

### Synonyms

**Table:** `search_synonyms`

| Term | Expands to |
|------|------------|
| phone | mobile, smartphone, cell |
| PO | purchase order |

Company-specific synonyms supported.

### Debounce & Cache

- Autocomplete: 200ms debounce, 60s CDN cache per query hash (public catalog)
- Popular searches: nightly aggregate job

---

## 11. Search Analytics

**Search analytics** improve ranking and UX — aggregate, GDPR-aware.

### Metrics Collected

| Metric | Use |
|--------|-----|
| **Query count** | Popular searches |
| **Zero-result queries** | Missing indexes, synonyms needed |
| **Click-through** | Which result opened |
| **Time to click** | Relevance quality |
| **Module tab usage** | Navigation insights |
| **AI parse success rate** | NL quality |

### Analytics Tables

**Table:** `search_query_log`

| Field | Notes |
|-------|-------|
| `user_id`, `company_id` | Scope |
| `query` | Text (hashable/anonymizable) |
| `types_filter` | JSON |
| `result_count` | |
| `clicked_id`, `clicked_type` | Optional |
| `latency_ms` | |
| `ai_parsed` | Boolean |

### Dashboards

Settings → Search Analytics (admin): top queries, zero results, CTR by domain.

---

## 12. Search Activity Logging

Search actions appear on **user activity timeline** and audit where configured.

### Logged Events

| Event | Activity Type |
|-------|---------------|
| Global search executed | `search.query` |
| Result clicked | `search.click` |
| Saved search created | `search.saved` |
| Admin reindex | `search.reindex` |

### Activity Payload

```json
{
  "query": "PO-1042",
  "result_count": 3,
  "types": ["purchase.order"],
  "clicked": { "type": "purchase.order", "id": "uuid" }
}
```

Integrates [ACTIVITY_CHATTER_ARCHITECTURE.md](../subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md).

### Privacy

- GDPR mode: query text stored hashed after 30 days
- User can clear recent searches in preferences
- Admin analytics uses aggregated data only

---

## 13. Search AI Integration

Integrates [AI OS Architecture](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md).

### AI Search Agent Responsibilities

| Capability | Input | Output |
|------------|-------|--------|
| **Query understanding** | NL string | Structured filters + keywords |
| **Query expansion** | Short query | Synonyms, related terms |
| **Result summarization** | Top N results | "Found 3 overdue invoices totaling ৳X" |
| **Semantic match** (future) | Query embedding | Vector nearest neighbors |
| **Voice transcribe** (future) | Audio | Text query |

### AI + Search Pipeline

```text
User query
  → [If ai.search.use] AI Search Agent parse
  → SearchService.search(structured_query)
  → Permission filter
  → [Optional] AI result summary (read-only)
  → Response
```

### Semantic Search (Future)

- Index `embedding` vector field via pgvector or Meilisearch vector
- Product descriptions, KB docs, activity bodies
- Hybrid: keyword score + semantic score weighted merge

### Voice Search (Future)

- Client Web Speech API or mobile native
- Transcript → same NL pipeline
- Feature flag: `feature_flags.search.voice`

### AI Governance

- All NL parses in `ai_audit_logs`
- AI cannot expand results beyond user permissions
- Summaries cite record links — no fabricated records

---

## Appendix A — API Overview

Base: `/api/v1/core/search/` · Auth: Bearer + `X-Company-Id`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Multi-index search `?q=&types[]=&limit=` |
| GET | `/autocomplete` | Prefix suggestions |
| GET | `/suggestions` | Recent + popular |
| POST | `/ai-parse` | NL → structured query (`ai.search.use`) |
| GET | `/saved` | User saved searches |
| POST | `/saved` | Save filter set |
| POST | `/admin/reindex` | Full reindex (`core.search.admin`) |
| GET | `/analytics` | Admin dashboard |

---

## Appendix B — Infrastructure Tables (Registry)

| Table | Purpose |
|-------|---------|
| `search_index_registry` | Domain registration |
| `search_synonyms` | Query expansion |
| `search_query_log` | Analytics |
| `search_ranking_rules` | Custom boosts |
| `saved_searches` | User saved filters |
| `search_reindex_jobs` | Admin reindex tracking |

Meilisearch holds document indexes — rebuildable from OLTP via events.

---

## Appendix C — Reindex & Recovery

| Operation | Trigger |
|-----------|---------|
| **Incremental** | Domain events (default) |
| **Full reindex** | Admin command, post-migration |
| **Company reindex** | New tenant provision |
| **Index rebuild** | Meilisearch corrupt / version upgrade |

Full reindex reads via module Service APIs — never raw cross-module SQL.

---

## Architecture Rules

| # | Rule |
|---|------|
| 1 | **One Search Service** — modules register, don't embed Meilisearch |
| 2 | **Event-driven index** — after COMMIT |
| 3 | **Permission filtered** — every query |
| 4 | **company_id mandatory** | Tenant isolation |
| 5 | **No sensitive fields in index** | cost, salary, tokens |
| 6 | **Engine abstraction** | Meilisearch now, ES later |
| 7 | **Idempotent indexers** | Upsert by document id |
| 8 | **Analytics opt-out** | GDPR configurable |
| 9 | **AI inherits RBAC** | Same as keyword search |
| 10 | **Register before index** | Search Index Registry |

### Anti-Patterns (Forbidden)

```text
❌ Module directly calls Meilisearch SDK
❌ Indexing cost_price or GL amounts in global index
❌ Skipping permission filter on autocomplete
❌ Synchronous full reindex on every product save
❌ Cross-company document in shared index without company_id filter
❌ AI semantic search bypassing permission_key
❌ Returning results for records user cannot view
```

---

## Related Documents

| Document | Role |
|----------|------|
| [search-engine.md](./search-engine.md) | Legacy draft |
| [ui-ux/global-search.md](../../04-uiux/standards/global-search.md) | UI spec |
| [EVENT_ARCHITECTURE.md](./EVENT_ARCHITECTURE.md) | Index triggers |
| [DATABASE_REGISTRY.md](../../00-foundation/registries/DATABASE_REGISTRY.md) | Entity ownership |
| [PRODUCT_MASTER_ARCHITECTURE.md](../subsystems/PRODUCT_MASTER_ARCHITECTURE.md) | Product indexing |

---

*End of Global Search Architecture — Step 18*
