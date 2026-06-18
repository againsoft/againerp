"use client";

import type { WorkCenter } from "@/lib/mock-data/manufacturing-work-centers";
import { WorkCenterForm } from "@/components/manufacturing/work-center-form";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  workCenter?: WorkCenter | null;
  onSaved?: (wc: WorkCenter) => void;
};

export function WorkCenterFormDialog({
  open,
  onOpenChange,
  mode = "create",
  workCenter,
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
          {mode === "create" ? "Create work center" : `Edit work center · ${workCenter?.code ?? ""}`}
        </p>
        <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
          <WorkCenterForm
            mode={mode}
            initialWorkCenter={workCenter}
            inDialog
            onClose={() => onOpenChange(false)}
            onSaved={onSaved}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
