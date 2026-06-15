# ADR-009: Universal Module Framework for Industry Verticals

> **Status:** Accepted  
> **Date:** 2026-06-12  
> **Deciders:** Platform Architecture Team

---

## Context

AgainERP must support unlimited industry modules (Hospital, School, Hotel, …) without platform redesign.

## Decision

All modules — ERP, commerce, industry — use identical **9-file package**, Core Services foundation, and install/remove/upgrade lifecycle via ModuleManifest.

## Consequences

### Positive

- [UNIVERSAL_MODULE_FRAMEWORK.md](../UNIVERSAL_MODULE_FRAMEWORK.md)
- Predictable structure for 100+ modules

### Negative

- Initial framework documentation investment
- Legacy modules must converge on standard

## Related Documents

- [UNIVERSAL_MODULE_FRAMEWORK.md](../UNIVERSAL_MODULE_FRAMEWORK.md)
- [MODULE_REGISTRY.md](../MODULE_REGISTRY.md)
