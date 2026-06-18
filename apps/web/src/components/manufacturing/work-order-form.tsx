"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { MANUFACTURING_WAREHOUSES } from "@/lib/mock-data/manufacturing";
import {
  WORK_ORDER_PRIORITY_LABELS,
  buildWorkOrderDraft,
  type WorkOrder,
  type WorkOrderPriority,
} from "@/lib/mock-data/manufacturing-work-orders";
import { useManufacturingBomStore } from "@/lib/store/manufacturing-bom-store";
import { useManufacturingWorkOrderStore } from "@/lib/store/manufacturing-work-order-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  mode?: "create" | "edit";
  initialWorkOrder?: WorkOrder | null;
  inDialog?: boolean;
  onClose?: () => void;
  onSaved?: (wo: WorkOrder) => void;
};

export function WorkOrderForm({
  mode = "create",
  initialWorkOrder,
  inDialog,
  onClose,
  onSaved,
}: Props) {
  const addWorkOrder = useManufacturingWorkOrderStore((s) => s.addWorkOrder);
  const patchWorkOrder = useManufacturingWorkOrderStore((s) => s.patchWorkOrder);
  const releaseWorkOrder = useManufacturingWorkOrderStore((s) => s.releaseWorkOrder);
  const boms = useManufacturingBomStore((s) => s.boms);

  const [bomId, setBomId] = useState(initialWorkOrder?.bomId ?? boms[0]?.id ?? "");
  const [quantity, setQuantity] = useState(String(initialWorkOrder?.quantity ?? 100));
  const [warehouse, setWarehouse] = useState(
    initialWorkOrder?.warehouse ?? MANUFACTURING_WAREHOUSES[0],
  );
  const [plannedStart, setPlannedStart] = useState(
    initialWorkOrder?.plannedStart ?? new Date().toISOString().slice(0, 10),
  );
  const [plannedEnd, setPlannedEnd] = useState(initialWorkOrder?.plannedEnd ?? "2026-06-30");
  const [priority, setPriority] = useState<WorkOrderPriority>(
    initialWorkOrder?.priority ?? "normal",
  );
  const [notes, setNotes] = useState(initialWorkOrder?.notes ?? "");

  useEffect(() => {
    if (!initialWorkOrder) return;
    setBomId(initialWorkOrder.bomId);
    setQuantity(String(initialWorkOrder.quantity));
    setWarehouse(initialWorkOrder.warehouse);
    setPlannedStart(initialWorkOrder.plannedStart);
    setPlannedEnd(initialWorkOrder.plannedEnd);
    setPriority(initialWorkOrder.priority);
    setNotes(initialWorkOrder.notes ?? "");
  }, [initialWorkOrder]);

  const selectedBom = boms.find((b) => b.id === bomId);

  const save = useCallback(
    (release: boolean) => {
      const qty = Number(quantity) || 0;
      if (!bomId || qty <= 0) {
        toast.error("Select BOM and enter quantity");
        return;
      }

      if (mode === "edit" && initialWorkOrder) {
        patchWorkOrder(initialWorkOrder.id, {
          bomId,
          bomNumber: selectedBom?.number ?? initialWorkOrder.bomNumber,
          productName: selectedBom?.productName ?? initialWorkOrder.productName,
          productSku: selectedBom?.productSku ?? initialWorkOrder.productSku,
          quantity: qty,
          warehouse,
          plannedStart,
          plannedEnd,
          priority,
          notes: notes.trim() || undefined,
        });
        if (release && initialWorkOrder.status === "planned") {
          releaseWorkOrder(initialWorkOrder.id);
        } else {
          toast.success("Work order updated");
        }
        onSaved?.({ ...initialWorkOrder, quantity: qty });
        onClose?.();
        return;
      }

      const draft = buildWorkOrderDraft({
        bomId,
        quantity: qty,
        warehouse,
        plannedStart,
        plannedEnd,
        priority,
        notes: notes.trim() || undefined,
      });
      addWorkOrder(draft);
      if (release) {
        releaseWorkOrder(draft.id);
      } else {
        toast.success("Work order saved as planned");
      }
      onSaved?.(draft);
      onClose?.();
    },
    [
      addWorkOrder,
      bomId,
      initialWorkOrder,
      mode,
      notes,
      onClose,
      onSaved,
      patchWorkOrder,
      plannedEnd,
      plannedStart,
      priority,
      quantity,
      releaseWorkOrder,
      selectedBom,
      warehouse,
    ],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-input pb-3">
        <div>
          <h2 className="text-base font-semibold">
            {mode === "create" ? "New work order" : `Edit · ${initialWorkOrder?.number ?? ""}`}
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Plan production job — BOM drives materials and routing (prototype).
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => save(false)}>
            Save draft
          </Button>
          <Button size="sm" className="h-7 px-2 text-xs" onClick={() => save(true)}>
            Save & release
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Close" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pb-2">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Bill of Materials</Label>
            <Select
              className="h-9 text-xs"
              value={bomId}
              onChange={(e) => setBomId(e.target.value)}
              disabled={mode === "edit" && initialWorkOrder?.status !== "planned"}
            >
              {boms.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.number} — {b.productName}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Quantity to produce</Label>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Warehouse</Label>
            <Select
              className="h-9 text-xs"
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
            >
              {MANUFACTURING_WAREHOUSES.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Planned start</Label>
            <Input
              type="date"
              value={plannedStart}
              onChange={(e) => setPlannedStart(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Planned end</Label>
            <Input
              type="date"
              value={plannedEnd}
              onChange={(e) => setPlannedEnd(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Priority</Label>
            <Select
              className="h-9 text-xs"
              value={priority}
              onChange={(e) => setPriority(e.target.value as WorkOrderPriority)}
            >
              {Object.entries(WORK_ORDER_PRIORITY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {selectedBom && (
          <div className="rounded-lg border border-input bg-muted/20 px-3 py-2 text-xs">
            <p className="font-medium">{selectedBom.productName}</p>
            <p className="text-muted-foreground">
              {selectedBom.lines.length} components · {selectedBom.type} BOM · {selectedBom.version}
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-xs">Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="text-xs"
            placeholder="Production instructions, SO reference…"
          />
        </div>
      </div>
    </div>
  );
}
