"use client";

import type { MrpRun } from "@/lib/mock-data/manufacturing-mrp";
import { MrpDetailContent } from "@/components/manufacturing/mrp-detail-content";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  run: MrpRun | null;
};

export function MrpViewDialog({ open, onOpenChange, run }: Props) {
  if (!run) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
        aria-describedby={undefined}
      >
        <p className="sr-only">MRP run · {run.number}</p>
        <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
          <MrpDetailContent run={run} inDialog onClose={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
