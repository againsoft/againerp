"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCategoryStore } from "@/lib/store/category-store";
import { getCategoryAncestorNames } from "@/lib/category-utils";
import { Button } from "@/components/ui/button";
import { CategoryGrid } from "@/components/categories/category-grid";
import { CategoryFormDialog } from "@/components/categories/category-form-dialog";
import { CategoryViewSheet } from "@/components/categories/category-view-sheet";
import type { Category } from "@/lib/mock-data/categories";

function buildUrl(params: URLSearchParams) {
  const q = params.toString();
  return q ? `/catalog/categories?${q}` : "/catalog/categories";
}

function CategoryListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories = useCategoryStore((s) => s.categories);
  const upsertCategory = useCategoryStore((s) => s.upsertCategory);
  const patchCategory = useCategoryStore((s) => s.patchCategory);

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");

  const editCategory = useMemo(
    () => (editId ? categories.find((c) => c.id === editId) ?? null : null),
    [editId, categories],
  );
  const viewCategory = useMemo(
    () => (viewId ? categories.find((c) => c.id === viewId) ?? null : null),
    [viewId, categories],
  );

  const parentOptions = useMemo(
    () =>
      categories.map((c) => ({
        id: c.id,
        label: [...getCategoryAncestorNames(c, categories), c.name].join(" › "),
      })),
    [categories],
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

  const handleEdit = (cat: Category) =>
    pushParams((p) => {
      p.delete("create");
      p.delete("view");
      p.set("edit", cat.id);
    });

  const handleView = (cat: Category) =>
    pushParams((p) => {
      p.delete("create");
      p.delete("edit");
      p.set("view", cat.id);
    });

  const closeForm = () =>
    pushParams((p) => {
      p.delete("create");
      p.delete("edit");
    });

  const closeView = () =>
    pushParams((p) => p.delete("view"));

  useEffect(() => {
    if (editId && !editCategory) {
      toast.error("Category not found");
      closeForm();
    }
  }, [editId, editCategory]);

  useEffect(() => {
    if (viewId && !viewCategory && !editId && !createOpen) {
      toast.error("Category not found");
      closeView();
    }
  }, [viewId, viewCategory, editId, createOpen]);

  const handleSave = (data: Partial<Category>) => {
    if (createOpen) {
      upsertCategory(data);
    } else if (editCategory) {
      upsertCategory({ id: editCategory.id, ...data });
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">AgainERP › Ecommerce › Catalog › Categories</p>
          <h1 className="page-title">
            Categories
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({categories.length.toLocaleString()})
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
            + Add Category
          </Button>
        </div>
      </div>

      <CategoryGrid
        className="min-h-0 flex-1"
        onView={handleView}
        onEdit={handleEdit}
      />

      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg sm:hidden"
        onClick={openCreate}
        aria-label="Add category"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <CategoryViewSheet
        open={!!viewCategory && !createOpen && !editCategory}
        onOpenChange={(open) => { if (!open) closeView(); }}
        category={viewCategory}
        onEdit={handleEdit}
      />

      <CategoryFormDialog
        open={createOpen || !!editCategory}
        onOpenChange={(open) => { if (!open) closeForm(); }}
        mode={createOpen ? "create" : "edit"}
        category={editCategory}
        parentOptions={parentOptions.filter((p) => p.id !== editCategory?.id)}
        defaultParentId={null}
        onSave={handleSave}
        onLiveChange={(data) => patchCategory(data.id, data)}
      />
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-1 flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <Suspense
        fallback={
          <p className="flex flex-1 items-center text-sm text-muted-foreground">
            Loading categories…
          </p>
        }
      >
        <CategoryListContent />
      </Suspense>
    </div>
  );
}
