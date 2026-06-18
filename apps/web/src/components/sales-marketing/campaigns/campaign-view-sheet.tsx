"use client";

import Link from "next/link";
import type { SmwCampaign } from "@/lib/mock-data/smw-campaigns";
import {
  CAMPAIGN_CHANNEL_LABELS,
  CAMPAIGN_STATUS_LABELS,
  budgetUtilization,
  campaignStatusToEnterprise,
  formatCampaignCurrency,
} from "@/lib/mock-data/smw-campaigns";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Pencil, UserPlus } from "lucide-react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: SmwCampaign | null;
  onEdit?: (c: SmwCampaign) => void;
};

export function CampaignViewSheet({ open, onOpenChange, campaign, onEdit }: Props) {
  if (!campaign) return null;

  const util = budgetUtilization(campaign);
  const conversionRate =
    campaign.leadsGenerated > 0 ? Math.round((campaign.conversions / campaign.leadsGenerated) * 100) : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md gap-0 overflow-y-auto p-0 sm:max-w-md">
        <div className="flex flex-col gap-4 p-4">
          <div>
            <p className="font-mono text-[11px] text-muted-foreground">{campaign.campaignNumber}</p>
            <h2 className="text-lg font-semibold">{campaign.name}</h2>
            <p className="text-xs text-muted-foreground">{CAMPAIGN_CHANNEL_LABELS[campaign.channel]}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <EnterpriseStatusBadge
              status={campaignStatusToEnterprise(campaign.status)}
              label={CAMPAIGN_STATUS_LABELS[campaign.status]}
            />
            {campaign.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
            ))}
          </div>
          {campaign.description && <p className="text-xs text-muted-foreground">{campaign.description}</p>}

          <dl className="grid grid-cols-2 gap-3 text-xs">
            <div><dt className="text-muted-foreground">Budget</dt><dd className="font-medium tabular-nums">{formatCampaignCurrency(campaign.budget)}</dd></div>
            <div><dt className="text-muted-foreground">Spent ({util}%)</dt><dd className="font-medium tabular-nums">{formatCampaignCurrency(campaign.spent)}</dd></div>
            <div><dt className="text-muted-foreground">Leads</dt><dd className="font-medium tabular-nums">{campaign.leadsGenerated}</dd></div>
            <div><dt className="text-muted-foreground">Conversions</dt><dd className="font-medium tabular-nums">{campaign.conversions} ({conversionRate}%)</dd></div>
            <div><dt className="text-muted-foreground">ROI</dt><dd className="font-semibold tabular-nums text-emerald-600">{campaign.roiPct > 0 ? `${campaign.roiPct}%` : "—"}</dd></div>
            <div><dt className="text-muted-foreground">Owner</dt><dd>{campaign.ownerName}</dd></div>
            <div className="col-span-2"><dt className="text-muted-foreground">Period</dt><dd>{campaign.startDate} → {campaign.endDate}</dd></div>
          </dl>

          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => onEdit?.(campaign)}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Edit
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-8" asChild>
              <Link href={`/sales-marketing/leads?source=${campaign.channel}`}>
                <UserPlus className="mr-1.5 h-3.5 w-3.5" aria-hidden /> View leads
              </Link>
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => toast.info("Performance report — prototype")}>
              Report
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
