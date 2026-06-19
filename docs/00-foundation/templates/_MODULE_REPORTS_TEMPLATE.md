# Reports — {Module}

> **Status:** Draft  
> **Module:** {Module}  
> **Document Type:** Reports index (Level 5 SSOT)

---

## Purpose

Index of **{Module}** operational reports — links to report architecture and admin screen specs. **No duplicate report definitions.**

## When To Read

Read when implementing or documenting a {Module} report screen, export, or scheduled report.

## Related Files

- [Architecture.md](Architecture.md) — reports impact summary
- [UI.md](UI.md) — Reports menu group
- [Database.md](Database.md) — source tables

## Read Next

- One screen under `Menus/Reports/` for field-level spec
- Optional deep dive: `{module}/reports/ARCHITECTURE.md` if report engine is complex

---

## Scope

| Layer | SSOT |
|-------|------|
| **Report engine & data model** | `reports/ARCHITECTURE.md` (if sub-area exists) OR Database.md |
| **Per-report screen spec** | `Menus/Reports/{Report}.md` — open ONE file |
| **This file** | Navigation index only |

---

## Admin Report Screens (Menus/Reports/)

_Add rows as reports are defined. Do not bulk-read the folder._

| Report | Doc |
|--------|-----|
| _Report name_ | [Menus/Reports/_Report name_.md](Menus/Reports/) |

**Folder index:** [Menus/Reports/](Menus/Reports/) — use table above.

---

## Report Catalog (summary)

| Report ID | Source tables | Export | Schedule |
|-----------|---------------|--------|----------|
| `{module}.example.summary` | `{prefix}_example` | CSV, PDF | optional |

_Detailed aggregation logic in Database.md or reports/ARCHITECTURE.md — not duplicated here._

---

## Permissions

| Permission | Scope |
|------------|-------|
| `{module}.reports.view` | View all module reports |
| `{module}.reports.export` | Export (if separate) |

---

## Platform Integration

- Feeds BI dashboards when applicable — link to [bi-system](../../03-business-modules/bi-system/)
- Scheduled reports via platform job engine (TBD)

---

**Module:** {Module} · **Last Updated:** {DATE} · **Maintainer:** {team}
