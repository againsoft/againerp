"use client";

import { useState } from "react";
import {
  Users, Clock, Calendar, DollarSign, Plus, Search,
  CheckCircle2, XCircle, AlertCircle, ChevronDown,
  ArrowUpRight, Building2, Phone, Mail, UserCheck,
  TrendingUp, Briefcase, Filter, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  mockEmployees, mockAttendanceToday, mockLeaveRequests, mockPayroll,
  type Employee, type EmployeeStatus, type LeaveStatus, type Department,
} from "@/lib/mock-data/hrm";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "dashboard" | "employees" | "attendance" | "leave" | "payroll";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return `৳${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `৳${(n / 1_000).toFixed(0)}K`;
  return `৳${n.toLocaleString()}`;
}

const STATUS_COLORS: Record<EmployeeStatus, string> = {
  active:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  on_leave:   "bg-amber-50 text-amber-700 border-amber-200",
  probation:  "bg-blue-50 text-blue-700 border-blue-200",
  resigned:   "bg-red-50 text-red-700 border-red-200",
};
const STATUS_LABELS: Record<EmployeeStatus, string> = {
  active: "Active", on_leave: "On Leave", probation: "Probation", resigned: "Resigned",
};

const ATT_COLORS: Record<string, string> = {
  present:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  absent:   "bg-red-50 text-red-700 border-red-200",
  late:     "bg-amber-50 text-amber-700 border-amber-200",
  half_day: "bg-blue-50 text-blue-700 border-blue-200",
  on_leave: "bg-purple-50 text-purple-700 border-purple-200",
};
const ATT_LABELS: Record<string, string> = {
  present: "Present", absent: "Absent", late: "Late", half_day: "Half Day", on_leave: "On Leave",
};

const LEAVE_COLORS: Record<LeaveStatus, string> = {
  pending:  "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const DEPT_COLORS: Record<Department, string> = {
  Engineering:        "#3b82f6",
  Sales:              "#10b981",
  Marketing:          "#8b5cf6",
  Finance:            "#f59e0b",
  Operations:         "#ef4444",
  HR:                 "#ec4899",
  "Customer Support": "#06b6d4",
  Warehouse:          "#84cc16",
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "h-7 w-7 text-[10px]" : size === "lg" ? "h-12 w-12 text-base" : "h-9 w-9 text-[12px]";
  return (
    <div className={`${sz} rounded-full bg-primary/15 text-primary font-semibold flex items-center justify-center shrink-0`}>
      {initials}
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, icon: Icon, trend, up }: {
  label: string; value: string; sub?: string; icon: React.ElementType; trend?: string; up?: boolean;
}) {
  return (
    <div className="rounded-xl border border-input bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      {trend && (
        <p className={`mt-1 flex items-center gap-0.5 text-[11px] font-medium ${up ? "text-emerald-600" : "text-amber-600"}`}>
          <ArrowUpRight className="h-3 w-3" />{trend}
        </p>
      )}
      {sub && <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ─── HRM Nav ─────────────────────────────────────────────────────────────────

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "dashboard",  label: "Dashboard",  icon: TrendingUp  },
  { key: "employees",  label: "Employees",  icon: Users       },
  { key: "attendance", label: "Attendance", icon: Clock       },
  { key: "leave",      label: "Leave",      icon: Calendar    },
  { key: "payroll",    label: "Payroll",    icon: DollarSign  },
];

// ─── Dashboard tab ────────────────────────────────────────────────────────────

function DashboardTab() {
  const active    = mockEmployees.filter((e) => e.status === "active").length;
  const onLeave   = mockEmployees.filter((e) => e.status === "on_leave").length;
  const probation = mockEmployees.filter((e) => e.status === "probation").length;

  const presentToday = mockAttendanceToday.filter((a) => a.status === "present").length;
  const absentToday  = mockAttendanceToday.filter((a) => a.status === "absent").length;
  const lateToday    = mockAttendanceToday.filter((a) => a.status === "late").length;

  const pendingLeaves = mockLeaveRequests.filter((l) => l.status === "pending").length;

  const totalPayroll = mockPayroll.reduce((s, p) => s + p.netPay, 0);

  // department headcount
  const deptCounts = mockEmployees.reduce<Record<string, number>>((acc, e) => {
    acc[e.department] = (acc[e.department] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Employees" value={String(mockEmployees.length)} icon={Users}       sub={`${active} active · ${onLeave} on leave · ${probation} probation`} />
        <KpiCard label="Present Today"   value={String(presentToday)}         icon={UserCheck}   trend={`${lateToday} late, ${absentToday} absent`} up={absentToday < 3} />
        <KpiCard label="Pending Leaves"  value={String(pendingLeaves)}        icon={Calendar}    sub="Awaiting approval" />
        <KpiCard label="Jun Payroll"     value={fmt(totalPayroll)}            icon={DollarSign}  sub="Gross including bonus" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Department breakdown */}
        <div className="rounded-xl border border-input bg-card p-4 shadow-sm">
          <p className="text-sm font-semibold mb-3">Headcount by Department</p>
          <div className="space-y-2.5">
            {Object.entries(deptCounts).sort((a, b) => b[1] - a[1]).map(([dept, count]) => (
              <div key={dept}>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="font-medium">{dept}</span>
                  <span className="text-muted-foreground">{count} employees</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(count / mockEmployees.length) * 100}%`, background: DEPT_COLORS[dept as Department] ?? "#6366f1" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's attendance snapshot */}
        <div className="rounded-xl border border-input bg-card p-4 shadow-sm">
          <p className="text-sm font-semibold mb-3">Today's Attendance</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: "Present",  count: presentToday, color: "text-emerald-600 bg-emerald-50" },
              { label: "Absent",   count: absentToday,  color: "text-red-500 bg-red-50"         },
              { label: "Late",     count: lateToday,    color: "text-amber-600 bg-amber-50"     },
            ].map((s) => (
              <div key={s.label} className={`rounded-lg p-3 text-center ${s.color}`}>
                <p className="text-xl font-bold">{s.count}</p>
                <p className="text-[11px] font-medium">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {mockAttendanceToday.slice(0, 5).map((att) => {
              const emp = mockEmployees.find((e) => e.id === att.employeeId);
              if (!emp) return null;
              return (
                <div key={att.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar initials={emp.avatar} size="sm" />
                    <div>
                      <p className="text-[12px] font-medium">{emp.name}</p>
                      <p className="text-[10px] text-muted-foreground">{emp.designation}</p>
                    </div>
                  </div>
                  <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${ATT_COLORS[att.status]}`}>
                    {ATT_LABELS[att.status]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent leave requests */}
      <div className="rounded-xl border border-input bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold">Recent Leave Requests</p>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">{pendingLeaves} pending</span>
        </div>
        <div className="space-y-2">
          {mockLeaveRequests.slice(0, 5).map((req) => (
            <div key={req.id} className="flex items-center justify-between rounded-lg border border-input bg-muted/20 px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <Avatar initials={req.employeeName.split(" ").map((n) => n[0]).join("")} size="sm" />
                <div className="min-w-0">
                  <p className="text-[12px] font-medium truncate">{req.employeeName}</p>
                  <p className="text-[10px] text-muted-foreground">{req.type} · {req.days}d · {req.from}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${LEAVE_COLORS[req.status]}`}>
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
                {req.status === "pending" && (
                  <div className="flex gap-1">
                    <button className="rounded p-0.5 hover:bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></button>
                    <button className="rounded p-0.5 hover:bg-red-50 text-red-500"><XCircle className="h-4 w-4" /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Employees tab ────────────────────────────────────────────────────────────

function EmployeesTab() {
  const [search, setSearch] = useState("");
  const [dept,   setDept]   = useState("All");
  const [status, setStatus] = useState("All");

  const depts   = ["All", ...Array.from(new Set(mockEmployees.map((e) => e.department)))];
  const statuses = ["All", "Active", "On Leave", "Probation", "Resigned"];

  const filtered = mockEmployees.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase());
    const matchDept   = dept === "All" || e.department === dept;
    const matchStatus = status === "All" || STATUS_LABELS[e.status] === status;
    return matchSearch && matchDept && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-8 pl-8 pr-3 rounded-md border border-input bg-background text-sm w-52 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none" value={dept} onChange={(e) => setDept(e.target.value)}>
            {depts.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none" value={status} onChange={(e) => setStatus(e.target.value)}>
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <Button size="sm" className="h-8 gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add Employee
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-input overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-input bg-muted/40">
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground">Employee</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground hidden md:table-cell">Department</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground hidden lg:table-cell">Branch</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground hidden lg:table-cell">Join Date</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground hidden xl:table-cell">Salary</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-2.5 text-right text-[11px] font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-input">
            {filtered.map((emp) => (
              <tr key={emp.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={emp.avatar} size="sm" />
                    <div>
                      <p className="font-medium text-[13px]">{emp.name}</p>
                      <p className="text-[11px] text-muted-foreground">{emp.designation}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-sm" style={{ background: DEPT_COLORS[emp.department] }} />
                    <span className="text-[12px]">{emp.department}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground hidden lg:table-cell">
                  <div className="flex items-center gap-1"><Building2 className="h-3 w-3" />{emp.branch}</div>
                </td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground hidden lg:table-cell">{emp.joinDate}</td>
                <td className="px-4 py-3 text-[12px] font-medium hidden xl:table-cell">{fmt(emp.salary)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${STATUS_COLORS[emp.status]}`}>
                    {STATUS_LABELS[emp.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="rounded-md border border-input px-2 py-1 text-[11px] hover:bg-muted transition-colors">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-muted-foreground">{filtered.length} employees</p>
    </div>
  );
}

// ─── Attendance tab ───────────────────────────────────────────────────────────

function AttendanceTab() {
  const present  = mockAttendanceToday.filter((a) => a.status === "present").length;
  const absent   = mockAttendanceToday.filter((a) => a.status === "absent").length;
  const late     = mockAttendanceToday.filter((a) => a.status === "late").length;
  const halfDay  = mockAttendanceToday.filter((a) => a.status === "half_day").length;
  const onLeave  = mockAttendanceToday.filter((a) => a.status === "on_leave").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Today — Sun, 21 Jun 2026</p>
          <p className="text-[12px] text-muted-foreground">Real-time attendance overview</p>
        </div>
        <Button size="sm" variant="outline" className="h-8 gap-1.5">
          <Download className="h-3.5 w-3.5" /> Export
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { label: "Present",  count: present, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
          { label: "Absent",   count: absent,  color: "text-red-500 bg-red-50 border-red-200"             },
          { label: "Late",     count: late,    color: "text-amber-600 bg-amber-50 border-amber-200"       },
          { label: "Half Day", count: halfDay, color: "text-blue-600 bg-blue-50 border-blue-200"          },
          { label: "On Leave", count: onLeave, color: "text-purple-600 bg-purple-50 border-purple-200"    },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-[11px] font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Attendance table */}
      <div className="rounded-lg border border-input overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-input bg-muted/40">
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground">Employee</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground hidden md:table-cell">Department</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground">Check In</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground hidden lg:table-cell">Check Out</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground hidden lg:table-cell">Hours</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-input">
            {mockAttendanceToday.map((att) => {
              const emp = mockEmployees.find((e) => e.id === att.employeeId);
              if (!emp) return null;
              return (
                <tr key={att.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar initials={emp.avatar} size="sm" />
                      <div>
                        <p className="font-medium text-[13px]">{emp.name}</p>
                        <p className="text-[11px] text-muted-foreground">{emp.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground hidden md:table-cell">{emp.department}</td>
                  <td className="px-4 py-3 text-[12px] font-mono">{att.checkIn || "—"}</td>
                  <td className="px-4 py-3 text-[12px] font-mono hidden lg:table-cell">{att.checkOut || "—"}</td>
                  <td className="px-4 py-3 text-[12px] hidden lg:table-cell">
                    {att.hoursWorked > 0 ? `${att.hoursWorked}h` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${ATT_COLORS[att.status]}`}>
                      {ATT_LABELS[att.status]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Leave tab ────────────────────────────────────────────────────────────────

function LeaveTab() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [requests, setRequests] = useState(mockLeaveRequests);

  const filtered = requests.filter((r) => filter === "all" || r.status === filter);
  const pending  = requests.filter((r) => r.status === "pending").length;

  function approve(id: string) {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "approved" as LeaveStatus } : r));
  }
  function reject(id: string) {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "rejected" as LeaveStatus } : r));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition-colors ${
                filter === f ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f} {f === "pending" && pending > 0 && <span className="ml-1 rounded-full bg-amber-100 text-amber-800 px-1 text-[9px] font-bold">{pending}</span>}
            </button>
          ))}
        </div>
        <Button size="sm" className="h-8 gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Apply Leave
        </Button>
      </div>

      <div className="space-y-2">
        {filtered.map((req) => (
          <div key={req.id} className="rounded-xl border border-input bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar initials={req.employeeName.split(" ").map((n) => n[0]).join("")} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-[13px]">{req.employeeName}</p>
                    <span className="text-[11px] text-muted-foreground">{req.department}</span>
                  </div>
                  <p className="text-[12px] text-muted-foreground mt-0.5">
                    <span className="capitalize font-medium text-foreground">{req.type} leave</span>
                    {" · "}{req.from} → {req.to}{" · "}<span className="font-medium">{req.days} day{req.days > 1 ? "s" : ""}</span>
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-0.5 italic">"{req.reason}"</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${LEAVE_COLORS[req.status]}`}>
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
                {req.status === "pending" && (
                  <div className="flex gap-1">
                    <button onClick={() => approve(req.id)} className="flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-1 text-[11px] text-emerald-700 font-medium hover:bg-emerald-100">
                      <CheckCircle2 className="h-3 w-3" /> Approve
                    </button>
                    <button onClick={() => reject(req.id)} className="flex items-center gap-1 rounded-md bg-red-50 border border-red-200 px-2 py-1 text-[11px] text-red-600 font-medium hover:bg-red-100">
                      <XCircle className="h-3 w-3" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-input">Applied: {req.appliedOn}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">No leave requests found.</div>
        )}
      </div>
    </div>
  );
}

// ─── Payroll tab ──────────────────────────────────────────────────────────────

function PayrollTab() {
  const totalGross  = mockPayroll.reduce((s, p) => s + p.basicSalary + p.bonus, 0);
  const totalNet    = mockPayroll.reduce((s, p) => s + p.netPay, 0);
  const totalBonus  = mockPayroll.reduce((s, p) => s + p.bonus, 0);
  const totalTax    = mockPayroll.reduce((s, p) => s + p.tax, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Gross Payroll",    value: fmt(totalGross), sub: "Basic + Bonus" },
          { label: "Net Payroll",      value: fmt(totalNet),   sub: "After deductions & tax" },
          { label: "Total Bonus",      value: fmt(totalBonus), sub: "Jun 2026 performance" },
          { label: "Total Tax (Est.)", value: fmt(totalTax),   sub: "Income tax" },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-input bg-card p-4 shadow-sm">
            <p className="text-[11px] font-medium text-muted-foreground">{c.label}</p>
            <p className="mt-1 text-xl font-bold">{c.value}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Payroll — Jun 2026</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
          <Button size="sm" className="h-8">Process All</Button>
        </div>
      </div>

      <div className="rounded-lg border border-input overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-input bg-muted/40">
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground">Employee</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground hidden md:table-cell">Department</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground">Basic</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground hidden lg:table-cell">Bonus</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground hidden lg:table-cell">Deduct.</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground hidden lg:table-cell">Tax</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground font-semibold">Net Pay</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-input">
            {mockPayroll.map((pay) => (
              <tr key={pay.id} className="hover:bg-muted/20">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar initials={pay.employeeName.split(" ").map((n) => n[0]).join("")} size="sm" />
                    <span className="font-medium text-[13px]">{pay.employeeName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground hidden md:table-cell">{pay.department}</td>
                <td className="px-4 py-3 text-[12px]">{fmt(pay.basicSalary)}</td>
                <td className="px-4 py-3 text-[12px] text-emerald-600 hidden lg:table-cell">+{fmt(pay.bonus)}</td>
                <td className="px-4 py-3 text-[12px] text-red-500 hidden lg:table-cell">-{fmt(pay.deductions)}</td>
                <td className="px-4 py-3 text-[12px] text-red-500 hidden lg:table-cell">-{fmt(pay.tax)}</td>
                <td className="px-4 py-3 text-[13px] font-semibold">{fmt(pay.netPay)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${
                    pay.status === "paid"      ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    pay.status === "processed" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                 "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {pay.status.charAt(0).toUpperCase() + pay.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main HRM Hub ─────────────────────────────────────────────────────────────

export function HRMHub() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="space-y-5 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">AgainERP</p>
          <h1 className="text-2xl font-semibold tracking-tight">Human Resources</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Employees, attendance, leave & payroll management</p>
        </div>
        <Button size="sm" className="h-8 gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add Employee
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-input">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium border-b-2 transition-colors -mb-px ${
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "dashboard"  && <DashboardTab />}
      {tab === "employees"  && <EmployeesTab />}
      {tab === "attendance" && <AttendanceTab />}
      {tab === "leave"      && <LeaveTab />}
      {tab === "payroll"    && <PayrollTab />}
    </div>
  );
}
