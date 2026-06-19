"use client";

import { Badge } from "@/components/ui/badge";
import { CRM_LEAD_STATUS_LABELS, type CrmLeadStatus } from "@/lib/mock-data/crm/types";
import { cn } from "@/lib/utils";

const styles: Record<CrmLeadStatus, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  contacted: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
  qualified: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  converted: "bg-muted text-muted-foreground",
  lost: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
};

export function CrmStatusBadge({ status, className }: { status: CrmLeadStatus; className?: string }) {
  return (
    <Badge variant="secondary" className={cn("capitalize", styles[status], className)}>
      {CRM_LEAD_STATUS_LABELS[status]}
    </Badge>
  );
}
