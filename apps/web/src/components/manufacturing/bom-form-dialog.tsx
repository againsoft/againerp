"use client";

import type { BillOfMaterials } from "@/lib/mock-data/manufacturing-boms";
import { BomForm } from "@/components/manufacturing/bom-form";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  bom?: BillOfMaterials | null;
  onSaved?: (bom: BillOfMaterials) => void;
};

export function BomFormDialog({ open, onOpenChange, mode = "create", bom, onSaved }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
        aria-describedby={undefined}
      >
        <p className="sr-only">
          {mode === "create" ? "Create BOM" : `Edit BOM · ${bom?.number ?? ""}`}
        </p>
        <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
          <BomForm
            mode={mode}
            initialBom={bom}
            inDialog
            onClose={() => onOpenChange(false)}
            onSaved={onSaved}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
