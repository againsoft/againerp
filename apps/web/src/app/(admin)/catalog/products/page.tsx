"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFormDialog } from "@/components/products/product-form-dialog";
import { ProductViewDialog } from "@/components/products/product-view-dialog";
import { Button } from "@/components/ui/button";
import { getProductById, products, type Product } from "@/lib/mock-data/products";
import { toast } from "sonner";

function buildProductsUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/catalog/products?${query}` : "/catalog/products";
}

function ProductListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");

  const editProduct = useMemo(
    () => (editId ? getProductById(editId) ?? null : null),
    [editId],
  );
  const viewProduct = useMemo(
    () => (viewId ? getProductById(viewId) ?? null : null),
    [viewId],
  );

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(buildProductsUrl(params), { scroll: false });
  };

  const openCreate = () => {
    pushParams((params) => {
      params.delete("edit");
      params.delete("view");
      params.set("create", "1");
    });
  };

  const handleEdit = (product: Product) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("view");
      params.set("edit", product.id);
    });
  };

  const handleView = (product: Product) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
      params.set("view", product.id);
    });
  };

  const handleEditFromView = (product: Product) => {
    handleEdit(product);
  };

  const closeForm = () => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
    });
  };

  const closeView = () => {
    pushParams((params) => {
      params.delete("view");
    });
  };

  useEffect(() => {
    if (editId && !editProduct) {
      toast.error("Product not found");
      closeForm();
    }
  }, [editId, editProduct]);

  useEffect(() => {
    if (viewId && !viewProduct && !editId && !createOpen) {
      toast.error("Product not found");
      closeView();
    }
  }, [viewId, viewProduct, editId, createOpen]);

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
          <Button size="sm" onClick={openCreate}>
            + Add Product
          </Button>
        </div>
      </div>

      <ProductGrid onView={handleView} onEdit={handleEdit} className="min-h-0 flex-1" />

      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg md:hidden"
        onClick={openCreate}
        aria-label="Add product"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <ProductViewDialog
        open={!!viewProduct && !createOpen && !editProduct}
        onOpenChange={(open) => {
          if (!open) closeView();
        }}
        product={viewProduct}
        onEdit={handleEditFromView}
      />

      <ProductFormDialog
        open={createOpen || !!editProduct}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
        mode={createOpen ? "create" : "edit"}
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
