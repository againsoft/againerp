"use client";

import { Play, X } from "lucide-react";
import {
  MRP_RUN_STATUS_LABELS,
  MRP_SUGGESTION_STATUS_LABELS,
  MRP_SUGGESTION_TYPE_LABELS,
  type MrpRun,
} from "@/lib/mock-data/manufacturing-mrp";
import {
  mrpRunStatusBadgeVariant,
  mrpSuggestionStatusBadgeVariant,
  mrpSuggestionTypeBadgeVariant,
  useManufacturingMrpStore,
} from "@/lib/store/manufacturing-mrp-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  run: MrpRun;
  inDialog?: boolean;
  onClose?: () => void;
};

export function MrpDetailContent({ run, inDialog, onClose }: Props) {
  const live = useManufacturingMrpStore((s) => s.getById(run.id)) ?? run;
  const runMrp = useManufacturingMrpStore((s) => s.runMrp);
  const confirmSuggestion = useManufacturingMrpStore((s) => s.confirmSuggestion);

  const canRun = live.status === "draft" || live.status === "failed";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-input pb-3">
        <div className="flex flex-wrap items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold">{live.number}</h2>
              <Badge variant={mrpRunStatusBadgeVariant(live.status)} className="text-[10px]">
                {MRP_RUN_STATUS_LABELS[live.status]}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {live.warehouse} · {live.horizonDays}-day horizon · {live.runDate}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {canRun && (
              <Button size="sm" className="h-7 px-2 text-xs" onClick={() => runMrp(live.id)}>
                <Play className="mr-1.5 h-3.5 w-3.5" /> Run MRP
              </Button>
            )}
            {inDialog && onClose && (
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-3">
        <div className="mb-4 grid gap-2 sm:grid-cols-3">
          {[
            { label: "WO proposed", value: live.workOrdersProposed },
            { label: "PR proposed", value: live.purchaseRequestsProposed },
            { label: "Shortages", value: live.shortagesFound },
          ].map((item) => (
            <div key={item.label} className="rounded-md border border-input px-3 py-2">
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
              <p className="text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <p className="mb-1 text-[11px] font-medium text-muted-foreground">Demand sources</p>
          <div className="flex flex-wrap gap-1">
            {live.demandSources.map((src) => (
              <Badge key={src} variant="secondary" className="text-[10px]">
                {src}
              </Badge>
            ))}
          </div>
        </div>

        {live.notes && (
          <p className="mb-4 rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            {live.notes}
          </p>
        )}

        <p className="mb-2 text-xs font-semibold">Proposals ({live.suggestions.length})</p>
        {live.suggestions.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            {live.status === "running"
              ? "Calculating proposals…"
              : "No proposals — run MRP or check failed run log."}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-input">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-input bg-muted/30 text-left text-[10px] text-muted-foreground">
                  <th className="px-2 py-1.5">Type</th>
                  <th className="px-2 py-1.5">Product / SKU</th>
                  <th className="px-2 py-1.5">Qty</th>
                  <th className="px-2 py-1.5">Due</th>
                  <th className="px-2 py-1.5">Source</th>
                  <th className="px-2 py-1.5">Status</th>
                  <th className="px-2 py-1.5"></th>
                </tr>
              </thead>
              <tbody>
                {live.suggestions.map((sg) => (
                  <tr key={sg.id} className="border-b border-input last:border-0">
                    <td className="px-2 py-2">
                      <Badge variant={mrpSuggestionTypeBadgeVariant(sg.type)} className="text-[10px]">
                        {MRP_SUGGESTION_TYPE_LABELS[sg.type]}
                      </Badge>
                    </td>
                    <td className="px-2 py-2">
                      <p className="font-medium">{sg.productName}</p>
                      <p className="text-[10px] text-muted-foreground">{sg.sku}</p>
                    </td>
                    <td className="px-2 py-2">{sg.quantity}</td>
                    <td className="px-2 py-2">{sg.dueDate}</td>
                    <td className="px-2 py-2 text-muted-foreground">{sg.source}</td>
                    <td className="px-2 py-2">
                      <Badge variant={mrpSuggestionStatusBadgeVariant(sg.status)} className="text-[10px]">
                        {MRP_SUGGESTION_STATUS_LABELS[sg.status]}
                      </Badge>
                    </td>
                    <td className="px-2 py-2">
                      {sg.status === "proposed" && live.status === "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-[10px]"
                          onClick={() => confirmSuggestion(live.id, sg.id)}
                        >
                          Confirm
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
