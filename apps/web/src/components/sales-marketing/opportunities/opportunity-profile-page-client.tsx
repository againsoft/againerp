"use client";

import { notFound, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { OpportunityFormSheet } from "@/components/sales-marketing/opportunities/opportunity-form-sheet";
import { OpportunityProfileWorkspace } from "@/components/sales-marketing/opportunities/profile/opportunity-profile-workspace";
import { SmwPageShell } from "@/components/sales-marketing/smw-page-shell";
import {
  getOpportunityById,
  isOpportunityProfileTab,
  smwOpportunitiesSeed,
  type OpportunityProfileTab,
} from "@/lib/mock-data/smw-opportunities";
import { useSmwOpportunityStore } from "@/lib/store/smw-opportunity-store";

function OpportunityProfileContent({ opportunityId }: { opportunityId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeOpps = useSmwOpportunityStore((s) => s.opportunities);
  const opportunities = storeOpps.length > 0 ? storeOpps : smwOpportunitiesSeed;

  const editId = searchParams.get("edit");
  const tabParam = searchParams.get("tab");
  const tab: OpportunityProfileTab = isOpportunityProfileTab(tabParam) ? tabParam : "overview";

  const opportunity = useMemo(
    () => opportunities.find((o) => o.id === opportunityId) ?? getOpportunityById(opportunityId) ?? null,
    [opportunityId, opportunities],
  );

  const editOpp = useMemo(() => {
    if (!editId) return null;
    return opportunities.find((o) => o.id === editId) ?? getOpportunityById(editId) ?? null;
  }, [editId, opportunities]);

  if (!opportunity) notFound();

  const pushTab = (nextTab: OpportunityProfileTab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextTab === "overview") params.delete("tab");
    else params.set("tab", nextTab);
    const qs = params.toString();
    router.replace(
      qs ? `/sales-marketing/opportunities/${opportunityId}?${qs}` : `/sales-marketing/opportunities/${opportunityId}`,
      { scroll: false },
    );
  };

  const closeEdit = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("edit");
    const qs = params.toString();
    router.replace(
      qs ? `/sales-marketing/opportunities/${opportunityId}?${qs}` : `/sales-marketing/opportunities/${opportunityId}`,
      { scroll: false },
    );
  };

  return (
    <>
      <SmwPageShell hideHeader>
        <OpportunityProfileWorkspace
          opportunity={opportunity}
          initialTab={tab}
          onTabChange={pushTab}
          onEdit={(o) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("edit", o.id);
            router.push(`/sales-marketing/opportunities/${opportunityId}?${params.toString()}`, { scroll: false });
          }}
        />
      </SmwPageShell>
      <OpportunityFormSheet
        open={!!editOpp}
        onOpenChange={(open) => { if (!open) closeEdit(); }}
        mode="edit"
        opportunity={editOpp}
        onSaved={closeEdit}
      />
    </>
  );
}

export function OpportunityProfilePageClient({ opportunityId }: { opportunityId: string }) {
  return (
    <Suspense fallback={<p className="p-4 text-sm text-muted-foreground">Loading deal…</p>}>
      <OpportunityProfileContent opportunityId={opportunityId} />
    </Suspense>
  );
}
