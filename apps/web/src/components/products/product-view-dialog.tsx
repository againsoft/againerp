"use client";

import { useRouter } from "next/navigation";
import type { Product } from "@/lib/mock-data/products";
import { getProductStorefrontPath } from "@/lib/mock-data/products";
import { ProductDetailContent } from "@/components/products/product-detail-content";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onEdit?: (product: Product) => void;
};

export function ProductViewDialog({ open, onOpenChange, product, onEdit }: Props) {
  const router = useRouter();

  if (!product) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
        aria-describedby={undefined}
      >
        <p className="sr-only">Product details · {product.name}</p>
        <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-3">
          <ProductDetailContent
            product={product}
            inDialog
            onEdit={onEdit}
            onClose={() => onOpenChange(false)}
            onOpenFullPage={(p) => {
              onOpenChange(false);
              router.push(getProductStorefrontPath(p));
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
