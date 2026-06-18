/**
 * HR & Payroll module navigation tree.
 * @see docs/modules/hr-payroll/uiux/HR_NAVIGATION_ARCHITECTURE.md
 * @see docs/modules/hr-payroll/uiux/HR_FIGMA_SCREEN_MAP.md
 *
 * L1 labels are fixed — do not rename.
 */

import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  BarChart3,
  Briefcase,
  Building2,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  Clock,
  FileText,
  GraduationCap,
  History,
  LayoutDashboard,
  Package,
  Settings,
  Sparkles,
  Timer,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

export type HrNavAction = "ai-chat";

export type HrNavItem = {
  id: string;
  title: string;
  href?: string;
  action?: HrNavAction;
  icon?: LucideIcon;
  badge?: number;
  children?: HrNavItem[];
};

/** Top-level module navigation — exact menu order from HR_NAVIGATION_ARCHITECTURE. */
export const HR_MODULE_NAV: HrNavItem[] = [
  {
    id: "NAV-HR-DSH-000",
    title: "Dashboard",
    href: "/hr",
    icon: LayoutDashboard,
  },
  {
    id: "NAV-HR-EMP-000",
    title: "Employees",
    icon: Users,
    children: [
      { id: "NAV-HR-EMP-001", title: "Employee Directory", href: "/hr/employees" },
      { id: "NAV-HR-EMP-003", title: "Employment Types", href: "/hr/organization/employment-types" },
      { id: "NAV-HR-EMP-007", title: "Documents", href: "/hr/documents/employees" },
      { id: "NAV-HR-EMP-008", title: "Employee Archive", href: "/hr/employees?status=archived" },
      { id: "NAV-HR-EMP-009", title: "Employee Analytics", href: "/hr/reports/headcount" },
    ],
  },
  {
    id: "NAV-HR-ORG-000",
    title: "Organization",
    icon: Building2,
    children: [
      { id: "NAV-HR-ORG-001", title: "Organization Hub", href: "/hr/organization" },
      { id: "NAV-HR-ORG-002", title: "Companies", href: "/settings/business" },
      { id: "NAV-HR-ORG-003", title: "Branches", href: "/settings/localisation/store-locations" },
      { id: "NAV-HR-ORG-004", title: "Locations", href: "/hr/organization/locations" },
      { id: "NAV-HR-ORG-005", title: "Departments", href: "/hr/organization/departments" },
      { id: "NAV-HR-ORG-006", title: "Teams", href: "/hr/organization/teams" },
      { id: "NAV-HR-ORG-007", title: "Designations", href: "/hr/organization/designations" },
      { id: "NAV-HR-ORG-008", title: "Reporting Structure", href: "/hr/organization/reporting" },
      { id: "NAV-HR-ORG-009", title: "Organization Chart", href: "/hr/organization/chart" },
    ],
  },
  {
    id: "NAV-HR-REC-000",
    title: "Recruitment",
    href: "/hr/recruitment",
    icon: UserPlus,
    children: [
      { id: "NAV-HR-REC-002", title: "Job Requisitions", href: "/hr/recruitment/requisitions" },
      { id: "NAV-HR-REC-004", title: "Candidates", href: "/hr/recruitment/candidates" },
      { id: "NAV-HR-REC-005", title: "Interviews", href: "/hr/recruitment/interviews" },
      { id: "NAV-HR-REC-007", title: "Hiring Pipeline", href: "/hr/recruitment" },
      { id: "NAV-HR-REC-008", title: "Reports", href: "/hr/reports/recruitment" },
    ],
  },
  {
    id: "NAV-HR-ATT-000",
    title: "Attendance",
    href: "/hr/attendance",
    icon: Clock,
    children: [
      { id: "NAV-HR-ATT-002", title: "Daily Attendance", href: "/hr/attendance/daily" },
      { id: "NAV-HR-ATT-003", title: "Monthly Attendance", href: "/hr/attendance/monthly" },
      { id: "NAV-HR-ATT-004", title: "Calendar View", href: "/hr/attendance/calendar" },
      { id: "NAV-HR-ATT-005", title: "Corrections", href: "/hr/attendance/corrections" },
      { id: "NAV-HR-ATT-006", title: "Approvals", href: "/hr/attendance/corrections?status=pending" },
      { id: "NAV-HR-ATT-007", title: "Device Management", href: "/hr/settings/devices" },
      { id: "NAV-HR-ATT-008", title: "Sync Logs", href: "/hr/attendance/devices/logs" },
      { id: "NAV-HR-ATT-009", title: "Analytics", href: "/hr/attendance/analytics" },
      { id: "NAV-HR-ATT-010", title: "Reports", href: "/hr/reports/attendance-daily" },
    ],
  },
  {
    id: "NAV-HR-SHF-000",
    title: "Shifts",
    href: "/hr/shifts",
    icon: CalendarClock,
    children: [
      { id: "NAV-HR-SHF-001", title: "Shift List", href: "/hr/shifts" },
      { id: "NAV-HR-SHF-002", title: "Shift Calendar", href: "/hr/shifts/calendar" },
      { id: "NAV-HR-SHF-003", title: "Shift Assignments", href: "/hr/shifts/assignments" },
      { id: "NAV-HR-SHF-004", title: "Shift Rotations", href: "/hr/shifts/rotations" },
      { id: "NAV-HR-SHF-005", title: "Shift Rules", href: "/hr/settings/shifts" },
      { id: "NAV-HR-SHF-006", title: "Exceptions", href: "/hr/shifts/conflicts" },
    ],
  },
  {
    id: "NAV-HR-LEV-000",
    title: "Leave",
    href: "/hr/leave",
    icon: CalendarDays,
    children: [
      { id: "NAV-HR-LEV-002", title: "Requests", href: "/hr/leave/requests" },
      { id: "NAV-HR-LEV-003", title: "Calendar", href: "/hr/leave/calendar" },
      { id: "NAV-HR-LEV-004", title: "Balances", href: "/hr/leave/balances" },
      { id: "NAV-HR-LEV-005", title: "Policies", href: "/hr/settings/leave" },
      { id: "NAV-HR-LEV-006", title: "Accrual Rules", href: "/hr/settings/leave/accrual" },
      { id: "NAV-HR-LEV-007", title: "Encashments", href: "/hr/leave/encashment" },
      { id: "NAV-HR-LEV-008", title: "Holidays", href: "/hr/settings/holidays" },
      { id: "NAV-HR-LEV-010", title: "Reports", href: "/hr/reports/leave-balance" },
    ],
  },
  {
    id: "NAV-PAY-ROOT",
    title: "Payroll",
    href: "/payroll",
    icon: Wallet,
    children: [
      { id: "NAV-PAY-PRD-001", title: "Payroll Periods", href: "/payroll/periods" },
      { id: "NAV-PAY-RUN-001", title: "Payroll Batches", href: "/payroll/runs" },
      { id: "NAV-PAY-RUN-003", title: "Approvals", href: "/payroll/runs?status=pending" },
      { id: "NAV-PAY-PSL-001", title: "Payslips", href: "/payroll/payslips" },
      { id: "NAV-PAY-STR-001", title: "Salary Structures", href: "/payroll/structures" },
      { id: "NAV-PAY-STR-002", title: "Components", href: "/payroll/structures/components" },
      { id: "NAV-PAY-STR-003", title: "Allowances", href: "/payroll/structures/allowances" },
      { id: "NAV-PAY-STR-004", title: "Deductions", href: "/payroll/structures/deductions" },
      { id: "NAV-PAY-STR-005", title: "Benefits", href: "/payroll/structures/benefits" },
      { id: "NAV-PAY-STR-006", title: "Tax Rules", href: "/payroll/settings/tax" },
      { id: "NAV-PAY-BON-001", title: "Bonus", href: "/payroll/bonuses" },
      { id: "NAV-PAY-COM-001", title: "Commission", href: "/payroll/commissions" },
      { id: "NAV-PAY-REV-001", title: "Salary Revisions", href: "/payroll/salary-revisions" },
      { id: "NAV-PAY-EXP-001", title: "Exports", href: "/payroll/export" },
      { id: "NAV-PAY-ANL-001", title: "Analytics", href: "/payroll/analytics" },
      { id: "NAV-PAY-RPT-000", title: "Reports", href: "/payroll/reports" },
    ],
  },
  {
    id: "NAV-HR-OVT-000",
    title: "Overtime",
    href: "/hr/overtime",
    icon: Timer,
    children: [
      { id: "NAV-HR-OVT-002", title: "Requests", href: "/hr/overtime/requests" },
      { id: "NAV-HR-OVT-003", title: "Approvals", href: "/hr/overtime/requests?status=pending" },
      { id: "NAV-HR-OVT-004", title: "Policies", href: "/hr/settings/overtime" },
      { id: "NAV-HR-OVT-005", title: "Calculations", href: "/hr/overtime/calculations" },
      { id: "NAV-HR-OVT-007", title: "Reports", href: "/hr/reports/overtime-summary" },
    ],
  },
  {
    id: "NAV-PAY-LON-000",
    title: "Loans & Advances",
    href: "/payroll/loans",
    icon: Banknote,
    children: [
      { id: "NAV-PAY-LON-002", title: "Loan Requests", href: "/payroll/loans/requests" },
      { id: "NAV-PAY-LON-006", title: "Advance Requests", href: "/payroll/advances" },
      { id: "NAV-PAY-LON-007", title: "Approvals", href: "/payroll/loans/requests?status=pending" },
      { id: "NAV-PAY-LON-005", title: "Recoveries", href: "/payroll/advances/recovery" },
      { id: "NAV-PAY-LON-009", title: "Reports", href: "/payroll/reports/advance-recovery" },
    ],
  },
  {
    id: "NAV-HR-PRF-000",
    title: "Performance",
    href: "/hr/performance",
    icon: TrendingUp,
    children: [
      { id: "NAV-HR-PRF-002", title: "Goals", href: "/hr/performance/goals" },
      { id: "NAV-HR-PRF-003", title: "KPIs", href: "/hr/performance/kpis" },
      { id: "NAV-HR-PRF-004", title: "KRAs", href: "/hr/performance/kras" },
      { id: "NAV-HR-PRF-005", title: "Review Cycles", href: "/hr/performance/cycles" },
      { id: "NAV-HR-PRF-006", title: "Reviews", href: "/hr/performance/manager-reviews" },
      { id: "NAV-HR-PRF-007", title: "Recommendations", href: "/hr/performance/promotions" },
      { id: "NAV-HR-PRF-010", title: "Reports", href: "/hr/reports/performance-summary" },
    ],
  },
  {
    id: "NAV-HR-TRN-000",
    title: "Training",
    href: "/hr/training",
    icon: GraduationCap,
    children: [
      { id: "NAV-HR-TRN-002", title: "Programs", href: "/hr/training/programs" },
      { id: "NAV-HR-TRN-003", title: "Sessions", href: "/hr/training/sessions" },
      { id: "NAV-HR-TRN-004", title: "Participants", href: "/hr/training/participants" },
      { id: "NAV-HR-TRN-005", title: "Attendance", href: "/hr/training/attendance" },
      { id: "NAV-HR-TRN-006", title: "Certificates", href: "/hr/training/certificates" },
      { id: "NAV-HR-TRN-007", title: "Evaluations", href: "/hr/training/evaluations" },
      { id: "NAV-HR-TRN-010", title: "Reports", href: "/hr/reports/training-completion" },
    ],
  },
  {
    id: "NAV-HR-AST-000",
    title: "Assets",
    href: "/hr/assets",
    icon: Package,
    children: [
      { id: "NAV-HR-AST-002", title: "Inventory", href: "/hr/assets/inventory" },
      { id: "NAV-HR-AST-003", title: "Assignments", href: "/hr/assets/assignments" },
      { id: "NAV-HR-AST-004", title: "Returns", href: "/hr/assets/returns" },
      { id: "NAV-HR-AST-005", title: "Damages", href: "/hr/assets/damages" },
      { id: "NAV-HR-AST-006", title: "Replacements", href: "/hr/assets/replacements" },
      { id: "NAV-HR-AST-007", title: "Disposal", href: "/hr/assets/disposal" },
      { id: "NAV-HR-AST-010", title: "Reports", href: "/hr/reports/asset-custody" },
    ],
  },
  {
    id: "NAV-HR-DOC-000",
    title: "Documents",
    href: "/hr/documents",
    icon: FileText,
    children: [
      { id: "NAV-HR-DOC-002", title: "Employee Documents", href: "/hr/documents/employees" },
      { id: "NAV-HR-DOC-003", title: "Contracts", href: "/hr/documents/contracts" },
      { id: "NAV-HR-DOC-005", title: "Expiry Tracker", href: "/hr/documents/expiry" },
      { id: "NAV-HR-DOC-006", title: "Renewals", href: "/hr/documents/renewals" },
      { id: "NAV-HR-DOC-007", title: "Archive", href: "/hr/documents/archive" },
      { id: "NAV-HR-DOC-008", title: "Reports", href: "/hr/reports/compliance-pack" },
    ],
  },
  {
    id: "NAV-HR-RPT-000",
    title: "Reports",
    href: "/hr/reports",
    icon: BarChart3,
    children: [
      { id: "NAV-HR-RPT-002", title: "Attendance Reports", href: "/hr/reports/attendance-daily" },
      { id: "NAV-HR-RPT-003", title: "Leave Reports", href: "/hr/reports/leave-balance" },
      { id: "NAV-HR-RPT-004", title: "Payroll Reports", href: "/payroll/reports" },
      { id: "NAV-HR-RPT-005", title: "Overtime Reports", href: "/hr/reports/overtime-summary" },
      { id: "NAV-HR-RPT-010", title: "Compliance Reports", href: "/hr/reports/compliance-pack" },
      { id: "NAV-HR-RPT-011", title: "Executive Reports", href: "/hr/executive" },
    ],
  },
  {
    id: "NAV-COR-APR-000",
    title: "Approvals",
    href: "/inbox/approvals",
    icon: ClipboardCheck,
    badge: 5,
    children: [
      { id: "NAV-COR-APR-002", title: "Pending", href: "/inbox/approvals?status=pending" },
      { id: "NAV-COR-APR-003", title: "Approved", href: "/inbox/approvals?status=approved" },
      { id: "NAV-COR-APR-004", title: "Rejected", href: "/inbox/approvals?status=rejected" },
      { id: "NAV-COR-APR-005", title: "Escalated", href: "/inbox/approvals?status=escalated" },
      { id: "NAV-COR-APR-006", title: "History", href: "/inbox/approvals/history" },
    ],
  },
  {
    id: "NAV-HR-ACT-000",
    title: "Activity Timeline",
    href: "/hr/activity",
    icon: History,
    children: [
      { id: "NAV-HR-ACT-003", title: "Attendance Activities", href: "/hr/attendance/timeline" },
      { id: "NAV-HR-ACT-005", title: "Audit Logs", href: "/hr/reports/audit-export" },
    ],
  },
  {
    id: "NAV-AI-HR-000",
    title: "AI Assistant",
    href: "/hr/ai",
    icon: Sparkles,
    children: [
      { id: "NAV-AI-HR-002", title: "Chat", action: "ai-chat" },
      { id: "NAV-AI-HR-003", title: "Insights", href: "/hr/ai/insights" },
      { id: "NAV-AI-HR-004", title: "Recommendations", href: "/hr/ai/promotions" },
      { id: "NAV-AI-HR-005", title: "Predictions", href: "/hr/ai/attrition" },
      { id: "NAV-AI-HR-008", title: "History", href: "/hr/ai/history" },
    ],
  },
  {
    id: "NAV-HR-SET-000",
    title: "Settings",
    href: "/hr/settings",
    icon: Settings,
    children: [
      { id: "NAV-HR-SET-002", title: "Attendance Settings", href: "/hr/settings/attendance" },
      { id: "NAV-HR-SET-003", title: "Leave Settings", href: "/hr/settings/leave" },
      { id: "NAV-HR-SET-004", title: "Payroll Settings", href: "/payroll/settings" },
      { id: "NAV-HR-SET-005", title: "Overtime Settings", href: "/hr/settings/overtime" },
      { id: "NAV-HR-SET-006", title: "Loan Settings", href: "/payroll/settings/loans" },
      { id: "NAV-HR-SET-007", title: "Performance Settings", href: "/hr/settings/performance" },
      { id: "NAV-HR-SET-008", title: "Training Settings", href: "/hr/settings/training" },
      { id: "NAV-HR-SET-009", title: "Asset Settings", href: "/hr/settings/assets" },
    ],
  },
];

export const HR_MODULE_ROOT = {
  id: "NAV-HR-ROOT",
  title: "HR & Payroll",
  icon: Briefcase,
} as const;

export type FlatNavEntry = {
  id: string;
  title: string;
  href: string;
  path: string[];
};

export function flattenHrNav(
  items: HrNavItem[] = HR_MODULE_NAV,
  parents: string[] = [],
): FlatNavEntry[] {
  const out: FlatNavEntry[] = [];
  for (const item of items) {
    const path = [...parents, item.title];
    if (item.href) {
      out.push({ id: item.id, title: item.title, href: item.href, path });
    }
    if (item.children?.length) {
      out.push(...flattenHrNav(item.children, path));
    }
  }
  return out;
}

export function isHrModulePath(pathname: string): boolean {
  return (
    pathname.startsWith("/hr") ||
    pathname.startsWith("/payroll") ||
    pathname.startsWith("/inbox/approvals")
  );
}

export function matchNavHref(pathname: string, search: string, href?: string): boolean {
  if (!href) return false;
  const [path, query] = href.split("?");
  const pathMatch = pathname === path || (path !== "/hr" && pathname.startsWith(`${path}/`));
  if (!pathMatch) return false;
  if (!query) {
    if (path === "/hr" && pathname !== "/hr") return false;
    return true;
  }
  const params = new URLSearchParams(query);
  const current = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  for (const [key, value] of params.entries()) {
    if (current.get(key) !== value) return false;
  }
  return true;
}

export function isNavItemActive(pathname: string, search: string, item: HrNavItem): boolean {
  if (item.href && matchNavHref(pathname, search, item.href)) return true;
  return item.children?.some((c) => isNavItemActive(pathname, search, c)) ?? false;
}

export function findHrNavItemByHref(
  href: string,
  items: HrNavItem[] = HR_MODULE_NAV,
): HrNavItem | undefined {
  for (const item of items) {
    if (item.href === href) return item;
    if (item.children) {
      const found = findHrNavItemByHref(href, item.children);
      if (found) return found;
    }
  }
  return undefined;
}
