"use client";

import Link from "next/link";
import type { SmwOpportunity } from "@/lib/mock-data/smw-opportunities";
import {
  STAGE_LABELS,
  formatOppCurrency,
  weightedAmount,
} from "@/lib/mock-data/smw-opportunities";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { EnterpriseRiskBadge } from "@/components/enterprise/badges/risk-badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ArrowRight, Pencil } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: SmwOpportunity | null;
  onEdit?: (opp: SmwOpportunity) => void;
};

function stageStatus(stage: SmwOpportunity["stage"]) {
  if (stage === "won") return "approved" as const;
  if (stage === "lost") return "rejected" as const;
  return "pending" as const;
}

export function OpportunityViewSheet({ open, onOpenChange, opportunity, onEdit }: Props) {
  if (!opportunity) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md gap-0 overflow-y-auto p-0 sm:max-w-md">
        <div className="flex flex-col gap-4 p-4">
          <div>
            <p className="font-mono text-[11px] text-muted-foreground">{opportunity.opportunityNumber}</p>
            <h2 className="text-lg font-semibold">{opportunity.title}</h2>
            <p className="text-sm text-muted-foreground">{opportunity.accountName}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <EnterpriseStatusBadge status={stageStatus(opportunity.stage)} label={STAGE_LABELS[opportunity.stage]} />
            {opportunity.atRisk && opportunity.riskLevel ? (
              <EnterpriseRiskBadge level={opportunity.riskLevel} size="sm" />
            ) : null}
          </div>
          <dl className="grid grid-cols-2 gap-3 text-xs">
            <div><dt className="text-muted-foreground">Amount</dt><dd className="font-medium tabular-nums">{formatOppCurrency(opportunity.amount)}</dd></div>
            <div><dt className="text-muted-foreground">Weighted</dt><dd className="font-medium tabular-nums">{formatOppCurrency(weightedAmount(opportunity))}</dd></div>
            <div><dt className="text-muted-foreground">Probability</dt><dd className="font-medium">{opportunity.probability}%</dd></div>
            <div><dt className="text-muted-foreground">Close</dt><dd className="font-medium">{opportunity.expectedCloseDate}</dd></div>
            <div><dt className="text-muted-foreground">Owner</dt><dd className="font-medium">{opportunity.ownerName}</dd></div>
            <div><dt className="text-muted-foreground">Territory</dt><dd className="font-medium">{opportunity.territoryName}</dd></div>
          </dl>
          <div className="flex gap-2 border-t pt-4">
            <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => onEdit?.(opportunity)}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Edit
            </Button>
          </div>
          <Button type="button" variant="secondary" size="sm" className="h-9 w-full" asChild>
            <Link href={`/sales-marketing/opportunities/${opportunity.id}`}>
              Open full deal <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
