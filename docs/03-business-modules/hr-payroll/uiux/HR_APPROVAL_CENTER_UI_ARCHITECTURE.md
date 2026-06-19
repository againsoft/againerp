# HR & Payroll — Approval Center UI Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll — Approval Experience (reference implementation for all AgainERP modules)  
> **Document Type:** Approval Center UI / Wireframe Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_WORKFLOW_ARCHITECTURE.md](../HR_WORKFLOW_ARCHITECTURE.md) · [HR_PERMISSION_MATRIX.md](../HR_PERMISSION_MATRIX.md) · [HR_NOTIFICATION_ARCHITECTURE.md](../HR_NOTIFICATION_ARCHITECTURE.md) · [HR_UI_UX_BLUEPRINT.md](../HR_UI_UX_BLUEPRINT.md) · [HR_SCREEN_INVENTORY.md](../HR_SCREEN_INVENTORY.md) · [uiux/HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) · [uiux/HR_AI_ASSISTANT_UI_ARCHITECTURE.md](./HR_AI_ASSISTANT_UI_ARCHITECTURE.md) · [uiux/ESS_PORTAL_UI_ARCHITECTURE.md](./ESS_PORTAL_UI_ARCHITECTURE.md)  
> **Governance:** [APPROVAL_ENGINE_ARCHITECTURE.md](../../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) · [WORKFLOW_ENGINE_ARCHITECTURE.md](../../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) · [NOTIFICATION_ENGINE_ARCHITECTURE.md](../../../02-core-platform/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md) · [AI_OS_ARCHITECTURE.md](../../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) · [database/multi-company.md](../../../05-development/database/multi-company.md) · [UI_UX_DESIGN_STANDARDS.md](../../../04-uiux/standards/UI_UX_DESIGN_STANDARDS.md) · [PROJECT_COMMON_RULES.md](../../../00-foundation/PROJECT_COMMON_RULES.md)

**No visual mockups. No component code.**  
Defines **complete Approval Center User Experience Architecture** for AgainERP — HR & Payroll as the first full-domain reference, designed as a **reusable approval center framework** for CRM, Sales, Purchase, Inventory, Accounting, Manufacturing, Projects, Helpdesk, and Documents.

**Backend reference:** [APPROVAL_ENGINE_ARCHITECTURE.md](../../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md)  
**API base:** `/api/v1/core/approvals/` · **Route namespace:** `/inbox/approvals`

---

## Executive Summary

| Principle | UI rule |
|-----------|---------|
| **One inbox** | All modules share `/inbox/approvals` — filter by module |
| **Contextual detail** | Approval workspace shows business data + chain + impact |
| **Human decides** | AI advises — never auto-approve payroll or high-risk HR |
| **SoD visible** | UI warns when submitter = approver or calculator = approver |
| **Mobile-first managers** | Card list · swipe actions · ESS overlay |
| **Audit complete** | Timeline · comments · attachments on every request |
| **Module template** | `APPROVAL-UX-*` patterns reusable platform-wide |

**Screen namespace:** `SCR-COR-APR-*` (Core) · **Nav:** `NAV-COR-APR-*` · **Widgets:** `WGT-APR-*` · **Components:** `CMP-APR-*`

---

# Approval Experience Philosophy

### Core belief

> **Approvals are where organizational authority meets daily work — the UI must make every decision fast, defensible, and fully auditable.**

The Approval Center is **not** an HR feature. It is a **Core platform surface** that HR, Payroll, and every business module plug into. HR & Payroll contributes the richest policy set and becomes the **reference UX implementation**.

| Stakeholder | Primary need | Surface |
|-------------|--------------|---------|
| **Line Manager** | Act on team requests quickly | My Approvals · mobile cards |
| **HR Manager** | Policy compliance + volume | Dashboard · priority queue |
| **Payroll Manager** | SoD-safe payroll sign-off | Payroll approval detail + impact |
| **Finance** | High-value gates | Escalated · loan · payroll high |
| **Employee** | Track own submissions | My Requests · notifications |
| **Auditor** | Who approved what, when | History · timeline · export |

### Approval vs workflow vs notification

| Layer | Owns | UI touchpoint |
|-------|------|---------------|
| **Workflow Engine** | Document state machine | Status bar on source record |
| **Approval Engine** | Human gates, chain, SLA | Approval Center |
| **Notification Engine** | Delivery | Bell · push · email |
| **Activity Engine** | Immutable trail | Timeline on approval detail |

### Reference implementation mandate

Future modules adopt:

| Pattern ID | Reuse |
|------------|-------|
| `APPROVAL-UX-INBOX-*` | List · kanban · filters |
| `APPROVAL-UX-DETAIL-*` | Detail workspace zones A–F |
| `APPROVAL-UX-ACTION-*` | Action bar |
| `APPROVAL-UX-CHAIN-*` | Multi-level visualization |
| `APPROVAL-UX-AI-*` | AI approval panel |
| `APPROVAL-UX-MOBILE-*` | Mobile approval cards |

---

# Approval UX Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **Exceptions first** | Pending queue above fold; badge on nav |
| 2 | **Context in one place** | Business data + chain + actions in one workspace |
| 3 | **No surprise approve** | Confirm modal on reject; optional on high-value approve |
| 4 | **SoD transparency** | Warning banner — not silent block only |
| 5 | **SLA visibility** | Due time · overdue · escalated styling |
| 6 | **Module identity** | Icon + color chip per module (HR · Payroll · Purchase) |
| 7 | **Deep link always** | Notification → `?view={approval_id}` drawer |
| 8 | **Comment required on reject** | Enforced in UI |
| 9 | **Keyboard shortcuts** | `a` approve · `r` reject · `j/k` navigate (desktop) |
| 10 | **Empty state clarity** | "No pending approvals" — not blank |

### CRUD / navigation contract

Per [PROJECT_COMMON_RULES.md](../../../00-foundation/PROJECT_COMMON_RULES.md):

| Action | Pattern |
|--------|---------|
| **List** | `/inbox/approvals` + query filters |
| **View detail** | `?view={approval_id}` — right sheet drawer |
| **Embedded panel** | On source record (leave drawer, payroll run) |
| **No** separate `/approvals/[id]` page for standard flow | |

---

# Approval Workspace Strategy

### Workspace hierarchy

```text
L1 — Global Approval Inbox        /inbox/approvals           SCR-COR-APR-001
L2 — Filtered queues              ?status=pending|approved|…  SCR-COR-APR-002–005
L3 — Approval detail workspace    ?view={id}                  CMP-APR-WORKSPACE-001
L4 — Embedded record panel        Source record drawer tab
L5 — ESS manager overlay          /ess/approvals              SCR-ESS-MGR-001
L6 — Analytics                    /inbox/approvals/analytics  SCR-COR-APR-007 (future)
```

### Multi-company scope

Per [database/multi-company.md](../../../05-development/database/multi-company.md):

| Scope | UI behavior |
|-------|-------------|
| **Company** | Company switcher filters inbox |
| **Branch** | Optional branch filter on HR attendance/leave |
| **Department** | Manager sees team subtree |
| **Cross-company approver** | Rare — badge "External company" |

Filters in Zone A header persist in session per user.

---

# Multi Level Approval Strategy

### Chain types (visual + behavior)

| Type | Description | UI representation |
|------|-------------|-------------------|
| **Single level** | One approver | Single step indicator |
| **Multi-level sequential** | Step 1 → 2 → 3 | Horizontal stepper |
| **Parallel** | HR + Finance simultaneously | Fork diagram · "2 of 2 required" |
| **Conditional** | Amount/days adds steps | Dynamic stepper · policy label |

### HR policy examples (reference)

Per [HR_WORKFLOW_ARCHITECTURE.md](../HR_WORKFLOW_ARCHITECTURE.md):

| Policy | Trigger | Chain |
|--------|---------|-------|
| `hr.leave.standard` | ≤ 3 days | Line manager |
| `hr.leave.extended` | > 3 days | Manager → HR |
| `hr.attendance.correction` | Any | Manager → HR |
| `payroll.run.standard` | Any run | Payroll officer → HR manager |
| `payroll.run.high` | Above threshold | + Finance |
| `hr.loan.high` | Principal > threshold | Manager → HR → Finance |

### Visual representation (`CMP-APR-CHAIN-001`)

```text
[Submitter] → [✓ Manager] → [● HR — You] → [○ Finance] → [Approved]
                    completed    current       pending
```

| Element | Spec |
|---------|------|
| **Approval flow diagram** | Stepper or vertical timeline |
| **Approval progress** | "Step 2 of 4" |
| **Current stage** | Highlighted node + assignee avatar |
| **Parallel steps** | Side-by-side nodes |
| **SLA per step** | Due badge on active step |

---

# AI Assisted Approval Strategy

Per [APPROVAL_ENGINE_ARCHITECTURE.md](../../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) §11 and [uiux/HR_AI_ASSISTANT_UI_ARCHITECTURE.md](./HR_AI_ASSISTANT_UI_ARCHITECTURE.md).

| Capability | UI surface | Constraint |
|------------|------------|------------|
| **Approval summary** | Zone F on detail | Read-only |
| **Risk analysis** | AI strip on card + detail | Score 0–100 |
| **Policy validation** | "Matches L2 chain" hint | Deterministic + narrative |
| **Compliance check** | Payroll/leave compliance notes | Advisory |
| **Suggested decision** | Approve / Reject / More info | **Human must click** |

**Forbidden:** Auto-approve payroll · auto-approve leave for manager without click · override SoD

**Governance:** All AI hints → Activity `ai_action` · explainability block required

---

# Approval Center Framework

```text
Approvals (Core)                             NAV-COR-APR-000
├── Dashboard                                /inbox/approvals                 SCR-COR-APR-001
├── My Approvals                             /inbox/approvals?assignee=me       (default view)
├── Pending                                  ?status=pending                  SCR-COR-APR-002
├── Approved                                 ?status=approved                 SCR-COR-APR-003
├── Rejected                                 ?status=rejected                 SCR-COR-APR-004
├── Escalated                                ?status=escalated                SCR-COR-APR-005
├── Delegated                                ?status=delegated                SCR-COR-APR-008 (future)
├── Team Approvals                           ?scope=team                      SCR-COR-APR-009 (future)
├── History                                  /inbox/approvals/history         SCR-COR-APR-006
└── Analytics                                /inbox/approvals/analytics       SCR-COR-APR-007 (future)
```

**HR filter:** `?module=hr,payroll` · **ESS manager:** `/ess/approvals` (optimized subset)

---

# Approval Dashboard

**Route:** `/inbox/approvals` · **Screen:** `SCR-COR-APR-001` · **Permission:** `core.approval.view`

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ZONE A — HEADER + FILTERS                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE B — KPI CARDS (6)                                                      │
├───────────────────────────────────────┬─────────────────────────────────────┤
│ ZONE C — ANALYTICS (~8 col)             │ ZONE D — PRIORITY QUEUE (~4 col)    │
├───────────────────────────────────────┴─────────────────────────────────────┤
│ ZONE E — AI RECOMMENDATIONS                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ZONE A — Header

| Filter | Options |
|--------|---------|
| **Approval filters** | Quick: My pending · Team · All (if `act_any`) |
| **Date range** | Submitted · due · completed |
| **Company** | Session company / multi |
| **Branch** | HR branch scope |
| **Department** | Dept subtree |
| **Module** | HR · Payroll · Purchase · Sales · All |
| **Priority** | Critical · high · medium · low |
| **Status** | Pending · approved · rejected · escalated |

**Actions:** Export · Refresh · Configure policies (admin → `/control-center/approvals/policies`)

---

## ZONE B — KPI Cards

| Widget ID | KPI |
|-----------|-----|
| WGT-APR-KPI-001 | Pending Approvals |
| WGT-APR-KPI-002 | Approved Today |
| WGT-APR-KPI-003 | Rejected Today |
| WGT-APR-KPI-004 | Escalated Requests |
| WGT-APR-KPI-005 | Overdue Approvals |
| WGT-APR-KPI-006 | Average Approval Time |

**Drill-down:** Each KPI applies filter to My Approvals list

---

## ZONE C — Approval Analytics

| Chart ID | Metric |
|----------|--------|
| WGT-APR-CHT-001 | Approval trends (volume over time) |
| WGT-APR-CHT-002 | Approval volume by module |
| WGT-APR-CHT-003 | Approval performance (avg TAT by approver) |
| WGT-APR-CHT-004 | Escalation trends |
| WGT-APR-CHT-005 | Module distribution (donut) |

**Permission:** `core.approval.analytics`

---

## ZONE D — Priority Queue

| Lane | Filter | Styling |
|------|--------|---------|
| **Critical** | priority=critical | Red border |
| **High** | priority=high | Orange |
| **Medium** | priority=medium | Default |
| **Low** | priority=low | Muted |

Max 5 per lane in dashboard widget · "View all" → filtered list

---

## ZONE E — AI Recommendations

| Widget | Content |
|--------|---------|
| **Urgent items** | SLA < 4h · payroll pay-day |
| **Risk items** | AI-flagged high risk |
| **Suggested actions** | Delegate · escalate · bulk review |
| **Approval insights** | Daily approver briefing |

**Widget IDs:** `WGT-APR-AI-001`–`004` · Link to AI panel with approval context

---

# My Approvals

*Most important screen* · **Route:** `/inbox/approvals?status=pending&assignee=me` · **Screen:** `SCR-COR-APR-002` · **Permission:** `core.approval.act`

### Views

| View | ID | Use |
|------|-----|-----|
| **List view** | `APPROVAL-UX-VIEW-LIST` | Default desktop · dense table |
| **Kanban view** | `APPROVAL-UX-VIEW-KANBAN` | By status or priority columns |
| **Timeline view** | `APPROVAL-UX-VIEW-TIMELINE` | Chronological · due-date focus |

Toggle in header · preference saved per user

### Filters

Module · Status · Priority · Department · Approver · Date range · Request type · Overdue only

### Columns (list view)

| Column | Content |
|--------|---------|
| **Request ID** | `APR-2026-00482` |
| **Module** | Chip: HR · Payroll · Purchase |
| **Request type** | Leave · Correction · Payroll run · Loan · … |
| **Requester** | Name · avatar |
| **Department** | Dept name |
| **Priority** | Badge |
| **Submitted date** | Relative + absolute |
| **Current step** | "Step 2 of 3 — HR" |
| **Status** | pending · escalated · … |
| **Due** | SLA countdown · overdue icon |
| **AI hint** | Optional risk chip |
| **Actions** | Approve · Reject · View |

**Mobile:** Card list — no horizontal scroll · swipe actions (future native)

### Row click

Opens **Approval Details Workspace** — `?view={approval_id}` full-width sheet on mobile

---

# Approval Details Workspace

*Critical screen* · **Component:** `CMP-APR-WORKSPACE-001` · **Route:** `/inbox/approvals?view={id}`

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ZONE A — REQUEST SUMMARY (sticky header)                                    │
├──────────────────────────────────────────────┬──────────────────────────────┤
│ ZONE B — BUSINESS DATA (~60%)                │ ZONE C — APPROVAL WORKFLOW   │
│                                              │ (~40%)                       │
├──────────────────────────────────────────────┴──────────────────────────────┤
│ ZONE D — IMPACT ANALYSIS (collapsible)                                      │
├──────────────────────────────────────────────┬──────────────────────────────┤
│ ZONE E — ACTIVITY TIMELINE (~55%)            │ ZONE F — AI ASSISTANT (~45%) │
├──────────────────────────────────────────────┴──────────────────────────────┤
│ APPROVAL ACTION BAR (sticky footer)                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ZONE A — Request Summary

| Field | Example |
|-------|---------|
| **Request number** | APR-2026-00482 |
| **Request type** | Leave Request |
| **Module** | HR |
| **Requester** | Jane Akter · EMP-0042 |
| **Submitted date** | 17 Jun 2026 09:14 |
| **Priority** | High |
| **Current status** | Pending — Step 2 of 3 |
| **Due** | Due in 6 hours |
| **SoD warning** | Banner if applicable |

**Link:** Open source record in module drawer (`hr:leave_request:{id}`)

---

## ZONE B — Business Data

Module-specific **read-only** snapshot — rendered by registered `approval_detail_renderer` per document type.

### HR examples

| Request type | Business data shown |
|--------------|---------------------|
| **Leave request** | Type · dates · days · balance before/after · reason · attachments |
| **Attendance correction** | Date · original punch · proposed · reason · evidence |
| **Payroll approval** | Run ID · period · headcount · gross · net · tax · exception count |
| **Loan approval** | Principal · installments · employee · outstanding |
| **Salary revision** | Old/new salary · % change · effective date |
| **Asset request** | Asset type · justification |
| **OT request** | Hours · date · project |
| **Performance** | Review cycle · rating proposal |
| **Profile update** | Changed fields diff |

**Payroll run:** Link to workbench · exception table embed · SoD banner if viewer calculated run

---

## ZONE C — Approval Workflow

| Section | Content |
|---------|---------|
| **Current step** | Assignee · role · SLA |
| **Completed steps** | Approver · timestamp · comment |
| **Pending steps** | Waiting assignees |
| **Future steps** | Greyed preview from policy |
| **Approval chain** | `CMP-APR-CHAIN-001` diagram |

**Parallel steps:** Show both branches with individual status

---

## ZONE D — Impact Analysis

Collapsible panel — module-provided impact widgets.

| Impact type | HR example |
|-------------|------------|
| **Business impact** | Team coverage: 2 others on leave same week |
| **Payroll impact** | LWP deduction estimate · run inclusion |
| **Compliance impact** | Policy max consecutive days |
| **Department impact** | Dept absence % that week |
| **Risk indicators** | Bridge holiday pattern · AI flag |

**Payroll approval:** Cost delta vs prior period · budget variance · compliance checklist status

---

## ZONE E — Activity Timeline

Per [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md) · entity-scoped.

| Event type | Icon |
|------------|------|
| Request created | `approval_change` |
| Comments | Comment bubble |
| Approvals | Check |
| Rejections | X |
| Escalations | Alert |
| Delegations | User swap |
| AI activities | ✨ |

**Chronological** · filter by type · @mentions in comments

---

## ZONE F — AI Assistant

`CMP-APR-AI-PANEL-001` — see [AI Approval Panel](#ai-approval-panel) below

| Section | Content |
|---------|---------|
| **Approval summary** | 3-bullet narrative |
| **Risk analysis** | Score + drivers |
| **Recommendation** | Approve / Reject / More info |
| **Compliance notes** | Policy excerpts |

---

# Approval Action Bar

**Sticky footer** · `CMP-APR-ACTION-BAR-001` · Permission-gated per action

| Action | Key | Permission | Notes |
|--------|-----|------------|-------|
| **Approve** | `a` | `core.approval.act` | Confirm on high-value |
| **Reject** | `r` | `core.approval.act` | Comment required |
| **Request changes** | | `core.approval.act` | Returns to submitter |
| **Escalate** | | `core.approval.act` | Manual escalate |
| **Delegate** | | `core.approval.delegate` | Pick delegate user |
| **Comment** | | `core.approval.act` | Add note without decision |
| **Assign reviewer** | | `core.approval.act_any` | Admin / HR only |

**SoD block:** Approve disabled + tooltip when rule violated  
**Partial parallel:** "Approve my step" when parallel branch pending others

---

# Multi Level Approval Experience

### Single level

One step · simple card · single CTA row

### Multi-level sequential

Stepper shows progress · only current assignee sees Approve  
**Submitter view:** Read-only stepper · "Awaiting HR"

### Parallel

```text
        ┌─ [HR Manager — Approved]
[Mgr] ──┤
        └─ [Finance — Pending — You]
```

Both must approve before workflow unblocks

### Conditional

Policy badge: "Extended leave policy applied (>3 days)"  
Dynamic steps visible after policy evaluation at submit time

---

# Escalation Center

**Route:** `/inbox/approvals?status=escalated` · **Screen:** `SCR-COR-APR-005`

| Surface | Content |
|---------|---------|
| **Pending escalations** | Overdue + auto-escalated |
| **Escalated requests** | Full list with escalation level |
| **Escalation rules** | Read-only policy view (admin link) |
| **Escalation history** | Per-request escalation events in timeline |

**Visual:** ⚠ overdue · 🔺 escalated badge · red SLA text

**HR SLAs** (reference): Leave manager 24h · Payroll 4h on pay day · Loan finance 72h

---

# Delegation Center

**Route:** `/settings/approvals/delegation` · **Inbox filter:** `?status=delegated`

| Surface | Content |
|---------|---------|
| **Delegate approvals** | Form: delegate to user · date range |
| **Temporary delegation** | OOO start/end |
| **Approval substitutes** | Active delegates list |
| **Delegation history** | Audit log |

**Inbox:** Items routed to `delegate_user_id` show "Delegated from {name}"  
**UI:** Delegate action on action bar when acting as original approver

---

# Team Approvals

**Route:** `/inbox/approvals?scope=team` · **Screen:** `SCR-COR-APR-009` (future)  
**ESS:** `/ess/approvals` · `SCR-ESS-MGR-001`

### Manager workspace

| Section | Content |
|---------|---------|
| **Team overview** | Pending count by type |
| **Department approvals** | Filtered to `department_subtree` |
| **Team approvals** | Direct reports + dept policy |
| **Bulk approvals** | See bulk section |
| **Approval analytics** | Team avg TAT |

**Scope:** Manager sees team submissions pending others' steps only if `core.approval.view` + scope — not peer approvals outside chain

---

# Approval History

**Route:** `/inbox/approvals/history` · **Screen:** `SCR-COR-APR-006`

| View | Filter |
|------|--------|
| **All requests** | Completed any outcome |
| **Completed (approved)** | `status=approved` |
| **Rejected** | `status=rejected` |
| **Escalated** | Had escalation event |
| **Archived** | > retention move to archive |

**Export:** `core.approval.export` · CSV/PDF · activity logged

---

# Timeline Experience

Every approval request **must** expose unified timeline (`CMP-APR-TIMELINE-001`):

| Requirement | Spec |
|-------------|------|
| **Chronological order** | Newest first or toggle |
| **Approval events** | Step assigned · approved · rejected |
| **Comments** | Threaded · @mentions |
| **Escalations** | With from/to approver |
| **Delegations** | With date range |
| **AI activities** | Risk scored · recommendation shown |

**Surfaces:** Detail workspace Zone E · source record Activity tab · notification deep link

---

# Comments Experience

`CMP-APR-COMMENTS-001`

| Type | Visibility |
|------|------------|
| **Internal comments** | Approvers + HR |
| **Approval notes** | Stored on approve/reject |
| **Review notes** | Request changes flow |
| **Attachments** | On comment |
| **Mentions** | @user → notification |

**Integration:** Core Activity Chatter — same backend as record comments

---

# Attachments Experience

| Category | Examples |
|----------|----------|
| **Supporting documents** | Medical cert on leave |
| **Request files** | Uploaded at submit |
| **Approval documents** | Signed PDF |
| **Audit documents** | Compliance pack |

**UI:** Thumbnail list · preview · download · virus-scan status badge

---

# Analytics Center

**Route:** `/inbox/approvals/analytics` · **Screen:** `SCR-COR-APR-007` (future)

| Report | Visualization |
|--------|---------------|
| **Approval volume** | Line chart by day/week |
| **Approval time** | Avg/median TAT · histogram |
| **Approval efficiency** | % within SLA |
| **Escalation rates** | Trend + by module |
| **Department analysis** | Bar by dept |
| **Approver performance** | Leaderboard · avg time |

**Widget on dashboard:** `WGT-APR-CHT-001` · **Permission:** `core.approval.analytics`

---

# AI Approval Panel

**Component:** `CMP-APR-AI-PANEL-001` · Future AgainERP AI

```text
┌─────────────────────────────────────────────────────────┐
│ ✨ Approval Assistant                                   │
├─────────────────────────────────────────────────────────┤
│ Summary: 3-day annual leave; balance sufficient;       │
│          1 teammate also off — coverage risk medium      │
├─────────────────────────────────────────────────────────┤
│ Risk: Medium (42)  ·  Policy: hr.leave.extended         │
│ Compliance: ✓ consecutive days within limit              │
├─────────────────────────────────────────────────────────┤
│ Suggested: Approve — similar requests approved 94%       │
│ ⚠ SoD: None  ·  Confidence: 0.81                        │
├─────────────────────────────────────────────────────────┤
│ [Why?] [Data sources] [Not helpful]                      │
└─────────────────────────────────────────────────────────┘
```

### AI sections

| Section | Content |
|---------|---------|
| **Approval summary** | Bullet narrative |
| **Risk analysis** | Score + drivers |
| **Policy validation** | Matched policy ID |
| **Compliance check** | Pass/fail items |
| **Suggested decision** | Approve · Reject · Need more info |

---

# AI Recommendations

| Recommendation | UI treatment |
|----------------|--------------|
| **Approve recommendation** | Green chip — user still clicks Approve |
| **Reject recommendation** | Red chip + reasons |
| **Need more information** | Amber · prompts comment to submitter |
| **Risk warning** | Banner — does not block action |

**Card on list row:** Small AI chip "Review SoD" · "Low risk"

---

# AI Explainability

`CMP-AI-EXPLAIN-001` embedded in approval AI panel

| Field | Required |
|-------|----------|
| **Why recommendation** | Yes |
| **Data sources** | leave balance API · attendance · policy doc |
| **Confidence score** | Yes |
| **Risk factors** | Bulleted |
| **Suggested actions** | Approve · request cert · delegate |

---

# Notification Experience

Per [HR_NOTIFICATION_ARCHITECTURE.md](../HR_NOTIFICATION_ARCHITECTURE.md) · Core events

| Notification | Trigger | Deep link |
|--------------|---------|-----------|
| **Approval requested** | `core.approval.requested` | `?view={id}` |
| **Approval reminder** | 50% SLA | Same |
| **Escalation alert** | SLA breach | Same · critical styling |
| **Approval completed** | Final approve | Source record |
| **Approval rejected** | Reject | Source record + reason |

**Channels:** In-app · email · push (mobile) · SMS (critical escalation, tenant config)

**Bell badge:** Count of pending for `assignee=me`

---

# Mobile Approval Experience

*Critical section*

### Mobile dashboard

- KPI strip: Pending · Overdue  
- Priority cards first  
- Pull-to-refresh  

### Quick approvals

- Top 3 pending on home dashboard Zone D (HR) or ESS approvals  
- Inline Approve/Reject on card  

### Approval cards (`APPROVAL-UX-MOBILE-CARD`)

```text
┌─────────────────────────────────────┐
│ [HR] Leave · Jane Akter              │
│ 3 days · Jun 20–22 · Due 6h         │
│ AI: Medium risk · Coverage note      │
├─────────────────────────────────────┤
│ [Reject]              [Approve]      │
└─────────────────────────────────────┘
```

### Approval timeline

Vertical stepper in detail sheet

### AI insights

Collapsed strip · expand to full panel

### Gestures (native app future)

- Swipe right → Approve (confirm)  
- Swipe left → Reject (comment sheet)  

**ESS:** `/ess/approvals` — manager-optimized · same API

---

# Bulk Approval Experience

**Phase:** P2 · Policy-gated low-value items only

| Step | UI |
|------|-----|
| **Select multiple** | Checkbox column · select all on page |
| **Approve multiple** | Bulk action bar · confirm modal lists N items |
| **Reject multiple** | Shared comment required |
| **Assign multiple** | Delegate/reassign |
| **Export selection** | CSV of selected rows |

**Rules:**  
- Audit per item — not single bulk log only  
- Payroll runs **excluded** from bulk approve  
- High priority **excluded** by default  
- SoD-checked per row — skip blocked with summary

---

# Permission Experience

### UI visibility matrix

| Surface | Employee | Manager | Dept Head | HR Mgr | Payroll Mgr | Finance | Admin |
|---------|----------|---------|-----------|--------|-------------|---------|-------|
| Approval dashboard | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| My pending | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Act approve/reject | — | ✓* | ✓* | ✓ | ✓† | ✓‡ | ✓ |
| Team approvals | — | ✓ | ✓ | ✓ | — | — | ✓ |
| History (all) | — | — | — | ✓ | ✓ | ✓ | ✓ |
| Analytics | — | — | — | ✓ | ✓ | ✓ | ✓ |
| Policy config | — | — | — | — | — | — | ✓ |
| Own request status | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

\*Assigned steps only · †Payroll policies · ‡Finance steps on high payroll/loan

### Core permission keys

| Key | Purpose |
|-----|---------|
| `core.approval.view` | See inbox |
| `core.approval.act` | Approve/reject assigned |
| `core.approval.act_any` | Super approver |
| `core.approval.submit` | Submit for approval |
| `core.approval.delegate` | Delegation |
| `core.approval.analytics` | Analytics center |
| `core.approval.export` | History export |
| `core.approval.configure` | Policies admin |

### Module keys (HR)

`hr.leave.approve` · `hr.attendance.correction.approve` · `hr.overtime.approve` · `payroll.run.approve` · `payroll.loan.approve` · `hr.performance.approve`

**Dual gate:** `core.approval.act` AND module approve permission where registered

---

# Responsive Strategy

| Surface | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| **Dashboard** | Full zones A–E | Stacked | KPI + priority list only |
| **My Approvals** | Table + side detail optional | Table | Cards |
| **Detail workspace** | `max-w-6xl` drawer | Full sheet | Full-screen |
| **Action bar** | Sticky footer horizontal | Same | Sticky bottom · large buttons |
| **Kanban** | 4 columns | 2 columns | Hidden — list only |
| **Analytics** | Full charts | 1-col charts | Summary KPIs |
| **Bulk select** | Checkbox column | Same | Long-press select mode |

**Manager-primary:** Mobile is first-class for approvals — not desktop-only

---

# AI First Approval Experience

| Element | Surface |
|---------|---------|
| **AI summary** | Detail Zone F · list row chip |
| **AI risk assessment** | Score badge |
| **AI recommendation** | Suggested decision chip |
| **AI compliance check** | Checklist in panel |
| **Human approval required** | Footer label: "You must confirm decision" |

**Dashboard Zone E:** Urgent + risk items from AI batch job

**Integration:** `workforce_agent` · approval-specific tools via Core AI Approval Assistant

---

# Cross Module Compatibility

Reusable approval experience — **same components, module-specific renderers**.

| Module | Example request types | Filter token |
|--------|----------------------|--------------|
| **HR** | Leave · OT · correction · loan · travel · offer | `hr` |
| **Payroll** | Payroll run · salary revision · bonus | `payroll` |
| **CRM** | Opportunity stage skip · discount | `crm` |
| **Sales** | SO discount · refund · credit note | `sales` |
| **Purchase** | PO · bill exception · return | `purchase` |
| **Inventory** | Adjustment · transfer · write-off | `inventory` |
| **Accounting** | Journal · payment run · expense | `finance` |
| **Manufacturing** | BOM change · production order | `manufacturing` |
| **Projects** | Timesheet · budget overrun | `project` |
| **Helpdesk** | Refund · SLA exception | `helpdesk` |
| **Documents** | Policy publish · retention exception | `documents` |
| **Catalog** | Price change · product publish | `catalog` |

### Module registration contract

Each module registers with Approval Engine UI:

| Registration | Purpose |
|--------------|---------|
| `module_icon` | Inbox row |
| `request_type_labels` | Human-readable type |
| `detail_renderer` | Zone B business data component |
| `impact_renderer` | Zone D optional widget |
| `deep_link` | Open source record route |
| `policy_catalog` | Admin policy picker labels |

**Core unchanged:** Inbox · chain · actions · timeline · permissions · notifications

### Embedded panel pattern

On any module record (Odoo-style):

- Status: `Pending Approval — Step 2 of 3`  
- Mini chain · Approve/Reject · link "Open in Approval Center"  

---

# HR Approval Type Catalog

| Type | Policy ID | Source route |
|------|-----------|--------------|
| Leave | `hr.leave.*` | `/hr/leave/requests?view={id}` |
| Attendance correction | `hr.attendance.correction` | `/hr/attendance/corrections?view={id}` |
| Overtime | `hr.overtime.*` | `/hr/overtime/requests?view={id}` |
| Payroll run | `payroll.run.*` | `/payroll/runs?view={id}` |
| Loan | `hr.loan.*` | `/payroll/loans?view={id}` |
| Advance | `hr.advance.*` | `/payroll/advances?view={id}` |
| Salary revision | `hr.salary.revision` | `/payroll/salary-revisions?view={id}` |
| Performance | `hr.performance.*` | `/hr/performance/reviews?view={id}` |
| Training | `hr.training.request` | `/hr/training/requests?view={id}` |
| Asset | `hr.asset.request` | `/hr/assets/requests?view={id}` |
| Recruitment offer | `hr.recruitment.offer` | `/hr/recruitment/offers?view={id}` |
| Profile update | `ess.profile.update` | `/ess/profile` |

---

# Dashboard Widget Embed

Per [uiux/HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) — Zone D on all manager/HR dashboards

**Widget:** `WGT-APR-LST-001` · Max 10 rows · inline approve when permitted

| Dashboard | Filter |
|-----------|--------|
| HR (`DSH-HR-001`) | `module=hr` |
| Payroll (`DSH-PAY-001`) | `module=payroll` |
| Manager (`DSH-MGR-001`) | `scope=team` |
| Executive | Read-only counts |

---

# Global Quick Actions

| ID | Action | Route | Permission |
|----|--------|-------|------------|
| QUICK-APR-001 | My Pending Approvals | `/inbox/approvals?status=pending` | `core.approval.act` |
| QUICK-APR-002 | Escalated Items | `?status=escalated` | `core.approval.act` |
| QUICK-APR-003 | Approval History | `/inbox/approvals/history` | `core.approval.view` |
| QUICK-APR-004 | Delegate Approvals | `/settings/approvals/delegation` | `core.approval.delegate` |
| QUICK-APR-005 | Approval Analytics | `/inbox/approvals/analytics` | `core.approval.analytics` |

**Top bar:** `TOP-APR` → `/inbox/approvals?status=pending` + badge count

---

# Component Registry (cross-module)

| Component ID | Purpose |
|--------------|---------|
| `CMP-APR-WORKSPACE-001` | Full detail layout zones A–F |
| `CMP-APR-ACTION-BAR-001` | Sticky approve/reject bar |
| `CMP-APR-CHAIN-001` | Multi-level stepper |
| `CMP-APR-TIMELINE-001` | Unified timeline |
| `CMP-APR-COMMENTS-001` | Comment thread |
| `CMP-APR-AI-PANEL-001` | AI approval assistant |
| `CMP-APR-EMBED-001` | Record-embedded panel |
| `CMP-APR-CARD-001` | Mobile/list row card |
| `CMP-APR-FILTER-001` | Standard filter bar |

---

# Screen & Route Index

| ID | Screen | Route | Permission |
|----|--------|-------|------------|
| SCR-COR-APR-001 | Approval Dashboard | `/inbox/approvals` | `core.approval.view` |
| SCR-COR-APR-002 | Pending Approvals | `?status=pending` | `core.approval.act` |
| SCR-COR-APR-003 | Approved Items | `?status=approved` | `core.approval.view` |
| SCR-COR-APR-004 | Rejected Items | `?status=rejected` | `core.approval.view` |
| SCR-COR-APR-005 | Escalated Items | `?status=escalated` | `core.approval.act` |
| SCR-COR-APR-006 | Approval History | `/inbox/approvals/history` | `core.approval.view` |
| SCR-COR-APR-007 | Approval Analytics | `/inbox/approvals/analytics` | `core.approval.analytics` |
| SCR-COR-APR-008 | Delegated Queue | `?status=delegated` | `core.approval.act` |
| SCR-COR-APR-009 | Team Approvals | `?scope=team` | `core.approval.view` |
| SCR-ESS-MGR-001 | ESS My Approvals | `/ess/approvals` | `core.approval.act` |

---

# Cross-Reference Index

| Document | Use |
|----------|-----|
| [APPROVAL_ENGINE_ARCHITECTURE.md](../../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) | Engine contract · policies |
| [HR_WORKFLOW_ARCHITECTURE.md](../HR_WORKFLOW_ARCHITECTURE.md) | HR policies · SLA |
| [HR_PERMISSION_MATRIX.md](../HR_PERMISSION_MATRIX.md) | SoD · approve keys |
| [HR_NOTIFICATION_ARCHITECTURE.md](../HR_NOTIFICATION_ARCHITECTURE.md) | Approval notifications |
| [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md) | Timeline events |
| [uiux/HR_AI_ASSISTANT_UI_ARCHITECTURE.md](./HR_AI_ASSISTANT_UI_ARCHITECTURE.md) | AI panel patterns |
| [uiux/ESS_PORTAL_UI_ARCHITECTURE.md](./ESS_PORTAL_UI_ARCHITECTURE.md) | Manager mobile approvals |
| [uiux/HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) | Zone D widget |
| [uiux/PAYROLL_UI_ARCHITECTURE.md](./PAYROLL_UI_ARCHITECTURE.md) | Payroll approval UX |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | Core Approval Center — HR reference |
| **Owner** | Product / Architecture |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Primary route** | `/inbox/approvals` |
| **Reusable patterns** | `APPROVAL-UX-*` · `CMP-APR-*` |

---

**AgainERP Approval Center UI Architecture** — enterprise approval experience foundation for inbox, workspace, analytics, mobile, and AI-assisted decisions. **Template for all AgainERP modules.**
