"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Package, Play, Square, Truck } from "lucide-react";
import type { WorkOrder } from "@/lib/mock-data/manufacturing-work-orders";
import {
  operationStatusBadgeVariant,
  shopFloorLogIcon,
  useManufacturingWorkOrderStore,
} from "@/lib/store/manufacturing-work-order-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  workOrder: WorkOrder;
};

export function WorkOrderShopFloorTab({ workOrder }: Props) {
  const live = useManufacturingWorkOrderStore((s) => s.getById(workOrder.id)) ?? workOrder;
  const issueMaterials = useManufacturingWorkOrderStore((s) => s.issueMaterials);
  const recordOutput = useManufacturingWorkOrderStore((s) => s.recordOutput);
  const startOperation = useManufacturingWorkOrderStore((s) => s.startOperation);
  const completeOperation = useManufacturingWorkOrderStore((s) => s.completeOperation);
  const [outputQty, setOutputQty] = useState("10");

  const progressPct =
    live.quantity === 0 ? 0 : Math.round((live.quantityProduced / live.quantity) * 100);
  const activeOp = live.operations.find((o) => o.status === "in_progress");
  const allMaterialsIssued = live.materials.every(
    (m) => m.quantityIssued >= m.quantityRequired,
  );
  const canAct = live.status === "in_progress";

  const logEntries = useMemo(
    () => [...(live.shopFloorLog ?? [])].reverse().slice(0, 12),
    [live.shopFloorLog],
  );

  return (
    <div className="space-y-4">
      {!canAct && live.status !== "done" && (
        <p className="rounded-lg border border-dashed border-input bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          Shop floor actions unlock after you <strong>Release</strong> and <strong>Start</strong> the
          work order from the drawer header.
        </p>
      )}

      {live.status === "done" && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-800 dark:text-emerald-300">
          Production complete — {live.quantityProduced} units received to {live.warehouse}.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-input p-3">
          <p className="text-[11px] font-medium text-muted-foreground">Output progress</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {live.quantityProduced}
            <span className="text-base font-normal text-muted-foreground"> / {live.quantity}</span>
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">{progressPct}% of planned qty</p>
          {canAct && (
            <div className="mt-3 flex gap-2">
              <Input
                type="number"
                min={1}
                max={live.quantity - live.quantityProduced}
                value={outputQty}
                onChange={(e) => setOutputQty(e.target.value)}
                className="h-8 w-24 text-xs"
              />
              <Button
                size="sm"
                className="h-8 flex-1 text-xs"
                onClick={() => recordOutput(live.id, Number(outputQty))}
              >
                Record output
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-input p-3">
          <p className="text-[11px] font-medium text-muted-foreground">Current operation</p>
          {activeOp ? (
            <>
              <p className="mt-1 text-sm font-semibold">{activeOp.name}</p>
              <p className="text-xs text-muted-foreground">
                Seq {activeOp.sequence} · {activeOp.workCenter} · {activeOp.durationMin} min
              </p>
              {canAct && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 h-8 w-full text-xs"
                  onClick={() => completeOperation(live.id, activeOp.id)}
                >
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Complete step
                </Button>
              )}
            </>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              {live.operations.every((o) => o.status === "done")
                ? "All operations done — use Complete WO in header."
                : "No operation running — start the next step below."}
            </p>
          )}
        </div>
      </div>

      {canAct && (
        <div className="rounded-lg border border-input p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold">Quick actions</p>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              disabled={allMaterialsIssued}
              onClick={() => issueMaterials(live.id)}
            >
              <Truck className="mr-1.5 h-3.5 w-3.5" /> Issue all materials
            </Button>
          </div>
          <div className="space-y-2">
            {live.operations.map((op) => {
              const prevDone = live.operations
                .filter((o) => o.sequence < op.sequence)
                .every((o) => o.status === "done");
              const canStart =
                op.status === "pending" && prevDone && !activeOp;
              return (
                <div
                  key={op.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-input bg-muted/20 px-2.5 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">
                      {op.sequence}. {op.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{op.workCenter}</p>
                  </div>
                  <Badge variant={operationStatusBadgeVariant(op.status)} className="text-[10px] capitalize">
                    {op.status.replace(/_/g, " ")}
                  </Badge>
                  {canStart && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-7 text-[10px]"
                      onClick={() => startOperation(live.id, op.id)}
                    >
                      <Play className="mr-1 h-3 w-3" /> Start
                    </Button>
                  )}
                  {op.status === "in_progress" && (
                    <Button
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={() => completeOperation(live.id, op.id)}
                    >
                      <Square className="mr-1 h-3 w-3" /> Complete
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold">Shop floor log</p>
        {logEntries.length === 0 ? (
          <p className="text-xs text-muted-foreground">No events yet — actions appear here.</p>
        ) : (
          <ul className="space-y-2">
            {logEntries.map((entry) => (
              <li
                key={entry.id}
                className="flex gap-2 rounded-md border border-input bg-card px-2.5 py-2 text-xs"
              >
                <span className="shrink-0" aria-hidden>
                  {shopFloorLogIcon(entry.type)}
                </span>
                <div className="min-w-0 flex-1">
                  <p>{entry.message}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(entry.at).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {canAct && !allMaterialsIssued && (
        <p className="flex items-center gap-1.5 text-[10px] text-amber-700 dark:text-amber-400">
          <Package className="h-3 w-3" />
          Materials partially issued — issue from Materials tab or Issue all above.
        </p>
      )}
    </div>
  );
}
