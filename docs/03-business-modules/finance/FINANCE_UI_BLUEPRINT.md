# AgainERP — Finance Module UI Blueprint

> **Status:** Active — **Finance UI SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 21 — Finance UI Design  
> **Module:** Finance · Route prefix `/finance`  
> **Governance:** [FINAL_UI_ARCHITECTURE_LOCK.md](../../FINAL_UI_ARCHITECTURE_LOCK.md) — APPROVED  
> **Components:** [COMPONENT_UI_BLUEPRINT.md](../../04-uiux/standards/COMPONENT_UI_BLUEPRINT.md)  
> **Architecture:** [FINANCE_MODULE_ARCHITECTURE.md](./FINANCE_MODULE_ARCHITECTURE.md)

**Documentation only.** No mockups · No Figma · No code.

> **Note:** `Architecture.md` and `UI.md` are not present in the Finance module package — this blueprint is the UI SSOT until `UI.md` is generated from it. Architecture authority: [FINANCE_MODULE_ARCHITECTURE.md](./FINANCE_MODULE_ARCHITECTURE.md).

---

## Purpose

Define the **complete Finance module UI** — navigation, pages, layouts, components, interactions, responsive rules, AI features, and audit/compliance rules — using the approved AgainERP design system.

## Scope (from architecture)

| In scope | Out of scope |
|----------|--------------|
| Chart of accounts · journal entries · GL posting | Sales orders · PO execution |
| AR invoices · AP bills · receipts · payments | Product catalog |
| Bank reconciliation · tax · statutory reports | Direct GL write from other modules |
| Expenses · audit log · period close | Duplicate customer/vendor master |
| Budgets · fixed assets (planned surfaces) | Payment gateway checkout UI |

**Financial spine:** Finance is the **only GL owner** — operational modules emit events; Finance posts.

**Data rules:**

- AR/AP keyed on Core **`contacts`**
- API: `/api/v1/finance/` · Permissions: `finance.*`
- Posted entries **immutable** — corrections via reversal only
- Statutory reports: **posted data only**

---

## 1. Navigation

### 1.1 Global placement

| Property | Value |
|----------|-------|
| Sidebar group | **Finance & Accounting** (`nav.finance`) — top-level module |
| Module root | `/finance` |
| Module access permission | `finance.access` |
| Quick actions | Record Receipt · Record Payment · New Journal Entry (manifest) |

### 1.2 Module navigation (Level 2 — Zone B)

| Tab | ID | Route | Visible |
|-----|-----|-------|---------|
| **Dashboard** | `WS-MODNAV-DASH` | `/finance/dashboard` | Always |
| **Accounting** | `WS-MODNAV-ACC` | COA · journals | Always |
| **Receivables** | `WS-MODNAV-AR` | `/finance/invoices` | Always |
| **Payables** | `WS-MODNAV-AP` | `/finance/bills` | Always |
| **Banking** | `WS-MODNAV-BNK` | Banking routes | Always |
| **Reports** | `WS-MODNAV-RPT` | `/finance/reports` | Always |
| **Settings** | `WS-MODNAV-SET` | `/finance/settings` | `finance.settings.edit` |

### 1.3 Operations menu (Level 3 — consolidated)

Step 21 approved nav items mapped to routes:

| Screen | Route | Permission | Entity |
|--------|-------|------------|--------|
| **Chart Of Accounts** | `/finance/chart-of-accounts` | `finance.coa.view` | `finance_chart_of_accounts` |
| **Journal Entries** | `/finance/journals` | `finance.journals.view` | `finance_journal_entries` |
| **Receivables** | `/finance/invoices` | `finance.invoices.view` | `finance_ar_invoices` |
| **Payables** | `/finance/bills` | `finance.bills.view` | `finance_ap_bills` |
| **Banking** | `/finance/banking` | `finance.reconciliation.view` | Bank accounts hub |
| **Cash** | `/finance/cash` | receipts + payments | Receipts · payments |
| **Budgets** | `/finance/budgets` | `finance.reports.view` | Budget plans (planned) |
| **Assets** | `/finance/assets` | `finance.reports.view` | Fixed assets (planned) |
| **Taxes** | `/finance/tax` | `finance.tax.view` | Tax config · returns |
| **Audit** | `/finance/audit` | `finance.audit.view` | `finance_audit_logs` |
| **AI Finance** | `/finance/ai-insights` | `finance.ai.apply` | AI queue |

> **Cash** sub-nav: Receipts (`/finance/receipts`) · Payments (`/finance/payments`) · Expenses (`/finance/expenses`).

### 1.4 Command palette

| Command ID | Label | Route |
|------------|-------|-------|
| `finance.journals.create` | New Journal Entry | `/finance/journals?create=1` |
| `finance.receipts.create` | Record Receipt | `/finance/receipts?create=1` |
| `finance.payments.create` | Record Payment | `/finance/payments?create=1` |
| `finance.reports.pl` | Profit & Loss | `/finance/reports/profit-and-loss` |

---

## 2. Pages & Layouts

| Page | Layout ID | Route | Primary components |
|------|-----------|-------|-------------------|
| Finance Dashboard | `LAYOUT-DASHBOARD` | `/finance/dashboard` | `WS-CONTENT-DASH` |
| Chart of Accounts | `LAYOUT-TREE-LIST` | `/finance/chart-of-accounts` | Account tree + detail |
| Journal List | `LAYOUT-LIST` | `/finance/journals` | `DS-DATAGRID` |
| Journal Entry | `LAYOUT-JOURNAL` | `/finance/journals?view=` | Full page · DR/CR grid |
| AR Invoice List | `LAYOUT-LIST` | `/finance/invoices` | `DS-DATAGRID` |
| AR Invoice Detail | `LAYOUT-DETAILS` | `/finance/invoices?view=` | Drawer / full page |
| AP Bill List | `LAYOUT-LIST` | `/finance/bills` | `DS-DATAGRID` |
| AP Bill Detail | `LAYOUT-DETAILS` | `/finance/bills?view=` | Drawer / full page |
| Receipts / Payments | `LAYOUT-LIST` | `/finance/receipts` · `/finance/payments` | `DS-DATAGRID` |
| Expenses | `LAYOUT-LIST` | `/finance/expenses` | Claims list |
| Banking Hub | `LAYOUT-MODULE` | `/finance/banking` | Account cards |
| Reconciliation | **`LAYOUT-RECONCILIATION`** | `/finance/reconciliation?view=` | Split-pane workspace |
| Budgets | `LAYOUT-ANALYTICS` | `/finance/budgets` | Plans · variance |
| Assets | `LAYOUT-LIST` | `/finance/assets` | Asset register |
| Tax | `LAYOUT-SETTINGS` | `/finance/tax` | Config + returns |
| Reports | `LAYOUT-ANALYTICS` | `/finance/reports/*` | Hierarchy + drill-down |
| Audit Explorer | `LAYOUT-LIST` | `/finance/audit` | Read-only log |
| Settings | `LAYOUT-SETTINGS` | `/finance/settings` | Fiscal · posting rules |
| AI Insights | `LAYOUT-AI-TOOL` | `/finance/ai-insights` | Review queue |

**CRUD rule (locked):** `?create=1` · `?view={id}` · `?edit={id}` — no `/new` or `/[id]/edit`.

**Layout exceptions (ADR):**

- **`LAYOUT-JOURNAL`** — debit/credit line grid · balance footer
- **`LAYOUT-RECONCILIATION`** — split-pane match workspace (architecture §11)

---

## 3. Finance Dashboard UI

**Route:** `/finance/dashboard`

### 3.1 Sections

| Order | Section | Widget ID | Category | Col span |
|-------|---------|-----------|----------|----------|
| 1 | **Cash Position** | `finance.cash-position` | `kpi` | 4 |
| 2 | **Receivables** | `finance.receivables` | `kpi` | 4 |
| 3 | **Payables** | `finance.payables` | `kpi` | 4 |
| 4 | **Profit & Loss Snapshot** | `finance.pl-snapshot` | `chart` / `kpi` | 8 |
| 5 | **Bank Balances** | `finance.bank-balances` | `table` | 6 |
| 6 | **Upcoming Payments** | `finance.upcoming-payments` | `table` | 6 |
| 7 | **Tax Summary** | `finance.tax-summary` | `kpi` | 4 |
| 8 | **AI Finance Insights** | `finance.ai-insights` | `ai` | 12 |
| 9 | **Quick Actions** | `finance.quick-actions` | `quick_action` | 4 |

**Period banner:** Fiscal period status (Open / Closing / Locked) — sticky in page header.

Optional widgets (architecture): overdue AR/AP · unposted queue · reconciliation status · net cash flow 30d.

### 3.2 Quick actions

| Action | Route |
|--------|-------|
| Record Receipt | `/finance/receipts?create=1` |
| Record Payment | `/finance/payments?create=1` |
| New Journal Entry | `/finance/journals?create=1` |
| Import Bank Statement | `/finance/reconciliation?import=1` |
| Run P&L | `/finance/reports/profit-and-loss` |

---

## 4. Chart Of Accounts UI

**Route:** `/finance/chart-of-accounts` · **`LAYOUT-TREE-LIST`**

### 4.1 Account tree

| Element | Behaviour |
|---------|-----------|
| Tree | Expand/collapse · code + name · type icon |
| Account types | asset · liability · equity · revenue · expense |
| Drag reorder | Draft accounts only · posted lock |
| Search | Filter tree by code/name |
| Templates | Industry COA templates (retail · services · manufacturing · hospital · school) |

### 4.2 Account detail

**Route:** `/finance/chart-of-accounts?view={id}` · drawer or inline panel

| Section | Content |
|---------|---------|
| **Account Details** | Code · name · type · subtype · currency · reconcilable |
| **Account Mapping** | Posting rules · tax accounts · expense category links |
| **Balance Overview** | Current balance · YTD · comparison |
| **Transaction History** | Drill to GL lines for account |

### 4.3 COA rules (UI)

| Rule | UI behaviour |
|------|--------------|
| System accounts | Protected — no delete |
| Posted history | Code change blocked · merge via migration wizard |
| Parent summary | Warning if direct posting to parent when disallowed |
| Deactivate | Soft disable · `is_active` switch |

Permission: `finance.coa.manage` for edit.

---

## 5. Journal Entry UI

**Route:** `/finance/journals` · Entity: `finance_journal_entries`

### 5.1 Journal statuses

| Status | Display token | Meaning |
|--------|---------------|---------|
| **Draft** | `--status-draft` | Editable · not posted |
| **Posted** | `--status-success` | Immutable on GL |
| **Reversed** | `--status-warning` | Reversal pair exists |
| **Cancelled** | `--status-danger` | Voided draft only |

Workflow may include `pending_approval` before post.

### 5.2 Journal list

Columns: entry # · journal type · date · reference · total · status · source link · posted by.

Filters: journal · period · status · date · user · source type.

### 5.3 Journal entry detail (`LAYOUT-JOURNAL`)

**Route:** `/finance/journals?view={id}` · **Full page default**

| Section | Content |
|---------|---------|
| **Header** | Entry # · journal · date · period · status · source document link |
| **Lines grid** | Account · debit · credit · contact · tax · label · analytic |
| **Balance footer** | Running total · must balance (DR = CR) to enable Post |
| **Approval Flow** | Workflow bar when above threshold |
| **Attachments** | `DS-ATTACHMENTS` |
| **Audit Trail** | `finance_audit_logs` slice |
| **Timeline** | `DS-TIMELINE` — draft → approve → post → reverse |
| Zone E | `DS-ACTIVITY-FEED` |

Smart buttons: Reverse · Source document · Related entries.

### 5.4 Post / reverse actions

| Action | Permission | Rule |
|--------|------------|------|
| Post | `finance.journals.post` | Period open · balanced |
| Reverse | `finance.journals.reverse` | Creates reversal entry · approval may apply |
| Edit | draft only | Posted = read-only |

---

## 6. Accounts Receivable UI

**Route:** `/finance/invoices` · Entity: `finance_ar_invoices`

### 6.1 Customer invoices list

Columns: invoice # · customer · date · due date · total · residual · status · source (Sales/Ecommerce/manual).

Filters: status · overdue · customer · date · channel.

### 6.2 Invoice detail

**Route:** `/finance/invoices?view={id}`

| Section | Content |
|---------|---------|
| Summary | Amounts · tax · GL link |
| **Outstanding Amounts** | `amount_residual` prominent |
| **Payment Collection** | Allocate receipts · record payment |
| **Aging bucket** | Current · 30 · 60 · 90+ indicator |
| **Collection Activities** | `DS-ACTIVITY-FEED` · tasks · reminders |
| Allocations | Receipt lines applied |

Lifecycle: draft → posted → partial → paid → written_off.

Link to Sales invoice when `source_type=sales_invoice`.

### 6.3 Aging analysis

**Route:** `/finance/reports/ar-aging` · matrix by customer × bucket · drill to invoice list.

---

## 7. Accounts Payable UI

**Route:** `/finance/bills` · Entity: `finance_ap_bills`

### 7.1 Vendor bills list

Columns: bill # · vendor · dates · total · residual · match status · payment status.

Filters: due · unmatched · vendor · approval pending.

### 7.2 Bill detail

**Route:** `/finance/bills?view={id}`

| Section | Content |
|---------|---------|
| **Bill Summary** | Amounts · tax · three-way match status (Purchase) |
| **Due Payments** | Due date · overdue alert |
| **Payment Schedule** | Planned payment date · batch membership |
| **Aging Analysis** | AP bucket |
| **Approval Workflow** | Match exception · post approval |
| Allocations | Payment lines |

Link to Purchase bill when `source_type=purchase_bill`.

### 7.3 Payment run (batch)

**Route:** `/finance/payments/batches` · select due bills → approve → generate payment.

---

## 8. Banking UI

**Route hub:** `/finance/banking`

### 8.1 Bank accounts

**Route:** `/finance/banking/accounts`

| Feature | UI |
|---------|-----|
| Account list | Bank name · account # · COA link · currency · last reconciled |
| Balance | GL balance vs statement |
| Actions | Reconcile · Import statement · Transfer |

Tables: `finance_bank_accounts`

### 8.2 Transactions

Unified view of receipts · payments · journal lines for bank COA account.

Filters: date · type · reconciled status.

### 8.3 Reconciliation (`LAYOUT-RECONCILIATION`)

**Route:** `/finance/reconciliation?view={id}`

```text
┌─────────────────────────────┬─────────────────────────────┐
│  Bank Statement Lines        │  System Transactions         │
│  (imported / manual)         │  receipts · payments · JE    │
├─────────────────────────────┼─────────────────────────────┤
│  Row + amount + date         │  Match · Create entry · AI   │
└─────────────────────────────┴─────────────────────────────┘
```

| Feature | Component |
|---------|-----------|
| **Imported Statements** | CSV · OFX · MT940 via `DS-IMPORT-MENU` |
| **Auto-match** | Rule-based highlight |
| **Manual match** | Link statement ↔ system row |
| **Create entry** | Unmatched → bank fee/interest JE |
| **AI suggest** | `DS-AI-SUGGESTIONS` in side panel |
| **Difference summary** | Must be zero to complete |

Status: draft → in_progress → completed.

### 8.4 Transfers

Inter-bank transfer journal — `?create=1` from banking hub.

---

## 9. Cash Management UI

**Route:** `/finance/cash` · Hub for liquidity operations

| Sub-route | Purpose |
|-----------|---------|
| `/finance/receipts` | Inbound · customer · gateway settlement |
| `/finance/payments` | Outbound · vendor · employee · tax |
| `/finance/expenses` | Employee claims · petty cash |

### 9.1 Receipts

Allocation pattern to AR invoices · payment method · gateway reference.

Status: draft → posted → reconciled.

### 9.2 Payments

Allocation to AP bills · payment batch · bank account source.

Status: draft → pending_approval → posted → reconciled.

### 9.3 Expenses

Workflow: draft → submitted → approved → posted → reimbursed.

Receipt attachment via Core media · category → COA mapping.

---

## 10. Budget Management UI

**Route:** `/finance/budgets` · **Planned** (Appendix E — budget vs actual)

| Screen | Content |
|--------|---------|
| **Budget Plans** | Fiscal year plans list |
| **Department Budgets** | Analytic dimension budgets |
| **Actual vs Budget** | Variance charts · `DS-CARD-CHART` |
| **Forecasting** | Rolling forecast · AI-assisted |
| **Approval Workflow** | Plan submit → approve → lock |

Layout: `LAYOUT-ANALYTICS` · drill-down to GL by account.

---

## 11. Asset Management UI

**Route:** `/finance/assets` · **Planned** (Appendix E — fixed assets)

| Screen | Content |
|--------|---------|
| **Asset Register** | Asset # · category · cost · location · status |
| **Depreciation** | Schedule · posted depreciation JEs |
| **Asset Movements** | Transfer between locations/companies |
| **Maintenance** | Service log link (future) |
| **Disposal** | Gain/loss journal on disposal |

CRUD: `LAYOUT-LIST` + drawer · depreciation runs via journal workflow.

---

## 12. Tax Management UI

**Route:** `/finance/tax` · **Layout:** `LAYOUT-SETTINGS`

### 12.1 Tax configuration

| Area | Content |
|------|---------|
| **VAT / Sales Tax** | Output tax rates · GL accounts |
| **Purchase Tax** | Input tax · recoverable rules |
| **Tax Rules** | Jurisdiction · inclusive/exclusive · withholding |
| Tax groups | `finance_tax_groups` · `finance_taxes` |

### 12.2 Tax reports & filing

| Screen | Route |
|--------|-------|
| VAT/GST return worksheet | `/finance/tax/returns` |
| Input vs output detail | `/finance/tax/reports` |
| **Tax Filing Status** | Snapshot per period · filed/pending |
| Audit trail | Document → journal → tax account |

Tables: `finance_tax_report_snapshots` — frozen returns.

---

## 13. Finance Reports UI

**Route:** `/finance/reports` · **Layout:** `LAYOUT-ANALYTICS`

| Report | Route | Notes |
|--------|-------|-------|
| **Profit & Loss** | `/finance/reports/profit-and-loss` | COA hierarchy · comparison period |
| **Balance Sheet** | `/finance/reports/balance-sheet` | As-of date · balance check |
| **Cash Flow** | `/finance/reports/cash-flow` | Operating · investing · financing |
| **General Ledger** | `/finance/reports/general-ledger` | Account transaction detail |
| **Trial Balance** | `/finance/reports/trial-balance` | DR/CR balances |
| **Tax Reports** | `/finance/reports/tax` | Return worksheets |
| **Budget Reports** | `/finance/reports/budget` | Actual vs budget |
| **AR/AP Aging** | `/finance/reports/ar-aging` · `ap-aging` | Bucket analysis |
| **Revenue Reports** | `/finance/reports/revenue` | By customer · channel · product |

**Rules:**

- Posted entries only in statutory reports
- Period lock respected
- Drill-down: report line → journal entries → source document
- Export: `DS-EXPORT-MENU` · PDF · XLSX · permission `finance.reports.statutory`

---

## 14. AI Finance UI

**Route:** `/finance/ai-insights` · Components **`DS-AI-*` only**

### 14.1 Features & placement

| Feature | Component | Placement |
|---------|-----------|-----------|
| **Cash Flow Forecast** | `DS-AI-INSIGHTS` | Dashboard · AI hub |
| **Expense Analysis** | `DS-AI-INSIGHTS` | Expenses · reports |
| **Risk Detection** | `DS-AI-INSIGHTS` | Anomaly flags on journals |
| **Budget Recommendations** | `DS-AI-SUGGESTIONS` | Budget module |
| **Payment Prioritization** | `DS-AI-SUGGESTIONS` | AP dashboard · payment batch |
| **Anomaly Detection** | `DS-AI-INSIGHTS` | Journal list · audit |
| **Reconciliation matching** | `DS-AI-SUGGESTIONS` | Reconciliation workspace |
| **Collection priority** | `DS-AI-SUGGESTIONS` | AR aging |
| **Duplicate bill detection** | `DS-AI-INSIGHTS` | AP bill entry |

### 14.2 AI rules

| Rule | Detail |
|------|--------|
| Never auto-post | Suggest → review → human post |
| Reconciliation | Human confirm match (unless auto-match policy) |
| Activity + audit | All AI runs logged |
| Apply permission | `finance.ai.apply` |

---

## 15. Audit Explorer UI

**Route:** `/finance/audit` · Read-only · append-only log

| Feature | UI |
|---------|-----|
| Filter | User · action · entity · date range |
| Diff view | Before/after snapshot JSON |
| Critical actions | post · reverse · period close · COA change |
| Export | Auditor export · retention policy display |

Integrates with Activity for user-facing timeline; audit log for compliance.

---

## 16. Audit & Compliance Rules

### 16.1 Immutable financial records

| Rule | UI enforcement |
|------|----------------|
| Posted journals | Read-only · Reverse action only |
| Audit log | No edit/delete UI |
| Statutory reports | No draft data · banner if period includes open drafts |
| Period close | Blocks post actions · period banner on all finance screens |

### 16.2 Approval & separation of duties

| Action | UI gate |
|--------|---------|
| Manual JE above threshold | Approval workflow before Post |
| Journal reversal | CFO approval · reason required |
| Payment batch | Dual approval above limit |
| Expense claim | Submitter ≠ approver |
| Period close / reopen | Elevated role · audit reason on reopen |
| AR write-off | Manager + Finance approval |

Hide forbidden actions — never disable (locked RBAC).

### 16.3 Period lock UX

| State | Banner |
|-------|--------|
| Open | Green/neutral — "Period Jun 2026 Open" |
| Closing | Warning — limited post |
| Locked | Danger — Post disabled module-wide · tooltip explains |

### 16.4 Audit trail requirements (UI surfaces)

| Document | Surfaces |
|----------|----------|
| Journal entry | Timeline · audit tab · posted_by/at |
| Payment / receipt | Allocation history · reconciliation link |
| COA change | Audit explorer entry |
| Report export | Logged at medium level |
| Tax rate change | Critical audit entry |

### 16.5 Compliance checklist (implementation)

- [ ] Double-entry balance check before post
- [ ] No delete on posted documents
- [ ] Source document polymorphic link visible
- [ ] MFA on sensitive actions (future)
- [ ] 7+ year retention messaging on audit export

---

## 17. Mobile Finance UI

### 17.1 Priority screens

| Screen | Behaviour |
|--------|-----------|
| **Dashboard** | Cash · AR · AP KPIs · overdue alerts |
| **Receivables** | Card list · overdue highlighted · tap → drawer |
| **Payables** | Due bills · payment schedule |
| **Banking** | Account balances · unreconciled count |
| **Quick Actions** | Record receipt · approve expense · view aging |

### 17.2 Mobile rules

| Rule | Detail |
|------|--------|
| Lists | `DS-CARD-LIST` |
| Journal entry | Desktop recommended — read-only summary on mobile |
| Reconciliation | Desktop-only — mobile shows status + link |
| Reports | Simplified KPI cards · full reports desktop |
| Tap targets | 44×44px minimum |

---

## 18. Interaction Rules (Finance-specific)

| Interaction | Rule |
|-------------|------|
| GL posting | Finance only — other modules link source docs |
| AR/AP contacts | Core `contact_id` — no duplicate party tables |
| Allocation | Receipt/payment lines → open items |
| Ecommerce settlement | Batch receipt with gateway ref |
| Purchase match | Show match_status from Purchase on AP bill |
| Sales invoice | Show source link to Sales document |
| Drill-down | Report → JE → source document chain |
| Currency | Transaction + base amounts on lines |
| Tax | Line tax from source doc · GL mapping in Finance |

---

## 19. Permissions → UI

| Permission | UI effect |
|------------|-----------|
| `finance.access` | Module visible |
| `finance.journals.post` | Post button on JE |
| `finance.journals.reverse` | Reverse button |
| `finance.periods.close` | Close period action |
| `finance.reconciliation.manage` | Reconciliation workspace edit |
| `finance.reports.statutory` | P&L · BS · CF export |
| `finance.audit.view` | Audit explorer |
| `finance.ai.apply` | Apply AI suggestions |

Full matrix: architecture §17.

---

## 20. Responsive Rules

| Screen | Desktop | Mobile |
|--------|---------|--------|
| Invoice / bill lists | `DS-DATAGRID` | `DS-CARD-LIST` |
| COA tree | Split tree + detail | Full-screen tree → tap → sheet |
| Journal entry | Full `LAYOUT-JOURNAL` | Summary read-only |
| Reconciliation | Split pane | Not supported — redirect message |
| Reports | Hierarchy table + chart | KPI cards · export in menu |
| Dashboard | 12-col widgets | KPI stack → actions |

Money columns: right-aligned · locale format · base currency from workspace context.

---

## 21. Activity & Zone E

All financial documents integrate Activity:

| Entity | Pattern |
|--------|---------|
| Journal | `finance:journal_entry:{id}` |
| AR invoice | `finance:ar_invoice:{id}` |
| AP bill | `finance:ap_bill:{id}` |
| Payment / receipt | `finance:payment:{id}` · `finance:receipt:{id}` |

Global activity drawer on list rows · Activities tab + Zone E on detail.

---

## 22. Menus Spec Index (to align)

| Screen | Route | layout_id |
|--------|-------|-----------|
| COA | `/finance/chart-of-accounts` | `LAYOUT-TREE-LIST` |
| Journals | `/finance/journals` | `LAYOUT-LIST` / `LAYOUT-JOURNAL` |
| Invoices | `/finance/invoices` | `LAYOUT-LIST` / `LAYOUT-DETAILS` |
| Bills | `/finance/bills` | `LAYOUT-LIST` / `LAYOUT-DETAILS` |
| Reconciliation | `/finance/reconciliation` | `LAYOUT-RECONCILIATION` |
| Dashboard | `/finance/dashboard` | `LAYOUT-DASHBOARD` |
| Reports | `/finance/reports/*` | `LAYOUT-ANALYTICS` |

Declare: `context_required` (company · currency · fiscal period) · `empty_state` · `loading` · `DS-*` IDs.

---

## 23. Compliance Checklist (blueprint)

- [ ] Drawer CRUD on lists — full page for journal & reconciliation
- [ ] No `/new` routes
- [ ] `DS-*` / `WS-*` only (+ `LAYOUT-JOURNAL` · `LAYOUT-RECONCILIATION` ADR)
- [ ] Period banner on all finance screens
- [ ] Posted = immutable UI
- [ ] Audit explorer for compliance
- [ ] AI never auto-posts
- [ ] Mobile card fallback
- [ ] Generate `UI.md` from this blueprint

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 21 — Finance module UI blueprint |

---

**Finance UI Blueprint** — financial spine UI · design-system compliant · prototype-ready.
