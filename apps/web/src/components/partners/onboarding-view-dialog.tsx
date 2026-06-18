"use client";

import type { PartnerOnboardingApplication } from "@/lib/mock-data/business-partner-onboarding";
import { OnboardingDetailContent } from "@/components/partners/onboarding-detail-content";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: PartnerOnboardingApplication | null;
  onApproved?: (partnerId: string) => void;
};

export function OnboardingViewDialog({ open, onOpenChange, application, onApproved }: Props) {
  if (!application) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
        aria-describedby={undefined}
      >
        <p className="sr-only">Onboarding · {application.applicationNumber}</p>
        <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
          <OnboardingDetailContent
            application={application}
            inDialog
            onClose={() => onOpenChange(false)}
            onApproved={(partnerId) => {
              onApproved?.(partnerId);
              onOpenChange(false);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
