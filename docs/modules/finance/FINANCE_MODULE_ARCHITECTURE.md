# AgainERP — Finance Module Architecture

> **Status:** Approved  
> **Version:** 1.0  
> **Module:** Finance (Finance & Accounting Foundation)  
> **Document Type:** Enterprise Architecture  
> **Phase:** Documentation First · UI/UX Planning  
> **Route Namespace:** `/finance/*`  
> **Governance:** [GOVERNANCE.md](../../GOVERNANCE.md) · **Standards:** [DEVELOPMENT_STANDARDS.md](../../DEVELOPMENT_STANDARDS.md)

**No backend code. No database implementation. No API implementation.**  
This document is the source of truth for **Finance as the platform financial system of record** — general ledger, receivables, payables, cash, tax, and statutory reporting.

### Step 12 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Finance & accounting foundation | §1 Module Vision |
| Route namespace `/finance/*` | §2 Dashboard (Navigation) |
| COA through Reconciliation | §3–§11 |
| Reports, Audit, Approval, Workflow, AI | §12–§16 |
| Permissions & UI/UX | §17 · §18 |
| P&L, Balance Sheet, Cash Flow, Tax, Revenue reports | §12 |
| Future: Ecommerce, ERP, Manufacturing, Hospital, School | Appendix E |

**Related:** [SALES_MODULE_ARCHITECTURE.md](../sales/SALES_MODULE_ARCHITECTURE.md) · [PURCHASE_MODULE_ARCHITECTURE.md](../purchase/PURCHASE_MODULE_ARCHITECTURE.md) · [APPROVAL_ENGINE_ARCHITECTURE.md](../../core/engines/APPROVAL_ENGINE_ARCHITECTURE.md) · [WORKFLOW_ENGINE_ARCHITECTURE.md](../../core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../core/ACTIVITY_CHATTER_ARCHITECTURE.md) · [MASTER_DATABASE_ARCHITECTURE.md](../../database/MASTER_DATABASE_ARCHITECTURE.md) · [modules/accounting/Architecture.md](../accounting/Architecture.md) (legacy draft)

---

## Executive Summary

**Finance** is AgainERP's **financial spine** — the only module authorized to post to the general ledger, close fiscal periods, reconcile bank accounts, and produce statutory financial statements.

| Principle | Rule |
|-----------|------|
| **Single GL owner** | Only Finance posts journal entries — no module writes GL directly |
| **Independent module** | Full admin UX at `/finance/*` — operable without Ecommerce |
| **Event-driven posting** | Sales, Purchase, Inventory, Payroll emit events → posting rules → journals |
| **Double-entry integrity** | Every entry balanced; posted entries immutable (reversal only) |
| **Core contacts master** | AR/AP sub-ledgers keyed on `contact_id` |
| **Multi-company & currency** | Company-scoped COA; FX on transaction and revaluation |
| **Approval native** | Large entries, period close, expense claims require human gates |
| **Audit everywhere** | Immutable audit log + Activity on all financial documents |
| **AI assisted** | Anomaly detection, reconciliation match, forecast — human approves |

**Table namespace:** `finance_*` · **API base:** `/api/v1/finance/`

> **Note:** Early draft docs used `accounting_*` prefix. Implementation aligns `finance_*` as the canonical Finance module namespace; see [MASTER_DATABASE_ARCHITECTURE.md](../../database/MASTER_DATABASE_ARCHITECTURE.md).

---

## 1. Module Vision

### Why Finance Exists as an Independent Module

Every operational module generates money movement — sales revenue, vendor spend, payroll, inventory valuation, ecommerce settlements. Without a dedicated Finance module:

| Problem | Impact |
|---------|--------|
| Each module posts its own "accounting" | Unbalanced books, audit failure |
| No single period close | Backdated edits corrupt reports |
| AR/AP scattered | Cash flow invisible |
| Tax computed in checkout only | Filing reports wrong |
| No bank reconciliation | Fraud and errors undetected |

Finance provides **one contract** for the chart of accounts, journals, posting rules, sub-ledgers, reconciliation, and financial reporting.

### Vision Statement

> **One ledger. One truth. Every transaction traceable from source to statement.**

Finance is the **system of record** for assets, liabilities, equity, revenue, and expenses — while operational modules remain experts in their domain documents.

### Platform Position

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         Finance Module (GL Owner)                        │
│   COA · Journals · AR/AP · Payments · Tax · Reconciliation · Reports    │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ posting rules (events)
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐     ┌─────────────────┐     ┌───────────────┐
│ Sales Module   │     │ Purchase Module  │     │ Ecommerce      │
│ Invoices · Pay │     │ Bills · Receipts │     │ Order payments │
└───────────────┘     └─────────────────┘     └───────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                ▼
                    Inventory · Payroll · POS · Expenses
                    (COGS · valuation · salary · cash)
```

### Relationship to Sibling Modules

| Module | Finance Role | Finance Does Not Own |
|--------|--------------|----------------------|
| **Sales** | Posts AR from `sales.invoice.posted` | Sales orders, shipments |
| **Purchase** | Posts AP from `purchase.bill.posted` | PO, goods receipt |
| **Ecommerce** | Settlement receipts from order payments | Checkout, cart |
| **Inventory** | COGS, valuation adjustments | Stock movements |
| **Marketing** | Loyalty liability reporting | Campaign execution |
| **CRM** | Read-only AR/revenue on timeline | Pipeline |
| **Core contacts** | Customer/vendor on sub-ledgers | Party master |
| **Payroll** (future) | Salary journals from payroll run | HR records |

### Finance vs Operational Documents

| Layer | Owner | Example |
|-------|-------|---------|
| **Commercial document** | Sales / Purchase | Sales invoice, vendor bill |
| **Financial posting** | Finance | Journal entry DR/CR |
| **Sub-ledger balance** | Finance | AR open item, AP aging |
| **Statement** | Finance | P&L, Balance Sheet |

Operational modules **prepare** documents and **emit events**. Finance **posts**, **reconciles**, and **reports**.

---

## 2. Dashboard

**Route:** `/finance`

Command center for cash position, receivables/payables health, period status, and AI finance alerts.

### Navigation Structure

**Route namespace:** `/finance/*`

```text
Finance
├── /finance                              Dashboard
├── /finance/chart-of-accounts            COA tree
├── /finance/journals                     Journal types & entries
├── /finance/journals/[id]                Journal entry detail
├── /finance/invoices                     Customer invoices (AR)
├── /finance/invoices/[id]                AR invoice detail
├── /finance/bills                        Vendor bills (AP)
├── /finance/bills/[id]                   AP bill detail
├── /finance/payments                     Outbound payments
├── /finance/payments/[id]                Payment detail
├── /finance/receipts                     Inbound receipts
├── /finance/receipts/[id]                Receipt detail
├── /finance/expenses                     Expense claims
├── /finance/expenses/[id]                Expense detail
├── /finance/tax                          Tax configuration & returns
├── /finance/reconciliation               Bank reconciliation
├── /finance/reconciliation/[id]          Reconciliation workspace
├── /finance/reports                      Financial reports hub
├── /finance/audit                        Audit log explorer
├── /finance/ai-insights                  AI Finance Assistant queue
└── /finance/settings                     Fiscal years, posting rules, banks
```

Finance appears as a **top-level sidebar module** — parallel to Sales, Purchase, and Inventory.

### Dashboard Widgets

| Widget | Source | Purpose |
|--------|--------|---------|
| **Cash balance** | Bank GL + unreconciled | Liquidity snapshot |
| **AR outstanding** | `finance_ar_open_items` | Total receivables |
| **AP outstanding** | `finance_ap_open_items` | Total payables |
| **Overdue AR/AP** | Aging buckets | Collection/payment priority |
| **Revenue MTD** | P&L slice | Month performance |
| **Expense MTD** | P&L slice | Spend tracking |
| **Net cash flow (30d)** | Cash flow report | Trend |
| **Period status** | `finance_periods` | Open / closing / locked |
| **Unposted documents** | Queue count | Work backlog |
| **Reconciliation status** | Bank accounts | Matched vs unmatched |
| **AI alerts** | Finance Agent | Anomalies, match suggestions |
| **Tax liability** | Tax summary | Upcoming filing |

### Quick Actions

- Record receipt · Record payment · New journal entry · Import bank statement · Run P&L · Close period (if authorized)

---

## 3. Chart of Accounts

**Route:** `/finance/chart-of-accounts`

The **Chart of Accounts (COA)** is the hierarchical tree of GL accounts — the foundation of every journal line.

### COA Entity

**Tables:** `finance_chart_of_accounts`, `finance_account_types`

| Field | Notes |
|-------|-------|
| `code` | Unique per company (e.g. `1100`, `4000`) |
| `name` | Display name |
| `account_type` | `asset`, `liability`, `equity`, `revenue`, `expense` |
| `subtype` | `bank`, `receivable`, `payable`, `inventory`, `cogs`, `tax`, … |
| `parent_id` | Tree hierarchy |
| `currency_id` | Optional account-level currency |
| `is_reconcilable` | Bank/AR/AP flag |
| `is_active` | Soft disable (no delete if posted) |
| `company_id` | Multi-company scope |

### Account Type → Financial Statement

| Type | Balance Sheet | P&L |
|------|---------------|-----|
| Asset | ✓ | |
| Liability | ✓ | |
| Equity | ✓ | |
| Revenue | | ✓ |
| Expense | | ✓ |

### COA Templates

Ship default templates per industry profile:

| Template | Highlights |
|----------|------------|
| **Retail / Ecommerce** | Inventory, COGS, payment gateway fees |
| **Services / ERP** | WIP, deferred revenue |
| **Manufacturing** | WIP, raw materials, overhead allocation |
| **Hospital** | Patient billing, insurance receivable |
| **School** | Tuition revenue, scholarship liability |

Templates are **starting COA** — finance admin extends; never fork schema per industry.

### COA Rules

- Posted transactions lock account code changes
- Merge accounts via controlled migration journal
- Parent accounts are summary-only (no direct posting unless configured)
- System accounts (AR control, AP control, tax payable) protected from delete

---

## 4. Journals

**Route:** `/finance/journals`

**Journals** group entries by business purpose — sales, purchases, bank, cash, miscellaneous, payroll.

### Journal Types

**Tables:** `finance_journals`, `finance_journal_entries`, `finance_journal_entry_lines`

| Journal Code | Purpose | Typical Source |
|--------------|---------|----------------|
| `SAL` | Sales / AR | `sales.invoice.posted` |
| `PUR` | Purchase / AP | `purchase.bill.posted` |
| `BNK` | Bank movements | Receipts, payments, reconciliation |
| `CSH` | Cash / petty cash | Expense reimbursements |
| `MISC` | Manual adjustments | Finance user |
| `INV` | Inventory / COGS | `inventory.movement.posted` |
| `PAY` | Payroll | `payroll.run.posted` |
| `TAX` | Tax accrual / payment | Tax engine |
| `FX` | Currency revaluation | Scheduled job |

### Journal Entry Header

| Field | Notes |
|-------|-------|
| `entry_number` | Sequential per journal + company |
| `journal_id` | Journal type |
| `entry_date` | Accounting date |
| `period_id` | Fiscal period FK |
| `status` | `draft` → `posted` → `reversed` |
| `source_type`, `source_id` | Polymorphic link to Sales invoice, Purchase bill, etc. |
| `reference` | External ref (check #, bank ref) |
| `currency_id`, `exchange_rate` | Transaction currency |
| `posted_by`, `posted_at` | Audit |
| `reversal_of_id` | Links reversal pair |

### Journal Entry Lines

| Field | Notes |
|-------|-------|
| `account_id` | COA FK |
| `debit`, `credit` | Base currency amounts |
| `amount_currency` | Foreign currency (if applicable) |
| `contact_id` | AR/AP sub-ledger (optional) |
| `analytic_account_id` | Cost center / project (future) |
| `tax_id` | Tax line link |
| `label` | Line description |

### Double-Entry Rule

```text
CONSTRAINT: SUM(debit) = SUM(credit) per journal entry
Posted entries: IMMUTABLE — corrections via reversal entry only
```

### Posting Rules (Automation)

**Table:** `finance_posting_rules`

| Event | Default Posting |
|-------|-----------------|
| `sales.invoice.posted` | DR AR · CR Revenue · CR Tax payable |
| `sales.payment.received` | DR Bank · CR AR |
| `sales.credit_note.posted` | Reverse revenue/AR |
| `purchase.bill.posted` | DR Expense/Inventory · DR Tax · CR AP |
| `purchase.payment.sent` | DR AP · CR Bank |
| `commerce.order.paid` | DR Bank/Gateway clearing · CR AR/deferred |
| `inventory.cogs.posted` | DR COGS · CR Inventory |
| `finance.expense.approved` | DR Expense · CR Payable/Cash |

Rules are **configurable per company** with admin UI; defaults ship with module.

---

## 5. Invoices

**Route:** `/finance/invoices`

**Customer invoices (Accounts Receivable)** — financial view of amounts owed by customers.

### Source of Truth Split

| Aspect | Sales Module | Finance Module |
|--------|--------------|----------------|
| Commercial invoice | Creates `sales_invoices` | Reads / mirrors for AR |
| Customer communication | Sends PDF/email | — |
| GL posting | Emits event | Creates journal entry |
| Open balance | — | `finance_ar_open_items` |
| Collection | May record payment | Receipt + allocation |

Finance `/finance/invoices` shows **all AR documents** — from Sales, Ecommerce, or manual service invoices created in Finance.

### AR Open Item

**Tables:** `finance_ar_invoices`, `finance_ar_open_items`, `finance_ar_allocations`

| Field | Notes |
|-------|-------|
| `invoice_number` | INV- prefix |
| `contact_id` | Customer (Core contacts) |
| `source_type` | `sales_invoice`, `commerce_order`, `manual` |
| `source_id` | FK to source document |
| `invoice_date`, `due_date` | |
| `subtotal`, `tax_total`, `grand_total` | |
| `amount_residual` | Open balance |
| `status` | draft → posted → partial → paid → written_off |
| `journal_entry_id` | Posted GL link |

### Invoice Lifecycle

```text
Draft → Posted (GL) → Partially Paid → Paid
                   ↘ Written Off (approval)
                   ↘ Credited (credit note from Sales)
```

### Manual Service Invoice

Finance may create invoices for non-Sales revenue (consulting, hospital procedures, school fees) — still emits `finance.invoice.posted` with source `manual`.

**Events:** `finance.invoice.posted`, `finance.invoice.paid`, `finance.invoice.written_off`

---

## 6. Bills

**Route:** `/finance/bills`

**Vendor bills (Accounts Payable)** — amounts owed to suppliers.

### Source Split

| Aspect | Purchase Module | Finance Module |
|--------|-----------------|----------------|
| Three-way match | PO + receipt + bill | — |
| Commercial bill | `purchase_vendor_bills` | Reads / mirrors for AP |
| GL posting | Emits `purchase.bill.posted` | Creates journal |
| Payment scheduling | — | Payment run |

### AP Open Item

**Tables:** `finance_ap_bills`, `finance_ap_open_items`, `finance_ap_allocations`

| Field | Notes |
|-------|-------|
| `bill_number` | Vendor's invoice # |
| `contact_id` | Vendor (Core contacts) |
| `source_type` | `purchase_bill`, `expense`, `manual` |
| `source_id` | FK |
| `bill_date`, `due_date` | |
| `subtotal`, `tax_total`, `grand_total` | |
| `amount_residual` | Open balance |
| `status` | draft → posted → partial → paid |
| `match_status` | unmatched, matched, exception (from Purchase) |

### Bill Lifecycle

```text
Draft → Matched (Purchase) → Posted (GL) → Partially Paid → Paid
```

**Events:** `finance.bill.posted`, `finance.bill.paid`

---

## 7. Payments

**Route:** `/finance/payments`

**Outbound payments** — money sent to vendors, employees, and other payees.

### Payment Entity

**Tables:** `finance_payments`, `finance_payment_lines`, `finance_payment_allocations`

| Field | Notes |
|-------|-------|
| `payment_number` | PAY- prefix |
| `payment_type` | `vendor`, `employee`, `tax`, `other` |
| `contact_id` | Payee |
| `bank_account_id` | Source bank |
| `payment_date` | |
| `amount` | Total paid |
| `currency_id` | |
| `status` | draft → posted → reconciled |
| `journal_entry_id` | DR AP · CR Bank |

### Allocation

Payment lines allocate to open AP bills:

```text
Payment ৳100,000
  ├─ Bill #V-001  ৳60,000
  ├─ Bill #V-002  ৳35,000
  └─ Unallocated  ৳5,000  (on account / prepayment)
```

### Payment Run (Batch)

**Table:** `finance_payment_batches` — select due AP bills → approve → generate bank file / checks.

Integrates [Approval Engine](../../core/engines/APPROVAL_ENGINE_ARCHITECTURE.md) for batch release.

**Events:** `finance.payment.posted`, `finance.payment.reconciled`

---

## 8. Receipts

**Route:** `/finance/receipts`

**Inbound receipts** — money received from customers and other sources.

### Receipt Entity

**Tables:** `finance_receipts`, `finance_receipt_lines`, `finance_receipt_allocations`

| Field | Notes |
|-------|-------|
| `receipt_number` | REC- prefix |
| `receipt_type` | `customer`, `other_income`, `refund_received` |
| `contact_id` | Payer (customer) |
| `bank_account_id` | Destination bank / cash |
| `receipt_date` | |
| `amount` | |
| `payment_method` | bank_transfer, cash, card, gateway, check |
| `gateway_reference` | Ecommerce payment ID |
| `status` | draft → posted → reconciled |

### Allocation to AR

Receipt lines allocate to open AR invoices — same pattern as Sales payment allocation but Finance owns GL posting:

```text
Receipt ৳50,000 → Invoice INV-1042 ৳50,000
Journal: DR Bank · CR AR
```

### Ecommerce Settlement

Gateway batches (daily settlement) create receipt with allocation to multiple order payments.

**Events:** `finance.receipt.posted`, `finance.receipt.reconciled`

---

## 9. Expenses

**Route:** `/finance/expenses`

**Employee and operational expenses** — claims, approvals, and reimbursement or AP accrual.

### Expense Claim

**Tables:** `finance_expenses`, `finance_expense_lines`, `finance_expense_categories`

| Field | Notes |
|-------|-------|
| `expense_number` | EXP- prefix |
| `employee_id` | Claimant (Core user/contact) |
| `expense_date` | |
| `category_id` | Travel, meals, supplies, … |
| `vendor_id` | Optional — paid to vendor directly |
| `amount`, `tax_amount` | |
| `receipt_attachment_id` | Core media |
| `status` | draft → submitted → approved → posted → reimbursed |
| `payment_mode` | reimburse_employee, pay_vendor, company_card |
| `journal_entry_id` | After post |

### Expense Categories → COA

Each category maps to default expense account — configurable in settings.

### Workflow

```text
Employee submits → Manager approves → Finance reviews → Post → Payment/Receipt
```

Large claims route through [Approval Engine](../../core/engines/APPROVAL_ENGINE_ARCHITECTURE.md).

### Petty Cash

Optional petty cash journal — small expenses posted to `CSH` journal with float account.

**Events:** `finance.expense.submitted`, `finance.expense.approved`, `finance.expense.posted`

---

## 10. Tax Management

**Route:** `/finance/tax`

Central **tax configuration, computation audit, and filing reports** — operational modules compute line tax; Finance owns liability accounts and returns.

### Tax Configuration

**Tables:** `finance_tax_groups`, `finance_taxes`, `finance_tax_accounts`

| Field | Notes |
|-------|-------|
| `name` | VAT 15%, GST, withholding |
| `rate` | Percentage |
| `type` | `sales`, `purchase`, `withholding` |
| `account_id` | Tax payable / receivable GL |
| `is_included` | Tax-inclusive pricing |
| `jurisdiction` | Country/region code |

Uses Core `tax_classes` / `tax_rules` where shared with catalog/checkout; Finance extends with GL mapping.

### Tax on Documents

| Document | Tax Source |
|----------|------------|
| Sales invoice | Line tax from Sales |
| Vendor bill | Line tax from Purchase |
| Expense | Category default or manual |
| Manual journal | Tax adjustment entries |

### Tax Reports

| Report | Purpose |
|--------|---------|
| **VAT/GST return** | Output tax − input tax = payable |
| **Withholding summary** | WHT deducted/remitted |
| **Tax audit trail** | Document → journal → account |

**Table:** `finance_tax_report_snapshots` — frozen return for filing period.

**Events:** `finance.tax.return.generated`, `finance.tax.payment.posted`

---

## 11. Reconciliation

**Route:** `/finance/reconciliation`

**Bank reconciliation** matches statement lines to receipts, payments, and journal entries.

### Bank Account Setup

**Tables:** `finance_bank_accounts`, `finance_bank_statements`, `finance_bank_statement_lines`

| Field | Notes |
|-------|-------|
| `bank_account_id` | Links to COA bank account |
| `account_number`, `bank_name` | Display |
| `currency_id` | |
| `last_reconciled_date` | |
| `opening_balance` | Statement start |

### Statement Import

- CSV / OFX / MT940 upload
- Open banking feed (future)
- Manual line entry

### Reconciliation Workspace

```text
┌─────────────────────────────┬─────────────────────────────┐
│  Bank Statement Lines        │  System Transactions         │
├─────────────────────────────┼─────────────────────────────┤
│  2026-06-01  ৳ +125,000     │  REC-1042  ৳ +125,000  [Match]│
│  2026-06-02  ৳  -45,000     │  PAY-881   ৳  -45,000  [Match]│
│  2026-06-03  ৳  -2,500      │  (unmatched — create expense?) │
└─────────────────────────────┴─────────────────────────────┘
```

**Tables:** `finance_reconciliations`, `finance_reconciliation_lines`

### Match Types

| Type | Action |
|------|--------|
| **Auto-match** | Amount + date + reference rules |
| **Manual match** | User links lines |
| **Create entry** | Unmatched statement → journal (bank fee, interest) |
| **AI suggest** | Finance Agent proposes matches |

### Reconciliation Status

`draft` → `in_progress` → `completed` → locks matched transactions

**Events:** `finance.reconciliation.completed`, `finance.bank_statement.imported`

---

## 12. Reports

**Route:** `/finance/reports`

Statutory and management financial reporting from posted GL data.

### Required Reports (Step 12)

#### Profit & Loss (Income Statement)

| Section | Content |
|---------|---------|
| **Revenue** | By account, optional dimension |
| **COGS** | Cost of goods sold |
| **Gross profit** | Revenue − COGS |
| **Operating expenses** | By category |
| **EBITDA / Net income** | Per COA structure |

Filters: date range, company, comparison period, analytic dimension.

#### Balance Sheet

| Section | Content |
|---------|---------|
| **Assets** | Current + non-current |
| **Liabilities** | Current + non-current |
| **Equity** | Retained earnings, capital |
| **Balance check** | Assets = Liabilities + Equity |

As-of date; optional prior period column.

#### Cash Flow Statement

| Section | Method |
|---------|--------|
| **Operating** | Indirect (net income + adjustments) |
| **Investing** | Asset purchases/sales |
| **Financing** | Loans, equity, dividends |
| **Net change in cash** | Reconciles to bank GL |

#### Tax Reports

- VAT/GST return worksheet
- Input vs output tax detail
- Withholding certificates summary
- Export for e-filing (jurisdiction-specific format — future)

#### Revenue Reports

| Report | Description |
|--------|-------------|
| **Revenue by product** | SKU/category (from analytic tags) |
| **Revenue by customer** | Top customers, concentration |
| **Revenue by channel** | Ecommerce, Sales, POS |
| **Revenue by period** | Daily/weekly/monthly trend |
| **Deferred revenue** | Unearned revenue schedule (future) |

### Additional Standard Reports

| Report | Purpose |
|--------|---------|
| **Trial balance** | All accounts with DR/CR balances |
| **General ledger** | Account transaction detail |
| **AR aging** | 0–30, 31–60, 61–90, 90+ buckets |
| **AP aging** | Same for payables |
| **Journal audit** | Entries by user, date |
| **Budget vs actual** | Future — budget module |

### Report Engine

- Reads **posted entries only**
- Respects period lock — no draft data in statutory reports
- Snapshot export PDF/XLSX
- Scheduled email delivery to CFO (future)

---

## 13. Audit Logs

**Route:** `/finance/audit`

Finance requires **immutable, searchable audit trail** beyond standard Activity — regulatory and SOX-style controls.

### Audit Log Entity

**Table:** `finance_audit_logs`

| Field | Notes |
|-------|-------|
| `timestamp` | UTC |
| `user_id` | Actor |
| `action` | `post`, `unpost`, `reverse`, `period_close`, `coa_change`, … |
| `entity_type`, `entity_id` | Target document |
| `before_snapshot` | JSON hash of prior state |
| `after_snapshot` | JSON hash of new state |
| `ip_address`, `user_agent` | Session context |
| `approval_id` | If approval-gated action |

### Audited Operations

| Operation | Log Level |
|-----------|-----------|
| Journal post / reverse | Critical |
| Period close / reopen | Critical |
| COA create/edit/deactivate | Critical |
| Posting rule change | Critical |
| Payment/receipt post | High |
| Tax rate change | Critical |
| Bank reconciliation complete | High |
| Report export (statutory) | Medium |

### Properties

- **Append-only** — no update/delete on audit rows
- **Tamper-evident** — optional hash chain per company (future)
- Retention policy configurable (7+ years default)
- Integrates Activity for user-facing timeline; audit log for compliance export

### Audit Explorer UI

- Filter by user, action, entity, date range
- Drill to before/after diff
- Export for external auditor

---

## 14. Approval Integration

Integrates [Approval Engine](../../core/engines/APPROVAL_ENGINE_ARCHITECTURE.md).

### Approval Points

| Document / Action | Trigger | Policy Example |
|-------------------|---------|----------------|
| **Manual journal entry** | Amount > threshold | Finance manager |
| **Journal reversal** | Any posted reversal | CFO |
| **Period close** | Close fiscal period | CFO + controller |
| **Period reopen** | Reopen locked period | Admin + audit reason |
| **Payment batch** | Total > threshold | Finance director |
| **Expense claim** | Amount > limit | Manager → Finance |
| **AR write-off** | Bad debt | Manager + Finance |
| **COA structural change** | New top-level account | Controller |
| **Posting rule edit** | Rule change | Finance admin |
| **Large vendor payment** | Single payment > X | Dual approval |

### Separation of Duties

| Rule | Example |
|------|---------|
| Creator ≠ approver | Expense submitter cannot approve own claim |
| Poster ≠ reconciler | Optional: different user completes bank reconciliation |
| Period close | Requires role without daily entry permission |

---

## 15. Workflow Integration

Integrates [Workflow Engine](../../core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md).

### Workflow Definitions

| Workflow ID | States |
|-------------|--------|
| `finance.journal_entry` | draft → pending_approval → posted → reversed |
| `finance.ar_invoice` | draft → posted → partial → paid → written_off |
| `finance.ap_bill` | draft → posted → partial → paid |
| `finance.payment` | draft → pending_approval → posted → reconciled |
| `finance.receipt` | draft → posted → reconciled |
| `finance.expense` | draft → submitted → approved → posted → reimbursed |
| `finance.reconciliation` | draft → in_progress → completed |
| `finance.period` | open → closing → closed |

### Workflow ↔ Posting

- Transition to `posted` triggers GL write (atomic with workflow commit)
- Blocked transitions when period locked
- Approval steps inject `pending_approval` state before post

**Registry:** [WORKFLOW_REGISTRY.md](../../WORKFLOW_REGISTRY.md)

---

## 16. AI Finance Assistant

**Route:** `/finance/ai-insights`

Integrates [AI OS Architecture](../ai/AI_OS_ARCHITECTURE.md).

### Agent: Finance Agent

| Capability | Input | Output |
|------------|-------|--------|
| **Anomaly detection** | Journal patterns, amounts, timing | Flag unusual entries |
| **Reconciliation matching** | Statement lines + open transactions | Match suggestions with confidence |
| **Cash flow forecast** | AR/AP aging, recurring expenses, pipeline | 30/60/90 day projection |
| **Expense categorization** | Receipt OCR, description | Suggested COA account |
| **Duplicate bill detection** | Vendor, amount, date | Potential duplicate alert |
| **Tax discrepancy** | Line tax vs GL tax accounts | Reconciliation note |
| **Report narrative** | P&L / BS period data | Management summary paragraph |
| **Collection priority** | AR aging + customer behavior | Ranked collection list |

### AI Governance

1. **Suggest → Review → Apply** — AI never auto-posts journals
2. Reconciliation matches require human confirm (unless policy auto-match threshold)
3. All runs in Activity `AI Actions` tab + audit log reference
4. Period-close recommendations are advisory only
5. Tenant AI budget via Control Center

### Data Flow

```text
journal entries + AR/AP + bank statements + sales/purchase events
     ↓
AI Context Engine
     ↓
Finance Agent
     ↓
Insight Queue (/finance/ai-insights + reconciliation side panel)
     ↓
Human apply → match confirm / category select / follow-up task
```

---

## 17. Permissions

Namespace: `finance.*`

| Permission | Description |
|------------|-------------|
| `finance.access` | Module access |
| `finance.view` | View all finance records |
| `finance.coa.view` | View chart of accounts |
| `finance.coa.manage` | Edit COA |
| `finance.journals.view` | View journal entries |
| `finance.journals.create` | Manual entries (draft) |
| `finance.journals.post` | Post entries |
| `finance.journals.reverse` | Reverse posted entries |
| `finance.invoices.view` | View AR invoices |
| `finance.invoices.manage` | Create/edit manual invoices |
| `finance.invoices.post` | Post AR to GL |
| `finance.bills.view` | View AP bills |
| `finance.bills.manage` | Edit AP (manual) |
| `finance.bills.post` | Post AP to GL |
| `finance.payments.view` | View payments |
| `finance.payments.create` | Create payments |
| `finance.payments.approve` | Approve payment batches |
| `finance.receipts.view` | View receipts |
| `finance.receipts.create` | Record receipts |
| `finance.expenses.view` | View expenses |
| `finance.expenses.submit` | Submit own expenses |
| `finance.expenses.approve` | Approve expense claims |
| `finance.tax.view` | View tax config |
| `finance.tax.manage` | Edit tax rates/accounts |
| `finance.reconciliation.view` | View reconciliation |
| `finance.reconciliation.manage` | Perform reconciliation |
| `finance.reports.view` | Standard reports |
| `finance.reports.statutory` | P&L, BS, Cash Flow export |
| `finance.periods.close` | Close fiscal period |
| `finance.periods.reopen` | Reopen closed period (restricted) |
| `finance.audit.view` | Audit log explorer |
| `finance.settings.edit` | Posting rules, banks, fiscal years |
| `finance.ai.apply` | Apply AI suggestions |

### Record Rules

- **Company scope:** `company_id = current_company`
- **Own expenses:** `employee_id = current_user` for submit-only users
- **Sensitive:** period close and reopen require elevated role + MFA (future)

---

## 18. UI/UX Architecture

### Design Blend

| Weight | Source | Applied To |
|--------|--------|------------|
| **50%** | Odoo Accounting | Journal form, COA tree, reconciliation widget |
| **25%** | Xero / QuickBooks | Dashboard cards, invoice/bill lists |
| **15%** | Stripe Dashboard | Cash flow charts, clean metrics |
| **10%** | Linear | Command palette, keyboard shortcuts |

### Global Requirements

| Requirement | Implementation |
|-------------|----------------|
| **AG Grid** | Invoices, bills, payments, receipts, expenses, journal list |
| **COA tree** | Expandable tree with drag reorder (draft accounts) |
| **Journal form** | Debit/credit lines with running balance indicator |
| **Reconciliation split view** | Statement left · system right · match actions |
| **Activity drawer** | Global right drawer on all records |
| **AI side panel** | Match suggestions, anomaly flags |
| **Period banner** | Locked period warning on all post actions |
| **Drill-down** | Report line → journal entries → source document |

### Key Screens

#### Finance Dashboard (`/finance`)

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Finance Dashboard                              Period: Jun 2026 [Open]│
├──────────────┬──────────────┬──────────────┬──────────────────────┤
│ Cash ৳2.4M    │ AR ৳890K     │ AP ৳412K     │ Net Income MTD ৳156K  │
├──────────────┴──────────────┴──────────────┴──────────────────────┤
│ Cash Flow Chart (30d)          │ AI Alerts · Unposted queue         │
└────────────────────────────────┴────────────────────────────────────┘
```

#### Journal Entry (`/finance/journals/[id]`)

- Header: journal, date, period, status, source link
- Lines grid: account picker, debit, credit, contact, label
- Footer: balance check (must be zero to post)
- Smart buttons: Reverse · Source document · Activity

#### Reconciliation (`/finance/reconciliation/[id]`)

- Split pane with filter/search
- AI match suggestions highlighted
- Difference summary → must be zero to complete

#### P&L Report (`/finance/reports/profit-and-loss`)

- Hierarchy tree matching COA
- Comparison column, export PDF/XLSX
- Drill-down to GL

### Breadcrumbs

`AgainERP › Finance › {Area} › {Record}`

**Standards:** [ENTERPRISE_UI_ARCHITECTURE.md](../../ui-ux/ENTERPRISE_UI_ARCHITECTURE.md) · [UX_SMART_INTERACTION_STANDARDS.md](../../ui-ux/UX_SMART_INTERACTION_STANDARDS.md)

---

## Appendix A — Module Integrations

### Sales (AR)

| Event | Finance Action |
|-------|----------------|
| `sales.invoice.posted` | AR journal + open item |
| `sales.payment.received` | Receipt draft or allocation sync |
| `sales.credit_note.posted` | AR credit journal |

**Doc:** [SALES_MODULE_ARCHITECTURE.md §20](../sales/SALES_MODULE_ARCHITECTURE.md)

### Purchase (AP)

| Event | Finance Action |
|-------|----------------|
| `purchase.bill.posted` | AP journal + open item |
| `purchase.bill.credit` | AP credit |

**Doc:** [PURCHASE_MODULE_ARCHITECTURE.md §19](../purchase/PURCHASE_MODULE_ARCHITECTURE.md)

### Ecommerce

| Event | Finance Action |
|-------|----------------|
| `commerce.order.paid` | Gateway clearing receipt |
| `commerce.refund.completed` | Refund payment / AR adjustment |
| Daily settlement | Batch receipt + fee expense |

### Inventory

| Event | Finance Action |
|-------|----------------|
| `inventory.movement.posted` | COGS / valuation journal |
| `inventory.adjustment.approved` | Write-off / gain journal |

### CRM / Marketing

- Read-only AR balance and revenue on customer timeline
- Campaign ROI uses Finance revenue reports — no GL write

---

## Appendix B — System Events

### Published by Finance

| Event | Payload | Subscribers |
|-------|---------|-------------|
| `finance.journal_entry.posted` | `entry_id`, `journal_id` | Analytics, Tax |
| `finance.journal_entry.reversed` | `entry_id`, `reversal_id` | Analytics |
| `finance.invoice.posted` | `invoice_id`, `contact_id` | CRM timeline |
| `finance.receipt.posted` | `receipt_id`, `amount` | Sales allocation |
| `finance.payment.posted` | `payment_id` | Purchase |
| `finance.expense.posted` | `expense_id` | HR (future) |
| `finance.reconciliation.completed` | `reconciliation_id` | Notifications |
| `finance.period.closed` | `period_id` | All modules (block back-post) |

### Subscribed by Finance

| Event | Source | Action |
|-------|--------|--------|
| `sales.invoice.posted` | Sales | Posting rule → AR journal |
| `sales.payment.received` | Sales | Receipt / allocation |
| `purchase.bill.posted` | Purchase | Posting rule → AP journal |
| `commerce.order.paid` | Ecommerce | Receipt |
| `inventory.cogs.posted` | Inventory | COGS journal |
| `payroll.run.posted` | Payroll | Salary journal (future) |

---

## Appendix C — Database Overview

| Table Group | Key Tables |
|-------------|------------|
| **COA & Periods** | `finance_chart_of_accounts`, `finance_fiscal_years`, `finance_periods` |
| **Journals** | `finance_journals`, `finance_journal_entries`, `finance_journal_entry_lines`, `finance_posting_rules` |
| **AR** | `finance_ar_invoices`, `finance_ar_open_items`, `finance_ar_allocations` |
| **AP** | `finance_ap_bills`, `finance_ap_open_items`, `finance_ap_allocations` |
| **Cash** | `finance_payments`, `finance_receipts`, `finance_bank_accounts` |
| **Expenses** | `finance_expenses`, `finance_expense_lines`, `finance_expense_categories` |
| **Tax** | `finance_taxes`, `finance_tax_groups`, `finance_tax_report_snapshots` |
| **Reconciliation** | `finance_bank_statements`, `finance_bank_statement_lines`, `finance_reconciliations` |
| **Audit** | `finance_audit_logs` |

Full DDL deferred to implementation. Aligns with [MASTER_DATABASE_ARCHITECTURE.md](../../database/MASTER_DATABASE_ARCHITECTURE.md).

---

## Appendix D — API Overview

Base: `/api/v1/finance/` · Auth: Bearer + `X-Company-Id`

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/chart-of-accounts` | `finance.coa.view` |
| GET/POST | `/journal-entries` | `finance.journals.*` |
| POST | `/journal-entries/{id}/post` | `finance.journals.post` |
| POST | `/journal-entries/{id}/reverse` | `finance.journals.reverse` |
| GET | `/invoices` | `finance.invoices.view` |
| GET | `/bills` | `finance.bills.view` |
| GET/POST | `/payments` | `finance.payments.*` |
| GET/POST | `/receipts` | `finance.receipts.*` |
| GET/POST | `/expenses` | `finance.expenses.*` |
| POST | `/bank-statements/import` | `finance.reconciliation.manage` |
| POST | `/reconciliations/{id}/complete` | `finance.reconciliation.manage` |
| GET | `/reports/profit-and-loss` | `finance.reports.statutory` |
| GET | `/reports/balance-sheet` | `finance.reports.statutory` |
| GET | `/reports/cash-flow` | `finance.reports.statutory` |
| POST | `/periods/{id}/close` | `finance.periods.close` |
| GET | `/audit-logs` | `finance.audit.view` |
| GET | `/ai-insights` | `finance.ai.apply` |

Sensitive endpoints (period close, reopen, reverse) require elevated role + MFA (future).

---

## Appendix E — Future Compatibility

| Domain | Finance Extension |
|--------|-------------------|
| **Ecommerce** | Payment gateway reconciliation, multi-currency checkout FX, marketplace seller payouts |
| **ERP (general)** | Analytic accounting, budgets, assets, consolidation |
| **Manufacturing** | WIP accounts, overhead allocation, standard cost variance journals |
| **Hospital** | Patient billing AR, insurance claim receivable, procedure revenue recognition |
| **School** | Tuition billing cycles, scholarship deferred revenue, grant accounting |
| **Restaurant** | Daily cash close, tip liability, per-location P&L |
| **Fixed assets** | Depreciation schedules → auto journal entries |
| **Multi-company** | Consolidation, elimination entries, inter-company AR/AP |
| **Open banking** | Live bank feeds vs CSV import |
| **Data warehouse** | GL fact tables for BI module |

---

## Architecture Rules

| # | Rule |
|---|------|
| 1 | **Finance owns GL** — only Finance posts journal entries |
| 2 | **Independent module** — full UX at `/finance/*` |
| 3 | **Event-driven posting** — operational modules emit, Finance consumes |
| 4 | **Double-entry** — balanced entries; posted = immutable |
| 5 | **Contacts via Core** — AR/AP keyed on `contact_id` |
| 6 | **Period lock** — closed periods block back-post |
| 7 | **Approval enabled** — large entries, payments, period close |
| 8 | **Audit enabled** — append-only finance audit log |
| 9 | **Activity enabled** — all documents in chatter |
| 10 | **AI assisted** — suggest only, human posts |
| 11 | **API first** — `/api/v1/finance/` |
| 12 | **Documentation before code** — [PRE_CODE_GATE.md](../../PRE_CODE_GATE.md) |

### Anti-Patterns (Forbidden)

```text
❌ sales_* or purchase_* tables with debit/credit GL columns
❌ Direct GL write from Sales, Purchase, Ecommerce, Inventory
❌ Deleting posted journal entries (use reversal)
❌ finance_customers duplicating Core contacts
❌ Statutory reports including draft/unposted data
❌ Period close without approval when policy requires
```

---

## Related Documents

| Document | Role |
|----------|------|
| [SALES_MODULE_ARCHITECTURE.md](../sales/SALES_MODULE_ARCHITECTURE.md) | AR handoff |
| [PURCHASE_MODULE_ARCHITECTURE.md](../purchase/PURCHASE_MODULE_ARCHITECTURE.md) | AP handoff |
| [APPROVAL_ENGINE_ARCHITECTURE.md](../../core/engines/APPROVAL_ENGINE_ARCHITECTURE.md) | Approval gates |
| [WORKFLOW_ENGINE_ARCHITECTURE.md](../../core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md) | Document state machines |
| [ACTIVITY_CHATTER_ARCHITECTURE.md](../core/ACTIVITY_CHATTER_ARCHITECTURE.md) | Timeline & chatter |
| [MASTER_DATABASE_ARCHITECTURE.md](../../database/MASTER_DATABASE_ARCHITECTURE.md) | Database conventions |
| [modules/accounting/Architecture.md](../accounting/Architecture.md) | Legacy accounting draft |
| [WORKFLOW_REGISTRY.md](../../WORKFLOW_REGISTRY.md) | Registered workflows |

---

*End of Finance Module Architecture — Step 12*
