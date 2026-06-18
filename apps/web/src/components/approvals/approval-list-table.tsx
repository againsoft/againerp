"use client";

import Link from "next/link";
import type { ApprovalRequest } from "@/lib/mock-data/approval-center";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  items: ApprovalRequest[];
  onRowClick: (id: string) => void;
};

export function ApprovalListTable({ items, onRowClick }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <p className="text-sm font-medium">No pending approvals</p>
        <p className="mt-1 text-xs text-muted-foreground">All caught up — check back later.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-input">
      <table className="w-full min-w-[720px] text-xs">
        <thead>
          <tr className="border-b bg-muted/40 text-left text-muted-foreground">
            <th className="px-3 py-2.5 font-medium">Request ID</th>
            <th className="px-3 py-2.5 font-medium">Module</th>
            <th className="px-3 py-2.5 font-medium">Request Type</th>
            <th className="px-3 py-2.5 font-medium">Requester</th>
            <th className="px-3 py-2.5 font-medium">Priority</th>
            <th className="px-3 py-2.5 font-medium">Status</th>
            <th className="px-3 py-2.5 font-medium">Submitted Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="cursor-pointer border-b border-border/40 transition-colors hover:bg-muted/40"
              onClick={() => onRowClick(item.id)}
            >
              <td className="px-3 py-2.5">
                <Link
                  href={`/inbox/approvals?view=${item.id}`}
                  className="font-mono font-medium text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.requestId}
                </Link>
              </td>
              <td className="px-3 py-2.5">
                <ModuleChip module={item.module} />
              </td>
              <td className="px-3 py-2.5">{item.requestType}</td>
              <td className="px-3 py-2.5">
                <p className="font-medium">{item.requester}</p>
                <p className="text-[10px] text-muted-foreground">{item.department}</p>
              </td>
              <td className="px-3 py-2.5">
                <PriorityBadge priority={item.priority} />
              </td>
              <td className="px-3 py-2.5">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">{item.submittedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ModuleChip({ module }: { module: ApprovalRequest["module"] }) {
  const colors: Record<ApprovalRequest["module"], string> = {
    HR: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200",
    Payroll: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
    Purchase: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200",
    Sales: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    Inventory: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  };
  return (
    <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", colors[module])}>{module}</span>
  );
}

export function PriorityBadge({ priority }: { priority: ApprovalRequest["priority"] }) {
  const variant =
    priority === "critical" || priority === "high"
      ? "warning"
      : priority === "medium"
        ? "secondary"
        : "muted";
  return (
    <Badge variant={variant} className="text-[10px] capitalize">
      {priority}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: ApprovalRequest["status"] }) {
  const variant =
    status === "approved"
      ? "success"
      : status === "rejected"
        ? "warning"
        : status === "escalated"
          ? "warning"
          : "secondary";
  return (
    <Badge variant={variant} className="text-[10px] capitalize">
      {status}
    </Badge>
  );
}
