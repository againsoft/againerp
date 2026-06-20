"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit2, ExternalLink, Star, X } from "lucide-react";
import {
  formatBdt,
  getTechnicianScheduleToday,
  getTechnicianWorkOrders,
  SERVICE_SKILL_LABELS,
  SERVICE_TECHNICIAN_STATUS_LABELS,
  type ServiceTechnician,
} from "@/lib/mock-data/service";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type TabId = "profile" | "metrics" | "schedule" | "jobs";

function statusVariant(s: ServiceTechnician["status"]): "success" | "warning" | "muted" {
  if (s === "active") return "success";
  if (s === "on_leave") return "warning";
  return "muted";
}

type Props = {
  open: boolean;
  technician: ServiceTechnician | null;
  onClose: () => void;
  onEdit: (tech: ServiceTechnician) => void;
};

export function ServiceTechnicianViewSheet({ open, technician, onClose, onEdit }: Props) {
  const [tab, setTab] = useState<TabId>("profile");

  if (!technician) return null;

  const workOrders = getTechnicianWorkOrders(technician.name);
  const todaySlots = getTechnicianScheduleToday(technician.name);

  const tabs: { id: TabId; label: string; badge?: number }[] = [
    { id: "profile", label: "Profile" },
    { id: "metrics", label: "Metrics" },
    { id: "schedule", label: "Today", badge: todaySlots.length },
    { id: "jobs", label: "Active Jobs", badge: workOrders.length },
  ];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
      >
        <div className="flex h-full min-h-0 flex-col overflow-y-auto">
          <div className="shrink-0 border-b border-border px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                  <Badge variant={statusVariant(technician.status)} className="text-[10px]">
                    {SERVICE_TECHNICIAN_STATUS_LABELS[technician.status]}
                  </Badge>
                  <span className="font-mono text-[10px] text-muted-foreground">{technician.employeeId}</span>
                </div>
                <h2 className="text-base font-semibold">{technician.name}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{technician.defaultTerritory}</p>
                {technician.rating != null && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {technician.rating.toFixed(1)} customer rating
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 px-2.5 text-xs"
                  onClick={() => {
                    onClose();
                    onEdit(technician);
                  }}
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </Button>
                <button type="button" className="rounded-md p-1 hover:bg-accent" onClick={onClose} aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex gap-1 overflow-x-auto border-b border-border px-4">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "whitespace-nowrap px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors",
                  tab === t.id
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
                {t.badge != null && t.badge > 0 && (
                  <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] tabular-nums">
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 px-4 py-4 text-xs">
            {tab === "profile" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Email</p>
                    <p className="mt-0.5 font-medium">{technician.email}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Phone</p>
                    <p className="mt-0.5 font-medium">{technician.phone}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Joined</p>
                    <p className="mt-0.5 font-medium">{technician.joinedAt}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Territory</p>
                    <p className="mt-0.5 font-medium">{technician.defaultTerritory}</p>
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 text-muted-foreground">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {technician.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">
                        {SERVICE_SKILL_LABELS[s] ?? s}
                      </Badge>
                    ))}
                  </div>
                </div>

                {technician.certifications.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-muted-foreground">Certifications</p>
                    <ul className="space-y-1">
                      {technician.certifications.map((c) => (
                        <li key={c} className="rounded-md border border-input px-2 py-1.5">{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-[10px] text-muted-foreground">
                  Employee record owned by HR module — service profile extends skills and dispatch settings only.
                </p>
              </div>
            )}

            {tab === "metrics" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border border-input p-3 text-center">
                    <p className="text-muted-foreground">Jobs MTD</p>
                    <p className="mt-0.5 text-xl font-semibold tabular-nums">{technician.jobsCompletedMtd}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3 text-center">
                    <p className="text-muted-foreground">Revenue MTD</p>
                    <p className="mt-0.5 text-xl font-semibold tabular-nums">{formatBdt(technician.revenueMtd)}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3 text-center">
                    <p className="text-muted-foreground">Utilization</p>
                    <p className={cn(
                      "mt-0.5 text-xl font-semibold tabular-nums",
                      technician.utilizationPct >= 80 && "text-emerald-600 dark:text-emerald-400",
                      technician.utilizationPct >= 50 && technician.utilizationPct < 80 && "text-amber-600 dark:text-amber-400"
                    )}>
                      {technician.utilizationPct}%
                    </p>
                  </div>
                  <div className="rounded-lg border border-input p-3 text-center">
                    <p className="text-muted-foreground">Productivity</p>
                    <p className="mt-0.5 text-xl font-semibold tabular-nums">{technician.productivityScore}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-input bg-muted/20 p-4">
                  <p className="font-medium">Billable vs available hours (Jun 2026)</p>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${Math.min(technician.utilizationPct, 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    {technician.utilizationPct}% of scheduled capacity utilized this month
                  </p>
                </div>
              </div>
            )}

            {tab === "schedule" && (
              <div className="space-y-2">
                {todaySlots.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-input p-6 text-center text-muted-foreground">
                    No visits scheduled for today.
                  </p>
                ) : (
                  todaySlots.map((slot) => (
                    <div key={slot.id} className="rounded-lg border border-input p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{slot.startTime} – {slot.endTime}</p>
                          <p className="mt-0.5">{slot.serviceName}</p>
                          <p className="mt-0.5 text-muted-foreground">{slot.customer}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0 font-mono text-[9px]">
                          {slot.workOrderNumber}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
                <Button variant="outline" size="sm" className="gap-1.5" asChild>
                  <Link href="/service/schedule?tab=timeline">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open full schedule
                  </Link>
                </Button>
              </div>
            )}

            {tab === "jobs" && (
              <div className="space-y-2">
                {workOrders.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-input p-6 text-center text-muted-foreground">
                    No active work orders assigned.
                  </p>
                ) : (
                  workOrders.map((wo) => (
                    <Link
                      key={wo.id}
                      href={`/service/work-orders?view=${wo.id}`}
                      className="block rounded-lg border border-input p-3 hover:bg-muted/50"
                    >
                      <p className="font-mono text-[10px] text-muted-foreground">{wo.number}</p>
                      <p className="mt-0.5 font-medium">{wo.serviceName}</p>
                      <p className="mt-0.5 text-muted-foreground">{wo.customer} · {wo.scheduledStart}</p>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
