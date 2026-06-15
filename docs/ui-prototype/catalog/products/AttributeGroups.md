# Specification Groups (Internal)

> **Status:** Internal — No standalone admin screen  
> **Architecture:** [SPECIFICATIONS_ARCHITECTURE.md](../../../modules/ecommerce/catalog/SPECIFICATIONS_ARCHITECTURE.md)  
> **Managed in:** Profile Builder (`/catalog/specifications/profiles/[id]`)

---

## Purpose

Logical sections inside a **Specification Profile** (e.g. Processor, Display, Memory, Storage).

**Admins do not use a separate Attribute Groups menu.** All group CRUD happens inside the Profile Builder.

## Examples

Processor · Display · Memory · Storage · Graphics · Connectivity · Audio · Power · Physical · Camera · Network · Warranty · Security

## Database

Internal table: `catalog_attribute_groups` (scoped to `profile_id`).

## UI (Profile Builder only)

- Left panel: group list with drag reorder
- Inline rename, add, delete
- Collapse / expand in product spec editor

## Change History

| Date | Change |
|------|--------|
| 2026-06-12 | Marked internal — no standalone screen per approved Specifications architecture |
