"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ClipboardCheck,
  Download,
  Minus,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardWidget } from "@/components/hr/dashboard/dashboard-widget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LEAVE_AI_INSIGHTS,
  LEAVE_APPROVAL_QUEUE,
  LEAVE_BRANCHES,
  LEAVE_CALENDAR_WEEK,
  LEAVE_DASHBOARD_AS_OF,
  LEAVE_DASHBOARD_KPIS,
  LEAVE_DATE_RANGES,
  LEAVE_DEPARTMENT_ANALYTICS,
  LEAVE_DEPARTMENTS,
  LEAVE_MONTHLY_TREND,
  LEAVE_ON_LEAVE_TODAY,
  LEAVE_TYPE_DISTRIBUTION,
  LEAVE_TYPES,
  type LeaveDashboardKpi,
} from "@/lib/mock-data/hr-leave-dashboard";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

function KpiTrend({ kpi }: { kpi: LeaveDashboardKpi }) {
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

/** SCR-HR-LEV-001 · DSH-LEV-001 — Leave Dashboard */
export function LeaveDashboard() {
  const toggleAiDrawer = useAppStore((s) => s.toggleAiDrawer);
  const [dateRange, setDateRange] = useState("30d");
  const [branch, setBranch] = useState("all");
  const [department, setDepartment] = useState("all");
  const [leaveType, setLeaveType] = useState("all");
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(
    LEAVE_CALENDAR_WEEK.find((d) => d.isToday)?.date ?? LEAVE_CALENDAR_WEEK[0]?.date,
  );

  const selectedDay = LEAVE_CALENDAR_WEEK.find((d) => d.date === selectedCalendarDay);

  const selectClass =
    "h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {/* ZONE A — Header */}
      <section aria-label="Leave dashboard header" className="space-y-2">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="page-title">Leave Dashboard</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">As of {LEAVE_DASHBOARD_AS_OF}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Date range"
              className={selectClass}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              {LEAVE_DATE_RANGES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
            <select
              aria-label="Branch filter"
              className={cn(selectClass, "max-w-[9rem]")}
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              {LEAVE_BRANCHES.map((b) => (
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
              {LEAVE_DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
            <select
              aria-label="Leave type filter"
              className={cn(selectClass, "max-w-[10rem]")}
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              {LEAVE_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
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
      </section>

      {/* ZONE B — KPI cards */}
      <section aria-label="Leave KPIs">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LEAVE_DASHBOARD_KPIS.map((kpi) => (
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

      {/* ZONE C + D — Analytics + Approval queue */}
      <div className="grid gap-4 lg:grid-cols-12">
        <section aria-label="Leave analytics" className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          <DashboardWidget
            id="CHT-LEV-003"
            title="Department Leave Analytics"
            footerHref="/hr/reports/leave-taken"
            footerLabel="View leave report"
            className="min-h-[280px] sm:col-span-2"
          >
            <div className="h-52 w-full min-h-[208px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={LEAVE_DEPARTMENT_ANALYTICS} margin={{ bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="department" tick={{ fontSize: 9 }} interval={0} angle={-20} textAnchor="end" height={56} />
                  <YAxis tick={{ fontSize: 10 }} width={36} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="daysTaken" name="Days taken" fill="#6366f1" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardWidget>

          <DashboardWidget
            id="CHT-LEV-001"
            title="Leave Trends"
            footerHref="/hr/leave/analytics"
            className="min-h-[260px]"
          >
            <div className="h-48 w-full min-h-[192px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={LEAVE_MONTHLY_TREND}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} width={40} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="approved" name="Approved" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="rejected" name="Rejected" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DashboardWidget>

          <DashboardWidget
            id="CHT-LEV-004"
            title="Leave Type Distribution"
            footerHref="/hr/leave/balances"
            className="min-h-[260px]"
          >
            <div className="h-48 w-full min-h-[192px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={LEAVE_TYPE_DISTRIBUTION}
                    dataKey="days"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    innerRadius={44}
                    outerRadius={68}
                    paddingAngle={2}
                  >
                    {LEAVE_TYPE_DISTRIBUTION.map((entry) => (
                      <Cell key={entry.type} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </DashboardWidget>
        </section>

        {/* ZONE D — Approval queue */}
        <DashboardWidget
          id="WGT-LEV-QUEUE-001"
          title="Approval Queue"
          className="lg:col-span-4 lg:row-span-2"
          footerHref="/hr/leave/requests?status=pending"
          footerLabel="Open all pending"
        >
          <ul className="max-h-[420px] space-y-2 overflow-y-auto">
            {LEAVE_APPROVAL_QUEUE.map((item) => (
              <li key={item.id} className="rounded-md border border-input">
                <Link
                  href={item.href}
                  className="block px-2.5 py-2 hover:bg-muted/50"
                >
                  <div className="flex items-start gap-2">
                    <ClipboardCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[10px] text-muted-foreground">{item.requestNo}</span>
                        {item.priority === "high" ? (
                          <Badge variant="warning" className="text-[9px]">
                            Urgent
                          </Badge>
                        ) : null}
                        {item.status === "escalated" ? (
                          <Badge variant="outline" className="text-[9px]">
                            Escalated
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-0.5 text-xs font-medium">{item.employeeName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.leaveType} · {item.startDate} – {item.endDate} ({item.days}d)
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {item.department} · {item.submittedAt}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="flex gap-1 border-t border-border/60 px-2 py-1.5">
                  <Button type="button" variant="outline" size="sm" className="h-7 flex-1 gap-1 text-[10px]" disabled>
                    <Check className="h-3 w-3" aria-hidden />
                    Approve
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="h-7 flex-1 gap-1 text-[10px]" disabled>
                    <X className="h-3 w-3" aria-hidden />
                    Reject
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </DashboardWidget>
      </div>

      {/* ZONE G — Leave calendar */}
      <DashboardWidget
        id="WGT-LEV-CAL-001"
        title="Leave Calendar"
        footerHref="/hr/leave/calendar"
        footerLabel="Open full calendar"
      >
        <div className="space-y-4">
          <div
            role="tablist"
            aria-label="Week leave overview"
            className="grid grid-cols-7 gap-1 sm:gap-2"
          >
            {LEAVE_CALENDAR_WEEK.map((day) => (
              <button
                key={day.date}
                type="button"
                role="tab"
                aria-selected={selectedCalendarDay === day.date}
                onClick={() => setSelectedCalendarDay(day.date)}
                className={cn(
                  "flex flex-col items-center rounded-lg border px-1 py-2 text-center transition-colors sm:px-2",
                  selectedCalendarDay === day.date
                    ? "border-primary bg-primary/5"
                    : "border-input hover:bg-muted/50",
                  day.isWeekend && "opacity-70",
                )}
              >
                <span className="text-[10px] text-muted-foreground">{day.dayOfWeek}</span>
                <span className="text-sm font-semibold tabular-nums">{day.label}</span>
                <span
                  className={cn(
                    "mt-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
                    day.isToday
                      ? "bg-primary text-primary-foreground"
                      : day.count > 20
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {day.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden />
              <h3 className="text-sm font-medium">
                Employees on leave
                {selectedDay ? (
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    — {selectedDay.dayOfWeek} {selectedDay.label} Jun
                  </span>
                ) : null}
              </h3>
            </div>
            <Badge variant="secondary" className="tabular-nums">
              {selectedDay?.count ?? LEAVE_ON_LEAVE_TODAY.length} total
            </Badge>
          </div>

          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {LEAVE_ON_LEAVE_TODAY.map((emp) => (
              <li key={emp.id}>
                <Link
                  href={`/hr/employees?view=${emp.employeeId}&tab=leave`}
                  className="flex gap-2 rounded-md border border-input px-3 py-2 hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">{emp.employeeName}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{emp.employeeNumber}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {emp.leaveType} · {emp.startDate} – {emp.endDate}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 self-start text-[9px]">
                    {emp.days}d
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </DashboardWidget>

      {/* ZONE F — AI insights */}
      <section aria-label="AI leave insights">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
          <h2 className="text-sm font-semibold">AI Leave Insights</h2>
          <span className="text-[11px] text-muted-foreground">Advisory only — never auto-approve</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {LEAVE_AI_INSIGHTS.map((insight) => (
            <Link
              key={insight.id}
              href="/hr/ai/insights?category=leave"
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
