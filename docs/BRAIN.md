# AgainERP — AI Brain

> **Status:** Active — **Cursor entry point**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Audience:** Cursor · Claude · ChatGPT · Developers  
> **Token rule:** Stop at the **lowest level** that answers your task — see [§ AI Reading Policy](#ai-reading-policy) below.

---

## Purpose
Cursor single entry — project identity, stack, rules, and pointers.

## When To Read
Read first on any AgainERP task before opening module-specific docs.

## Related Files
- [Documentation navigation](PROJECT_MAP.md)
- [Module index](MODULE_REGISTRY.md)
- [Pre-code gate](00-foundation/PRE_CODE_GATE.md)

## Read Next

- [AI Reading Policy](#ai-reading-policy) — how many files to open
- [Find where docs live](PROJECT_MAP.md) · [Pick your module](MODULE_REGISTRY.md)

---

## AI Reading Policy

**Goal:** Minimum files per task. Never bulk-read folders (`Menus/`, `04-uiux/prototype/`, `00-foundation/registries/_registries/`).

```text
Level 1 ─ BRAIN.md
Level 2 ─ PROJECT_MAP.md · ARCHITECTURE_DECISIONS.md · MODULE_REGISTRY.md   ← pick ONE
Level 3 ─ 03-business-modules/{module}/README.md
Level 4 ─ Architecture.md
Level 5 ─ Database.md · API.md · Workflow.md · UI.md · AI.md · Reports.md   ← pick ONE by task
         └── Deep dives · Menus/{screen}.md · prototype guide · code       ← only if Level 5 insufficient
```

### Forbidden (unless explicitly requested)

| File | Why |
|------|-----|
| `MASTER_INDEX.md` | Legacy full catalog — high token cost |
| `MASTER_DOCUMENT_MAP.md` | Folder migration map — not task-scoped |
| `API_REGISTRY.md` | Platform-wide API catalog |
| `DATABASE_REGISTRY.md` | Platform-wide schema catalog |
| `SERVICE_REGISTRY.md` | Platform-wide service catalog |

Also avoid bulk-read: `_registries/*_FULL.md` · entire `Menus/` trees · bulk `04-uiux/prototype/`

---

## Reading Hierarchy (Token-Efficient)

*Alias for [AI Reading Policy](#ai-reading-policy) — detailed levels below.*

### Level 1 — Project Brain

| File | Open when |
|------|-----------|
| [BRAIN.md](./BRAIN.md) | **Every task** — identity, stack, rules, this hierarchy |

Stop here if the question is only “what is AgainERP?” or “what are the global rules?”

### Level 2 — Platform indexes (pick one)

| File | Open when | Skip if |
|------|-----------|---------|
| [PROJECT_MAP.md](./PROJECT_MAP.md) | You need **where a doc lives** | You already know the exact file path |
| [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) | You need **why** (isolation, API, tenancy, AI, UI rules) | Implementing one module feature with known patterns |
| [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | You need **which module** or route/API prefix | Module already identified |

**Do not read all three** unless onboarding to the whole platform. Typical: Level 1 → one Level 2 file → Level 3.

### Level 3 — Module entry (one module)

| File | Open when |
|------|-----------|
| `03-business-modules/{module}/README.md` | Any work **inside a module** — CRM, Sales, Ecommerce, HR, … |

The module README **Documentation Map** tells you which Level 4/5 file to open next. **Never** list-scan the module folder.

Ecommerce sub-areas: `ecommerce/seo/README.md`, `ecommerce/builder/README.md`, etc. — only when the task is that sub-area.

### Level 4 — Module architecture (one file)

| File | Open when |
|------|-----------|
| `03-business-modules/{module}/Architecture.md` | Any module work beyond README — boundaries, integration, domain model |

Stop here if Architecture answers the task. Do **not** skip to Level 5 unless you need task-type detail.

Sub-area deep dives (`ECOMMERCE_STOREFRONT_ARCHITECTURE.md`, `URL_SLUG_ARCHITECTURE.md`, `{sub-area}/ARCHITECTURE.md`) — only when Architecture.md points you there.

### Level 5 — Task-type slice (one file)

Open **only the file that matches your task**:

| Task type | File | Not |
|-----------|------|-----|
| REST routes / handlers | `API.md` | API_REGISTRY.md |
| Schema / tables / migrations | `Database.md` | DATABASE_REGISTRY.md |
| Domain events / workflows | `Workflow.md` | MODULE_DEPENDENCY_MAP (unless cross-module) |
| Admin screens / navigation | `UI.md` + one `Menus/{screen}.md` OR one `04-uiux/prototype/{module}/` guide | All Menus |
| AI tools / agents in module | `AI.md` | Bulk Menus/AI |
| Reports / analytics in module | `Reports.md` | Bulk Menus/Reports |

Also Level 5 when needed: `Permissions.md` · `ModuleManifest.md` · `INTEGRATION.md`

### Beyond Level 5 — Deep dives (last resort)

| File | Open when |
|------|-----------|
| `*ARCHITECTURE*.md` deep dives | Linked from Level 4 — feature design not in canonical Architecture.md |
| [01-architecture/PROJECT_MAP.md](./01-architecture/PROJECT_MAP.md) | Full platform visual map (800+ lines — avoid unless architecting) |
| [02-core-platform/ARCHITECTURE.md](./02-core-platform/ARCHITECTURE.md) | Core-only work |
| [06-ai/platform/ai/AI_OS_ARCHITECTURE.md](./06-ai/platform/ai/AI_OS_ARCHITECTURE.md) | AI platform only |
| `apps/web/` | Implementation — after [PRE_CODE_GATE](./00-foundation/PRE_CODE_GATE.md) |

### Task → max files (examples)

| Request | Read (in order) | Max files |
|---------|-----------------|-----------|
| “Add CRM lead field” | L1 → L3 `crm/README` → L4 `Architecture.md` → L5 `Database.md` | **4** |
| “Why no cross-module JOIN?” | L1 → L2 `ARCHITECTURE_DECISIONS` §2 | **2** |
| “Where is SEO doc?” | L1 → L2 `PROJECT_MAP` or L3 `ecommerce/seo/README` | **2–3** |
| “New Sales API endpoint” | L1 → L3 `sales/README` → L4 `Architecture.md` → L5 `API.md` | **4** |
| “Ecommerce AI screen” | L1 → L3 `ecommerce/README` → L4 `Architecture.md` → L5 `AI.md` + one Menu | **4–5** |
| “Platform tenancy rules” | L1 → L2 `ARCHITECTURE_DECISIONS` §7 → `07-saas/TENANT_ARCHITECTURE` | **3** |
| Onboarding new dev | L1 → all L2 → stop; module work starts L3 | **4** then task-scoped |

**Before code:** [00-foundation/PRE_CODE_GATE.md](./00-foundation/PRE_CODE_GATE.md) (gate checklist — not a level, read once per change).

---

## Read Order (Legacy Summary)

```text
1. docs/BRAIN.md
2. ONE of: PROJECT_MAP · ARCHITECTURE_DECISIONS · MODULE_REGISTRY
3. docs/03-business-modules/{module}/README.md
4. Architecture.md
5. ONE of: Database.md · API.md · Workflow.md · UI.md · AI.md · Reports.md (+ one screen if UI)
6. Deep dives · Menus · code — only if Levels 1–5 insufficient
```

---

## 1. Project Identity

| Attribute | Value |
|-----------|-------|
| **Product** | Modular ERP + Ecommerce + AI OS SaaS |
| **Pattern** | Documentation-first · API-first · AI-first |
| **Tenancy** | `tenant_id` → Company → Branch → Warehouse |
| **Integration** | Services · Events · APIs — **never cross-module DB** |
| **Phase** | UI/UX prototype — Next.js, mock data, mock API routes |
| **App (now)** | `apps/web/` — only deployable app |
| **App (planned)** | `apps/api/` (FastAPI) · PostgreSQL · Redis · Meilisearch |
| **Truth source** | `docs/` — code follows docs |

**Vision:** One platform for retail, manufacturing, hospital, school, etc. — modules install/remove without breaking others.

---

## 2. Technology Stack

| Layer | Current (prototype) | Target (production) |
|-------|---------------------|---------------------|
| **Frontend** | Next.js 14+ App Router · React · TypeScript | Same |
| **UI** | Shadcn/ui · Tailwind · AG Grid · Recharts | Same |
| **State** | Zustand (mock stores) | Zustand + server state |
| **API** | `apps/web/src/app/api/v1/` mock routes | FastAPI `/api/v1/{module}/` |
| **Database** | Mock data in `lib/mock-data/` | PostgreSQL per-module schemas |
| **Search** | Client-side filter | Meilisearch |
| **Cache / Queue** | — | Redis |
| **AI** | Mock AI OS UI | AI OS platform service (tools → APIs) |
| **Deploy** | Vercel (`apps/web`) | Multi-tenant SaaS |

**Import alias:** `@/components/...` · `@/lib/...`

---

## 3. Architecture Principles

### 3.1 Layer stack (top → bottom)

```text
Admin UI · Storefront · Mobile · External AI
        ↓
AI OS (agents, tools, audit — platform service)
        ↓
Industry (Hospital, School, …) — planned
        ↓
Business (Ecommerce, CRM, Sales, HR, …) — optional per plan
        ↓
Core (Users, RBAC, Contacts, Workflow, Events) — always on
        ↓
Platform (Tenant, billing, feature flags)
        ↓
PostgreSQL · Redis · Meilisearch · Object storage
```

### 3.2 Module tiers

| Tier | Examples | Rule |
|------|----------|------|
| **Core** | Users, Permissions, Contacts, Workflow | Always on — every tenant |
| **Platform** | Tenant, Subscription | SaaS infrastructure |
| **Business** | Ecommerce, Inventory, CRM, HR | Optional per plan/feature flag |
| **Industry** | Hospital, School | Optional — planned |
| **AI OS** | Agents, tools | Platform layer — not business module owner |

### 3.3 Module independence (critical)

| ✅ Do | ❌ Never |
|-------|---------|
| `OtherModuleService.get(id)` | `JOIN other_module_table` |
| Publish event; subscriber optional | Hard-require optional module at import |
| Store UUID ref (`product_id`) | FK to another module's table |
| Hide menu when module off | Crash or 404 when module off |

Declare deps: `ModuleManifest.md` + [01-architecture/MODULE_DEPENDENCY_MAP.md](./01-architecture/MODULE_DEPENDENCY_MAP.md).

### 3.4 SaaS & scale

- Multi-tenant: every row scoped by `tenant_id` (+ `company_id` where applicable)
- API-first: `/api/v1/{module}/` — modules independently developable
- New module → full docs under `docs/03-business-modules/{module}/` **before** code
- Module off must not break others

---

## 4. Core Rules

### 4.1 Documentation-first

| Action | Required doc update |
|--------|---------------------|
| New module | Architecture, ModuleManifest, Database, API, Menus |
| New feature | Module Architecture + CHANGELOG |
| Cross-module integration | MODULE_DEPENDENCY_MAP + both modules |
| UI screen | Build guide in `04-uiux/prototype/` |

**Gate:** [00-foundation/PRE_CODE_GATE.md](./00-foundation/PRE_CODE_GATE.md) · **Governance:** [GOVERNANCE_FRAMEWORK.md](./GOVERNANCE_FRAMEWORK.md)

### 4.2 UI pattern (non-negotiable)

**CRUD = List page + right Sheet drawer** — reference: `/catalog/products`

| Action | URL | UI |
|--------|-----|-----|
| List | `/module/entities` | Table / AG Grid |
| Create | `?create=1` | Right Sheet — form |
| View | `?view={id}` | Right Sheet — read-only |
| Edit | `?edit={id}` | Same Sheet — form |

**Forbidden:** `/entities/new`, `/entities/[id]/edit` for standard CRUD.

**Mobile-first:** full-width drawer on small screens · table scroll/card fallback · 44px tap targets.

### 4.3 Code conventions

- **Zustand:** never `.slice()` / `.filter()` inside selectors (infinite re-render)
- **Recharts:** use `@/lib/charts/recharts-tooltip` — never type Tooltip `formatter` as `number`
- **Minimal diffs** — match surrounding patterns; reuse existing components

### 4.4 Standard module doc package

```text
03-business-modules/{module}/
├── README.md · ModuleManifest.md · Architecture.md · Database.md · API.md
├── Workflow.md · Permissions.md · UI.md · AI.md · Reports.md · CHANGELOG.md
└── Menus/                    ← one .md per admin screen
```

**Generate from templates:** [MODULE_GENERATOR_GUIDE.md](./MODULE_GENERATOR_GUIDE.md) · [NEW_MODULE_CHECKLIST.md](./NEW_MODULE_CHECKLIST.md)  
**10-section Architecture:** [STANDARD_MODULE_TEMPLATE.md](./STANDARD_MODULE_TEMPLATE.md)

---

## 5. Repository Map

```text
againerp/
├── docs/
│   ├── BRAIN.md                 ← Cursor entry (this file)
│   ├── PROJECT_MAP.md           ← Doc navigation hub
│   ├── MODULE_REGISTRY.md       ← All modules index
│   ├── FINAL_ERP_STRUCTURE_MAP.md
│   ├── 00-foundation/           Governance, registries, PROJECT_BRAIN (deep)
│   ├── 01-architecture/         Platform maps, ADRs, dependencies
│   ├── 02-core-platform/          Core engines, entities, subsystems
│   ├── 03-business-modules/       29 business modules
│   ├── 04-uiux/                   UI standards, prototypes, design system
│   ├── 05-development/            API, DB, deployment, QA, scripts
│   ├── 06-ai/                     AI OS platform + experience
│   ├── 07-saas/                   Tenant, billing, hybrid deployment
│   ├── 08-builder/                Page/theme/form builder specs
│   ├── 09-integrations/           Plugins, workflows
│   └── 10-roadmap/                Development sequence
├── apps/web/                      ← Next.js prototype (ONLY app today)
└── .cursor/rules/                 ← Auto-applied Cursor rules
```

---

## 6. App Map — `apps/web/src/`

### 6.1 Route groups

| Path | Purpose |
|------|---------|
| `app/(admin)/` | ERP admin — **workspace shell** ([WORKSPACE_SHELL_ARCHITECTURE.md](./04-uiux/standards/WORKSPACE_SHELL_ARCHITECTURE.md)), all business modules |
| `app/(storefront)/` | Customer shop |
| `app/ess/` | Employee self-service portal |
| `app/(print)/` | Print layouts |
| `app/api/v1/{module}/` | Mock REST (prototype) |

### 6.2 Prototype modules (implemented)

| Route | Components | Mock data |
|-------|------------|-----------|
| `/catalog/*` | `components/products`, … | `lib/mock-data/*` |
| `/hr/*`, `/payroll/*` | `components/hr/`, `payroll/` | `hr-*`, `hr-payroll-*` |
| `/manufacturing/*` | `components/manufacturing/` | `mfg-*` |
| `/sales-marketing/*` | `components/sales-marketing/` | `smw-*` |
| `/partners/*` | `components/partners/` | `partners-*` |
| `/purchase/*`, `/suppliers/*` | `components/purchase/` | various |
| `/ai-os/*` | `components/ai-os/` | `ai-os.ts` |

**New module pattern:** `(admin)/{module}/` + `components/{module}/` + `lib/mock-data/{prefix}-*` + optional `lib/store/`

### 6.3 Shared locations

| Folder | Use |
|--------|-----|
| `components/ui/` | Shadcn — do not fork |
| `components/layout/` | Workspace shell — header, sidebar, context panel |
| `lib/navigation.ts` | Shell navigation registry |
| `lib/store/app-store.ts` | Global UI state |
| `design-system/css/tokens.css` | Design tokens |

---

## 7. Documentation Navigation

| Need | Document |
|------|----------|
| **AI reading policy** | [§ AI Reading Policy](./BRAIN.md#ai-reading-policy) (this file) |
| **Why (core decisions)** | [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) — Level 2 |
| **Where docs live** | [PROJECT_MAP.md](./PROJECT_MAP.md) — Level 2 |
| **All modules** | [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) — Level 2 → `{module}/README.md` |
| **Navigation standard** | [00-foundation/standards/DOCUMENT_NAVIGATION_STANDARD.md](./00-foundation/standards/DOCUMENT_NAVIGATION_STANDARD.md) |
| **Folder hierarchy** | [MASTER_DOCUMENT_MAP.md](./MASTER_DOCUMENT_MAP.md) |
| **Structure SSOT** | [FINAL_ERP_STRUCTURE_MAP.md](./FINAL_ERP_STRUCTURE_MAP.md) |
| **Architecture index** | [MASTER_ARCHITECTURE_INDEX.md](./MASTER_ARCHITECTURE_INDEX.md) |
| **Visual platform map** | [01-architecture/PROJECT_MAP.md](./01-architecture/PROJECT_MAP.md) — Level 5 only |
| **Module dependencies** | [01-architecture/MODULE_DEPENDENCY_MAP.md](./01-architecture/MODULE_DEPENDENCY_MAP.md) |
| **Core platform** | [02-core-platform/ARCHITECTURE.md](./02-core-platform/ARCHITECTURE.md) |
| **UI standards** | [04-uiux/standards/](./04-uiux/standards/) |
| **Design system SSOT** | [DESIGN_SYSTEM_FOUNDATION.md](./04-uiux/standards/DESIGN_SYSTEM_FOUNDATION.md) · [FINAL_UI_ARCHITECTURE_LOCK.md](./FINAL_UI_ARCHITECTURE_LOCK.md) · [UI_READINESS_REPORT.md](./UI_READINESS_REPORT.md) — APPROVED |
| **Navigation SSOT** | [NAVIGATION_ARCHITECTURE.md](./04-uiux/standards/NAVIGATION_ARCHITECTURE.md) · [GLOBAL_MENU_STRUCTURE.md](./04-uiux/standards/GLOBAL_MENU_STRUCTURE.md) |
| **Dashboard framework** | [DASHBOARD_FRAMEWORK_ARCHITECTURE.md](./04-uiux/standards/DASHBOARD_FRAMEWORK_ARCHITECTURE.md) · [DASHBOARD_ARCHITECTURE_LOCK.md](./DASHBOARD_ARCHITECTURE_LOCK.md) |
| **Workspace shell** | [WORKSPACE_SHELL_ARCHITECTURE.md](./04-uiux/standards/WORKSPACE_SHELL_ARCHITECTURE.md) |
| **PRD / product** | [00-foundation/PRD.md](./00-foundation/PRD.md) |

---

## 8. Module Navigation (Quick)

**Full registry:** [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) · **Entry rule:** open `{module}/README.md` first — never scan the module folder

| Layer | Modules |
|-------|---------|
| **Core** | Platform engines — [02-core-platform/](./02-core-platform/) |
| **Commerce (Active)** | `ecommerce` — [03-business-modules/ecommerce/README.md](./03-business-modules/ecommerce/README.md) |
| **ERP (Draft)** | crm, sales, purchase, inventory, finance, accounting, manufacturing, pos, hr, payroll, project, marketing, … |
| **AI** | AI OS — [06-ai/platform/ai/](./06-ai/platform/ai/) |
| **Industry (Planned)** | hospital, school, restaurant, hotel, … — [00-foundation/framework/INDUSTRY_MODULES.md](05-development/framework/INDUSTRY_MODULES.md) |

---

## 9. Implementation Workflow

```text
Task received
  → Level 1: BRAIN.md (if rules/context unknown)
  → Level 2: ONE index (MAP · DECISIONS · REGISTRY)
  → Level 3: {module}/README.md
  → Level 4: ONE task file (API · Database · Workflow · UI)
  → Level 5: Architecture.md only if still blocked
  → PRE_CODE_GATE → code in apps/web/
```

| Change type | Stop at level |
|-------------|---------------|
| Locate a document | L2 `PROJECT_MAP` |
| Architecture / “why” question | L2 `ARCHITECTURE_DECISIONS` |
| Pick module | L2 `MODULE_REGISTRY` → L3 |
| New admin screen | L3 → L4 `UI.md` + **one** Menu or prototype guide |
| API endpoint | L3 → L4 `API.md` |
| Schema change | L3 → L4 `Database.md` |
| Cross-module integration | L2 `ARCHITECTURE_DECISIONS` §2 + L4 `Workflow.md` + dependency map |
| AI feature | L3 → L4 `AI.md` → `06-ai/platform/ai/` if platform |

---

## 10. Scaling Roadmap

| Phase | Focus | Rule |
|-------|-------|------|
| **Now** | UI prototype, mock APIs | Drawer CRUD, module layout, mock stores |
| **Next** | FastAPI per module | Service owns tables; API matches prototype routes |
| **Then** | Auth, RBAC, tenant scope | Core permissions; `company_id` everywhere |
| **Then** | Events, workflow, approvals | Async side effects — no sync cross-module |
| **Then** | AI OS tools | Tools call services — never ORM on business tables |

---

## Related Files

| File | Role |
|------|------|
| [PROJECT_MAP.md](./PROJECT_MAP.md) | Level 2 — doc locations |
| [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) | Level 2 — core decisions |
| [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | Level 2 — module index |
| [00-foundation/standards/DOCUMENT_NAVIGATION_STANDARD.md](./00-foundation/standards/DOCUMENT_NAVIGATION_STANDARD.md) | Nav block spec |
| [00-foundation/PROJECT_BRAIN.md](./00-foundation/PROJECT_BRAIN.md) | Deep dive — file checklists |

## Read Next

Level 2: [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) if you need **why** · [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) if you know **what module**

---

**Maintainer:** Platform Architecture · **Last Updated:** 2026-06-19
