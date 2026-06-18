/**
 * Attendance Dashboard mock data — SCR-HR-ATT-001 · DSH-ATT-001
 * @see docs/modules/hr-payroll/uiux/ATTENDANCE_UI_ARCHITECTURE.md
 */

export type AttendanceDashboardKpi = {
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

export type AttendanceException = {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  department: string;
  detail: string;
  time?: string;
  type: "late" | "absent" | "missing_punch" | "pending_correction";
};

export type AttendanceDevice = {
  id: string;
  name: string;
  branch: string;
  location: string;
  status: "online" | "offline" | "sync_error";
  lastSync: string;
  punchesToday: number;
};

export type AttendanceAiInsight = {
  id: string;
  title: string;
  summary: string;
  severity: "info" | "warning" | "critical";
  category: string;
};

export const ATTENDANCE_DASHBOARD_AS_OF = "17 Jun 2026, 09:15 AM";
export const ATTENDANCE_EXPECTED_WORKFORCE = 1248;

export const ATTENDANCE_DASHBOARD_KPIS: AttendanceDashboardKpi[] = [
  {
    id: "WGT-ATT-KPI-001",
    label: "Present",
    value: "1,086",
    count: 1086,
    trend: "87.0%",
    trendDirection: "neutral",
    status: "good",
    hint: "Of expected workforce",
    href: "/hr/attendance/daily?status=present",
  },
  {
    id: "WGT-ATT-KPI-002",
    label: "Absent",
    value: "42",
    count: 42,
    trend: "+6",
    trendDirection: "up",
    status: "warning",
    hint: "Unplanned today",
    href: "/hr/attendance/daily?status=absent",
  },
  {
    id: "WGT-ATT-KPI-003",
    label: "Late",
    value: "67",
    count: 67,
    trend: "−12%",
    trendDirection: "down",
    status: "good",
    hint: "After grace period",
    href: "/hr/attendance/daily?status=late",
  },
  {
    id: "WGT-ATT-KPI-008",
    label: "Work From Home",
    value: "38",
    count: 38,
    trend: "+4",
    trendDirection: "up",
    status: "neutral",
    hint: "Approved WFH",
    href: "/hr/attendance/daily?status=wfh",
  },
  {
    id: "WGT-ATT-KPI-009",
    label: "Outdoor Duty",
    value: "15",
    count: 15,
    trend: "Stable",
    trendDirection: "neutral",
    status: "neutral",
    hint: "Field assignments",
    href: "/hr/attendance/daily?status=outdoor",
  },
];

export const ATTENDANCE_DAILY_TREND = [
  { date: "11 Jun", present: 1078, absent: 38, late: 71 },
  { date: "12 Jun", present: 1082, absent: 36, late: 68 },
  { date: "13 Jun", present: 1075, absent: 44, late: 74 },
  { date: "14 Jun", present: 0, absent: 0, late: 0, holiday: true },
  { date: "15 Jun", present: 0, absent: 0, late: 0, weekend: true },
  { date: "16 Jun", present: 1080, absent: 39, late: 65 },
  { date: "17 Jun", present: 1086, absent: 42, late: 67 },
];

export const ATTENDANCE_MONTHLY_TREND = [
  { month: "Jan", present: 21400, absent: 820, late: 1420 },
  { month: "Feb", present: 20100, absent: 760, late: 1380 },
  { month: "Mar", present: 22300, absent: 890, late: 1510 },
  { month: "Apr", present: 21800, absent: 810, late: 1290 },
  { month: "May", present: 22100, absent: 780, late: 1340 },
  { month: "Jun", present: 11200, absent: 410, late: 680 },
];

export const ATTENDANCE_DEPARTMENT_TREND = [
  { department: "Operations", present: 358, absent: 14, late: 22, rate: 92 },
  { department: "Sales & Marketing", present: 248, absent: 8, late: 15, rate: 94 },
  { department: "Technology", present: 172, absent: 6, late: 11, rate: 93 },
  { department: "Finance", present: 108, absent: 4, late: 6, rate: 95 },
  { department: "Human Resources", present: 76, absent: 2, late: 4, rate: 96 },
  { department: "Logistics", present: 124, absent: 8, late: 9, rate: 89 },
];

export const ATTENDANCE_EXCEPTIONS: AttendanceException[] = [
  {
    id: "exc-1",
    type: "late",
    employeeId: "emp-003",
    employeeName: "Karim Hassan",
    employeeNumber: "EMP-0003",
    department: "Technology",
    detail: "Check-in 09:28 · 28 min late",
    time: "09:28",
  },
  {
    id: "exc-2",
    type: "late",
    employeeId: "emp-016",
    employeeName: "Jamal Uddin",
    employeeNumber: "EMP-0016",
    department: "Operations",
    detail: "Check-in 09:19 · 19 min late",
    time: "09:19",
  },
  {
    id: "exc-3",
    type: "absent",
    employeeId: "emp-022",
    employeeName: "Kamal Hossain",
    employeeNumber: "EMP-0022",
    department: "Operations",
    detail: "No check-in · unplanned absence",
  },
  {
    id: "exc-4",
    type: "missing_punch",
    employeeId: "emp-005",
    employeeName: "Sadia Islam",
    employeeNumber: "EMP-0005",
    department: "Operations",
    detail: "Missing check-out · shift ended 18:00",
    time: "—",
  },
  {
    id: "exc-5",
    type: "missing_punch",
    employeeId: "emp-014",
    employeeName: "Shahid Alam",
    employeeNumber: "EMP-0014",
    department: "Technology",
    detail: "Missing check-in · manual entry required",
    time: "—",
  },
  {
    id: "exc-6",
    type: "missing_punch",
    employeeId: "emp-020",
    employeeName: "Rubel Mia",
    employeeNumber: "EMP-0020",
    department: "Logistics",
    detail: "Single punch only · BIO-CTG-01",
    time: "08:55",
  },
  {
    id: "exc-7",
    type: "pending_correction",
    employeeId: "emp-002",
    employeeName: "Fatima Rahman",
    employeeNumber: "EMP-0002",
    department: "Human Resources",
    detail: "Correction pending approval · missed punch-out",
  },
  {
    id: "exc-8",
    type: "pending_correction",
    employeeId: "emp-009",
    employeeName: "Mariam Akter",
    employeeNumber: "EMP-0009",
    department: "Sales & Marketing",
    detail: "Correction pending · outdoor duty overlap",
  },
];

export const ATTENDANCE_DEVICES: AttendanceDevice[] = [
  {
    id: "dev-1",
    name: "BIO-DHK-HQ-01",
    branch: "Dhaka HQ",
    location: "Main gate",
    status: "online",
    lastSync: "2 min ago",
    punchesToday: 842,
  },
  {
    id: "dev-2",
    name: "BIO-DHK-HQ-02",
    branch: "Dhaka HQ",
    location: "Floor 3",
    status: "online",
    lastSync: "5 min ago",
    punchesToday: 312,
  },
  {
    id: "dev-3",
    name: "BIO-CTG-01",
    branch: "Chittagong",
    location: "Warehouse entry",
    status: "sync_error",
    lastSync: "45 min ago",
    punchesToday: 186,
  },
  {
    id: "dev-4",
    name: "BIO-SYL-01",
    branch: "Sylhet",
    location: "Reception",
    status: "offline",
    lastSync: "3h ago",
    punchesToday: 0,
  },
  {
    id: "dev-5",
    name: "BIO-DHK-HQ-03",
    branch: "Dhaka HQ",
    location: "Cafeteria",
    status: "online",
    lastSync: "1 min ago",
    punchesToday: 428,
  },
];

export const ATTENDANCE_AI_INSIGHTS: AttendanceAiInsight[] = [
  {
    id: "ai-att-1",
    title: "Late arrival cluster — Operations",
    summary:
      "Operations floor shows 18% more late arrivals vs 30-day average between 08:45–09:15. Consider shift reminder notifications.",
    severity: "warning",
    category: "Late patterns",
  },
  {
    id: "ai-att-2",
    title: "Absence risk — Logistics",
    summary:
      "3 employees in Logistics have repeated unplanned absences this month. Review attendance policy exceptions.",
    severity: "critical",
    category: "Absence risks",
  },
  {
    id: "ai-att-3",
    title: "Device sync degradation — Sylhet",
    summary:
      "BIO-SYL-01 offline for 3 hours may cause missing punches. Last successful sync at 06:12 AM.",
    severity: "warning",
    category: "Compliance",
  },
  {
    id: "ai-att-4",
    title: "WFH utilization within policy",
    summary:
      "Work-from-home count (38) is within approved capacity for Dhaka HQ. No policy breach detected.",
    severity: "info",
    category: "Attendance health",
  },
];

export const ATTENDANCE_BRANCHES = [
  { id: "all", label: "All branches" },
  { id: "dhk", label: "Dhaka HQ" },
  { id: "ctg", label: "Chittagong" },
  { id: "syl", label: "Sylhet" },
] as const;

export const ATTENDANCE_DEPARTMENTS = [
  { id: "all", label: "All departments" },
  { id: "ops", label: "Operations" },
  { id: "sales", label: "Sales & Marketing" },
  { id: "tech", label: "Technology" },
  { id: "finance", label: "Finance" },
  { id: "hr", label: "Human Resources" },
  { id: "logistics", label: "Logistics" },
] as const;
