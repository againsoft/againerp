"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { EnterpriseAiInsightCard } from "@/components/enterprise/cards";
import type { SmwLead } from "@/lib/mock-data/smw-leads";
import { LEAD_SOURCE_LABELS } from "@/lib/mock-data/smw-leads";

const SOURCE_PERFORMANCE = [
  { source: "linkedin", leads: 24, conversion: "18%" },
  { source: "referral", leads: 12, conversion: "33%" },
  { source: "website", leads: 31, conversion: "12%" },
  { source: "email_campaign", leads: 19, conversion: "15%" },
];

type Props = {
  leads: SmwLead[];
  className?: string;
};

export function LeadInsightsRail({ leads, className }: Props) {
  const hotCount = leads.filter((l) => l.score >= 80).length;
  const avgScore =
    leads.length > 0 ? Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length) : 0;
  const noActivity = leads.filter((l) => l.lastActivityRelative.includes("d ago") || l.lastActivityRelative.includes("w")).length;

  return (
    <aside className={className} aria-label="Lead insights">
      <div className="space-y-4 rounded-lg border border-input bg-card p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
          <h2 className="text-sm font-semibold">Insights</h2>
        </div>

        <EnterpriseAiInsightCard
          id="rail-ai-1"
          title={`${hotCount} hot leads in view`}
          summary={`Average score ${avgScore}. ${noActivity} leads may need follow-up.`}
          confidence="high"
          severity="info"
          href="/sales-marketing/leads?savedView=hot"
          size="sm"
          compact
        />

        <div>
          <h3 className="text-xs font-semibold">Source performance</h3>
          <ul className="mt-2 space-y-2">
            {SOURCE_PERFORMANCE.map((row) => (
              <li key={row.source} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {LEAD_SOURCE_LABELS[row.source as keyof typeof LEAD_SOURCE_LABELS]}
                </span>
                <span className="tabular-nums">
                  {row.leads} · <span className="font-medium text-emerald-600">{row.conversion}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold">Lead quality</h3>
          <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md bg-muted/40 p-2">
              <dt className="text-muted-foreground">MQL rate</dt>
              <dd className="text-lg font-semibold tabular-nums">38%</dd>
            </div>
            <div className="rounded-md bg-muted/40 p-2">
              <dt className="text-muted-foreground">Avg score</dt>
              <dd className="text-lg font-semibold tabular-nums">{avgScore}</dd>
            </div>
          </dl>
        </div>

        <Link
          href="/sales-marketing/ai"
          className="block text-center text-xs font-medium text-primary hover:underline"
        >
          Open AI copilot →
        </Link>
      </div>
    </aside>
  );
}
