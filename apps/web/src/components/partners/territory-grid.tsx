"use client";

import { useMemo, useState } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { PARTNER_ROLE_LABELS } from "@/lib/mock-data/business-partners";
import {
  partnerTerritoriesSeed,
  type PartnerTerritoryAssignment,
} from "@/lib/mock-data/business-partner-territories";
import {
  useBusinessPartnerTerritoryStore,
} from "@/lib/store/business-partner-territory-store";
import { partnerRoleBadgeVariant } from "@/lib/store/business-partner-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PartnersAgGrid } from "@/components/partners/partners-ag-grid";

const PAGE_SIZE = 25;

type Props = {
  className?: string;
  initialRegion?: string;
  onView: (row: PartnerTerritoryAssignment) => void;
};

export function TerritoryGrid({ className, initialRegion = "all", onView }: Props) {
  const storeRows = useBusinessPartnerTerritoryStore((s) => s.territories);
  const removeTerritory = useBusinessPartnerTerritoryStore((s) => s.removeTerritory);
  const rows = storeRows.length > 0 ? storeRows : partnerTerritoriesSeed;
  const [regionFilter, setRegionFilter] = useState(initialRegion);

  const regions = useMemo(() => {
    const set = new Set(rows.map((r) => r.region));
    return [...set].sort();
  }, [rows]);

  const filtered = useMemo(() => {
    if (regionFilter === "all") return rows;
    return rows.filter((r) => r.region === regionFilter);
  }, [rows, regionFilter]);

  const columnDefs = useMemo<ColDef<PartnerTerritoryAssignment>[]>(
    () => [
      {
        field: "partnerName",
        headerName: "Partner",
        flex: 1,
        minWidth: 160,
        cellRenderer: (p: ICellRendererParams<PartnerTerritoryAssignment>) => {
          if (!p.data) return null;
          return (
            <button
              type="button"
              className="text-left text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onView(p.data!);
              }}
            >
              <p className="font-medium text-primary hover:underline">{p.data.partnerName}</p>
              <p className="font-mono text-[10px] text-muted-foreground">{p.data.partnerCode}</p>
            </button>
          );
        },
      },
      {
        field: "role",
        headerName: "Role",
        width: 110,
        cellRenderer: (p: ICellRendererParams<PartnerTerritoryAssignment>) => {
          if (!p.data) return null;
          return (
            <Badge variant={partnerRoleBadgeVariant(p.data.role)} className="text-[10px]">
              {PARTNER_ROLE_LABELS[p.data.role]}
            </Badge>
          );
        },
      },
      { field: "country", headerName: "Country", width: 100 },
      { field: "region", headerName: "Region", width: 110 },
      { field: "district", headerName: "District", width: 100, valueFormatter: (p) => (p.value as string) || "—" },
      {
        field: "isExclusive",
        headerName: "Exclusive",
        width: 90,
        cellRenderer: (p: ICellRendererParams<PartnerTerritoryAssignment>) => {
          if (!p.data) return null;
          return p.data.isExclusive ? (
            <Badge variant="warning" className="text-[9px]">
              Exclusive
            </Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
      },
      {
        colId: "actions",
        headerName: "",
        width: 56,
        pinned: "right",
        sortable: false,
        cellRenderer: (p: ICellRendererParams<PartnerTerritoryAssignment>) => {
          if (!p.data) return null;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(p.data!)}>
                  <Eye className="mr-2 h-3.5 w-3.5" /> View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => removeTerritory(p.data!.id)}>
                  <Trash2 className="mr-2 h-3.5 w-3.5" /> Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [onView, removeTerritory],
  );

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-2", className)}>
      <div className="flex flex-wrap gap-1 overflow-x-auto">
        {["all", ...regions].map((region) => (
          <button
            key={region}
            type="button"
            onClick={() => setRegionFilter(region)}
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors",
              regionFilter === region
                ? "border-violet-500 bg-violet-50 text-violet-800 dark:bg-violet-950/40 dark:text-violet-200"
                : "border-input text-muted-foreground hover:bg-muted/60",
            )}
          >
            {region === "all" ? "All regions" : region}
          </button>
        ))}
      </div>

      <PartnersAgGrid<PartnerTerritoryAssignment>
        rowData={filtered}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={PAGE_SIZE}
        onRowClicked={(e) => {
          if (e.data) onView(e.data);
        }}
        rowClass="cursor-pointer"
      />
    </div>
  );
}
