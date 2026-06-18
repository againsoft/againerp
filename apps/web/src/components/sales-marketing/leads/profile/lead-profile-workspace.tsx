"use client";

import { useMemo } from "react";
import type { SmwLead } from "@/lib/mock-data/smw-leads";
import { getLeadProfile } from "@/lib/mock-data/smw-lead-profile";
import { isLeadProfileTab, type LeadProfileTab } from "@/lib/mock-data/smw-leads";
import { useAppStore } from "@/lib/store/app-store";
import {
  LeadProfileHeader,
  LeadProfileSummary,
  LeadProfileTabBar,
} from "@/components/sales-marketing/leads/profile/lead-profile-chrome";
import { LeadProfileSidebar } from "@/components/sales-marketing/leads/profile/lead-profile-sidebar";
import { LeadProfileTabContent } from "@/components/sales-marketing/leads/profile/lead-profile-tab-content";
import { cn } from "@/lib/utils";

type Props = {
  lead: SmwLead;
  initialTab?: LeadProfileTab;
  onTabChange?: (tab: LeadProfileTab) => void;
  onClose?: () => void;
  onEdit?: (lead: SmwLead) => void;
  inDialog?: boolean;
};

export function LeadProfileWorkspace({
  lead,
  initialTab = "overview",
  onTabChange,
  onClose,
  onEdit,
  inDialog,
}: Props) {
  const toggleAiDrawer = useAppStore((s) => s.toggleAiDrawer);
  const profile = useMemo(() => getLeadProfile(lead), [lead]);
  const activeTab = isLeadProfileTab(initialTab) ? initialTab : "overview";

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", inDialog && "h-full")}>
      <LeadProfileHeader lead={lead} onEdit={onEdit} onClose={onClose} onAskAi={toggleAiDrawer} />
      <LeadProfileSummary lead={lead} />

      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <LeadProfileTabBar activeTab={activeTab} onTabChange={(tab) => onTabChange?.(tab)} />
          <div
            role="tabpanel"
            className="min-h-0 flex-1 overflow-y-auto p-4"
            id={`lead-tab-${activeTab}`}
          >
            <LeadProfileTabContent tab={activeTab} lead={lead} profile={profile} />
          </div>
          <LeadProfileSidebar lead={lead} profile={profile} className="border-t xl:hidden" />
        </div>
        <LeadProfileSidebar lead={lead} profile={profile} className="hidden xl:flex" />
      </div>
    </div>
  );
}
