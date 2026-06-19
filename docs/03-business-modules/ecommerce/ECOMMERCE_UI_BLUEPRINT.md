# AgainERP — Ecommerce Module UI Blueprint

> **Status:** Active — **Ecommerce Admin UI SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 17 — Ecommerce UI Design  
> **Module:** Ecommerce · Route prefix `/ecommerce`  
> **Governance:** [FINAL_UI_ARCHITECTURE_LOCK.md](../../FINAL_UI_ARCHITECTURE_LOCK.md) — APPROVED  
> **Components:** [COMPONENT_UI_BLUEPRINT.md](../../04-uiux/standards/COMPONENT_UI_BLUEPRINT.md)  
> **Architecture:** [Architecture.md](./Architecture.md) · **Navigation index:** [UI.md](./UI.md)

**Documentation only.** No mockups · No Figma · No code.

> **Note:** [UI.md](./UI.md) indexes 167 screens across 13 menu groups (`MENU_STRUCTURE.md`). This blueprint defines the **locked design-system UI** for Step 17 scope — navigation simplification, layouts, components, and interactions. Full screen inventory remains in `Menus/`.

---

## Purpose

Define the **complete Ecommerce Admin UI** — navigation, pages, layouts, components, interactions, responsive rules, and AI features — using the approved AgainERP design system.

**Out of scope:** Storefront (customer-facing shop) — see [ECOMMERCE_STOREFRONT_ARCHITECTURE.md](./ECOMMERCE_STOREFRONT_ARCHITECTURE.md). Admin only.

---

## Scope (from architecture)

| In scope | Out of scope |
|----------|--------------|
| Admin dashboard · catalog · orders · customers | Public storefront checkout UI |
| Marketing · SEO · media · reviews (moderation) | GL posting logic (Accounting) |
| Reports · AI tools · store settings | Stock execution (Inventory module UI) |
| Builder screens (referenced under Settings/Content) | Duplicate Core entity CRUD |

**Data rules:**

- Customers = Core `contacts` — API `/api/v1/core/contacts`
- Media = Core Media Library — API `/api/v1/core/media`
- Products/orders = `ecommerce_*` namespace · API `/api/v1/ecommerce/`
- Permissions namespace: `ecommerce.*`

**Cross-module effects (UI links only):** Place order → Sales order · payment → Accounting · return → Inventory restock.

---

## 1. Navigation

### 1.1 Global placement

| Property | Value |
|----------|-------|
| Sidebar group | **Business Operations** or **Commerce** (`nav.commerce`) |
| Module root | `/ecommerce` |
| Module access permission | `ecommerce.access` |
| Quick actions | Add Product · View Orders (manifest) |

### 1.2 Module navigation (Level 2 — Zone B)

Step 17 approved top-level tabs:

| Tab | ID | Route | Visible |
|-----|-----|-------|---------|
| **Dashboard** | `WS-MODNAV-DASH` | `/ecommerce/dashboard` | Always |
| **Catalog** | `WS-MODNAV-CAT` | `/ecommerce/catalog/*` | Always |
| **Customers** | `WS-MODNAV-CUS` | `/ecommerce/customers` | Always |
| **Orders** | `WS-MODNAV-ORD` | `/ecommerce/orders` | Always |
| **Marketing** | `WS-MODNAV-MKT` | `/ecommerce/marketing/*` | Permission-gated |
| **SEO** | `WS-MODNAV-SEO` | `/ecommerce/seo/*` | Permission-gated |
| **Media** | `WS-MODNAV-MED` | `/ecommerce/media` | Always |
| **Reports** | `WS-MODNAV-RPT` | `/ecommerce/reports` | When reports exist |
| **AI** | `WS-MODNAV-AI` | `/ecommerce/ai/*` | When AI module on |
| **Settings** | `WS-MODNAV-SET` | `/ecommerce/settings/*` | Store Admin |

> **Extended inventory:** Inventory, Content, Builder, and System screens from [UI.md](./UI.md) map under Catalog (inventory views), Marketing/Content (builder), and Settings respectively — not duplicated as top-level tabs in this blueprint.

### 1.3 Catalog menu (Level 3)

| Screen | Route | Permission | Entity |
|--------|-------|------------|--------|
| **Products** | `/ecommerce/catalog/products` | `ecommerce.catalog.products.view` | `ecommerce_products` |
| **Categories** | `/ecommerce/catalog/categories` | `ecommerce.catalog.categories.view` | Categories tree |
| **Brands** | `/ecommerce/catalog/brands` | `ecommerce.catalog.brands.view` | Brands |
| **Attributes** | `/ecommerce/catalog/attributes` | `ecommerce.catalog.attributes.view` | Attribute profiles |
| **Reviews** | `/ecommerce/catalog/reviews` | `ecommerce.catalog.reviews.view` | Reviews (moderation) |

### 1.4 Command palette (conceptual)

| Command ID | Label | Route |
|------------|-------|-------|
| `ecommerce.products.create` | Add Product | `/ecommerce/catalog/products?create=1` |
| `ecommerce.orders.list` | View Orders | `/ecommerce/orders` |
| `ecommerce.dashboard` | Ecommerce Dashboard | `/ecommerce/dashboard` |
| `ecommerce.seo.audit` | SEO Audit | `/ecommerce/seo/audit` |

---

## 2. Pages & Layouts

| Page | Layout ID | Route | Primary components |
|------|-----------|-------|-------------------|
| Ecommerce Dashboard | `LAYOUT-DASHBOARD` | `/ecommerce/dashboard` | `WS-CONTENT-DASH` |
| Product List | `LAYOUT-LIST` | `/ecommerce/catalog/products` | `DS-DATAGRID` / `DS-CARD-LIST` |
| Product Detail | `LAYOUT-DETAILS` | `/ecommerce/catalog/products?view=` | Full page default (10 tabs) |
| Category / Brand / Attribute lists | `LAYOUT-LIST` | `/ecommerce/catalog/*` | Tree or grid |
| Order List | `LAYOUT-LIST` | `/ecommerce/orders` | `DS-DATAGRID` |
| Order Detail | `LAYOUT-DETAILS` | `/ecommerce/orders?view=` | Drawer or full page |
| Customer List | `LAYOUT-LIST` | `/ecommerce/customers` | Core contacts |
| Customer Detail | `LAYOUT-DETAILS` | `/ecommerce/customers?view=` | Full page default |
| SEO screens | `LAYOUT-ANALYTICS` / `LAYOUT-SETTINGS` | `/ecommerce/seo/*` | Forms + audit panels |
| Media Library | `LAYOUT-MEDIA` | `/ecommerce/media` | Grid + folders |
| Marketing | `LAYOUT-LIST` / forms | `/ecommerce/marketing/*` | Coupons · campaigns |
| Reports | `LAYOUT-ANALYTICS` | `/ecommerce/reports/*` | Charts + export |
| AI tools | `LAYOUT-AI-TOOL` | `/ecommerce/ai/*` | Prompt + preview |
| Settings | `LAYOUT-SETTINGS` | `/ecommerce/settings/*` | Section forms |

**CRUD rule (locked):** `?create=1` · `?view={id}` · `?edit={id}` — no `/new` or `/[id]/edit`.

**Complex entities:** Products and orders use **full-page detail** by default (many tabs / line items). Drawer optional for quick view on desktop.

---

## 3. Ecommerce Dashboard UI

**Route:** `/ecommerce/dashboard` · **Template:** `tpl.module.standard`

### 3.1 Sections

| Order | Section | Widget ID (example) | Category | Col span |
|-------|---------|---------------------|----------|----------|
| 1 | **Revenue** | `ecommerce.revenue` | `kpi` | 4 |
| 2 | **Orders** | `ecommerce.orders-kpi` | `kpi` | 4 |
| 3 | **Customers** | `ecommerce.customers-kpi` | `kpi` | 4 |
| 4 | **Products** | `ecommerce.products-kpi` | `kpi` | 4 |
| 5 | **Conversion Rate** | `ecommerce.conversion-rate` | `chart` | 4 |
| 6 | **Traffic** | `ecommerce.traffic` | `chart` | 8 |
| 7 | **Top Products** | `ecommerce.top-products` | `table` | 6 |
| 8 | **Recent Orders** | `ecommerce.recent-orders` | `table` | 6 |
| 9 | **AI Insights** | `ecommerce.ai-insights` | `ai` | 12 |
| 10 | **Quick Actions** | `ecommerce.quick-actions` | `quick_action` | 4 |

Meets locked module dashboard: Overview · KPI (≥3) · Activities · Reports · AI · Quick Actions.

### 3.2 Quick actions

| Action | Route |
|--------|-------|
| Add Product | `/ecommerce/catalog/products?create=1` |
| View Orders | `/ecommerce/orders` |
| SEO Audit | `/ecommerce/seo/audit` |
| Abandoned Carts | `/ecommerce/marketing/abandoned-cart` |

### 3.3 Widget drill-down

| Widget | Click |
|--------|-------|
| Revenue | `/ecommerce/reports/sales` |
| Recent Orders row | `/ecommerce/orders?view={id}` |
| Top Products row | `/ecommerce/catalog/products?view={id}` |

---

## 4. Product List UI

**Route:** `/ecommerce/catalog/products` · **Layout:** `LAYOUT-LIST`

### 4.1 Page chrome

```text
Breadcrumb: Ecommerce › Catalog › Products
Header: Products · [Import] [Export ▾] [Mass Update ▾] [+ Add Product]
Toolbar: [Search] [Filters ▾] [Saved Views ▾]
Bulk bar: Publish · Unpublish · Delete · Export · Mass Update
Grid / Card list · Pagination · Detail (full page)
```

### 4.2 Features & components

| Feature | Component |
|---------|-----------|
| **Search** | `DS-INPUT-SEARCH` — name · SKU · barcode |
| **Advanced Filters** | `DS-FILTER-BAR` + filter drawer |
| **Brand Filters** | `DS-SELECT-MULTI` — brand |
| **Category Filters** | Tree multi-select |
| **Status Filters** | `DS-TAG` — Draft · Published · Archived |
| **Stock Filters** | In stock · low stock · out of stock (Inventory API) |
| **Bulk Actions** | `DS-BULK-BAR` — publish · unpublish · delete |
| **Import** | `DS-IMPORT-MENU` — CSV · progress modal |
| **Export** | `DS-EXPORT-MENU` — CSV · Excel |
| **Mass Update** | `DS-MODAL` — field picker · preview · apply |

### 4.3 Columns

| Column | Notes |
|--------|-------|
| Image thumb | 40px · from Media Library |
| Name · SKU | Primary link → `?view=` |
| Category · Brand | |
| Price | Right-aligned · store currency |
| Stock | Badge · link to Inventory if module on |
| Status | `DS-BADGE-STATUS` |
| Updated | Sortable |

### 4.4 Row actions

| Action | Permission |
|--------|------------|
| Publish / Unpublish | `ecommerce.catalog.products.publish` |
| Duplicate | create |
| Preview storefront | opens storefront URL (new tab) |
| Delete | draft only · confirm modal |

---

## 5. Product Details UI

**Route:** `/ecommerce/catalog/products?view={id}` · **Full page default** · Zone E context panel.

### 5.1 Layout

Header · Smart Buttons · Tabs · Right Context Panel (desktop).

### 5.2 Header

| Element | Content |
|---------|---------|
| Title | Product name |
| Status | `DS-BADGE-STATUS` — Draft / Published |
| SKU | Subtitle |
| Actions | [Save] [Publish] [Preview] [⋯] |

### 5.3 Smart buttons

| Button | Links to |
|--------|----------|
| Variants | Variants tab · count badge |
| Orders | Filtered order list for product |
| Reviews | Reviews tab · avg rating |
| Inventory | Stock levels (Inventory module) |
| SEO Score | SEO tab · audit indicator |

### 5.4 Tabs

| Tab | Content | Component |
|-----|---------|-----------|
| **General** | Name · description · category · brand · tags · status | Form sections |
| **Pricing** | Base price · compare-at · cost (if permitted) · tax class | Money inputs |
| **Inventory** | SKU · barcode · track stock · qty (read/sync Inventory) | `DS-INPUT-NUMBER` |
| **Images** | Gallery · primary image | Media picker → Core media |
| **Attributes** | Attribute profile · spec fields | Dynamic form |
| **Variants** | Variant matrix · per-variant price/stock | Embedded `DS-DATAGRID` |
| **SEO** | Meta title · description · slug · preview | SEO fields |
| **Marketing** | Related coupons · featured · collections | Relation pickers |
| **Reviews** | Moderation list · reply | Embedded list |
| **History** | Publish log · price changes · audit | `DS-TIMELINE` |

### 5.5 Right context panel (Zone E)

| Panel | Content |
|-------|---------|
| Activity | Recent edits · publish events |
| AI suggestions | `DS-AI-SUGGESTIONS` — description · tags · SEO |
| Related | Cross-sell links |

**Create flow:** `/ecommerce/catalog/products?create=1` — same layout · General tab first · Save enables other tabs.

---

## 6. Category, Brand, Attribute Lists

| Entity | Route | Layout notes |
|--------|-------|--------------|
| **Categories** | `/ecommerce/catalog/categories` | Tree view desktop · list mobile · drawer CRUD |
| **Brands** | `/ecommerce/catalog/brands` | List + logo column · drawer |
| **Attributes** | `/ecommerce/catalog/attributes` | Profile list · drawer for attribute sets |
| **Reviews** | `/ecommerce/catalog/reviews` | Moderation queue · status filters · approve/reject |

All follow `LAYOUT-LIST` + drawer CRUD unless tree editor requires inline expand (categories).

---

## 7. Order Management UI

**Route:** `/ecommerce/orders` · Entity: `ecommerce_orders`

### 7.1 Order statuses

| Status | Display token | Meaning |
|--------|---------------|---------|
| **Pending** | `--status-pending` | Awaiting payment / confirmation |
| **Confirmed** | `--status-info` | Paid or confirmed |
| **Processing** | `--status-info` | Pick/pack in progress |
| **Shipped** | `--status-warning` | In transit |
| **Delivered** | `--status-success` | Completed delivery |
| **Cancelled** | `--status-danger` | Voided |
| **Returned** | `--status-danger` | Return initiated/completed |

### 7.2 Order list

`DS-DATAGRID` — order # · customer · date · total · payment status · shipping status · order status.

Filters: status · payment · shipping · date · customer.

### 7.3 Order detail layout

**Route:** `/ecommerce/orders?view={id}` · Drawer quick view · full page for fulfillment.

| Section | Component | Content |
|---------|-----------|---------|
| **Header** | Status badges × 3 | Order · payment · shipping |
| **Customer Summary** | Card block | Contact · email · ship/bill addresses |
| **Order Timeline** | `DS-TIMELINE` | Status changes · payment · shipment events |
| **Line items** | Tab / section | Product · qty · price · tax |
| **Payment Status** | Summary + badge | Paid · partial · refunded · gateway ref |
| **Shipping Status** | Summary + tracking | Carrier · tracking # · delivery ETA |
| **Notes** | Core notes | Internal support notes |
| **Activities** | `DS-ACTIVITY-FEED` | Follow-ups |

### 7.4 State-dependent actions

| Status | Primary actions |
|--------|-----------------|
| Pending | Confirm · Cancel |
| Confirmed | Mark Processing · Cancel |
| Processing | Create Shipment · Mark Shipped |
| Shipped | Mark Delivered |
| Delivered | Initiate Return |
| Returned | Restock (links Inventory) · Refund (links Accounting) |

Permissions: `ecommerce.orders.*` per action · RBAC hide (never disable).

### 7.5 Cross-module links (UI)

| Link | Target |
|------|--------|
| Sales order | `/sales/orders?view=` when synced |
| Customer | `/ecommerce/customers?view=` |
| Payment | Accounting payment record (read-only link) |

---

## 8. Customer UI

**Route:** `/ecommerce/customers` · Core **`contacts`** (store customers)

### 8.1 Customer list

`DS-DATAGRID` — name · email · orders count · lifetime value · last order · group.

API: `/api/v1/core/contacts` with ecommerce customer filter.

### 8.2 Customer detail (full page)

**Route:** `/ecommerce/customers?view={id}`

| Tab | Content |
|-----|---------|
| **Profile** | Contact fields · customer group · addresses |
| **Orders** | Embedded order list → `?view=` |
| **Wishlist** | Saved products list |
| **Reviews** | Reviews by customer · moderation link |
| **Returns** | Return requests · status |
| **Reward Points** | Loyalty balance (Marketing module) |
| **Activity Timeline** | `DS-ACTIVITY-FEED` · abandoned cart · emails |

Smart buttons: Open orders · total spent · support tickets (if CRM on).

---

## 9. SEO UI

**Route group:** `/ecommerce/seo/*` · **Layouts:** `LAYOUT-ANALYTICS` + `LAYOUT-SETTINGS`

| Screen | Route | Components |
|--------|-------|------------|
| **SEO Dashboard** | `/ecommerce/seo` | KPI widgets · health score |
| **SEO Audit** | `/ecommerce/seo/audit` | Issue list · severity · fix links |
| **Meta Manager** | `/ecommerce/seo/meta` | Bulk meta editor · `DS-DATAGRID` |
| **Schema Manager** | `/ecommerce/seo/schema` | JSON-LD templates · entity binding |
| **URL Manager** | `/ecommerce/seo/urls` | Slug list · canonical rules |
| **Redirect Manager** | `/ecommerce/seo/redirects` | 301/302 rules · import |
| **AI SEO Assistant** | `/ecommerce/seo/ai` | `DS-AI-PANEL` · audit suggestions |

### 9.1 SEO interactions

| Interaction | Rule |
|-------------|------|
| Fix from audit | Deep link to product SEO tab |
| Bulk meta update | Preview before apply |
| Redirect test | Validate loop detection |
| AI generate | Preview → apply to entity |

Extended SEO screens (sitemap, robots, keywords) remain in `Menus/SEO/` — same component rules.

---

## 10. Marketing UI

**Route group:** `/ecommerce/marketing/*`

| Screen type | Examples | Pattern |
|-------------|----------|---------|
| List + drawer | Coupons · vouchers · flash sales | `LAYOUT-LIST` |
| Campaign builder | Email · SMS · WhatsApp | Form + preview |
| Automation | Abandoned cart · loyalty | Workflow cards |

Primary entry from Level 2 **Marketing** tab. Permission: `ecommerce.marketing.*`.

---

## 11. Media UI

**Route:** `/ecommerce/media` · **Layout:** `LAYOUT-MEDIA`

Uses Core Media Library API — Ecommerce shell only.

### 11.1 Features

| Feature | Component | Detail |
|---------|-----------|--------|
| **Media Library** | Grid + list toggle | Images · videos · documents |
| **Folders** | Tree sidebar | Nested folders · drag move |
| **Bulk Upload** | Drop zone + `DS-IMPORT-MENU` | Multi-file · progress |
| **Image Optimizer** | Tool panel | Compress · format · dimensions |
| **AI Image Tools** | `DS-AI-PANEL` | Generate · alt text · background remove |

### 11.2 Interactions

| Action | UI |
|--------|-----|
| Select for product | Picker modal from Product Images tab |
| Bulk delete | Confirm modal · usage check |
| Optimize | Batch queue · `DS-LOADING-PROGRESS` |
| CDN sync | Settings link when configured |

Sub-screens: Folders · Images · Videos · CDN · Watermark — see `Menus/Media/`.

---

## 12. AI Ecommerce UI

Register in [AI.md](./AI.md) · components **`DS-AI-*` only** · hide when AI module off.

### 12.1 Features & placement

| Feature | Component | Route / placement |
|---------|-----------|-------------------|
| **Product Generator** | `DS-AI-PANEL` | `/ecommerce/ai/product` · Product General tab |
| **SEO Generator** | `DS-AI-SUGGESTIONS` | SEO tab · `/ecommerce/ai/seo` |
| **Content Generator** | `DS-AI-PANEL` | Blog · descriptions |
| **Review Analysis** | `DS-AI-INSIGHTS` | Reviews list · dashboard |
| **Sales Forecast** | `DS-AI-INSIGHTS` | Dashboard · `/ecommerce/ai/forecast` |
| **Recommendations** | `DS-AI-SUGGESTIONS` | Product Marketing tab · customer view |

### 12.2 AI interaction rules

| Rule | Detail |
|------|--------|
| Preview required | All generative output preview before apply |
| Human publish | AI never auto-publishes products |
| Confirm destructive | AI-suggested bulk changes need confirm |
| Graceful hide | No AI module → no empty AI panels |
| Shortcut | Header AI panel `Ctrl+J` (platform) |

Extended AI menu (15 screens): `Menus/AI/` — same standards.

---

## 13. Reports UI

**Route:** `/ecommerce/reports` · **Layout:** `LAYOUT-ANALYTICS`

| Report | Route |
|--------|-------|
| Sales | `/ecommerce/reports/sales` |
| Products | `/ecommerce/reports/products` |
| Customers | `/ecommerce/reports/customers` |
| Marketing | `/ecommerce/reports/marketing` |
| SEO | `/ecommerce/reports/seo` |
| Returns | `/ecommerce/reports/returns` |
| Inventory | `/ecommerce/reports/inventory` |

`DS-EXPORT-MENU` · date range from workspace context · fiscal year aware.

Index: [Reports.md](./Reports.md).

---

## 14. Settings UI

**Route:** `/ecommerce/settings/*` · **Layout:** `LAYOUT-SETTINGS`

Consolidates System group from [UI.md](./UI.md):

| Section | Route | Content |
|---------|-------|---------|
| Store | `/ecommerce/settings/store` | Name · domain · currency |
| Payment gateways | `/ecommerce/settings/payments` | Gateway config |
| Shipping | `/ecommerce/settings/shipping` | Zones · methods |
| Taxes · localization | `/ecommerce/settings/localization` | |
| Email · SMS · WhatsApp | `/ecommerce/settings/notifications` | |
| Users · roles | Core APIs in ecommerce shell | |

Builder / theme screens: `/ecommerce/builder/*` — drag-drop canvas layout (exception to drawer CRUD — builder pattern per UI.md).

---

## 15. Mobile Ecommerce UI

### 15.1 Priority screens

| Screen | Behaviour |
|--------|-----------|
| **Dashboard** | 1-col stack — Revenue · Orders · Recent orders · Quick actions |
| **Products** | `DS-CARD-LIST` — thumb · name · price · status |
| **Orders** | Card list · status chips · tap → full-screen detail |
| **Customers** | Card list · email · order count |
| **Quick Actions** | FAB or bottom bar — Add Product · Orders |

### 15.2 Mobile rules

| Rule | Detail |
|------|--------|
| Product detail | Tabs → horizontal scroll · stack sections |
| Order fulfillment | Full-width primary actions in footer |
| Media upload | Camera + gallery picker |
| Bulk / mass update | Desktop-first · simplified mobile selection |
| SEO audit | Issue cards · swipe actions |
| Min tap | 44×44px on all actions |

Bottom nav override (optional): Dashboard · Products · Orders · More.

---

## 16. Interaction Rules (Ecommerce-specific)

| Interaction | Rule |
|-------------|------|
| Publish product | Status change · visible on storefront |
| Place order (admin) | Manual order creation · stock check |
| Stock display | Read Inventory API — no direct stock write in Ecommerce UI |
| Customer CRUD | Core contacts API — ecommerce shell |
| Media pick | Always Core media picker — no duplicate upload store |
| Coupon apply | Validation — cannot exceed subtotal |
| Order confirm | Triggers Sales + Inventory events (backend) |
| Reviews | Moderation workflow — approve before public |
| Cross-module | UUID links only — no cross-module DB in UI |
| Builder | Canvas autosave · preview · publish theme |

---

## 17. Permissions → UI

| Permission pattern | UI effect |
|--------------------|-----------|
| `ecommerce.access` | Module in sidebar |
| `ecommerce.catalog.products.view` | Product list |
| `ecommerce.catalog.products.publish` | Publish button |
| `ecommerce.orders.view` | Order list |
| `ecommerce.orders.fulfill` | Shipment actions |
| `ecommerce.marketing.*` | Marketing tab |
| `ecommerce.seo.*` | SEO tab |
| `ecommerce.settings.manage` | Settings tab |

Navigation items **hidden** when permission missing — never disabled (locked RBAC rule).

Full matrix: [Permissions.md](./Permissions.md).

---

## 18. Responsive Rules

| Screen | Desktop | Mobile |
|--------|---------|--------|
| Product list | `DS-DATAGRID` | `DS-CARD-LIST` |
| Product detail | Full page + context panel | Full screen · tabs scroll |
| Order list | `DS-DATAGRID` | `DS-CARD-LIST` |
| Order detail | Full page | Full-screen drawer |
| Media library | Grid 4–6 col | Grid 2 col |
| SEO audit | Split panel | Stacked cards |
| Dashboard | 12-col widgets | KPI → orders → AI |
| Marketing lists | `DS-DATAGRID` | `DS-CARD-LIST` |

Tables switch to card list per [RESPONSIVE_UI_STANDARD.md](../../04-uiux/standards/RESPONSIVE_UI_STANDARD.md).

---

## 19. Menus Spec Index (existing)

167 screen specs under `Menus/` — each must declare:

| Field | Value source |
|-------|--------------|
| `layout_id` | This blueprint §2 |
| `context_required` | Store currency · company |
| `empty_state` | `DS-EMPTY-*` per entity |
| `loading` | `DS-LOADING-SKELETON` |
| Component IDs | `DS-*` / `WS-*` only |

Key screens:

| Screen | Route | layout_id |
|--------|-------|-----------|
| Products | `/ecommerce/catalog/products` | `LAYOUT-LIST` / `LAYOUT-DETAILS` |
| Orders | `/ecommerce/orders` | `LAYOUT-LIST` / `LAYOUT-DETAILS` |
| Customers | `/ecommerce/customers` | `LAYOUT-LIST` / `LAYOUT-DETAILS` |
| Dashboard | `/ecommerce/dashboard` | `LAYOUT-DASHBOARD` |
| Media | `/ecommerce/media` | `LAYOUT-MEDIA` |

---

## 20. Compliance Checklist

- [ ] Drawer / full-page CRUD per entity complexity — no `/new` routes
- [ ] `DS-*` / `WS-*` components only
- [ ] Dashboard widgets in ModuleManifest
- [ ] Customers + media via Core APIs
- [ ] Mobile card fallback on all lists
- [ ] AI via `DS-AI-*` only · graceful hide
- [ ] Align `Menus/` specs with this blueprint
- [ ] Storefront separated from admin routes

---

## 21. Relationship to UI.md

| Document | Role |
|----------|------|
| **This blueprint** | Locked design-system UI SSOT (Step 17) |
| [UI.md](./UI.md) | Navigation index · 13 groups · 167 screens |
| [MENU_STRUCTURE.md](./MENU_STRUCTURE.md) | Full menu tree |
| `Menus/*` | Per-screen build specs |

When conflicts arise, **FINAL_UI_ARCHITECTURE_LOCK** wins for interaction patterns; this blueprint wins for component/layout choices; `Menus/` wins for field-level screen detail.

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 17 — Ecommerce admin UI blueprint |

---

**Ecommerce UI Blueprint** — store admin UI · design-system compliant · prototype-ready.
