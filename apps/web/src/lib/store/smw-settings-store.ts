import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  defaultSmwSettings,
  smwSettingsSeed,
  type SmwSettings,
} from "@/lib/mock-data/smw-settings";

type SmwSettingsState = {
  settings: SmwSettings;
  patchSettings: (patch: Partial<SmwSettings>) => void;
  resetSettings: () => void;
};

export const useSmwSettingsStore = create<SmwSettingsState>()(
  persist(
    (set, get) => ({
      settings: smwSettingsSeed,
      patchSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      resetSettings: () => set({ settings: defaultSmwSettings() }),
    }),
    { name: "againerp-smw-settings", version: 1 },
  ),
);
