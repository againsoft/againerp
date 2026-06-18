"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { OnboardingGrid } from "@/components/partners/onboarding-grid";
import { OnboardingViewDialog } from "@/components/partners/onboarding-view-dialog";
import { PartnersListShell } from "@/components/partners/partners-page-shell";
import {
  getOnboardingById,
  onboardingApplicationsSeed,
} from "@/lib/mock-data/business-partner-onboarding";
import { useBusinessPartnerOnboardingStore } from "@/lib/store/business-partner-onboarding-store";

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/partners/onboarding?${query}` : "/partners/onboarding";
}

function OnboardingListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeApps = useBusinessPartnerOnboardingStore((s) => s.applications);

  const viewId = searchParams.get("view");
  const statusFilter = searchParams.get("status") ?? "all";

  const resolveApp = (id: string | null) => {
    if (!id) return null;
    return storeApps.find((a) => a.id === id) ?? getOnboardingById(id) ?? null;
  };

  const viewApp = useMemo(() => resolveApp(viewId), [viewId, storeApps]);

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(buildUrl(params), { scroll: false });
  };

  const handleView = (app: (typeof storeApps)[0]) => {
    pushParams((params) => {
      params.set("view", app.id);
    });
  };

  const closeView = () => {
    pushParams((params) => {
      params.delete("view");
    });
  };

  const handleApproved = (partnerId: string) => {
    router.push(`/partners/directory?view=${partnerId}`, { scroll: false });
  };

  useEffect(() => {
    if (viewId && !viewApp) {
      toast.error("Application not found");
      closeView();
    }
  }, [viewId, viewApp]);

  const pending = storeApps.filter((a) => a.status === "submitted" || a.status === "review").length;
  const count = storeApps.length || onboardingApplicationsSeed.length;

  return (
    <>
      <p className="text-xs text-muted-foreground">
        {count} applications · {pending} pending review
      </p>

      <OnboardingGrid
        className="min-h-0 flex-1"
        initialStatus={statusFilter}
        onView={handleView}
      />

      <OnboardingViewDialog
        open={!!viewApp}
        onOpenChange={(open) => {
          if (!open) closeView();
        }}
        application={viewApp}
        onApproved={handleApproved}
      />
    </>
  );
}

export default function PartnersOnboardingPage() {
  return (
    <PartnersListShell
      title="Onboarding"
      subtitle="Review vendor, retailer, and wholesale applications — approve to create a business partner."
    >
      <Suspense
        fallback={
          <p className="flex flex-1 items-center text-sm text-muted-foreground">
            Loading applications…
          </p>
        }
      >
        <OnboardingListContent />
      </Suspense>
    </PartnersListShell>
  );
}
