"use client";

import type { SmwLead } from "@/lib/mock-data/smw-leads";
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  formatLeadCurrency,
  leadInitials,
  leadScoreColor,
  leadStatusToEnterprise,
} from "@/lib/mock-data/smw-leads";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarCheck,
  Eye,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

type Props = {
  data: SmwLead[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  onView: (lead: SmwLead) => void;
  onEdit: (lead: SmwLead) => void;
  className?: string;
};

function SortHeader({ label, sorted }: { label: string; sorted: false | "asc" | "desc" }) {
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;
  return (
    <span className="inline-flex items-center gap-1">
      {label}
      <Icon className="h-3 w-3 opacity-50" aria-hidden />
    </span>
  );
}

export function getSelectedLeads(data: SmwLead[], rowSelection: RowSelectionState): SmwLead[] {
  return data.filter((row) => rowSelection[row.id]);
}

export function LeadTable({
  data,
  sorting,
  onSortingChange,
  rowSelection,
  onRowSelectionChange,
  pagination,
  onPaginationChange,
  onView,
  onEdit,
  className,
}: Props) {
  const columns = useMemo<ColumnDef<SmwLead>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input"
            checked={table.getIsAllPageRowsSelected()}
            ref={(el) => {
              if (el) el.indeterminate = table.getIsSomePageRowsSelected();
            }}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            aria-label="Select all on page"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select ${row.original.name}`}
          />
        ),
        enableSorting: false,
        size: 44,
      },
      {
        id: "leadNumber",
        accessorKey: "leadNumber",
        header: ({ column }) => (
          <button type="button" className="font-medium" onClick={() => column.toggleSorting()}>
            <SortHeader label="Lead #" sorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <Link
            href={`/sales-marketing/leads/${row.original.id}`}
            className="font-mono text-xs font-medium text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.leadNumber}
          </Link>
        ),
      },
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <button type="button" className="font-medium" onClick={() => column.toggleSorting()}>
            <SortHeader label="Name / Company" sorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <div className="min-w-[140px]">
            <p className="text-sm font-medium">{row.original.name}</p>
            <p className="text-[11px] text-muted-foreground">{row.original.company}</p>
          </div>
        ),
      },
      {
        id: "source",
        accessorKey: "source",
        header: "Source",
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-[10px] font-normal">
            {LEAD_SOURCE_LABELS[row.original.source]}
          </Badge>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <EnterpriseStatusBadge
            status={leadStatusToEnterprise(row.original.status)}
            label={LEAD_STATUS_LABELS[row.original.status]}
            size="sm"
          />
        ),
      },
      {
        id: "score",
        accessorKey: "score",
        header: ({ column }) => (
          <button type="button" className="font-medium" onClick={() => column.toggleSorting()}>
            <SortHeader label="Score" sorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex min-w-[72px] items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full", leadScoreColor(row.original.score))}
                style={{ width: `${row.original.score}%` }}
              />
            </div>
            <span className="text-xs tabular-nums">{row.original.score}</span>
          </div>
        ),
      },
      {
        id: "owner",
        accessorKey: "ownerName",
        header: "Owner",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[9px] font-semibold text-violet-800 dark:bg-violet-950 dark:text-violet-200"
              aria-hidden
            >
              {leadInitials(row.original.ownerName)}
            </div>
            <span className="hidden text-xs lg:inline">{row.original.ownerName}</span>
          </div>
        ),
      },
      {
        id: "expectedValue",
        accessorKey: "expectedValue",
        header: ({ column }) => (
          <button type="button" className="font-medium" onClick={() => column.toggleSorting()}>
            <SortHeader label="Expected" sorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <span className="text-xs tabular-nums">{formatLeadCurrency(row.original.expectedValue)}</span>
        ),
      },
      {
        id: "lastActivity",
        accessorKey: "lastActivityRelative",
        header: "Last activity",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">{row.original.lastActivityRelative}</span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-0.5" onClick={(e) => e.stopPropagation()}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Log activity"
              onClick={() => onView(row.original)}
            >
              <CalendarCheck className="h-3.5 w-3.5" aria-hidden />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="Actions">
                  <MoreHorizontal className="h-4 w-4" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(row.original)}>
                  <Eye className="mr-2 h-3.5 w-3.5" aria-hidden />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(row.original)}>
                  <Pencil className="mr-2 h-3.5 w-3.5" aria-hidden />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/sales-marketing/leads/${row.original.id}`}>Open full profile</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [onEdit, onView],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection, pagination },
    onSortingChange,
    onRowSelectionChange,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: true,
  });

  return (
    <div className={cn("hidden min-h-0 flex-col md:flex", className)}>
      <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-input">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="h-9 text-xs">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-muted-foreground">
                  No leads match your filters.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  onClick={() => onView(row.original)}
                >
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
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </span>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
