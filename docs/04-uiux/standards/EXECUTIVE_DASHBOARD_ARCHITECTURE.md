# AgainERP — Executive Dashboard Architecture

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 09 — Dashboard Framework Architecture  
> **Authority:** [DASHBOARD_FRAMEWORK_ARCHITECTURE.md](./DASHBOARD_FRAMEWORK_ARCHITECTURE.md)

---

## Purpose

Architecture for **Layer 04 Executive Dashboard** — cross-module business performance for leadership.

## When To Read

Read when defining executive widgets or C-suite role templates.

## Related Files

- [ROLE_BASED_DASHBOARD_ARCHITECTURE.md](./ROLE_BASED_DASHBOARD_ARCHITECTURE.md) — CEO template
- [AI_DASHBOARD_ARCHITECTURE.md](./AI_DASHBOARD_ARCHITECTURE.md) — AI Executive Summary
- [bi-system/README.md](../../03-business-modules/bi-system/README.md) — deep analytics (Level 5)

## Read Next

§2 **Sections** — one section at a time.

---

## 1. Executive Dashboard Definition

| Property | Value |
|----------|-------|
| **Dashboard type** | `dash.executive` |
| **Layer** | 04 |
| **Route** | `/executive` or `/home/executive` |
| **Permission** | `dashboard.executive.view` + module metric permissions |
| **Layout preset** | `layout.4col` — [DASHBOARD_LAYOUT_ENGINE.md](./DASHBOARD_LAYOUT_ENGINE.md) |
| **Audience** | CEO, CFO, COO, GM, board viewers |

**Rule:** Executive dashboard **aggregates** module metrics via platform services — modules expose metric APIs; executive layer does not JOIN module tables.

---

## 2. Required Sections

Each section maps to widget groups — collapse/expand on mobile.

### 2.1 Revenue

| Widget | Category | Source module |
|--------|----------|---------------|
| Total revenue KPI | kpi | sales · finance |
| Revenue trend | chart | sales |
| Revenue by channel | chart | ecommerce · sales |
| vs prior period | analytics | platform rollup |

### 2.2 Sales

| Widget | Category |
|--------|----------|
| Pipeline value | kpi |
| Win rate | kpi |
| Top deals | list |
| Sales by region | chart |

### 2.3 Inventory

| Widget | Category |
|--------|----------|
| Stock value | kpi |
| Stockout risk | alert |
| Turnover ratio | kpi |
| Warehouse utilization | chart |

### 2.4 Cash Flow

| Widget | Category |
|--------|----------|
| Cash on hand | kpi |
| Cash in / out | chart |
| AR / AP summary | analytics |
| 13-week cash forecast | chart · ai |

### 2.5 Profitability

| Widget | Category |
|--------|----------|
| Gross margin | kpi |
| Net margin | kpi |
| Profit by product line | chart |
| Expense breakdown | chart |

### 2.6 Employees

| Widget | Category |
|--------|----------|
| Headcount | kpi |
| Attrition rate | kpi |
| Open roles | list |
| Payroll cost trend | chart |

### 2.7 Projects

| Widget | Category |
|--------|----------|
| Active projects | kpi |
| At-risk projects | alert |
| Billable utilization | kpi |
| Milestone timeline | calendar |

### 2.8 Marketing

| Widget | Category |
|--------|----------|
| Campaign ROI | kpi |
| CAC / LTV | analytics |
| Lead volume | chart |
| Channel performance | chart |

### 2.9 Customer Growth

| Widget | Category |
|--------|----------|
| Active customers | kpi |
| New vs churn | chart |
| NPS / CSAT | kpi |
| Top accounts | list |

### 2.10 AI Executive Summary

| Widget | Category |
|--------|----------|
| AI Executive Summary | ai |
| AI risk rollup | ai · alert |
| AI opportunity highlights | ai · list |
| Recommended decisions | ai · quick_action |

Widget detail: [AI_DASHBOARD_ARCHITECTURE.md §2](./AI_DASHBOARD_ARCHITECTURE.md#2-ai-surfaces-required-capabilities)

---

## 3. Section Layout (Desktop)

```text
Row 1:  AI Executive Summary (12 cols)
Row 2:  Revenue KPI | Sales KPI | Cash KPI | Profit KPI
Row 3:  Revenue chart (6) | Sales pipeline (6)
Row 4:  Cash flow (6) | Customer growth (6)
Row 5:  Inventory | Marketing | Employees | Projects (3 cols each)
Row 6:  Risk alerts (12)
```

Template ID: `tpl.executive.standard`

---

## 4. Drill-Down Rules

| Interaction | Target |
|-------------|--------|
| KPI click | Module dashboard filtered to metric |
| Chart segment click | Module report or list |
| Alert click | Source record or approval |
| AI recommendation | Navigate or approved tool action |

Breadcrumbs rebuild per [BREADCRUMB_AND_ROUTING_STANDARD.md](./BREADCRUMB_AND_ROUTING_STANDARD.md).

---

## 5. Multi-Company / Consolidation

| Mode | Behavior |
|------|----------|
| Single company | Workspace switcher selects company |
| Consolidated | Executive permission sees rollup across allowed companies |
| Branch | Optional branch filter on widgets |

---

## 6. Export & Sharing

| Feature | Permission |
|---------|------------|
| PDF snapshot | `dashboard.executive.export` |
| Scheduled email | `dashboard.executive.schedule` |
| Share read-only link | `dashboard.executive.share` |

---

## 7. Relationship to BI System

| Layer | Tool |
|-------|------|
| Executive dashboard | Operational leadership — daily/weekly |
| BI System module | Deep drill-down, custom reports, data warehouse |

Executive widgets link to BI for "Explore in BI" — not duplicate BI builder on executive page.

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 09 — executive dashboard architecture |

---

**Executive Dashboard Architecture** — ten sections, one leadership view, AI summary first.
