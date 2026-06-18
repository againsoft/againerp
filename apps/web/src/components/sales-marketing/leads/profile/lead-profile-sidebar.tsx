"use client";

import { Sparkles } from "lucide-react";
import type { SmwLead } from "@/lib/mock-data/smw-leads";
import { formatLeadCurrency, leadScoreColor } from "@/lib/mock-data/smw-leads";
import type { LeadProfileData } from "@/lib/mock-data/smw-lead-profile";
import { cn } from "@/lib/utils";

type Props = {
  lead: SmwLead;
  profile: LeadProfileData;
  className?: string;
};

export function LeadProfileSidebar({ lead, profile, className }: Props) {
  return (
    <aside className={cn("w-full shrink-0 border-l bg-muted/10 xl:w-72", className)}>
      <div className="space-y-4 p-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mini KPIs</h2>
          <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md border border-input bg-card p-2">
              <dt className="text-muted-foreground">Score</dt>
              <dd className="text-lg font-semibold tabular-nums">{lead.score}</dd>
            </div>
            <div className="rounded-md border border-input bg-card p-2">
              <dt className="text-muted-foreground">Expected</dt>
              <dd className="text-sm font-semibold tabular-nums">{formatLeadCurrency(lead.expectedValue)}</dd>
            </div>
          </dl>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", leadScoreColor(lead.score))}
              style={{ width: `${lead.score}%` }}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact</h2>
          <ul className="mt-2 space-y-1 text-xs">
            <li>{lead.email}</li>
            <li>{lead.phone || "—"}</li>
            <li>{lead.ownerName}</li>
            <li>{lead.territoryName}</li>
          </ul>
        </div>

        {profile.relatedOpportunityName && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Related</h2>
            <p className="mt-1 text-xs font-medium">{profile.relatedOpportunityName}</p>
          </div>
        )}

        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-violet-500" aria-hidden />
            <h2 className="text-xs font-semibold">AI insights</h2>
          </div>
          <ul className="mt-2 space-y-2">
            {profile.aiInsights.map((insight) => (
              <li key={insight.id} className="rounded-md border border-violet-200 bg-violet-50/50 p-2 text-xs dark:border-violet-900 dark:bg-violet-950/20">
                <p className="font-medium text-violet-900 dark:text-violet-200">{insight.title}</p>
                <p className="mt-0.5 text-muted-foreground">{insight.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
