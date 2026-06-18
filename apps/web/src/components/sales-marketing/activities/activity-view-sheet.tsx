"use client";

import Link from "next/link";
import type { SmwActivity } from "@/lib/mock-data/smw-activities";
import {
  ACTIVITY_PRIORITY_LABELS,
  ACTIVITY_STATUS_LABELS,
  ACTIVITY_TYPE_LABELS,
  activityStatusToEnterprise,
  relatedEntityHref,
} from "@/lib/mock-data/smw-activities";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CheckCircle2, ExternalLink, Pencil } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: SmwActivity | null;
  onEdit?: (a: SmwActivity) => void;
  onComplete?: (id: string) => void;
};

export function ActivityViewSheet({ open, onOpenChange, activity, onEdit, onComplete }: Props) {
  if (!activity) return null;

  const href = relatedEntityHref(activity);
  const canComplete = !["completed", "cancelled"].includes(activity.status);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md gap-0 overflow-y-auto p-0 sm:max-w-md">
        <div className="flex flex-col gap-4 p-4">
          <div>
            <p className="font-mono text-[11px] text-muted-foreground">{activity.activityNumber}</p>
            <h2 className="text-lg font-semibold">{activity.title}</h2>
            <p className="text-xs text-muted-foreground">{ACTIVITY_TYPE_LABELS[activity.type]}</p>
          </div>
          <EnterpriseStatusBadge
            status={activityStatusToEnterprise(activity.status)}
            label={ACTIVITY_STATUS_LABELS[activity.status]}
          />

          {activity.description && <p className="text-xs text-muted-foreground">{activity.description}</p>}

          <dl className="grid grid-cols-2 gap-3 text-xs">
            <div><dt className="text-muted-foreground">Priority</dt><dd className="font-medium">{ACTIVITY_PRIORITY_LABELS[activity.priority]}</dd></div>
            <div><dt className="text-muted-foreground">Owner</dt><dd>{activity.ownerName}</dd></div>
            <div><dt className="text-muted-foreground">Due</dt><dd>{activity.dueDate}{activity.dueTime ? ` ${activity.dueTime}` : ""}</dd></div>
            {activity.durationMinutes && (
              <div><dt className="text-muted-foreground">Duration</dt><dd>{activity.durationMinutes} min</dd></div>
            )}
            {activity.completedAt && (
              <div className="col-span-2"><dt className="text-muted-foreground">Completed</dt><dd>{activity.completedAt.slice(0, 16).replace("T", " ")}</dd></div>
            )}
            {activity.relatedName && (
              <div className="col-span-2"><dt className="text-muted-foreground">Related</dt><dd>{activity.relatedName}</dd></div>
            )}
          </dl>

          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => onEdit?.(activity)}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Edit
            </Button>
            {canComplete && onComplete && (
              <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => onComplete(activity.id)}>
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Complete
              </Button>
            )}
            {href && (
              <Button type="button" variant="outline" size="sm" className="h-8" asChild>
                <Link href={href}>
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Open record
                </Link>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
