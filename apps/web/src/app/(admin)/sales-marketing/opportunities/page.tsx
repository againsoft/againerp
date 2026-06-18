import { OpportunityPipeline } from "@/components/sales-marketing/opportunities/opportunity-pipeline";
import { SmwListShell } from "@/components/sales-marketing/smw-page-shell";

/** SCR-SMW-OPP-001 — Opportunity pipeline */
export default function SmwOpportunitiesPage() {
  return (
    <SmwListShell
      title="Opportunities"
      subtitle="Kanban pipeline, stages, and deal progression."
      hideHeader
    >
      <OpportunityPipeline />
    </SmwListShell>
  );
}
