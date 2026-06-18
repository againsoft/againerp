/**
 * Business Partners ↔ vendor catalog bridge.
 * Canonical mapping data lives in `vendor-product-mapping.ts` (→ future `bp_partner_catalog`).
 */

import type { BusinessPartner } from "./business-partners";
import type { EnrichedVendorMapping } from "./vendor-product-mapping";

/** Resolve legacy supplier id for vendor-role partners. */
export function getPartnerSupplierId(partner: Pick<BusinessPartner, "supplierId">): string | null {
  return partner.supplierId ?? null;
}

export function partnerHasVendorCatalog(partner: Pick<BusinessPartner, "roles" | "supplierId">): boolean {
  return partner.roles.includes("vendor") && Boolean(partner.supplierId);
}

export type PartnerCatalogSummary = {
  supplierId: string;
  mappedCount: number;
  unmappedCount: number;
  preferredCount: number;
  publishedCount: number;
};

export function summarizePartnerCatalog(
  items: EnrichedVendorMapping[],
): Omit<PartnerCatalogSummary, "supplierId"> {
  const mapped = items.filter((i) => i.isMapped);
  const unmapped = items.filter((i) => !i.isMapped);
  return {
    mappedCount: mapped.length,
    unmappedCount: unmapped.length,
    preferredCount: mapped.filter((i) => i.isPreferred).length,
    publishedCount: mapped.filter((i) => i.isPublishedOnWeb).length,
  };
}
