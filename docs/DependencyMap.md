# AgainERP — Dependency Map

> **Status:** Summary (see master map)  
> **Rule:** Update [MODULE_DEPENDENCY_MAP.md](./MODULE_DEPENDENCY_MAP.md) whenever any cross-module dependency is added, removed, or changed.  
> See [GOVERNANCE.md](./GOVERNANCE.md#dependency-map-rule) · **Master:** [MODULE_DEPENDENCY_MAP.md](./MODULE_DEPENDENCY_MAP.md) · **Platform:** [MASTER_MODULE_ARCHITECTURE.md](./MASTER_MODULE_ARCHITECTURE.md)

**Last Updated:** 2026-06-13

> **Canonical source:** [MODULE_DEPENDENCY_MAP.md](./MODULE_DEPENDENCY_MAP.md) — approved enterprise module dependency map (Step 19).

---

## Quick Reference

| Layer | Modules |
|-------|---------|
| **Platform** | Tenant, Billing, License, Feature Flags |
| **Core** | Users, Permissions, Settings, Media, Workflow, Approvals, Notifications, Search |
| **Business** | Catalog, Inventory, Purchase, Sales, CRM, Marketing, Finance |
| **Industry** | Hospital, School, Manufacturing, Marketplace, … |
| **AI** | AI OS |

**Golden rule:** No direct module-to-module dependency. Services (sync) + Events (async) only.

---

## Primary Business Flow

```
Catalog ──service──► Sales ──event──► Inventory
   │                    ├──event──► Finance
Purchase ──event──► Inventory ──event──► Finance
CRM ──service──► Sales    Marketing ──event──► CRM
```

---

## Dependency Table (Summary)

| Module | Depends On (direct) | Integrates Via Services/Events |
|--------|---------------------|--------------------------------|
| **Catalog** | Core | → Inventory, Sales, Purchase, Marketing, CRM |
| **Inventory** | Core | ↔ Catalog, Sales, Purchase, Finance |
| **Purchase** | Core | → Inventory, Finance; ← Catalog |
| **Sales** | Core | ↔ Catalog, Inventory, CRM, Finance, Marketing |
| **CRM** | Core | ↔ Sales, Marketing |
| **Marketing** | Core | ↔ Catalog, CRM, Sales |
| **Finance** | Core | ← Sales, Purchase, Inventory |
| **AI OS** | Core | Tools → all modules via services |

Full detail per module (events, services, consumes): **[MODULE_DEPENDENCY_MAP.md](./MODULE_DEPENDENCY_MAP.md)**

---

## Change Log (Dependency Map)

| Date | Change | Author |
|------|--------|--------|
| 2026-06-13 | Step 19 — MODULE_DEPENDENCY_MAP.md master map | — |
| 2026-06-12 | Master Module Architecture — four-layer model | — |
| 2026-06-12 | Initial dependency map created | — |
