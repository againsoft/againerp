"use client";

import { useEffect, useMemo, useState } from "react";
import { Link2, Truck } from "lucide-react";
import { toast } from "sonner";
import type { BusinessPartner } from "@/lib/mock-data/business-partners";
import { demoVariants, products } from "@/lib/mock-data/products";
import {
  hasProductSupplierMapping,
  resolveSupplierStockStatus,
  SUPPLIER_STOCK_STATUS_LABELS,
  type SupplierStockStatus,
  VENDOR_WARRANTY_OPTIONS,
} from "@/lib/mock-data/vendor-product-mapping";
import { useVendorMappingStore } from "@/lib/store/vendor-mapping-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: BusinessPartner;
  supplierId: string;
};

export function MapPartnerCatalogSheet({ open, onOpenChange, partner, supplierId }: Props) {
  const mappings = useVendorMappingStore((s) => s.mappings);
  const mapSupplierToProduct = useVendorMappingStore((s) => s.mapSupplierToProduct);

  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [variantId, setVariantId] = useState(demoVariants[0]?.id ?? "v1");
  const [vendorSku, setVendorSku] = useState("");
  const [vendorPrice, setVendorPrice] = useState("");
  const [supplierStock, setSupplierStock] = useState("");
  const [stockStatus, setStockStatus] = useState<SupplierStockStatus>("unknown");
  const [warranty, setWarranty] = useState<string>(VENDOR_WARRANTY_OPTIONS[3]);
  const [leadTimeDays, setLeadTimeDays] = useState("7");
  const [minOrderQty, setMinOrderQty] = useState("1");
  const [isPreferred, setIsPreferred] = useState(false);
  const [isPublishedOnWeb, setIsPublishedOnWeb] = useState(false);

  const selectedProduct = products.find((p) => p.id === productId);

  const isFirstMapping = !mappings.some(
    (m) => m.isMapped && m.productId === productId,
  );

  useEffect(() => {
    if (!open) return;
    setIsPreferred(isFirstMapping);
    setIsPublishedOnWeb(false);
    if (selectedProduct) {
      setVendorSku(selectedProduct.sku);
      setVendorPrice(String(Math.round(selectedProduct.price * 0.65)));
    }
  }, [open, isFirstMapping, selectedProduct]);

  useEffect(() => {
    if (supplierStock === "") {
      setStockStatus("unknown");
      return;
    }
    setStockStatus(resolveSupplierStockStatus(Number(supplierStock) || 0));
  }, [supplierStock]);

  const alreadyMapped = useMemo(
    () => hasProductSupplierMapping(mappings, supplierId, productId, variantId),
    [mappings, supplierId, productId, variantId],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !selectedProduct) {
      toast.error("Select a catalog product");
      return;
    }
    if (alreadyMapped) {
      toast.error("This product variant is already mapped for this partner");
      return;
    }

    const result = mapSupplierToProduct({
      supplierId,
      productId,
      variantId,
      vendorSku,
      vendorTitle: selectedProduct.name,
      vendorPrice: Number(vendorPrice),
      supplierStock: Number(supplierStock) || 0,
      stockStatus,
      leadTimeDays: Number(leadTimeDays) || 7,
      minOrderQty: Number(minOrderQty) || 1,
      warranty,
      isPreferred,
      isPublishedOnWeb,
    });

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(`Mapped to ${partner.name} catalog — synced to product drawer`);
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
                <h2 className="text-sm font-semibold">Map catalog product</h2>
                <p className="text-[11px] text-muted-foreground">
                  {partner.name} · vendor catalog
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="bp-map-product">Catalog product</Label>
              <Select
                id="bp-map-product"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="h-8 w-full text-xs"
              >
                {products
                  .filter((p) => p.status === "published")
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.sku}
                    </option>
                  ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bp-map-variant">Variant</Label>
              <Select
                id="bp-map-variant"
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

            {alreadyMapped && (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                This variant is already mapped. Pick another product or variant.
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="bp-vendor-sku">Vendor SKU</Label>
                <Input
                  id="bp-vendor-sku"
                  value={vendorSku}
                  onChange={(e) => setVendorSku(e.target.value)}
                  className="h-8 font-mono text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bp-cost">Cost (৳)</Label>
                <Input
                  id="bp-cost"
                  type="number"
                  min={1}
                  value={vendorPrice}
                  onChange={(e) => setVendorPrice(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bp-stock">Supplier stock</Label>
                <Input
                  id="bp-stock"
                  type="number"
                  min={0}
                  value={supplierStock}
                  onChange={(e) => setSupplierStock(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bp-lead">Lead time (days)</Label>
                <Input
                  id="bp-lead"
                  type="number"
                  min={1}
                  value={leadTimeDays}
                  onChange={(e) => setLeadTimeDays(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bp-moq">MOQ</Label>
                <Input
                  id="bp-moq"
                  type="number"
                  min={1}
                  value={minOrderQty}
                  onChange={(e) => setMinOrderQty(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-input p-3">
              <label className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">Preferred supplier</p>
                  <p className="text-[10px] text-muted-foreground">Default for new POs</p>
                </div>
                <Switch checked={isPreferred} onCheckedChange={setIsPreferred} />
              </label>
              <label className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">Publish on website</p>
                  <p className="text-[10px] text-muted-foreground">Optional storefront offer</p>
                </div>
                <Switch checked={isPublishedOnWeb} onCheckedChange={setIsPublishedOnWeb} />
              </label>
            </div>
          </div>

          <div className="flex gap-2 border-t border-input px-6 py-4">
            <Button type="button" variant="outline" className="flex-1 text-xs" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gap-1.5 text-xs" disabled={alreadyMapped}>
              <Truck className="h-3.5 w-3.5" />
              Save mapping
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
