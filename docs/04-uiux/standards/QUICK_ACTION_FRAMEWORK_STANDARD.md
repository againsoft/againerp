# AgainERP — Quick Action Framework Standard

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 10.1A — Design System Enhancement  
> **Authority:** [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md)

---

## Purpose

Define the **Quick Action Framework** — global create shortcuts, module registration, permission validation, and mobile behaviour.

## When To Read

Read when registering module create shortcuts in `ModuleManifest.md` or documenting dashboard quick-action widgets.

## Related Files

- [WORKSPACE_SHELL_ARCHITECTURE.md §3](./WORKSPACE_SHELL_ARCHITECTURE.md)
- [WORKSPACE_COMPONENT_REGISTRY.md](./WORKSPACE_COMPONENT_REGISTRY.md) — `WS-HEADER-QUICK`
- [UNIVERSAL_COMMAND_SYSTEM_STANDARD.md](./UNIVERSAL_COMMAND_SYSTEM_STANDARD.md)
- [DRAWER_MODAL_STANDARD.md](./DRAWER_MODAL_STANDARD.md)
- [WIDGET_REGISTRY_STANDARD.md](./WIDGET_REGISTRY_STANDARD.md) — `quick_action` category

## Read Next

§2 **Global Quick Action Button**.

---

## 1. Framework Overview

```text
Quick Action Framework
    ├── WS-HEADER-QUICK (+ menu in global header)
    ├── DS-COMMAND-PALETTE (create commands mirror)
    ├── Dashboard quick_action widgets
    └── Module FAB (mobile — optional per screen)
```

Quick actions are **shortcuts to create or jump** — they open list routes with drawer params or navigate to target screens. They never use forbidden `/new` routes.

---

## 2. Global Quick Action Button

| Property | Value |
|----------|-------|
| Shell ID | `WS-HEADER-QUICK` |
| Trigger | `+` icon in global header |
| Type | Dropdown menu grouped by module |
| Max visible | 12 items before "More…" → command palette |

**Menu anatomy:**

```text
+ Quick Actions ▾
├── Commerce
│   Create Product
│   Create Order
├── CRM
│   Create Lead
├── HR
│   Create Employee
└── Finance
    Create Invoice
```

---

## 3. Standard Quick Action Examples

| Label | Route | Permission (typical) | Module |
|-------|-------|-------------------|--------|
| Create Lead | `/crm/leads?create=1` | `crm.lead.manage` | CRM |
| Create Product | `/catalog/products?create=1` | `catalog.product.manage` | Catalog |
| Create Order | `/orders?create=1` | `commerce.order.manage` | Commerce |
| Create Employee | `/hr/employees?create=1` | `hr.employee.manage` | HR |
| Create Invoice | `/accounting/invoices?create=1` | `accounting.invoice.manage` | Finance |
| Create Ticket | `/helpdesk/tickets?create=1` | `helpdesk.ticket.manage` | Helpdesk |
| Create Project | `/projects?create=1` | `project.project.manage` | Projects |

All routes follow **list + drawer CRUD** — `?create=1` on the entity list page.

---

## 4. Quick Action Registration Rules

| Rule | Detail |
|------|--------|
| Registration file | `ModuleManifest.md` → `quickActions[]` |
| Max per module | 5 in header menu; unlimited in command palette |
| Label | Verb + entity — "Create Lead" not "New" |
| Icon | Module icon or entity icon from registry |
| Order | Module layer order → manifest `order` field |
| Feature gate | Omit when module not licensed for tenant |
| Context | Inherit active `company_id` on create — [WORKSPACE_CONTEXT_STANDARD.md](./WORKSPACE_CONTEXT_STANDARD.md) |

### 4.1 Manifest schema

```yaml
quickActions:
  - id: crm.lead.create
    label: Create Lead
    route: /crm/leads?create=1
    permission: crm.lead.manage
    icon: user-plus
    order: 10
    keywords: [lead, prospect]
```

---

## 5. Module Action Registry

Platform maintains a **merged quick action registry** at runtime:

| Source | Merged into |
|--------|-------------|
| All `ModuleManifest.quickActions[]` | `WS-HEADER-QUICK` |
| Same entries | `DS-COMMAND-PALETTE` Actions category |
| Dashboard widgets (`quick_action` category) | Module dashboard only |

**Dashboard widget:** Quick action widgets on module dashboards use the same routes and permissions as header actions — no duplicate business logic.

Detail: [MODULE_DASHBOARD_STANDARD.md §Quick Actions](./MODULE_DASHBOARD_STANDARD.md)

---

## 6. Permission Validation

| Rule | Detail |
|------|--------|
| Gate | Every action requires explicit permission key |
| Hide | No permission = action omitted from menu — never disabled |
| Plan | Module off = all module actions hidden |
| Company | User must have company access to create in active company |
| Audit | Create via quick action logged same as list-page create |

Format: `{module}.{entity}.{action}` — see module `Permissions.md`.

---

## 7. Mobile Behaviour

| Surface | Behaviour |
|---------|-----------|
| Header `+` | Hidden on `< md` — replaced by command palette / bottom nav Search |
| Command palette | Primary mobile create entry — [MOBILE_NAVIGATION_ARCHITECTURE.md](./MOBILE_NAVIGATION_ARCHITECTURE.md) |
| List page FAB | Optional module FAB for primary entity create on list screens |
| Dashboard widgets | Full-width quick action buttons in module dashboard stack |
| Long-press row | Context quick actions on list rows — not global creates |

**Tap target:** 44×44px minimum on mobile CTAs — [RESPONSIVE_UI_STANDARD.md](./RESPONSIVE_UI_STANDARD.md)

---

## 8. Context-Aware Quick Actions

| Context | Behaviour |
|---------|-----------|
| On CRM module | Promote "Create Lead" to top of `+` menu |
| On catalog products list | "Create Product" pinned |
| Record drawer open | Quick actions remain global — no nested create stack on mobile |
| AI suggestion | `DS-AI-SUGGESTIONS` may surface create prompts — opens same routes |

---

## 9. Module Compliance

```text
✅ Register quickActions in ModuleManifest
✅ Use ?create=1 drawer routes
✅ Permission-gate every action
✅ Mirror actions in command palette via commands[] registry
❌ Custom + menu in module header
❌ Full-page /new routes for standard entities
❌ Show actions user cannot perform
```

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 10.1A — quick action framework standard |

---

**Quick Action Framework Standard** — one + menu, manifest-driven, drawer-first creates.
