"use client";

import type { WorkCenter } from "@/lib/mock-data/manufacturing-work-centers";
import { WorkCenterDetailContent } from "@/components/manufacturing/work-center-detail-content";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workCenter: WorkCenter | null;
  onEdit?: (wc: WorkCenter) => void;
};

export function WorkCenterViewDialog({ open, onOpenChange, workCenter, onEdit }: Props) {
  if (!workCenter) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
        aria-describedby={undefined}
      >
        <p className="sr-only">Work center · {workCenter.code}</p>
        <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
          <WorkCenterDetailContent
            workCenter={workCenter}
            inDialog
            onEdit={onEdit}
            onClose={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
