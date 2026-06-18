# Sales & Marketing Workspace — Module Home

> **Status:** Draft (Planning)  
> **Version:** 0.1.0  
> **Module ID:** `sales-marketing` (bundle: `module.sales_marketing`)  
> **Route namespace:** `/sales-marketing/*`  
> **API base:** `/api/v1/sales-marketing/`  
> **Table namespace:** `smw_*`  
> **Governance:** [PROJECT_COMMON_RULES.md](../../PROJECT_COMMON_RULES.md) · [GOVERNANCE.md](../../GOVERNANCE.md)

Unified **Revenue Operations** workspace — leads, pipeline, quotations, campaigns, activities, targets, commission, reporting, and AI copilot.

---

## Documentation phases

| Phase | Folder | Status |
|-------|--------|--------|
| **UI design** | [ui-design/](./ui-design/) | **In progress** — Steps UI-01–05 ready |
| Business architecture | `docs/modules/sales-marketing/` (numbered docs) | Planned |
| UI prototype code | `apps/web/src/…/sales-marketing/` | Not started |

---

## UI design entry point

Start here: **[ui-design/README.md](./ui-design/README.md)**

Implementation playbook: **[SMW_UI_BUILD_GUIDE.md](./SMW_UI_BUILD_GUIDE.md)**

---

## Design language

| Source | Weight |
|--------|--------|
| Odoo (ERP density, pipeline) | 60% |
| Shopify Admin (lists, drawers) | 20% |
| Notion (docs, notes) | 10% |
| Linear (speed, keyboard) | 10% |

---

## Key references (existing codebase)

| Pattern | Reference |
|---------|-----------|
| Module shell | `components/hr/hr-module-layout.tsx` |
| List + drawer CRUD | `/catalog/products` |
| Employee 360 | `components/hr/employees/profile/` |
| Enterprise cards | `components/enterprise/` |
| Approvals | `components/approvals/` |
| Partners workspace | `/partners/*` |

---

**Last updated:** 2026-06-18
