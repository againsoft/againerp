export type TierType = "wholesale" | "retail" | "dealer" | "distributor";

export type PartnerTierDefinition = {
  id: string;
  code: string;
  name: string;
  tierType: TierType;
  discountPercent: number;
  priceListId: string;
  priceListName: string;
  description?: string;
  active: boolean;
  createdAt: string;
};

export const TIER_TYPE_LABELS: Record<TierType, string> = {
  wholesale: "Wholesale",
  retail: "Retail",
  dealer: "Dealer",
  distributor: "Distributor",
};

export const PRICE_LIST_OPTIONS = [
  { id: "pl_wholesale_2026", name: "PL-WHOLESALE-2026" },
  { id: "pl_retail_std", name: "PL-RETAIL-STD" },
  { id: "pl_dealer_gold", name: "PL-DEALER-GOLD" },
  { id: "pl_dist_national", name: "PL-DIST-NATIONAL" },
  { id: "pl_promo_q2", name: "PL-PROMO-Q2" },
];

export const partnerTiersSeed: PartnerTierDefinition[] = [
  {
    id: "tier_001",
    code: "WHOLESALE-A",
    name: "Wholesale Tier A",
    tierType: "wholesale",
    discountPercent: 12,
    priceListId: "pl_wholesale_2026",
    priceListName: "PL-WHOLESALE-2026",
    description: "Standard wholesale discount for volume buyers.",
    active: true,
    createdAt: "2025-11-01",
  },
  {
    id: "tier_002",
    code: "WHOLESALE-B",
    name: "Wholesale Tier B",
    tierType: "wholesale",
    discountPercent: 18,
    priceListId: "pl_wholesale_2026",
    priceListName: "PL-WHOLESALE-2026",
    description: "Premium wholesale — higher MOQ required.",
    active: true,
    createdAt: "2025-11-01",
  },
  {
    id: "tier_003",
    code: "RETAIL-STD",
    name: "Retail Standard",
    tierType: "retail",
    discountPercent: 0,
    priceListId: "pl_retail_std",
    priceListName: "PL-RETAIL-STD",
    description: "List price for retail partners.",
    active: true,
    createdAt: "2025-11-15",
  },
  {
    id: "tier_004",
    code: "DEALER-GOLD",
    name: "Dealer Gold",
    tierType: "dealer",
    discountPercent: 22,
    priceListId: "pl_dealer_gold",
    priceListName: "PL-DEALER-GOLD",
    description: "Authorized dealer program — gold tier.",
    active: true,
    createdAt: "2026-01-10",
  },
  {
    id: "tier_005",
    code: "DIST-NATIONAL",
    name: "National Distributor",
    tierType: "distributor",
    discountPercent: 25,
    priceListId: "pl_dist_national",
    priceListName: "PL-DIST-NATIONAL",
    description: "National distributor pricing — exclusive territories.",
    active: true,
    createdAt: "2026-01-10",
  },
  {
    id: "tier_006",
    code: "RETAIL-PROMO",
    name: "Retail Promo Q2",
    tierType: "retail",
    discountPercent: 5,
    priceListId: "pl_promo_q2",
    priceListName: "PL-PROMO-Q2",
    description: "Limited-time promotional retail tier.",
    active: false,
    createdAt: "2026-03-01",
  },
];

let tierSeq = partnerTiersSeed.length;

export function getTierById(id: string): PartnerTierDefinition | undefined {
  return partnerTiersSeed.find((t) => t.id === id);
}

export function getTierByCode(code: string): PartnerTierDefinition | undefined {
  return partnerTiersSeed.find((t) => t.code === code);
}

export function buildTierDraft(partial?: Partial<PartnerTierDefinition>): PartnerTierDefinition {
  tierSeq += 1;
  const priceList = PRICE_LIST_OPTIONS[0];
  return {
    id: `tier_${Date.now()}`,
    code: `TIER-${String(tierSeq).padStart(3, "0")}`,
    name: "",
    tierType: "wholesale",
    discountPercent: 0,
    priceListId: priceList.id,
    priceListName: priceList.name,
    active: true,
    createdAt: new Date().toISOString().slice(0, 10),
    ...partial,
  };
}

/** Tiers compatible with partner roles (channel pricing). */
export function tierTypesForPartnerRoles(roles: string[]): TierType[] {
  const types = new Set<TierType>();
  if (roles.includes("wholesaler")) types.add("wholesale");
  if (roles.includes("retailer") || roles.includes("franchisee")) types.add("retail");
  if (roles.includes("distributor")) types.add("distributor");
  if (roles.includes("channel_partner") || roles.includes("dropship")) {
    types.add("dealer");
    types.add("distributor");
  }
  return [...types];
}
