import { Suspense } from "react";
import { LeadProfilePageClient } from "@/components/sales-marketing/leads/lead-profile-page-client";

type Props = {
  params: Promise<{ id: string }>;
};

/** SCR-SMW-LDS-360 — Lead 360 profile */
export default async function LeadProfilePage({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense fallback={<p className="p-4 text-sm text-muted-foreground">Loading lead profile…</p>}>
      <LeadProfilePageClient leadId={id} />
    </Suspense>
  );
}
