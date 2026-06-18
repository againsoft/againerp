"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  onTimeTrendChart,
  partnerPerformanceRows,
  performanceSummaryKpis,
  revenueByChannelChart,
  spendByVendorChart,
} from "@/lib/mock-data/business-partner-performance";
import { PARTNER_ROLE_LABELS, formatPartnerMoney } from "@/lib/mock-data/business-partners";
import { partnerRoleBadgeVariant } from "@/lib/store/business-partner-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PartnersNav } from "@/components/partners/partners-nav";

export function PartnersPerformanceCenter() {
  const kpis = [
    {
      label: "Vendor spend YTD",
      value: formatPartnerMoney(performanceSummaryKpis.totalSpendYtd),
      sub: "Purchase rollup",
    },
    {
      label: "Channel revenue YTD",
      value: formatPartnerMoney(performanceSummaryKpis.totalRevenueYtd),
      sub: "Sales rollup",
    },
    {
      label: "Avg on-time delivery",
      value: `${performanceSummaryKpis.avgOnTimePct}%`,
      sub: "Vendor role",
      alert: performanceSummaryKpis.avgOnTimePct < 90,
    },
    {
      label: "Active partners",
      value: String(performanceSummaryKpis.partnersActive),
      sub: `${performanceSummaryKpis.onCreditHold} on credit hold`,
      alert: performanceSummaryKpis.onCreditHold > 0,
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <PartnersNav />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-input bg-card px-4 py-3">
            <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
            <p className="text-2xl font-semibold">{kpi.value}</p>
            <p className={cn("text-[11px]", kpi.alert ? "text-amber-600" : "text-muted-foreground")}>
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-input bg-card p-4">
          <h2 className="mb-2 text-sm font-semibold">Top vendors by spend</h2>
          <div className="h-44 min-h-[176px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendByVendorChart} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `৳${v / 1e6}M`} />
                <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => `৳${Number(v).toLocaleString("en-BD")}`} />
                <Bar dataKey="spend" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-input bg-card p-4">
          <h2 className="mb-2 text-sm font-semibold">On-time delivery trend</h2>
          <div className="h-44 min-h-[176px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={onTimeTrendChart}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 10 }} unit="%" />
                <Tooltip formatter={(v) => `${v}%`} />
                <Line type="monotone" dataKey="otd" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-input bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold">Partner performance (Jun 2026)</h2>
        <div className="overflow-x-auto rounded-md border border-input">
          <table className="w-full min-w-[720px] text-xs">
            <thead className="border-b bg-muted/40 text-left text-[10px] text-muted-foreground">
              <tr>
                <th className="px-2 py-1.5">Partner</th>
                <th className="px-2 py-1.5">Role</th>
                <th className="px-2 py-1.5">Spend</th>
                <th className="px-2 py-1.5">Revenue</th>
                <th className="px-2 py-1.5">OTD %</th>
                <th className="px-2 py-1.5">Reject %</th>
                <th className="px-2 py-1.5">Open PO/SO</th>
              </tr>
            </thead>
            <tbody>
              {partnerPerformanceRows.slice(0, 12).map((row) => (
                <tr key={row.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-2 py-1.5">
                    <Link
                      href={`/partners/directory?view=${row.partnerId}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {row.partnerName}
                    </Link>
                    <p className="font-mono text-[10px] text-muted-foreground">{row.partnerCode}</p>
                  </td>
                  <td className="px-2 py-1.5">
                    <Badge variant={partnerRoleBadgeVariant(row.role)} className="text-[9px]">
                      {PARTNER_ROLE_LABELS[row.role]}
                    </Badge>
                  </td>
                  <td className="px-2 py-1.5">{row.spendTotal > 0 ? formatPartnerMoney(row.spendTotal) : "—"}</td>
                  <td className="px-2 py-1.5">
                    {row.revenueTotal > 0 ? formatPartnerMoney(row.revenueTotal) : "—"}
                  </td>
                  <td className="px-2 py-1.5">{row.onTimeDeliveryPct > 0 ? `${row.onTimeDeliveryPct.toFixed(0)}%` : "—"}</td>
                  <td className="px-2 py-1.5">{row.rejectRatePct > 0 ? `${row.rejectRatePct.toFixed(1)}%` : "—"}</td>
                  <td className="px-2 py-1.5">
                    {row.openPoCount}/{row.openSoCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {revenueByChannelChart.length > 0 && (
          <p className="mt-2 text-[10px] text-muted-foreground">
            Revenue chart includes {revenueByChannelChart.length} wholesale/retail partners (mock rollup from
            Purchase/Sales).
          </p>
        )}
      </div>
    </div>
  );
}
