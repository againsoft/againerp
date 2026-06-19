# AgainERP — Project Brain

> **Status:** Active — **mandatory first read**  
> **Version:** 1.0  
> **Date:** 2026-06-18  
> **Audience:** Developers · AI agents (Cursor, Claude, ChatGPT) · Architects  
> **Governance:** [GOVERNANCE.md](GOVERNANCE.md) · [PROJECT_COMMON_RULES.md](PROJECT_COMMON_RULES.md)

## Purpose
Extended project brain — file checklists, prototype patterns, AI readiness matrix.

## When To Read
Read for deep implementation patterns after the slim [BRAIN.md](../BRAIN.md) stack — not as first entry.

## Related Files
- [Cursor entry](../BRAIN.md)
- [Pre-code gate](PRE_CODE_GATE.md)
- [Full rules](PROJECT_COMMON_RULES.md)

## Read Next
- [Pick module](../MODULE_REGISTRY.md)

---

## ⚠️ Rule zero — read before any implementation

**Every developer and AI agent MUST read this file before writing code, creating routes, adding modules, or changing architecture.**

If this brain conflicts with a local shortcut or guess → **this brain wins**.  
If this brain is insufficient for a task → open only the **Deep-dive doc** listed in §12 — do not scan the whole repo.

```text
Implementation start:
  1. docs/BRAIN.md               ← Cursor entry
  2. PRE_CODE_GATE.md          ← gate checks for your change type
  3. Module doc OR build guide   ← scope for this task only
  4. Code                       ← minimal diff, match patterns below
```

---

## 1. What AgainERP is (30 seconds)

| Attribute | Value |
|-----------|-------|
| **Product** | Modular ERP + Ecommerce + AI OS SaaS platform |
| **Architecture** | Core → Business modules → Industry modules → AI OS (platform service) |
| **Tenancy** | Multi-tenant: `tenant_id` → Company → Branch → Warehouse |
| **Integration** | Services · Events · APIs — **never cross-module DB** |
| **Current phase** | **UI/UX prototype** — Next.js frontend, mock data, mock API routes |
| **App location** | `apps/web/` (Vercel root directory) |
| **Truth source** | `docs/` — documentation-first; code follows docs |

**Vision:** One platform for retail, manufacturing, hospital, school, etc. — modules install/remove without breaking others.

---

## 2. Repository map (root)

```text
againerp/
├── apps/web/                 ← Next.js app (ONLY deployable app today)
├── docs/                     ← All architecture, module, UI, governance docs
│   ├── PROJECT_BRAIN.md      ← THIS FILE — start here
│   ├── PROJECT_COMMON_RULES.md
│   ├── PRE_CODE_GATE.md
│   ├── TECHNOLOGY_CONSTITUTION.md
│   ├── ai_os/                ← AI OS vision & UX (admin, storefront)
│   ├── modules/{module}/     ← Per-module Architecture, Database, API, …
│   ├── ui-prototype/{module}/← UI build guides & screen specs
│   ├── ui-ux/                ← Global UI standards
│   ├── database/             ← Schema standards & master architecture
│   └── _registries/          ← JSON registries (modules, pages, …)
├── .cursor/rules/            ← Cursor auto-rules (summary of common rules)
└── README.md                 ← Quick start + links
```

**Not in repo yet (future):** `apps/api/` (FastAPI), shared packages, infra/terraform.

---

## 3. App map — `apps/web/src/`

### 3.1 Route groups (`app/`)

| Path | Purpose |
|------|---------|
| `app/(admin)/` | ERP admin — sidebar shell, all business modules |
| `app/(storefront)/` | Customer shop `/shop`-style routes |
| `app/ess/` | Employee self-service mobile portal |
| `app/(print)/` | Print layouts (invoices, etc.) |
| `app/api/v1/{module}/` | Mock REST API (prototype phase) |

### 3.2 Admin modules (implemented prototypes)

| Route prefix | Components folder | Mock data prefix | Store prefix |
|--------------|-------------------|------------------|--------------|
| `/catalog/*` | `components/products`, `categories`, … | `lib/mock-data/*` | `lib/store/product-store.ts`, … |
| `/hr/*` | `components/hr/` | `lib/mock-data/hr-*` | `lib/store/hr-*` |
| `/manufacturing/*` | `components/manufacturing/` | `lib/mock-data/mfg-*` | `lib/store/mfg-*` |
| `/sales-marketing/*` | `components/sales-marketing/` | `lib/mock-data/smw-*` | `lib/store/smw-*` |
| `/partners/*` | `components/partners/` | `lib/mock-data/partners-*` | — |
| `/purchase/*`, `/suppliers/*` | `components/purchase/`, `suppliers/` | various | `lib/store/purchase-*` |
| `/ai-os/*` | `components/ai-os/` | `lib/mock-data/ai-os.ts` | — |
| `/payroll/*` | `components/payroll/` | `lib/mock-data/hr-payroll-*` | — |

**Pattern:** Each new admin module gets `(admin)/{module}/`, `components/{module}/`, `lib/mock-data/{prefix}-*`, optional `lib/store/{prefix}-*-store.ts`, optional `app/api/v1/{module}/`.

### 3.3 Shared code locations

| Folder | Use |
|--------|-----|
| `components/ui/` | Shadcn primitives — do not fork |
| `components/layout/` | Admin shell, sidebar, top nav |
| `components/shared/` | Cross-module reusables (kanban, document-builder) |
| `components/data-grid/` | AG Grid wrappers |
| `components/enterprise/` | Dashboard widgets, KPI cards |
| `lib/navigation.ts` | Global sidebar nav items |
| `lib/navigation/breadcrumbs.ts` | Breadcrumb resolver |
| `lib/store/app-store.ts` | Global UI state (sidebar, theme, recent pages) |
| `lib/charts/recharts-tooltip.ts` | Recharts formatter helpers |
| `design-system/css/tokens.css` | Design tokens |

### 3.4 Import alias

```typescript
import { X } from "@/components/...";
import { Y } from "@/lib/...";
```

---

## 4. Standard module UI pattern (copy this)

Reference implementation: **Sales & Marketing** (`sales-marketing/`) and **Catalog products** (`/catalog/products`).

### 4.1 File checklist — new admin module `{module}`

```text
docs/modules/{module}/Architecture.md          (required before code)
docs/modules/{module}/ModuleManifest.md
docs/ui-prototype/{module}/*_UI_BUILD_GUIDE.md (prototype)
docs/CHANGELOG.md entry

apps/web/src/app/(admin)/{module}/layout.tsx     → ModuleLayout wrapper
apps/web/src/app/(admin)/{module}/page.tsx       → redirect or dashboard
apps/web/src/app/(admin)/{module}/{entity}/page.tsx

apps/web/src/components/{module}/
  ├── {module}-module-layout.tsx    ← sidebar + mobile nav sheet
  ├── {module}-sidebar.tsx
  ├── {module}-page-shell.tsx       ← optional page chrome
  ├── {entity}/
  │   ├── {entity}-workspace.tsx    ← list + drawer orchestration
  │   ├── {entity}-table.tsx
  │   ├── {entity}-form-sheet.tsx   ← ?create=1 / ?edit={id}
  │   ├── {entity}-view-sheet.tsx   ← ?view={id}
  │   └── index.ts
  └── index.ts

apps/web/src/lib/mock-data/{prefix}-navigation.ts
apps/web/src/lib/mock-data/{prefix}-{entity}.ts
apps/web/src/lib/store/{prefix}-{entity}-store.ts   (optional persist)

apps/web/src/app/api/v1/{module}/{entity}/route.ts
apps/web/src/app/api/v1/{module}/{entity}/[id]/route.ts

lib/navigation.ts              → add sidebar item
lib/navigation/breadcrumbs.ts  → add segment labels + flat nav
```

### 4.2 CRUD = List + Sheet drawer (non-negotiable)

| Action | URL query | UI |
|--------|-----------|-----|
| List | `/module/entities` | Table / AG Grid |
| Create | `?create=1` | Right Sheet — form |
| View | `?view={id}` | Right Sheet — read-only |
| Edit | `?edit={id}` | Same Sheet — form |

**Forbidden:** `/entities/new`, `/entities/[id]/edit` for standard CRUD.

```tsx
<SheetContent
  side="right"
  className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
>
```

### 4.3 Module layout shell

- Desktop: fixed left module sidebar + scrollable main
- Mobile (`< md`): hamburger → left Sheet with module nav; main full width
- Module nav collapse state → `useAppStore` (see `smwModuleNavCollapsed` pattern)

### 4.4 Prototype data flow

```text
mock-data/*.ts  →  seed in zustand store  →  page reads store
                      ↓
              api/v1/*/route.ts returns same seed (for fetch demos)
```

---

## 5. Architecture rules (never break)

### 5.1 Platform layers (top → bottom)

```text
Admin UI · Storefront · Mobile · External AI
        ↓
AI OS (agents, tools, audit — platform service, NOT business module owner)
        ↓
Industry (Hospital, School, Manufacturing, …)
        ↓
Business (Catalog, Sales, CRM, Finance, HR, …)
        ↓
Core (Users, RBAC, Contacts, Workflow, Events)
        ↓
Platform (Tenant, billing, feature flags)
        ↓
PostgreSQL · Redis · Meilisearch · Object storage
```

### 5.2 Module tiers

| Tier | Examples | Rule |
|------|----------|------|
| **Core** | Users, Permissions, Contacts, Workflow | Always on — every tenant |
| **Business** | Ecommerce, Inventory, CRM, HR | Optional per plan/feature flag |
| **Industry** | Hospital, School | Optional |
| **AI OS** | Agents, tools | Optional platform layer |

### 5.3 Module independence (critical)

| ✅ Do | ❌ Never |
|-------|---------|
| Call `OtherModuleService.get(id)` | `JOIN other_module_table` |
| Publish event; subscriber optional | Hard require optional module at import time |
| Store UUID ref (`product_id`) | FK to another module's table |
| Hide menu when module off | Crash or 404 when module off |

Declare deps: `ModuleManifest.md` + `MODULE_DEPENDENCY_MAP.md`.

### 5.4 SaaS & scaling

| Principle | Implementation |
|-----------|----------------|
| Tenant isolation | `tenant_id` + `company_id` on all business rows |
| API-first | `/api/v1/{module}/` — same for web, mobile, AI |
| Stateless API | Session/cache external; horizontal scale |
| Module = namespace | Own tables (`{prefix}_*`), own routes, own docs |
| Event-driven async | Side effects after COMMIT via event bus |

---

## 6. Database contract (future backend — design now)

Every business table **must** follow [database/standards.md](../05-development/database/standards.md):

```sql
id, uuid, company_id, status,
created_at, updated_at, deleted_at,
created_by, updated_by, deleted_by
```

| Rule | Detail |
|------|--------|
| **Naming** | `{module}_{entity}` plural — e.g. `catalog_products`, `smw_leads` |
| **Prefix ownership** | One module owns prefix — see [DATABASE_REGISTRY.md](registries/DATABASE_REGISTRY.md) |
| **Soft delete** | `deleted_at IS NULL` default filter |
| **Scope** | All queries filter `company_id` |
| **Cross-module** | UUID reference only — no FK to peer module tables |
| **AI OS tables** | `ai_*` only — AI never owns business tables |

**Before adding tables:** update module `Database.md` + `DATABASE_REGISTRY.md`.

---

## 7. Technology stack (mandatory)

Official: [TECHNOLOGY_CONSTITUTION.md](./TECHNOLOGY_CONSTITUTION.md)

| Layer | Stack |
|-------|-------|
| Frontend | Next.js App Router · TypeScript strict · Tailwind · Shadcn · AG Grid · Zustand · RHF · Zod · Recharts · Lucide · Sonner · CMDK |
| Backend (future) | FastAPI · Python 3.11+ · DDD · Service layer · Events |
| Database (future) | PostgreSQL · pgvector · Redis · Meilisearch |
| AI (future) | LangGraph · tools via module APIs only |

**Prototype phase:** frontend only — mock JSON + zustand; no real DB/auth/LLM.

---

## 8. Development workflow

### 8.1 Documentation-first

```text
Plan → Update docs → Register → Status Ready → Code → CHANGELOG
```

| When | Update |
|------|--------|
| New module | `docs/modules/{m}/` full package + `MODULE_DEPENDENCY_MAP.md` |
| New UI module | `docs/ui-prototype/{m}/*_UI_BUILD_GUIDE.md` |
| Architecture change | `Architecture.md` + `CHANGELOG.md` |
| Any change | `CHANGELOG.md` |

**STOP if:** [PRE_CODE_GATE.md](./PRE_CODE_GATE.md) not passed for your change type.

### 8.2 Prototype vs production gate

| Gate step | Prototype UI | Production backend |
|-----------|--------------|-------------------|
| Technology Constitution | ✅ | ✅ |
| Architecture read | ✅ | ✅ |
| UI standards | ✅ | ✅ |
| Database docs Ready | ❌ | ✅ |
| API docs Ready | ❌ | ✅ |
| AI OS docs | ✅ if AI UI | ✅ |

Detail: [UI_PROTOTYPE_MODE.md](../04-uiux/strategy/UI_PROTOTYPE_MODE.md)

### 8.3 Git / deploy

| Item | Value |
|------|-------|
| Vercel root | `apps/web` |
| Dev | `cd apps/web && npm run dev` → http://localhost:3000 |
| Commits | Only when user asks |

---

## 9. UI & design rules

| Rule | Detail |
|------|--------|
| **Mobile-first** | `< 768px` sidebar collapse; drawer full-width; 44px tap targets |
| **Tables** | Horizontal scroll or card fallback on mobile |
| **Charts** | Container `min-h-*`; use `@/lib/charts/recharts-tooltip` |
| **Forms** | React Hook Form + Zod schema (shared with API later) |
| **Activity** | `ActivityTriggerButton` in drawer/grid — not separate page |
| **Dark mode** | Support via design tokens |
| **60/20/10/10** | Layout formula — [ENTERPRISE_UI_ARCHITECTURE.md](../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md) |

**Global UI docs:** [ui-ux/UI_UX_DESIGN_STANDARDS.md](../04-uiux/standards/UI_UX_DESIGN_STANDARDS.md) · [ui-ux/UX_SMART_INTERACTION_STANDARDS.md](../04-uiux/standards/UX_SMART_INTERACTION_STANDARDS.md)

---

## 10. Code traps (read — saves hours)

| Trap | Fix |
|------|-----|
| Zustand infinite re-render | **Never** `.slice()` / `.filter()` inside `useStore` selector — select raw array, derive outside |
| Recharts Tooltip types | Never type formatter param as `number` — use `chartTooltipBdtMillions` or `(v) => Number(v ?? 0)` |
| Recharts size 0 | Parent needs explicit `min-h` + `width/height` |
| Cross-module import | Use events/services pattern — not direct store import from optional module |
| New CRUD routes | Use query params + Sheet — not `/new` routes |
| Over-engineering | Minimal diff; match nearest module (SMW, HR, Catalog) |
| Next.js version | This project uses Next 16 — check `apps/web/AGENTS.md` for API differences |

---

## 11. API convention (prototype & future)

```text
GET    /api/v1/{module}/{entity}           → list
POST   /api/v1/{module}/{entity}           → create
GET    /api/v1/{module}/{entity}/{id}     → detail
PATCH  /api/v1/{module}/{entity}/{id}     → update
DELETE /api/v1/{module}/{entity}/{id}     → soft delete (future)

Response shape:
{ "data": T | T[], "meta": { "count"?: number } }
```

Register in [API_REGISTRY.md](registries/API_REGISTRY.md) when adding real endpoints.

---

## 12. Deep-dive index — read ONLY when needed

Do **not** read all files. Use this table:

| Task | Read |
|------|------|
| Any implementation | **PROJECT_BRAIN.md** (this file) |
| Full common rules | [PROJECT_COMMON_RULES.md](PROJECT_COMMON_RULES.md) |
| Pre-code checklist | [PRE_CODE_GATE.md](./PRE_CODE_GATE.md) |
| Stack decisions | [TECHNOLOGY_CONSTITUTION.md](./TECHNOLOGY_CONSTITUTION.md) |
| Platform map | [PROJECT_MAP.md](../PROJECT_MAP.md) |
| Module list & deps | [MODULE_REGISTRY.md](../MODULE_REGISTRY.md) · [MODULE_DEPENDENCY_MAP.md](../01-architecture/MODULE_DEPENDENCY_MAP.md) |
| Database design | [DATABASE_REGISTRY.md](registries/DATABASE_REGISTRY.md) · [database/MASTER_DATABASE_ARCHITECTURE.md](../05-development/database/MASTER_DATABASE_ARCHITECTURE.md) |
| Entity design | [ENTITY_RELATIONSHIP_REGISTRY.md](registries/ENTITY_RELATIONSHIP_REGISTRY.md) |
| UI shell | [ui-ux/ENTERPRISE_UI_ARCHITECTURE.md](../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md) |
| Prototype rules | [UI_PROTOTYPE_MODE.md](../04-uiux/strategy/UI_PROTOTYPE_MODE.md) |
| Module `{m}` work | `docs/modules/{m}/Architecture.md` + `docs/ui-prototype/{m}/*` |
| AI OS UX | [ai_os/README.md](../06-ai/experience/README.md) |
| AI OS platform | [modules/ai/AI_OS_ARCHITECTURE.md](../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) |
| AI agent map | [AI_KNOWLEDGE_INDEX.md](registries/AI_KNOWLEDGE_INDEX.md) |
| All doc navigation | [MASTER_INDEX.md](./MASTER_INDEX.md) |

---

## 13. New feature checklist (AI & dev)

Before writing code, confirm:

- [ ] Read **PROJECT_BRAIN.md**
- [ ] Identified module + layer (Core / Business / Industry)
- [ ] Checked module not breaking independence rules
- [ ] Docs exist or updated (Architecture / build guide)
- [ ] Routes follow list + drawer pattern
- [ ] Mobile behavior defined
- [ ] Mock data + store + API route (if prototype entity CRUD)
- [ ] Navigation + breadcrumbs updated
- [ ] `CHANGELOG.md` entry prepared
- [ ] No zustand/recharts traps (§10)

---

## 14. AI command readiness — file matrix

Files an AI agent needs **ready** before reliable implementation:

### 14.1 Always loaded (auto or first read)

| File | Role | Status |
|------|------|--------|
| [docs/PROJECT_BRAIN.md](./PROJECT_BRAIN.md) | **Master context — this file** | ✅ Ready |
| [.cursor/rules/project-common-rules.mdc](../.cursor/rules/project-common-rules.mdc) | Cursor auto-applied summary | ✅ Ready |
| [docs/PROJECT_COMMON_RULES.md](PROJECT_COMMON_RULES.md) | Full universal rules | ✅ Ready |
| [docs/PRE_CODE_GATE.md](./PRE_CODE_GATE.md) | Stop/go gate | ✅ Ready |
| [docs/TECHNOLOGY_CONSTITUTION.md](./TECHNOLOGY_CONSTITUTION.md) | Official stack | ✅ Ready |
| [docs/UI_PROTOTYPE_MODE.md](../04-uiux/strategy/UI_PROTOTYPE_MODE.md) | Current phase rules | ✅ Ready |

### 14.2 Architecture & scale

| File | Role | Status |
|------|------|--------|
| [docs/PROJECT_MAP.md](../PROJECT_MAP.md) | Layer diagram | ✅ Ready |
| [docs/MASTER_MODULE_ARCHITECTURE.md](../01-architecture/MASTER_MODULE_ARCHITECTURE.md) | Module blueprint | ✅ Ready |
| [docs/MODULE_DEPENDENCY_MAP.md](../01-architecture/MODULE_DEPENDENCY_MAP.md) | Cross-module deps | ✅ Ready |
| [docs/UNIVERSAL_MODULE_FRAMEWORK.md](UNIVERSAL_MODULE_FRAMEWORK.md) | Module framework | ✅ Ready |
| [docs/DATABASE_REGISTRY.md](registries/DATABASE_REGISTRY.md) | Table ownership | ✅ Ready |
| [docs/database/standards.md](../05-development/database/standards.md) | Column standards | ✅ Ready |

### 14.3 UI & design

| File | Role | Status |
|------|------|--------|
| [docs/ui-ux/ENTERPRISE_UI_ARCHITECTURE.md](../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md) | Admin shell | ✅ Ready |
| [docs/ui-ux/UI_UX_DESIGN_STANDARDS.md](../04-uiux/standards/UI_UX_DESIGN_STANDARDS.md) | Design standards | ✅ Ready |
| [docs/ui-ux/recharts-conventions.md](../04-uiux/standards/recharts-conventions.md) | Chart formatters | ✅ Ready |
| [docs/ui-ux/mobile-first.md](../04-uiux/standards/mobile-first.md) | Mobile rules | ✅ Ready |
| `docs/ui-prototype/{module}/*_UI_BUILD_GUIDE.md` | Per-module UI steps | ⚠️ Per module |

### 14.4 AI OS command center

| File | Role | Status |
|------|------|--------|
| [docs/ai_os/README.md](../06-ai/experience/README.md) | AI UX entry | ✅ Ready |
| [docs/ai_os/01_AI_COMMERCE_OS_VISION.md](../06-ai/experience/01_AI_COMMERCE_OS_VISION.md) | Vision | ✅ Ready |
| [docs/ai_os/02_AI_USER_EXPERIENCE.md](../06-ai/experience/02_AI_USER_EXPERIENCE.md) | UX patterns | ✅ Ready |
| [docs/ai_os/03_AI_ADMIN_EXPERIENCE.md](../06-ai/experience/03_AI_ADMIN_EXPERIENCE.md) | Admin AI UX | ✅ Ready |
| [docs/ai_os/04_AI_STOREFRONT_EXPERIENCE.md](../06-ai/experience/04_AI_STOREFRONT_EXPERIENCE.md) | Storefront AI UX | ✅ Ready |
| [docs/modules/ai/AI_OS_ARCHITECTURE.md](../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) | Platform AI OS | ✅ Ready |
| [docs/AI_KNOWLEDGE_INDEX.md](registries/AI_KNOWLEDGE_INDEX.md) | AI agent map | ✅ Ready |

### 14.5 Per-module (create before implementing that module)

| File | Required |
|------|----------|
| `docs/modules/{module}/Architecture.md` | ✅ |
| `docs/modules/{module}/ModuleManifest.md` | ✅ |
| `docs/modules/{module}/Database.md` | Before backend |
| `docs/modules/{module}/API.md` | Before backend |
| `docs/ui-prototype/{module}/*_UI_BUILD_GUIDE.md` | Before UI prototype |
| Reference code in `apps/web/src/components/{module}/` | Copy pattern from SMW/HR/Catalog |

---

## 15. Active prototype modules (quick reference)

| Module | Docs | UI code | Mock API |
|--------|------|---------|----------|
| Ecommerce / Catalog | `docs/modules/ecommerce/` | `(admin)/catalog/` | partial |
| HR & Payroll | `docs/modules/hr-payroll/` | `(admin)/hr/`, `payroll/` | partial |
| Manufacturing | `docs/modules/manufacturing/` | `(admin)/manufacturing/` | partial |
| Sales & Marketing | `docs/modules/sales-marketing/` | `(admin)/sales-marketing/` | ✅ `api/v1/sales-marketing/` |
| Business Partners | `docs/modules/business-partners/` | `(admin)/partners/` | partial |
| Storefront | `docs/modules/ecommerce/ECOMMERCE_STOREFRONT_*` | `(storefront)/` | — |
| AI OS admin | `docs/ai_os/` + `docs/modules/ai/` | `(admin)/ai-os/` | partial |

---

## 16. Scaling roadmap (design for this now)

| Phase | Focus | Brain rule |
|-------|-------|------------|
| **Now** | UI prototype, mock APIs | Drawer CRUD, module layout, mock-data stores |
| **Next** | FastAPI services per module | Service layer owns tables; API matches prototype routes |
| **Then** | Real auth, RBAC, tenant scope | Core permissions; `company_id` everywhere |
| **Then** | Events, workflow, approvals | No sync cross-module calls for side effects |
| **Then** | AI OS tools | Tools call services — never ORM on business tables |
| **Scale** | Queue, cache, read replicas | Stateless API; module teams independent |

---

## 17. Related documents

| Document | Relationship |
|----------|--------------|
| [PROJECT_COMMON_RULES.md](PROJECT_COMMON_RULES.md) | Expanded rules (Bengali + English) |
| [GOVERNANCE.md](GOVERNANCE.md) | Doc approval workflow |
| [MASTER_INDEX.md](./MASTER_INDEX.md) | Full doc catalog |
| [CHANGELOG.md](./CHANGELOG.md) | Change history |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-18 | 1.0 | Initial Project Brain — repo map, rules, patterns, AI readiness matrix |

---

**AgainERP Project Brain** — read first, implement second, scale always.
