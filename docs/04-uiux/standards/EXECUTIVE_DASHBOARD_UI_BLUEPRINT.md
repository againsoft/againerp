# AgainERP — Executive Dashboard UI Blueprint

> **Status:** Active — **Executive Dashboard UI SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 23 — Executive Dashboard UI Design  
> **Dashboard type:** `dash.executive` · Layer 04  
> **Route:** `/executive` · `/home/executive`  
> **Governance:** [FINAL_UI_ARCHITECTURE_LOCK.md](../../FINAL_UI_ARCHITECTURE_LOCK.md) — APPROVED  
> **Dashboard lock:** [DASHBOARD_ARCHITECTURE_LOCK.md](../../DASHBOARD_ARCHITECTURE_LOCK.md) — APPROVED  
> **Architecture:** [EXECUTIVE_DASHBOARD_ARCHITECTURE.md](./EXECUTIVE_DASHBOARD_ARCHITECTURE.md)

**Documentation only.** No mockups · No Figma · No code.

---

## Purpose

Define the **CEO / Executive Dashboard UI** — layout, sections, widgets, components, interactions, responsive rules, and AI surfaces — using the locked AgainERP design system and dashboard engine.

**Audience:** CEO, CFO, COO, GM, board viewers (read-only variants).

**Data rule:** Cross-module metrics via **platform aggregation services** only — no cross-module DB joins in UI or widgets.

---

## 1. Placement & Navigation

### 1.1 Route & shell

| Property | Value |
|----------|-------|
| Primary route | `/executive` |
| Alternate route | `/home/executive` (workspace home variant) |
| Layout ID | `LAYOUT-DASHBOARD` |
| Template ID | `tpl.executive.standard` |
| Shell zone | Zone D — `WS-CONTENT-DASH` |
| Grid preset | `layout.4col` — 12-column engine |

### 1.2 Global navigation

| Entry | Location |
|-------|----------|
| Sidebar | **Executive** or under **Home** → Executive view |
| Workspace switcher | Company · consolidated rollup · optional branch filter |
| Command palette | `executive.dashboard` → `/executive` |
| Role template | CEO / CFO / COO auto-assigns `tpl.executive.standard` |

### 1.3 Permissions

| Gate | Key |
|------|-----|
| Dashboard access | `dashboard.executive.view` |
| Per-widget | Module metric permissions (dual gate — locked) |
| Export PDF | `dashboard.executive.export` |
| Schedule email | `dashboard.executive.schedule` |
| Share link | `dashboard.executive.share` |

**RBAC:** Omit widgets user cannot access — never show disabled placeholders (locked).

---

## 2. Page Layout

### 2.1 Page chrome

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Zone A: Global header · company switcher · period selector          │
├─────────────────────────────────────────────────────────────────────┤
│ Breadcrumb: Home › Executive                                        │
├─────────────────────────────────────────────────────────────────────┤
│ Page header: Executive Dashboard · [Export ▾] [Share] [Customize]   │
│ Context bar: Company · Fiscal period · Comparison: vs prior period  │
├─────────────────────────────────────────────────────────────────────┤
│ WS-CONTENT-DASH — 12-column widget grid (platform-owned)            │
└─────────────────────────────────────────────────────────────────────┘
```

| Element | Component |
|---------|-----------|
| Period selector | `DS-SELECT-SINGLE` — MTD · QTD · YTD · custom range |
| Comparison toggle | vs prior period · vs budget (when available) |
| Customize | Engine personalization — pin · resize · reorder (role policy) |
| Export menu | `DS-EXPORT-MENU` — PDF snapshot |

### 2.2 Desktop row layout (`tpl.executive.standard`)

Aligned with [EXECUTIVE_DASHBOARD_ARCHITECTURE.md §3](./EXECUTIVE_DASHBOARD_ARCHITECTURE.md#3-section-layout-desktop):

| Row | Col span | Section |
|-----|----------|---------|
| 1 | 12 | **AI Executive Summary** |
| 2 | 3 × 4 | Revenue · Sales · Finance (cash) · Finance (profit) KPI strip |
| 3 | 6 + 6 | Revenue trend · Sales pipeline |
| 4 | 6 + 6 | Cash flow · Customer growth |
| 5 | 3 × 4 | Inventory · Marketing · HR · Projects |
| 6 | 12 | Risk alerts rollup |

Sections are **collapsible groups** on tablet; **accordion stack** on mobile.

---

## 3. Executive Sections & Widgets

Widget IDs follow `{module}.{kebab-name}` or `executive.{kebab-name}` for platform rollups. Render inside **`WS-CONTENT-WIDGET`** chrome.

### 3.1 Revenue

| Widget ID | Title | Category | Col | Source |
|-----------|-------|----------|-----|--------|
| `executive.revenue-total` | Total Revenue | `kpi` | 3 | sales · finance rollup |
| `sales.revenue-trend` | Revenue Trend | `chart` | 6 | sales |
| `executive.revenue-by-channel` | Revenue by Channel | `chart` | 6 | ecommerce · sales |
| `executive.revenue-vs-prior` | vs Prior Period | `analytics` | 3 | platform |

**Drill-down:** `/sales/dashboard` · `/finance/reports/revenue` · `/ecommerce/dashboard`

### 3.2 Sales

| Widget ID | Title | Category | Col | Source |
|-----------|-------|----------|-----|--------|
| `executive.sales-pipeline-value` | Pipeline Value | `kpi` | 3 | crm · sales |
| `crm.win-rate` | Win Rate | `kpi` | 3 | crm |
| `executive.top-deals` | Top Deals | `list` | 6 | crm |
| `executive.sales-by-region` | Sales by Region | `chart` | 6 | sales |

**Drill-down:** `/crm/pipeline` · `/sales/orders` · `/sales/reports`

### 3.3 Finance

Combines cash flow and profitability (architecture §2.4 · §2.5).

| Widget ID | Title | Category | Col | Source |
|-----------|-------|----------|-----|--------|
| `finance.cash-on-hand` | Cash on Hand | `kpi` | 3 | finance |
| `finance.gross-margin` | Gross Margin | `kpi` | 3 | finance |
| `finance.net-margin` | Net Margin | `kpi` | 3 | finance |
| `finance.cash-in-out` | Cash In / Out | `chart` | 6 | finance |
| `finance.ar-ap-summary` | AR / AP Summary | `analytics` | 3 | finance |
| `executive.cash-forecast-13w` | 13-Week Cash Forecast | `chart` · `ai` | 6 | finance · AI |
| `finance.expense-breakdown` | Expense Breakdown | `chart` | 6 | finance |
| `finance.profit-by-product` | Profit by Product Line | `chart` | 6 | finance · catalog analytic |

**Drill-down:** `/finance/dashboard` · `/finance/reports/cash-flow` · `/finance/reports/profit-and-loss`

### 3.4 Inventory

| Widget ID | Title | Category | Col | Source |
|-----------|-------|----------|-----|--------|
| `inventory.stock-value` | Stock Value | `kpi` | 3 | inventory |
| `inventory.stockout-risk` | Stockout Risk | `alert` | 3 | inventory |
| `inventory.turnover-ratio` | Turnover Ratio | `kpi` | 3 | inventory |
| `inventory.warehouse-utilization` | Warehouse Utilization | `chart` | 3 | inventory |

**Drill-down:** `/inventory/dashboard` · `/inventory/stock?filter=low`

### 3.5 HR

| Widget ID | Title | Category | Col | Source |
|-----------|-------|----------|-----|--------|
| `hr.headcount` | Headcount | `kpi` | 3 | hr |
| `hr.attrition-rate` | Attrition Rate | `kpi` | 3 | hr |
| `hr.open-roles` | Open Roles | `list` | 3 | hr · recruitment |
| `payroll.cost-trend` | Payroll Cost Trend | `chart` | 3 | payroll |

**Drill-down:** `/hr/dashboard` · `/hr/recruitment` · `/payroll/reports`

### 3.6 Projects

| Widget ID | Title | Category | Col | Source |
|-----------|-------|----------|-----|--------|
| `project.active-count` | Active Projects | `kpi` | 3 | project |
| `project.at-risk` | At-Risk Projects | `alert` | 3 | project |
| `project.billable-utilization` | Billable Utilization | `kpi` | 3 | project |
| `project.milestone-timeline` | Milestone Timeline | `calendar` | 3 | project |

**Drill-down:** `/project/dashboard` (when module enabled)

### 3.7 Marketing

| Widget ID | Title | Category | Col | Source |
|-----------|-------|----------|-----|--------|
| `marketing.campaign-roi` | Campaign ROI | `kpi` | 3 | marketing · ecommerce |
| `marketing.cac-ltv` | CAC / LTV | `analytics` | 3 | marketing |
| `marketing.lead-volume` | Lead Volume | `chart` | 3 | crm · marketing |
| `marketing.channel-performance` | Channel Performance | `chart` | 3 | marketing |

**Drill-down:** `/ecommerce/marketing` · `/crm/reports`

### 3.8 Customer Growth

| Widget ID | Title | Category | Col | Source |
|-----------|-------|----------|-----|--------|
| `executive.active-customers` | Active Customers | `kpi` | 3 | crm · sales |
| `executive.new-vs-churn` | New vs Churn | `chart` | 6 | crm |
| `crm.nps-csat` | NPS / CSAT | `kpi` | 3 | crm |
| `executive.top-accounts` | Top Accounts | `list` | 6 | crm · sales |

**Drill-down:** `/crm/customers` · `/sales/customers`

### 3.9 AI Executive Summary

| Widget ID | Title | Category | Col | Source |
|-----------|-------|----------|-----|--------|
| `executive.ai-summary` | AI Executive Summary | `ai` | 12 | AI OS |
| `executive.ai-risk-rollup` | AI Risk Rollup | `ai` · `alert` | 6 | AI OS |
| `executive.ai-opportunities` | AI Opportunity Highlights | `ai` · `list` | 6 | AI OS |
| `executive.ai-decisions` | Recommended Decisions | `ai` · `quick_action` | 4 | AI OS |

Components: `DS-AI-BRIEFING` · `DS-AI-INSIGHTS` · `DS-AI-SUGGESTIONS` · `DS-AI-PANEL` trigger in header (`Ctrl+J`).

**Rules:** AI never auto-executes financial or HR actions · preview + human confirm · hide when AI module off.

---

## 4. Components

| Surface | Component ID | Use |
|---------|--------------|-----|
| Dashboard frame | `WS-CONTENT-DASH` | Grid host |
| Widget chrome | `WS-CONTENT-WIDGET` | Title · actions · loading |
| KPI tiles | `DS-CARD-KPI` | All KPI widgets |
| Charts | `DS-CARD-CHART` | Trend · breakdown · forecast |
| Lists | `DS-TABLE` / compact list | Top deals · accounts · roles |
| Alerts | `DS-ALERT-WARNING` · `DS-NOTIFICATION-CARD` | Stockout · at-risk projects |
| Analytics strip | `DS-CARD-REPORT` | AR/AP · CAC/LTV · vs prior |
| AI summary | `DS-AI-BRIEFING` | Row 1 narrative |
| Calendar | `DS-CALENDAR` | Project milestones |
| Export | `DS-EXPORT-MENU` | PDF snapshot |
| Empty / loading | `DS-EMPTY-*` · `DS-LOADING-SKELETON` | Per widget |

**Prohibited:** Custom executive shell · module-specific dashboard frames · raw hex colors.

---

## 5. Interactions

### 5.1 Drill-down (locked)

| Interaction | Behaviour |
|-------------|-----------|
| KPI click | Navigate to module dashboard with metric filter |
| Chart segment click | Module report or filtered list |
| List row click | `?view={id}` on source module (drawer CRUD) |
| Alert click | Source record · approval queue · module alert screen |
| AI recommendation CTA | Opens `DS-AI-PANEL` or navigates with context |
| Explore in BI | Link to BI module — no duplicate builder on executive page |

Breadcrumbs rebuild per platform routing standard.

### 5.2 Personalization

| Feature | Rule |
|---------|------|
| Resize / move | Dashboard engine persists — not module-owned |
| Pin widget | User preference when role allows |
| Role templates | CEO sees full grid · CFO finance-weighted variant |
| Department views | Optional scoped widgets |

### 5.3 Export & sharing

| Action | UI |
|--------|-----|
| PDF snapshot | Header export · current period + company context |
| Scheduled email | Settings modal · `dashboard.executive.schedule` |
| Share read-only link | Time-limited URL · `dashboard.executive.share` |

### 5.4 Multi-company / consolidation

| Mode | UI |
|------|-----|
| Single company | Workspace company switcher |
| Consolidated | Rollup badge · `executive.consolidated` permission |
| Branch filter | Optional widget-level branch chip |

---

## 6. Responsive Rules

| Breakpoint | Behaviour |
|------------|-----------|
| Desktop `≥ lg` | Full 12-col grid per template |
| Tablet `md–lg` | 2-col · section collapse |
| Mobile `< md` | **Single column stack** (locked) |

### 6.1 Mobile priority order

1. AI Executive Summary (compact briefing)  
2. Top KPI strip — Revenue · Cash · Pipeline · Headcount (`mobileSupport: compact`)  
3. Risk alerts  
4. Customer growth · Cash flow (compact charts)  
5. Remaining sections — accordion by domain  

| Rule | Detail |
|------|--------|
| Widget `mobileSupport` | `full` · `compact` · `none` per registry |
| Charts | Simplified · tap to expand full-screen |
| Lists | Top 5 rows · "View all" link |
| Customize | Desktop-first; mobile read-only layout optional |
| Bottom nav | Home · Search · AI · Notifications · More (workspace) |

Authority: [MOBILE_DASHBOARD_ARCHITECTURE.md](./MOBILE_DASHBOARD_ARCHITECTURE.md) · DASHBOARD_ARCHITECTURE_LOCK §7.

---

## 7. Module Off / Graceful Degradation

| Module disabled | UI behaviour |
|-----------------|--------------|
| Ecommerce | Hide channel revenue widget · no crash |
| CRM | Hide pipeline · show sales-only fallback if available |
| HR / Payroll | Hide HR section |
| Project | Hide projects section |
| AI | Hide AI row · no empty AI chrome |

Widgets omitted from catalog — not disabled cards.

---

## 8. Widget Registration Checklist

Platform + modules register in manifest / widget registry:

| # | Requirement |
|---|-------------|
| 1 | Widget ID `{module}.{kebab-name}` |
| 2 | Nine registry metadata fields complete |
| 3 | Metric API endpoint documented |
| 4 | Permission key per widget |
| 5 | `mobileSupport` set |
| 6 | `aiSupport` object when applicable |
| 7 | No cross-module DB in data layer |

Executive-specific widgets (`executive.*`) owned by **platform dashboard service**.

---

## 9. Relationship to Other Dashboards

| Dashboard | Route | Relationship |
|-----------|-------|--------------|
| Workspace home | `/home` | Personal · role views |
| Module dashboards | `/{module}/dashboard` | Drill-down targets |
| AI OS dashboard | `/ai-os/dashboard` | Deep AI tools |
| BI System | `/bi/*` | "Explore in BI" for ad-hoc analysis |

Executive = **operational leadership** daily/weekly view — not BI builder replacement.

---

## 10. Compliance Checklist

- [ ] Uses `WS-CONTENT-DASH` + engine grid only
- [ ] Template `tpl.executive.standard`
- [ ] Type `dash.executive` at `/executive`
- [ ] Dual permission gate per widget
- [ ] AI via `DS-AI-*` only
- [ ] Mobile single-column stack
- [ ] No cross-module DB joins
- [ ] Drill-down to module routes · drawer CRUD on records
- [ ] Export/share permissions enforced

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 23 — Executive Dashboard UI blueprint |

---

**Executive Dashboard UI Blueprint** — CEO view · ten domains · AI-first row · design-system compliant.
