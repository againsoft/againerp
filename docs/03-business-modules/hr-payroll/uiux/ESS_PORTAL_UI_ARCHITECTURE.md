# HR & Payroll — ESS Portal UI Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll — Employee Self Service (ESS)  
> **Document Type:** ESS Portal UI / Wireframe Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_UI_UX_BLUEPRINT.md](../HR_UI_UX_BLUEPRINT.md) · [HR_SCREEN_INVENTORY.md](../HR_SCREEN_INVENTORY.md) · [HR_PERMISSION_MATRIX.md](../HR_PERMISSION_MATRIX.md) · [uiux/HR_NAVIGATION_ARCHITECTURE.md](./HR_NAVIGATION_ARCHITECTURE.md) · [uiux/HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) · [uiux/EMPLOYEE_PROFILE_UI_ARCHITECTURE.md](./EMPLOYEE_PROFILE_UI_ARCHITECTURE.md) · [uiux/ATTENDANCE_UI_ARCHITECTURE.md](./ATTENDANCE_UI_ARCHITECTURE.md) · [uiux/LEAVE_UI_ARCHITECTURE.md](./LEAVE_UI_ARCHITECTURE.md) · [uiux/PAYROLL_UI_ARCHITECTURE.md](./PAYROLL_UI_ARCHITECTURE.md) · [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md)  
> **Governance:** [UI_UX_DESIGN_STANDARDS.md](../../../04-uiux/standards/UI_UX_DESIGN_STANDARDS.md) · [dashboard-widgets.md](../../../04-uiux/standards/dashboard-widgets.md) · [ai-assistant-ui.md](../../../04-uiux/standards/ai-assistant-ui.md) · [PROJECT_COMMON_RULES.md](../../../00-foundation/PROJECT_COMMON_RULES.md)

**No visual mockups. No component code.**  
Defines **complete Employee Self Service (ESS) Portal UI architecture** — the employee's daily workspace, not a reduced HR admin module. Foundation for employee portal, mobile app, employee experience platform, and AI employee assistant.

**Design references (experience patterns, not visual copy):** Workday Worker · SAP SuccessFactors Employee Central · Oracle HCM Me · BambooHR employee app · Odoo employee portal

**Route prefix:** `/ess` · **API:** `/api/v1/ess/` · **Shell:** `EssShell` (separate from admin sidebar)

---

## Executive Summary

| Principle | UI rule |
|-----------|---------|
| **Daily workspace** | ESS is where employees start their workday — not a mini `/hr` |
| **Mobile-first** | Phone is primary device; desktop is enhanced layout |
| **Self-scoped only** | All data filtered to `session.employee_id` — no override |
| **Action-oriented** | Quick actions above dense tables |
| **Manager overlay** | Team + approvals extend ESS when role includes manager duties |
| **AI as copilot** | `workforce_ess_agent` — self-scoped tools only |
| **Published facts** | Payslips, policies — never draft payroll or others' PII |

**Screen namespace:** `SCR-ESS-*` · **Widgets:** `WGT-ESS-*` · **Nav:** ESS bottom nav + More menu · **Template:** `DSH-ESS-001`

---

# ESS Philosophy

### Core belief

> **ESS is the employee's daily workspace — one place to know their schedule, balance, pay, tasks, and what the company needs from them today.**

ESS is **not** a stripped-down HR admin module. It is a **distinct product surface** with its own navigation shell, information hierarchy, and mobile interaction model.

| Anti-pattern | ESS approach |
|--------------|--------------|
| Clone `/hr` with fewer menu items | Purpose-built employee journeys |
| Expose org-wide grids | Self + team (manager) scoped cards |
| Desktop-first tables | Card lists · bottom nav · full-width sheets |
| HR jargon | Plain language labels |
| Hidden approvals | Manager sees approvals in ESS, not forced to admin |

### ESS vs HR admin vs Employee Profile

| Surface | Audience | Purpose | Route |
|---------|----------|---------|-------|
| **ESS Portal** | Employee (primary) | Daily self-service | `/ess/*` |
| **ESS Manager overlay** | Team Leader / Manager | Team snapshot + approve | `/ess/team` · `/ess/approvals` |
| **HR Employee Profile** | HR / Manager (admin) | 360° workforce record | `/hr/employees?view={id}` |
| **Admin modules** | HR / Payroll ops | Org-wide operations | `/hr/*` · `/payroll/*` |

### Entry and redirect rules

| User role | Default home |
|-----------|--------------|
| **Employee only** (`ess.access` only) | `/ess` |
| **Dual-role** (HR + ESS) | Last context or user preference; user menu → "Employee Portal" |
| **Manager** | `/ess` with manager zones enabled |
| **Module off** | ESS nav hidden; graceful empty state |

---

# Employee Experience Strategy

### Experience layers

```text
Employee Experience Platform (ESS)
├── Orient     — Dashboard: "What matters today?"
├── Act        — Quick actions: leave, correction, upload
├── Track      — Requests, approvals, notifications
├── Understand — Payslips, policies, training, performance
├── Connect    — Announcements, calendar, AI assistant
└── Manage*    — Team + approvals (*manager role only)
```

### Journey priorities (P0 → P2)

| Priority | Journey | Frequency |
|----------|---------|-----------|
| **P0** | Dashboard · Leave apply · Payslip view · Attendance view | Daily / monthly |
| **P0** | Notifications · Pending tasks | Daily |
| **P1** | Profile edit · Documents · Requests hub | Weekly |
| **P1** | Manager approvals · Team summary | Daily (managers) |
| **P2** | Training · Performance self-review · Assets | Cycle-based |
| **P2** | Loans · Calendar hub · Announcements center | As needed |
| **P3** | Offline PWA · native mobile app | Future |

### Platform engine integration

| Engine | ESS touchpoint |
|--------|----------------|
| **Approval Engine** | Leave · correction · loan · profile change — `/ess/approvals` or Core `/inbox/approvals` |
| **Notification Engine** | Bell · push · email digest · in-app cards |
| **Activity Engine** | Per-request timeline · profile activity strip |
| **Workflow Engine** | Request state machines — UI shows stepper |
| **AI OS** | `workforce_ess_agent` · `ess.tool.*` — self-scoped |

### Data boundary

All `/api/v1/ess/*` calls auto-inject `employee_id = session.employee_id`. UI never sends another employee's ID on ESS routes.

---

# Mobile First Strategy

### Design order

1. **Mobile layout** (320px+) — canonical wireframe  
2. **Tablet** (768px+) — two-column where helpful  
3. **Desktop** (1024px+) — wider cards; optional side panel; never admin sidebar in ESS

### Mobile interaction standards

| Rule | Spec |
|------|------|
| **Tap targets** | Minimum 44×44px |
| **Bottom nav** | Persistent on all ESS routes |
| **Drawers** | Full-width sheet on `< md` |
| **Forms** | Single column; sticky submit bar |
| **Tables** | Card list fallback — no horizontal scroll on phone |
| **AI** | Bottom sheet or full-screen chat on mobile |
| **PDF** | Native viewer / download — not tiny embedded frame |

### Canonical bottom navigation

**Standard employee (5 slots):**

| Slot | Label | Route | Icon role |
|------|-------|-------|-----------|
| 1 | **Home** | `/ess` | Dashboard |
| 2 | **Leave** | `/ess/leave` | Apply + balance |
| 3 | **Payslips** | `/ess/payslips` | Pay documents |
| 4 | **Alerts** | `/notifications` | Notifications (Core) |
| 5 | **More** | Sheet menu | Everything else + AI |

**More menu contents:** Attendance · Profile · Documents · Training · Performance · Requests · Loans · Calendar · AI Assistant · Settings

**Manager variant (when `core.approval.act` on team scope):**

| Slot | Change |
|------|--------|
| 4 | **Approvals** → `/ess/approvals` (replaces Alerts slot; bell moves to header) |
| More | Adds **My Team** → `/ess/team` |

**Alternative (attendance-heavy tenants):** Slot 2 = Attendance · Leave moves to More — configurable per tenant `ess.nav.primary_slot`.

---

# Self Service Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **One employee, one scope** | Record rule `self` on all ESS APIs |
| 2 | **Progressive disclosure** | Summary first · detail on tap |
| 3 | **Status clarity** | Every request shows state + next step |
| 4 | **Optimistic UI** | Leave apply · upload — rollback on error |
| 5 | **No dead ends** | Empty states link to action (e.g. "Apply leave") |
| 6 | **Accessible language** | "Time off" alongside "Leave" where helpful |
| 7 | **Secure by default** | Mask bank/tax on profile until reveal tap |
| 8 | **Audit trail** | Employee sees own submission history |
| 9 | **Dual-role clarity** | Banner when switching ESS ↔ Admin |
| 10 | **AI never impersonates** | Chat cannot act as another employee |

### CRUD pattern (ESS)

Per [PROJECT_COMMON_RULES.md](../../../00-foundation/PROJECT_COMMON_RULES.md):

| Action | Pattern |
|--------|---------|
| **Create request** | `?create=1` on list route — full-width sheet |
| **View detail** | `?view={id}` drawer |
| **Edit** | `?edit={id}` where allowed (`ess.profile.edit`) |
| **No** `/new` or `/[id]/edit` routes | |

---

# AI First Employee Experience

Per [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md).

| Mode | Agent | Surface |
|------|-------|---------|
| **Employee** | `workforce_ess_agent` | ESS AI panel · `Ctrl+J` in ESS context |
| **Manager** | `workforce_ess_agent` + team tools | Team-scoped when on `/ess/team` |

### AI capabilities (employee)

| Query example | Tool | Permission |
|---------------|------|------------|
| "How many leave days do I have?" | `ess.tool.my_leave_balance` | `ess.leave.apply` |
| "Show my attendance for last month" | `ess.tool.my_attendance` | `ess.attendance.view` |
| "Download my latest payslip" | `ess.tool.my_payslips` → navigate | `ess.payslip.view` |
| "What trainings are assigned to me?" | `ess.tool.my_training` | `ess.training.enroll` |
| "Show my performance review status" | `ess.tool.my_performance` | `ess.performance.self_review` |
| "Explain my payslip deductions" | RAG + payslip summary | `ess.payslip.view` |

### AI capabilities (manager, ESS context)

| Query example | Tool |
|---------------|------|
| "Who is absent today?" | `hr.tool.team_attendance_summary` |
| "Who has pending leave requests?" | `hr.tool.team_leave_calendar` |
| "Which employees need training?" | `hr.tool.team_training_status` |
| "Show team performance summary" | `hr.tool.team_performance_snapshot` |

**Forbidden:** Colleague salary · company payroll totals · attrition scores (HR only) · auto-submit leave without confirm

### AI panel anatomy (ESS)

```text
┌─────────────────────────────────────┐
│ ✨ My Assistant              [×]    │
├─────────────────────────────────────┤
│ Prompt chips (context-aware)        │
├─────────────────────────────────────┤
│ Conversation                        │
├─────────────────────────────────────┤
│ [Insights] [Actions] [History]      │
└─────────────────────────────────────┘
```

**Actions tab:** Suggested next steps with **Navigate** · **Apply** (opens form pre-filled) — never silent submit.

---

# ESS Framework

```text
Employee Portal (ESS)                        EssShell — separate from admin
├── My Dashboard                             /ess                             SCR-ESS-DSH-001
├── My Profile                               /ess/profile                       SCR-ESS-PRF-001
├── My Attendance                            /ess/attendance                    SCR-ESS-ATT-001
├── My Leave                                 /ess/leave                         SCR-ESS-LEV-001
├── My Payslips                              /ess/payslips                      SCR-ESS-PAY-001
├── My Loans                                 /ess/loans                         SCR-ESS-LON-001 (future)
├── My Assets                                /ess/assets                        SCR-ESS-AST-001
├── My Documents                             /ess/documents                     SCR-ESS-DOC-001
├── My Training                              /ess/training                      SCR-ESS-TRN-001
├── My Performance                           /ess/performance                   SCR-ESS-PRF-002
├── My Requests                              /ess/requests                      SCR-ESS-REQ-001
├── My Notifications                         /notifications                     Core SCR-COR-NTF-001
├── My Approvals (Manager)                   /ess/approvals                     SCR-ESS-MGR-001 (future)
├── My Team (Manager)                        /ess/team                          SCR-ESS-MGR-002 (future)
├── Announcement Center                      /ess/announcements                 SCR-ESS-ANN-001 (future)
├── Unified Calendar                         /ess/calendar                      SCR-ESS-CAL-001 (future)
└── AI Assistant                             Panel overlay · /ess/ai            SCR-ESS-AI-001 (future hub)
```

**Global components:** `SCR-GLO-CMP-001` Record drawer · `SCR-GLO-CMP-014` PDF viewer · Core approval drawer

---

# My Dashboard

**Primary employee landing page** · **Route:** `/ess` · **Screen:** `SCR-ESS-DSH-001` · **Template:** `DSH-ESS-001`

Mobile: single-column card stack · bottom nav persistent · pull-to-refresh

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ZONE A — HEADER (identity strip)                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE B — QUICK KPI CARDS (horizontal scroll on mobile)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE C — QUICK ACTIONS (icon grid · 2×3 on mobile)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE D — MY TASKS                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE E — NOTIFICATIONS + ANNOUNCEMENTS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE F — AI INSIGHTS (collapsible card)                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ MANAGER ZONE G* — Team snapshot (*if manager role)                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ZONE A — Header

| Component | Content |
|-----------|---------|
| **Employee photo** | Avatar · tap → profile |
| **Name** | Preferred name |
| **Designation** | Job title |
| **Department** | |
| **Company** | When multi-company |
| **Branch** | When branch scope shown |
| **Greeting** | Time-of-day · optional |

**Desktop:** Compact horizontal identity bar · **Mobile:** Hero strip with photo left

---

## ZONE B — Quick KPI Cards

| Widget ID | KPI | Tap action |
|-----------|-----|------------|
| WGT-ESS-KPI-001 | Attendance Rate | `/ess/attendance` |
| WGT-ESS-KPI-002 | Leave Balance | `/ess/leave` |
| WGT-ESS-KPI-003 | Upcoming Holidays | Expand holiday list |
| WGT-ESS-KPI-004 | Training Progress | `/ess/training` |
| WGT-ESS-KPI-005 | Performance Status | `/ess/performance` |
| WGT-ESS-KPI-006 | Assigned Assets | `/ess/assets` |

**Layout:** Horizontal scroll row on mobile · 3×2 grid on tablet+

---

## ZONE C — Quick Actions

| Action | Route | Permission |
|--------|-------|------------|
| **Apply Leave** | `/ess/leave?create=1` | `ess.leave.apply` |
| **Attendance Correction** | `/ess/attendance?correction=1` | `ess.attendance.view` |
| **Download Payslip** | `/ess/payslips` (latest) | `ess.payslip.view` |
| **Request Loan** | `/ess/requests?type=loan&create=1` | `ess.request.create` |
| **Upload Document** | `/ess/documents?upload=1` | `ess.document.upload` |
| **Request Asset** | `/ess/requests?type=asset&create=1` | `ess.request.create` |

**Widget IDs:** `QUICK-ESS-001`–`006` · Icon grid · 44px min touch

---

## ZONE D — My Tasks

| Task type | Source | Link |
|-----------|--------|------|
| **Pending approvals** | Manager only | `/ess/approvals` |
| **Pending requests** | Own submissions | `/ess/requests?status=pending` |
| **Pending reviews** | Performance cycle | `/ess/performance?tab=reviews` |
| **Pending trainings** | Mandatory incomplete | `/ess/training?status=pending` |

**Widget:** `WGT-ESS-LST-001` — unified task list with type icon + status chip

---

## ZONE E — Notifications

| Section | Content |
|---------|---------|
| **Unread notifications** | Top 5 · link to `/notifications` |
| **Announcements** | `WGT-ESS-LST-002` — company/ dept broadcasts |
| **Policy updates** | Tagged announcements |
| **Compliance alerts** | Document expiry · mandatory training |

---

## ZONE F — AI Insights

| Insight | Example |
|---------|---------|
| **Attendance summary** | "You were present 22/23 days this month" |
| **Leave suggestions** | "Consider using 3 unused days before Dec 31" |
| **Training suggestions** | "Complete security training by Friday" |
| **Performance insights** | "Self-review opens in 5 days" |

**Widget:** Collapsible · `WGT-AI-INS-ESS-001` · tap opens AI panel with context

---

## Manager Zone G (conditional)

When user has team approval scope:

| Widget | Content |
|--------|---------|
| Team present today | X/Y present |
| Pending leave approvals | Count + link |
| Team on leave this week | Avatar strip |

**Route:** `/ess/team` for full view

---

# My Profile

**Route:** `/ess/profile` · **Screen:** `SCR-ESS-PRF-001`  
**View:** `ess.profile.view` · **Edit:** `ess.profile.edit` (sensitive fields → approval workflow)

### Section structure (vertical scroll · section cards)

| Section | Content | Editable |
|---------|---------|----------|
| **Overview** | Photo · name · ID · status | Photo via request |
| **Personal information** | DOB · gender · address · contact | `ess.profile.edit` |
| **Employment information** | Dept · manager · join date · grade | Read-only |
| **Emergency contacts** | Name · phone · relation | Edit |
| **Family information** | Dependents (policy-gated) | Edit |
| **Skills** | Self-declared skills | Edit |
| **Certificates** | Uploaded certs | Link to documents |
| **Documents** | Quick link to document center | — |

**Sensitive fields** (bank, tax ID): masked · reveal on tap · changes may trigger `ess.profile.update` approval workflow per [HR_PERMISSION_MATRIX.md](../HR_PERMISSION_MATRIX.md).

**Desktop:** Two-column section grid · **Mobile:** Stacked cards · edit opens full-width sheet

**Admin parity:** HR sees full 360° at `/hr/employees?view={id}` — ESS profile is self-service subset only.

---

# My Attendance

**Route:** `/ess/attendance` · **Screen:** `SCR-ESS-ATT-001`  
**Permission:** `ess.attendance.view`  
**Deep links:** `?correction=1` · `?month=2026-06`

Per [ATTENDANCE_UI_ARCHITECTURE.md](./ATTENDANCE_UI_ARCHITECTURE.md) — ESS slice.

### Sub-surfaces

| Surface | Content |
|---------|---------|
| **Attendance dashboard** | Month rate · streak · late count |
| **Attendance calendar** | Day cells · color status |
| **Monthly attendance** | Summary stats |
| **Work hours** | Total hours · expected |
| **Overtime** | Approved OT hours (read-only) |
| **Attendance corrections** | Request list + `?correction=1` form |
| **Attendance history** | Scrollable day list |

### Visualizations

| Viz | Mobile default | Desktop |
|-----|----------------|---------|
| **Calendar** | Month grid | Month + week toggle |
| **Timeline** | Day detail sheet | Side panel |
| **Monthly matrix** | Optional compact grid | Full matrix |

### Correction request flow

```text
Select date → Reason → Proposed in/out → Attach evidence (optional)
→ Approval route preview → Submit → Track in My Requests
```

**Future:** Check-in FAB with geo annotation (PWA / native app)

---

# My Leave

**Route:** `/ess/leave` · **Screen:** `SCR-ESS-LEV-001`  
**Permission:** `ess.leave.apply`

Per [LEAVE_UI_ARCHITECTURE.md](./LEAVE_UI_ARCHITECTURE.md) — Employee Self Service Experience.

### Sub-surfaces

| Surface | Content |
|---------|---------|
| **Leave dashboard** | Balance cards per type |
| **Leave balance** | Available · used · pending |
| **Apply leave** | `?create=1` full-width form |
| **Leave history** | Status table / cards |
| **Leave calendar** | Personal approved leave overlay |
| **Holiday calendar** | Company/branch holidays |
| **Encashments** | View encashment status (if policy allows) |

### Application experience

| Step | Field / UI |
|------|------------|
| 1 | **Leave type** | Dropdown with balance hint |
| 2 | **Date selection** | Range picker · half-day toggle |
| 3 | **Reason** | Text · optional per policy |
| 4 | **Attachments** | Camera upload on mobile |
| 5 | **Approval route preview** | Read-only stepper |
| 6 | **Submit** | Optimistic · confirmation card |

**AI:** Best dates suggestion chip (advisory) on create form

---

# My Payslips

**Route:** `/ess/payslips` · **Screen:** `SCR-ESS-PAY-001`  
**Permission:** `ess.payslip.view` · **Print:** `ess.payslip.print`

Per [PAYROLL_UI_ARCHITECTURE.md](./PAYROLL_UI_ARCHITECTURE.md) — Employee Payroll Experience.

### Surfaces

| Surface | Content |
|---------|---------|
| **Payslip list** | Period · pay date · net pay · status |
| **Payslip details** | `?view={id}` drawer |
| **Salary breakdown** | Earnings / deductions lines |
| **Tax summary** | YTD tax · collapsible |
| **Benefits** | Employer contributions summary |
| **Download PDF** | `ess.payslip.print` · activity logged |
| **Email copy** | Resend to registered email (if enabled) |

**Rule:** Only **published** payslips — never draft or in-process runs.

**Widget on dashboard:** `WGT-ESS-LST-002` Recent payslips (last 3)

---

# My Loans

**Route:** `/ess/loans` · **Screen:** `SCR-ESS-LON-001` (future) · **Interim:** `/ess/requests?type=loan`

| Surface | Content |
|---------|---------|
| **Loan summary** | Active loans · outstanding balance |
| **Installments** | Schedule table / timeline |
| **Recovery schedule** | Upcoming payroll deductions |
| **Loan history** | Closed loans |
| **Advance salary history** | Advances + recovery status |

**Actions:** Request new loan → `/ess/requests?type=loan&create=1`

**Permission:** `ess.request.create` · view own loans via ESS API self-scope

---

# My Assets

**Route:** `/ess/assets` · **Screen:** `SCR-ESS-AST-001`  
**Permission:** `ess.asset.view`

| Surface | Content |
|---------|---------|
| **Assigned assets** | Card list: laptop · phone · ID card |
| **Asset details** | `?view={id}` — serial · assign date |
| **Warranty information** | Expiry badge |
| **Return requests** | `?action=return` form |
| **Damage reporting** | Photo + description |
| **History** | Past returned assets |

---

# My Documents

**Route:** `/ess/documents` · **Screen:** `SCR-ESS-DOC-001`  
**Permission:** `ess.document.upload`

### Categories (tabs or filter chips)

| Category | Examples |
|----------|----------|
| **Personal documents** | ID · passport |
| **Company documents** | Handbook · policies |
| **Contracts** | Employment contract |
| **Certificates** | Training certs |
| **Compliance documents** | Work permit |

### Document actions

| Action | UI |
|--------|-----|
| **View** | In-app viewer |
| **Download** | Secure download |
| **Upload** | `?upload=1` · camera on mobile |
| **Renew** | When expiry approaching — pre-filled request |

### Expiry alerts

Badge on dashboard · notification `document.expiring` · sorted by urgency in list

---

# My Training

**Route:** `/ess/training` · **Screen:** `SCR-ESS-TRN-001`  
**Permission:** `ess.training.enroll`

| Surface | Content |
|---------|---------|
| **Training dashboard** | Completion % · mandatory count |
| **Assigned training** | List with due dates |
| **Training calendar** | Sessions · `WGT-ESS-CAL-001` strip on dashboard |
| **Certificates** | Earned certs · download |
| **Skill matrix** | Self vs required skills (read-heavy) |
| **Recommendations** | Suggested courses · AI optional |

**Actions:** Enroll · mark complete · upload completion proof

---

# My Performance

**Route:** `/ess/performance` · **Screen:** `SCR-ESS-PRF-002`  
**Permission:** `ess.performance.self_review`

| Surface | Content |
|---------|---------|
| **Goals** | My goals · progress bars |
| **KPIs** | Assigned KPIs · current value |
| **Reviews** | Active cycle · self-review form |
| **Performance history** | Past ratings (policy-gated) |
| **Manager feedback** | Shared feedback only |
| **Recommendations** | Development suggestions |

**Self-review:** Full-width multi-step form on mobile · save draft · submit once

---

# My Requests

**Route:** `/ess/requests` · **Screen:** `SCR-ESS-REQ-001`  
**Permission:** `ess.request.create`

Unified hub for all employee-initiated workflows.

### Request types

| Type | Filter | Create route |
|------|--------|--------------|
| **Leave requests** | `type=leave` | `/ess/leave?create=1` |
| **Attendance corrections** | `type=attendance` | `/ess/attendance?correction=1` |
| **Loan requests** | `type=loan` | `?type=loan&create=1` |
| **Advance requests** | `type=advance` | `?type=advance&create=1` |
| **Asset requests** | `type=asset` | `?type=asset&create=1` |
| **Document requests** | `type=document` | `/ess/documents?upload=1` |

### Status tracking

| Status | UI |
|--------|-----|
| Draft | Resume edit |
| Pending | Stepper + approver name |
| Approved | Green chip · effective date |
| Rejected | Reason · re-submit if allowed |
| Cancelled | Grey · audit only |

**List UI:** Card per request · filter chips · sort by date

---

# My Notifications

**Route:** `/notifications` (Core) · ESS dashboard embeds top 5

### Views

| Tab | Content |
|-----|---------|
| **Unread** | Default |
| **Read** | Archive |
| **Announcements** | `hr.announcement` type |
| **Reminders** | Training · document expiry |
| **Approvals** | Decision notifications |
| **AI notifications** | Insight digests (opt-in) |

**Mobile:** Accessible via bottom nav slot 4 (standard) or header bell (manager variant)

---

# Manager Workspace

**Visible only when** user has `core.approval.act` (or module-specific approve keys) **and** team scope (`department_subtree` or direct reports).

ESS keeps managers in the **employee shell** — they do not need `/hr` for daily approvals.

---

## My Team

**Route:** `/ess/team` · **Screen:** `SCR-ESS-MGR-002` (future)

| Section | Content |
|---------|---------|
| **Team overview** | Headcount · present today |
| **Attendance summary** | Present · absent · late · WFH |
| **Leave summary** | On leave today · upcoming |
| **Performance summary** | Pending reviews count |
| **Training summary** | Team completion % |

**Privacy:** No peer salary · no attrition scores · aggregate by default

### Team actions

| Action | Route |
|--------|-------|
| **Approve leave** | `/ess/approvals?type=leave` |
| **Approve attendance** | `/ess/approvals?type=attendance` |
| **Review performance** | `/ess/performance?scope=team` (future) |
| **Assign training** | Link to HR training assign (permission) |
| **View team analytics** | Embedded charts · dept scope |

---

## My Approvals

**Route:** `/ess/approvals` · **Screen:** `SCR-ESS-MGR-001` (future) · **Interim:** `/inbox/approvals?module=hr`

### Views

`Pending` · `Approved` · `Rejected` · `Escalated` · `History`

### Approval card (mobile-first)

```text
┌─────────────────────────────────────┐
│ [Avatar] Jane Akter · Leave         │
│ 3 days · Jun 20–22 · Annual         │
│ Conflicts: 1 team member on leave   │
├─────────────────────────────────────┤
│ [Reject]  [Delegate]  [Approve]     │
└─────────────────────────────────────┘
```

**Swipe actions (native app future):** Approve right · Reject left

**Integration:** Core Approval Engine — same backend as admin inbox; ESS-optimized UI

---

# AI Assistant

**Critical feature** · **Agent:** `workforce_ess_agent` · **Entry:** `Ctrl+J` · header ✨ · dashboard Zone F

### Employee AI Assistant — example prompts

| Prompt | Result |
|--------|--------|
| "How many leave days do I have?" | Balance cards inline |
| "Show my attendance for last month" | Summary + link to calendar |
| "Download my latest payslip" | Navigate to payslip PDF |
| "What trainings are assigned to me?" | List with due dates |
| "Show my performance review status" | Cycle status card |
| "What is the leave policy for sick days?" | Policy RAG excerpt |

### Manager AI Assistant — example prompts

| Prompt | Result |
|--------|--------|
| "Who is absent today?" | Team attendance list |
| "Who has pending leave requests?" | Filtered approval list |
| "Which employees need training?" | Gap list |
| "Show team performance summary" | Aggregate snapshot |

### AI panels (tabs)

| Tab | Content |
|-----|---------|
| **Insights** | Proactive cards from dashboard Zone F |
| **Recommendations** | Ranked actions · Navigate / Dismiss |
| **Actions** | One-tap open forms (pre-filled) |
| **History** | Past questions · tenant retention policy |

**Mobile AI:** Bottom sheet · voice input (future) · large prompt chips

---

# Announcement Center

**Route:** `/ess/announcements` · **Screen:** `SCR-ESS-ANN-001` (future) · **Interim:** Dashboard `WGT-ESS-LST-002`

| Type | Scope |
|------|-------|
| **Company announcements** | All employees |
| **Department announcements** | Dept subtree |
| **Policy updates** | Tagged · ack required optional |
| **Holiday notices** | Calendar linked |
| **Training notices** | Link to training |

**Acknowledgment:** "I have read" button when required · logged to activity

---

# Calendar Experience

**Route:** `/ess/calendar` · **Screen:** `SCR-ESS-CAL-001` (future) · **Interim:** per-module calendars

### Layered calendar

| Layer | Color / filter |
|-------|----------------|
| **Attendance** | Present · absent · late |
| **Leave** | Approved · pending |
| **Training** | Sessions · deadlines |
| **Holiday** | Public holidays |
| **Personal** | Merged employee view |

**Mobile:** Agenda list default · pinch to month · tap day → detail sheet

---

# Activity Timeline

Per [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md) — self-scoped.

| Category | Events shown in ESS |
|----------|---------------------|
| **Attendance** | Correction submitted · approved |
| **Leave** | Applied · approved · cancelled |
| **Payroll** | Payslip published |
| **Training** | Enrolled · completed |
| **Performance** | Review submitted |
| **Document** | Uploaded · expiry warning |
| **AI** | Insight viewed · recommendation dismissed |

**Surfaces:** Request detail drawer · profile activity strip · optional `/ess/activity` (future)

---

# Search Experience

**Entry:** Header search on ESS · `Ctrl+K` scoped to `ess`

### Searchable entities (self-scope)

| Entity | Result action |
|--------|---------------|
| **Payslips** | Open payslip drawer |
| **Documents** | Open viewer |
| **Training** | Open course detail |
| **Requests** | Open request status |
| **Notifications** | Open notification |
| **Policies** | Policy RAG snippet |

**No results:** Suggest AI assistant · common actions

---

# Notification Experience

| Notification | Trigger | Channel |
|--------------|---------|---------|
| **Leave approval** | Approved / rejected | Push · in-app · email |
| **Attendance correction** | Decision | Push · in-app |
| **Payslip available** | `payroll.payslip.published` | Push · email |
| **Training assigned** | New mandatory course | Push · in-app |
| **Document expiry** | 30/7/1 day before | Push · email |
| **Policy updates** | New policy published | In-app · ack |

**Preferences:** `/settings/notifications` — per-channel toggles

---

# Responsive Strategy

*Critical section.*

### Desktop experience (≥1024px)

| Element | Behavior |
|---------|----------|
| **Layout** | Centered max-width column (~960px) — not full admin width |
| **Navigation** | Top sub-nav OR left mini-rail + content (no full ERP sidebar) |
| **Dashboard** | 2-column: KPIs + tasks left · notifications + AI right |
| **Forms** | Centered modal or right sheet (`max-w-lg`) |
| **Calendar** | Full month + side detail panel |
| **AI** | Right utility panel (`Ctrl+J`) |

### Tablet experience (768px–1023px)

| Element | Behavior |
|---------|----------|
| **Layout** | Single column with optional 2-col KPI grid |
| **Bottom nav** | Optional — may use top tabs instead |
| **Drawers** | 70% width sheet |
| **Tables** | Hybrid card/table |

### Mobile experience (<768px)

| Element | Behavior |
|---------|----------|
| **Layout** | Single column · full bleed cards |
| **Bottom navigation** | **Always visible** — 5 slots |
| **Dashboard** | Zone order: A → B (scroll KPIs) → C (action grid) → D → E → F |
| **Quick actions** | 2×3 icon grid · sticky on scroll optional |
| **Forms** | Full-screen · sticky footer CTA |
| **Payslip PDF** | Full-screen viewer · share sheet |
| **AI Assistant** | Bottom sheet · FAB on dashboard (optional) |

### Bottom navigation spec

```text
┌────────┬────────┬────────┬────────┬────────┐
│  Home  │ Leave  │ Payslip│ Alerts │  More  │
│   ◉    │        │        │   ●2   │        │
└────────┴────────┴────────┴────────┴────────┘
```

- Active route highlighted  
- Badge on Alerts for unread count  
- More opens half-sheet menu  
- Safe area inset for iOS  
- Haptic on tab change (native app)

### Mobile dashboard wireframe

```text
┌─────────────────────────┐
│ [Photo] Good morning,   │
│         Jane            │
├─────────────────────────┤
│ ◀ KPI KPI KPI KPI ▶    │
├─────────────────────────┤
│ [Apply] [Correct] [Pay] │
│ [Loan]  [Upload] [Asset]│
├─────────────────────────┤
│ My Tasks (3)            │
│ ● Leave pending approval│
├─────────────────────────┤
│ Notifications           │
├─────────────────────────┤
│ ✨ AI Insight           │
├─────────────────────────┤
│ Home│Leave│Pay│🔔│More  │
└─────────────────────────┘
```

---

# Offline Strategy

**Future mobile app / PWA** — architecture planned, not P0 web.

| Capability | Behavior |
|------------|----------|
| **Offline viewing** | Cache last payslip PDF · profile summary · holiday list |
| **Offline requests** | Queue leave/correction drafts locally |
| **Sync queue** | Retry on reconnect · conflict resolution UI |
| **Read models** | IndexedDB / SQLite on native |
| **Stale indicator** | "Last updated 2h ago" banner |

**Not offline:** Payslip fetch if never cached · approval actions · real-time attendance

**Sync UX:** Subtle sync icon in header · failed sync → notification

---

# Permission Experience

### Role visibility

| Surface | Employee | Manager | HR (dual-role) | Admin |
|---------|----------|---------|----------------|-------|
| ESS Dashboard | ✓ | ✓ + Zone G | ✓ | ✓ |
| My Profile | View/edit own | Own | Own + link to admin profile | ✓ |
| Attendance/Leave | Own | Own + team summary | Own | ✓ |
| Payslips | Own published | Own only* | Own + admin if perm | ✓ |
| My Team | — | ✓ | ✓ | ✓ |
| My Approvals | — | ✓ | ✓ | ✓ |
| AI Assistant | Self tools | Self + team tools | Broader if `ai.access` | ✓ |
| Admin `/hr` | — | If `hr.access` | ✓ | ✓ |

\*Managers do not see team payslips on ESS unless explicit `payroll.payslip.view` with scope

### Key permissions (`ess.*`)

| Key | Purpose |
|-----|---------|
| `ess.access` | Portal entry |
| `ess.profile.view` / `ess.profile.edit` | Profile |
| `ess.attendance.view` | Attendance |
| `ess.leave.apply` | Leave |
| `ess.payslip.view` / `ess.payslip.print` | Payslips |
| `ess.document.upload` | Documents |
| `ess.request.create` | Generic requests |
| `ess.asset.view` | Assets |
| `ess.training.enroll` | Training |
| `ess.performance.self_review` | Performance |

**Record rule:** `self` on all ESS APIs — enforced server-side; UI hides cross-employee affordances

---

# AI First Experience

### Daily employee summary

| Delivery | When |
|----------|------|
| Dashboard Zone F | On load |
| Push digest | Morning optional |
| AI panel greeting | First open of day |

**Content:** Attendance streak · leave balance warning · training due · pending tasks count

### Attendance summary

Natural language: "You worked 176 hours this month with 1 late arrival."

### Leave summary

"You have 8 annual leave days remaining. 2 requests pending approval."

### Training suggestions

Mandatory gaps first · then skill-based recommendations

### Performance suggestions

"Your self-review is 60% complete" · goal deadline reminders

### Personal productivity insights

Opt-in · no surveillance framing · focus on employee benefit (balance, deadlines)

**Governance:** No keystroke monitoring · no screenshot · tenant-disable AI insights

---

# Global Quick Actions (ESS)

| ID | Action | Route | Permission |
|----|--------|-------|------------|
| QUICK-ESS-001 | Apply Leave | `/ess/leave?create=1` | `ess.leave.apply` |
| QUICK-ESS-002 | Attendance Correction | `/ess/attendance?correction=1` | `ess.attendance.view` |
| QUICK-ESS-003 | View Payslip | `/ess/payslips` | `ess.payslip.view` |
| QUICK-ESS-004 | Upload Document | `/ess/documents?upload=1` | `ess.document.upload` |
| QUICK-ESS-005 | My Requests | `/ess/requests` | `ess.request.create` |
| QUICK-ESS-006 | Ask AI | Open AI panel | `ai.chat` |
| QUICK-ESS-007 | Approve (manager) | `/ess/approvals` | `core.approval.act` |

---

# Cross-Reference Index

| Document | ESS relevance |
|----------|---------------|
| [uiux/HR_NAVIGATION_ARCHITECTURE.md](./HR_NAVIGATION_ARCHITECTURE.md) | ESS nav tree · bottom nav |
| [uiux/HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) | `DSH-ESS-001` zones |
| [uiux/EMPLOYEE_PROFILE_UI_ARCHITECTURE.md](./EMPLOYEE_PROFILE_UI_ARCHITECTURE.md) | Admin profile vs ESS profile |
| [uiux/ATTENDANCE_UI_ARCHITECTURE.md](./ATTENDANCE_UI_ARCHITECTURE.md) | ESS attendance slice |
| [uiux/LEAVE_UI_ARCHITECTURE.md](./LEAVE_UI_ARCHITECTURE.md) | ESS leave apply |
| [uiux/PAYROLL_UI_ARCHITECTURE.md](./PAYROLL_UI_ARCHITECTURE.md) | ESS payslips |
| [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md) | `workforce_ess_agent` |
| [HR_PERMISSION_MATRIX.md](../HR_PERMISSION_MATRIX.md) | `ess.*` keys |
| [HR_SCREEN_INVENTORY.md](../HR_SCREEN_INVENTORY.md) | `SCR-ESS-*` registry |
| [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../HR_FIGMA_WIREFRAME_BLUEPRINT.md) | ESS wireframe section |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll — ESS Portal |
| **Owner** | Product / Architecture |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Primary route** | `/ess` |
| **Primary template** | `DSH-ESS-001` |
| **Registered screens** | 11 core + 6 future |

---

**AgainERP ESS Portal UI Architecture** — mobile-first employee daily workspace foundation for portal, native app, manager overlay, and AI employee experience.
