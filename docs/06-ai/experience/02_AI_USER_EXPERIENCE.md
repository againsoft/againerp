# AgainERP — AI User Experience

> **Status:** Vision (Foundational)  
> **Version:** 1.0  
> **Date:** 2026-06-14  
> **Document Type:** UX Design Specification  
> **Audience:** Product, design, engineering, AI agents  
> **Parent:** [01_AI_COMMERCE_OS_VISION.md](./01_AI_COMMERCE_OS_VISION.md)  
> **Implements:** Conversational-first interaction model for the AI Commerce OS

**Traditional ecommerce asks users to navigate menus.**  
**AgainERP asks users to state intent.**

---

## Purpose
AI OS user experience specification.

## When To Read
Read only when working on AI UX in admin, storefront, or customer-facing flows.

## Related Files
- [AI OS platform](../platform/ai/AI_OS_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [AI platform index](README.md)

---

## Design Thesis

The AgainERP user experience replaces **menu-driven administration** with **intent-driven operation**. Users do not hunt for *Products → Categories → Add*. They write what they want. The OS resolves modules, agents, forms, and approvals behind a single conversational surface.

| Traditional path | AI-first path |
|------------------|---------------|
| Navigate: Catalog → Categories → Add | *"Create a laptop category"* |
| Open product → SEO tab → fill meta fields | *"Generate SEO for this product"* |
| Builder → Pages → Homepage → sections | *"Build a homepage"* |
| Marketing → Campaigns → New wizard | *"Create a campaign for abandoned carts"* |

Menus, grids, and forms remain — as **precision tools** opened from context, not as the default way work begins.

---

## 1. User Journey

### Entry: login to intent

```
Sign in → AI Command Center (home) → State intent → Review plan → Approve → Outcome
                ↓
         Optional: open record/grid for inspection or manual edit
```

### Journey stages

| Stage | User does | System does |
|-------|-----------|-------------|
| **Arrive** | Lands on Command Center after auth | Loads business snapshot: pending tasks, alerts, suggestions |
| **Intent** | Types or speaks a goal | Chief Agent parses intent, routes to domain agent(s) |
| **Clarify** | Answers 0–3 follow-up questions (if needed) | Fills gaps: scope, constraints, targets |
| **Plan** | Reviews structured plan | Shows steps, affected records, risk tier, preview diffs |
| **Commit** | Approves, adjusts, or rejects | Executes via governed services; streams progress |
| **Verify** | Reads summary; drills into records if needed | Links to created/updated entities; logs audit trail |
| **Continue** | Starts next intent or picks up a suggestion | Maintains thread context; offers related next actions |

### Persona journeys

#### Solo merchant (owner-operator)

```
Morning:  "What needs my attention today?"
          → OS surfaces: 3 SLA breaches, low stock on bestseller, draft campaign ready

Midday:   "Create a laptop category with gaming and business subcategories"
          → Plan preview → Approve → Category live at /laptops

Evening:  "Generate SEO for all laptops missing meta description"
          → Batch proposal → Review sample → Approve all
```

#### Operations manager

```
Opens Task Center → assigns fulfillment exception to team member
Command: "Prioritize orders shipping to Dhaka with payment pending"
→ Filtered queue + suggested customer message drafts
```

#### Marketing lead

```
"Create a campaign for customers who bought twice but not in 60 days"
→ Segment built → Email draft → Schedule proposal → Approval for send
```

### First-time onboarding journey

New users never face an empty dashboard with 40 sidebar links. They face a **guided conversation**:

1. *"What do you sell?"* → catalog structure proposed  
2. *"Where do you ship?"* → shipping zones drafted  
3. *"Connect payments?"* → integration wizard embedded in thread  
4. *"Build your homepage"* → storefront layout proposed  
5. *"You're ready to sell"* → checklist with optional deep links  

Onboarding is a **thread**, not a setup wizard spread across twelve settings pages.

### Return visit pattern

| User goal | First interaction |
|-----------|-------------------|
| Quick status | Glance at suggestions + notification strip |
| Specific task | New command in thread or `Cmd+K` |
| Bulk inspection | Open grid from Task Center or global search |
| Deep edit | Jump to form from context panel — AI pre-filled |

---

## 2. AI Command Interface

The **AI Command Interface** is the primary control surface of AgainERP — the replacement for the traditional sidebar-first admin home.

### Layout (desktop)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  AgainERP          [🔍 Search]  [Tasks 4]  [🔔 2]  [Avatar]                │
├────────────┬─────────────────────────────────────────────────┬───────────────┤
│            │                                                 │               │
│  Thread    │           Active conversation                 │   Context     │
│  history   │                                                 │   panel       │
│            │   User: Create a laptop category                │               │
│  Today     │                                                 │   Preview:    │
│  Yesterday │   OS: Plan ready — 1 category, 2 children       │   • Laptops   │
│  Campaign  │       [Review] [Edit plan] [Approve]            │   • Gaming    │
│  …         │                                                 │   • Business  │
│            │   ┌─────────────────────────────────────────┐ │               │
│            │   │ Proposal · Catalog Agent        [Pending]│ │   Diff view   │
│            │   │ Name: Laptops · slug: laptops           │ │   Records     │
│            │   │ SEO: meta draft included                │ │   Metrics     │
│            │   │              [Reject] [Adjust] [Approve]  │ │               │
│            │   └─────────────────────────────────────────┘ │               │
│            │                                                 │               │
│            │   [ Ask anything or describe what you want… ] │               │
├────────────┴─────────────────────────────────────────────────┴───────────────┤
│  Suggestions: Generate SEO · Add 5 gaming SKUs · Build category banner      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Command input behavior

| Input type | Behavior |
|------------|----------|
| **Natural language** | Primary — full sentences, Bangla or English |
| **Slash commands** | `/category`, `/campaign`, `/seo` — power-user shortcuts |
| **@mentions** | `@catalog-agent`, `@orders` — explicit routing |
| **Record refs** | `#product-442`, paste URL — binds context |
| **Attachments** | CSV, images, PDF — "import products from this sheet" |
| **Voice** | Optional — mobile and hands-free warehouse use |

### Command resolution flow

```
Input → Intent classification → Agent selection → Context assembly → Plan or direct answer
                                      ↓
                            High-risk? → Approval card
                            Low-risk?  → Execute with notification
```

### Global access points

| Entry | Shortcut | Use when |
|-------|----------|----------|
| **Command Center home** | Default route after login | Starting work, multi-step operations |
| **Command palette** | `Cmd+K` | Fast action from any screen |
| **Floating assistant** | `Cmd+I` | Contextual help on a record page |
| **Mobile command bar** | Bottom sticky input | On-the-go approvals and queries |

### Response primitives

Every command response uses one or more **structured blocks** — not walls of text:

| Block | Purpose |
|-------|---------|
| **Answer** | Plain-language explanation |
| **Plan** | Numbered steps with agent labels |
| **Proposal card** | Action awaiting approval |
| **Record card** | Linkable entity preview |
| **Diff** | Before/after field changes |
| **Progress** | Long-running job status |
| **Chart** | Inline metric visualization |
| **Next actions** | Suggested follow-up commands |

---

## 3. AI Chat Experience

Chat is not a support bot. It is the **operating dialogue** of the business.

### Conversation principles

| Principle | UX rule |
|-----------|---------|
| **Thread = work session** | One thread can hold a full initiative (e.g., "Diwali sale prep") |
| **Persistent context** | Thread remembers decisions made earlier in the session |
| **No menu-speak** | OS never replies "Go to Catalog → Categories" as the primary answer |
| **Show, then do** | Preview before mutate; summarize after execute |
| **Honest uncertainty** | Ask clarifying questions instead of guessing |
| **Recoverable** | Every message has a visible outcome state: pending · applied · rejected · failed |

### Message types

**User messages**
- Intent statements
- Approvals / rejections
- Corrections: *"Use 15% margin not 18%"*
- Scope refinements

**OS messages**
- Plans and reasoning (collapsible "Why this?" block)
- Proposal cards with action buttons
- Execution progress with step checklist
- Completion summaries with deep links
- Error explanations with retry options

### Example: category creation

```
User:
  Create a laptop category

OS:
  I'll set up a Laptops category for your store.

  Proposed:
  • Name: Laptops
  • Slug: laptops  →  yourstore.com/laptops
  • Parent: Electronics (existing)
  • Subcategories: Gaming Laptops, Business Laptops
  • SEO meta: draft generated
  • Top menu: yes

  [Review details]  [Approve & create]

User:
  [Approve & create]

OS:
  ✓ Done in 4s
  • Category live: Laptops
  • 2 subcategories created
  • SEO drafts saved

  Next:
  · Add products to Laptops
  · Generate category banner
  · Build laptops landing section on homepage
```

### Example: SEO generation

```
User:
  Generate SEO

OS:
  I can generate SEO for:
  ○ Current product (Blue T-Shirt) — you're viewing it
  ○ All products missing meta (48)
  ○ Laptops category you created today

  Which scope?

User:
  All products missing meta

OS:
  Batch plan: 48 products · Catalog + SEO agents
  Sample preview (3 of 48): [expand]
  Est. time: ~2 min · Approval: required for bulk publish

  [Review all]  [Approve batch]
```

### Example: homepage build

```
User:
  Build a homepage

OS:
  Homepage plan based on your catalog and brand settings:

  1. Hero — seasonal banner slot
  2. Category grid — top 6 categories (incl. Laptops)
  3. Best sellers — last 30 days
  4. New arrivals
  5. Trust strip — shipping, returns, warranty

  Style: clean grid · mobile-first
  [Preview storefront]  [Edit sections]  [Publish draft]
```

### Streaming and latency

| Duration | UX |
|----------|-----|
| < 2s | Inline response |
| 2–30s | Streaming text + typing indicator |
| 30s+ | Background job + Task Center entry; user can leave thread |

### Mobile chat

- Full-screen conversation
- Swipe-up context sheet for previews
- Push notification when background job completes
- One-tap approve for pending proposals

---

## 4. AI Workspace

The **AI Workspace** is the spatial environment around the conversation — where threads, context, and precision tools coexist.

### Workspace zones

| Zone | Role |
|------|------|
| **Thread rail** | History of conversations — searchable, pinable, shareable with team |
| **Conversation canvas** | Main dialogue and proposal cards |
| **Context panel** | Record details, diffs, live previews, related metrics |
| **Artifact shelf** | Generated assets: images, email HTML, CSV exports, draft pages |
| **Precision layer** | Slide-over grid or form when user needs pixel-level control |

### Workspace modes

| Mode | When | Layout |
|------|------|--------|
| **Command** | Default | Conversation-centered; context panel optional |
| **Split** | Reviewing bulk changes | Conversation left; diff/grid right |
| **Focus** | Deep form edit | Form takes center; chat collapses to strip |
| **Inspect** | Audit review | Timeline + record + AI reasoning chain |

### Opening precision tools from chat

User never loses thread context when opening a traditional screen:

```
"Create a laptop category" → Approve → "Open in editor" → Category form slide-over
                                                          → Chat strip remains visible
                                                          → Changes sync back to thread
```

### Artifacts

Long-running or creative work produces **artifacts** attached to the thread:

| Artifact | Example |
|----------|---------|
| Draft homepage | Builder JSON + live preview link |
| Campaign package | Segment + email + coupon + schedule |
| Import report | 200 SKUs created, 3 errors with fixes |
| Analysis memo | "Why conversion dropped" with charts |

Artifacts are versioned, shareable, and reopenable from thread history.

### Workspace persistence

- Threads auto-save
- Draft plans survive refresh
- Pinned threads appear in sidebar
- Company-wide **shared threads** for team initiatives (see §9)

---

## 5. AI Suggestions

Suggestions replace the static dashboard widget wall with **timely, actionable intelligence**.

### Suggestion sources

| Source | Example suggestion |
|--------|-------------------|
| **Operational signals** | "14 orders breaching SLA — prioritize?" |
| **Inventory** | "Gaming Laptop X: 6 units left, avg 4/day — reorder?" |
| **Catalog gaps** | "22 products missing images — generate or upload?" |
| **SEO** | "Homepage meta unchanged 90 days — refresh?" |
| **Marketing** | "Cart abandonment up 12% — create recovery campaign?" |
| **Seasonal** | "Eid in 3 weeks — plan sale collection?" |
| **Financial** | "Margin on Accessories below 15% floor — review pricing?" |

### Suggestion card anatomy

```
┌────────────────────────────────────────────────────────────┐
│ 💡 Suggestion · Marketing Agent                   [Dismiss] │
│ Create a campaign for abandoned carts (+12% this week)    │
│ Impact: est. ৳85k recovered · Risk: medium · 5 min setup   │
│                                    [Why?]  [Snooze]  [Start] │
└────────────────────────────────────────────────────────────┘
```

### Suggestion placement

| Surface | Density |
|---------|---------|
| **Command Center footer** | 3–5 top suggestions |
| **Empty input state** | Starter prompts for new users |
| **Record context panel** | 1–3 record-specific suggestions |
| **End of thread** | "What's next?" follow-ups after task completion |

### Suggestion rules

| Rule | Detail |
|------|--------|
| **Actionable** | Every suggestion opens a pre-filled command or plan — never advice-only |
| **Dismissable** | User can dismiss; OS learns preference |
| **Snoozeable** | Remind in 1 day / 1 week |
| **Ranked** | Impact × urgency × confidence |
| **Permission-aware** | Never suggest actions user cannot perform |
| **Not noisy** | Max 5 unread suggestions; rest in Suggestions inbox |

### Starter prompts (new users)

```
Create a laptop category
Add my first product
Build a homepage
Set up shipping for Bangladesh
Create a welcome campaign
```

---

## 6. AI Task Center

The **AI Task Center** is the operational queue for everything the OS is doing, has done, or awaits human decision on.

### Task categories

| Category | Contents |
|----------|----------|
| **Needs approval** | Proposals awaiting human commit |
| **Running** | Background jobs: imports, batch SEO, syncs |
| **Completed** | Finished work with summary and links |
| **Failed** | Errors with retry and support context |
| **Scheduled** | Future automations and campaign launches |
| **Assigned** | Team tasks routed from agents (see §9) |

### Task Center layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Task Center                                    [Filter ▾] [⚙]  │
├─────────────────────────────────────────────────────────────────┤
│  NEEDS YOU (4)                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Bulk SEO — 48 products          Catalog · 2h ago  [Review]│  │
│  │ Price update — Diwali sale      Catalog · 5h ago  [Review]│  │
│  │ Refund ₹4,200 — Order #8821      Orders  · 1h ago  [Review]│  │
│  │ Campaign send — Abandoned cart    Marketing · now [Review]│  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  RUNNING (2)                                                    │
│  ████████░░  Product import — 180/200                           │
│  ████░░░░░░  Embedding refresh — catalog                        │
│                                                                 │
│  COMPLETED TODAY (12)                              [View all]   │
└─────────────────────────────────────────────────────────────────┘
```

### Task lifecycle

```
Proposed → Pending approval → Queued → Running → Completed
                ↓                              ↓
            Rejected                         Failed → Retry
```

### Task ↔ thread linking

Every task links back to its **originating thread**. Users can resume conversation context from any task card.

### Bulk operations

Batch tasks show:
- Progress bar with cancel option
- Expandable error list with per-row fix actions
- Partial success summary: *"45 applied, 3 skipped"*

---

## 7. AI Notifications

Notifications keep users informed without forcing them to watch a chat window.

### Notification channels

| Channel | Use |
|---------|-----|
| **In-app bell** | All events — primary |
| **Thread badge** | Updates on followed threads |
| **Toast** | Immediate feedback on approve/reject |
| **Email / SMS** | Critical approvals, failures, SLA breaches (configurable) |
| **Push (mobile)** | Approval needed, job complete |

### Notification types

| Type | Example | Default urgency |
|------|---------|-----------------|
| **Approval required** | "48 SEO updates ready for review" | High |
| **Job complete** | "Homepage draft ready to preview" | Medium |
| **Job failed** | "Import stopped at row 142 — tap to fix" | High |
| **Agent alert** | "Stockout risk: Gaming Laptop X" | High |
| **Suggestion** | "Consider a cart recovery campaign" | Low |
| **Team** | "Rahim approved price update you requested" | Medium |
| **System** | "AI budget at 80% this month" | Low |

### Notification card structure

```
Title:     Bulk SEO complete
Body:      45 products updated · 3 need manual review
Actions:   [Open thread]  [View failures]
Deep link: Thread → artifact → record
```

### Notification philosophy

| Rule | Rationale |
|------|-----------|
| **Actionable** | Tap opens the decision or result — not a generic page |
| **Grouped** | "5 approval requests" not 5 separate pings |
| **Quiet hours** | Respect merchant-configured schedule |
| **Severity-based** | Critical breaks through; low goes to digest |
| **Audit-linked** | Every notification links to audit entry |

### Digest mode

Users who prefer calm can enable **daily digest**: one summary of suggestions, completed tasks, and pending approvals — delivered at a chosen time.

---

## 8. Human Override

AI-first does not mean AI-only. **Human override** is a first-class UX path — always visible, never buried.

### Override entry points

| Entry | Use |
|-------|-----|
| **Reject proposal** | Decline AI action with optional reason — OS learns |
| **Adjust plan** | Edit steps, values, or scope before approve |
| **Open in editor** | Jump to full form/grid with AI draft pre-filled |
| **Manual mode** | `Cmd+K` → "Open product list" — traditional navigation |
| **Take over task** | Assign running agent task to self; agent pauses |
| **Rollback** | Revert applied change where module supports undo |
| **Pause agents** | Company or per-agent kill switch |

### Override patterns

#### Edit before apply

```
Proposal: Price ৳599 → ৳649
User: [Adjust] → inline edit → ৳629 → [Apply]
```

#### Manual correction after apply

```
OS created category slug: laptops
User: Opens editor → changes slug → system warns of redirect need → confirms
Thread updated: "You manually changed slug laptops → laptop-computers"
```

#### Full manual path

Power users and integrators can always:

- Browse sidebar modules (collapsed by default on Command Center)
- Use AG Grid live edit
- Import/export CSV without AI
- Configure settings forms directly

**Manual paths are equal citizens** — just not the default onboarding.

### Override visibility in audit

Every human override is logged distinctly from AI proposals:

```
Action: category.update
Origin: human_manual (not ai_proposal)
Actor: user@store.com
Previous: { slug: "laptops" }
New:      { slug: "laptop-computers" }
```

### When override is encouraged

| Situation | UX nudge |
|-----------|----------|
| Brand-sensitive copy | "Review in editor before publish" |
| Legal/policy content | Manual approval mandatory |
| Novel edge case | "This looks unusual — open full record?" |
| Low AI confidence | Yellow banner: "Confidence 62% — please verify" |

---

## 9. Multi User Collaboration

AgainERP is multi-user by design. The AI UX supports **teams operating one business** through shared context and clear handoffs.

### Collaboration primitives

| Primitive | Behavior |
|-----------|----------|
| **Shared threads** | Owner can invite colleagues to a work session |
| **Task assignment** | Agent or user assigns task to team member |
| **Approval chains** | Multi-step approval routed by role |
| **Mentions** | `@rahim review this campaign` in thread |
| **Comments on proposals** | Threaded discussion on a proposal card before approve |
| **Activity feed** | Who asked AI what; who approved what |

### Roles in the AI UX

| Role | Typical interaction |
|------|---------------------|
| **Owner** | Full command authority; sets autonomy policies |
| **Manager** | Approves high-risk; assigns tasks |
| **Operator** | Day-to-day commands within permissions |
| **Specialist** | Deep module edit; marketing or catalog focus |
| **Viewer** | Read threads, reports; cannot approve |

AI inherits the **invoking user's permissions** — not the highest role on the team.

### Shared thread example

```
Thread: "Diwali Sale 2026" · Shared with Marketing team

Sara:   "Create a campaign for top 100 sellers"
OS:     [Plan posted]
Rahim:  @sara — suggest excluding new arrivals
Sara:   "Exclude products tagged new-arrival"
OS:     [Updated plan]
Owner:  [Approve price updates]
OS:     ✓ Campaign scheduled · ✓ Prices updated
```

### Handoff flow

```
Agent detects exception → Creates task → Assigns to Orders team
                                      → Notifies assignee
                                      → Assignee continues in thread or form
                                      → Resolution logged to original thread
```

### Conflict prevention

| Scenario | UX |
|----------|-----|
| Two users edit same record | Optimistic lock + "Sara is editing this" |
| Duplicate AI proposals | Second proposal flagged: "Pending change exists" |
| Approval race | First approver wins; second sees stale state |

### Team visibility settings

| Setting | Options |
|---------|---------|
| Thread default | Private / Team-visible / Company-wide |
| Approval notifications | Role-based routing |
| AI spend | Per-team budget visibility |

---

## Interaction Model Summary

```
                    ┌─────────────────────┐
                    │   User intent       │
                    │   (natural language)│
                    └──────────┬──────────┘
                               ▼
                    ┌─────────────────────┐
                    │  AI Command Center  │
                    │  Chat + Workspace   │
                    └──────────┬──────────┘
                               ▼
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
       ┌────────────┐  ┌────────────┐  ┌────────────┐
       │ Suggestions│  │ Task Center│  │Notifications│
       └────────────┘  └────────────┘  └────────────┘
                               │
                    Approve / Override / Collaborate
                               ▼
                    ┌─────────────────────┐
                    │  Governed execution │
                    │  (agents + services)│
                    └─────────────────────┘
```

---

## UX Anti-Patterns (Do Not Build)

| Anti-pattern | Why |
|--------------|-----|
| AI sidebar on legacy dashboard as the whole product | Bolt-on, not OS-native |
| Chat that only answers FAQ | No action = no operating system |
| Forcing chat for simple read | "Show order #123" can open record directly |
| Hiding manual navigation | Overrides must exist |
| Silent auto-apply on high-risk | Destroys trust |
| Notification spam | Users mute everything |
| Menu-first onboarding | Teaches old mental model |

---

## Related Documentation

| Document | Relationship |
|----------|--------------|
| [01_AI_COMMERCE_OS_VISION.md](./01_AI_COMMERCE_OS_VISION.md) | Strategic vision parent |
| [ai-assistant-ui.md](../../04-uiux/standards/ai-assistant-ui.md) | Global assistant panel spec |
| [UX_SMART_INTERACTION_STANDARDS.md](../../04-uiux/standards/UX_SMART_INTERACTION_STANDARDS.md) | Platform interaction standards |
| [AI_OS_ARCHITECTURE.md](../platform/ai/AI_OS_ARCHITECTURE.md) | AI OS UI surfaces §18 |
| [AI_AUDIT_AND_APPROVAL.md](../platform/ai/AI_AUDIT_AND_APPROVAL.md) | Approval and audit UX |
| [README.md](./README.md) | AI OS experience doc index |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-14 | 1.0 | Initial AI User Experience specification |
