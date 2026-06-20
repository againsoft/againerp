"use client";

import { useState } from "react";
import { CheckCircle2, Edit2, ExternalLink, LogIn, LogOut, MapPin, Package, PenLine, ScanLine, X } from "lucide-react";
import { toast } from "sonner";
import {
  formatBdt,
  getWorkOrderNotes,
  getWorkOrderParts,
  SERVICE_PRIORITY_LABELS,
  SERVICE_WORK_ORDER_STATUS_LABELS,
  type ServiceWorkOrder,
} from "@/lib/mock-data/service";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

type TabId = "job" | "parts" | "notes" | "signoff";

function woStatusVariant(status: ServiceWorkOrder["status"]): "success" | "warning" | "muted" | "secondary" {
  if (status === "done") return "success";
  if (status === "in_progress") return "warning";
  if (status === "cancelled") return "muted";
  return "secondary";
}

type Props = {
  open: boolean;
  workOrder: ServiceWorkOrder | null;
  onClose: () => void;
  onEdit: (wo: ServiceWorkOrder) => void;
  onCheckIn: (wo: ServiceWorkOrder) => void;
  onComplete: (wo: ServiceWorkOrder) => void;
  onUpdate: (wo: ServiceWorkOrder) => void;
};

export function ServiceWorkOrderViewSheet({
  open,
  workOrder,
  onClose,
  onEdit,
  onCheckIn,
  onComplete,
  onUpdate,
}: Props) {
  const [tab, setTab] = useState<TabId>("job");
  const [noteDraft, setNoteDraft] = useState("");

  if (!workOrder) return null;

  const parts = getWorkOrderParts(workOrder.id);
  const notes = getWorkOrderNotes(workOrder.id);
  const partsTotal = parts.reduce((s, p) => s + p.cost * p.qty, 0);
  const isActive = workOrder.status !== "done" && workOrder.status !== "cancelled";
  const checkedIn = !!workOrder.actualStart;
  const checkedOut = !!workOrder.actualEnd;

  const tabs: { id: TabId; label: string; badge?: number }[] = [
    { id: "job", label: "Job" },
    { id: "parts", label: "Parts", badge: parts.length },
    { id: "notes", label: "Notes", badge: notes.length },
    { id: "signoff", label: "Sign-off" },
  ];

  const handleCheckOut = () => {
    onUpdate({
      ...workOrder,
      actualEnd: new Date().toISOString().slice(0, 16).replace("T", " "),
      checkOutLat: workOrder.checkInLat ?? 23.8103,
      checkOutLng: workOrder.checkInLng ?? 90.4125,
    });
    toast.success("Checked out — job time logged");
  };

  const handleAddNote = () => {
    if (!noteDraft.trim()) return;
    toast.success("Note added (prototype)");
    setNoteDraft("");
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
                  <Badge variant={woStatusVariant(workOrder.status)} className="text-[10px]">
                    {SERVICE_WORK_ORDER_STATUS_LABELS[workOrder.status]}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {SERVICE_PRIORITY_LABELS[workOrder.priority]}
                  </Badge>
                  <span className="font-mono text-[10px] text-muted-foreground">{workOrder.number}</span>
                </div>
                <h2 className="text-base font-semibold leading-snug">{workOrder.serviceName}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{workOrder.customer}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden h-7 gap-1 px-2.5 text-xs sm:inline-flex"
                  onClick={() => {
                    onClose();
                    onEdit(workOrder);
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
            {tab === "job" && (
              <div className="space-y-4">
                {isActive && (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {!checkedIn ? (
                      <Button
                        size="lg"
                        className="h-12 min-h-[44px] w-full gap-2 text-sm"
                        onClick={() => onCheckIn(workOrder)}
                      >
                        <LogIn className="h-5 w-5" />
                        Check In
                      </Button>
                    ) : !checkedOut ? (
                      <Button
                        variant="outline"
                        size="lg"
                        className="h-12 min-h-[44px] w-full gap-2 text-sm"
                        onClick={handleCheckOut}
                      >
                        <LogOut className="h-5 w-5" />
                        Check Out
                      </Button>
                    ) : null}
                    {checkedIn && !checkedOut && (
                      <Button
                        size="lg"
                        className="h-12 min-h-[44px] w-full gap-2 text-sm sm:col-span-2"
                        onClick={() => onComplete(workOrder)}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        Complete Job
                      </Button>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Service order</p>
                    <p className="mt-0.5 font-mono font-medium">{workOrder.serviceOrderNumber}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Technician</p>
                    <p className="mt-0.5 font-medium">{workOrder.technician}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Scheduled</p>
                    <p className="mt-0.5 font-medium">{workOrder.scheduledStart}</p>
                    <p className="text-muted-foreground">→ {workOrder.scheduledEnd}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Actual</p>
                    <p className="mt-0.5 font-medium">{workOrder.actualStart ?? "—"}</p>
                    <p className="text-muted-foreground">{workOrder.actualEnd ?? (checkedIn ? "In progress" : "—")}</p>
                  </div>
                </div>

                {workOrder.assetName && (
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Asset</p>
                    <p className="mt-0.5 font-medium">{workOrder.assetName}</p>
                  </div>
                )}

                {(workOrder.checkInLat != null || workOrder.location) && (
                  <div className="rounded-lg border border-input p-3">
                    <p className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      Location
                    </p>
                    {workOrder.location && <p className="mt-0.5 font-medium">{workOrder.location}</p>}
                    {workOrder.checkInLat != null && (
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                        GPS: {workOrder.checkInLat.toFixed(4)}, {workOrder.checkInLng?.toFixed(4)}
                      </p>
                    )}
                  </div>
                )}

                {workOrder.workNotes && (
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Summary</p>
                    <p className="mt-0.5">{workOrder.workNotes}</p>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => toast.info(`Open ${workOrder.serviceOrderNumber} (prototype)`)}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Service Order
                </Button>
              </div>
            )}

            {tab === "parts" && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="h-11 min-h-[44px] gap-1.5 sm:h-8"
                    onClick={() => toast.info("Scan barcode (prototype)")}
                  >
                    <ScanLine className="h-4 w-4" />
                    Scan Part
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-11 min-h-[44px] gap-1.5 sm:h-8"
                    onClick={() => toast.info("Issue from inventory (prototype)")}
                  >
                    <Package className="h-4 w-4" />
                    Issue Parts
                  </Button>
                </div>

                {parts.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-input p-6 text-center text-muted-foreground">
                    No parts issued on this work order yet.
                  </p>
                ) : (
                  <>
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
                          <td className="px-2 py-1.5" colSpan={2}>Total</td>
                          <td className="px-2 py-1.5 text-right tabular-nums">{formatBdt(partsTotal)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </>
                )}
              </div>
            )}

            {tab === "notes" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  {notes.map((n) => (
                    <div key={n.id} className="rounded-lg border border-input p-3">
                      <p className="text-[10px] text-muted-foreground">{n.at} · {n.author}</p>
                      <p className="mt-0.5">{n.text}</p>
                    </div>
                  ))}
                </div>
                {isActive && (
                  <div className="rounded-lg border border-input p-3">
                    <Textarea
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder="Add technician log entry…"
                      rows={3}
                      className="text-xs"
                    />
                    <Button size="sm" className="mt-2 h-11 min-h-[44px] w-full sm:h-8 sm:w-auto" onClick={handleAddNote}>
                      Add note
                    </Button>
                  </div>
                )}
              </div>
            )}

            {tab === "signoff" && (
              <div className="space-y-4">
                <div
                  className={cn(
                    "flex min-h-[120px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-6",
                    workOrder.signatureCaptured
                      ? "border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20"
                      : "border-input bg-muted/20"
                  )}
                >
                  {workOrder.signatureCaptured ? (
                    <>
                      <PenLine className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      <p className="mt-2 font-medium text-emerald-700 dark:text-emerald-300">Signature captured</p>
                      <p className="mt-0.5 text-muted-foreground">Customer signed off on completion</p>
                    </>
                  ) : (
                    <>
                      <PenLine className="h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 font-medium">Customer signature</p>
                      <p className="mt-0.5 text-center text-muted-foreground">
                        Tap below to capture signature on mobile
                      </p>
                      {isActive && (
                        <Button
                          size="sm"
                          className="mt-4 h-11 min-h-[44px] w-full max-w-xs gap-1.5"
                          onClick={() => {
                            onUpdate({ ...workOrder, signatureCaptured: true });
                            toast.success("Signature captured (prototype)");
                          }}
                        >
                          <PenLine className="h-4 w-4" />
                          Capture Signature
                        </Button>
                      )}
                    </>
                  )}
                </div>

                {workOrder.status === "done" && (
                  <p className="rounded-lg border border-input bg-muted/30 p-3 text-muted-foreground">
                    Work order closed{workOrder.actualEnd ? ` at ${workOrder.actualEnd}` : ""}.
                  </p>
                )}
              </div>
            )}
          </div>

          {isActive && tab === "job" && (
            <div className="sticky bottom-0 shrink-0 border-t border-border bg-background p-3 sm:hidden">
              <div className="flex gap-2">
                {!checkedIn ? (
                  <Button className="h-12 min-h-[44px] flex-1 gap-2" onClick={() => onCheckIn(workOrder)}>
                    <LogIn className="h-4 w-4" />
                    Check In
                  </Button>
                ) : (
                  <>
                    {!checkedOut && (
                      <Button variant="outline" className="h-12 min-h-[44px] flex-1 gap-2" onClick={handleCheckOut}>
                        <LogOut className="h-4 w-4" />
                        Check Out
                      </Button>
                    )}
                    <Button className="h-12 min-h-[44px] flex-1 gap-2" onClick={() => onComplete(workOrder)}>
                      <CheckCircle2 className="h-4 w-4" />
                      Complete
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
