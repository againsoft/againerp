# ADR-008: Unified Contacts — No Per-Module Customer Tables

> **Status:** Accepted  
> **Date:** 2026-06-12  
> **Deciders:** Platform Architecture Team

---

## Context

Ecommerce customers, CRM leads, hospital patients, and school students are all **parties**. Separate `customers`, `patients`, `students` tables duplicate data.

## Decision

Use Core **`contacts`** table with `contact_type` for all parties. Module-specific data lives in module extension tables keyed by `contact_id`.

## Consequences

### Positive

- Single customer view across modules
- [core/entities/contacts.md](../../02-core-platform/entities/contacts.md)

### Negative

- Complex party types need careful schema design
- Module queries always join or filter by type

## Related Documents

- [core/shared-entities.md](../../02-core-platform/shared-entities.md)
- [DATABASE_REGISTRY.md](../../00-foundation/registries/DATABASE_REGISTRY.md)
