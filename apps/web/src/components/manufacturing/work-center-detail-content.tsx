"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle, Pencil, Wrench, X } from "lucide-react";
import {
  WORK_CENTER_STATUS_LABELS,
  WORK_CENTER_TYPE_LABELS,
  type WorkCenter,
} from "@/lib/mock-data/manufacturing-work-centers";
import {
  useManufacturingWorkCenterStore,
  workCenterStatusBadgeVariant,
  workCenterTypeBadgeVariant,
} from "@/lib/store/manufacturing-work-center-store";
import { useManufacturingWorkOrderStore } from "@/lib/store/manufacturing-work-order-store";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActivityTriggerButton } from "@/components/activity/activity-trigger-button";

type Tab = "overview" | "capacity" | "operations";

type Props = {
  workCenter: WorkCenter;
  inDialog?: boolean;
  onEdit?: (wc: WorkCenter) => void;
  onClose?: () => void;
};

export function WorkCenterDetailContent({ workCenter, inDialog, onEdit, onClose }: Props) {
  const live = useManufacturingWorkCenterStore((s) => s.getById(workCenter.id)) ?? workCenter;
  const activate = useManufacturingWorkCenterStore((s) => s.activate);
  const setMaintenance = useManufacturingWorkCenterStore((s) => s.setMaintenance);
  const workOrders = useManufacturingWorkOrderStore((s) => s.workOrders);
  const [tab, setTab] = useState<Tab>("overview");

  const linkedOps = useMemo(() => {
    const ops: { woId: string; woNumber: string; opName: string; status: string }[] = [];
    for (const wo of workOrders) {
      for (const op of wo.operations) {
        if (op.workCenter === live.code) {
          ops.push({
            woId: wo.id,
            woNumber: wo.number,
            opName: op.name,
            status: op.status,
          });
        }
      }
    }
    return ops;
  }, [workOrders, live.code]);

  const dailyCapacityCost = live.capacityHoursPerDay * live.costRatePerHour;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-input pb-3">
        <div className="flex flex-wrap items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold">{live.code}</h2>
              <Badge variant={workCenterStatusBadgeVariant(live.status)} className="text-[10px]">
                {WORK_CENTER_STATUS_LABELS[live.status]}
              </Badge>
              <Badge variant={workCenterTypeBadgeVariant(live.type)} className="text-[10px]">
                {WORK_CENTER_TYPE_LABELS[live.type]}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {live.name} · {live.warehouse}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <ActivityTriggerButton
              entity={{
                type: "manufacturing_work_center",
                id: live.id,
                label: live.code,
                subtitle: live.name,
              }}
              className="h-7 w-7"
            />
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => onEdit(live)}
              >
                <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
              </Button>
            )}
            {live.status === "active" && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setMaintenance(live.id)}
              >
                <Wrench className="mr-1.5 h-3.5 w-3.5" /> Maintenance
              </Button>
            )}
            {(live.status === "maintenance" || live.status === "inactive") && (
              <Button size="sm" className="h-7 px-2 text-xs" onClick={() => activate(live.id)}>
                <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Activate
              </Button>
            )}
            {onClose && (
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Close" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 rounded-md border border-input bg-muted/40 px-2.5 py-1.5 text-xs">
          <span>
            <span className="text-muted-foreground">Capacity </span>
            <span className="font-semibold">{live.capacityHoursPerDay}h/day</span>
          </span>
          <span className="text-muted-foreground">·</span>
          <span>
            <span className="text-muted-foreground">Cost </span>
            <span className="font-medium">{formatCurrency(live.costRatePerHour)}/hr</span>
          </span>
          <span className="text-muted-foreground">·</span>
          <span>
            <span className="text-muted-foreground">Utilization </span>
            <span className="font-medium">{live.utilizationPct}%</span>
          </span>
        </div>
      </div>

      <div className="mt-3 flex shrink-0 gap-1 rounded-lg border border-input bg-muted/30 p-1">
        {(["overview", "capacity", "operations"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
              tab === t
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className={cn("mt-3 min-h-0 flex-1 overflow-y-auto", inDialog && "pb-2")}>
        {tab === "overview" && (
          <div className="space-y-3">
            {live.notes && (
              <p className="rounded-lg border border-input bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                {live.notes}
              </p>
            )}
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { label: "Work center code", value: live.code },
                { label: "Name", value: live.name },
                { label: "Warehouse", value: live.warehouse },
                { label: "Type", value: WORK_CENTER_TYPE_LABELS[live.type] },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-input px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
            {live.status === "maintenance" && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-900 dark:text-amber-200">
                Work center offline — no new operations can be scheduled until activated.
              </div>
            )}
          </div>
        )}

        {tab === "capacity" && (
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { label: "Hours per day", value: String(live.capacityHoursPerDay) },
                { label: "Cost rate", value: formatCurrency(live.costRatePerHour) },
                { label: "Daily capacity cost", value: formatCurrency(dailyCapacityCost) },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-input px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-input px-3 py-3">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">Utilization (mock)</span>
                <span className="font-medium">{live.utilizationPct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    live.utilizationPct > 85 ? "bg-amber-500" : "bg-primary",
                  )}
                  style={{ width: `${live.utilizationPct}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {tab === "operations" && (
          <div className="space-y-3">
            {linkedOps.length === 0 ? (
              <p className="rounded-lg border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
                No routing operations assigned to this work center in open work orders.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-input">
                <table className="w-full min-w-[480px] text-xs">
                  <thead className="border-b bg-muted/40 text-left text-[11px] text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Work order</th>
                      <th className="px-3 py-2 font-medium">Operation</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linkedOps.map((op, i) => (
                      <tr key={`${op.woId}-${i}`} className="border-b last:border-0">
                        <td className="px-3 py-2">
                          <Link
                            href={`/manufacturing/work-orders?view=${op.woId}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {op.woNumber}
                          </Link>
                        </td>
                        <td className="px-3 py-2">{op.opName}</td>
                        <td className="px-3 py-2 capitalize">{op.status.replace(/_/g, " ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
