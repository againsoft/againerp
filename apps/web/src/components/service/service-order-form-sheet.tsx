"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  SERVICE_ORDER_BILLING_LABELS,
  SERVICE_ORDER_STATUS_LABELS,
  SERVICE_PRIORITY_LABELS,
  SERVICE_TECHNICIANS,
  serviceAssetsSeed,
  serviceItemsSeed,
  type ServiceOrder,
  type ServiceOrderBillingStatus,
  type ServiceOrderPriority,
  type ServiceOrderStatus,
} from "@/lib/mock-data/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

const CUSTOMERS = [
  "GreenMart Superstores",
  "Metro Retail Ltd",
  "TechZone BD",
  "Apex Motors",
  "Digital Hive Agency",
  "BRAC IT Services",
];

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (order: ServiceOrder, mode: "create" | "edit") => void;
  editOrder?: ServiceOrder | null;
  nextNumber: string;
};

export function ServiceOrderFormSheet({
  open,
  onClose,
  onSave,
  editOrder,
  nextNumber,
}: Props) {
  const isEdit = !!editOrder;

  const [number, setNumber] = useState("");
  const [customer, setCustomer] = useState(CUSTOMERS[0]);
  const [assetId, setAssetId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [priority, setPriority] = useState<ServiceOrderPriority>("medium");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [technician, setTechnician] = useState("");
  const [status, setStatus] = useState<ServiceOrderStatus>("open");
  const [billingStatus, setBillingStatus] = useState<ServiceOrderBillingStatus>("unbilled");
  const [totalAmount, setTotalAmount] = useState("");
  const [notes, setNotes] = useState("");

  const customerAssets = serviceAssetsSeed.filter((a) => a.customer === customer);

  useEffect(() => {
    if (!open) return;
    if (editOrder) {
      setNumber(editOrder.number);
      setCustomer(editOrder.customer);
      setAssetId(editOrder.assetId ?? "");
      setServiceName(editOrder.serviceName);
      setPriority(editOrder.priority);
      setScheduleDate(editOrder.scheduleDate);
      setScheduleTime(editOrder.scheduleTime ?? "");
      setTechnician(editOrder.technician ?? "");
      setStatus(editOrder.status);
      setBillingStatus(editOrder.billingStatus);
      setTotalAmount(String(editOrder.totalAmount));
      setNotes(editOrder.notes ?? "");
    } else {
      setNumber(nextNumber);
      setCustomer(CUSTOMERS[0]);
      setAssetId("");
      setServiceName(serviceItemsSeed[0]?.name ?? "");
      setPriority("medium");
      setScheduleDate(new Date().toISOString().slice(0, 10));
      setScheduleTime("09:00");
      setTechnician("");
      setStatus("open");
      setBillingStatus("unbilled");
      setTotalAmount(String(serviceItemsSeed[0]?.salePrice ?? 0));
      setNotes("");
    }
  }, [open, editOrder, nextNumber]);

  const handleSave = () => {
    if (!serviceName.trim()) {
      toast.error("Service name is required");
      return;
    }
    const amount = Number(totalAmount);
    if (!Number.isFinite(amount) || amount < 0) {
      toast.error("Enter a valid amount");
      return;
    }

    const asset = customerAssets.find((a) => a.id === assetId);
    const order: ServiceOrder = {
      id: editOrder?.id ?? `so-${Date.now()}`,
      number: number.trim(),
      customer,
      contactId: editOrder?.contactId ?? `ct-${Date.now()}`,
      assetId: asset?.id,
      assetName: asset?.name,
      serviceName: serviceName.trim(),
      priority,
      scheduleDate: scheduleDate || new Date().toISOString().slice(0, 10),
      scheduleTime: scheduleTime.trim() || undefined,
      technician: technician.trim() || undefined,
      status,
      billingStatus,
      totalAmount: amount,
      notes: notes.trim() || undefined,
      createdAt: editOrder?.createdAt ?? new Date().toISOString().slice(0, 10),
    };

    onSave(order, isEdit ? "edit" : "create");
    toast.success(isEdit ? "Order updated" : "Service order created");
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
            <h2 className="font-semibold">{isEdit ? "Edit Service Order" : "New Service Order"}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Customer request or dispatch-initiated service job
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">Order #</label>
                <Input value={number} onChange={(e) => setNumber(e.target.value)} className="mt-1 h-8 font-mono text-xs" disabled={isEdit} />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Status</label>
                <Select value={status} onChange={(e) => setStatus(e.target.value as ServiceOrderStatus)} className="mt-1 h-8 w-full text-xs">
                  {(Object.keys(SERVICE_ORDER_STATUS_LABELS) as ServiceOrderStatus[]).map((s) => (
                    <option key={s} value={s}>{SERVICE_ORDER_STATUS_LABELS[s]}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground">Customer</label>
              <Select
                value={customer}
                onChange={(e) => {
                  setCustomer(e.target.value);
                  setAssetId("");
                }}
                className="mt-1 h-8 w-full text-xs"
              >
                {CUSTOMERS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground">Linked asset (optional)</label>
              <Select value={assetId} onChange={(e) => setAssetId(e.target.value)} className="mt-1 h-8 w-full text-xs">
                <option value="">No asset</option>
                {customerAssets.map((a) => (
                  <option key={a.id} value={a.id}>{a.assetTag} — {a.name}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground">Service</label>
              <Select
                value={serviceName}
                onChange={(e) => {
                  setServiceName(e.target.value);
                  const item = serviceItemsSeed.find((i) => i.name === e.target.value);
                  if (item) setTotalAmount(String(item.salePrice));
                }}
                className="mt-1 h-8 w-full text-xs"
              >
                {serviceItemsSeed.filter((i) => i.status === "active").slice(0, 20).map((i) => (
                  <option key={i.id} value={i.name}>{i.name}</option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">Priority</label>
                <Select value={priority} onChange={(e) => setPriority(e.target.value as ServiceOrderPriority)} className="mt-1 h-8 w-full text-xs">
                  {(Object.keys(SERVICE_PRIORITY_LABELS) as ServiceOrderPriority[]).map((p) => (
                    <option key={p} value={p}>{SERVICE_PRIORITY_LABELS[p]}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Billing</label>
                <Select value={billingStatus} onChange={(e) => setBillingStatus(e.target.value as ServiceOrderBillingStatus)} className="mt-1 h-8 w-full text-xs">
                  {(Object.keys(SERVICE_ORDER_BILLING_LABELS) as ServiceOrderBillingStatus[]).map((b) => (
                    <option key={b} value={b}>{SERVICE_ORDER_BILLING_LABELS[b]}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">Schedule date</label>
                <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="mt-1 h-8 text-xs" />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Time</label>
                <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="mt-1 h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">Technician</label>
                <Select value={technician} onChange={(e) => setTechnician(e.target.value)} className="mt-1 h-8 w-full text-xs">
                  <option value="">Unassigned</option>
                  {SERVICE_TECHNICIANS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Amount (BDT)</label>
                <Input type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} className="mt-1 h-8 text-xs tabular-nums" />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground">Notes</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 text-xs" />
            </div>
          </div>

          <div className="mt-6 flex gap-2 border-t border-border pt-4">
            <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" className="flex-1" onClick={handleSave}>
              {isEdit ? "Save changes" : "Create order"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
