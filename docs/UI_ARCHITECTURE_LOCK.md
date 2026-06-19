# AgainERP — UI Architecture Lock

> **Status:** Superseded — **do not use as governance SSOT**  
> **Superseded by:** [FINAL_UI_ARCHITECTURE_LOCK.md](./FINAL_UI_ARCHITECTURE_LOCK.md) — **APPROVED v1.0** (Step 10.2 permanent baseline)  
> **On conflict:** FINAL_UI_ARCHITECTURE_LOCK wins.

> **Status:** APPROVED (interim)  
> **Version:** 1.0 · **Lock date:** 2026-06-19  
> **Step:** 10.1 — Enterprise UI Architecture Validation & Lock  
> **Validation:** [UI_ARCHITECTURE_VALIDATION_REPORT.md](./UI_ARCHITECTURE_VALIDATION_REPORT.md) — Score **91/100** · **0 critical issues**  
> **Foundation:** [DESIGN_SYSTEM_FOUNDATION.md](./04-uiux/standards/DESIGN_SYSTEM_FOUNDATION.md) — design system SSOT

---

## Purpose

Official **locked baseline** for AgainERP UI architecture — design philosophy, tokens, layouts, components, overlays, AI surfaces, and responsive rules. All future modules, prototypes, and platform UI work **must** conform to this lock unless superseded by a governed architecture change.

## When To Read

Read before implementing any admin UI, writing Menus screen specs, or proposing design system changes.

## Related Files

- [UI_ARCHITECTURE_VALIDATION_REPORT.md](./UI_ARCHITECTURE_VALIDATION_REPORT.md) — validation evidence
- [DESIGN_SYSTEM_FOUNDATION.md](./04-uiux/standards/DESIGN_SYSTEM_FOUNDATION.md) — master design SSOT
- [WORKSPACE_SHELL_ARCHITECTURE.md](./04-uiux/standards/WORKSPACE_SHELL_ARCHITECTURE.md) — shell lock (Step 07)
- [NAVIGATION_ARCHITECTURE.md](./04-uiux/standards/NAVIGATION_ARCHITECTURE.md) — navigation lock (Step 08)
- [DASHBOARD_ARCHITECTURE_LOCK.md](./DASHBOARD_ARCHITECTURE_LOCK.md) — dashboard lock (Step 09)
- [PRE_CODE_GATE.md](./00-foundation/PRE_CODE_GATE.md) — docs-before-code gate

---

## Lock Declaration

```text
┌─────────────────────────────────────────────────────────────────┐
│  AGAINERP UI ARCHITECTURE                                       │
│  STATUS: APPROVED                                               │
│  EFFECTIVE: 2026-06-19                                          │
│  BASELINE: Step 10 + Step 10.1                                   │
└─────────────────────────────────────────────────────────────────┘
```

This document is the **governance anchor**. Technical detail lives in linked Step 10 standards — do not duplicate.

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

## 2. Approved Design System Stack

| Layer | Document | Scope |
|-------|----------|-------|
| **Foundation** | [DESIGN_SYSTEM_FOUNDATION.md](./04-uiux/standards/DESIGN_SYSTEM_FOUNDATION.md) | Philosophy, taxonomy, compliance |
| **Tokens** | [DESIGN_TOKEN_STANDARD.md](./04-uiux/standards/DESIGN_TOKEN_STANDARD.md) | Color, type, space, radius, shadow, border, z-index, opacity, motion |
| **Layouts** | [PAGE_LAYOUT_STANDARD.md](./04-uiux/standards/PAGE_LAYOUT_STANDARD.md) | Workspace, module, dashboard, list, details, settings, analytics |
| **Components** | [COMPONENT_LIBRARY_STANDARD.md](./04-uiux/standards/COMPONENT_LIBRARY_STANDARD.md) | Foundation UI catalog (`DS-*` IDs) |
| **Data UI** | [TABLE_AND_DATA_GRID_STANDARD.md](./04-uiux/standards/TABLE_AND_DATA_GRID_STANDARD.md) | Tables, filters, bulk, pagination, search, export |
| **Forms** | [FORM_STANDARD.md](./04-uiux/standards/FORM_STANDARD.md) | Entity forms, validation, sections |
| **Overlays** | [DRAWER_MODAL_STANDARD.md](./04-uiux/standards/DRAWER_MODAL_STANDARD.md) | Drawer, modal, popover, dropdown, tooltip, command palette |
| **AI UI** | [AI_COMPONENT_STANDARD.md](./04-uiux/standards/AI_COMPONENT_STANDARD.md) | Assistant, chat, suggestions, actions, insights, briefing |
| **Responsive** | [RESPONSIVE_UI_STANDARD.md](./04-uiux/standards/RESPONSIVE_UI_STANDARD.md) | Desktop, tablet, mobile |

---

## 3. Locked CRUD Interaction Model

```text
List + right Sheet drawer — ?create=1 · ?view={id} · ?edit={id}
❌ Forbidden: /new · /[id]/edit for standard entities
```

| Property | Locked value |
|----------|--------------|
| Drawer direction | Right |
| Desktop width | 480px default · 640px complex |
| Mobile | Full-screen sheet |
| z-index | 70 |

Authority: [ARCHITECTURE_DECISIONS §5.1](./ARCHITECTURE_DECISIONS.md#51-crud--list--right-sheet-drawer) · [DRAWER_MODAL_STANDARD.md §2](./04-uiux/standards/DRAWER_MODAL_STANDARD.md#2-crud-drawer-locked)

---

## 4. Locked Layout Types

| Layout ID | Locked |
|-----------|--------|
| `LAYOUT-WORKSPACE` | ✅ Shell frame — modules render Zone D only |
| `LAYOUT-MODULE` | ✅ Page header + content |
| `LAYOUT-DASHBOARD` | ✅ Widget grid — engine-owned |
| `LAYOUT-LIST` | ✅ List + drawer CRUD |
| `LAYOUT-DETAILS` | ✅ Drawer default · full page for complex |
| `LAYOUT-SETTINGS` | ✅ Configuration sections |
| `LAYOUT-ANALYTICS` | ✅ Charts + filters + drill-down |

Authority: [PAGE_LAYOUT_STANDARD.md](./04-uiux/standards/PAGE_LAYOUT_STANDARD.md)

---

## 5. Locked Component Rules

| Rule | Locked value |
|------|--------------|
| Component IDs | `DS-{FAMILY}-{NAME}` format |
| Token usage | Semantic tokens only — no raw hex in specs |
| Module variants | **Forbidden** — use catalog components |
| Tap targets (mobile) | 44×44px minimum |
| Accessibility | WCAG 2.1 AA |
| Status colors | Universal status system — all modules |

Authority: [COMPONENT_LIBRARY_STANDARD.md](./04-uiux/standards/COMPONENT_LIBRARY_STANDARD.md)

---

## 6. Locked Data UI Rules

| Rule | Locked |
|------|--------|
| Desktop list | Data grid (`DS-DATAGRID`) |
| Mobile list | Card list (`DS-CARD-LIST`) — same data |
| Row click | Opens `?view={id}` drawer |
| Bulk actions | Sticky bar when rows selected |
| Export | Respects filters + permissions |

Authority: [TABLE_AND_DATA_GRID_STANDARD.md](./04-uiux/standards/TABLE_AND_DATA_GRID_STANDARD.md)

---

## 7. Locked Overlay Stack

| Layer | z-index |
|-------|---------|
| Sticky headers | 10–20 |
| Sidebar | 40 |
| Global header | 50 |
| Dropdown / popover | 60 |
| Drawer / modal | 70 |
| Command palette | 80 |
| Toast | 90 |

Authority: [WORKSPACE_LAYOUT_MAP.md §7](./04-uiux/standards/WORKSPACE_LAYOUT_MAP.md#7-z-index-scale) · [DRAWER_MODAL_STANDARD.md §10](./04-uiux/standards/DRAWER_MODAL_STANDARD.md#10-overlay-stacking-order)

---

## 8. Locked AI UI Rules

| Surface | Locked |
|---------|--------|
| AI entry on major layouts | Required (graceful hide when AI off) |
| Component families | Panel · Chat · Suggestions · Actions · Insights · Briefing |
| Custom AI chrome per module | **Forbidden** |
| AI module disabled | Hide entry points — no broken UI |

Authority: [AI_COMPONENT_STANDARD.md](./04-uiux/standards/AI_COMPONENT_STANDARD.md)

---

## 9. Locked Responsive Rules

| Breakpoint | Locked behavior |
|------------|-----------------|
| Mobile `< md` | Bottom nav · full-screen CRUD · card lists |
| Tablet `md–lg` | Collapsed sidebar · scrollable module nav |
| Desktop `≥ lg` | Full shell · parallel utility panel |

Authority: [RESPONSIVE_UI_STANDARD.md](./04-uiux/standards/RESPONSIVE_UI_STANDARD.md) · [MOBILE_NAVIGATION_ARCHITECTURE.md](./04-uiux/standards/MOBILE_NAVIGATION_ARCHITECTURE.md)

---

## 10. Integration With Prior Locks

| Prior lock | Relationship |
|------------|--------------|
| Workspace shell (Step 07) | Design system renders **inside** shell zones |
| Navigation (Step 08) | Module nav zones unchanged |
| Dashboard (Step 09) | Dashboard layouts use same tokens + `LAYOUT-DASHBOARD` |

Step 10 **extends** Steps 07–09 — does not replace shell, navigation, or dashboard locks.

---

## 11. Non-Negotiable Prohibitions

```text
❌ Module-specific design tokens or component variants
❌ Custom CRUD routes (/new, /[id]/edit) for standard entities
❌ Custom shell, sidebar, or header chrome per module
❌ Raw hex/color values in Menus specs or components
❌ Desktop-only list views without mobile card fallback
❌ AI UI forks outside DS-AI-* component families
❌ Screen designs or implementation in Step 10 docs (standards only)
```

---

## 12. SSOT Hierarchy (Locked)

```text
UI_ARCHITECTURE_LOCK.md                         ← governance (this file)
    └── DESIGN_SYSTEM_FOUNDATION.md             ← design SSOT
            ├── DESIGN_TOKEN_STANDARD.md
            ├── PAGE_LAYOUT_STANDARD.md
            ├── COMPONENT_LIBRARY_STANDARD.md
            ├── TABLE_AND_DATA_GRID_STANDARD.md
            ├── FORM_STANDARD.md
            ├── DRAWER_MODAL_STANDARD.md
            ├── AI_COMPONENT_STANDARD.md
            └── RESPONSIVE_UI_STANDARD.md

Parallel locks (unchanged):
    WORKSPACE_SHELL_ARCHITECTURE.md
    NAVIGATION_ARCHITECTURE.md
    DASHBOARD_ARCHITECTURE_LOCK.md

Visual language (extends foundation):
    ENTERPRISE_UI_ARCHITECTURE.md

Legacy (superseded on conflict):
    design-system.md · components.md · forms.md · tables.md
```

---

## 13. Change Control

| Action | Requirement |
|--------|-------------|
| Propose UI architecture change | Update Step 10 standards + this lock via governed review |
| Add component to catalog | Update COMPONENT_LIBRARY_STANDARD + token refs if needed |
| Exception to CRUD drawer | Document in ARCHITECTURE_DECISIONS + module Architecture.md |
| Module UI work | Must cite layout_id and DS-* IDs in Menus specs |

---

## 14. Compliance Checklist

Before marking UI work complete:

- [ ] Uses semantic tokens from DESIGN_TOKEN_STANDARD
- [ ] Declares layout_id from PAGE_LAYOUT_STANDARD
- [ ] List screens follow TABLE_AND_DATA_GRID_STANDARD
- [ ] CRUD uses drawer URL params — not separate routes
- [ ] Mobile card fallback for lists
- [ ] 44px tap targets on mobile
- [ ] AI surfaces use DS-AI-* when module has AI.md
- [ ] No conflict with WORKSPACE, NAVIGATION, or DASHBOARD locks

---

## 15. Validation Summary (Step 10.1)

| Metric | Value |
|--------|-------|
| Validation score | **91 / 100** |
| Critical issues | **0** |
| Lock status | **APPROVED** |
| Validation report | [UI_ARCHITECTURE_VALIDATION_REPORT.md](./UI_ARCHITECTURE_VALIDATION_REPORT.md) |

**Validated areas:** consistency · component ownership · responsive · accessibility · AI · workspace · SaaS · multi-tenant · navigation · dashboard compatibility.

**Non-blocking conditions:** Resolve medium-priority doc conflicts (U-01–U-05) in Phase 2 documentation pass — see validation report §13–§16.

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 10.1 — UI architecture validation; lock APPROVED (91/100) |

---

**UI Architecture Lock** — APPROVED baseline for AgainERP design system and UI foundation.
