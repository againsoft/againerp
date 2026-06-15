"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/mock-data/products";
import { getProductStorefrontPath } from "@/lib/mock-data/products";
import { ProductDetailContent } from "@/components/products/product-detail-content";

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
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex h-[min(92vh,780px)] w-[min(96vw,820px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-input bg-background shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Title className="sr-only">{product.name}</Dialog.Title>
          <Dialog.Description className="sr-only">Product record view</Dialog.Description>

          <div className="flex shrink-0 items-center justify-between border-b border-input px-3 py-2">
            <p className="text-sm font-medium">
              Product details
              {product.name ? ` · ${product.name}` : ""}
            </p>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-md p-1 hover:bg-accent"
                aria-label="Close product view"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden p-3">
            <ProductDetailContent
              product={product}
              inDialog
              onEdit={onEdit}
              onOpenFullPage={(p) => {
                onOpenChange(false);
                router.push(getProductStorefrontPath(p));
              }}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
