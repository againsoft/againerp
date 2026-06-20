"use client";

import { useState } from "react";
import { Edit2, Wrench, X } from "lucide-react";
import { toast } from "sonner";
import {
  formatBdt,
  getAssetPartsUsage,
  getAssetServiceHistory,
  SERVICE_ASSET_CATEGORY_LABELS,
  SERVICE_ASSET_STATUS_LABELS,
  type ServiceAsset,
} from "@/lib/mock-data/service";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type TabId = "details" | "history" | "parts";

function statusVariant(status: ServiceAsset["status"]): "success" | "warning" | "muted" {
  if (status === "active") return "success";
  if (status === "in_repair") return "warning";
  return "muted";
}

type Props = {
  open: boolean;
  asset: ServiceAsset | null;
  onClose: () => void;
  onEdit: (asset: ServiceAsset) => void;
};

export function ServiceAssetViewSheet({ open, asset, onClose, onEdit }: Props) {
  const [tab, setTab] = useState<TabId>("details");

  if (!asset) return null;

  const history = getAssetServiceHistory(asset.id);
  const parts = getAssetPartsUsage(asset.id);
  const totalServiceCost = history.reduce((s, h) => s + h.amount, 0);
  const totalPartsCost = parts.reduce((s, p) => s + p.cost * p.qty, 0);
  const warrantyActive = asset.warrantyEndDate ? new Date(asset.warrantyEndDate) >= new Date("2026-06-21") : false;

  const tabs: { id: TabId; label: string; badge?: number }[] = [
    { id: "details", label: "Details" },
    { id: "history", label: "Service History", badge: history.length },
    { id: "parts", label: "Parts & Cost", badge: parts.length },
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
                  <Badge variant={statusVariant(asset.status)} className="text-[10px]">
                    {SERVICE_ASSET_STATUS_LABELS[asset.status]}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {SERVICE_ASSET_CATEGORY_LABELS[asset.category]}
                  </Badge>
                  <span className="font-mono text-[10px] text-muted-foreground">{asset.assetTag}</span>
                </div>
                <h2 className="text-base font-semibold leading-snug">{asset.name}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{asset.customer}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 px-2.5 text-xs"
                  onClick={() => {
                    onClose();
                    onEdit(asset);
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
            {tab === "details" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Brand / Model</p>
                    <p className="mt-0.5 font-medium">{asset.brand} {asset.model}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Serial</p>
                    <p className="mt-0.5 font-mono font-medium">{asset.serialNumber ?? "—"}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Warranty</p>
                    <p className={cn("mt-0.5 font-medium", warrantyActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                      {asset.warrantyEndDate ?? "None"}
                      {asset.warrantyEndDate && (warrantyActive ? " · Active" : " · Expired")}
                    </p>
                  </div>
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Registered</p>
                    <p className="mt-0.5 font-medium">{asset.registeredAt}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-input p-3">
                  <p className="text-muted-foreground">Location</p>
                  <p className="mt-0.5 font-medium">{asset.location}</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-input p-3 text-center">
                    <p className="text-muted-foreground">Services</p>
                    <p className="mt-0.5 text-lg font-semibold tabular-nums">{history.length}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3 text-center">
                    <p className="text-muted-foreground">Service revenue</p>
                    <p className="mt-0.5 text-lg font-semibold tabular-nums">{formatBdt(totalServiceCost)}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3 text-center">
                    <p className="text-muted-foreground">Parts cost</p>
                    <p className="mt-0.5 text-lg font-semibold tabular-nums">{formatBdt(totalPartsCost)}</p>
                  </div>
                </div>

                {asset.status !== "retired" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => toast.info("Create service order from asset (prototype)")}
                  >
                    <Wrench className="h-3.5 w-3.5" />
                    Create Service Order
                  </Button>
                )}
              </div>
            )}

            {tab === "history" && (
              <div className="space-y-2">
                {history.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-input p-6 text-center text-muted-foreground">
                    No service history yet.
                  </p>
                ) : (
                  history.map((h) => (
                    <div key={h.id} className="rounded-lg border border-input p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-mono text-[10px] text-muted-foreground">{h.orderNumber}</p>
                          <p className="mt-0.5 font-medium">{h.service}</p>
                          <p className="mt-1 text-muted-foreground">{h.technician} · {h.date}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold tabular-nums">{formatBdt(h.amount)}</p>
                          <Badge variant={h.status === "completed" ? "success" : h.status === "in_progress" ? "warning" : "secondary"} className="mt-1 text-[9px] capitalize">
                            {h.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === "parts" && (
              <div className="space-y-3">
                {parts.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-input p-6 text-center text-muted-foreground">
                    No parts consumed on this asset yet.
                  </p>
                ) : (
                  <>
                    <table className="w-full border border-input rounded-lg overflow-hidden">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-2 py-1.5 text-left font-medium">Part</th>
                          <th className="px-2 py-1.5 text-right font-medium">Qty</th>
                          <th className="px-2 py-1.5 text-right font-medium">Cost</th>
                          <th className="px-2 py-1.5 text-left font-medium">Order</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parts.map((p) => (
                          <tr key={p.id} className="border-t border-border">
                            <td className="px-2 py-1.5">{p.part}</td>
                            <td className="px-2 py-1.5 text-right tabular-nums">{p.qty}</td>
                            <td className="px-2 py-1.5 text-right tabular-nums">{formatBdt(p.cost * p.qty)}</td>
                            <td className="px-2 py-1.5 font-mono text-[10px]">{p.orderNumber}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-border font-semibold">
                          <td className="px-2 py-1.5" colSpan={2}>Total parts cost</td>
                          <td className="px-2 py-1.5 text-right tabular-nums">{formatBdt(totalPartsCost)}</td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                    <p className="text-muted-foreground">
                      Combined service + parts: {formatBdt(totalServiceCost + totalPartsCost)}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
