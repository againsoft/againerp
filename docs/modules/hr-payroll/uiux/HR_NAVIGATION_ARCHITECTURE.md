# HR & Payroll — Navigation Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll (reference implementation)  
> **Document Type:** Navigation Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Scope:** HR & Payroll module + **reusable AgainERP navigation pattern**  
> **Parent:** [HR_MODULE_MASTER_INDEX.md](../HR_MODULE_MASTER_INDEX.md) · [HR_UI_UX_BLUEPRINT.md](../HR_UI_UX_BLUEPRINT.md) · [HR_SCREEN_INVENTORY.md](../HR_SCREEN_INVENTORY.md) · [HR_DASHBOARD_ARCHITECTURE.md](../HR_DASHBOARD_ARCHITECTURE.md)  
> **Governance:** [navigation.md](../../../ui-ux/navigation.md) · [global-search.md](../../../ui-ux/global-search.md) · [ai-assistant-ui.md](../../../ui-ux/ai-assistant-ui.md) · [layout-architecture.md](../../../ui-ux/layout-architecture.md) · [PROJECT_COMMON_RULES.md](../../../PROJECT_COMMON_RULES.md) · [SAAS_PLATFORM_ARCHITECTURE.md](../../../SAAS_PLATFORM_ARCHITECTURE.md) · [database/multi-company.md](../../../database/multi-company.md) · [AI_OS_ARCHITECTURE.md](../../ai/AI_OS_ARCHITECTURE.md)

**No UI pixels. No component code.**  
Defines **complete navigation architecture** for AgainERP HR & Payroll and establishes the **canonical navigation pattern** all future modules should adopt. Foundation for sidebar, top bar, mobile nav, breadcrumbs, global search, quick actions, favorites, and AI navigation.

---

## Executive Summary

| Principle | Rule |
|-----------|------|
| **URL is truth** | Navigation state derives from route — not parallel client state |
| **Module manifests** | Each module contributes a menu tree via `ModuleManifest.md` |
| **Hide, never tease** | No disabled nav items — permission fail = item absent |
| **Drawer CRUD** | Create/view/edit do not add sidebar depth — query params only |
| **Platform shell** | App switcher, company, search, AI — shared across modules |
| **Depth limits** | Sidebar max 3 visible levels; breadcrumbs max 5 segments |
| **ESS separation** | Employee portal is a distinct navigation context |
| **AI everywhere** | Global launcher + module hub + contextual entry points |

**HR role:** First **full-domain** navigation implementation — Manufacturing, Business Partners, CRM, etc. adopt the same `NAV-*` registry pattern defined here.

---

# Navigation Philosophy

### Core belief

> **Navigation is wayfinding, not decoration — users must always know where they are, how they got there, and what they can do next.**

| Navigation answers | Mechanism |
|--------------------|-----------|
| **Where am I?** | Breadcrumb + active sidebar trail + page header title |
| **What can I open?** | Sidebar tree + global search + favorites |
| **What can I do?** | Quick create · page header actions · command palette |
| **What needs attention?** | Badges on Approvals · Notifications · dashboard widgets |
| **How do I get help?** | AI assistant · contextual suggestions |

### AgainERP navigation formula

```text
AgainERP Navigation = Platform Shell + Module Menu Tree + Page Header + Optional Utility Rail
```

HR adopts **Odoo-style module sidebar** (60%) with **Linear command palette** density (10%) — per [HR_UI_UX_BLUEPRINT.md](../HR_UI_UX_BLUEPRINT.md).

### Reusable pattern for all modules

This document defines **`NAV-{MODULE}-{DOMAIN}-{SEQ}`** menu item IDs. HR is the reference; other modules register equivalent trees:

| Pattern element | HR example | Other module example |
|-----------------|------------|----------------------|
| Module root | `NAV-HR-ROOT` | `NAV-MFG-ROOT` Manufacturing |
| Domain group | `NAV-HR-EMP` Employees | `NAV-MFG-BOM` BOMs |
| Leaf screen | `NAV-HR-EMP-001` Directory | `NAV-MFG-BOM-001` BOM List |
| Cross-link | Core Settings | Core Settings |

---

# Navigation Design Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **Single shell** | One app chrome — modules plug in menu trees |
| 2 | **Progressive depth** | Hub → list → drawer — not hub → list → page → form |
| 3 | **Permission-first** | Menu filtered at build time from user permissions |
| 4 | **Company-scoped** | Active `company_id` filters nav badges and search |
| 5 | **Plan-gated** | SaaS feature flags hide entire domains (e.g. Performance) |
| 6 | **Keyboard-native** | `Ctrl+K` search · `Ctrl+J` AI · `Esc` close overlays |
| 7 | **Mobile parity** | Every admin path reachable via hamburger or bottom nav |
| 8 | **Badge discipline** | Count badges only on actionable queues (pending approvals) |
| 9 | **No orphan routes** | Every route registered in Screen Inventory + manifest |
| 10 | **Deep link safe** | Direct URL works; sidebar syncs active state |
| 11 | **Breadcrumb honesty** | Drawers append record name — not fake routes |
| 12 | **AI-adjacent** | Module AI hub in sidebar; global panel always available |

---

# Information Architecture

### Application layers

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ L0 — Platform (AgainERP)                                                │
│     App switcher · Tenant · Global search · AI · User                   │
├─────────────────────────────────────────────────────────────────────────┤
│ L1 — Module (HR & Payroll)                                              │
│     Sidebar domain groups                                               │
├─────────────────────────────────────────────────────────────────────────┤
│ L2 — Domain (Employees, Payroll, Leave, …)                            │
│     Submenus · domain dashboards                                        │
├─────────────────────────────────────────────────────────────────────────┤
│ L3 — Screen (List, Dashboard, Report center)                            │
│     Primary route — AG Grid / widget grid                               │
├─────────────────────────────────────────────────────────────────────────┤
│ L4 — Sub-screen (Tabs, filters, report slug)                            │
│     URL segment or query param                                          │
├─────────────────────────────────────────────────────────────────────────┤
│ L5 — Actions (Create, View, Edit, Approve, Wizard)                      │
│     Query params · modals · drawers — NOT sidebar children              │
└─────────────────────────────────────────────────────────────────────────┘
```

### HR information domains

| Domain | Primary user | Entry route |
|--------|--------------|-------------|
| Workforce | HR Manager | `/hr` |
| Time | HR, Branch Admin | `/hr/attendance` |
| Compensation | Payroll Manager | `/payroll` |
| Talent | HR, Managers | `/hr/performance` |
| Self-service | Employee | `/ess` |
| Intelligence | HR leadership | `/hr/ai` |

### Separate navigation contexts

| Context | Shell | When |
|---------|-------|------|
| **Admin ERP** | Full sidebar + top bar | `hr.*` / `payroll.*` roles |
| **ESS portal** | Simplified header + bottom nav | `ess.access` only or employee home |
| **Core inbox** | Full shell, cross-module | Approvals, notifications |
| **AI workspace** | Full shell or full-screen panel | `/hr/ai` or `Ctrl+J` |

---

# Navigation Hierarchy Strategy

### Five navigation levels

| Level | Name | Sidebar? | URL example | HR example |
|-------|------|----------|-------------|------------|
| **L1** | Module | Yes (app level) | `/hr/*` | HR & Payroll |
| **L2** | Domain | Yes (group) | `/hr/employees` | Employees |
| **L3** | Screen | Yes (leaf) | `/hr/employees` | Employee Directory |
| **L4** | Sub-screen | No (tabs/filters) | `?view={id}&tab=salary` | Salary tab |
| **L5** | Actions | No (overlay) | `?create=1` · modal | Create employee drawer |

### Depth limits

| Surface | Max depth | Rule |
|---------|-----------|------|
| **Sidebar visible levels** | 3 | Module → Domain → Screen |
| **Breadcrumb segments** | 5 | Truncate middle on mobile with `…` |
| **Submenu children** | 12 per group | Overflow → "More…" hub screen |
| **Tab bar** | 14 | Employee profile max; overflow dropdown |
| **Bottom nav (mobile)** | 5 slots | Platform rule per [navigation.md](../../../ui-ux/navigation.md) |

**Critical rule:** L4 and L5 **never appear in sidebar** — they are tabs, query params, drawers, modals, or wizards on the L3 route.

### Hub vs leaf pattern

| Pattern | When | Nav behavior |
|---------|------|--------------|
| **Domain hub** | Multiple child screens | L2 expands; first visit may land on dashboard |
| **Direct leaf** | Single primary screen | L2 links directly (e.g. Recruitment hub) |
| **Settings cluster** | Config scattered | L2 Settings → L3 per config area |

---

# Global Navigation Rules

Rules apply to **all AgainERP modules** — HR validates first.

| Rule ID | Rule |
|---------|------|
| GN-01 | Menu items registered in `ModuleManifest.md` with `id`, `route`, `permission`, `icon`, `order` |
| GN-02 | Sidebar order: Dashboard → Operational domains → Reports → Settings → AI |
| GN-03 | Active item = longest prefix match on current path |
| GN-04 | Hidden permission = item omitted (not `disabled`) |
| GN-05 | Direct URL without permission → 403 page (not redirect loop) |
| GN-06 | Company switch → reload nav badges; preserve module context |
| GN-07 | Module disabled → entire menu group hidden |
| GN-08 | `Ctrl+K` searches menu items + records + actions |
| GN-09 | Quick create `+` shows only actions user can perform |
| GN-10 | Breadcrumb segment N links to route at depth N |
| GN-11 | Drawer open appends record title to breadcrumb (not URL path) |
| GN-12 | Favorites stored in user preferences — cross-module |
| GN-13 | Recent items: last 10 screens — cross-module |
| GN-14 | AI launcher always visible when `ai.access` |
| GN-15 | ESS link in user menu when user has `ess.access` |

---

# Mobile Navigation Strategy

Per [mobile-first.md](../../../ui-ux/mobile-first.md) and [navigation.md](../../../ui-ux/navigation.md).

### Admin mobile (HR roles on phone)

| Element | Behavior |
|---------|----------|
| **Hamburger** | Full module tree — 280px overlay |
| **Top bar** | Search icon · notifications · avatar |
| **Breadcrumb** | Last 2 segments; tap to expand |
| **Drawer CRUD** | Full-width sheet |
| **Lists** | Card fallback below `md` |

### ESS mobile (employee-primary)

| Slot | Item | Route |
|------|------|-------|
| 1 | Home | `/ess` |
| 2 | Leave | `/ess/leave` |
| 3 | Payslips | `/ess/payslips` |
| 4 | Notifications | `/notifications` |
| 5 | More | Hamburger → attendance, profile, AI |

### Manager mobile

Bottom nav adds **Approvals** (`/inbox/approvals?module=hr`) when `core.approval.act`.

---

# AI Ready Navigation

| Entry point | Location | Permission |
|-------------|----------|------------|
| **Global AI panel** | Top bar ✨ · `Ctrl+J` | `ai.chat` |
| **Command palette** | `Ctrl+K` → "Ask AI" | `ai.chat` |
| **Module AI hub** | Sidebar `/hr/ai` | `ai.access` |
| **Dashboard widgets** | AI Insights row | `ai.access` |
| **Record context** | Employee drawer → AI Actions tab | `ai.access` + entity perm |
| **ESS** | Simplified prompt chips | `ai.chat` |

**Navigation rule:** AI routes under `/hr/ai/*` are L3 screens; chat panel is L5 overlay (not sidebar child).

---

# Global Application Navigation

Platform shell — **shared by all modules**. HR does not customize shell structure.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ [☰] [App▾] │ Breadcrumb trail…          │ [⌘K Search…] │ [Co▾][Br▾][+][🔔][✓][📋][✨][👤] │
└──────────────────────────────────────────────────────────────────────────────┘
```

### App Switcher

| Attribute | Spec |
|-----------|------|
| **Position** | Top-left (desktop) or hamburger header (mobile) |
| **Content** | ERP · Ecommerce · HR · … (installed modules) |
| **Behavior** | Switch changes L1 module context; preserves company |
| **Permission** | Module install + minimum module access key |

### Company Switcher

| Attribute | Spec |
|-----------|------|
| **Position** | Top bar right |
| **Visibility** | User has roles in 2+ companies |
| **Behavior** | Sets `X-Company-Id`; reloads data + nav badges |
| **Reference** | [database/multi-company.md](../../../database/multi-company.md) |

### Branch Switcher

| Attribute | Spec |
|-----------|------|
| **Position** | Adjacent to company switcher |
| **Visibility** | Optional; when `branch_id` scope enabled |
| **HR use** | Attendance, shifts, branch holidays |
| **Default** | User's primary branch or "All branches" (role-dependent) |

### Global Search

See [Global Search Architecture](#global-search-architecture). Shortcut: `Ctrl+K` / `Cmd+K`.

### Notification Center

| Route | Type |
|-------|------|
| `/notifications` | Full page list |
| Bell popover | `SCR-COR-NTF-000` — recent 5 |
| `/settings/notifications` | Preferences |

**HR badges:** Leave approved · Payroll locked · Document expiry · Approval escalated.

### Approval Center

| Route | Screen ID |
|-------|-----------|
| `/inbox/approvals` | `SCR-COR-APR-001` |
| `?status=pending` | Pending queue |
| `?module=hr` | HR-filtered |
| `?module=payroll` | Payroll-filtered |

**Top bar:** ✓ icon with pending count badge.

### Activity Center

| Entry | Behavior |
|-------|----------|
| **Global drawer** | `SCR-GLO-CMP-005` — from list Activity column |
| **Activity logs nav** | Optional sidebar link → `/hr/activity` (future hub) |
| **Audit** | `/hr/reports/audit-export` |

Not a separate top-bar icon in v1 — accessed via record activity + reports.

### AI Assistant

| Entry | Behavior |
|-------|----------|
| **✨ header** | Opens `SCR-GLO-CMP-013` panel |
| **`Ctrl+J`** | Toggle panel |
| **`/hr/ai`** | Module workspace |

### User Menu

| Item | Route / action |
|------|----------------|
| My profile | Core user settings |
| ESS portal | `/ess` (if `ess.access`) |
| Preferences | `/settings` |
| Switch company | Opens company switcher |
| Logout | Auth sign-out |

### Settings

| Entry | Scope |
|-------|-------|
| **Gear in user menu** | Core `/settings` |
| **HR Settings** | Sidebar `/hr/settings` |
| **Payroll Settings** | Sidebar `/payroll/settings` |

---

# HR Sidebar Architecture

**Module group ID:** `NAV-HR-ROOT`  
**Icon:** `Users` (Lucide)  
**Minimum permission:** `hr.access` OR `payroll.access`  
**Route prefix:** `/hr` · `/payroll`

### Level-1 sidebar structure

```text
HR & Payroll                                    NAV-HR-ROOT
├── Dashboard                                   NAV-HR-DSH-000      /hr
├── Employees ▾                                 NAV-HR-EMP-000
├── Organization ▾                              NAV-HR-ORG-000
├── Recruitment                                 NAV-HR-REC-000      /hr/recruitment
├── Attendance ▾                                NAV-HR-ATT-000
├── Shifts ▾                                    NAV-HR-SHF-000
├── Leave ▾                                     NAV-HR-LEV-000
├── Payroll ▾                                   NAV-PAY-ROOT
├── Overtime ▾                                  NAV-HR-OVT-000
├── Loans & Advances ▾                          NAV-PAY-LON-000
├── Performance ▾                               NAV-HR-PRF-000
├── Training ▾                                  NAV-HR-TRN-000
├── Assets ▾                                    NAV-HR-AST-000
├── Documents ▾                                 NAV-HR-DOC-000
├── Travel & Expense ▾                          NAV-HR-TEX-000
├── Reports ▾                                   NAV-HR-RPT-000
├── Approvals                                   NAV-COR-APR-000     /inbox/approvals?module=hr,payroll
├── Activity Logs ▾                             NAV-HR-ACT-000
├── Settings ▾                                  NAV-HR-SET-000
└── AI Assistant                                NAV-AI-HR-000       /hr/ai
```

**ESS** is **not** in this tree — separate app entry via user menu / role-based home redirect.

### Sidebar features (platform + HR)

| Feature | Spec |
|---------|------|
| **Width** | 240px expanded / 64px collapsed |
| **Collapse** | Persisted in user preferences |
| **Menu search** | Filter L2/L3 labels in sidebar |
| **Pinned items** | User pins any L3 leaf to top section |
| **Badges** | Approvals count · optional payroll alert |
| **Active state** | Primary subtle bg + left border |
| **Scroll** | Independent of content area |

---

# Employee Navigation Tree

**Domain ID:** `NAV-HR-EMP-000` · **Permission:** `hr.employee.view`

```text
Employees
├── Employee Directory          NAV-HR-EMP-001    /hr/employees                    SCR-HR-EMP-001
├── Employee Profiles           NAV-HR-EMP-002    /hr/employees                    (same — view drawer)
├── Employment Types            NAV-HR-EMP-003    /hr/organization/employment-types SCR-HR-ORG-006
├── Employment Status           NAV-HR-EMP-004    /hr/employees?status=*           (filter views)
├── Skills                      NAV-HR-EMP-005    /hr/employees/skills             (future list)
├── Certifications              NAV-HR-EMP-006    /hr/employees/certifications     (future list)
├── Documents                   NAV-HR-EMP-007    /hr/documents/employees          SCR-HR-DOC-003
├── Employee Archive            NAV-HR-EMP-008    /hr/employees?status=archived    SCR-HR-EMP-017
└── Employee Analytics          NAV-HR-EMP-009    /hr/reports/headcount            SCR-HR-RPT-002
```

**Note:** "Employee Profiles" shares route with Directory — profile is `?view={id}` drawer (L5), not separate nav item in implementation; listed for IA clarity.

| Nav ID | Screen ID | Min permission |
|--------|-----------|----------------|
| NAV-HR-EMP-001 | SCR-HR-EMP-001 | `hr.employee.view` |
| NAV-HR-EMP-008 | SCR-HR-EMP-017 | `hr.employee.view` |

---

# Organization Navigation Tree

**Domain ID:** `NAV-HR-ORG-000` · **Permission:** `hr.department.view`

```text
Organization
├── Organization Hub            NAV-HR-ORG-001    /hr/organization                 SCR-HR-ORG-001
├── Companies                   NAV-HR-ORG-002    /settings/business               SCR-COR-ORG-001  (Core)
├── Branches                    NAV-HR-ORG-003    /settings/localisation/store-locations SCR-COR-ORG-002 (Core)
├── Locations                   NAV-HR-ORG-004    /hr/organization/locations       SCR-HR-ORG-002
├── Departments                 NAV-HR-ORG-005    /hr/organization/departments     SCR-HR-ORG-003
├── Teams                       NAV-HR-ORG-006    /hr/organization/teams           SCR-HR-ORG-004
├── Designations                NAV-HR-ORG-007    /hr/organization/designations    SCR-HR-ORG-005
├── Reporting Structure         NAV-HR-ORG-008    /hr/organization/reporting       SCR-HR-ORG-007
└── Organization Chart          NAV-HR-ORG-009    /hr/organization/chart           SCR-HR-ORG-008
```

**Cross-module rule:** Companies and Branches link to **Core Settings** — HR does not duplicate company CRUD.

---

# Recruitment Navigation Tree

**Domain ID:** `NAV-HR-REC-000` · **Permission:** `hr.candidate.manage`

```text
Recruitment
├── Dashboard                   NAV-HR-REC-001    /hr/recruitment                  SCR-HR-DSH-004
├── Job Requisitions            NAV-HR-REC-002    /hr/recruitment/requisitions     SCR-HR-REC-001
├── Positions                   NAV-HR-REC-003    /hr/recruitment/requisitions     (requisition filter)
├── Candidates                  NAV-HR-REC-004    /hr/recruitment/candidates       SCR-HR-REC-004
├── Interviews                  NAV-HR-REC-005    /hr/recruitment/interviews       SCR-HR-REC-007
├── Offers                      NAV-HR-REC-006    /hr/recruitment/candidates?tab=offer
├── Hiring Pipeline             NAV-HR-REC-007    /hr/recruitment                  SCR-HR-REC-008 (kanban)
└── Reports                     NAV-HR-REC-008    /hr/reports/recruitment          SCR-HR-REC-012
```

**Hub tabs (L4):** Pipeline · Requisitions · Candidates · Calendar — on `/hr/recruitment`.

---

# Attendance Navigation Tree

**Domain ID:** `NAV-HR-ATT-000` · **Permission:** `hr.attendance.view`

```text
Attendance
├── Dashboard                   NAV-HR-ATT-001    /hr/attendance                   SCR-HR-ATT-001
├── Daily Attendance            NAV-HR-ATT-002    /hr/attendance/daily             SCR-HR-ATT-002
├── Monthly Attendance          NAV-HR-ATT-003    /hr/attendance/monthly           SCR-HR-ATT-003
├── Calendar View               NAV-HR-ATT-004    /hr/attendance/calendar          SCR-HR-ATT-004
├── Corrections                 NAV-HR-ATT-005    /hr/attendance/corrections       SCR-HR-ATT-006
├── Approvals                   NAV-HR-ATT-006    /hr/attendance/corrections?status=pending SCR-HR-ATT-007
├── Device Management           NAV-HR-ATT-007    /hr/settings/devices             SCR-HR-ATT-009
├── Sync Logs                   NAV-HR-ATT-008    /hr/attendance/devices/logs      SCR-HR-ATT-011
├── Analytics                   NAV-HR-ATT-009    /hr/attendance/analytics         SCR-HR-ATT-008
└── Reports                     NAV-HR-ATT-010    /hr/reports/attendance-daily     SCR-HR-RPT-010
```

---

# Shift Navigation Tree

**Domain ID:** `NAV-HR-SHF-000` · **Permission:** `hr.shift.view`

```text
Shifts
├── Shift List                  NAV-HR-SHF-001    /hr/shifts                       SCR-HR-SHF-001
├── Shift Calendar              NAV-HR-SHF-002    /hr/shifts/calendar              SCR-HR-SHF-004
├── Shift Assignments           NAV-HR-SHF-003    /hr/shifts/assignments           SCR-HR-SHF-005
├── Shift Rotations             NAV-HR-SHF-004    /hr/shifts/rotations             SCR-HR-SHF-006
├── Shift Rules                 NAV-HR-SHF-005    /hr/settings/shifts              SCR-HR-SHF-008
├── Exceptions                  NAV-HR-SHF-006    /hr/shifts/conflicts             SCR-HR-SHF-007
└── Reports                     NAV-HR-SHF-007    /hr/reports/shifts               (future)
```

---

# Leave Navigation Tree

**Domain ID:** `NAV-HR-LEV-000` · **Permission:** `hr.leave.view`

```text
Leave
├── Dashboard                   NAV-HR-LEV-001    /hr/leave                        SCR-HR-LEV-001
├── Requests                    NAV-HR-LEV-002    /hr/leave/requests               SCR-HR-LEV-002
├── Calendar                    NAV-HR-LEV-003    /hr/leave/calendar               SCR-HR-LEV-004
├── Balances                    NAV-HR-LEV-004    /hr/leave/balances               SCR-HR-LEV-005
├── Policies                    NAV-HR-LEV-005    /hr/settings/leave               SCR-HR-LEV-007
├── Accrual Rules                 NAV-HR-LEV-006    /hr/settings/leave/accrual       SCR-HR-LEV-008
├── Encashments                 NAV-HR-LEV-007    /hr/leave/encashment             SCR-HR-LEV-009
├── Holidays                    NAV-HR-LEV-008    /hr/settings/holidays            SCR-HR-LEV-010
├── Analytics                   NAV-HR-LEV-009    /hr/reports/leave-taken          SCR-HR-RPT-021
└── Reports                     NAV-HR-LEV-010    /hr/reports/leave-balance        SCR-HR-RPT-020
```

---

# Payroll Navigation Tree

**Domain ID:** `NAV-PAY-ROOT` · **Permission:** `payroll.access`

```text
Payroll
├── Dashboard                   NAV-PAY-DSH-001   /payroll                         SCR-PAY-DSH-001
├── Payroll Periods             NAV-PAY-PRD-001   /payroll/periods                 SCR-PAY-PRD-001
├── Payroll Batches             NAV-PAY-RUN-001   /payroll/runs                    SCR-PAY-RUN-001
├── Processing                  NAV-PAY-RUN-002   /payroll/runs?status=draft       (filter / workbench)
├── Approvals                   NAV-PAY-RUN-003   /payroll/runs?status=pending     SCR-PAY-RUN-004
├── Payslips                    NAV-PAY-PSL-001   /payroll/payslips                SCR-PAY-PSL-001
├── Salary Structures           NAV-PAY-STR-001   /payroll/structures              SCR-PAY-STR-001
├── Components                  NAV-PAY-STR-002   /payroll/structures/components   SCR-PAY-STR-002
├── Allowances                  NAV-PAY-STR-003   /payroll/structures/allowances   SCR-PAY-STR-003
├── Deductions                  NAV-PAY-STR-004   /payroll/structures/deductions   SCR-PAY-STR-004
├── Benefits                    NAV-PAY-STR-005   /payroll/structures/benefits     SCR-PAY-STR-006
├── Tax Rules                   NAV-PAY-STR-006   /payroll/settings/tax            SCR-PAY-STR-005
├── Bonus                       NAV-PAY-BON-001   /payroll/bonuses                 SCR-PAY-BON-001
├── Commission                  NAV-PAY-COM-001   /payroll/commissions             SCR-PAY-COM-001
├── Salary Revisions            NAV-PAY-REV-001   /payroll/salary-revisions        SCR-PAY-REV-001
├── Exports                     NAV-PAY-EXP-001   /payroll/export                  SCR-PAY-EXP-001
├── Analytics                   NAV-PAY-ANL-001   /payroll/analytics               SCR-PAY-ANL-001
└── Reports                     NAV-PAY-RPT-000   /payroll/reports                 SCR-PAY-RPT-000
```

**SoD note:** Processing and Approvals are separate nav items for different roles (`payroll.run.calculate` vs `payroll.run.approve`).

---

# Overtime Navigation Tree

**Domain ID:** `NAV-HR-OVT-000` · **Permission:** `hr.attendance.view`

```text
Overtime
├── Dashboard                   NAV-HR-OVT-001    /hr/overtime                     SCR-HR-OVT-001
├── Requests                    NAV-HR-OVT-002    /hr/overtime/requests            SCR-HR-OVT-002
├── Approvals                   NAV-HR-OVT-003    /hr/overtime/requests?status=pending SCR-HR-OVT-003
├── Policies                    NAV-HR-OVT-004    /hr/settings/overtime            SCR-HR-OVT-004
├── Calculations                NAV-HR-OVT-005    /hr/overtime/calculations        SCR-HR-OVT-005
├── Analytics                   NAV-HR-OVT-006    /hr/reports/overtime             SCR-HR-OVT-006
└── Reports                     NAV-HR-OVT-007    /hr/reports/overtime-summary     SCR-HR-RPT-014
```

---

# Loans & Advances Navigation Tree

**Domain ID:** `NAV-PAY-LON-000` · **Permission:** `payroll.loan.view`

```text
Loans & Advances
├── Dashboard                   NAV-PAY-LON-001   /payroll/loans                   SCR-PAY-LON-001
├── Loan Requests               NAV-PAY-LON-002   /payroll/loans/requests          SCR-PAY-LON-002
├── Loans                       NAV-PAY-LON-003   /payroll/loans                   (active loans filter)
├── Installments                NAV-PAY-LON-004   /payroll/loans?view={id}&tab=installments
├── Recoveries                  NAV-PAY-LON-005   /payroll/advances/recovery       SCR-PAY-ADV-003
├── Advance Requests            NAV-PAY-LON-006   /payroll/advances                SCR-PAY-ADV-001
├── Approvals                   NAV-PAY-LON-007   /payroll/loans/requests?status=pending
├── Analytics                   NAV-PAY-LON-008   /payroll/reports/loan-outstanding SCR-PAY-RPT-010
└── Reports                     NAV-PAY-LON-009   /payroll/reports/advance-recovery SCR-PAY-RPT-011
```

---

# Performance Navigation Tree

**Domain ID:** `NAV-HR-PRF-000` · **Permission:** `hr.performance.manage`

```text
Performance
├── Dashboard                   NAV-HR-PRF-001    /hr/performance                  SCR-HR-PRF-001
├── Goals                       NAV-HR-PRF-002    /hr/performance/goals            SCR-HR-PRF-002
├── KPIs                        NAV-HR-PRF-003    /hr/performance/kpis             SCR-HR-PRF-003
├── KRAs                        NAV-HR-PRF-004    /hr/performance/kras             SCR-HR-PRF-004
├── Review Cycles               NAV-HR-PRF-005    /hr/performance/cycles           SCR-HR-PRF-005
├── Reviews                     NAV-HR-PRF-006    /hr/performance/manager-reviews  SCR-HR-PRF-007
├── Recommendations             NAV-HR-PRF-007    /hr/performance/promotions       SCR-HR-PRF-009
├── Promotions                  NAV-HR-PRF-008    /hr/performance/promotions       (same)
├── Analytics                   NAV-HR-PRF-009    /hr/reports/performance          SCR-HR-PRF-010
└── Reports                     NAV-HR-PRF-010    /hr/reports/performance-summary  SCR-HR-RPT-030
```

---

# Training Navigation Tree

**Domain ID:** `NAV-HR-TRN-000` · **Permission:** `hr.training.program.manage`

```text
Training
├── Dashboard                   NAV-HR-TRN-001    /hr/training                     SCR-HR-TRN-001
├── Programs                    NAV-HR-TRN-002    /hr/training/programs            SCR-HR-TRN-002
├── Sessions                    NAV-HR-TRN-003    /hr/training/sessions            SCR-HR-TRN-003
├── Participants                NAV-HR-TRN-004    /hr/training/participants        SCR-HR-TRN-004
├── Attendance                  NAV-HR-TRN-005    /hr/training/attendance          SCR-HR-TRN-005
├── Certificates                NAV-HR-TRN-006    /hr/training/certificates        SCR-HR-TRN-006
├── Evaluations                 NAV-HR-TRN-007    /hr/training/evaluations         SCR-HR-TRN-007
├── Skill Matrix                NAV-HR-TRN-008    /hr/reports/training-completion  SCR-HR-RPT-031
├── Analytics                   NAV-HR-TRN-009    /hr/reports/training             SCR-HR-TRN-008
└── Reports                     NAV-HR-TRN-010    /hr/reports/training-completion  SCR-HR-RPT-031
```

---

# Asset Navigation Tree

**Domain ID:** `NAV-HR-AST-000` · **Permission:** `hr.asset.create`

```text
Assets
├── Dashboard                   NAV-HR-AST-001    /hr/assets                       SCR-HR-AST-001
├── Inventory                   NAV-HR-AST-002    /hr/assets/inventory             SCR-HR-AST-002
├── Assignments                 NAV-HR-AST-003    /hr/assets/assignments           SCR-HR-AST-004
├── Returns                     NAV-HR-AST-004    /hr/assets/returns               SCR-HR-AST-005
├── Damages                     NAV-HR-AST-005    /hr/assets/damages               SCR-HR-AST-006
├── Replacements                NAV-HR-AST-006    /hr/assets/replacements          SCR-HR-AST-007
├── Disposal                    NAV-HR-AST-007    /hr/assets/disposal              SCR-HR-AST-008
├── Lifecycle                   NAV-HR-AST-008    /hr/assets?view={id}&tab=history   SCR-HR-AST-009
├── Analytics                   NAV-HR-AST-009    /hr/reports/asset-custody        SCR-HR-RPT-032
└── Reports                     NAV-HR-AST-010    /hr/reports/asset-custody        SCR-HR-RPT-032
```

---

# Document Navigation Tree

**Domain ID:** `NAV-HR-DOC-000` · **Permission:** `hr.document.view`

```text
Documents
├── Dashboard                   NAV-HR-DOC-001    /hr/documents                    SCR-HR-DOC-001
├── Employee Documents          NAV-HR-DOC-002    /hr/documents/employees          SCR-HR-DOC-003
├── Contracts                   NAV-HR-DOC-003    /hr/documents/contracts          SCR-HR-DOC-004
├── Compliance Documents        NAV-HR-DOC-004    /hr/documents/contracts          (filter)
├── Expiry Tracker              NAV-HR-DOC-005    /hr/documents/expiry             SCR-HR-DOC-005
├── Renewals                    NAV-HR-DOC-006    /hr/documents/renewals           SCR-HR-DOC-006
├── Archive                     NAV-HR-DOC-007    /hr/documents/archive            SCR-HR-DOC-007
└── Reports                     NAV-HR-DOC-008    /hr/reports/compliance-pack      SCR-HR-RPT-040
```

---

# Reports Navigation Tree

**Domain ID:** `NAV-HR-RPT-000`

```text
Reports
├── Employee Reports            NAV-HR-RPT-001    /hr/reports                      SCR-HR-RPT-000
├── Attendance Reports          NAV-HR-RPT-002    /hr/reports/attendance-daily     SCR-HR-RPT-010
├── Leave Reports               NAV-HR-RPT-003    /hr/reports/leave-balance        SCR-HR-RPT-020
├── Payroll Reports             NAV-HR-RPT-004    /payroll/reports                 SCR-PAY-RPT-000
├── Overtime Reports            NAV-HR-RPT-005    /hr/reports/overtime-summary     SCR-HR-RPT-014
├── Loan Reports                NAV-HR-RPT-006    /payroll/reports/loan-outstanding SCR-PAY-RPT-010
├── Performance Reports         NAV-HR-RPT-007    /hr/reports/performance-summary SCR-HR-RPT-030
├── Training Reports            NAV-HR-RPT-008    /hr/reports/training-completion  SCR-HR-RPT-031
├── Asset Reports               NAV-HR-RPT-009    /hr/reports/asset-custody        SCR-HR-RPT-032
├── Compliance Reports          NAV-HR-RPT-010    /hr/reports/compliance-pack      SCR-HR-RPT-040
└── Executive Reports           NAV-HR-RPT-011    /hr/executive                    SCR-HR-DSH-008
```

**Report center pattern (reusable):** L3 hub `/hr/reports` → L4 slug `/hr/reports/{slug}`.

---

# Approval Center Navigation

**Platform item ID:** `NAV-COR-APR-000` · **Route:** `/inbox/approvals`

```text
Approvals
├── My Approvals                NAV-COR-APR-001   /inbox/approvals                 SCR-COR-APR-001
├── Pending                     NAV-COR-APR-002   /inbox/approvals?status=pending  SCR-COR-APR-002
├── Approved                    NAV-COR-APR-003   /inbox/approvals?status=approved SCR-COR-APR-003
├── Rejected                    NAV-COR-APR-004   /inbox/approvals?status=rejected SCR-COR-APR-004
├── Escalated                   NAV-COR-APR-005   /inbox/approvals?status=escalated SCR-COR-APR-005
└── History                     NAV-COR-APR-006   /inbox/approvals/history         SCR-COR-APR-006
```

**HR filters:** `?module=hr` · `?module=payroll` · `?type=leave` · `?type=payroll_run`

**Sidebar placement:** Top-level under HR group OR badge link from top bar — not buried in Settings.

---

# Activity Center Navigation

**Domain ID:** `NAV-HR-ACT-000`

```text
Activity Logs
├── Global Timeline             NAV-HR-ACT-001    /hr/activity                     (future hub)
├── Employee Activities         NAV-HR-ACT-002    /hr/employees?view={id}&tab=activity SCR-HR-ACT-001
├── Attendance Activities       NAV-HR-ACT-003    /hr/attendance/timeline          SCR-HR-ACT-002
├── Payroll Activities          NAV-HR-ACT-004    /payroll/runs?view={id}&tab=history SCR-PAY-ACT-001
├── Audit Logs                  NAV-HR-ACT-005    /hr/reports/audit-export         SCR-HR-ACT-003
└── Search                      NAV-HR-ACT-006    /hr/activity/search              (future)
```

**Primary access:** Per-record Activity drawer (`SCR-GLO-CMP-005`) — not only via sidebar.

---

# AI Assistant Navigation

**Domain ID:** `NAV-AI-HR-000` · **Permission:** `ai.access`

```text
AI Assistant
├── Dashboard                   NAV-AI-HR-001     /hr/ai                           SCR-AI-HR-001
├── Chat                        NAV-AI-HR-002     Global panel Ctrl+J              SCR-AI-HR-008
├── Insights                    NAV-AI-HR-003     /hr/ai/insights                  SCR-AI-HR-002
├── Recommendations             NAV-AI-HR-004     /hr/ai/promotions                SCR-AI-HR-007
├── Predictions                 NAV-AI-HR-005     /hr/ai/attrition                 SCR-AI-HR-006
├── Workforce Analytics         NAV-AI-HR-006     /hr/ai/attendance · /payroll · /performance
├── AI Actions                  NAV-AI-HR-007     Record drawer AI tab
└── History                     NAV-AI-HR-008     /hr/ai/history                   SCR-AI-HR-009
```

**Agent:** `workforce_agent` per [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md).

---

# Top Navigation Architecture

```text
┌──────────┬────────────────────────────┬─────────────────────────────────────────────┐
│ LEFT     │ CENTER                     │ RIGHT                                        │
├──────────┼────────────────────────────┼─────────────────────────────────────────────┤
│ ☰ App    │ ⌘K Global Search           │ Company▾ Branch▾ + Quick▾ 🔔 ✓ 📋 ✨ 👤      │
│ Breadcrumb (desktop)                  │                                              │
└──────────┴────────────────────────────┴─────────────────────────────────────────────┘
```

| Element | ID | Behavior |
|---------|-----|----------|
| **Global Search** | `TOP-SEARCH` | `Ctrl+K` — see below |
| **Quick Create** | `TOP-QUICK` | `+` dropdown — permission-filtered actions |
| **Notifications** | `TOP-NTF` | Bell → popover or `/notifications` |
| **Approvals** | `TOP-APR` | ✓ → `/inbox/approvals?status=pending` + badge |
| **Recent Items** | `TOP-RECENT` | Inside search palette · user menu subsection |
| **Favorites** | `TOP-FAV` | Sidebar pinned section · search palette |
| **AI Launcher** | `TOP-AI` | ✨ → panel · `Ctrl+J` |
| **User Menu** | `TOP-USER` | Avatar dropdown |

**Height:** 56px fixed · sticky on scroll per [layout-architecture.md](../../../ui-ux/layout-architecture.md).

### HR Quick Create menu (`TOP-QUICK`)

| Action | Route | Permission |
|--------|-------|------------|
| New employee | `/hr/employees?create=1` | `hr.employee.create` |
| Leave request | `/hr/leave/requests?create=1` | `hr.leave.create` |
| Payroll run | `/payroll/runs?create=1` | `payroll.run.create` |
| Job requisition | `/hr/recruitment/requisitions?create=1` | `hr.requisition.manage` |
| Training session | `/hr/training/sessions?create=1` | `hr.training.schedule.manage` |

---

# Global Search Architecture

Extends [global-search.md](../../../ui-ux/global-search.md) and [GLOBAL_SEARCH_ARCHITECTURE.md](../../../core/engines/GLOBAL_SEARCH_ARCHITECTURE.md).

### HR searchable entities

| Tier | Entity | Opens | Permission |
|------|--------|-------|------------|
| 1 | Menu items | Navigate | — |
| 1 | Quick actions | Execute / navigate | Action perm |
| 2 | Employees | `/hr/employees?view={id}` | `hr.employee.view` |
| 2 | Departments | `/hr/organization/departments?view={id}` | `hr.department.view` |
| 2 | Leave requests | `/hr/leave/requests?view={id}` | `hr.leave.view` |
| 2 | Payroll runs | `/payroll/runs?view={id}` | `payroll.run.view` |
| 2 | Payslips | `/payroll/payslips?view={id}` | `payroll.payslip.view` |
| 2 | Candidates | `/hr/recruitment/candidates?view={id}` | `hr.candidate.manage` |
| 2 | Assets | `/hr/assets/inventory?view={id}` | `hr.asset.create` |
| 2 | Documents | `/hr/documents/employees?view={id}` | `hr.document.view` |
| 3 | Reports | `/hr/reports/{slug}` | Report perm |
| 3 | Settings pages | `/hr/settings/*` | Settings perm |
| 4 | Approvals | `/inbox/approvals?view={id}` | `core.approval.view` |
| 4 | AI insights | `/hr/ai/insights` | `ai.access` |

### Search result grouping (HR context)

```text
ACTIONS
  + Create Employee
  + Run Payroll
RECORDS
  👤 Jane Akter — EMP-0042          Employees
  📋 Leave Request LR-2026-0142     Leave
  💰 Payroll Run PR-2026-06         Payroll
REPORTS
  📊 Headcount Report               Reports
AI
  ✨ Attrition risk summary         AI Insights
```

**Scope:** `tenant_id` + active `company_id` · RBAC-filtered · never leak record titles.

**Full results:** `/search?q={query}&module=hr` with facet tabs.

---

# Favorites System

**Storage:** `user_preferences.navigation.favorites[]` — cross-module.

| Pin type | Example | Behavior |
|----------|---------|----------|
| **Pin menu** | Leave Requests | Sidebar top "Favorites" section |
| **Pin report** | Headcount Report | Quick open from search |
| **Pin employee** | Jane Akter | Search + favorites widget |
| **Pin dashboard** | Payroll Dashboard | Sidebar favorite |
| **Pin action** | Process Payroll | Quick create palette |

**UI:** Star icon on sidebar leaf · report row · employee drawer header.

**Phase:** Favorites disabled in Phase 1 prototype per [navigation.md](../../../ui-ux/navigation.md) — architecture ready.

---

# Recent Items System

**Storage:** `user_preferences.navigation.recent[]` — max 10, FIFO.

| Track | Key fields | Open behavior |
|-------|------------|---------------|
| **Employees** | `id`, `name`, `employee_number` | `?view={id}` |
| **Payroll runs** | `id`, `period`, `status` | `?view={id}` |
| **Reports** | `slug`, `title` | `/hr/reports/{slug}` |
| **Documents** | `id`, `title`, `employee` | Document drawer |

**Surfaces:** Global search palette · user menu "Recent" · optional sidebar block below favorites.

---

# Quick Actions System

### Registry pattern (reusable)

```text
QUICK-{MODULE}-{ACTION}-{SEQ}
```

### HR quick actions

| ID | Label | Route / action | Permission |
|----|-------|----------------|------------|
| QUICK-HR-EMP-001 | Create Employee | `/hr/employees?create=1` | `hr.employee.create` |
| QUICK-HR-LEV-001 | Apply Leave | `/hr/leave/requests?create=1` | `hr.leave.create` |
| QUICK-COR-APR-001 | Approve Request | `/inbox/approvals?status=pending` | `core.approval.act` |
| QUICK-PAY-RUN-001 | Process Payroll | `/payroll/runs` | `payroll.run.calculate` |
| QUICK-HR-AST-001 | Assign Asset | `/hr/assets/assignments?create=1` | `hr.asset.assign` |
| QUICK-HR-TRN-001 | Create Training | `/hr/training/sessions?create=1` | `hr.training.schedule.manage` |
| QUICK-HR-RPT-001 | Generate Report | `/hr/reports` | `hr.report.employee.view` |
| QUICK-ESS-LEV-001 | Apply Leave (ESS) | `/ess/leave?create=1` | `ess.leave.apply` |

**Surfaces:** Top `+` menu · dashboard quick action row · command palette · mobile FAB (context).

---

# Breadcrumb Strategy

Per [navigation.md](../../../ui-ux/navigation.md) — max 5 segments.

### Breadcrumb templates

| Page type | Pattern | Example |
|-----------|---------|---------|
| **List** | `AgainERP › HR & Payroll › {Domain} › {Screen}` | `… › Employees › Directory` |
| **Dashboard** | `AgainERP › HR & Payroll › {Dashboard}` | `… › Attendance` |
| **Details (drawer)** | `… › {Screen} › {Record Name}` | `… › Directory › Jane Akter` |
| **Edit (drawer)** | `… › {Record Name} › Edit` | `… › Jane Akter › Edit` |
| **Wizard** | `… › {Wizard Title}` | `… › Hiring Wizard` |
| **Modal launch** | Parent breadcrumb unchanged | Terminate modal — no new segment |
| **Report** | `… › Reports › {Report Name}` | `… › Reports › Headcount` |
| **Settings** | `… › Settings › {Section}` | `… › Settings › Leave Policies` |
| **Core cross-link** | `AgainERP › Settings › Companies` | Org → Companies |

### Rules

| Rule | Detail |
|------|--------|
| BC-01 | Module label = "HR & Payroll" (not "HR" alone) |
| BC-02 | Drawer record name from loaded entity — not from URL |
| BC-03 | Tab deep links do not add breadcrumb segment (tabs = L4) |
| BC-04 | Mobile: show last 2 segments + expand |
| BC-05 | All segments except last are links |
| BC-06 | `?create=1` → append "New {Entity}" |
| BC-07 | ESS context → root segment "Employee Portal" |

---

# Mobile Navigation Strategy

### Admin HR mobile

| Component | Spec |
|-----------|------|
| **Bottom nav** | Optional 5-slot when user lives in one domain (e.g. Attendance clerk) |
| **Default bottom** | Home `/hr` · Approvals · Search · Notifications · More |
| **Quick actions** | FAB on list screens — primary create |
| **Mobile search** | Full-screen overlay |
| **Mobile notifications** | `/notifications` |
| **Mobile approvals** | `/inbox/approvals?status=pending` |
| **Mobile AI** | Full-screen sheet via ✨ |

### ESS mobile (canonical)

| Slot | Label | Route |
|------|-------|-------|
| 1 | Home | `/ess` |
| 2 | Leave | `/ess/leave` |
| 3 | Payslips | `/ess/payslips` |
| 4 | Alerts | `/notifications` |
| 5 | More | Menu drawer |

---

# Permission Based Navigation

### Menu visibility rules

| Layer | Filter |
|-------|--------|
| **Module** | `hr.access` OR `payroll.access` OR `ess.access` |
| **Domain** | Domain minimum permission (see trees above) |
| **Screen** | Screen `view` permission from Screen Inventory |
| **Quick action** | Action-specific `.create` / `.approve` |
| **Tab** | Tab permission (e.g. `hr.sensitive.view` hides Compensation) |

### Role based menus

| Role | Visible domains (summary) |
|------|---------------------------|
| **Employee** | ESS only — redirect from `/hr` |
| **Team Leader** | ESS + Approvals + team views |
| **HR Executive** | HR domains; limited settings |
| **HR Manager** | Full HR; payroll view |
| **Payroll Manager** | Payroll full; HR view |
| **Payroll Executive** | Payroll ops; no approve/lock nav |
| **Recruitment** | Recruitment + candidates only |
| **Auditor** | Reports + audit; read-only |

### Company based menus

| Rule | Behavior |
|------|----------|
| Single company user | Hide company switcher |
| Multi company | Switcher visible; nav badges refresh |
| Group admin | Executive dashboard + org company report |

### Branch based menus

| Rule | Behavior |
|------|----------|
| Branch Admin | Attendance, shifts scoped; branch filter default |
| All-branch roles | Branch switcher shows "All" |

### Feature based menus (SaaS plan)

| Plan flag | Hidden domains |
|-----------|----------------|
| `module.hr` only | Payroll entire subtree |
| Starter | Performance, Training, AI |
| Growth | + Payroll, OT |
| Enterprise | Full tree |

Per [SAAS_PLATFORM_ARCHITECTURE.md](../../../SAAS_PLATFORM_ARCHITECTURE.md).

---

# AI Ready Navigation

### AI entry points map

| Entry | Nav level | Context passed |
|-------|-----------|----------------|
| Top bar ✨ | L5 overlay | Current route + company |
| `/hr/ai` | L3 screen | Module-wide |
| `/hr/ai/insights` | L3 | Insight feed |
| `/hr/ai/attrition` | L3 | Prediction view |
| Employee → AI Actions tab | L4 | `employee_id` |
| Payroll run → Validate with AI | L5 action | `payroll_run_id` |
| Dashboard AI widget | L4 zone | Dashboard scope |
| `Ctrl+K` "Ask AI" | L5 | Command palette |
| ESS AI chips | L5 | Self-scoped only |

### Contextual AI buttons

| Screen | Button label | Opens |
|--------|--------------|-------|
| Attendance analytics | Explain anomalies | AI panel with attendance context |
| Payroll workbench | Validate with AI | AI auditor mode |
| Performance promotions | Suggest candidates | `/hr/ai/promotions` |
| Employee profile | Ask about employee | Panel with employee context |

### AI command bar

Inside global search (`Ctrl+K`):

- Prefix `>` → command mode
- Prefix `?` or natural language → AI chat
- "Go to …" → navigation
- "Create …" → quick action with confirmation

### AI workspace access

| Route | Purpose |
|-------|---------|
| `/hr/ai` | Hub dashboard |
| `/hr/ai/insights` | Curated insight cards |
| `/hr/ai/history` | AI audit log |

---

# ESS Navigation Architecture

**Separate from admin sidebar** — employees land on `/ess` by default when `ess.access` only.

```text
Employee Portal (ESS)
├── Dashboard                     /ess                             SCR-ESS-DSH-001
├── My Profile                    /ess/profile                       SCR-ESS-PRF-001
├── Attendance                    /ess/attendance                    SCR-ESS-ATT-001
├── Leave                         /ess/leave                         SCR-ESS-LEV-001
├── Payslips                      /ess/payslips                      SCR-ESS-PAY-001
├── Documents                     /ess/documents                     SCR-ESS-DOC-001
├── Assets                        /ess/assets                        SCR-ESS-AST-001
├── Training                      /ess/training                      SCR-ESS-TRN-001
├── Performance                   /ess/performance                   SCR-ESS-PRF-002
└── My Requests                   /ess/requests                      SCR-ESS-REQ-001
```

**Link from admin:** User menu → "Employee Portal" when dual-role user.

---

# Settings Navigation Tree

**Domain ID:** `NAV-HR-SET-000`

```text
Settings
├── HR Settings                   NAV-HR-SET-001    /hr/settings                     SCR-HR-SET-001
├── Attendance Settings           NAV-HR-SET-002    /hr/settings/attendance          SCR-HR-SET-002
├── Leave Settings                NAV-HR-SET-003    /hr/settings/leave               SCR-HR-SET-003
├── Payroll Settings              NAV-HR-SET-004    /payroll/settings                SCR-PAY-SET-001
├── Overtime Settings             NAV-HR-SET-005    /hr/settings/overtime            SCR-HR-SET-004
├── Loan Settings                 NAV-HR-SET-006    /payroll/settings/loans          SCR-PAY-SET-002
├── Performance Settings          NAV-HR-SET-007    /hr/settings/performance         SCR-HR-SET-005
├── Training Settings             NAV-HR-SET-008    /hr/settings/training            SCR-HR-SET-006
├── Asset Settings                NAV-HR-SET-009    /hr/settings/assets              SCR-HR-SET-007
├── Automation Rules              NAV-HR-SET-010    /hr/settings/automation          (future)
├── Notification Preferences      NAV-HR-SET-011    /settings/notifications          SCR-COR-SET-001
└── Permissions                   NAV-HR-SET-012    /control-center/permissions      SCR-COR-SET-002
```

---

# Reusable Module Navigation Template

**For Manufacturing, Business Partners, CRM, etc.**

### Manifest schema (required fields)

```yaml
navigation:
  module_id: hr-payroll
  root:
    id: NAV-HR-ROOT
    label: HR & Payroll
    icon: Users
    permission: hr.access | payroll.access
    order: 40
  items:
    - id: NAV-HR-EMP-001
      label: Employee Directory
      route: /hr/employees
      permission: hr.employee.view
      parent: NAV-HR-EMP-000
      screen_id: SCR-HR-EMP-001
      badge: null
```

### Adoption checklist for new modules

- [ ] Define `NAV-{MOD}-ROOT` and domain groups
- [ ] Map every leaf to `SCR-*` in screen inventory
- [ ] Register permissions per leaf
- [ ] Add searchable entities to global search index
- [ ] Define quick create actions
- [ ] Document breadcrumb paths in screen specs
- [ ] Specify mobile bottom nav if applicable
- [ ] Update `MODULE_DEPENDENCY_MAP.md`

---

# Navigation ↔ Screen Registry Crosswalk

| Nav ID prefix | Screen ID prefix |
|---------------|------------------|
| `NAV-HR-EMP-*` | `SCR-HR-EMP-*` |
| `NAV-HR-ORG-*` | `SCR-HR-ORG-*` |
| `NAV-PAY-*` | `SCR-PAY-*` |
| `NAV-COR-*` | `SCR-COR-*` |
| `NAV-AI-HR-*` | `SCR-AI-HR-*` |
| `NAV-HR-RPT-*` | `SCR-HR-RPT-*` / `SCR-PAY-RPT-*` |

**Rule:** Every `NAV-*` leaf with a route must have exactly one primary `SCR-*` screen.

---

# Related Documents

| Document | Topic |
|----------|-------|
| [HR_MODULE_MASTER_INDEX.md](../HR_MODULE_MASTER_INDEX.md) | Module home |
| [HR_SCREEN_INVENTORY.md](../HR_SCREEN_INVENTORY.md) | Screen IDs, routes |
| [HR_UI_UX_BLUEPRINT.md](../HR_UI_UX_BLUEPRINT.md) | UX patterns |
| [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../HR_FIGMA_WIREFRAME_BLUEPRINT.md) | Wireframe shell |
| [navigation.md](../../../ui-ux/navigation.md) | Platform navigation |
| [global-search.md](../../../ui-ux/global-search.md) | Search UX |
| [ai-assistant-ui.md](../../../ui-ux/ai-assistant-ui.md) | AI panel |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll (reference nav pattern) |
| **Owner** | Product / Architecture |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Nav items defined** | 150+ |
| **Reusable pattern** | `NAV-*` + `QUICK-*` registries |

---

**AgainERP HR & Payroll Navigation Architecture** — foundation for sidebar, top bar, mobile nav, search, and AI wayfinding. **Canonical reference for all module navigation.**
