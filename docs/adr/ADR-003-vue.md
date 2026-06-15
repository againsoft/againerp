# ADR-003: Use Vue 3 for Admin Frontend

> **Status:** Superseded by [ADR-011-nextjs-typescript.md](./ADR-011-nextjs-typescript.md)  
> **Date:** 2026-06-12  
> **Deciders:** Platform Architecture Team

---

## Context

Admin UI requires reactive components, SPA navigation, mobile responsiveness, and alignment with enterprise ERP patterns (Odoo-inspired shell).

## Decision

Use **Vue 3** with Composition API for the AgainERP admin panel. UI follows [ENTERPRISE_UI_ARCHITECTURE.md](../ui-ux/ENTERPRISE_UI_ARCHITECTURE.md).

## Consequences

### Positive

- Progressive adoption, strong component model, good mobile story
- Fits API-first backend

### Negative

- Separate frontend build pipeline
- Phase 1 uses UI prototype docs before Vue implementation

## Related Documents

- [ui-ux/ENTERPRISE_UI_ARCHITECTURE.md](../ui-ux/ENTERPRISE_UI_ARCHITECTURE.md)
- [UI_PROTOTYPE_STRATEGY.md](../UI_PROTOTYPE_STRATEGY.md)
