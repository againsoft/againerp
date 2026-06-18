"use client";

import Link from "next/link";
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
import { Sparkles } from "lucide-react";
import { DashboardWidget } from "@/components/hr/dashboard/dashboard-widget";
import { Badge } from "@/components/ui/badge";
import {
  APPROVAL_AI_RECOMMENDATIONS,
  APPROVAL_CENTER_AS_OF,
  APPROVAL_DASHBOARD_KPIS,
  APPROVAL_ESCALATION_TREND,
  APPROVAL_PRIORITY_QUEUE,
  APPROVAL_TREND_DATA,
  APPROVAL_VOLUME_BY_MODULE,
  getApprovalById,
} from "@/lib/mock-data/approval-center";
import { cn } from "@/lib/utils";

/** SCR-COR-APR-001 — Approval Dashboard zones A–E */
export function ApprovalDashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="page-title">Approval Dashboard</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">As of {APPROVAL_CENTER_AS_OF}</p>
      </div>

      {/* ZONE B — KPIs */}
      <section aria-label="Approval KPIs">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {APPROVAL_DASHBOARD_KPIS.map((kpi) => (
            <Link
              key={kpi.id}
              href={kpi.href}
              className="rounded-lg border border-input bg-card px-4 py-3 transition-colors hover:border-primary/30 hover:bg-accent/30"
            >
              <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{kpi.value}</p>
              {kpi.trend ? <p className="mt-1 text-[11px] text-muted-foreground">{kpi.trend}</p> : null}
            </Link>
          ))}
        </div>
      </section>

      {/* ZONE C + D */}
      <div className="grid gap-4 lg:grid-cols-12">
        <section aria-label="Approval analytics" className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          <DashboardWidget
            id="WGT-APR-CHT-001"
            title="Approval Trends"
            footerHref="/inbox/approvals?status=pending"
            className="min-h-[260px] sm:col-span-2"
          >
            <div className="h-48 w-full min-h-[192px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={APPROVAL_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} width={32} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="submitted" name="Submitted" stroke="#6366f1" strokeWidth={2} />
                  <Line type="monotone" dataKey="approved" name="Approved" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="rejected" name="Rejected" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DashboardWidget>

          <DashboardWidget id="WGT-APR-CHT-004" title="Escalation Trends" className="min-h-[260px]">
            <div className="h-48 w-full min-h-[192px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={APPROVAL_ESCALATION_TREND}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} width={28} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="escalated" name="Escalated" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardWidget>

          <DashboardWidget id="WGT-APR-CHT-002" title="Approval Volume" className="min-h-[260px]">
            <div className="h-48 w-full min-h-[192px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={APPROVAL_VOLUME_BY_MODULE} dataKey="count" nameKey="module" innerRadius={44} outerRadius={68} paddingAngle={2}>
                    {APPROVAL_VOLUME_BY_MODULE.map((e) => (
                      <Cell key={e.module} fill={e.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </DashboardWidget>
        </section>

        {/* ZONE D — Priority queue */}
        <DashboardWidget
          id="WGT-APR-QUEUE"
          title="Priority Queue"
          className="lg:col-span-4"
          footerHref="/inbox/approvals?status=pending"
          footerLabel="View all pending"
        >
          <div className="space-y-3">
            {(["critical", "high", "medium", "low"] as const).map((priority) => {
              const ids = APPROVAL_PRIORITY_QUEUE[priority];
              return (
                <div key={priority}>
                  <p className={cn("mb-1 text-[10px] font-semibold uppercase tracking-wide", priorityColors(priority))}>
                    {priority}
                  </p>
                  <ul className="space-y-1">
                    {ids.map((id) => {
                      const item = getApprovalById(id);
                      if (!item) return null;
                      return (
                        <li key={id}>
                          <Link
                            href={`/inbox/approvals?view=${id}`}
                            className={cn(
                              "block rounded-md border px-2 py-1.5 text-xs hover:bg-muted/50",
                              priority === "critical" && "border-red-200 dark:border-red-900",
                              priority === "high" && "border-amber-200 dark:border-amber-900",
                            )}
                          >
                            <span className="font-mono text-[10px] text-muted-foreground">{item.requestId}</span>
                            <p className="font-medium">{item.requestType}</p>
                            <p className="text-[10px] text-muted-foreground">{item.requester}</p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </DashboardWidget>
      </div>

      {/* ZONE E — AI recommendations */}
      <section aria-label="AI recommendations">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
          <h2 className="text-sm font-semibold">AI Recommendations</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {APPROVAL_AI_RECOMMENDATIONS.map((rec) => (
            <div
              key={rec.id}
              className={cn(
                "rounded-lg border p-4",
                rec.severity === "critical" && "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20",
                rec.severity === "warning" && "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30",
                rec.severity === "info" && "border-violet-200 bg-violet-50/50 dark:border-violet-900 dark:bg-violet-950/20",
              )}
            >
              <Badge variant="outline" className="text-[9px] capitalize">
                {rec.severity}
              </Badge>
              <p className="mt-2 text-sm font-semibold">{rec.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{rec.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function priorityColors(priority: "critical" | "high" | "medium" | "low") {
  switch (priority) {
    case "critical":
      return "text-red-600";
    case "high":
      return "text-amber-600";
    case "medium":
      return "text-muted-foreground";
    default:
      return "text-muted-foreground/70";
  }
}
