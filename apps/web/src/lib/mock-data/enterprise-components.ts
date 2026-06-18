/**
 * Mock examples for enterprise component library showcase.
 * @see docs/design-system/HR_DESIGN_SYSTEM_SPECIFICATION.md
 */

import type {
  EnterpriseAiInsightCardData,
  EnterpriseAiRecommendationCardData,
  EnterpriseAnalyticsCardData,
  EnterpriseApprovalCardData,
  EnterpriseEmployeeCardData,
  EnterpriseKpiCardData,
  EnterpriseNotificationCardData,
  EnterpriseQuickActionCardData,
  EnterpriseTimelineCardData,
} from "@/components/enterprise/types";

export const MOCK_ENTERPRISE_KPIS: EnterpriseKpiCardData[] = [
  {
    id: "kpi-1",
    label: "Present today",
    value: "1,086",
    trend: "87.0%",
    trendDirection: "neutral",
    hint: "of expected workforce",
    status: "good",
    href: "/hr/attendance",
  },
  {
    id: "kpi-2",
    label: "Pending approvals",
    value: "24",
    trend: "+3",
    trendDirection: "up",
    hint: "vs yesterday",
    status: "warning",
    href: "/inbox/approvals",
  },
  {
    id: "kpi-3",
    label: "Payroll exceptions",
    value: "12",
    trend: "Critical",
    trendDirection: "down",
    status: "critical",
    href: "/payroll",
  },
  {
    id: "kpi-4",
    label: "Headcount",
    value: "1,248",
    trend: "+18",
    trendDirection: "up",
    hint: "net this quarter",
    status: "neutral",
    href: "/hr/employees",
  },
];

export const MOCK_ENTERPRISE_ANALYTICS: EnterpriseAnalyticsCardData = {
  id: "ana-1",
  title: "Attendance trend",
  subtitle: "Last 14 days · all branches",
  metric: "94.2%",
  metricLabel: "avg rate",
  footer: "Updated 5m ago",
  href: "/hr/attendance",
};

export const MOCK_ENTERPRISE_APPROVALS: EnterpriseApprovalCardData[] = [
  {
    id: "apr-001",
    requestId: "APR-2026-00482",
    module: "Payroll",
    requestType: "Payroll run approval · PR-2026-06",
    requester: "Fatima Rahman",
    department: "Finance",
    priority: "high",
    status: "pending",
    submittedAt: "17 Jun, 08:30 AM",
    href: "/inbox/approvals?view=apr-001",
  },
  {
    id: "apr-002",
    requestId: "APR-2026-00479",
    module: "HR",
    requestType: "Annual leave · 24–28 Jun",
    requester: "Karim Hassan",
    department: "Technology",
    priority: "medium",
    status: "escalated",
    submittedAt: "16 Jun, 09:02 AM",
    href: "/inbox/approvals?view=apr-002",
  },
];

export const MOCK_ENTERPRISE_TIMELINE: EnterpriseTimelineCardData[] = [
  {
    id: "tl-1",
    title: "Payroll run calculated",
    description: "PR-2026-06 calculated for 1,248 employees. Net pay ৳48.62M.",
    user: "System",
    department: "Payroll",
    module: "Payroll",
    timestamp: "17 Jun 2026, 07:15",
    relativeTime: "2h ago",
    priority: "high",
    unread: true,
    href: "/hr/activity?activity=act-pay-1",
  },
  {
    id: "tl-2",
    title: "Leave request submitted",
    description: "Karim Hassan applied for annual leave 24–28 Jun.",
    user: "Karim Hassan",
    department: "Technology",
    module: "HR",
    timestamp: "16 Jun 2026, 09:02",
    relativeTime: "Yesterday",
    priority: "medium",
    href: "/hr/activity?activity=act-lev-1",
  },
];

export const MOCK_ENTERPRISE_EMPLOYEES: EnterpriseEmployeeCardData[] = [
  {
    id: "emp-003",
    name: "Karim Hassan",
    employeeNumber: "EMP-0003",
    designation: "Senior Software Engineer",
    department: "Technology",
    branch: "Dhaka HQ",
    status: "active",
    href: "/hr/employees?view=emp-003",
    meta: "Joined Jan 2020",
  },
  {
    id: "emp-014",
    name: "Shahid Alam",
    employeeNumber: "EMP-0014",
    designation: "Engineering Lead",
    department: "Technology",
    branch: "Chittagong",
    status: "active",
    href: "/hr/employees?view=emp-014",
  },
];

export const MOCK_ENTERPRISE_AI_INSIGHTS: EnterpriseAiInsightCardData[] = [
  {
    id: "ins-1",
    title: "Late arrival cluster — Operations",
    summary: "18% above 30-day average between 08:45–09:15. Chittagong shift coverage gaps correlate.",
    severity: "warning",
    confidence: "high",
    href: "/hr/attendance",
    actions: [
      { id: "a1", label: "Open report", href: "/hr/reports/attendance" },
      { id: "a2", label: "View department" },
    ],
  },
  {
    id: "ins-2",
    title: "12 payroll exceptions unresolved",
    summary: "Resolve before lock — missing bank details and tax slab mismatches flagged.",
    severity: "critical",
    confidence: "high",
    href: "/payroll",
  },
];

export const MOCK_ENTERPRISE_AI_RECOMMENDATIONS: EnterpriseAiRecommendationCardData[] = [
  {
    id: "rec-1",
    title: "Promotion readiness — Shahid Alam",
    summary: "Exceeds performance threshold (4.4/5) for 2 cycles. Recommend Senior Engineer track.",
    type: "promotion",
    priority: "high",
    subject: "EMP-0014",
    href: "/hr/employees?view=emp-014&tab=performance",
  },
  {
    id: "rec-2",
    title: "Mandatory security training — 38 overdue",
    summary: "Information Security refresher due 21 Jun. Operations highest gap.",
    type: "training",
    priority: "high",
    href: "/hr/training",
  },
  {
    id: "rec-3",
    title: "WFH policy capacity review",
    summary: "Dhaka HQ WFH utilization at 92% of approved capacity.",
    type: "policy",
    priority: "medium",
    href: "/hr/settings/leave",
  },
];

export const MOCK_ENTERPRISE_NOTIFICATIONS: EnterpriseNotificationCardData[] = [
  {
    id: "n-1",
    title: "Leave request update",
    body: "Your annual leave (24–28 Jun) is awaiting HR approval.",
    time: "30 min ago",
    unread: true,
    category: "Leave",
    href: "/ess/leave",
  },
  {
    id: "n-2",
    title: "June payslip available",
    body: "Your payslip for June 2026 is ready to download.",
    time: "2h ago",
    unread: true,
    category: "Payroll",
    href: "/ess/payslips",
  },
  {
    id: "n-3",
    title: "Training reminder",
    body: "Complete Information Security training by 21 Jun.",
    time: "Yesterday",
    unread: false,
    category: "Training",
    href: "/ess/training",
  },
];

export const MOCK_ENTERPRISE_QUICK_ACTIONS: EnterpriseQuickActionCardData[] = [
  { id: "qa-1", label: "Apply Leave", description: "Submit time-off request", href: "/ess/leave?create=1", icon: "calendar" },
  { id: "qa-2", label: "Attendance correction", href: "/ess/attendance?correction=1", icon: "clock" },
  { id: "qa-3", label: "Download payslip", href: "/ess/payslips", icon: "wallet" },
  { id: "qa-4", label: "Ask AI", description: "Leave balance, pay, attendance", href: "/ess/ai", icon: "sparkles" },
];

export const MOCK_ENTERPRISE_BADGES = {
  statuses: ["active", "pending", "approved", "rejected", "draft", "locked", "archived"] as const,
  risks: ["none", "low", "medium", "high", "critical"] as const,
  approvals: ["pending", "approved", "rejected", "escalated", "delegated"] as const,
};
