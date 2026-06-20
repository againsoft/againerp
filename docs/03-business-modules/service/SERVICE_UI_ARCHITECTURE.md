# Service Module — UI Architecture

> **Status:** Planning Phase  
> **Version:** 1.0  
> **Module:** Service  
> **Document Type:** UI/UX Architecture  
> **Phase:** STEP 06 / §25 — Planning Only  
> **Parent:** [SERVICE_MODULE_MASTER_PLAN.md](./SERVICE_MODULE_MASTER_PLAN.md) · [SERVICE_MODULE_ARCHITECTURE.md](./SERVICE_MODULE_ARCHITECTURE.md)

---

**No React code in this phase.** Prototype implementation starts at STEP 07.

---

## 1. Design Formula

| Source | % | Applied to Service |
|--------|---|-------------------|
| **Odoo** | 60% | Operational lists, form sheets, status bars, repair kanban |
| **Shopify Admin** | 20% | Clean KPI cards, filters, empty states |
| **Notion** | 10% | Notes, activity timeline, lightweight tables |
| **Linear** | 10% | Priority chips, SLA urgency, keyboard shortcuts |

**Mandatory standards:**

- [module-ui-standard.md](../../04-uiux/standards/module-ui-standard.md)
- [datatable-and-drawer-standard.md](../../04-uiux/standards/datatable-and-drawer-standard.md)
- [page-architecture.md](../../04-uiux/standards/page-architecture.md)
- Dark mode via `useIsDark()` + CSS variables

---

## 2. Global Layout

```text
┌─────────────────────────────────────────────────────────┐
│ Period / SLA banner (optional)                          │
├─────────────────────────────────────────────────────────┤
│ KPI row (contextual per page)                         │
├─────────────────────────────────────────────────────────┤
│ Filter strip · status tabs · search · primary action    │
├─────────────────────────────────────────────────────────┤
│ AG Grid (desktop) / card list (mobile)                  │
├─────────────────────────────────────────────────────────┤
│ Pagination · row count                                  │
└─────────────────────────────────────────────────────────┘
         │
         └── Sheet drawer: ?create=1 · ?view={id} · ?edit={id}
```

**Page wrapper:** `min-h-[calc(100vh-2.75rem-1.5rem)]`  
**Subtitle:** `AgainERP › Service › [Page]`

---

## 3. Navigation & Module Shell

**Nav group:** `nav.service` in [navigation-config.ts](../../../apps/web/src/lib/workspace/navigation-config.ts) (at implementation)

**Icon:** `Wrench` (Lucide)

Sidebar order matches [SERVICE_MODULE_ARCHITECTURE.md §2](./SERVICE_MODULE_ARCHITECTURE.md).

---

## 4. Screen Inventory (STEP 07–18)

| Step | Route | Component (planned) | Pattern |
|------|-------|-------------------|---------|
| 07 | `/service` | `service-dashboard.tsx` | KPI + charts + module cards |
| 08 | `/service/catalog` | `service-catalog.tsx` | AG Grid + item form sheet |
| 09 | `/service/assets` | `service-assets.tsx` | AG Grid + asset detail tabs |
| 10 | `/service/orders` | `service-orders.tsx` | AG Grid + order drawer (lines, WO, SLA) |
| 11 | `/service/work-orders` | `service-work-orders.tsx` | AG Grid + mobile-first WO sheet |
| 12 | `/service/repairs` | `service-repairs.tsx` | Kanban by repair_stage + detail |
| 13 | `/service/technicians` | `service-technicians.tsx` | Grid + profile sheet + metrics |
| 14 | `/service/schedule` | `service-schedule.tsx` | Calendar + timeline + board tabs |
| 15 | `/service/contracts` | `service-contracts.tsx` | AG Grid + contract sheet |
| 16 | `/service/subscriptions` | `service-subscriptions.tsx` | AG Grid + billing cycle panel |
| 17 | `/service/reports` | `service-reports.tsx` | Report hub (Finance reports pattern) |
| 18 | `/service/ai` | `service-ai-insights.tsx` | AI cards + action queue |

**Settings:** `/service/settings` — assignment rules, repair stages, SLA defaults

---

## 5. Key Screen Specs

### 5.1 Dashboard `/service`

| Section | Content |
|---------|---------|
| KPI row | Open orders · Today visits · SLA at risk · AMC renewals |
| Charts | Orders by status · Technician utilization |
| Module cards | Quick links to Orders, Schedule, Repairs, Contracts |
| AI strip | 3 insight cards (assign suggestion, renewal, anomaly) |
| Quick actions | New Order · Open Schedule · Register Asset |

### 5.2 Service Orders `/service/orders`

**Columns:** Order # · Customer · Asset · Service · Priority · Schedule · Technician · Status · SLA · Billing

**Drawer tabs:** Details · Lines · Work Orders · Parts · Activity · SLA

**Mobile:** Card list with priority color + tap to drawer

### 5.3 Work Orders (Technician-first)

**Mobile layout:** Full-width drawer, large check-in/out buttons, parts scanner placeholder, signature pad.

**Desktop:** AG Grid with row menu — View · Check-in · Add parts · Complete

### 5.4 Schedule `/service/schedule`

**Tabs:** `?tab=calendar` · `?tab=timeline` · `?tab=board`

- Calendar: day/week/month with order chips
- Timeline: rows = technicians, bars = slots
- Board: columns = technicians, cards = assigned orders

### 5.5 Repairs Kanban

Columns map to `repair_stage` values. Drag-drop transitions (with permission guard). Card shows asset, customer, days in stage.

---

## 6. Shared Components (reuse)

| Component | Source module |
|-----------|---------------|
| KPI row / status tabs | `finance-kpi-tabs.tsx` pattern |
| Period banner | Adapt from Finance or generic |
| AG Grid wrapper | `product-grid.tsx` pattern |
| Drawer tabs | `document-cheques-tab.tsx` → generic `DrawerTabs` |
| Activity timeline | Core chatter component |
| Signature capture | Shared media upload |

---

## 7. Prototype Phase Rules

1. Mock data in `src/lib/mock-data/service.ts`
2. Actions → `toast` until STEP 20 backend
3. All list pages MUST use AG Grid + mobile cards
4. All CRUD in Sheet drawers — no `/new` routes
5. Dark mode verified before marking screen complete

---

## 8. Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `< sm` | Full-width drawer, card lists, bottom action bar on WO |
| `sm–lg` | 2-col KPI, condensed grid |
| `≥ lg` | Full AG Grid, split schedule views |

Tap targets: minimum 44px on mobile WO actions.

---

## Change History

| Date | Change |
|------|--------|
| 2026-06-21 | v1.0 — Initial UI architecture (STEP 06) |
