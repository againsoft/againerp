"use client";

import type { SmwTarget } from "@/lib/mock-data/smw-targets";
import {
  TARGET_METRIC_LABELS,
  TARGET_PERIOD_LABELS,
  TARGET_SCOPE_LABELS,
  TARGET_STATUS_LABELS,
  achievementHealth,
  formatTargetValue,
  targetAchievementPct,
  targetGap,
  targetStatusToEnterprise,
} from "@/lib/mock-data/smw-targets";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: SmwTarget | null;
  onEdit?: (t: SmwTarget) => void;
};

export function TargetViewSheet({ open, onOpenChange, target, onEdit }: Props) {
  if (!target) return null;

  const pct = targetAchievementPct(target);
  const health = achievementHealth(pct);
  const gap = targetGap(target);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md gap-0 overflow-y-auto p-0 sm:max-w-md">
        <div className="flex flex-col gap-4 p-4">
          <div>
            <p className="font-mono text-[11px] text-muted-foreground">{target.targetNumber}</p>
            <h2 className="text-lg font-semibold">{target.name}</h2>
            <p className="text-xs text-muted-foreground">
              {TARGET_METRIC_LABELS[target.metric]} · {TARGET_SCOPE_LABELS[target.scope]}
            </p>
          </div>
          <EnterpriseStatusBadge
            status={targetStatusToEnterprise(target.status)}
            label={TARGET_STATUS_LABELS[target.status]}
          />

          <div className="rounded-lg border border-input bg-muted/30 p-3">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground">Achievement</p>
                <p className="text-2xl font-semibold tabular-nums">{pct}%</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase",
                  health === "achieved" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
                  health === "on_track" && "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
                  health === "at_risk" && "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
                )}
              >
                {health === "achieved" ? "Achieved" : health === "on_track" ? "On track" : "At risk"}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  health === "achieved" && "bg-emerald-500",
                  health === "on_track" && "bg-violet-500",
                  health === "at_risk" && "bg-amber-500",
                )}
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {formatTargetValue(target.metric, target.achievedValue)} of{" "}
              {formatTargetValue(target.metric, target.targetValue)}
              {gap > 0 && target.status === "active" ? ` · ${formatTargetValue(target.metric, gap)} remaining` : ""}
            </p>
          </div>

          {target.notes && <p className="text-xs text-muted-foreground">{target.notes}</p>}

          <dl className="grid grid-cols-2 gap-3 text-xs">
            <div><dt className="text-muted-foreground">Assignee</dt><dd className="font-medium">{target.scopeName}</dd></div>
            <div><dt className="text-muted-foreground">Period</dt><dd>{target.periodLabel} ({TARGET_PERIOD_LABELS[target.period]})</dd></div>
            <div><dt className="text-muted-foreground">Owner</dt><dd>{target.ownerName}</dd></div>
            <div className="col-span-2"><dt className="text-muted-foreground">Date range</dt><dd>{target.startDate} → {target.endDate}</dd></div>
          </dl>

          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => onEdit?.(target)}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Edit
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
