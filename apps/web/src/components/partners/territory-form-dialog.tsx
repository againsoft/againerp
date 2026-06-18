"use client";

import { TerritoryForm } from "@/components/partners/territory-form";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
};

export function TerritoryFormDialog({ open, onOpenChange, onSaved }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
        aria-describedby={undefined}
      >
        <p className="sr-only">Assign territory</p>
        <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
          <TerritoryForm
            inDialog
            onClose={() => onOpenChange(false)}
            onSaved={() => {
              onSaved?.();
              onOpenChange(false);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
