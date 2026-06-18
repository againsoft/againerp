import { toast } from "sonner";
import {
  getPartnerSupplierId,
  partnerHasVendorCatalog,
  summarizePartnerCatalog,
} from "@/lib/mock-data/business-partner-catalog";
import type { BusinessPartner } from "@/lib/mock-data/business-partners";
import type { EnrichedVendorMapping } from "@/lib/mock-data/vendor-product-mapping";
import {
  enrichMapping,
  getMappingsForSupplier,
} from "@/lib/mock-data/vendor-product-mapping";
import { useVendorMappingStore } from "@/lib/store/vendor-mapping-store";
import { useMemo } from "react";

/** Catalog rows for a business partner (vendor role + linked supplier). */
export function usePartnerCatalog(partner: BusinessPartner | null | undefined) {
  const mappings = useVendorMappingStore((s) => s.mappings);

  return useMemo(() => {
    if (!partner || !partnerHasVendorCatalog(partner)) {
      return {
        supplierId: null as string | null,
        items: [] as EnrichedVendorMapping[],
        mapped: [] as EnrichedVendorMapping[],
        unmapped: [] as EnrichedVendorMapping[],
        summary: { mappedCount: 0, unmappedCount: 0, preferredCount: 0, publishedCount: 0 },
      };
    }

    const supplierId = getPartnerSupplierId(partner)!;
    const items = getMappingsForSupplier(mappings, supplierId).map(enrichMapping);
    const mapped = items.filter((i) => i.isMapped);
    const unmapped = items.filter((i) => !i.isMapped);

    return {
      supplierId,
      items,
      mapped,
      unmapped,
      summary: summarizePartnerCatalog(items),
    };
  }, [partner, mappings]);
}

export function syncPartnerCatalogFeed(partner: BusinessPartner) {
  const supplierId = getPartnerSupplierId(partner);
  if (!supplierId) {
    toast.error("Partner has no linked supplier record");
    return;
  }
  toast.success("Catalog stock feed sync queued (prototype)");
}

export function navigateCreatePoFromPartner(partner: BusinessPartner): string | null {
  const supplierId = getPartnerSupplierId(partner);
  if (!supplierId) {
    toast.error("No supplier link — assign vendor role with supplier record");
    return null;
  }
  return `/suppliers/purchase-orders/create?partnerId=${partner.id}&supplierId=${supplierId}`;
}

export function stubCreateSoFromPartner(partner: BusinessPartner) {
  toast.info(`Sales order stub — pre-filled for ${partner.name}`, {
    description: "Sales module prototype opens when built. Partner tier pricing will apply.",
    action: {
      label: "Open orders",
      onClick: () => {
        window.location.href = "/orders";
      },
    },
  });
}
