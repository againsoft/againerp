"use client";

import type { SmwTarget } from "@/lib/mock-data/smw-targets";
import {
  TARGET_METRIC_LABELS,
  TARGET_PERIOD_LABELS,
  TARGET_SCOPE_LABELS,
  TARGET_STATUS_LABELS,
  achievementHealth,
  formatTargetValue,
  targetAchievementPct,
  targetStatusToEnterprise,
} from "@/lib/mock-data/smw-targets";
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
  data: SmwTarget[];
  onView: (t: SmwTarget) => void;
  onEdit: (t: SmwTarget) => void;
};

export function TargetTable({ data, onView, onEdit }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "achievement", desc: true }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 });

  const columns = useMemo<ColumnDef<SmwTarget>[]>(
    () => [
      {
        id: "name",
        header: "Target",
        cell: ({ row }) => (
          <div className="min-w-[180px]">
            <p className="text-sm font-medium">{row.original.name}</p>
            <p className="font-mono text-[10px] text-muted-foreground">{row.original.targetNumber}</p>
          </div>
        ),
      },
      {
        id: "metric",
        accessorKey: "metric",
        header: "Metric",
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-[10px] font-normal">
            {TARGET_METRIC_LABELS[row.original.metric]}
          </Badge>
        ),
      },
      {
        id: "scope",
        header: "Scope",
        cell: ({ row }) => (
          <div className="min-w-[120px]">
            <p className="text-xs">{row.original.scopeName}</p>
            <p className="text-[10px] text-muted-foreground">{TARGET_SCOPE_LABELS[row.original.scope]}</p>
          </div>
        ),
      },
      {
        id: "periodLabel",
        accessorKey: "periodLabel",
        header: "Period",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {row.original.periodLabel}
            <span className="ml-1 text-[10px]">({TARGET_PERIOD_LABELS[row.original.period]})</span>
          </span>
        ),
      },
      {
        id: "progress",
        header: "Progress",
        cell: ({ row }) => {
          const pct = targetAchievementPct(row.original);
          const health = achievementHealth(pct);
          return (
            <div className="min-w-[120px]">
              <p className="text-xs tabular-nums">
                {formatTargetValue(row.original.metric, row.original.achievedValue)}
                {" / "}
                {formatTargetValue(row.original.metric, row.original.targetValue)}
              </p>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full",
                    health === "achieved" && "bg-emerald-500",
                    health === "on_track" && "bg-violet-500",
                    health === "at_risk" && "bg-amber-500",
                  )}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          );
        },
      },
      {
        id: "achievement",
        header: "%",
        accessorFn: (row) => targetAchievementPct(row),
        cell: ({ row }) => {
          const pct = targetAchievementPct(row.original);
          return (
            <span
              className={cn(
                "tabular-nums text-xs font-medium",
                pct >= 100 && "text-emerald-600",
                pct < 70 && (row.original.status === "active" || row.original.status === "draft") && "text-amber-600",
              )}
            >
              {pct}%
            </span>
          );
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <EnterpriseStatusBadge
            status={targetStatusToEnterprise(row.original.status)}
            label={TARGET_STATUS_LABELS[row.original.status]}
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
                No targets match your filters.
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
