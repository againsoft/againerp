# Status System

> **Status:** Draft  
> **Parent:** [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md)  
> **Tokens:** [design-system.md](./design-system.md)

---

## Purpose
Global UI standard: status system.

## When To Read
Read only if working on UI patterns related to status system.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Purpose

**Universal status colors** across all modules. One semantic system — no module-specific color meanings.

---

## Status Tokens

| Status | CSS Token | Background | Text | Icon |
|--------|-----------|------------|------|------|
| **Success** | `--status-success` | Green-50 | Green-700 | ✓ |
| **Warning** | `--status-warning` | Amber-50 | Amber-700 | ⚠ |
| **Danger** | `--status-danger` | Red-50 | Red-700 | ✕ |
| **Info** | `--status-info` | Cyan-50 | Cyan-700 | ℹ |
| **Pending** | `--status-pending` | Blue-50 | Blue-700 | ◷ |
| **Draft** | `--status-draft` | Gray-100 | Gray-600 | ○ |
| **Approved** | `--status-approved` | Green-50 | Green-800 | ✓ |
| **Rejected** | `--status-rejected` | Red-50 | Red-800 | ✕ |
| **Archived** | `--status-archived` | Gray-100 | Gray-500 | ⊘ |

Dark mode: use `-subtle` background variants per [dark-mode.md](./dark-mode.md).

---

## Badge Component

```html
<span class="badge badge--success">Paid</span>
<span class="badge badge--pending">Processing</span>
<span class="badge badge--draft">Draft</span>
```

| Rule | Detail |
|------|--------|
| Always include label text | Never color-only |
| Optional icon | Left of label |
| Size | `sm` (table), `md` (header), `lg` (summary) |

---

## Module Mapping (Examples)

| Module | State | Status Token |
|--------|-------|--------------|
| Orders | paid | success |
| Orders | pending_payment | pending |
| Orders | cancelled | danger |
| Products | published | success |
| Products | draft | draft |
| Products | archived | archived |
| Inventory | in_stock | success |
| Inventory | low_stock | warning |
| Inventory | out_of_stock | danger |
| Approvals | approved | approved |
| Approvals | rejected | rejected |

Modules map workflow states to status tokens in `UI.md` — never invent new colors.

---

## Table Row Status

Optional left border accent by status:

| Token | Border |
|-------|--------|
| danger | 3px left red |
| warning | 3px left amber |
| success | none |

---

## Accessibility

- Contrast ratio ≥ 4.5:1 for badge text
- `aria-label` includes status: "Order status: Pending payment"
- Status changes announced via `aria-live="polite"` in record header
