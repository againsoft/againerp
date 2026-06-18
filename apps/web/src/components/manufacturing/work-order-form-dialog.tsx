"use client";

import type { WorkOrder } from "@/lib/mock-data/manufacturing-work-orders";
import { WorkOrderForm } from "@/components/manufacturing/work-order-form";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  workOrder?: WorkOrder | null;
  onSaved?: (wo: WorkOrder) => void;
};

export function WorkOrderFormDialog({
  open,
  onOpenChange,
  mode = "create",
  workOrder,
  onSaved,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
        aria-describedby={undefined}
      >
        <p className="sr-only">
          {mode === "create" ? "Create work order" : `Edit work order · ${workOrder?.number ?? ""}`}
        </p>
        <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
          <WorkOrderForm
            mode={mode}
            initialWorkOrder={workOrder}
            inDialog
            onClose={() => onOpenChange(false)}
            onSaved={onSaved}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
