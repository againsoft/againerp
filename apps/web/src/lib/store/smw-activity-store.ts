import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  smwActivitiesSeed,
  type ActivityStatus,
  type SmwActivity,
} from "@/lib/mock-data/smw-activities";

type SmwActivityState = {
  activities: SmwActivity[];
  upsertActivity: (activity: SmwActivity) => void;
  updateStatus: (id: string, status: ActivityStatus) => void;
  completeActivity: (id: string) => void;
};

export const useSmwActivityStore = create<SmwActivityState>()(
  persist(
    (set, get) => ({
      activities: smwActivitiesSeed,
      upsertActivity: (activity) => {
        const list = get().activities;
        const idx = list.findIndex((a) => a.id === activity.id);
        if (idx >= 0) {
          const next = [...list];
          next[idx] = activity;
          set({ activities: next });
        } else {
          set({ activities: [activity, ...list] });
        }
      },
      updateStatus: (id, status) => {
        set({
          activities: get().activities.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status,
                  completedAt: status === "completed" ? new Date().toISOString() : a.completedAt,
                }
              : a,
          ),
        });
      },
      completeActivity: (id) => {
        get().updateStatus(id, "completed");
      },
    }),
    { name: "againerp-smw-activities", version: 1 },
  ),
);
