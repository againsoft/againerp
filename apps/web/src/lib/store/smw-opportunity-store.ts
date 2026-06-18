import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getStageProbability,
  smwOpportunitiesSeed,
  type OpportunityStage,
  type SmwOpportunity,
} from "@/lib/mock-data/smw-opportunities";

type SmwOpportunityState = {
  opportunities: SmwOpportunity[];
  upsertOpportunity: (opp: SmwOpportunity) => void;
  moveStage: (id: string, stage: OpportunityStage) => void;
};

export const useSmwOpportunityStore = create<SmwOpportunityState>()(
  persist(
    (set, get) => ({
      opportunities: smwOpportunitiesSeed,
      upsertOpportunity: (opp) => {
        const list = get().opportunities;
        const idx = list.findIndex((o) => o.id === opp.id);
        if (idx >= 0) {
          const next = [...list];
          next[idx] = opp;
          set({ opportunities: next });
        } else {
          set({ opportunities: [opp, ...list] });
        }
      },
      moveStage: (id, stage) => {
        set({
          opportunities: get().opportunities.map((o) =>
            o.id === id
              ? {
                  ...o,
                  stage,
                  probability: getStageProbability(stage),
                  lastActivityRelative: "Just now",
                }
              : o,
          ),
        });
      },
    }),
    { name: "againerp-smw-opportunities", version: 1 },
  ),
);
