# AgainERP — CRM Module Architecture

> **Status:** Approved  
> **Version:** 1.0  
> **Module:** CRM (Customer Intelligence Platform)  
> **Document Type:** Enterprise Architecture  
> **Phase:** Documentation First · UI/UX Planning  
> **Route Namespace:** `/crm/*`  
> **Governance:** [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · **Standards:** [DEVELOPMENT_STANDARDS.md](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md)

## Purpose
CRM module architecture — scope, features, data ownership, and integration boundaries.

## When To Read
Read this file only if working on CRM architecture, features, or module boundaries.

## Related Files
- [Dependencies](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next
- [UI build guides](../../04-uiux/prototype/crm/)

---

**No backend code. No database implementation. No API implementation.**  
This document is the source of truth for **CRM as an independent, AI-first Customer Intelligence Platform** — not a contact list.

### Step 08 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| AI-first CRM · Customer Intelligence Platform | §1 Module Vision |
| Route namespace `/crm/*` | §2 Navigation |
| Dashboard through Settings | §3–§18 |
| Ecommerce, Sales, Purchase, Marketing, Support, AI OS integration | §19 |
| Future industry compatibility | §20 |
| Activity, Approval, Workflow, AI | §15 · §16 · §17 |
| UI/UX (Odoo/Shopify/Notion/Linear blend) | §18 |

**Related:** [PRODUCT_MASTER_ARCHITECTURE.md](../../02-core-platform/subsystems/PRODUCT_MASTER_ARCHITECTURE.md) · [SALES_MODULE_ARCHITECTURE.md](../sales/SALES_MODULE_ARCHITECTURE.md) · [SALES_WORKFLOW.md](../sales/SALES_WORKFLOW.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) · [core/entities/contacts.md](../../02-core-platform/entities/contacts.md) · [MASTER_DATABASE_ARCHITECTURE.md](../../05-development/database/MASTER_DATABASE_ARCHITECTURE.md)

---

## Executive Summary

**CRM** is AgainERP's **relationship intelligence layer** — the system that turns leads, accounts, and opportunities into revenue insight before, during, and after the sale.

| Principle | Rule |
|-----------|------|
| **Not a contact list** | CRM is Customer Intelligence — pipeline, behavior, AI, and revenue context |
| **Independent module** | Full admin UX at `/crm/*` — standalone from Ecommerce and Sales |
| **Core contacts master** | People and organizations via Core `contacts` — no `crm_contacts` duplicate |
| **Sales owns documents** | CRM feeds pipeline; Sales owns quotations, orders, invoices |
| **Marketing owns campaigns** | CRM consumes attribution; Marketing executes automation |
| **AI native** | Lead scoring, churn, forecast, next-best-action on every record |
| **Activity everywhere** | Timeline, chatter, followers, mentions on all CRM entities |
| **Multi-industry** | Retail → Hospital → Real Estate via profiles — not schema forks |

**Table namespace:** `crm_*` · **API base:** `/api/v1/crm/`

---

## 1. Module Vision

### Why CRM Exists as an Independent Module

Customer relationships are not owned by the storefront, the invoice, or the support ticket. They are a **cross-cutting intelligence domain** — who the customer is, how they engage, what they might buy, and whether they will stay.

CRM must work when:

- There is **no Ecommerce** (B2B, field sales, hospital referrals)
- Sales runs formal quote-to-cash at `/sales/*`
- Marketing runs campaigns and nurture flows
- Support handles tickets in Helpdesk
- AI OS scores leads and predicts churn across the platform

```text
                    ┌─────────────────────────────────────┐
                    │      Core Contacts (Single Master)   │
                    │   People · Organizations · Parties   │
                    └─────────────────┬───────────────────┘
                                      │
                    ┌─────────────────▼───────────────────┐
                    │     CRM Module (Customer Intelligence) │
                    │  Leads · Accounts · Opportunities · AI │
                    └───────┬─────────┬─────────┬─────────────┘
                            │         │         │
              ┌─────────────▼──┐ ┌────▼────┐ ┌──▼──────────┐
              │  Sales Module   │ │Marketing│ │  Ecommerce   │
              │  Quote-to-cash  │ │Campaigns│ │  Orders · CX │
              └─────────────┬──┘ └────┬────┘ └──────┬───────┘
                            │         │              │
              ┌─────────────▼─────────▼──────────────▼───────┐
              │  Support · Purchase · AI OS · Product Master  │
              └──────────────────────────────────────────────┘
```

### Vision Statement

> **Know every relationship. Predict every outcome. Act before they ask.**

CRM is the **central relationship management system** — not a spreadsheet of names, but a living intelligence graph of leads, accounts, deals, and customer behavior.

### CRM vs Contact List

| Contact List | Customer Intelligence Platform |
|--------------|----------------------------------|
| Name, phone, email | Lead score, LTV, churn risk, pipeline stage |
| Static record | Activity timeline, AI next action |
| Siloed from orders | Total orders, revenue, last purchase, campaigns |
| Manual follow-up | AI follow-up suggestions, win probability |
| One view | Account hierarchy, multi-contact deals |

### Relationship to Sibling Modules

| Module | CRM Role | CRM Does Not Own |
|--------|----------|------------------|
| **Core contacts** | Party master — people & orgs | — |
| **Sales** | Opportunity → quotation → order link | Quotations, SO, invoices |
| **Ecommerce** | Web leads, order history on timeline | Cart, checkout, storefront |
| **Marketing** | Campaign attribution, nurture triggers | Email send, automation engine |
| **Purchase** | Vendor-side relationships (future B2B) | PO, vendor bills |
| **Support** | Ticket context on account timeline | Ticket workflow |
| **AI OS** | CRM Agent scoring & predictions | Model training infra |

---

## 2. Navigation Structure

**Route namespace:** `/crm/*`

```text
CRM
├── /crm                              Dashboard
├── /crm/leads                        Leads
├── /crm/leads/[id]                   Lead detail
├── /crm/leads/create                 Create lead
├── /crm/contacts                     Contacts (people)
├── /crm/contacts/[id]                Contact detail
├── /crm/accounts                     Accounts (organizations)
├── /crm/accounts/[id]                Account detail
├── /crm/opportunities                Opportunities
├── /crm/opportunities/[id]           Opportunity detail
├── /crm/opportunities/create         Create opportunity
├── /crm/pipelines                    Pipeline configuration
├── /crm/pipelines/[id]             Pipeline board (Kanban)
├── /crm/activities                   Activity hub
├── /crm/tasks                        Tasks
├── /crm/tasks/[id]                   Task detail
├── /crm/meetings                     Meetings
├── /crm/meetings/[id]                Meeting detail
├── /crm/calls                        Calls log
├── /crm/calls/[id]                   Call detail
├── /crm/emails                       Email history
├── /crm/campaigns                    Campaign links (Marketing)
├── /crm/intelligence                 Customer Intelligence Center
├── /crm/intelligence/[contactId]     Customer 360 intelligence view
├── /crm/ai-insights                  AI Insights dashboard
├── /crm/reports                      CRM reports
└── /crm/settings                     Module settings
```

CRM appears as a **top-level sidebar module** — parallel to Sales, Marketing, and Catalog.

---

## 3. Dashboard

**Route:** `/crm/dashboard`

### Purpose

Command center for sales and customer success — pipeline health, lead flow, AI signals, and revenue forecast at a glance.

### KPI Cards

| Widget | Data Source |
|--------|-------------|
| **Total Leads** | `crm_leads` count (active) |
| **New Leads** | Created this period |
| **Open Opportunities** | `crm_opportunities` not won/lost |
| **Won Opportunities** | Closed-won count + value MTD |
| **Lost Opportunities** | Closed-lost count + value MTD |
| **Revenue Forecast** | Σ (amount × probability) weighted pipeline |

### Charts

| Chart | Visualization |
|-------|---------------|
| **Lead Sources** | Donut — web, referral, trade show, partner, ads |
| **Pipeline Value** | Bar by stage — New → Won |
| **Conversion Rate** | Funnel — lead → qualified → opportunity → won |
| **Sales Funnel** | Stacked area — volume by stage over time |

### AI Widgets

| Widget | Agent Capability |
|--------|------------------|
| **Lead Quality Score** | Aggregated score distribution; top hot leads |
| **Churn Risk** | Accounts/contacts flagged at-risk |
| **Revenue Forecast** | AI-adjusted forecast vs rep forecast |
| **Next Best Action** | Queue — call, email, meeting suggestions |

### Quick Actions

- New lead · New opportunity · Log call · Schedule meeting · Open pipeline board

### Design

60% Odoo (KPI cards, smart buttons) · 20% Shopify (clean density) · 10% Notion (timeline preview) · 10% Linear (status pills, keyboard shortcuts)

---

## 4. Leads

**Routes:** `/crm/leads` · `/crm/leads/[id]` · `/crm/leads/create`

**Tables:** `crm_leads`, `crm_lead_sources`, `crm_lead_scores`

### Purpose

Manage **potential customers** before qualification — capture intent, score, assign, and convert.

### Design Rule

Leads may exist **before** a Core contact exists. On conversion, CRM creates or links `contacts` — never duplicates email/phone in a parallel person table.

### Lead Fields

| Field | Notes |
|-------|-------|
| `lead_name` | Person or company name |
| `company` | Organization (pre-account) |
| `phone` | Primary phone |
| `email` | Primary email |
| `source_id` | FK → `crm_lead_sources` |
| `status` | `new`, `contacted`, `qualified`, `unqualified`, `converted`, `lost` |
| `assigned_to` | FK → `users` |
| `lead_score` | Computed 0–100 (AI + rules) |
| `contact_id` | FK → Core contacts (after convert) |
| `account_id` | FK → account profile (optional) |
| `campaign_id` | Marketing attribution (read) |
| `description` | Free text |
| `industry` | For segmentation |

### Lead Sources (Settings)

Web form · Referral · Trade show · Cold call · Partner · Paid ads · Social · Import · API · Walk-in

### Actions

| Action | Result |
|--------|--------|
| **Convert to Contact** | Create/link Core contact; lead → `converted` |
| **Convert to Opportunity** | Contact + opportunity in one flow |
| **Assign** | Reassign owner; notification |
| **Follow Up** | Create task / schedule call |
| **Score refresh** | AI re-score |
| **Merge** | Dedupe duplicate leads |

### Workflow

```text
New → Contacted → Qualified → Converted
              ↘ Unqualified / Lost
```

**Events:** `crm.lead.created` · `crm.lead.converted` · `crm.lead.scored`

---

## 5. Contacts

**Routes:** `/crm/contacts` · `/crm/contacts/[id]`

### Purpose

**Individual people** — buyers, decision makers, patients, parents, agents. CRM view on Core `contacts` where `type = person`.

### Design Rule

**No `crm_contacts` table.** CRM extends Core [contacts](../../02-core-platform/entities/contacts.md) with `crm_contact_profiles` for CRM-specific fields.

**Table:** `crm_contact_profiles`

| Field | Notes |
|-------|-------|
| `contact_id` | FK → Core contacts |
| `position` | Job title |
| `department` | |
| `account_id` | FK → account (organization link) |
| `is_decision_maker` | |
| `preferred_channel` | email, phone, whatsapp |
| `linkedin_url` | |
| `lead_score` | Inherited from lead or computed |
| `lifecycle_stage` | subscriber, lead, MQL, SQL, customer, evangelist |

### Contact Fields (Core + Profile)

| Field | Layer |
|-------|-------|
| Name, phone, email | Core contact |
| Position, department | CRM profile |
| Account link | CRM profile |
| Tags, addresses | Core |

### Tabs (Contact Detail)

| Tab | Content |
|-----|---------|
| **Overview** | Key fields, score, account link, smart buttons |
| **Activities** | Timeline — calls, meetings, tasks, emails |
| **Notes** | Internal notes (Core `notes`) |
| **Attachments** | Proposals, contracts (Core media) |
| **Emails** | Synced / logged email thread |
| **Calls** | Call log with duration, outcome |
| **History** | Stage changes, assignments, AI actions |

### Smart Buttons (Odoo-style)

Orders · Quotations · Opportunities · Tickets · Campaigns · Intelligence 360

---

## 6. Accounts

**Routes:** `/crm/accounts` · `/crm/accounts/[id]`

### Purpose

**Companies and organizations** — B2B accounts, hospital groups, school districts, property developers, restaurant chains.

### Design Rule

Accounts are Core `contacts` where `type = organization`. CRM extends with `crm_account_profiles`.

**Table:** `crm_account_profiles`

| Field | Notes |
|-------|-------|
| `contact_id` | FK → Core contacts (organization) |
| `account_code` | Internal ID |
| `industry` | Retail, healthcare, education, etc. |
| `website` | |
| `employee_count` | Size band |
| `annual_revenue` | Estimated |
| `account_tier` | enterprise, mid-market, smb |
| `parent_account_id` | Hierarchy (holding company) |
| `territory_id` | Sales territory |
| `assigned_to` | Account owner |
| `health_score` | AI account health 0–100 |

### Account Fields

| Field | Source |
|-------|--------|
| Company name | Core contact `name` |
| Industry, website | CRM profile |
| Address | Core `addresses` |
| Contacts | Linked person contacts |
| Opportunities | `crm_opportunities.account_id` |

### Tabs (Account Detail)

| Tab | Content |
|-----|---------|
| **Overview** | Health score, tier, owner, revenue summary |
| **Contacts** | People at this account |
| **Opportunities** | Open and closed deals |
| **Activities** | Account-level timeline |
| **Files** | Contracts, NDAs |
| **History** | Ownership, tier, score changes |
| **Intelligence** | Customer Intelligence Center (§14) |

---

## 7. Opportunities

**Routes:** `/crm/opportunities` · `/crm/opportunities/[id]` · `/crm/opportunities/create`

**Tables:** `crm_opportunities`, `crm_opportunity_items`, `crm_stage_history`

### Purpose

**Potential sales deals** — track value, stage, probability, and expected close through pipeline.

### Opportunity Fields

| Field | Notes |
|-------|-------|
| `opportunity_name` | Deal title |
| `account_id` | FK → account (organization contact) |
| `contact_id` | Primary contact (person) |
| `amount` | Expected revenue |
| `currency_code` | |
| `stage_id` | FK → `crm_stages` |
| `probability` | 0–100% (stage default or override) |
| `expected_close_date` | |
| `pipeline_id` | FK → `crm_pipelines` |
| `assigned_to` | Owner |
| `source_id` | Lead source attribution |
| `lost_reason_id` | If lost |
| `sales_quotation_id` | Link to Sales quote (optional) |
| `sales_order_id` | Link to Sales order (optional) |
| `description` | |

### Pipeline Stages (Default)

```text
New
  ↓
Qualified
  ↓
Proposal
  ↓
Negotiation
  ↓
Won
```

**Lost branch:**

```text
Qualified (or any stage)
  ↓
Lost
```

| Stage | Default Probability |
|-------|----------------------|
| New | 10% |
| Qualified | 25% |
| Proposal | 50% |
| Negotiation | 75% |
| Won | 100% |
| Lost | 0% |

### Opportunity Line Items

**Table:** `crm_opportunity_items`

| Field | Notes |
|-------|-------|
| `variant_id` | Product Master link |
| `quantity` | |
| `unit_price` | |
| `discount` | |

### Actions

- Move stage (Kanban drag) · Create quotation · Log activity · Win / Lose · Clone · Activity drawer

### Events

`crm.opportunity.created` · `crm.opportunity.stage_changed` · `crm.opportunity.won` · `crm.opportunity.lost`

**Sales handoff:** Won → `sales_quotations.crm_opportunity_id` · Invoice posted → opportunity metrics updated

---

## 8. Pipelines

**Routes:** `/crm/pipelines` · `/crm/pipelines/[id]`

**Tables:** `crm_pipelines`, `crm_stages`, `crm_stage_rules`

### Purpose

Configure **multiple pipelines** with custom stages, probabilities, and automation rules per business line.

### Features

| Feature | Description |
|---------|-------------|
| **Multiple pipelines** | Retail, Enterprise, Partner, Hospital admissions |
| **Drag & drop stages** | Reorder stages in settings |
| **Custom stages** | Add/remove per pipeline |
| **Stage rules** | Required fields, approval gates, auto-tasks |
| **Kanban board** | `/crm/pipelines/[id]` — opportunities by stage |
| **Forecast category** | Pipeline, best case, commit, closed |

### Example Pipelines

| Pipeline | Stages | Use Case |
|----------|--------|----------|
| **Retail Sales** | New → Contacted → Quote → Won/Lost | B2C / wholesale |
| **Enterprise Sales** | Discovery → POC → Proposal → Legal → Won | B2B long cycle |
| **Partner Sales** | Registered → Certified → First Deal → Active | Channel partners |
| **Hospital CRM** | Referral → Consult → Admission → Discharged | Patient intake (future profile) |
| **Real Estate CRM** | Inquiry → Viewing → Offer → Closed | Property sales (future profile) |

### Stage Rules (Examples)

| Rule | Trigger |
|------|---------|
| Require amount before Proposal | Stage enter guard |
| Manager approval > ৳500K | Negotiation → Won |
| Auto-create follow-up task | Enter Qualified |
| Block Won without quotation link | Policy (Sales integration) |

---

## 9. Activities

**Route:** `/crm/activities`

Integrates [Activity & Chatter Architecture](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md).

### Purpose

Unified **activity hub** — calls, meetings, emails, tasks, notes across all CRM entities.

### Activity Types

| Type | Entity | Route |
|------|--------|-------|
| **Calls** | `crm:calls` or Core activity | `/crm/calls` |
| **Meetings** | `crm:meetings` | `/crm/meetings` |
| **Emails** | Logged email | `/crm/emails` |
| **Tasks** | `crm:tasks` | `/crm/tasks` |
| **Notes** | Core `notes` | On record tabs |

### Activity Timeline (Required)

Every lead, contact, account, and opportunity has:

- Chronological timeline (newest first)
- Filter by type, user, date range
- Inline compose — log call, add note, create task
- @mentions and followers
- AI action entries

### Entity Activity IDs

| Entity | Pattern |
|--------|---------|
| Lead | `crm:lead:{id}` |
| Contact | `crm:contact:{contact_id}` |
| Account | `crm:account:{contact_id}` |
| Opportunity | `crm:opportunity:{id}` |
| Task | `crm:task:{id}` |
| Meeting | `crm:meeting:{id}` |
| Call | `crm:call:{id}` |

### Tracked Events

| Event | Activity Type |
|-------|---------------|
| Create / update / delete | `create` / `update` / `delete` |
| Assignment change | `assignment_change` |
| Stage change | `status_change` |
| AI action | `ai_action` |
| Email logged | `email` |
| Call logged | `call` |
| Meeting held | `meeting` |

---

## 10. Tasks

**Routes:** `/crm/tasks` · `/crm/tasks/[id]`

**Table:** `crm_tasks` (or Core activities with `type = task`)

### Fields

| Field | Notes |
|-------|-------|
| `subject` | Task title |
| `description` | |
| `priority` | `low`, `normal`, `high`, `urgent` |
| `due_date` | |
| `assigned_user_id` | |
| `status` | See below |
| `related_type` | lead, contact, account, opportunity |
| `related_id` | Polymorphic FK |
| `completed_at` | |

### Statuses

```text
Pending → In Progress → Completed
              ↓
          Cancelled
```

| Status | Code |
|--------|------|
| Pending | `pending` |
| In Progress | `in_progress` |
| Completed | `completed` |
| Cancelled | `cancelled` |

### Features

- My tasks dashboard widget · Team task board · Overdue alerts · AI-suggested follow-up tasks

---

## 11. Meetings

**Routes:** `/crm/meetings` · `/crm/meetings/[id]`

**Table:** `crm_meetings`

### Fields

| Field | Notes |
|-------|-------|
| `subject` | |
| `participants[]` | Contact IDs + user IDs |
| `start_at` | Date/time |
| `duration_minutes` | |
| `location` | Physical or video link |
| `notes` | Outcome summary |
| `related_opportunity_id` | Optional |
| `calendar_sync_id` | Future Google/Outlook |

### Views

| View | Description |
|------|-------------|
| **Calendar view** | Month/week/day grid |
| **Timeline view** | Chronological list with filters |
| **Agenda list** | Upcoming meetings queue |

---

## 12. Calls

**Routes:** `/crm/calls` · `/crm/calls/[id]`

**Table:** `crm_calls`

### Fields

| Field | Notes |
|-------|-------|
| `direction` | `incoming`, `outgoing` |
| `contact_id` | |
| `phone_number` | |
| `duration_seconds` | |
| `notes` | Call summary |
| `outcome` | connected, voicemail, no_answer, busy |
| `follow_up_date` | Next action |
| `assigned_user_id` | Caller |
| `recording_attachment_id` | Optional (policy) |

### Features

- Click-to-call integration (future) · Call queue from AI next-best-action · Log from mobile

---

## 13. Emails

**Route:** `/crm/emails`

### Purpose

Email history, templates, and campaign tracking — **send execution** lives in Marketing; CRM logs and displays.

### Support

| Feature | Owner |
|---------|-------|
| **Email history** | CRM log (sync or manual) |
| **Templates** | Marketing templates; CRM insert |
| **Campaign tracking** | Marketing campaign ID on thread |
| **Open/click stats** | Marketing analytics → CRM timeline |

### Integration

```text
Marketing sends campaign
     ↓
crm.emails linked to contact/account
     ↓
Activity timeline: email opened, clicked
     ↓
AI: adjust lead score, suggest follow-up
```

---

## 14. Campaigns Integration

**Route:** `/crm/campaigns` (read-centric; config in Marketing)

### Purpose

Connect CRM records to **Marketing Module** campaigns — attribution, nurture, automation.

### Support

| Capability | Integration |
|------------|-------------|
| **Email campaigns** | Lead/contact source = campaign |
| **SMS campaigns** | Bangladesh: SMS gateway via Marketing |
| **Lead nurturing** | Stage triggers from Marketing automation |
| **Automation** | MQL → SQL rules; win-back flows |
| **UTM attribution** | Web lead source mapping |
| **Segment sync** | CRM segment → Marketing audience |

### CRM Displays

- Campaign name on lead/opportunity · Emails sent/opened · Conversion to opportunity · Revenue attributed

**Marketing owns execution; CRM owns relationship context.**

---

## 15. Customer Intelligence Center

**Routes:** `/crm/intelligence` · `/crm/intelligence/[contactId]`

### Purpose

**360° customer intelligence** — not a contact card, but a revenue and behavior command view per contact/account.

### Each Profile Displays

| Metric | Source |
|--------|--------|
| **Total orders** | Sales / Ecommerce orders |
| **Total revenue** | Invoices / commerce payments |
| **Last purchase** | Most recent order date + amount |
| **Lifetime value (LTV)** | Computed revenue − returns |
| **Open opportunities** | `crm_opportunities` open |
| **Activities** | Timeline count, last touch |
| **Marketing history** | Campaigns, email engagement |
| **Support tickets** | Helpdesk (future) open count |
| **Lead score / health** | AI + rules |
| **Churn risk** | AI score |
| **Payment behavior** | Avg days to pay, overdue |
| **Product affinities** | Top SKUs purchased |
| **Segment tags** | Marketing + CRM segments |

### Intelligence Layout

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Account: Acme Corp          Health: 82 ●        Churn Risk: Low         │
├─────────────────────────────────────────────────────────────────────────┤
│ LTV ৳2.4M │ Orders 47 │ Last Purchase 12d │ Open Opp ৳850K │ Score 78  │
├──────────────────────────────────┬──────────────────────────────────────┤
│ Revenue trend (12mo)             │ AI Next Best Action                  │
│ Product affinity chart           │ "Schedule QBR — contract renew 45d"  │
├──────────────────────────────────┴──────────────────────────────────────┤
│ Activity timeline · Opportunities · Orders · Campaigns · Support        │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Contract

CRM **aggregates read-only** from Sales, Ecommerce, Marketing, Finance APIs — never duplicates transactional tables.

---

## 16. AI CRM Agent

**Route:** `/crm/ai-insights` · embedded panel on record detail

Integrates [AI OS Architecture](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md).

### Agent: CRM Agent

| Responsibility | Input | Output |
|----------------|-------|--------|
| **Lead scoring** | Source, behavior, firmographics, engagement | Score 0–100 + tier |
| **Opportunity prediction** | Stage history, deal size, rep win rate | Win probability % |
| **Churn prediction** | Recency, support tickets, payment delays | Risk score + drivers |
| **Customer segmentation** | RFM, industry, product mix | Segment label |
| **Revenue forecasting** | Pipeline × probability + AI adjustment | Forecast by period |
| **Follow-up suggestions** | Last activity, stage, SLA | Task/call/email draft |
| **Next best action** | Full customer context | Ranked action queue |
| **Email draft** | Opportunity context, tone | Suggested email body |
| **Duplicate detection** | Email, phone, company | Merge suggestion |

### AI Governance

1. **Suggest → Review → Apply** — no silent stage changes
2. All runs in Activity `AI Actions` tab
3. Lead score changes logged with model version
4. High-value opportunity AI win % — rep can override
5. Tenant AI budget via Control Center

### Data Flow

```text
crm_leads + crm_opportunities + contacts + orders + marketing events
     ↓
AI Context Engine
     ↓
CRM Agent
     ↓
Insight Queue (/crm/ai-insights + record side panel)
     ↓
Human apply → score update / task create / stage hint
```

**Prototype:** [ui-prototype/ai-os/AiSalesForecast.md](../../04-uiux/prototype/ai-os/AiSalesForecast.md)

---

## 17. Activity Integration

Every CRM record integrates [Activity & Chatter Architecture](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md).

### Required on Every Entity

| Capability | Supported |
|------------|-----------|
| Activities | ✓ Timeline |
| Comments | ✓ Chatter thread |
| Notes | ✓ Internal notes |
| Attachments | ✓ Core media |
| Followers | ✓ Watch record |
| Mentions | ✓ @user in comment |
| AI Actions | ✓ Agent log |
| History | ✓ Audit trail |

### Tracked Operations

| Operation | Activity Type |
|-----------|---------------|
| Create | `create` |
| Update | `update` |
| Delete | `delete` (soft) |
| Assignment | `assignment_change` |
| Stage change | `status_change` |
| AI action | `ai_action` |
| Email / call / meeting | Type-specific |

### UI Pattern

- **List pages** — Activity icon → Global Activity Drawer
- **Kanban card** — Last activity preview
- **Intelligence 360** — Full timeline + AI tab
- **Opportunity detail** — Chatter sidebar (collapsible)

---

## 18. Approval Integration

Integrates [Approval Engine](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) and [Workflow Engine](../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md).

### Approval Points

| Document | Trigger | Policy |
|----------|---------|--------|
| **Opportunity Won** | Stage → Won | Amount threshold |
| **Discount on opportunity** | Line discount | Sales manager |
| **Lead assignment override** | Territory breach | Sales ops |
| **Account tier change** | Manual tier upgrade | Manager |
| **Pipeline stage skip** | Jump stages | Admin approval |
| **Bulk lead import** | Import > N records | Data admin |

### Workflow Examples

| Workflow ID | States |
|-------------|--------|
| `crm.lead` | new → contacted → qualified → converted / lost |
| `crm.opportunity` | stage transitions per pipeline |
| `crm.task` | pending → in_progress → completed |

**Doc:** [SALES_WORKFLOW.md](../sales/SALES_WORKFLOW.md) for Sales handoff workflows

---

## 19. Permissions

Namespace: `crm.*`

| Permission | Description |
|------------|-------------|
| `crm.access` | Module access |
| `crm.view` | View all CRM records |
| `crm.create` | Create leads, contacts, opportunities |
| `crm.edit` | Edit records |
| `crm.delete` | Soft delete |
| `crm.assign` | Reassign owner |
| `crm.approve` | Approve stage/amount gates |
| `crm.export` | Export lists |
| `crm.import` | Bulk import leads |
| `crm.pipeline.configure` | Edit pipelines/stages |
| `crm.leads.view` | View leads |
| `crm.leads.create` | Create leads |
| `crm.leads.convert` | Convert to contact/opportunity |
| `crm.contacts.view` | View contacts |
| `crm.contacts.write` | Edit CRM contact profile |
| `crm.accounts.view` | View accounts |
| `crm.accounts.write` | Edit account profile |
| `crm.opportunities.view` | View opportunities |
| `crm.opportunities.manage` | Edit amount, stage |
| `crm.opportunities.win` | Mark won/lost |
| `crm.activities.view` | View activities |
| `crm.activities.create` | Log call, meeting, task |
| `crm.tasks.manage` | Full task CRUD |
| `crm.intelligence.view` | Customer Intelligence Center |
| `crm.reports.view` | Reports |
| `crm.settings.edit` | Settings |
| `crm.ai.apply` | Apply AI suggestions |

### Record Rules

- **Own records:** `assigned_to = current_user`
- **Team/territory:** `territory_id IN user.territories`
- **Manager:** team rollup visibility

---

## 20. Reports

**Route:** `/crm/reports`

| Report | Description |
|--------|-------------|
| **Lead report** | By source, status, owner, score band |
| **Opportunity report** | Pipeline value, stage aging |
| **Conversion report** | Lead → opp → won rates |
| **Revenue forecast report** | Weighted pipeline by period |
| **Activity report** | Calls, meetings, tasks per rep |
| **Sales funnel report** | Stage conversion waterfall |
| **Win/loss report** | By reason, competitor, product |
| **Lead source ROI** | Source vs revenue closed |
| **Account health report** | Health score distribution |
| **Churn risk report** | At-risk accounts list |
| **Rep performance** | Activities, wins, forecast accuracy |
| **Campaign attribution** | Marketing → pipeline → revenue |

Reports read from `crm_*` + aggregated APIs from Sales/Ecommerce/Marketing.

---

## 21. Settings

**Route:** `/crm/settings`

Integrates with [SETTINGS_ARCHITECTURE.md](../../02-core-platform/subsystems/SETTINGS_ARCHITECTURE.md) where appropriate.

| Group | Settings |
|-------|----------|
| **Lead sources** | CRUD sources, default, UTM mapping |
| **Lead scoring rules** | Rule builder + AI weight |
| **Opportunity stages** | Per pipeline (or link to Pipelines UI) |
| **Pipeline rules** | Required fields, probabilities, automation |
| **Activity types** | Custom activity types, icons |
| **Automation rules** | Stage enter → task, email, notification |
| **Territories** | Geographic/account assignment |
| **SLA rules** | Lead response time, follow-up overdue |
| **Duplicate rules** | Match on email, phone, company |
| **Integration** | Sales sync, Marketing sync, Ecommerce webhooks |
| **AI** | Score model, churn threshold, forecast horizon |
| **Notifications** | Assignment, stage change, SLA breach |

Settings changes tracked via Activity on `settings:crm` entity.

---

## 22. UI/UX Design

### Design Blend

| Weight | Source | Applied To |
|--------|--------|------------|
| **60%** | Odoo | Smart buttons, Kanban pipeline, form layout, KPI dashboard |
| **20%** | Shopify | List density, clean cards, quick filters |
| **10%** | Notion | Timeline, notes, relationship context |
| **10%** | Linear | Status pills, keyboard shortcuts, command palette |

### Requirements

| Requirement | Implementation |
|-------------|------------------|
| **AG Grid** | Leads, contacts, accounts, opportunities lists |
| **Kanban view** | Pipeline board — drag stage |
| **Timeline view** | Activities, meetings, account history |
| **Activity drawer** | Global right drawer on all records |
| **AI side panel** | Collapsible insights on lead/opp/account |
| **Global search** | Leads, contacts, accounts, opportunities indexed |
| **Bulk actions** | Assign, tag, export, stage move (with approval) |

### Key Screens

#### Pipeline Kanban (`/crm/pipelines/[id]`)

```text
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│   New    │Qualified │ Proposal │Negotiation│   Won    │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│ [Card]   │ [Card]   │ [Card]   │          │          │
│ Acme ৳850K│ Beta ৳120K│          │          │          │
│ Score 78 │          │          │          │          │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

#### Opportunity Detail

- Header: stage pill, amount, probability, close date
- Smart buttons: Quotation, Order, Activities, Intelligence
- Body: lines, contacts, chatter
- AI panel: win %, next action

#### Customer Intelligence (`/crm/intelligence/[id]`)

- Hero metrics strip · Charts · Timeline · AI recommendations

**Existing patterns:** [SALES_MODULE_ARCHITECTURE.md §17](../sales/SALES_MODULE_ARCHITECTURE.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md)

---

## 23. Module Integrations

### Ecommerce

| Direction | Integration |
|-----------|-------------|
| Ecommerce → CRM | Web form → `crm.lead.created`; order → timeline |
| CRM → Ecommerce | Segment export for personalization (future) |

### Sales

| Direction | Integration |
|-----------|-------------|
| CRM → Sales | Won opp → `sales_quotations.crm_opportunity_id` |
| Sales → CRM | Quote sent/accepted, invoice posted → stage update |
| Shared | Core `contacts`; no duplicate customer |

**Doc:** [SALES_MODULE_ARCHITECTURE.md §19](../sales/SALES_MODULE_ARCHITECTURE.md) · [SALES_WORKFLOW.md](../sales/SALES_WORKFLOW.md)

### Purchase

| Integration | Use Case |
|-------------|----------|
| Vendor as account | B2B supplier relationship (future) |
| Partner leads | Purchase partner referral pipeline |

### Marketing

| Direction | Integration |
|-----------|-------------|
| Marketing → CRM | Campaign attribution on leads |
| CRM → Marketing | MQL/SQL triggers, segments |
| Shared | Contact record, email engagement |

**Doc:** [MARKETING_MODULE_ARCHITECTURE.md §Appendix A](../marketing/MARKETING_MODULE_ARCHITECTURE.md)

### Support (Helpdesk)

| Integration | Use Case |
|-------------|----------|
| Tickets on timeline | Account/contact 360 |
| Churn signal | Open ticket count → AI risk |

### AI OS

| Integration | Use Case |
|-------------|----------|
| CRM Agent | Scoring, forecast, NBA |
| Shared context | Product Master, orders, activities |
| Audit | All AI runs in Activity |

### Inventory / Product Master

| Integration | Use Case |
|-------------|----------|
| Opportunity lines | `variant_id` on `crm_opportunity_items` |
| Product affinity | Intelligence Center top SKUs |

---

## 24. Future Compatibility

Must support **without architecture changes** — via profiles, pipeline templates, and industry metadata.

| Industry | CRM Adaptation |
|----------|----------------|
| **Ecommerce** | Web leads, order LTV, cart abandon signals |
| **Sales** | B2B pipeline, quotation link |
| **Marketing** | Campaign attribution, nurture |
| **Support** | Ticket timeline, CSAT on account |
| **Hospital CRM** | Patient referral pipeline, provider accounts |
| **School CRM** | Parent/student contacts, enrollment opp |
| **Real Estate CRM** | Property listings on opp, viewing stage |
| **Manufacturing CRM** | RFQ pipeline, distributor accounts |
| **NGO CRM** | Donor accounts, grant opportunities |
| **Restaurant CRM** | Franchise accounts, catering deals |

### Extension Pattern

```text
Core contacts (person | organization)
     +
crm_account_profiles / crm_contact_profiles
     +
Industry profile metadata (hospital_patient_ref, property_id, etc.)
     +
Pipeline template (Hospital Admissions, Property Sales, …)
```

No `hospital_contacts` or `school_leads` tables — industry via **profile + pipeline + custom fields**.

---

## Architecture Rules

| # | Rule |
|---|------|
| 1 | **Standalone module** — full UX at `/crm/*` |
| 2 | **Customer Intelligence First** — not a contact list |
| 3 | **Core contacts master** — no duplicate person/org tables |
| 4 | **Sales owns revenue documents** — CRM owns pipeline |
| 5 | **Marketing owns campaign execution** — CRM owns attribution |
| 6 | **AI enabled** — CRM Agent on all key records |
| 7 | **Activity enabled** — timeline, chatter, followers on everything |
| 8 | **Approval enabled** — stage gates, amount thresholds |
| 9 | **Workflow enabled** — lead and opportunity state machines |
| 10 | **Multi-industry ready** — profiles and pipelines, not schema forks |
| 11 | **Future proof** — aggregate APIs from Sales/Ecommerce, don't duplicate |
| 12 | **Event driven** — `crm.*` domain events |
| 13 | **API first** — `/api/v1/crm/` |
| 14 | **Documentation before code** — [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) |

### Anti-Patterns (Forbidden)

```text
❌ crm_contacts duplicating Core contacts
❌ crm_customers parallel to ecommerce customers
❌ CRM owning quotations, orders, invoices
❌ Marketing send engine inside CRM
❌ Per-industry lead tables (hospital_leads, school_leads)
❌ Static contact list as primary UI
❌ AI auto-moving opportunities without policy
```

---

## Appendix A — Database Tables (Planned)

| Table | Purpose |
|-------|---------|
| `crm_pipelines` | Pipeline definitions |
| `crm_stages` | Stages per pipeline |
| `crm_stage_rules` | Guards and automation |
| `crm_lead_sources` | Source catalog |
| `crm_leads` | Unqualified prospects |
| `crm_lead_scores` | Score history |
| `crm_contact_profiles` | CRM extension on person contacts |
| `crm_account_profiles` | CRM extension on org contacts |
| `crm_opportunities` | Deals in pipeline |
| `crm_opportunity_items` | Product lines on deal |
| `crm_stage_history` | Stage audit |
| `crm_lost_reasons` | Loss reason codes |
| `crm_tasks` | Tasks (or Core activities) |
| `crm_meetings` | Meetings |
| `crm_calls` | Call log |
| `crm_email_logs` | Logged email threads |
| `crm_territories` | Sales territories |

Optional links: `sales_quotations.crm_opportunity_id`, `commerce_orders` timeline read

---

## Appendix B — Domain Events

| Event | Subscribers |
|-------|-------------|
| `crm.lead.created` | Marketing, Analytics, AI Agent |
| `crm.lead.scored` | Dashboard, Notifications |
| `crm.lead.converted` | Sales, Marketing |
| `crm.opportunity.created` | Analytics, Notifications |
| `crm.opportunity.stage_changed` | Forecast, Sales, AI |
| `crm.opportunity.won` | **Sales** (suggest quote), Analytics |
| `crm.opportunity.lost` | Analytics, Marketing (win-back) |
| `crm.task.completed` | Activity, SLA |
| `crm.account.health_changed` | AI, Notifications |

### Subscribed Events

| Event | Source | CRM Action |
|-------|--------|------------|
| `commerce.order.placed` | Orders | Timeline + upsell signal |
| `sales.quotation.sent` | Sales | Opp stage → Proposal |
| `sales.quotation.accepted` | Sales | Opp stage hint → Negotiation |
| `sales.invoice.posted` | Sales | Opp → Won; LTV update |
| `marketing.email.opened` | Marketing | Lead score bump |
| `core.contact.registered` | Core | Optional auto-lead |

---

## Appendix C — API Surface (Planned)

Base: `/api/v1/crm/`

| Group | Endpoints |
|-------|-----------|
| Leads | `GET/POST /leads`, `POST /leads/{id}/convert`, `POST /leads/{id}/score` |
| Contacts | `GET/PATCH /contacts/{id}/profile` |
| Accounts | `GET/PATCH /accounts/{id}/profile` |
| Opportunities | `GET/POST /opportunities`, `PATCH /opportunities/{id}/stage` |
| Pipelines | `GET/POST /pipelines`, `GET /pipelines/{id}/board` |
| Activities | `GET/POST /activities`, `GET /activities/timeline` |
| Tasks | `GET/POST /tasks`, `PATCH /tasks/{id}/complete` |
| Meetings | `GET/POST /meetings` |
| Calls | `GET/POST /calls` |
| Intelligence | `GET /intelligence/{contactId}` |
| Reports | `GET /reports/funnel`, `GET /reports/forecast` |
| AI | `GET /ai/insights`, `POST /ai/apply` |

---

## Appendix D — Related Documents

| Document | Relationship |
|----------|--------------|
| [SALES_MODULE_ARCHITECTURE.md](../sales/SALES_MODULE_ARCHITECTURE.md) | Quote-to-cash handoff |
| [SALES_WORKFLOW.md](../sales/SALES_WORKFLOW.md) | Quotation/opportunity workflows |
| [PRODUCT_MASTER_ARCHITECTURE.md](../../02-core-platform/subsystems/PRODUCT_MASTER_ARCHITECTURE.md) | Opportunity line products |
| [modules/ecommerce/orders/ARCHITECTURE.md](../ecommerce/orders/ARCHITECTURE.md) | Order history on timeline |
| [modules/ecommerce/customers/ARCHITECTURE.md](../ecommerce/customers/ARCHITECTURE.md) | Customer 360 overlap |
| [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) | Activity platform |
| [core/entities/contacts.md](../../02-core-platform/entities/contacts.md) | Contact master |
| [modules/ai/AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) | CRM Agent platform |
| [Architecture.md](./Architecture.md) | Legacy draft |

---

## Document Control

| Field | Value |
|-------|-------|
| **Owner** | Platform Team · CRM Domain |
| **Reviewers** | Architecture, Sales, Marketing, AI |
| **Next Review** | At database implementation gate |
| **Status Gate** | Documentation First — Ready for UI/UX Planning |

**Changelog:** [CHANGELOG.md](../../00-foundation/CHANGELOG.md)
