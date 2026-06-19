# HR & Payroll — Design System Specification

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Scope:** HR & Payroll reference implementation → **AgainERP Global Design System**  
> **Document Type:** Design System Architecture Specification  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_UI_UX_BLUEPRINT.md](../../03-business-modules/hr-payroll/HR_UI_UX_BLUEPRINT.md) · [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../../03-business-modules/hr-payroll/HR_FIGMA_WIREFRAME_BLUEPRINT.md) · [uiux/HR_NAVIGATION_ARCHITECTURE.md](../../03-business-modules/hr-payroll/uiux/HR_NAVIGATION_ARCHITECTURE.md) · [uiux/HR_DASHBOARD_UI_ARCHITECTURE.md](../../03-business-modules/hr-payroll/uiux/HR_DASHBOARD_UI_ARCHITECTURE.md) · [uiux/EMPLOYEE_PROFILE_UI_ARCHITECTURE.md](../../03-business-modules/hr-payroll/uiux/EMPLOYEE_PROFILE_UI_ARCHITECTURE.md) · [uiux/HR_APPROVAL_CENTER_UI_ARCHITECTURE.md](../../03-business-modules/hr-payroll/uiux/HR_APPROVAL_CENTER_UI_ARCHITECTURE.md) · [uiux/HR_ACTIVITY_TIMELINE_UI_ARCHITECTURE.md](../../03-business-modules/hr-payroll/uiux/HR_ACTIVITY_TIMELINE_UI_ARCHITECTURE.md)  
> **Governance:** [UI_UX_DESIGN_STANDARDS.md](../standards/UI_UX_DESIGN_STANDARDS.md) · [ENTERPRISE_UI_ARCHITECTURE.md](../standards/ENTERPRISE_UI_ARCHITECTURE.md) · [design-system.md](../standards/design-system.md) · [components.md](../standards/components.md) · [PROJECT_COMMON_RULES.md](../../00-foundation/PROJECT_COMMON_RULES.md) · [SAAS_PLATFORM_ARCHITECTURE.md](../../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md) · [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md)

**No frontend code. No CSS. No implementation.**  
Defines the **complete design system specification** for AgainERP HR & Payroll — the first full-domain reference that evolves into the **AgainERP Global Design System**. Foundation for Figma library, design tokens, component library, UI consistency, and AI-first UX.

**Design formula (platform canonical):**

```text
AgainERP UI = 60% Odoo + 20% Shopify Admin + 10% Notion + 10% Linear
```

**Token namespace:** `DS-*` (design system) · **Component namespace:** `CMP-*` · **Figma prefix:** `DS/`

---

## Executive Summary

| Goal | Mechanism |
|------|-----------|
| **One shell forever** | Same layout, tokens, components across all modules |
| **Familiar to ERP users** | Odoo-density lists, chatter, smart buttons |
| **Modern admin clarity** | Shopify table polish, clean headers |
| **Readable forms** | Notion section blocks, minimal chrome |
| **Fast power-user UX** | Linear shortcuts, status chips, command palette |
| **AI-native** | ✨ components with explainability built in |
| **SaaS-ready** | Multi-company, RBAC-hidden UI, tenant theming hooks |

**Evolution path:** `HR_DESIGN_SYSTEM_SPECIFICATION.md` → `docs/ui-ux/design-system.md` (tokens) + `apps/web` component library

---

# Design Philosophy

### Core belief

> **AgainERP should feel like the ERP veterans already know — but faster, clearer, and ready for AI.**

HR & Payroll is the **stress test** for the global system: dense data (employees, payroll), high-stakes actions (lock, approve), mobile ESS, and AI auditor surfaces. Patterns proven here become mandatory for CRM, Sales, Purchase, Inventory, and all future modules.

### What we adopt (not clone)

| Source | Weight | Patterns |
|--------|--------|----------|
| **Odoo** | 60% | Sidebar nav, form tabs, chatter/timeline, smart buttons, approval inbox on record |
| **Shopify Admin** | 20% | Clean page headers, filter bars, table density, empty states |
| **Notion** | 10% | Section blocks, inline labels, collapsible groups, calm whitespace |
| **Linear** | 10% | Command palette, keyboard shortcuts, status pills, issue-style density |

### What AgainERP is not

| Not | Why |
|-----|-----|
| Pixel clone of Odoo/Shopify | Unique brand; semantic tokens |
| Consumer app aesthetics | Enterprise density and audit |
| Per-module redesign | One design system |
| Decorative UI | Every element serves workflow |

---

# Design Principles

| # | Principle | Specification |
|---|-----------|---------------|
| 1 | **One primary action** | One primary button per header/section |
| 2 | **Progressive disclosure** | Summary → drawer → tabs |
| 3 | **Permission-invisible** | Hide unavailable actions — never disabled tease |
| 4 | **Drawer CRUD** | List + sheet — no `/new` routes |
| 5 | **Status at a glance** | Semantic badges on every stateful entity |
| 6 | **Audit adjacent** | Activity access within one click |
| 7 | **Multi-company aware** | Scope chips in header when relevant |
| 8 | **Density with breath** | Compact tables + section spacing |
| 9 | **Keyboard path** | All flows completable without mouse |
| 10 | **AI explains** | No black-box AI surfaces |

---

# UX Principles

Aligned with [HR_UI_UX_BLUEPRINT.md](../../03-business-modules/hr-payroll/HR_UI_UX_BLUEPRINT.md):

| Domain | UX rule |
|--------|---------|
| **Lists** | AG Grid / DataTable default; saved filters |
| **Dashboards** | Zones A–H pattern; KPI → action → insight |
| **Profile 360°** | `max-w-5xl` drawer; tab deep links |
| **Payroll** | SoD warnings, lock banners, stepper workbench |
| **Approvals** | Global inbox + embedded panel |
| **ESS** | Mobile-first; bottom nav; 44px targets |
| **AI** | Right panel `Ctrl+J`; insight cards on dashboards |

**Perceived performance:** < 200ms interaction feedback; skeleton within 100ms

---

# Accessibility Principles

WCAG 2.1 AA minimum — per [design-system.md](../standards/design-system.md):

| Requirement | Rule |
|-------------|------|
| **Contrast** | 4.5:1 body text; 3:1 large text and UI |
| **Focus** | Visible `:focus-visible` ring on all interactives |
| **Keyboard** | Logical tab order; focus trap in modals |
| **Screen readers** | Semantic landmarks; `aria-label` on icon-only |
| **Motion** | Respect `prefers-reduced-motion` |
| **Status** | Never color-only — icon + label |
| **Forms** | Labels linked; errors in `aria-live` |
| **Touch** | 44×44px minimum tap targets (ESS mandatory) |

---

# AI First Design Principles

Per [uiux/HR_AI_ASSISTANT_UI_ARCHITECTURE.md](../../03-business-modules/hr-payroll/uiux/HR_AI_ASSISTANT_UI_ARCHITECTURE.md):

| Principle | Component implication |
|-----------|---------------------|
| **Context awareness** | AI panel shows context chips |
| **Explainability** | `CMP-AI-EXPLAIN-001` on every insight |
| **Transparency** | Confidence badge + model metadata footer |
| **Actionability** | CTA: Navigate · Apply · Dismiss |
| **Human control** | No auto-approve/auto-lock affordances |
| **Inheritance** | AI never shows data user cannot read |

**Visual language:** ✨ sparkle motif for AI — distinct from primary brand actions

---

# Foundation Layer

Semantic architecture — implementation via design tokens in [design-system.md](../standards/design-system.md). **No raw hex in components.**

---

## Color Strategy

**Semantic-only architecture** — maps to CSS variables at implementation time.

| Role | Token family | Usage |
|------|--------------|-------|
| **Primary** | `--color-primary` | Brand, primary CTA, active nav |
| **Secondary** | `--color-secondary` | Secondary actions, borders |
| **Success** | `--color-success` / `--status-success` | Approved, active, complete |
| **Warning** | `--color-warning` / `--status-warning` | Pending, attention |
| **Danger** | `--color-danger` / `--status-danger` | Error, reject, delete |
| **Info** | `--color-info` / `--status-info` | Informational, tips |
| **Neutral** | `--color-text`, `--color-border`, `--color-surface` | Chrome, backgrounds |

### State colors

| State | Application |
|-------|-------------|
| **Hover** | `--color-primary-hover`, subtle bg on rows |
| **Active** | Pressed button; nav active item |
| **Selected** | `--color-primary-subtle` row/cell |
| **Disabled** | Reduced opacity + no pointer |
| **Focused** | Focus ring token — primary outline |

**HR extensions:** Payroll lock = danger banner; compliance = warning strip  
**Theming:** Tenant primary override via SaaS branding layer — semantic mapping preserved

---

## Typography Strategy

| Role | Token | Usage |
|------|-------|-------|
| **Display** | `--text-2xl`+ | Executive dashboards, rare |
| **Heading** | `--text-xl` | Page titles |
| **Title** | `--text-lg` | Section headers, drawer titles |
| **Body** | `--text-sm` / `--text-base` | Default content; 16px min on mobile body |
| **Caption** | `--text-xs` | Table meta, timestamps |
| **Label** | `--text-sm` medium | Form labels, KPI labels |

**Font stack:** System UI stack — no custom webfont required for v1  
**Line height:** 1.5 body · 1.25 headings · **Max prose:** 75 characters

---

## Spacing Strategy

4px base unit — token names only:

| Scale | Token | Value | Tier |
|-------|-------|-------|------|
| Micro | `--space-1` | 4px | Icon gaps |
| Small | `--space-2` | 8px | Inline, chips |
| Medium | `--space-3`–`4` | 12–16px | Input padding, card mobile |
| Large | `--space-6` | 24px | Section gaps |
| Extra large | `--space-8`–`12` | 32–48px | Page sections |

**Touch spacing:** 8px between interactives; 44px min target height

---

## Grid Strategy

12-column dashboard grid — per [uiux/HR_DASHBOARD_UI_ARCHITECTURE.md](../../03-business-modules/hr-payroll/uiux/HR_DASHBOARD_UI_ARCHITECTURE.md)

| Breakpoint | Columns | Gutter | Behavior |
|------------|---------|--------|----------|
| **Desktop** (≥1024px) | 12 | 24px | Multi-zone dashboards |
| **Tablet** (768–1023px) | 12 | 16px | Stacked zones |
| **Mobile** (<768px) | 4 | 16px | Single column cards |

**Container widths:** Full fluid to `max-w-screen-2xl` (1536px) shell; content `max-w-7xl` for forms  
**ESS:** Centered column ~480px effective on phone

---

## Elevation Strategy

| Level | Token | Usage |
|-------|-------|-------|
| 0 | `--shadow-none` | Tables, flat panels |
| 1 | `--shadow-sm` | Cards, inputs |
| 2 | `--shadow-md` | Dropdowns, popovers |
| 3 | `--shadow-lg` | Drawers, modals |

**Rule:** One elevation-3 surface visible at a time

---

## Border Strategy

| Token | Usage |
|-------|-------|
| `--radius-sm` (4px) | Badges, chips |
| `--radius-md` (8px) | Buttons, inputs, cards |
| `--radius-lg` (12px) | Sheets, modals |
| `--radius-full` | Avatars, pills |
| `--color-border` | 1px dividers |

**Odoo influence:** Subtle borders over heavy shadows on data surfaces

---

## Icon Strategy

| Set | Library | Default size |
|-----|---------|--------------|
| **UI icons** | Lucide outline | 20px · 16px dense tables |
| **Module icons** | Lucide + fixed module color chip | Sidebar |
| **Status icons** | Paired with badge — never alone | |
| **AI icons** | Sparkles variant | ✨ family |

**Categories:** Navigation · Status · Action · Module · AI — catalog in Figma `DS/Icons/`

---

## Illustration Strategy

| Context | Style |
|---------|-------|
| **Empty states** | Simple line illustrations · grayscale + primary accent |
| **Onboarding** | Optional — not decorative elsewhere |
| **Error pages** | Icon + message — no heavy art |

**Wireframe phase:** Gray placeholder boxes per [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../../03-business-modules/hr-payroll/HR_FIGMA_WIREFRAME_BLUEPRINT.md)

---

# Color System

See [status-system.md](../standards/status-system.md) for universal status mapping.

### Semantic palette roles

| Semantic | HR examples |
|----------|-------------|
| **Primary** | Save, Apply, active nav |
| **Secondary** | Cancel, filter reset |
| **Success** | Approved leave, published payslip |
| **Warning** | Pending approval, probation |
| **Danger** | Reject, terminate, payroll exception |
| **Info** | Policy tip, AI insight info |
| **Neutral** | Draft, archived, disabled |

### State colors (interaction)

Documented under Color Strategy — all interactive components support: default · hover · active · selected · disabled · focused

---

# Typography System

### Type scale (canonical)

| Level | Size | Weight | Line height | Use |
|-------|------|--------|-------------|-----|
| Display | 24–30px | 700 | 1.2 | Dashboard hero KPI |
| Heading | 20px | 600 | 1.25 | Page title |
| Title | 18px | 600 | 1.3 | Section, drawer header |
| Body | 14–16px | 400 | 1.5 | Content, table |
| Caption | 12px | 400 | 1.4 | Meta, helper |
| Label | 14px | 500 | 1.4 | Form labels |

**Monospace:** Audit IDs, correlation IDs in timeline detail (optional token)

---

# Grid System

### Responsive rules

| Rule | Spec |
|------|------|
| Mobile-first | Design at 375px, enhance upward |
| Sidebar | Hidden < md; overlay hamburger |
| Tables | Card fallback < md |
| Drawers | Full-width < md |
| Dashboard | Zones stack on mobile |
| Utility panel | Bottom sheet < lg |

### Container widths

| Context | Max width |
|---------|-----------|
| Admin shell | 1536px |
| Form content | 720px |
| Drawer default | 560px |
| Drawer wide (profile, payroll) | 896px (`max-w-5xl`) |
| AI panel | 400px |

---

# Spacing System

### Application map

| Tier | Tokens | Components |
|------|--------|------------|
| **Micro** | 4px | Icon-text gap, badge padding-x |
| **Small** | 8px | Chip gap, inline button groups |
| **Medium** | 12–16px | Input padding, card padding mobile |
| **Large** | 24px | Between form sections |
| **Extra large** | 32–48px | Dashboard zone gaps |

---

# Icon System

| Category | Examples (Lucide) |
|----------|-------------------|
| **Navigation** | Home, Users, Calendar, Settings |
| **Status** | Check, X, Clock, AlertTriangle |
| **Action** | Plus, Pencil, Trash, Download |
| **Module** | Briefcase (HR), Wallet (Payroll), ShoppingCart |
| **AI** | Sparkles, Bot, Wand |

**Module icon color:** Subtle chip background — not full brand fill

---

# Component Hierarchy

Atomic design — aligns with [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../../03-business-modules/hr-payroll/HR_FIGMA_WIREFRAME_BLUEPRINT.md):

```text
Atoms        → Button, Input, Badge, Icon, Avatar, Label
Molecules    → KPI Card, Filter chip, Table row, Tab item, Timeline item
Organisms    → Page header, Filter bar, Data table, Dashboard grid, Workbench
Templates    → List+Drawer, Dashboard zones, ESS shell, Approval workspace
Pages        → SCR-* screen compositions (wireframe only in planning)
```

**Naming:** Figma `DS/{Layer}/{Component}` · Code category mapping in Frontend Mapping section

---

# Button System

**Component ID:** `CMP-BTN-*`

| Variant | Use | Visual |
|---------|-----|--------|
| **Primary** | Main action | Filled primary |
| **Secondary** | Cancel, back | Filled neutral |
| **Ghost** | Toolbar, table row | Transparent hover |
| **Outline** | Tertiary filters | Border only |
| **Danger** | Delete, reject confirm | Danger fill/outline |
| **AI Action** | AI Apply, Generate | Primary + ✨ icon; distinct hover |

### States & sizes

| Property | Values |
|----------|--------|
| **States** | default, hover, active, focus, disabled, loading |
| **Sizes** | sm (32px), md (40px), lg (48px mobile CTA) |
| **Loading** | Spinner replaces label; width preserved |
| **Disabled** | No click; aria-disabled |
| **Icon** | Leading/trailing; icon-only requires tooltip + aria-label |

**Rules:** One primary per section; danger never primary; payroll lock uses danger confirm modal

---

# Input System

**Component ID:** `CMP-INP-*`

| Type | Use |
|------|-----|
| **Text** | Names, codes |
| **Number** | Quantities, days |
| **Date** | Leave range, period |
| **Search** | List filter, global search |
| **Password** | Auth |
| **Phone** | E.164 with country |
| **Currency** | Amount with symbol |

### Validation UX

| Element | Spec |
|---------|-----|
| **Error state** | Danger border + message below |
| **Helper text** | Caption below field |
| **Character limits** | Counter when max set |
| **Required** | Asterisk + `aria-required` |

**Mobile:** 16px min font on inputs to prevent iOS zoom

---

# Form System

**Component ID:** `CMP-FRM-*`

| Pattern | Use |
|---------|-----|
| **Single column** | Mobile default |
| **Two column** | Desktop wide forms |
| **Form sections** | Notion-style blocks with titles |
| **Validation** | On blur + submit; inline errors |
| **Autosave** | Draft indicator on long forms (profile) |
| **Wizard** | Payroll run, import — stepper + sticky footer |

**Sticky footer:** Primary actions on mobile forms

---

# Table System

*Critical section* — Odoo density + Shopify clarity

**Component ID:** `CMP-TBL-*`

| Variant | Density | Use |
|---------|---------|-----|
| **Standard** | Default row height | Most lists |
| **Compact** | Reduced padding | Finance, audit |
| **Advanced** | AG Grid features | HR employees, payroll |
| **Analytics** | Embedded in reports | Pivot-friendly |

### Features (all variants where applicable)

| Feature | Spec |
|---------|------|
| **Sorting** | Column header; `aria-sort` |
| **Filtering** | Filter bar + column filters |
| **Column management** | Show/hide, reorder, persist |
| **Bulk actions** | Selection checkbox + action bar |
| **Export** | Toolbar; activity logged |
| **Row actions** | Ghost buttons or ⋯ menu |
| **Sticky columns** | First column + actions on scroll |

**Mobile:** Card list fallback — label/value pairs  
**Empty state:** `CMP-EMPTY-001` with CTA

---

# Card System

**Component ID:** `CMP-CARD-*`

| Type | Anatomy | Use |
|------|---------|-----|
| **KPI Card** | Label + value + delta + drill link | `WGT-*-KPI-*` |
| **Summary Card** | Title + metrics row | Profile overview |
| **Analytics Card** | Title + chart area | Dashboard Zone C |
| **Employee Card** | Avatar + name + meta + chevron | Mobile lists |
| **Approval Card** | Type + requester + actions | Inbox mobile |
| **AI Insight Card** | ✨ + title + confidence + CTAs | `CMP-AI-CARD-INSIGHT-001` |

**Padding:** md mobile · lg desktop · border or shadow-sm

---

# Badge System

**Component ID:** `CMP-BDG-*`

| Type | Example |
|------|---------|
| **Status** | Active, Draft, Locked |
| **Priority** | Critical, High, Medium, Low |
| **Approval** | Pending, Approved, Rejected |
| **Risk** | AI risk level |
| **AI** | Confidence high/medium/low |

**Sizes:** sm (table) · md (header) · lg (summary)  
**Rule:** Text always present — per [status-system.md](../standards/status-system.md)

---

# Status System

Universal tokens — HR mappings:

| Status | Token | HR example |
|--------|-------|------------|
| **Active** | success | Active employee |
| **Inactive** | archived | Terminated |
| **Pending** | pending | Leave awaiting approval |
| **Approved** | approved | Approved request |
| **Rejected** | rejected | Rejected leave |
| **Archived** | archived | Old structure |
| **Draft** | draft | Payroll run draft |
| **Locked** | danger/warning | Payroll locked |

**Payroll lock:** Dedicated banner component `CMP-BNR-PAY-LOCK-001` — not badge alone

---

# Tab System

**Component ID:** `CMP-TAB-*`

| Variant | Use |
|---------|-----|
| **Horizontal** | Profile tabs, settings |
| **Vertical** | Settings sidebar (rare) |
| **Scrollable** | Many tabs on mobile |
| **Context** | URL `&tab=` deep links |

**Employee profile:** 14 tabs per [EMPLOYEE_PROFILE_UI_ARCHITECTURE.md](../../03-business-modules/hr-payroll/uiux/EMPLOYEE_PROFILE_UI_ARCHITECTURE.md)

---

# Drawer System

**Component ID:** `CMP-DRW-*` (Sheet pattern)

| Type | Width | Use |
|------|-------|-----|
| **Quick view** | 400px | Preview record |
| **Details** | 560px default | Standard CRUD view |
| **Wide details** | 896px | Employee profile, payroll |
| **Approval** | 896px | Approval workspace |
| **Activity** | 480px | Global activity drawer |
| **AI** | 400px | AI panel |

**Mobile:** Full-width sheet · swipe down dismiss (non-destructive)  
**URL:** `?view={id}` · `?edit={id}` · `?create=1`

---

# Modal System

**Component ID:** `CMP-MDL-*`

| Type | Use |
|------|-----|
| **Confirmation** | Approve, generic confirm |
| **Approval** | Reject with comment required |
| **Delete** | Danger confirm |
| **Warning** | SoD violation, payroll lock |
| **AI Recommendation** | Apply AI proposal preview |

**Anatomy:** Overlay · header · body · footer (secondary left, primary right)  
**Focus trap** · Escape dismisses non-destructive

---

# Timeline System

Based on [uiux/HR_ACTIVITY_TIMELINE_UI_ARCHITECTURE.md](../../03-business-modules/hr-payroll/uiux/HR_ACTIVITY_TIMELINE_UI_ARCHITECTURE.md):

| Component | ID |
|-----------|-----|
| **Timeline cards** | `CMP-TML-CARD-001` |
| **Timeline events** | `CMP-TML-STREAM-001` |
| **Timeline filters** | `CMP-TML-FILTER-001` |
| **Timeline actions** | Composer `CMP-TML-COMPOSER-001` |
| **Change diff table** | `CMP-TML-CHANGE-001` |

**Views:** Compact · Detailed · Audit · Grouped · AI Summary

---

# Approval Components

From [uiux/HR_APPROVAL_CENTER_UI_ARCHITECTURE.md](../../03-business-modules/hr-payroll/uiux/HR_APPROVAL_CENTER_UI_ARCHITECTURE.md):

| Component | ID |
|-----------|-----|
| **Approval cards** | `CMP-APR-CARD-001` |
| **Approval progress** | `CMP-APR-CHAIN-001` |
| **Approval timeline** | `CMP-APR-TIMELINE-001` |
| **Approval actions** | `CMP-APR-ACTION-BAR-001` |
| **AI approval panel** | `CMP-APR-AI-PANEL-001` |

---

# Notification Components

| Component | Use |
|-----------|-----|
| **Notification cards** | `/notifications` list |
| **Alerts** | Inline page alerts |
| **Banners** | `WGT-PAY-BNR-*` payroll warnings |
| **Toast** | Sonner — bottom-right, 4s |
| **In-app** | Bell dropdown |

**Priority lanes:** Critical · High · Medium · Low

---

# Search Components

| Component | Entry | Shortcut |
|-----------|-------|----------|
| **Global search** | Top bar | `Ctrl+K` |
| **Quick search** | List filter bar | — |
| **Advanced search** | Filter sheet | — |
| **Command search** | Command palette | `Ctrl+K` |
| **AI search** | AI panel / palette | Natural language |

---

# Analytics Components

| Chart type | Dashboard use |
|------------|---------------|
| **Line** | Headcount, cost trends |
| **Bar** | Department split |
| **Area** | Cumulative metrics |
| **Pie / Donut** | Distribution |
| **Heatmap** | Attendance matrix |
| **KPI widgets** | `WGT-*-KPI-*` |

**Placeholder:** Wireframe gray box → Recharts at implementation  
**Rule:** Charts from data APIs — AI narrates, does not invent series

---

# Calendar Components

| View | HR use |
|------|--------|
| **Month** | Leave, attendance |
| **Week** | Shift, team leave |
| **Day** | Attendance detail |
| **Resource** | Room/equipment (future) |
| **Timeline** | Punch forensics |

---

# Kanban Components

| Board | Module |
|-------|--------|
| **Pipeline** | Recruitment candidates |
| **Approval** | Optional inbox kanban view |
| **Task** | Onboarding checklist |

**Card:** Title + meta + assignee avatar + status chip

---

# File Components

| Component | Behavior |
|-----------|----------|
| **Upload** | Drag-drop + browse; progress |
| **Preview** | PDF/image inline |
| **Version history** | Timeline linked |
| **Download** | Activity logged |
| **Document viewer** | `SCR-GLO-CMP-014` payslip PDF |

---

# AI Components

*Critical section*

| Component | ID | Use |
|-----------|-----|-----|
| **AI Chat** | `CMP-AI-PANEL-001` | Global panel |
| **AI Insight card** | `CMP-AI-CARD-INSIGHT-001` | Dashboard Zone G |
| **AI Recommendation card** | `CMP-AI-CARD-RECOMMEND-001` | Promotions, training |
| **AI Summary card** | `CMP-TML-AI-SUMMARY-001` | Timeline |
| **AI Prediction card** | Future | Attrition |
| **AI Action card** | Proposal preview | Apply flow |
| **AI Confidence indicator** | Badge 0–1 or high/med/low | All AI outputs |
| **Explainability block** | `CMP-AI-EXPLAIN-001` | Expandable why/how |

**Visual:** Sparkle icon · subtle gradient border optional · never same as primary CTA

---

# Navigation Components

Per [uiux/HR_NAVIGATION_ARCHITECTURE.md](../../03-business-modules/hr-payroll/uiux/HR_NAVIGATION_ARCHITECTURE.md):

| Component | Spec |
|-----------|------|
| **Sidebar** | 240px / 64px collapsed; L1–L3 nav |
| **Top navigation** | Search, company, branch, utilities |
| **Breadcrumb** | Last 2–3 segments |
| **Favorites** | Starred nav items |
| **Recent items** | Last 10 screens |
| **Quick actions** | `+` menu · `QUICK-*` IDs |

**ESS:** Bottom nav 5 slots — separate shell component

---

# Dashboard Components

Per [uiux/HR_DASHBOARD_UI_ARCHITECTURE.md](../../03-business-modules/hr-payroll/uiux/HR_DASHBOARD_UI_ARCHITECTURE.md):

| Component | Zone |
|-----------|------|
| **Widget container** | Grid cell |
| **KPI row** | Zone B |
| **Analytics area** | Zone C |
| **Activity feed** | Zone E · `WGT-ACT-LST-*` |
| **AI panel** | Zone G · `WGT-AI-INS-*` |
| **Quick actions** | Zone H |

**Templates:** `DSH-HR-001` · `DSH-PAY-001` · `DSH-ESS-001` · etc.

---

# Mobile Components

| Component | Spec |
|-----------|------|
| **Bottom navigation** | 5 slots; safe area |
| **Mobile cards** | Full-width list items |
| **Mobile tables** | Card fallback only |
| **Mobile timeline** | Single column stream |
| **Mobile AI assistant** | Full-screen sheet |

**Touch:** 44px targets; sticky footers on forms and approvals

---

# Accessibility Standards

| Area | Standard |
|------|----------|
| **Keyboard navigation** | Full path; shortcuts documented |
| **Screen readers** | Landmarks; live regions for toasts/errors |
| **Color contrast** | WCAG AA |
| **Focus states** | Visible ring all interactives |
| **Responsive text** | Scale to 200% without loss |

**HR-specific:** Payslip PDF viewer keyboard accessible; approval reject requires labeled comment field

---

# Performance Principles

| Pattern | Use |
|---------|-----|
| **Loading states** | Button spinner; table overlay |
| **Skeleton screens** | Cards, table rows, drawer |
| **Lazy loading** | Timeline infinite scroll; images |
| **Progressive loading** | KPI first, charts second |

**Target:** Skeleton < 100ms; perceived interaction < 200ms

---

# Consistency Rules

### Spacing rules

- Use tokens only — no arbitrary px in screens  
- Section gaps ≥ `--space-6`  
- Card internal ≥ `--space-4`  

### Typography rules

- One heading level per section  
- Page title once per route  
- Caption for all timestamps in feeds  

### Interaction rules

- Drawer for view/edit/create  
- Modal for confirm/destroy  
- Toast for async success — not validation  

### Naming rules

| Layer | Convention |
|-------|------------|
| Figma | `DS/{Category}/{Component}/{Variant}` |
| Component ID | `CMP-{DOMAIN}-{NAME}-{###}` |
| Widget ID | `WGT-{MOD}-{TYPE}-{###}` |
| Token | `--{category}-{name}` |

**New components:** Require design system doc update before use in screens

---

# Figma Library Structure

```
AgainERP Design System (Figma)
├── Foundations
│   ├── Colors (semantic)
│   ├── Typography
│   ├── Spacing
│   ├── Grid
│   ├── Icons
│   ├── Elevation
│   └── Motion (reduced)
├── Components
│   ├── Atoms
│   ├── Molecules
│   ├── Organisms
│   └── AI
├── Patterns
│   ├── List + Drawer
│   ├── Dashboard zones
│   ├── Workbench stepper
│   ├── Approval workspace
│   ├── Timeline
│   └── ESS mobile
├── Templates
│   ├── DSH-HR-001
│   ├── DSH-PAY-001
│   ├── DSH-ESS-001
│   └── SCR-* wireframes
└── Pages
    └── HR reference screens (grayscale wireframe)
```

**Wireframe fidelity:** Grayscale zones per [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../../03-business-modules/hr-payroll/HR_FIGMA_WIREFRAME_BLUEPRINT.md)  
**Hi-fi phase:** Map `WF/*` → `DS/*` components

---

# Frontend Mapping

**Strategy only** — no code. Maps design system to future `apps/web` component categories:

| Design system | Frontend category | Notes |
|---------------|-------------------|-------|
| `CMP-BTN-*` | `components/ui/button` | shadcn Button variants |
| `CMP-INP-*` | `components/ui/input`, `select`, `datepicker` | Form primitives |
| `CMP-BDG-*` | `components/ui/badge` | Status variants |
| `CMP-DRW-*` | `components/ui/sheet` | Drawer CRUD |
| `CMP-MDL-*` | `components/ui/dialog` | Modals |
| `CMP-TBL-*` | `components/data-table`, AG Grid wrapper | Virtual scroll |
| `CMP-CARD-*` | `components/ui/card`, `StatCard` | Dashboard |
| `CMP-TAB-*` | `components/ui/tabs` | Deep links |
| `CMP-TML-*` | `components/activity/timeline` | Core service |
| `CMP-APR-*` | `components/approval/*` | Core inbox |
| `CMP-AI-*` | `components/ai/*` | AI OS panel |
| `DSH-*` | `components/dashboard/templates` | Zone layouts |
| `WGT-*` | `components/dashboard/widgets` | KPI, charts |
| Navigation | `components/layout/*` | Shell |
| ESS shell | `components/ess/EssShell` | Separate layout |

### Mapping rules

1. **One DS component → one React component** (variants via props)  
2. **Widgets compose molecules** — not new primitives  
3. **Tokens via CSS variables** — Tailwind theme extension  
4. **No module-specific colors** — semantic tokens only  
5. **Screen docs reference CMP IDs** in architecture MDs  

---

# AI First Design Guidelines

| Guideline | Implementation |
|-----------|----------------|
| **Context awareness** | Pass route, entity, company to AI panel |
| **Explainability** | Mandatory expand block on insights |
| **Transparency** | Show confidence, model, as-of |
| **Actionability** | Every insight has Navigate or Dismiss |
| **Human control** | No auto-execute on payroll/approval |

**AI button:** Distinct from primary — `CMP-BTN-AI` variant  
**ESS:** Simplified chips; reduced tool surface

---

# HR Module Extensions

Components first proven in HR — then promoted to global DS:

| Extension | Global adoption |
|-----------|-----------------|
| Employee profile header | Partner 360° |
| Payroll workbench stepper | Manufacturing routing |
| SoD warning banner | Purchase approval |
| ESS bottom nav | Field service apps |
| Compliance audit view | Finance journals |
| AI auditor panel | Inventory anomaly |

---

# Cross-Reference Index

| Document | Relationship |
|----------|--------------|
| [design-system.md](../standards/design-system.md) | Token implementation target |
| [components.md](../standards/components.md) | Component catalog |
| [status-system.md](../standards/status-system.md) | Badge tokens |
| [mobile-first.md](../standards/mobile-first.md) | Responsive patterns |
| [ai-assistant-ui.md](../standards/ai-assistant-ui.md) | AI panel |
| [dashboard-widgets.md](../standards/dashboard-widgets.md) | Widget registry |
| [HR_MODULE_MASTER_INDEX.md](../../03-business-modules/hr-payroll/HR_MODULE_MASTER_INDEX.md) | Doc registry |

---

## Document Control

| Field | Value |
|-------|-------|
| **Owner** | Design System / Product |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Evolution** | HR reference → Global AgainERP DS |
| **Formula** | 60% Odoo · 20% Shopify · 10% Notion · 10% Linear |

---

**AgainERP HR Design System Specification** — enterprise design system foundation for Figma library, design tokens, component library, UI consistency, and AI-first UX across all modules.
