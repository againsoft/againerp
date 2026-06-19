# AI Context Engine

> **Status:** Draft  
> **Parent:** [AI_FIRST_ARCHITECTURE.md](./AI_FIRST_ARCHITECTURE.md)

---

## Purpose
AI OS platform architecture and engines.

## When To Read
Read only when working on AI OS platform, agents, tools, or audit.

## Related Files
- [AI OS architecture](AI_OS_ARCHITECTURE.md)
- [Cursor entry](../../../BRAIN.md)

## Read Next
- [AI experience specs](../../experience/README.md)

---

## Purpose

Automatically assemble everything AI needs to understand **company, branch, role, record, and history** — without user-provided context blocks.

---

## Context Bundle Structure

```json
{
  "session": {
    "company_id": "uuid",
    "branch_id": "uuid",
    "user_id": "uuid",
    "roles": ["catalog_manager"],
    "locale": "en",
    "timezone": "Asia/Dhaka",
    "route": "/admin/catalog/products/uuid",
    "module": "catalog"
  },
  "record": {
    "type": "catalog.product",
    "id": "uuid",
    "snapshot": { "name": "...", "sku": "...", "status": "draft" }
  },
  "related": {
    "stock_total": 142,
    "order_count_30d": 24
  },
  "rag_chunks": [
    { "source": "catalog.product", "text": "...", "score": 0.89 }
  ],
  "analytics": {
    "sales_7d": 45000,
    "trend": "up_12pct"
  },
  "permissions": {
    "can_write_price": false,
    "can_publish": true
  }
}
```

---

## Assembly Order

1. **Session** — from auth middleware + user preferences
2. **Record** — from current route param via module adapter
3. **Related** — smart button aggregates (cached 60s)
4. **RAG** — vector search `ai_embeddings` filtered by company + permission
5. **Analytics** — pre-aggregated `analytics_*` slices
6. **Permissions** — capability flags for action bounds
7. **Trim** — fit token budget; drop lowest-score RAG first

---

## RAG Rules

| Rule | Detail |
|------|--------|
| Company filter | Mandatory on all embedding queries |
| Permission filter | Only embed sources user can read |
| Top-k | Default 5 chunks, max 20 |
| Chunk size | 512 tokens with 64 overlap |
| Freshness | Re-embed on entity update event |

---

## Context Without Manual Input

User asks: *"Should I reorder this product?"*

Engine auto-includes: product snapshot, stock levels, sales velocity, lead time, seasonal forecast — user never pastes data.

---

## Debug & Compliance

`ai_context_snapshots` stores hashed context bundle for audit replay (admin only, PII-redacted).
