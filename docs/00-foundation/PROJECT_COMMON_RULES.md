# AgainERP — Project Common Rules

> **Status:** Active  
> **Version:** 1.0  
> **Applies to:** Entire project — prototype UI, backend (future), documentation, AI agents  
> **Governance:** [GOVERNANCE.md](GOVERNANCE.md) · [DEVELOPMENT_STANDARDS.md](standards/DEVELOPMENT_STANDARDS.md)

**এই ফাইল AgainERP-এর universal rules।** নতুন module, screen, plan, বা architecture যেকোনো কাজে এই rules maintain করতে হবে।

**Implementation শুরুর আগে:** [PROJECT_BRAIN.md](./PROJECT_BRAIN.md) পড়তে হবে।

---

## Purpose
Full project common rules — modules, SaaS, UI, documentation-first.

## When To Read
Read before multi-module or architecture work needing complete rule detail.

## Related Files
- [Cursor entry](../BRAIN.md)
- [Governance](GOVERNANCE.md)

## Read Next
- [Before code](PRE_CODE_GATE.md)

---

## 1. Module tiers — Core vs optional

### Layer 1 — Core (always on)

Core modules **সব tenant-এ mandatory**। কোনো business module Core ছাড়া চলবে না।

| Examples | Role |
|----------|------|
| Users, Roles, Permissions | Identity & access |
| Companies, Branches | Multi-tenant scope |
| Contacts, Addresses | Unified parties |
| Activities, Audit, Settings | Collaboration & config |
| Workflow, Events, API Manager | Platform engines |

**Detail:** [MASTER_MODULE_ARCHITECTURE.md](../01-architecture/MASTER_MODULE_ARCHITECTURE.md) · [framework/CORE_SERVICES.md](../05-development/framework/CORE_SERVICES.md)

### Layer 2+ — Business & industry (optional per tenant)

ERP, Ecommerce, Manufacturing, CRM, POS, Hospital, … — **tenant plan / feature flag অনুযায়ী on/off** হতে পারে। সব tenant-এর সব module লাগবে না।

| Layer | Examples | Install |
|-------|----------|---------|
| Ecommerce | Catalog, Orders, Marketing | Optional |
| ERP | Inventory, Sales, Purchase, Accounting | Optional |
| Industry | Manufacturing, Hospital, School | Optional |
| AI OS | Agents, tools | Optional |

---

## 2. Module independence rule (critical)

> **একটি module off থাকলে অন্য module-এ কোনো সমস্যা হবে না।**

### Must do

| Rule | Implementation |
|------|----------------|
| **No cross-module DB** | Module A কখনো Module B-র table read/write করবে না |
| **Service/API only** | Cross-module যোগাযোগ শুধু owning module-এর public service বা API দিয়ে |
| **Event-driven optional deps** | Event publish করবে; subscriber না থাকলে silently skip |
| **UUID references** | Foreign key অন্য module table-এ নয় — `product_id`, `order_id` (UUID) store |
| **Graceful UI degradation** | Module off → menu hide, feature hide — **crash / 404 নয়** |
| **Explicit dependency declare** | `ModuleManifest.md` + `MODULE_DEPENDENCY_MAP.md`-এ soft/hard dep লিখতে হবে |

### Module off behavior

```text
Manufacturing OFF:
  ✓ Inventory, Sales, Catalog — normal কাজ করে
  ✓ Sidebar-এ Manufacturing menu দেখায় না
  ✓ Inventory events manufacturing subscriber skip করে
  ✗ WO create বা mfg table access — forbidden

Accounting OFF:
  ✓ Purchase receipt → inventory stock in হয়
  ✓ Journal entry skip (optional subscriber)
  ✗ AP/GL screens hidden
```

### Forbidden patterns

| ❌ Forbidden | ✅ Instead |
|-------------|-----------|
| `JOIN manufacturing_work_orders ON …` from Inventory | `ManufacturingService.getWorkOrder(id)` |
| Hard import optional module store in Core | Feature flag + dynamic import / event |
| Required nav item for uninstalled module | Conditional nav from module registry |
| Sync call that throws if module missing | Return `ModuleNotEnabled` / no-op |

**Detail:** [UNIVERSAL_MODULE_FRAMEWORK.md](UNIVERSAL_MODULE_FRAMEWORK.md) · [MODULE_DEPENDENCY_MAP.md](../01-architecture/MODULE_DEPENDENCY_MAP.md)

---

## 3. SaaS & scaling architecture

AgainERP **multi-tenant SaaS** — future-এ scale ও per-module develop করা যাবে।

| Principle | Rule |
|-----------|------|
| **Tenant isolation** | `tenant_id` সব business table-এ; cross-tenant access নিষিদ্ধ |
| **Per-tenant modules** | Plan/feature flag দিয়ে module enable/disable |
| **Independent deploy path** | Module = own docs package + own API namespace + own tables |
| **Horizontal scale** | Stateless API, queue for async, cache for hot reads |
| **API-first** | Web, mobile, AI, integrations — same `/api/v1/{module}/` |
| **No monolith coupling** | Module team একটির উপর অন্যটি block করবে না |

```text
Tenant A: Core + Ecommerce + Inventory
Tenant B: Core + Manufacturing + Accounting + CRM
Tenant C: Core + Hospital + POS
```

**Detail:** [SAAS_PLATFORM_ARCHITECTURE.md](../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md) · [MASTER_MODULE_ARCHITECTURE.md](../01-architecture/MASTER_MODULE_ARCHITECTURE.md)

### Module development checklist (new module)

- [ ] `docs/modules/{module}/` — Architecture, Database, API, Workflow, Permissions, ModuleManifest
- [ ] Unique table prefix (`mfg_*`, `commerce_*`, …)
- [ ] Core Services only — no peer module DB access
- [ ] Events documented — subscribers marked optional
- [ ] Feature flag key in platform manifest
- [ ] `MODULE_DEPENDENCY_MAP.md` updated
- [ ] `CHANGELOG.md` entry

---

## 4. UI rule — Create · View · Edit = Drawer (Sheet)

**সব module-এ list + drawer pattern default।** Full-page `/new` বা `/[id]/edit` route avoid করবে।

### Standard pattern (reference: `/catalog/products`)

| Action | URL | UI |
|--------|-----|-----|
| **List** | `/module/entities` | AG Grid (or responsive table) |
| **Create** | `?create=1` | Right **Sheet** drawer — form |
| **View** | `?view={id}` | Right **Sheet** drawer — read-only |
| **Edit** | `?edit={id}` | Same Sheet — form mode |
| **Update** | Save in edit drawer | Store/API patch → `?view={id}` or close |

### Drawer spec

```tsx
<Sheet open={open} onOpenChange={...}>
  <SheetContent
    side="right"
    className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
  >
    {/* DetailContent or Form */}
  </SheetContent>
</Sheet>
```

### Rules

1. **Never** separate routes like `/entities/new` or `/entities/[id]/edit` for standard CRUD
2. Only one drawer mode at a time — `?create` · `?view` · `?edit` mutually exclusive
3. Row click / primary link → `?view={id}`; grid menu → View | Edit
4. Header **Edit** in view drawer → `?edit={id}`
5. **Activity** — `ActivityTriggerButton` in grid/drawer header, not a separate page

**Prototype examples:** [ui-prototype/manufacturing/MANUFACTURING_UI_BUILD_GUIDE.md](../04-uiux/prototype/manufacturing/MANUFACTURING_UI_BUILD_GUIDE.md) · Catalog products

---

## 5. Mobile responsive (mandatory)

সব screen **mobile-first** — desktop-only feature allowed নয়।

| Area | Requirement |
|------|-------------|
| **Layout** | Fluid grid; sidebar collapses on `< 768px` |
| **Drawer** | Mobile-এ full-width sheet (`w-full`); scroll inside drawer |
| **Tables** | Horizontal scroll **or** card/stacked row fallback |
| **Forms** | Single column on mobile; min 44×44px tap targets |
| **AG Grid** | Fixed/min height container; mobile-এ column reduce বা card view |
| **Charts** | `min-h` on container — Recharts width/height 0 error avoid |
| **Actions** | Primary action reachable without horizontal scroll |

**Detail:** [ui-ux/mobile-first.md](../04-uiux/standards/mobile-first.md) · [ui-ux/UI_UX_DESIGN_STANDARDS.md](../04-uiux/standards/UI_UX_DESIGN_STANDARDS.md)

### Screen doc requirement

প্রতিটি `Menus/*.md` ও module `UI.md`-এ mobile behavior লিখতে হবে (breakpoint, drawer, table fallback).

---
## 6. Documentation-first — plans must update MD

> **নতুন plan = architecture/development MD update বাধ্যতামূলক।** Code আগে, doc পরে — নিষিদ্ধ।

### When planning any feature

| Step | Update |
|------|--------|
| 1 | Module `Architecture.md` — boundaries, integrations, events |
| 2 | `Development.md` / UI build guide — phases, routes, components |
| 3 | `MODULE_DEPENDENCY_MAP.md` — new cross-module links |
| 4 | `Workflow.md` / `Database.md` / `API.md` — if affected |
| 5 | `CHANGELOG.md` — reason + impact |
| 6 | `ModuleManifest.md` — menus, pages, permissions |
| 7 | Status → **Ready** before implementation |

### Prototype phase

| Artifact | Path |
|----------|------|
| UI build guide | `docs/ui-prototype/{module}/*_UI_BUILD_GUIDE.md` |
| Screen docs | `docs/ui-prototype/{module}/*.md` |
| Prototype rules | [UI_PROTOTYPE_MODE.md](../04-uiux/strategy/UI_PROTOTYPE_MODE.md) |

### AI agents & developers

- [PRE_CODE_GATE.md](./PRE_CODE_GATE.md) pass না করলে code শুরু নয়
- Architecture drift হলে **STOP** — [GOVERNANCE.md](GOVERNANCE.md) § Architecture Synchronization

---

## 7. Integration pattern (module hookup)

Optional module integration (যেমন Manufacturing → Inventory + Accounting):

| Step | Pattern |
|------|---------|
| 1 | **Integration service** — `lib/services/{a}-{b}-integration.ts` |
| 2 | **Event name** — `inventory.stock_in.posted`, `accounting.journal.posted` |
| 3 | **Owning store** — inventory/accounting store update; caller module store শুধু orchestrate |
| 4 | **Subscriber optional** | Target module off → integration no-op + no throw |
| 5 | **UI** | Activity/integration tab in source record drawer |
| 6 | **Doc** | Architecture § integration + build guide phase |

**Prototype example:** Manufacturing P7 — `manufacturing-integration.ts` → `inventory-store` + `accounting-journal-store`

---

## 8. Code quality (prototype & production)

| Rule | Note |
|------|------|
| **Zustand selectors** | Selector-এ `.slice()` / `.filter()` নয় — নতুন reference → infinite loop |
| **Minimize scope** | শুধু requested change; unrelated refactor নয় |
| **Match conventions** | আশেপাশের code-এর naming, patterns follow |
| **Typecheck** | `npx tsc --noEmit` before merge |
| **No secrets in git** | `.env`, credentials commit নয় |

---

## Quick reference card

```text
┌─────────────────────────────────────────────────────────────┐
│ AGAINERP COMMON RULES                                       │
├─────────────────────────────────────────────────────────────┤
│ Core = always on │ Business/Industry = optional per tenant  │
│ Module off → no breakage │ Services + Events + APIs only   │
│ SaaS multi-tenant │ Scale per module independently         │
│ CRUD = List + Drawer (?create / ?view / ?edit)              │
│ Mobile-first mandatory │ Tables/drawers work on phone        │
│ New plan → update Architecture + Build Guide + CHANGELOG    │
│ Docs Ready → then code                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Related documents

| Document | Topic |
|----------|-------|
| [GOVERNANCE.md](GOVERNANCE.md) | Doc workflow, registries, pre-code gate |
| [UNIVERSAL_MODULE_FRAMEWORK.md](UNIVERSAL_MODULE_FRAMEWORK.md) | Module package, communication model |
| [MASTER_MODULE_ARCHITECTURE.md](../01-architecture/MASTER_MODULE_ARCHITECTURE.md) | Layer classification, core list |
| [DEVELOPMENT_STANDARDS.md](standards/DEVELOPMENT_STANDARDS.md) | Mobile, API, DB, security standards |
| [UI_PROTOTYPE_MODE.md](../04-uiux/strategy/UI_PROTOTYPE_MODE.md) | Current prototype phase rules |
| [ui-ux/UI_UX_DESIGN_STANDARDS.md](../04-uiux/standards/UI_UX_DESIGN_STANDARDS.md) | Shell, layout, UX formula |
| [modules/business-partners/README.md](../03-business-modules/business-partners/README.md) | Business Partners module plan (vendor · retail · wholesale) |

---

**Platform:** AgainERP  
**Last Updated:** 2026-06-17  
**Status:** Active
