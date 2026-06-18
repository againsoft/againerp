"use client";

import Link from "next/link";
import { X } from "lucide-react";
import {
  PARTNER_ROLE_LABELS,
} from "@/lib/mock-data/business-partners";
import type { PartnerTerritoryAssignment } from "@/lib/mock-data/business-partner-territories";
import { useBusinessPartnerTerritoryStore } from "@/lib/store/business-partner-territory-store";
import { partnerRoleBadgeVariant } from "@/lib/store/business-partner-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  territory: PartnerTerritoryAssignment;
  inDialog?: boolean;
  onClose?: () => void;
};

export function TerritoryDetailContent({ territory, inDialog, onClose }: Props) {
  const live = useBusinessPartnerTerritoryStore((s) => s.getById(territory.id)) ?? territory;

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", inDialog && "h-full")}>
      <div className="flex shrink-0 items-start justify-between border-b border-input pb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold">{live.region}</h2>
            <Badge variant={partnerRoleBadgeVariant(live.role)} className="text-[10px]">
              {PARTNER_ROLE_LABELS[live.role]}
            </Badge>
            {live.isExclusive && (
              <Badge variant="warning" className="text-[10px]">
                Exclusive
              </Badge>
            )}
          </div>
          <p className="text-sm">{live.partnerName}</p>
          <p className="font-mono text-[11px] text-muted-foreground">{live.partnerCode}</p>
        </div>
        {onClose && (
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <dl className="grid gap-3 py-3 text-xs sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Country</dt>
          <dd>
            {live.country} ({live.countryCode})
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">District</dt>
          <dd>{live.district ?? "—"}</dd>
        </div>
      </dl>

      {live.notes && (
        <p className="rounded-md border border-input bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          {live.notes}
        </p>
      )}

      <Button variant="outline" size="sm" className="mt-auto h-8 w-fit text-xs" asChild>
        <Link href={`/partners/directory?view=${live.partnerId}`}>Open partner</Link>
      </Button>
    </div>
  );
}
