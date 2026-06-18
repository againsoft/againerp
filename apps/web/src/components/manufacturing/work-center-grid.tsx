"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Eye, MoreHorizontal, Pencil, Wrench } from "lucide-react";
import {
  WORK_CENTER_STATUS_LABELS,
  WORK_CENTER_TYPE_LABELS,
  workCentersSeed,
  type WorkCenter,
  type WorkCenterStatus,
} from "@/lib/mock-data/manufacturing-work-centers";
import {
  useManufacturingWorkCenterStore,
  workCenterStatusBadgeVariant,
  workCenterTypeBadgeVariant,
} from "@/lib/store/manufacturing-work-center-store";
import { cn, formatCurrency } from "@/lib/utils";
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
const STATUSES = Object.keys(WORK_CENTER_STATUS_LABELS) as WorkCenterStatus[];

type FilterState = { search: string; status: string; warehouse: string };

type Props = {
  className?: string;
  onView: (wc: WorkCenter) => void;
  onEdit: (wc: WorkCenter) => void;
};

export function WorkCenterGrid({ className, onView, onEdit }: Props) {
  const storeCenters = useManufacturingWorkCenterStore((s) => s.workCenters);
  const workCenters = storeCenters.length > 0 ? storeCenters : workCentersSeed;
  const setMaintenance = useManufacturingWorkCenterStore((s) => s.setMaintenance);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    warehouse: "all",
  });

  const rows = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    return workCenters.filter((wc) => {
      if (filters.status !== "all" && wc.status !== filters.status) return false;
      if (filters.warehouse !== "all" && wc.warehouse !== filters.warehouse) return false;
      if (
        q &&
        !wc.code.toLowerCase().includes(q) &&
        !wc.name.toLowerCase().includes(q) &&
        !wc.warehouse.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [workCenters, filters]);

  const warehouses = useMemo(
    () => [...new Set(workCenters.map((wc) => wc.warehouse))].sort(),
    [workCenters],
  );

  const StatusCell = useCallback((p: ICellRendererParams<WorkCenter>) => {
    if (!p.data) return null;
    return (
      <Badge variant={workCenterStatusBadgeVariant(p.data.status)} className="text-[10px]">
        {WORK_CENTER_STATUS_LABELS[p.data.status]}
      </Badge>
    );
  }, []);

  const TypeCell = useCallback((p: ICellRendererParams<WorkCenter>) => {
    if (!p.data) return null;
    return (
      <Badge variant={workCenterTypeBadgeVariant(p.data.type)} className="text-[10px]">
        {WORK_CENTER_TYPE_LABELS[p.data.type]}
      </Badge>
    );
  }, []);

  const columnDefs = useMemo<ColDef<WorkCenter>[]>(
    () => [
      {
        field: "code",
        headerName: "Code",
        width: 120,
        pinned: "left",
        cellRenderer: (p: ICellRendererParams<WorkCenter>) =>
          p.data ? (
            <button
              type="button"
              className="font-semibold text-primary hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onView(p.data!);
              }}
            >
              {p.data.code}
            </button>
          ) : null,
      },
      { field: "name", headerName: "Name", width: 180 },
      { field: "warehouse", headerName: "WH", width: 90 },
      {
        field: "type",
        headerName: "Type",
        width: 110,
        cellRenderer: TypeCell,
      },
      {
        field: "capacityHoursPerDay",
        headerName: "Hrs/day",
        width: 90,
      },
      {
        field: "costRatePerHour",
        headerName: "Cost/hr",
        width: 100,
        valueFormatter: (p) => formatCurrency(p.value ?? 0),
      },
      {
        field: "utilizationPct",
        headerName: "Util %",
        width: 80,
        valueFormatter: (p) => `${p.value ?? 0}%`,
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
        cellRenderer: (p: ICellRendererParams<WorkCenter>) => {
          if (!p.data) return null;
          return (
            <div className="flex items-center justify-center gap-0">
              <ActivityTriggerButton
                entity={{
                  type: "manufacturing_work_center",
                  id: p.data.id,
                  label: p.data.code,
                  subtitle: p.data.name,
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
                  {p.data!.status === "active" && (
                    <DropdownMenuItem onClick={() => setMaintenance(p.data!.id)}>
                      <Wrench className="mr-2 h-3.5 w-3.5" /> Set maintenance
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [StatusCell, TypeCell, onEdit, onView, setMaintenance],
  );

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search code, name, warehouse…"
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
              {WORK_CENTER_STATUS_LABELS[s]}
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
        Showing {rows.length} of {workCenters.length} work centers · Click row to open drawer
      </p>
    </div>
  );
}
