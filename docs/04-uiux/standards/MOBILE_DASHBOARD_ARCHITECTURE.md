# AgainERP — Mobile Dashboard Architecture

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 09 — Dashboard Framework Architecture  
> **Authority:** [DASHBOARD_FRAMEWORK_ARCHITECTURE.md](./DASHBOARD_FRAMEWORK_ARCHITECTURE.md) · [MOBILE_NAVIGATION_ARCHITECTURE.md](./MOBILE_NAVIGATION_ARCHITECTURE.md)

---

## Purpose

Mobile-specific rules for dashboards — priority widgets, compact variants, swipe navigation, and KPI cards.

## When To Read

Read when setting `mobileSupport` on widgets or validating module mobile dashboard compliance.

## Related Files

- [WIDGET_REGISTRY_STANDARD.md](./WIDGET_REGISTRY_STANDARD.md) — mobileSupport field
- [DASHBOARD_LAYOUT_ENGINE.md](./DASHBOARD_LAYOUT_ENGINE.md) — responsive grid
- [mobile-first.md](./mobile-first.md) — 44px targets

## Read Next

§3 **Priority widgets** for workspace or module dashboard.

---

## 1. Mobile Dashboard Principles

| Principle | Rule |
|-----------|------|
| **Same data** | Mobile shows subset of desktop widgets — not different metrics |
| **Priority first** | Highest-value KPIs above fold |
| **Single column** | 1-col stack — [DASHBOARD_LAYOUT_ENGINE.md §2](./DASHBOARD_LAYOUT_ENGINE.md#2-column-layouts) |
| **Touch first** | 44px min targets on quick actions |
| **Swipe** | Horizontal swipe between dashboard views / sections |
| **No desktop-only blockers** | Critical approvals visible on mobile |

---

## 2. Mobile Widget Modes

| Registry value | Rendering |
|----------------|-----------|
| `full` | Full widget card in stack |
| `compact` | KPI card — value + label + trend only |
| `none` | Omitted from mobile layout |

### 2.1 Compact KPI Card

| Element | Shown |
|---------|-------|
| Label | yes |
| Value | yes |
| Trend arrow / % | yes |
| Chart | no |
| Drill link | tap → module detail |

### 2.2 Priority widget

Marked in registry: `mobilePriority: 1` (highest) … `n`

Engine sorts mobile stack by priority then desktop row order.

---

## 3. Priority Widgets by Dashboard

### 3.1 Workspace Home (mobile)

| Priority | Widget |
|----------|--------|
| 1 | AI Daily Brief (compact or full) |
| 2 | Pending approvals |
| 3 | Notifications alert |
| 4 | Quick actions strip |
| 5 | Recent activity |

### 3.2 Module dashboard (mobile)

| Priority | Widget |
|----------|--------|
| 1 | Top KPI (compact) × 2–4 in horizontal scroll |
| 2 | Pending tasks |
| 3 | Quick actions |
| 4 | Recent activities |
| 5 | Charts (full, below fold) |

Minimum **3 compact KPIs** with `mobileSupport: full|compact` per [MODULE_DASHBOARD_STANDARD.md](./MODULE_DASHBOARD_STANDARD.md).

### 3.3 Executive dashboard (mobile)

| Priority | Widget |
|----------|--------|
| 1 | AI Executive Summary |
| 2 | Revenue · Cash · Profit KPIs (horizontal scroll) |
| 3 | Critical alerts |
| 4 | Remaining sections — swipe or accordion |

---

## 4. Swipe Navigation

| Gesture | Action |
|---------|--------|
| Swipe left/right on KPI strip | Next KPI group |
| Swipe between tabs | Switch saved dashboard views |
| Pull to refresh | Refresh all interval widgets |
| Tap KPI card | Drill to module list filtered |

Dashboard views switcher: dropdown below title on mobile (not horizontal tabs if >3 views).

---

## 5. Mobile KPI Cards Row

Horizontal scroll container:

```text
┌────────┬────────┬────────┬────────┐
│ Orders │ Revenue│ Conv.  │ AOV    │  ← compact cards
└────────┴────────┴────────┴────────┘
        ← swipe →
```

Max **5** cards in strip — overflow to "View all KPIs" sheet.

---

## 6. Section Collapse

Long module dashboards use **accordion sections** on mobile:

| Section | Default state |
|---------|---------------|
| Overview / KPIs | Expanded |
| Recent Activities | Expanded |
| Charts | Collapsed |
| Reports links | Collapsed |
| AI Suggestions | Expanded if critical |

---

## 7. Bottom Nav Integration

When dashboard is active:

| Bottom slot | Behavior |
|-------------|----------|
| Home | Workspace dashboard |
| Search | Global search |
| AI | AI brief / context sheet |
| Notifications | Alert list |
| More | Module drawer |

Module-specific dashboards: Home slot → module dashboard — [MOBILE_NAVIGATION_ARCHITECTURE.md §3.2](./MOBILE_NAVIGATION_ARCHITECTURE.md#32-module-context-override)

---

## 8. Performance

| Rule | Detail |
|------|--------|
| Max widgets on mobile | 12 visible (rest lazy) |
| Chart lazy load | Below fold only |
| Image / chart density | Reduced points on small screens |
| Offline | KPI cache with stale indicator |

---

## 9. Compliance Checklist

| # | Check |
|---|-------|
| 1 | All required module sections have ≥1 mobile-capable widget |
| 2 | ≥3 KPI widgets with `compact` or `full` |
| 3 | Quick actions reachable without horizontal scroll |
| 4 | Pending tasks / approvals visible above fold |
| 5 | `mobilePriority` set on top 5 widgets |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 09 — mobile dashboard architecture |

---

**Mobile Dashboard Architecture** — priority KPIs, compact cards, swipe, one column.
