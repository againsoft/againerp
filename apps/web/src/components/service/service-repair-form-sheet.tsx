"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  SERVICE_PRIORITY_LABELS,
  SERVICE_TECHNICIANS,
  serviceAssetsSeed,
  type ServiceOrderPriority,
  type ServiceRepairTicket,
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
  onSave: (ticket: ServiceRepairTicket) => void;
  nextNumber: string;
};

export function ServiceRepairFormSheet({ open, onClose, onSave, nextNumber }: Props) {
  const [ticketNumber, setTicketNumber] = useState("");
  const [customer, setCustomer] = useState(CUSTOMERS[0]);
  const [assetId, setAssetId] = useState("");
  const [assetName, setAssetName] = useState("");
  const [problem, setProblem] = useState("");
  const [priority, setPriority] = useState<ServiceOrderPriority>("medium");
  const [technician, setTechnician] = useState("");

  const customerAssets = serviceAssetsSeed.filter((a) => a.customer === customer);

  useEffect(() => {
    if (!open) return;
    setTicketNumber(nextNumber);
    setCustomer(CUSTOMERS[0]);
    setAssetId("");
    setAssetName("");
    setProblem("");
    setPriority("medium");
    setTechnician("");
  }, [open, nextNumber]);

  const handleSave = () => {
    if (!assetName.trim() && !assetId) {
      toast.error("Select or enter an asset");
      return;
    }
    if (!problem.trim()) {
      toast.error("Problem description is required");
      return;
    }

    const asset = customerAssets.find((a) => a.id === assetId);
    const ticket: ServiceRepairTicket = {
      id: `rep-${Date.now()}`,
      ticketNumber: ticketNumber.trim(),
      assetId: asset?.id,
      assetName: asset?.name ?? assetName.trim(),
      customer,
      problem: problem.trim(),
      stage: "received",
      stageEnteredAt: new Date().toISOString().slice(0, 10),
      technician: technician.trim() || undefined,
      priority,
    };

    onSave(ticket);
    toast.success("Asset received into repair queue");
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
            <h2 className="font-semibold">Receive Asset</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Intake device into repair workflow — stage: Received
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-[11px] text-muted-foreground">Ticket #</label>
              <Input value={ticketNumber} onChange={(e) => setTicketNumber(e.target.value)} className="mt-1 h-8 font-mono text-xs" />
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
              <label className="text-[11px] text-muted-foreground">Registered asset</label>
              <Select
                value={assetId}
                onChange={(e) => {
                  setAssetId(e.target.value);
                  const a = customerAssets.find((x) => x.id === e.target.value);
                  if (a) setAssetName(a.name);
                }}
                className="mt-1 h-8 w-full text-xs"
              >
                <option value="">Walk-in / unregistered</option>
                {customerAssets.map((a) => (
                  <option key={a.id} value={a.id}>{a.assetTag} — {a.name}</option>
                ))}
              </Select>
            </div>

            {!assetId && (
              <div>
                <label className="text-[11px] text-muted-foreground">Asset description</label>
                <Input
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="e.g. iPhone 14 Pro"
                  className="mt-1 h-8 text-xs"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] text-muted-foreground">Reported problem</label>
              <Textarea value={problem} onChange={(e) => setProblem(e.target.value)} rows={3} className="mt-1 text-xs" />
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
                <label className="text-[11px] text-muted-foreground">Assign technician</label>
                <Select value={technician} onChange={(e) => setTechnician(e.target.value)} className="mt-1 h-8 w-full text-xs">
                  <option value="">Unassigned</option>
                  {SERVICE_TECHNICIANS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-2 border-t border-border pt-4">
            <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" className="flex-1" onClick={handleSave}>
              Receive asset
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
