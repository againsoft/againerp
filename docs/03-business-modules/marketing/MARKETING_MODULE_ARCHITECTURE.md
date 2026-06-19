# AgainERP — Marketing Module Architecture

> **Status:** Approved  
> **Version:** 1.0  
> **Module:** Marketing (Marketing Automation Platform)  
> **Document Type:** Enterprise Architecture  
> **Phase:** Documentation First · UI/UX Planning  
> **Route Namespace:** `/marketing/*`  
> **Governance:** [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · **Standards:** [DEVELOPMENT_STANDARDS.md](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md)

## Purpose
Marketing module architecture — scope, features, data ownership, and integration boundaries.

## When To Read
Read this file only if working on Marketing architecture, features, or module boundaries.

## Related Files
- [Dependencies](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next
- [UI build guides](../../04-uiux/prototype/marketing/)

---

**No backend code. No database implementation. No API implementation.**  
This document is the source of truth for **Marketing as an independent, AI-first Marketing Automation Platform** — campaigns, audiences, journeys, and growth programs across every channel.

### Step 11 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Complete marketing automation platform | §1 Module Vision |
| Route namespace `/marketing/*` | §2 Dashboard (Navigation) |
| Dashboard through Loyalty Programs | §2–§13 |
| Reports, AI Agent, Activity, Workflow | §14–§17 |
| Permissions & UI/UX | §18 · §19 |
| AI: suggestions, segmentation, churn, recommendations, content, analysis | §15 |

**Related:** [CRM_MODULE_ARCHITECTURE.md](../crm/CRM_MODULE_ARCHITECTURE.md) · [SALES_MODULE_ARCHITECTURE.md](../sales/SALES_MODULE_ARCHITECTURE.md) · [PRODUCT_MASTER_ARCHITECTURE.md](../../02-core-platform/subsystems/PRODUCT_MASTER_ARCHITECTURE.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) · [WORKFLOW_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md) · [APPROVAL_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) · [modules/ecommerce/marketing/ARCHITECTURE.md](../ecommerce/marketing/ARCHITECTURE.md) (legacy ecommerce scope)

---

## Executive Summary

**Marketing** is AgainERP's **growth and engagement engine** — the module that plans, targets, automates, and measures every outbound touchpoint from first visit to loyal advocate.

| Principle | Rule |
|-----------|------|
| **Independent module** | Full admin UX at `/marketing/*` — operable without Ecommerce storefront |
| **Core contacts master** | Audiences reference Core `contacts` — no duplicate customer table |
| **CRM consumes attribution** | CRM sees campaign context; Marketing executes sends and journeys |
| **Product Master consumer** | Recommendations, coupons, and segments target catalog SKUs |
| **Channel-agnostic delivery** | Email, SMS, push via Core Notification — Marketing owns content & rules |
| **Event-driven** | Every send, open, click, conversion emits `marketing.*` events |
| **AI native** | Segmentation, churn, content, and performance insights on every campaign |
| **Activity everywhere** | Timeline, chatter, followers on campaigns, journeys, and programs |

**Table namespace:** `marketing_*` · **API base:** `/api/v1/marketing/`

---

## 1. Module Vision

### Why Marketing Exists as an Independent Module

Growth is not a checkout feature. Promotions, nurture flows, loyalty, and multi-channel campaigns span **Ecommerce, Sales, CRM, and future verticals** (hospital outreach, school enrollment, restaurant loyalty). Marketing must operate as a first-class platform module — not a submenu buried under storefront admin.

Marketing must work when:

- There is **no Ecommerce** (B2B nurture, hospital patient reminders, field campaigns)
- CRM drives pipeline while Marketing runs top-of-funnel and win-back
- Sales closes deals with campaign-attributed quotations
- Product Master defines what to promote and recommend
- AI OS suggests segments, content, and next campaigns

```text
                    ┌─────────────────────────────────────┐
                    │      Core Contacts (Single Master)   │
                    │   People · Organizations · Consent   │
                    └─────────────────┬───────────────────┘
                                      │
                    ┌─────────────────▼───────────────────┐
                    │   Marketing Module (Automation Platform) │
                    │ Campaigns · Audiences · Journeys · AI │
                    └───────┬─────────┬─────────┬─────────────┘
                            │         │         │
              ┌─────────────▼──┐ ┌────▼────┐ ┌──▼──────────┐
              │  CRM Module     │ │ Ecommerce│ │ Sales Module │
              │  Attribution    │ │ Checkout │ │ Quote-to-cash│
              └─────────────┬──┘ └────┬────┘ └──────┬───────┘
                            │         │              │
              ┌─────────────▼─────────▼──────────────▼───────┐
              │  Product Master · AI OS · Notification Core   │
              └──────────────────────────────────────────────┘
```

### Vision Statement

> **Reach the right person. On the right channel. At the right moment. Prove every dollar.**

Marketing is AgainERP's **unified automation platform** — from one-time blasts to multi-step journeys, from coupon codes to loyalty tiers, with AI that suggests who to target and what to say.

### Marketing vs Ecommerce Promotions

| Ecommerce-scoped (legacy) | Platform Marketing Module |
|---------------------------|---------------------------|
| Storefront coupons only | Coupons usable at checkout **and** Sales quotes |
| Cart-centric segments | Cross-channel audiences (web, CRM, import) |
| Menu under Ecommerce | Independent `/marketing/*` namespace |
| Limited reporting | Full attribution → CRM pipeline → revenue |

The legacy [modules/ecommerce/marketing/ARCHITECTURE.md](../ecommerce/marketing/ARCHITECTURE.md) remains as an ecommerce integration reference; **this document is canonical** for platform design.

### Relationship to Sibling Modules

| Module | Marketing Role | Marketing Does Not Own |
|--------|----------------|------------------------|
| **Core contacts** | Audience members, consent flags | Party master schema |
| **CRM** | Campaign attribution on leads/accounts | Pipeline, opportunities |
| **Sales** | Coupon on quotation; campaign_id on SO | Invoices, fulfillment |
| **Ecommerce** | Checkout promo eval; cart recovery | Order fulfillment |
| **Product Master** | Target products/collections in rules | SKU master data |
| **AI OS** | Marketing Agent predictions & drafts | Model infrastructure |
| **Notification Core** | Transport for email/SMS/push | Template rendering infra |

---

## 2. Dashboard

**Route:** `/marketing`

The Marketing Dashboard is the **command center** for growth KPIs, active campaigns, and AI insight queue.

### Navigation Structure

**Route namespace:** `/marketing/*`

```text
Marketing
├── /marketing                              Dashboard
├── /marketing/campaigns                    Campaign list & detail
├── /marketing/campaigns/[id]               Campaign workspace
├── /marketing/email                        Email marketing hub
├── /marketing/email/templates              Template library
├── /marketing/email/campaigns              Email campaigns
├── /marketing/sms                          SMS marketing hub
├── /marketing/push                         Push notifications
├── /marketing/audiences                    Audience manager
├── /marketing/segments                     Segment builder
├── /marketing/automation                   Automation rules
├── /marketing/journeys                     Journey builder
├── /marketing/journeys/[id]                Journey canvas
├── /marketing/coupons                      Coupons & promo codes
├── /marketing/referrals                    Referral programs
├── /marketing/loyalty                      Loyalty programs
├── /marketing/reports                      Marketing analytics
├── /marketing/ai-insights                  AI Marketing Agent queue
└── /marketing/settings                     Module settings
```

### Dashboard Widgets

| Widget | Data Source | Purpose |
|--------|-------------|---------|
| **Active campaigns** | `marketing_campaigns` | Running + scheduled count |
| **Send volume (7d)** | Email/SMS/push logs | Channel mix chart |
| **Conversion rate** | Attribution rollup | Campaign → order/revenue |
| **Audience growth** | Segment member counts | Net new subscribers |
| **Coupon redemptions** | `marketing_coupon_usages` | Promo performance |
| **Loyalty liability** | Points outstanding | Finance-aware metric |
| **Churn risk cohort** | AI + CRM signals | Win-back priority list |
| **AI suggestions** | Marketing Agent queue | Actionable insights |
| **Top journeys** | Journey completion funnel | Automation health |
| **Channel deliverability** | Bounce/spam rates | Email/SMS health |

### Quick Actions

- Create campaign · New segment · Launch journey · Issue coupon · View AI insights

**Prototype refs:** [ui-prototype/marketing/CampaignManager.md](../../04-uiux/prototype/marketing/CampaignManager.md) · [ui-prototype/marketing/EmailMarketing.md](../../04-uiux/prototype/marketing/EmailMarketing.md)

---

## 3. Campaigns

**Route:** `/marketing/campaigns`

Campaigns are the **orchestration unit** — one named initiative that may span channels, audiences, budgets, and attribution tags.

### Campaign Entity

**Tables:** `marketing_campaigns`, `marketing_campaign_channels`, `marketing_campaign_goals`

| Field | Notes |
|-------|-------|
| `name`, `code` | Human label + short code |
| `type` | `email`, `sms`, `push`, `multi`, `promotion` |
| `status` | draft → scheduled → running → paused → completed → archived |
| `audience_id` / `segment_id` | Target population |
| `starts_at`, `ends_at` | Schedule window |
| `budget` | Optional spend cap (SMS/paid) |
| `utm_source`, `utm_medium`, `utm_campaign` | Attribution |
| `goal_type` | `revenue`, `orders`, `leads`, `clicks`, `custom` |
| `goal_target` | Numeric target |
| `owner_id` | Responsible marketer |

### Campaign Lifecycle

```text
Draft → (Approval if policy) → Scheduled → Running → Completed
                              ↘ Paused ↗
```

### Multi-Channel Campaign

One campaign header with per-channel child records in `marketing_campaign_channels`:

| Channel | Config |
|---------|--------|
| Email | Template, subject, from-name, send time |
| SMS | Template, sender ID, throttle |
| Push | Title, body, deep link, image |
| Onsite | Popup/banner link (Ecommerce integration) |

### Attribution

Downstream documents store `campaign_id`:

- `commerce_orders.campaign_id`
- `sales_orders.campaign_id`
- `crm_leads.campaign_id` (UTM / landing page)

Rollup API aggregates: sends → opens → clicks → orders → revenue → ROI.

### Campaign Workspace UI

- Header: status pill, goal progress bar, channel chips
- Tabs: Overview · Audience · Content · Schedule · Performance · Activity
- Smart buttons: Duplicate · Pause · Clone to journey

---

## 4. Email Marketing

**Route:** `/marketing/email`

Email is the **primary long-form nurture channel** — templates, personalization, A/B tests, and deliverability tracking.

### Email Templates

**Tables:** `marketing_email_templates`, `marketing_email_template_blocks`

| Capability | Design |
|------------|--------|
| Drag-and-drop blocks | Hero, text, product grid, CTA, footer |
| Merge tags | `{{contact.first_name}}`, `{{order.last_url}}` |
| Product blocks | Pull from Product Master by collection/rule |
| Brand tokens | Logo, colors from Business Settings |
| Version history | Draft vs published template |
| Preview | Desktop/mobile; send test |

### Email Campaigns / Sends

**Tables:** `marketing_email_sends`, `marketing_email_send_recipients`

| Field | Notes |
|-------|-------|
| `campaign_id` | Parent campaign |
| `template_id` | Render source |
| `subject`, `preheader` | Inbox display |
| `from_email`, `reply_to` | Verified sender domain |
| `scheduled_at` | Queue time |
| `status` | queued, sending, sent, failed |

Per-recipient: `delivered`, `opened`, `clicked`, `bounced`, `unsubscribed`, `complained`.

### Personalization & Rules

- Dynamic content blocks by segment tag
- Conditional sections (if VIP → premium offer)
- Send-time optimization (AI suggests per timezone — v2)

### Deliverability

- SPF/DKIM/DMARC status from Core Email Settings
- Suppression list sync (bounces, unsubscribes, complaints)
- Frequency cap: max N marketing emails per contact per 7 days

### Integration

Delivery via **Core Notification Service** — Marketing owns content, audience, and analytics; Core owns SMTP/API transport.

**Events:** `marketing.email.sent`, `marketing.email.opened`, `marketing.email.clicked`, `marketing.email.bounced`

---

## 5. SMS Marketing

**Route:** `/marketing/sms`

SMS delivers **high-attention, short-message** campaigns and transactional-adjacent alerts (where policy allows).

### SMS Templates

**Table:** `marketing_sms_templates`

| Field | Notes |
|-------|-------|
| `body` | Max 160/320 chars; Unicode awareness |
| `variables` | `{first_name}`, `{coupon_code}` |
| `category` | `marketing`, `transactional` (regulatory) |
| `provider_template_id` | WhatsApp/SMS gateway registration |

### SMS Campaigns

**Table:** `marketing_sms_sends`

| Rule | Implementation |
|------|----------------|
| Opt-in required | `contact.sms_marketing_consent = true` |
| Quiet hours | No send 21:00–08:00 local (configurable) |
| Throttle | Max recipients/minute per gateway |
| Link shortening | Branded short URLs with UTM |
| Cost tracking | Per-segment character + segment count |

### Triggers

- Cart abandonment SMS (journey step)
- Flash sale alert to VIP segment
- Appointment reminder (Hospital profile — future)

Delivery via Core SMS gateway. **Events:** `marketing.sms.sent`, `marketing.sms.delivered`, `marketing.sms.failed`

### WhatsApp Extension

WhatsApp Business templates register alongside SMS (`channel = whatsapp`). Same audience and journey engine; separate template approval workflow. UI route: `/marketing/sms?channel=whatsapp` or dedicated tab.

---

## 6. Push Notifications

**Route:** `/marketing/push`

Push reaches **web and mobile app** subscribers with timely, action-oriented messages.

### Push Subscriptions

**Table:** `marketing_push_subscriptions`

| Field | Notes |
|-------|-------|
| `contact_id` | Linked when identified |
| `device_token` | FCM/APNs token |
| `platform` | `web`, `ios`, `android` |
| `opt_in_at` | Consent timestamp |

### Push Campaigns

**Table:** `marketing_push_sends`

| Field | Notes |
|-------|-------|
| `title`, `body` | Notification copy |
| `icon`, `image_url` | Rich notification |
| `action_url` | Deep link / product page |
| `segment_id` | Target audience |
| `ttl_seconds` | Expiry if device offline |

### Targeting

- All subscribers · Segment · Individual device
- Geo-fence (future) · App version filter

### Metrics

Sent · delivered · opened · action_clicked · dismissed

**Events:** `marketing.push.sent`, `marketing.push.clicked`

---

## 7. Audiences

**Route:** `/marketing/audiences`

An **Audience** is a named, reusable population container — the input to campaigns, journeys, and exports.

### Audience Types

| Type | Description | Storage |
|------|-------------|---------|
| **Static** | Manual list upload / picker | `marketing_audience_members` |
| **Dynamic** | Rule-evaluated membership | Rebuilt on schedule |
| **Imported** | CSV/API one-time or sync | Staging → members |
| **Lookalike** | AI-expanded seed audience (v2) | Derived set |

**Tables:** `marketing_audiences`, `marketing_audience_members`, `marketing_audience_sources`

### Audience Sources

| Source | Sync |
|--------|------|
| Core contacts | `contact_type = customer` |
| CRM leads | `crm_leads` with filters |
| Ecommerce customers | Order history predicates |
| Newsletter signup | Storefront form webhook |
| Event attendees | Import list |

### Consent & Compliance

Every audience member resolves to a Core contact with:

| Flag | Channel gate |
|------|--------------|
| `email_marketing_consent` | Email campaigns |
| `sms_marketing_consent` | SMS |
| `push_marketing_consent` | Push |

Suppressed contacts excluded at send time regardless of segment membership.

### Audience Operations

- Preview count before send
- Export to CSV (permission-gated)
- Overlap analysis between two audiences
- Exclude audience (campaign level: send to A minus B)

---

## 8. Segments

**Route:** `/marketing/segments`

**Segments** are **rule-based dynamic audiences** — the primary targeting mechanism for automation and AI-driven cohorts.

### Segment Builder

**Tables:** `marketing_segments`, `marketing_segment_rules`, `marketing_segment_members`

| Rule Category | Examples |
|---------------|----------|
| **Demographics** | City, age band, language |
| **RFM** | Recency, frequency, monetary tiers |
| **Behavioral** | Viewed product X, abandoned cart, email opened |
| **Transactional** | Orders > 3, LTV > ৳50,000, category affinity |
| **CRM** | Lead score > 70, account tier Gold |
| **Engagement** | Clicked campaign Y in last 14d |
| **Custom** | SQL-safe expression builder (admin) |

Rule groups: AND/OR nesting. Preview: live count + sample contacts.

### Evaluation Schedule

| Mode | When |
|------|------|
| **Realtime** | Event-triggered (cart abandon → segment) |
| **Hourly** | High-value dynamic segments |
| **Nightly** | Bulk RFM and LTV recomputation |

Materialized into `marketing_segment_members` for fast campaign audience resolution.

### Standard Segments (Presets)

- New customers (first order < 30d)
- VIP (top 10% LTV)
- At-risk / churn (AI + recency)
- Win-back (no order 90d+)
- Newsletter only (no purchase)
- Cart abandoners (active cart, no order)

### Segment ↔ Audience Link

Segments can back an audience (`audience.source_type = segment`) or attach directly to campaigns.

---

## 9. Automation

**Route:** `/marketing/automation`

**Automation rules** are **event-triggered, single-purpose actions** — lighter weight than full journeys.

### Automation Entity

**Tables:** `marketing_automation_rules`, `marketing_automation_actions`

| Trigger | Example Action |
|---------|------------------|
| `contact.created` | Welcome email |
| `order.placed` | Thank-you + cross-sell |
| `order.delivered` | Review request |
| `cart.abandoned` | Recovery email + SMS |
| `segment.entered` | Tag + notify owner |
| `coupon.redeemed` | Loyalty bonus points |
| `crm.lead.converted` | Nurture sequence handoff |
| `loyalty.tier_upgraded` | Congratulations email |

### Action Types

| Action | Target |
|--------|--------|
| Send email / SMS / push | Template + delay |
| Add to segment | Segment ID |
| Remove from segment | Segment ID |
| Issue coupon | Coupon code generation |
| Create CRM task | `/crm/tasks` |
| Webhook | External URL |
| Wait | Delay next action |

### Rule Priority & Limits

- Priority order when multiple rules match
- Global frequency cap per contact
- Enable/disable toggle without delete
- Test mode: run for single contact

---

## 10. Journeys

**Route:** `/marketing/journeys`

**Journeys** are **visual, multi-step automation flows** — the enterprise evolution of automation rules.

### Journey Entity

**Tables:** `marketing_journeys`, `marketing_journey_nodes`, `marketing_journey_edges`, `marketing_journey_enrollments`

| Field | Notes |
|-------|-------|
| `name`, `status` | draft, active, paused, archived |
| `entry_trigger` | Segment enter, event, manual, API |
| `exit_criteria` | Goal reached, unsubscribe, timeout |
| `re_entry_policy` | once, unlimited, cooldown days |

### Node Types (Canvas)

```text
[Entry] → [Wait 2d] → [Email: Reminder] → [Branch: Opened?]
                              │                    ├─ Yes → [Push: Last chance]
                              │                    └─ No  → [SMS: Discount]
                              └──────────────────────→ [Exit: Converted]
```

| Node | Purpose |
|------|---------|
| **Entry** | Trigger definition |
| **Wait** | Delay N minutes/hours/days |
| **Send** | Email, SMS, push |
| **Branch** | If/else on behavior or attribute |
| **Split** | A/B test paths |
| **Goal** | Mark conversion (order, click) |
| **Action** | Tag, coupon, CRM task, webhook |
| **Exit** | End enrollment |

### Enrollment

**Table:** `marketing_journey_enrollments`

Tracks per-contact: `entered_at`, `current_node_id`, `status` (active, completed, exited), `conversion_at`.

### Journey Analytics

Funnel: entered → step completion rates → goal conversion → revenue attributed

### Examples

| Journey | Steps |
|---------|-------|
| **Welcome series** | Day 0 email → Day 3 education → Day 7 offer |
| **Abandoned cart** | 1h email → 24h SMS + coupon → 72h push |
| **Post-purchase** | Thank you → cross-sell → review request |
| **Win-back** | 90d inactive → incentive → final notice |
| **B2B nurture** | Whitepaper → case study → demo request (CRM task) |

---

## 11. Coupons

**Route:** `/marketing/coupons`

Coupons are **trackable discount codes** redeemable at Ecommerce checkout and Sales quotations.

### Coupon Entity

**Tables:** `marketing_coupons`, `marketing_coupon_rules`, `marketing_coupon_usages`

| Field | Notes |
|-------|-------|
| `code` | Unique per company; case policy configurable |
| `discount_type` | `percent`, `fixed`, `free_shipping`, `bxgy` |
| `discount_value` | Amount or percentage |
| `min_cart_amount` | Threshold |
| `max_uses` | Global limit |
| `max_uses_per_customer` | Per-contact cap |
| `starts_at`, `expires_at` | Validity window |
| `campaign_id` | Attribution |
| `is_active` | Kill switch |

### Eligibility Rules (`marketing_coupon_rules`)

- Product IDs / collections / categories
- Customer segment / first-order-only
- Channel: ecommerce, sales, both
- Minimum quantity

### Redemption Flow

```text
Cart/Quote → Marketing.evaluate_coupon(code, context) → discount line
         → Order placed → marketing_coupon_usages row → events
```

**Events:** `marketing.coupon.applied`, `marketing.coupon.redeemed`, `marketing.coupon.expired`

### Bulk & Unique Codes

- Single shared code (SUMMER25)
- Batch unique codes for influencers (`marketing_coupon_batches`)

### Related: Promotions (Auto-Apply)

Rule-based automatic discounts without codes — `marketing_promotions`, `marketing_promotion_rules`, `marketing_promotion_actions`. Evaluated at checkout before coupon entry. Stacking policy: configurable priority.

---

## 12. Referrals

**Route:** `/marketing/referrals`

Referral programs turn **existing customers into acquisition channels** with tracked rewards.

### Referral Program Entity

**Tables:** `marketing_referral_programs`, `marketing_referrals`, `marketing_referral_rewards`

| Field | Notes |
|-------|-------|
| `name`, `status` | Program lifecycle |
| `referrer_reward_type` | points, wallet_credit, coupon |
| `referrer_reward_value` | |
| `referee_reward_type` | welcome coupon, discount |
| `referee_reward_value` | |
| `qualifying_event` | `first_order`, `order_min_amount` |
| `max_referrals_per_referrer` | Fraud cap |

### Referral Flow

```text
Referrer shares link/code → Referee registers → Qualifying order
     → Verify → Issue referrer + referee rewards → Activity log
```

### Tracking

- Unique `referral_code` per contact
- Link: `?ref={code}` with cookie window (30d default)
- Orders: `referral_code` field on `commerce_orders` / `sales_orders`

### Fraud Controls

- Self-referral block
- Same payment method / address detection
- Manual review queue for high-value rewards

**Events:** `marketing.referral.created`, `marketing.referral.completed`, `marketing.referral.reward_issued`

---

## 13. Loyalty Programs

**Route:** `/marketing/loyalty`

Loyalty programs build **repeat purchase and tier status** through points, tiers, and exclusive benefits.

### Loyalty Program Entity

**Tables:** `marketing_loyalty_programs`, `marketing_loyalty_rules`, `marketing_loyalty_tiers`

| Concept | Design |
|---------|--------|
| **Earn rules** | 1 pt / ৳100 spend; bonus on category |
| **Redeem rules** | 100 pts = ৳50 off; min redeem threshold |
| **Expiry** | Points expire after N months (FIFO) |
| **Tiers** | Silver / Gold / Platinum by lifetime spend |
| **Tier benefits** | Extra earn rate, free shipping, early access |

### Points Ledger

Execution ledger: `marketing_loyalty_ledger` (or shared `commerce_reward_ledger` with module FK)

| Entry Type | Example |
|------------|---------|
| `earn` | Order completed +100 |
| `redeem` | Checkout -500 |
| `adjust` | Manual admin correction |
| `expire` | Scheduled job |
| `referral_bonus` | Referral reward |

Balance denormalized on contact marketing profile for fast UI.

### Tier Progression

Nightly job recalculates tier from rolling or lifetime spend. Tier change triggers automation (congratulations email).

### Redemption at Checkout

Marketing validates points → discount line → ledger redeem on order confirm.

**Events:** `marketing.loyalty.points_earned`, `marketing.loyalty.points_redeemed`, `marketing.loyalty.tier_changed`

---

## 14. Reports

**Route:** `/marketing/reports`

Marketing analytics prove **channel ROI, audience health, and program performance**.

### Standard Reports

| Report | Metrics |
|--------|---------|
| **Campaign performance** | Sends, opens, clicks, conversions, revenue, ROI |
| **Email deliverability** | Bounce rate, spam complaints, unsubscribe trend |
| **SMS delivery** | Delivered/failed, cost per conversion |
| **Push engagement** | Open rate, action rate by platform |
| **Segment growth** | Member count over time by segment |
| **Coupon performance** | Issued vs redeemed, discount cost, attributed revenue |
| **Referral program** | Referrals, conversion rate, reward cost |
| **Loyalty program** | Points issued/redeemed, tier distribution, liability |
| **Journey funnel** | Step drop-off, time-to-conversion |
| **Attribution** | First/last touch campaign → order |
| **Channel mix** | Revenue by marketing channel |
| **AI impact** | Campaigns launched from AI suggestions vs manual |

### CRM & Sales Rollups

- Campaign → lead created (CRM)
- Campaign → opportunity influenced
- Campaign → sales order revenue

Reports read from `marketing_*` aggregates + event stream; no duplicate fact tables in CRM.

### Export & Scheduling

- CSV/XLSX export (permission-gated)
- Scheduled email of report snapshot to stakeholders

---

## 15. AI Marketing Agent

**Route:** `/marketing/ai-insights`

Integrates [AI OS Architecture](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md).

### Agent: Marketing Agent

| Capability | Input | Output |
|------------|-------|--------|
| **Campaign suggestions** | Seasonality, inventory, past ROI, CRM pipeline gaps | Ranked campaign ideas with channel mix |
| **Audience segmentation** | RFM, behavior, product affinity | Proposed segment rules + estimated size |
| **Churn prediction** | Recency, engagement decay, support signals | At-risk list + recommended win-back journey |
| **Product recommendations** | Order history, views, segment peers | Product blocks for email/push |
| **Email content generation** | Campaign goal, tone, product set | Subject lines + body drafts (human edit) |
| **Campaign performance analysis** | Send logs, conversions, benchmarks | Insight narrative + optimization tips |

### AI Governance

1. **Suggest → Review → Apply** — no autonomous campaign launch
2. All runs logged in Activity `AI Actions` tab
3. Generated content requires human approval before send
4. Churn lists are advisory — CRM owns relationship actions
5. Tenant AI budget via Control Center

### Data Flow

```text
contacts + orders + campaigns + segments + product catalog + CRM scores
     ↓
AI Context Engine
     ↓
Marketing Agent
     ↓
Insight Queue (/marketing/ai-insights + campaign side panel)
     ↓
Human apply → segment create / template draft / journey clone
```

### UI Surfaces

- Dashboard widget: top 3 AI suggestions
- Campaign builder: "Generate with AI" for subject/body
- Segment builder: "Suggest rules" from natural language
- Reports: AI performance narrative paragraph

---

## 16. Activity Integration

Every Marketing record integrates [Activity & Chatter Architecture](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md).

### Required on Every Entity

| Capability | Campaign | Journey | Coupon | Segment |
|------------|----------|---------|--------|---------|
| Activities | ✓ | ✓ | ✓ | ✓ |
| Comments | ✓ | ✓ | ✓ | ✓ |
| Notes | ✓ | ✓ | ✓ | ✓ |
| Attachments | ✓ | ✓ | — | — |
| Followers | ✓ | ✓ | ✓ | ✓ |
| Mentions | ✓ | ✓ | ✓ | ✓ |
| AI Actions | ✓ | ✓ | ✓ | ✓ |
| History | ✓ | ✓ | ✓ | ✓ |

### Tracked Operations

| Operation | Activity Type |
|-----------|---------------|
| Create / update / delete | `create`, `update`, `delete` |
| Status change | `status_change` |
| Send batch started | `campaign_send` |
| Approval granted/denied | `approval` |
| AI suggestion applied | `ai_action` |
| Segment rebuilt | `segment_refresh` |
| Coupon bulk generated | `bulk_action` |

### CRM Timeline Sync

Campaign sends and conversions appear on **contact/account timeline** in CRM (read-only mirror via events).

### UI Pattern

- **List pages** — Activity icon → Global Activity Drawer
- **Campaign detail** — Chatter sidebar + send log tab
- **Journey canvas** — Comment pins on nodes (collaboration)

---

## 17. Workflow Integration

Integrates [Workflow Engine](../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md) and [Approval Engine](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md).

### Workflow Definitions

| Workflow ID | States |
|-------------|--------|
| `marketing.campaign` | draft → pending_approval → scheduled → running → paused → completed → archived |
| `marketing.journey` | draft → pending_approval → active → paused → archived |
| `marketing.coupon` | draft → active → expired → archived |
| `marketing.referral_program` | draft → active → paused → archived |
| `marketing.loyalty_program` | draft → active → archived |

### Approval Points

| Document | Trigger | Policy Example |
|----------|---------|----------------|
| **Campaign launch** | Status → running; audience > 10k | Marketing manager |
| **Campaign budget** | SMS spend > threshold | Finance + marketing head |
| **Mass email** | First send to cold list | Compliance officer |
| **Coupon discount** | > 50% or > ৳X total exposure | Sales director |
| **Journey activation** | Multi-channel + coupon issue | Marketing manager |
| **Loyalty tier change** | Program rule affecting liability | Finance |

Workflow transitions **blocked** until Approval Engine returns `approved`.

### Automation ↔ Workflow

- Journey nodes may call `workflow.transition` on related entities (e.g., CRM lead stage)
- Workflow actions may enqueue journey enrollment

**Registry:** [WORKFLOW_REGISTRY.md](../../00-foundation/registries/WORKFLOW_REGISTRY.md)

---

## 18. Permissions

Namespace: `marketing.*`

| Permission | Description |
|------------|-------------|
| `marketing.access` | Module access |
| `marketing.view` | View all marketing records |
| `marketing.create` | Create campaigns, segments, coupons |
| `marketing.edit` | Edit drafts |
| `marketing.delete` | Soft delete |
| `marketing.send` | Execute sends / activate journeys |
| `marketing.approve` | Local approve before platform Approval Engine |
| `marketing.export` | Export audiences and reports |
| `marketing.import` | Import contacts to audiences |
| `marketing.campaigns.view` | View campaigns |
| `marketing.campaigns.manage` | Full campaign CRUD + send |
| `marketing.email.manage` | Templates and email sends |
| `marketing.sms.manage` | SMS templates and sends |
| `marketing.push.manage` | Push campaigns |
| `marketing.audiences.view` | View audiences |
| `marketing.audiences.manage` | Create/edit audiences |
| `marketing.segments.view` | View segments |
| `marketing.segments.manage` | Rule builder access |
| `marketing.automation.manage` | Automation rules |
| `marketing.journeys.view` | View journeys |
| `marketing.journeys.manage` | Journey builder |
| `marketing.coupons.view` | View coupons |
| `marketing.coupons.manage` | Create/edit coupons |
| `marketing.referrals.manage` | Referral programs |
| `marketing.loyalty.manage` | Loyalty programs |
| `marketing.reports.view` | Reports |
| `marketing.settings.edit` | Module settings |
| `marketing.ai.apply` | Apply AI suggestions |

### Record Rules

- **Own campaigns:** `owner_id = current_user` (optional restrictive mode)
- **Brand/company scope:** `company_id = current_company`
- **PII export:** requires `marketing.export` + audit log

---

## 19. UI/UX Architecture

### Design Blend

| Weight | Source | Applied To |
|--------|--------|------------|
| **50%** | Shopify | Campaign lists, clean metrics cards, segment filters |
| **25%** | Klaviyo / HubSpot | Journey canvas, email builder |
| **15%** | Odoo | Form layout, smart buttons, approval banners |
| **10%** | Linear | Command palette, keyboard shortcuts |

### Global Requirements

| Requirement | Implementation |
|-------------|----------------|
| **AG Grid** | Campaigns, coupons, sends, referral list |
| **Journey canvas** | Drag-drop nodes, zoom, minimap |
| **Email builder** | Block palette + live preview |
| **Segment builder** | Rule tree + live count preview |
| **Activity drawer** | Global right drawer on all records |
| **AI side panel** | Collapsible on campaign and segment |
| **Status pills** | draft, scheduled, running, paused |
| **Bulk actions** | Pause campaigns, export segment, tag audience |

### Key Screens

#### Campaign List (`/marketing/campaigns`)

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Campaigns                                    [+ New Campaign] [AI ✨] │
├──────────┬─────────┬──────────┬─────────┬──────────┬─────────────────┤
│ Name     │ Channel │ Status   │ Audience│ Conv.    │ Revenue         │
├──────────┼─────────┼──────────┼─────────┼──────────┼─────────────────┤
│ Summer25 │ Email   │ Running  │ VIP 2.1k│ 4.2%     │ ৳ 842,000       │
│ Win-back │ Journey │ Active   │ At-risk │ —        │ ৳ 120,500       │
└──────────┴─────────┴──────────┴─────────┴──────────┴─────────────────┘
```

#### Journey Builder (`/marketing/journeys/[id]`)

- Left: node palette · Center: canvas · Right: node config / AI hints
- Bottom: enrollment funnel mini-chart

#### Email Template Editor (`/marketing/email/templates/[id]`)

- Block list · Canvas · Mobile/desktop toggle · Merge tag inserter · AI draft button

#### Segment Builder (`/marketing/segments/[id]`)

- Rule groups · Live count · Sample contacts drawer · AI "describe audience" input

### Breadcrumbs

`AgainERP › Marketing › {Area} › {Record}`

### Responsive Behavior

- Dashboard and lists: full responsive
- Journey canvas and email builder: desktop-first (min 1280px recommended)

**Standards:** [ENTERPRISE_UI_ARCHITECTURE.md](../../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md) · [UX_SMART_INTERACTION_STANDARDS.md](../../04-uiux/standards/UX_SMART_INTERACTION_STANDARDS.md)

**Prototype index:** [ui-prototype/marketing/](../../04-uiux/prototype/marketing/)

---

## Appendix A — Module Integrations

### Ecommerce

| Direction | Integration |
|-----------|-------------|
| Marketing → Ecommerce | Coupon/promo eval at checkout; popup/banner config |
| Ecommerce → Marketing | Cart events, order attribution, push subscription |
| Shared | `campaign_id`, `coupon_id` on `commerce_orders` |

### CRM

| Direction | Integration |
|-----------|-------------|
| Marketing → CRM | Send/conversion events on contact timeline |
| CRM → Marketing | Lead score, segment rules, churn signals for AI |
| Shared | Core `contacts`; campaign attribution on `crm_leads` |

**Doc:** [CRM_MODULE_ARCHITECTURE.md §23](../crm/CRM_MODULE_ARCHITECTURE.md)

### Sales

| Direction | Integration |
|-----------|-------------|
| Marketing → Sales | Coupons on quotations; campaign on SO |
| Sales → Marketing | B2B order history for RFM segments |

**Doc:** [SALES_MODULE_ARCHITECTURE.md](../sales/SALES_MODULE_ARCHITECTURE.md)

### Product Master

- Product grids in email templates
- Recommendation engine SKU source
- Category/collection targeting in coupons and segments

**Doc:** [PRODUCT_MASTER_ARCHITECTURE.md](../../02-core-platform/subsystems/PRODUCT_MASTER_ARCHITECTURE.md)

---

## Appendix B — System Events

| Event | Payload | Subscribers |
|-------|---------|-------------|
| `marketing.campaign.started` | `campaign_id` | Analytics, Activity |
| `marketing.campaign.completed` | `campaign_id`, `stats` | Reports |
| `marketing.email.sent` | `send_id`, `recipient_count` | Analytics |
| `marketing.email.opened` | `send_id`, `contact_id` | Journeys, CRM timeline |
| `marketing.sms.sent` | `send_id` | Analytics |
| `marketing.push.clicked` | `send_id`, `contact_id` | Journeys |
| `marketing.segment.refreshed` | `segment_id`, `member_count` | Campaigns |
| `marketing.coupon.redeemed` | `coupon_id`, `order_id` | Loyalty, Reports |
| `marketing.referral.completed` | `referrer_id`, `referee_id` | Wallet, Points |
| `marketing.loyalty.tier_changed` | `contact_id`, `tier` | Automation, CRM |
| `marketing.journey.enrolled` | `journey_id`, `contact_id` | Analytics |
| `marketing.journey.completed` | `journey_id`, `contact_id` | Reports |

---

## Appendix C — Database Overview

| Table Group | Key Tables |
|-------------|------------|
| **Campaigns** | `marketing_campaigns`, `marketing_campaign_channels`, `marketing_campaign_goals` |
| **Email/SMS/Push** | `marketing_email_templates`, `marketing_email_sends`, `marketing_sms_templates`, `marketing_sms_sends`, `marketing_push_subscriptions`, `marketing_push_sends` |
| **Audiences** | `marketing_audiences`, `marketing_audience_members` |
| **Segments** | `marketing_segments`, `marketing_segment_rules`, `marketing_segment_members` |
| **Automation** | `marketing_automation_rules`, `marketing_automation_actions` |
| **Journeys** | `marketing_journeys`, `marketing_journey_nodes`, `marketing_journey_edges`, `marketing_journey_enrollments` |
| **Coupons** | `marketing_coupons`, `marketing_coupon_rules`, `marketing_coupon_usages`, `marketing_promotions` |
| **Referrals** | `marketing_referral_programs`, `marketing_referrals`, `marketing_referral_rewards` |
| **Loyalty** | `marketing_loyalty_programs`, `marketing_loyalty_rules`, `marketing_loyalty_tiers`, `marketing_loyalty_ledger` |

Full DDL deferred to implementation phase. Namespace aligns with [MASTER_DATABASE_ARCHITECTURE.md](../../05-development/database/MASTER_DATABASE_ARCHITECTURE.md).

---

## Appendix D — API Overview

Base: `/api/v1/marketing/` · Auth: Bearer + `X-Company-Id`

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET/POST | `/campaigns` | `marketing.campaigns.*` |
| POST | `/campaigns/{id}/schedule` | `marketing.send` |
| GET/POST | `/segments` | `marketing.segments.*` |
| POST | `/segments/{id}/preview` | `marketing.segments.view` |
| GET/POST | `/journeys` | `marketing.journeys.*` |
| POST | `/coupons/validate` | Public (storefront) / internal |
| GET | `/reports/campaign-performance` | `marketing.reports.view` |
| GET | `/ai-insights` | `marketing.ai.apply` |

---

## Appendix E — Future Compatibility

| Domain | Extension |
|--------|-----------|
| **Hospital** | Appointment reminder journeys; patient consent segments |
| **School** | Enrollment nurture; fee deadline SMS |
| **Restaurant** | Visit-based loyalty; geo push |
| **Real estate** | Listing alert journeys |
| **Affiliate program** | `/marketing/affiliates` (from legacy ecommerce scope) |
| **Paid ads** | Meta/Google sync for audience export (v3) |
| **CDP** | External identity graph import |

---

## Related Documents

| Document | Role |
|----------|------|
| [CRM_MODULE_ARCHITECTURE.md](../crm/CRM_MODULE_ARCHITECTURE.md) | Attribution & intelligence |
| [SALES_MODULE_ARCHITECTURE.md](../sales/SALES_MODULE_ARCHITECTURE.md) | B2B coupons & SO attribution |
| [modules/ecommerce/marketing/ARCHITECTURE.md](../ecommerce/marketing/ARCHITECTURE.md) | Legacy ecommerce integration detail |
| [WORKFLOW_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md) | Campaign/journey state machines |
| [APPROVAL_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) | Launch approvals |
| [ACTIVITY_CHATTER_ARCHITECTURE.md](../../02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md) | Timeline & chatter |
| [WORKFLOW_REGISTRY.md](../../00-foundation/registries/WORKFLOW_REGISTRY.md) | Registered workflows |
| [ui-prototype/marketing/](../../04-uiux/prototype/marketing/) | UI prototype specs |

---

*End of Marketing Module Architecture — Step 11*
