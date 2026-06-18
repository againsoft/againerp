"use client";

import type { BusinessPartner } from "@/lib/mock-data/business-partners";
import { PartnerForm } from "@/components/partners/partner-form";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  partner: BusinessPartner | null;
  onSaved: (partner: BusinessPartner) => void;
};

export function PartnerFormDialog({ open, onOpenChange, mode, partner, onSaved }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
        aria-describedby={undefined}
      >
        <p className="sr-only">{mode === "create" ? "New partner" : `Edit ${partner?.name}`}</p>
        <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
          <PartnerForm
            mode={mode}
            initialPartner={partner}
            inDialog
            onClose={() => onOpenChange(false)}
            onSaved={(p) => {
              onSaved(p);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
