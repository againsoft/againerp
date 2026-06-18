# AgainERP — Changelog

All notable changes to AgainERP documentation and platform architecture are recorded here.

Format follows [GOVERNANCE.md](./GOVERNANCE.md#changelog-system).

---

## [Unreleased]

### Added — 2026-06-18 — Project Brain (mandatory implementation context)

| Field | Value |
|-------|-------|
| **Version** | `0.1.0-project-brain` |
| **Module** | Platform |
| **Change Type** | Added |
| **Reason** | Single doc so devs/AI understand repo structure, rules, patterns without reading every file |
| **Impact** | `docs/PROJECT_BRAIN.md`; README, MASTER_INDEX, PRE_CODE_GATE, AI_KNOWLEDGE_INDEX, Cursor rules updated |

**Docs:** `docs/PROJECT_BRAIN.md` — repo map · module UI pattern · database contract · AI readiness matrix

---

### Changed — 2026-06-18 — AI OS docs relocated under `docs/ai_os/`

| Field | Value |
|-------|-------|
| **Version** | `0.1.0-ai-os-docs` |
| **Module** | AI OS |
| **Change Type** | Changed |
| **Reason** | Consolidate AI OS vision & experience docs inside `docs/` for Pre-Code Gate and agent discoverability |
| **Impact** | `ai_docs/` → `docs/ai_os/`; README, MASTER_INDEX, DOCUMENT_REGISTRY, AI_KNOWLEDGE_INDEX, PRE_CODE_GATE updated |

**Docs:** `docs/ai_os/README.md` · `01`–`04` experience specs · cross-links fixed

---

### Added — 2026-06-18 — Sales & Marketing Workspace (UI Design Steps UI-01–05)

| Field | Value |
|-------|-------|
| **Version** | `0.1.0-smw-ui-design` |
| **Module** | Sales & Marketing Workspace |
| **Change Type** | Added |
| **Reason** | UI design documentation before frontend implementation; step-by-step impl workflow |
| **Impact** | New docs under `docs/modules/sales-marketing/ui-design/`; build guide; no app code yet |

**Docs:** `docs/modules/sales-marketing/README.md` · `SMW_UI_BUILD_GUIDE.md` · `ui-design/01`–`05`

**Next:** Impl Step 01 — master layout shell in `apps/web`

---

### Added — 2026-06-17 — Business Partners Module (Planning Docs)

| Field | Value |
|-------|-------|
| **Version** | `0.1.0-bp-plan` |
| **Module** | Business Partners |
| **Change Type** | Added |
| **Reason** | Unify vendor, partner, retailer, wholesaler under one commercial module; SaaS-ready optional module |
| **Impact** | New docs package; UI prototype plan `/partners/*`; MODULE_DEPENDENCY_MAP; future migration from `/suppliers` vendor master |

**Docs:** `docs/modules/business-partners/` · `docs/ui-prototype/business-partners/` · [MODULE_DEPENDENCY_MAP.md](./MODULE_DEPENDENCY_MAP.md)

**Next:** Architect review (A9) → UI prototype P1–P3

---

### Added — 2026-06-15 — Bank EMI Calculator Plugin (Documentation)

| Field | Value |
|-------|-------|
| **Version** | `2.46.0-bank-emi-plugin-docs` |
| **Module** | Ecommerce · Plugin (`bank-emi`) |
| **Change Type** | Added |
| **Reason** | Study Apple Gadgets BD EMI “View Plans” UX; plan installable Bank EMI plugin for AgainERP |
| **Impact** | Plugin architecture, calculation model, admin config, storefront modal spec |

**Docs:** `docs/plugins/bank-emi/` · `docs/ui-prototype/plugins/BankEmi.md` · updated `Plugins.md`, `ECOMMERCE_STOREFRONT_ARCHITECTURE.md`

**Reference:** [Apple Gadgets BD — Apple Pencil Pro](https://www.applegadgetsbd.com/product/apple-pencil-pro)

**Next:** Prototype UI (`emi-plans-modal.tsx`, mock banks, PDP hook)

---

### Added — 2026-06-15 — Suppliers Module + Vendor ↔ Product Mapping (UI Prototype)

| Field | Value |
|-------|-------|
| **Version** | `2.45.0-suppliers-vendor-mapping` |
| **Module** | Purchase · Catalog · Inventory (supplier feed) |
| **Change Type** | Added |
| **Reason** | Implement procurement UI prototype: supplier directory, vendor detail, multi-supplier product sourcing, canonical vendor-product mapping store |
| **Impact** | New `/suppliers/*` routes; sidebar menu; vendor detail record view; `purchase_vendor_items` prototype mapping with stock status, warranty, web publish flag; product drawer supplier sourcing + Map supplier sheet |

**Docs:**
- `docs/ui-prototype/purchase/SUPPLIERS_IMPLEMENTED_DESIGN.md` (new)
- `docs/ui-prototype/purchase/README.md`
- `docs/ui-prototype/catalog/products/IMPLEMENTED_DESIGN.md`
- `docs/modules/purchase/PURCHASE_MODULE_ARCHITECTURE.md` §4 Vendor Catalog Mapping
- `docs/modules/purchase/README.md`

**Code:**
- `apps/web/src/lib/navigation.ts` — Suppliers sidebar (Summary last)
- `apps/web/src/app/(admin)/suppliers/` — control center + `[id]` detail
- `apps/web/src/components/suppliers/` — shell, control center, detail workspace
- `apps/web/src/lib/mock-data/suppliers.ts`
- `apps/web/src/lib/mock-data/vendor-product-mapping.ts`
- `apps/web/src/lib/store/vendor-mapping-store.ts`
- `apps/web/src/components/products/product-supplier-sourcing.tsx`
- `apps/web/src/components/products/map-supplier-sheet.tsx`
- `apps/web/src/components/products/product-detail-content.tsx`

---

### Added — 2026-06-14 — Moharaz-Style Flat URL / Slug Architecture

| Field | Value |
|-------|-------|
| **Version** | `2.44.0-flat-url-architecture` |
| **Module** | Ecommerce · Storefront |
| **Change Type** | Added |
| **Reason** | Implement Moharaz-style flat URLs — `/{slug}` for category, product, brand, CMS page; `/blog/{slug}` for blog posts |
| **Impact** | New slug resolver, path helpers, reserved slug list, CMS pages mock, unified `[slug]` route, blog routes, legacy 301 redirects; flat category slugs |

**Docs:** `docs/modules/ecommerce/URL_SLUG_ARCHITECTURE.md` · `docs/ui-prototype/storefront/URL_SLUG_MANAGEMENT.md`

**Code:**
- `apps/web/src/lib/url-slug/resolver.ts` — entity resolution order: page → category → brand → product
- `apps/web/src/lib/url-slug/paths.ts` — `productPath()`, `categoryPath()`, `brandPath()`, `blogPostPath()`, `cmsPagePath()`
- `apps/web/src/lib/url-slug/reserved-slugs.ts` — blocked system slugs
- `apps/web/src/lib/url-slug/types.ts` — `ResolvedStorefrontSlug` union type
- `apps/web/src/lib/mock-data/cms-pages.ts` — warranty, privacy, terms, returns
- `apps/web/src/app/(storefront)/[slug]/page.tsx` — unified catch-all route
- `apps/web/src/app/(storefront)/blog/page.tsx` + `blog/[slug]/page.tsx` — root blog routes
- `apps/web/src/lib/mock-data/categories.ts` — all slugs flattened (e.g. `electronics/laptops` → `laptops`)
- `apps/web/src/lib/mock-data/brands.ts` — `getBrandBySlug()` added
- `apps/web/src/components/storefront/catalog/catalog-view.tsx` — `brandSlug` prop
- `apps/web/next.config.ts` — 301 redirects: `/shop/p/*`, `/shop/c/*`, `/shop/brands/*`, `/shop/blog/*`

---

### Changed — 2026-06-13 — Admin Product List UX + Global Toasts

| Field | Value |
|-------|-------|
| **Version** | `2.43.0-admin-product-list-ux` |
| **Module** | Ecommerce · Catalog · Admin Shell |
| **Change Type** | Changed |
| **Reason** | Document as-built Product List filters, category hierarchy display, expanded live edit, compact bottom-right toasts; sidebar favorites removed in prototype |
| **Impact** | Product grid docs aligned with `product-grid.tsx`; Sonner toaster config in `app-providers.tsx`; `Product.slug` on mock type |

**Product List (`/catalog/products`):**
- Category column + filter: hierarchical display — parent path small on top (`Laptops › Gaming Laptop`), leaf caption/name below (`HP`); multi-level paths exclude root when depth > 2
- Category + Brand filters: searchable custom dropdowns (not native `<select>`)
- Live edit toggles: Product title, Category, Brand, Slug (+ existing SKU, Price, Stock, Status); Slug column hideable via Columns sheet
- Mock products use `categoriesFlat` (incl. subcategories) + `slug` field

**Admin shell:**
- Sidebar **Favorites** section removed (prototype); `app-store` default `favorites: []`
- All Sonner toasts: **bottom-right**, compact (`text-xs`, small padding/icon)

**Docs:** `docs/ui-prototype/catalog/products/ProductList.md` · `IMPLEMENTED_DESIGN.md` · `ProductListChanges.md` · `docs/ui-ux/components.md` · `PROTOTYPE_SHELL.md`

**Code:** `apps/web/src/components/products/product-grid.tsx` · `apps/web/src/lib/category-utils.ts` · `apps/web/src/lib/mock-data/products.ts` · `apps/web/src/lib/mock-data/categories.ts` · `apps/web/src/components/providers/app-providers.tsx` · `apps/web/src/components/layout/admin-sidebar.tsx`

---

### Added — 2026-06-13 — Storefront UI Prototype (As-Built)

| Field | Value |
|-------|-------|
| **Version** | `2.42.0-storefront-prototype-ui` |
| **Module** | Ecommerce · Customer Storefront (Prototype) |
| **Change Type** | Added |
| **Reason** | Document and ship AgainShop `/shop/*` prototype — PLP, PDP, cart, checkout, search, wishlist, compare, auth |
| **Impact** | 23 storefront routes; 4 Zustand stores; live search; variant gallery; review/Q&A dialogs; social login mock |

**Docs:** `docs/ui-prototype/storefront/IMPLEMENTED_DESIGN.md` · `docs/ui-prototype/storefront/README.md`

**Code:** `apps/web/src/app/(storefront)/shop/*` · `apps/web/src/components/storefront/*`

**Scope:** Mock data only (no storefront API). Admin remains separate at `/dashboard`. Dev default: `npm run dev -- --port 3001`

**Screens built:** Home · PLP (all + category) · PDP · Search · Deals · New · Best sellers · Cart · Checkout · Thank you · Wishlist · Compare · Account (login/register tabs + Google/Facebook/WhatsApp) · Blog · Contact · Shipping · FAQ · Track · About · Careers

---

### Added — 2026-06-13 — Ecommerce Storefront Architecture

| Field | Value |
|-------|-------|
| **Version** | `2.41.0-ecommerce-storefront` |
| **Module** | Ecommerce · Customer Storefront |
| **Change Type** | Added |
| **Reason** | Complete customer-facing storefront architecture — pages, checkout, AI, SEO, performance |
| **Impact** | ECOMMERCE_STOREFRONT_ARCHITECTURE v1.0 — 20 sections; API-only; mobile/SEO first |

**Docs:** `docs/modules/ecommerce/ECOMMERCE_STOREFRONT_ARCHITECTURE.md`

**Scope:** Next.js storefront; not admin/ERP; REQ-ECOM-001

---

### Added — 2026-06-13 — Sales Domain Entity Catalog

| Field | Value |
|-------|-------|
| **Version** | `2.40.0-entity-sales` |
| **Module** | Sales · Business Entities |
| **Change Type** | Added |
| **Reason** | Enterprise sales entity design — 16 entities, quote-to-cash workflows |
| **Impact** | ENTITY_SALES v1.0 — Customer through Return Order; no SQL |

**Docs:** `docs/modules/sales/ENTITY_SALES.md`

**Scope:** Quotation, Order, Shipment, Invoice, Payment, Return workflows; CRM pipeline integration

---

### Added — 2026-06-13 — Purchase Domain Entity Catalog

| Field | Value |
|-------|-------|
| **Version** | `2.39.0-entity-purchase` |
| **Module** | Purchase · Business Entities |
| **Change Type** | Added |
| **Reason** | Enterprise purchase entity design — 15 entities, procure-to-pay workflows |
| **Impact** | ENTITY_PURCHASE v1.0 — RFQ through returns; no SQL |

**Docs:** `docs/modules/purchase/ENTITY_PURCHASE.md`

**Scope:** Vendor, RFQ, PO, Receipt, Bill, Return, Contract, Vendor Performance; workflow §5

---

### Added — 2026-06-13 — Inventory Domain Entity Catalog

| Field | Value |
|-------|-------|
| **Version** | `2.38.0-entity-inventory` |
| **Module** | Inventory · Business Entities |
| **Change Type** | Added |
| **Reason** | Enterprise inventory entity design — 15 entities, multi-industry channel matrix |
| **Impact** | ENTITY_INVENTORY v1.0 — Stock Ledger, Movement, Transfer, Batch, Snapshot; no SQL |

**Docs:** `docs/modules/inventory/ENTITY_INVENTORY.md`

**Scope:** Ecommerce, Sales, Purchase, Manufacturing, Hospital, Restaurant, POS integration patterns

---

### Added — 2026-06-13 — Catalog Domain Entity Catalog

| Field | Value |
|-------|-------|
| **Version** | `2.37.0-entity-catalog` |
| **Module** | Catalog · Business Entities |
| **Change Type** | Added |
| **Reason** | Enterprise catalog entity design — 17 entities with lifecycle, relationships, permissions, AI, search |
| **Impact** | ENTITY_CATALOG v1.0 — Product lifecycle Draft→Review→Approved→Published→Archived; no SQL |

**Docs:** `docs/modules/ecommerce/catalog/ENTITY_CATALOG.md`

**Scope:** Product, Variant, Type, Category, Brand, Collection, Specification stack, Relationships, Media, SEO, Review, Question, Tag, Label

---

### Added — 2026-06-13 — Traceability Matrix (Platform)

| Field | Value |
|-------|-------|
| **Version** | `2.36.0-traceability-matrix` |
| **Module** | Platform · Requirements Traceability |
| **Change Type** | Added |
| **Reason** | Complete traceability — requirements through modules, pages, entities, services, APIs, workflows, permissions, AI |
| **Impact** | TRACEABILITY_MATRIX v2.0 — REQ-{DOMAIN}-{NNN} schema, 16 requirements, dimensional maps, benefits |

**Docs:** `docs/TRACEABILITY_MATRIX.md`

**Scope:** REQ-CATALOG-001 example chain; legacy REQ-001–008 migration table

---

### Added — 2026-06-13 — Project Map (Visual Platform Map)

| Field | Value |
|-------|-------|
| **Version** | `2.35.0-project-map` |
| **Module** | Platform · Visual Architecture |
| **Change Type** | Added |
| **Reason** | Complete visual map — layers, modules, services, entities, events, permissions, API, search, AI, industry expansion |
| **Impact** | PROJECT_MAP v2.0 — 11 sections, ASCII + Mermaid diagrams, end-to-end flows, golden rules |

**Docs:** `docs/PROJECT_MAP.md`

**Scope:** Onboard developers, architects, and AI agents in minutes

---

### Added — 2026-06-13 — Master Index (Documentation Hub)

| Field | Value |
|-------|-------|
| **Version** | `2.34.0-master-index` |
| **Module** | Platform · Documentation Navigation |
| **Change Type** | Added |
| **Reason** | Master documentation entry point — central navigation hub for entire ecosystem |
| **Impact** | MASTER_INDEX v2.0 — overview, vision, principles, governance, 10 doc categories, hierarchy, reading order, ownership, status |

**Docs:** `docs/MASTER_INDEX.md`

**Scope:** Links all master registries; reading orders for humans, AI, and implementation gate

---

### Added — 2026-06-13 — AI Knowledge Index (Platform)

| Field | Value |
|-------|-------|
| **Version** | `2.33.0-ai-knowledge-index` |
| **Module** | Platform · AI Knowledge |
| **Change Type** | Added |
| **Reason** | Master AI knowledge map — teaches ChatGPT, Claude, Gemini, Cursor, AI OS how AgainERP works |
| **Impact** | Index doc v2.0 — 13 registry sections, 11 domain agents, governance/security/approval/audit/memory rules |

**Docs:** `docs/AI_KNOWLEDGE_INDEX.md`

**Scope:** Final rule — AI never accesses DB; operates via Services, Permissions, Workflows, Approvals, Audit

---

### Added — 2026-06-13 — API Registry (Platform)

| Field | Value |
|-------|-------|
| **Version** | `2.32.0-api-registry` |
| **Module** | Platform · API Architecture |
| **Change Type** | Added |
| **Reason** | Master API architecture registry — no endpoint paths; domain groups, operations, permissions, events |
| **Impact** | Registry doc — 11 cross-cutting sections + 15 domain profiles; versioning, auth, pagination, filtering, search |

**Docs:** `docs/API_REGISTRY.md`

**Scope:** Catalog through AI domains; operation catalog; module API.md deferred to implementation gate

---

### Added — 2026-06-13 — Service Registry (Platform)

| Field | Value |
|-------|-------|
| **Version** | `2.31.0-service-registry` |
| **Module** | Platform · Services |
| **Change Type** | Added |
| **Reason** | Master service registry — DDD, service oriented, modular monolith; platform + business services |
| **Impact** | Registry doc — 11 platform + 7 business services with responsibilities, consumers, deps, events, permissions, future compatibility |

**Docs:** `docs/SERVICE_REGISTRY.md`

**Scope:** 18 services — Activity through Finance; dependency map and registry rules

---

### Added — 2026-06-13 — Entity Relationship Registry (Platform)

| Field | Value |
|-------|-------|
| **Version** | `2.30.0-entity-relationship-registry` |
| **Module** | Platform · Business Entities |
| **Change Type** | Added |
| **Reason** | Master business entity registry — not ERD; ownership, relationships, lifecycle, capabilities |
| **Impact** | Registry doc — 8 core + 18 business/platform entities with full profiles; dependency map, rules, expansion |

**Docs:** `docs/ENTITY_RELATIONSHIP_REGISTRY.md`

**Scope:** 7 sections — User through AI Task; Activity/AI/Approval matrix per entity

---

### Added — 2026-06-13 — Module Dependency Map (Platform)

| Field | Value |
|-------|-------|
| **Version** | `2.29.0-module-dependency-map` |
| **Module** | Platform · Module Dependencies |
| **Change Type** | Added |
| **Reason** | Master dependency map — no direct module deps; services and events only |
| **Impact** | Architecture doc — 17 modules, layer deps, diagrams, rules, forbidden patterns, expansion |

**Docs:** `docs/MODULE_DEPENDENCY_MAP.md`

**Scope:** 7 sections + 17 module integration profiles; Platform, Core, Business, Industry, AI layers

---

### Added — 2026-06-13 — Global Search Architecture (Platform)

| Field | Value |
|-------|-------|
| **Version** | `2.28.0-global-search-architecture` |
| **Module** | Core Platform · Global Search |
| **Change Type** | Added |
| **Reason** | Universal search system — Meilisearch primary, Elasticsearch future, AI/NL/voice/semantic roadmap |
| **Impact** | Architecture doc — global bar, module search, index registry, ranking, permissions, suggestions, analytics, AI integration |

**Docs:** `docs/core/engines/GLOBAL_SEARCH_ARCHITECTURE.md`

**Scope:** 13 sections — 12 searchable domains (Products, Orders, Customers, Inventory, Purchase, Sales, CRM, Marketing, Finance, Documents, Activities, Users)

---

### Added — 2026-06-13 — Notification Engine Architecture (Platform)

| Field | Value |
|-------|-------|
| **Version** | `2.27.0-notification-engine-architecture` |
| **Module** | Core Platform · Notification Engine |
| **Change Type** | Added |
| **Reason** | Platform-wide notification engine for all modules — multi-channel delivery |
| **Impact** | Architecture doc — templates, queue, tracking, preferences, rules, event/workflow/approval/AI integration |

**Docs:** `docs/core/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md`

**Scope:** 13 sections — email, SMS, push, in-app, WhatsApp, Telegram, Slack channels

---

### Added — 2026-06-13 — Event Architecture (Platform Event System)

| Field | Value |
|-------|-------|
| **Version** | `2.26.0-event-architecture` |
| **Module** | Core Platform · Event System |
| **Change Type** | Added |
| **Reason** | Enterprise event-driven architecture — domain, integration, system events, bus, routing, consumers |
| **Impact** | Architecture doc — history, retry, failure handling, audit, AI event processing |

**Docs:** `docs/core/engines/EVENT_ARCHITECTURE.md`

**Scope:** 14 sections — EDA vision through AI processing; ProductCreated, OrderPlaced, InvoicePaid examples

---

### Added — 2026-06-13 — Permission System Architecture (Global Authorization)

| Field | Value |
|-------|-------|
| **Version** | `2.25.0-permission-system-architecture` |
| **Module** | Core Platform · Authorization |
| **Change Type** | Added |
| **Reason** | Enterprise global RBAC — ERP, Ecommerce, CRM, Marketplace, AI OS |
| **Impact** | Architecture doc — registry, roles, resource/field/branch/warehouse ACL, approval, AI, audit, UI/API models |

**Docs:** `docs/core/PERMISSION_SYSTEM_ARCHITECTURE.md`

**Scope:** 15 sections — vision through API model; Product.View, AI.Execute, Workflow.Manage examples; future Hospital, School, Restaurant, Manufacturing

---

### Added — 2026-06-13 — Database Registry (Enterprise Blueprint)

| Field | Value |
|-------|-------|
| **Version** | `2.24.0-database-registry` |
| **Module** | Platform · Database |
| **Change Type** | Added |
| **Reason** | Master database blueprint registry — domains, entities, ownership, governance without SQL |
| **Impact** | Registry doc — 6 layers, 18 domains, 86 entities, naming, tenant, audit, soft delete rules |

**Docs:** `docs/DATABASE_REGISTRY.md`

**Scope:** 12 sections — philosophy through governance; DDD · Modular Monolith · Event Driven · PostgreSQL

---

### Added — 2026-06-13 — AI OS Architecture (Platform Service)

| Field | Value |
|-------|-------|
| **Version** | `2.23.0-ai-os-architecture` |
| **Module** | Platform · AI Operating System |
| **Change Type** | Added |
| **Reason** | Enterprise AI OS as highest platform layer — governed access through services, permissions, workflows, approvals, audit |
| **Impact** | Architecture doc — Chief Agent, 10 domain agents, prompt/knowledge/memory registry, tasks, automation, providers, security, UI |

**Docs:** `docs/modules/ai/AI_OS_ARCHITECTURE.md`

**Scope:** 18 sections — vision through UI/UX; OpenAI, Claude, Gemini, DeepSeek, Qwen, Ollama, Llama; AI is platform service not module

---

### Added — 2026-06-13 — Finance Module Architecture (Finance & Accounting Foundation)

| Field | Value |
|-------|-------|
| **Version** | `2.22.0-finance-module-architecture` |
| **Module** | Finance (Finance & Accounting Foundation) |
| **Change Type** | Added |
| **Reason** | Enterprise finance and accounting foundation as independent module at `/finance/*` |
| **Impact** | Architecture doc — COA, journals, AR/AP, payments, receipts, expenses, tax, reconciliation, reports, audit, AI assistant |

**Docs:** `docs/modules/finance/FINANCE_MODULE_ARCHITECTURE.md`

**Scope:** 18 sections — vision through UI/UX; P&L, Balance Sheet, Cash Flow, Tax, Revenue reports; future Ecommerce, ERP, Manufacturing, Hospital, School

---

### Added — 2026-06-13 — Marketing Module Architecture (Marketing Automation Platform)

| Field | Value |
|-------|-------|
| **Version** | `2.21.0-marketing-module-architecture` |
| **Module** | Marketing (Marketing Automation Platform) |
| **Change Type** | Added |
| **Reason** | Enterprise marketing automation as independent module at `/marketing/*` |
| **Impact** | Architecture doc — campaigns, email/SMS/push, audiences, segments, journeys, coupons, referrals, loyalty, AI agent |

**Docs:** `docs/modules/marketing/MARKETING_MODULE_ARCHITECTURE.md`

**Scope:** 19 sections — vision through UI/UX; AI campaign suggestions, segmentation, churn, recommendations, content generation, performance analysis

---

### Added — 2026-06-13 — Approval Engine Architecture (Platform)

| Field | Value |
|-------|-------|
| **Version** | `2.20.0-approval-engine-architecture` |
| **Module** | Core Platform · Approval Engine |
| **Change Type** | Added |
| **Reason** | Enterprise reusable approval engine — platform-wide human gates for all modules |
| **Impact** | Architecture doc — policies, chains, delegation, escalation, AI assistant, inbox UI |

**Docs:** `docs/core/engines/APPROVAL_ENGINE_ARCHITECTURE.md`

**Scope:** 15 sections — single/multi-level, parallel, conditional approval; Products, PO, SO, Refunds, Adjustments, Expenses, Finance, HR

---

### Added — 2026-06-13 — Workflow Engine Architecture (Platform)

| Field | Value |
|-------|-------|
| **Version** | `2.19.0-workflow-engine-architecture` |
| **Module** | Core Platform · Workflow Engine |
| **Change Type** | Added |
| **Reason** | Enterprise reusable workflow engine — platform-level state machine for all modules |
| **Impact** | Architecture doc — definitions, states, transitions, triggers, conditions, actions, builder UI, AI/analytics |

**Docs:** `docs/core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md`

**Scope:** 17 sections — vision through future compatibility; Ecommerce, Inventory, Purchase, Sales, CRM, Marketing, Finance, Hospital, School, Restaurant

---

### Added — 2026-06-13 — CRM Module Architecture (Customer Intelligence Platform)

| Field | Value |
|-------|-------|
| **Version** | `2.18.0-crm-module-architecture` |
| **Module** | CRM (Customer Intelligence Platform) |
| **Change Type** | Added |
| **Reason** | AI-first CRM as independent module at `/crm/*` — not a contact list |
| **Impact** | Architecture doc — leads, contacts, accounts, opportunities, pipelines, intelligence center, AI agent, multi-industry |

**Docs:** `docs/modules/crm/CRM_MODULE_ARCHITECTURE.md`

**Scope:** 24 sections — vision through future compatibility; Ecommerce, Sales, Marketing, Support, AI OS integration

---

### Added — 2026-06-13 — Sales Workflows

| Field | Value |
|-------|-------|
| **Version** | `2.17.0-sales-workflows` |
| **Module** | Sales (Sales & Revenue) |
| **Change Type** | Added |
| **Reason** | Define all sales state machines — quotation, order, return, refund, invoice, payment |
| **Impact** | Workflow doc — triggers, states, transitions, approval rules, AI actions, activity tracking |

**Docs:** `docs/modules/sales/SALES_WORKFLOW.md`

**Scope:** 6 workflows plus dedicated approval, AI, and activity sections; Inventory reservation/ship handoff

---

### Added — 2026-06-13 — Purchase Workflows

| Field | Value |
|-------|-------|
| **Version** | `2.16.0-purchase-workflows` |
| **Module** | Purchase (Procurement) |
| **Change Type** | Added |
| **Reason** | Define all procurement state machines — RFQ, PO, receiving, vendor bill, returns |
| **Impact** | Workflow doc — triggers, states, transitions, approval rules, AI recommendations, activity tracking |

**Docs:** `docs/modules/purchase/PURCHASE_WORKFLOW.md`

**Scope:** 5 workflows plus dedicated approval, AI, and activity sections; cross-links to Inventory Stock In/Out

---

### Added — 2026-06-13 — Inventory Workflows

| Field | Value |
|-------|-------|
| **Version** | `2.15.0-inventory-workflows` |
| **Module** | Inventory |
| **Change Type** | Added |
| **Reason** | Define all Inventory state machines — stock in/out, transfer, adjustment, reservation, batch, serial, cycle count |
| **Impact** | Workflow doc — triggers, states, transitions, approvals, activity logs, AI actions, text diagrams |

**Docs:** `docs/modules/inventory/INVENTORY_WORKFLOW.md`

**Scope:** 8 workflows with full lifecycle specs; cross-workflow integration map; workflow engine registration

---

### Added — 2026-06-13 — Sales Module Architecture (Sales & Revenue)

| Field | Value |
|-------|-------|
| **Version** | `2.14.0-sales-module-architecture` |
| **Module** | Sales (Sales & Revenue) |
| **Change Type** | Added |
| **Reason** | Enterprise quote-to-cash architecture as independent module at `/sales/*` |
| **Impact** | Architecture doc — customers, quotations, orders, shipments, invoices, payments, returns, credit notes, AI agent, Inventory/CRM/Finance integration |

**Docs:** `docs/modules/sales/SALES_MODULE_ARCHITECTURE.md`

**Scope:** 20 sections — vision through finance integration, approval workflow, commerce_orders alignment

---

### Added — 2026-06-13 — Purchase Module Architecture (Procurement)

| Field | Value |
|-------|-------|
| **Version** | `2.13.0-purchase-module-architecture` |
| **Module** | Purchase (Procurement & Vendor Management) |
| **Change Type** | Added |
| **Reason** | Enterprise procure-to-pay architecture as independent module at `/purchase/*` |
| **Impact** | Architecture doc — vendors, RFQ, PO, receipts, bills, returns, contracts, AI agent, Inventory/Finance integration |

**Docs:** `docs/modules/purchase/PURCHASE_MODULE_ARCHITECTURE.md`

**Scope:** 20 sections — vision through future compatibility, approval workflow, three-way match

---

### Added — 2026-06-13 — Inventory Module Architecture (Independent)

| Field | Value |
|-------|-------|
| **Version** | `2.12.0-inventory-module-architecture` |
| **Module** | Inventory (Independent Business Module) |
| **Change Type** | Added |
| **Reason** | Enterprise inventory architecture as independent module at `/inventory/*` — not Ecommerce submodule |
| **Impact** | Architecture doc only — stock ledger, warehouses, batches, serials, cycle counts, valuation, AI agent, activity integration |

**Docs:** `docs/modules/inventory/INVENTORY_MODULE_ARCHITECTURE.md`

**Scope:** 22 sections — vision, navigation, dashboard, stock, transfers, adjustments, reservations, batches, serials, permissions, UI/UX, multi-industry compatibility

---

### Added — 2026-06-13 — Product Master Architecture

| Field | Value |
|-------|-------|
| **Version** | `2.11.0-product-master-architecture` |
| **Module** | Core Platform · Product Domain |
| **Change Type** | Added |
| **Reason** | Enterprise-grade single Product Master architecture — shared across Ecommerce, Inventory, Purchase, Sales, CRM, Marketing, and future industries |
| **Impact** | Architecture doc only — documentation first phase; no backend/API/database implementation |

**Docs:** `docs/modules/core/PRODUCT_MASTER_ARCHITECTURE.md`

**Scope:** Product types, structure, specifications, variants, relationships, lifecycle, activity, AI, permissions, UI/UX, global search, architecture rules

---

### Added — 2026-06-13 — Settings Architecture (Three-Layer)

| Field | Value |
|-------|-------|
| **Version** | `2.10.0-settings-architecture` |
| **Module** | Core Platform |
| **Change Type** | Added |
| **Reason** | Approved three-layer settings architecture — Business, Workspace, Control Center |
| **Impact** | Architecture doc, schema-driven settings UI prototype, persist store, activity integration |

**Docs:** `docs/modules/core/SETTINGS_ARCHITECTURE.md`

**Code:** `lib/settings/`, `lib/store/settings-store.ts`, `components/settings/`, routes `/settings`, `/workspace`, `/control-center`

---

### Added — 2026-06-13 — Global Activity & Chatter Platform

| Field | Value |
|-------|-------|
| **Version** | `2.9.0-activity-chatter-platform` |
| **Module** | Core Platform |
| **Change Type** | Added |
| **Reason** | Mandatory platform-level activity, timeline, comments, notes, and audit layer for all business objects |
| **Impact** | Architecture doc, centralized activity store, global right drawer, list-page Activity column on Products/Orders/Customers/Reviews |

**Docs:** `docs/modules/core/ACTIVITY_CHATTER_ARCHITECTURE.md`

**Code:** `lib/activity/types.ts`, `lib/mock-data/activities.ts`, `lib/store/activity-store.ts`, `components/activity/`

---

### Added — 2026-06-12 — Orders Module UI Prototype

| Field | Value |
|-------|-------|
| **Version** | `2.7.0-orders-ui-prototype` |
| **Module** | Orders |
| **Change Type** | Added |
| **Reason** | Interactive prototype for approved Orders architecture |
| **Impact** | Dashboard, AG Grid list, two-column order workspace, sub-routes |

**Code:** `apps/web/src/components/orders/`, routes under `/orders/*`

---

### Updated — 2026-06-12 — Orders Module Architecture (Approved v2.0)

| Field | Value |
|-------|-------|
| **Version** | `2.7.0-orders-architecture-approved` |
| **Module** | Orders |
| **Change Type** | Updated |
| **Reason** | Approved operational architecture: Odoo/Shopify/HubSpot/Linear inspiration |
| **Impact** | Menu structure, order workspace spec, activities, AI integration, final rule |

**Key file:** `modules/ecommerce/orders/ARCHITECTURE.md`

---

### Added — 2026-06-12 — Catalog Specifications Module Architecture (Approved)

| Field | Value |
|-------|-------|
| **Version** | `2.6.0-specifications-architecture` |
| **Module** | Catalog · Specifications |
| **Change Type** | Added (supersedes attribute profile draft) |
| **Reason** | Approved enterprise spec system: Profile Builder only, AI Import/Suggestions, multi-industry |
| **Impact** | User-facing terminology → Specification Profile/Group/Field; menu under Catalog › Specifications |

**Key file:** `modules/ecommerce/catalog/SPECIFICATIONS_ARCHITECTURE.md`

**Supersedes:** `ATTRIBUTE_PROFILE_ARCHITECTURE.md` (redirect stub)

---

### Added — 2026-06-12 — Catalog Attribute Profile Architecture

| Field | Value |
|-------|-------|
| **Version** | `2.5.0-attribute-profile-architecture` |
| **Module** | Catalog · Ecommerce |
| **Change Type** | Added |
| **Reason** | Enterprise specification template system for multi-industry product attributes |
| **Impact** | Profile → Group → Attribute → Product Value hierarchy; storefront, comparison, filters, AI import |

**Key file:** `modules/ecommerce/catalog/ATTRIBUTE_PROFILE_ARCHITECTURE.md`

---

### Updated — 2026-06-12 — Catalog Products As-Built Documentation

| Field | Value |
|-------|-------|
| **Version** | `2.4.0-products-as-built-docs` |
| **Module** | Ecommerce · Catalog · UI Prototype |
| **Change Type** | Updated |
| **Reason** | Document implemented Product List + Add/Edit UI in IMPLEMENTED_DESIGN.md |
| **Impact** | ProductList, AddProduct, EditProduct specs aligned with `apps/web` code |

**Key file:** `ui-prototype/catalog/products/IMPLEMENTED_DESIGN.md`

---

### Added — 2026-06-12 — Hybrid Licensed ERP Architecture

| Field | Value |
|-------|-------|
| **Version** | `2.3.0-hybrid-licensed-erp` |
| **Module** | Platform · Architecture |
| **Change Type** | Added |
| **Reason** | Canonical hybrid licensed ERP design — SaaS, hybrid, enterprise, white label, IP protection |
| **Impact** | Cloud control plane vs client runtime separation; License Agent + Sync Agent; offline strategy |
| **Developer Notes** | See `HYBRID_LICENSED_ERP_ARCHITECTURE.md`, `platform/`, `adr/ADR-013-hybrid-licensed-erp.md` |

**New files:** `HYBRID_LICENSED_ERP_ARCHITECTURE.md`, `platform/CLOUD_CONTROL_PLANE.md`, `platform/HYBRID_DEPLOYMENT.md`, `platform/LICENSE_AND_SYNC_AGENTS.md`, `platform/DATA_OWNERSHIP.md`, `adr/ADR-013-hybrid-licensed-erp.md`

**Updated:** `MASTER_INDEX.md`, `README.md`, `platform/README.md`, `ADR_INDEX.md`, `SAAS_PLATFORM_ARCHITECTURE.md`

---

### Added — 2026-06-12 — Ecommerce Admin UI Prototype Phase 1 (apps/web)

| Field | Value |
|-------|-------|
| **Version** | `2.2.0-ecommerce-prototype-phase1` |
| **Module** | Ecommerce · UI Prototype |
| **Change Type** | Added |
| **Reason** | Phase 1 Next.js prototype — shell, dashboard, product list/details/create, media, AI drawer |
| **Impact** | `apps/web/` — frontend only, 120 mock products, AG Grid, Recharts, CMDK |
| **Developer Notes** | `cd apps/web && npm run dev` — no backend |

---

### Added — 2026-06-12 — UI/UX Prototype Mode

| Field | Value |
|-------|-------|
| **Version** | `2.1.0-ui-prototype-mode` |
| **Module** | Platform · UI Prototype |
| **Change Type** | Added |
| **Reason** | Official UI/UX Prototype Mode — frontend-only Next.js prototype, tri-file page docs, full module scope, shell spec |
| **Impact** | Active dev phase; no backend/API/DB; Pre-Code Gate prototype exception |
| **Developer Notes** | See `UI_PROTOTYPE_MODE.md`, `ui-prototype/PROTOTYPE_SHELL.md`, `generate-ui-prototype-tri-files.py` |

**New files:** `UI_PROTOTYPE_MODE.md`, `ui-prototype/PROTOTYPE_SHELL.md`, `ui-prototype/MODULE_SCOPE.md`, `_PAGE_REVIEW_TEMPLATE.md`, `_PAGE_CHANGES_TEMPLATE.md`, `scripts/generate-ui-prototype-tri-files.py`

**Updated:** `UI_PROTOTYPE_STRATEGY.md`, `REVIEW_CYCLE.md`, `DUMMY_DATA_STANDARDS.md`, `PRE_CODE_GATE.md`, `README.md`, `MASTER_INDEX.md`

---

### Added — 2026-06-12 — Pre-Code Gate

| Field | Value |
|-------|-------|
| **Version** | `2.0.1-pre-code-gate` |
| **Module** | Platform · Governance |
| **Change Type** | Added |
| **Reason** | Mandatory pre-code review — 6 document categories; STOP if missing; never code without Ready approval |
| **Impact** | All developers and AI agents must pass gate before implementation |
| **Developer Notes** | See `PRE_CODE_GATE.md`, `_PRE_CODE_GATE_CHECKLIST.md` |

**Updated:** `GOVERNANCE.md`, `README.md`, `MASTER_INDEX.md`, `TECHNOLOGY_CONSTITUTION.md`, `AI_KNOWLEDGE_INDEX.md`, `_COMMIT_CHECKLIST.md`

---

### Added — 2026-06-12 — Technology Constitution

| Field | Value |
|-------|-------|
| **Version** | `2.0.0-technology-constitution` |
| **Module** | Platform · Constitution |
| **Change Type** | Added |
| **Reason** | Official technology stack and engineering standards — single source of truth for all development |
| **Impact** | Next.js + FastAPI + LangGraph + Meilisearch + MinIO ratified; Laravel/Vue ADRs superseded |
| **Developer Notes** | See `TECHNOLOGY_CONSTITUTION.md`, ADR-011, ADR-012 |

**New files:** `TECHNOLOGY_CONSTITUTION.md`, `adr/ADR-011-nextjs-typescript.md`, `adr/ADR-012-fastapi-python.md`

**Updated:** `README.md`, `GOVERNANCE.md`, `MASTER_INDEX.md`, `PROJECT_MAP.md`, `DEVELOPMENT_STANDARDS.md`, `AI_KNOWLEDGE_INDEX.md`, `ADR_INDEX.md`, ADR-002/003 marked Superseded

---

### Added — 2026-06-12 — Mandatory Governance Files

| Field | Value |
|-------|-------|
| **Version** | `1.9.0-governance` |
| **Module** | Platform · Governance |
| **Change Type** | Added |
| **Reason** | Mandatory root-level governance files — registries, index, project map, ADRs, traceability, health report, AI knowledge index |
| **Impact** | Primary navigation layer for developers, architects, PMs, and AI agents; all docs must be registered |
| **Developer Notes** | Run `python3 docs/scripts/generate-governance-registries.py` after doc changes |

**New files:** `MASTER_INDEX.md`, `PROJECT_MAP.md`, `DOCUMENT_REGISTRY.md`, `MODULE_REGISTRY.md`, `PAGE_REGISTRY.md`, `DATABASE_REGISTRY.md`, `API_REGISTRY.md`, `WORKFLOW_REGISTRY.md`, `AI_KNOWLEDGE_INDEX.md`, `ADR_INDEX.md`, `TRACEABILITY_MATRIX.md`, `DOCUMENTATION_HEALTH_REPORT.md`, `adr/ADR-001` through `ADR-010`, `scripts/generate-governance-registries.py`, `_registries/*`

**Updated:** `README.md` (project entry point), `GOVERNANCE.md` (mandatory files + AI rules)

---

### Added — 2026-06-12 — Universal Module Framework

| Field | Value |
|-------|-------|
| **Version** | `1.8.0-universal-module-framework` |
| **Module** | Platform · Framework |
| **Change Type** | Added |
| **Reason** | Universal Module Framework — unlimited industry modules on Core Services; install/remove/upgrade lifecycle; mandatory 9-file package including AI.md |
| **Impact** | All future modules follow identical structure; no cross-module DB; Services + Events + APIs + Workflows only |
| **Developer Notes** | See `UNIVERSAL_MODULE_FRAMEWORK.md`, `framework/` |

**New files:** `UNIVERSAL_MODULE_FRAMEWORK.md`, `framework/CORE_SERVICES.md`, `framework/COMMUNICATION_CONTRACTS.md`, `framework/MODULE_LIFECYCLE.md`, `framework/INDUSTRY_MODULES.md`, `framework/templates/AI_TEMPLATE.md`, `framework/README.md`

**Updated:** `MODULE_STRUCTURE.md`, `_MODULE_MANIFEST_TEMPLATE.md`, `MASTER_MODULE_ARCHITECTURE.md`, `GOVERNANCE.md`, `README.md`

---

### Added — 2026-06-12 — UI Prototype Strategy

| Field | Value |
|-------|-------|
| **Version** | `1.7.0-ui-prototype` |
| **Module** | Platform · UI Prototype |
| **Change Type** | Added |
| **Reason** | UI Prototype Development Strategy — Phase 1 dummy data, page docs, review cycle, production gate |
| **Impact** | 138+ page stubs in `ui-prototype/`; generator script; no production code until gate |
| **Developer Notes** | See `UI_PROTOTYPE_STRATEGY.md`, `ui-prototype/` |

---

### Added — 2026-06-12 — SaaS Platform Architecture

| Field | Value |
|-------|-------|
| **Version** | `1.6.0-saas-platform` |
| **Module** | Platform · SaaS |
| **Change Type** | Added |
| **Reason** | Complete SaaS Platform Architecture — tenants, subscriptions, billing, metering, AI credits, white label, scaling |
| **Impact** | Platform layer design; tenant isolation; links subscription module to platform |
| **Developer Notes** | See `SAAS_PLATFORM_ARCHITECTURE.md`, `platform/` |

**New files:** `SAAS_PLATFORM_ARCHITECTURE.md`, `platform/TENANT_ARCHITECTURE.md`, `platform/SAAS_ER_DIAGRAM.md`, `platform/SCALING_ROADMAP.md`, `platform/README.md`

---

### Added — 2026-06-12 — AI OS Architecture

| Field | Value |
|-------|-------|
| **Version** | `1.5.0-ai-os` |
| **Module** | AI Platform |
| **Change Type** | Added |
| **Reason** | AI OS Architecture — Chief Agent, 14 engines, tool/agent orchestration, digital twin, scaling phases 1–7 |
| **Impact** | Defines multi-agent ERP intelligence layer; future operating layer of platform |
| **Developer Notes** | See `modules/ai/AI_OS_ARCHITECTURE.md` |

**New files:** `AI_OS_ARCHITECTURE.md`, `AI_DIGITAL_TWIN.md`, `AI_SCALING_ROADMAP.md` · Updated `AI_OS.md` as index

---

### Added — 2026-06-12 — AI-First Architecture

| Field | Value |
|-------|-------|
| **Version** | `1.4.0-ai-first` |
| **Module** | AI Platform |
| **Change Type** | Added |
| **Reason** | AI-First Architecture — AI OS, access layer, universal actions, audit, approval, context engine |
| **Impact** | All modules must register AI via services; no direct DB from AI |
| **Developer Notes** | See `modules/ai/AI_FIRST_ARCHITECTURE.md` |

**New files:** `AI_FIRST_ARCHITECTURE.md`, `AI_OS.md`, `AI_CONTEXT_ENGINE.md`, `AI_AUDIT_AND_APPROVAL.md`

---

### Added — 2026-06-12 — UX Smart Interaction Standards

| Field | Value |
|-------|-------|
| **Version** | `1.3.0-smart-ux` |
| **Module** | Platform · UI/UX |
| **Change Type** | Added |
| **Reason** | UX & Smart Interaction Standards — minimize clicks, live filters, popup-first, variant gallery, TipTap, media popup |
| **Impact** | All list views, forms, catalog, media, AI assistant |
| **Developer Notes** | See `ui-ux/UX_SMART_INTERACTION_STANDARDS.md` |

**New files:** `UX_SMART_INTERACTION_STANDARDS.md`, `live-filters.md`, `product-gallery.md`, `popup-first-ux.md`, `smart-admin-lists.md`, `rich-text-editor.md`, `media-manager-ui.md`, `live-preview.md`, `autosave.md`, `seo-assistant-ui.md`, `performance-ui.md`, `future-interactions.md`

---

### Added — 2026-06-12 — UI/UX Enterprise Architecture

| Field | Value |
|-------|-------|
| **Version** | `1.2.0-enterprise-ui` |
| **Module** | Platform · UI/UX |
| **Change Type** | Added |
| **Reason** | Enterprise UI/UX Architecture — design formula, smart buttons, command palette, status system, module UI standard |
| **Impact** | All modules must follow ENTERPRISE_UI_ARCHITECTURE; no custom UI patterns allowed |
| **Developer Notes** | See `ui-ux/ENTERPRISE_UI_ARCHITECTURE.md` |

**New files:** `ENTERPRISE_UI_ARCHITECTURE.md`, `command-palette.md`, `smart-buttons.md`, `status-system.md`, `permission-aware-ui.md`, `page-architecture.md`, `module-ui-standard.md`, `reports-ui.md`, `builder-ui.md`

---

### Added — 2026-06-12 — UI/UX

| Field | Value |
|-------|-------|
| **Version** | `1.1.0-ui-standards` |
| **Module** | Platform · UI/UX |
| **Change Type** | Added |
| **Reason** | Master UI/UX Design Standards — Odoo-inspired philosophy, chatter, command palette, AI panel |
| **Impact** | All modules: layout, record views, activity system, notifications, dashboard widgets |
| **Developer Notes** | See `ui-ux/UI_UX_DESIGN_STANDARDS.md` |

**New files:** `UI_UX_DESIGN_STANDARDS.md`, `layout-architecture.md`, `record-view.md`, `activity-system.md`, `notifications.md`, `ai-assistant-ui.md`, `dashboard-widgets.md`

---

### Added — 2026-06-12 — Platform (Phases 0–10 Documentation)

| Field | Value |
|-------|-------|
| **Version** | `1.1.0-docs-complete` |
| **Module** | Platform (all phases) |
| **Change Type** | Added |
| **Reason** | Serial completion of Phases 0–10 documentation — 100-step sequence |
| **Impact** | PRD, Core engines, UI system, Ecommerce submodules, ERP modules, AI, Marketplace, Enterprise, DevOps, QA |
| **Developer Notes** | See `MASTER_DEVELOPMENT_SEQUENCE.md` — all steps documented; gates pending approval |

**New doc areas:** `PRD.md`, `core/engines/*`, `core/API.md`, `ui-ux/*`, `ecommerce/{inventory,media,seo,customers,marketing,reports,builder,analytics}/`, `modules/{crm,sales,purchase,accounting,pos,hr,payroll,helpdesk,documents,knowledge,project,timesheet,ai,marketplace,subscription,manufacturing,fleet,logistics,booking,data-warehouse,bi-system}/`, `deployment/*`, `qa/*`, `database/ER_DIAGRAM.md`

---

### Added — 2026-06-12 — Platform

| Field | Value |
|-------|-------|
| **Version** | `1.0.0-database` |
| **Module** | Platform · Database |
| **Change Type** | Added |
| **Reason** | Master Database Architecture — PostgreSQL blueprint (28 sections) |
| **Impact** | All modules: catalog_*, commerce_*, inventory_*, analytics_*, ownership rules |
| **Developer Notes** | See `database/MASTER_DATABASE_ARCHITECTURE.md` |

---

### Added — 2026-06-12 — Platform

| Field | Value |
|-------|-------|
| **Version** | `1.0.0-sequence` |
| **Module** | Platform |
| **Change Type** | Added |
| **Reason** | Master Development Sequence — 100 steps, 11 phases, gate approvals |
| **Impact** | Canonical build order from foundation to launch |
| **Developer Notes** | See `MASTER_DEVELOPMENT_SEQUENCE.md`, `roadmap/PHASE_GATES.md` |

---

### Added — 2026-06-12 — Orders

| Field | Value |
|-------|-------|
| **Version** | `1.0.0-orders` |
| **Module** | Orders (Commerce) |
| **Change Type** | Added |
| **Reason** | Enterprise Orders Module architecture |
| **Impact** | Lifecycle, 8 order types, payments, shipping, returns, refunds, `commerce_*` schema |
| **Developer Notes** | See `modules/ecommerce/orders/ARCHITECTURE.md` |

---

### Added — 2026-06-12 — Core

| Field | Value |
|-------|-------|
| **Version** | `1.0.0-arch` |
| **Module** | Core |
| **Change Type** | Added |
| **Reason** | Complete Core Framework architecture (26 submodules) |
| **Impact** | Foundation for all modules — RBAC, events, media, workflow, SaaS-ready |
| **Developer Notes** | See `core/ARCHITECTURE.md`, `core/ModuleManifest.md` |

---

### Added — 2026-06-12 — Platform

| Field | Value |
|-------|-------|
| **Version** | `1.0.0-platform` |
| **Module** | Platform |
| **Change Type** | Added |
| **Reason** | Master Module Architecture — complete platform blueprint |
| **Impact** | 4 layers, shared services, events, DB ownership, AI blueprint |
| **Developer Notes** | See `MASTER_MODULE_ARCHITECTURE.md` |

---

### Added — 2026-06-12 — Catalog

| Field | Value |
|-------|-------|
| **Version** | `1.0.0-catalog` |
| **Module** | Catalog (Ecommerce domain) |
| **Change Type** | Added |
| **Reason** | Enterprise Catalog Module Architecture |
| **Impact** | 8 product types, `catalog_*` schema, lifecycle, SEO, search, 1M+ scale strategy |
| **Developer Notes** | See `modules/ecommerce/catalog/ARCHITECTURE.md`. Product tables migrate to `catalog_*` namespace |

---

### Added — 2026-06-12 — Ecommerce

| Field | Value |
|-------|-------|
| **Version** | `1.0.0-dashboard` |
| **Module** | Ecommerce · Dashboard |
| **Change Type** | Added |
| **Reason** | Enterprise Dashboard Architecture (20 sections) |
| **Impact** | Widget system, analytics tables, 25+ API endpoints, permission matrix, UI wireframes |
| **Developer Notes** | See `modules/ecommerce/dashboard/ARCHITECTURE.md` |

---

### Modified — 2026-06-12 — Ecommerce

| Field | Value |
|-------|-------|
| **Version** | `1.0.0-menu` |
| **Module** | Ecommerce |
| **Change Type** | Modified |
| **Reason** | Upgrade to Ecommerce Module Structure v1.0 (167 screens) |
| **Impact** | Replaced 39-screen menu with 13 groups: Dashboard, Catalog, Inventory, Sales, Customers, Marketing, Content, Builder, SEO, AI, Media, Reports, System |
| **Developer Notes** | See `MENU_STRUCTURE.md`, `UI.md`. Regenerate: `generate-ecommerce-menus-v1.py` |

---

### Added — 2026-06-12 — Core

| Field | Value |
|-------|-------|
| **Version** | `0.1.0-docs` |
| **Module** | Core |
| **Change Type** | Added |
| **Reason** | Define 13 Core Shared Entities used across all modules |
| **Impact** | Ecommerce, CRM, Sales, and all modules use Core entities — no duplication |
| **Developer Notes** | See `core/shared-entities.md`. Ecommerce uses `contacts` not `ecommerce_customers` |

**Entities:** Companies, Branches, Users, Roles, Permissions, Contacts, Addresses, Media Library, Tags, Notes, Activities, Comments, Attachments

---

### Added — 2026-06-12 — Platform

| Field | Value |
|-------|-------|
| **Version** | `0.1.0-docs` |
| **Module** | Platform |
| **Change Type** | Added |
| **Reason** | Establish global development standards (20 rules) |
| **Impact** | All modules must comply — mobile, performance, SEO, security, API, DB |
| **Developer Notes** | See `DEVELOPMENT_STANDARDS.md` and detail docs in `ui-ux/`, `api/`, `database/`, `deployment/` |

**Files added:**
- `docs/DEVELOPMENT_STANDARDS.md`
- `docs/ui-ux/mobile-first.md`, `docs/ui-ux/seo.md`
- `docs/api/architecture.md`
- `docs/database/standards.md`, `audit-trail.md`, `multi-company.md`, `naming-conventions.md`
- `docs/deployment/monitoring.md`

---

### Added — 2026-06-12 — Platform

| Field | Value |
|-------|-------|
| **Version** | `0.1.0-docs` |
| **Module** | Platform |
| **Change Type** | Added |
| **Reason** | Establish documentation-first governance framework |
| **Impact** | All modules; defines mandatory workflow before any code |
| **Developer Notes** | See `GOVERNANCE.md`, `DependencyMap.md`, `ModuleManifest.md` per module |

**Files added:**
- `docs/GOVERNANCE.md`
- `docs/CHANGELOG.md`
- `docs/DependencyMap.md`
- `docs/_COMMIT_CHECKLIST.md`
- `docs/_CHANGE_IMPACT_TEMPLATE.md`
- `docs/_ARCHITECTURE_SYNC_REPORT_TEMPLATE.md`
- `docs/_MODULE_MANIFEST_TEMPLATE.md`
- `docs/modules/ecommerce/ModuleManifest.md`

---

### Added — 2026-06-12 — Ecommerce

| Field | Value |
|-------|-------|
| **Version** | `0.1.0-docs` |
| **Module** | Ecommerce |
| **Change Type** | Added |
| **Reason** | Phase 1 module — documentation structure created |
| **Impact** | 39 menu screen docs, 8 module docs, ModuleManifest |
| **Developer Notes** | All screen docs are Draft; fill before marking Ready |

---

### Added — 2026-06-12 — Platform

| Field | Value |
|-------|-------|
| **Version** | `0.1.0-docs` |
| **Module** | Platform |
| **Change Type** | Added |
| **Reason** | Initial documentation hub and Ecommerce doc tree |
| **Impact** | `docs/` root structure, standards, templates |
| **Developer Notes** | No application code exists yet |

---

## Template (copy for new entries)

```markdown
### {Change Type} — {YYYY-MM-DD} — {Module}

| Field | Value |
|-------|-------|
| **Version** | `{semver}` |
| **Module** | {Module Name} |
| **Change Type** | Added / Modified / Deleted |
| **Reason** | {Why} |
| **Impact** | {What is affected} |
| **Developer Notes** | {Migration, tasks, warnings} |
```
