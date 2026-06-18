"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  MANUFACTURING_WAREHOUSES,
  WORK_CENTER_STATUS_LABELS,
  WORK_CENTER_TYPE_LABELS,
  buildWorkCenterDraft,
  type WorkCenter,
  type WorkCenterStatus,
  type WorkCenterType,
} from "@/lib/mock-data/manufacturing-work-centers";
import { useManufacturingWorkCenterStore } from "@/lib/store/manufacturing-work-center-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  mode?: "create" | "edit";
  initialWorkCenter?: WorkCenter | null;
  inDialog?: boolean;
  onClose?: () => void;
  onSaved?: (wc: WorkCenter) => void;
};

export function WorkCenterForm({
  mode = "create",
  initialWorkCenter,
  inDialog,
  onClose,
  onSaved,
}: Props) {
  const addWorkCenter = useManufacturingWorkCenterStore((s) => s.addWorkCenter);
  const patchWorkCenter = useManufacturingWorkCenterStore((s) => s.patchWorkCenter);

  const [code, setCode] = useState(initialWorkCenter?.code ?? "");
  const [name, setName] = useState(initialWorkCenter?.name ?? "");
  const [warehouse, setWarehouse] = useState(
    initialWorkCenter?.warehouse ?? MANUFACTURING_WAREHOUSES[0],
  );
  const [type, setType] = useState<WorkCenterType>(initialWorkCenter?.type ?? "assembly");
  const [status, setStatus] = useState<WorkCenterStatus>(initialWorkCenter?.status ?? "active");
  const [capacityHoursPerDay, setCapacityHoursPerDay] = useState(
    String(initialWorkCenter?.capacityHoursPerDay ?? 8),
  );
  const [costRatePerHour, setCostRatePerHour] = useState(
    String(initialWorkCenter?.costRatePerHour ?? 500),
  );
  const [utilizationPct, setUtilizationPct] = useState(
    String(initialWorkCenter?.utilizationPct ?? 0),
  );
  const [notes, setNotes] = useState(initialWorkCenter?.notes ?? "");

  useEffect(() => {
    if (!initialWorkCenter) return;
    setCode(initialWorkCenter.code);
    setName(initialWorkCenter.name);
    setWarehouse(initialWorkCenter.warehouse);
    setType(initialWorkCenter.type);
    setStatus(initialWorkCenter.status);
    setCapacityHoursPerDay(String(initialWorkCenter.capacityHoursPerDay));
    setCostRatePerHour(String(initialWorkCenter.costRatePerHour));
    setUtilizationPct(String(initialWorkCenter.utilizationPct));
    setNotes(initialWorkCenter.notes ?? "");
  }, [initialWorkCenter]);

  const save = useCallback(() => {
    if (!code.trim() || !name.trim()) {
      toast.error("Code and name are required");
      return;
    }

    const payload = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      warehouse,
      type,
      status,
      capacityHoursPerDay: Number(capacityHoursPerDay) || 0,
      costRatePerHour: Number(costRatePerHour) || 0,
      utilizationPct: Number(utilizationPct) || 0,
      notes: notes.trim() || undefined,
    };

    if (mode === "edit" && initialWorkCenter) {
      patchWorkCenter(initialWorkCenter.id, payload);
      toast.success("Work center updated");
      onSaved?.({ ...initialWorkCenter, ...payload });
      onClose?.();
      return;
    }

    const draft = buildWorkCenterDraft({
      code: payload.code,
      name: payload.name,
      warehouse: payload.warehouse,
      type: payload.type,
      capacityHoursPerDay: payload.capacityHoursPerDay,
      costRatePerHour: payload.costRatePerHour,
      notes: payload.notes,
    });
    addWorkCenter(draft);
    toast.success(`Work center ${draft.code} created`);
    onSaved?.(draft);
    onClose?.();
  }, [
    addWorkCenter,
    capacityHoursPerDay,
    code,
    costRatePerHour,
    initialWorkCenter,
    mode,
    name,
    notes,
    onClose,
    onSaved,
    patchWorkCenter,
    status,
    type,
    utilizationPct,
    warehouse,
  ]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-input pb-3">
        <div>
          <h2 className="text-base font-semibold">
            {mode === "create" ? "New work center" : `Edit · ${initialWorkCenter?.code ?? ""}`}
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Machine or labor pool with capacity and cost rate (prototype).
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" className="h-7 px-2 text-xs" onClick={save}>
            Save
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
          <div className="space-y-1.5">
            <Label className="text-xs">Code</Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-9 text-xs font-mono uppercase"
              placeholder="WC-ASM-02"
              disabled={mode === "edit"}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 text-xs"
              placeholder="Assembly Line 2"
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
            <Label className="text-xs">Type</Label>
            <Select
              className="h-9 text-xs"
              value={type}
              onChange={(e) => setType(e.target.value as WorkCenterType)}
            >
              {Object.entries(WORK_CENTER_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </div>
          {mode === "edit" && (
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select
                className="h-9 text-xs"
                value={status}
                onChange={(e) => setStatus(e.target.value as WorkCenterStatus)}
              >
                {Object.entries(WORK_CENTER_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </Select>
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs">Capacity (hours/day)</Label>
            <Input
              type="number"
              min={0}
              max={24}
              value={capacityHoursPerDay}
              onChange={(e) => setCapacityHoursPerDay(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Cost rate (per hour)</Label>
            <Input
              type="number"
              min={0}
              value={costRatePerHour}
              onChange={(e) => setCostRatePerHour(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          {mode === "edit" && (
            <div className="space-y-1.5">
              <Label className="text-xs">Utilization %</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={utilizationPct}
                onChange={(e) => setUtilizationPct(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="text-xs"
            placeholder="Shift pattern, equipment notes…"
          />
        </div>
      </div>
    </div>
  );
}
