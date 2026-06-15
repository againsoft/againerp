# ADR-006: Event-Driven Cross-Module Integration

> **Status:** Accepted  
> **Date:** 2026-06-12  
> **Deciders:** Platform Architecture Team

---

## Context

Modules must integrate without tight coupling. Synchronous service calls alone create fragile request chains.

## Decision

Use **System Events** (`{module}.{entity}.{action}`) via Core Event Bus for async cross-module integration. Combine with synchronous **Service APIs** for read/write when immediate response needed.

## Consequences

### Positive

- Loose coupling, idempotent handlers, scalable async processing
- [framework/COMMUNICATION_CONTRACTS.md](../framework/COMMUNICATION_CONTRACTS.md)

### Negative

- Eventual consistency — handlers must be idempotent
- Debugging requires event tracing

## Related Documents

- [core/engines/EVENT_ARCHITECTURE.md](../core/engines/EVENT_ARCHITECTURE.md)
- [WORKFLOW_REGISTRY.md](../WORKFLOW_REGISTRY.md)
