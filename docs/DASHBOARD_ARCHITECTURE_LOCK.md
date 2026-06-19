# AgainERP — Dashboard Architecture Lock

> **Status:** APPROVED  
> **Version:** 1.0 · **Lock date:** 2026-06-19  
> **Step:** 09.1 — Dashboard Framework Validation & Lock  
> **Validation:** [DASHBOARD_VALIDATION_REPORT.md](./DASHBOARD_VALIDATION_REPORT.md) — Score **92/100** · **0 critical issues**

---

## Purpose

Official **locked baseline** for AgainERP dashboard architecture. All future modules, industry packages, and platform work **must** conform to this lock unless superseded by a governed architecture change.

## When To Read

Read before implementing any dashboard, registering widgets, or proposing dashboard framework changes.

## Related Files

- [DASHBOARD_FRAMEWORK_ARCHITECTURE.md](./04-uiux/standards/DASHBOARD_FRAMEWORK_ARCHITECTURE.md) — master SSOT
- [DASHBOARD_VALIDATION_REPORT.md](./DASHBOARD_VALIDATION_REPORT.md) — validation evidence
- [PRE_CODE_GATE.md](./00-foundation/PRE_CODE_GATE.md) — docs-before-code gate

---

## Lock Declaration

```text
┌─────────────────────────────────────────────────────────────────┐
│  AGAINERP DASHBOARD ARCHITECTURE                                │
│  STATUS: APPROVED                                               │
│  EFFECTIVE: 2026-06-19                                          │
│  BASELINE: Step 09 + Step 09.1                                  │
└─────────────────────────────────────────────────────────────────┘
```

This document is the **governance anchor**. Technical detail lives in linked Step 09 standards — do not duplicate.

---

## 1. Approved Architecture Stack

| Layer | Name | Route pattern | Authority |
|-------|------|---------------|-----------|
| **01** | Global Dashboard Engine | (platform) | [DASHBOARD_FRAMEWORK_ARCHITECTURE.md](./04-uiux/standards/DASHBOARD_FRAMEWORK_ARCHITECTURE.md) |
| **02** | Workspace Dashboard | `/home` | Framework §2 |
| **03** | Module Dashboard | `/{module}/dashboard` | [MODULE_DASHBOARD_STANDARD.md](./04-uiux/standards/MODULE_DASHBOARD_STANDARD.md) |
| **04** | Executive Dashboard | `/executive` · `/home/executive` | [EXECUTIVE_DASHBOARD_ARCHITECTURE.md](./04-uiux/standards/EXECUTIVE_DASHBOARD_ARCHITECTURE.md) |
| **05** | Industry Dashboard | `/{industry}/dashboard` | Framework §2 Layer 05 |

---

## 2. Approved Dashboard Types

| Type ID | Locked |
|---------|--------|
| `dash.personal` | ✅ |
| `dash.role` | ✅ |
| `dash.department` | ✅ |
| `dash.module` | ✅ |
| `dash.executive` | ✅ |
| `dash.ai` | ✅ |
| `dash.industry` | ✅ |

---

## 3. Locked Ownership Model

### Platform (Dashboard Engine) — MUST NOT be implemented by modules

| Owns |
|------|
| Widget catalog merge and discovery |
| Layout grid (12-column), resize, move, pin |
| Dashboard configuration persistence (views, templates) |
| Dashboard-level permission evaluation |
| Shell rendering (`WS-CONTENT-DASH`, `WS-CONTENT-WIDGET`) |

**Documents:** [WIDGET_REGISTRY_STANDARD.md](./04-uiux/standards/WIDGET_REGISTRY_STANDARD.md) · [DASHBOARD_LAYOUT_ENGINE.md](./04-uiux/standards/DASHBOARD_LAYOUT_ENGINE.md)

### Business Modules — MUST provide

| Owns |
|------|
| Widget data via module API (`/api/v1/{module}/metrics/…`) |
| KPI and analytics business logic (module services) |
| Report widget content (Reports.md / Menus/Reports) |
| Widget manifest entries (`ModuleManifest.md` → `dashboard.widgets[]`) |
| Module dashboard sections per MODULE_DASHBOARD_STANDARD |

### Core / AI OS

| Owns |
|------|
| Notification, approval, activity feed sources |
| RBAC permission keys |
| AI tools, briefings, audit (AI OS) |

---

## 4. Locked Module Dashboard Standard

Every installable business module **must** include:

1. Overview  
2. KPI Summary (≥3 KPIs)  
3. Recent Activities  
4. Pending Tasks  
5. Reports (shortcuts)  
6. AI Suggestions (when module has AI.md)  
7. Quick Actions  

Register widgets per [WIDGET_REGISTRY_STANDARD.md](./04-uiux/standards/WIDGET_REGISTRY_STANDARD.md).

---

## 5. Locked Widget Rules

| Rule | Locked value |
|------|--------------|
| Widget ID format | `{module}.{kebab-name}` |
| Required metadata fields | 9 — see registry §2 |
| Categories | 11 — analytics, kpi, chart, list, table, calendar, activity, ai, alert, report, quick_action |
| Cross-module data | Platform aggregation services only — **no cross-module DB** |
| Mobile | Explicit `mobileSupport`: full · compact · none |
| AI | `aiSupport` object required; tools not ORM |

---

## 6. Locked Layout Rules

| Rule | Locked value |
|------|--------------|
| Grid | 12 columns |
| Presets | 1 · 2 · 3 · 4 column layouts |
| Row unit | 80px |
| Max widget height (default) | 6 rows |
| Personalization | User · role · department views — engine persists |
| Templates | `tpl.module.standard`, `tpl.executive.standard`, `tpl.workspace.home`, … |

---

## 7. Locked Mobile Rules

| Rule | Locked |
|------|--------|
| Mobile layout | Single column stack |
| Module mobile KPIs | ≥3 with `full` or `compact` |
| Legacy read-only mobile dashboards | **Superseded** — Step 09 mobile standard applies |
| Bottom nav | Home · Search · AI · Notifications · More |

Authority: [MOBILE_DASHBOARD_ARCHITECTURE.md](./04-uiux/standards/MOBILE_DASHBOARD_ARCHITECTURE.md)

---

## 8. Locked AI Rules

| Surface | Locked |
|---------|--------|
| AI Daily Brief | Workspace + Executive |
| AI Recommendations · Risk · Forecast · Opportunities | Module + Executive widgets |
| Dedicated AI dashboard | `dash.ai` at `/ai-os/dashboard` |
| Integration | AI OS tools · audit · credits |

Authority: [AI_DASHBOARD_ARCHITECTURE.md](./04-uiux/standards/AI_DASHBOARD_ARCHITECTURE.md)

---

## 9. Locked Permission Rules

| Rule | Locked |
|------|--------|
| Dual gate | Dashboard permission **and** widget permission |
| Visibility types | Public · Role · Private · Department · Shared |
| Executive | `dashboard.executive.view` + module metric permissions |
| Hide widgets | Omit from catalog — never show disabled |

Authority: [ROLE_BASED_DASHBOARD_ARCHITECTURE.md](./04-uiux/standards/ROLE_BASED_DASHBOARD_ARCHITECTURE.md) §4

---

## 10. Non-Negotiable Prohibitions

```text
❌ Custom dashboard shell per module
❌ Widget data via cross-module database JOIN
❌ Layout persistence owned by business modules
❌ AI widgets calling module ORM directly
❌ Dashboard without ModuleManifest widget registration
❌ Module dashboard missing required sections (without documented exception)
❌ Bypassing WIDGET_REGISTRY_STANDARD metadata
```

---

## 11. SSOT Hierarchy (Locked)

```text
DASHBOARD_ARCHITECTURE_LOCK.md          ← governance (this file)
    └── DASHBOARD_FRAMEWORK_ARCHITECTURE.md   ← technical master
            ├── WIDGET_REGISTRY_STANDARD.md
            ├── DASHBOARD_LAYOUT_ENGINE.md
            ├── MODULE_DASHBOARD_STANDARD.md
            ├── ROLE_BASED_DASHBOARD_ARCHITECTURE.md
            ├── AI_DASHBOARD_ARCHITECTURE.md
            ├── EXECUTIVE_DASHBOARD_ARCHITECTURE.md
            └── MOBILE_DASHBOARD_ARCHITECTURE.md

Deep dives (module-specific, NOT SSOT):
    └── e.g. ecommerce/dashboard/ARCHITECTURE.md → links to MODULE_DASHBOARD_STANDARD

Legacy (superseded):
    └── dashboard-widgets.md → layout/grid only; registry wins on conflict
```

---

## 12. Change Control

| Change type | Required action |
|-------------|-----------------|
| New widget category | Update registry + framework + validation report + lock version bump |
| New dashboard type | Framework + lock amendment + PRE_CODE_GATE |
| Layout grid change | Layout engine + lock version bump |
| Breaking widget metadata | Migration note + module CHANGELOG |
| Module dashboard exception | Architecture review + lock appendix |

**Version bump rule:** Increment lock `Version` and append `Change History` for any non-clarifying change.

---

## 13. Module Compliance Checklist (Locked)

Before marking module dashboard **Ready**:

| # | Requirement |
|---|-------------|
| 1 | `UI.md` § Dashboard Widgets — all sections mapped |
| 2 | `ModuleManifest.md` → `dashboard.widgets[]` complete |
| 3 | `API.md` metrics endpoints for KPI/chart widgets |
| 4 | `Permissions.md` keys per widget |
| 5 | `mobileSupport` set on every widget |
| 6 | Seven MODULE_DASHBOARD_STANDARD sections satisfied |
| 7 | No custom dashboard shell in module routes |
| 8 | Deep dive docs (if any) link to framework — do not claim SSOT |

---

## 14. Known Deferred Items (Approved at Lock)

Non-blocking — tracked in [DASHBOARD_VALIDATION_REPORT.md §10](./DASHBOARD_VALIDATION_REPORT.md#10-missing-standards-non-blocking):

- Workspace Dashboard standalone doc (M-01)
- Executive aggregation API spec (M-02)
- `mobilePriority` optional registry field (M-05)
- Manifest template dashboard block (M-06)

---

## 15. Approval Record

| Field | Value |
|-------|-------|
| **Status** | **APPROVED** |
| **Architecture score** | 92 / 100 |
| **Critical issues at lock** | 0 |
| **Effective date** | 2026-06-19 |
| **Baseline version** | 1.0 |
| **Supersedes** | Ad-hoc dashboard patterns · legacy `dashboard-widgets.md` as SSOT |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 09.1 — dashboard architecture locked APPROVED |

---

**Dashboard Architecture Lock** — APPROVED baseline for all AgainERP modules.
