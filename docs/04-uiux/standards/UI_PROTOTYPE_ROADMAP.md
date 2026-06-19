# AgainERP — UI Prototype Development Roadmap

> **Status:** Active — **UI prototype SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 24 — UI Prototype Roadmap  
> **Governance:** [FINAL_UI_ARCHITECTURE_LOCK.md](../FINAL_UI_ARCHITECTURE_LOCK.md) — APPROVED  
> **Gate:** [UI_READINESS_REPORT.md](../UI_READINESS_REPORT.md) — prototype authorized · production gated

**Documentation only.** No implementation code · No Figma deliverables in this document.

---

## Purpose

Define the **sequenced development roadmap** for the AgainERP **UI prototype** — what to build, in what order, with dependencies, success criteria, risks, and validation — aligned with locked architecture and platform blueprints.

## Scope

| In scope | Out of scope |
|----------|--------------|
| Interactive prototype in `apps/web/` (when implementation starts) | Backend API · database · RBAC enforcement |
| Shell · navigation · dashboards · module screen patterns | Production deployment · performance tuning |
| Mock data · stub metrics · drawer CRUD flows | Cross-module DB · real integrations |

**Prototype rule:** Follow locked patterns — list + drawer CRUD (`?create=1` · `?view=` · `?edit=`), `DS-*` / `WS-*` components, platform-owned dashboard grid.

## Authority stack

```text
FINAL_UI_ARCHITECTURE_LOCK.md
├── WORKSPACE_UI_BLUEPRINT.md      (Step 11 · Phase 01)
├── NAVIGATION_UI_BLUEPRINT.md     (Step 12 · Phase 01)
├── DASHBOARD_UI_BLUEPRINT.md      (Step 13 · Phase 01)
├── COMPONENT_UI_BLUEPRINT.md      (Step 14 · all phases)
└── Module UI blueprints           (Steps 15–23 · Phases 02–04)
```

---

## Development Order Summary

| Priority | Phase | Focus | Depends on |
|----------|-------|-------|------------|
| **P0** | **Phase 01** | Platform shell · nav · dashboards | Design system lock (Step 10) |
| **P1** | **Phase 02** | ERP operations modules (5) | Phase 01 complete |
| **P2** | **Phase 03** | Commerce · builder · SEO | Phase 01 · partial Phase 02 |
| **P3** | **Phase 04** | HR/Payroll · executive · AI OS | Phase 01–03 patterns established |

**Parallel work allowed:** Component library (Step 14) can proceed alongside Phase 01; module blueprints are documentation-first (Steps 15–23 complete before Phase 02 build).

---

## Phase 01 — Platform Foundation

**Scope:** Workspace Shell · Navigation · Dashboard

**Blueprint authority:** [WORKSPACE_UI_BLUEPRINT.md](./WORKSPACE_UI_BLUEPRINT.md) · [NAVIGATION_UI_BLUEPRINT.md](./NAVIGATION_UI_BLUEPRINT.md) · [DASHBOARD_UI_BLUEPRINT.md](./DASHBOARD_UI_BLUEPRINT.md)

### Objectives

1. Deliver a **clickable admin shell** that every module renders inside — no module duplicates Zones A–F.
2. Implement **four-level navigation** with RBAC-ready hide (mock roles).
3. Stand up **dashboard engine UI** — 12-col grid, widget chrome, workspace + one reference module dashboard.
4. Prove **mobile-first** shell: bottom nav, full-screen drawer, card list fallback hook.

### Deliverables

| # | Deliverable | Blueprint ref |
|---|-------------|---------------|
| 1 | Zone layout A–F — header, sidebar, module nav, content, utility, bottom nav | WORKSPACE §1 |
| 2 | Workspace switcher · global search (`Ctrl+K`) · quick actions · AI trigger (`Ctrl+J`) | WORKSPACE §2 |
| 3 | Left sidebar — 10 groups · favorites · recent · collapse 240→64px | NAVIGATION §1–2 |
| 4 | Module nav tabs (Zone B) · breadcrumbs · page header pattern | NAVIGATION §3–5 |
| 5 | Command palette · context menu patterns | NAVIGATION §6 |
| 6 | Workspace dashboard `/home` — welcome · KPI strip · AI briefing · activities | DASHBOARD §2 |
| 7 | Dashboard grid engine — `WS-CONTENT-DASH` · `WS-CONTENT-WIDGET` · resize/pin (mock persist) | DASHBOARD §1 · §7 |
| 8 | Reference **module dashboard** (e.g. Core or Catalog) with mock widgets | DASHBOARD §4 |
| 9 | Responsive breakpoints — tablet collapse · mobile stack | WORKSPACE §6 · DASHBOARD §8 |
| 10 | Phase 01 validation checklist signed | § Validation below |

### Dependencies

| Dependency | Status |
|------------|--------|
| FINAL_UI_ARCHITECTURE_LOCK | Approved |
| DESIGN_SYSTEM_FOUNDATION + Step 10 standards | Approved |
| DASHBOARD_ARCHITECTURE_LOCK | Approved |
| COMPONENT_UI_BLUEPRINT (catalog IDs) | Step 14 — parallel read |
| Mock workspace context (company, branch, currency) | Prototype fixture |

**Blocks:** All Phase 02–04 module prototype work.

### Success criteria

- [ ] Single shell route — modules render Zone D only
- [ ] Navigation reconstructs Levels 1–4 from deep links
- [ ] Dashboard uses platform grid — no module custom dashboard shell
- [ ] Drawer CRUD demonstrated on one reference list screen
- [ ] Mobile: bottom nav + full-screen overlay drawer
- [ ] No `/new` or `/[id]/edit` routes on reference CRUD
- [ ] Semantic tokens only — no raw hex in prototype theme
- [ ] Phase 01 walkthrough: login → home → module → list → drawer view

---

## Phase 02 — ERP Operations Modules

**Scope:** CRM · Sales · Inventory · Purchase · Finance

**Blueprint authority:**

| Module | UI blueprint |
|--------|--------------|
| CRM | [CRM_UI_BLUEPRINT.md](../03-business-modules/crm/CRM_UI_BLUEPRINT.md) |
| Sales | [SALES_UI_BLUEPRINT.md](../03-business-modules/sales/SALES_UI_BLUEPRINT.md) |
| Inventory | [INVENTORY_UI_BLUEPRINT.md](../03-business-modules/inventory/INVENTORY_UI_BLUEPRINT.md) |
| Purchase | [PURCHASE_UI_BLUEPRINT.md](../03-business-modules/purchase/PURCHASE_UI_BLUEPRINT.md) |
| Finance | [FINANCE_UI_BLUEPRINT.md](../03-business-modules/finance/FINANCE_UI_BLUEPRINT.md) |

### Objectives

1. Prototype **Business Operations** sidebar group with five modules navigable end-to-end.
2. Each module: **dashboard + primary list + drawer CRUD detail** (minimum viable screen set).
3. Demonstrate **cross-module UI links** (UUID routes only — e.g. Sales customer → Core contact).
4. Finance: journal form + reconciliation split-pane layout exceptions (ADR layouts).
5. Establish **mock metrics APIs** pattern for dashboard widgets per module.

### Deliverables

| Module | Minimum prototype screens |
|--------|---------------------------|
| **CRM** | Dashboard · pipeline/leads list · lead drawer · customer view |
| **Sales** | Dashboard · quotations list · quotation detail (tabs) · orders list |
| **Inventory** | Dashboard · stock list · warehouse detail · transfer list |
| **Purchase** | Dashboard · RFQ list · PO detail · receipt entry |
| **Finance** | Dashboard · COA tree · journal entry (DR/CR) · AR/AP lists · reconciliation workspace |

**Shared deliverables:**

- Module nav tabs per blueprint (Dashboard · Operations · Reports · Settings)
- `DS-DATAGRID` desktop · `DS-CARD-LIST` mobile on all lists
- Activity tab / Zone E placeholder on one detail screen per module
- Module dashboard widgets (mock) — ≥3 KPIs per MODULE_DASHBOARD_STANDARD

### Dependencies

| Dependency | Notes |
|------------|-------|
| **Phase 01 complete** | Shell · nav · dashboard engine |
| COMPONENT_UI_BLUEPRINT | All `DS-*` references |
| Module UI blueprints (Steps 15–16, 19–21) | Documentation Ready |
| Mock data fixtures per module | JSON or MSW — no real API |
| Finance ADR layouts | `LAYOUT-JOURNAL` · `LAYOUT-RECONCILIATION` |

**Soft dependency:** CRM before Sales (customer link demo) · Purchase before Finance (bill match demo).

### Success criteria

- [ ] Five module dashboards render in shared grid template
- [ ] Each module: list + `?create=1` + `?view=` drawer works
- [ ] RBAC mock: hidden nav items for restricted role
- [ ] Finance journal shows balance footer (DR = CR)
- [ ] No cross-module data coupling in prototype stores
- [ ] Mobile card fallback on at least two module lists
- [ ] Breadcrumb trail correct on deep links

### Recommended build order (within phase)

1. **Sales** — reference B2B document flow (aligns with Phase 01 CRUD reference)  
2. **CRM** — pipeline kanban optional; customer links to Sales  
3. **Inventory** — stock list; link from Sales product lines (read-only)  
4. **Purchase** — RFQ comparison matrix; receipt preview  
5. **Finance** — highest complexity last (journal · reconciliation)

---

## Phase 03 — Commerce & Content

**Scope:** Ecommerce · Builder · SEO

**Blueprint authority:**

| Area | UI blueprint |
|------|--------------|
| Ecommerce Admin | [ECOMMERCE_UI_BLUEPRINT.md](../03-business-modules/ecommerce/ECOMMERCE_UI_BLUEPRINT.md) |
| Builder | [BUILDER_UI_BLUEPRINT.md](../03-business-modules/ecommerce/builder/BUILDER_UI_BLUEPRINT.md) |
| SEO | ECOMMERCE §9 + `Menus/SEO/` index |

### Objectives

1. Prototype **Commerce** sidebar group — admin catalog · orders · customers.
2. Product detail **full-page multi-tab** (10 tabs — prototype subset: General · Pricing · Images · SEO).
3. **Builder canvas** (`LAYOUT-BUILDER`) — left panel · canvas · inspector · toolbar (single page type).
4. **SEO hub** — audit list · meta manager · AI SEO assistant panel.
5. Show **Inventory read-only** stock on product list (module-off safe).

### Deliverables

| # | Deliverable |
|---|-------------|
| 1 | Ecommerce dashboard + product list + product detail (subset tabs) |
| 2 | Order list + order detail (status · payment · shipping badges) |
| 3 | Customer list (Core contacts shell) |
| 4 | Builder: homepage editor shell — drag-drop mock · responsive preview switcher |
| 5 | SEO dashboard + audit issue list + meta bulk editor |
| 6 | Marketing entry stub (nav only) if time-boxed |

### Dependencies

| Dependency | Notes |
|------------|-------|
| **Phase 01 complete** | Required |
| **Phase 02 Inventory + Sales** | Soft — stock badge · order link demos |
| ECOMMERCE · BUILDER blueprints | Steps 17–18 |
| `LAYOUT-BUILDER` ADR | Canvas exception to drawer CRUD |
| Media picker mock | Core media pattern |

### Success criteria

- [ ] Ecommerce nav: Dashboard · Catalog · Orders · SEO · Settings
- [ ] Product list: filters · bulk bar · import/export menus (UI only)
- [ ] Builder: 3-column layout functional with mock widgets
- [ ] SEO audit drill-down links to product SEO tab
- [ ] Full-page product detail — not drawer (complex entity rule)
- [ ] Module-off: Inventory badge hides gracefully

### Recommended build order (within phase)

1. **Ecommerce** — dashboard · products · orders  
2. **SEO** — audit · meta manager  
3. **Builder** — canvas shell last (highest UX risk)

---

## Phase 04 — People · Leadership · AI

**Scope:** HR & Payroll · Executive Dashboard · AI OS

**Blueprint authority:**

| Area | UI blueprint |
|------|--------------|
| HR & Payroll | [HR_PAYROLL_UI_BLUEPRINT.md](../03-business-modules/hr-payroll/HR_PAYROLL_UI_BLUEPRINT.md) |
| Executive | [EXECUTIVE_DASHBOARD_UI_BLUEPRINT.md](./EXECUTIVE_DASHBOARD_UI_BLUEPRINT.md) |
| AI OS | [AI_DASHBOARD_ARCHITECTURE.md](./AI_DASHBOARD_ARCHITECTURE.md) · FINAL lock §8 |

### Objectives

1. Prototype **HR** employee directory + 360° profile (tab subset).
2. Prototype **Payroll** run review screen (`LAYOUT-PAYROLL-RUN`) with mock exceptions.
3. **Attendance** check-in + calendar · **Leave** request + approval bar.
4. **Executive dashboard** `/executive` — AI summary row + cross-module KPI strip (mock rollup).
5. **AI OS** surfaces — header panel · briefing widget · suggestion confirm flow (no auto-post).
6. **ESS** mobile-first shell (optional stretch — `/ess` subset).

### Deliverables

| # | Deliverable |
|---|-------------|
| 1 | HR dashboard · employee list · employee profile (Employment · Leave · Documents tabs) |
| 2 | Leave list + approval workflow UI |
| 3 | Payroll dashboard · payroll run detail · payslip list |
| 4 | Recruitment kanban (single pipeline) — optional |
| 5 | Executive dashboard — `tpl.executive.standard` full grid mock |
| 6 | AI Daily Brief on `/home` + Executive AI summary |
| 7 | AI panel: suggest → preview → apply (mock) on one screen |
| 8 | `/hr/approvals` unified approval inbox stub |

### Dependencies

| Dependency | Notes |
|------------|-------|
| **Phase 01 complete** | Required |
| **Phase 02 Finance** | Soft — payroll post link · executive cash widgets |
| **Phase 02–03 module dashboards** | Executive widgets drill-down targets |
| HR_PAYROLL · EXECUTIVE blueprints | Steps 22–23 |
| AI_COMPONENT_STANDARD | `DS-AI-*` only |

### Success criteria

- [ ] HR + Payroll routes `/hr/*` · `/payroll/*` in sidebar
- [ ] Employee = contact + employment mock — no duplicate person form
- [ ] Payroll run: status pipeline visible · locked payslip read-only
- [ ] Executive: ten domain sections represented (mock KPIs)
- [ ] AI widgets hidden when `aiModuleOff` fixture
- [ ] Approval: approve/reject with comment on leave record
- [ ] Executive drill-down navigates to Phase 02 module dashboards

### Recommended build order (within phase)

1. **HR** — employees · leave · attendance  
2. **Payroll** — run review · payslips  
3. **Executive Dashboard** — depends on mock metrics from Phase 02–03  
4. **AI OS** — cross-cutting polish on home + executive + one module

---

## Priority Matrix

| Priority | Item | Rationale |
|----------|------|-----------|
| **P0** | Shell + nav + drawer CRUD | Blocks everything |
| **P0** | Dashboard engine | Module and executive views |
| **P1** | Sales + Finance lists | Most common ERP demos |
| **P1** | Component catalog compliance | Prevents prototype drift |
| **P2** | Ecommerce product + order | Commerce revenue story |
| **P2** | Inventory stock views | Ties operations to commerce |
| **P3** | Builder canvas | ADR layout · high effort |
| **P3** | Executive rollup | Needs cross-module mocks |
| **P4** | ESS mobile portal | Stretch · HR Phase 04 |
| **P4** | Full Finance reconciliation | Complex · partial mock OK |

---

## Risk Areas

| Risk | Phase | Mitigation |
|------|-------|------------|
| **Shell zone duplication** | 01 | Code review against WORKSPACE_UI_BLUEPRINT — modules Zone D only |
| **Custom module dashboards** | 01–04 | Enforce `WS-CONTENT-DASH`; no local grid implementations |
| **CRUD route drift** (`/new`, `/edit`) | All | Lint/grep gate · blueprint checklist |
| **Cross-module mock coupling** | 02 | UUID links only · separate fixture files per module |
| **Finance journal / reconciliation complexity** | 02 | Ship read-only reconciliation first · journal post mock |
| **Builder canvas scope creep** | 03 | Time-box to one page type + 5 widget types |
| **Ecommerce 167-screen inventory** | 03 | Blueprint simplified nav — prototype subset only |
| **Executive aggregation fiction** | 04 | Label widgets "mock rollup"; document real API deferred (M-02) |
| **AI auto-action temptation** | 04 | Enforce suggest → confirm; no silent state changes |
| **Mobile parity lag** | All | Card list + bottom nav in Phase 01 definition of done |
| **Zustand selector re-renders** | All | Project rule: no `.slice()`/`.filter()` in selectors |
| **Production gate confusion** | All | Prototype banner · UI_READINESS_REPORT distinction |

---

## Validation Strategy

### Per-phase gate

Each phase completes with a **Phase Validation Record** (markdown checklist in `docs/04-uiux/prototype/` when implementation starts):

| Gate | Checks |
|------|--------|
| **Architecture compliance** | FINAL_UI_ARCHITECTURE_LOCK checklist |
| **Blueprint traceability** | Every screen maps to blueprint section |
| **Component IDs** | `DS-*` / `WS-*` documented in screen notes |
| **Responsive** | Desktop + one mobile viewport smoke |
| **Accessibility** | Focus order · 44px taps · status not color-only |
| **RBAC UX** | Hide-not-disable demonstrated |

### Validation methods

| Method | When |
|--------|------|
| **Blueprint walkthrough** | End of each phase — PM + design review |
| **Route audit** | Automated — forbidden `/new` `/edit` patterns |
| **Widget registry review** | Phase 01 + each module dashboard |
| **Cross-module link test** | Phase 02+ — click through UUID links |
| **Mobile stack test** | Phase 01 shell + one list per subsequent phase |
| **AI UX review** | Phase 04 — confirm hide · confirm · audit placeholder |
| **Regression vs lock** | Any phase — diff against FINAL_UI_VALIDATION_REPORT themes |

### Prototype vs production

| Dimension | Prototype (this roadmap) | Production (blocked) |
|-----------|--------------------------|---------------------|
| Data | Mock / MSW | Real API + RBAC |
| Auth | Stub roles | Full permission engine |
| Dashboard metrics | Static / random | Module metric APIs |
| AI | UI shell | AI OS tools + audit |
| Performance | Best effort | Budgets per module |

Authority: [UI_READINESS_REPORT.md](../UI_READINESS_REPORT.md).

### Final prototype acceptance (all phases)

- [ ] All four phases validation records signed  
- [ ] No critical items from FINAL_UI_VALIDATION_REPORT regressed  
- [ ] MODULE_UI_BLUEPRINT index complete for Phases 02–04 modules  
- [ ] Executive + workspace + ≥3 module dashboards demo-ready  
- [ ] Documentation: `CHANGELOG.md` entry · prototype README in `docs/04-uiux/prototype/`  

---

## Timeline Guidance (documentation only)

Effort estimates assume one product engineer + one designer on prototype — **not committed schedules**.

| Phase | Relative effort | Suggested focus weeks |
|-------|-----------------|----------------------|
| Phase 01 | **L** (large) | Foundation — do not rush |
| Phase 02 | **XL** (5 modules) | Iterative — one module per sprint |
| Phase 03 | **L** | Builder is bottleneck |
| Phase 04 | **M** | Executive + AI polish |

**Critical path:** Phase 01 → Sales list/drawer → module dashboard pattern → replicate across modules.

---

## Document Index (prototype build)

| Phase | Primary blueprints |
|-------|-------------------|
| 01 | WORKSPACE · NAVIGATION · DASHBOARD · COMPONENT |
| 02 | CRM · SALES · INVENTORY · PURCHASE · FINANCE |
| 03 | ECOMMERCE · BUILDER |
| 04 | HR_PAYROLL · EXECUTIVE · AI_DASHBOARD |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 24 — UI prototype development roadmap |

---

**UI Prototype Roadmap** — four phases · platform-first · ERP · commerce · people & AI.
