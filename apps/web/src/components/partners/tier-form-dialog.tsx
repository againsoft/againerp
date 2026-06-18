"use client";

import type { PartnerTierDefinition } from "@/lib/mock-data/business-partner-tiers";
import { TierForm } from "@/components/partners/tier-form";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  tier: PartnerTierDefinition | null;
  onSaved: (tier: PartnerTierDefinition) => void;
};

export function TierFormDialog({ open, onOpenChange, mode, tier, onSaved }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
        aria-describedby={undefined}
      >
        <p className="sr-only">{mode === "create" ? "New tier" : `Edit ${tier?.code}`}</p>
        <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
          <TierForm
            mode={mode}
            initialTier={tier}
            inDialog
            onClose={() => onOpenChange(false)}
            onSaved={(t) => onSaved(t)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
