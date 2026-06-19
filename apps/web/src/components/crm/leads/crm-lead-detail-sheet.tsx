"use client";

import { GitBranch, Pencil, Sparkles, UserCog, X } from "lucide-react";
import { toast } from "sonner";
import type { CrmLead, CrmLeadDetailTab } from "@/lib/mock-data/crm/types";
import {
  CRM_LEAD_SOURCE_LABELS,
  crmLeadInitials,
  isCrmLeadDetailTab,
} from "@/lib/mock-data/crm/types";
import { CrmStatusBadge } from "@/components/crm/crm-status-badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAppStore } from "@/lib/store/app-store";
import { CrmLeadSmartButtons } from "./crm-lead-smart-buttons";
import { CrmLeadTabBar, CrmLeadTabContent } from "./crm-lead-tab-content";
import { ActivityWidget } from "@/components/dashboard/widgets/activity-widget";
import { crmLeadActivities } from "@/lib/mock-data/crm/activities";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: CrmLead | null;
  tab?: string;
  onTabChange?: (tab: CrmLeadDetailTab) => void;
  onEdit?: (lead: CrmLead) => void;
};

/** DS-DRAWER-CRUD — lead detail with tabs + activity panel. */
export function CrmLeadDetailSheet({ open, onOpenChange, lead, tab = "overview", onTabChange, onEdit }: Props) {
  const openUtilityPanel = useAppStore((s) => s.openUtilityPanel);
  if (!lead) return null;

  const activeTab: CrmLeadDetailTab = isCrmLeadDetailTab(tab) ? tab : "overview";
  const setTab = (t: CrmLeadDetailTab) => onTabChange?.(t);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-hidden p-0 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl"
        aria-describedby={undefined}
      >
        <div className="flex h-full min-h-0 flex-col xl:flex-row">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <header className="shrink-0 border-b px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold"
                    aria-hidden
                  >
                    {crmLeadInitials(lead.name)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold leading-tight">{lead.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {lead.company} · {CRM_LEAD_SOURCE_LABELS[lead.source]} · {lead.ownerName}
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground">{lead.leadNumber}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => onEdit?.(lead)}>
                    <Pencil className="h-3.5 w-3.5" aria-hidden />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
                    <X className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <CrmStatusBadge status={lead.status} />
                {lead.status === "qualified" ? (
                  <Button
                    type="button"
                    size="sm"
                    className="h-8"
                    onClick={() => toast.success("Convert wizard — creates contact + opportunity")}
                  >
                    <GitBranch className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                    Convert
                  </Button>
                ) : null}
                <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => toast.info("Assign owner")}>
                  <UserCog className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  Assign
                </Button>
                <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => openUtilityPanel("ai")}>
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  AI
                </Button>
              </div>
            </header>

            <CrmLeadSmartButtons lead={lead} activeTab={activeTab} onTabClick={(t) => isCrmLeadDetailTab(t) && setTab(t)} />
            <CrmLeadTabBar activeTab={activeTab} onTabChange={setTab} />
            <div role="tabpanel" className="min-h-0 flex-1 overflow-y-auto p-4">
              <CrmLeadTabContent lead={lead} tab={activeTab} />
            </div>
          </div>

          <aside
            className="hidden w-72 shrink-0 flex-col border-l bg-muted/10 xl:flex"
            data-component="WS-CONTEXT-ACTIVITY"
          >
            <div className="border-b px-3 py-2 text-xs font-medium">Activity Panel</div>
            <div className="flex-1 overflow-y-auto p-2">
              <ActivityWidget
                items={(crmLeadActivities[lead.id] ?? []).map((a) => ({
                  id: a.id,
                  user: a.user,
                  action: a.action,
                  time: a.time,
                }))}
                maxItems={8}
              />
            </div>
          </aside>
        </div>
      </SheetContent>
    </Sheet>
  );
}
