"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFormDialog } from "@/components/products/product-form-dialog";
import { ProductViewDialog } from "@/components/products/product-view-dialog";
import { Button } from "@/components/ui/button";
import { products, type Product } from "@/lib/mock-data/products";
import { toast } from "sonner";

function ProductListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createFromUrl = searchParams.get("create") === "1";

  useEffect(() => {
    if (createFromUrl) router.replace("/catalog/products/new");
  }, [createFromUrl, router]);
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setEditOpen(true);
  };

  const handleView = (product: Product) => {
    setViewProduct(product);
    setViewOpen(true);
  };

  const handleEditFromView = (product: Product) => {
    setViewOpen(false);
    setViewProduct(null);
    handleEdit(product);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">AgainERP › Ecommerce › Catalog › Products</p>
          <h1 className="page-title">
            Products
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({products.length.toLocaleString()})
            </span>
          </h1>
        </div>
        <div className="hidden flex-wrap gap-2 sm:flex">
          <Button variant="outline" size="sm" onClick={() => toast.info("Import — prototype")}>
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Export started (mock CSV)")}
          >
            Export
          </Button>
          <Button size="sm" asChild>
            <Link href="/catalog/products/new">+ Add Product</Link>
          </Button>
        </div>
      </div>

      <ProductGrid onView={handleView} onEdit={handleEdit} className="min-h-0 flex-1" />

      {/* Mobile FAB */}
      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg md:hidden"
        onClick={() => router.push("/catalog/products/new")}
        aria-label="Add product"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <ProductViewDialog
        open={viewOpen}
        onOpenChange={(open) => {
          setViewOpen(open);
          if (!open) setViewProduct(null);
        }}
        product={viewProduct}
        onEdit={handleEditFromView}
      />

      <ProductFormDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditProduct(null);
        }}
        mode="edit"
        product={editProduct}
      />
    </div>
  );
}

export default function ProductListPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-1 flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <Suspense
        fallback={
          <p className="flex flex-1 items-center text-sm text-muted-foreground">
            Loading products…
          </p>
        }
      >
        <ProductListContent />
      </Suspense>
    </div>
  );
}
