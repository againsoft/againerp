# AgainERP — AI Admin Experience

> **Status:** Vision (Foundational)  
> **Version:** 1.0  
> **Date:** 2026-06-14  
> **Document Type:** Admin UX Design Specification  
> **Audience:** Product, design, engineering, AI agents  
> **Parent:** [01_AI_COMMERCE_OS_VISION.md](./01_AI_COMMERCE_OS_VISION.md)  
> **Related:** [02_AI_USER_EXPERIENCE.md](./02_AI_USER_EXPERIENCE.md)  
> **Replaces:** Traditional sidebar-first admin as the default merchant experience

**The AgainERP admin is not a dashboard with AI attached.**  
**The admin is an AI Command Center with precision tools available on demand.**

---

## Design Thesis

Traditional ecommerce admin optimizes for **navigation** — deep sidebars, nested settings, module silos. AgainERP admin optimizes for **operation** — one home screen where the merchant states intent and the OS executes.

| Traditional admin | AI-first admin |
|-------------------|----------------|
| Sidebar with 40+ links | Collapsed nav; Command Center is home |
| Widget dashboard | AI Business Insights + Suggestions |
| Settings scattered across modules | Policies managed via conversation or Automation Center |
| User learns the software | Software learns the business |

Sidebars, grids, and settings forms are **minimized by default** — not removed. They live in **Advanced Manual Mode** for power users, auditors, and edge cases.

---

## Admin Modes

Every merchant chooses how much traditional UI they see. Mode is a **user preference**, not a product tier.

### Simple Mode (default)

**For:** Solo founders, small teams, first-time merchants.

| Aspect | Behavior |
|--------|----------|
| **Home** | Greeting + Command Box + Suggestions + top 3 insights |
| **Navigation** | No persistent sidebar; `Cmd+K` and Command Box only |
| **Settings** | Conversational — *"Change return policy to 7 days"* |
| **Records** | Opened from chat, tasks, or search — never browsed by menu |
| **Grids/forms** | Hidden unless user says *"Open product list"* or taps "Edit manually" |

```
┌──────────────────────────────────────────────────────────────┐
│  AgainERP                              [Tasks] [🔔] [Riyad]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│           Good Morning, Riyad ☀️                             │
│           What would you like to do today?                   │
│                                                              │
│   ┌────────────────────────────────────────────────────┐    │
│   │  Ask anything — create, fix, analyze, automate…     │    │
│   └────────────────────────────────────────────────────┘    │
│                                                              │
│   💡 Suggestions                                             │
│   · 3 orders need attention                                  │
│   · Generate SEO for 12 new products                         │
│   · Weekend sale collection not started                      │
│                                                              │
│   📊 Today at a glance                                       │
│   Revenue ৳42k · Orders 28 · SLA 96%                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Advanced Mode

**For:** Operations managers, agencies, integrators, data-heavy workflows.

| Aspect | Behavior |
|--------|----------|
| **Home** | Command Center + expanded insights panel + Activity Feed rail |
| **Navigation** | Slim icon sidebar — modules on demand |
| **Settings** | Full settings forms in Settings zone |
| **Records** | Grids, live edit, bulk export always one click away |
| **AI** | Command Box remains primary; sidebar is secondary |

### Hybrid Mode (recommended for growing teams)

**For:** Teams mixing AI-first owners with manual-first operators.

| Aspect | Behavior |
|--------|----------|
| **Home** | Same Command Center as Simple Mode |
| **Navigation** | Collapsible sidebar — collapsed by default, pin to expand |
| **Per-role** | Owners default Simple; Operators default Advanced |
| **Handoff** | AI tasks assignable to users who work in grids |
| **Unified** | Same Task Queue and Approval inbox for all modes |

### Mode comparison

| Capability | Simple | Hybrid | Advanced |
|------------|--------|--------|----------|
| Command Center home | ✓ | ✓ | ✓ |
| Persistent sidebar | — | Collapsible | Slim always |
| Settings via chat | Primary | Primary | Optional |
| AG Grid module pages | On request | One click | Always available |
| AI Suggestions | ✓ | ✓ | ✓ |
| Automation Center | Simplified | Full | Full |
| Keyboard power user | `Cmd+K` | `Cmd+K` + shortcuts | Full shortcut map |

### Mode switching

```
Avatar → Admin Experience → Simple | Hybrid | Advanced
```

Switching is instant; layout persists per user. Company admin can set **default mode for new users** by role.

---

## 1. AI Command Center

The **AI Command Center** is the admin home screen and default route after authentication (`/dashboard` → Command Center, not widget dashboard).

### Home screen anatomy

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [≡]  AgainERP          [🔍 Search]     [Tasks 4]  [🔔 2]  [Riyad ▾]    │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                         Good Morning, Riyad                              │
│                    What would you like to do today?                      │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  ✨  Create a campaign · Fix late orders · Build homepage…    [⏎] │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│       [📎 Attach]  [🎤 Voice]  [ / commands ]                            │
│                                                                          │
├───────────────────────────────┬──────────────────────────────────────────┤
│  Active thread (if any)       │  Right rail (Hybrid/Advanced)            │
│  ─────────────────────        │  ─────────────────────────────           │
│  Conversation continues here  │  · Pending approvals (2)                 │
│  after first command          │  · Running jobs (1)                    │
│                               │  · Top insight                           │
├───────────────────────────────┴──────────────────────────────────────────┤
│  Suggestions (scroll)  ·  Insights chips  ·  Recent threads              │
└──────────────────────────────────────────────────────────────────────────┘
```

### Greeting system

| Input | Output |
|-------|--------|
| Time of day | Good morning / afternoon / evening |
| User first name | From profile — "Riyad" |
| Context line | Optional second line: *"4 items need you today"* |
| Locale | Bangla or English per user preference |

**Examples:**

- `Good Morning, Riyad` + `What would you like to do today?`
- `শুভ সকাল, রিয়াদ` + `আজ কী করতে চান?`

### Command Box specification

| Property | Spec |
|----------|------|
| **Placeholder** | Rotating examples: *"Create a laptop category"*, *"Show today's orders"* |
| **Min height** | 1 line; expands to 4 lines |
| **Submit** | Enter or button; Shift+Enter = newline |
| **Empty state** | Suggestions + starter prompts below |
| **Active state** | Thread opens inline below box; page does not navigate away |
| **History** | Up arrow recalls previous commands |

### Command Center zones

| Zone | Simple Mode | Advanced Mode |
|------|-------------|---------------|
| Greeting + Command Box | Always visible | Always visible |
| Active thread | Expands below | Left column |
| Suggestions strip | Below command | Below command |
| Insights chips | 3–5 KPIs | Full AI Dashboard panel |
| Right rail | Hidden | Tasks + approvals + feed |
| Sidebar | Hidden | Icon rail |

### Header chrome (minimal)

Traditional admin header is reduced to five elements:

1. **Menu toggle** — only Hybrid/Advanced; opens sidebar drawer
2. **Logo** — links to Command Center
3. **Global search** — records, commands, help
4. **Tasks + Notifications** — badges with counts
5. **Avatar menu** — profile, mode switch, sign out

**Removed from default header:** module breadcrumbs, redundant "Dashboard" link, settings gear (settings via command or avatar).

### Routing

| Route | Resolves to |
|-------|-------------|
| `/dashboard` | AI Command Center (home) |
| `/dashboard/thread/{id}` | Command Center with thread loaded |
| `/catalog/products` | Manual module — Advanced/Hybrid or explicit navigation |
| `/settings/*` | Advanced Manual Mode settings zone |

---

## 2. AI Dashboard

The traditional widget dashboard is **replaced** by an AI-native dashboard that answers *"How is my business?"* without configuring charts.

### Philosophy

| Old dashboard | AI Dashboard |
|---------------|--------------|
| User arranges widgets | OS selects relevant metrics |
| Static charts | Narrative + drill-down |
| Shows everything | Shows what matters today |
| No action | Every insight links to a command |

### Dashboard layers

#### Layer 1 — At a glance (all modes)

Inline chips below Command Box:

```
Revenue ৳42k ↑8%  ·  Orders 28  ·  SLA 96%  ·  Low stock 3  ·  Pending approval 2
```

Tap any chip → expands insight or opens pre-filled command.

#### Layer 2 — AI narrative (Hybrid/Advanced)

```
┌─────────────────────────────────────────────────────────────┐
│ 📊 Today's Brief · Analytics Agent              [Pin] [Share]│
│ Revenue is up 8% vs yesterday, driven by Laptops (+22%).    │
│ Watch: 3 bestsellers under 10 units. Cart abandonment      │
│ rose slightly — Marketing Agent suggests a recovery flow.  │
│ [Reorder stock]  [Create campaign]  [See full report]      │
└─────────────────────────────────────────────────────────────┘
```

#### Layer 3 — Deep dive (on demand)

User asks *"Show me sales breakdown"* → inline chart + table + export — not a separate Reports module landing.

### Dashboard time scopes

| Scope | Trigger |
|-------|---------|
| **Today** | Default on home |
| **Week / Month** | *"How did we do this week?"* |
| **Compare** | *"Compare to last Eid"* |
| **Forecast** | *"Project revenue next 30 days"* |

### Customization

| Simple | Advanced |
|--------|----------|
| Pin up to 3 insight cards | Pin metrics; save custom brief schedule |
| No widget editor | Optional "Add metric" via command |

*No widget drag-and-drop builder* — customization is conversational: *"Always show margin on my home brief"*.

---

## 3. AI Workspace

The **AI Workspace** is the admin shell that holds active work — threads, previews, artifacts, and manual editors — without losing Command Center context.

### Workspace states

| State | UI |
|-------|-----|
| **Idle** | Home screen only — greeting + command box |
| **Conversing** | Thread panel expanded below command box |
| **Split** | Thread left + context/diff right (tablet/desktop) |
| **Precision** | Form or grid slide-over; chat collapses to bottom strip |
| **Fullscreen artifact** | Homepage preview, email preview, import report |

### Workspace layout (Hybrid/Advanced)

```
┌────────┬────────────────────────────────────┬──────────────┐
│ Icon   │  Thread + Command                  │  Context     │
│ rail   │                                    │  · Preview   │
│        │                                    │  · Diff      │
│        │                                    │  · Records   │
└────────┴────────────────────────────────────┴──────────────┘
```

### Icon rail (minimized sidebar)

When sidebar exists, it is an **icon-only rail** — not a full module tree:

| Icon | Opens |
|------|-------|
| ✨ | Command Center (home) |
| 📋 | Task Queue |
| ✅ | Approvals |
| 📦 | Catalog (manual) |
| 🛒 | Orders (manual) |
| 📣 | Marketing (manual) |
| ⚙ | Settings (manual) |

**No nested flyouts by default.** User commands *"Open categories"* or uses search.

### Artifacts panel

Generated work products attach to the workspace shelf:

- Draft homepage
- Campaign bundle
- Bulk import result
- SEO batch report
- Exported CSV

Each artifact: version, created by (user or agent), open · share · discard.

### Session continuity

- Refresh restores active thread
- `Cmd+K` → "Resume last thread"
- Cross-device: thread syncs via server state

---

## 4. AI Task Queue

The **AI Task Queue** is the admin's operational inbox — every AI job, approval, and assigned team task in one queue.

**Replaces:** checking multiple module pages for pending work.

### Queue sections

```
┌─────────────────────────────────────────────────────────────┐
│  Task Queue                              [Filter] [Sort]    │
├─────────────────────────────────────────────────────────────┤
│  NEEDS YOU (4)                                              │
│  ├─ Approve bulk SEO — 48 products           [Review]      │
│  ├─ Approve refund — Order #8821             [Review]      │
│  ├─ Assign: SLA breach — 3 orders            [Take] [Assign]│
│  └─ Campaign ready to send                   [Review]      │
│                                                             │
│  RUNNING (2)                                                │
│  ├─ ████████░░ Product import 180/200        [Cancel]      │
│  └─ ████░░░░░░ Catalog embedding refresh     [Details]     │
│                                                             │
│  SCHEDULED (1)                                              │
│  └─ Diwali sale price apply — Fri 00:01      [Edit]        │
│                                                             │
│  COMPLETED TODAY                                            │
│  └─ Category "Laptops" created               [Open thread] │
└─────────────────────────────────────────────────────────────┘
```

### Task card fields

| Field | Example |
|-------|---------|
| Title | Approve bulk SEO — 48 products |
| Agent | Catalog + SEO |
| Risk tier | High |
| Created | 2h ago |
| Origin | Thread link |
| Assignee | Unassigned / Rahim |
| Actions | Review · Take · Assign · Cancel |

### Access points

| Entry | Badge |
|-------|-------|
| Header **Tasks** button | Count of Needs You + Running |
| Command | *"What's in my queue?"* |
| Notification tap | Deep link to task |

### Filters

- Needs me · Running · Scheduled · Completed · Failed
- By agent · By module · By assignee
- High risk only

---

## 5. AI Suggestions

**AI Suggestions** are proactive recommendations on the admin home — the replacement for static "quick action" buttons and empty-state help links.

### Placement on admin home

```
Good Morning, Riyad
What would you like to do today?

[ AI Command Box ]

Suggestions
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ 3 orders late    │ │ SEO for 12 SKUs  │ │ Start weekend    │
│ [Prioritize]     │ │ [Generate]       │ │ sale [Plan]      │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

### Suggestion categories

| Category | Admin example |
|----------|---------------|
| **Urgent ops** | Orders breaching SLA |
| **Catalog health** | Missing images, duplicate slugs |
| **Growth** | Campaign opportunities |
| **Finance** | Margin below floor |
| **Seasonal** | Upcoming holiday prep |
| **Automation** | "You did this manually 5× — automate?" |

### Interaction

| Action | Result |
|--------|--------|
| **Primary button** | Pre-filled command → thread opens with plan |
| **Dismiss** | Hide; feedback optional |
| **Snooze** | 1d / 1w |
| **Why?** | Collapsible reasoning + data sources |

### Limits

| Mode | Max visible on home |
|------|---------------------|
| Simple | 3 |
| Hybrid | 5 |
| Advanced | 5 + "View all" inbox |

---

## 6. AI Business Insights

**AI Business Insights** replace traditional analytics dashboards with **narrative intelligence** — metrics that explain themselves and propose action.

### Insight types

| Type | Example output |
|------|----------------|
| **Pulse** | Today KPIs with delta |
| **Anomaly** | "Conversion down 14% on mobile since Tuesday" |
| **Opportunity** | "Cross-sell phone cases to recent phone buyers — est. ৳32k" |
| **Risk** | "Stockout in 4 days on 2 bestsellers" |
| **Efficiency** | "Fulfillment avg 2.1d — 0.3d slower than last month" |
| **Benchmark** | "Your AOV is above category median" |

### Insight card format

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠ Risk · Inventory Agent                        2h ago      │
│ Gaming Laptop X — 6 units left, velocity 4/day              │
│ Stockout projected: Thursday                                  │
│ Evidence: sales_7d · stock_on_hand · lead_time              │
│              [Create PO draft]  [Reduce ad spend]  [Dismiss] │
└─────────────────────────────────────────────────────────────┘
```

### Insight delivery

| Surface | Frequency |
|---------|-----------|
| Home chips | Real-time pulse |
| Daily brief | Generated 6 AM user timezone |
| Weekly memo | Monday — trends + recommendations |
| On-demand | *"Why did revenue drop?"* |

### Trust and transparency

Every insight includes:
- **Evidence block** — collapsible data sources
- **Confidence** — high / medium / low
- **Action link** — always maps to a command or approval

Insights never auto-execute high-risk actions.

---

## 7. AI Activity Feed

The **AI Activity Feed** is the admin audit-visible timeline — what humans and agents did, in plain language.

**Replaces:** digging through module changelogs separately.

### Feed layout

```
┌─────────────────────────────────────────────────────────────┐
│  Activity                                    [Filter ▾]     │
├─────────────────────────────────────────────────────────────┤
│  10:42  Riyad approved · Bulk SEO (48 products)             │
│  10:38  Catalog Agent · Draft meta for 48 products          │
│  09:15  Sara created · Campaign "Cart recovery"             │
│  09:02  Orders Agent · Flagged 3 SLA breaches               │
│  08:55  Riyad · "What needs attention today?"               │
│  Yesterday                                                  │
│  18:30  System · Diwali sale scheduled for Fri 00:01        │
└─────────────────────────────────────────────────────────────┘
```

### Event types

| Actor | Example entry |
|-------|---------------|
| **User command** | Riyad asked: "Create laptop category" |
| **Agent action** | Catalog Agent created category Laptops |
| **Approval** | Rahim approved price update |
| **Manual override** | Sara edited product #442 slug manually |
| **Automation** | Low-stock alert sent to procurement |
| **System** | Scheduled job completed |

### Feed filters

- All · AI only · Human only · Approvals · My team
- By module · By agent · By date

### Feed access

| Mode | Location |
|------|----------|
| Simple | Avatar → Activity; or *"Show recent activity"* |
| Hybrid | Right rail — last 10 events |
| Advanced | Dedicated Activity panel + full page |

Every feed item links to **thread** or **audit record**.

---

## 8. AI Approval Requests

**AI Approval Requests** are the governed gate between AI proposals and production changes. Centralized — not scattered per module.

### Approval inbox

```
┌─────────────────────────────────────────────────────────────┐
│  Approvals (2 pending)                    [Bulk review]     │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Bulk SEO update · 48 products              HIGH RISK  │  │
│  │ Catalog + SEO Agents · Requested by Riyad · 2h ago    │  │
│  │ Sample diff: [expand 3 of 48]                       │  │
│  │ Impact: customer-facing meta · reversible: partial   │  │
│  │                    [Reject]  [Adjust]  [Approve all] │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Refund ৳4,200 · Order #8821                HIGH RISK  │  │
│  │ Orders Agent · Reason: damaged delivery proof attached │  │
│  │                    [Reject]  [Partial]  [Approve]      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Risk tiers and default routing

| Tier | Examples | Default approver |
|------|----------|------------------|
| **Low** | Draft description, internal tags | Auto-apply |
| **Medium** | SEO publish, segment create | Notify + one-click approve |
| **High** | Bulk price, refunds, stock adjust | Explicit approval required |
| **Critical** | Payment config, mass delete, GL | Multi-approver chain |

### Approval card requirements

Every request shows:
- Title and agent(s)
- Who proposed and when
- Diff or preview
- Impact summary
- Reversibility
- Evidence / attachments
- Approve · Adjust · Reject with reason

### Approval access

| Entry | UX |
|-------|-----|
| Header badge | Pending count |
| Home right rail | Top 2 pending |
| Push notification | High/Critical only |
| Command | *"Show pending approvals"* |

### Bulk approval

Advanced users can review batch proposals in **spreadsheet-style diff** before approving all or excluding rows.

---

## 9. AI Automation Center

The **AI Automation Center** is where merchants define **policies and autonomous loops** — the admin surface for delegated AI operation.

**Replaces:** scattered cron jobs, manual recurring tasks, and "remember to check" habits.

### Automation Center home

```
┌─────────────────────────────────────────────────────────────┐
│  Automation Center                        [+ New automation]  │
├─────────────────────────────────────────────────────────────┤
│  ACTIVE (5)                                                   │
│  ├─ Low stock alert → notify + PO draft      [Edit] [Pause] │
│  ├─ Abandoned cart email — 24h delay         [Edit] [Pause] │
│  ├─ SLA breach escalate to manager           [Edit] [Pause] │
│  ├─ Weekly SEO scan for missing meta         [Edit] [Pause] │
│  └─ Competitor price check — Mondays         [Edit] [Pause] │
│                                                               │
│  SUGGESTED (2)                                                │
│  ├─ "You manually reorder Gaming Laptop X weekly"             │
│  │    → [Create auto-reorder rule]                          │
│  └─ "Cart recovery emails improved conversion 8%"            │
│       → [Clone to win-back segment]                           │
└─────────────────────────────────────────────────────────────┘
```

### Creating automations

**Simple Mode** — conversational:

```
User: "When stock goes below 10, notify me and draft a purchase order"

OS: Automation plan:
    Trigger: stock < 10 (any SKU or specific?)
    Actions: notify Riyad · draft PO via Purchase Agent
    Approval: PO requires your approval before send
    [Create automation]
```

**Advanced Mode** — visual rule builder + conversation assist.

### Automation components

| Component | Description |
|-----------|-------------|
| **Trigger** | Event, schedule, threshold, webhook |
| **Condition** | Filters — category, margin, region |
| **Action** | Agent task — notify, draft, update, campaign |
| **Approval gate** | None / notify / required |
| **Scope** | Products, orders, customers, global |
| **Pause / kill** | Per automation and global |

### Automation vs one-off commands

| | One-off command | Automation |
|--|-----------------|------------|
| **Trigger** | User asks now | Event or schedule |
| **Repeat** | Single execution | Continuous |
| **Example** | "Create campaign today" | "Every Monday, suggest weekly sale" |

### Safety

- All automations logged in Activity Feed
- High-risk actions still hit Approval inbox
- Company-wide **automation pause** in emergencies
- Token/cost budget per automation (Advanced)

---

## 10. Advanced Manual Mode

**Advanced Manual Mode** is the precision layer — traditional module UI for when conversation is not the best tool.

**Principle:** Manual mode is **always available**, never the default landing.

### What manual mode includes

| Surface | Route pattern | Purpose |
|---------|---------------|---------|
| **Module grids** | `/catalog/products`, `/orders`, … | Bulk inspect, live edit, export |
| **Record forms** | `/catalog/products/{id}` | Field-level precision |
| **Settings** | `/settings/*` | Tax, shipping, payments, roles |
| **Builder** | `/builder/*` | Visual page composition |
| **Reports** | `/reports/*` | Tabular exports, accounting |
| **AI Control Center** | `/settings/ai/*` | Agents, prompts, providers, audit |

### Entering manual mode

| Path | From |
|------|------|
| Icon rail tap | Hybrid/Advanced sidebar |
| Command | *"Open product list"* |
| Proposal card | "Edit manually" |
| Global search | Select record or module |
| Deep link | Bookmark, notification, external |

### Manual mode UX rules

| Rule | Detail |
|------|--------|
| **AI strip present** | Bottom or right — `Cmd+I` assistant always available |
| **Breadcrumb back** | "← Command Center" on every manual page |
| **No dead ends** | Every form save offers "Continue in thread" |
| **Context import** | Opening form from thread pre-fills AI draft |
| **Mode respect** | Simple Mode users get slide-over, not full navigation tree |

### Sidebar policy (minimized)

| Mode | Sidebar |
|------|---------|
| Simple | None — search + command only |
| Hybrid | Collapsed icon rail; expand on hover/pin |
| Advanced | Icon rail + optional pinned module tree |

**Full module tree is never default expanded.** Expanding shows traditional structure:

```
Catalog
  Products
  Categories
  Brands
  ...
Orders
  All orders
  ...
```

User can pin "Products" to rail for one-click access.

### Settings minimization

In Simple/Hybrid, settings are **conversation-first**:

| Task | Simple path |
|------|-------------|
| Change return policy | *"Set return window to 7 days"* |
| Add shipping zone | *"Ship to all districts in Bangladesh"* |
| Invite team member | *"Invite sara@store.com as marketing manager"* |

Advanced Manual opens full settings forms when needed.

### When manual beats AI

| Scenario | Recommendation |
|----------|----------------|
| 500-row spreadsheet edit | Grid live edit or CSV import |
| Pixel-perfect page design | Builder |
| Accounting journal review | Finance module |
| Compliance audit | Audit log export |
| Unusual edge case | Full form with all fields visible |

---

## Admin Experience Map

```
                         ┌─────────────────────┐
                         │   AI Command Center  │  ← HOME
                         │   Greeting + Command │
                         └──────────┬──────────┘
                                    │
        ┌───────────────┬───────────┼───────────┬───────────────┐
        ▼               ▼           ▼           ▼               ▼
 ┌────────────┐  ┌────────────┐ ┌────────┐ ┌──────────┐  ┌────────────┐
 │ AI         │  │ AI Task    │ │ AI     │ │ AI       │  │ AI         │
 │ Dashboard  │  │ Queue      │ │ Suggest│ │ Insights │  │ Activity   │
 │ (brief)    │  │            │ │ ions   │ │          │  │ Feed       │
 └────────────┘  └─────┬──────┘ └────────┘ └──────────┘  └────────────┘
                       │
                       ▼
                ┌──────────────┐
                │ AI Approvals │
                └──────┬───────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
 ┌──────────────┐              ┌──────────────┐
 │ AI Workspace │              │ AI Automation│
 │ thread+tools │              │ Center       │
 └──────┬───────┘              └──────────────┘
        │
        ▼
 ┌──────────────┐
 │ Advanced     │
 │ Manual Mode  │  ← on demand
 └──────────────┘
```

---

## Implementation Notes

| Area | Route | Priority |
|------|-------|----------|
| Command Center home | `/dashboard` | P0 |
| Task Queue | `/dashboard/tasks` or slide-over | P0 |
| Approvals | `/dashboard/approvals` | P0 |
| Activity | `/dashboard/activity` | P1 |
| Automation | `/dashboard/automations` | P1 |
| Manual modules | existing `/catalog/*`, etc. | Existing |

### Prototype phase alignment

Current AgainERP prototype uses traditional sidebar admin. Migration path:

1. **Phase A** — Command Center home overlay; sidebar remains
2. **Phase B** — Default landing → Command Center; collapsed sidebar (Hybrid)
3. **Phase C** — Simple Mode default for new merchants; full AI surfaces

---

## UX Anti-Patterns

| Do not | Do instead |
|--------|------------|
| Landing on widget dashboard | Land on Command Center |
| Full sidebar on first login | Greeting + command box |
| Hide manual mode entirely | Advanced Manual on demand |
| Separate approval per module | Unified approval inbox |
| Settings maze for simple changes | Conversational settings |
| AI-only with no escape hatch | Hybrid + Advanced modes |

---

## Related Documentation

| Document | Relationship |
|----------|--------------|
| [01_AI_COMMERCE_OS_VISION.md](./01_AI_COMMERCE_OS_VISION.md) | Strategic vision |
| [02_AI_USER_EXPERIENCE.md](./02_AI_USER_EXPERIENCE.md) | Cross-cutting UX patterns |
| [ai-assistant-ui.md](../ui-ux/ai-assistant-ui.md) | Assistant panel spec |
| [AI_OS_ARCHITECTURE.md](../modules/ai/AI_OS_ARCHITECTURE.md) | AI OS UI §18 |
| [ECOMMERCE_ADMIN_PROTOTYPE_PHASE1.md](../ECOMMERCE_ADMIN_PROTOTYPE_PHASE1.md) | Current prototype baseline |
| [README.md](./README.md) | AI OS experience doc index |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-14 | 1.0 | Initial AI Admin Experience specification |
