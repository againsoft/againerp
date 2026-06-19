"use client";

import { Calendar, MessageSquare, Phone, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CrmLead } from "@/lib/mock-data/crm/types";
import { crmLeadActivities } from "@/lib/mock-data/crm/activities";

type Props = {
  lead: CrmLead;
  activeTab: string;
  onTabClick: (tab: string) => void;
};

/** Odoo-inspired stat pills linking to related data. */
export function CrmLeadSmartButtons({ lead, activeTab, onTabClick }: Props) {
  const activities = crmLeadActivities[lead.id]?.length ?? 3;
  const meetings = 2;
  const calls = crmLeadActivities[lead.id]?.filter((a) => a.action.includes("call")).length ?? 1;

  const buttons = [
    { id: "activities", label: `${activities} Activities`, icon: MessageSquare },
    { id: "meetings", label: `${meetings} Meetings`, icon: Calendar },
    { id: "calls", label: `${calls} Calls`, icon: Phone },
    { id: "score", label: `Score: ${lead.score}`, icon: Sparkles },
  ];

  return (
    <div className="flex flex-wrap gap-2 border-b px-4 py-2">
      {buttons.map((btn) => {
        const Icon = btn.icon;
        const tabId = btn.id === "score" ? "overview" : btn.id;
        return (
          <button
            key={btn.id}
            type="button"
            onClick={() => onTabClick(tabId)}
            className={cn(
              "inline-flex min-h-9 items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-accent",
              activeTab === tabId && "border-primary bg-primary/5",
            )}
          >
            <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
            {btn.label}
          </button>
        );
      })}
    </div>
  );
}
