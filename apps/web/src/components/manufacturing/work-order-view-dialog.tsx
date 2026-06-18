"use client";

import type { WorkOrder } from "@/lib/mock-data/manufacturing-work-orders";
import { WorkOrderDetailContent } from "@/components/manufacturing/work-order-detail-content";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrder: WorkOrder | null;
  onEdit?: (wo: WorkOrder) => void;
};

export function WorkOrderViewDialog({ open, onOpenChange, workOrder, onEdit }: Props) {
  if (!workOrder) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
        aria-describedby={undefined}
      >
        <p className="sr-only">Work order · {workOrder.number}</p>
        <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
          <WorkOrderDetailContent
            workOrder={workOrder}
            inDialog
            onEdit={onEdit}
            onClose={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
