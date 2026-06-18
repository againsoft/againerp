"use client";

import type { SmwCampaign } from "@/lib/mock-data/smw-campaigns";
import { computeCampaignMetrics, formatCampaignCurrency } from "@/lib/mock-data/smw-campaigns";

type Props = { campaigns: SmwCampaign[] };

export function CampaignKpiStrip({ campaigns }: Props) {
  const { activeCount, totalBudget, totalSpent, totalLeads, avgRoi } = computeCampaignMetrics(campaigns);

  return (
    <section aria-label="Campaign KPIs" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <Kpi label="Active campaigns" value={String(activeCount)} />
      <Kpi label="Total budget" value={formatCampaignCurrency(totalBudget)} />
      <Kpi label="Spent MTD" value={formatCampaignCurrency(totalSpent)} />
      <Kpi label="Leads generated" value={String(totalLeads)} />
      <Kpi label="Avg ROI" value={avgRoi > 0 ? `${avgRoi}%` : "—"} highlight />
    </section>
  );
}

function Kpi({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-input bg-card px-3 py-2.5">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={highlight ? "text-lg font-semibold tabular-nums text-emerald-700 dark:text-emerald-300" : "text-lg font-semibold tabular-nums"}>
        {value}
      </p>
    </div>
  );
}
