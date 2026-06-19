# AgainERP — Module Dashboard Standard

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 09 — Dashboard Framework Architecture  
> **Authority:** [DASHBOARD_FRAMEWORK_ARCHITECTURE.md](./DASHBOARD_FRAMEWORK_ARCHITECTURE.md) · [MODULE_NAVIGATION_STANDARD.md](./MODULE_NAVIGATION_STANDARD.md)

---

## Purpose

Required **Layer 03 Module Dashboard** structure — every installable module must implement these sections and register widgets.

## When To Read

Read when completing module `UI.md` dashboard section or `ModuleManifest.md` widget list.

## Related Files

- [WIDGET_REGISTRY_STANDARD.md](./WIDGET_REGISTRY_STANDARD.md) — registration schema
- [MODULE_GENERATOR_GUIDE.md](../../MODULE_GENERATOR_GUIDE.md) — new module package
- Module example: [ecommerce/dashboard/ARCHITECTURE.md](../../03-business-modules/ecommerce/dashboard/ARCHITECTURE.md)

## Read Next

§2 **Required sections** only.

---

## 1. Module Dashboard Definition

| Property | Value |
|----------|-------|
| **Dashboard type** | `dash.module` |
| **Route** | `/{module}/dashboard` |
| **Nav zone** | Level 2 — Dashboard tab |
| **Shell** | `WS-CONTENT-DASH` |
| **Layout preset** | `layout.3col` (default) |

---

## 2. Required Sections

Every module dashboard **must** include these seven sections (widget groups):

| # | Section | Purpose | Min widgets |
|---|---------|---------|-------------|
| 1 | **Overview** | Module summary strip — status, date range, key headline | 1 |
| 2 | **KPI Summary** | 3–6 primary KPIs | 3 |
| 3 | **Recent Activities** | Timeline of module events | 1 |
| 4 | **Pending Tasks** | Approvals, assignments, open items | 1 |
| 5 | **Reports** | Shortcuts to key reports | 1 |
| 6 | **AI Suggestions** | Recommendations (or hidden if no AI) | 0–1 |
| 7 | **Quick Actions** | Create / navigate shortcuts | 1 |

**Compliance:** Sections 1–5 and 7 required for all business modules. Section 6 required when module has `AI.md` with tools.

---

## 3. Section → Widget Category Mapping

| Section | Allowed categories |
|---------|-------------------|
| Overview | analytics · kpi |
| KPI Summary | kpi · chart |
| Recent Activities | activity · list |
| Pending Tasks | list · alert · calendar |
| Reports | report · quick_action |
| AI Suggestions | ai |
| Quick Actions | quick_action |

---

## 4. Standard Layout Template

Template ID: `tpl.module.standard`

```text
Row 1:  Overview strip (12 cols)
Row 2:  KPI | KPI | KPI | KPI  (3 cols × 4)
Row 3:  Chart (8) | Quick Actions (4)
Row 4:  Recent Activities (6) | Pending Tasks (6)
Row 5:  Reports shortcuts (6) | AI Suggestions (6)
```

Modules may reorder in manifest default — all seven sections must remain present.

---

## 5. Module Examples

### 5.1 Sales Module Dashboard

| Section | Widgets |
|---------|---------|
| Overview | Period revenue vs target |
| KPI Summary | Quotations open · Orders today · Invoiced MTD · Delivery backlog |
| Recent Activities | Latest order events |
| Pending Tasks | Quotes awaiting approval |
| Reports | Link: Sales by period, Product sales |
| AI Suggestions | AI opportunities |
| Quick Actions | New quotation · New order |

### 5.2 CRM Module Dashboard

| Section | Widgets |
|---------|---------|
| Overview | Pipeline health score |
| KPI Summary | New leads · Conversion rate · Open opportunities · Activities due |
| Recent Activities | Lead/opportunity timeline |
| Pending Tasks | Follow-ups today |
| Reports | Pipeline aging, Lead conversion |
| AI Suggestions | Lead scoring highlights |
| Quick Actions | New lead · Log activity |

### 5.3 Ecommerce Module Dashboard

Doc sub-area: [ecommerce/dashboard/ARCHITECTURE.md](../../03-business-modules/ecommerce/dashboard/ARCHITECTURE.md)

| Section | Widgets |
|---------|---------|
| Overview | Store performance today |
| KPI Summary | Orders · Revenue · Visitors · Conversion |
| Recent Activities | Order feed |
| Pending Tasks | Orders to fulfill · Low stock |
| Reports | Sales reports, Product reports |
| AI Suggestions | AI sales forecast |
| Quick Actions | Add product · View orders |

---

## 6. Registration Checklist

| # | Task | File |
|---|------|------|
| 1 | List widgets per section | `UI.md` § Dashboard |
| 2 | Register widgets | `ModuleManifest.md` → `dashboard.widgets[]` |
| 3 | Metric APIs | `API.md` → `/metrics/` endpoints |
| 4 | Permissions | `Permissions.md` per widget |
| 5 | Role default (optional) | Link to role template ID |

---

## 7. Empty / Thin Modules

Utility modules with no KPIs:

| Rule | Detail |
|------|--------|
| Minimum | Overview + Quick Actions linking to Operations |
| Hide KPI row | Allowed with manifest justification |
| Dashboard tab | May redirect to primary Operations screen |

---

## 8. Industry Module Dashboards

Industry packages use **Layer 05** dashboard as primary — may extend module dashboard with vertical widgets.

See [DASHBOARD_FRAMEWORK_ARCHITECTURE.md §2 Layer 05](./DASHBOARD_FRAMEWORK_ARCHITECTURE.md#layer-05--industry-dashboard).

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 09 — module dashboard standard |

---

**Module Dashboard Standard** — seven sections, every module, registered widgets.
