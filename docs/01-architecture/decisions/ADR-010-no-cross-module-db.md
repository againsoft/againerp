# ADR-010: No Cross-Module Direct Database Access

> **Status:** Accepted  
> **Date:** 2026-06-12  
> **Deciders:** Platform Architecture Team

---

## Context

Direct cross-module JOINs and writes create ownership ambiguity, migration coupling, and tenant isolation risks.

## Decision

**Forbidden:** Module A reading or writing Module B tables. **Allowed:** Core tables, own module tables, Services, Events, APIs, Workflows.

## Consequences

### Positive

- Clear table ownership per [DATABASE_REGISTRY.md](../../00-foundation/registries/DATABASE_REGISTRY.md)
- Modules independently installable/upgradable

### Negative

- More service/API surface area
- Some queries require application-layer composition

## Related Documents

- [UNIVERSAL_MODULE_FRAMEWORK.md](../../00-foundation/UNIVERSAL_MODULE_FRAMEWORK.md)
- [DependencyMap.md](../DependencyMap.md)
