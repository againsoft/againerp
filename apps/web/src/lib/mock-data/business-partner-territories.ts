import type { PartnerRole } from "./business-partners";

export type PartnerTerritoryAssignment = {
  id: string;
  partnerId: string;
  partnerCode: string;
  partnerName: string;
  role: PartnerRole;
  countryCode: string;
  country: string;
  region: string;
  district?: string;
  isExclusive: boolean;
  notes?: string;
};

export const partnerTerritoriesSeed: PartnerTerritoryAssignment[] = [
  {
    id: "terr_001",
    partnerId: "bp_001",
    partnerCode: "BP-TECH",
    partnerName: "TechPro Distribution Ltd",
    role: "wholesaler",
    countryCode: "BD",
    country: "Bangladesh",
    region: "Dhaka",
    district: "Gulshan",
    isExclusive: false,
  },
  {
    id: "terr_002",
    partnerId: "bp_001",
    partnerCode: "BP-TECH",
    partnerName: "TechPro Distribution Ltd",
    role: "vendor",
    countryCode: "BD",
    country: "Bangladesh",
    region: "National",
    isExclusive: false,
  },
  {
    id: "terr_003",
    partnerId: "bp_006",
    partnerCode: "BP-NAT-WHL",
    partnerName: "National Wholesale Hub",
    role: "distributor",
    countryCode: "BD",
    country: "Bangladesh",
    region: "National",
    isExclusive: true,
    notes: "Exclusive national distributor",
  },
  {
    id: "terr_004",
    partnerId: "bp_006",
    partnerCode: "BP-NAT-WHL",
    partnerName: "National Wholesale Hub",
    role: "wholesaler",
    countryCode: "BD",
    country: "Bangladesh",
    region: "Chittagong",
    isExclusive: false,
  },
  {
    id: "terr_005",
    partnerId: "bp_007",
    partnerCode: "BP-URBAN",
    partnerName: "UrbanWear Retail",
    role: "retailer",
    countryCode: "BD",
    country: "Bangladesh",
    region: "Dhaka",
    district: "Banani",
    isExclusive: false,
  },
  {
    id: "terr_006",
    partnerId: "bp_010",
    partnerCode: "BP-FRN-01",
    partnerName: "StyleMart Franchise — Gulshan",
    role: "franchisee",
    countryCode: "BD",
    country: "Bangladesh",
    region: "Dhaka",
    district: "Gulshan",
    isExclusive: true,
  },
  {
    id: "terr_007",
    partnerId: "bp_002",
    partnerCode: "BP-002",
    partnerName: "Shenzhen Electronics Co.",
    role: "vendor",
    countryCode: "CN",
    country: "China",
    region: "Guangdong",
    district: "Shenzhen",
    isExclusive: false,
  },
  {
    id: "terr_008",
    partnerId: "bp_003",
    partnerCode: "BP-003",
    partnerName: "GlowUp Imports",
    role: "vendor",
    countryCode: "BD",
    country: "Bangladesh",
    region: "Dhaka",
    isExclusive: false,
  },
];

export function getTerritoryById(id: string): PartnerTerritoryAssignment | undefined {
  return partnerTerritoriesSeed.find((t) => t.id === id);
}

export function buildTerritoryDraft(
  partial?: Partial<PartnerTerritoryAssignment>,
): PartnerTerritoryAssignment {
  return {
    id: `terr_${Date.now()}`,
    partnerId: "",
    partnerCode: "",
    partnerName: "",
    role: "wholesaler",
    countryCode: "BD",
    country: "Bangladesh",
    region: "",
    isExclusive: false,
    ...partial,
  };
}
