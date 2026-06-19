# AgainERP — Module Navigation Standard

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 08 — Navigation Architecture  
> **Authority:** [NAVIGATION_ARCHITECTURE.md](./NAVIGATION_ARCHITECTURE.md)

---

## Purpose

Standard **Level 2 module navigation zones** and **Level 3 feature menu patterns** every AgainERP module must follow.

## When To Read

Read when authoring `UI.md`, `ModuleManifest.md`, or normalizing module menus.

## Related Files

- [GLOBAL_MENU_STRUCTURE.md](./GLOBAL_MENU_STRUCTURE.md) — Level 1 placement
- [BREADCRUMB_AND_ROUTING_STANDARD.md](./BREADCRUMB_AND_ROUTING_STANDARD.md) — routes
- [MODULE_GENERATOR_GUIDE.md](../../MODULE_GENERATOR_GUIDE.md) — new module package

## Read Next

One **module example** below matching your module — do not read all examples.

---

## 1. Required Module Zones (Level 2)

Every installable module **must** declare these zones in order:

| # | Zone | Route suffix | Manifest key | Required |
|---|------|--------------|--------------|----------|
| 1 | **Dashboard** | `/dashboard` or module default | `moduleNav.dashboard` | Yes |
| 2 | **Operations** | `/{features…}` | `moduleNav.operations` | Yes if transactional |
| 3 | **Reports** | `/reports` | `moduleNav.reports` | If module has reports |
| 4 | **Automation** | `/automation` | `moduleNav.automation` | If workflows / AI rules exist |
| 5 | **Configuration** | `/settings` | `moduleNav.configuration` | If module has settings |

**Aliases:** `Configuration` tab label may read **Settings** in UI; route stays `/settings` for backward compatibility.

### 1.1 Zone visibility rules

```text
Hide Reports      → zero entries in Reports.md / Menus/Reports/
Hide Automation   → no Workflow.md automations AND no AI/automation screens
Hide Configuration → no configurable module options
Operations        → REQUIRED for all business modules (contains Level 3 features)
```

### 1.2 Zone rendering

| Viewport | Level 2 presentation |
|----------|------------------------|
| Desktop | Horizontal tab bar below global header ([WORKSPACE_LAYOUT_MAP](./WORKSPACE_LAYOUT_MAP.md) Zone B) |
| Tablet | Scrollable tab bar |
| Mobile | Scroll tabs + "More" overflow |

---

## 2. Level 3 — Operations Menu Structure

Operations contains **feature groups** (optional) and **feature items** (required).

```text
Operations
├── {Feature Group}     ← optional collapsible header
│   ├── {Feature}       ← Level 3 screen (list/dashboard)
│   └── …
└── …
```

| Field | Required | Example |
|-------|----------|---------|
| `id` | yes | `sales.quotations` |
| `label` | yes | Quotations |
| `route` | yes | `/sales/quotations` |
| `icon` | yes | Lucide name |
| `permission` | yes | `sales.quotation.view` |
| `group` | no | Sales Pipeline |
| `order` | no | 10 |
| `badge` | no | open count API |

---

## 3. Reference Modules

### 3.1 Sales

**Global group:** Business Operations · **Route prefix:** `/sales/*`

| Level 2 | Level 3 features |
|---------|------------------|
| **Dashboard** | Sales KPIs, pipeline summary, recent orders |
| **Operations** | Quotations · Orders · Invoices · Delivery · Customers (sales view) |
| **Reports** | Sales by period · Product sales · Salesperson performance |
| **Automation** | Quote expiry rules · Order confirmation workflows · AI sales forecast |
| **Configuration** | Price lists · Incoterms · Sales teams · Approval rules |

```text
Sales
├── Dashboard
├── Operations
│   ├── Quotations
│   ├── Orders
│   ├── Invoices
│   └── Delivery
├── Reports
├── Automation
└── Configuration (Settings)
```

### 3.2 CRM

**Global group:** Business Operations · **Route prefix:** `/crm/*`

| Level 2 | Level 3 features |
|---------|------------------|
| **Dashboard** | Pipeline value, lead funnel, activity summary |
| **Operations** | Leads · Contacts · Pipeline · Opportunities · Activities |
| **Reports** | Lead conversion · Pipeline aging · Activity reports |
| **Automation** | Lead scoring · Assignment rules · Nurture workflows |
| **Configuration** | Pipeline stages · Lead sources · CRM teams |

```text
CRM
├── Dashboard
├── Operations
│   ├── Leads
│   ├── Contacts
│   ├── Pipeline
│   ├── Opportunities
│   └── Activities
├── Reports
├── Automation
└── Configuration (Settings)
```

### 3.3 Ecommerce (commerce group)

**Global group:** Commerce · **Route prefix:** `/catalog/*` · **Module ID:** `ecommerce`

Level 3 features map to doc sub-areas — **not** separate installables:

| Level 2 | Level 3 features |
|---------|------------------|
| **Dashboard** | Store overview widgets |
| **Operations** | Catalog · Orders · Customers · Inventory · Marketing · Content · SEO · Builder · Media · AI |
| **Reports** | 14 report screens — [Reports.md](../../03-business-modules/ecommerce/Reports.md) |
| **Automation** | Abandoned cart · Order status · AI product workflows |
| **Configuration** | Store settings · Payment · Shipping · Tax |

### 3.4 HR (human resources group)

| Level 2 | Level 3 features |
|---------|------------------|
| **Dashboard** | Headcount, attendance summary |
| **Operations** | Employees · Org chart · Leave · Attendance · Recruitment |
| **Reports** | HR analytics, payroll summary links |
| **Automation** | Onboarding workflows · Leave approval |
| **Configuration** | Departments · Work schedules · Policies |

---

## 4. Reports Zone Standard

| Rule | Detail |
|------|--------|
| Index route | `/{module}/reports` |
| Report detail | `/{module}/reports/{slug}` |
| SSOT | Module `Reports.md` indexes screens — no duplicate definitions |
| Navigation | Reports zone lists same entries as `Menus/Reports/` |

---

## 5. Automation Zone Standard

Consolidates **workflow automation** and **AI-assisted automation** for the module.

| Content type | Source doc |
|--------------|------------|
| Workflow rules | `Workflow.md` |
| Scheduled jobs | `ModuleManifest.md` |
| AI agents / tools | `AI.md` |
| Approval triggers | `Permissions.md` + Core Approval Engine |

Route: `/{module}/automation` with sub-routes per rule type.

**Hide zone** when module has no automation surfaces.

---

## 6. Configuration Zone Standard

| Content type | Examples |
|--------------|----------|
| Module settings | Defaults, feature toggles |
| Integration keys | Webhooks, API connections |
| Master data setup | Stages, categories owned by module |

Route: `/{module}/settings` (alias `/configuration` redirects).

---

## 7. ModuleManifest Schema (conceptual)

```yaml
module: sales
globalNav:
  group: business-ops
  order: 30
moduleNav:
  dashboard: /sales/dashboard
  operations:
    - id: sales.quotations
      label: Quotations
      route: /sales/quotations
      permission: sales.quotation.view
      order: 10
    - id: sales.orders
      label: Orders
      route: /sales/orders
      permission: sales.order.view
      order: 20
  reports: /sales/reports
  automation: /sales/automation
  configuration: /sales/settings
```

---

## 8. Compliance Checklist

| # | Check |
|---|-------|
| 1 | Five zones declared or explicitly hidden with reason |
| 2 | Operations lists all Level 3 transactional screens from `UI.md` |
| 3 | Every item has `permission` key |
| 4 | Routes match [BREADCRUMB_AND_ROUTING_STANDARD.md](./BREADCRUMB_AND_ROUTING_STANDARD.md) |
| 5 | Global group matches [GLOBAL_MENU_STRUCTURE.md](./GLOBAL_MENU_STRUCTURE.md) |
| 6 | No duplicate module roots for ecommerce sub-areas |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 08 — module navigation standard (Automation + Configuration) |

---

**Module Navigation Standard** — Dashboard · Operations · Reports · Automation · Configuration.
