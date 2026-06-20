"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  ClipboardList,
  Clock,
  Cpu,
  FileBarChart,
  Package,
  Repeat,
  ScrollText,
  Sparkles,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import {
  amcRenewalsSeed,
  formatBdt,
  serviceAiInsights,
  serviceOrdersByStatus,
  serviceRevenueMtd,
  SERVICE_PRIORITY_LABELS,
  serviceTypeBreakdown,
  serviceWeeklyOrders,
  technicianUtilization,
  todayScheduleSeed,
  type TodayScheduleItem,
} from "@/lib/mock-data/service";
import { chartValueAsNumber } from "@/lib/charts/recharts-tooltip";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ServiceNav } from "./service-nav";

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  alert,
  href,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
  alert?: boolean;
  href?: string;
}) {
  const inner = (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-all hover:shadow-md",
        alert ? "border-destructive/30 bg-destructive/5" : "border-input bg-card"
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn("rounded-lg p-2.5", color)}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        {alert && (
          <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
            Action needed
          </span>
        )}
      </div>
      <div>
        <p className="text-xl font-bold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {sub && <p className="text-[11px] text-muted-foreground/70">{sub}</p>}
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

type ModuleCard = {
  icon: React.ElementType;
  label: string;
  href: string;
  metric: string | number;
  metricLabel: string;
  status?: string;
  statusColor?: string;
  alert?: boolean;
};

function ModuleCard({ card }: { card: ModuleCard }) {
  const Icon = card.icon;
  return (
    <Link
      href={card.href}
      className="group rounded-lg border border-input bg-card p-4 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:hover:border-indigo-800"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
        </div>
        <ArrowRight className="mt-0.5 h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <p className="mt-2 text-xs font-medium">{card.label}</p>
      <p className={cn("text-lg font-semibold tabular-nums", card.alert && "text-amber-600 dark:text-amber-400")}>
        {card.metric}
      </p>
      <p className="text-[10px] text-muted-foreground">{card.metricLabel}</p>
      {card.status && (
        <p className={cn("mt-1 text-[10px] font-medium", card.statusColor ?? "text-muted-foreground")}>
          {card.status}
        </p>
      )}
    </Link>
  );
}

function priorityVariant(p: TodayScheduleItem["priority"]) {
  if (p === "critical") return "muted" as const;
  if (p === "high") return "warning" as const;
  if (p === "medium") return "secondary" as const;
  return "success" as const;
}

export function ServiceDashboard() {
  const revenueMtd = serviceRevenueMtd.reduce((s, w) => s + w.revenue, 0);
  const jobsMtd = serviceRevenueMtd.reduce((s, w) => s + w.jobs, 0);
  const openOrders = serviceOrdersByStatus
    .filter((s) => s.status !== "Completed")
    .reduce((s, r) => s + r.count, 0);
  const slaAtRisk = 4;
  const amcDue = amcRenewalsSeed.length;

  const modules: ModuleCard[] = [
    {
      icon: ClipboardList,
      label: "Service Catalog",
      href: "/service/catalog",
      metric: 48,
      metricLabel: "Active services",
      status: "5 billing types",
      statusColor: "text-muted-foreground",
    },
    {
      icon: Cpu,
      label: "Customer Assets",
      href: "/service/assets",
      metric: 312,
      metricLabel: "Registered assets",
      status: "18 in repair",
      statusColor: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: Wrench,
      label: "Service Orders",
      href: "/service/orders",
      metric: openOrders,
      metricLabel: "Open orders",
      status: "6 unassigned",
      statusColor: "text-amber-600 dark:text-amber-400",
      alert: openOrders > 20,
    },
    {
      icon: Package,
      label: "Work Orders",
      href: "/service/work-orders",
      metric: 11,
      metricLabel: "Scheduled today",
      status: "3 in progress",
      statusColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      icon: Calendar,
      label: "Schedule",
      href: "/service/schedule",
      metric: todayScheduleSeed.length,
      metricLabel: "Visits today",
      status: "2 critical priority",
      statusColor: "text-rose-600 dark:text-rose-400",
    },
    {
      icon: ScrollText,
      label: "Contracts (AMC)",
      href: "/service/contracts",
      metric: amcDue,
      metricLabel: "Renewals in 30d",
      status: formatBdt(540_000) + " value",
      statusColor: "text-blue-600 dark:text-blue-400",
      alert: amcRenewalsSeed.some((r) => r.daysLeft <= 7),
    },
    {
      icon: Repeat,
      label: "Subscriptions",
      href: "/service/subscriptions",
      metric: 19,
      metricLabel: "Active plans",
      status: "4 billing this week",
      statusColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Users,
      label: "Technicians",
      href: "/service/technicians",
      metric: 12,
      metricLabel: "Field team",
      status: "Avg 68% utilization",
      statusColor: "text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-6">
      <ServiceNav />

      <div className="flex flex-wrap gap-2">
        {[
          { label: "New service order", icon: Wrench, href: "/service/orders?create=1" },
          { label: "Open schedule", icon: Calendar, href: "/service/schedule" },
          { label: "Register asset", icon: Cpu, href: "/service/assets?create=1" },
          { label: "New AMC", icon: ScrollText, href: "/service/contracts?create=1" },
          { label: "AI assistant", icon: Sparkles, href: "/service/ai" },
        ].map(({ label, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Button variant="outline" size="sm">
              <Icon className="mr-1.5 h-3.5 w-3.5" />
              {label}
            </Button>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Open Service Orders"
          value={openOrders}
          sub="6 awaiting assignment"
          icon={Wrench}
          color="bg-indigo-500"
          alert
          href="/service/orders"
        />
        <KpiCard
          label="Today's Visits"
          value={todayScheduleSeed.length}
          sub="3 in progress now"
          icon={Calendar}
          color="bg-blue-500"
          href="/service/schedule"
        />
        <KpiCard
          label="SLA at Risk"
          value={slaAtRisk}
          sub="2 critical breaches"
          icon={AlertTriangle}
          color="bg-red-500"
          alert
          href="/service/orders?filter=sla"
        />
        <KpiCard
          label="Revenue MTD"
          value={formatBdt(revenueMtd)}
          sub={`${jobsMtd} jobs completed`}
          icon={Zap}
          color="bg-emerald-500"
          href="/service/reports"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Work Orders Today"
          value={11}
          sub="5 technicians dispatched"
          icon={Package}
          color="bg-violet-500"
          href="/service/work-orders"
        />
        <KpiCard
          label="AMC Renewals"
          value={amcDue}
          sub="Next 30 days"
          icon={ScrollText}
          color="bg-cyan-500"
          href="/service/contracts"
        />
        <KpiCard
          label="Avg Utilization"
          value="68%"
          sub="Field team capacity"
          icon={Users}
          color="bg-orange-500"
        />
        <KpiCard
          label="Pending Quotes"
          value={5}
          sub="Repair diagnosis stage"
          icon={Clock}
          color="bg-slate-500"
          href="/service/repairs"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-lg border border-input bg-card p-4 shadow-sm xl:col-span-2">
          <h2 className="mb-3 text-sm font-medium">Weekly service orders</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={serviceWeeklyOrders} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <Tooltip formatter={(v) => chartValueAsNumber(v)} />
              <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[3, 3, 0, 0]} />
              <Bar dataKey="open" name="Open" fill="#6366f1" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-input bg-card p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-medium">Jobs by service type</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={serviceTypeBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={42}
                outerRadius={68}
                paddingAngle={2}
              >
                {serviceTypeBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => chartValueAsNumber(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
            {serviceTypeBreakdown.map((t) => (
              <span key={t.name} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                {t.name} ({t.value}%)
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-input bg-card p-3 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-medium">Today&apos;s schedule</h2>
            <Link href="/service/schedule" className="text-xs text-indigo-600 dark:text-indigo-400">
              View calendar →
            </Link>
          </div>
          <div className="space-y-2">
            {todayScheduleSeed.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2 rounded-md border border-border/60 p-2 text-xs"
              >
                <span className="w-10 shrink-0 font-mono text-[10px] text-muted-foreground">{item.time}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.customer}</p>
                  <p className="truncate text-muted-foreground">{item.service}</p>
                </div>
                <Badge variant={priorityVariant(item.priority)} className="shrink-0 text-[9px]">
                  {SERVICE_PRIORITY_LABELS[item.priority]}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-input bg-card p-3 shadow-sm">
          <h2 className="mb-3 text-sm font-medium">Technician utilization</h2>
          <div className="space-y-3">
            {technicianUtilization.map((t) => (
              <div key={t.name}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium">{t.name}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {t.utilization}% · {t.jobs} jobs
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      t.utilization >= 85 ? "bg-amber-500" : t.utilization >= 60 ? "bg-indigo-500" : "bg-emerald-500"
                    )}
                    style={{ width: `${t.utilization}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 shadow-sm dark:border-amber-900 dark:bg-amber-950/20">
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <h2 className="text-sm font-medium">AMC renewals — next 30 days</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-xs">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 pr-3 font-medium">Contract</th>
                <th className="pb-2 pr-3 font-medium">Customer</th>
                <th className="pb-2 pr-3 font-medium">Asset</th>
                <th className="pb-2 pr-3 font-medium text-right">Value</th>
                <th className="pb-2 text-right font-medium">Days</th>
              </tr>
            </thead>
            <tbody>
              {amcRenewalsSeed.map((r) => (
                <tr key={r.id} className="border-b border-border/50 last:border-0">
                  <td className="py-2 pr-3 font-mono text-[10px]">{r.contract}</td>
                  <td className="py-2 pr-3">{r.customer}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{r.asset}</td>
                  <td className="py-2 pr-3 text-right tabular-nums font-medium">{formatBdt(r.value)}</td>
                  <td className="py-2 text-right">
                    <Badge variant={r.daysLeft <= 7 ? "warning" : "secondary"} className="text-[9px]">
                      {r.daysLeft}d
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium">Modules</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((card) => (
            <ModuleCard key={card.label} card={card} />
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {serviceOrdersByStatus.map((row) => (
          <div key={row.status} className="rounded-lg border border-input bg-card p-3 text-center shadow-sm">
            <p className="text-[11px] text-muted-foreground">{row.status}</p>
            <p className="mt-0.5 text-xl font-semibold tabular-nums">{row.count}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-sm font-medium">Service AI insights</h2>
          <Link href="/service/ai" className="ml-auto text-xs text-indigo-600 dark:text-indigo-400">
            Open assistant →
          </Link>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          {serviceAiInsights.map((t) => (
            <p key={t} className="rounded-lg border border-input bg-card p-3 text-xs text-muted-foreground shadow-sm">
              {t}
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-input bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileBarChart className="h-4 w-4" />
          <span>
            MTD revenue {formatBdt(revenueMtd)} · {jobsMtd} jobs · avg ticket{" "}
            {formatBdt(Math.round(revenueMtd / jobsMtd))}
          </span>
        </div>
        <Link href="/service/reports">
          <Button variant="outline" size="sm">
            View reports
          </Button>
        </Link>
      </div>
    </div>
  );
}
