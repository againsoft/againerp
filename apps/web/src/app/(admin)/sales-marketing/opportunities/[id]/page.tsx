import { Suspense } from "react";
import { OpportunityProfilePageClient } from "@/components/sales-marketing/opportunities/opportunity-profile-page-client";

type Props = { params: Promise<{ id: string }> };

/** SCR-SMW-OPP-360 — Deal 360 profile */
export default async function OpportunityProfilePage({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense fallback={<p className="p-4 text-sm text-muted-foreground">Loading deal…</p>}>
      <OpportunityProfilePageClient opportunityId={id} />
    </Suspense>
  );
}
