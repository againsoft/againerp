"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { WorkOrderGrid } from "@/components/manufacturing/work-order-grid";
import { WorkOrderFormDialog } from "@/components/manufacturing/work-order-form-dialog";
import { WorkOrderViewDialog } from "@/components/manufacturing/work-order-view-dialog";
import { ManufacturingListShell } from "@/components/manufacturing/manufacturing-page-shell";
import { Button } from "@/components/ui/button";
import {
  getWorkOrderById,
  workOrdersSeed,
  type WorkOrder,
} from "@/lib/mock-data/manufacturing-work-orders";
import { useManufacturingWorkOrderStore } from "@/lib/store/manufacturing-work-order-store";

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/manufacturing/work-orders?${query}` : "/manufacturing/work-orders";
}

function WorkOrderListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeOrders = useManufacturingWorkOrderStore((s) => s.workOrders);

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");

  const resolveWo = (id: string | null) => {
    if (!id) return null;
    return storeOrders.find((wo) => wo.id === id) ?? getWorkOrderById(id) ?? null;
  };

  const editWorkOrder = useMemo(() => resolveWo(editId), [editId, storeOrders]);
  const viewWorkOrder = useMemo(() => resolveWo(viewId), [viewId, storeOrders]);

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

  const handleEdit = (wo: WorkOrder) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("view");
      params.set("edit", wo.id);
    });
  };

  const handleView = (wo: WorkOrder) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
      params.set("view", wo.id);
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

  const handleSaved = (wo: WorkOrder) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
      params.set("view", wo.id);
    });
  };

  useEffect(() => {
    if (editId && !editWorkOrder) {
      toast.error("Work order not found");
      closeForm();
    }
  }, [editId, editWorkOrder]);

  useEffect(() => {
    if (viewId && !viewWorkOrder && !editId && !createOpen) {
      toast.error("Work order not found");
      closeView();
    }
  }, [viewId, viewWorkOrder, editId, createOpen]);

  const count = storeOrders.length || workOrdersSeed.length;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{count} work orders</p>
        <Button size="sm" className="h-8" onClick={openCreate}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> New work order
        </Button>
      </div>

      <WorkOrderGrid
        className="min-h-0 flex-1"
        onView={handleView}
        onEdit={handleEdit}
      />

      <WorkOrderViewDialog
        open={!!viewWorkOrder && !createOpen && !editWorkOrder}
        onOpenChange={(open) => {
          if (!open) closeView();
        }}
        workOrder={viewWorkOrder}
        onEdit={handleEdit}
      />

      <WorkOrderFormDialog
        open={createOpen || !!editWorkOrder}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
        mode={createOpen ? "create" : "edit"}
        workOrder={editWorkOrder}
        onSaved={handleSaved}
      />
    </>
  );
}

export default function WorkOrdersPage() {
  return (
    <ManufacturingListShell
      title="Work Orders"
      subtitle="Production jobs — planned, released, in progress, and completed. Click a row or use drawers to view and edit."
    >
      <Suspense
        fallback={
          <p className="flex flex-1 items-center text-sm text-muted-foreground">Loading work orders…</p>
        }
      >
        <WorkOrderListContent />
      </Suspense>
    </ManufacturingListShell>
  );
}
