"use client";

import type { SmwTarget } from "@/lib/mock-data/smw-targets";
import { computeTargetMetrics, formatTargetCurrency } from "@/lib/mock-data/smw-targets";

type Props = { targets: SmwTarget[] };

export function TargetKpiStrip({ targets }: Props) {
  const { activeCount, achievedCount, avgAchievementPct, atRiskCount, revenueGap } =
    computeTargetMetrics(targets);

  return (
    <section aria-label="Target KPIs" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <Kpi label="Active targets" value={String(activeCount)} />
      <Kpi label="Avg achievement" value={`${avgAchievementPct}%`} highlight={avgAchievementPct >= 70} />
      <Kpi label="Achieved" value={String(achievedCount)} />
      <Kpi label="At risk" value={String(atRiskCount)} danger={atRiskCount > 0} />
      <Kpi label="Revenue gap" value={formatTargetCurrency(revenueGap)} />
    </section>
  );
}

function Kpi({
  label,
  value,
  highlight,
  danger,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="rounded-lg border border-input bg-card px-3 py-2.5">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p
        className={
          danger
            ? "text-lg font-semibold tabular-nums text-red-600 dark:text-red-400"
            : highlight
              ? "text-lg font-semibold tabular-nums text-emerald-700 dark:text-emerald-300"
              : "text-lg font-semibold tabular-nums"
        }
      >
        {value}
      </p>
    </div>
  );
}
