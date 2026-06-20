# Finance Module — UI Implementation Plan

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-20  
> **Route prefix:** `/finance`  
> **Nav group:** Finance & Accounting (`nav.finance`)  
> **Architecture source:** [FINANCE_MODULE_ARCHITECTURE.md](./FINANCE_MODULE_ARCHITECTURE.md)  
> **UI Blueprint source:** [FINANCE_UI_BLUEPRINT.md](./FINANCE_UI_BLUEPRINT.md)

---

## 1. Scope

Full Finance module UI prototype — all 12 sub-pages from Dashboard to Audit.  
Prototype mode: mock data only, no real API calls, `toast` for actions.

---

## 2. Navigation Structure

```
Finance & Accounting  (nav.finance)
└── Finance  (icon: Landmark)  /finance
    ├── Dashboard              /finance
    ├── Chart of Accounts      /finance/chart-of-accounts
    ├── Journal Entries        /finance/journals
    ├── Invoices (AR)          /finance/invoices
    ├── Bills (AP)             /finance/bills
    ├── Receipts               /finance/receipts
    ├── Payments               /finance/payments
    ├── Expenses               /finance/expenses
    ├── Banking                /finance/banking
    ├── Cheque Register        /finance/cheques
    ├── Tax                    /finance/tax
    ├── Reports                /finance/reports
    └── Audit Log              /finance/audit
```

---

## 3. Page Inventory

| # | Page | Route | Component | Priority |
|---|------|-------|-----------|----------|
| 1 | **Dashboard** | `/finance` | `finance-dashboard.tsx` | P0 |
| 2 | **Chart of Accounts** | `/finance/chart-of-accounts` | `chart-of-accounts.tsx` | P0 |
| 3 | **Journal Entries** | `/finance/journals` | `journal-entries.tsx` | P0 |
| 4 | **Invoices (AR)** | `/finance/invoices` | `ar-invoices.tsx` | P0 |
| 5 | **Bills (AP)** | `/finance/bills` | `ap-bills.tsx` | P0 |
| 6 | **Receipts** | `/finance/receipts` | `receipts.tsx` | P1 |
| 7 | **Payments** | `/finance/payments` | `payments.tsx` | P1 |
| 8 | **Expenses** | `/finance/expenses` | `expense-claims.tsx` | P1 |
| 9 | **Banking** | `/finance/banking` | `banking.tsx` | P1 |
| 10 | **Cheque Register** | `/finance/cheques` | `cheque-register.tsx` | P1 |
| 11 | **Tax** | `/finance/tax` | `tax-management.tsx` | P2 |
| 12 | **Reports** | `/finance/reports` | `finance-reports.tsx` | P2 |
| 13 | **Audit Log** | `/finance/audit` | `audit-log.tsx` | P2 |

All pages: `"use client"` + `Suspense` wrapper + `min-h-[calc(100vh-2.75rem-1.5rem)]`

---

## 4. Mock Data Plan

**File:** `src/lib/mock-data/finance.ts`

### 4.1 Types & Seeds

| Export | Type | Records | Purpose |
|--------|------|---------|---------|
| `CoaAccount` | type | 40 | Chart of accounts tree |
| `coaSeed` | `CoaAccount[]` | 40 | Full COA (5 root types → sub-accounts) |
| `JournalEntry` + `JournalLine` | types | — | Double-entry header + lines |
| `journalEntriesSeed` | `JournalEntry[]` | 20 | Mixed journal types + statuses |
| `ArInvoice` | type | — | Customer invoice + open balance |
| `arInvoicesSeed` | `ArInvoice[]` | 20 | Various statuses, aging buckets |
| `ApBill` | type | — | Vendor bill + payment info |
| `apBillsSeed` | `ApBill[]` | 15 | Various statuses |
| `Receipt` | type | — | Inbound payment |
| `receiptsSeed` | `Receipt[]` | 12 | Allocated to AR |
| `Payment` | type | — | Outbound payment |
| `paymentsSeed` | `Payment[]` | 12 | Allocated to AP |
| `ExpenseClaim` | type | — | Employee claim |
| `expensesSeed` | `ExpenseClaim[]` | 10 | Approval workflow states |
| `BankAccount` | type | — | Bank account + balance |
| `bankAccountsSeed` | `BankAccount[]` | 3 | Dhaka Bank, BRAC Bank, Dutch-Bangla |
| `BankStatement` | type | — | Statement line for reconciliation |
| `bankStatementsSeed` | `BankStatement[]` | 20 | Mix of matched/unmatched |
| `TaxRate` | type | — | VAT rate config |
| `taxRatesSeed` | `TaxRate[]` | 5 | 15% VAT, 0%, exempt, etc. |
| `financeDashboardKpis` | const | — | Cash, AR, AP, revenue MTD |
| `plSnapshotData` | const | — | 6-month P&L for chart |
| `arAgingBuckets` | const | — | Current/30/60/90+ |
| `apAgingBuckets` | const | — | Current/30/60/90+ |

### 4.2 Key constants

```ts
// COA account type roots
type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense"

// Journal statuses
type JournalStatus = "draft" | "posted" | "reversed"

// Journal types
type JournalType = "SAL" | "PUR" | "BNK" | "CSH" | "MISC" | "INV" | "PAY" | "TAX"

// Invoice / Bill statuses
type DocStatus = "draft" | "posted" | "partial" | "paid" | "overdue" | "written_off"

// Expense claim statuses
type ExpenseStatus = "draft" | "submitted" | "approved" | "rejected" | "reimbursed"
```

---

## 5. Per-Page Design Spec

### 5.1 Dashboard `/finance`

**Layout:** 4-col KPI grid + charts + module cards

| Section | Content |
|---------|---------|
| Period banner | "Jun 2026 — Open" green strip |
| KPI row (4) | Cash balance · AR outstanding · AP outstanding · Revenue MTD |
| P&L chart + Bank balances | 2/3 + 1/3 split |
| Upcoming payments + Tax summary | 1/2 + 1/2 |
| Module cards (8) | COA · Journals · AR · AP · Receipts · Payments · Banking · Reports |
| AI insights strip | 3 finance AI cards (anomaly · forecast · suggestion) |
| Quick actions | Record Receipt · Record Payment · New JE · Run P&L |

### 5.2 Chart of Accounts `/finance/chart-of-accounts`

**Layout:** Left tree + right detail panel

| Element | Detail |
|---------|--------|
| Tree | 5 root types (Asset/Liability/Equity/Revenue/Expense), collapsible |
| Each account | Code badge + Name + Type icon + Balance |
| Search | Filter by code or name |
| Detail panel | Account info · balance · YTD · recent GL lines |
| Actions | Add account · Edit · Deactivate |
| COA templates | Dropdown: Retail / Services / Manufacturing |

### 5.3 Journal Entries `/finance/journals`

**Layout:** Filter strip + AG Grid + detail Sheet

| Column | Detail |
|--------|--------|
| Entry # | Monospace, pinned left |
| Journal type | SAL/PUR/BNK/MISC etc. pill |
| Date | Accounting date |
| Reference | External ref |
| Description | — |
| Debit total | Right-aligned |
| Credit total | Right-aligned |
| Status | Draft/Posted/Reversed badge |
| Source | Link chip |

Sheet: full DR/CR lines grid, balance footer (must balance), Post/Reverse actions

### 5.4 Invoices (AR) `/finance/invoices`

**Layout:** KPI row + status tabs + AG Grid + detail Sheet

| KPI | Value |
|-----|-------|
| Total AR | ৳ outstanding |
| Overdue | count + amount |
| Due this week | count |
| Avg days overdue | — |

Columns: Invoice # · Customer · Date · Due · Total · Residual · Status · Aging bucket

Sheet: Invoice lines · Outstanding · Payment collection · Activity

### 5.5 Bills (AP) `/finance/bills`

Mirror of AR with vendor focus.

Columns: Bill # · Vendor · Bill date · Due · Total · Residual · Match status · Status

Sheet: Bill lines · Three-way match indicator · Payment schedule · Approval

### 5.6 Receipts `/finance/receipts`

AG Grid: Receipt # · Customer · Date · Amount · Payment method · Allocated to · Status

### 5.7 Payments `/finance/payments`

AG Grid: Payment # · Vendor · Date · Amount · Bank account · Allocated to · Status

Batch payment panel: select multiple AP bills → create batch payment

### 5.8 Expenses `/finance/expenses`

AG Grid: Claim # · Employee · Date · Amount · Category · Status · Approver

Sheet: Expense lines with receipts · Approval workflow · Post action

### 5.9 Banking `/finance/banking`

**Layout:** Bank account cards + statement list + reconciliation workspace

Bank cards: Bank name · Account # · GL balance · Statement balance · Unreconciled count

Reconciliation workspace (split-pane):
- Left: Bank statement lines (imported/manual)
- Right: System transactions (receipts/payments/JE)
- Match/unmatch actions · AI suggest · Difference footer

### 5.10 Tax `/finance/tax`

**Layout:** Config tabs + Returns list

Tabs: Tax Rates · Rules · Returns · Filing Status

Rate list: Tax name · Rate % · Type (output/input) · GL account · Active

Returns: Period · Gross sales · Output tax · Input tax · Net payable · Status

### 5.11 Reports `/finance/reports`

**Layout:** Report hub cards + embedded report view

Reports: Profit & Loss · Balance Sheet · Trial Balance · Cash Flow · AR Aging · AP Aging · General Ledger · Revenue

Each: Period selector · Print/Export · Drill-down to journal entries

### 5.13 Cheque Register `/finance/cheques`

**Layout:** KPI row + direction tabs + AG Grid + detail Sheet

| KPI | Value |
|-----|-------|
| Collect This Week | Received PDC due for deposit |
| Pay This Week | Issued PDC due for presentation |
| Pending Deposit | Maturity passed — not yet deposited |
| Bounced | Requires follow-up |

Columns: Cheque # · Direction (Received/Issued) · Party · Bank · Amount · Issue · **Maturity** · Linked Doc · Status

Sheet actions: Deposit · Present · Mark Cleared · Mark Bounced · Re-present

One AR/AP document → multiple cheques with different maturity dates (schedule).

Status flow: `issued → deposited → cleared` / `bounced → re-presented`

**Views:** Register (AG Grid) · PDC Calendar (`?tab=calendar`) — month grid with collect/pay chips per day, overdue panel, upcoming 14-day list

---

### 5.12 Audit Log `/finance/audit`

**Layout:** Filter strip + read-only AG Grid

Columns: Timestamp · User · Action · Entity · Entity ID · Before → After summary

Filters: User · Action type · Entity · Date range

---

## 6. Shared UI Conventions

| Convention | Value |
|------------|-------|
| **DataTable** | **Product List standard** — `AgGridReact` · `ag-theme-quartz` · `control-border` · `bg-card` · pagination 25 · mobile card fallback — [datatable-and-drawer-standard.md](../../04-uiux/standards/datatable-and-drawer-standard.md) |
| **Drawer CRUD** | `?create=1` · `?view={id}` · `?edit={id}` — all in right Sheet; mobile `w-full` + scroll inside |
| Money format | `formatBdt()` — ৳ locale |
| AG Grid theme | `ag-theme-quartz` + `control-border` + `bg-card` + `theme="legacy"` |
| Dark mode | `useIsDark()` → `ag-theme-quartz-dark` |
| Sheet | `Sheet` + `SheetContent` only (no SheetHeader/Footer) · `max-w-3xl` · `p-0` · inner `min-h-0` scroll |
| Page wrapper | `min-h-[calc(100vh-2.75rem-1.5rem)]` |
| Subtitle | `AgainERP › Finance › [Page]` |
| Status badges | `Badge` with `success/warning/muted/secondary` variants |
| Posted = immutable | No edit on posted entries — "Reverse" action only |
| Period banner | Green strip on all finance pages |

### 6.1 Alignment status (Finance lists)

All finance AG Grid pages converged to Product List standard ✅

| Page | URL params | Mobile cards | Flex grid | Pagination | Row menu |
|------|------------|--------------|-----------|------------|----------|
| Journals | ✅ `?create/?view/?edit` | ✅ | ✅ | ✅ 25 | ✅ View/Edit |
| Invoices (AR) | ✅ `?view/?create` | ✅ | ✅ | ✅ 25 | ✅ View |
| Bills (AP) | ✅ `?view/?create` | ✅ | ✅ | ✅ 25 | ✅ View |
| Receipts | ✅ `?view/?create` | ✅ | ✅ | ✅ 25 | ✅ View |
| Payments | ✅ `?view/?create` | ✅ | ✅ | ✅ 25 | ✅ View |
| Expenses | ✅ `?view/?create` | ✅ | ✅ | ✅ 25 | ✅ View |
| Audit Log | ✅ read-only AG Grid | ✅ | ✅ | ✅ 25 | — read-only |
| Cheque Register | ✅ `?view/?create/?tab=calendar` | ✅ | ✅ | ✅ 25 | ✅ View |

**Document drawer Cheques tabs:** Receipts · Payments · AR Invoices · AP Bills — shared `finance-cheque-store` ✅

Drawer standard: `max-w-3xl gap-0 overflow-hidden p-0 [&>button.absolute]:hidden` + inner scroll div — all pages ✅

---

## 7. File Structure

```
src/
├── lib/mock-data/
│   └── finance.ts                    ← all mock data
├── components/finance/
│   ├── finance-dashboard.tsx
│   ├── chart-of-accounts.tsx
│   ├── journal-entries.tsx
│   ├── ar-invoices.tsx
│   ├── ap-bills.tsx
│   ├── receipts.tsx
│   ├── payments.tsx
│   ├── expense-claims.tsx
│   ├── banking.tsx
│   ├── tax-management.tsx
│   ├── finance-reports.tsx
│   ├── audit-log.tsx
│   ├── cheque-register.tsx
│   ├── cheque-form-sheet.tsx
│   ├── cheque-pdc-calendar.tsx
│   └── document-cheques-tab.tsx
├── lib/store/
│   └── finance-cheque-store.ts
└── app/(admin)/finance/
    ├── page.tsx                       ← Dashboard
    ├── chart-of-accounts/page.tsx
    ├── journals/page.tsx
    ├── invoices/page.tsx
    ├── bills/page.tsx
    ├── receipts/page.tsx
    ├── payments/page.tsx
    ├── expenses/page.tsx
    ├── banking/page.tsx
    ├── tax/page.tsx
    ├── reports/page.tsx
    ├── audit/page.tsx
    └── cheques/page.tsx
```

---

## 8. Build Order

1. `finance.ts` — mock data (all types + seeds)
2. `navigation-config.ts` — add `nav.finance` group
3. `finance-dashboard.tsx` + `/finance/page.tsx`
4. `chart-of-accounts.tsx` + page
5. `journal-entries.tsx` + page
6. `ar-invoices.tsx` + page
7. `ap-bills.tsx` + page
8. `receipts.tsx` + `payments.tsx` + pages
9. `expense-claims.tsx` + page
10. `banking.tsx` + page
11. `tax-management.tsx` + page
12. `finance-reports.tsx` + page
13. `audit-log.tsx` + page

---

## 9. Change History

| Date | Change |
|------|--------|
| 2026-06-20 | v1.0 — Initial implementation plan |
| 2026-06-20 | §6 — Product List DataTable + drawer URL standard; Finance alignment backlog |
| 2026-06-20 | Phase 3 — Payments batch · Expenses approval sheet · Tax tabs · Reports embedded view |
| 2026-06-21 | §6.1 — All 7 finance list pages aligned to Product List DataTable standard (URL params, flex layout, pagination 25, row menu, mobile cards, drawer standard) |
| 2026-06-21 | Rules — DataTable MANDATORY rule + Dark mode mandatory section added to project-common-rules.mdc + PROJECT_COMMON_RULES.md |
| 2026-06-21 | Phase 4 — Cheque Register (PDC schedule, received/issued, maturity KPIs, deposit/clear/bounce actions) |
| 2026-06-21 | Phase 4d — Receipt/Payment drawer Cheques tab + shared `finance-cheque-store` |
| 2026-06-21 | Phase 5 — Mock data expand (AR 20, AP 15) + `getArInvoiceLines` / `getApBillLines` fallbacks |
| 2026-06-21 | Phase 5b — AR/AP invoice & bill drawer Cheques tab + Register PDC / Issue PDC actions |
