"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Eye, MoreHorizontal, Play } from "lucide-react";
import {
  MRP_RUN_STATUS_LABELS,
  mrpRunsSeed,
  type MrpRun,
  type MrpRunStatus,
} from "@/lib/mock-data/manufacturing-mrp";
import {
  mrpRunStatusBadgeVariant,
  useManufacturingMrpStore,
} from "@/lib/store/manufacturing-mrp-store";
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
import { ManufacturingAgGrid } from "@/components/manufacturing/manufacturing-ag-grid";

const PAGE_SIZE = 25;
const STATUSES = Object.keys(MRP_RUN_STATUS_LABELS) as MrpRunStatus[];

type FilterState = { search: string; status: string; warehouse: string };

type Props = {
  className?: string;
  onView: (run: MrpRun) => void;
};

export function MrpGrid({ className, onView }: Props) {
  const storeRuns = useManufacturingMrpStore((s) => s.runs);
  const runs = storeRuns.length > 0 ? storeRuns : mrpRunsSeed;
  const runMrp = useManufacturingMrpStore((s) => s.runMrp);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    warehouse: "all",
  });

  const rows = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    return runs.filter((r) => {
      if (filters.status !== "all" && r.status !== filters.status) return false;
      if (filters.warehouse !== "all" && r.warehouse !== filters.warehouse) return false;
      if (q && !r.number.toLowerCase().includes(q) && !r.notes?.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [runs, filters]);

  const warehouses = useMemo(
    () => [...new Set(runs.map((r) => r.warehouse))].sort(),
    [runs],
  );

  const StatusCell = useCallback((p: ICellRendererParams<MrpRun>) => {
    if (!p.data) return null;
    return (
      <Badge variant={mrpRunStatusBadgeVariant(p.data.status)} className="text-[10px]">
        {MRP_RUN_STATUS_LABELS[p.data.status]}
      </Badge>
    );
  }, []);

  const columnDefs = useMemo<ColDef<MrpRun>[]>(
    () => [
      {
        field: "number",
        headerName: "Run #",
        width: 140,
        pinned: "left",
        cellRenderer: (p: ICellRendererParams<MrpRun>) =>
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
      { field: "runDate", headerName: "Run date", width: 110 },
      { field: "warehouse", headerName: "WH", width: 90 },
      {
        field: "horizonDays",
        headerName: "Horizon",
        width: 90,
        valueFormatter: (p) => (p.value ? `${p.value}d` : ""),
      },
      {
        field: "workOrdersProposed",
        headerName: "WO prop.",
        width: 90,
      },
      {
        field: "purchaseRequestsProposed",
        headerName: "PR prop.",
        width: 90,
      },
      {
        field: "shortagesFound",
        headerName: "Shortages",
        width: 95,
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
        width: 56,
        maxWidth: 56,
        pinned: "right",
        sortable: false,
        cellRenderer: (p: ICellRendererParams<MrpRun>) => {
          if (!p.data) return null;
          const canRun = p.data.status === "draft" || p.data.status === "failed";
          return (
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
                {canRun && (
                  <DropdownMenuItem onClick={() => runMrp(p.data!.id)}>
                    <Play className="mr-2 h-3.5 w-3.5" /> Run MRP
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [StatusCell, onView, runMrp],
  );

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search run #, notes…"
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
              {MRP_RUN_STATUS_LABELS[s]}
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
        Showing {rows.length} of {runs.length} MRP runs · Click row to open drawer
      </p>
    </div>
  );
}
