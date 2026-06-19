# Component Attribute Engine

> **Status:** Implemented (prototype + API foundation)  
> **Admin:** `/configurator/attributes`  
> **API:** `/api/v1/configurator/attributes/`  
> **Reuses:** Catalog attribute field types per [SPECIFICATIONS_ARCHITECTURE.md](../ecommerce/catalog/SPECIFICATIONS_ARCHITECTURE.md)

---

## Purpose

Every configurator **component category** (CPU, Motherboard, RAM, CCTV Camera…) is controlled by **dynamic attributes** with normalized storage and a validation layer for compatibility rules.

| Component | Example attributes |
|-----------|-------------------|
| CPU | Socket, Generation, Core Count, Thread Count, TDP |
| Motherboard | Socket, Chipset, RAM Type |
| RAM | Type, Speed, Capacity |

---

## Supported field types

| Type | Normalized column |
|------|-------------------|
| `text` | `text_value` |
| `number` | `number_value` |
| `boolean` | `boolean_value` |
| `dropdown` | `option_ids` (single) + `text_value` (label) |
| `multi_select` | `option_ids` (array) |

---

## Architecture

```
Configurator Attribute Profile (per component category)
    └── Attribute Fields (drag-and-drop order)
            └── Field Options (dropdown / multi_select)
                    └── Component Attribute Values (per product, normalized)
```

### Tables

| Table | Purpose |
|-------|---------|
| `configurator_attribute_profiles` | CPU, RAM, Motherboard profiles |
| `configurator_attribute_fields` | Socket, TDP, Chipset, etc. |
| `configurator_attribute_field_options` | LGA1700, AM5, DDR5… |
| `configurator_component_attribute_values` | Normalized product values |

---

## Code map

### Frontend (admin UI)

| File | Role |
|------|------|
| `lib/attributes/field-types.ts` | Shared field type constants |
| `lib/attributes/normalize-attribute-value.ts` | Raw → normalized columns |
| `lib/attributes/validate-attribute-values.ts` | Validation layer |
| `lib/mock-data/configurator-attributes.ts` | Seed profiles (CPU, RAM, Mobo) |
| `lib/store/configurator-attribute-store.ts` | Zustand persist |
| `components/configurator/configurator-attribute-profiles-list.tsx` | Profile list + drag order |
| `components/configurator/configurator-attribute-profile-builder.tsx` | Field builder |
| `components/configurator/configurator-sortable-list.tsx` | Drag-and-drop |
| `components/configurator/configurator-attribute-value-tester.tsx` | Live validation |

### Backend

| File | Role |
|------|------|
| `services/attribute_engine_service.py` | Business logic + validation |
| `routes/attributes.py` | REST API |
| `schemas/attributes.py` | Pydantic contracts |

---

## API endpoints

| Method | Path | Permission |
|--------|------|------------|
| GET | `/attributes/profiles` | `configurator.view` |
| POST | `/attributes/profiles` | `configurator.create` |
| POST | `/attributes/profiles/reorder` | `configurator.edit` |
| POST | `/attributes/fields` | `configurator.create` |
| PATCH | `/attributes/fields/{uuid}` | `configurator.edit` |
| POST | `/attributes/fields/reorder` | `configurator.edit` |
| POST | `/attributes/validate` | `configurator.view` |
| POST | `/attributes/values` | `configurator.edit` |

---

## Normalized value example

CPU product with Socket=LGA1700, TDP=125:

```json
[
  { "field_code": "socket", "text_value": "LGA 1700", "option_ids": ["opt_lga1700"] },
  { "field_code": "tdp", "number_value": 125 }
]
```

Compatibility rules compare `socket` across CPU ↔ Motherboard profiles.

---

## Persist key

`againerp-configurator-attributes` (browser localStorage, prototype)
