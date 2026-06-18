"use client";

import { useMemo } from "react";
import type { SmwOpportunity } from "@/lib/mock-data/smw-opportunities";
import { getOpportunityProfile } from "@/lib/mock-data/smw-opportunity-profile";
import { isOpportunityProfileTab, type OpportunityProfileTab } from "@/lib/mock-data/smw-opportunities";
import { useAppStore } from "@/lib/store/app-store";
import {
  OpportunityProfileHeader,
  OpportunityProfileSummary,
  OpportunityProfileTabBar,
} from "@/components/sales-marketing/opportunities/profile/opportunity-profile-chrome";
import { OpportunityProfileSidebar } from "@/components/sales-marketing/opportunities/profile/opportunity-profile-sidebar";
import { OpportunityProfileTabContent } from "@/components/sales-marketing/opportunities/profile/opportunity-profile-tab-content";

type Props = {
  opportunity: SmwOpportunity;
  initialTab?: OpportunityProfileTab;
  onTabChange?: (tab: OpportunityProfileTab) => void;
  onEdit?: (opp: SmwOpportunity) => void;
};

export function OpportunityProfileWorkspace({
  opportunity,
  initialTab = "overview",
  onTabChange,
  onEdit,
}: Props) {
  const toggleAiDrawer = useAppStore((s) => s.toggleAiDrawer);
  const profile = useMemo(() => getOpportunityProfile(opportunity), [opportunity]);
  const activeTab = isOpportunityProfileTab(initialTab) ? initialTab : "overview";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <OpportunityProfileHeader opportunity={opportunity} onEdit={onEdit} onAskAi={toggleAiDrawer} />
      <OpportunityProfileSummary opportunity={opportunity} />
      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <OpportunityProfileTabBar activeTab={activeTab} onTabChange={(t) => onTabChange?.(t)} />
          <div role="tabpanel" className="min-h-0 flex-1 overflow-y-auto p-4" id={`opp-tab-${activeTab}`}>
            <OpportunityProfileTabContent tab={activeTab} opportunity={opportunity} profile={profile} />
          </div>
          <OpportunityProfileSidebar opportunity={opportunity} profile={profile} className="border-t xl:hidden" />
        </div>
        <OpportunityProfileSidebar opportunity={opportunity} profile={profile} className="hidden xl:flex" />
      </div>
    </div>
  );
}
