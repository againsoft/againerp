import { create } from "zustand";
import { toast } from "sonner";
import {
  mrpRunsSeed,
  type MrpRun,
  type MrpRunStatus,
  type MrpSuggestion,
  type MrpSuggestionStatus,
} from "@/lib/mock-data/manufacturing-mrp";

type ManufacturingMrpStore = {
  runs: MrpRun[];
  getById: (id: string) => MrpRun | undefined;
  addRun: (run: MrpRun) => void;
  patchRun: (id: string, patch: Partial<MrpRun>) => void;
  updateStatus: (id: string, status: MrpRunStatus) => void;
  updateSuggestion: (runId: string, suggestionId: string, patch: Partial<MrpSuggestion>) => void;
  runMrp: (id: string) => void;
  confirmSuggestion: (runId: string, suggestionId: string) => void;
};

export const useManufacturingMrpStore = create<ManufacturingMrpStore>()((set, get) => ({
  runs: [...mrpRunsSeed],
  getById: (id) => get().runs.find((r) => r.id === id),
  addRun: (run) => set((s) => ({ runs: [run, ...s.runs] })),
  patchRun: (id, patch) =>
    set((s) => ({
      runs: s.runs.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),
  updateStatus: (id, status) =>
    set((s) => ({
      runs: s.runs.map((r) => (r.id === id ? { ...r, status } : r)),
    })),
  updateSuggestion: (runId, suggestionId, patch) =>
    set((s) => ({
      runs: s.runs.map((r) => {
        if (r.id !== runId) return r;
        return {
          ...r,
          suggestions: r.suggestions.map((sg) =>
            sg.id === suggestionId ? { ...sg, ...patch } : sg,
          ),
        };
      }),
    })),
  runMrp: (id) => {
    const run = get().getById(id);
    if (!run) return;
    if (run.status === "running") {
      toast.error("MRP run already in progress");
      return;
    }
    if (run.status === "completed") {
      toast.error("Run already completed");
      return;
    }
    set((s) => ({
      runs: s.runs.map((r) =>
        r.id === id ? { ...r, status: "running" as MrpRunStatus } : r,
      ),
    }));
    toast.success("MRP run started (mock)");
    setTimeout(() => {
      set((s) => ({
        runs: s.runs.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "completed" as MrpRunStatus,
                workOrdersProposed: Math.max(r.workOrdersProposed, 1),
                shortagesFound: Math.max(r.shortagesFound, 1),
              }
            : r,
        ),
      }));
      toast.success("MRP run completed — proposals ready");
    }, 1200);
  },
  confirmSuggestion: (runId, suggestionId) => {
    get().updateSuggestion(runId, suggestionId, { status: "confirmed" as MrpSuggestionStatus });
    toast.success("Suggestion confirmed (mock WO/PR created)");
  },
}));

export function mrpRunStatusBadgeVariant(
  status: MrpRunStatus,
): "default" | "secondary" | "success" | "warning" | "muted" | "outline" {
  switch (status) {
    case "draft":
      return "muted";
    case "running":
      return "default";
    case "completed":
      return "success";
    case "failed":
      return "outline";
    default:
      return "muted";
  }
}

export function mrpSuggestionTypeBadgeVariant(
  type: MrpSuggestion["type"],
): "default" | "secondary" | "success" | "warning" | "muted" | "outline" {
  return type === "work_order" ? "default" : "secondary";
}

export function mrpSuggestionStatusBadgeVariant(
  status: MrpSuggestionStatus,
): "default" | "secondary" | "success" | "warning" | "muted" | "outline" {
  switch (status) {
    case "proposed":
      return "muted";
    case "confirmed":
      return "success";
    case "skipped":
      return "outline";
    default:
      return "muted";
  }
}
