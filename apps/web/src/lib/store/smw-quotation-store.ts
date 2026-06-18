import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  smwQuotationsSeed,
  type QuotationStatus,
  type SmwQuotation,
} from "@/lib/mock-data/smw-quotations";

type SmwQuotationState = {
  quotations: SmwQuotation[];
  upsertQuotation: (quo: SmwQuotation) => void;
  updateStatus: (id: string, status: QuotationStatus) => void;
};

export const useSmwQuotationStore = create<SmwQuotationState>()(
  persist(
    (set, get) => ({
      quotations: smwQuotationsSeed,
      upsertQuotation: (quo) => {
        const list = get().quotations;
        const idx = list.findIndex((q) => q.id === quo.id);
        if (idx >= 0) {
          const next = [...list];
          next[idx] = quo;
          set({ quotations: next });
        } else {
          set({ quotations: [quo, ...list] });
        }
      },
      updateStatus: (id, status) => {
        set({
          quotations: get().quotations.map((q) => (q.id === id ? { ...q, status } : q)),
        });
      },
    }),
    { name: "againerp-smw-quotations", version: 1 },
  ),
);
