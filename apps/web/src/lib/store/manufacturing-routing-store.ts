import { create } from "zustand";
import { toast } from "sonner";
import {
  routingsSeed,
  routingTotalDuration,
  type ManufacturingRouting,
  type RoutingOperation,
  type RoutingStatus,
} from "@/lib/mock-data/manufacturing-routings";

type ManufacturingRoutingStore = {
  routings: ManufacturingRouting[];
  getById: (id: string) => ManufacturingRouting | undefined;
  getByProductSku: (sku: string) => ManufacturingRouting[];
  addRouting: (routing: ManufacturingRouting) => void;
  patchRouting: (id: string, patch: Partial<ManufacturingRouting>) => void;
  updateStatus: (id: string, status: RoutingStatus) => void;
  updateOperation: (routingId: string, opId: string, patch: Partial<RoutingOperation>) => void;
  addOperation: (routingId: string) => void;
  removeOperation: (routingId: string, opId: string) => void;
  activateRouting: (id: string) => void;
  obsoleteRouting: (id: string) => void;
};

function recalc(routing: ManufacturingRouting): ManufacturingRouting {
  return {
    ...routing,
    totalDurationMin: routingTotalDuration(routing.operations),
  };
}

export const useManufacturingRoutingStore = create<ManufacturingRoutingStore>()((set, get) => ({
  routings: [...routingsSeed],
  getById: (id) => get().routings.find((r) => r.id === id),
  getByProductSku: (sku) => get().routings.filter((r) => r.productSku === sku),
  addRouting: (routing) => set((s) => ({ routings: [routing, ...s.routings] })),
  patchRouting: (id, patch) =>
    set((s) => ({
      routings: s.routings.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, ...patch };
        return recalc(updated);
      }),
    })),
  updateStatus: (id, status) =>
    set((s) => ({
      routings: s.routings.map((r) => (r.id === id ? { ...r, status } : r)),
    })),
  updateOperation: (routingId, opId, patch) =>
    set((s) => ({
      routings: s.routings.map((r) => {
        if (r.id !== routingId) return r;
        const operations = r.operations.map((op) => (op.id === opId ? { ...op, ...patch } : op));
        return recalc({ ...r, operations });
      }),
    })),
  addOperation: (routingId) => {
    const stamp = Date.now();
    set((s) => ({
      routings: s.routings.map((r) => {
        if (r.id !== routingId) return r;
        const maxSeq = r.operations.reduce((m, o) => Math.max(m, o.sequence), 0);
        const operations = [
          ...r.operations,
          {
            id: `rop_${stamp}`,
            sequence: maxSeq + 10,
            name: "New operation",
            workCenterCode: "WC-ASM-01",
            durationMin: 15,
            setupMin: 0,
          },
        ];
        return recalc({ ...r, operations });
      }),
    }));
  },
  removeOperation: (routingId, opId) =>
    set((s) => ({
      routings: s.routings.map((r) => {
        if (r.id !== routingId) return r;
        const operations = r.operations.filter((op) => op.id !== opId);
        if (operations.length === 0) return r;
        return recalc({ ...r, operations });
      }),
    })),
  activateRouting: (id) => {
    const routing = get().getById(id);
    if (!routing) return;
    if (routing.operations.length === 0) {
      toast.error("Add at least one operation");
      return;
    }
    set((s) => ({
      routings: s.routings.map((r) =>
        r.id === id ? { ...r, status: "active" as RoutingStatus } : r,
      ),
    }));
    toast.success("Routing activated for production");
  },
  obsoleteRouting: (id) => {
    set((s) => ({
      routings: s.routings.map((r) =>
        r.id === id ? { ...r, status: "obsolete" as RoutingStatus } : r,
      ),
    }));
    toast.success("Routing marked obsolete");
  },
}));

export function routingStatusBadgeVariant(
  status: RoutingStatus,
): "default" | "secondary" | "success" | "warning" | "muted" | "outline" {
  switch (status) {
    case "draft":
      return "muted";
    case "active":
      return "success";
    case "obsolete":
      return "outline";
    default:
      return "muted";
  }
}
