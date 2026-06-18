"use client";

import { useEffect, useState } from "react";
import { Link2 } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/mock-data/products";
import { demoVariants } from "@/lib/mock-data/products";
import type { EnrichedVendorMapping } from "@/lib/mock-data/vendor-product-mapping";
import { useVendorMappingStore } from "@/lib/store/vendor-mapping-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedItem: EnrichedVendorMapping | null;
  productOptions: Product[];
};

export function LinkCatalogProductSheet({ open, onOpenChange, feedItem, productOptions }: Props) {
  const linkToProduct = useVendorMappingStore((s) => s.linkToProduct);
  const [productId, setProductId] = useState(productOptions[0]?.id ?? "");
  const [variantId, setVariantId] = useState(demoVariants[0]?.id ?? "v1");

  useEffect(() => {
    if (!open) return;
    setProductId(productOptions[0]?.id ?? "");
    setVariantId(demoVariants[0]?.id ?? "v1");
  }, [open, productOptions]);

  if (!feedItem) return null;

  const selected = productOptions.find((p) => p.id === productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      toast.error("Select a catalog product");
      return;
    }
    linkToProduct(feedItem.id, productId, variantId);
    toast.success(`Linked ${feedItem.vendorSku} → ${selected?.name ?? "product"}`);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto p-0">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <div className="border-b border-input px-6 py-4">
            <div className="flex items-center gap-2 pr-8">
              <Link2 className="h-4 w-4 text-primary" />
              <div>
                <h2 className="text-sm font-semibold">Link feed SKU</h2>
                <p className="font-mono text-[11px] text-muted-foreground">{feedItem.vendorSku}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4 text-xs">
            <div className="rounded-lg border border-input bg-muted/30 p-3">
              <p className="font-medium">{feedItem.vendorTitle}</p>
              <p className="mt-0.5 text-muted-foreground">
                Cost ৳{feedItem.vendorPrice.toLocaleString("en-BD")} · Stock {feedItem.supplierStock}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="link-product">Catalog product</Label>
              <Select
                id="link-product"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="h-8 w-full text-xs"
              >
                {productOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {p.sku}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="link-variant">Variant</Label>
              <Select
                id="link-variant"
                value={variantId}
                onChange={(e) => setVariantId(e.target.value)}
                className="h-8 w-full text-xs"
              >
                {demoVariants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label} · {v.sku}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex gap-2 border-t border-input px-6 py-4">
            <Button type="button" variant="outline" className="flex-1 text-xs" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 text-xs">
              Link product
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
