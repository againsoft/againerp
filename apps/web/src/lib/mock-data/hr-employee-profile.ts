/**
 * Employee 360° profile mock data — SCR-HR-EMP-004+
 * @see docs/modules/hr-payroll/uiux/EMPLOYEE_PROFILE_UI_ARCHITECTURE.md
 */

import type { Employee } from "@/lib/mock-data/hr-employees";

export type EmployeeProfileTab =
  | "overview"
  | "employment"
  | "attendance"
  | "leave"
  | "payroll"
  | "assets"
  | "performance"
  | "training"
  | "documents"
  | "timeline";

export const EMPLOYEE_PROFILE_TABS: { id: EmployeeProfileTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "employment", label: "Employment" },
  { id: "attendance", label: "Attendance" },
  { id: "leave", label: "Leave" },
  { id: "payroll", label: "Payroll" },
  { id: "assets", label: "Assets" },
  { id: "performance", label: "Performance" },
  { id: "training", label: "Training" },
  { id: "documents", label: "Documents" },
  { id: "timeline", label: "Timeline" },
];

export function isEmployeeProfileTab(value: string | null): value is EmployeeProfileTab {
  return EMPLOYEE_PROFILE_TABS.some((t) => t.id === value);
}

export type EmployeeProfileStats = {
  yearsOfService: string;
  attendanceRate: string;
  leaveBalanceDays: number;
  performanceScore: string;
  trainingCompletion: string;
  assetsAssigned: number;
};

export type EmployeeLeaveBalance = {
  type: string;
  used: number;
  total: number;
  unit: string;
};

export type EmployeeAssignedAsset = {
  id: string;
  name: string;
  category: string;
  assignedDate: string;
  status: "active" | "returned" | "damaged";
};

export type EmployeeUpcomingEvent = {
  id: string;
  title: string;
  date: string;
  type: "leave" | "review" | "training" | "birthday" | "document";
};

export type EmployeeAiInsight = {
  id: string;
  title: string;
  summary: string;
  severity: "info" | "warning" | "critical";
};

export type EmployeeTimelineEvent = {
  id: string;
  category: "employee" | "attendance" | "leave" | "payroll" | "training" | "approval" | "document";
  title: string;
  description: string;
  actor: string;
  timestamp: string;
  relativeTime: string;
};

export type EmployeeProfile = {
  employeeId: string;
  stats: EmployeeProfileStats;
  managerId?: string;
  confirmationDate?: string;
  workLocation: string;
  costCenter: string;
  skills: string[];
  reportingLine: string[];
  directReports: { id: string; name: string; designation: string }[];
  leaveBalances: EmployeeLeaveBalance[];
  assignedAssets: EmployeeAssignedAsset[];
  upcomingEvents: EmployeeUpcomingEvent[];
  aiInsights: EmployeeAiInsight[];
  timeline: EmployeeTimelineEvent[];
  attendanceSummary: { present: number; absent: number; late: number; wfh: number };
  leaveRequests: { id: string; type: string; from: string; to: string; days: number; status: string }[];
  payslips: { id: string; period: string; netPay: string; status: string }[];
  performanceGoals: { id: string; title: string; progress: number; due: string }[];
  trainingRecords: { id: string; program: string; status: string; completedDate?: string }[];
  documents: { id: string; title: string; type: string; expiry?: string }[];
  transferHistory: { date: string; from: string; to: string; reason: string }[];
};

function yearsSince(joiningDate: string): string {
  const joined = new Date(joiningDate);
  const now = new Date("2026-06-17");
  const years = (now.getTime() - joined.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  return `${years.toFixed(1)} yrs`;
}

function hashSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 1)) % 97;
  return h;
}

export function getEmployeeProfile(employee: Employee): EmployeeProfile {
  const seed = hashSeed(employee.id);
  const attendanceRate = 88 + (seed % 12);
  const leaveBal = 8 + (seed % 14);
  const perf = (3.2 + (seed % 18) / 10).toFixed(1);
  const trainingPct = 60 + (seed % 40);

  return {
    employeeId: employee.id,
    stats: {
      yearsOfService: yearsSince(employee.joiningDate),
      attendanceRate: `${attendanceRate}%`,
      leaveBalanceDays: leaveBal,
      performanceScore: `${perf} / 5`,
      trainingCompletion: `${trainingPct}%`,
      assetsAssigned: employee.id === "emp-003" ? 4 : 1 + (seed % 3),
    },
    managerId: employee.managerId,
    confirmationDate:
      employee.status === "probation" ? undefined : "2020-01-15",
    workLocation: employee.branch,
    costCenter: `CC-${100 + (seed % 50)}`,
    skills: ["Excel", "Team leadership", "Inventory ops", "Bengali · English"].slice(0, 2 + (seed % 3)),
    reportingLine: ["Board", employee.managerName ?? "—", employee.name].filter(Boolean),
    directReports:
      employee.designation.includes("Manager") || employee.designation.includes("Head")
        ? [
            { id: "emp-011", name: "Priya Das", designation: "HR Officer" },
            { id: "emp-017", name: "Anika Chowdhury", designation: "Associate" },
          ].slice(0, seed % 3)
        : [],
    leaveBalances: [
      { type: "Annual leave", used: 8, total: 20, unit: "days" },
      { type: "Sick leave", used: 3, total: 14, unit: "days" },
      { type: "Casual leave", used: 2, total: 10, unit: "days" },
    ],
    assignedAssets: [
      {
        id: "ast-1",
        name: "MacBook Pro 14\"",
        category: "Laptop",
        assignedDate: "2024-03-01",
        status: "active",
      },
      {
        id: "ast-2",
        name: "ID Card + Access Fob",
        category: "Access",
        assignedDate: employee.joiningDate,
        status: "active",
      },
      ...(seed % 2 === 0
        ? [
            {
              id: "ast-3",
              name: "Company mobile — Samsung A54",
              category: "Phone",
              assignedDate: "2025-01-10",
              status: "active" as const,
            },
          ]
        : []),
    ],
    upcomingEvents: [
      {
        id: "ev-1",
        title: "Q2 performance review",
        date: "2026-06-24",
        type: "review",
      },
      {
        id: "ev-2",
        title: "Safety induction refresher",
        date: "2026-07-02",
        type: "training",
      },
      {
        id: "ev-3",
        title: "Passport renewal due",
        date: "2026-08-15",
        type: "document",
      },
    ],
    aiInsights: [
      {
        id: "ai-1",
        title: "Attendance pattern stable",
        summary: `${employee.name.split(" ")[0]}'s late arrivals are within team average for the past 30 days.`,
        severity: "info",
      },
      {
        id: "ai-2",
        title: "Leave planning suggestion",
        summary: "Unused annual leave exceeds policy threshold — consider encashment or scheduled leave before year-end.",
        severity: "warning",
      },
    ],
    timeline: [
      {
        id: "tl-1",
        category: "employee",
        title: "Profile viewed",
        description: "HR admin opened employee 360° profile",
        actor: "Admin User",
        timestamp: "2026-06-17T09:12:00",
        relativeTime: "2h ago",
      },
      {
        id: "tl-2",
        category: "leave",
        title: "Leave request approved",
        description: "Annual leave · 3 days · 24–26 Jun 2026",
        actor: employee.managerName ?? "Manager",
        timestamp: "2026-06-16T14:30:00",
        relativeTime: "Yesterday",
      },
      {
        id: "tl-3",
        category: "attendance",
        title: "Late arrival recorded",
        description: "Check-in 09:22 · Grace period exceeded by 7 min",
        actor: "Attendance device",
        timestamp: "2026-06-16T09:22:00",
        relativeTime: "Yesterday",
      },
      {
        id: "tl-4",
        category: "payroll",
        title: "Payslip published",
        description: "May 2026 payslip available in ESS",
        actor: "Payroll system",
        timestamp: "2026-06-01T10:00:00",
        relativeTime: "16 Jun",
      },
      {
        id: "tl-5",
        category: "training",
        title: "Training completed",
        description: "Workplace safety induction · Score 92%",
        actor: "L&D system",
        timestamp: "2026-05-20T16:45:00",
        relativeTime: "28 May",
      },
      {
        id: "tl-6",
        category: "approval",
        title: "Overtime approved",
        description: "4.5 hours · Project rollout weekend",
        actor: employee.managerName ?? "Manager",
        timestamp: "2026-05-18T11:20:00",
        relativeTime: "30 May",
      },
    ],
    attendanceSummary: {
      present: 18 + (seed % 4),
      absent: seed % 2,
      late: 2 + (seed % 3),
      wfh: 3 + (seed % 2),
    },
    leaveRequests: [
      {
        id: "lr-1",
        type: "Annual",
        from: "2026-06-24",
        to: "2026-06-26",
        days: 3,
        status: "approved",
      },
      {
        id: "lr-2",
        type: "Sick",
        from: "2026-03-10",
        to: "2026-03-11",
        days: 2,
        status: "approved",
      },
    ],
    payslips: [
      { id: "ps-1", period: "May 2026", netPay: "BDT 84,500", status: "paid" },
      { id: "ps-2", period: "Apr 2026", netPay: "BDT 84,500", status: "paid" },
      { id: "ps-3", period: "Mar 2026", netPay: "BDT 83,200", status: "paid" },
    ],
    performanceGoals: [
      { id: "g-1", title: "Reduce ops SLA breaches by 15%", progress: 72, due: "2026-09-30" },
      { id: "g-2", title: "Complete leadership certification", progress: 45, due: "2026-12-15" },
    ],
    trainingRecords: [
      { id: "tr-1", program: "Safety induction", status: "completed", completedDate: "2026-05-20" },
      { id: "tr-2", program: "Excel advanced", status: "in_progress" },
    ],
    documents: [
      { id: "doc-1", title: "Employment contract", type: "Contract", expiry: "2027-01-15" },
      { id: "doc-2", title: "National ID copy", type: "Identity" },
      { id: "doc-3", title: "NOC — bank account", type: "Letter", expiry: "2026-12-31" },
    ],
    transferHistory:
      employee.departmentId === "ops"
        ? []
        : [
            {
              date: "2022-04-01",
              from: "Operations · Dhaka HQ",
              to: `${employee.department} · ${employee.branch}`,
              reason: "Internal transfer",
            },
          ],
  };
}
