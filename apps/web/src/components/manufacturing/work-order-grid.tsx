"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Eye, MoreHorizontal, Pencil } from "lucide-react";
import {
  WORK_ORDER_PRIORITY_LABELS,
  WORK_ORDER_STATUS_LABELS,
  workOrdersSeed,
  type WorkOrder,
  type WorkOrderPriority,
  type WorkOrderStatus,
} from "@/lib/mock-data/manufacturing-work-orders";
import {
  useManufacturingWorkOrderStore,
  workOrderPriorityBadgeVariant,
  workOrderStatusBadgeVariant,
} from "@/lib/store/manufacturing-work-order-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActivityTriggerButton } from "@/components/activity/activity-trigger-button";
import { ManufacturingAgGrid } from "@/components/manufacturing/manufacturing-ag-grid";

const PAGE_SIZE = 25;
const STATUSES = Object.keys(WORK_ORDER_STATUS_LABELS) as WorkOrderStatus[];

type FilterState = { search: string; status: string; warehouse: string };

type Props = {
  className?: string;
  initialStatus?: string;
  onView: (wo: WorkOrder) => void;
  onEdit: (wo: WorkOrder) => void;
};

export function WorkOrderGrid({ className, initialStatus = "all", onView, onEdit }: Props) {
  const storeWorkOrders = useManufacturingWorkOrderStore((s) => s.workOrders);
  const workOrders = storeWorkOrders.length > 0 ? storeWorkOrders : workOrdersSeed;
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: initialStatus,
    warehouse: "all",
  });

  const rows = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    return workOrders.filter((wo) => {
      if (filters.status !== "all" && wo.status !== filters.status) return false;
      if (filters.warehouse !== "all" && wo.warehouse !== filters.warehouse) return false;
      if (
        q &&
        !wo.number.toLowerCase().includes(q) &&
        !wo.productName.toLowerCase().includes(q) &&
        !wo.productSku.toLowerCase().includes(q) &&
        !wo.bomNumber.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [workOrders, filters]);

  const warehouses = useMemo(
    () => [...new Set(workOrders.map((wo) => wo.warehouse))].sort(),
    [workOrders],
  );

  const StatusCell = useCallback((p: ICellRendererParams<WorkOrder>) => {
    if (!p.data) return null;
    return (
      <Badge variant={workOrderStatusBadgeVariant(p.data.status)} className="text-[10px]">
        {WORK_ORDER_STATUS_LABELS[p.data.status]}
      </Badge>
    );
  }, []);

  const PriorityCell = useCallback((p: ICellRendererParams<WorkOrder>) => {
    if (!p.data) return null;
    return (
      <Badge variant={workOrderPriorityBadgeVariant(p.data.priority)} className="text-[10px]">
        {WORK_ORDER_PRIORITY_LABELS[p.data.priority]}
      </Badge>
    );
  }, []);

  const columnDefs = useMemo<ColDef<WorkOrder>[]>(
    () => [
      {
        field: "number",
        headerName: "WO #",
        width: 130,
        pinned: "left",
        cellRenderer: (p: ICellRendererParams<WorkOrder>) =>
          p.data ? (
            <button
              type="button"
              className="font-semibold text-primary hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onView(p.data!);
              }}
            >
              {p.data.number}
            </button>
          ) : null,
      },
      {
        field: "productName",
        headerName: "Product",
        width: 200,
        cellRenderer: (p: ICellRendererParams<WorkOrder>) =>
          p.data ? (
            <div>
              <p className="font-medium">{p.data.productName}</p>
              <p className="text-[10px] text-muted-foreground">{p.data.productSku}</p>
            </div>
          ) : null,
      },
      {
        field: "bomNumber",
        headerName: "BOM",
        width: 120,
      },
      {
        field: "quantity",
        headerName: "Qty",
        width: 80,
        valueFormatter: (p) => {
          const wo = p.data;
          if (!wo) return "";
          return `${wo.quantityProduced}/${wo.quantity}`;
        },
      },
      { field: "warehouse", headerName: "WH", width: 90 },
      { field: "plannedStart", headerName: "Start", width: 110 },
      { field: "plannedEnd", headerName: "End", width: 110 },
      {
        field: "priority",
        headerName: "Priority",
        width: 90,
        cellRenderer: PriorityCell,
      },
      {
        field: "status",
        headerName: "Status",
        width: 110,
        cellRenderer: StatusCell,
      },
      {
        colId: "actions",
        headerName: "",
        width: 72,
        maxWidth: 72,
        pinned: "right",
        sortable: false,
        cellRenderer: (p: ICellRendererParams<WorkOrder>) => {
          if (!p.data) return null;
          return (
            <div className="flex items-center justify-center gap-0">
              <ActivityTriggerButton
                entity={{
                  type: "manufacturing_work_order",
                  id: p.data.id,
                  label: p.data.number,
                  subtitle: p.data.productName,
                }}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(p.data!)}>
                    <Eye className="mr-2 h-3.5 w-3.5" /> View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(p.data!)}>
                    <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [PriorityCell, StatusCell, onEdit, onView],
  );

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search WO #, product, BOM…"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="h-8 max-w-[240px] text-xs"
        />
        <Select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="h-8 w-36 text-xs"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {WORK_ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
        <Select
          value={filters.warehouse}
          onChange={(e) => setFilters((f) => ({ ...f, warehouse: e.target.value }))}
          className="h-8 w-28 text-xs"
        >
          <option value="all">All WH</option>
          {warehouses.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </Select>
      </div>

      <ManufacturingAgGrid
        rowData={rows}
        columnDefs={columnDefs}
        onRowClicked={(e) => {
          if (e.data) onView(e.data);
        }}
        pagination
        paginationPageSize={PAGE_SIZE}
      />

      <p className="text-xs text-muted-foreground">
        Showing {rows.length} of {workOrders.length} work orders · Click row to open drawer
      </p>
    </div>
  );
}
