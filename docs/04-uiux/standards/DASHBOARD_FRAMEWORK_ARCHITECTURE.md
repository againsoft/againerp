# AgainERP — Dashboard Framework Architecture

> **Status:** Active — **dashboard framework SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Lock:** [DASHBOARD_ARCHITECTURE_LOCK.md](../../DASHBOARD_ARCHITECTURE_LOCK.md) — APPROVED baseline  
> **Audience:** Architects · Product · Module teams · AI platform  
> **Governance:** [ARCHITECTURE_DECISIONS.md](../../ARCHITECTURE_DECISIONS.md) · [WORKSPACE_SHELL_ARCHITECTURE.md](./WORKSPACE_SHELL_ARCHITECTURE.md)

**No code · No database schema · No visual design.** Canonical dashboard architecture for AgainERP.

---

## Purpose

Define the **complete dashboard framework** — five architecture layers, seven dashboard types, widget system, personalization, permissions, and integration with notifications, activity, and AI.

## When To Read

Read before designing module dashboards, registering widgets, or documenting dashboard sections in `UI.md`.

## Related Files

- [WIDGET_REGISTRY_STANDARD.md](./WIDGET_REGISTRY_STANDARD.md) — widget metadata contract
- [DASHBOARD_LAYOUT_ENGINE.md](./DASHBOARD_LAYOUT_ENGINE.md) — grid and layout rules
- [ROLE_BASED_DASHBOARD_ARCHITECTURE.md](./ROLE_BASED_DASHBOARD_ARCHITECTURE.md) — role templates
- [AI_DASHBOARD_ARCHITECTURE.md](./AI_DASHBOARD_ARCHITECTURE.md) — AI surfaces
- [EXECUTIVE_DASHBOARD_ARCHITECTURE.md](./EXECUTIVE_DASHBOARD_ARCHITECTURE.md) — executive layer
- [MODULE_DASHBOARD_STANDARD.md](./MODULE_DASHBOARD_STANDARD.md) — per-module requirement
- [MOBILE_DASHBOARD_ARCHITECTURE.md](./MOBILE_DASHBOARD_ARCHITECTURE.md) — mobile rules
- [NAVIGATION_ARCHITECTURE.md](./NAVIGATION_ARCHITECTURE.md) — Level 2 Dashboard zone

## Read Next

[WIDGET_REGISTRY_STANDARD.md](./WIDGET_REGISTRY_STANDARD.md)

---

## 1. Design Goals

| Goal | Requirement |
|------|-------------|
| **Personal** | Every user can customize layout within permission bounds |
| **Role-based** | Default dashboards per role on first login |
| **Module-scoped** | Each module owns KPI widgets via manifest |
| **Executive** | Cross-module rollup for leadership |
| **Industry** | Vertical dashboards when industry app installed |
| **AI-first** | Briefings, recommendations, risk — platform AI OS |
| **Multi-tenant** | Dashboards scoped by tenant · company · branch |
| **Shell integration** | Renders in `WS-CONTENT-DASH` — no custom dashboard shells |

---

## 2. Five Architecture Layers

```text
Layer 05  Industry Dashboard        → Vertical KPIs (Hospital, School, …)
Layer 04  Executive Dashboard       → Cross-module business performance
Layer 03  Module Dashboard          → Per-module KPIs (Sales, CRM, Ecommerce)
Layer 02  Workspace Dashboard       → User home (/home) — overview + AI brief
Layer 01  Global Dashboard Engine   → Widget registry, layout, permissions, AI recs
```

Layer 01 is **platform infrastructure**. Layers 02–05 are **dashboard instances** composed from registered widgets.

### Layer 01 — Global Dashboard Engine

| Responsibility | Owner | Doc |
|----------------|-------|-----|
| Widget registration & discovery | Platform | [WIDGET_REGISTRY_STANDARD.md](./WIDGET_REGISTRY_STANDARD.md) |
| Layout engine (grid, resize, move) | Platform | [DASHBOARD_LAYOUT_ENGINE.md](./DASHBOARD_LAYOUT_ENGINE.md) |
| Personalization persistence | Platform | §6 below |
| Permission evaluation | Core RBAC | §12 below |
| AI recommendation feed | AI OS | [AI_DASHBOARD_ARCHITECTURE.md](./AI_DASHBOARD_ARCHITECTURE.md) |

### Layer 02 — Workspace Dashboard

Route: `/home` · Group: [Workspace Home](./GLOBAL_MENU_STRUCTURE.md#3-group-02--workspace-home)

| Responsibility | Widgets / integration |
|----------------|----------------------|
| User overview | KPI strip · welcome · workspace context |
| Quick actions | Header Quick Actions + dashboard quick-action widgets |
| Recent activity | Activity feed widget · recent items |
| Notifications | Alert widgets · pending approvals |
| AI briefing | AI Daily Brief widget |

### Layer 03 — Module Dashboard

Route: `/{module}/dashboard` · Zone: [Module Nav — Dashboard](./MODULE_NAVIGATION_STANDARD.md)

| Responsibility | Standard sections |
|----------------|-------------------|
| Module KPIs | KPI + chart widgets |
| Module analytics | Analytics widgets |
| Module activities | Activity + list widgets |
| Module shortcuts | Quick action widgets |

Standard: [MODULE_DASHBOARD_STANDARD.md](./MODULE_DASHBOARD_STANDARD.md)

### Layer 04 — Executive Dashboard

Route: `/executive` or `/home/executive` · Permission: executive role set

Sections: [EXECUTIVE_DASHBOARD_ARCHITECTURE.md](./EXECUTIVE_DASHBOARD_ARCHITECTURE.md)

### Layer 05 — Industry Dashboard

Route: `/{industry}/dashboard` · Visible when industry app installed

Examples: Hospital · School · Restaurant · Manufacturing vertical — widgets registered by industry module.

---

## 3. Dashboard Types

| Type | ID | Scope | Default audience |
|------|-----|-------|------------------|
| **Personal** | `dash.personal` | Single user | Any authenticated user |
| **Role** | `dash.role` | All users with role | Role template on first visit |
| **Department** | `dash.department` | Org unit / branch | Department heads |
| **Module** | `dash.module` | One module | Module users |
| **Executive** | `dash.executive` | Cross-module | C-suite, GM |
| **AI** | `dash.ai` | AI-focused layout | Power users, optional tab |
| **Industry** | `dash.industry` | Vertical package | Industry app users |

A user may have **multiple active dashboard views** — switcher in dashboard header (not a separate shell).

---

## 4. Widget System Overview

Eleven widget categories — each maps to registry `category` field:

| Category | Purpose |
|----------|---------|
| Analytics | Multi-metric analysis, drill-down entry |
| KPI | Single metric + trend + sparkline |
| Chart | Line · bar · pie · area |
| List | Top N records |
| Table | Mini grid with columns |
| Calendar | Events · tasks · schedule |
| Activity | Timeline · chatter summary |
| AI | Brief · recommendation · score |
| Alert | Threshold · risk · SLA breach |
| Report | Embedded report snapshot |
| Quick Action | Buttons · shortcuts |

Full registry rules: [WIDGET_REGISTRY_STANDARD.md](./WIDGET_REGISTRY_STANDARD.md)

---

## 5. Shell Integration

| Shell component | Dashboard use |
|---------------|---------------|
| `WS-CONTENT-DASH` | Dashboard page container |
| `WS-CONTENT-WIDGET` | Individual widget slot |
| `WS-MODNAV-DASH` | Module dashboard tab |
| `WS-HEADER-QUICK` | Quick actions (also widget category) |
| `WS-CONTEXT-AI` | Deep AI beyond dashboard AI widgets |

Dashboards use **Level 2 Module Navigation → Dashboard tab** or **Workspace Home** for Layer 02.

---

## 6. Personalization

Users with edit permission on a dashboard can:

| Action | Scope |
|--------|-------|
| Add widget | From catalog filtered by permission |
| Remove widget | Own layout only (unless admin) |
| Move widget | Drag within grid |
| Resize widget | Within min/max per widget |
| Save layout | Named **dashboard view** (optional) |
| Reset layout | Revert to role default |
| Create dashboard views | Personal copies of shared dashboards |

Persistence owned by **Layer 01 engine** — modules supply widgets only.

Detail: [DASHBOARD_LAYOUT_ENGINE.md §6](./DASHBOARD_LAYOUT_ENGINE.md#6-personalization)

---

## 7. Notification & Activity Integration

Dashboards **surface** platform feeds — modules do not rebuild notification systems.

| Feed | Widget category | Source |
|------|-----------------|--------|
| Notifications | Alert · List | Core notification engine |
| Approvals | Alert · Quick Action | Core Approval Engine |
| Tasks | List · Calendar | Core activities |
| Mentions | Activity | Core chatter |
| Activity logs | Activity | Core audit timeline |
| Workflow events | Activity · Alert | Core workflow + module events |

Widgets subscribe via **platform event bus** — refresh strategies in widget registry.

---

## 8. Permissions Model

| Visibility | Who can view | Who can edit layout |
|------------|--------------|---------------------|
| **Public** | All tenant users | Admin only |
| **Role** | Users with role | Role admin · user personalize copy |
| **Private** | Owner only | Owner |
| **Department** | Department members | Department admin |
| **Shared** | Explicit share list | Owner + editors |

Detail: [ROLE_BASED_DASHBOARD_ARCHITECTURE.md §4](./ROLE_BASED_DASHBOARD_ARCHITECTURE.md#4-dashboard-permissions)

Widget-level permissions enforced **before** catalog display and **on** data fetch.

---

## 9. AI Integration Summary

| Surface | Layer | Doc |
|---------|-------|-----|
| AI Daily Brief | Workspace · Executive | [AI_DASHBOARD_ARCHITECTURE.md](./AI_DASHBOARD_ARCHITECTURE.md) |
| AI Recommendations | All layers | Widget category `ai` |
| AI Risk Detection | Executive · Module | Alert + AI widgets |
| AI Forecasting | Module · Executive | Chart + AI widgets |
| AI Productivity Score | Workspace · Personal | AI widget |

AI widgets call **AI OS tools** — never direct module DB ([ARCHITECTURE_DECISIONS §6.2](../../ARCHITECTURE_DECISIONS.md#62-tools-call-services-never-orm)).

---

## 10. Document Map (Step 09)

| Topic | Document |
|-------|----------|
| Framework (this file) | DASHBOARD_FRAMEWORK_ARCHITECTURE.md |
| Widget registry | WIDGET_REGISTRY_STANDARD.md |
| Layout engine | DASHBOARD_LAYOUT_ENGINE.md |
| Role dashboards | ROLE_BASED_DASHBOARD_ARCHITECTURE.md |
| AI dashboards | AI_DASHBOARD_ARCHITECTURE.md |
| Executive | EXECUTIVE_DASHBOARD_ARCHITECTURE.md |
| Module standard | MODULE_DASHBOARD_STANDARD.md |
| Mobile | MOBILE_DASHBOARD_ARCHITECTURE.md |
| Legacy widget UI notes | [dashboard-widgets.md](./dashboard-widgets.md) |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 09 — dashboard framework architecture SSOT |

---

**Dashboard Framework Architecture** — five layers, seven types, one widget engine.
