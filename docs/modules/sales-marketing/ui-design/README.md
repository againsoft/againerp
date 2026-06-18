# Sales & Marketing — UI Design Index

> **Status:** Draft (Planning)  
> **Phase:** UI Design documentation  
> **Module route:** `/sales-marketing/*`  
> **Build guide:** [SMW_UI_BUILD_GUIDE.md](../SMW_UI_BUILD_GUIDE.md)

---

## How to use this folder

1. **Read UI design docs** (this folder) — layout, screens, interactions.  
2. **Implement one step at a time** — say **“Impl Step 01”** (or **“Next”**) in Agent mode.  
3. **Do not skip** master layout (UI-01) before feature screens.

**No frontend code in UI design docs** — wireframes, zones, URL contracts, and component *names* only.

---

## UI design steps

| Step | Document | Route(s) | Doc status | Code status |
|------|----------|----------|------------|-------------|
| UI-01 | [01_MASTER_LAYOUT_UI.md](./01_MASTER_LAYOUT_UI.md) | `/sales-marketing/*` | ✅ Ready | ⬜ Pending |
| UI-02 | [02_DASHBOARD_UI_DESIGN.md](./02_DASHBOARD_UI_DESIGN.md) | `/sales-marketing`, `/dashboard` | ✅ Ready | ⬜ Pending |
| UI-03 | [03_LEAD_MANAGEMENT_UI_DESIGN.md](./03_LEAD_MANAGEMENT_UI_DESIGN.md) | `/sales-marketing/leads` | ✅ Ready | ⬜ Pending |
| UI-04 | [04_OPPORTUNITY_PIPELINE_UI_DESIGN.md](./04_OPPORTUNITY_PIPELINE_UI_DESIGN.md) | `/sales-marketing/opportunities` | ✅ Ready | ⬜ Pending |
| UI-05 | [05_QUOTATION_BUILDER_UI_DESIGN.md](./05_QUOTATION_BUILDER_UI_DESIGN.md) | `/sales-marketing/quotations` | ✅ Ready | ⬜ Pending |
| UI-06 | Campaign workspace | `/sales-marketing/campaigns` | ⬜ Planned | ⬜ Pending |
| UI-07 | Activity center | `/sales-marketing/activities` | ⬜ Planned | ⬜ Pending |
| UI-08 | Targets & KPI | `/sales-marketing/targets` | ⬜ Planned | ⬜ Pending |
| UI-09 | Commission | `/sales-marketing/commission` | ⬜ Planned | ⬜ Pending |
| UI-10 | Team management | `/sales-marketing/teams` | ⬜ Planned | ⬜ Pending |
| UI-11 | Reporting | `/sales-marketing/reports` | ⬜ Planned | ⬜ Pending |
| UI-12 | AI command center | `/sales-marketing/ai` | ⬜ Planned | ⬜ Pending |
| UI-13 | Settings | `/sales-marketing/settings` | ⬜ Planned | ⬜ Pending |

---

## Implementation mapping (when you say “Next”)

| You say | We build |
|---------|----------|
| **Impl Step 01** / **Next** (first time) | Shell: layout, sidebar, nav, breadcrumb |
| **Impl Step 02** | Dashboard |
| **Impl Step 03** | Lead list + drawer + 360 page |
| **Impl Step 04** | Opportunity pipeline (kanban) |
| **Impl Step 05** | Quotation list + builder |

---

## Mandatory UI rules

From [PROJECT_COMMON_RULES.md](../../../PROJECT_COMMON_RULES.md):

- **CRUD** = list page + right **Sheet** drawer — `?create=1` · `?view={id}` · `?edit={id}`  
- **Never** `/new` or `/[id]/edit` for standard entity CRUD  
- **Exception:** full **360** pages at `/leads/[id]`, `/opportunities/[id]` (deep links)  
- **Mobile-first:** full-width drawer, 44px tap targets, card fallback  

---

**Last updated:** 2026-06-18
