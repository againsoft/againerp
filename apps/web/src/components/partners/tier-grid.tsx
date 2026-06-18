"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Eye, MoreHorizontal, Pencil } from "lucide-react";
import {
  TIER_TYPE_LABELS,
  partnerTiersSeed,
  type PartnerTierDefinition,
  type TierType,
} from "@/lib/mock-data/business-partner-tiers";
import { useBusinessPartnerStore } from "@/lib/store/business-partner-store";
import {
  tierTypeBadgeVariant,
  useBusinessPartnerTierStore,
} from "@/lib/store/business-partner-tier-store";
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
const TIER_TYPES = Object.keys(TIER_TYPE_LABELS) as TierType[];

type Props = {
  className?: string;
  initialType?: string;
  onView: (tier: PartnerTierDefinition) => void;
  onEdit: (tier: PartnerTierDefinition) => void;
};

export function TierGrid({ className, initialType = "all", onView, onEdit }: Props) {
  const storeTiers = useBusinessPartnerTierStore((s) => s.tiers);
  const deactivateTier = useBusinessPartnerTierStore((s) => s.deactivateTier);
  const partners = useBusinessPartnerStore((s) => s.partners);
  const tiers = storeTiers.length > 0 ? storeTiers : partnerTiersSeed;
  const [typeFilter, setTypeFilter] = useState(initialType);

  const partnerCountByCode = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of partners) {
      if (!p.tierCode) continue;
      counts.set(p.tierCode, (counts.get(p.tierCode) ?? 0) + 1);
    }
    return counts;
  }, [partners]);

  const rows = useMemo(() => {
    if (typeFilter === "all") return tiers;
    return tiers.filter((t) => t.tierType === typeFilter);
  }, [tiers, typeFilter]);

  const TypeCell = useCallback((p: ICellRendererParams<PartnerTierDefinition>) => {
    if (!p.data) return null;
    return (
      <Badge variant={tierTypeBadgeVariant(p.data.tierType)} className="text-[10px] capitalize">
        {TIER_TYPE_LABELS[p.data.tierType]}
      </Badge>
    );
  }, []);

  const columnDefs = useMemo<ColDef<PartnerTierDefinition>[]>(
    () => [
      {
        field: "code",
        headerName: "Code",
        width: 130,
        pinned: "left",
        cellRenderer: (p: ICellRendererParams<PartnerTierDefinition>) => {
          if (!p.data) return null;
          return (
            <button
              type="button"
              className="font-mono text-xs font-medium text-primary hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onView(p.data!);
              }}
            >
              {p.data.code}
            </button>
          );
        },
      },
      { field: "name", headerName: "Name", flex: 1, minWidth: 160 },
      {
        field: "tierType",
        headerName: "Type",
        width: 110,
        cellRenderer: TypeCell,
      },
      {
        field: "discountPercent",
        headerName: "Discount",
        width: 90,
        valueFormatter: (p) => `${p.value ?? 0}%`,
      },
      {
        field: "priceListName",
        headerName: "Price list",
        width: 150,
        cellClass: "font-mono text-xs",
      },
      {
        colId: "partners",
        headerName: "Partners",
        width: 90,
        valueGetter: (p) =>
          p.data ? (partnerCountByCode.get(p.data.code) ?? 0) : 0,
        cellClass: "text-center",
      },
      {
        field: "active",
        headerName: "Status",
        width: 90,
        cellRenderer: (p: ICellRendererParams<PartnerTierDefinition>) => {
          if (!p.data) return null;
          return (
            <Badge variant={p.data.active ? "success" : "muted"} className="text-[10px]">
              {p.data.active ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
      {
        colId: "actions",
        headerName: "",
        width: 56,
        pinned: "right",
        sortable: false,
        cellRenderer: (p: ICellRendererParams<PartnerTierDefinition>) => {
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
                <DropdownMenuItem onClick={() => onEdit(p.data!)}>
                  <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                </DropdownMenuItem>
                {p.data.active && (
                  <DropdownMenuItem onClick={() => deactivateTier(p.data!.id)}>
                    Deactivate
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [TypeCell, deactivateTier, onEdit, onView, partnerCountByCode],
  );

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-2", className)}>
      <div className="flex flex-wrap gap-1 overflow-x-auto">
        {["all", ...TIER_TYPES].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setTypeFilter(type)}
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors",
              typeFilter === type
                ? "border-violet-500 bg-violet-50 text-violet-800 dark:bg-violet-950/40 dark:text-violet-200"
                : "border-input text-muted-foreground hover:bg-muted/60",
            )}
          >
            {type === "all" ? "All" : TIER_TYPE_LABELS[type as TierType]}
          </button>
        ))}
      </div>

      <PartnersAgGrid<PartnerTierDefinition>
        rowData={rows}
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
