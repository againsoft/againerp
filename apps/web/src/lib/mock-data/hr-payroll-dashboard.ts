/**
 * Payroll Dashboard mock data — SCR-PAY-DSH-001 · DSH-PAY-001
 * @see docs/modules/hr-payroll/uiux/PAYROLL_UI_ARCHITECTURE.md
 */

export type PayrollRunStatus = "draft" | "calculated" | "pending" | "approved" | "locked";

export type PayrollDashboardKpi = {
  id: string;
  label: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  status?: "good" | "warning" | "critical" | "neutral";
  hint?: string;
  href: string;
};

export type PayrollAlertBanner = {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  message: string;
  href: string;
};

export type PayrollApprovalItem = {
  id: string;
  type: "payroll_run" | "salary_revision" | "bonus" | "commission";
  title: string;
  reference: string;
  submitter: string;
  amount?: string;
  headcount?: number;
  submittedAt: string;
  priority?: "high" | "normal";
  status: "pending" | "escalated";
  href: string;
};

export type PayrollComplianceAlert = {
  id: string;
  severity: "critical" | "warning" | "info";
  category: string;
  title: string;
  detail: string;
  dueDate?: string;
  href: string;
};

export type PayrollAuditorFinding = {
  id: string;
  severity: "critical" | "warning" | "info";
  category: string;
  title: string;
  summary: string;
  confidence: "high" | "medium" | "low";
  affectedCount?: number;
  source: string;
};

export type PayrollCalendarEvent = {
  id: string;
  date: string;
  day: number;
  label: string;
  type: "processing" | "approval" | "pay_date" | "tax" | "bank_export";
  isToday?: boolean;
};

export type PayrollQuickAction = {
  id: string;
  label: string;
  href: string;
};

export const PAYROLL_DASHBOARD_AS_OF = "17 Jun 2026, 09:15 AM";
export const PAYROLL_CURRENT_PERIOD = "June 2026";
export const PAYROLL_CURRENT_RUN_ID = "PR-2026-06";
export const PAYROLL_CURRENT_STATUS: PayrollRunStatus = "pending";
export const PAYROLL_PAY_DATE = "25 Jun 2026";
export const PAYROLL_NET_PAY_TOTAL = 48_620_000;

export const PAYROLL_STATUS_LABELS: Record<PayrollRunStatus, string> = {
  draft: "Draft",
  calculated: "Calculated",
  pending: "Pending Approval",
  approved: "Approved",
  locked: "Locked",
};

export const PAYROLL_DASHBOARD_KPIS: PayrollDashboardKpi[] = [
  {
    id: "WGT-PAY-KPI-001",
    label: "Pending Payroll",
    value: "1",
    trend: "PR-2026-06",
    trendDirection: "neutral",
    status: "warning",
    hint: "Awaiting approval",
    href: "/payroll/runs?status=pending",
  },
  {
    id: "WGT-PAY-KPI-002",
    label: "Processed Payroll",
    value: "5",
    trend: "YTD",
    trendDirection: "neutral",
    status: "good",
    hint: "Calculated runs",
    href: "/payroll/runs?status=calculated,approved",
  },
  {
    id: "WGT-PAY-KPI-004",
    label: "Locked Payroll",
    value: "5",
    trend: "Jan–May",
    trendDirection: "neutral",
    status: "good",
    hint: "Closed periods",
    href: "/payroll/runs?status=locked",
  },
  {
    id: "WGT-PAY-KPI-008",
    label: "Compliance Issues",
    value: "12",
    trend: "+3",
    trendDirection: "up",
    status: "critical",
    hint: "Active run exceptions",
    href: "/payroll/runs?view=PR-2026-06&tab=validation",
  },
  {
    id: "WGT-PAY-KPI-005",
    label: "Salary Revisions",
    value: "8",
    trend: "Pending",
    trendDirection: "neutral",
    status: "warning",
    hint: "Effective Jul 2026",
    href: "/payroll/salary-revisions?status=pending",
  },
  {
    id: "WGT-PAY-KPI-006",
    label: "Bonus Processing",
    value: "2",
    trend: "Eid bonus",
    trendDirection: "neutral",
    status: "neutral",
    hint: "In pipeline",
    href: "/payroll/bonuses?status=pending",
  },
  {
    id: "WGT-PAY-KPI-007",
    label: "Commission Processing",
    value: "14",
    trend: "Q2 close",
    trendDirection: "neutral",
    status: "neutral",
    hint: "Sales commission",
    href: "/payroll/commissions?status=pending",
  },
  {
    id: "WGT-PAY-KPI-003",
    label: "Approved Payroll",
    value: "1",
    trend: "May 2026",
    trendDirection: "neutral",
    status: "good",
    hint: "Ready to lock",
    href: "/payroll/runs?status=approved",
  },
];

export const PAYROLL_ALERT_BANNERS: PayrollAlertBanner[] = [
  {
    id: "WGT-PAY-BNR-001",
    severity: "warning",
    title: "Pay date in 8 days — run not locked",
    message: `${PAYROLL_CURRENT_RUN_ID} is pending approval. Lock by 24 Jun to meet ${PAYROLL_PAY_DATE} disbursement.`,
    href: "/payroll/runs?view=PR-2026-06",
  },
  {
    id: "WGT-PAY-BNR-002",
    severity: "warning",
    title: "Attendance not finalized for June 2026",
    message: "Chittagong branch attendance is pending finalization — payroll calculation may be incomplete.",
    href: "/hr/attendance/monthly?period=2026-06&branch=ctg",
  },
  {
    id: "WGT-PAY-BNR-003",
    severity: "critical",
    title: "12 exceptions in active run",
    message: "Validation errors detected in PR-2026-06. Resolve before approval and lock.",
    href: "/payroll/runs?view=PR-2026-06&tab=validation",
  },
];

export const PAYROLL_COST_TREND = [
  { month: "Jan", gross: 46.2, net: 38.4, tax: 4.8, employer: 6.2 },
  { month: "Feb", gross: 45.8, net: 38.1, tax: 4.7, employer: 6.1 },
  { month: "Mar", gross: 47.1, net: 39.2, tax: 4.9, employer: 6.3 },
  { month: "Apr", gross: 46.9, net: 38.9, tax: 4.8, employer: 6.2 },
  { month: "May", gross: 48.1, net: 40.0, tax: 5.0, employer: 6.4 },
  { month: "Jun", gross: 48.6, net: 40.4, tax: 5.1, employer: 6.5 },
];

export const PAYROLL_DEPARTMENT_COST = [
  { department: "Operations", gross: 14.2, net: 11.8, headcount: 358 },
  { department: "Sales & Marketing", gross: 10.8, net: 9.1, headcount: 248 },
  { department: "Technology", gross: 9.4, net: 7.9, headcount: 172 },
  { department: "Finance", gross: 5.2, net: 4.4, headcount: 108 },
  { department: "Human Resources", gross: 3.8, net: 3.2, headcount: 76 },
  { department: "Logistics", gross: 5.2, net: 4.0, headcount: 124 },
];

export const PAYROLL_COST_BREAKDOWN = [
  { component: "Basic salary", amount: 28.4, fill: "#6366f1" },
  { component: "Allowances", amount: 8.6, fill: "#8b5cf6" },
  { component: "Overtime", amount: 3.2, fill: "#06b6d4" },
  { component: "Bonus", amount: 4.8, fill: "#10b981" },
  { component: "Employer contrib.", amount: 3.6, fill: "#94a3b8" },
];

export const PAYROLL_APPROVAL_QUEUE: PayrollApprovalItem[] = [
  {
    id: "pay-apr-1",
    type: "payroll_run",
    title: "June 2026 payroll run",
    reference: "PR-2026-06",
    submitter: "Payroll Team",
    amount: "৳48.62M net",
    headcount: 1248,
    submittedAt: "16 Jun, 4:32 PM",
    priority: "high",
    status: "pending",
    href: "/inbox/approvals?view=pay-apr-1&module=payroll",
  },
  {
    id: "pay-apr-2",
    type: "salary_revision",
    title: "Salary revision — Grade uplift",
    reference: "SR-2026-0042",
    submitter: "Fatima Rahman",
    amount: "+৳12,000/mo",
    submittedAt: "16 Jun, 11:20 AM",
    status: "pending",
    href: "/inbox/approvals?view=pay-apr-2&module=payroll",
  },
  {
    id: "pay-apr-3",
    type: "bonus",
    title: "Eid-ul-Adha bonus batch",
    reference: "BN-2026-008",
    submitter: "HR Operations",
    amount: "৳2.84M",
    headcount: 1248,
    submittedAt: "15 Jun",
    status: "escalated",
    priority: "high",
    href: "/inbox/approvals?view=pay-apr-3&module=payroll",
  },
  {
    id: "pay-apr-4",
    type: "commission",
    title: "Q2 sales commission — Dhaka",
    reference: "CM-2026-Q2-DHK",
    submitter: "Sales Ops",
    amount: "৳1.12M",
    headcount: 86,
    submittedAt: "14 Jun",
    status: "pending",
    href: "/inbox/approvals?view=pay-apr-4&module=payroll",
  },
  {
    id: "pay-apr-5",
    type: "salary_revision",
    title: "Promotion — Senior Engineer",
    reference: "SR-2026-0039",
    submitter: "Karim Hassan",
    amount: "+৳18,500/mo",
    submittedAt: "13 Jun",
    status: "pending",
    href: "/inbox/approvals?view=pay-apr-5&module=payroll",
  },
];

export const PAYROLL_COMPLIANCE_ALERTS: PayrollComplianceAlert[] = [
  {
    id: "cmp-1",
    severity: "critical",
    category: "Tax filing",
    title: "TDS return — May 2026 due",
    detail: "Monthly TDS submission deadline is 20 Jun 2026. 3 employees have missing PAN equivalents.",
    dueDate: "20 Jun 2026",
    href: "/payroll/reports/tax-filing?period=2026-05",
  },
  {
    id: "cmp-2",
    severity: "warning",
    category: "Validation",
    title: "12 payroll exceptions unresolved",
    detail: "Missing bank details (3) · negative net pay (2) · tax slab mismatch (7) in PR-2026-06.",
    href: "/payroll/runs?view=PR-2026-06&tab=validation",
  },
  {
    id: "cmp-3",
    severity: "warning",
    category: "Statutory",
    title: "Provident fund remittance pending",
    detail: "May 2026 PF contribution file not yet exported to NBFI gateway.",
    dueDate: "25 Jun 2026",
    href: "/payroll/export?type=pf",
  },
  {
    id: "cmp-4",
    severity: "info",
    category: "Data quality",
    title: "3 employees missing bank details",
    detail: "Cannot include in bank export until account verification is complete.",
    href: "/payroll/runs?view=PR-2026-06&filter=missing_bank",
  },
  {
    id: "cmp-5",
    severity: "info",
    category: "SoD",
    title: "Run awaiting second approver",
    detail: "PR-2026-06 requires Finance Controller sign-off per payroll approval policy.",
    href: "/inbox/approvals?status=pending&module=payroll",
  },
];

export const PAYROLL_AUDITOR_FINDINGS: PayrollAuditorFinding[] = [
  {
    id: "aud-1",
    severity: "critical",
    category: "Anomaly detection",
    title: "Net pay spike — 4 employees",
    summary:
      "June net pay exceeds 40% of 6-month average for 4 employees in Sales. Review commission and allowance components before approval.",
    confidence: "high",
    affectedCount: 4,
    source: "Batch scan · PR-2026-06",
  },
  {
    id: "aud-2",
    severity: "warning",
    category: "Compliance risks",
    title: "Tax slab misalignment",
    summary:
      "7 employees have taxable income crossing slab boundary without updated declaration. Statutory deduction may be understated.",
    confidence: "high",
    affectedCount: 7,
    source: "Compliance rules engine",
  },
  {
    id: "aud-3",
    severity: "warning",
    category: "Salary outliers",
    title: "Overtime cost +18% vs May",
    summary:
      "Operations overtime exceeds budget variance threshold. Correlates with unfilled shift coverage in Chittagong warehouse.",
    confidence: "medium",
    source: "Cost variance model",
  },
  {
    id: "aud-4",
    severity: "info",
    category: "Cost optimization",
    title: "Allowance consolidation opportunity",
    summary:
      "12 employees receive overlapping transport and fuel allowances. Policy review may reduce employer cost without net pay impact.",
    confidence: "medium",
    affectedCount: 12,
    source: "Policy advisor",
  },
  {
    id: "aud-5",
    severity: "info",
    category: "Payroll risks",
    title: "Prior period adjustment pending",
    summary:
      "2 retroactive salary revisions effective 01 Jun not yet reflected in current run calculation.",
    confidence: "high",
    affectedCount: 2,
    source: "Revision cross-check",
  },
];

export const PAYROLL_CALENDAR_EVENTS: PayrollCalendarEvent[] = [
  { id: "cal-1", date: "2026-06-05", day: 5, label: "Period open", type: "processing" },
  { id: "cal-2", date: "2026-06-15", day: 15, label: "Calculate", type: "processing" },
  { id: "cal-3", date: "2026-06-17", day: 17, label: "Approval due", type: "approval", isToday: true },
  { id: "cal-4", date: "2026-06-20", day: 20, label: "TDS filing", type: "tax" },
  { id: "cal-5", date: "2026-06-24", day: 24, label: "Lock deadline", type: "approval" },
  { id: "cal-6", date: "2026-06-25", day: 25, label: "Pay date", type: "pay_date" },
  { id: "cal-7", date: "2026-06-25", day: 25, label: "Bank export", type: "bank_export" },
];

export const PAYROLL_QUICK_ACTIONS: PayrollQuickAction[] = [
  { id: "QUICK-PAY-001", label: "New payroll run", href: "/payroll/runs?create=1" },
  { id: "QUICK-PAY-002", label: "Process payroll", href: "/payroll/runs?view=PR-2026-06" },
  { id: "QUICK-PAY-003", label: "Approve payroll", href: "/inbox/approvals?module=payroll&status=pending" },
  { id: "QUICK-PAY-004", label: "Lock payroll", href: "/payroll/runs?view=PR-2026-06&action=lock" },
  { id: "QUICK-PAY-005", label: "Export bank file", href: "/payroll/export" },
  { id: "QUICK-PAY-006", label: "Salary register", href: "/payroll/reports/salary-register" },
];

export const PAYROLL_BRANCHES = [
  { id: "all", label: "All branches" },
  { id: "dhk", label: "Dhaka HQ" },
  { id: "ctg", label: "Chittagong" },
  { id: "syl", label: "Sylhet" },
] as const;

export function formatPayrollMillions(value: number) {
  return `৳${value.toFixed(1)}M`;
}

export function formatPayrollAmount(amount: number) {
  if (amount >= 1_000_000) {
    return `৳${(amount / 1_000_000).toFixed(2)}M`;
  }
  return `৳${amount.toLocaleString("en-BD")}`;
}
