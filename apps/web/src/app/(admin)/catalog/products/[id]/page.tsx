"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { getProductById } from "@/lib/mock-data/products";
import { ProductFormDialog } from "@/components/products/product-form-dialog";
import { ProductDetailContent } from "@/components/products/product-detail-content";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const product = getProductById(id);
  const [editOpen, setEditOpen] = useState(false);

  if (!product) {
    return <p className="text-muted-foreground">Product not found (mock).</p>;
  }

  return (
    <>
      <ProductDetailContent
        product={product}
        onBack={() => router.push("/catalog/products")}
        onEdit={() => setEditOpen(true)}
      />
      <ProductFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        product={product}
      />
    </>
  );
}
