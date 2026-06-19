# ADR-012: Use FastAPI and Python for Backend

> **Status:** Accepted  
> **Date:** 2026-06-12  
> **Deciders:** Platform Architecture Team  
> **Supersedes:** [ADR-002-laravel.md](./ADR-002-laravel.md)

---

## Context

AgainERP requires async APIs, DDD modular monolith, shared Python runtime with LangGraph AI OS, event-driven integration, and microservices-ready boundaries.

## Decision

Use **FastAPI** with **Python 3.11+** as the official backend. Architecture: DDD, service layer, event-driven, API-first, modular monolith in `apps/api/` with domain packages under `modules/`.

## Consequences

### Positive

- Same language as AI stack (LangGraph, pgvector tooling)
- Async performance, OpenAPI auto-docs
- Aligns with [TECHNOLOGY_CONSTITUTION.md](../../00-foundation/TECHNOLOGY_CONSTITUTION.md)

### Negative

- ADR-002 (Laravel) is superseded — update deployment and QA docs

## Related Documents

- [TECHNOLOGY_CONSTITUTION.md](../../00-foundation/TECHNOLOGY_CONSTITUTION.md)
- [api/README.md](../../05-development/api/README.md)
