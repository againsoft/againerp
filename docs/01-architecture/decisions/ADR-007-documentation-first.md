# ADR-007: Documentation-First Development

> **Status:** Accepted  
> **Date:** 2026-06-12  
> **Deciders:** Platform Architecture Team

---

## Context

Large modular ERP projects fail when code diverges from architecture. AgainERP targets 100+ modules and multiple teams.

## Decision

**Documentation is source of truth.** No production code until docs are reviewed and marked **Ready**. All changes update CHANGELOG and registries.

## Consequences

### Positive

- [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) enforces workflow
- AI agents and new teams onboard from docs

### Negative

- Slower initial velocity
- Registry maintenance overhead (mitigated by generator script)

## Related Documents

- [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md)
- [DOCUMENT_REGISTRY.md](../../00-foundation/registries/DOCUMENT_REGISTRY.md)
