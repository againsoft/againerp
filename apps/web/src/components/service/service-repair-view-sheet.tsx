"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink, X } from "lucide-react";
import { toast } from "sonner";
import {
  daysInRepairStage,
  formatBdt,
  getRepairParts,
  SERVICE_PRIORITY_LABELS,
  SERVICE_REPAIR_STAGE_LABELS,
  SERVICE_REPAIR_STAGES,
  type ServiceRepairStage,
  type ServiceRepairTicket,
} from "@/lib/mock-data/service";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type TabId = "details" | "diagnosis" | "parts" | "cost";

type Props = {
  open: boolean;
  ticket: ServiceRepairTicket | null;
  onClose: () => void;
  onStageChange: (ticketId: string, stage: ServiceRepairStage) => void;
};

export function ServiceRepairViewSheet({ open, ticket, onClose, onStageChange }: Props) {
  const [tab, setTab] = useState<TabId>("details");

  if (!ticket) return null;

  const parts = getRepairParts(ticket.id);
  const partsTotal = parts.reduce((s, p) => s + p.cost * p.qty, 0);
  const days = daysInRepairStage(ticket.stageEnteredAt);
  const totalCost = (ticket.partsCost ?? partsTotal) + (ticket.laborCost ?? 0);

  const tabs: { id: TabId; label: string; badge?: number }[] = [
    { id: "details", label: "Details" },
    { id: "diagnosis", label: "Diagnosis" },
    { id: "parts", label: "Parts", badge: parts.length },
    { id: "cost", label: "Quote & Cost" },
  ];

  const advanceStage = () => {
    const idx = SERVICE_REPAIR_STAGES.indexOf(ticket.stage);
    if (idx < 0 || idx >= SERVICE_REPAIR_STAGES.length - 1) return;
    const next = SERVICE_REPAIR_STAGES[idx + 1];
    onStageChange(ticket.id, next);
    toast.success(`Advanced to ${SERVICE_REPAIR_STAGE_LABELS[next]}`);
  };

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
                  <Badge variant="secondary" className="text-[10px]">
                    {SERVICE_REPAIR_STAGE_LABELS[ticket.stage]}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {SERVICE_PRIORITY_LABELS[ticket.priority]}
                  </Badge>
                  <span className="font-mono text-[10px] text-muted-foreground">{ticket.ticketNumber}</span>
                </div>
                <h2 className="text-base font-semibold leading-snug">{ticket.assetName}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{ticket.customer}</p>
              </div>
              <button type="button" className="rounded-md p-1 hover:bg-accent" onClick={onClose} aria-label="Close">
                <X className="h-4 w-4" />
              </button>
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
                    <p className="text-muted-foreground">Days in stage</p>
                    <p className={cn("mt-0.5 text-lg font-semibold tabular-nums", days >= 5 && "text-amber-700 dark:text-amber-400")}>
                      {days}
                    </p>
                  </div>
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Technician</p>
                    <p className="mt-0.5 font-medium">{ticket.technician ?? "Unassigned"}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Stage since</p>
                    <p className="mt-0.5 font-medium">{ticket.stageEnteredAt}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Quote</p>
                    <p className="mt-0.5 font-semibold tabular-nums">{ticket.quoteAmount != null ? formatBdt(ticket.quoteAmount) : "—"}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-input p-3">
                  <p className="text-muted-foreground">Reported problem</p>
                  <p className="mt-0.5">{ticket.problem}</p>
                </div>

                <div>
                  <label className="text-[11px] text-muted-foreground">Move to stage</label>
                  <Select
                    value={ticket.stage}
                    onChange={(e) => onStageChange(ticket.id, e.target.value as ServiceRepairStage)}
                    className="mt-1 h-8 w-full text-xs"
                    disabled={ticket.stage === "delivered"}
                  >
                    {SERVICE_REPAIR_STAGES.map((s) => (
                      <option key={s} value={s}>{SERVICE_REPAIR_STAGE_LABELS[s]}</option>
                    ))}
                  </Select>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ticket.stage !== "delivered" && (
                    <Button size="sm" className="gap-1.5" onClick={advanceStage}>
                      Advance stage
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {ticket.serviceOrderId && (
                    <Button variant="outline" size="sm" className="gap-1.5" asChild>
                      <Link href={`/service/orders?view=${ticket.serviceOrderId}`}>
                        <ExternalLink className="h-3.5 w-3.5" />
                        Service Order
                      </Link>
                    </Button>
                  )}
                  {ticket.assetId && (
                    <Button variant="outline" size="sm" className="gap-1.5" asChild>
                      <Link href={`/service/assets?view=${ticket.assetId}`}>
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Asset
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {tab === "diagnosis" && (
              <div className="space-y-3">
                {ticket.diagnosis ? (
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Technician diagnosis</p>
                    <p className="mt-0.5">{ticket.diagnosis}</p>
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-input p-6 text-center text-muted-foreground">
                    Diagnosis pending — assign technician and start inspection.
                  </p>
                )}
                {ticket.stage === "awaiting_approval" && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
                    <p className="font-medium text-amber-900 dark:text-amber-200">Awaiting customer approval</p>
                    <p className="mt-1 text-muted-foreground">Send quote via Sales or record verbal approval.</p>
                    <Button size="sm" className="mt-2" onClick={() => toast.success("Approval recorded (prototype)")}>
                      Record approval
                    </Button>
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={() => toast.info("Add checklist item (prototype)")}>
                  + Add checklist item
                </Button>
              </div>
            )}

            {tab === "parts" && (
              <div className="space-y-3">
                {parts.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-input p-6 text-center text-muted-foreground">
                    No parts issued yet.
                  </p>
                ) : (
                  <table className="w-full overflow-hidden rounded-lg border border-input">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-2 py-1.5 text-left font-medium">Part</th>
                        <th className="px-2 py-1.5 text-right font-medium">Qty</th>
                        <th className="px-2 py-1.5 text-right font-medium">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parts.map((p) => (
                        <tr key={p.id} className="border-t border-border">
                          <td className="px-2 py-1.5">{p.part}</td>
                          <td className="px-2 py-1.5 text-right tabular-nums">{p.qty}</td>
                          <td className="px-2 py-1.5 text-right tabular-nums">{formatBdt(p.cost * p.qty)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-border font-semibold">
                        <td className="px-2 py-1.5" colSpan={2}>Total parts</td>
                        <td className="px-2 py-1.5 text-right tabular-nums">{formatBdt(partsTotal)}</td>
                      </tr>
                    </tfoot>
                  </table>
                )}
                <Button variant="outline" size="sm" onClick={() => toast.info("Issue parts from inventory (prototype)")}>
                  + Issue parts
                </Button>
              </div>
            )}

            {tab === "cost" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-input p-3 text-center">
                    <p className="text-muted-foreground">Parts</p>
                    <p className="mt-0.5 text-lg font-semibold tabular-nums">{formatBdt(ticket.partsCost ?? partsTotal)}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3 text-center">
                    <p className="text-muted-foreground">Labor</p>
                    <p className="mt-0.5 text-lg font-semibold tabular-nums">{formatBdt(ticket.laborCost ?? 0)}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3 text-center">
                    <p className="text-muted-foreground">Quote total</p>
                    <p className="mt-0.5 text-lg font-semibold tabular-nums">{formatBdt(ticket.quoteAmount ?? totalCost)}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.info("Create sales quotation (prototype)")}>
                  Send quote to customer
                </Button>
                {ticket.stage === "ready" && (
                  <Button size="sm" onClick={() => toast.success("Invoice draft created (prototype)")}>
                    Create invoice
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
