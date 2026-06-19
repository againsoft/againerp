# Catalog Attribute Profile Architecture

> **Status:** Superseded  
> **Superseded by:** [SPECIFICATIONS_ARCHITECTURE.md](./SPECIFICATIONS_ARCHITECTURE.md)  
> **Date:** 2026-06-12

This document has been replaced by **Catalog Specifications Module Architecture**.

### What changed

| Before | After (approved) |
|--------|------------------|
| Attribute Profile | **Specification Profile** |
| Attribute Group | **Specification Group** |
| Attribute | **Specification Field** |
| Separate Attribute Groups / Attributes menus | **Profile Builder only** — no separate menus |
| `/catalog/attribute-profiles` | `/catalog/specifications/profiles` |
| Draft status | **Approved Architecture** |

### What is unchanged

- Four-layer hierarchy: Profile → Group → Field → Product Value
- Database table names (`catalog_attribute_profiles`, etc.) — internal entities
- Product overrides, filter / compare / search flags
- AI import pipeline concept

**Read the current source of truth:** [SPECIFICATIONS_ARCHITECTURE.md](./SPECIFICATIONS_ARCHITECTURE.md)
