import { CampaignListWorkspace } from "@/components/sales-marketing/campaigns/campaign-list-workspace";
import { SmwListShell } from "@/components/sales-marketing/smw-page-shell";

/** SCR-SMW-CMP-001 — Campaign workspace */
export default function SmwCampaignsPage() {
  return (
    <SmwListShell title="Campaigns" subtitle="Plan and measure marketing campaigns across channels." hideHeader>
      <CampaignListWorkspace />
    </SmwListShell>
  );
}
