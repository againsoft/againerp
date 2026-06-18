"use client";

import type { PartnerTierDefinition } from "@/lib/mock-data/business-partner-tiers";
import { TierDetailContent } from "@/components/partners/tier-detail-content";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: PartnerTierDefinition | null;
  onEdit?: (tier: PartnerTierDefinition) => void;
};

export function TierViewDialog({ open, onOpenChange, tier, onEdit }: Props) {
  if (!tier) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
        aria-describedby={undefined}
      >
        <p className="sr-only">Tier · {tier.code}</p>
        <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
          <TierDetailContent
            tier={tier}
            inDialog
            onEdit={onEdit}
            onClose={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
