"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useBrandStore } from "@/lib/store/brand-store";
import { Button } from "@/components/ui/button";
import { BrandGrid } from "@/components/brands/brand-grid";
import { BrandFormDialog } from "@/components/brands/brand-form-dialog";
import { BrandViewSheet } from "@/components/brands/brand-view-sheet";
import type { Brand } from "@/lib/mock-data/brands";

function buildUrl(params: URLSearchParams) {
  const q = params.toString();
  return q ? `/catalog/brands?${q}` : "/catalog/brands";
}

function BrandListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const brands = useBrandStore((s) => s.brands);
  const upsertBrand = useBrandStore((s) => s.upsertBrand);
  const patchBrand = useBrandStore((s) => s.patchBrand);

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");

  const editBrand = useMemo(
    () => (editId ? brands.find((b) => b.id === editId) ?? null : null),
    [editId, brands],
  );
  const viewBrand = useMemo(
    () => (viewId ? brands.find((b) => b.id === viewId) ?? null : null),
    [viewId, brands],
  );

  const pushParams = (mutate: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(searchParams.toString());
    mutate(p);
    router.push(buildUrl(p), { scroll: false });
  };

  const openCreate = () =>
    pushParams((p) => {
      p.delete("edit");
      p.delete("view");
      p.set("create", "1");
    });

  const handleEdit = (brand: Brand) =>
    pushParams((p) => {
      p.delete("create");
      p.delete("view");
      p.set("edit", brand.id);
    });

  const handleView = (brand: Brand) =>
    pushParams((p) => {
      p.delete("create");
      p.delete("edit");
      p.set("view", brand.id);
    });

  const closeForm = () =>
    pushParams((p) => {
      p.delete("create");
      p.delete("edit");
    });

  const closeView = () =>
    pushParams((p) => p.delete("view"));

  useEffect(() => {
    if (editId && !editBrand) {
      toast.error("Brand not found");
      closeForm();
    }
  }, [editId, editBrand]);

  useEffect(() => {
    if (viewId && !viewBrand && !editId && !createOpen) {
      toast.error("Brand not found");
      closeView();
    }
  }, [viewId, viewBrand, editId, createOpen]);

  const handleSave = (data: Partial<Brand>) => {
    if (createOpen) {
      upsertBrand(data);
    } else if (editBrand) {
      upsertBrand({ id: editBrand.id, ...data });
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">AgainERP › Ecommerce › Catalog › Brands</p>
          <h1 className="page-title">
            Brands
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({brands.length.toLocaleString()})
            </span>
          </h1>
        </div>
        <div className="hidden gap-2 sm:flex">
          <Button variant="outline" size="sm" onClick={() => toast.info("Import — prototype")}>
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Export started (mock)")}>
            Export
          </Button>
          <Button size="sm" onClick={openCreate}>
            + Add Brand
          </Button>
        </div>
      </div>

      <BrandGrid
        className="min-h-0 flex-1"
        onView={handleView}
        onEdit={handleEdit}
      />

      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg sm:hidden"
        onClick={openCreate}
        aria-label="Add brand"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <BrandViewSheet
        open={!!viewBrand && !createOpen && !editBrand}
        onOpenChange={(open) => { if (!open) closeView(); }}
        brand={viewBrand}
        onEdit={handleEdit}
      />

      <BrandFormDialog
        open={createOpen || !!editBrand}
        onOpenChange={(open) => { if (!open) closeForm(); }}
        mode={createOpen ? "create" : "edit"}
        brand={editBrand}
        onSave={handleSave}
        onLiveChange={(data) => patchBrand(data.id, data)}
      />
    </div>
  );
}

export default function BrandsPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-1 flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <Suspense fallback={<p className="flex flex-1 items-center text-sm text-muted-foreground">Loading brands…</p>}>
        <BrandListContent />
      </Suspense>
    </div>
  );
}
