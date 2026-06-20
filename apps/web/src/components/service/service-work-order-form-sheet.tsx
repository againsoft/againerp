"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  SERVICE_PRIORITY_LABELS,
  SERVICE_TECHNICIANS,
  SERVICE_WORK_ORDER_STATUS_LABELS,
  serviceOrdersSeed,
  type ServiceOrderPriority,
  type ServiceWorkOrder,
  type ServiceWorkOrderStatus,
} from "@/lib/mock-data/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (wo: ServiceWorkOrder, mode: "create" | "edit") => void;
  editWorkOrder?: ServiceWorkOrder | null;
  nextNumber: string;
};

const openOrders = serviceOrdersSeed.filter(
  (o) => o.status !== "completed" && o.status !== "cancelled" && o.status !== "draft"
);

export function ServiceWorkOrderFormSheet({
  open,
  onClose,
  onSave,
  editWorkOrder,
  nextNumber,
}: Props) {
  const isEdit = !!editWorkOrder;

  const [number, setNumber] = useState("");
  const [serviceOrderId, setServiceOrderId] = useState(openOrders[0]?.id ?? "");
  const [technician, setTechnician] = useState<string>(SERVICE_TECHNICIANS[0]);
  const [scheduledStart, setScheduledStart] = useState("");
  const [scheduledEnd, setScheduledEnd] = useState("");
  const [status, setStatus] = useState<ServiceWorkOrderStatus>("scheduled");
  const [workNotes, setWorkNotes] = useState("");

  const selectedOrder = serviceOrdersSeed.find((o) => o.id === serviceOrderId);

  useEffect(() => {
    if (!open) return;
    if (editWorkOrder) {
      setNumber(editWorkOrder.number);
      setServiceOrderId(editWorkOrder.serviceOrderId);
      setTechnician(editWorkOrder.technician);
      setScheduledStart(editWorkOrder.scheduledStart);
      setScheduledEnd(editWorkOrder.scheduledEnd);
      setStatus(editWorkOrder.status);
      setWorkNotes(editWorkOrder.workNotes ?? "");
    } else {
      const order = openOrders[0];
      setNumber(nextNumber);
      setServiceOrderId(order?.id ?? "");
      setTechnician(order?.technician ?? SERVICE_TECHNICIANS[0]);
      const day = order?.scheduleDate ?? new Date().toISOString().slice(0, 10);
      const time = order?.scheduleTime ?? "09:00";
      setScheduledStart(`${day} ${time}`);
      setScheduledEnd(`${day} ${String(Number(time.split(":")[0]) + 3).padStart(2, "0")}:00`);
      setStatus("scheduled");
      setWorkNotes("");
    }
  }, [open, editWorkOrder, nextNumber]);

  const handleSave = () => {
    if (!selectedOrder && !isEdit) {
      toast.error("Select a service order");
      return;
    }
    const order = selectedOrder ?? serviceOrdersSeed.find((o) => o.id === editWorkOrder?.serviceOrderId);
    if (!order) {
      toast.error("Service order not found");
      return;
    }

    const wo: ServiceWorkOrder = {
      id: editWorkOrder?.id ?? `wo-${Date.now()}`,
      number: number.trim(),
      serviceOrderId: order.id,
      serviceOrderNumber: order.number,
      customer: order.customer,
      serviceName: order.serviceName,
      assetName: order.assetName,
      priority: order.priority,
      technician,
      scheduledStart: scheduledStart.trim(),
      scheduledEnd: scheduledEnd.trim(),
      status,
      workNotes: workNotes.trim() || undefined,
      actualStart: editWorkOrder?.actualStart,
      actualEnd: editWorkOrder?.actualEnd,
      checkInLat: editWorkOrder?.checkInLat,
      checkInLng: editWorkOrder?.checkInLng,
      checkOutLat: editWorkOrder?.checkOutLat,
      checkOutLng: editWorkOrder?.checkOutLng,
      signatureCaptured: editWorkOrder?.signatureCaptured,
    };

    onSave(wo, isEdit ? "edit" : "create");
    toast.success(isEdit ? "Work order updated" : "Work order created");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-lg gap-0 overflow-hidden p-0 sm:max-w-lg [&>button.absolute]:hidden"
      >
        <div className="flex h-full min-h-0 flex-col overflow-y-auto px-4 pb-4 pt-3">
          <div className="shrink-0 border-b border-border pb-4">
            <h2 className="font-semibold">{isEdit ? "Edit Work Order" : "Create Work Order"}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Spawn execution job from a service order
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">WO #</label>
                <Input value={number} onChange={(e) => setNumber(e.target.value)} className="mt-1 h-8 font-mono text-xs" disabled={isEdit} />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Status</label>
                <Select value={status} onChange={(e) => setStatus(e.target.value as ServiceWorkOrderStatus)} className="mt-1 h-8 w-full text-xs">
                  {(Object.keys(SERVICE_WORK_ORDER_STATUS_LABELS) as ServiceWorkOrderStatus[]).map((s) => (
                    <option key={s} value={s}>{SERVICE_WORK_ORDER_STATUS_LABELS[s]}</option>
                  ))}
                </Select>
              </div>
            </div>

            {!isEdit && (
              <div>
                <label className="text-[11px] text-muted-foreground">Service order</label>
                <Select value={serviceOrderId} onChange={(e) => setServiceOrderId(e.target.value)} className="mt-1 h-8 w-full text-xs">
                  {openOrders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.number} — {o.serviceName} ({o.customer})
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {selectedOrder && (
              <div className="rounded-lg border border-input bg-muted/30 p-3 text-xs">
                <p className="font-medium">{selectedOrder.serviceName}</p>
                <p className="mt-0.5 text-muted-foreground">{selectedOrder.customer}</p>
                <p className="mt-1">
                  Priority: {(Object.keys(SERVICE_PRIORITY_LABELS) as ServiceOrderPriority[]).includes(selectedOrder.priority)
                    ? SERVICE_PRIORITY_LABELS[selectedOrder.priority]
                    : selectedOrder.priority}
                </p>
              </div>
            )}

            <div>
              <label className="text-[11px] text-muted-foreground">Technician</label>
              <Select value={technician} onChange={(e) => setTechnician(e.target.value)} className="mt-1 h-8 w-full text-xs">
                {SERVICE_TECHNICIANS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">Scheduled start</label>
                <Input value={scheduledStart} onChange={(e) => setScheduledStart(e.target.value)} placeholder="2026-06-21 09:00" className="mt-1 h-8 text-xs" />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Scheduled end</label>
                <Input value={scheduledEnd} onChange={(e) => setScheduledEnd(e.target.value)} placeholder="2026-06-21 12:00" className="mt-1 h-8 text-xs" />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground">Work notes</label>
              <Textarea value={workNotes} onChange={(e) => setWorkNotes(e.target.value)} rows={2} className="mt-1 text-xs" />
            </div>
          </div>

          <div className="mt-6 flex gap-2 border-t border-border pt-4">
            <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" className="flex-1" onClick={handleSave}>
              {isEdit ? "Save changes" : "Create work order"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
