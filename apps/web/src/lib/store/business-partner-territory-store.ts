import { create } from "zustand";
import { toast } from "sonner";
import {
  buildTerritoryDraft,
  partnerTerritoriesSeed,
  type PartnerTerritoryAssignment,
} from "@/lib/mock-data/business-partner-territories";
import { businessPartnersSeed } from "@/lib/mock-data/business-partners";

type TerritoryStore = {
  territories: PartnerTerritoryAssignment[];
  getById: (id: string) => PartnerTerritoryAssignment | undefined;
  addTerritory: (row: PartnerTerritoryAssignment) => void;
  removeTerritory: (id: string) => void;
};

export const useBusinessPartnerTerritoryStore = create<TerritoryStore>()((set, get) => ({
  territories: partnerTerritoriesSeed.map((t) => ({ ...t })),
  getById: (id) => get().territories.find((t) => t.id === id),
  addTerritory: (row) => {
    if (!row.partnerId || !row.region.trim()) {
      toast.error("Partner and region are required");
      return;
    }
    set((s) => ({ territories: [row, ...s.territories] }));
    toast.success("Territory assignment added");
  },
  removeTerritory: (id) => {
    set((s) => ({ territories: s.territories.filter((t) => t.id !== id) }));
    toast.success("Territory removed");
  },
}));

export function buildTerritoryFromPartnerInput(input: {
  partnerId: string;
  role: PartnerTerritoryAssignment["role"];
  region: string;
  district?: string;
  countryCode?: string;
  country?: string;
  isExclusive?: boolean;
  notes?: string;
}): PartnerTerritoryAssignment | null {
  const partner = businessPartnersSeed.find((p) => p.id === input.partnerId);
  if (!partner) return null;
  return buildTerritoryDraft({
    partnerId: partner.id,
    partnerCode: partner.partnerCode,
    partnerName: partner.name,
    role: input.role,
    countryCode: input.countryCode ?? "BD",
    country: input.country ?? partner.country,
    region: input.region.trim(),
    district: input.district?.trim() || undefined,
    isExclusive: input.isExclusive ?? false,
    notes: input.notes,
  });
}

export { buildTerritoryDraft };
