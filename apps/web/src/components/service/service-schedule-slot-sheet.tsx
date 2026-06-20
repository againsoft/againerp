"use client";

import { ExternalLink, X } from "lucide-react";
import Link from "next/link";
import {
  SERVICE_PRIORITY_LABELS,
  type ServiceScheduleSlot,
} from "@/lib/mock-data/service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

function slotStatusVariant(s: ServiceScheduleSlot["status"]): "success" | "warning" | "secondary" | "muted" {
  if (s === "done") return "success";
  if (s === "in_progress") return "warning";
  if (s === "cancelled") return "muted";
  return "secondary";
}

type Props = {
  open: boolean;
  slot: ServiceScheduleSlot | null;
  onClose: () => void;
};

export function ServiceScheduleSlotSheet({ open, slot, onClose }: Props) {
  if (!slot) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-md gap-0 overflow-hidden p-0 sm:max-w-md [&>button.absolute]:hidden"
      >
        <div className="flex h-full min-h-0 flex-col overflow-y-auto">
          <div className="shrink-0 border-b border-border px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                  <Badge variant={slotStatusVariant(slot.status)} className="text-[10px] capitalize">
                    {slot.status.replace("_", " ")}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {SERVICE_PRIORITY_LABELS[slot.priority]}
                  </Badge>
                </div>
                <h2 className="text-base font-semibold leading-snug">{slot.serviceName}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{slot.customer}</p>
              </div>
              <button type="button" className="rounded-md p-1 hover:bg-accent" onClick={onClose} aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4 px-4 py-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-input p-3">
                <p className="text-muted-foreground">Date</p>
                <p className="mt-0.5 font-medium">{slot.date}</p>
              </div>
              <div className="rounded-lg border border-input p-3">
                <p className="text-muted-foreground">Time</p>
                <p className="mt-0.5 font-medium">{slot.startTime} – {slot.endTime}</p>
              </div>
              <div className="rounded-lg border border-input p-3">
                <p className="text-muted-foreground">Technician</p>
                <p className="mt-0.5 font-medium">{slot.technician}</p>
              </div>
              <div className="rounded-lg border border-input p-3">
                <p className="text-muted-foreground">Work order</p>
                <p className="mt-0.5 font-mono font-medium">{slot.workOrderNumber}</p>
              </div>
            </div>

            <div className="rounded-lg border border-input p-3">
              <p className="text-muted-foreground">Service order</p>
              <p className="mt-0.5 font-mono font-medium">{slot.serviceOrderNumber}</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
                <Link href={`/service/work-orders?view=${slot.workOrderId}`}>
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open Work Order
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
                <Link href={`/service/orders?view=${slot.serviceOrderId}`}>
                  <ExternalLink className="h-3.5 w-3.5" />
                  Service Order
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
