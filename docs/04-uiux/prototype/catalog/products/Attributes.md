# Specification Fields (Internal)

> **Status:** Internal — No standalone admin screen  
> **Architecture:** [SPECIFICATIONS_ARCHITECTURE.md](../../../../03-business-modules/ecommerce/catalog/SPECIFICATIONS_ARCHITECTURE.md)  
> **Managed in:** Profile Builder (`/catalog/specifications/profiles/[id]`)

---

## Purpose

Individual specification field definitions within a **Specification Group** (e.g. CPU Brand, Display Size, RAM).

**Admins do not use a separate Attributes menu.** All field CRUD happens inside the Profile Builder.

## Field Configuration

Name · Code · Field Type · Required · Filterable · Comparable · Searchable · AI Searchable · Visible · Sort Order · Status · Default Value · Unit · Help Text

## Supported Field Types

Text · Textarea · Number · Decimal · Dropdown · Multi Select · Checkbox · Radio · Boolean · Date · Color · Image · URL · File · Rich Text

## Database

Internal tables: `catalog_attributes`, `catalog_attribute_values` (options).

## UI (Profile Builder only)

- Center panel: field table per selected group
- Add / edit field dialog with type picker and capability flags
- Drag reorder within group
- Storefront preview pane (right)

## Change History

| Date | Change |
|------|--------|
| 2026-06-12 | Marked internal — no standalone screen per approved Specifications architecture |
