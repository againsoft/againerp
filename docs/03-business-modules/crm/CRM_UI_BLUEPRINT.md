# AgainERP — CRM Module UI Blueprint

> **Status:** Active — **CRM UI SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 15 — CRM UI Design  
> **Module:** CRM · Route prefix `/crm`  
> **Governance:** [FINAL_UI_ARCHITECTURE_LOCK.md](../../FINAL_UI_ARCHITECTURE_LOCK.md) — APPROVED  
> **Components:** [COMPONENT_UI_BLUEPRINT.md](../../04-uiux/standards/COMPONENT_UI_BLUEPRINT.md)  
> **Architecture:** [Architecture.md](./Architecture.md) · [CRM_MODULE_ARCHITECTURE.md](./CRM_MODULE_ARCHITECTURE.md)

**Documentation only.** No mockups · No Figma · No code.

> **Note:** `UI.md` is not yet present in the CRM module package — this blueprint is the UI SSOT until `UI.md` is generated from it.

---

## Purpose

Define the **complete CRM module UI** — navigation, pages, layouts, components, interactions, responsive rules, and AI features — using the locked AgainERP design system.

## Scope (from architecture)

| In scope | Out of scope |
|----------|--------------|
| Lead management | Customer master duplication (Core `contacts`) |
| Contact / account views (Core-linked) | Quotations · orders (Sales) |
| Pipeline · opportunities | Marketing automation execution |
| Activities · tasks (Core-linked) | Support tickets (Helpdesk) |
| CRM reports | Financial transactions |

**Data rule:** No `crm_contacts` table — leads/opportunities link via `contact_id` to Core contacts.

---

## 1. Navigation

### 1.1 Global placement

| Property | Value |
|----------|-------|
| Sidebar group | **Business Operations** (`nav.business-ops`) |
| Module root | `/crm` |
| Module access permission | `crm.access` |
| Quick action | Create Lead → `/crm/leads?create=1` |

### 1.2 Module navigation (Level 2 — Zone B)

| Tab | ID | Route | Visible |
|-----|-----|-------|---------|
| **Dashboard** | `WS-MODNAV-DASH` | `/crm/dashboard` | Always |
| **Operations** | `WS-MODNAV-OPS` | (active when in ops routes) | Always |
| **Reports** | `WS-MODNAV-RPT` | `/crm/reports` | When reports exist |
| **Automation** | `WS-MODNAV-AUTO` | `/crm/automation` | When workflows/AI automation |
| **Settings** | `WS-MODNAV-SET` | `/crm/settings` | When configurable |

### 1.3 Operations menu (Level 3 — sidebar when Operations active)

| Screen | Route | Permission | Entity |
|--------|-------|------------|--------|
| **Leads** | `/crm/leads` | `crm.leads.view` | `crm_leads` |
| **Contacts** | `/crm/contacts` | `crm.leads.view` | Core `contacts` (person) |
| **Companies** | `/crm/companies` | `crm.leads.view` | Core `contacts` (organization) |
| **Pipeline** | `/crm/pipeline` | `crm.opportunities.manage` | `crm_opportunities` kanban |
| **Activities** | `/crm/activities` | `crm.leads.view` | Core `activities` |
| **Tasks** | `/crm/tasks` | `crm.leads.view` | Core `activities` (task type) |

**Reports** and **Settings** are reached via Level 2 tabs — not duplicated in Operations list.

### 1.4 Command palette registrations (conceptual)

| Command ID | Label | Route |
|------------|-------|-------|
| `crm.leads.create` | Create Lead | `/crm/leads?create=1` |
| `crm.dashboard` | CRM Dashboard | `/crm/dashboard` |
| `crm.pipeline` | Open Pipeline | `/crm/pipeline` |

---

## 2. Pages & Layouts

| Page | Layout ID | Route | Primary components |
|------|-----------|-------|-------------------|
| CRM Dashboard | `LAYOUT-DASHBOARD` | `/crm/dashboard` | `WS-CONTENT-DASH` · dashboard widgets |
| Lead List | `LAYOUT-LIST` | `/crm/leads` | `DS-DATAGRID` / `DS-CARD-LIST` |
| Lead Detail | `LAYOUT-DETAILS` | `/crm/leads?view=` | `DS-DRAWER-CRUD` + tabs |
| Contact List | `LAYOUT-LIST` | `/crm/contacts` | Core contact list |
| Company List | `LAYOUT-LIST` | `/crm/companies` | Core contact list (org filter) |
| Pipeline | `LAYOUT-LIST` variant | `/crm/pipeline` | `DS-KANBAN-BOARD` |
| Opportunity Detail | `LAYOUT-DETAILS` | `/crm/pipeline?view=` | Drawer on pipeline page |
| Activities | `LAYOUT-LIST` | `/crm/activities` | Activity feed list |
| Tasks | `LAYOUT-LIST` | `/crm/tasks` | Task list |
| Reports | `LAYOUT-ANALYTICS` | `/crm/reports` | Charts + drill-down |
| Settings | `LAYOUT-SETTINGS` | `/crm/settings/*` | Form sections |

**CRUD rule (locked):** All create/edit via drawer URL params — `?create=1` · `?view={id}` · `?edit={id}`. No `/crm/leads/new`.

---

## 3. CRM Dashboard UI

**Route:** `/crm/dashboard` · **Template:** `tpl.module.standard`

### 3.1 Section layout

| Order | Section | Widget ID (example) | Category | Col span |
|-------|---------|---------------------|----------|----------|
| 1 | **Lead Summary** | `crm.lead-summary` | `kpi` | 3×4 |
| 2 | **Pipeline Value** | `crm.pipeline-value` | `kpi` | 3 |
| 3 | **Conversion Rate** | `crm.conversion-rate` | `kpi` | 3 |
| 4 | **Upcoming Activities** | `crm.upcoming-activities` | `calendar` / `list` | 6 |
| 5 | **Recent Leads** | `crm.recent-leads` | `table` | 6 |
| 6 | **AI Insights** | `crm.ai-insights` | `ai` | 12 |
| 7 | **Quick Actions** | `crm.quick-actions` | `quick_action` | 4 |

Satisfies locked module dashboard sections: Overview · KPI (≥3) · Activities · Tasks · Reports shortcuts · AI · Quick Actions.

### 3.2 Widget interactions

| Widget | Click behaviour |
|--------|-----------------|
| Lead Summary | `/crm/leads?filter=open` |
| Pipeline Value | `/crm/pipeline` |
| Conversion Rate | `/crm/reports/funnel` |
| Recent Leads row | `/crm/leads?view={id}` |
| Quick Actions | Create Lead · Log Activity · Open Pipeline |

### 3.3 Dashboard header

| Element | Value |
|---------|-------|
| Title | CRM Dashboard |
| Date filter | Optional — affects KPI/chart widgets |
| Primary action | Create Lead (`DS-BTN-PRIMARY`) |

---

## 4. Lead List UI

**Route:** `/crm/leads` · **Layout:** `LAYOUT-LIST`

### 4.1 Page chrome

```text
Breadcrumb: CRM › Leads
Header: Leads · [Import] [Export ▾] [+ Create Lead]
Toolbar: [Search] [Filters ▾] [Saved Views ▾] [List | Pipeline link]
Bulk bar: (when selected) N selected · Assign · Tag · Delete · Export
Grid / Card list
Pagination
Drawer: ?create= · ?view= · ?edit=
```

### 4.2 Features & components

| Feature | Component | Detail |
|---------|-----------|--------|
| **Search** | `DS-INPUT-SEARCH` | Name · email · company · phone — 300ms debounce |
| **Filters** | `DS-FILTER-BAR` | Quick chips + advanced drawer |
| **Saved Views** | `DS-DROPDOWN` | User-named filter presets |
| **Bulk Actions** | `DS-BULK-BAR` | Assign owner · change status · tag · delete |
| **Import** | `DS-IMPORT-MENU` | CSV wizard · `crm.leads.create` permission |
| **Export** | `DS-EXPORT-MENU` | CSV · Excel — respects filters |
| **Status Filters** | `DS-TAG` chips | New · Contacted · Qualified · Converted · Lost |
| **Pipeline Filters** | `DS-SELECT-MULTI` | When lead linked to pipeline context |
| **Owner Filters** | `DS-SELECT-SINGLE` | Assigned user · My leads · Unassigned |

### 4.3 Columns (desktop `DS-DATAGRID`)

| Column | Notes |
|--------|-------|
| Checkbox | Bulk select |
| Name | Primary — link opens `?view=` |
| Company | Linked contact org |
| Email · Phone | |
| Source | `crm_lead_sources` |
| Status | `DS-BADGE-STATUS` |
| Score | Optional AI score badge |
| Owner | `DS-AVATAR` + name |
| Created | Relative date |
| Actions | ⋯ menu — max 3 |

### 4.4 Mobile

`DS-CARD-LIST` — name · status · owner · tap → `?view=`

### 4.5 Empty state

`DS-EMPTY-FIRST` — "No leads yet" · CTA Create Lead · optional `DS-EMPTY-AI` import suggestion

---

## 5. Lead Details UI

**Route:** `/crm/leads?view={id}` (drawer default) · Full page only if >4 tabs + heavy sub-grids.

### 5.1 Layout

```text
┌──────────────────────────────────────────────┬─────────────────┐
│ DRAWER / DETAIL (Zone D)                     │ ACTIVITY PANEL  │
│ Header · Smart Buttons · Tabs · Tab content  │ (Zone E)        │
└──────────────────────────────────────────────┴─────────────────┘
```

Mobile: full-screen drawer · Activity as tab not side panel.

### 5.2 Header

| Element | Content |
|---------|---------|
| Title | Lead name |
| Status | `DS-BADGE-STATUS` |
| Subtitle | Company · source · owner |
| Actions | [Edit] [Convert] [⋯] — `DS-BTN-*` |

**Convert** (`DS-BTN-PRIMARY` when qualified): opens convert wizard modal → contact + opportunity per architecture.

### 5.3 Smart buttons (Odoo-inspired)

Stat pills linking to filtered related data:

| Button | Example | Links to |
|--------|---------|----------|
| Activities | 5 Activities | Activities tab |
| Meetings | 2 Meetings | Meetings tab |
| Score | Score: 82 | AI insight expand |

### 5.4 Tabs

| Tab | Content | Component |
|-----|---------|-----------|
| **Overview** | Lead fields · contact link · assignment | `FORM_STANDARD` sections |
| **Activities** | Timeline | `DS-ACTIVITY-FEED` |
| **Notes** | Internal notes | `DS-COMMENTS` / Core notes |
| **Emails** | Email log (future integration) | List + empty state |
| **Calls** | Call activities | Filtered `DS-ACTIVITY-FEED` |
| **Meetings** | Meeting activities | `DS-CALENDAR` snippet + list |
| **Attachments** | Files | `DS-ATTACHMENTS` |
| **History** | Stage/status audit | `DS-TIMELINE` |

### 5.5 Right activity panel (desktop ≥1280px)

| Tab | Component |
|-----|-----------|
| Activity | `WS-CONTEXT-ACTIVITY` — chatter |
| AI | `DS-AI-PANEL` — lead context |
| Related | Opportunities · contact record |

### 5.6 Edit mode

`?edit={id}` — same drawer · form footer [Cancel] [Save] sticky on mobile.

---

## 6. Pipeline UI

**Route:** `/crm/pipeline` · **View:** Kanban · **Entity:** `crm_opportunities`

### 6.1 Layout

```text
Header: Pipeline · [+ Create Opportunity] · pipeline selector · date filter
Toolbar: [Search] [Owner filter] [Stage filter]
Kanban: DS-KANBAN-BOARD — horizontal columns
```

### 6.2 Stages (default pipeline)

| Stage | Column colour token | Terminal |
|-------|---------------------|----------|
| **New** | `--status-info` | No |
| **Qualified** | `--status-pending` | No |
| **Proposal** | `--status-warning` | No |
| **Negotiation** | `--status-warning` | No |
| **Won** | `--status-success` | Yes |
| **Lost** | `--status-danger` | Yes |

Stages are configurable per `crm_pipelines` / `crm_stages` — UI renders from API config.

### 6.3 Kanban card anatomy

| Field | Display |
|-------|---------|
| Title | Opportunity name |
| Company | Contact org |
| Amount | Currency formatted · `company_id` context |
| Probability | % badge |
| Close date | Relative |
| Owner | Avatar |

Card click → `/crm/pipeline?view={id}` drawer.

### 6.4 Drag & drop rules

| Rule | Detail |
|------|--------|
| Component | `DS-KANBAN-BOARD` |
| Drag between stages | PATCH stage API · emits `crm.opportunity.stage_changed` |
| Won / Lost | Confirm modal · lost requires `crm_lost_reasons` select |
| Optimistic UI | Move card immediately · revert on API failure |
| Permission | `crm.opportunities.manage` required |
| Won handoff | CTA "Create Quotation" → Sales module link |

### 6.5 Stage actions (column header ⋯)

| Action | Permission |
|--------|--------------|
| Collapse column | All viewers |
| Sort cards | All viewers |
| Bulk move | Manager |

### 6.6 AI suggestions (pipeline)

| Suggestion | UI |
|------------|-----|
| Stale deals | `DS-AI-INSIGHTS` banner — "3 deals inactive 14+ days" |
| Win probability | Card subtitle from AI |
| Next action | Chip on card → `DS-AI-SUGGESTIONS` |

View switcher on leads list: **List | Pipeline** toggle — same opportunity data.

---

## 7. Contact & Company List UI

### 7.1 Contacts (`/crm/contacts`)

| Property | Value |
|----------|-------|
| Data | Core `contacts` — type person |
| Layout | `LAYOUT-LIST` + drawer |
| CRUD | Core contact permissions |
| CRM context | Show linked leads/opportunities count column |

### 7.2 Companies (`/crm/companies`)

| Property | Value |
|----------|-------|
| Data | Core `contacts` — type organization |
| Columns | Name · industry · leads count · pipeline value · owner |
| Detail | Full page when many related records else drawer |

---

## 8. Activity System UI

Core-owned `activities` — CRM configures views only.

### 8.1 Activity types

| Type | UI surface | Component |
|------|------------|-----------|
| **Calls** | Lead/opportunity tabs · `/crm/activities?type=call` | Log call form in drawer |
| **Meetings** | Meetings tab · calendar | `DS-CALENDAR` + create modal |
| **Tasks** | `/crm/tasks` | `DS-TASK-LIST` · checkbox complete |
| **Follow Ups** | Scheduled task subtype | Due date badge on lead list |
| **Reminders** | Notification + activity due | `DS-ALERT-WARNING` on dashboard |

### 8.2 Log activity flow

```text
[+ Log Activity] → DS-MODAL or inline drawer
  Type: Call · Meeting · Task
  Related: current lead/opportunity (pre-filled)
  Due date · Assigned to · Notes
  Save → appears in DS-ACTIVITY-FEED
```

### 8.3 Activities list page (`/crm/activities`)

| Filter | Options |
|--------|---------|
| Type | Call · Meeting · Task · Email |
| Status | Open · Done · Overdue |
| Owner | My activities · team |
| Related | Lead · Opportunity · Contact |

---

## 9. AI CRM UI

Uses `DS-AI-*` components only — register in module `AI.md`.

### 9.1 Features & placement

| Feature | Component | Placement |
|---------|-----------|-----------|
| **Lead Scoring** | `DS-AI-INSIGHTS` | Lead list column · detail header badge |
| **Lead Summary** | `DS-AI-BRIEFING` | Lead detail Overview tab · AI tab |
| **Next Best Action** | `DS-AI-SUGGESTIONS` | Lead drawer · dashboard widget |
| **Follow Up Suggestions** | `DS-AI-SUGGESTIONS` | Activity panel · task list empty state |
| **Opportunity Detection** | `DS-AI-INSIGHTS` | Contact/company detail — upsell banner |

### 9.2 AI entry points (CRM)

| Entry | Context passed |
|-------|------------------|
| Header `Ctrl+J` | Module CRM · current record |
| Dashboard AI Insights widget | Workspace + CRM metrics |
| Lead detail AI tab | Lead ID · stage · activities |
| Pipeline AI banner | Pipeline ID · stale deals |

### 9.3 AI actions (permission-gated)

| Action | UI | Confirm |
|--------|-----|---------|
| Generate follow-up email | `DS-AI-ACTIONS` toolbar | Preview before send |
| Score lead | Row action | No |
| Summarize lead | Suggestion chip | No |
| Suggest stage move | Pipeline card chip | User applies manually |

### 9.4 AI off / unavailable

Hide AI widgets and chips — no broken placeholders (`DS-EMPTY-AI` fallback to manual CTA only when AI was expected feature flag).

---

## 10. Reports UI

**Route:** `/crm/reports` · **Layout:** `LAYOUT-ANALYTICS`

| Report | Route | Visual |
|--------|-------|--------|
| Pipeline funnel | `/crm/reports/funnel` | Chart + stage table |
| Lead source | `/crm/reports/sources` | Bar chart |
| Win/loss | `/crm/reports/win-loss` | KPI + chart |
| Forecast | `/crm/reports/forecast` | Chart by close date |
| Activity summary | `/crm/reports/activities` | Table |

Export via `DS-EXPORT-MENU` · date range in page header.

---

## 11. Settings UI

**Route:** `/crm/settings` · **Layout:** `LAYOUT-SETTINGS` · Permission: `crm.pipeline.configure`

| Section | Route | Fields |
|---------|-------|--------|
| Pipelines & Stages | `/crm/settings/pipelines` | Pipeline CRUD · stage order |
| Lead Sources | `/crm/settings/sources` | Source list |
| Lost Reasons | `/crm/settings/lost-reasons` | Reason codes |
| Scoring Rules | `/crm/settings/scoring` | Rule builder (future) |
| Assignment Rules | `/crm/settings/assignment` | Territory · round-robin |

Sticky save bar · danger zone for delete pipeline at bottom.

---

## 12. Mobile CRM UI

### 12.1 Priority screens

| Screen | Layout | Notes |
|--------|--------|-------|
| **Dashboard** | 1-col widget stack | KPI · tasks · AI brief priority |
| **Lead List** | `DS-CARD-LIST` | Swipe actions optional |
| **Lead Details** | Full-screen drawer | Tabs scroll horizontal |
| **Activities** | Card list | Log activity FAB |
| **Quick Actions** | Bottom Create → Create Lead | |

### 12.2 Mobile-specific behaviour

| Rule | Detail |
|------|--------|
| Pipeline | Horizontal scroll columns · snap · card tap → drawer |
| Bulk actions | Long-press enter selection mode |
| Activity panel | Tab inside drawer — not Zone E |
| Smart buttons | Scroll horizontal chip row |
| Bottom nav override | Optional: Dashboard · Leads · Pipeline · More |

### 12.3 Responsive component matrix (CRM)

| Screen | Desktop | Mobile |
|--------|---------|--------|
| Lead list | `DS-DATAGRID` | `DS-CARD-LIST` |
| Lead detail | Drawer 480px + Zone E | Full-screen drawer |
| Pipeline | Full kanban | Scroll kanban |
| Dashboard widgets | 12-col grid | §9 mobile priority |

---

## 13. Interaction Rules (CRM-specific)

| Interaction | Rule |
|-------------|------|
| Lead create | `/crm/leads?create=1` — never `/new` |
| Lead convert | Modal wizard — not drawer CRUD |
| Stage drag | Optimistic · confirm Won/Lost |
| Contact link | `DS-SELECT-RELATION` — Core contact picker |
| Delete lead | `DS-MODAL` confirm · `DS-BTN-DANGER` |
| Record rules | Own vs all — filter default "My leads" for restricted users |
| Company switch | Reload lists — route unchanged |
| Cross-module | Won → link to Sales quotation — UUID ref only |

---

## 14. Permissions → UI mapping

| Permission | UI effect |
|------------|-----------|
| `crm.access` | Module visible in sidebar |
| `crm.leads.view` | Leads · contacts · companies · activities lists |
| `crm.leads.create` | Create · import · quick action |
| `crm.opportunities.manage` | Pipeline drag · amount edit |
| `crm.pipeline.configure` | Settings sections |

Hide actions user cannot perform — never show disabled.

---

## 15. Menus Spec Index (to create)

| Screen | Route | layout_id | Drawer params |
|--------|-------|-----------|---------------|
| Leads | `/crm/leads` | `LAYOUT-LIST` | create · view · edit |
| Lead detail | (drawer) | `LAYOUT-DETAILS` | view · edit |
| Pipeline | `/crm/pipeline` | `LAYOUT-LIST` | view · edit · create |
| Contacts | `/crm/contacts` | `LAYOUT-LIST` | create · view · edit |
| Companies | `/crm/companies` | `LAYOUT-LIST` | view · edit |
| Dashboard | `/crm/dashboard` | `LAYOUT-DASHBOARD` | — |

Each Menus file must declare: `context_required` · `empty_state` · `loading` · `DS-*` components used.

---

## 16. Compliance Checklist

- [ ] All list screens use `LAYOUT-LIST` + drawer CRUD
- [ ] All components from COMPONENT_UI_BLUEPRINT (`DS-*` / `WS-*`)
- [ ] Dashboard widgets registered in ModuleManifest `dashboard.widgets[]`
- [ ] Quick action Create Lead in manifest
- [ ] Mobile card list fallback on all entity lists
- [ ] AI uses `DS-AI-*` only
- [ ] No custom shell or dashboard grid
- [ ] Contacts/companies use Core — no duplicate CRM contact UI paradigm
- [ ] `UI.md` updated from this blueprint

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 15 — CRM module UI blueprint |

---

**CRM UI Blueprint** — navigation · pages · layouts · components · AI · mobile — design-system compliant.
