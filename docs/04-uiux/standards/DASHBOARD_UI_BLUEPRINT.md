# AgainERP — Dashboard UI Blueprint

> **Status:** Active — **dashboard UI SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 13 — Dashboard UI Design  
> **Governance:** [FINAL_UI_ARCHITECTURE_LOCK.md](../../FINAL_UI_ARCHITECTURE_LOCK.md) — APPROVED  
> **Architecture:** [DASHBOARD_ARCHITECTURE_LOCK.md](../../DASHBOARD_ARCHITECTURE_LOCK.md) — APPROVED

**Documentation only.** No mockups · No Figma specs · No implementation code.

---

## Purpose

Define the **official Dashboard UI blueprint** — dashboard types, section layouts, widget standards, grid rules, personalization, and responsive behaviour. All dashboards render inside **Zone D** (`WS-CONTENT-DASH`) using the platform layout engine.

## When To Read

Read before dashboard UI prototype design (Phase C per [UI_READINESS_REPORT.md](../../UI_READINESS_REPORT.md)) or before registering widgets in `ModuleManifest.md`.

## Authority

| Layer | Document | Scope |
|-------|----------|-------|
| UI governance | FINAL_UI_ARCHITECTURE_LOCK | Tokens · AI UI · mobile · prohibitions |
| Dashboard governance | DASHBOARD_ARCHITECTURE_LOCK | Types · ownership · widget rules · grid |
| **Dashboard UI** | **This document** | Layout · placement · interactions |

On conflict: DASHBOARD_ARCHITECTURE_LOCK for dashboard-specific rules; FINAL_UI_ARCHITECTURE_LOCK for cross-cutting UI.

**Layout ID:** `LAYOUT-DASHBOARD` — modules supply widget **data** only; they do not own the grid shell.

---

## 1. Dashboard Layout Overview

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Dashboard header — title · date filter · customize · save layout            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  WIDGET GRID (12-col desktop · 6-col tablet · 1-col mobile)                 │
│  ┌──────────┬──────────┬──────────┬──────────┐                              │
│  │ Widget   │ Widget   │ Widget   │ Widget   │  ← rows = 80px units         │
│  └──────────┴──────────┴──────────┴──────────┘                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Shell component | ID | Owner |
|-----------------|-----|-------|
| Dashboard container | `WS-CONTENT-DASH` | Platform |
| Widget chrome | `WS-CONTENT-WIDGET` | Platform |
| Widget body | Module / Core / AI OS data | Provider per widget registry |

### 1.1 Approved dashboard types

| Type ID | Route(s) | Blueprint section |
|---------|----------|-------------------|
| Workspace (`/home`) | `/home` | §2 |
| Personal | `dash.personal` — user home variant | §3 |
| Module | `/{module}/dashboard` | §4 |
| Executive | `/executive` · `/home/executive` | §5 |
| AI | `/ai-os/dashboard` | §6 |
| Role / Department / Industry | Templates per lock | Extends §2–§5 |

---

## 2. Workspace Dashboard UI

**Route:** `/home` · **Template:** `tpl.workspace.home`

Primary landing after login — cross-module summary for the active workspace context.

### 2.1 Section layout (top → bottom)

| Order | Section | Widget category | Placement (12-col) |
|-------|---------|-----------------|---------------------|
| 1 | **Welcome Area** | `analytics` or static chrome | Full width (12) — hero strip |
| 2 | **KPI Overview** | `kpi` × 4–6 | Row: 3×4 col or 4×3 col |
| 3 | **Quick Actions** | `quick_action` | 4 col |
| 4 | **Notifications** | `alert` · `list` | 4 col |
| 5 | **AI Briefing** | `ai` — Daily Brief | 8 col |
| 6 | **Recent Activities** | `activity` | 8 col · paired row with notifications |

### 2.2 Welcome Area UI

| Element | Content |
|---------|---------|
| Greeting | "Good morning, {name}" — timezone-aware |
| Context line | Active company · branch · fiscal period |
| Subtext | Optional workspace summary stat |
| Actions | None primary — informational only |

Uses shell page header — not a draggable widget.

### 2.3 KPI Overview UI

| Rule | Detail |
|------|--------|
| Count | 4–6 KPI cards visible on first paint |
| Component | KPI Card (§7.1) |
| Drill-down | Click card → module report or filtered list |
| Context | Respects workspace switcher — reload on company change |

### 2.4 Remaining sections

| Section | UI behaviour |
|---------|--------------|
| Quick Actions | Button group — same routes as `WS-HEADER-QUICK` |
| Notifications | Scrollable list — max 5 visible · "View all" link |
| AI Briefing | `DS-AI-BRIEFING` — bulleted summary · follow-up CTA |
| Recent Activities | Timeline feed — avatar · action · timestamp |

---

## 3. Personal Dashboard UI

**Type ID:** `dash.personal` · User-scoped view persisted by layout engine.

### 3.1 Section layout

| Order | Section | Widget category | Default width |
|-------|---------|-----------------|---------------|
| 1 | **My Tasks** | `list` · `calendar` | 6 col |
| 2 | **My Activities** | `activity` | 6 col |
| 3 | **My Approvals** | `alert` · `list` | 6 col |
| 4 | **My Calendar** | `calendar` | 6 col |
| 5 | **My Reports** | `report` · shortcuts | 12 col |

### 3.2 Personal dashboard UI rules

| Rule | Detail |
|------|--------|
| Visibility | `Private` or `Role` per permission model |
| Data scope | Current user only — `user_id` filter |
| Empty sections | `DS-EMPTY-*` — "No pending tasks" with CTA where applicable |
| Customization | User may add/remove widgets from personal catalog |
| Default landing | Optional user preference instead of workspace `/home` |

---

## 4. Module Dashboard UI

**Route:** `/{module}/dashboard` · **Type ID:** `dash.module` · **Template:** `tpl.module.standard`

Every installable business module **must** satisfy seven locked sections (mapped to UI regions below).

### 4.1 Standard layout regions

```text
┌─────────────────────────────────────────────────────────────────┐
│ TOP — KPI Cards (≥3)                                            │
│ [ KPI ] [ KPI ] [ KPI ] [ KPI optional ]                        │
├─────────────────────────────────────────────────────────────────┤
│ MIDDLE — Charts · Reports · Analytics                           │
│ [ Chart 8col ] [ Report shortcuts 4col ]                        │
│ [ Analytics / second chart 12col ]                              │
├─────────────────────────────────────────────────────────────────┤
│ BOTTOM — Activities · Tasks · AI Suggestions                    │
│ [ Activities 6col ] [ Tasks 6col ]                              │
│ [ AI Suggestions 12col ]  (when module has AI.md)               │
│ [ Quick Actions row ]                                           │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Locked section mapping

| # | Required section | UI region | Widget category |
|---|------------------|-----------|-----------------|
| 1 | Overview | Welcome strip or first KPI row subtitle | `analytics` |
| 2 | KPI Summary (≥3) | **Top** | `kpi` |
| 3 | Recent Activities | **Bottom** left | `activity` |
| 4 | Pending Tasks | **Bottom** right | `list` |
| 5 | Reports | **Middle** | `report` |
| 6 | AI Suggestions | **Bottom** full width | `ai` |
| 7 | Quick Actions | **Bottom** or top-right header | `quick_action` |

### 4.3 Module dashboard header

| Element | Rule |
|---------|------|
| Title | "{Module} Dashboard" |
| Date filter | Optional — affects chart/KPI widgets |
| Customize | Toggle edit mode (personalization) |
| Primary action | Module-specific — e.g. "New order" via quick action |

### 4.4 Module ownership boundary

Modules register widgets and supply API data — **never** custom dashboard grid or shell.

---

## 5. Executive Dashboard UI

**Routes:** `/executive` · `/home/executive` · **Type ID:** `dash.executive` · **Template:** `tpl.executive.standard`

Cross-module consolidated metrics — platform aggregation services only.

### 5.1 Section layout

| Section | Widget focus | Typical placement |
|---------|--------------|-------------------|
| **Revenue** | `kpi` + `chart` | Top row 6+6 col |
| **Profit** | `kpi` + `chart` | Top row |
| **Expenses** | `kpi` + `chart` | Second row |
| **Inventory** | `kpi` · `table` | 6 col |
| **Projects** | `kpi` · `list` | 6 col |
| **Marketing** | `chart` · `kpi` | 6 col |
| **Employees** | `kpi` · `table` | 6 col |
| **AI Executive Summary** | `ai` — briefing block | Full width 12 col |
| **Risk Indicators** | `alert` · `ai` | Full width or 6 col |

### 5.2 Executive UI rules

| Rule | Detail |
|------|--------|
| Permission | `dashboard.executive.view` + per-metric module permissions |
| Aggregation | Platform service — no cross-module DB in widgets |
| AI Executive Summary | `DS-AI-BRIEFING` — weekly/daily executive digest |
| Risk Indicators | `alert` widgets — severity badges · drill to source module |
| Mobile | KPI + AI summary prioritized — see §9 |

---

## 6. AI Dashboard UI

**Route:** `/ai-os/dashboard` · **Type ID:** `dash.ai`

Dedicated AI command center — complements header AI panel.

### 6.1 Section layout

| Order | Section | Widget category |
|-------|---------|-----------------|
| 1 | **AI Daily Brief** | `ai` |
| 2 | **AI Recommendations** | `ai` |
| 3 | **AI Insights** | `ai` |
| 4 | **AI Forecast** | `ai` · `chart` |
| 5 | **AI Opportunities** | `ai` · `list` |
| 6 | **AI Automations** | `ai` · `quick_action` |
| 7 | **AI Activity Log** | `activity` · `table` |

### 6.2 AI dashboard UI rules

| Rule | Detail |
|------|--------|
| Components | `DS-AI-*` families only — no custom AI chrome |
| Credits / gating | Inline message when AI unavailable — hide widgets, not broken shell |
| Tool transparency | Widget shows "Analyzing…" during tool calls |
| Audit | Activity log widget — read-only timeline |
| Module off | Entire dashboard hidden from nav — graceful hide |

---

## 7. Widget UI Standards

All widgets render inside **`WS-CONTENT-WIDGET`** chrome — platform-owned frame.

### 7.1 Widget types

| Type | Category ID | Component | Typical content |
|------|-------------|-----------|-----------------|
| **KPI Card** | `kpi` | `DS-CARD-KPI` | Metric · delta · sparkline optional |
| **Chart Widget** | `chart` | `DS-CARD-DEFAULT` + chart | Line · bar · pie — Recharts tokens |
| **Table Widget** | `table` | `DS-TABLE` / compact grid | Top N rows · drill to list |
| **Activity Widget** | `activity` | `DS-ACTIVITY-FEED` | Timeline stream |
| **Alert Widget** | `alert` | `DS-ALERT-*` | Warnings · approvals · risk flags |
| **AI Widget** | `ai` | `DS-AI-INSIGHTS` · `DS-AI-BRIEFING` | Narrative · recommendations |

**Widget ID format (locked):** `{module}.{kebab-name}`

### 7.2 Widget chrome anatomy

```text
┌─────────────────────────────────────────┐
│ Widget title              [⋯] [↻] [×] │  ← header: title · overflow · refresh · remove (edit mode)
├─────────────────────────────────────────┤
│                                         │
│  Widget body (loading · data · empty)   │
│                                         │
└─────────────────────────────────────────┘
```

| Chrome element | Visible when |
|----------------|--------------|
| Title | Always |
| Refresh | `refresh: manual` or interval widgets |
| Overflow ⋯ | Drill-down · export · configure |
| Remove × | Dashboard customize mode only |
| Drag handle | Customize mode — move/resize |

### 7.3 Widget states

| State | UI treatment | Component |
|-------|--------------|-----------|
| **Loading** | Skeleton matching widget shape | `DS-SKELETON-CARD` |
| **Empty** | Centered message + optional CTA | `DS-CARD-EMPTY` · `DS-EMPTY-*` |
| **Error** | Inline error + retry button | Error banner inside widget — no modal |
| **Success** | Normal data render | Default body |

| State rule | Detail |
|------------|--------|
| Loading delay | Show skeleton after 100ms |
| Error isolation | Widget error does not crash dashboard grid |
| Empty KPI | "No data for period" — adjust date filter hint |
| Stale data | Subtle "Updating…" badge during background refresh |

### 7.4 Widget sizing (locked)

| Property | Value |
|----------|-------|
| Grid columns | 1–12 span |
| Row height unit | **80px** |
| Default max height | **6 rows** (480px) |
| Min width | 3 columns (KPI) · 4 columns (chart) |
| Presets | 1 · 2 · 3 · 4 column layout templates |

---

## 8. Dashboard Layout Rules

### 8.1 Desktop (≥1024px) — 12 column grid

| Rule | Value |
|------|-------|
| Columns | **12** |
| Gutter | `--space-4` (16px) |
| Row unit | 80px |
| KPI row | Typically 4×3 col or 3×4 col |
| Chart | 6–12 col span |
| Full bleed widgets | 12 col only |

### 8.2 Tablet (768–1023px) — 6 column grid

| Rule | Value |
|------|-------|
| Columns | **6** (logical — widgets reflow) |
| KPI | 2×3 col (two per row) |
| Chart | 6 col full width |
| Side-by-side pairs | Stack when combined span > 6 |
| Customize mode | Move/resize enabled — snap to 6-col |

### 8.3 Mobile (<768px) — 1 column stack

| Rule | Value |
|------|-------|
| Layout | **Single column** — full width widgets |
| Order | Priority sort — see §9 |
| Resize/move | Disabled — fixed stack order |
| Customize | Add/remove only — no drag grid |
| Pull-to-refresh | Optional — refresh all visible widgets |

---

## 9. Mobile Dashboard UI

### 9.1 Priority order (stack top → bottom)

| Priority | Widget type | Reason |
|----------|-------------|--------|
| 1 | **KPI Cards** | `mobileSupport: full` or `compact` — ≥3 on module dashboards |
| 2 | **Tasks** | Actionable items |
| 3 | **Notifications / Alerts** | Time-sensitive |
| 4 | **AI Assistant / Briefing** | `DS-AI-BRIEFING` compact variant |
| 5 | Charts | Scroll below fold — `compact` mode |
| 6 | Activity feeds | Lower priority |
| 7 | Report shortcuts | List row |

### 9.2 Mobile widget behaviour

| Category | `mobileSupport` | UI |
|----------|-----------------|-----|
| KPI | `full` | Full card — metric · label · delta |
| KPI | `compact` | Single row — metric + label inline |
| Chart | `compact` | Reduced height · 3 rows max |
| Chart | `none` | Hidden on mobile |
| Table | `compact` | Max 3 rows · "View all" link |
| AI | `full` | Collapsible briefing |
| Activity | `compact` | 3 items · expand link |
| Quick action | `full` | Full-width buttons |

**Rule:** Every registered widget must declare `mobileSupport`: `full` · `compact` · `none`.

### 9.3 Mobile interaction

| Gesture | Action |
|---------|--------|
| Tap KPI | Drill-down to module list/report |
| Tap widget title | Expand compact widget if collapsible |
| Pull down | Refresh dashboard widgets |
| Long press (customize) | Not on mobile — use customize menu |

---

## 10. Dashboard Personalization UI

Owned by **platform layout engine** — not modules.

### 10.1 Supported actions

| Action | UI | Persisted |
|--------|-----|-----------|
| **Add Widget** | Catalog drawer — searchable widget list | Yes |
| **Remove Widget** | × on widget chrome in edit mode | Yes |
| **Resize Widget** | Drag corner handle — snap to grid | Yes |
| **Move Widget** | Drag handle — reorder in grid | Yes |
| **Save Layout** | Primary button "Save" in customize bar | Yes |
| **Reset Layout** | Secondary "Reset to default" — confirm dialog | Yes |

### 10.2 Customize mode UI

```text
┌─────────────────────────────────────────────────────────────────┐
│ ⚙ Customizing dashboard          [Reset] [Cancel] [Save layout] │
├─────────────────────────────────────────────────────────────────┤
│  Widget grid — drag handles visible · dashed drop zones         │
└─────────────────────────────────────────────────────────────────┘
```

| Rule | Detail |
|------|--------|
| Entry | "Customize" in dashboard header |
| Exit | Save · Cancel (revert unsaved) · navigate away confirm if dirty |
| Add widget | Opens catalog filtered by user permissions |
| Hidden widgets | Not in catalog — never show disabled |
| View types | User · Role · Department · Shared — per lock |
| Templates | Start from `tpl.module.standard` etc. |

### 10.3 Personalization rules

| Rule | Detail |
|------|--------|
| Dual permission | Dashboard permission **and** widget permission required |
| Default layout | Template applied on first visit |
| Module dashboards | User may personalize view — module cannot override engine |
| Executive | Restricted customize — role-based templates primarily |

---

## 11. Widget Placement Summary

| Dashboard | Top row | Middle | Bottom |
|-----------|---------|--------|--------|
| Workspace | KPI Overview | — | Quick Actions · Notifications · AI · Activities |
| Personal | — | Tasks · Activities · Calendar | Approvals · Reports |
| Module | KPI cards (≥3) | Charts · Reports | Activities · Tasks · AI · Quick Actions |
| Executive | Revenue · Profit · Expense KPIs | Domain charts/tables | AI Summary · Risk |
| AI | Daily Brief | Recommendations · Insights · Forecast | Opportunities · Automations · Log |

---

## 12. Interaction Rules

### 12.1 Navigation from widgets

| Interaction | Result |
|-------------|--------|
| KPI click | Navigate to filtered list or report |
| Chart segment click | Drill-down route per widget config |
| Table row click | `?view={id}` on entity list |
| Quick action click | List route + `?create=1` |
| Report shortcut | Analytics layout route |
| AI CTA | Open `DS-AI-PANEL` with context |

### 12.2 Permissions

| Rule | UI |
|------|-----|
| No widget permission | Widget omitted from grid and catalog |
| No dashboard permission | Route blocked — redirect to permitted home |
| Never | Show widget shell with "access denied" inside |

### 12.3 Context and refresh

| Event | Dashboard behaviour |
|-------|---------------------|
| Company/branch switch | Reload all widget data |
| Date filter change | Reload affected chart/KPI widgets |
| Manual refresh | Per-widget ↻ or dashboard-level refresh |
| Interval refresh | Per widget registry `refresh` strategy |

### 12.4 Prohibitions (locked)

```text
❌ Custom dashboard shell per module
❌ Module-owned layout persistence
❌ Cross-module DB in widget data
❌ AI widgets calling ORM directly
❌ Disabled/greyed widgets for forbidden metrics
```

---

## 13. Responsive Rules Summary

| Viewport | Grid | Customize | KPI min | Stack order |
|----------|------|-----------|---------|-------------|
| Desktop ≥1024px | 12 col | Full drag/resize | 4 across | Template layout |
| Tablet 768–1023px | 6 col | Full drag/resize | 2 across | Reflow |
| Mobile <768px | 1 col | Add/remove only | 1 across | §9.1 priority |

| Token / spacing | Value |
|-----------------|-------|
| Widget padding | `--space-4` mobile · `--space-6` desktop |
| Grid gap | 16px |
| Dashboard header | Shell page header — sticky with module nav |

---

## 14. Prototype Build Order

```text
1. WS-CONTENT-DASH container + dashboard header
2. 12-column grid with placeholder widgets
3. KPI Card widget (all states)
4. Chart widget (loading · empty · error)
5. Module dashboard template (tpl.module.standard)
6. Workspace dashboard sections (§2)
7. Customize mode — add · move · resize · save
8. Mobile single-column stack + priority order
9. Executive + AI dashboard section stubs
10. Widget drill-down navigation to list + drawer
```

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 13 — dashboard UI blueprint |

---

**Dashboard UI Blueprint** — five dashboard types · six widget standards · platform-owned grid.
