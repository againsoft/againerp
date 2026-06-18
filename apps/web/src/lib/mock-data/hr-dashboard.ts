/**
 * HR Dashboard mock data — SCR-HR-DSH-001 · DSH-HRM-001
 * @see docs/modules/hr-payroll/uiux/HR_DASHBOARD_UI_ARCHITECTURE.md
 */

export type HrDashboardKpi = {
  id: string;
  label: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  status?: "good" | "warning" | "critical" | "neutral";
  comparisonLabel?: string;
  hint?: string;
  href: string;
};

export type HrDashboardApproval = {
  id: string;
  type: string;
  title: string;
  requester: string;
  submittedAt: string;
  priority?: "high" | "normal";
  href: string;
};

export type HrDashboardActivity = {
  id: string;
  category: "employee" | "attendance" | "payroll" | "training" | "leave";
  title: string;
  meta: string;
  time: string;
  href?: string;
};

export type HrDashboardNotification = {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  meta: string;
  time: string;
  href?: string;
};

export type HrDashboardAiInsight = {
  id: string;
  title: string;
  summary: string;
  confidence: "high" | "medium" | "low";
  category: string;
  href: string;
};

export type HrDashboardQuickAction = {
  id: string;
  label: string;
  href: string;
};

export const HR_DASHBOARD_AS_OF = "17 Jun 2026, 09:15 AM";

export const HR_DASHBOARD_BRANCHES = [
  { id: "all", label: "All branches" },
  { id: "dhk", label: "Dhaka HQ" },
  { id: "ctg", label: "Chittagong" },
  { id: "syl", label: "Sylhet" },
] as const;

export const HR_DASHBOARD_DEPARTMENTS = [
  { id: "all", label: "All departments" },
  { id: "ops", label: "Operations" },
  { id: "sales", label: "Sales & Marketing" },
  { id: "finance", label: "Finance" },
  { id: "it", label: "Technology" },
  { id: "hr", label: "Human Resources" },
] as const;

export const HR_DASHBOARD_DATE_RANGES = [
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "mtd", label: "Month to date" },
  { id: "qtd", label: "Quarter to date" },
] as const;

export const HR_DASHBOARD_KPIS: HrDashboardKpi[] = [
  {
    id: "WGT-HR-KPI-001",
    label: "Total Employees",
    value: "1,248",
    trend: "+3.2%",
    trendDirection: "up",
    status: "good",
    comparisonLabel: "vs last month",
    hint: "Active headcount",
    href: "/hr/employees",
  },
  {
    id: "WGT-HR-KPI-002",
    label: "Present Today",
    value: "1,086",
    trend: "87.0%",
    trendDirection: "neutral",
    status: "good",
    comparisonLabel: "attendance rate",
    hint: "Checked in by 09:15",
    href: "/hr/attendance/daily?status=present",
  },
  {
    id: "WGT-HR-KPI-003",
    label: "Absent Today",
    value: "42",
    trend: "+6",
    trendDirection: "up",
    status: "warning",
    comparisonLabel: "vs yesterday",
    hint: "Unplanned absences",
    href: "/hr/attendance/daily?status=absent",
  },
  {
    id: "WGT-HR-KPI-004",
    label: "Late Today",
    value: "67",
    trend: "−12%",
    trendDirection: "down",
    status: "good",
    comparisonLabel: "vs last week avg",
    hint: "After grace period",
    href: "/hr/attendance/daily?status=late",
  },
  {
    id: "WGT-HR-KPI-005",
    label: "On Leave",
    value: "53",
    trend: "18 planned",
    trendDirection: "neutral",
    status: "neutral",
    comparisonLabel: "approved today",
    hint: "Includes half-day",
    href: "/hr/leave/calendar?today=1",
  },
  {
    id: "WGT-HR-KPI-007",
    label: "Pending Approvals",
    value: "23",
    trend: "5 urgent",
    trendDirection: "up",
    status: "critical",
    comparisonLabel: "action required",
    hint: "Leave · attendance · payroll",
    href: "/inbox/approvals?status=pending",
  },
];

export const HR_DASHBOARD_ATTENDANCE_TRENDS = [
  { date: "19 May", present: 1042, absent: 38, late: 72 },
  { date: "26 May", present: 1058, absent: 35, late: 68 },
  { date: "02 Jun", present: 1071, absent: 41, late: 74 },
  { date: "09 Jun", present: 1080, absent: 39, late: 65 },
  { date: "16 Jun", present: 1086, absent: 42, late: 67 },
];

export const HR_DASHBOARD_LEAVE_TRENDS = [
  { date: "Jan", annual: 124, sick: 48, unpaid: 12 },
  { date: "Feb", annual: 98, sick: 52, unpaid: 8 },
  { date: "Mar", annual: 142, sick: 41, unpaid: 15 },
  { date: "Apr", annual: 118, sick: 55, unpaid: 10 },
  { date: "May", annual: 136, sick: 47, unpaid: 11 },
  { date: "Jun", annual: 89, sick: 38, unpaid: 6 },
];

export const HR_DASHBOARD_HEADCOUNT_TRENDS = [
  { date: "Jan", headcount: 1186 },
  { date: "Feb", headcount: 1194 },
  { date: "Mar", headcount: 1208 },
  { date: "Apr", headcount: 1219 },
  { date: "May", headcount: 1235 },
  { date: "Jun", headcount: 1248 },
];

export const HR_DASHBOARD_DEPARTMENT_DISTRIBUTION = [
  { department: "Operations", count: 412, fill: "#10b981" },
  { department: "Sales & Marketing", count: 286, fill: "#6366f1" },
  { department: "Technology", count: 198, fill: "#8b5cf6" },
  { department: "Finance", count: 124, fill: "#f59e0b" },
  { department: "Human Resources", count: 86, fill: "#ec4899" },
  { department: "Other", count: 142, fill: "#94a3b8" },
];

export const HR_DASHBOARD_APPROVALS: HrDashboardApproval[] = [
  {
    id: "apr-1",
    type: "Leave",
    title: "Annual leave — 5 days",
    requester: "Fatima Rahman",
    submittedAt: "09:02 AM",
    priority: "high",
    href: "/inbox/approvals?status=pending&type=leave",
  },
  {
    id: "apr-2",
    type: "Attendance",
    title: "Correction — missed punch-out",
    requester: "Karim Hassan",
    submittedAt: "08:47 AM",
    href: "/inbox/approvals?status=pending&type=attendance",
  },
  {
    id: "apr-3",
    type: "Leave",
    title: "Sick leave — 2 days",
    requester: "Nusrat Jahan",
    submittedAt: "Yesterday",
    href: "/inbox/approvals?status=pending&type=leave",
  },
  {
    id: "apr-4",
    type: "Loan",
    title: "Personal loan — BDT 150,000",
    requester: "Rafiq Ahmed",
    submittedAt: "Yesterday",
    priority: "high",
    href: "/payroll/loans/requests?status=pending",
  },
  {
    id: "apr-5",
    type: "Overtime",
    title: "OT claim — 6.5 hours",
    requester: "Sadia Islam",
    submittedAt: "16 Jun",
    href: "/hr/overtime/requests?status=pending",
  },
  {
    id: "apr-6",
    type: "Performance",
    title: "Manager review — Q2 cycle",
    requester: "Team: Operations",
    submittedAt: "15 Jun",
    href: "/hr/performance/manager-reviews?status=pending",
  },
];

export const HR_DASHBOARD_ACTIVITIES: HrDashboardActivity[] = [
  {
    id: "act-1",
    category: "employee",
    title: "New hire onboarded",
    meta: "Arif Chowdhury · EMP-1248 · Operations",
    time: "12 min ago",
    href: "/hr/employees?view=emp-1248",
  },
  {
    id: "act-2",
    category: "attendance",
    title: "Shift roster published",
    meta: "Chittagong branch · Week 25",
    time: "34 min ago",
    href: "/hr/shifts/calendar",
  },
  {
    id: "act-3",
    category: "payroll",
    title: "June payroll batch submitted",
    meta: "PR-2026-06 · 1,248 employees",
    time: "1h ago",
    href: "/payroll/runs?view=pr-2026-06",
  },
  {
    id: "act-4",
    category: "leave",
    title: "Leave encashment processed",
    meta: "12 employees · BDT 284,500",
    time: "2h ago",
    href: "/hr/leave/encashment",
  },
  {
    id: "act-5",
    category: "training",
    title: "Safety induction completed",
    meta: "18 participants · Dhaka HQ",
    time: "3h ago",
    href: "/hr/training/sessions",
  },
  {
    id: "act-6",
    category: "employee",
    title: "Salary revision approved",
    meta: "Tasnim Karim · Effective 1 Jul",
    time: "5h ago",
    href: "/payroll/salary-revisions",
  },
];

export const HR_DASHBOARD_NOTIFICATIONS: HrDashboardNotification[] = [
  {
    id: "ntf-1",
    severity: "critical",
    title: "5 work permits expiring within 14 days",
    meta: "Compliance · Document expiry tracker",
    time: "30 min ago",
    href: "/hr/documents/expiry",
  },
  {
    id: "ntf-2",
    severity: "warning",
    title: "Payroll run awaiting final approval",
    meta: "June 2026 · PR-2026-06",
    time: "1h ago",
    href: "/payroll/runs?status=pending",
  },
  {
    id: "ntf-3",
    severity: "warning",
    title: "Attendance device sync failed — Sylhet",
    meta: "Device BIO-SYL-02 · 3 failed attempts",
    time: "2h ago",
    href: "/hr/attendance/devices/logs",
  },
  {
    id: "ntf-4",
    severity: "info",
    title: "12 leave requests pending manager action",
    meta: "Across 4 departments",
    time: "4h ago",
    href: "/hr/leave/requests?status=pending",
  },
  {
    id: "ntf-5",
    severity: "info",
    title: "Q2 performance review cycle opens Monday",
    meta: "HR · Performance module",
    time: "Yesterday",
    href: "/hr/performance/cycles",
  },
];

export const HR_DASHBOARD_AI_INSIGHTS: HrDashboardAiInsight[] = [
  {
    id: "WGT-AI-INS-001",
    title: "Attendance risk — Operations",
    summary:
      "Late arrivals in Operations are 18% above the 30-day average. Consider shift start reminders for the 07:00 roster.",
    confidence: "high",
    category: "Attendance",
    href: "/hr/ai/insights?category=attendance",
  },
  {
    id: "WGT-AI-INS-006",
    title: "Leave balance pressure — Sales",
    summary:
      "14 employees in Sales have unused annual leave exceeding policy threshold before fiscal year-end.",
    confidence: "medium",
    category: "Leave",
    href: "/hr/ai/insights?category=leave",
  },
  {
    id: "WGT-AI-INS-003",
    title: "Attrition signal — Technology",
    summary:
      "Voluntary exit intent score elevated for 3 senior engineers based on tenure, OT patterns, and engagement proxies.",
    confidence: "medium",
    category: "Workforce",
    href: "/hr/ai/attrition",
  },
];

export const HR_DASHBOARD_QUICK_ACTIONS: HrDashboardQuickAction[] = [
  { id: "WGT-QAC-001", label: "Create Employee", href: "/hr/employees?create=1" },
  { id: "WGT-QAC-002", label: "Approve Leave", href: "/inbox/approvals?status=pending&type=leave" },
  { id: "WGT-QAC-005", label: "Assign Training", href: "/hr/training/sessions?create=1" },
  { id: "WGT-QAC-006", label: "Generate Report", href: "/hr/reports" },
  { id: "QUICK-PAY-RUN-001", label: "Process Payroll", href: "/payroll/runs" },
  { id: "WGT-QAC-ATT", label: "View Attendance", href: "/hr/attendance/daily" },
];

export const HR_DASHBOARD_ACTIVITY_TABS = [
  { id: "all", label: "All" },
  { id: "employee", label: "Employees" },
  { id: "attendance", label: "Attendance" },
  { id: "payroll", label: "Payroll" },
  { id: "training", label: "Training" },
] as const;
