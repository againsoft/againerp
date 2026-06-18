"use client";

import { useRouter } from "next/navigation";
import { Archive, CalendarCheck, FileText, Pencil, Sparkles, Trophy, X } from "lucide-react";
import type { SmwOpportunity } from "@/lib/mock-data/smw-opportunities";
import { STAGE_LABELS, formatOppCurrency, weightedAmount } from "@/lib/mock-data/smw-opportunities";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OpportunityProfileTab } from "@/lib/mock-data/smw-opportunities";
import { toast } from "sonner";

const TABS: { id: OpportunityProfileTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "products", label: "Products" },
  { id: "quotations", label: "Quotations" },
  { id: "activity", label: "Activity" },
  { id: "documents", label: "Documents" },
];

function stageStatus(stage: SmwOpportunity["stage"]) {
  if (stage === "won") return "approved" as const;
  if (stage === "lost") return "rejected" as const;
  return "active" as const;
}

export function OpportunityProfileHeader({
  opportunity,
  onEdit,
  onClose,
  onAskAi,
}: {
  opportunity: SmwOpportunity;
  onEdit?: (opp: SmwOpportunity) => void;
  onClose?: () => void;
  onAskAi?: () => void;
}) {
  const router = useRouter();

  return (
    <header className="shrink-0 border-b bg-background px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-muted-foreground">{opportunity.opportunityNumber}</p>
          <h1 className="text-lg font-semibold">{opportunity.title}</h1>
          <p className="text-sm text-muted-foreground">{opportunity.accountName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => onEdit?.(opportunity)}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Edit
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => toast.info("Move stage — use pipeline board")}>
            Move stage
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => router.push(`/sales-marketing/quotations/create?opportunity=${opportunity.id}`)}>
            <FileText className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Create quotation
          </Button>
          {opportunity.stage !== "won" && (
            <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => toast.success("Marked won (prototype)")}>
              <Trophy className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Mark won
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => router.push("/sales-marketing/activities?create=1")}>
            <CalendarCheck className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Activity
          </Button>
          {onAskAi && (
            <Button type="button" variant="outline" size="sm" className="h-8" onClick={onAskAi}>
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-violet-500" aria-hidden /> AI
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

export function OpportunityProfileSummary({ opportunity }: { opportunity: SmwOpportunity }) {
  return (
    <div className="flex flex-wrap gap-2 border-b bg-muted/20 px-4 py-2">
      <EnterpriseStatusBadge status={stageStatus(opportunity.stage)} label={STAGE_LABELS[opportunity.stage]} size="sm" />
      <span className="rounded-full border border-input px-2 py-0.5 text-[10px] tabular-nums">{formatOppCurrency(opportunity.amount)}</span>
      <span className="rounded-full border border-input px-2 py-0.5 text-[10px] tabular-nums">W {formatOppCurrency(weightedAmount(opportunity))}</span>
      <span className="rounded-full border border-input px-2 py-0.5 text-[10px]">{opportunity.probability}%</span>
      <span className="rounded-full border border-input px-2 py-0.5 text-[10px]">{opportunity.ownerName}</span>
    </div>
  );
}

export function OpportunityProfileTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: OpportunityProfileTab;
  onTabChange: (tab: OpportunityProfileTab) => void;
}) {
  return (
    <div role="tablist" className="flex shrink-0 gap-1 overflow-x-auto border-b px-4">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-medium transition-colors",
            activeTab === tab.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
