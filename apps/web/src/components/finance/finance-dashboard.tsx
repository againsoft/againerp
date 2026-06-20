"use client";

import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  BookOpen,
  CreditCard,
  FileText,
  Landmark,
  Receipt,
  Scale,
  ScrollText,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import {
  apAgingBuckets,
  arAgingBuckets,
  bankAccountsSeed,
  financeDashboardKpis,
  formatBdt,
  plSnapshotData,
} from "@/lib/mock-data/finance";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FinancePeriodBanner } from "./finance-period-banner";

function ModuleCard({
  icon: Icon,
  label,
  href,
  metric,
  metricLabel,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  metric: string;
  metricLabel: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-input bg-card p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
        </div>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
      </div>
      <p className="mt-2 text-xs font-medium">{label}</p>
      <p className="text-lg font-semibold">{metric}</p>
      <p className="text-[10px] text-muted-foreground">{metricLabel}</p>
    </Link>
  );
}

export function FinanceDashboard() {
  const maxPl = Math.max(...plSnapshotData.flatMap((d) => [d.revenue, d.expense]));

  return (
    <div className="flex flex-col gap-4">
      <FinancePeriodBanner />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {financeDashboardKpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-input bg-card p-4">
            <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
            <p className="mt-1 text-2xl font-semibold">{kpi.value}</p>
            <p className={cn("mt-0.5 text-[10px]", kpi.up ? "text-emerald-600" : "text-muted-foreground")}>
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-input bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">P&amp;L Snapshot (MTD)</h3>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {plSnapshotData.map((d) => (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex items-end gap-0.5 h-24 w-full justify-center">
                  <div
                    className="w-2.5 rounded-t-sm bg-emerald-500"
                    style={{ height: `${(d.revenue / maxPl) * 96}px` }}
                  />
                  <div
                    className="w-2.5 rounded-t-sm bg-rose-400"
                    style={{ height: `${(d.expense / maxPl) * 96}px` }}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-emerald-500" /> Revenue</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-rose-400" /> Expense</span>
          </div>
        </div>

        <div className="rounded-xl border border-input bg-card p-4">
          <h3 className="text-sm font-medium mb-3">Bank Balances</h3>
          <div className="space-y-3">
            {bankAccountsSeed.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{b.bank}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{b.accountNo}</p>
                </div>
                <p className="text-sm font-semibold tabular-nums shrink-0">{formatBdt(b.glBalance)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-input bg-card p-4">
          <h3 className="text-sm font-medium mb-3">AR Aging</h3>
          <div className="space-y-2">
            {arAgingBuckets.map((b) => (
              <div key={b.bucket} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{b.bucket}</span>
                <span className="font-medium tabular-nums">{formatBdt(b.amount)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-input bg-card p-4">
          <h3 className="text-sm font-medium mb-3">AP Aging</h3>
          <div className="space-y-2">
            {apAgingBuckets.map((b) => (
              <div key={b.bucket} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{b.bucket}</span>
                <span className="font-medium tabular-nums">{formatBdt(b.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: BookOpen, label: "Chart of Accounts", href: "/finance/chart-of-accounts", metric: "14", metricLabel: "Active accounts" },
          { icon: FileText, label: "Journal Entries", href: "/finance/journals", metric: "12", metricLabel: "This month" },
          { icon: Receipt, label: "Invoices (AR)", href: "/finance/invoices", metric: formatBdt(5_420_000), metricLabel: "Outstanding" },
          { icon: CreditCard, label: "Bills (AP)", href: "/finance/bills", metric: formatBdt(3_180_000), metricLabel: "Outstanding" },
          { icon: Wallet, label: "Receipts", href: "/finance/receipts", metric: "2", metricLabel: "This week" },
          { icon: Banknote, label: "Payments", href: "/finance/payments", metric: "2", metricLabel: "This week" },
          { icon: Landmark, label: "Banking", href: "/finance/banking", metric: "3", metricLabel: "Accounts" },
          { icon: ScrollText, label: "Cheque Register", href: "/finance/cheques", metric: "10", metricLabel: "PDC active" },
          { icon: Scale, label: "Reports", href: "/finance/reports", metric: "8", metricLabel: "Available" },
        ].map((c) => (
          <ModuleCard key={c.href} {...c} />
        ))}
      </div>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <h3 className="text-sm font-medium">Finance AI Insights</h3>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          {[
            "Anomaly: INV/2026/0038 overdue 60+ days — ৳1.56M at risk",
            "Forecast: Cash runway 4.2 months at current burn",
            "Suggestion: Reconcile 5 unreconciled bank lines",
          ].map((t) => (
            <p key={t} className="rounded-lg border border-input bg-card p-3 text-xs text-muted-foreground">{t}</p>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: "Record Receipt", action: () => toast.success("Receipt recorded (prototype)") },
          { label: "Record Payment", action: () => toast.success("Payment recorded (prototype)") },
          { label: "New Journal Entry", action: () => toast.success("Journal entry created (prototype)") },
          { label: "Run P&L", action: () => toast.success("P&L report generated (prototype)") },
        ].map((a) => (
          <Button key={a.label} variant="outline" size="sm" onClick={a.action}>
            {a.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
