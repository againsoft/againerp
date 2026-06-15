# AI Assistant UI

> **Status:** Draft  
> **Parent:** [UX_SMART_INTERACTION_STANDARDS.md](./UX_SMART_INTERACTION_STANDARDS.md) §1  
> **Architecture:** [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md)  
> **AI-First:** [modules/ai/AI_FIRST_ARCHITECTURE.md](../modules/ai/AI_FIRST_ARCHITECTURE.md)  
> **Backend:** [modules/ai/ARCHITECTURE.md](../modules/ai/ARCHITECTURE.md)

---

## Purpose

**Global AI Assistant** on **every page**. Minimize clicks — search, generate, analyze without leaving context.

---

## Access Points

| Entry | Shortcut / Location |
|-------|---------------------|
| **Floating AI button** | Bottom-right FAB (all pages) |
| **Sidebar AI panel** | Right utility zone — persistent mode |
| **Header ✨ icon** | Click |
| **Keyboard** | `Ctrl+I` / `Cmd+I` (primary) |
| **Alt keyboard** | `Ctrl+J` / `Cmd+J` |
| **Command palette** | `Ctrl+K` → "Ask AI" |
| **Record context** | Chatter → "Ask about this record" |

---

## Panel Layout

```
┌─────────────────────────────────────┐
│ ✨ AgainERP Assistant        [─] [×] │
├─────────────────────────────────────┤
│ Context: Product · Blue T-Shirt      │
├─────────────────────────────────────┤
│                                     │
│  [Conversation messages]            │
│                                     │
├─────────────────────────────────────┤
│ Suggested:                          │
│  · Write product description        │
│  · Generate SEO meta                │
│  · Forecast stock needs             │
├─────────────────────────────────────┤
│ [Ask anything…]              [Send] │
└─────────────────────────────────────┘
```

| Viewport | Panel |
|----------|-------|
| Desktop | Right drawer, 400px, overlays utility panel |
| Mobile | Full-screen sheet |

---

## Capabilities

| Capability | Example |
|------------|---------|
| **Product search** | "Find products with low stock" |
| **Customer search** | "Customers who ordered this week" |
| **Order search** | "Unpaid orders over ৳5000" |
| **Report generation** | "Sales report for last month" |
| **SEO generation** | Meta title, description, keywords |
| **Product descriptions** | Full description from bullet points |
| **Blog writing** | Draft blog from topic |
| **Email writing** | Campaign or transactional email |
| **Translation** | Translate description to Bengali |
| **Inventory analysis** | "What should I reorder?" |
| **Sales analysis** | "Why did revenue drop?" |
| **Dashboard insights** | "Summarize today's performance" |
| **Create records** | "Create draft product Blue Shirt" |
| **Navigate** | "Open coupon settings" |

---

## Context Awareness

Assistant receives:

- Current module and screen
- Active record ID and type (if on record view)
- User permissions (never suggest actions user cannot perform)
- Company and branch scope

---

## Response Types

| Type | UI |
|------|-----|
| Text answer | Markdown rendered |
| Record list | Clickable cards linking to records |
| Generated content | Preview + "Apply to field" button |
| Chart | Inline mini-chart widget |
| Action confirmation | "Create coupon?" with Confirm/Cancel |

---

## Universal Actions (Every Record)

Generate · Rewrite · Translate · Summarize · Analyze · Recommend · Forecast · Automate

See [AI_FIRST_ARCHITECTURE.md](../modules/ai/AI_FIRST_ARCHITECTURE.md) § Universal Actions.

---

## Safety & Permissions

| Rule | Detail |
|------|--------|
| RBAC | AI inherits user permissions — never elevated |
| AI OS | No direct DB — module Service APIs only |
| Low-risk | Draft generate auto-applies to draft fields |
| High-risk | Price, inventory, accounting, delete, bulk → **human approval** |
| Audit | Every action → `ai_audit_logs` (prompt, response, changes, approval) |
| Context | Auto-assembled by Context Engine — no manual paste |
| Opt-out | `feature_flags.ai.enabled` per company |

---

## Loading & Errors

- Streaming response with typing indicator
- Cancel button during generation
- Graceful fallback: "AI unavailable — try again later"
