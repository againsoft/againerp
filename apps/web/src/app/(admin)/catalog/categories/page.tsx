"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCategoryStore } from "@/lib/store/category-store";
import { Button } from "@/components/ui/button";
import { CategoryGrid } from "@/components/categories/category-grid";

export default function CategoriesPage() {
  const [addTrigger, setAddTrigger] = useState(0);
  const count = useCategoryStore((s) => s.categories.length);

  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">AgainERP › Ecommerce › Catalog › Categories</p>
          <h1 className="page-title">
            Categories
            <span className="ml-2 text-base font-normal text-muted-foreground">({count})</span>
          </h1>
        </div>
        <div className="hidden gap-2 sm:flex">
          <Button variant="outline" size="sm" onClick={() => toast.info("Import — prototype")}>
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Export started (mock)")}>
            Export
          </Button>
          <Button size="sm" onClick={() => setAddTrigger((n) => n + 1)}>
            + Add Category
          </Button>
        </div>
      </div>

      <CategoryGrid className="mt-3 min-h-0 flex-1" addTrigger={addTrigger} />

      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg sm:hidden"
        onClick={() => setAddTrigger((n) => n + 1)}
        aria-label="Add category"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}
