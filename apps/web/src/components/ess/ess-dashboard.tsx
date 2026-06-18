"use client";

import Link from "next/link";
import {
  Banknote,
  Calendar,
  Clock,
  Download,
  Sparkles,
  Upload,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ESS_AI_INSIGHTS,
  ESS_DASHBOARD_KPIS,
  ESS_NOTIFICATIONS,
  ESS_PENDING_REQUESTS,
  ESS_QUICK_ACTIONS,
  ESS_RECENT_PAYSLIPS,
  ESS_UPCOMING_HOLIDAYS,
} from "@/lib/mock-data/ess-portal";
import { cn } from "@/lib/utils";

const ACTION_ICONS = {
  calendar: Calendar,
  clock: Clock,
  banknote: Banknote,
  wallet: Wallet,
  upload: Upload,
};

/** SCR-ESS-DSH-001 · DSH-ESS-001 */
export function EssDashboard() {
  return (
    <div className="space-y-5 pb-4">
      {/* ZONE B — KPIs */}
      <section aria-label="Quick KPIs" className="px-4">
        <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ESS_DASHBOARD_KPIS.map((kpi) => (
            <Link
              key={kpi.id}
              href={kpi.href}
              className="flex min-w-[140px] shrink-0 flex-col rounded-xl border border-input bg-card p-3 transition-colors hover:border-primary/30"
            >
              <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{kpi.value}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{kpi.hint}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ZONE C — Quick actions */}
      <section aria-label="Quick actions" className="px-4">
        <h2 className="mb-2 text-sm font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ESS_QUICK_ACTIONS.map((action) => {
            const Icon = ACTION_ICONS[action.icon];
            return (
              <Link
                key={action.id}
                href={action.href}
                className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-xl border border-input bg-card p-3 text-center transition-colors hover:border-primary/30 hover:bg-accent/30"
              >
                <Icon className="h-5 w-5 text-primary" aria-hidden />
                <span className="text-[11px] font-medium leading-tight">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Upcoming holidays */}
      <section aria-label="Upcoming holidays" className="px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Upcoming Holidays</h2>
        </div>
        <ul className="mt-2 space-y-2">
          {ESS_UPCOMING_HOLIDAYS.map((h) => (
            <li key={h.id} className="flex items-center justify-between rounded-lg border border-input px-3 py-2.5">
              <div>
                <p className="text-sm font-medium">{h.name}</p>
                <p className="text-[11px] text-muted-foreground">{h.type}</p>
              </div>
              <span className="text-xs font-medium tabular-nums text-muted-foreground">{h.date}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Pending requests */}
      <section aria-label="Pending requests" className="px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Pending Requests</h2>
          <Link href="/ess/requests?status=pending" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>
        <ul className="mt-2 space-y-2">
          {ESS_PENDING_REQUESTS.map((req) => (
            <li key={req.id}>
              <Link href={req.href} className="block rounded-lg border border-input px-3 py-2.5 hover:bg-muted/50">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[9px]">
                    {req.type}
                  </Badge>
                  <Badge variant="warning" className="text-[9px] capitalize">
                    {req.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm font-medium">{req.title}</p>
                <p className="text-[10px] text-muted-foreground">{req.submittedAt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Notifications */}
      <section aria-label="Notifications" className="px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Notifications</h2>
          <Link href="/ess/notifications" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>
        <ul className="mt-2 space-y-2">
          {ESS_NOTIFICATIONS.map((n) => (
            <li key={n.id}>
              <Link
                href={n.href}
                className={cn(
                  "block rounded-lg border px-3 py-2.5 hover:bg-muted/50",
                  n.unread ? "border-primary/20 bg-primary/5" : "border-input",
                )}
              >
                <div className="flex items-start gap-2">
                  {n.unread ? <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" aria-hidden /> : null}
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{n.time}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Recent payslips */}
      <section aria-label="Recent payslips" className="px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent Payslips</h2>
          <Link href="/ess/payslips" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>
        <ul className="mt-2 space-y-2">
          {ESS_RECENT_PAYSLIPS.map((ps) => (
            <li key={ps.id} className="flex items-center justify-between rounded-lg border border-input px-3 py-2.5">
              <div>
                <p className="text-sm font-medium">{ps.period}</p>
                <p className="text-[11px] text-muted-foreground">Paid {ps.payDate}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">{ps.netPay}</p>
                <Button variant="ghost" size="sm" className="mt-0.5 h-7 gap-1 text-[10px]" disabled>
                  <Download className="h-3 w-3" aria-hidden />
                  PDF
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* AI insights */}
      <section aria-label="AI insights" className="px-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
          <h2 className="text-sm font-semibold">AI Insights</h2>
        </div>
        <div className="space-y-2">
          {ESS_AI_INSIGHTS.map((insight) => (
            <div
              key={insight.id}
              className={cn(
                "rounded-xl border p-3",
                insight.severity === "warning"
                  ? "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30"
                  : "border-violet-200 bg-violet-50/50 dark:border-violet-900 dark:bg-violet-950/20",
              )}
            >
              <p className="text-sm font-medium">{insight.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{insight.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
