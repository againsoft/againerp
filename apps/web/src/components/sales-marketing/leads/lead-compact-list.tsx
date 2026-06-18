"use client";

import type { SmwLead } from "@/lib/mock-data/smw-leads";
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  formatLeadCurrency,
  leadStatusToEnterprise,
} from "@/lib/mock-data/smw-leads";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { cn } from "@/lib/utils";

type Props = {
  leads: SmwLead[];
  onView: (lead: SmwLead) => void;
  className?: string;
};

export function LeadCompactList({ leads, onView, className }: Props) {
  return (
    <ul className={cn("divide-y rounded-lg border border-input", className)}>
      {leads.length === 0 ? (
        <li className="p-6 text-center text-sm text-muted-foreground">No leads match your filters.</li>
      ) : (
        leads.map((lead) => (
          <li key={lead.id}>
            <button
              type="button"
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onView(lead)}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{lead.name}</span>
                  <span className="text-[11px] text-muted-foreground">{lead.company}</span>
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {lead.leadNumber} · {LEAD_SOURCE_LABELS[lead.source]} · {lead.ownerName}
                </p>
              </div>
              <EnterpriseStatusBadge
                status={leadStatusToEnterprise(lead.status)}
                label={LEAD_STATUS_LABELS[lead.status]}
                size="sm"
              />
              <span className="hidden text-xs tabular-nums sm:inline">
                {formatLeadCurrency(lead.expectedValue)}
              </span>
              <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">{lead.score}</span>
            </button>
          </li>
        ))
      )}
    </ul>
  );
}
