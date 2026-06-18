"use client";

import Link from "next/link";
import type { SmwLead } from "@/lib/mock-data/smw-leads";
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  formatLeadCurrency,
} from "@/lib/mock-data/smw-leads";
import type { LeadProfileData } from "@/lib/mock-data/smw-lead-profile";
import type { LeadProfileTab } from "@/lib/mock-data/smw-leads";
import { Badge } from "@/components/ui/badge";

type Props = {
  tab: LeadProfileTab;
  lead: SmwLead;
  profile: LeadProfileData;
};

export function LeadProfileTabContent({ tab, lead, profile }: Props) {
  if (tab === "overview") {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <section>
          <h2 className="text-sm font-semibold">Contact details</h2>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Name</dt>
              <dd className="font-medium">{lead.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Company</dt>
              <dd className="font-medium">{lead.company}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Email</dt>
              <dd>{lead.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Phone</dt>
              <dd>{lead.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Source</dt>
              <dd>{LEAD_SOURCE_LABELS[lead.source]}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Status</dt>
              <dd>{LEAD_STATUS_LABELS[lead.status]}</dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="text-sm font-semibold">Scoring & value</h2>
          <p className="mt-2 text-sm">
            Score <strong className="tabular-nums">{lead.score}</strong> · Expected{" "}
            <strong className="tabular-nums">{formatLeadCurrency(lead.expectedValue)}</strong>
          </p>
          {lead.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {lead.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {lead.notes && <p className="mt-3 rounded-md bg-muted/40 p-3 text-sm text-muted-foreground">{lead.notes}</p>}
        </section>

        {profile.relatedOpportunityId && (
          <section>
            <h2 className="text-sm font-semibold">Related opportunity</h2>
            <Link
              href={`/sales-marketing/opportunities?view=${profile.relatedOpportunityId}`}
              className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
            >
              {profile.relatedOpportunityName}
            </Link>
          </section>
        )}
      </div>
    );
  }

  if (tab === "activity") {
    return (
      <ul className="mx-auto max-w-3xl space-y-3">
        {profile.activities.map((item) => (
          <li key={item.id} className="rounded-lg border border-input bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.meta}</p>
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground">{item.time}</span>
            </div>
            <Badge variant="secondary" className="mt-2 text-[10px] capitalize">
              {item.type}
            </Badge>
          </li>
        ))}
      </ul>
    );
  }

  if (tab === "documents") {
    return (
      <div className="mx-auto max-w-3xl rounded-lg border border-dashed border-input p-8 text-center">
        <p className="text-sm font-medium">No documents attached</p>
        <p className="mt-1 text-xs text-muted-foreground">Upload proposals, contracts, and notes here in a later step.</p>
      </div>
    );
  }

  return (
    <ul className="mx-auto max-w-3xl space-y-2">
      {profile.history.map((item) => (
        <li key={item.id} className="rounded-md border border-input px-3 py-2 text-sm">
          <span className="font-medium">{item.field}</span> changed from{" "}
          <span className="text-muted-foreground">{item.oldValue}</span> to{" "}
          <span className="font-medium">{item.newValue}</span>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {item.user} · {item.time}
          </p>
        </li>
      ))}
    </ul>
  );
}
