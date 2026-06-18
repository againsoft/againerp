import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  smwTargetsSeed,
  type SmwTarget,
  type TargetStatus,
} from "@/lib/mock-data/smw-targets";

type SmwTargetState = {
  targets: SmwTarget[];
  upsertTarget: (target: SmwTarget) => void;
  updateStatus: (id: string, status: TargetStatus) => void;
};

export const useSmwTargetStore = create<SmwTargetState>()(
  persist(
    (set, get) => ({
      targets: smwTargetsSeed,
      upsertTarget: (target) => {
        const list = get().targets;
        const idx = list.findIndex((t) => t.id === target.id);
        if (idx >= 0) {
          const next = [...list];
          next[idx] = target;
          set({ targets: next });
        } else {
          set({ targets: [target, ...list] });
        }
      },
      updateStatus: (id, status) => {
        set({
          targets: get().targets.map((t) => (t.id === id ? { ...t, status } : t)),
        });
      },
    }),
    { name: "againerp-smw-targets", version: 1 },
  ),
);
