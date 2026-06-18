import { create } from "zustand";
import { toast } from "sonner";
import {
  workOrdersSeed,
  type ShopFloorLogEntry,
  type ShopFloorLogType,
  type WorkOrder,
  type WorkOrderMaterial,
  type WorkOrderOperation,
  type WorkOrderStatus,
} from "@/lib/mock-data/manufacturing-work-orders";
import {
  issueAllWorkOrderMaterials,
  issueWorkOrderMaterial,
  receiveWorkOrderOutput,
  reserveWorkOrderMaterials,
} from "@/lib/services/manufacturing-integration";

type ManufacturingWorkOrderStore = {
  workOrders: WorkOrder[];
  getById: (id: string) => WorkOrder | undefined;
  addWorkOrder: (wo: WorkOrder) => void;
  patchWorkOrder: (id: string, patch: Partial<WorkOrder>) => void;
  updateStatus: (id: string, status: WorkOrderStatus) => void;
  updateMaterial: (woId: string, materialId: string, patch: Partial<WorkOrderMaterial>) => void;
  releaseWorkOrder: (id: string) => void;
  startWorkOrder: (id: string) => void;
  completeWorkOrder: (id: string) => void;
  issueMaterials: (id: string) => void;
  issueMaterialLine: (woId: string, materialId: string) => void;
  startOperation: (woId: string, operationId: string) => void;
  completeOperation: (woId: string, operationId: string) => void;
  recordOutput: (woId: string, quantity: number) => void;
};

function appendLog(
  wo: WorkOrder,
  type: ShopFloorLogType,
  message: string,
): ShopFloorLogEntry[] {
  const entry: ShopFloorLogEntry = {
    id: `sfl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    at: new Date().toISOString(),
    type,
    message,
  };
  return [...(wo.shopFloorLog ?? []), entry];
}

function patchWo(id: string, updater: (wo: WorkOrder) => WorkOrder) {
  return (s: { workOrders: WorkOrder[] }) => ({
    workOrders: s.workOrders.map((w) => (w.id === id ? updater(w) : w)),
  });
}

export const useManufacturingWorkOrderStore = create<ManufacturingWorkOrderStore>()((set, get) => ({
  workOrders: [...workOrdersSeed],
  getById: (id) => get().workOrders.find((wo) => wo.id === id),
  addWorkOrder: (wo) => set((s) => ({ workOrders: [wo, ...s.workOrders] })),
  patchWorkOrder: (id, patch) =>
    set((s) => ({
      workOrders: s.workOrders.map((wo) => (wo.id === id ? { ...wo, ...patch } : wo)),
    })),
  updateStatus: (id, status) =>
    set((s) => ({
      workOrders: s.workOrders.map((wo) => (wo.id === id ? { ...wo, status } : wo)),
    })),
  updateMaterial: (woId, materialId, patch) =>
    set((s) => ({
      workOrders: s.workOrders.map((wo) => {
        if (wo.id !== woId) return wo;
        return {
          ...wo,
          materials: wo.materials.map((m) => (m.id === materialId ? { ...m, ...patch } : m)),
        };
      }),
    })),
  releaseWorkOrder: (id) => {
    const wo = get().getById(id);
    if (!wo) return;
    if (wo.status !== "planned") {
      toast.error("Only planned work orders can be released");
      return;
    }
    const integration = reserveWorkOrderMaterials(wo);
    const reserveMsg =
      integration.inventoryEvents.length > 0
        ? `WO released — ${integration.inventoryEvents.length} components reserved (inventory.reserve.posted)`
        : "WO released — components reserved (inventory.reserve.posted)";
    set(
      patchWo(id, (w) => ({
        ...w,
        status: "released",
        shopFloorLog: appendLog(w, "release", reserveMsg),
      })),
    );
    toast.success("Work order released — inventory.reserve.posted");
  },
  startWorkOrder: (id) => {
    const wo = get().getById(id);
    if (!wo) return;
    if (!["released", "planned"].includes(wo.status)) {
      toast.error("Release work order before starting");
      return;
    }
    const firstPendingIdx = wo.operations.findIndex((op) => op.status === "pending");
    const operations = wo.operations.map((op, i) =>
      i === firstPendingIdx ? { ...op, status: "in_progress" as const } : op,
    );
    const firstOp = operations[firstPendingIdx];
    set(
      patchWo(id, (w) => ({
        ...w,
        status: "in_progress",
        operations,
        shopFloorLog: appendLog(
          w,
          "start",
          firstOp
            ? `Production started — ${firstOp.name} (${firstOp.workCenter})`
            : "Production started on shop floor",
        ),
      })),
    );
    toast.success("Production started on shop floor");
  },
  issueMaterials: (id) => {
    const wo = get().getById(id);
    if (!wo) return;
    if (wo.status !== "in_progress") {
      toast.error("Issue materials while WO is in progress");
      return;
    }
    const integration = issueAllWorkOrderMaterials(wo);
    const materials = wo.materials.map((m) => ({
      ...m,
      quantityIssued: m.quantityRequired,
    }));
    const acctNote =
      integration.accountingEvents.length > 0
        ? ` + ${integration.accountingEvents.length} journal entry`
        : "";
    set(
      patchWo(id, (w) => ({
        ...w,
        materials,
        shopFloorLog: appendLog(
          w,
          "issue",
          `All materials issued — inventory.stock_out.posted${acctNote}`,
        ),
      })),
    );
    toast.success("Materials issued — inventory.stock_out.posted");
  },
  issueMaterialLine: (woId, materialId) => {
    const wo = get().getById(woId);
    if (!wo) return;
    if (wo.status !== "in_progress") {
      toast.error("Issue materials while WO is in progress");
      return;
    }
    const material = wo.materials.find((m) => m.id === materialId);
    if (!material) return;
    if (material.quantityIssued >= material.quantityRequired) {
      toast.error("Material already fully issued");
      return;
    }
    const delta = material.quantityRequired - material.quantityIssued;
    const integration = issueWorkOrderMaterial(wo, material, delta);
    set(
      patchWo(woId, (w) => ({
        ...w,
        materials: w.materials.map((m) =>
          m.id === materialId ? { ...m, quantityIssued: m.quantityRequired } : m,
        ),
        shopFloorLog: appendLog(
          w,
          "issue_line",
          `Issued ${material.name} (${delta} ${material.uom}) — ${integration.inventoryEvents[0] ?? "inventory.stock_out.posted"}`,
        ),
      })),
    );
    toast.success(`${material.sku} issued — inventory.stock_out.posted`);
  },
  startOperation: (woId, operationId) => {
    const wo = get().getById(woId);
    if (!wo) return;
    if (wo.status !== "in_progress") {
      toast.error("Start operations only while WO is in progress");
      return;
    }
    const op = wo.operations.find((o) => o.id === operationId);
    if (!op || op.status !== "pending") {
      toast.error("Operation is not pending");
      return;
    }
    const prevDone = wo.operations
      .filter((o) => o.sequence < op.sequence)
      .every((o) => o.status === "done");
    if (!prevDone) {
      toast.error("Complete previous operations first");
      return;
    }
    const hasActive = wo.operations.some((o) => o.status === "in_progress");
    if (hasActive) {
      toast.error("Finish the current operation before starting another");
      return;
    }
    set(
      patchWo(woId, (w) => ({
        ...w,
        operations: w.operations.map((o) =>
          o.id === operationId ? { ...o, status: "in_progress" as const } : o,
        ),
        shopFloorLog: appendLog(
          w,
          "operation_start",
          `Operation ${op.sequence} started — ${op.name} on ${op.workCenter}`,
        ),
      })),
    );
    toast.success(`Started: ${op.name}`);
  },
  completeOperation: (woId, operationId) => {
    const wo = get().getById(woId);
    if (!wo) return;
    if (wo.status !== "in_progress") {
      toast.error("Complete operations only while WO is in progress");
      return;
    }
    const op = wo.operations.find((o) => o.id === operationId);
    if (!op || op.status !== "in_progress") {
      toast.error("Operation is not in progress");
      return;
    }
    const operations = wo.operations.map((o) =>
      o.id === operationId ? { ...o, status: "done" as const } : o,
    );
    set(
      patchWo(woId, (w) => ({
        ...w,
        operations,
        shopFloorLog: appendLog(
          w,
          "operation_complete",
          `Operation ${op.sequence} complete — ${op.name}`,
        ),
      })),
    );
    toast.success(`Completed: ${op.name}`);
  },
  recordOutput: (woId, quantity) => {
    const wo = get().getById(woId);
    if (!wo) return;
    if (wo.status !== "in_progress") {
      toast.error("Record output while WO is in progress");
      return;
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      toast.error("Enter a positive quantity");
      return;
    }
    const remaining = wo.quantity - wo.quantityProduced;
    if (remaining <= 0) {
      toast.error("Planned quantity already produced");
      return;
    }
    const added = Math.min(quantity, remaining);
    const quantityProduced = wo.quantityProduced + added;
    const integration = receiveWorkOrderOutput(wo, added);
    set(
      patchWo(woId, (w) => ({
        ...w,
        quantityProduced,
        shopFloorLog: appendLog(
          w,
          "output",
          `Output recorded — ${quantityProduced} / ${w.quantity} units — ${integration.inventoryEvents[0] ?? "inventory.stock_in.posted"}`,
        ),
      })),
    );
    toast.success(`Recorded ${added} units — inventory.stock_in.posted`);
  },
  completeWorkOrder: (id) => {
    const wo = get().getById(id);
    if (!wo) return;
    if (wo.status !== "in_progress") {
      toast.error("Work order must be in progress");
      return;
    }
    const pendingOps = wo.operations.filter((o) => o.status !== "done");
    if (pendingOps.length > 0) {
      toast.error("Complete all operations before closing the WO");
      return;
    }
    const operations = wo.operations.map((op) => ({
      ...op,
      status: "done" as WorkOrderOperation["status"],
    }));
    const fgDelta = wo.quantity - wo.quantityProduced;
    const integration =
      fgDelta > 0 ? receiveWorkOrderOutput(wo, fgDelta) : { inventoryEvents: [], accountingEvents: [] };
    set(
      patchWo(id, (w) => ({
        ...w,
        status: "done",
        quantityProduced: w.quantity,
        operations,
        shopFloorLog: appendLog(
          w,
          "complete",
          fgDelta > 0
            ? `WO closed — ${fgDelta} units FG to ${w.warehouse} — ${integration.inventoryEvents[0] ?? "inventory.stock_in.posted"}`
            : `WO closed — ${w.quantity} units complete`,
        ),
      })),
    );
    toast.success("Work order completed — inventory.stock_in.posted");
  },
}));

export function workOrderStatusBadgeVariant(
  status: WorkOrderStatus,
): "default" | "secondary" | "success" | "warning" | "muted" | "outline" {
  switch (status) {
    case "planned":
      return "muted";
    case "released":
      return "secondary";
    case "in_progress":
      return "default";
    case "done":
      return "success";
    case "cancelled":
      return "outline";
    default:
      return "muted";
  }
}

export function workOrderPriorityBadgeVariant(
  priority: WorkOrder["priority"],
): "default" | "secondary" | "success" | "warning" | "muted" | "outline" {
  switch (priority) {
    case "high":
      return "warning";
    case "low":
      return "muted";
    default:
      return "secondary";
  }
}

export function operationStatusBadgeVariant(
  status: WorkOrderOperation["status"],
): "default" | "secondary" | "success" | "warning" | "muted" | "outline" {
  switch (status) {
    case "pending":
      return "muted";
    case "in_progress":
      return "default";
    case "done":
      return "success";
    default:
      return "muted";
  }
}

export function shopFloorLogIcon(type: ShopFloorLogType): string {
  switch (type) {
    case "release":
      return "📋";
    case "start":
      return "▶️";
    case "issue":
    case "issue_line":
      return "📦";
    case "operation_start":
      return "🔧";
    case "operation_complete":
      return "✅";
    case "output":
      return "📈";
    case "complete":
      return "🏁";
    default:
      return "•";
  }
}
