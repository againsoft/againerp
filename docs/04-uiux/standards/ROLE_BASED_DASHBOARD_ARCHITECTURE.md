# AgainERP — Role-Based Dashboard Architecture

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 09 — Dashboard Framework Architecture  
> **Authority:** [DASHBOARD_FRAMEWORK_ARCHITECTURE.md](./DASHBOARD_FRAMEWORK_ARCHITECTURE.md)

---

## Purpose

Architecture for **role**, **department**, and **shared** dashboards — default layouts, examples, and permission model.

## When To Read

Read when defining role templates or assigning default dashboards to RBAC roles.

## Related Files

- [DASHBOARD_LAYOUT_ENGINE.md](./DASHBOARD_LAYOUT_ENGINE.md) — templates and saved views
- [WIDGET_REGISTRY_STANDARD.md](./WIDGET_REGISTRY_STANDARD.md) — widget permissions
- [02-core-platform/PERMISSION_SYSTEM_ARCHITECTURE.md](../../02-core-platform/PERMISSION_SYSTEM_ARCHITECTURE.md)

## Read Next

One role example in §3 matching your domain.

---

## 1. Role Dashboard Model

| Concept | Description |
|---------|-------------|
| **Role template** | Default widget layout assigned to RBAC role |
| **First login** | User receives role template; may personalize copy |
| **Role admin** | Can update role default for all users with role |
| **Multi-role users** | Primary role selects default dashboard; switcher for alternates |

Dashboard type ID: `dash.role`

---

## 2. Department Dashboards

Dashboard type ID: `dash.department`

| Field | Scope |
|-------|-------|
| Audience | Users in department / branch |
| Data scope | Filtered to `branch_id` or org unit |
| Editor | Department admin role |

Used when KPIs are team-scoped (sales team, support queue, warehouse).

---

## 3. Role Examples

### 3.1 CEO Dashboard

**Route:** `/home/executive` or dedicated CEO view on executive dashboard  
**Type:** Executive + Role  
**Primary widgets:**

| Widget | Category | Module |
|--------|----------|--------|
| Revenue KPI | kpi | finance |
| Net profit KPI | kpi | finance |
| Cash position | kpi | finance |
| Sales pipeline | chart | sales |
| Customer growth | chart | crm |
| AI Executive Summary | ai | platform |
| Risk alerts | alert | platform |
| Pending approvals | list | core |

Full section map: [EXECUTIVE_DASHBOARD_ARCHITECTURE.md](./EXECUTIVE_DASHBOARD_ARCHITECTURE.md)

### 3.2 Sales Manager Dashboard

| Widget | Category |
|--------|----------|
| Pipeline value | kpi |
| Quota attainment | kpi |
| Team leaderboard | table |
| Open quotations | list |
| Orders this week | chart |
| AI opportunities | ai |
| Quick: New quotation | quick_action |

### 3.3 HR Manager Dashboard

| Widget | Category |
|--------|----------|
| Headcount | kpi |
| Open positions | kpi |
| Attendance today | kpi |
| Leave requests pending | list |
| Recruitment pipeline | chart |
| AI HR brief | ai |
| Quick: Approve leave | quick_action |

### 3.4 Finance Manager Dashboard

| Widget | Category |
|--------|----------|
| Cash flow | chart |
| AR aging | table |
| AP due | list |
| Budget vs actual | analytics |
| Tax deadlines | alert |
| AI risk detection | ai |

### 3.5 Support Manager Dashboard

| Widget | Category |
|--------|----------|
| Open tickets | kpi |
| SLA breaches | alert |
| Agent workload | table |
| CSAT trend | chart |
| AI ticket summary | ai |

### 3.6 Marketing Manager Dashboard

| Widget | Category |
|--------|----------|
| Campaign ROI | kpi |
| Email performance | chart |
| Active campaigns | list |
| Loyalty enrollment | kpi |
| AI content suggestions | ai |

### 3.7 Store Manager Dashboard (Commerce)

| Widget | Category |
|--------|----------|
| Today’s orders | kpi |
| Revenue today | kpi |
| Low stock alerts | alert |
| Top products | list |
| Abandoned carts | list |
| AI sales forecast | ai |

Module detail: [MODULE_DASHBOARD_STANDARD.md](./MODULE_DASHBOARD_STANDARD.md) · ecommerce dashboard sub-area

---

## 4. Dashboard Permissions

| Visibility | View | Edit layout | Edit role default |
|------------|------|-------------|-------------------|
| **Public** | All tenant users | Platform admin | Platform admin |
| **Role** | Role members | User (personal) · Role admin (default) | Role admin |
| **Private** | Owner | Owner | Owner |
| **Department** | Dept members | Dept admin · user personalize | Dept admin |
| **Shared** | Named users/groups | Owner + editors | Owner |

### 4.1 Permission keys (platform)

| Key | Purpose |
|-----|---------|
| `dashboard.view.{dashboardId}` | View specific shared dashboard |
| `dashboard.edit.{dashboardId}` | Customize layout |
| `dashboard.admin.role` | Edit role templates |
| `dashboard.admin.tenant` | Public / executive dashboards |

Widget permissions are **additional** — both dashboard and widget permission required.

---

## 5. Assignment Workflow

```text
1. Platform defines role template (layout JSON + widget IDs)
2. RBAC role linked to template ID in Core
3. User assigned role → first visit loads template
4. User personalizes → saves as personal view (optional)
5. Role admin updates template → new users get update; existing users opt-in reset
```

---

## 6. Multi-Tenant Rules

| Rule | Detail |
|------|--------|
| Tenant isolation | Role templates per tenant (or system template copied on provisioning) |
| Plan gating | Widgets for unlicensed modules omitted from role template |
| Company scope | Workspace switcher filters KPI widgets |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 09 — role-based dashboard architecture |

---

**Role-Based Dashboard Architecture** — templates per role, personalize without breaking defaults.
