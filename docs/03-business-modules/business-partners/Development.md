# Business Partners — Step-by-Step Development Plan

## Purpose
Documentation: Development.

## When To Read
Read only if your task involves development.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

> **Status:** Draft — **P1–P8 UI prototype implemented** · **Track D migration (M1–M3) implemented**  
> **Phase:** UI prototype active · Backend not started  
> **Parent:** [README.md](./README.md) · [Architecture.md](./Architecture.md)

---


## When To Read
Read only if your task involves development.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## Overview

| Track | Steps | Output |
|-------|-------|--------|
| **A — Documentation** | A1–A9 | Approved module docs |
| **B — UI prototype** | P1–P7 | Navigable `/partners/*` screens |
| **C — Backend** | B1–B6 | API + DB (post-prototype) |
| **D — Migration** | M1–M3 | `/suppliers` → `/partners` |

---

## Track A — Documentation (current)

| Step | Task | Deliverable | Status |
|------|------|-------------|--------|
| **A1** | Naming + scope decision | README § Naming | ✅ |
| **A2** | Enterprise architecture | Architecture.md | ✅ |
| **A3** | Database schema plan | Database.md | ✅ |
| **A4** | API contracts | API.md | ✅ |
| **A5** | Workflows | Workflow.md | ✅ |
| **A6** | Permissions | Permissions.md | ✅ |
| **A7** | Integration map | INTEGRATION.md + MODULE_DEPENDENCY_MAP | ✅ |
| **A8** | UI build guide + screens | ui-prototype/business-partners/* | ✅ |
| **A9** | Review → Status **Ready** | Architect sign-off | ⏳ Pending |

---

## Track B — UI prototype (planned)

Detail: [BUSINESS_PARTNERS_UI_BUILD_GUIDE.md](../../04-uiux/prototype/business-partners/BUSINESS_PARTNERS_UI_BUILD_GUIDE.md)

| Step | Phase | Scope | Route | Status |
|------|-------|-------|-------|--------|
| **P1** | Shell + nav | Sidebar, overview KPIs | `/partners` | ✅ |
| **P2** | Partner directory | AG Grid + role filters | `/partners/directory` | ✅ |
| **P3** | Drawer CRUD | create · view · edit | `?create` `?view` `?edit` | ✅ |
| **P4** | Roles + terms tabs | Multi-role, per-role terms | view drawer tabs | ✅ |
| **P5** | Onboarding queue | Application list + approve drawer | `/partners/onboarding` | ✅ |
| **P6** | Tiers + territories | Tier admin + assignment | `/partners/tiers` | ✅ |
| **P7** | Catalog + integration | Vendor catalog; Purchase/Sales stubs | drawer Catalog tab | ✅ |
| **P8** | Territories · Performance · Settings | `/partners/territories` · `/performance` · `/settings` | ✅ |

**After each phase:** update build guide status + `CHANGELOG.md`.

---

## Track C — Backend (future)

| Step | Task | Depends on |
|------|------|------------|
| **B1** | Alembic migrations `bp_*` | A9 Ready |
| **B2** | BusinessPartnerService | B1 |
| **B3** | REST API `/api/v1/business-partners/` | B2 |
| **B4** | Event publishers | B3 |
| **B5** | Purchase/Sales integration | B4, Purchase API |
| **B6** | Performance rollup job | B5 |

---

## Track D — Migration from Suppliers prototype

| Step | Task | Notes |
|------|------|-------|
| **M1** | Map `suppliers.ts` → `bp_partners` seed | Keep IDs stable where possible | ✅ |
| **M2** | Redirect `/suppliers/all` → `/partners/directory?role=vendor` | Deprecation banner | ✅ |
| **M3** | Move `vendor-product-mapping` → BP catalog store | Single owner | ✅ (facade) |

Purchase PO/RFQ/Receipt routes **stay** under `/suppliers/*` or `/purchase/*` until Purchase module rename.

---

## File structure (prototype — when coding starts)

```text
apps/web/src/
├── app/(admin)/partners/
│   ├── page.tsx                      # Overview
│   ├── directory/page.tsx            # List + drawers
│   ├── onboarding/page.tsx
│   └── tiers/page.tsx
├── components/partners/
│   ├── partners-nav.tsx
│   ├── partners-control-center.tsx
│   ├── partner-grid.tsx
│   ├── partner-view-dialog.tsx
│   ├── partner-form-dialog.tsx
│   ├── partner-detail-content.tsx
│   └── partner-onboarding-panel.tsx
└── lib/
    ├── mock-data/business-partners.ts
    └── store/business-partner-store.ts
```

---

## Definition of done (planning phase)

- [x] Module docs package complete (A1–A8)
- [x] UI screen specs + build guide
- [x] MODULE_DEPENDENCY_MAP entry
- [ ] Architect review (A9)
- [ ] PAGE_REGISTRY entry (when routes built)

---

**Last Updated:** 2026-06-17
