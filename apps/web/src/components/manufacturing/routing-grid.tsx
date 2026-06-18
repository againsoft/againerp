"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Eye, MoreHorizontal, Pencil } from "lucide-react";
import {
  ROUTING_STATUS_LABELS,
  routingsSeed,
  type ManufacturingRouting,
  type RoutingStatus,
} from "@/lib/mock-data/manufacturing-routings";
import {
  routingStatusBadgeVariant,
  useManufacturingRoutingStore,
} from "@/lib/store/manufacturing-routing-store";
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
const STATUSES = Object.keys(ROUTING_STATUS_LABELS) as RoutingStatus[];

type FilterState = { search: string; status: string };

type Props = {
  className?: string;
  onView: (routing: ManufacturingRouting) => void;
  onEdit: (routing: ManufacturingRouting) => void;
};

export function RoutingGrid({ className, onView, onEdit }: Props) {
  const storeRoutings = useManufacturingRoutingStore((s) => s.routings);
  const routings = storeRoutings.length > 0 ? storeRoutings : routingsSeed;
  const activateRouting = useManufacturingRoutingStore((s) => s.activateRouting);
  const [filters, setFilters] = useState<FilterState>({ search: "", status: "all" });

  const rows = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    return routings.filter((r) => {
      if (filters.status !== "all" && r.status !== filters.status) return false;
      if (
        q &&
        !r.number.toLowerCase().includes(q) &&
        !r.productName.toLowerCase().includes(q) &&
        !r.productSku.toLowerCase().includes(q) &&
        !(r.bomNumber ?? "").toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [routings, filters]);

  const StatusCell = useCallback((p: ICellRendererParams<ManufacturingRouting>) => {
    if (!p.data) return null;
    return (
      <Badge variant={routingStatusBadgeVariant(p.data.status)} className="text-[10px]">
        {ROUTING_STATUS_LABELS[p.data.status]}
      </Badge>
    );
  }, []);

  const columnDefs = useMemo<ColDef<ManufacturingRouting>[]>(
    () => [
      {
        field: "number",
        headerName: "Routing #",
        width: 130,
        pinned: "left",
        cellRenderer: (p: ICellRendererParams<ManufacturingRouting>) =>
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
        cellRenderer: (p: ICellRendererParams<ManufacturingRouting>) =>
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
        valueFormatter: (p) => p.value || "—",
      },
      { field: "version", headerName: "Ver.", width: 80 },
      {
        colId: "ops",
        headerName: "Ops",
        width: 70,
        valueGetter: (p) => p.data?.operations.length ?? 0,
      },
      {
        field: "totalDurationMin",
        headerName: "Total min",
        width: 100,
        valueFormatter: (p) => `${p.value ?? 0} min`,
      },
      {
        field: "status",
        headerName: "Status",
        width: 100,
        cellRenderer: StatusCell,
      },
      {
        colId: "actions",
        headerName: "",
        width: 72,
        maxWidth: 72,
        pinned: "right",
        sortable: false,
        cellRenderer: (p: ICellRendererParams<ManufacturingRouting>) => {
          if (!p.data) return null;
          return (
            <div className="flex items-center justify-center gap-0">
              <ActivityTriggerButton
                entity={{
                  type: "manufacturing_routing",
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
                  {p.data!.status === "draft" && (
                    <DropdownMenuItem onClick={() => activateRouting(p.data!.id)}>
                      Activate
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [StatusCell, activateRouting, onEdit, onView],
  );

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search routing #, product, BOM…"
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
              {ROUTING_STATUS_LABELS[s]}
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
        Showing {rows.length} of {routings.length} routings · Click row to open drawer
      </p>
    </div>
  );
}
