"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Check,
  ClipboardCheck,
  Download,
  Lock,
  Minus,
  RefreshCw,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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
  PAYROLL_ALERT_BANNERS,
  PAYROLL_APPROVAL_QUEUE,
  PAYROLL_AUDITOR_FINDINGS,
  PAYROLL_BRANCHES,
  PAYROLL_CALENDAR_EVENTS,
  PAYROLL_COMPLIANCE_ALERTS,
  PAYROLL_COST_BREAKDOWN,
  PAYROLL_COST_TREND,
  PAYROLL_CURRENT_PERIOD,
  PAYROLL_CURRENT_RUN_ID,
  PAYROLL_CURRENT_STATUS,
  PAYROLL_DASHBOARD_AS_OF,
  PAYROLL_DASHBOARD_KPIS,
  PAYROLL_DEPARTMENT_COST,
  PAYROLL_NET_PAY_TOTAL,
  PAYROLL_PAY_DATE,
  PAYROLL_QUICK_ACTIONS,
  PAYROLL_STATUS_LABELS,
  formatPayrollAmount,
  type PayrollApprovalItem,
  type PayrollDashboardKpi,
  type PayrollRunStatus,
} from "@/lib/mock-data/hr-payroll-dashboard";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

function KpiTrend({ kpi }: { kpi: PayrollDashboardKpi }) {
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

function payrollStatusVariant(status: PayrollRunStatus) {
  switch (status) {
    case "locked":
      return "success" as const;
    case "approved":
      return "success" as const;
    case "pending":
      return "warning" as const;
    case "calculated":
      return "secondary" as const;
    default:
      return "muted" as const;
  }
}

function approvalTypeLabel(type: PayrollApprovalItem["type"]) {
  const labels: Record<PayrollApprovalItem["type"], string> = {
    payroll_run: "Payroll run",
    salary_revision: "Salary revision",
    bonus: "Bonus",
    commission: "Commission",
  };
  return labels[type];
}

/** SCR-PAY-DSH-001 · DSH-PAY-001 — Payroll Dashboard */
export function PayrollDashboard() {
  const toggleAiDrawer = useAppStore((s) => s.toggleAiDrawer);
  const [branch, setBranch] = useState("all");

  const selectClass =
    "h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  const criticalFindings = PAYROLL_AUDITOR_FINDINGS.filter((f) => f.severity === "critical").length;
  const warningFindings = PAYROLL_AUDITOR_FINDINGS.filter((f) => f.severity === "warning").length;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {/* ZONE A — Header */}
      <section aria-label="Payroll dashboard header" className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="page-title">Payroll Dashboard</h1>
              <Badge variant="outline" className="font-mono text-[10px]">
                {PAYROLL_CURRENT_RUN_ID}
              </Badge>
              <Badge variant={payrollStatusVariant(PAYROLL_CURRENT_STATUS)} className="text-[10px]">
                {PAYROLL_STATUS_LABELS[PAYROLL_CURRENT_STATUS]}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {PAYROLL_CURRENT_PERIOD} · Pay date {PAYROLL_PAY_DATE} · As of {PAYROLL_DASHBOARD_AS_OF}
            </p>
            <p className="mt-1 text-sm font-medium tabular-nums text-foreground">
              Net pay {formatPayrollAmount(PAYROLL_NET_PAY_TOTAL)}
              <span className="ml-2 text-xs font-normal text-muted-foreground">1,248 employees</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Branch filter"
              className={cn(selectClass, "max-w-[9rem]")}
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              {PAYROLL_BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
            <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5" disabled>
              <Download className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5" disabled>
              <RefreshCw className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={toggleAiDrawer}
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-500" aria-hidden />
              <span className="hidden sm:inline">AI Auditor</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ZONE B — Alert banners */}
      <section aria-label="Payroll alert banners" className="space-y-2">
        {PAYROLL_ALERT_BANNERS.map((banner) => (
          <Link
            key={banner.id}
            href={banner.href}
            className={cn(
              "flex gap-3 rounded-lg border px-4 py-3 transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              banner.severity === "critical" &&
                "border-red-200 bg-red-50/80 dark:border-red-900 dark:bg-red-950/30",
              banner.severity === "warning" &&
                "border-amber-200 bg-amber-50/80 dark:border-amber-900 dark:bg-amber-950/30",
              banner.severity === "info" &&
                "border-blue-200 bg-blue-50/80 dark:border-blue-900 dark:bg-blue-950/30",
            )}
          >
            <AlertTriangle
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                banner.severity === "critical" && "text-red-600",
                banner.severity === "warning" && "text-amber-600",
                banner.severity === "info" && "text-blue-600",
              )}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold">{banner.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{banner.message}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* ZONE B — KPI cards (8) */}
      <section aria-label="Payroll KPIs">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PAYROLL_DASHBOARD_KPIS.map((kpi) => (
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
        <section aria-label="Payroll analytics" className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          <DashboardWidget
            id="CHT-PAY-001"
            title="Payroll Cost Analytics"
            footerHref="/payroll/analytics"
            footerLabel="Open analytics"
            className="min-h-[280px] sm:col-span-2"
          >
            <div className="mb-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
              <span>
                Gross <strong className="text-foreground">৳48.6M</strong>
              </span>
              <span>
                Net <strong className="text-foreground">৳40.4M</strong>
              </span>
              <span>
                Tax <strong className="text-foreground">৳5.1M</strong>
              </span>
              <span>
                Employer <strong className="text-foreground">৳6.5M</strong>
              </span>
            </div>
            <div className="h-52 w-full min-h-[208px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PAYROLL_COST_TREND}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} width={36} unit="M" />
                  <Tooltip formatter={(v: number) => [`৳${v}M`, ""]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="gross" name="Gross" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="net" name="Net pay" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="tax" name="Tax" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardWidget>

          <DashboardWidget
            id="CHT-PAY-002"
            title="Department Salary Cost"
            footerHref="/payroll/reports/salary-register"
            footerLabel="Salary register"
            className="min-h-[280px] sm:col-span-2"
          >
            <div className="h-52 w-full min-h-[208px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PAYROLL_DEPARTMENT_COST} margin={{ bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="department" tick={{ fontSize: 9 }} interval={0} angle={-18} textAnchor="end" height={52} />
                  <YAxis tick={{ fontSize: 10 }} width={36} unit="M" />
                  <Tooltip formatter={(v: number) => [`৳${v}M`, ""]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="gross" name="Gross" fill="#6366f1" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="net" name="Net" fill="#10b981" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardWidget>

          <DashboardWidget
            id="CHT-PAY-007"
            title="Cost Breakdown"
            footerHref="/payroll/analytics"
            className="min-h-[260px] sm:col-span-2 lg:col-span-1"
          >
            <div className="h-48 w-full min-h-[192px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PAYROLL_COST_BREAKDOWN}
                    dataKey="amount"
                    nameKey="component"
                    cx="50%"
                    cy="50%"
                    innerRadius={44}
                    outerRadius={68}
                    paddingAngle={2}
                  >
                    {PAYROLL_COST_BREAKDOWN.map((entry) => (
                      <Cell key={entry.component} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`৳${v}M`, ""]} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </DashboardWidget>
        </section>

        {/* ZONE D — Approval queue */}
        <DashboardWidget
          id="WGT-PAY-QUEUE-001"
          title="Approval Queue"
          className="lg:col-span-4 lg:row-span-2"
          footerHref="/inbox/approvals?module=payroll&status=pending"
          footerLabel="Open approval center"
        >
          <ul className="max-h-[480px] space-y-2 overflow-y-auto">
            {PAYROLL_APPROVAL_QUEUE.map((item) => (
              <li key={item.id} className="rounded-md border border-input">
                <Link href={item.href} className="block px-2.5 py-2 hover:bg-muted/50">
                  <div className="flex items-start gap-2">
                    <ClipboardCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          {approvalTypeLabel(item.type)}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">{item.reference}</span>
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
                      <p className="mt-0.5 text-xs font-medium">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.submitter}
                        {item.amount ? ` · ${item.amount}` : ""}
                        {item.headcount ? ` · ${item.headcount} employees` : ""}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{item.submittedAt}</p>
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

      {/* ZONE E — Compliance alerts */}
      <DashboardWidget
        id="WGT-PAY-CMP-001"
        title="Compliance Alerts"
        footerHref="/payroll/runs?view=PR-2026-06&tab=compliance"
        footerLabel="Compliance center"
      >
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PAYROLL_COMPLIANCE_ALERTS.map((alert) => (
            <li key={alert.id}>
              <Link
                href={alert.href}
                className={cn(
                  "flex h-full gap-2 rounded-md border px-3 py-2.5 transition-colors hover:bg-muted/50",
                  alert.severity === "critical" && "border-red-200/80 dark:border-red-900/50",
                  alert.severity === "warning" && "border-amber-200/80 dark:border-amber-900/50",
                )}
              >
                <span
                  className={cn(
                    "mt-1 h-2 w-2 shrink-0 rounded-full",
                    alert.severity === "critical" && "bg-red-500",
                    alert.severity === "warning" && "bg-amber-500",
                    alert.severity === "info" && "bg-blue-500",
                  )}
                  aria-hidden
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {alert.category}
                    </span>
                    {alert.dueDate ? (
                      <Badge variant="outline" className="text-[9px]">
                        Due {alert.dueDate}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs font-medium">{alert.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{alert.detail}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </DashboardWidget>

      {/* ZONE F — AI Payroll Auditor Panel */}
      <section
        aria-label="AI Payroll Auditor"
        className="rounded-lg border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50"
      >
        <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 text-white dark:bg-slate-700">
              <Shield className="h-4 w-4" aria-hidden />
            </div>
            <div>
              <h2 className="text-sm font-semibold">AI Payroll Auditor</h2>
              <p className="text-[11px] text-muted-foreground">
                Post-calculate scan · {PAYROLL_CURRENT_RUN_ID} · Read-only advisory
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {criticalFindings > 0 ? (
              <Badge variant="warning" className="text-[10px]">
                {criticalFindings} critical
              </Badge>
            ) : null}
            {warningFindings > 0 ? (
              <Badge variant="outline" className="text-[10px]">
                {warningFindings} warnings
              </Badge>
            ) : null}
            <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5 text-xs" disabled>
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Validate with AI
            </Button>
          </div>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {PAYROLL_AUDITOR_FINDINGS.map((finding) => (
            <div key={finding.id} className="flex gap-3 px-4 py-3">
              <span
                className={cn(
                  "mt-1 h-2 w-2 shrink-0 rounded-full",
                  finding.severity === "critical" && "bg-red-500",
                  finding.severity === "warning" && "bg-amber-500",
                  finding.severity === "info" && "bg-blue-500",
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {finding.category}
                  </span>
                  <Badge variant="outline" className="text-[9px] capitalize">
                    {finding.confidence} confidence
                  </Badge>
                  {finding.affectedCount ? (
                    <span className="text-[10px] text-muted-foreground">
                      {finding.affectedCount} affected
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-sm font-medium">{finding.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{finding.summary}</p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">Source: {finding.source}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ZONE G — Payroll calendar mini */}
      <DashboardWidget
        id="WGT-PAY-CAL-001"
        title="Payroll Calendar"
        footerHref="/payroll/calendar"
        footerLabel="Full calendar"
      >
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">June 2026 — milestones and statutory deadlines</p>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={`pad-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const event = PAYROLL_CALENDAR_EVENTS.find((e) => e.day === day);
              return (
                <div
                  key={day}
                  className={cn(
                    "relative flex aspect-square flex-col items-center justify-center rounded-md border text-xs",
                    event?.isToday
                      ? "border-primary bg-primary/10 font-semibold"
                      : event
                        ? "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30"
                        : "border-transparent",
                  )}
                >
                  {day}
                  {event ? (
                    <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-amber-500" aria-hidden />
                  ) : null}
                </div>
              );
            })}
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {PAYROLL_CALENDAR_EVENTS.map((event) => (
              <li key={event.id}>
                <Link
                  href="/payroll/calendar"
                  className="flex items-center gap-2 rounded-md border border-input px-2.5 py-2 text-xs hover:bg-muted/50"
                >
                  <CalendarEventIcon type={event.type} />
                  <div>
                    <span className="font-medium tabular-nums">{event.day} Jun</span>
                    <span className="text-muted-foreground"> — {event.label}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </DashboardWidget>

      {/* ZONE H — Quick actions */}
      <section aria-label="Quick actions" className="border-t pt-4">
        <h2 className="mb-2 text-sm font-semibold">Quick Actions</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PAYROLL_QUICK_ACTIONS.map((action) => (
            <Button key={action.id} variant="secondary" size="sm" className="h-9 shrink-0 gap-1.5" asChild>
              <Link href={action.href}>
                {action.id === "QUICK-PAY-004" ? (
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                ) : action.id === "QUICK-PAY-005" ? (
                  <Banknote className="h-3.5 w-3.5" aria-hidden />
                ) : null}
                {action.label}
              </Link>
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}

function CalendarEventIcon({ type }: { type: (typeof PAYROLL_CALENDAR_EVENTS)[number]["type"] }) {
  switch (type) {
    case "pay_date":
    case "bank_export":
      return <Banknote className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />;
    case "tax":
      return <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden />;
    case "approval":
      return <ClipboardCheck className="h-3.5 w-3.5 shrink-0 text-blue-600" aria-hidden />;
    default:
      return <RefreshCw className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />;
  }
}
