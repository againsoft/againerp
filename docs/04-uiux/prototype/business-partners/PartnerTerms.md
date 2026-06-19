# Partner Terms — UI Spec (Planned)

> **Status:** Draft (Planning)  
> **Location:** Partner view drawer → **Terms** tab  
> **Also:** Create/Edit form → per-role collapsible sections

---

## Purpose

Commercial terms differ by **role** — vendor Net 30 + 14-day lead time ≠ wholesaler Net 15 + credit limit.

One partner with `vendor` + `wholesaler` roles shows **two term blocks**.

---

## Terms tab layout

```text
┌─ Vendor terms ─────────────────────────────────────┐
│ Payment: Net 30 · Currency: BDT · Incoterms: FOB    │
│ Lead time: 14 days · MOQ: ৳50,000                   │
│ [Edit vendor terms]                                 │
└────────────────────────────────────────────────────┘

┌─ Wholesaler terms ─────────────────────────────────┐
│ Payment: Net 15 · Credit limit: ৳500,000            │
│ Min order: ৳10,000 · Territory: National            │
│ [Edit wholesaler terms]                             │
└────────────────────────────────────────────────────┘
```

---

## Fields per role

| Field | Vendor | Wholesaler | Retailer |
|-------|--------|------------|----------|
| Payment terms | ✓ | ✓ | ✓ |
| Currency | ✓ | ✓ | ✓ |
| Incoterms | ✓ | | |
| Lead time (days) | ✓ | | |
| MOQ (qty / value) | ✓ | ✓ | |
| Credit limit | | ✓ | ✓ |
| Tax profile | ✓ | ✓ | ✓ |
| Bank reference | ✓ | | |
| Effective dates | ✓ | ✓ | ✓ |

---

## Edit mode

Inline edit in view drawer **or** switch to `?edit={id}` with Terms section expanded.

**Validation:**

- Terms block only if role is enabled
- `effective_to` ≥ `effective_from`
- Credit limit required for wholesaler/retailer if credit enabled

---

## Consumer module defaults

| When | Behavior |
|------|----------|
| Create PO (vendor) | Pre-fill payment terms + lead time from vendor terms |
| Create SO (wholesaler) | Pre-fill payment + credit check |
| Terms updated | Toast `bp.partner.terms.updated` (mock) |

---

## Mobile

- Term blocks stack vertically
- Edit opens full-width sub-drawer or expand accordion

---

**Last Updated:** 2026-06-17
