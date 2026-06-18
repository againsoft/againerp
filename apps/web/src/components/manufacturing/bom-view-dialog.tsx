"use client";

import type { BillOfMaterials } from "@/lib/mock-data/manufacturing-boms";
import { BomDetailContent } from "@/components/manufacturing/bom-detail-content";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bom: BillOfMaterials | null;
  onEdit?: (bom: BillOfMaterials) => void;
  onDuplicated?: (bom: BillOfMaterials) => void;
};

export function BomViewDialog({ open, onOpenChange, bom, onEdit, onDuplicated }: Props) {
  if (!bom) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
        aria-describedby={undefined}
      >
        <p className="sr-only">BOM · {bom.number}</p>
        <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
          <BomDetailContent
            bom={bom}
            inDialog
            onEdit={onEdit}
            onClose={() => onOpenChange(false)}
            onDuplicated={(copy) => {
              onOpenChange(false);
              onDuplicated?.(copy);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
