# AgainERP — Inventory Module UI Blueprint

> **Status:** Active — **Inventory UI SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 19 — Inventory UI Design  
> **Module:** Inventory · Route prefix `/inventory`  
> **Governance:** [FINAL_UI_ARCHITECTURE_LOCK.md](../../FINAL_UI_ARCHITECTURE_LOCK.md) — APPROVED  
> **Components:** [COMPONENT_UI_BLUEPRINT.md](../../04-uiux/standards/COMPONENT_UI_BLUEPRINT.md)  
> **Architecture:** [INVENTORY_MODULE_ARCHITECTURE.md](./INVENTORY_MODULE_ARCHITECTURE.md)

**Documentation only.** No mockups · No Figma · No code.

> **Note:** `Architecture.md` and `UI.md` are not present in the Inventory module package — this blueprint is the UI SSOT until `UI.md` is generated from it. Architecture authority: [INVENTORY_MODULE_ARCHITECTURE.md](./INVENTORY_MODULE_ARCHITECTURE.md).

---

## Purpose

Define the **complete Inventory module UI** — navigation, pages, layouts, components, interactions, responsive rules, and AI features — using the approved AgainERP design system.

## Scope (from architecture)

| In scope | Out of scope |
|----------|--------------|
| Stock levels · movements · reservations | Product name, SKU, price editing (Catalog) |
| Warehouses · locations · transfers · adjustments | Customer orders UI (Sales) |
| Lots/batches · serial numbers · cycle counts | GL posting (Accounting) |
| Valuation · reorder rules · barcode ops | Storefront merchandising (Ecommerce) |
| Inventory reports · AI agent | Duplicate product catalog |

**Data rules:**

- Product identity from **Product Master** — inventory is quantity spine only
- Single ledger: `inventory_stock_levels` + immutable `inventory_movements`
- API: `/api/v1/inventory/` · Permissions: `inventory.*`
- Independent top-level module — not nested under Ecommerce

---

## 1. Navigation

### 1.1 Global placement

| Property | Value |
|----------|-------|
| Sidebar group | **Business Operations** (`nav.business-ops`) — top-level module |
| Module root | `/inventory` |
| Module access permission | `inventory.access` |
| Quick actions | New Transfer · New Adjustment · Scan Barcode (manifest) |

### 1.2 Module navigation (Level 2 — Zone B)

| Tab | ID | Route | Visible |
|-----|-----|-------|---------|
| **Dashboard** | `WS-MODNAV-DASH` | `/inventory/dashboard` | Always |
| **Operations** | `WS-MODNAV-OPS` | (ops routes) | Always |
| **Reports** | `WS-MODNAV-RPT` | `/inventory/reports` | Always |
| **Automation** | `WS-MODNAV-AUTO` | `/inventory/cycle-counts` | Cycle count workflows |
| **Settings** | `WS-MODNAV-SET` | `/inventory/settings` | `inventory.settings.edit` |

### 1.3 Operations menu (Level 3)

| Screen | Route | Permission | Entity |
|--------|-------|------------|--------|
| **Products** | `/inventory/products` | `inventory.item.read` | `inventory_items` + Product Master |
| **Stock** | `/inventory/stock` | `inventory.stock.read` | `inventory_stock_levels` |
| **Warehouses** | `/inventory/warehouses` | `inventory.warehouse.read` | `inventory_warehouses` |
| **Locations** | `/inventory/locations` | `inventory.location.write` | `inventory_locations` |
| **Transfers** | `/inventory/transfers` | `inventory.transfer.read` | `inventory_transfers` |
| **Adjustments** | `/inventory/adjustments` | `inventory.adjustment.read` | `inventory_adjustments` |
| **Lots & Serials** | `/inventory/lots-serials` | `inventory.batch.read` | Batches + serials hub |
| **Stock Movements** | `/inventory/movements` | `inventory.stock.read` | `inventory_movements` ledger |

> **Locations route:** Global location browser with warehouse filter; warehouse detail embeds location tree (§5).

### 1.4 Command palette

| Command ID | Label | Route |
|------------|-------|-------|
| `inventory.transfers.create` | New Transfer | `/inventory/transfers?create=1` |
| `inventory.adjustments.create` | New Adjustment | `/inventory/adjustments?create=1` |
| `inventory.stock.search` | Search Stock | `/inventory/stock` |
| `inventory.dashboard` | Inventory Dashboard | `/inventory/dashboard` |

---

## 2. Pages & Layouts

| Page | Layout ID | Route | Primary components |
|------|-----------|-------|-------------------|
| Inventory Dashboard | `LAYOUT-DASHBOARD` | `/inventory/dashboard` | `WS-CONTENT-DASH` |
| Product Stock List | `LAYOUT-LIST` | `/inventory/products` | `DS-DATAGRID` / `DS-CARD-LIST` |
| Product Stock Detail | `LAYOUT-DETAILS` | `/inventory/products?view=` | Drawer or full page |
| Stock Levels List | `LAYOUT-LIST` | `/inventory/stock` | `DS-DATAGRID` |
| Warehouse List | `LAYOUT-LIST` | `/inventory/warehouses` | `DS-DATAGRID` |
| Warehouse Detail | `LAYOUT-DETAILS` | `/inventory/warehouses?view=` | Full page · split tree |
| Location Browser | `LAYOUT-TREE-LIST` | `/inventory/locations` | Tree + stock panel |
| Transfer List | `LAYOUT-LIST` | `/inventory/transfers` | `DS-DATAGRID` |
| Transfer Detail | `LAYOUT-DETAILS` | `/inventory/transfers?view=` | Full page · timeline |
| Adjustment List | `LAYOUT-LIST` | `/inventory/adjustments` | `DS-DATAGRID` |
| Adjustment Detail | `LAYOUT-DETAILS` | `/inventory/adjustments?view=` | Drawer / full page |
| Lots & Serials Hub | `LAYOUT-LIST` | `/inventory/lots-serials` | Tabbed lists |
| Batch / Serial Detail | `LAYOUT-DETAILS` | `…/batches?view=` · `…/serials?view=` | Drawer |
| Movement Ledger | `LAYOUT-LIST` | `/inventory/movements` | `DS-DATAGRID` · read-only |
| Reports | `LAYOUT-ANALYTICS` | `/inventory/reports/*` | Charts + export |
| Settings | `LAYOUT-SETTINGS` | `/inventory/settings` | Form sections |

**CRUD rule (locked):** `?create=1` · `?view={id}` · `?edit={id}` — no `/new` or `/[id]/edit`.

**Complex documents:** Transfers and adjustments with line items use **full-page detail** by default.

---

## 3. Inventory Dashboard UI

**Route:** `/inventory/dashboard`

### 3.1 Sections

| Order | Section | Widget ID | Category | Col span |
|-------|---------|-----------|----------|----------|
| 1 | **Stock Value** | `inventory.stock-value` | `kpi` | 4 |
| 2 | **Low Stock Alerts** | `inventory.low-stock` | `alert` / `kpi` | 4 |
| 3 | **Out Of Stock** | `inventory.out-of-stock` | `kpi` | 4 |
| 4 | **Incoming Stock** | `inventory.incoming-stock` | `kpi` | 4 |
| 5 | **Outgoing Stock** | `inventory.outgoing-stock` | `kpi` | 4 |
| 6 | **Warehouse Summary** | `inventory.warehouse-summary` | `table` | 8 |
| 7 | **AI Inventory Insights** | `inventory.ai-insights` | `ai` | 12 |
| 8 | **Quick Actions** | `inventory.quick-actions` | `quick_action` | 4 |

Optional widgets (architecture): expiring batches · pending adjustments · open reservations · in-transit transfers — configurable in manifest.

### 3.2 Quick actions

| Action | Route |
|--------|-------|
| New Transfer | `/inventory/transfers?create=1` |
| New Adjustment | `/inventory/adjustments?create=1` |
| Start Cycle Count | `/inventory/cycle-counts?create=1` |
| Search Stock | `/inventory/stock` |
| Receive Goods | `/inventory/receipts?create=1` (when Purchase linked) |

### 3.3 Widget drill-down

| Widget | Click |
|--------|-------|
| Low Stock | `/inventory/stock?filter=low` |
| Out Of Stock | `/inventory/stock?filter=out` |
| Warehouse Summary row | `/inventory/warehouses?view={id}` |
| AI Insights CTA | AI suggestion queue / `DS-AI-PANEL` |

---

## 4. Product Stock UI

**Route:** `/inventory/products` · Inventory-centric **Product Master** view.

### 4.1 Page chrome

```text
Breadcrumb: Inventory › Products
Header: Product Stock · [Export ▾] [Bulk Update ▾] [Open Catalog ↗]
Toolbar: [Search] [Filters ▾] [Saved Views ▾]
Bulk bar: Set Reorder Rules · Export · Transfer · Adjust
Grid / Card list · Pagination · Drawer
```

### 4.2 Features & components

| Feature | Component |
|---------|-----------|
| **Search** | `DS-INPUT-SEARCH` — SKU · name · barcode |
| **Advanced Filters** | `DS-FILTER-BAR` + filter drawer |
| **Warehouse Filters** | `DS-SELECT-MULTI` |
| **Location Filters** | Tree picker (warehouse scoped) |
| **Brand Filters** | Product Master brand |
| **Category Filters** | Product Master category |
| **Stock Status Filters** | `DS-TAG` — In stock · Low · Out · Overstock |
| **Bulk Actions** | `DS-BULK-BAR` — reorder rules · export · transfer draft |

### 4.3 Columns

| Column | Source |
|--------|--------|
| Image · SKU · Name | Product Master (read-only) |
| On Hand · Reserved · Available | `inventory_stock_levels` |
| Default warehouse | Inventory |
| Batch/Serial tracked | Item config badge |
| Reorder min/max | `inventory_reorder_rules` |
| Last movement | `inventory_movements` |

### 4.4 Product detail (`?view=`)

| Tab | Content |
|-----|---------|
| Overview | Stock summary · tracking flags · reorder rules |
| By Warehouse | Levels per warehouse |
| Movements | Recent ledger slice |
| Batches / Serials | If tracked |
| Activities | `DS-ACTIVITY-FEED` |

**Rule:** Never edit product name, description, or price — **Open in Catalog** link only.

---

## 5. Stock List UI

**Route:** `/inventory/stock` · Granular stock levels (item × warehouse × location).

Same filter set as Product Stock (§4.2) plus movement quick link.

| Column | Notes |
|--------|-------|
| SKU · Product | |
| Warehouse · Location | |
| On Hand · Reserved · Available · Incoming | Right-aligned qty |
| Value | When `inventory.valuation.read` |
| Status | Low / OK / Out badge |

Row click → product or level detail drawer. Header actions: **Adjust** · **Transfer**.

---

## 6. Warehouse UI

**Route:** `/inventory/warehouses`

### 6.1 Warehouse list

`DS-DATAGRID` — code · name · type · branch · default · active · stock value summary.

Filters: type (physical · virtual · dropship · consignment · transit) · active · branch.

CRUD: `?create=1` · `?view=` · `?edit=` drawer.

### 6.2 Warehouse detail (full page default)

**Route:** `/inventory/warehouses?view={id}`

| Section | Content |
|---------|---------|
| **Header** | Name · code · type badge · branch · address |
| **Smart buttons** | Locations · Stock summary · Transfers · Cycle counts |
| **Stock Summary** | KPI row — SKUs · units · value |
| **Location Tree** | Left panel — zone → aisle → rack → bin |
| **Capacity Overview** | Progress bars per zone/location (`capacity_units`) |
| **Stock at location** | Right panel when tree node selected |

Tabs: Overview · Locations · Stock · Transfers · Activities · Settings.

### 6.3 Warehouse types (display)

| Type | Badge token |
|------|-------------|
| Physical | `--status-success` |
| Virtual | `--status-info` |
| Dropship | `--status-warning` |
| Consignment | `--status-info` |
| Transit | `--status-pending` |

---

## 7. Location Management UI

**Route:** `/inventory/locations` · **`LAYOUT-TREE-LIST`**

### 7.1 Location tree view

| Element | Behaviour |
|---------|-----------|
| Warehouse selector | `DS-SELECT-SINGLE` — scopes tree |
| Tree | Expand/collapse · drag reorder (permission) |
| Node types | zone · aisle · rack · bin · floor |
| Icons | By `location_type` |

### 7.2 Location detail

**Route:** `/inventory/locations?view={id}` · drawer or inline panel

| Field | Component |
|-------|-----------|
| Code | Scannable · unique per warehouse |
| Parent | Tree picker |
| Pickable / Receivable | `DS-SWITCH` |
| Capacity | `DS-INPUT-NUMBER` |
| Temperature zone | Select (cold chain) |

### 7.3 Stock by location

Selected node → embedded mini grid: SKU · qty on hand · batch/serial count.

### 7.4 Transfer actions

Context menu on location: **Transfer from here** · **Transfer to here** → pre-fills transfer draft.

---

## 8. Stock Transfer UI

**Route:** `/inventory/transfers` · Entity: `inventory_transfers`

### 8.1 Transfer statuses (UI display)

| Status | Display token | Architecture map |
|--------|---------------|------------------|
| **Draft** | `--status-draft` | Draft |
| **Pending** | `--status-pending` | Approved · awaiting ship |
| **In Transit** | `--status-info` | In Transit |
| **Completed** | `--status-success` | Received + Completed |
| **Cancelled** | `--status-danger` | Cancelled |

> Internal states `Approved` · `Received` map to **Pending** and **In Transit** pills respectively in list; full state shown in detail timeline.

### 8.2 Transfer list

Columns: transfer # · source WH → dest WH · items count · status · approval · expected date.

Filters: status · warehouse · date · approval pending.

### 8.3 Transfer detail (full page)

**Route:** `/inventory/transfers?view={id}`

| Section | Content |
|---------|---------|
| **Header** | Transfer # · status · approval badge |
| **Source Warehouse** | Name · optional source location |
| **Destination Warehouse** | Name · optional dest location |
| **Approval Status** | Pending / Approved / Rejected · approver · workflow bar |
| **Lines** | Item · qty · batch/serial · received qty · partial receive |
| **Transfer Timeline** | `DS-TIMELINE` — draft → approve → ship → receive → complete |
| **Carrier / tracking** | Reference fields |
| Zone E | `DS-ACTIVITY-FEED` |

### 8.4 State-dependent actions

| Status | Primary actions |
|--------|-----------------|
| Draft | Submit · Edit · Cancel |
| Pending | Approve · Ship · Cancel |
| In Transit | Receive · Partial receive |
| Completed | — (read-only) |
| Cancelled | Duplicate |

Permissions: `inventory.transfer.write` · `inventory.transfer.approve`.

---

## 9. Stock Adjustment UI

**Route:** `/inventory/adjustments` · Entity: `inventory_adjustments`

### 9.1 Adjustment list

Columns: # · date · warehouse · reason · lines · value impact · status · approver.

Filters: reason code · status · date · warehouse.

### 9.2 Adjustment detail

**Route:** `/inventory/adjustments?view={id}`

| Section | Content |
|---------|---------|
| **Adjustment Details** | Header · warehouse · created by · date |
| **Reason Codes** | `cycle_count` · `damage` · `shrinkage` · `found` · `opening_balance` · `qc_reject` · `expiry_write_off` |
| **Line items** | Item · location · batch/serial · **Before qty** · **After qty** · delta |
| **Approval Workflow** | Threshold gate · approve/reject · comments in chatter |
| **Audit History** | `DS-TIMELINE` + movement ledger links |

### 9.3 Before / After display

Per line: read-only before (system qty) · editable after · computed delta highlighted (`DS-ALERT-WARNING` if large variance).

### 9.4 Actions

| Action | Permission |
|--------|------------|
| Submit for approval | `inventory.adjustment.write` |
| Approve / Reject | `inventory.adjustment.approve` |
| Post | Creates `inventory_movements` rows |

---

## 10. Lots & Serial Numbers UI

**Route hub:** `/inventory/lots-serials` · Tabs: **Lots** · **Serials**

### 10.1 Lot tracking (batches)

**Route:** `/inventory/batches` · `inventory_batches`

| Feature | UI |
|---------|-----|
| Lot list | Batch # · item · qty · expiry · warehouse · status |
| **Expiry tracking** | Sort/filter by `expires_at` · 30/60/90 day chips |
| **Batch tracking** | Status: active · quarantined · recalled · expired |
| Detail | Manufactured date · supplier ref · movements |
| **Movement history** | Linked ledger filter by `batch_id` |

### 10.2 Serial tracking

**Route:** `/inventory/serials` · `inventory_serials`

| Feature | UI |
|---------|-----|
| Serial list | Serial # · item · status · warehouse · order ref |
| Status flow | in_stock → reserved → sold → returned → scrapped |
| Detail | Warranty · batch parent · service notes |
| **Movement history** | Movements with `serial_ids[]` |

### 10.3 Hub interactions

| Action | Detail |
|--------|--------|
| Quarantine batch | Status change + confirm |
| Recall | `DS-MODAL` · activity log |
| Scan serial | Barcode search → detail |

CRUD via drawer · complex traceability → full page.

---

## 11. Stock Movements UI

**Route:** `/inventory/movements` · **Read-only ledger**

`DS-DATAGRID` — append-only · no inline edit.

| Column | Notes |
|--------|-------|
| Date · Type | `purchase_receipt` · `sale` · `transfer_*` · `adjustment` · etc. |
| Item · SKU | |
| Warehouse · Location | |
| Qty · Sign | +/− color |
| Unit cost | Valuation permission |
| Reference | Order · transfer · adjustment link |
| Reason code | |
| User | `created_by` |

Filters: date range · type · item · warehouse · batch · serial · reference.

Export: `DS-EXPORT-MENU` · CSV · Excel.

Embedded on product/warehouse detail as **Recent movements** tab.

---

## 12. Inventory Reports UI

**Route:** `/inventory/reports` · **Layout:** `LAYOUT-ANALYTICS`

| Report | Route | Content |
|--------|-------|---------|
| **Stock Valuation** | `/inventory/reports/valuation` | By warehouse · method · total value |
| **Movement Reports** | `/inventory/reports/movements` | Ledger analytics |
| **Warehouse Reports** | `/inventory/reports/warehouses` | Levels by WH |
| **Adjustment Reports** | `/inventory/reports/adjustments` | By reason · approver |
| **Expiry Reports** | `/inventory/reports/expiry` | FEFO compliance · batch value at risk |

Additional (architecture): reservation · transfer status · serial traceability · cycle count accuracy · reorder suggestions · turnover.

`DS-EXPORT-MENU` · workspace fiscal context.

---

## 13. AI Inventory UI

Register per architecture §19 · components **`DS-AI-*` only**.

### 13.1 Features & placement

| Feature | Component | Placement |
|---------|-----------|-----------|
| **Demand Forecast** | `DS-AI-INSIGHTS` | Dashboard · product detail |
| **Reorder Suggestions** | `DS-AI-SUGGESTIONS` | Dashboard · low stock widget |
| **Dead Stock Detection** | `DS-AI-INSIGHTS` | Reports · dashboard |
| **Fast Moving Products** | `DS-AI-INSIGHTS` | Dashboard · reports |
| **Stock Risk Alerts** | `DS-AI-INSIGHTS` | Dashboard alerts · expiry |
| **Inventory Optimization** | `DS-AI-PANEL` | `/inventory/ai` hub |

Extended capabilities (architecture): overstock alert · expiry risk · shrinkage anomaly · warehouse balancing · cycle count prioritization.

### 13.2 AI interaction rules

| Rule | Detail |
|------|--------|
| Review queue | Suggestions never auto-adjust stock without policy |
| Apply action | `inventory.ai.apply` · creates draft transfer/adjustment/reorder |
| Activity log | All agent runs → Activity `AI Actions` tab |
| Preview | Table of affected SKUs before apply |
| Regulated | Batch recall suggestions require human approval |

---

## 14. Settings UI

**Route:** `/inventory/settings` · **Layout:** `LAYOUT-SETTINGS`

| Group | Content |
|-------|---------|
| General | Default warehouse · cost method · reservation TTL |
| Allocation | Nearest WH · partial ship · backorder |
| Tracking | Batch · serial · FEFO/FIFO default |
| Adjustments | Approval threshold · reason codes |
| Transfers | Require approval · partial receive |
| Alerts | Low stock default · expiry alert days |
| Barcode | Prefix · scan defaults |
| Integrations | Purchase receipt · POS · Ecommerce cache TTL |

---

## 15. Mobile Inventory UI

### 15.1 Priority screens

| Screen | Behaviour |
|--------|-----------|
| **Dashboard** | Stock value · low stock · quick actions |
| **Stock Search** | `DS-INPUT-SEARCH` prominent · barcode scan |
| **Transfers** | Card list · receive confirmation flow |
| **Adjustments** | Simplified create · reason picker |
| **Quick Actions** | Scan · Transfer · Adjust · Count |

### 15.2 Mobile rules

| Rule | Detail |
|------|--------|
| Lists | `DS-CARD-LIST` — SKU · qty · warehouse · status |
| Location tree | Drill-down stack navigation |
| Transfer receive | Full-width confirm · line checkboxes |
| Cycle count (future WMS) | Scan mode · blind count |
| Tap targets | 44×44px minimum |
| Bulk actions | Desktop-first; mobile via row ⋯ menu |

---

## 16. Interaction Rules (Inventory-specific)

| Interaction | Rule |
|-------------|------|
| Stock change | Always via movement — no silent qty edit |
| Product edit | Redirect to Catalog — never inline name/price |
| Reserve / release | API-only from Orders/POS — read-only in UI except manual release |
| Transfer ship/receive | Idempotent actions · partial receive supported |
| Adjustment | Above threshold → approval workflow |
| Batch allocation | FEFO/FIFO per item policy |
| Serial qty | 0 or 1 per serial record |
| Cross-module links | Order · purchase receipt · catalog variant — UUID links |
| Activity | All operations → Activity timeline |
| Export | Respects filters + row-level security |

---

## 17. Permissions → UI

| Permission | UI effect |
|------------|-----------|
| `inventory.access` | Module in sidebar |
| `inventory.item.read` | Products · stock lists |
| `inventory.warehouse.write` | Warehouse CRUD |
| `inventory.location.write` | Location tree edit |
| `inventory.transfer.approve` | Approve transfer button |
| `inventory.adjustment.approve` | Approve adjustment |
| `inventory.valuation.read` | Value columns · valuation reports |
| `inventory.ai.apply` | Apply AI suggestions |
| `inventory.export` | Export menus |

RBAC: **hide** forbidden actions — never disable (locked).

Row-level: scope by `company_id` · optional `warehouse_id` for warehouse managers.

---

## 18. Responsive Rules

| Screen | Desktop | Mobile |
|--------|---------|--------|
| Product / stock lists | `DS-DATAGRID` | `DS-CARD-LIST` |
| Warehouse detail | Split tree + panel | Tree full screen → tap → stock sheet |
| Transfer detail | Full page + timeline | Full-screen drawer |
| Movement ledger | Wide grid · horizontal scroll | Card list · type + qty prominent |
| Dashboard | 12-col widgets | KPI stack → alerts → actions |
| Lots/serial lists | `DS-DATAGRID` | `DS-CARD-LIST` |
| Reports | Charts + table | Stacked · export in ⋯ menu |

---

## 19. Activity & Zone E

Per architecture §18:

| Surface | Pattern |
|---------|---------|
| List pages | Activity icon column → activity drawer |
| Detail pages | Activities tab + `DS-TIMELINE` |
| Transfers / adjustments | Approval comments in chatter |
| Entity IDs | `inventory:transfer:{id}` etc. |

Zone E: `WS-CONTEXT-ACTIVITY` on desktop detail pages.

---

## 20. Menus Spec Index (to align)

| Screen | Route | layout_id |
|--------|-------|-----------|
| Products | `/inventory/products` | `LAYOUT-LIST` |
| Stock | `/inventory/stock` | `LAYOUT-LIST` |
| Warehouses | `/inventory/warehouses` | `LAYOUT-LIST` / `LAYOUT-DETAILS` |
| Transfers | `/inventory/transfers` | `LAYOUT-LIST` / `LAYOUT-DETAILS` |
| Adjustments | `/inventory/adjustments` | `LAYOUT-LIST` / `LAYOUT-DETAILS` |
| Dashboard | `/inventory/dashboard` | `LAYOUT-DASHBOARD` |
| Reports | `/inventory/reports/*` | `LAYOUT-ANALYTICS` |

Declare: `context_required` (warehouse · currency for valuation) · `empty_state` · `loading` · `DS-*` IDs.

---

## 21. Compliance Checklist

- [ ] Drawer CRUD on standard entity lists — no `/new` routes
- [ ] `DS-*` / `WS-*` components only
- [ ] Dashboard widgets in ModuleManifest (`inventory.*`)
- [ ] Product Master read-only in Inventory UI
- [ ] No qty columns edited outside adjustment/transfer flows
- [ ] Mobile card fallback on all lists
- [ ] AI via `DS-AI-*` only · review queue · no auto-post
- [ ] Generate `UI.md` from this blueprint
- [ ] Independent `/inventory/*` — not under Ecommerce

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 19 — Inventory module UI blueprint |

---

**Inventory UI Blueprint** — stock truth layer UI · design-system compliant · prototype-ready.
