# AgainERP — Design System Foundation

> **Status:** Active — **design system SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 10 — Enterprise Design System & UI Foundation  
> **Lock:** [FINAL_UI_ARCHITECTURE_LOCK.md](../../FINAL_UI_ARCHITECTURE_LOCK.md) — **APPROVED permanent baseline** · [UI_READINESS_REPORT.md](../../UI_READINESS_REPORT.md)  
> **Governance:** [ARCHITECTURE_DECISIONS.md §5](../../ARCHITECTURE_DECISIONS.md#5-ui-rules) · [DASHBOARD_ARCHITECTURE_LOCK.md](../../DASHBOARD_ARCHITECTURE_LOCK.md)

**No code · No screen mocks · No component implementation.** Single source of truth for all AgainERP UI work.

---

## Purpose

Define the **official AgainERP Design System** — philosophy, token system, layout patterns, component taxonomy, and integration with workspace shell, navigation, and dashboard frameworks.

## When To Read

Read before any UI documentation, prototype build guide, or Menus screen spec that describes interaction patterns.

## Related Files

- [DESIGN_TOKEN_STANDARD.md](./DESIGN_TOKEN_STANDARD.md)
- [COMPONENT_LIBRARY_STANDARD.md](./COMPONENT_LIBRARY_STANDARD.md)
- [PAGE_LAYOUT_STANDARD.md](./PAGE_LAYOUT_STANDARD.md)
- [RESPONSIVE_UI_STANDARD.md](./RESPONSIVE_UI_STANDARD.md)
- [WORKSPACE_SHELL_ARCHITECTURE.md](./WORKSPACE_SHELL_ARCHITECTURE.md)
- [UI_PROTOTYPE_MODE.md](../strategy/UI_PROTOTYPE_MODE.md)

## Read Next

[DESIGN_TOKEN_STANDARD.md](./DESIGN_TOKEN_STANDARD.md)

---

## 1. Design Philosophy — AgainERP UI DNA

```text
AgainERP UI = 60% Odoo + 20% Shopify Admin + 10% Notion + 10% Linear
```

| Source | Weight | Patterns adopted |
|--------|--------|------------------|
| **Odoo** | 60% | Sidebar shell, smart buttons, record tabs, chatter, global search, reports, approvals |
| **Shopify Admin** | 20% | Clean commerce tables, order flows, mobile commerce density |
| **Notion** | 10% | Form sections, inline edit, minimal chrome, draft/autosave |
| **Linear** | 10% | Command palette, keyboard shortcuts, fast navigation |

**Objective:** Not a clone — a cohesive **enterprise ERP** language unique to AgainERP.

### 1.1 Core principles

| Principle | Requirement |
|-----------|-------------|
| **Fast** | < 200ms perceived interactions; skeleton loaders; optimistic UI where safe |
| **Clean** | Purpose-driven UI; no decorative chrome |
| **Enterprise** | Density, bulk actions, audit, multi-company, RBAC-aware UI |
| **Modular** | Same components in 100+ modules — no module-specific UI forks |
| **Mobile First** | Design at 375px; enhance upward |
| **AI First** | Assistant surfaces on every major layout; AI-aware empty states |

Also: **Accessible** (WCAG 2.1 AA) · **Keyboard friendly** · **Consistent** (one pattern per interaction type).

---

## 2. Architecture Stack (UI)

```text
FINAL_UI_ARCHITECTURE_LOCK.md              ← governance (permanent)
    └── DESIGN_SYSTEM_FOUNDATION.md        ← this file (design SSOT)
            ├── DESIGN_TOKEN_STANDARD.md
            ├── PAGE_LAYOUT_STANDARD.md
            ├── COMPONENT_LIBRARY_STANDARD.md
            ├── TABLE_AND_DATA_GRID_STANDARD.md
            ├── FORM_STANDARD.md
            ├── DRAWER_MODAL_STANDARD.md
            ├── AI_COMPONENT_STANDARD.md
            ├── RESPONSIVE_UI_STANDARD.md
            ├── WORKSPACE_CONTEXT_STANDARD.md      ← Step 10.1A
            ├── UNIVERSAL_COMMAND_SYSTEM_STANDARD.md
            ├── QUICK_ACTION_FRAMEWORK_STANDARD.md
            ├── EMPTY_STATE_STANDARD.md
            └── LOADING_STATE_STANDARD.md

Shell & navigation (locked separately):
    WORKSPACE_SHELL_ARCHITECTURE.md
    NAVIGATION_ARCHITECTURE.md
    DASHBOARD_ARCHITECTURE_LOCK.md

Visual language (extends foundation):
    ENTERPRISE_UI_ARCHITECTURE.md

Legacy (superseded on conflict):
    design-system.md · components.md · forms.md · tables.md
```

---

## 3. Design Tokens

All visual values use **semantic tokens** — never raw hex in component specs.

| Domain | Standard |
|--------|----------|
| Colors | [DESIGN_TOKEN_STANDARD.md §2](./DESIGN_TOKEN_STANDARD.md#2-color-tokens) |
| Typography | §3 |
| Spacing | §4 |
| Radius | §5 |
| Shadows | §6 |
| Borders | §7 |
| Z-index | §8 |
| Opacity | §9 |
| Motion | §10 |

Theme layers: [theme-system.md](./theme-system.md) · [dark-mode.md](./dark-mode.md)

---

## 4. Layout System

| Layout | Use | Standard |
|--------|-----|----------|
| **Workspace** | Shell frame | [WORKSPACE_SHELL_ARCHITECTURE.md](./WORKSPACE_SHELL_ARCHITECTURE.md) |
| **Module** | Standard CRUD pages | [PAGE_LAYOUT_STANDARD.md §3](./PAGE_LAYOUT_STANDARD.md#3-module-layout) |
| **Dashboard** | Widget grids | [DASHBOARD_ARCHITECTURE_LOCK.md](../../DASHBOARD_ARCHITECTURE_LOCK.md) |
| **List** | Entity index | PAGE_LAYOUT §4 |
| **Details** | Record view | PAGE_LAYOUT §5 |
| **Settings** | Configuration | PAGE_LAYOUT §6 |
| **Analytics** | Charts / drill-down | PAGE_LAYOUT §7 |

---

## 5. Component Taxonomy

| Family | Standard |
|--------|----------|
| **Foundation** | Buttons, inputs, selects, checkbox, radio, switch, tags, badges, alerts, cards |
| **Data** | Tables, data grid, filters, bulk actions, pagination, search, export |
| **Overlay** | Drawer, modal, popover, dropdown, tooltip, command palette |
| **Productivity** | Kanban, calendar, timeline, activity feed, comments, attachments |
| **AI** | Assistant panel, chat, suggestions, actions, insights, briefing |

Detail: [COMPONENT_LIBRARY_STANDARD.md](./COMPONENT_LIBRARY_STANDARD.md) and family-specific docs.

### 5.1 Platform interaction standards (Step 10.1A)

| Family | Standard |
|--------|----------|
| **Workspace context** | Mandatory screen context — company, branch, currency, locale |
| **Command system** | Global `Ctrl+K` palette — search, navigate, create, AI |
| **Quick actions** | Header `+` menu — manifest-driven creates |
| **Empty states** | No data, no results, no permission, AI first-run |
| **Loading states** | Skeleton, refresh, optimistic, long-running tasks |

| Topic | Document |
|-------|----------|
| Workspace context | [WORKSPACE_CONTEXT_STANDARD.md](./WORKSPACE_CONTEXT_STANDARD.md) |
| Command system | [UNIVERSAL_COMMAND_SYSTEM_STANDARD.md](./UNIVERSAL_COMMAND_SYSTEM_STANDARD.md) |
| Quick actions | [QUICK_ACTION_FRAMEWORK_STANDARD.md](./QUICK_ACTION_FRAMEWORK_STANDARD.md) |
| Empty states | [EMPTY_STATE_STANDARD.md](./EMPTY_STATE_STANDARD.md) |
| Loading states | [LOADING_STATE_STANDARD.md](./LOADING_STATE_STANDARD.md) |

---

## 6. CRUD Interaction Model (Locked)

Per [ARCHITECTURE_DECISIONS §5.1](../../ARCHITECTURE_DECISIONS.md#51-crud--list--right-sheet-drawer):

```text
List + right Sheet drawer — ?create=1 · ?view={id} · ?edit={id}
❌ Forbidden: /new · /[id]/edit for standard entities
```

Overlay standard: [DRAWER_MODAL_STANDARD.md](./DRAWER_MODAL_STANDARD.md)

---

## 7. Module Compliance

Modules **must not**:

- Introduce custom design tokens
- Ship module-specific button/table/drawer variants
- Build custom dashboard or shell chrome
- Skip mobile or accessibility rules

Modules **must**:

- Use PAGE_LAYOUT patterns in `UI.md` and Menus specs
- Reference component IDs from COMPONENT_LIBRARY_STANDARD
- Follow FORM_STANDARD for all entity forms
- Use TABLE_AND_DATA_GRID_STANDARD for list views
- Declare workspace context per WORKSPACE_CONTEXT_STANDARD
- Register quick actions and commands in ModuleManifest

---

## 8. Prototype Mode Alignment

During [UI Prototype Mode](../strategy/UI_PROTOTYPE_MODE.md):

- Prototype uses design tokens and components from this system
- Shadcn UI maps to AgainERP component IDs — not ad-hoc styling
- AG Grid / Recharts follow TABLE and chart token rules
- Prototype validates UX; production implements same contracts

---

## 9. Document Map (Step 10)

| Topic | Document |
|-------|----------|
| Foundation (this file) | DESIGN_SYSTEM_FOUNDATION.md |
| Tokens | DESIGN_TOKEN_STANDARD.md |
| Components catalog | COMPONENT_LIBRARY_STANDARD.md |
| Tables / grids | TABLE_AND_DATA_GRID_STANDARD.md |
| Forms | FORM_STANDARD.md |
| Overlays | DRAWER_MODAL_STANDARD.md |
| AI UI | AI_COMPONENT_STANDARD.md |
| Responsive | RESPONSIVE_UI_STANDARD.md |
| Page layouts | PAGE_LAYOUT_STANDARD.md |
| Workspace context | WORKSPACE_CONTEXT_STANDARD.md |
| Command system | UNIVERSAL_COMMAND_SYSTEM_STANDARD.md |
| Quick actions | QUICK_ACTION_FRAMEWORK_STANDARD.md |
| Empty states | EMPTY_STATE_STANDARD.md |
| Loading states | LOADING_STATE_STANDARD.md |
| Lock | FINAL_UI_ARCHITECTURE_LOCK.md |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 10 — design system foundation SSOT |
| 2026-06-19 | 1.1 | Step 10.1A — platform interaction standards (context, command, quick action, empty, loading) |

---

**Design System Foundation** — one language, every module, every screen.
