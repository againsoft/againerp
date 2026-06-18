# HR & Payroll — Activity Timeline UI Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll — Activity Timeline (reference implementation for all AgainERP modules)  
> **Document Type:** Activity Timeline UI / Wireframe Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md) · [HR_UI_UX_BLUEPRINT.md](../HR_UI_UX_BLUEPRINT.md) · [HR_SCREEN_INVENTORY.md](../HR_SCREEN_INVENTORY.md) · [uiux/EMPLOYEE_PROFILE_UI_ARCHITECTURE.md](./EMPLOYEE_PROFILE_UI_ARCHITECTURE.md) · [uiux/HR_APPROVAL_CENTER_UI_ARCHITECTURE.md](./HR_APPROVAL_CENTER_UI_ARCHITECTURE.md) · [uiux/HR_AI_ASSISTANT_UI_ARCHITECTURE.md](./HR_AI_ASSISTANT_UI_ARCHITECTURE.md)  
> **Governance:** [ACTIVITY_CHATTER_ARCHITECTURE.md](../../../modules/core/ACTIVITY_CHATTER_ARCHITECTURE.md) · [audit-trail.md](../../../database/audit-trail.md) · [APPROVAL_ENGINE_ARCHITECTURE.md](../../../core/engines/APPROVAL_ENGINE_ARCHITECTURE.md) · [NOTIFICATION_ENGINE_ARCHITECTURE.md](../../../core/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md) · [AI_OS_ARCHITECTURE.md](../../ai/AI_OS_ARCHITECTURE.md) · [activity-system.md](../../../ui-ux/activity-system.md) · [UI_UX_DESIGN_STANDARDS.md](../../../ui-ux/UI_UX_DESIGN_STANDARDS.md) · [PROJECT_COMMON_RULES.md](../../../PROJECT_COMMON_RULES.md)

**No visual mockups. No component code.**  
Defines **complete Activity Timeline User Experience Architecture** for AgainERP — HR & Payroll as the first full-domain reference, designed as a **reusable timeline framework** for CRM, Sales, Purchase, Inventory, Accounting, Manufacturing, Projects, Helpdesk, Documents, and Ecommerce.

**Backend reference:** [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md)  
**API:** `GET /api/v1/core/records/{type}/{id}/timeline` · `ActivityService.log()` write contract

---

## Executive Summary

| Principle | UI rule |
|-----------|---------|
| **Every record has a timeline** | Core platform mandate |
| **Single aggregator** | Activities + approvals + comments + AI — one stream |
| **Append-only truth** | No edit/delete of logged events in UI |
| **Field diffs on demand** | Change history in detail drawer |
| **Permission redaction** | Mask salary/bank per role in stream |
| **Module template** | `TIMELINE-UX-*` · `CMP-TML-*` reusable everywhere |

**Screen namespace:** `SCR-COR-ACT-*` · `SCR-HR-ACT-*` · **Widgets:** `WGT-ACT-LST-*` · **Components:** `CMP-TML-*`

---

# Timeline Philosophy

### Core belief

> **If it changed, it appears on the timeline. If it appears on the timeline, it is attributable.**

The Activity Timeline is the **human face of the Global Activity Engine** — not a module feature. HR & Payroll contributes the richest entity registry (employee 360°, payroll permanent class) and becomes the **reference UX implementation**.

| Concern | System | UI surface |
|---------|--------|------------|
| **What happened** | Activity logs | Timeline stream |
| **What changed** | Field diffs | Change history drawer |
| **Who decided** | Approval Engine | Approval timeline merge |
| **What was sent** | Notification Engine | Notification timeline (optional) |
| **What AI did** | AI OS audit | AI timeline events |
| **What people said** | Comments/notes | Threaded in stream |

### Timeline vs chatter vs audit

| Surface | Audience | Density | Route |
|---------|----------|---------|-------|
| **Timeline stream** | Daily users | Human-readable | Record tab · drawer |
| **Chatter composer** | Collaborators | Comments + scheduled activities | Same panel |
| **Audit view** | Compliance | Full forensic diffs | Toggle · export |
| **Employee 360°** | HR | Cross-entity aggregation | Profile Tab 13 |

### Reference implementation mandate

Future modules adopt:

| Pattern ID | Reuse |
|------------|-------|
| `TIMELINE-UX-LAYOUT-*` | Zones A–D |
| `TIMELINE-UX-CARD-*` | Event card anatomy |
| `TIMELINE-UX-VIEW-*` | Compact · detailed · audit |
| `TIMELINE-UX-FILTER-*` | Standard filter bar |
| `CMP-TML-STREAM-001` | Infinite scroll feed |

---

# Timeline Experience Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **Newest first** | Default sort · toggle to oldest |
| 2 | **Scannable density** | Linear-style single-line option |
| 3 | **Group by time** | Today · Yesterday · date headers |
| 4 | **Deep link everything** | Related record chips |
| 5 | **Sensitive masking** | Redacted values in stream · reveal in audit with perm |
| 6 | **Correlation visible** | Badge when part of workflow batch |
| 7 | **Source attribution** | UI · ESS · API · device · system · AI chip |
| 8 | **No silent merges** | User sees activity + approval + comment as distinct cards |
| 9 | **Infinite scroll** | 20 items per page lazy load |
| 10 | **Export audited** | Export action logs `export` activity |

### Design references (structure only)

| Source | Adopted pattern |
|--------|-----------------|
| **Salesforce Activity Feed** | Grouped feed · related records |
| **Linear** | Dense timeline · fast scan |
| **GitHub Activity** | Event verbs · actor · timestamp |
| **Notion History** | Collapsible day blocks · property diffs |

---

# Timeline Information Architecture

### Data layers in UI

```text
Timeline Aggregator (read API)
        │
        ├── activity_logs        (platform + domain)
        ├── activity_approvals   (approval steps merged)
        ├── comments / notes     (chatter)
        ├── attachments          (linked files)
        ├── notification_events  (optional delivery lane)
        └── activity_ai_actions  (AI audit)
```

### Timeline types (supported)

| Type | Anchor | Example route |
|------|--------|---------------|
| **Entity timeline** | Single record | `?view={id}&tab=timeline` |
| **User timeline** | `actor_user_id` | `/hr/reports/user-activity` |
| **Approval timeline** | `approval_request_id` | Approval detail Zone E |
| **Audit timeline** | Entity + `audit_tier` | Audit view toggle |
| **System timeline** | Company/device | Admin ops |
| **AI timeline** | `ai_audit_log_id` filter | AI history filter |

### Workspace hierarchy

```text
L1 — Global Activity Drawer     SCR-GLO-CMP-005 / SCR-COR-ACT-001
L2 — Record timeline tab        Embedded in record drawer
L3 — Full-page timeline         SCR-HR-ATT-005 · employee tab
L4 — 360° aggregator            SCR-HR-EMP-005 Employee Timeline
L5 — Audit export viewer        SCR-HR-ACT-003
```

---

# Timeline Filtering Strategy

### Default filters per context

| Context | Pre-applied filter |
|---------|-------------------|
| Employee profile | `entity=hr_employee:{id}` + 360° aggregator |
| Payroll run | `entity=payroll_run:{id}` |
| Leave request drawer | `entity=hr_leave_request:{id}` |
| Dashboard widget | Last 7d · company scope |
| Manager view | `department_subtree` |

### Filter persistence

URL query sync: `?timeline_filter=payroll&from=2026-01-01`  
Session saved per entity type

---

# AI Timeline Strategy

Per [uiux/HR_AI_ASSISTANT_UI_ARCHITECTURE.md](./HR_AI_ASSISTANT_UI_ARCHITECTURE.md) and [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md).

| Capability | UI surface |
|------------|------------|
| **AI timeline summary** | Zone A "AI Summary" button |
| **AI change summary** | Narrative of last 30d changes |
| **AI risk summary** | Flags from activity patterns |
| **AI recommendations** | Suggested follow-up actions |

**Rules:** AI reads via analytics API · never invents events · explainability on summaries  
**AI events in stream:** `ai_suggested` · `ai_insight` · `ai_action` with ✨ icon

---

# Timeline Framework

```text
Global Activity Timeline (Core)
├── Entity Timeline              per record tab / drawer
├── User Timeline                actor-centric (admin)
├── Approval Timeline            merged in approval workspace
├── Audit Timeline               compliance view + export
├── System Timeline              ops / device / import
└── AI Timeline                  filter + summary panel

HR Entity Timelines (reference)
├── Employee 360°                SCR-HR-EMP-005
├── Attendance                   SCR-HR-ATT-005
├── Leave                        leave request drawer tab
├── Payroll                      SCR-PAY-ACT-001
├── Asset                        asset drawer tab
├── Training                     enrollment drawer tab
├── Performance                  review drawer tab
└── Document                     document drawer tab

Future Module Timelines
├── Customer / Lead (CRM)
├── Order / Invoice (Sales)
├── Product (Catalog)
├── Purchase Order (Purchase)
├── Stock Move (Inventory)
├── Journal Entry (Accounting)
├── Work Order (Manufacturing)
├── Project / Task (Projects)
├── Ticket (Helpdesk)
└── Commerce Order (Ecommerce)
```

---

# Timeline Layout

**Component:** `CMP-TML-LAYOUT-001` — standard four-zone layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ZONE A — TIMELINE HEADER (sticky)                                           │
├──────────────────────────────────────────────┬──────────────────────────────┤
│ ZONE B — TIMELINE STREAM (~70%)              │ ZONE C — CONTEXT PANEL (~30%)│
│                                              │ (desktop · collapsible)      │
├──────────────────────────────────────────────┴──────────────────────────────┤
│ ZONE D — ACTIVITY DETAILS DRAWER (overlay · ?activity={id})                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ZONE A — Timeline Header

| Element | Spec |
|---------|------|
| **Entity name** | Record title + ID badge |
| **Entity type** | Module chip · icon |
| **Timeline filters** | Chip bar — see [Timeline Filters](#timeline-filters) |
| **Search** | Keyword · opens advanced |
| **Export** | CSV/PDF audit bundle · permission gated |
| **AI summary** | ✨ Generate summary |
| **View toggle** | Compact · Detailed · Audit · Grouped |

**Mobile:** Filters in sheet · search icon · view toggle in menu

---

## ZONE B — Timeline Stream

| Element | Spec |
|---------|------|
| **Chronological events** | Newest first default |
| **Grouped events** | Date headers · optional module group |
| **Highlighted events** | Pinned · compliance · permanent class |
| **Pinned events** | User-pinned (future) · sticky at top |
| **Unread activities** | Dot indicator · mark read on view |

**Feed component:** `CMP-TML-STREAM-001` — infinite scroll · lazy load 20/page

---

## ZONE C — Context Panel

Desktop right rail · hidden on mobile (bottom sheet via "Details")

| Section | Content |
|---------|---------|
| **Statistics** | Event count · last change · actors |
| **Related records** | Linked entities chips |
| **Quick actions** | Comment · schedule activity · export |
| **AI insights** | Risk · summary teaser |

---

## ZONE D — Activity Details Drawer

**Route:** `?activity={log_id}` on same page · **Component:** `CMP-TML-DETAIL-001`

| Section | Content |
|---------|---------|
| **Event details** | Full description · metadata |
| **Change history** | Field diff table |
| **Related actions** | Approval · notification links |
| **Attachments** | Files on this event |
| **Audit data** | Tier · correlation · source IP (audit role) |

Full-width on mobile

---

# Timeline Views

| View | ID | Use |
|------|-----|-----|
| **Compact view** | `TIMELINE-UX-VIEW-COMPACT` | Linear density · one line + meta |
| **Detailed view** | `TIMELINE-UX-VIEW-DETAIL` | Default · card with description |
| **Audit view** | `TIMELINE-UX-VIEW-AUDIT` | All fields · unmasked per permission |
| **Grouped view** | `TIMELINE-UX-VIEW-GROUPED` | By user · dept · module · type |
| **AI summary view** | `TIMELINE-UX-VIEW-AI` | Narrative + key events list |

Toggle in Zone A · preference saved per user per entity type

---

# Event Classification

### Platform action types

Per [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md):

| Category | Code | Icon family |
|----------|------|-------------|
| **Create** | `create` | Plus |
| **Update** | `update` | Edit |
| **Delete** | `delete` | Trash |
| **Archive** | `archive` | Archive |
| **Restore** | `restore` | Undo |
| **Approve** | `approve` | Check |
| **Reject** | `reject` | X |
| **Assign** | `assign` | User+ |
| **Transfer** | `transfer` | Arrow |
| **Status change** | `status_change` | Refresh |
| **System** | `system` | Gear |
| **AI event** | `ai_suggested` · `ai_insight` | Sparkle |

### HR domain subtypes (payload.subtype)

| Subtype | Maps to user label |
|---------|-------------------|
| `salary_changed` | Salary Change |
| `promoted` | Promotion |
| `attendance_changed` | Attendance Change |
| `leave_changed` | Leave Change |
| `payroll_locked` | Payroll Locked |
| `training_completed` | Training Event |
| `asset_assigned` | Asset Event |
| `document_uploaded` | Document Event |
| `hired` / `terminated` | Employment lifecycle |

### Priority styling

| Priority | When | UI |
|----------|------|-----|
| **Critical** | Termination · payroll lock · compliance | Red left border |
| **High** | Approval · salary · rejection | Orange accent |
| **Medium** | Standard mutations | Default |
| **Low** | Comments · views | Muted |

---

# Event Card Design

**Component:** `CMP-TML-CARD-001`

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [icon]  EVENT TITLE                                    TIMESTAMP · RELATIVE │
│         Event description — human readable narrative                        │
│         User: Name · Dept · Role          Source: UI    [Priority]         │
│         Related: [Leave LR-0142 →] [Approval APR-882 →]                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Field | Required | Notes |
|-------|----------|-------|
| **Event icon** | Yes | 24px · type-driven |
| **Event title** | Yes | i18n action label |
| **Event description** | Yes | Rendered narrative |
| **Timestamp** | Yes | Absolute + relative |
| **User** | Yes | Actor avatar + name |
| **Department** | Optional | Snapshot at event time |
| **Source** | Yes | `ui` · `ess` · `api` · `device` · `system` · `ai` |
| **Priority** | Optional | Badge |
| **Related records** | Optional | Link chips |

**Click:** Opens Zone D detail drawer  
**Keyboard:** `j/k` navigate · `Enter` open detail (desktop)

---

# Event Detail Experience

`CMP-TML-DETAIL-001` content zones:

| Section | Content |
|---------|---------|
| **Full description** | Expanded narrative |
| **Before values** | Snapshot or field old |
| **After values** | Snapshot or field new |
| **Changed fields** | Table — see Change History |
| **Attachments** | Thumbnails |
| **Comments** | Thread on this event (if any) |
| **Approval history** | Linked steps if `approval_request_id` |

**Sensitive fields:** Show `••••` with "Reveal" if permitted

---

# Change History Experience

*Critical section* — embedded in detail drawer and audit view

| Column | Content |
|--------|---------|
| **Field name** | Canonical path · human label |
| **Old value** | Masked per permission |
| **New value** | Masked per permission |
| **Changed by** | User link |
| **Changed on** | Timestamp |
| **Reason** | Required on sensitive actions |
| **Approval reference** | Link to approval if governed |

### Snapshot actions

For attendance/payroll recalc: side-by-side `before_snapshot` / `after_snapshot` JSON viewer (collapsible)

**Permanent class events:** Badge "Immutable record" — no compensating UI affordance for users

---

# Timeline Filters

`CMP-TML-FILTER-001` — chip bar + advanced sheet

| Filter | Options |
|--------|---------|
| **Date range** | Presets · custom |
| **Event type** | Platform + domain subtypes |
| **Module** | hr · payroll · sales · … |
| **User** | Actor picker |
| **Department** | Dept tree |
| **Branch** | Branch list |
| **Company** | Multi-company |
| **Priority** | critical · high · medium · low |
| **Approval status** | Has approval ref · approved · rejected |
| **Source** | ui · ess · api · system · ai |
| **AI only** | Toggle |

**Employee 360° chips:** All · Employment · Attendance · Leave · Payroll · Performance · Training · Assets · Documents · Approvals

---

# Timeline Search

| Mode | Behavior |
|------|----------|
| **Keyword search** | Full-text on description + subtype |
| **Entity search** | `entity_type:entity_id` |
| **User search** | `actor_user_id` |
| **Reference search** | `correlation_id` · `approval_request_id` |
| **Advanced search** | Combined filters sheet |

**API:** `GET /api/v1/core/activities/search?q=`  
**Debounce:** 300ms · highlight matches in cards

---

# Grouping Options

| Group by | Header format |
|----------|---------------|
| **Date** | Today · Yesterday · Jun 17, 2026 |
| **Week** | Week 24, 2026 |
| **Month** | June 2026 |
| **User** | Actor name |
| **Department** | Dept name |
| **Module** | HR · Payroll · Sales |
| **Event type** | Approve · Update · … |

Toggle in Grouped view · collapsible sections

---

# Activity Stream Experience

Inspired by Salesforce · Linear · GitHub · Notion — unified in `CMP-TML-STREAM-001`

| Feature | Spec |
|---------|------|
| **Infinite scroll** | Intersection observer · 20/page |
| **Lazy loading** | Skeleton cards |
| **Pinned activities** | Max 3 per entity (future) |
| **Highlighted activities** | `audit_tier=permanent` · compliance |
| **Unread activities** | `@mention` · assigned activity |
| **Pull to refresh** | Mobile |
| **Empty state** | "No activity yet" + contextual CTA |
| **Error state** | Retry · partial load |

### Stream merge rules

| Event sources | Merge order |
|---------------|-------------|
| Same `occurred_at` | Activity → approval → comment → AI |
| Duplicate suppression | Same correlation_id + action dedupe |

---

# Audit Timeline

*Critical view* — `TIMELINE-UX-VIEW-AUDIT`

| Display | Spec |
|---------|------|
| **Before / after values** | Full table all fields |
| **Approval actions** | Step log inline |
| **System actions** | `source=system` highlighted |
| **Compliance data** | `audit_tier` badge · legal hold |
| **Export** | `hr.audit.export` · encrypted bundle |
| **Hash chain** | Future integrity indicator (P5) |

**Screen:** `SCR-HR-ACT-003` · `/hr/reports/audit-export`  
**Audience:** Auditor · Company Admin · HR Manager (scoped)

**Rule:** Audit view never shown to employees on own record for other users' actions on peers

---

# Approval Timeline

Merged into entity stream and dedicated in [HR_APPROVAL_CENTER_UI_ARCHITECTURE.md](./HR_APPROVAL_CENTER_UI_ARCHITECTURE.md) — `CMP-APR-TIMELINE-001`

| Event | Card type |
|-------|-----------|
| **Request created** | `approval_change` — pending |
| **Approval steps** | Step approved/rejected per actor |
| **Comments** | Threaded on approval |
| **Escalations** | Escalation badge |
| **Delegations** | Delegate attribution |
| **Final outcome** | Approved/rejected summary card |

**Deep link:** `approval_request_id` → `/inbox/approvals?view={id}`

---

# Attachment Experience

| Feature | UI |
|---------|-----|
| **Uploaded files** | Card attachment row |
| **Document changes** | Version bump event |
| **Preview** | Inline viewer |
| **Downloads** | Logged as `download` activity |
| **Version history** | Sub-list in detail drawer |

**Integration:** Core media API · virus-scan badge

---

# Comment Experience

Per [activity-system.md](../../../ui-ux/activity-system.md) — merged in stream

| Type | Visibility |
|------|------------|
| **Internal comments** | Staff only |
| **Mentions** | `@user` → notification |
| **Replies** | Thread indent max 2 levels |
| **Threaded discussions** | Collapse threads > 3 replies |

**Composer:** Bottom of Zone B · modes: Log note · Send message · Schedule activity

---

# Notification Timeline

Optional lane — `?lane=notifications` (admin/debug)

| Event | Display |
|-------|---------|
| **Sent** | Channel icon |
| **Delivered** | Check |
| **Read** | Double check |
| **Acted upon** | Link to resulting activity |
| **Escalated** | Alert styling |

**Link:** `notification_delivery_id` on activity row when cross-referenced

---

# AI Timeline Experience

### AI events in stream

| Type | Card |
|------|------|
| **AI insights** | `ai_insight` — advisory |
| **AI recommendations** | `ai_suggested` — proposal |
| **AI predictions** | Batch insight reference |
| **AI actions** | User applied/rejected AI proposal |
| **AI explanations** | Expandable in detail |

### AI Summary Panel

`CMP-TML-AI-SUMMARY-001` — Zone A action

| Summary type | Scope |
|--------------|-------|
| **Daily summary** | Today's events narrative |
| **Weekly summary** | 7d rollup |
| **Monthly summary** | 30d rollup |
| **Entity summary** | Single record lifecycle |
| **Employee summary** | 360° narrative |

**Output:** Markdown panel · copy · export · `ai_insight` logged

---

# Timeline Analytics

**Route:** `/hr/reports/activity-analytics` (future) · embed in Zone C

| Metric | Visualization |
|--------|---------------|
| **Activity volume** | Line by day |
| **User activity** | Bar by user |
| **Department activity** | Heatmap |
| **Approval activity** | Stacked by outcome |
| **Change trends** | Top field changes |

**Dashboard widgets:** `WGT-ACT-LST-001`–`005` on HR dashboard Zone E

---

# Contextual Timelines

| Surface | Screen | Route |
|---------|--------|-------|
| **Employee profile** | `SCR-HR-EMP-005` | `?view={id}&tab=timeline` |
| **Employee activity tab** | `SCR-HR-EMP-006` | `&tab=activity` |
| **Attendance** | `SCR-HR-ATT-005` | `/hr/attendance/timeline` |
| **Leave** | Leave drawer | History tab |
| **Payroll** | `SCR-PAY-ACT-001` | `/payroll/runs?view={id}&tab=history` |
| **Approval** | Approval workspace | Zone E |
| **Global drawer** | `SCR-COR-ACT-001` | Activity trigger on any grid |

### Global Activity Drawer

**Component:** `SCR-GLO-CMP-005` · **Trigger:** Activity button on list rows · header 📋

- Opens right drawer with entity timeline  
- Same CMP-TML layout · narrower Zone C  

---

# Quick Actions

| Action | Permission | Surface |
|--------|------------|---------|
| **Comment** | Entity write | Composer |
| **Mention** | Entity comment | @ picker |
| **Approve** | `core.approval.act` | If pending on record |
| **Reject** | `core.approval.act` | Modal |
| **View details** | Entity read | Card click |
| **Open related record** | Related perm | Chip click |
| **Export** | `hr.audit.export` / module export | Header |
| **AI summary** | `ai.access` | Header ✨ |
| **Pin event** | Entity write | Card menu (future) |

---

# Mobile Timeline Experience

| Surface | Behavior |
|---------|----------|
| **Timeline feed** | Full-width cards · single column |
| **Quick filters** | Horizontal chip scroll |
| **Quick search** | Top bar icon |
| **AI summary** | Bottom sheet |
| **Event details** | Full-screen drawer |
| **Composer** | Sticky bottom bar |

**ESS:** Activity strip on requests · not full 360° for employees

---

# Permission Experience

Per [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md) security matrix:

| Role | Entity timeline | 360° employee | Audit view | Export | Salary diffs |
|------|-----------------|---------------|------------|--------|--------------|
| **Employee** | Own events only | Own | — | — | Masked |
| **Manager** | Team entities | Team subtree | — | — | Masked |
| **HR Executive** | Company HR | ✓ | View | — | With sensitive perm |
| **HR Manager** | Company HR | ✓ | View | Scoped | With `hr.sensitive.view` |
| **Payroll Manager** | Payroll entities | Payroll slice | View | Payroll | With payroll perm |
| **Admin** | All | ✓ | ✓ | ✓ | Full |
| **Auditor** | Compliance tier | ✓ | ✓ | ✓ | Full in export |

### API redaction

UI mirrors API — never render fields client-side if not in response

---

# Responsive Strategy

| Surface | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| **Layout** | Stream + context panel | Stream full · context sheet | Single column |
| **Zone C** | 30% right rail | Overlay sheet | Hidden — via "Info" |
| **Filters** | Chip bar inline | Wrap chips | Filter bottom sheet |
| **Detail drawer** | `max-w-lg` right | 70% width | Full screen |
| **Audit table** | Full columns | Horizontal scroll | Stacked field cards |
| **Composer** | Bottom of stream | Same | Sticky footer |

---

# AI First Timeline Experience

| Element | Surface |
|---------|---------|
| **AI timeline summary** | Zone A button → panel |
| **AI change summary** | "What changed this month?" |
| **AI risk summary** | Anomaly flags from activity patterns |
| **AI recommendations** | "Review attendance corrections" |

**Integration:** `hr.tool.activity_summary` · `workforce_agent`  
**Governance:** Summary cites event IDs · user can expand sources

---

# Cross Module Compatibility

Reusable framework — **same components, module-specific labels and filters**.

| Module | Entity examples | Timeline anchor |
|--------|-----------------|-----------------|
| **HR** | `hr_employee`, `hr_leave_request` | This doc |
| **Payroll** | `payroll_run`, `payroll_payslip` | Permanent class |
| **CRM** | `crm_lead`, `crm_opportunity` | Stage changes |
| **Sales** | `sales_order`, `sales_quotation` | Discount approvals |
| **Purchase** | `purchase_order`, `purchase_bill` | PO chain |
| **Inventory** | `inventory_adjustment`, `stock_transfer` | Before/after qty |
| **Accounting** | `finance_journal_entry`, `finance_payment` | Posted immutable |
| **Manufacturing** | `manufacturing_work_order` | Status steps |
| **Projects** | `project_task`, `timesheet_sheet` | Time entries |
| **Helpdesk** | `helpdesk_ticket` | Status + SLA |
| **Documents** | `document_file` | Version history |
| **Ecommerce** | `commerce_order` | Fulfillment events |
| **Catalog** | `catalog_product` | Price/publish |

### Module registration contract

Each module registers with Global Activity Engine UI:

| Registration | Purpose |
|--------------|---------|
| `entity_type` | API anchor |
| `timeline_label` | Header title template |
| `subtype_labels` | Domain event names |
| `icon_map` | Event icons |
| `filter_chips` | Domain-specific quick filters |
| `detail_renderer` | Optional custom detail sections |
| `sensitive_fields` | Redaction list |
| `audit_tier_default` | standard · compliance · permanent |

**Core unchanged:** Layout zones · card anatomy · stream · search · export · AI summary shell

### Universal platform features (all modules)

1. Timeline tab on every record drawer  
2. Comments · notes · mentions  
3. Attachments in stream  
4. Followers (notification)  
5. Approval history merge  
6. AI actions tab (optional)  
7. Unified search  
8. Retention tier badges  

---

# HR Entity Timeline Catalog

| Entity type | Timeline | 360° root | Screen |
|-------------|----------|-----------|--------|
| `hr_employee` | ✓ | ✓ | `SCR-HR-EMP-005` |
| `hr_attendance` | ✓ | ✓ | `SCR-HR-ATT-005` |
| `hr_leave_request` | ✓ | ✓ | Leave drawer |
| `payroll_run` | ✓ | — | `SCR-PAY-ACT-001` |
| `payroll_payslip` | ✓ | ✓ | Payslip drawer |
| `hr_asset_assignment` | ✓ | ✓ | Asset drawer |
| `hr_training_enrollment` | ✓ | ✓ | Training drawer |
| `hr_performance_review` | ✓ | ✓ | Performance drawer |
| `hr_employee_document` | ✓ | ✓ | Document drawer |

---

# Dashboard Widget Embed

Per [uiux/HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) — Zone E

| Widget ID | Content |
|-----------|---------|
| WGT-ACT-LST-001 | Recent activities (company) |
| WGT-ACT-LST-002 | Employee activities |
| WGT-ACT-LST-003 | Payroll activities |
| WGT-ACT-LST-004 | Attendance activities |
| WGT-ACT-LST-005 | Approval activities |

Max 20 rows · "View all" → filtered full timeline

---

# Component Registry (cross-module)

| Component ID | Purpose |
|--------------|---------|
| `CMP-TML-LAYOUT-001` | Four-zone layout |
| `CMP-TML-STREAM-001` | Infinite scroll feed |
| `CMP-TML-CARD-001` | Event card |
| `CMP-TML-DETAIL-001` | Activity detail drawer |
| `CMP-TML-FILTER-001` | Filter bar |
| `CMP-TML-GROUP-001` | Date/type group header |
| `CMP-TML-CHANGE-001` | Field diff table |
| `CMP-TML-AI-SUMMARY-001` | AI summary panel |
| `CMP-TML-COMPOSER-001` | Comment/activity composer |

---

# Screen & Route Index

| ID | Screen | Route | Permission |
|----|--------|-------|------------|
| SCR-COR-ACT-001 | Global Activity Drawer | Any list · ActivityTrigger | Entity read |
| SCR-HR-EMP-005 | Employee Timeline (360°) | `?view={id}&tab=timeline` | `hr.employee.view` |
| SCR-HR-EMP-006 | Employee Activity History | `&tab=activity` | `hr.employee.view` |
| SCR-HR-ACT-001 | Employee Activity Timeline | Same as EMP-005 | `hr.employee.view` |
| SCR-HR-ACT-002 | Attendance Timeline | `/hr/attendance/timeline` | `hr.attendance.view` |
| SCR-HR-ACT-003 | Audit Log Viewer | `/hr/reports/audit-export` | `hr.audit.export` |
| SCR-PAY-ACT-001 | Payroll Timeline | `?view={id}&tab=history` | `payroll.run.view` |
| SCR-GLO-CMP-005 | Global Activity Drawer | Component | Entity read |

---

# Cross-Reference Index

| Document | Use |
|----------|-----|
| [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md) | Log schema · types · retention |
| [ACTIVITY_CHATTER_ARCHITECTURE.md](../../../modules/core/ACTIVITY_CHATTER_ARCHITECTURE.md) | Platform engine |
| [activity-system.md](../../../ui-ux/activity-system.md) | Chatter UI |
| [uiux/EMPLOYEE_PROFILE_UI_ARCHITECTURE.md](./EMPLOYEE_PROFILE_UI_ARCHITECTURE.md) | Tab 13 timeline |
| [uiux/HR_APPROVAL_CENTER_UI_ARCHITECTURE.md](./HR_APPROVAL_CENTER_UI_ARCHITECTURE.md) | Approval timeline merge |
| [uiux/HR_AI_ASSISTANT_UI_ARCHITECTURE.md](./HR_AI_ASSISTANT_UI_ARCHITECTURE.md) | AI summary |
| [audit-trail.md](../../../database/audit-trail.md) | Forensic audit |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | Core Activity Timeline — HR reference |
| **Owner** | Product / Architecture |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Reusable patterns** | `TIMELINE-UX-*` · `CMP-TML-*` |
| **API** | `/api/v1/core/records/{type}/{id}/timeline` |

---

**AgainERP Activity Timeline UI Architecture** — enterprise timeline foundation for activity feed, audit history, change tracking, and AI summaries. **Template for all AgainERP modules.**
