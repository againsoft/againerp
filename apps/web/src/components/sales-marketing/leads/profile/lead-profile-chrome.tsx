"use client";

import { useRouter } from "next/navigation";
import { Archive, GitBranch, Pencil, Sparkles, UserCog, X } from "lucide-react";
import type { SmwLead } from "@/lib/mock-data/smw-leads";
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  formatLeadCurrency,
  leadInitials,
  leadStatusToEnterprise,
} from "@/lib/mock-data/smw-leads";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LeadProfileTab } from "@/lib/mock-data/smw-leads";
import { toast } from "sonner";

const TABS: { id: LeadProfileTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "activity", label: "Activity" },
  { id: "documents", label: "Documents" },
  { id: "history", label: "History" },
];

type HeaderProps = {
  lead: SmwLead;
  onEdit?: (lead: SmwLead) => void;
  onClose?: () => void;
  onAskAi?: () => void;
};

export function LeadProfileHeader({ lead, onEdit, onClose, onAskAi }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="shrink-0 border-b bg-background px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-800 dark:bg-violet-950 dark:text-violet-200"
            aria-hidden
          >
            {leadInitials(lead.name)}
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold leading-tight">{lead.name}</h1>
            <p className="text-sm text-muted-foreground">{lead.company}</p>
            <p className="font-mono text-[11px] text-muted-foreground">{lead.leadNumber}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => onEdit?.(lead)}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Edit
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => toast.info("Assign owner")}>
            <UserCog className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Assign
          </Button>
          {lead.status !== "converted" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => {
                toast.success("Convert to opportunity — Step 04");
                router.push("/sales-marketing/opportunities?create=1");
              }}
            >
              <GitBranch className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Convert
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => toast.info("Archive lead")}>
            <Archive className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Archive
          </Button>
          {onAskAi && (
            <Button type="button" variant="outline" size="sm" className="h-8" onClick={onAskAi}>
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-violet-500" aria-hidden />
              AI
            </Button>
          )}
          {onClose && (
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} aria-label="Close">
              <X className="h-4 w-4" aria-hidden />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export function LeadProfileTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: LeadProfileTab;
  onTabChange: (tab: LeadProfileTab) => void;
}) {
  return (
    <div role="tablist" aria-label="Lead profile sections" className="flex shrink-0 gap-1 overflow-x-auto border-b px-4">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-medium transition-colors",
            activeTab === tab.id
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function LeadProfileSummary({ lead }: { lead: SmwLead }) {
  return (
    <div className="flex flex-wrap gap-2 border-b bg-muted/20 px-4 py-2">
      <EnterpriseStatusBadge
        status={leadStatusToEnterprise(lead.status)}
        label={LEAD_STATUS_LABELS[lead.status]}
        size="sm"
      />
      <Badge variant="secondary" className="text-[10px]">
        {LEAD_SOURCE_LABELS[lead.source]}
      </Badge>
      <Badge variant="outline" className="text-[10px] tabular-nums">
        Score {lead.score}
      </Badge>
      <Badge variant="outline" className="text-[10px] tabular-nums">
        {formatLeadCurrency(lead.expectedValue)}
      </Badge>
    </div>
  );
}
