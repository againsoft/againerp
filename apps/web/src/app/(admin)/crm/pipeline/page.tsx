"use client";

import Link from "next/link";
import { CrmPageHeader, CrmPipelineBoard } from "@/components/crm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { CrmOpportunity } from "@/lib/mock-data/crm/types";

export default function CrmPipelinePage() {
  const router = useRouter();

  const handleView = (opp: CrmOpportunity) => {
    if (opp.leadId) router.push(`/crm/leads?view=${opp.leadId}`, { scroll: false });
  };

  return (
    <div className="space-y-4" data-layout="LAYOUT-LIST">
      <CrmPageHeader
        title="Pipeline"
        subtitle="Opportunity kanban — drag deals between stages."
        createHref="/crm/leads?create=1"
        createLabel="Create Lead"
        showImportExport={false}
      />
      <div className="flex flex-wrap gap-2 text-xs">
        <Button asChild variant="outline" size="sm" className="h-8">
          <Link href="/crm/leads">List view</Link>
        </Button>
      </div>
      <CrmPipelineBoard onView={handleView} />
    </div>
  );
}
