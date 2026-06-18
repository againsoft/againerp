"use client";

import type { SmwActivity } from "@/lib/mock-data/smw-activities";
import {
  ACTIVITY_PRIORITY_LABELS,
  ACTIVITY_STATUS_LABELS,
  ACTIVITY_TYPE_LABELS,
  activityStatusToEnterprise,
} from "@/lib/mock-data/smw-activities";
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
import { CheckCircle2, Eye, MoreHorizontal, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  data: SmwActivity[];
  onView: (a: SmwActivity) => void;
  onEdit: (a: SmwActivity) => void;
  onComplete?: (id: string) => void;
};

export function ActivityTable({ data, onView, onEdit, onComplete }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "dueDate", desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 });

  const columns = useMemo<ColumnDef<SmwActivity>[]>(
    () => [
      {
        id: "title",
        header: "Activity",
        cell: ({ row }) => (
          <div className="min-w-[180px]">
            <p className="text-sm font-medium">{row.original.title}</p>
            <p className="font-mono text-[10px] text-muted-foreground">{row.original.activityNumber}</p>
          </div>
        ),
      },
      {
        id: "type",
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-[10px] font-normal">
            {ACTIVITY_TYPE_LABELS[row.original.type]}
          </Badge>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <EnterpriseStatusBadge
            status={activityStatusToEnterprise(row.original.status)}
            label={ACTIVITY_STATUS_LABELS[row.original.status]}
            size="sm"
          />
        ),
      },
      {
        id: "priority",
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => (
          <span
            className={cn(
              "text-xs",
              row.original.priority === "high" && "font-medium text-red-600",
              row.original.priority === "low" && "text-muted-foreground",
            )}
          >
            {ACTIVITY_PRIORITY_LABELS[row.original.priority]}
          </span>
        ),
      },
      {
        id: "dueDate",
        accessorKey: "dueDate",
        header: "Due",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-[11px] tabular-nums text-muted-foreground">
            {row.original.dueDate}
            {row.original.dueTime ? ` ${row.original.dueTime}` : ""}
          </span>
        ),
      },
      {
        id: "relatedName",
        header: "Related",
        cell: ({ row }) => (
          <span className="max-w-[140px] truncate text-xs text-muted-foreground">
            {row.original.relatedName ?? "—"}
          </span>
        ),
      },
      { id: "ownerName", accessorKey: "ownerName", header: "Owner" },
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
              {onComplete && !["completed", "cancelled"].includes(row.original.status) && (
                <DropdownMenuItem onClick={() => onComplete(row.original.id)}>
                  <CheckCircle2 className="mr-2 h-3.5 w-3.5" aria-hidden /> Mark complete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onComplete, onEdit, onView],
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
                No activities match your filters.
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
