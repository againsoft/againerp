import { create } from "zustand";
import { toast } from "sonner";
import {
  buildTierDraft,
  partnerTiersSeed,
  type PartnerTierDefinition,
  type TierType,
} from "@/lib/mock-data/business-partner-tiers";
import { useBusinessPartnerStore } from "@/lib/store/business-partner-store";

type BusinessPartnerTierStore = {
  tiers: PartnerTierDefinition[];
  getById: (id: string) => PartnerTierDefinition | undefined;
  getByCode: (code: string) => PartnerTierDefinition | undefined;
  addTier: (tier: PartnerTierDefinition) => void;
  patchTier: (id: string, patch: Partial<PartnerTierDefinition>) => void;
  deactivateTier: (id: string) => void;
  countPartners: (tierCode: string) => number;
};

export const useBusinessPartnerTierStore = create<BusinessPartnerTierStore>()((set, get) => ({
  tiers: partnerTiersSeed.map((t) => ({ ...t })),
  getById: (id) => get().tiers.find((t) => t.id === id),
  getByCode: (code) => get().tiers.find((t) => t.code === code),
  addTier: (tier) => {
    if (get().tiers.some((t) => t.code.toUpperCase() === tier.code.toUpperCase())) {
      toast.error("Tier code already exists");
      return;
    }
    set((s) => ({ tiers: [tier, ...s.tiers] }));
    toast.success(`Tier ${tier.code} created`);
  },
  patchTier: (id, patch) => {
    const existing = get().getById(id);
    if (!existing) return;
    if (
      patch.code &&
      patch.code.toUpperCase() !== existing.code.toUpperCase() &&
      get().tiers.some((t) => t.id !== id && t.code.toUpperCase() === patch.code!.toUpperCase())
    ) {
      toast.error("Tier code already exists");
      return;
    }
    set((s) => ({
      tiers: s.tiers.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
    toast.success("Tier updated");
  },
  deactivateTier: (id) => {
    set((s) => ({
      tiers: s.tiers.map((t) => (t.id === id ? { ...t, active: false } : t)),
    }));
    toast.success("Tier deactivated");
  },
  countPartners: (tierCode) =>
    useBusinessPartnerStore.getState().partners.filter((p) => p.tierCode === tierCode).length,
}));

export function tierTypeBadgeVariant(
  type: TierType,
): "default" | "secondary" | "success" | "warning" | "muted" | "outline" {
  switch (type) {
    case "wholesale":
      return "default";
    case "retail":
      return "success";
    case "dealer":
      return "warning";
    case "distributor":
      return "secondary";
    default:
      return "muted";
  }
}

export { buildTierDraft };
