"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Minus,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardWidget } from "@/components/hr/dashboard/dashboard-widget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ATTENDANCE_AI_INSIGHTS,
  ATTENDANCE_DAILY_TREND,
  ATTENDANCE_DASHBOARD_AS_OF,
  ATTENDANCE_DASHBOARD_KPIS,
  ATTENDANCE_DEPARTMENT_TREND,
  ATTENDANCE_DEVICES,
  ATTENDANCE_EXCEPTIONS,
  ATTENDANCE_EXPECTED_WORKFORCE,
  ATTENDANCE_MONTHLY_TREND,
  ATTENDANCE_BRANCHES,
  ATTENDANCE_DEPARTMENTS,
  type AttendanceDashboardKpi,
  type AttendanceException,
  type AttendanceDevice,
} from "@/lib/mock-data/hr-attendance-dashboard";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

type ExceptionTab = "all" | AttendanceException["type"];

const EXCEPTION_TABS: { id: ExceptionTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "late", label: "Late" },
  { id: "absent", label: "Absent" },
  { id: "missing_punch", label: "Missing punches" },
  { id: "pending_correction", label: "Corrections" },
];

function KpiTrend({ kpi }: { kpi: AttendanceDashboardKpi }) {
  if (!kpi.trend) return null;
  const Icon =
    kpi.trendDirection === "up"
      ? ArrowUpRight
      : kpi.trendDirection === "down"
        ? ArrowDownRight
        : Minus;
  return (
    <p className="mt-1 flex items-center gap-1 text-[11px]">
      <Icon className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden />
      <span className="font-medium tabular-nums">{kpi.trend}</span>
      {kpi.hint ? <span className="text-muted-foreground">{kpi.hint}</span> : null}
    </p>
  );
}

function deviceStatusVariant(status: AttendanceDevice["status"]) {
  switch (status) {
    case "online":
      return "success" as const;
    case "offline":
      return "warning" as const;
    case "sync_error":
      return "warning" as const;
    default:
      return "muted" as const;
  }
}

/** SCR-HR-ATT-001 · DSH-ATT-001 — Attendance Dashboard */
export function AttendanceDashboard() {
  const toggleAiDrawer = useAppStore((s) => s.toggleAiDrawer);
  const [selectedDate, setSelectedDate] = useState("2026-06-17");
  const [branch, setBranch] = useState("all");
  const [department, setDepartment] = useState("all");
  const [exceptionTab, setExceptionTab] = useState<ExceptionTab>("all");

  const filteredExceptions = useMemo(() => {
    if (exceptionTab === "all") return ATTENDANCE_EXCEPTIONS;
    return ATTENDANCE_EXCEPTIONS.filter((e) => e.type === exceptionTab);
  }, [exceptionTab]);

  const presentPct = ATTENDANCE_DASHBOARD_KPIS[0]?.trend ?? "—";

  const selectClass =
    "h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {/* ZONE A — Header */}
      <section aria-label="Attendance dashboard header" className="space-y-2">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="page-title">Attendance Dashboard</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">As of {ATTENDANCE_DASHBOARD_AS_OF}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              aria-label="Attendance date"
              className={selectClass}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <select
              aria-label="Branch filter"
              className={cn(selectClass, "max-w-[9rem]")}
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              {ATTENDANCE_BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
            <select
              aria-label="Department filter"
              className={cn(selectClass, "max-w-[10rem]")}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {ATTENDANCE_DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
            <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5" disabled>
              <RefreshCw className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5" disabled>
              <Download className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={toggleAiDrawer}
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-500" aria-hidden />
              <span className="hidden sm:inline">Ask AI</span>
            </Button>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] font-normal">
          {presentPct} of {ATTENDANCE_EXPECTED_WORKFORCE.toLocaleString()} expected workforce
        </Badge>
      </section>

      {/* ZONE B — KPI cards */}
      <section aria-label="Attendance KPIs">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ATTENDANCE_DASHBOARD_KPIS.map((kpi) => (
            <Link
              key={kpi.id}
              href={kpi.href}
              className="group rounded-lg border border-input bg-card px-4 py-3 transition-colors hover:border-primary/30 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{kpi.value}</p>
              <KpiTrend kpi={kpi} />
            </Link>
          ))}
        </div>
      </section>

      {/* ZONE C + D — Analytics + Exceptions */}
      <div className="grid gap-4 lg:grid-cols-12">
        <section aria-label="Attendance analytics" className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          <DashboardWidget
            id="CHT-ATT-001"
            title="Daily Trend"
            footerHref="/hr/attendance/analytics"
            className="min-h-[260px] sm:col-span-2"
          >
            <div className="h-48 w-full min-h-[192px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ATTENDANCE_DAILY_TREND.filter((d) => d.present > 0)}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} width={36} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="present" name="Present" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="late" name="Late" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="absent" name="Absent" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DashboardWidget>

          <DashboardWidget
            id="CHT-ATT-003"
            title="Monthly Trend"
            footerHref="/hr/attendance/monthly"
            className="min-h-[260px]"
          >
            <div className="h-48 w-full min-h-[192px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ATTENDANCE_MONTHLY_TREND}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} width={44} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="present" name="Present" stroke="#6366f1" strokeWidth={2} />
                  <Line type="monotone" dataKey="absent" name="Absent" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DashboardWidget>

          <DashboardWidget
            id="CHT-ATT-004"
            title="Department Trend"
            footerHref="/hr/attendance/daily"
            className="min-h-[260px]"
          >
            <div className="h-48 w-full min-h-[192px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ATTENDANCE_DEPARTMENT_TREND} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="department" width={88} tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="present" name="Present" fill="#10b981" radius={[0, 2, 2, 0]} />
                  <Bar dataKey="late" name="Late" fill="#f59e0b" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardWidget>
        </section>

        {/* ZONE D — Exceptions */}
        <DashboardWidget
          id="WGT-ATT-EXC-001"
          title="Attendance Exceptions"
          className="lg:col-span-4 lg:row-span-2"
          footerHref="/hr/attendance/corrections?status=pending"
          footerLabel="Open corrections"
        >
          <div
            role="tablist"
            aria-label="Exception categories"
            className="mb-3 flex flex-wrap gap-1"
          >
            {EXCEPTION_TABS.map((tab) => {
              const count =
                tab.id === "all"
                  ? ATTENDANCE_EXCEPTIONS.length
                  : ATTENDANCE_EXCEPTIONS.filter((e) => e.type === tab.id).length;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={exceptionTab === tab.id}
                  onClick={() => setExceptionTab(tab.id)}
                  className={cn(
                    "rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
                    exceptionTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                  <span className="ml-1 tabular-nums">({count})</span>
                </button>
              );
            })}
          </div>
          <ul className="max-h-[320px] space-y-2 overflow-y-auto" role="tabpanel">
            {filteredExceptions.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/hr/employees?view=${item.employeeId}`}
                  className="block rounded-md border border-input px-2.5 py-2 hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium">{item.employeeName}</span>
                    <ExceptionBadge type={item.type} />
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground">{item.employeeNumber}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{item.detail}</p>
                </Link>
              </li>
            ))}
          </ul>
        </DashboardWidget>
      </div>

      {/* Device status */}
      <DashboardWidget
        id="CHT-ATT-006"
        title="Device Status"
        footerHref="/hr/settings/devices"
        footerLabel="Manage devices"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-xs">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 pr-3 font-medium">Device</th>
                <th className="pb-2 pr-3 font-medium">Branch</th>
                <th className="pb-2 pr-3 font-medium">Location</th>
                <th className="pb-2 pr-3 font-medium">Status</th>
                <th className="pb-2 pr-3 font-medium">Last sync</th>
                <th className="pb-2 font-medium text-right">Punches today</th>
              </tr>
            </thead>
            <tbody>
              {ATTENDANCE_DEVICES.map((device) => (
                <tr key={device.id} className="border-b border-border/40">
                  <td className="py-2.5 pr-3 font-mono font-medium">{device.name}</td>
                  <td className="py-2.5 pr-3">{device.branch}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{device.location}</td>
                  <td className="py-2.5 pr-3">
                    <Badge variant={deviceStatusVariant(device.status)} className="text-[10px] capitalize">
                      {device.status.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{device.lastSync}</td>
                  <td className="py-2.5 text-right tabular-nums">{device.punchesToday}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardWidget>

      {/* ZONE E — AI insights */}
      <section aria-label="AI attendance insights">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
          <h2 className="text-sm font-semibold">AI Attendance Insights</h2>
          <span className="text-[11px] text-muted-foreground">Advisory only</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {ATTENDANCE_AI_INSIGHTS.map((insight) => (
            <Link
              key={insight.id}
              href="/hr/ai/insights?category=attendance"
              className={cn(
                "rounded-lg border p-4 transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                insight.severity === "critical" &&
                  "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20",
                insight.severity === "warning" &&
                  "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30",
                insight.severity === "info" &&
                  "border-violet-200 bg-violet-50/50 dark:border-violet-900 dark:bg-violet-950/20",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {insight.category}
                </span>
                <Badge variant="outline" className="text-[9px] capitalize">
                  {insight.severity}
                </Badge>
              </div>
              <p className="mt-2 text-sm font-semibold">{insight.title}</p>
              <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{insight.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function ExceptionBadge({ type }: { type: AttendanceException["type"] }) {
  const labels: Record<AttendanceException["type"], string> = {
    late: "Late",
    absent: "Absent",
    missing_punch: "Missing punch",
    pending_correction: "Correction",
  };
  const variants: Record<AttendanceException["type"], "warning" | "outline" | "secondary"> = {
    late: "warning",
    absent: "warning",
    missing_punch: "outline",
    pending_correction: "secondary",
  };
  return (
    <Badge variant={variants[type]} className="shrink-0 text-[9px]">
      {labels[type]}
    </Badge>
  );
}
