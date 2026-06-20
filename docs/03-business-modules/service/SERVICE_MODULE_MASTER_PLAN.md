# AgainERP Service Module Master Plan (SSOT)

> **Version:** 1.0  
> **Status:** Planning Phase  
> **Module:** Service  
> **Priority:** Core ERP Module  
> **Architecture Type:** Enterprise Service Operations Platform  
> **Authoritative architecture:** [SERVICE_MODULE_ARCHITECTURE.md](./SERVICE_MODULE_ARCHITECTURE.md)

---

## Purpose

Single source of truth for Service module **vision, scope, roadmap, and Cursor execution order**. Downstream docs (Database, API, Workflow, UI) extend this plan — they do not duplicate it.

## When To Read

Read first when scoping Service module work, prioritizing roadmap steps, or onboarding to the module.

## Read Next

- [SERVICE_MODULE_ARCHITECTURE.md](./SERVICE_MODULE_ARCHITECTURE.md) — STEP 01 (complete before code)
- [README.md](./README.md) — documentation map

---

# 1. Module Vision

The Service Module is a **unified service operations platform** supporting:

- Computer service centers
- Mobile repair shops
- Vehicle workshops
- AC service companies
- CCTV installation companies
- IT service providers
- Digital marketing agencies
- Software companies
- Maintenance companies
- Consultancy firms

The module supports **Service-only** and **Product + Service** business models.

**Mixed billing example:**

| Line | Type |
|------|------|
| SSD 256GB | Product |
| Windows Installation | Service |
| Installation Charge | Service |

→ Single invoice with mixed lines (via Sales + Finance integration).

---

# 2. Module Goals

1. Service Catalog Management
2. Customer Asset Management
3. Service Order Management
4. Work Order Management
5. Technician Management
6. Scheduling & Dispatching
7. Repair Management
8. AMC & Contract Management
9. Subscription Services
10. SLA Management
11. Billing & Accounting Integration
12. AI Service Assistant

---

# 3. Architecture Position

```text
CRM
 ↓
Sales (Quotation / Order / Invoice)
 ↓
Service Order
 ↓
Work Order
 ↓
Inventory Usage (parts)
 ↓
Billing (Sales + Finance)
 ↓
Accounting (GL via Finance)
```

**Integrated with:** CRM · Sales · Inventory · Finance · HR · Project · Helpdesk · Timesheet · Booking (optional) · AI OS

---

# 4. Service Types

| Type | Examples | Billing |
|------|----------|---------|
| **Fixed** | Formatting, car wash, AC cleaning | Flat fee |
| **Hourly** | IT support, consulting | Hours × rate |
| **Project** | Website, ERP implementation | Milestones / T&M |
| **Contract** | Annual maintenance (AMC) | Contract value / visits |
| **Subscription** | SEO monthly, hosting, SaaS | Recurring cycle |

---

# 5–21. Feature Domains

Detailed entity design, workflows, and integration rules live in [SERVICE_MODULE_ARCHITECTURE.md](./SERVICE_MODULE_ARCHITECTURE.md) and linked docs:

| # | Domain | Doc section |
|---|--------|-------------|
| 5 | Customer Asset Management | Architecture §6 |
| 6 | Service Catalog | Architecture §5 |
| 7 | Service Orders | Architecture §7 |
| 8 | Work Orders | Architecture §8 |
| 9 | Repair Management | Architecture §9 · Workflow §3 |
| 10 | Field Service | Architecture §10 |
| 11 | Technicians | Architecture §11 |
| 12 | Scheduling | Architecture §12 · UI §8 |
| 13 | AMC / Contracts | Architecture §13 · Workflow §4 |
| 14 | Subscriptions | Architecture §14 · Workflow §5 |
| 15 | SLA | Architecture §15 |
| 16 | Billing | Architecture §16 |
| 17 | Inventory | Architecture §17 |
| 18 | Accounting | Architecture §18 |
| 19 | Reporting | Architecture §19 · UI §12 |
| 20 | AI Assistant | [SERVICE_AI_ARCHITECTURE.md](./SERVICE_AI_ARCHITECTURE.md) |
| 21 | Permissions | [SERVICE_PERMISSIONS.md](./SERVICE_PERMISSIONS.md) |

---

# 22. Database Design Phase ✅ (Planning doc)

**Deliverable:** [SERVICE_DATABASE_ARCHITECTURE.md](./SERVICE_DATABASE_ARCHITECTURE.md)

- Database architecture
- ER diagram
- Table definitions
- Index strategy
- Multi-tenant strategy

**Rule:** Do NOT write application code until STEP 01–06 docs are reviewed.

---

# 23. API Design Phase ✅ (Planning doc)

**Deliverable:** [SERVICE_API_ARCHITECTURE.md](./SERVICE_API_ARCHITECTURE.md)

- REST API architecture
- Endpoint definitions
- Request / response contracts
- Validation rules
- Permission rules

---

# 24. Workflow Design Phase ✅ (Planning doc)

**Deliverable:** [SERVICE_WORKFLOW_ARCHITECTURE.md](./SERVICE_WORKFLOW_ARCHITECTURE.md)

- User flows
- Service order flow
- Repair flow
- AMC flow
- Subscription flow

---

# 25. UI/UX Design Phase ✅ (Planning doc)

**Deliverable:** [SERVICE_UI_ARCHITECTURE.md](./SERVICE_UI_ARCHITECTURE.md)

**Design formula:** 60% Odoo · 20% Shopify Admin · 10% Notion · 10% Linear

**Requirements:** Mobile responsive · Modern SaaS · Enterprise UX · AgainERP design system · AG Grid lists · Sheet drawers · Dark mode

---

# 26. Development Roadmap

| Step | Phase | Deliverable | Status |
|------|-------|-------------|--------|
| **01** | Service Architecture | [SERVICE_MODULE_ARCHITECTURE.md](./SERVICE_MODULE_ARCHITECTURE.md) | ✅ Planning |
| **02** | Database Design | [SERVICE_DATABASE_ARCHITECTURE.md](./SERVICE_DATABASE_ARCHITECTURE.md) | ✅ Planning |
| **03** | API Design | [SERVICE_API_ARCHITECTURE.md](./SERVICE_API_ARCHITECTURE.md) | ✅ Planning |
| **04** | Permissions | [SERVICE_PERMISSIONS.md](./SERVICE_PERMISSIONS.md) | ✅ Planning |
| **05** | Workflow Design | [SERVICE_WORKFLOW_ARCHITECTURE.md](./SERVICE_WORKFLOW_ARCHITECTURE.md) | ✅ Planning |
| **06** | UI/UX Architecture | [SERVICE_UI_ARCHITECTURE.md](./SERVICE_UI_ARCHITECTURE.md) | ✅ Planning |
| **07** | Dashboard UI | Prototype `/service` | ✅ Prototype |
| **08** | Service Catalog UI | Prototype `/service/catalog` | ✅ Prototype |
| **09** | Asset Management UI | Prototype `/service/assets` | ✅ Prototype |
| **10** | Service Orders UI | Prototype `/service/orders` | ✅ Prototype |
| **11** | Work Orders UI | Prototype `/service/work-orders` | ✅ Prototype |
| **12** | Repair Management UI | Prototype `/service/repairs` | ✅ Prototype |
| **13** | Technician UI | Prototype `/service/technicians` | ✅ Prototype |
| **14** | Scheduling UI | Prototype `/service/schedule` | ✅ Prototype |
| **15** | AMC UI | Prototype `/service/contracts` | ⏳ Pending |
| **16** | Subscription UI | Prototype `/service/subscriptions` | ⏳ Pending |
| **17** | Reports UI | Prototype `/service/reports` | ⏳ Pending |
| **18** | AI Assistant UI | Prototype `/service/ai` | ⏳ Pending |
| **19** | Frontend Integration | Wire to API | ⏳ Pending |
| **20** | Backend Integration | FastAPI + PostgreSQL | ⏳ Pending |
| **21** | Testing | E2E + integration | ⏳ Pending |
| **22** | Production Release | GA | ⏳ Pending |

---

# 27. Cursor Global Instruction

Before creating any file:

1. Read existing AgainERP architecture ([BRAIN.md](../../BRAIN.md) → this README).
2. Follow project folder structure (`docs/03-business-modules/service/`).
3. Follow SSOT rules — update Master Plan + Architecture when scope changes.
4. Reuse existing design system ([module-ui-standard.md](../../04-uiux/standards/module-ui-standard.md)).
5. Reuse existing permissions framework (Core RBAC).
6. Reuse existing API standards ([api/architecture.md](../../05-development/api/architecture.md)).
7. Reuse existing UI components (shadcn, AG Grid, Sheet drawers).
8. Never create duplicate architecture — extend this package.
9. Keep all documentation synchronized (CHANGELOG, MODULE_REGISTRY, DEPENDENCY_MAP).
10. **Complete each planning step before moving to UI code.**

---

## Change History

| Date | Change |
|------|--------|
| 2026-06-21 | v1.0 — Initial SSOT master plan + planning-phase architecture package |
