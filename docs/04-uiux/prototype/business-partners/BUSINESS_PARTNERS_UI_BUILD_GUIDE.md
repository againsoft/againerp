# Business Partners Module — UI Build Guide (Prototype Plan)

## Purpose
Documentation: BUSINESS PARTNERS UI BUILD GUIDE.

## When To Read
Read only if your task involves business partners ui build guide.

## Related Files
- [Cursor entry](../../../BRAIN.md)

## Read Next
- [Doc map](../../../PROJECT_MAP.md)

---

> **Status:** Draft (Planning) — **P1–P4 prototype implemented**  
> **Scope:** UI/UX plan for `/partners/*`  
> **Architecture:** [Architecture.md](../../../03-business-modules/business-partners/Architecture.md)  
> **Dev steps:** [Development.md](../../../03-business-modules/business-partners/Development.md)  
> **Common rules:** [PROJECT_COMMON_RULES.md](../../../00-foundation/PROJECT_COMMON_RULES.md)


## When To Read
Read only if your task involves business partners ui build guide.

## Related Files
- [Cursor entry](../../../BRAIN.md)

## Read Next
- [Doc map](../../../PROJECT_MAP.md)

---

Prototype route namespace: **`/partners/*`**

---

## 1. Module কীভাবে কাজ করবে

Business Partners = **commercial identity hub** — vendor, retailer, wholesaler, distributor এক জায়গায়।

```text
Core Contact (identity)
        ↓
Business Partner (commercial profile + roles)
        ↓
   ┌────┴────┬──────────┬─────────┐
   ▼         ▼          ▼         ▼
Purchase   Sales      CRM    Catalog
(PO)       (SO)    (pipeline) (sourcing)
```

| Role | Buy/Sell | Consumer module |
|------|----------|-----------------|
| Vendor | Buy from | Purchase |
| Wholesaler / Retailer | Sell to | Sales |
| Channel partner | Sell through | CRM |
| Dropship | Fulfill | Inventory |

---

## 2. Mandatory UI rule — Drawer only

> Copy pattern: **`/catalog/products`** · `/manufacturing/work-orders`

| Action | URL | Component |
|--------|-----|-----------|
| List | `/partners/directory` | `partner-grid.tsx` (AG Grid) |
| Create | `?create=1` | `PartnerFormDialog` |
| View | `?view={id}` | `PartnerViewDialog` → `PartnerDetailContent` |
| Edit | `?edit={id}` | `PartnerFormDialog` |
| Update | Save in edit drawer | Store patch → `?view={id}` |

```tsx
<SheetContent
  side="right"
  className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
/>
```

**❌ Forbidden:** `/partners/new`, `/partners/[id]`, full-page detail (migrate away from `/suppliers/[id]`)

---

## 3. Build phases (step-by-step)

| Phase | Deliverable | Route | Status |
|-------|-------------|-------|--------|
| **P1** | Nav + overview KPIs | `/partners` | ✅ |
| **P2** | Partner directory grid | `/partners/directory` | ✅ |
| **P3** | Drawer create · view · edit | query params | ✅ |
| **P4** | Roles + terms tabs | view drawer | ✅ (basic) |
| **P5** | Onboarding queue | `/partners/onboarding` | ✅ |
| **P6** | Tier management | `/partners/tiers` | ✅ |
| **P7** | Vendor catalog tab + Purchase stub | view drawer | ✅ |

**After each phase:** update this table + [README.md](./README.md) + `CHANGELOG.md`.

---

## 4. Application shell

### Sidebar navigation

```text
Business Partners (Handshake icon)
├── Overview          /partners
├── Directory         /partners/directory
├── Onboarding        /partners/onboarding
├── Tiers             /partners/tiers
├── Territories       /partners/territories      ✅
├── Performance       /partners/performance     ✅
└── Settings          /partners/settings        ✅
```

**Role quick filters** on Directory (chips, not separate routes):

`All` · `Vendors` · `Retailers` · `Wholesalers` · `Distributors` · `Channel`

URL: `/partners/directory?role=vendor`

---

## 5. P1 — Overview (`/partners`)

| Widget | Content |
|--------|---------|
| KPI cards | Active partners · Pending onboarding · Vendors · Wholesale accounts |
| Chart | Partners by role (donut) |
| Chart | Top vendors by spend (bar) |
| List | Recent onboarding applications |
| List | Partners on credit hold |
| Quick actions | New partner · Review onboarding |

**Mobile:** KPI 2-column grid; charts stack; full-width cards.

---

## 6. P2 — Directory grid

| Column | Notes |
|--------|-------|
| Partner | Name + code |
| Roles | Badge chips (vendor, wholesaler, …) |
| Status | active · on_hold · blocked |
| Territory | Primary region |
| Tier | Wholesale tier code |
| Terms | Net 30 summary |
| Rating | ★ 4.2 |
| Spend / Revenue | Role-dependent column |
| Actions | View · Edit · Create PO · Create SO |

**Filters:** role, status, territory, tier, assigned user, search  
**Grid:** AG Grid — `h-[min(520px,62vh)]` fixed height (manufacturing pattern)

Detail: [PartnerDirectory.md](./PartnerDirectory.md)

---

## 7. P3 — Partner view drawer tabs

| Tab | Content |
|-----|---------|
| Overview | Status, roles, credit, KPI strip, smart buttons |
| Profile | Core contact fields (read-through) |
| Roles | Enable/disable roles |
| Terms | Per-role payment terms, MOQ, lead time |
| Tiers | Assigned wholesale/retail tiers |
| Territories | Region list + map stub |
| Catalog | Vendor SKU table (vendor role) |
| Transactions | Links to PO/SO lists (consumer modules) |
| Performance | OTD %, spend, revenue charts |
| Activity | Chatter + integration events |

**Header actions:** Create PO · Create SO · Edit · Block · Activity

**Mobile:** Full-width drawer; tabs → horizontal scroll; tables → card rows.

---

## 8. P3 — Create / Edit form sections

| Section | Fields |
|---------|--------|
| Identity | Link existing contact OR create new org/person |
| Partner code | Auto `BP-####` |
| Roles | Multi-select checkboxes |
| Initial terms | Per selected role (collapsible) |
| Assignment | Account manager |
| Credit | Limit, hold flag |

**Save:** validate roles ≥ 1 · create Core contact if needed · patch store.

---

## 9. P5 — Onboarding

| Column | Content |
|--------|---------|
| Application # | ONB-2026-0042 |
| Company | Applicant name |
| Requested roles | Chips |
| Submitted | Date |
| Status | submitted · review · approved · rejected |
| Reviewer | User |

**View drawer:** application detail · documents · approve/reject actions  
Detail: [PartnerOnboarding.md](./PartnerOnboarding.md)

---

## 10. P6 — Tiers

| Screen | Pattern |
|--------|---------|
| Tier list | AG Grid + `?create` `?view` `?edit` drawers |
| Fields | code, name, type (wholesale/retail/dealer), discount %, price list |

Detail: [PartnerTiers.md](./PartnerTiers.md)

---

## 11. P7 — Integration UI stubs

| Action | Prototype behavior |
|--------|-------------------|
| Create PO from vendor partner | Navigate `/suppliers/purchase-orders?create=1&partnerId=` |
| Create SO from wholesaler | Toast + link `/sales` (when built) |
| Map catalog item | Reuse `MapSupplierSheet` pattern → BP catalog store |
| Module off | Nav hidden; no errors in Purchase |

---

## 12. Mobile responsive checklist

- [ ] Drawer `w-full` on `< sm`, `max-w-3xl` on `≥ sm`
- [ ] Directory grid horizontal scroll or card view `< md`
- [ ] Role filter chips wrap; touch targets ≥ 44px
- [ ] Onboarding approve buttons sticky footer on mobile
- [ ] Charts `min-h-[176px]` container (avoid Recharts 0 height)
- [ ] Tab bar scrollable on narrow screens

Ref: [ui-ux/mobile-first.md](../../standards/mobile-first.md)

---

## 13. Mock data plan (when coding)

| File | Content |
|------|---------|
| `business-partners.ts` | 25+ partners, all roles represented |
| `business-partner-onboarding.ts` | 8 applications, mixed status |
| `business-partner-tiers.ts` | Tier definitions |
| Migrate from | `suppliers.ts`, `vendor-product-mapping.ts` |

---

## 14. File structure (implementation)

```text
apps/web/src/
├── app/(admin)/partners/
│   ├── page.tsx
│   ├── directory/page.tsx
│   ├── onboarding/page.tsx
│   └── tiers/page.tsx
├── components/partners/
│   ├── partners-nav.tsx
│   ├── partners-control-center.tsx
│   ├── partner-grid.tsx
│   ├── partner-view-dialog.tsx
│   ├── partner-form-dialog.tsx
│   ├── partner-detail-content.tsx
│   ├── partner-roles-tab.tsx
│   ├── partner-terms-tab.tsx
│   ├── partner-catalog-tab.tsx
│   ├── partner-onboarding-grid.tsx
│   ├── onboarding-grid.tsx
│   ├── onboarding-detail-content.tsx
│   ├── onboarding-view-dialog.tsx
│   ├── tier-grid.tsx
│   ├── tier-detail-content.tsx
│   ├── tier-form.tsx
│   ├── tier-form-dialog.tsx
│   ├── tier-view-dialog.tsx
│   ├── partner-catalog-tab.tsx
│   ├── map-partner-catalog-sheet.tsx
│   └── link-catalog-product-sheet.tsx
└── lib/
    ├── mock-data/business-partners.ts
    ├── mock-data/business-partner-onboarding.ts
    ├── mock-data/business-partner-tiers.ts
    ├── mock-data/business-partner-catalog.ts
    └── store/
        ├── business-partner-store.ts
        ├── business-partner-onboarding-store.ts
        ├── business-partner-tier-store.ts
        └── business-partner-catalog-store.ts
```

---

## 15. Adding a new partner screen (checklist)

- [ ] List page: AG Grid + `Suspense` for `useSearchParams`
- [ ] `?create=1` → form drawer
- [ ] `?edit={id}` → form drawer
- [ ] `?view={id}` → view drawer
- [ ] No `/new` routes
- [ ] Mobile tested at 375px width
- [ ] Screen doc in `docs/ui-prototype/business-partners/`
- [ ] Update this guide phase status

---

**Last Updated:** 2026-06-17
