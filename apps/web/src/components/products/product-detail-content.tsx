"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  demoVariants,
  getVariantMedia,
  type Product,
} from "@/lib/mock-data/products";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductMediaGallery } from "@/components/products/product-media-gallery";
import { ProductSpecs } from "@/components/storefront/product/product-specs";
import { getProductSpecs } from "@/lib/mock-data/storefront-product";

type Props = {
  product: Product;
  compact?: boolean;
  inDialog?: boolean;
  onBack?: () => void;
  onEdit?: (product: Product) => void;
  onOpenFullPage?: (product: Product) => void;
};

export function ProductDetailContent({
  product,
  compact,
  inDialog,
  onBack,
  onEdit,
  onOpenFullPage,
}: Props) {
  const [variantId, setVariantId] = useState(demoVariants[0].id);

  useEffect(() => {
    setVariantId(demoVariants[0].id);
  }, [product.id]);

  const variant = useMemo(
    () => demoVariants.find((v) => v.id === variantId) ?? demoVariants[0],
    [variantId],
  );

  const variantMedia = useMemo(
    () => getVariantMedia(product.id, variant.id),
    [product.id, variant.id],
  );

  const specs = useMemo(() => getProductSpecs(product), [product]);

  const summaryStrip = (
    <div
      className={cn(
        "flex flex-wrap gap-x-2 gap-y-1 rounded-md border border-input bg-muted/40 px-2.5 py-1.5 text-xs",
      )}
    >
      <span>
        <span className="text-muted-foreground">Price </span>
        <span className="font-semibold">{formatCurrency(variant.price)}</span>
      </span>
      <span className="text-muted-foreground">·</span>
      <span>
        <span className="text-muted-foreground">Stock </span>
        <span className={variant.stock === 0 ? "font-semibold text-red-500" : "font-semibold"}>
          {variant.stock}
        </span>
      </span>
      <span className="text-muted-foreground">·</span>
      <span>
        <span className="text-muted-foreground">Category </span>
        <span className="font-medium">{product.category}</span>
      </span>
      <span className="text-muted-foreground">·</span>
      <span>
        <span className="text-muted-foreground">Brand </span>
        <span className="font-medium">{product.brand}</span>
      </span>
    </div>
  );

  const variantPanel = (
    <div className="rounded-lg border p-4">
      <p className="text-xs text-muted-foreground">Variant</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {demoVariants.map((v) => (
          <Button
            key={v.id}
            size="sm"
            variant={v.id === variantId ? "default" : "outline"}
            className={inDialog || compact ? "h-7 px-2 text-xs" : undefined}
            onClick={() => setVariantId(v.id)}
          >
            {v.color}
            {v.storage ? ` / ${v.storage}` : ""}
          </Button>
        ))}
      </div>
      <div className={cn("mt-3 grid grid-cols-2 gap-3", inDialog || compact ? "text-xs" : "text-sm")}>
        <div>
          <p className="text-muted-foreground">Price</p>
          <p className={inDialog || compact ? "text-base font-semibold" : "text-xl font-semibold"}>
            {formatCurrency(variant.price)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Stock</p>
          <p
            className={cn(
              inDialog || compact ? "text-base font-semibold" : "text-xl font-semibold",
              variant.stock === 0 && "text-red-500",
            )}
          >
            {variant.stock}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">SKU</p>
          <p className="font-mono text-[11px]">{variant.sku}</p>
        </div>
        <div>
          <p className="text-muted-foreground">RAM</p>
          <p>{variant.ram ?? "—"}</p>
        </div>
      </div>
    </div>
  );

  const fullBody = (
    <div className="space-y-4">
      {summaryStrip}

      <div className="grid gap-4 lg:grid-cols-2">
        <ProductMediaGallery
          media={variantMedia}
          productName={product.name}
          compact={inDialog || compact}
        />

        <div className="space-y-4">
          {variantPanel}
          <div className="rounded-lg border p-4 text-sm">
            <h3 className="font-medium">Description</h3>
            <p className="mt-1.5 text-muted-foreground">{product.description}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-medium">Specifications</h3>
        <div className="mt-2">
          <ProductSpecs specs={specs} compact={inDialog || compact} />
        </div>
      </div>
    </div>
  );

  if (inDialog) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0 border-b border-input pb-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="capitalize">{product.status}</Badge>
              <p className="font-mono text-[11px] text-muted-foreground">{product.sku}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {onOpenFullPage && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 px-2 text-xs"
                  onClick={() => onOpenFullPage(product)}
                >
                  <ExternalLink className="h-3 w-3" />
                  Open page
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => onEdit(product)}
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1 pt-3">{fullBody}</div>
      </div>
    );
  }

  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      <div className="flex flex-wrap items-start gap-2">
        {!compact && onBack && (
          <Button variant="ghost" size="icon" className="shrink-0" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="min-w-0 flex-1">
          {!compact && <p className="page-subtitle">Catalog › Products</p>}
          <h1 className={compact ? "text-sm font-semibold leading-snug" : "page-title"}>
            {product.name}
          </h1>
          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{product.sku}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          {compact && onOpenFullPage && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-[11px]"
              onClick={() => onOpenFullPage(product)}
            >
              <ExternalLink className="h-3 w-3" />
              Open
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              className={compact ? "h-7 px-2 text-xs" : undefined}
              onClick={() => onEdit(product)}
            >
              Edit
            </Button>
          )}
          <Badge className={cn("capitalize", compact && "text-[10px]")}>{product.status}</Badge>
        </div>
      </div>

      {fullBody}
    </div>
  );
}
