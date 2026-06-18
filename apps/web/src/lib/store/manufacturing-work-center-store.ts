import { create } from "zustand";
import { toast } from "sonner";
import {
  workCentersSeed,
  type WorkCenter,
  type WorkCenterStatus,
} from "@/lib/mock-data/manufacturing-work-centers";

type ManufacturingWorkCenterStore = {
  workCenters: WorkCenter[];
  getById: (id: string) => WorkCenter | undefined;
  getByCode: (code: string) => WorkCenter | undefined;
  addWorkCenter: (wc: WorkCenter) => void;
  patchWorkCenter: (id: string, patch: Partial<WorkCenter>) => void;
  updateStatus: (id: string, status: WorkCenterStatus) => void;
  setMaintenance: (id: string) => void;
  activate: (id: string) => void;
};

export const useManufacturingWorkCenterStore = create<ManufacturingWorkCenterStore>()((set, get) => ({
  workCenters: [...workCentersSeed],
  getById: (id) => get().workCenters.find((wc) => wc.id === id),
  getByCode: (code) => get().workCenters.find((wc) => wc.code === code),
  addWorkCenter: (wc) => set((s) => ({ workCenters: [wc, ...s.workCenters] })),
  patchWorkCenter: (id, patch) =>
    set((s) => ({
      workCenters: s.workCenters.map((wc) => (wc.id === id ? { ...wc, ...patch } : wc)),
    })),
  updateStatus: (id, status) =>
    set((s) => ({
      workCenters: s.workCenters.map((wc) =>
        wc.id === id
          ? {
              ...wc,
              status,
              utilizationPct: status === "active" ? wc.utilizationPct : 0,
            }
          : wc,
      ),
    })),
  setMaintenance: (id) => {
    get().updateStatus(id, "maintenance");
    toast.success("Work center set to maintenance");
  },
  activate: (id) => {
    get().updateStatus(id, "active");
    toast.success("Work center activated");
  },
}));

export function workCenterStatusBadgeVariant(
  status: WorkCenterStatus,
): "default" | "secondary" | "success" | "warning" | "muted" | "outline" {
  switch (status) {
    case "active":
      return "success";
    case "maintenance":
      return "warning";
    case "inactive":
      return "muted";
    default:
      return "muted";
  }
}

export function workCenterTypeBadgeVariant(
  type: WorkCenter["type"],
): "default" | "secondary" | "success" | "warning" | "muted" | "outline" {
  switch (type) {
    case "machine":
      return "default";
    case "assembly":
      return "secondary";
    case "qc":
      return "warning";
    case "packaging":
      return "outline";
    default:
      return "muted";
  }
}
