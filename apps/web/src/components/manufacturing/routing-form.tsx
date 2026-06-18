"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  ROUTING_STATUS_LABELS,
  buildRoutingDraft,
  defaultRoutingOperations,
  type ManufacturingRouting,
  type RoutingStatus,
} from "@/lib/mock-data/manufacturing-routings";
import { useManufacturingBomStore } from "@/lib/store/manufacturing-bom-store";
import { useManufacturingRoutingStore } from "@/lib/store/manufacturing-routing-store";
import { useManufacturingWorkCenterStore } from "@/lib/store/manufacturing-work-center-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type OpDraft = {
  key: string;
  sequence: number;
  name: string;
  workCenterCode: string;
  durationMin: number;
  setupMin: number;
};

type Props = {
  mode?: "create" | "edit";
  initialRouting?: ManufacturingRouting | null;
  inDialog?: boolean;
  onClose?: () => void;
  onSaved?: (routing: ManufacturingRouting) => void;
};

function emptyOp(seq: number): OpDraft {
  return {
    key: `op_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    sequence: seq,
    name: "",
    workCenterCode: "WC-ASM-01",
    durationMin: 15,
    setupMin: 0,
  };
}

export function RoutingForm({
  mode = "create",
  initialRouting,
  inDialog,
  onClose,
  onSaved,
}: Props) {
  const addRouting = useManufacturingRoutingStore((s) => s.addRouting);
  const patchRouting = useManufacturingRoutingStore((s) => s.patchRouting);
  const activateRouting = useManufacturingRoutingStore((s) => s.activateRouting);
  const boms = useManufacturingBomStore((s) => s.boms);
  const workCenters = useManufacturingWorkCenterStore((s) => s.workCenters);

  const [bomId, setBomId] = useState(initialRouting?.bomId ?? boms[0]?.id ?? "");
  const [productName, setProductName] = useState(initialRouting?.productName ?? "");
  const [productSku, setProductSku] = useState(initialRouting?.productSku ?? "");
  const [version, setVersion] = useState(initialRouting?.version ?? "v1.0");
  const [effectiveFrom, setEffectiveFrom] = useState(
    initialRouting?.effectiveFrom ?? new Date().toISOString().slice(0, 10),
  );
  const [status, setStatus] = useState<RoutingStatus>(initialRouting?.status ?? "draft");
  const [notes, setNotes] = useState(initialRouting?.notes ?? "");
  const [ops, setOps] = useState<OpDraft[]>(() =>
    initialRouting?.operations.map((o) => ({ ...o, key: o.id })) ??
      defaultRoutingOperations.map((o, i) => ({ ...o, key: `new_${i}` })),
  );

  useEffect(() => {
    if (!initialRouting) return;
    setBomId(initialRouting.bomId ?? "");
    setProductName(initialRouting.productName);
    setProductSku(initialRouting.productSku);
    setVersion(initialRouting.version);
    setEffectiveFrom(initialRouting.effectiveFrom);
    setStatus(initialRouting.status);
    setNotes(initialRouting.notes ?? "");
    setOps(initialRouting.operations.map((o) => ({ ...o, key: o.id })));
  }, [initialRouting]);

  const onBomChange = (id: string) => {
    setBomId(id);
    const bom = boms.find((b) => b.id === id);
    if (bom && mode === "create") {
      setProductName(bom.productName);
      setProductSku(bom.productSku);
    }
  };

  const updateOp = (key: string, patch: Partial<OpDraft>) => {
    setOps((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };

  const save = useCallback(
    (activate: boolean) => {
      if (!productName.trim() || !productSku.trim()) {
        toast.error("Product name and SKU required");
        return;
      }
      const validOps = ops.filter((o) => o.name.trim());
      if (validOps.length === 0) {
        toast.error("Add at least one operation");
        return;
      }

      const bom = boms.find((b) => b.id === bomId);

      if (mode === "edit" && initialRouting) {
        patchRouting(initialRouting.id, {
          productName: productName.trim(),
          productSku: productSku.trim(),
          bomId: bom?.id,
          bomNumber: bom?.number,
          version,
          effectiveFrom,
          status,
          notes: notes.trim() || undefined,
          operations: validOps.map((o) => ({
            id: o.key.startsWith("rop_") ? o.key : `rop_${Date.now()}_${o.sequence}`,
            sequence: o.sequence,
            name: o.name.trim(),
            workCenterCode: o.workCenterCode,
            durationMin: o.durationMin,
            setupMin: o.setupMin,
          })),
        });
        if (activate && status === "draft") {
          activateRouting(initialRouting.id);
        } else {
          toast.success("Routing updated");
        }
        onSaved?.({ ...initialRouting, productName: productName.trim() });
        onClose?.();
        return;
      }

      const draft = buildRoutingDraft({
        productName: productName.trim(),
        productSku: productSku.trim(),
        bomId: bom?.id,
        bomNumber: bom?.number,
        version,
        effectiveFrom,
        notes: notes.trim() || undefined,
        operations: validOps.map(({ key: _k, ...o }) => o),
      });
      addRouting(draft);
      if (activate) {
        activateRouting(draft.id);
      } else {
        toast.success(`Routing ${draft.number} saved`);
      }
      onSaved?.(draft);
      onClose?.();
    },
    [
      activateRouting,
      addRouting,
      bomId,
      boms,
      effectiveFrom,
      initialRouting,
      mode,
      notes,
      onClose,
      onSaved,
      ops,
      patchRouting,
      productName,
      productSku,
      status,
      version,
    ],
  );

  const activeWcs = workCenters.filter((wc) => wc.status === "active");

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-input pb-3">
        <div>
          <h2 className="text-base font-semibold">
            {mode === "create" ? "New routing" : `Edit · ${initialRouting?.number ?? ""}`}
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Operation sequence per product — links to work centers (prototype).
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => save(false)}>
            Save draft
          </Button>
          <Button size="sm" className="h-7 px-2 text-xs" onClick={() => save(true)}>
            Save & activate
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
            <Label className="text-xs">Linked BOM (optional)</Label>
            <Select className="h-9 text-xs" value={bomId} onChange={(e) => onBomChange(e.target.value)}>
              <option value="">— No BOM —</option>
              {boms.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.number} — {b.productName}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Product name</Label>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Product SKU</Label>
            <Input
              value={productSku}
              onChange={(e) => setProductSku(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Version</Label>
            <Input value={version} onChange={(e) => setVersion(e.target.value)} className="h-9 text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Effective from</Label>
            <Input
              type="date"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          {mode === "edit" && (
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select
                className="h-9 text-xs"
                value={status}
                onChange={(e) => setStatus(e.target.value as RoutingStatus)}
              >
                {Object.entries(ROUTING_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Operations</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                const maxSeq = ops.reduce((m, o) => Math.max(m, o.sequence), 0);
                setOps((rows) => [...rows, emptyOp(maxSeq + 10)]);
              }}
            >
              <Plus className="mr-1 h-3 w-3" /> Add step
            </Button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-input">
            <table className="w-full min-w-[640px] text-xs">
              <thead className="border-b bg-muted/40 text-left text-[11px] text-muted-foreground">
                <tr>
                  <th className="px-2 py-2 font-medium w-16">Seq</th>
                  <th className="px-2 py-2 font-medium">Operation</th>
                  <th className="px-2 py-2 font-medium">Work center</th>
                  <th className="px-2 py-2 font-medium w-20">Setup</th>
                  <th className="px-2 py-2 font-medium w-20">Run</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {ops.map((op) => (
                  <tr key={op.key} className="border-b last:border-0">
                    <td className="px-2 py-1.5">
                      <Input
                        type="number"
                        value={op.sequence}
                        onChange={(e) => updateOp(op.key, { sequence: Number(e.target.value) || 0 })}
                        className="h-8 w-14 text-xs"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <Input
                        value={op.name}
                        onChange={(e) => updateOp(op.key, { name: e.target.value })}
                        className="h-8 text-xs"
                        placeholder="Operation name"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <Select
                        className="h-8 text-xs"
                        value={op.workCenterCode}
                        onChange={(e) => updateOp(op.key, { workCenterCode: e.target.value })}
                      >
                        {activeWcs.map((wc) => (
                          <option key={wc.id} value={wc.code}>
                            {wc.code} — {wc.name}
                          </option>
                        ))}
                      </Select>
                    </td>
                    <td className="px-2 py-1.5">
                      <Input
                        type="number"
                        min={0}
                        value={op.setupMin}
                        onChange={(e) => updateOp(op.key, { setupMin: Number(e.target.value) || 0 })}
                        className="h-8 w-16 text-xs"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <Input
                        type="number"
                        min={0}
                        value={op.durationMin}
                        onChange={(e) => updateOp(op.key, { durationMin: Number(e.target.value) || 0 })}
                        className="h-8 w-16 text-xs"
                      />
                    </td>
                    <td className="px-1 py-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={ops.length <= 1}
                        onClick={() => setOps((rows) => rows.filter((r) => r.key !== op.key))}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="text-xs"
          />
        </div>
      </div>
    </div>
  );
}
