"use client";

import type { SmwActivity } from "@/lib/mock-data/smw-activities";
import { computeActivityMetrics } from "@/lib/mock-data/smw-activities";

type Props = { activities: SmwActivity[] };

export function ActivityKpiStrip({ activities }: Props) {
  const { openCount, dueTodayCount, overdueCount, completedCount } = computeActivityMetrics(activities);

  return (
    <section aria-label="Activity KPIs" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Kpi label="Open activities" value={String(openCount)} />
      <Kpi label="Due today" value={String(dueTodayCount)} highlight={dueTodayCount > 0} />
      <Kpi label="Overdue" value={String(overdueCount)} danger={overdueCount > 0} />
      <Kpi label="Completed" value={String(completedCount)} />
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
              ? "text-lg font-semibold tabular-nums text-amber-700 dark:text-amber-300"
              : "text-lg font-semibold tabular-nums"
        }
      >
        {value}
      </p>
    </div>
  );
}
