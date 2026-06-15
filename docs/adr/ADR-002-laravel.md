# ADR-002: Use Laravel for Backend Framework

> **Status:** Superseded by [ADR-012-fastapi-python.md](./ADR-012-fastapi-python.md)  
> **Date:** 2026-06-12  
> **Deciders:** Platform Architecture Team

---

## Context

AgainERP needs modular PHP backend with ORM, queues, events, API resources, and large ecosystem — aligned with Odoo-style ERP extensibility.

## Decision

Use **Laravel** (latest LTS) as the primary backend framework. Module boundaries implemented as Laravel modules/packages.

## Consequences

### Positive

- Mature ORM, queues, events, Sanctum/Passport auth
- Large hiring pool and package ecosystem

### Negative

- PHP runtime limits for CPU-heavy AI (offload to AI OS services)
- Module isolation requires discipline beyond Laravel defaults

## Related Documents

- [DEVELOPMENT_STANDARDS.md](../DEVELOPMENT_STANDARDS.md)
- [PRD.md](../PRD.md)
