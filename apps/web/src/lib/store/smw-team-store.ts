import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  smwTeamsSeed,
  type SmwTeam,
  type TeamStatus,
} from "@/lib/mock-data/smw-teams";

type SmwTeamState = {
  teams: SmwTeam[];
  upsertTeam: (team: SmwTeam) => void;
  updateStatus: (id: string, status: TeamStatus) => void;
};

export const useSmwTeamStore = create<SmwTeamState>()(
  persist(
    (set, get) => ({
      teams: smwTeamsSeed,
      upsertTeam: (team) => {
        const list = get().teams;
        const idx = list.findIndex((t) => t.id === team.id);
        if (idx >= 0) {
          const next = [...list];
          next[idx] = team;
          set({ teams: next });
        } else {
          set({ teams: [team, ...list] });
        }
      },
      updateStatus: (id, status) => {
        set({
          teams: get().teams.map((t) => (t.id === id ? { ...t, status } : t)),
        });
      },
    }),
    { name: "againerp-smw-teams", version: 1 },
  ),
);
