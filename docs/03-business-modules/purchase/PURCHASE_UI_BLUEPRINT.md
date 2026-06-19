# AgainERP — Purchase Module UI Blueprint

> **Status:** Active — **Purchase UI SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 20 — Purchase UI Design  
> **Module:** Purchase · Route prefix `/purchase`  
> **Governance:** [FINAL_UI_ARCHITECTURE_LOCK.md](../../FINAL_UI_ARCHITECTURE_LOCK.md) — APPROVED  
> **Components:** [COMPONENT_UI_BLUEPRINT.md](../../04-uiux/standards/COMPONENT_UI_BLUEPRINT.md)  
> **Architecture:** [Architecture.md](./Architecture.md) · [PURCHASE_MODULE_ARCHITECTURE.md](./PURCHASE_MODULE_ARCHITECTURE.md)

**Documentation only.** No mockups · No Figma · No code.

> **Note:** `UI.md` is not yet present in the Purchase module package — this blueprint is the UI SSOT until `UI.md` is generated from it. Canonical architecture: [PURCHASE_MODULE_ARCHITECTURE.md](./PURCHASE_MODULE_ARCHITECTURE.md).

---

## Purpose

Define the **complete Purchase module UI** — navigation, pages, layouts, components, interactions, responsive rules, and AI features — using the approved AgainERP design system.

## Scope (from architecture)

| In scope | Out of scope |
|----------|--------------|
| RFQ · vendor quotes · purchase orders | Vendor contact records (Core `contacts`) |
| Goods receipt coordination | Physical stock ledger (Inventory) |
| Vendor performance · three-way match prep | Payment execution (Accounting) |
| Purchase returns · vendor bills (view/link) | Product catalog definition (Catalog) |
| Purchase reports · AI procurement | Duplicate vendor master |

**Procure-to-pay flow:** RFQ → PO → Receipt → Vendor Bill

**Data rules:**

- Vendors = Core **`contacts`** with vendor type — no `purchase_vendors` table
- Product lines FK to `catalog_product_variants`
- Receipt posts to Inventory via events · `inventory_purchase_receipts` Inventory-owned
- API: `/api/v1/purchase/` · Permissions: `purchase.*`

---

## 1. Navigation

### 1.1 Global placement

| Property | Value |
|----------|-------|
| Sidebar group | **Business Operations** (`nav.business-ops`) |
| Module root | `/purchase` |
| Module access permission | `purchase.access` |
| Quick actions | Create RFQ · Create PO (manifest) |

### 1.2 Module navigation (Level 2 — Zone B)

| Tab | ID | Route | Visible |
|-----|-----|-------|---------|
| **Dashboard** | `WS-MODNAV-DASH` | `/purchase/dashboard` | Always |
| **Operations** | `WS-MODNAV-OPS` | (ops routes) | Always |
| **Reports** | `WS-MODNAV-RPT` | `/purchase/reports` | Always |
| **Automation** | `WS-MODNAV-AUTO` | `/purchase/automation` | Approvals / workflows |
| **Settings** | `WS-MODNAV-SET` | `/purchase/settings` | When configurable |

### 1.3 Operations menu (Level 3)

| Screen | Route | Permission | Entity |
|--------|-------|------------|--------|
| **Vendors** | `/purchase/vendors` | `purchase.vendors.manage` / view | Core `contacts` |
| **RFQ** | `/purchase/rfq` | `purchase.rfq.create` / view | `purchase_rfq` |
| **Purchase Orders** | `/purchase/orders` | `purchase.orders.create` / view | `purchase_orders` |
| **Receipts** | `/purchase/receipts` | `purchase.receipts.create` / view | `purchase_receipts` |
| **Bills** | `/purchase/bills` | view / Accounting link | Vendor bills (AP) |
| **Returns** | `/purchase/returns` | create / view | Purchase returns |

> **Vendor Performance** is embedded in vendor detail and dashboard widget — not a separate top-level nav item.

### 1.4 Command palette

| Command ID | Label | Route |
|------------|-------|-------|
| `purchase.rfq.create` | Create RFQ | `/purchase/rfq?create=1` |
| `purchase.orders.create` | Create Purchase Order | `/purchase/orders?create=1` |
| `purchase.dashboard` | Purchase Dashboard | `/purchase/dashboard` |
| `purchase.receipts.create` | Record Receipt | `/purchase/receipts?create=1` |

---

## 2. Pages & Layouts

| Page | Layout ID | Route | Primary components |
|------|-----------|-------|-------------------|
| Purchase Dashboard | `LAYOUT-DASHBOARD` | `/purchase/dashboard` | `WS-CONTENT-DASH` |
| Vendor List | `LAYOUT-LIST` | `/purchase/vendors` | `DS-DATAGRID` / `DS-CARD-LIST` |
| Vendor Detail | `LAYOUT-DETAILS` | `/purchase/vendors?view=` | Full page default |
| RFQ List | `LAYOUT-LIST` | `/purchase/rfq` | `DS-DATAGRID` |
| RFQ Detail | `LAYOUT-DETAILS` | `/purchase/rfq?view=` | Full page · comparison view |
| PO List | `LAYOUT-LIST` | `/purchase/orders` | `DS-DATAGRID` |
| PO Detail | `LAYOUT-DETAILS` | `/purchase/orders?view=` | Full page · line items |
| Receipt List | `LAYOUT-LIST` | `/purchase/receipts` | `DS-DATAGRID` |
| Receipt Detail | `LAYOUT-DETAILS` | `/purchase/receipts?view=` | Full page |
| Bill List | `LAYOUT-LIST` | `/purchase/bills` | `DS-DATAGRID` |
| Bill Detail | `LAYOUT-DETAILS` | `/purchase/bills?view=` | Drawer / full page |
| Returns List | `LAYOUT-LIST` | `/purchase/returns` | `DS-DATAGRID` |
| Returns Detail | `LAYOUT-DETAILS` | `/purchase/returns?view=` | Full page |
| Reports | `LAYOUT-ANALYTICS` | `/purchase/reports/*` | Charts + export |
| Settings | `LAYOUT-SETTINGS` | `/purchase/settings` | Form sections |

**CRUD rule (locked):** `?create=1` · `?view={id}` · `?edit={id}` — no `/new` or `/[id]/edit`.

**Complex documents:** RFQ (comparison), PO, receipts use **full-page detail** by default.

---

## 3. Purchase Dashboard UI

**Route:** `/purchase/dashboard`

### 3.1 Sections

| Order | Section | Widget ID | Category | Col span |
|-------|---------|-----------|----------|----------|
| 1 | **Purchase Spend** | `purchase.spend` | `kpi` / `chart` | 8 |
| 2 | **Open RFQs** | `purchase.open-rfq` | `kpi` | 4 |
| 3 | **Pending Orders** | `purchase.pending-orders` | `kpi` | 4 |
| 4 | **Pending Receipts** | `purchase.pending-receipts` | `alert` / `kpi` | 4 |
| 5 | **Vendor Performance** | `purchase.vendor-performance` | `table` | 6 |
| 6 | **Upcoming Deliveries** | `purchase.upcoming-deliveries` | `table` | 6 |
| 7 | **AI Purchase Insights** | `purchase.ai-insights` | `ai` | 12 |
| 8 | **Quick Actions** | `purchase.quick-actions` | `quick_action` | 4 |

### 3.2 Quick actions

| Action | Route |
|--------|-------|
| Create RFQ | `/purchase/rfq?create=1` |
| Create PO | `/purchase/orders?create=1` |
| Record Receipt | `/purchase/receipts?create=1` |
| View Pending Approvals | `/purchase/orders?filter=pending-approval` |

### 3.3 Widget drill-down

| Widget | Click |
|--------|-------|
| Open RFQs | `/purchase/rfq?filter=open` |
| Pending Receipts | `/purchase/receipts?filter=pending` |
| Vendor Performance row | `/purchase/vendors?view={id}` |
| Upcoming Deliveries row | `/purchase/orders?view={id}` |

---

## 4. Vendor Management UI

**Route:** `/purchase/vendors` · Core **`contacts`** (vendor type)

### 4.1 Vendor list

```text
Breadcrumb: Purchase › Vendors
Header: Vendors · [Import] [Export ▾] [+ Add Vendor]
Toolbar: [Search] [Filters ▾]
Grid / Card list · Drawer for quick view
```

| Column | Notes |
|--------|-------|
| Vendor name · code | Primary link |
| Contact · email | |
| Payment terms | `purchase_vendor_terms` |
| Open PO count | |
| Rating | `purchase_vendor_ratings` avg |
| Last order date | |

Filters: rating · terms · active · category.

**Add Vendor:** Creates/links Core contact with vendor type — not a duplicate vendor table.

### 4.2 Vendor profile (full page default)

**Route:** `/purchase/vendors?view={id}`

| Tab | Content |
|-----|---------|
| **Vendor Profile** | Core contact fields · terms · tax IDs |
| **Contacts** | Related contact persons (Core) |
| **Products** | Catalog variants supplied · last cost |
| **Purchase History** | PO list embedded → `?view=` |
| **Performance Metrics** | Lead time · quality · on-time delivery charts |
| **Documents** | `DS-ATTACHMENTS` — contracts · quotes |
| **Activities** | `DS-ACTIVITY-FEED` · ratings · notes |

Smart buttons: Open POs · overdue bills · RFQs invited.

---

## 5. RFQ UI

**Route:** `/purchase/rfq` · Entity: `purchase_rfq`

### 5.1 RFQ statuses

| Status | Display token | Meaning |
|--------|---------------|---------|
| **Draft** | `--status-draft` | Editable · not sent |
| **Sent** | `--status-info` | Vendors notified |
| **Received** | `--status-warning` | Responses incoming |
| **Approved** | `--status-success` | Award decision made |
| **Rejected** | `--status-danger` | Cancelled / no award |
| **Converted To PO** | `--status-success` | Linked PO created |

### 5.2 RFQ list

Columns: RFQ # · title · required date · vendors invited · responses · status · buyer.

Filters: status · date · buyer · vendor.

Bulk: Send · Close · Export.

### 5.3 RFQ detail (full page)

**Route:** `/purchase/rfq?view={id}`

| Section | Content |
|---------|---------|
| **Header** | RFQ # · status · required date · actions |
| **Items** | Requested lines — product · qty · specs |
| **Vendor Quotations** | Per-vendor response cards |
| **Comparison View** | Side-by-side matrix — line × vendor price · lead time · terms |
| **Approval Flow** | Workflow bar · approver · comments |
| **Timeline** | `DS-TIMELINE` — draft → sent → responses → award |
| Zone E | `DS-ACTIVITY-FEED` |

### 5.4 Comparison view UI

| Element | Component |
|---------|-----------|
| Matrix grid | `DS-DATAGRID` — sticky vendor columns |
| Best price highlight | Row min cell badge |
| Award action | Select vendor → `POST /rfq/{id}/award` → create PO |
| Export comparison | `DS-EXPORT-MENU` |

### 5.5 State-dependent actions

| Status | Primary actions |
|--------|-----------------|
| Draft | Send · Edit · Delete |
| Sent | Remind vendors · Close |
| Received | Compare · Award · Reject |
| Approved | Convert to PO |
| Converted To PO | View PO link |

Permissions: `purchase.rfq.create` · approval per workflow.

---

## 6. Purchase Order UI

**Route:** `/purchase/orders` · Entity: `purchase_orders`

### 6.1 PO statuses

| Status | Display token | Meaning |
|--------|---------------|---------|
| **Draft** | `--status-draft` | Editable |
| **Confirmed** | `--status-info` | Approved · sent to vendor |
| **Partially Received** | `--status-warning` | Some lines received |
| **Received** | `--status-success` | Fully received |
| **Cancelled** | `--status-danger` | Voided |

History in `purchase_order_status_history`.

### 6.2 PO list

Columns: PO # · vendor · date · total · status · receipt % · expected delivery.

Filters: status · vendor · date · buyer · approval pending.

### 6.3 PO detail (full page)

**Route:** `/purchase/orders?view={id}`

| Section | Tab / area |
|---------|------------|
| **Header** | PO # · status · vendor · actions |
| **Order Timeline** | `DS-TIMELINE` — confirm · approve · receipt events |
| **Items** | Lines — product · qty · price · tax · received qty |
| **Vendor Details** | Ship-from · bill-to · terms |
| **Receipts** | Linked `purchase_receipts` list |
| **Bills** | Three-way match status · AP bill links |
| **Attachments** | `DS-ATTACHMENTS` |
| **History** | Status audit · approvals |
| **Activities** | `DS-ACTIVITY-FEED` |

Smart buttons: Receipts · Bills · RFQ source · Vendor profile.

### 6.4 State-dependent actions

| Status | Primary actions |
|--------|-----------------|
| Draft | Confirm · Submit approval · Cancel |
| Confirmed | Create Receipt · Cancel (policy) |
| Partially Received | Create Receipt · View receipts |
| Received | View bills · Close |
| Cancelled | Duplicate |

Permissions: `purchase.orders.create` · `purchase.orders.approve` — buyer cannot approve own PO above limit.

---

## 7. Goods Receipt UI

**Route:** `/purchase/receipts` · Entity: `purchase_receipts`

### 7.1 Receipt list

Columns: Receipt # · PO ref · vendor · warehouse · date · status · qty progress.

Filters: PO · vendor · warehouse · date · pending QC.

Create: `?create=1` from PO context preferred (pre-filled lines).

### 7.2 Receipt detail (full page)

**Route:** `/purchase/receipts?view={id}`

| Section | Content |
|---------|---------|
| **Header** | Receipt # · PO link · vendor · status |
| **Expected Quantity** | Per line from PO |
| **Received Quantity** | Editable received qty · partial lines |
| **Quality Check** | Pass / fail / quarantine · notes |
| **Warehouse Assignment** | `DS-SELECT-RELATION` → `inventory_warehouses` · optional location |
| **Stock Impact** | Preview — on post → Inventory movement (read-only summary) |
| **Approval Status** | QC / value threshold approval |
| **Batch/Serial** | When item tracked |
| **Timeline** | Receive · QC · post events |

### 7.3 Receipt actions

| Action | Effect |
|--------|--------|
| Save draft | Local receipt record |
| Complete receipt | `purchase.receipt.completed` → Inventory |
| Reject line | QC fail · no stock post |

Permission: `purchase.receipts.create`.

---

## 8. Vendor Bill UI

**Route:** `/purchase/bills` · Three-way match preparation · AP in Accounting

### 8.1 Bill list

Columns: Bill # · vendor · PO ref · receipt ref · date · due date · total · payment status · match status.

Filters: unpaid · overdue · mismatch · vendor.

### 8.2 Bill detail

**Route:** `/purchase/bills?view={id}`

| Section | Content |
|---------|---------|
| **Bill Summary** | INV/ref · dates · totals · tax |
| **Three-way match** | PO qty/price · receipt qty · bill amount indicators |
| **Payment Status** | Paid · partial · unpaid · overdue badge |
| **Due Date** | Prominent · overdue alert |
| **Transaction History** | Payment allocations (Accounting link) |
| **Attachments** | `DS-ATTACHMENTS` — vendor invoice scan |
| **Audit Trail** | `DS-TIMELINE` · approvals |

### 8.3 Payment status display

| Status | Badge |
|--------|-------|
| Unpaid | `--status-pending` |
| Partial | `--status-warning` |
| Paid | `--status-success` |
| Overdue | `--status-danger` |

Record payment → link to Accounting (no duplicate payment form if Accounting owns capture).

---

## 9. Purchase Returns UI

**Route:** `/purchase/returns`

### 9.1 Return workflow (UI states)

| Stage | UI surface |
|-------|------------|
| **Return Request** | Create from receipt/PO · reason · lines |
| **Approval** | Workflow · manager approve |
| **Vendor Return** | RMA # · ship-back tracking |
| **Replacement** | Link replacement PO |
| **Refund** | Credit note / AP adjustment link |
| **History** | `DS-TIMELINE` · status changes |

### 9.2 Return list

Columns: Return # · vendor · PO/receipt ref · reason · status · amount.

### 9.3 Return detail

**Route:** `/purchase/returns?view={id}`

Lines: item · return qty · reason · disposition (refund · replace · credit).

Actions: Submit · Approve · Mark shipped · Complete.

Stock impact preview → Inventory outbound movement on complete.

---

## 10. Purchase Reports UI

**Route:** `/purchase/reports` · **Layout:** `LAYOUT-ANALYTICS`

| Report | Route | Content |
|--------|-------|---------|
| **Purchase Analysis** | `/purchase/reports/purchase` | Spend by period · category |
| **Vendor Analysis** | `/purchase/reports/vendors` | Performance · rating · volume |
| **Spend Analysis** | `/purchase/reports/spend` | Budget vs actual · trends |
| **Lead Time Analysis** | `/purchase/reports/lead-time` | PO to receipt duration |
| **Return Analysis** | `/purchase/reports/returns` | Return rate · reasons |

`DS-EXPORT-MENU` · fiscal year from workspace context.

---

## 11. AI Purchase UI

Components: **`DS-AI-*` only** · graceful hide when AI off.

### 11.1 Features & placement

| Feature | Component | Placement |
|---------|-----------|-----------|
| **Demand Forecast** | `DS-AI-INSIGHTS` | Dashboard · RFQ create |
| **Vendor Recommendations** | `DS-AI-SUGGESTIONS` | RFQ award · vendor detail |
| **Price Trend Analysis** | `DS-AI-INSIGHTS` | RFQ comparison · reports |
| **Purchase Suggestions** | `DS-AI-SUGGESTIONS` | Dashboard widget |
| **Stock Replenishment** | `DS-AI-SUGGESTIONS` | From `inventory.stock.below_reorder` event |
| **Risk Detection** | `DS-AI-INSIGHTS` | Price anomaly · vendor risk |

### 11.2 AI interaction rules

| Rule | Detail |
|------|--------|
| Suggestions → draft | RFQ or PO draft — never auto-confirm |
| Award decision | Human required · AI advisory only |
| Price anomaly | Flag on comparison matrix cell |
| Activity log | AI actions in Activity tab |
| Apply | Preview table before create |

---

## 12. Settings UI

**Route:** `/purchase/settings` · **Layout:** `LAYOUT-SETTINGS`

| Section | Content |
|---------|-------|
| Document numbering | RFQ / PO prefixes |
| Approval rules | PO threshold · separation of duties |
| Default terms | Payment · delivery |
| Receipt defaults | Warehouse · QC required |
| Three-way match | Tolerance % · auto-flag rules |
| Vendor portal | Future token settings |

---

## 13. Mobile Purchase UI

### 13.1 Priority screens

| Screen | Behaviour |
|--------|-----------|
| **Dashboard** | Spend KPI · pending receipts · quick actions |
| **RFQ** | Card list · status · tap → summary drawer |
| **Orders** | Card list · vendor · status · delivery date |
| **Receipts** | Receive flow · scan · qty entry |
| **Quick Actions** | Create RFQ · Create PO · Record receipt |

### 13.2 Mobile rules

| Rule | Detail |
|------|--------|
| Lists | `DS-CARD-LIST` |
| RFQ comparison | Horizontal scroll vendor columns or simplified best-price view |
| PO detail | Full-screen drawer · collapsible tabs |
| Receipt entry | Line checklist · full-width confirm |
| Tap targets | 44×44px minimum |

---

## 14. Interaction Rules (Purchase-specific)

| Interaction | Rule |
|-------------|------|
| Vendor | Core contact only — no duplicate vendor CRUD table |
| RFQ → PO | Award action creates PO — not manual re-entry |
| PO approval | Workflow · buyer ≠ approver above threshold |
| Receipt | Posts Inventory via event — show impact preview |
| Bills | Three-way match indicators · link Accounting |
| Product lines | Catalog variant picker — read-only product identity |
| Cost sync | Receipt → `catalog.product.cost_updated` (backend) |
| Cross-module | UUID links only — no cross-module DB in UI |
| Attachments | Core attachments for quotes · contracts |

---

## 15. Permissions → UI

| Permission | UI effect |
|------------|-----------|
| `purchase.access` | Module in sidebar |
| `purchase.rfq.create` | RFQ list · create |
| `purchase.orders.create` | PO create |
| `purchase.orders.approve` | Approve button |
| `purchase.receipts.create` | Receipt entry |
| `purchase.vendors.manage` | Vendor terms · ratings edit |

RBAC: **hide** forbidden actions — never disable (locked).

---

## 16. Responsive Rules

| Screen | Desktop | Mobile |
|--------|---------|--------|
| Vendor / RFQ / PO lists | `DS-DATAGRID` | `DS-CARD-LIST` |
| RFQ comparison | Wide matrix · scroll | Best-price summary card per line |
| PO / receipt detail | Full page + tabs | Full-screen · stacked sections |
| Dashboard | 12-col widgets | KPI → pending → actions |
| Reports | Charts + table | Stacked · export in menu |
| Bills | `DS-DATAGRID` | `DS-CARD-LIST` |

---

## 17. Activity & Zone E

| Entity | Activity pattern |
|--------|------------------|
| RFQ | `purchase:rfq:{id}` |
| PO | `purchase:order:{id}` |
| Receipt | `purchase:receipt:{id}` |
| Vendor | Core contact activity |

List: activity icon → drawer. Detail: Activities tab + Zone E on desktop.

---

## 18. Menus Spec Index (to align)

| Screen | Route | layout_id |
|--------|-------|-----------|
| Vendors | `/purchase/vendors` | `LAYOUT-LIST` / `LAYOUT-DETAILS` |
| RFQ | `/purchase/rfq` | `LAYOUT-LIST` / `LAYOUT-DETAILS` |
| Orders | `/purchase/orders` | `LAYOUT-LIST` / `LAYOUT-DETAILS` |
| Receipts | `/purchase/receipts` | `LAYOUT-LIST` / `LAYOUT-DETAILS` |
| Dashboard | `/purchase/dashboard` | `LAYOUT-DASHBOARD` |
| Reports | `/purchase/reports/*` | `LAYOUT-ANALYTICS` |

Declare: `context_required` (currency · company) · `empty_state` · `loading` · `DS-*` IDs.

---

## 19. Compliance Checklist

- [ ] Drawer CRUD on list metadata — full page for RFQ/PO/receipt documents
- [ ] No `/new` or `/[id]/edit` routes for standard entities
- [ ] `DS-*` / `WS-*` components only
- [ ] Dashboard widgets in ModuleManifest (`purchase.*`)
- [ ] Vendors = Core contacts
- [ ] Receipt UI previews Inventory impact — no direct stock write
- [ ] Mobile card fallback
- [ ] AI via `DS-AI-*` only · human approve for award/PO
- [ ] Generate `UI.md` from this blueprint

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 20 — Purchase module UI blueprint |

---

**Purchase UI Blueprint** — procure-to-pay UI · design-system compliant · prototype-ready.
