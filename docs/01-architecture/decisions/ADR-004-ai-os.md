# ADR-004: AI OS as Central Intelligence Layer

> **Status:** Accepted  
> **Date:** 2026-06-12  
> **Deciders:** Platform Architecture Team

---

## Context

AI features span every module (content, forecasting, support). Scattered AI integrations create inconsistent audit, permissions, and credit billing.

## Decision

Build a platform-wide **AI OS** with Chief AI Agent, 14 engines, module tool registry, and mandatory audit/approval. AI accesses data **only through module APIs** — never direct database.

## Consequences

### Positive

- Unified audit, credits, permissions
- Module teams register tools via `AI.md`
- [AI_KNOWLEDGE_INDEX.md](../../00-foundation/registries/AI_KNOWLEDGE_INDEX.md) as single AI entry

### Negative

- Every module must document AI tools
- Additional latency vs direct queries (intentional security trade-off)

## Related Documents

- [modules/ai/AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md)
- [modules/ai/AI_FIRST_ARCHITECTURE.md](../../06-ai/platform/ai/AI_FIRST_ARCHITECTURE.md)
- [AI_KNOWLEDGE_INDEX.md](../../00-foundation/registries/AI_KNOWLEDGE_INDEX.md)
