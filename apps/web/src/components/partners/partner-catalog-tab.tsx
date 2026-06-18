"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Globe, Link2, Package, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  formatBdt,
  SUPPLIER_STOCK_STATUS_LABELS,
  stockStatusVariant,
} from "@/lib/mock-data/vendor-product-mapping";
import type { BusinessPartner } from "@/lib/mock-data/business-partners";
import { products } from "@/lib/mock-data/products";
import {
  syncPartnerCatalogFeed,
  usePartnerCatalog,
} from "@/lib/store/business-partner-catalog-store";
import { useVendorMappingStore } from "@/lib/store/vendor-mapping-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPartnerCatalogSheet } from "@/components/partners/map-partner-catalog-sheet";
import { LinkCatalogProductSheet } from "@/components/partners/link-catalog-product-sheet";

type Props = {
  partner: BusinessPartner;
};

export function PartnerCatalogTab({ partner }: Props) {
  const { supplierId, mapped, unmapped, summary } = usePartnerCatalog(partner);
  const patchMapping = useVendorMappingStore((s) => s.patchMapping);
  const togglePublished = useVendorMappingStore((s) => s.togglePublished);
  const setPreferred = useVendorMappingStore((s) => s.setPreferred);

  const [mapOpen, setMapOpen] = useState(false);
  const [linkItemId, setLinkItemId] = useState<string | null>(null);

  const linkItem = useMemo(
    () => unmapped.find((i) => i.id === linkItemId) ?? null,
    [unmapped, linkItemId],
  );

  if (!supplierId) {
    return (
      <p className="text-xs text-muted-foreground">
        Vendor catalog requires a linked supplier record. Legacy suppliers are migrated automatically
        for vendor partners.
      </p>
    );
  }

  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground">
          {summary.mappedCount} mapped · {summary.unmappedCount} feed SKUs · {summary.publishedCount}{" "}
          on website
        </p>
        <div className="flex flex-wrap gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-[10px]"
            onClick={() => syncPartnerCatalogFeed(partner)}
          >
            <RefreshCw className="mr-1 h-3 w-3" /> Sync feed
          </Button>
          <Button size="sm" className="h-7 text-[10px]" onClick={() => setMapOpen(true)}>
            <Plus className="mr-1 h-3 w-3" /> Map product
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-input p-3">
        <div className="mb-2 flex items-center gap-2">
          <Link2 className="h-3.5 w-3.5 text-primary" />
          <h3 className="text-sm font-semibold">Mapped to our catalog</h3>
        </div>
        <p className="mb-3 text-[11px] text-muted-foreground">
          Vendor SKUs linked to Product Master — cost and stock sync to the product drawer.
        </p>
        {mapped.length === 0 ? (
          <p className="text-muted-foreground">No mapped products yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-input">
            <table className="w-full min-w-[640px]">
              <thead className="border-b bg-muted/40 text-left text-[10px] text-muted-foreground">
                <tr>
                  <th className="px-2 py-1.5">Product</th>
                  <th className="px-2 py-1.5">Vendor SKU</th>
                  <th className="px-2 py-1.5">Cost</th>
                  <th className="px-2 py-1.5">Stock</th>
                  <th className="px-2 py-1.5">Web</th>
                  <th className="px-2 py-1.5" />
                </tr>
              </thead>
              <tbody>
                {mapped.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-2 py-1.5">
                      {item.productId ? (
                        <Link
                          href={`/catalog/products?view=${item.productId}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {item.productName ?? item.vendorTitle}
                        </Link>
                      ) : (
                        <span className="font-medium">{item.vendorTitle}</span>
                      )}
                      {item.productSku && (
                        <p className="font-mono text-[10px] text-muted-foreground">{item.productSku}</p>
                      )}
                    </td>
                    <td className="px-2 py-1.5 font-mono text-muted-foreground">{item.vendorSku}</td>
                    <td className="px-2 py-1.5 font-medium">{formatBdt(item.vendorPrice)}</td>
                    <td className="px-2 py-1.5">
                      <span className="font-medium">{item.supplierStock}</span>{" "}
                      <Badge variant={stockStatusVariant(item.stockStatus)} className="text-[9px]">
                        {SUPPLIER_STOCK_STATUS_LABELS[item.stockStatus]}
                      </Badge>
                    </td>
                    <td className="px-2 py-1.5">
                      {item.isPublishedOnWeb ? (
                        <Badge variant="success" className="gap-0.5 text-[9px]">
                          <Globe className="h-2.5 w-2.5" /> Live
                        </Badge>
                      ) : (
                        <Badge variant="muted" className="text-[9px]">
                          Internal
                        </Badge>
                      )}
                    </td>
                    <td className="px-2 py-1.5">
                      <div className="flex gap-0.5">
                        {!item.isPreferred && item.productId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-1 text-[9px]"
                            onClick={() => {
                              setPreferred(item.productId!, item.id);
                              toast.success("Set as preferred supplier for this product");
                            }}
                          >
                            Prefer
                          </Button>
                        )}
                        {item.isPreferred && (
                          <Badge variant="warning" className="text-[9px]">
                            Preferred
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-1 text-[9px]"
                          onClick={() => togglePublished(item.id)}
                        >
                          Web
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-1 text-[9px]"
                          onClick={() => {
                            patchMapping(item.id, { vendorPrice: item.vendorPrice + 50 });
                            toast.success("Cost updated — synced to product drawer");
                          }}
                        >
                          +৳50
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-input p-3">
        <div className="mb-2 flex items-center gap-2">
          <Package className="h-3.5 w-3.5 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Vendor feed (unmapped)</h3>
        </div>
        <p className="mb-3 text-[11px] text-muted-foreground">
          SKUs from supplier stock feed — map to catalog products when ready.
        </p>
        {unmapped.length === 0 ? (
          <p className="text-muted-foreground">All feed items are mapped.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-input">
            <table className="w-full min-w-[520px]">
              <thead className="border-b bg-muted/40 text-left text-[10px] text-muted-foreground">
                <tr>
                  <th className="px-2 py-1.5">Vendor title</th>
                  <th className="px-2 py-1.5">SKU</th>
                  <th className="px-2 py-1.5">Cost</th>
                  <th className="px-2 py-1.5">Stock</th>
                  <th className="px-2 py-1.5" />
                </tr>
              </thead>
              <tbody>
                {unmapped.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-2 py-1.5 font-medium">{item.vendorTitle}</td>
                    <td className="px-2 py-1.5 font-mono text-muted-foreground">{item.vendorSku}</td>
                    <td className="px-2 py-1.5">{formatBdt(item.vendorPrice)}</td>
                    <td className="px-2 py-1.5">{item.supplierStock}</td>
                    <td className="px-2 py-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 text-[9px]"
                        onClick={() => setLinkItemId(item.id)}
                      >
                        Link product
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-[10px] text-muted-foreground">
        Legacy supplier workspace:{" "}
        <Link href={`/suppliers/${supplierId}`} className="text-primary hover:underline">
          Open supplier {supplierId}
        </Link>
      </p>

      <MapPartnerCatalogSheet
        open={mapOpen}
        onOpenChange={setMapOpen}
        partner={partner}
        supplierId={supplierId}
      />

      <LinkCatalogProductSheet
        open={!!linkItem}
        onOpenChange={(open) => {
          if (!open) setLinkItemId(null);
        }}
        feedItem={linkItem}
        productOptions={products.filter((p) => p.status === "published")}
      />
    </div>
  );
}
