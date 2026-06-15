# AgainERP — Purchase Module Architecture

> **Status:** Approved  
> **Version:** 1.0  
> **Module:** Purchase (Procurement & Vendor Management)  
> **Document Type:** Enterprise Architecture  
> **Phase:** Documentation First · UI/UX Planning  
> **Route Namespace:** `/purchase/*`  
> **Governance:** [GOVERNANCE.md](../../GOVERNANCE.md) · **Standards:** [DEVELOPMENT_STANDARDS.md](../../DEVELOPMENT_STANDARDS.md)

**No backend code. No database implementation. No API implementation.**  
This document is the source of truth for **Purchase as an independent business module** — procure-to-pay, vendor management, and goods receipt orchestration.

### Step 03 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Procurement & Vendor Management module | §1 Module Vision |
| Route namespace `/purchase/*` | Navigation (§3 implied in sections) |
| Vendor, RFQ, PO, Receipts, Bills, Returns, Contracts | §3–§10 |
| Activity & Approval Integration | §13 · §14 |
| AI Purchase Agent | §15 |
| Inventory & Finance Integration | §18 · §19 |
| Future industry compatibility | §20 |

**Related:** [PURCHASE_WORKFLOW.md](./PURCHASE_WORKFLOW.md) · [ENTITY_PURCHASE.md](./ENTITY_PURCHASE.md) · [PRODUCT_MASTER_ARCHITECTURE.md](../core/PRODUCT_MASTER_ARCHITECTURE.md) · [INVENTORY_MODULE_ARCHITECTURE.md](../inventory/INVENTORY_MODULE_ARCHITECTURE.md) · [SALES_MODULE_ARCHITECTURE.md](../sales/SALES_MODULE_ARCHITECTURE.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../core/ACTIVITY_CHATTER_ARCHITECTURE.md) · [core/entities/contacts.md](../../core/entities/contacts.md) · [MASTER_DATABASE_ARCHITECTURE.md](../../database/MASTER_DATABASE_ARCHITECTURE.md)

---

## Executive Summary

**Purchase** is AgainERP's **procurement spine** — the module that manages vendors, sourcing, purchase orders, goods receipts, vendor bills, returns, and contracts from request to pay.

| Principle | Rule |
|-----------|------|
| **Independent module** | Full admin UX at `/purchase/*` — not nested under Ecommerce or Inventory |
| **Vendor via Core contacts** | No duplicate vendor master — `contact_type = vendor` |
| **Product Master consumer** | PO lines reference catalog variants / inventory items |
| **Inventory owns stock** | Purchase posts receipts → Inventory movements |
| **Finance owns payables** | Vendor bills → Accounting AP |
| **Approval native** | PO, contracts, and high-value receipts require workflow |

**Table namespace:** `purchase_*` · **API base:** `/api/v1/purchase/`

---

## 1. Module Vision

### Why Purchase Exists as an Independent Module

Procurement is operational infrastructure for every business that buys goods or services — not only retailers with an online store.

Purchase must work when:

- There is **no Ecommerce** (manufacturing, wholesale, hospital supplies)
- Inventory and Sales run independently
- Multiple branches procure centrally or locally
- Regulated industries require contract and audit trails

```text
                    ┌─────────────────────────────────────┐
                    │         Product Master (Core)        │
                    │     SKU · Variant · Cost reference   │
                    └─────────────────┬───────────────────┘
                                      │
                    ┌─────────────────▼───────────────────┐
                    │      Purchase Module (Independent)   │
                    │  RFQ · PO · Receipt · Bill · Contract  │
                    └───────┬─────────────────┬───────────────┘
                            │                 │
              ┌─────────────▼──────┐   ┌──────▼──────────────┐
              │  Inventory Module   │   │  Finance / Accounting │
              │  Goods receipt →    │   │  Vendor bills → AP  │
              │  stock movements      │   │  three-way match      │
              └──────────────────────┘   └─────────────────────┘
                            │
              ┌─────────────▼──────┐
              │  Core Contacts        │
              │  Vendors (parties)    │
              └──────────────────────┘
```

### Vision Statement

> **One procure-to-pay flow. One vendor truth. Full traceability from RFQ to payment.**

Purchase connects **who we buy from** (vendors), **what we buy** (Product Master), **what we received** (Inventory), and **what we owe** (Finance).

---

## 2. Responsibilities

### Purchase Owns

| Domain | Responsibility |
|--------|----------------|
| **Vendor management** | Terms, ratings, catalogs, contacts (via Core) |
| **RFQ / sourcing** | Request quotes, compare vendors, award |
| **Quotations** | Vendor quote capture and versioning |
| **Purchase orders** | PO lifecycle, approvals, amendments |
| **Goods receipts** | Receive against PO (orchestration) |
| **Vendor bills** | Bill capture, three-way match prep |
| **Returns** | Return to vendor (RMA, debit note) |
| **Contracts** | Framework agreements, price lists, SLAs |
| **Procurement reports** | Spend, lead time, vendor performance |

### Purchase Does Not Own

| Domain | Owner |
|--------|-------|
| Vendor party record (legal entity) | Core `contacts` |
| Product identity, SKU, specs | Product Master / Catalog |
| Stock quantities, movements | Inventory |
| GL posting, payment execution | Accounting / Finance |
| Customer sales orders | Sales / Orders |

### Procure-to-Pay Flow

```text
Need identified (reorder rule / manual / MRP)
     ↓
RFQ (optional) → Vendor quotations
     ↓
Purchase Order (approved)
     ↓
Goods Receipt → Inventory movement (+qty)
     ↓
Vendor Bill → Accounting AP
     ↓
Payment (Finance)
```

---

## 3. Navigation Structure

**Route namespace:** `/purchase/*`

```text
Purchase
├── /purchase                          Dashboard
├── /purchase/vendors                   Vendor directory
├── /purchase/vendors/[id]              Vendor detail
├── /purchase/rfq                       Request for quotation
├── /purchase/rfq/[id]                  RFQ detail
├── /purchase/quotations                Vendor quotations
├── /purchase/quotations/[id]           Quotation detail
├── /purchase/orders                    Purchase orders
├── /purchase/orders/[id]               PO detail
├── /purchase/orders/create             Create PO
├── /purchase/receipts                  Goods receipts
├── /purchase/receipts/[id]             Receipt detail
├── /purchase/bills                     Vendor bills
├── /purchase/bills/[id]                Bill detail
├── /purchase/returns                   Vendor returns
├── /purchase/returns/[id]             Return detail
├── /purchase/contracts                 Vendor contracts
├── /purchase/contracts/[id]           Contract detail
├── /purchase/reports                   Procurement reports
└── /purchase/settings                  Module settings
```

Purchase appears as a **top-level sidebar module** — parallel to Inventory, Catalog, and Orders.

---

## 4. Vendor Management

**Routes:** `/purchase/vendors` · `/purchase/vendors/[id]`

### Design Rule

**No `purchase_vendors` person table.** Vendors are Core [contacts](../../core/entities/contacts.md) with `contact_types` including `vendor`.

### Vendor Record (Core Contact + Purchase Extensions)

| Layer | Fields |
|-------|--------|
| **Core contact** | Name, email, phone, tax ID, addresses, attachments |
| **Purchase extension** | `purchase_vendor_profiles` |

**Table:** `purchase_vendor_profiles`

| Field | Notes |
|-------|-------|
| `contact_id` | FK → Core contacts (vendor) |
| `vendor_code` | Internal code (unique per company) |
| `payment_terms` | Net 30, Net 60, COD |
| `currency_code` | Default currency |
| `lead_time_days` | Default lead time |
| `min_order_value` | MOQ value |
| `rating_score` | Aggregated performance |
| `is_preferred` | Preferred vendor flag |
| `is_blocked` | Block new POs |
| `buyer_id` | Assigned buyer (user) |
| `incoterms` | FOB, CIF, etc. |

### Vendor Catalog Mapping

**Table:** `purchase_vendor_items`

| Field | Notes |
|-------|-------|
| `contact_id` | Vendor |
| `inventory_item_id` / `variant_id` | Product Master link |
| `vendor_sku` | Supplier part number |
| `vendor_price` | Last quoted / contract price |
| `lead_time_days` | Item-level override |
| `min_order_qty` | Vendor MOQ |
| `supplier_stock` | Supplier-reported availability (feed or manual) |
| `stock_status` | `in_stock` · `low` · `out` · `unknown` |
| `warranty` | Supplier warranty terms for SKU |
| `is_preferred` | Preferred vendor for this product/variant |
| `is_published_on_web` | Expose supplier offer on storefront (optional) |

**Prototype (2026-06-15):** UI prototype implements mapping via `vendor-mapping-store` in `apps/web`. See [SUPPLIERS_IMPLEMENTED_DESIGN.md](../../ui-prototype/purchase/SUPPLIERS_IMPLEMENTED_DESIGN.md).

### Vendor UI

- Vendor list with spend YTD, open POs, rating, status
- Vendor detail: contacts, terms, item catalog (mapped + unmapped feed), PO history, contracts, activity drawer
- Performance: on-time delivery %, quality reject rate, price variance
- **Product drawer:** multi-supplier cost/stock/warranty comparison per catalog variant
- **Map supplier:** link product to vendor SKU; same product may have 2–3+ suppliers with different prices; not all mappings are published on website

---

## 5. RFQ Management

**Routes:** `/purchase/rfq` · `/purchase/rfq/[id]`

**Tables:** `purchase_rfq`, `purchase_rfq_items`, `purchase_rfq_vendors`

### Purpose

Structured sourcing when price/availability must be compared across vendors before PO.

### Workflow

```text
Draft → Sent → Responses Received → Under Review → Awarded → Closed
                                              ↘ Cancelled
```

| State | Description |
|-------|-------------|
| Draft | Lines and invited vendors defined |
| Sent | RFQ emailed / portal notification sent |
| Responses Received | At least one vendor responded |
| Under Review | Buyer comparing quotes |
| Awarded | Winning vendor selected → PO or contract |
| Closed | RFQ archived |
| Cancelled | No award |

### RFQ Header

| Field | Notes |
|-------|-------|
| `rfq_number` | Unique per company |
| `title` | Short description |
| `required_date` | Delivery deadline |
| `branch_id` | Requesting branch |
| `warehouse_id` | Delivery warehouse |
| `buyer_id` | Owner |
| `notes` | Internal / vendor-visible |

### RFQ Lines

| Field | Notes |
|-------|-------|
| `variant_id` / `description` | Product or free-text service line |
| `quantity` | Requested qty |
| `uom` | Unit of measure |
| `target_price` | Optional budget hint |

### RFQ Vendors

Invited vendors (`contact_id`), send status, portal token, response deadline.

### Events

`purchase.rfq.sent` · `purchase.rfq.response_received` · `purchase.rfq.awarded`

---

## 6. Quotations

**Routes:** `/purchase/quotations` · `/purchase/quotations/[id]`

**Tables:** `purchase_rfq_responses`, `purchase_rfq_response_items`  
(Standalone quotations without RFQ: `purchase_quotations` — future)

### Purpose

Capture vendor quote responses — linked to RFQ or standalone vendor quote upload.

| Field | Notes |
|-------|-------|
| `rfq_id` | Optional parent RFQ |
| `contact_id` | Vendor |
| `quote_number` | Vendor reference |
| `valid_until` | Quote expiry |
| `currency_code` | |
| `total_amount` | Computed |
| `status` | `draft`, `submitted`, `accepted`, `rejected` |
| `attachment_id` | PDF quote via Core attachments |

### Line Comparison UI

Side-by-side grid: RFQ lines × vendor quotes (price, lead time, MOQ, notes). AI Agent can flag anomalies (§15).

### Award Action

Award quotation → auto-create draft PO pre-filled with winning prices.

---

## 7. Purchase Orders

**Routes:** `/purchase/orders` · `/purchase/orders/[id]` · `/purchase/orders/create`

**Tables:** `purchase_orders`, `purchase_order_items`, `purchase_order_status_history`

### PO Lifecycle

```text
Draft → Submitted → Approved → Sent → Partially Received → Received → Closed
              ↓           ↓
          Rejected    Cancelled
```

| State | Description |
|-------|-------------|
| Draft | Buyer editing |
| Submitted | Awaiting approval |
| Approved | Ready to send vendor |
| Sent | Transmitted to vendor |
| Partially Received | Some lines received |
| Received | Fully received |
| Closed | Complete, no further receipts |
| Cancelled | Voided before full receipt |

### PO Header

| Field | Notes |
|-------|-------|
| `po_number` | Unique per company |
| `contact_id` | Vendor |
| `order_date` | |
| `expected_date` | Promised delivery |
| `warehouse_id` | Ship-to warehouse |
| `branch_id` | |
| `buyer_id` | |
| `currency_code` | |
| `payment_terms` | From vendor profile or override |
| `incoterms` | |
| `contract_id` | Optional framework contract |
| `subtotal`, `tax_amount`, `total` | |

### PO Lines

| Field | Notes |
|-------|-------|
| `variant_id` / `inventory_item_id` | Product Master link |
| `description` | Override for services |
| `quantity_ordered` | |
| `quantity_received` | Running total |
| `quantity_billed` | For three-way match |
| `unit_price` | |
| `tax_class_id` | |
| `discount_percent` | |
| `expected_date` | Line-level delivery |
| `project_id` | Future project costing |

### PO Sources

| Source | Flow |
|--------|------|
| Manual | Buyer creates PO |
| RFQ award | From winning quotation |
| Reorder rule | Inventory min_qty → suggested PO |
| Contract | Release against blanket PO |
| Sales drop-ship | Sales order triggers PO (future) |
| MRP | Manufacturing material requirement (future) |

### Events

`purchase.order.confirmed` · `purchase.order.approved` · `purchase.order.sent` · `purchase.order.cancelled`

---

## 8. Goods Receipts

**Routes:** `/purchase/receipts` · `/purchase/receipts/[id]`

**Tables:** `purchase_receipts`, `purchase_receipt_items`

### Purpose

Record physical receipt of goods against PO. **Purchase orchestrates; Inventory posts stock.**

### Integration Contract

```text
Purchase: purchase_receipts (business document)
     ↓ event: purchase.receipt.completed
Inventory: inventory_movements (purchase_receipt type, +qty)
     ↓
Catalog: cost_price hint update (async)
```

> **Ownership note:** `inventory_purchase_receipts` may mirror Purchase receipt ID. Canonical business receipt = `purchase_receipts`; stock impact = Inventory module. Consolidate at implementation gate via ADR.

### Receipt Workflow

```text
Draft → Posted → Completed
         ↓
   Inventory movement created
   PO qty_received updated
```

### Receipt Header

| Field | Notes |
|-------|-------|
| `receipt_number` | |
| `purchase_order_id` | FK |
| `contact_id` | Vendor |
| `warehouse_id` | Received into |
| `location_id` | Optional bin |
| `received_date` | |
| `received_by` | User |
| `vendor_delivery_note` | Vendor doc reference |

### Receipt Lines

| Field | Notes |
|-------|-------|
| `purchase_order_item_id` | PO line |
| `quantity_received` | This receipt |
| `batch_id` | Optional lot |
| `serial_ids[]` | Optional serials |
| `unit_cost` | Landed cost input |
| `quality_status` | `accepted`, `rejected`, `quarantine` |

Partial receipts supported. Over-receipt blocked or requires approval (settings).

---

## 9. Vendor Bills

**Routes:** `/purchase/bills` · `/purchase/bills/[id]`

**Tables:** `purchase_vendor_bills`, `purchase_vendor_bill_items`

### Purpose

Capture vendor invoices for **three-way match** (PO · Receipt · Bill) and hand off to Accounting AP.

### Workflow

```text
Draft → Matched → Approved → Posted (to Accounting) → Paid (Finance)
```

| Match Status | Description |
|--------------|-------------|
| Unmatched | Bill entered, no PO link |
| Partial match | Qty/price variance |
| Matched | PO + receipt + bill align |
| Exception | Requires approval |

### Bill Header

| Field | Notes |
|-------|-------|
| `bill_number` | Vendor invoice number |
| `contact_id` | Vendor |
| `purchase_order_id` | Optional |
| `receipt_id` | Optional |
| `bill_date`, `due_date` | |
| `currency_code` | |
| `subtotal`, `tax_amount`, `total` | |
| `status` | `draft`, `matched`, `approved`, `posted`, `paid`, `cancelled` |
| `accounting_entry_id` | FK after post (Finance) |

### Finance Handoff

Purchase prepares bill; Accounting posts journal entry and schedules payment. Event: `purchase.bill.posted` → Accounting consumer.

---

## 10. Returns

**Routes:** `/purchase/returns` · `/purchase/returns/[id]`

**Tables:** `purchase_returns`, `purchase_return_items`

### Purpose

Return defective or excess goods to vendor — reverse receipt and create debit note.

### Workflow

```text
Requested → Approved → Shipped → Received by Vendor → Credited
```

| Action | Module impact |
|--------|----------------|
| Return approved | PO return qty updated |
| Shipped to vendor | Inventory movement (out) |
| Vendor credit | Vendor bill credit note → Accounting |

Links to Inventory batch/serial when tracked. Reason codes: `defective`, `wrong_item`, `over_shipment`, `warranty`.

---

## 11. Contracts

**Routes:** `/purchase/contracts` · `/purchase/contracts/[id]`

**Tables:** `purchase_contracts`, `purchase_contract_items`

### Purpose

Framework agreements — blanket POs, fixed pricing, volume commitments, SLAs.

| Field | Notes |
|-------|-------|
| `contract_number` | |
| `contact_id` | Vendor |
| `start_date`, `end_date` | |
| `total_value` | Commitment cap |
| `released_value` | PO releases to date |
| `status` | `draft`, `active`, `expired`, `terminated` |
| `attachment_id` | Signed contract PDF |

### Contract Lines

Fixed price per variant, volume tiers, rebate rules. PO creation can **release against contract** — pre-filled prices and terms.

Renewal alerts via AI Agent and dashboard widgets.

---

## 12. Reports

**Route:** `/purchase/reports`

| Report | Description |
|--------|-------------|
| **Spend by vendor** | YTD/monthly spend ranking |
| **Spend by category** | Product category breakdown |
| **Open POs** | Unreceived lines |
| **Receipt status** | Expected vs received |
| **Bill aging** | Unpaid vendor bills (with Finance) |
| **Three-way match exceptions** | PO/receipt/bill mismatches |
| **Vendor performance** | On-time, quality, price variance |
| **RFQ analysis** | Quote comparison history |
| **Contract utilization** | Released vs committed |
| **Return rate** | By vendor, by SKU |
| **Buyer workload** | POs per buyer |
| **Lead time analysis** | Order to receipt days |

---

## 13. Settings

**Route:** `/purchase/settings`

Integrates with [SETTINGS_ARCHITECTURE.md](../core/SETTINGS_ARCHITECTURE.md) where appropriate.

| Group | Settings |
|-------|----------|
| **General** | Default warehouse, default payment terms, PO number prefix |
| **Approval** | PO approval thresholds, dual approval rules |
| **Receipt** | Allow over-receipt, partial receipt default, QC required |
| **Billing** | Three-way match tolerance (%), auto-match rules |
| **RFQ** | Default response days, auto-send template |
| **Vendor** | Require vendor code, block PO if vendor blocked |
| **Integration** | Auto-create receipt from PO %, cost sync to Catalog |
| **Notifications** | PO approval, receipt due, contract expiry |

---

## 14. Activity Integration

Every purchase record integrates [Activity & Chatter Architecture](../core/ACTIVITY_CHATTER_ARCHITECTURE.md).

### Entity Types

| Entity | Activity ID |
|--------|-------------|
| Vendor | `purchase:vendor:{contact_id}` |
| RFQ | `purchase:rfq:{id}` |
| Quotation | `purchase:quotation:{id}` |
| Purchase Order | `purchase:order:{id}` |
| Receipt | `purchase:receipt:{id}` |
| Vendor Bill | `purchase:bill:{id}` |
| Return | `purchase:return:{id}` |
| Contract | `purchase:contract:{id}` |

### Tracked Events

| Event | Activity Type |
|-------|---------------|
| PO created/updated | `create` / `update` |
| PO submitted | `status_change` |
| PO approved/rejected | `approval_change` |
| RFQ sent | `status_change` |
| Quotation received | `update` |
| Receipt posted | `movement` |
| Bill matched/posted | `status_change` |
| Return approved | `approval_change` |
| Contract activated | `status_change` |
| AI suggestion applied | `ai_action` |

### UI Pattern

Activity icon on list pages → Global Activity Drawer. PO detail includes approval comments and attachment history.

---

## 15. Approval Integration

Purchase integrates [Approval Engine](../../core/engines/APPROVAL_ENGINE_ARCHITECTURE.md) and [Workflow Engine](../../core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md).

### Approval Points

| Document | Trigger | Policy |
|----------|---------|--------|
| **Purchase Order** | Submit for approval | Amount threshold, category, vendor |
| **Goods Receipt** | Over-receipt / QC reject | Warehouse manager |
| **Vendor Bill** | Match exception | Finance approver |
| **Return to vendor** | Credit value threshold | Procurement manager |
| **Contract** | Activation | Legal + procurement |

### Separation of Duties

- Buyer cannot approve own PO above configured limit
- Receiver cannot approve bill for same PO they posted (configurable)
- Dual approval for capital expenditure categories

### Workflow Example

```text
PO Draft (Buyer)
  → Submit
  → L1 Manager (< 50,000 BDT)
  → L2 Finance (> 50,000 BDT)
  → Approved → Send to Vendor
```

All approval steps write to Activity timeline and `purchase_order_status_history`.

---

## 16. AI Purchase Agent

### Role

**Purchase Agent** optimizes sourcing, detects anomalies, and automates routine procurement decisions.

### Capabilities

| Capability | Input | Output |
|------------|-------|--------|
| **Vendor recommendation** | Item, history, lead time | Ranked vendors |
| **Price anomaly detection** | Quote vs contract vs history | Flag outlier quotes |
| **Reorder suggestion** | Inventory min_qty, velocity | Draft PO lines |
| **Lead time prediction** | Vendor performance, season | Expected delivery date |
| **RFQ line fill** | Product specs, vendor catalogs | Suggested RFQ lines |
| **Contract renewal alert** | Contract end date, spend | Renewal draft |
| **Spend optimization** | Category spend, vendors | Consolidation suggestion |
| **Three-way match assist** | PO, receipt, bill PDF | Match confidence score |

### AI Governance

1. Suggestions enter review queue — no auto-PO without policy
2. All runs logged in Activity `AI Actions`
3. Vendor selection AI requires human award on RFQ
4. Bill match AI assists but Finance approves post

**Prototype reference:** [ui-prototype/inventory/PurchaseSuggestions.md](../../ui-prototype/inventory/PurchaseSuggestions.md)

---

## 17. Permissions

Namespace: `purchase.*`

| Permission | Description |
|------------|-------------|
| `purchase.access` | Module access |
| `purchase.dashboard.view` | Dashboard |
| `purchase.vendor.read` | View vendors |
| `purchase.vendor.write` | Edit vendor profiles |
| `purchase.rfq.read` | View RFQ |
| `purchase.rfq.create` | Create/send RFQ |
| `purchase.rfq.award` | Award RFQ |
| `purchase.quotation.read` | View quotations |
| `purchase.quotation.write` | Enter vendor quotes |
| `purchase.order.read` | View POs |
| `purchase.order.create` | Create PO |
| `purchase.order.approve` | Approve PO |
| `purchase.order.cancel` | Cancel PO |
| `purchase.receipt.read` | View receipts |
| `purchase.receipt.create` | Post receipts |
| `purchase.bill.read` | View bills |
| `purchase.bill.create` | Enter bills |
| `purchase.bill.approve` | Approve bills |
| `purchase.return.read` | View returns |
| `purchase.return.create` | Create returns |
| `purchase.return.approve` | Approve returns |
| `purchase.contract.read` | View contracts |
| `purchase.contract.write` | Manage contracts |
| `purchase.contract.approve` | Activate contracts |
| `purchase.report.view` | Reports |
| `purchase.settings.edit` | Module settings |
| `purchase.export` | Export data |
| `purchase.ai.apply` | Apply AI suggestions |

Row-level security: `company_id`, optional `branch_id`, buyer assignment scope.

---

## 18. Inventory Integration

### Integration Model

```text
Product Master variant
     ↓
purchase_order_items (qty, price)
     ↓
purchase_receipts (received qty, batch/serial)
     ↓ event: purchase.receipt.completed
inventory_movements (type: purchase_receipt, +qty)
     ↓
inventory_stock_levels.qty_on_hand +=
     ↓ event: inventory.stock.updated
Catalog cost_price sync (optional)
```

### Key Rules

| Rule | Detail |
|------|--------|
| Inventory owns qty | Purchase never writes `inventory_stock_levels` directly |
| Receipt required | Stock increases only via posted receipt (or approved adjustment) |
| Batch/serial | Receipt lines pass batch/serial to Inventory |
| Returns | Purchase return → Inventory outbound movement |
| Reorder | Inventory `inventory.stock.low` → Purchase draft PO suggestion |
| Landed cost | Receipt unit_cost feeds Inventory valuation (§15 Inventory doc) |

### Shared References

- `purchase_order_items.variant_id` → Product Master
- `purchase_receipts.warehouse_id` → `inventory_warehouses`
- `purchase_vendor_items.vendor_sku` ↔ supplier mapping

---

## 19. Finance Integration

### Procure-to-Pay Handoff

```text
Purchase Order (commitment)
     ↓
Goods Receipt (inventory/asset)
     ↓
Vendor Bill (liability)
     ↓ event: purchase.bill.posted
Accounting: AP journal entry
     ↓
Payment run (Finance module)
```

### Three-Way Match

| Document | Purchase | Finance |
|----------|----------|---------|
| PO | `purchase_orders` | Commitment / encumbrance (optional) |
| Receipt | `purchase_receipts` | GRNI accrual (optional) |
| Bill | `purchase_vendor_bills` | AP invoice |

Tolerance settings (qty %, price %) in Purchase settings. Exceptions route to approval.

### Events to Accounting

| Event | Accounting Action |
|-------|---------------------|
| `purchase.bill.posted` | Create AP invoice, DR inventory/ expense |
| `purchase.bill.credit` | Credit note from return |
| `purchase.receipt.completed` | GRNI accrual (if policy enabled) |

Purchase does not post GL entries — prepares matched documents for Accounting.

**Doc:** [FINANCE_MODULE_ARCHITECTURE.md §Appendix A](../finance/FINANCE_MODULE_ARCHITECTURE.md)

---

## 20. Future Compatibility

Purchase supports all AgainERP industries through configuration and Core contacts — not schema forks.

| Industry | Purchase Features |
|----------|---------------------|
| **Retail / Ecommerce** | Reorder from Inventory, vendor catalogs |
| **Manufacturing** | MRP-driven PO, raw material contracts |
| **Hospital** | Medical device vendors, batch/expiry on receipt, regulated approvals |
| **Restaurant** | Ingredient vendors, FEFO receipt, contract pricing |
| **Construction** | Project-linked PO lines, service POs |
| **Wholesale B2B** | Blanket contracts, volume tiers |
| **Marketplace** | Multi-vendor = multi `contact_id`; seller payouts separate |
| **Public sector** | Multi-level approval, tender/RFQ audit trail |

### Extension Rules

```text
✅ Vendor as Core contact with purchase_vendor_profiles
✅ PO lines reference Product Master variants
✅ Industry-specific approval policies
✅ Contract and RFQ for regulated sourcing

❌ hospital_vendors table separate from contacts
❌ Duplicate product catalog in Purchase
❌ Purchase module writing inventory qty directly
❌ Purchase posting GL without Accounting module
```

---

## Architecture Rules

| # | Rule |
|---|------|
| 1 | **Independent module** — full UX at `/purchase/*` |
| 2 | **Vendors via Core contacts** — no duplicate vendor master |
| 3 | **Product Master consumer** — PO lines link variants, not duplicate products |
| 4 | **Inventory owns stock** — receipts emit events; Inventory posts movements |
| 5 | **Finance owns payables** — bills hand off to Accounting |
| 6 | **Approval enabled** — PO, bill exceptions, contracts |
| 7 | **Activity enabled** — all documents auditable |
| 8 | **AI enabled** — Purchase Agent for sourcing and match assist |
| 9 | **Event driven** — `purchase.*` events for all subscribers |
| 10 | **Three-way match** — PO · Receipt · Bill alignment |
| 11 | **API first** — `/api/v1/purchase/` |
| 12 | **Documentation before code** — [PRE_CODE_GATE.md](../../PRE_CODE_GATE.md) |

### Anti-Patterns (Forbidden)

```text
❌ purchase_vendors duplicating contacts
❌ PO line without Product Master reference (except approved service lines)
❌ Direct inventory qty update from Purchase
❌ GL posting from Purchase module
❌ Skipping receipt before bill match (policy violation)
```

---

## Appendix A — Database Tables (Planned)

| Table | Purpose |
|-------|---------|
| `purchase_vendor_profiles` | Vendor extension on Core contact |
| `purchase_vendor_items` | Vendor SKU mapping |
| `purchase_rfq` / `_items` / `_vendors` | RFQ |
| `purchase_rfq_responses` / `_response_items` | Quotations |
| `purchase_orders` / `_order_items` | PO |
| `purchase_order_status_history` | Status audit |
| `purchase_receipts` / `_receipt_items` | Goods receipt |
| `purchase_vendor_bills` / `_bill_items` | Vendor bills |
| `purchase_returns` / `_return_items` | Vendor returns |
| `purchase_contracts` / `_contract_items` | Framework contracts |
| `purchase_vendor_ratings` | Performance scores |

**Reference:** [MASTER_DATABASE_ARCHITECTURE.md](../../database/MASTER_DATABASE_ARCHITECTURE.md)

---

## Appendix B — Domain Events

| Event | Subscribers |
|-------|-------------|
| `purchase.rfq.sent` | Notifications, vendor portal |
| `purchase.rfq.awarded` | Analytics, PO draft |
| `purchase.order.confirmed` | Notifications |
| `purchase.order.approved` | Notifications, vendor send |
| `purchase.order.sent` | Vendor EDI/email |
| `purchase.receipt.completed` | **Inventory**, Catalog cost, Accounting GRNI |
| `purchase.bill.posted` | **Accounting** AP |
| `purchase.bill.matched` | Analytics |
| `purchase.return.completed` | Inventory, Accounting credit |
| `purchase.contract.expiring` | Dashboard, AI Agent |
| `purchase.vendor.rated` | Analytics |

### Subscribed Events

| Event | Source | Purchase Action |
|-------|--------|-----------------|
| `inventory.stock.low` | Inventory | Suggest draft PO |
| `inventory.stock.below_reorder` | Inventory | Reorder workflow |
| `sales.order.drop_ship` | Sales | Create PO (future) |
| `catalog.product.created` | Catalog | Enable on vendor catalog |

---

## Appendix C — API Surface (Planned)

Base: `/api/v1/purchase/`

| Group | Endpoints |
|-------|-----------|
| Vendors | `GET/POST /vendors`, `GET/PATCH /vendors/{id}` |
| RFQ | `GET/POST /rfq`, `POST /rfq/{id}/send`, `POST /rfq/{id}/award` |
| Quotations | `GET/POST /quotations` |
| Orders | `GET/POST /orders`, `POST /orders/{id}/approve`, `POST /orders/{id}/send` |
| Receipts | `GET/POST /receipts`, `POST /receipts/{id}/post` |
| Bills | `GET/POST /bills`, `POST /bills/{id}/match`, `POST /bills/{id}/post` |
| Returns | `GET/POST /returns`, `POST /returns/{id}/approve` |
| Contracts | `GET/POST /contracts`, `POST /contracts/{id}/activate` |
| Reports | `GET /reports/spend`, `GET /reports/open-pos` |

Vendor portal (future): `/api/v1/purchase/vendor-portal/*`

---

## Appendix D — Related Documents

| Document | Relationship |
|----------|--------------|
| [PURCHASE_WORKFLOW.md](./PURCHASE_WORKFLOW.md) | Workflow state machines — RFQ, PO, receiving, bill, return |
| [PRODUCT_MASTER_ARCHITECTURE.md](../core/PRODUCT_MASTER_ARCHITECTURE.md) | Product identity on PO lines |
| [INVENTORY_MODULE_ARCHITECTURE.md](../inventory/INVENTORY_MODULE_ARCHITECTURE.md) | Receipt → stock |
| [SALES_MODULE_ARCHITECTURE.md](../sales/SALES_MODULE_ARCHITECTURE.md) | Drop-ship from sales order (future) |
| [modules/ecommerce/orders/ARCHITECTURE.md](../ecommerce/orders/ARCHITECTURE.md) | Commerce order engine |
| [ACTIVITY_CHATTER_ARCHITECTURE.md](../core/ACTIVITY_CHATTER_ARCHITECTURE.md) | Activity platform |
| [core/entities/contacts.md](../../core/entities/contacts.md) | Vendor master |
| [core/engines/APPROVAL_ENGINE_ARCHITECTURE.md](../../core/engines/APPROVAL_ENGINE_ARCHITECTURE.md) | Approvals |
| [FINANCE_MODULE_ARCHITECTURE.md](../finance/FINANCE_MODULE_ARCHITECTURE.md) | GL, AP, posting rules |
| [Architecture.md](./Architecture.md) | Legacy purchase doc (superseded scope) |

---

## Document Control

| Field | Value |
|-------|-------|
| **Owner** | Platform Team · Purchase Domain |
| **Reviewers** | Architecture, Procurement, Inventory, Finance |
| **Next Review** | At database implementation gate |
| **Status Gate** | Documentation First — Ready for UI/UX Planning |

**Changelog:** [CHANGELOG.md](../../CHANGELOG.md)
