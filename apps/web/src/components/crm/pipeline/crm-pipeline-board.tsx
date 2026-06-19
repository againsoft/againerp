"use client";

import { useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import type { CrmOpportunity, CrmPipelineStage } from "@/lib/mock-data/crm/types";
import {
  CRM_PIPELINE_STAGES,
  CRM_PIPELINE_STAGE_LABELS,
  formatCrmCurrency,
} from "@/lib/mock-data/crm/types";
import { useCrmStore } from "@/lib/store/crm-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Props = {
  onView?: (opp: CrmOpportunity) => void;
};

/** DS-KANBAN-BOARD — pipeline drag & drop prototype. */
export function CrmPipelineBoard({ onView }: Props) {
  const opportunities = useCrmStore((s) => s.opportunities);
  const updateStage = useCrmStore((s) => s.updateOpportunityStage);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const columns = CRM_PIPELINE_STAGES.map((stage) => ({
    stage,
    label: CRM_PIPELINE_STAGE_LABELS[stage],
    items: opportunities.filter((o) => o.stage === stage),
    total: opportunities.filter((o) => o.stage === stage).reduce((s, o) => s + o.value, 0),
  }));

  const handleDrop = (stage: CrmPipelineStage) => {
    if (!draggingId) return;
    const opp = opportunities.find((o) => o.id === draggingId);
    if (opp && opp.stage !== stage && stage !== "won") {
      updateStage(draggingId, stage);
      toast.success(`Moved to ${CRM_PIPELINE_STAGE_LABELS[stage]}`);
    }
    setDraggingId(null);
  };

  return (
    <div
      data-component="DS-KANBAN-BOARD"
      className="grid min-h-[480px] gap-3 overflow-x-auto pb-2 md:grid-cols-3 xl:grid-cols-5"
    >
      {columns.map((col) => (
        <div
          key={col.stage}
          className="flex min-w-[220px] flex-col rounded-lg border bg-muted/20"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(col.stage)}
        >
          <header className="border-b px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold">{col.label}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7" aria-label={`${col.label} actions`}>
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toast.info("Add opportunity")}>
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    Add deal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Stage settings")}>Stage settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {col.items.length} deals · {formatCrmCurrency(col.total)}
            </p>
          </header>
          <ul className="flex flex-1 flex-col gap-2 p-2">
            {col.items.map((opp) => (
              <li
                key={opp.id}
                draggable={!["won", "lost"].includes(opp.stage)}
                onDragStart={() => setDraggingId(opp.id)}
                onDragEnd={() => setDraggingId(null)}
                className={cn(
                  "cursor-grab rounded-md border bg-card p-3 shadow-sm active:cursor-grabbing",
                  draggingId === opp.id && "opacity-50",
                  ["won", "lost"].includes(opp.stage) && "cursor-default opacity-90",
                )}
              >
                <button type="button" className="w-full text-left" onClick={() => onView?.(opp)}>
                  <p className="text-sm font-medium leading-snug">{opp.name}</p>
                  <p className="text-[11px] text-muted-foreground">{opp.company}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="font-medium tabular-nums">{formatCrmCurrency(opp.value)}</span>
                    <span className="text-muted-foreground">{opp.probability}%</span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">{opp.ownerName}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
