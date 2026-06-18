"use client";

import type { SmwTeam } from "@/lib/mock-data/smw-teams";
import {
  TEAM_STATUS_LABELS,
  formatTeamCurrency,
  getMembersByTeam,
  teamQuotaPct,
  teamStatusToEnterprise,
} from "@/lib/mock-data/smw-teams";
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
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  data: SmwTeam[];
  onView: (t: SmwTeam) => void;
  onEdit: (t: SmwTeam) => void;
};

export function TeamTable({ data, onView, onEdit }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "quotaAchieved", desc: true }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 });

  const columns = useMemo<ColumnDef<SmwTeam>[]>(
    () => [
      {
        id: "name",
        header: "Team",
        cell: ({ row }) => (
          <div className="min-w-[160px]">
            <p className="text-sm font-medium">{row.original.name}</p>
            <p className="font-mono text-[10px] text-muted-foreground">{row.original.teamNumber}</p>
          </div>
        ),
      },
      { id: "managerName", accessorKey: "managerName", header: "Manager" },
      {
        id: "members",
        header: "Members",
        cell: ({ row }) => (
          <span className="tabular-nums text-xs">{getMembersByTeam(row.original.id).length}</span>
        ),
      },
      {
        id: "territories",
        header: "Territories",
        cell: ({ row }) => (
          <div className="flex max-w-[180px] flex-wrap gap-1">
            {row.original.territoryNames.map((t) => (
              <Badge key={t} variant="outline" className="text-[10px] font-normal">{t}</Badge>
            ))}
          </div>
        ),
      },
      {
        id: "quota",
        header: "Quota progress",
        cell: ({ row }) => {
          const pct = teamQuotaPct(row.original);
          return (
            <div className="min-w-[120px]">
              <p className="text-xs tabular-nums">
                {formatTeamCurrency(row.original.quotaAchieved)} / {formatTeamCurrency(row.original.quotaTarget)}
              </p>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", pct >= 100 ? "bg-emerald-500" : pct >= 70 ? "bg-violet-500" : "bg-amber-500")}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          );
        },
      },
      {
        id: "quotaAchieved",
        accessorFn: (row) => teamQuotaPct(row),
        header: "%",
        cell: ({ row }) => {
          const pct = teamQuotaPct(row.original);
          return <span className={cn("tabular-nums text-xs font-medium", pct >= 100 && "text-emerald-600")}>{pct}%</span>;
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <EnterpriseStatusBadge
            status={teamStatusToEnterprise(row.original.status)}
            label={TEAM_STATUS_LABELS[row.original.status]}
            size="sm"
          />
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
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onEdit, onView],
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
                No teams match your filters.
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
