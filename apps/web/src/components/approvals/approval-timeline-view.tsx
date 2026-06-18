"use client";

import type { ApprovalRequest } from "@/lib/mock-data/approval-center";
import { ModuleChip, PriorityBadge, StatusBadge } from "@/components/approvals/approval-list-table";
import { cn } from "@/lib/utils";

type Props = {
  items: ApprovalRequest[];
  onItemClick: (id: string) => void;
};

export function ApprovalTimelineView({ items, onItemClick }: Props) {
  const sorted = [...items].sort((a, b) => a.submittedAtIso.localeCompare(b.submittedAtIso));

  if (sorted.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
        No requests in this view.
      </div>
    );
  }

  return (
    <div className="relative space-y-0 pl-6">
      <div className="absolute bottom-0 left-[7px] top-0 w-px bg-border" aria-hidden />
      {sorted.map((item, index) => (
        <div key={item.id} className="relative pb-6">
          <span
            className={cn(
              "absolute -left-6 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-background",
              item.status === "approved" && "bg-emerald-500",
              item.status === "rejected" && "bg-red-500",
              item.status === "escalated" && "bg-amber-500",
              item.status === "pending" && "bg-blue-500",
              item.status === "delegated" && "bg-violet-500",
            )}
            aria-hidden
          />
          <button
            type="button"
            onClick={() => onItemClick(item.id)}
            className="w-full rounded-lg border border-input bg-card p-3 text-left transition-colors hover:border-primary/30 hover:bg-accent/30"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[10px] text-muted-foreground">{item.requestId}</span>
              <span className="text-[10px] text-muted-foreground">{item.submittedAt}</span>
            </div>
            <p className="mt-1 text-sm font-medium">{item.requestType}</p>
            <p className="text-xs text-muted-foreground">
              {item.requester} · {item.department}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <ModuleChip module={item.module} />
              <PriorityBadge priority={item.priority} />
              <StatusBadge status={item.status} />
            </div>
            {item.dueAt ? (
              <p className={cn("mt-2 text-[11px]", item.overdue ? "font-medium text-red-600" : "text-muted-foreground")}>
                {item.dueAt}
              </p>
            ) : null}
            {index < sorted.length - 1 ? (
              <p className="mt-2 text-[10px] text-muted-foreground">Step {item.stepNumber} of {item.totalSteps} · {item.currentStep}</p>
            ) : null}
          </button>
        </div>
      ))}
    </div>
  );
}
