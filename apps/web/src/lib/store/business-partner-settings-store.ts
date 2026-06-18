import { create } from "zustand";
import { toast } from "sonner";
import {
  businessPartnerSettingsSeed,
  type BusinessPartnerSettings,
} from "@/lib/mock-data/business-partner-settings";

type SettingsStore = {
  settings: BusinessPartnerSettings;
  patchSettings: (patch: Partial<BusinessPartnerSettings>) => void;
};

export const useBusinessPartnerSettingsStore = create<SettingsStore>()((set) => ({
  settings: { ...businessPartnerSettingsSeed },
  patchSettings: (patch) => {
    set((s) => ({ settings: { ...s.settings, ...patch } }));
    toast.success("Settings saved");
  },
}));
