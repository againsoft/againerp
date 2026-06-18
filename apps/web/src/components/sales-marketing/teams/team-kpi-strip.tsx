"use client";

import type { SmwTeam, SmwTeamMember } from "@/lib/mock-data/smw-teams";
import { computeTeamMetrics, formatTeamCurrency } from "@/lib/mock-data/smw-teams";

type Props = { teams: SmwTeam[]; members: SmwTeamMember[] };

export function TeamKpiStrip({ teams, members }: Props) {
  const { teamCount, memberCount, avgAchievementPct, totalAchieved } = computeTeamMetrics(teams, members);

  return (
    <section aria-label="Team KPIs" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Kpi label="Active teams" value={String(teamCount)} />
      <Kpi label="Team members" value={String(memberCount)} />
      <Kpi label="Avg quota achievement" value={`${avgAchievementPct}%`} highlight={avgAchievementPct >= 70} />
      <Kpi label="Total achieved (Q2)" value={formatTeamCurrency(totalAchieved)} />
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
