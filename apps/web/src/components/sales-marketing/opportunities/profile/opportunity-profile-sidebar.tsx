"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { SmwOpportunity } from "@/lib/mock-data/smw-opportunities";
import { formatOppCurrency, weightedAmount } from "@/lib/mock-data/smw-opportunities";
import type { OpportunityProfileData } from "@/lib/mock-data/smw-opportunity-profile";
import { cn } from "@/lib/utils";

type Props = {
  opportunity: SmwOpportunity;
  profile: OpportunityProfileData;
  className?: string;
};

export function OpportunityProfileSidebar({ opportunity, profile, className }: Props) {
  return (
    <aside className={cn("w-full shrink-0 border-l bg-muted/10 xl:w-72", className)}>
      <div className="space-y-4 p-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Deal KPIs</h2>
          <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md border border-input bg-card p-2">
              <dt className="text-muted-foreground">Amount</dt>
              <dd className="font-semibold tabular-nums">{formatOppCurrency(opportunity.amount)}</dd>
            </div>
            <div className="rounded-md border border-input bg-card p-2">
              <dt className="text-muted-foreground">Weighted</dt>
              <dd className="font-semibold tabular-nums">{formatOppCurrency(weightedAmount(opportunity))}</dd>
            </div>
          </dl>
        </div>
        {opportunity.leadId && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Source lead</h2>
            <Link href={`/sales-marketing/leads/${opportunity.leadId}`} className="mt-1 block text-xs font-medium text-primary hover:underline">
              View lead →
            </Link>
          </div>
        )}
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-violet-500" aria-hidden />
            <h2 className="text-xs font-semibold">AI coaching</h2>
          </div>
          <p className="mt-2 rounded-md border border-violet-200 bg-violet-50/50 p-2 text-xs dark:border-violet-900 dark:bg-violet-950/20">
            {opportunity.atRisk
              ? "Deal at risk — schedule executive sponsor call before close date."
              : "On track — maintain weekly stakeholder touchpoints."}
          </p>
        </div>
        <div>
          <h2 className="text-xs font-semibold">Linked quotations</h2>
          <ul className="mt-2 space-y-1 text-xs">
            {profile.quotations.map((q) => (
              <li key={q.id}>
                <Link href={q.href} className="text-primary hover:underline">{q.number} · {q.amount}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
