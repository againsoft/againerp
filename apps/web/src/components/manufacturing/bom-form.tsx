"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  BOM_TYPE_LABELS,
  buildBomDraft,
  type BillOfMaterials,
  type BomLine,
  type BomType,
} from "@/lib/mock-data/manufacturing-boms";
import { useManufacturingBomStore } from "@/lib/store/manufacturing-bom-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type LineDraft = Omit<BomLine, "id"> & { key: string };

type Props = {
  mode?: "create" | "edit";
  initialBom?: BillOfMaterials | null;
  inDialog?: boolean;
  onClose?: () => void;
  onSaved?: (bom: BillOfMaterials) => void;
};

function emptyLine(): LineDraft {
  return {
    key: `line_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    sku: "",
    name: "",
    quantity: 1,
    uom: "ea",
  };
}

export function BomForm({ mode = "create", initialBom, inDialog, onClose, onSaved }: Props) {
  const addBom = useManufacturingBomStore((s) => s.addBom);
  const patchBom = useManufacturingBomStore((s) => s.patchBom);

  const [productName, setProductName] = useState(initialBom?.productName ?? "");
  const [productSku, setProductSku] = useState(initialBom?.productSku ?? "");
  const [type, setType] = useState<BomType>(initialBom?.type ?? "manufacturing");
  const [version, setVersion] = useState(initialBom?.version ?? "v1.0");
  const [effectiveFrom, setEffectiveFrom] = useState(
    initialBom?.effectiveFrom ?? new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState(initialBom?.notes ?? "");
  const [lines, setLines] = useState<LineDraft[]>(() =>
    initialBom?.lines.map((l) => ({ ...l, key: l.id })) ?? [emptyLine()],
  );

  useEffect(() => {
    if (!initialBom) return;
    setProductName(initialBom.productName);
    setProductSku(initialBom.productSku);
    setType(initialBom.type);
    setVersion(initialBom.version);
    setEffectiveFrom(initialBom.effectiveFrom);
    setNotes(initialBom.notes ?? "");
    setLines(initialBom.lines.map((l) => ({ ...l, key: l.id })));
  }, [initialBom]);

  const updateLine = (key: string, patch: Partial<LineDraft>) => {
    setLines((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };

  const save = useCallback(() => {
    if (!productName.trim() || !productSku.trim()) {
      toast.error("Product name and SKU are required");
      return;
    }
    const validLines = lines.filter((l) => l.name.trim() || l.sku.trim());
    if (validLines.length === 0) {
      toast.error("Add at least one component line");
      return;
    }

    if (mode === "edit" && initialBom) {
      patchBom(initialBom.id, {
        productName: productName.trim(),
        productSku: productSku.trim(),
        type,
        version,
        effectiveFrom,
        notes: notes.trim() || undefined,
        lines: validLines.map(({ key, ...l }) => ({ ...l, id: key.startsWith("bl_") ? key : `bl_${key}` })),
      });
      toast.success("BOM updated");
      onSaved?.({ ...initialBom, productName: productName.trim() });
      onClose?.();
      return;
    }

    const draft = buildBomDraft({
      productName: productName.trim(),
      productSku: productSku.trim(),
      type,
      version,
      effectiveFrom,
      notes: notes.trim() || undefined,
      lines: validLines.map(({ key: _k, ...l }) => l),
    });
    addBom(draft);
    toast.success(`BOM ${draft.number} created`);
    onSaved?.(draft);
    onClose?.();
  }, [
    addBom,
    effectiveFrom,
    initialBom,
    lines,
    mode,
    notes,
    onClose,
    onSaved,
    patchBom,
    productName,
    productSku,
    type,
    version,
  ]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-input pb-3">
        <div>
          <h2 className="text-base font-semibold">
            {mode === "create" ? "New BOM" : `Edit · ${initialBom?.number ?? ""}`}
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Bill of materials — components per finished unit (prototype).
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
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Finished product name</Label>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="h-9 text-xs"
              placeholder="Premium Cotton T-Shirt"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Product SKU</Label>
            <Input
              value={productSku}
              onChange={(e) => setProductSku(e.target.value)}
              className="h-9 text-xs"
              placeholder="SKU-0001"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">BOM type</Label>
            <Select
              className="h-9 text-xs"
              value={type}
              onChange={(e) => setType(e.target.value as BomType)}
            >
              {Object.entries(BOM_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Version</Label>
            <Input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="h-9 text-xs"
              placeholder="v1.0"
            />
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
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Components</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setLines((rows) => [...rows, emptyLine()])}
            >
              <Plus className="mr-1 h-3 w-3" /> Add line
            </Button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-input">
            <table className="w-full min-w-[560px] text-xs">
              <thead className="border-b bg-muted/40 text-left text-[11px] text-muted-foreground">
                <tr>
                  <th className="px-2 py-2 font-medium">SKU</th>
                  <th className="px-2 py-2 font-medium">Name</th>
                  <th className="px-2 py-2 font-medium w-20">Qty</th>
                  <th className="px-2 py-2 font-medium w-16">UoM</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.key} className="border-b last:border-0">
                    <td className="px-2 py-1.5">
                      <Input
                        value={line.sku}
                        onChange={(e) => updateLine(line.key, { sku: e.target.value })}
                        className="h-8 text-xs"
                        placeholder="RM-…"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <Input
                        value={line.name}
                        onChange={(e) => updateLine(line.key, { name: e.target.value })}
                        className="h-8 text-xs"
                        placeholder="Component name"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={line.quantity}
                        onChange={(e) =>
                          updateLine(line.key, { quantity: Number(e.target.value) || 0 })
                        }
                        className="h-8 text-xs"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <Input
                        value={line.uom}
                        onChange={(e) => updateLine(line.key, { uom: e.target.value })}
                        className="h-8 text-xs"
                      />
                    </td>
                    <td className="px-1 py-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={lines.length <= 1}
                        onClick={() => setLines((rows) => rows.filter((r) => r.key !== line.key))}
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
            placeholder="Revision notes, engineering change…"
          />
        </div>
      </div>
    </div>
  );
}
