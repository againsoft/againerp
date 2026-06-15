# Smart Admin Lists

> **Status:** Draft  
> **Parent:** [UX_SMART_INTERACTION_STANDARDS.md](./UX_SMART_INTERACTION_STANDARDS.md) §7  
> **Related:** [tables.md](./tables.md)

---

## Purpose

Excel-grade productivity on all admin data tables.

---

## Inline Edit

| Column Type | Interaction |
|-------------|-------------|
| Text | Click → input → blur/Enter saves |
| Number (price, stock) | Click → number input |
| Status | Click → dropdown |
| Boolean | Toggle switch |
| Date | Date picker popup |

**Save:** Per-cell on blur or batch "Save changes" bar when multiple cells dirty.

**Cancel:** `Esc` reverts cell.

---

## Inline Actions by Entity

### Products

| Column | Inline Edit |
|--------|-------------|
| Name | ✓ |
| SKU | ✓ |
| Price | ✓ |
| Stock | ✓ |
| Status | ✓ dropdown |

### Orders

| Column | Inline Edit |
|--------|-------------|
| Status | ✓ (permission gated) |
| Notes | ✓ quick note popup |

### Inventory

| Column | Inline Edit |
|--------|-------------|
| Quantity | ✓ |
| Reorder level | ✓ |

### Coupons

| Column | Inline Edit |
|--------|-------------|
| Active | ✓ toggle |
| Usage limit | ✓ |

---

## Excel-Style Editing

| Key | Action |
|-----|--------|
| `Tab` | Next editable cell |
| `Shift+Tab` | Previous cell |
| `Enter` | Save + move down |
| `Esc` | Cancel edit |
| `Ctrl+V` | Paste tab-separated values into selection |
| Arrow keys | Navigate when not editing |

Paste from Excel/Sheets maps columns by header match.

---

## Quick Actions (Row)

`⋯` menu per row:

- View · Edit · Duplicate · Archive · Delete
- Entity-specific: "Adjust stock", "Resend email"

Swipe actions on mobile: Edit · Archive

---

## Bulk Actions

Select rows → floating toolbar:

```
3 selected  [Update Status ▾] [Export] [Delete] [✕]
```

Confirm destructive actions in modal.

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `↑` `↓` | Move row focus |
| `Space` | Toggle row select |
| `Enter` | Open record |
| `Ctrl+A` | Select all on page |

---

## Optimistic UI

Show new value immediately → revert on API error with toast.

---

## Permissions

Inline edit only on columns user has `write` permission for. Read-only cells: no edit cursor.
