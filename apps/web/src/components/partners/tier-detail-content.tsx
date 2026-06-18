"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Pencil, X } from "lucide-react";
import {
  TIER_TYPE_LABELS,
  type PartnerTierDefinition,
} from "@/lib/mock-data/business-partner-tiers";
import { useBusinessPartnerStore } from "@/lib/store/business-partner-store";
import {
  tierTypeBadgeVariant,
  useBusinessPartnerTierStore,
} from "@/lib/store/business-partner-tier-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  tier: PartnerTierDefinition;
  inDialog?: boolean;
  onEdit?: (tier: PartnerTierDefinition) => void;
  onClose?: () => void;
};

export function TierDetailContent({ tier, inDialog, onEdit, onClose }: Props) {
  const live = useBusinessPartnerTierStore((s) => s.getById(tier.id)) ?? tier;
  const partners = useBusinessPartnerStore((s) => s.partners);

  const assignedPartners = useMemo(
    () => partners.filter((p) => p.tierCode === live.code),
    [partners, live.code],
  );

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", inDialog && "h-full")}>
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-2 border-b border-input pb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-mono text-base font-semibold">{live.code}</h2>
            <Badge variant={tierTypeBadgeVariant(live.tierType)} className="text-[10px] capitalize">
              {TIER_TYPE_LABELS[live.tierType]}
            </Badge>
            <Badge variant={live.active ? "success" : "muted"} className="text-[10px]">
              {live.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-sm font-medium">{live.name}</p>
          <p className="text-[11px] text-muted-foreground">
            {live.discountPercent}% off list · {live.priceListName}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => onEdit(live)}>
              <Pencil className="mr-1 h-3 w-3" /> Edit
            </Button>
          )}
          {onClose && (
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-3">
        <div className="space-y-4 text-xs">
          {live.description && (
            <p className="rounded-md border border-input bg-muted/30 px-3 py-2 text-muted-foreground">
              {live.description}
            </p>
          )}

          <dl className="grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Price list</dt>
              <dd className="font-mono">{live.priceListName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Discount</dt>
              <dd>{live.discountPercent}%</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Created</dt>
              <dd>{live.createdAt}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Partners assigned</dt>
              <dd>{assignedPartners.length}</dd>
            </div>
          </dl>

          <div>
            <h3 className="mb-2 text-sm font-semibold">Assigned partners</h3>
            {assignedPartners.length === 0 ? (
              <p className="text-muted-foreground">No partners on this tier yet.</p>
            ) : (
              <ul className="space-y-2">
                {assignedPartners.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between rounded-md border border-input px-3 py-2"
                  >
                    <div>
                      <Link
                        href={`/partners/directory?view=${p.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {p.name}
                      </Link>
                      <p className="font-mono text-[10px] text-muted-foreground">{p.partnerCode}</p>
                    </div>
                    <Badge variant="muted" className="text-[9px] capitalize">
                      {p.primaryRole.replace(/_/g, " ")}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
