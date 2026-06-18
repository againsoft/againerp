"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ClipboardCheck,
  Download,
  Minus,
  RefreshCw,
  Settings2,
  Sparkles,
} from "lucide-react";
import {
  Area,
  AreaChart,
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
import { Button } from "@/components/ui/button";
import {
  HR_DASHBOARD_ACTIVITIES,
  HR_DASHBOARD_ACTIVITY_TABS,
  HR_DASHBOARD_AI_INSIGHTS,
  HR_DASHBOARD_APPROVALS,
  HR_DASHBOARD_AS_OF,
  HR_DASHBOARD_ATTENDANCE_TRENDS,
  HR_DASHBOARD_BRANCHES,
  HR_DASHBOARD_DATE_RANGES,
  HR_DASHBOARD_DEPARTMENT_DISTRIBUTION,
  HR_DASHBOARD_DEPARTMENTS,
  HR_DASHBOARD_HEADCOUNT_TRENDS,
  HR_DASHBOARD_KPIS,
  HR_DASHBOARD_LEAVE_TRENDS,
  HR_DASHBOARD_NOTIFICATIONS,
  HR_DASHBOARD_QUICK_ACTIONS,
  type HrDashboardActivity,
  type HrDashboardKpi,
} from "@/lib/mock-data/hr-dashboard";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

function KpiStatusDot({ status }: { status?: HrDashboardKpi["status"] }) {
  if (!status || status === "neutral") return null;
  return (
    <span
      className={cn(
        "inline-block h-1.5 w-1.5 rounded-full",
        status === "good" && "bg-emerald-500",
        status === "warning" && "bg-amber-500",
        status === "critical" && "bg-red-500",
      )}
      aria-hidden
    />
  );
}

function KpiTrend({ kpi }: { kpi: HrDashboardKpi }) {
  if (!kpi.trend) return null;
  const Icon =
    kpi.trendDirection === "up"
      ? ArrowUpRight
      : kpi.trendDirection === "down"
        ? ArrowDownRight
        : Minus;

  return (
    <p className="mt-1 flex items-center gap-1 text-[11px]">
      <Icon
        className={cn(
          "h-3 w-3 shrink-0",
          kpi.trendDirection === "up" && kpi.status === "good" && "text-emerald-600",
          kpi.trendDirection === "up" && kpi.status === "warning" && "text-amber-600",
          kpi.trendDirection === "up" && kpi.status === "critical" && "text-red-600",
          kpi.trendDirection === "down" && "text-emerald-600",
          kpi.trendDirection === "neutral" && "text-muted-foreground",
        )}
        aria-hidden
      />
      <span className="font-medium tabular-nums">{kpi.trend}</span>
      {kpi.comparisonLabel ? (
        <span className="text-muted-foreground">{kpi.comparisonLabel}</span>
      ) : null}
    </p>
  );
}

function NotificationSeverity({ severity }: { severity: "critical" | "warning" | "info" }) {
  return (
    <span
      className={cn(
        "mt-0.5 h-2 w-2 shrink-0 rounded-full",
        severity === "critical" && "bg-red-500",
        severity === "warning" && "bg-amber-500",
        severity === "info" && "bg-blue-500",
      )}
      aria-hidden
    />
  );
}

/** HR Manager Dashboard — zones A–H per HR_DASHBOARD_UI_ARCHITECTURE.md */
export function HrDashboard() {
  const toggleAiDrawer = useAppStore((s) => s.toggleAiDrawer);
  const [dateRange, setDateRange] = useState("30d");
  const [branch, setBranch] = useState("all");
  const [department, setDepartment] = useState("all");
  const [activityTab, setActivityTab] = useState<(typeof HR_DASHBOARD_ACTIVITY_TABS)[number]["id"]>("all");

  const filteredActivities = useMemo(() => {
    if (activityTab === "all") return HR_DASHBOARD_ACTIVITIES;
    return HR_DASHBOARD_ACTIVITIES.filter((a) => a.category === activityTab);
  }, [activityTab]);

  const selectClass =
    "h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {/* ZONE A — Header */}
      <section aria-label="Dashboard header" className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="page-title">HR Dashboard</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">As of {HR_DASHBOARD_AS_OF}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Date range"
              className={selectClass}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              {HR_DASHBOARD_DATE_RANGES.map((r) => (
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
              {HR_DASHBOARD_BRANCHES.map((b) => (
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
              {HR_DASHBOARD_DEPARTMENTS.map((d) => (
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
            <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5" disabled>
              <Settings2 className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">Customize</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={toggleAiDrawer}
              aria-label="Ask about workforce"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-500" aria-hidden />
              <span className="hidden sm:inline">Ask AI</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ZONE B — KPI row */}
      <section aria-label="Key performance indicators">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {HR_DASHBOARD_KPIS.map((kpi) => (
            <Link
              key={kpi.id}
              href={kpi.href}
              className="group rounded-lg border border-input bg-card px-4 py-3 transition-colors hover:border-primary/30 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`${kpi.label}: ${kpi.value}`}
            >
              <div className="flex items-center gap-1.5">
                <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
                <KpiStatusDot status={kpi.status} />
              </div>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{kpi.value}</p>
              <KpiTrend kpi={kpi} />
              {kpi.hint ? (
                <p className="mt-1 text-[10px] text-muted-foreground group-hover:text-foreground/80">
                  {kpi.hint}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </section>

      {/* ZONE C + D — Analytics + Approvals */}
      <div className="grid gap-4 lg:grid-cols-12">
        <section aria-label="Analytics" className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          <DashboardWidget
            id="CHT-HR-001"
            title="Attendance Trends"
            footerHref="/hr/attendance/analytics"
            className="min-h-[260px]"
          >
            <div className="h-48 w-full min-h-[192px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={HR_DASHBOARD_ATTENDANCE_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} width={36} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="present" name="Present" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="late" name="Late" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="absent" name="Absent" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DashboardWidget>

          <DashboardWidget
            id="CHT-HR-002"
            title="Leave Trends"
            footerHref="/hr/reports/leave-balance"
            className="min-h-[260px]"
          >
            <div className="h-48 w-full min-h-[192px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HR_DASHBOARD_LEAVE_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} width={36} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="annual" name="Annual" stackId="1" fill="#6366f1" stroke="#6366f1" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="sick" name="Sick" stackId="1" fill="#8b5cf6" stroke="#8b5cf6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="unpaid" name="Unpaid" stackId="1" fill="#94a3b8" stroke="#94a3b8" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardWidget>

          <DashboardWidget
            id="CHT-HR-003"
            title="Headcount Trends"
            footerHref="/hr/reports/headcount"
            className="min-h-[260px]"
          >
            <div className="h-48 w-full min-h-[192px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={HR_DASHBOARD_HEADCOUNT_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} width={40} domain={["dataMin - 20", "dataMax + 10"]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="headcount" name="Headcount" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DashboardWidget>

          <DashboardWidget
            id="CHT-HR-004"
            title="Department Distribution"
            footerHref="/hr/organization/departments"
            className="min-h-[260px]"
          >
            <div className="h-48 w-full min-h-[192px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={HR_DASHBOARD_DEPARTMENT_DISTRIBUTION}
                    dataKey="count"
                    nameKey="department"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                  >
                    {HR_DASHBOARD_DEPARTMENT_DISTRIBUTION.map((entry) => (
                      <Cell key={entry.department} fill={entry.fill} />
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
          id="WGT-HR-ACT-QUEUE"
          title="Approval Queue"
          className="lg:col-span-4 lg:row-span-2"
          footerHref="/inbox/approvals?status=pending"
          footerLabel="Open approval center"
        >
          <ul className="space-y-2">
            {HR_DASHBOARD_APPROVALS.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="flex gap-2 rounded-md px-2 py-2 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ClipboardCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        {item.type}
                      </span>
                      {item.priority === "high" ? (
                        <span className="text-[10px] font-medium text-red-600">Urgent</span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 truncate text-xs font-medium">{item.title}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {item.requester} · {item.submittedAt}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </DashboardWidget>
      </div>

      {/* ZONE E + F — Activity + Notifications */}
      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardWidget
          id="WGT-ACT-LST-002"
          title="Activity Feed"
          footerHref="/hr/activity"
          footerLabel="View timeline"
        >
          <div
            role="tablist"
            aria-label="Activity categories"
            className="mb-3 flex flex-wrap gap-1"
          >
            {HR_DASHBOARD_ACTIVITY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activityTab === tab.id}
                onClick={() => setActivityTab(tab.id)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                  activityTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <ul className="space-y-2" role="tabpanel">
            {filteredActivities.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </ul>
        </DashboardWidget>

        <DashboardWidget
          id="WGT-NTF-LST-002"
          title="Notifications"
          footerHref="/notifications"
          footerLabel="View all"
        >
          <ul className="space-y-2">
            {HR_DASHBOARD_NOTIFICATIONS.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href ?? "/notifications"}
                  className="flex gap-2 rounded-md px-2 py-2 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <NotificationSeverity severity={item.severity} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium leading-snug">{item.title}</p>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{item.meta}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{item.time}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </DashboardWidget>
      </div>

      {/* ZONE G — AI Insights */}
      <section aria-label="AI insights">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
          <h2 className="text-sm font-semibold">AI Insights</h2>
          <span className="text-[11px] text-muted-foreground">Advisory only — no auto-actions</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {HR_DASHBOARD_AI_INSIGHTS.map((insight) => (
            <Link
              key={insight.id}
              href={insight.href}
              className="rounded-lg border border-violet-200 bg-violet-50/50 p-4 transition-colors hover:border-violet-300 hover:bg-violet-50 dark:border-violet-900 dark:bg-violet-950/20 dark:hover:bg-violet-950/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-medium uppercase tracking-wide text-violet-600 dark:text-violet-400">
                  {insight.category}
                </span>
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium capitalize text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                  {insight.confidence} confidence
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold">{insight.title}</p>
              <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{insight.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ZONE H — Quick Actions */}
      <section aria-label="Quick actions" className="border-t pt-4">
        <h2 className="mb-2 text-sm font-semibold">Quick Actions</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {HR_DASHBOARD_QUICK_ACTIONS.map((action) => (
            <Button key={action.id} variant="secondary" size="sm" className="h-9 shrink-0" asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}

function ActivityRow({ item }: { item: HrDashboardActivity }) {
  const content = (
    <>
      <p className="text-xs font-medium">{item.title}</p>
      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{item.meta}</p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{item.time}</p>
    </>
  );

  if (item.href) {
    return (
      <li>
        <Link
          href={item.href}
          className="block rounded-md px-2 py-2 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li className="rounded-md px-2 py-2">
      {content}
    </li>
  );
}
