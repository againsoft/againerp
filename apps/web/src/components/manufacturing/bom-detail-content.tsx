"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Copy, Pencil, X } from "lucide-react";
import {
  BOM_TYPE_LABELS,
  type BillOfMaterials,
} from "@/lib/mock-data/manufacturing-boms";
import {
  STANDARD_COST_BATCH_SIZE,
  estimateProductCost,
} from "@/lib/mock-data/manufacturing-cost";
import {
  bomTypeBadgeVariant,
  useManufacturingBomStore,
} from "@/lib/store/manufacturing-bom-store";
import { useManufacturingWorkOrderStore } from "@/lib/store/manufacturing-work-order-store";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActivityTriggerButton } from "@/components/activity/activity-trigger-button";
import { BomCostPanel } from "@/components/manufacturing/bom-cost-panel";

type Tab = "overview" | "components" | "costing" | "usage";

type Props = {
  bom: BillOfMaterials;
  inDialog?: boolean;
  onEdit?: (bom: BillOfMaterials) => void;
  onClose?: () => void;
  onDuplicated?: (bom: BillOfMaterials) => void;
};

export function BomDetailContent({ bom, inDialog, onEdit, onClose, onDuplicated }: Props) {
  const live = useManufacturingBomStore((s) => s.getById(bom.id)) ?? bom;
  const duplicateBom = useManufacturingBomStore((s) => s.duplicateBom);
  const workOrders = useManufacturingWorkOrderStore((s) => s.workOrders);
  const [tab, setTab] = useState<Tab>("overview");

  const linkedOrders = useMemo(
    () => workOrders.filter((wo) => wo.bomId === live.id),
    [workOrders, live.id],
  );

  const costEstimate = useMemo(
    () => estimateProductCost(live, STANDARD_COST_BATCH_SIZE),
    [live],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-input pb-3">
        <div className="flex flex-wrap items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold">{live.number}</h2>
              <Badge variant={bomTypeBadgeVariant(live.type)} className="text-[10px]">
                {BOM_TYPE_LABELS[live.type]}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {live.productName} · {live.productSku} · {live.version}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <ActivityTriggerButton
              entity={{
                type: "manufacturing_bom",
                id: live.id,
                label: live.number,
                subtitle: live.productName,
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
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => {
                const copy = duplicateBom(live.id);
                if (copy) onDuplicated?.(copy);
              }}
            >
              <Copy className="mr-1.5 h-3.5 w-3.5" /> Duplicate
            </Button>
            {onClose && (
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Close" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 rounded-md border border-input bg-muted/40 px-2.5 py-1.5 text-xs">
          <span>
            <span className="text-muted-foreground">Std cost </span>
            <span className="font-semibold">{formatCurrency(costEstimate.totalCostPerUnit)}/unit</span>
          </span>
          <span className="text-muted-foreground">·</span>
          <span>
            <span className="text-muted-foreground">Components </span>
            <span className="font-semibold">{live.lines.length}</span>
          </span>
          <span className="text-muted-foreground">·</span>
          <span>
            <span className="text-muted-foreground">Effective </span>
            <span className="font-medium">{live.effectiveFrom}</span>
          </span>
          <span className="text-muted-foreground">·</span>
          <span>
            <span className="text-muted-foreground">Work orders </span>
            <span className="font-medium">{linkedOrders.length}</span>
          </span>
        </div>
      </div>

      <div className="mt-3 flex shrink-0 gap-1 rounded-lg border border-input bg-muted/30 p-1">
        {(["overview", "components", "costing", "usage"] as Tab[]).map((t) => (
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
                { label: "Finished product", value: live.productName },
                { label: "SKU", value: live.productSku },
                { label: "BOM type", value: BOM_TYPE_LABELS[live.type] },
                { label: "Version", value: live.version },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-input px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
            {live.type === "phantom" && (
              <div className="rounded-lg border border-secondary/30 bg-secondary/5 px-3 py-2 text-xs text-muted-foreground">
                Phantom BOM — components explode to parent work order at release; no separate stock move.
              </div>
            )}
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
              <p className="text-[11px] font-medium text-muted-foreground">Standard cost estimate</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {formatCurrency(costEstimate.totalCostPerUnit)}
                <span className="text-sm font-normal text-muted-foreground"> / finished unit</span>
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Material {formatCurrency(costEstimate.materialCostPerUnit)} + Labor{" "}
                {formatCurrency(costEstimate.laborCostPerUnit)} + Overhead{" "}
                {formatCurrency(costEstimate.overheadCostPerUnit)}
              </p>
              <button
                type="button"
                className="mt-1 text-xs font-medium text-primary hover:underline"
                onClick={() => setTab("costing")}
              >
                View full costing breakdown →
              </button>
            </div>
          </div>
        )}

        {tab === "costing" && <BomCostPanel estimate={costEstimate} />}

        {tab === "components" && (
          <div className="overflow-x-auto rounded-lg border border-input">
            <table className="w-full min-w-[520px] text-xs">
              <thead className="border-b bg-muted/40 text-left text-[11px] text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Component</th>
                  <th className="px-3 py-2 font-medium">SKU</th>
                  <th className="px-3 py-2 font-medium text-right">Qty per unit</th>
                  <th className="px-3 py-2 font-medium text-right">Unit cost</th>
                  <th className="px-3 py-2 font-medium text-right">Line cost</th>
                  <th className="px-3 py-2 font-medium">UoM</th>
                </tr>
              </thead>
              <tbody>
                {costEstimate.materialLines.map((row) => (
                  <tr key={row.line.id} className="border-b last:border-0">
                    <td className="px-3 py-2 font-medium">{row.line.name || "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.line.sku || "—"}</td>
                    <td className="px-3 py-2 text-right font-medium">{row.line.quantity}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                      {formatCurrency(row.unitCost)}
                    </td>
                    <td className="px-3 py-2 text-right font-medium tabular-nums">
                      {formatCurrency(row.lineCostPerFg)}
                    </td>
                    <td className="px-3 py-2">{row.line.uom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "usage" && (
          <div className="space-y-3">
            {linkedOrders.length === 0 ? (
              <p className="rounded-lg border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
                No work orders linked to this BOM yet.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-input">
                <table className="w-full min-w-[480px] text-xs">
                  <thead className="border-b bg-muted/40 text-left text-[11px] text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">WO #</th>
                      <th className="px-3 py-2 font-medium">Qty</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linkedOrders.map((wo) => (
                      <tr key={wo.id} className="border-b last:border-0">
                        <td className="px-3 py-2">
                          <Link
                            href={`/manufacturing/work-orders?view=${wo.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {wo.number}
                          </Link>
                        </td>
                        <td className="px-3 py-2">{wo.quantity}</td>
                        <td className="px-3 py-2 capitalize">{wo.status.replace(/_/g, " ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Button size="sm" variant="outline" className="h-8" asChild>
              <Link href={`/manufacturing/work-orders?create=1`}>Create work order</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
