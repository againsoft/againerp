"use client";

import type { SmwTeamMember } from "@/lib/mock-data/smw-teams";
import {
  MEMBER_STATUS_LABELS,
  TEAM_MEMBER_ROLE_LABELS,
  formatTeamCurrency,
  teamQuotaPct,
} from "@/lib/mock-data/smw-teams";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Eye } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  data: SmwTeamMember[];
  onView: (m: SmwTeamMember) => void;
};

export function TeamMemberTable({ data, onView }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "quotaAchieved", desc: true }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 });

  const columns = useMemo<ColumnDef<SmwTeamMember>[]>(
    () => [
      {
        id: "name",
        header: "Rep",
        cell: ({ row }) => (
          <div className="min-w-[140px]">
            <p className="text-sm font-medium">{row.original.name}</p>
            <p className="text-[10px] text-muted-foreground">{row.original.email}</p>
          </div>
        ),
      },
      {
        id: "role",
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-[10px] font-normal">
            {TEAM_MEMBER_ROLE_LABELS[row.original.role]}
          </Badge>
        ),
      },
      { id: "teamName", accessorKey: "teamName", header: "Team" },
      { id: "territoryName", accessorKey: "territoryName", header: "Territory" },
      {
        id: "quota",
        header: "Quota",
        cell: ({ row }) => {
          const pct = teamQuotaPct(row.original);
          return (
            <div className="min-w-[100px]">
              <p className="text-xs tabular-nums">{formatTeamCurrency(row.original.quotaAchieved)} / {formatTeamCurrency(row.original.quotaTarget)}</p>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full bg-violet-500")} style={{ width: `${Math.min(100, pct)}%` }} />
              </div>
            </div>
          );
        },
      },
      {
        id: "quotaAchieved",
        accessorFn: (row) => teamQuotaPct(row),
        header: "%",
        cell: ({ row }) => <span className="tabular-nums text-xs font-medium">{teamQuotaPct(row.original)}%</span>,
      },
      {
        id: "pipeline",
        header: "Pipeline",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {row.original.activeLeads} leads · {row.original.openOpportunities} opps
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <EnterpriseStatusBadge
            status={row.original.status === "active" ? "active" : row.original.status === "on_leave" ? "pending" : "inactive"}
            label={MEMBER_STATUS_LABELS[row.original.status]}
            size="sm"
          />
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="View rep" onClick={(e) => { e.stopPropagation(); onView(row.original); }}>
            <Eye className="h-4 w-4" aria-hidden />
          </Button>
        ),
      },
    ],
    [onView],
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
                No team members match your filters.
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
