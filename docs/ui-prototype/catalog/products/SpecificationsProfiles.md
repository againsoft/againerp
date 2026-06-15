# Specifications — Profiles

> **Status:** Ready (Prototype)  
> **Prototype Phase:** 1 — UI Only  
> **Module:** Catalog · Specifications  
> **Route (target):** `/catalog/specifications/profiles` · Builder: `/catalog/specifications/profiles/[id]`  
> **Route (current prototype):** `/catalog/attributes` · `/catalog/attributes/[id]`  
> **Architecture:** [SPECIFICATIONS_ARCHITECTURE.md](../../../modules/ecommerce/catalog/SPECIFICATIONS_ARCHITECTURE.md)  
> **Code:** `apps/web/src/components/attributes/attribute-profile-grid.tsx`

---

## Purpose

Manage reusable specification templates (Laptop, Mobile, Camera). **Profile Builder** is the only admin screen for groups and fields — no separate Attribute Group or Attribute menus.

## Menu Context

```
Catalog → Specifications
    ├── Profiles          ← this screen
    ├── Templates         (planned)
    ├── AI Import         (planned)
    └── AI Suggestions    (planned)
```

## UI Layout (As Built)

**Profiles list**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Specification Profiles (6)       [Import] [Export] [+ Add Profile]          │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Search] [Reset order] [Filters ▾] [Live edit ▾] [Columns ▾]               │
├─────────────────────────────────────────────────────────────────────────────┤
│ AG Grid — Profile, Code, Groups, Fields, Products, Categories, Status       │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Profile Builder**

```
┌──────────────┬────────────────────────────────────┬─────────────────┐
│ Groups       │ Specification Fields (Processor)   │ Storefront      │
│ ⋮ Processor  │ Name | Type | Filter/Compare flags │ preview table   │
│ ⋮ Display    │ + Add field                        │                 │
│ + Add group  │                                    │                 │
└──────────────┴────────────────────────────────────┴─────────────────┘
```

## Seed Data

Laptop profile: Processor, Display, Memory, Storage groups (16+ fields). Mobile profile: 3 groups.

## Planned Screens (same module)

| Screen | Route | Status |
|--------|-------|--------|
| Templates | `/catalog/specifications/templates` | TBD |
| AI Import | `/catalog/specifications/ai-import` | TBD |
| AI Suggestions | `/catalog/specifications/ai-suggestions` | TBD |

## Change History

| Date | Change |
|------|--------|
| 2026-06-12 | Profiles list + Profile Builder prototype built |
| 2026-06-12 | Renamed from Attribute Profiles → Specifications (approved architecture) |
