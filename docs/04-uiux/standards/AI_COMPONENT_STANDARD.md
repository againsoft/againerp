# AgainERP — AI Component Standard

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 10 — Enterprise Design System & UI Foundation  
> **Authority:** [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md)

---

## Purpose

Standards for **AI-first UI components** — assistant panel, chat, suggestions, actions, insights, and briefing surfaces.

## When To Read

Read when documenting AI features in module `AI.md`, dashboard widgets, or Menus screen specs.

## Related Files

- [AI_DASHBOARD_ARCHITECTURE.md](./AI_DASHBOARD_ARCHITECTURE.md)
- [ai-assistant-ui.md](./ai-assistant-ui.md)
- [AI_FIRST_ARCHITECTURE.md](../../06-ai/platform/ai/AI_FIRST_ARCHITECTURE.md)
- [DRAWER_MODAL_STANDARD.md](./DRAWER_MODAL_STANDARD.md)
- [EMPTY_STATE_STANDARD.md](./EMPTY_STATE_STANDARD.md)
- [UNIVERSAL_COMMAND_SYSTEM_STANDARD.md](./UNIVERSAL_COMMAND_SYSTEM_STANDARD.md)
- [WORKSPACE_CONTEXT_STANDARD.md](./WORKSPACE_CONTEXT_STANDARD.md)

## Read Next

§2 **Component taxonomy** — six AI component families.

---

## 1. AI-First Principle

Every major layout includes at least one **discoverable AI entry point**. AI components use the same tokens and overlay rules as the rest of the design system — no separate visual language.

| Principle | Rule |
|-----------|------|
| Context-aware | AI knows current module, record, and user role |
| Non-blocking | AI panel does not replace primary task UI |
| Transparent | Show when AI is acting; confirm destructive AI actions |
| Fallback | Graceful hide when AI module off or unavailable |

**Empty states:** AI first-run uses `DS-EMPTY-AI` — [EMPTY_STATE_STANDARD.md §6](./EMPTY_STATE_STANDARD.md#6-ai-recommended-action)

**Loading:** AI panel uses skeleton + streaming — [LOADING_STATE_STANDARD.md §5](./LOADING_STATE_STANDARD.md#5-widget-loading)

---

## 2. Component Taxonomy

| ID | Component | Purpose |
|----|-----------|---------|
| `DS-AI-PANEL` | AI Assistant Panel | Persistent chat in utility zone |
| `DS-AI-CHAT` | AI Chat | Conversation thread + input |
| `DS-AI-SUGGESTIONS` | AI Suggestions | Contextual prompt chips |
| `DS-AI-ACTIONS` | AI Actions | One-click AI operations on records |
| `DS-AI-INSIGHTS` | AI Insights | Inline cards, anomaly flags |
| `DS-AI-BRIEFING` | AI Briefing | Daily/weekly summary blocks |

---

## 3. AI Assistant Panel (`DS-AI-PANEL`)

| Property | Desktop | Mobile |
|----------|---------|--------|
| Placement | Right utility drawer, 400px | Full-screen sheet |
| Trigger | Header ✨ · `Ctrl+I` · FAB · Command palette | Same |
| z-index | 65 (context drawer tier) | 70 |

**Anatomy:**

```text
Header — ✨ AgainERP Assistant · minimize · close
Context bar — Module · Record name (when applicable)
Chat thread — DS-AI-CHAT
Suggestions — DS-AI-SUGGESTIONS
Input — "Ask anything…" + Send
```

Detail: [ai-assistant-ui.md](./ai-assistant-ui.md)

---

## 4. AI Chat (`DS-AI-CHAT`)

| Element | Standard |
|---------|----------|
| User message | Right-aligned bubble, `--color-primary-subtle` |
| Assistant message | Left-aligned, markdown-safe rendering |
| Tool call indicator | "Searching products…" with spinner |
| Error | Inline retry, non-modal |
| History | Scrollable; load more on long threads |

**Streaming:** Token-by-token display with cursor; cancel button when running.

---

## 5. AI Suggestions (`DS-AI-SUGGESTIONS`)

| Rule | Detail |
|------|--------|
| Count | 3–5 chips max visible |
| Source | Record type + role + recent actions |
| Click | Inserts prompt into chat input |
| Refresh | On record navigation |

Examples: "Write product description" · "Summarize order" · "Explain variance"

---

## 6. AI Actions (`DS-AI-ACTIONS`)

| Pattern | Usage |
|---------|-------|
| Toolbar button | "✨ Generate with AI" on forms |
| Row action | "AI classify" in lists |
| Bulk action | "AI tag selected" (permission-gated) |

**Rules:**

- Confirm before irreversible AI mutations
- Show preview before apply when output is structured (JSON, table)
- Log AI actions in activity feed

---

## 7. AI Insights (`DS-AI-INSIGHTS`)

| Placement | Example |
|-----------|---------|
| Dashboard widget | `dash.ai` widgets — [AI_DASHBOARD_ARCHITECTURE.md](./AI_DASHBOARD_ARCHITECTURE.md) |
| Record banner | "Stock may run out in 5 days" |
| List inline | Anomaly icon + tooltip |
| KPI card | Trend narrative subtitle |

Visual: `DS-CARD-DEFAULT` with ✨ icon · `--color-info-subtle` border optional.

---

## 8. AI Briefing (`DS-AI-BRIEFING`)

| Type | Placement |
|------|-----------|
| Daily briefing | `/home` widget or top of module dashboard |
| Weekly executive | Executive dashboard |
| Module digest | Module dashboard hero block |

**Content:** Bulleted summary · linked drill-downs · "Ask follow-up" CTA → opens AI panel.

---

## 9. Empty & Offline States

| State | UI |
|-------|-----|
| AI module disabled | Hide AI entry points — no broken UI |
| Loading model | Skeleton in panel |
| Rate limited | Inline message + retry timer |
| No suggestions | Hide suggestion row |

---

## 10. Accessibility & Safety

| Requirement | Rule |
|-------------|------|
| Keyboard | Panel focusable; Escape closes |
| Screen reader | Announce new assistant messages |
| PII | Never display raw secrets in chat |
| Human review | Required for payroll, legal, financial postings |

---

## 11. Module Integration

Modules register AI capabilities in `AI.md`:

- Suggested prompts per entity
- Allowed AI actions with permission keys
- Insight hooks (optional widget data)

Modules **must not** build custom AI panel chrome — use `DS-AI-*` components.

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 10 — AI component standard |

---

**AI Component Standard** — six families, context-aware, same tokens as enterprise UI.
