# Reports — Ecommerce

## Purpose

Index of commerce operational reports — links to report architecture and admin screen specs. No duplicate report definitions.

## When To Read

Read when implementing or documenting an Ecommerce report screen, export, or scheduled report.

## Related Files

- [Architecture](Architecture.md) — § Reports Impact summary
- [UI](UI.md) — Reports menu group (14 screens)
- [reports/ARCHITECTURE.md](reports/ARCHITECTURE.md) — reports domain deep dive

## Read Next

- [reports/ARCHITECTURE.md](reports/ARCHITECTURE.md) — aggregation model and report types
- One screen under [Menus/Reports/](Menus/Reports/) for field-level spec

---

> **Status:** Active  
> **Module:** Ecommerce  
> **Document Type:** Reports index (deep dive)  
> **Menu group:** Ecommerce → Reports (14 screens)

---

## Scope

Ecommerce reports cover sales, catalog, customers, inventory, marketing, tax, profit, SEO, affiliates, and AI-assisted analytics. Detailed report engine design lives in the **reports sub-area** architecture doc — this file is the **navigation index** only.

| Layer | SSOT |
|-------|------|
| **Report engine & data model** | [reports/ARCHITECTURE.md](reports/ARCHITECTURE.md) |
| **Per-report screen spec** | `Menus/Reports/{Report}.md` — open ONE file |
| **Dashboard widgets** | [dashboard/ARCHITECTURE.md](dashboard/ARCHITECTURE.md) |
| **Analytics aggregation** | [analytics/ARCHITECTURE.md](analytics/ARCHITECTURE.md) |

---

## Admin Report Screens (Menus/Reports/)

| Report | Doc |
|--------|-----|
| Sales Reports | [Menus/Reports/Sales Reports.md](Menus/Reports/Sales%20Reports.md) |
| Product Reports | [Menus/Reports/Product Reports.md](Menus/Reports/Product%20Reports.md) |
| Customer Reports | [Menus/Reports/Customer Reports.md](Menus/Reports/Customer%20Reports.md) |
| Inventory Reports | [Menus/Reports/Inventory Reports.md](Menus/Reports/Inventory%20Reports.md) |
| Marketing Reports | [Menus/Reports/Marketing Reports.md](Menus/Reports/Marketing%20Reports.md) |
| Return Reports | [Menus/Reports/Return Reports.md](Menus/Reports/Return%20Reports.md) |
| Profit Reports | [Menus/Reports/Profit Reports.md](Menus/Reports/Profit%20Reports.md) |
| Tax Reports | [Menus/Reports/Tax Reports.md](Menus/Reports/Tax%20Reports.md) |
| Category Reports | [Menus/Reports/Category Reports.md](Menus/Reports/Category%20Reports.md) |
| Brand Reports | [Menus/Reports/Brand Reports.md](Menus/Reports/Brand%20Reports.md) |
| SEO Reports | [Menus/Reports/SEO Reports.md](Menus/Reports/SEO%20Reports.md) |
| Affiliate Reports | [Menus/Reports/Affiliate Reports.md](Menus/Reports/Affiliate%20Reports.md) |
| AI Reports | [Menus/Reports/AI Reports.md](Menus/Reports/AI%20Reports.md) |
| Custom Reports | [Menus/Reports/Custom Reports.md](Menus/Reports/Custom%20Reports.md) |

**Folder index:** [Menus/Reports/](Menus/Reports/) — do not bulk-read.

---

## Architecture Summary (pointer)

From [Architecture.md](Architecture.md): module-owned reports feed Sales, Customer, and Product dashboards and export to the platform Reporting Engine. Full schemas, schedules, and `analytics_*` integration: [reports/ARCHITECTURE.md](reports/ARCHITECTURE.md).

---

**Module:** Ecommerce · **Last Updated:** 2026-06-19
