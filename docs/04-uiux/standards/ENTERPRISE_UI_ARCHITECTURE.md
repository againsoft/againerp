# AgainERP — Enterprise UI/UX Architecture

> **Status:** Draft  
> **Version:** 1.0  
> **Design system SSOT:** [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md) · [FINAL_UI_ARCHITECTURE_LOCK.md](../../FINAL_UI_ARCHITECTURE_LOCK.md) — APPROVED (Step 10.2)  
> **Governance:** [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · [DEVELOPMENT_STANDARDS.md](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md)  
> **Rule:** All modules must use this architecture. **No module may introduce its own UI pattern** without updating this document.  
> **Shell structure SSOT:** [WORKSPACE_SHELL_ARCHITECTURE.md](./WORKSPACE_SHELL_ARCHITECTURE.md) — zones, navigation layers, mobile layout.

**No code.** Canonical enterprise UI/UX architecture for AgainERP.

---

## Purpose
Global UI standard: ENTERPRISE_UI_ARCHITECTURE.

## When To Read
Read only if working on UI patterns related to ENTERPRISE_UI_ARCHITECTURE.

## Related Files
- [Workspace shell SSOT](WORKSPACE_SHELL_ARCHITECTURE.md)
- [Module UI](module-ui-standard.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Design Formula

```
AgainERP UI = 60% Odoo + 20% Shopify Admin + 10% Notion + 10% Linear
```

| Source | Weight | What We Take |
|--------|--------|--------------|
| **Odoo** | 60% | Sidebar, chatter, smart buttons, record tabs, global search, reports, approvals |
| **Shopify Admin** | 20% | Clean product/order UI, tables, builder, mobile commerce patterns |
| **Notion** | 10% | Form sections, inline editing, minimal chrome, draft/autosave |
| **Linear** | 10% | Command palette, keyboard shortcuts, fast navigation |

### Objective

**NOT to clone any platform.** Combine the **best usability patterns** from each into one cohesive AgainERP design language.

---

## Core Design Principles

| Principle | Requirement |
|-----------|-------------|
| **Professional** | Enterprise-grade density and polish |
| **Minimal** | No decorative UI; purpose-driven elements only |
| **Fast** | < 200ms perceived interactions; skeleton loaders |
| **Enterprise Friendly** | Bulk actions, audit, multi-company, approvals |
| **Mobile First** | Designed at 375px; enhanced upward |
| **Scalable** | Same shell for 100+ modules |
| **Consistent** | One pattern per interaction type |
| **Accessible** | WCAG 2.1 AA minimum |
| **Keyboard Friendly** | Full keyboard path; `Ctrl+K` palette |
| **AI Ready** | Assistant panel on every page |

---

## Application Layout

**Every module must use the same layout structure.**

```
┌─────────────────────────────────────────────────────────────────────────┐
│ TOP HEADER (global, fixed)                                            │
├──────────┬──────────────────────────────────────────────┬─────────────┤
│          │                                              │             │
│  LEFT    │         MAIN CONTENT AREA                    │   RIGHT     │
│  SIDEBAR │                                              │  UTILITY    │
│          │  Breadcrumb · Page Header · Actions          │  PANEL      │
│          │  Filters · Content (list/form/dashboard)     │             │
│          │                                              │  Chatter    │
│          │                                              │  AI         │
├──────────┴──────────────────────────────────────────────┴─────────────┤
│ FOOTER (optional) — version, support link, status                     │
└───────────────────────────────────────────────────────────────────────┘
```

**Detail:** [layout-architecture.md](./layout-architecture.md) · [page-architecture.md](./page-architecture.md)

---

## Header Architecture

Globally available on every screen.

| Component | Position | Behavior |
|-----------|----------|----------|
| **Logo** | Far left | Links to module dashboard |
| **Global Search** | Center-left | Opens command palette — `Ctrl+K` |
| **Company Switcher** | Right cluster | Multi-company users |
| **Branch Switcher** | Right cluster | When multi-branch enabled |
| **Quick Create** | Right cluster | `+` dropdown — Create Product, Order, Customer, … |
| **Notifications** | Right cluster | Bell + unread badge |
| **Activities** | Right cluster | Open activities counter |
| **AI Assistant** | Right cluster | Opens AI panel — `Ctrl+J` |
| **Profile Menu** | Far right | Settings, preferences, logout |
| **Theme Switcher** | Right cluster | Light / dark / system |
| **Language Switcher** | Right cluster | i18n locale |

Height: **56px**. Sticky on scroll.

---

## Sidebar Architecture

Inspired by **Odoo**.

| Feature | Spec |
|---------|------|
| **Collapse / Expand** | 240px ↔ 64px icon-only |
| **Favorites** | Star any menu item |
| **Recent Pages** | Last 10 visited screens |
| **Role Based Menus** | RBAC — hide, never disable |
| **Module Groups** | Collapsible nested sections |
| **Search Menu** | Filter sidebar tree by keyword |

### Standard Menu (Ecommerce)

```
Dashboard
Catalog
Customers
Orders
Inventory
Marketing
Media
SEO
Reports
System
AI
```

Registered via `ModuleManifest.md`. Core merges all modules.

**Detail:** [navigation.md](./navigation.md)

---

## Global Search

Inspired by **Odoo + Linear**.

| Property | Value |
|----------|-------|
| **Shortcut** | `Ctrl+K` / `Cmd+K` |
| **Scope** | Products, Orders, Customers, Pages, Reports, Settings, Media, Activities |
| **Actions** | Global actions (create, navigate, settings) |
| **Recent** | Last 5 searches |
| **Saved** | User-named saved searches |
| **AI Search** | Semantic search when AI enabled |

**Detail:** [global-search.md](./global-search.md)

---

## Command Palette

Inspired by **Linear**. Same entry as global search (`Ctrl+K`).

| Action Type | Examples |
|-------------|----------|
| **Create** | Create Product, Create Order, Create Customer |
| **Navigate** | Open Settings, Go to Inventory |
| **Generate** | Generate Report |
| **AI** | Open AI Assistant |
| **Anywhere** | Jump to any menu or record |

Grouped: Actions · Records · Navigation · AI

**Detail:** [command-palette.md](./command-palette.md)

---

## Dashboard Architecture

Inspired by **Shopify + Odoo**.

### Widget Types

| Type | Content |
|------|---------|
| **KPI Cards** | Single metric + trend |
| **Charts** | Line, bar, pie |
| **Tables** | Top N records |
| **Activity Feed** | Recent events |
| **Notifications** | Pending items |
| **AI Insights** | Generated summaries |

### Widget Capabilities

Drag · Drop · Resize · Hide · Pin · Save Layout · **Per User Dashboard**

**Detail:** [dashboard-widgets.md](./dashboard-widgets.md)

---

## Page Architecture

Every page follows the same structure.

```
Page Header (title + status + actions)
Breadcrumb
Page Actions (primary buttons)
Filters (list views)
Content (table | form | dashboard | report)
Right Utility Panel (record views)
Activity Panel (chatter on records)
```

**Detail:** [page-architecture.md](./page-architecture.md)

---

## Record Page Architecture

For Product, Customer, Order, Invoice, and all primary entities.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ RECORD HEADER — title, status badge, primary actions                    │
├─────────────────────────────────────────────────────────────────────────┤
│ SMART BUTTONS — stat pills with counts (Odoo pattern)                   │
├──────────────────────────────────────┬──────────────────────────────────┤
│ TABS                                 │ RIGHT PANEL                      │
│ General · Pricing · Inventory · SEO  │ Activities                       │
│ Media · History · Activities         │ Notes · Comments                 │
│ ──────────────────────────────────── │ Attachments · Followers          │
│ Tab content                          │ Timeline                         │
└──────────────────────────────────────┴──────────────────────────────────┘
```

**Detail:** [record-view.md](./record-view.md) · [smart-buttons.md](./smart-buttons.md)

---

## Smart Buttons

Inspired by **Odoo**. Stat pills below record header — count + link to related data.

### Product Example

| Button | Count | Links To |
|--------|-------|----------|
| Orders | 24 | Filtered order list |
| Reviews | 8 | Product reviews tab |
| Inventory | 142 | Stock by warehouse |
| SEO Score | 85 | SEO tab |
| Views | 1.2k | Analytics |
| Returns | 2 | Return list |

Rules: RBAC-filtered · Real-time counts · Click opens related view with filter pre-applied.

**Detail:** [smart-buttons.md](./smart-buttons.md)

---

## Chatter System

Inspired by **Odoo**. Every record supports:

| Feature | Core Entity |
|---------|-------------|
| Comments | `comments` |
| Mentions | `@user` in comments |
| Activities | `activities` |
| Attachments | `attachments` |
| Followers | `record_followers` |
| Internal Notes | `notes` |
| Timeline | Aggregated feed |

**Detail:** [activity-system.md](./activity-system.md)

---

## Activity System

Every module supports:

| Type | Use |
|------|-----|
| Schedule Activity | Generic task |
| Call | Phone follow-up |
| Meeting | Calendar event |
| Email | Email task |
| Task | To-do |
| Reminder | Due date alert |
| Approval | Links to approval engine |

**Appear in:** Dashboard · Record chatter · Calendar · Notifications

**Detail:** [activity-system.md](./activity-system.md)

---

## Table System

Inspired by **Shopify Admin**.

Sticky Header · Column Selector · Advanced Filter · Saved Filter · Sorting · Bulk Actions · Quick Edit · Export · Import · Pagination · Keyboard Navigation · Responsive Layout

**Detail:** [TABLE_AND_DATA_GRID_STANDARD.md](./TABLE_AND_DATA_GRID_STANDARD.md) · [filters.md](./filters.md)

---

## Form System

Inspired by **Notion**.

Section Layout · Tabs · Accordion · Draft Mode · Auto Save · Validation · Inline Editing · Related Records · Activity Feed · Attachments · Comments · History

**Detail:** [FORM_STANDARD.md](./FORM_STANDARD.md)

---

## Builder Architecture

Inspired by **Shopify**.

```
Page → Section → Row → Column → Widget → Block
```

Drag & Drop · Reusable Templates · Global Components · Theme Variables

**Detail:** [builder-ui.md](./builder-ui.md) · [modules/ecommerce/builder/ARCHITECTURE.md](../../03-business-modules/ecommerce/builder/ARCHITECTURE.md)

---

## Notification Center

Inspired by **Odoo**.

| Category | Examples |
|----------|----------|
| System | Maintenance, integration errors |
| Orders | New order, payment failed |
| Customers | Registration, mention |
| Inventory | Low stock, transfer |
| Marketing | Campaign sent |
| Approvals | Pending PO, discount |
| AI | Report ready, insight |

Support: Read · Unread · Archive · Priority

**Detail:** [notifications.md](./notifications.md)

---

## Reports Architecture

Inspired by **Odoo**.

| Type | Description |
|------|-------------|
| Dashboard Reports | Widget-embedded KPIs |
| Table Reports | Sortable data grids |
| Chart Reports | Visual analytics |
| Pivot Reports | Cross-tab analysis |
| Custom Reports | User-defined fields/filters |

Exports: PDF · Excel · CSV

**Detail:** [reports-ui.md](./reports-ui.md)

---

## AI Assistant

Available on **every page**.

| Capability | Example |
|------------|---------|
| Search records | "Orders from yesterday" |
| Create records | "Create a draft product" |
| Generate content | Product descriptions |
| Generate SEO | Meta tags |
| Generate reports | Weekly sales summary |
| Generate insights | Trend analysis |
| Analyze data | "Why did sales drop?" |
| Recommendations | Restock suggestions |

**Detail:** [ai-assistant-ui.md](./ai-assistant-ui.md)

---

## Mobile Architecture

Inspired by **Shopify**.

Bottom Navigation · Quick Actions · Swipe Actions · Responsive Tables · Responsive Forms · Touch Optimized

**Detail:** [mobile-first.md](./mobile-first.md)

---

## Theme System

| Mode | Scope |
|------|-------|
| Light Mode | Default |
| Dark Mode | Full dark palette |
| Custom Theme | Token overrides |
| Tenant Branding | SaaS plan level |
| Company Branding | Logo, primary color |
| Branch Branding | Optional accent override |

**Detail:** [theme-system.md](./theme-system.md) · [dark-mode.md](./dark-mode.md)

---

## Design Tokens

Centralized — **never hardcode values in components**.

Colors · Typography · Spacing · Border Radius · Shadow · Icons · Buttons · Inputs · Cards · Tables · Badges · Status Colors

**Detail:** [DESIGN_TOKEN_STANDARD.md](./DESIGN_TOKEN_STANDARD.md) · [COMPONENT_LIBRARY_STANDARD.md](./COMPONENT_LIBRARY_STANDARD.md)

---

## Status System

Universal status colors — **all modules must use the same system**.

| Status | Token | Use |
|--------|-------|-----|
| Success | `--status-success` | Paid, active, completed |
| Warning | `--status-warning` | Pending, low stock |
| Danger | `--status-danger` | Failed, overdue, rejected |
| Info | `--status-info` | Informational |
| Pending | `--status-pending` | Awaiting action |
| Draft | `--status-draft` | Unpublished |
| Approved | `--status-approved` | Approved records |
| Rejected | `--status-rejected` | Denied |
| Archived | `--status-archived` | Inactive/hidden |

Always pair color with icon + label. Never color alone.

**Detail:** [status-system.md](./status-system.md)

---

## Permission Aware UI

Every page respects:

| Dimension | Behavior |
|-----------|----------|
| **Role** | Menu and action visibility |
| **Permission** | `{module}.{resource}.{action}` |
| **Company** | `company_id` scope on all data |
| **Branch** | Branch-filtered views when enabled |
| **Module Access** | Entire module hidden if not licensed |

Users **only see allowed actions** — never show disabled buttons for forbidden actions; hide them.

**Detail:** [permission-aware-ui.md](./permission-aware-ui.md)

---

## Module UI Structure Standard

Every module must implement:

| View | Required |
|------|----------|
| **Dashboard** | Module KPIs and widgets |
| **List View** | Searchable, filterable table |
| **Create View** | New record form |
| **Edit View** | Same as create with existing data |
| **Details View** | Record page with tabs + chatter |
| **Reports** | Module report screens |
| **Settings** | Module configuration |
| **Activities** | Via Core chatter |
| **Audit History** | Via Core timeline |

**Detail:** [module-ui-standard.md](./module-ui-standard.md)

---

## Modules Following This UI

All modules below and **all future modules** use this architecture:

| Layer | Modules |
|-------|---------|
| **Ecommerce** | Dashboard, Catalog, Customers, Orders, Inventory, Marketing, Media, SEO, Builder |
| **ERP** | CRM, Sales, Purchase, Accounting, POS, HR, Payroll |
| **Operations** | Projects, Helpdesk, Documents, Knowledge |
| **Platform** | AI, Reports, System |

**Governance rule:** No module may introduce its own UI pattern without a proposal and update to this document.

---

## Smart Interactions

Minimize clicks · Live filters · Popup-first · Autosave · Variant real-time updates

**Detail:** [UX_SMART_INTERACTION_STANDARDS.md](./UX_SMART_INTERACTION_STANDARDS.md)

---

## Document Map

| Topic | Document |
|-------|----------|
| **This document** | Enterprise architecture (master) |
| **Smart interactions** | [UX_SMART_INTERACTION_STANDARDS.md](./UX_SMART_INTERACTION_STANDARDS.md) |
| Design standards summary | [UI_UX_DESIGN_STANDARDS.md](./UI_UX_DESIGN_STANDARDS.md) |
| Layout shell | [layout-architecture.md](./layout-architecture.md) |
| Page structure | [page-architecture.md](./page-architecture.md) |
| Sidebar | [navigation.md](./navigation.md) |
| Search | [global-search.md](./global-search.md) |
| Command palette | [UNIVERSAL_COMMAND_SYSTEM_STANDARD.md](./UNIVERSAL_COMMAND_SYSTEM_STANDARD.md) |
| Quick actions | [QUICK_ACTION_FRAMEWORK_STANDARD.md](./QUICK_ACTION_FRAMEWORK_STANDARD.md) |
| Workspace context | [WORKSPACE_CONTEXT_STANDARD.md](./WORKSPACE_CONTEXT_STANDARD.md) |
| Empty states | [EMPTY_STATE_STANDARD.md](./EMPTY_STATE_STANDARD.md) |
| Loading states | [LOADING_STATE_STANDARD.md](./LOADING_STATE_STANDARD.md) |
| Dashboard | [dashboard-widgets.md](./dashboard-widgets.md) |
| Record views | [record-view.md](./record-view.md) |
| Smart buttons | [smart-buttons.md](./smart-buttons.md) |
| Chatter | [activity-system.md](./activity-system.md) |
| Tables | [TABLE_AND_DATA_GRID_STANDARD.md](./TABLE_AND_DATA_GRID_STANDARD.md) |
| Forms | [FORM_STANDARD.md](./FORM_STANDARD.md) |
| Builder UI | [builder-ui.md](./builder-ui.md) |
| Notifications | [notifications.md](./notifications.md) |
| Reports UI | [reports-ui.md](./reports-ui.md) |
| AI Assistant | [AI_COMPONENT_STANDARD.md](./AI_COMPONENT_STANDARD.md) |
| Mobile | [RESPONSIVE_UI_STANDARD.md](./RESPONSIVE_UI_STANDARD.md) |
| Tokens | [DESIGN_TOKEN_STANDARD.md](./DESIGN_TOKEN_STANDARD.md) |
| Design system | [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md) · [UI_ARCHITECTURE_LOCK.md](../../UI_ARCHITECTURE_LOCK.md) |
| Overlays | [DRAWER_MODAL_STANDARD.md](./DRAWER_MODAL_STANDARD.md) |
| Page layouts | [PAGE_LAYOUT_STANDARD.md](./PAGE_LAYOUT_STANDARD.md) |
| Status colors | [status-system.md](./status-system.md) |
| Permissions UI | [permission-aware-ui.md](./permission-aware-ui.md) |
| Module standard | [module-ui-standard.md](./module-ui-standard.md) |

---

**Platform:** AgainERP  
**Last Updated:** 2026-06-12  
**Maintainer:** Design System Team
