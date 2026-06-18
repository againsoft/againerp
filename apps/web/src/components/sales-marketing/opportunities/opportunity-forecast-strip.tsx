"use client";

import { Sparkles } from "lucide-react";
import {
  computeForecastMetrics,
  formatOppCurrency,
  type SmwOpportunity,
} from "@/lib/mock-data/smw-opportunities";

type Props = {
  opportunities: SmwOpportunity[];
};

export function OpportunityForecastStrip({ opportunities }: Props) {
  const { weighted, commit, bestCase, aiAdjusted, count } = computeForecastMetrics(opportunities);

  return (
    <section
      aria-label="Forecast summary"
      className="flex flex-wrap items-center gap-4 rounded-lg border border-input bg-muted/20 px-4 py-3"
    >
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Open pipeline</p>
        <p className="text-lg font-semibold tabular-nums">{count} deals</p>
      </div>
      <Metric label="Weighted total" value={formatOppCurrency(weighted)} />
      <Metric label="Commit (≥70%)" value={formatOppCurrency(commit)} highlight />
      <Metric label="Best case" value={formatOppCurrency(bestCase)} />
      <div className="flex items-center gap-2 border-l border-border/60 pl-4">
        <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
        <div>
          <p className="text-[10px] text-muted-foreground">AI-adjusted</p>
          <p className="text-sm font-semibold tabular-nums text-violet-700 dark:text-violet-300">
            {formatOppCurrency(aiAdjusted)}
          </p>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={highlight ? "text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-300" : "text-sm font-semibold tabular-nums"}>
        {value}
      </p>
    </div>
  );
}
