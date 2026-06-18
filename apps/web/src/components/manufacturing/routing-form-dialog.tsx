"use client";

import type { ManufacturingRouting } from "@/lib/mock-data/manufacturing-routings";
import { RoutingForm } from "@/components/manufacturing/routing-form";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  routing?: ManufacturingRouting | null;
  onSaved?: (routing: ManufacturingRouting) => void;
};

export function RoutingFormDialog({
  open,
  onOpenChange,
  mode = "create",
  routing,
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
          {mode === "create" ? "Create routing" : `Edit routing · ${routing?.number ?? ""}`}
        </p>
        <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
          <RoutingForm
            mode={mode}
            initialRouting={routing}
            inDialog
            onClose={() => onOpenChange(false)}
            onSaved={onSaved}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
