# AgainERP — Standard Module Template

> **Status:** Approved  
> **Version:** 1.0  
> **Date:** 2026-06-19  
> **Step:** 04 — Standardize Module Documentation Format  
> **Purpose:** Single canonical structure for every business module architecture document  
> **Governance:** [GOVERNANCE.md](./00-foundation/GOVERNANCE.md) · [MODULE_STRUCTURE.md](./00-foundation/MODULE_STRUCTURE.md)  
> **Related:** [Module generator](./MODULE_GENERATOR_GUIDE.md) · [Templates](./00-foundation/templates/) · [MODULE_ISOLATION_REPORT.md](./architecture/MODULE_ISOLATION_REPORT.md)

---

## Purpose
Canonical 10-section structure for every business module Architecture.md.

## When To Read
Read when creating or standardizing a module documentation package.

## Related Files
- [Module structure rules](00-foundation/MODULE_STRUCTURE.md)
- [Module folders](03-business-modules/)

## Read Next
- [Before code](00-foundation/PRE_CODE_GATE.md)

---

## 1. How to Use This Template

| Rule | Detail |
|------|--------|
| **One structure** | Every module uses the **same 10 sections** in the **same order** |
| **Templates only** | New modules: [MODULE_GENERATOR_GUIDE.md](./MODULE_GENERATOR_GUIDE.md) — copy from `00-foundation/templates/_MODULE_*_TEMPLATE.md` |
| **Do not rewrite** | Existing content stays — add section headings and move blocks under them |
| **Canonical file** | Primary doc: `03-business-modules/{module}/Architecture.md` |
| **Deep dives** | Link to `Database.md`, `API.md`, `Workflow.md`, `Permissions.md`, `AI.md` — do not duplicate |
| **Enterprise docs** | `{MODULE}_MODULE_ARCHITECTURE.md` files merge into `Architecture.md` via section anchors (content preserved) |
| **Superseded stubs** | Retire duplicate stubs after `Architecture.md` satisfies this template |

### File Package (unchanged)

```
docs/03-business-modules/{module}/
├── ModuleManifest.md
├── Architecture.md          ← THIS TEMPLATE (10 sections)
├── Database.md              ← Detail for §4 Data Ownership
├── API.md                   ← Detail for §5 API
├── Workflow.md              ← Workflows referenced in §3 Features
├── Permissions.md           ← Detail for §7 Permissions
├── AI.md                    ← Detail for §9 AI Integration
├── Reports.md
├── CHANGELOG.md
├── UI.md                    ← Optional nav map; §8 UIUX summary here or in Architecture
└── Menus/                   ← Screen-level specs (not module architecture)
```

---

## 2. Required Sections (Order Fixed)

| # | Section | Required Content |
|---|---------|------------------|
| **1** | **Overview** | Executive summary, module identity, route namespace, table prefix, API base, status table |
| **2** | **Purpose** | Why the module exists, problem statement, mission, boundaries (in/out of scope) |
| **3** | **Features** | Capability areas, navigation map, key entities/screens, workflows at feature level |
| **4** | **Data Ownership** | Owned tables (`{module}_*`), Core entities consumed (not owned), integration IDs, anti-patterns |
| **5** | **API** | Base path `/api/v1/{module}/`, representative endpoints, service contracts provided/consumed |
| **6** | **Events** | Published events, subscribed events, payload notes, async handoff rules |
| **7** | **Permissions** | Namespace `{module}.*`, role matrix summary, record rules — link to `Permissions.md` |
| **8** | **UIUX** | Route namespace, layout pattern (list + drawer), mobile rules, link to `04-uiux/` build guides |
| **9** | **AI Integration** | Tools, agents, credit costs, approval gates — link to `AI.md` and `06-ai/platform/` |
| **10** | **Future Scope** | Planned features, industry compatibility, deprecation notes |

---

## 3. Legacy Section Mapping

When standardizing existing docs, **map content — do not rewrite**:

| Standard Section | Common Legacy Headings (move under standard H2) |
|------------------|--------------------------------------------------|
| **1. Overview** | Executive Summary · Module Vision (summary table only) · Step Requirements block |
| **2. Purpose** | Purpose · Mission · Why {Module} Exists · Scope & Boundaries |
| **3. Features** | Navigation Structure · Dashboard · {Entity} sections (Leads, Orders, …) · Module Structure · Features · In Scope |
| **4. Data Ownership** | Key Entities & Tables · Database Tables · Appendix A · Architecture Rules (ownership rows) · Core Shared Entities |
| **5. API** | API · API Endpoints · API Surface · Appendix C · Integration Patterns (sync calls) |
| **6. Events** | Domain Events · System Events · Appendix B · Integration (event rows) · Tracked Events |
| **7. Permissions** | Permissions · Security & Permissions · Approval Integration (permission triggers) |
| **8. UIUX** | UI/UX Design · Navigation · Page Layout · Route Namespace · Responsive Behavior |
| **9. AI Integration** | AI {Module} Agent · AI Integration · Registered Tools · AI-First sections |
| **10. Future Scope** | Future Enhancements · Future Compatibility · Future Integration Notes · Roadmap pointers |

**Keep as appendices (after §10):** Architecture Rules · Related Documents · Change History · numbered deep-dive sections that are feature-specific.

---

## 4. Module Compliance Snapshot (Step 04 Review)

Automated section-presence scan of primary architecture docs.  
Legend: ✓ = content detectable · · = missing or stub-only

| Module | Primary Doc | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | Score |
|--------|-------------|---|---|---|---|---|---|---|---|---|---|-------|
| CRM | `CRM_MODULE_ARCHITECTURE.md` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 10/10 |
| Sales | `SALES_MODULE_ARCHITECTURE.md` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 10/10 |
| Purchase | `PURCHASE_MODULE_ARCHITECTURE.md` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 10/10 |
| Inventory | `INVENTORY_MODULE_ARCHITECTURE.md` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 10/10 |
| Marketing | `MARKETING_MODULE_ARCHITECTURE.md` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 10/10 |
| Finance | `FINANCE_MODULE_ARCHITECTURE.md` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 10/10 |
| HR & Payroll | `HR_PAYROLL_MASTER_ARCHITECTURE.md` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 10/10* |
| Business Partners | `Architecture.md` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · | ✓ | ✓ | ✓ | 9/10 |
| Documents | `Architecture.md` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · | ✓ | ✓ | 9/10 |
| Helpdesk | `Architecture.md` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · | ✓ | ✓ | 9/10 |
| Ecommerce | `Architecture.md` + submodules | ✓ | ✓ | ✓ | ✓ | ✓ | · | ✓ | ✓ | ✓ | ✓ | 9/10 |
| Product Configurator | `Architecture.md` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · | ✓ | ✓ | 9/10 |
| Knowledge | `Architecture.md` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · | ✓ | ✓ | 9/10 |
| HR | `Architecture.md` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · | · | ✓ | 8/10 |
| Payroll | `Architecture.md` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · | · | ✓ | 8/10 |
| POS | `Architecture.md` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · | · | ✓ | 8/10 |
| Project | `Architecture.md` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · | · | ✓ | 8/10 |
| Timesheet | `Architecture.md` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · | · | ✓ | 8/10 |
| BI System | `ARCHITECTURE.md` | · | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · | ✓ | ✓ | 8/10 |
| Data Warehouse | `ARCHITECTURE.md` | ✓ | ✓ | ✓ | ✓ | ✓ | · | ✓ | · | ✓ | ✓ | 8/10 |
| Fleet | `ARCHITECTURE.md` | · | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · | ✓ | ✓ | 8/10 |
| Subscription | `ARCHITECTURE.md` | · | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · | ✓ | ✓ | 8/10 |
| Booking | `ARCHITECTURE.md` | · | ✓ | · | ✓ | ✓ | ✓ | ✓ | · | ✓ | ✓ | 7/10 |
| Logistics | `ARCHITECTURE.md` | · | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · | · | ✓ | 7/10 |
| Marketplace | `ARCHITECTURE.md` | · | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · | · | ✓ | 7/10 |
| Manufacturing | `ARCHITECTURE.md` | · | ✓ | · | ✓ | ✓ | ✓ | ✓ | · | · | ✓ | 6/10 |
| Accounting | `Architecture.md` | ✓ | · | · | ✓ | · | · | · | · | · | · | 2/10 |
| Sales & Marketing | *(no architecture doc)* | · | · | · | · | · | · | · | · | · | · | 0/10 |

\* HR & Payroll: composite master doc — split into `hr/Architecture.md` + `payroll/Architecture.md` using this template.

### Standardization Priority

| Priority | Action |
|----------|--------|
| **P0** | Merge enterprise `*_MODULE_ARCHITECTURE.md` into `Architecture.md` with 10 section H2s (CRM, Sales, Purchase, Inventory, Marketing, Finance) |
| **P1** | Add missing §8 UIUX and §9 AI Integration headings to HR, Payroll, POS, Project, Timesheet stubs |
| **P1** | Add §6 Events to Ecommerce root `Architecture.md` |
| **P2** | Expand Accounting, Manufacturing, Sales-Marketing to full template |
| **P2** | Ecommerce submodules (catalog, orders, seo, builder): add 10-section mini-template variant |

---

## 5. Standardization Procedure (No Unnecessary Rewrites)

1. Open `03-business-modules/{module}/Architecture.md` (create from §6 if missing).
2. Insert the **10 H2 section headings** in order (§6 below).
3. **Move** existing paragraphs/tables under the matching heading using §3 mapping.
4. Add `> **See also:** [Database.md](03-business-modules/ecommerce/Database.md)` links where detail lives in sibling files.
5. Leave feature-deep sections (e.g. CRM §4 Leads) as **H3 under §3 Features** — do not delete.
6. Add only **missing** stub rows: `_TBD — see Roadmap.md_`.
7. Update `ModuleManifest.md` to point to `Architecture.md#N-section-name`.
8. Log in `CHANGELOG.md` — "Docs: standardize {module} Architecture to 10-section template".

---

## 6. Copy-Paste Template — `Architecture.md`

Replace `{Module}`, `{module}`, `{route}`, `{prefix}` placeholders.

```markdown
# Architecture — {Module}

> **Status:** Draft  
> **Version:** 1.0  
> **Module:** {Module}  
> **Document Type:** Architecture  
> **Route Namespace:** `/{route}/*`  
> **Governance:** [GOVERNANCE.md](00-foundation/GOVERNANCE.md) · [STANDARD_MODULE_TEMPLATE.md](STANDARD_MODULE_TEMPLATE.md)

**No backend code until Status: Ready.**  
Source of truth for **{Module}** module boundaries, ownership, and integration.

**Package:** [ModuleManifest.md](03-business-modules/ecommerce/ModuleManifest.md) · [Database.md](03-business-modules/ecommerce/Database.md) · [API.md](03-business-modules/ecommerce/API.md) · [Workflow.md](03-business-modules/ecommerce/Workflow.md) · [Permissions.md](03-business-modules/ecommerce/Permissions.md) · [AI.md](./AI.md)

---

## 1. Overview

| Attribute | Value |
|-----------|-------|
| **Module ID** | `{module}` |
| **Display name** | {Module} |
| **Layer** | core · platform · erp · commerce · industry · ai |
| **Route namespace** | `/{route}/*` |
| **Table prefix** | `{prefix}_*` |
| **API base** | `/api/v1/{module}/` |
| **Dependencies** | Core only + services/events (see [MODULE_DEPENDENCY_MAP.md](01-architecture/MODULE_DEPENDENCY_MAP.md)) |

_One paragraph: what this module is and its role on the platform._

| Principle | Rule |
|-----------|------|
| _Example_ | _Independent module at `/{route}/*`_ |
| _Example_ | _Core contacts master — no duplicate party tables_ |

---

## 2. Purpose

### Why {Module} Exists

_Problem statement and mission._

### Scope & Boundaries

#### In Scope

- _Capability 1_
- _Capability 2_

#### Out of Scope

- _Owned by other module — link_
- _Core responsibility — link to 02-core-platform_

---

## 3. Features

### Navigation Map

_Admin menu groups and primary screens. Detail: [UI.md](03-business-modules/ecommerce/UI.md) · `Menus/`_

| Area | Route | Description |
|------|-------|-------------|
| Dashboard | `/{route}` | _—_ |
| _Area_ | `/{route}/_` | _—_ |

### Capability Summary

| Feature | Description |
|---------|-------------|
| _Feature 1_ | _—_ |

### Key Workflows

_Summary only — state machines in [Workflow.md](03-business-modules/ecommerce/Workflow.md)_

```text
_State A → State B → State C_
```

---

## 4. Data Ownership

### Owned Tables (`{prefix}_*`)

| Table | Purpose |
|-------|---------|
| `{prefix}_example` | _—_ |

**Full schema:** [Database.md](03-business-modules/ecommerce/Database.md) · [ENTITY_{MODULE}.md](./ENTITY_{MODULE}.md) (if present)

### Core Entities Consumed (Not Owned)

| Core Entity | Usage |
|-------------|------|
| [contacts](02-core-platform/entities/contacts.md) | _—_ |
| [users](02-core-platform/entities/users.md) | _—_ |

### Integration IDs

| Field | Points To | Rule |
|-------|-----------|------|
| `contact_id` | Core `contacts` | FK allowed |
| `variant_id` | Catalog (via service) | ID only — no cross-module JOIN |

### Anti-Patterns (Forbidden)

```text
❌ Duplicate Core entity tables in {prefix}_*
❌ JOIN foreign module business tables
❌ Write another module's owned tables
```

---

## 5. API

| Property | Value |
|----------|-------|
| **Base path** | `/api/v1/{module}/` |
| **Auth** | Bearer + `X-Company-Id` |
| **Permission namespace** | `{module}.*` |

### Representative Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | List |
| POST | `/` | Create |
| GET | `/{id}` | Read |
| PATCH | `/{id}` | Update |

**Full contracts:** [API.md](03-business-modules/ecommerce/API.md)

### Services

| Direction | Service | Purpose |
|-----------|---------|---------|
| **Provides** | `{Module}Service.*` | _Public API for other modules_ |
| **Consumes** | `Core` · `_OtherService_` | _Via service layer only_ |

---

## 6. Events

### Published Events

| Event | Trigger | Payload (summary) |
|-------|---------|-------------------|
| `{module}.entity.created` | _—_ | `id`, `company_id` |

### Subscribed Events

| Event | Source | Handler action |
|-------|--------|----------------|
| `core.approval.approved` | Core | _—_ |

**Rules:** Publish after COMMIT · No sync chains of 5+ services · See [EVENT_ARCHITECTURE.md](02-core-platform/engines/EVENT_ARCHITECTURE.md)

---

## 7. Permissions

| Property | Value |
|----------|-------|
| **Namespace** | `{module}.*` |
| **Matrix** | [Permissions.md](03-business-modules/ecommerce/Permissions.md) |

### Summary

| Permission | Description |
|------------|-------------|
| `{module}.access` | Module entry |
| `{module}._entity_.view` | Read |
| `{module}._entity_.manage` | Create/update/delete |

### Record Rules

_Optional: branch scope, owner-only, field ACL._

---

## 8. UIUX

| Property | Value |
|----------|-------|
| **Admin routes** | `/{route}/*` |
| **CRUD pattern** | List page + right Sheet drawer (`?create=1` · `?view={id}` · `?edit={id}`) |
| **Mobile** | Full-width drawer · 44px tap targets |

### Standards

- [module-ui-standard.md](04-uiux/standards/module-ui-standard.md)
- [layout-architecture.md](04-uiux/standards/layout-architecture.md)

### Build Guides

- Prototype: [04-uiux/prototype/{module}/](../../04-uiux/prototype/)
- Screens: `Menus/` (functional specs)

---

## 9. AI Integration

| Property | Value |
|----------|-------|
| **Feature gate** | `{module}.ai.access` |
| **Platform** | [06-ai/platform/AI_OS_ARCHITECTURE.md](06-ai/platform/ai/AI_OS_ARCHITECTURE.md) |

### Tools & Agents

| Tool ID | Risk | Approval | Description |
|---------|------|----------|-------------|
| `{module}.example` | low | no | _—_ |

**Full registry:** [AI.md](./AI.md)

### Rules

- AI calls **module services only** — never direct DB
- High-risk tools require [Approval Engine](02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md)

---

## 10. Future Scope

### Planned Enhancements

- _Feature — phase link to [10-roadmap/plans/](../../10-roadmap/plans/)_

### Industry Compatibility

_How module behaves when industry verticals install._

### Deprecations

| Item | Replacement | Target version |
|------|-------------|----------------|
| _—_ | _—_ | _—_ |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [MODULE_DEPENDENCY_MAP.md](01-architecture/MODULE_DEPENDENCY_MAP.md) | Integration matrix |
| [MODULE_ISOLATION_REPORT.md](architecture/MODULE_ISOLATION_REPORT.md) | Isolation validation |
| [Workflow.md](03-business-modules/ecommerce/Workflow.md) | State machines |
| [Reports.md](./Reports.md) | Reports & exports |

---

**Module:** {Module}  
**Last Updated:** YYYY-MM-DD  
**Maintainer:** _Team_
```

---

## 7. Submodule Variant (Ecommerce Areas)

For `03-business-modules/ecommerce/{area}/ARCHITECTURE.md` (catalog, orders, seo, builder, …), use the **same 10 sections** with adjusted scope:

| Section | Submodule focus |
|---------|-----------------|
| Overview | Area within Ecommerce; link to parent [Architecture.md](06-ai/platform/ai/Architecture.md) |
| Purpose | Area-specific mission (e.g. SEO control plane) |
| Features | Screens under `Menus/{Area}/` |
| Data Ownership | `{area}_*` or shared prefix rule documented in parent |
| API | `/api/v1/{area}/` or parent proxy |
| Events | `{area}.*` events |
| Permissions | `ecommerce.{area}.*` or dedicated namespace |
| UIUX | Link to `04-uiux/prototype/` and `08-builder/prototype/` where applicable |
| AI Integration | Area-specific AI tools |
| Future Scope | Extraction to standalone module path (if planned) |

---

## 8. Reference Implementations

Copy structure from these **10/10 compliant** docs (merge into `Architecture.md` when standardizing):

| Module | Reference File |
|--------|----------------|
| CRM | `03-business-modules/crm/CRM_MODULE_ARCHITECTURE.md` |
| Sales | `03-business-modules/sales/SALES_MODULE_ARCHITECTURE.md` |
| Purchase | `03-business-modules/purchase/PURCHASE_MODULE_ARCHITECTURE.md` |
| Inventory | `03-business-modules/inventory/INVENTORY_MODULE_ARCHITECTURE.md` |
| Marketing | `03-business-modules/marketing/MARKETING_MODULE_ARCHITECTURE.md` |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 04 — 10-section standard template and compliance snapshot |

---

**AgainERP Standard Module Template** — same ten sections, every module, zero unnecessary rewrites.
