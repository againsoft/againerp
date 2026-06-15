"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { Product } from "@/lib/mock-data/products";
import { ProductForm } from "@/components/products/product-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  product?: Product | null;
  productName?: string;
};

export function ProductFormDialog({
  open,
  onOpenChange,
  mode = "create",
  product,
  productName,
}: Props) {
  const initialProduct =
    product ?? (productName ? ({ name: productName } as Product) : undefined);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex h-[min(92vh,780px)] w-[min(96vw,820px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-input bg-background shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Title className="sr-only">
            {mode === "create" ? "Add Product" : "Edit Product"}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Product editor form
          </Dialog.Description>

          <div className="flex shrink-0 items-center justify-between border-b border-input px-3 py-2">
            <p className="text-sm font-medium">
              {mode === "create" ? "Add Product" : "Edit Product"}
              {initialProduct?.name ? ` · ${initialProduct.name}` : ""}
            </p>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-md p-1 hover:bg-accent"
                aria-label="Close editor"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden p-3">
            <ProductForm
              mode={mode}
              initialProduct={initialProduct}
              compact
              inDialog
              onClose={() => onOpenChange(false)}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
