"use client";

import { useState } from "react";
import type { LeadStatus, SmwLead } from "@/lib/mock-data/smw-leads";
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  formatLeadCurrency,
  leadScoreColor,
} from "@/lib/mock-data/smw-leads";
import { cn } from "@/lib/utils";

type Props = {
  leads: SmwLead[];
  onView: (lead: SmwLead) => void;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
  className?: string;
};

export function LeadKanban({ leads, onView, onStatusChange, className }: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const columns = LEAD_STATUSES.map((status) => ({
    status,
    label: LEAD_STATUS_LABELS[status],
    items: leads.filter((l) => l.status === status),
  }));

  const handleDrop = (status: LeadStatus) => {
    if (!draggingId) return;
    const lead = leads.find((l) => l.id === draggingId);
    if (lead && lead.status !== status && status !== "converted") {
      onStatusChange(draggingId, status);
    }
    setDraggingId(null);
  };

  return (
    <div
      className={cn(
        "grid min-h-[420px] gap-3 overflow-x-auto pb-2 md:grid-cols-3 xl:grid-cols-5",
        className,
      )}
    >
      {columns.map((col) => (
        <div
          key={col.status}
          className="flex min-w-[200px] flex-col rounded-lg border border-input bg-muted/20"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(col.status)}
        >
          <header className="flex items-center justify-between border-b border-border/60 px-3 py-2">
            <h3 className="text-xs font-semibold">{col.label}</h3>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] tabular-nums text-muted-foreground">
              {col.items.length}
            </span>
          </header>
          <ul className="flex flex-1 flex-col gap-2 p-2">
            {col.items.map((lead) => (
              <li
                key={lead.id}
                draggable={lead.status !== "converted"}
                onDragStart={() => setDraggingId(lead.id)}
                onDragEnd={() => setDraggingId(null)}
                className={cn(
                  "cursor-grab rounded-md border border-input bg-card p-3 shadow-sm transition-opacity active:cursor-grabbing",
                  draggingId === lead.id && "opacity-50",
                  lead.status === "converted" && "cursor-default opacity-90",
                )}
              >
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => onView(lead)}
                >
                  <p className="text-sm font-medium leading-snug">{lead.name}</p>
                  <p className="text-[11px] text-muted-foreground">{lead.company}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-[10px] tabular-nums text-muted-foreground">
                      {formatLeadCurrency(lead.expectedValue)}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] tabular-nums">
                      <span className={cn("h-1.5 w-6 rounded-full", leadScoreColor(lead.score))} />
                      {lead.score}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">{lead.leadNumber}</p>
                </button>
              </li>
            ))}
            {col.items.length === 0 && (
              <li className="rounded-md border border-dashed border-input p-4 text-center text-[11px] text-muted-foreground">
                Drop leads here
              </li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
