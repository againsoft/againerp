"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Play, Send, Truck, X } from "lucide-react";
import { getBomById } from "@/lib/mock-data/manufacturing-boms";
import { estimateProductCost } from "@/lib/mock-data/manufacturing-cost";
import {
  WORK_ORDER_PRIORITY_LABELS,
  WORK_ORDER_STATUS_LABELS,
  type WorkOrder,
} from "@/lib/mock-data/manufacturing-work-orders";
import {
  operationStatusBadgeVariant,
  shopFloorLogIcon,
  useManufacturingWorkOrderStore,
  workOrderPriorityBadgeVariant,
  workOrderStatusBadgeVariant,
} from "@/lib/store/manufacturing-work-order-store";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActivityTriggerButton } from "@/components/activity/activity-trigger-button";
import { WorkOrderShopFloorTab } from "@/components/manufacturing/work-order-shop-floor-tab";
import { WorkOrderIntegrationPanel } from "@/components/manufacturing/work-order-integration-panel";

type Tab = "overview" | "shop-floor" | "materials" | "operations" | "activity";

type Props = {
  workOrder: WorkOrder;
  inDialog?: boolean;
  onEdit?: (wo: WorkOrder) => void;
  onClose?: () => void;
};

export function WorkOrderDetailContent({ workOrder, inDialog, onEdit, onClose }: Props) {
  const live = useManufacturingWorkOrderStore((s) => s.getById(workOrder.id)) ?? workOrder;
  const releaseWorkOrder = useManufacturingWorkOrderStore((s) => s.releaseWorkOrder);
  const startWorkOrder = useManufacturingWorkOrderStore((s) => s.startWorkOrder);
  const issueMaterials = useManufacturingWorkOrderStore((s) => s.issueMaterials);
  const issueMaterialLine = useManufacturingWorkOrderStore((s) => s.issueMaterialLine);
  const completeWorkOrder = useManufacturingWorkOrderStore((s) => s.completeWorkOrder);
  const startOperation = useManufacturingWorkOrderStore((s) => s.startOperation);
  const completeOperation = useManufacturingWorkOrderStore((s) => s.completeOperation);
  const [tab, setTab] = useState<Tab>(live.status === "in_progress" ? "shop-floor" : "overview");

  const progressPct =
    live.quantity === 0 ? 0 : Math.round((live.quantityProduced / live.quantity) * 100);
  const activeOp = live.operations.find((o) => o.status === "in_progress");
  const allOpsDone = live.operations.every((o) => o.status === "done");

  const costEstimate = useMemo(() => {
    const bom = getBomById(live.bomId);
    if (!bom) return null;
    return estimateProductCost(bom, Math.max(live.quantity, 1));
  }, [live.bomId, live.quantity]);

  const batchTotalCost = costEstimate
    ? Math.round(costEstimate.totalCostPerUnit * live.quantity * 100) / 100
    : null;

  const primaryAction = () => {
    if (live.status === "planned") {
      return (
        <Button size="sm" className="h-7 px-2 text-xs" onClick={() => releaseWorkOrder(live.id)}>
          <Send className="mr-1.5 h-3.5 w-3.5" /> Release
        </Button>
      );
    }
    if (live.status === "released") {
      return (
        <Button size="sm" className="h-7 px-2 text-xs" onClick={() => startWorkOrder(live.id)}>
          <Play className="mr-1.5 h-3.5 w-3.5" /> Start
        </Button>
      );
    }
    if (live.status === "in_progress") {
      return (
        <>
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2 text-xs"
            onClick={() => issueMaterials(live.id)}
          >
            <Truck className="mr-1.5 h-3.5 w-3.5" /> Issue materials
          </Button>
          <Button
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={!allOpsDone}
            title={allOpsDone ? undefined : "Complete all operations first"}
            onClick={() => completeWorkOrder(live.id)}
          >
            Complete WO
          </Button>
        </>
      );
    }
    return null;
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "shop-floor", label: "Shop floor" },
    { id: "materials", label: "Materials" },
    { id: "operations", label: "Operations" },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-input pb-3">
        <div className="flex flex-wrap items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold">{live.number}</h2>
              <Badge variant={workOrderStatusBadgeVariant(live.status)} className="text-[10px]">
                {WORK_ORDER_STATUS_LABELS[live.status]}
              </Badge>
              <Badge variant={workOrderPriorityBadgeVariant(live.priority)} className="text-[10px]">
                {WORK_ORDER_PRIORITY_LABELS[live.priority]}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {live.productName} · {live.productSku} · BOM {live.bomNumber}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <ActivityTriggerButton
              entity={{
                type: "manufacturing_work_order",
                id: live.id,
                label: live.number,
                subtitle: live.productName,
              }}
              className="h-7 w-7"
            />
            {onEdit && live.status !== "done" && live.status !== "cancelled" && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => onEdit(live)}
              >
                <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
              </Button>
            )}
            {primaryAction()}
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                aria-label="Close"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 rounded-md border border-input bg-muted/40 px-2.5 py-1.5 text-xs">
          <span>
            <span className="text-muted-foreground">Qty </span>
            <span className="font-semibold">
              {live.quantityProduced}/{live.quantity}
            </span>
          </span>
          <span className="text-muted-foreground">·</span>
          <span>
            <span className="text-muted-foreground">Progress </span>
            <span className="font-semibold">{progressPct}%</span>
          </span>
          {activeOp && (
            <>
              <span className="text-muted-foreground">·</span>
              <span>
                <span className="text-muted-foreground">Step </span>
                <span className="font-medium">{activeOp.name}</span>
              </span>
            </>
          )}
          <span className="text-muted-foreground">·</span>
          <span>
            <span className="text-muted-foreground">WH </span>
            <span className="font-medium">{live.warehouse}</span>
          </span>
        </div>
      </div>

      <div className="mt-3 flex shrink-0 gap-1 overflow-x-auto rounded-lg border border-input bg-muted/30 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              tab === t.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
              t.id === "shop-floor" && live.status === "in_progress" && tab !== t.id && "text-primary",
            )}
          >
            {t.label}
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
                { label: "Finished product", value: live.productName },
                { label: "SKU", value: live.productSku },
                { label: "BOM", value: live.bomNumber },
                { label: "Warehouse", value: live.warehouse },
                { label: "Schedule", value: `${live.plannedStart} → ${live.plannedEnd}` },
                {
                  label: "Operations",
                  value: `${live.operations.filter((o) => o.status === "done").length}/${live.operations.length} done`,
                },
                ...(costEstimate
                  ? [
                      {
                        label: "Std cost / unit",
                        value: formatCurrency(costEstimate.totalCostPerUnit),
                      },
                      {
                        label: `Batch cost (${live.quantity} pcs)`,
                        value: formatCurrency(batchTotalCost ?? 0),
                      },
                    ]
                  : []),
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-input px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
            {costEstimate && (
              <div className="rounded-lg border border-input px-3 py-2 text-xs">
                <p className="font-medium">Standard cost (this WO batch)</p>
                <p className="mt-1 text-muted-foreground">
                  Material {formatCurrency(costEstimate.materialCostPerUnit * live.quantity)} + Labor{" "}
                  {formatCurrency(costEstimate.laborCostPerUnit * live.quantity)} + Overhead{" "}
                  {formatCurrency(costEstimate.overheadCostPerUnit * live.quantity)} ={" "}
                  <span className="font-semibold text-foreground">
                    {formatCurrency(batchTotalCost ?? 0)}
                  </span>
                </p>
                <Link
                  href={`/manufacturing/boms?view=${live.bomId}`}
                  className="mt-1 inline-block text-primary hover:underline"
                >
                  Full BOM costing breakdown →
                </Link>
              </div>
            )}
            {live.status === "done" && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-800 dark:text-emerald-300">
                Production complete — {live.quantityProduced} units received to {live.warehouse}.
              </div>
            )}
          </div>
        )}

        {tab === "shop-floor" && <WorkOrderShopFloorTab workOrder={live} />}

        {tab === "materials" && (
          <div className="overflow-x-auto rounded-lg border border-input">
            <table className="w-full min-w-[560px] text-xs">
              <thead className="border-b bg-muted/40 text-left text-[11px] text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Component</th>
                  <th className="px-3 py-2 font-medium">SKU</th>
                  <th className="px-3 py-2 font-medium text-right">Required</th>
                  <th className="px-3 py-2 font-medium text-right">Issued</th>
                  <th className="px-3 py-2 font-medium">UoM</th>
                  {live.status === "in_progress" && (
                    <th className="px-3 py-2 font-medium text-right">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {live.materials.map((m) => {
                  const fullyIssued = m.quantityIssued >= m.quantityRequired;
                  return (
                    <tr key={m.id} className="border-b last:border-0">
                      <td className="px-3 py-2 font-medium">{m.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{m.sku}</td>
                      <td className="px-3 py-2 text-right">{m.quantityRequired}</td>
                      <td
                        className={cn(
                          "px-3 py-2 text-right font-medium",
                          !fullyIssued && "text-amber-700 dark:text-amber-400",
                        )}
                      >
                        {m.quantityIssued}
                      </td>
                      <td className="px-3 py-2">{m.uom}</td>
                      {live.status === "in_progress" && (
                        <td className="px-3 py-2 text-right">
                          {!fullyIssued && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-[10px]"
                              onClick={() => issueMaterialLine(live.id, m.id)}
                            >
                              Issue
                            </Button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === "operations" && (
          <div className="overflow-x-auto rounded-lg border border-input">
            <table className="w-full min-w-[600px] text-xs">
              <thead className="border-b bg-muted/40 text-left text-[11px] text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">Operation</th>
                  <th className="px-3 py-2 font-medium">Work center</th>
                  <th className="px-3 py-2 font-medium text-right">Min</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  {live.status === "in_progress" && (
                    <th className="px-3 py-2 font-medium text-right">Shop floor</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {live.operations.map((op) => {
                  const prevDone = live.operations
                    .filter((o) => o.sequence < op.sequence)
                    .every((o) => o.status === "done");
                  const canStart =
                    live.status === "in_progress" &&
                    op.status === "pending" &&
                    prevDone &&
                    !activeOp;
                  return (
                    <tr key={op.id} className="border-b last:border-0">
                      <td className="px-3 py-2">{op.sequence}</td>
                      <td className="px-3 py-2 font-medium">{op.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{op.workCenter}</td>
                      <td className="px-3 py-2 text-right">{op.durationMin}</td>
                      <td className="px-3 py-2">
                        <Badge
                          variant={operationStatusBadgeVariant(op.status)}
                          className="text-[10px] capitalize"
                        >
                          {op.status.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      {live.status === "in_progress" && (
                        <td className="px-3 py-2 text-right">
                          {canStart && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-7 text-[10px]"
                              onClick={() => startOperation(live.id, op.id)}
                            >
                              Start
                            </Button>
                          )}
                          {op.status === "in_progress" && (
                            <Button
                              size="sm"
                              className="h-7 text-[10px]"
                              onClick={() => completeOperation(live.id, op.id)}
                            >
                              Complete
                            </Button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === "activity" && (
          <div className="space-y-4">
            <WorkOrderIntegrationPanel workOrderId={live.id} />
            <section>
              <h4 className="mb-2 text-xs font-medium text-foreground">Shop floor log</h4>
              {(live.shopFloorLog ?? []).length > 0 ? (
                <ul className="space-y-2">
                  {[...(live.shopFloorLog ?? [])].reverse().map((entry) => (
                    <li
                      key={entry.id}
                      className="flex gap-2 rounded-md border border-input px-2.5 py-2 text-xs"
                    >
                      <span aria-hidden>{shopFloorLogIcon(entry.type)}</span>
                      <div>
                        <p>{entry.message}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(entry.at).toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No shop floor events logged yet.</p>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
