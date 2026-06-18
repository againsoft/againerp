"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { RoutingGrid } from "@/components/manufacturing/routing-grid";
import { RoutingFormDialog } from "@/components/manufacturing/routing-form-dialog";
import { RoutingViewDialog } from "@/components/manufacturing/routing-view-dialog";
import { ManufacturingListShell } from "@/components/manufacturing/manufacturing-page-shell";
import { Button } from "@/components/ui/button";
import {
  getRoutingById,
  routingsSeed,
  type ManufacturingRouting,
} from "@/lib/mock-data/manufacturing-routings";
import { useManufacturingRoutingStore } from "@/lib/store/manufacturing-routing-store";

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/manufacturing/routings?${query}` : "/manufacturing/routings";
}

function RoutingListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeRoutings = useManufacturingRoutingStore((s) => s.routings);

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");

  const resolveRouting = (id: string | null) => {
    if (!id) return null;
    return storeRoutings.find((r) => r.id === id) ?? getRoutingById(id) ?? null;
  };

  const editRouting = useMemo(() => resolveRouting(editId), [editId, storeRoutings]);
  const viewRouting = useMemo(() => resolveRouting(viewId), [viewId, storeRoutings]);

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

  const handleEdit = (routing: ManufacturingRouting) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("view");
      params.set("edit", routing.id);
    });
  };

  const handleView = (routing: ManufacturingRouting) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
      params.set("view", routing.id);
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

  const handleSaved = (routing: ManufacturingRouting) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
      params.set("view", routing.id);
    });
  };

  useEffect(() => {
    if (editId && !editRouting) {
      toast.error("Routing not found");
      closeForm();
    }
  }, [editId, editRouting]);

  useEffect(() => {
    if (viewId && !viewRouting && !editId && !createOpen) {
      toast.error("Routing not found");
      closeView();
    }
  }, [viewId, viewRouting, editId, createOpen]);

  const count = storeRoutings.length || routingsSeed.length;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{count} routings</p>
        <Button size="sm" className="h-8" onClick={openCreate}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> New routing
        </Button>
      </div>

      <RoutingGrid className="min-h-0 flex-1" onView={handleView} onEdit={handleEdit} />

      <RoutingViewDialog
        open={!!viewRouting && !createOpen && !editRouting}
        onOpenChange={(open) => {
          if (!open) closeView();
        }}
        routing={viewRouting}
        onEdit={handleEdit}
      />

      <RoutingFormDialog
        open={createOpen || !!editRouting}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
        mode={createOpen ? "create" : "edit"}
        routing={editRouting}
        onSaved={handleSaved}
      />
    </>
  );
}

export default function RoutingsPage() {
  return (
    <ManufacturingListShell
      title="Routings"
      subtitle="Operation sequences per product — work center steps, setup and run times. View and edit in drawer."
    >
      <Suspense
        fallback={
          <p className="flex flex-1 items-center text-sm text-muted-foreground">Loading routings…</p>
        }
      >
        <RoutingListContent />
      </Suspense>
    </ManufacturingListShell>
  );
}
