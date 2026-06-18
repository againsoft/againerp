"use client";

import type { SmwCampaign } from "@/lib/mock-data/smw-campaigns";
import {
  CAMPAIGN_CHANNEL_LABELS,
  CAMPAIGN_STATUS_LABELS,
  budgetUtilization,
  campaignStatusToEnterprise,
  formatCampaignCurrency,
} from "@/lib/mock-data/smw-campaigns";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type PaginationState, type SortingState } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pause, Pencil, Play } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  data: SmwCampaign[];
  onView: (c: SmwCampaign) => void;
  onEdit: (c: SmwCampaign) => void;
  onStatusChange?: (id: string, status: SmwCampaign["status"]) => void;
};

export function CampaignTable({ data, onView, onEdit, onStatusChange }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "roiPct", desc: true }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 });

  const columns = useMemo<ColumnDef<SmwCampaign>[]>(
    () => [
      {
        id: "name",
        header: "Campaign",
        cell: ({ row }) => (
          <div className="min-w-[160px]">
            <p className="text-sm font-medium">{row.original.name}</p>
            <p className="font-mono text-[10px] text-muted-foreground">{row.original.campaignNumber}</p>
          </div>
        ),
      },
      {
        id: "channel",
        accessorKey: "channel",
        header: "Channel",
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-[10px] font-normal">
            {CAMPAIGN_CHANNEL_LABELS[row.original.channel]}
          </Badge>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <EnterpriseStatusBadge
            status={campaignStatusToEnterprise(row.original.status)}
            label={CAMPAIGN_STATUS_LABELS[row.original.status]}
            size="sm"
          />
        ),
      },
      {
        id: "budget",
        header: "Budget / Spent",
        cell: ({ row }) => {
          const util = budgetUtilization(row.original);
          return (
            <div className="min-w-[100px]">
              <p className="text-xs tabular-nums">
                {formatCampaignCurrency(row.original.spent)} / {formatCampaignCurrency(row.original.budget)}
              </p>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", util >= 90 ? "bg-amber-500" : "bg-violet-500")}
                  style={{ width: `${util}%` }}
                />
              </div>
            </div>
          );
        },
      },
      {
        id: "leadsGenerated",
        accessorKey: "leadsGenerated",
        header: "Leads",
        cell: ({ row }) => <span className="tabular-nums text-xs">{row.original.leadsGenerated}</span>,
      },
      {
        id: "roiPct",
        accessorKey: "roiPct",
        header: "ROI",
        cell: ({ row }) => (
          <span className={cn("tabular-nums text-xs font-medium", row.original.roiPct >= 200 && "text-emerald-600")}>
            {row.original.roiPct > 0 ? `${row.original.roiPct}%` : "—"}
          </span>
        ),
      },
      { id: "ownerName", accessorKey: "ownerName", header: "Owner" },
      {
        id: "dates",
        header: "Period",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-[11px] tabular-nums text-muted-foreground">
            {row.original.startDate} → {row.original.endDate}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="Actions" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(row.original)}>
                <Eye className="mr-2 h-3.5 w-3.5" aria-hidden /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Pencil className="mr-2 h-3.5 w-3.5" aria-hidden /> Edit
              </DropdownMenuItem>
              {row.original.status === "active" && onStatusChange && (
                <DropdownMenuItem onClick={() => onStatusChange(row.original.id, "paused")}>
                  <Pause className="mr-2 h-3.5 w-3.5" aria-hidden /> Pause
                </DropdownMenuItem>
              )}
              {row.original.status === "paused" && onStatusChange && (
                <DropdownMenuItem onClick={() => onStatusChange(row.original.id, "active")}>
                  <Play className="mr-2 h-3.5 w-3.5" aria-hidden /> Resume
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onEdit, onStatusChange, onView],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
  });

  return (
    <div className="overflow-auto rounded-lg border border-input">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id} className="h-9 text-xs">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-muted-foreground">
                No campaigns match your filters.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="cursor-pointer" onClick={() => onView(row.original)}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-2 text-xs">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
