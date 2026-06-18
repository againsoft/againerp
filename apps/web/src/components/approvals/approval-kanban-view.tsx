"use client";

import type { ApprovalRequest } from "@/lib/mock-data/approval-center";
import { ModuleChip, PriorityBadge, StatusBadge } from "@/components/approvals/approval-list-table";
import { cn } from "@/lib/utils";

const COLUMNS: { status: ApprovalRequest["status"]; label: string }[] = [
  { status: "pending", label: "Pending" },
  { status: "escalated", label: "Escalated" },
  { status: "delegated", label: "Delegated" },
  { status: "approved", label: "Approved" },
  { status: "rejected", label: "Rejected" },
];

type Props = {
  items: ApprovalRequest[];
  onCardClick: (id: string) => void;
};

export function ApprovalKanbanView({ items, onCardClick }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {COLUMNS.map((col) => {
        const columnItems = items.filter((i) => i.status === col.status);
        return (
          <div key={col.status} className="flex w-64 shrink-0 flex-col rounded-lg border border-input bg-muted/20">
            <header className="border-b border-border/60 px-3 py-2">
              <h3 className="text-xs font-semibold">{col.label}</h3>
              <span className="text-[10px] text-muted-foreground">{columnItems.length} items</span>
            </header>
            <ul className="flex max-h-[480px] flex-col gap-2 overflow-y-auto p-2">
              {columnItems.length === 0 ? (
                <li className="py-4 text-center text-[11px] text-muted-foreground">Empty</li>
              ) : (
                columnItems.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onCardClick(item.id)}
                      className={cn(
                        "w-full rounded-md border border-input bg-card p-2.5 text-left transition-colors hover:border-primary/30 hover:bg-accent/30",
                        item.priority === "critical" && "border-l-2 border-l-red-500",
                        item.priority === "high" && "border-l-2 border-l-amber-500",
                      )}
                    >
                      <p className="font-mono text-[10px] text-muted-foreground">{item.requestId}</p>
                      <p className="mt-0.5 text-xs font-medium">{item.requestType}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{item.requester}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <ModuleChip module={item.module} />
                        <PriorityBadge priority={item.priority} />
                      </div>
                      {item.dueAt ? (
                        <p className={cn("mt-1.5 text-[10px]", item.overdue && "font-medium text-red-600")}>
                          {item.dueAt}
                        </p>
                      ) : null}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
