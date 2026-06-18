# HR & Payroll — Implementation Audit

> **Status:** Audit (Documentation Only)  
> **Version:** 1.0  
> **Date:** 17 Jun 2026  
> **Scope:** `apps/web` HR & Payroll prototype UI vs Figma screen map and design system  
> **References:** [HR_FIGMA_SCREEN_MAP.md](./HR_FIGMA_SCREEN_MAP.md) · [HR_DESIGN_SYSTEM_SPECIFICATION.md](../../../design-system/HR_DESIGN_SYSTEM_SPECIFICATION.md)  
> **Method:** Static codebase review — no screens modified

---

## Executive Summary

| Dimension | Score | Summary |
|-----------|-------|---------|
| **Screen coverage** | ~8% | ~22 navigable surfaces built vs 280+ registered `SCR-*` IDs |
| **Navigation consistency** | Partial | Sidebar tree is complete in mock nav; ~90% of links have no route |
| **Component consistency** | Low | Enterprise library exists but is not adopted in HR screens |
| **Spacing consistency** | Medium | Dashboard zone pattern is stable; shells diverge on padding/header |
| **Typography consistency** | Medium | `page-title` used on dashboards; shell titles differ from spec scale |
| **Responsive consistency** | Partial | ESS mobile framework strong; admin HR lists uneven |
| **Figma alignment** | Early prototype | P0 dashboards + employee directory + approvals + timeline + AI workspace |

**Verdict:** The HR module has a **solid vertical slice** (dashboards, employee 360°, approvals, activity, AI workspace, ESS) suitable for demo and pattern validation. It is **not** yet a coherent implementation of the Figma screen map. The enterprise component library (`components/enterprise/`) is ready for adoption but unused outside `/design-system/enterprise`.

---

## 1. Implemented Screen Inventory

### 1.1 Fully implemented (substantial UI, mock data)

| SCR-ID | Route | Component | Zones / pattern | Notes |
|--------|-------|-----------|-----------------|-------|
| SCR-HR-DSH-001 | `/hr` | `HrDashboard` | A–H dashboard | `hideHeader` · KPI + charts + AI strip |
| SCR-HR-DSH-002 | `/hr/attendance` | `AttendanceDashboard` | A–G | Device status, exceptions, AI insights |
| SCR-HR-DSH-003 | `/hr/leave` | `LeaveDashboard` | A–G | Calendar strip, approval queue, AI |
| SCR-PAY-DSH-001 | `/payroll` | `PayrollDashboard` | A–G | Compliance, approval queue, AI auditor |
| SCR-HR-EMP-001 | `/hr/employees` | `EmployeeDirectory` | LST + drawers | `?create` · `?view` · `?edit` ✓ |
| SCR-HR-EMP-004+ | `?view={id}` | `EmployeeViewSheet` | DRW `max-w-5xl` | Profile tabs implemented |
| SCR-COR-APR-001 | `/inbox/approvals` | `ApprovalCenter` | MOD + LST/KBN/TML | List, kanban, timeline, detail drawer |
| SCR-COR-APR-006 | `/inbox/approvals/history` | History view | LST | Linked from approval center |
| — | `/hr/activity` | `GlobalActivityTimeline` | TML feed/audit/grouped/AI | CMP-TML-* pattern |
| SCR-AI-HR-001 | `/hr/ai` | `AiWorkspace` | AI-UX-WORKSPACE zones A–F | Modes via `?mode=` |
| SCR-AI-HR-008 | Global | `AiAssistantDrawer` | `Ctrl+J` panel | Catalog-focused; separate from HR workspace |

### 1.2 ESS portal (mobile-first)

| SCR-ID | Route | Status |
|--------|-------|--------|
| SCR-ESS-DSH-001 | `/ess` | Implemented — `EssDashboard` |
| SCR-ESS-ATT-001 | `/ess/attendance` | Implemented — card list |
| SCR-ESS-LEV-001 | `/ess/leave` | Implemented — balances + requests |
| SCR-ESS-PAY-001 | `/ess/payslips` | Implemented |
| SCR-ESS-REQ-001 | `/ess/requests` | Implemented |
| SCR-ESS-DOC-001 | `/ess/documents` | Implemented |
| SCR-ESS-TRN-001 | `/ess/training` | Implemented |
| SCR-ESS-PRF-002 | `/ess/performance` | Implemented |
| SCR-ESS-AST-001 | `/ess/assets` | Implemented |
| SCR-ESS-AI-001 | `/ess/ai` | Implemented — mobile AI page |
| SCR-COR-NTF-001 | `/ess/notifications` | Implemented (route differs from Figma `/notifications`) |

**ESS shell:** `EssMobileShell` — bottom nav, header, search, notifications sheet, AI sheet, offline banner.

### 1.3 Placeholder only (`HrSectionPlaceholder`)

| Route | SCR-ID (expected) | Figma page |
|-------|-------------------|------------|
| `/hr/recruitment` | SCR-HR-DSH-004 / SCR-HR-REC-008 | 07 |
| `/hr/performance` | SCR-HR-DSH-005 | 14 |
| `/hr/training` | SCR-HR-DSH-006 | 15 |
| `/hr/assets` | SCR-HR-DSH-007 | 16 |
| `/hr/documents` | SCR-HR-DOC-001 | 17 |
| `/hr/organization` | SCR-HR-ORG-001 | 06 |
| `/hr/shifts` | SCR-HR-SHF-001 | 09 |
| `/hr/overtime` | SCR-HR-OVT-001 | 12 |
| `/hr/reports` | SCR-HR-RPT-000 | 18 |
| `/hr/settings` | NAV-HR-SET-* | Settings |

### 1.4 Design system reference (non-production HR)

| Route | Purpose |
|-------|---------|
| `/design-system/enterprise` | Enterprise component showcase — all CMP-CARD-* / CMP-BDG-* examples |

---

## 2. Missing Screens Report

### 2.1 Priority classification

| Priority | Definition | Approx. missing |
|----------|------------|-----------------|
| **P0** | Core daily ops + payroll lock + leave/attendance approval | ~45 screens |
| **P1** | Manager ESS, sub-lists, payroll workbench | ~60 screens |
| **P2** | Analytics, executive, recruitment depth | ~80 screens |
| **P3** | Reports slug pages, wizards, settings depth | ~95+ screens |

### 2.2 P0 — Critical gaps

| Domain | Missing SCR-IDs (representative) | Route pattern |
|--------|----------------------------------|---------------|
| **Attendance** | SCR-HR-ATT-002–011 | `/hr/attendance/daily`, `/calendar`, `/corrections`, `/analytics`, devices |
| **Leave** | SCR-HR-LEV-002–010 | `/hr/leave/requests`, `/calendar`, `/balances`, policies |
| **Payroll** | SCR-PAY-RUN-001–005, SCR-PAY-PSL-001, SCR-WIZ-003 | `/payroll/runs`, workbench, payslips, lock modal |
| **Organization** | SCR-HR-ORG-002–008 | Departments, teams, chart, locations |
| **ESS** | SCR-ESS-PRF-001, SCR-ESS-MGR-001, SCR-ESS-LON-001 | Profile, manager approvals, loans |
| **AI** | SCR-AI-HR-002–007, 009 | `/hr/ai/insights`, category centers, history |
| **Executive** | SCR-HR-DSH-008 | `/hr/executive` |

### 2.3 Navigation vs routes (broken links)

`HR_MODULE_NAV` in `lib/mock-data/hr-navigation.ts` defines **~120 leaf hrefs**. Only **~20** resolve to implemented pages.

| Category | Nav links | Implemented routes | Gap |
|----------|-----------|-------------------|-----|
| HR module (`/hr/*`) | ~75 | 17 | ~58 dead links |
| Payroll (`/payroll/*`) | ~18 | 1 | ~17 dead links |
| Cross-module (settings, reports) | ~25 | 0–2 | ~23 dead links |
| Approvals / Activity / AI | ~15 | 4 | ~11 dead links |

**User impact:** Sidebar and mobile HR menu expose many items that 404 or fall through to app-level not-found.

### 2.4 Drawer / overlay gaps (Figma global inventory)

| ID | Expected | Implementation |
|----|----------|----------------|
| SCR-GLO-CMP-003 | Payroll workbench drawer | Missing |
| SCR-GLO-CMP-004 | Leave request drawer | Missing (admin) |
| SCR-GLO-CMP-006 | Approval action modal | Partial — in approval detail sheet |
| SCR-GLO-CMP-008 | Payroll lock confirm | Missing |
| SCR-GLO-CMP-014 | Payslip PDF preview | Missing |
| SCR-MDL-AI-001 | AI recommendation apply preview | Missing |
| SCR-WIZ-001–012 | Wizards | None implemented |

### 2.5 ESS vs Figma mobile map

| Figma spec | Implementation | Gap |
|------------|----------------|-----|
| Bottom nav: Home · Leave · Payslips · Alerts · More | Home · Attendance · Leave · Payslips · Requests · AI · More | **Nav slots differ** — Attendance + AI elevated; Alerts in header |
| `/notifications` (core) | `/ess/notifications` | Route mismatch |
| `/ess/profile` | — | Missing |
| `/ess/approvals`, `/ess/team` | — | Manager overlay missing |
| `/ess/loans` | — | Missing |

---

## 3. Missing Components Report

### 3.1 Enterprise library (`components/enterprise/`) — built, not integrated

| CMP-ID | Component | HR adoption |
|--------|-----------|-------------|
| CMP-CARD-KPI | `EnterpriseKpiCard` | **Not used** — dashboards use inline KPI markup |
| CMP-CARD-ANALYTICS | `EnterpriseAnalyticsCard` | **Not used** — `DashboardWidget` + Recharts |
| CMP-APR-CARD-001 | `EnterpriseApprovalCard` | **Not used** — `approval-list-table` / kanban |
| CMP-TML-CARD-001 | `EnterpriseTimelineCard` | **Not used** — `components/timeline/timeline-card` |
| CMP-CARD-EMPLOYEE | `EnterpriseEmployeeCard` | **Not used** — `employee-mobile-cards` custom |
| CMP-AI-CARD-INSIGHT-001 | `EnterpriseAiInsightCard` | **Not used** — inline violet/amber blocks |
| CMP-AI-CARD-RECOMMEND-001 | `EnterpriseAiRecommendationCard` | **Not used** — `ai-workspace-panels` custom |
| CMP-CARD-NOTIFICATION | `EnterpriseNotificationCard` | **Not used** — ESS inline notification list |
| CMP-CARD-QUICK-ACTION | `EnterpriseQuickActionCard` | **Not used** — ESS/HR custom grids |
| CMP-BDG-STATUS | `EnterpriseStatusBadge` | **Not used** — `ui/badge` + domain variants |
| CMP-BDG-RISK | `EnterpriseRiskBadge` | **Not used** |
| CMP-BDG-APPROVAL | `EnterpriseApprovalBadge` | **Not used** — `approval-list-table.StatusBadge` |

### 3.2 Design system components — specified, partial or missing

| CMP-ID | Spec location | Implementation | Gap |
|--------|---------------|----------------|-----|
| CMP-BTN-AI | DS § Button System | No dedicated AI button variant | Use ghost + Sparkles ad hoc |
| CMP-AI-EXPLAIN-001 | DS § AI | Not implemented | No expand "why/how/sources" block |
| CMP-BNR-PAY-LOCK-001 | DS § Status | Not implemented | Payroll lock uses inline warning only |
| CMP-FRM-* sections | DS § Form | Employee form exists; no shared FormSection | Per-screen forms |
| CMP-EMPTY-001 | DS § Table | Partial empty states | Inconsistent copy/CTA |
| DSH-* templates | DS § Templates | No `components/dashboard/templates` | Each dashboard bespoke |
| WGT-*-KPI-* | Figma map | Inline KPI cards | No widget registry |

### 3.3 Duplicate / parallel implementations

| Concern | Location A | Location B |
|---------|------------|------------|
| Timeline card | `components/timeline/timeline-card.tsx` | `components/enterprise/cards/timeline-card.tsx` |
| Approval status badge | `approvals/approval-list-table.tsx` | `enterprise/badges/approval-badge.tsx` |
| AI insight card | Dashboard inline + `ai-workspace-panels` | `enterprise/cards/ai-insight-card.tsx` |
| KPI presentation | Per-dashboard copy-paste | `enterprise/cards/kpi-card.tsx` |
| Global AI panel | `ai-assistant-drawer.tsx` (catalog) | `hr/ai/ai-workspace.tsx` (HR) |

---

## 4. Design Consistency Report

### 4.1 Navigation consistency

| Rule (Figma / NAV arch) | Status | Finding |
|-------------------------|--------|---------|
| L1 labels fixed | ✓ Pass | `HR_MODULE_NAV` matches architecture doc |
| One SCR-ID per surface | ✗ Fail | Placeholders share routes without SCR annotation in UI |
| Drawer-not-page CRUD | ✓ Pass | Employees follow `?create` / `?view` / `?edit` |
| Module shell | ✓ Pass | `HrModuleLayout` + `HrSidebar` on `/hr/*` |
| Payroll separate layout | △ Partial | `payroll/layout.tsx` exists; only dashboard page |
| ESS separate shell | ✓ Pass | No admin sidebar on `/ess/*` |
| Dead nav links | ✗ Fail | Majority of sidebar children unimplemented |
| Breadcrumb ↔ screen | △ Partial | Top breadcrumb works; HR sub-routes often missing |
| AI nav children | ✗ Fail | `/hr/ai/insights`, `/promotions`, `/attrition`, `/history` missing |

### 4.2 Component consistency

| Pattern | Expected (DS) | Observed |
|---------|---------------|----------|
| KPI cards | `EnterpriseKpiCard` or `WGT-*` | Custom `div` + `text-2xl` in each dashboard |
| Dashboard sections | `DashboardWidget` organism | Used consistently on 4 dashboards ✓ |
| AI insights | `CMP-AI-CARD-INSIGHT-001` + explainability | Colored `border-violet/amber` divs; no explain block |
| Status badges | Semantic `--status-*` tokens | Mix of `Badge` variants + hardcoded `emerald/amber` |
| Employee avatar | Token-based subtle bg | Hardcoded `bg-emerald-100` |
| Approval inbox | `CMP-APR-*` cards on mobile | Table-first; kanban/timeline alternate views ✓ |
| Lists | AG Grid / card fallback mobile | Employees: table + `EmployeeMobileCards` ✓ |

### 4.3 Spacing consistency

| Token / rule | Spec | Implementation |
|------------|------|----------------|
| Section gap `--space-6` (24px) | Dashboard zones | `gap-4` (16px) predominant on dashboards |
| Card padding `--space-4` mobile | Cards | `DashboardWidget` uses `p-4` ✓ |
| Page padding | 16px mobile | `HrModuleLayout`: `p-3 lg:p-4` ✓ |
| Touch spacing 8px | Between interactives | ESS meets 44px; admin tables tighter |
| `hideHeader` dashboards | Zone A owns title | Used on HR, attendance, leave, payroll, AI, activity ✓ |
| Double header risk | Shell + dashboard Zone A | Avoided where `hideHeader` set ✓ |
| Placeholder min-height | — | `min-h-[240px]` dashed box — inconsistent with dashboard density |

### 4.4 Typography consistency

| Role | DS spec | Implementation |
|------|---------|----------------|
| Page title | `--text-xl` (20px) / Heading | `.page-title` = `text-lg` (18px) |
| Section title | `--text-lg` (18px) Title | `text-sm font-semibold` (14px) on widgets |
| Body | `--text-sm` (14px) | `text-xs` / `text-[11px]` common in dashboards |
| Caption | `--text-xs` (12px) | `text-[10px]` used heavily (below spec minimum for body) |
| KPI display | Display 24–30px | `text-2xl` (24px) ✓ |
| Monospace IDs | Audit / employee number | `font-mono` on IDs ✓ |
| Shell subtitle | Caption | `text-xs` in `HrPageShell` ✓ |

**Finding:** Prototype runs **one step denser** than DS type scale — acceptable for ERP density if documented, but captions below 12px fail mobile body minimum where used as readable text.

### 4.5 Responsive consistency

| Surface | Mobile (<768px) | Tablet | Desktop |
|---------|-----------------|--------|---------|
| HR module nav | Hamburger + sheet ✓ | Sidebar ✓ | Sidebar ✓ |
| HR dashboards | KPI grid 2-col; charts scroll | Mostly OK | 12-col intent ✓ |
| Employee directory | Card fallback ✓ | Table | AG-style table ✓ |
| Employee profile drawer | Full-width sheet ✓ | `max-w-5xl` | `max-w-5xl` ✓ |
| Approval center | Table horizontal scroll | Kanban | All views ✓ |
| Activity timeline | Stacked cards ✓ | ✓ | Grouped views ✓ |
| AI workspace | Mode tabs; stacked rails | Right rail on xl | 3-column ✓ |
| ESS | Full mobile framework ✓ | Centered column | Wider cards |
| Placeholder pages | Dashed box only | Same | Same |
| Payroll workbench | Not built | — | Figma: desktop-only |

**Gaps:** No `375px` annotated frames in code; no `-M` suffix routes. Recruitment/performance/etc. have no mobile card fallback because lists do not exist.

---

## 5. Figma Alignment Report

### 5.1 Figma page coverage

| Figma page # | Name | Implementation status |
|--------------|------|------------------------|
| 01–02 | Foundations / DS | Tokens in `design-system/` + `tokens.css` ✓; Figma file N/A |
| 03 | Navigation | Shell + HR sidebar ✓; command palette global ✓ |
| 04 | Dashboards | 4 of 15 dashboard SCR-IDs built |
| 05 | Employee Management | Directory + profile drawer ✓; wizards missing |
| 06 | Organization | Placeholder only |
| 07 | Recruitment | Placeholder only |
| 08 | Attendance | Dashboard only; 11 sub-screens missing |
| 09 | Shifts | Placeholder only |
| 10 | Leave | Dashboard only; 10 sub-screens missing |
| 11 | Payroll | Dashboard only; ~25 screens missing |
| 12 | Overtime | Placeholder only |
| 13 | Loans & Advances | Not started |
| 14 | Performance | Placeholder only |
| 15 | Training | Placeholder only |
| 16 | Assets | Placeholder only |
| 17 | Documents | Placeholder only |
| 18 | Reports | Placeholder only |
| 19 | Approval Center | **Implemented** ✓ |
| 20 | Activity Timeline | **Implemented** ✓ |
| 21 | ESS Portal | **~80% P0 ESS** ✓ |
| 22 | AI Assistant | Hub/workspace ✓; category centers missing |
| 23 | Mobile Experience | ESS only; no admin mobile frames |
| 24 | Prototypes | No connected flows in app |

### 5.2 Screen classification alignment

| Class | Figma rule | HR prototype |
|-------|------------|--------------|
| MOD (dashboard) | Zones A–H | ✓ on 4 dashboards |
| LST | Table + filters + drawer | ✓ employees, approvals |
| DRW/DTL | `?view={id}` | ✓ employees |
| DRW/CRT/EDT | Query params | ✓ employees |
| AI | Hub + panel | ✓ `/hr/ai` + global drawer |
| TML | Stream + audit | ✓ `/hr/activity` |
| MOB | 375px companion | △ ESS only |
| WIZ | Stepper | ✗ none |
| RPT | Report center + slugs | ✗ placeholder |
| SET | Sectioned settings | ✗ placeholder |

### 5.3 Frame annotation checklist (per Figma template)

| Field | Employees | Dashboards | Approvals | ESS |
|-------|-----------|------------|-----------|-----|
| SCR-ID in code comment | ✓ | ✓ | ✓ | Partial |
| Route documented | ✓ | ✓ | ✓ | ✓ |
| Permission annotation | ✗ | ✗ | ✗ | ✗ |
| States: loading/empty/error | △ skeleton partial | △ partial | ✓ empty | △ partial |
| Mobile companion | △ cards | △ responsive | △ scroll | ✓ |
| API reference | ✗ | ✗ | ✗ | ✗ |

### 5.4 Prototype flows (Figma page 24)

| Flow ID | Name | Build status |
|---------|------|--------------|
| FLOW-001 | Employee onboarding | ✗ |
| FLOW-002 | Attendance correction | △ ESS page only; no approval chain UI |
| FLOW-003 | Leave approval | △ dashboards show queue; no end-to-end |
| FLOW-004 | Payroll processing | ✗ |
| FLOW-005 | Performance review | ✗ |
| FLOW-006 | Training assignment | ✗ |
| FLOW-007 | AI recommendation apply | ✗ |

---

## 6. Implementation Roadmap

### Phase 0 — Consistency foundation (1–2 sprints)

**Goal:** Align existing screens before adding breadth.

| # | Task | Addresses |
|---|------|-----------|
| 0.1 | Adopt `EnterpriseKpiCard` on all 4 dashboards | Component consistency |
| 0.2 | Adopt `EnterpriseAiInsightCard` + add `CMP-AI-EXPLAIN-001` stub | AI DS compliance |
| 0.3 | Replace approval/employee badges with `Enterprise*Badge` | Badge consistency |
| 0.4 | Document `page-title` vs DS `--text-xl` decision or bump token | Typography |
| 0.5 | Hide or disable nav links without routes (feature flags) | Navigation trust |
| 0.6 | Add `loading` / `empty` / `error` states to dashboard widgets | Figma states |

### Phase 1 — P0 operational slice (2–4 sprints)

**Goal:** Complete flows in Figma FLOW-002–004.

| # | Screen group | SCR-IDs | Route |
|---|--------------|---------|-------|
| 1.1 | Leave requests + drawer | LEV-002–003, GLO-CMP-004 | `/hr/leave/requests` |
| 1.2 | Attendance daily + corrections | ATT-002, ATT-006–007 | `/hr/attendance/daily`, `/corrections` |
| 1.3 | Payroll runs + workbench | PAY-RUN-001–003, WIZ-003 | `/payroll/runs` |
| 1.4 | Payslip list + preview | PAY-PSL-001–002, GLO-CMP-014 | `/payroll/payslips` |
| 1.5 | AI category routes | AI-HR-002–005 | `/hr/ai/insights`, etc. |
| 1.6 | ESS manager approvals | ESS-MGR-001 | `/ess/approvals` |
| 1.7 | Organization departments | ORG-003 | `/hr/organization/departments` |

### Phase 2 — P1 breadth (4–6 sprints)

| Domain | Key deliverables |
|--------|------------------|
| Organization | Full ORG-002–008 list + chart |
| Shifts | SHF-001–007 |
| Overtime | OVT requests + approvals |
| Recruitment | Pipeline kanban + candidates |
| Performance | Goals + review cycles |
| Training | Programs + sessions |
| Payroll structures | STR-001–006 |
| Reports center | RPT-000 + top 10 slugs |
| Mobile admin | Employee list cards at `md` breakpoint |

### Phase 3 — P2/P3 & Figma parity (ongoing)

| Item | Notes |
|------|-------|
| Executive dashboard | SCR-HR-DSH-008 |
| Wizards SCR-WIZ-001–012 | Onboarding, import, hiring |
| Global modals inventory | Lock, terminate, AI apply |
| `/hr/ai/workspace` vs merged `/hr/ai` | Resolve route strategy |
| Figma page 23 mobile collection | Annotate `-M` variants in Storybook/showcase |
| Permission-hidden UI | Wire RBAC to nav + actions |
| Hi-fi handoff | Map `WF/*` → `DS/*` in Figma library |

### Suggested ownership

| Workstream | Owner | Dependencies |
|------------|-------|--------------|
| Enterprise component adoption | Frontend platform | None |
| Dashboard + list screens | HR module team | Enterprise cards |
| Payroll workbench | Payroll squad | Approval + timeline |
| ESS manager overlay | ESS squad | Approval center APIs (future) |
| AI category centers | AI UX | Workspace patterns |
| Nav route gating | Platform + HR PM | Screen inventory priority |

---

## 7. Appendix

### A. Route existence matrix (summary)

```
Implemented HR routes (17):
  /hr, /hr/employees, /hr/attendance, /hr/leave, /hr/activity, /hr/ai
  /hr/recruitment, /hr/performance, /hr/training, /hr/shifts, /hr/overtime
  /hr/assets, /hr/documents, /hr/organization, /hr/reports, /hr/settings

Payroll routes (1):
  /payroll

Inbox (2):
  /inbox/approvals, /inbox/approvals/history

ESS routes (12):
  /ess, /ess/attendance, /ess/leave, /ess/payslips, /ess/requests
  /ess/documents, /ess/training, /ess/performance, /ess/assets
  /ess/notifications, /ess/ai
```

### B. Key file references

| Area | Path |
|------|------|
| Figma screen map | `docs/modules/hr-payroll/uiux/HR_FIGMA_SCREEN_MAP.md` |
| Design system spec | `docs/design-system/HR_DESIGN_SYSTEM_SPECIFICATION.md` |
| HR navigation mock | `apps/web/src/lib/mock-data/hr-navigation.ts` |
| HR page shell | `apps/web/src/components/hr/hr-page-shell.tsx` |
| Enterprise library | `apps/web/src/components/enterprise/` |
| Design tokens | `apps/web/src/design-system/` · `design-system/css/tokens.css` |

### C. Audit methodology

1. Enumerated `apps/web/src/app/(admin)/hr/**`, `payroll/**`, `ess/**`, `inbox/approvals/**`
2. Cross-referenced SCR-IDs in Figma map sections 04–23
3. Compared component usage vs `HR_DESIGN_SYSTEM_SPECIFICATION.md` Frontend Mapping table
4. Reviewed typography utilities in `globals.css` and dashboard class patterns
5. No runtime testing; no automatic screen modifications performed

---

*End of audit — documentation only. Update this file when major HR UI milestones ship.*
