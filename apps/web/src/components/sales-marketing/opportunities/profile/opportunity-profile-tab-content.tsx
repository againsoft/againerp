"use client";

import Link from "next/link";
import type { SmwOpportunity } from "@/lib/mock-data/smw-opportunities";
import { STAGE_LABELS, formatOppCurrency } from "@/lib/mock-data/smw-opportunities";
import type { OpportunityProfileData } from "@/lib/mock-data/smw-opportunity-profile";
import type { OpportunityProfileTab } from "@/lib/mock-data/smw-opportunities";
import { Badge } from "@/components/ui/badge";

type Props = {
  tab: OpportunityProfileTab;
  opportunity: SmwOpportunity;
  profile: OpportunityProfileData;
};

export function OpportunityProfileTabContent({ tab, opportunity, profile }: Props) {
  if (tab === "overview") {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <section>
          <h2 className="text-sm font-semibold">Deal summary</h2>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
            <div><dt className="text-xs text-muted-foreground">Stage</dt><dd>{STAGE_LABELS[opportunity.stage]}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Probability</dt><dd>{opportunity.probability}%</dd></div>
            <div><dt className="text-xs text-muted-foreground">Amount</dt><dd className="tabular-nums">{formatOppCurrency(opportunity.amount)}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Close date</dt><dd>{opportunity.expectedCloseDate}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Owner</dt><dd>{opportunity.ownerName}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Territory</dt><dd>{opportunity.territoryName}</dd></div>
          </dl>
        </section>
        {opportunity.notes && (
          <p className="rounded-md bg-muted/40 p-3 text-sm text-muted-foreground">{opportunity.notes}</p>
        )}
      </div>
    );
  }

  if (tab === "products") {
    return (
      <div className="mx-auto max-w-3xl overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              <th className="pb-2 font-medium">Product</th>
              <th className="pb-2 font-medium text-right">Qty</th>
              <th className="pb-2 font-medium text-right">Unit</th>
              <th className="pb-2 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {profile.products.map((p) => (
              <tr key={p.id} className="border-b border-border/50">
                <td className="py-2">{p.name}</td>
                <td className="py-2 text-right tabular-nums">{p.qty}</td>
                <td className="py-2 text-right tabular-nums">{formatOppCurrency(p.unitPrice)}</td>
                <td className="py-2 text-right tabular-nums">{formatOppCurrency(p.qty * p.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (tab === "quotations") {
    return (
      <ul className="mx-auto max-w-3xl space-y-3">
        {profile.quotations.map((q) => (
          <li key={q.id} className="flex items-center justify-between rounded-lg border border-input p-4">
            <div>
              <p className="font-mono text-sm font-medium">{q.number}</p>
              <p className="text-xs text-muted-foreground">{q.amount} · {q.status}</p>
            </div>
            <Link href={q.href} className="text-xs font-medium text-primary hover:underline">Open →</Link>
          </li>
        ))}
      </ul>
    );
  }

  if (tab === "activity") {
    return (
      <ul className="mx-auto max-w-3xl space-y-3">
        {profile.activities.map((item) => (
          <li key={item.id} className="rounded-lg border border-input p-4">
            <div className="flex justify-between gap-2">
              <p className="text-sm font-medium">{item.title}</p>
              <span className="text-[10px] text-muted-foreground">{item.time}</span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{item.meta}</p>
            <Badge variant="secondary" className="mt-2 text-[10px] capitalize">{item.type}</Badge>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-dashed border-input p-8 text-center">
      <p className="text-sm font-medium">No documents attached</p>
      <p className="mt-1 text-xs text-muted-foreground">Proposals and contracts will attach here in a later step.</p>
    </div>
  );
}
