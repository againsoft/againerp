# AgainERP — UI/UX Prototype Mode

> **Status:** **Active** — Current development phase  
> **Version:** 1.0  
> **Governance:** [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) (prototype exception below)  
> **Tech:** [TECHNOLOGY_CONSTITUTION.md](../../00-foundation/TECHNOLOGY_CONSTITUTION.md) (frontend stack only)

---

## Purpose
Documentation: UI PROTOTYPE MODE.

## When To Read
Read only if your task involves ui prototype mode.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## IMPORTANT

| We ARE building | We are NOT building |
|-----------------|---------------------|
| Enterprise-grade **UI/UX prototype** | Actual ERP backend |
| Fully navigable frontend | Backend code |
| Realistic **dummy data** | APIs |
| Every menu, page, modal, workflow (visual) | Database logic |
| Documentation per screen | AI logic (live) |
| Mock interactions | Authentication implementation |

**The prototype becomes the blueprint for the final product.**

Stakeholders must understand the **entire AgainERP experience** before backend development begins.

---

## Goal

Create a **fully navigable ERP prototype**:

- Every menu · every page · every workflow · every popup · every modal
- Every dashboard · every report — **visually represented**
- User can explore the complete system without production infrastructure

---

## Technology (Frontend Only)

| Category | Stack |
|----------|-------|
| Framework | **Next.js** (App Router, latest stable) |
| Language | **TypeScript** (strict) |
| Styling | **Tailwind CSS** |
| Components | **Shadcn UI** |
| Data grids | **AG Grid** |
| Charts | **Recharts** |
| Icons | **Lucide Icons** |
| Command palette | **CMDK** |
| Notifications | **Sonner** |
| Rich text | **TipTap** |

### Explicitly Out of Scope

- Backend integration
- Database
- Real authentication
- Real API calls
- Live AI / LLM
- **Mocked data only** (JSON fixtures + in-memory state)

**Code location (when implementation starts):** `apps/web/` — prototype routes under `/prototype/*`

---

## Design Inspiration

| Source | Weight | Adopt |
|--------|--------|-------|
| Odoo | 60% | ERP shell, record views, smart buttons, workflows |
| Shopify Admin | 20% | Commerce lists, product UX, builder |
| Notion | 10% | Content blocks, inline editing |
| Linear | 10% | Command palette, keyboard shortcuts, speed |

**Do not clone.** Use modern enterprise UX.

**Specs:** [ui-ux/ENTERPRISE_UI_ARCHITECTURE.md](../standards/ENTERPRISE_UI_ARCHITECTURE.md) · [ui-ux/UX_SMART_INTERACTION_STANDARDS.md](../standards/UX_SMART_INTERACTION_STANDARDS.md)

---

## Prototype Rules

| Rule | Requirement |
|------|-------------|
| **Clickable** | Every link, button, menu item navigates or opens UI |
| **Menus work** | Full sidebar tree — no dead ends |
| **Pages exist** | No 404 in prototype scope |
| **Modals open** | Every dialog documented and implemented |
| **Forms display** | All fields visible (validation UI only) |
| **Tables show data** | AG Grid with realistic rows |
| **Dummy data** | Plausible names, SKUs, amounts — not empty lorem |

**Universal rules:** [PROJECT_COMMON_RULES.md](../../00-foundation/PROJECT_COMMON_RULES.md) — module independence, drawer CRUD, mobile, SaaS, doc updates.

### Drawer CRUD (mandatory for entity screens)

| Action | Pattern |
|--------|---------|
| List | AG Grid on list page |
| Create / View / Edit | Right **Sheet** drawer via `?create=1` · `?view={id}` · `?edit={id}` |
| Forbidden | Separate `/new` or `/[id]/edit` routes |

Reference: `/catalog/products` · [ui-prototype/manufacturing/MANUFACTURING_UI_BUILD_GUIDE.md](../prototype/manufacturing/MANUFACTURING_UI_BUILD_GUIDE.md) §2

---

## Application Shell

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Top Header — logo · global search · quick create · notifications · AI │
├──────────┬───────────────────────────────────────────────┬─────────────┤
│          │                                               │             │
│  Left    │           Main Workspace                      │   Right     │
│ Sidebar  │   (list · record · dashboard · builder)       │  Utility    │
│          │                                               │   Panel     │
│  Module  │                                               │ (chatter /  │
│  menus   │                                               │  activity)  │
│          │                                               │             │
├──────────┴───────────────────────────────────────────────┴─────────────┤
│ Overlays: Command Palette (CMDK) · AI Assistant Panel · Drawers        │
└──────────────────────────────────────────────────────────────────────────┘
```

**Detail:** [ui-prototype/PROTOTYPE_SHELL.md](../prototype/PROTOTYPE_SHELL.md)

---

## Global Features (UI Only)

| Feature | Implementation |
|---------|----------------|
| Global Search | Header + CMDK integration |
| Command Palette | CMDK — navigation, actions, AI |
| AI Assistant | Slide-over panel — canned responses |
| Notifications | Sonner + notification center (200+ mock) |
| Activities | Activity center + record chatter |
| Dark Mode | Theme toggle — system + manual |
| Quick Create | Header menu — product, order, customer, … |
| Profile Menu | Avatar dropdown |
| Company Switcher | Mock tenants/companies |
| Branch Switcher | Mock branches |
| Favorites | Pin pages (**off in prototype**) |
| Recent Pages | Last visited |

---

## Dummy Data Requirements

| Entity | Minimum | Fixture |
|--------|---------|---------|
| Products | 100+ | `ui-prototype/data/products.json` |
| Customers | 100+ | `ui-prototype/data/customers.json` |
| Orders | 500+ | `ui-prototype/data/orders.json` |
| Activities | 1,000+ | `ui-prototype/data/activities.json` |
| Notifications | 200+ | `ui-prototype/data/notifications.json` |
| Reports | Realistic mock | Per report fixtures |

**Standards:** [ui-prototype/DUMMY_DATA_STANDARDS.md](../prototype/DUMMY_DATA_STANDARDS.md)

---

## Documentation Rules (Tri-File)

**Every prototype page requires three markdown files:**

| File | Purpose |
|------|---------|
| `{Page}.md` | Full page specification |
| `{Page}Review.md` | UX review notes, sign-off |
| `{Page}Changes.md` | Change log for this page |

**Example:**

```
ui-prototype/catalog/products/
├── ProductList.md
├── ProductListReview.md
├── ProductListChanges.md
├── ProductDetails.md
├── ProductDetailsReview.md
└── ProductDetailsChanges.md
```

**Templates:**

- [ui-prototype/_PAGE_PROTOTYPE_TEMPLATE.md](../prototype/_PAGE_PROTOTYPE_TEMPLATE.md)
- [ui-prototype/_PAGE_REVIEW_TEMPLATE.md](../prototype/_PAGE_REVIEW_TEMPLATE.md)
- [ui-prototype/_PAGE_CHANGES_TEMPLATE.md](../prototype/_PAGE_CHANGES_TEMPLATE.md)

**Regenerate stubs:**

```bash
python3 docs/scripts/generate-ui-prototype-pages.py
python3 docs/scripts/generate-ui-prototype-tri-files.py
```

---

## Development Workflow (Per Screen)

| Step | Action |
|------|--------|
| **1** | Create page documentation (`{Page}.md`) |
| **2** | Create wireframe (in page MD or linked) |
| **3** | Build high-fidelity UI (Next.js component) |
| **4** | Add dummy data (fixture + grid/chart binding) |
| **5** | Review UX — complete `{Page}Review.md` |
| **6** | Update documentation — `{Page}Changes.md` + CHANGELOG |

**No exceptions.**

**Cycle:** [ui-prototype/REVIEW_CYCLE.md](../prototype/REVIEW_CYCLE.md)

---

## Module Scope

All modules below need **complete UI** in prototype phase.  
**Index:** [ui-prototype/MODULE_SCOPE.md](../prototype/MODULE_SCOPE.md)

| Module | Folder | Screens |
|--------|--------|---------|
| Dashboard | `dashboard/` | Overview, analytics, alerts, AI insights |
| Catalog | `catalog/` | Products, categories, brands, attributes, variants, SEO, media, import/export |
| Customers | `customers/` | List, details, groups, wallet, rewards, activities, history |
| Orders | `orders/` | List, details, timeline, payments, shipments, returns, refunds |
| Inventory | `inventory/` | Warehouses, stock, movements, transfers, adjustments, suppliers |
| Marketing | `marketing/` | Coupons, campaigns, email, SMS, WhatsApp, affiliates, loyalty |
| SEO | `seo/` | Dashboard, meta, schema, redirects, sitemap, audit, keywords |
| Media | `media/` | WordPress-style library, folders, picker |
| Builder | `builder/` | Shopify-style drag-and-drop pages, themes, widgets |
| AI OS | `ai-os/` | Chief agent, chat, tasks, workflows, agents, knowledge, monitoring |
| Platform | `platform/` | Tenants, plans, billing, usage, AI credits, white label, marketplace |
| Content | `content/` | Pages, blog, FAQs |
| Reports | `reports/` | All operational reports |
| System | `system/` | Settings, users, roles |

---

## UI Requirements

| Pattern | Spec |
|---------|------|
| Popup-first | Prefer modal/drawer over full page |
| Inline editing | AG Grid + field inline |
| Live filters | Debounced, no submit button |
| Live search | Header + list |
| Drawer editing | Record edit in right drawer |
| Command palette | CMDK global |
| Keyboard shortcuts | Document per page |
| Autosave indicators | Visual only in prototype |
| Responsive | Mobile + tablet + desktop |
| Dark mode | Required |

**Product page:** Alibaba-style gallery — images + videos, variant-based gallery/pricing/stock — real-time UI, no reload.  
**Spec:** [ui-ux/product-gallery.md](../standards/product-gallery.md)

**Admin lists:** AG Grid — inline edit, bulk edit, advanced filters, saved filters, column manager, export/import UI, mass actions.  
**Spec:** [ui-ux/tables.md](../standards/tables.md) · [ui-ux/live-filters.md](../standards/live-filters.md)

**Rich editor:** TipTap — images, videos, tables, embeds, AI action buttons, reusable blocks.  
**Spec:** [ui-ux/rich-text-editor.md](../standards/rich-text-editor.md)

**Media picker:** WordPress-style reusable popup — product, category, brand, blog, page, banner, SEO.  
**Spec:** [ui-ux/media-manager-ui.md](../standards/media-manager-ui.md)

---

## Pre-Code Gate — Prototype Exception

| Standard gate | Prototype phase |
|---------------|-----------------|
| Backend `API.md` Ready | **Not required** for UI-only work |
| `Database.md` Ready | **Not required** for UI-only work |
| Live AI | **Not required** — mock only |
| **Required** | Page `.md` + Review + Changes tri-file |
| **Required** | [UI_PROTOTYPE_MODE.md](UI_PROTOTYPE_MODE.md) compliance |
| **Required** | [TECHNOLOGY_CONSTITUTION.md](../../00-foundation/TECHNOLOGY_CONSTITUTION.md) frontend stack |

Production backend code starts only after [ui-prototype/PRODUCTION_READINESS.md](../prototype/PRODUCTION_READINESS.md) gate.

---

## Relationship to Other Docs

| Document set | Role |
|--------------|------|
| `UI_PROTOTYPE_MODE.md` | **This file** — canonical prototype mode |
| `UI_PROTOTYPE_STRATEGY.md` | Strategy summary + links |
| `ui-prototype/` | Page specs, fixtures, reviews |
| `modules/ecommerce/Menus/` | Architecture-linked menus (167) |
| `ui-ux/` | Design system standards |

---

## Final Objective

A **complete UI prototype** lets stakeholders review the entire AgainERP experience — navigation, data density, workflows, AI surfaces, and platform admin — **before** backend development.

**Do not generate:** backend code · database code · APIs · live AI.

**Do generate:** documentation · Next.js UI · realistic dummy data · clickable flows.

---

**Platform:** AgainERP  
**Last Updated:** 2026-06-12  
**Maintainer:** UI/UX + Platform Team
