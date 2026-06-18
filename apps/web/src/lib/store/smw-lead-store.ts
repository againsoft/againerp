import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  smwLeadsSeed,
  type LeadStatus,
  type SmwLead,
} from "@/lib/mock-data/smw-leads";

type SmwLeadState = {
  leads: SmwLead[];
  upsertLead: (lead: SmwLead) => void;
  updateStatus: (id: string, status: LeadStatus) => void;
  assignOwner: (ids: string[], ownerId: string, ownerName: string) => void;
  archiveLeads: (ids: string[]) => void;
};

export const useSmwLeadStore = create<SmwLeadState>()(
  persist(
    (set, get) => ({
      leads: smwLeadsSeed,
      upsertLead: (lead) => {
        const list = get().leads;
        const idx = list.findIndex((l) => l.id === lead.id);
        if (idx >= 0) {
          const next = [...list];
          next[idx] = lead;
          set({ leads: next });
        } else {
          set({ leads: [lead, ...list] });
        }
      },
      updateStatus: (id, status) => {
        set({
          leads: get().leads.map((l) =>
            l.id === id
              ? {
                  ...l,
                  status,
                  lastActivityAt: new Date().toISOString(),
                  lastActivityRelative: "Just now",
                }
              : l,
          ),
        });
      },
      assignOwner: (ids, ownerId, ownerName) => {
        const idSet = new Set(ids);
        set({
          leads: get().leads.map((l) =>
            idSet.has(l.id) ? { ...l, ownerId, ownerName } : l,
          ),
        });
      },
      archiveLeads: (ids) => {
        const idSet = new Set(ids);
        set({
          leads: get().leads.map((l) => (idSet.has(l.id) ? { ...l, archived: true } : l)),
        });
      },
    }),
    { name: "againerp-smw-leads", version: 1 },
  ),
);
