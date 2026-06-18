"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { BomGrid } from "@/components/manufacturing/bom-grid";
import { BomFormDialog } from "@/components/manufacturing/bom-form-dialog";
import { BomViewDialog } from "@/components/manufacturing/bom-view-dialog";
import { ManufacturingListShell } from "@/components/manufacturing/manufacturing-page-shell";
import { Button } from "@/components/ui/button";
import {
  bomsSeed,
  getBomById,
  type BillOfMaterials,
} from "@/lib/mock-data/manufacturing-boms";
import { useManufacturingBomStore } from "@/lib/store/manufacturing-bom-store";

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/manufacturing/boms?${query}` : "/manufacturing/boms";
}

function BomListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeBoms = useManufacturingBomStore((s) => s.boms);

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");

  const resolveBom = (id: string | null) => {
    if (!id) return null;
    return storeBoms.find((b) => b.id === id) ?? getBomById(id) ?? null;
  };

  const editBom = useMemo(() => resolveBom(editId), [editId, storeBoms]);
  const viewBom = useMemo(() => resolveBom(viewId), [viewId, storeBoms]);

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(buildUrl(params), { scroll: false });
  };

  const openCreate = () => {
    pushParams((params) => {
      params.delete("edit");
      params.delete("view");
      params.set("create", "1");
    });
  };

  const handleEdit = (bom: BillOfMaterials) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("view");
      params.set("edit", bom.id);
    });
  };

  const handleView = (bom: BillOfMaterials) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
      params.set("view", bom.id);
    });
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

  const handleSaved = (bom: BillOfMaterials) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
      params.set("view", bom.id);
    });
  };

  const handleDuplicated = (bom: BillOfMaterials) => {
    pushParams((params) => {
      params.delete("view");
      params.set("edit", bom.id);
    });
  };

  useEffect(() => {
    if (editId && !editBom) {
      toast.error("BOM not found");
      closeForm();
    }
  }, [editId, editBom]);

  useEffect(() => {
    if (viewId && !viewBom && !editId && !createOpen) {
      toast.error("BOM not found");
      closeView();
    }
  }, [viewId, viewBom, editId, createOpen]);

  const count = storeBoms.length || bomsSeed.length;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{count} bills of materials</p>
        <Button size="sm" className="h-8" onClick={openCreate}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> New BOM
        </Button>
      </div>

      <BomGrid className="min-h-0 flex-1" onView={handleView} onEdit={handleEdit} />

      <BomViewDialog
        open={!!viewBom && !createOpen && !editBom}
        onOpenChange={(open) => {
          if (!open) closeView();
        }}
        bom={viewBom}
        onEdit={handleEdit}
        onDuplicated={handleDuplicated}
      />

      <BomFormDialog
        open={createOpen || !!editBom}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
        mode={createOpen ? "create" : "edit"}
        bom={editBom}
        onSaved={handleSaved}
      />
    </>
  );
}

export default function BomsPage() {
  return (
    <ManufacturingListShell
      title="Bills of Materials"
      subtitle="Component lists per finished product — view, edit, and create in drawer (like catalog products)."
    >
      <Suspense
        fallback={
          <p className="flex flex-1 items-center text-sm text-muted-foreground">Loading BOMs…</p>
        }
      >
        <BomListContent />
      </Suspense>
    </ManufacturingListShell>
  );
}
