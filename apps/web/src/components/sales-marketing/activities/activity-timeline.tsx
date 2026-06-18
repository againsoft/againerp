"use client";

import type { SmwActivity } from "@/lib/mock-data/smw-activities";
import {
  ACTIVITY_PRIORITY_LABELS,
  ACTIVITY_STATUS_LABELS,
  ACTIVITY_TYPE_LABELS,
  activityStatusToEnterprise,
} from "@/lib/mock-data/smw-activities";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CheckSquare,
  Mail,
  Phone,
  RotateCcw,
  StickyNote,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TYPE_ICONS: Record<SmwActivity["type"], LucideIcon> = {
  call: Phone,
  meeting: Calendar,
  email: Mail,
  task: CheckSquare,
  follow_up: RotateCcw,
  note: StickyNote,
};

type Props = {
  activities: SmwActivity[];
  onView: (a: SmwActivity) => void;
};

export function ActivityTimeline({ activities, onView }: Props) {
  const sorted = [...activities].sort((a, b) => {
    const da = `${a.dueDate}${a.dueTime ?? ""}`;
    const db = `${b.dueDate}${b.dueTime ?? ""}`;
    return da.localeCompare(db);
  });

  if (sorted.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed p-8 text-sm text-muted-foreground">
        No activities in this view.
      </div>
    );
  }

  return (
    <div className="space-y-0 rounded-lg border border-input bg-card">
      {sorted.map((activity, idx) => {
        const Icon = TYPE_ICONS[activity.type];
        const isLast = idx === sorted.length - 1;
        return (
          <button
            key={activity.id}
            type="button"
            className={cn(
              "flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
              !isLast && "border-b border-input",
            )}
            onClick={() => onView(activity)}
          >
            <div
              className={cn(
                "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                activity.status === "overdue" ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" : "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">{activity.title}</p>
                <EnterpriseStatusBadge
                  status={activityStatusToEnterprise(activity.status)}
                  label={ACTIVITY_STATUS_LABELS[activity.status]}
                  size="sm"
                />
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {ACTIVITY_TYPE_LABELS[activity.type]}
                {activity.relatedName ? ` · ${activity.relatedName}` : ""}
                {" · "}
                {activity.dueDate}
                {activity.dueTime ? ` ${activity.dueTime}` : ""}
                {" · "}
                {activity.ownerName}
              </p>
              {activity.description && (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{activity.description}</p>
              )}
            </div>
            {activity.priority === "high" && (
              <span className="shrink-0 text-[10px] font-medium uppercase text-red-600">
                {ACTIVITY_PRIORITY_LABELS.high}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
