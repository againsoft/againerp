# Sales & Marketing Workspace — Master Layout UI Design

> **Status:** Draft (Ready for implementation)  
> **Version:** 1.0  
> **Document Type:** UI Design · Step UI-01  
> **Route namespace:** `/sales-marketing/*`  
> **Screen ID:** `SCR-SMW-SHELL-001`  
> **Parent:** [README.md](./README.md) · [SMW_UI_BUILD_GUIDE.md](../SMW_UI_BUILD_GUIDE.md)  
> **Governance:** [ENTERPRISE_UI_ARCHITECTURE.md](../../../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md) · [layout-architecture.md](../../../04-uiux/standards/layout-architecture.md) · [PROJECT_COMMON_RULES.md](../../../00-foundation/PROJECT_COMMON_RULES.md)

**No component code.** Defines shell zones, navigation, responsive behavior, and global chrome.

---

## Executive summary

The SMW shell wraps every screen in a **three-zone workspace**: global admin chrome (existing) + **module sidebar** + **workspace canvas**. Design language: **60% Odoo · 20% Shopify Admin · 10% Notion · 10% Linear**.

| Reference module | Copy from |
|------------------|-----------|
| Module sidebar + nav | `components/hr/hr-module-layout.tsx` |
| Top breadcrumb | `components/navigation/top-breadcrumb.tsx` |
| Scope switchers | `components/layout/scope-switchers.tsx` |
| AI drawer trigger | `components/layout/admin-header.tsx` |

---

## 1. Workspace shell diagram

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ GLOBAL ADMIN HEADER (existing) — company · branch · search · AI · notify     │
├──────────┬───────────────────────────────────────────────────────────────────┤
│ MODULE   │ WORKSPACE HEADER (module)                                         │
│ SIDEBAR  │ Breadcrumb · page title · primary actions · view toggles          │
│ 220px    ├───────────────────────────────────────────────────────────────────┤
│ collaps  │                                                                   │
│          │ MAIN CANVAS (scroll)                                              │
│          │ filters · toolbar · table/kanban/builder                            │
│          │                                                                   │
│          │ optional RIGHT RAIL (xl+) — AI insights · context                 │
└──────────┴───────────────────────────────────────────────────────────────────┘
```

---

## 2. Module sidebar

### 2.1 Width & collapse

| Breakpoint | Sidebar | Behavior |
|------------|---------|----------|
| `lg+` | 220px expanded / 56px icon-only | Persist via `smwModuleNavCollapsed` in app store |
| `< lg` | Off-canvas sheet | Hamburger in workspace header |

### 2.2 Navigation items (order)

| # | Label | Route | Icon |
|---|-------|-------|------|
| 1 | Dashboard | `/sales-marketing/dashboard` | LayoutDashboard |
| 2 | Leads | `/sales-marketing/leads` | UserPlus |
| 3 | Opportunities | `/sales-marketing/opportunities` | GitBranch |
| 4 | Quotations | `/sales-marketing/quotations` | FileText |
| 5 | Campaigns | `/sales-marketing/campaigns` | Megaphone |
| 6 | Activities | `/sales-marketing/activities` | CalendarCheck |
| 7 | Targets | `/sales-marketing/targets` | Target |
| 8 | Commission | `/sales-marketing/commission` | Wallet |
| 9 | Teams | `/sales-marketing/teams` | Users |
| 10 | Reports | `/sales-marketing/reports` | BarChart3 |
| 11 | AI Copilot | `/sales-marketing/ai` | Sparkles |
| — | divider | — | — |
| 12 | Settings | `/sales-marketing/settings` | Settings |

Active item: `bg-primary/10 text-primary font-medium`.

### 2.3 Module header block (top of sidebar)

```text
┌─────────────────────────┐
│ [icon] Sales & Marketing│
│ Revenue Operations      │
└─────────────────────────┘
```

---

## 3. Workspace header (per page)

| Zone | Content |
|------|---------|
| Left | Breadcrumb: `Sales & Marketing › {Section} › {Sub}` |
| Center | `page-title` + optional `page-subtitle` |
| Right | Primary CTA (e.g. “New lead”) · secondary · `ActivityTriggerButton` |

Height: **48–56px**, sticky under global header.

---

## 4. Breadcrumb rules

| Route | Trail |
|-------|-------|
| `/sales-marketing/dashboard` | Sales & Marketing › Dashboard |
| `/sales-marketing/leads` | Sales & Marketing › Leads |
| `/sales-marketing/leads/[id]` | … › Leads › {Lead name} |
| `/sales-marketing/opportunities` | … › Opportunities |

Register in `lib/navigation/breadcrumbs.ts`.

---

## 5. Right rail (optional)

Used on: Leads list, Pipeline, Dashboard (manager view).

| Width | `280px` on `xl+` |
| Content | AI insights, KPI mini-cards, filters summary |
| Mobile | Bottom sheet or tab “Insights” |

---

## 6. URL conventions (global)

| Param | Purpose | Conflicts with |
|-------|---------|----------------|
| `?create=1` | Open create drawer | `view`, `edit` |
| `?view={id}` | View drawer | `create`, `edit` |
| `?edit={id}` | Edit drawer | `create`, `view` |
| `?layout=table\|kanban` | List view mode | — |
| `?screen=` | Multi-screen workspaces | — |
| `?tab=` | 360 page tabs only | — |

**Rule:** drawer params mutual exclusion (clear others when one opens).

---

## 7. Responsive matrix

| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Module sidebar | Fixed | Collapsible | Sheet |
| Toolbar filters | Inline row | Wrap | Filter sheet |
| Primary CTA | Header right | Header | FAB bottom-right |
| Drawer | `max-w-3xl` right sheet | full width | full width |
| Table | AG Grid / TanStack | horizontal scroll | Card list |

Min tap target: **44px**.

---

## 8. Accessibility

- `<main id="smw-main">` landmark on canvas  
- Skip link: “Skip to main content”  
- Sidebar: `<nav aria-label="Sales and Marketing">`  
- Collapse toggle: `aria-expanded`  
- Focus return to trigger on drawer close  

---

## 9. Implementation checklist (Impl Step 01)

- [ ] `app/(admin)/sales-marketing/layout.tsx`
- [ ] `components/sales-marketing/smw-module-layout.tsx`
- [ ] `components/sales-marketing/smw-nav.tsx`
- [ ] `components/sales-marketing/smw-page-shell.tsx`
- [ ] Register routes in `lib/navigation.ts` + admin sidebar link
- [ ] Breadcrumbs in `lib/navigation/breadcrumbs.ts`
- [ ] Redirect `/sales-marketing` → `/sales-marketing/dashboard`

---

## 10. Figma / wireframe notes

Grayscale boxes · annotate zone labels · sidebar item list · one desktop + one mobile frame.

---

**Last updated:** 2026-06-18
