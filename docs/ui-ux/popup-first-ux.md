# Popup First UX

> **Status:** Draft  
> **Parent:** [UX_SMART_INTERACTION_STANDARDS.md](./UX_SMART_INTERACTION_STANDARDS.md) §8–9

---

## Purpose

**Minimize navigation.** Simple creates and edits happen in popup, drawer, or modal — never a full page unless the entity is complex.

---

## When to Use Popup

| Use Popup | Use Full Page |
|-----------|---------------|
| Create brand, tag, category | Create product |
| Create supplier, warehouse | Create order |
| Create coupon, attribute | Product editor |
| Edit single-field relation | Multi-tab record |
| Quick customer lookup create | Customer full profile |

---

## Standard Popup Create Flow

```
1. User on Product Form
2. Brand field → [ + Add Brand ]
3. Modal opens (400px centered / full sheet mobile)
4. User fills: Name, slug (auto)
5. Save → API POST
6. Modal closes
7. Brand dropdown auto-selects new brand
8. No page reload
9. Toast: "Brand created"
```

---

## Popup Types

| Type | Width | Use |
|------|-------|-----|
| **Modal** | 400–560px | Simple create (brand, tag) |
| **Drawer** | 480px right | Medium form (supplier, warehouse) |
| **Full sheet** | 100% mobile | All popups on mobile |
| **Nested** | Max 1 level | Create brand inside product — no double stack on mobile |

---

## Popup Create Registry

| Entity | Parent Context | Permission |
|--------|----------------|------------|
| Category | Product form | `catalog.category.write` |
| Brand | Product form | `catalog.brand.write` |
| Attribute | Product form | `catalog.attribute.write` |
| Supplier | Product/Purchase | `inventory.supplier.write` |
| Tag | Product/Customer | `core.tag.write` |
| Customer Group | Customer form | `commerce.customer_group.write` |
| Filter | Catalog settings | `catalog.filter.write` |
| Coupon | Marketing | `marketing.coupon.write` |
| Warehouse | Inventory | `inventory.warehouse.write` |
| User | Any admin | `core.user.write` |

---

## Smart Relation Fields

Every relational field (`Select`, `Lookup`) includes:

```
┌─────────────────────────────────────┐
│ Brand *                             │
│ [ Search brands…            ▾ ] [+] │
│   Acme Corp                         │
│   Beta Brand                        │
│   + Create "new brand name"         │
└─────────────────────────────────────┘
```

| Action | UI |
|--------|-----|
| **Search** | Typeahead, debounced 200ms |
| **Create** | `+` or "Create …" in dropdown |
| **Edit** | Pencil on selected chip (if permitted) |
| **View** | Link icon → record drawer (read-only) |
| **Clear** | × on chip |

### Applies To

Brand · Category · Customer · Supplier · Warehouse · User · Company · Branch · Tax class · Shipping method

---

## Validation in Popup

- Inline field errors
- Save disabled until valid
- `Esc` closes with "Discard changes?" if dirty
- Focus trap while open

---

## API

Create endpoints return full record for immediate select binding:

```json
POST /api/v1/catalog/brands
→ { "data": { "id": "uuid", "name": "New Brand", "label": "New Brand" } }
```

Parent form binds `brand_id` without refetching full list.
