# Sales & Marketing Workspace — UI Build Guide

> **Status:** Active playbook  
> **Scope:** UI prototype — mock data, optional `/api/v1/sales-marketing/` routes  
> **Parent:** [ui-design/README.md](./ui-design/README.md) · [PROJECT_COMMON_RULES.md](../../PROJECT_COMMON_RULES.md)

Route namespace: **`/sales-marketing/*`**

---

## 1. Build sequence (one step per request)

| Impl step | UI doc | Deliverable |
|-----------|--------|-------------|
| 01 | [01_MASTER_LAYOUT_UI.md](./ui-design/01_MASTER_LAYOUT_UI.md) | `SalesMarketingLayout`, nav, sidebar, breadcrumb |
| 02 | [02_DASHBOARD_UI_DESIGN.md](./ui-design/02_DASHBOARD_UI_DESIGN.md) | Dashboard page, KPI strip, charts |
| 03 | [03_LEAD_MANAGEMENT_UI_DESIGN.md](./ui-design/03_LEAD_MANAGEMENT_UI_DESIGN.md) | Lead workspace, drawer, 360 profile |
| 04 | [04_OPPORTUNITY_PIPELINE_UI_DESIGN.md](./ui-design/04_OPPORTUNITY_PIPELINE_UI_DESIGN.md) | Pipeline kanban + deal 360 |
| 05 | [05_QUOTATION_BUILDER_UI_DESIGN.md](./ui-design/05_QUOTATION_BUILDER_UI_DESIGN.md) | Quotation list + document builder |

Say **“Next”** or **“Impl Step N”** to start each phase.

---

## 2. File layout (target)

```text
apps/web/src/
├── app/(admin)/sales-marketing/
│   ├── layout.tsx
│   ├── page.tsx              → redirect dashboard
│   ├── dashboard/page.tsx
│   ├── leads/page.tsx
│   ├── leads/[id]/page.tsx
│   ├── opportunities/page.tsx
│   └── …
├── components/sales-marketing/
│   ├── smw-module-layout.tsx
│   ├── smw-nav.tsx
│   ├── dashboard/
│   ├── leads/
│   └── …
├── fixtures/sales-marketing/
├── mock/sales-marketing/
└── lib/navigation.ts         ← register SMW nav
```

---

## 3. Drawer CRUD (standard entities)

| Action | URL param | Component pattern |
|--------|-----------|-------------------|
| Create | `?create=1` | `*-form-sheet.tsx` |
| View | `?view={id}` | `*-view-sheet.tsx` |
| Edit | `?edit={id}` | `*-form-sheet.tsx` |

Reference: `apps/web/src/app/(admin)/catalog/products/page.tsx`

---

## 4. 360 pages (exceptions)

| Entity | Full page route | Tabs via |
|--------|-----------------|----------|
| Lead | `/sales-marketing/leads/[id]` | `?tab=overview\|activity\|…` |
| Opportunity | `/sales-marketing/opportunities/[id]` | `?tab=…` |

List row “Open” → 360 route; row click / peek → `?view=` drawer optional.

---

## 5. Dependencies to install (before Impl Step 04+)

```bash
cd apps/web
npm install @tanstack/react-query @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities react-hook-form @hookform/resolvers zod axios
```

---

**Last updated:** 2026-06-18
