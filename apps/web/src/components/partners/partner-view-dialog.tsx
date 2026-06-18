"use client";

import type { BusinessPartner } from "@/lib/mock-data/business-partners";
import { PartnerDetailContent } from "@/components/partners/partner-detail-content";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: BusinessPartner | null;
  initialTab?: "overview" | "roles" | "terms" | "tiers" | "territories" | "catalog" | "profile";
  onEdit?: (partner: BusinessPartner) => void;
};

export function PartnerViewDialog({ open, onOpenChange, partner, initialTab, onEdit }: Props) {
  if (!partner) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
        aria-describedby={undefined}
      >
        <p className="sr-only">Partner · {partner.name}</p>
        <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
          <PartnerDetailContent
            partner={partner}
            inDialog
            initialTab={initialTab}
            onEdit={onEdit}
            onClose={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
