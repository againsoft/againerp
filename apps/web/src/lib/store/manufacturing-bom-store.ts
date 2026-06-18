import { create } from "zustand";
import { toast } from "sonner";
import {
  bomsSeed,
  type BillOfMaterials,
  type BomLine,
  type BomType,
} from "@/lib/mock-data/manufacturing-boms";

type ManufacturingBomStore = {
  boms: BillOfMaterials[];
  getById: (id: string) => BillOfMaterials | undefined;
  addBom: (bom: BillOfMaterials) => void;
  patchBom: (id: string, patch: Partial<BillOfMaterials>) => void;
  updateLine: (bomId: string, lineId: string, patch: Partial<BomLine>) => void;
  addLine: (bomId: string, line?: Partial<BomLine>) => void;
  removeLine: (bomId: string, lineId: string) => void;
  duplicateBom: (id: string) => BillOfMaterials | undefined;
};

export const useManufacturingBomStore = create<ManufacturingBomStore>()((set, get) => ({
  boms: [...bomsSeed],
  getById: (id) => get().boms.find((b) => b.id === id),
  addBom: (bom) => set((s) => ({ boms: [bom, ...s.boms] })),
  patchBom: (id, patch) =>
    set((s) => ({
      boms: s.boms.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    })),
  updateLine: (bomId, lineId, patch) =>
    set((s) => ({
      boms: s.boms.map((b) => {
        if (b.id !== bomId) return b;
        return {
          ...b,
          lines: b.lines.map((l) => (l.id === lineId ? { ...l, ...patch } : l)),
        };
      }),
    })),
  addLine: (bomId, line) => {
    const stamp = Date.now();
    set((s) => ({
      boms: s.boms.map((b) => {
        if (b.id !== bomId) return b;
        return {
          ...b,
          lines: [
            ...b.lines,
            {
              id: `bl_${stamp}`,
              sku: line?.sku ?? "",
              name: line?.name ?? "",
              quantity: line?.quantity ?? 1,
              uom: line?.uom ?? "ea",
            },
          ],
        };
      }),
    }));
  },
  removeLine: (bomId, lineId) =>
    set((s) => ({
      boms: s.boms.map((b) => {
        if (b.id !== bomId) return b;
        const lines = b.lines.filter((l) => l.id !== lineId);
        return { ...b, lines: lines.length > 0 ? lines : b.lines };
      }),
    })),
  duplicateBom: (id) => {
    const source = get().getById(id);
    if (!source) return undefined;
    const stamp = Date.now();
    const copy: BillOfMaterials = {
      ...source,
      id: `bom_${stamp}`,
      number: `${source.number}-COPY`,
      version: `${source.version}-draft`,
      effectiveFrom: new Date().toISOString().slice(0, 10),
      lines: source.lines.map((l, i) => ({ ...l, id: `bl_${stamp}_${i}` })),
    };
    set((s) => ({ boms: [copy, ...s.boms] }));
    toast.success(`BOM duplicated as ${copy.number}`);
    return copy;
  },
}));

export function bomTypeBadgeVariant(
  type: BomType,
): "default" | "secondary" | "success" | "warning" | "muted" | "outline" {
  switch (type) {
    case "manufacturing":
      return "default";
    case "phantom":
      return "secondary";
    case "kit":
      return "warning";
    default:
      return "muted";
  }
}
