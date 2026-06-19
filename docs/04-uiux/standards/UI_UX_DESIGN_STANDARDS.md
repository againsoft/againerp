# AgainERP — UI/UX Design Standards

> **Status:** Draft  
> **Version:** 1.1  
> **Master architecture:** [**ENTERPRISE_UI_ARCHITECTURE.md**](./ENTERPRISE_UI_ARCHITECTURE.md)  
> **Governance:** [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · [DEVELOPMENT_STANDARDS.md](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md)

**No code.** Design standards summary — full enterprise architecture in [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md).

---

## Purpose
Global UI standard: UI_UX_DESIGN_STANDARDS.

## When To Read
Read only if working on UI patterns related to UI_UX_DESIGN_STANDARDS.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Design Formula

```
AgainERP UI = 60% Odoo + 20% Shopify Admin + 10% Notion + 10% Linear
```

**Objective:** NOT to clone any platform. Combine the best usability patterns from each.

| Rule | Description |
|------|-------------|
| **Do not clone** | Never copy any platform pixel-for-pixel |
| **Adopt strengths** | Odoo chatter, Shopify tables, Notion forms, Linear palette |
| **One shell forever** | Same framework for all modules — no redesign per module |
| **Governance** | No new UI patterns without updating ENTERPRISE_UI_ARCHITECTURE |

---

## Core UI Principles

Every screen must embody:

| Principle | Meaning |
|-----------|---------|
| **Simple** | One primary action per view; hide advanced behind tabs |
| **Fast** | Perceived speed < 200ms interactions; skeleton loaders |
| **Professional** | Enterprise-grade density without clutter |
| **Minimal** | No decorative UI; every element has purpose |
| **Consistent** | Same patterns across all 100+ future modules |
| **Mobile Friendly** | Works on phone first — see [mobile-first.md](./mobile-first.md) |
| **Keyboard Friendly** | Full keyboard path; `Ctrl+K` command palette |
| **Enterprise Friendly** | Bulk actions, audit, permissions, multi-company |

---

## Layout Architecture

### Desktop Shell

```
┌─────────────────────────────────────────────────────────────────────────┐
│ TOP NAVIGATION                                                          │
│ [Logo] [Global Search]  Company ▾  Branch ▾  🔔  📋  ✨AI  🌐  🌙  👤   │
├──────────┬──────────────────────────────────────────────┬───────────────┤
│          │                                              │               │
│  LEFT    │           CONTENT AREA                       │  RIGHT        │
│  SIDEBAR │                                              │  UTILITY      │
│          │  Breadcrumb · Page Header · Actions          │  PANEL        │
│  Main    │  ─────────────────────────────────────────   │  (optional)   │
│  Menu    │  Filters / Tabs / Main Content               │               │
│          │                                              │  Activity     │
│  Sub     │                                              │  Feed         │
│  Menu    │                                              │  Notifications│
│          │                                              │  AI Assistant │
│  Fav     │                                              │               │
│  Recent  │                                              │               │
│          │                                              │               │
└──────────┴──────────────────────────────────────────────┴───────────────┘
```

**Detail:** [layout-architecture.md](./layout-architecture.md) · [navigation.md](./navigation.md) · [PROJECT_COMMON_RULES.md](../../00-foundation/PROJECT_COMMON_RULES.md) §4 (drawer CRUD)

| Zone | Responsibility |
|------|----------------|
| **Top Navigation** | Global search, company/branch, utilities, profile |
| **Left Sidebar** | Module menu, nested items, favorites, recent |
| **Content Area** | List views, forms, dashboards, reports |
| **Right Utility Panel** | Chatter, activities, AI — collapsible on tablet/mobile |

### Mobile Shell

Bottom navigation + hamburger drawer. Right panel becomes bottom sheet. See [mobile-first.md](./mobile-first.md).

---

## Sidebar Design

Must support:

| Feature | Description |
|---------|-------------|
| **Collapsible** | 240px expanded / 64px icon-only |
| **Pinned Menu** | User pins frequently used items to top |
| **Favorites** | Star any menu item |
| **Recent Pages** | Last 10 visited screens |
| **Search Menu** | Filter menu tree by keyword |
| **Role Based** | Hidden items per RBAC — never show disabled links |
| **Icons** | Lucide icons, consistent per module |
| **Nested Menus** | Two-level expand/collapse |

### Ecommerce Menu Example

```
Dashboard
Catalog
  └─ Products, Categories, Brands, …
Customers
Orders
Inventory
Marketing
SEO
Media
Reports
System
AI
```

Menu tree registered via `ModuleManifest.md`. Core merges all modules.

---

## Global Search

**Odoo-style global search is mandatory.**

### Searchable Entities

| Category | Examples |
|----------|----------|
| Products | Name, SKU, barcode |
| Orders | Order number, customer |
| Customers | Name, email, phone |
| Categories | Category tree |
| Pages | Builder pages |
| Reports | Report names |
| Settings | Config pages |
| Activities | Open tasks |
| Media | File names |

### Required Features

| Feature | Spec |
|---------|------|
| **Keyboard shortcut** | `Ctrl+K` (Windows/Linux) · `Cmd+K` (macOS) |
| **Command palette** | Actions + navigation + records in one overlay |
| **Quick navigation** | Jump to any menu or record |
| **RBAC filtered** | Only records user can read |
| **Company scoped** | Active company by default |

**Detail:** [global-search.md](./global-search.md)

---

## Header Design

Top bar must contain:

| Element | Position | Behavior |
|---------|----------|----------|
| **Global Search** | Center-left | `Ctrl+K` opens command palette |
| **Company Switcher** | Right cluster | Multi-company users |
| **Branch Switcher** | Right cluster | When multi-branch enabled |
| **Notifications** | Right cluster | Badge count, dropdown panel |
| **Activities** | Right cluster | My open activities counter |
| **AI Assistant** | Right cluster | Opens AI panel |
| **Profile Menu** | Far right | Settings, logout, preferences |
| **Language Selector** | Right cluster | i18n switch |
| **Dark Mode Toggle** | Right cluster | Light / dark / system |

---

## Dashboard Design

Widget-based architecture — same engine for Ecommerce, CRM, Accounting dashboards.

| Requirement | Spec |
|-------------|------|
| **Draggable** | Drag widgets to reorder grid |
| **Resizable** | 1×1 to 4×2 grid units |
| **Role Based** | Default layout per role |
| **Customizable** | User overrides saved per user |
| **Save Layout** | `user_settings.dashboard_layout` |

**Detail:** [dashboard-widgets.md](./dashboard-widgets.md) · [modules/ecommerce/dashboard/ARCHITECTURE.md](../../03-business-modules/ecommerce/dashboard/ARCHITECTURE.md)

---

## Table Design

Enterprise-grade data tables for all list views.

| Feature | Required |
|---------|----------|
| Column selector | Show/hide columns, persist preference |
| Sorting | Click header, multi-sort with Shift |
| Filtering | Inline + advanced filter panel |
| Advanced filters | AND/OR groups, date ranges |
| Saved filters | Named, shareable per user/team |
| Bulk actions | Select rows → action bar |
| Export | CSV, XLSX |
| Import | Template download + upload |
| Pagination | Page size selector, total count |
| Sticky header | Header fixed on scroll |
| Responsive mode | Card list on mobile |
| Keyboard navigation | Arrow keys, Space select, Enter open |

**Detail:** [tables.md](./tables.md) · [filters.md](./filters.md)

---

## Form Design

Modern form layout for create/edit screens.

| Pattern | Use |
|---------|-----|
| **Sections** | Grouped fields with headings |
| **Tabs** | General, SEO, Inventory, Pricing, … |
| **Accordion** | Advanced/collapsed sections |
| **Inline validation** | On blur + on submit |
| **Autosave** | Draft records save every 30s |
| **Draft support** | `status: draft` until published |

### Record Side Panel (Odoo Chatter)

Every major form includes right panel (desktop) or bottom sheet (mobile):

| Panel Tab | Content |
|-----------|---------|
| **Activities** | Scheduled tasks, calls, meetings |
| **Notes** | Internal notes (staff only) |
| **Comments** | Threaded discussion |
| **Attachments** | Files linked to record |
| **Followers** | Users watching record |
| **Timeline** | Status changes, edits, system events |

**Detail:** [forms.md](./forms.md) · [record-view.md](./record-view.md) · [activity-system.md](./activity-system.md)

---

## Record View Design

Standard layout for Product, Order, Customer, Page, and all primary entities.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER: Status badge · Title · [Action 1] [Action 2] [⋯ More]          │
├─────────────────────────────────────────────────────────────────────────┤
│ RECORD SUMMARY: Key fields in horizontal strip (SKU, price, stock, …)  │
├──────────────────────────────────────┬──────────────────────────────────┤
│ TABS                                 │ RIGHT PANEL (Chatter)            │
│  General | SEO | Inventory | Media  │  Activities                      │
│  Pricing | History | Activities    │  Notes                           │
│  ─────────────────────────────────   │  Comments                        │
│  Tab content (form fields)           │  Attachments                     │
│                                      │  Timeline                        │
└──────────────────────────────────────┴──────────────────────────────────┘
```

Tab sets vary by entity — defined in module `UI.md` and screen docs.

**Detail:** [record-view.md](./record-view.md)

---

## Activity System

Inspired by **Odoo Chatter**. Every record supports:

| Capability | Core Entity |
|------------|-------------|
| Activities | `activities` — scheduled tasks |
| Comments | `comments` — threaded |
| Notes | `notes` — internal |
| Mentions | `@user` in comments |
| Attachments | `attachments` — polymorphic |
| Followers | `record_followers` |
| Timeline | Aggregated audit + events |

Activities appear in header counter, right panel, and global activity inbox.

**Detail:** [activity-system.md](./activity-system.md)

---

## Notification Design

| Type | Example |
|------|---------|
| **Unread** | Bold, blue dot |
| **Read** | Muted styling |
| **Mentioned** | `@you` highlight |
| **System alerts** | Maintenance, integration errors |
| **Approval requests** | Pending PO, leave, discount |
| **Inventory alerts** | Low stock, transfer complete |
| **Orders** | New order, payment failed |
| **Marketing** | Campaign sent, coupon expiring |

Notification center: dropdown from header bell + full page `System → Notifications`.

**Detail:** [notifications.md](./notifications.md)

---

## Mobile Design

| Requirement | Implementation |
|-------------|----------------|
| Mobile first | Design at 375px |
| Bottom navigation | 4–5 primary modules |
| Swipe actions | List row swipe for edit/delete |
| Responsive tables | Card view fallback |
| Responsive forms | Single column |
| Touch friendly | 44×44px minimum targets |

**Targets:** Mobile · Tablet · Desktop

**Detail:** [mobile-first.md](./mobile-first.md)

---

## Theme System

| Mode | Description |
|------|-------------|
| **Light** | Default enterprise light |
| **Dark** | Full dark palette |
| **Custom themes** | Tenant-defined token overrides |
| **Brand colors** | `--color-primary` from company settings |
| **Tenant branding** | Logo, favicon per company |
| **Company branding** | White-label storefront + admin accent |

**Detail:** [theme-system.md](./theme-system.md) · [dark-mode.md](./dark-mode.md)

---

## AI Assistant UI

**Persistent AI Assistant** — accessible from every page via header ✨ icon or `Ctrl+J`.

| Capability | Example |
|------------|---------|
| Search records | "Show orders from yesterday" |
| Generate content | Product descriptions |
| Generate SEO | Meta title and description |
| Generate reports | "Summarize top products this week" |
| Provide insights | Stock forecast, sales trends |
| Answer questions | "How do I create a coupon?" |

Panel: right-side drawer (desktop) · full-screen sheet (mobile). Context-aware — knows current record.

**Detail:** [ai-assistant-ui.md](./ai-assistant-ui.md)

---

## Design Tokens

Centralized tokens — **never hardcode colors or spacing in components**.

| Category | Tokens |
|----------|--------|
| Colors | `--color-primary`, `--color-success`, `--color-danger`, … |
| Typography | `--text-sm`, `--text-base`, `--text-xl`, … |
| Spacing | `--space-1` through `--space-12` |
| Border radius | `--radius-sm`, `--radius-md`, `--radius-lg` |
| Icons | Lucide, 20px default |
| Buttons | Primary, secondary, ghost, danger variants |
| Inputs | Default, error, disabled states |
| Cards | `--shadow-sm`, `--radius-md` |
| Badges | Status colors per entity state |
| Status colors | Order, payment, stock, approval states |

**Detail:** [design-system.md](./design-system.md) · [components.md](./components.md)

---

## Accessibility

| Requirement | Standard |
|-------------|----------|
| Keyboard navigation | Full tab order, shortcuts documented |
| Screen reader support | Semantic HTML, ARIA labels |
| High contrast | WCAG 2.1 AA minimum |
| Focus states | Visible `:focus-visible` ring |
| WCAG compliance | AA ready; AAA where feasible |

Status must never rely on color alone — always pair with icon or label.

---

## Future Compatibility

The UI framework must support **without redesign**:

| Module | UI Patterns Used |
|--------|------------------|
| Ecommerce | List + record view + dashboard |
| CRM | Pipeline kanban + record view + chatter |
| Inventory | Tables + mobile warehouse views |
| Accounting | Journal grids + form lines |
| POS | Touch-optimized full-screen mode |
| HR | Employee record + approval forms |
| Project | Kanban + Gantt (future) |
| Helpdesk | Ticket list + chatter |
| AI | Assistant panel + insight widgets |

New modules register: menu tree, list columns, record tabs, permissions — **never new shell layouts**.

---

## Document Map

| Topic | Document |
|-------|----------|
| **Enterprise architecture (master)** | [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md) |
| Tokens & breakpoints | [design-system.md](./design-system.md) |
| Status colors | [status-system.md](./status-system.md) |
| Permission UI | [permission-aware-ui.md](./permission-aware-ui.md) |
| Module view standard | [module-ui-standard.md](./module-ui-standard.md) |
| Command palette | [command-palette.md](./command-palette.md) |
| Smart buttons | [smart-buttons.md](./smart-buttons.md) |
| Reports UI | [reports-ui.md](./reports-ui.md) |
| Builder UI | [builder-ui.md](./builder-ui.md) |
| Page structure | [page-architecture.md](./page-architecture.md) |
| Shell layout | [layout-architecture.md](./layout-architecture.md) |
| Sidebar & nav | [navigation.md](./navigation.md) |
| Global search | [global-search.md](./global-search.md) |
| Tables | [tables.md](./tables.md) |
| Forms | [forms.md](./forms.md) |
| Record views | [record-view.md](./record-view.md) |
| Activity / Chatter | [activity-system.md](./activity-system.md) |
| Notifications | [notifications.md](./notifications.md) |
| Dashboard widgets | [dashboard-widgets.md](./dashboard-widgets.md) |
| AI Assistant | [ai-assistant-ui.md](./ai-assistant-ui.md) |
| Mobile | [mobile-first.md](./mobile-first.md) |
| Theme | [theme-system.md](./theme-system.md) |
| Dark mode | [dark-mode.md](./dark-mode.md) |
| Components | [components.md](./components.md) |
| Filters | [filters.md](./filters.md) |

---

## Module Compliance

Every module must:

1. Reference this document in `UI.md`
2. Document record view tabs in `Architecture.md` and screen docs
3. Include **Page Layout** with shell zones in every `Menus/*.md`
4. Use design tokens only — no arbitrary CSS values
5. Implement chatter panel on all primary record forms

---

**Platform:** AgainERP  
**Last Updated:** 2026-06-12  
**Maintainer:** Design System Team
