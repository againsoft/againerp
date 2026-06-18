"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download } from "lucide-react";
import { toast } from "sonner";
import type { SmwReportDefinition } from "@/lib/mock-data/smw-reports";
import {
  SMW_REPORT_CAMPAIGN_KPIS,
  SMW_REPORT_CAMPAIGN_ROI,
  SMW_REPORT_FUNNEL_DATA,
  SMW_REPORT_PERFORMANCE_KPIS,
  SMW_REPORT_PIPELINE_BY_STAGE,
  SMW_REPORT_PIPELINE_SUMMARY,
  SMW_REPORT_QUOTATION_KPIS,
  SMW_REPORT_QUOTATION_TREND,
  SMW_REPORT_REP_PERFORMANCE,
  SMW_REPORT_REVENUE_KPIS,
  SMW_REPORT_REVENUE_TREND,
  SMW_REPORT_WIN_RATE_TREND,
  formatSmwCurrency,
} from "@/lib/mock-data/smw-reports";
import { Button } from "@/components/ui/button";

type Props = {
  report: SmwReportDefinition;
  periodLabel: string;
};

export function ReportDetailView({ report, periodLabel }: Props) {
  const exportReport = () => toast.info(`Export ${report.title} — prototype`);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">{report.title}</h2>
          <p className="text-xs text-muted-foreground">{report.description} · {periodLabel}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">Last run {report.lastRun}</p>
        </div>
        <Button type="button" variant="outline" size="sm" className="h-8 shrink-0" onClick={exportReport}>
          <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Export
        </Button>
      </div>

      {report.id === "revenue" && <RevenueReport />}
      {report.id === "performance" && <PerformanceReport />}
      {report.id === "pipeline" && <PipelineReport />}
      {report.id === "funnel" && <FunnelReport />}
      {report.id === "quotations" && <QuotationReport />}
      {report.id === "campaigns" && <CampaignReport />}
    </div>
  );
}

function KpiRow({ items }: { items: { label: string; value: string; delta: string }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((k) => (
        <div key={k.label} className="rounded-lg border border-input bg-card px-3 py-2.5">
          <p className="text-[10px] text-muted-foreground">{k.label}</p>
          <p className="text-lg font-semibold tabular-nums">{k.value}</p>
          <p className="text-[10px] text-muted-foreground">{k.delta}</p>
        </div>
      ))}
    </div>
  );
}

function ChartShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-input bg-card p-4">
      <h3 className="mb-3 text-xs font-medium">{title}</h3>
      <div className="h-[240px] w-full">{children}</div>
    </div>
  );
}

function RevenueReport() {
  return (
    <>
      <KpiRow items={SMW_REPORT_REVENUE_KPIS} />
      <ChartShell title="Revenue vs target & forecast (৳M)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={SMW_REPORT_REVENUE_TREND}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [`৳${Number(v ?? 0)}M`, ""]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} name="Revenue" />
            <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="4 4" name="Target" />
            <Line type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={2} name="Forecast" />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>
    </>
  );
}

function PerformanceReport() {
  return (
    <>
      <KpiRow items={SMW_REPORT_PERFORMANCE_KPIS} />
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartShell title="Win rate trend (%)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SMW_REPORT_WIN_RATE_TREND}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[20, 35]} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="winRate" stroke="#7c3aed" strokeWidth={2} name="Win rate" />
              <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="4 4" name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </ChartShell>
        <ChartShell title="Rep quota attainment (%)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SMW_REPORT_REP_PERFORMANCE} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="rep" width={60} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="quota" fill="#8b5cf6" name="Quota %" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartShell>
      </div>
    </>
  );
}

function PipelineReport() {
  const colors = SMW_REPORT_PIPELINE_SUMMARY.map((s) => s.fill);
  return (
    <>
      <ChartShell title="Weighted pipeline by stage">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SMW_REPORT_PIPELINE_SUMMARY}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatSmwCurrency(v)} />
            <Tooltip formatter={(v) => [formatSmwCurrency(Number(v ?? 0)), "Value"]} />
            <Bar dataKey="value" name="Weighted value" radius={[4, 4, 0, 0]}>
              {SMW_REPORT_PIPELINE_SUMMARY.map((entry, i) => (
                <Cell key={entry.stage} fill={colors[i] ?? "#8b5cf6"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>
      <ChartShell title="New vs existing by stage">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SMW_REPORT_PIPELINE_BY_STAGE}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="new" stackId="a" fill="#a78bfa" name="New" />
            <Bar dataKey="existing" stackId="a" fill="#5b21b6" name="Existing" />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>
    </>
  );
}

function FunnelReport() {
  const colors = SMW_REPORT_FUNNEL_DATA.map((s) => s.fill);
  return (
    <ChartShell title="Lead conversion funnel">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={SMW_REPORT_FUNNEL_DATA}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]}>
            {SMW_REPORT_FUNNEL_DATA.map((entry, i) => (
              <Cell key={entry.stage} fill={colors[i] ?? "#8b5cf6"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

function QuotationReport() {
  return (
    <>
      <KpiRow items={SMW_REPORT_QUOTATION_KPIS} />
      <ChartShell title="Quotes sent vs won">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SMW_REPORT_QUOTATION_TREND}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="sent" fill="#c4b5fd" name="Sent" radius={[4, 4, 0, 0]} />
            <Bar dataKey="won" fill="#6d28d9" name="Won" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>
    </>
  );
}

function CampaignReport() {
  return (
    <>
      <KpiRow items={SMW_REPORT_CAMPAIGN_KPIS} />
      <ChartShell title="ROI by channel (%)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SMW_REPORT_CAMPAIGN_ROI}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="channel" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="roi" fill="#7c3aed" name="ROI %" radius={[4, 4, 0, 0]} />
            <Bar dataKey="leads" fill="#a78bfa" name="Leads" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>
    </>
  );
}
