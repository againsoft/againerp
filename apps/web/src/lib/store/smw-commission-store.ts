import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  smwCommissionsSeed,
  type CommissionStatus,
  type SmwCommission,
} from "@/lib/mock-data/smw-commissions";

type SmwCommissionState = {
  commissions: SmwCommission[];
  upsertCommission: (commission: SmwCommission) => void;
  updateStatus: (id: string, status: CommissionStatus) => void;
};

export const useSmwCommissionStore = create<SmwCommissionState>()(
  persist(
    (set, get) => ({
      commissions: smwCommissionsSeed,
      upsertCommission: (commission) => {
        const list = get().commissions;
        const idx = list.findIndex((c) => c.id === commission.id);
        if (idx >= 0) {
          const next = [...list];
          next[idx] = commission;
          set({ commissions: next });
        } else {
          set({ commissions: [commission, ...list] });
        }
      },
      updateStatus: (id, status) => {
        set({
          commissions: get().commissions.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status,
                  payoutDate: status === "paid" ? new Date().toISOString().slice(0, 10) : c.payoutDate,
                }
              : c,
          ),
        });
      },
    }),
    { name: "againerp-smw-commissions", version: 1 },
  ),
);
