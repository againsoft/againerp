import { create } from "zustand";
import { chequesSeed, type ChequeInstrument } from "@/lib/mock-data/finance";

type FinanceChequeStore = {
  cheques: ChequeInstrument[];
  addCheques: (items: ChequeInstrument[]) => void;
  updateChequeStatus: (id: string, status: ChequeInstrument["status"]) => void;
};

export const useFinanceChequeStore = create<FinanceChequeStore>((set) => ({
  cheques: [...chequesSeed],
  addCheques: (items) => set((s) => ({ cheques: [...items, ...s.cheques] })),
  updateChequeStatus: (id, status) =>
    set((s) => ({
      cheques: s.cheques.map((c) => (c.id === id ? { ...c, status } : c)),
    })),
}));
