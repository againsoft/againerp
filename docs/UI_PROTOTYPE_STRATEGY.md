# AgainERP — UI Prototype Development Strategy

> **Status:** Active  
> **Version:** 2.0  
> **Canonical:** [UI_PROTOTYPE_MODE.md](./UI_PROTOTYPE_MODE.md) — **read this first**  
> **Governance:** [GOVERNANCE.md](./GOVERNANCE.md)  
> **UI Standards:** [ui-ux/ENTERPRISE_UI_ARCHITECTURE.md](./ui-ux/ENTERPRISE_UI_ARCHITECTURE.md) · [ui-ux/UX_SMART_INTERACTION_STANDARDS.md](./ui-ux/UX_SMART_INTERACTION_STANDARDS.md)

**NOT building:** backend · APIs · database · live AI.  
**ONLY building:** enterprise UI/UX prototype with realistic dummy data (Next.js).

---

## Objective

Before production code, build a **complete UI/UX prototype** using dummy data.

| Focus | Out of Scope |
|-------|----------------|
| UI layout & components | Production business logic |
| Navigation & menus | Real database |
| Workflows (visual) | Real payment processing |
| User experience | Migrations |
| Feature discovery | Controllers / services |

The prototype answers: *Does this screen work for users before we build it?*

---

## Phase 1 — UI Prototype Only

| Use | Do Not Use |
|-----|------------|
| Dummy data (JSON fixtures) | Production API |
| Mock APIs (MSW / static JSON) | PostgreSQL writes |
| Fake reports & charts | Real analytics pipeline |
| Sample products, orders, customers | Inventory reservation logic |
| Sample AI responses (canned text) | Live LLM calls |

---

## Documentation First

| Rule | Detail |
|------|--------|
| **Every page has a markdown file** | No screen without doc |
| **No page without documentation** | Doc before prototype HTML/React |
| **Doc drives prototype** | Implementation follows spec |

Prototype docs live in [`ui-prototype/`](./ui-prototype/README.md) — separate from architecture `Menus/` specs but cross-linked.

---

## Folder Structure

```
docs/
├── UI_PROTOTYPE_STRATEGY.md          ← This file
└── ui-prototype/
    ├── README.md
    ├── _PAGE_PROTOTYPE_TEMPLATE.md
    ├── DUMMY_DATA_STANDARDS.md
    ├── PRODUCTION_READINESS.md
    ├── REVIEW_CYCLE.md
    ├── MissingFeatures.md
    ├── ReviewQuestions.md
    ├── ImprovementIdeas.md
    ├── data/                         ← JSON fixtures
    ├── dashboard/
    ├── catalog/
    ├── customers/
    ├── orders/
    ├── inventory/
    ├── marketing/
    ├── media/
    ├── seo/
    ├── builder/
    ├── reports/
    ├── system/
    ├── ai-os/
    └── platform/
```

Map from Ecommerce menu: `Sales` → `orders/` · `AI` → `ai-os/`

---

## Page Documentation Rule (Tri-File)

Three markdown files per prototype page:

| File | Purpose |
|------|---------|
| `{Page}.md` | Page specification |
| `{Page}Review.md` | UX review & sign-off |
| `{Page}Changes.md` | Change history |

**Example — Catalog → Products:**

```
ui-prototype/catalog/products/
├── ProductList.md
├── ProductListReview.md
├── ProductListChanges.md
├── ProductDetails.md
├── ProductDetailsReview.md
└── ProductDetailsChanges.md
```

Regenerate review/changes stubs: `python3 docs/scripts/generate-ui-prototype-tri-files.py`

---

## Required Page Structure

Every page MD must include:

| Section | Content |
|---------|---------|
| Page Name | Title |
| Purpose | Why this page exists |
| Business Goal | Measurable outcome |
| User Roles | Who uses it |
| Menu Location | Sidebar path |
| Breadcrumb | Full trail |
| UI Layout | ASCII + zones |
| Components | Tables, forms, widgets |
| Fields | All inputs |
| Actions | Buttons, bulk, row |
| Filters | Live filter spec |
| Tables | Columns, inline edit |
| Permissions | Keys |
| Workflows | States |
| Related Pages | Links |
| AI Features | AI on this page |
| Reports | Report links |
| Future Enhancements | Backlog |
| Change History | Doc changelog |

Template: [`ui-prototype/_PAGE_PROTOTYPE_TEMPLATE.md`](./ui-prototype/_PAGE_PROTOTYPE_TEMPLATE.md)

---

## UI Prototype Rules

| Rule | Requirement |
|------|-------------|
| **Clickable** | Every link navigates somewhere |
| **Navigation works** | Sidebar, breadcrumb, back |
| **Menus work** | All menu items route to page or stub |
| **Realistic dummy data** | No "Lorem ipsum" product names only |
| **No empty screens** | Skeleton OK; never blank white |

---

## Dummy Data Standards

| Entity | Minimum Count |
|--------|---------------|
| Products | 100+ |
| Customers | 100+ |
| Orders | 500+ |
| Categories | 50+ |
| Brands | 30+ |
| Reviews | 500+ |
| Activities | 1,000+ |
| Notifications | 100+ |

**Detail:** [ui-prototype/DUMMY_DATA_STANDARDS.md](./ui-prototype/DUMMY_DATA_STANDARDS.md)

Fixtures: `ui-prototype/data/*.json`

---

## Change Management

Whenever UI changes, update **all**:

1. Page MD (`ui-prototype/...`)
2. Workflow MD (`modules/.../Workflow.md` if affected)
3. Architecture MD (module `ARCHITECTURE.md` if structural)
4. [CHANGELOG.md](./CHANGELOG.md)

**No exception.**

---

## Gap Discovery

Every module folder maintains:

| File | Purpose |
|------|---------|
| [MissingFeatures.md](./ui-prototype/MissingFeatures.md) | Features discovered missing during prototype |
| [ReviewQuestions.md](./ui-prototype/ReviewQuestions.md) | Open UX questions |
| [ImprovementIdeas.md](./ui-prototype/ImprovementIdeas.md) | Enhancement ideas |

Per-page gaps go in page MD § Future Enhancements + module MissingFeatures.md.

---

## Prototype Review Cycle

| Step | Action |
|------|--------|
| **1** | Create page doc + prototype screen |
| **2** | Review UX (stakeholder walkthrough) |
| **3** | Review workflow (states, approvals) |
| **4** | Review AI opportunities |
| **5** | Update documentation |
| **6** | Approve → mark **Ready** |

**Detail:** [ui-prototype/REVIEW_CYCLE.md](./ui-prototype/REVIEW_CYCLE.md)

---

## Production Readiness Gate

**Coding starts only after ALL approved:**

| Gate | Document |
|------|----------|
| UI Prototype | `ui-prototype/` pages **Ready** |
| Documentation | GOVERNANCE sign-off |
| Workflow | Module `Workflow.md` |
| Architecture | Module `ARCHITECTURE.md` |
| Database | `MASTER_DATABASE_ARCHITECTURE.md` |
| API | Module `API.md` |
| AI | `AI_OS_ARCHITECTURE.md` |

**Detail:** [ui-prototype/PRODUCTION_READINESS.md](./ui-prototype/PRODUCTION_READINESS.md)

---

## Relationship to Existing Docs

| Doc Set | Purpose |
|---------|---------|
| `modules/ecommerce/Menus/` | Architecture-linked screen specs (167) |
| `ui-prototype/` | **Visual prototype** specs + dummy data refs |
| `ui-ux/` | Design system standards |

Cross-link both: Menu doc ↔ Prototype doc.

---

## Regenerate Page Stubs

```bash
python3 docs/scripts/generate-ui-prototype-pages.py
```

---

**Platform:** AgainERP  
**Last Updated:** 2026-06-12
