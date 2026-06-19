# Reports UI Architecture

> **Status:** Draft  
> **Parent:** [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md)  
> **Backend:** [modules/ecommerce/reports/ARCHITECTURE.md](../../03-business-modules/ecommerce/reports/ARCHITECTURE.md)

---

## Purpose
Global UI standard: reports ui.

## When To Read
Read only if working on UI patterns related to reports ui.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Purpose

**Odoo-inspired** reporting UI — consistent across Ecommerce, CRM, Accounting, and all modules.

---

## Report Types

| Type | UI | Use |
|------|-----|-----|
| **Dashboard Reports** | Widget in dashboard | KPI snapshot |
| **Table Reports** | Sortable data grid | Line-item detail |
| **Chart Reports** | Line, bar, pie, area | Trends |
| **Pivot Reports** | Row × column matrix | Cross-analysis |
| **Custom Reports** | User-defined fields/filters | Ad-hoc analysis |

---

## Report Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Sales Report                    [Export ▾] [Schedule] [⋯]  │
├─────────────────────────────────────────────────────────────┤
│ Date: [Last 30 days ▾]  Company: [All ▾]  [Apply Filters]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Chart area — 40% height]                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [Data table — sortable, paginated]                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Filters

| Filter | Type |
|--------|------|
| Date range | Presets + custom |
| Company / Branch | Multi-select |
| Entity filters | Module-specific |
| Group by | Dimension selector |
| Compare | Previous period toggle |

Saved report configurations per user.

---

## Export

| Format | Use |
|--------|-----|
| **PDF** | Print-ready, branded header |
| **Excel** | XLSX with formulas preserved |
| **CSV** | Raw data export |

Export respects current filters. Large exports → async queue + notification.

---

## Pivot View

```
              │ Jan   │ Feb   │ Mar   │ Total
──────────────┼───────┼───────┼───────┼──────
Category A    │ 100   │ 120   │ 90    │ 310
Category B    │  80   │  95   │ 110   │ 285
```

Drag dimensions to rows/columns. Expand/collapse groups.

---

## Scheduling

Schedule report → email delivery → `marketing_*` or notification integration.

---

## Permissions

`{module}.report.{report_id}.read` — hide reports user cannot access.

---

## Mobile

Charts stack above table. Pivot simplified to table view. Export via share sheet.
