"use client";

import type { PartnerTerritoryAssignment } from "@/lib/mock-data/business-partner-territories";
import { TerritoryDetailContent } from "@/components/partners/territory-detail-content";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  territory: PartnerTerritoryAssignment | null;
};

export function TerritoryViewDialog({ open, onOpenChange, territory }: Props) {
  if (!territory) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
        aria-describedby={undefined}
      >
        <p className="sr-only">Territory · {territory.region}</p>
        <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
          <TerritoryDetailContent territory={territory} inDialog onClose={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
