"use client";

import Link from "next/link";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, GripVertical, User } from "lucide-react";
import type { SmwOpportunity } from "@/lib/mock-data/smw-opportunities";
import { formatOppCurrency } from "@/lib/mock-data/smw-opportunities";
import { EnterpriseRiskBadge } from "@/components/enterprise/badges/risk-badge";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OpportunityStage } from "@/lib/mock-data/smw-opportunities";
import { STAGE_LABELS } from "@/lib/mock-data/smw-opportunities";

type Props = {
  opportunity: SmwOpportunity;
  onView: (opp: SmwOpportunity) => void;
  onMoveStage?: (id: string, stage: OpportunityStage) => void;
  dragDisabled?: boolean;
};

export function OpportunityCard({ opportunity, onView, onMoveStage, dragDisabled }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: opportunity.id,
    disabled: dragDisabled,
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  const closeLabel = new Date(opportunity.expectedCloseDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-md border border-input bg-card shadow-sm transition-shadow",
        isDragging && "opacity-40 shadow-lg ring-2 ring-primary/30",
      )}
    >
      <div className="flex items-start gap-1 p-2.5">
        {!dragDisabled && (
          <button
            type="button"
            className="mt-0.5 shrink-0 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
            aria-label="Drag deal"
            {...listeners}
            {...attributes}
          >
            <GripVertical className="h-4 w-4" aria-hidden />
          </button>
        )}
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => onView(opportunity)}
        >
          <div className="flex items-start justify-between gap-1">
            <span className="font-mono text-[10px] text-muted-foreground">{opportunity.opportunityNumber}</span>
            {opportunity.atRisk && opportunity.riskLevel ? (
              <EnterpriseRiskBadge level={opportunity.riskLevel} size="sm" showIcon={false} label="At risk" />
            ) : null}
          </div>
          <p className="mt-0.5 text-xs font-semibold leading-snug">
            {opportunity.accountName} — {opportunity.title}
          </p>
          <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">
            {formatOppCurrency(opportunity.amount)} · {opportunity.probability}%
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-0.5">
              <User className="h-3 w-3" aria-hidden />
              {opportunity.ownerName.split(" ")[0]}
            </span>
            <span className="inline-flex items-center gap-0.5">
              <Calendar className="h-3 w-3" aria-hidden />
              {closeLabel}
            </span>
          </div>
          {opportunity.tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {opportunity.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="px-1 py-0 text-[9px]">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </button>
        {onMoveStage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Move deal">
                ⋮
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto">
              {(Object.keys(STAGE_LABELS) as OpportunityStage[]).map((stage) => (
                <DropdownMenuItem
                  key={stage}
                  disabled={stage === opportunity.stage}
                  onClick={() => onMoveStage(opportunity.id, stage)}
                >
                  Move to {STAGE_LABELS[stage]}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem asChild>
                <Link href={`/sales-marketing/opportunities/${opportunity.id}`}>Open full deal</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </article>
  );
}

/** Static card for drag overlay */
export function OpportunityCardOverlay({ opportunity }: { opportunity: SmwOpportunity }) {
  return (
    <div className="w-[240px] rotate-2 rounded-md border border-primary/40 bg-card p-2.5 shadow-xl">
      <p className="font-mono text-[10px] text-muted-foreground">{opportunity.opportunityNumber}</p>
      <p className="mt-0.5 text-xs font-semibold">{opportunity.accountName}</p>
      <p className="text-[11px] tabular-nums text-muted-foreground">
        {formatOppCurrency(opportunity.amount)} · {opportunity.probability}%
      </p>
    </div>
  );
}
