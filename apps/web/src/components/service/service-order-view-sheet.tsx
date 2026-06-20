"use client";

import { useState } from "react";
import { Edit2, ExternalLink, X } from "lucide-react";
import { toast } from "sonner";
import {
  formatBdt,
  getOrderSlaLabel,
  getServiceOrderActivity,
  getServiceOrderLines,
  getServiceOrderParts,
  getServiceOrderSla,
  getServiceOrderWorkOrders,
  SERVICE_BILLING_LABELS,
  SERVICE_ORDER_BILLING_LABELS,
  SERVICE_ORDER_STATUS_LABELS,
  SERVICE_PRIORITY_LABELS,
  type ServiceOrder,
} from "@/lib/mock-data/service";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type TabId = "details" | "lines" | "workOrders" | "parts" | "activity" | "sla";

function orderStatusVariant(status: ServiceOrder["status"]): "success" | "warning" | "muted" | "secondary" {
  if (status === "completed") return "success";
  if (status === "in_progress" || status === "assigned") return "warning";
  if (status === "cancelled" || status === "draft") return "muted";
  return "secondary";
}

function priorityVariant(priority: ServiceOrder["priority"]): "warning" | "secondary" | "muted" {
  if (priority === "critical" || priority === "high") return "warning";
  if (priority === "medium") return "secondary";
  return "muted";
}

type Props = {
  open: boolean;
  order: ServiceOrder | null;
  onClose: () => void;
  onEdit: (order: ServiceOrder) => void;
};

export function ServiceOrderViewSheet({ open, order, onClose, onEdit }: Props) {
  const [tab, setTab] = useState<TabId>("details");

  if (!order) return null;

  const lines = getServiceOrderLines(order.id);
  const workOrders = getServiceOrderWorkOrders(order.id);
  const parts = getServiceOrderParts(order.id);
  const activity = getServiceOrderActivity(order.id);
  const sla = getServiceOrderSla(order.id);
  const slaLabel = getOrderSlaLabel(order.id);
  const partsTotal = parts.reduce((s, p) => s + p.cost * p.qty, 0);
  const linesTotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);

  const tabs: { id: TabId; label: string; badge?: number }[] = [
    { id: "details", label: "Details" },
    { id: "lines", label: "Lines", badge: lines.length },
    { id: "workOrders", label: "Work Orders", badge: workOrders.length },
    { id: "parts", label: "Parts", badge: parts.length },
    { id: "activity", label: "Activity", badge: activity.length },
    { id: "sla", label: "SLA" },
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
                  <Badge variant={orderStatusVariant(order.status)} className="text-[10px]">
                    {SERVICE_ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                  <Badge variant={priorityVariant(order.priority)} className="text-[10px]">
                    {SERVICE_PRIORITY_LABELS[order.priority]}
                  </Badge>
                  {slaLabel !== "—" && (
                    <Badge
                      variant={slaLabel === "On track" ? "success" : "warning"}
                      className="text-[10px]"
                    >
                      SLA: {slaLabel}
                    </Badge>
                  )}
                  <span className="font-mono text-[10px] text-muted-foreground">{order.number}</span>
                </div>
                <h2 className="text-base font-semibold leading-snug">{order.serviceName}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{order.customer}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 px-2.5 text-xs"
                  onClick={() => {
                    onClose();
                    onEdit(order);
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
                    <p className="text-muted-foreground">Schedule</p>
                    <p className="mt-0.5 font-medium">
                      {order.scheduleDate}
                      {order.scheduleTime ? ` · ${order.scheduleTime}` : ""}
                    </p>
                  </div>
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Technician</p>
                    <p className="mt-0.5 font-medium">{order.technician ?? "Unassigned"}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Billing</p>
                    <p className="mt-0.5 font-medium">{SERVICE_ORDER_BILLING_LABELS[order.billingStatus]}</p>
                  </div>
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Total</p>
                    <p className="mt-0.5 font-semibold tabular-nums">{formatBdt(order.totalAmount)}</p>
                  </div>
                </div>

                {order.assetName && (
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Linked asset</p>
                    <p className="mt-0.5 font-medium">{order.assetName}</p>
                  </div>
                )}

                {order.notes && (
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Customer notes</p>
                    <p className="mt-0.5">{order.notes}</p>
                  </div>
                )}

                {order.internalNotes && (
                  <div className="rounded-lg border border-dashed border-input bg-muted/30 p-3">
                    <p className="text-muted-foreground">Internal notes</p>
                    <p className="mt-0.5">{order.internalNotes}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {workOrders.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => toast.info(`Open work order ${workOrders[0].number} (prototype)`)}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View Work Order
                    </Button>
                  )}
                  {order.status !== "completed" && order.status !== "cancelled" && (
                    <Button
                      size="sm"
                      className="gap-1.5"
                      onClick={() => toast.success("Order marked in progress (prototype)")}
                    >
                      Start Work
                    </Button>
                  )}
                </div>
              </div>
            )}

            {tab === "lines" && (
              <div className="space-y-3">
                {lines.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-input p-6 text-center text-muted-foreground">
                    No service lines yet.
                  </p>
                ) : (
                  <>
                    <table className="w-full overflow-hidden rounded-lg border border-input">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-2 py-1.5 text-left font-medium">Description</th>
                          <th className="px-2 py-1.5 text-right font-medium">Qty</th>
                          <th className="px-2 py-1.5 text-right font-medium">Unit</th>
                          <th className="px-2 py-1.5 text-left font-medium">Billing</th>
                          <th className="px-2 py-1.5 text-right font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lines.map((l) => (
                          <tr key={l.id} className="border-t border-border">
                            <td className="px-2 py-1.5">{l.description}</td>
                            <td className="px-2 py-1.5 text-right tabular-nums">{l.qty}</td>
                            <td className="px-2 py-1.5 text-right tabular-nums">{formatBdt(l.unitPrice)}</td>
                            <td className="px-2 py-1.5">{SERVICE_BILLING_LABELS[l.billingType]}</td>
                            <td className="px-2 py-1.5 text-right tabular-nums font-medium">{formatBdt(l.unitPrice * l.qty)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-border font-semibold">
                          <td className="px-2 py-1.5" colSpan={4}>Subtotal</td>
                          <td className="px-2 py-1.5 text-right tabular-nums">{formatBdt(linesTotal)}</td>
                        </tr>
                      </tfoot>
                    </table>
                    <Button variant="outline" size="sm" onClick={() => toast.info("Add line (prototype)")}>
                      + Add line
                    </Button>
                  </>
                )}
              </div>
            )}

            {tab === "workOrders" && (
              <div className="space-y-2">
                {workOrders.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-input p-6 text-center">
                    <p className="text-muted-foreground">No work orders spawned yet.</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.info("Create work order (prototype)")}>
                      Create Work Order
                    </Button>
                  </div>
                ) : (
                  workOrders.map((wo) => (
                    <div key={wo.id} className="rounded-lg border border-input p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-mono text-[10px] text-muted-foreground">{wo.number}</p>
                          <p className="mt-0.5 font-medium">{wo.technician}</p>
                          <p className="mt-1 text-muted-foreground">{wo.scheduledStart} → {wo.scheduledEnd}</p>
                        </div>
                        <Badge
                          variant={wo.status === "done" ? "success" : wo.status === "in_progress" ? "warning" : "secondary"}
                          className="shrink-0 text-[9px] capitalize"
                        >
                          {wo.status.replace("_", " ")}
                        </Badge>
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
                    No parts consumed on this order yet.
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
                          <td className="px-2 py-1.5" colSpan={2}>Total parts cost</td>
                          <td className="px-2 py-1.5 text-right tabular-nums">{formatBdt(partsTotal)}</td>
                        </tr>
                      </tfoot>
                    </table>
                    <Button variant="outline" size="sm" onClick={() => toast.info("Add parts from inventory (prototype)")}>
                      + Issue parts
                    </Button>
                  </>
                )}
              </div>
            )}

            {tab === "activity" && (
              <div className="space-y-2">
                {activity.map((a) => (
                  <div key={a.id} className="relative border-l-2 border-indigo-500/40 pl-3 pb-3">
                    <p className="text-[10px] text-muted-foreground">{a.at}</p>
                    <p className="mt-0.5 font-medium">{a.actor}</p>
                    <p className="mt-0.5 text-muted-foreground">{a.note}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === "sla" && (
              <div className="space-y-4">
                {!sla ? (
                  <p className="rounded-lg border border-dashed border-input p-6 text-center text-muted-foreground">
                    No SLA policy applies to this order.
                  </p>
                ) : (
                  <>
                    <div className="rounded-lg border border-input p-3">
                      <p className="text-muted-foreground">Policy</p>
                      <p className="mt-0.5 font-medium">{sla.policyName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-input p-3">
                        <p className="text-muted-foreground">Response due</p>
                        <p className="mt-0.5 font-medium">{sla.responseDue}</p>
                        <Badge variant={sla.responseMet ? "success" : "warning"} className="mt-1.5 text-[9px]">
                          {sla.responseMet ? "Met" : "Breached"}
                        </Badge>
                      </div>
                      <div className="rounded-lg border border-input p-3">
                        <p className="text-muted-foreground">Resolution due</p>
                        <p className="mt-0.5 font-medium">{sla.resolutionDue}</p>
                        <Badge variant={sla.resolutionMet ? "success" : sla.atRisk ? "warning" : "secondary"} className="mt-1.5 text-[9px]">
                          {sla.resolutionMet ? "Met" : sla.atRisk ? "At risk" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                    {sla.atRisk && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                        Resolution window closing — consider escalation or reassignment.
                      </div>
                    )}
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
