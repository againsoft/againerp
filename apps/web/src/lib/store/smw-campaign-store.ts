import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  smwCampaignsSeed,
  type CampaignStatus,
  type SmwCampaign,
} from "@/lib/mock-data/smw-campaigns";

type SmwCampaignState = {
  campaigns: SmwCampaign[];
  upsertCampaign: (campaign: SmwCampaign) => void;
  updateStatus: (id: string, status: CampaignStatus) => void;
};

export const useSmwCampaignStore = create<SmwCampaignState>()(
  persist(
    (set, get) => ({
      campaigns: smwCampaignsSeed,
      upsertCampaign: (campaign) => {
        const list = get().campaigns;
        const idx = list.findIndex((c) => c.id === campaign.id);
        if (idx >= 0) {
          const next = [...list];
          next[idx] = campaign;
          set({ campaigns: next });
        } else {
          set({ campaigns: [campaign, ...list] });
        }
      },
      updateStatus: (id, status) => {
        set({
          campaigns: get().campaigns.map((c) => (c.id === id ? { ...c, status } : c)),
        });
      },
    }),
    { name: "againerp-smw-campaigns", version: 1 },
  ),
);
