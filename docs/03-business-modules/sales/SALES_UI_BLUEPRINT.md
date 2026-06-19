# AgainERP — Sales Module UI Blueprint

> **Status:** Active — **Sales UI SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 16 — Sales UI Design  
> **Module:** Sales · Route prefix `/sales`  
> **Governance:** [FINAL_UI_ARCHITECTURE_LOCK.md](../../FINAL_UI_ARCHITECTURE_LOCK.md) — APPROVED  
> **Components:** [COMPONENT_UI_BLUEPRINT.md](../../04-uiux/standards/COMPONENT_UI_BLUEPRINT.md)  
> **Architecture:** [Architecture.md](./Architecture.md) · [SALES_MODULE_ARCHITECTURE.md](./SALES_MODULE_ARCHITECTURE.md)

**Documentation only.** No mockups · No Figma · No code.

> **Note:** `UI.md` is not yet present in the Sales module package — this blueprint is the UI SSOT until `UI.md` is generated from it.

---

## Purpose

Define the **complete Sales module UI** — navigation, pages, layouts, components, interactions, responsive rules, and AI features — using the locked AgainERP design system.

## Scope (from architecture)

| In scope | Out of scope |
|----------|--------------|
| Quotations · sales orders · delivery notes | Online cart/checkout (Ecommerce) |
| Customer invoices · credit notes | GL posting UI (Accounting) |
| Payment allocations (read/link) | Stock movement execution (Inventory) |
| Customer views (Core `contacts`) | Payment gateway capture |
| Sales reports | POS register UI |

**Document lifecycle:** Quotation → Order → Delivery → Invoice · Returns via credit notes.

**Data rule:** Customers are Core `contacts` — no `sales_customers` table. Product lines FK to `catalog_product_variants`.

---

## 1. Navigation

### 1.1 Global placement

| Property | Value |
|----------|-------|
| Sidebar group | **Business Operations** (`nav.business-ops`) |
| Module root | `/sales` |
| Module access permission | `sales.access` |
| Quick actions | Create Quotation · Create Order (manifest) |

### 1.2 Module navigation (Level 2 — Zone B)

| Tab | ID | Route | Visible |
|-----|-----|-------|---------|
| **Dashboard** | `WS-MODNAV-DASH` | `/sales/dashboard` | Always |
| **Operations** | `WS-MODNAV-OPS` | (ops routes) | Always |
| **Reports** | `WS-MODNAV-RPT` | `/sales/reports` | When reports exist |
| **Automation** | `WS-MODNAV-AUTO` | `/sales/automation` | Workflows / approvals |
| **Settings** | `WS-MODNAV-SET` | `/sales/settings` | When configurable |

### 1.3 Operations menu (Level 3)

| Screen | Route | Permission | Entity |
|--------|-------|------------|--------|
| **Quotations** | `/sales/quotations` | `sales.quotations.view` | `sales_quotations` |
| **Orders** | `/sales/orders` | `sales.orders.create` / view | `sales_orders` |
| **Invoices** | `/sales/invoices` | `sales.invoices.post` / view | `sales_invoices` |
| **Customers** | `/sales/customers` | `sales.quotations.view` | Core `contacts` |
| **Payments** | `/sales/payments` | `sales.invoices.post` | `sales_payment_allocations` |
| **Returns** | `/sales/returns` | `sales.orders.create` | `sales_credit_notes` |

### 1.4 Command palette (conceptual)

| Command ID | Label | Route |
|------------|-------|-------|
| `sales.quotations.create` | Create Quotation | `/sales/quotations?create=1` |
| `sales.orders.create` | Create Sales Order | `/sales/orders?create=1` |
| `sales.dashboard` | Sales Dashboard | `/sales/dashboard` |

---

## 2. Pages & Layouts

| Page | Layout ID | Route | Primary components |
|------|-----------|-------|-------------------|
| Sales Dashboard | `LAYOUT-DASHBOARD` | `/sales/dashboard` | `WS-CONTENT-DASH` |
| Quotation List | `LAYOUT-LIST` | `/sales/quotations` | `DS-DATAGRID` / `DS-CARD-LIST` |
| Quotation Detail | `LAYOUT-DETAILS` | `/sales/quotations?view=` | `DS-DRAWER-CRUD` + tabs |
| Order List | `LAYOUT-LIST` | `/sales/orders` | `DS-DATAGRID` |
| Order Detail | `LAYOUT-DETAILS` | `/sales/orders?view=` | Drawer or full page (line items) |
| Invoice List | `LAYOUT-LIST` | `/sales/invoices` | `DS-DATAGRID` |
| Invoice Detail | `LAYOUT-DETAILS` | `/sales/invoices?view=` | Drawer / full page |
| Customer Sales View | `LAYOUT-DETAILS` | `/sales/customers?view=` | Full page default |
| Payments | `LAYOUT-LIST` | `/sales/payments` | Allocation list |
| Returns | `LAYOUT-LIST` | `/sales/returns` | Credit note list |
| Reports | `LAYOUT-ANALYTICS` | `/sales/reports` | Charts + tables |
| Settings | `LAYOUT-SETTINGS` | `/sales/settings/*` | Form sections |

**CRUD rule (locked):** `?create=1` · `?view={id}` · `?edit={id}` — no `/new` or `/[id]/edit`.

**Complex documents:** Quotations and orders with many line items may use **full-page detail** when drawer exceeds 640px or >4 tabs — per PAGE_LAYOUT standard.

---

## 3. Sales Dashboard UI

**Route:** `/sales/dashboard` · **Template:** `tpl.module.standard`

### 3.1 Sections

| Order | Section | Widget ID (example) | Category | Col span |
|-------|---------|---------------------|----------|----------|
| 1 | **Revenue Overview** | `sales.revenue-overview` | `kpi` | 4×3 |
| 2 | **Quotation Pipeline** | `sales.quotation-pipeline` | `chart` | 8 |
| 3 | **Order Status** | `sales.order-status` | `chart` / `kpi` | 6 |
| 4 | **Top Customers** | `sales.top-customers` | `table` | 6 |
| 5 | **Recent Orders** | `sales.recent-orders` | `table` | 8 |
| 6 | **Pending Payments** | `sales.pending-payments` | `alert` / `list` | 4 |
| 7 | **AI Sales Insights** | `sales.ai-insights` | `ai` | 12 |
| 8 | **Quick Actions** | `sales.quick-actions` | `quick_action` | 4 |

Meets locked module dashboard: Overview · KPI (≥3) · Activities · Tasks · Reports · AI · Quick Actions.

### 3.2 Quick actions

| Action | Route |
|--------|-------|
| Create Quotation | `/sales/quotations?create=1` |
| Create Order | `/sales/orders?create=1` |
| Create Invoice | `/sales/invoices?create=1` (from order preferred) |
| View Overdue Invoices | `/sales/invoices?filter=overdue` |

### 3.3 Widget drill-down

| Widget | Click |
|--------|-------|
| Revenue Overview | `/sales/reports/revenue` |
| Recent Orders row | `/sales/orders?view={id}` |
| Pending Payments | `/sales/payments?filter=open` |

---

## 4. Quotation List UI

**Route:** `/sales/quotations` · **Layout:** `LAYOUT-LIST`

### 4.1 Page chrome

```text
Breadcrumb: Sales › Quotations
Header: Quotations · [Import] [Export ▾] [+ Create Quotation]
Toolbar: [Search] [Filters ▾] [Saved Views ▾]
Bulk bar: Send · Convert to Order · Delete · Export
Grid / Card list · Pagination · Drawer
```

### 4.2 Features & components

| Feature | Component |
|---------|-----------|
| **Search** | `DS-INPUT-SEARCH` — quote # · customer · reference |
| **Advanced Filters** | `DS-FILTER-BAR` + filter drawer |
| **Status Filters** | `DS-TAG` — Draft · Sent · Accepted · Expired · Cancelled |
| **Customer Filters** | `DS-SELECT-RELATION` — Core contact |
| **Date Filters** | Date range — quote date · expiry |
| **Saved Views** | Named presets dropdown |
| **Bulk Actions** | `DS-BULK-BAR` — send · convert · delete |
| **Import** | `DS-IMPORT-MENU` — CSV lines (optional) |
| **Export** | `DS-EXPORT-MENU` — CSV · Excel · PDF |

### 4.3 Columns

| Column | Notes |
|--------|-------|
| Quote # | `SQ-*` · primary link |
| Customer | Contact name |
| Date · Expiry | |
| Total | Right-aligned · currency from context |
| Status | `DS-BADGE-STATUS` |
| Sales rep | Owner |
| CRM link | Opportunity ref (optional column) |

### 4.4 Key actions (row ⋯)

| Action | Permission |
|--------|------------|
| Send PDF | `sales.quotations.view` |
| Convert to Order | `sales.orders.create` |
| Duplicate | create |
| Cancel | approve if needed |

---

## 5. Quotation Details UI

**Route:** `/sales/quotations?view={id}` · Drawer default · full page if many lines.

### 5.1 Layout

Header · Smart Buttons · Tabs · Zone E activity panel (desktop).

### 5.2 Header

| Element | Content |
|---------|---------|
| Title | Quotation `SQ-{number}` |
| Status | `DS-BADGE-STATUS` |
| Customer | Linked contact |
| Actions | [Edit] [Send] [Convert to Order] [⋯] |

**Convert to Order:** `DS-MODAL` confirm → POST convert → navigate to new order.

### 5.3 Smart buttons

| Button | Links to |
|--------|----------|
| Order | Linked SO if converted |
| CRM Opportunity | `/crm/pipeline?view=` |
| Activities | Activities tab |
| Margin | Pricing tab (if `sales.pricing.view_cost`) |

### 5.4 Tabs

| Tab | Content | Component |
|-----|---------|-----------|
| **Overview** | Header fields · dates · terms | Form sections |
| **Items** | Line grid — product · qty · price · tax · discount | Embedded `DS-DATAGRID` |
| **Pricing** | Subtotal · tax · total · discount summary | Read-only summary |
| **Customer** | Bill-to · ship-to · addresses | `DS-SELECT-RELATION` |
| **Activities** | Timeline | `DS-ACTIVITY-FEED` |
| **Notes** | Internal notes | Core notes |
| **Attachments** | Signed PDF · PO | `DS-ATTACHMENTS` |
| **History** | Revisions · status audit | `DS-TIMELINE` |

### 5.5 Line items (Items tab)

| Column | Component |
|--------|-----------|
| Product | `DS-SELECT-RELATION` → catalog variant |
| Qty · UoM | `DS-INPUT-NUMBER` |
| Unit price | Money input |
| Discount | % or amount |
| Tax | From tax engine |
| Line total | Computed |

Quick add row · inline edit on desktop.

---

## 6. Sales Order UI

**Route:** `/sales/orders` · Entity: `sales_orders`

### 6.1 Workflow statuses

| Status | Display token | Meaning |
|--------|---------------|---------|
| **Draft** | `--status-draft` | Editable · not confirmed |
| **Confirmed** | `--status-pending` | Stock reserve triggered |
| **Processing** | `--status-info` | Delivery in progress |
| **Completed** | `--status-success` | Delivered / fulfilled |
| **Cancelled** | `--status-danger` | Voided |

History in `sales_order_status_history` → **History** tab / timeline.

### 6.2 Status display

| Location | UI |
|----------|-----|
| List column | `DS-BADGE-STATUS` |
| Detail header | Badge + workflow step indicator (optional horizontal steps) |
| Dashboard | Order Status widget chart |

### 6.3 Action buttons (header — state-dependent)

| Status | Primary action | Secondary |
|--------|----------------|-----------|
| Draft | **Confirm Order** (`DS-BTN-PRIMARY`) | Edit · Cancel |
| Confirmed | **Create Delivery** | Create Invoice |
| Processing | **Complete Delivery** | View deliveries |
| Completed | **Create Invoice** | View invoice |
| Cancelled | — | Duplicate order |

| Action | Permission | Notes |
|--------|------------|-------|
| Confirm | `sales.orders.create` + credit check | Idempotency key |
| Approve discount | `sales.orders.approve` | Workflow gate |
| Cancel | confirm modal | |

### 6.4 Timeline & activity

| Surface | Content |
|---------|---------|
| **Timeline** tab | Status changes · delivery events · invoice posted |
| **Activities** tab | Calls · meetings · tasks (Core) |
| Zone E | `WS-CONTEXT-ACTIVITY` |

### 6.5 Order detail structure

Same tab pattern as quotation: Overview · Items · Pricing · Customer · Deliveries (sub-tab) · Invoices link · Activities · Notes · Attachments · History.

**Deliveries:** List of `sales_delivery_notes` · create from confirmed order.

---

## 7. Invoice UI

**Route:** `/sales/invoices` · Entity: `sales_invoices`

### 7.1 List columns

Invoice # · Customer · Order ref · Date · Due date · Total · **Payment status** · Posted status

### 7.2 Invoice detail layout

| Section | Component | Content |
|---------|-----------|---------|
| **Invoice Summary** | Overview tab | INV- number · dates · totals · tax |
| **Payment Status** | Header badge + summary block | Paid · Partial · Overdue · Unpaid |
| **Due Date** | Prominent in header | Highlight if overdue (`DS-ALERT-WARNING`) |
| **Transaction History** | Tab or sub-section | `sales_payment_allocations` · accounting payments |
| **Attachments** | `DS-ATTACHMENTS` | PDF · signed docs |

### 7.3 Invoice actions

| Action | Permission | UI |
|--------|------------|-----|
| Post to Accounting | `sales.invoices.post` | Primary when draft posted |
| Send to customer | view | Email PDF |
| Record payment | links to Accounting/payments | |
| Credit note | creates return | `/sales/returns?create=1` |

### 7.4 Payment status display

| Status | Badge |
|--------|-------|
| Unpaid | `--status-pending` |
| Partial | `--status-warning` |
| Paid | `--status-success` |
| Overdue | `--status-danger` |

---

## 8. Customer Sales View

**Route:** `/sales/customers` (list) · `/sales/customers?view={id}` (detail)

Uses Core **`contacts`** — customer type filter.

### 8.1 Customer profile (full page default)

| Section | Content |
|---------|---------|
| **Customer Profile** | Contact fields · credit limit · payment terms |
| **Smart buttons** | Open orders · overdue · lifetime revenue |

### 8.2 Tabs

| Tab | Content |
|-----|---------|
| **Overview** | Profile + addresses |
| **Orders** | Embedded order list → `?view=` |
| **Invoices** | Invoice list · payment status |
| **Payments** | Allocation history |
| **Returns** | Credit notes |
| **Activity Timeline** | `DS-ACTIVITY-FEED` + sales events |
| **AI Recommendations** | `DS-AI-INSIGHTS` — upsell · churn |

### 8.3 List UI (`/sales/customers`)

`DS-DATAGRID` — name · company · open orders · AR balance (API) · last order date.

---

## 9. Payments UI

**Route:** `/sales/payments`

| Feature | Detail |
|---------|--------|
| List | Allocations linking invoices ↔ `accounting_payments` |
| Filters | Open · matched · date · customer |
| Row click | Invoice detail drawer |
| Create | Redirect to Accounting payment entry (cross-module link) — no duplicate payment form in Sales if Accounting owns capture |

Read-only emphasis in Sales — **allocation view** primary.

---

## 10. Returns UI

**Route:** `/sales/returns` · Entity: `sales_credit_notes`

| Feature | Detail |
|---------|--------|
| List | Credit note # · invoice ref · customer · amount · status |
| Create | `?create=1` from invoice context preferred |
| Detail | Lines · reason · link to original invoice |

---

## 11. AI Sales UI

Register in module `AI.md` · components `DS-AI-*` only.

### 11.1 Features & placement

| Feature | Component | Placement |
|---------|-----------|-----------|
| **Revenue Forecast** | `DS-AI-INSIGHTS` / chart narrative | Dashboard · Reports |
| **Upsell Suggestions** | `DS-AI-SUGGESTIONS` | Customer detail · order drawer |
| **Cross-Sell Suggestions** | `DS-AI-SUGGESTIONS` | Quotation Items tab |
| **Risk Detection** | `DS-AI-INSIGHTS` | Invoice list overdue · customer profile |
| **Customer Insights** | `DS-AI-BRIEFING` | Customer detail AI tab |
| **Next Best Action** | `DS-AI-SUGGESTIONS` | Dashboard widget · header AI panel |

### 11.2 AI actions

| Action | UI | Confirm |
|--------|-----|---------|
| Suggest quote line items | Toolbar on Items tab | Preview table |
| Draft follow-up email | Quotation Send flow | Preview |
| Flag churn risk | Badge on customer list | — |
| Optimize discount | Approval workflow hint | Human approve |

### 11.3 CRM integration (UI)

| Trigger | UI |
|---------|-----|
| CRM opportunity won | Banner on opportunity → "Create Quotation" |
| Quote accepted | CRM opportunity marked won (backend event) |

---

## 12. Reports UI

**Route:** `/sales/reports` · **Layout:** `LAYOUT-ANALYTICS`

| Report | Route |
|--------|-------|
| Revenue by period | `/sales/reports/revenue` |
| Quotation conversion | `/sales/reports/quotations` |
| Order fulfillment | `/sales/reports/orders` |
| AR aging | `/sales/reports/ar-aging` |
| Sales by customer | `/sales/reports/customers` |
| Sales by product | `/sales/reports/products` |

`DS-EXPORT-MENU` · fiscal year from workspace context.

---

## 13. Settings UI

**Route:** `/sales/settings` · Permission: module settings manage

| Section | Content |
|---------|---------|
| Document numbering | SQ / SO / INV prefixes |
| Price lists | `sales_price_lists` |
| Default payment terms | |
| Order approval rules | Workflow linkage |
| Quotation expiry defaults | |

---

## 14. Mobile Sales UI

### 14.1 Priority screens

| Screen | Behaviour |
|--------|-----------|
| **Dashboard** | 1-col — Revenue KPI · pending payments · recent orders |
| **Quotation List** | `DS-CARD-LIST` — # · customer · total · status |
| **Orders** | Card list · tap → full-screen drawer |
| **Invoices** | Card list · overdue highlighted |
| **Quick Actions** | Bottom Create → Quotation / Order |

### 14.2 Mobile rules

| Rule | Detail |
|------|--------|
| Line items | Items tab scroll · simplified columns |
| Confirm order | Full-width primary in drawer footer |
| Bulk actions | Long-press selection |
| Bottom nav override | Dashboard · Orders · Quotations · More |
| Complex quote | Prefer full-page on tablet+ |

---

## 15. Interaction Rules (Sales-specific)

| Interaction | Rule |
|-------------|------|
| Quote → Order | Convert action · not manual re-entry |
| Order confirm | Credit limit API check · stock warning from Inventory event |
| Invoice post | Confirm modal · `sales.invoices.post` |
| Omnichannel | Show `commerce_order_id` link when present |
| Pricing cost | Margin hidden without `sales.pricing.view_cost` |
| Numbering | Read-only document numbers after save |
| Delete | Draft only — confirmed docs cancel workflow |
| Cross-module | UUID links only — no cross-module DB in UI |

---

## 16. Permissions → UI

| Permission | UI effect |
|------------|-----------|
| `sales.access` | Module in sidebar |
| `sales.quotations.view` | Quotations · customers lists |
| `sales.orders.create` | Create quote/order · convert |
| `sales.orders.approve` | Approve button · workflow |
| `sales.invoices.post` | Post invoice · payments view |
| `sales.pricing.view_cost` | Cost/margin columns |

---

## 17. Responsive Rules

| Screen | Desktop | Mobile |
|--------|---------|--------|
| Quotation list | `DS-DATAGRID` | `DS-CARD-LIST` |
| Quotation detail | Drawer 640px or full page | Full-screen drawer |
| Order list | `DS-DATAGRID` | `DS-CARD-LIST` |
| Line items grid | Full columns | Product · qty · total only |
| Dashboard | 12-col widgets | KPI → orders → payments → AI |
| Customer view | Full page + tabs | Tabs scroll · stack sections |

Min tap 44×44px on mobile actions.

---

## 18. Menus Spec Index (to create)

| Screen | Route | layout_id |
|--------|-------|-----------|
| Quotations | `/sales/quotations` | `LAYOUT-LIST` |
| Orders | `/sales/orders` | `LAYOUT-LIST` |
| Invoices | `/sales/invoices` | `LAYOUT-LIST` |
| Customers | `/sales/customers` | `LAYOUT-LIST` / `LAYOUT-DETAILS` |
| Returns | `/sales/returns` | `LAYOUT-LIST` |
| Dashboard | `/sales/dashboard` | `LAYOUT-DASHBOARD` |

Declare: `context_required` (currency critical) · `empty_state` · `loading` · `DS-*` IDs.

---

## 19. Compliance Checklist

- [ ] Drawer CRUD on all standard entity lists
- [ ] `DS-*` / `WS-*` components only
- [ ] Dashboard widgets in ModuleManifest
- [ ] Customers = Core contacts
- [ ] No Accounting/Inventory write UI in Sales
- [ ] Mobile card fallback
- [ ] AI via `DS-AI-*` only
- [ ] Generate `UI.md` from this blueprint

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 16 — Sales module UI blueprint |

---

**Sales UI Blueprint** — quote-to-cash UI · design-system compliant · prototype-ready.
