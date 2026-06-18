"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle, Pencil, X } from "lucide-react";
import {
  ROUTING_STATUS_LABELS,
  type ManufacturingRouting,
} from "@/lib/mock-data/manufacturing-routings";
import { useManufacturingWorkCenterStore } from "@/lib/store/manufacturing-work-center-store";
import {
  routingStatusBadgeVariant,
  useManufacturingRoutingStore,
} from "@/lib/store/manufacturing-routing-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActivityTriggerButton } from "@/components/activity/activity-trigger-button";

type Tab = "overview" | "operations" | "usage";

type Props = {
  routing: ManufacturingRouting;
  inDialog?: boolean;
  onEdit?: (routing: ManufacturingRouting) => void;
  onClose?: () => void;
};

export function RoutingDetailContent({ routing, inDialog, onEdit, onClose }: Props) {
  const live = useManufacturingRoutingStore((s) => s.getById(routing.id)) ?? routing;
  const activateRouting = useManufacturingRoutingStore((s) => s.activateRouting);
  const obsoleteRouting = useManufacturingRoutingStore((s) => s.obsoleteRouting);
  const workCenters = useManufacturingWorkCenterStore((s) => s.workCenters);
  const [tab, setTab] = useState<Tab>("overview");

  const wcName = (code: string) => workCenters.find((wc) => wc.code === code)?.name ?? code;

  const sortedOps = useMemo(
    () => [...live.operations].sort((a, b) => a.sequence - b.sequence),
    [live.operations],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-input pb-3">
        <div className="flex flex-wrap items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold">{live.number}</h2>
              <Badge variant={routingStatusBadgeVariant(live.status)} className="text-[10px]">
                {ROUTING_STATUS_LABELS[live.status]}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {live.productName} · {live.productSku}
              {live.bomNumber && ` · BOM ${live.bomNumber}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <ActivityTriggerButton
              entity={{
                type: "manufacturing_routing",
                id: live.id,
                label: live.number,
                subtitle: live.productName,
              }}
              className="h-7 w-7"
            />
            {onEdit && live.status !== "obsolete" && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => onEdit(live)}
              >
                <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
              </Button>
            )}
            {live.status === "draft" && (
              <Button size="sm" className="h-7 px-2 text-xs" onClick={() => activateRouting(live.id)}>
                <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Activate
              </Button>
            )}
            {live.status === "active" && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => obsoleteRouting(live.id)}
              >
                Mark obsolete
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
            <span className="text-muted-foreground">Operations </span>
            <span className="font-semibold">{live.operations.length}</span>
          </span>
          <span className="text-muted-foreground">·</span>
          <span>
            <span className="text-muted-foreground">Total time </span>
            <span className="font-medium">{live.totalDurationMin} min</span>
          </span>
          <span className="text-muted-foreground">·</span>
          <span>
            <span className="text-muted-foreground">Version </span>
            <span className="font-medium">{live.version}</span>
          </span>
          <span className="text-muted-foreground">·</span>
          <span>
            <span className="text-muted-foreground">Effective </span>
            <span className="font-medium">{live.effectiveFrom}</span>
          </span>
        </div>
      </div>

      <div className="mt-3 flex shrink-0 gap-1 rounded-lg border border-input bg-muted/30 p-1">
        {(["overview", "operations", "usage"] as Tab[]).map((t) => (
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
                { label: "Product", value: live.productName },
                { label: "SKU", value: live.productSku },
                { label: "Linked BOM", value: live.bomNumber ?? "—" },
                { label: "Status", value: ROUTING_STATUS_LABELS[live.status] },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-input px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
            {live.bomId && (
              <Button size="sm" variant="outline" className="h-8" asChild>
                <Link href={`/manufacturing/boms?view=${live.bomId}`}>View linked BOM</Link>
              </Button>
            )}
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
                  <th className="px-3 py-2 font-medium text-right">Setup</th>
                  <th className="px-3 py-2 font-medium text-right">Run</th>
                  <th className="px-3 py-2 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {sortedOps.map((op) => (
                  <tr key={op.id} className="border-b last:border-0">
                    <td className="px-3 py-2">{op.sequence}</td>
                    <td className="px-3 py-2 font-medium">{op.name}</td>
                    <td className="px-3 py-2">
                      {workCenters.find((wc) => wc.code === op.workCenterCode) ? (
                        <Link
                          href={`/manufacturing/work-centers?view=${workCenters.find((wc) => wc.code === op.workCenterCode)!.id}`}
                          className="text-primary hover:underline"
                        >
                          {op.workCenterCode}
                        </Link>
                      ) : (
                        <span>{op.workCenterCode}</span>
                      )}
                      <p className="text-[10px] text-muted-foreground">{wcName(op.workCenterCode)}</p>
                    </td>
                    <td className="px-3 py-2 text-right">{op.setupMin} min</td>
                    <td className="px-3 py-2 text-right">{op.durationMin} min</td>
                    <td className="px-3 py-2 text-right font-medium">
                      {op.setupMin + op.durationMin} min
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t bg-muted/20 text-xs font-semibold">
                <tr>
                  <td colSpan={5} className="px-3 py-2 text-right text-muted-foreground">
                    Routing total
                  </td>
                  <td className="px-3 py-2 text-right">{live.totalDurationMin} min</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {tab === "usage" && (
          <div className="rounded-lg border border-input bg-card p-4 text-xs text-muted-foreground">
            Active routings drive default operation sequences on new work orders. When a WO is
            released, operations copy from routing <code className="text-foreground">{live.number}</code>{" "}
            (mock). Link BOM and routing by product SKU in production planning.
          </div>
        )}
      </div>
    </div>
  );
}
