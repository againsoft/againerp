# HR & Payroll — Payroll UI Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll — Payroll Domain  
> **Document Type:** Payroll UI / Wireframe Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_UI_UX_BLUEPRINT.md](../HR_UI_UX_BLUEPRINT.md) · [HR_SCREEN_INVENTORY.md](../HR_SCREEN_INVENTORY.md) · [HR_WORKFLOW_ARCHITECTURE.md](../HR_WORKFLOW_ARCHITECTURE.md) · [HR_PERMISSION_MATRIX.md](../HR_PERMISSION_MATRIX.md) · [HR_REPORTING_ARCHITECTURE.md](../HR_REPORTING_ARCHITECTURE.md) · [uiux/HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) · [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md) · [HR_AUTOMATION_ENGINE_ARCHITECTURE.md](../HR_AUTOMATION_ENGINE_ARCHITECTURE.md)  
> **Governance:** [UI_UX_DESIGN_STANDARDS.md](../../../04-uiux/standards/UI_UX_DESIGN_STANDARDS.md) · [dashboard-widgets.md](../../../04-uiux/standards/dashboard-widgets.md) · [PROJECT_COMMON_RULES.md](../../../00-foundation/PROJECT_COMMON_RULES.md)

**No visual mockups. No component code.**  
Defines **complete enterprise Payroll UI architecture** — the most critical financial surface in AgainERP HR. Foundation for payroll operations, processing workbench, approvals, compliance, analytics, and AI auditor experience.

**Design references (structure & process, not visual copy):** Oracle HCM Payroll · SAP SuccessFactors Employee Central Payroll · Workday Payroll · Odoo Payroll

**Route prefix:** `/payroll` · **ESS:** `/ess/payslips` · **API:** `/api/v1/payroll/`

---

## Executive Summary

| Principle | UI rule |
|-----------|---------|
| **Financial critical path** | Every mutation audited; lock = immutable |
| **Workbench-first processing** | 9-step guided run — not scattered forms |
| **SoD enforced in UI** | Calculator ≠ approver ≠ locker (configurable) |
| **Validation before approval** | Validation center blocks approve until resolved/waived |
| **Compliance by design** | Locked-run facts only for statutory reports |
| **AI auditor mode** | Advisory anomalies — never auto-lock/post |
| **Drawer CRUD** | Runs, payslips, structures — list + sheet |

**Screen namespace:** `SCR-PAY-*` · **Widgets:** `WGT-PAY-*` · **Charts:** `CHT-PAY-*` · **Nav:** `NAV-PAY-*`

---

# Payroll UI Philosophy

### Core belief

> **Payroll UI must make pay calculation transparent, approval defensible, and compliance auditable — before a single payslip is published.**

| Stakeholder | Primary surface | Question |
|-------------|-----------------|----------|
| **Payroll Executive** | Processing workbench | Is the run calculated correctly? |
| **Payroll Manager** | Dashboard + validation | Can I approve with confidence? |
| **Finance Manager** | Post to GL · reports | Is the journal correct? |
| **HR Manager** | Salary revisions · structures | Are comp changes reflected? |
| **Employee** | ESS payslips | Is my pay correct and available? |
| **Auditor** | Compliance center | Can I prove who approved what? |

### Enterprise payroll UX patterns adopted

| Source | Pattern |
|--------|---------|
| **Oracle HCM** | Payroll workbench · element entries · balance feeds |
| **SAP SuccessFactors** | Period control · off-cycle runs · approval chains |
| **Workday** | Payroll input review · costing · audit trail |
| **Odoo** | Payslip batches · salary rules · pragmatic run states |

### Payroll vs HR admin

| HR admin | Payroll domain |
|----------|----------------|
| People & time | Money calculation |
| `hr_*` tables | `payroll_*` only |
| Reversible edits | Lock immutability |
| Manager approvals | SoD + finance sign-off |

---

# Payroll User Experience Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **One run, one truth** | Single active calculated run per period (policy) |
| 2 | **Stepper clarity** | 9 processing steps with completion indicators |
| 3 | **Exceptions first** | Validation center before approval CTA |
| 4 | **Immutable lock** | Red lock banner; no edit affordances post-lock |
| 5 | **SoD warnings** | Inline warning if same user calc + approve |
| 6 | **Idempotent actions** | Confirm modals on lock · post · bank export |
| 7 | **PII minimization** | Mask bank on lists; reveal on permission |
| 8 | **ESS separation** | Published payslips only — never draft |
| 9 | **Activity everywhere** | Every run action in timeline |
| 10 | **AI advises, humans decide** | Auditor flags — no silent writes |

---

# Payroll Workspace Strategy

### Workspace model

```text
Payroll Workspace
├── Command (Dashboard)           — period posture + alerts
├── Calendar (Payroll calendar)   — pay dates & milestones
├── Configuration (Structures)    — components, tax, benefits
├── Processing (Workbench)        — 9-step run (CRITICAL)
├── Validation (Center)         — errors/warnings gate
├── Governance (Approvals/Lock)   — human sign-off
├── Distribution (Payslips/ESS)   — publish & PDF
├── Treasury (Bank export)        — payment files
├── Compliance (Center)           — statutory readiness
├── Intelligence (Analytics/AI)     — cost & anomalies
└── Reporting                     — registers & tax packs
```

### URL contract

| Surface | Route |
|---------|-------|
| Dashboard | `/payroll` |
| Periods | `/payroll/periods` |
| Batches / runs | `/payroll/runs` |
| Processing workbench | `/payroll/runs?view={id}&tab=process` |
| Validation | `&tab=validation` or embedded in workbench |
| Payslips | `/payroll/payslips` |
| Structures | `/payroll/structures` |
| Bank export | `/payroll/export` |
| Compliance | `/payroll/compliance` (future hub) |
| Analytics | `/payroll/analytics` |

---

# Payroll Analytics Strategy

| Layer | Surface | Data source |
|-------|---------|-------------|
| **Dashboard Zone C** | Cost KPIs + charts | `payroll_analytics_*` |
| **Workbench summary** | Run totals panel | Live calculation |
| **Dedicated analytics** | `/payroll/analytics` | Aggregates |
| **Reports** | `/payroll/reports/*` | Locked facts |
| **AI** | Zone F + auditor agent | Read models |

---

# Payroll Compliance Strategy

Per [HR_REPORTING_ARCHITECTURE.md](../HR_REPORTING_ARCHITECTURE.md).

| Rule | UI enforcement |
|------|----------------|
| **Lock boundary** | Compliance reports disabled until run locked |
| **Audit trail** | Approval + lock + export logged |
| **Statutory packs** | Compliance center download bundles |
| **PII export** | Extra permission + activity log |
| **Reopen** | `payroll.run.reopen` — wizard with finance approval |

**Reports:** `RPT-PAY-OPR-001`–`012` · `RPT-PAY-CMP-*` compliance class

---

# AI Payroll Strategy

Per [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md) — `workforce_payroll_auditor_agent`.

| Mode | Surface | Constraint |
|------|---------|------------|
| **Auditor** | Validation center + Zone F | Read-only on locked data |
| **Anomaly detection** | Post-calculate scan | Flags only |
| **Cost analysis** | Analytics + AI panel | Aggregated |
| **Compliance advisor** | Compliance center | Suggests actions |
| **Predictions** | Forecast charts | Medium risk |

**Forbidden:** Auto-approve · auto-lock · auto-post · direct payslip mutation

---

# Payroll Module Framework

```text
Payroll                                      NAV-PAY-ROOT
├── Dashboard                                /payroll                         SCR-PAY-DSH-001
├── Payroll Calendar                         /payroll/calendar                (future SCR-PAY-CAL-001)
├── Payroll Periods                        /payroll/periods                 SCR-PAY-PRD-001
├── Payroll Batches                          /payroll/runs                    SCR-PAY-RUN-001
├── Payroll Processing                       /payroll/runs?view={id}&tab=process  SCR-PAY-RUN-003
├── Payroll Validation                       (workbench step / tab)           embedded
├── Payroll Approvals                        /payroll/runs?status=pending     SCR-PAY-RUN-004
├── Payroll Locking                          ?view={id}&action=lock           SCR-PAY-RUN-005
├── Payslips                                 /payroll/payslips                SCR-PAY-PSL-001
├── Salary Structures                        /payroll/structures              SCR-PAY-STR-001
├── Salary Components                        /payroll/structures/components   SCR-PAY-STR-002
├── Allowances                               /payroll/structures/allowances   SCR-PAY-STR-003
├── Deductions                               /payroll/structures/deductions   SCR-PAY-STR-004
├── Benefits                                 /payroll/structures/benefits     SCR-PAY-STR-006
├── Tax Rules                                /payroll/settings/tax            SCR-PAY-STR-005
├── Bonus Management                         /payroll/bonuses                 SCR-PAY-BON-001
├── Commission Management                    /payroll/commissions             SCR-PAY-COM-001
├── Salary Revisions                         /payroll/salary-revisions        SCR-PAY-REV-001
├── Loans & Recoveries                       /payroll/loans                   SCR-PAY-LON-*
├── Bank Export                              /payroll/export                  SCR-PAY-EXP-001
├── Compliance Center                        /payroll/compliance              (future)
├── Analytics                                /payroll/analytics               SCR-PAY-ANL-001
├── Reports                                  /payroll/reports                 SCR-PAY-RPT-000
└── Settings                                 /payroll/settings                SCR-PAY-SET-001
```

**Global components:** `SCR-GLO-CMP-003` Workbench drawer · `SCR-GLO-CMP-008` Lock confirm modal

---

# Payroll Dashboard

**Command center** · **Route:** `/payroll` · **Template:** `DSH-PAY-001` · **Screen:** `SCR-PAY-DSH-001`

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ZONE A — HEADER                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE B — KPI CARDS (8)                                                      │
│ BANNERS: WGT-PAY-BNR-* (pay date · attendance · exceptions)                 │
├───────────────────────────────────────┬─────────────────────────────────────┤
│ ZONE C — ANALYTICS (8 col)            │ ZONE D — APPROVAL QUEUE (4 col)     │
├───────────────────────────────────────┴─────────────────────────────────────┤
│ ZONE E — NOTIFICATIONS                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE F — AI INSIGHTS (auditor)                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE G — PAYROLL CALENDAR MINI                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE H — QUICK ACTIONS                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ZONE A — Header

| Component | Wireframe |
|-----------|-----------|
| **Payroll period** | `June 2026 · PR-2026-06` badge |
| **Company** | Session scope / switcher |
| **Branch** | Optional filter |
| **Payroll status** | Run state chip: Draft · Calculated · Pending · Locked |
| **Export** | Reports · bank file shortcuts |
| **Refresh** | `[↻]` |
| **AI assistant** | `[✨]` Auditor mode default |

---

## ZONE B — KPI Cards

| Widget ID | KPI | Drill-down |
|-----------|-----|------------|
| WGT-PAY-KPI-001 | Payroll Pending | `/payroll/runs?status=draft,calculated` |
| WGT-PAY-KPI-002 | Payroll Processed | In review runs |
| WGT-PAY-KPI-003 | Payroll Approved | `?status=approved` |
| WGT-PAY-KPI-004 | Payroll Locked | `?status=locked` |
| WGT-PAY-KPI-005 | Salary Revisions | `/payroll/salary-revisions?status=pending` |
| WGT-PAY-KPI-006 | Bonus Processing | `/payroll/bonuses` |
| WGT-PAY-KPI-007 | Commission Processing | `/payroll/commissions` |
| WGT-PAY-KPI-008 | Compliance Issues | Validation/compliance hub |

### Alert banners

| Widget | Trigger |
|--------|---------|
| WGT-PAY-BNR-001 | Pay date within 3 days — run not locked |
| WGT-PAY-BNR-002 | Attendance not finalized for period |
| WGT-PAY-BNR-003 | Exceptions count > 0 in active run |

---

## ZONE C — Payroll Analytics

| Chart ID | Metric |
|----------|--------|
| CHT-PAY-001 | Payroll Cost |
| CHT-PAY-002 | Department Cost |
| CHT-PAY-003 | Branch Cost (future) |
| CHT-PAY-004 | Overtime Cost |
| CHT-PAY-005 | Bonus Cost |
| CHT-PAY-007 | Tax Cost |
| CHT-PAY-005 | Loan Recovery |
| CHT-PAY-006 | Advance Recovery |

---

## ZONE D — Approval Queue

| Queue | Route |
|-------|-------|
| Pending payroll runs | `/payroll/runs?status=pending` |
| Pending salary revisions | `/payroll/salary-revisions` |
| Pending bonus | `/payroll/bonuses?status=pending` |
| Pending commission | `/payroll/commissions?status=pending` |
| Escalated approvals | `/inbox/approvals?status=escalated&module=payroll` |

---

## ZONE E — Notifications

| Type | Example |
|------|---------|
| Compliance alerts | Tax filing due |
| Validation errors | 12 exceptions in active run |
| Missing data | 3 employees missing bank details |
| Pending actions | Run awaiting approval |

---

## ZONE F — AI Insights

| Widget ID | Insight |
|-----------|---------|
| WGT-AI-INS-002 | Payroll Risks |
| WGT-AI-INS-002 | Anomaly Detection |
| WGT-AI-INS-002 | Salary Outliers |
| WGT-AI-INS-002 | Cost Optimization |
| WGT-AI-INS-002 | Compliance Risks |

---

# Payroll Calendar

**Route:** `/payroll/calendar` (future `SCR-PAY-CAL-001`)

### Views

| View | Use |
|------|-----|
| **Monthly** | Pay dates + milestones |
| **Quarterly** | Tax & statutory deadlines |
| **Yearly** | Fiscal calendar |

### Event types

| Event | Icon annotation |
|-------|-----------------|
| Payroll processing | Run start/calculate |
| Approvals | Approval deadline |
| Salary revision effective | Effective date marker |
| Bonus run | Bonus inclusion date |
| Commission run | Commission cutoff |
| Tax submission | Statutory deadline |
| Bank export | Payment file date |

**Interaction:** Click event → navigate to run/period/wizard

---

# Payroll Periods

**Route:** `/payroll/periods` · **Screen:** `SCR-PAY-PRD-001`

### List view columns

| Column | Content |
|--------|---------|
| Period | e.g. `2026-06` |
| Pay date | |
| Status | open · processing · approved · locked · archived |
| Active run | Link to run |
| Employee count | |
| Net pay total | Masked summary |
| Actions | Open · Create run |

### Period details (drawer)

| Section | Content |
|---------|---------|
| Date range | Period start/end |
| Status tracking | State stepper |
| Linked runs | History table |
| Lock indicator | If period locked |
| Attendance finalization | Prerequisite status |

### Period states

`open` → `processing` → `approved` → `locked` → `archived`

---

# Payroll Batches

**Route:** `/payroll/runs` · **Screens:** `SCR-PAY-RUN-001` · `SCR-PAY-RUN-002`

### Batch list columns

| Column | Content |
|--------|---------|
| Run ID | `PR-2026-06-001` |
| Period | |
| Employee count | Included / total |
| Calculation status | Chip |
| Approval status | Chip |
| Lock status | Icon |
| Net pay | Summary |
| Actions | Open workbench |

### Batch details drawer

Summary panel: totals · exception count · last calculated · approvers · quick links to validation/payslips

---

# Payroll Processing Screen

**Most important screen** · **Route:** `/payroll/runs?view={id}&tab=process` · **Screen:** `SCR-PAY-RUN-003` · **Component:** `SCR-GLO-CMP-003`

### Layout — step-based workbench

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ RUN HEADER: PR-2026-06-001 · Period · Status · [SoD warning banner]         │
├─────────────────────────────────────────────────────────────────────────────┤
│ STEPPER: 1→2→3→4→5→6→7→8→9                                                  │
│ Collect Att · Leave · OT · Loans · Calculate · Tax · Validate · Approve · Lock│
├──────────────────────────────┬──────────────────────────────────────────────┤
│ STEP CONTENT (~65%)          │ SUMMARY PANEL (~35%)                         │
│ [Active step detail]         │ Totals · Progress · Exceptions count         │
│                              │ Employee inclusion table (collapsible)       │
├──────────────────────────────┴──────────────────────────────────────────────┤
│ FOOTER ACTIONS (permission-gated, SoD-separated)                            │
│ [Gather inputs] [Calculate] [Submit approval] [Lock] [Publish] [Post GL]    │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Desktop:** `max-w-6xl` drawer or full page workbench · **Mobile:** status KPI only — full workbench desktop-required

---

## Step 1 — Attendance Collection

| Section | Content |
|---------|---------|
| **Attendance status** | Finalized / pending count |
| **Missing attendance** | Employee list + fix links |
| **Exceptions** | Hold/exclude actions |
| **Validation** | Pass/fail · link to attendance module |

**Prerequisite:** `hr.attendance.finalized` event for period

---

## Step 2 — Leave Collection

| Section | Content |
|---------|---------|
| **Approved leaves** | Days per employee |
| **Unpaid leaves** | LWP flags |
| **Leave deductions** | Preview amounts |
| **Validation** | Overlap with attendance |

---

## Step 3 — Overtime Collection

| Section | Content |
|---------|---------|
| **Overtime summary** | Hours · employees |
| **Overtime validation** | Unapproved OT flagged |
| **Overtime cost** | Estimated earnings |

---

## Step 4 — Loan Recovery

| Section | Content |
|---------|---------|
| **Installments due** | Per loan schedule |
| **Recoveries** | Amount preview |
| **Pending recoveries** | Blocked items |

**Link:** `/payroll/loans` · advance recoveries tab

---

## Step 5 — Salary Calculation

| Section | Content |
|---------|---------|
| **Basic salary** | Structure-driven |
| **Allowances** | Line breakdown |
| **Benefits** | Employer/employee portions |
| **Deductions** | Pre-tax/post-tax |
| **Gross salary** | Subtotal |
| **Net salary** | Preview per employee |

**Action:** `[Calculate]` — `payroll.run.calculate` · progress bar

---

## Step 6 — Tax Calculation

| Section | Content |
|---------|---------|
| **Tax rules applied** | Rule version |
| **Tax deductions** | Per employee preview |
| **Compliance validation** | Statutory checks |
| **YTD context** | Annotation |

---

## Step 7 — Validation

Embedded validation center (see below). **Gate:** Cannot proceed to approval with unresolved critical errors unless waived by `payroll.run.approve`.

---

## Step 8 — Approval

| Section | Content |
|---------|---------|
| **Approval workflow** | Core Approval Engine stepper |
| **Approval history** | Timeline |
| **Comments** | Required on reject |
| **Impact analysis** | Total cost · headcount · delta vs prior period |

**SoD:** If current user calculated run → Approve button disabled with delegate message

---

## Step 9 — Locking

| Section | Content |
|---------|---------|
| **Payroll lock** | Confirm modal `SCR-GLO-CMP-008` |
| **Final review** | Checklist: validated · approved · bank ready |
| **Audit confirmation** | Type-to-confirm optional for high-security tenants |

**Post-lock:** All edit affordances hidden · immutable banner

### Run state machine (UI)

`draft` → `inputs_gathering` → `calculated` → `in_review` → `pending_approval` → `approved` → `locked` → `published` → `posted`

---

# Payroll Validation Center

*Critical screen* — embedded Step 7 + standalone tab `&tab=validation`

### Validation categories

| Category | Examples |
|----------|----------|
| **Missing data** | No bank account · no tax ID |
| **Salary errors** | Negative net · zero structure |
| **Attendance errors** | Unfinalized days |
| **Tax errors** | Bracket mismatch · ceiling |
| **Duplicate records** | Duplicate payslip row |
| **Compliance errors** | Statutory minimum wage |

### Views (tabs)

| Tab | Content |
|-----|---------|
| **Errors** | Blocking — must fix or waive |
| **Warnings** | Non-blocking — acknowledge |
| **Passed** | Validation checklist ✓ |

### Row actions

| Action | Behavior |
|--------|----------|
| Fix | Deep link to employee/attendance/structure |
| Exclude employee | Remove from run (permission) |
| Waive | Approver comment required |
| AI explain | Auditor narrative for row |

---

# Payroll Approval Center

**Routes:** `/payroll/runs?status=pending` · `/inbox/approvals?module=payroll`

### Views

`Pending` · `Approved` · `Rejected` · `Escalated` · `History`

### Approval details drawer

| Section | Content |
|---------|---------|
| **Payroll summary** | Headcount · gross · net · tax |
| **Impact analysis** | vs prior period · budget variance |
| **Approval chain** | Steps + actors |
| **Comments** | Thread |
| **Audit trail** | Activity timeline |

---

# Payroll Locking Center

**Modal:** `SCR-PAY-RUN-005` · **Reopen:** `SCR-PAY-RUN-006` wizard

| Surface | Content |
|---------|---------|
| **Lock status** | Banner on run when locked |
| **Lock history** | Who/when table |
| **Reopen requests** | Finance-approved wizard only |
| **Audit logs** | Immutable entries |

**Permissions:** `payroll.run.lock` · `payroll.run.reopen` (critical)

---

# Payslip Center

**Route:** `/payroll/payslips` · **Screens:** `SCR-PAY-PSL-001` · `SCR-PAY-PSL-002` · `SCR-GLO-CMP-014`

### Payslip list

| Column | Content |
|--------|---------|
| Employee | |
| Period | |
| Run | Link |
| Gross / Net | Masked until view perm |
| Status | draft · published |
| Actions | View · PDF · Email |

### Payslip details drawer

See Payslip Layout below.

| Feature | Permission |
|---------|------------|
| PDF preview | Embedded viewer |
| Email delivery | `payroll.payslip.publish` |
| Download | Activity logged |
| History | Prior periods |

**ESS:** Only `published` payslips visible

---

# Payslip Layout

Wireframe structure for drawer and PDF template planning.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ PAYSLIP — June 2026 · Jane Akter · EMP-0042                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ EMPLOYEE INFO: Name · ID · Dept · Bank (masked) · Tax ID (masked)           │
│ PAYROLL PERIOD: Start · End · Pay date · Run ID                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ EARNINGS                                                                    │
│ Basic · Allowances (itemized) · OT · Bonus                                  │
│ GROSS                                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ DEDUCTIONS                                                                  │
│ Tax · Loan · Advance · Other deductions                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ NET SALARY (highlight)                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ LOANS: Outstanding balance annotation                                       │
│ APPROVAL REFERENCES: Run approval ID · locked timestamp                     │
│ YTD SUMMARY (collapsible)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# Salary Structure Management

**Route:** `/payroll/structures` · **Screen:** `SCR-PAY-STR-001`

### Master-detail wireframe

```text
┌──────────────────┬──────────────────────────────────────────────────────────┐
│ STRUCTURE LIST   │ STRUCTURE DETAIL                                         │
│ [Structure A]    │ Name · Grade · Effective dates                           │
│ [Structure B]    │ Lines table: Component · Formula · Amount · Type         │
│ [+ New]          │ Assigned employees count · [Assign]                      │
└──────────────────┴──────────────────────────────────────────────────────────┘
```

### Sub-concepts

| Concept | Description |
|---------|-------------|
| **Salary structures** | Header + lines |
| **Salary templates** | Reusable patterns |
| **Grade structures** | Linked to `hr_designations` |
| **Bands** | Min/mid/max annotation |
| **Compensation plans** | Group of structures |

**Permission:** `payroll.structure.view` · `payroll.structure.manage`

---

# Salary Component Management

**Route:** `/payroll/structures/components` · **Screen:** `SCR-PAY-STR-002`

| Type | Examples |
|------|----------|
| **Basic salary** | BASE |
| **Allowances** | See Allowance Management |
| **Benefits** | See Benefits Management |
| **Deductions** | See Deduction Management |
| **Taxable** | Flag on component |
| **Non-taxable** | Flag on component |

Columns: Code · Name · Type · Taxable · Formula · Active

---

# Allowance Management

**Route:** `/payroll/structures/allowances` · **Screen:** `SCR-PAY-STR-003`

| Category | Examples |
|----------|----------|
| Housing | HRA |
| Medical | MED |
| Transport | TRANS |
| Food | MEAL |
| Special | CUSTOM-* |

Drawer: amount/formula · effective dates · taxable flag

---

# Deduction Management

**Route:** `/payroll/structures/deductions` · **Screen:** `SCR-PAY-STR-004`

| Category | Examples |
|----------|----------|
| Tax | Statutory |
| Loan | EMI |
| Advance | Recovery |
| Late fine | Attendance-linked |
| Absence | LWP deduction |
| Custom | CUSTOM-* |

---

# Benefits Management

**Route:** `/payroll/structures/benefits` · **Screen:** `SCR-PAY-STR-006`

| Benefit | Examples |
|---------|----------|
| Insurance | Health |
| Provident fund | PF |
| Retirement | Pension |
| Custom | |

Show employer vs employee contribution columns

---

# Tax Management

**Route:** `/payroll/settings/tax` · **Screen:** `SCR-PAY-STR-005`

| Section | Content |
|---------|---------|
| **Tax rules** | Country/region packs |
| **Tax slabs** | Bracket table |
| **Tax calculations** | Formula preview |
| **Tax compliance** | Validation rules |
| **Tax history** | Rule version timeline |

**Permission:** `payroll.tax.manage`

---

# Bonus Management

**Route:** `/payroll/bonuses` · **Screen:** `SCR-PAY-BON-001`

| Section | Content |
|---------|---------|
| **Bonus plans** | Definition list |
| **Eligibility** | Employee filter rules |
| **Bonus calculation** | Preview per employee |
| **Approval** | Workflow status |
| **Payroll impact** | Target run selector |
| **History** | Paid bonuses |

States: `draft` → `eligibility_computed` → `pending_approval` → `approved` → `included_in_run` → `paid`

---

# Commission Management

**Route:** `/payroll/commissions` · **Screen:** `SCR-PAY-COM-001`

| Section | Content |
|---------|---------|
| **Commission plans** | |
| **Targets** | Quota vs achievement |
| **Calculations** | Amount preview |
| **Approvals** | |
| **History** | |

**Integration:** Sales module events (future) — service API only

---

# Salary Revision Center

**Route:** `/payroll/salary-revisions` · **Screen:** `SCR-PAY-REV-001`

| Section | Content |
|---------|---------|
| **Revision requests** | Table |
| **Approval workflow** | HR + Finance threshold |
| **Impact analysis** | Cost delta · affected employees |
| **Effective dates** | Close old row · open new |
| **History** | `payroll_salary_revisions` |

**Event:** `payroll.structure.changed` · employee timeline update

---

# Loan & Recovery Center

**Routes:** `/payroll/loans` · `/payroll/advances` · **Screens:** `SCR-PAY-LON-*`

| Section | Content |
|---------|---------|
| **Loans** | Active loan list |
| **Installments** | Schedule tab in loan drawer |
| **Recoveries** | Period deduction preview in workbench |
| **Advance recovery** | `/payroll/advances/recovery` |
| **History** | Paid-off loans |

Linked from Processing Step 4

---

# Bank Export Center

**Route:** `/payroll/export` · **Screen:** `SCR-PAY-EXP-001` · **Wizard**

```text
Step 1: Select locked run
Step 2: Bank template (per bank)
Step 3: Validation (account numbers · net > 0)
Step 4: Generate file
Step 5: Download + audit log
```

| Section | Content |
|---------|---------|
| **Bank files** | Generated exports list |
| **Export history** | Who/when |
| **Validation** | Error report |
| **Download** | Secure download |
| **Audit trail** | `payroll.bank_export` activity |

**Permission:** `payroll.bank_export` (critical)

---

# Compliance Center

*Critical section* · **Route:** `/payroll/compliance` (future hub)

### Compliance dashboard

| Widget | Content |
|--------|---------|
| Payroll compliance score | Readiness % |
| Tax compliance | Filing status |
| Policy compliance | Structure/tax rule currency |
| Audit readiness | Checklist |
| Risk monitoring | Open issues count |

### Sub-areas

| Area | Reports / tools |
|------|-----------------|
| **Payroll compliance** | Lock report · approval report |
| **Tax compliance** | `RPT-PAY-OPR-009` |
| **Policy compliance** | Structure currency |
| **Audit readiness** | Export bundle wizard |
| **Risk monitoring** | AI + validation aggregate |

**Rule:** Compliance exports use **locked** run data only

---

# Payroll Analytics

**Route:** `/payroll/analytics` · **Screen:** `SCR-PAY-ANL-001`

| Analysis | Chart type |
|----------|------------|
| Payroll trends | Line |
| Department cost | Bar / pivot |
| Compensation analysis | Box plot summary |
| Bonus analysis | Bar |
| Commission analysis | Bar |
| Overtime analysis | Line |
| Tax analysis | Stacked bar |

**Visualizations:** Line · Bar · Trend cards · Heatmap (dept × month) · Pivot tables

**Filter sidebar:** Period · company · branch · department · component type

---

# AI Payroll Panel

**Agent:** `workforce_payroll_auditor_agent` · **Surfaces:** Dashboard Zone F · Validation · `/hr/ai/payroll`

### Insights

| Insight | Example |
|---------|---------|
| Payroll risks | Net pay variance > 15% vs prior |
| Anomalies | Duplicate component lines |
| Cost analysis | Dept cost spike narrative |
| Compliance risks | Tax rule version mismatch |
| Salary outliers | Employee > 2σ from dept mean |

### Recommendations

| Type | Example |
|------|---------|
| Salary review suggestions | Review flagged employees |
| Cost optimization | OT reduction opportunities |
| Payroll adjustments | Manual review items |
| Compliance actions | Update tax slab before lock |

### Predictions

| Prediction | Output |
|------------|--------|
| Future payroll cost | 3-month forecast |
| Department cost forecast | By dept |
| Payroll risk forecast | Exception probability |

**Post-calculate hook:** `AUTO-PAY-*` anomaly scan (automation engine)

---

# Employee Payroll Experience

**ESS route:** `/ess/payslips` · **Screen:** `SCR-ESS-PAY-001`

| Section | Content |
|---------|---------|
| **My payslips** | Published only · PDF download |
| **Salary history** | Net pay trend (self) |
| **Tax summary** | YTD (masked details per policy) |
| **Loans** | Balance · installments |
| **Advances** | Recovery status |
| **Benefits** | Enrollment summary |

**Permission:** `ess.payslip.view` · own `employee_id` only

---

# Manager Payroll Experience

| Surface | Content | Scope |
|---------|---------|-------|
| **Team payroll summary** | Aggregated cost (no individual salary without perm) | Dept |
| **Salary changes** | Pending revisions affecting team | |
| **Approval queue** | If policy includes manager in comp approvals | |
| **Payroll analytics** | Dept-scoped charts | |

**Rule:** Managers do not see peer salaries unless `hr.sensitive.view`

---

# Notification Experience

| Notification | Trigger | Recipient |
|--------------|---------|-----------|
| **Payroll generated** | `payroll.run.calculated` | Payroll team |
| **Payroll approved** | `payroll.run.approved` | Payroll + Finance |
| **Payroll rejected** | Approval rejected | Payroll Officer |
| **Payroll locked** | `payroll.run.locked` | Payroll + HR |
| **Payslip available** | `payroll.payslip.published` | Employee |
| **Salary revision approved** | `payroll.structure.changed` | Employee + HR |

---

# Activity Timeline

Per [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md).

| Category | Events |
|----------|--------|
| **Payroll events** | Create · calculate · lock · post |
| **Approvals** | Approve · reject · escalate |
| **Salary revisions** | Effective date change |
| **Bonus events** | Approved · included in run |
| **Commission events** | Calculated · paid |
| **Tax events** | Rule change · export |
| **AI activities** | Anomaly scan · insight dismissed |
| **Bank export** | File generated |

**Surfaces:** Run drawer timeline tab · employee profile payroll tab · global activity drawer

---

# Permission Experience

### UI visibility matrix

| Surface | Employee | Manager | HR Exec | Payroll Exec | Payroll Mgr | Finance | Admin |
|---------|----------|---------|---------|--------------|-------------|---------|-------|
| Dashboard | — | — | View | ✓ | ✓ | ✓ | ✓ |
| Processing workbench | — | — | — | Calculate | Approve/Lock | Post | ✓ |
| Validation | — | — | View | ✓ | ✓ | View | ✓ |
| Approve run | — | — | — | — | ✓ | ✓* | ✓ |
| Lock run | — | — | — | — | ✓ | — | ✓ |
| Post GL | — | — | — | — | — | ✓ | ✓ |
| Structures | — | — | View | Edit | Manage | View | ✓ |
| Payslips all | — | — | — | View | ✓ | View | ✓ |
| ESS payslip | Own | — | — | — | — | — | — |
| Bank export | — | — | — | — | ✓ | ✓ | ✓ |
| Compliance | — | — | — | View | ✓ | ✓ | ✓ |
| AI auditor | — | — | — | ✓ | ✓ | ✓ | ✓ |

\*Finance per approval policy `payroll.run.high`

### SoD rules (UI enforcement)

| Rule | UI behavior |
|------|-------------|
| Calculator ≠ approver | Disable approve + warning |
| Locker ≠ calculator (optional policy) | Separate users |
| Self-approval | N/A for payroll runs |
| Reopen | `payroll.run.reopen` only — wizard |

### Key permissions

`payroll.access` · `payroll.run.calculate` · `payroll.run.approve` · `payroll.run.lock` · `payroll.run.post` · `payroll.bank_export` · `payroll.structure.manage` · `payroll.payslip.view_all` · `payroll.payslip.publish`

---

# Responsive Strategy

| Surface | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| **Dashboard** | Full zones | Stacked | KPI + banners only |
| **Workbench** | Full stepper | Simplified | **Not supported** — redirect to dashboard status |
| **Payslip list** | AG Grid | Scroll table | Card list |
| **Structures** | Master-detail | Stacked | Read-only summary |
| **Bank export** | Wizard | Wizard | Download only if file ready |
| **ESS payslip** | Drawer | Full-width | Full-screen PDF |

**Payroll processing is desktop-first** by design (financial criticality).

---

# AI First Experience

### AI payroll summary

| Element | Location |
|---------|----------|
| Run narrative | Workbench summary panel after calculate |
| Dashboard banner | Zone F daily briefing |
| Exception explanations | Validation center per row |

### AI payroll auditor

| Trigger | Behavior |
|---------|----------|
| Post-calculate | Auto-scan batch job |
| Manual | "Validate with AI" button on workbench |
| Output | Flag list with confidence + sources |

**Mode:** Read-only on locked runs · No write tools

### AI cost analysis

Embedded in analytics + AI panel — variance narrative vs budget and prior period

### AI compliance advisor

Compliance center checklist — suggests missing steps before lock

### AI payroll recommendations

Ranked actions with Apply (navigate) · Dismiss · audit log

---

# Global Quick Actions

| ID | Action | Route | Permission |
|----|--------|-------|------------|
| QUICK-PAY-001 | New payroll run | `/payroll/runs?create=1` | `payroll.run.create` |
| QUICK-PAY-002 | Process payroll | Active run workbench | `payroll.run.calculate` |
| QUICK-PAY-003 | Approve payroll | Pending queue | `payroll.run.approve` |
| QUICK-PAY-004 | Lock payroll | Lock modal | `payroll.run.lock` |
| QUICK-PAY-005 | Export bank file | `/payroll/export` | `payroll.bank_export` |
| QUICK-PAY-006 | Salary register | `/payroll/reports/salary-register` | `payroll.report.view` |
| QUICK-PAY-007 | Validate with AI | Workbench action | `ai.access` + `payroll.run.view` |

---

# Cross-Reference Index

| Document | Use |
|----------|-----|
| [HR_WORKFLOW_ARCHITECTURE.md](../HR_WORKFLOW_ARCHITECTURE.md) | Run states · bonus · revision workflows |
| [HR_PERMISSION_MATRIX.md](../HR_PERMISSION_MATRIX.md) | SoD · payroll keys |
| [HR_REPORTING_ARCHITECTURE.md](../HR_REPORTING_ARCHITECTURE.md) | `RPT-PAY-*` |
| [HR_AUTOMATION_ENGINE_ARCHITECTURE.md](../HR_AUTOMATION_ENGINE_ARCHITECTURE.md) | `AUTO-PAY-*` |
| [uiux/ATTENDANCE_UI_ARCHITECTURE.md](./ATTENDANCE_UI_ARCHITECTURE.md) | Step 1 inputs |
| [uiux/LEAVE_UI_ARCHITECTURE.md](./LEAVE_UI_ARCHITECTURE.md) | Step 2 inputs |
| [HR_FIGMA_WIREFRAME_BLUEPRINT.md](../HR_FIGMA_WIREFRAME_BLUEPRINT.md) | Payroll workbench wireframe |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll — Payroll |
| **Owner** | Product / Architecture |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Critical screen** | SCR-PAY-RUN-003 (Processing Workbench) |
| **Processing steps** | 9 |

---

**AgainERP Payroll UI Architecture** — enterprise payroll operations foundation for wireframes, processing, compliance, analytics, and AI auditor experience.
