/**
 * Leave Dashboard mock data — SCR-HR-LEV-001 · DSH-LEV-001
 * @see docs/modules/hr-payroll/uiux/LEAVE_UI_ARCHITECTURE.md
 */

export type LeaveDashboardKpi = {
  id: string;
  label: string;
  value: string;
  count: number;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  status?: "good" | "warning" | "critical" | "neutral";
  hint?: string;
  href: string;
};

export type LeaveApprovalItem = {
  id: string;
  requestNo: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  submittedAt: string;
  priority?: "high" | "normal";
  status: "pending" | "escalated";
  href: string;
};

export type LeaveCalendarDay = {
  date: string;
  label: string;
  dayOfWeek: string;
  count: number;
  isToday?: boolean;
  isWeekend?: boolean;
};

export type LeaveCalendarEmployee = {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
};

export type LeaveAiInsight = {
  id: string;
  title: string;
  summary: string;
  severity: "info" | "warning" | "critical";
  category: string;
};

export const LEAVE_DASHBOARD_AS_OF = "17 Jun 2026, 09:15 AM";

export const LEAVE_DASHBOARD_KPIS: LeaveDashboardKpi[] = [
  {
    id: "WGT-LEV-KPI-001",
    label: "Pending Requests",
    value: "18",
    count: 18,
    trend: "+4",
    trendDirection: "up",
    status: "warning",
    hint: "Awaiting approval",
    href: "/hr/leave/requests?status=pending",
  },
  {
    id: "WGT-LEV-KPI-002",
    label: "Approved",
    value: "142",
    count: 142,
    trend: "MTD",
    trendDirection: "neutral",
    status: "good",
    hint: "This month",
    href: "/hr/leave/requests?status=approved",
  },
  {
    id: "WGT-LEV-KPI-003",
    label: "Rejected",
    value: "7",
    count: 7,
    trend: "−2",
    trendDirection: "down",
    status: "good",
    hint: "vs last month",
    href: "/hr/leave/requests?status=rejected",
  },
  {
    id: "WGT-LEV-KPI-004",
    label: "Employees On Leave",
    value: "23",
    count: 23,
    trend: "Today",
    trendDirection: "neutral",
    status: "neutral",
    hint: "Across all branches",
    href: "/hr/leave/calendar?today=1",
  },
];

export const LEAVE_DEPARTMENT_ANALYTICS = [
  { department: "Operations", daysTaken: 186, pending: 6, employees: 42 },
  { department: "Sales & Marketing", daysTaken: 124, pending: 4, employees: 28 },
  { department: "Technology", daysTaken: 98, pending: 3, employees: 22 },
  { department: "Finance", daysTaken: 62, pending: 1, employees: 14 },
  { department: "Human Resources", daysTaken: 48, pending: 2, employees: 12 },
  { department: "Logistics", daysTaken: 74, pending: 2, employees: 18 },
];

export const LEAVE_TYPE_DISTRIBUTION = [
  { type: "Annual", days: 312, fill: "#6366f1" },
  { type: "Sick", days: 148, fill: "#8b5cf6" },
  { type: "Casual", days: 86, fill: "#06b6d4" },
  { type: "Unpaid", days: 46, fill: "#94a3b8" },
];

export const LEAVE_MONTHLY_TREND = [
  { month: "Jan", approved: 198, rejected: 12 },
  { month: "Feb", approved: 176, rejected: 9 },
  { month: "Mar", approved: 224, rejected: 14 },
  { month: "Apr", approved: 208, rejected: 11 },
  { month: "May", approved: 218, rejected: 10 },
  { month: "Jun", approved: 142, rejected: 7 },
];

export const LEAVE_APPROVAL_QUEUE: LeaveApprovalItem[] = [
  {
    id: "lv-apr-1",
    requestNo: "LR-2026-0142",
    employeeId: "emp-002",
    employeeName: "Fatima Rahman",
    department: "Human Resources",
    leaveType: "Annual leave",
    startDate: "24 Jun",
    endDate: "28 Jun",
    days: 5,
    submittedAt: "09:02 AM",
    priority: "high",
    status: "pending",
    href: "/hr/leave/requests?view=lv-apr-1",
  },
  {
    id: "lv-apr-2",
    requestNo: "LR-2026-0141",
    employeeId: "emp-009",
    employeeName: "Mariam Akter",
    department: "Sales & Marketing",
    leaveType: "Sick leave",
    startDate: "17 Jun",
    endDate: "18 Jun",
    days: 2,
    submittedAt: "08:31 AM",
    status: "pending",
    href: "/hr/leave/requests?view=lv-apr-2",
  },
  {
    id: "lv-apr-3",
    requestNo: "LR-2026-0138",
    employeeId: "emp-016",
    employeeName: "Jamal Uddin",
    department: "Operations",
    leaveType: "Casual leave",
    startDate: "20 Jun",
    endDate: "20 Jun",
    days: 1,
    submittedAt: "Yesterday",
    status: "escalated",
    priority: "high",
    href: "/hr/leave/requests?view=lv-apr-3",
  },
  {
    id: "lv-apr-4",
    requestNo: "LR-2026-0135",
    employeeId: "emp-005",
    employeeName: "Sadia Islam",
    department: "Operations",
    leaveType: "Annual leave",
    startDate: "01 Jul",
    endDate: "05 Jul",
    days: 5,
    submittedAt: "16 Jun",
    status: "pending",
    href: "/hr/leave/requests?view=lv-apr-4",
  },
  {
    id: "lv-apr-5",
    requestNo: "LR-2026-0132",
    employeeId: "emp-014",
    employeeName: "Shahid Alam",
    department: "Technology",
    leaveType: "Annual leave",
    startDate: "25 Jun",
    endDate: "27 Jun",
    days: 3,
    submittedAt: "15 Jun",
    status: "pending",
    href: "/hr/leave/requests?view=lv-apr-5",
  },
  {
    id: "lv-apr-6",
    requestNo: "LR-2026-0129",
    employeeId: "emp-020",
    employeeName: "Rubel Mia",
    department: "Logistics",
    leaveType: "Unpaid leave",
    startDate: "19 Jun",
    endDate: "21 Jun",
    days: 3,
    submittedAt: "14 Jun",
    status: "pending",
    href: "/hr/leave/requests?view=lv-apr-6",
  },
];

/** Week strip for WGT-LEV-CAL-001 — week of 16–22 Jun 2026 */
export const LEAVE_CALENDAR_WEEK: LeaveCalendarDay[] = [
  { date: "2026-06-16", label: "16", dayOfWeek: "Mon", count: 19 },
  { date: "2026-06-17", label: "17", dayOfWeek: "Tue", count: 23, isToday: true },
  { date: "2026-06-18", label: "18", dayOfWeek: "Wed", count: 21 },
  { date: "2026-06-19", label: "19", dayOfWeek: "Thu", count: 18 },
  { date: "2026-06-20", label: "20", dayOfWeek: "Fri", count: 26 },
  { date: "2026-06-21", label: "21", dayOfWeek: "Sat", count: 8, isWeekend: true },
  { date: "2026-06-22", label: "22", dayOfWeek: "Sun", count: 6, isWeekend: true },
];

export const LEAVE_ON_LEAVE_TODAY: LeaveCalendarEmployee[] = [
  {
    id: "out-1",
    employeeId: "emp-004",
    employeeName: "Nusrat Jahan",
    employeeNumber: "EMP-0004",
    department: "Sales & Marketing",
    leaveType: "Annual leave",
    startDate: "15 Jun",
    endDate: "19 Jun",
    days: 5,
  },
  {
    id: "out-2",
    employeeId: "emp-007",
    employeeName: "Tasnim Chowdhury",
    employeeNumber: "EMP-0007",
    department: "Finance",
    leaveType: "Sick leave",
    startDate: "17 Jun",
    endDate: "17 Jun",
    days: 1,
  },
  {
    id: "out-3",
    employeeId: "emp-011",
    employeeName: "Hasan Mahmud",
    employeeNumber: "EMP-0011",
    department: "Operations",
    leaveType: "Casual leave",
    startDate: "17 Jun",
    endDate: "17 Jun",
    days: 1,
  },
  {
    id: "out-4",
    employeeId: "emp-018",
    employeeName: "Rina Begum",
    employeeNumber: "EMP-0018",
    department: "Human Resources",
    leaveType: "Annual leave",
    startDate: "16 Jun",
    endDate: "20 Jun",
    days: 5,
  },
  {
    id: "out-5",
    employeeId: "emp-022",
    employeeName: "Kamal Hossain",
    employeeNumber: "EMP-0022",
    department: "Logistics",
    leaveType: "Annual leave",
    startDate: "14 Jun",
    endDate: "18 Jun",
    days: 5,
  },
];

export const LEAVE_AI_INSIGHTS: LeaveAiInsight[] = [
  {
    id: "ai-lv-1",
    title: "Leave abuse risk — Operations",
    summary:
      "3 employees in Operations submitted sick leave on Mondays 4 times in 8 weeks. Pattern flagged for HR review — advisory only.",
    severity: "warning",
    category: "Abuse risks",
  },
  {
    id: "ai-lv-2",
    title: "Workforce availability — Sales",
    summary:
      "Sales team coverage drops below 70% on 20 Jun (Fri). 6 annual leave requests overlap — consider staggered approval.",
    severity: "critical",
    category: "Availability",
  },
  {
    id: "ai-lv-3",
    title: "Department leave conflict — Technology",
    summary:
      "Backend squad has 4 of 8 members on leave 25–27 Jun. Project milestone risk detected for sprint close.",
    severity: "warning",
    category: "Conflicts",
  },
  {
    id: "ai-lv-4",
    title: "Leave trend — within seasonal norm",
    summary:
      "June approved leave volume is 8% above 3-year average but within policy capacity. No encashment spike expected.",
    severity: "info",
    category: "Trends",
  },
];

export const LEAVE_BRANCHES = [
  { id: "all", label: "All branches" },
  { id: "dhk", label: "Dhaka HQ" },
  { id: "ctg", label: "Chittagong" },
  { id: "syl", label: "Sylhet" },
] as const;

export const LEAVE_DEPARTMENTS = [
  { id: "all", label: "All departments" },
  { id: "ops", label: "Operations" },
  { id: "sales", label: "Sales & Marketing" },
  { id: "tech", label: "Technology" },
  { id: "finance", label: "Finance" },
  { id: "hr", label: "Human Resources" },
  { id: "logistics", label: "Logistics" },
] as const;

export const LEAVE_TYPES = [
  { id: "all", label: "All leave types" },
  { id: "annual", label: "Annual leave" },
  { id: "sick", label: "Sick leave" },
  { id: "casual", label: "Casual leave" },
  { id: "unpaid", label: "Unpaid leave" },
] as const;

export const LEAVE_DATE_RANGES = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "mtd", label: "Month to date" },
  { id: "qtd", label: "Quarter to date" },
] as const;
