# HR & Payroll — Employee Profile UI Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll  
> **Document Type:** Employee Profile UI / Wireframe Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_UI_UX_BLUEPRINT.md](../HR_UI_UX_BLUEPRINT.md) · [HR_SCREEN_INVENTORY.md](../HR_SCREEN_INVENTORY.md) · [uiux/HR_NAVIGATION_ARCHITECTURE.md](./HR_NAVIGATION_ARCHITECTURE.md) · [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md) · [HR_PERMISSION_MATRIX.md](../HR_PERMISSION_MATRIX.md) · [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md)  
> **Governance:** [UI_UX_DESIGN_STANDARDS.md](../../../04-uiux/standards/UI_UX_DESIGN_STANDARDS.md) · [record-view.md](../../../04-uiux/standards/record-view.md) · [activity-system.md](../../../04-uiux/standards/activity-system.md) · [ai-assistant-ui.md](../../../04-uiux/standards/ai-assistant-ui.md) · [PROJECT_COMMON_RULES.md](../../../00-foundation/PROJECT_COMMON_RULES.md)

**No visual mockups. No component code.**  
Defines **complete Employee Profile UI architecture** — the 360° workforce view at the center of AgainERP HR. Foundation for profile wireframes, workspace design, timeline experience, employee analytics, and AI employee experience.

**Route:** `/hr/employees?view={id}` · **Edit:** `?edit={id}` · **Tab deep link:** `&tab={slug}`  
**Screen IDs:** `SCR-HR-EMP-004` (profile) · `SCR-HR-EMP-005`–`016` (tabs) · `SCR-GLO-CMP-001` (drawer shell)

---

## Executive Summary

| Principle | UI rule |
|-----------|---------|
| **Heart of HR** | All workforce operations radiate from employee profile |
| **360° in one surface** | Single drawer — not separate page routes |
| **Drawer CRUD** | View on list route; `max-w-5xl` desktop; full-screen mobile |
| **Timeline is first-class** | Dedicated tab + smart button + activity aggregation |
| **Permission layers** | Tabs, fields, and AI outputs gated independently |
| **AI adjacent** | Insights panel + actions — never silent payroll writes |

**Design inspiration (structure only):** Oracle HCM 360° · Salesforce Timeline · Linear activity density · Notion section blocks.

---

# Employee Profile Philosophy

### Core belief

> **The employee profile is the workforce command center — one place to see who they are, what they do, what they earn, and what happened.**

| User question | Profile answers via |
|---------------|---------------------|
| Who is this person? | Zone A — Header + Zone B — Summary |
| What is their status? | Employment badge, probation, exit |
| What needs action? | Zone D — Pending · Notifications |
| What happened over time? | Tab 13 — Timeline (Zone E) |
| What should we do next? | Zone F — AI · Quick actions |
| Can I trust the data? | Tab 14 — Audit History |

### Profile vs list vs ESS

| Surface | Purpose | Route |
|---------|---------|-------|
| **Employee list** | Find and bulk operate | `/hr/employees` |
| **Employee profile** | 360° admin/manager view | `?view={id}` |
| **ESS profile** | Self view only | `/ess/profile` |
| **Edit mode** | Mutate master data | `?edit={id}` |

### Wireframe fidelity

Grayscale zones · labeled placeholders · tab slugs · permission annotations — no color or typography specs.

---

# Employee 360 Strategy

### Data domains aggregated

```text
                    ┌─────────────────────────────────┐
                    │     hr_employees (anchor)        │
                    │     + Core contact identity      │
                    └───────────────┬─────────────────┘
                                    │
     ┌──────────┬──────────┬───────┴───────┬──────────┬──────────┐
     ▼          ▼          ▼               ▼          ▼          ▼
 Personal   Employment  Compensation   Time      Talent    Records
 (contact)  (org, mgr)  (salary)      (att/lev)  (prf/trn)  (docs/assets)
     │          │          │               │          │          │
     └──────────┴──────────┴───────┬───────┴──────────┴──────────┘
                                   ▼
                         Timeline (360° aggregator)
                         AI read models + insights
```

### 360° visibility layers

| Layer | Content | Primary tab |
|-------|---------|-------------|
| **Identity** | Name, photo, contact | Personal |
| **Employment** | Org, manager, dates | Employment |
| **Compensation** | Salary, benefits | Compensation |
| **Time** | Attendance, leave | Attendance · Leave |
| **Pay** | Payslips, loans | Payroll |
| **Talent** | Goals, training | Performance · Training |
| **Custody** | Assets, documents | Assets · Documents |
| **History** | All events | Timeline · Audit |

### Cross-entity navigation

Every sub-entity row (leave request, payslip, asset) opens **nested drawer** or **inline expand** — profile route preserved in URL.

---

# Layout Strategy

### Container

| Viewport | Container | Width |
|----------|-----------|-------|
| **Desktop** | Right Sheet drawer | `max-w-5xl` (1024px+) |
| **Wide desktop** | Split layout with utility rail | ≥1280px — Zone D visible |
| **Tablet** | Full-width drawer | 768–1279px — Zone D collapsible |
| **Mobile** | Full-screen sheet | <768px — Zone D stacks below tabs |

**Never:** `/hr/employees/[id]` full page for standard CRUD.

### Six-zone framework

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ZONE A — PROFILE HEADER (12 col, fixed top)                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE B — PROFILE SUMMARY (12 col, collapsible on mobile)                    │
├──────────────────────────────────────────────┬──────────────────────────────┤
│ ZONE C — MAIN CONTENT TABS (~70%)            │ ZONE D — RIGHT CONTEXT (~30%)│
│ [Tab bar]                                    │ Persistent widgets           │
│ [Active tab body]                            │                              │
│                                              │                              │
│  (Tab 13 Timeline = ZONE E architecture)     │  (ZONE F AI may embed here)  │
├──────────────────────────────────────────────┴──────────────────────────────┤
│ ZONE F — AI INSIGHTS STRIP (optional full-width below tabs, or in Zone D) │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Zone | Sticky? | Scroll |
|------|---------|--------|
| A | Yes (within drawer) | No |
| B | Optional collapse | No |
| C | Tab bar sticky | Tab body scrolls |
| D | Independent scroll | Yes |
| E | Inside Tab 13 | Vertical timeline scroll |
| F | Below tabs or in D | Card stack |

---

# Timeline Strategy

Per [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md).

| Aspect | Rule |
|--------|------|
| **Primary surface** | Tab 13 — Activity Timeline |
| **Secondary** | Global Activity Drawer from list Activity column |
| **Aggregation** | Employee 360° index merges linked entities |
| **Order** | Newest first (toggle oldest) |
| **Density** | Linear-style vertical feed with icons |
| **Filters** | Chip bar — domain categories |
| **Drill-down** | Card click → source entity drawer |

**Inspiration blend:** Salesforce event grouping · Linear chronological density · Notion collapsible day headers.

---

# AI Integration Strategy

Per [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md) — agent `workforce_agent`.

| Surface | Zone | Context |
|---------|------|---------|
| **AI summary card** | Overview tab · Zone F | `employee_id` |
| **AI alerts** | Zone D | Risk flags |
| **AI Actions tab** | Optional sub-tab or panel section | Governed tools |
| **Ask about employee** | Header ✨ | Full profile context bundle |
| **Health score** | Overview + Zone F | Composite metric (advisory) |

**Rules:** AI inherits viewer RBAC · No other employees' PII in narrative · Payroll suggestions = review only.

---

# Responsive Strategy

| Breakpoint | Layout behavior |
|------------|-----------------|
| **Desktop ≥1280px** | A+B full width · C+D side-by-side · D persistent |
| **Desktop 1024–1279px** | C full width · D as collapsible right rail |
| **Tablet** | D below active tab · tab bar horizontal scroll |
| **Mobile** | Full-screen · Zone B accordion · D stacks · bottom quick actions |

| Element | Mobile adaptation |
|---------|-------------------|
| Header stats | 2×3 grid scroll |
| Tab bar | Scroll horizontal · max 5 visible + More |
| Timeline | Full width cards · swipe actions (future) |
| Quick actions | FAB or bottom chip bar |
| AI panel | Collapsed card · expand full-screen |

---

# Profile Page Framework

### URL contract

| State | URL |
|-------|-----|
| View profile | `/hr/employees?view={uuid}` |
| Tab deep link | `&tab=overview` · `&tab=timeline` · `&tab=compensation` |
| Edit | `/hr/employees?edit={uuid}` |
| Nested entity | `&tab=leave&leave_id={uuid}` (optional) |

### Tab slug registry

| # | Tab | Slug | Screen ID |
|---|-----|------|-----------|
| 1 | Overview | `overview` | SCR-HR-EMP-004 |
| 2 | Personal | `personal` | SCR-HR-EMP-004 |
| 3 | Employment | `employment` | SCR-HR-EMP-004 |
| 4 | Compensation | `compensation` | SCR-HR-EMP-009 |
| 5 | Attendance | `attendance` | SCR-HR-EMP-010 |
| 6 | Leave | `leave` | SCR-HR-EMP-011 |
| 7 | Payroll | `payroll` | SCR-HR-EMP-012 |
| 8 | Assets | `assets` | SCR-HR-EMP-013 |
| 9 | Performance | `performance` | SCR-HR-EMP-014 |
| 10 | Training | `training` | SCR-HR-EMP-015 |
| 11 | Documents | `documents` | SCR-HR-EMP-008 |
| 12 | Notes | `notes` | SCR-HR-EMP-007 |
| 13 | Activity Timeline | `timeline` | SCR-HR-EMP-005 |
| 14 | Audit History | `audit` | SCR-HR-EMP-006 |

**Overflow:** Tabs 8+ in "More ▾" dropdown when width constrained.

---

# ZONE A — Profile Header

Fixed top zone — always visible when scrolling tab content.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ LEFT                    │ CENTER (stats)              │ RIGHT (actions)    │
│ [Photo 80×80]           │ [stat][stat][stat]          │ [Edit] [Actions▾]  │
│ Name · EMP-ID badge     │ [stat][stat][stat]          │ [✨ Ask AI]        │
│ Designation             │                             │                    │
│ Dept · Branch · Company │                             │                    │
│ ● Status badge          │                             │                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ Smart buttons: [Leave] [Attendance] [Payslip] [Assets] [Timeline] [Activity]│
└─────────────────────────────────────────────────────────────────────────────┘
```

### LEFT AREA

| Element | Wireframe | Data source |
|---------|-----------|-------------|
| **Employee photo** | Avatar 80×80 · upload on edit | Core contact / `hr_employees` |
| **Employee name** | H1 line | `contacts.display_name` |
| **Employee ID** | Badge `EMP-####` | `employee_number` |
| **Designation** | Subtitle | `hr_designations` |
| **Department** | Subtitle | `hr_departments` |
| **Branch** | Subtitle | Core `branches` |
| **Company** | Subtitle (multi-co only) | Core `companies` |
| **Employment status** | Badge: active · probation · on_leave · terminated | `employment_status` |

### CENTER AREA — Quick statistics

| Stat | Wireframe | Drill-down |
|------|-----------|------------|
| **Years of service** | `4.2 yrs` | Employment tab |
| **Attendance rate** | `96%` (30d) | Attendance tab |
| **Leave balance** | `12d` primary type | Leave tab |
| **Performance score** | `4.2 / 5` last review | Performance tab |
| **Training completion** | `85%` | Training tab |
| **Assets assigned** | `3` | Assets tab |

**Layout:** 3×2 stat chips · skeleton per stat async load

### RIGHT AREA — Quick actions

| Action | Permission | Opens |
|--------|------------|-------|
| **Edit profile** | `hr.employee.edit` | `?edit={id}` |
| **Transfer employee** | `hr.employee.edit` | Transfer wizard modal |
| **Promote employee** | `hr.promotion.recommend` | Promotion wizard |
| **Salary revision** | `payroll.salary_revision.manage` | Compensation tab action |
| **Assign asset** | `hr.asset.assign` | Asset assign modal |
| **Generate letter** | `hr.document.view` | Letter template picker |
| **More actions ▾** | varies | Terminate · Print · Merge · Archive |

### Smart buttons row

Shortcut tabs — same as quick navigation:

`Leave` → `&tab=leave` · `Attendance` → `&tab=attendance` · `Payslip` → `&tab=payroll` · `Assets` → `&tab=assets` · `Timeline` → `&tab=timeline` · `Activity` → Global Activity Drawer

---

# ZONE B — Profile Summary

Collapsible band below header — **always visible on Overview**; optional collapse on other tabs.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Manager: [link]  │ Type: Permanent │ Joined: 2022-01-15 │ Confirmed: …     │
│ Location: Dhaka HQ │ Cost Center: CC-100 │ Skills: [chip][chip][chip]        │
│ Reporting: CEO → VP Eng → [Manager]                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Field | Wireframe |
|-------|-----------|
| **Manager** | Link → open manager profile drawer |
| **Employment type** | Text |
| **Joining date** | Date |
| **Confirmation date** | Date or "On probation" |
| **Work location** | `hr_locations` |
| **Reporting line** | Breadcrumb chain |
| **Cost center** | Code + name |
| **Skills summary** | Max 5 chips + "+N more" |

---

# ZONE C — Main Content Tabs

Tab bar + scrollable body. Each tab = logical screen for QA/API.

---

## TAB 1 — Overview

**Slug:** `overview` · **Permission:** `hr.employee.view`

### Layout wireframe

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Summary card 6col]  [Key metrics 6col]                                     │
│ [Recent activities 6col]  [Upcoming events 6col]                            │
│ [Notifications 6col]  [AI Summary 6col]                                     │
│ [Organization mini 12col]                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Section | Content |
|---------|---------|
| **Profile summary** | Subset of Zone B + contact quick view |
| **Key metrics** | 4 KPI mini-cards (attendance, leave, performance, training) |
| **Recent activities** | Last 5 timeline events |
| **Upcoming events** | Leave, reviews, training, birthdays |
| **Notifications** | Employee-specific alerts (max 5) |
| **AI summary** | 2-line narrative + "View insights" |
| **Organization view** | Manager + direct reports list (max 5) |

---

## TAB 2 — Personal Information

**Permission:** `hr.employee.view` · **Edit:** `hr.employee.edit`

| Section | Fields |
|---------|--------|
| **Personal details** | DOB, gender, marital status, blood group, nationality |
| **Address** | Present · permanent (Core addresses) |
| **Emergency contacts** | Name, relation, phone (table) |
| **Family members** | `hr_employee_family` table |
| **Identity documents** | National ID, passport — masked without `hr.sensitive.view` |

**Layout:** Notion-style section blocks · inline edit on `?edit={id}`

---

## TAB 3 — Employment Information

**Permission:** `hr.employee.view`

| Section | Content |
|---------|---------|
| **Employment details** | Status, type, grade, job position, join/exit dates |
| **Reporting structure** | Manager link · direct reports count |
| **Transfer history** | Table — from/to dept, branch, date |
| **Promotion history** | Table — old/new designation, date |
| **Confirmation history** | Probation milestones |
| **Employment status history** | `hr_employee_history` status changes |

**Actions:** Transfer · Promote · Terminate (permission-gated)

---

## TAB 4 — Compensation

**Permission:** `hr.sensitive.view` · **Hidden entirely without permission**

| Section | Content |
|---------|---------|
| **Salary structure** | Current structure name + effective date |
| **Allowances** | Component table |
| **Deductions** | Component table |
| **Benefits** | Benefits enrollment list |
| **Salary revisions** | History table — effective dates, % change |
| **Payroll history** | Link to Payroll tab summary |

**Masking:** Amounts hidden for roles without `hr.sensitive.view`

---

## TAB 5 — Attendance

**Permission:** `hr.attendance.view`

| Section | Content |
|---------|---------|
| **Attendance summary** | MTD present/absent/late counts |
| **Monthly attendance** | Table by day |
| **Attendance calendar** | Month grid P/A/L/H |
| **Late records** | Filtered table |
| **Absence records** | Filtered table |
| **Work from home** | `hr_wfh_records` list |
| **Outdoor duty** | Approved outdoor list |
| **Attendance analytics** | Sparkline + link to `/hr/attendance/analytics?employee={id}` |

---

## TAB 6 — Leave Management

**Permission:** `hr.leave.view`

| Section | Content |
|---------|---------|
| **Leave balances** | Card per leave type — progress bar |
| **Leave requests** | Table + create action |
| **Leave history** | Approved/rejected archive |
| **Leave calendar** | Mini calendar strip |
| **Encashments** | Encashment requests |
| **Approvals** | Pending items if viewer is approver |

**Action:** Create leave (`hr.leave.create`) · Approve (`hr.leave.approve`)

---

## TAB 7 — Payroll

**Permission:** `payroll.payslip.view_all` OR self scope

| Section | Content |
|---------|---------|
| **Payslips** | Table — period, net pay, status, download |
| **Payroll history** | Run participation summary |
| **Bonuses** | Bonus rows linked to employee |
| **Commissions** | Commission entries |
| **Loans** | Active loans + balance |
| **Salary advances** | Advances + recovery status |
| **Tax summary** | YTD tax (sensitive) |

**Payslip open:** Nested drawer `SCR-GLO-CMP-014` PDF preview

---

## TAB 8 — Assets

**Permission:** `hr.asset.create` / `hr.asset.view`

| Section | Content |
|---------|---------|
| **Assigned assets** | Current assignments table |
| **Asset history** | Full assignment timeline |
| **Damages** | Damage reports |
| **Returns** | Return records |
| **Warranties** | Expiry dates highlighted |

**Action:** Assign asset · Initiate return

---

## TAB 9 — Performance

**Permission:** `hr.performance.manage` / `hr.performance.view`

| Section | Content |
|---------|---------|
| **Goals** | Active goals table |
| **KPIs** | Assigned KPIs + progress |
| **KRAs** | KRA list |
| **Reviews** | Self + manager + final reviews |
| **Promotion recommendations** | Status pipeline |
| **Performance trends** | Rating over time chart placeholder |

---

## TAB 10 — Training

**Permission:** `hr.training.view` / `hr.training.program.manage`

| Section | Content |
|---------|---------|
| **Training programs** | Enrollments |
| **Attendance** | Session attendance |
| **Certificates** | Issued certs + expiry |
| **Skill matrix** | Skills vs required competencies |
| **Recommendations** | AI + HR recommended programs |

---

## TAB 11 — Documents

**Permission:** `hr.document.view`

| Section | Content |
|---------|---------|
| **Employee documents** | General file list |
| **Contracts** | Employment contracts |
| **Certificates** | Education + training certs |
| **Compliance documents** | IDs, work permits |
| **Expiry tracker** | Rows with expiry ≤30d highlighted |

**Upload:** `hr.document.upload` · See Document Preview Experience below

---

## TAB 12 — Notes

**Permission:** `hr.employee.view` · **Create:** `hr.employee.edit`

| Section | Visibility |
|---------|------------|
| **Private notes** | HR only — `hr.employee.view` |
| **HR notes** | HR team |
| **Manager notes** | Manager + HR |
| **Shared notes** | Collaborators with access |

**Pattern:** Core Notes entity · @mentions · not in employee self ESS view

---

## TAB 13 — Activity Timeline

**Most important tab** · **Screen:** `SCR-HR-EMP-005` · **Zone E architecture**

See [Timeline Experience](#timeline-experience) section.

---

## TAB 14 — Audit History

**Permission:** `hr.audit.export` / HR Manager · **Screen:** `SCR-HR-EMP-006`

| Section | Content |
|---------|---------|
| **Change logs** | Chronological field changes |
| **Field changes** | Field name, before, after |
| **Before / after values** | Side-by-side diff |
| **Approval logs** | Linked `activity_approvals` |
| **System events** | Import, device sync, AI actions |

**Export:** Compliance bundle button · activity logged

---

# ZONE D — Right Context Panel

**Persistent sidebar** — desktop ≥1280px · collapses on smaller viewports.

```text
┌─ Upcoming ──────────────┐
│ 🎂 Birthday in 5d       │
│ 📚 Training Mon 10am      │
├─ Pending requests ────────┤
│ Leave · OT · Correction   │
├─ Assigned assets ─────────┤
│ Laptop · Phone (2)        │
├─ Leave balance ───────────┤
│ Annual ████░░ 12/20       │
│ Sick   ██████░ 6/10       │
├─ Quick metrics ───────────┤
│ Tenure · Attendance %     │
├─ AI alerts ───────────────┤
│ ⚠ Doc expiring in 14d     │
│ 📈 Promotion readiness    │
├─ Notifications ───────────┤
│ [3 unread items]          │
└───────────────────────────┘
```

| Widget | Updates when |
|--------|--------------|
| **Upcoming birthdays** | Company calendar |
| **Upcoming trainings** | Enrollments |
| **Pending requests** | Workflow queues |
| **Assigned assets** | Asset assignments |
| **Leave balance** | Leave service |
| **Quick metrics** | KPI micro-service |
| **AI alerts** | AI insight batch |
| **Notifications** | Employee-filtered subset |

**Rule:** Panel content reflects **active tab context** where relevant (e.g. highlight leave balance on Leave tab).

---

# ZONE E — Timeline & Activities

Implemented as **Tab 13 body** + Global Activity Drawer integration.

### Timeline wireframe

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [All][Employment][Attendance][Leave][Payroll][Performance][Training][…]      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ── Today ─────────────────────────────────────────────────────────────────  │
│ ● [icon] Leave approved · 5 days · Karim approved        10:30 AM          │
│ ● [icon] Document uploaded · Passport                       9:15 AM          │
│ ── Yesterday ───────────────────────────────────────────────────────────  │
│ ● [icon] Salary revision · +8% effective Jun 1            HR Manager         │
│ ● [icon] Training completed · Safety 101                                  │
│ ── 2024-06-01 ──────────────────────────────────────────────────────────  │
│ ● [icon] Promoted to Senior Engineer                                        │
│ ● [icon] Transferred · Dhaka → Chittagong                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Event types (timeline)

| Event | Icon code | Source entity |
|-------|-----------|---------------|
| **Joined** | `hired` | `hr_employee` |
| **Promoted** | `promoted` | `hr_employee_history` |
| **Transferred** | `transferred` | `hr_employee_transfers` |
| **Salary changed** | `salary_changed` | `payroll_salary_revisions` |
| **Leave taken** | `leave_approved` | `hr_leave_request` |
| **Training completed** | `training_completed` | `hr_training_enrollment` |
| **Asset assigned** | `asset_assigned` | `hr_asset_assignment` |
| **Document updated** | `document_uploaded` | `hr_employee_documents` |
| **Performance reviewed** | `review_completed` | `hr_performance_review` |
| **Payslip published** | `payslip_published` | `payroll_payslip` |
| **Approved / rejected** | `approval_*` | `activity_approvals` |

---

# ZONE F — AI Insights Panel

Embeds in **Zone D** (alerts) + **Overview tab** (summary) + optional **full-width strip**.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ✨ Employee AI Insights                              [Refresh] [Ask more]   │
├─────────────────────────────────────────────────────────────────────────────┤
│ Health score: [████████░░] 78 — Stable                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ [⚠ Attendance risk]  [📈 Promotion ready]  [📚 Training gap]  [🔒 Compliance]│
└─────────────────────────────────────────────────────────────────────────────┘
```

See [AI Insights Panel](#ai-insights-panel) and [AI First Profile Experience](#ai-first-profile-experience).

---

# Timeline Experience

### Design references

| Source | Adopted pattern |
|--------|-----------------|
| **Salesforce Timeline** | Grouped by date · event type icons |
| **Linear** | Dense single-line events · fast scan |
| **Notion** | Collapsible day headers |

### Activity card anatomy

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [icon]  TITLE                                           DATE · RELATIVE     │
│         Description line — human readable narrative                         │
│         By: User Name · Role                    [Impact badge]              │
│         Related: [Leave Request LR-0142 →]                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Field | Spec |
|-------|------|
| **Icon** | Event type — 24px placeholder |
| **Title** | Short action label |
| **Description** | Activity log narrative |
| **Date** | Absolute + relative ("2h ago") |
| **User** | Actor name + avatar chip |
| **Impact** | optional: low · medium · high |
| **Related records** | Link chips to source entity |

### Timeline filters

| Filter chip | Includes |
|-------------|----------|
| **All** | Full 360° feed |
| **Employment** | Hire, transfer, promotion, status |
| **Attendance** | Punch, correction, WFH |
| **Leave** | Request, approval, balance adjust |
| **Payroll** | Payslip, revision, loan |
| **Performance** | Goals, reviews, promotion |
| **Training** | Enroll, complete, certify |
| **Assets** | Assign, return, damage |
| **Documents** | Upload, verify, expiry |
| **Approvals** | Approval decisions |

**Load more:** Infinite scroll · 20 events per page

---

# Analytics Panel

**Employee-specific analytics** — embedded in Overview + relevant tabs.

| Chart | Tab placement | Type |
|-------|---------------|------|
| **Attendance trend** | Attendance · Overview | Line 90d |
| **Leave trend** | Leave · Overview | Bar by month |
| **Performance trend** | Performance | Line by cycle |
| **Training trend** | Training | Progress bar timeline |
| **Compensation trend** | Compensation | Step chart (revision dates) |

**Wireframe:** `6×3` chart placeholder · footer link to domain analytics with `?employee={id}`

---

# AI Insights Panel

### Insight card types

| Insight | Example | Permission |
|---------|---------|------------|
| **Attendance risk** | "3 Monday absences in 8 weeks" | `hr.attendance.view` + `ai.access` |
| **Promotion readiness** | "Exceeds goals 2 cycles" | `hr.promotion.recommend` |
| **Training recommendations** | "Safety 101 overdue" | `hr.training.view` |
| **Performance insights** | "Rating trend declining" | `hr.performance.view` |
| **Attrition risk** | "Medium risk — score 0.62" | `hr.report.employee.view` |
| **Compliance alerts** | "Work permit expires in 14d" | `hr.document.view` |

**Card footer:** Confidence · Sources count · Dismiss · View details

---

# AI Actions

Governed actions from profile context — **human confirm required**.

| Action | Tool / flow | Permission |
|--------|-------------|------------|
| **Generate employee summary** | `hr.tool.employee_summary` | `ai.access` + `hr.employee.view` |
| **Explain attendance issues** | `hr.tool.explain_attendance` | `hr.attendance.view` |
| **Generate promotion review** | `hr.tool.draft_promotion_review` | `hr.promotion.recommend` |
| **Generate performance summary** | `hr.tool.performance_narrative` | `hr.performance.view` |
| **Generate training plan** | `hr.tool.training_plan` | `hr.training.view` |

**UI:** AI Actions section in Zone F · or sub-panel under ✨ in header

---

# Quick Action Bar

**Role-based** — duplicates header actions in contextual bar above tab content (optional).

| Role | Actions |
|------|---------|
| **HR Manager** | Edit · Transfer · Promote · Salary revision · Assign asset · Generate letter |
| **Payroll** | Salary revision · View payslips |
| **Dept Manager** | Approve leave · Start review · Assign training |
| **HR Executive** | Edit · Documents upload |
| **Employee (ESS)** | N/A on admin profile |

| Action | Modal / route |
|--------|---------------|
| **Approve leave** | Approval modal `SCR-GLO-CMP-006` |
| **Assign asset** | Asset assign modal |
| **Start review** | `/hr/performance/manager-reviews?employee={id}` |
| **Generate letter** | Template picker wizard |
| **Terminate** | `SCR-HR-EMP-M01` |

---

# Document Preview Experience

| Capability | Wireframe |
|------------|-----------|
| **Inline preview** | Split pane in Documents tab |
| **PDF viewer** | Embedded viewer placeholder |
| **Image viewer** | Full-width image block |
| **Version history** | Sidebar list of versions |
| **Download** | Action button · audit logged |

**Permission:** View `hr.document.view` · Download may require export permission

---

# Organization View

Embedded in **Overview tab** + **Employment tab**.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Reporting Manager: [Karim Rahman →]                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ Direct Reports (4)                                                          │
│ [avatar] Name · Designation                                                 │
│ [avatar] Name · Designation                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ Department: Engineering > Backend Team                                      │
│ [View org chart →]  /hr/organization/chart?highlight={id}                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Element | Behavior |
|---------|----------|
| **Manager** | Link → nested profile drawer |
| **Direct reports** | List max 10 · "View all" → filtered employee list |
| **Department structure** | Breadcrumb dept tree |
| **Org chart** | Link to chart with employee highlighted |

---

# Notification Area

Employee-specific notifications — Zone D widget + Overview section.

| Alert type | Example |
|------------|---------|
| **Document expiry** | Passport expires in 14 days |
| **Pending reviews** | Manager review due Friday |
| **Training due** | Mandatory training incomplete |
| **Asset return due** | Laptop return overdue |
| **Probation ending** | Probation ends in 7 days |
| **Confirmation pending** | Awaiting confirmation action |

**Source:** Notification engine filtered by `employee_id` context

---

# Mobile Profile Experience

### Mobile header (Zone A)

```text
┌─────────────────────────────┐
│ [←]  Employee Profile  [⋯]  │
│ [Photo] Name                │
│ EMP-0042 · ● Active         │
│ Designation · Dept          │
│ [stat][stat] horizontal     │
└─────────────────────────────┘
```

### Mobile tabs

- Horizontal scroll tab bar
- Max 4 visible + **More** sheet
- Default tab: Overview

### Mobile timeline

- Full-width activity cards
- Sticky filter chips
- Pull to refresh

### Mobile AI panel

- Collapsed card at bottom of Overview
- Tap → full-screen AI sheet

### Mobile quick actions

- FAB or bottom action sheet from `[⋯]`

---

# Permission Based Experience

### Tab visibility matrix

| Tab | Employee (ESS) | Team Lead | Dept Mgr | HR Exec | HR Mgr | Payroll | Admin |
|-----|----------------|-----------|----------|---------|--------|---------|-------|
| Overview | Self subset | Team | Team | ✓ | ✓ | View | ✓ |
| Personal | Self | — | — | ✓ | ✓ | — | ✓ |
| Employment | Self | Team | Team | ✓ | ✓ | View | ✓ |
| Compensation | — | — | — | — | ✓ | ✓ | ✓ |
| Attendance | Self | Team | Team | ✓ | ✓ | — | ✓ |
| Leave | Self | Team | Team | ✓ | ✓ | — | ✓ |
| Payroll | Own payslip | — | — | — | Summary | ✓ | ✓ |
| Assets | Self | — | — | ✓ | ✓ | — | ✓ |
| Performance | Self review | Team | Team | ✓ | ✓ | — | ✓ |
| Training | Self | — | — | ✓ | ✓ | — | ✓ |
| Documents | Self | — | — | ✓ | ✓ | — | ✓ |
| Notes | — | Manager | Manager | ✓ | ✓ | — | ✓ |
| Timeline | Self | Team | Team | ✓ | ✓ | Pay events | ✓ |
| Audit | — | — | — | — | ✓ | ✓ | ✓ |

### Field-level rules

| Data | Required permission |
|------|---------------------|
| Salary amounts | `hr.sensitive.view` |
| Bank account | `hr.sensitive.view` |
| National ID / tax | `hr.sensitive.view` |
| Other employees in timeline | Record rule scope |
| Audit export | `hr.audit.export` |

### Record scope

| Role | Scope |
|------|-------|
| **Employee** | `employee_id = self` |
| **Team Leader** | Direct reports |
| **Dept Manager** | Department subtree |
| **HR** | Company (or `view_all`) |
| **Payroll** | Company payroll data |

**Rule:** Hide tabs and actions — never show disabled tease.

---

# AI First Profile Experience

### Employee AI summary

| Element | Location |
|---------|----------|
| **2-line narrative** | Overview tab · Zone F |
| **Health score** | 0–100 composite (advisory) |
| **Risk indicators** | Chips: attendance · compliance · performance |
| **Recommendations** | Ranked action list |

### Context-aware insights

Profile route registers context bundle:

```text
{ employee_id, company_id, department_id, manager_id,
  active_tab, permission_set, recent_timeline_hash }
```

### Briefing modes

| Mode | Trigger | Content |
|------|---------|---------|
| **On open** | First view per session | Top 3 insights |
| **Daily** | Batch job | Updated alerts in Zone D |
| **On tab switch** | Tab change | Tab-specific insight strip |
| **Ask AI** | Header ✨ | Full conversational context |

### Health score components (advisory)

| Factor | Weight |
|--------|--------|
| Attendance consistency | 25% |
| Leave pattern | 15% |
| Performance rating trend | 25% |
| Training compliance | 15% |
| Document compliance | 10% |
| Tenure / stability | 10% |

**Display:** Progress bar + tooltip "How calculated?" — not used for automated HR decisions without human review.

---

# Edit Mode Architecture

**Route:** `?edit={id}` — same drawer, form layout replaces tab body.

| Behavior | Rule |
|----------|------|
| **Tabs hidden** | Single scroll form with sections |
| **Sections** | Personal · Employment · Compensation (if permitted) |
| **Save** | Primary action sticky footer |
| **Cancel** | Return to `?view={id}` |
| **Validation** | Inline field errors |
| **Optimistic lock** | `row_version` conflict message |

---

# Nested Drawer Strategy

| Opens from profile | Behavior |
|--------------------|----------|
| Manager profile | Stack drawer or replace with back nav |
| Leave request detail | Nested drawer · breadcrumb append |
| Payslip preview | `SCR-GLO-CMP-014` |
| Asset detail | Nested drawer |
| Approval action | Modal `SCR-GLO-CMP-006` |

**URL:** Parent `view={employee_id}` preserved · child via `&sub_view={entity}:{id}`

---

# Cross-Reference Index

| Document | Use |
|----------|-----|
| [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../HR_FIGMA_WIREFRAME_BLUEPRINT.md) | Profile wireframe frames |
| [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md) | Timeline data model |
| [HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) | KPI card patterns |
| [HR_PERMISSION_MATRIX.md](../HR_PERMISSION_MATRIX.md) | Full permission keys |
| [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md) | AI tools |
| [activity-system.md](../../../04-uiux/standards/activity-system.md) | Chatter patterns |
| [record-view.md](../../../04-uiux/standards/record-view.md) | Record view standards |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll |
| **Owner** | Product / Design |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Tabs defined** | 14 |
| **Zones defined** | A–F |
| **Primary screen** | SCR-HR-EMP-004 |

---

**AgainERP Employee Profile UI Architecture** — 360° workforce command center. Foundation for profile wireframes, workspace design, timeline, and AI employee experience.
