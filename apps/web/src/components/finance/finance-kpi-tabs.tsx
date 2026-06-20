"use client";

import { cn } from "@/lib/utils";

type Kpi = { label: string; value: string; sub?: string; alert?: boolean };

export function FinanceKpiRow({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="rounded-xl border border-input bg-card p-3">
          <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
          <p className={cn("mt-0.5 text-lg font-semibold tabular-nums", kpi.alert && "text-amber-600")}>{kpi.value}</p>
          {kpi.sub && <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.sub}</p>}
        </div>
      ))}
    </div>
  );
}

export function FinanceStatusTabs({
  tabs,
  active,
  onChange,
  counts,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  counts?: Record<string, number>;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
            active === tab.id
              ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300"
              : "border-input bg-card text-muted-foreground hover:bg-muted/50"
          )}
        >
          {tab.label}
          {counts?.[tab.id] !== undefined && (
            <span className="ml-1 opacity-70">({counts[tab.id]})</span>
          )}
        </button>
      ))}
    </div>
  );
}
