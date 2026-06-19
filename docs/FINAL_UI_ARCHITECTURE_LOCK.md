# AgainERP — Final UI Architecture Lock

> **Status:** APPROVED  
> **Version:** 1.0  
> **Lock date:** 2026-06-19  
> **Step:** 10.2 — Final UI Architecture Lock  
> **Validation:** [FINAL_UI_VALIDATION_REPORT.md](./FINAL_UI_VALIDATION_REPORT.md) — Score **94/100** · **0 critical issues**  
> **Readiness:** [UI_READINESS_REPORT.md](./UI_READINESS_REPORT.md)

---

## Official Declaration

**This document is the official AgainERP UI Architecture Baseline.**

All UI development, prototypes, modules, industry apps, themes, plugins, and future features **must comply** with this architecture.

**No alternative UI pattern may be introduced** without an approved Architecture Decision Record (ADR).

**This lock supersedes** all previous UI architecture drafts including [UI_ARCHITECTURE_LOCK.md](./UI_ARCHITECTURE_LOCK.md) (interim Step 10.1 lock).

---

## Purpose

Permanent **governance anchor** for AgainERP UI — design system, workspace shell, navigation, dashboard integration, AI surfaces, enterprise context, and module compliance. Technical detail lives in linked standards; do not duplicate.

## When To Read

Read before **any** UI prototype design, Menus screen spec, module UI.md work, or UI architecture change proposal.

## Related Files

- [FINAL_UI_VALIDATION_REPORT.md](./FINAL_UI_VALIDATION_REPORT.md) — validation evidence
- [UI_READINESS_REPORT.md](./UI_READINESS_REPORT.md) — prototype vs production gate
- [DESIGN_SYSTEM_FOUNDATION.md](./04-uiux/standards/DESIGN_SYSTEM_FOUNDATION.md) — design SSOT
- [WORKSPACE_SHELL_ARCHITECTURE.md](./04-uiux/standards/WORKSPACE_SHELL_ARCHITECTURE.md) — shell (Step 07)
- [NAVIGATION_ARCHITECTURE.md](./04-uiux/standards/NAVIGATION_ARCHITECTURE.md) — navigation (Step 08)
- [DASHBOARD_ARCHITECTURE_LOCK.md](./DASHBOARD_ARCHITECTURE_LOCK.md) — dashboard (Step 09)
- [PRE_CODE_GATE.md](./00-foundation/PRE_CODE_GATE.md) · [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md)

---

## Lock Declaration

```text
┌─────────────────────────────────────────────────────────────────┐
│  AGAINERP UI ARCHITECTURE — FINAL BASELINE                      │
│  STATUS: APPROVED                                               │
│  VERSION: 1.0                                                   │
│  LOCK DATE: 2026-06-19                                          │
│  BASELINE: Steps 07 · 08 · 09 · 10 · 10.1 · 10.1A · 10.2      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Approved UI DNA

```text
AgainERP UI = 60% Odoo + 20% Shopify Admin + 10% Notion + 10% Linear
```

| Principle | Locked |
|-----------|--------|
| Fast | ✅ |
| Clean | ✅ |
| Enterprise | ✅ |
| Modular | ✅ |
| Mobile First | ✅ |
| AI First | ✅ |

Authority: [DESIGN_SYSTEM_FOUNDATION.md §1](./04-uiux/standards/DESIGN_SYSTEM_FOUNDATION.md#1-design-philosophy--againerp-ui-dna)

---

## 2. Approved Architecture Stack

### 2.1 Design system (Step 10 + 10.1A)

| Layer | Document |
|-------|----------|
| Foundation | [DESIGN_SYSTEM_FOUNDATION.md](./04-uiux/standards/DESIGN_SYSTEM_FOUNDATION.md) |
| Tokens | [DESIGN_TOKEN_STANDARD.md](./04-uiux/standards/DESIGN_TOKEN_STANDARD.md) |
| Layouts | [PAGE_LAYOUT_STANDARD.md](./04-uiux/standards/PAGE_LAYOUT_STANDARD.md) |
| Components | [COMPONENT_LIBRARY_STANDARD.md](./04-uiux/standards/COMPONENT_LIBRARY_STANDARD.md) |
| Tables / grids | [TABLE_AND_DATA_GRID_STANDARD.md](./04-uiux/standards/TABLE_AND_DATA_GRID_STANDARD.md) |
| Forms | [FORM_STANDARD.md](./04-uiux/standards/FORM_STANDARD.md) |
| Overlays | [DRAWER_MODAL_STANDARD.md](./04-uiux/standards/DRAWER_MODAL_STANDARD.md) |
| AI UI | [AI_COMPONENT_STANDARD.md](./04-uiux/standards/AI_COMPONENT_STANDARD.md) |
| Responsive | [RESPONSIVE_UI_STANDARD.md](./04-uiux/standards/RESPONSIVE_UI_STANDARD.md) |
| Workspace context | [WORKSPACE_CONTEXT_STANDARD.md](./04-uiux/standards/WORKSPACE_CONTEXT_STANDARD.md) |
| Command system | [UNIVERSAL_COMMAND_SYSTEM_STANDARD.md](./04-uiux/standards/UNIVERSAL_COMMAND_SYSTEM_STANDARD.md) |
| Quick actions | [QUICK_ACTION_FRAMEWORK_STANDARD.md](./04-uiux/standards/QUICK_ACTION_FRAMEWORK_STANDARD.md) |
| Empty states | [EMPTY_STATE_STANDARD.md](./04-uiux/standards/EMPTY_STATE_STANDARD.md) |
| Loading states | [LOADING_STATE_STANDARD.md](./04-uiux/standards/LOADING_STATE_STANDARD.md) |

### 2.2 Platform shells (Steps 07–09)

| Layer | Document |
|-------|----------|
| Workspace shell | [WORKSPACE_SHELL_ARCHITECTURE.md](./04-uiux/standards/WORKSPACE_SHELL_ARCHITECTURE.md) |
| Navigation | [NAVIGATION_ARCHITECTURE.md](./04-uiux/standards/NAVIGATION_ARCHITECTURE.md) |
| Dashboard | [DASHBOARD_ARCHITECTURE_LOCK.md](./DASHBOARD_ARCHITECTURE_LOCK.md) |

### 2.3 Visual language (extends — must not conflict)

| Document | Role |
|----------|------|
| [ENTERPRISE_UI_ARCHITECTURE.md](./04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md) | Enterprise patterns · smart interactions |

---

## 3. Locked CRUD Interaction Model

```text
List + right Sheet drawer — ?create=1 · ?view={id} · ?edit={id}
❌ Forbidden: /new · /[id]/edit for standard entities
```

| Property | Locked value |
|----------|--------------|
| Drawer | Right · 480px / 640px desktop · full-screen mobile |
| z-index | 70 |
| Create / Edit | Drawer modes — not separate routes |

Authority: [ARCHITECTURE_DECISIONS §5.1](./ARCHITECTURE_DECISIONS.md#51-crud--list--right-sheet-drawer) · [DRAWER_MODAL_STANDARD.md §2](./04-uiux/standards/DRAWER_MODAL_STANDARD.md#2-crud-drawer-locked)

---

## 4. Locked Layout Types

| Layout ID | Locked |
|-----------|--------|
| `LAYOUT-WORKSPACE` | Shell frame — modules Zone D only |
| `LAYOUT-MODULE` | Page header + content |
| `LAYOUT-DASHBOARD` | Widget grid — engine-owned |
| `LAYOUT-LIST` | List + drawer CRUD |
| `LAYOUT-DETAILS` | Drawer default · full page when complex |
| `LAYOUT-SETTINGS` | Configuration sections |
| `LAYOUT-ANALYTICS` | Charts + filters + drill-down |

---

## 5. Locked Workspace Context

Every screen receives: `workspace_id` · `company_id` · `branch_id` · `currency` · `language` · `timezone` · `fiscal_year`

Authority: [WORKSPACE_CONTEXT_STANDARD.md](./04-uiux/standards/WORKSPACE_CONTEXT_STANDARD.md)

---

## 6. Locked Global Interactions

| System | Locked value |
|--------|--------------|
| Command palette | `Ctrl+K` / `Cmd+K` — `DS-COMMAND-PALETTE` |
| Quick actions | `WS-HEADER-QUICK` — manifest-driven |
| AI header trigger | `Ctrl+J` / shell `WS-HEADER-AI` |
| Overlay z-index | 0 → 90 stack per WORKSPACE_LAYOUT_MAP |

Authority: [UNIVERSAL_COMMAND_SYSTEM_STANDARD.md](./04-uiux/standards/UNIVERSAL_COMMAND_SYSTEM_STANDARD.md) · [QUICK_ACTION_FRAMEWORK_STANDARD.md](./04-uiux/standards/QUICK_ACTION_FRAMEWORK_STANDARD.md)

---

## 7. Locked Component & Data Rules

| Rule | Locked |
|------|--------|
| Component IDs | `DS-{FAMILY}-{NAME}` |
| Tokens | Semantic only — no raw hex |
| Desktop list | `DS-DATAGRID` |
| Mobile list | `DS-CARD-LIST` |
| Accessibility | WCAG 2.1 AA |
| Tap targets | 44×44px minimum |
| Empty states | `DS-EMPTY-*` per EMPTY_STATE_STANDARD |
| Loading | Skeleton-first per LOADING_STATE_STANDARD |

---

## 8. Locked AI UI Rules

| Rule | Locked |
|------|--------|
| Six families | Panel · Chat · Suggestions · Actions · Insights · Briefing |
| Entry on major layouts | Required — graceful hide when AI off |
| Custom AI chrome | **Forbidden** per module |
| Dashboard AI widgets | Per DASHBOARD_ARCHITECTURE_LOCK §8 |

Authority: [AI_COMPONENT_STANDARD.md](./04-uiux/standards/AI_COMPONENT_STANDARD.md)

---

## 9. Locked Responsive Rules

| Breakpoint | Locked behaviour |
|------------|------------------|
| Mobile `< md` | Bottom nav · full-screen CRUD · card lists |
| Tablet | Collapsed sidebar · scrollable module nav |
| Desktop `≥ lg` | Full shell · utility panel |

Authority: [RESPONSIVE_UI_STANDARD.md](./04-uiux/standards/RESPONSIVE_UI_STANDARD.md)

---

## 10. Locked Enterprise Rules

| Dimension | Locked behaviour |
|-----------|------------------|
| Multi-tenant | Plan-gated menus · graceful module hide |
| Multi-company | Header switcher · data scoped by `company_id` |
| Multi-branch | Optional branch filter · `branch_id` in context |
| Industry apps | Dedicated nav group · industry dashboard layer |
| Plugins / modules | ModuleManifest registration — no custom shell |
| RBAC UI | Hide forbidden actions — never show disabled |
| 100+ modules | Nav groups · search · command index |

Authority: [WORKSPACE_CONTEXT_STANDARD.md](./04-uiux/standards/WORKSPACE_CONTEXT_STANDARD.md) · [NAVIGATION_ARCHITECTURE.md](./04-uiux/standards/NAVIGATION_ARCHITECTURE.md) · [permission-aware-ui.md](./04-uiux/standards/permission-aware-ui.md)

---

## 11. Non-Negotiable Prohibitions

```text
❌ Alternative UI patterns without ADR
❌ Module-specific design tokens or component variants
❌ Custom CRUD routes (/new, /[id]/edit) for standard entities
❌ Custom shell, sidebar, or header chrome per module
❌ Custom dashboard layout engine per module
❌ Raw hex/color values in Menus specs
❌ Desktop-only lists without mobile card fallback
❌ AI UI forks outside DS-AI-* families
❌ Cross-module DB access from UI layer
❌ Showing actions user lacks permission to perform
```

---

## 12. SSOT Hierarchy (Final)

```text
FINAL_UI_ARCHITECTURE_LOCK.md              ← governance (this file)
    └── DESIGN_SYSTEM_FOUNDATION.md
            ├── DESIGN_TOKEN_STANDARD.md
            ├── PAGE_LAYOUT_STANDARD.md
            ├── COMPONENT_LIBRARY_STANDARD.md
            ├── TABLE_AND_DATA_GRID_STANDARD.md
            ├── FORM_STANDARD.md
            ├── DRAWER_MODAL_STANDARD.md
            ├── AI_COMPONENT_STANDARD.md
            ├── RESPONSIVE_UI_STANDARD.md
            ├── WORKSPACE_CONTEXT_STANDARD.md
            ├── UNIVERSAL_COMMAND_SYSTEM_STANDARD.md
            ├── QUICK_ACTION_FRAMEWORK_STANDARD.md
            ├── EMPTY_STATE_STANDARD.md
            └── LOADING_STATE_STANDARD.md

Parallel platform locks:
    WORKSPACE_SHELL_ARCHITECTURE.md          (Step 07)
    NAVIGATION_ARCHITECTURE.md               (Step 08)
    DASHBOARD_ARCHITECTURE_LOCK.md           (Step 09)

Visual language (extends foundation):
    ENTERPRISE_UI_ARCHITECTURE.md

Superseded (on conflict — final lock wins):
    UI_ARCHITECTURE_LOCK.md
    design-system.md · components.md · forms.md · tables.md · command-palette.md
```

---

## 13. Change Control & ADR Requirements

| Action | Requirement |
|--------|-------------|
| Any UI architecture change | **ADR required** — update standards + this lock |
| New component in catalog | Update COMPONENT_LIBRARY + tokens if needed |
| CRUD drawer exception | ADR + module Architecture.md |
| Shell zone change | ADR + WORKSPACE_SHELL update |
| Dashboard widget contract change | ADR + DASHBOARD lock review |
| Module UI work | `layout_id` · `DS-*` IDs · context · empty/loading in Menus |

---

## 14. Module Compliance Checklist

Before marking UI documentation or prototype complete:

- [ ] Semantic tokens from DESIGN_TOKEN_STANDARD
- [ ] `layout_id` from PAGE_LAYOUT_STANDARD
- [ ] `context_required` from WORKSPACE_CONTEXT_STANDARD
- [ ] List screens per TABLE_AND_DATA_GRID_STANDARD
- [ ] CRUD via drawer URL params
- [ ] Mobile card fallback for lists
- [ ] Empty and loading states declared in Menus
- [ ] Quick actions / commands in ModuleManifest (if applicable)
- [ ] AI surfaces use DS-AI-* when module has AI.md
- [ ] No conflict with workspace, navigation, or dashboard locks

---

## 15. Validation Summary

| Metric | Value |
|--------|-------|
| Final validation score | **94 / 100** |
| Design system score | **96 / 100** |
| Critical issues | **0** |
| Warnings | **6** (P2/P3 — see validation report) |
| Validation report | [FINAL_UI_VALIDATION_REPORT.md](./FINAL_UI_VALIDATION_REPORT.md) |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 10.2 — final UI architecture lock APPROVED |

---

**Final UI Architecture Lock** — the permanent AgainERP UI baseline. Prototype design may begin.
