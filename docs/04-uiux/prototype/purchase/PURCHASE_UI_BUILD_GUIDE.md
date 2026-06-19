# Purchase Module — UI Build Guide (Prototype Only)

## Purpose
Documentation: PURCHASE UI BUILD GUIDE.

## When To Read
Read only if your task involves purchase ui build guide.

## Related Files
- [Cursor entry](../../../BRAIN.md)

## Read Next
- [Doc map](../../../PROJECT_MAP.md)

---

> **Status:** Active playbook  
> **Scope:** UI only — mock data, no API/DB/auth  
> **Parent:** [UI_PROTOTYPE_MODE.md](../../strategy/UI_PROTOTYPE_MODE.md) · [ECOMMERCE_ADMIN_PROTOTYPE_PHASE1.md](../../strategy/ECOMMERCE_ADMIN_PROTOTYPE_PHASE1.md)  
> **Architecture:** [PURCHASE_MODULE_ARCHITECTURE.md](../../../03-business-modules/purchase/PURCHASE_MODULE_ARCHITECTURE.md)  
> **Workflows:** [PURCHASE_WORKFLOW.md](../../../03-business-modules/purchase/PURCHASE_WORKFLOW.md)  
> **As-built (partial):** [SUPPLIERS_IMPLEMENTED_DESIGN.md](./SUPPLIERS_IMPLEMENTED_DESIGN.md)


## When To Read
Read only if your task involves purchase ui build guide.

## Related Files
- [Cursor entry](../../../BRAIN.md)

## Read Next
- [Doc map](../../../PROJECT_MAP.md)

---

Prototype route namespace: **`/suppliers/*`** (production target: **`/purchase/*`**)

---

## 1. Module কীভাবে কাজ করবে (docs summary)

Purchase = **Procure-to-Pay (P2P)** spine — vendor থেকে কেনা থেকে payment পর্যন্ত।

```text
Need / Reorder
     ↓
RFQ (optional) → Vendor Quotation → Award
     ↓
Purchase Order → Approved → Ordered (vendor-এ পাঠানো)
     ↓
Goods Receipt → Inventory Stock In (+qty)
     ↓
Vendor Bill → Three-way Match → Finance AP
     ↓
Payment (Finance)
     ↓
Return / Credit (প্রয়োজনে)
```

| Document | Entity | Prototype screen |
|----------|--------|------------------|
| PURCHASE_WORKFLOW §1 | RFQ | `/suppliers/rfq` + detail |
| PURCHASE_WORKFLOW §1 | Quotation | `/suppliers/quotations` (নতুন) |
| PURCHASE_WORKFLOW §2 | Purchase Order | `/suppliers/purchase-orders` + detail + create |
| PURCHASE_WORKFLOW §3 | Goods Receipt | `/suppliers/receipts` (নতুন) |
| PURCHASE_WORKFLOW §4 | Vendor Bill | `/suppliers/bills` (নতুন) |
| PURCHASE_WORKFLOW §5 | Return | `/suppliers/returns` (নতুন) |
| PURCHASE_MODULE_ARCHITECTURE §4 | Vendor | `/suppliers/all` + `[id]` ✅ |
| Inventory cross-link | Stock feed | `/suppliers/stock-feed` ✅ |

**Rule (prototype):** Purchase orchestrates documents; Inventory stock change ও Finance GL — শুধু toast/link stub, real API নয়।

---

## 2. এখন কী আছে vs কী বাকি

### ✅ Built (2026-06-15)

| Screen | Route | Code |
|--------|-------|------|
| Summary dashboard | `/suppliers` | `supplier-control-center.tsx` |
| All Suppliers | `/suppliers/all` | same shell |
| Vendor detail | `/suppliers/[id]` | `supplier-detail-workspace.tsx` |
| PO list (basic table) | `/suppliers/purchase-orders` | tab in control center |
| RFQ list (basic table) | `/suppliers/rfq` | tab in control center |
| Stock Feed | `/suppliers/stock-feed` | tab in control center |
| Vendor ↔ product map | Product drawer | `map-supplier-sheet.tsx` |

### ❌ Not built yet (UI backlog)

| Priority | Screen | Route (prototype) | Workflow ref |
|----------|--------|-------------------|--------------|
| P1 | PO detail workspace | `/suppliers/purchase-orders/[id]` | §2 | ✅ |
| P1 | Create PO | `/suppliers/purchase-orders/create` | §2 | ✅ |
| P1 | PO AG Grid list (full) | `/suppliers/purchase-orders` | §2 | ✅ |
| P2 | RFQ detail + create | `/suppliers/rfq/[id]`, `/create` | §1 | ✅ |
| P2 | Quotations list | `/suppliers/quotations` | §1 | ✅ |
| P3 | Goods Receipts list + detail | `/suppliers/receipts` | §3 | ✅ |
| P4 | Vendor Bills list + detail | `/suppliers/bills` | §4 | ✅ |
| P5 | Returns list + detail | `/suppliers/returns` | §5 | ✅ |
| P6 | Reports stub | `/suppliers/reports` | — |
| P6 | Settings stub | `/suppliers/settings` | §6 policies |

---

## 3. UI structure standard (follow করতে হবে)

[module-ui-standard.md](../../standards/module-ui-standard.md) অনুযায়ী প্রতি entity-তে:

| View | Pattern | Copy from |
|------|---------|-----------|
| List | AG Grid + filters + bulk bar | `components/orders/order-grid.tsx` |
| Details | Record header + tabs + chatter | `components/orders/order-detail-workspace.tsx` |
| Create | Form page or sheet | `app/(admin)/orders/create/page.tsx` |
| Dashboard | KPI + charts | `components/orders/orders-dashboard.tsx` |

**Shared shell (already exists):**

```
SupplierPageShell → SupplierNav + content
```

**Tri-file docs (প্রতি screen):**

```
docs/ui-prototype/purchase/{Screen}.md
docs/ui-prototype/purchase/{Screen}Review.md
docs/ui-prototype/purchase/{Screen}Changes.md
```

---

## 4. Target folder structure

```text
apps/web/src/
├── app/(admin)/suppliers/
│   ├── page.tsx                          # Summary ✅
│   ├── all/page.tsx                      # Vendors ✅
│   ├── [id]/page.tsx                     # Vendor detail ✅
│   ├── purchase-orders/
│   │   ├── page.tsx                      # PO list ✅ (upgrade)
│   │   ├── create/page.tsx               # P1
│   │   └── [id]/page.tsx                 # P1
│   ├── rfq/
│   │   ├── page.tsx                      # ✅ (upgrade)
│   │   ├── create/page.tsx               # P2
│   │   └── [id]/page.tsx                 # P2
│   ├── quotations/page.tsx               # P2
│   ├── receipts/
│   │   ├── page.tsx                      # P3
│   │   └── [id]/page.tsx                 # P3
│   ├── bills/
│   │   ├── page.tsx                      # P4
│   │   └── [id]/page.tsx                 # P4
│   ├── returns/
│   │   ├── page.tsx                      # P5
│   │   └── [id]/page.tsx                 # P5
│   ├── reports/page.tsx                  # P6 stub
│   └── settings/page.tsx                 # P6 stub
├── components/purchase/                    # NEW namespace (recommended)
│   ├── purchase-order-grid.tsx
│   ├── purchase-order-detail.tsx
│   ├── purchase-order-form.tsx
│   ├── rfq-grid.tsx
│   ├── rfq-detail.tsx
│   ├── receipt-grid.tsx
│   ├── receipt-detail.tsx
│   ├── bill-grid.tsx
│   ├── bill-detail.tsx
│   ├── return-grid.tsx
│   └── return-detail.tsx
└── lib/mock-data/
    ├── suppliers.ts                      # vendors + seed PO/RFQ ✅
    ├── purchase-orders.ts                # P1 split (optional)
    ├── purchase-receipts.ts              # P3
    ├── purchase-bills.ts                 # P4
    └── purchase-returns.ts             # P5
```

> **Note:** Existing `suppliers.ts` mock data রাখা যায়; entity বড় হলে আলাদা file-এ split করুন।

---

## 5. Step-by-step commands

**প্রতিটি phase শেষে:** `npm run dev` → route check → tri-file doc update।

### Step 0 — Environment

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/againerp/apps/web
npm install
npm run dev
# → http://localhost:3000/suppliers
```

### Step 1 — Docs scaffold (প্রথমে spec, তারপর code)

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/againerp/docs/ui-prototype/purchase

# P1 — Purchase Orders
touch PurchaseOrders.md PurchaseOrdersReview.md PurchaseOrdersChanges.md
touch PurchaseOrderDetail.md PurchaseOrderDetailReview.md PurchaseOrderDetailChanges.md
touch CreatePurchaseOrder.md CreatePurchaseOrderReview.md CreatePurchaseOrderChanges.md

# P2 — RFQ + Quotations
touch RfqList.md RfqDetail.md Quotations.md

# P3–P5
touch GoodsReceipts.md VendorBills.md PurchaseReturns.md

# P6
touch PurchaseReports.md PurchaseSettings.md
```

**PurchaseOrders.md template (copy করে শুরু):**

- Route, purpose, columns, filters, status badges (draft → pending_approval → approved → ordered → partially_received → received → closed)
- Bulk: submit, approve, send, cancel
- Link: PURCHASE_WORKFLOW §2

---

### Step 2 — Component folders

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/againerp/apps/web

mkdir -p src/components/purchase
mkdir -p src/app/\(admin\)/suppliers/purchase-orders/create
mkdir -p src/app/\(admin\)/suppliers/purchase-orders/\[id\]
mkdir -p src/app/\(admin\)/suppliers/rfq/create
mkdir -p src/app/\(admin\)/suppliers/rfq/\[id\]
mkdir -p src/app/\(admin\)/suppliers/quotations
mkdir -p src/app/\(admin\)/suppliers/receipts/\[id\]
mkdir -p src/app/\(admin\)/suppliers/bills/\[id\]
mkdir -p src/app/\(admin\)/suppliers/returns/\[id\]
mkdir -p src/app/\(admin\)/suppliers/reports
mkdir -p src/app/\(admin\)/suppliers/settings
```

---

### Step 3 — P1 Purchase Orders (সবচেয়ে গুরুত্বপূর্ণ)

#### 3a. Mock data types (PURCHASE_WORKFLOW §2 states)

`lib/mock-data/purchase-orders.ts` তৈরি করুন অথবা `suppliers.ts` extend করুন:

```typescript
export type PurchaseOrderStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "ordered"
  | "partially_received"
  | "received"
  | "closed"
  | "rejected"
  | "cancelled";
```

Line fields: `quantity_ordered`, `quantity_received`, `quantity_billed`, `unit_price`, `variant_id`.

#### 3b. Grid component

```bash
# Reference copy (structure only — rename imports after)
cp src/components/orders/order-grid.tsx src/components/purchase/purchase-order-grid.tsx
```

Customize:

- Columns: PO #, Vendor, Date, Expected, Total, Status, Received %, Buyer
- Filters: status, vendor, date range, warehouse
- Bulk: Submit · Approve · Send to vendor · Cancel
- Row menu: View · Edit · Receive goods · Activity

#### 3c. Detail workspace

```bash
cp src/components/orders/order-detail-workspace.tsx src/components/purchase/purchase-order-detail.tsx
```

Tabs (PURCHASE_MODULE_ARCHITECTURE):

| Tab | Content |
|-----|---------|
| Lines | SKU, qty, price, received/billed qty |
| Receipts | Linked GR list |
| Bills | Linked vendor bills |
| Approvals | Approval chain stub |
| Activity | Chatter / timeline |

Header actions: **Submit** · **Approve** · **Send** · **Receive** · **Create bill**

#### 3d. Routes

`purchase-orders/page.tsx`:

```tsx
"use client";
import { SupplierPageShell } from "@/components/suppliers/supplier-page-shell";
import { PurchaseOrderGrid } from "@/components/purchase/purchase-order-grid";

export default function PurchaseOrdersPage() {
  return (
    <SupplierPageShell>
      <PurchaseOrderGrid />
    </SupplierPageShell>
  );
}
```

`purchase-orders/[id]/page.tsx` → `PurchaseOrderDetail`  
`purchase-orders/create/page.tsx` → `PurchaseOrderForm`

#### 3e. Navigation

`lib/navigation.ts` — menu items ঠিক আছে; নতুন routes auto-link করতে `supplier-nav.tsx` tab map update করুন।

---

### Step 4 — P2 RFQ + Quotations

```bash
cp src/components/purchase/purchase-order-grid.tsx src/components/purchase/rfq-grid.tsx
cp src/components/purchase/purchase-order-detail.tsx src/components/purchase/rfq-detail.tsx
```

RFQ states (§1): `draft` → `sent` → `vendor_response` → `quotation` → `approved` → `po_created` → `closed`

RFQ detail extra: **Vendor comparison grid** (price, lead time, MOQ per vendor)

Quotations page: সব vendor quotes list — filter by RFQ, vendor, status (`submitted` / `accepted` / `rejected`)

---

### Step 5 — P3 Goods Receipts

```bash
touch src/lib/mock-data/purchase-receipts.ts
touch src/components/purchase/receipt-grid.tsx
touch src/components/purchase/receipt-detail.tsx
```

States (§3): `draft` → `receiving` → `qc_pending` → `posted` → `completed`

Detail: PO link, warehouse, batch/serial lines, **Post receipt** button → toast `inventory.stock_in.posted (mock)`

---

### Step 6 — P4 Vendor Bills

```bash
touch src/lib/mock-data/purchase-bills.ts
touch src/components/purchase/bill-grid.tsx
touch src/components/purchase/bill-detail.tsx
```

States (§4): `draft` → `unmatched` → `matched` → `exception` → `approved` → `posted` → `paid`

Detail: **Three-way match panel** (PO qty · Receipt qty · Bill qty · variance %)

---

### Step 7 — P5 Returns

```bash
touch src/lib/mock-data/purchase-returns.ts
touch src/components/purchase/return-grid.tsx
touch src/components/purchase/return-detail.tsx
```

States (§5): `requested` → `approved` → `shipped` → `vendor_received` → `credited`

Reason codes: defective, wrong_item, over_shipment, warranty, expired

---

### Step 8 — P6 Reports + Settings (stub)

```bash
# Minimal placeholder pages
for page in reports settings; do
  cat > "src/app/(admin)/suppliers/${page}/page.tsx" << 'EOF'
"use client";
import { SupplierPageShell } from "@/components/suppliers/supplier-page-shell";

export default function Page() {
  return (
    <SupplierPageShell>
      <div className="rounded-lg border border-dashed border-input p-12 text-center text-sm text-muted-foreground">
        Prototype stub — see PURCHASE_UI_BUILD_GUIDE.md
      </div>
    </SupplierPageShell>
  );
}
EOF
done
```

`navigation.ts`-এ Reports · Settings menu item যোগ করুন।

---

### Step 9 — Sidebar menu update

`apps/web/src/lib/navigation.ts` — Suppliers submenu:

```typescript
{ title: "All Suppliers", href: "/suppliers/all" },
{ title: "Purchase Orders", href: "/suppliers/purchase-orders" },
{ title: "RFQ", href: "/suppliers/rfq" },
{ title: "Quotations", href: "/suppliers/quotations" },      // new
{ title: "Goods Receipts", href: "/suppliers/receipts" },    // new
{ title: "Vendor Bills", href: "/suppliers/bills" },        // new
{ title: "Returns", href: "/suppliers/returns" },          // new
{ title: "Stock Feed", href: "/suppliers/stock-feed" },
{ title: "Reports", href: "/suppliers/reports" },           // new
{ title: "Settings", href: "/suppliers/settings" },         // new
{ title: "Summary", href: "/suppliers" },
```

`supplier-nav.tsx` — `tabFromPath` / `pathFromTab` same routes support করুন।

---

### Step 10 — Verify + document

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/againerp/apps/web
npx tsc --noEmit
npm run lint
```

Update:

- `docs/ui-prototype/purchase/README.md` — implemented table
- `docs/ui-prototype/purchase/SUPPLIERS_IMPLEMENTED_DESIGN.md` — as-built
- `docs/CHANGELOG.md` — one line per phase

---

## 6. Recommended build order (এক সপ্তাহ plan)

| Day | Phase | Deliverable | Test URL |
|-----|-------|-------------|----------|
| 1 | Docs P1 | PurchaseOrders.md + Detail + Create specs | — |
| 2 | P1 grid | Full PO list AG Grid | `/suppliers/purchase-orders` |
| 3 | P1 detail | PO workspace + approval stubs | `/suppliers/purchase-orders/po_1001` |
| 4 | P1 create | Create PO form | `/suppliers/purchase-orders/create` |
| 5 | P2 RFQ | RFQ detail + comparison | `/suppliers/rfq/rfq_1001` |
| 6 | P3 Receipt | Receipt list + post mock | `/suppliers/receipts` |
| 7 | P4 Bill | Bill + 3-way match UI | `/suppliers/bills` |

Returns, Reports, Settings — পরের sprint।

---

## 7. UI patterns checklist (প্রতি screen)

- [ ] Page title + count `(N)`
- [ ] Breadcrumb: `AgainERP › Purchase › …`
- [ ] Primary CTA: `+ Create …`
- [ ] Filter bar + Filters sheet
- [ ] Status badges (workflow states from PURCHASE_WORKFLOW)
- [ ] AG Grid desktop + mobile cards
- [ ] Bulk action bar on select
- [ ] Row ⋮ menu
- [ ] Activity icon → global drawer
- [ ] Empty state + clear filters
- [ ] Toast bottom-right (Sonner)
- [ ] Dark mode (`useIsDark` + ag-grid theme)
- [ ] Tri-file docs updated

---

## 8. Cross-module links (prototype)

| From | To | UX |
|------|-----|-----|
| PO detail | Receive | Create receipt draft |
| PO detail | Vendor | `/suppliers/[id]` |
| PO line | Product | `/catalog/products/[id]` |
| Receipt post | Inventory | Toast + link `/inventory` |
| Bill matched | Finance | Toast `accounting.bill.posted (mock)` |
| Product drawer | Create PO | Pre-fill vendor + lines from mapping |
| Inventory suggestions | PO draft | [PurchaseSuggestions.md](../inventory/PurchaseSuggestions.md) |

---

## 9. যা করবেন না (Phase 1 rules)

- ❌ `/api/v1/purchase/*` endpoints
- ❌ Database migrations (`purchase_*` tables)
- ❌ Real approval engine / workflow engine
- ❌ Auth / permissions enforcement
- ❌ Route rename `/suppliers` → `/purchase` (শেষে migration)

---

## 10. Quick reference — workflow states

### PO (`purchase.order`)

`draft` → `pending_approval` → `approved` → `ordered` → `partially_received` → `received` → `closed`

### RFQ (`purchase.rfq`)

`draft` → `sent` → `vendor_response` → `quotation` → `approved` → `po_created` → `closed`

### Receipt (`purchase.receipt`)

`draft` → `receiving` → `qc_pending` → `posted` → `completed`

### Bill (`purchase.bill`)

`draft` → `unmatched` → `matched` → `exception` → `approved` → `posted` → `paid`

### Return (`purchase.return`)

`requested` → `approved` → `shipped` → `vendor_received` → `credited`

---

## Related

- [README.md](./README.md) — screen index  
- [SUPPLIERS_IMPLEMENTED_DESIGN.md](./SUPPLIERS_IMPLEMENTED_DESIGN.md) — as-built vendors  
- [ENTITY_PURCHASE.md](../../../03-business-modules/purchase/ENTITY_PURCHASE.md) — field names  
- [Orders.md](../orders/Orders.md) — list/detail pattern reference  
- [ProductList.md](../catalog/products/ProductList.md) — AG Grid pattern reference  

**Last updated:** 2026-06-15
