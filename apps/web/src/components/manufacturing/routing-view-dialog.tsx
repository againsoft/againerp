"use client";

import type { ManufacturingRouting } from "@/lib/mock-data/manufacturing-routings";
import { RoutingDetailContent } from "@/components/manufacturing/routing-detail-content";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routing: ManufacturingRouting | null;
  onEdit?: (routing: ManufacturingRouting) => void;
};

export function RoutingViewDialog({ open, onOpenChange, routing, onEdit }: Props) {
  if (!routing) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
        aria-describedby={undefined}
      >
        <p className="sr-only">Routing · {routing.number}</p>
        <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
          <RoutingDetailContent
            routing={routing}
            inDialog
            onEdit={onEdit}
            onClose={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
