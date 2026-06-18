"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Copy, Eye, MoreHorizontal, Pencil } from "lucide-react";
import {
  BOM_TYPE_LABELS,
  bomsSeed,
  type BillOfMaterials,
  type BomType,
} from "@/lib/mock-data/manufacturing-boms";
import {
  bomTypeBadgeVariant,
  useManufacturingBomStore,
} from "@/lib/store/manufacturing-bom-store";
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
const TYPES = Object.keys(BOM_TYPE_LABELS) as BomType[];

type FilterState = { search: string; type: string };

type Props = {
  className?: string;
  onView: (bom: BillOfMaterials) => void;
  onEdit: (bom: BillOfMaterials) => void;
};

export function BomGrid({ className, onView, onEdit }: Props) {
  const storeBoms = useManufacturingBomStore((s) => s.boms);
  const boms = storeBoms.length > 0 ? storeBoms : bomsSeed;
  const duplicateBom = useManufacturingBomStore((s) => s.duplicateBom);
  const [filters, setFilters] = useState<FilterState>({ search: "", type: "all" });

  const rows = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    return boms.filter((b) => {
      if (filters.type !== "all" && b.type !== filters.type) return false;
      if (
        q &&
        !b.number.toLowerCase().includes(q) &&
        !b.productName.toLowerCase().includes(q) &&
        !b.productSku.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [boms, filters]);

  const TypeCell = useCallback((p: ICellRendererParams<BillOfMaterials>) => {
    if (!p.data) return null;
    return (
      <Badge variant={bomTypeBadgeVariant(p.data.type)} className="text-[10px]">
        {BOM_TYPE_LABELS[p.data.type]}
      </Badge>
    );
  }, []);

  const columnDefs = useMemo<ColDef<BillOfMaterials>[]>(
    () => [
      {
        field: "number",
        headerName: "BOM #",
        width: 140,
        pinned: "left",
        cellRenderer: (p: ICellRendererParams<BillOfMaterials>) =>
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
        cellRenderer: (p: ICellRendererParams<BillOfMaterials>) =>
          p.data ? (
            <div>
              <p className="font-medium">{p.data.productName}</p>
              <p className="text-[10px] text-muted-foreground">{p.data.productSku}</p>
            </div>
          ) : null,
      },
      {
        field: "type",
        headerName: "Type",
        width: 120,
        cellRenderer: TypeCell,
      },
      { field: "version", headerName: "Version", width: 90 },
      { field: "effectiveFrom", headerName: "Effective", width: 110 },
      {
        colId: "components",
        headerName: "Components",
        width: 100,
        valueGetter: (p) => p.data?.lines.length ?? 0,
      },
      {
        colId: "actions",
        headerName: "",
        width: 72,
        maxWidth: 72,
        pinned: "right",
        sortable: false,
        cellRenderer: (p: ICellRendererParams<BillOfMaterials>) => {
          if (!p.data) return null;
          return (
            <div className="flex items-center justify-center gap-0">
              <ActivityTriggerButton
                entity={{
                  type: "manufacturing_bom",
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
                  <DropdownMenuItem
                    onClick={() => {
                      const copy = duplicateBom(p.data!.id);
                      if (copy) onEdit(copy);
                    }}
                  >
                    <Copy className="mr-2 h-3.5 w-3.5" /> Duplicate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [TypeCell, duplicateBom, onEdit, onView],
  );

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search BOM #, product, SKU…"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="h-8 max-w-[240px] text-xs"
        />
        <Select
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          className="h-8 w-36 text-xs"
        >
          <option value="all">All types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {BOM_TYPE_LABELS[t]}
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
        Showing {rows.length} of {boms.length} BOMs · Click row to open drawer
      </p>
    </div>
  );
}
