"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, RefreshCw, Sparkles } from "lucide-react";
import { DashboardWidget } from "@/components/hr/dashboard/dashboard-widget";
import { EnterpriseAiInsightCard, EnterpriseKpiCard } from "@/components/enterprise/cards";
import { EnterpriseTimelineCard } from "@/components/enterprise/cards/timeline-card";
import { Button } from "@/components/ui/button";
import {
  SMW_DASHBOARD_ACTIVITIES,
  SMW_DASHBOARD_AI_INSIGHTS,
  SMW_DASHBOARD_AS_OF,
  SMW_DASHBOARD_LEAD_FUNNEL,
  SMW_DASHBOARD_PERIODS,
  SMW_DASHBOARD_PIPELINE_BY_STAGE,
  SMW_DASHBOARD_PIPELINE_SUMMARY,
  SMW_DASHBOARD_QUICK_ACTIONS,
  SMW_DASHBOARD_REVENUE_TREND,
  SMW_DASHBOARD_TERRITORIES,
  SMW_DASHBOARD_VIEW_AS,
  formatSmwCurrency,
  getSmwDashboardKpis,
  getSmwLeaderboard,
  type SmwDashboardPeriod,
  type SmwDashboardViewAs,
} from "@/lib/mock-data/smw-dashboard";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

const selectClass =
  "h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** SCR-SMW-DSH-001 — Revenue Operations command center */
export function SmwDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toggleAiDrawer = useAppStore((s) => s.toggleAiDrawer);

  const period = (searchParams.get("period") as SmwDashboardPeriod) || "month";
  const territory = searchParams.get("territory") || "all";
  const viewAs = (searchParams.get("viewAs") as SmwDashboardViewAs) || "manager";

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" && key === "territory") {
        params.delete("territory");
      } else if (value === "month" && key === "period") {
        params.delete("period");
      } else if (value === "manager" && key === "viewAs") {
        params.delete("viewAs");
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      router.replace(qs ? `/sales-marketing/dashboard?${qs}` : "/sales-marketing/dashboard", {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  const kpis = useMemo(() => getSmwDashboardKpis(viewAs), [viewAs]);
  const leaderboard = useMemo(() => getSmwLeaderboard(viewAs), [viewAs]);

  const periodLabel =
    SMW_DASHBOARD_PERIODS.find((p) => p.id === period)?.label ?? "This month";
  const territoryLabel =
    SMW_DASHBOARD_TERRITORIES.find((t) => t.id === territory)?.label ?? "All territories";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {/* ZONE A — Header */}
      <section aria-label="Dashboard header" className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="page-title">Revenue dashboard</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              As of {SMW_DASHBOARD_AS_OF} · {periodLabel} · {territoryLabel}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Period filter"
              className={selectClass}
              value={period}
              onChange={(e) => setParam("period", e.target.value)}
            >
              {SMW_DASHBOARD_PERIODS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <select
              aria-label="Territory filter"
              className={cn(selectClass, "max-w-[10rem]")}
              value={territory}
              onChange={(e) => setParam("territory", e.target.value)}
            >
              {SMW_DASHBOARD_TERRITORIES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              aria-label="View as role"
              className={cn(selectClass, "max-w-[9rem]")}
              value={viewAs}
              onChange={(e) => setParam("viewAs", e.target.value)}
            >
              {SMW_DASHBOARD_VIEW_AS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
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
              aria-label="Open AI copilot"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-500" aria-hidden />
              <span className="hidden sm:inline">Ask AI</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ZONE B — KPI strip */}
      <section aria-label="Key performance indicators">
        <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-4 xl:grid-cols-8 lg:overflow-visible lg:snap-none">
          {kpis.map((kpi) => (
            <EnterpriseKpiCard
              key={kpi.id}
              {...kpi}
              size="sm"
              className="min-w-[9.5rem] shrink-0 snap-start lg:min-w-0"
            />
          ))}
        </div>
      </section>

      {/* ZONE C — Funnel + pipeline summary */}
      <div className="grid gap-4 lg:grid-cols-12">
        <DashboardWidget
          id="CHT-SMW-001"
          title="Lead funnel"
          footerHref="/sales-marketing/leads"
          footerLabel="View leads"
          className="min-h-[280px] lg:col-span-8"
        >
          <div className="h-52 w-full min-h-[208px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SMW_DASHBOARD_LEAD_FUNNEL} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="stage" width={72} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]}>
                  {SMW_DASHBOARD_LEAD_FUNNEL.map((entry) => (
                    <Cell key={entry.stage} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardWidget>

        <DashboardWidget
          id="WGT-SMW-PIPE-SUM"
          title="Pipeline by stage"
          footerHref="/sales-marketing/opportunities"
          footerLabel="Open pipeline"
          className="min-h-[280px] lg:col-span-4"
        >
          <ul className="space-y-2.5">
            {SMW_DASHBOARD_PIPELINE_SUMMARY.map((stage) => (
              <li key={stage.stage}>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-medium">{stage.stage}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {stage.count} deals · {formatSmwCurrency(stage.value)}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (stage.value / 1980000) * 100)}%`,
                      backgroundColor: stage.fill,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SMW_DASHBOARD_PIPELINE_BY_STAGE}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="stage" tick={{ fontSize: 9 }} interval={0} angle={-20} textAnchor="end" height={48} />
                <YAxis tick={{ fontSize: 10 }} width={28} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="new" name="New" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="existing" name="Existing" stackId="a" fill="#c4b5fd" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardWidget>
      </div>

      {/* ZONE D + E — Revenue trend + AI insights */}
      <div className="grid gap-4 lg:grid-cols-12">
        <DashboardWidget
          id="CHT-SMW-002"
          title="Revenue trend"
          footerHref="/sales-marketing/reports?report=revenue"
          footerLabel="Revenue report"
          className="min-h-[300px] lg:col-span-7"
        >
          <div className="h-56 w-full min-h-[224px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SMW_DASHBOARD_REVENUE_TREND}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} width={36} unit="M" />
                <Tooltip formatter={(v) => [`৳${Number(v ?? 0)}M`, ""]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Actual"
                  stroke="#7c3aed"
                  fill="#7c3aed"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Line type="monotone" dataKey="target" name="Target" stroke="#94a3b8" strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#10b981" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardWidget>

        <DashboardWidget
          id="WGT-SMW-AI"
          title="AI insights"
          footerHref="/sales-marketing/ai"
          footerLabel="Open copilot"
          className="lg:col-span-5"
        >
          <div className="space-y-3">
            {SMW_DASHBOARD_AI_INSIGHTS.map((insight) => (
              <EnterpriseAiInsightCard key={insight.id} {...insight} size="sm" compact />
            ))}
          </div>
        </DashboardWidget>
      </div>

      {/* ZONE F — Leaderboard + activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardWidget
          id="WGT-SMW-LB"
          title={viewAs === "rep" ? "Team ranking" : "Rep leaderboard"}
          footerHref="/sales-marketing/teams"
          footerLabel="View teams"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-xs">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="pb-2 pr-3 font-medium">Rep</th>
                  <th className="pb-2 pr-3 font-medium text-right">Quota</th>
                  <th className="pb-2 pr-3 font-medium text-right">Achieved</th>
                  <th className="pb-2 font-medium text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((row) => (
                  <tr key={row.id} className="border-b border-border/50 last:border-0">
                    <td className="py-2 pr-3">
                      <Link
                        href={row.href}
                        className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {row.rep}
                      </Link>
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums">{row.quota}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{row.achieved}</td>
                    <td className="py-2 text-right">
                      <span
                        className={cn(
                          "inline-flex min-w-[2.5rem] justify-end rounded px-1.5 py-0.5 tabular-nums font-medium",
                          row.percent >= 90 && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
                          row.percent >= 75 && row.percent < 90 && "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
                          row.percent < 75 && "bg-muted text-muted-foreground",
                        )}
                      >
                        {row.percent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardWidget>

        <DashboardWidget
          id="WGT-SMW-ACT"
          title="Recent activity"
          footerHref="/sales-marketing/activities"
          footerLabel="View timeline"
        >
          <ul className="space-y-2">
            {SMW_DASHBOARD_ACTIVITIES.map((event) => (
              <li key={event.id}>
                <EnterpriseTimelineCard {...event} size="sm" compact className="border-0 bg-transparent p-2 shadow-none" />
              </li>
            ))}
          </ul>
        </DashboardWidget>
      </div>

      {/* ZONE G — Quick actions */}
      <section aria-label="Quick actions" className="border-t pt-4">
        <h2 className="mb-2 text-sm font-semibold">Quick actions</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SMW_DASHBOARD_QUICK_ACTIONS.map((action) => (
            <Button key={action.id} variant="secondary" size="sm" className="h-9 shrink-0" asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
