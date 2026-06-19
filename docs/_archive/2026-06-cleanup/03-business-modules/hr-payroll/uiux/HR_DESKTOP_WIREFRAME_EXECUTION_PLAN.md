# HR & Payroll — Desktop Wireframe Execution Plan

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll — UI Design Execution Roadmap  
> **Document Type:** Wireframe Execution Plan · Design Sprint Guide  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_FIGMA_SCREEN_MAP.md](./HR_FIGMA_SCREEN_MAP.md) · [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../HR_FIGMA_WIREFRAME_BLUEPRINT.md) · [HR_DESIGN_SYSTEM_SPECIFICATION.md](../../../04-uiux/design-system/HR_DESIGN_SYSTEM_SPECIFICATION.md)  
> **Governance:** [UI_UX_DESIGN_STANDARDS.md](../../../04-uiux/standards/UI_UX_DESIGN_STANDARDS.md) · [PROJECT_COMMON_RULES.md](../../../00-foundation/PROJECT_COMMON_RULES.md)

**No frontend code. No visual mockups.**  
Defines the **phased execution roadmap** for HR & Payroll wireframe design — what to build in Figma, in what order, with layout specs per breakpoint. Synthesizes all HR architecture and UI documents into an actionable design plan.

---

## Executive Summary

| Phase | Theme | Screen groups | Est. frames | Gate |
|-------|-------|---------------|------------:|------|
| **0** | Platform prerequisites | Shell, DS, list+drawer template | ~15 | Design system linked |
| **1** | Foundation dashboards + profile | 5 anchor surfaces + tabs | ~45 | MVP navigation walkable |
| **2** | Core operations | Directory + ops + approvals | ~80 | End-to-end HR ops flows |
| **3** | Advanced domains | Talent, assets, hiring, reports | ~120 | Full module coverage |
| **4** | AI experience | Workspace, insights, executive AI | ~35 | AI OS UX reference |

**Figma file:** `AgainERP — HR & Payroll (Wireframes)`  
**Frame naming:** `SCR-{ID} · {Title}` · **Breakpoints:** Desktop `1440px` · Tablet `768px` · Mobile `375px`

---

# Execution Philosophy

### Core belief

> **Wireframe in dependency order — foundation surfaces establish patterns that every later screen inherits.**

| Rule | Detail |
|------|--------|
| **Pattern before volume** | Complete list+drawer template before domain lists |
| **One dashboard template** | `DSH-ZONE-*` A–H zones wireframed once, cloned per domain |
| **Drawer CRUD always** | `?create=1` · `?view={id}` · `?edit={id}` — never `/new` frames |
| **States mandatory** | Default · Loading · Empty · Error per P0 screen |
| **Permission variants** | Sticky notes for hidden actions — not separate frames unless layout changes |
| **Mobile parallel** | P0/P1 screens get `375px` companion in same sprint |
| **Traceability** | SCR-ID on every frame — links to QA `TC-SCR-*` |

### Complexity scale

| Level | Code | Definition | Typical effort |
|-------|------|------------|----------------|
| **Low** | L | Single-zone list or simple form | 0.5 day |
| **Medium** | M | List + drawer · standard dashboard | 1 day |
| **High** | H | Multi-tab drawer · matrix · calendar | 1.5–2 days |
| **Extra High** | XL | Workbench stepper · approval workspace · AI hub | 2–3 days |

### Priority within phase

| Code | Meaning |
|------|---------|
| **P0** | Phase gate — cannot advance without |
| **P1** | Core phase deliverable |
| **P2** | Phase stretch / polish |

### Layout reference keys

| Key | Meaning |
|-----|---------|
| **Shell A–G** | Platform zones per [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../HR_FIGMA_WIREFRAME_BLUEPRINT.md) |
| **DSH A–H** | Dashboard zones per [HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) |
| **PRF A–F** | Profile drawer zones per [EMPLOYEE_PROFILE_UI_ARCHITECTURE.md](./EMPLOYEE_PROFILE_UI_ARCHITECTURE.md) |
| **LST+DRW** | Standard list page + right sheet overlay |
| **WB 9-step** | Payroll processing workbench |

---

# Phase 0 — Prerequisites (Before Phase 1)

Complete in Figma pages **01–03** before domain wireframes.

| Asset | Purpose | Dependencies | Complexity | Desktop | Tablet | Mobile |
|-------|---------|--------------|------------|---------|--------|--------|
| **TPL/Shell Desktop** | Master app chrome | Core Shell library | M | Shell A–G · sidebar 240px | Sidebar collapsible 64px | Hidden — bottom nav ESS only |
| **TPL/List + Drawer** | CRUD pattern reference | Shell, `SCR-GLO-CMP-001` | M | C4 table + Zone E drawer `max-w-5xl` | Full-width drawer | Full-screen sheet |
| **TPL/Dashboard** | Zone grid template | `DSH-ZONE-*` | M | DSH A–H 12-col | C+D stack | Single column B→D→H |
| **DS component stubs** | Wireframe atoms `WF/*` | HR Design System spec | L | Component page | — | — |
| **WF/States** | Loading · empty · error | List template | L | Annotated variants | Same | Card empty states |

**Gate:** Design lead signs off list+drawer + dashboard templates.

---

# Phase 1 — Foundation Screens

**Objective:** Establish the five anchor surfaces every HR user sees daily. These define dashboard DNA, profile DNA, and domain dashboard clones.

**Figma pages:** 04 Dashboards · 05 Employee Management (profile only)  
**Estimated duration:** 3–4 design sprints  
**Prototype flows:** Dashboard drill-down smoke test only

---

## 1.1 HR Dashboard

| Field | Value |
|-------|-------|
| **SCR-ID** | `SCR-HR-DSH-001` |
| **Route** | `/hr` |
| **Purpose** | Role-aware HR command center — workforce posture, pending actions, trends, AI advisory |
| **Priority** | P0 |
| **Dependencies** | Phase 0 shell · `DSH-ZONE-*` template · `WGT-HR-KPI-*` registry |
| **Complexity** | M |

| Breakpoint | Layout |
|------------|--------|
| **Desktop (1440px)** | DSH A header (period + company scope) · B KPI row 4× `WGT-HR-KPI-*` · C analytics 8-col (headcount trend + attendance sparkline) · D approvals 4-col pending list · E activity 6-col · F notifications 6-col · G AI insights 12-col 3 cards · H quick actions chip row |
| **Tablet (768px)** | A full width · B KPI 3-col · C+D stack (approvals below KPIs if pending > 0) · E+F stack · G single insight + "More" · H wrap chips |
| **Mobile (375px)** | A compact · B KPI 2-col · D approvals cards if pending · H horizontal scroll · C/E/G collapsed accordions · Link to ESS for employee actions |

**States:** Default · Loading (per-widget skeleton) · Empty approvals ("All caught up") · Error widget isolation  
**Role variants (annotate):** HR Manager (full) · Dept Manager (team-scoped widgets) · Executive (no PII names)

---

## 1.2 Employee Profile

| Field | Value |
|-------|-------|
| **SCR-ID** | `SCR-HR-EMP-004` (+ tab sub-frames) |
| **Route** | `/hr/employees?view={id}` · `?edit={id}` · `&tab={slug}` |
| **Purpose** | 360° workforce command center — identity, employment, compensation, time, talent, history in one drawer |
| **Priority** | P0 |
| **Dependencies** | Phase 0 list+drawer · Activity timeline pattern · Permission matrix |
| **Complexity** | XL |

| Breakpoint | Layout |
|------------|--------|
| **Desktop (1440px)** | Overlay on list (or placeholder list behind) · PRF Zone A header (avatar, name, status badges, actions) · B summary strip · C tab bar (14 tabs) + active tab body ~70% · D right context rail ~30% (pending, manager, AI card) · F AI strip optional below tabs |
| **Tablet (768px)** | Full-width drawer · Zone D collapsible accordion below tab bar · Tab bar horizontal scroll |
| **Mobile (375px)** | Full-screen sheet · A sticky · B collapsible · Tabs → dropdown or scroll chips · D stacks below tab body · Back to list CTA |

### Phase 1 profile tabs (wireframe in same sprint)

| Tab | SCR-ID | Purpose | Priority | Complexity | Desktop | Tablet | Mobile |
|-----|--------|---------|----------|------------|---------|--------|--------|
| Overview | `SCR-HR-EMP-004-T01` | At-a-glance employment + KPIs | P0 | M | Section blocks Notion-style | 2-col sections | Single column stack |
| Personal | `SCR-HR-EMP-004-T02` | Contact + identity fields | P0 | M | Form sections read-only | Same | Stacked fields |
| Employment | `SCR-HR-EMP-004-T03` | Org, manager, dates, job | P0 | M | Key-value + org chart mini | Stack | Stack |
| Compensation | `SCR-HR-EMP-009` | Salary, benefits (gated) | P1 | H | Sensitive field mask · reveal action | Masked | Masked + permission note |
| Activity Timeline | `SCR-HR-EMP-005` | 360° event feed | P0 | H | Zone E vertical timeline · filter chips | Same · narrower | Full-width feed |
| Documents | `SCR-HR-EMP-008` | Employee file list | P1 | M | Table + upload zone | Card list | Card list |

**Edit mode:** `SCR-HR-EMP-003` — same layout with editable fields + sticky save bar (annotate on profile frame).

---

## 1.3 Attendance Dashboard

| Field | Value |
|-------|-------|
| **SCR-ID** | `SCR-HR-DSH-002` / `SCR-HR-ATT-001` |
| **Route** | `/hr/attendance` |
| **Purpose** | Morning command center — who is here, who is late/absent, device health, payroll lock status |
| **Priority** | P0 |
| **Dependencies** | HR Dashboard template · `WGT-ATT-*` · Attendance status semantics |
| **Complexity** | M |

| Breakpoint | Layout |
|------------|--------|
| **Desktop (1440px)** | DSH A (today date + branch filter) · B KPIs: Present · Absent · Late · On Leave · Device sync status · C heatmap/chart 8-col · D exception queue 4-col · E punch activity feed · G AI anomaly cards (3) · H: Daily list · Corrections · Devices |
| **Tablet (768px)** | B KPI 3-col · C+D stack · Exceptions above charts if count > 0 |
| **Mobile (375px)** | B KPI 2-col · D exception cards only · H quick links · Charts hidden — link to daily |

**Drill-down:** Every KPI → `/hr/attendance/daily?status={code}` (Phase 2 frame stub annotation)

---

## 1.4 Leave Dashboard

| Field | Value |
|-------|-------|
| **SCR-ID** | `SCR-HR-DSH-003` / `SCR-HR-LEV-001` |
| **Route** | `/hr/leave` |
| **Purpose** | Workforce availability posture — who's out today, pending approvals, balance risk, calendar preview |
| **Priority** | P0 |
| **Dependencies** | HR Dashboard template · `WGT-LEV-*` · Holiday calendar data |
| **Complexity** | M |

| Breakpoint | Layout |
|------------|--------|
| **Desktop (1440px)** | DSH A · B KPIs: Out Today · Pending Requests · Low Balance Alerts · Upcoming Peak · C team availability chart 8-col · D approval queue 4-col · E mini who's-out calendar 6-col · F policy reminders 6-col · G AI abuse/forecast cards · H: Apply · Calendar · Balances |
| **Tablet (768px)** | B 3-col · D before C if pending · Calendar full width |
| **Mobile (375px)** | B 2-col · D approval cards · Mini calendar week strip · H chips |

---

## 1.5 Payroll Dashboard

| Field | Value |
|-------|-------|
| **SCR-ID** | `SCR-PAY-DSH-001` |
| **Route** | `/payroll` |
| **Purpose** | Pay period posture — run status, validation exceptions, lock state, cost KPIs, compliance alerts |
| **Priority** | P0 |
| **Dependencies** | HR Dashboard template · `WGT-PAY-*` · SoD banner pattern |
| **Complexity** | M |

| Breakpoint | Layout |
|------------|--------|
| **Desktop (1440px)** | DSH A (period selector + lock banner if applicable) · B KPIs: Run Status · Headcount · Gross · Net · Exceptions · C cost trend + component breakdown 8-col · D pending payroll approvals 4-col · E run activity · G AI auditor summary · H: Process Run · Payslips · Structures |
| **Tablet (768px)** | B wraps 3-col · Lock banner full width top · D stacked |
| **Mobile (375px)** | B 2-col status only · No workbench link — "Continue on desktop" note · Payslip link to ESS |

**SoD annotation:** Lock banner + calculator≠approver warning sticky on all payroll frames.

---

## Phase 1 Deliverables Checklist

- [ ] 5 dashboard frames (desktop + tablet + mobile each = 15 frames minimum)
- [ ] Employee profile shell + 6 tab sub-frames (overview, personal, employment, compensation, timeline, documents)
- [ ] Edit mode variant on profile
- [ ] State variants: loading, empty approvals, widget error
- [ ] SCR-ID + route + permission stickies on every frame
- [ ] Prototype: HR Dashboard → drill KPI → stub list link

**Phase 1 gate:** Product + HR SME walkthrough of 5 anchors without layout questions.

---

# Phase 2 — Core Screens

**Objective:** Operational surfaces — find people, run attendance/leave/payroll, approve requests.

**Figma pages:** 05 Employee · 08 Attendance · 10 Leave · 11 Payroll · 19 Approval Center · 21 ESS (P0 mobile)  
**Estimated duration:** 5–6 design sprints  
**Prototype flows:** FLOW-002 · FLOW-003 · FLOW-004 · FLOW-010

---

## 2.1 Employee Directory

| Screen | SCR-ID | Purpose | Priority | Deps | Complexity | Desktop | Tablet | Mobile |
|--------|--------|---------|----------|------|------------|---------|--------|--------|
| Employee Directory | `SCR-HR-EMP-001` | Find and bulk-operate workforce | P0 | Profile drawer | M | LST+DRW: filter bar · AG Grid · Activity column · bulk bar | H-scroll table · drawer full width | Card list · tap → profile sheet |
| Employee Create | `SCR-HR-EMP-002` | Onboard new employee | P0 | Profile form zones | H | Drawer `?create=1` multi-section form | Full-width drawer | Full-screen wizard-style sections |
| Employee Edit | `SCR-HR-EMP-003` | Update master data | P0 | Create frame | M | Same as create · pre-filled | Same | Same |
| Quick Employee Drawer | `SCR-GLO-CMP-001` | Compact view from other modules | P1 | Profile | M | Narrower drawer `max-w-lg` summary | Full width | Quick view card `SCR-GLO-CMP-012` |
| Archive filter | `SCR-HR-EMP-017` | Exited employees | P1 | Directory | L | Filter variant on 001 | Same | Card list muted |

**Remaining profile tabs (Phase 2):**

| Tab | SCR-ID | Purpose | Priority | Complexity | Desktop | Tablet | Mobile |
|-----|--------|---------|----------|------------|---------|--------|--------|
| Attendance | `SCR-HR-EMP-010` | Employee time summary | P1 | M | Mini calendar + status rows | Stack | Calendar strip |
| Leave | `SCR-HR-EMP-011` | Balance + requests | P1 | M | Balance cards + request table | Stack | Cards |
| Payroll | `SCR-HR-EMP-012` | Payslips + loans | P1 | M | Payslip table · masked amounts | Stack | Card list |
| Notes | `SCR-HR-EMP-007` | HR notes | P2 | L | Thread list | Same | Same |
| Audit | `SCR-HR-EMP-006` | Field-level audit | P1 | M | Audit table | H-scroll | Card |

---

## 2.2 Attendance Operations

| Screen | SCR-ID | Purpose | Priority | Deps | Complexity | Desktop | Tablet | Mobile |
|--------|--------|---------|----------|------|------------|---------|--------|--------|
| Daily Attendance | `SCR-HR-ATT-002` | Today ops — status per employee | P0 | Dashboard | H | AG Grid · date/branch filters · status badges · row actions | H-scroll · fewer columns | Card per employee · status chip |
| Monthly Matrix | `SCR-HR-ATT-003` | Month pattern review | P1 | Daily | H | Employee × day matrix | Week columns only | Link to calendar |
| Attendance Calendar | `SCR-HR-ATT-004` | Visual month scan | P1 | Daily statuses | H | Month grid · color status | 2-week view | Week strip |
| Corrections List | `SCR-HR-ATT-006` | Governance queue | P0 | Workflow | M | LST+DRW · reason required | Same | Card + status |
| Correction Detail | `SCR-HR-ATT-006` | View/approve correction | P0 | Approval pattern | M | Drawer: punch diff · evidence · approval bar | Full width | Full screen |
| Correction Approvals | `SCR-HR-ATT-007` | Pending corrections | P0 | Approval Center | M | Filtered list | Same | ESS manager cards |
| Attendance Import | `SCR-WIZ-002` | Bulk punch upload | P1 | Daily | H | 4-step wizard modal | Same | Desktop-preferred |
| Device List | `SCR-HR-ATT-009` | Biometric devices | P1 | Settings | M | LST+DRW · sync status column | Same | Desktop-preferred |
| Device Detail | `SCR-HR-ATT-010` | Device config + logs | P2 | Device list | M | Drawer tabs: config · logs | Full width | — |
| ESS My Attendance | `SCR-ESS-ATT-001` | Employee self view | P0 | ESS shell | M | Calendar + punch list | 2-col | Bottom nav · FAB correction |

---

## 2.3 Leave Operations

| Screen | SCR-ID | Purpose | Priority | Deps | Complexity | Desktop | Tablet | Mobile |
|--------|--------|---------|----------|------|------------|---------|--------|--------|
| Leave Requests | `SCR-HR-LEV-002` | Transactional list | P0 | Dashboard | M | LST+DRW · status · balance column | Same | Cards |
| Leave Application | `SCR-HR-LEV-002-CRT` | Apply with validation | P0 | Policies API | H | Drawer: dates · half-day · **system checks panel** · balance preview | Full width | ESS simplified form |
| Leave Details | `SCR-HR-LEV-003` | Request view + timeline | P0 | Approval | M | Drawer: details · impact · approval chain | Full width | Full screen |
| Leave Calendar | `SCR-HR-LEV-004` | Who's out planning | P0 | Holidays | H | Multi-layer calendar · dept filter | Month view | Week list |
| Leave Balances | `SCR-HR-LEV-005` | Balance registry | P1 | Accrual rules | M | Table · adjust action (gated) | H-scroll | Cards |
| Approval Queue | `SCR-HR-LEV-006` | Pending leave | P0 | Approval Center | M | Filtered list on 002 | Same | Manager cards |
| Leave Policies | `SCR-HR-LEV-007` | Policy config | P1 | Settings | H | SET: rules builder sections | Stack | Desktop-preferred |
| Holiday Calendar | `SCR-HR-LEV-010` | Company holidays | P1 | Calendar | M | CAL + CRUD drawers | Same | List |
| ESS My Leave | `SCR-ESS-LEV-001` | Employee apply + history | P0 | ESS shell | M | Balance header + list + apply CTA | Same | Primary ESS flow |

---

## 2.4 Payroll Operations

| Screen | SCR-ID | Purpose | Priority | Deps | Complexity | Desktop | Tablet | Mobile |
|--------|--------|---------|----------|------|------------|---------|--------|--------|
| Payroll Periods | `SCR-PAY-PRD-001` | Period control | P1 | Dashboard | M | LST+DRW · open/closed status | Same | Read-only list |
| Payroll Runs List | `SCR-PAY-RUN-001` | Batch registry | P0 | Dashboard | M | LST+DRW · run status badges | Same | Status cards |
| Run Detail | `SCR-PAY-RUN-002` | Run summary | P0 | Runs list | M | Drawer: totals · tabs stub | Full width | Summary card |
| **Processing Workbench** | `SCR-PAY-RUN-003` | **9-step pay calculation** | **P0** | Validation | **XL** | `max-w-6xl` drawer · stepper · split panels per step · employee exception grid | Simplified stepper · no bulk grid | Status-only · desktop required |
| Validation Center | `SCR-PAY-VAL-001` | Step 7 gate | P0 | Workbench | H | Embedded panel: errors/warnings · waive action | Stack | — |
| Payroll Approvals | `SCR-PAY-RUN-004` | Run sign-off queue | P0 | Approval Center | M | LST · SoD warnings | Same | — |
| Lock Modal | `SCR-PAY-RUN-005` | Immutable confirm | P0 | Workbench | L | `SCR-GLO-CMP-008` center modal | Same | — |
| Payslip List | `SCR-PAY-PSL-001` | Published payslips | P0 | Run complete | M | LST+DRW · mask bank | Same | — |
| Payslip Detail | `SCR-PAY-PSL-002` | PDF preview + breakdown | P0 | List | H | Drawer: line items · PDF pane `SCR-GLO-CMP-014` | Stack panes | ESS full screen |
| Salary Structures | `SCR-PAY-STR-001` | Comp configuration | P1 | Payroll setup | H | LST+DRW · component tree | Same | — |
| Bank Export | `SCR-WIZ-012` | Payment file | P1 | Locked run | H | 5-step wizard | Desktop | — |
| ESS Payslips | `SCR-ESS-PAY-001` | Employee pay view | P0 | ESS | M | List · PDF view | Same | Bottom nav tab |

---

## 2.5 Approval Center

| Screen | SCR-ID | Purpose | Priority | Deps | Complexity | Desktop | Tablet | Mobile |
|--------|--------|---------|----------|------|------------|---------|--------|--------|
| Approval Dashboard | `SCR-COR-APR-001` | Cross-module approval posture | P0 | Dashboard D zone | M | DSH variant: volume KPIs · SLA · module breakdown | Stack | KPI + top 5 |
| My Approvals / Pending | `SCR-COR-APR-002` | Primary action inbox | P0 | Workflow engine | H | LST · priority sort · module filter · bulk bar | Card list | `SCR-COR-APR-002-M` swipe cards |
| Approved | `SCR-COR-APR-003` | Completed | P1 | Pending | L | Filter variant | Same | Same |
| Rejected | `SCR-COR-APR-004` | Declined | P1 | Pending | L | Filter variant | Same | Same |
| Escalated | `SCR-COR-APR-005` | SLA breached | P1 | Pending | M | Highlight SLA column | Same | Badge |
| Approval History | `SCR-COR-APR-006` | Audit trail | P1 | Activity | M | LST · export | H-scroll | Cards |
| **Approval Detail Workspace** | `SCR-COR-APR-DTL` | Decision surface | **P0** | Domain drawers | **XL** | `CMP-APR-WORKSPACE-001`: A header · B business context (leave/att/pay embed) · C chain · D impact · E timeline · F AI panel · action bar | Stack zones | Full screen · thumb actions |
| Approval Action Modal | `SCR-GLO-CMP-006` | Approve/reject + comment | P0 | Detail | L | Center modal | Same | Bottom sheet |
| ESS My Approvals | `SCR-ESS-MGR-001` | Manager mobile queue | P1 | ESS | M | Card stack | Same | Primary manager flow |

---

## Phase 2 Deliverables Checklist

- [ ] Employee directory + create/edit drawers (3 breakpoints)
- [ ] Attendance daily + corrections + ESS attendance
- [ ] Leave requests + apply + calendar + ESS leave
- [ ] Payroll runs + **workbench 9 steps** + payslips + ESS payslips
- [ ] Approval inbox + detail workspace
- [ ] Connected prototypes: correction · leave approval · payroll processing
- [ ] Global drawers: `SCR-GLO-CMP-003` · `004` · `005` · `006` · `008`

**Phase 2 gate:** End-to-end walkthrough: hire (stub) → attendance → leave → payroll run → approve → payslip.

---

# Phase 3 — Advanced Screens

**Objective:** Talent management, assets, hiring, reporting — full enterprise module coverage.

**Figma pages:** 06–07 · 14–18 · partial 09 Shifts · 12–13  
**Estimated duration:** 6–8 design sprints

---

## 3.1 Training

| Screen | SCR-ID | Purpose | Priority | Deps | Complexity | Desktop | Tablet | Mobile |
|--------|--------|---------|----------|------|------------|---------|--------|--------|
| Training Dashboard | `SCR-HR-TRN-001` | L&D posture | P1 | DSH template | M | DSH: completion % · upcoming sessions · certs expiring | Stack | KPI + links |
| Programs | `SCR-HR-TRN-002` | Course catalog | P1 | Directory | M | LST+DRW | Same | Cards |
| Program Detail | `SCR-HR-TRN-002-D` | Curriculum + sessions | P1 | Programs | M | Drawer tabs | Full width | — |
| Sessions | `SCR-HR-TRN-003` | Scheduled classes | P1 | Programs | M | LST+DRW · calendar toggle | Same | List |
| Participants | `SCR-HR-TRN-004` | Enrollment | P1 | Sessions | M | LST · bulk enroll | Same | — |
| Training Attendance | `SCR-HR-TRN-005` | Session roll call | P2 | Sessions | M | Checklist grid | Same | — |
| Certificates | `SCR-HR-TRN-006` | Issued certs | P1 | Programs | M | LST+DRW · expiry | Same | ESS view |
| Evaluations | `SCR-HR-TRN-007` | Feedback forms | P2 | Sessions | M | Form results table | Same | — |
| Skill Matrix | `SCR-HR-TRN-009` | Competency heatmap | P2 | Programs | H | Matrix grid · filter by dept | Simplified | — |
| Training Analytics | `SCR-HR-TRN-008` | Completion trends | P2 | Reports | M | ANL: charts + table | Stack | — |
| ESS My Training | `SCR-ESS-TRN-001` | Employee L&D | P1 | ESS | M | Enrolled + certs | Same | Bottom nav |
| Training Setup Wizard | `SCR-WIZ-TRN-001` | New program | P2 | Programs | H | Multi-step | Desktop | — |

---

## 3.2 Performance

| Screen | SCR-ID | Purpose | Priority | Deps | Complexity | Desktop | Tablet | Mobile |
|--------|--------|---------|----------|------|------------|---------|--------|--------|
| Performance Dashboard | `SCR-HR-PRF-001` | Review cycle posture | P1 | DSH template | M | DSH: cycle status · completion % · overdue | Stack | KPI |
| Goals | `SCR-HR-PRF-002` | OKR list | P1 | Employee profile | M | LST+DRW · progress bar | Same | Cards |
| Goal Detail | `SCR-HR-PRF-002-D` | Goal + key results | P1 | Goals | M | Drawer · check-in history | Full width | — |
| KPIs / KRAs | `SCR-HR-PRF-003` · `004` | Metric definitions | P2 | Goals | M | LST+DRW | Same | — |
| Review Cycles | `SCR-HR-PRF-005` | Cycle admin | P1 | Workflow | H | LST+DRW · phase stepper | Same | — |
| Self Reviews | `SCR-HR-PRF-006` | Employee input | P1 | Cycles | H | Form drawer · rating scale | Full width | ESS form |
| Manager Reviews | `SCR-HR-PRF-007` | Manager assessment | P1 | Self reviews | H | Side-by-side self vs manager | Stack | — |
| Final Reviews | `SCR-HR-PRF-008` | Calibration | P2 | Manager | H | Summary + sign-off | Same | — |
| Promotions | `SCR-HR-PRF-009` | Promotion pipeline | P2 | Approval | M | LST+DRW | Same | — |
| Promotion Wizard | `SCR-WIZ-005` | Promotion workflow | P2 | Employee | H | 3-step · comp impact | Desktop | — |
| Performance Analytics | `SCR-HR-PRF-010` | Rating distribution | P2 | Reports | M | ANL charts | Stack | — |
| ESS My Performance | `SCR-ESS-PRF-002` | Self view | P1 | ESS | M | Goals + review status | Same | Cards |

---

## 3.3 Assets

| Screen | SCR-ID | Purpose | Priority | Deps | Complexity | Desktop | Tablet | Mobile |
|--------|--------|---------|----------|------|------------|---------|--------|--------|
| Asset Dashboard | `SCR-HR-AST-001` | Custody posture | P1 | DSH template | M | DSH: assigned · available · overdue returns | Stack | KPI |
| Inventory | `SCR-HR-AST-002` | Asset registry | P1 | Directory | M | LST+DRW · serial · status | Same | Cards |
| Asset Detail | `SCR-HR-AST-003` | Lifecycle view | P1 | Inventory | M | Drawer · tabs: details · history | Full width | — |
| Assignments | `SCR-HR-AST-004` | Active custody | P1 | Inventory | M | LST+DRW | Same | — |
| Returns | `SCR-HR-AST-005` | Return processing | P2 | Assignments | M | LST+DRW | Same | — |
| Damages | `SCR-HR-AST-006` | Damage reports | P2 | Assignments | M | LST+DRW · photos | Same | — |
| Replacements | `SCR-HR-AST-007` | Swap requests | P2 | Damages | M | LST+DRW | Same | — |
| Disposals | `SCR-HR-AST-008` | Write-off | P2 | Inventory | M | LST+DRW · approval | Same | — |
| Asset History | `SCR-HR-AST-009` | Timeline tab | P2 | Detail | M | TML in drawer | Same | — |
| Asset Analytics | `SCR-HR-AST-010` | Custody report | P2 | Reports | M | ANL | Stack | — |
| Assignment Wizard | `SCR-WIZ-008` | Assign to employee | P1 | Employee profile | H | 3-step | Desktop | — |
| ESS My Assets | `SCR-ESS-AST-001` | Employee custody | P1 | ESS | M | Card list | Same | Bottom nav |

---

## 3.4 Recruitment

| Screen | SCR-ID | Purpose | Priority | Deps | Complexity | Desktop | Tablet | Mobile |
|--------|--------|---------|----------|------|------------|---------|--------|--------|
| Recruitment Dashboard | `SCR-HR-DSH-004` | Hiring posture | P1 | DSH template | M | DSH: open reqs · pipeline · time-to-hire | Stack | KPI |
| Hiring Pipeline | `SCR-HR-REC-008` | Kanban stages | P1 | Candidates | H | KBN columns · drag cards | H-scroll lanes | List by stage |
| Job Requisitions | `SCR-HR-REC-001` | Open positions | P1 | Pipeline | M | LST+DRW | Same | Cards |
| Requisition Detail | `SCR-HR-REC-002` | Req view | P1 | Requisitions | M | Drawer · approval status | Full width | — |
| Candidates | `SCR-HR-REC-004` | Applicant pool | P1 | Requisitions | M | LST+DRW · stage badge | Same | Cards |
| Candidate Detail | `SCR-HR-REC-005` | 360° candidate | P1 | Candidates | H | Drawer: resume · eval · timeline | Full width | — |
| Interview Calendar | `SCR-HR-REC-007` | Schedule | P1 | Candidates | H | CAL · interviewer filter | Week view | List |
| Interview Evaluation | `SCR-HR-REC-009` | Scorecard | P2 | Calendar | M | Form in drawer | Same | — |
| Offer Management | `SCR-HR-REC-010` | Offer letter | P1 | Approval | H | Drawer · comp package · approve | Same | — |
| Hiring Wizard | `SCR-WIZ-010` | Offer → employee | P1 | Employee create | H | 2-step | Desktop | — |
| Recruitment Analytics | `SCR-HR-REC-012` | Funnel metrics | P2 | Reports | M | ANL funnel chart | Stack | — |

---

## 3.5 Reports

| Screen | SCR-ID | Purpose | Priority | Deps | Complexity | Desktop | Tablet | Mobile |
|--------|--------|---------|----------|------|------------|---------|--------|--------|
| HR Report Center | `SCR-HR-RPT-000` | Report catalog | P1 | All domains | M | Category cards · search · favorites | 2-col grid | List |
| Payroll Report Center | `SCR-PAY-RPT-000` | Payroll reports | P1 | Payroll ops | M | Same pattern | Same | List |
| Operational Reports (×18) | `SCR-HR-RPT-010`–`027` | Domain exports | P1 | Domain lists | M each | `TPL/Report`: filter sidebar + table + export CTA | Filter sheet + table | Read-only · export email |
| Management Reports (×12) | `SCR-HR-RPT-028`–`039` | Charts + tables | P2 | Analytics | M | Filter + chart row + table | Stack | — |
| Executive Reports (×4) | `SCR-HR-RPT-041`–`044` | Board packs | P2 | Executive DSH | H | `DSH-EXE` style · no PII | Summary | — |
| Compliance Reports (×8) | `SCR-HR-RPT-040` + pay | Statutory packs | P2 | Locked payroll | H | Export prominent · period lock badge | Same | — |
| Report Builder | `SCR-HR-RPT-050` | Ad-hoc builder | P3 | Report center | XL | Drag fields · preview | Desktop | — |
| Scheduled Reports | `SCR-HR-RPT-051` | Cron delivery | P3 | Builder | M | LST+DRW | Same | — |

**Report wireframe rule:** One template (`TPL/Report`) — clone per slug; annotate `SCR-HR-RPT-{nnn}` on frame.

---

## Phase 3 — Additional Domains (summary)

Wireframe after Phase 3 gate review if schedule allows:

| Domain | Key SCR-IDs | Priority | Complexity |
|--------|-------------|----------|------------|
| Organization | `SCR-HR-ORG-001`–`008` | P2 | M–H |
| Shifts | `SCR-HR-SHF-001`–`008` | P2 | H |
| Overtime | `SCR-HR-OVT-001`–`006` | P2 | M |
| Loans & Advances | `SCR-PAY-LON-*` · `SCR-PAY-ADV-*` | P2 | M–H |
| Documents | `SCR-HR-DOC-001`–`007` | P2 | M |
| Executive Dashboard | `SCR-HR-DSH-008` | P2 | M |
| Travel / Expense | `SCR-HR-TRV-001` · `SCR-HR-EXP-001` | P3 | M |

---

## Phase 3 Deliverables Checklist

- [ ] 5 domain groups: Training · Performance · Assets · Recruitment · Reports
- [ ] Report center + minimum 10 operational report clones
- [ ] Kanban recruitment pipeline
- [ ] Performance review cycle (self + manager)
- [ ] Asset assignment wizard
- [ ] Prototype: FLOW-005 performance · FLOW-006 training

**Phase 3 gate:** Full sidebar navigation walkable in Figma prototype.

---

# Phase 4 — AI Screens

**Objective:** Full AI OS experience — workspace, insights, recommendations, executive AI. Reference implementation for all AgainERP modules.

**Figma pages:** 22 AI Assistant · Zone G on dashboards · `SCR-GLO-CMP-013`  
**Estimated duration:** 3–4 design sprints  
**Dependencies:** Phase 1–3 surfaces (context adapters) · [HR_AI_ASSISTANT_UI_ARCHITECTURE.md](./HR_AI_ASSISTANT_UI_ARCHITECTURE.md) · [AI_OS_ARCHITECTURE.md](../../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md)

---

## 4.1 AI Workspace

| Screen | SCR-ID | Purpose | Priority | Deps | Complexity | Desktop | Tablet | Mobile |
|--------|--------|---------|----------|------|------------|---------|--------|--------|
| AI Dashboard / Hub | `SCR-AI-HR-001` | AI landing — insight categories | P0 | DSH-G zone | M | DSH variant: category cards · recent · pinned | 2-col | Single column |
| **AI Full Workspace** | `SCR-AI-HR-010` | Deep work surface | **P0** | Hub | **XL** | `AI-UX-WORKSPACE-*`: A context rail · B chat thread · C artifact panel · D tool trace · E proposed actions | B+C stack | Chat only · artifacts sheet |
| AI Chat Panel (global) | `SCR-AI-HR-008` / `SCR-GLO-CMP-013` | `Ctrl+J` copilot | P0 | Shell | H | 400px right overlay · context chip · input · message stream | Full-height sheet | Bottom sheet 60vh |
| AI History | `SCR-AI-HR-009` | Past sessions | P1 | Workspace | M | LST · filter by domain | Same | List |
| AI Automation Center | `SCR-AI-HR-011` | Scheduled AI rules | P2 | Automation engine | H | LST+DRW · rule builder | Desktop | — |
| ESS AI Hub | `SCR-ESS-AI-001` | Employee personal AI | P2 | ESS shell | M | Simplified chat · self-scope only | Same | Bottom nav |

---

## 4.2 AI Insights

| Screen | SCR-ID | Purpose | Priority | Deps | Complexity | Desktop | Tablet | Mobile |
|--------|--------|---------|----------|------|------------|---------|--------|--------|
| AI Insights Center | `SCR-AI-HR-002` | Cross-domain insight feed | P0 | Batch jobs | H | Filterable card grid · `AI-UX-CARD-INSIGHT` | 2-col | Single column |
| Attendance Insights | `SCR-AI-HR-003` | Anomaly digest | P1 | ATT dashboard | M | Domain-filtered insights | Same | Cards |
| Payroll Insights | `SCR-AI-HR-004` | Auditor findings | P1 | PAY workbench | H | Issue list · severity · waive | Same | Summary only |
| Performance Insights | `SCR-AI-HR-005` | Review bias · completion | P2 | PRF cycles | M | Cards + chart | Stack | — |
| Attrition / Prediction Center | `SCR-AI-HR-006` | Risk scoring | P1 | ML models | H | Risk table · heatmap · explain panel | Stack | Top risks list |
| AI Analytics Center | `SCR-AI-HR-012` | AI usage metrics | P2 | AI OS audit | M | ANL: queries · acceptance rate | Stack | — |

**Insight card anatomy (all screens):** Icon · Title · 2-line summary · Confidence bar · Sources · Actions: Dismiss · Snooze · Open

---

## 4.3 AI Recommendations

| Screen | SCR-ID | Purpose | Priority | Deps | Complexity | Desktop | Tablet | Mobile |
|--------|--------|---------|----------|------|------------|---------|--------|--------|
| Recommendation Center | `SCR-AI-HR-007` | Ranked actions | P0 | Tools API | H | `AI-UX-CARD-RECOMMEND` list · diff preview | Same | Cards |
| AI Recommendation Modal | `SCR-MDL-AI-001` | Apply confirmation | P0 | Recommendations | M | Center modal: diff · impact · Apply/Cancel | Same | Bottom sheet |
| Profile AI Actions | Zone F embed | Per-employee suggest | P1 | Profile | M | Strip in `SCR-HR-EMP-004` | Collapse | — |
| Approval AI Panel | `APPROVAL-UX-AI-*` | Approve advisory | P1 | APR detail | M | Zone F in workspace | Stack | Collapsed |

**Recommendation flow:** Suggest → Review diff → Apply → Draft record / workflow (never silent write)

---

## 4.4 Executive AI

| Screen | SCR-ID | Purpose | Priority | Deps | Complexity | Desktop | Tablet | Mobile |
|--------|--------|---------|----------|------|------------|---------|--------|--------|
| Executive Dashboard | `SCR-HR-DSH-008` | Board-level posture | P1 | DSH template | M | DSH: no PII · aggregated KPIs · cost | Stack | KPI only |
| Executive AI Briefing | `SCR-AI-HR-013` | Weekly narrative | P0 | Insights | H | Full-width brief · sections · PDF export | Scroll | Summary card |
| Executive AI Zone G | Embed on `DSH-008` | Strategic cards | P0 | Briefing | M | 3 cards: workforce · cost · risk | Stack | 1 card |
| Attrition Risk Report | `SCR-AI-RPT-001` | AI-generated report | P1 | Prediction | H | `TPL/Report` + AI disclaimer footer | Same | — |
| AI Timeline Filter | `SCR-TML-AI-001` | AI events in activity | P2 | Activity | M | Filter chip on global timeline | Same | — |

**Executive rules (annotate):** No employee names · Aggregates only · Advisory disclaimer on every AI output · Export audit logged

---

## Phase 4 Deliverables Checklist

- [ ] AI Hub + Full Workspace (desktop + mobile chat)
- [ ] Global panel `SCR-GLO-CMP-013` on shell component
- [ ] Insights Center + 3 domain insight pages
- [ ] Recommendation Center + apply modal
- [ ] Executive briefing + dashboard Zone G
- [ ] Explainability block component on all AI outputs
- [ ] Prototype: FLOW-007 AI recommendation
- [ ] `AI-UX-*` pattern page for platform reuse

**Phase 4 gate:** AI OS reference package approved for CRM/Inventory module adoption.

---

# Cross-Phase Dependency Graph

```text
Phase 0 (Shell + Templates)
    │
    ▼
Phase 1 (Dashboards + Profile) ──────────────────────────┐
    │                                                     │
    ├──► Phase 2 Employee Directory ──► Profile tabs      │
    ├──► Phase 2 Attendance Ops ──► Corrections ──► APR   │
    ├──► Phase 2 Leave Ops ──► Apply ──► APR              │
    ├──► Phase 2 Payroll Ops ──► Workbench ──► APR        │
    │         │                                           │
    │         └──────────────────► Phase 4 Payroll AI     │
    │                                                     │
    └──► Phase 2 Approval Center ◄── (all approval flows) │
              │                                           │
              ▼                                           │
         Phase 3 Domains (each uses LST+DRW pattern)      │
              │                                           │
              ▼                                           │
         Phase 3 Reports (aggregates all domains)         │
              │                                           │
              ▼                                           │
         Phase 4 AI (context from all above) ◄────────────┘
```

---

# Sprint Allocation (Recommended)

| Sprint | Focus | Key deliverables |
|--------|-------|------------------|
| S1 | Phase 0 + shell | Templates, DS stubs |
| S2 | Phase 1 dashboards | HR, Attendance, Leave, Payroll DSH |
| S3 | Phase 1 profile | Profile shell + 6 tabs |
| S4–S5 | Phase 2 employee + attendance | Directory, daily, corrections, ESS att |
| S6–S7 | Phase 2 leave + payroll | Leave ops, workbench, payslips |
| S8 | Phase 2 approvals | Inbox + workspace + prototypes |
| S9–S11 | Phase 3 talent | Training, performance, assets |
| S12–S13 | Phase 3 hiring + reports | Recruitment, report center + clones |
| S14–S15 | Phase 4 AI | Workspace, insights, recommendations, executive |

**Total estimate:** ~15 design sprints (team of 2 designers) · Adjust for parallel hi-fi track.

---

# Quality Gates Per Frame

| Check | Requirement |
|-------|-------------|
| **ID** | `SCR-{ID}` in frame name |
| **Route** | Sticky with query param variants |
| **Permission** | Actions annotated with permission key |
| **States** | P0: 4 states minimum |
| **Breakpoints** | P0/P1: desktop + mobile; dashboards + tablet |
| **Accessibility** | Focus order note · 44px touch targets on mobile |
| **AI disclaimer** | Phase 4: "Advisory only" on every AI frame |
| **SoD** | Payroll + approval: segregation annotations |

---

# Design Handoff Sequence

| Order | Team | Input |
|-------|------|-------|
| 1 | **Design** | This plan + Figma frames |
| 2 | **Product** | Phase gate sign-off per section |
| 3 | **Frontend** | Phase 1 → implement shell + dashboards; Phase 2 → ops routes |
| 4 | **Backend** | API stubs mapped per SCR-ID from [HR_API_ARCHITECTURE.md](../HR_API_ARCHITECTURE.md) |
| 5 | **QA** | `TC-SCR-*` generated per completed phase |
| 6 | **AI team** | Phase 4 only — tool boundaries + context bundles |

---

# Cross-Reference Index

| Document | Role in execution |
|----------|-------------------|
| [HR_FIGMA_SCREEN_MAP.md](./HR_FIGMA_SCREEN_MAP.md) | Full SCR registry + Figma page map |
| [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../HR_FIGMA_WIREFRAME_BLUEPRINT.md) | Zone models · WF components |
| [HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) | DSH A–H · widgets |
| [EMPLOYEE_PROFILE_UI_ARCHITECTURE.md](./EMPLOYEE_PROFILE_UI_ARCHITECTURE.md) | Profile zones · tabs |
| [ATTENDANCE_UI_ARCHITECTURE.md](./ATTENDANCE_UI_ARCHITECTURE.md) | Attendance workspace |
| [LEAVE_UI_ARCHITECTURE.md](./LEAVE_UI_ARCHITECTURE.md) | Leave workspace |
| [PAYROLL_UI_ARCHITECTURE.md](./PAYROLL_UI_ARCHITECTURE.md) | Workbench 9-step |
| [HR_APPROVAL_CENTER_UI_ARCHITECTURE.md](./HR_APPROVAL_CENTER_UI_ARCHITECTURE.md) | Approval workspace |
| [HR_AI_ASSISTANT_UI_ARCHITECTURE.md](./HR_AI_ASSISTANT_UI_ARCHITECTURE.md) | AI patterns `AI-UX-*` |
| [HR_DESIGN_SYSTEM_SPECIFICATION.md](../../../04-uiux/design-system/HR_DESIGN_SYSTEM_SPECIFICATION.md) | Component handoff |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll — Desktop Wireframe Execution Plan |
| **Owner** | Product / Design |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Phases** | 0–4 (Foundation → AI) |

---

**AgainERP HR & Payroll Wireframe Execution Plan** — phased design roadmap with per-screen purpose, priority, dependencies, complexity, and responsive layout specifications.
