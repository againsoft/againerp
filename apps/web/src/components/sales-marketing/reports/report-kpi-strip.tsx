"use client";

import type { SmwReportDefinition } from "@/lib/mock-data/smw-reports";
import { computeReportCatalogMetrics } from "@/lib/mock-data/smw-reports";

type Props = { reports: SmwReportDefinition[] };

export function ReportKpiStrip({ reports }: Props) {
  const { totalReports, featuredCount, scheduledCount, categories } = computeReportCatalogMetrics(reports);

  return (
    <section aria-label="Report catalog KPIs" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Kpi label="Available reports" value={String(totalReports)} />
      <Kpi label="Featured" value={String(featuredCount)} />
      <Kpi label="Scheduled" value={String(scheduledCount)} />
      <Kpi label="Categories" value={String(categories)} />
    </section>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-input bg-card px-3 py-2.5">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}
